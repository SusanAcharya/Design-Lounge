<!-- Design Lounge Nº 139 · "Search results with filters" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Search results with filters

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens and take buttons from the component grammar. Keep this layout.

## What it is

The results page for Index, a clothing catalogue. A 64px header holds the wordmark and a search field already filled with "wool". A 240px filter column lists cloth and price. The main column lists matching pieces: a 72×56 swatch, a serif name, one line of description, a cloth tag, and a price. Filters and the query apply together. When nothing matches, the list hides and a short empty state shows. It should feel like a shop desk, not a dashboard.

## Reference behaviour

1. Initial state: query "wool", all three cloth boxes checked, price "Any". Four rows visible. Count reads "4".
2. Typing in the search field filters immediately on the row's visible text. Matching is case-insensitive substring. The count updates.
3. Unchecking a cloth hides rows of that cloth. At least the boxes that remain checked stay. If every cloth is unchecked, the count is 0.
4. Choosing "Under $180" hides rows whose price is 180 or more. "Any" removes that constraint.
5. All three constraints combine with AND.
6. Count 0 shows the empty state: "Nothing in that cut." and the line "Clear a cloth filter, or search a shorter word." The list is hidden.
7. Pressing "/" focuses the search field and selects its text, unless the field is already focused.
8. Focus rings are 2px `--focus` with 2px offset on the field and the checkboxes.

## Structure

```
1280 × 800
header 64: wordmark | search field flex 1, height 40
grid: 240px aside | main
aside: two groups, uppercase 11px labels
row: 72×56 swatch | text | price
```

- Header is a `header`. Search is a `form` with `role="search"` and an input `type="search"` labelled "Search the catalogue".
- Aside is `aside` labelled "Filters".
- Each result is an `article`.
- Empty state is a sibling of the list, hidden until the count is 0.

## Tokens

```css
:root {
  --bg: #f3efe6;
  --surface: #fffdf8;
  --surface-2: #e7e1d4;
  --ink: #171512;
  --ink-2: #5c564c;
  --ink-3: #8a8378;
  --line: #ddd6c8;
  --line-strong: #c9c0b0;
  --primary: #8a4b12;
  --primary-ink: #fffdf8;
  --primary-soft: #f0e2d2;
  --focus: #8a4b12;
  --font-display: "Fraunces", Georgia, serif;
  --font-text: "Instrument Sans", system-ui, sans-serif;
  --header: 64px;
  --aside: 240px;
  --field: 40px;
  --radius: 6px;
}
```

## Typography

- Wordmark: Fraunces 500, 22px, tracking -0.02em.
- Result name: Fraunces 500, 18px, line-height 1.15.
- Body and descriptions: Instrument Sans 400, 13–14px, colour `--ink-2`.
- Filter labels: Instrument Sans 600, 11px, uppercase, tracking 0.12em, `--ink-3`.
- Price: Instrument Sans 600, 14px, `--ink`.

## Motion

No animation. Filtering updates the DOM immediately. Reduced motion changes nothing because nothing moves.

## States

- Search field: filled, focused (browser outline replaced by the 2px ring).
- Checkbox and radio: checked and unchecked. Accent colour `--primary`.
- Result row: visible or `display: none` when filtered out.
- Empty state: hidden, or shown when count is 0.
- No hover colour on rows. Separation is the 1px top rule.

## Accessibility

- Search input has an accessible name.
- Aside is labelled "Filters".
- "/" is a shortcut only when the search field is not already focused, and it calls preventDefault.
- Count is text, not only a colour.
- Contrast of `--ink` on `--bg` is above 4.5. `--ink-3` is for uppercase labels, not for sentences.
- Hit targets on checkboxes are the full label row, min-height 32px.

## Responsive rules

- At 1280 the aside is 240px and rows are three columns.
- At 1024 the aside stays 240px and page padding stays 28px.
- At 768 the aside moves above the list, full width, and the result grid becomes swatch plus text with the price under the name.
- Below 640 the header stacks: wordmark, then the search field full width, height still 40px.

## Acceptance checklist

- [ ] Header is 64px and the search field is 40px tall.
- [ ] Aside is 240px with cloth and price groups.
- [ ] Initial query is "wool" and four results show.
- [ ] Text, cloth, and price filters combine with AND.
- [ ] Count matches the visible rows.
- [ ] Zero matches shows the empty heading and hides the list.
- [ ] "/" focuses and selects the search field.
- [ ] Names are Fraunces. UI text is Instrument Sans.
- [ ] No second button style, no emoji, no shadow on the rows.

## Implementation notes

Filter from `data-cloth` and `data-price` on each article. Do not rebuild the list from a hidden copy. Toggle a class that sets `display: none`.

The cloth checkbox nodes also carry `data-cloth`. When collecting checked cloths, only read `input` elements, or the articles will be treated as unchecked filters.

Do not add a sort menu. This piece is search plus two filter groups.

Rebuild in this order, and do not skip a measurement:

1. Page background `#f3efe6`. Header surface `#fffdf8`, 64px, bottom rule `#ddd6c8`.
2. Wordmark Fraunces 500 22px, tracking -0.02em, colour `#171512`.
3. Search field height 40, radius 6, border `#c9c0b0`, horizontal padding 12, icon 18px stroke 1.75.
4. The query value is the string wool, not a placeholder.
5. Aside width 240, padding 20px 18px, right rule 1px `#ddd6c8`.
6. Group labels 11px, weight 600, tracking 0.12em, uppercase, colour `#8a8378`, margin-top 18 except the first.
7. Each option row min-height 32, gap 8, 13px text. The control is 16px.
8. Main padding 22px 28px. Count line 13px. The numeral is weight 600 and colour `#171512`.
9. Article grid 72px, fluid, auto. Column gap 16. Padding 14px 0. Top rule only.
10. Swatch 72 by 56, radius 6. Use the four swatch fills in the demo: `#c4b39a`, `#e4d7c4`, `#8d7358`, `#f2efe6`.
11. Name Fraunces 500 18px. Description 13px `#5c564c`. Tag 11px uppercase tracking 0.06em.
12. Prices are $240, $96, $64, $48, weight 600, 14px.
13. Empty heading Fraunces 500 28px. Body 14px `#5c564c`. Hidden until the count is 0.
14. Accent on checked controls is `#8a4b12`.
15. Do not add a photo, a rating, or a second price style.

Common mistakes to avoid:

- Filtering cloth from every `[data-cloth]` node, including the articles.
- Replacing the four articles with a loading skeleton.
- Adding a heart icon or a compare toggle.
- Making the swatch a photograph.
- Using a 12-column grid inside the result row.
- Putting the price in Fraunces. Price is Instrument Sans.
- Hiding the count when it is zero. The count stays, and the empty state appears under it.
- Animating row height. Rows appear and disappear with display.
- A sticky filter bar on desktop. The aside is a column, not a drawer, at 1280.
- Inventing a fifth product. The catalogue in this piece is the four named pieces.
- Setting the search placeholder to "Search" while also leaving the value empty. The value is wool.
- Drawing a footer. This screen ends at the list.
- Changing the four prices. They are the acceptance numbers.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
