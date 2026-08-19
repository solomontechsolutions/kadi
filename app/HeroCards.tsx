'use client';

import { useEffect, useState } from 'react';
import CardPreview from '@/components/CardPreview';
import { templatesFor, designFor } from '@/lib/templates';

/* Three real cards from three different categories, cycling. They are rendered
 * by the same engine the studio uses, so the hero can never advertise a look
 * the product cannot actually produce. */
const POOL = [
  ...templatesFor('wedding', 6),
  ...templatesFor('sendoff', 6),
  ...templatesFor('graduation', 4),
  ...templatesFor('corporate', 4),
];

const SAMPLE = {
  p1: 'Amara', p2: 'Julian',
  wdate: '2027-02-14', wtime: '16:30',
  venue: 'The Old Botanical Hall', city: 'Dar es Salaam',
  eyebrow: 'Together with their families',
  showEventColors: true,
  eventColors: ['#8C1F28', '#C9A227', '#2F4858'],
};

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
            design={{ ...SAMPLE, ...designFor(t) }}
            thumb
            guestName=""
            showSeal={false}
          />
        </div>
        </div>
      ))}
    </div>
  );
}
