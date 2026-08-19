# Template design matrix

Twelve archetypes. Each one is a separate composition with its own markup and
its own CSS, not one skeleton restyled twelve ways.

The rule this table exists to enforce: **no two archetypes may share a
combination.** Reading down any single column you will see values repeat, which
is fine and unavoidable. Reading across, every row is unique. If a future
archetype matches an existing row on most columns, it is a recolour and must be
redesigned rather than added.

## The matrix

| # | Archetype | Alignment | Name position | Detail position | Detail shape | Decoration | Background | Negative space |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | Editorial | Centre | Upper half, very large | Bottom, one row | Horizontal row | Hairline only | Solid | Lower middle |
| 02 | Asymmetric | Left, hard | Upper left | Lower left | Stacked, left | Full-height vertical rule | Solid | Entire right column |
| 03 | Full bleed | Left, over image | Lower left, over art | Under names, over art | Inline, separated by dots | The image itself | Photo or colour field | None, edge to edge |
| 04 | Magazine | Justified plus left | Centre, over a rule | Both side edges | Two vertical edge columns | Masthead rules, issue badge | Solid | Deliberately little |
| 05 | Swiss | Grid, top left | Upper left, small | Bottom, three columns | Three column grid | One rule, nothing else | White | Wide top margin |
| 06 | Ornamental | Centre, symmetric | Centre, inside medallion | Below medallion | Ornate stack | Engraved frame and medallion | Warm tint | Almost none |
| 07 | Arch | Centre, bottom weighted | Inside the arch aperture | Below the arch | Stacked, centred | Architectural arch bands | Two tone, arch cut | Above the arch |
| 08 | Typographic | Edge to edge | Fills the whole card | Gutters, rotated | Vertical, rotated | The type is the artwork | Solid | Inside the letterforms |
| 09 | Botanical | Off centre right | Right of centre | Lower right | Stacked, right | Organic leaf forms, two corners | Soft tint | Upper left |
| 10 | Luxury | Centre | Lower third, small | Directly under names | Tight centred stack | One hairline | Solid | Upper two thirds |
| 11 | Colour block | Left | Straddles the block edge | Lower block, left | Stacked, left | The colour fields themselves | Two hard fields | Inside the lower field |
| 12 | Poster | Left, baseline grid | Below the date | Footer bar | Footer bar, inline | Giant date numeral | Solid, inverted footer | Right of the date |

## Typography strategy

Separate from the table above, because two archetypes may share a typeface and
still be entirely different designs. What must differ is the treatment.

| Archetype | Treatment |
| --- | --- |
| Editorial | Serif, very large, tight leading, no tracking |
| Asymmetric | Sans, small names, wide tracking on labels |
| Full bleed | Serif over image, white, drop shadow for legibility |
| Magazine | Condensed caps masthead, serif names, tiny sans cover lines |
| Swiss | Sans only, one size for names, uppercase micro labels |
| Ornamental | Serif with italic, small caps, letterspaced |
| Arch | Serif names, sans details, centred |
| Typographic | Serif set enormous, stacked, overlapping, negative leading |
| Botanical | Italic serif names, lowercase, soft |
| Luxury | Small serif, extreme letterspacing, tiny |
| Colour block | Heavy sans names, uppercase, flush left |
| Poster | Numeral dominant, condensed caps title, sans footer |

## Category direction

Categories draw from different archetype pools, so a Corporate card and a
Wedding card are not the same design with different words. Weddings never get
Poster or Colour block; Corporate never gets Ornamental or Botanical.

| Category | Archetypes |
| --- | --- |
| Weddings | Editorial, Ornamental, Arch, Botanical, Luxury, Full bleed, Typographic |
| Send-Off | Colour block, Poster, Full bleed, Magazine, Typographic, Asymmetric |
| Kitchen Party | Botanical, Colour block, Ornamental, Full bleed, Poster |
| Birthdays | Poster, Typographic, Colour block, Magazine, Full bleed |
| Corporate | Swiss, Asymmetric, Magazine, Editorial, Colour block |
| Graduation | Editorial, Arch, Swiss, Magazine, Luxury |
| Baby Shower | Botanical, Luxury, Arch, Colour block, Editorial |
| Church and Faith | Arch, Ornamental, Editorial, Luxury, Swiss |
| Anniversary | Ornamental, Editorial, Luxury, Typographic, Botanical |
| Memorial | Luxury, Editorial, Arch, Swiss |

## The similarity test

`npm run verify:designs` renders every archetype with identical content and
compares them on the axes in the first table. It fails the build if any two
archetypes match on more than three columns. That is the mechanical version of
the instruction "if removing the colour and decoration makes two templates look
almost identical, they are not sufficiently different".

It cannot judge taste. It can only stop the specific regression that produced
the previous library, where the differences were real in CSS and invisible on
screen.
