<!-- Design Lounge Nº 647 · "Pebblefall peg drop" · www.designlounge.live -->

# Pebblefall peg drop

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A garden-toy peg board from a fictional casual game, Pebblefall. A moss-green hopper rides a dotted rail at the top of a pale sage board; you drag it sideways and let go, and a terracotta pebble falls through ten staggered rows of moss pegs under real gravity, bouncing, flashing each peg marigold where it touches, and settling into one of seven slots scored 80 · 30 · 10 · 50 · 10 · 30 · 80. Five pebbles make a round, then a result card staggers in the five scores and counts up the total. It is a toy, not a casino: no money, no coins, no lights, just clay colours and Gabarito numerals. The detail worth copying: the simulation runs at a fixed 1/120s step inside rAF, so the bounce feel is the same at 60Hz and 120Hz, and a 35ms hit-stop plus a 5px board nudge make the 50 and 80 slots land with weight.

## Structure

```
390 × 844, ground #D7E3D0
┌──────────────────────────────────────┐
│ 54px clear                           │
│ Pebblefall             ROUND 3  (II) │ hud 52h, padding 0 16 0 20
│ 2 left ●●○○○              130        │ score 30px 800
│ ┌──────────────────────────────────┐ │ stage: margin 6 10 0, h 604, r 28
│ │ · · · ·[▣]· · · · · · · · · · ·  │ │ rail y 40, hopper 52×46 at top 14
│ │   ( ✋ Drag, then let go )        │ │ hint pill top 66
│ │    •   •   •   •   •   •   •      │ │ 10 peg rows, y 118 + 38n
│ │  •   •   •   •   •   •   •   •    │ │ peg spacing (W−32)/8
│ │  …                                │ │
│ │ ▕   ▕   ▕   ▕   ▕   ▕   ▕   ▕     │ │ slot bay y H−118 → H−56, 6 dividers
│ │ [80][30][10][50][10][30][80]      │ │ plates 36h, gap 4, bottom 14
│ └──────────────────────────────────┘ │
│ THIS ROUND                [ Drop SPACE ] │ bar 60h, margin 14 16 0
│ [80][50]                             │ Drop ≥132 × 60, r 20
│ 34px clear                           │
└──────────────────────────────────────┘
```

- `.hud`: brand `b`, `div.left` (count + five `i` dots), `.score` (`small` round + `span`), `button.pause`.
- `.stage`: `canvas` (pegs, dividers, pebbles, sparks), `.rail`, `div.dropper[role=slider]`, `.ghost`, `.slots` of seven `.slot` plates.
- `.bar`: `ol#log` of drop values, `button.drop` with a `kbd`.
- Two `section.sheet[role=dialog]`: pause and result (`h2` total, `ol.drops`, `button.cta`).

## Motion

| What | Trigger | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|
| Pebble flight | drop | physics, fixed 1/120s step | until landed | unchanged (it is the game) |
| Peg flash + halo | hit | flash 1 → 0 | 2.4/s linear decay | unchanged |
| Sparks | hit > 260px/s | 4 squares fly and fall | ~380ms | none |
| Squash | hit | up to 28% / 20% | 6/s recovery | unchanged |
| Hit-stop | 50 or 80 slot | sim frozen | 35ms | none |
| Board nudge | 50 or 80 slot | 0 → 5px → −2px → 0 | 300ms `--ease` | none |
| Slot plate | land | lift 3px, marigold | 160ms bg, 200ms `--spring`, held 520ms | colour only |
| Score pop | land | y 0 → −64px, scale .6 → 1.1 → 1, fade | 900ms `--expo` | static at −30px, fades |
| Hopper | drag | scale 1 → 1.06 | 160ms `--spring` | instant |
| Hint pill | load | sway 60px | 2.4s × 3, 500ms delay | static |
| Sheets | pause / end | `translate(-50%,105%)` → 0 | 440ms `--sheet-ease` | instant |
| Result chips | end | y 10 → 0, fade in | 380ms spring, 300 + 140ms·i | all visible at once |
| Total | after chips | 0 → total | 800ms cubic out | final at once |

## States

- **Hopper loaded / empty:** pebble inside at scale 1 / 0 (empty while a pebble is in the top 120px or none are left).
- **Hopper held:** scale 1.06.
- **Drop disabled:** `#56675D` fill, no lip, when no pebbles are left or the game is paused.
- **Peg hit:** marigold fill and halo, fading.
- **Slot hit:** marigold plate lifted 3px; 80 plates rest on `--big-plate`.
- **Paused:** loop stopped, sheet up, scrim 45%.
- **Result:** top score chip(s) marigold; Next round hidden until the count-up ends.
- **Focus-visible:** 3px `--ink` outline, 3px offset.

## Accessibility

