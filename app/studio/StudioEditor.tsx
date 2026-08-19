'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveEvent } from '@/app/events/actions';
import CardPreview from '@/components/CardPreview';
import * as K from '@/engine/mwaliko-genome.js';
import { ARCHETYPES } from '@/engine/archetypes.js';
import { CATEGORIES, sampleFor, type Template } from '@/lib/templates';

/* The Studio.
 *
 * The old /studio was a landing page that explained the Studio and then handed
 * you to studio-legacy.html, a separate static editor built before the design
 * engine existed. So picking a template did nothing: the legacy editor had its
 * own nineteen hardcoded layouts and no idea which card you had chosen. That is
 * the whole reason the button felt like a dead end.
 *
 * This is the editor itself, and it opens on the card you clicked. The template
 * arrives as an id in the query string, is resolved back into a design on the
 * server, and lands here as the starting state. Every control below mutates
 * that state and the card redraws, so what you see is the invitation, never a
 * representation of one. */

interface Draft {
  archetype: string;
  hueIdx: number;
  moodIdx: number;
  hf: number;
  bf: number;
  p1: string;
  p2: string;
  eyebrow: string;
  wdate: string;
  wtime: string;
  venue: string;
  city: string;
  showEventColors: boolean;
  eventColors: string[];
}

function draftFrom(t: Template | null, category: string): Draft {
  const s = sampleFor(t?.category ?? category);
  return {
    archetype: t?.archetype ?? 'editorial',
    hueIdx: t?.hueIdx ?? 4,
    moodIdx: t?.moodIdx ?? 0,
    hf: t?.hf ?? 0,
    bf: t?.bf ?? 0,
    p1: s.p1, p2: s.p2, eyebrow: s.eyebrow,
    wdate: s.wdate, wtime: s.wtime, venue: s.venue, city: s.city,
    showEventColors: s.showEventColors,
    eventColors: s.eventColors ?? ['#8C1F28', '#C9A227', '#2F4858'],
  };
}

