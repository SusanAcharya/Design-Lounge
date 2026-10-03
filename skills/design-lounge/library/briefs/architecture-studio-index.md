<!-- Design Lounge Nº 170 · "Architecture studio index" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Architecture studio index

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The home page of Lindqvist Nakamura Architects, a made-up studio with offices in Rotterdam and Lisbon. The page is a project index: a 12-row table with No., Project, City, Year, Type, and Status. It sorts by any column and filters by type. On the right, a drawing sheet shows the south elevation of the selected project, drawn in SVG to a true scale from four numbers (floors, bays, roof, window type). The sheet slides down to sit beside the row you point at or tab to. A List / Map switch swaps the table for an abstract map with one dot per city. White ground, black ink, black hairlines, zero radius, and one blueprint blue used only for dimensions, the selected row, the count, and focus. The detail worth copying: the drawing is generated, so every row gets a real-looking elevation with a person for scale and blue dimension strings, and no image files.

## Reference behaviour

1. First frame: the list view, sorted by No. ascending. Row 01 Rhine Pump Hall is selected. Its elevation sheet sits beside it, top edge 40px above the row's top.
2. Hovering a row selects it. Focusing the row's name button (Tab) also selects it. Clicking selects it. So hover is never the only way in.
3. The selected row has a `#eef2fd` fill, a 3px blue bar on its left edge, and a blue number. Its button has `aria-pressed="true"`.
4. On select, the sheet moves with `translateY` to the new row in 420ms with an expo-out ease. The drawing fades out for 160ms, swaps, and fades back in.
5. The sheet is clamped: it never rises above the column top and never drops below the table's last row.
6. The sheet shows: a label row (SOUTH ELEVATION, and "07 / VIENNA"), the drawing, then the name (22px), the number, a 4-cell data row (City, Year, Floors, Status), and a one-line note.
7. Column headers are sort buttons. Clicking a new column sorts ascending. Clicking the same column again flips to descending. The active header gets `aria-sort` and shows a small arrow, rotated 180 degrees for descending.
8. Type chips: All 12, Housing 3, Cultural 3, Civic 2, Workplace 2, Education 2. The count is a small superscript. Pressed chip is black with a 2px black underline. Others are grey.
9. Filtering re-renders the table and updates the blue count next to "Index". If the selected project is filtered out, the first visible row becomes selected.
10. List / Map is a 2-button switch in a 1px black frame. The pressed button is black with white text.
11. Map view hides the table and shows an SVG: a 40px grid of hairlines, a grey coast shape with a black outline, and 9 city dots. Dot radius is 3 + 1.6 x project count. Each dot has the city name and the count in mono.
12. The dot for the selected project's city is blue. Cities with no project under the current filter drop to 25% opacity and leave the tab order.
13. Clicking a dot, or Enter / Space on a focused dot, selects that city's next project, cycling. The sheet moves to the top of the map.
14. Under the index: an About strip (one statement, 31 people, 2 offices, 48 400 square metres) and a black contact footer with email, two addresses, and phones.
15. Under 1024px, the sheet stops following. It sits as a static block between the controls and the table. Tapping a row scrolls the sheet into view.

## Structure

```
1280 x 800, page scrolls
+---------------------------------------------------------------------------------+
| Lindqvist Nakamura Architects                  Index  Studio  Contact  Rotterdam/Lisbon | 56px, 1px black rule
+---------------------------------------------------------------------------------+
| 32px |  Index(12)                Built, on site...  |  40  |                    | 32px
|      |  96px, -0.045em            2020 - 2028       |      |                    |
|      |  ---------------------------------------------      |  +--------------+  |
|      |  All12 Housing3 Cultural3 ...     [List|Map] |      |  | SOUTH ELEV.  |  |
|      |  ===========================================  |      |  |   drawing    |  |
|      |  NO. PROJECT          CITY    YEAR TYPE  STATUS|      |  |  440 x 262   |  |
|      |  01  Rhine Pump Hall  Basel   2021 Cult  Built |  <-- |  +--------------+  |
|      |  02  ...                          44px rows    |      |  | Name     01  |  |
|      |  ...12 rows                                    |      |  | City Year .. |  |
|      |                                                |      |  +--------------+  |
|      |         minmax(0,1fr)                          |      |     440px          |
+---------------------------------------------------------------------------------+
| About: statement 2fr | People 31 | Offices 2 | Built 48 400       1px top rule   |
+---------------------------------------------------------------------------------+
| black footer: New work | Rotterdam | Lisbon | Phone                             |
+---------------------------------------------------------------------------------+
```

