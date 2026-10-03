<!-- Design Lounge Nº 262 · "Phone search with live results" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Phone search with live results

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The search screen of "Porchlight", a neighbourhood app for the town of Fairhaven. It opens with the field already focused and a Cancel button beside it. Below sit three blocks: Recent searches you can remove one by one, Trending chips with a rank number, and a 2 by 3 Browse grid. Typing swaps those blocks for a live suggestion list where the typed part is bold. Submitting shows results under four tabs: Top, People, Places, Posts. A search with no hits shows an empty state that offers the nearest real word.

The language is iOS 26-ish but quiet: white page, near-black ink, one cobalt accent, Inter, 10px radii, hairlines instead of shadows. Cobalt appears only on Cancel, the caret, the focused field ring, the active tab line, the Clear and See all links, and the did-you-mean button. The detail worth copying is the Top tab: it groups hits by type, shows two of each, and puts a "See all N" link that jumps to the matching tab.

## Reference behaviour

1. First frame: the field has focus. It is white with a 1.5px cobalt inset ring and the placeholder "People, places, posts". Cancel is visible to its right. Recent shows four rows: Rye & Ember, Hollis Street pottery, Piano lessons, Mara Okafor. Trending in Fairhaven shows six chips ranked 1 to 6. Browse shows six tiles.
2. Each recent row has a clock icon, the query, and a 44px remove button with an X. Tapping X collapses that row height to 0 and fades it over 200ms, then removes it. Focus moves to the next row's remove button, or the first trending chip if none are left.
3. Tapping Clear empties Recent. The heading stays and the text "No recent searches." appears in muted ink. Clear hides.
4. Tapping a recent row, a chip, or a Browse tile runs that search at once.
5. Typing a character replaces the start blocks with the suggestion list. The first row always reads Search “typed text” with a cobalt search icon. Up to six matches follow: topics first, then places and people. A match is a word that starts with the typed text, not any substring ("pot" matches "Pottery", not "spot").
6. In each suggestion the matched part is 700 weight ink. The rest is 400 weight `--ink-2`. A muted kind label (Topic, Place, Person) sits on the right.
7. A grey clear button (18px filled circle with a white X) appears inside the field when it has text. Tapping it empties the field, keeps focus, and returns to the start blocks.
8. Enter, or tapping a suggestion, submits. The field blurs and goes back to the grey fill. The query is pushed to the top of Recent (max five, no duplicates, case-insensitive).
9. Results: a tab row appears under the field with Top, People, Places, Posts. People, Places and Posts show their hit count in 13px. A tab with 0 hits is disabled at 45% opacity. A 1px rule appears under the header.
10. Under the tabs, a count line reads "3 results for “pot”" with the number part in 600 ink.
11. Top groups hits as Places, People, Posts, each with a 13px uppercase label. Each group shows two rows. If a group has more than two, a "See all N" link on the right switches to that tab.
12. Tapping a tab moves the 2px cobalt line under it over 280ms and swaps the list. The count line updates to that tab's total.
13. No hits: tabs hide. The page shows a 56px line magnifier, "No results for “sourdoe”", one line of help, and a cobalt-tint button Search “sourdough” instead. The suggestion is the closest topic or title by edit distance. If nothing is within 3 edits, it offers "farmers market".
14. Focusing the field again after a search shows the suggestion list for the current text.
15. Cancel or Escape clears the text, hides the tabs, blurs the field, slides Cancel out to the right over 280ms, and shows the start blocks.

## Structure

