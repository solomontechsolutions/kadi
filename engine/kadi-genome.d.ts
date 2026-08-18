/* Types for the plain-ES-module engine.
 *
 * The engine stays untyped JavaScript on purpose: the legacy static pages load
 * the exact same files over <script type="module"> with no build step, so it
 * cannot depend on TypeScript. This declaration gives the Next app full typing
 * without forking the source. */

export interface Genome {
  frame: string;
  header: string;
  media: string;
  motif: string;
  density: string;
  rule: string;
  body: string;
  align: string;
  /** Set only by the scrolling site family, which renders outside the card engine. */
  __site?: boolean;
  [axis: string]: string | boolean | undefined;
}

export interface Palette { cBg: string; cInk: string; cAccent: string; cSeal: string; }
export interface AxisValue { key: string; name: string; }
export interface Axis { key: string; label: string; values: AxisValue[]; }
export interface HeadingFont { name: string; css: string; gf: string; italic: boolean; }
export interface BodyFont { name: string; css: string; gf: string; }
export interface Scale { name: string; nameSize: string; detailSize: string; }
export interface Mood { name: string; fn: (h: number) => Palette; }

export declare const HUES: string[];
export declare const MOODS: Mood[];
export declare const HEADING_FONTS: HeadingFont[];
export declare const BODY_FONTS: BodyFont[];
export declare const SCALES: Scale[];
export declare const AXES: Axis[];
export declare const AXIS_BY_KEY: Record<string, Axis>;
export declare const LEGACY_LAYOUTS: Record<string, Record<string, unknown>>;

export declare function hslToHex(h: number, s: number, l: number): string;
export declare function hueDeg(i: number): number;
export declare function paletteFromIndices(hueIdx: number, moodIdx: number): Palette;
export declare function axisIndex(axisKey: string, valueKey: string): number;
export declare function isValid(g: Genome): boolean;
export declare function countValid(): number;
export declare function forEachGenome(cb: (g: Genome) => void): void;
export declare function defaultGenome(): Genome;
export declare function genomeCode(g: Genome): string;
export declare function parseGenomeCode(code: string): Genome | null;
export declare function genomeFromLegacyLayout(key: string): Genome | null;
export declare function genomeFromDesign(d: unknown): Genome;
export declare function ensureFont(gf: string): void;
