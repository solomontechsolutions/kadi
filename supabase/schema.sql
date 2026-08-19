-- Mwaliko schema.
-- Run in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run; every statement is idempotent.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- guestbook (pre-existing)
-- ---------------------------------------------------------------------------
-- site_id scopes rows to one Mwaliko deployment. Only one value is used today
-- (kadi-nur8), but keeping it from day one means adding more sites later is
-- just a new value, not a schema change.
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  site_id text not null default 'kadi-nur8',
  guest_name text not null,
  message text not null,
  created_at timestamptz not null default now(),
  constraint guest_name_length check (char_length(guest_name) between 1 and 80),
  constraint message_length check (char_length(message) between 1 and 500)
);

create index if not exists messages_site_created_idx
  on messages (site_id, created_at desc);

alter table messages enable row level security;

do $$ begin
  create policy "Anyone can read messages" on messages for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Anyone can post a message" on messages for insert
    with check (char_length(message) between 1 and 500
            and char_length(guest_name) between 1 and 80);
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- events: one hosted occasion, owned by the signed-in organiser
-- ---------------------------------------------------------------------------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,

  -- Public URL segment (/e/<slug>). Guests receive this, so it must be stable
  -- and unguessable enough that the guest list is not enumerable.
  slug text not null unique default encode(gen_random_bytes(9), 'base64'),

  title text not null default 'Our Wedding',
  category text not null default 'wedding',

  -- The card itself. Stored as jsonb rather than one column per field because
  -- the design surface is the genome plus palette plus type plus copy, and it
  -- changes as axes are added -- a wide table would need a migration per axis.
  design jsonb not null default '{}'::jsonb,

  -- Denormalised copy of the genome code (K-00000100). Redundant with design,
  -- but makes "which layouts do people actually pick" answerable with a plain
  -- index instead of a jsonb scan over every row.
  genome_code text,

  published boolean not null default false,
  event_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint slug_shape check (char_length(slug) between 6 and 64),
  constraint title_length check (char_length(title) between 1 and 120)
);

create index if not exists events_owner_idx on events (owner_id, updated_at desc);
create index if not exists events_genome_idx on events (genome_code);

-- ---------------------------------------------------------------------------
-- guests: one row per invitation sent
-- ---------------------------------------------------------------------------
create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  seats int not null default 1,

  -- What the guest presents at the door and what their personal link carries.
  -- Unguessable so one guest cannot derive another guest's code from their own.
  entry_code text not null unique default encode(gen_random_bytes(6), 'hex'),

  phone text,
  email text,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),

  constraint guest_name_len check (char_length(name) between 1 and 120),
  constraint seats_sane check (seats between 1 and 50)
);

create index if not exists guests_event_idx on guests (event_id, created_at);
create unique index if not exists guests_entry_code_idx on guests (entry_code);

-- ---------------------------------------------------------------------------
-- rsvps: a guest's reply. Separate from guests so a change of mind is history,
-- not an overwrite -- organisers need to see that someone un-declined.
-- ---------------------------------------------------------------------------
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references guests(id) on delete cascade,
  attending boolean not null,
  seats_confirmed int,
  note text,
  dietary text,
  created_at timestamptz not null default now(),

  constraint note_len check (note is null or char_length(note) <= 500),
  constraint seats_confirmed_sane check (seats_confirmed is null or seats_confirmed between 0 and 50)
);

create index if not exists rsvps_guest_idx on rsvps (guest_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table events enable row level security;
alter table guests enable row level security;
alter table rsvps  enable row level security;

-- Organisers have full control over their own events, and only their own.
do $$ begin
  create policy "Owners manage their events" on events for all
    using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
exception when duplicate_object then null; end $$;

-- A published event is readable by anyone holding the link. Unpublished drafts
-- stay private, so an organiser can work on a card without it being reachable.
do $$ begin
  create policy "Published events are publicly readable" on events for select
    using (published = true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Owners manage their guests" on guests for all
    using (exists (select 1 from events e where e.id = guests.event_id and e.owner_id = auth.uid()))
    with check (exists (select 1 from events e where e.id = guests.event_id and e.owner_id = auth.uid()));
exception when duplicate_object then null; end $$;

-- Deliberately NOT a public select policy on guests. Guests are read by entry
-- code through a security-definer function below, so holding one invite link
-- never exposes the rest of the guest list.
do $$ begin
  create policy "Owners read rsvps for their events" on rsvps for select
    using (exists (
      select 1 from guests g join events e on e.id = g.event_id
      where g.id = rsvps.guest_id and e.owner_id = auth.uid()));
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Guest-facing access, scoped to a single entry code
-- ---------------------------------------------------------------------------
-- Returns one guest's own details and nothing about anyone else. Security
-- definer so it can read past RLS, but the where-clause is the whole point:
-- an entry code buys you exactly one row.
create or replace function guest_by_entry_code(code text)
returns table (guest_id uuid, guest_name text, seats int, event_slug text, design jsonb, title text)
language sql
security definer
set search_path = public
as $$
  select g.id, g.name, g.seats, e.slug, e.design, e.title
  from guests g
  join events e on e.id = g.event_id
  where g.entry_code = code and e.published = true;
$$;

-- Lets a guest reply without an account, but only for a code that exists.
create or replace function submit_rsvp(code text, is_attending boolean, seats int default null,
                                       guest_note text default null, guest_dietary text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare target uuid; new_id uuid;
begin
  select g.id into target
  from guests g join events e on e.id = g.event_id
  where g.entry_code = code and e.published = true;

  if target is null then
    raise exception 'unknown or unpublished invitation';
  end if;

  insert into rsvps (guest_id, attending, seats_confirmed, note, dietary)
  values (target, is_attending, seats, left(guest_note, 500), left(guest_dietary, 200))
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function guest_by_entry_code(text) from public;
revoke all on function submit_rsvp(text, boolean, int, text, text) from public;
grant execute on function guest_by_entry_code(text) to anon, authenticated;
grant execute on function submit_rsvp(text, boolean, int, text, text) to anon, authenticated;

-- Keep updated_at honest without relying on the client to send it.
create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists events_touch_updated_at on events;
create trigger events_touch_updated_at before update on events
  for each row execute function touch_updated_at();
