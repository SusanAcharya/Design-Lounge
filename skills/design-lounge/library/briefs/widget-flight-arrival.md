<!-- Design Lounge Nº 248 · "Flight arrival split-flap widget" · www.designlounge.live -->

# Flight arrival split-flap widget

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A flight status widget for a fictional airline, "Aerovale", tracking AV 218 from Kathmandu (KTM) to Bangkok (BKK). It borrows from airport wayfinding: a signage-yellow band, black board, condensed capitals, and split-flap cells for times, gate, terminal, belt, and status. A plane icon rides a dotted great-circle arc; the flown part is solid yellow. A "Simulate delay" switch under the widget pushes the arrival 45 minutes later and moves the gate. Every changed cell flips through the alphabet to its new character, so the board itself shows that something changed. The detail worth copying: the flaps are four half-height spans with two Web Animations, and the status colour is the only colour that changes; everything else stays signage black and yellow.

## Structure

```
1280 × 800 · body grid centred, padding 32px 16px · widget max 640px
┌─────────────────────────────────────────────────────────────┐
│ ✈ ARRIVALS                      AEROVALE AV 218   ● LIVE    │ band 48px, yellow
├─────────────────────────────────────────────────────────────┤
│ KTM          ╭──────✈ · · · · ╮                       BKK   │ codes 48px
│ Kathmandu   ●   3H 05M · 1,920 KM    ○              Bangkok │ arc viewBox 400×110
├─────────────────────────────────────────────────────────────┤ 1px rule
│ SCHEDULED     ESTIMATED     GATE   TERM  BELT               │ labels 10px
│ [1][4]:[3][5] [1][4]:[3][5] [B][7] [1]   [4]                │ cells 30×44
│ STATUS                                        LANDS IN      │
│ [O][N][ ][T][I][M][E][ ]                      1h 08m (40px) │
├─────────────────────────────────────────────────────────────┤
│ Cruising at 11,600 m over…              Seat 14A · Mina G.  │ footer 12px
└─────────────────────────────────────────────────────────────┘
          ( ◯— SIMULATE DELAY )   Local 13:27
```

