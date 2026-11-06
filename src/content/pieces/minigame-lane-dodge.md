---
title: "Lane dodge on a night tram line"
summary: "A three-lane dodge game: swipe a tram between tracks under arches of paper lanterns, dodge market barrows, grab lanterns, chain near misses, crash to a result card."
platform: mobile-app
type: screen
category: games
tags: [minigame, swipe, press, runner, canvas, score]
styles: [dark, kinetic, playful]
motion: rich
difficulty: 3
featured: false
published: 2026-11-06
palette: ["#0F1320", "#171B29", "#F6ECDC", "#FFC15E", "#FF6A3D", "#1F5C4F"]
fonts: ["Anton"]
related: [game-playfield, game-racing-results, game-hud]
---

# Lane dodge on a night tram line

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

"Lantern Line", an invented one-thumb game. You drive tram 14, seen from behind, down three lanes of track toward a city skyline under a crescent moon. Arches of paper lanterns come at you every 16 metres, market barrows block lanes, and loose lanterns float over free lanes. Swipe or tap left and right to change track. Leaving a lane just before a barrow passes through it is a near miss: sparks fly off the tram, the multiplier goes up and lanterns score more. Speed rises from 14 to 36 m/s. Hitting a barrow freezes the frame for 50ms, squashes the tram, shakes the screen and brings up the result card. The detail worth copying is the projection: one scale function `F / (F + z)` places rails, sleepers, arches, barrows and the tram, so the whole world shares a single camera.

## Reference behaviour

1. First frame, 390 × 844: the ready state with the whole board drawn. Sky gradient `#0d111c → #1d1a26 → #4a2620` down to the horizon at 36% of the height, 36 stars, a crescent moon, a skyline of 18–52px wide blocks with scattered warm windows. Three lanes of rails converge on the horizon; sleepers every 2.2m; lantern arches every 16m; two barrows and a lantern already on the track.
2. HUD at 54px, 16px sides, solid `#0c0f19` plates with a 1px `#2c3244` ring: Distance ("0 M", 30px, min-width 100px), multiplier ("x1", amber), Lanterns (icon + count), and a 48px round pause button at the right.
3. Ready prompt above the tram, bottom 330px: a plate "‹ Swipe to ride ›" whose chevrons nudge 6px outward every 1400ms, and a small plate "Or arrow keys · A / D". No instruction text beyond that.
4. The first input (swipe, tap, arrow, A/D, Space or Enter) starts the run, hides the prompt in 260ms and applies the move. Swipe = horizontal movement over 34px that beats the vertical; a tap moves toward the half of the screen you tapped.
5. Running: the tram eases to its lane with `pos += (lane − pos) · min(1, dt · 16)` and tilts up to 4° in the move direction, decaying quickly. Speed is `min(36, 14 + t · 0.4)` m/s; distance accumulates and the HUD updates every frame.
6. Obstacles spawn at 130m ahead: one barrow (two above 22 m/s) in random lanes, always leaving a free lane; 60% of rows add a lantern in the free lane. The next row comes `max(15, 28 − speed · 0.35)` metres later. Far objects fade in over their first 30m.
7. Lantern pickup: when the tram overlaps a lantern lane within 1.3m in front or 1.1m behind, it is collected: +1 lantern and 50 × multiplier points.
8. Near miss: when a barrow passes the tram and the tram left that barrow's lane less than 450ms earlier, the multiplier goes up by 1 (max x5), the multiplier plate bumps to 1.3 scale in 360ms, a "Near miss x3" plate pops up in the middle and 14 sparks spray off the tram side with gravity.
9. Crash: a barrow overlapping the tram's lane between 0.9m behind and 1.1m ahead of it. The run stops, the canvas holds still for 50ms (hit-stop), the tram squashes (18% wider, 14% shorter, easing out over 330ms) and the canvas shakes for 320ms. Score = distance + lantern points.
10. 650ms later a scrim and the result card rise (translateY 40 → 0, 460ms expo-out). In order: "LINE CLOSED · STOP 14", the distance counting up over 700ms to "84 m" (76px), a "BEST" badge if it beats this session's best, "Ran into a market barrow on Lamplighter Row.", then Score, Lanterns and Best multiplier rows sliding in 160ms apart from 520ms, then the "Ride again" button with a spring at 1100ms, which takes focus.
11. Ride again (button, Enter or Space on it) resets to the ready state with the same opening layout.
12. Pause (button, P, Escape) stops the loop and shows the card in its paused form: "PAUSED", the current distance, "Passengers are waiting on the platform." and a "Resume" button.
13. Reduced motion: no screen shake, no tram tilt, no bobbing lanterns, no chevron nudge, no hit-stop; the near-miss plate crossfades; cards fade without sliding; the count-up shows the final number at once. Speed and lane changes stay so the game is the same game.

