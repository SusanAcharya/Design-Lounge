<!-- Design Lounge Nº 233 · "Phone empty list" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Phone empty list

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is the iOS large-title list language used by the yard phone, not Material, and not a glass tab bar.

## What it is

The empty state of a phone list. The frame is 390 by 844. The top 54px is left clear for the status bar the Lounge draws. The bottom 34px is left clear for the home indicator. "Runs" is a 13px label, so the reader knows where they are. The answer is the heading "No runs today" at 28px. One sentence explains that the yard is clear. One primary button, "New run", is 44px tall and sits with the sentence, not in a second toolbar. There is no illustration, no tab bar, and no header competing with the heading. This is the phone pair of `list-empty-plain`. Use it when the list has zero rows. A failed load is `mobile-load-failed`.

## Reference behaviour

1. The first frame is the empty state. Do not start on a list and then clear it.
2. "Runs" is visible as a label. "No runs today" is the only heading, and it is the largest type.
3. The sentence reads "The yard is clear. A new load shows up in this list."
4. Tapping "New run" changes the button to "Run opened" and disables it.
5. The tap does not insert a row. Opening a run is a different screen.
6. There is no animation.
7. Focus ring is 2px `--focus`, offset 2px.
8. Disabled opacity is 0.55.

## Structure

```
390 × 844
padding-top 54, padding-bottom 34, padding-inline 20
Runs                         13px label
(flexible space)
No runs today                28px
The yard is clear. …         15px, max-width 300
[ New run ]                  44px, radius 10
(flexible space)
```

- The body is a column. The empty block grows to fill the space between the label and the bottom inset, and its contents are vertically centered in that block, aligned to the start.
- The heading is an `h1`. The word "Runs" is a paragraph, not a navigation bar.
- The button is `align-self: flex-start`. It is not full width. Height is 44px, padding 0 18px.
- Do not draw a status bar, a notch, or a home indicator.

## Tokens

```css
:root {
  --bg: #f4f1ea;
  --surface: #fffdf8;
  --ink: #1b1814;
  --ink-2: #5e574e;
  --primary: #8a4b12;
  --primary-ink: #fffdf8;
  --focus: #8a4b12;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

These match `mobile-run-detail`. When a kit is locked, replace them with the theme. Keep the type sizes.

## Typography

| Role | Family | Size | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Where | sans | 13px | 600 | 0.04em | `--ink-2` |
| Answer | sans | 28px | 600 | -0.03em | `--ink` |
| Sentence | sans | 15px | 400 | 0 | `--ink-2` |
| Button | sans | 15px | 600 | 0 | `--primary-ink` |

Body line-height is 1.4. The heading margin is 0 0 8px. The sentence margin is 0 0 20px.

## Motion

None. Reduced motion has nothing to remove. Do not fade the heading in.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Button | click | label "Run opened", disabled, opacity 0.55 |

## States

- Button resting: fill `--primary`, radius 10px, height 44px.
- Button pressed: no extra colour. The label change is the feedback.
- Button disabled: opacity 0.55.
- Focus-visible: 2px outline, offset 2px.
- There is no row hover, because there are no rows.
- Do not show a spinner on this screen. Loading is a different state.
- Do not show the danger banner here. Failure is a different state.

## Accessibility

- The heading is the `h1`. "Runs" is not a heading.
- The button name is "New run", then "Run opened".
- Hit target is 44px tall. The label "Runs" is not a back button on this screen. The list is the root of this flow.
- Contrast: `#1b1814` on `#f4f1ea`, `#5e574e` on `#f4f1ea`, and `#fffdf8` on `#8a4b12` clear 4.5.
- The empty block is not a live region. The screen opened empty. Nothing appeared later.
- Do not use an image with a text alternative that repeats the heading.

## Responsive rules

- The frame is 390 wide. At 360, the padding stays 20px and the heading stays 28px. The sentence wraps inside 300px.
- At tablet width, do not scale this screen up into a centered card on a gray stage. Use `list-empty-plain` for the web list.
- Do not add a tab bar when the width grows. This piece has one column and one action.
- The 54px top inset and 34px bottom inset stay, including at 360.

## Acceptance checklist

- [ ] Padding-top is max(54px, env(safe-area-inset-top)). Padding-bottom is max(34px, env(safe-area-inset-bottom)). No status bar is drawn.
- [ ] "Runs" is 13px, weight 600, colour `#5e574e`.
- [ ] "No runs today" is the `h1` at 28px, weight 600.
- [ ] The sentence is "The yard is clear. A new load shows up in this list."
- [ ] The button is 44px tall, radius 10px, fill `#8a4b12`, label "New run".
- [ ] The button is left-aligned with the heading, not stretched to the screen width.
- [ ] Tapping the button sets "Run opened", disables it, and does not add a row.
- [ ] Disabled opacity is 0.55.
- [ ] There is no illustration, no tab bar, and no second button.
- [ ] Focus ring is 2px, offset 2px.
- [ ] The heading is larger than the word "Runs".

## Implementation notes

The web empty state uses a 20px screen title and a 28px heading. This phone piece goes further: the screen name drops to a label so the answer is unmistakable at 390px. Do not copy a marketing empty state with a drawing of a box.

```css
body { padding: max(54px, env(safe-area-inset-top)) 20px max(34px, env(safe-area-inset-bottom)); display: flex; flex-direction: column; }
.well { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 300px; }
.btn { height: 44px; padding: 0 18px; border-radius: 10px; align-self: flex-start; }
```

Language: iOS list, large answer, copper primary from the yard phone. Radius 10px matches `mobile-run-detail`. Do not switch this screen to a Material pill or a glass toolbar.

Common mistakes:

- An illustration of an empty box.
- The word "Runs" at 34px and the empty message at 15px, so the answer is the quieter line.
- A tab bar plus a header. That is two navigation systems.
- A full-width button pinned to the bottom while the message sits at the top, split apart.
- Inserting a fake row when New run is tapped.
- Using the web empty piece unchanged at 390px, with a 64px desktop header.
- A spinner and the empty heading on the same screen.
- The danger banner and the empty heading on the same screen.
- Emoji as the illustration.
- A second button, "Learn more".

Where it sits in a product:

1. It is the empty state of `mobile-inbox-list` when the filter or the day has zero runs.
2. The populated pair is the inbox list. The detail pair is `mobile-run-detail`.
3. The failed pair is `mobile-load-failed`. Do not merge them.
4. The primary action creates a run. It does not navigate to settings.
5. The button stays with the sentence so the reader sees why it is there.
6. No tab bar on this frame. If the product has a tab bar, it is the shell around this piece, and this piece does not draw a second one.
7. Copy stays specific. "No runs today" beats "No data".
8. The sentence says what will change: a new load shows up in this list.
9. Do not add a search field to an empty day. Search belongs on the populated list.
10. The label "Runs" is the where. It is not a back button.
11. Keep the 54px top clear. The Lounge draws the status bar.
12. When a theme is locked, the copper becomes `--primary`. The sizes stay.

Rebuild order:

1. Set the phone padding, 54 top and 34 bottom.
2. Place the 13px label "Runs".
3. Place a column that fills the remaining height and centers its contents vertically, aligned start.
4. Place the 28px heading and the sentence.
5. Place the 44px button under the sentence.
6. Wire the button to "Run opened" and disabled, without adding a row.
7. Check the heading is the largest type.
8. Check there is no illustration and no tab bar.
9. Check the hit target is 44px.
10. Map colours onto the locked theme if a kit is on.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
