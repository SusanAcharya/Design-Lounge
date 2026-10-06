<!-- Design Lounge Nº 171 · "App icon shelf gallery" · www.designlounge.live -->

# App icon shelf gallery

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from icon.museum: the idea of a curated app-icon collection where every icon sits on a long frosted glass shelf with a faint reflection underneath, and one click opens a quiet label card with the icon large, its details and its colour palette. This rebuild is "Vitrine", an invented collection of 36 original icons drawn in inline SVG (no copied artwork). The page is warm bone paper with near-black ink and one vermilion accent. The detail worth copying is the shelf: a 15px translucent plank with backdrop blur that sits in front of each icon's `-webkit-box-reflect`, so the reflection reads as glass, not as a second icon.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────┐
│ Vitrine³⁶        [ ⌕ Search 36 icons            / ]   Collection Makers  │ 64px sticky, blur
│                                                       Notes (Submit an icon)
├──────────────────────────────────────────────────────────────────────────┤
│  max-width 1180, padding 0 40px                                          │
│  Small squares, kept with care.              Thirty-six app icons, ...   │ intro 36px top
│ ───────────────────────────────────────────────────────────────────────  │ 1px rule
│  (All 36)(Weather 3)(Health 6)(Productivity 6)(Music 4)(Photo 3)...       │ chips 32px
│  ● ● ● ● ● ● ● ● ●   [All|Flat|Glossy|Dark]              36 on display   │
│                                                                          │
│   ▢    ▢    ▢    ▢    ▢    ▢    ▢    ▢     84px tiles, 8 columns          │
│  ════════════════════════════════════════  15px glass plank, -16px      │
│                                             62px gap to next shelf       │
│   ▢    ▢    ▢    ▢    ▢    ▢    ▢    ▢                                    │
│  ════════════════════════════════════════                                │
└──────────────────────────────────────────────────────────────────────────┘

Detail dialog, 540px wide, radius 22
┌──────────────────────────────────────┐
│ Close Esc                    (‹) (›) │
│              ▢ 176px                 │
│            Ambergrain                │
│             (Photo)                  │
│ Studio                     Mabel Ito │
│ Released                    May 2023 │
│ Finish                        Glossy │
│ Platform               iPhone & iPad │
│ COLOUR PALETTE                       │
│ [████████|████████|████████|███████] │ 42px strip
│ ● #EE6A2C ● #AB4C20 ● #2A1A12 ● ...  │
└──────────────────────────────────────┘
```

- Header is a `header` with the brand as text, a `label` wrapping the search `input type="search"`, and a `nav` with three links plus one pill button.
- Intro is a `section` with the only `h1` and a `p`.
- Filters are a `section` holding three `role="group"` containers with `aria-label` Category, Colour, Finish, plus a `p` with `aria-live="polite"` for the count.
- The hall is a `section`; each shelf is a `div` grid; each icon is a `button` with an accessible name "Name, Category".
- The detail sheet is a native `dialog` opened with `showModal()`, labelled by its `h2`. The details are a `dl`.
- A hidden zero-size `svg` holds the shared `defs`: the squircle `clipPath`, the light gradient, the rim gradient, the gloss gradient and the glyph shadow filter.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Tile entry | each render | opacity, transform | 0, translateY(10px) scale(.94) → 1, none | 500ms, delay index × 18ms | expo-out | none, tiles appear |
| Tile lift | hover, focus-visible | transform | none → translateY(-8px) scale(1.08) | 320ms | expo-out | no lift; name pill still shows |
| Tile shadow | hover | filter | --sh-tile → --sh-tile-hover | 320ms | expo-out | instant |
| Tile press | active | transform | → translateY(-4px) scale(1.02) | 320ms | expo-out | none |
| Name pill | hover, focus-visible | opacity, transform | 0, translate(-50%,4px) → 1, translate(-50%,0) | 150ms / 200ms | std / expo-out | instant |
| Search hint | every 2.6s | opacity, transform | 1 → 0, translateY(-6px), swap text, back | 250ms each way | std | interval never starts |
| Dialog open | showModal | opacity, transform | 0, translateY(16px) scale(.97) → 1 | 420ms | expo-out | instant |
| Chip, swatch | hover | background, scale | swatch 1 → 1.12 | 150ms | std | instant |

Use `animation-fill-mode: backwards` on the tile entry, not `both`. With `both` the finished animation keeps owning `transform` and the hover lift stops transitioning.

## States

- Chip resting: paper fill, 1px `--line` border, `--ink-2` text. Hover: border `--ink-3`, text `--ink`. Pressed: ink fill, paper text, `aria-pressed="true"`.
- Swatch resting: the family colour with a 1px inset 12% black ring. Hover: scale 1.12. Pressed: an extra 2px ink ring drawn with `::after` at `inset: -4px`.
- Segment pressed: paper fill, `0 1px 2px rgba(0,0,0,.08)` shadow, ink text.
- Search focused: paper fill, 1px `--ink-3` border, the rotating hint is hidden. A typed value also hides the hint (`:not(:placeholder-shown)`).
- Tile hover and focus-visible: lifted, deeper shadow, name pill visible.
- Tile focus-visible: 2px vermilion outline, 3px offset, 8px radius, on top of the lift.
- Empty: shelves replaced by the empty block, count reads "0 on display".
- Dialog nav button hover: `--well` fill.
- Loading and error: not used. The collection is local data.

## Accessibility

- One `h1` (the headline). The dialog name is an `h2`. The empty state heading is an `h2`.
- Every icon is a `button` with `aria-label="Saltmarsh, Weather"`. The SVG inside is `aria-hidden="true"`. The name pill is `aria-hidden` because the label already carries the name.
- Filter controls are buttons with `aria-pressed`. Swatches have spoken names ("Teal", "Black and white"), never just a colour.
- The count uses `aria-live="polite"` so filter results are announced.
- `/` focuses search. It is ignored while the dialog is open or the field already has focus.
- The dialog uses native `showModal()` for the focus trap and Esc. ArrowLeft and ArrowRight browse. Focus returns to the tile on close.
- Contrast: `#1c1b19` on `#f4f2ee` is 15.6:1. `#6b675f` on `#f4f2ee` is 4.9:1. Paper text on the ink chip is 16:1.
- Hit targets: chips 32px tall with 6px gaps; swatches are 24px with a 6px gap. On touch layouts raise swatches to 32px.
- The colour filter is never the only way in: typing "blue" in search finds the same icons.

