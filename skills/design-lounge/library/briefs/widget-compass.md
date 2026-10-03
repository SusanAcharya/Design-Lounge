<!-- Design Lounge Nº 209 · "Field compass widget" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Field compass widget

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A home-screen style compass widget for a hiking app called Tarnline, shown on a sheet of topographic map paper. A forest-green card holds a cream compass card that rotates under a fixed safety-orange lubber line. Below it the heading reads in a tall condensed numeral with its 16-point cardinal, and a three-cell stat row tells you how far off the bearing to the next hut you are. In the centre of the dial a level vial holds a bubble that drifts toward the pointer, so the widget feels like an instrument held in a hand. The detail worth copying is the damped spring on the card: it overshoots by a few degrees and settles like a liquid-filled compass.

## Reference behaviour

1. First frame: heading 247°, cardinal WSW, long name "West-southwest". The card is rotated so 247 sits under the lubber line at 12 o'clock. The orange target triangle at 252° sits just right of the lubber. "Off course" reads "5° R". Status top-right reads "Level".
2. Idle: every 1600ms the target heading wanders by a random amount in ±0.7°, and the spring follows. This only happens in Drag mode, when not dragging and when the dial does not have keyboard focus.
3. Drag mode (default): pointer-down on the dial captures the pointer. Moving the pointer around the dial centre rotates the card by the same angle as the pointer, so the card sticks to the finger. Heading = start heading − angular delta.
4. Releasing with angular velocity above 0.6°/frame throws the card: target += velocity × 9, velocity clamped to ±6°/frame. The spring then settles.
5. Follow mode: the heading becomes the bearing from the dial centre to the pointer (0° = pointer straight above). The card turns to face it, always through the shortest arc.
6. Level bubble: on every pointer move anywhere on the page the bubble's target offset is toward the pointer, magnitude = min(1, distance / max(viewport side) × 1.6) × 24 SVG units. When the pointer leaves the document the bubble returns to centre. While dragging the dial the bubble holds still.
7. Tilt readout = bubble offset / 25 × 6°. Under 0.8° the bubble turns green `#2f7a4f` and status reads "Level"; otherwise it is ink and status reads "Tilt 2.3°".
8. Every frame updates: the zero-padded three-digit heading (e.g. "008"), the 16-point cardinal, the long name, and "Off course": signed difference to 252°, rounded, shown as "N° R" or "N° L", or "On line" at 0.
9. Keyboard on the focused dial: ←/↓ −1°, →/↑ +1°, with Shift ±10°, PageUp/PageDown ±15°, Home snaps to north, End snaps to the target bearing 252°.
10. The segmented control below switches Drag dial / Follow pointer. The hint line updates: "Drag the dial or use arrow keys" or "Move the pointer; the widget faces it".

## Structure

```
1280×800 viewport, map paper fills it, topographic contours drawn as SVG
                ┌──────────── 380 × ~400, radius 34 ───────────┐
                │ TARNLINE                              LEVEL  │  10px mono caps
                │            ▼ lubber (orange, fixed)          │
                │        ╭──────── 300 dial ────────╮          │
                │        │ ticks 5°/10°/30°, numbers │          │
                │        │ N E S W in condensed 24px │          │
                │        │     ( vial r36, bubble )  │          │
                │        ╰───────────────────────────╯          │
                │ 247°  WSW                                     │  68px / 26px
                │       WEST-SOUTHWEST                          │
                │ ───────────────────────────────────────────── │
                │ TO CORRIE HUT │ OFF COURSE │ ELEVATION        │
                │ 252° · 1.8 KM │ 5° R       │ 2,148 M          │
                └───────────────────────────────────────────────┘
                  [ DRAG DIAL | FOLLOW POINTER ]   pill, 36px tall
                  DRAG THE DIAL OR USE ARROW KEYS
```

- Background: a fixed full-viewport `svg` with `aria-hidden="true"`, holding contour rings around four "peaks". Every 5th ring is an index contour (thicker, darker) with an elevation label like "2,048 m".
- Widget: `section` labelled "Tarnline field compass".
- Dial: a `div` with `role="slider"`, `tabindex="0"`, aria min 0, max 359, holding one `svg` with `viewBox="-150 -150 300 300"`.
- Inside the SVG, back to front: bezel circle r148 (cream), rotating group (ticks, numbers, letters, rings r88 and r60, target triangle), fixed lubber triangle and 22-unit rule, fixed vial r36 with crosshair and a r11 target ring, bubble r8.
- Readout: heading numeral with an orange degree `sup`, cardinal and long name.
- Stats: a 3-column grid separated by 1px rules at 14% cream.
- Mode switch: `role="radiogroup"` with two `role="radio"` buttons.
- A visually hidden `aria-live="polite"` paragraph announces the heading after drag release and key presses.

