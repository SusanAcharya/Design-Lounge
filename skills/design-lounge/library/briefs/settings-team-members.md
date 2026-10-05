<!-- Design Lounge Nº 443 · "Team members settings" · www.designlounge.live -->

# Team members settings

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep black and white for everything, and red only for destructive actions and errors.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The Members page in the settings of a design studio workspace called Halden Studio. It lets an owner invite people by email, change roles in place, see who has not accepted yet, and remove someone after a confirm. The look is Swiss: white page, black type, a 48px bold heading, a 2px black rule under the header, 1px hairlines between rows, 6px radii, and one red that only appears on Revoke, the remove hover, the Remove button, and errors. The detail worth copying is the seat meter: ten segments, solid for members, hatched for pending invites, grey for free, so the reader sees at once why an invite might be blocked.

## Structure

```
1280 x 800
+-----------+-------------------------------------------------------------+
| nav 220   | main, padding 40 56, content max 980                        |
| [] Halden | Settings / Workspace                                        |
| WORKSPACE | Members (48px)                       8 of 10 seats  Team plan|
|  General  | lead, 48ch                           [##########] 10 segs   |
| |Members  |                                      6 active 2 invited 2 free|
|  Billing  | ============================================ 2px black rule |
|  Security | Invite by email                                             |
| ACCOUNT   | [chip][chip] input ......... ] [Member  v] [Send 2 invites] |
|  Profile  | hint 12px                                                   |
|  Notif.   | Members 6                       [search 240] [All roles v]  |
|           | NAME        EMAIL          ROLE      LAST ACTIVE      x     |
|           | ----------------------------------------------- 1px black  |
|           | [IS] Ingrid  ingrid@...    Owner     . Active now     x     |
|           | [MR] Mateo   mateo@...     Admin v   2 hours ago      x     |
|           | ...6 rows, 52px each                                        |
|           | Pending invites 2                                           |
|           | [L] lena.vogt@...    Member   Sent 2 days ago  Resend Revoke|
+-----------+-------------------------------------------------------------+
                         [ toast, black, bottom 24 ]
```

- The settings nav is a `nav` labelled "Settings" with two `h2` group labels and lists of links. Members has `aria-current="page"` and a 2px black inner left bar.
- The page is `main` with one `h1`, "Members". Each block is a `section` labelled by its `h2`.
- The seat meter is a `div role="img"` with `aria-label="8 of 10 seats used"` holding ten `i` segments.
- The invite is a `form`: a chip box (a `ul` of chips plus a text `input`), a role `select`, and a submit `button`.
- The members list is a real `table` with `thead`, `th scope="col"`, and `table-layout: fixed`. Column widths: 30%, 30%, 17%, 15%, 8%.
- Each role control is a native `select` with a hidden `label` "Role for Mateo Ruiz".
- Pending invites are a `ul` of grid rows: `minmax(0,1fr) 100px 140px auto`.
- The toast is one `div role="status" aria-live="polite"` reused for every message.
- The confirm is a native `dialog` opened with `showModal()`, holding a `form method="dialog"`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Toast in | any action | translateY, opacity | 16px, 0 → 0, 1 | 240ms | `--ease-out` | instant |
| Toast out | 6s, Undo | opacity, translateY | reverse | 240ms | `--ease` | instant |
| Toast timer line | toast shown | scaleX | 1 → 0 | 6000ms | linear (it is a clock) | hidden |
| Dialog | remove button | opacity, translateY, scale | 0, 8px, 0.98 → 1, 0, 1 | 240ms | `--ease-out` | instant |
| Send button | chips change | opacity | 0.3 ↔ 1 | 160ms | `--ease` | instant |

- Rows do not animate in or out. A removed row is gone in the next frame. The toast is the feedback.

## States

