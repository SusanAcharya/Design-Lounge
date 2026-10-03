<!-- Design Lounge Nº 430 · "Watch crown mockup" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Watch crown mockup

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A smartwatch mockup, the fictional Vesta Trail, drawn in CSS and presented on a dark moss stage with faint topographic contour rings. The case is a rounded rectangle in gunmetal with a black glass inset, a knurled crown with an orange collar, and a flat side button. A woven strap runs off the top and bottom of the frame. The screen holds four live faces stacked vertically: Topo (huge digital time), Analog (sweeping hands), Altitude (elevation profile) and Weather. Turning the crown rolls the stack exactly like the real thing, with the crown knurling moving in step. The detail worth copying is that one number, `--pos`, drives the face track, the crown texture and the scroll indicator together, so the device feels mechanically linked.

## Reference behaviour

1. First frame: face 1 Topo, Ember strap, current local time in 47cqw condensed numerals, the minutes in orange.
2. Drag the crown vertically: every 90px of drag moves one face. Dragging up goes to the next face. The track follows the pointer continuously, not in steps.
3. Drag the screen itself: it follows the finger 1:1 (one screen height per face).
4. Wheel over the watch: `deltaY / 260` faces per event. 160ms after the last wheel event, the track snaps.
5. Release: the track snaps to the nearest face over 420ms with expo-out.
6. Past the first or last face the movement is rubber-banded at 30% and springs back on release.
7. While moving, a thin scroll indicator appears at the right edge of the screen (25% thumb on a 40% track) and fades 500ms after settling.
8. The crown's knurling moves 24cqw per face (`background-position-y`), so it visibly turns with the content.
9. Keyboard on the focused crown: ArrowDown/ArrowRight/PageDown next, ArrowUp/ArrowLeft/PageUp previous, Home first, End last.
10. Side button: snaps back to face 1.
11. The left caption shows `01 / 04` and the face name in 120px condensed caps, updated when the nearest face changes; it is a polite live region.
12. Band swatches (Ember, Moss, Chalk) recolour both strap halves over 300ms.
13. Faces keep live time: the analog second hand sweeps on rAF; digital digits and date update when the minute changes.

## Structure

```
1280 × 800, moss stage with contour rings
┌───────────────────────────────────────────────────────────────────────┐
│                         ┌──── strap ────┐ runs off top                 │
│ VESTA TRAIL · WATCH…    │               │               BAND           │
│ 01 / 04                 │               │               ● ○ ○  44px    │
│ TOPO   120px            ┌───────────────┐                              │
│ Turn the crown…         │ SUN 04 OCT    │▐ crown 7×17cqw  Drag  …      │
│                         │ 00            │                Scroll …      │
│                         │ 09  (orange)  │▌ side button   ↑ ↓  …        │
│                         │ HR 62  8,412st│                              │
│                         └───────────────┘ 290 × 348                    │
│                         │  ○ ○ ○ ○      │ strap with holes, off bottom │
└───────────────────────────────────────────────────────────────────────┘
```

- `main.page`: three-column grid `1fr auto 1fr`, gap 48px.
- `section.info`: eyebrow, `h1.big` (live region) containing `small#idx` and the name, and a description.
- `.rig` (290px, `container-type: inline-size`) holds two `.band` halves (50vh tall, 72% of the rig wide), `button.crown` (`role="slider"`), `button.btn`, and `.watch` (`role="img"`, aspect 250/300).
- `.watch > .glass > .screen > .track > .face × 4` plus `.scroll`.
- `aside.side`: band `fieldset` of radios and a `ul` of instructions with `kbd` keys.

## Tokens

```css
:root {
  --bg: #141912;  --bg-2: #1c2219;
  --ink: #ecefe4; --ink-2: #a9b19c; --ink-3: #7f8873;
  --line: #2c3428;
  --accent: #ff6a2b;              /* trail orange */
  --band: #e8612c; --band-2: #b9461b;   /* Ember */
  --display: "Big Shoulders Display", "Arial Narrow", sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --snap: 420ms;
  --px-per-face: 90px;            /* crown drag distance */
}
[data-band="moss"]  { --band: #5d6b3a; --band-2: #3e4826; }
[data-band="chalk"] { --band: #d9d4c7; --band-2: #aaa494; }
```

Case geometry in `cqw` of the rig: case radius 22% / 19%, case padding 2.4cqw, glass radius 19% / 16% with 4.4cqw padding, screen radius 15% / 12%. Crown 7 × 17cqw at right −4.6cqw, top 24%. Side button 4 × 20cqw at right −2.4cqw, top 52%.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Face name (stage) | Big Shoulders Display | 120px (84px narrow) | 900 | 0.82 | −0.01em | uppercase |
| Index `01 / 04` | Big Shoulders Display | 22px | 700 | 1 | 0.08em | — |
| Eyebrow, legend | DM Mono | 12px | 400 | 1.45 | 0.16em | uppercase |
| Description | DM Mono | 14px | 400 | 1.45 | 0 | sentence |
| Topo digits | Big Shoulders Display | 47cqw | 900 | 0.8 | −0.02em | tabular |
| Altitude / temperature | Big Shoulders Display | 30cqw / 52cqw | 900 | 0.8–0.85 | −0.01em | — |
| Dial numerals | Big Shoulders Display | 9cqw | 700 | 1 | 0 | — |
| Face labels | DM Mono | 4.4–5.4cqw | 500 | 1–1.35 | 0.08em | uppercase labels |

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Face track | drag / wheel | translateY | follows `--pos × −100%` | live, no transition | same (direct manipulation) |
| Snap | release, wheel idle, key, side button | translateY | current → nearest face | 420ms expo out | instant |
| Rubber band | past ends | `--pos` | overshoot × 0.3 | live | same |
| Crown knurl | with `--pos` | background-position-y | `pos × −24cqw` | with track | same |
| Scroll indicator | moving | opacity | 0 → 1 (100ms), → 0 after 500ms idle | 300ms | instant |
| Second hand | rAF | rotate | continuous sweep | linear in time | ticks once per second |
| Strap | swatch | background | colour swap | 300ms | instant |
| Side button | press | translateX | 0 → −0.8cqw | 120ms | instant |

