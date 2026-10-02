---
title: "Filter chips product list"
summary: "A 390px product list with a horizontally scrolling chip row (selected chip grows a check), a sort bottom sheet, a 2-column grid with SVG wishlist hearts, and a shimmer skeleton on every filter change."
platform: mobile-web
type: layout
category: inputs
tags: [ecommerce, filters, chips, bottom-sheet, grid, skeleton]
styles: [minimal, soft]
motion: subtle
difficulty: 2
featured: false
published: 2026-09-29
palette: ["#F3F4F1", "#FFFFFF", "#16201A", "#E2523A"]
fonts: ["Syne", "Manrope"]
related: [mobile-one-page-checkout]
---

# Filter chips product list

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A category listing page for a fictional outdoor-gear shop ("Fjell"). A sticky header holds the title, a live item count, a horizontally scrolling row of filter chips and a round sort button. Below is a two-column card grid: tinted product image with an optional SALE badge, a heart button, name, meta line, price (with struck original on sale) and a rating. Changing a chip or sort swaps the grid for four shimmering skeleton cards for 550ms, then fades the real cards in two at a time. The chip that is worth copying: selecting it fills it dark and a 16px check icon animates its width from 0, so the chip visibly grows rather than snapping.

## Reference behaviour

1. Initial state: "All" chip pressed, sort "Featured", 8 items in a 2-column grid, the "Bre 38L pack" heart already filled. Sheet and scrim hidden.
2. Tap a chip (e.g. "Boots"): the previously pressed chip loses its fill; the tapped chip animates background `--surface → --chip-on`, text to `--chip-on-ink`, and its check icon grows from 0 to 16px wide with a 6px right margin over 160ms. The chip scrolls into view if partially clipped. The grid is replaced by 4 skeleton cards (`aria-busy="true"`), and 550ms later the filtered cards render with a 6px rise + fade over 300ms; even-numbered cards start 40ms later. The item count updates ("2 items").
3. "Sale" filters to items with a sale price; the empty state ("Nothing here yet") spans both columns if a filter yields nothing.
4. Tap the sort button: a scrim fades to 45% over 300ms and a bottom sheet slides up from below the 80px reserve over 380ms with the iOS-sheet easing. Focus moves to the checked option.
5. Tap an option: its check icon scales from .6 to 1 and fades in; the sheet closes; the grid re-skeletons and re-renders sorted. A 7px orange dot appears on the sort button while the sort is not "Featured".
6. Tap the scrim or press Escape: the sheet closes and focus returns to the sort button.
7. Tap a heart: it fills `--accent`, the stroke turns `--accent` and the icon pops (`scale .7 → 1.25 → 1`) over 300ms. Tapping again empties it. Wishlist state survives filter changes.
8. Scroll the list: the header (title + chips) stays stuck at the top.

## Structure

```
390 × 844 (54px status reserve above, 80px browser bar below)
┌──────────────────────────────────────┐
│ Shell jackets & more        8 items  │ sticky header (bg), h1 26px
│ [(ok) All][Jackets][Boots][Packs][Ten…] ((=)) │ 40px chips · 40px sort btn
├──────────────────────────────────────┤
│ ┌────────────┐  ┌────────────┐       │ 2 cols, 12 gap, 16 gutter
│ │ SALE   (heart)   │  │        (heart)   │       │ image 1:1.1, tint + curve
│ │            │  │            │       │
│ ├────────────┤  ├────────────┤       │
│ │ Ridge 3L…  │  │ Kvist down…│       │ name 14/600
│ │ Jackets·412│  │ Jackets·187│       │ meta 12
│ │ £289  (star)4.8 │  │ £299 £349  │       │ price 15 Syne / rating
│ └────────────┘  └────────────┘       │
│ ┌────────────┐  ┌────────────┐       │
│ …                                    │
├──────────────────────────────────────┤
│ ▲ sheet (on demand), bottom: 80px    │
│  ── grab ──                          │
│  Sort by                             │ 18px Syne
│  Featured                          (ok) │ 52px rows
│  Price: low to high                  │
│  Price: high to low                  │
│  Top rated                           │
└──────────────────────────────────────┘
```

