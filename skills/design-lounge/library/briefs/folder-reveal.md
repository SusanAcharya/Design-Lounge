<!-- Design Lounge Nº 207 · "Folder reveal" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Folder reveal

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

## What it is

A folder of yard notes. It starts open: Hold list, Night book, and Month close sit in a fan. The folder tab reads Yard notes · 3 cards. Clicking the folder closes the fan flat and opens it again. The move is 420ms. Reduced motion shows the open or closed pose with no transition. This is not a 3D flip. That flip is `card-flip-3d`. This is not a content card grid. A card is `content-card`.

## Reference behaviour

1. The first frame is open. aria-expanded is true.
2. The three cards are Hold list, Night book, and Month close.
3. Open poses: left card translate -36px -8px rotate -7deg, middle translate 0 -28px, right translate 36px -8px rotate 7deg.
4. Closed pose: the cards share one stacked position.
5. Clicking the folder toggles data-open and aria-expanded.
6. The cards are articles. Only the folder is a button.
7. Nothing is deleted when the folder closes.

## Structure

```
560×420 stage
fan of 3 cards
[ folder tab + body ]
```

- Stage 560×420.
- Cards are absolute, height 180px, top 40px.
- Folder is absolute, bottom 36px, height 150px, fill #e7d7b6.
- The tab is a ::before, 140×24, top -22px, fill #f3e6c8.
- Titles are Fraunces 22px.

## Tokens

```css
:root {
  --bg:#f4f1ea; --surface:#fffdf8; --ink:#1a1814; --ink-2:#5c564c;
  --line:#e3ddd2; --folder:#e7d7b6; --tab:#f3e6c8; --primary:#1f4d3a;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Card title | Fraunces | 22px | 560 | 1.15 | 0 |
| Card body | Public Sans | 14px | 400 | 1.4 | 0 |
| Folder | Public Sans | 14px | 500 | 1 | 0 |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Fan | click folder | stacked | rotated poses | 420ms cubic-bezier(0.16,1,0.3,1) | no transition |

## States

- Open: data-open true, cards in the fan, aria-expanded true.
- Closed: data-open false, cards stacked, aria-expanded false.
- Hover does not move the cards. Only the toggle does.
- Focus stays on the folder button.

## Accessibility

- The folder button has aria-expanded.
- Card text is in the page, not only inside a graphic.
- The decorative tab is a pseudo-element.
- Reduced motion removes the transition.
- Focus ring is 2px #1f4d3a, offset 3px.
- The button name includes the count: Yard notes · 3 cards.

## Responsive rules

- The stage is 560px at 1280.
- Below 600 the stage is calc(100% - 32px) and the fan translation drops to 16px so cards stay inside.
- Do not switch to a vertical list. The fan is the piece.

## Acceptance checklist

### Always

- [ ] Starts open.
- [ ] One button toggles the fan.
- [ ] Three cards, each with a title and one sentence.
- [ ] 420ms ease, or none under reduced motion.
- [ ] aria-expanded matches the pose.

### This demo

- [ ] Cards are Hold list, Night book, Month close.
- [ ] Hold list says twelve loads still at Gate 4.
- [ ] Night book closes at 22:00.
- [ ] Folder fill is #e7d7b6.
- [ ] Display is Fraunces. Text is Public Sans.

## Implementation notes

Drive the fan from a data attribute on the stage, not from three class toggles.

```css
.stage[data-open="true"] .c1 { transform: translate(0,-28px); }
```

Do not use a 3D perspective. The rotate is a small 2D fan.

## Measurements to keep

- Stage 560×420. Cards height 180px, padding 16px 18px.
- Open offsets ±36px and -28px. Rotations ±7deg.
- Transition 420ms, cubic-bezier(0.16, 1, 0.3, 1).
- Folder height 150px, bottom 36px, left and right 40px.
- Tab 140×24, top -22px.

## Wrong turns

- Do not start closed. The fan is the first frame.
- Do not add a fourth card.
- Do not flip the cards on their backs.
- Do not use a drop shadow as the only depth.
- Do not make each card a link.
- Do not animate in a loop.

## Fit with the rest of the library

- A flipping card is `card-flip-3d`.
- A static card is `content-card`.
- A stacking scroll is `stacking-cards-scroll`.
- This folder is a reveal, not a file browser.
- Do not pair it with a gooey menu on the same view.
- The ground is #f4f1ea.

## Keyboard

- Enter toggles the folder.
- Space toggles the folder.
- The cards are not tab stops.
- aria-expanded flips with the pose.
- Escape does not close the folder.
- Do not use a positive tabindex.
- Focus remains on the folder.
- Reduced motion removes the 420ms transition.
- The first frame is open.
- Three titles stay readable when stacked.
- The tab is not a separate button.
- Do not trap focus.
- The count in the name is 3.
- Display type is Fraunces.
- Text type is Public Sans.
- The folder fill stays #e7d7b6.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