## Responsive rules

- ≥1280: as specified, 8 columns, max-width 1180.
- 1024–1279: 8 columns while the hall is at least 1040px wide, else 6. The intro stays two columns.
- 900 and below: the nav links hide (the Submit button stays). The intro stacks: headline, then paragraph, 12px apart.
- 768: 6 columns down to 780px of hall width, then 4.
- Under 640: tile 62px, page padding 16px, headline 38px, the header loses the nav, the search field fills the row. The chip row scrolls sideways inside itself (`overflow-x: auto`, hidden scrollbar), never the page. 3 columns per shelf. Dialog padding 18px, big icon 136px.
- At 375 the page has no horizontal scroll. Check `document.documentElement.scrollWidth <= innerWidth`.

## Acceptance checklist

### Always

- [ ] Icons are drawn as vector art clipped to a continuous-corner squircle, never a copied raster icon.
- [ ] Each shelf is a glass plank (translucent fill, backdrop blur, white top edge, soft drop) that sits in front of the icon reflections.
- [ ] Category, colour and finish filters combine with AND, and a live count reports the result.
- [ ] A no-results state offers a single "Clear filters" action.
- [ ] Hover and keyboard focus both lift the icon and reveal its name.
- [ ] The detail view is a modal dialog with Esc, backdrop close, previous/next and focus return.
- [ ] The detail view shows the icon large, its metadata rows and a palette strip with hex keys.
- [ ] Column count adapts to width (8 / 6 / 4 / 3) and the page never scrolls sideways at 375px.
- [ ] Reduced motion removes the entry stagger, the lift and the rotating search hint.

### This demo