- `<header class="head">` — `position: sticky; top: 0`, `margin-top: 54px`; `.title` row (`<h1>`, `.count[aria-live=polite]`) and `.tools` row (`.chips[role=group]` of `<button class="chip" aria-pressed>` + `<button class="sortbtn" aria-haspopup="dialog" aria-expanded>`).
- `<main class="grid" aria-live="polite" aria-busy>` — 2-column grid of `<article class="card">`: `.img` (with `--tint`, optional `.badge`, `<button class="wish" aria-pressed>`), `.info` (`.name`, `.meta`, `.row` with `.price` and `.rating`).
- Skeleton: four `.sk` blocks (`.a` image, `.b` and `.c` bars) replace the cards while loading.
- `.scrim` (fixed) and `.sheet[role=dialog][aria-modal]` (fixed at `bottom: 80px`) with a `.grab` handle, `<h2>`, and a `role="radiogroup"` of `<button role="radio" aria-checked>` options.

### Content

- Title "Shell jackets & more"; count "8 items".
- Chips: All (pressed), Jackets, Boots, Packs, Tents, Sale.
- Products (name · category · price · rating · reviews · tint · sale price): "Ridge 3L shell jacket" · Jackets · £289 · 4.8 · 412 · #8ea3b8; "Kvist down parka" · Jackets · £349 · 4.6 · 187 · #b8a48e · sale £299; "Tind trail boot" · Boots · £179 · 4.7 · 655 · #8e8b7e; "Skar approach shoe" · Boots · £139 · 4.4 · 230 · #a4b19b · sale £119; "Bre 38L pack" · Packs · £159 · 4.9 · 921 · #c7b6a1 (pre-wishlisted); "Vidde 22L daypack" · Packs · £89 · 4.5 · 304 · #9fb3b4; "Hei 2-person tent" · Tents · £429 · 4.7 · 142 · #b39c9c · sale £379; "Lyng tarp shelter" · Tents · £119 · 4.3 · 88 · #a9a58d.
- Image: `--surface-2` base with a tinted overlay (`--tint`, 90% opacity) whose bottom-left corner is rounded 46%.
- Sort options: Featured (default), Price: low to high, Price: high to low, Top rated.
- Empty state: "Nothing here yet" / "Try another category or clear the sort."

## Tokens

```css
:root {
  /* colour — cool grey-green neutrals, ink chips, vermilion accent */
  --bg: #f3f4f1;
  --surface: #ffffff;         /* cards, chips, sheet */
  --surface-2: #e6e8e2;       /* image base, skeleton */
  --line: #dcdfd7;
  --ink: #16201a;
  --ink-2: #5c665f;           /* rating text, empty copy */
  --ink-3: #8b948d;           /* meta, count, struck price */
  --accent: #e2523a;          /* hearts, sale badge, checks, focus */
  --accent-ink: #ffffff;
  --chip-on: #16201a;
  --chip-on-ink: #f3f4f1;
  --scrim: rgba(22, 32, 26, .45);
  --skeleton-hi: #eef0ea;     /* shimmer highlight */

  /* type */
  --display: "Syne", system-ui, sans-serif;
  --sans: "Manrope", system-ui, sans-serif;

  /* layout */
  --safe-top: 54px;
  --safe-bottom: 80px;
  --gutter: 16px;
  --gap: 12px;
  --chip-h: 40px;
  --wish: 40px;
  --img-ratio: 1 / 1.1;
  --r: 14px;                  /* cards */
  --r-chip: 999px;
  --r-sheet: 20px;
  --shadow-sheet: 0 -12px 40px rgba(22, 32, 26, .18);

  /* motion */
  --t-fast: 160ms;            /* chip fill, check grow, heart colour */
  --t-layout: 300ms;          /* card in, scrim, heart pop */
  --t-sheet: 380ms;
  --t-skeleton: 1200ms;       /* shimmer period */
  --t-load: 550ms;            /* simulated fetch */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-sheet: cubic-bezier(.32, .72, 0, 1);
}
```

## Typography

