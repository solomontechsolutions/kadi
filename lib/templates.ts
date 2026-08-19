/* Curated surface over the generated design space.
 *
 * The engine can produce 315,360 structural layouts. Nobody browses that, and
 * the gallery is the shape customers already understand: a grid of named
 * cards under a category. So the gallery is a *window* onto the space, not a
 * separate hand-built library that would immediately drift from the engine.
 *
 * Each category declares which axis values suit it, and templates are walked
 * deterministically from those pools. Deterministic matters: a given category
 * and index must always yield the same card, or a template someone picked on
 * Tuesday is a different design on Thursday and every saved invite breaks.
 */
import * as K from '@/engine/mwaliko-genome.js';
import type { Genome } from '@/engine/mwaliko-genome.js';
import { ARCHETYPE_BY_ID } from '@/engine/archetypes.js';

/* Re-exported so callers get the engine's type, not a structural lookalike.
   A local Record<string,string> would compile here and then fail to satisfy
   the renderer, which is the sort of drift this whole refactor is about. */
export type { Genome };

export interface Template {
  id: string;
  name: string;
  category: string;
  /* Which of the twelve compositions draws this card. This, not the genome, is
     what makes two templates look like different designs rather than the same
     design in another colour. */
  archetype: string;
  genome: Genome;
  hueIdx: number;
  moodIdx: number;
  hf: number;
  bf: number;
  sc: number;
}

export interface Category {
  key: string;
  name: string;
  blurb: string;
  /* Allowed values per axis. Omitted axes use the full range. */
  pools: Record<string, string[]>;
  hues: number[];
  moods: number[];
  heads: number[];
  bodies: number[];
  names: string[];
  /* Which compositions this category may use. Categories draw from different
     pools so that a Corporate card and a Wedding card are not the same design
     with different words: weddings never get Poster, corporate never gets
     Ornamental. See docs/design-matrix.md. */
  archetypes: string[];
}

