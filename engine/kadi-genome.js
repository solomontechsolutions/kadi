/* ============================================================================
   Kadi Genome Engine
   ----------------------------------------------------------------------------
   A card design is not picked from a list of layouts. It is COMPOSED from
   independent structural axes, each of which owns a disjoint slice of the DOM
   and the CSS. That is what makes the design space real instead of cosmetic:
   the old system had 19 layouts x 3 ornament levels = 57 actual structures,
   and every "285,000 combinations" beyond that was the same 57 skeletons
   recoloured and re-fonted -- which is exactly why everything looked alike.

   THE OWNERSHIP CONTRACT (do not break this):
     Each axis styles ONLY the hook listed below. No axis may attach
     ::before/::after to .invite-card itself -- that pseudo-element pair is the
     single scarcest resource in the system and the old layouts fought over it
     (framed's double border vs botanical's corner brackets vs postcard's stamp
     box). Every decorative axis gets a real DOM layer instead, so any value of
     any axis composes with any value of every other axis.

       frame    -> .k-frame  + card radius/padding/clip
       motif    -> .k-motif  (corner + edge marks)
       density  -> scales what motif drew; never draws its own marks
       header   -> .k-header internals
       media    -> .k-media
       rule     -> .k-rule
       body     -> .k-body internals
       align    -> alignment on .k-content only

   Loaded as a plain script (no build step): defines window.KadiGenome.
   ========================================================================== */
