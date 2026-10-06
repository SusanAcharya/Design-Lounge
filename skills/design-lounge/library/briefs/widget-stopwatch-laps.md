<!-- Design Lounge Nº 277 · "Industrial stopwatch with lap log" · www.designlounge.live -->

# Industrial stopwatch with lap log

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A lap timer drawn as a piece of track-side hardware: a dark bolted housing with four screws, an engraved plate, a hazard stripe, two recessed amber-phosphor screens and three physical keycaps. The left screen shows the running time in a big pixel face with centiseconds, plus current lap, best lap and average lap. The right screen is a lap log, newest first, with the best lap in green and the worst in red, each tagged in text. Space starts and stops, L laps, R resets. It fits a coaching tool, a speed-run overlay or a lab bench app. The detail worth copying is that the keycaps physically depress when you use the keyboard shortcut, so the hardware and the keys feel like one device.

## Structure

```
1280 × 800, unit width min(960px, 100vw − 32px), centred
┌─●──────────────────────────────────────────────────────────────●─┐ housing r14
│ KRONIK ST-40 · LAP TIMER        ////         TRACK 2 · 400 M REPS│ plate 11px
│ ┌──────────── main screen (1fr) ────────────┐ ┌─ laps (300px) ──┐│
│ │ ● RUN  ○ HOLD  LAP 06                     │ │ #  LAP    TOTAL ││
│ │                                           │ │ 05 41.10 03:26.12│
│ │  03:54.83   (168px / 96px VT323)          │ │ 04 39.88 BEST … ││
│ │                                           │ │ 03 42.37 WORST… ││
│ │ CURRENT LAP   BEST LAP   AVG LAP          │ │ 02 40.95 …      ││
│ │ 00:28.71      39.88      41.22  (34px)    │ │ 01 41.82 …      ││
│ └───────────────────────────────────────────┘ └─────────────────┘│
│ ┌──── STOP · Space (1.6fr) ────┐ ┌─ LAP · L ─┐ ┌─ RESET · R ─┐  │ keys 64px
└─●──────────────────────────────────────────────────────────────●─┘
padding 28px 32px 30px; bay gap 16px; keys gap 14px, margin-top 20px
```

- The housing is a `section` labelled by the model name. Screws, the hazard stripe and the status LEDs are `aria-hidden`.
- The readout is `aria-hidden`; a visually hidden `p role="timer"` carries "3 minutes 54 seconds", updated once per second.
- The lap log is an `ol` labelled "Laps, newest first"; each `li` is a 3-column grid (number, lap, total).
- Keys are three `button`s with `aria-keyshortcuts` and a visible `kbd` legend.
- A visually hidden `aria-live="polite"` paragraph announces laps and state changes.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Readout | rAF while running | text | — | every frame | — | same (information) |
| RUN LED | running | opacity | 1 ↔ .35 | 1s, steps(2) loop | stepped | steady on |
| New lap row | lap | opacity, translateY | 0, −8px → 1, 0 | 260ms | --ease | instant |
| Key press | :active or `.down` | translateY, shadow | 0, 5px → 5px, 0 | 90ms | --ease | instant |
| Key disabled | state | opacity | 1 → .4 | 160ms | --ease | instant |

## States

- Running: RUN LED lit and blinking with an 8px amber glow; go key is grey with amber "STOP"; Lap enabled; Reset disabled.
- Stopped: HOLD LED lit; go key amber gradient (`#ffbf5c → #e89a26`) with dark "RESUME" (or "START" at zero); Lap disabled; Reset enabled.
- Disabled key: 40% opacity, `not-allowed` cursor, no press travel.
- Best row: lap value and tag in `--best` with a green glow. Worst row: `--worst` with a red glow. The total column stays `--amber-mid`.
- Empty log: one 11px uppercase line, "No laps yet · press L while running".
- Focus-visible: 2px amber outline, offset 3px, on keys.
- Hover on keys: gradient lightens one step.

