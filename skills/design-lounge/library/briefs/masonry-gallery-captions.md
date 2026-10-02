<!-- Design Lounge Nº 035 · "Masonry gallery with captions" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Masonry gallery with captions

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A portfolio archive page ("Marrow Archive") on near-black. Fourteen tiles of six different aspect ratios flow into a four-column masonry built with CSS `columns`, each tile "painted" with gradients and a pseudo-element shape rather than an image. Hovering or focusing a tile slides a caption bar up from the bottom edge (title, dimensions, series label in coral) while the artwork scales 3 % behind it. A row of pill chips above filters the wall by series: hidden tiles fade and shrink out over 360ms, the survivors reflow. The thing worth copying is the caption bar: a gradient scrim that reads as part of the tile, sliding on `transform` only.

## Reference behaviour

1. Initial state: header with the title (Syne 30px, "Archive" in coral), a one-line subtitle, and five chips at the right; "All 14" is pressed (inverted: light fill, dark text). Below a hairline, the wall shows all 14 tiles at rest, no captions visible. The wall scrolls; the header stays.
2. Hover a tile: the caption bar translates from `translateY(100%)` to 0 over 280ms; the artwork scales to 1.03 over 600ms expo-out. Leave: both reverse.
3. Tab to a tile: same as hover, plus a two-ring focus box-shadow (2px page colour, then 2px coral).
4. Click a chip (e.g. "Landscape 4"): the chip becomes pressed and "All" unpresses. Non-matching tiles fade to opacity 0 and scale to .96 over 360ms, then are removed from flow (`display: none`); matching tiles that were hidden are re-inserted and fade in from the same state. The wall scrolls back to top.
5. Click "All": every tile returns.
6. If a filter yields nothing (not reachable with the shipped data, but the code handles it), the wall shows "Nothing in this series yet." centred in `--ink-3`.
7. Clicking a tile is prevented in the demo (would open a detail view in a product).

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ Marrow Archive                     [All 14][Landscape 4][Studio 4]… 34 │ header 28/40 pad
│ Fourteen studies from…                                                 │
├────────────────────────────────────────────────────────────────────────┤ hairline
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   ← 4 CSS columns, 12px gap │
│ │  4:5   │ │ 16:10  │ │  3:4   │ │  16:9  │                            │
│ │        │ ├────────┤ │        │ ├────────┤                            │
│ ├────────┤ │  2:3   │ ├────────┤ │  3:4   │                            │
│ │  1:1   │ │        │ │  1:1   │ │        │                            │
│ │        │ │        │ │        │ ├────────┤                            │
│ ├────────┤ ├────────┤ ├────────┤ │  1:1   │  (wall scrolls)            │
│ …                                                                      │
└────────────────────────────────────────────────────────────────────────┘
tile widths = (1280 − 80 − 3×12) / 4 = 291px
```

- `<header>`: title block (`<h1>`, `.sub`) and `<div class="chips" role="group" aria-label="Filter by series">` of `<button class="chip" aria-pressed data-f>`.
- `<div class="wall">` (`flex: 1; overflow: auto; padding: 20px 40px 40px`): `<div class="grid">` with `columns: 4; column-gap: 12px`, then a `.empty` paragraph.
- Each tile is `<a class="tile nN" data-c="series">` containing `<div class="art">` (sets `aspect-ratio` from `--ar`) and `<div class="cap">` with `<b>` title, `<span>` meta, `<i>` series label. The painted artwork lives on the tile's `background` and an optional `::after` shape.
- Aspect ratios in order: 4/5, 1/1, 3/4, 16/10, 2/3, 1/1, 5/4, 3/4, 1/1, 4/5, 16/9, 3/4, 1/1, 5/4. Series: land ×4, studio ×4, type ×3, obj ×3.

## Tokens

```css
:root {
  /* colour — warm near-black, bone text, coral accent */
  --bg: #151517;          /* page, scrim base */
  --panel: #1c1c1f;       /* tile fallback surface */
  --line: #2a2a2e;        /* hairline, chip border */
  --ink: #f1efe9;         /* text, pressed chip fill */
  --ink-2: #a3a29c;       /* secondary */
  --ink-3: #6c6b66;       /* tertiary, chip hover border */
  --accent: #f05d3b;      /* series label, focus ring, title word */
  --accent-ink: #1a0d08;
  --scrim: linear-gradient(to top, rgba(21,21,23,.92), rgba(21,21,23,.6) 70%, transparent);

  /* artwork palette (used across the 14 tiles) */
  --bone: #e9e3d5; --sky: #a9c4d4; --pine: #26402f; --sand: #f2e6c9; --ochre: #e6c15a;
  --rust: #b8452e; --teal: #0f6b62; --plum: #3b2b45; --stone: #8f8a80; --lamp: #e3a75a;

  /* type */
  --display: "Syne", system-ui, sans-serif;
  --sans: "Manrope", system-ui, sans-serif;
  --fs-h1: 30px; --fs-sub: 13px; --fs-chip: 13px; --fs-cap: 14px; --fs-meta: 12px; --fs-label: 11px;

  /* layout */
  --cols: 4; --gap: 12px; --gutter: 40px; --r: 6px; --chip-h: 34px;
  --cap-pad: 12px 14px;

  /* motion */
  --t-micro: 160ms; --t-layout: 280ms; --t-filter: 360ms; --t-zoom: 600ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --zoom: 1.03; --shrink: .96;
}
```

## Typography

| Role          | Family  | Size | Weight | Line-height | Tracking | Case |
|---------------|---------|-----:|-------:|------------:|---------:|------|
| Title         | Syne    | 30px | 700    | 1           | −0.02em  | sentence; second word `--accent` |
| Subtitle      | Manrope | 13px | 400    | 1.5         | 0        | `--ink-2` |
| Chip          | Manrope | 13px | 500    | 1           | 0        | sentence; count 11px at 60 % opacity, tabular |
| Caption title | Syne    | 14px | 700    | 1.2         | −0.01em  | sentence |
| Caption meta  | Manrope | 12px | 400    | 1.3         | 0        | `--ink-2`; "80 × 100 cm" uses a real multiplication sign |
| Series label  | Manrope | 11px | 600    | 1           | +0.06em  | UPPERCASE `--accent` |
| Empty state   | Manrope | 14px | 400    | 1.5         | 0        | `--ink-3`, centred |

## Motion

| Element      | Trigger        | Property             | From → To                  | Duration | Easing       |
|--------------|----------------|----------------------|----------------------------|---------:|--------------|
| `.cap`       | tile hover / focus-visible | transform | `translateY(100%)` → `0`    | 280ms    | `--ease`     |
| `.art`       | tile hover     | transform scale      | 1 → 1.03                   | 600ms    | `--ease-out` |
| `.tile.out`  | filter out     | opacity, transform   | 1, 1 → 0, scale(.96)       | 360ms    | `--ease`; then `display: none` after 360ms |
| `.tile` (re-enter) | filter in | opacity, transform  | 0, .96 → 1, 1              | 360ms    | `--ease`; needs two `requestAnimationFrame`s after un-hiding |
| `.chip`      | hover / press  | color, border, background | `--ink-2`/`--line` → `--ink`/`--ink-3`; pressed = `--ink` fill | 160ms | `--ease` |
| `.wall`      | filter         | scrollTop            | → 0                        | instant  | —            |

Reduced motion: all transitions 1ms; the art does not scale on hover; filtered tiles hide immediately (skip the 360ms timeout).

## States

- **Tile rest:** artwork only, radius 6px, `overflow: hidden`.
- **Tile hover:** caption visible, art scaled 1.03, cursor pointer.
- **Tile focus-visible:** caption visible + `box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent)`.
- **Tile filtered out (`.out`):** opacity 0, scale .96, then `.hide` (`display: none`).
- **Chip rest:** transparent, 1px `--line` border, `--ink-2` text.
- **Chip hover:** `--ink` text, `--ink-3` border.
- **Chip pressed (`aria-pressed="true"`):** `--ink` fill, `--bg` text, border `--ink`.
- **Chip focus-visible:** 2px `--accent` outline, 2px offset.
- **Empty wall:** `.wall.none .empty` displayed; grid renders nothing.

## Accessibility

- Tiles are `<a>` elements with the caption text inside them, so each link's accessible name is "Harvest moon over Skagen Study 01 · 80 × 100 cm Landscape". The caption is off-screen by transform, not `display: none`, so it is always read.
- Focus-visible reveals the caption exactly as hover does, so keyboard users get the same information.
- Chips are `<button aria-pressed>` inside a `role="group"` with a label; Space/Enter toggle. Exactly one chip is pressed at a time (single-select behaviour with toggle semantics; use `role="radiogroup"` if your design system prefers).
- The grid has `aria-live="polite"` so a filter change announces the new contents; alternatively announce "Showing 4 of 14" in a visually hidden status region.
- Contrast: `--ink-2` on `--bg` 7.8:1; caption text sits on a scrim of ≥ 60 % `--bg` over any artwork, keeping ≥ 4.5:1; `--accent` on `--bg` 5.1:1; pressed chip `--bg` on `--ink` 15:1.
- Hit targets: chips 34px tall (fine for pointer; make them 40px on touch layouts); tiles are ≥ 130px on their shortest side.

## Responsive rules

- ≥ 1280: 4 columns, 40px gutters.
- 1024–1279: 4 columns (tile width ~226px at 1024).
- 768–1023: 3 columns.
- 481–767: 2 columns; header stacks title over chips; chips wrap.
- ≤ 480: 1 column; captions remain hover/focus-revealed (on touch, first tap reveals, second tap follows the link — or show captions permanently below 480 if the product needs them).

## Acceptance checklist

- [ ] The wall uses CSS `columns: 4` with `column-gap: 12px`; tiles have `break-inside: avoid` and a 12px bottom margin.
- [ ] Fourteen tiles with the listed aspect ratios in the listed order; no image files are requested.
- [ ] Caption bar is hidden with `translateY(100%)` and slides to 0 in 280ms on hover and on focus-visible.
- [ ] Caption scrim is a bottom-to-top gradient from 92 % to 0 % page colour; text remains ≥ 4.5:1 on every tile.
- [ ] Artwork scales to 1.03 over 600ms on hover and not at all under reduced motion.
- [ ] Five chips with counts 14/4/4/3/3; exactly one has `aria-pressed="true"` at any time.
- [ ] Filtering fades non-matching tiles (opacity 0, scale .96, 360ms) before removing them from flow; returning tiles fade in.
- [ ] After filtering, the wall's scroll position resets to 0.
- [ ] Tile focus ring is a two-ring box-shadow (page colour then coral) and does not get clipped by `overflow: hidden` on the wall.
- [ ] Header stays fixed while only the wall scrolls.
- [ ] Column count steps 4 → 3 → 2 → 1 at 1023 / 767 / 480.
- [ ] No console errors when clicking chips rapidly (timeouts must not throw if a tile is re-shown mid-fade).

## Implementation notes

**Masonry with `columns`** — the only masonry that needs no JS. Tiles must not break across columns, and the caption needs the tile to be a positioning context:

```css
.grid { columns: var(--cols); column-gap: var(--gap); }
.tile { position: relative; display: block; break-inside: avoid; margin: 0 0 var(--gap);
        border-radius: var(--r); overflow: hidden; }
