/* The visual similarity test.
 *
 * Compares every archetype against every other on the eight composition traits
 * in docs/design-matrix.md, and fails when a pair agrees on more than three.
 *
 * This is the mechanical half of the instruction "if removing the colour and
 * decoration makes two templates look almost identical, they are not
 * sufficiently different". It cannot judge whether a design is good. It can
 * only catch the specific regression that produced the previous library, where
 * every card shared one composition and the differences lived entirely in
 * colour, typeface and corner ornament, so the CSS looked varied and the screen
 * did not.
 *
 * It also checks that no two archetypes share a CSS class prefix, since sharing
 * class names is how two compositions quietly converge back into one.
 */
import { ARCHETYPES } from '../engine/archetypes.js';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAX_SHARED_TRAITS = 3;

let failed = 0;
const fail = (m) => { console.error('  FAIL ' + m); failed++; };

console.log(`Comparing ${ARCHETYPES.length} archetypes pairwise.\n`);

/* Every archetype must declare the same trait keys, or a missing key would
   silently count as agreement between two designs. */
const KEYS = Object.keys(ARCHETYPES[0].traits).sort();
for (const a of ARCHETYPES) {
  const k = Object.keys(a.traits).sort();
  if (k.join() !== KEYS.join()) fail(`${a.id} declares traits [${k}], expected [${KEYS}]`);
}

let worst = { n: -1, pair: '' };
for (let i = 0; i < ARCHETYPES.length; i++) {
  for (let j = i + 1; j < ARCHETYPES.length; j++) {
    const a = ARCHETYPES[i], b = ARCHETYPES[j];
    const shared = KEYS.filter(k => a.traits[k] === b.traits[k]);
    if (shared.length > worst.n) worst = { n: shared.length, pair: `${a.id} vs ${b.id}` };
    if (shared.length > MAX_SHARED_TRAITS) {
      fail(`${a.id} and ${b.id} share ${shared.length} traits: ${shared.join(', ')}`);
    }
  }
}
console.log(`  ok   closest pair is ${worst.pair}, sharing ${worst.n} of ${KEYS.length} traits`);

/* Each archetype owns a class prefix. Shared prefixes mean shared CSS, which
   means a change to one design silently reshapes another.

   Selectors are collected per line rather than by carving the file into blocks:
   block boundaries are a comment convention and get out of step, whereas the
   [data-arch] attribute is the thing that actually scopes a rule. The card
   shell prefix is excluded because every archetype is meant to share it. */
const css = readFileSync(resolve(root, 'engine/archetypes.css'), 'utf8');
const SHELL = 'mw';
const prefixes = new Map();
const seen = new Set();

for (const line of css.split('\n')) {
  const owner = line.match(/\[data-arch="([a-z]+)"\]/);
  if (!owner) continue;
  seen.add(owner[1]);
  for (const m of line.matchAll(/\.([a-z]{2,3})-[a-z]+/g)) {
    if (m[1] === SHELL) continue;
    if (!prefixes.has(m[1])) prefixes.set(m[1], new Set());
    prefixes.get(m[1]).add(owner[1]);
  }
}

for (const a of ARCHETYPES) {
  if (!seen.has(a.id)) fail(`${a.id} has no CSS scoped to [data-arch="${a.id}"]`);
}
for (const [pfx, owners] of prefixes) {
  if (owners.size > 1) fail(`class prefix .${pfx}- is shared by ${[...owners].join(' and ')}`);
}
console.log(`  ok   ${prefixes.size} class prefixes, each owned by exactly one archetype`);

/* Rendering with identical content is the real test the instructions describe:
   same names, same date, same venue. If two archetypes emit the same markup
   they are the same design however different their CSS is. */
const SAMPLE = {
  p1: 'Amara', p2: 'Julian', eyebrow: 'Together with their families',
  wdate: '2027-02-14', wtime: '16:30',
  venue: 'The Old Botanical Hall', city: 'Dar es Salaam',
  showEventColors: true, eventColors: ['#8C1F28', '#C9A227', '#2F4858'],
};
const shapes = new Map();
for (const a of ARCHETYPES) {
  const html = a.render(SAMPLE, 'Neema Mushi', 2);
  if (!html.includes('Amara')) fail(`${a.id} drops the first name`);
  if (!html.includes('Neema Mushi')) fail(`${a.id} drops the guest personalisation`);
  /* Structural fingerprint: tag sequence with the text stripped out. */
  const shape = (html.match(/<[a-z][a-z0-9]*/g) || []).join('');
  if (shapes.has(shape)) fail(`${a.id} emits the same structure as ${shapes.get(shape)}`);
  shapes.set(shape, a.id);
}
console.log(`  ok   ${shapes.size} distinct structures from identical content`);

/* A single subject must never trail a dangling ampersand, the bug that made
   every corporate and memorial card read as a wedding. */
for (const a of ARCHETYPES) {
  const html = a.render({ ...SAMPLE, p2: '' }, '', 1);
  const stripped = html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&');
  if (/&\s*$/.test(stripped.trim()) || /Amara\s*&\s*(?![A-Za-z])/.test(stripped)) {
    fail(`${a.id} leaves a dangling ampersand when there is one name`);
  }
}
console.log('  ok   single-subject cards carry no dangling ampersand');

console.log(failed
  ? `\n${failed} problem(s). The library is not sufficiently varied.`
  : '\nAll design invariants hold.');
process.exit(failed ? 1 : 0);
