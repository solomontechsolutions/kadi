/* Guards the two invariants the whole template system rests on.
 *
 * Run in CI or by hand (npm run verify:engine). These are the properties that,
 * if they quietly break, put us straight back to "285,000 combinations that all
 * look the same" without anyone noticing until customers say so.
 */
import * as K from '../engine/kadi-genome.js';

let failures = 0;
const fail = (msg) => { console.error('  FAIL ' + msg); failures++; };
const ok = (msg) => console.log('  ok   ' + msg);

/* 1. The design space is actually large.
   The count is enumerated, never estimated -- it is a number we put in front of
   customers, so it has to be the real one. */
const raw = K.AXES.reduce((n, a) => n * a.values.length, 1);
const valid = K.countValid();
console.log(`\nDesign space: ${valid.toLocaleString()} valid of ${raw.toLocaleString()} raw ` +
            `(${(100 * valid / raw).toFixed(1)}% survive pruning)`);
if (valid < 10000) fail(`only ${valid} valid layouts, target is >10,000`);
else ok(`${valid.toLocaleString()} valid structural layouts (>10,000)`);

/* 2. No axis is dead weight.
   An axis whose values never change the outcome is decoration on the picker and
   a lie in the combination count. */
console.log('\nAxis sanity:');
for (const a of K.AXES) {
  if (a.values.length < 2) { fail(`axis "${a.key}" has fewer than 2 values`); continue; }
  const keys = new Set(a.values.map(v => v.key));
  if (keys.size !== a.values.length) fail(`axis "${a.key}" has duplicate value keys`);
  else ok(`${a.key}: ${a.values.length} distinct values`);
}

/* 3. Every legacy layout still resolves to the card it was sent as.
   Invite links are printed on physical cards and sitting in WhatsApp threads.
   A guest opening a two-year-old link must not get a different design. */
console.log('\nLegacy invite links:');
for (const key of Object.keys(K.LEGACY_LAYOUTS)) {
  const g = K.genomeFromLegacyLayout(key);
  if (g.__site) { ok(`${key}: routes to the site family`); continue; }
  if (!K.isValid(g)) { fail(`${key}: maps to a genome the pruner rejects`); continue; }
  const back = K.parseGenomeCode(K.genomeCode(g));
  if (!back || !K.AXES.every(a => back[a.key] === g[a.key])) fail(`${key}: code does not round-trip`);
  else ok(`${key}: ${K.genomeCode(g)}`);
}

/* 4. Old query-string designs still land somewhere sane. */
console.log('\nLegacy design objects:');
const legacyDesign = { layout: 'botanical', ornament: 'frame', hf: 1, bf: 2, sc: 0 };
const resolved = K.genomeFromDesign(legacyDesign);
if (resolved.motif !== 'botanical') fail('?layout=botanical lost its motif');
else if (resolved.density !== 'frame') fail('?ornament=frame was dropped');
else ok('?layout=botanical&ornament=frame -> ' + K.genomeCode(resolved));

const unknown = K.genomeFromDesign({ layout: 'no-such-layout-ever' });
if (!K.isValid(unknown)) fail('unknown layout did not fall back to a valid genome');
else ok('unknown layout falls back to ' + K.genomeCode(unknown));

console.log(failures ? `\n${failures} failure(s)\n` : '\nAll engine invariants hold.\n');
process.exit(failures ? 1 : 0);
