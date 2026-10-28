<!-- Design Lounge Nº 567 · "Chat history sidebar" · www.designlounge.live -->

# Chat history sidebar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The left sidebar of an assistant chat app, Wren. A 280px column on warm grey: wordmark, a teal New chat button with ⌘⇧O shown, a search field with ⌘K, then the history in five date groups (Pinned, Today, Yesterday, Previous 7 days, Previous 30 days), and the account row pinned at the bottom. Each 36px row is just a title; hovering or focusing it shows three 28px icon buttons (pin, rename, delete), so the list stays quiet until you reach for it. Search filters as you type, highlights the matched letters in butter yellow and drops empty groups. Rename edits in place. Delete collapses the row and offers Undo for 5 seconds. The open chat is hinted on the right: one question, one answer, a composer.

## Structure

```
1280 × 800
┌──────────── 280 ───────────┬──────────────────────────────────────────────┐
│ ■ Wren                      │ Sourdough starter smells like acetone  8:12  │ 56
│ ┌ + New chat ────── ⌘⇧O ┐   ├──────────────────────────────────────────────┤
│ └───────────────────────┘   │                  ┌ user bubble ─────────────┐│
│ ( ⌕ Search chats     ⌘K )   │                  └──────────────────────────┘│
│ ⊥ PINNED                    │  Assistant answer, 15px / 1.6, 680 max       │
│   Kitchen renovation budget │  1. …  2. …  3. …                            │
│   Thesis outline, chapter 3 │                                              │
│ TODAY                       │                                              │
│ ▓ Sourdough starter smel…   │                                              │
│   Rewrite cover lett…  ⊥ ✎ ⌫│                                              │
│   SQL running total by week │                                              │
│ YESTERDAY · PREVIOUS 7 DAYS │                                              │
│   …                         │                                              │
│ ─────────────────────────── │ ┌ Reply to Wren ──────────────────── [↑] ┐  │
│ (AO) Amara Osei  Plus    ⚙  │ └────────────────────────────────────────┘  │
└─────────────────────────────┴──────────────────────────────────────────────┘
```

- `<aside class="side" aria-label="Chat history">`, flex column, padding 14px 10px 10px.
  - `.brand` (36px): 26px ink mark with a speech-bubble glyph, "Wren" 17/700.
  - `.new` `<button>`: 42px, radius 11, plus icon, label, `<kbd>⌘⇧O</kbd>` at the right.
  - `<label class="find">`: 38px field with icon, `<input aria-label="Search chats" aria-controls="list">`, `<kbd>⌘K</kbd>`.
  - `<nav class="list" aria-label="Chats">` (flex 1, scrolls): one `<section class="grp">` per non-empty group, each an `<h2>` and a `<ul>` of `<li class="it">`. Each item holds `.row` → a `.go` title `<button>` (or the rename `<input>`) and `.acts` with three icon `<button>`s.
  - `.me` account row (56px): initials disc, name, "Plus · renews 2 Dec", settings button.
- `.toast` `role="status" aria-live="polite"` fixed above the account row, with an Undo button.
- `<main>`: 56px header (phone menu button, `<h1>` chat title, meta), `.thread` with messages and the composer.

## Motion

| Element        | Trigger        | Property                     | From → To                     | Duration | Easing       | Notes |
|----------------|----------------|------------------------------|-------------------------------|---------:|--------------|-------|
| Row (delete)   | delete click   | grid-template-rows, opacity  | 1fr, 1 → 0fr, 0               | 240ms    | `--ease`     | then removed from data |
| Toast          | after delete   | opacity, translateY          | 0, 8px → 1, 0                 | 150 / 240ms | `--ease`, `--ease-out` | hides after 5000ms |
| Row actions    | hover / focus  | display                      | none → flex                   | 0        | —            | instant so the pointer never waits |
| New chat       | hover / active | background, scale            | → `#0B5858`, scale(.98)       | 150ms    | `--ease`     | |
| Drawer (≤760)  | menu click     | transform                    | translateX(−100%) → 0         | 240ms    | `--ease-out` | shadow only while open |
| Scrim          | drawer         | opacity                      | 0 → 1                         | 240ms    | `--ease`     | rgba(26,29,28,.4) |

Reduced motion: every transition is 1ms; delete still waits 240ms before the toast so focus does not jump while the row is still there.

## States

- **Row hover / focus-within:** `--hover` fill, actions visible, title ellipsised.
- **Open chat:** `aria-current="page"` on the item, `--sel` fill, title 600.
- **Pinned group:** heading carries a 12px pin glyph; the group sits first and is never date-sorted.
- **Renaming:** input replaces the title button, `--main` fill, `inset 0 0 0 1.5px var(--teal)`, text selected.
- **Search match:** `<mark>` with `--mark` fill and `--ink` text, 3px radius; groups without a hit are not rendered.
- **No results:** heading line quoting the query, a helper line, and a 32px outlined Clear search button.
- **Deleted:** row collapses; toast with Undo for 5000ms. Delete icon turns `--danger` on hover only, never at rest.
- **Focus-visible:** 2px `--teal` outline at 2px offset; the title button draws it inset (−2px) so it stays inside the row; on the teal New chat the outline is `--ink`.

