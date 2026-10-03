<!-- Design Lounge Nº 215 · "Letter sleeve" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Letter sleeve

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A letter titled Gate 4 sits in front of a charcoal sleeve, slightly turned. Tuck slides it down into the sleeve. Pull brings it back. The sleeve covers the lower part because it is stacked above the letter. This is not a fan of notes. That fan is `folder-reveal`. This is not a page turn. That turn is `book-page-flip`.

## Reference behaviour

1. The letter starts out. The button reads Tuck the letter. aria-expanded is true.
2. Out pose is translateY 20px and rotate -2deg.
3. Tuck sets data-tuck and the letter moves to translateY 150px and rotate 0.
4. The button reads Pull the letter. aria-expanded is false.
5. Pull clears the tuck.
6. The move is 480ms.
7. Reduced motion snaps.

## Structure

```
420×360
[ letter ]
[ charcoal sleeve ]
Tuck the letter
```

- The stage is 420 by 360.
- The letter is 300px wide, left 50px, top 36px, padding 24px, fill #fffdf8.
- The sleeve is left 20px, right 20px, bottom 48px, height 120px, fill #1c1b19, z-index 2.
- The letter is z-index 1, so the sleeve covers its lower half when tucked.
- The button is 40px, at the bottom of the stage.

## Tokens

```css
:root { --bg:#f4f1ea; --paper:#fffdf8; --sleeve:#1c1b19; --ink:#1a1814; --ink-2:#5c564c; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Title | Fraunces | 28px | 560 |
| Body | Public Sans | 16px | 400 |
| Button | Public Sans | 14px | 500 |

## Motion

- Letter | Tuck or Pull | translateY 20px rotate -2deg | translateY 150px rotate 0 | 480ms cubic-bezier(0.16,1,0.3,1). Reduced motion snaps.

## States

- Out: aria-expanded true, button Tuck the letter.
- Tucked: aria-expanded false, button Pull the letter.
- The sentence on the letter does not change.
- The sleeve does not move.

## Accessibility

- The button name changes.
- aria-expanded is true when the letter is out.
- The letter is an article with a heading.
- The sleeve is aria-hidden.
- Focus ring is 2px #1f4d3a, offset 3px.
- Reduced motion still tucks and pulls.

## Responsive rules

- The stage is 420px at 1280.
- Below 460 the stage is calc(100% - 32px). The letter width becomes calc(100% - 80px).
- The sleeve stays 120px tall.

## Acceptance checklist

### Always

- [ ] Starts out.
- [ ] Tuck hides it in the sleeve.
- [ ] Pull brings it back.
- [ ] The sleeve stays put.
- [ ] 480ms or none.

### This demo

- [ ] The title is Gate 4.
- [ ] The sentence says twelve loads are still held.
- [ ] The sleeve is #1c1b19.
- [ ] The out rotation is -2deg.
- [ ] Display is Fraunces. Text is Public Sans.

## Implementation notes

Toggle data-tuck on the stage.

```css
.stage[data-tuck="true"] .letter { transform: translateY(150px) rotate(0deg); }
```

Keep the sleeve above the letter.

## Measurements to keep

- Stage 420×360. Letter width 300px, padding 24px.
- Out: translateY 20px, rotate -2deg. Tuck: translateY 150px, rotate 0.
- Sleeve height 120px, bottom 48px.
- Duration 480ms.
- Title 28px Fraunces.

## Wrong turns

- Do not start tucked. The letter is the picture.
- Do not move the sleeve.
- Do not flip the letter over.
- Do not fan several letters.
- Do not fetch a message.
- Do not cover the heading when the letter is out.

## Fit with the rest of the library

- A fan is `folder-reveal`.
- A page turn is `book-page-flip`.
- This is one sleeve.
- One letter.
- Display is Fraunces.
- The ground is paper.

## Keyboard

- Enter tucks or pulls.
- The button name changes.
- aria-expanded matches the letter.
- The sleeve is not a tab stop.
- Do not use a positive tabindex.
- Reduced motion snaps.
- Focus stays on the button.
- Starts out.
- Focus offset is 3px.
- Display type is Fraunces.
- Text type is Public Sans.
- Escape does nothing.
- One letter.
- The heading stays Gate 4.
- Tuck travel is 150px.
- Do not trap focus.

## Pass

- Measure the first frame before changing a number.
- Keep the names in this brief.
- Keep the duration written above.
- Honour reduced motion.
- Do not add a second accent.
- Do not add a second type family.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
