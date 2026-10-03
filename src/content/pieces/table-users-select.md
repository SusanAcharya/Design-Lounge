---
title: "Members table with range select"
summary: "An admin members table: shift-click range selection, inline role menus that save on change, an invite row, and numbered pagination."
platform: web
type: component
category: data
tags: [table, admin, selection, pagination, invite]
styles: [minimal, swiss]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#EEF0F3", "#FDFDFE", "#0D0F14", "#1747E5", "#EDF1FF"]
fonts: ["Geist", "Geist Mono"]
related: [settings-team-members, selection-bar, pagination]
---

# Members table with range select

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The members page of a workspace admin console ("Keystone"). Twenty-four people in a crisp white panel, eight per page. A checkbox column supports shift-click range selection like a mail client; each role is a borderless native select that saves the moment it changes; an invite row sits at the top of the body so adding someone happens in the table, not in a modal. Selection shows in the header as a count with Select all 24, Clear and Remove. The detail worth copying is the range selection: shift-click, Shift+Space and Shift+Arrow all extend from an anchor, and it works the same with mouse and keyboard.

## Reference behaviour

1. First frame: sorted by Name, ascending; page 1 of 3; Chloe Varga, Dario Monti and Elif Aydin are selected. The header shows "3 selected", Select all 24, Clear, Remove. The select-all checkbox is indeterminate.
2. Clicking a checkbox toggles that member and sets it as the anchor.
3. Shift-clicking another checkbox on the same page sets every row between the anchor and it to the clicked box's new state. The live region says "5 rows selected. 5 selected."
4. Keyboard: on a row checkbox, ArrowUp/ArrowDown move focus to the neighbouring row checkbox. Shift+ArrowDown/Up selects the current and next row and moves focus. Shift+Space selects the range from the anchor to the focused row.
5. The select-all checkbox toggles the current page only. When anything is selected and not everything, a Select all 24 button selects every member across pages.
6. Remove deletes the selected members except the Owner and announces the count. Clear empties the selection and returns focus to select-all.
7. With nothing selected, the header shows a hint: "Shift + click selects a range".
8. Each role cell is a native `select` with no visible border until hover. Changing it updates the member, flashes a green "saved" label beside it for 1.4s, and announces "Dario Monti is now Admin". The Owner's select is disabled and has no chevron. Owner is not offered in other menus.
9. Invite row: an email field, a role select (default Editor) and a black Send invite button. An invalid address shows "Enter a full email address, like sam@keystone.co" in red under the field and sets `aria-invalid`. A duplicate shows "That person is already a member". A valid address adds an Invited member, sorts by Last active descending so they appear first, flashes the new row pale yellow for 1.2s, keeps focus in the email field, and announces it.
10. Name, Role, Status and Last active sort; a second click reverses. Role sorts by rank (Owner, Admin, Editor, Viewer, Billing). Sorting returns to page 1.
11. Pagination shows "1–8 of 24", previous, numbered pages, next. The current page has an ink outline and `aria-current="page"`. Previous is disabled on page 1, next on the last page. Selection persists across pages.

## Structure

```
page #EEF0F3, padding 28px, panel max-width 1100px, radius 10px
+------------------------------------------------------------------------------+
| keystone / settings / members (mono 12)        3 selected [Select all 24] [Clear] [Remove] |
| Members [24]                                                                   |  18/20 padding
+------------------------------------------------------------------------------+
| [■] Name ⇅              Role ⇅         Team        Status ⇅     Last active ⇅ |  thead 38px
+------------------------------------------------------------------------------+
| [+] [ Invite by email, e.g. sam@keystone.co        ] [Editor v] [Send invite] |  invite 56px
| [ ] (AB) Ada Brennan       Owner          Platform    • Active     3m ago     |  row 52px
|          ada.brennan@keystone.co                                              |
| [x] (CV) Chloe Varga       Viewer v       Design      • Active     1h ago     |  selected tint
| ...eight rows                                                                 |
+------------------------------------------------------------------------------+
| 1–8 of 24                                             ‹  [1]  2  3  ›        |  footer 56px
+------------------------------------------------------------------------------+
```

