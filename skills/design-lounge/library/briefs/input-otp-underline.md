<!-- Design Lounge Nº 424 · "Underline OTP input" · designlounge.vercel.app -->

# Underline OTP input

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is the underline variant. For boxed cells use `otp-code`; do not mix the two on one screen.

## What it is

The second sign-in step of Quaystone Private, a private bank. Six digits sit on six hairline underlines with no boxes, set in a 54px high-contrast serif, on deep bottle green framed by a thin inset rule with corner captions like a letterhead. Typing moves forward, Backspace moves back, pasting "482 916" fills all six. A full code is checked automatically: a wrong one turns the underlines and digits coral and shakes the row; the right one turns everything gold and lifts the digits one after another. A resend countdown ticks under the row and becomes a link at zero. The detail worth copying is the underline itself: a faint resting line, a cream line once filled, and a 3px gold line that grows from the centre on the focused cell.

## Reference behaviour

1. First frame: digits 4 and 8 are already in cells 1 and 2. Cell 3 is focused: gold underline, blinking gold caret. Cells 4–6 are empty with faint lines. A short dash separates the two groups of three. "Resend code in 0:30" starts counting down. A hint line shows "Demo code 482916".
2. Typing a digit fills the current cell and moves focus to the next. Non-digits are blocked. Typing into a filled cell replaces it (the cell selects its contents on focus).
3. Backspace clears the current cell; on an empty cell it clears the previous one and moves there. Delete clears in place. Left and Right arrows move between cells; Home and End jump to the ends.
4. Pasting anywhere in the row strips non-digits. Six digits fill from cell 1; fewer fill from the current cell. Focus lands on the last filled cell.
5. When all six are filled, the row enters "checking": the six resting lines pulse gold in a wave (80ms stagger) and the message says "Checking code…" for 700ms. Input is locked while checking.
6. Wrong code: underlines and digits turn coral, the row shakes (420ms, ±10px decaying), the message reads "That code doesn't match. 2 attempts left." with an alert icon. After 520ms the cells clear and focus returns to cell 1. Typing again clears the coral.
7. After three wrong codes the message reads "Too many tries. We sent you a fresh code.", a new code is issued (shown in the hint) and the countdown restarts.
8. Right code (482916): underlines turn gold, digits turn gold and lift 8px one after another (60ms stagger), a check draws itself, and the message reads "Verified. Opening your accounts…". The countdown is replaced by "Code accepted". The cells become read-only. "Start again" appears and takes focus.
9. Countdown: once per second, "Resend code in 0:29" … "0:01". At zero it becomes an underlined "Resend code" button. Pressing it issues a new code, restarts at 0:30, clears the cells and says "New code sent to +351 ••• ••• 417."
10. "Call me instead" says "Calling +351 ••• ••• 417 now. The voice will read six digits twice."
11. Reduced motion: no shake, no lift, no wave (lines go solid gold while checking), the caret is solid, the check appears drawn.

## Structure

```
1280 x 800
+--[QUAYSTONE PRIVATE]--------------------------------------[SECURE SIGN-IN]--+  inset 24, 1px rule
|                                                                             |
|                    —— STEP 2 OF 2                (12px, gold)               |
|                    Enter the code we sent        (40px serif)               |
|                    to your phone                                            |
|                    Six digits, sent by text to +351 ••• ••• 417 ...         |
|                                                                             |
|                     4     8     |           (54px serif digits)            |
|                    ───   ───   ━━━  -  ───   ───   ───   64 x 88 cells     |
|                    (!) That code doesn't match. 2 attempts left.            |
|                    ───────────────────────────────────────────── 1px       |
|                    Resend code in 0:29                 Call me instead      |
|                    Demo code 482916                                         |
|                                                                             |
+--[SESSION 7F-22A · LISBON]---------------------------[DESK +351 210 000 418]-+
panel: 520px max, centred
```

- `body` is a grid that centres one `main.panel`. A fixed `div.frame` draws the inset rule; four fixed `span.corner` captions sit on it with page-coloured backgrounds that cut the line. All five are `aria-hidden`.
- The code is a `form > fieldset` with a visually hidden `legend` "Verification code, 6 digits", containing `div.otp` with six `div.cell` and one `span.sep` after the third.
- Each cell holds one `input` (`inputmode="numeric"`, `maxlength="1"`, `aria-label="Digit n of 6"`; the first has `autocomplete="one-time-code"`) and a `span.blink` caret.
- The message is `p role="status" aria-live="polite"` under the row.
- A footer row: countdown `span` (later holding the Resend `button`) and "Call me instead" `button`. Under it, the demo hint and the "Start again" button.

