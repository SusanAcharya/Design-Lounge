<!-- Design Lounge Nº 403 · "Tablet notes in three panes" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Tablet notes in three panes

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A writing app ("Lekh") on a landscape tablet. Three panes sit side by side: folders, a list of notes, and an editor. The editor is a sheet of warm paper with serif text, a checklist you can tick, a pull quote, and a highlight that looks like red pencil. A dark format bar floats at the bottom of the editor. Two toggles fold the panes away: one hides the folders, focus mode hides folders and list together with a slide, so only the page is left. The detail worth copying is the single red pencil accent. It marks the selected note with a hand-drawn underline, ticks the checklist, edges the quote and nothing else.

## Reference behaviour

1. First frame: three panes. Folders show three groups, all open: Writing (Essays 4, Drafts 1, Letters 0), Studio (Clients 0, Meeting notes 1), Home (Recipes 1, Garden 1). Essays is current. The list shows four notes. "On keeping a commonplace book" is selected and open in the editor. Two of its four checklist items are ticked. The format bar shows "158 words". The status reads "Saved".
2. Click a group header: its folders collapse to zero height over 380ms and the chevron turns −90°. Click again to open. Collapsed folders cannot take focus.
3. Click a folder: it becomes current. The list title and count change. The first note in that folder opens. An empty folder shows "Nothing here yet. New notes in Letters will land here." and keeps the last note in the editor.
4. Type in the search field: the list filters by title and body as you type. No match shows "No match. Try a shorter word."
5. Click a note in the list: it gets the paper background and a red pencil squiggle under its title. The editor shows its title, folder, edit date and body. The page scrolls to the top.
6. Tick a checklist box: the box fills red, a white tick draws in, and the text turns grey with a red strike line. Click again to untick.
7. Type in the title or body: the status reads "Saving". 700ms after the last key it reads "Saved", the edit date becomes "Edited 3 Oct 2026, 22:43", and the list snippet updates. The word count updates on every key.
8. Format bar: B and I toggle bold and italic on the selection. H turns the current block into a heading, or back into a paragraph. The checklist button inserts a new unticked item after the current block, with "New item" selected. The quote button turns the block into a quote, or back. The pencil button wraps the selection in a red pencil highlight. B, I, H and quote show a pressed state when the caret sits inside that format.
9. Click the panel toggle in the editor header: the folders pane slides out to 0 and the list and editor move left (two panes). Click again to bring it back.
10. Click the focus toggle: folders and list both slide out and the editor takes the full width. The text column stays 640px and centred. Click again, press Escape, or press Cmd/Ctrl + . to return to the panes you had before.
11. The new note button (pencil, list header) adds "Untitled" at the top of the current folder, opens it, and selects the title text.

## Structure

```
1180 × 820, 24px top clearance, 1px rule under it
┌───────────────┬──────────────────────┬──────────────────────────────────────────┐
│ Lekh.     [+] │ Essays           [+] │ [panel] [focus]          Saved [share]   │ 64
│               │ 4 notes              │                                          │
│ v WRITING     │ [ search this folder]│      On keeping a commonplace            │
│  ▣ Essays   4 │──────────────────────│      book                         38 serif│
│    Drafts   1 │ On keeping a… 22:41  │      Essays · Edited 3 Oct 2026, 22:41    │
│    Letters  0 │ ~~~~~~~~~~~~ (red)   │                                          │
│ v STUDIO      │ For three years I…   │      For three years I have copied…       │
│    Clients  0 │──────────────────────│      What goes in                         │
│    Meeting  1 │ Walking the ring…    │      [x] Pull the six best entries        │
│ v HOME        │ Against the tidy…    │      [x] Find the page number…            │
│    Recipes  1 │ Notes on monsoon…    │      [ ] Ask Mira if I can quote…         │
│    Garden   1 │                      │      ┃ A notebook is a room you…          │
│───────────────│                      │      [B I H | chk quo pen | 158 words]   │
│ Synced… 22:41 │                      │              floating, bottom 24px        │
└───────────────┴──────────────────────┴──────────────────────────────────────────┘
      232                316                  minmax(0,1fr), text column 640
```

