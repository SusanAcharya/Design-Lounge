<!-- Design Lounge Nº 137 · "Photographer horizontal gallery" · www.designlounge.live -->

# Photographer horizontal gallery

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A full-page portfolio for photographer Yuki Halloran, series **Salt Year**. The viewport is a horizontal track: a 500px-wide intro, ten 500px-tall plates at three widths (720 / 560 / 380), and a 520px closer. Wheel, drag, arrow keys and a 10-tick scrubber all ease the track with a 9% lerp. The plate nearest the centre is opacity 1; others 0.5. Each plate is a CSS "photograph" (gradients, not files) with a 5% opposite parallax. A fractal-noise grain overlay at 12% overlay-blend sits on top. Gold `#C9A66B` is the only accent. The detail worth copying is treating vertical wheel delta as horizontal travel, so a mouse wheel "just works" on a sideways gallery.

## Structure

```
1280 × 800  overflow hidden, bg #0E0D0B
┌ header 72, grid 1fr auto 1fr, pad 0 48 ─────────────────────────────────┐
│ Yuki Halloran     SALT YEAR  INTERIORS  PORTRAITS  INDEX     [Enquiries]│
├ view (inset 72 0 96 0), cursor grab, tabindex 0 ────────────────────────┤
│ track: flex, align centre, gap 72, pad 0 48, width max-content          │
│ [intro 500] [720] [380] [560] [380] [380] [720] [560] [720] [380] [720] [outro 520]
│  Salt Year   01    02    03    04    05    06    07    08    09    10   Fin.
├ footer 96, grid 200px 1fr 260px, pad 0 48 ────────────────────────────────┤
│ 01 / 10          [10 ticks on a 1px rule, gold fill]     SCROLL · DRAG · ← → │
└ grain SVG, mix-blend overlay, opacity .12, pointer-events none ─────────┘
```

- `<header>` — italic 22px name, `<nav aria-label="Series">` four +0.22em uppercase links (Salt Year `aria-current="page"`), `.enq` outlined "Enquiries".
- `#view.view` `role="region" tabindex="0"` `aria-label="Salt Year gallery. Use arrow keys to move between photographs."`
- `#track` — `.intro`, ten `<figure>`, `.outro`.
- Figures: `.w-l` 720 / `.w-m` 560 / `.w-p` 380. `.ph` height 500, overflow hidden. Inner `<i class="pN">` is the image. `figcaption`: index + italic title / place-or-time.
- `.outro` — "Fin." 96px italic, show copy, gold "Request the price list" button.
- `<footer>` — `#n` live index `aria-live="polite"`, `#ticks` (buttons injected), `.help`.
- Grain: SVG `feTurbulence` `baseFrequency=".9" numOctaves="2"`.

Plates (width class, title, meta, image recipe):

| # | class | title | meta | recipe |
|---|-------|-------|------|--------|
| 01 | w-l | Low water, Rømø | 05:12 · March | sand-to-mud horizon, 46px moon + glow |
| 02 | w-p | Net shed | Havneby | dark interior, ochre door slit |
| 03 | w-m | Salt pans | Læsø · June | pink pans, 120/90px grid |
| 04 | w-p | Fog, 06:40 | Tønder marsh | pale fog over fence posts |
| 05 | w-p | Kirsten, boatwright | Esbjerg | brown oval "head and shoulders" |
| 06 | w-l | Brine | Lakolk · August | teal water, three pale highlights |
| 07 | w-m | Marram | Fanø | gold dune grass hatch |
| 08 | w-l | Last ferry | Sønderho · 23:50 | night water, three window lights |
| 09 | w-p | Fleur de sel | Byrum | multiply conic crystal |
| 10 | w-l | Ebb, 21:04 | Rømø · December | split dusk / wet sand |

Intro: `Series · 2024–2026 · 10 plates`. Deck: "Twelve months on the Wadden coast, from Rømø to Læsø, photographed only in the hour either side of low water."
Outro: on show Galleri Havn, Copenhagen, 14 November 2026 to 10 January 2027. Pigment prints editions of 7, from DKK 9,800.

## Motion

