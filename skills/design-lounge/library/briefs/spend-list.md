<!-- Design Lounge Nº 253 · "Spend list" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Spend list

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is the home of a personal ledger. It is not a dashboard.

## What it is

The list a person opens to see their own month. The answer is what is left, रु 31,300, at 40px in Noto Serif Devanagari, so the currency word and the digits are one face. Under it, five lines, newest first: Bhatbhateni, NEA, a bus fare, rent, and a salary. Three filters, All, Out, and In, change which rows show. The heading does not change, because the month's remainder is still the decision. The calendar is labeled once, "Asar 2083 · BS", and every date is a day in Asar. Salary is the only money in, marked with the word "in" on the success wash. This is the screen the personal recipe was missing. A chart of categories is the next screen, not this one.

## Reference behaviour

1. The first frame shows रु 31,300, the sentence "Left after five lines.", All pressed, and five rows. Bhatbhateni starts `aria-pressed="true"`.
2. All shows every row. Out hides Salary. In shows only Salary. Hidden rows use the `hidden` attribute.
3. The heading and the sentence stay put when the filter changes.
4. Tapping a row selects it and clears the previous selection. It does not open a second page in this demo. In a product, that tap opens the line you named.
5. Amounts use lakh grouping: 1,24,000 and 1,80,000. 18,400, 4,200, and 2,100 stay as they are.
6. No motion. Reduced motion has nothing to remove.
7. Do not draw a tab bar in this piece. The shell, if the product has one, comes from `phone-tab-plain`.

## Structure

```
padding 54px 20px 34px
ASAR 2083 · BS              13px
रु 31,300                   40px display
Left after five lines.
[ All ] [ Out ] [ In ]
[ Bhatbhateni     रु 18,400 ]
  Out · 17 Asar
[ NEA              रु 4,200 ]
[ Bus              रु 2,100 ]
[ Rent          रु 1,24,000 ]
[ Salary        रु 1,80,000 ]
  1 Asar  [in]
```

- The month label is a paragraph. The remainder is the only `h1`.
- Filters are a group of three buttons.
- The list is a `ul` of buttons. Each row is a grid: name and meta in the first column, amount in the second, spanning both lines.
- Row min-height is 56px. Radius 6px. Surface fill.
- Grain is on the page only.

## Tokens

```css
:root {
  --bg: #f4ead6;
  --surface: #fbf6ea;
  --ink: #1c2744;
  --ink-2: #3e4a66;
  --line: #d9cbb3;
  --primary-soft: #f3d2c8;
  --focus: #c8102e;
  --success-soft: #d6d8c2;
  --success-on-soft: #1b5e3d;
  --display: "Noto Serif Devanagari", Georgia, serif;
  --sans: "Mukta", system-ui, sans-serif;
}
```

Do not set `.num` in IBM Plex Mono for this pairing. The Devanagari pairing's CSS puts `.num` on the display face. Mono is for code only.

## Typography

| Role | Family | Size | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Month | Mukta | 13px | 600 | 0.04em | `--ink-2` |
| Answer | Noto Serif Devanagari | 40px | 600 | -0.02em | `--ink` |
| Sentence | Mukta | 15px | 400 | 0 | `--ink-2` |
| Filter | Mukta | 15px | 600 | 0 | `--ink`, pressed on `--bg` |
| Name | Mukta | 15px | 600 | 0 | `--ink` |
| Meta | Mukta | 13px | 400 | 0 | `--ink-2` |
| Amount | Noto Serif Devanagari | 16px | 600 | 0 | `--ink` |
| In tag | Mukta | 11px | 600 | 0 | `--success-on-soft` |

The 40px remainder is the only display size. Row amounts stay 16px. Do not enlarge Salary because it is income.

## Motion

None. Filtering shows and hides rows immediately. A slide-in is decoration. Reduced motion has nothing to remove.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Filter | click | aria-pressed moves, rows outside that direction get hidden |
| Row | click | aria-pressed moves to that row |

## States

- Filter resting: surface, 1px line, height 44px, pill radius.
- Filter pressed: fill `--ink`, label `--bg`.
- Row resting: `--surface`.
- Row pressed: `--primary-soft`.
- Row hidden: the `hidden` attribute, not a zero height trick that leaves it in the reading order.
- The "in" tag sits on `--success-soft` with `--success-on-soft`. Out rows do not get a danger tag. Out is the ordinary direction and is written in the meta.
- Empty and failed are not this frame. Zero rows after a real load uses `mobile-list-empty`. A failed load uses `mobile-load-failed`. Do not draw either inside this list.
- Loading, if you add it, is a skeleton of five rows at 56px. It is not a spinner in the heading.

## Accessibility

