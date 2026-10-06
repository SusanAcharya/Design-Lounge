<!-- Design Lounge Nº 266 · "Handheld talk player" · www.designlounge.live -->

# Handheld talk player

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from bermawy.com: the "talks and interviews" block, where a list of talks sits beside a drawn handheld game console that plays the picked video. This piece is the talks section of a personal site for a fictional acoustics designer, Ravi Antolin. Six talks sit in a list on the left. On the right a cream handheld console, the "Pocket Reel", shows the current talk on a four-tone green LCD: a pixel stage with a speaker, a mic and a moving level meter, one caption line, a progress bar and a timecode. The console is not decoration. Its d-pad moves the selection in the list, A plays and pauses, B stops, Select swaps the backlight to amber. The detail worth copying is that the toy is the real control surface, so a dull video list becomes something people want to press.

## Structure

```
1280 × 800, content max-width 1180, padding 36px 48px
┌──────────────────────────────────────────────────────────────────────────────┐
│ RAVI ANTOLIN                                         [notes]  [contact]      │ header, 1px rule under
├──────────────────────────────────────────────┬───────────────────────────────┤
│ talks & interviews                06 recorded│      ┌──────────────────┐     │
│ ┌────────┬──────────────────────────┬──────┐ │      │◂ OFF·ON ▸  REEL-06│     │ console 340×568
│ │ thumb  │ title 14/600             │18:42 │ │      │ ┌──────────────┐ │     │ radius 14 14 70 14
│ │ 92×52  │ event year 12px          │      │ │      │ │ LCD 222×200  │ │     │
│ └────────┴──────────────────────────┴──────┘ │      │ └──────────────┘ │     │ bezel 296×250
│  × 6 rows, gap 10, min-height 70             │      │ Pocket Reel      │     │
│                                              │      │ ✚        (B) (A) │     │ d-pad 100×100
│ hint line: ↑ ↓ choose · A play · B stop      │      │   SELECT START ≡≡│     │ A/B rotated -25°
└──────────────────────────────────────────────┴──────┴──────────────────┴─────┘
 grid: minmax(0,1fr) 380px, column-gap 64px
```

- `header` with the name and a `nav aria-label="Site"`.
- `section.side aria-labelledby` with an `h1` ("talks & interviews" plus a muted count) and an `ol` of six `li > button.row`.
- Each row: `.thumb` (a coloured tile with a two-digit number and nine dark bars, `aria-hidden`), a title span, an event span, a duration span.
- `div.console role="group" aria-label="Pocket Reel player"` containing: `.ridge` (top strip text), `.bezel` (grey, label line, LED, `.lcd`), `.brand`, `.dpad` (4 buttons on a 3×3 grid), `.ab` (B and A), `.pill` (Select and Start), `.grille` (6 slots).
- `.lcd` (`aria-hidden="true"`; the live region speaks for it): a top line (index, event), an inline SVG stage (viewBox 0 0 80 42, `shape-rendering: crispEdges`), a caption, a progress line, a PAUSE tag and two overlay cards (menu, loading). Its state is `data-s="play|pause|menu|load"`.
- One visually hidden `p aria-live="polite"`.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Level bars (10) | playing | scaleY from bottom | 0.3 → 1 → 0.5 | 900ms `steps(4)` infinite, negative delays | static bars |
| Speaker arm | playing | rotate from left end | 0 → -40deg | 1.6s `steps(2)` infinite | static |
| Meter and arm | paused | `animation-play-state` | running → paused | instant | n/a |
| Row | hover / current | background, border | row → row-hi | 160ms `--ease` | instant |
| Console key | press | translateY, shadow | 0 → 3px, shadow 3–4px → 0 | 120ms `--press` | instant |
| LCD palette | Select | background, fills | green → amber | 300ms | instant |
| Load card | row click / A | overlay shown | LOADING... dots (4 steps 1.2s) | 520ms then play | 0ms, plays at once |
| PRESS A | menu | opacity | 1 ↔ 0 | 1s `steps(1)` | steady |
| LED | playing | background, glow | `#3a1c1c` → `#ff4a3a` + 8px glow | 200ms | instant |

Use `steps()` on everything inside the LCD. Smooth tweening on a dot-matrix screen looks wrong. The timecode ticks with `setInterval(1000)`; it is information, so it keeps ticking under reduced motion.

## States

- Row resting: `--row`, 1px `--line` border. Hover: `--row-hi`.
- Row current (`aria-current="true"`): `--row-hi`, 1px `--accent` border, `inset 3px 0 0 --accent`, duration in `--accent`. Exactly one row is current: the selection, which may differ from the loaded talk until A is pressed.
- LCD `play`: stage, caption, progress visible; LED on.
- LCD `pause`: dark PAUSE tag (`--l0` on `--l3` inverted), LED off, animations frozen.
- LCD `menu`: full overlay "POCKET REEL" plus blinking "PRESS A" in `--l1`.
- LCD `load`: full overlay "LOADING..." plus event short name.
- Amber: `.amber` on the console swaps the four LCD tokens.
- Key pressed: sunk 3px, shadow gone. Keyboard presses add a `.hit` class for 120ms so the plastic moves too.
- Focus-visible: 2px `--focus` outline, 3px offset, on rows, nav links and every console key.

