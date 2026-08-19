import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import CardPreview from '@/components/CardPreview';
import GuestPanel, { type GuestRow } from './GuestPanel';
import { createClient, currentUser } from '@/lib/supabase/server';
import { isConfigured } from '@/lib/supabase/config';
import { setPublished } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EventPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isConfigured) notFound();

  const user = await currentUser();
  if (!user) redirect(`/login?next=/events/${id}`);

  const sb = await createClient();

  /* One query for the event, one for the guests with their replies nested.
     RLS scopes both to this organiser, so no owner check is written here: the
     database refuses to return another account's row at all. */
  const [{ data: event }, { data: guestRows }] = await Promise.all([
    sb!.from('events').select('id,title,category,slug,design,published,event_date').eq('id', id).maybeSingle(),
    sb!.from('guests')
      .select('id,name,seats,entry_code,checked_in_at,rsvps(attending,created_at)')
      .eq('event_id', id)
      .order('created_at', { ascending: true }),
  ]);

  if (!event) notFound();
  const guests = (guestRows ?? []) as unknown as GuestRow[];
  const design = (event.design ?? {}) as Record<string, unknown>;

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-14 lg:px-10 lg:py-18">
      <Link href="/events" className="text-[13px] text-ink-soft hover:text-ink">
        Back to your events
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[36px] leading-tight text-ink lg:text-[44px]">
            {event.title}
          </h1>
          <p className="mt-2 text-[13px] text-ink-faint">
            {event.published ? 'Live. Guest links work.' : 'Draft. Guest links show nothing yet.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/studio?event=${event.id}`}
            className="btn-press rounded-lg border border-line bg-paper px-4 py-2.5 text-[13px] text-ink-soft transition-colors hover:border-ink-faint hover:text-ink"
          >
            Edit the design
          </Link>
          <form action={async () => { 'use server'; await setPublished(event.id, !event.published); }}>
            <button className="btn-press rounded-lg bg-brand px-4 py-2.5 text-[13px] font-medium text-ivory hover:bg-brand-deep">
              {event.published ? 'Unpublish' : 'Publish'}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-14">
        <div>
          <div className="lg:sticky lg:top-24">
            <div className="thumb card-stage-paper rounded-xl border border-line shadow-[0_16px_44px_-24px_rgba(22,41,74,.4)]">
              <CardPreview design={design} thumb guestName="" />
            </div>
          </div>
        </div>
        <GuestPanel
          eventId={event.id}
          slug={event.slug}
          guests={guests}
          published={event.published}
        />
      </div>
    </div>
  );
}
