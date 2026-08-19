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
 * `included: false` renders a feature greyed out rather than hiding it. Showing
 * what a tier does not include is what makes the ladder legible: hide the gaps
 * and every tier looks the same at a glance. */
interface Tier {
  name: string;
  blurb: string;
  price: string;
  unit?: string;
  featured?: boolean;
  cta: { label: string; href: string };
  features: { label: string; included?: boolean }[];
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    blurb: 'For small personal events',
    price: 'TZS 1,500',
    unit: '/card',
    cta: { label: 'Get started', href: '/templates' },
    features: [
      { label: 'Digital invitation cards' },
      { label: 'A personal link for every guest' },
      { label: 'QR entry code verification' },
      { label: 'RSVP tracking' },
      { label: 'Guestbook messages' },
      { label: 'Custom card design', included: false },
      { label: 'Priority support', included: false },
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
      { label: 'Everything in Starter' },
      { label: 'WhatsApp and SMS sharing' },
      { label: 'Seat allocation per guest' },
      { label: 'Door scanner for your team' },
      { label: 'Event colours and dress code' },
      { label: 'Custom card design' },
    ],
  },
  {
    name: 'Premium',
    blurb: 'Full-scale event operations',
    price: 'TZS 2,500',
    unit: '/card',
    cta: { label: 'Get started', href: '/templates' },
    features: [
      { label: 'Everything in Advance' },
      { label: 'Bespoke card designed for you' },
      { label: 'Live entry dashboard' },
      { label: 'Pledge tracking' },
      { label: 'Dedicated account manager' },
      { label: 'Priority support' },
    ],
  },
  {
    name: 'Corporate',
    blurb: 'Conferences, launches and AGMs',
    price: 'Contact us',
    cta: { label: 'Talk to us', href: '/contact' },
    features: [
      { label: 'Everything in Premium' },
      { label: 'Volume pricing across events' },
      { label: 'Branded invitations' },
      { label: 'Invoicing and procurement support' },
      { label: 'Onboarding for your team' },
      { label: 'Service level agreement' },
    ],
  },
];

const FAQ = [
  {
    q: 'What counts as one card?',
    a: 'One card is one guest invitation, with that guest’s name on it and their own entry code. A couple invited together on a single link is one card, not two.',
  },
  {
    q: 'Do I pay before I can see my design?',
    a: 'No. You can build the whole invitation in the Studio and see exactly how it looks first. Payment applies when you send to your guest list.',
  },
  {
    q: 'What if a guest never opens the link?',
    a: 'You still see it. The RSVP view separates guests who have not opened from those who have opened but not replied, so you know who needs a follow-up call.',
  },
  {
    q: 'Can I change the design after sending?',
    a: 'Yes. Guest links point at the live invitation, so a corrected venue or time reaches everyone who opens the link from that moment on.',
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

      <Reveal as="p" delay={120} className="mt-8 text-[12.5px] leading-relaxed text-ink-faint">
        Prices are in Tanzanian shillings and exclude VAT where it applies. Corporate
        pricing is quoted per engagement.
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
          const on = f.included !== false;
          return (
            <li key={f.label} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
              <span
                aria-hidden="true"
                className={
                  on
                    ? featured ? 'text-gold' : 'text-brand'
                    : featured ? 'text-brand-deep' : 'text-line'
                }
              >
                &#10003;
              </span>
              <span
                className={
                  on
                    ? featured ? 'text-ivory' : 'text-ink-soft'
                    : featured ? 'text-brand-deep' : 'text-ink-faint/60'
                }
              >
                {f.label}
              </span>
              {!on && <span className="sr-only">not included</span>}
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
