<!-- Design Lounge Nº 256 · "Goals card with rings and confetti" · www.designlounge.live -->

# Goals card with rings and confetti

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A personal goals card for a habit or finance app: "Autumn goals" for Mira Okafor, Oct 1 – Dec 31. Three goals sit side by side, each a 156px progress ring in its own colour (tomato, marigold, teal) with a big percentage inside, the goal name, a `now / target` line where the target is an inline-editable dashed button, and a −/+ stepper that logs progress. A segmented bar in the footer sums the three. When a goal crosses 100%, the ring's centre fills with ink, a check appears, and 34 confetti pieces burst from the ring once. The detail worth copying is that the celebration fires only on the crossing (by logging or by lowering the target), never on load and never twice, and reduced motion keeps the done state but drops the particles.

Not `progress-bar` (a single linear bar) and not `widget-activity-rings` (nested rings, read-only). This card is about setting and hitting targets.

## Structure

```
1280 × 800, page #d5e3d8 with two soft radial lights; card centred
┌─────────────────────────── card max 920px, r 28px, pad 36/40/28 ───────────────────────────┐
│ MIRA OKAFOR · OCT 1 – DEC 31                                                   88 days    │
│ Autumn goals (40px)                                                   left in the quarter │
│                                                                                           │
│ ┌──────── tile ────────┐  ┌──────── tile ────────┐  ┌──────── tile ────────┐               │
│ │      ╭───────╮       │  │      ╭───────╮       │  │      ╭───────╮       │  3 cols, gap 16│
│ │      │  87%  │ 156px │  │      │ ✓DONE │       │  │      │  65%  │       │  tile r 20px  │
│ │      ╰───────╯       │  │      ╰───────╯       │  │      ╰───────╯       │  pad 24/16/20 │
│ │     Run 60 km        │  │    Read 6 books      │  │     Save $1,200      │               │
│ │   52 km / [60 km ✎]  │  │ 6 books / [6 books ✎]│  │  $780 / [$1,200 ✎]   │               │
│ │    ( − ) ( + 4 km )  │  │   ( − ) ( + 1 book ) │  │   ( − ) ( + $60 )    │               │
│ └──────────────────────┘  └──────────────────────┘  └──────────────────────┘               │
│ ───────────────────────────────────────────────────────────────────────────────────────── │
│ 84% overall · 1 of 3 done   [██████████|█████████|██████░░░░]               Reset goals   │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

- `section.card` labelled by the `h1`. Top row: eyebrow `p`, `h1`, and a right-aligned days-left `p`.
- `ul.goals` of three `li.goal`, each with `--c` set to its colour. Each tile has an `aria-label` that summarises it: "Run 60 km: 52 km of 60 km, 87 percent".
- Ring: an `svg` (viewBox 156, rotated −90°) with three circles: track (r 62), ink disc (r 50, scaled 0 → 1 when done), progress (r 62, `stroke-dasharray` = circumference). A centred overlay holds the check `svg`, the percentage, and the sub label. A zero-size `.confetti` host sits at the ring centre.
- `h2` goal title, then `.amt` with the current amount, a slash, and the target `button` (swapped for the edit input), then a `p.err[aria-live=polite]`.
- `.steps`: two buttons, `−` (icon only, labelled) and `+` with the step text.
- Footer: overall `p`, `.bar[role=img]` with three segments, Reset `button`. A visually hidden `p[aria-live=polite]` announces completions.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Progress ring | load, log, edit | `stroke-dashoffset` | C → C × (1 − p) | 800ms | `--expo` | instant |
| Ink disc | crossing 100% | `transform: scale` | 0 → 1 (origin 78px 78px) | 500ms | `--expo` | instant |
| Tile | crossing 100% | background, border | 5% → 11% tint | 400ms | `--ease` | instant |
| Footer segments | any change | `flex-basis` | old → new | 800ms | `--expo` | instant |
| Confetti (34) | crossing 100% only | translate, rotate, scale, opacity | centre → arc up → fall 160px, fade | 1200–1700ms | `cubic-bezier(.2,.7,.4,1)` | not rendered |
| Step buttons | hover / active | translateY, scale | −1px / +1px, .97 | 150ms | `--ease` | none |

Confetti recipe: angle uniformly within ±75° of straight up, speed 90–200px. Keyframes at 0 (scale .6), 45% (at `x, y`, half rotation), 100% (at `1.25x, y + 160px`, full rotation of ±360°, opacity 0). Every third piece is a 9px circle, the rest are 8 × 12px rectangles with 2px radius. Colours cycle tomato, marigold, teal, ink, `#f2c14e`, `#e8a08a`. Remove all pieces at 1900ms.

