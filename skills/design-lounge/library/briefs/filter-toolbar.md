<!-- Design Lounge Nº 247 · "Filter toolbar" · www.designlounge.live -->

# Filter toolbar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the field and the chips use `--control` and `--radius`. A chip is a pill only when the family's button is already a pill.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The bar above a list, 720px wide, the pass column. A search field, then All, Out, In, and Held. All starts pressed, on `--primary-soft`. The list has four loads: Rice Out, Oil Held, Tea In, Salt Out. The count at the right reads "4 loads". Typing matches the name. A chip shows one kind. When nothing matches, the list hides those rows and the line "No loads match." appears. This is not the search results page. That page is `search-results-filters`. This is the bar you put on a table you already have.

## Structure

```
padding 48px 64px
bar, width 720, height of the controls 40, gap 8
  [ Find a load ] [ All ] [ Out ] [ In ] [ Held ]     4 loads
list, width 720
  Rice    Out
  Oil     Held
  Tea     In
  Salt    Out
No loads match.              hidden until zero
```

- The search input has `type="search"` and `aria-label="Find a load"`.
- Chips are buttons with `aria-pressed`.
- Rows are `li` elements. Hide a row with the `hidden` attribute.
- The empty line is a paragraph, hidden while any row shows.

## Motion

None. Rows hide in one frame. Reduced motion has nothing to remove. Do not fade the list.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Chip | click | pressed state, visible rows, count |
| Search | input | rows whose name contains the query |
| Zero | both filters | the empty sentence |

## States

- Field: width 220px, height 40px, padding 0 12px, radius 2px, 1px `--line-strong`, surface fill.
- Chip resting: height 40px, padding 0 14px, 1px `--line-strong`, transparent.
- Chip pressed: background `--primary-soft`, border transparent, `aria-pressed="true"`.
- Count: margin-left auto, `--ink-2`.
- Row: min-height 56px, padding 0 16px, 1px `--line` between rows.
- Empty: 14px, shown only at zero. It is not an illustration. The illustrated empty is a different piece.
- Focus-visible: 2px outline, offset 2px.
- Hover on a chip may use `--surface-2`. Pressed wins over hover. Do not turn the pressed chip into a solid primary.

## Accessibility

- The search has an accessible name, Find a load.
- Pressed state is `aria-pressed`, not a colour alone.
- Hidden rows use the `hidden` attribute so they leave the accessibility tree.
- The empty sentence is in the page, not a toast.
- Hit targets: field and chips are 40px. On a phone they are at least 44px.
- Contrast: `#161513` on `#e7f2ec` clears 4.5.
- The count is text. Do not rely on the highlight alone to say which filter is on. The pressed button's name is the filter.

## Responsive rules

- At 1280 the bar and the list are 720px, the pass column, padding 48px 64px.
- At 768 the bar wraps. The count stays with the chips, not over the field.
- Below 640 the field is full width. Chips wrap under it. Rows stay 56px. Do not switch to a different chip shape.
- Another screen in the same pass uses this same 720px column. Do not keep a 640px list beside it.

## Acceptance checklist

- [ ] The bar is 720px. The list is 720px.
- [ ] All starts pressed. The count is 4 loads.
- [ ] Out shows Rice and Salt. In shows Tea. Held shows Oil.
- [ ] Search "ri" shows Rice. It combines with the chip.
- [ ] A match of zero shows "No loads match." and the count is 0 loads.
- [ ] Field and chips are 40px tall, radius 2px.
- [ ] The pressed chip is `#e7f2ec`, not a solid fill.
- [ ] Hidden rows use the hidden attribute.
- [ ] Focus ring is 2px, offset 2px.
- [ ] There is no animation and no pill unless the family button is a pill.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. All is `aria-pressed="true"`. Four rows show. The count is 4 loads.
2. Out leaves Rice and Salt. The count is 2 loads. In leaves Tea. Held leaves Oil.
3. One chip is pressed. Pressing another releases the rest.
4. The search matches the start of the data name: "ri" leaves Rice. It is case-insensitive. It combines with the chip.
5. A query and a chip that exclude everything hide every row and show "No loads match." The count is 0 loads.
6. Clearing the search restores the rows the chip allows.
7. Focus ring is 2px `--focus`, offset 2px, on the field and the chips.
8. There is no animation.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --line: #e4dfd4;
  --line-strong: #cfc6b8;
  --primary-soft: #e7f2ec;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Radius is 2px. A locked family replaces it on the field, the chips, and the list. Do not leave the chips as pills unless that family's button is a pill. Selected is `--primary-soft`, not a solid primary.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Field | sans | 14px | 400 | `--ink` |
| Chip | sans | 13px | 500 | `--ink` |
| Count | sans | 13px | 400 | `--ink-2` |
| Row | sans | 14px | 400 | `--ink` |
| Empty | sans | 14px | 400 | `--ink` |

The count uses tabular numbers. The placeholder "Find a load" is `--ink-2` if you colour it. The label is the aria-label. Do not add a second visible label in the bar.

## Implementation notes

One kind variable. The search and the kind both have to pass.

```js
const ok = (kind === 'all' || row.dataset.kind === kind) && row.dataset.name.includes(query);
row.hidden = !ok;
```

Pluralize the count: 1 load, otherwise loads.

Common mistakes:

- Pill chips on a square family.
- A pressed chip painted as the primary button, so it looks like Save.
- Filtering by hiding with CSS only, leaving the rows in the accessibility tree.
- A separate empty illustration with a second heading. One sentence is the zero state here.
- A 640px list on a pass whose column is 720px.
- Search that ignores the chip, or a chip that ignores the search.
- Four toolbars on one page.
- Resetting nothing when the person changes the chip. Stay on the chip they pressed.

Where it sits in a product:

1. Put it above the list it filters, inside the pass column.
2. `search-results-filters` is a search page. `spend-list` is the phone transaction list. Do not stack this bar on top of either.
3. Chips are real kinds in the data. Do not add a fifth chip with no rows.
4. Selected is `--primary-soft`. Hover is `--surface-2`.
5. Height and radius come from the family.
6. When both this and `pagination` are on a screen, changing the chip returns to page 1.
7. When a theme is locked, the pressed fill is that theme's `--primary-soft`.
8. The empty sentence is not `list-empty-plain`. That piece is a list that has no rows yet. This sentence is a filter that matched nothing. The rows still exist.
9. The where of the screen can sit above the bar. This demo lets the bar be the top.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the 720px bar: field, four chips, count.
3. Place the four rows.
4. Wire the chips as a single pressed value.
5. Wire the search.
6. Wire the empty line.
7. Check the combination of chip and query.
8. Replace radius and height with the locked family.

Copy you keep:

1. Find a load.
2. All, Out, In, Held.
3. Rice Out, Oil Held, Tea In, Salt Out.
4. 4 loads, and the singular load.
5. No loads match.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
