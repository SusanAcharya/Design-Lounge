<!-- Design Lounge Nº 375 · "Rating score" · designlounge.vercel.app -->

# Rating score

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, a filled mark is `--primary` and an empty mark is `--line-strong`. The marks are a radio group. They are not a like button.

## What it is

A score for the handoff, from 1 to 5. Four starts filled in `--primary`. The fifth is `--line-strong`. The status line reads "4 of 5." Choosing another value fills every mark up to that value and rewrites the line. The marks are native radios, so arrow keys move the score. Each hit target is 40px. The mark itself is a 20px shape. There is no half score and no average of other people. This is one person's score.

## Reference behaviour

1. The fourth radio is checked. Marks 1 through 4 are `#1f4d3a`. Mark 5 is `#cfc6b8`. The status line is "4 of 5."
2. Choosing 2 fills 1 and 2 and clears the rest. The line reads "2 of 5."
3. Choosing 5 fills all five. The line reads "5 of 5."
4. Arrow keys move between the radios and update the line, because they share a name.
5. There is no animation.
6. Focus ring is 2px `--focus`, offset 3px, on the focused mark.

## Structure

```
padding 48px 64px
Handoff                      12px
fieldset, border 0
  Score                      legend
  five marks, 40px each, gap 4
4 of 5.
```

- The legend is Score.
- Each control is a native radio with an accessible name "1 of 5" through "5 of 5".
- The shape is decorative and `aria-hidden`.
- The status line is `role="status"`.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --ink: #161513;
  --ink-2: #5a554c;
  --line-strong: #cfc6b8;
  --primary: #1f4d3a;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

The mark is a shape, so the family's button radius does not turn it into a square or a pill. The 40px target can take the family's radius if you draw a hit box. The shape stays.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Legend | sans | 12px | 500 | `--ink-2` |
| Status | sans | 14px | 400 | `--ink` |

The score is not only a colour. The status sentence names the number. The where-line letter-spacing is 0.04em.

## Motion

None. The fill changes in one frame. Reduced motion has nothing to remove. Do not bounce the mark.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Radio | change | filled marks up to that value, status line |
| Arrows | native | the checked radio |

## States

- Mark empty: 20px shape, colour `--line-strong`, inside a 40px target.
- Mark filled: colour `--primary`, for every value up to and including the checked one.
- One radio checked. The visual fill is a range. The checked state is a single value.
- Focus-visible: 2px outline, offset 3px, on the shape.
- Do not fill only the checked mark and leave the earlier ones empty. A score of 4 means four marks.
- Do not use a second colour for a "hover preview" that commits. Hover may preview. The status line changes only on the committed value.

## Accessibility

- The legend names the group.
- Each radio has a name that includes the number and the total.
- The shape is hidden from assistive tech.
- Arrow keys are native. Do not rebuild them.
- The status line repeats the value.
- Hit target is 40px, not the 20px shape alone.
- The green on the paper is a mark. The sentence is the text, and it clears 4.5.
- Do not rely on the filled shape alone.

## Responsive rules

- At 1280 the group sits in 48px 64px padding.
- Below 640 the five targets stay 40px and may wrap only if they cannot fit. On a phone they are at least 44px.
- Do not turn the score into a select of five numbers. The marks are the point.
- Do not put this on a chart.

## Acceptance checklist

- [ ] The legend is Score. The where-line is Handoff.
- [ ] Four marks start filled in `#1f4d3a`. The fifth is `#cfc6b8`.
- [ ] The status line starts "4 of 5."
- [ ] Choosing 1 fills one mark. Choosing 5 fills five.
- [ ] The status line matches the chosen value.
- [ ] Each target is 40px. Each shape is 20px.
- [ ] The controls are native radios that share a name.
- [ ] Arrow keys move the score.
- [ ] Focus ring is 2px, offset 3px.
- [ ] There is no half mark and no animation.

## Implementation notes

Fill every mark whose value is less than or equal to the checked value.

```js
label.style.color = Number(box.value) <= Number(input.value) ? 'var(--primary)' : 'var(--line-strong)';
```

The radio is positioned over the shape so the 40px label is the target. The shape is `aria-hidden`.

Common mistakes:

- Five buttons that do not use a radio group, so arrow keys do nothing.
- Filling only the clicked mark.
- A heart that toggles. That is `optimistic-like-button`.
- Half stars.
- An average "4.2" with no way to set a score. This piece is the control, not a summary.
- Emoji as the mark.
- A colour with no sentence.

Where it sits in a product:

1. Use it when one person scores one thing, from 1 to 5.
2. A like is the other piece. A set of named choices is `radio-group`.
3. The filled colour is `--primary`. The empty colour is `--line-strong`.
4. The sentence is required. The marks are not enough.
5. When a theme is locked, the filled colour is that theme's `--primary`.
6. One group. Do not ask for five scores in a row unless the product has five questions, and then each has its own legend.
7. Do not put the score on the order receipt. The receipt is `order-confirmed`.
8. The where-line Handoff is the screen name.
9. 4 is the start so both filled and empty marks are visible.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the legend and five radios. Check the fourth.
3. Paint marks 1 through 4.
4. Write "4 of 5."
5. On change, repaint and rewrite the line.
6. Leave the arrow keys to the browser.
7. Map the filled colour onto `--primary`.

Copy you keep:

1. Handoff.
2. Score.
3. 1 of 5 through 5 of 5.
4. 4 of 5. as the start, then the chosen value of 5.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