export const CATEGORIES: Category[] = [
  {
    key: 'wedding',
    archetypes: ['editorial','ornamental','arch','botanical','luxury','fullbleed','typographic'],
    name: 'Weddings',
    blurb: 'Harusi, from cathedral-formal to garden-intimate.',
    pools: {
      frame: ['plain', 'rule', 'double', 'arch', 'deckle', 'scallop'],
      header: ['stacked', 'crest', 'inline', 'vrule', 'split'],
      media: ['none', 'circle', 'window', 'polaroid', 'wash'],
      motif: ['botanical', 'floral', 'wreath', 'mandala', 'none'],
      rule: ['hairline', 'ornate', 'laurel', 'diamond'],
      body: ['stack', 'grid', 'timeline'],
      align: ['center', 'left'],
    },
    hues: [0, 4, 5, 7, 9, 19],
    moods: [0, 1, 4],
    heads: [0, 1, 2, 4],
    bodies: [0, 1, 4],
    names: ['Amani', 'Serengeti', 'Old Money', 'Verona', 'Bougainvillea', 'Cathedral',
            'Zanzibar', 'Lace & Linen', 'Botanic Hall', 'Evensong', 'Ivory Arch', 'Mikumi'],
  },
  {
    key: 'sendoff',
    archetypes: ['colorblock','poster','fullbleed','magazine','typographic','asymmetric'],
    name: 'Send-Off',
    blurb: 'Bold, photo-forward cards built for a full guest list.',
    pools: {
      frame: ['plain', 'rule', 'panel', 'notch'],
      header: ['banner', 'stacked', 'label', 'crest'],
      media: ['bleed', 'side', 'circle', 'polaroid'],
      motif: ['floral', 'geo', 'mandala', 'confetti'],
      rule: ['hairline', 'diamond', 'dots'],
      body: ['stack', 'boxed', 'grid', 'twocol'],
      align: ['center', 'left'],
    },
    hues: [1, 2, 3, 15, 16, 17, 18],
    moods: [1, 3],
    heads: [1, 0, 2],
    bodies: [2, 3, 1],
    names: ['Mwaliko', 'Sherehe', 'Gold Dust', 'Kilimanjaro', 'Maasai', 'Tanzanite',
            'Furaha', 'Royal Navy', 'Sunset Bay', 'Karibu'],
  },
  {
    key: 'kitchenparty',
    archetypes: ['botanical','colorblock','ornamental','fullbleed','poster'],
    name: 'Kitchen Party',
    blurb: 'Warm, celebratory, unmistakably East African.',
    pools: {
      frame: ['plain', 'panel', 'rule', 'notch'],
      header: ['banner', 'label', 'stacked'],
      media: ['bleed', 'circle', 'polaroid', 'side'],
      motif: ['floral', 'confetti', 'geo', 'botanical'],
      rule: ['dots', 'hairline', 'diamond'],
      body: ['boxed', 'stack', 'grid'],
      align: ['center', 'left'],
    },
    hues: [0, 1, 17, 18, 19],
    moods: [1, 3],
    heads: [1, 0],
    bodies: [2, 3],
    names: ['Jikoni', 'Pili Pili', 'Rose Garden', 'Kanga', 'Spice Route',
            'Coral', 'Mama Ntilie', 'Hibiscus'],
  },
  {
    key: 'birthday',
    archetypes: ['poster','typographic','colorblock','magazine','fullbleed'],
    name: 'Birthdays',
    blurb: 'Playful through to black-tie milestone.',
    pools: {
      frame: ['plain', 'panel', 'notch', 'rule'],
      header: ['label', 'banner', 'inline', 'split'],
      media: ['circle', 'polaroid', 'bleed', 'none'],
      motif: ['confetti', 'geo', 'deco', 'none'],
      rule: ['dots', 'diamond', 'none', 'hairline'],
      body: ['stack', 'boxed', 'twocol'],
      align: ['center', 'left'],
    },
    hues: [2, 3, 11, 12, 13, 17, 18],
    moods: [2, 3, 1],
    heads: [1, 3, 2],
    bodies: [2, 3],
    names: ['Confetti', 'Midnight', 'Neon', 'Golden Hour', 'Studio 54',
            'Sherehe Njema', 'Milestone', 'Sparkler'],
  },
  {
    key: 'corporate',
    archetypes: ['swiss','asymmetric','magazine','editorial','colorblock'],
    name: 'Corporate',
    blurb: 'Conferences, launches, galas and AGMs.',
    pools: {
      frame: ['plain', 'rule', 'panel'],
      header: ['label', 'vrule', 'inline', 'split'],
      media: ['none', 'bleed', 'side'],
      motif: ['geo', 'deco', 'none'],
      rule: ['hairline', 'none', 'diamond'],
      body: ['grid', 'boxed', 'twocol', 'timeline'],
      align: ['left', 'center'],
    },
    hues: [10, 13, 14, 15, 6],
    moods: [2, 4, 0],
    heads: [2, 3],
    bodies: [3, 2],
    names: ['Boardroom', 'Summit', 'Keynote', 'Quarterly', 'Atrium',
            'Delegate', 'Plenary', 'Blue Chip'],
  },
  {
    key: 'graduation',
    archetypes: ['editorial','arch','swiss','magazine','luxury'],
    name: 'Graduation',
    blurb: 'Mahafali. Academic, proud, photograph-led.',
    pools: {
      frame: ['rule', 'double', 'plain', 'arch'],
      header: ['crest', 'label', 'stacked'],
      media: ['circle', 'window', 'polaroid', 'none'],
      motif: ['wreath', 'deco', 'geo', 'none'],
      rule: ['laurel', 'hairline', 'ornate'],
      body: ['grid', 'stack', 'boxed'],
      align: ['center'],
    },
    hues: [4, 6, 14, 15, 16],
    moods: [0, 3, 2],
    heads: [2, 0, 1],
    bodies: [0, 3],
    names: ['Mahafali', 'Laurel', 'Summa', 'Class Of', 'Quadrangle',
            'Regalia', 'Honours', 'Convocation'],
  },
  {
    key: 'babyshower',
    archetypes: ['botanical','luxury','arch','colorblock','editorial'],
    name: 'Baby Shower',
    blurb: 'Naming ceremonies, showers and first birthdays.',
    pools: {
      frame: ['plain', 'scallop', 'arch', 'deckle'],
      header: ['stacked', 'label', 'crest'],
      media: ['circle', 'window', 'polaroid', 'none'],
      motif: ['floral', 'botanical', 'wreath', 'confetti'],
      rule: ['hairline', 'dots', 'laurel'],
      body: ['stack', 'grid'],
      align: ['center'],
    },
    hues: [0, 12, 13, 19, 9],
    moods: [1, 4],
    heads: [0, 4, 2],
    bodies: [0, 1],
    names: ['Little One', 'Mtoto', 'Cloud Nine', 'Peaseblossom', 'First Steps',
            'Nursery', 'Baraka', 'Tiny'],
  },
  {
    key: 'religious',
    archetypes: ['arch','ornamental','editorial','luxury','swiss'],
    name: 'Church & Faith',
    blurb: 'Dedications, confirmations and church events.',
    pools: {
      frame: ['arch', 'rule', 'double', 'plain'],
      header: ['stacked', 'crest', 'label'],
      media: ['none', 'window', 'circle'],
      motif: ['wreath', 'botanical', 'deco', 'none'],
      rule: ['hairline', 'ornate', 'laurel'],
      body: ['stack', 'grid', 'timeline'],
      align: ['center'],
    },
    hues: [4, 6, 14, 15],
    moods: [0, 4],
    heads: [2, 3, 0],
    bodies: [0, 4],
    names: ['Sanctuary', 'Evensong', 'Neema', 'Vespers', 'Cornerstone',
            'Upendo', 'Advent', 'Chapel'],
  },
  {
    key: 'anniversary',
    archetypes: ['ornamental','editorial','luxury','typographic','botanical'],
    name: 'Anniversary',
    blurb: 'Silver, gold and everything between.',
    pools: {
      frame: ['double', 'rule', 'scallop', 'arch'],
      header: ['crest', 'stacked', 'split'],
      media: ['polaroid', 'circle', 'none', 'wash'],
      motif: ['floral', 'wreath', 'deco', 'mandala'],
      rule: ['ornate', 'laurel', 'diamond'],
      body: ['stack', 'timeline', 'grid'],
      align: ['center', 'left'],
    },
    hues: [4, 5, 19, 0, 9],
    moods: [0, 1],
    heads: [0, 1, 4],
    bodies: [0, 4, 1],
    names: ['Golden', 'Silver Jubilee', 'Miaka', 'Evergreen', 'Still Us',
            'Vintage', 'Ruby', 'Long Play'],
  },
  {
    key: 'memorial',
    archetypes: ['luxury','editorial','arch','swiss'],
    name: 'Memorial',
    blurb: 'Restrained, dignified cards for remembrance.',
    pools: {
      frame: ['plain', 'rule', 'arch'],
      header: ['stacked', 'crest'],
      media: ['circle', 'window', 'none'],
      motif: ['wreath', 'botanical', 'none'],
      rule: ['hairline', 'laurel', 'none'],
      body: ['stack', 'grid'],
      align: ['center'],
    },
    hues: [6, 7, 14, 15],
    moods: [4, 0],
    heads: [2, 0],
    bodies: [0, 4],
    names: ['Remembrance', 'Kumbukumbu', 'Stillwater', 'In Memoriam',
            'Quiet Light', 'Amani', 'Rosemary'],
  },
];

