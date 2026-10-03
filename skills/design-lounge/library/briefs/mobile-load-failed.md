<!-- Design Lounge Nº 218 · "Phone failed load" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Phone failed load

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is the iOS list language of the yard phone, not Material, and not a toast.

## What it is

The failed state of a phone list. The frame is 390 by 844. The top 54px and the bottom 34px stay clear. "Runs" is a 13px label. The answer is a banner: "Could not load runs. The yard desk did not answer." The sentence is 20px, larger than the label. Retry is a 44px outline button, full width of the banner, in the danger colour. It is not the copper primary. Tapping Retry hides the banner and shows three runs. "Show the failure" returns to the banner so the demo can be replayed. A product omits "Show the failure". Empty means zero rows and uses `mobile-list-empty`. This piece means the load did not arrive.

## Reference behaviour

1. The first frame is the failure. The banner is visible. The list is hidden. "Show the failure" is hidden.
2. The banner is `role="alert"`.
3. Tapping Retry sets the banner to `hidden`, shows the three rows, and shows "Show the failure".
4. The rows are Bay 14, 2,400 kg · 06:40; Bay 3, 860 kg · 07:10; Bay 9, 1,120 kg · 07:40.
5. Tapping "Show the failure" restores the banner and hides the list and that button.
6. Retry does not use the primary fill. It is an outline on the danger colour.
7. There is no toast, no spinner, and no empty heading on this screen.
8. Focus ring is 2px `--focus`, offset 2px.
9. "Show the failure" is a demo control. Do not ship it in the product.

## Structure

```
390 × 844
padding-top 54, padding-bottom 34
Runs                                      13px, margin 8px 20px 16px
banner, margin 0 20px, radius 10, pad 16
  Could not load runs. …                  20px
  [ Retry ]                               44px, full width of the banner
list, hidden, margin 16px 20px 0, radius 10
  three rows, min-height 56
[ Show the failure ]                      hidden until retry
```

- The banner stacks. The sentence is above the button. A row banner from the web piece does not fit at 390px.
- The list is a surface with a 1px border. Rows separate with the same border. The first row has no top border.
- Bay name is weight 600. The weight and time are mono, 13px, `--ink-2`.
- Do not draw a status bar.

## Tokens

```css
:root {
  --bg: #f4f1ea;
  --surface: #fffdf8;
  --ink: #1b1814;
  --ink-2: #5e574e;
  --line: #e3dbcf;
  --danger: #9b2c2c;
  --danger-soft: #f8e8e6;
  --focus: #8a4b12;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
}
```

The focus colour is the yard copper, matching `mobile-run-detail`. The banner does not use copper. Failure stays on the danger pair.

## Typography

| Role | Family | Size | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Where | sans | 13px | 600 | 0.04em | `--ink-2` |
| Failure | sans | 20px | 600 | -0.02em | `--danger` |
| Retry | sans | 15px | 600 | 0 | `--danger` |
| Bay | sans | 15px | 600 | 0 | `--ink` |
| Meta | mono | 13px | 400 | 0 | `--ink-2` |
| Demo return | sans | 15px | 600 | 0 | `--ink-2` |

The failure line-height is 1.3. Body line-height is 1.4.

## Motion

None. The banner hides and the list shows in the same frame. Do not slide the list in. Reduced motion has nothing to remove.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Retry | click | banner hidden, list shown, "Show the failure" shown |
| Show the failure | click | banner shown, list hidden, return button hidden |

## States

- Banner: background `--danger-soft`, text `--danger`, radius 10px, padding 16px.
- Retry: height 44px, width 100%, radius 10px, 1px solid currentColor, transparent background.
- List hidden: `display: none` until `.show`.
- Row: min-height 56px, padding 0 14px, space-between.
- Return button: height 44px, radius 10px, border `--line`, text `--ink-2`, margin 16px 20px 0. Hidden until retry.
- Do not turn Retry into the copper primary after a failure. The danger colour is the state.
- Do not show the empty heading behind the banner.

## Accessibility

- The banner is `role="alert"` so the failure is announced on load.
- Retry's name is "Retry". It is inside the alert.
- After retry, the banner is `hidden`, not merely `display` none via a class that leaves it exposed. Use the `hidden` attribute so it leaves the accessibility tree.
- The three rows are text, not buttons, in this piece. Opening a bay is `mobile-run-detail`.
- Hit targets: Retry and "Show the failure" are 44px tall.
- Contrast: `#9b2c2c` on `#f8e8e6` clears 4.5. `#1b1814` on `#fffdf8` clears 4.5.
- "Show the failure" is omitted in a product, so the only control after a successful retry is whatever the list itself provides.

