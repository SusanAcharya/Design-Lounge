<!-- Design Lounge Nº 300 · "Lock screen delivery live update" · www.designlounge.live -->

# Lock screen delivery live update

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A live activity on the phone's lock screen for "Haulbird", a fictional courier app, while an order is on its way. A compact cream card shows the ETA in big type, the current stage and a four-stop track with a scooter riding along it. Tap it and it expands to a small map with the route drawn behind the courier, the courier's name and plate, call and message buttons, and a "Leave at the door" switch. Stage changes also send short notices that stack above the card. When the courier arrives the card switches to "At your door" and offers one big "Coming down" button. The look is a riso wallpaper (deep teal, an ochre sun, two hills, fine grain) under a paper card with one tomato accent. The detail worth copying is that the lock-screen clock shrinks to 62% when the card expands. The card can then grow upward without covering the time.

## Structure

```
390 × 844 (Lounge draws status bar)
┌──────────────────────────────────────┐
│          Thursday 8 October          │ top 70
│               18:24                  │ 100px, → scale .62 when expanded
│                        (sun)         │
│ ┌──────────────────────────────────┐ │ stack: left/right 12, bottom 116
│ │[■] Haulbird                  now │ │ notice row (0fr ↔ 1fr)
│ │    Dawit picked up your order…   │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │ live activity, r 28
│ │[■] HAULBIRD · ORDER 4471     (⌄) │ │
│ │ Arriving in 12 min       ETA     │ │ 38px / 800
│ │                          18:36   │ │
│ │ Dawit is on the way · 2.4 km     │ │
│ │   ●━━━━━━(🛵)─────○──────○       │ │ dots at 12.5/37.5/62.5/87.5%
│ │ ORDERED PACKED ON THE WAY DOOR   │ │
│ │ ┌──────────────────────────────┐ │ │ map 136px, r 18 (expanded)
│ │ │  roads · river · route · pin │ │ │
│ │ └──────────────────────────────┘ │ │
│ │ (D) Dawit Haile        (✆) (▭)  │ │ 44px
│ │ [ Leave at the door      (○  ) ] │ │ 48px
│ └──────────────────────────────────┘ │
│   (torch)                 (camera)   │ 52px, bottom 44
│ (34px)                               │
└──────────────────────────────────────┘
```

- The clock is decoration (`aria-hidden`). The Lounge's status bar is above it.
- The stack is a bottom-anchored flex column: notice row, then the card. A taller card pushes the notice up and nothing overlaps.
- The notice is `role="status"`.
- The live activity is a `section` labelled "Haulbird delivery, live". The whole header area is one `button aria-expanded aria-controls`.
- The map is `role="img"` with a text label. The SVG route uses `viewBox="0 0 326 150"` with `preserveAspectRatio="none"`. The pin is an HTML element positioned from `getPointAtLength`.
- The door control is `button role="switch" aria-checked`.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Card | arrive | translateY, opacity | 40px, 0 → 0, 1 | 600ms | `--expo` | 1ms |
| Card | done | translateY, opacity | 0 → 30px, 1 → 0 | 600ms | `--expo` | 1ms |
| Details | expand | grid-template-rows | 0fr → 1fr | 440ms | `--sheet` | 1ms |
| Details content | expand | opacity | 0 → 1 | 300ms, delay 120ms | `--ease` | 1ms |
| Chevron | expand | rotate | 0 → 180° | 360ms | `--sheet` | 1ms |
| Clock | expand | scale (origin top) | 1 → .62 | 440ms | `--sheet` | 1ms |
| Notice row | new notice | grid rows, translateY, scale | 0fr, 10px, .96 → 1fr, 0, 1 | 400ms | `--sheet` / `--expo` | 1ms |
| Track fill, scooter | each minute | width, left | prev → next % | 500ms | `--ease` | 1ms |
| Map pin, trail | each minute | position, dashoffset | prev → next | set per tick | — | same |
| Pin ring | always while moving | scale, opacity | 1 → 2, .8 → 0 | 2s loop | `--ease` | removed |
| Switch thumb | toggle | translateX | 0 → 20px | 240ms | `--sheet` | 1ms |

