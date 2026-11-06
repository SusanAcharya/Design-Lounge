<!-- Design Lounge Nº 636 · "Pair recall memory game" · www.designlounge.live -->

# Pair recall memory game

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

**Picnic Pairs**, an invented memory-match game on a cream picnic cloth: sixteen cards in a 4 × 4 grid hide eight original illustrated motifs (bee, pear, tulip, snail, strawberry, teapot, watering can, mushroom), each drawn from three to six flat SVG shapes. Card backs are persimmon with a cream dot weave, a stitched inner rule and a ring in the middle, sitting on a 3px darker "thickness" shadow so they read as card stock. The screen opens mid-round: two pairs already found and settled in mint, one card carrying a single word, "Tap", that pulses until the first touch. A pair pops with squash-and-stretch after a 40ms hit-stop and throws seven small gold sparks; a miss shakes both cards and flips them back. Stars are awarded by moves and arrive one at a time on the win panel, followed by a count-up and then the buttons. Custom game UI with Material-style big pill buttons.

## Structure

```
390 × 844 (54px top, 34px bottom clear)
┌──────────────────────────────────────┐
│ 54px safe area                       │
│ Picnic Pairs                    (❚❚) │ 28px / 900, pause 44px circle
│ Round 3 · The garden table           │
│ ┌ MOVES ─┐ ┌ TIME ──┐ ┌ BEST ────┐   │ 3 equal stat tiles, gap 8, radius 14
│ │ 2      │ │ 0:14   │ │ 22 moves │   │ value 22px / 900
│ └────────┘ └────────┘ └──────────┘   │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │ board: 4 × 80px columns,
│ │bee │ │Tap │ │    │ │snl │          │ 108px rows, gap 10, centred
│ └────┘ └────┘ └────┘ └────┘          │ perspective 900px
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│ │    │ │    │ │    │ │bee │          │
│ └────┘ └────┘ └────┘ └────┘          │
│ (rows 3 and 4)                       │
│ 3 stars in 14 moves or fewer  [↻ Reshuffle] │ foot, margin-top auto, pill 48px
│ 34px home indicator                  │
└──────────────────────────────────────┘
Layers: absolute inset 0, panel docked bottom with 16px sides and 34px bottom padding.
```

- `<header>`: `<h1>`, sub line, pause `<button aria-label="Pause">`.
- `.stats`: three tiles, each `<small>` label and `<b>` value.
- `.board` (`role="group"` with an instruction label): 16 × `.cell` → `<button class="card">` with `.b` (back) and `.f` (face, holding `<svg><use href="#motif">`).
- `.foot`: star thresholds text and the Reshuffle pill.
- Two `.layer` dialogs (pause, win) and a visually hidden `aria-live="polite"` line.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---:|---|---|---|
| Ghost card | idle, first frame | ring box-shadow | 0 → 9px, fading | 1600ms loop | `--ease` | 0 | static, no ring |
| Card | flip up / down | rotateY | 0 ↔ 180° | 420ms | `--ease-out` | 0 | faces crossfade 260ms |
| Matched pair | match | scale | 1 → 1.13, 1.07 → .97, 1.02 → 1 | 380ms | `--spring` | 40ms hit-stop | none |
| Sparks ×7 | match | translate, scale, opacity | 0, 1, 1 → radial 52 × 58px, .3, 0 | 520ms | `--ease-out` | 40ms | none |
| Missed pair | miss | translateX | 0, −6, 6, −4, 3, 0px | 360ms | `--ease` | 520ms | none; flip back at 900ms |
| Layer scrim | pause / win | opacity | 0 ↔ 1 | 240ms | `--ease` | 0 | 1ms |
| Panel | pause / win | translateY | 24px → 0 | 420ms | `--sheet` | 0 | 1ms |
| Stars | win | scale, rotate, opacity | .4, −30°, 0 → 1, 0, 1 | 420ms | `--spring` | 320 + 260ms × i | shown at once |
| Results | win | opacity + count-up | 0 → 1, 0 → value | 300ms, 600ms rAF | `--ease` | 1180ms | values at once |
| Buttons | win | opacity | 0 → 1 | 300ms | `--ease` | 1900ms | at once |

Under reduced motion the game stays fully playable: the face and back sit flat and swap by opacity, nothing moves sideways, nothing loops.

## States

- **Face down:** back with weave, stitched rule and ring; 3px thickness shadow.
- **Face up (in turn):** face ground with 1.5px `--line` rule.
- **Matched:** `--ok-bg` ground, 2px `--ok` rule, light green thickness shadow; announced and stays face up.
- **Locked:** during the 420ms match check and 980ms miss window every tap is ignored.
- **Focus-visible:** 3px `--ink` outline, 4px offset on cards, 3px on everything else.
- **Paused:** the board stays visible under the scrim; the timer value is frozen.
- **Won:** header Best updates on a new record; "See board" leaves the solved grid visible.
- **Pressed buttons:** primary `--ink` fill; secondary chip fill with a 1.5px `--chip-line` border.

