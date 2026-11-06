---
title: "Restaurant menu with a growing basket"
summary: "A food delivery restaurant page: a CSS plate hero, a sticky tab strip that tracks scroll, add buttons that turn into steppers, a customise sheet and a basket bar."
platform: mobile-app
type: screen
category: ecommerce
tags: [food-delivery, menu, basket, stepper, press, scroll]
styles: [material, organic]
motion: subtle
difficulty: 2
featured: false
published: 2026-11-06
palette: ["#F6EEE2", "#2A1D15", "#B3361D", "#B65A36", "#FFFAF2"]
fonts: ["DM Serif Display", "Work Sans"]
related: []
---

# Restaurant menu with a growing basket

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The restaurant page of a food delivery app for Mesa Brasa, a fictional wood-fired grill in Lisbon. A terracotta tablecloth hero carries a plate drawn entirely in CSS (piri-piri chicken, charred lemon, rice, chilli oil, herbs); a cream info card overlaps it with the name in DM Serif Display and three facts: delivery time, fee and rating. The language is Material 3 Expressive: tonal pills, 28px card radii, a 64px pill basket bar. The detail worth copying is the add flow: a 40px ember add button grows into a dark stepper, a small ember dot arcs from the button to the basket count, the count bumps, and the bar's thin meter fills towards free delivery.

## Reference behaviour

1. Initial state: hero 286px with the plate partly off the right edge; info card (kicker "Wood-fired grill · Portuguese", "Mesa Brasa", "Rua da Boavista 84, Lisbon · 1.2 km", facts "25–35 min / Delivery time", "€1.49 / Free over €20", "4.7 / 5 / 2,140 ratings"). The tab strip shows Popular (active), From the grill, Small plates, Sides, Desserts, Drinks. The Prego roll is already in the basket at 1, so its control is a stepper and the basket bar reads "1 · Go to checkout · €10.50 to free delivery · €9.50" with the meter at 47.5%.
2. Scroll the page: the tab strip sticks at 54px. A 54px cover band behind the status bar fades in after 160px of scroll. The active tab follows the last section whose top has passed 220px from the viewport top; at the bottom of the page Drinks is forced active. The strip scrolls horizontally so the active tab sits 16px from the left edge.
3. Tap a tab: the page scrolls smoothly to that section (scroll-margin-top 118px so the heading clears the strip).
4. Tap **+** on a plain dish: the button is replaced by a stepper (− count +) that unclips from the right in 280ms. An ember dot 14px flies from the button to the basket count in 520ms on a curved path (rises 90px at 45%); on landing the count bumps to 1.28× and the total, sub-line and meter update.
5. Stepper **+** adds one more (same flight); **−** removes one; at 0 the stepper returns to the add button. At 0 items in total the bar slides down 120% and hides.
6. Tap **+** on Piri-piri chicken (marked "Customise"): a sheet rises (420ms iOS-sheet curve) over a 48% scrim. Size is required (Half €12.90, Whole +€8.60); four extras are optional (Extra piri-piri oil +€0.60, Charred lemon and herbs +€0.80 pre-ticked, Garlic butter rice +€3.20, Pickled red onion +€0.90). A quantity pill and the primary "Add 1 · €13.70" button sit at the bottom; the price follows every change.
7. Tap the primary: the sheet closes, the chicken's control becomes a stepper and the dot flies to the basket with the configured price.
8. Over €20 the bar's sub-line reads "Free delivery applied" and the meter is full.
9. Tap the bar: its label reads "Opening checkout" for 1.4s, then returns.
10. The heart button toggles a saved state (filled ember).

## Structure

