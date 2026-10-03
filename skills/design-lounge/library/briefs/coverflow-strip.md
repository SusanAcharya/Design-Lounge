<!-- Design Lounge Nº 184 · "Coverflow strip" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Coverflow strip

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A coverflow of five yard loads on a dark ground. The center card is forward. Cards to the side shift 180px, drop back, and rotate. Previous and Next step the index. Clicking a card centers it. This is not a quote carousel. That carousel is `testimonials-quote-carousel`. This is not a tilt on hover. That tilt is `hover-tilt-cards`.

## Reference behaviour

1. The first center card is load 20, Clear · Gate 2. Index starts at 2.
2. Side cards translate 180px per step, rotateY by -18deg per step, and sit back in Z.
3. Cards more than two steps away are opacity 0.
4. Previous and Next disable at the ends.
5. Clicking a card sets it as center.
6. The center card has aria-current true.
7. The move is 420ms. Reduced motion snaps.

## Structure

```
980×360 stage
[card] [CARD] [card]
Previous  Next
```

- Stage 980 by 360, perspective 900px.
- Each card is 220 by 280, centered with margin-left -110px.
- The number is 28px.
- The caption is 14px in #a39b90.
- Buttons are 40px.

## Tokens

```css
:root { --bg:#141311; --card:#1c1b19; --ink:#f4f1ea; --ink-2:#a39b90; --primary:#d7b15e; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Number | IBM Plex Sans | 28px | 600 |
| Caption | IBM Plex Sans | 14px | 500 |
| Button | IBM Plex Sans | 14px | 500 |

## Motion

- Cards | index change | old transform | new transform | 420ms cubic-bezier(0.16,1,0.3,1). Reduced motion snaps.

## States

- Center: aria-current true, z-index highest.
- Side: dimmed by distance, still clickable if opacity is 1.
- End: one arrow disabled.
- Far cards: opacity 0 but still in the tree.

## Accessibility

- Each card is a button.
- The center exposes aria-current.
- Arrows are buttons and disable at ends.
- Do not autoplay.
- Focus ring is 2px #d7b15e, offset 3px.
- The caption is text inside the button.

## Responsive rules

- The stage is 980px at 1280.
- Below 800 the step drops from 180px toward 120px so side cards stay in frame.
- Do not stack the cards in a column. The strip is the piece.

## Acceptance checklist

### Always

- [ ] One center card.
- [ ] Ends disable the matching arrow.
- [ ] Clicking a card centers it.
- [ ] No autoplay.
- [ ] Distance changes x, rotateY, and z.

### This demo

- [ ] Loads are 18, 19, 20, 21, 22.
- [ ] 20 starts in the center.
- [ ] Captions name Held, Clear, or Due and a gate.
- [ ] Ground is #141311. Card is #1c1b19.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Translate from the center, not from a flex row, so the math stays one index.

```js
const x = (n - i) * 180;
```

Do not loop from the last card to the first.

## Measurements to keep

- Stage 980×360. Card 220×280.
- Step 180px. Rotate -18deg per step. Z 40 at center, -80 aside.
- Transition 420ms.
- Number 28px. Caption 14px.
- Arrow height 40px.

## Wrong turns

- Do not autoplay.
- Do not loop.
- Do not hide the arrows.
- Do not use photographs of real people.
- Do not add a scrollbar.
- Do not rotate on hover as well as on index.

## Fit with the rest of the library

- A quote carousel is `testimonials-quote-carousel`.
- Hover tilt is `hover-tilt-cards`.
- A polaroid fan is `polaroid-fan`.
- This strip has one center.
- Ground is near-black.
- Type is IBM Plex Sans.

## Keyboard

- Enter on Next steps forward.
- Enter on Previous steps back.
- Enter on a card centers it.
- Disabled arrows do nothing.
- Tab moves through cards and arrows.
- aria-current marks the center.
- Do not use a positive tabindex.
- No autoplay timer.
- Focus ring is #d7b15e.
- Reduced motion snaps.
- There are 5 cards.
- Index starts at 2.
- Opacity 0 cards can still be in tab order. Disable them if they are fully gone, or keep them if a product wants them reachable.
- The stage is not a slider role. The buttons are the controls.
- Type is IBM Plex Sans.
- Do not trap focus.

## Rebuild order

1. Build step: The first center card is load 20, Clear · Gate 2. Index starts at 2.
2. Build step: Side cards translate 180px per step, rotateY by -18deg per step, and sit back in Z.
3. Build step: Cards more than two steps away are opacity 0.
4. Build step: Previous and Next disable at the ends.
5. Build step: Clicking a card sets it as center.
6. Build step: The center card has aria-current true.
7. Build step: The move is 420ms. Reduced motion snaps.

- Keep this measurement while rebuilding: Stage 980×360. Card 220×280.
- Keep this measurement while rebuilding: Step 180px. Rotate -18deg per step. Z 40 at center, -80 aside.
- Keep this measurement while rebuilding: Transition 420ms.
- Keep this measurement while rebuilding: Number 28px. Caption 14px.
- Keep this measurement while rebuilding: Arrow height 40px.

- While rebuilding, remember: Do not autoplay.
- While rebuilding, remember: Do not loop.
- While rebuilding, remember: Do not hide the arrows.
- While rebuilding, remember: Do not use photographs of real people.
- While rebuilding, remember: Do not add a scrollbar.
- While rebuilding, remember: Do not rotate on hover as well as on index.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
