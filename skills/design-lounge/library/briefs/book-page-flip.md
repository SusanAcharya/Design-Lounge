<!-- Design Lounge Nº 174 · "Book page flip" · designlounge.vercel.app -->

# Book page flip

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A short ledger for Hollis. One page shows at a time. Next page rotates the sheet on its left edge, then the next note is there. Previous goes back. This is not a curtain between routes. That curtain is `page-transition-curtain`. This is not a long article. A reader is `paper-article-reader`. Three notes, a turn, a count.

## Reference behaviour

1. The first page is Gate 4. The count is 1 of 3. Previous is disabled.
2. Next page plays a 640ms rotateY from 0 to -180, origin left center.
3. Halfway, the title and sentence swap to the next note.
4. Page 2 is Night book. Page 3 is Month close. Next is disabled on page 3.
5. Previous walks back and enables Next.
6. Reduced motion swaps the text with no rotation.
7. A turn in progress ignores another click.

## Structure

```
640×400 page, centered
[ title ]
[ sentence ]
Previous    1 of 3    Next page
```

- The sheet is 640 by 400, padding 36px 40px, radius 2px 8px 8px 2px.
- The turn origin is the left edge.
- The nav sits 56px under the book.
- Buttons are 40px.
- The count is 13px.

## Tokens

```css
:root { --bg:#f4f1ea; --paper:#fffdf8; --ink:#1a1814; --ink-2:#5c564c; --line:#e3ddd2; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Title | Fraunces | 36px | 560 |
| Body | Public Sans | 16px | 400 |
| Count | Public Sans | 13px | 400 |

## Motion

- Page | Next or Previous | rotateY 0 | rotateY -180deg | 640ms cubic-bezier(0.16,1,0.3,1). Reduced motion swaps text.

## States

- First page: Previous disabled.
- Last page: Next disabled.
- Mid-turn: clicks ignored.
- Rest: one note visible.

## Accessibility

- Next and Previous are buttons.
- The count is text.
- Disabled buttons stay in the tab order at opacity .4.
- Reduced motion still changes the note.
- Focus ring is 2px #1f4d3a, offset 3px.
- The page is an article.

## Responsive rules

- At 1280 the book is 640px.
- Below 700 the book is calc(100% - 32px) and the title drops to 28px.
- Do not show two pages side by side in this piece.

## Acceptance checklist

### Always

- [ ] One note visible.
- [ ] Turn originates on the left edge.
- [ ] The count matches the index.
- [ ] Ends disable the matching button.
- [ ] Reduced motion still changes the page.

### This demo

- [ ] Notes are Gate 4, Night book, Month close.
- [ ] The count starts at 1 of 3.
- [ ] Month close names Rs 18,42,000.
- [ ] Display is Fraunces. Text is Public Sans.
- [ ] Ground is #f4f1ea.

## Implementation notes

Swap the text at half the duration, while the page is edge-on.

```js
setTimeout(() => { i = n; paint(); page.classList.remove("turn"); }, 320);
```

Do not fetch pages. Three strings are enough.

## Measurements to keep

- Book 640×400. Padding 36px 40px.
- Turn 640ms. Swap at 320ms.
- Nav bottom -56px. Buttons 40px.
- Title 36px. Body max-width 36ch.
- Radius 2px on the left, 8px on the right.

## Wrong turns

- Do not loop the pages.
- Do not show a spread of two pages.
- Do not use a 3D texture.
- Do not leave both buttons enabled on an end page.
- Do not animate under reduced motion.
- Do not add a fourth note in this demo.

## Fit with the rest of the library

- A route curtain is `page-transition-curtain`.
- A long read is `paper-article-reader`.
- This is one ledger.
- Do not combine it with a coverflow.
- The ground is paper.
- Titles use Fraunces.

## Keyboard

- Enter on Next turns forward.
- Enter on Previous turns back.
- Disabled buttons do not turn.
- Tab order is Previous, then Next.
- The article is not a tab stop.
- A busy turn ignores keys on the buttons because the click is ignored.
- Do not trap focus.
- The count is not a live region. The title change is the change.
- Focus offset is 3px.
- Reduced motion has no timer.
- There are 3 pages.
- Home and End are unused.
- Do not use a positive tabindex.
- The left edge is the hinge.
- Display type is Fraunces.
- Text type is Public Sans.

## Rebuild order

1. Build step: The first page is Gate 4. The count is 1 of 3. Previous is disabled.
2. Build step: Next page plays a 640ms rotateY from 0 to -180, origin left center.
3. Build step: Halfway, the title and sentence swap to the next note.
4. Build step: Page 2 is Night book. Page 3 is Month close. Next is disabled on page 3.
5. Build step: Previous walks back and enables Next.
6. Build step: Reduced motion swaps the text with no rotation.
7. Build step: A turn in progress ignores another click.

- Keep this measurement while rebuilding: Book 640×400. Padding 36px 40px.
- Keep this measurement while rebuilding: Turn 640ms. Swap at 320ms.
- Keep this measurement while rebuilding: Nav bottom -56px. Buttons 40px.
- Keep this measurement while rebuilding: Title 36px. Body max-width 36ch.
- Keep this measurement while rebuilding: Radius 2px on the left, 8px on the right.

- While rebuilding, remember: Do not loop the pages.
- While rebuilding, remember: Do not show a spread of two pages.
- While rebuilding, remember: Do not use a 3D texture.
- While rebuilding, remember: Do not leave both buttons enabled on an end page.
- While rebuilding, remember: Do not animate under reduced motion.
- While rebuilding, remember: Do not add a fourth note in this demo.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
