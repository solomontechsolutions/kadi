'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import CardPreview from '@/components/CardPreview';
import { CATEGORIES, templatesFor, designFor } from '@/lib/templates';

const SAMPLE = {
  p1: 'Amara', p2: 'Julian',
  wdate: '2027-02-14', wtime: '16:30',
  venue: 'The Old Botanical Hall', city: 'Dar es Salaam',
  eyebrow: 'Together with their families',
  showEventColors: true,
  eventColors: ['#8C1F28', '#C9A227', '#2F4858'],
};

const PER_PAGE = 24;

export default function TemplateGallery({ initialCategory }: { initialCategory: string }) {
  const [category, setCategory] = useState(initialCategory);
  const [shown, setShown] = useState(PER_PAGE);

  const active = CATEGORIES.find(c => c.key === category) ?? CATEGORIES[0];

  // Generated on demand from the engine rather than stored: the gallery is a
  // window onto 315,360 layouts, so "load more" walks further into the space
  // instead of hitting the end of a hand-built list.
  const templates = useMemo(() => templatesFor(active.key, shown), [active.key, shown]);

  function switchCategory(key: string) {
    setCategory(key);
    setShown(PER_PAGE);
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 lg:px-10">
      <div className="border-b border-line py-10">
        <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-faint">
          Template library
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[42px] leading-[1.05] text-ink lg:text-[52px]">
          Find a card that fits the occasion
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          Every card here is generated live from Mwaliko&rsquo;s design engine, so what you
          see is exactly what you can edit. Pick one to open it in the studio. The
          layout, palette and type are all still yours to change.
        </p>
      </div>

      {/* Category rail */}
      <div className="sticky top-16 z-40 -mx-6 border-b border-line bg-ivory/90 px-6 py-4 backdrop-blur-md lg:-mx-10 lg:px-10">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => switchCategory(c.key)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] transition-colors ${
                c.key === active.key
                  ? 'border-sage bg-sage text-ivory'
                  : 'border-line bg-paper text-ink-soft hover:border-ink-faint hover:text-ink'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="pt-8 text-[14px] text-ink-soft">{active.blurb}</p>

      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {templates.map(t => (
          <Link
            key={t.id}
            href={`/studio?template=${encodeURIComponent(t.id)}`}
            className="lift group block"
          >
            <div className="thumb card-stage rounded-xl border border-line bg-paper shadow-[0_1px_2px_rgba(0,0,0,.04)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,.10)]">
              <CardPreview design={{ ...SAMPLE, ...designFor(t) }} thumb guestName="" showSeal={false} />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between gap-2">
              <span className="truncate text-[13.5px] text-ink">{t.name}</span>
              <span className="shrink-0 text-[10.5px] uppercase tracking-wider text-ink-faint">
                {active.name}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={() => setShown(n => n + PER_PAGE)}
          className="rounded-lg border border-line bg-paper px-6 py-3 text-[13.5px] text-ink-soft transition-colors hover:border-ink-faint hover:text-ink"
        >
          Show more {active.name.toLowerCase()} designs
        </button>
      </div>
    </div>
  );
}
