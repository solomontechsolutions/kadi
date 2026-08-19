# Mwaliko

Digital event invitations for the Tanzanian market. An organiser designs a card,
uploads a guest list, and every guest receives a personal link carrying their own
name, seat count and entry code. RSVPs come back to the organiser, and entry codes
are scanned at the door on the night.

## House rules

**Never use em-dashes.** Not in site copy, not in code comments, not in commit
messages, not in replies. Use a comma, a colon, a full stop, or rewrite the
sentence. This applies to every file in this repository and to anything written
about it.

**Brand is Mwaliko.** The product was called Kadi until August 2026. No new
occurrence of "Kadi" should appear anywhere. Two deliberate exceptions remain and
must not be changed casually:

- `SITE_ID = 'kadi-nur8'` in `public/guestbook.html` is a Supabase row key.
  Changing it orphans every guestbook message already stored.
- The GitHub repository is still named `kadi`.

## Layout

| Path | What it is |
| --- | --- |
| `app/` | Next.js App Router pages. Marketing site, pricing, and the five policy pages. |
| `engine/` | The genome engine. Framework-neutral ES modules plus card CSS, the single source of every card design. |
| `public/engine/` | Generated copy of `engine/`, rebuilt on every dev and build by `scripts/sync-engine.mjs`. Gitignored. Never edit. |
| `public/*.html` | The original static pages, still in production: the invite, the door scanner, the guestbook and the legacy studio. |
| `components/` | Shared React components, including the motion primitives. |
| `lib/templates.ts` | The curated window onto the engine's design space that the gallery browses. |
| `supabase/schema.sql` | Database schema. Idempotent, safe to re-run. |

## Conventions

**Fonts.** The site chrome uses Apple's system faces, San Francisco through
`-apple-system` and New York through `ui-serif`. They are never downloaded,
because Apple licenses them for Apple platforms only. Cards are unaffected: the
engine sets its own type pairings per design.

**Motion.** Animate transform and opacity only, so work stays on the compositor.
Every animation lives inside `@media (prefers-reduced-motion: no-preference)`,
and anything that hides content until script runs must be visible by default if
that script never arrives. `components/Reveal.tsx` and `components/CountUp.tsx`
are the two primitives; prefer them over new one-off effects.

**The card engine is the source of truth.** The marketing site counts layouts by
calling `countValid()` rather than quoting a number in prose, because hardcoded
figures went stale twice. Hero and gallery cards are rendered by the same engine
the studio uses, so the site cannot advertise a look the product cannot produce.

**Vercel.** `vercel.json` pins `framework: nextjs` and nothing else. Vercel
validates the file against a closed schema and rejects unknown keys, including a
`"//"` comment block, so do not add one: the build fails before it starts.

## Commands

```
npm run dev            # sync engine, then next dev
npm run build          # sync engine, then next build
npm run verify:engine  # check the engine's design space invariants
```

## Known state

The `/studio` route is a landing page explaining the Studio, not the editor. The
working editor is `public/studio-legacy.html`. Rebuilding it on the genome engine
is the next milestone.

Supabase is wired up in `lib/supabase/` but nothing under `app/` imports it yet,
so no environment variables are needed to build or run the site. The guestbook
page talks to Supabase directly with its own client.

The legal pages carry deliberate `[bracketed]` placeholders wherever company
registration details or contact addresses are required. They render highlighted
so an unfilled one cannot ship unnoticed. They have not been reviewed by a
lawyer.
