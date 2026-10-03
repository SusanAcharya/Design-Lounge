<!-- Design Lounge Nº 302 · "Marketplace search hero" · designlounge.vercel.app -->

# Marketplace search hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The top of a booking site for Saltroad, a fictional travel marketplace of small stays chosen by editors. It reads like the cover of a travel magazine: a big serif headline with one italic word in terracotta, set on sand. Under it, the search bar does the work. It has three fields: a text input for Where, a When button that opens a two-month date-range calendar, and a Guests button that opens a stepper. Under the bar there is a row of category chips. Under that sit four destination tiles with flat drawn landscapes, prices and stay counts. The detail worth copying: both popovers are real, keyboard-complete dialogs, so the hero is a working search form, not a picture of one.

## Reference behaviour

1. Initial state: sand page. Nav 64px with a 1px rule under it. An eyebrow "Autumn issue · 1,180 stays checked in person" in terracotta caps. Headline "Slow places, booked fast." at 88px on one line, with "booked" in terracotta italic. A 3-line lede sits to the right, aligned to the headline's baseline.
2. The search bar shows Where "Alentejo, Portugal", When "Oct 16 – Oct 19", Guests "2 adults", and a terracotta Search button.
3. Chips row: Farmhouses (selected, ink fill), Coastal, Vineyards, Cabins, Riads, Off-grid, Pets welcome. Each chip shows a count in smaller type.
4. Four tiles: Comporta (Portugal, 6 stays, €142), Val d'Orcia (Italy, 11 stays, €188), Agafay (Morocco, 4 stays, €96), Lofoten (Norway, 8 stays, €210). Comporta has an "Editor's pick" badge and Agafay has a "New" badge.
5. Clicking When opens the date popover under the field. It fades in and drops 6px into place over 180ms. `aria-expanded` turns true. Focus moves to the check-in day, 16 October.
6. The popover shows October 2026 and November 2026 side by side. Weeks start on Monday. Days before today (3 October 2026) are disabled and struck through. Previous and next arrow buttons sit in the top corners. Previous is disabled on October.
7. The selected range draws as a pale terracotta band. The two ends are filled terracotta circles with paper text. The band runs half into the end cells so it meets the circles.
8. Picking dates: the first click sets check-in and clears check-out. The next click on a later day sets check-out. A click on the same day or an earlier day moves check-in there instead. The footer reads "Oct 16 – Oct 19 · 3 nights", or "Oct 16 · pick a check-out date" while half-picked. The When field updates live.
9. Arrow keys move focus by one day (left and right) or one week (up and down). Moving past the second month pages the view forward. Enter or Space picks the focused day.
10. Clear empties the range and the field shows "Add dates" in a muted colour. Done closes the popover.
11. Clicking Guests opens the guests popover, right-aligned under its field. Rows: Adults (age 13 and up, minimum 1), Children (age 2 to 12), Pets (maximum 2). Each row has a minus button, a count and a plus button. Minus disables at the minimum. Plus disables at the maximum, or when adults plus children reach 12.
12. The Guests field updates live: "2 adults", "3 guests" once a child is added, and "· 1 pet" appended when pets are above 0.
13. Esc closes the open popover and returns focus to its trigger. Clicking or tabbing outside closes it without moving focus. Opening one popover closes the other. Clicking the trigger again closes it.
14. Clicking a chip selects it and deselects the rest. Only one is selected at a time.
15. Hovering a tile scales its scene to 1.03 over 500ms. The caption does not move.
16. Search submits the form. The demo cancels navigation.

## Structure

```
1280 x 800, side padding 64
+--------------------------------------------------------------------------+
| Saltroad   Stays Journal Gift cards For hosts      List your place [Sign in] | nav 64, 1px rule
|                                                                          |
| AUTUMN ISSUE · 1,180 STAYS CHECKED IN PERSON                             |
| Slow places, *booked* fast.            88/.94   | lede 16px, 3 lines     |  grid 1.7fr / 1fr
|                                                                          |
| +-WHERE------------------+-WHEN------------+-GUESTS---------+[Search]-+  |  bar 76, 1px ink border
| | Alentejo, Portugal     | Oct 16 – Oct 19 | 2 adults       |          |  |
| +------------------------+--------+--------+----------------+----------+  |
|                          | date popover 640 wide, 2 months  |              |
| (Farmhouses 214)(Coastal 188)(Vineyards 96)(Cabins 142)(Riads 61)...      |  chips 36
|                                                                          |
| +--scene 5:4--+ +--scene--+ +--scene--+ +--scene--+                       |  4 cols, gap 20
| Comporta  €142  Val d'Orcia €188  Agafay  €96   Lofoten  €210             |
+--------------------------------------------------------------------------+
```