- Nav link hover: `--wash` fill. Current: weight 600, 2px black inner left bar.
- Input box (chip field, search): 1px `--line-2`. Focus: 1px black border plus a 1px black ring, so it reads as 2px.
- Select hover: border goes black. The role select in a row has a transparent border until hover or focus.
- Disabled role select (Owner): no chevron, `--ink-3` text, not-allowed cursor.
- Primary button: black, white text, 44px. Disabled: 30% opacity.
- Ghost button (Cancel): 1px `--line-2` inset ring. Hover: black ring.
- Danger button (Remove member): red fill, white text.
- Remove icon: 34px, `--ink-3`. Hover: red icon on `--red-wash`. Disabled (Owner): 30% opacity.
- Revoke: red text. Hover: `--red-wash` fill. Resend: black text, `--wash` hover.
- Bad chip: `--red-wash` fill, red text, 1px red inset ring.
- Hint error: red, weight 500. The input gets `aria-invalid="true"`.
- Row hover: `#fafafa` fill on the cells.
- Empty search: one row, `--ink-3`, 28px padding.
- Empty pending: "No pending invites." in `--ink-3`.
- Focus-visible everywhere: 2px black outline, offset 2px. On the toast, the outline is white.

## Accessibility

- One `h1`. Section titles are `h2` and label their `section`.
- The table uses `th scope="col"`. The remove column header is visually hidden text "Remove".
- Every role select has its own label: "Role for Priya Raman". Every icon button has a name: "Remove Priya Raman".
- Resend and Revoke buttons carry the address in their label: "Revoke invite to sam@northpier.co".
- The chip input has a hidden label "Email addresses" and `aria-describedby` pointing at the hint, so errors are read.
- The chip list is a `ul` labelled "Addresses to invite". Each chip's remove button says "Remove dev@harbourline.io".
- Keys in the chip field: Enter, comma, semicolon commit. Backspace on empty removes the last chip. Enter on empty submits if Send is enabled.
- The toast is `role="status"` with `aria-live="polite"`. Undo is a real button and is reachable by Tab while the toast shows. Hover pauses the timer.
- The dialog uses `showModal()` so focus is trapped and Escape closes it. Cancel has `autofocus`. After closing, focus goes to the remove button (cancel) or the search field (removed).
- The seat meter has a text label beside it, so the hatching is not the only signal.
- Contrast: black on white is 21:1. `#6b6b6b` on white is 5.3:1. Red `#d7261e` on white is 4.9:1.
- Hit targets: 34px in rows, 38px tools, 44px invite row. Keep these at 390px.

## Responsive rules

- ≥1280: nav 220px, main padding 40px 56px, content max 980px. Header is `minmax(0,1fr) 280px`.
- 1024 (≤1100px): main padding 36px 32px. Header meter column 240px. Hide the Last active column.
- 768 (≤900px): one column. The nav becomes a top bar: workspace mark and name, then the four Workspace links in a row, with a 2px black underline on Members. Group labels and the Account links are hidden. The bar may scroll sideways inside itself. The seat meter moves under the lead and goes full width.
- <640: main padding 24px 16px. Title 36px. Chip box takes the full row; role select and Send share the next row 1:1. Search fills the row next to a 120px role filter. The table header is hidden and each row becomes a grid: name, role, remove on line one, email under the name indented 44px. Pending rows hide the role, put the sent time under the address, and keep Resend and Revoke side by side on the right. The toast is full width minus 32px.
- Never scroll the page sideways. Long emails truncate with an ellipsis.

## Acceptance checklist

### Always

- [ ] Inviting turns typed addresses into chips on Enter, comma, semicolon, paste, and blur.
- [ ] Invalid addresses and too many invites both disable Send with a red hint that says why.
- [ ] The seat meter shows members, pending invites, and free seats in three distinct fills, with a text count.
- [ ] Role changes apply at once and show an Undo toast. Undo restores the role.
- [ ] The owner cannot be demoted or removed from this page.
- [ ] Remove opens a modal with Cancel focused. Remove frees a seat and offers Undo.
- [ ] Pending invites have Resend and Revoke. Revoke frees a seat.
- [ ] Search and role filter combine, with an empty row when nothing matches.
- [ ] Red appears only on destructive actions and errors.
- [ ] One live region for all toasts. Focus is visible on every control.
- [ ] No sideways scroll at 390px.

### This demo

