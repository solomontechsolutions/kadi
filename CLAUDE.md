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

**Brand.** Navy `#071F37` with gold `#C2903C`, sampled from `Logo.png` itself so the chrome and the artwork are the same two colours. Colour
tokens in `app/globals.css` are named for their job (`brand`, `ink`, `line`) and
never for their hue, because the previous set was called `sage` and had to be
renamed the moment the brand stopped being green.

**Logo.** `Logo.png` at the repository root is the delivered artwork and the
source of truth. `npm run build:logo` cuts it into `public/brand/logo.png` (full
lockup with the tagline, used in the footer), `public/brand/logo-compact.png`
(tagline removed, used in the header, where the full lockup would set the
tagline about three pixels tall), `public/brand/mark.png` and `public/icon.png`
(square monogram on cream, for the favicon and the installed scanner app).
Replace `Logo.png`, re-run the script, and every surface updates. The crop
bounds inside the script are measured from the current artwork, so art with a
different composition means re-measuring those six numbers. The script needs
python3 with Pillow, and it deliberately does not run during `npm run build`:
this is a once-a-rebrand job, not a per-deploy one.

**Fonts.** The site chrome uses Apple's system faces, San Francisco through
`-apple-system` and New York through `ui-serif`. They are never downloaded,
because Apple licenses them for Apple platforms only. Cards are unaffected: the
engine sets its own type pairings per design.

**Motion.** Animate transform and opacity only, so work stays on the compositor.
Every animation lives inside `@media (prefers-reduced-motion: no-preference)`,
and anything that hides content until script runs must be visible by default if
that script never arrives. `components/Reveal.tsx` and `components/CountUp.tsx`
are the two primitives; prefer them over new one-off effects.

**Sample content is per category.** `SAMPLES` in `lib/templates.ts` gives each
category its own names, eyebrow, venue and colour policy. Every card in the
gallery once rendered the same wedding couple, so a Corporate card announced
"Amara & Julian, together with their families". A single subject leaves `p2`
empty and the renderer drops the ampersand; corporate, graduation, faith and
memorial cards carry no event colours.

**Never publish organiser tools in the marketing footer.** The door scanner,
the guestbook and the legacy studio open onto live event data. They were once
listed publicly, which showed prospective customers a real guest's message on
another couple's guestbook. They stay reachable by direct link only.

**Never advertise what is not built.** Every line on the pricing page carries a
`status` of `live`, `soon` or `excluded`, and the type has no default, so adding
a feature forces a decision about whether it exists. `soon` lines render a Soon
chip and, where useful, a note saying what an organiser does in the meantime.
The page once sold RSVP tracking, SMS delivery, a live entry dashboard and
pledge tracking as though all four shipped; none had been written. Human
services such as a bespoke design or an account manager do count as live.

**RSVP is not built yet.** Cards carry an RSVP button pointing at a form the
organiser supplies, and it renders disabled when no URL is given. There is no
SMS sending anywhere in the codebase, and WhatsApp is a per-guest share link the
organiser taps by hand. Marketing copy must say so.

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
