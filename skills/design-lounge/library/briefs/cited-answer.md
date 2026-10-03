<!-- Design Lounge Nº 188 · "Cited answer" · designlounge.vercel.app -->

# Cited answer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A card states that twelve loads are still at Gate 4. Two source chips sit under the paragraph. Night book starts pressed and its quote is on the card. Hold rule replaces the quote. The answer does not change. This is not a chat. A step trace is `agent-step-trace`. A long article is `paper-article-reader`.

## Reference behaviour

1. The heading is Twelve loads are still at Gate 4.
2. Night book is aria-pressed true. The quote is Night book, 22:00 entry. Gate 4 still holds twelve.
3. Hold rule is not pressed. Its quote is Hold rule. Older than six hours, a person must sign.
4. Clicking a chip presses only that chip and sets the quote from data-q.
5. The pressed chip is fill #e7f2ec, border and text #1f4d3a.
6. The heading and the paragraph do not change.
7. There is no motion.

## Structure

```
680px card
heading
paragraph
[ Night book ] [ Hold rule ]
quote
```

- Card 680px, padding 32px, radius 2px, fill #fffdf8, border #e3ddd2.
- Heading Fraunces 28px.
- Chips are 36px, radius 999px, gap 8px, margin-top 20px.
- The quote is 16px, colour #5c564c, min-height 44px, margin-top 14px.
- The source row is role group, name Sources.

## Tokens

```css
:root { --bg:#f4f1ea; --surface:#fffdf8; --ink:#1a1814; --ink-2:#5c564c; --line:#e3ddd2; --primary:#1f4d3a; --soft:#e7f2ec; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Heading | Fraunces | 28px | 560 |
| Body | Public Sans | 16px | 400 |
| Chip | Public Sans | 13px | 500 |

## Motion

- Quote | click | previous line | next line | none | the line swaps

## States

- Night book pressed: first quote.
- Hold rule pressed: second quote.
- Only one chip is pressed.
- The answer heading stays.

## Accessibility

- The chips are buttons with aria-pressed.
- The group is named Sources.
- The quote is text, not only colour.
- Focus ring is 2px #1f4d3a, offset 3px.
- The heading is a real heading.
- Do not invent a third source.

## Responsive rules

- The card is 680px at 1280.
- Below 720 the card is calc(100% - 32px).
- The chips wrap if the row is narrow.

## Acceptance checklist

### Always

- [ ] The answer stays. The quote changes.
- [ ] One pressed source.
- [ ] Quotes come from the chip data.
- [ ] Two sources in this demo.
- [ ] No chat input.

### This demo

- [ ] The heading names twelve loads at Gate 4.
- [ ] Night book starts pressed.
- [ ] The Hold rule quote names six hours and a signature.
- [ ] Pressed fill is #e7f2ec.
- [ ] Display is Fraunces. Text is Public Sans.

## Implementation notes

Store the quote on the button.

```js
q.textContent = b.dataset.q;
```

Clear aria-pressed on the other chip first.

## Measurements to keep

- Card 680px, padding 32px, radius 2px.
- Heading 28px, margin-bottom 12px.
- Chip height 36px, gap 8px, margin-top 20px.
- Quote min-height 44px, margin-top 14px.
- Pressed fill #e7f2ec. Border #1f4d3a.

## Wrong turns

- Do not add a chat box.
- Do not change the heading when the source changes.
- Do not fetch a model.
- Do not leave both chips pressed.
- Do not hide the quote.
- Do not add a third source in this demo.

## Fit with the rest of the library

- A long read is `paper-article-reader`.
- A tool trace is `agent-step-trace`.
- This is one answer and two sources.
- Do not add a composer.
- Display is Fraunces.
- The ground is paper.

## Keyboard

- Enter presses the focused chip.
- aria-pressed moves.
- Tab order is Night book, then Hold rule.
- The quote is not a tab stop.
- Do not use a positive tabindex.
- The group name is Sources.
- Focus offset is 3px.
- The heading does not change.
- Two chips.
- No input.
- Display type is Fraunces.
- Text type is Public Sans.
- Escape does nothing.
- Night book starts pressed.
- The quote matches data-q.
- Do not trap focus.

## Rebuild order

1. Build step: The heading is Twelve loads are still at Gate 4.
2. Build step: Night book is aria-pressed true. The quote is Night book, 22:00 entry. Gate 4 still holds twelve.
3. Build step: Hold rule is not pressed. Its quote is Hold rule. Older than six hours, a person must sign.
4. Build step: Clicking a chip presses only that chip and sets the quote from data-q.
5. Build step: The pressed chip is fill #e7f2ec, border and text #1f4d3a.
6. Build step: The heading and the paragraph do not change.
7. Build step: There is no motion.

- Keep this measurement while rebuilding: Card 680px, padding 32px, radius 2px.
- Keep this measurement while rebuilding: Heading 28px, margin-bottom 12px.
- Keep this measurement while rebuilding: Chip height 36px, gap 8px, margin-top 20px.
- Keep this measurement while rebuilding: Quote min-height 44px, margin-top 14px.
- Keep this measurement while rebuilding: Pressed fill #e7f2ec. Border #1f4d3a.

- While rebuilding, remember: Do not add a chat box.
- While rebuilding, remember: Do not change the heading when the source changes.
- While rebuilding, remember: Do not fetch a model.
- While rebuilding, remember: Do not leave both chips pressed.
- While rebuilding, remember: Do not hide the quote.
- While rebuilding, remember: Do not add a third source in this demo.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