- [ ] Workspace is "Halden Studio". The owner is Ingrid Solberg, marked "You".
- [ ] The header reads "8 of 10 seats" on the Team plan.
- [ ] Six members: Ingrid Solberg, Mateo Ruiz, Priya Raman, Jonas Weber, Kofi Mensah, Aiko Tanaka.
- [ ] Two pending: lena.vogt@halden.studio (Member) and sam@northpier.co (Viewer).
- [ ] The page is `#ffffff`, type `#000000`, destructive `#d7261e`, radius 6px.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the header reads "Members" with "8 of 10 seats", the meter shows 6 solid, 2 hatched, 2 grey, and the legend reads "6 active  2 invited  2 free".
2. The invite field already holds two chips, dev@harbourline.io and rosa.amaral@halden.studio. The role select reads Member. The button reads "Send 2 invites".
3. Typing in the invite field and pressing Enter, comma, or semicolon turns the text into a chip. Pasting "a@x.co, b@y.co" makes two chips. Leaving the field commits any text.
4. Backspace in an empty field removes the last chip. Each chip has a 22px remove button.
5. An address that is not a valid email becomes a red chip with a red outline. The hint under the field turns red: "One address is not valid. Fix or remove it." Send is disabled.
6. If valid chips are more than the free seats, the hint turns red: "Only 2 seats are free. Remove 1 or upgrade the plan." With no free seats it reads "No seats are free. Revoke an invite or upgrade the plan." Send is disabled.
7. Duplicates are ignored: an address already in the chips, the members, or the pending list is not added again.
8. Send label: no valid chips is "Send invites" (disabled), one is "Send invite", more is "Send N invites".
9. Pressing Send adds each address to the top of Pending invites with the chosen role and "Sent just now", clears the chips, updates the meter, and shows the toast "2 invites sent as Member."
10. The members table has six rows: Name with initials, Email, Role, Last active, and a remove icon button.
11. Changing a role select applies at once. The toast reads "Mateo Ruiz is now Member." with an Undo button. Undo restores the old role and focuses that select.
12. The Owner row has a disabled role select (it only says Owner, with the title "Transfer ownership in Security") and a disabled remove button. Other rows cannot pick Owner.
13. The search field filters by name or email as you type. The role filter shows All roles, Owner, Admin, Member, Viewer. The two combine. No match shows one row: 'No members match "zz".'
14. Pressing a remove button opens a modal: "Remove Jonas Weber?", the line "Jonas loses access to Halden Studio right away. Their drawings and comments stay. The seat becomes free.", Cancel (focused) and a red "Remove member".
15. Remove member deletes the row, frees the seat, and shows the toast "Jonas Weber was removed." with Undo. Undo puts the row back in the same place. Cancel or Escape closes and returns focus to the remove button.
16. Pending invites list each address, role, sent time, Resend, and a red Revoke.
17. Resend changes the time to "Sent just now" and shows "Invite sent again to lena.vogt@halden.studio." Revoke removes the invite, frees the seat, and shows a toast with Undo.
18. The toast is black, centred 24px above the bottom, and leaves after 6s. A 2px grey line at its bottom drains over those 6s. Hovering pauses it, and leaving gives it 2.5s more. A new toast replaces the old one.

## Tokens