## Accessibility

- Keys are real buttons with `aria-keyshortcuts="Space"`, `"L"`, `"R"`, and the shortcut printed on the cap.
- The Space shortcut is ignored when a button has focus (that button's own Space activation wins), so focus + Space never double-toggles.
- Laps are announced politely: "Lap 6, 00:41.20, best lap". Start and stop are announced as "Running" / "Stopped at 03:54.83".
- The spoken timer is updated once per second, not per frame, and is `aria-live="off"`.
- Best and worst are never colour-only: each carries a "BEST" / "WORST" text tag.
- Contrast: amber `#ffb23f` on `#0d0e0f` ≈ 11:1; `--amber-mid` ≈ 5:1; key labels `#e3e4e6` on `#2b2d30` ≈ 11:1. Keys are 64px tall.

## Responsive rules

- ≥1280 and 1024: as drawn, unit 960px.
- 768: same two-screen bay; unit shrinks to viewport − 32px.
- ≤820: screens stack (lap log below the readout, max-height 220px, scrolls); the plate drops the hazard stripe and the track label; readout uses 25vw / 15vw; split values 26px; keys become three equal columns.
- 375: verified with no horizontal overflow; the unit fits in 812px height.

## Acceptance checklist

### Always

- [ ] Elapsed time comes from `performance.now()` minus a start mark; stopping stores the elapsed value and resuming re-bases from it.
- [ ] Readout shows centiseconds and updates per frame while running.
- [ ] Lap time is the difference from the previous lap total, not the absolute time.
- [ ] Best and worst are recomputed on every lap and only shown once there are two laps.
- [ ] Space toggles, L laps (only running), R resets (only stopped); `e.repeat` is ignored.
- [ ] Shortcuts visibly depress the matching keycap.
- [ ] Newest lap is on top; the list scrolls when it is longer than the screen.
- [ ] Best/worst carry text tags, not colour alone.
- [ ] Reduced motion keeps the digits updating but removes blink, slide and key travel.

### This demo

- [ ] Plate "KRONIK ST-40 · Lap timer" and "Track 2 · 400 m reps".
- [ ] Seed laps 41.82, 40.95, 42.37, 39.88, 41.10; best is lap 04, worst is lap 03.
- [ ] Phosphor amber `#ffb23f` on `#0d0e0f`, best `#8ee07a`, worst `#ff6a55`.
- [ ] Go key 1.6fr wide, Lap and Reset 1fr.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame is a session in progress and running: total around 03:54, five laps logged (41.82, 40.95, 42.37, 39.88, 41.10), current lap about 27 seconds in, RUN LED blinking, "Lap 06" on the status line.
2. The main readout updates every animation frame: `mm:ss` at 168px and `.cc` at 96px.
3. Below it: Current lap (`mm:ss.cc`), Best lap (`ss.cc`) and Avg lap (`ss.cc`).
4. Lap (button or L) is only active while running. It appends the time since the previous lap, re-ranks best and worst, and slides the new row in at the top of the log (260ms, from −8px and transparent).
5. With two or more laps, the fastest row is green with a "BEST" tag and the slowest is red with a "WORST" tag. With one lap, neither is flagged.
6. Stop (button or Space) freezes the readout, lights the HOLD LED, turns the go key amber with the label "Resume", disables Lap and enables Reset.
7. Reset (button or R) only works while stopped. It clears the laps, sets 00:00.00, the go key reads "Start", best and average show "--", and the log shows "No laps yet · press L while running".
8. A keyboard shortcut visibly presses the matching keycap for 120ms (`.down` class) as if it were clicked.
9. Auto-repeat is ignored: holding L does not add a lap per repeat.
10. Reduced motion: the RUN LED stops blinking (stays lit), rows appear without sliding, keys don't travel. The digits still update; they are information.

## Tokens

```css
:root {
  --room: #2a2b2d;       /* page, with 45° hairline hatching */
  --body: #1b1c1e;       /* housing bottom */
  --body-2: #232427;     /* housing top */
  --screen: #0d0e0f;     /* phosphor screen */
  --steel: #8d9198;      /* engraved labels */
  --steel-2: #5c6066;
  --line: #33353a;
  --amber: #ffb23f;      /* phosphor, go key */
  --amber-dim: #3a2a12;  /* unlit LED */
  --amber-mid: #a8742b;  /* secondary screen text */
  --best: #8ee07a;
  --worst: #ff6a55;
  --pixel: "VT323", ui-monospace, monospace;
  --mono: "Red Hat Mono", ui-monospace, monospace;
  --ease: cubic-bezier(.2,.7,.2,1);
}
```

Spacing: 2, 4, 7, 8, 12, 14, 16, 18, 20, 24, 28, 32. Radii: housing 14px, screens 8px, keys 8px, tags 2px.

## Typography

| Role | Family | Size / line | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Main mm:ss | VT323 | 168px (min with 22vw) / .8 | 400 | 0 | tabular |
| Centiseconds | VT323 | 96px (min with 13vw) | 400 | 0 | — |
| Split values | VT323 | 34px / 1 | 400 | 0 | — |
| Lap rows | VT323 | 24px / 1 | 400 | 0 | — |
| Plate, status, headers | Red Hat Mono | 10.5–11px | 400–700 | .12–.2em | Upper |
| Key labels | Red Hat Mono | 14px | 700 | .12em | Upper |
| Key legends | Red Hat Mono | 10.5px | 500 | .12em | — |
| Best/Worst tags | Red Hat Mono | 9px | 700 | .1em | Upper |

Phosphor text gets `text-shadow: 0 0 12px rgba(255,178,63,.45)` (8px and .35 on smaller sizes). Do not add a ghost "88:88" layer behind the readout; VT323 is not a segment font and the overlap makes digits unreadable.

## Implementation notes

**Start, stop, resume without drift.** Keep two numbers: `startAt` (a `performance.now()` mark) and `base` (elapsed ms while stopped):

```js
const now = () => running ? performance.now() - startAt : base;
function setRunning(r) {
  if (r) startAt = performance.now() - base;   // resume from frozen value
  else base = performance.now() - startAt;     // freeze
  running = r;
  cancelAnimationFrame(raf); if (r) loop(); else draw();
}
```

**Laps in centiseconds.** Store laps as integer centiseconds; then sums and comparisons are exact and `Math.min(...laps)` is safe:

```js
function addLap() {
  if (!running) return;
  const l = Math.floor(now() / 10) - laps.reduce((a, b) => a + b, 0);
  if (l <= 0) return;
  laps.push(l); renderLaps(true);
}
const fmtLap = c => c < 6000 ? (c / 100).toFixed(2) : fmtCs(c).replace(/^0/, '');
```

**Keycaps that react to the keyboard.**

```js
const press = id => { const k = $(id); if (k.disabled) return;
  k.classList.add('down'); setTimeout(() => k.classList.remove('down'), 120); };
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
  if (e.code === 'Space') { if (e.target.closest('button')) return; e.preventDefault(); press('#go'); toggle(); }
  else if (e.key.toLowerCase() === 'l') { press('#lap'); addLap(); }
  else if (e.key.toLowerCase() === 'r') { press('#reset'); reset(); }
});
```

Style `.key:active, .key.down` identically: `transform: translateY(5px)` and the 5px bottom shadow collapsing to 0.

**Scanlines without hurting legibility.** A 1px dark line every 4px at 22% opacity on `::after` with `pointer-events: none`. Multiply blending or denser lines turn the pixel face into noise.

Common mistakes:

- Counting with `setInterval(…, 10)`; it drifts and violates the 16ms minimum.
- Flagging the only lap as both best and worst.
- Storing laps as floats in seconds and comparing them for equality.
- Allowing Reset while running, which loses a session with one stray key.
- Colouring the total column too; only the lap value changes colour.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
