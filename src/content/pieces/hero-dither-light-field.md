---
title: "Dither light field hero"
summary: "An editorial daylight-software hero beside a canvas field of 8×8 Bayer-dithered window light that drifts slowly and opens a lamp with a vermilion rim under the pointer."
platform: web
type: section
category: hero
tags: [hero, dither, canvas, editorial, generative]
styles: [editorial, paper, retro]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#F2EFE8", "#1B1A17", "#4A4740", "#C93D14"]
fonts: ["Instrument Serif", "Familjen Grotesk"]
related: [hero-dot-matrix-field, hero-engraved-moonrise-plate]
---

# Dither light field hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The top of a site for Clerestory, invented daylight-simulation software for architects. The left 38% is calm paper with an editorial headline in Instrument Serif; the right 62% is a light field: afternoon sun falling through three skewed window panes, rendered as an ordered (8×8 Bayer) dither in two colours, ink and paper, at 4px cells. The panes drift a few percent sideways over about a minute, and the pointer becomes a lamp that clears the dither around it with a thin vermilion rim. It is the product's own subject (light, measured) drawn in the product's own manner (quantised), and it is calm enough to sit in a grid.

## Reference behaviour

1. Initial state: the field shows three bright pane-shaped patches slanting down to the left at about 23°, over a mid-grey ambient that is lighter at the top. The field fades to bare paper over its left 30% so the headline sits on clean ground.
2. The panes drift: horizontal offset = sin(t × 0.09) × 8% of the field width, and the ambient breathes with a slow sine. The canvas redraws at about 24 fps (frames closer than 42ms are skipped).
3. Pointer enters the field: a lamp fades in (eased 8% per frame toward full). Within a 32-cell radius (128px) brightness rises by up to 0.7 at the centre, so the dither opens up. Cells whose lamp influence is between 0.10 and 0.20 that would be ink are drawn in `#C93D14` instead, giving a 1–2 cell vermilion rim.
4. Pointer leaves: the lamp eases out.
5. Two paper labels sit on the field with solid backgrounds: a lux reading chip top right ("Studio 4, 21 June, 14:20 / 1,840 lux") and a figure caption bottom right.
6. Hover the primary button: ink → vermilion over 160ms. Hover the text link: ink → vermilion, underline too.
7. Tab hidden: the loop stops; visible again: it resumes.
8. Reduced motion: one frame is drawn and no loop runs; the lamp still appears instantly under the pointer, because the user is driving it.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────────────┐
│ ⌂ Clerestory               Product  Case studies  Method  Pricing [Start a study] │ nav 68
├──────────────────────────────┬────────────────────────────────────────┤
│ ── DAYLIGHT SIMULATION FOR…  │:·:·:·:::·  ┌ chip ──────────┐          │
│                              │·:·::█▒▒░  │ Studio 4 …     │          │
│ Daylight,          112/0.9   │:·:░░  ░░  │ 1,840 lux      │          │
│ measured  (italic)           │·:░  ◜◝ ░░ └────────────────┘          │
│ before the                   │::░ (lamp) ░░                          │
│ concrete.                    │·:·░  ◟◞  ░░░                          │
│                              │:·:·:░░  ░░░                           │
│ lede 17/1.55, max 420        │·:·:·:·░░░░  ┌ caption ─────────────┐  │
│ [Run a free study →]  Read … │:·:·:·:·:·:  │ Fig. 1  Afternoon …  │  │
└──────────────────────────────┴─────────────┴──────────────────────┴───┘
 padding 0 56px; field = absolute, inset 0 0 0 38%; canvas = field size ÷ 4