## Accessibility

- Every card is a `<button>` whose `aria-label` reads "Card 6, face down", "Card 6, teapot" or "Card 6, teapot, matched".
- Keyboard: one roving tab stop on the board. Arrow keys move focus within the 4 × 4 grid (no wrapping across rows), Enter or Space flips, P or Escape pauses and resumes.
- A polite live region announces each match, miss, pause result and the final score ("3 stars. 9 moves in 0:20.").
- Pause and win panels are `role="dialog" aria-modal="true"`, labelled by their titles; Resume and Play again take focus when they appear.
- Motifs never carry meaning by colour alone: each has a distinct silhouette and a name in the label.
- Contrast: `--ink` on `--bg` 15.0:1; `--ink-2` on `--chip` 6.9:1; `--face` on `--ink` 15.9:1; "Tap" pill `--ink` on `--face` 15.9:1.
- Hit targets: cards 80 × 108, pause 44px, pills 48px.

## Responsive rules

- 390 × 844: as drawn.
- 360 wide: columns become 74px and rows 100px, gap stays 10px; the 4 × 4 grid always fits without scroll.
- Short screens (under 740px): rows shrink to 92px and the goal text drops to one line.
- Tablet: keep the column at 430px; the board does not grow past 80 × 108 cards.
- Never scroll the page; `scrollWidth` stays 390.

## Acceptance checklist

**Always**
- [ ] First frame is the board in play, with a single-word "Tap" cue on one card, not a title screen.
- [ ] Cards flip in 3D at 420ms; under reduced motion they crossfade instead.
- [ ] A match pops with squash-and-stretch after a 40ms hold; a miss shakes and flips back by 980ms.
- [ ] Input locks while a pair is resolving; matched and face-up cards ignore taps.
- [ ] The timer runs on `requestAnimationFrame` with capped delta and stops on pause, tab hide and win.
- [ ] Pause shows progress and time, and offers Resume and Reshuffle.
- [ ] Win panel staggers stars, then the count-up, then the buttons.
- [ ] Reshuffle randomises all 16 cards and resets moves and time.
- [ ] Arrows move focus over the grid and Enter flips; P / Escape pause.
- [ ] Cards are at least 80 × 108; nothing fixed in the top 54px or bottom 34px.

**This demo**
- [ ] Picnic Pairs, Round 3 · The garden table; opening state Moves 2, Time 0:14, Best 22.
- [ ] Eight motifs: bee, pear, tulip, snail, strawberry, teapot, watering can, mushroom.
- [ ] Stars: 3 at ≤ 14 moves, 2 at ≤ 20, else 1.
- [ ] Nunito is the only family.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: Moves 2, Time 0:14 (held), Best 22 moves. Bee (cards 1 and 8) and snail (cards 4 and 10) are face up and matched. Card 2 shows the "Tap" pill and a 9px pulsing ring on a 1.6s loop; it holds the roving tab stop.
2. First flip starts the timer (a `requestAnimationFrame` loop adding capped frame time, ≤ 100ms per frame). The ghost pill and pulse are removed for the rest of the round.
3. Tap or Enter on a face-down card: it turns `rotateY(180deg)` in 420ms (expo-out) to its face. Tapping a face-up, matched or locked card does nothing.
4. Second card of a turn: Moves goes up by one and input locks.
5. Match: after 420ms (the second flip finishing) both cards gain the matched style (mint ground, 2px green inner rule), wait a 40ms hit-stop, then pop: scale 1 → 1.13 × 1.07 → .97 × 1.02 → 1 in 380ms on a spring. Seven 7px gold dots fly out radially (52px × 58px ellipse) and fade in 520ms. Input unlocks. Live region: "Match: pear. 3 of 8."
6. Miss: at 520ms both cards shake (±6, ±6, ±4, ±3px over 360ms); at 980ms they flip back down and input unlocks. Live region: "No match: tulip and strawberry."
7. Pause (44px button top right, or P / Escape): the timer loop stops, a 55% scrim fades in (240ms) and a panel rises 24px (420ms): "Paused", "3 of 8 pairs found · 0:15", Reshuffle and Resume. Resume restarts the loop from the current time. Switching away from the tab also pauses.
8. Win (eighth pair): the loop stops 650ms after the last pop; the win panel opens. Stars: three for ≤ 14 moves, two for ≤ 20, otherwise one. Star 1 pops at 320ms, star 2 (the larger middle star, 64px) at 580ms, star 3 at 840ms; unearned stars land in `--star-off`. At 1,180ms the Moves / Time / Best row fades in and counts up from zero over 600ms. At 1,900ms the buttons fade in and "Play again" takes focus.
9. A new best (fewer moves than 22) updates Best in the header and the panel says "New best. 9 moves."
10. Reshuffle / Play again: Fisher–Yates shuffle of the 16 cards, Moves 0, Time 0:00, timer held until the first flip, ghost on card 1, focus on card 1. "See board" closes the win panel and leaves the solved board in view.

