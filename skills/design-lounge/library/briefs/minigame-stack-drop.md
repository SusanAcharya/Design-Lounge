<!-- Design Lounge Nº 632 · "Stack drop mini-game" · www.designlounge.live -->

# Stack drop mini-game

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Cairn is a one-tap timing game: a stone slab slides side to side above a cairn on a mountain ridge, and a tap (or Space) sets it down. Whatever hangs past the stone below is sliced off and tumbles away with gravity and spin; a drop within 4px of perfect keeps the full width and starts a glowing combo. The slide speeds up with every stone, the camera climbs with the cairn, and the sky slowly goes from dusk peach to night blue over 30 stones while stars brighten. It is drawn flat in 2D on a canvas, art-directed rather than neon: eight earthy stone tones with a lit top lip and a shadow lip, three parallax ridges, a low moon, and a quiet HUD in Bricolage Grotesque with Geist Mono labels. The detail worth copying is how calm the frame stays while the game speeds up: one big score, one hint pill, dialogs only when paused or over. Dialogs follow iOS 26-ish sheet proportions (28px radius, sheet curve).

## Structure

```
390 × 844 · canvas fills the viewport; HUD and sheets are DOM on top
┌──────────────────────────────────┐
│ 54px clear                       │
│ CAIRN          12         ( ‖ )  │ HUD grid 96px | 1fr | 96px, top 58px
│               BEST 18            │ score 76px, BEST 12px mono
│                                  │
│     · stars ·            ( moon )│ moon r22 at (310, ground − 300)
│                                  │
│  [==stone==] →                   │ moving stone, 28px row (24 visible + 4 lip)
│      [===stone===]               │
│     [====stone====]   ╱╲ ridges  │ three ridges, parallax .08 / .2 / .45
│    [=====stone=====]             │
│   [======stone======]            │ foundation 220 / 198 / 176
│  ┌──────── plinth 270 ───────┐   │ ground line = viewport height − 196
│  │ [• Tap to set the stone SPACE]│ hint pill, bottom 58px
│  └───────────────────────────┘   │
│ 34px home indicator              │
└──────────────────────────────────┘
Sheets: bottom-aligned, width min(358px, 100%), 16px gutters, 34px bottom inset.
```

- `canvas role="img" aria-label="Cairn stacking game board"`, sized to `innerWidth × innerHeight` at up to 2× DPR. The 390px play column is centred with `ox = (W − 390) / 2`, so on wide screens the sky and ridges fill the rest.
- `header.hud`: wordmark, score (`aria-live="polite"`), best, pause `<button aria-label="Pause">`.
- Combo pill: `div role="status"`.
- Two `div.layer role="dialog" aria-modal="true"` each holding a `.panel`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Ready bob | ready | stone y | ±2px sine | 4 rad/s | — | kept (tiny) |
| Hint dot ping | ready | ring scale, opacity | 1, .9 → 1.9, 0 | 1,400ms loop | `--ease` | static dot |
| Hint out | first drop | opacity | 1 → 0 | 300ms | `--ease` | same |
| Slide | play | x | edge ↔ edge | speed `150 + 10·score` px/s | linear (physics) | same: the game stays playable |
| Chip fall | trim / miss | y, rotation | gravity 1,900 px/s², ±2.2 rad/s | until off-screen | physics | same |
| Perfect glow | perfect | outline spread, alpha | 3px, 1 → 13+3k px, 0 | 700ms | linear | same (no movement of layout) |
| Combo pill | perfect ×2+ | opacity, y, scale | 0, 10px, .8 → 1 → 0, −14px | 900ms | `--ease` | opacity only |
| Score bump | placed | scale | 1 → 1.12 → 1 | 240ms | `--pop` | none |
| Camera | placed | world offset | → target | `k = 6·dt` per frame | exponential | `k = 30·dt` (near snap) |
| Sky | score 0 → 30 | gradient stops | dusk → night | continuous | linear in score | same |
| Sheet | pause / over | translateY | 24px → 0 | 400ms | `--sheet-ease` | none, crossfade only |
| Scrim | pause / over | opacity | 0 → 1 | 250ms | `--ease` | same |

