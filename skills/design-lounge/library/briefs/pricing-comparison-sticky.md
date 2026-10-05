<!-- Design Lounge Nº 148 · "Sticky comparison table" · www.designlounge.live -->

# Sticky comparison table

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The "compare every feature" block that lives under a pricing page, here for Gantry, a fictional CI/CD service. A 300px black control rail on the left carries a condensed 74px headline ("Every limit, in writing.") and three controls; the right pane is a scrolling `<table>` whose plan header row (name, price, CTA) stays pinned while 25 feature rows in five numbered groups scroll underneath. Concrete-grey surfaces, 1px rules, mono values and one safety-orange accent make it read like a spec sheet stamped on sheet steel. The detail worth copying: a **Differences only** switch that hides every row where all four plans are equal, so the table collapses to the 21 rows that actually decide the purchase.

## Structure

```
1280 × 800
┌──────────── 300 ───────────┬───────────────────────── pane 980 (overflow:auto) ──────────────────┐
│ ⌂ GANTRY        CI/CD · v4 │ PLAN COMPARISON  │ HOBBY     │ TEAM      │▀FLEET PICK▀│ FOUNDRY   │ ← sticky
│                            │ BILLED MONTHLY   │ $0        │ $24       │ $96        │ Quote     │   180px
│ EVERY                      │ mono note        │ free…     │ per seat… │ per seat…  │ annual…   │
│ LIMIT,          74px       │                  │ [START →] │ [TRIAL →] │ [■TRIAL →] │ [TALK →]  │
│ IN              cond.      ├──────────────────┴───────────┴───────────┴────────────┴───────────┤
│ WRITING.  (orange)         │ 01 PIPELINES                                         6 items  ⌄   │ 48px
│                            ├──────────────────┬───────────┬───────────┬────────────┬───────────┤
│ mono sub 13px              │ Concurrent jobs ⓘ│ 2         │ 10        │ 40         │ Unlimited │ 44px
│                            │ Pipeline as code │ ✓         │ ✓         │ ✓          │ ✓         │
│ [Expand all][Collapse all] │ Matrix builds    │ —         │ ✓         │ ✓          │ ✓         │
│ [Differences only   ▢■]    │ …                                                                 │
│ legend ✓ — 25 GB           │ 02 COMPUTE …                                                      │
└────────────────────────────┴───────────────────────────────────────────────────────────────────┘
  feature column 340px · four plan columns share the remaining 640px (160px each)
```

- `<aside class="rail" aria-label="Comparison controls">`: brand row, `<h1>`, mono sub, `.ctrl` (two buttons + switch) pinned to the bottom with `margin-top:auto`, `.legend`.
- `<div class="pane">`: the only scroll container. Inside, one `<table>` with `table-layout:fixed`, `border-collapse:separate` (required for sticky borders), a `<colgroup>` setting the 340px feature column.
- `<thead>`: one row of five `<th scope="col">`; every plan header cell carries `data-c="1…4"`.
- One `<tbody data-g>` per group: first a `.g` row (`<td colspan="5">` holding a full-width `<button aria-expanded>`), then `.f` rows with `<th scope="row">` feature name and four `<td data-c>` cells.
- A final `<tbody>` with the footnote row (120px).
- The rail background has a 61px vertical hairline grid (`repeating-linear-gradient`, 5% white).

## Motion

| Element           | Trigger            | Property            | From → To                        | Duration | Easing   | Notes |
|-------------------|--------------------|---------------------|----------------------------------|---------:|----------|-------|
| `thead th`        | scrollTop > 4      | box-shadow          | none → `0 2px 0 orange, 0 12px 18px -14px rgba(0,0,0,.35)` | 200ms | `--ease` | class on the pane |
| `.g svg` chevron  | group toggle       | rotate              | 0 ↔ −90°                         | 280ms    | `--expo` | |
| `tr.f` reveal     | group opens        | opacity, translateY | 0, −6px → 1, 0                   | 280ms    | `--expo` | delay `k × 24ms` |
| switch knob       | Differences toggle | translateX          | 0 → 16px                         | 220ms    | `--expo` | track fills orange 140ms |
| `.tip span`       | hover / focus      | opacity, translateX | 0, −4px → 1, 0                   | 140ms    | `--ease` | |
| column tint       | hover              | background-color    | transparent → `--hov`            | 140ms    | `--ease` | |
| buttons           | hover              | background, colour  | outline → ink fill               | 140ms    | `--ease` | |

Rows hide instantly on collapse (no height animation in a table; animating `<tr>` height is unreliable). Reduced motion: transitions 1ms, animations off, `scroll-behavior:auto`.

