'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/templates', label: 'Templates' },
  { href: '/studio', label: 'Studio' },
  { href: '/pricing', label: 'Pricing' },
];

/* The logo is the supplied artwork, cropped by scripts/build-logo.mjs into the
 * two shapes the site actually needs. Source of truth is Logo.png at the repo
 * root; re-run that script after replacing it.
 *
 * `full` carries the INVITE / RSVP / WELCOME tagline and is used where there is
 * room for it. The header uses the compact crop, because at the 30px a header
 * allows, the tagline renders around three pixels tall.
 *
 * A plain <img> rather than next/image: the file is a fixed-size transparent
 * PNG served from public, so there is no layout negotiation to do, and this
 * keeps the header free of client-side image machinery.
 *
 * Setting height and letting width follow means replacement artwork of any
 * aspect ratio sits correctly instead of stretching into the old shape. */
export function Wordmark({
  className = '',
  height = 30,
  full = false,
}: { className?: string; height?: number; full?: boolean }) {
  return (
    <img
      src={full ? '/brand/logo.png' : '/brand/logo-compact.png'}
      alt="Mwaliko"
      style={{ height, width: 'auto' }}
      className={className}
    />
  );
}

/* The header gains a hairline shadow once the page has moved, so it separates
 * from the content scrolling under it. Flat at the top, lifted once there is
 * something behind it to lift away from.
 *
 * The scroll handler is passive and does nothing but compare a boolean, so it
 * never blocks scrolling. Writing state only on the transition, rather than on
 * every scroll event, keeps React out of the scroll path entirely. */
export default function SiteHeader() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 8;
      setLifted(prev => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-ivory/80 backdrop-blur-xl transition-[box-shadow,border-color] duration-300 ${
        lifted ? 'border-line shadow-[0_1px_24px_-8px_rgba(35,35,31,.22)]' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-10 px-6 lg:px-10">
        <Link href="/" className="group flex items-center" aria-label="Mwaliko home">
          <Wordmark className="transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.03]" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-[13.5px] text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link href="/login" className="hidden text-[13.5px] text-ink-soft hover:text-ink sm:block">
            Sign in
          </Link>
          <Link
            href="/templates"
            className="btn-sheen btn-press rounded-lg bg-brand px-4 py-2 text-[13px] font-medium text-ivory hover:bg-brand-deep"
          >
            Start designing
          </Link>
        </div>
      </div>
    </header>
  );
}