## Structure

```
390 × 844, canvas fills the screen
┌──────────────────────────────────────┐
│ 54px                                 │
│ ┌──────┐┌────┐┌─────────┐       (II) │ plates r14, 48px pause
│ │ 84 M ││ x2 ││🏮 3      │            │
│ │DIST. │└────┘│LANTERNS │            │
│ └──────┘      └─────────┘    ☾       │
│  ▙▟▙▙▟▟▙▙▟▙▟▙▙▟▙▟  skyline            │ horizon at 36%
│        ·:::·  arches far away        │
│      ╭─●─●─●─●─●─╮  arch (16 m)      │
│      │  ▬    ┃┃┃  │  barrow, rails    │
│  [ ‹ Swipe to ride › ]               │ ready plate, bottom 330
│     ┃    ┃    ┃                      │
│        ┌──────┐                      │ tram at z = 2.4 m
│        │ ▓▓▓▓ │                      │
│        │●  14 ●│                     │
│        └──────┘                      │
│ 34px                                 │
└──────────────────────────────────────┘
Result card: fixed, left/right 20, bottom 48, r26, pad 24 22 20
```

- `canvas role="img"` with a scene description; all game drawing happens here.
- `div.hud` with three plates and a `button` (pause); counts are plain text nodes updated per frame.
- `div.ready` prompt (hidden with `visibility` after the start).
- `div.toast` for near misses (`aria-hidden`; the live region speaks instead).
- `section.card role="dialog" aria-modal="true"`: an `.over` block (result) and a `.res` block (paused) toggled by a class, then one `button`.
- A visually hidden `p aria-live="polite"`.

## Tokens

```css
:root {
  /* night */
  --night: #0f1320;   /* page */
  --sky-top: #0d111c; --sky-mid: #1d1a26; --sky-horizon: #4a2620;
  --ground-far: #2a1d1f; --ground: #1a1820; --ground-near: #13141c;
  --sleeper: #262735; --rail: #7b8494; --building: #141826; --window: rgba(255,193,94,.55);
  /* plates */
  --plate: #0c0f19; --plate-2: #171b29; --line: #2c3244;
  --text: #f6ecdc; --text-2: #b9b2a6;
  /* lanterns and accents */
  --lamp: #ffc15e;         /* multiplier, primary button, focus */
  --vermilion: #ff6a3d;    /* lanterns, result eyebrow */
  --jade: #5fd3a8;         /* best badge */
  --pole: #3a3242; --barrow: #6e2a24; --barrow-top: #9a3d2f; --barrow-band: #e8c27a;
  --tram: #efe6d2; --tram-band: #1f5c4f; --tram-glass: #1b1f2b; --tail: #ff3d2e;
  /* type */
  --font: "Anton", Impact, system-ui, sans-serif;
  --fs-result: 76px; --fs-hud: 30px; --fs-count: 22px; --fs-btn: 20px;
  --fs-row: 16px; --fs-label: 12px;
  /* sizes */
  --plate-r: 14px; --card-r: 26px; --btn-h: 56px; --pause: 48px;
  /* world */
  --lane-width: 120px; --focal: 12; --z-max: 130m; --tram-z: 2.4m; --arch-every: 16m;
  /* motion */
  --out: cubic-bezier(.16,1,.3,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --spring: cubic-bezier(.34,1.4,.5,1);
  --t-shake: 320ms; --t-card: 460ms; --t-count: 700ms; --t-hitstop: 50ms;
}
```

