import Reveal from '@/components/Reveal';
import { Fill } from '@/components/LegalShell';

export const metadata = {
  title: 'Contact',
  description:
    'Talk to Mwaliko about corporate pricing, a bespoke card design, or support ' +
    'for an event you are running.',
};

/* Deliberately not a form. A form needs a backend to receive it, and a contact
 * form that silently drops messages is worse than no form at all. Direct
 * channels work from the first day the page is live, and a form can replace
 * them once there is somewhere for the submissions to go. */
const CHANNELS = [
  {
    title: 'Corporate and volume pricing',
    body: 'Conferences, launches, AGMs and anything running across several events. Tell us the event, the rough guest count and the date.',
    contact: 'sales email address',
  },
  {
    title: 'Support for a live event',
    body: 'Something is wrong and your event is soon. Include your event name so we can find it quickly.',
    contact: 'support email address',
  },
  {
    title: 'Bespoke card design',
    body: 'You want a card designed rather than chosen. Send any brand colours, fonts or reference images you already have.',
    contact: 'design email address',
  },
  {
    title: 'Privacy, legal and compliance',
    body: 'Data requests, due diligence questionnaires and formal notices.',
    contact: 'legal email address',
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
      <div className="max-w-3xl">
        <Reveal as="p" className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-faint">
          Contact
        </Reveal>
        <Reveal as="h1" delay={90} className="mt-4 font-[family-name:var(--font-display)] text-[46px] leading-[1.04] text-ink lg:text-[58px]">
          Talk to us.
        </Reveal>
        <Reveal as="p" delay={180} className="mt-5 text-[16px] leading-relaxed text-ink-soft">
          Pick the channel that matches what you need. If your event is within 48 hours, say
          so in the subject line and we will move it to the front.
        </Reveal>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {CHANNELS.map((c, i) => (
          <Reveal key={c.title} delay={i * 80} className="h-full">
            <div className="tile flex h-full flex-col rounded-2xl border border-line bg-paper p-7">
              <h2 className="font-[family-name:var(--font-display)] text-[23px] leading-snug text-ink">
                {c.title}
              </h2>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{c.body}</p>
              <p className="mt-5 text-[13px]">
                <Fill>{c.contact}</Fill>
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 rounded-2xl border border-line bg-paper p-8 lg:p-10">
        <h2 className="font-[family-name:var(--font-display)] text-[26px] text-ink">Office</h2>
        <div className="mt-3 space-y-1.5 text-[14px] leading-relaxed text-ink-soft">
          <p><Fill>physical address</Fill></p>
          <p><Fill>telephone number</Fill></p>
          <p>Hours: <Fill>opening hours</Fill></p>
        </div>
      </Reveal>
    </div>
  );
}
