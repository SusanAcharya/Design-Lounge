---
title: "Larkspur paper boarding pass"
summary: "A wallet boarding pass on ivory paper stock: big IATA codes, a split-flap gate change with a one-line banner, a tear-off stub, and a Live activity strip."
platform: mobile-app
type: screen
category: utility
tags: [boarding-pass, wallet, travel, live-activity, press]
styles: [luxe, paper]
motion: subtle
difficulty: 2
featured: false
published: 2026-11-06
palette: ["#121417", "#F3EEE3", "#1F2328", "#8E2A1E", "#E9B44C"]
fonts: ["Tenor Sans"]
related: [card-boarding-pass]
---

# Larkspur paper boarding pass

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A phone wallet screen for one boarding pass from Larkspur, a fictional airline: flight LK 214, Lisbon to Copenhagen. The pass is a single material, ivory paper stock with a real fractal-noise grain and a letterpress highlight under every glyph, laid on a graphite ground. One family, Tenor Sans, carries everything through size and tracking alone. The language is iOS 26 without the glass: a plain back link, a pill control, a full-width secondary button in the thumb zone. Three moments are worth copying: a gate change that flips the gate value like a split-flap board and drops a one-line oxblood banner over the airline band; a stub that physically tears away along a dotted perforation with punched notches; and a Live control that grows into a lock-screen-style activity strip while the pass slides down behind it.

## Reference behaviour

1. Initial state: the pass shows LARKSPUR, LK 214, Thu 12 Nov; LIS 09:40 → CPH 14:15 with a dashed arc and "3h 35m"; Gate B14, Boards 09:05, Group 2, Seat 14A; Passenger Mara Oyelaran, Class Economy Plus; a perforation; the stub with Booking K7QF2M, SEQ 087 · 14A, a barcode and a Tear stub control. Under the pass: "Terminal 1 · Security / About 12 min wait" and "Pass updated / 08:51". The bottom button reads **Simulate gate change**.
2. Tap **Simulate gate change**: the gate value turns away on its X axis (0 → 90° in 250ms), the text changes to B22 at the halfway point, and it turns back in (−90° → 0) by 560ms. A saffron fill sits behind the value for the first 30% of 2.6s, then fades out. An oxblood banner wipes down over the airline band in 420ms: "Gate changed to B22 · 6 min walk from B14". "Pass updated" becomes 08:58. The button becomes **Reset gate**, which reverses all of it.
3. Tap **Live** (top right pill, 36px): the pill inverts to ivory; a near-black activity strip grows from the pill's corner (scale .32 × .2 → 1, 480ms iOS sheet curve) and the pass slides down 142px and settles at 96% scale. The strip shows an aircraft glyph, "Boarding · Group 1 now", the current gate (follows the gate change), "LK 214 · Lisbon 09:40 → Copenhagen 14:15", five group segments that fill in turn (group 1 full, group 2 at 38%, 90ms apart after a 200ms delay), and "Your group 2 · next" / "Doors close 09:25". The terminal line under the pass hides.
4. Tap Live again or press Escape: the strip shrinks back into the pill and the pass returns.
5. Tap **Tear stub**: the stub drops 12px, shifts 4px right and turns 2° around its upper-left area over 520ms, opening a graphite gap at the perforation; the control reads **Reattach stub**. Tap again to put it back.
6. The Simulate button sits above the pass in the stack, so it stays usable while the pass is pushed down.

## Structure