## Typography

Anton only, all caps-friendly, letter-spacing does the hierarchy.

| Role | Size | Line-height | Tracking | Notes |
|---|---|---|---|---|
| Result distance | 76px | 0.95 | 0.01em | tabular, unit "m" at 30px in `--text-2` |
| Paused distance | 52px | 0.95 | 0.01em | — |
| HUD distance | 30px | 1 | 0.04em | tabular |
| Lantern count, multiplier | 22px | 1 | 0.04em | multiplier in `--lamp` |
| Ready prompt | 22px | 1 | 0.12em | — |
| Result value | 24px | 1 | 0.04em | tabular |
| Button | 20px | 1 | 0.12em | dark on amber |
| Near-miss plate | 20px | 1 | 0.1em | amber |
| Result rows, sentence | 15–16px | 1.2 | 0.08–0.12em | `--text-2` |
| Eyebrow | 14px | 1 | 0.22em | vermilion |
| HUD labels | 12px | 1 | 0.16em | `--text-2` |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| World | running | z per frame | speed 14 → 36 m/s | continuous | rAF, dt ≤ 33ms | same |
| Tram lane | swipe | x | lerp factor `dt·16` | ≈ 180ms | exponential | same |
| Tram tilt | swipe | rotate | ±4° → 0 | decays `0.02^dt` | — | none |
| Multiplier | near miss | scale | 1 → 1.3 → 1 | 360ms | `--spring` | none |
| Near-miss plate | near miss | opacity, translate, scale | pop in, drift up 30% | 700ms | `--out` | crossfade |
| Sparks | near miss | x, y with 900px/s² gravity | 14 particles | 500ms | physics | 4 particles |
| Hit-stop | crash | frozen frame | — | 50ms | — | none |
| Tram squash | crash | scaleX / scaleY | 1.18 / 0.86 → 1 | 330ms | linear decay | same |
| Canvas shake | crash | translate | ±7 / ±4px keyframes | 320ms | `--ease` | none |
| Result card | crash + 650ms | translateY, opacity | 40px / 0 → 0 / 1 | 460ms | `--out` | opacity |
| Distance count | card open | number | 0 → distance | 700ms | cubic out | final at once |
| Stat rows | card open | translateX, opacity | −10px → 0 | 380ms, 520ms + 160ms each | `--out` | no stagger |
| Ride again | card open + 1100ms | scale, opacity | 0.9 → 1 | 420ms | `--spring` | instant |

## States

- **Ready:** board drawn, prompt visible, loop idle.
- **Running:** HUD counting; pause enabled.
- **Paused:** loop cancelled, card in paused form, button "Resume".
- **Crashed:** result card, button "Ride again", "BEST" badge when the session best is beaten.
- **Hover:** primary button `#ffd283`. Focus-visible: 3px `#ffc15e` outline, 3px offset.
- **Multiplier:** x1 to x5, never resets mid-run (the run ends first).

## Accessibility

- Keyboard: Left/Right or A/D change lane, Space or Enter start from ready, P or Escape pause and resume, Enter on the focused button restarts.
- The result card is a modal dialog labelled by its distance; focus moves to Ride again when it appears and back to Pause after restart.
- A polite live region says "Lantern. 3 collected." and "Crashed at 84 metres. Score 184."
- All HUD text sits on solid plates; `#b9b2a6` labels on `#0c0f19` measure 9:1; amber button text `#24160a` on `#ffc15e` 10.9:1.
- Hit targets: pause 48px, button 56px, and the whole canvas is a tap target (left half / right half).

