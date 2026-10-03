<!-- Design Lounge Nº 272 · "Ink wash background" · designlounge.vercel.app -->

# Ink wash background

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A full-frame sumi-e background behind the landing section of a fictional gallery, "Kasumi Hall", announcing an exhibition of ink scrolls. The ground is warm rice paper with visible kozo fibres. Clicking the paper drops ink: a bloom spreads out over 2.6 seconds, darkest where it landed and pale at its reach, then dries with a faint darker tide line at its edge and a scatter of pigment grains. One or two smaller satellite blooms bleed out from it a moment later. The detail worth copying is that **each bloom is painted, not tweened**: every frame adds one more translucent, slightly wobbling layer at a growing radius into a canvas that is never cleared, so the gradient, the soft edge and the tonal pooling all come from accumulation. A floating panel picks the ink (sumi black, indigo, vermilion), sets how much water (bloom size), drops ink by keyboard, and rinses the paper.

## Reference behaviour

1. First frame: rice paper, four dried blooms on the right half: a large sumi wash near (76%, 36%) with a satellite, an indigo wash at (92%, 72%) with a satellite, a small sumi bloom at (62%, 80%), and a small vermilion spot at (68%, 17%). The left half, under the copy, is clear paper.
2. Click (pointerdown) anywhere that is not a link, button, input, label or the panel: a bloom of radius `water × (0.85…1.15)` starts at the pointer, plus 1–2 satellites at 55–95% of that radius away, sized 22–40% of it, starting 0.5–1.1s later.
3. A bloom grows with a cubic ease-out from 10% to 100% of its radius over 2.6s. Its edge wobbles a little as it spreads.
4. When a bloom finishes, draw its tide line (two soft strokes just inside the edge) and a pigment grain of `radius × 1.4` specks.
5. The loop runs only while blooms are spreading; when the last one dries, `requestAnimationFrame` stops.
6. The ink canvas is masked: ink is held at 28% strength over the left 40% of the frame and reaches full strength by 58%. Blooms can cross under the copy without hurting legibility.
7. Swatches: Sumi `#1b1a17` (default), Indigo `#2e3f5c`, Vermilion `#b5332a`. The pressed swatch has a 1.5px ink ring.
8. Water slider: 70–280px, step 10, default 150. It sets the radius of the next bloom.
9. "Drop ink" places a bloom at a random point in the clear right side (60–92% x, 20–80% y), so keyboard users get the effect. A live region says "Ink dropped".
10. "Rinse" fades the ink canvas to 0 over 700ms, clears it and restores opacity. A live region says "Paper rinsed".
11. Resize: the paper is regenerated from the same seed, and every stored bloom (the last 24) is repainted dry, so a resize never loses the painting.
12. Reduced motion: clicks and Drop ink paint the finished bloom in one frame (all layers drawn synchronously). Rinse is instant.

## Structure

```
1280 × 800   two fixed canvases: #paper (bottom), #ink (multiply, masked)
┌──────────────────────────────────────────────────────────────────────┐
│ [霞] Kasumi Hall                       Exhibitions  Visit  Membership │ header 88
│                                                         ░░░░▓▓▓▓░  墨 │
│ Exhibition · 12 Nov – 8 Dec 2026                       ░▓▓████▓▓░  は │ vertical text
│                                                        ░▓██████▓░  、 │ right 84 top 118
│ Ink that keeps                         68px serif       ░▓▓███▓▓░   水 │
│ moving after                                             ░░▓▓▓░░    を │
│ the brush lifts.                                     ░▓▓░     ░▓▓▓▓░ │
│ sub 16px, max 440                                   ░▓██▓░   ░▓████▓░│
│ [Reserve a time →] [Read the catalogue]              ░▓▓░     ░▓▓▓▓░ │
│ ─────────────────────────────────                   Click the paper… │ hint
│ ROOM            OPEN             ENTRY        ┌ ● ● ●  Water ──●── [Drop ink] [Rinse] ┐
│ Hall 3, east…   Tue–Sun, 10–18   ¥1,200       └──────────────── panel right 40 bottom 40 ┘
└──────────────────────────────────────────────────────────────────────┘
 page padding 0 80px; copy max-width 520, top margin 76
```

- `#paper`: drawn once per resize at CSS pixel size (texture does not need DPR).
- `#ink`: backing store × `min(devicePixelRatio, 2)`, `mix-blend-mode: multiply`, linear mask.
- `.page` has `pointer-events: none`; links and buttons re-enable them so clicks on paper reach `window`.
- `<header>` with a vermilion seal (`aria-hidden`) and the name link, plus `<nav aria-label="Main">`.
- `<main class="copy">`: kicker, `<h1>`, sub, two links, `<dl class="facts">`.
- `.tate`: vertical Japanese line, `writing-mode: vertical-rl`, `lang="ja"`, decorative.
- `.panel role="group"`: swatch group, labelled range, two tool buttons. A visually hidden `aria-live` paragraph.

