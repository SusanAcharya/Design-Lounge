<!-- Design Lounge Nº 300 · "Spring deck" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Spring deck

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Three cards. Night book and Month close sit turned underneath. Gate 4 is in front. Drag Gate 4 and it follows. Release clears the transform and it springs back over 420ms. It does not dismiss. This is not a scroll stack. That stack is `stacking-cards-scroll`. This is not a flip. That flip is `card-flip-3d`.

## Reference behaviour

1. Gate 4 is on top. The line says to drag it and that it returns.
2. Pointer down adds a drag class that turns the transition off.
3. Pointer move sets translate and rotate -2deg, unless motion is reduced.
4. Pointer up and pointer cancel remove the drag class and clear the transform.
5. The return is 420ms.
6. The cards underneath do not move.
7. Reduced motion does not follow the pointer. Release still clears.

## Structure

```
320×240 pile
Night book, turned
Month close, turned
Gate 4, front
```

- The deck is 320 by 240.
- Each card is inset 0, padding 24px, fill #fffdf8, radius 2px.
- Night book is rotate -3deg, translate -8px 6px.
- Month close is rotate 2deg, translate 8px 4px.
- The front card is z-index 2 and tabbable, role group.

## Tokens

```css
:root { --bg:#f4f1ea; --card:#fffdf8; --ink:#1a1814; --ink-2:#5c564c; --line:#e3ddd2; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Title | Fraunces | 28px | 560 |
| Body | Public Sans | 16px | 400 |

## Motion

- Front card | release | dragged transform | identity | 420ms cubic-bezier(0.16,1,0.3,1). Reduced motion does not follow the drag.

## States

- Rest: Gate 4 squared on top.
- Drag: transition none, card under the pointer.
- Release: spring back.
- Under cards: static.

## Accessibility

- The front card is a group named Gate 4. Drag and it springs back.
- The other titles are in articles behind it.
- Reduced motion does not drag the card off its place.
- Focus ring is 2px #1f4d3a, offset 3px.
- Do not hide the front title.
- Arrow keys do not move it. The pointer does.

## Responsive rules

- The deck is 320 by 240 and centered.
- Below 360 the deck is calc(100% - 32px) and the height grows with the text.
- The under cards keep their small rotation.

## Acceptance checklist

### Always

- [ ] Release springs back.
- [ ] The card is not dismissed.
- [ ] Three titles.
- [ ] Under cards stay put.
- [ ] 420ms or none.

### This demo

- [ ] Front title is Gate 4.
- [ ] Behind are Night book and Month close.
- [ ] The return is 420ms.
- [ ] Drag rotate is -2deg.
- [ ] Display is Fraunces. Text is Public Sans.

## Implementation notes

Drop the transition while dragging so the card sticks to the pointer.

```js
front.classList.add("drag");
front.style.transform = "";
```

Clear the transform on pointer up so the CSS transition can run back to identity.

## Measurements to keep

- Deck 320×240. Card padding 24px.
- Under left: rotate -3deg, translate -8px 6px.
- Under right: rotate 2deg, translate 8px 4px.
- Return 420ms. Drag rotate -2deg.
- Title 28px Fraunces.

## Wrong turns

- Do not throw the card away.
- Do not cycle a new card to the front.
- Do not flip it.
- Do not drag the under cards.
- Do not follow the pointer when motion is reduced.
- Do not add a fourth card in this demo.

## Fit with the rest of the library

- A scroll stack is `stacking-cards-scroll`.
- A flip is `card-flip-3d`.
- This deck springs back.
- Three cards.
- Display is Fraunces.
- The ground is paper.

## Keyboard

- The front card is one tab stop.
- The pointer drags it.
- Reduced motion does not translate it.
- Do not use a positive tabindex.
- Release returns it.
- Focus offset is 3px.
- Arrow keys do nothing.
- Escape does nothing.
- Three titles.
- Display type is Fraunces.
- Text type is Public Sans.
- The under cards are not buttons.
- Pointer cancel also returns.
- The return is 420ms.
- Do not trap focus.
- The front name is Gate 4.

## Pass

- Measure the first frame before changing a number.
- Keep the names in this brief.
- Keep the duration written above.
- Honour reduced motion.
- Do not add a second accent.
- Do not add a second type family.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
