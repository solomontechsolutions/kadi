/* ============================================================================
   Kadi Genome Engine -- renderer
   ----------------------------------------------------------------------------
   Builds the single DOM skeleton that every one of the 277,112 genomes styles.
   There is exactly ONE markup shape: axes never add or remove structural
   elements, they only restyle the hooks they own. That is deliberate --
   the moment a genome starts emitting different markup, two axes can disagree
   about what exists and the composition guarantee is gone.

   Elements that a given genome does not use stay in the DOM and are hidden by
   CSS (.k-media, .k-crest, .k-motif, .k-rule), so nothing has to know which
   other axes are active in order to render.

   Shared by the studio preview (index.html) and the live guest invite
   (invite.html). Before this file existed those two carried divergent copies of
   the same layout CSS, so every new design had to be hand-ported twice.
   ========================================================================== */
(function (global) {
'use strict';

const K = global.KadiGenome;
if (!K) throw new Error('kadi-render.js requires kadi-genome.js to load first');

/* ------------------------------------------------------------- formatting */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDate(iso) {
  if (!iso) return '';
  const dt = new Date(iso + 'T00:00:00');
  if (isNaN(dt)) return '';
  return dt.toLocaleDateString(undefined, {
    weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

function fmtTime(t) {
  if (!t) return '';
  const [h, m] = String(t).split(':').map(Number);
  if (isNaN(h)) return '';
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + ':' + String(m || 0).padStart(2, '0') + ' ' + ampm;
}

function partyTag(seats) {
  const n = Number(seats) || 1;
  if (n <= 1) return 'SINGLE';
  if (n === 2) return 'DOUBLE';
  return 'PARTY OF ' + n;
}

function monogram(d) {
  return (((d.p1 || '')[0] || '') + ((d.p2 || '')[0] || '')).toUpperCase();
}

/* ------------------------------------------------------------------ pieces */
function mediaHTML(d) {
  // Always emitted. media="none" hides it in CSS, which keeps the element
  // count constant across genomes so no other axis has to branch on it.
  const src = d.photo ? ' src="' + esc(d.photo) + '"' : '';
  return '<div class="k-media"><img alt=""' + src + '></div>';
}

function motifHTML() {
  return '<div class="k-motif" aria-hidden="true">' +
    '<i class="k-mc k-mc-tl"></i><i class="k-mc k-mc-tr"></i>' +
    '<i class="k-mc k-mc-bl"></i><i class="k-mc k-mc-br"></i>' +
    '<i class="k-mring"></i></div>';
}

function headerHTML(d) {
  return '<div class="k-header">' +
    '<div class="k-crest">' + esc(monogram(d)) + '</div>' +
    '<div class="k-eyebrow">' + esc(d.eyebrow || '') + '</div>' +
    '<div class="k-names">' + esc(d.p1 || '') +
      '<span class="k-amp">&amp;</span>' + esc(d.p2 || '') + '</div>' +
  '</div>';
}

function bodyHTML(d) {
  const place = [d.venue, d.city].filter(Boolean).join(', ');
  const rows = [
    ['Date',  fmtDate(d.wdate)],
    ['Time',  fmtTime(d.wtime)],
    ['Venue', place],
  ].filter(r => r[1]);
  return '<div class="k-body">' + rows.map(r =>
    '<div class="k-detail"><span class="k-dlabel">' + esc(r[0]) + '</span>' +
    esc(r[1]) + '</div>').join('') + '</div>';
}

function colorsHTML(d) {
  if (!d.showEventColors) return '';
  const cols = (d.eventColors || []).filter(Boolean);
  if (!cols.length) return '';
  return '<div class="k-colors"><div class="k-eclabel">Event Colours</div>' +
    '<div class="k-ecolors">' +
    cols.map(c => '<span class="k-ecolor" style="background:' + esc(c) + '"></span>').join('') +
    '</div></div>';
}

function footHTML(d, guestName, seats, showSeal) {
  const guest = guestName ? '<div class="k-guest">' +
    '<div class="k-guestline">Reserved for</div>' +
    '<div class="k-guestname">' + esc(guestName) +
      (Number(seats) > 1 ? ' &amp; party of ' + Number(seats) : '') + '</div></div>' : '';
  const seal = showSeal ? '<div class="k-sealwrap">' +
    '<div class="k-sealrow"><div class="k-seal"></div>' +
    (guestName ? '<div class="k-ptag">' + esc(partyTag(seats)) + '</div>' : '') +
    '</div><div class="k-sealcap">present for entry</div></div>' : '';
  if (!guest && !seal) return '';
  return '<div class="k-foot">' + guest + seal + '</div>';
}

/* ------------------------------------------------------------------ public */
function buildCard(d, guestName, seats, showSeal) {
  return '<div class="k-frame" aria-hidden="true"></div>' +
    motifHTML() +
    '<div class="k-content">' +
      mediaHTML(d) +
      headerHTML(d) +
      '<div class="k-rule" aria-hidden="true"></div>' +
      bodyHTML(d) +
      colorsHTML(d) +
      footHTML(d, guestName, seats, showSeal) +
    '</div>';
}

/* Palette + type tokens. Kept separate from the genome so a design can change
   colour or font without touching structure (and vice versa). */
function applyTokens(card, d) {
  const hf = K.HEADING_FONTS[d.hf ?? 0] || K.HEADING_FONTS[0];
  const bf = K.BODY_FONTS[d.bf ?? 0]    || K.BODY_FONTS[0];
  const sc = K.SCALES[d.sc ?? 1]        || K.SCALES[1];
  K.ensureFont(hf.gf);
  K.ensureFont(bf.gf);

  const s = card.style;
  s.setProperty('--bg',     d.cBg     || '#F6F1E9');
  s.setProperty('--ink',    d.cInk    || '#2B2A26');
  s.setProperty('--accent', d.cAccent || '#B08D57');
  s.setProperty('--seal',   d.cSeal   || '#7B6A4E');
  s.setProperty('--headfont', hf.css);
  s.setProperty('--bodyfont', bf.css);
  s.setProperty('--namesize',   sc.nameSize);
  s.setProperty('--detailsize', sc.detailSize);

  // Italic is a property of the chosen heading face, not of any axis -- a face
  // with no true italic would otherwise get a synthesised oblique.
  card.classList.toggle('k-italic', !!hf.italic);
}

function applyGenome(card, g) {
  K.AXES.forEach(a => card.setAttribute('data-' + a.key, g[a.key]));
}

/* One call does everything: structure, tokens, content. */
function renderCard(card, d, guestName, seats, showSeal) {
  const g = K.genomeFromDesign(d);
  if (g.__site) return false;          // the scrolling site family renders elsewhere
  applyGenome(card, g);
  applyTokens(card, d);
  card.innerHTML = buildCard(d, guestName, seats, showSeal);
  return true;
}

global.KadiRender = {
  esc, fmtDate, fmtTime, partyTag, monogram,
  buildCard, applyTokens, applyGenome, renderCard,
};
})(window);