- `<header class="nav">`: logo link, `<nav aria-label="Primary">`, then two right-aligned links.
- `<main>`: a two-column top row (`div` with eyebrow `p` and `h1`, then a `p` lede).
- `<form role="search" aria-label="Find a stay">`: a grid with `minmax(0,1.25fr) minmax(0,1fr) minmax(0,1fr) auto`.
- Field 1: `label` + `input`. Fields 2 and 3: a `button` trigger that holds a small caps label and a value `span`. Each popover is a sibling of its trigger, inside the field, so it can be positioned against it.
- Date popover: `div role="dialog" aria-label="Choose dates"`, two prev/next buttons, a `.months` container, a footer with a live summary, Clear and Done.
- Each month: an `h3` and a 7-column grid of weekday labels, blank `span`s for the offset, then one `button` per day.
- Guests popover: `div role="dialog" aria-label="Choose guests"`, three rows, each with a label block and a stepper (`button`, `output`, `button`).
- Chips: `div role="group" aria-label="Kind of stay"` holding `button`s with `aria-pressed`.
- Tiles: a `ul` of 4 `li > a`. Each holds a scene `div` with an inline SVG and an optional badge, then a caption row.

## Tokens

```css
:root {
  /* colour */
  --bg: #efe6d6;          /* sand page */
  --paper: #f8f2e7;       /* search bar, popovers, badges */
  --ink: #1f1a15;         /* text, bar border, selected chip */
  --ink-2: #584d42;       /* lede, labels, meta */
  --ink-3: #7a6d60;       /* placeholder, chip counts, weekday letters */
  --line: #d6c7ae;        /* dividers, chip borders */
  --terra: #b4502c;       /* accent: italic word, Search, range ends */
  --terra-deep: #8f3d1f;  /* eyebrow, Search hover, focus */
  --terra-soft: #ecd3c3;  /* range band */
  --focus: #8f3d1f;

  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Schibsted Grotesk", system-ui, sans-serif;
  --fs-h1: 88px;
  --fs-month: 22px;
  --fs-tile: 22px;
  --fs-value: 17px;
  --fs-body: 15px;
  --fs-label: 11px;

  /* space (4px base) */
  --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 28px; --s-7: 40px; --s-8: 64px;

  /* shape */
  --r: 10px;     /* bar, popovers, scenes */
  --r-sm: 6px;   /* fields, Search, Done, Sign in */
  --shadow: 0 18px 40px -18px rgba(31,26,21,.35), 0 2px 6px rgba(31,26,21,.06);

  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --t-pop: 180ms;
  --t-micro: 160ms;
  --t-day: 120ms;
  --t-tile: 500ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Logo | Instrument Serif italic | 28px | 400 | 1 | -0.01em | as typed |
| Eyebrow | Schibsted Grotesk | 12px | 600 | 1.5 | 0.12em | upper |
| Headline | Instrument Serif | 88px | 400 | 0.94 | -0.025em | sentence |
| Headline accent | Instrument Serif italic | 88px | 400 | 0.94 | -0.025em | sentence |
| Lede | Schibsted Grotesk | 16px | 400 | 1.55 | 0 | sentence |
| Field label | Schibsted Grotesk | 11px | 700 | 1.4 | 0.1em | upper |
| Field value | Schibsted Grotesk | 17px | 500 | 1.4 | 0 | sentence |
| Search button | Schibsted Grotesk | 16px | 700 | 1 | 0 | sentence |
| Month title | Instrument Serif | 22px | 400 | 1.2 | 0 | sentence |
| Weekday | Schibsted Grotesk | 11px | 700 | 1 | 0.06em | Mo Tu We |
| Day | Schibsted Grotesk | 14px | 500, ends 700 | 1 | 0, tabular | numerals |
| Chip | Schibsted Grotesk | 14px, count 12px | 500 | 1 | 0 | sentence |
| Tile name | Instrument Serif | 22px | 400 | 1.1 | 0 | sentence |
| Tile meta and price unit | Schibsted Grotesk | 13px | 400 | 1.4 | 0 | sentence |
| Tile price | Schibsted Grotesk | 16px | 700 | 1.2 | 0 | € + number |

- The serif is display only: headline, logo, month titles and tile names. Everything you click is set in the grotesk.
- The italic accent is a colour and a style change on one word. Do not italicise more than one word.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Popover | open | opacity, translateY | 0, -6px → 1, 0 | 180ms | standard |
| Popover | close | opacity, translateY | 1, 0 → 0, -6px, then hidden | 180ms | standard |
| Day circle | hover | background | none → `--bg` | 120ms | standard |
| Chip | hover or select | background, border | base → selected | 160ms | standard |
| Search | hover | background | `--terra` → `--terra-deep` | 160ms | standard |
| Tile scene | hover | transform | scale 1 → 1.03 | 500ms | standard |

- Hide a closed popover with `visibility: hidden` after the fade, with `transition: visibility 0s 180ms`. It must not catch clicks or focus while invisible.
- Reduced motion: drop every transition. Popovers appear and disappear at once. Tiles do not scale.
- Nothing plays on load. The first frame is the finished hero.

## States

- Field focus or open: the field fills `#f1e8d9` across its whole cell.
- Trigger value with no data: `--ink-3` text ("Add dates").
- Day hover: a 38px `--bg` circle.
- Day disabled: colour `#b9ab98`, line-through, no hover, `cursor: default`.
- Range start and end: 38px `--terra` circle, `--paper` text, weight 700. The cell behind is a half band of `--terra-soft` toward the inside of the range.
- Days inside the range: the full cell is `--terra-soft`.
- Same day as start and end: circle only, no band.
- Prev or next at the limit: 30% opacity, disabled.
- Stepper at a limit: button disabled at 30% opacity.
- Chip selected: `--ink` fill, `--paper` text, count `#cfc2b0`. Chip hover: border `--ink-3`.
- Focus-visible: 2px `--focus` outline, 2px offset. On days, the ring is drawn on the inner circle, not the full cell.
- Loading and error: not shown. If search fails in a product, keep the bar filled and show a message under the chips.

