<!-- Design Lounge Nº 367 · "Property list" · designlounge.vercel.app -->

# Property list

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the list uses `--surface`, `--line`, and `--radius-card`. A whole record page with a path and a primary action is `record-detail-header`. This is the list of facts.

## What it is

Four facts for load 1842, in a definition list. Gate is Gate 4. Driver is Mira Shrestha. Slot is 17 October. Weight is 2,400 kg. Each row is at least 48px, with the label in a 140px column of `--ink-2` and the value in `--ink`. The list is 420px wide, on the surface, with a hairline between rows and none under the last. There is no button, no edit, and no badge. A badge for a state is `status-badge`. A page around this list is the record header.

## Reference behaviour

1. The four rows show in that order, with those values.
2. Nothing toggles. The list is the piece.
3. The weight uses tabular numbers and a thousands separator: 2,400 kg.
4. There is no animation and no hover that changes a row into a button.
5. The rows are not links. A product that navigates from a fact uses a real link and says so. This demo does not.

## Structure

```
padding 48px 64px
Load 1842                    12px
list, width 420, surface, radius 2
  Gate          Gate 4
  Driver        Mira Shrestha
  Slot          17 October
  Weight        2,400 kg
each row min-height 48, label column 140
```

- The element is a `dl`. Each pair is a `dt` and a `dd` inside a row.
- The where-line is the load's name. It is not one of the facts.
- Do not use a table for two columns of label and value. The definition list is the meaning.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --line: #e4dfd4;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

List radius is 2px. The family's card radius replaces it. Do not add a shadow if the family's shadow is none. The label column stays 140px on this frame.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Label | sans | 14px | 500 | `--ink-2` |
| Value | sans | 14px | 400 | `--ink` |

The where-line letter-spacing is 0.04em. The weight is tabular. Labels are not uppercase. Values are not a second face unless a pairing locks the number face, and then only the weight uses it if the rest of the value is words. "2,400 kg" can stay in the text face because the unit is words. Do not set kg in mono and the digits in another face.

## Motion

None. Reduced motion has nothing to remove.

| Thing | Trigger | What changes |
| --- | --- | --- |
| None | the facts are the content | the rows do not animate |

## States

- List: width 420px, surface, 1px `--line`, radius 2px.
- Row: min-height 48px, padding 0 16px, grid of 140px and the rest, gap 12px, a 1px `--line` under every row but the last.
- Label: `--ink-2`, weight 500.
- Value: `--ink`, weight 400.
- There is no selected row. A current page in a tree is `tree-nav`. This list is not navigation.
- There is no hover fill. Adding hover makes the row look clickable. If a product later makes a row a link, use the row hover from the component sheet, `--surface-2`, and a real link.

## Accessibility

- The `dl` exposes the pairs. The label is the `dt`. The value is the `dd`.
- Do not repeat the label inside the value.
- The where-line is not a heading that replaces the pairs. A product page gives the load one heading. This demo's where-line is the name of the list.
- Contrast: `#5a554c` and `#161513` on white clear 4.5.
- Nothing here is a control, so there is no focus ring to draw. Do not add a tabindex to a row that does nothing.
- The reading order is label then value, row by row.

## Responsive rules

- At 1280 the list is 420px, padding 48px 64px.
- Below 640 the list is full width inside 20px padding. The label column may shrink to 112px. If a value is long, the row may stack the label above the value and stay at least 48px.
- Do not turn the pairs into cards. Four facts are one list.
- On the record page, this list sits in the pass column. It does not become a second width beside a 720px page.

## Acceptance checklist

- [ ] The pairs are Gate / Gate 4, Driver / Mira Shrestha, Slot / 17 October, Weight / 2,400 kg.
- [ ] The list is a definition list, 420px wide, on white, radius 2px.
- [ ] Each row is at least 48px. The label column is 140px and `#5a554c`.
- [ ] The value is `#161513`.
- [ ] A hairline sits between rows and not under the last.
- [ ] The weight is 2,400 kg with a comma.
- [ ] The rows are not buttons and not links.
- [ ] There is no badge, no edit control, and no animation.
- [ ] The where-line is Load 1842.
- [ ] Mira Shrestha is the same driver named elsewhere in the yard.

## Implementation notes

Use a grid so the values share a left edge.

```css
.row { display: grid; grid-template-columns: 140px 1fr; min-height: 48px; }
```

Common mistakes:

- A two-column table with a header row Label and Value. The labels are the headers of their own values.
- Uppercase labels with wide tracking.
- A card per fact.
- Mixing this list with a badge row and calling both the same component. State is `status-badge`.
- Rebuilding the whole record page. The path, the title, and the primary action are `record-detail-header`.
- A second weight format, 2400 kg, beside 2,400 kg on the receipt.
- Hover that looks like a button and goes nowhere.

Where it sits in a product:

1. Put it on a record, under the title, for facts that are not the title and not a state.
2. The record page already has a definition list inside it. Use this alignment and these sizes when you build that block. Do not invent a second label column.
3. The list radius is the card radius from the family.
4. When a theme is locked, the surface, the line, and the two inks come from the theme.
5. Four facts is this load. A product lists the facts it has. Do not add an empty row.
6. Gate 4, Mira Shrestha, and 17 October match the calendar, the tree, and the chat. Do not rename one of them here.
7. Weight is 2,400 kg. The rice price elsewhere is money, not this weight.
8. The where-line Load 1842 is the name. The order number on the receipt is also 1842. They can be the same load. Do not give the receipt a different id.
9. No primary button in the list. The page has one, outside it.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the where-line and the definition list.
3. Place the four pairs in order.
4. Align the values. Drop the last hairline.
5. Check the pairs are not buttons.
6. Map the surface and the radius onto the kit.

Copy you keep:

1. Load 1842.
2. Gate. Gate 4.
3. Driver. Mira Shrestha.
4. Slot. 17 October.
5. Weight. 2,400 kg.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
