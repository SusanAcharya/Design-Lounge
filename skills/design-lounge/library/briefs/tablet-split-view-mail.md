<!-- Design Lounge Nº 071 · "Tablet mail split view" · www.designlounge.live -->

# Tablet mail split view

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A landscape-tablet mail client ("Nord Post") in three panes: a 72px icon rail of folders that can be hidden, a fixed 320px message list, and a reading pane that takes the rest. The list is dense (three text lines per row, unread dot, time, 3px accent bar on the selected row) and set in Inter; the reading pane switches to Newsreader at 17px/1.6 for the body so mail reads like a letter, not a log. j/k (and arrow keys) move the selection and open the message without leaving the keyboard; s stars, e archives. The detail worth copying is the row anatomy plus the way selection, unread and star are all expressed with colour and weight, never with icons in the row.

## Structure

```
1180 × 820
┌────┬──────────────────────────┬───────────────────────────────────────────────┐
│ N  │ [=] Inbox   10 messages  (=) │ Subject …          (star)Star Archive Delete │ Reply │ heads 52
│────┼──────────────────────────┼───────────────────────────────────────────────│
│Inbx│▌● Ingrid Solheim   09:41 │                                               │
│ 4  │  Q4 print run: paper…    │  Q4 print run: paper stock decision           │ h2 30 serif
│Star│  We need to lock the…    │  (I) Ingrid Solheim · to me           09:41   │ sender block
│Sent│ ● Fjord Bank       08:15 │  ─────────────────────────────────────────    │
│Arch│  Your statement for…     │  Body, Newsreader 17/1.6, ≤ 62ch              │
│Trsh│  Balance on 30 Sep…      │  …                                            │
│    │   Tomas Berg   Yesterday │                                               │
│    │  Re: Halden brand…       │  — Ingrid                                     │
│    │  …                       │                                               │
└────┴──────────────────────────┴───────────────────────────────────────────────┘
  72         320                          788 (fills; 860 when rail hidden)
```

- `<nav class="rail" aria-label="Folders">` — 36px brand mark, then five 56×56 `<a>` tiles (icon + 10px label). Inbox has `aria-current="page"` and a `.n` badge.
- `<section class="list" aria-label="Messages">` — `.lhead` (rail toggle `<button aria-pressed>`, `<h1>`, `.cnt`, filter button) + `<ul class="rows" role="listbox" tabindex="0" aria-activedescendant>` of `<li class="row" role="option" aria-selected>`; each row is a grid `8px 1fr auto` of `.dot`, text stack (`.from`, `.subj`, `.snip`) and `.time`.
- `<section class="read" aria-label="Reading pane">` — `.rhead` (`<h2 class="subject">`, Star / Archive / Delete `.act` buttons, `.sep`, primary Reply) + `<article class="msg">` (`<h2>`, `.who` sender block, `.body` paragraphs, `.sig`).

### Content

- Brand mark "N"; rail tiles: Inbox (badge = current unread count, 3 after load), Starred, Sent, Archive, Trash.
- List header: "Inbox", "10 messages". Shortcut legend (if shown): j / k next / previous, s star, e archive.
- Messages (from · subject · time · unread · starred): "Ingrid Solheim" · "Q4 print run: paper stock decision" · 09:41 · unread; "Fjord Bank" · "Your statement for September is ready" · 08:15 · unread; "Tomas Berg" · "Re: Halden brand review — notes from Thursday" · Yesterday · starred; "Loam Savings" · "Interest paid: 42.18 added to Emergency pot" · Yesterday · unread; "Marta Kowalczyk" · "Offsite: menu and dietary notes" · Mon; "Nord Post" · "Two-factor sign-in was enabled" · Mon · unread; "Eirik Dahl" · "Sauna booking Saturday 18:00" · Sun; "Tessel" · "Order 48117 is on its way" · Sat; "Halden Studio" · "Invoice 2025-081 — 30 days" · Fri · starred; "Ada Lindqvist" · "Photos from Hardanger" · Thu.
- Each message body is two or three short paragraphs in the sender's voice (e.g. Ingrid: "We need to lock the uncoated stock by Friday or the mill slips us to November…"), signed "— <first name>" in italic.
- Snippet = first sentence of the body. Sender block: initial avatar, name, "to me", time.
- Empty state: "Inbox zero" / "Nothing left to read. Reload the piece to bring the messages back."

## Motion

| Element        | Trigger       | Property          | From → To            | Duration | Easing   | Notes |
|----------------|---------------|-------------------|----------------------|---------:|----------|-------|
| `.rail`        | toggle        | width, opacity    | 72px, 1 → 0, 0       | 280ms    | `--ease` | border-right width also → 0; list and pane reflow via flex |
| `.row`         | hover         | background        | transparent → `--hover` | 140ms | linear   | |
| `.act`, `.hbtn`| hover         | background, color | → `--hover`, `--ink` | 0        | —        | instant |
| selection      | click / j / k | —                 | re-render            | 0        | —        | no fade; content swaps instantly |

