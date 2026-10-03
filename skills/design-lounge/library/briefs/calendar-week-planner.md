<!-- Design Lounge Nº 182 · "Calendar week planner" · designlounge.vercel.app -->

# Calendar week planner

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map the neutrals and the four calendar colours onto the kit tokens and keep the 15-minute grid.

## What it is

A full calendar app screen for a small pottery studio, called Tidewell. A mini month and calendar toggles sit on the left. A 7-day time grid from 8:00 to 19:00 fills the rest. Events snap to 15 minutes. Events that overlap sit side by side. A red line marks the time now. You can drag an event to move it, drag its bottom edge to resize it, click an empty slot to add a quick event, and move the selected event with the arrow keys. The look is soft and quiet: warm white, graphite ink, and four muted calendar colours. The detail worth copying is the overlap layout plus the snapping maths. Both are small and both are easy to get wrong.

This is not `week-schedule`. That piece is a static board of seven day cards with no time axis. This is not `calendar-month`. That piece is a date picker. This piece is the working week view of a calendar product.

## Reference behaviour

1. The first frame shows the week of 28 Sep to 4 Oct 2026. The header reads "28 Sep – 4 Oct 2026" and "Week 40".
2. Today is Thursday 1 October. Its date sits in a 30px graphite circle in the day header. The mini month marks 1 October the same way.
3. The time now is fixed at 14:20 in the demo. A 2px red line crosses the Thursday column at 14:20, with a 10px red dot at its left end. The gutter shows a red "14:20" pill on the same line. In a product, update the line once a minute.
4. 27 events are on the grid. "Shop shoot" (Thursday 14:00 to 15:30, Studio) starts selected. It has a 2px ring in its calendar colour and a small resize grip at the bottom.
5. Events that overlap in time share the column width. Two overlapping events split it into two lanes. Wednesday 13:00 to 15:00 shows Design crit, Courier pickup and Firing log in two lanes.
6. An event that is not in the last lane is drawn 1.7 lanes wide. The next lane sits on top of it. This keeps titles readable at 110px column width. A 1.5px ring in the page colour separates the stacked events.
7. Pointer down on an event selects it and focuses it. Moving the pointer more than 4px starts a drag. The event follows the pointer. Vertical moves snap to 15 minutes. Horizontal moves snap to whole days. The event keeps its length.
8. Pointer down on the bottom 8px of an event starts a resize. Only the end time changes. It snaps to 15 minutes. The shortest event is 15 minutes.
9. Events cannot go above 8:00 or below 19:00. A drag cannot leave the visible days.
10. On pointer up after a drag, the live region says the new time, for example "Shop shoot, Friday 2 October, 14:30 to 16:30".
11. Clicking an empty slot opens a popover next to that column. The start time is the clicked slot, rounded down to 15 minutes. The end time is 60 minutes later. A dashed ghost block shows the slot in the column. The title field takes focus.
12. The popover has a title field, a start select, an end select, four calendar chips (Work, Studio, Health, Home) with Studio checked, Cancel, and Save. Typing in the title updates the ghost block text.
13. Save adds the event, selects it, closes the popover, and announces "Added …". An empty title saves as "New event". Cancel or Escape closes it and returns focus to where it came from. Clicking outside the popover closes it.
14. The "New event" button in the sidebar opens the same popover at 15:00 today.
15. With an event focused, Arrow Up and Arrow Down move it by 15 minutes. Arrow Left and Arrow Right move it by one day. If it leaves the visible range, the view moves with it. Each move is announced. Delete or Backspace removes the event.
16. Unchecking a calendar in the sidebar hides its events. The count next to each calendar shows how many of its events fall in the visible days.
17. Today, Previous and Next change the visible range. Clicking a day in the mini month jumps to the week that holds it. The mini month shades the visible days as one band.
18. At 768px and below the grid shows 3 days, with today in the middle.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────────┐
│ [≈] Tidewell        [Today] ‹ ›  28 Sep – 4 Oct 2026                WEEK 40  │ 56px
├──────────────┬───────────────────────────────────────────────────────────────┤
│ [+ New event]│ gutter│ MON 28 │ TUE 29 │ WED 30 │ THU (1) │ FRI 2 │ SAT │ SUN │ 56px
│              ├───────┼────────┼────────┼────────┼─────────┼───────┼─────┼─────┤
│ October 2026 │  8:00 │        │        │        │         │       │░░░░░│░░░░░│
│ M T W T F S S│  9:00 │[Standup│[Standup│ ...    │         │       │░░░░░│░░░░░│
│ ▒▒▒▒▒(1)▒▒▒▒ │   ... │        │        │        │ [Shop ][P]       │░░░░░│░░░░░│
│              │ 14:20 ━━━━━━━━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━ (Thursday only)    │
│ My calendars │   ... │  60px per hour, 1px per minute, 660px tall            │
│ ■ Work    11 │ 19:00 │        │        │        │         │       │     │     │
│ ■ Studio   7 │       │        │        │        │         │       │     │     │
│ ■ Health   5 │                                                               │
│ ■ Home     4 │                                                               │
│ hint text    │                                                               │
└──────────────┴───────────────────────────────────────────────────────────────┘
  248px          56px gutter + 7 × minmax(0,1fr)
```

- The page is a CSS grid: `grid-template-columns: 248px minmax(0,1fr)` and `grid-template-rows: 56px minmax(0,1fr)`, height 100%.
- The top bar is a `header` that spans both columns. The range text is the only `h1` and has `aria-live="polite"`.
- The sidebar is an `aside` labelled "Calendars". It holds the New event button, the mini month section, the calendar list, and a short hint at the bottom.
- The mini month is a 7-column grid of 42 buttons, starting on Monday.
- The main area is a `main` with two rows: the day header and a scroll area.
- The day header and the grid both use `grid-template-columns: 56px repeat(var(--n), minmax(0,1fr))`. `--n` is 7, or 3 on narrow screens.
- Each day column is a `div` with `role="group"` and an `aria-label` like "Thursday 1 October". It is `position: relative`, 660px tall.
- Each event is a `div` with `role="button"`, `tabindex="0"`, `aria-pressed`, and an `aria-label` that holds the title, calendar, day and times. It is absolutely positioned inside its day column.
- The popover is a `form` with `role="dialog"` and `aria-labelledby` pointing at its heading. It is absolutely positioned inside `main`.
- A visually hidden `p` with `aria-live="polite"` carries every announcement.

## Tokens

```css
:root {
  /* neutrals */
  --bg: #faf8f4;          /* page, warm white */
  --surface: #fffefb;     /* top bar, sidebar, popover */
  --weekend: #f5f2ec;     /* Saturday and Sunday columns */
  --ink: #2b2a28;         /* graphite text, today circle, primary button */
  --ink-2: #55524d;       /* secondary text */
  --ink-3: #6f6b64;       /* hour labels, weekday labels */
  --line: #e8e4dc;        /* hour lines, column borders */
  --line-2: #f1ede6;      /* half-hour lines, hover */
  --now: #d6402f;         /* now line */
  --focus: #2b2a28;

  /* calendars: stroke, tint, text */
  --sage: #6f8f72;    --sage-t: #e6eee4;    --sage-k: #2f4a33;    /* Health */
  --clay: #b5694b;    --clay-t: #f5e4da;    --clay-k: #6b3320;    /* Studio */
  --slate: #5e7088;   --slate-t: #e3e8ef;   --slate-k: #2c3a4e;   /* Work */
  --mustard: #c29a2e; --mustard-t: #f6edcf; --mustard-k: #5e4a0e; /* Home */

  --sans: "Hanken Grotesk", system-ui, sans-serif;

  --r: 8px;          /* events, buttons, popover */
  --hh: 60px;        /* one hour */
  --gut: 56px;       /* time gutter */

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px;

  --shadow-sel: 0 0 0 2px var(--c), 0 8px 18px -8px rgba(43,42,40,.45);
  --shadow-lift: 0 0 0 2px var(--c), 0 14px 28px -10px rgba(43,42,40,.5);
  --shadow-pop: 0 18px 40px -18px rgba(43,42,40,.45);

  --ease: cubic-bezier(.2,.7,.2,1);
  --dur-micro: 160ms;
  --dur-pop: 180ms;
}
```

Each event sets three local variables from its calendar: `--c` (stroke), `--t` (tint background), `--k` (text). A class per calendar does it:

```css
.sage { --c: var(--sage); --t: var(--sage-t); --k: var(--sage-k); }
```

## Typography

One family, Hanken Grotesk, with `font-variant-numeric: tabular-nums` on the body so times line up.

| Role | Size | Weight | Line height | Tracking | Case | Colour |
| --- | --- | --- | --- | --- | --- | --- |
| Brand | 16px | 700 | 1.2 | -0.01em | as written | `--ink` |
| Range title (h1) | 20px | 600 | 1.2 | -0.02em | as written | `--ink` |
| Week label | 12px | 600 | 1.2 | 0.06em | upper | `--ink-3` |
| Day name | 12px | 600 | 1.2 | 0.06em | upper | `--ink-3`, today `--ink` |
| Day number | 20px | 600 | 30px | -0.02em | — | `--ink`, today `--surface` on `--ink` |
| Hour label | 11px | 400 | 1 | 0 | — | `--ink-3` |
| Event title | 12.5px | 600 | 1.3 | 0 | as written | `--k` |
| Event time | 12px | 400 | 1.3 | 0 | — | `--k` at 85% opacity |
| Sidebar heading | 13px | 600 | 1.3 | 0 | as written | `--ink` |
| Mini month day | 12px | 400 | 28px | 0 | — | `--ink`, other month `#a19c94` |
| Calendar row | 13.5px | 400 | 34px | 0 | as written | `--ink` |
| Popover label | 12px | 600 | 1.3 | 0.04em | upper | `--ink-3` |
| Popover title input | 15px | 600 | 40px | 0 | — | `--ink` |

Titles and times use ellipsis on one line. An event shorter than 45 minutes puts title and time on the same line.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Event position | keyboard move, calendar toggle, relayout | top, left, width, height | old → new | 160ms | `--ease` | none, jump |
| Event during drag | pointer move | top, left, height | follows pointer | 0ms | — | same |
| Event lift | drag starts | box-shadow | `--shadow-sel` → `--shadow-lift` | 160ms | `--ease` | none |
| Popover | opens | opacity, translateY | 0, 4px → 1, 0 | 180ms | `--ease` | none, appears |
| Now line | each minute in a product | top | old → new | 0ms | — | same |

Turn the transition off while a drag is active. Put a `dragging` class on `body` and set `transition: none` on events under it. Otherwise the event lags behind the pointer.

## States

- Event resting: tint background, 3px left border in the calendar stroke, text in the calendar text colour, radius 8px.
- Event hover: cursor `grab`. The bottom 8px shows cursor `ns-resize`.
- Event selected: `aria-pressed="true"`, ring `--shadow-sel`, and an 18 × 2px grip line centred 3px from the bottom in the stroke colour.
- Event dragging: ring `--shadow-lift`, z-index 9, cursor `grabbing` on the whole page.
- Event focus-visible: 2px graphite outline, offset 2px.
- Hidden calendar: its events are removed from the grid. The checkbox is an empty 16px square with a 2px border in the calendar colour.
- Empty slot hover: cursor `cell`.
- Ghost block: 1.5px dashed `--ink-3` border, radius 8px, `rgba(255,254,251,.7)` fill, text "New event" or the typed title.
- Today: graphite circle on the day number. `aria-current="date"` on the day header and on the mini month button.
- Weekend columns: `--weekend` background.
- Mini month visible range: one `--line-2` band across the visible days, rounded 6px at the two ends.
- Button hover: `--bg` background. Primary hover: `#3d3b38`.
- Empty week: the grid is still drawn with lines and the now line. Do not add an empty state message.

## Accessibility

- Each event is focusable with `role="button"`. Its `aria-label` reads "Shop shoot, Studio, Thursday 1 October, 14:00 to 15:30".
- Each event has `aria-describedby` pointing at a hidden line: "Arrow up and down move 15 minutes. Arrow left and right move one day. Delete removes."
- Keys on a focused event: Arrow Up and Down move 15 minutes, Arrow Left and Right move one day, Enter or Space selects, Delete or Backspace removes. Call `preventDefault` so the grid does not scroll.
- After a key move, keep focus on the same event. Reuse the DOM node instead of rebuilding it, or focus jumps to `body`.
- Every move, resize, add, delete and calendar toggle is announced in one `aria-live="polite"` region. Clear it, then set the text in the next frame, so a repeat message is read again.
- The popover is a `role="dialog"` with `aria-labelledby`. The title field takes focus when it opens. Escape closes it and returns focus to the opener. The calendar choice is a `fieldset` of radio inputs with a `legend`.
- The keyboard path to create an event is the New event button. Pointer users can also click a slot.
- Mini month buttons have full date labels, like "Thursday 1 October".
- Contrast: `#2b2a28` on `#faf8f4` is about 13:1. `#6f6b64` hour labels on `#faf8f4` are about 4.9:1. Each calendar text colour on its tint is above 7:1.
- Do not rely on colour alone for the calendar. The popover chips carry names, and the event label names the calendar.
- Hit targets: icon buttons 36px, calendar rows 34px tall across the full sidebar width, mini month days 28px. On phones the event blocks are the main target. Keep the hour at 60px so a 30-minute event is 27px tall at least.

## Responsive rules

- At 1280 and wider: sidebar 248px, 7 days, 60px per hour, the full 8:00 to 19:00 range fits without scrolling.
- At 1024 (below 1100): sidebar 216px. Columns get narrower. The 1.7-lane width keeps overlap titles readable.
- At 768 (below 960): the sidebar is hidden. A 36px "+" button appears at the right of the top bar and opens the same popover. Below 768 the grid switches to 3 days with today in the middle. Previous and Next move 3 days.
- Below 640: the top bar wraps. The brand shows the mark only, the range title drops to its own line at 16px, and the week label hides. The gutter becomes 44px. Day headers stack the day name over the number. Events under 45 minutes show the title only. The grid scrolls vertically inside its area. The page never scrolls sideways.
- On phones, the 3-day view is the default. If the product needs a list instead, use an agenda: one row per event grouped by day, with the same colour stripes. Do not shrink 7 columns into 390px.
- The popover is `min(300px, 100vw - 24px)` wide on phones and is clamped inside the main area.

## Acceptance checklist

### Always

- [ ] The grid uses `minmax(0,1fr)` columns and never scrolls sideways at any width.
- [ ] One hour is a fixed pixel height. Times convert to pixels with one shared factor.
- [ ] Moves and resizes snap to 15 minutes. Day moves snap to whole columns.
- [ ] An event keeps its length when moved. Resize changes only the end. The minimum length is 15 minutes.
- [ ] Overlapping events are laid out in lanes. No two events cover each other's title fully.
- [ ] Drag uses pointer events with pointer capture, and a 4px threshold before a drag starts.
- [ ] Clicking an empty slot opens a dialog with title, start, end and calendar. Escape closes it and returns focus.
- [ ] Arrow keys move the focused event and keep focus on it.
- [ ] Every change is announced in a polite live region.
- [ ] The now line is drawn only in today's column.
- [ ] Under 768px the grid shows 3 days or an agenda, not 7 squeezed columns.
- [ ] Focus rings are visible on events, buttons, mini month days and popover fields.

### This demo

- [ ] The first frame shows 28 Sep – 4 Oct 2026, Week 40, with Thursday 1 October as today.
- [ ] The now line sits at 14:20 with a red "14:20" pill in the gutter.
- [ ] "Shop shoot", Thursday 14:00 to 15:30, starts selected.
- [ ] The calendars are Work (slate), Studio (clay), Health (sage) and Home (mustard), with counts 11, 7, 5 and 4.
- [ ] The grid runs from 8:00 to 19:00 at 60px per hour.
- [ ] Event radius is 8px with a 3px left stripe.

## Implementation notes

**1. Lane layout for overlaps.** Sort by start, then by longer first. Walk the list. Keep a cluster of events that overlap each other in a chain. Each lane remembers when it frees up. Put each event in the first free lane. When an event starts after the cluster ends, close the cluster and give every member the cluster's lane count.

```js
function lay(list) {
  list.sort((a, b) => a.s - b.s || b.e - a.e);
  let cluster = [], lanes = [], end = -1;
  const flush = () => { cluster.forEach(x => x.n = lanes.length); cluster = []; lanes = []; end = -1; };
  for (const x of list) {
    if (cluster.length && x.s >= end) flush();
    let i = lanes.findIndex(free => free <= x.s);
    if (i < 0) { i = lanes.length; lanes.push(0); }
    lanes[i] = x.e; x.k = i; cluster.push(x); end = Math.max(end, x.e);
  }
  flush();
}
// width: last lane gets 100/n %, others min(100 - k*100/n, 170/n) %, z-index 1 + k
```

Common mistake: giving every event in a day the same lane count. Only events that touch in a chain share lanes. A 9:00 standup should stay full width even if the afternoon has three overlaps.

**2. Drag and resize with snapping.** Capture the pointer on the grid container, not on the event. The event node may move to another column during the drag, and capture on a moved node can break. Store the start values and add a snapped delta.

```js
grid.addEventListener('pointerdown', e => {
  const el = e.target.closest('.ev'); if (!el || e.button) return;
  const x = byId(el.dataset.id);
  drag = { x, mode: e.target.classList.contains('grip') ? 'size' : 'move',
           x0: e.clientX, y0: e.clientY, s: x.s, e: x.e, d: x.d, moved: false };
  grid.setPointerCapture(e.pointerId);
});
grid.addEventListener('pointermove', e => {
  if (!drag) return;
  const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
  if (!drag.moved && Math.hypot(dx, dy) < 4) return;
  drag.moved = true;
  const dm = Math.round(dy / pxPerMin / 15) * 15, x = drag.x;
  if (drag.mode === 'move') {
    const len = drag.e - drag.s, colW = cols[0].getBoundingClientRect().width;
    x.s = clamp(drag.s + dm, 480, 1140 - len); x.e = x.s + len;
    x.d = clamp(drag.d + Math.round(dx / colW), firstDay, lastDay);
  } else x.e = clamp(drag.e + dm, x.s + 15, 1140);
  render();
});
```

Common mistakes: snapping the absolute pointer position instead of the delta, so the event jumps under the cursor. Forgetting `touch-action: none` on events, so touch drags scroll the page. Leaving the 160ms transition on during the drag.

**3. Keep nodes, keep focus.** Render by reusing one DOM node per event id. Only call `append` when the event changes column, and refocus it if it had focus. Rebuilding with `innerHTML` drops focus on every arrow key.

```js
let el = els.get(x.id) || makeEventNode(x);
if (el.parentNode !== col) { const had = document.activeElement === el; col.append(el); if (had) el.focus(); }
```

Rebuild order:

1. Lay out the shell grid, the top bar and the sidebar.
2. Draw the day header and the 660px columns with hour and half-hour lines as background gradients.
3. Place events with the minute-to-pixel factor and the lane layout.
4. Add the now line and the gutter pill.
5. Wire selection, keyboard moves and the live region.
6. Add drag, then resize, then the popover.
7. Add the mini month and calendar toggles.
8. Add the 3-day switch at 768px.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