```
390 × 844 (54 safe top, 34 safe bottom, 20px gutters)
┌──────────────────────────────────────┐
│ 54 safe area                         │
│ ‹ Wallet                    (o LIVE) │  header 44
│┌────────────────────────────────────┐│  live strip (hidden): r28, overlays here
││ > Boarding · Group 1 now      B14 ││
││   LK 214 · Lisbon 09:40 → …       ││
││ ▬▬▬ ▬▭▭ ▭▭▭ ▭▭▭ ▭▭▭               ││
││ Your group 2 · next  Doors 09:25  ││
│└────────────────────────────────────┘│
│╭────────────────────────────────────╮│  sheet: paper, r22 top
││ * LARKSPUR                 LK 214  ││  band 64 (banner overlays it)
││                         THU 12 NOV ││
││────────────────────────────────────││
││ LIS   ·˙˙˙˙>˙˙˙˙·   CPH            ││  58px codes; arc flexes
││ LISBON   3h 35m     COPENHAGEN     ││
││ 09:40                     14:15    ││  26px times
││ ─────────┬────────┬───────┬─────── ││
││ GATE     │ BOARDS │ GROUP │ SEAT   ││  4 fields, 24px values
││ B14      │ 09:05  │ 2     │ 14A    ││
││ ─────────┴────────┴───────┴─────── ││
││ PASSENGER          CLASS           ││  17px values
││ Mara Oyelaran      Economy Plus    ││
o· · · · · · · · · · · · · · · · · · ·o  perforation: 24px notches, 2px dotted rule
││ BOOKING K7QF2M      SEQ 087 · 14A  ││  stub: paper, r22 bottom
││ ▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌ ││  barcode 310×72
││            x TEAR STUB             ││  40px
│╰────────────────────────────────────╯│
│ Terminal 1 · Security   Pass updated │  meta, 12/14px
│ About 12 min wait              08:51 │
│ (     ⇄  SIMULATE GATE CHANGE      ) │  50px pill, margin-top:auto
└──────────────────────────────────────┘
```

- `<main class="app">` flex column, `max-width:430px`, `padding:54px 20px 34px`, `overflow:hidden`.
- `<header>`: back `<button>` "Wallet" and `<button class="livebtn" aria-expanded aria-controls="la">`.
- `.stack` (flex 1, relative) holds `<section class="la" aria-label="Live activity">`, `<article class="pass">`, and `.meta`.
- `.pass` has two paper pieces: `.sheet` (band, banner `role="status"`, route grid, fields grid, people grid, `.perf`) and `.stub` (stub row, barcode `<svg role="img" aria-label="Boarding barcode">`, tear `<button aria-pressed>`). Each piece has its own grain `<svg>`.
- `.act` holds the Simulate button, `z-index` above the pass.
- A visually hidden `aria-live="polite"` paragraph for the gate announcement.

## Tokens

```css
:root {
  /* ground */
  --bg: #121417;          /* graphite; radial #22262B glow at top centre */
  --bg-2: #1B1E22;        /* pill and button fill */
  --hair: #3A3E44;        /* pill and button border */
  --on-bg: #E9E4DA;       /* text on graphite */
  --on-bg-2: #A9A59C;     /* secondary text on graphite (7.4:1) */
  /* paper */
  --paper: #F3EEE3;       /* ivory stock */
  --ink: #1F2328;         /* printed text, barcode */
  --ink-2: #5E5A52;       /* labels (6.0:1 on paper) */
  --rule: #D8D0C0;        /* hairlines on paper */
  --perf: #C4BAA6;        /* dotted perforation */
  --grain-opacity: .22;   /* feTurbulence 0.9, 2 octaves, multiply */
  /* accents */
  --ox: #8E2A1E;          /* airline mark, gate banner */
  --saffron: #E9B44C;     /* gate highlight, live glyph, focus ring */
  --live: #0A0B0D;        /* activity strip */
  --live-line: #262A30;   /* strip border */
  --go: #7CC79A;          /* live dot, boarding progress */
  --track: #2A2E34;       /* empty progress */
  /* type */
  --serif: "Tenor Sans", "Optima", system-ui, sans-serif;
  --fs-iata: 58px; --fs-time: 26px; --fs-field: 24px; --fs-people: 17px; --fs-live-gate: 22px;
  --fs-body: 14px; --fs-small: 13px; --fs-meta: 12px; --fs-city: 11px; --fs-label: 10px;
  /* radii */
  --r-pass: 22px; --r-live: 28px; --r-pill: 18px; --r-button: 25px; --r-highlight: 4px;
  /* shadows */
  --pass-shadow: drop-shadow(0 22px 22px rgba(0,0,0,.5)) drop-shadow(0 2px 3px rgba(0,0,0,.35));
  --letterpress: 0 1px 0 rgba(255,255,255,.55);
  --paper-edge: inset 0 1px 0 rgba(255,255,255,.7);
  /* motion */
  --sheet: cubic-bezier(0.32, 0.72, 0, 1);
  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-flip: 560ms; --t-highlight: 2600ms; --t-banner: 420ms; --t-live: 480ms; --t-push: 520ms; --t-tear: 520ms;
}
```