## Responsive rules

- The frame is 390. At 360, the 20px side margin stays and the banner text stays 20px.
- Do not switch the banner to a horizontal row at 390. The sentence needs the width.
- At tablet width, use `load-failed-retry` instead of scaling this phone banner across 1180px.
- The 54px top inset stays at every phone width.

## Acceptance checklist

- [ ] Padding-top is max(54px, env(safe-area-inset-top)). Padding-bottom is max(34px, env(safe-area-inset-bottom)). No status bar is drawn.
- [ ] The first frame shows the banner and Retry, and does not show the three rows.
- [ ] "Runs" is 13px. The failure sentence is 20px and weight 600.
- [ ] The banner background is `#f8e8e6` and the text is `#9b2c2c`.
- [ ] Retry is 44px tall, full width of the banner, outline, not a filled primary.
- [ ] The banner is `role="alert"`.
- [ ] After Retry, the banner is `hidden` and the three bays are visible with the weights and times above.
- [ ] "Show the failure" returns to the first frame.
- [ ] There is no toast, no spinner, and no "No runs today" heading.
- [ ] Row min-height is 56px.
- [ ] Focus ring is 2px, offset 2px.

## Implementation notes

Hide with the `hidden` attribute, not only a class, or the alert text stays available to assistive tech after Retry. The list can use a class, because it is not an alert.

```js
retry.addEventListener('click', () => {
  banner.hidden = true;
  list.classList.add('show');
  again.classList.add('show');
});
```

```css
.banner button { width: 100%; height: 44px; border: 1px solid currentColor; background: transparent; }
.list { display: none; }
.list.show { display: block; }
```

The sentence is one paragraph inside the alert, margin 0 0 12px. Do not split "Could not load runs" and the reason into a title plus a toast.

Common mistakes:

- Treating this as the empty state and writing "No runs today".
- A toast at the bottom that disappears.
- A spinner that never resolves.
- Retry in the copper primary, so failure looks like the main action of a happy screen.
- A horizontal banner that truncates the sentence at 390px.
- Leaving the alert in the accessibility tree after Retry.
- Shipping "Show the failure" in the product.
- Drawing a status bar in the top 54px.
- Adding a tab bar inside this piece.
- Using a red 72px number instead of the sentence.

Where it sits in a product:

1. It is the first frame when the list request fails. It is not a follow-up toast after a skeleton.
2. The empty pair is `mobile-list-empty`. Zero rows is not this banner.
3. The populated pair is `mobile-inbox-list`. After a real retry, navigate to that list. This demo shows three rows in place so the recovery is visible.
4. The detail pair is `mobile-run-detail`.
5. Retry is the only action on the failure frame. Do not add "Contact support" as a second primary.
6. The reason is one sentence: the yard desk did not answer. Do not dump a status code as the heading.
7. The banner is in the content, under the label, not fixed to the top of the phone.
8. Side margin is 20px, the same as the rest of the yard phone.
9. Radius is 10px, the same as the run detail card.
10. The meta on each row is mono so the weights and times align with the detail screen.
11. A product removes "Show the failure" after the first successful load.
12. When a theme is locked, `--danger` and `--danger-soft` come from the theme. Do not recolour failure with `--primary`.

Rebuild order:

1. Set the phone padding, 54 top and 34 bottom.
2. Place the 13px label.
3. Place the banner with the 20px sentence and the full-width Retry.
4. Place the three rows, hidden.
5. Place "Show the failure", hidden.
6. Wire Retry to hide the banner and show the list.
7. Wire the return button to restore the banner.
8. Confirm the first frame has no rows.
9. Confirm Retry is outline danger, not the primary fill.
10. Confirm the alert is hidden, not only visually covered, after Retry.

Copy you keep, so the demo and the product say the same thing:

1. Could not load runs. The yard desk did not answer.
2. Retry.
3. Bay 14, 2,400 kg, 06:40.
4. Bay 3, 860 kg, 07:10.
5. Bay 9, 1,120 kg, 07:40.
6. Show the failure. Demo only.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
