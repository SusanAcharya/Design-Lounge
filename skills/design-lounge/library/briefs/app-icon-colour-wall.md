<!-- Design Lounge Nº 170 · "App icon colour wall" · designlounge.vercel.app -->

# App icon colour wall

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from icon.museum: its "Wall of Icons" page fills the screen edge to edge with icons and shows a name only on hover, and its search indexes icons by colour family. This piece is "Hueboard", which joins those two ideas: a dark wall of 96 generated icons that you can re-sort by hue, from light to dark, or by shape, and every icon flies to its new place. It belongs on a collection or design-tool site where colour is the way people browse. The detail worth copying is the FLIP re-sort with a tiny 4ms stagger, which turns sorting into a single readable sweep instead of a jump.

## Reference behaviour

1. First frame at 1280×800: a 96px-cell grid of 64px icons fills the page under a fading top bar with the wordmark and one line of copy. A floating control bar sits 24px from the bottom centre.
2. The wall starts "Shuffled", a fixed scatter of hues, plates and shapes.
3. The control bar has a "Sort" label, a four-button segmented control (Shuffled, By hue, Light to dark, By shape) with the active one in lime, and a pin readout that starts as "Click an icon to pin it".
4. Clicking a sort button moves every icon from its old position to its new one in 720ms (expo-out), each starting 4ms after the one before (capped at 300ms). Clicking the active button does nothing.
5. By hue: coloured plates first, ordered by hue from red round to pink; then white plates by glyph hue; then black plates by glyph hue. A 3px spectrum line fades in under the top bar while this sort is active.
6. Light to dark: white plates, then coloured plates from lightest to darkest, then black plates.
7. By shape: icons grouped by glyph (Ring, Pair, Peak, Bars, Arch, Cross, Half, Spark, Drop, Bolt, Leaf, Gem), each group ordered by hue.
8. Hovering the wall dims every icon to 50%. The icon under the pointer stays at 100%, lifts 6px, scales to 1.14 and shows its name 8px below.
9. Clicking an icon pins it: a 2px lime ring appears around it, and the pin readout shows a 34px copy of the icon, its name and its colour as hex plus shape, in the form "Juniper Deck · #3FA86B · Leaf". Clicking the same icon again unpins it. Only one icon is pinned.
10. Reduced motion: icons jump to their new place with no flight, there is no lift, and dimming is instant.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────┐
│ Hueboard  96 app icons on one wall. Sort them the way your eye already… │ fixed top, fades to transparent
│ ════════════ spectrum line (hue sort only) ════════════════════════════  │ top 66px, 3px
│  ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢    12 cells × 100px        │
│  ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢    96px rows + 4px gap     │
│  ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢                            │
│  ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢                            │
│  ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢                            │
│  ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢   ▢                            │
│  ▢   ▢  ┌──────────────────────────────────────────────────────┐  ▢   ▢    │
│         │ SORT [Shuffled|By hue|Light to dark|By shape] │ pin   │          │ fixed, bottom 24px
└─────────┴──────────────────────────────────────────────────────┴──────────┘
 wall padding 76px 24px 130px; page scrolls vertically for rows 7–8