## States

- Crown focus-visible: 2px orange outline, 4px offset. Hit area extended by `::before` (−12px −16px −12px −6px).
- Crown and screen show `cursor: ns-resize`.
- Swatch checked: 1.5px `--ink` ring 4px inside the 44px target. Focus-visible: 2px orange outline on the label.
- Moving: indicator visible. Idle: indicator hidden.
- Non-current faces: `aria-hidden="true"`.

## Accessibility

- The crown is `button role="slider"` with `aria-valuemin=1`, `aria-valuemax=4`, `aria-valuenow`, `aria-valuetext="Analog, face 2 of 4"`, `aria-orientation="vertical"` and the label "Digital crown, turn to change watch face".
- The side button is labelled "Side button, back to the first face".
- The caption `h1` is `aria-live="polite"` so the face name is announced once per change, not on every drag pixel (it only changes when the nearest face changes).
- The watch body is `role="img"` labelled "Vesta Trail watch".
- Band swatches are radios in a fieldset with legend "Band" and labels "Ember band", etc.
- Contrast: `#ecefe4` on `#141912` ≈ 15:1; `#a9b19c` ≈ 8:1; `#7f8873` labels ≈ 4.6:1.

## Responsive rules

- ≥1280: three columns; watch 290px; straps run off the top and bottom edges.
- 1024: same, side columns narrow; the face name may drop to two lines.
- ≤900: single centred column (info, watch, swatches), page scrolls, straps shorten to 110px each and the rig gets 90px vertical margin so they don't collide with text.
- At 375 the watch is `100vw − 110px` (265px). Faces scale with `cqw`.
- Wheel handling is attached to the rig only; scrolling the page elsewhere still works.

## Acceptance checklist

### Always

- [ ] The device is CSS only and every inner size uses container units.
- [ ] One position value drives the track, the crown texture and the indicator.
- [ ] Drag, wheel and keyboard all move the faces; release snaps to the nearest face.
- [ ] Rubber-band at both ends.
- [ ] The crown is a focusable slider with value text naming the face.
- [ ] A side button returns to the first face.
- [ ] Reduced motion: snaps are instant and the second hand ticks; interaction is unchanged.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Four faces in order: Topo, Analog, Altitude (1,284 m, climb +612, sunset 18:52), Weather (14°, "Light rain from 15:00, wind NW 18", hourly 14/15/12/11).
- [ ] Crown drag 90px per face; wheel `deltaY / 260`; snap 420ms.
- [ ] Straps Ember `#e8612c`, Moss `#5d6b3a`, Chalk `#d9d4c7`.
- [ ] Caption reads `01 / 04` TOPO on load.
- [ ] Orange crown collar and orange minutes on Topo.

## Implementation notes

**One value, three consumers.** Set `--pos` on the rig; each part reads it.

```css
.track { transform: translateY(calc(var(--pos, 0) * -100%)); }
.track.snap { transition: transform .42s var(--ease-out); }
.scroll i { top: calc(var(--pos, 0) * 25%); }
.crown { background:
  linear-gradient(90deg, rgba(0,0,0,.5), transparent 30% 70%, rgba(0,0,0,.5)),
  repeating-linear-gradient(0deg, #8a8e89 0 .55cqw, #2b2e2c .55cqw 1.3cqw);
  background-position: 0 0, 0 calc(var(--pos, 0) * -24cqw); }
```

**Drag with rubber band and snap.**

```js
const rubber = p => p < 0 ? p * .3 : p > N - 1 ? N - 1 + (p - N + 1) * .3 : p;
el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); y0 = e.clientY; p0 = pos; });
el.addEventListener('pointermove', e => {
  if (!el.hasPointerCapture(e.pointerId)) return;
  set(rubber(p0 + (y0 - e.clientY) / (el === crown ? 90 : screen.clientHeight)));
});
el.addEventListener('pointerup', () => set(Math.max(0, Math.min(N - 1, Math.round(pos))), true));
```

**Analog ticks without 60 elements.** A repeating conic gradient masked to a ring. Use `circle closest-side`, otherwise percentages measure to the far corner and the ring shrinks.

```css
.dial { background: repeating-conic-gradient(var(--ink-2) 0 .6deg, transparent .6deg 6deg);
  mask: radial-gradient(circle closest-side, transparent 0 91%, #000 91.5% 99%, transparent 99.5%); }
.ticks { background: repeating-conic-gradient(var(--ink) 0 1.4deg, transparent 1.4deg 30deg);
  mask: radial-gradient(circle closest-side, transparent 0 82%, #000 82.5% 99%, transparent 99.5%); transform: rotate(-.7deg); }
```

Common mistakes:

- Stepping one face per wheel event; trackpads fire dozens. Accumulate and snap on idle.
- Moving the faces but not the crown; the mechanical link is the point.
- Writing the date with `innerHTML` every animation frame. Update digits only when the minute changes.
- Forgetting `touch-action: none` on the crown and screen, so touch drags scroll the page.
- Real watch-maker shapes or logos. Vesta is invented and the case carries no mark.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
