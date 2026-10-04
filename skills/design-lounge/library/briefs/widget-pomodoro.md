<!-- Design Lounge Nº 459 · "Tomato pomodoro timer widget" · designlounge.vercel.app -->

# Tomato pomodoro timer widget

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A pomodoro widget for a desktop focus app or a dashboard corner. The card is cream with a 2.5px brown outline and a hard 8px offset shadow, like a sticker. The countdown ring is drawn as the tomato itself: a thick red ring with a green star-shaped calyx and stem sitting on top at 12 o'clock. The ring empties clockwise as time runs down. Three modes (Focus 25, Short break 5, Long break 15) recolour the ring: tomato red for focus, leaf green for breaks. Four session dots under the controls show progress through a set. The detail worth copying is that the ring and the mascot are the same object, so the whimsy costs no extra space.

## Reference behaviour

1. The first frame is mid-session and running: Focus mode, 17:24 remaining, label "Focus · 2 of 4", the first dot filled, the second dot ringed as current, "Next: short break · 5 min", "Today: 50 min focused".
2. While running, the time drops each second and the ring's arc shrinks smoothly (1000ms linear per second). The calyx sways ±5° over 3.2s, alternating.
3. The big centre button toggles Start / Pause. Its icon swaps between a pause glyph and a play triangle; its label swaps between "Pause" and "Start".
4. Skip ends the current block immediately. From Focus it fills the current session dot (dot pops to 1.3× and back), then goes to Short break, or to Long break after session 4. From a break it goes to Focus and advances the session (after Long break the set restarts at session 1 with no dots filled). Skip keeps the running state.
5. Reset sets the current mode back to its full length and pauses.
6. Clicking a mode chip switches mode, sets its full length and pauses. The face does a 600ms pop (scale .9 → 1).
7. When the countdown reaches 0:00 it advances automatically exactly like Skip, and keeps running.
8. Every full minute of running Focus adds one to "Today: N min focused".
9. Keyboard anywhere on the page (not inside a button): Space toggles start/pause, S skips, R resets.
10. The tab title shows "17:24 · Focus" and updates every second.
11. Reduced motion: no sway, no ring tween (the arc jumps each second), no pops, no colour transitions.

## Structure

```
1280 × 800, card centred, width min(420px, 100vw − 32px)
┌──────────── card, radius 36px, 2.5px ink, shadow 8px 8px 0 ink ───────────┐
│ Pommo (18px display)                          Today: 50 min focused       │
│ ┌───────────── modes pill, 2px ink, padding 4px ─────────────┐            │
│ │ [ Focus ]      Short break        Long break               │ 40px tall  │
│ └────────────────────────────────────────────────────────────┘            │
│                        ✶ calyx + stem                                     │
│                   ╭──── ring 272px ────╮                                  │
│                   │       17:23        │  46px display                    │
│                   │   FOCUS · 2 OF 4   │  14px caps                       │
│                   ╰────────────────────╯                                  │
│            (reset 52px)   (play 84px)   (skip 52px)   gap 22px            │
│                        ● ◎ ○ ○                                            │
│                 Next: short break · 5 min                                 │
│        [Space] start or pause · [S] skip · [R] reset                      │
└───────────────────────────────────────────────────────────────────────────┘
padding 24px 28px 28px
```

- The card is a `section` labelled by the wordmark.
- The modes are a `div role="group"` of three `button`s with `aria-pressed`.
- The ring is one inline SVG (`viewBox="0 0 300 300"`, ring centre 150,158, r 118) with: an ink circle (stroke 25) for the outline, the track circle (stroke 20), the progress circle (stroke 20, round caps, rotated −90°), and the calyx group.
- The time is a `div role="timer"` overlaid in the ring's centre.
- Controls are three `button`s. Session dots are spans inside a `div role="img"` with a descriptive `aria-label`.

## Tokens

```css
:root {
  --bg: #ffe9d6;          /* page, with 1.5px tomato dots on a 28px grid */
  --card: #fff8ef;        /* card surface */
  --ink: #3a1610;         /* outline, shadow, text */
  --ink-2: #7a4a3c;       /* muted text */
  --line: #f0d3bf;
  --tomato: #e8442e;      /* focus accent */
  --tomato-soft: #f8d0c3; /* focus track */
  --leaf: #2f7d4f;        /* break accent, calyx */
  --leaf-soft: #cfe6d4;   /* break track */
  --display: "Rammetto One", Georgia, serif;
  --sans: "Nunito", system-ui, sans-serif;
  --pop: cubic-bezier(.34,1.56,.64,1);
  --ease: cubic-bezier(.2,.7,.2,1);
}
.widget[data-mode="focus"] { --accent: var(--tomato); --accent-soft: var(--tomato-soft); }
.widget[data-mode="short"], .widget[data-mode="long"] { --accent: var(--leaf); --accent-soft: var(--leaf-soft); }
```

Spacing: 4, 6, 10, 16, 18, 22, 24, 26, 28, 30. Radii: card 36px, pills 999px, round buttons 50%, `kbd` 5px.

## Typography

| Role | Family | Size / line | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Countdown | Rammetto One | 46px / 1 | 400 | −0.02em | tabular |
| Wordmark | Rammetto One | 18px | 400 | −0.01em | Title, tomato |
| Mode label in ring | Nunito | 14px | 800 | 0.12em | Upper, accent |
| Mode chips | Nunito | 14px | 800 | 0 | Sentence |
| Today stat, Next | Nunito | 13–14px | 700 | 0 | Sentence |
| Key hints | Nunito | 12px, kbd 11px 800 | — | 0 | — |

