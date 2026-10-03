---
title: "Graph paper background"
summary: "Engineering graph paper on a true 1 mm grid with rulers, a snapping pointer crosshair, a live X/Y readout in millimetres, and paper or blueprint sheets."
platform: web
type: pattern
category: backgrounds
tags: [background, grid, crosshair, blueprint, engineering]
styles: [industrial, paper, swiss]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#F1EEE3", "#9DBCB5", "#1F2A2E", "#C8412B", "#163E72"]
fonts: ["Big Shoulders Display", "Red Hat Mono"]
related: [background-topographic-lines, background-paper-grain]
---

# Graph paper background

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A full-frame engineering graph-paper background behind a short landing section for a fictional machine shop, "Ferrule Works". The sheet is drawn entirely with CSS gradients: a minor line every 8px (one millimetre) and a major line every 40px (five millimetres), with a top and left ruler labelled every 10 mm. A red crosshair follows the pointer, snaps to the millimetre grid, and a small dark tag beside it reads `X 135.0  Y 055.0 mm`. The detail worth copying is that **the grid, the rulers, the readout and the technical drawing all share one scale**: the bracket drawn on the right is dimensioned 40.0 × 35.0, and it really is 40 × 35 squares, so hovering its corners gives the same numbers as its dimension lines. A floating control switches between a cream paper sheet and a blueprint sheet, and toggles snapping and the crosshair.

## Reference behaviour

1. First frame: cream paper sheet, rulers on top and left, the crosshair already parked on the bottom-right corner of the drawn bracket at X 135.0, Y 055.0 mm. Its readout tag sits to the right of the corner. Nothing animates until the user moves.
2. Moving the pointer anywhere moves the horizontal and vertical crosshair lines, a 5px triangle marker on each ruler, and the readout tag. Updates are batched with `requestAnimationFrame`, so one transform write per frame.
3. With "Snap 1 mm" on (default), the crosshair lands only on minor grid lines and the readout shows whole millimetres (`047.0`). With snap off, it follows the raw pointer and shows tenths (`047.4`).
4. The readout tag sits 14px right and 12px below the crosshair; it flips to the left when it would cross the right edge minus 16px, and above when within 40px of the bottom.
5. The origin is the inner corner of the rulers at (24, 24). Coordinates never go negative; the crosshair clamps to the origin when the pointer is over the rulers.
6. "Paper" / "Blueprint" swap every sheet colour in 420ms. Colours are registered custom properties (`@property`), so the gradient lines themselves cross-fade instead of popping.
7. "Crosshair" hides the two lines, the readout and the ruler markers; `aria-pressed` follows.
8. The sheet is focusable (first in tab order). With it focused, arrow keys move the crosshair by 1 mm, Shift+arrow by 5 mm, and a polite live region reads "X 047.0, Y 060.0 millimetres".
9. Nav-level links and buttons over the sheet have a 160ms colour swap on hover and a 2px accent focus ring.
10. Reduced motion: the sheet swap is instant. The crosshair still follows the pointer, because it is direct manipulation with no easing.

## Structure

```
1280 × 800
┌──┬──────────────────────────────────────────────────────────────────────┐
│mm│ 10   20   30   40 …  ruler 24px, labels every 80px (10 mm)  ▼ marker │
├──┼──────────────────────────────────────────────────────────────────────┤
│10│                                         [Paper|Blueprint|Snap|Cross] │ panel top 40 right 40
│  │  FERRULE WORKS · DRAWING 0412-C        ┌──6.0──┐                      │
│20│  BRACKETS DRAWN TO A                    │       │  drawing 440×400     │
│  │  TENTH, CUT IN                          │       │  at (744,144)        │
│30│  NINE DAYS.          92px              │       └───────────┐          │
│  │  sub 14px mono, max 440                 └───────40.0───────┘          │
│40│  [Upload a drawing ↑] [Read the tolerance sheet]                       │
│  │  ─────────────────────────────           ┌ title block 336 wide ┐     │
│50│  TOLERANCE  MEDIAN LEAD  STOCK ALLOYS     │ Part / Rev / Scale … │     │
│  │  ±0.05 mm   9 days       14               └──────────────────────┘     │
└──┴──────────────────────────────────────────────────────────────────────┘
   crosshair: 1px lines full width/height, z-index between sheet and copy
```

- `body` carries the grid as four `linear-gradient` layers.
- `.sheet` (`role="application"`, `tabindex="0"`) is a fixed layer from (24,24) to the corner; it receives the arrow keys.
- `.ruler.top`, `.ruler.left`, `.corner` are fixed opaque bands drawn above everything except the panel; numbers are `<span>`s generated on load and resize.
- `.ch.h`, `.ch.v` are 1px fixed divs moved with `transform`. `.readout` is a fixed tag.
- `.copy` is a `<section>` with the kicker, `<h1>`, sub, two links and a `<dl class="specs">`.
- `.drawing` is an inline `<svg role="img">` with an `aria-label` describing the part. `.block` is a `<dl>` title block.
- `.panel` is a `role="group"` with a segmented pair of `aria-pressed` buttons and two toggle buttons.