export default function StudioEditor({
  template, category, saved, signedIn,
}: {
  template: Template | null;
  category: string;
  /* An event being edited again, rather than a template being opened for the
     first time. Its stored design is the starting state, so reopening from the
     dashboard returns you to exactly what you saved. */
  saved?: { id: string; title: string; design: Partial<Draft> } | null;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [d, setD] = useState<Draft>(() => ({
    ...draftFrom(template, category),
    ...(saved?.design ?? {}),
  }));
  const [guest, setGuest] = useState('Neema Mushi');
  const [seats, setSeats] = useState(2);
  const [tab, setTab] = useState<'design' | 'details' | 'guests'>('design');
  const [eventId, setEventId] = useState<string | null>(saved?.id ?? null);
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');
  const [pending, start] = useTransition();

  /* The title is derived rather than asked for. An organiser opening a template
     wants to design, not to name a record, and "Amara and Julian" is a better
     default than an empty required field they have to clear later. */
  const title = [d.p1, d.p2].filter(Boolean).join(' and ') || 'Untitled event';

  function persist() {
    start(async () => {
      setSaveError('');
      const r = await saveEvent({
        id: eventId ?? undefined,
        title,
        category: template?.category ?? category,
        design: { ...d },
        eventDate: d.wdate || null,
      });
      if (r.ok) {
        setSaveState('saved');
        if (r.id && !eventId) {
          setEventId(r.id);
          router.replace(`/studio?event=${r.id}`);
        }
        setTimeout(() => setSaveState('idle'), 2200);
      } else {
        setSaveState('error');
        setSaveError(r.error);
      }
    });
  }

  const set = <Kk extends keyof Draft>(k: Kk, v: Draft[Kk]) => setD(p => ({ ...p, [k]: v }));

  const design = useMemo(() => {
    const palette = K.paletteFromIndices(d.hueIdx, d.moodIdx);
    const head = K.HEADING_FONTS[d.hf % K.HEADING_FONTS.length];
    const body = K.BODY_FONTS[d.bf % K.BODY_FONTS.length];
    return {
      ...palette,
      archetype: d.archetype,
      p1: d.p1, p2: d.p2, eyebrow: d.eyebrow,
      wdate: d.wdate, wtime: d.wtime, venue: d.venue, city: d.city,
      showEventColors: d.showEventColors, eventColors: d.eventColors,
      headFont: head.css, bodyFont: body.css, headGf: head.gf, bodyGf: body.gf,
    };
  }, [d]);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-10 lg:py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-faint">The Studio</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[34px] leading-tight text-ink lg:text-[42px]">
            {template ? template.name : 'Design your invitation'}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {saveError && (
            <span role="alert" className="text-[12.5px] text-ink-soft">{saveError}</span>
          )}
          <Link
            href="/templates"
            className="btn-press rounded-lg border border-line bg-paper px-4 py-2.5 text-[13px] text-ink-soft transition-colors hover:border-ink-faint hover:text-ink"
          >
            Change template
          </Link>
          {signedIn ? (
            <button
              onClick={persist}
              disabled={pending}
              className="btn-sheen btn-press rounded-lg bg-brand px-5 py-2.5 text-[13px] font-medium text-ivory hover:bg-brand-deep disabled:opacity-60"
            >
              {pending ? 'Saving' : saveState === 'saved' ? 'Saved' : eventId ? 'Save changes' : 'Save this design'}
            </button>
          ) : (
            <Link
              href="/login?next=/studio"
              className="btn-sheen btn-press rounded-lg bg-brand px-5 py-2.5 text-[13px] font-medium text-ivory hover:bg-brand-deep"
            >
              Sign in to save
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-12">
        {/* Controls first in the DOM so a keyboard or screen reader reaches the
            thing you operate before the thing you look at. Visually the card
            sits on the right on desktop and above the controls on mobile. */}
        <div className="order-2 lg:order-1">
          <div role="tablist" aria-label="Editor sections" className="flex gap-1 border-b border-line">
            {(['design', 'details', 'guests'] as const).map(t => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`-mb-px border-b-2 px-4 py-2.5 text-[13px] capitalize transition-colors ${
                  tab === t
                    ? 'border-brand text-ink'
                    : 'border-transparent text-ink-faint hover:text-ink-soft'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="pt-7">
            {tab === 'design' && (
              <div className="space-y-8">
                <Field label="Composition" hint="Twelve genuinely different layouts, not one layout in twelve colours.">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {ARCHETYPES.map(a => (
                      <button
                        key={a.id}
                        onClick={() => set('archetype', a.id)}
                        className={`btn-press rounded-lg border px-3 py-2.5 text-left text-[12.5px] transition-colors ${
                          d.archetype === a.id
                            ? 'border-brand bg-brand text-ivory'
                            : 'border-line bg-paper text-ink-soft hover:border-ink-faint'
                        }`}
                      >
                        {a.name}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Colour">
                  <div className="flex flex-wrap gap-1.5">
                    {K.HUES.map((h: string, i: number) => {
                      const p = K.paletteFromIndices(i, d.moodIdx);
                      return (
                        <button
                          key={h}
                          title={h}
                          aria-label={h}
                          onClick={() => set('hueIdx', i)}
                          style={{ background: p.cAccent }}
                          className={`h-7 w-7 rounded-full transition-transform ${
                            d.hueIdx === i ? 'scale-110 ring-2 ring-ink ring-offset-2' : 'hover:scale-105'
                          }`}
                        />
                      );
                    })}
                  </div>
                </Field>

                <Field label="Mood">
                  <Chips
                    items={K.MOODS.map((m: { name: string }, i: number) => [String(i), m.name])}
                    value={String(d.moodIdx)}
                    onChange={v => set('moodIdx', Number(v))}
                  />
                </Field>

                <Field label="Heading type">
                  <Chips
                    items={K.HEADING_FONTS.map((f: { name: string }, i: number) => [String(i), f.name])}
                    value={String(d.hf)}
                    onChange={v => set('hf', Number(v))}
                  />
                </Field>

                <Field label="Body type">
                  <Chips
                    items={K.BODY_FONTS.map((f: { name: string }, i: number) => [String(i), f.name])}
                    value={String(d.bf)}
                    onChange={v => set('bf', Number(v))}
                  />
                </Field>
              </div>
            )}

            {tab === 'details' && (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Text label="First name or title" value={d.p1} onChange={v => set('p1', v)} />
                  <Text label="Second name" hint="Leave empty for a single subject" value={d.p2} onChange={v => set('p2', v)} />
                </div>
                <Text label="Line above the names" value={d.eyebrow} onChange={v => set('eyebrow', v)} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Text label="Date" type="date" value={d.wdate} onChange={v => set('wdate', v)} />
                  <Text label="Time" type="time" value={d.wtime} onChange={v => set('wtime', v)} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Text label="Venue" value={d.venue} onChange={v => set('venue', v)} />
                  <Text label="City" value={d.city} onChange={v => set('city', v)} />
                </div>

                <Field label="Event colours" hint="Celebrations only. Corporate and memorial compositions ignore this.">
                  <label className="flex items-center gap-2.5 text-[13px] text-ink-soft">
                    <input
                      type="checkbox"
                      checked={d.showEventColors}
                      onChange={e => set('showEventColors', e.target.checked)}
                      className="h-4 w-4 accent-[color:var(--color-brand)]"
                    />
                    Show event colours on the card
                  </label>
                  {d.showEventColors && (
                    <div className="mt-3 flex gap-2">
                      {d.eventColors.map((c, i) => (
                        <input
                          key={i}
                          type="color"
                          value={c}
                          aria-label={`Event colour ${i + 1}`}
                          onChange={e => {
                            const next = [...d.eventColors];
                            next[i] = e.target.value;
                            set('eventColors', next);
                          }}
                          className="h-9 w-14 cursor-pointer rounded border border-line bg-paper p-1"
                        />
                      ))}
                    </div>
                  )}
                </Field>
              </div>
            )}

            {tab === 'guests' && (
              <div className="space-y-5">
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  Every guest gets their own link carrying their name and seat count. Type a
                  name here to see how their card will look before you build the full list.
                </p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Text label="Guest name" value={guest} onChange={setGuest} />
                  <Text label="Seats" type="number" value={String(seats)} onChange={v => setSeats(Math.max(1, Number(v) || 1))} />
                </div>
                {eventId ? (
                  <div className="rounded-xl border border-line bg-paper p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-faint">
                      Guest list
                    </p>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                      This design is saved. Add your guests, send each of them their own
                      link, and watch the replies arrive.
                    </p>
                    <Link
                      href={`/events/${eventId}`}
                      className="btn-press mt-4 inline-block rounded-lg bg-brand px-4 py-2.5 text-[13px] font-medium text-ivory hover:bg-brand-deep"
                    >
                      Open the guest list
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-xl border border-line bg-paper p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-faint">
                      Save first
                    </p>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                      A guest list belongs to a saved event, because each guest link points
                      at this design. Save the design and the guest list opens here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* The card. Sticky on desktop so it stays in view while you scroll a
            long control panel: an editor where the preview scrolls away is an
            editor you cannot use. */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <div className="mx-auto w-full max-w-[460px]">
              <div className="thumb card-stage-paper rounded-xl border border-line shadow-[0_18px_50px_-24px_rgba(22,41,74,.4)]">
                <CardPreview design={design} thumb guestName={guest} seats={seats} />
              </div>
              <p className="mt-3 text-center text-[12px] text-ink-faint">
                Live card. Every change above redraws this, not a preview of it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-faint">{label}</p>
      {hint && <p className="mt-1 text-[12px] leading-snug text-ink-faint">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Chips({
  items, value, onChange,
}: { items: [string, string][]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`btn-press rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${
            value === v
              ? 'border-brand bg-brand text-ivory'
              : 'border-line bg-paper text-ink-soft hover:border-ink-faint'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Text({
  label, value, onChange, type = 'text', hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-faint">{label}</span>
      {hint && <span className="mt-0.5 block text-[11.5px] text-ink-faint">{hint}</span>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[13.5px] text-ink outline-none transition-colors focus:border-brand"
      />
    </label>
  );
}

/* Categories are exported for the empty state, so a visitor who lands on the
   Studio with no template can still get somewhere. */
export const STUDIO_CATEGORIES = CATEGORIES;