## States

- **Pinned header:** orange 2px underline + shadow while scrolled.
- **Recommended column:** `inset 0 4px 0 orange` on its header, `--rec` tint on every cell, `PICK` tag (9px mono, orange fill), and its CTA pre-filled ink; on hover that CTA turns orange.
- **CTA hover (others):** 1px ink outline → ink fill with `--bg` text.
- **Column hover:** whole column `--hov`.
- **Group collapsed:** `aria-expanded="false"`, chevron points right, rows `display:none`.
- **Group header hover:** `#e8e6e0`.
- **Switch on:** `aria-checked="true"`, orange track, knob in `--rail` colour.
- **Focus-visible:** 2px orange outline, 2px offset, on every button including the `i` tooltips.
- **Cell kinds:** included = 18px square-capped check, 2.4px stroke; not included = 12 × 2px `--line-2` bar; limit = mono text.

## Accessibility

- A real `<table>` with a (visually hidden) `<caption>`, `scope="col"` on plan headers and `scope="row"` on feature names, so screen readers announce "Team, Concurrent jobs, 10".
- Check and dash cells carry `role="img"` and `aria-label="Included"` / `"Not included"`.
- Group toggles are `<button aria-expanded>` inside the row; Enter / Space toggles.
- The differences control is `<button role="switch" aria-checked>`.
- Tooltips: the trigger is a `<button aria-label="About Concurrent jobs">` and the bubble has `role="tooltip"`; it shows on focus as well as hover. Escape is not needed because it hides on blur.
- Contrast: `--ink` on `--bg` 15:1; `--ink-3` on `--bg` 4.6:1 (meta only); `--rail-2` on `--rail` 5.6:1.
- Tab order: rail controls, then header CTAs, then group toggles and tooltip buttons in reading order.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: rail 240px, feature column 260px, headline 72px → keep 62% width.
- 768–1023: rail becomes a 72px top bar (headline drops to 32px in one line, controls inline right); the table keeps a 220px feature column and the pane scrolls both ways; make the first column `position:sticky; left:0` too.
- < 640: swap the table for one plan at a time: a segmented plan picker pinned at top, rows show feature name + that plan's value. Keep groups and the differences switch.

## Acceptance checklist

- [ ] Only the right pane scrolls; the rail never moves.
- [ ] The plan header row is `position:sticky; top:0` on each `<th>` and stays visible through all 25 rows.
- [ ] Header gains the 2px orange underline only after the pane scrolls more than 4px.
- [ ] Fleet column is tinted top to bottom and has the 4px orange top bar.
- [ ] Each group header toggles its rows, rotates the chevron −90° and updates `aria-expanded`.
- [ ] Re-opened rows fade in with a 24ms stagger.
- [ ] Expand all / Collapse all affect all five groups.
- [ ] Differences only hides exactly the rows where all four values match (4 of 25).
- [ ] Hovering any cell tints its whole column.
- [ ] Tooltips appear on hover and on keyboard focus, 10px right of the `i`, 230px wide.
- [ ] Checks, dashes and limits are distinguishable without colour.
- [ ] Display text uses Archivo at 62% width; labels at 125%.
- [ ] No text wraps inside the 160px plan header cells at 1280 wide.
- [ ] Reduced motion leaves all behaviour working with no animation.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: all five groups expanded, pane scrolled to top, header row at the top of the pane. Fleet (the recommended plan) has a 4px orange top bar, an orange `PICK` tag and a 7% orange tint down its whole column.
2. Scroll the pane: the header row stays pinned at `top:0`. As soon as `scrollTop > 4`, the header gains a 2px orange underline plus a soft 18px shadow, so the pinned state is visible.
3. Hover any cell or header cell: its entire column tints with `rgba(18,18,18,.07)`; leaving the table clears it.
4. Click a group header ("01 PIPELINES … 6 items ⌄"): its rows hide instantly and the chevron rotates −90° over 280ms. Click again: rows return, each fading in from −6px with a 24ms stagger by row index.
5. **Expand all / Collapse all** in the rail apply the same to all five groups.
6. **Differences only** is a square switch (`role="switch"`). On: the track fills orange, the knob slides 16px, and every row whose four values are identical (4 rows: Pipeline as code, Linux x64 runners, Secrets vault, Community forum) is removed. Off: they return.
7. Hover or focus the circled `i` next to some feature names: a 230px ink tooltip with an orange 4px offset block shadow appears 10px to the right, sliding 4px over 140ms.
8. Under the last group a footnote row explains air-gapped installs and the 15% annual discount.

## Tokens