## States

- **Ready**: slow slide, hint visible, nothing scored. Any drop input starts play.
- **Play**: loop running; HUD only.
- **Perfect / combo**: glow on the placed stone; pill from ×2.
- **Paused**: loop stopped; sheet with Resume (focused) and Start a new cairn. The pause button stays visible but sits under the scrim.
- **Over**: whole stone falls, sheet after 650ms with Stack again focused; NEW BEST tag only when the best was beaten with more than 0.
- **Focus-visible**: 3px ember outline offset 3px on every button.
- **Primary active**: scale .98.

## Accessibility

- Keys: Space, Enter or ↓ drop; P or Escape pause and resume; Enter or Space restart from the game-over sheet. Drop keys are ignored while focus is inside a sheet or on the pause button, so they never double-fire a button.
- After Resume or restart, focus is released to the page so Space goes back to dropping.
- Score is `aria-live="polite"`; the combo pill is `role="status"`; sheets are `role="dialog" aria-modal="true"` with `aria-labelledby` on their titles; closed sheets are `visibility:hidden`.
- Text never relies on the canvas behind it: the HUD sits over the always-dark top of the sky (`#141A2C` to the 42% stop), and the hint and combo sit on solid pills.
- Contrast: bone on night 14:1, `#B9B6C8` on night 8.7:1, ink on bone 14:1, ember-ink on ember 6.6:1, white on new-best 6.8:1.
- Targets: pause 44px, primary 58px, ghost 50px; the whole canvas is the tap target for drops (`pointerdown`, `touch-action:manipulation`).

## Responsive rules

- The canvas always fills the viewport; game logic stays in a 390px column centred with `ox`. On a 360px screen use `scale = W / 390` on the column instead of clipping it.
- The ground line is `viewport height − 196`; the camera keeps the top stone about 380px above it, so short screens still show the HUD and the cairn.
- On resize, recompute size and DPR, then redraw immediately when the loop is stopped.
- Tablet: sky and ridges stretch; sheets stay `min(358px, 100%)` wide at the bottom.

## Acceptance checklist

**Always**
- [ ] First frame is the ready state with the board, a moving stone and a one-line hint; no title screen.
- [ ] A drop within 4px keeps the full width; any other overlap trims to the overlap and the cut piece falls with gravity and spin.
- [ ] No overlap ends the game, with a score, the best and a restart.
- [ ] Speed rises with each stone and is capped.
- [ ] The loop uses `requestAnimationFrame` with delta time capped at 1/30s, and stops when paused or over.
- [ ] Touch and keyboard both work: tap, Space, Enter, ↓, P, Escape.
- [ ] Closed sheets are `visibility:hidden`; focus moves into an opened sheet.
- [ ] Best is held in memory only; no `localStorage`.
- [ ] Text over the canvas sits on dark sky or a solid pill and passes 4.5:1.
- [ ] `document.documentElement.scrollWidth` is 390.