## Tokens

```css
:root {
  --paper: #eee7d8;        /* rice paper ground */
  --paper-2: #f6f1e6;      /* panel, text on dark */
  --ink: #1b1a17;          /* type, primary button */
  --ink-2: #4b463d;        /* sub-copy, nav */
  --ink-3: #6f685b;        /* labels, hint */
  --line: rgba(27, 26, 23, .18);

  --sumi: #1b1a17;         /* inks */
  --ai: #2e3f5c;
  --shu: #b5332a;          /* seal, kicker date, focus ring; never body text */

  --serif: "Shippori Mincho", Georgia, serif;
  --sans: "Zen Kaku Gothic New", system-ui, sans-serif;

  --bloom-dur: 2.6s;
  --bloom-points: 64;      /* vertices per blob outline */
  --water-min: 70px; --water-default: 150px; --water-max: 280px;
  --blooms-kept: 24;
  --mask-quiet: .28;       /* ink strength over the copy */

  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-fast: 160ms;
  --t-rinse: 700ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Headline | Shippori Mincho | 68px | 500 | 1.12 | −0.01em | sentence |
| Vertical line | Shippori Mincho | 22px | 500 | 1.6 | 0.3em | Japanese |
| Fact value | Shippori Mincho | 17px | 500 | 1.4 | 0 | as written |
| Name | Shippori Mincho | 17px | 700 | 1 | 0.04em | Title |
| Sub-copy | Zen Kaku Gothic New | 16px | 400 | 1.7 | 0 | sentence |
| Kicker | Zen Kaku Gothic New | 13px | 400 | 1.7 | 0.12em | sentence |
| Buttons | Zen Kaku Gothic New | 14px | 500 | 1 | 0.04em | sentence |
| Fact label | Zen Kaku Gothic New | 11px | 400 | 1.4 | 0.14em | UPPER |
| Panel | Zen Kaku Gothic New | 12px | 400 | 1 | 0.06em | sentence |

## Motion

| Thing | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Bloom spread | click / Drop ink | layer radius | 10% → 100% of R | 2.6s | cubic ease-out `1−(1−p)³` | drawn complete in one frame |
| Layer opacity | each frame | globalAlpha | `0.014·(1−p)^1.5 + 0.003` | per layer | — | same total |
| Edge wobble | each frame | harmonic phase | `+0.35·t` | 2.6s | linear phase | baked |
| Satellites | with a bloom | start | delay 0.5–1.1s | 2.6s each | same | complete at once |
| Tide line + grain | bloom end | strokes, specks | — | one frame | — | same |
| Rinse | click | ink canvas opacity | 1 → 0, clear, → 1 | 700ms | `--ease` | instant |
| Swatch hover | hover | scale | 1 → 1.08 | 160ms | `--ease` | 1ms |

## States

- **Swatch pressed:** inset 2px paper ring plus an outer 1.5px ink ring, `aria-pressed="true"`. One pressed at a time.
- **Tool hover:** background `--paper`, border `--ink-3`.
- **Primary hover:** `--ink` → `--ai`. **Outline hover:** fills with `--ink`.
- **Nav hover:** colour to `--ink` and a 1px underline.
- **Focus-visible:** 2px `--shu` outline, offset 3px, on every link, button, swatch and the slider.
- **Spreading:** loop running. **Dry:** loop stopped, canvas static.
- **Rinsed:** clean paper, bloom list empty.

## Accessibility

- Both canvases are decorative (`aria-hidden="true"`). The seal glyph and the vertical line are `aria-hidden` too.
- Clicking the paper is pointer-only; **Drop ink** is the keyboard equivalent and announces "Ink dropped" through a polite live region. Rinse announces "Paper rinsed".
- Swatches are buttons with names ("Sumi black", "Indigo", "Vermilion") and `aria-pressed`. The slider has a visible "Water" label wrapping it.
- Tab order: name → three nav links → Reserve → Catalogue → three swatches → Water → Drop ink → Rinse.
- Contrast: `#1b1a17` on `#eee7d8` is 14.6:1; `#4b463d` sub-copy is 7.9:1. The 28% mask keeps any bloom under the copy below 30% darkening, so sub-copy stays above 4.5:1 even over the darkest sumi.
- Vermilion is a seal and an accent on large text and the date, never for body copy.
- Blooms stop on their own after 2.6s, so no pause control is needed.

## Responsive rules