export const CATEGORY_BY_KEY = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

/* ---------------------------------------------------------------------------
   Sample content per category
   ---------------------------------------------------------------------------
   Every card in the gallery used to be filled with the same wedding couple, so
   a Corporate card announced "Amara & Julian, together with their families" and
   a Memorial card did the same. The structural axes were already right for each
   category; it was the words on top of them that made all ten categories read
   as weddings.

   Categories with a single subject leave p2 empty. The renderer drops the
   ampersand when there is nothing to join, so "Annual General Meeting" no
   longer trails a stray "&".

   Event colours belong to celebrations. A board meeting and a funeral do not
   have a colour scheme, and printing one on those cards is exactly the tell
   that gave the whole gallery away as wedding stationery in disguise.
   ------------------------------------------------------------------------- */
export interface Sample {
  p1: string;
  p2: string;
  eyebrow: string;
  wdate: string;
  wtime: string;
  venue: string;
  city: string;
  showEventColors: boolean;
  eventColors?: string[];
}

const CELEBRATION_COLORS = ['#8C1F28', '#C9A227', '#2F4858'];

export const SAMPLES: Record<string, Sample> = {
  wedding: {
    p1: 'Amara', p2: 'Julian',
    eyebrow: 'Together with their families',
    wdate: '2027-02-14', wtime: '16:30',
    venue: 'The Old Botanical Hall', city: 'Dar es Salaam',
    showEventColors: true, eventColors: CELEBRATION_COLORS,
  },
  sendoff: {
    p1: 'Amara', p2: 'Julian',
    eyebrow: 'A send-off celebration for',
    wdate: '2027-02-06', wtime: '18:00',
    venue: 'Mlimani City Gardens', city: 'Dar es Salaam',
    showEventColors: true, eventColors: ['#1F3A5F', '#C9A227', '#7A1F3D'],
  },
  kitchenparty: {
    p1: 'Amara', p2: '',
    eyebrow: 'A kitchen party in honour of',
    wdate: '2027-01-24', wtime: '14:00',
    venue: 'Kunduchi Beach Hall', city: 'Dar es Salaam',
    showEventColors: true, eventColors: ['#B3282D', '#E0A32E', '#166B4A'],
  },
  birthday: {
    p1: 'Neema', p2: '',
    eyebrow: 'Fortieth birthday dinner for',
    wdate: '2027-03-20', wtime: '19:30',
    venue: 'The Terrace, Oyster Bay', city: 'Dar es Salaam',
    showEventColors: true, eventColors: ['#12122B', '#C9A227', '#6D2E8C'],
  },
  corporate: {
    /* No personal names at all. A corporate card announces the occasion, and
       the host organisation sits in the eyebrow where a family would. */
    p1: 'Annual General Meeting', p2: '',
    eyebrow: 'Kilimanjaro Holdings PLC',
    wdate: '2027-04-08', wtime: '09:00',
    venue: 'Serena Hotel, Simba Hall', city: 'Dar es Salaam',
    showEventColors: false,
  },
  graduation: {
    p1: 'Baraka Mushi', p2: '',
    eyebrow: 'A graduation dinner in honour of',
    wdate: '2027-11-13', wtime: '17:00',
    venue: 'Nkrumah Hall, University of Dar es Salaam', city: 'Dar es Salaam',
    showEventColors: false,
  },
  babyshower: {
    p1: 'Neema', p2: '',
    eyebrow: 'A baby shower for',
    wdate: '2027-05-15', wtime: '15:00',
    venue: 'The Garden Room, Masaki', city: 'Dar es Salaam',
    showEventColors: true, eventColors: ['#EBC7D4', '#C9A227', '#9BC4CB'],
  },
  religious: {
    p1: 'Service of Dedication', p2: '',
    eyebrow: 'You are warmly invited to a',
    wdate: '2027-06-06', wtime: '10:00',
    venue: 'Azania Front Cathedral', city: 'Dar es Salaam',
    showEventColors: false,
  },
  anniversary: {
    p1: 'Amara', p2: 'Julian',
    eyebrow: 'Twenty-five years of',
    wdate: '2027-02-14', wtime: '18:00',
    venue: 'The Old Botanical Hall', city: 'Dar es Salaam',
    showEventColors: true, eventColors: ['#C9A227', '#3A3A3A', '#8C1F28'],
  },
  memorial: {
    p1: 'Joseph Mwakalinga', p2: '',
    eyebrow: 'In loving memory of',
    wdate: '2027-07-18', wtime: '11:00',
    venue: 'St Peter’s Church, Oysterbay', city: 'Dar es Salaam',
    showEventColors: false,
  },
};

