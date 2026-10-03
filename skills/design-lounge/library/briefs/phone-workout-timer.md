<!-- Design Lounge Nº 275 · "Interval workout timer" · designlounge.vercel.app -->

# Interval workout timer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The in-workout screen of Brisk, a fictional interval training app. The phone is propped on the floor two metres away, so everything is huge: a 300px countdown ring, 150px ultra-condensed numerals, a 96px pause button. Work is volt green, rest is cyan, and the whole screen changes colour at each switch with a short full-screen flash, so the phase can be read from the corner of an eye. A segmented timeline along the bottom shows every interval, with each segment's width set by its length. The demo runs live with short intervals (8s work, 4s rest, 8 rounds) and starts in the middle of round 3, so it changes while you watch. The detail worth copying is that colour carries the phase everywhere at once: tag, ring, numerals in the last three seconds, the big button, and the timeline.

## Reference behaviour

1. Initial state: round 3 of 8, WORK, Burpees, 5 seconds left, running. Total time reads 00:27 (two finished rounds plus 3 seconds). The ring is about 40% drained.
2. The ring drains clockwise from 12 o'clock as time passes, updated every animation frame. The numerals change once per second.
3. In the last 3 seconds of any interval the numerals turn the phase colour and pop from 112% scale back to 100% on each new second.
4. At 0 the next interval starts. The body flips to the new phase colour, a full-screen flash in that colour peaks at 50% opacity and fades in 450ms, the ring pulses to 104.5% and back, and the live region announces the change. On devices that allow it, the phone vibrates: 70ms for work, 30-40-30ms for rest.
5. Rest shows "Breathe" in place of the exercise name. Next-up shows the coming exercise and its length.
6. Pause: the clock stops, the tag reads PAUSED on a white chip, the numerals drop to 40% opacity, and the button turns into a play icon labelled Resume.
7. Skip moves to the next interval at once. Back restarts the current interval if more than 1.5s has passed, otherwise it goes to the previous interval.
8. Keyboard: Space toggles pause, Right arrow skips, Left arrow goes back.
9. After round 8 there is no rest. The finish screen rises 24px into place: DONE in 148px volt, then total time, calories, work time, and rest time in a 2 × 2 grid, the full interval bar, a week strip, and two buttons. Focus moves to Go again.
10. Go again restarts from round 1, work, 8 seconds, total 00:00.

## Structure

```
390 × 844 frame, black, padding 54px top, 20px sides, 34px bottom
┌──────────────────────────────────────┐
│ (×)  LEG LADDER              TOTAL   │ 48px top bar
│      8 rounds · 0:08 / 0:04  00:27   │
│                                      │
│              [● WORK]                │ 32px phase tag
│          ╭───────────────╮           │
│        ╱     ·········     ╲         │ ring 300px
│       │        05           │        │ 150px numerals
│       │     BURPEES         │        │ 20px name
│        ╲    ROUND 3/8      ╱         │ 13px
│          ╰───────────────╯           │
│ ┌──────────────────────────────────┐ │
│ │ ▌ NEXT UP                   0:04 │ │ next card, r 18
│ │ ▌ REST                           │ │
│ └──────────────────────────────────┘ │
│      (back)    ( pause )   (skip)    │ 64 / 96 / 64px, gap 28
│        BACK     PAUSE      SKIP      │
│ ROUND 3 OF 8               01:05 LEFT│
│ ▇▇▇▇▕▇▕▇▇▇▇▕▇▕▇▇░░▕ ▕    ▕ ▕   …     │ 15 segments, 22px tall
│  1      2      3      4  …    8      │
└──────────────────────────────────────┘
```