## States

- **In progress:** coloured ring arc on the track, ink percentage, "N unit to go".
- **Done:** ink disc fills the centre, check in the light goal tint, "DONE" in white, tile tinted 11%.
- **Target button:** 32px tall, dashed 1px border at 45% goal colour, pencil icon at 65% opacity; hover fills 10% goal colour.
- **Editing:** input 84 × 32, 1.5px border in the goal colour, white field; unit text beside it.
- **Invalid:** border `#b3261e`, `aria-invalid="true"`, error line under the amounts.
- **Minus disabled:** opacity .4, `not-allowed`, no lift.
- **Focus-visible:** 2px ink outline, 3px offset (1px for the input).
- **Empty / loading / error:** not part of this card; if goals fail to load, render the card shell with a single line "Goals didn't load. Try again." and a button.

## Accessibility

- Each tile has an `aria-label` summary that updates on every change.
- The ring SVG is `aria-hidden`; the summary and visible text carry the numbers.
- Target button label: "Target 60 km. Edit target". The input label: "New target for Run, in km" (or "in dollars"). Errors are linked by `aria-describedby` and announced through the polite error line.
- Enter saves, Escape cancels, focus returns to the target button either way.
- `−` buttons are labelled "Remove 4 km from Run"; `+` buttons "Log 4 km toward Run".
- Completion is announced in a polite live region. Confetti is decoration only, and it is `aria-hidden`.
- The footer bar is `role="img"` with a label: "Overall 84 percent: Run 87 percent, Read 100 percent, Save 65 percent".
- Contrast: `--ink` on card 14.7:1; `--ink-2` 7.6:1; `--ink-3` 5.3:1 on card and 4.8:1 on tinted tiles. White on the three mixed button fills: 6.5:1, 4.7:1, 7.2:1. Do not use raw marigold behind white text (2.9:1).
- Hit targets: steppers 40px tall, target button 32 × ≥ 72px, Reset 40px.

## Responsive rules

- **≥ 1280:** three columns as drawn, card 920px.
- **1024 / 768:** card fills width minus 64px; tiles keep three columns down to 761px; ring stays 156px.
- **< 760:** page padding 20/14px, card padding 24/18/20, radius 22px. The top row stacks. Tiles become one column; each tile is a grid `104px | 1fr` with the ring (104px) on the left spanning three rows (title, amounts, steppers). The ring sub label hides unless done. Amounts drop to 12px with `white-space: nowrap`. The footer wraps with the bar taking a full row. The confetti host moves to the 104px ring centre.
- No horizontal scroll at 375px.

## Acceptance checklist

### Always

- [ ] Three goals, each with a ring, a title derived from the target, `now / target`, and a −/+ stepper.
- [ ] The target is an inline-editable button that swaps to a number input; Enter saves, Escape cancels, blur saves.
- [ ] Invalid targets keep the editor open with `aria-invalid` and a visible message.
- [ ] Percent is clamped to 100; the ring never overdraws.
- [ ] Celebration fires only on the transition from below 100% to 100%, by logging or by editing the target.
- [ ] No confetti on load or on reset; never twice for the same crossing.
- [ ] Reduced motion keeps the done state and announcement and removes all particles and tweens.
- [ ] Completion is announced in a polite live region.
- [ ] Footer shows the average percentage, the done count, and a segmented bar.
- [ ] White text only sits on colour fills that clear 4.5:1.

