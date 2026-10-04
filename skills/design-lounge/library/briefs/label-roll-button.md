<!-- Design Lounge Nº 505 · "Rolling label row" · designlounge.vercel.app -->

# Rolling label row

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The front door of Holt Press, a fictional letterpress shop in London. Three actions are the whole page: see the cases, ask for a quote, visit the floor. Each row is one button. The label is two lines in a window one line tall. Hover, focus, or a locked click rolls the window up 176px so the second line shows, and the row inverts from paper to ink. The second line is italic. The arrow turns 45 degrees. The detail worth copying is that the second line is a fact about the first, not a different action.

## Structure

```
1280 × 800
┌ header 56: HOLT PRESS                          LONDON, LETTERPRESS ┐
│ 01   See the cases                                              →   │
│ 02   Two weeks, one proof          (inverted, this line visible)  ↗ │
│ 03   Visit the floor                                            →   │
└ footer 56: EST. 1974                         ONE COLOUR, ONE PRESS ┘
```

- `header` and `footer` are 56px, flex, space-between, padding `0 36px`. Header has a bottom ink rule. Footer has a top ink rule and muted colour.
- `.rows` is a column, `flex: 1`. Each `.row` is `flex: 1`, a grid of `72px 1fr 48px`, padding `0 36px`, ink bottom rule except the last row.
- Index is Karla 13/500, `#6d675c` on paper and `#b7b0a4` when the row is ink.
- `.win` is 176px tall, overflow hidden, centred in the row by the grid's `align-items: center`.
- `.stack` is `display: block`. Two `.line` spans, each 176px tall, flex centred, Bodoni Moda 64/500, tracking −0.03em, nowrap. The second line has class `alt` and is italic.
- The arrow is a 22px SVG, stroke 1.5, no fill. It sits in the third grid column, `justify-self: end`.

The three pairs, first line then second:

1. "See the cases" / "Twelve jobs, 2019-2026"
2. "Ask for a quote" / "Two weeks, one proof"
3. "Visit the floor" / "14 Mercer Street, weekdays"

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
| --- | --- | --- | --- | ---: | --- | --- |
| `.stack` | hover, focus-visible, or `.on` | translateY | 0 → −176px | 420ms | `--ease` | window clips it |
| Arrow | same | rotate | 0 → 45deg | 420ms | `--ease` | |
| Row ground | same | background, color | paper/ink → ink/paper | 420ms | `--ease` | colour can share the transition |

Reduced motion: `transition: none` on `.stack` and `.arrow`. The inverted state is still the full inverted state.

## States

- **Rest:** paper ground, ink type, first line visible, arrow pointing right, `aria-pressed="false"`.
- **Locked (`.on`):** ink ground, paper type, second line visible, arrow at 45deg, `aria-pressed="true"`. Only one row is locked.
- **Hover and focus-visible:** the same look as locked, without changing `aria-pressed`, and without unlocking a different row.
- **Focus-visible outline:** `2px solid var(--paper)`, offset −4px, inside the row. Focus also inverts the row, so an ink outline would vanish. Paper stays visible on the black ground.
- **Index:** `#6d675c` at rest, `#b7b0a4` when the row is ink.

## Accessibility

- Each row is one `<button type="button">`. The accessible name is both lines, in order, because both are in the button. That is acceptable: the second line is the description of the first.
- `aria-pressed` is true only for the locked row, not for a row that is merely hovered.
- Focus-visible rolls the row, so a keyboard user sees the same second line as a pointer user.
- Contrast: `#16140f` on `#f3eee4` is above 14:1. `#f3eee4` on `#16140f` is the same pair inverted. `#6d675c` on paper is about 5.5:1. `#b7b0a4` on ink is about 8:1.
- The row is the hit target, full width and at least 176px tall.
- Do not use the second line as a tooltip. It is text in the page.

## Responsive rules

- ≥ 1280: 64px labels, 176px window, as drawn.
- 1024–1279: labels 52px. Window can stay 176px.
- 768–1023: labels 40px, window 120px, and `--row` must change with the window or the roll distance is wrong. Horizontal padding 24px.
- < 768: labels 32px, window 88px, padding 16px. The second line must still fit on one line, or you allow it to wrap inside its 88px and you do not clip the descenders. Indexes stay.