- Top bar: a `header` with an icon `button` labelled "End workout", a title block, and the total time.
- Stage: a `main` labelled "Interval timer". The tag, the ring, and the next card stack in a centred column that takes the free height.
- Ring: one `svg` with three circles: a dashed tick ring (r 147), a track (r 128), and the progress arc (r 128). The numerals and labels sit in an absolutely positioned centre layer. The numerals are `aria-hidden`. The live region speaks instead.
- Controls: a `div role="group"` labelled "Controls" with three `button`s. Each has an `aria-label`. The visible caption is `aria-hidden` so it is not read twice.
- Timeline: a `section` labelled "Interval timeline". Segments are `span`s with `flex-grow` equal to the interval length in seconds. Round numbers sit under the work segments only.
- Flash: a fixed full-screen `div`, `pointer-events: none`, `aria-hidden`.
- Live region: a visually hidden `p` with `aria-live="assertive"`.
- Finish: a fixed `section` labelled by its DONE heading, `aria-hidden` until shown.

## Tokens

```css
:root {
  --bg: #050505;          /* the floor is black on purpose */
  --surface: #121310;     /* cards, round buttons */
  --raise: #20211c;       /* ring track, empty segments */
  --line: #2a2b26;        /* hairlines, tick ring */
  --ink: #f3f5ec;
  --ink2: #a2a797;
  --ink3: #6c7064;
  --volt: #d4ff2e;        /* work */
  --cyan: #2ee6ff;        /* rest */
  --on-ph: #070806;       /* text on volt or cyan */
  --ph: var(--volt);      /* current phase; body[data-ph="rest"] sets var(--cyan) */

  --num: "Big Shoulders Display", Impact, sans-serif;
  --sans: "Archivo", system-ui, sans-serif;

  --ring: min(300px, 78vw, 38vh);
  --ring-stroke: 16px;
  --btn-main: 96px;
  --btn-side: 64px;
  --seg-h: 22px;
  --seg-gap: 3px;

  --r-card: 18px; --r-stats: 20px; --r-seg: 4px; --r-pill: 999px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-7: 28px;

  --snap: cubic-bezier(.16, 1, .3, 1);     /* expo out */
  --std: cubic-bezier(.2, .7, .2, 1);
  --dur-flash: 450ms;
  --dur-pulse: 420ms;
  --dur-tick: 320ms;
  --dur-phase: 200ms;
}
```

## Typography

| Role | Family | Size | Weight | Width | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Countdown | Big Shoulders Display | min(150px, 40vw, 19vh), line-height 0.82 | 900 | condensed by design | -0.01em | numerals, tabular |
| Total time | Big Shoulders Display | 26px | 800 | | 0 | tabular |
| Next-up length | Big Shoulders Display | 26px | 800 | | 0 | |
| Finish DONE | Big Shoulders Display | clamp(110px, 36vw, 148px), line-height 0.8 | 900 | | -0.01em | upper |
| Finish stats | Big Shoulders Display | 44px | 800 | | 0 | tabular |
| Exercise name | Archivo | 20px | 800 | wdth 66 | 0.04em | upper |
| Phase tag | Archivo | 14px | 800 | wdth 75 | 0.14em | upper |
| Next exercise | Archivo | 17px | 800 | wdth 75 | 0.03em | upper |
| Labels (NEXT UP, TOTAL, ROUND) | Archivo | 11 to 13px | 700 to 800 | wdth 88 | 0.12 to 0.14em | upper |
| Body line | Archivo | 15 to 16px | 500 | wdth 88 | 0 | sentence |

Use Archivo's width axis (62 to 125) for the condensed labels. Do not fake it with `transform: scaleX`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Ring arc | every frame while running | stroke-dashoffset | 0 → circumference | interval length | linear in time, by design | keep, it is the clock |
| Numerals | each second | text | n → n-1 | instant | none | keep |
| Last-3 pop | each second at 3, 2, 1 | scale, colour | 1.12 → 1, ink → phase | 320ms | `--snap` | colour only |
| Phase colour | switch | background, stroke | volt ↔ cyan | 200ms | `--std` | 1ms |
| Flash | switch | opacity | 0 → 0.5 at 12% → 0 | 450ms | `--std` | removed |
| Ring pulse | switch | scale | 1 → 1.045 at 40% → 1 | 420ms | `--snap` | removed |
| Segment fill | every frame | width | 0 → 100% | interval length | linear in time | keep |
| Button press | pointer | scale | 1 → 0.94 | 150ms | `--std` | 1ms |
| Finish in | last interval ends | opacity, translateY | 0, 24px → 1, 0 | 300ms / 500ms | `--std` / `--snap` | 1ms |

