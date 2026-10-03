<!-- Design Lounge Nº 277 · "Trail type" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Trail type

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The word HOLD, Fraunces 120px, fill transparent, 2px stroke #f4f1ea, on #141311. Drag it. Every 28px, an outline in #a39b90 is left behind, up to eight. Release returns the word and removes the trail. Reduced motion does not drag. This is not a scramble. That reveal is `text-scramble-reveal`. This is not scroll tracking. That tracking is `scroll-velocity-type`.

## Reference behaviour

1. The word sits at left 40px, top 70px.
2. Pointer down starts a drag unless motion is reduced.
3. Pointer move translates the word.
4. A ghost is added when the pointer has moved 28px and fewer than 8 ghosts exist.
5. Ghosts copy the word and the current transform. They do not take the pointer.
6. Pointer up clears the transform and removes the ghosts.
7. Reduced motion returns on pointer down. The word stays put.

## Structure

```
720×280 stage
HOLD
```

- The stage is 720 by 280, position relative.
- The heading is 120px, weight 560, letter-spacing -0.04em.
- Stroke is 2px. Fill is transparent.
- Ghosts are #a39b90 at opacity .45.
- The cursor is grab, and grabbing is unused because release is immediate.

## Tokens

```css
:root { --bg:#141311; --ink:#f4f1ea; --ghost:#a39b90; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Word | Fraunces | 120px | 560 |

## Motion

- Word | drag | rest position | pointer | none | ghosts mark the path. Release clears them. Reduced motion does not drag.

## States

- Rest: one word, no ghosts.
- Drag: word translated, up to 8 ghosts.
- Release: rest again.
- Reduced: rest only.

## Accessibility

- The word is a heading, so HOLD is in the tree.
- Ghosts are decorative. They repeat the same word and should be aria-hidden.
- Reduced motion keeps the word still.
- There is no button. The heading is the handle.
- Do not replace the letters.
- The stroke colour on #141311 stays visible. The fill is empty on purpose.

## Responsive rules

- The word is 120px at 1280.
- Below 800 the word is 72px and the stage is calc(100% - 32px).
- Ghosts use the same size as the word.

## Acceptance checklist

### Always

- [ ] One word, HOLD.
- [ ] At most eight ghosts.
- [ ] Release clears the trail.
- [ ] Reduced motion does not drag.
- [ ] The fill stays transparent.

### This demo

- [ ] The word is HOLD.
- [ ] Stroke is 2px #f4f1ea.
- [ ] Ghost stroke is #a39b90.
- [ ] The step is 28px. The cap is 8.
- [ ] The face is Fraunces.

## Implementation notes

Cap the ghosts.

```js
if (dist < 28 || ghosts.length > 7) return;
```

Remove every ghost on pointer up. Do not leave them on a timer.

## Measurements to keep

- Stage 720×280. Word 120px at left 40px, top 70px.
- Stroke 2px. Letter-spacing -0.04em.
- Ghost step 28px. Cap 8. Opacity .45.
- Ghost colour #a39b90.
- Ground #141311.

## Wrong turns

- Do not fill the word with a gradient.
- Do not loop the trail.
- Do not leave ghosts after release.
- Do not drag under reduced motion.
- Do not add a second word.
- Do not use a canvas.

## Fit with the rest of the library

- A scramble is `text-scramble-reveal`.
- Scroll tracking is `scroll-velocity-type`.
- This is a drag trail.
- One word.
- The face is Fraunces.
- The ground is near-black.

## Keyboard

- The heading is not a button. Pointer is the input.
- Reduced motion ignores pointer down.
- Ghosts are not tab stops.
- Do not use a positive tabindex.
- Release clears the trail.
- The cap is 8.
- The step is 28px.
- The word is HOLD.
- Stroke is 2px.
- Fill is transparent.
- The face is Fraunces.
- Escape does nothing.
- No live region.
- At most eight ghosts.
- Pointer capture is on the word.
- Do not trap focus. There is no focus target beyond the page.

## Pass

- Measure the first frame before changing a number.
- Keep the names in this brief.
- Keep the duration written above.
- Honour reduced motion.
- Do not add a second accent.
- Do not add a second type family.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
