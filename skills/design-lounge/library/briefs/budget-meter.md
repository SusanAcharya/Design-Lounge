<!-- Design Lounge Nº 181 · "Budget meters" · www.designlounge.live -->

# Budget meters

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Warning is for the row that is over, not for the list.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A short list of budgets for a personal month. The answer is how far the one broken line is over: रु 700 over, at 56px. Under it, three meters. Groceries and tea are inside their line, drawn in the primary. NEA is over, so that row alone sits on the warning wash, and its meter and its "over" words use the ink that passes on that wash. If every row were amber, the warning colour would mean nothing. This piece exists so a budget list can tell the truth. It is not a dashboard of four equal tiles.

## Structure

```
padding 48px 64px
BUDGETS
रु 700 over                 56px
NEA is past 3,500. …
[ Groceries    18,400 of 20,000 ]
[ ████████████░░ ]
[ NEA          4,200 of 3,500 · over ]   warning wash
[ ████████████ ]
[ Tea          900 of 2,000 ]
[ █████░░░░░░░ ]
```

- The label is a paragraph. The over amount is the only `h1`.
- The list is a `ul`. Each item is a name, a meta line, and an 8px track.
- The list max-width is 720px, the same column as the other screens in the pass.
- Grain is on the page background only. Quiet rows use `--surface`. The over row uses the warning wash and covers the grain.

## Motion

None. A meter that animates on load delays the fact that NEA is over. Reduced motion has nothing to remove.

| Thing | Trigger | What changes |
| --- | --- | --- |
| None | — | The first frame is the answer |

## States

- Quiet row: `--surface`, radius 6px, padding 12px 14px.
- Over row: `--warning-soft` background. Meta and meter use `--warning-on-soft`.
- No hover colour. These rows are not buttons in this piece.
- No selected state.
- A budget at exactly the limit stays quiet. Warning starts when spent is greater than the limit.
- If every budget is inside, this piece is the wrong answer. Use a single metric for the remaining total instead of a warning heading with nothing to warn about.

## Accessibility

- The over amount is the `h1`.
- The over row does not rely on colour alone. The meta ends with the word "over".
- Contrast: `#7d470e` on `#e8d6bb` clears 4.5. `#1c2744` on `#fbf6ea` clears 4.5. `#1c2744` on `#f4ead6` clears 4.5.
- The meters are decorative. The amounts are in the text. Mark the tracks `aria-hidden="true"` if you add that attribute. The visible meta is the value.
- Do not make the row a control unless the product opens a detail. This frame does not.

## Responsive rules

- At 1280 the padding is 48px 64px and the heading is 56px.
- At 768, padding becomes 24px.
- Below 640, the heading drops to 40px. Name and meta stack if the row is tighter than 360px. The meter stays full width. Do not turn the meters into a donut.

## Acceptance checklist

### Always

- [ ] One display-size number: how far over, or the remaining total if nothing is over.
- [ ] Warning colour appears only on rows that are past the limit.
- [ ] Text on the warning wash uses the on-soft token, not the solid warning fill.
- [ ] Each row is a name, a spent-of-limit line, and one meter.
- [ ] Meters are one thickness. They are not a chart library.
- [ ] An amount with रु uses one face for the word and the digits.

### This demo

- [ ] The heading is रु 700 over at 56px.
- [ ] The sentence names NEA, groceries, and tea.
- [ ] Groceries is 18,400 of 20,000 at 92%, primary fill, surface row.
- [ ] NEA is 4,200 of 3,500, the words include over, the row is `#e8d6bb`, the meta is `#7d470e`.
- [ ] Tea is 900 of 2,000 at 45%, primary fill.
- [ ] No row other than NEA uses the warning wash.
- [ ] The list is 720px wide, the pass column. Do not keep 640 because an older note said so.
- [ ] There is no button on this frame.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame reads रु 700 over at 56px. The sentence is "NEA is past 3,500. Groceries and tea are still inside their line."
2. Groceries shows रु 18,400 of 20,000 and a meter at 92% in `--primary`.
3. NEA shows रु 4,200 of 3,500 · over. The row background is `--warning-soft`. The meta text is `--warning-on-soft`. The meter is full and uses `--warning-on-soft`, not the solid warning fill.
4. Tea shows रु 900 of 2,000 and a meter at 45% in `--primary`.
5. Nothing is clickable in this frame. Selecting a budget is another screen.
6. There is no animation. Reduced motion has nothing to remove.
7. Do not colour groceries amber because it is "close". Close is still inside. Only over uses warning.

