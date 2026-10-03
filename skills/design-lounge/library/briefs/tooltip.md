<!-- Design Lounge Nº 265 · "Tooltip" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Tooltip

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the tip is `--ink` with `--primary-ink` or the theme's light ink. Do not put a tooltip on a chart.

## What it is

One outline button, Hold, with a tip under it: "Keeps the load on the dock until 18:00." The tip starts visible so the piece can be read without a hover. Moving the pointer off the button hides it. Focusing the button shows it. The tip is 240px wide, ink fill, cream text, 13px, radius 2px. It is a description of the control. It is not a toast, not a menu, and not the value of a bar.

## Reference behaviour

1. The first frame shows the tip under Hold.
2. Pointer leave hides it. Pointer enter shows it.
3. Focus shows it. Blur hides it.
4. There is no click action. Hold does not open a dialog in this piece.
5. The tip has no close button and no timer.
6. Focus ring is 2px `--focus`, offset 3px, on the button.
7. There is no animation. It appears in one frame.

## Structure

```
padding 80px 64px
wrap, position relative, inline-block
  [ Hold ]                     40px button
  tip, top 48px, width 240     under the button
```

- The button has `aria-describedby="tip"`.
- The tip is `role="tooltip"`.
- Hide it with the `hidden` attribute.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --line-strong: #cfc6b8;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

The tip uses `--ink` and `#fffdf8`. When a theme is locked, the tip background is `--ink` and the text is the light ink that clears 4.5 on it, the same cream the primary label uses when that cream passes. Do not use the brand red as the tip.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Button | sans | 13px | 500 | `--ink` |
| Tip | sans | 13px | 400 | `#fffdf8` |

The tip line-height is 1.4. Padding is 8px 12px. It is one sentence.

## Motion

None. Reduced motion has nothing to remove. Do not delay the tip by 400ms in this demo. If a product delays it, keep the delay under 200ms and show it at once when `prefers-reduced-motion` is set. Do not fade it.

| Thing | Trigger | What changes |
| --- | --- | --- |
| First paint | the hero | tip visible |
| mouseleave, blur | hide | `hidden` |
| mouseenter, focus | show | tip visible |

## States

- Button: height 40px, padding 0 14px, radius 2px, 1px `--line-strong`, surface fill. The family's radius and height replace these.
- Tip resting open: absolute, left 0, top 48px, width 240px, radius 2px, background `--ink`, text `#fffdf8`.
- Tip hidden: `hidden`, `display: none`.
- Focus-visible on the button: 2px outline, offset 3px.
- The tip is not a card with a shadow unless the family's shadow is not `none`. This yard shadow is none. Do not add one.

## Accessibility

- The button's accessible description is the tip, via `aria-describedby`.
- The tip is also visible text. Do not put the only copy in a title attribute.
- Hover alone is not enough. Focus shows the same tip.
- The tip is not a live region. It does not announce on a timer.
- Hit target: the button is 40px. The tip is not a target.
- Contrast: `#fffdf8` on `#161513` clears 4.5.
- Do not trap focus in the tip. It is not a dialog.

## Responsive rules

- At 1280 the tip sits under the button, padding 80px 64px so the tip is not against the frame edge.
- Below 640 the tip may be width 100% up to 240px. It must stay on screen. If the button is near the bottom, place the tip above it. This demo has room below.
- On a phone, a tip that only exists on hover is useless. Prefer the sentence under the control, as `text-field` does with a hint. Use this tooltip on web, for a control whose name is already clear and whose extra sentence is short.

## Acceptance checklist

- [ ] The button reads Hold.
- [ ] The tip reads "Keeps the load on the dock until 18:00."
- [ ] The tip starts visible, 240px wide, on `#161513` with `#fffdf8` text.
- [ ] Pointer leave hides it. Pointer enter shows it.
- [ ] Focus shows it. Blur hides it.
- [ ] The button is 40px tall, radius 2px.
- [ ] `aria-describedby` points at the tip.
- [ ] Focus ring is 2px, offset 3px.
- [ ] There is no close button, no timer, and no chart.
- [ ] There is no animation.

## Implementation notes

The first frame omits `hidden`. The listeners set it after the first leave or blur.

```js
function show(on){ tip.hidden = !on; }
hold.addEventListener('focus', () => show(true));
hold.addEventListener('blur', () => show(false));
```

Common mistakes:

- A `title` attribute as the only tip.
- A tip that shows on hover and never on focus.
- A chart tooltip that covers a bar. The chart pieces forbid that. The number belongs in the heading.
- A toast that looks like this tip and then stacks. Toasts are `toast-stack`.
- A menu of actions inside the tip. A menu is `nested-dropdown-menu`.
- Brand red text on the ink fill.
- A delay so long the person has left.
- A shadow on a family whose shadow is none.
- Essential instructions that exist only in the tip. If the person must know it, put it on the page. The dock time is a description of Hold, not the only clock on a scheduling screen.

Where it sits in a product:

1. Use it for a short description of a control that already has a visible name.
2. Do not use it for errors. Errors sit under the field.
3. Do not use it for values on a chart, a meter, or a sparkline.
4. Do not use it on a phone as the only way to read the sentence.
5. One tip. Do not tip every button in a row.
6. The family's radius applies to the button and to the tip's 2px corner in this demo. A square family squares the tip. The tip stays filled with `--ink`.
7. When a theme is locked, check the cream on that theme's ink. If it fails 4.5, use the theme's light ink that passes.
8. Hold does not submit. If Hold becomes an action, the status belongs on the page, not in the tip.
9. Keep the credit line on the token block.
10. The where of this piece is the button itself. There is no second heading.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place Hold and the tip under it, open.
3. Wire pointer and focus.
4. Check blur and leave hide it.
5. Check the description relationship.
6. Map the fill onto `--ink` when a kit is on.

Copy you keep:

1. Hold.
2. Keeps the load on the dock until 18:00.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