```
390 × 844, page scrolls, fixed bar at bottom 34
┌──────────────────────────────────────┐
│ (<)  54 safe area             (♡)    │  44px round buttons at top 58
│ terracotta cloth, 48px grid  ╭─────╮ │  hero 286
│                             (plate )│  plate 300, right −34, top 40
│ ╭──────────────────────────────────╮ │  info card, margin −40 16 0, r28
│ │ WOOD-FIRED GRILL · PORTUGUESE    │ │
│ │ Mesa Brasa                 36px  │ │
│ │ Rua da Boavista 84 · 1.2 km      │ │
│ │ 25–35 min │ €1.49     │ 4.7 / 5  │ │  3 equal facts, hairline dividers
│ ╰──────────────────────────────────╯ │
│ [Popular] (From the grill) (Small…)  │  sticky top 54, 40px pills, scroll-x
│ Popular                       26px   │
│ Piri-piri chicken        ┌───────┐   │  dish grid 1fr 104
│ desc 13px, 2 lines       │ thumb │   │
│ €12.90 CUSTOMISE         └────(+)┘   │  add 40, offset −6
│ Prego roll ...           └─(− 1 +)   │  stepper 100×40
│ ...                                  │
│ ( 1 ) Go to checkout         €9.50   │  bar 64, r999, bottom 34, 16 sides
│       €10.50 to free delivery        │  meter 3px at bottom of bar
└──────────────────────────────────────┘
```

- `<header class="hero">` holds two `<button class="round">` (Back, Save with `aria-pressed`) and an `aria-hidden` plate built from `<i>` layers.
- `.info` is a plain block: kicker, `<h1>`, address `<p>`, `.facts` grid.
- `<nav class="tabs" aria-label="Menu sections">` with one `<button class="tab" aria-current>` per section.
- `<main>`: one `<section aria-labelledby>` per category, each with `<h2>` and `<article class="dish">` rows: name `<h3>`, description, price, then a thumb with a `.ctl` slot that holds either the add button or the stepper.
- `<button class="bar">` is fixed; its `aria-label` carries count and total.
- `<div role="dialog" aria-modal="true">` for the sheet, with `<fieldset>`/`<legend>` groups and native radio and checkbox inputs.
- One visually hidden `aria-live="polite"` region.

## Tokens

