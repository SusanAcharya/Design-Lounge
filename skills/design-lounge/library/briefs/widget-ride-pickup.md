<!-- Design Lounge Nº 387 · "Ride pickup live activity" · www.designlounge.live -->

# Ride pickup live activity

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A Live Activity for a fictional ride app, "Wend", sitting on a phone lock screen. The wallpaper is a pale paper street map. Under a large clock, a warm off-white card tracks the driver: a 320 × 120 mini map with an orange route, a small top-down car that drives along it, a countdown in mono orange, the driver, and a yellow number plate. Tapping the card's header folds it to a 64px row with a thin progress bar, the way a live activity shrinks. When the countdown hits zero, the ETA reads "Here", the pin pulses, and the plate grows slightly so you look for it. The detail worth copying: the car's position, the filled part of the route, and the compact progress bar all come from one number, `p`, so the three can never disagree.

The language is iOS 26-ish without glass: 26px card radius, an SF-like grotesk, sheet easing on the fold. The card is opaque because it sits on a busy map.

## Structure

```
390 × 844, padding-top 54px, padding-x 16px, padding-bottom 34px
┌──────────────────────────────────────┐
│          Saturday 3 October  (17px)  │
│              23:54   (96px)          │
│                                      │  28px gap
│ ┌──────────────────────────────────┐ │  card, max 358px, r 26px
│ │[car] Ramesh is on the way   3:51 ^│ │  header 64px, button
│ │      Silver hatchback ·  MIN AWAY │ │
│ │ ┌──────────────────────────────┐ │ │  map 320×120 viewBox, r 16px
│ │ │  streets ─── route ───● YOU  │ │ │
│ │ └──────────────────────────────┘ │ │
│ │ Pickup at Jhamsikhel Gate (22px) │ │
│ │ ──────────────────────────────── │ │  1px rule
│ │ (RK) Ramesh K.      [BA 2 PA 4821]│ │
│ │ [ Message ]   [■ Share trip    ] │ │  44px buttons, 2 columns
│ └──────────────────────────────────┘ │
│                                      │
│           ( Replay pickup )          │  margin-top auto
└──────────────────────────────────────┘
compact: header row + 4px bar (margin 0 16px 14px), r 22px
```

- `header.lock`: two `p` elements, date and time. Not a status bar.
- `section.la[aria-label="Wend ride activity"][data-size="expanded|compact"]`.
- `button.head[aria-expanded][aria-controls="more"]`: app mark (36px ink square, r 11px), the two-line who block, the ETA block, a chevron.
- `.bar > i`: compact progress, `aria-hidden` (the ETA already says it).
- `#more`: a grid with `grid-template-rows: 1fr → 0fr`; its child has `overflow: hidden; min-height: 0`.
- Map: inline `svg[role=img]` with a label naming the pickup point. Layers in order: park rect, water shapes, white streets (7px), pale route (5px), solid route (5px, dasharray), ping ring, pin, car group, "YOU" label.
- Driver row: initials avatar (40px circle), name and rating, plate chip.
- Two action buttons: Message (tonal), Share trip (ink, primary).
- A visually hidden `p[aria-live=polite]`.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Car | tick | transform translate + rotate | previous point → next point on path | 240ms | `--std` | instant |
| Solid route | tick | stroke-dashoffset | L·(1−p_prev) → L·(1−p) | 240ms | `--std` | instant |
| Compact bar | tick | width | p_prev → p | 240ms | `--std` | instant |
| `.more` | header tap | grid-template-rows | 1fr ↔ 0fr | 360ms | `--sheet` | instant |
| `.inner` | header tap | opacity | 1 ↔ 0 | 240ms | `--std` | instant |
| Chevron | header tap | rotate | 0 ↔ 180° | 360ms | `--sheet` | instant |
| Card | header tap | border-radius | 26 ↔ 22px | 360ms | `--sheet` | instant |
| Ping ring | arrived | scale .6 → 2.4, opacity .9 → 0 | loop | 1.6s | `--std` | static 1.6×, .8 |
| Plate | arrived | scale | 1 → 1.08 | 240ms | `--std` | instant |
| Action button | press | scale | 1 → .97 | 120ms | `--std` | same |

The car is not on an SVG `<animateMotion>`. JS samples the path with `getPointAtLength` each tick, so the countdown can be paused, replayed, or driven by real data.

## States

- **Approaching (> 30s):** headline "Ramesh is on the way", label "MIN AWAY".
- **Arriving (≤ 30s):** headline "Ramesh is turning in", label "ARRIVING".
- **Arrived (0):** `.here` on the card. ETA "Here", label "NOW", ring pinging, plate at 1.08, status line rewritten.
- **Expanded:** `data-size="expanded"`, chevron points up, `aria-expanded="true"`.
- **Compact:** `data-size="compact"`, details at 0 height and 0 opacity, bar visible, chevron points down, radius 22px.
- **Button hover:** tonal `#efeadd → #e6e0d0`; primary `--ink → #2d3036`.
- **Focus-visible:** 2px accent outline, 3px offset. On the header the offset is −3px so the ring sits inside the card's rounded edge.
- **Share pressed:** label "Link copied" for 1600ms.
- **Loading / error:** not shown. A real product shows "Finding your driver" with the car hidden and the bar indeterminate.