## Tokens

```css
:root {
  --bg: #0e2622;          /* bottle green */
  --bg-2: #123029;        /* top of the radial wash */
  --line: #2a4a42;        /* frame and divider */
  --ink: #f2ebdd;         /* cream digits and headline */
  --ink-2: #c3c0b2;       /* body copy, filled underline */
  --ink-3: #93a198;       /* captions, countdown */
  --rest: rgba(242,235,221,.22);  /* empty underline */
  --gold: #d9b26f;        /* focus line, caret, success, eyebrow */
  --err: #f08a6c;         /* wrong code */
  --focus: #d9b26f;

  --serif: "Prata", Georgia, serif;
  --sans: "Albert Sans", system-ui, sans-serif;

  --cell-w: 64px;
  --cell-h: 88px;
  --cell-gap: 16px;
  --line-rest: 2px;
  --line-focus: 3px;
  --frame-inset: 24px;

  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --t-grow: 280ms;
  --t-shake: 420ms;
  --t-check: 700ms;
  --resend: 30s;
}
```

Page background: `radial-gradient(120% 90% at 50% 0%, var(--bg-2), var(--bg) 70%)`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Digits | Prata | 54px | 400 | 1 | 0 | Numerals |
| Headline | Prata | 40px | 400 | 1.12 | -0.01em | Sentence |
| Eyebrow | Albert Sans | 12px | 400 | 1 | 0.14em | Upper, 24px gold rule before |
| Body | Albert Sans | 15px | 400 | 1.5 | 0 | Sentence; masked number 500 weight, 0.04em |
| Message | Albert Sans | 14px | 400 | 1.5 | 0 | Sentence |
| Countdown, links | Albert Sans | 14px | 400 | 1.5 | 0 | tabular-nums |
| Corner captions | Albert Sans | 11px | 400 | 1 | 0.14em | Upper |
| Demo hint code | Prata | 14px | 400 | 1 | 0.18em | Numerals |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing / delay | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Focus line | cell focus | scaleX of a 3px gold `::after` | 0 → 1 (from centre) | 280ms | `--ease-out` | instant |
| Rest line | fill / clear | background | `--rest` ↔ `--ink-2` | 200ms | `--ease` | instant |
| Caret | empty focused cell | opacity | 1 ↔ 0 | 1s | `steps(1)` | solid |
| Checking wave | 6 digits in | rest line background | `--rest` → gold → `--rest` | 900ms loop | `--ease`, 80ms × index | solid gold |
| Shake | wrong code | translateX | 0 → -10 → 8 → -6 → 3 → 0 | 420ms | `--ease` | none |
| Lift | right code | translateY of digits | 0 → -8px → 0 | 500ms | `--ease-out`, 60ms × index | none |
| Check | right code | stroke-dashoffset | 24 → 0 | 500ms | `--ease-out`, 150ms delay | drawn |

## States

- Empty cell: 2px line at `--rest`.
- Filled cell: line `--ink-2`, digit `--ink`.
- Focused cell: 3px gold line grown from centre; blinking caret if empty, digit selected if filled.
- Checking: wave of gold along the lines, message "Checking code…", keys blocked except Tab.
- Error: lines and digits `--err`, alert icon + message in `--err`, shake. Clears as soon as the person types or pastes.
- Success: lines and digits `--gold`, lift, check icon + gold message, inputs read-only, "Start again" visible.
- Countdown: muted `--ink-3`. At zero: "Resend code" in `--ink` with a gold underline offset 5px; hover turns it gold.
- Focus-visible on buttons: 2px gold outline, offset 4px. Inputs use the gold underline as their focus indicator (no box).

## Accessibility

