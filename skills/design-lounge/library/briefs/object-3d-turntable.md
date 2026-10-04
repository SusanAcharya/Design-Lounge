<!-- Design Lounge Nº 287 · "Kraft box 3D turntable" · designlounge.vercel.app -->

# Kraft box 3D turntable

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. Use CSS 3D transforms only. No WebGL, no three.js, no model files, no images.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The product viewer on a coffee roaster's product page. Fieldwork Coffee Co. sells Box No. 07, a 250 g single-origin coffee in a kraft paper box. The box is six `div` faces in a `preserve-3d` container, each printed with CSS and inline SVG: a big condensed wordmark, an orange roast stamp, tasting notes, a barcode, a brew guide, a farm sketch, and orange tape on the lid. The user drags the box to spin it, lets go, and it coasts and settles on the nearest face. The detail worth copying is the rest pose: every snapped view sits 24° off square, so a sliver of the next face always shows and the object never flattens into a rectangle.

## Structure

```
1280 × 800
┌─────────────────────────────────────────────────────────────────────┐
│ FIELDWORK COFFEE CO.  Single origin  Subscriptions  Brew gear  Roastery   Bag (0) │ 64px, 1px rule
├───────────────────────┬─────────────────────────────────────────────┤
│ Single origin / Box No. 07 │                    ↔ Drag to turn · arrow keys │
│ HUILA                 │                                             │
│ WASHED   (84px)       │              ┌────────┐┐                     │
│ La Esperanza, Huila … │              │ FIELD  ││  box 240×320×140    │
│ ───────────────────── │              │ WORK  ◯││  perspective 1400px │
│ Tastes like   …       │              └────────┘┘                     │
│ Roast         …       │               (shadow)                      │
│ Roasted       …       │                                             │
│ Weight        …       │     [■ FRONT | SIDE | BACK ]  Front · 000°  │
│ $24 / box  [ADD TO BAG]│                                             │
└───────────────────────┴─────────────────────────────────────────────┘
  400px column, 48px left pad   1fr stage column, 1px left rule
```

- `header.top`: brand link, a `nav` labelled "Shop" with four links, the bag link.
- `main.wrap`: a two-column grid, `400px 1fr`, height `calc(100% - 64px)`.
- `section.info`: crumb `p`, the only `h1`, origin `p`, a `ul` of four spec rows, and the price with the add `button`.
- `section.stagecol` labelled "Product viewer": the hint, `#stage`, the controls row, and a visually hidden live region.
- `#stage` is `role="slider"`, `tabindex="0"`, labelled "Turn the box", `touch-action: none`.
- Inside the stage: `.scale` (for phone scaling) > `.shadow` + `.box` > six `.face` divs. The whole `.scale` is `aria-hidden`.
- Controls: a `div role="group"` labelled "Jump to view" with three `button`s, then the readout `p`.

Face sizes and placement (box is W 240, H 320, D 140; the `.box` itself is 0 × 0 at the stage centre):

| Face | Size | Transform | Print |
| --- | --- | --- | --- |
| Front | 240 × 320 | `translateZ(70px)` | "No. 07 — Single origin", FIELD/WORK 70px, orange stamp, "Huila · Colombia / 250 g" |
| Back | 240 × 320 | `rotateY(180deg) translateZ(70px)` | "Pour over", five numbered brew steps |
| Right | 140 × 320 | `rotateY(90deg) translateZ(120px)` | "Tasting notes", three notes, 5-step roast bar, barcode |
| Left | 140 × 320 | `rotateY(-90deg) translateZ(120px)` | "The farm", ridge sketch SVG, farm facts, harvest |
| Top | 240 × 140 | `rotateX(90deg) translateZ(160px)` | orange tape band "This side up" with two arrows |
| Bottom | 240 × 140 | `rotateX(-90deg) translateZ(160px)` | "Paper 100% · please recycle" |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Box yaw | drag | rotateY | follows pointer, 0.5°/px | live | none | same |
| Box pitch | drag | rotateX | follows pointer, 0.25°/px, -34° to 6° | live | none | same |
| Coast + snap | release | rotateY | current → nearest 90° past coast | about 500 to 900ms | spring k 0.06, damp 0.8 | instant snap |
| Pitch return | release | rotateX | current → -14° | about 400ms | spring k 0.08, damp 0.78 | instant |
| View buttons | click | rotateY | current → target, short way | about 600ms | spring | instant |
| Arrow keys | keydown | rotateY | target ± 90° | about 600ms | spring | instant |
| Face shading | any turn | overlay opacity | 0 → 0.42 | live | cosine of angle | same |
| Shadow | any turn or tilt | scale, blur, opacity | see behaviour 9 | live | none | same |
| Buttons | hover | background | paper → paper-2 | 160ms | `--ease` | instant |