## Accessibility

- The search bar is a `form` with `role="search"` and a label.
- When and Guests triggers: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` pointing at the popover id.
- Popovers: `role="dialog"` with `aria-label`. They are not modal. Do not trap focus. Close when focus leaves.
- Esc closes and returns focus to the trigger. Done closes and returns focus too.
- Day buttons: roving tabindex. Only the focused day has `tabindex="0"`. Each has a full label such as "Friday 16 October 2026, check-in". Range ends have `aria-pressed="true"`.
- Each month grid is a `role="group"` labelled by its `h3`.
- The footer summary has `aria-live="polite"`, so the nights count is announced after a pick.
- Stepper buttons have labels such as "Add adult" and "Remove child". Counts are `output` with `aria-live="polite"`.
- Chips use `aria-pressed`. The group is labelled "Kind of stay".
- Scenes are decorative, `aria-hidden`. The tile link text is the place, region, stay count and price.
- Contrast: `#584d42` on `#efe6d6` is about 6.3:1. `#f8f2e7` on `#b4502c` is about 4.7:1. Keep `#7a6d60` for 11-13px meta only.
- Hit targets: day cells 38px, stepper buttons 40px, chips 36px tall with 14px padding, Search 60px.

## Responsive rules

- ≥1280: as drawn. 64px side padding. Headline 88px on one line, lede on the right.
- 1024: 40px side padding. Headline 72px. Drop the lede and run the top row as one column. Tile gap 16px.
- 768: hide the nav links. The bar becomes 2 columns: Where across the top, When and Guests side by side, Search full width below. Tiles go to 2 columns. The date popover shrinks to `min(640px, 100vw - 80px)`.
- <640: 20px side padding, headline 54px over two lines. The bar is one column: Where, When, Guests, Search. Each field gets a 1px divider above it. Popovers turn into bottom sheets: `position: fixed`, 12px from the left, right and bottom, `max-height: 78vh`, scrolling inside. The two months stack. The popover footer sticks to the bottom of the sheet so Done is always visible. Chips scroll sideways inside their own row, with the row bleeding to the screen edge, and the page itself does not scroll sideways. Tiles stay at 2 columns, and the price moves under the place name.
- At every size the page itself never scrolls sideways.

## Acceptance checklist

### Always

