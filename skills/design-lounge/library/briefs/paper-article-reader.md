<!-- Design Lounge Nº 051 · "Paper article reader" · www.designlounge.live -->

# Paper article reader

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A long-read article page for *Tidewater Review*. Warm paper background, body set in Newsreader at 19px / 1.6 on a 66ch measure, a 92px drop cap on the first paragraph, an italic 30px pull quote with a 2px moss rule, a small data table, and three numbered margin notes that float into a 220px column to the right of the text when the viewport is at least 1100px wide (they fall inline below their reference otherwise). A 52px sticky header carries the masthead, section links, a percentage counter and a 2px moss progress hairline that scales with scroll. The detail worth copying is the margin note: it is placed in the paragraph immediately after its superscript, so the float lands on the same line as the reference and never drifts.

## Structure

```
1280 × 800  (scroll container fills the viewport)
┌──────────────────────────────────────────────────────────────────────────────┐
│ Tidewater Review                                 Transit  Cities  Craft  37 % │ 52  sticky
│▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ (2px progress, scaleX)           │
│                                                                              │
│      ── TRANSIT · LONG READ                                                  │
│      The paper timetable comes                                  (56px, balance)│
│      back, one ferry line at a time                                          │
│      Screens were meant to retire … (24px italic)                            │
│      ───────────────────────────────────────────────                         │
│      Ines Halvorsen · Bergen · 21 September 2026 · 14 min read               │
│      ───────────────────────────────────────────────                         │
│      T he first thing you notice …                 ┆ 1 The current sheet is  │ note: 220px,
│      ▌  … on the back.¹                            ┆   the 14th revision …   │ 40px gap
│      …                                             ┆                         │
│      ▎ "The screen was correct …"  (pull quote)    ┆                         │
│      ┌ table ───────────────────────────────┐      ┆                         │
│      └──────────────────────────────────────┘      ┆                         │
│                       ◆                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
 article width = min(66ch, 100% − 80px); at ≥1100 the column is shifted left by
 (220 + 40) / 2 = 130px so text + notes are centred as a unit.
```

- `.scroll` — `height:100%; overflow-y:auto; scroll-behavior:smooth`.
  - `<header class="bar">` — `position:sticky; top:0`; `<b>` masthead, `<nav>` links, `.pct` counter, `.progress[role="progressbar"]` absolutely positioned on the header's bottom edge.
  - `<article>` — `.kicker`, `<h1>`, `.dek`, `.byline`, paragraphs (`p.first` carries the drop cap), `<h2>`s, `blockquote.pull`, `figure.tbl` with a `<table>` and `<figcaption>`, `.end` marker.
  - Notes are `<span class="note" role="note">` placed inside the paragraph right after their `<sup>`.

## Motion

| Element       | Trigger  | Property  | From → To               | Duration | Easing  | Notes |
|---------------|----------|-----------|-------------------------|---------:|---------|-------|
| `.progress`   | scroll   | transform | `scaleX(p)`             | 80ms     | linear  | `p` recomputed on every scroll event (passive listener) |
| `.pct`        | scroll   | text      | "n %"                   | 0        | —       | tabular numerals, `min-width: 5ch` |
| `.scroll`     | anchor / keyboard | scroll position | —          | UA smooth| —       | `scroll-behavior: smooth`; `auto` under reduced motion |
| `a.ref`       | hover    | text-decoration-color | `--line` → `--accent` | 160ms | `--ease` | |
| header links  | hover    | color     | `--ink-2` → `--ink`     | 0        | —       | |

Nothing animates on load; the page is still by design.

## States

- **Header:** sticky, translucent paper with `backdrop-filter: blur(6px)` and a 1px `--line` bottom rule; the progress bar overlaps that rule (`bottom: -1px`).
- **Progress bar:** `--accent`, 2px, `transform-origin: left`; `aria-valuenow` mirrors the percentage.
- **In-text link:** underline 1px `--line`, offset 4px; hover underline `--accent`; focus-visible 2px `--accent` outline, 3px offset.
- **Margin note (≥1100):** floated right, no rule, number in `--accent`.
- **Margin note (<1100):** block, `margin: 14px 0`, 14px left padding, 2px `--line` left rule.
- **Table row:** no hover state (it is a figure, not a data grid).
- **End marker:** 8px `--accent` square rotated 45°, centred, `aria-hidden`.
- **Selection:** leave the UA default or set `::selection { background: var(--accent-soft) }`.

## Accessibility