## Tokens

```css
@property --paper  { syntax: '<color>'; inherits: true; initial-value: #f1eee3; }
@property --minor  { syntax: '<color>'; inherits: true; initial-value: #d5e1dc; }
@property --major  { syntax: '<color>'; inherits: true; initial-value: #9dbcb5; }
@property --ink    { syntax: '<color>'; inherits: true; initial-value: #1f2a2e; }
@property --accent { syntax: '<color>'; inherits: true; initial-value: #c8412b; }

:root {
  /* paper sheet */
  --paper: #f1eee3;      /* sheet */
  --minor: #d5e1dc;      /* 1 mm lines */
  --major: #9dbcb5;      /* 5 mm lines, ruler borders */
  --ink: #1f2a2e;        /* type, drawing strokes, readout bg */
  --ink-2: #4a585c;      /* sub-copy, labels, ruler numbers */
  --accent: #c8412b;     /* crosshair, markers, accent words, primary */
  --on-accent: #fff8f0;

  --display: "Big Shoulders Display", Impact, sans-serif;
  --mono: "Red Hat Mono", ui-monospace, monospace;

  --o: 24px;             /* origin = ruler thickness */
  --mm: 8px;             /* one minor square */
  --maj: 40px;           /* one major square, 5 mm */

  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-fast: 160ms;
  --t-sheet: 420ms;
}

:root[data-sheet="blueprint"] {
  --paper: #163e72; --minor: #2a5487; --major: #4f78aa;
  --ink: #eaf1fb; --ink-2: #b4c6e0; --accent: #f2c14e; --on-accent: #1a2a44;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Headline | Big Shoulders Display | 92px | 800 | 0.9 | −0.005em | UPPER |
| Spec value | Big Shoulders Display | 30px | 700 | 1 | 0 | as written, tabular |
| Kicker | Red Hat Mono | 11px | 600 | 1 | 0.14em | UPPER |
| Sub-copy | Red Hat Mono | 14px | 400 | 1.6 | 0 | sentence |
| Buttons | Red Hat Mono | 13px | 600 | 1 | 0 | sentence |
| Readout | Red Hat Mono | 11px | 500 | 1 | 0.02em | tabular numerals |
| Ruler numbers | Red Hat Mono | 9px | 500 | 1 | 0 | numerals |
| Drawing labels | Red Hat Mono | 11px | 500 | 1 | 0 | as written |
| Title block label | Red Hat Mono | 9px | 500 | 1 | 0.12em | UPPER |

Readout numbers are zero-padded to five characters (`047.0`) so the tag never changes width while moving.

## Motion

| Thing | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Crosshair lines, markers, readout | pointermove / arrow keys | `transform` | previous → new position | next frame | none (direct) | same |
| Sheet colours | Paper/Blueprint click | `--paper --minor --major --ink --accent` | paper ↔ blueprint | 420ms | `--ease` | instant |
| Buttons | hover | background, colour | resting → inverted | 160ms | `--ease` | 1ms |

There is no idle animation. The page is static until touched.

## States

- **Snap on (default):** readout whole millimetres, lines sit exactly on minor lines. `aria-pressed="true"`.
- **Snap off:** readout shows tenths; lines follow the pointer pixel.
- **Crosshair off:** lines, tag and ruler markers `visibility: hidden`; the toggle reads `aria-pressed="false"`.
- **Paper (default) / Blueprint:** exactly one pressed; the pressed one shows a filled accent dot and a 16% light tint.
- **Panel button hover:** opacity .7 → 1. **Focus-visible:** 2px accent outline, offset −2px inside the dark panel, 3px elsewhere.
- **Sheet focused:** 2px accent outline inset 6px from the sheet edge, so the user sees that arrows will work.
- **Primary hover:** accent → ink fill.

## Accessibility

- Grid, rulers, crosshair and readout are decorative (`aria-hidden="true"`).
- The sheet is `role="application"` with the label "Graph sheet. Arrow keys move the crosshair by 1 millimetre, Shift moves 5." Arrow keys call `preventDefault` only when the sheet is focused.
- A visually hidden `aria-live="polite"` paragraph is updated only on key moves, not on pointer moves, so screen readers are not flooded.
- The drawing is `role="img"` with a full sentence label including the dimensions.
- Tab order: sheet → Upload → Tolerance sheet → Paper → Blueprint → Snap → Crosshair.
- Contrast: `#1f2a2e` on `#f1eee3` is 13:1; `#4a585c` sub-copy is 6.4:1; blueprint `#b4c6e0` on `#163e72` is 6.1:1. The sub-copy sits on a 70% paper tint so grid lines never cross the glyphs at full strength.
- All panel buttons are 32px tall within a 44px-high panel; on touch layouts they expand to the full panel row height.

