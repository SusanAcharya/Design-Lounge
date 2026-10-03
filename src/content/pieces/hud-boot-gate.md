---
title: "HUD boot gate"
summary: "A portfolio intro in three acts: a quiet title card with an Enter control, a ring loader with a boot log, then a CRT-open framed hero whose headline decodes in."
platform: web
type: animation
category: loaders
tags: [intro, boot, hud, gate, portfolio]
styles: [cyber, terminal, dark]
motion: rich
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#07100D", "#0D1814", "#DDEDE4", "#5CF2B0", "#F2C35C"]
fonts: ["Oxanium", "Martian Mono"]
related: [preloader-counter-intro, process-step-dossier, card-terminal-log]
---

# HUD boot gate

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from sibaldesign.com: the idea is a portfolio that opens as a title card you must "enter", then runs a percent ring with a line-by-line boot log, then lands on a HUD-framed hero with an outlined second headline line. This version is the intro for Quillon, the fictional studio of sound designer Ida Quillon, in phosphor green on a near-black green ground. Act A is a title card (mark, spaced wordmark, three meta lines, "Enter Quillon" with a three-bar level meter, and a slow calibration dial on the right). Act B is a 96px ring that counts 0 to 100 in 2.4s while six log rows tick in. Act C is a 1px-framed panel that opens like an old CRT (a horizontal line that expands to full height), with "I score the" in solid type and "quiet parts" in green outline, both decoding from random glyphs. The detail worth copying is that the gate is honest: nothing autoplays, the visitor chooses to enter, and the "loading" is short and themed rather than a fake wait.

### Rules for a real product

1. Act B must not run longer than the real load, and never more than 2.4s. If the site is ready, shorten the ring.
2. Show the gate on the first visit only. On repeat visits, open on Act C with no CRT effect. (The demo always starts at A because it runs in a sandbox and must replay.)
3. Deep links skip the gate entirely.
4. The gate is one click or one key press. No "hold to enter", no sound that starts on its own.

## Reference behaviour

1. Load: Act A. The page is still apart from the dial (one turn per 90s) and the scanline overlay.
2. Hovering or focusing "Enter Quillon": the 56px rule before it grows to 88px and turns green (400ms expo). The three meter bars light in sequence, 150ms apart, looping every 900ms.
3. Click or Enter / Space on the button: Act A fades out (420ms), Act B appears.
4. Act B: the ring arc and the number go from 0 to 100 over 2400ms with ease-in-out quad. The arc is a `stroke-dashoffset` on a circle of circumference 289. Log rows appear when the value passes 15, 30, 45, 60, 75 and 90: opacity 0 → 1 (200ms), translateY 4px → 0 (300ms expo). Row 5 ("ARM meters.peak −1 dBTP STANDBY") has its status in amber.
5. At 100, wait 380ms, fade Act B out and show Act C.
6. Act C: the panel runs `crt` (620ms expo): `scale(1, .004)` at 20% opacity, holds as a line until 45%, then opens to full height. Panel content fades in with stagger: kicker at 500ms, headline 560ms, lede 900ms, tagline 1000ms, waveform 1100ms.
7. Headline decode: line 1 starts 560ms after Act C opens, line 2 at 760ms. Each runs 640ms. Characters left to right lock to their real letter as progress passes their index; unlocked characters show random glyphs from `A–Z # / = + 0 1`.
8. Around 700ms in, focus moves to the `h1` (`tabindex="-1"`, no visible ring) so screen readers land on the headline.
9. Act C extras: three green streaks cross the top area on 7–9s loops, the nav "Room.tone" meter bounces (4 bars), the 48-bar waveform in the panel breathes, the footer clock shows local time and updates every second.
10. "Room.tone" button toggles: `aria-pressed="true"`, bars freeze at 25% height in grey, label becomes "Room.tone.mute".
11. "Replay boot" (bottom-left, 40px tall) cancels every timer and frame, returns to Act A, and focuses the Enter button.
12. Reduced motion: dial, streaks, meters and waveform do not move. Act B runs in 300ms. No CRT open, no decode: text is in place and the panel content fades over 200ms.

## Structure