- `.app` is a grid with three tracks: `232px 316px minmax(0,1fr)`. `data-mode` is `three`, `two` or `focus`. Each pane has a fixed `grid-column` (1, 2, 3) so it never moves track when another pane leaves the flow.
- `<nav class="pane folders" aria-label="Folders">`: brand row, `.tree`, footer. Each group is a `<button class="gh" aria-expanded aria-controls>` and a `.kids` region with folder buttons. The current folder has `aria-current="true"`.
- `<section class="pane list" aria-label="Notes">`: `h1` with the folder name and count, new note button, search `label` with `input type="search"`, then `<ul class="notes">` of `<button class="nt" aria-current>` rows (title, `time`, two-line snippet).
- `<main class="pane editor" aria-label="Editor">`: a 64px header (panel toggle, focus toggle, status with `aria-live="polite"`, share), a scrolling `.page` with an `article.doc` (title `contenteditable`, meta line, body `contenteditable` with `role="textbox" aria-multiline="true"`), and the `.fmt` toolbar.
- Each pane wraps its content in `.in` with a fixed width (232 or 316). The track shrinks, the content does not reflow.

### Content

- Essays: "On keeping a commonplace book" (22:41), "Walking the ring road at dawn" (29 Sep), "Against the tidy desk" (21 Sep), "Notes on monsoon light" (2 Sep).
- Drafts: "Talk outline for the paper fair". Meeting notes: "Kiran, packaging review". Recipes: "Gundruk soup, the slow way". Garden: "What to sow in October".
- The open note has: an opening paragraph, heading "What goes in", one paragraph, a four-item checklist, a quote with a cite line ("Mira Thapa, in a letter, March 2025"), heading "The rule of the margin", and a closing paragraph with "Correct in red pencil." highlighted.

## Tokens

```css
:root {
  --paper: #f6f1e7;        /* page and list background */
  --paper-2: #efe8da;      /* folders pane */
  --sheet: #fbf8f1;        /* editor, selected rows, search field */
  --line: #ddd3c1;         /* pane rules, row rules */
  --line-2: #cbbfa9;
  --ink: #23201b;          /* text and the format bar */
  --ink-2: #58524a;        /* snippets, icons */
  --ink-3: #71695d;        /* dates, counts, labels */
  --pencil: #b8402b;       /* the one accent */
  --pencil-soft: #f1d9cf;  /* highlight fill */
  --serif: "Literata", Georgia, serif;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
  --w-folders: 232px;
  --w-list: 316px;
  --r: 10px;
  --t-fast: 150ms;
  --t-pane: 380ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

Spacing runs on 4: 4, 8, 12, 16, 20, 24, 28, 32, 48. No drop shadows between panes, only 1px `--line` rules. The format bar is the only thing with a shadow.

## Typography

| Role | Family | Size | Weight | Line-height | Notes |
| --- | --- | --- | --- | --- | --- |
| Brand | Literata | 22px | 600 | 1.2 | the full stop is `--pencil` |
| Group header | IBM Plex Sans | 12px | 600 | 1.2 | uppercase, 0.08em, `--ink-3` |
| Folder | IBM Plex Sans | 15px | 400, current 500 | 1.45 | count 12px tabular |
| List title | Literata | 24px | 600 | 1.2 | -0.01em; count 12.5px sans |
| Row title | Literata | 16.5px | 600 | 1.3 | |
| Row date | IBM Plex Sans | 12px | 400 | 1.2 | tabular, `--ink-3` |
| Row snippet | IBM Plex Sans | 13.5px | 400 | 1.45 | two lines, clamped |
| Note title | Literata | 38px | 600 | 1.15 | -0.015em |
| Meta | IBM Plex Sans | 13px | 400 | 1.45 | parts split by a middle dot |
| Body | Literata | 19px | 400 | 1.65 | measure 640px max |
| Body heading | Literata | 24px | 600 | 1.25 | 32px above, 10px below |
| Quote | Literata italic | 21px | 400 | 1.55 | cite 13px sans |
| Format bar letters | Literata | 16px | 600 | 1 | B bold, I italic |
| Word count | IBM Plex Sans | 12px | 400 | 1 | tabular |

The UI is sans. Everything the person wrote is serif. Do not mix them inside a note.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Pane tracks | mode change | grid-template-columns | `232 316 1fr` → `0 316 1fr` → `0 0 1fr` | 380ms | `--ease-out` | instant |
| Folders content | leaving | translateX, opacity | 0, 1 → -40px, 0 | 380ms | `--ease-out` | instant |
| List content | leaving (focus) | translateX, opacity | 0, 1 → -60px, 0 | 380ms | `--ease-out` | instant |
| Group collapse | header click | grid-template-rows | 1fr → 0fr | 380ms | `--ease-out` | instant |
| Chevron | header click | rotate | 0 → -90° | 150ms | `--ease` | instant |
| Checkbox fill | tick | background, border | clear → `--pencil` | 150ms | `--ease` | instant |
| Tick stroke | tick | stroke-dashoffset | 20 → 0 | 220ms | `--ease-out` | instant |
| Hover tints | hover | background | none → 5% ink | 150ms | `--ease` | instant |

Nothing loops. The status text change is not animated.

## States

- Folder resting: `--ink-2`. Hover: 5% ink tint. Current: `--sheet` fill, 1px inset `--line`, ink text at 500, folder icon in `--pencil`.
- Group open: chevron down. Collapsed: chevron at −90°, children `visibility: hidden` after the 380ms close.
- Row resting: transparent. Hover: 3% ink tint. Selected: `--sheet` fill, title has a red pencil squiggle 6px tall under it.
- Search focus: border darkens to `--ink-2`. No glow.
- Empty folder and no-match states: serif 18px line, sans 14px helper.
- Checklist item unticked: 22px box, 1.6px `--ink-2` border, 5px radius. Ticked: `--pencil` fill, white tick, text `--ink-3` with a 1.5px `--pencil` line-through.
- Format button resting: `#d9d0bf` on ink. Hover: 10% light tint. Pressed: 14% light tint plus a 2px `--pencil` inset bar at the bottom, `aria-pressed="true"`.
- Toggles in the editor header: `--pencil` icon when `aria-pressed="true"`.
- Status: "Saving" while typing, "Saved" 700ms after the last edit.
- Focus-visible: 2px `--pencil` outline, offset 2px. On the dark format bar the outline is `#f0b9a9`.

