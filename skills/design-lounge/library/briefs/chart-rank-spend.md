<!-- Design Lounge Nº 381 · "Ranked spend" · www.designlounge.live -->

# Ranked spend

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep one series.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A ranked list of where money went in Asar. The answer is the selected amount, set in Noto Serif Devanagari so the रु and the digits are one face. Under it, five rows: a name, a horizontal bar, and the same amount again at row size. Rent starts selected at रु 1,24,000, the longest bar. The other bars are the same crimson, shorter. There is no pie, no donut, no legend, and no second colour for a second series. The page background carries a faint paper grain. The rows are flat surface. This is the "where it went" view a personal finance app was missing. It is not a staff analytics chart.

## Structure

```
padding 48px 64px
ASAR                         12px label
रु 1,24,000                  56px display
Rent, the largest share
[ Rent        ████████  रु 1,24,000 ]
[ Bhatbhateni ██        रु 18,400   ]
[ NEA         █         रु 4,200    ]
[ Bus                   रु 2,100    ]
[ Tea                   रु 900      ]
```

- The label is a paragraph. The amount is the only `h1`.
- The list is an `ol` of buttons. Each button is a grid: 160px name, 1fr track, 120px amount.
- The track is 8px tall. The bar is an `i` inside it.
- Max width of the list is 720px. The rest of the 1280 frame stays empty.
- Grain sits on the page background only. Rows use `--surface` and cover the grain.

## Motion

| Thing | Trigger | From | To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Bar width | load | 0 | the row's percent | 420ms | cubic-bezier(0.2, 0.7, 0.2, 1) | no transition, final width |

No count-up on the heading. The amount is already the answer.

## States

- Row resting: `--surface`, radius 6px, min-height 44px, padding 8px 12px.
- Row pressed: `--primary-soft`. The bar stays `--primary`. Do not recolour the bar per category.
- Row hover: keep the surface. Selection is the only colour change.
- Focus-visible: 2px outline, offset 2px.
- There is no empty state in this piece. Zero categories uses the empty list piece.
- There is no failed state here. A failed load uses the failed-load piece.

## Accessibility

- The amount is the `h1`. The label "Asar" is not a heading.
- Each row is a button. Its accessible name is the name plus the amount, in that order, from the text content.
- `aria-pressed` marks the selected row. Only one is true.
- Hit target is the full row, at least 44px.
- Contrast: `#1c2744` on `#f4ead6` and on `#fbf6ea`, and `#1c2744` on `#f3d2c8`, all clear 4.5. The bar is not text.
- Do not encode the rank by a rainbow. Length is the encoding. The amount is also written.

## Responsive rules

- At 1280 the padding is 48px 64px, the heading is 56px, and the list is 720px.
- At 1024, keep 56px.
- At 768, padding becomes 24px. The name column may drop to 120px.
- Below 640, the heading drops to 40px. The row becomes name and amount on one line, the track on the next, full width. Still one series. Do not switch to a pie to save space.

## Acceptance checklist

### Always

- [ ] One series. Every bar is the same colour.
- [ ] No pie, no donut, no legend, no second series.
- [ ] The selected amount is the only display-size type.
- [ ] Rows are ranked longest first and stay in that order.
- [ ] The whole row is the control, at least 44px tall.
- [ ] An amount that contains रु uses one face for the word and the digits.
- [ ] Nepal digit grouping: 1,24,000, not 124,000.
- [ ] Grain, if used, is on the page background only.

### This demo

- [ ] The first frame shows रु 1,24,000 at 56px in Noto Serif Devanagari.
- [ ] The subtitle reads "Rent, the largest share".
- [ ] Five rows: Rent, Bhatbhateni, NEA, Bus, Tea.
- [ ] Rent is pressed and its bar is 100% of the track.
- [ ] Clicking Tea sets the heading to रु 900 and the subtitle to Tea.
- [ ] The list max-width is 720px, the pass column. Another screen in the same pass does not get a different width.
- [ ] Focus ring is 2px, offset 2px.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame reads रु 1,24,000 at 56px. The subtitle is "Rent, the largest share". Rent's row is `aria-pressed="true"`.
2. Clicking a row selects it, rewrites the heading to that row's amount in lakh grouping, and rewrites the subtitle to the row's name. Rent is the only row whose subtitle keeps "the largest share".
3. Only one row is pressed. The others return to the flat surface.
4. Bar widths are the amount divided by 1,24,000: Rent 100%, Bhatbhateni 14.8%, NEA 3.4%, Bus 1.7%, Tea 0.7%.
5. Bars grow from the left on load, 420ms, `cubic-bezier(0.2, 0.7, 0.2, 1)`. Reduced motion removes the transition. Widths are final on first paint.
6. The whole row is the button. Do not add a tooltip. The heading is the value.
7. Focus ring is 2px `--focus`, offset 2px.
8. Do not sort the list again on click. Rank stays longest at the top.

