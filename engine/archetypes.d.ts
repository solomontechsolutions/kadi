/* Types for the archetype layer.
 *
 * InvitationData is the shared content contract: every archetype receives this
 * identical object and is free to use, reorder, resize or omit any field its
 * composition has no room for. Nothing here describes appearance, which is the
 * whole point of separating the two. */
export interface InvitationData {
  p1?: string;
  p2?: string;
  eyebrow?: string;
  wdate?: string;
  wtime?: string;
  venue?: string;
  city?: string;
  photo?: string;
  rsvpUrl?: string;
  showEventColors?: boolean;
  eventColors?: string[];
  cBg?: string;
  cInk?: string;
  cAccent?: string;
  cSeal?: string;
  headFont?: string;
  bodyFont?: string;
}

export interface ArchetypeTraits {
  align: string;
  names: string;
  facts: string;
  factShape: string;
  decor: string;
  bg: string;
  space: string;
  type: string;
}

export interface Archetype {
  id: string;
  name: string;
  render(d: InvitationData, guestName?: string, seats?: number): string;
  traits: ArchetypeTraits;
}

export declare const ARCHETYPES: Archetype[];
export declare const ARCHETYPE_BY_ID: Record<string, Archetype>;
export declare function countArchetypes(): number;
export declare function renderArchetype(
  el: HTMLElement, archetypeId: string, d: InvitationData,
  guestName?: string, seats?: number
): boolean;
export declare function esc(s: unknown): string;
export declare function fmtDate(iso: string): string;
export declare function fmtTime(t: string): string;
export declare function dateParts(iso: string): {
  day: string; mon: string; monLong: string; year: string; wd: string; wdLong: string;
};
export declare function monogram(d: InvitationData): string;
