<!-- Design Lounge Nº 640 · "Tessel sliding tile puzzle" · www.designlounge.live -->

# Tessel sliding tile puzzle

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A complete phone mini-game: Tessel, a sliding number puzzle where fifteen tiles each carry a slice of an original flat SVG picture (Harbour Light: a striped lighthouse on a cliff, a low sun, a sailboat on a dusk sea) and their number. Stone paper ground, ink frame, one green for "in place", one monospace family for everything. The layout follows iOS 26 conventions without glass: a quiet header, a hairline HUD, the board pushed down into the thumb zone, two 56px buttons under it. The details worth copying are the spring snap (tiles overshoot by a hair and settle in 260ms), number chips that turn green when a tile is home, and a 15-segment progress bar that fills as you go, so a hard puzzle always shows you how close you are.

## Structure

```
390 × 844 (54 safe top, 34 safe bottom, 23px gutters)
┌──────────────────────────────────────┐
│ 54 safe area                         │
│ Tessel                         [ ‖ ] │  header 48, pause 44×44
│ Nº 12 · Harbour Light                │
│ ════════════════════════════════════ │  1px ink rule
│ MOVES      │ TIME       │ BEST       │  hud: 3 cols, 26px numbers
│ 0          │ 0:00       │ 1:58       │
│ ──────────────────────────────────── │  1px line rule
│ ┌────┐ Harbour Light                 │  progress card, 56px thumbnail
│ │pic │ 0 of 15 tiles in place        │
│ └────┘ ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭              │  15 segments × 6px
│            (flex space)              │
│ ┌──────────────────────────────────┐ │
│ │ ┌──┐┌──┐┌──┐┌──┐                 │ │  board 344×344, ink frame, r18, pad 6
│ │ │ 7││11││  ││ 6│  tiles 80×80    │ │  pitch 83 (3px gutters)
│ │ └──┘└──┘└──┘└──┘                 │ │
│ │  … 4 rows …                      │ │
│ └──────────────────────────────────┘ │
│       Slide a tile into the gap      │  note, 13px
│ ┌────────────────┐ ┌───────────────┐ │
│ │  ◉ Peek        │ │  ↻ Shuffle    │ │  56px buttons, 10px gap
│ └────────────────┘ └───────────────┘ │
└──────────────────────────────────────┘
Result card: left/right 12, bottom 34, r22, slides over the controls and the board's lower half.
```

- `<main class="app">` flex column, `max-width:430px`, `padding:54px 23px 34px`.
- `<header>`: `<h1>Tessel</h1>`, sub-line, pause `<button aria-label="Pause">`.
- `<section class="hud">`: three cells, the time cell `role="timer"`.
- `<section class="prog">`: an `<svg><use href="#pic"/></svg>` thumbnail, the title, the count text, 15 `<i>` segments.
- `.boardwrap` (344×344) holds `.board[role=group]` with `.cells`, the `.peek` overlay and the `.paused` `role="dialog"` panel.
- Tiles: 16 `<button class="t">` (the 16th is `aria-hidden` and invisible until solved). Each holds `<svg viewBox="col*83 row*83 80 80"><use href="#pic"/></svg>` plus an `<i>` number chip.
- `.controls`: Peek and Shuffle buttons. `.result` card with `aria-live="polite"`.
- The picture is one `<g id="pic">` (332×332) in a hidden `<svg><defs>` with two linear gradients (sky, sea).

## Motion

| What | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---|---|---|---|
| Tile snap | move | `transform` translate | old cell → new cell (slight overshoot) | 260ms | `--spring` | 0 | 90ms `--std`, no overshoot |
| Hint nudge | first frame | `translate` | 0 → 8px towards gap → 0 | 1400ms loop | `--std` | — | ring only, no nudge |
| Chip home | move | chip `background` | ink → green | 200ms | default | 0 | same |
| Segments | move | `background` | line → green | 200ms | default | 0 | same |
| Peek | toggle | `opacity` | 0 → 1 | 200ms | `--std` | 0 | same |
| Pause panel | toggle | `opacity` | 0 → 1 | 200ms | `--std` | 0 | same |
| Last tile | solve | `opacity` | 0 → 1 | 500ms | `--std` | 0 | same |
| Ripple | solve | `scale` | 1 → 1.07 → 1 | 520ms | `--spring` | (row + col) × 55ms | off |
| Chips out | solve | `opacity` | 1 → 0 | 300ms | default | 600ms | same |
| Result card | solve | `translateY` | 120% → 0 | 520ms | `--sheet` | 700ms | 200ms fade |
| Button press | `:active` | `scale` | 1 → 0.97 | 120ms | `--std` | 0 | same |

The timer runs on `requestAnimationFrame`, adds `min(100, dt)` per frame, and stops requesting frames when paused or solved.

## States

