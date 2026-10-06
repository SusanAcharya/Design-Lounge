<!-- Design Lounge Nº 216 · "Design-tool transform box" · www.designlounge.live -->

# Design-tool transform box

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The selection box from a design editor, "Kerf", drawn around a poster on a dark dotted canvas. It has eight square resize handles, a round rotate handle on a 28px stem, and an orange badge under the shape that reads the live size, position or angle depending on what you drag. Resizing works in the shape's own rotated frame, so a rotated poster resizes along its edges, not the screen axes. Shift keeps the ratio while resizing, locks the axis while moving, and snaps rotation to 15°. A segmented control swaps the handles for a crosshair variant: plus marks at the corners, a dashed outline and a centre cross. The detail worth copying is the anchor maths: the opposite corner or edge never moves, at any angle.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────┬──────────┐
│ [#] Kerf  Midsummer series / Poster A        [Handles|Crosshair] 100%    │ 48px bar
├───────────────────────────────────────────────────────────────┼──────────┤
│ dotted canvas (24px grid)                                     │ LAYERS   │
│        Poster A · 520 × 600                                   │ ▭ Live…  │
│        ┌──────────────────────────┐                           │ ▯ Solst… │
│        │        o  rotate         │                           ├──────────┤
│        │   ■────■────■            │                           │TRANSFORM │
│        │   │ poster   │           │                           │ X    Y   │
│        │   ■  -4°     ■           │                           │ W    H   │
│        │   │          │           │                           │ R        │
│        │   ■────■────■            │                           │ Shift …  │
│        │     [300 × 380]          │                           ├──────────┤
│        │          (Live set 22:00)│                           │ KEYBOARD │
│        └──────────────────────────┘                           │ dl list  │
│                                                               │  272px   │
└───────────────────────────────────────────────────────────────┴──────────┘
```

- `body` is a grid: `48px minmax(0,1fr)` rows. `header.bar` holds the wordmark, the file path, `div.seg[role=group]` with two `aria-pressed` buttons, and a zoom label.
- `div.work`: a grid `minmax(0,1fr) 272px`.
- `div.canvas` (`position: relative; overflow: hidden; touch-action: none`) holds `.board` (decorative), the layer elements `.obj`, a hover outline, the selection overlay `.sel`, and `.badge`.
- Each `.obj` is a `div[tabindex=0][role=button][aria-roledescription=layer]` with `aria-label` "<name>" or "<name>, selected".
- `.sel` is `aria-hidden`. It holds a `.stem` and nine `span.h` handles with `data-h` = nw, n, ne, e, se, s, sw, w, rot.
- `aside.insp` holds three `.sec` blocks: Layers (`ul` of buttons with `aria-current`), Transform (five labelled inputs and the Shift row), Keyboard (a `dl`).
- A visually hidden `p[role=status][aria-live=polite]` reports the result of each drag or key run.

Geometry model: each layer is `{cx, cy, w, h, r}`, centre in canvas pixels relative to the canvas centre, rotation in degrees. Both the layer and `.sel` are placed with `left = cx - w/2`, `top = cy - h/2`, `width`, `height`, `transform: rotate(r)`.

## Motion

The transform itself is direct manipulation and follows the pointer with no easing. Only small affordances animate.

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Handle square | hover | scale | 1 → 1.3 | 160ms | `--ease` | instant |
| Segment button | press | background, colour | transparent/muted → `--panel-2`/text | 160ms | `--ease` | instant |
| Layer, box, badge | drag or key | left, top, width, height, rotate | follows input | 0 | none | same |
| Shift row | Shift down/up | colour | muted → `--sel` | 0 | — | — |

Do not tween the layer while dragging. Any lag reads as a broken tool.

## States

- **Selected:** 1px solid `--sel` outline on `.sel`, handles visible, badge visible, layer row tinted `rgba(255,107,44,.14)` with `aria-current="true"`.
- **Hover (unselected layer):** 1px outline at 55% opacity, no handles.
- **Moving:** badge shows "x, y". **Resizing:** "W × H". **Rotating:** "N°", and the rotate handle cursor is `grabbing`.
- **Crosshair variant (`.sel.cross`):** outline 1px dashed at 70%; corner handles become 18px plus marks (1.5px strokes), edge handles 10px plus marks, the stem hides, the rotate ring sits 20px above the top edge, and a 14px cross marks the centre.
- **Shift held:** the Shift row and its `kbd` turn `--sel`.
- **Nothing selected:** no box, no badge, empty inspector fields.
- **Focus-visible:** 2px `--sel` outline, 2px offset on buttons and layer rows; inspector fields swap their border to `--sel`. Layers show selection instead of a ring (focus selects).
- **Disabled / error:** a non-number typed in a field is ignored and the field reverts to the real value on the next render.

## Accessibility

- Layers are focusable `role="button"` with `aria-roledescription="layer"`; the selected one's label ends with ", selected".
- Every pointer action has a keyboard equivalent on the focused layer: arrows, Alt + arrows, `[` `]`, Esc. The Keyboard section of the inspector lists them.
- The handles are pointer-only and `aria-hidden`; their keyboard path is the inspector fields and the shortcuts.
- Inspector inputs have `aria-label`s: "X position", "Y position", "Width", "Height", "Rotation in degrees".
- The segmented control is `role="group"` "Selection style" with two `aria-pressed` buttons.
- The live region announces, for example, "Solstice poster: 365 by 463, rotated 24 degrees, at -167, -232." after a drag ends and 500ms after the last key.
- Handle hit areas are 24 × 24 even though the drawn square is 9px.
- Contrast: text on panel 12.6:1, muted on panel 5.9:1, canvas-coloured text on the orange badge 6.8:1.

## Responsive rules

- **≥ 1280:** canvas plus a 272px inspector. Artboard 520 × 600.
- **1024:** same layout; the canvas shrinks. Positions are relative to the canvas centre, so the composition stays centred.
- **< 900:** the inspector hides and the file path hides. The keyboard shortcuts still work.
- **< 640:** the segment labels and the zoom hide (icons stay, with `aria-pressed`). The artboard is 300 × 380, the poster starts at 180 × 240 and the tag at 150 × 40.
- The canvas never scrolls; `overflow: hidden` and `touch-action: none` so a touch drag manipulates instead of panning the page.

## Acceptance checklist

### Always

- [ ] Eight resize handles plus one rotate handle on a stem; handle hit areas are at least 24px.
- [ ] Corner drags keep the opposite corner fixed; edge drags keep the opposite edge fixed, at any rotation.
- [ ] Shift keeps the ratio on resize, locks the axis on move, and snaps rotation to 15°.
- [ ] Alt resizes from the centre. Minimum size is 24 × 24.
- [ ] The badge is upright, under the bounding box, and switches between size, position and angle.
- [ ] Handle cursors rotate with the shape.
- [ ] Inspector fields update live and accept typed values.
- [ ] Keyboard: arrows move, Alt + arrows resize, `[` `]` rotate, Esc deselects; a polite live region reports the result.
- [ ] The crosshair variant keeps every interaction.
- [ ] No transition on the transform during drag.

### This demo

- [ ] Poster "Solstice" 300 × 380 at -4° starts selected; badge reads "300 × 380".
- [ ] Pill "Live set 22:00" 220 × 56 at 6° below it.
- [ ] Canvas `#1a1c20` with `#3a3e46` dots every 24px; artboard `#f3ecdf`, 520 × 600.
- [ ] Selection, handles and badge use `#ff6b2c`; handles fill `#fbfaf7`.
- [ ] Inspector 272px wide on `#22252b`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: a 520 × 600 cream artboard in the centre of the canvas, labelled "Poster A · 520 × 600" above its top-left corner. On it, a blue "Solstice" poster (300 × 380, rotated -4°) is selected and a black pill "Live set 22:00" (220 × 56, rotated 6°) sits below it. The badge under the poster reads "300 × 380".
2. Hover an unselected layer: a 1px orange outline at 55% opacity traces it.
3. Press on a layer: it becomes selected and the drag moves it. The badge reads its top-left position "x, y" while moving. With Shift held, movement locks to the axis with the larger travel.
4. Drag a corner handle: width and height change; the opposite corner stays fixed. The badge reads "W × H". With Shift held, the ratio is kept, using the larger of the two scale factors.
5. Drag an edge handle: only that dimension changes; the opposite edge stays fixed. With Shift, the other dimension scales with it, centred.
6. With Alt held while resizing, the shape resizes from its centre (both sides move).
7. The minimum size is 24 × 24.
8. Drag the rotate handle: the shape turns around its centre following the pointer angle. The badge reads the angle, for example "24°". With Shift, the angle snaps to multiples of 15°. Angles are kept in (-180°, 180°].
9. Handle cursors follow the rotation: each handle's resize cursor is picked from its angle plus the shape's rotation, rounded to 45°.
10. The badge stays upright and sits 12px under the shape's axis-aligned bounding box, centred.
11. The inspector shows X, Y, W, H and R. They update live during drags. Typing a value and pressing Enter (change) applies it. W and H keep the top-left fixed.
12. The "Shift keeps ratio · snaps 15°" row turns orange while Shift is held.
13. The Layers list (Live set tag, Solstice poster) selects a layer on click and moves focus to it.
14. Keyboard on a focused layer: arrows move 1px (Shift 10px). Alt + arrows change width (left/right) and height (up/down). `[` and `]` rotate 1° (Shift 15°). Esc deselects. A polite live region reads the result 500ms after the last key.
15. Click empty canvas or press Esc to deselect: the box and badge hide and the inspector clears.
16. "Crosshair" in the top bar switches the variant. "Handles" switches back. Interaction is identical.

## Tokens

```css
:root {
  /* colour */
  --canvas: #1a1c20;   /* canvas, input wells */
  --panel: #22252b;    /* top bar, inspector */
  --panel-2: #2a2e35;  /* hover rows, pressed segment */
  --line: #33373f;     /* hairlines, input borders */
  --text: #e8e6e1;     /* primary text */
  --muted: #9aa0a9;    /* labels, secondary text */
  --sel: #ff6b2c;      /* selection outline, handle stroke, badge, focus */
  --handle: #fbfaf7;   /* handle fill */
  --dot: #3a3e46;      /* canvas grid dots */
  --board: #f3ecdf;    /* artboard */

  /* type */
  --sans: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;

  /* space */
  --s-2: 8px; --s-3: 12px; --s-4: 16px;

  /* geometry */
  --handle-size: 9px;      /* visible square, 1.5px stroke, 2px radius */
  --handle-hit: 24px;      /* invisible hit area */
  --rot-stem: 28px;
  --rot-size: 11px;
  --min-size: 24px;
  --grid: 24px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t: 160ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Wordmark | Bricolage Grotesque | 17px | 800 | 1 | -0.02em | title |
| File path | Bricolage Grotesque | 13px | 400, file 600 | 1.4 | 0 | sentence |
| Segment | Bricolage Grotesque | 12px | 600 | 1 | 0 | title |
| Section label | Bricolage Grotesque | 11px | 600 | 1 | 0.08em | UPPER |
| Layer row | Bricolage Grotesque | 13px | 400 | 1.4 | 0 | sentence |
| Field label, value | JetBrains Mono | 11px / 12px | 500 | 1 | 0 | X Y W H R |
| Badge | JetBrains Mono | 11px | 500 | 1 | 0 | `300 × 380` with a real × |
| Artboard label, zoom | JetBrains Mono | 11px / 12px | 500 | 1 | 0 | as written |

Every number is mono. Labels and names are the grotesk.

## Implementation notes

**Resize in local space, then move the centre.** Convert the pointer delta into the shape's frame, grow the size on the dragged side, and shift the centre by half the growth rotated back into canvas space. `sx`, `sy` are -1, 0 or 1 for the handle.

```js
const c = Math.cos(-r0), s = Math.sin(-r0);          // r0 in radians
const lx = dx * c - dy * s, ly = dx * s + dy * c;    // pointer delta in local axes
const m = e.altKey ? 2 : 1;
let w = w0 + sx * lx * m, h = h0 + sy * ly * m;
if (e.shiftKey) {
  let k = sx && sy ? Math.max(w / w0, h / h0) : sx ? w / w0 : h / h0;
  k = Math.max(k, 24 / Math.min(w0, h0)); w = w0 * k; h = h0 * k;
} else { w = Math.max(24, w); h = Math.max(24, h); }
const ox = e.altKey ? 0 : sx * (w - w0) / 2, oy = e.altKey ? 0 : sy * (h - h0) / 2;
cx = cx0 + ox * Math.cos(r0) - oy * Math.sin(r0);
cy = cy0 + ox * Math.sin(r0) + oy * Math.cos(r0);
```

The common bug is adding the screen delta straight to width. It works at 0° and goes wrong at every other angle.

**Rotate by angle difference, not absolute angle.** Store the pointer's angle around the centre at pointerdown and add the change, so the shape does not jump to where the handle "should" be.

```js
const a = Math.atan2(p.y - cy, p.x - cx);
let r = r0deg + (a - a0) * 180 / Math.PI;
if (e.shiftKey) r = Math.round(r / 15) * 15;
r = ((r + 180) % 360 + 360) % 360 - 180;
```

**Keep the badge upright.** Do not put it inside the rotated box. Compute the half-height of the axis-aligned bounds and place it in canvas space:

```js
const hh = (Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad))) / 2;
badge.style.left = (originX + cx) + 'px';
badge.style.top = (originY + cy + hh + 12) + 'px';  // translateX(-50%) in CSS
```

**Cursors:** `['ns-resize','nesw-resize','ew-resize','nwse-resize'][round((handleAngle + r) / 45) mod 4]`, with n = 0°, ne = 45°, e = 90° and so on clockwise.

**Capture the pointer on the canvas**, not the handle, so fast drags that leave the 24px handle keep working. Call `preventDefault` on pointerdown to stop text selection.

Common mistakes:

- Scaling the layer with `transform: scale()`. Text and strokes stretch, and the handles scale too. Change width and height.
- Rotating the badge with the shape, so it reads upside down at 180°.
- Hit areas the size of the 9px square.
- Easing the drag "for smoothness".
- Forgetting Alt and the 24px minimum, so a shape can be flipped inside out.
- Making handles focusable tab stops. Nine stops per shape is a trap; use the shortcuts and the fields.

Rebuild order:

1. The bar, the canvas with dots, the artboard and the inspector.
2. The `{cx, cy, w, h, r}` model and a `place()` function shared by layers and the box.
3. Select and move, with the hover outline.
4. Handles, local-space resize, Shift and Alt.
5. Rotate handle with snapping, then cursors.
6. Badge modes, inspector sync, typed values.
7. Keyboard shortcuts and the live region, then the crosshair variant and breakpoints.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
