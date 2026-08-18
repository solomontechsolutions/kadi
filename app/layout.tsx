import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kadi — Digital Invitations',
  description:
    'Design a digital invitation, share it with every guest, and track who is coming. ' +
    'Weddings, send-offs, kitchen parties, graduations and corporate events.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg' },
};

function Wordmark({ className = '' }: { className?: string }) {
  /* Replaces the old A&J monogram, which was one couple's initials baked into
   * the product chrome of a platform meant to serve every event. */
  return (
    <span className={`font-[family-name:var(--font-display)] tracking-tight ${className}`}>
      Kadi
    </span>
  );
}

const NAV = [
  { href: '/templates', label: 'Templates' },
  { href: '/studio', label: 'Studio' },
  { href: '/pricing', label: 'Pricing' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Full-bleed shell. The old studio was a fixed centre column that left
            the left and right thirds of a desktop empty. */}
        <header className="sticky top-0 z-50 border-b border-line bg-ivory/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-10 px-6 lg:px-10">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-sage text-ivory">
                <span className="font-[family-name:var(--font-display)] text-[15px] leading-none">K</span>
              </span>
              <Wordmark className="text-[22px] text-sage" />
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[13.5px] text-ink-soft transition-colors hover:text-ink"
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
                className="rounded-lg bg-sage px-4 py-2 text-[13px] font-medium text-ivory transition-colors hover:bg-sage-deep"
              >
                Start designing
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line bg-paper">
          <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
            <div>
              <Wordmark className="text-[20px] text-sage" />
              <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-ink-faint">
                Digital invitations for weddings, send-offs, kitchen parties and
                corporate events — designed, shared and tracked in one place.
              </p>
            </div>
            <FooterCol title="Product" links={[
              ['Templates', '/templates'],
              ['Studio', '/studio'],
              ['Pricing', '/pricing'],
            ]} />
            <FooterCol title="Events" links={[
              ['Weddings', '/templates?category=wedding'],
              ['Send-Off', '/templates?category=sendoff'],
              ['Kitchen Party', '/templates?category=kitchenparty'],
              ['Corporate', '/templates?category=corporate'],
            ]} />
            <FooterCol title="Tools" links={[
              ['Door scanner', '/scanner.html'],
              ['Guestbook', '/guestbook.html'],
              ['Legacy studio', '/studio-legacy.html'],
            ]} />
          </div>
          <div className="border-t border-line-soft">
            <div className="mx-auto w-full max-w-[1600px] px-6 py-5 text-[12px] text-ink-faint lg:px-10">
              © {new Date().getFullYear()} Kadi
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-faint">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map(([label, href]) => (
          <li key={href}>
            <a href={href} className="text-[13px] text-ink-soft transition-colors hover:text-ink">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