- `header.top`: wordmark link, `nav aria-label="Main"` with `aria-current="page"` on Index, and the city line in mono.
- `main.layout`: CSS grid `minmax(0,1fr) 440px`, column gap 40px, side padding 32px.
- Left column: `h1` with a `sup` count, a controls row (chips `role="group"`, view switch `role="group"`), a `table` with a visually hidden `caption`, and the map container.
- Table: `colgroup` with fixed widths (64, auto, 130, 72, 110, 120px), `table-layout: fixed`. Headers are `th scope="col"` holding a `button`. Each row's project cell holds a `button` that names the project; a `::after` on it covers the whole row so the row is one target.
- Right column: `aside aria-label="Selected project"` with a positioned `.panel`. Inside: one `svg role="img"` with a generated `aria-label`, and a caption block with `h2`, a `dl`, and a note. The caption is `aria-live="polite"`.
- `section.about` and `footer.contact` sit outside the grid at full width.

## Tokens

```css
:root {
  /* ground and ink */
  --bg: #ffffff;        /* this piece is about white */
  --ink: #0a0a0a;       /* text, frame lines, drawing lines */
  --ink-2: #555555;     /* nav, notes, mono values */
  --ink-3: #6e6e6e;     /* numbers, labels, inactive chips */
  --line: #d9d9d9;      /* row hairlines, map grid */
  --line-2: #0a0a0a;    /* section rules, table head rules, sheet frame */
  --tint: #f3f3f1;      /* row hover, map land */

  /* the one accent */
  --blue: #1d4ed8;      /* dimensions, selected row bar, count, focus */
  --blue-bg: #eef2fd;   /* selected row fill */

  --sans: "Inter Tight", Helvetica, Arial, sans-serif;
  --mono: "Spline Sans Mono", ui-monospace, Menlo, monospace;

  /* type scale */
  --t-10: 10px; --t-11: 11px; --t-12: 12px; --t-14: 14px; --t-15: 15px;
  --t-19: 19px; --t-22: 22px; --t-28: 28px; --t-40: 40px; --t-96: 96px;

  /* spacing, 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px;
  --s-6: 24px; --s-7: 28px; --s-8: 32px; --s-10: 40px; --s-18: 72px;

  --radius: 0;
  --row: 44px;
  --ease: cubic-bezier(.16, 1, .3, 1);   /* expo out, the sheet glide */
  --glide: 420ms;
  --swap: 160ms;
}
```

No shadows. No radius. Hairlines are 1px. The only fill colours are white, `--tint`, `--blue-bg`, and black.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| h1 "Index" | Inter Tight | 96px | 500 | 0.86 | -0.045em | title |
| Count sup | Spline Sans Mono | 14px | 400 | 1 | 0 | - , blue |
| Row project name | Inter Tight | 19px | 500 | 1.45 | -0.015em | title |
| Row city, type, status | Inter Tight | 15px | 400 | 1.45 | 0 | title |
| Row number, year | Spline Sans Mono | 12px | 400 | 1.45 | 0.02em | - |
| Column heads | Spline Sans Mono | 11px | 400 | 1 | 0.06em | upper |
| Chips | Inter Tight | 15px | 400 | 1 | 0 | title |
| Sheet name h2 | Inter Tight | 22px | 500 | 1.15 | -0.02em | title |
| Sheet labels (dt, drawing label) | Spline Sans Mono | 10px | 400 | 1.3 | 0.06em | upper |
| Sheet values (dd) | Spline Sans Mono | 13px | 400 | 1.3 | 0 | - |
| Dimension text | Spline Sans Mono | 10px | 400 | - | 0 | - , blue |
| About statement | Inter Tight | 28px | 500 | 1.15 | -0.02em | sentence |
| About numbers | Inter Tight | 40px | 500 | 1 | -0.03em | - |

