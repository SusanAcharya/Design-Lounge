<!-- Design Lounge Nº 311 · "Selection bar" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Selection bar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

## What it is

A table of six yard loads. Two start checked, so the bar is already on screen. The bar reads the count and offers Clear, Export, and Archive. Archive hides the checked rows. Clear unchecks. Export writes a count and leaves the checks. This is not the dense table. That table is `dense-data-table`. This is the bar that appears when a table has a selection. Zero selected hides the bar.

## Reference behaviour

1. Loads 18 and 19 start checked. The bar says 2 selected.
2. Checking or unchecking updates the count. At zero the bar hides.
3. Clear unchecks every box and clears the status line.
4. Export writes "Exported N loads on this page" and keeps the checks.
5. Archive hides the checked rows, unchecks them, and writes "Archived N loads".
6. The bar is fixed to the bottom centre.
7. Hidden rows stay out of the count.

## Structure

```
640px table
checkbox, load, gate, state
fixed bar 420px min
[ N selected   Clear  Export  Archive ]
```

- Table width follows the 640px sheet.
- The first column is 40px.
- Checkboxes are 18px with accent #1f4d3a.
- The bar is position fixed, min-width 420px, height 52px.
- Archive is the solid button. Clear and Export are outline.

## Tokens

```css
:root {
  --bg:#f6f4ef; --surface:#fff; --ink:#161513; --ink-2:#5a554c;
  --line:#e4dfd4; --primary:#1f4d3a; --primary-ink:#fffdf8;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Title | IBM Plex Sans | 28px | 600 | 1.1 | 0 |
| Cell | IBM Plex Sans | 16px | 400 | 1.45 | 0 |
| Bar | IBM Plex Sans | 14px | 400 | 1 | 0 |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Bar | selection changes | hidden | shown | none | instant |

## States

- No selection: bar hidden.
- Some selection: bar visible, count matches checked boxes.
- Archive: those rows hidden, bar hides if none remain checked.
- Export: status line updates, selection remains.

## Accessibility

- Each checkbox has an accessible name, Select 18 and so on.
- The bar is hidden with the hidden attribute when the count is zero.
- Buttons are 36px tall inside a 52px bar.
- The status line is aria-live polite.
- Do not use a click handler on the whole row that fights the checkbox.
- Focus ring is 2px #1f4d3a, offset 2px.

## Responsive rules

- The sheet is 640px at 1280.
- Below 680 the sheet is calc(100% - 32px) and the bar matches that width.
- The gate column may wrap. Do not drop the checkbox.

## Acceptance checklist

### Always

- [ ] The bar is absent at zero.
- [ ] The count equals the checked rows.
- [ ] Archive removes those rows from view.
- [ ] Clear removes the selection without deleting rows.
- [ ] One solid action. The others are outline.

### This demo

- [ ] Six loads, numbers 18 through 23.
- [ ] 18 and 19 start checked, both Held at Gate 4.
- [ ] Archive is the solid button.
- [ ] Export says "on this page".
- [ ] Type is IBM Plex Sans. Radius is 2px.

## Implementation notes

Count checked boxes that are still in the document. A hidden row should be unchecked before it is hidden so it cannot count.

```js
const n = boxes.filter((b) => b.checked).length;
bar.hidden = n === 0;
```

Do not select every row with a header checkbox in this piece. Add one only if the product has it, and it must set every visible box.

## Measurements to keep

- Sheet 640px. Bar min-width 420px, height 52px, bottom 24px.
- Bar padding 0 12px 0 16px. Button height 36px.
- Checkbox 18px. First column 40px. Cell padding 12px 8px.
- Title 28px. Status min-height 20px, margin-top 14px.
- Solid button uses #1f4d3a with no border.

## Wrong turns

- Do not show the bar when nothing is checked.
- Do not archive rows that are not checked.
- Do not navigate on Export.
- Do not use a floating bar for a single row action. One row uses its own button.
- Do not make every button solid.
- Do not leave checked boxes on hidden rows.

## Fit with the rest of the library

- The full table is `dense-data-table`.
- Filters above a list are `filter-toolbar`.
- Undo for one archive is `undo-toast`.
- A kanban is `kanban-board`.
- Do not add a second toolbar in the header.
- Pagination of this list would be `pagination`.

## Keyboard

- Tab moves through checkboxes, then the bar buttons when the bar is visible.
- Space toggles the focused checkbox.
- Enter on Archive archives.
- Enter on Clear clears.
- Enter on Export exports.
- The bar is not a dialog.
- Hidden rows are not in the tab order.
- Do not use a positive tabindex.
- The count text is not a live region. The status line is.
- Two boxes start checked.
- Unchecking both hides the bar immediately.
- Focus ring offset is 2px on this piece.
- Do not trap focus in the bar.
- Archive does not ask a second time. The selection was the confirmation.
- Export does not hide rows.
- The type is IBM Plex Sans.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