- **Ready**: board visible, hint ring on one movable tile, timer at 0:00 and not running.
- **Running**: timer counting, note shows the controls line.
- **Tile in place**: green chip; **out of place**: ink chip. Both 4.5:1+ with cream text.
- **Peeking**: Peek button inverted (ink fill, cream text), `aria-pressed="true"`.
- **Paused**: ink panel over the board, pause button's label flips to "Resume", timer frozen. Moves are ignored.
- **Solved**: 16th tile shown, ripple, chips gone, input ignored, result card up.
- **New best**: result tag reads "New best time", HUD BEST updates.
- **Focus-visible**: 3px `--accent` outline at 3px offset on every button.
- **Hidden layers** (peek, pause, result) are `visibility:hidden` when closed, not only transparent or translated.

## Accessibility

- The board is `role="group"` labelled "Sliding puzzle, 4 by 4". Tiles are buttons with `tabindex="-1"` and labels like "Tile 7" or "Tile 1, in place", so the screen-reader user plays with the arrow keys instead of tabbing through 15 stops.
- Tab order: Pause, Peek, Shuffle; inside the paused panel focus goes to Resume; on solve, focus moves to Play again.
- Keys: arrows move, Space pauses, P peeks, Escape resumes.
- A polite live region announces "Paused. Timer stopped at 0:42." and "Resumed."; the result card is itself `aria-live`.
- Contrast: `--ink-2` on `--bg` 5.9:1; cream on `--home` 5.5:1; cream on ink 15:1.
- Hit targets: tiles 80×80, pause 44×44, buttons 56px tall.
- The board has `touch-action:none` so a swipe never scrolls the page.

## Responsive rules

- At 360 wide: drop `--pitch` to 75px and `--tile` to 72px (board 312px); the HUD keeps three columns.
- Shorter than 800: the app keeps `min-height:800px`; the progress card's `margin-bottom:auto` absorbs any slack, so on tall phones the board sits lower, nearer the thumb.
- Tablet: the column caps at 430px and centres; the board does not grow past 344px.

## Acceptance checklist

**Always**
- [ ] Shuffle by legal random moves from solved; never by permuting the array.
- [ ] Tapping a tile in line with the gap slides the whole run; moves count every tile moved.
- [ ] Swipe (24px threshold) and all four arrow keys work, with the directions in step 4.
- [ ] Tiles snap with a spring overshoot in 260ms; reduced motion uses 90ms without overshoot.
- [ ] Each tile shows its own slice of one picture plus its number; chips turn green in place.
- [ ] The progress bar has 15 segments and matches the in-place count.
- [ ] Timer is rAF-driven, capped at 100ms per frame, starts on the first move, stops on pause and solve.
- [ ] Peek, pause, restart, new easy shuffle and Play again all work and reset what they should.
- [ ] Solve shows the 16th tile, a diagonal ripple, then the result card with focus on Play again.
- [ ] Closed overlays are `visibility:hidden`; `scrollWidth` stays 390.

**This demo**
- [ ] Title "Tessel", sub-line "Nº 12 · Harbour Light", BEST starts at 1:58.
- [ ] Picture: lighthouse with two red bands on a left cliff, sun at (236,150) r46, sailboat at the lower right.
- [ ] Easy shuffle is 24 moves; full shuffle is 220.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: a full shuffle (220 random legal moves from solved, so it is always solvable), MOVES 0, TIME 0:00, BEST 1:58. One tile next to the gap has a 3px cream ring and nudges 8px towards the gap every 1.4s. The line under the board reads "**Slide** a tile into the gap".
2. Tap a tile in the same row or column as the gap: it and every tile between it and the gap slide one cell towards the gap together. Each tile moved adds 1 to MOVES. Taps on tiles not in line with the gap do nothing.
3. Swipe on the board (24px or more; the larger axis wins): the tile on the far side of the gap moves into it in the swipe direction. A swipe never also counts as a tap.
4. Keyboard: ArrowLeft moves the tile right of the gap left, ArrowRight the tile left of the gap right, ArrowUp the tile below up, ArrowDown the tile above down. Space pauses, P toggles peek, Escape resumes.
5. The first move starts the timer and removes the hint; the line becomes "Tap, swipe or use the **arrow keys**".
6. After every move: each tile in its home cell shows a green number chip; the progress card reads "N of 15 tiles in place" and N of its 15 segments turn green.
7. **Peek** (toggle, `aria-pressed`): the solved picture covers the board, labelled "Solved picture", fading in over 200ms. Tap again to hide. The timer keeps running.
8. **Pause** (top-right, 44px): an ink panel covers the board so the picture cannot be studied, with Resume, Restart this shuffle and New easy shuffle (24 moves). The timer stops; Resume or Escape continues it.
9. **Shuffle** deals a new full shuffle and resets moves and time.
10. Solving: the hidden 16th tile fades in to complete the picture, every tile pulses to 1.07 in a diagonal ripple (55ms per step from top-left), number chips fade away after 600ms, and the line reads "**Solved** in 24 moves".
11. 700ms later the result card rises from the bottom (520ms iOS sheet curve): "Picture restored" (or "New best time" in green), "Harbour Light, done.", Moves, Time, Best, and **Play again**, which takes focus. Play again deals a new full shuffle.

