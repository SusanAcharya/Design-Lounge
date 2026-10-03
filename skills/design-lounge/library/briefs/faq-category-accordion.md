<!-- Design Lounge Nº 228 · "FAQ category accordion" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# FAQ category accordion

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A help centre FAQ for **Brightwell**, a coffee subscription. A 240px category list sits on the left: Billing (4), Accounts (3), Shipping (4), Security (3). The right column shows the questions for the chosen category as an accordion. A search field at the top right filters all 14 questions across every category as you type, groups the hits under category headings, and wraps each match in a green `<mark>`. Under the list, a grey card says "Still stuck? Talk to a person." with a live median reply time.

The feeling is quiet: white, slate text, one green, 8px radii, hairlines instead of shadows. The detail worth copying is that search ignores the chosen category, and the category counts turn into hit counts while you type.

## Reference behaviour

1. First frame: Billing is selected (`aria-pressed="true"`, green tint). The right column shows Billing's 4 questions. The second question, "How do I get a refund for a bag I did not like?", is open. The other three are closed.
2. The count line under the search reads "4 questions in Billing · 14 in total".
3. Click a closed question: its panel opens over 280ms by animating `grid-template-rows` from `0fr` to `1fr`. The chevron turns 180deg and goes green. Other open items stay open.
4. Click an open question: it closes on the same clock. The chevron turns back and goes grey.
5. Click "Shipping" in the list: Shipping becomes pressed. The right column shows its 4 questions. Open/closed state is kept per question, so going back to Billing still shows the refund question open.
6. Type `card` in the search: the category selection is ignored. All 14 questions are checked against question and answer text, case-insensitive.
7. Hits show grouped under small upper-case category headings (BILLING, SECURITY). Each match in the question or answer is wrapped in `<mark>`.
8. If the match is only in the answer, that item opens so the highlight is visible. If the match is in the question, the item keeps its own state.
9. While searching, no category is pressed. Each category's pill shows its hit count. Categories with 0 hits turn light grey (`#94A3B8`).
10. The count line reads "4 questions match “card” in 2 categories". It is a polite live region.
11. A clear button (X, 32px) appears inside the right end of the search field.
12. Type `zzzz`: no groups show. An empty block appears: "Nothing matches that search", "Try a shorter word, like refund, login, or tracking.", and a "Clear search" button. The count reads "No questions match “zzzz”".
13. Click Clear search, the X, or press Escape in the field: the field empties, the previous category view returns, focus goes to the field.
14. Click a category while searching: the search clears and that category is selected.
15. The "Still stuck?" card always sits under the list. It has three overlapping 36px avatars, the title, "Online now. Median first reply 6 min, Mon to Sat, 07:00 to 21:00 GMT." with a 7px green dot, a green "Start a chat" button and an outline "Email us" button.
16. Reduced motion: panels and chevrons change in 1ms. Search and categories behave the same.

## Structure

```
1280 x 800, padding 44 64 48, max-width 1280
+----------------------------------------------------------------------+
| Brightwell Help Centre (13px green)        [ (o) Search refunds... X ]|
| Questions, answered (36px)                  4 questions in Billing ... |
| Coffee subscriptions, roasted Tuesdays...                             |
|----------------------------------------------------------------------| 1px line, pad-bottom 28
| CATEGORIES        |  When am I charged for my subscription?        v |
| [Billing      4]  |--------------------------------------------------|
|  Accounts     3   |  How do I get a refund for a bag I did not ... ^ |
|  Shipping     4   |  Reply to the shipping email within 30 days ...  |
|  Security     3   |--------------------------------------------------|
|                   |  Can I pay with PayPal or a bank transfer?     v |
|   240px           |  Where do I find my VAT invoices?              v |
|                   |  +--------------------------------------------+  |
|                   |  | (MO)(JR)(AK) Still stuck? ...  [Chat][Email]|  |
|                   |  +--------------------------------------------+  |
+----------------------------------------------------------------------+
head: columns minmax(0,1fr) minmax(0,420px), gap 32
body: columns 240px minmax(0,1fr), gap 56, padding-top 28
```

