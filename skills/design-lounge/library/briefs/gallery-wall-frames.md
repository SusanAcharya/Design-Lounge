<!-- Design Lounge Nº 389 · "Salon wall planner" · designlounge.vercel.app -->

# Salon wall planner

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A gallery-wall planner for a home décor app called Hangline. A sage plaster wall, drawn to scale (900×600px = 450×300 cm), holds seven framed prints in a salon cluster above a rust sofa, with a floor lamp at the right. Each frame hangs from a visible wire and nail. You pick a frame up and drag it. A dotted 10 cm grid fades in, and a dashed outline shows where it will land. The frame tilts with your hand while it moves. When you let go it snaps to the grid and swings on its nail, the swing dying away over one second. A left panel picks the frame finish (black ash, natural oak, gilt, white lacquer) for the selected frame or all frames. The detail worth copying is the hang swing. It uses the CSS `rotate` property around a `transform-origin` 22px above the frame (the nail), so it never fights the position transitions.

## Reference behaviour

1. First frame: seven frames hang in a cluster. Harbour light (gilt, 100×70 cm) is selected and has a 2px ink ring. The panel shows its name, size and position. The style radio follows the selected frame, so Gilt is checked. Snap is on.
2. Pressing a frame selects it, raises it (z-index), scales it to 1.03 and deepens its shadow. The wall shows a 20px dot grid (opacity 0 → 0.7, 200ms).
3. Dragging moves the frame 1:1 with the pointer (compensated for the wall's scale). The frame tilts by horizontal speed: `rotate = clamp(dx × 0.5, −6°, 6°)` per move event, eased over 120ms.
4. A dashed 2px outline previews the snapped landing spot. If that spot overlaps another frame, the outline turns terracotta `#c4532e`.
5. Frames are clamped inside the wall: x from 0 to 900 − w, y from 30 to 440 − h (they never sink behind the sofa).
6. Release: the frame snaps to the grid (left/top transition 240ms expo-out), the tilt returns to 0, and after 180ms it swings: rotate 5° → −3° → 1.6° → −0.7° → 0 over 1000ms. The status line announces the new position, and warns if it overlaps.
7. Clicking a finish swatch re-frames the selected print (border thickness and colour change) and gives it a small 2.4° swing. "Apply to all frames" copies the selected finish to all seven, swinging each with a 50ms stagger.
8. Snap switch off: the grid dots stay hidden, drops land where released, and arrow-key nudges use 1 cm (2px).
9. Keyboard: focus a frame (Tab) to select it. Arrows nudge one grid step (10 cm). Shift+arrow nudges five. Each nudge gives a 1.6° swing. Enter/Space re-hangs it with a full swing.
10. "Rehang all" swings all seven frames at 6°, staggered by 70ms.
11. Reduced motion: no tilt, no swing, no snap slide; positions change instantly.

## Structure

```
1280 × 800, grid: 300px | 1fr
┌──────────────┬──────────────────────────────────────────────────┐
│ ⌂ Hangline   │  stage (#e7e2d6), padding 28                      │
│ Hallway,     │  ┌ wall 900×600, scaled to fit (--s) ───────────┐ │
│ north wall   │  │          ∧        ∧        ∧                  │ │
│ 450×300 · 7  │  │       [oak]   [ gilt  ]  [black]     ∧        │ │
│ FRAME STYLE  │  │               [       ]  [white]   [white]    │ │
│ [■ Black][□ Oak]│  [black] [  oak   ]                lamp       │ │
│ [□ Gilt][□ White]│                                   │          │ │
│ Apply to all │  │        ┌──── sofa 520×120 ────┐    │          │ │
│ ┌ SELECTED ┐ │  │▓▓▓▓▓▓▓▓▓▓ skirting 6 / floor 40 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │
│ │Harbour.. │ │  └──────────────────────────────────────────────┘ │
│ Snap  (●)    │                                                    │
│ status       │                                                    │
│ (Rehang all) │                                                    │
└──────────────┴──────────────────────────────────────────────────┘
```

- `aside.panel` (labelled "Wall settings"): brand, the only `h1`, size line, a `role="radiogroup"` of four `role="radio"` buttons, the "Apply to all" text button, a "Selected" card with an `h2`, a `role="switch"` button, a polite live status `p`, and the primary "Rehang all" button pinned to the bottom.
- `main.stage` → `.fit` (reserves `900×600 × --s`) → `.wall` (900×600, `transform: scale(var(--s))`, origin 0 0).
- Wall decor (`aria-hidden`): lamp, sofa, floor, and the `.ghost` outline.
- Seven `.fr` frames (`role="button"`, `tabindex="0"`, `aria-pressed` for the selection), each with an SVG wire, a `.body` (the moulding), a `.mat`, and an inline SVG print. The nail is `::after`.

## Tokens

```css
:root {
  --paper: #f1ede4;     /* panel */
  --paper-2: #e7e2d6;   /* stage, selected card */
  --line: #d6cfbf;
  --ink: #22251f;
  --ink-2: #575a50;
  --ink-3: #7a7c70;
  --wall: #b9c0a8;      /* sage plaster */
  --wall-2: #aeb69c;
  --accent: #c4532e;    /* terracotta: CTA, links, overlap warning, focus */
  --accent-ink: #fff8f2;
  --sofa: #8f5e4a;
  --floor: #9a8a72;
  --sans: "Bricolage Grotesque", system-ui, sans-serif;
  --serif: "Instrument Serif", Georgia, serif;
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --grid: 20px;         /* = 10 cm */
  --radius-card: 12px;
  --radius-swatch: 10px;
}
```

Finishes (per frame, via `data-style`):

| Finish | Moulding `--t` | Fill |
| --- | --- | --- |
| Black ash | 9px | `linear-gradient(135deg, #2a2926, #161513)` |
| Natural oak | 11px | `linear-gradient(135deg, #c79a63, #a87a46 60%, #b98a54)` + 1px grain stripes `#7a52281a` every 4px |
| Gilt | 12px | `linear-gradient(135deg, #ead08f, #c29a55 35%, #8f6d35 60%, #e0bf78)` + inset rings `2px #7a5a26`, `4px #f0d79a` |
| White lacquer | 9px | `linear-gradient(135deg, #fdfcf8, #ebe7dd)` + inset `1px #0000001a` |

Mats are `#faf7f0` with `inset 0 1px 3px #0003`, 0–14px per print. Frame shadow `drop-shadow(0 8px 10px #2a2a1e40)`; dragging `drop-shadow(0 22px 22px #2a2a1e55)`.

## Typography

| Role | Family | Size / line | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Brand | Bricolage Grotesque | 15px | 600 | −0.01em | `--ink` |
| h1 | Instrument Serif | 38px / 1 | 400 | −0.01em | `--ink` |
| Size line | Bricolage Grotesque | 14px | 400 | 0 | `--ink-2` |
| Section label | Bricolage Grotesque | 11px | 500 | 0.14em, upper | `--ink-3` |
| Swatch | Bricolage Grotesque | 13px | 400 | 0 | `--ink` |
| Selected h2 | Instrument Serif | 24px / 1.1 | 400 | 0 | `--ink` |
| Measurements | Bricolage Grotesque | 13px, tabular | 400 | 0 | `--ink-2` |
| Status | Bricolage Grotesque | 12px | 400 | 0 | `--ink-3` |
| CTA | Bricolage Grotesque | 14px | 500 | 0 | `--accent-ink` |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Grid dots | drag start/end | opacity | 0 ↔ 0.7 | 200ms | `--ease` | instant |
| Lift | press | scale, filter | 1 → 1.03, shadow deepens | 200ms | `--ease` | instant |
| Carry tilt | pointer move | rotate | → clamp(dx·0.5, ±6°) | 120ms | linear | 0° |
| Snap | release | left, top | drop point → grid point | 240ms | `--expo` | instant |
| Hang swing | release (+180ms) | rotate | 5°, −3°, 1.6°, −0.7°, 0° | 1000ms | `--ease` | none |
| Nudge swing | arrow key | rotate | 1.6° … 0° | 600ms | `--ease` | none |
| Finish change | swatch | rotate | 2.4° … 0° | 600ms | `--ease` | none |
| Rehang all | button | rotate | 6° … 0°, stagger 70ms | 1000ms | `--ease` | none |
| Ghost | drag | opacity | 0 → 0.55 (overlap 0.9) | 150ms | `--ease` | instant |

## States

- Frame resting: `cursor: grab`. Selected: `aria-pressed="true"`, ring `0 0 0 2px --paper, 0 0 0 4px --ink` on the moulding. Dragging: `cursor: grabbing`, z-index 50, lifted.
- Ghost: dashed `--ink` at 0.55; overlapping: dashed `--accent` at 0.9.
- Swatch: resting `1px --line` on `#fbf9f4`; hover `--ink-3` border; checked `--ink` border plus inset 1px ring on white.
- Switch: off track `#c9c3b4`, on track `--ink`, knob slides 16px (200ms expo).
- CTA: `--accent`, hover `#ad4524`.
- Focus-visible: 2px `--accent` outline, offset 3px (frames offset 6px).

## Accessibility

- Frames are `role="button"` with `tabindex="0"`, labelled "Harbour light, 100 by 70 cm"; `aria-pressed` marks the selection. Prints are `aria-hidden`.
- Keyboard: Tab selects; arrows nudge 10 cm (1 cm with snap off); Shift ×5; Enter/Space re-hangs.
- The finish picker is a `radiogroup` labelled "Frame style"; its checked state follows the selected frame.
- Snap is a `role="switch"` with `aria-checked`.
- The status line is `aria-live="polite"`: positions in cm, plus an overlap warning. Overlap is never shown by colour alone.
- Contrast: `#22251f` on `#f1ede4` ≈ 14:1; `#7a7c70` labels ≈ 4.1:1 (11px uppercase labels, upgrade to `--ink-2` for strict AA); `#fff8f2` on `#c4532e` ≈ 4.6:1.
- Hit targets: swatches 52px, CTA 44px, switch row ≥ 40px.

## Responsive rules

- ≥1280: panel 300px, wall scaled to `min(1.25, (stageW − 56) / 900, (innerHeight − 56) / 600)`.
- 1024: same, wall about 0.75.
- ≤900: one column; the wall comes first (order −1), panel below, page scrolls vertically. Scale from width only.
- <640: wall about 0.38 at 375; pointer and touch drag still work because pointer maths divide by the measured scale.
- No horizontal scroll at any width.

## Acceptance checklist

### Always

- [ ] Frames drag with pointer and touch; coordinates are corrected for the wall's scale.
- [ ] A snap preview outline appears while dragging, and warns in the accent when the landing spot overlaps.
- [ ] Drops snap to the grid when snap is on; frames stay inside the wall and above the furniture line.
- [ ] Release triggers a damped swing around the nail (origin above the frame), not around the centre.
- [ ] The tilt while carrying and the swing use `rotate`; position uses `left/top`; they never cancel each other.
- [ ] The finish picker changes the selected frame and reflects the selected frame's current finish.
- [ ] Arrow keys move the focused frame by one grid step; Shift moves five.
- [ ] Every move is announced in the live region.
- [ ] Reduced motion removes tilt, swing and slide.

### This demo

- [ ] Wall 900×600 = 450×300 cm; grid 20px = 10 cm; sofa 520×120 at x 190.
- [ ] Seven prints: Fennel study, Harbour light, Moon over Ost, Blue vase, Two figs, Contour Lake Ost, Swim club 1962.
- [ ] Harbour light starts selected in gilt at 175 cm from left, 60 cm from top.
- [ ] Wall `#b9c0a8`, accent `#c4532e`, panel `#f1ede4`.
- [ ] Hang swing 5° → 0 in 1000ms.

## Implementation notes

**Drag in a scaled canvas.** Measure the wall each press; divide by the scale.

```js
el.addEventListener('pointerdown', ev => {
  const r = wall.getBoundingClientRect(), s = r.width / 900;
  drag = { r, s, ox: (ev.clientX - r.left) / s - it.x, oy: (ev.clientY - r.top) / s - it.y, lx: ev.clientX };
  el.setPointerCapture(ev.pointerId);
});
el.addEventListener('pointermove', ev => {
  if (!drag) return;
  it.x = (ev.clientX - drag.r.left) / drag.s - drag.ox;
  it.y = (ev.clientY - drag.r.top) / drag.s - drag.oy;
  clamp(it); place(it);
  el.style.setProperty('--tilt', Math.max(-6, Math.min(6, (ev.clientX - drag.lx) * .5)) + 'deg');
  drag.lx = ev.clientX;
});
```

**The swing.** Origin at the nail, the individual `rotate` property, WAAPI keyframes:

```css
.fr { transform-origin: 50% -22px; rotate: var(--tilt, 0deg);
  transition: left .24s var(--expo), top .24s var(--expo); }
.fr.drag { transition: rotate .12s linear; }   /* no left/top transition while dragging */
```

```js
const hang = (el, a = 5) => el.animate(
  [{ rotate: a + 'deg' }, { rotate: -a * .6 + 'deg' }, { rotate: a * .32 + 'deg' }, { rotate: -a * .14 + 'deg' }, { rotate: '0deg' }],
  { duration: a > 3 ? 1000 : 600, easing: 'cubic-bezier(.2,.7,.2,1)' });
```

**Wire and nail.** The wire is an SVG `path M18 22 50 0 82 22` in a 100×22 box above the frame, `preserveAspectRatio="none"` with `vector-effect: non-scaling-stroke`, so it stays 1px on every frame width. The nail is a 6px dot at `top: -26px`.

Common mistakes:

- Leaving `left/top` transitions on during the drag; the frame lags the hand.
- Swinging with `transform: rotate()` on the same element that is positioned with `transform: translate()`.
- Rotating around the centre; it reads as a wobble, not a hang.
- Grid always visible; it should only appear while carrying.
- Forgetting to clamp frames above the sofa.
- Scaling the wall with percentages instead of one transform; snap maths stops being in whole centimetres.

Rebuild order:

1. Panel and stage layout; wall, sofa, lamp, floor; scale-to-fit.
2. Seven frames with moulding, mat, print, wire and nail.
3. Pointer drag with clamp, tilt and ghost.
4. Snap, overlap check, hang swing.
5. Finish picker, apply to all, snap switch, rehang all.
6. Keyboard nudging and live status.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