```
Act A — 1280 × 800
  padding 120px 0 0 240px
  (mark 46) QUILLON  40px, tracking .32em          ┌───────────── dial 440 ──┐
            S O U N D  9px mono                    │   ticks, dashed ring    │
  IDA QUILLON · PRESENTS ────────────── 520px      │        -18.0            │ right 120px
  EST.2011 [WORKS / 2026]                          │      LUFS · REF         │
  MIXED AT 48 KHZ ◤                                └─────────────────────────┘
  ──── ▮▮▮ ENTER QUILLON            44px tall button
  © 2026 · SOUND FOR MOVING PICTURES

Act B — centred column
  ring 96 (track + arc, % inside) · QN.BOOT.SEQ · log 560px, 6 rows: VERB | key value | STATUS

Act C
┌ nav 56px: (logo) QUILLON //          WORKS CREDITS STUDIO GEAR CONTACT  ▮▮▮▮ ROOM.TONE.ON ┐
│ ⌐                                                                                        ¬ │ corners
│   ┌ panel: left/right 84px, top 118px, bottom 84px ──────────────────────────────────┐    │
│ S │ ■ ON.AIR                                                       CH 01 / 02        │ S  │ head 34px
│ I │   « SOUND.FOR.MOVING.PICTURES                                                    │ I  │
│ D │   I SCORE THE           104px solid                                              │ D  │
│ E │   QUIET PARTS           104px outline, green stroke 1.4px                        │ E  │
│   │   lede 12.5px, 520px                                                             │    │
│   │   QUILLON / LISBON / EST. 2011                              ▁▃▅▇▅▃▁ waveform     │    │
│   │ ↓ SCROLL.EXTENDED.CONTENT                         STATUS: ON AIR · 01:46:16      │    │ foot 46px
│   └──────────────────────────────────────────────────────────────────────────────────┘    │
│ ↺ REPLAY BOOT                                                                            │
└ ⌐                                                                                        ¬ ┘
```

- Three `section.stage` elements, fixed full-screen, only one visible (`hidden` on the others).
- Act A: a `ul` of meta lines and a real `button` for Enter.
- Act B: the ring is `role="progressbar"` with `aria-valuenow`. The log `ul` is `aria-hidden` (decorative).
- Act C: `nav` with links (`aria-current="page"` on Works) and the tone toggle `button`. Side labels, corner brackets and streaks are decorative. The panel holds the `h1` (two spans), lede, tagline, waveform and footer.
- One polite live region announces "Loading the reel", then the headline.

## Tokens

```css
:root {
  --bg: #07100d;        /* near-black green */
  --panel: #0d1814;     /* panel body */
  --panel-2: #12201b;   /* panel top of gradient */
  --line: #1e3029;      /* hairlines, ring track */
  --line-2: #2c463c;    /* panel border, corners, idle rule */
  --ink: #ddede4;       /* headline, wordmark */
  --ink-2: #a9bfb3;     /* body, statuses */
  --dim: #7e978b;       /* meta, nav idle */
  --faint: #4a5f55;     /* side labels, copyright */
  --accent: #5cf2b0;    /* phosphor green: arc, verbs, outline, focus */
  --warn: #f2c35c;      /* one amber status */

  --disp: "Oxanium", system-ui, sans-serif;
  --mono: "Martian Mono", ui-monospace, monospace;

  --space: 4px 8px 14px 28px 44px 56px 84px;
  --ring: 96px; --ring-c: 289;   /* 2πr for r = 46 */

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --boot: 2400ms; --crt: 620ms; --decode: 640ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Oxanium | 40px | 700 | 1 | 0.32em | Upper |
| Hero headline | Oxanium | 104px | 700 | 0.94 | -0.005em | Upper; line 2 transparent with 1.4px green stroke |
| Ring number | Oxanium | 22px | 500 | 1 | 0 | Tabular |
| Labels, nav, meta | Martian Mono | 10.5px | 400 | 1.7 | 0.24em | Upper |
| Log rows | Martian Mono | 10.5px | 400 | 1.7 | 0.08em (verbs 0.16em) | Upper verbs, lower keys |
| Lede | Martian Mono | 12.5px | 300–400 | 1.85 | 0 | Sentence |
| Sub-wordmark | Martian Mono | 9px | 400 | 1 | 1.05em | Upper, spaced letters |

Mono carries everything except the wordmark, the headline and the ring number.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Enter rule | hover / focus | width, colour | 56px dim → 88px green | 400ms | expo | instant |
| Enter meter | hover / focus | bar colour | dim → green, 150ms stagger | 900ms loop | steps(1) | off |
| Act swap | enter / end of boot | opacity | 1 → 0 | 420ms | `--ease` | instant |
| Ring | Act B | dashoffset, number | 289 → 0, 0 → 100 | 2400ms | ease-in-out quad | 300ms |
| Log rows | value passes 15·n | opacity, translateY | 0, 4px → 1, 0 | 200 / 300ms | ease / expo | instant |
| Panel open | Act C | transform, opacity | scale(1,.004) .2 → line → full | 620ms | expo | none |
| Content stagger | Act C | opacity | 0 → 1 | 500ms at 500–1100ms | `--ease` | 200ms, no delay |
| Headline decode | Act C | text | random glyphs → letters | 640ms per line, +560 / +760ms | linear by index | none |
| Streaks | Act C | translate, opacity | (0,0) → (260,205), fade in 6%, out by 22% | 7s / 9s loops | `--ease` | hidden |
| Tone meter, waveform | Act C | scaleY | .3 ↔ 1 | 1.1s / 1.6s alternate | ease-in-out | static |
| Dial | Act A | rotate | 0 → 360deg | 90s loop | linear | static |

## States

- Enter button: idle (dim rule, grey bars), hover / focus-visible (long green rule, running meter). Focus ring 1px green, offset 4px.
- Ring: track `--line`, arc `--accent` with round cap.
- Log status: default `--ink-2`; warning `--warn`.
- Nav link: idle `--dim`, hover `--ink`, current `--ink` with a 1px green line 12px below.
- Tone toggle: on (bars moving, "Room.tone.on"), muted (`aria-pressed="true"`, bars at 25% grey, "Room.tone.mute").
- Replay: idle `--dim`, hover green.
- Headline: receives programmatic focus, no outline.

## Accessibility

- The gate is a real `button` with visible text. Enter and Space work. Nothing starts without it.
- The ring is a `progressbar` with live `aria-valuenow`. The log is decorative.
- Live region: "Loading the reel" on start, then the headline text when Act C opens.
- Focus moves to the `h1` in Act C, and back to Enter on replay.
- The decoding headline: the `h1`'s final text is set before announcement; if your screen reader setup reads mid-decode, put the real text in an `aria-label` on the `h1` and mark the visual spans `aria-hidden`.
- Contrast: `#ddede4` on `#07100d` about 16:1; `#a9bfb3` about 10:1; `#7e978b` about 5.6:1; green `#5cf2b0` about 12:1. `--faint` is only for decorative labels.
- Targets: Enter, tone toggle and Replay are 40–44px tall.

