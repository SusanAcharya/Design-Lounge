---
title: "Rackwell strength set logger"
summary: "A bench-press logger: set rows with last session's numbers as ghosts, a rest ring that starts on each tick, a plate-math sheet and a squash-pop personal best."
platform: mobile-app
type: screen
category: utility
tags: [fitness, workout, logger, timer, press]
styles: [material, industrial, soft]
motion: rich
difficulty: 2
featured: false
published: 2026-11-06
palette: ["#F5F1EA", "#1D1B17", "#B3401E", "#DDEBD9", "#F2B33D"]
fonts: ["Anybody"]
related: [phone-workout-timer, widget-activity-rings, motion-feedback-ladder]
---

# Rackwell strength set logger

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The in-workout screen of a fictional strength app, Rackwell, on the second exercise of "Push day A": barbell bench press. It is built for sweaty thumbs between sets. Each set is a 60px row with last Tuesday's numbers beside it; empty inputs show those numbers as ghost placeholders, and ticking a set with an empty field accepts the ghost, so a repeat session is one tap per set. Ticking starts a 2:00 rest ring in a dark dock above the home indicator, a plate-math sheet turns 82.5 kg into "25 + 5 + 1.25 per side", and beating your estimated one-rep max pops a gold "New best" card with a squash-and-stretch medal and paper confetti. Material 3 Expressive language: tonal chalk surfaces, one oxide accent, big pill and rounded-square controls, emphasised easing. The detail worth copying: the ghost values are real placeholders, not pre-filled text, so the row shows at a glance which numbers you've actually typed.

## Reference behaviour

1. First frame: warm-up (40 × 10) and sets 1–2 (60 × 8, 75 × 5) are ticked on sage rows. Set 3 is the current row (chalk tint) with 80 typed and reps empty showing a ghost "5". Set 4 has both fields empty with ghosts "77.5" and "5". The dock is already resting: ring at 1:24 of 2:00, "Resting / Set 3 · 80 kg × 5", buttons −15, +15, Skip. Header: "Push day A", elapsed 38:12 counting every second, Finish.
2. Tick a set: empty fields take their ghost values, the row turns sage, the tick button fills `#2F6B3A` and plays a squash pop (scale 1.28 × 0.86, held for 8% of 420ms as a hit-stop, then 0.92 × 1.08, then 1). Rest restarts at 2:00 and the dock names the next set.
3. Personal best: estimated 1RM uses Epley, `w × (1 + reps / 30)`. If it beats the stored best (80 × 4 → 90.7 kg), the gold card rises over the list (420ms expo), the medal squashes in 120ms later, 18 confetti chips burst from the tick button, a "PB" tag appears on the row, and the subline updates to "Best 80 × 5 · est. 93.3 kg". The card leaves after 3.4s.
4. Untick a done set: it reopens (inputs keep their values) and loses any PB tag.
5. Rest ring: a 27px-radius circle, stroke 6, `stroke-dasharray 169.6`; offset = 169.6 × (1 − remaining / total), updated on `requestAnimationFrame` while running only. −15 and +15 change the time (never below 1s). Skip ends the rest; at zero the dock reads "Rest done", the ring shows "Go" and thumps twice, and the adjust buttons hide. Skip on an idle dock starts a fresh 2:00.
6. Plate math chip opens a bottom sheet for the current set's weight (typed or ghost): a 56px weight with − / + steppers (2.5 kg), a 20 kg / 15 kg bar switch, a one-side barbell drawing with coloured plates, "Per side 25 + 5 / 30 kg each side", and "Use 80 kg on set 3". Plates are greedy from 25, 20, 15, 10, 5, 2.5, 1.25 kg; any remainder reads "x kg short".
7. "Use …" writes the weight into the current set and closes the sheet. Scrim tap, the close button and Escape close it too; focus returns to the chip.
8. Add set appends a row whose ghosts are the last row's numbers.

## Structure