- The whole block is a `section` named by the `h2` "Questions, answered".
- The search wrapper has `role="search"`. Inside: an icon SVG, a visually hidden `label`, `input type="search"`, and a clear `button` with `aria-label="Clear search"`.
- The count line is a `p` with `role="status"` and `aria-live="polite"`. The input points at it with `aria-describedby`.
- The category list is a `nav` labelled "Question categories" with a `ul` of four `button`s. Each button has the name and a count pill.
- The list column holds `#list` (groups), `#empty`, and the `aside` card.
- Each group is a `div.group` with an `h3` (hidden when not searching).
- Each item: `div.item`, then `h4 > button.q` with `aria-expanded` and `aria-controls`, then `div.panel` with `role="region"` and `aria-labelledby` pointing back at the button.
- The panel wraps one `div` with `overflow: hidden; min-height: 0`, and that wraps the answer `p`.
- The card is an `aside` named by its title.

## Tokens

```css
:root {
  /* colour */
  --bg: #ffffff;          /* page */
  --soft: #f6f7f9;        /* hover fill, count pill, card */
  --ink: #0f172a;         /* headings, questions */
  --ink-2: #334155;       /* answers, category labels */
  --ink-3: #64748b;       /* meta, chevrons, group heads */
  --ink-4: #94a3b8;       /* placeholder, zero-hit category */
  --line: #e2e8f0;        /* hairlines between items */
  --line-2: #cbd5e1;      /* input and outline-button border */
  --accent: #15803d;      /* the one green */
  --accent-hover: #166534;
  --accent-soft: #ecfdf3; /* selected category fill */
  --mark: #dcfce7;        /* search highlight */
  --focus: #15803d;

  /* type */
  --sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;

  /* space and shape */
  --r: 8px;
  --pad-x: 64px;
  --gap-cols: 56px;
  --rail: 240px;
  --row-min: 56px;
  --cat-h: 40px;
  --input-h: 44px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --micro: 160ms;
  --layout: 280ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Colour |
| --- | --- | --- | --- | --- | --- | --- |
| Kicker | Inter | 13px | 600 | 1.55 | 0 | `--accent` |
| Heading | Inter | 36px | 700 | 1.15 | -0.025em | `--ink` |
| Sub | Inter | 15px | 400 | 1.55 | 0 | `--ink-3` |
| Search input | Inter | 15px | 400 | 1 | 0 | `--ink` |
| Count line | Inter | 13px | 400 | 1.55 | 0 | `--ink-3` |
| Rail label | Inter | 12px | 600 | 1.55 | 0.06em upper | `--ink-3` |
| Category | Inter | 15px | 500, selected 600 | 40px box | 0 | `--ink-2`, selected `--accent` |
| Count pill | Inter | 12px | 600 tabular | 22px box | 0 | `--ink-3` |
| Group head | Inter | 12px | 600 | 1.55 | 0.06em upper | `--ink-3` |
| Question | Inter | 16px | 500 | 1.4 | 0 | `--ink` |
| Answer | Inter | 15px | 400 | 1.55 | 0 | `--ink-2`, max 68ch |
| Card title | Inter | 15px | 600 | 1.55 | 0 | `--ink` |
| Card meta | Inter | 13px | 400 | 1.55 | 0 | `--ink-3`, time in `--accent` 600 |
| Buttons | Inter | 14px | 600 | 40px box | 0 | - |

One family, four weights: 400, 500, 600, 700.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Panel | toggle | grid-template-rows | 0fr → 1fr | 280ms | --ease | 1ms |
| Panel visibility | close | visibility | visible → hidden | 0s after 280ms | - | 1ms |
| Chevron | toggle | rotate, colour | 0 → 180deg, ink-3 → accent | 280ms | --ease | 1ms |
| Category | hover | background, colour | none → --soft | 160ms | --ease | 1ms |
| Search focus | focus | border, ring | line-2 → accent + 3px green ring at 18% | 160ms | --ease | 1ms |

Search results replace the list at once. Do not animate items in and out on each keystroke; it flickers.

## States

- Category resting: no fill, `--ink-2`, pill `--soft` with `--ink-3` number.
- Category hover: `--soft` fill, `--ink` text.
- Category selected: `--accent-soft` fill, `--accent` text at 600, pill white with green number, `aria-pressed="true"`.
- Category with 0 hits while searching: text `--ink-4`. It stays clickable.
- Question hover: text turns `--accent`.
- Question open: `aria-expanded="true"`, chevron 180deg and green, panel at `1fr`.
- Focus-visible: 2px green outline, offset 2px. On questions the outline sits on the button box, which is 8px wider than the text on each side, radius 6px.
- Search focus: green border and a 3px `rgba(21,128,61,.18)` ring. The browser's own cancel icon is hidden; the custom X is shown only when there is text.
- Match: `<mark>` with `--mark` fill, inherited text colour, 3px radius, and a 2px inset green underline at 35%.
- Empty: the empty block with one button. The card still shows under it.
- Primary button hover: `--accent-hover`. Outline button hover: border `--ink-3`.

## Accessibility

- Every question is a real `button` inside an `h4`. The heading level sits under the `h3` group head and the `h2` section title.
- `aria-expanded` on the button, `aria-controls` pointing at the panel id, `role="region"` and `aria-labelledby` on the panel.
- Closed panels get `visibility: hidden` after the close finishes, so their text is not read and links inside cannot take focus.
- Category buttons use `aria-pressed`. They are filters, not tabs, so do not use `role="tab"`.
- The search input has a real label "Search all questions" and `aria-describedby` on the count line.
- The count line is `role="status"` with `aria-live="polite"`. It announces the hit count and category count on every change.
- Escape in the field clears it. Enter does nothing extra; filtering is live.
- `<mark>` is read as plain text by most screen readers, which is fine. Do not add extra labels to it.
- Escape all user text before inserting it as HTML. Build the highlight from escaped text, not raw input.
- Contrast: `#0f172a` on white is 17:1. `#334155` on white is 10:1. `#64748b` on white is 4.8:1. `#15803d` on white is 5.0:1. White on `#15803d` is 5.0:1.
- Hit targets: categories 40px tall, questions at least 56px tall, buttons 40px (44px on phone), clear button 32px inside a 44px field.
- Focus order: search, clear, categories top to bottom, questions top to bottom, card buttons.