## Accessibility

- The history is a `<nav aria-label="Chats">`, each group an `<h2>` heading and a list, so screen reader users can jump by heading between Today and Yesterday.
- Titles are buttons here because they swap the thread in place; in a routed app make them links with `aria-current="page"`.
- Actions are visible on keyboard focus too (`:focus-within`), and each has an `aria-label` that names the chat, so "Delete" is never ambiguous in a list of 16.
- Rename input has `aria-label="Rename chat"`; Enter saves, Esc cancels and focus returns to the title.
- The toast is a polite `role="status"`; Undo is a real button reachable by Tab.
- The no-results message is a `role="status"` so the empty outcome is announced.
- Shortcuts: ⌘K / Ctrl+K search, ⌘⇧O / Ctrl+Shift+O new chat, Esc clears search or closes the drawer. All are shown on screen.
- Contrast on `--side`: `--ink` 15.7:1, `--ink-2` 6.3:1, `--ink-3` 4.9:1; `--ink` on `--mark` 14.1:1; `--teal-ink` on `--teal` 6.2:1; `--toast-link` on `--ink` 10.8:1. Field borders `--line-2` are 3.3:1.
- Hit targets: rows 36px, action buttons 28px inside a 36px row, settings 36px, phone menu 40px.

## Responsive rules

- ≥ 1280: sidebar 280px; thread column 680px max, centred in the rest.
- 1024–1279: unchanged; the thread narrows first.
- 761–1023: unchanged sidebar; the user bubble caps at 78% of the column.
- ≤ 760: sidebar is a 280px drawer with a scrim; the chat header gains the 40px menu button and drops the meta line; only the open chat's row shows its actions (touch has no hover); the thread pads 16px and the bubble widens to 88%. Nothing scrolls sideways at 390.

## Acceptance checklist

**Always**

- [ ] History is grouped Pinned, Today, Yesterday, Previous 7 days, Previous 30 days, and empty groups are not rendered.
- [ ] Row actions appear on hover and on keyboard focus, with labels that name the chat.
- [ ] Rename is in place: Enter or blur saves, Esc cancels, blank keeps the old title, focus returns.
- [ ] Delete collapses the row and offers Undo for 5 seconds in a polite live region.
- [ ] Search filters on every keystroke, highlights the match and has a no-results state with a clear action.
- [ ] One filled primary: New chat, with its shortcut shown.
- [ ] Pin moves a chat into Pinned and unpin returns it to its original group.
- [ ] Below 760px the sidebar is a drawer with a scrim and Esc to close.

**This demo**

- [ ] Sidebar 280px on `#F1EFEB`; rows 36px; New chat 42px in `#0F6B6B`.
- [ ] The open chat is "Sourdough starter smells like acetone" with fill `#DCEBE8`.
- [ ] Search highlight is `#F6E3A6`; typing "re" leaves Kitchen renovation budget, Rewrite cover letter for Halden, Compare two heat pumps, Regex for UK postcodes and Draft a reply to the landlord.
- [ ] Toast reads `Deleted "<title>"` with a `#8FDCD3` Undo and stays 5000ms.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: 16 chats across five groups; "Sourdough starter smells like acetone" in Today is open (`aria-current="page"`, mint fill `#DCEBE8`, weight 600) and its title is in the chat header.
2. Hover or focus within a row: fill `--hover`, the title shortens with an ellipsis, and the action buttons appear at its right. Actions have native titles "Pin", "Rename", "Delete" and full `aria-label`s ("Delete Rewrite cover letter for Halden").
3. Click a title: that chat opens, the header title updates and, on phone, the drawer closes.
4. Pin: the chat moves into Pinned. Unpin returns it to the group it came from.
5. Rename: the title becomes a 28px input with a 1.5px teal inner ring, focused with its text selected. Enter or blur saves (blank input keeps the old title), Esc cancels. Focus returns to the row's title button.
6. Delete: the row folds to 0 height and fades over 240ms, then it leaves the list and a dark toast appears above the account row: `Deleted "SQL running total by week"` with Undo. The toast stays 5000ms. Undo puts the chat back in its group.
7. Type in search: every keystroke filters titles (case-insensitive substring), wraps the first match in `<mark>`, and hides groups with no hits. No hits shows "No chats match "xyz"", "Search looks at titles only." and a Clear search button.
8. ⌘K / Ctrl+K focuses search (opening the drawer on phone). Esc in search clears it; Esc elsewhere closes the drawer.
9. New chat or ⌘⇧O: adds "New chat" to the top of Today, opens it, and clears any search.
10. Below 760px the sidebar is a drawer from the left (240ms, 40% scrim) opened by a 40px menu button in the chat header; only the open chat's row shows its actions.