### This demo

- [ ] Mira Okafor, Autumn goals, Oct 1 – Dec 31, 88 days left.
- [ ] Run 52/60 km (+4), Read 6/6 books (+1, starts done), Save $780/$1,200 (+$60).
- [ ] Tomato `#d9512f`, marigold `#c98a12`, teal `#1f7a74` on `#fbfcf7`, page `#d5e3d8`.
- [ ] Ring 156px, radius 62, stroke 13, round caps, 800ms expo.
- [ ] 34 confetti pieces, removed at 1900ms.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: Run 60 km at 52 km (87%, "8 km to go"), Read 6 books at 6 (done: ink disc, marigold check, "DONE"), Save $1,200 at $780 (65%, "$420 to go"). Footer: "84% overall · 1 of 3 done", segmented bar, "Reset goals". Rings draw from 0 to their value on load over 800ms. No confetti on load.
2. `+` logs one step (Run +4 km, Read +1 book, Save +$60). The ring offset animates over 800ms, the percentage and "to go" update immediately, the footer recalculates.
3. `−` removes one step, floored at 0. It is disabled at 0.
4. Crossing 100%: when a goal goes from < 100% to ≥ 100%, the card tile tints darker (11% of the goal colour), the ink disc scales from 0 to 1 over 500ms behind the ring, the check and "DONE" replace the percentage, 34 confetti pieces burst from the ring, and the live region says "Run 60 km complete. Nice work."
5. Percent is clamped at 100. Logging past the target keeps it done and does not re-fire confetti.
6. Edit target: click the dashed target button (`60 km ✎`). It becomes a number input (84px, right-aligned) with the unit beside it, focused and selected. Enter or blur saves. Escape cancels. The goal title rewrites from the target ("Run 64 km", "Save $900", "Read 1 book").
7. Validation: anything not a whole number from 1 to 99,999 keeps the input open, sets `aria-invalid`, turns the border red, and shows "Use a whole number, 1–99,999." under it. Typing clears the error.
8. Lowering a target to at or below the current amount completes the goal and fires the celebration the same way as logging.
9. Reset goals restores the three start values and redraws the rings from 0. It never fires confetti.
10. Reduced motion: rings, disc and bar jump to their values; no confetti; the done state, check and announcement still happen.

## Tokens

```css
:root {
  --bg: #d5e3d8;        /* sage page */
  --card: #fbfcf7;      /* card surface */
  --ink: #1c2923;       /* text, done disc, focus */
  --ink-2: #47554e;     /* amounts */
  --ink-3: #5f6c65;     /* eyebrow, sub labels */
  --line: #dfe6dc;      /* tile borders, footer rule */
  --track: #e8ede4;     /* ring track, bar track */

  --tomato: #d9512f;    /* Run */
  --marigold: #c98a12;  /* Read */
  --teal: #1f7a74;      /* Save */
  --danger: #b3261e;    /* validation only */

  --display: "Bricolage Grotesque", system-ui, sans-serif;  /* opsz axis 12–96 */
  --mono: "Azeret Mono", ui-monospace, monospace;

  --r-card: 28px; --r-tile: 20px; --r-input: 8px; --r-pill: 99px;
  --ring: 156px; --ring-r: 62; --ring-stroke: 13; --disc-r: 50;
  --space: 4px 8px 12px 16px 20px 24px 28px 36px 40px;

  --expo: cubic-bezier(.16, 1, .3, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-ring: 800ms; --t-disc: 500ms; --t-tile: 400ms; --t-micro: 150ms;

  --shadow-card: inset 0 1px 0 rgba(255,255,255,.8), 0 30px 60px -30px rgba(28,41,35,.35), 0 2px 6px rgba(28,41,35,.06);
}
```

