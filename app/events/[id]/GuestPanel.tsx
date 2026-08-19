'use client';

import { useState, useTransition } from 'react';
import { addGuests, deleteGuest, setPublished } from '../actions';

export interface GuestRow {
  id: string;
  name: string;
  seats: number;
  entry_code: string;
  checked_in_at: string | null;
  rsvps: { attending: boolean; created_at: string }[];
}

/* Latest reply wins, but the earlier ones are kept in the table on purpose:
   rsvps is append-only so an organiser can see that somebody un-declined,
   which is exactly the change a seating plan depends on. */
function latest(g: GuestRow) {
  if (!g.rsvps?.length) return null;
  return [...g.rsvps].sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
}

export default function GuestPanel({
  eventId, slug, guests, published,
}: {
  eventId: string; slug: string; guests: GuestRow[]; published: boolean;
}) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const yes = guests.filter(g => latest(g)?.attending === true);
  const no = guests.filter(g => latest(g)?.attending === false);
  const quiet = guests.filter(g => latest(g) === null);
  const seatsConfirmed = yes.reduce((n, g) => n + g.seats, 0);

  function link(code: string) {
    if (typeof window === 'undefined') return `/i/${code}`;
    return `${window.location.origin}/i/${code}`;
  }

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(link(code));
      setCopied(code);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* Clipboard is blocked in some in-app browsers. The link is visible in
         the row itself, so a failed copy is an inconvenience, not a dead end. */
      setCopied(null);
    }
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-3 sm:grid-cols-4">
        <Stat label="Invited" value={guests.length} />
        <Stat label="Coming" value={yes.length} sub={`${seatsConfirmed} seats`} />
        <Stat label="Cannot come" value={no.length} />
        <Stat label="No reply yet" value={quiet.length} />
      </section>

      {!published && (
        <div className="rounded-xl border border-gold/40 bg-gold/10 p-5">
          <h3 className="text-[14px] font-medium text-ink">Guest links are not live yet</h3>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-ink-soft">
            While this event is a draft, an invitation link shows nothing, which is what
            keeps a half-finished card private. Publish when you are ready to send.
          </p>
          <button
            onClick={() => start(() => { setPublished(eventId, true); })}
            disabled={pending}
            className="btn-press mt-4 rounded-lg bg-brand px-4 py-2.5 text-[13px] font-medium text-ivory hover:bg-brand-deep disabled:opacity-60"
          >
            Publish this event
          </button>
        </div>
      )}

      <section>
        <h3 className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-faint">
          Add guests
        </h3>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-faint">
          One per line. Add a comma and a number for a guest bringing others,
          for example <span className="text-ink-soft">Neema Mushi, 2</span>.
        </p>
        <textarea
          value={raw}
          onChange={e => setRaw(e.target.value)}
          rows={5}
          placeholder={'Neema Mushi, 2\nJoseph Kimaro\nAsha Salum, 4'}
          className="mt-3 w-full rounded-lg border border-line bg-paper px-3.5 py-3 text-[13.5px] text-ink outline-none transition-colors focus:border-brand"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={() => start(async () => {
              setError('');
              const r = await addGuests(eventId, raw);
              if (r.ok) setRaw(''); else setError(r.error);
            })}
            disabled={pending || !raw.trim()}
            className="btn-sheen btn-press rounded-lg bg-brand px-5 py-2.5 text-[13px] font-medium text-ivory hover:bg-brand-deep disabled:opacity-50"
          >
            {pending ? 'Adding' : 'Add to guest list'}
          </button>
          {error && <span role="alert" className="text-[12.5px] text-ink-soft">{error}</span>}
        </div>
      </section>

      <section>
        <h3 className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-faint">
          Guest list
        </h3>
        {guests.length === 0 ? (
          <p className="mt-3 text-[13.5px] text-ink-soft">No guests yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="bg-ivory">
                  {['Guest', 'Seats', 'Reply', 'Their link', ''].map(h => (
                    <th key={h} className="border-b border-line px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[.1em] text-ink-faint">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guests.map(g => {
                  const r = latest(g);
                  return (
                    <tr key={g.id} className="align-middle">
                      <td className="border-b border-line-soft px-4 py-3 text-ink">{g.name}</td>
                      <td className="border-b border-line-soft px-4 py-3 text-ink-soft">{g.seats}</td>
                      <td className="border-b border-line-soft px-4 py-3">
                        <span className={
                          r === null ? 'text-ink-faint'
                            : r.attending ? 'text-brand' : 'text-ink-soft'
                        }>
                          {r === null ? 'Waiting' : r.attending ? 'Coming' : 'Cannot come'}
                        </span>
                        {g.checked_in_at && (
                          <span className="ml-2 text-[11px] text-ink-faint">arrived</span>
                        )}
                      </td>
                      <td className="border-b border-line-soft px-4 py-3">
                        <button
                          onClick={() => copy(g.entry_code)}
                          className="text-[12.5px] text-brand underline underline-offset-2"
                        >
                          {copied === g.entry_code ? 'Copied' : 'Copy link'}
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`You are invited. Your personal invitation: ${link(g.entry_code)}`)}`}
                          target="_blank"
                          rel="noopener"
                          className="ml-3 text-[12.5px] text-ink-soft underline underline-offset-2"
                        >
                          WhatsApp
                        </a>
                      </td>
                      <td className="border-b border-line-soft px-4 py-3 text-right">
                        <button
                          onClick={() => start(() => { deleteGuest(eventId, g.id); })}
                          className="text-[12px] text-ink-faint hover:text-ink"
                          aria-label={`Remove ${g.name}`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-[12px] text-ink-faint">
          Event page for anyone with the address: <span className="text-ink-soft">/e/{slug}</span>
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-5">
      <p className="font-[family-name:var(--font-display)] text-[30px] leading-none text-ink">{value}</p>
      <p className="mt-2 text-[10.5px] uppercase tracking-[.12em] text-ink-faint">{label}</p>
      {sub && <p className="mt-1 text-[12px] text-ink-soft">{sub}</p>}
    </div>
  );
}
