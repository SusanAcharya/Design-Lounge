---
title: "Tablet kiosk check-in"
summary: "A front-desk check-in kiosk: tap-to-start attract screen, code or name search on a big keypad, confirm card, badge print with progress, and a 10s auto-reset."
platform: tablet
type: screen
category: utility
tags: [kiosk, check-in, keypad, tablet, reception]
styles: [industrial, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#DDDBD6", "#EBEAE6", "#F5F4F1", "#111111", "#1D7039"]
fonts: ["Barlow Condensed", "Barlow"]
related: [otp-code, multi-step-form-stepper, order-confirmed]
---

# Tablet kiosk check-in

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A self check-in kiosk for the front desk of "Millyard", a co-working building. It runs on a landscape tablet fixed to a stand. A visitor walks up, taps a big black panel, finds their booking with a 6-digit code or their name, confirms the details, watches a badge print, and leaves. The screen then resets itself so the next person never sees the last person's name. The look is industrial and calm: concrete grey, black, one green, large condensed type, and 4px corners. The detail worth copying is that every exit is timed and visible: a 10 second countdown with a draining bar on the done screen, and a "Still there?" warning before an idle reset.

## Reference behaviour

1. First frame is the attract screen. Left: a label "Welcome to Millyard", the current time at 230px, the date "Saturday 3 October", a members note, and two facts at the bottom ("Open today 07:30 – 20:00", "Visitors expected 14 today"). Right: a full-height black button reading "Tap to check in" at 120px, with a 112px green arrow square in its bottom-right corner.
2. The header shows the wordmark "Millyard" and "Reception · Floor 2". On the attract screen the header clock is hidden because the big clock is on the page. The step rail is hidden but keeps its space.
3. The green arrow nudges 10px right once every 2.4s. Nothing else moves on the attract screen.
4. Tap the black panel. The find screen enters: opacity 0 → 1 and 12px up → 0 over 320ms. The header now shows the step rail "01 Find / 02 Confirm / 03 Badge" with Find current, a "Start over" button, and the clock.
5. Find screen, code mode (default). Left: "Step 1 of 3", the heading "Find your booking", a two-part toggle "Booking code | Name", six digit slots split 3 + 3 by a short dash, a help line, and an error line. Right: a 3 × 4 keypad: 1–9, "Clear", 0, and a delete key.
6. Each key press fills the next slot. The current empty slot has a black border and a 6px green bar inside its bottom edge. Physical keys 0–9 and Backspace also work.
7. When the sixth digit lands, look the code up. If it matches, wait 260ms and go to the confirm screen. If not, wait 200ms, shake the slots (±8px over 360ms), turn the slot borders red, and show "No booking matches 123 456. Check the email or search by name." After 900ms clear the slots. The message stays until the next key press.
8. Ignore key presses after the sixth digit until the slots clear.
9. Tap "Name". The keypad becomes an A–Z grid of 7 columns plus "Space" and delete. The left side shows a 96px text field with a green blinking caret and the hint "Type your first or last name".
10. With fewer than 2 letters the results area says "Type 2 letters to see today's bookings." With 2 or more letters, list every booking where any word of the name starts with the typed text. Typing "Mi" shows "Mira Okonkwo" and "Mirela Ivanova". No match shows "No booking today under "Xy". Ask at the desk."
11. Switching between Code and Name clears what was typed in both.
12. Tap a result. Go to the confirm screen with that booking.
13. Confirm screen: a card on the left with "Step 2 of 3 · Is this you?", the name at 84px, four rows (Host, Where, When, Badge), and "Booking 418 207" at the bottom of the card. On the right: a short note, a 120px green button "Yes, print badge", and an 80px outlined button "Not me, search again".
14. "Not me" returns to a fresh find screen.
15. "Yes, print badge" goes to the print screen. A badge slides down out of a black printer slot over 3000ms. The progress bar runs 0% → 8% (0ms) → 30% (600ms) → 62% (1500ms) → 88% (2400ms) → 100% (3200ms). A four-step list ticks along: "Sending to printer", "Printing", "Telling your host", "Take your badge from the slot". At 3600ms all four are ticked. At 4200ms go to the done screen.
16. Done screen: a 96px green tick square, "You're in, Mira." at 120px, and "Daniel Reyes knows you are here. Take the lift to Floor 2. Studio B is on your left." On the right: "This screen resets in", a number counting 10 → 0 once per second at 140px, a 12px bar that drains from full to empty over 10s, and a 120px black "Done" button.
17. At 0, or on "Done", return to the attract screen. The step rail marks all three steps green on the done screen. "Start over" is hidden on done.
18. "Start over" in the header returns to the attract screen from find, confirm, or print.
19. Inactivity: on find and confirm, any 30s without a touch or key opens a "Still there?" dialog. It counts 10 → 0. "I'm still here" closes it and restarts the 30s. At 0 return to attract. Attract, print, and done never show the dialog (print is busy, done has its own countdown).
20. The header clock and the big clock show the real time, updated every 15s.

## Structure

```
1180 × 820
┌──────────────────────────────────────────────────────────────────────┐
│ MILLYARD Reception · Floor 2  [01 FIND] 02 CONFIRM 03 BADGE  [START OVER] 10:42 │ 80px, 2px bottom rule
├──────────────────────────────────────────────────────────────────────┤
│ padding 40px                                                         │
│ ATTRACT   minmax(0,1fr) | minmax(0,1.1fr), gap 40                    │
│  WELCOME TO MILLYARD        ┌──────────────────────────────┐       │
│  10:42            230px       │ VISITORS AND DAY PASSES      │       │
│  Saturday 3 October  40px     │ TAP TO                120px │       │
│  [card] Members: hold...      │ CHECK IN                     │       │
│  ───────────────── 2px        │ Have your booking...  [ → ]  │ 112px │
│  OPEN TODAY   VISITORS        └──────────────────────────────┘       │
│                                                                      │
│ FIND      minmax(0,1fr) | 520px, gap 48                              │
│  STEP 1 OF 3                  ┌────┬────┬────┐                       │
│  Find your booking  72px      │ 1  │ 2  │ 3  │  keys 88px tall       │
│  [BOOKING CODE|NAME] 420×64   │ 4  │ 5  │ 6  │  gap 12               │
│  [4][1][8] — [ ][ ][ ] 72×96  │ 7  │ 8  │ 9  │                       │
│  help 19px                    │CLR │ 0  │ ⌫  │                       │
│  error 22px red               └────┴────┴────┘                       │
│                                                                      │
│ CONFIRM   minmax(0,1fr) | 420px, gap 48                              │
│  ┌ card, full height ───────┐      note                              │
│  │ Mira Okonkwo  84px       │      [ YES, PRINT BADGE ] 120px green  │
│  │ HOST / WHERE / WHEN / BADGE│    [ NOT ME, SEARCH AGAIN ] 80px     │
│  │ BOOKING 418 207          │                                        │
│  └──────────────────────────┘                                        │
│                                                                      │
│ PRINT     420px | minmax(0,1fr), gap 64                              │
│ DONE      minmax(0,1fr) | 420px, gap 48                              │
└──────────────────────────────────────────────────────────────────────┘
```

- `header`: a 3-column grid `minmax(0,1fr) auto minmax(0,1fr)`. Brand left, `<ol aria-label="Check-in steps">` centre, Start over + clock right.
- `main`: holds five `<section class="scr">`, absolutely stacked. Only one has `.on` and `display: grid`.
- Attract: a `div` with the clock and a `<dl>` of facts, plus one `<button>` that is the whole black panel.
- Find: the code and name layouts are two siblings toggled with `hidden`. The keypad is a `<div role="group" aria-label="Keypad">` of `<button>`s rebuilt when the mode changes.
- Confirm: a `div.card` with an `h2` and a `<dl>`. Two buttons in a flex column pinned to the bottom.
- Print: a decorative printer and badge (`aria-hidden`), then a `role="progressbar"` and an `<ol>` of steps.
- Done: an `h1`, a lead paragraph, a countdown block, and the Done button.
- Idle dialog: a fixed `role="alertdialog"` over a 55% black scrim.
- One visually hidden `aria-live="polite"` paragraph for announcements.

Sample bookings:

| Code | Name | Host | Where | When | Badge |
| --- | --- | --- | --- | --- | --- |
| 418 207 | Mira Okonkwo | Daniel Reyes, Lumen Studio | Studio B, Floor 2 | Today, 11:00 – 12:30 | Visitor, escorted |
| 556 120 | Mirela Ivanova | Ana Torres, Fieldnote Press | Bench desk 14, Floor 2 | Today, all day | Day pass |
| 902 314 | Tomas Lindqvist | Priya Shah, Northbound Legal | Room 2.04, Floor 2 | Today, 11:30 – 12:00 | Visitor, escorted |

## Tokens

```css
:root {
  /* concrete neutrals */
  --bg: #dddbd6;        /* page, with a 1px rule every 40px */
  --panel: #ebeae6;     /* header */
  --raise: #f5f4f1;     /* keys, slots, cards */
  --line: #c4c1ba;      /* hairlines, page rules */
  --line-2: #a9a59d;    /* empty slot border, secondary key border */
  --ink: #111111;       /* text, borders, black panel */
  --ink-2: #3d3b37;     /* body copy */
  --ink-3: #5f5c56;     /* labels */

  /* the one accent */
  --go: #1d7039;        /* primary action, caret, progress, ticks */
  --go-ink: #ffffff;
  --go-tint: #d3e4d6;   /* pressed result row */
  --err: #a3271c;       /* wrong code only */

  /* type */
  --cond: "Barlow Condensed", "Arial Narrow", sans-serif;
  --sans: "Barlow", system-ui, sans-serif;

  /* shape and size */
  --r: 4px;
  --key: 88px;          /* numeric key height; never below 64px */
  --header: 80px;
  --pad: 40px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --out: cubic-bezier(.16, 1, .3, 1);
  --t-enter: 320ms;
  --t-key: 120ms;
  --t-print: 3000ms;
  --t-reset: 10s;
  --t-idle: 30s;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Big clock | Barlow Condensed | 230px | 600 | 0.82 | −0.03em | numerals, tabular |
| Tap panel | Barlow Condensed | 120px | 700 | 0.86 | −0.02em | upper |
| Done heading | Barlow Condensed | 120px | 700 | 0.95 | −0.01em | sentence |
| Countdown | Barlow Condensed | 140px | 600 | 0.9 | 0 | numerals, tabular |
| Confirm name | Barlow Condensed | 84px | 700 | 0.95 | −0.01em | sentence |
| Screen heading | Barlow Condensed | 72px | 700 | 0.95 | −0.01em | sentence |
| Digit slot | Barlow Condensed | 64px | 600 | 1 | 0 | numerals |
| Keypad digit | Barlow Condensed | 44px | 600 | 1 | 0 | numerals |
| Primary button | Barlow Condensed | 40–44px | 700 | 1 | 0.02em | upper |
| Detail value | Barlow Condensed | 30px | 600 | 1.1 | 0 | sentence |
| Letter key | Barlow Condensed | 30px | 600 | 1 | 0 | upper |
| Header clock | Barlow Condensed | 30px | 600 | 1 | 0.02em | numerals |
| Wordmark | Barlow Condensed | 28px | 700 | 1 | 0.06em | upper |
| Segment / steps | Barlow Condensed | 15–20px | 600 | 1 | 0.1–0.12em | upper |
| Label | Barlow Condensed | 15px | 600 | 1 | 0.16em | upper |
| Body / help | Barlow | 19px | 400 | 1.4 | 0 | sentence |
| Header sub | Barlow | 15px | 500 | 1 | 0 | sentence |

Everything a visitor must read from one metre away is 19px or larger. Labels are the only small type.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Screen | becomes current | opacity, translateY | 0, 12px → 1, 0 | 320ms | `--out` | instant |
| Arrow square | attract, loop | translateX | 0 → 10px → 0 (at 70–100%) | 2.4s | `--ease` | still |
| Key | press | background, scale | raise → ink, 1 → 0.97 | 120ms | `--ease` | colour only |
| Slots | wrong code | translateX | 0, −8, 8, −4, 0 | 360ms | `--ease` | red border only |
| Caret | name field | opacity | 1 ↔ 0 | 1s | steps(1) | solid |
| Badge | print starts | translateY | −100% → 0 | 3000ms | `--ease` | shown in place |
| Progress fill | each step | width | prev → next % | 300ms | `--ease` | instant |
| Reset bar | done | scaleX | 1 → 0 | 10s | linear | steps once per second |

The progress percentages are data, so the timeline stays the same with reduced motion. Only the slide and the easing go.

## States

- Key resting: `--raise` fill, 2px `--ink` border, 4px radius.
- Key pressed: `--ink` fill, `--raise` text, scale 0.97.
- Secondary key (Clear, Space, delete): transparent fill, 2px `--line-2` border, caps label.
- Slot empty: 2px `--line-2` border. Slot filled: 2px `--ink`. Slot current: 2px `--ink` plus `inset 0 -6px 0 var(--go)`.
- Slot error: all six borders `--err`, message in `--err`, shake once.
- Segment selected: `--ink` fill, `--raise` text, `aria-pressed="true"`.
- Step rail: current step has a 1px ink border and `--raise` fill. Done steps are `--go` text. Future steps are `--ink-3`.
- Result row pressed: `--go-tint` fill.
- Primary button pressed: `#17602f`.
- Focus-visible: 4px `--go` outline, 3px offset, on every control.
- Empty search: help text. No match: red line with "Ask at the desk."
- Busy: print screen has no buttons except Start over.
- Disabled: not used. Hide what can't be used instead of greying it.

## Accessibility

- Every control is a `<button>`. The black panel is one button, so its whole area is the target.
- Hit targets: keypad keys 88px tall and about 165px wide; letter keys 72px tall and about 67px wide; Start over 64px tall; primary actions 120px; secondary 80px. Never go below 64px.
- The step rail is an `<ol>`. The current step has `aria-current="step"`.
- The segment buttons use `aria-pressed`. The keypad group is labelled "Keypad". The delete key is labelled "Delete".
- Digit slots are `aria-hidden`. A hidden polite region says "3 of 6 digits entered". The error line is `role="alert"`.
- Name results sit in a polite list labelled "Matching bookings".
- On each screen change, move focus to the new screen's heading (`tabindex="-1"`), or to the tap panel on attract.
- The live region says "Printing your badge", then "Checked in. Daniel Reyes has been told. This screen resets in 10 seconds.", then "Resetting in 3 seconds".
- The idle dialog is `role="alertdialog"` with `aria-modal`. Focus goes to "I'm still here".
- Keyboard: digits and Backspace in code mode, letters and Backspace in name mode, Tab through everything.
- Contrast: `--ink` on `--bg` 15:1. `--ink-3` on `--bg` 4.7:1. `--go` on `--panel` 5.1:1. White on `--go` 6:1. `--err` on `--bg` 5.3:1.
- Never show a name on the attract screen. The reset exists for privacy.

## Responsive rules

- Built for 1180 × 820 landscape. Keep it there. A kiosk is one fixed device.
- At ±20% (944–1416 wide) keep the grids. The left column is `minmax(0,1fr)`, so it shrinks first. Scale the big clock with `clamp(160px, 19.5vw, 260px)`.
- Below 1000 wide, set the keypad column to 440px and keys to 80px tall.
- Portrait (820 × 1180): stack each screen. Text on top, keypad or actions at the bottom within thumb reach. The tap panel becomes the bottom 55% of the screen.
- Phone width is out of scope. A phone check-in is a form, not a kiosk.
- Lock the page: `overflow: hidden` on `body`. Nothing scrolls on a kiosk.

## Acceptance checklist

### Always

- [ ] The first frame is an attract screen with the time and one big start button. No personal data on it.
- [ ] Three steps in a visible rail: find, confirm, print. The current step has `aria-current="step"`.
- [ ] Two ways to find a booking: a 6-digit code and a name search. Both have on-screen keys.
- [ ] Every touch target is 64px or larger.
- [ ] A wrong code shows a red message, shakes once, and clears after 900ms.
- [ ] The print step shows a real progress bar with `aria-valuenow` and a step list.
- [ ] The done screen counts down 10 seconds with a visible number and bar, and has a Done button.
- [ ] 30s idle on find or confirm shows a "Still there?" dialog with its own 10s count, then resets.
- [ ] A Start over control is always visible during the flow.
- [ ] Focus rings are visible on every control. Reduced motion keeps every state.
- [ ] One accent colour. Red only for errors.

### This demo

- [ ] Brand "Millyard", sub "Reception · Floor 2".
- [ ] Code 418 207 finds Mira Okonkwo, host Daniel Reyes, Studio B, Floor 2.
- [ ] Typing "Mi" in name mode lists Mira Okonkwo and Mirela Ivanova.
- [ ] Big clock 230px, tap panel text 120px, keypad keys 88px tall.
- [ ] Background `#dddbd6` with a `#c4c1ba` rule every 40px. Accent `#1d7039`.
- [ ] Print reaches 100% at 3200ms and the done screen appears at 4200ms.
- [ ] Done text reads "You're in, Mira." and the countdown starts at 10.

## Implementation notes

**One timer bag per screen.** Every screen starts timeouts. Kill them all on each screen change, or an old countdown will reset the next visitor.

```js
let timers = [], countdown;
const clearAll = () => { timers.forEach(clearTimeout); timers = []; clearInterval(countdown); };
function show(id) {
  clearAll();
  document.querySelectorAll('.scr').forEach(s => s.classList.toggle('on', s.id === id));
  if (id === 'print') runPrint();
  if (id === 'done') runDone();
  armIdle();
}
```

**Idle reset that skips busy screens.** Re-arm on `pointerdown` in the capture phase so taps on any child count.

```js
function armIdle() {
  clearTimeout(idleT); clearTimeout(warnT); dialog.classList.remove('on');
  if (['attract', 'print', 'done'].includes(current)) return;
  idleT = setTimeout(() => {
    dialog.classList.add('on'); stay.focus(); let n = 10;
    const step = () => { n--; count.textContent = n;
      n <= 0 ? show('attract') : (warnT = setTimeout(step, 1000)); };
    warnT = setTimeout(step, 1000);
  }, 30000);
}
document.addEventListener('pointerdown', () => { if (!dialog.classList.contains('on')) armIdle(); }, true);
```

**Draining bar with CSS, number with JS.** Restart the animation by removing the class, forcing a reflow, and adding it back.

```css
.drain i { display: block; height: 100%; background: var(--ink); transform-origin: left; }
.run .drain i { animation: drain 10s linear forwards; }
@keyframes drain { to { transform: scaleX(0); } }
```

**The current slot mark** is an inset shadow, so the slot does not change size:

```css
.slot { height: 96px; border: 2px solid var(--line-2); border-radius: 4px; }
.slot.cur { border-color: var(--ink); box-shadow: inset 0 -6px 0 var(--go); }
```

Common mistakes:

- Keys at 44px because that is the phone rule. A kiosk is used standing, often with gloves or a coat on. Use 64px minimum.
- A system keyboard popping up over the layout. Use on-screen keys and `inputmode="none"` if you use a real input.
- Leaving the last visitor's name on screen. Reset after done, after idle, and after Start over.
- A countdown that is only a number, or only a bar. Show both.
- Rounded pill buttons. This family is 4px corners.
- A second accent for "success". Green is already the action colour. Use it for the tick too.
- Letting the idle dialog appear mid-print.
- Shaking the slots and clearing them at the same moment. Clear after 900ms so the visitor sees what they typed.

Rebuild order:

1. Header grid and the five stacked screens with a `show(id)` switch.
2. Attract screen with the live clock.
3. Code keypad and slots, then the name grid and search.
4. Confirm card.
5. Print timeline and the badge slide.
6. Done countdown.
7. Idle dialog and Start over.
8. Focus moves, live region, reduced motion.