- The reading progress element has `role="progressbar"`, `aria-label="Reading progress"`, `aria-valuemin/max/now`. The visible counter is `aria-live="off"` so it is never announced on scroll.
- Margin notes are `<span role="note">` inside the paragraph after the superscript, so screen readers hear the note right after its reference, in reading order, at every viewport width.
- Superscripts are plain text (not links) in the demo; if notes need to be reachable by keyboard, make each `<sup>` an `<a href="#n1">` and give the note an `id`.
- `<article>` contains one `<h1>`, then `<h2>`s; the pull quote is a `<blockquote>` with a `<small>` attribution; the table is a `<figure>` with `<figcaption>` and a proper `<thead>`.
- Keyboard: Tab reaches the three header links and the one in-text link; Space / arrows scroll the `.scroll` container once it or a child has focus. Give `.scroll` `tabindex="0"` if your framework prevents body focus.
- Contrast: `--ink` on paper 12.4:1; `--ink-2` 5.2:1; `--ink-3` 3.3:1 (used only for 12–13px captions and the counter); `--accent` 5.0:1 on paper.
- The drop cap is generated with `::first-letter`, so the paragraph text is unchanged for assistive tech.

## Responsive rules

- ≥ 1280: as specified. Text column 66ch (~ 690px), shifted 130px left of centre; notes 220px wide, 40px to the right.
- 1100–1279: identical; the shift still fits because 690 + 260 + 80 < 1100.
- 820–1099: notes go inline (block with left rule); column centred at 66ch.
- < 820: body 17px, title 40px, header padding 20px, section nav hidden, column `100% − 80px`.
- < 480: side padding 20px (`width: 100% − 40px`), drop cap 72px, pull quote 24px.

## Acceptance checklist

- [ ] Page background `#f7f2e8`; body text `#2a2420` in Newsreader at 19px with line-height 1.6.
- [ ] Article column is exactly `min(66ch, 100% − 80px)` wide.
- [ ] At ≥ 1100px the column is offset 130px left of centre and margin notes float into a 220px column with a 40px gap; at < 1100px notes render inline with a 2px left rule.
- [ ] Each margin note's top aligns within ±4px with the line containing its superscript.
- [ ] Drop cap is 92px, spans four lines, with `margin: 6px 10px 0 -2px`.
- [ ] Title is 56px/1.05 with `text-wrap: balance`; dek is 24px italic in `#6b625a`.
- [ ] Pull quote is 30px italic with a 2px `#4a6b45` left rule and 28px padding.
- [ ] Sticky header is 52px, translucent (`rgba(247,242,232,.92)` + 6px blur) with a 1px `#dcd3c3` rule.
- [ ] Progress hairline is 2px `#4a6b45`, scales from 0 to 1 with scroll, and `aria-valuenow` plus the "n %" counter track it.
- [ ] Counter uses tabular figures and does not shift the header layout between "0 %" and "100 %".
- [ ] In-text link underline is 1px `#dcd3c3` at 4px offset and turns `#4a6b45` on hover.
- [ ] Table headers are 12px uppercase with a 1px `#2a2420` rule; numeric cells are right-aligned tabular.
- [ ] No animation runs on load; reduced motion disables smooth scroll.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: header at top with "0 %", progress bar at `scaleX(0)`; kicker, 56px title, italic dek, byline rule, then the article. Note 1 sits in the right margin level with the line that contains superscript 1.
2. Scroll the article (the scroll container is a full-height `div`, not the window): the header stays fixed at the top with a 92% paper, 6px blur backdrop; the progress bar's `scaleX` equals `scrollTop / (scrollHeight − clientHeight)`; the counter shows the rounded percentage with tabular figures.
3. Hover a section link in the header: colour `--ink-2` → `--ink`.
4. Hover the in-text link: its underline colour changes from `--line` to `--accent` over 160ms.
5. At the end, a small 8px rotated square marks the article end; progress reads "100 %".
6. Resize below 1100px: notes leave the margin and render as indented blocks (2px left rule) directly after the sentence that references them.
7. Reduced motion: smooth scrolling off; the progress bar still updates (transition 1ms).

## Tokens