Use a thin space or a plain space as the thousands separator in 48 400, the European way. Do not mix it with commas.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Sheet glide | select a row | transform translateY | old y → new y | 420ms | `cubic-bezier(.16,1,.3,1)` | jumps, no transition |
| Drawing swap | select | opacity | 1 → 0, redraw, 0 → 1 | 160ms each way | linear | redraw at once |
| Row hover | pointer | background | white → `--tint` | 200ms | `--ease` | instant |
| Map switch | click Map | display swap; sheet moves to map top | - | 420ms glide | `--ease` | jumps |
| Sort, filter | click | table re-render | - | instant | - | same |

Nothing moves on load. The sheet only moves in response to the reader.

## States

- Row rest: white, 1px `--line` bottom rule, 44px tall.
- Row hover: `--tint`. This also selects it.
- Row selected: `--blue-bg` fill, 3px blue inset bar on the left of the first cell, blue number.
- Column head rest: grey mono. Hover or sorted: black. Sorted shows the arrow.
- Chip rest: `--ink-3`. Hover: black. Pressed: black with `inset 0 -2px 0` black.
- View switch: pressed is a black cell with white text.
- Status marks, 7px squares with a 1px black border: Built is solid black, On site is half black on a diagonal, In design is hollow, Competition is solid blue.
- Map dot rest: black. Hover or focus: a 2px blue ring at r=11. Selected city: blue dot and blue label. Empty under filter: 25% opacity, not focusable.
- Empty filter result: cannot happen with this data. If a product's filter can empty the table, show "No projects of this type yet." in `--ink-3` 15px under the header row.
- Focus-visible: 2px blue outline, offset 2px. White outline in the black footer.

## Accessibility

- One `h1` (Index). The sheet name is the `h2` of the aside.
- Each row's project name is a real `button` with `aria-pressed`. Tab moves row to row and selects on focus.
- Sort buttons live inside `th`. The `th` gets `aria-sort="ascending"` or `"descending"`. Only one at a time.
- Chips and view switch use `aria-pressed`.
- The elevation `svg` has `role="img"` and an `aria-label` written from data, for example "South elevation of Liesing Housing: 11 floors, 38.2 metres high, 52.5 metres wide".
- The caption block is `aria-live="polite"`, so a screen reader hears the new name and data after a select.
- Map dots are `g` elements with `tabindex="0"`, `role="button"`, and an `aria-label` like "Vienna, 2 projects". Enter and Space work. Focus is restored to the same dot after re-render.
- Status is never colour alone; the square's fill pattern differs and the word is always shown.
- Contrast: `#0a0a0a` on white is about 19:1. `#6e6e6e` on white is about 5.1:1. Blue `#1d4ed8` on white is about 6.7:1.
- Row hit area is the full 44px row (58px under 768).

## Responsive rules

- 1280 and up: as drawn. Sheet column 440px. The sheet follows the selected row.
- 1024 (up to 1180): sheet column 360px, gap 28px, h1 80px. The Type column hides; type stays on the chips.
- 768 (up to 1023): one column. The sheet stops following and sits between the controls and the table, max 560px wide. About becomes 2 columns with the statement on top. Footer becomes 2 columns.
- Under 640 (up to 767): side padding 20px, h1 64px. City and Status columns hide. A mono sub-line under each project name shows "City · Type · Status". Rows are 58px. The sheet data row becomes 2x2. About and footer go to one column. Map labels go to 14px so they stay readable after scaling.
- At 390 nothing overflows sideways. The table uses `table-layout: fixed` and cells use `text-overflow: ellipsis`.
- Recompute the sheet position on `resize`.

## Acceptance checklist

### Always

- [ ] Black, white, one blue. Blue only for dimensions, the selected row, the count, the selected map dot, and focus.
- [ ] Zero radius everywhere. Hairlines, no shadows.
- [ ] The table sorts by every column, both directions, with `aria-sort` on the active header.
- [ ] Type filter chips show counts and use `aria-pressed`.
- [ ] Hover, focus, and click all select a row. The preview is never hover-only.
- [ ] The preview sheet slides to the selected row and stays inside the column.
- [ ] The elevation is generated from data, drawn to one scale, with a person for scale and blue dimension lines.
- [ ] List / Map switch. Map dots are keyboard reachable.
- [ ] Reduced motion removes the glide and the fade.
- [ ] No horizontal scroll at 390px.

