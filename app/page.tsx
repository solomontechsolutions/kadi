import Link from 'next/link';
import HeroCards from './HeroCards';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import * as K from '@/engine/mwaliko-genome.js';

/* Counted from the engine at build time rather than typed in. The old page
 * hardcoded "55,000 combinations" in prose and it silently went stale twice as
 * the axes changed. */
const LAYOUTS = K.countValid();
const COMBINATIONS = LAYOUTS * 100 * 50;

const FEATURES = [
  {
    title: 'One invitation, every guest',
    body: 'Each guest gets their own link with their name on the card, their seat count, and a unique entry code.',
  },
  {
    /* Mwaliko does not collect RSVPs yet. The card carries a button pointing at
       whatever form the organiser already uses, so this line describes the
       button and not a reply inbox that does not exist. */
    title: 'RSVPs land where you collect them',
    body: 'Every card carries an RSVP button pointing at your own form, so replies arrive where you are already looking for them.',
  },
  {
    title: 'Doors that check themselves',
    body: 'Scan entry codes at the door from any phone. Works offline once the venue list is loaded.',
  },
  {
    title: 'Details in one place',
    body: 'Ceremony and reception times, directions, dress code, event colours and a guestbook, all on the invite.',
  },
];

const CATEGORY_TILES: [string, string, string][] = [
  ['wedding', 'Weddings', 'Harusi, from cathedral-formal to garden-intimate.'],
  ['sendoff', 'Send-Off', 'Bold, photo-forward cards for a full guest list.'],
  ['kitchenparty', 'Kitchen Party', 'Warm, celebratory, unmistakably East African.'],
  ['graduation', 'Graduation', 'Mahafali. Academic, proud, photograph-led.'],
  ['corporate', 'Corporate', 'Conferences, launches, galas and AGMs.'],
];

export default function Home() {
  return (
    <>
      {/* Hero: full-bleed split, not a centred column */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:px-10 lg:py-24">
          <div>
            {/* Staggered entrance. Each line arrives just behind the one above
                it, which is what makes a hero feel composed rather than simply
                faded in as a block. */}
            <Reveal as="p" className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-faint">
              Digital invitations
            </Reveal>
            <Reveal as="h1" delay={90} className="mt-4 font-[family-name:var(--font-display)] text-[52px] leading-[1.02] text-ink lg:text-[76px]">
              Every invitation you send,
              <span className="block italic text-brand">designed for the occasion.</span>
            </Reveal>
            <Reveal as="p" delay={180} className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-soft">
              Choose a card, make it yours, add your guest list, and send. Mwaliko handles
              the personalised links and the door, from harusi and send-offs to
              graduations and corporate galas.
            </Reveal>

            <Reveal delay={270} className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/templates"
                className="btn-sheen btn-press rounded-lg bg-brand px-6 py-3.5 text-[14px] font-medium text-ivory hover:bg-brand-deep"
              >
                Browse templates
              </Link>
              <Link
                href="/studio"
                className="btn-press rounded-lg border border-line bg-paper px-6 py-3.5 text-[14px] text-ink-soft transition-colors hover:border-ink-faint hover:text-ink"
              >
                Open the studio
              </Link>
            </Reveal>

            <Reveal as="dl" delay={360} className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
              <Stat value={LAYOUTS} label="card layouts" />
              <Stat value={100} label="colour palettes" />
              <Stat value={50} label="type pairings" />
            </Reveal>
            <Reveal as="p" delay={430} className="mt-4 text-[12.5px] text-ink-faint">
              {COMBINATIONS.toLocaleString()} possible cards, and no two templates in the
              library share a structure.
            </Reveal>
          </div>

          <HeroCards />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-[1600px] px-6 py-20 lg:px-10">
        <Reveal as="h2" className="font-[family-name:var(--font-display)] text-[36px] leading-tight text-ink lg:text-[44px]">
          Built for the events people actually host
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {CATEGORY_TILES.map(([key, name, blurb], i) => (
            <Reveal key={key} delay={i * 70}>
              <Link
                href={`/templates?category=${key}`}
                className="tile block h-full rounded-xl border border-line bg-paper p-6 hover:border-ink-faint"
              >
                <h3 className="font-[family-name:var(--font-display)] text-[24px] text-ink">{name}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-brand">
                  Browse
                  <span className="tile-arrow" aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-line bg-paper">
        <div className="mx-auto w-full max-w-[1600px] px-6 py-20 lg:px-10">
          <Reveal as="h2" className="font-[family-name:var(--font-display)] text-[36px] leading-tight text-ink lg:text-[44px]">
            Everything the invitation has to do
          </Reveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <span className="font-[family-name:var(--font-display)] text-[20px] text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-[16px] font-medium text-ink">{f.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] px-6 py-24 text-center lg:px-10">
        <Reveal as="h2" className="font-[family-name:var(--font-display)] text-[40px] leading-tight text-ink lg:text-[54px]">
          Start with a card you like.
        </Reveal>
        <Reveal as="p" delay={90} className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          Nothing to install and no card to print. Pick a template and you have a working
          invitation in a few minutes.
        </Reveal>
        <Reveal delay={180} className="mt-8">
          <Link
            href="/templates"
            className="btn-sheen btn-press inline-block rounded-lg bg-brand px-7 py-3.5 text-[14px] font-medium text-ivory hover:bg-brand-deep"
          >
            Browse templates
          </Link>
        </Reveal>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="font-[family-name:var(--font-display)] text-[30px] leading-none text-ink">
        <CountUp to={value} />
      </dt>
      <dd className="mt-1.5 text-[11.5px] uppercase tracking-[.1em] text-ink-faint">{label}</dd>
    </div>
  );
}
