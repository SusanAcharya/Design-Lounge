<!-- Design Lounge Nº 422 · "Transactions ledger" · designlounge.vercel.app -->

# Transactions ledger

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The account history of a fictional bank, "Ordwell Bank", for an everyday account. A bottle-green band holds the account name and the available balance; below it sit a search field and an All / Money in / Money out switch, then a ledger of thirteen transactions grouped under day headers. Each row has a merchant icon, a category swatch, the time, a signed amount, and the balance after that transaction. It should feel like a passbook: serif text, mono numbers, hairline rules, no cards, no shadows inside. The detail worth copying is the money column: every amount is set in tabular mono with two decimals and a real minus sign (U+2212), right-aligned, so the decimal points line up down the page without any per-cell padding tricks.

## Reference behaviour

1. First frame: sorted by Date, newest first, grouped by day (Saturday 3 October at the top). All thirteen transactions show. The counter reads "13 of 13 · net +982.79". The balance reads 3,301.21 with ".21" in a lighter, smaller weight.
2. Each day header shows the long date on the left ("Saturday 3 October") and "2 items · day net +4.30" on the right.
3. Typing in search filters rows whose merchant, reference or category contains the text, case-insensitive. Matching text is wrapped in a `mark` with a pale brass fill. Day headers re-group around what is left. The counter updates ("2 of 13 · net −140.26").
4. Pressing `/` anywhere focuses search. `Escape` in a non-empty search clears it.
5. No matches: one full-width row reads "No transactions match "zzz"" with a hint and a Clear search button that empties the field and refocuses it.
6. The direction switch filters credits (Money in) or debits (Money out). It combines with search.
7. Clicking Merchant, Category, Date or Amount sorts by that column; a second click reverses. Date and Amount start descending; text columns start ascending. Sorting by anything other than Date drops the day headers and shows a flat list. Returning to Date restores the groups.
8. The balance column is not sortable. Each row's balance is the balance after that transaction in date order; it travels with the row when the list is filtered or re-sorted.
9. Credits are green with a "+" and a green-tinted icon tile. Debits are ink with "−".
10. The table body scrolls inside the card. The column header row is sticky. The page itself never scrolls sideways.

## Structure

```
page #E7E3D8, padding 28px, card max-width 1080px, full height
+--------------------------------------------------------------------------+
| [bank] ORDWELL BANK · EVERYDAY ··4417            AVAILABLE BALANCE        |  band #12332A
| Account ledger (Spectral 28)                         3,301.21 (mono 34)   |  22/28/20 padding
+--------------------------------------------------------------------------+
| [ (search) Search merchant, category or reference      / ] [ALL|IN|OUT] 13 of 13 · net +982.79 |
+--------------------------------------------------------------------------+
| MERCHANT (34%)           CATEGORY      DATE ▼         AMOUNT    BALANCE  |  sticky, 1px ink rule
|                                                                          |
| Saturday 3 October                         2 items · day net +4.30       |  group header
| [ic] Lantern Noodle Bar  ■ Dining   3 Oct · 20:31      −38.20   3,301.21 |  row 54px
|      Card ··4417                                                         |
| [ic] Dana Kessler        ■ Transfer 3 Oct · 11:09      +42.50   3,339.41 |
| Friday 2 October ...                                                     |
+--------------------------------------------------------------------------+
```

- The card is a flex column: band, tools, then `.scroll` (flex 1, `overflow: auto`, `min-height: 0`, `tabindex="0"`, `role="region"`).
- One `table` with a hidden `caption`. `thead th` are `position: sticky; top: 0`.
- Each day is a `tr.day` with one `th colspan="5" scope="colgroup"`, followed by its `tr.tx` rows.
- Search is a `label` wrapping the icon, a hidden label text and `input type="search"`.
- The direction switch is a `div role="radiogroup"` of three native radios styled as a segmented control.
- The counter is a `span aria-live="polite"`.

## Tokens