- `main.wrap`: grid, gap 20px, max-width 640px.
- `article.w[aria-labelledby]`: radius 20px, `overflow: hidden`, 1px black border.
- `header.band`: icon, "Arrivals" label, flight name (the article's label), LIVE dot.
- `.route`: three-column grid `auto minmax(0,1fr) auto`, the arc SVG in the middle with `role="img"`.
- `dl.facts`: flex-wrap, gap 20px 28px. Each fact is a `div` with `dt` and `dd`. Each `dd` holds the cells and carries an `aria-label` with the plain value ("Gate C2"). Cells are `aria-hidden`.
- Lands-in fact: `margin-left: auto`, right-aligned, plain text, not flaps.
- `footer.foot`: note and passenger.
- Below: `button.tog[aria-pressed]` with a 32 × 18 switch, and the clock span.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Flap top half | value change | rotateX | 0 → −90° | 60ms | ease-in | instant swap |
| Flap bottom half | after top | rotateX | 90° → 0 | 60ms, delay 60ms | ease-out | instant swap |
| Cells in a field | value change | start time | +40ms each | — | — | none |
| Plane | each minute, delay toggle | translate + rotate along arc | prev → next | 600ms | `--expo` | instant |
| Flown arc | same | stroke-dashoffset | prev → next | 600ms | `--expo` | instant |
| LIVE dot | always | opacity | 1 → .2 | 2s | steps(1) | static |
| Switch thumb | toggle | translateX | 0 → 14px | 200ms | `--expo` | instant |
| Switch track | toggle | background | `#3a3934` → `--warn` | 200ms | `--std` | instant |

Cells flip through the sequence `" ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"`, starting after the current character, capped at 12 steps; step 12 lands on the target regardless.

## States

- **On time:** status green `ON TIME`, estimate in `--ink`, gate B7.
- **Delayed:** `.delayed` on the widget. Status orange `DELAYED`, estimate yellow `15:20`, gate C2, footer note changes, switch on.
- **Landed:** status `LANDED`, label "Landed" with the time, plane at the destination dot.
- **Cell flipping:** the cell is busy; new targets queue as `next`.
- **Switch hover:** background 6% → 10% white.
- **Focus-visible:** 2px `--sign` outline, 3px offset, on the switch.
- **Loading:** a real product shows every cell blank (`' '`) and the plane hidden until data arrives; then the load flip runs.
- **Error:** status flips to `NO DATA` in `--ink-3`, Lands in shows an em dash. Not shown in the demo.

## Accessibility

- The widget is an `article` labelled by the flight name.
- Each `dd` carries an `aria-label` with the readable value ("Estimated 15:20", "Gate C2", "Status delayed 45 minutes"). The cells are `aria-hidden`, so screen readers never hear "one four three five".
- The arc is `role="img"`, `aria-label="Flight progress"`; the progress itself is spoken by "Lands in".
- A polite live region announces the delay, the recovery, and the landing. It does not announce each minute.
- The switch is a `button` with `aria-pressed`; its label is "Simulate delay".
- Status colour is never alone: the word changes too.
- Contrast: `--ink` on `--cell` 15:1. `--ok` on `--cell` 10:1. `--warn` on `--cell` 6.4:1. `--sign-ink` on `--sign` 12:1. `--ink-3` labels on `--board` 5.5:1.
- Switch hit target 40px tall.

## Responsive rules

- **≥ 1024:** widget 640px. Facts in two rows: times, gate, term, belt on the first; status and Lands in on the second.
- **768:** same; the widget is narrower than the viewport, nothing changes.
- **< 640:** cells shrink to 22 × 34 with a 23px glyph. Codes 34px. Paddings 16px. The "Arrivals" word and the arc caption hide. Facts wrap to three rows; Lands in drops to the left at 30px. Footer stacks.
- The widget never exceeds the viewport: width 100%, max 640px, `overflow-x: hidden` on body as a guard.
- Cell size lives in three custom properties, so one media query rescales every flap.

## Acceptance checklist

### Always

- [ ] Every changing value is drawn in split-flap cells with a 1px seam at 50% height.
- [ ] A changed cell flips through intermediate characters, 120ms per step, at most 12 steps.
- [ ] Cells within one field stagger by 40ms.
- [ ] A value arriving mid-flip is queued, not dropped.
- [ ] The plane rotates to the arc tangent; the flown part of the arc is solid, the rest dotted.
- [ ] A delay changes estimate, gate, status word, status colour, and the note together.
- [ ] Fields have plain-language `aria-label`s; cells are `aria-hidden`.
- [ ] A polite live region announces delay, recovery, and landing only.
- [ ] Reduced motion: no flips, no blinking, no plane glide; values still update.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Aerovale AV 218, KTM Kathmandu → BKK Bangkok, 3H 05M · 1,920 KM.
- [ ] Scheduled 14:35, on-time gate B7, delayed 15:20 at gate C2, Term 1, Belt 4.
- [ ] Band `#ffc72c` 48px; board `#121211`; cells 30 × 44.
- [ ] ON TIME `#8fd694`, DELAYED `#ff7a45`, delayed estimate `#ffc72c`.
- [ ] Clock starts at 13:27 and advances one minute per 1.5s.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the widget is centred on a dark floor with a faint 96px grid. Band reads "ARRIVALS · AEROVALE AV 218 · ● LIVE". The plane sits 63% along the arc (117 of 185 minutes flown). Flaps: Scheduled `14:35`, Estimated `14:35`, Gate `B7`, Term `1`, Belt `4`, Status `ON TIME` in green. Right of status, "LANDS IN 1h 08m" in 40px condensed. Footer: "Cruising at 11,600 m over the Bay of Bengal" and "Seat 14A · Mina Gurung". Under the widget: the switch and "Local 13:27".
2. On load every cell flips from blank to its value, staggered 40ms per cell inside each field.
3. A simulated clock advances one minute every 1.5s. Each minute: the plane and the solid arc move forward (600ms expo out), "Lands in" counts down, the clock text updates. The LIVE dot blinks on a 2s step.
4. Toggle "Simulate delay" on: the switch thumb slides and turns orange. Estimated flips to `15:20` and turns yellow, Gate flips to `C2`, Status flips to `DELAYED` in orange. Progress is now measured against the later arrival, so the plane eases back along the arc. The footer reads "Holding east of BKK for runway slot". A live region says "AV 218 delayed 45 minutes. New arrival 15:20, gate C2."
5. Toggle off: everything flips back to the on-time values and the region says "AV 218 back on time. Arrival 14:35, gate B7."
6. When the clock reaches the arrival: plane at BKK, arc fully yellow, Status flips to `LANDED`, label reads "LANDED" with the arrival time, footer "Taxiing to gate B7". Five seconds later the clock resets to 13:27 and the board flips back.
7. A cell flips at most 12 steps toward its target, 120ms per step (60ms top half down, 60ms bottom half up). If a new value arrives mid-flip, the cell finishes and then flips on to the newest value.
8. Reduced motion: cells change instantly, the plane and arc jump, the LIVE dot does not blink, the switch snaps. The clock still runs.

## Tokens

```css
:root {
  --floor: #24231f;    /* page */
  --board: #121211;    /* widget */
  --cell: #1f1f1d;     /* flap bottom half */
  --cell-hi: #2a2a27;  /* flap top half, catches light */
  --seam: #050505;     /* 1px split line */
  --ink: #f4f1e6;      /* flap characters, codes */
  --ink-2: #b9b5a8;    /* city names, footer */
  --ink-3: #8e8a7e;    /* labels, dotted arc */
  --line: #2e2d29;     /* rules */
  --sign: #ffc72c;     /* band, flown arc, focus, changed estimate */
  --sign-ink: #141310; /* text on the band */
  --ok: #8fd694;       /* ON TIME */
  --warn: #ff7a45;     /* DELAYED, switch on */

  --cond: "Barlow Condensed", system-ui, sans-serif;
  --mono: "Overpass Mono", ui-monospace, monospace;

  --cw: 30px; --ch: 44px; --cf: 30px;   /* cell width, height, glyph */
  --cell-gap: 3px;
  --r-widget: 20px; --r-cell: 4px;

  --std: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-flip-half: 60ms;   /* ×2 per step */
  --t-stagger: 40ms;     /* per cell */
  --t-plane: 600ms;
  --tick: 1500ms;        /* one simulated minute */
}
```

Widget shadow: `0 40px 80px -40px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.05)`. Floor: two 96px grids of 1px lines at 3.5% white over a radial `#2f2d27 → --floor`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Band label, flight | Barlow Condensed | 20px | 700 / 600 | 1 | 0.06em / 0.04em | UPPER |
| LIVE | Overpass Mono | 11px | 600 | 1 | 0.1em | UPPER |
| Airport code | Barlow Condensed | 48px | 700 | 0.9 | 0.01em | UPPER |
| City | Overpass Mono | 12px | 400 | 1.4 | 0 | Title |
| Arc caption | Overpass Mono | 10px | 400 | — | 0.06em | UPPER |
| Fact label | Overpass Mono | 10px | 600 | 1.4 | 0.14em | UPPER |
| Flap glyph | Barlow Condensed | 30px | 600 | 44px | 0 | UPPER |
| Lands in | Barlow Condensed | 40px | 700 | 44px | 0.01em | tabular |
| Footer | Overpass Mono | 12px | 400 | 1.4 | 0 | Sentence |
| Switch label | Overpass Mono | 12px | 600 | 1 | 0.06em | UPPER |

## Implementation notes

**A flap cell is four half-height spans that print their character with `attr()`.** The two static halves show "new on top, old on bottom"; the two flaps rotate over them.

```css
.c { position: relative; width: var(--cw); height: var(--ch); perspective: 200px; }
.c span { position: absolute; left: 0; right: 0; height: 50%; overflow: hidden; backface-visibility: hidden; background: inherit; }
.c span::before { content: attr(data-ch); position: absolute; inset-inline: 0; height: var(--ch); line-height: var(--ch); text-align: center; }
.c .t, .c .ft { top: 0; transform-origin: 50% 100%; background: var(--cell-hi); }
.c .b, .c .fb { bottom: 0; transform-origin: 50% 0; }
.c .b::before, .c .fb::before { top: calc(var(--ch) / -2); }   /* show the lower half of the glyph */
.c .ft, .c .fb { z-index: 2; visibility: hidden; }
.c::after { content: ""; position: absolute; inset-inline: 0; top: 50%; height: 1px; background: var(--seam); z-index: 3; }
```

```js
function flipOnce(c, from, to) {
  const [t, b, ft, fb] = c.children;
  t.dataset.ch = to; b.dataset.ch = from; ft.dataset.ch = from; fb.dataset.ch = to;
  ft.style.visibility = fb.style.visibility = 'visible';
  ft.animate([{ transform: 'rotateX(0)' }, { transform: 'rotateX(-90deg)' }], { duration: 60, easing: 'ease-in', fill: 'forwards' });
  return fb.animate([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0)' }],
    { duration: 60, delay: 60, easing: 'ease-out', fill: 'forwards' })
    .finished.then(() => { setCh(c, to); ft.style.visibility = fb.style.visibility = 'hidden'; });
}
```

**Progress is time, not distance.** `p = (now − departure) / (estimated − departure)`. When the delay adds 45 minutes, `p` drops and the plane eases back. That is honest: the widget re-estimates.

**Queue, don't interrupt.** Toggling the switch twice quickly would otherwise leave half a board in the old state:

```js
async function flipTo(c, to) {
  if (c.busy) { c.next = to; return; }
  c.busy = true;
  /* step through SEQ with await flipOnce(...) */
  c.busy = false;
  if (c.next) { const n = c.next; c.next = null; flipTo(c, n); }
}
```

Common mistakes:

- Flipping the whole cell as one 3D card. Real split-flaps hinge at the middle; the top half falls and reveals the new bottom.
- Reading the digits aloud cell by cell. Label the field, hide the cells.
- Using yellow for everything. Yellow is signage (band, flown arc, changed estimate); green and orange are status only.
- Animating the plane with a fixed-duration CSS path animation. It can't go backwards when the estimate changes.
- Letting the cells reflow at 375px. Shrink them with the three size variables instead.

Rebuild order:

1. Floor, widget shell, band.
2. Route row with codes and the arc SVG; `place(p)` for the plane and dashoffset.
3. The cell component and `board(name, text, width)` that creates and flips cells.
4. Facts list with labels and the Lands-in readout.
5. Simulated clock, landed state, reset.
6. Delay switch, colour states, live region.
7. Mobile sizes and reduced motion.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