- `main.panel` labelled by the `h1`; the count badge is a `span` inside it.
- The selection area is a `div` in the header that swaps between the hint and the action buttons.
- One `table`; the invite row is the first `tr` of `tbody`, holding a `form novalidate` in a single `td colspan="6"`.
- Each member row: checkbox, identity (avatar square, name, mono email), role `select`, team text, status dot, mono last-active.
- Footer: a range `span` and `nav aria-label="Pages"` with buttons.
- A hidden polite live region.

## Tokens

```css
:root {
  --bg: #eef0f3;
  --surface: #fdfdfe;
  --sunk: #f6f7f9;          /* thead, row hover */
  --ink: #0d0f14;
  --ink-2: #454b57;
  --ink-3: #626977;
  --line: #e3e6eb;
  --line-2: #cfd3da;
  --accent: #1747e5;        /* cobalt: checks, focus, active sort */
  --accent-soft: #edf1ff;   /* selected row */
  --accent-line: #c4d0fb;   /* selected row rule */
  --ok: #127a4a;  --warn: #9a5b00;  --bad: #b42318;
  --flash: #fff6d6;
  --sans: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --r: 6px; --r-panel: 10px;
  --row: 52px; --thead: 38px; --control: 32px;
  --ease: cubic-bezier(.2,.7,.2,1);
}
```

Avatar tints cycle: `#dfe6ff`, `#e3f1e8`, `#fbe9d0`, `#f3e0ea`, `#e4e7ec`, `#dff2f4`.

## Typography

| Role | Family | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| Breadcrumb | Geist Mono | 12px | 400 | `--ink-3` |
| Title | Geist | 20px | 600 | -0.015em |
| Count badge | Geist Mono | 12px | 500 | 1px `--line` box |
| Column header | Geist | 12px | 500 | sentence case, `--ink-3` |
| Name | Geist | 14px | 500 | — |
| Email, last active, range | Geist Mono | 12px | 400 | `--ink-3` |
| Role select | Geist | 14px | 500 | — |
| Status | Geist | 13px | 400 | 6px dot |
| Buttons | Geist | 13px | 500 | 32px tall |
| Page numbers | Geist Mono | 13px | 500 | 32px squares |

Column headers are sentence case, not caps. The mono face carries every machine value: emails, times, ranges, page numbers.

## Motion

| Thing | Trigger | Property | Duration | Easing |
| --- | --- | --- | --- | --- |
| Checkbox | toggle | background, border | 120ms | standard |
| "saved" label | role change | opacity 0 → 1, held 1.4s, → 0 | 200ms | standard |
| New invite row | invite sent | background `--flash` → none | 1200ms | standard |

Nothing slides. Reduced motion: transitions 1ms, flash removed.

## States

- Row hover: `--sunk`. Selected: `--accent-soft`, bottom rule `--accent-line`.
- Checkbox: 16px, 1.5px `--line-2`, radius 4px; hover border `--ink-3`; checked/indeterminate cobalt with white mark.
- Role select: transparent border; hover 1px `--line-2` and surface fill; focus cobalt border. Disabled (Owner): `--ink-3`, no chevron.
- Status: Active green dot, Invited hollow amber ring with amber text, Suspended red dot.
- Sort: inactive double chevron at 40%; active cobalt with the unused half at 25%.
- Invite error: field border `--bad`, message mono 12px `--bad` under the row.
- Pager: current outlined in ink; hover `--sunk` with `--line` border; disabled arrows `--line-2`.
- Danger button: Remove uses `--bad` text on the default outline button.
- Focus-visible: 2px cobalt outline, offset 2px.

## Accessibility

