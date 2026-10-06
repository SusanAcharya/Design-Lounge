<!-- Design Lounge Nº 318 · "Museum wall with placards" · www.designlounge.live -->

# Museum wall with placards

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

One room of a museum, drawn as a page. Four paintings hang on a single eye line across an oxblood wall, each under a small brass picture light, each with a cream wall label to its right: artist, nationality and dates, title in italic, year, medium. A skirting board, a wooden floor and a gallery bench sit at the bottom. Selecting a work zooms it out of its place on the wall into a darkened view, and the label grows into a 380px reading panel with the full record and a curator's note. The detail worth copying is that the label is the panel. The small wall label and the side panel use the same fields in the same order, so the zoom reads as walking up to the wall.

The paintings are SVG scenes run through an `feTurbulence` + `feDisplacementMap` filter so edges wobble like brushwork. No image files.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────────┐
│ THE WREN HALL COLLECTION                              ROOM 12      │ header, padding 30 48 0
│ Weather Indoors · the coast painters, 1900–1960   Select a work…   │
│                                                                   │
│     ═══            ═══              ═══             ═══            │ picture lights
│ ┌gilt 252┐[label] ┌walnut┐[label] ┌float┐[label] ┌gilt┐[label]     │ wall, gap 22,
│ │        │  88w   │ mat  │        │     │        └────┘            │ centre line
│ └────────┘        └──────┘        └─────┘                          │
│                                                                   │
│                        ┌──── bench 360 ────┐                       │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ skirting 14 / floor 48 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└───────────────────────────────────────────────────────────────────┘

Detail (fixed, full frame), grid: 1fr | 380px
┌──────────────────────────────────────────────┬────────────────────┐
│                                         (×)  │ Casimir Halm       │
│          ┌──────────────────────┐            │ Polish, 1890–1967  │
│          │   painting, scaled   │            │ Woman Reading by…  │ panel padding
│          │   to fit, ≤ 3.2×     │            │ ─────────────────  │ 56 40 32
│          └──────────────────────┘            │ DATE    1926 …     │
│                                              │ note, 16px serif   │
│                                              │ 2 OF 4     (‹)(›)  │
└──────────────────────────────────────────────┴────────────────────┘
```

- `header` with kicker, the only `h1` (title + italic subtitle), room number and hint.
- `main.wall` (labelled "Gallery wall"): four `.work` rows, each a `button.art` (lamp, frame, SVG) plus a `div.placard`.
- `.bench` and the floor are decorative (`aria-hidden`, pseudo-elements).
- `div.detail` with `role="dialog"`, `aria-modal="true"`, `aria-labelledby` → the panel `h2`. Inside: `.stagebig` with the big framed copy, `aside.panel`, and the close button.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Frame lift | hover | transform, shadow | 0 → −2px | 300ms | `--ease` | none |
| Detail backdrop | open / close | opacity | 0 ↔ 1 | 320ms | `--ease` | instant |
| Painting zoom | open | transform | wall rect → none | 560ms | `--expo` | none |
| Painting return | close | transform | none → wall rect | 380ms | `--expo` | none |
| Panel | open | translateX, opacity | 24px, 0 → 0, 1 | 400ms / 300ms, delay 120ms | `--expo` / `--ease` | instant |
| Step | ← → | opacity, translateX | 0, ∓24px → 1, 0 | 320ms | `--ease` | none |

## States

- Painting resting: frame shadow as tokens. Hover: lifted. Focus-visible: 2px `--card` outline, offset 4px.
- Open: the wall copy of the open work is `visibility:hidden`; `aria-hidden="false"` on the dialog.
- Panel buttons: 40px circles, 1px `--card-line` border; hover fills `#1f1a170d`; focus ring in `--card-ink`.
- Close button: on the dark backdrop, light ink with a `#f3e9df40` border.
- No empty or error state; every work has a full record.

## Accessibility

