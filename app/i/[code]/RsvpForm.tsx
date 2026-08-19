'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/* The RSVP.
 *
 * Mwaliko previously had no RSVP at all: the card carried a button pointing at
 * a Google Form the organiser supplied, and nothing came back into the product.
 * This writes the reply against the guest's own entry code through a
 * security-definer function, so a guest needs no account and one invitation
 * link never exposes anybody else on the list.
 *
 * Replies are inserted, never updated. A guest who declines in March and
 * accepts in June leaves both rows, because "changed their mind" is exactly the
 * fact a seating plan turns on. */
export default function RsvpForm({
  code, guestName, seats, existing,
}: {
  code: string; guestName: string; seats: number;
  existing: { attending: boolean } | null;
}) {
  const [attending, setAttending] = useState<boolean | null>(existing?.attending ?? null);
  const [confirmed, setConfirmed] = useState(seats);
  const [note, setNote] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>(existing ? 'done' : 'idle');
  const [message, setMessage] = useState('');

  async function send(yes: boolean) {
    setAttending(yes);
    setState('saving');
    try {
      const sb = createClient();
      const { error } = await sb.rpc('submit_rsvp', {
        code,
        is_attending: yes,
        seats: yes ? confirmed : 0,
        guest_note: note.trim() || null,
        guest_dietary: null,
      });
      if (error) throw error;
      setState('done');
    } catch (e) {
      setState('error');
      setMessage(e instanceof Error ? e.message : 'Could not send your reply.');
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-xl border border-line bg-paper p-6 text-center">
        <p className="font-[family-name:var(--font-display)] text-[24px] text-ink">
          {attending ? 'Thank you, we have you down.' : 'Thank you for letting us know.'}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
          {attending
            ? `We have reserved ${confirmed} ${confirmed === 1 ? 'seat' : 'seats'} for ${guestName}. Bring this link with you on the day.`
            : 'You will be missed. If your plans change, reply again from this link.'}
        </p>
        <button
          onClick={() => { setState('idle'); }}
          className="mt-4 text-[13px] text-brand underline underline-offset-2"
        >
          Change my reply
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-paper p-6">
      <p className="text-center font-[family-name:var(--font-display)] text-[24px] text-ink">
        Will you join us?
      </p>

      {seats > 1 && (
        <label className="mt-5 block text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-faint">
            How many of you are coming?
          </span>
          <input
            type="number"
            min={1}
            max={seats}
            value={confirmed}
            onChange={e => setConfirmed(Math.min(seats, Math.max(1, Number(e.target.value) || 1)))}
            className="mx-auto mt-2 block w-24 rounded-lg border border-line bg-ivory px-3 py-2 text-center text-[15px] text-ink outline-none focus:border-brand"
          />
          <span className="mt-1 block text-[12px] text-ink-faint">
            {seats} {seats === 1 ? 'seat is' : 'seats are'} reserved for you
          </span>
        </label>
      )}

      <label className="mt-5 block">
        <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-faint">
          A message for the hosts, if you like
        </span>
        <textarea
          rows={2}
          value={note}
          onChange={e => setNote(e.target.value.slice(0, 500))}
          className="mt-2 w-full rounded-lg border border-line bg-ivory px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand"
        />
      </label>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => send(true)}
          disabled={state === 'saving'}
          className="btn-sheen btn-press rounded-lg bg-brand px-5 py-3 text-[14px] font-medium text-ivory hover:bg-brand-deep disabled:opacity-60"
        >
          Yes, I will be there
        </button>
        <button
          onClick={() => send(false)}
          disabled={state === 'saving'}
          className="btn-press rounded-lg border border-line px-5 py-3 text-[14px] text-ink-soft transition-colors hover:border-ink-faint hover:text-ink disabled:opacity-60"
        >
          Sorry, I cannot come
        </button>
      </div>

      {state === 'error' && (
        <p role="alert" className="mt-3 text-center text-[12.5px] text-ink-soft">{message}</p>
      )}
    </div>
  );
}