## Tokens

```css
:root {
  --bg: #f4ead6;
  --surface: #fbf6ea;
  --ink: #1c2744;
  --ink-2: #3e4a66;
  --line: #d9cbb3;
  --primary: #c8102e;
  --primary-soft: #f3d2c8;
  --focus: #c8102e;
  --display: "Noto Serif Devanagari", Georgia, serif;
  --sans: "Mukta", system-ui, sans-serif;
}
```

The grain is `radial-gradient(rgba(28,39,68,.05) 0.6px, transparent 0.6px)` at `background-size: 3px 3px` on the page only.

## Typography

| Role | Family | Size | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Label | Mukta | 12px | 600 | 0.06em | `--ink-2` |
| Answer | Noto Serif Devanagari | 56px | 600 | -0.02em | `--ink` |
| Subtitle | Mukta | 16px | 400 | 0 | `--ink-2` |
| Row name | Mukta | 16px | 600 | 0 | `--ink` |
| Row amount | Noto Serif Devanagari | 16px | 600 | 0 | `--ink` |

The answer and every amount that contains रु use the display face, `font-variant-numeric: tabular-nums`. Do not set the digits in a mono face. A mono that lacks रु will swap the currency word to a fallback and the line will look broken.

## Implementation notes

Always, when you adapt this brief: keep the rank, the single series, the one display amount, and the row as the control. Replace the names and the numbers with this product's categories. A checklist line that quotes "Bhatbhateni" is this demo. A line that says "no pie" always applies.

Lakh grouping, for a Nepal or India amount:

```js
function lakh(n) {
  const s = String(n);
  if (s.length <= 3) return s;
  const head = s.slice(0, -3);
  const tail = s.slice(-3);
  return head.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + tail;
}
```

1,24,000 is one lakh and twenty-four thousand. 18,400 needs no lakh break. 18,42,000 is eighteen lakh. Do not use the Western 1,240,000.

Common mistakes:

- A donut, because finance apps "usually" have one. This piece is the sanctioned replacement.
- A different colour per category. Rank is length, not a palette.
- Setting रु in Mukta and the digits in IBM Plex Mono. The glyphs will not match.
- Writing 124,000. That is the wrong grouping.
- Four equal KPI tiles above the list.
- A legend that repeats the row names.
- Grain on every row.
- A second display number for the total beside the selected amount. The total, if they asked for it, is a sentence under the subtitle, at 16px.
- Sorting alphabetically.
- A tooltip on the bar.

Where it sits:

1. It is the screen after the person asks where the money went.
2. The next action is not on this piece. The rows select. A later screen can be the category detail.
3. Pair it with `budget-meter` when some lines are over a limit. Do not paint the over-line inside this chart.
4. Pair it with `kpi-delta` only if one of them keeps the display size. Two 56px numbers on one view is a fail.
5. On a phone, the same rank stacks. Do not switch to a pie.
6. The paper grain is the identity layer, once, on the page. It is not a pattern library.
7. When a theme is locked, the crimson becomes `--primary` and the paper becomes `--bg`. Do not keep `#c8102e` on Harbour Ledger.
8. Devanagari pairing: display is Noto Serif Devanagari, text is Mukta. Mono stays off this amount.
9. Do not add a "View all" button. Five rows are the view.
10. The credit line stays on the token block when these colours are copied.

Rebuild order:

1. Set the paper, the grain on the page only, Mukta, and Noto Serif Devanagari.
2. Place the 12px label.
3. Place the 56px amount. Include रु in the same face.
4. Place the subtitle.
5. Place five rows, longest first, each a button.
6. Set bar widths from the amounts.
7. Wire click to the heading, the subtitle, and `aria-pressed`.
8. Check one series, one display size, and lakh grouping.
9. Map the colours onto the locked theme if a kit is on.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