```

- The top bar is a fixed `header` with the `h1` wordmark and a `p`. Its background is a gradient from the page colour to transparent, with `pointer-events: none` on the bar and `auto` on its children.
- The wall is `main` with `aria-label="Icon wall"`, a grid `repeat(auto-fill, 100px)` centred.
- Each cell is a `div` (the element that moves); inside it a `button` with `aria-pressed` for the pin and an `aria-label` like "Moss Loop, peak on colour".
- The control bar is a fixed `div role="group"` labelled "Wall controls"; the segmented control is buttons with `aria-pressed`; the pin readout is `aria-live="polite"`.
- The spectrum line is a decorative fixed `div`.

## Tokens

```css
:root {
  /* colour */
  --bg: #0e0e10;
  --panel: #1a1a1d;
  --ink: #edeae3;
  --ink-2: #a8a49b;     /* secondary copy; 7.6:1 on --bg */
  --line: #2a2a2e;
  --accent: #c8f169;    /* lime: active sort, pin ring, wordmark half */
  --on-accent: #141a06;
  --focus: #c8f169;
  --white-plate: #f2f0ea;
  --black-plate: #161618;
  /* type */
  --display: "Syne", system-ui, sans-serif;
  --mono: "Azeret Mono", ui-monospace, monospace;
  /* layout */
  --tile: 64px; --cell: 100px; --row: 96px;
  /* shape */
  --r-bar: 18px; --r-seg: 12px; --r-seg-btn: 9px; --r-pin: 30%;
  /* shadow */
  --sh-tile: drop-shadow(0 6px 10px rgba(0,0,0,.45));
  --sh-bar: 0 20px 50px rgba(0,0,0,.5);
  /* motion */
  --expo: cubic-bezier(.16,1,.3,1);
  --std: cubic-bezier(.2,.7,.2,1);
  --t-flip: 720ms; --t-stagger: 4ms; --t-stagger-cap: 300ms; --t-hover: 300ms;
}
```

Icon generation (seeded, so every visitor sees the same wall):

| Field | Rule |
| --- | --- |
| hue | `(i × 137.508 + rand × 20) mod 360` — golden-angle spread |
| saturation | 50–82% |
| lightness | 44–60% |
| plate kind | 64% coloured plate, 20% white plate `#f2f0ea`, 16% black plate `#161618` |
| glyph colour | white on coloured plates (near-black when lightness > 56 and hue 40–190); the hue on white plates (lightness − 4); the hue lifted +10 lightness on black plates |
| glyph | `(i × 5 + rand × 12) mod 12` from the twelve shapes |
| name | prefix from 16 words × suffix from 14 words, e.g. "Saffron Post", "Juniper Deck" |
| seed | Park–Miller, `seed = seed × 16807 mod 2147483647`, start 7 |

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Syne | 26px | 800 | 1 | -0.02em | Title, "board" in lime |
| Tagline | Azeret Mono | 12px | 400 | 1.5 | 0 | Sentence, `--ink-2` |
| Sort label | Azeret Mono | 11px | 400 | 1 | 0.1em | Uppercase, `--ink-2` |
| Segment | Azeret Mono | 12px | 400 (active 500) | 1 | 0 | Sentence |
| Hover name | Azeret Mono | 11px | 400 | 1 | 0 | Title |
| Pin name | Syne | 13px | 600 | 1.2 | 0 | Title |
| Pin meta | Azeret Mono | 11px | 400 | 1.5 | 0 | Hex uppercase |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Re-sort | sort button | transform on each cell | translate(old − new) → none | 720ms, delay min(n × 4ms, 300ms) | expo-out | none, cells jump |
| Wall dim | pointer enters wall | opacity of all tiles | 1 → .5 | 300ms | std | instant |
| Tile lift | hover, focus-visible | transform, opacity | none, .5 → translateY(-6px) scale(1.14), 1 | 300ms | expo-out | opacity only |
| Hover name | hover, focus-visible | opacity, transform | 0, translate(-50%,-3px) → 1, translate(-50%,0) | 150ms / 200ms | std / expo-out | instant |
| Spectrum line | hue sort on/off | opacity | 0 ↔ .9 | 400ms | std | instant |
| Segment | press | background, colour | dark → lime | 150ms | std | instant |

The FLIP uses the Web Animations API on the cell, not on the button, so the hover transform on the button never fights the flight.

## States

