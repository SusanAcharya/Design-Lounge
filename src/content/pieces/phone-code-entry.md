---
title: "Chitthi code entry"
summary: "Six digit boxes for a masked Nepal mobile. Paste fills them, a wrong code shakes, and Resend waits 30 seconds."
platform: mobile-app
type: screen
category: auth
tags: [auth, otp, phone, ios]
styles: [editorial, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-04
palette: ["#E6E8EF", "#F4F6FA", "#172033", "#9E2B22"]
fonts: ["Vollkorn", "Inconsolata"]
related: [phone-forgot-password, phone-sign-in]
---

# Chitthi code entry

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is an iOS-style phone screen: a clear nav bar, a large title, 44px targets, and a swipe that can still go back because the page does not steal horizontal drags.

## What it is

The one-time code screen of Chitthi, a fictional letter desk on New Road in Kathmandu. A code was just sent to a Nepal mobile, shown masked. Six boxes take one digit each. Typing advances. A paste fills the row. Only `482913` is accepted in this demo. Anything else shakes the row, prints the error under it, and clears the digits so the person can type again. Resend is already waiting when the screen appears, because the message was sent before this frame. The look is postal: cool grey ground, navy ink, a vermilion desk mark, Vollkorn for the title, Inconsolata for the digits.

## Reference behaviour

1. First frame. Title "Enter the code". Dek "Sent to +977 98****418", with the number in Inconsolata. Six boxes are empty. The first box is focused and shows a vermilion 3px foot. Resend reads "Resend in 30s" and `aria-disabled="true"`. No error is visible. The success card is hidden.
2. The countdown starts on load, not after an error. It steps once a second from 30 to 0. At 0 the label is "Resend code", `aria-disabled` is false, and the status region says "You can resend the code."
3. A press while seconds remain does not send. Status says "Wait N seconds to resend."
4. A press at 0 sets status to "Code sent again." and restarts 30 seconds. Digits already typed stay as they are.
5. Typing a digit writes that digit, strips anything else, and moves focus to the next box. A non-digit key does not enter.
6. Backspace on an empty box clears the previous box and moves focus there. Arrow Left and Arrow Right move focus without changing values.
7. Paste anywhere in the row. Take the clipboard text, keep digits only, fill from box 1 up to six, and focus the last filled box. `482 913` and `48a2913` both become `482913`.
8. When six digits equal `482913`, the row gains an ok foot in `#1d6a42`. Inputs disable. The title becomes "Desk open". A card shows "Mina Gurung" and "Signed in at the New Road desk." Resend hides. "Enter again" appears. Status says "Code accepted. The desk is open." Focus moves to the title.
9. When six digits are anything else, the row shakes for 420ms (translateX 0, -8px, 8px, -5px, 4px, 0) and gains the error stroke. The alert reads "That code does not match. Try again." Each box gets `aria-invalid="true"`.
10. After 420ms the six values clear, focus returns to box 1, and the shake class leaves. The error text stays until the next digit or paste.
11. The next digit or paste clears the error and `aria-invalid` before writing.
12. "Enter again" restores the first frame's copy and empty boxes, focuses box 1, and shows Resend again. It does not reset the countdown unless a resend press does.
13. Reduced motion: the shake animation lasts 1ms. The digits still clear after 420ms. The error still appears.

## Structure

```
390 x 844
padding inline 16px, top safe 54px, bottom safe 34px
+--------------------------------------+
| Chitthi                    [.] DESK 04|  nav, 1px line under, 10px pad below
| Enter the code                       |  34px Vollkorn
| Sent to +977 98****418               |  17px, number in Inconsolata
| [ ] [ ] [ ] [ ] [ ] [ ]              |  6 columns, gap 8px, min-height 56px
| That code does not match. Try again. |  alert, hidden until a miss
| Resend in 30s                        |  44px text button, left
|                                      |
| Do not share this code.              |  foot, Inconsolata 13px, pinned low
+--------------------------------------+

Success, same screen:
| Desk open                            |
| Sent to +977 98****418               |
| [4] [8] [2] [9] [1] [3]              |  ok foot, inputs disabled
| +----------------------------------+ |
| | Mina Gurung                      | |
| | Signed in at the New Road desk.  | |
| +----------------------------------+ |
| Enter again                          |
```

- The nav brand and the desk label are paragraphs, margin 0. The vermilion swatch is an 8px square, `aria-hidden`.
- The six inputs sit in `role="group"`, labelled by the `h1`, described by the error.
- Boxes are `inputmode="numeric"`, `maxlength="1"`, `pattern="[0-9]*"`. Only the first has `autocomplete="one-time-code"` and `autofocus`.
- Each box has an accessible name "Digit 1" through "Digit 6".
- The error is `role="alert"`. While it has no text it is `display: none`.
- The success card and "Enter again" use the `hidden` attribute until the code matches.
- A visually hidden `role="status"` speaks resend and success. It does not speak each second.
- `main` is a column with `flex: 1`. The foot uses `margin-top: auto` so it sits on the bottom safe area while the boxes stay under the title.

## Tokens

```css
:root {
  --bg: #e6e8ef;
  --surface: #f4f6fa;
  --ink: #172033;
  --ink-2: #3c4760;
  --ink-3: #515a70;
  --line: #cfd4e0;
  --accent: #9e2b22;
  --ok: #1d6a42;
  --error: #9e2b22;
  --focus: #172033;
  --serif: "Vollkorn", Georgia, serif;
  --mono: "Inconsolata", ui-monospace, monospace;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --fast: 160ms;
  --mid: 240ms;
  --shake: 420ms;
  --radius: 10px;
}
```

The vermilion is the desk mark, the focused foot, the error, and the ready Resend label. It is not a full-width button fill. Success uses `--ok`, not vermilion.

## Typography

| Role | Family | Size | Weight | Line height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Vollkorn | 21.6px | 600 | 1 | -0.02em | sentence |
| Desk label | Inconsolata | 12px | 600 | 1 | 0.12em | upper |
| Large title | Vollkorn | 34px | 600 | 1.12 | -0.02em | sentence |
| Dek | Vollkorn | 17px | 400 | 1.4 | 0 | sentence |
| Masked number | Inconsolata | 16px | 600 | 1 | 0.02em | as written |
| Digit | Inconsolata | 28px | 600 | 1 | 0 | numeric |
| Error | Vollkorn | 15px | 600 | 1.35 | 0 | sentence |
| Resend, Enter again | Inconsolata | 16px | 600 | 1 | 0 | sentence |
| Card name | Vollkorn | 18px | 600 | 1.3 | 0 | sentence |
| Card meta, foot | Vollkorn meta 15px, Inconsolata foot 13px | 400 | 1.4 | 0 | sentence |

Digits are tabular in the sense that Inconsolata is a mono. Set `font-variant-numeric: tabular-nums` on Resend so 30 and 9 do not jog the line. Do not set the digits in Vollkorn.

## Motion

| Thing | Trigger | Property | From | To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Wrong code | six wrong digits | translateX | 0 | -8, 8, -5, 4, 0 | 420ms | cubic-bezier(0.2, 0.7, 0.2, 1) | 1ms, digits still clear at 420ms |
| Resend | each second | text | "Resend in 30s" | "Resend code" | 1000ms step | none | countdown still runs |

The shake keyframes are 0% and 100% at 0, 20% at -8px, 40% at 8px, 60% at -5px, 80% at 4px. Remove the shake class on `animationend` so a second miss can replay it. Force reflow (`offsetWidth`) before adding the class again.

## States

- Box empty: 1.5px navy border, radius 10px, surface fill, min-height 56px.
- Box focused, and the first box before anyone tabs: vermilion border and `box-shadow: inset 0 -3px 0 var(--accent)`. No second outline, so the box does not look double. Buttons keep the 2px navy outline.
- Box filled: the digit is ink, 28px, weight 600.
- Row wrong: every border `--error`, no foot shadow, alert under the row.
- Row accepted: every border `--ok`, foot `--ok`, inputs `disabled`.
- Resend waiting: colour `--ink-3`, `aria-disabled="true"`.
- Resend ready: colour `--accent`, `aria-disabled="false"`.
- Success card: surface, 1px `--line`, radius 12px, padding 14px 16px.
- Enter again: 44px tall, ink, Inconsolata.

## Accessibility

- The group is named by the title. Boxes are named Digit 1 to Digit 6. Do not rely on placeholder dots.
- `aria-invalid` is set on each box only while the error is showing. Clearing the digits does not remove the alert text. The next input does.
- `role="alert"` on the error. `role="status"` for resend and success only.
- Keyboard: digits, Backspace, Arrow Left, Arrow Right, paste. A one-character non-digit is prevented on keydown.
- Hit targets: each box is at least 44px tall (56px at the default root). Resend and Enter again are at least 44px tall. The nav row is at least 44px under the safe area.
- Contrast: `#172033` on `#f4f6fa` clears 4.5:1. `#515a70` on `#e6e8ef` clears 4.5:1. `#9e2b22` on `#f4f6fa` clears 4.5:1. `#1d6a42` on `#f4f6fa` clears 4.5:1.
- Do not move focus in a loop. After a miss, focus box 1. After success, focus the title (`tabindex="-1"`).

## Responsive rules

- The frame is 390 by 844. Inline padding 16px. Top `max(54px, env(safe-area-inset-top))`. Bottom `max(34px, env(safe-area-inset-bottom))`.
- The boxes are `grid-template-columns: repeat(6, minmax(0, 1fr))` with gap 8px. They shrink. They do not overflow sideways at 360 wide. At 360 the cell is about 48px, still at least 44px tall.
- At a 32px root, the title and dek wrap, Resend grows with the font, and the boxes stay on one row because the grid is fractional. Digit size is 1.75rem, so the box `min-height: 3.5rem` grows with the text and the page scrolls vertically. There is no two-column text row on this screen. The nav's two ends wrap if the wordmark and the desk label no longer fit.
- `touch-action: pan-y` on the body so a horizontal swipe is not captured by the boxes.
- At tablet width, centre a 390px column. Do not draw six boxes across 1180px.
- Do not draw a status bar or a home indicator.

## Acceptance checklist

### Always

- [ ] Six single-digit boxes. Typing a digit advances. Backspace on an empty box goes back.
- [ ] Paste fills from the first box with digits only, up to six.
- [ ] A wrong code shakes the row, shows an error under it, then clears the digits and keeps the error until the next entry.
- [ ] Resend waits 30 seconds from the moment this screen is shown, then waits 30 seconds again after each resend.
- [ ] The destination is masked and is not a US 555 number.
- [ ] The first frame is empty, with the first box focused.
- [ ] Targets are at least 44px. Safe areas are 54px top and 34px bottom.
- [ ] Reduced motion shortens the shake to 1ms and still clears the digits.

### This demo

- [ ] Brand is Chitthi. Nav meta is "DESK 04". Title starts as "Enter the code".
- [ ] The masked destination is `+977 98****418`.
- [ ] The only accepted code is `482913`. Any other six digits use the error "That code does not match. Try again."
- [ ] Success title is "Desk open". The card reads "Mina Gurung" and "Signed in at the New Road desk."
- [ ] Resend waiting copy is "Resend in 30s". Ready copy is "Resend code". Status on a resend is "Code sent again."
- [ ] Foot copy is "Do not share this code."
- [ ] Ground `#e6e8ef`, surface `#f4f6fa`, ink `#172033`, vermilion `#9e2b22`, ok `#1d6a42`.
- [ ] Fonts are Vollkorn and Inconsolata. Box radius is 10px. Shake is 420ms.

## Implementation notes

Keep the boxes as six inputs so paste, focus, and labels stay native. Reject non-digits and advance:

```js
box.addEventListener('input', function () {
  if (lock || done) return;
  box.value = box.value.replace(/\D/g, '').slice(-1);
  if (box.value && i < 5) boxes[i + 1].focus();
  if (code().length === 6) judge();
});
```

Paste must `preventDefault`, or the browser will also drop the whole string into one box:

```js
box.addEventListener('paste', function (e) {
  e.preventDefault();
  var text = (e.clipboardData && e.clipboardData.getData('text')) || '';
  fill(text.replace(/\D/g, '').slice(0, 6));
});
```

A miss sets a lock flag so a second input event cannot judge again before the clear:

```js
lock = true;
row.classList.remove('shake');
void row.offsetWidth;
row.classList.add('shake', 'bad');
setTimeout(function () {
  boxes.forEach(function (b) { b.value = ''; });
  boxes[0].focus();
  lock = false;
}, 420);
```

Common mistakes:

- One hidden input and six decorative spans, then paste and screen readers both fail.
- Clearing the error in the same timeout as the digits, so nobody can read it.
- Accepting any six digits. This demo accepts only `482913`.
- A US number such as +1 555 0100. The mask is a Nepal mobile, country code 977, prefix 98.
- Starting Resend only after a failure. The wait is already running on the first frame.
- Circular iOS passcode dots. These are rectangular boxes with a vermilion foot.
- Drawing the status bar or a home indicator.
- Announcing the countdown every second.

Where it sits:

1. It follows a "send a code" step that is not in this piece. That is why the number is already masked and the timer is already running.
2. Success means the desk account is open. The card is that consequence. It is not a second app home.
3. "Enter again" is the gallery replay. A product would leave this screen instead.

Rebuild order:

1. Nav with Chitthi and DESK 04, 54px top, 1px line.
2. Title, masked number, six-column boxes, first box focused.
3. Wire typing, arrows, backspace, and paste.
4. Accept only `482913`. Shake, error, clear digits after 420ms.
5. Show the Mina Gurung card on success.
6. Start the 30 second resend on load.
7. Pin the foot, then add reduced motion.
8. Name the boxes Digit 1 through Digit 6. The masked number stays in the dek, not inside a box.
9. Keep the vermilion off the full-width controls. It is the desk swatch, the focused foot, the error, and the ready Resend label.
10. The success card is one account, Mina Gurung at the New Road desk. Do not add a second row to match the lock piece.
11. Box gap is 8px. At 390px with 16px of inline padding the six cells share the leftover width. None of them uses a fixed width that could overflow.
