'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/* Scroll reveal.
 *
 * An IntersectionObserver rather than a scroll listener: the browser reports
 * intersections off the main thread, so a page with forty revealing elements
 * costs nothing, where forty scroll handlers reading getBoundingClientRect
 * would force a layout on every frame.
 *
 * Each element is unobserved the moment it shows. Content that re-hides when
 * you scroll back up is the single most irritating version of this effect, and
 * it also means anyone reading with the keyboard can lose text they had
 * already reached.
 *
 * The reduced-motion branch renders shown from the very first paint. Not
 * "animates instantly", genuinely never hidden, so no timing bug can strand
 * text off screen. */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  as?: ElementType;
  /* Milliseconds. Use in small increments across siblings to stagger a row. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    /* rootMargin lifts the trigger line above the fold's bottom edge so an
       element has finished arriving by the time it is properly in view, rather
       than starting to move only once you are already looking at it. */
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? 'shown' : ''}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