## Accessibility

- The card is a `section` with `aria-label="Wend ride activity"`.
- The header is one `button` with `aria-expanded` and `aria-controls="more"`. Its accessible name is the headline, subline, and ETA, read in order.
- The map is `role="img"` with `aria-label="Route from the driver to your pickup point at Jhamsikhel Gate"`.
- The live region announces only when the whole minute changes ("Ramesh is 3 minutes away.") and on arrival ("Ramesh has arrived. Silver hatchback, plate BA 2 PA 4821."). Never announce every second.
- The plate has `aria-label="Plate BA 2 PA 4821"`. "Message" has `aria-label="Message Ramesh"`.
- Hit targets: header 64px tall, action buttons 44px, replay pill 40px.
- Contrast: `--ink` on `--card` 16:1. `--ink-3` on `--card` 5.0:1. Accent `#f2551d` on `--card` is 3.4:1, so it is used only at 20px+ bold (ETA, status place name), which counts as large text.

## Responsive rules

- 390 × 844 is the frame. The card is `width: 100%` capped at 358px with 16px side padding.
- At 360 wide the card is 328px. The subline ellipses; the ETA block never wraps. The map scales with its viewBox.
- Height: the replay pill sits at `margin-top: auto`, so on short phones it rides up under the card instead of off-screen.
- At tablet width, keep the card at 358px and centre it. A live activity does not stretch.
- Do not draw the status bar or notch. The lock clock is content.

## Acceptance checklist

### Always

- [ ] One progress value `p` (0–1) drives car position, solid route length, and compact bar width.
- [ ] The car rotates to the path tangent and stops at the pin.
- [ ] The countdown ticks at a fixed interval ≥ 16ms and stops at zero.
- [ ] The header is a button with `aria-expanded`; tapping it folds to a single row plus progress bar in 360ms.
- [ ] Details collapse with `grid-template-rows: 1fr → 0fr`, not a measured height.
- [ ] Arrival changes four things: ETA word, headline, status line, plate emphasis.
- [ ] Live region speaks once per minute and on arrival.
- [ ] Action buttons are ≥ 44px tall; header ≥ 64px.
- [ ] Reduced motion keeps the data moving but drops every transition and the ping.
- [ ] No status bar drawn.

### This demo

- [ ] Wend, driver Ramesh K., 4.92 · 1,840 trips, silver hatchback, plate BA 2 PA 4821.
- [ ] Pickup at Jhamsikhel Gate; ETA starts at 4:00 and runs at 4×.
- [ ] Route `#f2551d` over `#f9c7b2`; plate `#f5d548` with a 1.5px ink border.
- [ ] Clock 23:54 at 96px Bricolage Grotesque.
- [ ] Card `#fbf9f4`, radius 26px expanded, 22px compact.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: expanded card. Header reads "Ramesh is on the way", "Silver hatchback · ends 4821", ETA `4:00` "MIN AWAY". The car sits at the left end of the route. The countdown starts at once.
2. The simulated trip lasts 240 seconds, run at 4× speed: one simulated second per 250ms of real time, so the demo arrives in 60 real seconds.
3. Every tick: ETA text becomes `m:ss`, the solid orange route grows from the start toward the pin, the car moves along the path and rotates to face the direction of travel, and (in compact mode) the progress bar widens.
4. At 30 seconds left: the label reads "ARRIVING", the headline becomes "Ramesh is turning in".
5. At zero: ETA reads "Here" / "NOW", headline "Ramesh has arrived", status line "Look for the yellow plate, he waits 3 min". The pin's orange ring pings outward every 1.6s, the plate scales to 1.08. The timer stops.
6. Tap the header (or focus it and press Enter/Space): the card folds to compact. The map, status, driver row, and actions collapse to 0 height over 360ms; the chevron turns 180°; a 4px progress bar appears under the header. Tap again to expand.
7. "Share trip" swaps its label to "Link copied" for 1.6s.
8. "Replay pickup" (a pill at the bottom of the screen) restarts the trip from 4:00 and clears the arrived state.
9. Reduced motion: the countdown and positions still update (they are information), but every transition is instant and the ring does not pulse. It sits static at 1.6× scale, 80% opacity.

## Tokens

