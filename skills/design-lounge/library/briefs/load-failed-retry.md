<!-- Design Lounge Nº 237 · "Failed load with retry" · designlounge.vercel.app -->

# Failed load with retry

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map the banner onto `--danger` and `--danger-soft`. Keep the sentence.

## What it is

A runs page whose first paint is a failure. The header says Runs. Under it, a banner in danger-soft says "Could not load runs. The yard desk did not answer." Retry sits on the right of that banner. The list is not on screen. Retry hides the banner and shows three rows: Bay 14, Bay 3, Bay 9. "Show the failure" brings the banner back and hides the rows, so the state can be checked again. This is not a toast. The failure owns the page until the retry works. Do not use a red toast for a load that never arrived.

## Reference behaviour

1. First frame: banner visible, list hidden, "Show the failure" hidden.
2. The banner is `role="alert"`.
3. Retry sets the banner `hidden`, shows the list, and shows "Show the failure".
4. "Show the failure" reverses that. The list hides. The banner returns.
5. No spinner. No delay. The demo does not pretend to wait.
6. Row meta is mono. Bay names are the text face, weight 600.
7. Focus ring 2px `--focus`, offset 2px.
8. Do not add a second error colour for the rows. The rows are ordinary.

## Structure

```
header 64px
main, padding 24px 32px, max-width 880
banner: sentence | Retry
list of three rows, hidden
Show the failure, hidden
```

- Banner is a flex row, space-between, gap 16px.
- Each row is min-height 56px.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #8a847a;
  --line: #e4dfd4;
  --primary: #1f4d3a;
  --danger: #9b2c2c;
  --danger-soft: #f8e8e6;
  --focus: #1f4d3a;
  --font-text: "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --radius: 2px;
}
```

## Typography

- Header title: IBM Plex Sans 500, 20px.
- Banner sentence: 14px, weight 500, colour `#9b2c2c`.
- Retry: 14px, weight 500, height 36px, transparent fill, 1px currentColor border, radius 2px.
- Bay name: 14px, weight 600.
- Meta: IBM Plex Mono 12px, `--ink-2`.
- "Show the failure": 14px, weight 500, colour `--ink-2`, border `--line`.

## Motion

None. The swap is instant. Reduced motion changes nothing.

## States

- Failed: banner visible, list hidden.
- Loaded: banner hidden, three rows visible, return button visible.
- No partial error. Either the banner or the rows.

## Accessibility

- The banner has `role="alert"` so the failure is announced.
- Retry and "Show the failure" are buttons with visible names.
- Hiding uses the `hidden` attribute on the banner, and a class on the list. Do not leave the list readable while `display: none` is the intent. `display: none` removes it.
- `#9b2c2c` on `#f8e8e6` is the banner pair. If a kit's danger pair fails 4.5, use that kit's danger ink on its danger soft, not a new red.
- Row height 56px.

## Responsive rules

- At 1280 the main column is max 880px with 32px page padding.
- At 768 the banner may wrap. The button stays on the end of the row until 640.
- Below 640 the banner stacks: sentence, then a full-width Retry.

## Acceptance checklist

- [ ] First frame is the banner, not the rows.
- [ ] Sentence is "Could not load runs. The yard desk did not answer."
- [ ] Banner fill is `#f8e8e6` and text is `#9b2c2c`.
- [ ] Retry reveals Bay 14, Bay 3, and Bay 9.
- [ ] Meta lines are "2,400 kg · 06:40", "860 kg · 07:10", "1,120 kg · 07:40".
- [ ] "Show the failure" returns to the banner.
- [ ] No spinner and no toast.
- [ ] Radius is 2px on the banner and the list.
- [ ] Header is 64px and reads Runs.

## Implementation notes

The list starts without the show class. Do not render the rows at opacity 0. They are absent.

Rebuild order:

1. Page `#f6f4ef`. Header 64px, white, bottom rule.
2. Main padding 24px 32px, max-width 880px.
3. Banner padding 12px 14px, radius 2, fill `#f8e8e6`, colour `#9b2c2c`.
4. Banner is flex, align centre, space-between, gap 16px.
5. Retry height 36, transparent, 1px border of the current colour.
6. List fill white, border `#e4dfd4`, radius 2, margin-top 12px.
7. Row min-height 56, padding 0 16px, top rule except the first.
8. Three bays in the order above.
9. Return button margin-top 12px, hidden until the list shows.
10. Do not disable Retry after one success. Showing the failure resets the banner.

Copy you keep:

1. "Could not load runs. The yard desk did not answer."
2. Button "Retry".
3. Button "Show the failure".
4. Bay 14, 2,400 kg, 06:40.
5. Bay 3, 860 kg, 07:10.
6. Bay 9, 1,120 kg, 07:40.
7. Danger `#9b2c2c` on `#f8e8e6`.
8. No third state such as "still trying".
9. The header does not change between states.
10. The rows are not red.

Common mistakes:

- A full-page 404 illustration. The app chrome stays.
- A toast in the corner while the table area is blank.
- A spinner that never resolves.
- Three different reds.
- Hiding the sentence and leaving only an icon.
- Showing skeleton rows and the banner together.
- Using the empty-state copy on a failure. Empty means zero rows. This means the load failed.
- A serif headline on the banner.

Where it sits in a product:

1. Use it when the request failed, timed out, or returned an error.
2. Do not use it for zero rows. Zero rows is the plain empty.
3. The header stays. The banner replaces the list, not the whole app.
4. Retry calls the same request. It does not navigate away.
5. After success, the banner is gone. Do not leave a green "loaded" strip.
6. "Show the failure" is for the demo. A product omits it and just retries.
7. Do not stack this banner on a toast with the same sentence.
8. The three rows are the success fixture. A product renders its real rows.
9. Keep the sentence specific. "Something went wrong" is too vague to ship.
10. The banner is in the page flow. It is not fixed to the viewport.
11. Retry is not the page primary filled green. It stays an outline on the danger colour.
12. Row dividers are `#e4dfd4`, not red.
13. The list radius matches the banner radius: 2px.
14. Do not add a timestamp to the banner.
15. Do not log the error to the page.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
