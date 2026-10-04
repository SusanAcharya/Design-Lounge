<!-- Design Lounge Nº 325 · "Orders table with fulfilment" · designlounge.vercel.app -->

# Orders table with fulfilment

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The orders screen of a small studio shop ("Hearthmade"). Seven orders sit in a cream card on a parchment page. Each row shows the order number, the customer, the date, the total, a payment pill, and a fulfilment bar split into one segment per line item. A chevron opens the row into a tray of item tiles, each with its own Pack toggle, and packing items fills the segments. Checking rows raises a dark pill-shaped bulk bar at the bottom of the card. The detail worth copying is the segmented fulfilment bar: it is a progress bar whose segments are the actual items, so "2 of 3" reads at a glance and changes the moment one item is packed.

## Reference behaviour

1. First frame: sorted by Order, descending (#HM-2047 at the top). #HM-2047 is expanded. #HM-2046 and #HM-2044 are checked, so the bulk bar is visible and reads "2 selected". The select-all checkbox is indeterminate.
2. Clicking a sortable header (Order, Customer, Placed, Total, Payment, Fulfilment) sorts by that column. A second click reverses it. Customer and Payment start ascending; the others start descending. Only the active header has `aria-sort` other than `none`.
3. Clicking a row checkbox toggles that order. The row tints `--accent-soft`. The header checkbox shows checked when all seven are selected, indeterminate for one to six, empty for zero.
4. Clicking the header checkbox selects all seven or clears all.
5. The bulk bar slides up 24px and fades in when the selection goes from 0 to 1, and leaves the same way at 0. It shows the count, Print slips, Put on hold, Clear, and the primary Mark packed.
6. Mark packed sets every item in every selected, non-refunded order to packed. The segments turn olive and the label reads "Ready to ship". Put on hold changes the payment pill to On hold. Print slips only announces. Clear empties the selection and returns focus to the select-all checkbox.
7. The chevron button toggles a detail row under the order. Opening it drops the item tray 6px into place over 320ms. The chevron rotates 180° and the button fills ink.
8. In the tray, each item tile has a Pack toggle (`aria-pressed`). Pressing it flips the item to Packed (olive pill with a tick) and lights one segment in the bar. When every item is packed, all segments turn olive and the label becomes "Ready to ship". Refunded orders have disabled toggles and read "Cancelled".
9. The "to pack" figure in the header counts orders that are not refunded and not fully packed. It updates live.
10. Every change is announced in a polite live region ("Sorted by Total, descending", "Linen tea towels packed. 2 of 3 packed.", "3 orders marked packed").

## Structure

```
page bg #F3EADB, padding 32px, card centred, max-width 1120px
+------------------------------------------------------------------------+
| HEARTHMADE · STUDIO SHOP (12px caps accent)          4        $1,010   |
| Orders this week (Fraunces 30px)                   to pack    gross    |  head 24/28/18 padding
+------------------------------------------------------------------------+
| [■] ORDER ↓   CUSTOMER    PLACED    TOTAL   PAYMENT   FULFILMENT     |  thead 44px, sunk
+------------------------------------------------------------------------+
| [ ] #HM-2047  (MO) Maya Okafor   Oct 3  $104.00  (• Paid)  ▬▬ ▭▭ ▭▭  (^) |  row 60px
|     3 items       Portland, OR                             Packing 1/3   |
|   +--------------------------------------------------------------+     |
|   | [sw] Hand-thrown mug  [✓ Packed] | [sw] Linen tea towels [Pack] |  |  detail tray
|   +--------------------------------------------------------------+     |
| [x] #HM-2046 ...                                                       |
| ...seven rows                                                          |
|                 ( 2 selected  Print slips  Put on hold  Clear  [Mark packed] )   bulk bar, 18px from bottom
+------------------------------------------------------------------------+
```

- The card is a `main` labelled by the `h1`. The header summary is a `div` with `aria-label="Summary"`.
- The table is a real `table` with a visually hidden `caption`. Headers are `th scope="col"`; sortable ones hold a `button`.
- Each order is two `tr`s: `tr.row` and `tr.detail` with one `td colspan="8"`. The detail row has `hidden` when closed and an id the chevron points at with `aria-controls`.
- The tray is a `ul` with one `li` per item.
- The bulk bar is a `div role="region" aria-label="Bulk actions"`, absolutely positioned inside the table wrapper. A 72px spacer under the table keeps the last row clear of it.
- A visually hidden `p aria-live="polite"` carries announcements.

## Tokens

```css
:root {
  --bg: #f3eadb;          /* parchment page */
  --surface: #fffbf4;     /* card */
  --sunk: #f8f0e3;        /* thead band */
  --ink: #2a1e16;
  --ink-2: #5e4b3c;
  --ink-3: #76614f;       /* muted labels, 4.9:1 on surface */
  --line: #e6d8c3;
  --line-2: #d6c3a8;
  --accent: #b9472a;      /* terracotta */
  --accent-ink: #fffbf4;
  --accent-soft: #f6e1d6; /* selected row */
  --paid: #3f5a22;    --paid-bg: #e5ebd2;
  --pend: #80520a;    --pend-bg: #f7e5bf;
  --hold: #9b2f1d;    --hold-bg: #f6dcd3;
  --ref: #5e4b3c;     --ref-bg: #ece2d3;
  --display: "Fraunces", Georgia, serif;
  --sans: "Work Sans", system-ui, sans-serif;
  --r-card: 18px; --r-pill: 999px; --r-sm: 8px;
  --row: 60px; --thead: 44px;
  --space: 4px 8px 12px 16px 24px 28px 32px;
  --shadow-card: 0 24px 48px -32px rgba(74,44,20,.35);
  --shadow-bar: 0 18px 40px -16px rgba(42,30,22,.6);
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Eyebrow | Work Sans | 12px | 600 | 1.45 | 0.08em | upper, `--accent` |
| Title | Fraunces (opsz 96) | 30px | 600 | 1.1 | -0.02em | sentence |
| Summary figure | Fraunces | 20px | 600 | 1.1 | 0 | — |
| Column header | Work Sans | 12px | 600 | 1 | 0.04em | upper, `--ink-3` |
| Order number | Work Sans | 14px | 600 | 1.45 | 0 | tabular-nums |
| Body cell | Work Sans | 14px | 400 | 1.45 | 0 | — |
| Sub-line | Work Sans | 12px | 400 | 1.45 | 0 | `--ink-3` |
| Total | Work Sans | 14px | 500 | — | 0 | tabular-nums, right |
| Pill | Work Sans | 12px | 600 | 24px | 0 | — |
| Bulk bar | Work Sans | 13px | 500 | — | 0 | count 600 |

Fraunces only appears in the title and the two summary figures. Every cell is Work Sans.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Bulk bar | selection 0 ↔ ≥1 | translateY, opacity | 24px, 0 → 0, 1 | 320ms / 200ms | expo |
| Item tray | row opened | translateY, opacity | -6px, 0 → 0, 1 | 320ms | expo |
| Chevron | toggle | rotate | 0 → 180° | 280ms | expo |
| Segment | item packed | background | `--line` → `--accent` (→ `--paid` when all) | 300ms | standard |
| Sort arrow | sort | rotate, opacity | .35 → 1 | 200ms | standard |
| Row | hover | background | → `#fdf5ea` | 150ms | — |

The tray animates only when it is opened, not on every re-render. Reduced motion: all transitions drop to 1ms and the tray keyframe is removed.

## States

- Row hover: `#fdf5ea`. Selected: `--accent-soft`. Open: bottom border transparent so row and tray read as one block; the tray row takes the same tint.
- Checkbox: 18px, 1.5px `--line-2` border, 5px radius. Checked/indeterminate: terracotta fill, cream tick or bar.
- Sort header: inactive arrow at 35% opacity; active header text goes `--ink`, arrow goes `--accent` at 100%, pointing up for ascending and down for descending.
- Chevron: 36px circle, 1px `--line`. Expanded: ink fill, cream icon, rotated.
- Pack toggle: outline pill "Pack". Pressed: olive tint, tick, "Packed". Disabled for refunded orders.
- Pills: Paid olive, Pending amber, On hold rust, Refunded taupe. Each has a 6px dot in `currentColor`.
- Fulfilment label: "Unfulfilled", "Packing N of M", "Ready to ship" (olive segments), "Cancelled".
- Focus-visible: 2px `--accent` outline, offset 2px; inside the dark bar the ring is `#f2b49f`.

## Accessibility

- Sort controls are buttons inside `th`; `aria-sort` sits on the `th` (`ascending`, `descending`, or `none`).
- Row checkbox label: "Select order HM-2047". Header checkbox: "Select all orders", with `indeterminate` set in script.
- Chevron: `aria-expanded`, `aria-controls="d2047"`, label "Show items in HM-2047" / "Hide items in HM-2047".
- Pack toggles use `aria-pressed`. The fulfilment bar is `role="img"` with the label text as its name.
- Tab order: select all → sort buttons → each row's checkbox → chevron → (tray toggles when open) → bulk bar buttons.
- After a re-render, focus returns to the same control (track a `data-f` key and refocus it).
- Live region announces sorts, packing and bulk results.
- Contrast: `--ink-3` on `--surface` is 4.9:1; pill text on its tint is above 6:1.
- Mobile hit targets: chevron 36px, sort buttons 8px padding, bar buttons 36px tall.

## Responsive rules

- ≥1280: as drawn, card 1120px wide.
- 1024: card fills width minus 32px padding; the Fulfilment column shrinks to its 150px minimum.
- 820 and below: rows become cards. The header row turns into a wrapping line of sort chips (Placed is hidden because the date is dropped from the card). Each `tr.row` becomes a 3-column grid: checkbox | order + customer + fulfilment | total + payment + chevron. The tray stacks items one per line. The bulk bar becomes `position: fixed`, 12px from the left, right and bottom; Print slips and Put on hold hide.
- 375: no horizontal page overflow. The card has 12px page padding.

## Acceptance checklist

### Always

- [ ] Every sortable header is a button inside a `th`, and exactly one `th` has a non-`none` `aria-sort`.
- [ ] The header checkbox is checked, indeterminate or empty to match the selection.
- [ ] The bulk bar appears only with one or more selected and shows the live count.
- [ ] Clear returns focus to the select-all checkbox.
- [ ] Each row's expand button has `aria-expanded` and `aria-controls` pointing at its detail row.
- [ ] The fulfilment bar has one segment per line item and updates when an item is packed.
- [ ] Focus survives re-rendering (sorting, checking, packing).
- [ ] At 375 wide the rows are cards and `scrollWidth` equals the viewport width.
- [ ] Reduced motion removes the tray drop and the bar slide.

### This demo

- [ ] Seven orders, #HM-2041 to #HM-2047, sorted by Order descending on load.
- [ ] #HM-2047 is expanded; #HM-2046 and #HM-2044 are checked; the bar reads "2 selected".
- [ ] Header shows "4 to pack" and "$1,010 gross".
- [ ] Rows are 60px, header band 44px, card radius 18px.
- [ ] Mark packed turns selected orders' segments olive and labels them "Ready to ship".

## Implementation notes

Segmented fulfilment bar. Render one `i` per item and colour it by state, so packing is literally lighting a segment:

```js
function fulCell(o){
  const p = o.items.filter(it => it.packed).length, n = o.items.length;
  const done = p === n && o.status !== "refunded";
  const label = o.status === "refunded" ? "Cancelled"
    : p === 0 ? "Unfulfilled" : done ? "Ready to ship" : `Packing ${p} of ${n}`;
  return `<div class="ful${done ? " done" : ""}" role="img" aria-label="${label}">
    <div class="segs">${o.items.map(it => `<i class="${it.packed ? "on" : ""}"></i>`).join("")}</div>
    <span>${label}</span></div>`;
}
```

```css
.segs { display: flex; gap: 3px; }
.segs i { flex: 1; height: 6px; border-radius: 3px; background: var(--line); transition: background .3s var(--ease); }
.segs i.on { background: var(--accent); }
.ful.done .segs i.on { background: var(--paid); }
```

Table rows into cards at 820px without changing markup:

```css
@media (max-width: 820px) {
  tbody, tr.row, tr.detail, td { display: block; }
  tr.row { display: grid; grid-template-columns: 34px 1fr auto;
    grid-template-areas: "sel order total" "sel cust status" "sel ful exp"; gap: 10px 8px; padding: 14px 16px; }
  td.c-sel { grid-area: sel; padding: 2px 0 0; }  /* reset the desktop 24px left pad */
  td.c-date { display: none; }
  thead tr { display: flex; flex-wrap: wrap; gap: 4px 8px; }  /* sort chips */
}
```

Animate the tray only when newly opened. If you put the keyframe on `.items` directly, every re-render (checking a box, sorting) replays it and the tray flickers:

```js
if (open.has(id)) open.delete(id); else { open.add(id); fresh = id; }
render();            // adds .fresh only to the tray whose id === fresh
fresh = null;
```

Common mistakes:

- A single continuous progress bar. The segments are the point.
- Hiding the bulk bar with `display:none`, which kills the slide. Use opacity, transform and `visibility`.
- Putting `aria-sort` on the button instead of the `th`.
- Re-rendering the body and losing keyboard focus on the checkbox the user just pressed.
- Letting the bar sit over the last row. Keep a 72px spacer under the table.
- Setting cells in the display serif. Fraunces is for the title and figures only.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
