<!-- Design Lounge Nº 428 · "Tasks table with inline editing" · designlounge.vercel.app -->

# Tasks table with inline editing

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A sprint board for a small web team ("Quillo"), drawn as a table instead of columns. Ten tasks are grouped under To do, In progress and Done, each group behind a pill-shaped toggle that collapses it. Every cell is editable where it sits: click a title to rename it, pick an assignee from an inline menu, nudge the due date a day at a time, click the priority flag to raise it. Rows drag by a grip handle, within a group or across into another, which changes the task's status. The look is chunky and cheerful: butter page with a dot grid, a 2px ink border and a hard 6px offset shadow on the board, chips with ink outlines. The detail worth copying is that drag-to-reorder has a full keyboard twin: focus a handle and press the arrows, and the task walks up and down, crossing group headers into the next status.

## Reference behaviour

1. First frame: To do (3) and In progress (4) are open; Done (3) is collapsed. Manual order. The header progress reads "3 of 10 done" with a mint fill at 30%.
2. Clicking a group toggle collapses or expands it. The chevron rotates −90° when collapsed.
3. Clicking a title turns it into a text input with the text selected and a 3px tomato offset shadow. Enter saves, Escape cancels, blur saves. An empty value is ignored. Focus returns to the title button.
4. The assignee cell shows a coloured initial avatar and a borderless native select (Mo, Kit, Juno, Ravi, Sol). Changing it updates the avatar colour.
5. The due date is a pill: "Today", "Tomorrow" or "6 Oct". Overdue dates (before today, 4 Oct) are tomato on a pale tint; today and tomorrow are sun yellow with an ink outline. Small ‹ › buttons appear on row hover or focus and move the date by one day. With the pill focused, ArrowUp/Right add a day, ArrowDown/Left subtract one. Done tasks are never overdue.
6. The priority pill cycles Low → Medium → High → Urgent → Low on each press, with a flag icon in the priority colour. Urgent fills tomato with white text and an ink border. The pill squashes to 92% on press.
7. Dragging a grip lifts the row: white fill, 2px ink ring, 5px/6px hard shadow, rotated −0.6° and scaled 1.01. As the pointer crosses rows, the row moves live into the slot above or below the midpoint. Hovering a group header drops it into that group, or into the end of the previous group if the pointer is in the header's upper half. On release the row lands with a sun-yellow flash fading over 500ms, and its status becomes the group it sits in. Dropping into a collapsed group expands it.
8. Keyboard reorder: focus a grip, press ArrowUp/ArrowDown. The task swaps with its neighbour; at a group boundary it moves to the end of the previous group or the start of the next one and the status changes. Each move is announced ("Moved to In progress").
9. Clicking Task, Assignee, Due or Priority sorts within each group: first click ascending, second descending, third returns to manual order. While sorted, dragging or keyboard-moving a task first freezes the sorted order as the new manual order.
10. Done titles are struck through with a 2px mint line and set in `--ink-3`.
11. The progress bar animates its width with a slight overshoot whenever a task enters or leaves Done.

## Structure

```
page #FFF1C9 + 22px dot grid, padding 28px; board max-width 1080px, radius 22px, 2px ink, 6px 6px 0 ink
+--------------------------------------------------------------------------+
| (•) Sprint 14 · Launch week  (Bricolage 30/800)    3 of 10 done [▓▓░░░░] |  20/24 padding
| Quillo · Web team · ends Fri 9 Oct (mono 12)                              |
+==========================================================================+  2px ink
|     TASK ↕                     ASSIGNEE ↕     DUE ↕          PRIORITY ↕  |  thead 40px
+==========================================================================+
| v (To do) 3 tasks                                                         |  group 46px
| ⠿  Write launch-day status page copy   (M) Mo v    ‹ (6 Oct) ›   [⚑ Medium] |  row 50px
| ⠿  Swap pricing toggle to annual ...    (K) Kit v   ‹ (7 Oct) ›   [⚑ High]   |
| v (In progress) 4 tasks                                                   |
| ⠿  Fix double-submit on checkout ...    (R) Ravi v  ‹ (3 Oct) ›   [⚑ Urgent] |  overdue + urgent
| > (Done) 3 tasks                                                          |  collapsed
+--------------------------------------------------------------------------+
| Manual order unless a column is sorted   Enter rename · ↑↓ handle · ↑↓ date |  foot, mono 12
+--------------------------------------------------------------------------+
```

