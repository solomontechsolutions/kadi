import type { Genome } from './mwaliko-genome.js';

/** Everything the card renderer needs. Palette and type live alongside the
 *  genome rather than inside it, so colour and font can change without
 *  touching structure. */
export interface CardDesign {
  p1?: string;
  p2?: string;
  wdate?: string;
  wtime?: string;
  venue?: string;
  city?: string;
  eyebrow?: string;
  photo?: string;
  showEventColors?: boolean;
  eventColors?: string[];
  cBg?: string;
  cInk?: string;
  cAccent?: string;
  cSeal?: string;
  hf?: number;
  bf?: number;
  sc?: number;
  genome?: Genome | string;
  /** Pre-genome designs still arriving from old invite links. */
  layout?: string;
  ornament?: string;
}

export declare function esc(s: unknown): string;
export declare function fmtDate(iso: string): string;
export declare function fmtTime(t: string): string;
export declare function partyTag(seats: number): string;
export declare function monogram(d: CardDesign): string;
export declare function buildCard(d: CardDesign, guestName?: string, seats?: number, showSeal?: boolean): string;
export declare function applyTokens(card: HTMLElement, d: CardDesign): void;
export declare function applyGenome(card: HTMLElement, g: Genome): void;
/** Returns false when the design belongs to the scrolling site family, which
 *  renders elsewhere and must not be drawn as a card. */
export declare function renderCard(card: HTMLElement, d: CardDesign, guestName?: string, seats?: number, showSeal?: boolean): boolean;