## Accessibility

- The three panes are landmarks with labels: Folders (`nav`), Notes (`section`), Editor (`main`).
- Group headers are buttons with `aria-expanded` and `aria-controls`.
- Folder and note rows are buttons with `aria-current="true"` when current.
- Hidden panes are `inert`: the folders pane in two and focus modes, the list pane in focus mode. Collapsed groups use `visibility: hidden`.
- The panel toggle and focus toggle use `aria-pressed` and change their label: "Show folders" / "Hide folders", "Focus mode" / "Leave focus mode".
- The body is `role="textbox" aria-multiline="true"` with a label. The title is its own editable heading. Enter in the title moves to the body.
- Checklist boxes are `<button role="checkbox" aria-checked contenteditable="false">`, 48×48. Space and Enter toggle them.
- The format bar is `role="toolbar" aria-label="Format"`. Its buttons keep the selection by cancelling `mousedown`.
- The save status is `aria-live="polite"`.
- Keys: Escape leaves focus mode. Cmd/Ctrl + . toggles focus mode.
- Every target is at least 48px: folder rows, group headers, icon buttons, checkbox hit areas, format buttons, the search field.
- Contrast: `#23201b` on `#fbf8f1` is above 15:1. `#71695d` on `#f6f1e7` is about 4.8:1, so dates pass. Do not use `--line-2` for text.

## Responsive rules

- 1180×820 landscape is the reference. From 1024 to 1366 wide, only the editor track changes. The text column stays at 640px max.
- Tablet portrait, 820×1180: start in two panes, list at 288px and the editor taking the rest. The panel toggle opens folders as a 232px drawer over the list, with a soft shadow on its right edge. It does not push the editor. Focus mode works the same as landscape. Editor page padding drops from 48px to 32px.
- Phone, under 600 wide: one pane at a time. Folders is the root screen, the list is pushed on top, the editor is pushed on top of that, each with a back button in a 56px header. The format bar sits above the keyboard, full width, with the same six buttons. Focus mode hides the header only. Body text stays 19px with 20px side padding.
- Never let any pane cause sideways scroll. Every text track is `minmax(0,1fr)` and every pane has `min-width: 0`.
- Do not draw a status bar. Leave 24px at the top.

## Acceptance checklist

### Always