```
390 × 844, scrolling column, fixed dock
┌──────────────────────────────────────┐
│ 54px clear                           │
│ (‹)  Push day A           [Finish]   │ top row 56h, icon 44, pill 40h
│      38:12 · Week 6                  │
│ ▬▬ ▬▬ ▭▭ ▭▭ ▭▭                       │ progress: 5 × 6px, gap 4
│ EXERCISE 2 OF 5 · BARBELL            │ 12px, wdth 75, 0.12em
│ Bench press                          │ 38px / 850 / wdth 128
│ Best 80 × 4 · est. 90.7 kg [Plate math]│ chip 40h r12
│ ┌──────────────────────────────────┐ │ sets card r24, pad 8, #FFFDF9
│ │SET LAST TUE      KG   REPS       │ │ grid 40 / 1fr / 76 / 60 / 48, gap 8
│ │(W) 40 × 10     [ 40 ] [10] [✓]   │ │ rows 60h r16, inputs 44h r12
│ │(3) 77.5 × 5    [ 80 ] [ 5] [ ]   │ │ current row tinted #F5F1EA
│ │(4) 77.5 × 5    [77.5] [ 5] [ ]   │ │ ghosts in #6F685E, weight 450
│ │ [        + Add set         ]     │ │ 48h tonal
│ └──────────────────────────────────┘ │
│ ┌ Incline dumbbell press  next ────┐ │ outlined card r20
│ ┌──────────────────────────────────┐ │ toast (when PB): bottom 150, gold
│ │(1:24) Resting      [−15][+15][Skip]│ dock: bottom 34, inset 12, r28,
│ └──────────────────────────────────┘ │ #24211C, ring 64
└──────────────────────────────────────┘
```

- `main.app` scrolls (padding 54 / 16 / 170) with a header row, `div.prog`, the title block, `section.sets[aria-label=Sets]` and the next-exercise card.
- Each row: `span.no` (set label), `span.prev` (last time, with an `aria-label`), two `input[inputmode]` with `placeholder` ghosts, `button.ck[aria-pressed]`.
- `div.toast[role=status]` with the medal SVG and text; `div.bits[aria-hidden]` for confetti.
- `div.dock` with the SVG ring, `div.dtx`, and the −15 / +15 / Skip buttons.
- `section.sheet[role=dialog][aria-modal=true]` with stepper, `[role=radiogroup]` bar switch, the barbell SVG, the per-side text and the Use button, over a `div.scrim`.

## Tokens

```css
:root {
  /* surfaces */
  --bg: #F5F1EA;        /* page, current row */
  --card: #FFFDF9;      /* sets card, sheet */
  --tone: #EAE4D9;      /* tonal buttons, set chips, progress track */
  --edge: #8A8276;      /* input and tick borders, 3.3:1 on white */
  /* ink */
  --ink: #1D1B17; --ink-2: #4F4941; --ghost: #6F685E;   /* ghost 5.4:1 on white */
  /* accent and states */
  --pri: #B3401E;       /* Use button, current progress segment */
  --pri-c: #FFDBCD; --on-pri-c: #3A0B00;   /* Finish */
  --done: #DDEBD9; --done-ink: #245A30; --tick: #2F6B3A;
  --inv: #24211C; --inv-ink: #F5F1EA; --inv-2: #C9C1B4; --ring: #FFB59A; --ring-track: #3E3A33;
  --gold: #F2B33D; --gold-ink: #2B1D00;
  /* plates */
  --p25: #C8372D; --p20: #2E5BA8; --p15: #E5B62E; --p10: #3C8C4C; --p5: #F2EEE6; --p2_5: #1D1B17; --p1_25: #9A9388;
  /* type */
  --font: "Anybody", system-ui, sans-serif;   /* one variable family, wdth 50–150, wght 400–900 */
  --fs-title: 38px; --fs-weight: 56px; --fs-toast: 20px; --fs-input: 18px; --fs-body: 15px; --fs-prev: 14px; --fs-kick: 12px; --fs-head: 11px;
  /* shape */
  --r-card: 24px; --r-row: 16px; --r-input: 12px; --r-tick: 14px; --r-dock: 28px; --r-sheet: 28px; --r-pill: 999px;
  --row: 60px; --input: 44px; --ring: 64px;
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --emph: cubic-bezier(.2,0,0,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-pop: 420ms; --t-toast: 420ms; --t-medal: 640ms; --t-bits: 900ms; --t-sheet: 420ms; --t-row: 240ms;
  --rest: 120s; --pb-hold: 3400ms;
}
```

