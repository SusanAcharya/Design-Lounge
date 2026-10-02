---
title: "Luxe product detail"
summary: "Fragrance product page: CSS-only bottle with three glass variants, Cormorant serif name, a size radio with a sliding black indicator, and an Add to bag button that morphs to a gold Added state."
platform: web
type: screen
tags: [ecommerce, product, luxury, selector, button]
styles: [luxe, editorial]
motion: subtle
difficulty: 2
featured: false
published: 2026-09-29
palette: ["#F4EFE6", "#141210", "#B8945A", "#E9E2D4", "#8F7140"]
fonts: ["Cormorant Garamond", "Karla"]
related: [swiss-grid-pricing]
---

# Luxe product detail

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The product page for *Vetiver No. 7* by the fictional house *Maison Aurel*. The viewport splits 55 / 45: the left 704px is a cream-to-sand gradient stage holding a 200 × 320 bottle built entirely from CSS (gradient body, black cap, paper label, radial shadow) with three 52px variant swatches that recolour it; the right 576px is the information column: uppercase breadcrumb and bag count, gold eyebrow, a 54px Cormorant Garamond name with an italic numeral, serif price with a per-ml line, a 38ch description, a three-option size radio whose black indicator slides between options, a 56px "Add to bag" button that morphs into a gold "Added to bag" with a drawn check, and a notes list. Palette is cream, near-black and one gold; no shadows except the bottle's. The detail worth copying is the button morph: two stacked labels cross-slide while the surface turns gold and the check draws itself.

## Reference behaviour

1. Initial state: amber variant selected (swatch 1 outlined in black, index reads "01 / 03"); size "50 ml" checked with the indicator behind it; price "€148", per-line "50 ml · €2.96 / ml"; button reads "ADD TO BAG — €148"; bag count 0.
2. Click "30 ml" or "100 ml" (or use arrow keys within the group): the black indicator translates to that third over 280ms with expo-out; the checked label turns cream over 160ms; price, per-ml and the button's price update instantly (€92 / 30 ml · €3.07 per ml; €236 / 100 ml · €2.36 per ml). If the button was in the Added state it resets to idle.
3. Click "Add to bag": over 360ms the surface goes black → gold, the idle label slides up 10px and fades, the "Added to bag" label slides in from 10px below, and the 16px check draws its 24-unit stroke over 300ms after a 200ms delay. Bag count increments and the bag link's `aria-label` updates. Clicking again while Added does nothing.
4. Hover the idle button: background `#2a2622`. Hover a size option that is not checked: no change (the indicator is the only cue). Hover a swatch: 1px `--ink-3` border.
5. Click a swatch: the bottle's `--c1`/`--c2` change and the body gradient crossfades over 500ms; the top-right index updates ("02 / 03"); `aria-pressed` moves.
6. Focus-visible: 1px `--ink` outline at 4px offset on links, swatches and the add button; inside the size group the outline is cream and inset 5px so it is visible on the black indicator.
7. Reduced motion: all transitions 1ms and no delays; the check appears drawn.

## Structure

```
1280 × 800
┌───────────────────────────────────────┬────────────────────────────────────┐
│ MAISON AUREL                 01 / 03  │ FRAGRANCE / EAU DE PARFUM      ⌂ 0 │ 36px from top
│                                       │                                    │
│                 ┌──┐  cap 76×58       │ EAU DE PARFUM · UNISEX   (gold)    │
│               ┌─┴──┴─┐               │ Vetiver No. 7            (54px)    │
│               │      │ body 200×276  │ €148  50 ML · €2.96 / ML           │
│               │ No.7 │ label 132×74  │ Haitian vetiver root steeped …     │ 38ch
│               └──────┘               │ SIZE                    Size guide │
│              ‾‾shadow‾‾ 280×34       │ [ 30 ml │■50 ml■│ 100 ml ]  44px   │
│                                       │ [   ADD TO BAG — €148   ]   56px   │
│ ▣ ▢ ▢  swatches 52px                  │ TOP    Bergamot, pink pepper …     │
│                                       │ HEART  Haitian vetiver, iris …     │
│                                       │ BASE   Atlas cedar, ambrette …     │
│                                       │ Complimentary shipping over €120 … │
└───────────────────────────────────────┴────────────────────────────────────┘
        55% = 704px                           45% = 576px, padding 36/56
```