- Segment resting: `--ink-2` text on the dark track. Hover: `--ink`. Active: lime fill, `--on-accent` text, weight 500, `aria-pressed="true"`.
- Tile resting: full opacity until the pointer enters the wall. Wall hovered: 50%. Tile hovered or focused: 100%, lifted, name visible.
- Tile pinned: `aria-pressed="true"`, a 2px lime ring 6px outside with 30% radius, stays at 100% opacity while the wall is dimmed.
- Pin readout empty: "Click an icon to pin it" in `--ink-2`. Filled: icon, name, hex and shape.
- Focus-visible: 2px lime outline, 3px offset, 14px radius.
- Loading, empty, error: not used.

## Accessibility

- One `h1` (the wordmark).
- Each tile is a button whose name says what the eye sees: "Saffron Post, ring on colour", "Velvet Box, drop on white", "Harbor Kit, bolt on black". The hover name is `aria-hidden`.
- Sort buttons use `aria-pressed`. Re-sorting keeps DOM order equal to visual order, so Tab follows the new order.
- The pin readout is a polite live region, so pinning reads the name and hex aloud.
- The colour order is never the only information: shape sort and names give non-colour routes.
- Hit targets: segment buttons 34px tall; tiles 64px.
- Contrast: `#edeae3` on `#0e0e10` is 15:1; `#a8a49b` on `#0e0e10` is 7.6:1; lime on the dark track is 14:1 and the dark text on lime is 13:1.
- The dimming only happens on pointer hover. Keyboard focus lifts the focused tile without dimming others, so nothing goes below 4.5:1 for keyboard users.

## Responsive rules

- ≥1280: 12 columns of 100px cells; the wall scrolls vertically for the last rows.
- 1024: 9 columns (auto-fill inside 24px padding). Nothing else changes.
- 768 and below: tile 52px, cell 82px, wall padding 84px 8px 170px. The top bar stacks wordmark over tagline. The control bar wraps to two lines (segments, then pin), drops the "Sort" label and sits 14px from the bottom.
- At 375: four columns, segment buttons at 11px with 9px padding, no page-level sideways scroll.
- Keep the bottom padding larger than the control bar so the last row can be scrolled clear of it.

## Acceptance checklist

### Always

- [ ] The wall fills the width edge to edge with equal cells and a name that appears only on hover or focus.
- [ ] At least three sort orders, one of them by hue, plus a non-colour order (shape).
- [ ] Re-sorting animates every icon from old to new position with FLIP, staggered and capped.
- [ ] DOM order matches visual order after every sort.
- [ ] Hovering dims the rest of the wall; the hovered icon lifts and stays at full strength.
- [ ] Clicking pins one icon and shows its colour as hex in a live readout.
- [ ] Icons are generated from a seed so the wall is the same on every load.
- [ ] Icons share one construction: squircle clip, plate, top-light gradient, rim, glyph shadow.
- [ ] Reduced motion removes the flight and the lift.

### This demo

- [ ] Wordmark "Hueboard" with "board" in `#c8f169`; tagline "96 app icons on one wall. Sort them the way your eye already does."
- [ ] 96 icons, 64px in 100px cells, rows 96px with a 4px gap.
- [ ] Sort options read Shuffled, By hue, Light to dark, By shape; Shuffled starts active.
- [ ] FLIP lasts 720ms with a 4ms stagger capped at 300ms.
- [ ] Pinning shows "Name · #HEX · Shape" with a 34px icon.

## Implementation notes

**1. FLIP on the cell, with Web Animations.** Measure every cell, move them in the DOM, measure again, and animate from the difference. `fill: 'backwards'` holds the start offset during the stagger delay so cells do not flash at their new place.

```js
function sort(key) {
  const order = ORD[key]();
  const first = new Map(); cells.forEach((c, i) => first.set(i, c.getBoundingClientRect()));
  order.forEach(d => wall.appendChild(cells.get(d.i)));        // DOM order = new visual order
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  order.forEach((d, n) => {
    const c = cells.get(d.i), a = first.get(d.i), b = c.getBoundingClientRect();
    const dx = a.left - b.left, dy = a.top - b.top;
    if (!dx && !dy) return;
    c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }],
      { duration: 720, delay: Math.min(n * 4, 300), easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
  });
}
```