The ETA ticks once a minute in a real build. Nothing in the card animates between ticks except the pin ring.

## States

- **On the way (stage 2):** the tomato puck sits between Packed and Door, and the minutes are tomato ink.
- **Around the corner (≤ 2 min):** the stage line changes, and the notice fires once.
- **Arriving now (1 min):** the headline reads "Arriving now".
- **At door (stage 3):** the headline is ink, every dot is filled, the door row is hidden, and "Coming down" shows. The stage line follows the door switch.
- **Collapsed / expanded:** `aria-expanded` on the header button. The clock is scaled only while expanded.
- **Done:** the card is gone, a final notice shows, and "Order again" appears.
- Call and message buttons: `--card-2` fill, `--line` on hover, scale .93 on press.
- Switch on: track `--ink`, thumb moved 20px.
- Focus-visible: 2px `#ffcf7a` outline, 3px offset. It reads on both the teal wallpaper and the cream card.

## Accessibility

- The header button names the region. Its content is read in order: brand and order, the ETA, the stage. `aria-expanded` reports the state.
- Collapsed details are `tabindex=-1`, so Tab does not reach hidden buttons.
- The notice is `role="status"` (polite). A separate live region announces "Dawit is 2 minutes away.", "Dawit is at your door.", "Delivered." and switch changes. The minute ticks are not announced.
- The map has `role="img"` and the label "Map: courier on Kiln Street heading to your door". It is never the only place the street appears.
- The courier buttons are labelled "Call Dawit" and "Message Dawit".
- The door switch has `role="switch"` and `aria-checked`. Its visible text is its name.
- Escape collapses the card.
- Hit targets: the header button is the full card width and at least 116px tall. Call and message are 44px, the door row 48px, Coming down 48px, and the dock buttons 52px.
- Contrast: `#1a1714` on `#f5eddf` is about 15:1, `#4f473d` about 8:1, `#7a6f61` about 4.6:1. Tomato ink `#c23a12` on the card is about 5:1. The cream clock on teal is about 11:1.

## Responsive rules

- 390 × 844: as specified.
- 360 wide: the headline shrinks through its clamp and stays on one line. The plate ellipsises. The track labels are a 4-column grid, so they stay under their dots.
- Under 760 tall: the clock starts at 58px from the top and 80px tall, the stack bottom is 96px, the dock bottom 34px, and the map 104px.
- The card is never taller than the space under the scaled clock. If a product needs more, drop the map, not the courier row.
- Tablet lock screen: the card max width is 420px, centred.

## Acceptance checklist

### Always

- [ ] The ETA is the largest thing in the card, in minutes, with the absolute arrival time beside it.
- [ ] The four stages are always visible, the current stage is labelled, and a marker shows progress inside the current stage.
- [ ] The card expands and collapses from one header button with `aria-expanded`, and the details are unfocusable when collapsed.
- [ ] Expanded shows the map, courier, call and message, and a delivery preference.
- [ ] The lock clock shrinks while the card is expanded, so the stack never covers it.
- [ ] Stage-change notices stack above the card and dismiss themselves after about 3.6s.
- [ ] Arrival replaces the preference with one primary hand-off button.
- [ ] Minute ticks are silent. Stage changes are announced.
- [ ] Hit targets are 44px or more. No horizontal scroll at 360.
- [ ] Reduced motion keeps every state and removes travel and pulses.

### This demo

