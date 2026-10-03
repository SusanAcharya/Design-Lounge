<!-- Design Lounge Nº 250 · "Shortcut sheet" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Shortcut sheet

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

## What it is

A shortcut sheet for the yard desk. It starts open. Groups are General, Loads, and View. Each row is an action and a kbd. Pressing that key marks the row. Escape closes the sheet and shows a button to open it again. Question mark opens it. This is not the command palette. That palette searches actions. This sheet only lists the keys.

## Reference behaviour

1. The sheet starts visible. The open button is hidden.
2. Rows: This sheet (?), Search loads (⌘K), New note (N), Hold the load (H), Export the selection (E), Today (1), The week (2).
3. Pressing a listed key sets data-on on that row and clears the others.
4. Escape hides the sheet and shows Show shortcuts.
5. Show shortcuts opens the sheet again.
6. Pressing ? while closed opens the sheet.
7. The marked row uses the green wash. Nothing else moves.

## Structure

```
480px dialog, centered
Shortcuts
GENERAL
row · kbd
LOADS
VIEW
```

- The sheet is role dialog, width 480px, padding 24px 24px 12px.
- Group labels are h2, 12px, uppercase, tracking 0.08em.
- Each row is 40px min-height with a top border.
- kbd is IBM Plex Mono 12px, border-bottom 2px.
- The reopen button is 40px, fill #1f4d3a.

## Tokens

```css
:root {
  --bg:#f6f4ef; --surface:#fff; --ink:#161513; --ink-2:#5a554c;
  --line:#e4dfd4; --line-2:#cfc6b8; --primary:#1f4d3a; --soft:#e7f2ec;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Title | IBM Plex Sans | 22px | 600 | 1.2 | 0 |
| Group | IBM Plex Sans | 12px | 500 | 1 | 0.08em |
| Key | IBM Plex Mono | 12px | 500 | 1 | 0 |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Sheet | Escape or button | shown | hidden | none | instant |

## States

- Open: dialog visible, button hidden.
- Closed: dialog hidden, button visible.
- Marked row: data-on true, background #e7f2ec.
- Unmarked rows have no wash.

## Accessibility

- The dialog is labelled by the heading.
- Keys are kbd elements.
- The reopen button is named Show shortcuts.
- Do not steal keys that are typed into a field. This demo has no field.
- Marked state is visual. Do not move focus on keypress.
- Focus ring is 2px #1f4d3a, offset 3px.

## Responsive rules

- The sheet is 480px at 1280.
- Below 520 it is calc(100% - 32px).
- Rows stay one line. The kbd does not wrap under the label until 360px.

## Acceptance checklist

### Always

- [ ] The sheet lists real actions, not placeholder keys.
- [ ] Pressing a listed key marks that row.
- [ ] Escape closes. A button reopens.
- [ ] Only one row is marked.
- [ ] Group labels are uppercase and quiet.

### This demo

- [ ] Title is Shortcuts.
- [ ] Search loads shows ⌘K.
- [ ] Hold the load shows H.
- [ ] The wash is #e7f2ec.
- [ ] Sans is IBM Plex Sans. Keys are IBM Plex Mono.

## Implementation notes

Compare event.key lowercased to data-key. Ignore keys longer than one character except Escape.

```js
if (e.key === "Escape") { sheet.hidden = true; open.hidden = false; }
```

⌘K is displayed as a kbd. The listener in this demo marks K, because event.key is k. Say that in the row if you need the modifier to be required.

## Measurements to keep

- Sheet 480px, padding 24px 24px 12px, radius 2px.
- Row min-height 40px. Marked row margin 0 -12px and padding 0 12px.
- kbd padding 2px 6px, border-bottom-width 2px.
- Group margin 16px 0 8px. Title margin 0 0 16px.
- Reopen button height 40px, padding 0 14px.

## Wrong turns

- Do not turn this into a searchable palette.
- Do not mark every row.
- Do not use a tooltip per key. The sheet is the list.
- Do not animate the wash.
- Do not invent shortcuts the product does not implement.
- Do not close when a listed key is pressed. Only Escape closes.

## Fit with the rest of the library

- Search of actions is `command-palette`.
- A hint on one control is `tooltip`.
- This sheet is `shortcut-sheet`.
- Do not put the sheet inside the command palette.
- The selection export key points at `selection-bar`.
- Hold points at a load action, not at `drag-to-confirm`.

## Keyboard

- ? opens the sheet when it is closed.
- Escape closes it.
- k marks Search loads.
- n marks New note.
- h marks Hold the load.
- e marks Export the selection.
- 1 marks Today.
- 2 marks The week.
- The reopen button is the way back after Escape.
- Do not use a positive tabindex.
- The dialog does not trap focus in this demo.
- Only the matching data-key is marked.
- Modifier display ⌘ is typographic. The listener uses the character.
- Group headings are not buttons.
- The sheet starts open.
- Type for keys is IBM Plex Mono.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
