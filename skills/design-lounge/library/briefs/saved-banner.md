<!-- Design Lounge Nº 255 · "Saved banner" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Saved banner

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. A save confirmation stays. A failure is a different piece.

## What it is

The screen after a bill is saved. The first frame is already the success, because that is the point of the piece. A wash in the success colour holds one word, Saved., at 56px in the ink colour, then a sentence in the on-soft success ink, then one primary button back to the month. It does not fade out. It is not a toast in the corner. A toast is how a failure gets missed, and this library already refuses a toast for a failed load. A success that matters gets the same respect: it stays until the person leaves. The page grain sits behind the banner. The banner itself is flat.

## Reference behaviour

1. The first frame shows the banner. The heading is Saved. The sentence is "The NEA bill is in Asar. It stays on this screen until you leave."
2. The banner is `role="status"`. It is visible without a click.
3. The button reads "Back to Asar". Clicking it sets the label to "Month opened" and disables it at opacity 0.55.
4. The banner does not unmount, slide away, or start a timer.
5. There is no second button. Undo, if the product has it, replaces this button. It does not sit beside it on this frame.
6. No motion. Reduced motion has nothing to remove.
7. Do not play a checkmark animation. The word is the confirmation.

## Structure

```
padding 48px 64px
┌ banner, max 720px, success wash ─────────┐
│ ASAR                                      │
│ Saved.                    56px            │
│ The NEA bill is in Asar. …                │
│ [ Back to Asar ]                          │
└───────────────────────────────────────────┘
```

- The banner is one region. The heading is the only `h1`, and it uses the page ink so the word stays the answer. The sentence uses the on-soft ink.
- The button is inside the banner, under the sentence.
- Nothing else is on the page. Do not show the form that was just saved. That form is the previous screen.

## Tokens

```css
:root {
  --bg: #f4ead6;
  --ink: #1c2744;
  --primary: #c8102e;
  --primary-ink: #fffdf8;
  --focus: #c8102e;
  --success-soft: #d6d8c2;
  --success-on-soft: #1b5e3d;
  --display: "Noto Serif Devanagari", Georgia, serif;
  --sans: "Mukta", system-ui, sans-serif;
}
```

Sentence text is `--success-on-soft` on `--success-soft`. The heading stays `--ink` on that same wash. Both pairs clear 4.5. Do not invent a green.

## Typography

| Role | Family | Size | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Label | Mukta | 12px | 600 | 0.06em | `--success-on-soft` |
| Answer | Noto Serif Devanagari | 56px | 600 | -0.02em | `--ink` |
| Sentence | Mukta | 16px | 400 | 0 | `--success-on-soft` |
| Button | Mukta | 16px | 600 | 0 | `--primary-ink` |

Saved. is a Latin word in a Devanagari display face. That is allowed: the face contains the Latin letters. Do not switch the heading to a third family to "fix" it.

## Motion

None. A banner that fades after 2 seconds is a toast. Reduced motion has nothing to remove.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Button | click | label becomes "Month opened", disabled, opacity 0.55 |

## States

- Banner resting: `--success-soft`, radius 6px, padding 28px 28px 24px, max-width 720px. The radius becomes the family's when a kit is locked.
- Button: height 40px, radius 6px, fill `--primary`, ink `--primary-ink`.
- Button disabled: opacity 0.55. The banner stays.
- Focus-visible: 2px outline, offset 2px.
- This piece has no error state. A failed save uses the failed-load pattern: `--danger-soft`, `--danger-on-soft` or `--danger` text, and a retry. Do not reuse this green banner for a failure.
- There is no empty state.

## Accessibility

- The banner is `role="status"` so the confirmation is announced. Do not also fire a live region somewhere else.
- The heading is the `h1`.
- The button name is "Back to Asar", then "Month opened".
- Hit target is the 40px button. On a phone, make it 44px.
- Contrast: `#1b5e3d` on `#d6d8c2` clears 4.5. `#1c2744` on `#d6d8c2` clears 4.5. `#fffdf8` on `#c8102e` clears 4.5.
- Do not rely on green alone. The word Saved. is the status.

## Responsive rules

- At 1280 the padding is 48px 64px and the heading is 56px. The banner is 720px, the pass column, left aligned.
- At 768, padding becomes 24px.
- Below 640, the heading drops to 40px and the button becomes full width of the banner, height 44px. The banner keeps its padding. It does not become a bottom toast.

## Acceptance checklist

### Always

- [ ] The confirmation is on the page when the screen opens. It does not wait for a click, and it does not dismiss itself.
- [ ] It is a banner, not a toast.
- [ ] One display-size word. One sentence. One button.
- [ ] The wash is the success wash. Text on it uses ink or the on-soft token.
- [ ] A failure does not use this banner.

### This demo

- [ ] The heading is Saved. at 56px.
- [ ] The sentence names the NEA bill and Asar.
- [ ] The banner background is `#d6d8c2`. The sentence is `#1b5e3d`.
- [ ] One button, "Back to Asar", height 40px, primary fill.
- [ ] Clicking the button sets "Month opened" and disables it at opacity 0.55.
- [ ] The banner remains after the click.
- [ ] No timer, no checkmark animation, no second button.
- [ ] The banner max-width is 720px, the same column as the list screens.

## Implementation notes

Always: after a save, show this and stop. Do not return the person to a form that still looks editable without saying it saved. The button names the screen it opens. In this demo that screen is the month, so the label is "Back to Asar", and the demo only renames the button.

```css
.banner { background: var(--success-soft); }
.banner p { color: var(--success-on-soft); }
h1 { color: var(--ink); }
```

Common mistakes:

- A toast at the bottom that disappears.
- A green check icon with no sentence.
- Two buttons, Save and Undo, on the confirmation itself.
- Painting the heading in the solid success colour so it fails on the wash.
- Using this banner for a failed load.
- A confetti burst.
- Putting the form and the banner on the same first frame. The form was the previous screen.
- A second display line such as "You're all set!".
- Auto-redirect after a timeout. The person leaves by the button.

Where it sits:

1. It is the screen after the person saves a bill, a budget, or a setting.
2. The next action is the button, and it names the screen: the month, the list, the account.
3. `load-failed-retry` is the failure twin. Do not merge them.
4. `budget-meter` is where they land if the button opens the budgets. Do not draw the meters inside the banner.
5. One banner. A stack of three success banners means three saves were collapsed onto one view. Show the latest.
6. When a theme is locked, take the success wash and the on-soft ink from the theme.
7. The grain stays on the page, not on the banner.
8. Phone: full width inside the page padding, button 44px.
9. Do not add a nav bar on this piece. The shell is a different piece.
10. The credit line stays on the token block.

Rebuild order:

1. Set the paper and the two faces.
2. Place one banner, success wash, max 720px.
3. Place the label, the 56px word, the sentence, the button.
4. Wire the button to "Month opened" and disabled.
5. Confirm the banner does not dismiss.
6. Map the greens and the crimson onto the locked theme if a kit is on.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
