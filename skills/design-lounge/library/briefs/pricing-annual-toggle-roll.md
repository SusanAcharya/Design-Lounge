<!-- Design Lounge Nº 092 · "Annual toggle with rolling prices" · designlounge.vercel.app -->

# Annual toggle with rolling prices

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The pricing section of Loomwork, a booking tool for small health practices. A 360px intro column on the left holds the headline and a Monthly / Annual segmented switch; on the right, three plans are stacked as wide horizontal rows instead of the usual three cards. Switching billing makes every price **roll digit by digit** like a mechanical odometer, each digit on its own clock, rows cascading top to bottom, and a tilted "2 months free" badge springs in beside the switch. The feeling is calm and soft (cool mist surfaces, 28px radii, one apricot accent), and the one detail worth copying is that the change you pay for is *animated as a change*: the viewer watches 49 become 39.

## Reference behaviour

1. On load the page renders in **monthly** (Solo $19, Studio $49, Clinic $129) with no animation, then 450ms later switches itself to **annual** so the first visible frame is the hero state: $15, $39, $103, badge visible, savings chips visible.
2. The Annual segment is filled with an ink thumb (white text); Monthly is plain `--ink-2` text.
3. Click **Monthly**: the 4px-inset ink thumb slides left over 320ms (expo out); the "2 months free" badge shrinks, rotates to −10° and fades out; each price digit rolls to its monthly value; the "billed yearly" line fades down 6px and "billed monthly" fades up into its place; the accent "save $…" chips scale to 0.8 and fade.
4. Click **Annual**: the reverse. The badge springs in 180ms after the click with a slight overshoot and settles at −4°. Savings chips pop in 500ms after the click, cascading 90ms per row.
5. Digits roll independently: digit *i* in row *r* starts after `i × 70ms + r × 90ms` and takes 900ms. Unchanged digits (the 9 in 49 → 39, the 1 in 129 → 103) stay still because their target equals their current position.
6. Clicking the already-selected segment does nothing visible.
7. A visually hidden `aria-live="polite"` paragraph announces the new prices: "Annual billing, 2 months free: Solo $15, Studio $39, Clinic $103 per month."
8. Hovering a plan row lifts its surface from `--surface` to white. Studio is permanently selected-looking: white, 1.5px ink inset ring, soft drop shadow and a "MOST BOOKED" ink pill straddling its top edge.
9. Buttons scale to 0.97 while pressed.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────────────────────┐
│ nav 68 · logo · Product For-clinics [Pricing] Changelog ······ Sign in [Start] │
├──────────────────────────┬────────────────────────────────────────────────────┤
│ — PRICING · PER PRACT.   │ ┌──────────────────────────────────────────────┐   │
│                          │ │ Solo         $ 15  per month       [Start]   │   │
│ Book more.               │ │ desc         ^96px  $180 billed…    small    │   │
│ Chase less.   58px       │ └──────────────────────────────────────────────┘   │
│ lede 16px                │ ┌─[MOST BOOKED]────────────────────────────────┐   │
│                          │ │ Studio       $ 39  per seat / month [Start▸] │   │
│ [Monthly|Annual] ⟋2 mo⟋  │ └──────────────────────────────────────────────┘   │
│ ✓ perks ×3               │ ┌──────────────────────────────────────────────┐   │
│                          │ │ Clinic       $103  per site / month [Talk]   │   │
│ fine print (mono 12)     │ └──────────────────────────────────────────────┘   │
└──────────────────────────┴────────────────────────────────────────────────────┘
 padding 20 48 40 · columns 360px | 48px gap | 1fr · rows: 3 × 1fr, 14px gap
 row grid: 186px | 1fr | 140px, gap 24px, padding 0 28px 0 32px
