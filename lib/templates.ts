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

/* Re-exported so callers get the engine's type, not a structural lookalike.
   A local Record<string,string> would compile here and then fail to satisfy
   the renderer, which is the sort of drift this whole refactor is about. */
export type { Genome };

export interface Template {
  id: string;
  name: string;
  category: string;
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
}

export const CATEGORIES: Category[] = [
  {
    key: 'wedding',
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
      out.push({
        id: `${cat.key}-${K.genomeCode(genome)}`,
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

export function designFor(t: Template) {
  const palette = K.paletteFromIndices(t.hueIdx, t.moodIdx);
  return { ...palette, genome: t.genome, hf: t.hf, bf: t.bf, sc: t.sc };
}
