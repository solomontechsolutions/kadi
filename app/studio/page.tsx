import Link from 'next/link';
import Reveal from '@/components/Reveal';

export const metadata = {
  title: 'Studio',
  description:
    'The Studio is where you turn a template into your invitation: your names, ' +
    'your date and venue, your colours, then your guest list.',
};

/* The old page said only "the new studio is being built" and dropped the
 * visitor on a link. That tells someone who has never used Mwaliko nothing
 * about what the Studio is for, which is the single question the page exists to
 * answer. The staged list below doubles as the roadmap: it is honest about
 * which parts run in the legacy editor today. */
const STEPS = [
  {
    n: '01',
    title: 'Pick the design',
    body: 'Start from a template, then change the layout, palette, type pairing and ornament until the card is yours. Every change redraws the real card, not a preview of one.',
    where: 'Working today',
  },
  {
    n: '02',
    title: 'Fill in the occasion',
    body: 'Names, date, times, venue and directions, dress code and event colours. The card reflows as you type, so you can see when a long venue name needs a shorter line.',
    where: 'Working today',
  },
  {
    n: '03',
    title: 'Add the guest list',
    body: 'Each guest gets a personal link carrying their own name, their seat count and a unique entry code for the door.',
    where: 'Working today',
  },
  {
    n: '04',
    title: 'Send and track',
    body: 'Send each guest their link over WhatsApp, then scan entry codes at the door on the night. The scanner keeps working when the venue has no signal.',
    where: 'Working today',
  },
  {
    n: '05',
    title: 'Save to your account',
    body: 'Come back to an event later, from any device, and keep several events side by side.',
    where: 'In progress',
  },
  {
    n: '06',
    title: 'Collect the RSVPs here',
    body: 'Replies gathered in Mwaliko instead of in a separate form, shown against your guest list. Until this lands, the RSVP button on each card points at a form of your own.',
    where: 'In progress',
  },
];

export default function StudioPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
      <div className="max-w-3xl">
        <Reveal as="p" className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-faint">
          The Studio
        </Reveal>
        <Reveal as="h1" delay={90} className="mt-4 font-[family-name:var(--font-display)] text-[46px] leading-[1.04] text-ink lg:text-[62px]">
          Where a template becomes
          <span className="block italic text-brand">your invitation.</span>
        </Reveal>
        <Reveal as="p" delay={180} className="mt-6 text-[16px] leading-relaxed text-ink-soft">
          Templates show you what is possible. The Studio is the editor where you make one
          of them real: your names on the card, your date and venue, your colours, and then
          the guest list that turns a single design into a personal link for every person
          you are inviting.
        </Reveal>
        <Reveal delay={270} className="mt-8 flex flex-wrap gap-3">
          <a
            href="/studio-legacy.html"
            className="btn-sheen btn-press rounded-lg bg-brand px-6 py-3.5 text-[14px] font-medium text-ivory hover:bg-brand-deep"
          >
            Open the Studio
          </a>
          <Link
            href="/templates"
            className="btn-press rounded-lg border border-line bg-paper px-6 py-3.5 text-[14px] text-ink-soft transition-colors hover:border-ink-faint hover:text-ink"
          >
            Start from a template
          </Link>
        </Reveal>
      </div>

      <div className="mt-20 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 70}>
            <div className="flex items-center gap-3">
              <span className="font-[family-name:var(--font-display)] text-[20px] text-gold">{s.n}</span>
              <span
                className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[.1em] ${
                  s.where === 'In progress'
                    ? 'bg-ivory text-ink-faint ring-1 ring-line'
                    : 'bg-brand-soft text-brand'
                }`}
              >
                {s.where}
              </span>
            </div>
            <h2 className="mt-3 text-[17px] font-medium text-ink">{s.title}</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{s.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20 rounded-2xl border border-line bg-paper p-8 lg:p-10">
        <h2 className="font-[family-name:var(--font-display)] text-[26px] text-ink">
          A note on what you are opening
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          The Open the Studio button above loads the current editor, which does everything
          in steps one to four and is what customers are using now. It is being rebuilt on
          the same design engine that draws the template gallery, and the new version will
          replace it here without changing any invitation you have already sent.
        </p>
      </Reveal>
    </div>
  );
}