```

- `<nav aria-label="Main">`: logo (26px rounded square, ink with an apricot wave), a `<ul>` of pill links (current one white with `aria-current="page"`), right-aligned Sign in (ghost) and Start free (ink).
- `<main>`: CSS grid, two columns.
  - `<section class="intro" aria-labelledby>`: eyebrow, `<h1>`, lede, `.bill` (segmented `role="group"` + `.save` badge), `<ul class="perks">`, `.fine` pushed to the bottom with `margin-top:auto`.
  - `<section class="plans" aria-label="Plans">`: three `<article class="row">`, each with `--r` (row index 0–2). Columns: copy (`h2.name`, `.desc`, mono `.seats`), `.price` (`$` + `.odo` + `.per` meta), `.cta` (button + mono caption).
- `.odo` is built by JS: one `.col` (1em tall, overflow hidden) per digit containing a `.strip` of ten stacked digits 0–9.

## Tokens

```css
:root {
  /* colour, cool mist neutrals + one apricot accent */
  --bg: #edeff2;           /* page */
  --surface: #f8f9fb;      /* plan rows */
  --surface-hi: #ffffff;   /* hovered / featured row, switch track */
  --line: #dde1e7;         /* row inset ring */
  --line-2: #cfd4dc;       /* ghost button border */
  --ink: #161b26;          /* text, switch thumb, featured ring */
  --ink-2: #4d5566;        /* secondary text */
  --ink-3: #6b7384;        /* mono meta */
  --accent: #e2643a;       /* savings badge, primary CTA, perk ticks */
  --accent-ink: #ffffff;
  --accent-soft: #fbe3d7;  /* savings chip fill */
  --accent-deep: #a8411f;  /* chip text, CTA hover */

  /* type */
  --sans: "Figtree", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --fs-price: 96px;
  --fs-h1: 58px;
  --fs-name: 22px;
  --fs-body: 15px;
  --fs-meta: 12px;

  /* shape */
  --r-row: 28px;
  --r-pill: 999px;
  --shadow-hi: 0 1px 0 rgba(22,27,38,.04), 0 18px 40px -18px rgba(22,27,38,.22);

  /* spacing */
  --page-x: 48px;
  --col-intro: 360px;
  --row-gap: 14px;

  /* motion */
  --t-micro: 160ms;
  --t-thumb: 320ms;
  --t-roll: 900ms;
  --stagger-digit: 70ms;
  --stagger-row: 90ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --spring: cubic-bezier(.34, 1.56, .64, 1);
}
```

## Typography

| Role            | Family     | Size | Weight | Line-height | Tracking | Case      |
|-----------------|------------|-----:|-------:|------------:|---------:|-----------|
| Price numerals  | Figtree    | 96px | 600    | 1           | −0.05em  | tabular   |
| Currency `$`    | Figtree    | 34px | 500    | 1           | 0        | —         |
| Headline        | Figtree    | 58px | 600 (`em` 300, `--ink-2`) | 1.02 | −0.045em | sentence |
| Plan name       | Figtree    | 22px | 600    | 1.2         | −0.02em  | sentence  |
| Lede            | Figtree    | 16px | 400    | 1.55        | 0        | 34ch max  |
| Body / desc     | Figtree    | 14px | 400    | 1.45        | 0        | sentence  |
| Segment / CTA   | Figtree    | 14px | 600    | 1           | 0        | sentence  |
| Eyebrow         | Geist Mono | 12px | 500    | 1           | +0.08em  | UPPERCASE |
| Meta / billed   | Geist Mono | 12px | 400    | 18px        | 0        | lowercase |
| Tag pill        | Geist Mono | 11px | 500    | 22px        | +0.06em  | UPPERCASE |

The headline's second line sets "Chase" at weight 300 in `--ink-2` and "less." at 600 in ink: the weight contrast is the only decoration.

## Motion

| Element            | Trigger        | Property             | From → To                                   | Duration | Easing     | Delay |
|--------------------|----------------|----------------------|---------------------------------------------|---------:|------------|-------|
| `.thumb`           | segment click  | transform            | translateX(0) ↔ translateX(100%)            | 320ms    | `--expo`   | 0 |
| segment label      | segment click  | color                | `--ink-2` ↔ `#fff`                          | 320ms    | `--ease`   | 0 |
| `.strip` (digit)   | billing change | transform            | translateY(−old em) → translateY(−new em)   | 900ms    | `--expo`   | `i×70 + r×90` ms |
| `.save` badge in   | → annual       | opacity, transform   | 0, translate(−10px,6px) scale(.7) rotate(−10°) → 1, none, rotate(−4°) | 200ms / 480ms | `--ease` / `--spring` | 180ms |
| `.save` badge out  | → monthly      | same, reversed       |                                             | 200ms / 480ms | same | 0 |
| `.billed` lines    | billing change | opacity, translateY  | 0, 6px ↔ 1, 0                               | 240ms / 320ms | `--ease` / `--expo` | 0 |
| `.chip`            | → annual       | opacity, scale       | 0, .8 → 1, 1 (origin left)                  | 200ms / 420ms | `--ease` / `--spring` | `500 + r×90` ms |
| `.btn`             | :active        | scale                | 1 → .97                                     | 160ms    | `--ease`   | 0 |

The digit mask (`mask-image: linear-gradient(transparent, #000 12%, #000 88%, transparent)`) softens the top and bottom of each column so rolling digits blur in and out instead of being cut.

Reduced motion: all transition durations 1ms and delays 0. Prices, badge and chips change instantly but completely.

## States