- [ ] Three fields in one bar: a text input, a date-range trigger, a guests trigger. Plus a primary Search button.
- [ ] The date popover shows two months with Monday-first weeks. Past days are disabled.
- [ ] A range shows filled ends and a band between them. The nights count updates in the footer.
- [ ] Arrow keys move day focus by 1 and 7. Enter picks.
- [ ] The guests popover has three steppers with minimums and maximums, and the field summary updates live.
- [ ] Triggers carry `aria-expanded` and `aria-controls`. Popovers are `role="dialog"`.
- [ ] Esc closes and returns focus to the trigger. Outside click closes without stealing focus.
- [ ] Only one popover is open at a time.
- [ ] Chips are single-select with `aria-pressed`.
- [ ] Four destination tiles with drawn scenes, a name, a region, a count and a price.
- [ ] At 390px the bar stacks and popovers become bottom sheets. No horizontal page scroll.

### This demo

- [ ] The brand is Saltroad. The headline reads "Slow places, booked fast." with "booked" in `#b4502c` italic.
- [ ] Defaults: "Alentejo, Portugal", "Oct 16 – Oct 19" (3 nights), "2 adults".
- [ ] Months shown: October and November 2026. Today is 3 October 2026.
- [ ] Guests limits: adults 1 to 12, children 0 to 8, pets 0 to 2, and no more than 12 people in total.
- [ ] Chips: Farmhouses 214 (selected), Coastal 188, Vineyards 96, Cabins 142, Riads 61, Off-grid 73, Pets welcome 305.
- [ ] Tiles: Comporta €142, Val d'Orcia €188, Agafay €96, Lofoten €210.

## Implementation notes

**Range painting.** Put the band on the day cell and the circle on an inner `span`. The ends get a half-cell gradient so the band meets the circle.

```css
.d { height: 38px; }
.d span { display: grid; place-items: center; width: 38px; height: 38px; margin: 0 auto; border-radius: 50%; }
.d.in { background: var(--terra-soft); }
.d.s  { background: linear-gradient(90deg, transparent 50%, var(--terra-soft) 50%); }
.d.e  { background: linear-gradient(90deg, var(--terra-soft) 50%, transparent 50%); }
.d.s.e { background: none; }
.d.s span, .d.e span { background: var(--terra); color: var(--paper); font-weight: 700; }
.d:focus-visible { outline: none; }
.d:focus-visible span { outline: 2px solid var(--focus); outline-offset: 1px; }
```

**Pick logic.** Keep it to three branches. Store timestamps, not Date objects, so comparisons are plain numbers.

```js
function pick(t) {
  if (!start || end || t <= start) { start = t; end = null; }
  else { end = t; }
  cursor = t;
  render();          // rebuild both months, update footer and field
  focusCursor();     // innerHTML replaced the buttons, so refocus
}
const nights = (end - start) / 864e5;
```

**One popover controller.** Both popovers share open, close and dismiss rules.

```js
let open = null;
function close(returnFocus) {
  if (!open) return;
  open.pop.classList.remove('open');
  open.trig.setAttribute('aria-expanded', 'false');
  if (returnFocus) open.trig.focus();
  open = null;
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && open) { e.preventDefault(); close(true); }
});
for (const evt of ['pointerdown', 'focusin']) {
  document.addEventListener(evt, e => {
    if (open && !open.pop.parentNode.contains(e.target)) close(false);
  });
}
```

Common mistakes:

- A native `input type="date"` in place of the popover. It cannot show a range or two months.
- Rebuilding the calendar with `innerHTML` and losing focus. Refocus the cursor day after every render.
- Leaving a closed popover at `opacity: 0` only. It still catches clicks. Add `visibility: hidden`.
- Focus trapping in a non-modal popover. Tab must be able to leave, and leaving closes it.
- Day numbers that shift width as the range changes. Use tabular numerals.
- Photographs for the tiles. This piece draws flat scenes in SVG: 4 to 6 shapes each, `preserveAspectRatio="xMidYMid slice"`.
- Terracotta on chips or tiles. The accent is for the headline word, Search, and range ends only.
- Letting the chip row push the page wider on mobile. Scroll the row inside itself.

Rebuild order:

1. Nav, eyebrow, headline and lede in a `minmax(0,1.7fr) minmax(0,1fr)` grid.
2. The search form grid with three fields and Search.
3. Chips and tiles, including the four SVG scenes.
4. The popover controller: open, close, Esc, outside click, focus return.
5. The calendar render with offsets, disabled past days and range classes.
6. Pick logic, footer summary, field update, Clear and Done.
7. Arrow-key navigation with roving tabindex and month paging.
8. The guests stepper with limits and the live summary.
9. Breakpoints at 1100, 860 and 640, and the bottom-sheet popovers.
10. The reduced-motion block. Then tab through the whole form once.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
