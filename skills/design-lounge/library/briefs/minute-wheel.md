<!-- Design Lounge Nº 286 · "Minute wheel" · designlounge.vercel.app -->

# Minute wheel

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A wheel for how many minutes a hold lasts. Values run from 1 to 30. The window shows three rows and starts on 10. Dragging moves the wheel. Arrow up adds a minute. This is not a clock time. A clock is `time-field`. This is not a 0 to 12 knob. That knob is `dial-knob`. The value is a count of minutes.

## Reference behaviour

1. The value starts at 10. The caption reads 10 minutes.
2. The selected row is dark. Neighbours are #5a554c.
3. Drag changes the value by the pointer delta over 60px per minute.
4. ArrowUp adds 1. ArrowDown subtracts 1. Home is 1. End is 30.
5. The value clamps. It does not wrap.
6. aria-valuenow matches the number.
7. Fades at the top and bottom of the window are decorative.

## Structure

```
280px card
Hold minutes
[ 9 ]
[ 10 ]
[ 11 ]
10 minutes
```

- Card 280px, padding 24px.
- Window height 180px, so three rows of 60px.
- The column translates so the value sits in the middle row.
- The window is role slider.
- The caption is 14px.

## Tokens

```css
:root { --bg:#f6f4ef; --surface:#fff; --ink:#161513; --ink-2:#5a554c; --line:#e4dfd4; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Title | IBM Plex Sans | 22px | 600 |
| Minute | IBM Plex Sans | 28px | 600 |
| Caption | IBM Plex Sans | 14px | 400 |

## Motion

- Wheel | drag or key | previous translate | next translate | none | the value still changes

## States

- Selected row: data-on true, colour #161513.
- Other rows: #5a554c.
- Ends: 1 and 30 do not wrap.
- Focus ring on the window.

## Accessibility

- The window is a slider, aria-valuemin 1, aria-valuemax 30, aria-label Hold minutes.
- The caption repeats the value.
- Arrow keys work.
- The fades are pseudo-elements.
- Focus ring is 2px #1f4d3a, offset 3px.
- Do not use a native select for the wheel.

## Responsive rules

- The card is 280px and stays centered.
- Below 320 the card is calc(100% - 32px). The wheel stays 180px tall.
- Do not replace the wheel with a number input in this piece.

## Acceptance checklist

### Always

- [ ] Range 1 to 30.
- [ ] One selected minute.
- [ ] Drag and keys change it.
- [ ] The caption matches.
- [ ] No wrap at the ends.

### This demo

- [ ] The title is Hold minutes.
- [ ] The start is 10.
- [ ] The caption is 10 minutes.
- [ ] There are 30 rows.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Middle row is index 1 of the visible three, so translate is (2 - (val-1)) * 60.

```js
col.style.transform = "translateY(" + ((2 - (val - 1)) * 60) + "px)";
```

Round to an integer.

## Measurements to keep

- Card 280px, padding 24px. Window 180px. Row 60px.
- Number 28px. Title 22px. Caption 14px, margin-top 12px.
- Range 1–30. Start 10.
- Selected ink #161513. Other ink #5a554c.
- Focus offset 3px.

## Wrong turns

- Do not include hours.
- Do not wrap past 30.
- Do not spin freely.
- Do not hide the caption.
- Do not use a scrollbar.
- Do not show seconds.

## Fit with the rest of the library

- A clock is `time-field`.
- A hour knob is `dial-knob`.
- A week is `week-schedule`.
- This wheel is minutes only.
- One wheel.
- Type is IBM Plex Sans.

## Keyboard

- ArrowUp adds 1.
- ArrowDown subtracts 1.
- Home sets 1.
- End sets 30.
- The value clamps.
- aria-valuenow updates.
- The caption updates.
- Prevent default so the page does not scroll.
- One tab stop.
- Do not use a positive tabindex.
- Pointer capture during drag.
- 30 rows exist.
- Start at 10.
- Focus offset is 3px.
- Type is IBM Plex Sans.
- No wrap.

## Rebuild order

1. Build step: The value starts at 10. The caption reads 10 minutes.
2. Build step: The selected row is dark. Neighbours are #5a554c.
3. Build step: Drag changes the value by the pointer delta over 60px per minute.
4. Build step: ArrowUp adds 1. ArrowDown subtracts 1. Home is 1. End is 30.
5. Build step: The value clamps. It does not wrap.
6. Build step: aria-valuenow matches the number.
7. Build step: Fades at the top and bottom of the window are decorative.

- Keep this measurement while rebuilding: Card 280px, padding 24px. Window 180px. Row 60px.
- Keep this measurement while rebuilding: Number 28px. Title 22px. Caption 14px, margin-top 12px.
- Keep this measurement while rebuilding: Range 1–30. Start 10.
- Keep this measurement while rebuilding: Selected ink #161513. Other ink #5a554c.
- Keep this measurement while rebuilding: Focus offset 3px.

- While rebuilding, remember: Do not include hours.
- While rebuilding, remember: Do not wrap past 30.
- While rebuilding, remember: Do not spin freely.
- While rebuilding, remember: Do not hide the caption.
- While rebuilding, remember: Do not use a scrollbar.
- While rebuilding, remember: Do not show seconds.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