- Row checkboxes are labelled "Select Ada Brennan"; the header checkbox "Select all on this page", with `indeterminate` set in script.
- The caption explains Shift-click and Shift-Space.
- Keyboard map on a row checkbox: Space toggles; Shift+Space range from anchor; ArrowUp/Down move; Shift+ArrowUp/Down extend.
- Role selects are native and labelled "Role for Dario Monti"; changes are announced.
- Invite field has a visually hidden label, `aria-invalid`, and `aria-describedby` pointing at the error.
- Pager buttons are labelled "Page 2", "Previous page", "Next page"; current has `aria-current="page"`.
- After every re-render focus returns to the same control, and moves to the current page button if the previous one became disabled.
- Contrast: `--ink-3` on surface 5.3:1; amber `#9a5b00` 5.6:1; cobalt on white 6.6:1.

## Responsive rules

- ≥1280: as drawn.
- 1024: panel fills the width; email ellipsises.
- 760 and below: rows become cards. Thead becomes a wrapping row of sort chips with select-all first; Team hides. Each member row is a grid `28px 1fr auto` with areas `"sel who role" "sel meta st"`; last active sits under the name, indented 38px. The invite row wraps: email full width, role and Send invite below. The selection buttons wrap under the title.
- 375: no page overflow; all controls stay 32px tall or more.

## Acceptance checklist

### Always

- [ ] Shift-click selects or clears the whole range between the anchor and the clicked row.
- [ ] Shift+Space and Shift+Arrow extend selection from the keyboard.
- [ ] The header checkbox reflects the current page: checked, indeterminate or empty.
- [ ] A Select all N control appears when the selection is partial.
- [ ] Role changes save on change with a visible confirmation and a live announcement; the owner cannot be changed or removed.
- [ ] Invite validates email and duplicates inline, with `aria-invalid` and a described error.
- [ ] Pagination has previous/next, numbered pages, `aria-current`, and a range label.
- [ ] Sortable headers carry `aria-sort`.
- [ ] At 375 wide the rows are cards and the page does not scroll sideways.

### This demo

- [ ] 24 members, 8 per page, "1–8 of 24".
- [ ] First frame: Name ascending, Chloe, Dario and Elif selected, "3 selected".
- [ ] Ada Brennan is Owner with a disabled role.
- [ ] Rows 52px, thead 38px, invite row 56px, panel radius 10px.
- [ ] Inviting noor.ali@keystone.co puts Noor Ali first as Invited, role Editor.

## Implementation notes

Range selection from an anchor. Store the last toggled id; on shift, apply the clicked box's new state to every row between, on the visible page:

```js
function toggle(id, shift, on) {
  if (shift && anchor != null) {
    const ids = view.map(u => u.id), i = ids.indexOf(anchor), j = ids.indexOf(id);
    if (i > -1) {
      const [a, b] = i < j ? [i, j] : [j, i];
      ids.slice(a, b + 1).forEach(k => on ? sel.add(k) : sel.delete(k));
      anchor = id; return;
    }
  }
  on ? sel.add(id) : sel.delete(id);
  anchor = id;
}
// click handler: toggle(id, e.shiftKey, checkbox.checked)
```

Keyboard-triggered clicks do not reliably carry `shiftKey`, so handle Shift+Space in `keydown` yourself and `preventDefault()` the native toggle.

The borderless inline select. Keep it native so keyboard and screen readers work, and draw the chevron as a sibling SVG:

```css
.role { position: relative; display: inline-flex; align-items: center; }
.role select { appearance: none; height: 30px; padding: 0 28px 0 10px; border: 1px solid transparent;
  border-radius: 6px; background: transparent; font-weight: 500; }
.role select:hover { border-color: var(--line-2); background: var(--surface); }
.role svg { position: absolute; right: 8px; width: 14px; pointer-events: none; }
.role select:disabled + svg { display: none; }
```

Common mistakes:

- A select-all that silently selects every page. Page first, then offer Select all N.
- A modal for inviting one person. The row is the form.
- A Save button for role changes. It saves on change and says so.
- Letting the owner be demoted or removed by a bulk action.
- Losing focus after every re-render, which makes Shift+Arrow unusable.
- Caps column headers. This family uses sentence case and mono for values.