```css
:root {
  --bg: #F6EEE2;          /* page ground, warm cream */
  --surface: #FFFAF2;     /* info card, sheet, round buttons */
  --tonal: #EFE3D2;       /* idle tabs, thumbs, quantity pill */
  --ink: #2A1D15;         /* text, active tab, stepper, basket bar */
  --ink-2: #6A594C;       /* secondary text, 5.8:1 on --bg */
  --rule: #E2D4C1;        /* hairlines */
  --line: #8C7867;        /* input borders, grab handle (4.0:1 on the sheet) */
  --ember: #B3361D;       /* the one accent: add, count, primary */
  --ember-ink: #FFF6EC;   /* text on ember, 5.7:1 */
  --cloth: #B65A36;       /* hero tablecloth */
  --cloth-2: #A44E2D;     /* tablecloth shade */
  --meter: #F0A37F;       /* free-delivery meter fill on ink */
  --meter-track: #5A4639;
  --bar-sub: #E6D7C6;     /* sub-line on the bar, 11:1 */
  --scrim: rgba(30, 18, 10, .48);

  --serif: "DM Serif Display", Georgia, serif;
  --sans: "Work Sans", system-ui, sans-serif;
  --fs-name: 36px; --fs-sheet-title: 28px; --fs-section: 26px;
  --fs-total: 17px; --fs-dish: 16px; --fs-body: 15px; --fs-tab: 14px;
  --fs-desc: 13px; --fs-kicker: 12px; --fs-tag: 11px;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px;
  --r-card: 28px; --r-thumb: 22px; --r-sheet: 32px; --r-pill: 999px;
  --shadow-plate: 0 26px 40px rgba(60, 20, 8, .42);
  --shadow-bar: 0 12px 28px rgba(42, 29, 21, .32);
  --ring-cutout: 0 0 0 4px var(--bg);   /* add button and stepper punch out of the thumb */

  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --sheet: cubic-bezier(0.32, 0.72, 0, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-micro: 160ms; --t-tab: 200ms; --t-grow: 280ms; --t-bump: 360ms;
  --t-bar: 360ms; --t-sheet: 420ms; --t-fly: 520ms; --t-meter: 400ms;
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Case |
|---|---|---|---|---|---|
| Restaurant name | DM Serif Display | 36px / 1.02 | 400 | −0.01em | title |
| Sheet title | DM Serif Display | 28px / 1.1 | 400 | 0 | title |
| Section heading | DM Serif Display | 26px / 1.1 | 400 | 0 | title |
| Fact value | Work Sans | 16px, tabular | 600 | 0 | — |
| Dish name, bar label | Work Sans | 16px / 1.25 | 600 | 0 | sentence |
| Price, option rows | Work Sans | 15px, tabular | 600 / 400 | 0 | — |
| Tab | Work Sans | 14px | 500 | 0 | sentence |
| Description, address | Work Sans | 13–14px / 1.4 | 400 | 0 | sentence |
| Kicker | Work Sans | 12px | 600 | 0.08em | upper |
| Tag "Customise" | Work Sans | 11px | 600 | 0.06em | upper, ember |

## Motion

| What | Trigger | Property | From → to | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Add → stepper | first add | `clip-path` | `inset(0 0 0 calc(100% − 40px))` → `inset(0)` | 280ms | `--expo` | appears |
| Flying dot | any add | `transform` (WAAPI) | button centre → arc (35% x, 50% y − 90px, 1.15×) → count, .6× | 520ms | `--std` | no dot, totals update at once |
| Count bump | dot lands | `scale` | 1 → 1.28 at 30% → 1 | 360ms | `--expo` | none |
| Meter | total changes | `scaleX` | old → total / €20, capped at 1 | 400ms | `--expo` | instant |
| Bar hide / show | 0 ↔ ≥1 items | `transform`, `opacity` | translateY(120%), 0 ↔ 0, 1 | 360ms in / 300ms out | `--expo` / `--std` | instant |
| Sheet | open / close | `transform` | translateY(104%) ↔ 0 | 420ms | `--sheet` | instant |
| Scrim | open / close | `opacity` | 0 ↔ 1 | 280ms | `--std` | instant |
| Tab active | scroll spy | `background`, `color` | tonal ↔ ink | 200ms | `--std` | instant |
| Cover band | scrollY > 160 | `opacity` | 0 → 1 | 200ms | `--std` | instant |
| Press | `:active` | `scale` | 1 → .98 | 120ms | `--std` | same |

## States

- **Dish not in basket**: 40px ember round add button with a 4px cream cut-out ring over the thumb's corner.
- **Dish in basket**: 100×40 ink stepper with − / count / +, same cut-out ring; count is tabular.
- **Customisable dish**: ember "Customise" tag after the price; first add opens the sheet; once in the basket its stepper adds the configured line directly.
- **Basket empty**: bar hidden (`visibility:hidden` after the slide).
- **Under free delivery**: sub-line "€X.XX to free delivery", meter partial. **Over**: "Free delivery applied", meter full.
- **Tab active**: ink fill, cream text, `aria-current="true"`.
- **Sheet open**: scrim, body class `open`; closed sheet is `visibility:hidden` and translated 104%.
- **Radio checked**: ember disc with a 4px cream centre. **Checkbox checked**: ember square with a cream tick.
- **Saved**: heart filled and stroked ember, `aria-pressed="true"`.
- **Focus-visible**: 2px ink outline at 3px offset; ember and circular on add and stepper buttons.

## Accessibility

- Add buttons are labelled "Add Sea bream, whole, €17.80"; stepper buttons "Add one more …" / "Remove one …"; the count `<output>` reads "1 in basket".
- After every change focus moves to the same action in the new control, so keyboard users can press + repeatedly.
- The live region announces "Sea bream, whole: 2 in basket".
- The bar is a real button whose label includes count and total: "Go to checkout, 3 items, €32.70".
- The sheet is a `role="dialog"` with `aria-modal`, labelled by its title; focus moves to Close on open and back to the opener on close; Escape and the scrim close it.
- Size and extras are native radios and checkboxes in `<fieldset>`s with legends ("Size · Required · pick 1").
- Contrast: ink-2 on cream 5.8:1; cream on ember 5.7:1; bar sub-line on ink 11:1; input borders `#8C7867` on the sheet 4.0:1 (non-text 3:1).
- Hit targets: round buttons 44px, tabs 40px tall, add and stepper buttons 40px, option rows 52px, quantity and primary 56px.

## Responsive rules

