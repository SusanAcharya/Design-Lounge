<!-- Design Lounge Nº 197 · "Combobox" · www.designlounge.live -->

# Combobox

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them. When a kit is locked, the field and the list use the family's radius. A list of four known options with no typing is `select-field`.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A field for a list long enough that typing helps. The label is Bay. The eight names are Bay 2, Bay 4, Bay 14, Cold store, Dock A, Dock B, Gate 4, and Salt room. The first frame has the letters Ba in the field and the list open on the three bays. The highlight sits on Bay 2. Clicking a row, or pressing Enter, commits that name, writes it into the field, and closes the list. A query that matches nothing shows "No bay matches." under the field. This is not the command palette. That piece searches the whole product. This piece picks one value for one field.

## Structure

```
padding 48px 64px
Dock                         12px
field, width 320
  Bay                        label
  [ Ba ]                     40px combobox
  list, under the field
    Bay 2, Bay 4, Bay 14     each 40px
  No bay matches.            hidden until zero
```

- The input is `role="combobox"` with `aria-autocomplete="list"` and `aria-controls` pointing at the list.
- The list is `role="listbox"`. Each row is `role="option"`.
- `aria-activedescendant` points at the highlighted option.

## Motion

None. The list filters in one frame. Reduced motion has nothing to remove. Do not fade the rows.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Input | each key | the visible rows |
| Arrows | key | the highlight only |
| Enter or click | commit | field text, list closes |
| Escape | close | list hides, text unchanged |
| Zero matches | input | the danger sentence |

## States

- Field: height 40px, padding 0 12px, radius 2px, 1px `--line-strong`, surface fill.
- List: surface, 1px `--line`, radius 2px, padding 4px, directly under the field.
- Option resting: transparent, min-height 40px, padding 0 12px.
- Option highlighted: background `--surface-2`.
- Option selected: background `--primary-soft`, only for the committed name while the list is open.
- Empty: 12px `--danger`, the list hidden.
- Focus-visible: 2px outline, offset 2px, on the field.
- Do not add a second search icon. The typing is the affordance.

## Accessibility

- The label Bay is tied to the input with `for` and `id`.
- The list is labelled by that label.
- `aria-activedescendant` tracks the highlight. `aria-selected` tracks the committed value.
- Arrows, Enter, and Escape are handled on the input.
- The empty sentence is under the field, in the same place an error sits. It is not a toast.
- Hit target: the field and each option are 40px.
- Contrast: `#161513` on white and on `#e7f2ec`, and `#9b2c2c` on `#f6f4ef`, clear 4.5.
- Do not commit on ArrowDown. The person must be able to look before choosing.

## Responsive rules

- At 1280 the field is 320px, padding 48px 64px.
- Below 640 the field is full width inside 20px padding. Options stay at least 40px, and 44px on a phone.
- The list stays under the field. It does not become a full-screen sheet unless the platform cannot draw it. If it must, keep the same names, the same filter, and the same commit keys.
- Eight names is this demo. A product with fifty names keeps this field. A product with four names uses `select-field` and does not add a search.

## Acceptance checklist

- [ ] The eight bays are Bay 2, Bay 4, Bay 14, Cold store, Dock A, Dock B, Gate 4, Salt room.
- [ ] The first frame shows Ba and the three Bay rows, with Bay 2 highlighted.
- [ ] The field is 40px tall, 320px wide, radius 2px.
- [ ] "dock" leaves Dock A and Dock B.
- [ ] A query with no match shows "No bay matches." and hides the list.
- [ ] Arrow keys move the highlight and do not commit.
- [ ] Enter commits the highlight and closes the list.
- [ ] Escape closes the list and keeps the typed text.
- [ ] Highlight is `#f0ebe3`. A committed row, while open, is `#e7f2ec`.
- [ ] There is no animation and no command palette.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The field reads Ba. The list is open. Bay 2 is highlighted. `aria-expanded` is true.
2. Typing filters by a case-insensitive substring. "dock" leaves Dock A and Dock B. Clearing the field shows all eight.
3. ArrowDown and ArrowUp move the highlight and do not commit.
4. Enter commits the highlighted row and closes the list.
5. A click commits that row and closes the list.
6. Escape closes the list and leaves the typed text. It does not commit the highlight.
7. When nothing matches, the list hides and "No bay matches." shows in `--danger`.
8. There is no animation. Focus ring is 2px `--focus`, offset 2px.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --surface-2: #f0ebe3;
  --ink: #161513;
  --ink-2: #5a554c;
  --line: #e4dfd4;
  --line-strong: #cfc6b8;
  --primary-soft: #e7f2ec;
  --danger: #9b2c2c;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Radius is 2px. The family replaces it on the field and the list together. Highlight is `--surface-2`. A committed option, if the list is still open, is `--primary-soft`. After commit the list is closed, so the field text is the value.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Label | sans | 12px | 500 | `--ink-2` |
| Field | sans | 14px | 400 | `--ink` |
| Option | sans | 14px | 400 | `--ink` |
| Empty | sans | 12px | 400 | `--danger` |

The where-line letter-spacing is 0.04em. Options are vertically centered in a 40px row.

## Implementation notes

Filter, then paint. Recreate the options so a hidden row is not left in the tree.

```js
const rows = bays.filter(b => b.toLowerCase().includes(query));
```

Highlight and value are different. Arrows change `active`. Enter sets `value`.

Common mistakes:

- A select for eight names the person must scroll without a filter.
- A command palette that jumps to other screens. This field sets one value.
- Committing on arrow keys.
- A native datalist whose popup ignores the radius and the type.
- Filtering only from the start of the string when the brief says a substring. "store" finds Cold store. "room" finds Salt room. A prefix-only filter would miss both.
- An empty state that is a toast.
- A purple highlight.
- A pill list on a square family.

Where it sits in a product:

1. Use it when the list is longer than a glance and the person knows part of the name.
2. Four roles with no typing is `select-field`.
3. A filter above a table is `filter-toolbar`. The table stays. This field commits one value and closes.
4. Searching every command in the product is `command-palette`.
5. Height and radius come from the family.
6. Highlight is `--surface-2`. Selected is `--primary-soft`.
7. When a theme is locked, those two fills come from the theme.
8. The empty line uses `--danger` because the query failed. It is not a failed load of the page.
9. The where-line Dock is the screen name.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the label and the field with Ba.
3. Open the list on the three bays. Highlight Bay 2.
4. Filter on input.
5. Wire arrows, Enter, and Escape.
6. Wire the empty sentence.
7. Check store matches both store names.
8. Map radius and fills onto the kit.

Copy you keep:

1. Dock.
2. Bay.
3. The eight names, in that order.
4. Ba as the opening query.
5. No bay matches.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