## Accessibility

- Rows are `button`s inside an `ol`. The title is the accessible name; the thumbnail is `aria-hidden`.
- Console keys are `button`s with real names: "Previous talk", "Next talk", "Back 10 seconds", "Forward 10 seconds", "A, play"/"A, pause" with `aria-pressed` for playing, "B, stop", "Select, swap backlight colour" with `aria-pressed`, "Start, play or pause".
- The LCD is `aria-hidden`; a polite live region announces Playing, Paused at mm:ss, Stopped, Talk finished, Selected, and the backlight.
- Keyboard: arrows, A, B and Enter work when focus is on the page body, in the list or in the console. Enter on a focused button keeps its native click.
- Hit targets: d-pad arms 33×33px, A/B 46px circles, Select/Start 46×14px pills with label text under them making a 40px+ target column. On touch builds, pad the pills to 44px.
- Contrast: `#e9e4d4` on `#243032` is about 11:1; `#8a9188` on `#243032` is about 4.6:1. LCD `#2e3a1f` on `#b9c68c` is about 7:1.

## Responsive rules

- ≥1280: as drawn, two columns, console top-aligned with the list.
- 1024: same grid; the list column shrinks; titles wrap to two lines.
- <900: one column. The console moves above the list, centred. The page scrolls.
- <480: padding 24px 16px, rows become thumb 64px + text, the duration drops under the title, the console scales to 0.9 from its top centre, the header nav hides.
- Never shrink the LCD below 200px wide; scale the whole console instead so the proportions hold.

## Acceptance checklist

### Always

- [ ] The list and the console are one control: d-pad changes the list selection, A loads or toggles, B stops.
- [ ] Exactly one row is current, shown by border plus inset bar plus coloured duration, not colour alone.
- [ ] The LCD uses exactly four tones and only `steps()` animations.
- [ ] First frame is already playing, not on the menu.
- [ ] Every key sinks 3px on press, for mouse and keyboard.
- [ ] Console keys are buttons with spoken names; A and Select expose `aria-pressed`.
- [ ] A polite live region reports play, pause, stop, finish and selection.
- [ ] Reduced motion freezes meter, arm, blink and load card; the clock still ticks.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Six talks; first is "Why quiet rooms sell more coffee", Soundfront 2026, 18:42, starting at 03:12.
- [ ] Console 340×568px, radius 14px 14px 70px 14px, body `#e6d8ae` → `#d9c894`.
- [ ] LCD 222×200px, green `#b9c68c` base, amber `#ebcb86` after Select.
- [ ] Brand reads "Pocket Reel", second word `#9c2f3d`.
- [ ] Loading card lasts 520ms.
- [ ] Current row border `#e0562a`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: talk 01 "Why quiet rooms sell more coffee" is selected and already playing at 03:12 of 18:42. Its row has a 1px tomato border and a 3px tomato inner bar on the left. The console LED is lit red. The level meter bars step up and down. The speaker's arm gestures.
2. The timecode ticks once per second. The progress fill grows with it. The caption changes every 4 seconds, cycling three lines per talk.
3. Click any row: that talk loads. The LCD shows a "LOADING..." card with the event short name for 520ms, then plays from 00:00. The row becomes current.
4. D-pad up/down (or keyboard ArrowUp/ArrowDown): moves the selection highlight in the list, wrapping at both ends. It does not load. The live region says "Selected: <title>. Press A to play."
5. A (or keyboard A, or Start): if the selected talk is not the loaded one, or the LCD is on the menu, load the selected talk. Otherwise toggle play and pause.
6. Paused: the meter and the arm freeze mid-step, the LED goes dark, and a dark "PAUSE" tag sits on the stage.
7. D-pad left/right (or ArrowLeft/ArrowRight): seek -10 / +10 seconds. Ignored on the menu or while loading.
8. B: stop. Time resets to 00:00, the LCD shows "POCKET REEL" and a blinking "PRESS A".
9. Select: toggles the LCD palette between green and amber over 300ms. `aria-pressed` follows.
10. When a talk reaches its end it stops and shows the menu card. The live region says "Talk finished".
11. Every console key visibly sinks 3px when pressed, by mouse or keyboard.

## Tokens