```
390 × 844  (status bar drawn by the Lounge; 54px top clearance)
┌──────────────────────────────────────┐
│                                      │ 54
│ ┌ ⌕ People, places, posts ───┐ Cancel│ field 44 tall, r10 · Cancel 72 wide
│ └────────────────────────────┘       │
│ Top  People 1  Places 1  Posts 1     │ tabs 44 (results only)
│ ▔▔▔                                  │ 2px cobalt line
├──────────────────────────────────────┤ 1px rule (results only)
│ Recent                         Clear │ h2 20/700
│ ◷ Rye & Ember                      × │ rows 48, hairline between
│ ◷ Hollis Street pottery            × │
│ ◷ Piano lessons                    × │
│ ◷ Mara Okafor                      × │
│ Trending in Fairhaven                │
│ [1 Farmers market] [2 Night swim]    │ chips 44 tall, gap 8, wrap
│ [3 Lost dog] [4 Pottery class]       │
│ [5 Open mic] [6 Sourdough]           │
│ Browse                               │
│ [☕ Food & drink] [▦ Events]          │ 2 cols, tiles 52 tall, gap 8
│ [⚒ Services]     [⇄ Swaps]           │
│ [⚇ Groups]       [◌ Pets]            │
│                                      │ 34 + 16 bottom padding
└──────────────────────────────────────┘
```

Results rows:

```
┌────┐ Hollis Street Pottery        1.2 mi    thumb 44×44 r10
│ ⌖  │ Studio · Classes weekly                 title 16/600, sub 14
└────┘                                         row padding 12 0
( PR ) Priya Raman                 2 mutual    avatar 44 circle, initials
┌────┐ Kick wheel for sale, £80                post: 2-line snippet clamp
│ ▭  │ Works well, a little loud. Collect…
└────┘ Priya Raman · 3 replies · 5d            meta 13 muted
```

- The page is a flex column: `header` (fixed height) and `main` (`flex: 1; overflow-y: auto`). The body does not scroll.
- The field sits in a `form role="search"`. The input is `type="search"` with `role="combobox"`, `aria-controls` pointing at the suggestion `ul role="listbox"`.
- Recent is a `ul`. Each `li` holds two buttons: the query and the remove button.
- Trending chips and Browse tiles are buttons.
- The tab row is a `div role="tablist"` with four `button role="tab"`. One absolutely placed `i` is the moving line.
- Results are a `section role="tabpanel"` holding `ul` lists. Each row is one button.
- One visually hidden `p aria-live="polite"` announces counts.

## Tokens