- [ ] Three panes in landscape: folders, list, editor. Each has a labelled landmark.
- [ ] Folder groups collapse and expand with `aria-expanded`. Collapsed items cannot take focus.
- [ ] Selecting a folder filters the list. Selecting a row opens the note.
- [ ] The editor has a title, a meta line, headings, a checklist you can tick, and a quote.
- [ ] A floating format bar with bold, italic, heading, checklist, quote and highlight, plus a word count.
- [ ] One toggle hides folders (two panes). Focus mode hides folders and list (one pane) with a slide, and returns to the previous mode.
- [ ] Hidden panes are `inert`.
- [ ] Pane content keeps its width while the track shrinks. No text reflows during the slide.
- [ ] Save status moves from "Saving" to "Saved" after a pause.
- [ ] Every target is at least 48px. Focus rings are visible on light and dark surfaces.
- [ ] One accent colour. Serif for writing, sans for the interface.
- [ ] Reduced motion makes every move instant and loses no state.

### This demo

- [ ] Track widths are 232px and 316px. The text column is 640px max.
- [ ] Essays is current with four notes. "On keeping a commonplace book" is open with two of four items ticked.
- [ ] The accent is `#b8402b`: the selected row squiggle, ticked boxes, the quote rule, the highlight and the brand full stop.
- [ ] The editor title is Literata 38px. Body is Literata 19px/1.65.

## Implementation notes

Always: animate the grid tracks, not the panes. Keep each pane's inner content at its full width so the shrinking track clips it.

**Pane modes.** One attribute drives all three layouts. Pin each pane to a column.

```css
.app { display: grid; grid-template-columns: var(--w-folders) var(--w-list) minmax(0,1fr);
  transition: grid-template-columns var(--t-pane) var(--ease-out); }
.app[data-mode="two"]   { grid-template-columns: 0px var(--w-list) minmax(0,1fr); }
.app[data-mode="focus"] { grid-template-columns: 0px 0px minmax(0,1fr); }
.folders { grid-column: 1; } .list { grid-column: 2; } .editor { grid-column: 3; }
.pane { min-width: 0; overflow: hidden; }
.folders > .in { width: var(--w-folders); }
.list > .in { width: var(--w-list); }
```

Write `0px`, not `0`. Some engines will not interpolate a unitless zero against a length.

**Group collapse with no height measuring.** Use a one-row grid that animates from `1fr` to `0fr`, and hide the items after the close so they leave the tab order.

```css
.kids { display: grid; grid-template-rows: 1fr; transition: grid-template-rows var(--t-pane) var(--ease-out); }
.kids > div { overflow: hidden; transition: visibility 0s; }
.gh[aria-expanded="false"] + .kids { grid-template-rows: 0fr; }
.gh[aria-expanded="false"] + .kids > div { visibility: hidden; transition: visibility 0s var(--t-pane); }
```

**Checkbox inside a contenteditable.** Mark the button `contenteditable="false"` so the caret skips it. Cancel `mousedown` on the format bar so clicking a button does not drop the selection.

```js
fmt.addEventListener('mousedown', e => { if (e.target.closest('.ib')) e.preventDefault(); });
body.addEventListener('click', e => {
  const b = e.target.closest('.box'); if (!b) return;
  b.setAttribute('aria-checked', b.getAttribute('aria-checked') !== 'true');
  markDirty();
});
```

Common mistakes:

- Animating `width` on each pane, so the text reflows on every frame of the slide.
- Letting the list jump into column 1 when the folders pane becomes a drawer. Pin the columns.
- Using red for links, buttons and icons. Red is the pencil. It marks, it does not navigate.
- A white page. The editor is `#fbf8f1`, the page is `#f6f1e7`.
- Shadows between panes. Use 1px rules.
- A format bar that steals focus and loses the selection.
- Small checkboxes. The visible box is 22px, the hit area is 48px.
- Hidden panes that still take Tab focus.
- Drawing a status bar or a tablet bezel.

Rebuild order:

1. Lay out the three tracks with fixed inner widths.
2. Render the folder tree and the list from data.
3. Open a note into the editor and keep edits in memory.
4. Add the checklist, the quote and the highlight styles.
5. Add the format bar and its pressed states.
6. Add the two toggles and the three modes.
7. Add search, new note and the save status.
8. Check focus order, `inert`, and reduced motion.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
