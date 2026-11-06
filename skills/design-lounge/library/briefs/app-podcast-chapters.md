<!-- Design Lounge Nº 664 · "Slow Archive podcast player" · www.designlounge.live -->

# Slow Archive podcast player

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The full-screen now-playing view of a fictional podcast app, playing Slow Archive episode 48, "The cartographer who drew the wind". It sits on warm espresso dark with one coral accent and treats the episode like a printed feature: Instrument Serif for the title and the spoken line, DM Sans for everything that is UI. Four parts follow one clock: a transcript card whose current sentence fills in word by word, a chapter list that highlights and scrolls to the current chapter, a waveform scrubber with gaps and dots at chapter boundaries, and the transport row in the thumb zone. The detail worth copying: the chapters are visible in the waveform itself, as gaps between bar groups and a dim band for the current chapter, so you can see where you are in the story before you read a label. iOS 26-style language: large rounded surfaces, a modal bottom sheet, spring-ish ease.

## Structure

```
390 × 844, espresso ground with a warm radial at the top
┌──────────────────────────────────────┐
│ 54px clear                           │
│ (⌄)     Playing from Slow Archive (…)│ bar 44h, icon buttons 44
│ ┌──────┐ EPISODE 48 · 6 NOV          │ art 116 × 116, r 16
│ │ art  │ The cartographer who        │ title 27px serif
│ │No. 48│ drew the wind               │
│ └──────┘ Mara Lindqvist with Tomás…  │
│ ┌──────────────────────────────────┐ │ transcript card 150h, r 20
│ │ • TRANSCRIPT              17:42  │ │
│ │ previous sentence…               │ │ 13px, 1 line
│ │ MARA And you decided the flags   │ │ 21px serif, 3 lines max
│ │ were the wrong way round.        │ │
│ │ next sentence…                   │ │
│ └──────────────────────────────────┘ │
│ Chapters                    4 of 7   │ 22px serif
│ 01  Cold open                  0:00  │ rows 44h, r 12, scroll
│ 04  Drawing what you can't see 17:05 │ current: fill + progress line
│ ▌▌▌▌ ▌▌▌▌▌▌|▌▌▌▌ ▌▌▌▌ ▌▌▌▌ ▌▌▌▌      │ waveform 56h, gaps at chapters
│ 17:42  Drawing what you…     −30:30  │ 12px
│ (1×)  ↺15   ( ❚❚ )   30↻   (☾ Off)   │ controls row 76h
│ 34px clear                           │
└──────────────────────────────────────┘
```

- `.bar`: two icon `button`s and a two-line label.
- `section.ep`: decorative SVG art (`aria-hidden`), kicker, `h1`, byline.
- `section.tx[aria-labelledby]`: header with the clock, `div.lines` of three `p`; the current one has one `span` per word.
- `ol.chs`: seven `li > button.ch` with number, title, start, and `i.pg`; current gets `aria-current="true"`.
- `div.wave` (pointer surface) with an SVG of bars and dots, and `div.knob[role=slider][tabindex=0]` as the focusable control.
- `.ctl`: five buttons on a `64px 1fr 72px 1fr 64px` grid.
- `section.sheet[role=dialog]` with a `role=radiogroup` of five `role=radio` buttons.

## Motion

| What | Trigger | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|
| Playback clock | play | rAF, dt capped at 100ms | — | same |
| Spoken words | clock | `--text-2` → `--text` | 200ms ease | instant |
| Current line | sentence change | y 10px, opacity .4 → rest | 320ms expo | instant |
| Live dot | playing | opacity 1 → .3 → 1 | 1.6s ease, infinite | static |
| Skip arrow | skip | rotate ∓40° → 0 | 360ms expo | none |
| Press | pointer down | scale .92 | 160ms ease | none |
| Chapter scroll | chapter change | scrollIntoView nearest | smooth | instant |
| Sleep sheet | open / close | translateY 110% → 0 | 380ms iOS sheet | instant |
| Scrim | open / close | opacity 0 → 1 | 240ms ease | instant |

## States

- **Playing:** pause icon, live dot breathing. **Paused:** play icon, dot still.
- **Speed not 1×:** pill filled `--text` with `--bg` text.
- **Sleep active:** pill filled, label is the countdown or "Chapter"; the chosen option shows a coral dot on a `--line` fill.
- **Current chapter:** row fill, bold title, coral number, progress line; other rows hide the line.
- **Scrubbing:** knob and all readouts follow the pointer 1:1, even while paused.
- **Sheet closed:** `visibility:hidden`; scrim hidden.
- **End of episode:** clock stops at 48:12 and the player pauses.
- **Focus-visible:** 2px coral outline, 3px offset (4px on the knob).

