/* Cuts the supplied logo artwork into the shapes the site uses.
 *
 * Source of truth is Logo.png at the repository root, exactly as delivered.
 * Rather than hand-editing three files every time the artwork changes, this
 * script derives them, so a new Logo.png plus one command rebrands the site.
 *
 *   node scripts/build-logo.mjs
 *
 * Outputs:
 *   public/brand/logo.png          full lockup including the tagline
 *   public/brand/logo-compact.png  monogram and wordmark, tagline removed
 *   public/brand/mark.png          square monogram on the site's cream ground
 *   public/icon.png                copy of the mark, used as favicon and app icon
 *
 * Why a compact crop exists: the tagline sets at roughly a twelfth of the
 * lockup's height, so in a 30px header it lands around three pixels tall,
 * illegible and dragging the wordmark down to make room for it. Adapting a
 * lockup by dropping its tagline at small sizes is ordinary practice.
 *
 * The bounds below are measured from the delivered artwork rather than found
 * automatically. getbbox is no help: the PNG carries a halo of nearly
 * transparent pixels and getbbox counts any alpha above zero, so it returns
 * almost the entire canvas. Replacing Logo.png with art of a different
 * composition means re-measuring these six numbers.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'Logo.png');

if (!existsSync(src)) {
  console.error('[mwaliko] Logo.png not found at the repository root. Nothing to build.');
  process.exit(1);
}

/* Pillow does the pixel work. It is not a project dependency because this runs
   by hand when the artwork changes, not on every build, and adding an image
   toolchain to the deploy for a once-a-rebrand task is a poor trade. */
const py = `
from PIL import Image
im = Image.open(${JSON.stringify(src)}).convert('RGBA')
PAD = 12

# Measured content bounds within the delivered 1672x940 canvas.
LEFT, TOP, RIGHT = 246, 307, 1424
WORDMARK_BOTTOM  = 582          # feet of the monogram and of "Mwaliko"
TAGLINE_BOTTOM   = 608          # bottom of INVITE / RSVP / WELCOME
TAGLINE_LEFT     = 600          # tagline starts right of the monogram

im.crop((LEFT - PAD, TOP - PAD, RIGHT + PAD, TAGLINE_BOTTOM + PAD)).save(
    ${JSON.stringify(resolve(root, 'public/brand/logo.png'))})

# The monogram's feet reach WORDMARK_BOTTOM while the tagline sits below it and
# to the right, so no horizontal cut separates them. Erase the tagline in place.
compact = im.copy()
px = compact.load()
for y in range(WORDMARK_BOTTOM - 4, TAGLINE_BOTTOM + 12):
    for x in range(TAGLINE_LEFT, im.width):
        px[x, y] = (0, 0, 0, 0)
compact.crop((LEFT - PAD, TOP - PAD, RIGHT + PAD, WORDMARK_BOTTOM + PAD)).save(
    ${JSON.stringify(resolve(root, 'public/brand/logo-compact.png'))})

# Square mark. The artwork is navy on transparent, which vanishes against a dark
# browser tab, so it is composited onto the site's cream ground.
mono = im.crop((LEFT, TOP, 545, WORDMARK_BOTTOM + 1))
side = int(max(mono.size) * 1.34)
mark = Image.new('RGBA', (side, side), (246, 244, 239, 255))
mark.paste(mono, ((side - mono.width) // 2, (side - mono.height) // 2), mono)
mark = mark.resize((512, 512), Image.LANCZOS)
mark.save(${JSON.stringify(resolve(root, 'public/brand/mark.png'))})
mark.save(${JSON.stringify(resolve(root, 'public/icon.png'))})

print('[mwaliko] logo assets rebuilt from Logo.png')
`;

try {
  execFileSync('python3', ['-c', py], { stdio: 'inherit' });
} catch {
  console.error('[mwaliko] Failed. This script needs python3 with Pillow: pip install pillow');
  process.exit(1);
}
