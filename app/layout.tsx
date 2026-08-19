import type { Metadata } from 'next';
import SiteHeader, { Wordmark } from '@/components/SiteHeader';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Mwaliko, Digital Invitations for Every Occasion',
    template: '%s | Mwaliko',
  },
  description:
    'Design a digital invitation, share it with every guest, and track who is coming. ' +
    'Weddings, send-offs, kitchen parties, graduations and corporate events.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.png' },
};

/* No webfont links in <head> any more. The site now asks the operating system
 * for its own faces, San Francisco and New York on Apple devices, so there is
 * nothing to preconnect to and nothing to download before text can paint. */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <SiteHeader />

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line bg-paper">
          <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5 lg:px-10">
            <div>
              <Wordmark full height={46} />
              <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-ink-faint">
                Digital invitations for weddings, send-offs, kitchen parties and
                corporate events. Designed, shared and tracked in one place.
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
            {/* The door scanner, the guestbook and the legacy studio used to be
                listed here. They are organiser tools that open onto live event
                data, so advertising them in the public footer showed prospective
                customers another couple's guestbook. They stay reachable by
                direct link for the organisers who need them. */}
            <FooterCol title="Company" links={[
              ['Contact', '/contact'],
              ['Compliance', '/compliance'],
            ]} />
            <FooterCol title="Legal" links={[
              ['Privacy Policy', '/privacy'],
              ['Terms and Conditions', '/terms'],
              ['Cookie Policy', '/cookies'],
              ['Legal Notice', '/legal'],
            ]} />
          </div>
          <div className="border-t border-line-soft">
            <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-x-5 gap-y-2 px-6 py-5 text-[12px] text-ink-faint lg:px-10">
              <span>&copy; {new Date().getFullYear()} Mwaliko</span>
              <span className="hidden sm:inline text-line">|</span>
              <span>Operating in the United Republic of Tanzania</span>
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
            <a
              href={href}
              className="inline-block text-[13px] text-ink-soft transition-[color,transform] duration-200 ease-[cubic-bezier(.22,.61,.36,1)] hover:translate-x-0.5 hover:text-ink"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
