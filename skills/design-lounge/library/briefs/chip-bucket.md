<!-- Design Lounge Nº 185 · "Chip bucket" · designlounge.vercel.app -->

# Chip bucket

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Gate 4, Night book, and Hold list start in a pile. A dark bucket is labelled Night bucket. Drag a chip. If it overlaps the bucket on release, it joins the bucket and the note names it. If it misses, it returns to the pile. This is not a token field. That field is `token-field`. This is not a drag-to-confirm track. That track is `drag-to-confirm`.

## Reference behaviour

1. Three chips start in the pile. The note says Drag a chip into the bucket.
2. Pointer down captures the chip.
3. Pointer move translates the chip with the pointer.
4. Release tests the chip box against the bucket box.
5. A hit hides the pile chip and appends a resting chip in the bucket.
6. The note reads the name plus is in the night bucket.
7. A miss clears the transform. The chip stays in the pile.

## Structure

```
pile                    bucket
Gate 4                  Night bucket
Night book
Hold list
```

- The board is 640px, space-between.
- Chips are 40px pills.
- The bucket is 220px wide, min-height 240px, fill #1c1b19, radius 8px 8px 16px 16px.
- A chip inside the bucket is fill #2a2926 and is not a button.
- The note is 14px, min-height 20px.

## Tokens

```css
:root { --bg:#f6f4ef; --chip:#fff; --bucket:#1c1b19; --ink:#161513; --on:#f4f1ea; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Chip | IBM Plex Sans | 14px | 500 |
| Bucket title | IBM Plex Sans | 16px | 600 |
| Note | IBM Plex Sans | 14px | 400 |

## Motion

- Chip | drag | pile | pointer | none | the chip follows the pointer

## States

- In the pile: a button, grabbable.
- Dragging: translated.
- In the bucket: not a button, note updated.
- Miss: back in the pile.

## Accessibility

- Pile chips are buttons.
- The bucket title is a heading.
- The note updates as text.
- Focus ring is 2px #1f4d3a, offset 3px.
- A chip in the bucket is not a tab stop.
- Keyboard users need a way in. Enter on a focused pile chip drops it into the bucket, the same as a hit.

## Responsive rules

- The board is 640px at 1280.
- Below 700 the pile stacks above the bucket.
- Chips stay 40px tall.

## Acceptance checklist

### Always

- [ ] A miss returns the chip.
- [ ] A hit keeps it in the bucket.
- [ ] The note names the last hit.
- [ ] Three names.
- [ ] Nothing is sent.

### This demo

- [ ] Chips are Gate 4, Night book, Hold list.
- [ ] The bucket title is Night bucket.
- [ ] The resting note is Drag a chip into the bucket.
- [ ] A hit says the name is in the night bucket.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Hit-test the two boxes.

```js
const hit = a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
```

Clear the transform before hiding, so a later show is not offset.

## Measurements to keep

- Board 640px. Bucket 220 by at least 240.
- Chip height 40px.
- Bucket radius 8px on top, 16px on the bottom.
- Note 14px, margin-top 12px.
- Inside chip fill #2a2926.

## Wrong turns

- Do not delete a chip that missed.
- Do not animate a physics bounce.
- Do not send the names.
- Do not start with chips already inside.
- Do not use a file drop.
- Do not make the bucket a link.

## Fit with the rest of the library

- Tokens are `token-field`.
- A confirm drag is `drag-to-confirm`.
- This is a bucket.
- One bucket.
- Type is IBM Plex Sans.
- The ground is #f6f4ef.

## Keyboard

- Enter on a pile chip counts as a hit.
- Drag is the pointer path.
- The bucket chips are not tab stops.
- Do not use a positive tabindex.
- Focus offset is 3px.
- A miss does not change the note.
- Three pile chips at the start.
- The note is not a live region. It is text under the board.
- Type is IBM Plex Sans.
- Escape does not cancel a drag. Pointer up does.
- Hidden pile chips use the hidden attribute.
- Nothing is fetched.
- The bucket heading stays.
- Pointer capture is on the chip.
- Do not trap focus.
- A second chip can follow the first.

## Pass

- Measure the first frame before changing a number.
- Keep the names in this brief.
- Keep the duration written above.
- Honour reduced motion.
- Do not add a second accent.
- Do not add a second type family.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
