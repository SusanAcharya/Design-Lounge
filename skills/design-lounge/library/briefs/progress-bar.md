<!-- Design Lounge Nº 341 · "Progress bar" · designlounge.vercel.app -->

# Progress bar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the fill is `--primary` and the track is `--line-strong`. A budget is `budget-meter`. An ink wash that fills for its own sake is `ink-fill-progress`. This bar is a known count.

## What it is

A determinate bar for a job with an end. Packing the rice starts at 5 of 8. The track is 8px tall and 420px wide. The fill is `--primary` at five eighths. The count sits beside the title. Pack one more advances the count and the fill. At 8 the button disables and the status line reads "All 8 bags are packed." The title stays. The bar does not become a spinner, and it does not loop.

## Reference behaviour

1. The first frame is 5 of 8. The fill width is 62.5 percent. `aria-valuenow` is 5. `aria-valuemax` is 8.
2. Each click adds one. The count, the width, and the valuetext stay in step.
3. At 8 the button is disabled and the status line appears. Further clicks do nothing.
4. The button is the one solid primary.
5. There is no animation. The width changes in one frame.
6. Focus ring is 2px `--focus`, offset 3px, on the button.

## Structure

```
padding 48px 64px
Dock                         12px
width 420
  Packing the rice     5 of 8
  [========----]             track 8px
  [ Pack one more ]          40px primary
  status                     empty until 8
```

- The fill is `role="progressbar"` with min, max, now, and valuetext.
- The count is also visible text. The bar is not the only place the number lives.
- The status line is `role="status"`, empty until the end.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --ink: #161513;
  --ink-2: #5a554c;
  --line-strong: #cfc6b8;
  --primary: #1f4d3a;
  --primary-ink: #fffdf8;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

The track radius is 2px. A square family stays square. Do not turn the bar into a pill unless the family's radius is already a pill. The fill uses the same radius by clipping inside the track.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Title | sans | 28px | 500 | `--ink` |
| Count | sans | 14px | 400 | `--ink-2` |
| Button | sans | 13px | 500 | `--primary-ink` |
| Status | sans | 14px | 400 | `--ink` |

The count uses tabular numbers. The title is the largest type. The where-line letter-spacing is 0.04em.

## Motion

None on a timer. Reduced motion has nothing to remove. Do not animate the width over 400ms. A person packing a bag wants the new count in the same frame as the click.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Pack one more | click | count, fill width, valuetext |
| Eight | the last click | button disabled, status sentence |

## States

- Track: height 8px, width 420px, background `--line-strong`, radius 2px, overflow hidden.
- Fill: height 100%, background `--primary`, width n/8.
- Button: height 40px, padding 0 14px, radius 2px, fill `--primary`, text `--primary-ink`.
- Button disabled: opacity 0.4.
- Status empty until the end.
- Focus-visible: 2px outline, offset 3px.
- Do not stripe the bar. Do not add a second colour for the remaining portion beyond the track.

## Accessibility

- The progressbar exposes min, max, now, and a valuetext that says "5 of 8 bags".
- The visible count says the same numbers.
- The button name is Pack one more.
- Disabled leaves the tab order at the end.
- The status line announces the finished sentence.
- Hit target: the button is 40px. The bar is not the hit target.
- The fill is a mark, not text. The numbers are the text, and they clear 4.5 on the paper.

## Responsive rules

- At 1280 the block is 420px, padding 48px 64px.
- Below 640 the block is full width inside 20px padding. The track stays 8px. The title may wrap. The count stays on the same row if it fits.
- Do not replace a known count with an indeterminate spinner. Unknown waits are the loaders. This job has an end.

## Acceptance checklist

- [ ] The title is Packing the rice. The count starts at 5 of 8.
- [ ] The fill is 62.5 percent of a 420px track, 8px tall, `#1f4d3a` on `#cfc6b8`.
- [ ] `aria-valuenow` is 5 and `aria-valuemax` is 8.
- [ ] Each click adds one bag to the count and the width.
- [ ] At 8 the button is disabled and the status reads "All 8 bags are packed."
- [ ] The button is the only solid primary, 40px tall.
- [ ] The count uses tabular numbers.
- [ ] Focus ring is 2px, offset 3px.
- [ ] The width does not animate.
- [ ] There is no spinner and no budget row.

## Implementation notes

One number. Derive the width and the sentence.

```js
fill.style.width = (n / max * 100) + '%';
count.textContent = n + ' of ' + max;
```

Common mistakes:

- A budget meter for a packing job. Money against a limit is `budget-meter`.
- An ink animation with no count. That is `ink-fill-progress`.
- A spinner once the count is known.
- The number only inside the bar, too small to read.
- Two colours that are not the track and the primary.
- Looping back to 0 at the end.
- A second button.

Where it sits in a product:

1. Use it when the end is a number the person can reach: bags, files, steps.
2. Unknown waiting is a loader. A failed load is `load-failed-retry`.
3. The fill is `--primary`. The track is `--line-strong`.
4. The button is the one primary until the job is done, then it disables.
5. Radius follows the family.
6. When a theme is locked, do not keep this green if the theme's primary is another colour.
7. 8 bags is this demo. A product uses its own total and names the unit in the valuetext.
8. The title stays the largest type. Do not add a 56px number beside a 28px title.
9. The where-line Dock is the screen name.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the title, the count, and the track at 5 of 8.
3. Place the button.
4. Wire the click until 8.
5. Write the status only at the end.
6. Map the fill onto `--primary`.

Copy you keep:

1. Dock.
2. Packing the rice.
3. 5 of 8, then one at a time until 8.
4. Pack one more.
5. All 8 bags are packed.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
