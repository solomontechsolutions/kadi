-- Kadi guestbook schema.
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- site_id scopes rows to one Kadi deployment. Only one value is used today
-- (kadi-nur8), but keeping it from day one means adding more sites later is
-- just a new value, not a schema change.

create extension if not exists pgcrypto;

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

-- The site is fully public (no login), so these are intentionally the only
-- two policies: anyone can post a message, and anyone can read the wall of
-- messages. There is no update/delete policy, so nothing can be edited or
-- removed through the public API -- only from the Supabase dashboard itself.
create policy "Anyone can read messages"
  on messages for select
  using (true);

create policy "Anyone can post a message"
  on messages for insert
  with check (
    char_length(message) between 1 and 500
    and char_length(guest_name) between 1 and 80
  );