- [ ] Brand "Vitrine" with a superscript 36; headline "Small squares, kept with care." with "kept" italic in `#d9480f`.
- [ ] 36 icons in nine categories: Weather 3, Health 6, Productivity 6, Music 4, Photo 3, Money 4, Reading 3, Travel 5, Games 2.
- [ ] Tiles are 84px; shelves have a 62px bottom gap and a 15px plank 16px below the tiles.
- [ ] Selecting Blue shows "5 on display"; adding Dark shows "1 on display"; adding Reading shows the empty state.
- [ ] Opening the ninth icon shows "Ambergrain", category Photo, studio "Mabel Ito", palette `#EE6A2C #AB4C20 #2A1A12 #FFF3EA`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 1280×800: a 64px sticky header, a two-part intro (serif headline left, 15px paragraph right), a filter bar, and three full shelves of eight icons visible.
2. The header search field shows a rotating hint: "Search 36 icons", "Search 9 categories", "Search 9 colours", "Search 9 studios". It swaps every 2.6s with a 250ms fade-and-rise. Under reduced motion it stays on "Search 36 icons".
3. Pressing `/` anywhere (outside the dialog) focuses the search field. Typing filters by app name, category or colour family as you type.
4. The category chips row starts with "All 36" pressed. Each chip shows its count in a lighter weight. Clicking a chip makes it the only pressed chip.
5. The colour row has nine 24px swatches: red, orange, yellow, green, teal, blue, violet, pink, black and white. Clicking a swatch selects it (2px ink ring at 4px offset). Clicking it again clears it.
6. The finish segmented control has All, Flat, Glossy, Dark. Exactly one is pressed.
7. All filters combine with AND. The count at the right of the filter bar reads "36 on display", "5 on display", "1 on display".
8. When the filters match nothing, the shelves are replaced by an empty state: serif heading "These shelves are bare.", one sentence, and a "Clear filters" link button that resets everything.
9. Each re-render fades icons in from 10px below at 94% scale, 500ms expo-out, staggered 18ms by position.
10. Hovering or focusing an icon lifts it 8px and scales it to 1.08 over 320ms. Its drop shadow deepens. A dark name pill appears 10px above it.
11. Clicking an icon opens a modal detail sheet: "Close Esc" at top left, previous and next round buttons at top right, the icon at 176px, the app name, a category pill, four detail rows (Studio, Released, Finish, Platform) and a four-swatch palette strip with hex keys.
12. In the sheet, ArrowLeft and ArrowRight move through the currently filtered list and wrap at both ends. Esc, the Close button, or a click on the backdrop closes it.
13. When the sheet closes, focus returns to the tile of the icon that was last shown.
14. The shelf column count follows the available width: 8 at 1040px and up, 6 at 780px, 4 at 520px, 3 below. It re-chunks only when the count changes.

## Tokens

```css
:root {
  /* colour */
  --bg: #f4f2ee;        /* bone paper */
  --paper: #fbfaf7;     /* dialog, chips, pressed segment */
  --well: #ebe8e2;      /* search field, segmented track, pill */
  --ink: #1c1b19;
  --ink-2: #4f4c46;
  --ink-3: #6b675f;     /* meta text; 4.9:1 on --bg */
  --line: #e0dcd4;
  --accent: #d9480f;    /* the one vermilion */
  --focus: #d9480f;
  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Onest", system-ui, sans-serif;
  --fs-display: 54px; --fs-empty: 34px; --fs-name: 24px;
  --fs-body: 15px; --fs-ui: 14px; --fs-chip: 13px; --fs-meta: 12px;
  /* space (4/8 base) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 24px; --s-6: 40px; --s-7: 62px;
  /* shape */
  --tile: 84px;          /* 62px under 640px */
  --r-chip: 999px; --r-field: 10px; --r-seg: 9px; --r-dialog: 22px; --r-strip: 10px;
  /* shadow */
  --sh-tile: drop-shadow(0 6px 8px rgba(40,30,10,.16)) drop-shadow(0 1px 1px rgba(40,30,10,.12));
  --sh-tile-hover: drop-shadow(0 14px 16px rgba(40,30,10,.22)) drop-shadow(0 2px 2px rgba(40,30,10,.12));
  --sh-dialog: 0 30px 80px rgba(30,20,5,.28);
  /* motion */
  --ease: cubic-bezier(.16,1,.3,1);
  --std: cubic-bezier(.2,.7,.2,1);
  --t-lift: 320ms; --t-in: 500ms; --t-stagger: 18ms; --t-hint: 2600ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Brand | Instrument Serif | 28px | 400 | 1 | -0.01em | Title |
| Brand count (sup) | Onest | 10px | 500 | 1 | 0.04em | Numerals |
| Headline | Instrument Serif | 54px | 400 | 1 | -0.02em | Sentence, one word in italic accent |
| Intro paragraph | Onest | 15px | 400 | 1.5 | 0 | Sentence, max 330px |
| Nav links | Onest | 14px | 400 | 1.5 | 0 | Title |
| Chip | Onest | 13px | 500 | 1 | 0 | Title, count at 55% opacity |
| Segmented | Onest | 13px | 400 | 1 | 0 | Title |
| Count | Onest | 13px | 400 | 1.5 | 0 | tabular-nums |
| Name pill | Onest | 12px | 500 | 1.2 | 0 | Title |
| Dialog name | Onest | 24px | 600 | 1.2 | -0.01em | Title |
| Detail rows | Onest | 14px | 400 label / 500 value | 1.5 | 0 | Sentence |
| Palette heading | Onest | 12px | 500 | 1 | 0.04em | Uppercase |
| Empty heading | Instrument Serif | 34px | 400 | 1.1 | 0 | Sentence |

The serif is only for the brand, the headline and the empty-state heading. Everything a user clicks is in Onest.

## Implementation notes

**1. One icon recipe for every tile.** Each icon is the same five layers in a 100-unit viewBox: a flat plate in `--b`, a shared top-light gradient, an optional gloss ellipse, the glyph in `--g` with an accent in `--a`, and a 1.6-unit rim stroke whose gradient is white at the top and dark at the bottom. Only the three custom properties change per icon, so no gradient ids have to be unique.

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <clipPath id="sq"><path d="M31 0H69C92 0 100 8 100 31V69C100 92 92 100 69 100H31C8 100 0 92 0 69V31C0 8 8 0 31 0Z"/></clipPath>
  <linearGradient id="lit" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".48" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
  <filter id="gs"><feDropShadow dx="0" dy="2.2" stdDeviation="1.8" flood-opacity=".26"/></filter>
</defs></svg>

<svg class="ic glossy" viewBox="0 0 100 100" style="--b:#ee6a2c;--g:#fff3ea;--a:#2a1a12">
  <g clip-path="url(#sq)">
    <rect class="bg" width="100" height="100"/>
    <rect width="100" height="100" fill="url(#lit)"/>
    <g class="gl" filter="url(#gs)">…glyph…</g>
    <path d="M31 0H69C92 0 …Z" fill="none" stroke="url(#rim)" stroke-width="1.6"/>
  </g>
</svg>
```

