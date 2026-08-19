/* ============================================================================
   Mwaliko archetypes
   ----------------------------------------------------------------------------
   Twelve compositions, each with its own markup and its own CSS block.

   This replaces the genome engine's central rule, which was:

     "There is exactly ONE markup shape: axes never add or remove structural
      elements, they only restyle the hooks they own."

   That rule made every axis compose with every other axis, which was the point,
   and it also guaranteed that every card was the same card. Frame, motif and
   rule could change what a card was decorated with, but never where the names
   sat, what the information hierarchy was, or how the page was divided. So all
   315,360 combinations shared one silhouette: eyebrow, big centred names, thin
   divider, stacked date over time over venue, small ornament in the corners.

   The fix is not more axes. It is a second layer where composition itself
   varies. Content is shared, the visual layer is not:

     InvitationData  ->  one archetype's render()  ->  that archetype's markup

   Every archetype receives the identical data object and is free to use it in
   any order, at any size, in any position, or to drop a field the design has no
   room for. No archetype may reuse another's class names, because shared class
   names are how two designs quietly converge back into one.

   Adding an archetype means adding a row to docs/design-matrix.md and passing
   scripts/verify-designs.mjs, which fails when two archetypes agree on more
   than three of their eight composition traits.
   ========================================================================== */

/* ------------------------------------------------------------------ shared */

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function fmtDate(iso) {
  if (!iso) return '';
  const dt = new Date(iso + 'T00:00:00');
  if (isNaN(dt)) return '';
  return dt.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function fmtTime(t) {
  if (!t) return '';
  const [h, m] = String(t).split(':').map(Number);
  if (isNaN(h)) return '';
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + '.' + String(m || 0).padStart(2, '0') + ampm;
}

/* Archetypes that treat the date as a graphic need its pieces, not a sentence.
   Poster sets the day numeral enormous; Magazine uses the month as an issue
   line. Handing them a formatted string would force them to parse it back. */
export function dateParts(iso) {
  if (!iso) return { day: '', mon: '', monLong: '', year: '', wd: '', wdLong: '' };
  const dt = new Date(iso + 'T00:00:00');
  if (isNaN(dt)) return { day: '', mon: '', monLong: '', year: '', wd: '', wdLong: '' };
  const f = (o) => dt.toLocaleDateString('en-GB', o);
  return {
    day: String(dt.getDate()).padStart(2, '0'),
    mon: f({ month: 'short' }).toUpperCase(),
    monLong: f({ month: 'long' }),
    year: String(dt.getFullYear()),
    wd: f({ weekday: 'short' }).toUpperCase(),
    wdLong: f({ weekday: 'long' }),
  };
}

export function monogram(d) {
  return (((d.p1 || '')[0] || '') + ((d.p2 || '')[0] || '')).toUpperCase();
}

/* The two names, joined only when there really are two. A single subject (a
   graduand, an AGM, a person being remembered) must never trail a stray "&". */
function names(d, sep = '<span class="j">&amp;</span>') {
  const a = esc(d.p1 || '');
  const b = esc(d.p2 || '');
  return b ? a + sep + b : a;
}

function place(d) {
  return [d.venue, d.city].filter(Boolean).join(', ');
}

/* Event colours are a celebration convention. Archetypes that carry them say so
   explicitly; the rest ignore the field even when it is populated, because a
   Swiss grid or a memorial card with three coloured dots on it is neither. */
function colorDots(d, cls = 'dots') {
  if (!d.showEventColors) return '';
  const cols = (d.eventColors || []).filter(Boolean);
  if (!cols.length) return '';
  return '<div class="' + cls + '">' +
    cols.map(c => '<i style="background:' + esc(c) + '"></i>').join('') + '</div>';
}

/* Guest personalisation is the product's whole point, so every archetype has to
   place it. Each one positions this block itself rather than inheriting a
   footer, which is why it returns a fragment and not a finished section. */
function guestLine(d, guestName, seats) {
  if (!guestName) return '';
  const party = Number(seats) > 1 ? ' <span class="pt">party of ' + Number(seats) + '</span>' : '';
  return '<div class="guest"><span class="gl">Reserved for</span>' +
    '<span class="gn">' + esc(guestName) + party + '</span></div>';
}

function photoLayer(d, cls) {
  if (!d.photo) return '';
  return '<div class="' + cls + '" style="background-image:url(' + esc(d.photo) + ')"></div>';
}

/* ------------------------------------------------------------------- 01/12 */
/* EDITORIAL. Names own the upper half at a size nothing else competes with;
   everything factual is demoted to one quiet row at the foot. The empty band
   between them is the design, so nothing may be added there. */
function editorial(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  return `
    <div class="ed">
      <p class="ed-eye">${esc(d.eyebrow || '')}</p>
      <h1 class="ed-names">${names(d, '<span class="j">and</span>')}</h1>
      <div class="ed-space"></div>
      <div class="ed-foot">
        <div class="ed-row">
          <span>${esc(dt.wdLong)}</span>
          <span>${esc(dt.day)} ${esc(dt.monLong)} ${esc(dt.year)}</span>
          <span>${esc(fmtTime(d.wtime))}</span>
        </div>
        <p class="ed-venue">${esc(place(d))}</p>
        ${colorDots(d, 'ed-dots')}
        ${guestLine(d, guestName, seats)}
      </div>
    </div>`;
}

/* ------------------------------------------------------------------- 02/12 */
/* ASYMMETRIC. A rule runs the full height at 38 per cent. Everything lives in
   the narrow left column, flush left and ragged right; the wide right column
   stays empty apart from one rotated line. The imbalance is the composition. */
function asymmetric(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  return `
    <div class="as">
      <div class="as-left">
        <p class="as-eye">${esc(d.eyebrow || '')}</p>
        <h1 class="as-names">${names(d, '<span class="j">&amp;</span>')}</h1>
        <div class="as-facts">
          <p><span>Date</span>${esc(dt.wdLong)}, ${esc(dt.day)} ${esc(dt.monLong)}</p>
          <p><span>Time</span>${esc(fmtTime(d.wtime))}</p>
          <p><span>Venue</span>${esc(place(d))}</p>
        </div>
        ${guestLine(d, guestName, seats)}
      </div>
      <div class="as-rule"></div>
      <div class="as-right"><span class="as-vert">${esc(dt.year)}</span></div>
    </div>`;
}

/* ------------------------------------------------------------------- 03/12 */
/* FULL BLEED. Art reaches all four edges and the type sits on top of it, held
   legible by a gradient scrim rather than a panel. With no photograph supplied
   the accent colour becomes the field, so the composition survives intact
   instead of collapsing to an empty rectangle. */
function fullbleed(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  return `
    <div class="fb">
      ${photoLayer(d, 'fb-img')}
      <div class="fb-scrim"></div>
      <div class="fb-text">
        <p class="fb-eye">${esc(d.eyebrow || '')}</p>
        <h1 class="fb-names">${names(d, '<span class="j">&amp;</span>')}</h1>
        <p class="fb-meta">
          <span>${esc(dt.day)}.${esc(dt.mon)}.${esc(dt.year)}</span>
          <i></i><span>${esc(fmtTime(d.wtime))}</span>
          <i></i><span>${esc(place(d))}</span>
        </p>
        ${guestLine(d, guestName, seats)}
      </div>
    </div>`;
}

/* ------------------------------------------------------------------- 04/12 */
/* MAGAZINE. A masthead spans the top edge, letterspaced to the full measure.
   The details are cover lines running up both side edges, which is the one
   place in the library where information is set vertically at the margins. */
function magazine(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  return `
    <div class="mg">
      <div class="mg-head">
        <span class="mg-mast">${esc((d.eyebrow || 'Invitation').toUpperCase())}</span>
      </div>
      <div class="mg-badge"><b>${esc(dt.day)}</b><span>${esc(dt.mon)}</span></div>
      <div class="mg-centre">
        <div class="mg-rule"></div>
        <h1 class="mg-names">${names(d, '<span class="j">&amp;</span>')}</h1>
      </div>
      <div class="mg-edge mg-l"><span>${esc(fmtTime(d.wtime))}</span></div>
      <div class="mg-edge mg-r"><span>${esc(place(d))}</span></div>
      <div class="mg-foot">
        ${colorDots(d, 'mg-dots')}
        ${guestLine(d, guestName, seats)}
      </div>
    </div>`;
}

/* ------------------------------------------------------------------- 05/12 */
/* SWISS. A four column grid, everything locked to the top left, one rule, no
   ornament of any kind and no centring anywhere. Deliberately the plainest
   thing in the library: it is what a corporate invitation should look like. */
function swiss(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  return `
    <div class="sw">
      <div class="sw-top">
        <p class="sw-eye">${esc(d.eyebrow || '')}</p>
        <h1 class="sw-names">${names(d, '<span class="j">/</span>')}</h1>
      </div>
      <div class="sw-rule"></div>
      <div class="sw-grid">
        <div><span>Date</span><p>${esc(dt.day)}.${esc(dt.mon)}.${esc(dt.year)}</p></div>
        <div><span>Time</span><p>${esc(fmtTime(d.wtime))}</p></div>
        <div><span>Venue</span><p>${esc(place(d))}</p></div>
      </div>
      ${guestLine(d, guestName, seats)}
    </div>`;
}

/* ------------------------------------------------------------------- 06/12 */
/* ORNAMENTAL. Decoration is the subject rather than a garnish at the corners.
   An engraved double frame, a ruled medallion behind the names and a filigree
   below them. Symmetrical to the millimetre and almost no empty space, which
   is the opposite of the Luxury archetype's strategy. */
function ornamental(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  return `
    <div class="or">
      <div class="or-frame"></div>
      <div class="or-inner">
        <svg class="or-crest" viewBox="0 0 120 40" aria-hidden="true">
          <path d="M2 20h34M84 20h34" stroke="currentColor" stroke-width="1"/>
          <path d="M60 6l7 14-7 14-7-14z" fill="none" stroke="currentColor" stroke-width="1"/>
          <circle cx="45" cy="20" r="2.4" fill="currentColor"/>
          <circle cx="75" cy="20" r="2.4" fill="currentColor"/>
        </svg>
        <p class="or-eye">${esc(d.eyebrow || '')}</p>
        <div class="or-medal">
          <h1 class="or-names">${names(d, '<span class="j">&amp;</span>')}</h1>
        </div>
        <svg class="or-fil" viewBox="0 0 160 24" aria-hidden="true">
          <path d="M4 12h50M106 12h50" stroke="currentColor" stroke-width=".8"/>
          <path d="M80 3c-9 0-14 5-14 9s5 9 14 9 14-5 14-9-5-9-14-9z" fill="none" stroke="currentColor" stroke-width=".8"/>
          <path d="M66 12h28" stroke="currentColor" stroke-width=".8"/>
        </svg>
        <div class="or-facts">
          <p>${esc(dt.wdLong)}, ${esc(dt.day)} ${esc(dt.monLong)} ${esc(dt.year)}</p>
          <p>${esc(fmtTime(d.wtime))}</p>
          <p>${esc(place(d))}</p>
        </div>
        ${colorDots(d, 'or-dots')}
        ${guestLine(d, guestName, seats)}
      </div>
    </div>`;
}

/* ------------------------------------------------------------------- 07/12 */
/* ARCH. An architectural portal cut out of a two tone ground. The names sit
   inside the aperture and the facts sit on the plinth below it, so the card is
   bottom weighted with the empty space above rather than in the middle. */
function arch(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  return `
    <div class="ar">
      <div class="ar-ground">
        <div class="ar-portal">
          ${photoLayer(d, 'ar-img')}
          <div class="ar-in">
            <p class="ar-eye">${esc(d.eyebrow || '')}</p>
            <h1 class="ar-names">${names(d, '<span class="j">&amp;</span>')}</h1>
          </div>
        </div>
      </div>
      <div class="ar-plinth">
        <p class="ar-date">${esc(dt.wdLong)} ${esc(dt.day)} ${esc(dt.monLong)} ${esc(dt.year)}</p>
        <p class="ar-time">${esc(fmtTime(d.wtime))}</p>
        <p class="ar-venue">${esc(place(d))}</p>
        ${guestLine(d, guestName, seats)}
      </div>
    </div>`;
}

/* ------------------------------------------------------------------- 08/12 */
/* TYPOGRAPHIC. The names are the artwork. Set enormous, stacked with negative
   leading so the lines nearly touch, running past the side edges on purpose.
   The facts retreat to the gutters, rotated, at the smallest size in the whole
   library. Nothing else is on the card. */
function typographic(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  const two = Boolean(d.p1) && Boolean(d.p2);
  return `
    <div class="ty">
      <div class="ty-gut ty-l"><span>${esc(fmtTime(d.wtime))}</span></div>
      <div class="ty-stack">
        <span class="ty-a">${esc(d.p1 || '')}</span>
        ${two ? '<span class="ty-amp">&amp;</span><span class="ty-b">' + esc(d.p2) + '</span>' : ''}
      </div>
      <div class="ty-gut ty-r"><span>${esc(place(d))}</span></div>
      <div class="ty-base">
        <span>${esc(d.eyebrow || '')}</span>
        <span>${esc(dt.day)}.${esc(dt.mon)}.${esc(dt.year)}</span>
      </div>
      ${guestLine(d, guestName, seats)}
    </div>`;
}

/* ------------------------------------------------------------------- 09/12 */
/* BOTANICAL. Organic leaf masses at the upper left and lower right push the
   content off centre to the right. Curves everywhere, no straight rule, and
   the one archetype whose content block is not aligned to any grid. */
function botanical(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  return `
    <div class="bo">
      <svg class="bo-tl" viewBox="0 0 140 140" aria-hidden="true">
        <path d="M4 4c46 0 84 38 84 84 0 0-38-6-58-26S4 4 4 4z" fill="currentColor" opacity=".26"/>
        <path d="M10 10c34 8 58 32 66 66" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".5"/>
        <path d="M30 22c14 2 24 12 27 26M18 42c16 6 26 18 29 33" fill="none" stroke="currentColor" stroke-width="1" opacity=".38"/>
      </svg>
      <svg class="bo-br" viewBox="0 0 140 140" aria-hidden="true">
        <path d="M136 136c-46 0-84-38-84-84 0 0 38 6 58 26s26 58 26 58z" fill="currentColor" opacity=".22"/>
        <path d="M130 130c-34-8-58-32-66-66" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".45"/>
      </svg>
      <div class="bo-body">
        <p class="bo-eye">${esc(d.eyebrow || '')}</p>
        <h1 class="bo-names">${names(d, '<span class="j">&amp;</span>')}</h1>
        <svg class="bo-sprig" viewBox="0 0 90 16" aria-hidden="true">
          <path d="M2 8c22 0 30-6 43-6s21 6 43 6" fill="none" stroke="currentColor" stroke-width="1"/>
        </svg>
        <div class="bo-facts">
          <p>${esc(dt.wdLong)}, ${esc(dt.day)} ${esc(dt.monLong)}</p>
          <p>${esc(fmtTime(d.wtime))}</p>
          <p>${esc(place(d))}</p>
        </div>
        ${colorDots(d, 'bo-dots')}
        ${guestLine(d, guestName, seats)}
      </div>
    </div>`;
}

/* ------------------------------------------------------------------- 10/12 */
/* LUXURY. Two thirds of the card is deliberately empty. Everything is small,
   letterspaced wide, and sits low. The restraint is the whole design, so any
   addition here breaks it: this is the archetype to leave alone. */
function luxury(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  return `
    <div class="lx">
      <div class="lx-void"></div>
      <div class="lx-block">
        <p class="lx-eye">${esc(d.eyebrow || '')}</p>
        <h1 class="lx-names">${names(d, '<span class="j">&amp;</span>')}</h1>
        <div class="lx-hair"></div>
        <p class="lx-line">${esc(dt.day)} ${esc(dt.monLong)} ${esc(dt.year)}</p>
        <p class="lx-line">${esc(fmtTime(d.wtime))}</p>
        <p class="lx-line lx-venue">${esc(place(d))}</p>
        ${guestLine(d, guestName, seats)}
      </div>
    </div>`;
}

/* ------------------------------------------------------------------- 11/12 */
/* COLOUR BLOCK. Two hard fields meet at 42 per cent and the names straddle the
   seam, half in each. No frame, no border, no ornament: the geometry carries
   the design, which is why this is the only archetype with no card edge. */
function colorblock(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  return `
    <div class="cb">
      <div class="cb-top"></div>
      <div class="cb-bottom"></div>
      <div class="cb-content">
        <p class="cb-eye">${esc(d.eyebrow || '')}</p>
        <h1 class="cb-names">${names(d, '<span class="j">&amp;</span>')}</h1>
        <div class="cb-facts">
          <p><b>${esc(dt.wdLong)} ${esc(dt.day)} ${esc(dt.monLong)}</b></p>
          <p>${esc(fmtTime(d.wtime))}</p>
          <p>${esc(place(d))}</p>
        </div>
        ${colorDots(d, 'cb-dots')}
        ${guestLine(d, guestName, seats)}
      </div>
    </div>`;
}

/* ------------------------------------------------------------------- 12/12 */
/* POSTER. The date is the graphic. A numeral large enough to read across a
   room, the title in condensed caps beside it, and every other fact demoted to
   an inverted footer bar. Reads as an event poster, not as stationery. */
function poster(d, guestName, seats) {
  const dt = dateParts(d.wdate);
  return `
    <div class="po">
      <div class="po-main">
        <div class="po-date">
          <span class="po-day">${esc(dt.day)}</span>
          <span class="po-mon">${esc(dt.mon)}</span>
          <span class="po-yr">${esc(dt.year)}</span>
        </div>
        <div class="po-title">
          <p class="po-eye">${esc(d.eyebrow || '')}</p>
          <h1 class="po-names">${names(d, '<span class="j">&amp;</span>')}</h1>
        </div>
      </div>
      <div class="po-bar">
        <span>${esc(fmtTime(d.wtime))}</span>
        <span>${esc(place(d))}</span>
      </div>
      ${guestLine(d, guestName, seats)}
    </div>`;
}

/* --------------------------------------------------------------- registry */

/* traits feed scripts/verify-designs.mjs. They are the eight columns of the
   matrix in docs/design-matrix.md, written next to the code they describe so
   the two cannot drift apart the way a separate spec always does. */
export const ARCHETYPES = [
  { id: 'editorial',  name: 'Editorial',    render: editorial,
    traits: { align:'centre', names:'upper-large', facts:'foot-row', factShape:'row', decor:'hairline', bg:'solid', space:'lower-middle', type:'serif-huge' } },
  { id: 'asymmetric', name: 'Asymmetric',   render: asymmetric,
    traits: { align:'left', names:'upper-left', facts:'lower-left', factShape:'stack', decor:'vertical-rule', bg:'solid', space:'right-column', type:'sans-small' } },
  { id: 'fullbleed',  name: 'Full Bleed',   render: fullbleed,
    traits: { align:'left-over-art', names:'lower-left', facts:'under-names', factShape:'inline', decor:'image', bg:'image', space:'none', type:'serif-reversed' } },
  { id: 'magazine',   name: 'Magazine',     render: magazine,
    traits: { align:'justified', names:'centre-on-rule', facts:'side-edges', factShape:'vertical', decor:'masthead', bg:'solid', space:'minimal', type:'condensed-caps' } },
  { id: 'swiss',      name: 'Swiss Grid',   render: swiss,
    traits: { align:'grid-topleft', names:'upper-left-small', facts:'bottom-columns', factShape:'grid', decor:'none', bg:'white', space:'top-margin', type:'sans-only' } },
  { id: 'ornamental', name: 'Ornamental',   render: ornamental,
    traits: { align:'centre-symmetric', names:'in-medallion', facts:'below-medallion', factShape:'ornate-stack', decor:'engraved', bg:'warm-tint', space:'none', type:'serif-smallcaps' } },
  { id: 'arch',       name: 'Arch',         render: arch,
    traits: { align:'centre-bottom', names:'in-aperture', facts:'on-plinth', factShape:'stack', decor:'architectural', bg:'two-tone', space:'above-arch', type:'serif-centred' } },
  { id: 'typographic',name: 'Typographic',  render: typographic,
    traits: { align:'edge-to-edge', names:'fills-card', facts:'gutters', factShape:'rotated', decor:'type-as-art', bg:'solid', space:'in-letterforms', type:'serif-enormous' } },
  { id: 'botanical',  name: 'Botanical',    render: botanical,
    traits: { align:'off-centre-right', names:'right-of-centre', facts:'lower-right', factShape:'stack-right', decor:'organic', bg:'soft-tint', space:'upper-left', type:'italic-serif' } },
  { id: 'luxury',     name: 'Luxury',       render: luxury,
    traits: { align:'centre', names:'lower-third-small', facts:'under-names', factShape:'tight-stack', decor:'hairline-only', bg:'solid', space:'upper-two-thirds', type:'small-tracked' } },
  { id: 'colorblock', name: 'Colour Block', render: colorblock,
    traits: { align:'left', names:'straddles-seam', facts:'lower-field', factShape:'stack', decor:'colour-fields', bg:'two-fields', space:'in-lower-field', type:'heavy-sans-caps' } },
  { id: 'poster',     name: 'Poster',       render: poster,
    traits: { align:'left-baseline', names:'below-date', facts:'footer-bar', factShape:'bar', decor:'giant-numeral', bg:'inverted-footer', space:'right-of-date', type:'numeral-dominant' } },
];

export const ARCHETYPE_BY_ID = Object.fromEntries(ARCHETYPES.map(a => [a.id, a]));

export function countArchetypes() { return ARCHETYPES.length; }

/* Renders one card into an element. Palette and type come in on the data
   object as CSS custom properties, exactly as before, because colour and
   typeface genuinely are interchangeable across compositions. Composition is
   the thing that is not. */
export function renderArchetype(el, archetypeId, d, guestName, seats) {
  const a = ARCHETYPE_BY_ID[archetypeId] || ARCHETYPES[0];
  el.className = 'mw-card';
  el.setAttribute('data-arch', a.id);
  const s = el.style;
  if (d.cBg) s.setProperty('--bg', d.cBg);
  if (d.cInk) s.setProperty('--ink', d.cInk);
  if (d.cAccent) s.setProperty('--accent', d.cAccent);
  if (d.cSeal) s.setProperty('--seal', d.cSeal);
  if (d.headFont) s.setProperty('--head', d.headFont);
  if (d.bodyFont) s.setProperty('--body', d.bodyFont);
  el.innerHTML = a.render(d, guestName, seats);
  return true;
}

if (typeof window !== 'undefined') {
  window.MwalikoArchetypes = { ARCHETYPES, ARCHETYPE_BY_ID, renderArchetype, countArchetypes };
}