```css
:root {
  /* colour */
  --bg: #ffffff;            /* page */
  --field: #f1f3f6;         /* resting field, tiles, thumbs, pressed rows */
  --ink: #11151c;           /* titles, body */
  --ink-2: #4a5260;         /* subtitles, unmatched suggestion text */
  --ink-3: #6b7280;         /* icons, meta, placeholders */
  --line: #e6e8ec;          /* hairlines, chip borders */
  --primary: #1f4fd8;       /* cobalt: cancel, caret, tab line, links */
  --primary-wash: #edf2fd;  /* did-you-mean button fill */
  --focus: #1f4fd8;
  --clear-dot: #9aa0aa;     /* clear button circle */

  /* type */
  --sans: "Inter", -apple-system, system-ui, sans-serif;
  --fs-input: 17px;
  --fs-h2: 20px;
  --fs-title: 16px;
  --fs-body: 15px;
  --fs-sub: 14px;
  --fs-meta: 13px;

  /* space (4px base) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px;
  --gutter: 16px;
  --top-clear: 54px;
  --bottom-clear: 34px;

  /* shape */
  --r: 10px;
  --hit: 44px;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --micro: 160ms;
  --layout: 280ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Colour |
| --- | --- | --- | --- | --- | --- | --- |
| Field text | Inter | 17px | 400 | 44px box | 0 | `--ink` |
| Cancel | Inter | 17px | 500 | 1.4 | 0 | `--primary` |
| Section heading | Inter | 20px | 700 | 1.4 | -0.015em | `--ink` |
| Recent row | Inter | 16px | 400 | 1.4 | 0 | `--ink` |
| Chip | Inter | 15px | 500 | 1.4 | 0 | `--ink`, rank 13px `--ink-3` |
| Tab | Inter | 15px | 600 | 1.4 | 0 | `--ink-3`, selected `--ink` |
| Tab count | Inter | 13px | 500 | 1.4 | tabular | inherits |
| Group label | Inter | 13px | 600 | 1.4 | 0.04em, uppercase | `--ink-3` |
| Result title | Inter | 16px | 600 | 1.3 | -0.01em | `--ink` |
| Result sub | Inter | 14px | 400 | 1.4 | 0 | `--ink-2` |
| Meta, count line | Inter | 13px | 400 | 1.4 | tabular | `--ink-3` |
| Suggestion match | Inter | 16px | 700 | 1.4 | 0 | `--ink` |

Keep the field at 17px. Under 16px, iOS Safari zooms the page on focus.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Field ring | focus | background, inset shadow | `--field` → white, 0 → 1.5px cobalt | 160ms | `--ease` | instant |
| Cancel | focus / cancel | margin-right, opacity | -72px, 0 → 0, 1 | 280ms / 160ms | `--ease` | instant |
| View swap | home ↔ suggest ↔ results | opacity, translateY | 0, 6px → 1, 0 | 220ms | `--ease` | instant |
| Recent remove | tap X | height, opacity | row height, 1 → 0, 0 | 200ms / 160ms | `--ease` | removed at once |
| Tab line | tab change | translateX, width | old tab → new tab | 280ms | `--ease` | instant |
| Header rule | results shown | border colour | transparent → `--line` | 160ms | `--ease` | instant |

Nothing loops. Suggestions do not animate per keystroke; the list re-renders in place so typing never feels laggy.

## States

- Field resting: `--field` fill, no ring, magnifier `--ink-3`.
- Field focused: white fill, `inset 0 0 0 1.5px var(--focus)`, caret cobalt.
- Field with text: clear button visible. Empty: clear button gone.
- Cancel hidden: shifted out by its own width, `visibility: hidden` after the slide so it cannot be tabbed to.
- Row pressed (recent, chip, tile, result): background `--field`.
- Suggestion active by arrow key: `aria-selected="true"`, background `--field`.
- Tab selected: ink colour, cobalt line under it, `aria-selected="true"`, `tabindex="0"`. Others `tabindex="-1"`.
- Tab disabled: 0 hits, `disabled`, opacity 0.45.
- Empty recents: "No recent searches." in 15px `--ink-3`, Clear hidden.
- No results: tabs hidden, header rule hidden, did-you-mean button shown.
- Focus-visible on every control: 2px cobalt outline, 2px offset, 6px radius. Cancel uses offset -2px because its row clips overflow.

## Accessibility

- The input has a visually hidden label "Search Porchlight". The placeholder is not the label.
- `role="combobox"`, `aria-expanded` is true only while the suggestion list shows. `aria-autocomplete="list"`.
- ArrowDown and ArrowUp move through suggestions with `aria-activedescendant`. Enter submits the active one, or the typed text if none is active. Escape cancels.
- Each remove button is named "Remove Rye & Ember" etc. The X icon is `aria-hidden`.
- Tabs follow the tabs pattern: ArrowLeft and ArrowRight move between enabled tabs and select them. Disabled tabs are skipped.
- The results panel has `role="tabpanel"` and is labelled by the count line.
- The live region says "3 results for pot" or "No results for sourdoe" after each search.
- Every hit target is at least 44px: field 44 tall, clear 44×44, remove 44×44, chips 44 tall, tiles 52 tall, tabs 44 tall, result rows 68 or more.
- Contrast on white: `--ink` 18.3:1, `--ink-2` 7.9:1, `--ink-3` 4.8:1, `--primary` 6.6:1.
- After removing a recent, focus never drops to `body`.

## Responsive rules

- 390 wide is the reference. At 360 wide the field shrinks; Cancel stays 72px. Chips wrap to more rows. Browse stays two columns.
- The tab row fits four tabs with counts at 360. If a product adds a fifth tab, make the tab row scroll sideways inside itself, never the page.
- Long queries ellipsis in suggestions and recents. The empty-state heading wraps with `overflow-wrap: anywhere`.
- At tablet width, do not stretch this screen. Put search in a 480px column or a popover from a toolbar.
- Never draw a status bar or keyboard. Keep 54px top and 34px + 16px bottom clearance.

## Acceptance checklist

### Always

- [ ] The field is focused on the first frame, with Cancel visible.
- [ ] Recent rows each have a 44px remove button; removing one keeps focus inside the list.
- [ ] Typing shows a suggestion list whose first row searches the exact typed text.
- [ ] The matched part of each suggestion is bold; the rest is regular weight.
- [ ] Matching is by word start, not any substring.
- [ ] Results have four tabs; a tab with 0 hits is disabled.
- [ ] A count line states how many results the current tab holds.
- [ ] No hits shows an empty state with one suggested search, not a blank page.
- [ ] Escape and Cancel both return to the start blocks and blur the field.
- [ ] Only one accent colour; separation is by hairlines, no shadows.
- [ ] All hit targets are 44px or more; focus is visible on every control.
- [ ] No horizontal scroll at 360 wide.

### This demo

- [ ] Brand is Porchlight; trending heading reads "Trending in Fairhaven".
- [ ] Recents are Rye & Ember, Hollis Street pottery, Piano lessons, Mara Okafor.
- [ ] Chips are Farmers market, Night swim, Lost dog, Pottery class, Open mic, Sourdough, ranked 1 to 6.
- [ ] Typing "pot" suggests "pottery class" (Topic) and "Hollis Street Pottery" (Place).
- [ ] Submitting "pot" shows 3 results: 1 place, 1 person, 1 post.
- [ ] Searching "sourdoe" offers Search “sourdough” instead.
- [ ] Accent is `#1f4fd8`, field fill `#f1f3f6`, radius 10px.