Tile background is `color-mix(in srgb, var(--c) 5%, var(--card))` with a border of `color-mix(var(--c) 14%, var(--line))`. Done tiles use 11% and 35%. The `+` button fill is `color-mix(in srgb, var(--c) 70%, var(--ink))` so white text clears 4.5:1 on all three colours. The done check stroke is `color-mix(var(--c) 70%, #fff)`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Eyebrow | Azeret Mono | 11px | 500 | 1.4 | 0.12em | UPPER |
| Card title | Bricolage Grotesque, opsz 96 | 40px | 800 | 1 | -0.03em | Title |
| Days left number | Bricolage Grotesque | 22px | 700 | 1.1 | -0.01em | — |
| Ring percent | Bricolage Grotesque, opsz 72 | 38px (% sign 18px) | 800 | 1 | -0.03em | tabular |
| Ring sub | Azeret Mono | 10px | 500 | 1.2 | 0.1em | UPPER |
| Goal title | Bricolage Grotesque | 20px | 700 | 1.2 | -0.015em | Sentence |
| Amounts, target | Azeret Mono | 13px | 500 | 1 | 0 | tabular |
| Step button | Bricolage Grotesque | 14px | 600 | 1 | 0 | — |
| Footer | Azeret Mono 12px, percent Bricolage 16px 700 | | | | | |
| Error | Azeret Mono | 11px | 500 | 1.4 | 0 | sentence |

## Implementation notes

**Fire on the crossing, not on the state.** Compare before and after, and pass in whether the caller is allowed to celebrate:

```js
function change(g, d) {
  const was = pct(g);
  g.now = Math.max(0, g.now + d);
  paint(g, was < 100);
}
function paint(g, canCelebrate) {
  const p = Math.min(100, Math.round(g.now / g.target * 100)), done = p >= 100;
  const wasDone = g.el.classList.contains('done');
  g.el.classList.toggle('done', done);
  ring.style.strokeDashoffset = C * (1 - p / 100);   // C = 2πr
  if (done && !wasDone && canCelebrate) {
    announce.textContent = `${title(g)} complete. Nice work.`;
    if (!reduce) burst(g.el.querySelector('.confetti'));
  }
}
```

**Confetti with WAAPI and no canvas.** Pieces are spans in a zero-size host at the ring centre:

```js
function burst(host) {
  for (let i = 0; i < 34; i++) {
    const s = host.appendChild(document.createElement('i'));
    if (i % 3 === 0) s.className = 'o';
    s.style.background = COLOURS[i % COLOURS.length];
    const a = (-90 + (Math.random() - .5) * 150) * Math.PI / 180, v = 90 + Math.random() * 110;
    const x = Math.cos(a) * v, y = Math.sin(a) * v, rot = (Math.random() - .5) * 720;
    s.animate([
      { transform: 'translate(0,0) rotate(0) scale(.6)', opacity: 1 },
      { transform: `translate(${x}px,${y}px) rotate(${rot / 2}deg)`, opacity: 1, offset: .45 },
      { transform: `translate(${x * 1.25}px,${y + 160}px) rotate(${rot}deg) scale(.9)`, opacity: 0 }
    ], { duration: 1200 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)', fill: 'forwards' });
  }
  setTimeout(() => host.replaceChildren(), 1900);
}
```

**Ring on first paint.** Set `stroke-dashoffset` to the full circumference when you build the node, then set the real value two animation frames later so the 800ms transition runs. Setting it in the same frame skips the draw-in.

Common mistakes:

- A selector like `.ring svg` that also hits the check icon inside the ring, rotating it −90° and stretching it to 156px. Use `.ring > svg`.
- Celebrating whenever `done` is true: confetti on load, on every log past 100%, and on reset.
- Letting the target input accept 0 or decimals; the percentage divides by it.
- Hiding the done state under reduced motion. Only the particles go.
- White "Done" text on a marigold disc (2.9:1). The disc is ink.
- Re-rendering the whole card on each log; the ring transition restarts from 0.

Rebuild order:

1. Card, top row, three tiles with static rings.
2. Ring maths and the stepper; footer average and bar.
3. Done state (disc, check, tint) and the crossing guard.
4. Confetti and the live announcement.
5. Inline target editing with validation and focus return.
6. Reset, reduced motion, and the < 760 layout.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