- `<body>` — `grid-template-columns: 55% 1fr`.
- `<section class="stage" aria-label="Product images">` — `.brand`, `.idx`, `.bottle[role="img"]` (children `.cap`, `.body`, `.label`, `.shadow`), `.thumbs[role="group"]` of three `<button aria-pressed>` swatches carrying `--c1/--c2` inline.
- `<section class="info">` — `<nav class="crumb">` with two links and `.bag` link (18px SVG + count); `.prod` (vertically centred with `margin:auto 0`, max 420px): `.eyebrow`, `<h1>`, `.price`, `.desc`, `.seglabel`, `.seg[role="radiogroup"]` with three `role="radio"` buttons, `.add` button with `.idle` and `.done` spans, `<ul class="notes">`, `.ship`.

## Tokens

```css
:root {
  /* colour — cream, near-black, one gold */
  --cream:   #f4efe6;  /* info column, label paper, checked-option text */
  --cream-2: #e9e2d4;  /* stage gradient top */
  --cream-3: #ddd4c2;  /* stage gradient bottom */
  --ink:     #141210;  /* text, button, indicator, borders */
  --ink-2:   #5b554c;  /* description, size label */
  --ink-3:   #8f887c;  /* breadcrumb, meta, per-ml */
  --line:    #d6cdbc;  /* note rules, size-guide underline */
  --gold:    #b8945a;  /* Added state surface */
  --gold-2:  #8f7140;  /* eyebrow, note headings, label small text */
  --btn-hover: #2a2622;

  /* variant glass (set per swatch, inherited by the bottle) */
  --amber-1: #d9c39c; --amber-2: #7d6236;
  --smoke-1: #9a9490; --smoke-2: #2e2a26;
  --moss-1:  #b9bf9a; --moss-2:  #3f4a2f;
  --glass-end: #3a2c17;   /* darkest stop of the body gradient */

  /* type */
  --serif: "Cormorant Garamond", Georgia, serif;
  --sans:  "Karla", system-ui, sans-serif;

  /* layout */
  --split: 55%;
  --pad: 56px;         /* 36 ≤1100 */
  --bottle-w: 200px; --bottle-h: 320px;
  --seg-h: 44px;
  --btn-h: 56px;
  --swatch: 52px;
  --radius: 0;         /* only the bottle has radii: 18/26px body, 6px cap */

  /* motion */
  --t-micro: 160ms;
  --t-seg: 280ms;
  --t-morph: 360ms;
  --t-check: 300ms;  --check-delay: 200ms;
  --t-swap: 500ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family             | Size | Weight | Line-height | Tracking | Case |
|-----------------|--------------------|-----:|-------:|------------:|---------:|------|
| Product name    | Cormorant Garamond | 54px | 400    | 1           | −0.01em  | sentence; "No. 7" italic |
| Price           | Cormorant Garamond | 26px | 400    | 1           | 0        | |
| Notes value     | Cormorant Garamond italic | 16px | 400 | 1.4       | 0        | |
| Label "No. 7"   | Cormorant Garamond | 22px | 500    | 1           | +0.02em  | |
| Stage brand     | Karla              | 12px | 500    | 1           | +0.22em  | UPPERCASE |
| Eyebrow         | Karla              | 12px | 400    | 1           | +0.20em  | UPPERCASE, `--gold-2` |
| Breadcrumb / bag| Karla              | 12px | 400    | 1           | +0.08em  | UPPERCASE, `--ink-3` |
| Per-ml          | Karla              | 12px | 400    | 1           | +0.06em  | UPPERCASE, `--ink-3` |
| Description     | Karla              | 15px | 400    | 1.65        | 0        | `--ink-2`, max 38ch |
| Size label      | Karla              | 12px | 400    | 1           | +0.14em  | UPPERCASE |
| Size options    | Karla              | 13px | 500    | 1           | +0.06em  | |
| Add button      | Karla              | 13px | 500    | 1           | +0.16em  | UPPERCASE |
| Note headings   | Karla              | 11px | 500    | 1           | +0.16em  | UPPERCASE, `--gold-2` |
| Label small     | Karla              | 10px | 400    | 1           | +0.20em  | UPPERCASE, `--gold-2` |
| Shipping line   | Karla              | 12px | 400    | 1.6         | +0.04em  | `--ink-3` |

## Motion

| Element              | Trigger        | Property             | From → To                          | Duration | Easing   | Delay |
|----------------------|----------------|----------------------|------------------------------------|---------:|----------|-------|
| `.seg::before`       | option change  | transform            | `translateX(i × 100%)`             | 280ms    | `--expo` | — |
| `.seg button`        | option change  | color                | `--ink` ↔ `--cream`                | 160ms    | `--ease` | — |
| `.add`               | click          | background, border, color | `--ink` → `--gold`, cream → ink | 360ms  | `--ease` | — |
| `.add .idle`         | click          | opacity, transform   | 1, 0 → 0, `translateY(-10px)`      | 360ms    | `--expo` | — |
| `.add .done`         | click          | opacity, transform   | 0, `translateY(10px)` → 1, 0       | 360ms    | `--expo` | — |
| `.done svg path`     | click          | stroke-dashoffset    | 24 → 0                             | 300ms    | `--expo` | 200ms |
| `.add`               | hover (idle)   | background           | `--ink` → `--btn-hover`            | 360ms    | `--ease` | — |
| `.bottle .body`      | swatch click   | background gradient (via `--c1/--c2`) | previous → new  | 500ms    | `--ease` | — |
| swatch               | hover / pressed| border-color         | transparent → `--ink-3` / `--ink`  | 160ms    | `--ease` | — |

Note: gradients do not interpolate in most browsers; the 500ms `transition: background` on `.body` degrades to a cut. For a true crossfade, stack two `.body` layers and fade opacity, or accept the cut (the demo accepts it).

## States

- **Size checked:** `aria-checked="true"`, `tabindex="0"`, cream text on the black indicator. Unchecked: `tabindex="-1"`, ink text on transparent.
- **Size focus-visible:** 1px `--cream` outline inset 5px (on the indicator) — the group has a 1px `--ink` border.
- **Add idle:** black surface, cream uppercase label with the price; hover `--btn-hover`.
- **Add added:** gold surface, ink text, check drawn; not disabled (keeps contrast), clicks ignored; any size change resets to idle.
- **Swatch pressed:** 1px `--ink` border; hover `--ink-3`.
- **Bag link:** count in weight 500; `aria-label` "Bag, n items".
- **Links (breadcrumb):** `--ink-3`, hover `--ink`. "Size guide": underlined with `--line`, offset 3px.
- No loading, error or out-of-stock states in the demo; an out-of-stock size should keep its slot, use `--ink-3` text with a line-through and `aria-disabled="true"`.

## Accessibility

- The size selector is a `role="radiogroup"` with three `role="radio"` buttons; JS implements roving tabindex and Left/Right/Up/Down arrows (wrapping). Space/Enter on a focused radio also selects it (native button click).
- The bottle is `role="img"` with an `aria-label` that includes the selected size; swatches are `aria-pressed` buttons with names "Amber glass", "Smoke glass", "Moss glass".
- The add button contains both labels; the `.done` span is `aria-hidden` so the accessible name stays "Add to bag — €148". After adding, update the bag link's `aria-label` (done) and, if you need an announcement, add a visually hidden `aria-live="polite"` region reading "Added 50 ml to bag".
- Keyboard order: breadcrumb links → bag → size guide → checked size radio → add button → swatches (they are in the left column but come later in DOM order; move `.thumbs` before `.info` in the DOM if you prefer left-to-right order).
- Contrast: `--ink-2` on cream 7.4:1; `--ink-3` on cream 3.7:1 (12px uppercase meta only; darken to `#7a7367` for AA); `--gold-2` on cream 4.6:1; cream on ink 15:1; ink on gold 6.0:1.
- Hit targets: size options ≥ 139 × 44; add button 56px; swatches 52px.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: `--pad: 36px`; name 44px; bottle scaled to 85%.
- 768–1023: columns stack; stage becomes a 420px-tall band with the bottle centred and swatches bottom-left; info column full width with the product block at the top.
- < 640: name 38px; size group stays three columns; notes grid becomes `64px 1fr`; the shipping line wraps.

