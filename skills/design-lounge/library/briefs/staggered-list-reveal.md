<!-- Design Lounge Nº 065 · "Staggered list reveal" · www.designlounge.live -->

# Staggered list reveal

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A transactions list for a personal banking account ("Fjord Bank"): 12 rows of date, payee, category tag and a monospaced amount, under a heading and a filter input. On load the rows arrive one after another — each slides up 14px and fades in over 500ms with expo-out easing, 30ms apart, so the whole list lands in about 830ms. Typing in the filter is the interesting part: rows that no longer match fade out and lift 8px over 180ms, *then* the surviving rows re-run the staggered entrance with fresh indices, so the list always reads as one gesture rather than a jump cut. The detail worth copying is the two-phase filter: exit first, wait for it, then hide and re-stagger.

## Structure

```
1280 × 800  (content column 880px, centred; 32px top padding)
┌───────────────────────────────────────────────────────────────────────┐
│           Transactions                         [ o Filter by payee…  / ]│ head
│           12 of 12 · September 2026 · Fjord Bank current account      │
│           ┌─────────────────────────────────────────────────────────┐ │
│           │ DATE     PAYEE                 CATEGORY        AMOUNT   │ │ cols 40
│           │ 28 Sep   [NP] Nord Post        (Subscription)  −NOK 49.00│ │ row 48
│           │          Newsletters                                     │ │
│           │ 27 Sep   [ME] Meny Grünerløkka (Groceries)  −NOK 612.40  │ │
│           │ …  ×12                                                   │ │
│           └─────────────────────────────────────────────────────────┘ │
│           Net +NOK 32,588.40 this month     Rows animate in with a 30 ms stagger │ foot
└───────────────────────────────────────────────────────────────────────┘
grid columns: 110px | 1fr | 160px | 130px, gap 16px, padding 0 20px
```

- `.wrap` — 880px wide, flex column, `padding: 32px 0`.
- `.head` — flex, `align-items: flex-end`, `space-between`. `<h1>` + `<p>` with a `<b id="count">`. `<label class="search">` wrapping a visually hidden label text, a 16px SVG magnifier, `<input type="search">`, and a `<kbd>/</kbd>`.
- `.list` — white card, 1px border, 12px radius, `overflow: hidden`.
  - `.cols` — `aria-hidden` header row, 40px tall, mono uppercase 11px.
  - `<ul id="rows" aria-live="polite" aria-label="Transactions">` of `<li class="row">` each with: `.date` (mono), `.payee` (28px initials tile + name + `<small>` memo), `.tag` pill, `.amt` (mono, `.pos` for credits).
  - `.empty` — hidden by default; `display: block` with class `show`.
- `.foot` — mono 12px, space-between.

Row data (date · payee · category · memo · amount NOK):

```
28 Sep · Nord Post          · Subscription · Newsletters     ·   −49.00
27 Sep · Meny Grünerløkka   · Groceries    · Card 4471       ·  −612.40
26 Sep · Halden Hotel       · Travel       · Two nights      · −4800.00
25 Sep · Loam Studio AS     · Salary       · Sept payroll    · +42350.00
24 Sep · Vy Tog             · Travel       · Oslo → Bergen   ·  −899.00
23 Sep · Tessel Type        · Software     · Font licence    ·  −540.00
22 Sep · Kaffebrenneriet    · Groceries    · Card 4471       ·   −58.00
21 Sep · Orbital Cloud      · Software     · eu-1 usage      · −1240.20
20 Sep · Marrow             · Software     · Team plan       ·  −480.00
19 Sep · Mira Refund        · Refund       · Order 8813      ·  +360.00
18 Sep · Rema 1000          · Groceries    · Card 4471       · −1123.00
17 Sep · Fjord Bank         · Fees         · Card fee        ·  −320.00
```

Amounts render as `−NOK 1,240.20` / `+NOK 360.00` (U+2212 minus, `en` locale grouping, two decimals). Initials tile = first two letters of the payee, uppercase.

