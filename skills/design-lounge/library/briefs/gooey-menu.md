<!-- Design Lounge Nº 253 · "Gooey menu" · designlounge.vercel.app -->

# Gooey menu

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

## What it is

A round menu for three yard actions: Hold, Note, and Call. It starts open, so the blobs are already apart and the SVG goo joins them to the main circle. Clicking Menu pulls the three back and hides their buttons. Clicking an action writes "Hold · Gate 4" or the same shape for Note and Call. Reduced motion removes the filter and the travel. This is not a material FAB menu. That menu is `m3-fab-menu`. This is not a split button. That control is `split-button`.

## Reference behaviour

1. The first frame is open. aria-expanded is true. Hold, Note, and Call are visible.
2. The three blobs sit at translate(-88px,-20px), translate(0,-96px), and translate(88px,-20px).
3. Menu toggles data-open. Closed hides the three action buttons.
4. An action sets the line above to the action plus "· Gate 4".
5. The goo filter is on the blob layer only. The labels sit above it.
6. Reduced motion sets filter none and transition none.
7. The menu does not navigate.

## Structure

```
280×280 stage
status line
      (Note)
(Hold) (Call)
      (Menu)
```

- Stage 280×280.
- Blobs are 64px circles, fill #1f4d3a, left 108px, top 168px.
- The filter is feGaussianBlur stdDeviation 8 and a colour matrix with alpha 20 and -8.
- Hit buttons are 64px and transparent, sitting on the blobs.
- Closed actions use the hidden attribute.

## Tokens

```css
:root {
  --bg:#f6f4ef; --ink:#161513; --primary:#1f4d3a; --primary-ink:#fffdf8;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Action | IBM Plex Sans | 12px | 500 | 1 | 0 |
| Status | IBM Plex Sans | 14px | 400 | 1.4 | 0 |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Satellites | toggle | stacked on the menu | offset poses | 380ms cubic-bezier(0.16,1,0.3,1) | no travel, filter off |

## States

- Open: three actions available, blobs apart.
- Closed: actions hidden, blobs stacked.
- Action chosen: status line names it.
- Focus ring sits on the round buttons.

## Accessibility

- Menu exposes aria-expanded.
- Action buttons have text names: Hold, Note, Call.
- Closed actions are hidden, so they leave the tab order.
- The blob layer is aria-hidden.
- The status line is aria-live polite.
- Reduced motion still shows the open pose without the filter.

## Responsive rules

- The stage is 280px and stays centered.
- Below 320 keep the stage and do not clip the open blobs. The offsets are 96px.
- Do not turn the actions into a dropdown list. The blobs are the menu.

## Acceptance checklist

### Always

- [ ] Starts open.
- [ ] Three actions and one menu toggle.
- [ ] Goo is a filter on the shapes, not on the text.
- [ ] Closed actions are not tabbable.
- [ ] An action names itself in a live line.

### This demo

- [ ] Actions are Hold, Note, Call.
- [ ] The status form is "Hold · Gate 4".
- [ ] Fill is #1f4d3a.
- [ ] The ground is #f6f4ef.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Keep labels outside the filtered layer or the goo eats the words.

```html
<filter id="goo"><feGaussianBlur stdDeviation="8"/>
<feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"/>
</filter>
```

Sync the hidden attribute with data-open so keyboard users cannot reach a closed action.

## Measurements to keep

- Stage 280px. Blob 64px. Main blob left 108px top 168px.
- Offsets ±88px and -96px. Travel 380ms.
- Blur stdDeviation 8. Matrix alpha row 20 -8.
- Status min-height 20px at the top of the stage.
- Focus offset 3px.

## Wrong turns

- Do not put the filter on the buttons that hold the words.
- Do not start closed.
- Do not add a rainbow trail.
- Do not leave closed buttons in the tab order.
- Do not use the goo on every button in a product. This is one menu.
- Do not loop a wobble.

## Fit with the rest of the library

- A FAB stack is `m3-fab-menu`.
- A split send button is `split-button`.
- Magnetic pull on a button is `magnetic-buttons`.
- An ink cursor is `cursor-ink-blob`.
- This menu is the only goo on the view.
- Do not combine it with a neon edge.

## Keyboard

- Enter on Menu toggles.
- Enter on Hold, Note, or Call writes the status.
- Closed actions are hidden.
- aria-expanded matches the pose.
- Tab order is Menu, then the three actions when open.
- Escape does not close.
- Do not use a positive tabindex.
- The blobs are aria-hidden.
- The status is polite.
- Reduced motion removes the filter.
- The first frame is open.
- Labels are 12px.
- The fill stays #1f4d3a.
- Do not add a fourth action in this demo.
- Type is IBM Plex Sans.
- The ground is #f6f4ef.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