## Acceptance checklist

**Always**

- [ ] Each row is one button with two lines in a window exactly one line tall.
- [ ] Hover, focus-visible, and the locked class all roll the stack by exactly one line and invert the row.
- [ ] The roll takes 420ms with `cubic-bezier(.2,.7,.2,1)`. Reduced motion is instant and complete.
- [ ] The second line is italic. The arrow rotates 45 degrees when the row is rolled.
- [ ] Click locks one row and clears the others. Clicking the locked row clears it.
- [ ] `aria-pressed` follows the lock, not the hover.
- [ ] The stack is `display: block`. An inline stack will ignore the translate.

**This demo**

- [ ] The shop is Holt Press. The three first lines are "See the cases", "Ask for a quote", and "Visit the floor".
- [ ] Row 02 starts locked on "Two weeks, one proof".
- [ ] Header reads "Holt Press" and "London, letterpress". Footer reads "Est. 1974" and "One colour, one press".
- [ ] Ground is `#f3eee4` and `#16140f`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: header 56px, "Holt Press" at the left and "London, letterpress" at the right, both Karla 13/500 uppercase, tracking +0.12em. Footer 56px, "Est. 1974" and "One colour, one press". Three rows share the space between.
2. Row 02 starts locked: class `on`, `aria-pressed="true"`, black ground, italic line "Two weeks, one proof", arrow at 45 degrees. Rows 01 and 03 show their first lines on paper: "See the cases" and "Visit the floor".
3. Hover or focus-visible on any row rolls that row for as long as the pointer or focus stays, even if another row is locked. The locked row stays rolled when you leave it.
4. Click a row that is not locked: remove `on` and `aria-pressed` from every row, then set them on the clicked row. Click the locked row: clear it. If the pointer is still over that row, hover keeps it rolled until the pointer leaves.
5. The window is 176px tall and `overflow: hidden`. The stack is two lines of 176px. Rolled means `translateY(-176px)`.
6. The roll and the arrow take 420ms, easing `cubic-bezier(.2,.7,.2,1)`. The ground colour changes with them.
7. Reduced motion: no transition. The roll still happens, instantly.
8. Each row is one button. Do not put a link inside the button.

## Tokens

```css
:root {
  --paper: #f3eee4;
  --ink: #16140f;
  --muted: #6d675c;       /* indexes on paper, footer */
  --line: #16140f;
  --index-on-ink: #b7b0a4;
  --serif: "Bodoni Moda", Georgia, serif;
  --font: "Karla", system-ui, sans-serif;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t: 420ms;
  --row: 176px;           /* one line, and the window height */
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Header, footer | Karla | 13px | 500 | 1 | +0.12em | uppercase |
| Index | Karla | 13px | 500 | 1 | +0.08em | numerals |
| Label, both lines | Bodoni Moda | 64px | 500 | 1 | −0.03em | sentence |
| Second line | Bodoni Moda | 64px | 500 italic | 1 | −0.03em | sentence |

Load Bodoni Moda italic. A roman face styled italic is not the same cut.

## Implementation notes

The window and the line must share one length, or the second line peeks or leaves a gap.

```css
.win { height: var(--row); overflow: hidden; }
.stack { display: block; transition: transform var(--t) var(--ease); }
.line { height: var(--row); display: flex; align-items: center; }
.row.on .stack,
.row:hover .stack,
.row:focus-visible .stack { transform: translateY(calc(var(--row) * -1)); }
```

The lock is exclusive, and a click on the locked row clears it:

```js
row.addEventListener('click', function () {
  var on = row.classList.contains('on');
  rows.forEach(function (r) {
    r.classList.remove('on');
    r.setAttribute('aria-pressed', 'false');
  });
  if (!on) {
    row.classList.add('on');
    row.setAttribute('aria-pressed', 'true');
  }
});
```

Load the italic cut. `font-style: italic` on a roman file is a fake slant and the second line will not match the first line's colour of type.

Common mistakes: translating by a percentage of the stack (that moves two lines, so the window goes blank); putting the invert only on hover and forgetting keyboard focus; using the second line as a separate button.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