```

- `<nav aria-label="Primary">`: wordmark link, `<ul>` of four links, small ink button.
- `<section class="hero" aria-labelledby="h">`, a 2-column grid (`minmax(0,560px) 1fr`).
  - `.field[aria-hidden]` (absolute) holding one `<canvas>` sized to field ÷ 4 and stretched with `image-rendering: pixelated`.
  - `.copy`: eyebrow `p`, `h1` with an `em`, lede, a row with one button and one underlined text link.
  - `p.chip.lux[aria-hidden]` and `p.cap` (the caption is real text; it tells the user what the field is).

## Tokens

```css
:root {
  --paper: #f2efe8;     /* page and dither "off" cells */
  --paper-2: #e8e4da;
  --ink: #1b1a17;       /* text and dither "on" cells */
  --ink-2: #4a4740;     /* body, nav links */
  --line: #cfc9bc;      /* nav hairline */
  --accent: #c93d14;    /* lamp rim, lux number, eyebrow rule, hovers */
  --on-accent: #fff8f2;
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Familjen Grotesk", system-ui, sans-serif;
  --fs-display: 112px; --fs-lux: 30px; --fs-logo: 26px; --fs-lede: 17px; --fs-body: 15px; --fs-nav: 14px; --fs-small: 12px;
  --space: 4px 8px 12px 22px 26px 30px 56px;
  --r: 2px;
  --cell: 4px;          /* dither cell */
  --frame: 42ms;        /* ~24 fps */
  --lamp-radius: 32;    /* cells */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-micro: 160ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| h1 | Instrument Serif | 112px (100 under 1100; clamp(54px,15vw,96px) on phone) | 400, "measured" italic | 0.9 | -0.025em | sentence |
| Wordmark | Instrument Serif | 26px | 400 | 1 | -0.01em | |
| Lux value | Instrument Serif | 30px | 400 | 1 | 0 | accent colour |
| Caption "Fig. 1" | Instrument Serif | 15px | 400 italic | 1.4 | 0 | |
| Lede | Familjen Grotesk | 17px | 400 | 1.55 | 0 | |
| Nav, buttons, link | Familjen Grotesk | 14px (nav button 13px) | 400 / 500 | 1 | 0 | |
| Eyebrow | Familjen Grotesk | 12px | 600 | 1.4 | 0.12em | uppercase |
| Chip, caption body | Familjen Grotesk | 12–13px | 400 / 600 | 1.35 | 0 | |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
|---|---|---|---|---|---|
| Pane drift | always | pane offset | −8% ↔ +8% | sin period ≈ 70s | sine |
| Ambient breath | always | ambient brightness | ±0.07 | sine, ≈ 28s | sine |
| Lamp | pointer enter / leave | lamp strength | 0 ↔ 1 | 8% of the gap per frame (≈ 500ms) | exponential approach |
| Button hover | hover | background | ink → vermilion | 160ms | standard |

The canvas is the only moving thing. Reduced motion: no loop; one frame plus instant lamp on pointer.

## States

- **Idle:** drifting panes, no lamp.
- **Pointer in field:** lamp opens, vermilion rim; crosshair cursor.
- **Button hover:** vermilion fill, `#FFF8F2` text (4.9:1). **Link hover:** text and 1.5px underline vermilion.
- **Focus-visible:** 2px vermilion outline, 3px offset.
- **No canvas / no JS:** the field stays paper and the page still reads as a complete editorial hero.

## Accessibility

- The field and lux chip are `aria-hidden`; the caption is plain text.
- All text sits on solid paper: the headline column never overlaps dither cells (the field fades to paper over its left 30%), and the chip and caption have paper backgrounds with a 1px ink border on the chip.
- Contrast: ink on paper 16:1; `--ink-2` on paper 8.4:1; vermilion on paper 4.9:1, used for the 30px lux number only.
- Keyboard: wordmark, four nav links, Start a study, Run a free study, Read the Halden Library case.
- The animation is a slow drift, under one cycle a minute, and stops in a hidden tab.

## Responsive rules

- **≥1280:** as drawn.
- **1100–1280:** same; under 1100 the headline drops to 100px and the field starts at 44%.
- **860–1100:** keep the split; the canvas resizes to its new box on `resize`.
- **<860 (phone at 390):** nav links hide; the field becomes a 300px band above the copy, full bleed, faded to paper over its bottom 28% instead of its left side; lamp radius 22 cells; the caption drops into the flow under the buttons. Body scrolls; no sideways scroll.

## Acceptance checklist

**Always**
- [ ] The field is a canvas at one quarter of its CSS size, scaled with `image-rendering: pixelated`, so cells are crisp 4px squares.
- [ ] Dithering is ordered (8×8 Bayer), not random noise, so the field does not shimmer frame to frame.
- [ ] Only two colours in the field plus the accent rim; no grey pixels.
- [ ] Text never sits on dither cells; labels on the field have solid paper backgrounds.
- [ ] The loop runs at about 24 fps and stops when the tab is hidden.
- [ ] Reduced motion draws one frame and runs no loop.
- [ ] At 390 wide the field stacks above the copy and nothing scrolls sideways.
- [ ] Focus rings visible on every link and button.

**This demo**
- [ ] Headline "Daylight, measured before the concrete." in Instrument Serif 112px, "measured" italic.
- [ ] Three window panes slant at about 23° and drift ±8%.
- [ ] Lamp radius 32 cells with a vermilion `#C93D14` rim between influence 0.10 and 0.20.
- [ ] Chip reads "Studio 4, 21 June, 14:20" over "1,840 lux".

## Implementation notes

**The dither itself.** Compute a brightness 0–1 per cell, compare with the Bayer threshold, and write ink or paper into an `ImageData`:

```js
const B = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,
           3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21];
const th = (B[(y & 7) * 8 + (x & 7)] + .5) / 64;
const c = val < th ? (rim ? ACCENT : INK) : PAPER;
data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255;
```

**Window panes from one skewed coordinate.** Shear `u` by `v`, cut a 0.58-wide band, split it into three panes with soft mullions:

```js
const s = u - v * .42 - .32 - drift;            // shear gives the slant
let pane = 0;
if (s > 0 && s < .58) { const f = (s / .58 * 3) % 1; pane = sm(.06, .16, f) * sm(.94, .84, f); }
pane *= sm(.05, .28, v) * sm(1.02, .7, v);      // fade top and bottom
let val = .36 + .24 * (1 - v) + pane * .6;      // ambient + sun
val = 1 - (1 - val) * sm(0, .3, u);             // clear the left edge for the headline
```

**Throttle, do not interval.** Keep rAF but skip frames under 42ms, and stop in hidden tabs:

```js
function loop(now) { raf = requestAnimationFrame(loop); if (now - last < 42) return; last = now; draw(now); }
```

Common mistakes: drawing at full resolution (64k cells is cheap; 1M is not); smoothing the upscale, which turns the dither into grey mush; random dithering, which flickers every frame; letting the field run under the headline and failing contrast.