## Acceptance checklist

- [ ] Columns are 55% / 45% at 1280; stage is a `#e9e2d4 → #ddd4c2` vertical gradient; info column is `#f4efe6`.
- [ ] Bottle is 200 × 320 built only from CSS: 76 × 58 cap, body with `18px 18px 26px 26px` radii and a `160deg` gradient from `--c1` through `--c2` to `#3a2c17`, a 132 × 74 cream label, a 280 × 34 radial shadow.
- [ ] Three 52px swatches recolour the bottle via `--c1/--c2` and update the "0n / 03" index; the pressed swatch has a 1px black border.
- [ ] Product name is Cormorant Garamond 54px with "No. 7" italic; eyebrow and note headings are `#8f7140` uppercase with ≥ 0.16em tracking.
- [ ] Size group is 44px tall with a 1px black border and no radius; the black indicator is exactly one third wide and slides with `translateX(i × 100%)` over 280ms `cubic-bezier(.16,1,.3,1)`.
- [ ] Prices update to €92 / €148 / €236 with the correct per-ml line (€3.07 / €2.96 / €2.36).
- [ ] Arrow keys move selection within the size group and focus follows; only the checked option is in the Tab order.
- [ ] "Add to bag" is 56px, black, uppercase with 0.16em tracking and includes the current price.
- [ ] Clicking it turns the surface `#b8945a` over 360ms, cross-slides the two labels by 10px, and draws a 16px check (dasharray 24) over 300ms after 200ms.
- [ ] Bag count increments once per add; changing size resets the button to idle.
- [ ] Focus is visible on every control, including on the black indicator (cream inset outline).
- [ ] No box-shadow anywhere except inside the bottle and under it; no border-radius outside the bottle.
- [ ] Reduced motion removes all delays and durations.