- Each painting is a `button` labelled "Low Tide at Varre, Ilka Ostergaard, 1912. View with placard". The SVG is `aria-hidden`.
- The wall label is real text next to the button, so it is readable without opening.
- Dialog: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` the title. Focus goes to close on open, is trapped while open, and returns to the painting on close.
- Keys: Enter/Space opens; Esc closes; ← → step; Tab cycles Previous, Next, Close.
- Contrast: `#1f1a17` on `#f3eee3` ≈ 15:1; `#5d544b` on `#f3eee3` ≈ 6.8:1; `#f3e9df` on `#6b2420` ≈ 10:1; `#d9b9ac` on `#6b2420` ≈ 5.6:1.
- Labels at 10–11px are a museum convention; the panel repeats every field at 13px and up.

## Responsive rules

- ≥1280: four works in one row. Wall scales per work: 0.86, 0.78, 0.8, 0.78 of the base SVG size.
- 1024: the row wraps to 3 + 1, still centred.
- 768: two per row.
- ≤900: the detail becomes one column: painting on top (`minmax(300px, 52vh)`), panel below, the dialog scrolls.
- <640: each work stacks its label under the frame, frames cap at `100vw − 110px`, row gap 64px, bench 240px.
- Never scroll sideways.

## Acceptance checklist

### Always

- [ ] Works hang on one shared centre line; labels sit to the right, aligned to the bottom of the frame.
- [ ] Each label shows artist, dates, title (italic), year, medium, in that order; the panel repeats the same order and adds size, credit and note.
- [ ] Opening zooms the actual work from its wall position; only one copy is visible at a time.
- [ ] Esc, close and backdrop click all close; the work returns to its place and gets focus.
- [ ] ← → step through all works and wrap.
- [ ] Focus is trapped in the dialog and visible on every control.
- [ ] Three distinct frame styles; paintings are SVG with a displacement filter, no images.
- [ ] Reduced motion removes zoom and slide.

### This demo

- [ ] Wall `#6b2420`, labels `#f3eee3`, gilt `#c29a55`.
- [ ] Title "Weather Indoors · the coast painters, 1900–1960", kicker "The Wren Hall Collection", Room 12.
- [ ] Works: Ostergaard 1912, Halm 1926, Anselm 1958, Vollrath 1934.
- [ ] Panel 380px; title 34px Bodoni Moda italic.
- [ ] Zoom 560ms, return 380ms, expo-out.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: four works on one horizontal centre line, left to right: Low Tide at Varre (gilt), Woman Reading by a Window (walnut with mat), Blue Interval No. 4 (black float frame), Pears and a Stoneware Jug (gilt). Header right reads "Room 12" and "Select a work to read its label".
2. Hovering a painting lifts its frame 2px and deepens the shadow. The cursor is `zoom-in`.
3. Clicking a painting (or Enter/Space on it) opens the detail view. The view fades in over 320ms. The painting animates from its wall position and size to its large size (FLIP, 560ms expo-out). The wall copy is hidden while the big copy is up, so there is only ever one.
4. The panel slides in from 24px right and fades in, 400ms, delayed 120ms. It shows artist, dates, title (34px italic), a definition list (Date, Medium, Size, Credit with accession number), the note, and "N of 4" with Previous and Next.
5. Focus moves to the close button. Tab cycles inside the dialog only.
6. ← and → (or the panel arrows) step to the previous and next work, wrapping. The big painting cross-fades in from 24px on the side it came from (320ms).
7. Esc, the close button, or a click on the dark area outside the painting closes. The painting flies back to its spot on the wall (380ms), the view fades out, and focus returns to that painting.
8. Reduced motion: no FLIP, no slide; the view and panel appear and disappear without transition.

## Tokens

```css
:root {
  --wall: #6b2420;      /* oxblood wall */
  --wall-2: #58201c;    /* wall edges */
  --wall-dk: #2a1210;   /* detail backdrop */
  --floor: #3b2a20;
  --skirt: #4e1c19;
  --gilt: #c29a55;
  --gilt-2: #8a6a33;
  --walnut: #3a271c;
  --black: #16110f;     /* float frame */
  --card: #f3eee3;      /* labels, panel */
  --card-ink: #1f1a17;
  --card-ink-2: #5d544b;
  --card-line: #d8cfbf;
  --ink: #f3e9df;       /* text on wall */
  --ink-2: #d9b9ac;
  --serif: "Bodoni Moda", Didot, Georgia, serif;
  --sans: "Jost", system-ui, sans-serif;
  --expo: cubic-bezier(.16,1,.3,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --panel-w: 380px;
  --placard-w: 88px;
}
```

