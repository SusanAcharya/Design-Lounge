<!-- Design Lounge Nº 161 · "Wellness retreat booking landing" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Wellness retreat booking landing

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The booking landing for a fictional twelve-guest house, Loam House, on a fold of land above the River Usk. The first frame is sand-coloured paper, a 76px Young Serif headline, a pill-shaped date strip (arrive / depart / guests / Check dates), and three stay cards with short botanical SVGs. Colour is earth: sand, soil, moss, one terracotta kicker. The date strip is the interaction — plus/minus steppers, not a calendar overlay — and checking dates writes a live sentence under the pill.

## Reference behaviour

1. Initial state: Arrive `12 Oct`, Depart `15 Oct`, Guests `2`. The Loft card is `aria-pressed="true"`. The live region under the strip is empty. "Check dates" is enabled.
2. Click + / − on Arrive: day moves between 8 and 28 October. Depart + / − moves a day number from 9 Oct through 4 Nov (internal 9–35; values > 31 display as November). Guests move 1–4.
3. If Depart is on or before Arrive, "Check dates" is `disabled` (opacity 0.55).
4. Submit the strip (click "Check dates"): prevent default. If valid, the live region reads `{n} nights · The Loft and Field Room are held for those dates.` If disabled, do not submit. Changing any stepper clears the note.
5. Click a stay card: that card is pressed; the others are not. Pressed and hover: 1px moss border and a −3px lift over 280ms. Pressed also gets an inset 1px moss ring.
6. Nav "Book" is a 40px moss pill; hover turns it soil. Stays / Baths / Table are text links to `#stays`.
7. Reduced motion: transitions 1ms; cards do not lift.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ (leaf) Loam House     Stays  Baths  Table                  [ Book ]    │ 58
├────────────────────────────────────────────────────────────────────────┤
│ FOLD OF LAND · 11 ROOMS · RIVER USK   (12px, terracotta)               │
│ Come back to the ground.              (76px Young Serif, 16ch)         │
│ Three nights in earth plaster and linen…                               │
│ ┌───────────┬───────────┬────────┬────────────┐                        │
│ │ Arrive    │ Depart    │ Guests │ Check dates│  pill, 840 max, 64 tall│
│ │ 12 Oct −+ │ 15 Oct −+ │  2  −+ │            │                        │
│ └───────────┴───────────┴────────┴────────────┘                        │
│ (live note)                                                            │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐                           │
│ │  SVG leaf  │ │  SVG bulb  │ │  SVG steam │                           │
│ │ The Loft   │ │ Field Room │ │ Bath House │  280 min, 18 radius       │
│ │ 186 /night │ │ 214        │ │ 248        │  cards 232 min            │
│ └────────────┘ └────────────┘ └────────────┘                           │
└────────────────────────────────────────────────────────────────────────┘
```

- `<nav aria-label="Primary">` — 58px, 52px side pad. Logo is Young Serif 22px + 18px moss disc with a sand leaf. Three links. Book pill `margin-left: auto`.
- `<section class="hero">` — kicker, h1, lede, `<form class="strip" aria-label="Booking dates">`, `#note` live region.
- Strip: 4 columns `1fr 1fr 140px 180px`, 10px gap, clay fill, 999px radius, 10px padding. Each `.field` is a sand inner pill, min-height 64px.
- `<section class="stays" aria-label="Stays">` — 3 columns, 16px gap. Each card is a `<button>`.

## Tokens

```css
:root {
  --sand: #f1eadc;        /* page + inner fields */
  --clay: #e4d4bc;        /* strip well */
  --soil: #3a2e24;        /* type, primary button */
  --soil-2: #6a5a48;      /* lede / meta */
  --moss: #3f5340;        /* logo, Book, SVG stroke, focus */
  --leaf: #6d8a62;        /* reserved lighter moss */
  --terra: #b86a42;       /* kicker, Check-dates hover */
  --line: #d7c9b0;        /* card border, stepper ring */

  --serif: "Young Serif", Georgia, serif;
  --sans: "Hanken Grotesk", system-ui, sans-serif;

  --pad: 52px;
  --nav: 58px;
  --r: 18px;
  --strip-max: 840px;

  --t: 180ms;
  --t-card: 280ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Headline | Young Serif | 76px | 400 | 0.96 | −0.025em | sentence |
| Logo / card title | Young Serif | 22–28px | 400 | 1–1.1 | 0 | title |
| Price | Young Serif | 22px | 400 | 1 | 0 | numerals |
| Body / lede | Hanken Grotesk | 15–17px | 400 | 1.5 | 0 | sentence |
| Kicker / field label | Hanken Grotesk | 11–12px | 600 | 1 | +0.10–0.14em | UPPERCASE |
| Nav / Book | Hanken Grotesk | 14px | 400–500 | 1 | 0 | sentence |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---------|---------|----------|-----------|---------:|--------|-------|
| `.card` | hover / pressed | translateY, border | 0 → −3px | 280ms | `--expo` | |
| `.book` | hover | background | moss → soil | 180ms | `--ease` | |
| `.go` | hover | background | soil → terra | 180ms | `--ease` | |
| `.step` | hover | background, color | sand → moss | 0 | — | instant is fine |

Reduced motion: durations 1ms; `transform: none` on cards; `scroll-behavior: auto`.

## States

- **Stepper default:** 28px circle, 1px `--line`. Hover: moss fill, sand glyph.
- **Check dates default:** soil fill, sand type, 180px column. Disabled: opacity 0.55, `cursor: default`.
- **Card default:** `#F7F2E8` fill, 1px `--line`, 18px radius.
- **Card hover / pressed:** moss border; pressed adds `inset 0 0 0 1px var(--moss)`.
- **Book pill hover:** soil fill.
- **Focus-visible:** 2px moss, 3px offset.