**2. Sort keys that match what the eye sees.** A plain hue sort puts white and black icons in the middle of the rainbow, which looks wrong. Group by plate kind first, then by hue. For lightness, give white plates 94 and black plates 9 so they land at the ends.

```js
const rank = d => d.kind === 'solid' ? 0 : d.kind === 'white' ? 1 : 2;
const ORD = {
  shuffle: () => shuffled,
  hue:   () => [...D].sort((a, b) => rank(a) - rank(b) || a.h - b.h),
  light: () => [...D].sort((a, b) => b.lum - a.lum || a.h - b.h),
  kind:  () => [...D].sort((a, b) => a.g - b.g || a.h - b.h),
};
```

**3. Dim the wall, not the tile.** One rule on the container handles all 96 tiles; no JS listeners.

```css
.tile { transition: transform .3s var(--expo), opacity .3s var(--std); }
.wall:hover .tile { opacity: .5; }
.wall .tile:hover, .wall .tile:focus-visible { opacity: 1; transform: translateY(-6px) scale(1.14); z-index: 2; }
.tile[aria-pressed="true"] { opacity: 1; }
.tile[aria-pressed="true"]::after { content: ""; position: absolute; inset: -6px; border-radius: 30%; border: 2px solid var(--accent); }
```

Each icon uses the same SVG recipe as the rest of this family: a `viewBox="0 0 100 100"`, a shared squircle `clipPath` (`M31 0H69C92 0 100 8 100 31V69C100 92 92 100 69 100H31C8 100 0 92 0 69V31C0 8 8 0 31 0Z`), a plate `rect` filled with `var(--b)`, a shared top-light gradient rect, the glyph in `var(--g)` with a shared drop-shadow filter, and a rim stroke with a white-to-dark gradient. Only `--b` and `--g` are set per icon.

Common mistakes:

- Animating the button instead of the cell. The hover transform and the flight then overwrite each other.
- Sorting by RGB value. Sort by hue, and handle neutrals separately.
- `Math.random()` without a seed. The wall changes on every load and screenshots never match.
- Neon saturation everywhere. Keep saturation between 50 and 82% and lightness between 44 and 60%.
- Showing every name all the time. Names on hover keep the wall a wall.
- A stagger without a cap: 96 × 4ms is 384ms before the last icon moves; cap it at 300ms.
- Letting the floating bar cover the last row with no bottom padding.

Where it sits:

1. As the "Wall" view of an icon or asset collection, next to a curated shelf view such as `app-icon-shelf-gallery`. The shelf is for reading one icon; the wall is for scanning all of them.
2. As a palette browser in a design tool: swap the icons for swatches, keep the sort and the FLIP.
3. As a section on a studio site that shows a body of icon work. Keep the dark ground; icons read best on near-black.
4. With real data, compute each icon's dominant colour once at upload time (average of the plate pixels, ignoring the glyph) and store hue and lightness. Do not compute it in the browser on every sort.
5. With more than about 300 icons, virtualise rows and run FLIP only on cells that are on screen before and after the sort.
6. Pair the pin readout with a detail sheet if the product needs one; the readout alone is enough for a colour browser.

Sizing for other densities:

| Wall | Tile | Cell | Row |
| --- | --- | --- | --- |
| Dense (this demo) | 64px | 100px | 96px |
| Roomy | 80px | 128px | 124px |
| Phone | 52px | 82px | 96px |

Rebuild order:

1. Data: the seeded generator, the twelve glyphs, the names.
2. Shared `defs` and the `icon()` function.
3. Wall grid and cells, the fixed top bar with its fade.
4. Floating control bar and the four sort orders.
5. FLIP animation with stagger and cap.
6. Hover dim, lift and name; pin with ring and readout.
7. Spectrum line for the hue sort, reduced-motion block, test at 375.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