```css
:root {
  --bg: #ffffff;        /* page */
  --ink: #000000;       /* type, primary button, rules, solid seats */
  --ink-2: #3d3d3d;     /* body copy, email column */
  --ink-3: #6b6b6b;     /* labels, hints, last active */
  --line: #e6e6e6;      /* row hairlines, free seats */
  --line-2: #cfcfcf;    /* input borders */
  --wash: #f5f5f5;      /* chips, avatars, hover */
  --red: #d7261e;       /* destructive and errors only */
  --red-wash: #fdeceb;  /* red hover fill, bad chip fill */
  --focus: #000000;

  --sans: "Inter", system-ui, sans-serif;
  --r: 6px;             /* every control */
  --r-chip: 4px;
  --r-seat: 2px;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 28px; --space-7: 36px; --space-8: 40px; --space-9: 56px;

  --h-control: 44px;    /* invite row */
  --h-tool: 38px;       /* search and filter */
  --h-row-btn: 34px;    /* role select, remove, Resend, Revoke */

  --shadow-dialog: 0 24px 64px -24px rgba(0,0,0,.45);
  --scrim: rgba(0,0,0,.4);

  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --t-micro: 160ms;
  --t-toast: 240ms;
  --toast-life: 6000ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Page title | Inter | 48px | 700 | 0.95 | -0.035em | Title |
| Section title | Inter | 18px | 700 | 1.3 | -0.015em | Sentence |
| Section count | Inter | 18px | 500 | 1.3 | -0.015em | `--ink-3` |
| Dialog title | Inter | 22px | 700 | 1.3 | -0.02em | Sentence |
| Body, table | Inter | 14px | 400 | 1.45 | 0 | Sentence |
| Member name | Inter | 14px | 600 | 1.45 | 0 | Name |
| Column head, nav group | Inter | 11px | 600 | 1 | 0.08em | Upper |
| Hint, legend, crumb | Inter | 12px | 400-500 | 1.45 | 0 | Sentence |
| Initials | Inter | 12px | 600 | 1 | 0 | Upper |

- Turn on tabular figures (`font-feature-settings: "tnum" 1`) so counts and dates line up.
- One family only. Weight and size do the work.

## Implementation notes

**1. The seat meter is one grid.** Members first, then pending, then free. Recompute from the two arrays on every change. Never keep a separate seat counter.

```css
.meter { display: grid; grid-template-columns: repeat(10, minmax(0,1fr)); gap: 3px; height: 12px; }
.meter i { background: var(--line); border-radius: 2px; }
.meter i.on { background: var(--ink); }
.meter i.inv {
  background: repeating-linear-gradient(135deg, var(--ink) 0 1.5px, transparent 1.5px 4px);
  box-shadow: inset 0 0 0 1px var(--ink);
}
```

```js
const used = members.length + pending.length;
meter.innerHTML = Array.from({ length: 10 }, (_, i) =>
  `<i class="${i < members.length ? 'on' : i < used ? 'inv' : ''}"></i>`).join('');
```

**2. Inline role change without a re-render.** Update the data on `change` and keep the select as it is, so focus stays put. Only re-render on Undo, then focus the select again.

```js
rows.addEventListener('change', e => {
  const s = e.target.closest('.role'); if (!s) return;
  const m = members[s.dataset.i], old = m.r;
  m.r = s.value;
  toast(`${m.n} is now ${m.r}.`, () => {
    m.r = old; render();
    document.getElementById('role' + members.indexOf(m))?.focus();
  });
});
```

**3. The chip field commits on more than Enter.** Split on spaces, commas, and semicolons so a pasted list works.

```js
function commit() {
  input.value.split(/[\s,;]+/).filter(Boolean).forEach(p => {
    const taken = chips.includes(p) || members.some(m => m.e === p) || pending.some(x => x.e === p);
    if (!taken) chips.push(p);
  });
  input.value = ''; renderChips();   // renderChips also re-checks seats and validity
}
input.addEventListener('paste', () => setTimeout(commit, 0));
```

Common mistakes:

- Using red for the primary button or the seat meter. Red is only for remove, revoke, and errors.
- A confirm dialog for role changes. Roles change in place with Undo. Only Remove gets a dialog.
- Rebuilding the table on every role change, which throws focus to the top of the page.
- Letting the owner pick a new role in the same select. Ownership transfer lives elsewhere.
- Counting seats from members only. Pending invites hold seats too.
- A custom dropdown for roles. Native `select` is enough and works with every screen reader.
- Drop shadows on cards. This page uses rules: 2px black under the header, 1px black under column heads, 1px `#e6e6e6` between rows.
- Rounded pills everywhere. Controls are 6px, chips 4px, seats 2px.

Rebuild order:

1. Tokens and the two-column grid.
2. Nav, header, and the static seat meter.
3. Members table from an array, with role selects and remove buttons.
4. Search and role filter.
5. Pending list from an array.
6. Chip field with validation and seat checks.
7. Toast with Undo, then the remove dialog.
8. The 1100px, 900px, and 640px rules.
9. Tab through every control, then try it with reduced motion.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