.art  { width: 100%; aspect-ratio: var(--ar, 1); }
.cap  { position: absolute; inset: auto 0 0 0; transform: translateY(100%);
        transition: transform var(--t-layout) var(--ease); }
.tile:hover .cap, .tile:focus-visible .cap { transform: translateY(0); }
```

**Filter with a fade before `display: none`** — and re-enter with a double rAF so the browser paints the hidden state before transitioning:

```js
function filter(f) {
  chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.f === f)));
  tiles.forEach(t => {
    const show = f === 'all' || t.dataset.c === f;
    if (show) { t.classList.remove('hide'); t.classList.add('out');
      requestAnimationFrame(() => requestAnimationFrame(() => t.classList.remove('out'))); }
    else { t.classList.add('out'); setTimeout(() => t.classList.add('hide'), 360); }
  });
}
```

**Painting tiles without images** — combine a gradient background with one pseudo-element shape; keep each tile to a single idea:

```css
.n1 { --ar: 4/5; background: linear-gradient(160deg, #2e3a4b, #0f1720 60%); }
.n1::after { content: ""; position: absolute; left: 18%; top: 26%; width: 52%; aspect-ratio: 1;
             border-radius: 50%; background: radial-gradient(circle at 35% 35%, #f5d7b0, #c2703f 55%, #5b2a1a); }
```

Common mistakes: animating `bottom` instead of `transform` for the caption (jank); using `display: none` on the caption (screen readers lose the link text); forgetting `break-inside: avoid` (tiles split across columns); expecting DOM order to read left-to-right (CSS columns fill top-to-bottom — if reading order matters, use grid + JS masonry instead).

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