## Typography

One variable family, used at different widths as different voices.

| Role | Size | Weight | Width (wdth) | Line-height | Notes |
|---|---|---|---|---|---|
| Exercise title | 38px | 850 | 128% | 0.95 | −0.02em |
| Plate weight | 56px (unit 20px) | 900 | 135% | 1 | tabular |
| Toast value | 20px | 850 | 118% | 1.2 | |
| Input value | 18px | 750 | 112% | 1 | tabular; ghost 450 in `--ghost` |
| Header title | 17px | 750 | 110% | 1.15 | |
| Ring time | 17px | 800 | 105% | 1 | tabular |
| Body, buttons | 14–16px | 650–750 | 100% | 1.3 | |
| Kicker, table head, PB tag, NEW BEST | 10–12px | 700–800 | 75–80% | 1 | 0.08–0.14em, upper |

The multiplication sign is set in `system-ui` with 0.22em side margins, because Anybody's × is too small at 14px.

## Motion

| What | Trigger | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|
| Tick pop | tick | scale 1 → 1.28×0.86 (hold 30–38%) → 0.92×1.08 → 1 | 420ms `--expo` | none |
| Row tint | done / reopen | background chalk → sage | 240ms `--ease` | same |
| Rest ring | rAF while resting | dashoffset follows remaining time | live | same |
| Rest over | reaches 0 | ring scale 1 → 1.12 → 1, twice | 600ms `--expo` | none |
| PB card | new best | translateY 16px, scale .96, opacity 0 → 1 | 420ms `--expo` | opacity 200ms |
| Medal | PB card shows | scale .3 rot −18° → 1.18×.84 → .94×1.06 → 1 | 640ms `--expo`, delay 120ms | none |
| Confetti | PB | 18 chips, 7×12px, fly 70–140px in a 150° fan, spin ±270° | 900ms `--expo`, stagger 8ms from 60ms | not drawn |
| Plate sheet | open / close | translateY 105% → 0 | 420ms `--sheet` | opacity 200ms |

## States

- **Done row:** `--done` background, chip `#C3D9BE` with `--done-ink`, inputs bordered `#6E8F6A` on `#F1F7EF`, tick filled.
- **Current row:** first undone row, tinted `--bg`.
- **Ghost:** empty input shows the previous value at weight 450 in `--ghost`; a typed value is 750 in `--ink`.
- **PB row:** a gold 10px "PB" tag above the previous-value column.
- **Resting / Rest done / idle:** see Reference behaviour 5; the adjust buttons are `display:none` when not resting.
- **Sheet closed:** `visibility:hidden` after the slide so its text never counts as on-screen.
- **Bar switch:** selected segment is a raised `--card` pill with a 1px 3px shadow.
- **Focus-visible:** 3px `--pri` outline, 2px offset, on every input and button.

## Accessibility

- Each input has its own label ("Set 3 weight, kilograms", "Set 3 reps"); the previous value has "Last time 77.5 kilograms for 5".
- Tick buttons are `aria-pressed` with "Complete set 3" / "Undo set 3"; focus stays on the tick after re-render.
- A polite live region announces "Set 3 done, 80 kilograms for 5. Rest 2 minutes.", the new best with its 1RM, rest adjustments, "Rest done. Up next: …", and sheet actions. The PB card is also `role=status`.
- The plate sheet is a modal dialog: focus moves to + on open, Tab and Shift+Tab loop inside, Escape closes, focus returns to the chip.
- The bar switch is a `radiogroup` with `aria-checked`.
- Contrast: ghost `#6F685E` on white 5.4:1; `--ink-2` on `--bg` 8.4:1; `--inv-2` on `--inv` 9.6:1; white on `--pri` 5.7:1; `--gold-ink` on `--gold` 11:1. Input and tick borders `#8A8276` are 3.3:1 on white.
- Hit targets: ticks and inputs 44px tall, stepper 56px, dock buttons 42 × 44, Use 56px.