The ring and segment fills are the clock, not decoration. Linear-in-time is correct here. Drive them from `requestAnimationFrame` and a measured delta, not from a CSS animation, so pause and skip stay exact. Cap each frame's delta at 250ms so a hidden tab does not skip three intervals when it returns.

## States

- Work: `body[data-ph="work"]`. Tag, ring, main button: volt. Next-up bar: cyan (it shows what comes next).
- Rest: `body[data-ph="rest"]`. All of the above in cyan. Next-up bar: volt. Name reads "Breathe".
- Last 3 seconds: numerals in the phase colour.
- Paused: tag on `--ink` with text "PAUSED", numerals at 40% opacity, main button shows play, label "Resume".
- Segment done: filled, 42% opacity. Segment current: fills left to right at full colour with a 1px `--ink3` inset ring. Segment upcoming: `--raise`.
- Round labels: the current round number in `--ink`, others in `--ink3`.
- Finish: the whole screen is replaced. Total time is volt. Go again is a 60px volt pill, Save to log a 60px outlined pill.
- Focus-visible: 3px `--ink` outline, 3px offset, drawn on the round shape of the control buttons, not the caption.
- Short screens (height 740px or less): main button 84px, control row margins 10px top and 12px bottom, next card padding 8px 12px.

## Accessibility

- The countdown numerals are `aria-hidden`. Reading a number every second is noise. The live region speaks only at each switch: "Rest. 4 seconds. Next: Skater hops." and "Work. Skater hops. Round 4 of 8."
- The live region is `aria-live="assertive"` because the change is time-critical.
- At the end it says "Workout complete. Total time 1 minute 32 seconds. 13 calories." Focus moves to Go again.
- The pause button's `aria-label` flips between Pause and Resume. Do not use `aria-pressed` as well.
- Keyboard: Space toggles pause (when focus is not on a button, which handles Space itself), Right arrow skips, Left arrow goes back. Keys are ignored while the finish screen is open.
- The flash is under 0.5 opacity, once per switch, at most one every 4 seconds. That stays well under the three-flashes-a-second limit. It is removed under reduced motion.
- Contrast: `#070806` on volt and on cyan is above 15:1. `--ink2` `#a2a797` on black is above 8:1. `--ink3` is for labels at 11px bold and is about 4:1. Keep it to labels.
- Hit targets: 64px side buttons, 96px main button, 44px close button.
- Colour is not the only phase signal. The tag says WORK or REST and the name changes to Breathe.

## Responsive rules

- At 390 × 844 the ring is 300px. It is `min(300px, 78vw, 38vh)`, so at 360 × 780 it is about 280px. The numerals follow with `min(150px, 40vw, 19vh)`.
- The stage takes the free height and centres. The timeline and controls never move.
- At 360 wide the 15 segments still fit: 92 seconds share about 278px, so work segments are about 24px and rest about 12px. The round numbers under work segments still fit at 11px.
- For long workouts (over 20 intervals) drop the round numbers and show the timeline only.
- On tablet, do not scale the ring past 360px. Put the timeline in a side column and keep the controls under the ring.
- Do not draw a status bar. Top padding max(54px, env(safe-area-inset-top)), bottom max(34px, env(safe-area-inset-bottom)).

## Acceptance checklist

### Always