```css
:root {
  /* colour — warm paper, warm near-black, moss accent */
  --paper:       #f7f2e8;  /* page */
  --paper-2:     #efe8da;  /* reserved: table band / hover */
  --ink:         #2a2420;  /* body, headings */
  --ink-2:       #6b625a;  /* dek, byline, notes, header links */
  --ink-3:       #9a9086;  /* captions, counter, table heads */
  --line:        #dcd3c3;  /* rules, link underline, note rule */
  --accent:      #4a6b45;  /* kicker, superscripts, pull-quote rule, progress bar, focus ring */
  --accent-soft: #e4e9df;  /* reserved: selection / highlight */
  --bar-bg:      rgba(247, 242, 232, .92);

  /* type */
  --serif: "Newsreader", Georgia, serif;   /* variable opsz: 18 body, 36 h2/pull, 72 h1/drop cap */
  --sans:  "Public Sans", system-ui, sans-serif;
  --body-size: 19px;    /* 17 ≤820 */
  --body-lh: 1.6;
  --measure: 66ch;

  /* layout */
  --bar-h: 52px;
  --progress-h: 2px;
  --note-w: 220px;
  --note-gap: 40px;
  --article-pad: 64px 0 96px;
  --side-pad: 40px;

  /* motion */
  --t-micro: 160ms;
  --t-progress: 80ms;   /* linear; keeps the bar from lagging the scroll */
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role          | Family     | Size | Weight | Line-height | Tracking | Notes |
|---------------|------------|-----:|-------:|------------:|---------:|-------|
| Body          | Newsreader | 19px | 400    | 1.6         | 0        | `font-variation-settings: "opsz" 18`; paragraphs `margin-bottom: 1.35em` |
| Drop cap      | Newsreader | 92px | 400    | 0.78        | 0        | opsz 72, `float:left; margin: 6px 10px 0 -2px` (spans 4 lines) |
| Title         | Newsreader | 56px | 400    | 1.05        | −0.02em  | opsz 72, `text-wrap: balance` |
| Dek           | Newsreader italic | 24px | 400 | 1.35    | 0        | `--ink-2` |
| H2            | Newsreader | 26px | 500    | 1.2         | −0.01em  | opsz 36, `margin: 2.2em 0 .7em` |
| Pull quote    | Newsreader italic | 30px | 400 | 1.3     | −0.01em  | opsz 36, 2px `--accent` left rule, 28px left padding |
| Pull quote attribution | Public Sans | 13px | 400 | 1.4 | 0     | `--ink-3` |
| Kicker        | Public Sans | 12px | 500   | 1           | +0.14em  | UPPERCASE, `--accent`, 24px rule before |
| Byline        | Public Sans | 13px | 400 (name 500) | 1.4 | 0  | dots between items |
| Masthead      | Newsreader | 15px | 500    | 1           | −0.01em  | |
| Header links / counter | Public Sans | 13px | 400 | 1     | 0        | counter tabular, `--ink-3` |
| Superscript   | Public Sans | 11px | 500    | 1           | 0        | `--accent`, `vertical-align: top` |
| Margin note   | Public Sans | 14px | 400 (number 500) | 1.45 | 0 | `--ink-2`; number in `--accent` |
| Table head    | Public Sans | 12px | 500    | 1.3         | +0.06em  | UPPERCASE, `--ink-3`, 1px `--ink` bottom rule |
| Table cells   | Public Sans | 14px | 400    | 1.4         | 0        | tabular numerals, 1px `--line` rules |
| Figcaption    | Public Sans | 12px | 400    | 1.4         | 0        | `--ink-3` |

## Implementation notes

**Margin note anchored to its reference.** Put the note inside the paragraph, right after the superscript, and float it. The negative right margin pushes it out of the column without affecting the measure:

```css
.note { display: block; font: 14px/1.45 var(--sans); color: var(--ink-2);
        margin: 14px 0; padding-left: 14px; border-left: 2px solid var(--line); }
@media (min-width: 1100px) {
  article { margin-left: calc(50% - var(--measure) / 2 - (var(--note-w) + var(--note-gap)) / 2); }
  .note { float: right; clear: right; width: var(--note-w); padding-left: 0; border-left: 0;
          margin: 2px calc(-1 * (var(--note-w) + var(--note-gap))) 0 0; }
}
```

```html
<p>… folded once so the return trips sit on the back.<sup>1</sup>
<span class="note" role="note"><b>1</b>The current sheet is the 14th revision since March.</span></p>
```

`clear: right` stacks consecutive notes instead of letting them overlap.

**Progress bar from a scroll container**, not `window`, because the page is a fixed-height frame:

```js
const sc = document.getElementById('scroll'), bar = document.getElementById('progress'), pct = document.getElementById('pct');
function update() {
  const max = sc.scrollHeight - sc.clientHeight, p = max > 0 ? Math.min(1, sc.scrollTop / max) : 0;
  bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  const n = Math.round(p * 100); bar.setAttribute('aria-valuenow', n); pct.textContent = n + ' %';
}
sc.addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
```

**Drop cap that lines up on the fourth line:** size = roughly 4 × line-height × body size × 0.75; then nudge with `margin-top`. Check against the descender of line 4, not the baseline of line 1.

Common mistakes: putting the note after the paragraph (it floats below, not beside); animating `width` on the progress bar (use `transform: scaleX`); setting `line-height` on `::first-letter` above 1 (the cap floats too low); using `position: fixed` for the header inside a scroll container (it pins to the viewport, not the column).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