## Responsive rules

- The column caps at 440px and centres; the dock and sheet cap at 440 / 460px.
- At 360 wide the grid keeps 40 / 1fr / 76 / 60 / 48; the previous column shrinks to about 70px and stays on one line with `white-space: nowrap`.
- The list scrolls under the fixed dock; bottom padding 170px keeps the last row clear of the dock and any PB card.
- On tablet, put the plate sheet in a 420px side panel instead of a bottom sheet.

## Acceptance checklist

### Always

- [ ] Rows use real placeholders for last session's numbers, and ticking an empty field accepts the ghost.
- [ ] Ticking a set starts the rest ring from the full rest time and names the next set.
- [ ] The ring is drawn with `stroke-dashoffset` from remaining ÷ total, on rAF only while resting.
- [ ] −15 / +15 / Skip work, and the rest-over state is clearly different.
- [ ] Estimated 1RM uses `w × (1 + r / 30)`; beating the best shows the PB card, tag and updated subline.
- [ ] Tick pop has a visible hit-stop at peak squash.
- [ ] Plate math is greedy per side from 25 down to 1.25 kg, with a bar-weight switch and a "short" remainder.
- [ ] The sheet is a focus-trapped modal that closes on scrim, close, Escape, and returns focus.
- [ ] Inputs keep a 3:1 border; inputs and ticks are ≥ 44px.
- [ ] Reduced motion: no pop, medal, confetti or thump; sheet and toast fade.
- [ ] Scroll width is 390; the dock sits 34px above the bottom.

### This demo

- [ ] Push day A, exercise 2 of 5, Bench press; best 80 × 4 (est. 90.7 kg).
- [ ] Sets W 40 × 10, 1 60 × 8, 2 75 × 5 done; set 3 80 kg with ghost 5 reps; set 4 ghosts 77.5 × 5.
- [ ] Ticking set 3 shows "New best / 80 kg × 5 / Est. 1RM 93.3 kg, up 2.7 kg".
- [ ] Plate math for 80 kg on a 20 kg bar reads "Per side 25 + 5 / 30 kg each side".

## Implementation notes

**Ghost values are placeholders, and the tick resolves them.** Store typed values as strings, fall back to the previous session only on completion:

```js
s.kg = s.kg || String(s.prev[0]);
s.r  = s.r  || String(s.prev[1]);
s.done = true;
const est = +s.kg * (1 + +s.r / 30);
if (est > best + 0.05) { celebrate(est - best); best = est; s.pb = true; }
startRest(120);
```

```css
.row input::placeholder { color: #6F685E; font-weight: 450; opacity: 1; }  /* Firefox dims to .54 without opacity:1 */
```

**The hit-stop is two equal keyframes.** Holding the squash for a few frames is what makes the tick feel heavy:

```css
@keyframes pop {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.28, .86); }
  38%  { transform: scale(1.28, .86); }  /* about 34ms hold at 420ms */
  60%  { transform: scale(.92, 1.08); }
  100% { transform: scale(1); }
}
```

**Greedy plates per side.**

```js
const PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
function perSide(total, bar) {
  let left = (total - bar) / 2; const out = [];
  if (left < 0) return null;
  for (const p of PLATES) while (left >= p - 1e-6) { out.push(p); left -= p; }
  return { out, short: left };
}
```

Common mistakes: pre-filling the inputs with last session's values (you can't tell typed from copied), running the rest ring with `setInterval(…, 1000)` so it steps, re-rendering rows and losing focus on the tick, and leaving the closed sheet only translated off-screen without `visibility:hidden`.