- The spring settles when the yaw error and velocity are both under 0.05°. Then set the exact target, so angles never drift.
- Velocity is in degrees per 16ms frame: `v = v * 0.4 + (dx * 0.5 / dt * 16) * 0.6`. This smooths jittery pointer events.
- Cancel any running spring on `pointerdown`. A grab always wins.

## States

- Resting on a face: one view button pressed, ink fill, paper text, a 6px orange square before the label.
- Resting on the left side: "Side" is pressed and the readout says "Left side".
- Dragging: cursor `grabbing`. No other visual change. The box is the feedback.
- Settling: the readout and pressed button already show the landing face once it is nearest.
- View button hover: background `--paper-2`.
- Add to bag: `aria-pressed="false"`, ink fill. Pressed: orange fill, ink text, label "In your bag", header "Bag (1)".
- Focus-visible: `outline: 2px solid #e4571b; outline-offset: 3px`. On the stage the outline is inset by 12px (`outline-offset: -12px`), so it frames the box inside the column.
- No disabled or loading state. The box is pure markup and is ready on the first frame.

## Accessibility

- `#stage` is `role="slider"` with `aria-valuemin="0"`, `aria-valuemax="270"`, `aria-valuenow` in steps of 90, and `aria-valuetext` set to the face name ("Front", "Right side", "Back", "Left side").
- Keys on the stage: Right and Down turn to the next face to the right. Left and Up turn back. Home returns to Front. Prevent default so the page does not scroll.
- The view buttons are a labelled group with `aria-pressed`. They are the main path for keyboard and switch users.
- The six faces are `aria-hidden`. Their facts are repeated in the info column, so nothing printed on the box is only on the box.
- A visually hidden `aria-live="polite"` paragraph announces "Showing <face>" when the box settles. Do not announce every degree while dragging.
- Focus order: brand, nav links, bag, add to bag, stage, Front, Side, Back.
- Contrast: `#1b1611` on `#ede4d3` is about 15:1. `#5a4e40` on `#ede4d3` is about 6.8:1. The print on kraft (`#1b1611` on `#c69c6d`) is about 8:1.
- Hit targets: view buttons 88 × 44px, add button 52px tall.

## Responsive rules

- ≥1280: as drawn. Two columns, box at full size.
- 1024: keep two columns. The info column stays 400px. The box stays 240 × 320.
- 768 and below (`max-width: 900px`): one column. The stage column moves on top, 500px tall, with a bottom rule instead of a left rule. Scale the box with `.scale { --s: .74 }`. The controls stack: buttons, then the readout. The nav links hide. The product name drops to 60px. The page scrolls vertically.
- Under 640: keep `--s: .74`. Do not shrink the view buttons below 44px tall. The hint stays at the top right of the stage.
- Touch: `touch-action: none` on the stage only, so the page still scrolls when the finger starts outside the box area.
- Never let the 3D box overflow sideways. The stage column has `overflow-x` clipped by the body and the box fits inside 390px at 0.74.

## Acceptance checklist

### Always

- [ ] The object is six CSS faces in a `transform-style: preserve-3d` parent, `backface-visibility: hidden` on each face.
- [ ] Drag turns it, release coasts with friction 0.92 and lands on a multiple of 90°.
- [ ] Every rest pose keeps a 24° presentation offset so two faces show.
- [ ] Arrow keys turn 90° per press on the focused stage; Home returns to the front.
- [ ] Front, Side, Back buttons take the short way and show `aria-pressed` on the current face.
- [ ] The contact shadow width follows the footprint and grows softer as tilt grows.
- [ ] Faces shade by angle; the shading is an overlay, not a filter on the face.
- [ ] Reduced motion removes coast and spring; snaps are instant.
- [ ] A live region announces the face after it settles.
- [ ] No horizontal overflow at 390 or 1280.

### This demo