- [ ] "Haulbird · order 4471", courier "Dawit Haile", "Blue scooter · KL 22 HB", pickup "Larkin Bakehouse".
- [ ] Clock "18:24" counting to "18:36". ETA fixed at 18:36 from 12 min.
- [ ] Wallpaper `#0f3b3a` with the ochre sun `#f0a63a`, card `#f5eddf`, tomato `#ff5b2e`.
- [ ] Streets in order: Mill Lane, Ropewalk, Kiln Street, Your street.
- [ ] Arrival button "Coming down", replay "Order again".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The wallpaper fills the frame: a teal gradient, an ochre 64px-radius sun at 74% / 30%, two teal hills at the bottom, and 3px dot grain at 22% overlay.
2. The lock clock is centred: "Thursday 8 October" at 21px/600 over "18:24" at 100px/800, cream `#fff6e8`, starting 70px from the top.
3. On load the live activity rises from translateY(40px) and fades in over 600ms with expo-out. It is anchored at the bottom with 12px side insets and sits 116px above the bottom edge, above the torch and camera buttons.
4. 700ms later a notice drops into the stack above the card: an app tile, "Haulbird", "Dawit picked up your order from Larkin Bakehouse.", "now". The row opens with a grid-rows transition and the notice scales from .96. It leaves after 3.6s.
5. At 1.3s the card expands on its own to show the full layout (the hero state). The clock scales to .62 from its top centre over 440ms.
6. Compact card content:
   - The header row: a 20px tomato tile and "HAULBIRD · ORDER 4471" in mono caps, with a 28px chevron on the right.
   - "Arriving in **12 min**" at 38px/800, with the minutes in tomato ink. "ETA 18:36" is on the right.
   - "Dawit is on the way · 2.4 km".
   - A track with four dots at 12.5%, 37.5%, 62.5% and 87.5%, a dark fill and a 30px tomato scooter puck.
   - Labels under the dots: ORDERED, PACKED, ON THE WAY, DOOR. The current one is dark.
7. Expanded adds:
   - A 136px map in a 18px-radius frame: beige blocks, cream roads, a teal river, and a dotted tomato route from the courier to a dark home tile. The ridden part of the route is drawn solid ink behind the scooter pin.
   - The scooter pin is 34px with a pulse ring. A street label sits bottom left ("Kiln Street").
   - The courier row: a 44px "D" avatar, "Dawit Haile", "Blue scooter · KL 22 HB", and 44px call and message buttons.
   - A 48px "Leave at the door" row with a "Photo on drop-off, no knock" sub line and a 52×32 switch.
8. The ETA counts down one minute every 2.4s (demo speed). The lock clock advances in step, and the ETA time stays fixed at 18:36. The scooter moves along the track and the pin moves along the map route. The ridden trail grows and the street label changes (Mill Lane, Ropewalk, Kiln Street, Your street).
9. At 2 min: a notice reads "Dawit is 2 minutes away. Get ready." The stage line reads "Dawit is around the corner · 0.4 km". At 1 min the ETA reads "Arriving **now**".
10. At 0:
    - The stage becomes Door, the puck reaches 87.5% and every dot fills.
    - The headline reads "At your door" and the stage line reads "Dawit is outside · gate 2", or "Left at the door · photo sent" if the switch is on.
    - The door row hides and a 48px dark "Coming down" button replaces it.
    - A notice reads "Dawit is outside".
    - If the card was collapsed, it expands.
11. Tap the card header to collapse or expand. The details open with `grid-template-rows: 0fr → 1fr` over 440ms. The inner content fades in 120ms later and the chevron rotates 180°.
12. Call shows a notice: "Calling Dawit…", "Masked number. Dawit never sees yours." Message shows "Message sent", "“Gate code is 4471, flat 3 on the left.”"
13. The door switch flips `aria-checked` and the live region confirms "Dawit will leave it at the door."
14. Coming down: the card drops 30px and fades. A notice reads "Enjoy. Rate Dawit later in the app." Then an "Order again" pill appears between the torch and camera. It replays from step 3.
15. The torch button toggles `aria-pressed`. The camera is decoration.
16. Escape collapses an expanded card.

## Tokens