## Tokens

```css
:root {
  --bg: #f4ead6;
  --surface: #fbf6ea;
  --ink: #1c2744;
  --ink-2: #3e4a66;
  --line: #d9cbb3;
  --primary: #c8102e;
  --warning-soft: #e8d6bb;
  --warning-on-soft: #7d470e;
  --display: "Noto Serif Devanagari", Georgia, serif;
  --sans: "Mukta", system-ui, sans-serif;
}
```

Text on a wash uses `--warning-on-soft`. Do not put the solid `--warning` on `--warning-soft`, and do not invent a third hex. When a theme is locked, both tokens come from that theme. The solid fill is for a button or a solid badge. This row is a wash.

## Typography

| Role | Family | Size | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Label | Mukta | 12px | 600 | 0.06em | `--ink-2` |
| Answer | Noto Serif Devanagari | 56px | 600 | -0.02em | `--ink` |
| Sentence | Mukta | 16px | 400 | 0 | `--ink-2` |
| Name | Mukta | 16px | 600 | 0 | `--ink` |
| Meta, quiet | Mukta | 14px | 400 | 0 | `--ink-2` |
| Meta, over | Mukta | 14px | 600 | 0 | `--warning-on-soft` |

The heading that contains रु uses the display face for the whole string. The row amounts can stay in Mukta, still one face for रु and the digits. Do not introduce a mono for the digits.

## Implementation notes

Always: warning is a state, not a theme for the list. If you adapt the names, keep a mix of inside and over, or do not use a warning heading. A list titled "Budgets to watch" that paints every row amber has failed this piece.

The over amount is spent minus limit: 4,200 − 3,500 = 700. Write it as रु 700 over. Do not also print 700 in a second tile.

```css
li.over { background: var(--warning-soft); }
li.over .meta { color: var(--warning-on-soft); font-weight: 600; }
li.over .fill { background: var(--warning-on-soft); }
```

Common mistakes:

- Amber on every row, including the ones inside the line.
- A solid warning fill as the text colour on the wash. It fails contrast, which is why the on-soft token exists.
- Four equal meters with four equal numbers.
- A pie of the same three budgets beside the list.
- Colouring the 56px heading red. The heading stays `--ink`. The row carries the warning.
- A mono face for 4,200 next to a fallback रु.
- Western grouping on a Nepali amount that crosses a lakh. 4,200 and 18,400 are already correct. 1,20,000 would not be 120,000.
- Animating the meters in a loop.
- Adding a button called "Manage" with no screen behind it.

Where it sits:

1. It follows the month overview when the decision is "which line broke".
2. `chart-rank-spend` answers "where it went". This piece answers "what is over". Do not merge them into one rainbow chart.
3. Only one of those two holds the display size on a given view.
4. A saved confirmation is `saved-banner`, after the person edits a limit. It does not replace this list.
5. On a phone, stack the rows under the heading. Keep the same warning rule.
6. When a theme is locked, take `--warning-soft` and `--warning-on-soft` from the theme. Do not keep `#7d470e`.
7. The grain stays on the page, once.
8. If NEA were inside the line, the heading would not say over. Do not leave the warning wash on a quiet row.
9. Groceries at 92% is still quiet. Do not invent a "near" colour.
10. The credit line stays on the token block.

Rebuild order:

1. Set paper, grain, Mukta, and Noto Serif Devanagari.
2. Place the label and the 56px heading.
3. Place the one sentence.
4. Place three rows. Mark only NEA as over.
5. Set meter widths to 92%, 100%, and 45%.
6. Check that groceries and tea do not use the warning wash.
7. Check the over meta uses the on-soft ink.
8. Map tokens onto the locked theme if a kit is on.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