- [ ] The box is 240 × 320 × 140px in kraft `#c69c6d`, pitched -14° at rest, with 1400px perspective.
- [ ] The front reads "FIELD WORK" at 70px with an orange `#e4571b` stamp "ROASTED 21.09 · BATCH 114".
- [ ] The product name is "Huila Washed" at 84px; the price reads "$24 / box".
- [ ] The readout reads "Front · 000°" on load and "Right side · 090°" after one Right arrow.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the box shows its front at rest. It is pitched -14° (seen slightly from above) and turned 24° so the right side shows as a narrow face. The "Front" button is pressed. The readout reads "Front · 000°".
2. Press on the stage and drag left or right. The box turns 0.5° per pixel of horizontal drag. Vertical drag tilts it 0.25° per pixel, clamped from -34° (looking down) to +6°. The cursor is `grabbing`.
3. While dragging, the readout updates live with the face name nearest the viewer and the angle 000° to 359°. The pressed button follows the nearest face.
4. Release. The box keeps the release velocity, coasts, and lands on the nearest multiple of 90° along its path. The coast distance is the velocity × 0.92 / 0.08 (a friction of 0.92 per frame), clamped to ±270°. A spring brings it to rest: stiffness 0.06, damping 0.8 per frame for yaw; stiffness 0.08, damping 0.78 for pitch, which springs back to -14°.
5. A slow drag with no flick snaps to the nearest face within about 600ms.
6. Click Front, Side or Back. The box turns the short way to that face with the same spring. Side shows the right side.
7. Focus the stage (Tab) and press Right or Down arrow: the box turns 90° to show the next face to the right. Left or Up arrow: 90° the other way. Home: back to Front. Key presses stack. Two quick presses turn 180°.
8. When the box settles, a polite live region says "Showing Back" (or the face name).
9. The contact shadow is an ellipse under the box. Its width follows the box footprint (front width × |cos| + depth × |sin| of the turn). As the tilt grows it gets taller (scaleY 0.7 to 1.6), softer (blur 4px to 12px) and lighter (opacity 0.95 to 0.6).
10. The faces shade as they turn: a face is darkest (42% brown overlay) when it faces away from a light 35° to the left, and clear when it faces it.
11. "Add to bag" toggles to "In your bag" in orange, and the header reads "Bag (1)".
12. With `prefers-reduced-motion: reduce` there is no coast and no spring. Release, buttons and arrow keys set the angle instantly. Dragging still follows the pointer directly.

## Tokens