- ≥ 1280: as specified.
- < 1000: the vertical Japanese line hides.
- < 640: 24px page padding, nav hides, headline 42px, sub 15px, facts wrap, buttons wrap without breaking their labels. The ink mask turns vertical: 30% strength down to 60% of the height, full by 75%, so blooms live under the copy at the bottom. Drop ink picks points at 20–80% x and 72–92% y. The panel spans the bottom with 16px insets; the tool buttons become icon-only (they keep their accessible names) and the hint hides.
- Never scale the paper texture with the viewport; regenerate it at the new size from the same seed.

## Acceptance checklist

### Always

- [ ] The ink canvas is never cleared between frames during a bloom; each frame adds one translucent layer.
- [ ] Each layer is an irregular closed path of 64 vertices from summed sine harmonics, not a circle.
- [ ] Bloom radius follows a cubic ease-out over 2.6s; layer opacity falls as the bloom grows, so the landing point is darkest.
- [ ] A dried bloom gets a soft tide line just inside its edge and a scatter of grain specks.
- [ ] One or two satellite blooms follow each click after a short delay.
- [ ] The loop stops when no bloom is spreading.
- [ ] The ink layer uses `multiply` so paper fibres show through the ink.
- [ ] The ink is held at 28% strength behind the copy.
- [ ] A keyboard-reachable Drop ink control exists and announces itself.
- [ ] Resize repaints stored blooms; nothing is lost.
- [ ] Reduced motion paints finished blooms in one frame.

### This demo

- [ ] Headline "Ink that keeps moving after the brush lifts." in Shippori Mincho 68px.
- [ ] Four pre-dried blooms on the right half on first paint, including one small vermilion spot.
- [ ] Inks: Sumi `#1b1a17`, Indigo `#2e3f5c`, Vermilion `#b5332a`; Water default 150px.
- [ ] Facts: Hall 3, east wing · Tue–Sun, 10–18 · ¥1,200.

## Implementation notes

**One layer per frame.** The whole look comes from these few lines; tune the alpha before anything else:

```js
function layer(b, p) {                       // p: 0 → 1 over 2.6s
  const e = 1 - Math.pow(1 - p, 3);
  const r = b.R * (.1 + .9 * e);
  ctx.fillStyle = b.col;
  ctx.globalAlpha = .014 * Math.pow(1 - p, 1.5) + .003;
  shape(b, r, .05 + .12 * e, p * 2.6);       // amplitude grows: the edge gets ragged as it spreads
  ctx.fill();
}
function shape(b, r, amp, t) {
  ctx.beginPath();
  for (let i = 0; i <= 64; i++) {
    const a = i / 64 * Math.PI * 2;
    let n = 0;
    for (let j = 0; j < b.h.length; j += 3) n += Math.sin(b.h[j] * a + b.h[j + 1] + t * .35) * b.h[j + 2];
    const rr = r * (1 + amp * n);
    ctx[i ? 'lineTo' : 'moveTo'](b.x + Math.cos(a) * rr, b.y + Math.sin(a) * rr);
  }
  ctx.closePath();
}
```

Harmonics per bloom: for k = 2…9, store `[k, random phase, (0.4 + random) / (0.8k)]`. Low k gives the lobes, high k the fibre-catching ragged edge.

**Tide line and grain when the bloom dries:**

```js
ctx.strokeStyle = b.col;
ctx.globalAlpha = .06; ctx.lineWidth = 7;   shape(b, b.R * .975, .17, 2.6); ctx.stroke();
ctx.globalAlpha = .07; ctx.lineWidth = 2.5; shape(b, b.R * .995, .17, 2.6); ctx.stroke();
for (let i = 0; i < b.R * 1.4; i++) {        // seeded, so a repaint matches
  const a = g() * Math.PI * 2, d = Math.sqrt(g()) * b.R * .9, z = .5 + g() * 1.3;
  ctx.globalAlpha = .05 + g() * .12;
  ctx.fillRect(b.x + Math.cos(a) * d, b.y + Math.sin(a) * d, z, z);
}
```

**Rice paper, once.** Fill `#eee7d8`; add 14 large radial blotches (warm white at 35% or brown at 7%); one 1px speck per 700px² (brown 7% or white 40%); one fibre per 2600px²: a quadratic curve 18–98px long, 0.3–1px wide, 65% brown at 9% and 35% warm white at 40%. Use a seeded generator so resizes look the same.

Common mistakes:

- Opacity per layer that is too high: after 156 frames the bloom is a solid black disc. The total should top out around 75% at the centre.
- Clearing the ink canvas every frame and redrawing blooms as gradients. It looks like a vector circle, not a wash.
- A crisp 1px outline as the tide line. Keep it soft and wide.
- Ink drawn at full strength under the headline.
- Forgetting the keyboard path; the click is not the only way in.
- Re-randomising grain on resize, so the painting changes when the window moves.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