| Element        | Trigger     | Property              | From → To                  | Duration / factor | Easing | Notes |
|----------------|-------------|-----------------------|----------------------------|-------------------|--------|-------|
| Track          | wheel/drag/keys | translate3d x     | lerp toward `tx`           | 0.09 / frame      | —      | 1.0 if reduced |
| Figure opacity | nearest     | opacity               | 0.5 → 1                    | 600ms             | `--ease` | two on while x<200 |
| Photo parallax | scroll      | translate3d x         | −0.05 × (centre − mid)     | per frame         | —      | inner `i` is inset −40px so it can slide |
| Hint arrow     | loop        | translateX            | 0 ↔ 8px                    | 2.4s              | `--ease` | infinite |
| Tick mark      | hover/current | height, colour      | 9px ink-3 → 17px accent    | 200ms             | `--ease` | |
| Fill bar       | scroll      | width %               | 0 → 100 of max             | per frame         | —      | 1px gold on the rule |
| Enquiries      | hover       | border, color         | line/ink → accent          | 200ms             | `--ease` | |

Wheel listener `{ passive: false }`. View class `.drag` while pointer is down (`cursor: grabbing`).

## States

- **Resting plates:** opacity 0.5. **Current (and 01–02 at start):** opacity 1.
- **Current tick:** `aria-current="true"`, 17px gold mark.
- **Nav current / hover:** `--ink` (from `--ink-2`).
- **Enquiries hover:** gold border and type.
- **View focus:** 1px gold outline, 4px offset (the gallery itself is a region).
- **Drag:** `.drag` grabbing cursor.
- **Index:** `01`–`10`, live region polite.

## Accessibility

- Gallery region has a name that mentions arrow keys. It is `tabindex="0"` so keyboard users can move it.
- Ticks are buttons with `aria-label="Go to plate N"`. Index is `aria-live="polite"`.
- Series nav uses `aria-current="page"` on Salt Year.
- Grain SVG `aria-hidden`. Hint SVG `aria-hidden`.
- Tab order: name → 4 series links → Enquiries → view (then arrows operate) → 10 ticks → price-list link (when scrolled to the end; it is in the track).
- Contrast: bone on near-black; `--ink-2` for 14px deck (~6:1); `--ink-3` for 11–13px meta.
- Hit targets: Enquiries ~40px tall; ticks are 28px tall flex-1 (wide). The view is the remaining viewport.

## Responsive rules

- ≥ 1280: as specified, photo height 500, gap 72, side pad 48.
- 1024–1279: photo height 440; `.w-l` 640; name 20px; title 120px.
- 768–1023: photo height 360; gap 48; intro 380; hide the help legend or wrap it. Drag remains the primary gesture.
- < 640: photo height 280; `.w-l` 100vw − 48px; ticks stay 10 buttons (thin). Keep horizontal-only — do not restack into a vertical masonry.
- On every size, remeasure `max` on resize and after fonts.ready.
- Reduced motion snaps (`lerp = 1`) and kills the hint loop.

## Acceptance checklist

- [ ] Header 72px, footer 96px, photo height 500px, gap 72px at 1280×800.
- [ ] Ten plates at widths 720 / 380 / 560 / 380 / 380 / 720 / 560 / 720 / 380 / 720 in that order.
- [ ] Wheel (vertical or horizontal) moves the track; drag with 1.4× multiplier; lerp 0.09.
- [ ] Current plate is the one whose centre is nearest the viewport centre; index is two digits; ticks `aria-current`.
- [ ] Inner photographs parallax by 5% against their centre delta.
- [ ] While `x < 200`, plates 01 and 02 are both at opacity 1.
- [ ] Arrow keys step plates; Home/End jump; view is focusable.
- [ ] Footer fill bar equals `x / max`; grain overlay is fractal noise at 12% opacity.
- [ ] Title is 156px Bodoni; "Year" is on the second line padded 96px.
- [ ] Copy matches Salt Year, Wadden, Galleri Havn, DKK 9,800, editions of 7.
- [ ] Reduced motion snaps without the 9% glide.
- [ ] Focus rings are 1px gold, 4px offset.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: intro in view. Title **Salt / Year** (second word padded 96px). Hint arrow nudges 8px every 2.4s. Index reads **01 / 10** and tick 01 is `aria-current`. While `x < 200` the first two figures also get `.on` so the open does not look dim.
2. Wheel: `preventDefault`, add `1.1 * (the larger of |deltaY| and |deltaX|)` to target `tx`, clamped `[0, max]`. `max = track.scrollWidth − view.clientWidth`.
3. Pointer drag: grabbing cursor, capture pointer, `tx = startTx − (clientX − startX) * 1.4`.
4. Each frame: `x += (tx − x) * (reduce ? 1 : 0.09)`. Stop the rAF when `|tx − x| < 0.3`. Apply `translate3d(-x, 0, 0)` on the track.
5. For each figure, compute the delta from plate centre to viewport centre. The nearest is current: pad the index to two digits, set `aria-current="true"` on that tick, `.on` on that figure (and on 0–1 while `x < 200`). Inner photo `i` parallax `translate3d((-d * 0.05)px, 0, 0)`. Fill bar width = `x / max * 100%`.
6. Tick buttons: `to(i)` sets `tx` so plate `i` is centred (`offsetLeft + width/2 − view.clientWidth/2`).
7. Keyboard when `.view` is focused: ArrowRight / ArrowLeft step one plate; Home `tx = 0`; End `tx = max`.
8. Resize remeasures `max` and reclamps.
9. `document.fonts.ready` remeasures so Bodoni metrics do not leave the track short.
10. Reduced motion: lerp factor 1 (snap), hint animation none, transitions 1ms. Parallax still updates (it is a position, not a loop).