```css
:root {
  /* colour */
  --paper: #ede4d3;       /* page */
  --paper-2: #e4d8c3;     /* button hover */
  --kraft: #c69c6d;       /* box faces */
  --kraft-top: #cfa778;   /* lid, slightly lighter */
  --kraft-dark: #a87d50;  /* bottom face */
  --ink: #1b1611;         /* print, text, primary button */
  --ink-2: #5a4e40;       /* secondary text */
  --rule: rgba(27, 22, 17, .16);
  --orange: #e4571b;      /* stamp, tape, roast bar, pressed dot, focus */
  --focus: #e4571b;
  --shade-ink: #2a1a0a;   /* face shading overlay */

  /* type */
  --cond: "Barlow Condensed", "Arial Narrow", sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;

  /* box */
  --W: 240px; --H: 320px; --D: 140px;
  --perspective: 1400px;
  --rest-pitch: -14deg;
  --rest-offset: -24deg;

  /* space */
  --s-1: 8px; --s-2: 16px; --s-3: 24px; --s-4: 40px; --s-5: 48px; --s-6: 56px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-micro: 160ms;
  --drag-yaw: .5;      /* deg per px */
  --drag-pitch: .25;   /* deg per px */
  --friction: .92;
  --spring-k: .06;
  --spring-damp: .8;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Brand | Barlow Condensed | 20px | 800 | 1 | 0.08em | upper |
| Nav, bag | DM Mono | 13px | 400 | 1.5 | 0 | sentence |
| Crumb | DM Mono | 12px | 400 | 1.5 | 0.06em | sentence |
| Product name | Barlow Condensed | 84px | 800 | 0.86 | -0.01em | upper |
| Spec rows | DM Mono | 13px | 400 | 1.5 | 0 | sentence |
| Price | Barlow Condensed | 40px | 700 | 1 | 0 | — |
| Add button | Barlow Condensed | 18px | 700 | 1 | 0.08em | upper |
| View buttons | Barlow Condensed | 15px | 700 | 1 | 0.12em | upper |
| Readout | DM Mono | 12px | 400 / 500 name | 1.5 | 0 | as written |
| Box wordmark | Barlow Condensed | 70px | 800 | 0.82 | -0.01em | upper |
| Box labels | DM Mono | 9px | 500 | 1.3 | 0.12em | upper |
| Box side heads | Barlow Condensed | 20px | 700 | 1 | 0.02em | upper |
| Box body | DM Mono | 10 to 10.5px | 400 | 1.45 | 0 | sentence |

Every printed face uses a 1.5px ink frame inset 10px from the edge. That frame makes it read as printed packaging.

## Implementation notes

### 1. Coast, snap and spring

Do the physics in JS with plain numbers. Do not use CSS transitions for the snap; a transition cannot inherit the release velocity.

```js
function release() {
  dragging = false;
  if (reduce.matches) { target = Math.round(yaw / 90) * 90; return settle(); }
  const coast = Math.max(-270, Math.min(270, vYaw * 0.92 / 0.08));
  target = Math.round((yaw + coast) / 90) * 90;
  settle();
}
function step() {
  vYaw = (vYaw + (target - yaw) * 0.06) * 0.8;
  vPitch = (vPitch + (REST_PITCH - pitch) * 0.08) * 0.78;
  yaw += vYaw; pitch += vPitch;
  if (Math.abs(target - yaw) < .05 && Math.abs(vYaw) < .05 && Math.abs(REST_PITCH - pitch) < .05) {
    yaw = target; pitch = REST_PITCH; render(); announce(); return;
  }
  render();
  raf = requestAnimationFrame(step);
}
```

Keep `yaw` unbounded. Wrapping it to 0..360 makes the spring take the long way round. For the readout use `((Math.round(-yaw) % 360) + 360) % 360`, and for the face `((Math.round(-yaw / 90) % 4) + 4) % 4`.

### 2. Render: offset, shading, shadow

```js
function render() {
  const shown = yaw + OFFSET;               // OFFSET = -24
  box.style.transform = `rotateX(${pitch}deg) rotateY(${shown}deg)`;
  for (const f of faces) {                   // data-a = 0, 90, 180, -90
    const a = rad(shown + Number(f.dataset.a) + 35);
    f.style.setProperty('--shade', 0.42 - 0.42 * Math.max(0, Math.cos(a)));
  }
  const foot = Math.abs(240 * Math.cos(rad(shown))) + Math.abs(140 * Math.sin(rad(shown)));
  const tilt = Math.min(1, Math.abs(pitch) / 40);
  shadow.style.setProperty('--sx', foot / 240 * (0.92 + tilt * 0.2));
  shadow.style.setProperty('--sy', 0.7 + tilt * 0.9);
  shadow.style.setProperty('--so', 0.95 - tilt * 0.35);
  shadow.style.setProperty('--sb', 4 + tilt * 8 + 'px');
}
```

The shadow lives inside `.scale` but outside `.box`, so it scales with the box on phones and never rotates with it.

### 3. Faces and kraft print

```css
.box { position: relative; width: 0; height: 0; transform-style: preserve-3d; }
.face {
  position: absolute; left: 0; top: 0; overflow: hidden; backface-visibility: hidden;
  background-color: var(--kraft);
  background-image:
    radial-gradient(rgba(70,40,12,.10) .8px, transparent .9px),
    radial-gradient(rgba(255,240,215,.10) .8px, transparent .9px);
  background-size: 5px 5px, 7px 7px;
  background-position: 0 0, 2px 3px;
}
.face::after { content: ""; position: absolute; inset: 0; background: var(--shade-ink); opacity: var(--shade, 0); }
.f-front { width: var(--W); height: var(--H); margin: calc(var(--H) / -2) 0 0 calc(var(--W) / -2);
           transform: translateZ(calc(var(--D) / 2)); }
.f-right { width: var(--D); height: var(--H); margin: calc(var(--H) / -2) 0 0 calc(var(--D) / -2);
           transform: rotateY(90deg) translateZ(calc(var(--W) / 2)); }
.f-top .tape { transform: rotate(180deg); }   /* reads upright from the front */
.bars { height: 44px; background: repeating-linear-gradient(90deg,
  var(--ink) 0 2px, transparent 2px 4px, var(--ink) 4px 5px, transparent 5px 8px,
  var(--ink) 8px 11px, transparent 11px 12px); }
```

Common mistakes:

- Putting `perspective` on the `.box`. It goes on the stage, the parent of the rotating element.
- Rotating the faces' parent with `transform: rotate3d` from a CSS transition. Inertia needs JS.
- Snapping to a square front. The 24° offset is the look.
- Forgetting `backface-visibility: hidden`. The back print shows through mirrored.
- Drop shadows on the faces. Shading is an overlay that follows the angle; the only shadow is the contact ellipse.
- Gradients that pretend to be cardboard. Kraft is a flat `#c69c6d` with two tiny dot fields.
- Announcing angles to screen readers on every pointer move.
- A second accent colour. Orange `#e4571b` is the only one, on the stamp, tape, roast bar and pressed dot.
- Using `touch-action: none` on the body. Phones then cannot scroll the product page.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