- **Segment selected:** `aria-pressed="true"`, white label over the ink thumb.
- **Segment hover:** none; the thumb is the affordance. Cursor pointer.
- **Focus-visible (everything):** 2px `--accent` outline, 3px offset.
- **Row hover:** background `--surface` → `#fff` over 160ms.
- **Featured row (Studio):** white, `inset 0 0 0 1.5px var(--ink)` plus `--shadow-hi`, "MOST BOOKED" pill at `top:-11px; left:32px`.
- **Buttons:** ghost (transparent, `--line-2` border → white with `--ink-3` border on hover), ink (`#161b26` → `#2a3142`), hot (`--accent` → `--accent-deep`).
- **Monthly state:** badge and chips hidden (opacity 0, still in the DOM), billed line reads "billed monthly".
- **Annual state:** "$180 billed yearly", "$468 / seat yearly", "$1,236 / site yearly"; chips read "save $48 / yr", "save $120 / seat", "save $312 / site".

## Accessibility

- The switch is two real `<button>`s with `aria-pressed` inside `role="group" aria-label="Billing period"`. Tab reaches each; Enter / Space selects.
- `.odo` is `aria-hidden="true"` (ten digits per column would read as noise). The price is announced through the `aria-live="polite"` paragraph after every change.
- The badge is decorative (`aria-hidden`) because its message is in the live announcement.
- Contrast: `--ink-2` on `--surface` 7.4:1; `--ink-3` on `--bg` 4.6:1 (used only for 12px mono meta); `--accent-deep` on `--accent-soft` 5.2:1; white on `--accent` 3.3:1, so the badge text is 13px/600 and the CTA 14px/600 (large-ish, bold). If your audit requires 4.5:1, darken the accent fill to `#c9532c`.
- Hit targets: segments 44px tall, buttons 40px.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: intro column shrinks to 320px; headline 48px; price 84px.
- 768–1023 (`max-width:1100px` in the demo): single column, the intro stacks above the rows and the page scrolls; each row becomes a two-column grid (copy | price) with the CTA spanning below.
- < 640: rows become cards: copy, then price (72px), then a full-width CTA. The badge drops under the switch and keeps its −4° tilt.

## Acceptance checklist

- [ ] First visible frame is the annual state ($15 / $39 / $103) with the badge and chips shown.
- [ ] Each digit is its own 1em-tall column with a 0–9 strip; changing price moves the strip by `translateY(-n em)`.
- [ ] Digits in a row start 70ms apart; rows start 90ms apart; each roll lasts 900ms with `cubic-bezier(.16,1,.3,1)`.
- [ ] Digits that don't change don't move.
- [ ] Prices use tabular numerals so widths don't jitter mid-roll.
- [ ] The thumb slides with expo-out over 320ms and is inset 4px from the track.
- [ ] The badge springs in with overshoot 180ms after choosing Annual and rests at −4°.
- [ ] "billed monthly" and "… billed yearly" crossfade in the same 18px slot without layout shift.
- [ ] Savings chips cascade in 500ms + 90ms per row after choosing Annual.
- [ ] `aria-pressed` reflects the selection and the live region announces new prices.
- [ ] Studio row has the ink ring, shadow and the MOST BOOKED pill straddling its top edge.
- [ ] With reduced motion, toggling is instant and complete.
- [ ] Nothing overflows the 1280 × 800 frame; no row text wraps past two lines.

## Implementation notes

**Build the odometer once, then only move strips.** Never rewrite digit text; set a custom property and let CSS animate:

```js
const len = Math.max(o.dataset.m.length, o.dataset.a.length);
for (let i = 0; i < len; i++) {
  const col = el('span', 'col'), strip = el('span', 'strip');
  strip.style.setProperty('--i', i);
  for (let d = 0; d < 10; d++) strip.append(el('span', '', d));
  col.append(strip); o.append(col);
}
// on change:
const v = value.padStart(strips.length, '0');
strips.forEach((s, i) => s.style.setProperty('--n', v[i]));
```

**The stagger lives in CSS**, computed from the digit index and the row index set inline on each row (`style="--r:1"`):

```css
.col   { display: block; height: 1em; overflow: hidden; }
.strip { display: flex; flex-direction: column;
         transform: translateY(calc(var(--n, 0) * -1em));
         transition: transform var(--t-roll) var(--expo);
         transition-delay: calc(var(--i) * 70ms + var(--r) * 90ms); }
.strip span { height: 1em; display: block; }
```

**Paint the hero state without a flash.** Set the monthly values synchronously before first paint (no transition fires because there is no previous value), then schedule the switch to annual 450ms later, so the viewer sees the roll on arrival and the settled frame is annual.

Common mistakes: using `line-height` other than 1 on `.odo` (strips drift off-grid); keeping proportional numerals (the 1 is narrower and columns jitter); leading-zero digits showing for shorter prices (keep both prices the same length per plan, or hide leading zero columns with `width:0`); animating the badge with `display` instead of opacity/transform, which kills the spring.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
