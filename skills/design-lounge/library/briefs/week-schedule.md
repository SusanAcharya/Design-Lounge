<!-- Design Lounge Nº 460 · "Week schedule" · designlounge.vercel.app -->

# Week schedule

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

## What it is

A week board for Hollis. The title is Week of 28 Sep. Seven columns, Monday through Sunday. Four blocks: Yard lead on Tuesday, Month close on Wednesday, Biratnagar call on Thursday, Type review on Friday. Tuesday is today and its block starts pressed. The line under the title names the pressed block. This is not a month grid. A month is `calendar-month`. This is not a range picker. That picker is `date-range-picker`.

## Reference behaviour

1. Tuesday carries data-today and its block is aria-pressed true.
2. The line reads "Yard lead · Tuesday · 09:00".
3. Clicking another block moves aria-pressed and rewrites the line with the full weekday and the time.
4. Empty days stay empty. They are not disabled buttons.
5. Saturday and Sunday have no blocks.
6. The board does not create events.
7. One block is pressed at a time.

## Structure

```
1080px board
Week of 28 Sep
line
Mon Tue Wed Thu Fri Sat Sun
    [event] ...
```

- The board is 1080px.
- Days are a 7-column grid, gap 8px, min-height 360px.
- Each day is a surface card, padding 10px, radius 2px.
- An event is a button with a 3px left border.
- The title is Fraunces 40px.

## Tokens

```css
:root {
  --bg:#f4f1ea; --surface:#fffdf8; --ink:#1a1814; --ink-2:#5c564c;
  --line:#e3ddd2; --primary:#1f4d3a; --soft:#e7f2ec;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Title | Fraunces | 40px | 560 | 1 | 0 |
| Day | Public Sans | 12px | 500 | 1 | 0.06em |
| Event | Public Sans | 13px | 400 | 1.3 | 0 |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Pressed block | click | soft wash | green fill | none | instant |

## States

- Pressed: background #1f4d3a, text #fffdf8, aria-pressed true.
- Resting event: background #e7f2ec, text #1a1814, left border #1f4d3a.
- Today header: colour #1f4d3a.
- Empty day: header only.

## Accessibility

- Events are buttons with aria-pressed.
- Day names are headers inside sections.
- The detail line is the subtitle under the title.
- Do not rely on the green fill alone. The line also names the event.
- Focus ring is 2px #1f4d3a, offset 2px.
- Empty days have no fake buttons.

## Responsive rules

- At 1280 the board is 1080px.
- Below 900 the seven columns become a vertical list. Each day keeps its header.
- Do not switch to a month at a narrow width. Stay a week.

## Acceptance checklist

### Always

- [ ] Seven days, in order.
- [ ] One pressed block.
- [ ] The detail line names the event, the weekday, and the time.
- [ ] Empty days render.
- [ ] The title names the week.

### This demo

- [ ] The week is 28 Sep.
- [ ] Tuesday is today.
- [ ] Events are Yard lead 09:00, Month close 14:00, Biratnagar call 11:00, Type review 16:00.
- [ ] The first line is Yard lead · Tuesday · 09:00.
- [ ] Display is Fraunces. Text is Public Sans.

## Implementation notes

Write the weekday from a full-name list, not by appending "day" to Tue.

```js
const full = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][i];
sub.textContent = ev.name + " · " + full + " · " + ev.t;
```

Do not store the events in localStorage.

## Measurements to keep

- Board 1080px. Title 40px. Subtitle margin 0 0 18px.
- Grid gap 8px. Column min-height 360px. Card padding 10px.
- Event padding 8px, left border 3px, radius 0 2px 2px 0.
- Day label 12px, tracking 0.06em, uppercase.
- Pressed fill #1f4d3a.

## Wrong turns

- Do not draw a month.
- Do not let two blocks be pressed.
- Do not add drag to move an event.
- Do not colour each event differently.
- Do not invent events on Saturday.
- Do not use a time-grid of 24 hours unless the product asked for hours.

## Fit with the rest of the library

- A month is `calendar-month`.
- A range is `date-range-picker`.
- A clock time field is `time-field`.
- This board is a section, not a picker.
- Do not put it inside a dialog.
- The paper ground is #f4f1ea.

## Keyboard

- Tab moves through the four event buttons.
- Enter presses a block.
- aria-pressed moves to that block.
- Empty days are not tab stops.
- The detail line updates.
- Arrow keys are not required.
- Do not use a positive tabindex.
- Today is Tuesday.
- Focus ring offset is 2px.
- Only one pressed event.
- The title is not a button.
- Reduced motion changes nothing.
- The week label stays Week of 28 Sep.
- Do not open a popover on press. The line is the detail.
- Display type is Fraunces.
- Text type is Public Sans.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