**This demo**
- [ ] Wordmark "CAIRN"; hint "Tap to set the stone" with a SPACE key cap.
- [ ] Pause sheet "Paused · height N", "The wind can wait.", Resume, Start a new cairn.
- [ ] Game-over sheet "The cairn held N stones.", Score / Best tiles, NEW BEST, Stack again, "Longest perfect run N".
- [ ] Sky turns from dusk to night over 30 stones; eight stone tones cycle.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. **Ready** (first frame): the board is visible with three foundation stones (220, 198 and 176px wide) on a dark rock plinth, and the first stone sliding slowly (110 px/s) with a 2px bob. A pill at the bottom says "Tap to set the stone" with a pulsing ember dot and a SPACE key cap. Score 0, BEST 0.
2. The first tap, Space, Enter or ↓ drops the stone and starts **play**; the hint fades out (300ms).
3. Each new stone enters from alternating sides at the canvas edge (x = 8 or 382 − width) and bounces between those edges. Speed is `min(460, 150 + 10 × score)` px/s.
4. **Drop**: compare the stone's left edge with the top stone's.
   - |dx| ≤ 4px: **perfect**. The stone snaps into line and keeps its width; the combo goes up; a warm `#FFD9A0` outline expands from the stone and fades over 700ms, thicker and wider for longer combos. From ×2 on, a bone pill "Perfect ×N" pops at the top of the screen (900ms).
   - Partial overlap: the stone is trimmed to the overlap; the cut piece becomes a falling chip (gravity 1,900 px/s², spin ±2.2 rad/s away from the cairn). The combo resets.
   - No overlap: the whole stone falls (spin ±1.2 rad/s) and the game is **over** 650ms later.
5. After each placed stone the score bumps (scale 1 → 1.12 → 1, 240ms) and the camera target rises so the top of the cairn sits about 380px above the ground line; the camera eases toward it at `6·dt` per frame.
6. **Pause**: the round button (top right), P or Escape. The loop stops (`cancelAnimationFrame`), a scrim (`rgba(10,13,24,.72)`) and a bone sheet "Paused · height 7 / The wind can wait." appear with Resume and "Start a new cairn". P or Escape resumes. Leaving the tab pauses automatically.
7. **Game over** sheet: "Game over · dusk on the ridge", "The cairn held 12 stones.", Score and Best tiles (40px figures), a "NEW BEST" tag when beaten, "Stack again", and "Longest perfect run N · Enter to restart". Enter or Space restarts. The loop stops 1.2s after the sheet appears.
8. Best lives in memory only and survives restarts, not reloads.

## Tokens