## Tokens

```css
:root {
  /* surfaces */
  --paper: #ece4cf;        /* map paper, page background */
  --contour: #cdbf9b;      /* ordinary contour line */
  --contour-2: #b5a47a;    /* index contour + elevation labels */
  --ink: #1d3428;          /* forest card, dial ink */
  --ink-2: #2b4a39;        /* dial degree numbers */
  --cream: #f4eedd;        /* compass card, widget text */
  --cream-2: #b8c3ad;      /* muted labels on the green card */
  --orange: #e5562a;       /* lubber, north letter, target, degree sign */
  --level: #2f7a4f;        /* bubble when level */
  --line: rgba(244, 238, 221, .14);

  /* type */
  --display: "Saira Condensed", "Arial Narrow", sans-serif;
  --mono: "Martian Mono", ui-monospace, monospace;
  --fs-hero: 68px; --fs-card: 26px; --fs-letter: 24px;
  --fs-stat: 17px; --fs-label: 10px; --fs-num: 11px;

  /* space + shape */
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 20px; --s6: 22px;
  --r-widget: 34px; --r-pill: 999px;
  --shadow-widget: inset 0 1px 0 rgba(255,255,255,.07), 0 2px 0 #142419, 0 34px 60px -28px rgba(29,52,40,.6);

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --dur-micro: 160ms;
  --spring-k: 0.11;        /* per-frame stiffness */
  --spring-damp: 0.74;     /* per-frame velocity retention */
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Heading numeral | Saira Condensed | 68px | 600 | 0.9 | -0.01em | tabular |
| Degree sign | Saira Condensed | 0.42em, raised 0.95em | 600 | — | — | orange |
| Cardinal | Saira Condensed | 26px | 600 | 1 | 0.04em | upper |
| Cardinal long | Martian Mono | 10px | 400 | 1.4 | 0.06em | upper |
| Dial letters N E S W | Saira Condensed | 24px | 700 | — | — | N in orange |
| Dial numbers | Martian Mono | 11px | 500 | — | — | every 30° |
| Stat label | Martian Mono | 9.5px | 400 | 1.5 | 0.1em | upper |
| Stat value | Saira Condensed | 17px | 600 | 1.2 | 0.02em | tabular |
| Brand + status | Martian Mono | 10px | 500/400 | 1.5 | 0.12em | upper |
| Mode buttons | Martian Mono | 11px | 500 | — | 0.06em | upper |
| Contour labels | Martian Mono | 9px | 400 | — | 0.08em | `--contour-2` |

The numeral is zero-padded to three digits so the width never jumps.

## Motion

| Thing | Trigger | Property | Behaviour | Reduced motion |
| --- | --- | --- | --- | --- |
| Compass card | drag, keys, follow, idle | group `rotate(-heading)` | per-frame spring: `vel = (vel + diff(target, heading) × 0.11) × 0.74; heading += vel` | heading = target immediately |
| Throw | drag release | target | `target += clamp(v, ±6) × 9` when abs(v) > 0.6 | no throw |
| Idle wander | every 1600ms | target | ± 0.7° random, drag mode only | off |
| Level bubble | pointer move / leave | cx, cy | lerp 0.14 per frame toward target | jumps to target |
| Bubble colour | tilt < 0.8° | fill | instant ink → `#2f7a4f` | same |
| Mode pill | click | background, colour | 160ms `--ease` | none |

The animation loop is a single `requestAnimationFrame` that stops itself once velocity < 0.01 and both the heading and the bubble are within 0.05 of their targets. No loop runs while nothing moves.

## States

- Dial resting: cursor `grab`. Dragging: cursor `grabbing`, text selection disabled.
- Dial focus-visible: 2px orange outline, 6px offset, following the 50% radius.
- Follow mode: dial cursor `default`, pointer-down does nothing.
- Mode radio checked: ink background, cream text. Unchecked: transparent, ink text.
- Mode button focus-visible: 2px orange outline, 2px offset.
- Level vs tilted: bubble green + "Level", or ink + "Tilt N.N°".
- On line: "Off course" reads "On line" at 0° difference.

## Accessibility

