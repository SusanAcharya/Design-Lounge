<!-- Design Lounge Nº 255 · "Glitch text" · www.designlounge.live -->

# Glitch text

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A night page with the word GATE 4. Replay sets a 480ms split: a red slice shifts left and a green slice shifts right, then both are gone. Reduced motion does not play. This is not a scramble through random letters. That reveal is `text-scramble-reveal`. This is not a flap board. That board is `split-flap-board`. One word, one short fault.

## Structure

```
GATE 4
Replay
```

- The heading is 92px, weight 600, relative.
- The slices are ::before and ::after using attr(data-text).
- Replay sits 28px under the word, height 40px.
- The ground is #141311.
- The word colour is #f4f1ea.

## Motion

- Split | Replay | still | 4px offset slices | 480ms steps(2). Reduced motion stays still.

## States

- Still: no slices.
- On: data-on true for 480ms.
- After: still again.
- Reduced: Replay does nothing visible.

## Accessibility

- The heading text is GATE 4. The slices repeat data-text and are decorative.
- Replay is a button.
- Reduced motion does not run the split.
- Focus ring is 2px #d7b15e if you add it; the demo uses the browser ring on the dark ground. Add outline 2px #d7b15e, offset 4px.
- The word stays readable without the split.
- Do not replace the letters with symbols.

## Responsive rules

- The word is 92px at 1280.
- Below 700 the word is 56px.
- Replay stays under the word.

## Acceptance checklist

### Always

- [ ] The word is readable before Replay.
- [ ] The split lasts 480ms.
- [ ] Reduced motion stays still.
- [ ] Replay can run again.
- [ ] One family, IBM Plex Sans.

### This demo

- [ ] The word is GATE 4.
- [ ] Red is #9b2c2c. Green is #1f4d3a.
- [ ] The duration is 480ms.
- [ ] The offsets are 4px.
- [ ] The ground is #141311.

## Measurements to keep

- Word 92px, weight 600.
- Split 480ms, steps(2), offset 4px.
- Clip top slice inset(0 0 55% 0). Bottom slice inset(45% 0 0 0).
- Button height 40px, margin-top 28px.
- Ground #141311. Ink #f4f1ea.

## Wrong turns

- Do not loop the glitch.
- Do not scramble the letters.
- Do not use rainbow colours.
- Do not hide the word.
- Do not run under reduced motion.
- Do not add a second word.

## Fit with the rest of the library

- A scramble is `text-scramble-reveal`.
- A flap board is `split-flap-board`.
- This is one short split.
- Do not put it on body text.
- One family.
- The ground is near-black.

## Keyboard

- Enter runs Replay.
- The heading is not a control.
- Do not use a positive tabindex.
- Reduced motion returns early.
- The timer is 480ms.
- Focus stays on Replay.
- There is one button.
- data-text matches the heading.
- A second Enter can overlap. Clear the previous timer before setting data-on again.
- The slices are pseudo-elements.
- Type is IBM Plex Sans.
- No live region. The word does not change.
- Escape does nothing.
- Offset is 4px.
- Clip values stay as measured.
- Do not trap focus.

## Rebuild order

1. Build step: The word GATE 4 is still on the first frame.
2. Build step: Replay sets data-on for 480ms.
3. Build step: The red slice is #9b2c2c, translate -4px, clipped to the top 45%.
4. Build step: The green slice is #1f4d3a, translate 4px, clipped to the bottom 55%.
5. Build step: After 480ms data-on is removed.
6. Build step: A second Replay can run again.
7. Build step: Reduced motion returns without setting data-on.

- Keep this measurement while rebuilding: Word 92px, weight 600.
- Keep this measurement while rebuilding: Split 480ms, steps(2), offset 4px.
- Keep this measurement while rebuilding: Clip top slice inset(0 0 55% 0). Bottom slice inset(45% 0 0 0).
- Keep this measurement while rebuilding: Button height 40px, margin-top 28px.
- Keep this measurement while rebuilding: Ground #141311. Ink #f4f1ea.

- While rebuilding, remember: Do not loop the glitch.
- While rebuilding, remember: Do not scramble the letters.
- While rebuilding, remember: Do not use rainbow colours.
- While rebuilding, remember: Do not hide the word.
- While rebuilding, remember: Do not run under reduced motion.
- While rebuilding, remember: Do not add a second word.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The word GATE 4 is still on the first frame.
2. Replay sets data-on for 480ms.
3. The red slice is #9b2c2c, translate -4px, clipped to the top 45%.
4. The green slice is #1f4d3a, translate 4px, clipped to the bottom 55%.
5. After 480ms data-on is removed.
6. A second Replay can run again.
7. Reduced motion returns without setting data-on.

## Tokens

```css
:root { --bg:#141311; --ink:#f4f1ea; --red:#9b2c2c; --green:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Word | IBM Plex Sans | 92px | 600 |
| Button | IBM Plex Sans | 14px | 500 |

## Implementation notes

Copy the word into data-text so the slices match.

```js
h.dataset.on = "true";
setTimeout(() => { h.dataset.on = ""; }, 480);
```

If reduced motion matches, return before setting data-on.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