- `main.board` labelled by the `h1`.
- One `table` with a hidden caption. One `tbody` per status, `data-s="todo|doing|done"`.
- Each `tbody` starts with `tr.grp` holding `th colspan="5" scope="rowgroup"` and a full-width toggle button with `aria-expanded`.
- Task rows: handle button, title button (or input while editing), assignee select, due pill with two nudge buttons, priority button.
- An empty open group shows one row: "Nothing here. Drag a task in."
- A hidden polite live region.

## Tokens

```css
:root {
  --bg: #fff1c9;        /* butter */
  --surface: #fffdf4;
  --sunk: #fff7dc;      /* thead, hover */
  --ink: #1f1a2e;
  --ink-2: #4a4458;
  --ink-3: #6b6478;
  --line: #efe2b8;
  --accent: #ff5a36;    /* tomato: focus, edit shadow, header dot */
  --todo: #bfe0ff;  --doing: #ffd34d;  --done: #9fe3c4;
  --p-low: #8a8496; --p-med: #2f7de1; --p-high: #e8890c; --p-urgent: #cf3319;
  --sans: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;
  --r-board: 22px; --r-sm: 9px; --r-pill: 99px;
  --border: 2px solid var(--ink);
  --shadow-board: 6px 6px 0 var(--ink);
  --shadow-lift: 0 0 0 2px var(--ink), 5px 6px 0 var(--ink);
  --row: 50px; --group: 46px; --thead: 40px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
}
```

Assignee colours: Mo `#ffb4a2`, Kit `#bfe0ff`, Juno `#c9f0a8`, Ravi `#ffd34d`, Sol `#e8c8ff`.

## Typography

| Role | Family | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| Title | Bricolage Grotesque | 30px | 800 | -0.03em, line-height 1 |
| Sub | DM Mono | 12px | 400 | `--ink-3` |
| Column header | DM Mono | 11px | 500 | 0.06em, upper |
| Group chip | Bricolage | 13px | 700 | 26px pill, ink outline |
| Group count | DM Mono | 12px | 500 | `--ink-3` |
| Task title | Bricolage | 15px | 700 | -0.01em |
| Assignee | Bricolage | 14px | 500 | — |
| Due pill | DM Mono | 12px | 500 | 30px tall |
| Priority pill | Bricolage | 13px | 700 | 30px tall |
| Foot | DM Mono | 12px | 400 | `kbd` with 1.5px border |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Group chevron | toggle | rotate | 0 → −90° | 300ms | spring |
| Drag lift | pointerdown on grip | transform, shadow | none → rotate(−.6deg) scale(1.01) + lift shadow | instant | — |
| Live reorder | pointer crosses midpoint | DOM position | — | instant | — |
| Landing | drop or key move | background | `--doing` → surface | 500ms | standard |
| Priority press | :active | scale | 1 → .92 | 200ms | spring |
| Nudge buttons | row hover / focus-within | opacity | 0 → 1 | 150ms | standard |
| Progress | done count changes | width | old → new % | 500ms | spring |

Reduced motion: transitions 1ms, landing flash removed, the dragged row keeps its shadow but drops the rotation and scale.

## States

- Row hover: `#fffaea`; nudges appear.
- Title button hover: 1.5px dashed `--line` border and `--sunk` fill, cursor text. Editing: input with 2px ink border, white fill, `3px 3px 0 --accent`.
- Due: default outline `--line`; soon (today/tomorrow) `--doing` fill with ink border; late tomato text and border on `#fff0ea`.
- Priority: outline in `--line`, text and flag in the priority colour, border takes the colour on hover; Urgent is filled.
- Dragging: as described; cursor grabbing.
- Group collapsed: rows removed from the DOM, count still shown.
- Sort header: inactive ↕ at 35%; active shows ↑ or ↓ in a 16px ink circle.
- Focus-visible: 2.5px tomato outline, offset 2px, 8px radius.

## Accessibility

