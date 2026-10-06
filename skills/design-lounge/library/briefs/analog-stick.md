<!-- Design Lounge Nº 169 · "Analog stick" · www.designlounge.live -->

# Analog stick

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A round well with a dark cap labelled Hold. Moving the pointer leans the cap toward that side. The matching label lights: Night, Gate, Month, or Yard. Leaving the well centers the cap. Arrow keys lean it too. This is not a 0 to 12 knob. That knob is `dial-knob`. This is not a minute wheel. That wheel is `minute-wheel`. The lean is the choice.

## Structure

```
280px well
Night
Yard  [Hold]  Gate
Month
```

- The well is 280 by 280, white, radius 50%.
- The cap is 100 by 100, fill #1c1b19, text #f4f1ea, centered at 90,90.
- Labels are 36px pills.
- A lit label is border #d7b15e, text #6a4e16, fill #f8f1de.
- The well is role application and tabbable.

## Motion

- Cap | pointer or arrow | centered | leaned | 120ms cubic-bezier(0.16,1,0.3,1). Reduced motion snaps.

## States

- Center: no label lit.
- One side: one label lit, cap leaned.
- Leave: back to center.
- Keys: the matching side, until another key or a leave.

## Accessibility

- The well name says to point the stick and that arrows lean it.
- Labels are text, not only colour.
- Arrow keys work and preventDefault.
- Focus ring is 2px #1f4d3a, offset 3px.
- The cap is not a separate button.
- Reduced motion still leans. The transition is the only thing removed.

## Responsive rules

- The well stays 280px and centered.
- Below 320 the well is calc(100% - 32px) and the cap scales with it.
- Labels stay inside the well.

## Acceptance checklist

### Always

- [ ] One lit label, or none.
- [ ] The cap follows the pointer inside the well.
- [ ] Leave centers it.
- [ ] Arrows lean it.
- [ ] Labels are Night, Gate, Month, Yard.

### This demo

- [ ] The cap reads Hold.
- [ ] Up is Night. Right is Gate. Down is Month. Left is Yard.
- [ ] The lean factor is 0.28.
- [ ] The dead zone is 12px.
- [ ] Type is IBM Plex Sans.

## Measurements to keep

- Well 280px. Cap 100px at left 90px, top 90px.
- Label height 36px.
- Dead zone 12px. Key lean 80px. Factor 0.28.
- Lit text #6a4e16 on #f8f1de. Mark #d7b15e.
- Transition 120ms.

## Wrong turns

- Do not spin the cap.
- Do not light two labels.
- Do not leave it leaned after pointerleave.
- Do not use a game image.
- Do not hide the four words.
- Do not make the cap a free drag that sticks.

## Fit with the rest of the library

- A knob is `dial-knob`.
- A minute wheel is `minute-wheel`.
- This is a direction.
- One well.
- Type is IBM Plex Sans.
- The ground is #f6f4ef.

## Keyboard

- ArrowUp leans toward Night.
- ArrowDown leans toward Month.
- ArrowLeft leans toward Yard.
- ArrowRight leans toward Gate.
- preventDefault so the page does not scroll.
- The well is one tab stop.
- Labels are not buttons.
- Do not use a positive tabindex.
- Leave resets.
- Focus offset is 3px.
- Dead zone is 12px.
- Type is IBM Plex Sans.
- One label at most.
- Escape does nothing.
- Reduced motion snaps the lean.
- Do not trap focus past the well.

## Pass

- Measure the first frame before changing a number.
- Keep the names in this brief.
- Keep the duration written above.
- Honour reduced motion.
- Do not add a second accent.
- Do not add a second type family.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The cap starts centered. No label is lit.
2. Pointer move measures from the well center.
3. The cap translates 0.28 of that offset.
4. If the offset is past 12px, the stronger axis lights one label.
5. Right lights Gate. Left lights Yard. Down lights Month. Up lights Night.
6. Leaving the well centers the cap and clears the label.
7. Arrow keys lean 80px on that axis and prevent page scroll.

## Tokens

```css
:root { --bg:#f6f4ef; --well:#fff; --cap:#1c1b19; --ink:#161513; --mark:#d7b15e; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Cap | IBM Plex Sans | 15px | 600 |
| Label | IBM Plex Sans | 13px | 500 |

## Implementation notes

Measure from the well center.

```js
lean(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
```

Pick the axis with the larger absolute value.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