```css
:root {
  /* page */
  --bg: #1f2a2c;          /* slate page, 16px dot grid at 6% bone */
  --row: #243032;         /* list row */
  --row-hi: #2c3b3e;      /* row hover / current */
  --ink: #e9e4d4;         /* titles */
  --ink-2: #b4b6a6;       /* durations, nav */
  --ink-3: #8a9188;       /* event lines, hints */
  --line: #3a4a4c;        /* hairlines and row borders */
  --accent: #e0562a;      /* tomato: current row, name half */
  --focus: #f2b544;

  /* console */
  --shell: #e6d8ae;  --shell-2: #d9c894;   /* body gradient 170deg */
  --shell-ink: #5c5338;                    /* ridge text */
  --bezel: #4a4a52;
  --key: #2d2c33;                          /* d-pad */
  --ab: #9c2f3d;                           /* A/B and brand second word */
  --brand-blue: #2f3a7a;                   /* key labels, "Pocket" */

  /* LCD, four tones, dark to light */
  --l0: #2e3a1f; --l1: #56683a; --l2: #8a9c5a; --l3: #b9c68c;
  /* .amber on the console swaps them */
  /* --l0: #3b2410; --l1: #7a4a1c; --l2: #c08a3a; --l3: #ebcb86; */

  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --pix: "VT323", ui-monospace, monospace;

  --space: 4px 8px 10px 16px 18px 28px 36px 48px 64px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --press: cubic-bezier(.16,1,.3,1);
  --t-micro: 120ms; --t-row: 160ms; --t-light: 300ms; --t-load: 520ms;
}
```

## Typography

| Role | Family | Size | Weight | Tracking | Case / colour |
| --- | --- | --- | --- | --- | --- |
| Name mark | IBM Plex Mono | 13px | 600 | 0.18em | uppercase; second word `--accent` |
| Nav | IBM Plex Mono | 13px | 400 | 0.06em | `[notes]` with brackets, `--ink-2` |
| Section label | IBM Plex Mono | 12px | 500 | 0.14em | lowercase, `--ink-2`; count `--ink-3` |
| Row title | IBM Plex Mono | 14px / 1.35 | 600 | 0 | sentence case, `--ink` |
| Row event | IBM Plex Mono | 12px | 400 | 0.02em | lowercase, `--ink-3` |
| Duration | IBM Plex Mono | 12px | 400 | 0 | tabular, `--ink-2`; current `--accent` |
| LCD text | VT323 | 15px / 16px | 400 | 0 | uppercase top line, sentence caption |
| LCD overlay | VT323 | 22px | 400 | 0 | uppercase |
| Brand | IBM Plex Mono | 17px | 600 italic | -0.01em | "Pocket" blue, "Reel" `--ab` |
| Key labels | IBM Plex Mono | 9–11px | 600 | 0.1–0.14em | uppercase, blue |

Only the LCD uses VT323. Everything printed on plastic or the page is Plex Mono.

## Implementation notes

1. **The d-pad is a 3×3 grid, not an image.** The centre cell is a pseudo-element; the four arms are buttons.

```css
.dpad { width: 100px; height: 100px; display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr); }
.dpad::before { content: ""; grid-area: 2 / 2; background: var(--key); }
.dpad button { border: 0; background: var(--key); box-shadow: 0 3px 0 #17161b;
  transition: transform 120ms var(--press), box-shadow 120ms var(--press); }
.dpad .u { grid-area: 1 / 2; border-radius: 4px 4px 0 0; }
.dpad .d { grid-area: 3 / 2; border-radius: 0 0 4px 4px; }
.dpad .l { grid-area: 2 / 1; border-radius: 4px 0 0 4px; }
.dpad .r { grid-area: 2 / 3; border-radius: 0 4px 4px 0; }
.dpad button:active, .dpad button.hit { transform: translateY(3px); box-shadow: none; }
```

2. **Pixel stage in SVG.** Draw the scene with `rect`s on an 80×42 viewBox, `shape-rendering="crispEdges"`, classes `c0/c1/c2` filled from the LCD tokens. Animate meter bars with `transform-box: fill-box; transform-origin: 50% 100%` so each bar grows from its own base. Pause with `animation-play-state`, never by removing the class, so the bars freeze where they are.

3. **One key function for all inputs.** Clicks on `[data-k]`, list clicks and keydown all route into `key(k)`. A has two meanings; keep the rule in one place:

```js
function key(k) {
  if (k === "up" || k === "down") { sel = (sel + (k === "up" ? -1 : 1) + n) % n; paint(); return; }
  if (k === "left" || k === "right") { if (state === "menu" || state === "load") return;
    sec = clamp(sec + (k === "left" ? -10 : 10), 0, talks[cur].d - 1); paint(); return; }
  if (k === "a" || k === "start") {
    if (sel !== cur || state === "menu") return load(sel);
    playing ? pause() : play(); return; }
  if (k === "b") return stop();
  if (k === "select") console.classList.toggle("amber");
}
```

Common mistakes:

- Drawing a famous console's logo or wordmark. Name the device yourself.
- Making the console a picture with no working keys; the whole point is that it controls the list.
- Loading on d-pad move. Moving only selects; A loads.
- Smooth CSS transitions inside the LCD. Use `steps()`.
- Making the LCD text accessible by reading it every second. Use the live region for events only.
- Putting a real `<video>` in the demo; the piece is about the control model. In production, replace the pixel stage with the video poster and keep the keys.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