### This demo

- [ ] Studio name Lindqvist Nakamura Architects. Rotterdam and Lisbon.
- [ ] 12 projects, 2021 to 2028. Row 01 Rhine Pump Hall starts selected.
- [ ] Types and counts: Housing 3, Cultural 3, Civic 2, Workplace 2, Education 2.
- [ ] Bays are 7.5m, floors are 3.4m. Liesing Housing reads +38.2 m and 52.5 m.
- [ ] Sheet column 440px, rows 44px, h1 96px.
- [ ] Glide 420ms on `cubic-bezier(.16,1,.3,1)`.

## Implementation notes

**1. One scale for the whole drawing.** Pick pixels per metre so the building fits 290px wide or 158px tall, whichever is tighter. Every length then comes from metres, including the person.

```js
function frame(p) {               // p = { f: floors, b: bays, roof, win }
  const W = 440, G = 200;         // sheet width, ground line y
  const k = Math.min(290 / (p.b * 7.5), 158 / (p.f * 3.4 + 4));  // px per metre
  const bw = 7.5 * k, fh = 3.4 * k;                              // bay, floor in px
  const w = p.b * bw, h = p.f * fh, x = (W - w) / 2 - 14, top = G - h;
  const rise = { flat: .8 * k, gable: Math.min(w / 3 * .36, 5 * k),
                 vault: Math.min(w * .22, 6 * k), saw: Math.max(10, 2.6 * k) }[p.roof];
  const heightM = (p.f * 3.4 + rise / k).toFixed(1);
  const person = 1.8 * k;         // draw head, body, legs from this
  return { k, bw, fh, w, h, x, top, rise, heightM, person };
}
```

Windows by type: `punch` is a 0.36 x 0.46 opening per bay, `tall` is a 0.14 x 0.72 slit, `band` is one strip per floor, `grid` is mullion lines. The middle bay of the ground floor is always a taller door. Draw a 10px hatch under the ground line with a rotated `pattern`.

**2. The sheet follows the row, clamped.**

```js
function place() {
  if (innerWidth < 1024) { panel.style.transform = ''; return; }
  const col = aside.getBoundingClientRect();
  const row = rows.querySelector(`tr[data-no="${sel.no}"]`).getBoundingClientRect();
  const bottom = rows.getBoundingClientRect().bottom - col.top - panel.offsetHeight;
  const y = Math.max(0, Math.min(row.top - col.top - 40, bottom));
  panel.style.transform = `translateY(${y}px)`;
}
```

```css
.pv { position: relative; }
.panel { position: absolute; inset: 0 0 auto 0; transition: transform .42s cubic-bezier(.16,1,.3,1); }
@media (prefers-reduced-motion: reduce) { .panel { transition: none; } }
```

Use `getBoundingClientRect` on both, not `offsetTop`. Table rows report `offsetTop` against the table, not the aside.

**3. Whole-row target without nesting a row in a link.** Keep a real button in the name cell and stretch it.

```css
tbody tr { position: relative; }
td.p button::after { content: ""; position: absolute; inset: 0; }
```

Select on `mouseover`, `focusin`, and `click`, delegated on `tbody`. Skip work when the row is already selected, or the sheet will flicker on every pixel of movement.

Common mistakes:

- A drawing that ignores scale, so a 2-storey hall and an 11-storey tower look the same height.
- Using blue for links or chips. It is the drafting colour, not the UI colour.
- A preview that only appears on hover, with nothing on first frame.
- Rebuilding the map SVG and losing keyboard focus on the dot.
- Rounded chips or a pill switch.
- Letting the sheet glide below the last row and off the table.
- Copying `portfolio-architect-index`. That one shows plans with a crossfade; this one shows true-scale elevations that move with the row.

Rebuild order:

1. Tokens, the two fonts, header.
2. Grid with the 440px sheet column.
3. Data array of 12 projects with floors, bays, roof, window type, and a note.
4. Table rows, sort, filter, count.
5. Elevation generator, then the sheet caption.
6. Select on hover, focus, and click; the glide and its clamp.
7. Map view and dot keyboard support.
8. About strip and footer.
9. Breakpoints at 1180, 1023, and 767; reduced motion.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
