import type { ReactNode } from 'react';
import Reveal from '@/components/Reveal';

/* Shared shell for the five policy pages.
 *
 * They share a shell rather than each carrying their own markup because policy
 * pages drift: one gets a new heading style, another keeps last year's date
 * format, and a visitor reading two of them stops trusting either. One shell
 * means a change to how policies look is a change in one file.
 *
 * Section ids are derived from the heading text so the contents list, the
 * anchors and the headings can never disagree. */
export interface LegalSection {
  heading: string;
  body: ReactNode;
}

export function slug(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* One date for all five documents. A policy set where the Terms say March and
 * the Privacy Policy says August reads as neglected even when both are current,
 * so they are revised and dated together. */
export const LAST_UPDATED = '19 August 2026';

export default function LegalShell({
  title,
  summary,
  sections,
}: {
  title: string;
  summary: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-10 lg:py-20">
      <div className="max-w-3xl">
        <Reveal as="p" className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-faint">
          Legal
        </Reveal>
        <Reveal as="h1" delay={80} className="mt-4 font-[family-name:var(--font-display)] text-[42px] leading-[1.05] text-ink lg:text-[54px]">
          {title}
        </Reveal>
        <Reveal as="p" delay={150} className="mt-5 text-[15.5px] leading-relaxed text-ink-soft">
          {summary}
        </Reveal>
        <Reveal as="p" delay={200} className="mt-4 text-[12.5px] text-ink-faint">
          Last updated {LAST_UPDATED}
        </Reveal>
      </div>

      <div className="mt-14 grid gap-x-14 gap-y-10 lg:grid-cols-[240px_minmax(0,720px)]">
        {/* Sticky contents. Policy pages are long and people arrive looking for
            one clause, not to read from the top. */}
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-faint">
            On this page
          </h2>
          <ol className="mt-3 space-y-2">
            {sections.map((s, i) => (
              <li key={s.heading}>
                <a
                  href={`#${slug(s.heading)}`}
                  className="inline-block text-[13px] leading-snug text-ink-soft transition-[color,transform] duration-200 ease-[cubic-bezier(.22,.61,.36,1)] hover:translate-x-0.5 hover:text-ink"
                >
                  <span className="mr-2 text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12">
          {sections.map((s, i) => (
            <Reveal key={s.heading} as="section" delay={Math.min(i, 4) * 60}>
              {/* scroll-mt clears the sticky header when an anchor is followed,
                  which is otherwise the classic broken jump-link. */}
              <h2
                id={slug(s.heading)}
                className="scroll-mt-24 font-[family-name:var(--font-display)] text-[26px] leading-snug text-ink"
              >
                {s.heading}
              </h2>
              <div className="legal-body mt-3 space-y-3 text-[14px] leading-relaxed text-ink-soft">
                {s.body}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Small helpers so the policy pages read as prose rather than as a wall of
   Tailwind class strings. */
export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ml-4 list-disc space-y-1.5 marker:text-ink-faint">
      {items.map((item, i) => (
        <li key={i} className="pl-1">{item}</li>
      ))}
    </ul>
  );
}

/* Anything the operator must supply before publication. Rendered visibly rather
   than as a quiet blank so an unfilled placeholder cannot reach production
   unnoticed. */
export function Fill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-gold/15 px-1.5 py-0.5 font-medium text-ink ring-1 ring-gold/40">
      [{children}]
    </span>
  );
}