## Motion

| Element       | Trigger                   | Property            | From → To          | Duration | Easing       | Delay |
|---------------|---------------------------|---------------------|--------------------|---------:|--------------|-------|
| `.row.in`     | load / filter settle      | opacity, translateY | 0, 14px → 1, 0     | 500ms    | `--ease-out` | `i × 30ms` (i = index among visible rows) |
| `.row.out`    | row stops matching        | opacity, translateY | 1, 0 → 0, −8px     | 180ms    | `--ease`     | 0 |
| `.empty.show` | zero matches              | opacity, translateY | 0, 14px → 1, 0     | 500ms    | `--ease-out` | 0 |
| `input`       | focus                     | border-color, box-shadow | `--line` → `--accent`, 0 → `0 0 0 3px var(--accent-soft)` | 140ms | linear | 0 |
| `.row`        | hover                     | background          | transparent → `--bg` | 0      | —            | instant |

Filter timeline for typing "gro" into a full list (3 matches, 9 leaving):

| t (ms) | Event |
|-------:|-------|
| 0      | count reads "3 of 12"; 9 rows start the 180ms exit |
| 180    | 9 rows get `hidden`; 3 survivors re-indexed 0–2 and restarted |
| 180 / 210 / 240 | survivors start their 500ms entrance |
| 740    | last survivor lands |

Both row animations use `animation-fill-mode: forwards`, and the base `.row` style is the hidden state (opacity 0, translateY 14px) so a row without a class is invisible — never partially shown.

Reduced motion: `animation-duration: 1ms; animation-delay: 0ms` on `.in`, `.out` and `.empty.show`.

## States

- **Row hover:** background `--bg`.
- **Input focus-visible:** border `--accent`, 3px `--accent-soft` halo. Placeholder `--ink-3`.
- **Credit amount:** `.pos`, colour `--pos`, leading `+`. Debit: `--ink`, leading `−`.
- **Filtered:** subtitle count reflects matches; hidden rows have the `hidden` attribute (`display: none`).
- **Empty:** `.empty.show` visible inside the card, 48px vertical padding, centred, with the query in bold.
- **Loading / error:** not part of this piece.

## Accessibility

- The input has a visually hidden `<span>` label inside its `<label>` ("Filter transactions"); the placeholder is not the label.
- `<ul aria-live="polite" aria-label="Transactions">` — screen readers announce changes as rows are hidden/shown. If this is too chatty in your stack, move `aria-live` to the count element ("4 of 12") instead.
- The column header row is `aria-hidden="true"`; if you need a real table, use `<table>` with `<th scope="col">` and apply the same animations to `<tr>` (use `display: grid` on rows only if your table semantics survive it — otherwise animate `<td>` contents).
- Keyboard: Tab → input. `/` focuses the input from anywhere (guard `e.preventDefault()` so the browser's quick-find doesn't open). `Escape` clears a non-empty input. Rows are not focusable (no actions on them here); if you add row actions, make each row a link or button with a 48px hit area.
- Contrast: `--ink-2` on white 5.6:1; `--ink-3` 3.1:1 (11–12px meta and column headers only). `--pos` on white 5.1:1.
- Amounts use tabular figures by default in IBM Plex Mono; set `font-variant-numeric: tabular-nums` if you substitute a proportional font.

## Responsive rules

- ≥ 1280: 880px column, centred, as specified.
- 1024–1279: column becomes `calc(100% − 96px)`; grid unchanged.
- 768–1023: grid `90px 1fr 120px 120px`; memo line hidden; search width 240px.
- < 640: head stacks (search below heading, full width); grid `1fr auto` with date and tag folded into the memo line as "28 Sep · Subscription"; row height 56px; stagger stays 30ms but entrance offset drops to 10px.

## Acceptance checklist