## Accessibility

- The knob is `role="slider"` with values in seconds (0–2892) and `aria-valuetext` like "17:42 of 48:12, chapter 4, Drawing what you can't see". Keys: ← → 5s, ↑ ↓ 30s, Home, End, PageDown next chapter, PageUp chapter start (or previous chapter within 3s of a start).
- Space toggles play when focus is on the page body.
- Play, skip, speed and sleep buttons have explicit labels that change with state ("Pause", "Playback speed 1.5 times", "Sleep timer 30 minutes").
- Current chapter uses `aria-current="true"`; chapter jumps and sleep changes are announced in a polite live region. The transcript itself is not live (it would talk over the audio).
- The sleep sheet is a modal dialog with a radio group; focus moves to the checked option, Escape or scrim closes, focus returns to the pill.
- Contrast: `--text-2` on `--bg` 8:1, coral on `--surface` above 6:1, `--accent-ink` on coral above 7:1.
- Hit targets: play 72, skips 56, pills 58 × 36 in a 76px row, chapter rows 44, icon buttons 44.

## Responsive rules

- Column max 430px, centred. The chapter list is the flexible region: it shrinks on short screens and grows on tall ones; everything else has a fixed height.
- At 360 wide the title wraps to three lines at 27px; the art stays 116px.
- Waveform keeps 96 bars and stretches (`preserveAspectRatio="none"`), so chapter gaps stay at the right times.
- On tablet, put the art, title and transcript in a left column and the chapters and transport in a right column.

## Acceptance checklist

### Always

- [ ] One clock drives the times, knob, bars, chapter row and transcript, from a capped `requestAnimationFrame` loop that stops when paused.
- [ ] Chapter boundaries show in the waveform as a missing bar and a 2px dot.
- [ ] Bars are three colours: played, current chapter, rest.
- [ ] The current chapter row is highlighted, shows progress and scrolls into view.
- [ ] The current transcript sentence fills in word by word; the previous and next sentences show on either side.
- [ ] Skip back 15 and forward 30 work and spin their arrows.
- [ ] Speed cycles five values and scales the clock.
- [ ] Sleep timer counts down or waits for the chapter end, then pauses.
- [ ] The slider is focusable with the full key map and readable value text.
- [ ] The sheet is `visibility:hidden` when closed; scroll width 390.

### This demo

- [ ] Slow Archive, episode 48, 6 Nov, Mara Lindqvist with Tomás Ruel, 48:12.
- [ ] Opens playing at 17:42 in chapter 4 of 7, "Drawing what you can't see" (17:05).
- [ ] Chapters at 0:00, 2:10, 9:45, 17:05, 26:30, 34:50, 42:15.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: playing at 17:42 of 48:12, chapter 4 of 7 "Drawing what you can't see". The transcript shows the previous sentence (13px, one line), the current sentence (21px serif, up to three lines) with its speaker tag, and the next sentence. The live dot next to "Transcript" breathes (opacity 1 → .3, 1.6s).
2. Playback runs on `requestAnimationFrame`: `t += min(dt, 0.1s) × speed`. Every frame updates the times, the knob, bar colours, the chapter progress line and the transcript.
3. Transcript: sentences carry start times. The current one is the last with `start ≤ t`. Within it, the spoken share is `(t − start) / min(8.5s, next.start − start)` and that share of words turns from `--text-2` to `--text` (200ms colour transition). When the sentence changes, the block re-renders and the current line rises in (translateY 10px → 0, opacity .4 → 1, 320ms expo).
4. Waveform: 96 bars across the width. Bars before `t` are coral, bars inside the current chapter are `#7A6A5F`, the rest `#4A3E37`. One bar is removed at each chapter start (the gap), with a 2px dot under it.
5. Scrub: pointer down anywhere on the waveform seeks to that x, with pointer capture; move keeps seeking. The 2px knob line with a 10px head follows.
6. Chapter list: seven rows, 44px; the current row has a `--surface-2` fill, bold title, coral number and a 2px coral progress line along its bottom edge. On chapter change it scrolls into view (nearest, smooth). Tapping a row seeks to its start.
7. Transport: speed pill cycles 1× → 1.25× → 1.5× → 2× → 0.8×, filled cream whenever not 1×. Back 15 and Forward 30 seek and spin their arrow (from ±40°, 360ms expo). Play / Pause (72px coral disc) toggles; pressed buttons scale to .92.
8. Sleep timer pill opens a sheet (380ms iOS sheet, 50% scrim) with Off, 15, 30, 45 minutes and End of chapter ("in 8:20" computed from the remaining chapter time at the current speed). Choosing closes the sheet after 220ms; the pill fills cream and counts down ("14:59"), or reads "Chapter". At zero, or at the next chapter boundary, playback pauses and the pill returns to "Off".
9. The bottom line under the waveform reads current time (bold), the current chapter title, and the remaining time with a minus sign.

