<!-- Design Lounge Nº 182 · "Changelog timeline" · designlounge.vercel.app -->

# Changelog timeline

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A changes page for Field ledger, a yard product. Four releases sit in one column. Each row is a date, a version pill, a kind, a title, and two facts. All, Added, and Fixed are three filters over that same list. This is not a magazine index. A magazine index is `blog-issue-index`. This is not an audit log of one account. An audit log is `audit-activity-log`.

## Reference behaviour

1. The first frame shows all four releases, newest first: 3 Oct 2026, 19 Sep 2026, 2 Sep 2026, 14 Aug 2026.
2. All is pressed. Added and Fixed are not.
3. Added hides the two Fixed rows. Fixed hides the two Added rows. All shows four.
4. The hidden rows are `hidden`, not a second list.
5. Pressing the same filter again does nothing new. One filter is pressed at a time.
6. There is no search box and no year jump.

## Structure

```
1280 × 800
padding 36px 64px 40px
Field ledger          [All] [Added] [Fixed]
Changes
rule
148px date column | rest
  3 Oct 2026   2.4     ADDED
                       Gate notes on the load
                       · two facts
```

- The page is a column. The header is a flex row, baseline at the end.
- The filters are a `role="group"` named Kind.
- The list is an `ol`. Each release is an `li`.
- The date column is 148px. The gap to the text is 28px.

## Tokens

```css
:root {
  --bg: #f4f1ea;
  --surface: #fffdf8;
  --ink: #1a1814;
  --ink-2: #5c564c;
  --ink-3: #6f675c;
  --line: #e3ddd2;
  --line-strong: #cfc6b8;
  --primary: #1f4d3a;
  --primary-soft: #e7f2ec;
  --display: "Fraunces", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;
  --pad-x: 64px;
  --pad-y: 36px;
  --t: 180ms;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Kicker | Public Sans | 11px | 500 | 1 | 0.14em, upper |
| Title | Fraunces | 44px | 560 | 1 | -0.02em |
| Date | Public Sans | 13px | 500 | 1.3 | 0 |
| Version | Public Sans | 11px | 600 | 22px | 0.04em |
| Kind | Public Sans | 11px | 600 | 1 | 0.12em, upper |
| Entry title | Fraunces | 22px | 560 | 1.2 | 0 |
| Fact | Public Sans | 15px | 400 | 1.45 | 0 |
| Filter | Public Sans | 13px | 500 | 36px | 0 |

## Motion

Filters change colour in 180ms with `--ease`. Reduced motion removes the transition. Rows do not animate in. Do not fade the list.

## States

- A filter with `aria-pressed="true"` uses `--ink` fill and `--bg` text. The border matches the fill.
- A filter that is off uses a transparent fill, `--line-strong` border, `--ink-2` text.
- Focus is a 2px `--primary` ring, 3px offset.
- A hidden row is not in the tab order.

## Accessibility

- The group label is Kind.
- Each filter is a `button` with `aria-pressed`.
- Dates are text, not buttons.
- Kind is text, not a second control.
- Body text on `--bg` is `--ink` or `--ink-2`. The kicker uses `--ink-2`, not a lighter grey.
- The pressed filter text is `--bg` on `--ink`. That pair clears 4.5.
- The version pill text is `--primary` on `--primary-soft`. If that pair is under 4.5, darken `--primary` before you lighten the pill.

## Responsive rules

- At 1280 the date column stays 148px.
- At 768 the date column stacks above the title. The row becomes one column with 8px between date and title.
- Below 640 the filters wrap. The title drops to 36px. Horizontal padding becomes 20px.
- Do not turn the list into cards.

## Acceptance checklist

### Always

- [ ] Four releases, newest first, one list.
- [ ] Three filters: All, Added, Fixed. One pressed.
- [ ] Added shows only Added. Fixed shows only Fixed. All shows four.
- [ ] Date column is 148px beside the text from 768px up.
- [ ] Version is a 22px pill on `--primary-soft` with `--primary` text.
- [ ] Each release has a kind, a title, and two facts.
- [ ] Focus ring is 2px `--primary`, offset 3px.
- [ ] Reduced motion removes the colour transition.

### This demo

- [ ] The product name is Field ledger. The page title is Changes.
- [ ] Versions are 2.4, 2.3, 2.2, 2.1.
- [ ] 3 Oct 2026 is Added, titled Gate notes on the load.
- [ ] 19 Sep 2026 is Fixed, titled Rupee totals keep their face.
- [ ] 2 Sep 2026 is Added, titled A second yard in Biratnagar.
- [ ] 14 Aug 2026 is Fixed, titled Held loads stay held overnight.
- [ ] The rupee fact uses रु and the grouping 18,42,000.

## Implementation notes

Set `hidden` on the `li`, not `display` from a class that fights the grid. The row is `display: grid`. A hidden attribute already sets `display: none`. If you also write `.item { display: grid }` it overrides the attribute. Use `.item[hidden] { display: none }`.

```css
.item { display: grid; grid-template-columns: 148px 1fr; gap: 28px; }
.item[hidden] { display: none; }
```

Do not build a second array of cards in JavaScript. Filter the nodes that are already in the list.

This is not `blog-issue-index`. That piece is a magazine of issues. This piece is a dated list of product changes with a kind filter.

The kind word is the filter's noun. Do not add a coloured dot that repeats Added or Fixed. The pill is the version, not the kind.

Row padding is 22px top and bottom. The rule under a row is 1px `--line`. The rule above the list is 1px `--ink`, darker than the row rules, so the list has a start.

The page does not scroll the document. The list region scrolls if a fifth release appears. In this demo four rows fit, so the list does not scroll.

Do not invent a fifth release. Do not rename Field ledger. Do not turn Added into a green badge and Fixed into a red badge. Kind stays 11px uppercase in `--primary`.

Measurements to keep:

- Page padding is 36px top, 64px sides, 40px bottom.
- The title is 44px Fraunces, weight 560, tracking -0.02em.
- Filter height is 36px. Filter gap is 8px. Radius is 999px.
- Row padding is 22px. Column gap is 28px. Date column is 148px.
- Version pill height is 22px, padding 0 8px, margin-top 8px.
- Fact marker is a 5px disc, `--line-strong`, 14px from the left of the fact.
- The list's top rule is `--ink`. Row rules are `--line`.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