## Typography

One family, Tenor Sans 400. Hierarchy comes from size and tracking only.

| Role | Size / line | Tracking | Case |
|---|---|---|---|
| IATA codes | 58px / 0.9 | 0.01em | upper |
| Times | 26px, tabular | 0 | — |
| Field values (gate, seat…) | 24px | 0 | as written |
| Live gate | 22px | 0.04em | upper |
| Passenger / class values | 17px | 0 | title |
| Back link, live title | 15–16px | 0 | sentence |
| Banner, button, body | 14px | 0 (button 0.1em upper) | sentence |
| Brand LARKSPUR | 13px | 0.32em | upper |
| Flight, stub numbers | 13px | 0.08em | upper |
| City, stub labels | 11px | 0.2em | upper |
| Field labels | 10px | 0.2em | upper |
| Meta, live sub-lines | 12px | 0.04–0.06em | sentence |

## Motion

| What | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---|---|---|---|
| Gate flip | gate change | `rotateX` (perspective 200px) | 0 → 90° → −90° → 0 | 560ms | `--std` | text swaps at 250ms | no rotation, text swaps |
| Gate highlight | gate change | `background` | saffron (hold 30%) → transparent | 2600ms | `--std` | 0 | linear, same length |
| Banner | gate change | `clip-path` | `inset(0 0 100% 0)` → `inset(0)` | 420ms | `--expo` | 0 | appears at once |
| Live strip | Live | `transform`, `opacity` | scale(.32,.2) translateY(−36px), 0 → none, 1 | 480ms / 220ms | `--sheet` / `--std` | 0 | opacity 200ms only |
| Pass push | Live | `transform` | none → translateY(142px) scale(.96) | 520ms | `--sheet` | 0 | moves at once |
| Group fill | Live | `scaleX` per segment | 0 → 1, .38, 0, 0, 0 | 700ms | `--expo` | 200ms + n × 90ms | filled at once |
| Tear | Tear stub | `transform` | none → translate(4px,12px) rotate(2deg) | 520ms | `--sheet` | 0 | moves at once |
| Button press | `:active` | `scale` | 1 → .98 | 120ms | `--std` | 0 | same |

## States

- **Default**: gate B14, banner hidden (`visibility:hidden` and clipped), Live pill graphite with a green dot.
- **Gate changed**: banner visible over the band, gate B22 with a fading saffron fill, live strip gate B22, "Pass updated 08:58", button "Reset gate".
- **Live open**: pill inverted (ivory fill, graphite text), `aria-expanded="true"`, strip visible, pass pushed down, meta hidden.
- **Stub torn**: graphite gap at the perforation, `aria-pressed="true"`, label "Reattach stub".
- **Focus-visible**: 2px saffron outline at 3px offset; visible on both graphite and paper.
- **Pressed**: Simulate button scales to .98.

## Accessibility

- The pass is an `<article>` labelled "Boarding pass, Larkspur flight LK 214, Lisbon to Copenhagen"; every value is real text, not part of an image.
- Gate value is `aria-live="polite"`; the banner is `role="status"`; the hidden live region reads "Gate changed to B22, a 6 minute walk from B14."
- Live toggle: `aria-expanded` + `aria-controls="la"`; Escape closes the strip.
- Tear: a real `<button>` with `aria-pressed`.
- Barcode: `role="img"` with `aria-label="Boarding barcode"`.
- Contrast: `--ink-2` on paper 6.0:1; paper on oxblood 8.2:1; ink on saffron 8.6:1; `--on-bg-2` on graphite 7.4:1.
- Hit targets: back 40px tall, Live 36px tall by 76px wide (pad to 44 in production), Tear 40px, Simulate 50px.
- Labels stay at or above 64px wide (each field column is 77px) so nothing reads as a collapsed column.

