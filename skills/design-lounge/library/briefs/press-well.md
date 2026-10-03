<!-- Design Lounge Nº 248 · "Press well" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Press well

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A green button in a shallow well. While it is pressed it moves down 4px, into the well. Click writes Gate 4 opened on this page. The label does not change. This is not a traveling gold edge. That edge is `edge-light-button`. This is not a morph to a check. That morph is `button-state-morph`. The drop is the press.

## Reference behaviour

1. The button reads Open the gate. The status is empty.
2. The well is #e7e1d6, radius 10px, padding 6px 6px 10px, with an inset shadow.
3. Active translates the button 4px down over 120ms.
4. Click sets the status to Gate 4 opened on this page.
5. The status is aria-live polite.
6. A second click leaves the same sentence.
7. Reduced motion removes the transition. The button still moves on active if the browser applies transform. The information is the sentence.

## Structure

```
[ well: Open the gate ]
status
```

- The well wraps the button.
- The button is 52px tall, min-width 180px, radius 6px, fill #1f4d3a, text #fffdf8.
- The status is 14px, #5a554c, min-height 22px, margin-top 16px, centered.
- Focus ring is 2px #1f4d3a, offset 4px.
- There is one button.

## Tokens

```css
:root { --bg:#f6f4ef; --well:#e7e1d6; --primary:#1f4d3a; --ink:#fffdf8; --muted:#5a554c; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Label | IBM Plex Sans | 15px | 600 |
| Status | IBM Plex Sans | 14px | 400 |

## Motion

- Button | press | translateY 0 | translateY 4px | 120ms cubic-bezier(0.2,0.7,0.2,1). Reduced motion snaps.

## States

- Rest: button up, status empty.
- Active: button 4px down.
- Clicked: status filled.
- Focus: ring offset 4px.

## Accessibility

- The button name is Open the gate.
- The status is polite.
- The well is not a control.
- Focus ring is 2px #1f4d3a, offset 4px.
- Reduced motion still writes the sentence.
- The label contrast on #1f4d3a stays above 4.5.

## Responsive rules

- The control stays centered.
- Below 360 the button is calc(100% - 32px) and the well matches.
- The drop stays 4px.

## Acceptance checklist

### Always

- [ ] The press drops 4px.
- [ ] The sentence is the result.
- [ ] The label stays Open the gate.
- [ ] One well.
- [ ] Reduced motion still reports the click.

### This demo

- [ ] The label is Open the gate.
- [ ] The sentence is Gate 4 opened on this page.
- [ ] The drop is 4px.
- [ ] The well fill is #e7e1d6.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Use :active for the drop. Do not wait for click to move it.

```css
button:active { transform: translateY(4px); }
```

The extra bottom padding on the well is the space the button drops into.

## Measurements to keep

- Button height 52px, min-width 180px, radius 6px.
- Well padding 6px 6px 10px, radius 10px.
- Drop 4px. Duration 120ms.
- Status 14px, margin-top 16px.
- Fill #1f4d3a. Well #e7e1d6.

## Wrong turns

- Do not morph the label.
- Do not add a gold ring.
- Do not drop the whole page.
- Do not use a glow.
- Do not change the sentence on a second click.
- Do not make the well a second button.

## Fit with the rest of the library

- An edge light is `edge-light-button`.
- A morph is `button-state-morph`.
- This is the well.
- One button.
- Type is IBM Plex Sans.
- The ground is #f6f4ef.

## Keyboard

- Enter and Space activate the button.
- The status is polite.
- The well is not a tab stop.
- Do not use a positive tabindex.
- Focus offset is 4px.
- The label does not change.
- Reduced motion still writes the sentence.
- One button.
- The drop is 4px.
- Type is IBM Plex Sans.
- Escape does nothing.
- The sentence stays.
- No fetch.
- Active is the press.
- Do not trap focus.
- The well padding leaves room under the button.

## Pass

- Measure the first frame before changing a number.
- Keep the names in this brief.
- Keep the duration written above.
- Honour reduced motion.
- Do not add a second accent.
- Do not add a second type family.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
