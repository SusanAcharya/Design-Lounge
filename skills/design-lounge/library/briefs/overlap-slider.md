<!-- Design Lounge Nº 298 · "Overlap slider" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Overlap slider

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Five portrait cards in a row: Gate 1, Gate 2, Gate 4, Night, Month. Gate 4 starts as the forward card, so the two on its left are scale .82 and 18px down. Moving to a card scales every card to its left. This is not a coverflow. That strip is `coverflow-strip`. This is not a tilt. That tilt is `hover-tilt-cards`.

## Reference behaviour

1. data-i starts at 2, Gate 4.
2. Cards with an index lower than data-i scale to .82 and translateY 18px.
3. The card at data-i and the cards to its right stay full size.
4. Pointer enter sets data-i.
5. Focus sets data-i.
6. The scale origin is center bottom.
7. The move is 280ms. Reduced motion snaps.

## Structure

```
row of 5 cards, 180×320
left cards smaller when a later card is current
```

- The row is flex, gap 12px, height 420px, align flex-end.
- Each card is 180 by 320, padding 16px, radius 2px.
- The name is 18px at the bottom. The caption is #a39b90.
- Fills are #24362e, #2a2926, #3a342c, #1f4d3a, #4a3b22.
- Text is #f4f1ea.

## Tokens

```css
:root { --bg:#141311; --ink:#f4f1ea; --ink-2:#a39b90; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Name | IBM Plex Sans | 18px | 600 |
| Caption | IBM Plex Sans | 14px | 500 |

## Motion

- Left cards | pointer or focus | scale 1 | scale .82 translateY 18px | 280ms cubic-bezier(0.16,1,0.3,1). Reduced motion snaps.

## States

- Index 2 at rest: Gate 1 and Gate 2 are back.
- A later index: more cards sit back.
- Index 0: all cards full.
- Focus matches pointer.

## Accessibility

- Each card is a button.
- Names and captions are text.
- Focus sets the same index as pointer.
- Focus ring is 2px #d7b15e, offset 3px.
- Reduced motion still changes the scale. It skips the transition.
- Do not autoplay.

## Responsive rules

- Five cards of 180px fit at 1280 with the gap.
- Below 980 the card width becomes 22vw and the row can scroll on the x axis. The scale rule stays.
- Do not stack them in a column. The left-to-right scale is the piece.

## Acceptance checklist

### Always

- [ ] Cards to the left scale back.
- [ ] Cards at the index and to the right stay full.
- [ ] Gate 4 starts forward.
- [ ] No autoplay.
- [ ] 280ms or none.

### This demo

- [ ] Names are Gate 1, Gate 2, Gate 4, Night, Month.
- [ ] Captions are Clear, Due, Held, 22:00, Close.
- [ ] Start index is 2.
- [ ] Scale is .82. Drop is 18px.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Drive every card from one data-i on the row.

```js
row.dataset.i = c.dataset.i;
```

Do not scale the current card.

## Measurements to keep

- Card 180×320. Gap 12px. Row height 420px.
- Scale .82. TranslateY 18px. Origin center bottom.
- Transition 280ms.
- Name 18px. Padding 16px.
- Start index 2.

## Wrong turns

- Do not coverflow-rotate them.
- Do not autoplay.
- Do not scale the current card down.
- Do not use photographs of people.
- Do not loop.
- Do not tilt on a second axis.

## Fit with the rest of the library

- A coverflow is `coverflow-strip`.
- A tilt is `hover-tilt-cards`.
- This is the left-hand scale.
- Five cards.
- Type is IBM Plex Sans.
- The ground is near-black.

## Keyboard

- Focus sets data-i.
- Tab order is left to right.
- Do not use a positive tabindex.
- No autoplay.
- Reduced motion snaps.
- Focus ring is #d7b15e.
- Start index is 2.
- Scale is .82.
- Cards to the right stay full.
- Type is IBM Plex Sans.
- Escape does nothing.
- Five buttons.
- Captions stay in the button.
- Do not trap focus.
- Origin is the bottom.
- Index 0 leaves every card full.

## Pass

- Measure the first frame before changing a number.
- Keep the names in this brief.
- Keep the duration written above.
- Honour reduced motion.
- Do not add a second accent.
- Do not add a second type family.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