- Dial is `role="slider"` with `aria-valuenow` (integer 0–359) and `aria-valuetext` such as "247 degrees, west-southwest". Update both every frame the readout changes.
- Keys: arrows ±1°, Shift+arrows ±10°, PageUp/PageDown ±15°, Home = north, End = target bearing.
- Live region announces "252 degrees WSW" after a drag ends or a key changes the heading, only when the text changes. Do not announce every frame.
- Mode switch is a radiogroup; ←/→ move and select. Each button is 36px tall; with the 3px pill padding the hit area is 42px.
- Contrast: cream `#f4eedd` on `#1d3428` is about 12:1. Muted `#b8c3ad` on `#1d3428` is about 7.6:1. Ink on paper is above 10:1.
- The background map is decorative and `aria-hidden`.

## Responsive rules

- ≥1280: widget 380px wide, centred, map fills the viewport.
- 1024 and 768: unchanged; the widget is a fixed-size object.
- <640: widget width is `min(380px, 100vw − 32px)`; the dial is `width: 100%; max-width: 300px; aspect-ratio: 1` so it scales with the card. At 375 wide nothing overflows horizontally.
- The contour map is generated against the viewport size at load. Regenerating on resize is optional.

## Acceptance checklist

### Always

- [ ] The dial is a single SVG; only the card group rotates. The lubber, vial and bubble do not rotate.
- [ ] Rotation uses a damped spring, not a CSS transition, and always takes the shortest arc across 0/360.
- [ ] Drag keeps the card under the finger (angle delta around the dial centre), with a clamped throw on release.
- [ ] The heading numeral is three digits, tabular, and never changes width.
- [ ] The dial is a keyboard slider with valuetext and the key map above.
- [ ] The rAF loop stops when everything is at rest.
- [ ] Reduced motion: no spring, no throw, no idle wander.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] First frame: 247°, WSW, "West-southwest", "Off course 5° R".
- [ ] Target bearing is 252° to "Corrie hut", 1.8 km; elevation 2,148 m.
- [ ] Forest card `#1d3428`, cream dial `#f4eedd`, orange `#e5562a` on the lubber, N and target.
- [ ] Bubble turns `#2f7a4f` under 0.8° tilt.
- [ ] Mode labels "Drag dial" and "Follow pointer".
- [ ] Ticks every 5°, mid ticks every 10°, major ticks and labels every 30°.

## Implementation notes

**Shortest-arc spring.** Store heading unbounded and normalise only for display. The difference helper keeps the spring from spinning 359° the long way:

```js
const norm = (a) => ((a % 360) + 360) % 360;
const diff = (a, b) => ((a - b + 540) % 360) - 180;
function tick() {
  vel = (vel + diff(target, heading) * 0.11) * 0.74;
  heading += vel;
  rot.setAttribute('transform', `rotate(${-heading})`);
  if (Math.abs(vel) > 0.01 || Math.abs(diff(target, heading)) > 0.05) requestAnimationFrame(tick);
}
```

**Drag that sticks to the finger.** Measure the pointer's bearing around the dial centre each move and subtract the delta. Using `atan2(dx, -dy)` makes 0° straight up and clockwise positive, matching compass bearings.

```js
const angleAt = (x, y) => { const b = dial.getBoundingClientRect();
  return Math.atan2(x - (b.left + b.width / 2), (b.top + b.height / 2) - y) * 180 / Math.PI; };
dial.onpointermove = (e) => {
  if (!drag) return;
  const a = angleAt(e.clientX, e.clientY), step = diff(a, drag.a);
  drag.a = a; target -= step;
  drag.v = Math.max(-6, Math.min(6, -step / Math.max(8, e.timeStamp - drag.t) * 16));
  drag.t = e.timeStamp; kick();
};
```

**Card labels.** Each number and letter is rotated by its own bearing around its own position (`transform="rotate(a x y)"`), so the labels read outward like a real compass card and turn upside-down at the bottom. Do not counter-rotate them upright; that turns it into a speedometer.

Common mistakes:

- Rotating the whole SVG, which spins the lubber and the bubble with it.
- Animating with `transition: transform`, which takes the long way from 350° to 10°.
- Forgetting `touch-action: none` on the dial, so touch drags scroll the page.
- Leaving `user-select` on; dragging across the SVG text highlights it.
- Using the browser's DeviceOrientation API in the demo. It is blocked in sandboxed frames and on desktop. The pointer stands in for the sensor here; in a product, feed real heading into `target`.
- Generic map texture images. The contours are generated paths, so the piece has zero image assets.

Where it sits: one widget on a trail app's home screen or a device widget gallery. Sibling widgets in the same gallery each keep their own look: `widget-weather-glance`, `widget-device-battery`, `widget-control-toggles`.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
