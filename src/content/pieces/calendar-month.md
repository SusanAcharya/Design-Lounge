---
title: "Calendar month"
summary: "One month, one chosen day. October 2026 opens with the 17th selected and the 3rd marked as today. Previous and next move a month."
platform: web
type: component
category: pickers
tags: [calendar, date, month, picker]
styles: [minimal, industrial]
motion: none
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#F6F4EF", "#FFFFFF", "#161513", "#1F4D3A", "#E7F2EC"]
fonts: ["IBM Plex Sans"]
related: [date-range-picker, slider-field, select-field]
---

# Calendar month

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the chosen day uses `--primary-soft` and the control height follows the family. A span of days is `date-range-picker`, not a second month beside this one.

## What it is

A single month for choosing one day. The dock slot opens on October 2026. The 17th is selected, on the soft green. The 3rd is today, with a 2px green rule along its bottom. Days from the previous and next month are visible and muted, and they are not buttons. Previous and next step one month, September then November, and no further. The status line names the chosen day: "17 October is the slot." This is not the two-month range picker. There is no preset column and no start-and-end band.

## Reference behaviour

1. The first frame is October 2026. The 17th is pressed. The 3rd has the today rule. The status line reads "17 October is the slot."
2. The week starts on Monday. October 2026 begins on a Thursday, so 28, 29, and 30 September show as muted days, and 1 November closes the last row.
3. Clicking a day in the visible month selects it, clears the previous selection, and rewrites the status line as "17 October is the slot." with that day and that month's name.
4. Previous shows September 2026. Next from October shows November 2026. Previous on September does nothing. Next on November does nothing.
5. The chosen day stays chosen when you leave its month. It highlights again when you return. Today is only marked in October.
6. Muted days are not buttons. Clicking them does nothing.
7. There is no animation. Focus ring is 2px `--focus`, offset 2px.

## Structure

```
padding 48px 64px
Dock                         12px
width 320
  [ ‹ ]  October 2026  [ › ]  each control 40px
  Mo Tu We Th Fr Sa Su        12px
  seven columns, each cell 40px
17 October is the slot.
```

- The month label is a paragraph, not a heading that competes with the page.
- Day names are `aria-hidden`. The grid is `role="group"` labelled by the month.
- A day in the month is a `button` with `aria-pressed`.
- A day outside the month is a `span`.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #5c564e;
  --line: #e4dfd4;
  --primary: #1f4d3a;
  --primary-soft: #e7f2ec;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Cell radius is 2px in this yard demo. The family replaces it. The chosen day is `--primary-soft`, not a solid circle in `--primary`. The range picker uses circles because a range has two ends. One day is a cell.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Month | sans | 14px | 500 | `--ink` |
| Weekday | sans | 12px | 400 | `--ink-2` |
| Day | sans | 14px | 400 | `--ink` |
| Chosen day | sans | 14px | 500 | `--ink` |
| Outside day | sans | 14px | 400 | `--ink-3` |
| Status | sans | 14px | 400 | `--ink` |

The where-line letter-spacing is 0.04em. Day numbers are centered in the 40px cell. They use tabular numbers if the face has them.

## Motion

None. The month replaces itself in one frame. Reduced motion has nothing to remove. Do not slide the grid.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Day | click | pressed cell, status sentence |
| Previous, Next | click | the month, within Sep–Nov 2026 |
| Focus | keyboard | 2px ring |

## States

- Day resting: 40px square, transparent, radius 2px.
- Day chosen: background `--primary-soft`, weight 500, `aria-pressed="true"`. Only one.
- Today: inset 2px bottom rule in `--primary`. Today can also be chosen. In this demo they are different days, so both states are visible.
- Outside day: `--ink-3`, not a button.
- Month buttons: 40px square, 1px `--line`, surface fill, radius 2px.
- Disabled month step: do not paint a fake button. The control stays, and the click does nothing at the end. If you disable it, use the disabled attribute and opacity 0.4.
- Focus-visible: 2px outline, offset 2px.

## Accessibility

- Previous and next have names: Previous month, Next month. The glyph is not the name.
- Weekday letters are hidden. The button's name is the day number. A product should add the full date to the accessible name, for example "17 October 2026".
- `aria-pressed` marks the chosen day. Remove it from the others.
- The status line is `role="status"`.
- Hit target: every day and both month buttons are 40px. On a phone, 44px.
- Contrast: `#161513` on `#e7f2ec` and `#5c564e` on `#f6f4ef` clear 4.5.
- Do not rely on the green rule alone for today. The status sentence names the chosen day. Today is a second mark, not the only information.

## Responsive rules

- At 1280 the calendar is 320px, padding 48px 64px.
- Below 640 it may grow to the content width, max 420px. Cells stay at least 40px, and 44px on a phone.
- Do not turn it into two months at a wide screen. Two months means the person is choosing a range, which is the other piece.
- A phone may present this month full width. It does not become a wheel.

## Acceptance checklist

- [ ] The first month is October 2026. The week starts on Monday.
- [ ] The 17th is pressed and its cell is `#e7f2ec`.
- [ ] The 3rd has a 2px `#1f4d3a` rule along the bottom.
- [ ] 28–30 September and 1 November are muted and are not buttons.
- [ ] Clicking a day rewrites the status line with that day and month.
- [ ] Previous reaches September and then stops. Next reaches November and then stops.
- [ ] The chosen day survives a month change and highlights on return.
- [ ] Cells and month buttons are 40px. The calendar is 320px wide.
- [ ] There is one chosen day, no range band, and no animation.
- [ ] Focus ring is 2px, offset 2px.

## Implementation notes

Build the cells from the month. Do not store fifty strings.

```js
const start = (first.getDay() + 6) % 7;
```

Monday is 0. `getDay()` treats Sunday as 0, so add 6 and take the remainder.

Common mistakes:

- A second month beside this one. That is `date-range-picker`.
- A range band, start circle, and end circle on a control that chooses one day.
- Making the trailing days into buttons that jump the month without saying so.
- A solid primary cell, so the day looks like a commit button.
- A library calendar with its own purple and its own radius.
- Hiding today and the selection in the same style, so the demo cannot show both.
- An infinite year scroller. This piece is three months so the ends are testable. A product may walk further, one month at a time, and must disable nothing in the middle.
- Locale dates you invented. October 2026 is this demo. A Nepali product that uses BS says so once, and does not mix 17 Aswin into this October grid.

Where it sits in a product:

1. Use it when the person picks one day: a slot, a delivery date, a published date.
2. A from-to report is `date-range-picker`.
3. An hour on a known day is `slider-field` beside this month, not instead of it.
4. The chosen cell is `--primary-soft`.
5. Radius and the 40px cell follow the family. Phone cells are at least 44px.
6. When a theme is locked, the soft fill and the today rule use that theme's `--primary-soft` and `--primary`.
7. One calendar. Do not put a second copy in a sidebar.
8. The status line is the confirmation. The cell is the control.
9. The where-line Dock is the screen name.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the month bar and the weekday row.
3. Paint October 2026, Monday first, 17 pressed, 3 marked today.
4. Wire a day click to the status line.
5. Wire previous and next within September, October, and November 2026.
6. Keep the chosen day when the month changes.
7. Map the chosen fill onto `--primary-soft` when a kit is on.

Copy you keep:

1. Dock.
2. October 2026, and September and November as the neighbours.
3. 17 October is the slot.
4. The 3rd of October is today.
5. Previous month. Next month.