```css
:root {
  /* sky and ground */
  --night: #141A2C;        /* sky top, plates, page */
  --dusk: #3B3557;         /* sky mid at dusk */
  --sky-mid-night: #1E2440;
  --horizon-dusk: #D9826A; --horizon-night: #33406A;
  --low-dusk: #F0B183;     --low-night: #3E4C78;
  --ridge-far: #6B5874;    --ridge-far-night: #3A3E5E;
  --ridge-mid: #4A3E57;    --ridge-mid-night: #2A2D48;
  --ridge-near: #1F1B2B;
  --plinth: #17141F; --plinth-line: #2A2536;
  --moon-dusk: #F6D2A8; --moon-night: #E9E4D6;
  /* stones, in order */
  --stone-1: #D9C3A5; --stone-2: #A7756A; --stone-3: #8E9A8A; --stone-4: #C7A15A;
  --stone-5: #9FB1B8; --stone-6: #B98B6E; --stone-7: #E2B08C; --stone-8: #7F8C6E;
  /* top lip = stone mixed 28% toward white; under lip = stone darkened 35% */
  --perfect-glow: #FFD9A0;
  /* UI */
  --bone: #F3EADB;          /* score, sheets */
  --ink: #1B1A24;           /* sheet text */
  --sub: #5A5560;           /* sheet labels (6.1:1 on bone) */
  --on-plate-2: #B9B6C8;    /* wordmark, BEST (8.7:1 on night) */
  --edge: #4A4866;          /* 1.5px inset ring on plates */
  --ember: #E8875A;         /* the one accent: hint dot, primary button */
  --ember-ink: #2A160C;     /* primary label (6.6:1 on ember) */
  --new-best: #9A3E14;
  --scrim: rgba(10, 13, 24, .72);
  /* type */
  --display: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --fs-score: 76px; --fs-stat: 40px; --fs-title: 34px; --fs-primary: 19px;
  --fs-ui: 15px; --fs-label: 12px;
  /* game metrics */
  --row: 28px; --start-w: 176px; --perfect: 4px; --column: 390px;
  --speed-ready: 110; --speed-base: 150; --speed-step: 10; --speed-max: 460; /* px/s */
  --gravity: 1900; /* px/s² */
  /* radii and sizes */
  --r-stone: 6px; --r-sheet: 28px; --r-primary: 18px; --r-ghost: 16px; --r-tile: 16px; --r-pill: 999px;
  --hit: 44px; --primary-h: 58px; --ghost-h: 50px;
  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --pop: cubic-bezier(.34, 1.56, .64, 1);
  --sheet-ease: cubic-bezier(.32, .72, 0, 1);
  --t-bump: 240ms; --t-glow: 700ms; --t-combo: 900ms; --t-sheet: 400ms; --t-scrim: 250ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
|---|---|---|---|---|---|---|
| Score | Bricolage Grotesque, opsz 96 | 76px | 800 | .9 | −0.03em | tabular |
| Sheet stat | Bricolage Grotesque | 40px | 800 | 1 | −0.02em | tabular |
| Sheet title | Bricolage Grotesque | 34px | 800 | 1 | −0.02em | sentence |
| Primary button | Bricolage Grotesque | 19px | 700 | 1 | 0 | sentence |
| Ghost button | Bricolage Grotesque | 16px | 600 | 1 | 0 | sentence |
| Hint, combo pill | Bricolage Grotesque | 15px | 600 / 700 | 1 | 0 | sentence |
| Wordmark, BEST, labels | Geist Mono | 12px | 500–600 | 1 | 0.14–0.18em | upper |
| Sheet footnote | Geist Mono | 12px | 500 | 1.3 | 0 | sentence |

## Implementation notes

1. **The drop is one comparison.** Work in column coordinates (0–390), not canvas pixels, and keep the trimmed piece on the side it overhung.

```js
const top = stack.at(-1), m = mover, dx = m.x - top.x;
if (Math.abs(dx) <= 4) {
  stack.push({ x: top.x, w: top.w, c: m.c }); combo++;
} else {
  const l = Math.max(m.x, top.x), r = Math.min(m.x + m.w, top.x + top.w);
  if (r - l <= 0) { chips.push({ ...m, y: stack.length, vy: 0, rot: 0, vr: m.dir * 1.2 }); return gameOver(); }
  stack.push({ x: l, w: r - l, c: m.c }); combo = 0;
  chips.push({ x: dx > 0 ? r : m.x, w: m.w - (r - l), y: stack.length - 1, vy: 0, rot: 0,
               vr: (dx > 0 ? 1 : -1) * 2.2, c: m.c });
}
```

2. **A loop that can stop.** Cap the delta so a backgrounded tab does not teleport the stone, and cancel the frame on pause and game over instead of skipping work inside it.

```js
function loop(now) {
  const dt = Math.min(1 / 30, (now - last) / 1000); last = now;
  if (state === 'play' || state === 'ready') {
    mover.x += mover.dir * (state === 'ready' ? 110 : Math.min(460, 150 + score() * 10)) * dt;
    if (mover.x < 8) { mover.x = 8; mover.dir = 1; }
    if (mover.x + mover.w > 382) { mover.x = 382 - mover.w; mover.dir = -1; }
  }
  for (const c of chips) { c.vy += 1900 * dt; c.y -= c.vy * dt / 28; c.rot += c.vr * dt; }
  cam += (camTarget - cam) * Math.min(1, dt * 6);
  draw(); raf = requestAnimationFrame(loop);
}
function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
function stop() { cancelAnimationFrame(raf); raf = 0; }
```

3. **Stones read as stone because of two lips**, not a gradient: draw the stone darkened 35% shifted 3px down, the stone colour on top (height 24), then a 5px highlight strip 2px from the top in the colour mixed 28% toward white, all with `roundRect` radius 6 (3 for the strip). A common mistake is putting the score over a part of the sky that changes colour; keep the top 42% of the gradient dark at every stage of the dusk-to-night blend.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
