<!-- Design Lounge Nº 174 · "Button roles" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Button roles

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, height is `--control` and radius is `--radius`. One solid primary per view.

## What it is

Five buttons in one row on the shift screen. Save is the solid primary. Cancel is outline. Preview is a soft fill. Remove is outline with danger text and a danger border, not a second solid. Export is disabled. A status line under the row reports the last click. Remove's status says it stays outline. This is the component sheet's button, shown as a set so the roles do not drift apart.

## Reference behaviour

1. The first frame has no status text. Save is the only solid button.
2. Save writes "Shift saved."
3. Cancel writes "Left the shift as it was."
4. Preview writes "Preview opened."
5. Remove writes "Remove stays outline. It is not a second primary."
6. Export does not fire. It is disabled.
7. Focus ring is 2px `--focus`, offset 3px.
8. There is no menu, no icon, and no animation.

## Structure

```
padding 48px 64px
Shift                        12px
[ Save ] [ Cancel ] [ Preview ] [ Remove ] [ Export ]
status line                  14px, empty until a click
```

- The row is a flex line, gap 8px, wrap allowed.
- Each control is a `button type="button"`.
- Export has the `disabled` attribute.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --ink: #161513;
  --ink-2: #5a554c;
  --line-strong: #cfc6b8;
  --primary: #1f4d3a;
  --primary-ink: #fffdf8;
  --primary-soft: #e7f2ec;
  --danger: #9b2c2c;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Radius is 2px in this yard demo. Quiet becomes 6px. Soft becomes 14px, and Soft's primary may be a pill because that family's button is a pill. Do not pill these buttons on Quiet, Sharp, Editorial, or Industrial.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Button | sans | 13px | 500 | see states |
| Status | sans | 14px | 400 | `--ink` |

Buttons are 13px on web and 15px on a phone. Line-height is 1. The label is vertically centered by the fixed height.

## Motion

None. The status text replaces itself in one frame. Reduced motion has nothing to remove. Do not morph the label into a spinner. A button that shows its own progress is `button-state-morph`.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Save, Cancel, Preview, Remove | click | the status sentence |
| Export | none | stays disabled |
| Focus | keyboard | ring, offset 3px |

## States

- Outline: height 40px, padding 0 14px, radius 2px, 1px `--line-strong`, transparent fill, text `--ink`.
- Primary: fill `--primary`, text `--primary-ink`, border transparent. One per view.
- Soft: fill `--primary-soft`, text `--ink`, border transparent.
- Danger outline: text `--danger`, border `--danger`, transparent fill. Not a solid red.
- Disabled: opacity 0.4. Export has no unique information, so the fade is the disabled button from the component sheet.
- Focus-visible: 2px outline, offset 3px.
- Hover, when you add it: outline buttons take an `--ink` border. Primary stays the fill. Do not invent a third hover colour. Sharp is the family that may use `--inverse` on primary hover.

## Accessibility

- Each button has a visible text name. Do not use an icon alone here.
- Export is `disabled`, so it leaves the tab order.
- The status line is `role="status"`.
- Hit target: 40px tall on this web demo. Phone buttons are at least 44px.
- Contrast: `#fffdf8` on `#1f4d3a`, `#161513` on `#e7f2ec`, and `#9b2c2c` on `#f6f4ef` clear 4.5. Disabled is exempt.
- Remove is still a button. Do not make it a link styled as a button.

## Responsive rules

- At 1280 the row sits in 48px 64px padding and may wrap.
- Below 640 the buttons stack or wrap. Each stays full height. Do not shrink type below 13px.
- On a phone, height follows the family's phone control size.

## Acceptance checklist

- [ ] The five labels are Save, Cancel, Preview, Remove, Export.
- [ ] Only Save is a solid `#1f4d3a` button with `#fffdf8` text.
- [ ] Cancel is outline.
- [ ] Preview is `#e7f2ec` with ink text.
- [ ] Remove is outline, text and border `#9b2c2c`, not a solid red.
- [ ] Export is disabled at opacity 0.4 and does not activate.
- [ ] Each enabled button writes its sentence into the status line.
- [ ] Buttons are 40px tall, radius 2px, label 13px weight 500.
- [ ] Focus ring is 2px, offset 3px.
- [ ] There is no second solid button and no animation.

## Implementation notes

On a form, the solid button is the commit. A destructive control on that same view stays outline. On a confirm dialog, the rule flips: cancel is outline and the destructive action is the one solid button. That dialog is `modal-dialog-focus-trap`. Do not put two solids on either screen.

```css
.primary { background: var(--primary); color: var(--primary-ink); border-color: transparent; }
.danger { color: var(--danger); border-color: var(--danger); background: transparent; }
```

Common mistakes:

- Two solid buttons, Save and Remove.
- A solid red Remove beside a solid green Save.
- A gradient fill.
- A 32px height.
- Icon-only buttons with no name.
- Export left enabled and grey by colour alone, still clickable.
- A pill radius on a family whose button is not a pill.
- Hover that shifts to a purple.
- A status toast instead of the line on the page.

Where it sits in a product:

1. Every button in the product uses these roles. A brief that draws its own button loses.
2. One primary per view. A duplicated solid becomes outline.
3. Soft is for a second action that is not the outline and not the commit, such as Preview.
4. Danger outline is for a destructive action that shares the view with a primary. The confirm step, if you need one, is the dialog, and there the danger action becomes the only solid.
5. Disabled uses opacity 0.4. A disabled text field that shows a value does not. See `text-field`.
6. Height and radius come from the family.
7. When a theme is locked, primary and primary-ink come from the theme. A brand red that disappears on a dark page is walked lighter. Text on the button is `--primary-ink`, not the raw brand.
8. Do not add an icon from outside Lounge Icons. This row has no icon.
9. The where-line Shift is the screen name.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the five buttons in a row, gap 8px.
3. Paint Save, Cancel, Preview, Remove, and the disabled Export.
4. Wire the four status sentences.
5. Check Export does not click.
6. Check only one button is solid.
7. Swap height and radius for the locked family.

Copy you keep:

1. Shift.
2. Save. Shift saved.
3. Cancel. Left the shift as it was.
4. Preview. Preview opened.
5. Remove. Remove stays outline. It is not a second primary.
6. Export, disabled.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