## Responsive rules

- ≥1280: as drawn. Padding 44px 64px 48px. Head columns 1fr / 420px. Body columns 240px / 1fr, gap 56px.
- Below 1024: padding 36px 40px 40px. Rail 200px, gap 40px. The card moves its two buttons to a second row so the title does not wrap word by word.
- Below 768: the head stacks, search under the title at full width, gap 20px. The rail turns into a single row of pill chips (border 1px `--line`, radius 20px) that scrolls sideways with the scrollbar hidden. The rail label hides.
- <640: padding 28px 20px 32px. Heading 28px. Questions 15px. Answers drop their 40px right padding. Card buttons share the row equally and grow to 44px tall.
- Only the chip row may scroll sideways. The page must never scroll sideways at 390.
- All grid tracks use `minmax(0, 1fr)` so long questions wrap instead of pushing the chevron off screen.

## Acceptance checklist

### Always

- [ ] A category list with counts on the left and one accordion on the right.
- [ ] One item is open on the first frame.
- [ ] Panels open with `grid-template-rows: 0fr → 1fr` in 280ms. No `max-height` hack.
- [ ] Each question is a `button` with `aria-expanded` and `aria-controls`; each panel is a `region` labelled by its button.
- [ ] Search filters across all categories, groups hits under category headings, and wraps matches in `<mark>`.
- [ ] Category counts show hit counts while searching, and zero-hit categories go light grey.
- [ ] A polite live region states the result count after every keystroke.
- [ ] An empty state with a Clear search button. Escape also clears.
- [ ] A help card with a response time under the list.
- [ ] Visible 2px focus ring on every control.
- [ ] No horizontal page scroll at 390.

