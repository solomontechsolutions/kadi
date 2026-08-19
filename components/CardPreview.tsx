'use client';

import { useEffect, useRef } from 'react';
import * as K from '@/engine/mwaliko-genome.js';
import { renderArchetype } from '@/engine/archetypes.js';

export interface CardDesign {
  archetype?: string;
  p1?: string;
  p2?: string;
  eyebrow?: string;
  wdate?: string;
  wtime?: string;
  venue?: string;
  city?: string;
  photo?: string;
  showEventColors?: boolean;
  eventColors?: string[];
  cBg?: string;
  cInk?: string;
  cAccent?: string;
  cSeal?: string;
  headFont?: string;
  bodyFont?: string;
  headGf?: string;
  bodyGf?: string;
}

interface Props {
  design: CardDesign;
  guestName?: string;
  seats?: number;
  /** Render at gallery-thumbnail scale inside a fixed aspect box. */
  thumb?: boolean;
  className?: string;
}

/* The card is drawn by the engine into a plain div rather than expressed as
 * JSX, because the engine is shared verbatim with the legacy static pages and a
 * second JSX implementation of the same markup would drift from it.
 *
 * What changed with the archetypes: the engine no longer returns one skeleton
 * for every design. Each archetype emits its own markup, so this component
 * hands over the data and the composition id and gets back a card it does not
 * need to understand. */
export default function CardPreview({
  design, guestName, seats = 2, thumb = false, className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Type is fetched per family and deduped by the engine, so a gallery of 24
       cards issues a handful of font requests rather than 24. */
    if (design.headGf) K.ensureFont(design.headGf);
    if (design.bodyGf) K.ensureFont(design.bodyGf);
    renderArchetype(el, design.archetype || 'editorial', design, guestName, seats);
  }, [design, guestName, seats]);

  /* Thumbnails scale a full 460px card down rather than rendering a narrow one.
   * Rendering narrow would reflow every composition into a different one, so
   * the grid would advertise a card the studio then fails to reproduce. This
   * matters more with archetypes than it did before: a Poster or a Swiss grid
   * is defined by its proportions. */
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

  return <div ref={ref} className={`mw-card ${className}`} />;
}