- Group toggles are buttons with `aria-expanded`; the `th` uses `scope="rowgroup"`.
- Grip buttons are labelled "Move <title>. Use up and down arrows". They take pointer and keyboard input.
- Title buttons are labelled "<title>, rename". The edit input has a hidden label "Task title".
- Assignee selects are labelled "Assignee for <title>".
- Due pills are labelled with the full date, "overdue" when late, and the arrow-key hint. Nudge buttons are `tabindex="-1"` because the pill's arrow keys cover them.
- Priority buttons are labelled "Priority High. Press to raise".
- `aria-sort` on the four sortable `th`s; "none" when manual.
- Every move, rename, assignment, date and priority change goes to the live region.
- Focus stays on the control that was used after each re-render, including the grip after a move.
- Contrast: `--ink-3` on surface 5.4:1; Urgent white on `#cf3319` 5:1.

## Responsive rules

- ≥1280: as drawn. Title column 44%.
- 1024: board fills the width; columns compress, titles wrap to two lines.
- 760 and below: rows become cards. The thead becomes a wrapping row of sort chips (the grip header hides). Each task is a grid `36px 1fr` with the grip on the left, the title on top, and assignee, due and priority sharing one line below (start, centre, end). Nudge buttons are always visible. The assignee select narrows to 76px. The board shadow drops to 4px 4px. The keyboard hints in the foot hide.
- 375: no page overflow; the meta line fits assignee, date with nudges, and priority.

## Acceptance checklist

### Always

- [ ] Tasks are grouped by status in separate `tbody`s with collapsible headers using `aria-expanded`.
- [ ] Title edits in place: Enter saves, Escape cancels, blur saves, focus returns to the title.
- [ ] Assignee, due date and priority change in the row without a dialog.
- [ ] Rows drag by a handle, reorder live, and can cross into another group, changing status.
- [ ] Every drag has a keyboard equivalent on the handle with announcements.
- [ ] Sorting is per group, three-state (asc, desc, manual), with `aria-sort`.
- [ ] Dragging while sorted freezes the sorted order first.
- [ ] Overdue dates are visibly different and spoken as overdue.
- [ ] At 375 the rows are cards and nothing scrolls sideways.

### This demo

- [ ] Ten tasks: To do 3, In progress 4, Done 3; Done collapsed on load.
- [ ] Header "Sprint 14 · Launch week" with "3 of 10 done".
- [ ] "Fix double-submit on checkout button" is Urgent and overdue (3 Oct).
- [ ] Board: 2px ink border, 22px radius, 6px 6px 0 ink shadow; rows 50px.
- [ ] Today is 4 Oct 2026; Today and Tomorrow pills are sun yellow.

## Implementation notes

Live drag without a ghost element. Capture the pointer on the grip, then move the real row in the DOM as the pointer crosses other rows' midpoints. Read the DOM order back into data on release:

```js
table.addEventListener("pointermove", e => {
  if (!drag) return;
  for (const r of table.querySelectorAll("tr.task:not(.dragging), tr.grp, tr.empty")) {
    const b = r.getBoundingClientRect();
    if (e.clientY < b.top || e.clientY > b.bottom) continue;
    if (r.classList.contains("task")) {
      const after = e.clientY > b.top + b.height / 2;
      r.parentNode.insertBefore(drag.row, after ? r.nextSibling : r);
    } else {
      r.closest("tbody").querySelector("tr.empty")?.remove();
      r.after(drag.row);
    }
    break;
  }
});
```

On release, rebuild the array from the DOM, but keep the hidden tasks of collapsed groups. Collect DOM ids first, or the dragged task gets counted twice (once by its old status, once by its new one):

```js
const inDom = new Set([...table.querySelectorAll("tr.task")].map(r => +r.dataset.id));
const out = [];
for (const tb of table.querySelectorAll("tbody")) {
  const s = tb.dataset.s;
  out.push(...tasks.filter(t => t.s === s && !inDom.has(t.id)));
  tb.querySelectorAll("tr.task").forEach(r => { const t = byId(r.dataset.id); t.s = s; out.push(t); });
}
tasks = out;
```

Enter to save the title must `preventDefault()`. Otherwise focus moves to the title button during keydown, the same Enter activates the button, and the field reopens.

Common mistakes:

- Drag with no keyboard path.
- A modal or side panel to edit a title.
- Native `input type="date"` in a cross-origin iframe with `showPicker()`; it throws. Nudges and arrow keys avoid it.
- Re-animating the landing flash on every render; add the class only to the moved row.
- Sorting the whole table and losing the groups. Sort inside each group.
- Soft drop shadows. This family uses hard offset shadows in ink.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