## Implementation notes

**1. Word-start match and bold.** Find the index where a word starts with the query, then wrap only that slice. Escape text before inserting HTML.

```js
const at = (text, q) => {
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp('(^|[^a-z0-9])' + safe).exec(text.toLowerCase());
  return m ? m.index + m[1].length : -1;
};
function highlight(text, q) {
  const i = at(text, q);
  if (i < 0) return esc(text);
  return esc(text.slice(0, i)) + '<b>' + esc(text.slice(i, i + q.length)) + '</b>' + esc(text.slice(i + q.length));
}
```

Common mistake: `text.includes(q)`. It makes "pot" match "spot" and the results feel random.

**2. Cancel that slides out without leaving a gap.** Give Cancel a fixed width and pull it out with the same negative margin. The row clips overflow. Delay `visibility: hidden` until the slide ends so keyboard users cannot reach it while hidden.

```css
.row { display: flex; align-items: center; overflow: hidden; }
.cancel { flex: none; width: 72px; text-align: right; margin-right: -72px;
  opacity: 0; visibility: hidden;
  transition: margin 280ms var(--ease), opacity 160ms var(--ease), visibility 0s 280ms; }
.top.on .cancel { margin-right: 0; opacity: 1; visibility: visible;
  transition: margin 280ms var(--ease), opacity 160ms var(--ease); }
```

If the margin and the width differ, the field overshoots the right edge when Cancel is hidden.

**3. Did-you-mean.** Run a small edit distance over the topic list and result titles. Offer the nearest one only if it is within 3 edits; otherwise offer a popular search.

```js
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return d[a.length][b.length];
}
```

Other mistakes to avoid:

- Drawing a fake keyboard to fill the space. The Browse grid fills the frame instead.
- A second accent for trending. The rank numbers are muted ink, not a colour.
- Animating every suggestion row in on each keystroke.
- Saving a suggestion click without saving it to Recent.
- Clearing the query when the user taps a tab.
- Moving focus to `body` after removing the last recent.

Rebuild order:

1. Lay out the header with the field, clear button and Cancel. Focus the field on load.
2. Build the start blocks: Recent, Trending, Browse.
3. Wire remove and Clear, with the collapse and focus rules.
4. Build the suggestion list with word-start matching and bold.
5. Add the combobox keys: arrows, Enter, Escape.
6. Build results with the Top grouping and the three type tabs.
7. Add the moving tab line and disabled empty tabs.
8. Add the empty state with did-you-mean.
9. Add the live region and test at 360 wide.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