```css
:root {
  --bg: #e7e3d8;        /* desk */
  --surface: #f7f5ef;   /* ledger paper */
  --sunk: #efece3;      /* row hover */
  --band: #12332a;      /* account band */
  --band-ink: #f1ede2;
  --band-2: #a9bdb3;    /* band labels */
  --ink: #13201c;
  --ink-2: #3d4a45;
  --ink-3: #5b6762;
  --line: #d8d3c6;
  --line-2: #c4bdac;
  --accent: #1d4a3c;    /* selected segment, search ring */
  --credit: #1c6a44;
  --credit-bg: #e1ece4;
  --brass: #8a6a2f;     /* sort marks, focus */
  --focus: #8a6a2f;
  --mark: #f0dfae;      /* search highlight */
  --serif: "Spectral", Georgia, serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --r: 4px;
  --row: 54px; --thead: 40px; --control: 40px;
  --ease: cubic-bezier(.2,.7,.2,1);
}
```

Category swatches: Groceries `#6f8f5a`, Dining `#b07a3a`, Income `#1c6a44`, Transit `#3d6b86`, Housing `#7a5c48`, Utilities `#c09a2c`, Health `#9a4a4a`, Books `#5a5a80`, Transfer `#7d8580`.

## Typography

| Role | Family | Size | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- | --- |
| Band label | Plex Mono | 11px | 500 | 0.12em | upper, `--band-2` |
| Title | Spectral | 28px | 500 | -0.01em | — |
| Balance | Plex Mono | 34px | 500 | -0.02em | tabular; cents 22px `--band-2` |
| Column header | Plex Mono | 11px | 500 | 0.1em | upper, `--ink-3` |
| Day header | Spectral | 15px | 600 | 0 | day net in mono 12px |
| Merchant | Spectral | 15px | 500 | 0 | reference in mono 11px |
| Category | Plex Mono | 12px | 400 | 0 | 7px square swatch |
| Date | Plex Mono | 12px | 400 | 0 | "3 Oct · 20:31" |
| Amount | Plex Mono | 15px | 500 | 0 | tabular, right, U+2212 minus |
| Balance cell | Plex Mono | 14px | 400 | 0 | tabular, `--ink-3` |
| Segmented control | Plex Mono | 12px | 500 | 0.04em | upper |

## Motion

| Thing | Trigger | Property | Duration | Easing |
| --- | --- | --- | --- | --- |
| Row | hover | background → `--sunk` | 150ms | standard |
| Segment | select | background, colour | 150ms | standard |
| Search field | focus | border `--accent`, 3px ring `rgba(29,74,60,.14)` | instant | — |

Nothing else moves. A ledger should not animate its numbers. Reduced motion: transitions drop to 1ms.

## States

- Row hover: `--sunk`, including the sticky merchant cell.
- Sort header: inactive headers show no mark; active header goes `--ink` with a brass ▲ (ascending) or ▼ (descending) at 8px.
- Segment: selected segment fills `--accent` with `--band-ink` text. Focus-visible draws a 2px brass ring inset 4px.
- Search focus: border `--accent` plus a soft 3px ring.
- Search match: `mark` with `--mark` fill and 2px radius, text colour unchanged.
- Empty: centred block, 64px vertical padding, Spectral 20px headline, a Clear search button.
- Credit: amount `--credit`, icon tile `--credit-bg`, no border. Debit: amount `--ink`, icon tile outlined `--line-2`.

## Accessibility

- `aria-sort` on each sortable `th`; the sort control is a button.
- Day headers are `th scope="colgroup"` so screen readers announce the day with each row.
- Amounts carry an `aria-label` of "Credit 42.50" or "Debit 38.20" so the sign is spoken, not just shown.
- The scroll region is focusable (`tabindex="0"`) and named by the title, so keyboard users can scroll it.
- `/` focuses search; `Escape` clears; the hint is a visible `kbd`.
- Radios are native, so arrow keys move within the direction group.
- The counter is a polite live region; it announces the result count after typing.
- Contrast: `--ink-3` on `--surface` is 5.4:1. `--credit` on `--surface` is 6.1:1. Band labels `#a9bdb3` on `#12332a` are 7.4:1.