## Responsive rules

- ≥1280: as drawn.
- 1024–1100: the dial is hidden.
- ≤900: nav links hidden (logo, tone toggle stay), headline 72px, title card left padding 64px.
- <640: title card padding 72px 24px. Log spans the width minus 40px. Panel insets 16px left/right, top 84px, bottom 84px; body padding 28px 20px; headline 44px; waveform, side labels and streaks hidden; footer drops "Status: on air ·" and keeps the clock; Replay sits 16px from the left.
- No horizontal overflow at 375px.

## Acceptance checklist

### Always

- [ ] Three acts: title card with a real Enter button, short loader, hero. Only one act is visible at a time.
- [ ] Nothing runs or plays until the visitor presses Enter.
- [ ] The loader is a ring with a number and a boot log of five to eight rows; rows appear in step with the number.
- [ ] Loader total time is at most 2.4s.
- [ ] The hero panel opens from a horizontal line (CRT), then content fades in with stagger.
- [ ] The second headline line is outline-only in the accent.
- [ ] Focus goes to the headline in the hero and back to Enter on replay.
- [ ] Replay cancels every pending timer and animation frame.
- [ ] Reduced motion: no dial spin, streaks, meters, CRT or decode; loader 300ms.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Wordmark "QUILLON" with "S O U N D" under it; meta lines "Ida Quillon · presents", "Est.2011 [Works / 2026]", "Mixed at 48 kHz ◤".
- [ ] Button text "Enter Quillon" with three meter bars.
- [ ] Ring label "QN.BOOT.SEQ"; six rows CALIB, LOAD, SYNC, BIND, ARM (amber STANDBY), OPEN.
- [ ] Headline "I score the" / "quiet parts" at 104px Oxanium 700.
- [ ] Panel header "On.air" with a 6px green square and "CH 01 / 02".

## Implementation notes

1. Keep every pending thing in one place so Replay is clean. Timers go into an array, the current rAF id into one variable.

```js
let timers = [], raf = 0;
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
const clear = () => { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); };
```

2. The CRT open is one keyframe on the panel. Hold the line for almost half the time; that pause is what reads as "a tube warming up".

```css
.crt { animation: crt 620ms cubic-bezier(.16,1,.3,1) both; }
@keyframes crt {
  0%   { transform: scale(1, .004); opacity: .2; }
  45%  { transform: scale(1, .004); opacity: 1; }
  100% { transform: none; }
}
```

3. Decode by index, not by random lock. Characters lock left to right as progress passes `i / length`, so the word always resolves in reading order.

```js
function scramble(node, text, delay) {
  const t0 = performance.now() + delay, dur = 640;
  const tick = t => {
    const k = Math.max(0, Math.min(1, (t - t0) / dur));
    node.textContent = [...text].map((c, i) => c === ' ' ? ' '
      : i / text.length < k ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('');
    if (k < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}
```

Common mistakes:

- A loader that ignores real readiness and always takes 5s.
- Auto-entering after a delay. The gate is a choice.
- Outline text with `-webkit-text-stroke` thicker than 2px at this size; it fills in the counters.
- Glow on everything. Only the ON.AIR square and the streak heads glow.
- Forgetting focus: after the gate the keyboard user is left on a hidden button.