## Accessibility

- The strip is a `<form aria-label="Booking dates">`. Steppers are `<button type="button">` with explicit `aria-label`s ("Later arrival", "Fewer guests", …).
- Submit is `<button type="submit">`. `#note` is `aria-live="polite"`.
- Stay cards are buttons with `aria-pressed`. Botanical SVGs are `aria-hidden`.
- Contrast: soil on sand > 10:1; soil-2 on sand ≈ 5.3:1; sand on moss > 8:1; terracotta on sand ≈ 4.6:1 (kicker 12px / 600 only).
- Hit targets: steppers 28px visual — pair them; Book 40× auto; cards ≥ 280px tall; Check dates fills the 64px-plus well.

## Responsive rules

- ≥ 1280: as specified. Headline 76px. Strip one row, max 840px.
- 1024–1279: headline 60px. Strip becomes 2×2 (`1fr 1fr`), radius 24px. Check dates min-height 52px.
- 768–1023: stays 1 column. Strip 1 column.
- < 768: hide the three text nav links; keep logo and Book. Headline 48px. Side pad 20px.

## Acceptance checklist

- [ ] Headline is 76px Young Serif, max 16ch, "Come back to the ground."
- [ ] Date strip is a 999px-radius clay pill, max-width 840px, four cells.
- [ ] Arrive starts at 12 Oct, Depart 15 Oct, Guests 2.
- [ ] Steppers clamp: arrive 8–28, depart 9 Oct–4 Nov, guests 1–4.
- [ ] Check dates is disabled when depart ≤ arrive.
- [ ] Successful check writes a night count into an `aria-live` note.
- [ ] Three cards (min-height 232px), each with a botanical SVG (leaf, bulb, steam), prices 186 / 214 / 248.
- [ ] The Loft is pressed on load; clicking another card moves `aria-pressed`.
- [ ] Palette is sand / soil / moss / terracotta — no purple, no cool gray.
- [ ] Focus rings are 2px moss on nav, steppers, submit, and cards.
- [ ] `prefers-reduced-motion: reduce` removes the card lift.
- [ ] No photographs, no emoji, no placeholder copy.

## Implementation notes

**Store depart as an integer that can cross the month**, then format:

```js
let a = 12, d = 15, g = 2;
function fmt(n) { return n <= 31 ? n + ' Oct' : (n - 31) + ' Nov'; }
function draw() {
  arr.textContent = fmt(a); dep.textContent = fmt(d); gu.textContent = g;
  go.disabled = d <= a;
}
```

**Keep the calendar out of this piece.** A full date picker is a different pattern. The strip is four controls in a pill.

**Botanical SVGs stay on a 120×80 viewBox**, 1.5px moss stroke, one `.hl` path in terracotta. Do not fill leaves with green blocks.

```css
.bot svg { width: 120px; height: 80px; stroke: var(--moss); fill: none; stroke-width: 1.5; }
.bot .hl { stroke: var(--terra); }
```

The three drawings, in order:

1. Loft — a vertical stem, a two-lobe leaf (`.hl`), two ground-cover arcs, a horizon line.
2. Field Room — an ellipse pot, a U-shaped body, a terracotta inner blade, a crossbar.
3. Bath House — two facing fronds, a terracotta steam arc, two 3px buds.

Prices are unitless numerals in Young Serif (186 / 214 / 248). Put the currency out of the headline; the meta line reads `a night · 28 m²`. Do not add a fourth card to fill the row.

Common mistakes: a stock photograph of a spa; a purple wellness gradient; using Fraunces instead of Young Serif; a modal date picker; four stay cards (the frame is three).

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
