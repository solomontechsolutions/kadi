import Link from 'next/link';
import Reveal from '@/components/Reveal';

export const metadata = {
  title: 'Pricing',
  description:
    'Mwaliko pricing, charged per invitation card. Starter, Advance and Premium ' +
    'tiers for personal events, and bespoke pricing for corporate volume.',
};

/* Priced per card rather than per event or per month. That is the unit
 * organisers in this market already budget in, because it is how printed
 * invitations have always been quoted, so a quote from Mwaliko can be compared
 * to a quote from a printer without anyone doing arithmetic.
 *
 * Every line carries a status, and the page will not let one be omitted.
 *
 *   'live'     shipped and working today
 *   'soon'     on the roadmap, rendered with a Soon chip
 *   'excluded' deliberately not in this tier, rendered greyed
 *
 * The type has no default for status. That is the point: adding a feature
 * forces whoever adds it to state whether it exists, and a tier listing a
 * capability the product does not have will not compile. This page previously
 * advertised RSVP tracking, SMS delivery, a live entry dashboard and pledge
 * tracking as though all four were built. None of them were.
 *
 * Human services count as live. A dedicated account manager or a bespoke card
 * design is a real commitment the moment somebody is willing to do the work,
 * unlike a dashboard, which either exists in the code or does not. */
type Status = 'live' | 'soon' | 'excluded';

interface Feature {
  label: string;
  status: Status;
  /* Shown under a soon line. Says what an organiser does in the meantime, so
     the roadmap reads as a plan rather than as a gap. */
  today?: string;
}

interface Tier {
  name: string;
  blurb: string;
  price: string;
  unit?: string;
  featured?: boolean;
  cta: { label: string; href: string };
  features: Feature[];
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    blurb: 'For small personal events',
    price: 'TZS 1,500',
    unit: '/card',
    cta: { label: 'Get started', href: '/templates' },
    features: [
      { label: 'Digital invitation cards', status: 'live' },
      { label: 'A personal link for every guest', status: 'live' },
      { label: 'QR entry code on every card', status: 'live' },
      { label: 'Guestbook messages', status: 'live' },
      {
        label: 'RSVP replies collected for you',
        status: 'soon',
        today: 'Today every card carries an RSVP button pointing at your own form.',
      },
      { label: 'Custom card design', status: 'excluded' },
      { label: 'Priority support', status: 'excluded' },
    ],
  },
  {
    name: 'Advance',
    blurb: 'For growing celebrations',
    price: 'TZS 2,000',
    unit: '/card',
    featured: true,
    cta: { label: 'Get started', href: '/templates' },
    features: [
      { label: 'Everything in Starter', status: 'live' },
      { label: 'Share to WhatsApp per guest', status: 'live' },
      { label: 'Seat allocation per guest', status: 'live' },
      { label: 'Door scanner for your team', status: 'live' },
      { label: 'Event colours and dress code', status: 'live' },
      { label: 'Custom card design', status: 'live' },
      {
        label: 'Automatic SMS delivery',
        status: 'soon',
        today: 'Links send by hand from your own phone.',
      },
    ],
  },
  {
    name: 'Premium',
    blurb: 'Full-scale event operations',
    price: 'TZS 2,500',
    unit: '/card',
    cta: { label: 'Get started', href: '/templates' },
    features: [
      { label: 'Everything in Advance', status: 'live' },
      { label: 'Bespoke card designed for you', status: 'live' },
      { label: 'Dedicated account manager', status: 'live' },
      { label: 'Priority support', status: 'live' },
      {
        label: 'Live entry dashboard',
        status: 'soon',
        today: 'The scanner shows arrivals on the device doing the scanning.',
      },
      { label: 'Pledge tracking', status: 'soon' },
    ],
  },
  {
    name: 'Corporate',
    blurb: 'Conferences, launches and AGMs',
    price: 'Contact us',
    cta: { label: 'Talk to us', href: '/contact' },
    features: [
      { label: 'Everything in Premium', status: 'live' },
      { label: 'Volume pricing across events', status: 'live' },
      { label: 'Invitations in your brand', status: 'live' },
      { label: 'Invoicing and procurement support', status: 'live' },
      { label: 'Onboarding for your team', status: 'live' },
      { label: 'Service level agreement', status: 'live' },
    ],
  },
];