```css
:root {
  /* wallpaper */
  --wall: #0f3b3a;
  --wall-2: #0a2a29;
  --sun: #f0a63a;
  --hill: #145250;
  --hill-2: #1b6a63;
  --lock: #fff6e8;        /* clock, date, dock icons */

  /* card */
  --card: #f5eddf;
  --card-2: #ebe0cc;      /* chevron, call buttons, door row */
  --ink: #1a1714;
  --ink-2: #4f473d;
  --ink-3: #7a6f61;
  --line: #d8cbb4;        /* track rail, switch off */

  /* accent and map */
  --tomato: #ff5b2e;      /* app tile, scooter, route dots, pin */
  --tomato-ink: #c23a12;  /* minutes in the headline */
  --road: #fbf6ec;
  --block: #e4d8c1;
  --river: #9cc6bd;
  --focus: #ffcf7a;

  --display: "Darker Grotesque", system-ui, sans-serif;
  --mono: "Red Hat Mono", ui-monospace, monospace;

  --r-card: 28px;
  --r-notice: 20px;
  --r-map: 18px;
  --stack-bottom: 116px;

  --sheet: cubic-bezier(.32, .72, 0, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Notes |
| --- | --- | ---: | ---: | ---: | --- |
| Clock | Darker Grotesque | 100px | 800 | 1 | −0.03em, tabular |
| Date | Darker Grotesque | 21px | 600 | 1.3 | |
| ETA headline | Darker Grotesque | clamp(30px, 9.6vw, 38px) | 800 | 1 | −0.02em, no wrap |
| ETA time | Darker Grotesque | 24px | 800 | 1 | |
| Courier name | Darker Grotesque | 19px | 700 | 1.05 | |
| Stage line, door label | Darker Grotesque | 17px | 600–700 | 1.3 | |
| Notice title | Darker Grotesque | 17px | 700 | 1.1 | |
| Notice body | Darker Grotesque | 15px | 500 | 1.3 | one line, ellipsis |
| Header caps | Red Hat Mono | 11px | 500 | 1 | 0.06em, upper |
| Stage labels | Red Hat Mono | 10.5px | 500 | 1 | 0.04em, upper |
| Plate, sub lines, map label | Red Hat Mono | 11–12px | 400–500 | 1.3 | |

Darker Grotesque is tight and tall. At 800 it gives the ETA presence without needing width. Data that a system produced (order number, plate, stages) is mono.

## Implementation notes

**Bottom-anchored stack, not absolute layers.** Put the notice row and the card in one flex column anchored to the bottom. Then expansion and new notices push upward instead of overlapping.

```css
.stack { position: absolute; left: 12px; right: 12px; bottom: 116px; display: flex; flex-direction: column; }
.nwrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .4s var(--sheet); }
.nwrap.on { grid-template-rows: 1fr; }
.nwrap > div { min-height: 0; overflow: hidden; }
.more { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .44s var(--sheet); }
.la.open .more { grid-template-rows: 1fr; }
body.tall .lock time { transform: scale(.62); }   /* transform-origin: 50% 0 */
```

**Move the pin along the SVG route.** Keep the route in SVG units and place an HTML pin, so it stays round when the SVG stretches.

```js
const LEN = route.getTotalLength();
trail.style.strokeDasharray = LEN;            // solid copy of the route
function placePin(prog) {                     // prog 0..1
  const p = route.getPointAtLength(LEN * prog), box = map.getBoundingClientRect();
  pin.style.left = (p.x / 326 * box.width) + 'px';
  pin.style.top  = (p.y / 150 * box.height) + 'px';
  trail.style.strokeDashoffset = LEN * (1 - prog);
}
```

Call `placePin` again after expanding. While collapsed the map has no size.

**On iOS this is ActivityKit, on Android an ongoing notification.** The card is a Live Activity with a compact and an expanded presentation. Updates come by push, not polling, and you get only a few per minute, so design each state to be complete without animation between pushes. On the web or in-app, the same component works as a pinned banner.

Common mistakes:

- An ETA as a time only ("18:36"). People read minutes first.
- A progress bar with no stops. Couriers wait at the shop, so show the stage.
- A full interactive map on a lock screen. A static route with a pin is enough.
- Letting the expanded card cover the clock.
- Announcing every minute to screen readers.
- Tomato on everything. It is the brand tile, the scooter and the route. Text stays ink.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