## Responsive rules

- At 360 wide: IATA drops to 52px, the arc column shrinks (`1fr`, `min-width:0`), field values to 21px; the banner text stays on one line at 13px.
- Short screens (< 800): the app keeps `min-height:800px`; the meta row is the first thing to go (hide it under 760).
- Tablet: the column caps at 430px and centres; the pass never grows wider than 390px.

## Acceptance checklist

**Always**
- [ ] One material: every printed surface is the same ivory stock with grain and a letterpress highlight; no blur, no translucency.
- [ ] Pass is two paper pieces joined at a perforation with two 24px punched notches and a 2px dotted rule.
- [ ] The gate value flips on X and the text changes at the midpoint, never before the turn.
- [ ] Gate change shows one line, on one line, over the airline band, and is announced politely.
- [ ] Live grows from the pill's corner and pushes the pass down; Escape and the pill both close it.
- [ ] Live strip gate follows the gate change.
- [ ] Tearing the stub opens a real gap to the ground and can be undone.
- [ ] Closed banner and strip are `visibility:hidden`.
- [ ] Reduced motion: no rotation, no scale, no wipe; state still changes and is readable.
- [ ] `scrollWidth` stays 390; field labels have `white-space:nowrap`.

**This demo**
- [ ] LK 214, LIS 09:40 → CPH 14:15, 3h 35m, Thu 12 Nov.
- [ ] Gate B14 → B22, "6 min walk from B14"; Boards 09:05, Group 2, Seat 14A.
- [ ] Mara Oyelaran, Economy Plus, Booking K7QF2M, SEQ 087.
- [ ] Live: group 1 full, group 2 at 38%, doors close 09:25.

## Implementation notes

1. **Paper grain without an image.** An inline SVG with `feTurbulence` tinted through `feColorMatrix`, multiplied over the ivory fill, reads as stock rather than noise. Keep it one per paper piece so the torn stub keeps its grain.

```html
<svg class="grain" aria-hidden="true">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 .35  0 0 0 0 .3  0 0 0 0 .22  0 0 0 .9 0"/></filter>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>
<style>.grain{position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;opacity:.22;mix-blend-mode:multiply;pointer-events:none}</style>
```

2. **Split-flap gate.** Restart the animation by removing the class and forcing a reflow, then swap the text when the face is edge-on (45% of 560ms ≈ 250ms).

```css
@keyframes flip { 0% { transform: perspective(200px) rotateX(0) }
  45% { transform: perspective(200px) rotateX(90deg) } 55% { transform: perspective(200px) rotateX(-90deg) }
  100% { transform: perspective(200px) rotateX(0) } }
@keyframes hl { 0%, 30% { background: var(--saffron) } 100% { background: transparent } }
```
```js
gate.classList.remove('flip', 'hl'); void gate.offsetWidth; gate.classList.add('flip', 'hl');
setTimeout(() => { gate.textContent = 'B22'; liveGate.textContent = 'B22'; }, 250);
```

3. **Shadow on the pair, not the pieces.** A `box-shadow` on the top sheet falls across the stub and reads as a fold. Put one `filter: drop-shadow()` on the wrapper instead; the notches are circles painted in the ground colour, so they punch through cleanly and the torn gap casts its own shadow.

```css
.pass { filter: drop-shadow(0 22px 22px rgba(0,0,0,.5)) drop-shadow(0 2px 3px rgba(0,0,0,.35)); }
.perf i { position:absolute; bottom:-12px; width:24px; height:24px; border-radius:50%; background: var(--bg); }
.perf i:first-child { left:-12px } .perf i:last-child { right:-12px }
```

Common mistakes: a frosted-glass pass (this one is paper on purpose), a 64px IATA pair that runs off a 350px card (keep the arc column flexible), and a banner that wraps to two lines and shoves the route down.