## Responsive rules

- 360 wide: lane width stays 120px at the tram, so the outer lanes sit 60px from the edges; HUD plates keep their sizes and the gap shrinks.
- Taller phones: the horizon stays at 36% of the height; the tram stays at its depth, so it moves down with the bottom edge.
- Landscape or tablet: centre a portrait-sized play column; never stretch lane width with the screen.
- On resize, recompute the canvas size, horizon and centre and redraw immediately (also while paused).

## Acceptance checklist

### Always

- [ ] First frame is the ready state with the track, obstacles and tram visible; one short prompt only.
- [ ] Swipe, tap halves, arrows and A/D all change lanes; the first input starts the run.
- [ ] One projection `F / (F + z)` drives rails, sleepers, arches, obstacles and the tram.
- [ ] Speed ramps with time; spawns always leave a free lane.
- [ ] Near miss = leaving a lane less than 450ms before a barrow passes through it; it raises the multiplier with sparks and a pop.
- [ ] Crash has a 50ms hit-stop, a squash and a shake, then a staggered result card (count-up, rows, button).
- [ ] Pause cancels the rAF loop; resume does not jump (reset the frame clock).
- [ ] Restart returns to the same ready layout; it works any number of times.
- [ ] All text over the canvas is on solid plates; closed card is `visibility:hidden`.
- [ ] Reduced motion keeps the game identical and removes shake, tilt, bob and slides.

### This demo

- [ ] "Lantern Line", tram number 14, result eyebrow "LINE CLOSED · STOP 14".
- [ ] Speed 14 → 36 m/s at +0.4 m/s per second; lanterns score 50 × multiplier; multiplier caps at x5.
- [ ] Arches every 16m with seven lanterns; obstacles spawn 130m out.
- [ ] Anton is the only family.

## Implementation notes

**One camera.** Everything is placed by lane (−1, 0, 1) and depth `z` in metres; draw far to near.

```js
const F = 12, LW = 120;
const sc = z => F / (F + Math.max(z, -F * .6));
const px = (lane, z) => CX + lane * LW * sc(z);
const py = z => HY + (H - HY) * sc(z);       // HY = horizon, H = canvas height
items.sort((a, b) => b.z - a.z);              // arches + barrows + lanterns
for (const it of items) {
  g.globalAlpha = Math.max(0, Math.min(1, (ZMAX - it.z) / 30)); // fade in from the haze
  draw(it, px(it.l, it.z), py(it.z), sc(it.z));
}
```

**Near miss means you were there.** Remember which lane you left and when; check when the barrow passes the tram.

```js
function move(d) { S.from = S.lane; S.lane = clamp(S.lane + d); S.moved = S.t; }
if (o.k === 'b' && !o.passed && o.z < TZ - .9) {
  o.passed = true;
  if (o.l === S.from && o.l !== S.lane && S.t - S.moved < .45) nearMiss(o);
}
```

**Hit-stop inside the loop, not with a timer.** Keep the loop alive for a few frames after the crash, draw without stepping, then let the squash decay.

```js
function loop(now) {
  const dt = last ? Math.min(.033, (now - last) / 1000) : .016; last = now;
  if (S.stop > 0) { S.stop -= dt; draw(); return raf = requestAnimationFrame(loop); }
  if (S.st === 'run') step(dt);
  S.squash = Math.max(0, S.squash - dt * 3);
  draw();
  if (S.st === 'run' || S.squash > 0 || S.sparks.length) raf = requestAnimationFrame(loop);
}
```

Common mistakes:

- Using different perspective maths for the tram and the obstacles, so collisions look early or late.
- Spawning a full row of three barrows; the run must always be survivable.
- Recreating the world from a random seed on restart, so the opening differs; keep the ready layout fixed and randomise only later rows.
