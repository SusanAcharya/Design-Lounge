<!-- Design Lounge Nº 149 · "Sticky mobile CTA bar" · designlounge.vercel.app -->

# Sticky mobile CTA bar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A short product page for Sprout, a fictional houseplant starter kit, framed at **390×844** (`mobile-web`). The Lounge draws the phone chrome, so the page leaves **54px** at the top and **34px** at the bottom clear of fixed UI. A sticky bottom bar sits on that 34px inset: expanded it shows a one-line description, the price, and "Add to bag"; after the page scrolls **72px** the description collapses to `max-height: 0` and the bar shortens. Price and button never leave. One family, Sora. Coral `#d4533e` is the only saturated colour; leaf green is reserved for the kicker and icons.

## Reference behaviour

1. Initial state: cool off-white `#f4f5f2`. Top inset 54px, then a 52px sticky nav ("Sprout" + Kit). Hero: 11px uppercase kicker "Houseplant kit · ships Thursday", 32px/600 title "Starter kit for a first windowsill", 15px lede, a 168px CSS seedling illustration, `$48` with "one kit · free post over $40".
2. Sticky CTA bar is `position: fixed; left: 0; right: 0; bottom: 34px` (or `env(safe-area-inset-bottom, 34px)`). Surface white, 1px top hairline, padding 12/20, grid `1fr auto` with the description spanning both columns on row 1. Description: "Starter kit · 12 weeks of seed. Ships Thursday." Price `$48` + "incl. post". Button 48px tall, pill, coral, 14px/600 "Add to bag", min-width 128px.
3. On `scroll`, if `scrollY > 72`, add `.compact` to the bar: padding 10/20, description `max-height: 0; opacity: 0`, hide the "incl. post" small. Price and button stay on one row. If `scrollY ≤ 72`, remove `.compact`. Nav gets `.stuck` (1px bottom border) when `scrollY > 8`.
4. Body padding-bottom is `34px + 92px + 8px` so the last review is not hidden behind the expanded bar.
5. Add to bag writes "Starter kit added · $48" into a toast (`role="status"`) above the bar, shown 2200ms. Toast does not persist.
6. Reduced motion: `scroll-behavior: auto`; bar, description, toast and button transitions become 1ms. Compact still toggles, no lag.
7. Hit targets: nav links 40px-class padding, button 48px, bar remains tappable in compact (button stays 48px).

## Structure

```
390 × 844
┌─────────────────────────────┐
│     (54px lounge status)    │
│ Sprout                 Kit  │  sticky 52, top: 54
│ HOUSEPLANT KIT · SHIPS…     │
│ Starter kit for a first     │  h1 32/600
│ windowsill                  │
│ Soil, a 12-week seed tin…   │
│ ┌─────────────────────────┐ │  mock 168, CSS plant
│ └─────────────────────────┘ │
│ $48   one kit · free post   │
│ IN THE BOX                  │
│  • 2.4 L living soil        │
│  • Seed tin, 12 weeks       │
│  • Watering plan            │
│ FROM A WINDOWSILL IN PORTO  │
│  two review cards           │
│─────────────────────────────│
│ Starter kit · 12 weeks of seed. Ships Thursday. │  desc, hides when compact
│ $48              [Add to bag]│  always visible
│     (34px lounge home)      │  bar bottom: 34
└─────────────────────────────┘
```

- `<header class="nav" id="nav">` sticky, `top: var(--safe-top)`.
- `.hero#top`: kicker, h1, lede, `.mock` (decorative `role="img"`), `.price-hero`.
- `<section id="kit">`: "In the box" + three `<li>` with 20px stroke icons.
- Reviews section: two `.rev` cards.
- `<div class="bar" id="bar">`: `<p class="desc">`, `.amt`, `<button class="add" id="add">`.
- `<div class="toast" id="toast" role="status" aria-live="polite">`.

Viewport meta: `width=device-width, initial-scale=1`. First HTML comment: `platform: mobile-web · 390x844`.

## Tokens

```css
:root {
  --bg: #f4f5f2;               /* page */
  --surface: #fff;             /* bar, reviews */
  --sunk: #e8ebe4;
  --ink: #171c18;
  --ink-2: #5a635c;
  --ink-3: #8b928c;
  --line: #d8ddd4;
  --accent: #d4533e;           /* Add to bag */
  --accent-ink: #fff;
  --leaf: #3f6b48;             /* kicker, icons, logo dot */
  --sans: "Sora", system-ui, sans-serif;
  --safe-top: 54px;
  --safe-bot: 34px;
  --gutter: 20px;
  --r: 12px;
  --r-pill: 999px;
  --bar-h: 108px;              /* expanded, for body padding */
  --t-fast: 160ms;
  --t-bar: 280ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role        | Family | Size | Weight | Line-height | Tracking | Case      |
|-------------|--------|-----:|-------:|------------:|---------:|-----------|
| Title       | Sora   | 32px | 600    | 1.12        | −0.04em  | sentence  |
| Price (hero)| Sora   | 28px | 600    | 1           | −0.03em  |           |
| Price (bar) | Sora   | 20px | 600    | 1           | −0.03em  |           |
| Logo        | Sora   | 16px | 600    | 1           | −0.03em  | Title     |
| Lede        | Sora   | 15px | 400    | 1.5         | 0        | sentence  |
| Feature title | Sora | 14px | 600    | 1           | −0.02em  | sentence  |
| Button      | Sora   | 14px | 600    | 1           | 0        | Title     |
| Bar desc    | Sora   | 12px | 500    | 1.4         | 0        | sentence  |
| Kicker / h2 | Sora   | 11/13px | 500/600 | 1       | +0.12–.14em | UPPERCASE |

One family only. Do not add a serif.

## Motion

| Element      | Trigger     | Property            | From → To              | Duration | Easing   |
|--------------|-------------|---------------------|------------------------|---------:|----------|
| Description  | compact     | max-height, opacity | 36px + 1 → 0 + 0       | 280 / 160ms | `--ease` |
| Bar padding  | compact     | padding             | 12px → 10px            | 280ms    | `--ease` |
| Toast        | add         | opacity, translateY | 0 + 8px → 1 + 0        | 160 / 280ms | `--expo` |
| Button       | hover/active| background, scale   | accent → `#b84634` / 0.98 | 160ms | `--ease` |
| Nav border   | scroll > 8  | border-color        | transparent → line     | 160ms    | —        |