Reduced motion: rail transition 1ms. Nothing else moves.

## States

- **Row selected:** `aria-selected="true"`, background `--selected`, 3px `--accent` bar on the left edge (`::before`).
- **Row unread:** `.unread`, 8px `--unread` dot at `margin-top: 6px`, from and subject weight 600.
- **Row hover:** `--hover` background (selected row keeps `--selected`).
- **Row starred:** the time label is `--star`.
- **Rail tile current:** `aria-current="page"`, white background, `--accent` icon and label, `--shadow-tile`.
- **Rail hidden:** `.hidden` → `width: 0; opacity: 0; border-right-width: 0`. Toggle `aria-pressed="false"`, label "Show folders".
- **Star button pressed:** `aria-pressed="true"`; the visual signal is on the row's time label, not the button.
- **Focus-visible (tiles, buttons, list):** 2px `--accent` outline with −2px offset (inside the element, so it never clips at pane edges).
- **Empty list:** pane shows "Inbox zero" and a hint; header subject is empty.

## Accessibility

- Rail is a `<nav aria-label="Folders">`; tiles are links with visible text labels, so no `aria-label` is needed; the unread badge is inside the link and read as "Inbox 4".
- Message list is a single-tab-stop `role="listbox"` with `aria-activedescendant` pointing at the selected `role="option"` row; rows have `tabindex="-1"`. ArrowUp/Down and j/k are handled on the list; j/k/s/e also work globally except when focus is in an input.
- Reading pane header buttons are real `<button>`s with visible text; Star carries `aria-pressed`.
- The reading pane `<article>` scrolls independently (`overflow-y: auto`) so the header stays put.
- Contrast: `--ink-2` on white 6.5:1; `--ink-3` on white 3.7:1 (12px snippets are supplementary; the subject line carries the meaning); `--accent` on `--selected` 4.9:1; white on `--accent` 6.6:1.
- Hit targets: rail tiles 56px, rows ≥ 64px tall, header buttons 32–34px tall with ≥ 40px width (tablet with pointer or stylus; on touch, raise to 44px).

## Responsive rules

- 1180 (reference): 72 + 320 + 788.
- 1024: rail auto-hidden on load (toggle restores it); list 300px.
- 768 (portrait tablet): two panes only; the rail becomes a top strip of five icon tabs (48px tall) and the list is 280px.
- < 640: single pane; the list fills the width and selecting a row navigates to the message with a back button in the reading header.

## Acceptance checklist

- [ ] Panes measure exactly 72px (rail), 320px (list) and the remainder; heads are 52px tall in all three.
- [ ] Hiding the rail animates width 72 → 0 and opacity 1 → 0 over 280ms `cubic-bezier(.2,.7,.2,1)`; the list and pane move left by 72px.
- [ ] Selected row shows a 3px `#3b5bdb` bar on its left edge and a `#e8ecfb` background.
- [ ] Unread rows show an 8px dot and weight-600 from/subject; opening a row clears its unread state and decrements the rail badge.
- [ ] j / ArrowDown and k / ArrowUp move the selection and open the message; the selected row is scrolled into view.
- [ ] s toggles star (time label turns `#e0a34b`); e archives (row removed, next opens).
- [ ] Listbox uses `aria-activedescendant`; rows are `role="option"` with `aria-selected`.
- [ ] Reading pane body is Newsreader 17px / 1.6 with a 62ch measure; subject is 30px / 1.15.
- [ ] Header actions have visible text labels; Reply is the only filled button.
- [ ] Every focusable element shows a 2px accent outline on `:focus-visible`.
- [ ] Reading pane scrolls independently of the list.
- [ ] Emptying the list shows an "Inbox zero" state instead of a blank pane.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: rail visible with Inbox current and an unread count badge "3" (four messages are unread in the data; opening row 1 on load clears one). List shows 10 messages; row 1 is selected (accent 3px bar, `--selected` background). Reading pane shows the subject in the header, the Newsreader subject line, sender block and two to three paragraphs.
2. Click any row: it becomes selected, its unread dot disappears and its from/subject weights drop from 600 to 500/400; the reading pane re-renders instantly (no fade). The rail's unread badge decrements.
3. Press j / ArrowDown: selection moves down one row and opens it; k / ArrowUp moves up. The selected row scrolls into view (`block: nearest`). Keys work when focus is on the list (`tabindex="0"`) or anywhere outside inputs.
4. Press s or click "Star": the message's time label turns `--star` amber and the Star button's `aria-pressed` flips.
5. Press e, or click "Archive" or "Delete": the message is removed from the list and the next one opens; the count in the list header updates. When the list is empty, the pane shows "Inbox zero".
6. Click the panel icon in the list header: the rail collapses from 72px to 0 over 280ms (width + opacity), and the list and pane shift left to fill it. Click again to restore. `aria-pressed` and `aria-label` update.
7. Hover a row: background `--hover`. Hover an action: background `--hover`, text `--ink`.