## Tokens

```css
:root {
  /* colour */
  --bg: #fbf3e6;        /* picnic cloth */
  --cloth-dot: #efe1cb; /* 18px dot weave on the cloth */
  --ink: #2b1b14;       /* text, primary button, focus */
  --ink-2: #6b5246;     /* labels, secondary text */
  --line: #ecdcc4;      /* tile borders, face rule */
  --chip: #fffaf1;      /* tiles, secondary buttons */
  --chip-line: #d9c4a6; /* 1.5px button border */
  --back: #c8462b;      /* card back */
  --back-2: #a83621;    /* card thickness shadow */
  --dot: #f6d9b8;       /* back weave and stitched rule */
  --face: #fffaf1;      /* card face */
  --ok: #2f7d5b;        /* matched rule */
  --ok-bg: #e3f1e6;     /* matched ground */
  --star: #e8a317;      /* earned star, sparks */
  --star-off: #e7d8c2;  /* unearned star */
  --scrim: rgba(43,27,20,.55);
  /* type */
  --font: "Nunito", system-ui, sans-serif;
  --fs-title: 28px; --fs-panel: 26px; --fs-stat: 22px; --fs-btn: 15px; --fs-body: 14px; --fs-sub: 13px; --fs-goal: 12.5px; --fs-label: 11px;
  /* size */
  --gutter: 20px; --card-w: 80px; --card-h: 108px; --gap: 10px; --motif: 58px;
  --r-card: 16px; --r-tile: 14px; --r-panel: 28px; --r-pill: 999px;
  --pill-h: 48px; --icon-btn: 44px;
  /* shadow */
  --thick: 0 3px 0 #a83621;
  --back-rule: inset 0 0 0 5px #c8462b, inset 0 0 0 6.5px #f6d9b8;
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  --t-flip: 420ms; --t-pop: 380ms; --t-hitstop: 40ms; --t-shake: 360ms; --t-spark: 520ms;
  --t-miss-shake-at: 520ms; --t-miss-back-at: 980ms; --t-layer: 240ms; --t-panel: 420ms;
}
```

## Typography

One family, Nunito, at 700 to 900; its round terminals carry the picnic mood.

| Role | Size | Weight | Line-height | Tracking | Case |
|---|---:|---:|---:|---:|---|
| Title | 28px | 900 | 1 | −.02em | title |
| Panel title | 26px | 900 | 1.2 | −.02em | sentence |
| Stat values | 22px | 900 | 1.15 | 0 | tabular |
| Result values | 20px | 700 | 1.2 | 0 | tabular |
| Buttons | 15px | 800 | 1 | 0 | sentence |
| Panel copy | 14px | 700 | 1.35 | 0 | sentence |
| Sub line, ghost pill | 13px | 700 / 900 | 1.35 | 0 | sentence |
| Goal text | 12.5px | 700 | 1.4 | 0 | sentence |
| Stat labels | 11px | 800 | 1.35 | .1em | upper |

## Implementation notes

**Flip with two faces and `backface-visibility`.** The card turns; its back and face are stacked children, the face pre-rotated:

```css
.card{transform-style:preserve-3d;transition:transform 420ms var(--ease-out)}
.card .f,.card .b{position:absolute;inset:0;backface-visibility:hidden}
.card .f{transform:rotateY(180deg)}
.card.up{transform:rotateY(180deg)}
@media (prefers-reduced-motion:reduce){
  .card,.card.up{transform:none}
  .card .f{transform:none;opacity:0;transition:opacity 260ms linear}
  .card.up .f{opacity:1} .card.up .b{opacity:0}
}
```

Every keyframe that animates a face-up card must keep `rotateY(180deg)` in its transform (the pop and the shake), or the card snaps back to its back for the length of the animation.

**Timer loop with a capped delta.** Never `setInterval`; stop by not scheduling the next frame:

```js
const loop = (now) => {
  if (!running || paused) return;
  time += Math.min(0.1, (now - last) / 1000); last = now;
  timeEl.textContent = fmt(time);
  raf = requestAnimationFrame(loop);
};
const run = () => { running = true; last = performance.now(); raf = requestAnimationFrame(loop); };
```

**Roving focus on a 4-wide grid.** Only one card has `tabIndex = 0`; arrows move it and refuse to wrap rows:

```js
const d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4 }[e.key];
const n = i + d;
if (n < 0 || n > 15 || (Math.abs(d) === 1 && (n >> 2) !== (i >> 2))) return;
focusCard(n);
```

Common mistakes: comparing the pair before the second flip has finished (the player never sees the second face); allowing a third tap during the miss window; a timer that keeps running behind the pause panel; motifs borrowed from emoji sets or a known game; stars that all land at once with the count.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