## Responsive rules

- ≥ 1280: as specified. Ruler labels are regenerated on resize to fill the width and height.
- 1100–1279: unchanged except the title block may touch the panel's column; keep 40px gutters.
- < 1100: hide the drawing and the title block; the copy column grows to `right: 40px`.
- < 640: copy at `left: 40px; top: 96px`, headline 56px, buttons wrap, specs become three equal columns at 22px. The panel docks to the bottom (`left: 40px; right: 16px; bottom: 16px`), drops the separator and dots, text 11px.
- Never scale `--mm`. One square is always 8 CSS px; the grid only gains or loses squares.

## Acceptance checklist

### Always

- [ ] Minor lines every 8px and major lines every 40px, both starting at the ruler origin (24, 24).
- [ ] Rulers are opaque, 24px thick, with a tick per millimetre, a longer tick per 5 mm, and a number per 10 mm.
- [ ] The crosshair is two 1px lines moved only with `transform`, inside one `requestAnimationFrame` per frame.
- [ ] Readout values are zero-padded and tabular, so the tag width is stable.
- [ ] The readout flips sides near the right and bottom edges.
- [ ] Snap on lands exactly on minor lines; snap off shows tenths.
- [ ] Sheet colours cross-fade through registered custom properties, instant under reduced motion.
- [ ] Arrow keys on the focused sheet move 1 mm, Shift 5 mm, with a polite announcement.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] First frame crosshair at X 135.0, Y 055.0 mm, the bracket's lower-right corner.
- [ ] Headline "Brackets drawn to a tenth, cut in nine days." with the last clause in `#c8412b`.
- [ ] The bracket's dimension lines read 40.0, 35.0 and 6.0, matching the grid squares they span.
- [ ] Title block: Kestrel bracket, left hand · Rev C · Scale 1 : 1 · 6061-T6 · R. Okafor.
- [ ] Blueprint sheet is `#163e72` with an amber `#f2c14e` crosshair.

## Implementation notes

**The grid is four gradients on one element.** Majors first so they paint above minors:

```css
body {
  background-color: var(--paper);
  background-image:
    linear-gradient(var(--major) 1px, transparent 1px),
    linear-gradient(90deg, var(--major) 1px, transparent 1px),
    linear-gradient(var(--minor) 1px, transparent 1px),
    linear-gradient(90deg, var(--minor) 1px, transparent 1px);
  background-size: var(--maj) var(--maj), var(--maj) var(--maj), var(--mm) var(--mm), var(--mm) var(--mm);
  background-position: var(--o) var(--o);
  transition: --paper var(--t-sheet) var(--ease), --minor var(--t-sheet) var(--ease),
              --major var(--t-sheet) var(--ease), --ink var(--t-sheet) var(--ease);
}
```

Without the `@property` registrations the transition does nothing, because unregistered custom properties are strings and swap at the midpoint.

**Snap and readout in one function.** Keep raw pointer values and snap only when drawing, so toggling snap never loses the position:

```js
const O = 24, MM = 8;
function draw() {
  raf = 0;
  let px = x, py = y;
  if (snap) { px = O + Math.round((px - O) / MM) * MM; py = O + Math.round((py - O) / MM) * MM; }
  px = Math.max(O, px); py = Math.max(O, py);
  chh.style.transform = `translateY(${py}px)`;
  chv.style.transform = `translateX(${px}px)`;
  rx.textContent = ((px - O) / MM).toFixed(1).padStart(5, '0');
  ry.textContent = ((py - O) / MM).toFixed(1).padStart(5, '0');
}
addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(draw); }, { passive: true });
```

**Ruler ticks are gradients too**, positioned at the same origin so they line up with the sheet; only the numbers are DOM:

```css
.ruler.top {
  background-image: linear-gradient(90deg, var(--ink-2) 1px, transparent 1px),
                    linear-gradient(90deg, var(--major) 1px, transparent 1px);
  background-size: var(--maj) 9px, var(--mm) 5px;
  background-position: var(--o) 100%;
  background-repeat: repeat-x;
}
```

Common mistakes:

- Drawing the grid on a canvas and redrawing it on every pointer move. The grid never changes; only two 1px divs move.
- Using `top`/`left` for the crosshair, which triggers layout every frame. Use `transform`.
- Grid lines that start at 0,0 while the rulers start at 24: the readout is then off by three squares.
- Dimension labels that do not match the squares. The whole point of the sheet is that it measures.
- A readout that jitters in width because numbers are not padded or tabular.
- Announcing every pointer move to screen readers.
- Putting the crosshair above the copy. It sits under the text and buttons so it never hides a word.