```css
.ic .bg { fill: var(--b); }
.ic .gl { fill: var(--g); }
.ic .gl .a { fill: var(--a); }
.ic .gl .s { fill: none; stroke: var(--g); stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
.ic.flat .lit { opacity: .55; }
```

The squircle path has straight sides from 31 to 69 and corner curves whose 45° point sits about 6.9 units in. That is close to the platform's continuous corner. A plain `border-radius: 22%` is an acceptable fallback, but it reads rounder and puffier.

**2. Glass shelf in front of a reflection.** The reflection belongs to the tile; the plank is the shelf's `::after` with a higher `z-index` and backdrop blur, so the reflection is softened behind it.

```css
.tile { -webkit-box-reflect: below 3px linear-gradient(transparent 62%, rgba(0,0,0,.2)); }
.shelf { position: relative; display: grid; grid-template-columns: repeat(var(--cols), 1fr);
         justify-items: center; padding: 0 28px; margin-bottom: 62px; }
.shelf::after { content: ""; position: absolute; left: 0; right: 0; bottom: -16px; height: 15px;
  border-radius: 8px; z-index: 2;
  background: linear-gradient(180deg, rgba(255,255,255,.78), rgba(232,229,223,.62));
  backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,.9);
  box-shadow: 0 1px 0 rgba(0,0,0,.05), 0 14px 22px -12px rgba(60,40,10,.35); }
```

`-webkit-box-reflect` is supported in Chromium and Safari. In Firefox there is no reflection; the plank still reads. Do not fake the reflection with a flipped duplicate icon; it doubles the DOM and the hover state.

**3. Chunk rows in JS, not with CSS wrap.** A wrapping grid cannot draw one plank per row. Chunk the filtered list by the current column count, render one `.shelf` per chunk, and re-render on resize only when the count changes.

```js
const cols = () => { const w = hall.clientWidth; return w >= 1040 ? 8 : w >= 780 ? 6 : w >= 520 ? 4 : 3; };
function render() {
  const c = cols(); let html = '';
  for (let r = 0; r < list.length; r += c)
    html += `<div class="shelf" style="--cols:${c}">` +
      list.slice(r, r + c).map((d, k) => tile(d, r + k)).join('') + '</div>';
  hall.innerHTML = html;
}
let last = 0; addEventListener('resize', () => { const c = cols(); if (c !== last) { last = c; render(); } });
```

Common mistakes:

- Copying real app icons or tracing them. Every icon here is a fresh glyph on a flat plate.
- Writing the app name inside the icon. Icons carry no words.
- Rounded rectangles with a heavy 1px border instead of a squircle with a gradient rim.
- A drop shadow on the shelf that is darker than the icons' shadows. The plank is lighter than the page.
- Filters as a `select`. They are visible pressed buttons so the state is readable at a glance.
- Opening a new page for the detail view. The sheet is a dialog so the shelves stay in place behind it.
- Forgetting focus return: keyboard users lose their place on the wall.
- Letting the chip row push the page wider on phones.

Rebuild order:

1. Put the shared `defs` in a hidden SVG and write the `icon(d)` function.
2. Lay out header, intro and filter bar.
3. Render shelves from the data with the chunking function.
4. Add the glass plank and the reflection.
5. Wire filters, count and empty state.
6. Add the dialog with previous/next, Esc and focus return.
7. Add hover lift, entry stagger, the rotating hint, then the reduced-motion block.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
