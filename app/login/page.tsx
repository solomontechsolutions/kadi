import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import Reveal from '@/components/Reveal';
import { currentUser } from '@/lib/supabase/server';
import { isConfigured } from '@/lib/supabase/config';

export const metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  /* Only relative paths are accepted as a destination. Taking an absolute URL
     here would turn the sign-in page into an open redirect, which is the
     classic way a login flow gets used to launder a phishing link. */
  const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '/events';

  const user = await currentUser();
  if (user) redirect(dest);

  return (
    <div className="mx-auto w-full max-w-[520px] px-6 py-20 lg:py-28">
      <Reveal as="p" className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-faint">
        Sign in
      </Reveal>
      <Reveal as="h1" delay={80} className="mt-3 font-[family-name:var(--font-display)] text-[38px] leading-tight text-ink">
        Your events, on any device.
      </Reveal>
      <Reveal as="p" delay={150} className="mt-4 text-[15px] leading-relaxed text-ink-soft">
        Sign in to save a design, build your guest list and see who has replied.
      </Reveal>

      <Reveal delay={220} className="mt-8">
        {isConfigured ? (
          <LoginForm next={dest} />
        ) : (
          <div className="rounded-xl border border-line bg-paper p-6">
            <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink">
              Accounts are not switched on here
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              This deployment has no database connected, so there is nothing to sign in to.
              Designing a card and browsing templates both work without an account.
            </p>
            <Link href="/templates" className="mt-5 inline-block text-[13px] text-brand underline underline-offset-2">
              Browse templates
            </Link>
          </div>
        )}
      </Reveal>
    </div>
  );
}