- At 360 wide: the info card keeps three facts; fact values stay `nowrap` at 15px; the dish grid keeps the 104px thumb and lets the text column shrink.
- Taller phones: nothing grows but the menu; the hero stays 286px.
- Tablet: the column caps at 430px and centres; the fixed bar, cover band and sheet use the same 430px cap and centre with `left:50%` and `translateX(-50%)`.
- The tab strip is the only horizontal scroller; `documentElement.scrollWidth` stays 390.

## Acceptance checklist

**Always**
- [ ] Hero imagery is CSS only: a plate with rim and well, a main item, garnish; nothing raster.
- [ ] Tab strip is sticky below the 54px safe area and follows scroll; tapping a tab scrolls to its section with the heading visible.
- [ ] Add becomes a stepper in place; − at 1 turns it back into add.
- [ ] Each add sends one dot to the basket count and the count bumps when it lands, not before.
- [ ] Basket bar shows count, label, sub-line and total; it hides at 0 items.
- [ ] Customisable items open a sheet with a required group and an optional group; the primary shows quantity and exact price.
- [ ] Closed sheet and scrim are `visibility:hidden`.
- [ ] Focus returns to the right control after every add, remove and sheet close.
- [ ] Reduced motion: no flying dot, no clip growth, no bump; totals still update.
- [ ] Only one accent colour on the page.

**This demo**
- [ ] Mesa Brasa, Rua da Boavista 84, 25–35 min, €1.49, free over €20, 4.7 / 5 from 2,140 ratings.
- [ ] Six sections, two dishes each; Prego roll €9.50 starts in the basket.
- [ ] Piri-piri chicken sheet: Half €12.90, Whole +€8.60; extras €0.60, €0.80 (ticked), €3.20, €0.90; primary starts at "Add 1 · €13.70".
- [ ] Bar starts at "€10.50 to free delivery" and €9.50.

## Implementation notes

1. **The dot's arc in three keyframes.** Measure the button before you swap it for the stepper (the node is gone afterwards), then let WAAPI carry a fixed-position dot; the middle keyframe lifts it above the straight line so it reads as thrown.

```js
function fly(rect, onLand) {
  const b = countEl.getBoundingClientRect();
  const d = Object.assign(document.createElement('i'), { className: 'dot' });
  const x0 = rect.left + rect.width / 2 - 7, y0 = rect.top + rect.height / 2 - 7;
  const dx = b.left + 13 - x0, dy = b.top + 13 - y0;
  Object.assign(d.style, { left: x0 + 'px', top: y0 + 'px' }); document.body.append(d);
  d.animate([{ transform: 'none' },
    { transform: `translate(${dx * .35}px, ${dy * .5 - 90}px) scale(1.15)`, offset: .45 },
    { transform: `translate(${dx}px, ${dy}px) scale(.6)` }],
    { duration: 520, easing: 'cubic-bezier(0.2,0.7,0.2,1)' }).onfinish = () => { d.remove(); onLand(); };
}
```

2. **Stepper that grows out of the button.** Anchor both at the same right/bottom corner and unclip the stepper from a 40px circle on its right edge; no width animation, so the text never reflows.

```css
.add, .step { position: absolute; right: -6px; bottom: -6px; height: 40px; border-radius: 999px; box-shadow: 0 0 0 4px var(--bg); }
.step { animation: grow 280ms cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes grow { from { clip-path: inset(0 0 0 calc(100% - 40px) round 20px) } to { clip-path: inset(0 round 20px) } }
```

3. **Scroll spy without IntersectionObserver jitter.** One rAF-throttled scroll handler: the active section is the last one whose top is above 220px, and the page bottom forces the last tab (short final sections never reach the line otherwise).

```js
let i = 0; secs.forEach((s, n) => { if (s.getBoundingClientRect().top < 220) i = n; });
if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) i = secs.length - 1;
tabs.forEach((t, n) => t.setAttribute('aria-current', n === i));
strip.scrollLeft = tabs[i].offsetLeft - 16;
```

Common mistakes: a sheet that is only translated off-screen (its text still counts and still takes focus), stripes painted across the whole thumbnail instead of on the food, and a bar that covers the last dish (give the page 150px of bottom padding).
