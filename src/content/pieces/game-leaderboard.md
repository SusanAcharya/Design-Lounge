---
title: "Quern score ladder"
summary: "Today, This week, and All reorder twelve Quern scores. Your row stays marked, and a few rows show places gained or lost."
platform: web
type: screen
category: data
tags: [leaderboard, ranks, tabs, scores]
styles: [swiss, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-04
palette: ["#E7EEF2", "#F7FBFC", "#14202B", "#C4512C"]
fonts: ["Newsreader", "Public Sans"]
related: [game-lobby, game-card-table]
---

# Quern score ladder

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The ladder for Quern, a fictional parlour game scored in whole points at the mill house. Three periods share one sheet: Today, This week, and All. Each period is a list of the same twelve players with different scores, so the order changes when the tab changes. Rank is the row index after a numeric sort, not a number typed into the markup. Leah Moss is the player. Her row is clay-tinted. If a scroll would take that row out of the list viewport, a copy of it pins to the bottom of the sheet. A few rows carry a shift: places up or places down since the previous cut of that same period. The shift is not a second score and it is not a percentage.

The sheet is cool paper on a slightly deeper ground. Newsreader for the title, Public Sans for the rows, one clay accent for "you". Hairlines separate rows. No glow, no purple, no decimal scores.

## Reference behaviour

1. First frame is the Today tab, `aria-selected="true"`, panel labelled by that tab. The list is already filled. Do not wait for a fetch. Scroll position is 0.
2. Column labels, visual only: Place, Player, Shift, Score. They do not scroll with the rows.
3. Today order, after sorting score descending, is the table in "This demo" below. Place 1 is Tomas Reed with 1,840. Leah Moss is place 2 with 1,712, marked You. She is inside the viewport, so the pin is hidden.
4. Click or activate This week. The list rebuilds from that period's scores, sorted again. Place 1 becomes Anika Shah with 9,420. Leah Moss is place 6 with 7,644, still inside the viewport, pin hidden. The tab underline moves to This week. `aria-selected` and `tabindex` follow the tabs pattern below.
5. Click All. Place 1 is Helen Cho with 48,210. Leah Moss is place 9 with 26,118. She sits below the fold of the scrolling list, so the pin is visible and shows place 9, Leah Moss, You, down 1, 26,118. The in-list row is still in the DOM, marked the same way.
6. Scrolling the list so Leah's in-list row is fully inside the scroller hides the pin. Scrolling until that row is clipped shows the pin again. Switching tabs resets `scrollTop` to 0 and runs the same test.
7. Ranks and scores on screen are the sorted numbers. Switching tabs must change who is first. Do not keep one painted order and only restyle it.
8. A shift appears only when the stored delta is non-zero. Up is a chevron and the absolute number in green. Down is a chevron and the absolute number in brick red. Zero renders an empty cell so the score column stays aligned. The accessible name of the chevron cell is "Up 2 places" or "Down 1 place" (singular when the absolute value is 1).
9. A polite live region on each tab change says "{Period}. You are place {n} with {score}." Example: "Today. You are place 2 with 1,712."
10. Keyboard on the tab list: ArrowRight and ArrowLeft move, wrapping. Home selects Today. End selects All. The newly selected tab receives focus. The panel has `aria-labelledby` pointing at the selected tab.
11. Scores use `en-GB` grouping: 1712 renders as 1,712. 48210 renders as 48,210. No decimals. No value like 99.99.
12. Do not use localStorage, cookies, alert, console.log, or document.write.

## Structure

```
1280 x 800, sheet 840px centred on #E7EEF2
┌──────────── 840px sheet ────────────┐
│ QUERN                         Mill  │  header, padding 28px 28px 0
│ Ladder                        house │
│                               Sunday│
│                               table │
│ Points from finished hands. Your    │  lede, margin 14px 28px 0
│ place stays on the sheet.           │
│ [ Today ]  This week   All          │  tab row 44px, 2px ink underline
│ PLACE    PLAYER    SHIFT    SCORE   │  36px, uppercase 11px
│ 1  Tomas Reed       ^2      1,840   │  row 64px
│ 2  Leah Moss  YOU   ^1      1,712   │  clay row, 3px clay inset
│ 3  Anika Shah       v1      1,690   │
│ ... list scrolls ...                │
│ (pin, only if Leah is clipped)      │  64px, same grid as a row
└─────────────────────────────────────┘
Side ground is (1280 - 840) / 2 = 220px each side.
```

- `main.sheet`: 840px wide, height 100%, flex column, hairline left and right, ground `--sheet`.
- `header.top`: brand `p`, `h1` "Ladder", and `p.where` with two lines "Mill house" and "Sunday table".
- `p.lede`: "Points from finished hands. Your place stays on the sheet."
- `div[role=tablist]` labelled "Period", three `button[role=tab]`.
- A visual column row, `aria-hidden="true"`.
- `div[role=tabpanel]#panel` contains `.scroller` (`tabindex="0"`, `aria-label="Ranked players"`) and an `ol#list` of `li.row`.
- `#pin` is a sibling under the panel, hidden when Leah's row is fully visible. Its inner `.pin-row` repeats the same four cells. The pin is `aria-hidden` is wrong here: give the pin row an `aria-label`, but keep the element `hidden` when it is not shown so it leaves the accessibility tree. When shown, the in-list row remains reachable by scrolling, and the pin is a visual duplicate. Set `aria-hidden="true"` on the pin while it is visible too, so the name is not read twice. The live region already states her place.
- One `p#live`, visually hidden, `aria-live="polite"`.

## Tokens

```css
:root {
  --paper: #E7EEF2;     /* page ground, outside the sheet */
  --sheet: #F7FBFC;     /* sheet and default row */
  --ink: #14202B;       /* title, names, selected tab, score */
  --ink-2: #3E5160;     /* brand, meta, unselected tab, rank */
  --line: #D3DEE6;      /* sheet edge, tab rule, pin rule */
  --line-2: #E1E8EE;    /* row rule */
  --hover: #F2F6F8;     /* row hover */
  --clay: #C4512C;      /* you tag, you bar, focus */
  --you: #F8E8DC;       /* you row and pin */
  --you-hover: #F4E0D2;
  --up: #145C3A;        /* places gained */
  --down: #8C2F28;      /* places lost */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --sheet-w: 840px;
  --row-h: 64px;
  --pad-x: 28px;
  --dur-tab: 160ms;
  --dur-row: 120ms;
}
```

Row grid: `72px minmax(0, 1fr) 88px 112px`, column gap 8px, horizontal padding 28px.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Brand | Public Sans | 12px | 600 | 1.2 | 0.18em | Uppercase |
| Title | Newsreader | 44px | 600 | 0.95 | -0.03em | Sentence |
| Where, lede | Public Sans | 14px / 15px | 400 | 1.35 | 0 | Sentence |
| Tab | Public Sans | 15px | 500, 600 if selected | 1 | 0 | Sentence, as written |
| Column label | Public Sans | 11px | 600 | 1 | 0.14em | Uppercase |
| Rank | Public Sans | 16px | 600 | 1 | 0 | Tabular nums |
| Name | Public Sans | 16px | 600 | 1 | 0 | Sentence |
| You tag | Public Sans | 11px | 600 | 1 | 0.14em | Uppercase |
| Shift | Public Sans | 13px | 600 | 1 | 0 | Tabular nums |
| Score | Public Sans | 16px | 600 | 1 | 0 | Tabular nums, right aligned |

Newsreader on the title: `font-variation-settings: "opsz" 72`. Fallback: Newsreader, Georgia, serif. Public Sans, "Avenir Next", sans-serif.

## Motion

| Thing | Trigger | Property | From | To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tab colour and underline | selection change | color, border-color | muted / transparent | ink / ink | 160ms | cubic-bezier(0.2, 0.7, 0.2, 1) | transition none, state still changes |
| Row ground | hover | background | sheet | hover tint, or you-hover on the you row | 120ms | same easing | transition none |

No row-insert animation. Rebuilding the list is instant. No counting-up of scores. No looping motion.

## States

- Tab, rest: transparent, type `--ink-2`, 2px transparent bottom border, height 44px, padding 0 14px. The border sits on the shared 1px rule (`margin-bottom: -1px`).
- Tab, hover: type `--ink`.
- Tab, selected: weight 600, type `--ink`, bottom border `--ink`.
- Tab, focus-visible: 2px `--clay` outline, offset 3px.
- Row, rest: 64px, top 1px `--line-2`, ground `--sheet`.
- Row, hover: ground `--hover`. The you row hovers to `--you-hover` instead.
- You row: ground `--you`, `box-shadow: inset 3px 0 0 var(--clay)`, and an uppercase "You" tag in `--clay` after the name.
- Shift up: `--up`, chevron path `M6 14l6-6 6 6`. Shift down: `--down`, chevron path `M6 10l6 6 6-6`. Icon 16px, stroke 1.75px, round caps.
- Pin: same geometry as a you row, plus a 1px `--line` top border on the pin wrapper. `hidden` when Leah's row rectangle lies fully inside the scroller rectangle (1px tolerance).
- Scroller: `overflow-y: auto`, `overflow-x: hidden`, `overscroll-behavior: contain`, thin scrollbar. The page itself does not scroll at 1280.
- Empty shift cell still occupies the third grid column.

## Accessibility

- Tabs follow the tabs pattern. `role="tablist"` with `aria-label="Period"`. Each tab has `role="tab"`, `aria-selected`, `aria-controls="panel"`, and roving `tabindex` (0 on the selected tab, -1 on the others).
- The panel is `role="tabpanel"` with `aria-labelledby` set to the selected tab id.
- Each `li` has an `aria-label` that includes place, name, the shift sentence when there is one, the grouped score, the word "points", and ", you" on Leah's row. Example: "Place 2, Leah Moss, up 1 place, 1,712 points, you".
- Column headers are `aria-hidden="true"` because the row label already speaks the fields.
- The scroller is a tab stop (`tabindex="0"`) with `aria-label="Ranked players"` so keyboard users can scroll it.
- The pin is `hidden` when not needed. When needed, set `aria-hidden="true"` on it as well, so assistive tech reads the in-list row rather than a second copy. The live region announces the new place on every tab change.
- Focus ring: 2px solid `--clay`, offset 3px, on `:focus-visible` only.
- Contrast: `--ink` on `--sheet` is well above 7:1. `--ink-2` `#3E5160` on `--sheet` is about 7.9:1. `--up` `#145C3A` and `--down` `#8C2F28` on `--sheet` both clear 4.5:1. You tag `--clay` on `--you` is about 6:1.
- Hit targets: tabs are 44px tall. Rows are 64px. The scroller is the scroll control.

## Responsive rules

- At 1280 and above: sheet 840px, centred, page `overflow: hidden`, list scrolls inside the sheet.
- 641px to 900px: sheet width 100%, drop the side borders, keep the same row grid.
- Below 640px: the page may scroll, the inner scroller becomes `overflow: visible`, horizontal padding drops to 16px, the row grid becomes `40px minmax(0, 1fr) 64px 80px`, and the title drops to 36px. Names truncate with ellipsis. The you row is still marked. The pin logic can stay, but if the page itself scrolls, prefer keeping Leah's row in the document order so she is not trapped in a nested scroller.
- Do not turn the ladder into cards. It stays a ranked list.

## Acceptance checklist

### Always

- [ ] Three tabs share one list. Selecting a tab replaces the rows from that period's scores.
- [ ] Rank is assigned after sorting by score descending. A tie breaks by name ascending. This demo has no ties.
- [ ] The player's row is marked in the list and remains on screen: either inside the viewport, or as a pin when the list row is clipped.
- [ ] Scores are integers with thousands separators. No decimals and no fake precision such as 99.99.
- [ ] A shift shows on only some rows, as places up or down, with a direction in the accessible name.
- [ ] Arrow keys, Home, and End move the tab selection. The selected tab is focusable. The others are `tabindex="-1"`.
- [ ] A polite live region states the period and the player's place and score after each change.
- [ ] Focus-visible is a 2px clay outline. Tabs are at least 44px tall.
- [ ] `prefers-reduced-motion: reduce` removes the colour transitions. Tabs and rows still update.
- [ ] The page does not scroll sideways at 1280. The list may scroll vertically inside the sheet.

### This demo

- [ ] Product is Quern. Title is "Ladder". Lede is "Points from finished hands. Your place stays on the sheet." Where-line is "Mill house" / "Sunday table".
- [ ] Tabs read "Today", "This week", "All". First frame is Today.
- [ ] The player is Leah Moss. Her tag reads "You".
- [ ] Today place 1 is Tomas Reed, 1,840, up 2. Leah Moss is place 2, 1,712, up 1. The pin is hidden.
- [ ] This week place 1 is Anika Shah, 9,420, up 1. Leah Moss is place 6, 7,644, up 3.
- [ ] All place 1 is Helen Cho, 48,210. Leah Moss is place 9, 26,118, down 1, and the pin is visible at scroll 0.
- [ ] The other shifts match the tables in the implementation notes. Rows with delta 0 show no chevron.
- [ ] Palette is paper `#E7EEF2`, sheet `#F7FBFC`, ink `#14202B`, clay `#C4512C`. Type is Newsreader and Public Sans.

### Period tables

Delta is places, not points. Positive is up. Store it beside the score. Do not compute it by comparing tabs.

Today:

| Player | Score | Delta |
| --- | --- | --- |
| Tomas Reed | 1840 | 2 |
| Leah Moss | 1712 | 1 |
| Anika Shah | 1690 | -1 |
| Owen Blake | 1544 | 0 |
| Helen Cho | 1498 | 3 |
| Idris Lang | 1402 | 0 |
| Mara Voss | 1388 | -2 |
| Jules Okada | 1290 | 0 |
| Jonah Keller | 1214 | 0 |
| Ellis Quinn | 1096 | 0 |
| Freya Holm | 980 | 0 |
| Ned Albright | 864 | 0 |

This week:

| Player | Score | Delta |
| --- | --- | --- |
| Anika Shah | 9420 | 1 |
| Helen Cho | 9104 | 0 |
| Owen Blake | 8870 | -2 |
| Tomas Reed | 8640 | 0 |
| Idris Lang | 8012 | 1 |
| Leah Moss | 7644 | 3 |
| Freya Holm | 7200 | 0 |
| Mara Voss | 6988 | -1 |
| Jules Okada | 6540 | 0 |
| Jonah Keller | 6102 | 0 |
| Ellis Quinn | 5404 | 0 |
| Ned Albright | 4980 | 0 |

All:

| Player | Score | Delta |
| --- | --- | --- |
| Helen Cho | 48210 | 0 |
| Anika Shah | 45102 | 1 |
| Owen Blake | 44080 | 0 |
| Tomas Reed | 39840 | -1 |
| Mara Voss | 36220 | 0 |
| Idris Lang | 34110 | 0 |
| Freya Holm | 31004 | 2 |
| Jules Okada | 28440 | 0 |
| Leah Moss | 26118 | -1 |
| Jonah Keller | 24002 | 0 |
| Ellis Quinn | 17640 | 0 |
| Ned Albright | 15420 | 0 |

## Implementation notes

**Sort, then number.** The arrays above happen to be sorted. Sort anyway so a future edit cannot drift the printed place away from the score.

```js
var rows = boards[key].slice().sort(function (a, b) {
  return b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
});
rows.forEach(function (r, i) {
  var rank = i + 1;
  var you = r[0] === 'Leah Moss';
  /* li.row, class you, aria-label, four cells */
});
scroller.scrollTop = 0;
syncPin();
```

Common mistake: painting the rank from a field in the data, then sorting the scores and leaving the old rank stuck on the row.

**Pin only when the marked row is clipped.** Compare rectangles after layout. A sticky row cannot pull a below-the-fold row into view, so the pin is a second render of the same cells.

```js
function syncPin() {
  var row = list.querySelector('.you');
  var sb = scroller.getBoundingClientRect();
  var rb = row.getBoundingClientRect();
  var clipped = rb.bottom > sb.bottom + 1 || rb.top < sb.top - 1;
  pin.hidden = !clipped;
  pin.setAttribute('aria-hidden', 'true');
}
scroller.addEventListener('scroll', syncPin);
```

The panel must be `flex: 1; min-height: 0; display: flex` and the scroller `flex: 1; min-height: 0; overflow-y: auto`. If the scroller grows with the list, nothing clips, the pin never appears, and the body cuts off place 12.

**Tabs.** Roving tabindex, not a radio group styled as links.

```js
function select(i) {
  tabs.forEach(function (tab, n) {
    var on = n === i;
    tab.setAttribute('aria-selected', on ? 'true' : 'false');
    tab.tabIndex = on ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tabs[i].id);
  render(keys[i]);
}
```

Common mistake: leaving every tab at `tabindex="0"`, so Tab visits all three, and forgetting to reset scroll, so All opens halfway down yesterday's offset.