## Implementation notes

**Sliding indicator as a pseudo-element on the group.** Store the index on the group and let CSS do the maths:

```css
.seg { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--ink); height: 44px; }
.seg::before { content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: calc(100% / 3);
  background: var(--ink); transform: translateX(calc(var(--i, 0) * 100%)); transition: transform 280ms var(--expo); }
.seg button { position: relative; background: transparent; border: 0; color: var(--ink); transition: color 160ms var(--ease); }
.seg button[aria-checked="true"] { color: var(--cream); }
```

```js
function pick(i) {
  btns.forEach((b, k) => { b.setAttribute('aria-checked', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
  seg.style.setProperty('--i', i);
  const p = Number(btns[i].dataset.p), ml = Number(btns[i].dataset.ml);
  price.textContent = '€' + p; per.textContent = ml + ' ml · €' + (p / ml).toFixed(2) + ' / ml';
  add.classList.remove('added');
}
```

**Button morph with stacked labels** — both spans share `grid-area: 1/1` so the button never changes size:

```css
.add { display: grid; place-items: center; overflow: hidden; transition: background 360ms var(--ease), color 360ms var(--ease); }
.add span { grid-area: 1 / 1; transition: opacity 360ms var(--ease), transform 360ms var(--expo); }
.add .done { opacity: 0; transform: translateY(10px); }
.add .done svg path { stroke-dasharray: 24; stroke-dashoffset: 24; transition: stroke-dashoffset 300ms var(--expo) 200ms; }
.add.added { background: var(--gold); color: var(--ink); }
.add.added .idle { opacity: 0; transform: translateY(-10px); }
.add.added .done { opacity: 1; transform: none; }
.add.added .done svg path { stroke-dashoffset: 0; }
```

**Bottle from CSS only:** body gradient `linear-gradient(160deg, var(--c1) 0%, var(--c2) 70%, #3a2c17 100%)`, plus `box-shadow: inset 8px 0 18px rgba(255,255,255,.28), inset -10px 0 22px rgba(0,0,0,.28)` for the glass edge, and a `::before` highlight stripe 10px wide at `left:22px` fading from 70% white to 0.

Common mistakes: rounding the size group or the button (the piece reads as luxe only with square corners); animating `width` of the indicator instead of `transform`; disabling the Added button (grey text on gold fails contrast); putting the price only inside the button so screen readers miss it in the price line.