| Role          | Family  | Size | Weight | Line-height | Tracking | Case      |
|---------------|---------|-----:|-------:|------------:|---------:|-----------|
| Body          | Manrope | 14px | 400    | 1.45        | 0        | sentence  |
| Page title    | Syne    | 26px | 700    | 1           | −0.02em  | sentence  |
| Item count    | Manrope | 13px | 400    | 1.4         | 0        | sentence  |
| Chip          | Manrope | 14px | 500    | 1           | 0        | sentence  |
| Product name  | Manrope | 14px | 600    | 1.3         | 0        | sentence, single line ellipsis |
| Meta          | Manrope | 12px | 400    | 1.4         | 0        | sentence  |
| Price         | Syne    | 15px | 700    | 1.2         | −0.01em  | tabular numerals |
| Struck price  | Manrope | 12px | 500    | 1.2         | 0        | numerals  |
| Rating        | Manrope | 12px | 400    | 1           | 0        | tabular numerals |
| Sale badge    | Syne    | 10px | 700    | 1           | +0.08em  | UPPERCASE |
| Sheet title   | Syne    | 18px | 700    | 1.2         | −0.01em  | sentence  |
| Sheet option  | Manrope | 15px | 500    | 1.3         | 0        | sentence  |
| Empty title   | Syne    | 18px | 700    | 1.2         | 0        | sentence  |

## Motion

| Element           | Trigger         | Property                     | From → To                         | Duration | Easing         | Notes |
|-------------------|-----------------|------------------------------|-----------------------------------|---------:|----------------|-------|
| `.chip`           | pressed         | background, color, border    | white/ink → `--chip-on`/`--chip-on-ink` | 160ms | `--ease`     | |
| `.chip svg`       | pressed         | width, opacity, margin-right | 0, 0, 0 → 16px, 1, 6px            | 160ms    | `--ease`       | grows the chip |
| `.card`           | render          | opacity, translateY          | 0, 6px → 1, 0                     | 300ms    | `--ease-out`   | even cards +40ms |
| `.sk div`         | loading         | background-position          | 200% → −200%                      | 1200ms   | linear, infinite | 3-stop gradient |
| `.scrim`          | sheet open      | opacity                      | 0 → 1 (colour is 45% alpha)       | 300ms    | `--ease`       | |
| `.sheet`          | sheet open      | transform                    | `translateY(calc(100% + 80px))` → 0 | 380ms  | `--ease-sheet` | `visibility` toggles with it |
| `.opt svg`        | checked         | opacity, scale               | 0, .6 → 1, 1                      | 160ms    | `--ease-out`   | |
| `.wish svg`       | pressed         | fill, color, scale           | none → `--accent`; .7 → 1.25 → 1  | 160ms / 300ms | `--ease-out` | `@keyframes pop` |
| `.sortbtn i`      | sort ≠ Featured | opacity                      | 0 → 1                             | 160ms    | linear         | 7px dot |

Reduced motion: all transitions and animations 1ms; the skeleton shimmer is removed (static `--surface-2`); the 550ms load delay stays.

## States

- **Chip pressed:** `aria-pressed="true"`, dark fill, check visible. Only one chip pressed at a time.
- **Chip focus-visible / sort / heart / option focus-visible:** 2px `--accent` outline, 2px offset.
- **Sort button dirty:** `.dirty` shows the 7px accent dot at top-right (7px inset).
- **Sort button expanded:** `aria-expanded="true"` while the sheet is open.
- **Heart pressed:** `aria-pressed="true"`, path filled and stroked `--accent`.
- **Grid loading:** `aria-busy="true"`, four skeleton cards, count unchanged until render.
- **Grid empty:** a single full-width `.empty` block with title and hint.
- **Sheet open:** `.on` on sheet and scrim, `aria-hidden="false"`; closed is `visibility: hidden`.
- **Option checked:** `aria-checked="true"`, accent check visible.

## Accessibility

- Chips are `<button aria-pressed>` inside `role="group" aria-label="Filter by category"`; the row scrolls horizontally with `scroll-snap-type: x proximity` and hides its scrollbar but stays keyboard scrollable via Tab through the chips (a pressed chip calls `scrollIntoView`).
- The grid is `aria-live="polite"` with `aria-busy` toggled around loads so screen readers announce the new count, not every card. The count span is its own polite region.
- Hearts are 40×40 buttons with `aria-label="Save <product>"` and `aria-pressed`.
- The sheet is `role="dialog" aria-modal="true" aria-labelledby`; options are `role="radio"` buttons inside a `role="radiogroup"`. Opening moves focus to the checked option; closing returns it to the sort button; Escape closes; scrim click closes.
- Sale badge is real text ("SALE"), 10px but bold on `--accent` (4.9:1 with white).
- Contrast: `--ink-2` on white 6.4:1; `--ink-3` on white 3.6:1 used only at 12–13px for meta and count; chip text on `--chip-on` 15.5:1.
- Hit targets: chips 40px, sort 40px, hearts 40px, options 52px.

