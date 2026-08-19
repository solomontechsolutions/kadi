import { notFound } from 'next/navigation';
import CardPreview from '@/components/CardPreview';
import RsvpForm from './RsvpForm';
import { createClient } from '@/lib/supabase/server';
import { isConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

/* One guest's invitation.
 *
 * The lookup goes through guest_by_entry_code, a security-definer function
 * whose where-clause is the access control: an entry code buys exactly one row
 * and reveals nothing about the rest of the list. There is deliberately no
 * public select policy on the guests table, so even a determined caller with
 * the publishable key cannot enumerate a guest list.
 *
 * noindex because a guest link is personal. It carries somebody's name and
 * their seat count, and it should not turn up in a search for their name. */
export const metadata = {
  title: 'You are invited',
  robots: { index: false, follow: false },
};

export default async function InvitePage({
  params,
}: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!isConfigured) notFound();

  const sb = await createClient();
  const { data } = await sb!.rpc('guest_by_entry_code', { code });
  const guest = Array.isArray(data) ? data[0] : data;
  if (!guest) notFound();

  const design = (guest.design ?? {}) as Record<string, unknown>;

  const { data: replies } = await sb!
    .from('rsvps')
    .select('attending,created_at')
    .eq('guest_id', guest.guest_id)
    .order('created_at', { ascending: false })
    .limit(1);
  const existing = replies?.[0] ? { attending: replies[0].attending } : null;

  return (
    <div className="mx-auto w-full max-w-[560px] px-5 py-12 lg:py-16">
      <div className="thumb card-stage rounded-xl border border-line shadow-[0_18px_50px_-24px_rgba(22,41,74,.4)]">
        <CardPreview design={design} thumb guestName={guest.guest_name} seats={guest.seats} />
      </div>

      <div className="mt-8">
        <RsvpForm
          code={code}
          guestName={guest.guest_name}
          seats={guest.seats}
          existing={existing}
        />
      </div>

      <p className="mt-6 text-center text-[12px] leading-relaxed text-ink-faint">
        This invitation is personal to {guest.guest_name}. Please do not forward the link:
        the code on it is what admits you at the door.
      </p>
    </div>
  );
}
