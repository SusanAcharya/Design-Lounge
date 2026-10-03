<!-- Design Lounge Nº 258 · "Inline alert" · designlounge.vercel.app -->

# Inline alert

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the wash and the ink are the theme's warning pair. A page shows one message.

## What it is

A warning in the page, not a toast. It says Gate 2 closes at 18:00 and tells the reader to move the Asar loads to Gate 4. The wash is `--warning-soft`. The sentence is `--warning-on-soft`. Dismiss hides the alert and leaves the line "Alert dismissed. The loads stay on the list." Under the alert, three short swatches show Cleared, Refused, and Booked. They are a key, marked `aria-hidden`. They are not three extra messages on the page. A product ships one alert.

## Reference behaviour

1. The warning is visible. Dismiss is a 40px outline button in the same ink as the sentence.
2. Clicking Dismiss hides the alert and shows the dismissed line.
3. The three swatches do not dismiss and are not buttons.
4. There is no timer. The alert does not vanish on its own.
5. Focus ring is 2px `--focus`, offset 3px, on Dismiss.
6. There is no animation.

## Structure

```
padding 48px 64px
Dispatch                     12px
alert, width 640, padding 16, radius 2
  Gate 2 closes at 18:00. Move the Asar loads to Gate 4.
  [ Dismiss ]                40px
three swatches, gap 8, aria-hidden
note: The row under the alert is the tone key.
```

- The alert is `role="status"`.
- The dismissed line is a second `role="status"`, hidden until dismiss.
- The key row is `aria-hidden="true"`.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --ink: #161513;
  --ink-2: #5a554c;
  --focus: #1f4d3a;
  --warning-soft: #f3e6d0;
  --warning-on-soft: #7d470e;
  --success-soft: #d6e8dc;
  --success-on-soft: #1b5e3d;
  --danger-soft: #f8e4e2;
  --danger-on-soft: #8a1f1f;
  --info-soft: #e4eef5;
  --info-on-soft: #1a4060;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Radius is 2px in this yard demo. The family replaces the alert radius and the button radius. The button on a warning stays outline in the on-soft ink. It is not a second primary.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Alert | sans | 14px | 400 | `--warning-on-soft` |
| Lead-in | sans | 14px | 500 | `--warning-on-soft` |
| Button | sans | 13px | 500 | currentColor |
| Key | sans | 13px | 500 | the matching on-soft |
| Note | sans | 12px | 400 | `--ink-2` |

The first sentence of the alert is a `strong` at weight 500. The measure of the sentence is about 46ch.

## Motion

None. Dismiss removes the alert in one frame. Reduced motion has nothing to remove. Do not slide it off.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Dismiss | click | alert hidden, the dismissed line shown |
| Focus | keyboard | ring on the button |

## States

- Warning alert: background `--warning-soft`, text `--warning-on-soft`, padding 16px, width 640px, radius 2px.
- Button: height 40px, padding 0 14px, 1px border in `currentColor`, transparent fill.
- Dismissed: the alert is `hidden`. The line "Alert dismissed. The loads stay on the list." shows in `--ink`.
- Success key: `--success-soft` / `--success-on-soft`.
- Danger key: `--danger-soft` / `--danger-on-soft`.
- Info key: `--info-soft` / `--info-on-soft`.
- A failed load is the danger alert with a retry button. That piece is `load-failed-retry`. Do not restyle this warning into a toast.

## Accessibility

- The alert is `role="status"` because it is a change in the page the person is on, not a polite toast in the corner.
- Dismiss has a visible name.
- The key is `aria-hidden` so a screen reader does not hear three extra states.
- Hit target: the button is 40px.
- Contrast: `#7d470e` on `#f3e6d0` clears 4.5. The other on-soft pairs do too.
- Do not use the solid warning colour as the text on the wash.

## Responsive rules

- At 1280 the alert is 640px, padding 48px 64px.
- Below 640 the alert is full width inside 20px padding. The button may wrap under the sentence. It stays 40px tall, 44px on a phone.
- The key wraps to one column below 640. In a product you omit the key. It exists here so the other tones are specified.

## Acceptance checklist

- [ ] The alert names Gate 2, 18:00, and Gate 4.
- [ ] The alert background is `#f3e6d0` and the text is `#7d470e`.
- [ ] The alert is 640px wide, padding 16px, radius 2px.
- [ ] Dismiss is 40px tall and outline.
- [ ] Dismiss hides the alert and shows "Alert dismissed. The loads stay on the list."
- [ ] The alert does not vanish on a timer.
- [ ] The three swatches are not buttons and are hidden from assistive tech.
- [ ] Focus ring is 2px, offset 3px.
- [ ] There is no toast and no second alert.
- [ ] There is no animation.

## Implementation notes

Hide with the `hidden` attribute.

```js
alert.hidden = true;
gone.hidden = false;
```

A product picks one tone:

- Success, a result that already happened and can stay: often `saved-banner` instead, when the whole point is the save.
- Warning, a limit or a closing time, this piece.
- Danger, a failed load, `load-failed-retry`.
- Info, a fact that is not a warning and not a failure.

Common mistakes:

- Four full alerts stacked on one page.
- A toast that covers the list and then disappears.
- White text on a pale wash.
- A solid primary Dismiss that competes with the page's real primary.
- Auto-dismiss after three seconds, so the person misses the closing time.
- Using the brand red as the warning text.
- Shipping the tone key in the product. The key is this demo.

Where it sits in a product:

1. Put it at the top of the view it concerns, inside the column, not fixed to the viewport.
2. One message. If two things are wrong, write one sentence that names the blocking one.
3. Dismiss hides it. The underlying list does not change. Say that, as this demo does.
4. A save confirmation that should stay is `saved-banner`.
5. A badge on a row is `status-badge`.
6. Text is the on-soft token.
7. Radius follows the family.
8. When a theme is locked, do not keep this tan. Use the theme's `--warning-soft`.
9. The where-line Dispatch is the screen name.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and the warning pair.
2. Place the alert and the Dismiss button.
3. Place the key and the note, with the key hidden from assistive tech.
4. Wire Dismiss.
5. Check the alert does not time out.
6. Map the wash onto the theme when a kit is on.

Copy you keep:

1. Dispatch.
2. Gate 2 closes at 18:00. Move the Asar loads to Gate 4.
3. Dismiss.
4. Alert dismissed. The loads stay on the list.
5. The note that the row under the alert is the tone key.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
