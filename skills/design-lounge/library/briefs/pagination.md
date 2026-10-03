<!-- Design Lounge Nº 300 · "Pagination" · designlounge.vercel.app -->

# Pagination

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the current page uses `--primary-soft` and the control height follows the family. Do not draw a second radius on the page buttons.

## What it is

The control under a long list. Forty-eight rows, ten per page, five pages. The demo starts on page 2 so Previous is alive and the current page is not the first. The count reads "11–20 of 48". The current page sits on the soft green. Previous and Next are words, not icons alone. This list does not render the rows. `dense-data-table` and `people-role-list` are the rows. People-role-list is short and has no pages. Add this piece when the list is longer than one screen.

## Reference behaviour

1. Page 2 has `aria-current="page"`. The count is 11–20 of 48. Previous and Next are enabled.
2. Clicking a number goes to that page. The count becomes the matching slice: page 1 is 1–10, page 5 is 41–48.
3. Next adds one page. Previous subtracts one.
4. On page 1, Previous is disabled. On page 5, Next is disabled.
5. There is no animation. The count changes in one frame.
6. Focus ring is 2px `--focus`, offset 2px.

## Structure

```
padding 48px 64px
11–20 of 48                  14px
[ Previous ] [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] [ Next ]
each control min 40px, height 40
```

- `nav` with `aria-label="Pages"`.
- Number buttons carry `data-page`. The current one carries `aria-current="page"`.
- Previous and Next are buttons, not links, in this demo.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --primary-soft: #e7f2ec;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Radius is 2px in this yard demo. The family replaces it. The current page is `--primary-soft`, the same selected treatment as a row. It is not a solid primary button.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Count | sans | 14px | 400 | `--ink-2` |
| Page | sans | 13px | 500 | `--ink` |

The count uses tabular numbers and an en dash between the start and the end. Letter-spacing on the buttons is 0.

## Motion

None. Reduced motion has nothing to remove. Do not slide the row of numbers.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Number | click | current page, count line |
| Previous, Next | click | one page toward the end or the start |
| Ends | page 1 or 5 | the matching button disabled |

## States

- Page resting: min-width 40px, height 40px, padding 0 12px, transparent, radius 2px.
- Page hover: background `--surface`.
- Page current: background `--primary-soft`. No border.
- Previous and Next: same height, horizontal padding 12px, words visible.
- Disabled: opacity 0.4, `disabled`, not clickable.
- Focus-visible: 2px outline, offset 2px.
- Do not put the current page in `--primary` with light text. Selected is the soft fill.

## Accessibility

- The nav label is Pages.
- `aria-current="page"` marks the current number. Remove it from the others.
- Previous and Next have visible names. Do not use a chevron as the only name.
- Disabled buttons leave the tab order.
- Hit target: 40px. On a phone, at least 44px.
- Contrast: `#161513` on `#e7f2ec` and on the paper clears 4.5.
- The count is text, not only a visual highlight, so the range is available without seeing which square is green.

## Responsive rules

- At 1280 the row is one line, padding 48px 64px.
- Below 640, keep Previous, the current page, and Next. Hide the far numbers if they do not fit, but do not hide the count. This demo's five pages fit at 360 if the gap stays 4px. If you drop numbers, keep the current one.
- Do not switch to an infinite scroll without saying so. This piece is pages.

## Acceptance checklist

- [ ] The first frame is page 2 and the count is 11–20 of 48.
- [ ] Page 2 has `aria-current="page"` and background `#e7f2ec`.
- [ ] Clicking 5 sets the count to 41–48 and disables Next.
- [ ] Clicking 1 sets the count to 1–10 and disables Previous.
- [ ] Next and Previous move one page.
- [ ] There are five page numbers, for 48 rows at 10 per page.
- [ ] Controls are 40px tall, radius 2px.
- [ ] The current page is not a solid primary.
- [ ] Focus ring is 2px, offset 2px.
- [ ] There is no animation.

## Implementation notes

Derive the count from the page. Do not store five strings.

```js
const start = (page - 1) * 10 + 1;
const end = Math.min(page * 10, total);
count.textContent = start + '–' + end + ' of ' + total;
```

The dash is an en dash.

Common mistakes:

- A current page painted as a solid primary button, so it looks like the one commit action.
- Icon-only Previous and Next.
- Page 1 of 1 on a short list. `people-role-list` has no pagination. Do not add it.
- Ellipses that hide every page including the current one.
- Loading the next page in a toast.
- A radius that ignores the family.
- Infinite scroll with no count, on a list the person must audit.
- Mixing this with a filter and forgetting to reset to page 1 when the filter changes. `filter-toolbar` is the filter. When both are on a screen, a new filter returns to page 1.

Where it sits in a product:

1. Place it under the list, or above it with the count. This demo is the control alone.
2. Ten rows is this demo's page size. A dense table may use twenty. Say the number in the count.
3. The last page may be short. Page 5 is 41–48, not 41–50.
4. Selected is `--primary-soft`.
5. The family wins the radius and the height.
6. When a theme is locked, the soft fill is that theme's `--primary-soft`.
7. Do not paginate a conversation. `chat-thread` grows by the messages you have.
8. Do not paginate three radios.
9. The count is the proof. A highlight without a range is not enough.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the count and the nav.
3. Start on page 2.
4. Wire numbers, Previous, and Next.
5. Disable the ends.
6. Check page 5 ends at 48.
7. Map the current fill onto `--primary-soft` when a kit is on.

Copy you keep:

1. Previous. Next.
2. Pages 1 through 5.
3. The count pattern: start–end of 48.
4. Ten rows a page. Forty-eight rows.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