Compact threshold is **72px**, not intersection observer. Use `{ passive: true }` on scroll.

## States

- **Bar expanded:** description visible, price shows "incl. post".
- **Bar compact:** description clipped, "incl. post" `display: none`. Button unchanged.
- **Nav stuck:** 1px `--line` bottom border.
- **Add hover:** `#b84634`. Active: scale 0.98.
- **Toast `.on`:** visible 2200ms.
- **Focus-visible:** 2px accent outline, 3px offset, on nav links and the button.

## Accessibility

- Bar is not `role="toolbar"`; it is a product CTA. The button is the control. Description is a `<p>` and remains in the DOM when compact (hidden visually, still in the accessibility tree — acceptable because the same facts sit in the hero). If the host AT doubles it, add `aria-hidden="true"` on `.desc` while compact.
- Toast uses `role="status"` / `aria-live="polite"`.
- Mock plant is `role="img"` with `aria-label="Illustrated seedling in a pot"`.
- Contrast: coral `#d4533e` with white text is about 4.6:1 at 14px/600. Ink on `--bg` exceeds 12:1. `--ink-2` on `--bg` is about 6:1.
- Hit targets ≥ 40px. Button is 48px. Compact bar still 48px tall in the button column.
- Body `padding-top: 54px` so content never sits under lounge chrome. Bar `bottom: 34px` so it never sits on the home indicator.

## Responsive rules

This piece is specified at 390×844. If shown elsewhere:

- 360 wide: gutters 16, title 28px, button min-width 112px. Compact threshold stays 72px.
- Tablet width: keep the bar full-bleed at the bottom; do not convert it to an inline desktop CTA. Max readable measure 40ch on the hero.

## Acceptance checklist

- [ ] Frame is mobile-web 390×844; header comment says so; viewport includes `initial-scale=1`.
- [ ] 54px top inset and 34px bottom inset are free of fixed chrome. Nav is sticky under the 54px. Bar is fixed at `bottom: 34px`.
- [ ] Expanded bar shows description + `$48` + "Add to bag". After 72px of scroll the description is gone; price and button remain.
- [ ] Compact transition is 280ms on `cubic-bezier(.2,.7,.2,1)` for max-height.
- [ ] Add to bag shows a polite status toast for 2200ms with the $48 amount.
- [ ] Only Sora loads. Accent is coral `#d4533e`, not leaf-green filled buttons (leaf is kicker/icons only).
- [ ] Feature list has three items with 20px stroke SVG icons.
- [ ] Focus rings are 2px `#d4533e` with a 3px offset.
- [ ] Reduced motion: compact still happens, transitions 1ms, no smooth scroll.
- [ ] Last review is not hidden behind the expanded bar (body padding-bottom includes `--bar-h`).

## Implementation notes

**Keep the bar off the home indicator** with a token, not magic numbers in four places:

```css
:root { --safe-top: 54px; --safe-bot: 34px; --bar-h: 92px; }
body {
  padding-top: var(--safe-top);
  padding-bottom: calc(var(--safe-bot) + var(--bar-h) + 8px);
}
.nav { position: sticky; top: var(--safe-top); }
.bar { position: fixed; left: 0; right: 0; bottom: var(--safe-bot); }
```

**Collapse with max-height, not `display: none`**, so it can animate:

```css
.bar .desc {
  grid-column: 1 / -1;
  max-height: 20px;
  opacity: 1;
  overflow: hidden;
  transition: max-height 280ms var(--ease), opacity 160ms var(--ease);
}
.bar.compact .desc { max-height: 0; opacity: 0; }
```

**Threshold on scrollY**, passive listener:

```js
addEventListener('scroll', () => {
  bar.classList.toggle('compact', scrollY > 72);
  nav.classList.toggle('stuck', scrollY > 8);
}, { passive: true });
```

Common mistakes: `bottom: 0` so the bar sits on the lounge home indicator. Using `position: sticky` on the bar (it will not pin above the 34px inset). Two font families. A green primary button that collides with the existing Loam savings piece.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