Frames:

- Gilt: 14px padding, `linear-gradient(135deg, #e2c27f, #c29a55 30%, #8a6a33 55%, #d8b46d 80%, #8a6a33)`, inset rings `2px #6b4f22` and `5px #e9cd8c`, 2px dark slip around the canvas.
- Walnut: 12px, `linear-gradient(160deg, #4a3324, #3a271c 50%, #24170f)`, 14px `#efe7d6` mat.
- Float: 10px `#16110f`, 6px `#0b0908` gap around the canvas.
- All frames: `0 18px 26px -10px #000a, 0 2px 3px #0007`. Big frame: `0 40px 60px -20px #000c`.
- Picture light: brass bar 44% of frame width, 6px tall, 22px above; glow `radial-gradient(50% 55% at 50% 30%, #ffd9a61f, transparent 70%)` on the wall behind.

## Typography

| Role | Family | Size / line | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Kicker | Jost | 11px | 500 | 0.24em, upper | `--ink-2` |
| h1 | Bodoni Moda | 34px / 1.1 | 400 (subtitle italic) | −0.01em | `--ink` |
| Room no. | Jost | 13px | 400 | 0.2em, upper | `--ink-2` |
| Label artist | Jost | 11px / 1.2 | 500 | 0.02em | `--card-ink` |
| Label title | Bodoni Moda italic | 12px / 1.2 | 400 | 0 | `--card-ink` |
| Label meta | Jost | 10px / 1.35 | 400 | 0 | `--card-ink-2` |
| Panel artist | Jost | 15px | 500 | 0.02em | `--card-ink` |
| Panel title h2 | Bodoni Moda italic | 34px / 1.08 | 400 | −0.01em | `--card-ink` |
| Panel dt | Jost | 11px | 400 | 0.14em, upper | `--card-ink-2` |
| Panel dd | Jost | 13px | 400 | 0 | `--card-ink` |
| Note | Bodoni Moda | 16px / 1.6 | 400 | 0, max 34ch | `--card-ink` |

## Implementation notes

**FLIP from the wall.** Render the big copy at its final size, measure both rects, animate the inverse transform away. On close, run it backwards with `fill: forwards`, then hide the dialog.

```js
function flip(fromEl, toEl, back) {
  const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
  const t = `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`;
  return toEl.animate(back ? [{ transform: 'none' }, { transform: t }] : [{ transform: t }, { transform: 'none' }],
    { duration: back ? 380 : 560, easing: 'cubic-bezier(.16,1,.3,1)', fill: back ? 'forwards' : 'none' });
}
// .big must have transform-origin: 0 0
```

**Fit the big painting.** Scale from the SVG's base size into the stage, capped so small works don't blow up into mush.

```js
const pad = frame === 'walnut' ? 52 : frame === 'gilt' ? 28 : 20;   // frame + mat thickness
const k = Math.max(.5, Math.min((stageW - 112 - pad) / w, (stageH - 112 - pad) / h, 3.2));
```

**Painterly SVG.** One filter on each painting's group:

```html
<filter id="paint"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4"/>
  <feDisplacementMap in="SourceGraphic" scale="5"/></filter>
```

Draw shapes 6px past the canvas edge so the displacement never shows a gap.

Common mistakes:

- A generic lightbox with a caption under the image. The label is a separate reading panel beside the work.
- Labels centred under frames. Museums hang them to the right, low.
- Fading the wall copy out while the big copy fades in; it looks like two paintings. Hide the wall copy and move one.
- Letting focus fall back to `body` on close.
- Hanging works top-aligned. Centre them on one eye line.
- Gold gradients that read as yellow plastic: keep the dark `#8a6a33` band and the inset rings.

Rebuild order:

1. Wall, skirting, floor, bench, header.
2. Four SVG paintings with the paint filter; three frame styles.
3. Wall labels and picture lights.
4. Dialog layout with panel.
5. FLIP open and close, focus management, keys.
6. Responsive stacking.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