- The hopper is `role="slider"`, `aria-label="Dropper position"`, `aria-valuenow` 0–100, focusable, with `aria-keyshortcuts`.
- Keys: ← → aim, Shift for big steps, Space/Enter drop, P/Escape pause. Space on a focused button presses that button instead.
- The canvas is `aria-hidden`; a polite live region announces every landing ("+50. Score 180. 2 left."), pause, and the round total.
- Pebble dots carry `aria-label="2 pebbles left"`; the log is a labelled list.
- Dialogs are `role="dialog"`, `aria-modal`, labelled by their `h2`; focus goes to Resume or to Next round when it appears.
- Contrast: `--ink` on `--plate` and on marigold above 8:1; `--ink-2` on the ground above 6:1.
- Hit targets: the whole board is the drag surface; Drop is 60px tall; pause 44px.

## Responsive rules

- Layout is computed from the stage's width at load and on resize: peg spacing `(W − 32) / 8`, slot width `(W − 32) / 7`, so 360 wide keeps ten rows and seven slots; the hopper keeps its relative position across a resize.
- Taller screens: keep the stage at 604px and let the gap below the bar grow.
- At tablet width the column stays 390px, centred on the ground colour.

## Acceptance checklist

### Always

- [ ] Physics runs at a fixed 1/120s step with dt capped at 50ms, inside rAF, and stops when paused or ended.
- [ ] Pegs flash on contact and decay; hard hits throw sparks.
- [ ] The pebble squashes along the contact normal and recovers.
- [ ] Walls, dividers and other pebbles all collide; no pebble can wedge (stall rescue after 0.5s).
- [ ] Drag or arrows aim, release or Space drops, P/Escape pauses.
- [ ] Only one pebble in the top band at a time; the hopper shows empty until then.
- [ ] Big slots add a 35ms hit-stop and a board nudge, both off under reduced motion.
- [ ] Result card staggers the drops, then counts up, then shows the action.
- [ ] Closed sheets are `visibility:hidden`; scroll width is 390.
- [ ] No money, coins or casino styling anywhere.

### This demo

- [ ] Slots 80 · 30 · 10 · 50 · 10 · 30 · 80; five pebbles a round; best this week 410.
- [ ] First frame: Round 3, 130 points, 2 left, log 80 and 50, one pebble mid-board.
- [ ] Pebble terracotta `#C9552F`, pegs moss `#3E5A4A`, hits marigold `#F2B33D`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame is mid-round: Round 3, score 130, "2 left" with two filled pebble dots and three rings, the log shows 80 and 50, a pebble is already falling through row 5 with two pegs fading from marigold, and the hopper is loaded at 42% of the rail. A pill "Drag, then let go" with a hand icon sways 60px beside the hopper three times (2.4s each).
2. Pointer down anywhere on the board (not the slot plates): pointer capture, the hopper scales to 1.06 and jumps to the finger's x, clamped to `16 + 9 + 4` px from each wall. Pointer move drags it. Release drops a pebble from the hopper and hides the hint for good. A tap with no drag also drops.
3. A pebble spawns at the hopper's x, y 46, with vx ±8px/s random and vy 0. Only one pebble may be in the top 120px at a time; the hopper shows empty (its pebble scales to 0) until the last one clears that band.
4. Physics per 1/120s step: vy += 1500·dt; vx × (1 − 0.15·dt); speed capped at 900px/s; position += v·dt. Pegs (r 5) and the pebble (r 9) collide as circles: push out along the normal, reflect the normal velocity with restitution 0.52, add ±20px/s random tangential jitter. Side walls reflect with 0.52. Slot dividers are 2px-radius capsules from the slot top to the floor. Pebbles also collide with each other (equal mass, 0.52).
5. Peg hit: the peg's flash goes to 1 and decays at 2.4/s; a marigold halo of radius 5 + 8·flash at 45%·flash alpha is drawn under it, and the peg fill turns `#E39A1E` while flash > 0.05. Hits faster than 260px/s throw four 3px marigold sparks that fall under 900px/s² gravity and fade over 380ms.
6. Squash: on each hit the pebble squashes along the contact normal by up to 28% (and stretches 20% across), proportional to impact speed / 700, recovering at 6/s.
7. Floor: if |vy| > 120 the pebble bounces at 0.3; otherwise it lands. The slot index is `floor((x − 16) / slotWidth)`. The slot plate turns marigold and lifts 3px for 520ms, a "+80" pill rises 64px and fades over 900ms, the score and log update, and the live region says "+80. Score 210. 1 left."
8. Landing in a 50 or 80 slot: the simulation freezes for 35ms (hit-stop) and the board nudges down 5px then up 2px over 300ms.
9. A pebble moving under 40px/s for 0.5s without landing gets a 140px/s push toward the centre and a 80px/s hop, so it can never wedge.
10. Keyboard: ← / → move the hopper 12px (Shift: 36px). Space or Enter drops. P or Escape toggles pause. The hopper is a focusable `role="slider"` reporting 0–100.
11. Pause: the loop stops (no rAF scheduled), a sheet rises over a 45% moss scrim: "Paused / Pebbles hold still", Resume and Restart round.
12. Round end (700ms after the fifth pebble lands): the result sheet reads "Round 3 · 5 pebbles", then the five scores rise in one at a time (380ms spring, 300ms then 140ms apart; the highest marigold), then the total counts up from 0 over 800ms (cubic out), then "Next round" fades in and takes focus. If the total beats 410: "New best this week. Old best 410."
13. Next round: Round 4, score 0, five pebbles, log reads "Five pebbles, no drops yet".