- [ ] On load 12 rows enter with opacity 0→1 and translateY 14px→0 over 500ms, `cubic-bezier(.16,1,.3,1)`, row *i* delayed `i × 30ms`.
- [ ] Rows have no hidden-state flash: before their animation starts they are already at opacity 0 (base style, not JS).
- [ ] Filtering removes non-matching rows with a 180ms fade + 8px lift **before** they are `display: none`.
- [ ] After exits complete, surviving rows re-run the entrance with indices re-based to 0 in DOM order (the first visible row has 0ms delay).
- [ ] Filtering with no leaving rows (e.g. deleting characters) re-staggers immediately, no 180ms wait.
- [ ] Rapid typing never leaves a row stuck at opacity 0 or half-exited (pending timer cleared per input).
- [ ] Zero matches shows the empty message with the query in bold inside the card.
- [ ] Count in the subtitle updates on every input event.
- [ ] `/` focuses the input; `Escape` clears it and restores all 12 rows with the stagger.
- [ ] Input focus shows a `--accent` border and a 3px `--accent-soft` halo.
- [ ] Amounts are monospaced, right-aligned, with U+2212 minus and thousands grouping; credits are green with `+`.
- [ ] Rows are 48px tall and the whole list fits in 800px with 32px top padding.
- [ ] Reduced motion: animations are 1ms with no delay; filtering still works identically.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: heading "Transactions" with a subtitle "12 of 12 · September 2026 · Fjord Bank current account", a 300px search input on the right with a `/` keycap hint, and a white card with a column header row (Date / Payee / Category / Amount) and 12 rows. On first paint all rows are at opacity 0, `translateY(14px)`.
2. t = 0: row *i* (0–11) starts its entrance at `i × 30ms`: opacity 0 → 1, translateY 14px → 0, 500ms, `cubic-bezier(.16,1,.3,1)`, `animation-fill-mode: forwards`. Row 11 completes at 330 + 500 = 830ms.
3. Hover a row: background changes to `--bg` (the page colour), no motion.
4. Type in the input (each `input` event): matching is case-insensitive substring over payee, category and the small memo line. Rows currently visible that no longer match get class `out` (opacity → 0, translateY → −8px, 180ms, `cubic-bezier(.2,.7,.2,1)`, forwards). The count in the subtitle updates immediately ("4 of 12").
5. 180ms later (or immediately if nothing is leaving): non-matching rows get `hidden`; every matching row is re-indexed from 0 in DOM order, its `in` class is removed and re-added after a forced reflow, so the survivors replay the staggered entrance from step 2.
6. If nothing matches: after the exits, an empty message shows inside the card ("No transactions match “xyz”. Try a payee name or a category like “Groceries”.") with the same 500ms entrance.
7. Press `/` anywhere (when the input isn't focused): focus the input. Press `Escape` in the input when it has a value: clear it and re-run the filter; all 12 rows re-enter with the stagger.
8. Fast typing: a pending 180ms timer is cleared on every input so exits never double-fire; rows mid-exit that match again are simply re-revealed.
9. The footer shows the computed net for the month ("Net +NOK 32,588.40 this month") and a caption; neither animates.
10. With `prefers-reduced-motion: reduce`: entrance and exit run in 1ms with 0 delay; the filter still goes through the same two phases, so behaviour is unchanged.

## Tokens

```css
:root {
  /* colour — warm off-white, white card, near-black ink, one blue accent, green credits */
  --bg: #faf9f6;          /* page + row hover + tag fill */
  --surface: #ffffff;     /* card, input */
  --line: #e8e5de;        /* borders */
  --line-2: #f1efe9;      /* row separators, initials tile */
  --ink: #1a1917;         /* primary text, debit amounts */
  --ink-2: #6b675f;       /* dates, tags, subtitle */
  --ink-3: #9c978d;       /* column headers, memo, placeholder, kbd */
  --accent: #2a5bd7;      /* focus border */
  --accent-soft: #e8eefc; /* focus halo */
  --pos: #1f7a4d;         /* credit amounts */

  /* type */
  --sans: "Space Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;

  /* layout */
  --wrap-w: 880px;
  --row-h: 48px;
  --cols-h: 40px;
  --grid: 110px 1fr 160px 130px;
  --r: 10px;              /* input */
  --r-card: 12px;
  --r-tile: 7px;

  /* motion */
  --t-in: 500ms;
  --t-out: 180ms;
  --stagger: 30ms;
  --t-micro: 140ms;
  --rise: 14px;           /* entrance offset */
  --lift: 8px;            /* exit offset */
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role            | Family        | Size | Weight | Line-height | Tracking | Case      |
|-----------------|---------------|-----:|-------:|------------:|---------:|-----------|
| Heading         | Space Grotesk | 24px | 600    | 1.2         | −0.02em  | sentence  |
| Subtitle        | Space Grotesk | 13px | 400    | 1.45        | 0        | sentence  |
| Count           | IBM Plex Mono | 13px | 500    | 1.45        | 0        | numerals  |
| Input           | Space Grotesk | 14px | 400    | 40px box    | 0        | sentence  |
| Column header   | IBM Plex Mono | 11px | 500    | 40px box    | +0.08em  | UPPERCASE |
| Date            | IBM Plex Mono | 13px | 400    | 1.45        | 0        | sentence  |
| Payee           | Space Grotesk | 14px | 500    | 1.3         | 0        | sentence  |
| Memo            | Space Grotesk | 12px | 400    | 1.3         | 0        | sentence  |
| Initials tile   | IBM Plex Mono | 11px | 500    | 28px box    | 0        | UPPERCASE |
| Tag             | IBM Plex Mono | 11px | 500    | 1.4         | +0.04em  | sentence  |
| Amount          | IBM Plex Mono | 15px | 500    | 1.45        | −0.01em  | numerals  |
| Footer          | IBM Plex Mono | 12px | 400    | 1.45        | 0        | sentence  |

## Implementation notes

**Two-phase filter.** Exit first, then hide and re-reveal. Re-base the index each time so the stagger always starts at 0 for the first visible row:

```js
function reveal(list) {
  list.forEach((r, i) => {
    r.hidden = false; r.classList.remove('out', 'in');
    r.style.setProperty('--i', i);
    void r.offsetWidth;                 // restart the CSS animation
    r.classList.add('in');
  });
}
let pending;
function filter() {
  const s = q.value.trim().toLowerCase();
  const keep = rows.filter((r, i) => !s || haystack[i].includes(s));
  const leaving = rows.filter(r => !r.hidden && !keep.includes(r));
  leaving.forEach(r => { r.classList.remove('in'); r.classList.add('out'); });
  clearTimeout(pending);
  pending = setTimeout(() => {
    rows.forEach(r => { if (!keep.includes(r)) r.hidden = true; });
    reveal(keep);
  }, leaving.length ? 180 : 0);
}
```

**Hidden is the default.** Put the invisible state on the base selector and let the keyframe fill forwards; that way a row is never visible without having animated in:

```css
.row { opacity: 0; transform: translateY(var(--rise)); }
.row.in  { animation: in  var(--t-in)  var(--ease-out) forwards; animation-delay: calc(var(--i) * var(--stagger)); }
.row.out { animation: out var(--t-out) var(--ease)     forwards; }
@keyframes in  { to { opacity: 1; transform: none; } }
@keyframes out { to { opacity: 0; transform: translateY(calc(-1 * var(--lift))); } }
```

**Slash shortcut** — only when the input isn't already focused, and stop the browser's own quick-find:

```js
addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== q) { e.preventDefault(); q.focus(); }
});
```

Common mistakes: using `transition` instead of `animation` (you can't re-trigger it on re-filter without toggling classes twice); forgetting the forced reflow so the animation doesn't restart; setting `display: none` at the same time as the exit class (nothing animates); computing the stagger from the row's original index (later rows wait for rows that are hidden).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
