'use client';

import { useEffect, useRef } from 'react';
import * as R from '@/engine/kadi-render.js';
import type { CardDesign } from '@/engine/kadi-render.js';

interface Props {
  design: CardDesign;
  guestName?: string;
  seats?: number;
  showSeal?: boolean;
  /** Render at gallery-thumbnail scale inside a fixed aspect box. */
  thumb?: boolean;
  className?: string;
}

/* The card is drawn by the engine into a plain div rather than expressed as
 * JSX. That is deliberate: the engine is the single source of truth for card
 * markup and is shared verbatim with the legacy static pages. Re-implementing
 * the same skeleton in JSX would recreate exactly the two-copies-that-drift
 * problem the genome work was done to remove. */
export default function CardPreview({
  design, guestName, seats = 2, showSeal = true, thumb = false, className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    R.renderCard(el, design, guestName, seats, showSeal);
  }, [design, guestName, seats, showSeal]);

  /* Thumbnails scale a full 460px card down rather than rendering a narrow one.
   * Rendering narrow would reflow type and gaps into a different composition,
   * so the grid would advertise a card the studio then fails to reproduce. */
  useEffect(() => {
    if (!thumb) return;
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;
    const fit = () => {
      el.style.transform = `scale(${box.clientWidth / 460})`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, [thumb]);

  return <div ref={ref} className={`invite-card ${className}`} />;
}