- The remainder is the `h1`.
- The filter group is labelled "Direction".
- Each row's name is the name, the amount, and the meta, from the text content.
- `aria-pressed` on a filter is the selected direction. Only one filter is true.
- `aria-pressed` on a row is the selected line. Only one row is true.
- Hit target for a row is at least 56px. Filters are 44px tall.
- Contrast: `#1c2744` on `#f4ead6` and on `#fbf6ea` and on `#f3d2c8` clears 4.5. `#1b5e3d` on `#d6d8c2` clears 4.5. `#f4ead6` on `#1c2744` clears 4.5 for the pressed filter.
- The word "in" carries the direction. Colour is not the only signal.

## Responsive rules

- The frame is 390×844. Padding top 54px. Padding bottom 34px. Do not draw a status bar.
- At 360 wide, the amount stays on the right. The name may wrap. The amount does not drop under the name unless the row is under 320px, and then the amount is still 16px.
- On the web, the same list sits in the pass column, 720px in this demo, left aligned, with the heading at 56px. Do not turn it into a table with a sidebar to look like a staff tool. The filters in this demo are pills. When a family is locked, the filter uses that family's radius and control height. A pill survives only if the family button is already a pill.
- A tablet does not stretch these rows to 1180px. Use a readable column.

## Acceptance checklist

### Always

- [ ] The home of a personal ledger is this list, not a dashboard of cards.
- [ ] One display-size amount: what is left, or the figure they named.
- [ ] Rows are one line each: name, direction, date, amount.
- [ ] Money in and money out can be filtered. They are not the same row type.
- [ ] An amount with रु uses one face for the word and the digits.
- [ ] Nepal or India amounts use lakh grouping.
- [ ] The calendar system is labeled once on the screen.
- [ ] Empty and failed are other pieces, not a "No data" line in this list.

### This demo

- [ ] The heading is रु 31,300 at 40px in Noto Serif Devanagari.
- [ ] The label reads "Asar 2083 · BS".
- [ ] Five rows, newest first: Bhatbhateni, NEA, Bus, Rent, Salary.
- [ ] Rent is रु 1,24,000 and Salary is रु 1,80,000.
- [ ] All is pressed on the first frame. Out hides Salary. In shows only Salary.
- [ ] The heading does not change when the filter changes.
- [ ] Salary carries the word "in" on `#d6d8c2` with `#1b5e3d`.
- [ ] Bhatbhateni starts pressed. Tapping Rent moves the press.
- [ ] No tab bar is drawn. Top clearance is max(54px, env(safe-area-inset-top)). Bottom clearance is max(34px, env(safe-area-inset-bottom)).

## Implementation notes

Always: if they track cash and a wallet, those are different rows or a direction you can filter, not one blended "payment". If they named a festival limit, that limit is `budget-meter`, not a second list. This list is the lines.

The remainder in this demo is salary minus the four outflows: 1,80,000 − 1,24,000 − 18,400 − 4,200 − 2,100 = 31,300.

```js
rows.forEach(r => { r.hidden = f !== 'all' && r.dataset.dir !== f; });
```

Common mistakes:

- Replacing this list with four summary cards.
- A pie above the rows.
- Setting the amounts in a mono face so रु falls back.
- Writing 124,000 or 180,000.
- A date with no calendar label, or a mix of AD and BS on the same screen.
- Hiding rows with opacity, so a screen reader still reads them.
- Changing the 40px heading to the filtered total. The filter changes the evidence.
- Drawing the tab bar and this list as one piece. Compose them.
- An empty state that says "No data".
- Two display sizes, for the remainder and for Salary.

Where it sits:

1. It is the first screen of a personal money app. The decision is what is left, and which lines made it.
2. A row opens one line. That detail screen is still open unless this pass includes it.
3. Where the money went, as categories, is `chart-rank-spend`. Do not put that chart on this screen.
4. A line that is over its limit is `budget-meter`, a different screen.
5. After they add a line, `saved-banner` is the confirmation. Then they return here.
6. Zero lines uses `mobile-list-empty`. A failed fetch uses `mobile-load-failed`.
7. The phone shell is `phone-tab-plain` with the sections they actually have. Do not add a fourth tab because the tab demo has four.
8. When a theme is locked, the paper and the crimson become tokens. The sample nouns become their nouns.
9. Grain stays on the page, once.
10. The credit line stays on the token block.

Rebuild order:

1. Set the phone padding, the paper, Mukta, and Noto Serif Devanagari.
2. Place the BS label and the 40px remainder.
3. Place the sentence.
4. Place All, Out, and In. All starts pressed.
5. Place five rows, newest first, amounts in the display face.
6. Mark Salary as in. Mark Bhatbhateni pressed.
7. Wire the filters with the `hidden` attribute.
8. Wire row selection.
9. Confirm the heading never changes, and that no tab bar was added.
10. Map colours onto the locked theme if a kit is on.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