## Tokens

```css
:root {
  /* colour — warm black, bone type, one gold */
  --bg: #0e0d0b;
  --bg-2: #17150f;        /* plate backing */
  --ink: #ede6da;
  --ink-2: #a39a8c;
  --ink-3: #6e675d;
  --line: #2c2924;
  --accent: #c9a66b;

  /* type */
  --serif: "Bodoni Moda", Didot, serif;
  --sans: "Tenor Sans", system-ui, sans-serif;

  /* layout */
  --ph: 500px;
  --gap: 72px;
  --head: 72px;
  --foot: 96px;
  --w-l: 720px;
  --w-m: 560px;
  --w-p: 380px;
  --intro: 500px;
  --outro: 520px;

  /* motion */
  --t-micro: 200ms;
  --t-in: 900ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --lerp: .09;
  --parallax: .05;
  --wheel: 1.1;
  --drag: 1.4;
}
```

## Typography

| Role          | Family      | Size | Weight | Line-height | Tracking | Case      |
|---------------|-------------|-----:|-------:|------------:|---------:|-----------|
| Body          | Tenor Sans  | 13px | 400    | 1.5         | +0.02em  | sentence  |
| Name          | Bodoni Moda | 22px | 400 italic | 1        | 0        | title     |
| Nav / Enquiries / hint / help | Tenor Sans | 11px | 400 | 1 | +0.22em / +0.2em | UPPERCASE |
| Series kicker | Tenor Sans  | 11px | 400    | 1           | +0.24em  | UPPERCASE |
| Title         | Bodoni Moda | 156px| 400    | 0.84        | −0.035em | title     |
| Intro / outro p | Tenor Sans | 14px | 400   | 1.7         | 0        | sentence  |
| Caption meta  | Tenor Sans  | 11px | 400    | 1           | +0.14em  | UPPERCASE |
| Caption title | Bodoni Moda | 15px | 400 italic | 1        | 0        | sentence  |
| Index         | Bodoni Moda | 54px | 400    | 1           | −0.02em  | lining    |
| Index /10     | Tenor Sans  | 13px | 400    | 1           | +0.1em   | mixed     |
| Fin.          | Bodoni Moda | 96px | 400 italic | 0.9      | −0.03em  | title     |
| Price CTA     | Tenor Sans  | 11px | 400    | 1           | +0.22em  | UPPERCASE |

Enquiries: 11px pad 11 18, border `--line`, hover border+colour `--accent`.
Price CTA: `--bg` type on `--accent` fill, pad 14 22.

## Implementation notes

**One rAF loop, target vs position** — never set `transform` from the wheel handler directly:

```js
function tick() {
  x += (tx - x) * (reduce ? 1 : .09);
  if (Math.abs(tx - x) < .3) x = tx;
  render();
  raf = x !== tx ? requestAnimationFrame(tick) : 0;
}
view.addEventListener('wheel', (e) => {
  e.preventDefault();
  const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  tx = Math.max(0, Math.min(max, tx + d * 1.1));
  if (!raf) raf = requestAnimationFrame(tick);
}, { passive: false });
```

**Centre a plate** from ticks or arrows:

```js
function centreOf(i) {
  const f = figs[i];
  return f.offsetLeft + f.offsetWidth / 2 - view.clientWidth / 2;
}
```

**Parallax on the inner image**, which is wider than the frame (`inset: 0 -40px`) so edges do not show:

```js
iEl.style.transform = `translate3d(${(-d * .05).toFixed(1)}px,0,0)`;
```

Common mistakes: using `overflow-x: auto` native scroll (you lose lerp, parallax and the custom ticks); applying wheel to `window` without `preventDefault` (the iframe will bounce); measuring `max` before fonts load (intro 156px Bodoni changes width); hiding off-centre plates with `display:none` (breaks `offsetLeft`); raster `<img>` instead of the CSS plates.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
