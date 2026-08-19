import Link from 'next/link';
import { redirect } from 'next/navigation';
import Reveal from '@/components/Reveal';
import { createClient, currentUser } from '@/lib/supabase/server';
import { isConfigured } from '@/lib/supabase/config';
import { signOut } from './actions';

export const metadata = { title: 'Your events' };
export const dynamic = 'force-dynamic';

interface EventRow {
  id: string; title: string; category: string; published: boolean;
  event_date: string | null; updated_at: string;
  guests: { count: number }[];
}

export default async function EventsPage() {
  if (!isConfigured) {
    return (
      <Shell>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          This deployment has no database connected, so there are no saved events. Designing
          a card and browsing templates both work without one.
        </p>
      </Shell>
    );
  }

  const user = await currentUser();
  if (!user) redirect('/login?next=/events');

  const sb = await createClient();
  /* The embedded count is a single round trip. Fetching events and then a
     count per event would be one query per row, which is fine at three events
     and painful at thirty. */
  const { data } = await sb!
    .from('events')
    .select('id,title,category,published,event_date,updated_at,guests(count)')
    .order('updated_at', { ascending: false });

  const events = (data ?? []) as unknown as EventRow[];

  return (
    <Shell email={user.email ?? undefined}>
      {events.length === 0 ? (
        <div className="rounded-xl border border-line bg-paper p-8">
          <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink">
            Nothing saved yet
          </h2>
          <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-ink-soft">
            Pick a template, make it yours in the Studio, then save it here. Saved events
            keep their guest list and their replies.
          </p>
          <Link
            href="/templates"
            className="btn-sheen btn-press mt-6 inline-block rounded-lg bg-brand px-5 py-3 text-[13.5px] font-medium text-ivory hover:bg-brand-deep"
          >
            Browse templates
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((e, i) => (
            <Reveal key={e.id} delay={i * 60} className="h-full">
              <Link
                href={`/events/${e.id}`}
                className="tile flex h-full flex-col rounded-xl border border-line bg-paper p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-[family-name:var(--font-display)] text-[22px] leading-snug text-ink">
                    {e.title}
                  </h2>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.1em] ${
                      e.published
                        ? 'bg-brand-soft text-brand'
                        : 'bg-ivory text-ink-faint ring-1 ring-line'
                    }`}
                  >
                    {e.published ? 'Live' : 'Draft'}
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] capitalize text-ink-faint">{e.category}</p>
                <p className="mt-auto pt-6 text-[12.5px] text-ink-soft">
                  {e.guests?.[0]?.count ?? 0} guests
                  {e.event_date ? ` · ${new Date(e.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children, email }: { children: React.ReactNode; email?: string }) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-10 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Reveal as="p" className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-faint">
            Your account
          </Reveal>
          <Reveal as="h1" delay={80} className="mt-3 font-[family-name:var(--font-display)] text-[38px] leading-tight text-ink lg:text-[46px]">
            Your events
          </Reveal>
          {email && <p className="mt-2 text-[13px] text-ink-faint">Signed in as {email}</p>}
        </div>
        {email && (
          <form action={signOut}>
            <button className="btn-press rounded-lg border border-line bg-paper px-4 py-2.5 text-[13px] text-ink-soft transition-colors hover:border-ink-faint hover:text-ink">
              Sign out
            </button>
          </form>
        )}
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}