## Responsive rules

- 390 (reference): 2 columns, cards ≈ 173px wide.
- 360 wide: same grid, cards ≈ 158px; the name line still ellipsises; badge and heart unchanged.
- ≥ 600: 3 columns; header content capped at 720px centred; sheet becomes a centred 400px card (`bottom: auto; top: 50%; transform: translate(-50%, -50%)`) and `--safe-bottom: 0`.
- ≥ 900: 4 columns.

## Acceptance checklist

- [ ] Header is sticky with a 54px top margin; chips row scrolls horizontally with no visible scrollbar.
- [ ] Chips are 40px tall pills; the pressed chip is `#16201a` with `#f3f4f1` text and a 16px check that animates its width from 0 over 160ms.
- [ ] Only one chip is pressed at a time; `aria-pressed` reflects it.
- [ ] Every filter or sort change shows exactly 4 skeleton cards for 550ms with a 1200ms shimmer, then renders cards with a 300ms rise; the grid carries `aria-busy` during the load.
- [ ] Item count updates after each render and is a polite live region.
- [ ] The grid is 2 columns with a 12px gap and 16px gutters; images are `aspect-ratio: 1 / 1.1`.
- [ ] Hearts are 40px SVG buttons with `aria-pressed`; pressing fills the path `#e2523a` and pops it (.7 → 1.25 → 1 over 300ms); state survives filtering.
- [ ] Sale items show a 10px "SALE" badge and a struck original price next to the sale price.
- [ ] The sort sheet slides up from `translateY(calc(100% + 80px))` over 380ms `cubic-bezier(.32,.72,0,1)` and sits at `bottom: 80px`; a 45% scrim fades over 300ms.
- [ ] Sheet options are `role="radio"`; Escape and scrim close the sheet; focus returns to the sort button.
- [ ] A 7px accent dot marks the sort button whenever the sort is not "Featured".
- [ ] Nothing fixed occupies the bottom 80px; grid bottom padding is `80px + 24px`.
- [ ] Reduced motion removes the shimmer and shortens every transition to ≤ 1ms.

## Implementation notes

**The chip grows via the icon's width, not padding.** Keep `gap: 0` and animate `width` + `margin-right` on the SVG so the label shifts right by exactly 22px:

```css
.chip { display: inline-flex; align-items: center; gap: 0; height: 40px; padding: 0 14px 0 12px;
        transition: background var(--t-fast) var(--ease), color var(--t-fast), border-color var(--t-fast); }
.chip svg { width: 0; height: 16px; opacity: 0;
            transition: width var(--t-fast) var(--ease), opacity var(--t-fast), margin var(--t-fast); }
.chip[aria-pressed="true"] { background: var(--chip-on); color: var(--chip-on-ink); border-color: var(--chip-on); }
.chip[aria-pressed="true"] svg { width: 16px; opacity: 1; margin-right: 6px; }
```

**Skeleton swap with a cancellable timer**, so rapid chip taps do not stack renders:

```js
let t;
function refresh() {
  clearTimeout(t);
  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = '<div class="sk"><div class="a"></div><div class="b"></div><div class="c"></div></div>'.repeat(4);
  t = setTimeout(render, 550);
}
```

**Wishlist state lives outside the DOM** (a `Set` of product ids) so re-rendering the grid keeps hearts filled; delegate the click from the grid:

```js
const wished = new Set([4]);
grid.addEventListener('click', e => {
  const w = e.target.closest('.wish'); if (!w) return;
  const id = +w.dataset.i, on = !wished.has(id);
  on ? wished.add(id) : wished.delete(id);
  w.setAttribute('aria-pressed', String(on));
});
```

Common mistakes: animating `padding-left` on the chip instead of the icon width (label jitters); binding heart handlers per card and losing them on re-render; forgetting `visibility: hidden` on the closed sheet so its options stay in the tab order; using `scroll-snap-type: x mandatory` on the chips row (it fights with `scrollIntoView`).