## Tokens

```css
:root {
  --ground: #D7E3D0;      /* page */
  --board: #EDF2E6;       /* stage, result chips */
  --board-edge: #C3D1BB;  /* rail dots, lips */
  --bay: #DCE5D4;         /* slot bay fill (canvas) */
  --plate: #FBF8F0;       /* slot plates, pills, sheet */
  --big-plate: #FFF1CF;   /* 80-point plates */
  --ink: #1F2D26;         /* text, Drop button */
  --ink-2: #3F5247;       /* captions */
  --moss: #3E5A4A;        /* pegs, dividers, hopper */
  --moss-lip: #2B4235;
  --pebble: #C9552F; --pebble-hi: #F08A5D; --pebble-lo: #9E3D1E;
  --marigold: #F2B33D;    /* hit plates, score pops, top result */
  --peg-hit: #E39A1E;
  --font: "Gabarito", system-ui, sans-serif;
  --fs-total: 64px; --fs-score: 30px; --fs-brand: 22px; --fs-btn: 18px; --fs-slot: 15px; --fs-cap: 11px;
  --r-board: 28px; --r-plate: 10px; --r-btn: 20px; --r-sheet: 30px;
  --board-shadow: inset 0 2px 0 #fff, 0 1px 0 var(--board-edge), 0 18px 40px -18px rgba(31,45,38,.35);
  --btn-lip: 0 5px 0 #0F1813;
  --ease: cubic-bezier(.2,.7,.2,1);
  --sheet-ease: cubic-bezier(.32,.72,0,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
  /* physics */
  --g: 1500;       /* px/s² */
  --step: 1/120;   /* s */
  --restitution: .52;
  --pebble-r: 9px; --peg-r: 5px;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Result total | Gabarito | 64px | 900 | 1 | −0.04em, tabular |
| Score | Gabarito | 30px | 800 | 1 | −0.02em, tabular |
| Brand | Gabarito | 22px | 900 | 1 | −0.02em |
| Score pop | Gabarito | 22px | 900 | 1 | 0 |
| Result chips | Gabarito | 20px | 800 | 1 | 0 |
| Drop, Next round | Gabarito | 18px | 800 | 1 | 0 |
| Slot values | Gabarito | 15px | 800 | 1 | tabular |
| Pebbles left, body | Gabarito | 13–15px | 500–600 | 1.35 | 0 |
| Captions (ROUND 3, THIS ROUND) | Gabarito | 11px | 700 | 1 | 0.12em upper |

## Implementation notes

**Fixed step inside rAF.** Accumulate real time, step in 1/120s slices, draw once per frame. The hit-stop just skips stepping:

```js
function loop(t) {
  if (state !== 'play') { rafId = 0; return; }
  const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
  if (freeze > 0) freeze -= dt;
  else { acc += dt; while (acc >= STEP) { step(STEP); acc -= STEP; } }
  draw(); rafId = requestAnimationFrame(loop);
}
```

**One collision routine for pegs and dividers.** A divider is a capsule: collide with the closest point on its segment as if it were a 2px peg.

```js
function hit(b, px, py, rr) {
  const dx = b.x - px, dy = b.y - py, m = rr + BR, d2 = dx * dx + dy * dy;
  if (d2 >= m * m) return false;
  const d = Math.sqrt(d2) || 0.01, nx = dx / d, ny = dy / d;
  b.x = px + nx * m; b.y = py + ny * m;
  const vn = b.vx * nx + b.vy * ny;
  if (vn < 0) { b.vx -= (1 + E) * vn * nx; b.vy -= (1 + E) * vn * ny; b.vx += (Math.random() - 0.5) * 40; }
  return -vn;
}
for (const x of dividers) if (b.y > slotTop - BR) hit(b, x, clamp(b.y, slotTop, floorY), 2);
```

**Edge pegs touch the wall.** A peg whose gap to the wall is smaller than the pebble (18px) but non-zero traps it. Move any peg closer than `2·BR + PR` to a wall flush against it (x = wall ± 5) so the pebble rolls off inward. Keep the stall rescue anyway.

Common mistakes: integrating with the raw frame delta (bounces change with refresh rate), resolving overlap without reflecting velocity (pebbles sink into pegs), and running the loop while paused.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