- Six real inputs, each labelled "Digit n of 6", inside a fieldset with a legend. The first input has `autocomplete="one-time-code"` so SMS autofill works on phones.
- `inputmode="numeric"` and `pattern="[0-9]*"` bring up the number pad.
- The message is a polite status region: checking, error with attempts left, success, resend and call notices are read once each.
- Error is never colour only: there is an icon and a sentence with the attempts left.
- After an error, focus moves to cell 1. After success, focus moves to "Start again".
- Keys: digits type and advance; Backspace, Delete, Left, Right, Home, End as described; Tab leaves the row.
- Contrast: cream `#F2EBDD` on `#0E2622` about 14:1; muted `#93A198` about 6:1; gold about 8.6:1; coral about 7:1.
- Buttons in the footer are at least 40px tall.

## Responsive rules

- ≥1024: panel 520px centred, cells 64 × 88, digits 54px, frame inset 24px with four corner captions.
- 768: unchanged; the panel stays centred.
- <640: cells 40 × 60, gap 8px, digits 34px, separator 6px; headline 30px; frame inset 12px and only the top-left caption remains; footer row stacks.
- At 375px all six cells and the separator fit in one row with no sideways scroll.

## Acceptance checklist

### Always

- [ ] Six single-digit inputs on underlines, no boxes, split 3 + 3 by a short dash.
- [ ] Typing advances, Backspace goes back, arrows/Home/End move, non-digits are blocked.
- [ ] Paste strips non-digits and fills all six from cell 1.
- [ ] A full code checks itself with a visible checking state; inputs lock meanwhile.
- [ ] Wrong code: coral + shake + message with attempts left; cells clear and focus returns to cell 1.
- [ ] Right code: gold + staggered lift + drawn check; inputs read-only.
- [ ] Resend countdown from 0:30 that turns into a button at zero and restarts when pressed.
- [ ] The focused cell's line grows from the centre, 3px.
- [ ] First input carries `autocomplete="one-time-code"`.
- [ ] Reduced motion removes shake, lift, wave and caret blink.

### This demo

- [ ] Brand "Quaystone Private", headline "Enter the code we sent to your phone".
- [ ] Code 482916, masked number "+351 ••• ••• 417", three attempts.
- [ ] First frame shows 4 and 8 typed and cell 3 focused.
- [ ] Bottle green `#0E2622`, cream `#F2EBDD`, gold `#D9B26F`, coral `#F08A6C`.

## Implementation notes

**1. The underline is two pseudo-elements.** `::before` is the resting line that changes colour; `::after` is the gold focus line that scales from the centre.

```css
.cell { position: relative; width: var(--cell-w); height: var(--cell-h); }
.cell::before, .cell::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 2px; }
.cell::before { background: var(--rest); transition: background .2s var(--ease); }
.cell::after { height: 3px; background: var(--gold); transform: scaleX(0);
  transition: transform .28s var(--ease-out); }
.cell.filled::before { background: var(--ink-2); }
.cell:focus-within::after { transform: scaleX(1); }
.otp.error .cell::before, .otp.error .cell::after { background: var(--err); }
```

**2. One input handler covers typing, autofill and IME.** Read the value, clear the cell, then distribute digits from this index. That way SMS autofill dropping "482916" into cell 1 fills the whole row.

```js
inp.addEventListener('input', () => {
  const d = inp.value.replace(/\D/g, ''); inp.value = '';
  if (d) fillFrom(i, d); else sync();
});
function fillFrom(start, digits) {
  let i = start;
  for (const d of digits) { if (i >= N) break; ins[i++].value = d; }
  sync(); ins[Math.min(i, N - 1)].focus();
  if (ins.every(x => x.value)) check();
}
```

**3. Restart the shake.** Remove the class, force a reflow, add it back; otherwise a second wrong code does not shake.

```js
otp.classList.remove('shake'); void otp.offsetWidth; otp.classList.add('shake');
```

Common mistakes:

- One hidden input with six fake boxes drawn over it. Here each digit is a real, labelled input.
- Boxes with borders. This variant is underlines only.
- Native caret visible beside the custom one. Set `caret-color: transparent` and draw the 2px gold caret.
- Checking on a button press. A complete code checks itself.
- Keeping the wrong digits after the shake. Clear them so the person can retype.
- A countdown that keeps running after success.
- Using red `#FF0000`. Coral on green keeps the luxe tone and still reads as an error with the icon.

Rebuild order:

1. Tokens, frame, corner captions, centred panel and copy.
2. Six cells with the two-line underline and the custom caret.
3. Input, keydown and paste handlers.
4. Check, error and success states with the status message.
5. Countdown and resend; call-me action.
6. Reduced motion, then the 640px rules.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
