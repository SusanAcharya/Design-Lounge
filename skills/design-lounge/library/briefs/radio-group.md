<!-- Design Lounge Nº 184 · "Radio group" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Radio group

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. The selected row uses `--primary-soft`. The radius and row height follow the family.

## What it is

One question, Shift, with three answers a person can see at once: Morning, Swing, Night. Morning starts selected. The selected row sits on the soft green. The control is a native radio, drawn as an 18px circle with an 8px dot. A status line under the group reads "Morning is on the gate." Choosing another shift rewrites that line. This is not a select. The list is short enough to stay open. It is not a checkbox. One shift is on the gate.

## Reference behaviour

1. Morning is checked. Its row background is `--primary-soft`. The status line names Morning.
2. Clicking Swing or Night checks that radio, clears the others, paints that row, and updates the status line to "Swing is on the gate." or "Night is on the gate."
3. Arrow keys move the selection. The browser does this for radios that share a name. Do not rebuild arrow keys in script.
4. Tab enters the group once, on the checked radio, and leaves the group. Tab does not stop on every row.
5. There is no animation and no error in the first frame. A product shows an error under the legend only after submit if nothing is checked. This demo always has a selection.
6. Focus ring is 2px `--focus`, offset 2px, on the radio.

## Structure

```
padding 48px 64px
People                      12px
fieldset, width 320, border 0
  Shift                     legend 12px
  ( ) Morning               row 44px
  ( ) Swing
  ( ) Night
Morning is on the gate.     12px status
```

- `fieldset` and `legend`. The legend is the question.
- Each row is a `label` wrapping the radio and the word, so the whole row is the hit target.
- The radios share `name="shift"`.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --line: #e4dfd4;
  --line-strong: #cfc6b8;
  --primary: #1f4d3a;
  --primary-soft: #e7f2ec;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Row radius is 2px in this yard demo. A locked family replaces it. The selected fill stays `--primary-soft`, not a solid primary button.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Legend | sans | 12px | 500 | `--ink-2` |
| Option | sans | 14px | 400 | `--ink` |
| Status | sans | 12px | 400 | `--ink-2` |

The where-line letter-spacing is 0.04em. Option text is vertically centered in the 44px row.

## Motion

None. Selection changes in one frame. Reduced motion has nothing to remove. Do not slide a thumb the way a segmented control does. A segmented control is `segmented-control-sliding`. This is a form question.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Click | label | checked radio, row fill, status line |
| Arrows | native | the next or previous radio |
| Focus | keyboard | ring on the 18px circle |

## States

- Row resting: min-height 44px, padding 0 12px, 1px `--line`, surface fill, radius 2px, gap 8px between rows.
- Row selected: background `--primary-soft`, border transparent. The 18px circle border is `--primary`. The 8px dot is `--primary`.
- Radio resting: 18px circle, 2px `--line-strong`, white fill.
- Focus-visible: 2px outline, offset 2px, on the radio.
- Hover does not need a second fill. The row is the target. Do not invert the row into a solid primary.
- Disabled, if a product needs it: the row text stays `--ink-2` without fading the checked dot below 4.5 on the soft fill.

## Accessibility

- The legend names the group. Do not add a separate heading that repeats Shift.
- Native radios provide the arrow keys, the single tab stop, and the checked state. Do not replace them with `role="radio"` unless the platform cannot draw this circle.
- The status line is `role="status"` so a change is announced. It repeats the value. The checked radio is still the source.
- Hit target: the label row is 44px. The circle is 18px inside that row, not the only target.
- Contrast: `#161513` on `#e7f2ec` and `#1f4d3a` on white clear 4.5. The dot is not the only sign. The word and the row fill agree.
- Do not rely on colour alone. The dot and the status sentence both name the shift.

## Responsive rules

- At 1280 the group is 320px, left aligned, padding 48px 64px.
- At 768 it may grow to max 420px.
- Below 640 it is full width inside 20px padding. Rows stay at least 44px. Do not turn it into a select at phone width. Three options fit.

## Acceptance checklist

- [ ] The legend is Shift. The options are Morning, Swing, Night.
- [ ] Morning starts checked and its row is `#e7f2ec`.
- [ ] The status line starts "Morning is on the gate."
- [ ] Clicking Night checks Night only and rewrites the status line.
- [ ] Arrow keys move between the three radios.
- [ ] Tab stops once in the group.
- [ ] Each row is at least 44px. The circle is 18px with an 8px dot.
- [ ] The group is 320px wide. Radius is 2px.
- [ ] There is no animation and no second selected row.
- [ ] The control is a native radio, not a button with aria-pressed.

## Implementation notes

Draw the circle on the native control. The row colour uses `:has()` so the label knows it contains a checked input.

```css
label:has(input:checked) { background: var(--primary-soft); border-color: transparent; }
input:checked::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--primary); }
```

`appearance: none` removes the native glyph. Put the focus ring back yourself.

Common mistakes:

- A select for three options the person should see.
- Checkboxes that allow Morning and Night together.
- A script that reimplements arrow keys and breaks the native tab stop.
- A solid primary row, so the choice looks like a button that submits.
- A 12px circle with no padding, so the hit target is the circle.
- Pill rows when the family button is not a pill.
- Hiding the legend because it "takes space".
- A status line that says "Updated" and never names the shift.

Where it sits in a product:

1. Use it for two to five options that stay visible. More than five is `select-field`.
2. On and off for one setting is `toggle-switch-set`, not two radios named On and Off, unless the words are real states such as Morning and Night.
3. The selected row is `--primary-soft`. Hover on other controls is `--surface-2`. Do not mix them up.
4. The family wins the radius. This 2px is the yard demo.
5. One question, one group. Do not repeat the options as tabs.
6. The where-line People matches the yard's other forms. A product uses its own screen name.
7. When a theme is locked, the green soft fill becomes that theme's `--primary-soft`.
8. Do not put the group inside a card unless the screen is a card of several questions.
9. An unanswered group, after submit, gets one error under the legend in `--danger`, the same sentence pattern as `text-field`.
10. Keep one name attribute. A second name makes two groups.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the where-line, the fieldset, and the legend.
3. Place three labels with radios. Morning is checked.
4. Paint the checked row and the 8px dot.
5. Write the status line from the checked value.
6. Leave arrow keys to the browser.
7. Check Tab lands once.
8. Replace the radius with the locked family when a kit is on.

Copy you keep:

1. People.
2. Shift.
3. Morning, Swing, Night.
4. Morning is on the gate. Swap the shift name when the choice changes.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