## Tokens

```css
:root {
  /* surfaces */
  --main: #FBFAF8;        /* chat area, search field, rename input */
  --side: #F1EFEB;        /* sidebar, user bubble */
  --hover: #E6E3DD;       /* row hover */
  --sel: #DCEBE8;         /* open chat row */
  --line: #DDD9D2;        /* hairlines */
  --line-2: #85817A;      /* search and composer borders, 3.3:1 */

  /* text */
  --ink: #1A1D1C;         /* 15.7:1 on --side */
  --ink-2: #575B58;       /* secondary, 6.3:1 */
  --ink-3: #686C69;       /* group headings, 4.9:1 */

  /* accent and roles */
  --teal: #0F6B6B;        /* New chat, rename ring, plan label, focus */
  --teal-ink: #F2FBFA;    /* text on teal, 6.2:1 */
  --mark: #F6E3A6;        /* search highlight behind --ink */
  --danger: #A3302A;      /* delete icon on hover only */
  --toast-link: #8FDCD3;  /* Undo on the ink toast */

  /* type */
  --font: "Public Sans", system-ui, sans-serif;

  /* layout */
  --w: 280px;
  --row: 36px;
  --r: 9px;
  --thread: 680px;        /* message column max width */

  /* depth */
  --shadow-toast: 0 12px 28px -10px rgba(26, 29, 28, .35);

  /* motion */
  --t-fast: 150ms;
  --t-mid: 240ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role             | Family      | Size | Weight | Line-height | Tracking | Case      |
|------------------|-------------|-----:|-------:|------------:|---------:|-----------|
| Chat title row   | Public Sans | 14px | 400    | 36px row    | 0        | sentence  |
| Open chat row    | Public Sans | 14px | 600    | 36px row    | 0        | sentence  |
| Group heading    | Public Sans | 11px | 600    | 1           | +0.08em  | UPPERCASE |
| Wordmark         | Public Sans | 17px | 700    | 1           | −0.02em  | Title     |
| New chat         | Public Sans | 14px | 600    | 1           | 0        | sentence  |
| Shortcut kbd     | Public Sans | 11px | 500    | 1           | +0.04em  | symbols   |
| Account name     | Public Sans | 13px | 600    | 1.3         | 0        | Title     |
| Chat header      | Public Sans | 15px | 600    | 1.3         | 0        | sentence  |
| Assistant answer | Public Sans | 15px | 400    | 1.6         | 0        | sentence  |
| Toast            | Public Sans | 13px | 400 / 700 Undo | 1.3 | 0       | sentence  |

## Implementation notes

**Render from data, not by editing the DOM.** Keep one array of `{ id, t, g, was }` and re-render the list after every action; pin, rename, delete, undo and search then all fall out of the same function:

```js
function render() {
  const html = GROUPS.map(([key, label]) => {
    const rows = chats.filter(c => c.g === key && (!q || c.t.toLowerCase().includes(q)));
    return rows.length ? `<section class="grp"><h2>${label}</h2><ul>${rows.map(row).join('')}</ul></section>` : '';
  }).join('');
  list.innerHTML = html || emptyState(q);
}
const pin = c => { c.g = c.g === 'pinned' ? c.was : 'pinned'; render(); };
```

**Highlight safely.** Escape the three slices separately and wrap only the match:

```js
function hl(t) {
  if (!q) return esc(t);
  const i = t.toLowerCase().indexOf(q);
  return esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + q.length)) + '</mark>' + esc(t.slice(i + q.length));
}
```

**Collapse before removing.** Animate a one-row grid to `0fr`, then drop the item from the data and show the toast:

```css
.it { display: grid; grid-template-rows: 1fr; transition: grid-template-rows 240ms var(--ease), opacity 240ms var(--ease); }
.it > div { overflow: hidden; }
.it.gone { grid-template-rows: 0fr; opacity: 0; }
```

**The field edge belongs to the input.** The visible field box (fill, 1px border, radius) is drawn on the `<input>` itself, absolutely filling its `<label class="find">`, with the icon and kbd layered above it (`position: relative; z-index: 1; pointer-events: none`). A border on the wrapper does not count as the control's edge. Hide the closed drawer with `visibility: hidden` (transitioned with a delay equal to the slide, `visibility 0s linear <dur>`, and `transition-delay: 0s` when opening) so off-screen text is never rendered; add `inert` too if your stack supports it.

Common mistakes: hiding actions with `opacity: 0` but leaving them in the tab order with no visible focus; deleting without undo; a rename that saves on every keystroke and re-sorts the list under the cursor; highlighting with `innerHTML` on raw titles, which lets a chat named `<img onerror>` run script.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