/* Falls back to the wedding sample rather than to nothing, so a category added
   without a sample renders a complete card instead of an empty skeleton. */
export function sampleFor(categoryKey: string): Sample {
  return SAMPLES[categoryKey] ?? SAMPLES.wedding;
}

/* A small deterministic hash. Templates must be stable across sessions, servers
   and deploys, so nothing here may touch Math.random() or Date. */
function mix(n: number): number {
  n = (n ^ 61) ^ (n >>> 16);
  n = n + (n << 3);
  n = n ^ (n >>> 4);
  n = Math.imul(n, 0x27d4eb2d);
  n = n ^ (n >>> 15);
  return n >>> 0;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[mix(seed) % arr.length];
}

/* Walk a category's pools into a concrete genome, then repair it if the pruner
   objects. Repair rather than reject: a category's pools are curated taste, and
   silently skipping indices would leave holes in the gallery. */
function genomeFor(cat: Category, i: number): Genome {
  const g: Genome = K.defaultGenome();
  K.AXES.forEach((axis: { key: string; values: { key: string }[] }, ai: number) => {
    const pool = cat.pools[axis.key] ?? axis.values.map(v => v.key);
    g[axis.key] = pick(pool, i * 31 + ai * 7717);
  });

  // Density is not in any category's pools -- it follows from whether a motif
  // was chosen, which is exactly the invariant the pruner enforces.
  g.density = g.motif === 'none' ? 'none' : (mix(i * 977) % 3 === 0 ? 'frame' : 'accent');

  if (K.isValid(g)) return g;

  // Nudge one axis at a time back to a value that validates, in a fixed order,
  // so the repair is as deterministic as the original walk.
  for (const axis of K.AXES) {
    for (const v of axis.values) {
      const trial = { ...g, [axis.key]: v.key };
      if (axis.key === 'motif') trial.density = v.key === 'none' ? 'none' : g.density;
      if (axis.key === 'density' && g.motif === 'none') continue;
      if (K.isValid(trial)) return trial;
    }
  }
  return K.defaultGenome();
}