## Tokens

```css
:root {
  /* colour — cool light neutrals, indigo accent, amber star */
  --bg: #f7f7f8;             /* reading pane */
  --panel: #ffffff;          /* list, headers, active rail tile */
  --rail: #eef0f3;
  --hover: #f1f2f5;
  --selected: #e8ecfb;       /* selected row */
  --line: #e3e5ea;
  --line-strong: #cfd3db;    /* kbd border */
  --ink: #1a1c1e;
  --ink-2: #5c616b;          /* actions, rail labels */
  --ink-3: #8b909a;          /* snippets, times, counts */
  --accent: #3b5bdb;         /* selection bar, badge, Reply, unread dot */
  --accent-hover: #2f4bc0;
  --accent-ink: #ffffff;
  --accent-soft: #dfe5f7;    /* avatar */
  --star: #e0a34b;

  /* type */
  --sans: "Inter", system-ui, sans-serif;
  --serif: "Newsreader", Georgia, serif;

  /* layout */
  --w-rail: 72px;
  --w-list: 320px;
  --h-head: 52px;
  --tile: 56px;
  --row-pad: 10px 14px 10px 12px;
  --sel-bar: 3px;
  --msg-pad: 28px 40px 40px;
  --msg-max: 760px;
  --r: 8px;
  --r-tile: 12px;
  --r-pill: 999px;
  --shadow-tile: 0 1px 2px rgba(26, 28, 30, .08);

  /* motion */
  --t-fast: 140ms;
  --t-layout: 280ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role               | Family     | Size | Weight | Line-height | Tracking | Notes |
|--------------------|------------|-----:|-------:|------------:|---------:|-------|
| UI base            | Inter      | 13px | 400    | 1.45        | 0        | |
| List title (h1)    | Inter      | 15px | 600    | 1.3         | −0.01em  | |
| Row from           | Inter      | 13px | 500 (unread 600) | 1.35 | 0 | single line, ellipsis |
| Row subject        | Inter      | 13px | 400 (unread 600) | 1.35 | 0 | single line, ellipsis |
| Row snippet        | Inter      | 12px | 400    | 1.35        | 0        | `--ink-3`, ellipsis |
| Row time           | Inter      | 11px | 400    | 1.3         | 0        | tabular numerals |
| Rail label         | Inter      | 10px | 500    | 1           | 0        | |
| Rail badge         | Inter      | 9px  | 600    | 1.4         | 0        | |
| Header subject     | Inter      | 15px | 500    | 1.3         | −0.01em  | ellipsis |
| Action button      | Inter      | 12px | 500    | 1           | 0        | |
| Message subject    | Newsreader (opsz 72) | 30px | 500 | 1.15   | −0.01em  | |
| Sender name        | Inter      | 14px | 500    | 1.3         | 0        | |
| Message body       | Newsreader (opsz 16) | 17px | 400 | 1.6    | 0        | max 62ch |
| Signature          | Newsreader | 16px | 400 italic | 1.6     | 0        | `--ink-2` |

## Implementation notes

**Single-tab-stop list.** Put `tabindex="0"` on the `<ul>`, `tabindex="-1"` on rows, and route keys on the list; keep the global handler out of inputs:

```js
rows.addEventListener('keydown', e => {
  if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); open(sel + 1); }
  else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); open(sel - 1); }
});
addEventListener('keydown', e => {
  if (e.target === rows || e.target.closest('input')) return;
  if (e.key === 'j') open(sel + 1); if (e.key === 'k') open(sel - 1);
  if (e.key === 's') star.click();  if (e.key === 'e') archive.click();
});
```

**Row anatomy** as a three-column grid, so the dot column reserves space even when read:

```css
.row { display: grid; grid-template-columns: 8px 1fr auto; gap: 0 10px; align-items: start;
       padding: 10px 14px 10px 12px; border-bottom: 1px solid var(--line); position: relative; }
.row[aria-selected="true"] { background: var(--selected); }
.row[aria-selected="true"]::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0;
                                     width: 3px; background: var(--accent); }
.dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; background: transparent; }
.row.unread .dot { background: var(--unread); }
.row.unread .from, .row.unread .subj { font-weight: 600; }
```

**Collapsing the rail** must also drop its border, or a 1px line remains:

```css
.rail { width: var(--w-rail); overflow: hidden; border-right: 1px solid var(--line);
        transition: width var(--t-layout) var(--ease), opacity var(--t-layout); }
.rail.hidden { width: 0; opacity: 0; border-right-width: 0; }
```

Common mistakes: giving every row `tabindex="0"` (ten tab stops); fading the reading pane on every selection (slows keyboard users); forgetting `min-width: 0` on the reading pane so long subjects push the layout; clamping `open()` without checking for an empty list.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