- [ ] The timer runs live from `requestAnimationFrame` with a measured delta capped at 250ms.
- [ ] The ring drains from 12 o'clock and matches the time left.
- [ ] Every surface that shows the phase switches colour together at each change.
- [ ] Each switch flashes once, pulses the ring once, and announces in an assertive live region.
- [ ] Reduced motion removes the flash and pulse but keeps the ring, numerals, and timeline.
- [ ] Pause, skip, and back work by tap and by Space, Right, and Left.
- [ ] The timeline has one segment per interval with width proportional to its length, and shows done, current, and upcoming.
- [ ] The finish screen shows total time, calories, work time, and rest time, and moves focus to its first button.
- [ ] The main button is at least 84px and the side buttons 64px.
- [ ] No horizontal scroll at 360px.

### This demo

- [ ] First frame: round 3 of 8, WORK, Burpees, 05, total 00:27.
- [ ] Work is `#d4ff2e`, rest is `#2ee6ff`, background `#050505`.
- [ ] Intervals are 8s work and 4s rest, 8 rounds, no rest after round 8 (92 seconds in all).
- [ ] Exercises in order: Jump squats, Mountain climbers, Burpees, Skater hops, High knees, Plank jacks, Lunge switches, Tuck jumps.
- [ ] Calories are round(work seconds × 0.19 + rest seconds × 0.04), so a full run gives 13 kcal.
- [ ] The finish heading is DONE, and the week strip reads "4 of 5 sessions".

## Implementation notes

**The clock.** Keep one source of truth: the index of the current interval and the seconds spent in it. Everything else is drawn from those two numbers.

```js
function frame(t) {
  const dt = Math.min(.25, (t - last) / 1000); last = t;
  if (running) {
    inT += dt; total += dt;
    SEQ[idx].k === 'work' ? workT += dt : restT += dt;
    if (inT >= SEQ[idx].d) { next(); if (!running) return; }
    else draw();
  }
  raf = requestAnimationFrame(frame);
}
function draw() {
  const s = SEQ[idx], f = Math.min(1, inT / s.d), left = Math.ceil(s.d - inT - 1e-6);
  arc.style.strokeDashoffset = C * f;               // C = 2πr, set as dasharray once
  if (left !== shown) { shown = left; num.textContent = String(left).padStart(2, '0'); }
  segs[idx].firstChild.style.width = f * 100 + '%';
}
```

Stop the loop on pause and on finish. Restart it with `last = performance.now()` so the first delta is not the whole paused time.

**The ring.** Rotate the `svg` by -90° so the arc starts at 12 o'clock. Use `stroke-linecap: round`. The dashed tick ring is one circle with `stroke-dasharray: 1.5 9.2` and `stroke-linecap: butt`. No extra elements per tick.

```css
.ring svg { transform: rotate(-90deg); }
.arc { stroke: var(--ph); stroke-width: 16; stroke-linecap: round; transition: stroke .2s; }
.tks { stroke: var(--line); stroke-width: 6; stroke-dasharray: 1.5 9.2; stroke-linecap: butt; }
```

**Replaying a one-shot animation.** The flash and pulse must replay on every switch. Remove the class, force a reflow, add it back.

```js
flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
```

Common mistakes:

- `setInterval(tick, 1000)`. It drifts, and the ring jumps once a second instead of draining.
- Letting a skipped segment keep its partial fill. Set done segments to 100% width when the index moves.
- Reading the countdown aloud every second.
- Calling `navigator.vibrate` before the user has tapped. Chrome blocks it and logs an error. Check `navigator.userActivation.hasBeenActive` first.
- A purple or blue gradient behind the ring. The background is flat black.
- Using one colour for both phases with a label change. The colour switch is the feature.
- Faking condensed type with `scaleX`. Use a condensed family.

Rebuild order:

1. Build the interval list from rounds, work length, and rest length.
2. Lay out the static screen at round 3.
3. Add the clock loop and `draw()`.
4. Add the phase switch: colour, flash, pulse, announcement.
5. Add pause, skip, back, and the keys.
6. Add the timeline.
7. Add the finish screen and Go again.
8. Test at 360 × 780, with reduced motion, and with a screen reader through one switch.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
