'use client';

import { useEffect, useRef, useState } from 'react';

/* A number that counts up once, when it first scrolls into view.
 *
 * Driven by requestAnimationFrame against a timestamp rather than a setInterval
 * with a fixed step. An interval assumes every tick arrives on schedule; when
 * the tab is backgrounded or the phone is busy they do not, and the count
 * finishes late and visibly out of sync with everything around it. Reading the
 * clock each frame means the animation always lands at exactly `duration`,
 * however many frames it actually got.
 *
 * The easing is the same settle-and-stop curve the CSS uses, expressed as a
 * cubic so the digits decelerate in step with the elements arriving beside
 * them. */
export default function CountUp({
  to,
  duration = 1600,
  className = '',
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  /* Start at the final value. If the observer never fires, if JavaScript fails,
     or if the visitor prefers reduced motion, the correct number is already on
     screen. Animation is the enhancement, never the source of truth. */
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        io.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(to * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        setValue(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  /* tabular-nums stops the digits jittering sideways as they change width,
     which is what makes most count-up animations look cheap. */
  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {value.toLocaleString()}
    </span>
  );
}
