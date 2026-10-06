<!-- Design Lounge Nº 220 · "Dial knob" · www.designlounge.live -->

# Dial knob

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A knob for how many hours a load may stay on hold. The range is 0 to 12. It starts at 6. The needle sweeps from -140 degrees to 140 degrees. Dragging around the dial sets the hour. Arrow keys step by one. This is not a linear slider. A slider is `slider-field`. This is not a clock field. A clock field is `time-field`. The value is a count of hours.

## Structure

```
360px card
Hold hours
( dial 180px )
6
caption
```

- Card 360px, padding 28px, text centered.
- Dial 180px circle, role slider, tabindex 0.
- Needle is 2×72, origin at the hub.
- Hub is 14px.
- The number is 40px.

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Needle | value change | previous angle | next angle | none | instant |

## States

- Value 6 at rest.
- Dragging: the hour updates as the pointer moves.
- Ends: 0 and 12 do not wrap.
- Focus: 2px ring, offset 4px.

## Accessibility

- The dial is role slider with aria-valuemin 0, aria-valuemax 12, aria-valuenow, and aria-label Hold hours.
- The visible number matches the value.
- Keyboard can change the value without a pointer.
- Do not use a native range that you then hide.
- The caption is extra description, not the name.
- Hit target is the 180px dial.

## Responsive rules

- The card is 360px at 1280.
- Below 400 the card is calc(100% - 32px). The dial stays 180px.
- Do not replace the dial with a select on a phone. The dial is the control.

## Acceptance checklist

### Always

- [ ] Range 0 to 12, step 1.
- [ ] Needle angle is -140 plus value/12 times 280.
- [ ] Keyboard steps by one.
- [ ] The number and aria-valuenow match.
- [ ] No wrap at the ends.

### This demo

- [ ] The label is Hold hours.
- [ ] The start value is 6.
- [ ] The caption is hours before a load is released.
- [ ] The needle is #1f4d3a.
- [ ] Type is IBM Plex Sans.

## Measurements to keep

- Card 360px, padding 28px. Dial 180px.
- Needle 2×72, top 18px. Hub 14px.
- Number 40px, margin-top 16px.
- Angle span 280 degrees, from -140 to 140.
- Focus offset 4px.

## Wrong turns

- Do not use this for a price.
- Do not spin freely past the ends.
- Do not show minutes.
- Do not animate a continuous rotation.
- Do not hide the number.
- Do not make the dial 40px. The target is 180px.

## Fit with the rest of the library

- A linear value is `slider-field`.
- A time of day is `time-field`.
- A confirm drag is `drag-to-confirm`.
- This knob is a small integer.
- Do not put a second knob beside it in this piece.
- The ground is #f6f4ef.

## Keyboard

- ArrowUp adds 1.
- ArrowRight adds 1.
- ArrowDown subtracts 1.
- ArrowLeft subtracts 1.
- Home sets 0.
- End sets 12.
- The value clamps.
- aria-valuenow updates.
- The dial is one tab stop.
- Prevent default on the arrows so the page does not scroll.
- Pointer events use setPointerCapture.
- Do not use a positive tabindex.
- The caption is not focusable.
- Reduced motion changes nothing.
- Start at 6.
- Type is IBM Plex Sans.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame reads 6. The needle sits at the angle for 6.
2. Pointer down and move map the angle to a rounded hour and clamp between 0 and 12.
3. ArrowUp and ArrowRight add one hour. ArrowDown and ArrowLeft subtract one.
4. Home sets 0. End sets 12.
5. The number under the dial matches aria-valuenow.
6. The caption stays "hours before a load is released".
7. The value does not wrap past 12 or below 0.

## Tokens

```css
:root {
  --bg:#f6f4ef; --surface:#fff; --ink:#161513; --ink-2:#5a554c;
  --line:#e4dfd4; --line-2:#cfc6b8; --primary:#1f4d3a;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Title | IBM Plex Sans | 22px | 600 | 1.2 | 0 |
| Number | IBM Plex Sans | 40px | 600 | 1 | 0 |
| Caption | IBM Plex Sans | 14px | 400 | 1.4 | 0 |

## Implementation notes

atan2(x, -y) gives degrees from up. Clamp to ±140, then map into 0–12.

```js
const deg = -140 + (val / 12) * 280;
needle.style.transform = "rotate(" + deg + "deg)";
```

Round to an integer hour. Do not show decimals.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