const FAQ = [
  {
    q: 'What counts as one card?',
    a: 'One card is one guest invitation, with that guest’s name on it and their own entry code. A couple invited together on a single link is one card, not two.',
  },
  {
    q: 'How do RSVPs work right now?',
    a: 'Every invitation carries an RSVP button that opens whichever form you already use, such as a Google Form. Replies land in that form, not in Mwaliko. Collecting them for you is the next thing we are building, and it will not change the links you have already sent.',
  },
  {
    q: 'Do I pay before I can see my design?',
    a: 'No. You can build the whole invitation and see exactly how it looks first. Payment applies when you send to your guest list.',
  },
  {
    q: 'Can I change the details after sending?',
    a: 'Yes. A guest link carries only who the guest is, so the date, venue and design all live in one place. Correct them once and every guest who opens their link from that point on sees the correction, with no new links to send.',
  },
  {
    q: 'What happens if the venue has no signal?',
    a: 'The door scanner keeps working. It loads the guest list onto the phone before the event and verifies entry codes on the device, so admitting guests never depends on the network at the venue.',
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
      <div className="max-w-3xl">
        <Reveal as="p" className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-faint">
          Pricing
        </Reveal>
        <Reveal as="h1" delay={90} className="mt-4 font-[family-name:var(--font-display)] text-[46px] leading-[1.04] text-ink lg:text-[62px]">
          Priced per card,
          <span className="block italic text-brand">the way invitations always were.</span>
        </Reveal>
        <Reveal as="p" delay={180} className="mt-6 text-[16px] leading-relaxed text-ink-soft">
          No subscription and no monthly fee. You pay for the guests you actually invite,
          so a hundred-guest harusi costs what a hundred-guest harusi should cost.
        </Reveal>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {TIERS.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 80} className="h-full">
            <PriceCard tier={tier} />
          </Reveal>
        ))}
      </div>

      <Reveal as="p" delay={120} className="mt-8 max-w-3xl text-[12.5px] leading-relaxed text-ink-faint">
        Prices are in Tanzanian shillings and exclude VAT where it applies. Corporate
        pricing is quoted per engagement. Anything marked <SoonChip /> is on the roadmap
        rather than in the product today, and is never charged for until it ships.
      </Reveal>

      <div className="mt-24 grid gap-x-14 gap-y-10 border-t border-line pt-16 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal as="h2" className="font-[family-name:var(--font-display)] text-[34px] leading-tight text-ink lg:text-[42px]">
          Questions we get asked
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={i * 70}>
              <h3 className="text-[15px] font-medium text-ink">{item.q}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{item.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* The same chip as the one on the tier cards, so the footnote and the lines it
   refers to are visibly the same marker rather than two similar ones. */
function SoonChip() {
  return (
    <span className="mx-0.5 inline-block rounded-full bg-ivory px-1.5 py-px text-[9.5px] font-semibold uppercase tracking-[.1em] text-ink-faint ring-1 ring-line">
      Soon
    </span>
  );
}

function PriceCard({ tier }: { tier: Tier }) {
  const featured = tier.featured === true;

  return (
    <div
      className={`tile relative flex h-full flex-col rounded-2xl border p-7 ${
        featured
          ? 'border-brand bg-brand text-ivory shadow-[0_24px_60px_-28px_rgba(70,88,61,.7)]'
          : 'border-line bg-paper'
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[.12em] text-ink">
          Most popular
        </span>
      )}

      <h2 className={`font-[family-name:var(--font-display)] text-[27px] ${featured ? 'text-ivory' : 'text-ink'}`}>
        {tier.name}
      </h2>
      <p className={`mt-1 text-[13px] ${featured ? 'text-brand-soft' : 'text-ink-faint'}`}>{tier.blurb}</p>

      <p className="mt-6 flex items-baseline gap-1.5">
        <span
          className={`font-[family-name:var(--font-display)] leading-none ${
            tier.unit ? 'text-[38px]' : 'text-[31px]'
          } ${featured ? 'text-ivory' : 'text-ink'}`}
        >
          {tier.price}
        </span>
        {tier.unit && (
          <span className={`text-[13px] ${featured ? 'text-brand-soft' : 'text-ink-faint'}`}>{tier.unit}</span>
        )}
      </p>

      <ul className="mt-7 flex-1 space-y-3">
        {tier.features.map(f => {
          const excluded = f.status === 'excluded';
          const soon = f.status === 'soon';
          return (
            <li key={f.label} className="text-[13.5px] leading-snug">
              <div className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className={
                    excluded
                      ? featured ? 'text-brand-deep' : 'text-line'
                      : featured ? 'text-gold' : 'text-brand'
                  }
                >
                  {excluded ? '\u00d7' : '\u2713'}
                </span>
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={
                      excluded
                        ? featured ? 'text-brand-deep' : 'text-ink-faint/60'
                        : featured ? 'text-ivory' : 'text-ink-soft'
                    }
                  >
                    {f.label}
                  </span>
                  {soon && (
                    <span
                      className={`rounded-full px-1.5 py-px text-[9.5px] font-semibold uppercase tracking-[.1em] ${
                        featured
                          ? 'bg-brand-deep text-brand-soft'
                          : 'bg-ivory text-ink-faint ring-1 ring-line'
                      }`}
                    >
                      Soon
                    </span>
                  )}
                  {excluded && <span className="sr-only">not included</span>}
                </span>
              </div>
              {f.today && (
                <p
                  className={`mt-1 pl-[22px] text-[11.5px] leading-snug ${
                    featured ? 'text-brand-soft/80' : 'text-ink-faint'
                  }`}
                >
                  {f.today}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <Link
        href={tier.cta.href}
        className={`btn-sheen btn-press mt-8 rounded-lg px-5 py-3 text-center text-[13.5px] font-medium ${
          featured
            ? 'bg-gold text-ink hover:brightness-105'
            : 'border border-brand text-brand hover:bg-brand hover:text-ivory'
        }`}
      >
        {tier.cta.label}
      </Link>
    </div>
  );
}