export function templatesFor(categoryKey: string, count = 24): Template[] {
  const cat = CATEGORY_BY_KEY[categoryKey];
  if (!cat) return [];
  const out: Template[] = [];
  const seen = new Set<string>();
  let i = 0;

  // Walk until we have `count` structurally distinct cards. Two indices landing
  // on the same genome would put visibly identical cards side by side in the
  // grid -- the exact complaint the genome work exists to fix.
  while (out.length < count && i < count * 40) {
    const genome = genomeFor(cat, i);
    const code = K.genomeCode(genome);
    if (!seen.has(code)) {
      seen.add(code);
      const n = out.length;
      /* Cycled rather than hashed. A hash would happily place three Poster
         cards in a row, and the first screen of the gallery is exactly where
         the library has to prove it is varied. */
      const archetype = cat.archetypes[n % cat.archetypes.length];
      out.push({
        id: `${cat.key}-${archetype}-${K.genomeCode(genome)}`,
        archetype,
        name: `${pick(cat.names, i * 13)} ${String.fromCharCode(65 + (n % 26))}${n >= 26 ? Math.floor(n / 26) : ''}`,
        category: cat.key,
        genome,
        hueIdx: pick(cat.hues, i * 101),
        moodIdx: pick(cat.moods, i * 211),
        hf: pick(cat.heads, i * 307),
        bf: pick(cat.bodies, i * 401),
        sc: mix(i * 503) % 2,
      });
    }
    i++;
  }
  return out;
}

/* Front-page mix: a few from every category so the landing grid shows range
   rather than ten variations on a wedding card. */
export function featuredTemplates(perCategory = 3): Template[] {
  return CATEGORIES.flatMap(c => templatesFor(c.key, perCategory));
}

/* Resolve a template id back into the template it names.
 *
 * Ids are `category-archetype-genomeCode` and templatesFor is deterministic, so
 * the walk that produced an id always reproduces it. That is what lets a link
 * carry a design without a database behind it: /studio?template=wedding-arch-K0...
 * rebuilds exactly the card the customer clicked in the gallery.
 *
 * Walks far enough to cover a heavily paged gallery, then gives up rather than
 * looping forever on an id that was hand-edited or belongs to an older build. */
export function findTemplate(id: string): Template | null {
  const cat = id.split('-')[0];
  const keys = CATEGORY_BY_KEY[cat] ? [cat] : CATEGORIES.map(c => c.key);
  for (const k of keys) {
    const found = templatesFor(k, 240).find(t => t.id === id);
    if (found) return found;
  }
  return null;
}

export function designFor(t: Template) {
  const palette = K.paletteFromIndices(t.hueIdx, t.moodIdx);
  const head = K.HEADING_FONTS[t.hf % K.HEADING_FONTS.length];
  const body = K.BODY_FONTS[t.bf % K.BODY_FONTS.length];
  return {
    ...palette,
    genome: t.genome,
    hf: t.hf, bf: t.bf, sc: t.sc,
    archetype: t.archetype,
    headFont: head.css,
    bodyFont: body.css,
    /* Google Fonts are still fetched per card, so a gallery of 24 cards must
       not request 24 stylesheets. ensureFont dedupes by family. */
    headGf: head.gf,
    bodyGf: body.gf,
  };
}

/* The archetype's display name, for the caption under a gallery thumbnail. It
   is the single most useful label there: it tells a browsing customer what
   kind of design they are looking at. */
export function archetypeName(t: Template): string {
  return ARCHETYPE_BY_ID[t.archetype]?.name ?? '';
}