(function (global) {
'use strict';

/* ---------------------------------------------------------------- palettes */
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
  return '#' + toHex(f(0)) + toHex(f(8)) + toHex(f(4));
}

const HUES = ['Rose','Poppy','Amber','Marigold','Gold','Olive','Moss','Sage','Emerald','Jade',
              'Teal','Cyan','Sky','Azure','Cornflower','Indigo','Violet','Orchid','Magenta','Blush'];
function hueDeg(i) { return (i * 18) % 360; }

const MOODS = [
  { name:'Classic',  fn:h=>({cBg:hslToHex(h,22,94), cInk:hslToHex(h,25,16), cAccent:hslToHex(h,38,45), cSeal:hslToHex(h,45,30)}) },
  { name:'Romantic', fn:h=>({cBg:hslToHex(h,45,95), cInk:hslToHex(h,30,22), cAccent:hslToHex(h,55,68), cSeal:hslToHex(h,40,55)}) },
  { name:'Modern',   fn:h=>({cBg:hslToHex(h,10,98), cInk:hslToHex(h,15,12), cAccent:hslToHex(h,70,45), cSeal:hslToHex(h,20,10)}) },
  { name:'Bold',     fn:h=>({cBg:hslToHex(h,35,14), cInk:hslToHex(h,20,94), cAccent:hslToHex(h,65,62), cSeal:hslToHex(h,55,70)}) },
  { name:'Minimal',  fn:h=>({cBg:hslToHex(h,8,97),  cInk:hslToHex(h,6,20),  cAccent:hslToHex(h,18,55), cSeal:hslToHex(h,10,40)}) },
];
function paletteFromIndices(hueIdx, moodIdx) { return MOODS[moodIdx].fn(hueDeg(hueIdx)); }

/* ------------------------------------------------------------------- type */
const HEADING_FONTS = [
  {name:'Cormorant Garamond', css:"'Cormorant Garamond',serif", gf:'Cormorant+Garamond:ital,wght@0,500;0,600;1,500', italic:true},
  {name:'Playfair Display',   css:"'Playfair Display',serif",   gf:'Playfair+Display:ital,wght@0,500;0,700;1,500',   italic:true},
  {name:'Marcellus',          css:"'Marcellus',serif",          gf:'Marcellus',                                     italic:false},
  {name:'Italiana',           css:"'Italiana',serif",           gf:'Italiana',                                      italic:false},
  {name:'Cormorant',          css:"'Cormorant',serif",          gf:'Cormorant:ital,wght@0,500;0,600;1,500',         italic:true},
];
const BODY_FONTS = [
  {name:'EB Garamond',  css:"'EB Garamond',serif",  gf:'EB+Garamond:ital,wght@0,400;0,500;1,400'},
  {name:'Lora',         css:"'Lora',serif",         gf:'Lora:ital,wght@0,400;0,500;1,400'},
  {name:'Jost',         css:"'Jost',sans-serif",    gf:'Jost:wght@400;500'},
  {name:'Inter',        css:"'Inter',sans-serif",   gf:'Inter:wght@400;500'},
  {name:'Crimson Text', css:"'Crimson Text',serif", gf:'Crimson+Text:ital,wght@0,400;0,600;1,400'},
];
const SCALES = [
  {name:'Intimate', nameSize:'28px', detailSize:'13.5px'},
  {name:'Grand',    nameSize:'40px', detailSize:'16px'},
];

/* ------------------------------------------------------------------- axes */
/* Order here IS the wire order in a genome code, so only ever append. */
const AXES = [
  { key:'frame', label:'Frame', values:[
      {key:'plain',   name:'Plain Edge'},
      {key:'rule',    name:'Inset Rule'},
      {key:'double',  name:'Double Rule'},
      {key:'arch',    name:'Arched'},
      {key:'notch',   name:'Ticket Notch'},
      {key:'deckle',  name:'Deckle Edge'},
      {key:'panel',   name:'Inner Panel'},
      {key:'scallop', name:'Scalloped'},
  ]},
  { key:'header', label:'Name Treatment', values:[
      {key:'stacked', name:'Stacked'},
      {key:'inline',  name:'Single Line'},
      {key:'crest',   name:'Monogram Crest'},
      {key:'banner',  name:'Colour Banner'},
      {key:'vrule',   name:'Vertical Rule'},
      {key:'split',   name:'Split Wide'},
      {key:'label',   name:'Boxed Label'},
  ]},
  { key:'media', label:'Photo', values:[
      {key:'none',     name:'No Photo'},
      {key:'bleed',    name:'Full Bleed'},
      {key:'circle',   name:'Circle'},
      {key:'window',   name:'Arch Window'},
      {key:'polaroid', name:'Polaroid'},
      {key:'side',     name:'Side Panel'},
      {key:'wash',     name:'Background Wash'},
  ]},
  { key:'motif', label:'Ornament', values:[
      {key:'none',      name:'None'},
      {key:'botanical', name:'Botanical'},
      {key:'mandala',   name:'Mandala'},
      {key:'deco',      name:'Art Deco'},
      {key:'floral',    name:'Floral Spray'},
      {key:'geo',       name:'Geometric'},
      {key:'wreath',    name:'Line Wreath'},
      {key:'confetti',  name:'Confetti'},
  ]},
  { key:'density', label:'Ornament Density', values:[
      {key:'none',   name:'None'},
      {key:'accent', name:'Accent'},
      {key:'frame',  name:'Full Frame'},
  ]},
  { key:'rule', label:'Divider', values:[
      {key:'none',     name:'None'},
      {key:'hairline', name:'Hairline'},
      {key:'ornate',   name:'Ornate'},
      {key:'dots',     name:'Dot Leader'},
      {key:'laurel',   name:'Laurel'},
      {key:'diamond',  name:'Diamond'},
  ]},
  { key:'body', label:'Detail Layout', values:[
      {key:'stack',    name:'Stacked'},
      {key:'twocol',   name:'Two Column'},
      {key:'timeline', name:'Timeline'},
      {key:'boxed',    name:'Boxed Panels'},
      {key:'grid',     name:'Label Grid'},
  ]},
  { key:'align', label:'Composition', values:[
      {key:'center', name:'Centred'},
      {key:'left',   name:'Left'},
      {key:'split',  name:'Split'},
  ]},
];
const AXIS_BY_KEY = {};
AXES.forEach(a => { AXIS_BY_KEY[a.key] = a; });

function axisIndex(axisKey, valueKey) {
  const vals = AXIS_BY_KEY[axisKey].values;
  const i = vals.findIndex(v => v.key === valueKey);
  return i < 0 ? 0 : i;
}

/* ----------------------------------------------------------- compatibility
   Pruning is not decoration-policing; it removes pairs that are structurally
   incoherent -- two things claiming the same physical region of the card, or
   an axis whose value is a no-op given another axis. A pruned genome is not
   "ugly", it is unrenderable-as-intended, so the picker must never offer it.
*/
const RULES = [
  // Density only means something once a motif exists, and a motif with no
  // density would draw nothing. Collapse both dead halves to one canonical form.
  g => (g.motif === 'none') === (g.density === 'none'),

  // A banner header bleeds edge-to-edge across the top; a frame that clips or
  // insets the top edge would slice it. Same region, two owners.
  g => !(g.header === 'banner' && (g.frame === 'arch' || g.frame === 'deckle' || g.frame === 'scallop')),

  // Full-bleed and background-wash photography both occupy the whole card
  // surface, which is the one thing an inner panel also wants.
  g => !(g.frame === 'panel' && (g.media === 'bleed' || g.media === 'wash')),

  // An arched frame's top curve is the card's signature line; a full-bleed
  // photo squares it off again.
  g => !(g.frame === 'arch' && g.media === 'bleed'),

  // The side-panel photo takes the left column outright, so it cannot coexist
  // with the two composition modes that also want that column.
  g => !(g.media === 'side' && g.align === 'split'),
  g => !(g.media === 'side' && g.header === 'vrule'),

  // Split composition already pushes details into opposing columns; running
  // two-column or label-grid detail layouts inside that nests columns in columns.
  g => !(g.align === 'split' && (g.body === 'twocol' || g.body === 'grid')),

  // A full ornament frame plus a drawn card frame is two concentric borders
  // fighting for the same 12px of margin.
  g => !(g.density === 'frame' && (g.frame === 'double' || g.frame === 'scallop')),

  // Boxed detail panels supply their own separators, making a divider redundant
  // rather than decorative.
  g => !(g.body === 'boxed' && g.rule !== 'none'),
];

function isValid(g) { return RULES.every(fn => fn(g)); }

/* Exact count by enumeration -- no estimating a number we ship on the page. */
function forEachGenome(cb) {
  const [F,H,M,O,D,R,B,A] = AXES.map(a => a.values);
  for (const f of F) for (const h of H) for (const m of M) for (const o of O)
  for (const d of D) for (const r of R) for (const b of B) for (const a of A) {
    const g = { frame:f.key, header:h.key, media:m.key, motif:o.key,
                density:d.key, rule:r.key, body:b.key, align:a.key };
    if (isValid(g)) cb(g);
  }
}
function countValid() {
  let n = 0;
  forEachGenome(() => { n++; });
  return n;
}

/* --------------------------------------------------------------- genome io */
function defaultGenome() {
  return { frame:'plain', header:'stacked', media:'none', motif:'none',
           density:'none', rule:'hairline', body:'stack', align:'center' };
}

/* Code shape: K-ffhhmmoodrba  (one digit per axis, in AXES order) */
function genomeCode(g) {
  return 'K-' + AXES.map(a => axisIndex(a.key, g[a.key])).join('');
}
function parseGenomeCode(code) {
  const m = /^K-(\d{8})$/.exec(String(code || '').trim().toUpperCase());
  if (!m) return null;
  const digits = m[1].split('').map(Number);
  const g = {};
  for (let i = 0; i < AXES.length; i++) {
    const vals = AXES[i].values;
    if (digits[i] >= vals.length) return null;
    g[AXES[i].key] = vals[digits[i]].key;
  }
  return isValid(g) ? g : null;
}

/* ------------------------------------------------------ legacy compatibility
   Every invite link already in the wild carries ?layout=<key> plus an
   L##-P###-T##-O# template code. Those links are printed on cards and sitting
   in people's WhatsApp threads, so they must keep resolving to the same look
   forever. Each old layout is expressed as the genome that reproduces it.
*/
const LEGACY_LAYOUTS = {
  classic:     { align:'center' },
  banner:      { header:'banner' },
  framed:      { frame:'double' },
  arch:        { frame:'arch' },
  split:       { align:'split', media:'polaroid' },
  monogram:    { header:'crest' },
  minimalLine: { rule:'none', body:'grid' },
  editorial:   { align:'left', rule:'hairline' },
  botanical:   { motif:'botanical', density:'accent' },
  timeline:    { body:'timeline', rule:'none' },
  watercolor:  { motif:'floral', density:'frame', media:'wash' },
  artdeco:     { motif:'deco', density:'frame', frame:'rule' },
  kraftRustic: { frame:'deckle', motif:'botanical', density:'accent' },
  filmStrip:   { media:'polaroid', frame:'notch', body:'twocol' },
  terrazzo:    { motif:'confetti', density:'accent', frame:'panel' },
  starryNight: { motif:'confetti', density:'frame', rule:'diamond' },
  laceScallop: { frame:'scallop', motif:'wreath', density:'accent' },
  postcard:    { align:'left', frame:'rule', body:'twocol' },
  premium:     { __site:true },
};

function genomeFromLegacyLayout(key) {
  const patch = LEGACY_LAYOUTS[key];
  if (!patch) return null;
  if (patch.__site) return { __site:true };
  const g = Object.assign(defaultGenome(), patch);
  // A legacy key is a fixed point of the new system, so if a pruning rule
  // rejects it the rule is wrong about real designs -- surface that loudly in
  // dev rather than silently shipping a different-looking card.
  if (!isValid(g) && global.console) {
    console.warn('[kadi] legacy layout "' + key + '" maps to a pruned genome', g);
  }
  return g;
}

/* Read a genome off any design object, whatever era it was saved in. */
function genomeFromDesign(d) {
  d = d || {};
  if (d.genome && typeof d.genome === 'object') {
    return Object.assign(defaultGenome(), d.genome);
  }
  if (typeof d.genome === 'string') {
    const parsed = parseGenomeCode(d.genome);
    if (parsed) return parsed;
  }
  const legacy = genomeFromLegacyLayout(d.layout);
  if (legacy) {
    // The old standalone ornament axis rode alongside layout; fold it in, but
    // never let it override a motif the legacy layout itself established.
    if (d.ornament && d.ornament !== 'none' && !legacy.__site && legacy.motif === 'none') {
      legacy.motif = 'botanical';
      legacy.density = d.ornament === 'frame' ? 'frame' : 'accent';
    }
    return legacy;
  }
  return defaultGenome();
}

/* ------------------------------------------------------------------ fonts */
const loadedFonts = new Set();
function ensureFont(gf) {
  if (!gf || loadedFonts.has(gf)) return;
  loadedFonts.add(gf);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=' + gf + '&display=swap';
  document.head.appendChild(link);
}

global.KadiGenome = {
  hslToHex, HUES, hueDeg, MOODS, paletteFromIndices,
  HEADING_FONTS, BODY_FONTS, SCALES,
  AXES, AXIS_BY_KEY, axisIndex,
  isValid, countValid, forEachGenome,
  defaultGenome, genomeCode, parseGenomeCode,
  LEGACY_LAYOUTS, genomeFromLegacyLayout, genomeFromDesign,
  ensureFont,
};
})(window);
