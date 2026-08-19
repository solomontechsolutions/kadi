'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/* Every mutation lives here as a server action rather than in a client
 * component talking to Supabase directly.
 *
 * Not because the browser cannot be trusted with the publishable key, it can:
 * row level security is the real boundary and it is enforced in the database
 * whichever client calls. The reason is that ownership checks, cache
 * invalidation and redirects all belong on one side of the wire. Splitting them
 * is how a UI ends up showing a stale guest list after adding a guest.
 */

type Result = { ok: true; id?: string } | { ok: false; error: string };

async function client() {
  const sb = await createClient();
  if (!sb) throw new Error('Supabase is not configured on this deployment.');
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect('/login?next=/events');
  return { sb, user: data.user };
}

/* Save a design as a new event, or update an existing one.
 *
 * owner_id is set from the verified session, never from the form. RLS would
 * reject a forged owner anyway, but sending one at all invites the reader to
 * think it is a client decision. */
export async function saveEvent(input: {
  id?: string;
  title: string;
  category: string;
  design: Record<string, unknown>;
  genomeCode?: string;
  eventDate?: string | null;
}): Promise<Result> {
  try {
    const { sb, user } = await client();

    const row = {
      owner_id: user.id,
      title: input.title.slice(0, 120) || 'Untitled event',
      category: input.category,
      design: input.design,
      genome_code: input.genomeCode ?? null,
      event_date: input.eventDate || null,
    };

    if (input.id) {
      const { error } = await sb.from('events').update(row).eq('id', input.id);
      if (error) return { ok: false, error: error.message };
      revalidatePath('/events');
      revalidatePath(`/events/${input.id}`);
      return { ok: true, id: input.id };
    }

    const { data, error } = await sb.from('events').insert(row).select('id').single();
    if (error) return { ok: false, error: error.message };
    revalidatePath('/events');
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed.' };
  }
}

/* Publishing is what makes guest links resolve. An unpublished event is
   invisible to the guest-facing function, so an organiser can build a card
   without it being reachable by anyone who guesses a code. */
export async function setPublished(id: string, published: boolean): Promise<Result> {
  try {
    const { sb } = await client();
    const { error } = await sb.from('events').update({ published }).eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/events');
    revalidatePath(`/events/${id}`);
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Could not change publication.' };
  }
}

export async function deleteEvent(id: string): Promise<Result> {
  try {
    const { sb } = await client();
    const { error } = await sb.from('events').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/events');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Could not delete.' };
  }
}

/* Guests are added in bulk because that is how a guest list actually arrives:
   pasted out of a phone contacts export or a WhatsApp thread, one per line,
   optionally with a seat count after a comma. Parsing that here means an
   organiser is never asked to add ninety guests one form at a time. */
export async function addGuests(eventId: string, raw: string): Promise<Result> {
  try {
    const { sb } = await client();

    const rows = raw
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        const [name, seatText] = line.split(',').map(s => s.trim());
        const seats = Number(seatText);
        return {
          event_id: eventId,
          name: (name || '').slice(0, 120),
          seats: Number.isFinite(seats) && seats >= 1 && seats <= 50 ? Math.floor(seats) : 1,
        };
      })
      .filter(r => r.name.length > 0);

    if (!rows.length) return { ok: false, error: 'No names found. One guest per line.' };
    if (rows.length > 500) return { ok: false, error: 'Add at most 500 guests at a time.' };

    const { error } = await sb.from('guests').insert(rows);
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/events/${eventId}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Could not add guests.' };
  }
}

export async function deleteGuest(eventId: string, guestId: string): Promise<Result> {
  try {
    const { sb } = await client();
    const { error } = await sb.from('guests').delete().eq('id', guestId);
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/events/${eventId}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Could not remove guest.' };
  }
}

export async function signOut() {
  const sb = await createClient();
  if (sb) await sb.auth.signOut();
  redirect('/');
}