```css
:root {
  /* map wallpaper */
  --paper: #ece6d8;     /* land */
  --street: #f7f3ea;    /* road lines on the wallpaper */
  --park: #cfd9b4;
  --water: #bcd3d6;

  /* card */
  --card: #fbf9f4;
  --ink: #191b1f;       /* text, app mark, primary button, car */
  --ink-2: #4a4d54;     /* date, driver meta */
  --ink-3: #6c6f76;     /* subline, ETA label, chevron */
  --line: #e2dccd;      /* rule, progress track */
  --accent: #f2551d;    /* route, ETA, pin, focus */
  --accent-soft: #f9c7b2; /* route not yet driven */
  --plate: #f5d548;     /* number plate */

  --sans: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: "Martian Mono", ui-monospace, monospace;

  --r-card: 26px;  --r-card-compact: 22px;
  --r-map: 16px;   --r-btn: 14px;  --r-mark: 11px;
  --shadow-card: 0 18px 40px -22px rgba(25, 27, 31, .45);

  --sheet: cubic-bezier(.32, .72, 0, 1);  /* fold */
  --std: cubic-bezier(.2, .7, .2, 1);     /* ticks, buttons */
  --t-fold: 360ms;
  --t-tick: 240ms;
  --tick-real: 250ms;  /* one simulated second */
  --trip: 240;         /* simulated seconds */
}
```

The wallpaper is four stacked backgrounds: a 130px-wide repeating vertical street, a 170px-tall repeating horizontal street, a park ellipse at 82% 78%, a diagonal river band at 118°, over `--paper`. A fixed `::before` fades it from 92% paper at the top to 20% at the bottom so the clock stays readable.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Date | Bricolage Grotesque | 17px | 600 | 1.4 | 0.01em | Sentence |
| Clock | Bricolage Grotesque (opsz 96) | 96px | 700 | 0.95 | -0.045em | — |
| Headline | Bricolage Grotesque | 15px | 700 | 1.4 | -0.01em | Sentence |
| Subline | Bricolage Grotesque | 13px | 400 | 1.4 | 0 | Sentence, ellipsis |
| ETA | Martian Mono | 20px | 600 | 1.1 | -0.04em | tabular |
| ETA label | Bricolage Grotesque | 11px | 600 | 1.4 | 0.08em | UPPER |
| Status | Bricolage Grotesque (opsz 32) | 22px | 700 | 1.15 | -0.02em | Sentence, place in accent |
| Driver name | Bricolage Grotesque | 15px | 700 | 1.4 | 0 | — |
| Plate | Martian Mono | 13px | 600 | 1 | 0.04em | UPPER |
| Button | Bricolage Grotesque | 14px | 600 | 1 | 0 | Sentence |
| Map label | Martian Mono | 8px | 600 | — | 0 | UPPER |

Load Bricolage with the optical size axis (`opsz,wght@12..96,400..800`). The clock at opsz 96 is tighter and sharper than the 15px text.

## Implementation notes

**One function places everything.** The route path is used twice: once pale, once solid with a dasharray equal to its length.

```js
const L = route.getTotalLength();
done.style.strokeDasharray = L;
function place(p) {
  const d = Math.min(L, p * L);
  const a = route.getPointAtLength(d);
  const b = route.getPointAtLength(Math.min(L, d + 1));
  const ang = d >= L ? 0 : Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  car.setAttribute('transform', `translate(${a.x} ${a.y})`);
  carRot.setAttribute('transform', `rotate(${ang})`);
  done.style.strokeDashoffset = L - d;
  card.style.setProperty('--p', p);   // compact bar reads width: calc(var(--p) * 100%)
}
```

Put translate and rotate on two nested groups. On one element, a CSS transition on `transform` will interpolate the rotation through the wrong quadrant when the car turns.

**Fold without measuring:**

```css
.more { display: grid; grid-template-rows: 1fr; transition: grid-template-rows 360ms var(--sheet); }
.la[data-size="compact"] .more { grid-template-rows: 0fr; }
.more > div { overflow: hidden; min-height: 0; }
.la[data-size="compact"] .inner { opacity: 0; }
```

Forgetting `min-height: 0` on the child leaves the grid row stuck at content height.

**Announce minutes, not seconds:**

```js
const m = Math.ceil(left / 60);
if (m !== lastMin) { lastMin = m; live.textContent = `Ramesh is ${m} minute${m > 1 ? 's' : ''} away.`; }
```

Common mistakes:

- A dark glass card. This family is paper; the map behind is the texture.
- Animating the car with CSS `offset-path` and a fixed duration. It drifts away from the countdown the first time the ETA changes.
- Putting the ETA in the accent at 13px. It fails contrast; keep it 20px bold.
- Drawing a fake dynamic island for the compact state. Compact is the same card, folded.
- Announcing every tick to screen readers.
- Leaving the car on top of the pin with the pin hidden and no other arrival signal. The ring, word, and plate carry it.

Rebuild order:

1. Wallpaper layers and the fade, clock and date.
2. Card shell, header button, ETA block.
3. Map SVG with streets, both route paths, pin, car.
4. `place(p)` and the 250ms ticker with the 30s and 0s thresholds.
5. Driver row, plate, actions.
6. The fold, chevron, compact bar.
7. Live region, replay, reduced motion.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
