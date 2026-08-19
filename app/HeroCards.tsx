'use client';

import { useEffect, useState } from 'react';
import CardPreview from '@/components/CardPreview';
import { templatesFor, designFor, sampleFor } from '@/lib/templates';

/* Real cards from four different categories, cycling. They are rendered by the
 * same engine the studio uses, so the hero can never advertise a look the
 * product cannot actually produce.
 *
 * Each card carries its own category's sample content. Filling all four with
 * one wedding couple was what made the hero, and the whole gallery behind it,
 * look like a wedding-only product. */
/* Interleaved, not concatenated. Stacking the categories end to end meant the
 * three cards on screen at any moment came from the same category, so the hero
 * opened on three weddings and only reached a corporate card forty seconds
 * later, by which time most visitors have scrolled. Round-robin guarantees the
 * first frame already shows the range. */
function interleave(groups: ReturnType<typeof templatesFor>[]) {
  const out: ReturnType<typeof templatesFor> = [];
  const longest = Math.max(...groups.map(g => g.length));
  for (let i = 0; i < longest; i++) {
    for (const g of groups) if (g[i]) out.push(g[i]);
  }
  return out;
}

const POOL = interleave([
  templatesFor('wedding', 5),
  templatesFor('corporate', 5),
  templatesFor('sendoff', 5),
  templatesFor('graduation', 5),
]);

export default function HeroCards() {
  const [i, setI] = useState(0);

  useEffect(() => {
    // Respect a reduced-motion preference: an auto-rotating hero is exactly the
    // kind of unrequested movement that setting exists to stop.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    const t = setInterval(() => setI(n => n + 1), 4200);
    return () => clearInterval(t);
  }, []);

  const cards = [0, 1, 2].map(o => POOL[(i * 3 + o) % POOL.length]);

  /* The float lives on an outer wrapper and the static offset on the thumb
     itself. Putting both on one element would mean the keyframes overwrite the
     translate that staggers the three cards, flattening them into a row. */
  const FLOAT = ['float-a', 'float-b', 'float-c'];
  const OFFSET = ['', 'lg:-translate-y-6', 'lg:translate-y-3'];

  return (
    <div className="relative grid grid-cols-3 gap-4 lg:gap-5">
      {cards.map((t, n) => (
        <div key={`${t.id}-${n}`} className={FLOAT[n]}>
          <div
            className={`thumb card-stage-paper rounded-xl border border-line shadow-[0_10px_30px_rgba(0,0,0,.09)] ${OFFSET[n]}`}
          >
            <CardPreview
              design={{ ...sampleFor(t.category), ...designFor(t) }}
              thumb
              guestName=""
            />
          </div>
        </div>
      ))}
    </div>
  );
}