## Responsive rules

- ≥1280: as drawn. Merchant column 34%.
- 1024: card fills the width; the table keeps a 720px minimum and the region scrolls sideways if needed.
- 720 and below: the table scrolls inside its container. Category hides, the date shows only the time (the day header already gives the day), and the table minimum drops to 440px. The merchant cell is `position: sticky; left: 0`, so the name stays pinned while Amount and Balance scroll under it. Day header text is pinned with `position: sticky; left: 16px` on an inner element. Search goes full width; the direction switch becomes three equal segments on its own row. An inset right shadow on the region hints there is more to the right.
- 375: no page overflow; Merchant, Time and Amount are visible without scrolling, Balance is one swipe away.

## Acceptance checklist

### Always

- [ ] Amounts use tabular mono figures, two decimals, U+2212 for minus, right-aligned; decimal points line up.
- [ ] Running balance is computed in date order and stays attached to its row under filtering and sorting.
- [ ] Day group headers appear only in date order; other sorts show a flat list.
- [ ] Search matches merchant, reference and category, highlights the match, and shows an empty state with a clear button.
- [ ] `/` focuses search and `Escape` clears it.
- [ ] Every sortable `th` has `aria-sort`; only one is not `none`.
- [ ] The table scrolls inside the card; the thead is sticky; the page never scrolls sideways at 375.
- [ ] Amounts have spoken labels that include credit or debit.

### This demo

- [ ] Thirteen transactions from 29 Sept to 3 Oct; opening balance 2,318.42; available 3,301.21.
- [ ] First group "Saturday 3 October · 2 items · day net +4.30".
- [ ] Counter "13 of 13 · net +982.79".
- [ ] Band `#12332a`, rows 54px, header rule 1px `--ink`.
- [ ] Searching "groc" leaves two Greenleaf Grocers rows.

## Implementation notes

Decimal alignment without a decimal-align feature. Right-align, use tabular figures, force two decimals, and keep the sign as a character so it has the same width on every row:

```js
const fmt = n => Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sgn = n => (n < 0 ? "\u2212" : "+") + fmt(n);
```

```css
.amt { font: 500 15px var(--mono); font-variant-numeric: tabular-nums; white-space: pre; }
td.num, th.num { text-align: right; }
```

Running balance is computed once, chronologically, before any sorting:

```js
let bal = opening;
const tx = raw.map(r => { bal = Math.round((bal + r.amt) * 100) / 100; return { ...r, bal }; });
```

Grouping only in date order:

```js
if (sortK !== "t") { tb.innerHTML = list.map(row).join(""); return; }
const days = {};
list.forEach(x => (days[x.t.slice(0, 10)] ??= []).push(x));
tb.innerHTML = Object.entries(days).map(([d, xs]) =>
  `<tr class="day"><th colspan="5" scope="colgroup"><div class="day-in"><b>${dayLabel(d)}</b>
   <span>${xs.length} items · day net ${sgn(xs.reduce((s, x) => s + x.amt, 0))}</span></div></th></tr>`
  + xs.map(row).join("")).join("");
```

Sticky first column inside a horizontally scrolling table needs an opaque background on the cell, or the scrolled cells show through:

```css
td.c-m { position: sticky; left: 0; background: var(--surface); }
tr.tx:hover td.c-m { background: var(--sunk); }
thead th.c-m { left: 0; z-index: 3; }   /* above both the sticky header and the sticky column */
```

Common mistakes:

- A hyphen for minus. It is narrower than the digits and breaks the alignment.
- Proportional figures in the amount column.
- Recomputing the running balance from the filtered list, which makes it wrong.
- Keeping day headers under an Amount sort; the groups no longer mean anything.
- Letting the whole page scroll sideways on a phone instead of the table region.
- Colour as the only credit/debit signal. Keep the sign and the spoken label.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