## Tokens

```css
:root {
  --bg: #17120F;          /* espresso */
  --bg-glow: #2A1D16;     /* radial at top: 120% 60% at 50% 0 */
  --surface: #221B17;     /* transcript card */
  --surface-2: #2C231E;   /* current chapter, sheet */
  --line: #3A302A;        /* selected sleep option */
  --pill-line: #6E625A;   /* speed and sleep pill borders */
  --text: #F1E9DF;
  --text-2: #B8ABA0;      /* 8:1 on --bg */
  --accent: #F0925E;      /* coral: play, played bars, speaker, current number */
  --accent-ink: #2A1209;  /* icon on the play disc */
  --bar-chapter: #7A6A5F; /* unplayed bars in the current chapter */
  --bar-rest: #4A3E37;
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "DM Sans", system-ui, sans-serif;
  --fs-title: 27px; --fs-line: 21px; --fs-h2: 22px; --fs-sheet: 24px;
  --fs-body: 14px; --fs-small: 13px; --fs-meta: 12px; --fs-kick: 11px;
  --r-art: 16px; --r-card: 20px; --r-row: 12px; --r-sheet: 28px; --r-pill: 18px;
  --play: 72px; --skip: 56px; --pill-h: 36px; --row-h: 44px; --wave-h: 56px;
  --shadow-art: 0 18px 40px -16px rgba(0,0,0,.7);
  --shadow-play: 0 10px 28px -10px rgba(240,146,94,.7);
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  --t-word: 200ms; --t-line: 320ms; --t-spin: 360ms; --t-sheet: 380ms; --t-press: 160ms; --t-live: 1.6s;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Notes |
|---|---|---|---|---|---|
| Episode title | Instrument Serif | 27px | 400 | 1.02 | −0.01em; last words italic |
| Current transcript line | Instrument Serif | 21px | 400 | 1.18 | 3-line clamp |
| Chapters heading, sheet title | Instrument Serif | 22px / 24px | 400 | 1 | — |
| Chapter title | DM Sans | 14px | 400, current 600 | 1.4 | ellipsis |
| Byline, previous / next line | DM Sans | 13px | 400 | 1.4 | `--text-2` |
| Pills | DM Sans | 13px | 600 | 1 | tabular numbers |
| Times, chapter starts | DM Sans | 12px | 400, current time 600 | 1.4 | tabular numbers |
| Kicker | DM Sans | 12px | 600 | 1 | 0.08em, upper, coral |
| Speaker tag, card header | DM Sans | 11px | 600 | 1 | 0.06–0.1em, upper |
| Skip numerals | DM Sans | 11px | 600 | 1 | centred in the arrow |

## Implementation notes

**The clock.** Cap the delta so a background tab does not jump the episode, and stop scheduling frames when paused:

```js
function tick(now) {
  if (!playing) return;
  const dt = last ? Math.min(.1, (now - last) / 1000) : 0; last = now;
  t = Math.min(DUR, t + dt * SPEEDS[si]);
  if (sleepMode && sleepMode !== 4 && (sleepLeft -= dt) <= 0) endSleep();
  if (t >= DUR) setPlay(false);
  draw();
  if (playing) requestAnimationFrame(tick);
}
```

**Word-by-word fill without re-rendering every frame.** Re-render the sentence only when its index changes; every frame just toggles a class on the word spans:

```js
let s = 0; while (s < TX.length - 1 && TX[s + 1].t <= t) s++;
const span = Math.min(8.5, (TX[s + 1] || { t: DUR }).t - TX[s].t);
const said = Math.ceil(Math.min(1, (t - TX[s].t) / span) * words.length);
if (s !== curS) { curS = s; renderLines(s); }
wordSpans.forEach((w, i) => w.classList.toggle('s', i < said));
```

**Chapter gaps in the waveform.** Skip the bar nearest each chapter start and mark it underneath:

```js
for (let i = 0; i < N; i++) {
  const at = i / N * DUR;
  if (CH.some(c => c[0] > 0 && Math.abs(c[0] - at) < DUR / N * .9)) continue;
  bars += `<rect data-t="${at}" x="${i * bw + .7}" y="${(H - h) / 2}" width="${bw - 1.4}" height="${h}" rx="1"/>`;
}
```

Put `role="slider"` on the knob, not on the waveform: the waveform has no edge of its own, and a slider must show where its value is. Common mistakes: making the transcript `aria-live` (a screen reader would read over the episode), recolouring all bars with a gradient instead of three states, and letting the chapter list push the transport out of the thumb zone.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