```css
:root {
  /* colour: concrete, ink, one safety orange */
  --bg: #e4e3de;          /* pane + sticky header */
  --panel: #efeee9;       /* group header rows */
  --rail: #121212;        /* left rail */
  --rail-ink: #e9e7e1;    /* rail text */
  --rail-2: #8d8b84;      /* rail meta */
  --line: #c9c7c0;        /* cell rules */
  --line-2: #b3b1a9;      /* dash glyph, tooltip ring */
  --ink: #121212;         /* text, header underline, checks */
  --ink-2: #4a4944;
  --ink-3: #6e6c66;       /* mono meta */
  --accent: #ff5b14;      /* recommended bar, switch on, sticky underline */
  --accent-ink: #121212;  /* text on orange */
  --rec: rgba(255,91,20,.07);  /* recommended column tint */
  --hov: rgba(18,18,18,.07);   /* hovered column tint */

  /* type */
  --sans: "Archivo", Helvetica, Arial, sans-serif;   /* load wdth 62..125 */
  --mono: "JetBrains Mono", ui-monospace, monospace;

  /* layout */
  --rail-w: 300px;
  --feat-w: 340px;
  --head-h: 180px;
  --row-h: 44px;
  --group-h: 48px;

  /* motion */
  --t-micro: 140ms;
  --t-row: 280ms;
  --row-stagger: 24ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

Radii: none. Every corner is square, including the switch and the tooltip ring is the only circle (18px).

## Typography

| Role             | Family         | Size   | Weight | Width (`font-stretch`) | Line-height | Tracking | Case      |
|------------------|----------------|-------:|-------:|-----------------------:|------------:|---------:|-----------|
| Rail headline    | Archivo        | 74px   | 900    | 62%                    | 0.86        | −0.01em  | UPPERCASE |
| Plan price       | Archivo        | 54px   | 900    | 62%                    | 1           | −0.01em  | —         |
| Header lead      | Archivo        | 30px   | 900    | 62%                    | 1           | 0        | UPPERCASE |
| Plan name        | Archivo        | 14px   | 800    | 125%                   | 1           | +0.06em  | UPPERCASE |
| Group title      | Archivo        | 15px   | 800    | 110%                   | 1           | +0.04em  | UPPERCASE |
| Brand            | Archivo        | 15px   | 800    | 125%                   | 1           | +0.04em  | UPPERCASE |
| Feature name     | Archivo        | 14px   | 400    | 100%                   | 1.4         | 0        | sentence  |
| Limit value      | JetBrains Mono | 12.5px | 500    | —                      | 1.4         | −0.01em  | as data   |
| Group number     | JetBrains Mono | 12px   | 700    | —                      | 1           | 0        | `01`–`05` |
| Labels / buttons | JetBrains Mono | 11px   | 500–600| —                      | 1           | +0.04–.1em | UPPERCASE |
| Tooltip          | JetBrains Mono | 12px   | 400    | —                      | 1.45        | 0        | sentence  |

The contrast between ultra-condensed 62% display and extended 125% labels from the same variable family is the whole typographic idea.

## Implementation notes

**Sticky header cells, not a sticky `<thead>`.** Put `position:sticky` on each `th`, give them an opaque background, and use separate borders, or the bottom rule scrolls away:

```css
table { border-collapse: separate; border-spacing: 0; table-layout: fixed; width: 100%; }
thead th { position: sticky; top: 0; z-index: 5; height: 180px;
           background: var(--bg); border-bottom: 1px solid var(--ink); }
.stuck thead th { box-shadow: 0 2px 0 var(--accent), 0 12px 18px -14px rgba(0,0,0,.35); }
```

**Column hover without per-cell listeners.** Tag every cell with `data-c` and let one delegated listener write the column to the table:

```js
table.addEventListener('mouseover', (e) => {
  const c = e.target.closest('[data-c]');
  table.dataset.hc = c ? c.dataset.c : '';
});
// css: table[data-hc="2"] [data-c="2"] { background-color: var(--hov); }
```

**Differences only is a data flag, not a runtime comparison.** When rendering, mark rows whose four values are identical with `.same`, then one class on the table hides them:

```js
const same = values.every((v) => v === values[0]);
row.className = 'f' + (same ? ' same' : '');
// css: .diff tr.f.same { display: none; }
```

Common mistakes: making the whole page scroll so the sticky header is relative to the window and slides under the site nav; `border-collapse: collapse` (sticky borders vanish); tooltips clipped by `overflow:hidden` on the cell; forgetting the recommended tint on the sticky header cell, which reveals the rows scrolling beneath it.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