## Tokens

```css
:root {
  /* colour */
  --bg: #E9E4D8;        /* stone paper */
  --card: #F4F0E6;      /* buttons, progress card, result card */
  --ink: #1E1E24;       /* text, frame, chips, primary button */
  --ink-2: #55535C;     /* labels (5.9:1 on --bg) */
  --line: #CFC8B8;      /* hairlines, empty segments */
  --frame: #1E1E24;     /* board */
  --home: #276B4D;      /* in-place chip, filled segments, result tag */
  --accent: #C8402E;    /* focus ring; lighthouse stripes in the picture */
  --chip: #F4EFE6;      /* chip text, hint ring, paused panel button */
  /* picture */
  --sky-top: #F6C77A; --sky-bottom: #EE8A5B; --sun: #FCE6AE; --hill: #B5604E; --hill-2: #8F4A44;
  --sea-top: #2E5F80; --sea-bottom: #173A52; --glint: #F3B276; --wave: #4A7EA0; --cliff: #2E2C2A; --grass: #5E7A44;
  /* type */
  --mono: "Space Mono", ui-monospace, monospace;
  --fs-title: 22px; --fs-hud: 26px; --fs-result: 24px; --fs-result-num: 22px;
  --fs-button: 15px; --fs-body: 13px; --fs-chip: 12px; --fs-label: 11px;
  /* board geometry */
  --board: 344px; --board-pad: 6px; --pitch: 83px; --tile: 80px;
  /* radii */
  --r-board: 18px; --r-tile: 9px; --r-chip: 5px; --r-button: 14px; --r-icon: 12px; --r-result: 22px;
  /* shadow */
  --board-shadow: 0 18px 30px -18px rgba(30,30,36,.6);
  /* motion */
  --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --sheet: cubic-bezier(0.32, 0.72, 0, 1);
  --t-snap: 260ms; --t-ripple: 520ms; --ripple-step: 55ms; --t-overlay: 200ms; --t-result: 520ms; --result-delay: 700ms;
}
```

## Typography

One family, Space Mono, at two weights.

| Role | Size / line | Weight | Tracking | Case |
|---|---|---|---|---|
| Title "Tessel" | 22px / 1 | 700 | −0.02em | sentence |
| HUD numbers | 26px / 1.1, tabular | 700 | 0 | — |
| HUD labels | 11px | 400 | 0.14em | upper |
| Paused heading | 28px / 1 | 700 | 0 | sentence |
| Result heading | 24px / 1.1 | 700 | 0 | sentence |
| Result numbers | 22px / 1.2 | 700 | 0 | — |
| Buttons | 15px / 1 | 700 | 0 | sentence |
| Tile chip | 12px / 20px | 700 | 0 | — |
| Body, note, sub-line | 12–13px / 1.4 | 400 | 0 | sentence |

## Implementation notes

1. **One picture, sixteen windows.** Draw the scene once as a `<g>` in `<defs>`, then give each tile its own `viewBox` into it. The 3px gutters are simply never shown, which reads as a cut picture.

```js
const c = (k - 1) % 4, r = Math.floor((k - 1) / 4);
tile.innerHTML = `<svg viewBox="${c * 83} ${r * 83} 80 80" aria-hidden="true"><use href="#pic"/></svg><i>${k}</i>`;
tile.style.setProperty('--x', cell % 4); tile.style.setProperty('--y', Math.floor(cell / 4));
```
```css
.t { transform: translate(calc(var(--x) * 83px), calc(var(--y) * 83px));
     transition: transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1); }
```

2. **Sliding a run.** Walk from the gap towards the tapped cell, swapping as you go. This handles one tile and three tiles with the same code.

```js
function tap(cell) {
  let g = pos.indexOf(0); const gr = g >> 2, gc = g & 3, cr = cell >> 2, cc = cell & 3;
  if (cell === g || (gr !== cr && gc !== cc)) return;
  const step = gr === cr ? (cc < gc ? -1 : 1) : (cr < gr ? -4 : 4);
  while (g !== cell) { const n = g + step; pos[g] = pos[n]; pos[n] = 0; g = n; moves++; }
}
```

3. **A timer that cannot run away.** Use rAF with a capped delta, and only request the next frame while running. A background tab returns with one 100ms step, not a 40-second jump.

```js
function loop(t) {
  const dt = Math.min(100, t - last); last = t; ms += dt; timerEl.textContent = fmt(ms);
  if (running && !paused && !won) raf = requestAnimationFrame(loop);
}
// on resume: last = performance.now(); raf = requestAnimationFrame(loop);
```

Common mistakes: random permutations (half are unsolvable), swipe handlers that also fire the tile's click, and a pause panel that is transparent instead of opaque, which lets players study the board for free.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