### This demo

- [ ] Brand "Brightwell Help Centre", heading "Questions, answered".
- [ ] Categories Billing 4, Accounts 3, Shipping 4, Security 3. Billing selected first.
- [ ] "How do I get a refund for a bag I did not like?" open on load.
- [ ] Searching `card` gives "4 questions match “card” in 2 categories".
- [ ] Card text "Still stuck? Talk to a person." and "Median first reply 6 min".
- [ ] Green `#15803D`, ink `#0F172A`, hairline `#E2E8F0`, radius 8px.

## Implementation notes

**The height animation.** Animate the track, not a height. The inner wrapper must have `min-height: 0` or the track cannot shrink below its content.

```css
.panel {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition: grid-template-rows 280ms var(--ease), visibility 0s linear 280ms;
}
.panel > div { overflow: hidden; min-height: 0; }
.open .panel {
  grid-template-rows: 1fr;
  visibility: visible;
  transition: grid-template-rows 280ms var(--ease), visibility 0s;
}
```

The visibility delay lets the close play out before the text is hidden.

**Safe highlighting.** Escape first, then wrap matches. Escape the regex too, so a search for `(` or `.` does not break.

```js
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rx = q => new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
const hi = (s, q) => q ? esc(s).replace(rx(esc(q)), m => '<mark>' + m + '</mark>') : esc(s);
```

**One render function for both modes.** Keep the data in an object keyed by category. Keep open state in a `Set` of ids, so it survives re-renders.

```js
function render() {
  const q = input.value.trim(), ql = q.toLowerCase();
  let shown = 0, groups = 0, html = '';
  for (const c of CATS) {
    const hits = DATA[c].map((qa, i) => ({ qa, i }))
      .filter(({ qa }) => !q || (qa[0] + ' ' + qa[1]).toLowerCase().includes(ql));
    setCount(c, hits.length, !q && c === cat);
    if ((!q && c !== cat) || !hits.length) continue;
    groups++; shown += hits.length;
    html += group(c, hits, q, ql);
  }
  list.innerHTML = html;
  empty.classList.toggle('on', !!q && !shown);
  count.textContent = summary(q, shown, groups);
}
```

Common mistakes:

- Animating `max-height` to a guessed number. Long answers get cut and short ones lag.
- Search that only looks inside the selected category. It must search all of them.
- Inserting the raw query into `innerHTML`. That is an injection hole.
- Using `role="tablist"` for the categories. They filter one list; they are toggle buttons.
- Closing every other item when one opens. Several may be open at once.
- Hiding the panel with `display: none`. The open animation cannot run from `none`.
- A highlight colour that is not the one green. Do not add yellow.
- Shadows on the items. Use 1px `--line` hairlines.
- Leaving the count line silent. It must be a live region.
- Forgetting the empty state, so a typo shows a blank column.

Where it sits:

1. It is a section on a help or pricing page, under the main content and above the footer.
2. For a docs index with no categories, use `faq-two-column-search`.
3. For a plain accordion with no search, use `accordion-grid-rows`.
4. If a kit is locked, map `--accent` to the kit primary and keep one accent only.

Rebuild order:

1. Lay out the head: title block left, search and count right.
2. Lay out the body grid: 240px rail, list column.
3. Render the categories with counts from the data.
4. Render one category's questions with the accordion markup.
5. Add the grid-rows animation and the chevron turn.
6. Add the search: filter, group, highlight, count, empty state.
7. Wire Escape, the X, and Clear search.
8. Add the help card under the list.
9. Add the 768 chip row and the phone steps.
10. Tab through it and toggle reduced motion.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
