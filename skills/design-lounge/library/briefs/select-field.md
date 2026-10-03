<!-- Design Lounge Nº 187 · "Select field" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Select field

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens and the family's radius. Do not style the browser's native popup.

## What it is

One select on a quiet form. The page is warm paper. "People" is a 12px label for where the field sits. The field label is "Role". The closed control is a 40px button, 320px wide, radius 2px, showing Dispatch. The list opens under it with four options: Dispatch, Finance, Yard, Studio. The list uses the same surface, the same line, and the same 2px radius as the field. The selected option sits on a soft green. Hover, and the keyboard highlight, sit on a warmer surface. The first frame is the open list, so the piece is visible without a click. Clearing the value closes the list and shows "Choose a role." in danger red under the field. That error is how an empty submit looks. It is not a toast.

## Reference behaviour

1. The list starts open. Dispatch is selected and highlighted. The button reads Dispatch. `aria-expanded` is true.
2. Clicking an option sets the button to that role, marks it selected, hides the error, and closes the list.
3. Clicking the button toggles the list.
4. ArrowDown and ArrowUp move the highlight. They open the list if it is closed. They do not change the committed value until Enter.
5. Enter on an open list commits the highlighted option and closes the list.
6. Escape closes the list and keeps the committed value.
7. "Clear" sets the value to empty, the button reads "Choose a role", the error shows, and the list closes. Clear is a demo control. In a product, the error appears when the form is submitted with an empty value. Do not ship a Clear button beside every select.
8. There is no animation.
9. Focus ring is 2px `--focus`, offset 2px, on the button and on Clear.

## Structure

```
padding 48px 64px
People                       12px
field, width 320, position relative
  Role                       12px label
  [ Dispatch ]               40px button
  list, absolute, top 68px, radius 2
    Dispatch, Finance, Yard, Studio    each min-height 40
  Choose a role.             12px, hidden until empty
[ Clear ]                    outline, demo only
```

- The list is a `ul` with `role="listbox"`. Options are `li` with `role="option"`.
- The button points at the list with `aria-controls` and `aria-haspopup="listbox"`.
- The error paragraph is `hidden` until the value is empty.

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
  --primary: #1f4d3a;
  --primary-soft: #e7f2ec;
  --danger: #9b2c2c;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Radius is 2px because this demo sits with the industrial yard controls. A locked family replaces the radius. Quiet is 6px. Soft is 14px. Do not keep 2px after the family is locked.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Label | sans | 12px | 500 | `--ink-2` |
| Value | sans | 14px | 500 | `--ink` |
| Option | sans | 14px | 400 | `--ink` |
| Error | sans | 12px | 400 | `--danger` |
| Clear | sans | 14px | 400 | `--ink-2` |

The label letter-spacing on the where-line is 0.04em. Options are 14px, vertically centered in a 40px row.

## Motion

None. The list appears and disappears in one frame. Reduced motion has nothing to remove. Do not slide or fade the list.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Button click | toggle | list hidden or shown |
| Option click | commit | value, selection, list closes, error hides |
| Arrows | move | highlight only |
| Enter | commit | highlighted option becomes the value |
| Escape | close | list hides, value unchanged |
| Clear | empty | error shows, list closes |

## States

- Button resting: height 40px, padding 0 12px, radius 2px, 1px `--line-strong`, surface fill, text aligned left.
- List: surface, 1px `--line`, radius 2px, padding 4px, positioned under the button.
- Option resting: transparent, min-height 40px, padding 0 12px, radius 2px.
- Option highlighted (`data-on`): background `--surface-2`.
- Option selected: background `--primary-soft`. Selection wins over highlight when both are true.
- Error: 12px `--danger`, hidden until the value is empty.
- Clear: height 36px, outline `--line-strong`, text `--ink-2`. Not a primary button.
- Focus-visible: 2px outline, offset 2px.
- The native select popup is not used. Do not add a second arrow icon that does not match Lounge Icons. This demo has no icon. The open list is the affordance.

## Accessibility