Rammetto One is very wide. At 46px "17:23" is about 170px, which fits inside the 200px inner ring at 272px. Do not go above 48px.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Progress arc | each second | stroke-dashoffset | C·(1 − r/L) → next second | 1000ms | linear (time-driven) | jump |
| Arc on pause/mode | state change | stroke-dashoffset | set instantly | 0 | — | same |
| Ring colour | mode change | stroke | red ↔ green | 300ms | --ease | instant |
| Calyx sway | running | rotate | −5° ↔ 5° | 3.2s alternate, infinite | --ease | none |
| Face pop | mode change | scale | .9 → 1 | 600ms | --pop | none |
| Dot fill | session done | scale + fill | 1.3 → 1 | 300ms | --pop | instant |
| Round buttons | :active | translateY, shadow | 0, 4px → 4px, 0 | 120ms | --ease | instant |
| Play button | :active | translateY | 0 → 6px | 120ms | --ease | instant |

Linear is correct for the arc because it represents time, not a UI move.

## States

- Running: pause icon, label "Pause", calyx sways, current dot has a 2px tomato ring with a 3px card gap.
- Paused: play icon, label "Start", no sway, arc frozen at the exact remaining time.
- Focus mode: tomato accent; Break modes: leaf accent on ring, play button, active chip and label.
- Mode chip: rest `--ink-2`, hover `--ink`, pressed filled with `--ink`, card-coloured text and a 3px inset bottom bar in `--accent` (`box-shadow: inset 0 -3px 0 var(--accent)`).
- Round buttons: hover background `--bg`; active pressed down onto their shadow.
- Focus-visible: 3px `--ink` outline, offset 3px, on every button.
- Session dots: empty (ink outline), done (tomato fill), current (outer ring, only in Focus).

## Accessibility

- The play button's `aria-label` flips between "Start" and "Pause". Reset and skip are labelled "Reset timer" and "Skip to next".
- Mode chips use `aria-pressed`; exactly one is true.
- The time is `role="timer"` with `aria-live="off"` so it is readable but not announced every second.
- "Next: …" is `aria-live="polite"` and changes only when the block changes.
- The session dots have `role="img"` and `aria-label="Session 2 of 4, 1 completed"`.
- Shortcuts only fire when focus is not on a button, so Space on a focused button still activates that button once.
- Hit targets: chips 40px tall, round buttons 52px, play 84px. Contrast: ink on card ≈ 14:1; the pressed chip is card text on ink (≈ 14:1). Never put 14px light text on the tomato red; it is only about 3.4:1. The play button carries an icon only, which needs 3:1.

## Responsive rules

- ≥1280 to 768: card 420px, centred on the dotted page.
- <640: card width `100vw − 32px`; the ring stays 272px but has `max-width: 100%`. At 375 nothing overflows; chip labels still fit.
- Embedded in a sidebar 320px wide: keep the ring ≥ 220px and drop the key-hint line.

## Acceptance checklist

### Always

- [ ] The countdown ring is also the mascot: a calyx and stem sit on the ring at 12 o'clock.
- [ ] Ring empties clockwise from 12 o'clock with round caps.
- [ ] Remaining time is computed from an end timestamp, not by decrementing a counter, so background tabs stay accurate.
- [ ] Focus and break modes recolour the ring, the play button and the active chip's bottom bar.
- [ ] Skip and auto-complete fill a session dot; after session 4 Focus goes to Long break.
- [ ] Reset and mode change pause the timer.
- [ ] Space / S / R work when focus is not on a button.
- [ ] Every button has a visible 3px focus ring and a hit target ≥ 40px.
- [ ] Reduced motion removes sway, pops and the arc tween.

### This demo

- [ ] Brand "Pommo"; first frame 17:24 Focus, session 2 of 4, one dot done, running.
- [ ] Lengths 25 / 5 / 15 minutes.
- [ ] Card `#fff8ef`, outline `#3a1610`, shadow 8px 8px 0.
- [ ] Ring r 118 in a 300 viewBox, stroke 20 over a 25 ink outline.

## Implementation notes

**Drift-free countdown.** Store the end time and derive the remaining seconds; tick at 250ms so the display never skips a second:

```js
function setRunning(r) {
  running = r; clearInterval(timer);
  if (r) { endAt = Date.now() + remaining * 1000; timer = setInterval(tick, 250); }
}
function tick() {
  const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
  if (left !== remaining) { remaining = left; paint(); }
  if (left === 0) advance(true);
}
```

**Leading the arc by one second.** If you set the dashoffset to the current remaining value with a 1s transition, the ring is always a second behind the digits. Set it to the value it will have at the next tick:

```js
const C = 2 * Math.PI * 118; // 741.4
const shown = running ? Math.max(0, remaining - 1) : remaining;
prog.style.strokeDashoffset = (C * (1 - shown / LEN[mode])).toFixed(1);
```

When pausing or switching mode, add a class that removes the transition for that frame so the arc doesn't animate backwards.

**Calyx shape.** A squashed five-point star centred on the ring top, scaled 1.35:

```svg
<g transform="translate(150 38) scale(1.35) translate(-150 -38)">
  <path fill="none" stroke-width="3.5" d="M150 36C150 28 152 20 158 13"/>
  <path d="M150 22.6L155.3 34L176.6 33.2L158.6 39.5L166.5 50.5L150 43L133.5 50.5L141.4 39.5L123.4 33.2L144.7 34Z"/>
</g>
```

Common mistakes:

- A thin 4px ring; the tomato reading needs a fat stroke and the ink outline.
- Decrementing `remaining--` in a 1000ms interval; it drifts and freezes in background tabs.
- Global Space handler that also fires when a button has focus, toggling twice.
- Using the display face for chip labels; Rammetto at 14px is mushy.
- Soft blurred shadows; the sticker look is a hard offset shadow with zero blur.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
