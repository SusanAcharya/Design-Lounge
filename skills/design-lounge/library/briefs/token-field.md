<!-- Design Lounge Nº 286 · "Token field" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Token field

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the box uses `--radius` and `--control` as its minimum height. A chip that filters a list is `filter-toolbar`. A chip here is a value the person typed.

## What it is

A field that holds several names. The label is "On the truck." Rice and Oil start as chips. The input says "Add a load." Enter commits the typed name as a new chip and clears the input. A name already on the truck is not added again, ignoring case. Each chip has a remove control, 24px inside a 28px chip, named "Remove Rice" or "Remove Oil". Backspace on an empty input removes the last chip. The hint says Enter adds a load and a repeated name is kept once. The box is 420px wide, at least 40px tall, radius 2px.

## Reference behaviour

1. The chips are Rice and Oil, in that order. The input is empty.
2. Typing Tea and pressing Enter adds Tea and clears the input.
3. Typing rice again does not add a second Rice.
4. Remove on a chip drops that name only.
5. Backspace while the input is empty drops the last chip.
6. Backspace while the input has text deletes text, and does not drop a chip.
7. An empty Enter does nothing.
8. There is no animation. The box shows a 2px focus ring while focus is inside it.

## Structure

```
padding 48px 64px
Loads                        12px
On the truck                 label
box, width 420, min-height 40, padding 6, gap 6
  [ Rice × ] [ Oil × ] [ Add a load ]
Enter adds a load. A repeated name is kept once.
```

- The input is labelled by the paragraph "On the truck."
- Each chip is a span plus a button.
- The hint is under the box.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --surface-2: #f0ebe3;
  --ink: #161513;
  --ink-2: #5a554c;
  --line-strong: #cfc6b8;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Chip radius is 2px, the same as the box in this yard. The family replaces both. A pill chip survives only when the family's button is already a pill. The chip fill is `--surface-2`, not `--primary-soft`. These are values, not a selection.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Label | sans | 12px | 500 | `--ink-2` |
| Chip | sans | 14px | 400 | `--ink` |
| Input | sans | 14px | 400 | `--ink` |
| Hint | sans | 12px | 400 | `--ink-2` |

The where-line letter-spacing is 0.04em. The input has no visible border of its own. The box is the field.

## Motion

None. A chip appears in one frame. Reduced motion has nothing to remove.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Enter | a new name | a chip, the input clears |
| Enter | a repeat or empty | no new chip |
| Remove | click | that chip is gone |
| Backspace | empty input | the last chip is gone |

## States

- Box: min-height 40px, padding 6px, gap 6px, radius 2px, 1px `--line-strong`, surface, wrap.
- Box focused: 2px outline `--focus`, offset 2px, on the box, not a second ring on the input.
- Chip: height 28px, padding 0 4px 0 8px, background `--surface-2`, radius 2px.
- Remove: 24px, the character ×, colour `--ink-2`. The accessible name is Remove plus the load.
- Input: height 28px, no border, min-width 120px, transparent background.
- Hint: 12px `--ink-2`.
- Do not turn a chip into a primary button.

## Accessibility

- The label is a visible paragraph tied with `aria-labelledby`.
- Each remove button has a name that includes the load. The × is not the name.
- Enter commits. The person does not need a separate Add button in this demo. A product may add an outline Add if Enter is unclear. It must not be a second primary.
- Backspace removes a chip only when the input is empty, so a typo is not a deleted load.
- Hit target of the field is at least 40px. The remove control is 24px inside the chip. On a phone, make the remove control 44px or keep the chip at least 44px tall with the control filling that height.
- Contrast of the chip text `#161513` on `#f0ebe3` clears 4.5.
- Duplicates are rejected in either case, so Rice and rice are one value.

## Responsive rules

- At 1280 the box is 420px, padding 48px 64px.
- Below 640 the box is full width inside 20px padding. Chips wrap. The input stays at least 120px when it can, and full width when it is the only thing on the last line.
- Do not turn the chips into a select of every possible load. A known short list is `select-field`. A long list you search is `combobox`. This field is for names the person adds.

## Acceptance checklist

- [ ] The chips start as Rice and Oil.
- [ ] Enter on Tea adds Tea and clears the input.
- [ ] Enter on rice does not add a second chip.
- [ ] Enter on an empty input does nothing.
- [ ] Remove Oil drops only Oil.
- [ ] Backspace on an empty input drops the last chip.
- [ ] Backspace while typing does not drop a chip.
- [ ] The box is 420px wide, at least 40px tall, radius 2px.
- [ ] Chips are `#f0ebe3`, not a soft primary.
- [ ] The focus ring is on the box, 2px, offset 2px.
- [ ] There is no animation.

## Implementation notes

Reject a repeat before you push.

```js
if (!name || names.some(n => n.toLowerCase() === name.toLowerCase())) return;
names.push(name);
```

Rebuild the chips from the array. Do not leave a removed button in the tree.

Common mistakes:

- Filter chips that hide rows. That is `filter-toolbar`. These chips are the value.
- A primary chip.
- Pill chips on a square family.
- Backspace deleting a chip while the person is still fixing a letter.
- Two Rices because the check was case-sensitive.
- A dropdown of suggestions that becomes a second combobox. Suggestions may come later. This piece is the entered set.
- An icon with no remove name.

Where it sits in a product:

1. Use it when the value is a set of short names the person types.
2. A filter above a table is the toolbar. A single choice from a long list is the combobox.
3. Chip fill is `--surface-2`. Selected elsewhere is `--primary-soft`. Do not mix them.
4. Radius follows the family, and a pill only if the button is a pill.
5. When a theme is locked, the surface and the chip fill come from the theme.
6. Rice and Oil are the same loads as the rest of the yard. Do not invent a second spelling.
7. The hint states the rule. Do not hide the duplicate rule in an error toast.
8. The where-line Loads is the screen name.
9. One field. Do not ask for the same set in a second box.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the label, the box, Rice, Oil, and the input.
3. Wire Enter, the duplicate check, and Remove.
4. Wire Backspace on an empty input.
5. Check a repeated name is refused.
6. Map the radius and the chip fill onto the kit.

Copy you keep:

1. Loads.
2. On the truck.
3. Rice. Oil.
4. Add a load.
5. Enter adds a load. A repeated name is kept once.
6. Remove, plus the load's name.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