- The button has `aria-haspopup="listbox"` and `aria-expanded`.
- The list has `role="listbox"` and is labelled by the Role label.
- `aria-activedescendant` on the list points at the highlighted option.
- Each option has `aria-selected` true only for the committed value. An empty value means every option is false.
- Arrow keys are handled on the button. The options are clicked with the pointer. Enter commits.
- Escape closes without committing the highlight.
- The error is in the field, under the control, so it is read with the field. It is not a live toast.
- Hit targets: the button and each option are 40px. Clear is 36px.
- Contrast: `#161513` on white, `#1f4d3a` on `#e7f2ec`, and `#9b2c2c` on `#f6f4ef` clear 4.5.
- Do not rely on the soft green alone. The button text is the value.

## Responsive rules

- At 1280 the field is 320px, left aligned with 48px 64px padding. The rest of the frame stays empty. This is one control, not a settings page.
- At 768 the field may grow to the content width, max 420px.
- Below 640 the field is full width inside 20px padding. Options stay 40px. Do not switch to the native picker unless the platform cannot draw this list. If you must use the native control, keep the label, the 40px height, the radius, and the error under the field.

## Acceptance checklist

- [ ] The first frame has the list open and Dispatch selected.
- [ ] The button is 40px tall, 320px wide, radius 2px.
- [ ] Options are Dispatch, Finance, Yard, Studio, each at least 40px tall.
- [ ] The selected option background is `#e7f2ec`.
- [ ] Clicking Yard sets the button to Yard and closes the list.
- [ ] ArrowDown moves the highlight without closing the list.
- [ ] Enter commits the highlight.
- [ ] Escape closes the list and keeps the previous value.
- [ ] Clear shows "Choose a role." in `#9b2c2c` and the button reads "Choose a role".
- [ ] The error is under the field, not a toast.
- [ ] Clear is not a filled primary button.
- [ ] Focus ring is 2px, offset 2px.

## Implementation notes

Commit and highlight are different. Highlight is `data-on` and `aria-activedescendant`. The committed value is `aria-selected` and the button text. Arrows change only the highlight. Enter and a click commit.

```js
if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
  e.preventDefault();
  if (list.hidden) open(true);
  active = (active + (e.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length;
}
```

Close with the `hidden` attribute on the list, not only a class, so the options leave the accessibility tree.

Common mistakes:

- A native select whose popup ignores the radius, the type, and the selected colour.
- A second radius on the list, larger than the field.
- A purple highlight.
- An error toast instead of the line under the field.
- Committing the value on ArrowDown, so the person cannot look before choosing.
- A Clear button that looks like the primary submit.
- Shipping Clear in the product. The product shows the error on submit.
- Four selects in a row when the form needs one.
- A search field inside a four-option list. Search belongs on a long list, not here.
- An icon from a set other than Lounge Icons. This control has no icon.

Where it sits in a product:

1. It is the control for a short, known list: a role, a firing, a plan.
2. It uses the same height and radius as the other fields and buttons. The family wins the radius.
3. The label is above the field. The error is under it. Hint text, if you need it, is `--ink-3` and yields to the error.
4. People, in this yard, are the four roles. The list `people-role-list` filters those same words. Do not invent a fifth role on the select and a different fifth on the list.
5. A date is `date-range-picker`, not this select.
6. A long list of countries is not this piece. Say the library has no country select, and build a field from the sheet rather than a new visual language.
7. One select does not need a card around it.
8. The open list is the hero frame of the demo. A product starts closed, with the current value showing.
9. Empty is an error only after submit. Opening the page does not show the error.
10. Selected is `--primary-soft`. Hover is `--surface-2`. Do not invert the option into a filled primary button.
11. When a theme is locked, the green becomes that theme's `--primary-soft`.
12. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the where-line, the label, and the 40px button.
3. Place the list under the button with the four roles. Dispatch starts selected. The list starts open.
4. Wire a click on an option to commit and close.
5. Wire the button to toggle the list.
6. Wire ArrowUp, ArrowDown, Enter, and Escape on the button.
7. Wire Clear to the empty error.
8. Check highlight and selection can differ while the list is open.
9. Check the error is hidden when a role is chosen.
10. Replace the 2px radius with the locked family's radius when a kit is on.

Copy you keep:

1. People.
2. Role.
3. Dispatch, Finance, Yard, Studio.
4. Choose a role.
5. Clear, demo only.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
