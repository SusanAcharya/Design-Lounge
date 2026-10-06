<!-- Design Lounge Nº 228 · "Drag to confirm" · www.designlounge.live -->

# Drag to confirm

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A drag-to-confirm for voiding a hold at Hollis. The sentence says Gate 4, load 18, and that it cannot be sent again today. The thumb starts at the left. Releasing before 92 percent snaps it back. Releasing at or past 92 percent completes the void. This is not a settings slider. A slider is `slider-field`. This is not a confirm dialog. A dialog is `modal-dialog-focus-trap`. The drag is the confirmation.

## Structure

```
440px card, centered
title, one sentence
[ thumb -------- Slide to void ] 56px, radius 999px
status
Reset, hidden until done
```

- Card padding 28px, width 440px, radius 2px.
- Track is 56px tall, radius 999px.
- Thumb is 48px, inset 4px, fill #9b2c2c.
- The thumb is a slider with aria-valuemin 0 and aria-valuemax 100.
- Reset is a 36px outline button.

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Thumb snap back | pointer up under 92% | current x | 4px | 180ms cubic-bezier(0.2,0.7,0.2,1) | jump |

## States

- Rest: thumb left, label Slide to void.
- Dragging: thumb follows, no transition.
- Done: track border and wash use the green, label Voided, thumb disabled.
- Reset visible only after done.

## Accessibility

- The thumb is role slider with an accessible name.
- Keyboard can complete the action without a pointer.
- Disabled thumb is not removed from the page, but it does not drag.
- Status is aria-live polite.
- The track label is visual only. The button name carries the instruction.
- Hit target of the thumb is 48px.

## Responsive rules

- Card is 440px at 1280.
- Below 480 the card is calc(100% - 32px). The track stays full width of the card.
- Do not stack a second confirm button beside the track.

## Acceptance checklist

### Always

- [ ] Release before the end cancels.
- [ ] Release at the end completes and says what was voided.
- [ ] A reset brings the control back.
- [ ] Keyboard can reach the end.
- [ ] The action is destructive and the thumb is the danger colour, not the primary green.

### This demo

- [ ] Copy names Gate 4 and load 18.
- [ ] The label starts as Slide to void.
- [ ] Done copy is "Hold voided · load 18 · Gate 4".
- [ ] Threshold is 92 percent.
- [ ] Type is IBM Plex Sans.

## Measurements to keep

- Card 440px, padding 28px.
- Track height 56px, radius 999px, margin-top 28px.
- Thumb 48px, top 4px, left starts at 4px.
- Snap 180ms, cubic-bezier(0.2, 0.7, 0.2, 1).
- Reset height 36px, margin-top 12px.

## Wrong turns

- Do not use this for a volume or a price. That is a slider.
- Do not fire the action at 50 percent.
- Do not hide the instruction while dragging.
- Do not make the thumb the primary green. The danger colour is the thumb.
- Do not require a second click after the drag.
- Do not leave the thumb in the middle on release.

## Fit with the rest of the library

- A normal slider is `slider-field`.
- A dialog confirm is `modal-dialog-focus-trap`.
- Button roles are `button-roles`.
- An undo after a reversible archive is `undo-toast`.
- This void cannot be undone in the demo. The copy says it cannot be sent again today.
- Do not combine this track with a modal on the same view.

## Keyboard

- ArrowRight increases by 10.
- ArrowLeft decreases by 10.
- Home sets 0.
- End completes.
- Enter completes only at 92 or more.
- The thumb is the only slider.
- Pointer capture stays on the thumb during the drag.
- Escape does not cancel a finished void. Reset does.
- Do not use a range input that looks like a native slider. Draw the track.
- Focus ring is 2px #1f4d3a, offset 3px.
- The status is not focused.
- Tab reaches the thumb, then Reset when Reset is visible.
- Reset is hidden, so it is not in the tab order, until the void completes.
- Do not start a drag from the track label. The thumb is the handle.
- A finished thumb is disabled.
- Reduced motion removes the 180ms snap and jumps.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame shows the track with the thumb at the left. The label reads Slide to void. The status line is empty. Reset is hidden.
2. Pointer down on the thumb starts a drag. The thumb follows the pointer and does not leave the track.
3. The red wash behind the thumb grows with the thumb.
4. Pointer up below 92 percent animates the thumb back to the start in 180ms.
5. Pointer up at 92 percent or more moves the thumb to the end, sets the label to Voided, disables the thumb, and writes "Hold voided · load 18 · Gate 4".
6. Reset returns the track to the start and clears the status.
7. ArrowRight adds 10 percent. ArrowLeft subtracts 10. End completes. Home returns to zero. Enter completes only when the value is already at least 92.

## Tokens

```css
:root {
  --bg:#f6f4ef; --surface:#fff; --ink:#161513; --ink-2:#5a554c;
  --line:#e4dfd4; --line-2:#cfc6b8; --primary:#1f4d3a; --danger:#9b2c2c;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Title | IBM Plex Sans | 22px | 600 | 1.2 | 0 |
| Body | IBM Plex Sans | 14px | 400 | 1.45 | 0 |
| Track label | IBM Plex Sans | 14px | 500 | 1 | 0 |

## Implementation notes

max travel is track width minus 56, because the thumb is 48px plus 4px inset on each side.

```js
function commit(v){ if (v >= 92) finish(); else paint(0, true); }
```

Do not confirm on pointer down. The person must release at the end.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
