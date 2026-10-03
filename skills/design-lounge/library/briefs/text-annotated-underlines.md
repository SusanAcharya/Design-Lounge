<!-- Design Lounge Nº 261 · "Hand-drawn text annotations" · designlounge.vercel.app -->

# Hand-drawn text annotations

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

An essay page from a small reading magazine, "Marginalia", where someone has been at the text with a pen. Six kinds of mark draw themselves onto the paragraph as it scrolls into view: a blue double underline, a red loose circle, a mint highlighter bar, a red strike-through, a blue bracket beside a pull quote, and a red arrow from a handwritten margin note to the word it is about. A picker on the left replays any single mark, hovering a picker item dims the other five, and number keys 1–6 do the same. Every path is generated from the live text box with a little seeded jitter, so the marks fit any font, size, or line break and look slightly different each replay. The thing worth copying is that the marks are measured, not hand-placed: one overlay SVG, one function per mark, and `stroke-dashoffset` to draw.

## Reference behaviour

1. On load, after `document.fonts.ready`, each annotated phrase is observed with an IntersectionObserver (`rootMargin: 0px 0px -12% 0px`).
2. Marks that enter the view together draw in reading order: underline, circle, highlight, strike, arrow, bracket, starting 250ms after entering and staggered 380ms. Each mark draws once on scroll.
3. Underline: a blue stroke slightly bowed under "left no mark at all", then a shorter return stroke 5–8px lower, right to left. 620ms for the first stroke, 180ms for the second.
4. Circle: a red loop around "embarrassingly", starting at the upper left, going clockwise past its start by about 25° and lifting 3px at the end so it does not close neatly. 820ms.
5. Highlight: a mint bar, 78% of the line height thick, butt caps, `mix-blend-mode: multiply`, from 5px before to 6px after "write back to the page", sloping 2px upward. 520ms. It sits beneath the other marks.
6. Strike: a red line across "nod along politely" at 56% of the line height, then a second, shorter stroke back. 460ms + 180ms.
7. Arrow: from the left edge of the red margin note "this is the whole essay" in a cubic curve to just under the word "answer", then a two-stroke arrowhead (12px, ±0.5 rad from the curve's end tangent). 720ms + 180ms.
8. Bracket: a blue "[" 14px left of the pull quote, with curled ends. 700ms.
9. Picker click (or key 1–6): that mark is regenerated with a new seed and draws again from zero. The live region says "Redrawing circle".
10. Picker hover or focus: every other mark fades to 18% opacity in 200ms; leaving restores them. A mark being redrawn while hovered keeps full opacity.
11. "Replay all" redraws all six with the 380ms stagger.
12. On resize, every drawn mark is rebuilt to the new text positions instantly, without animating.
13. At ≥ 1181px the margin notes are pinned beside their lines (the blue "ha. guilty." next to the strike, the red note 64px below "answer"). Below that they flow under their paragraphs, right-aligned, and the arrow still connects.
14. Reduced motion: marks appear complete, with no drawing; replay re-renders instantly.

## Structure

```
1280 × 800, paper #f3ecdf with a 4px dot grain
┌────────────────────────────────────────────────────────────────────────┐
│ Marginalia (italic 26px)                    ISSUE 12 · ON READING SLOWLY│ 1px rule
├───────────────┬──────────────────────────────────────┬─────────────────┤
│ REPLAY A MARK │ ESSAY                                 │                 │
│ ─ Underline 1 │ Read with a pen in your hand   50px   │                 │
│ ◯ Circle    2 │ standfirst, italic 21px               │                 │
│ ▬ Highlight 3 │ Most of what … left no mark at all.   │                 │
│ ─ Strike    4 │ … (embarrassingly) simple: ▓write▓    │ ha. guilty.     │
│ [ Bracket   5 │ A margin … ~~nod along politely~~ …   │                 │
│ ↗ Arrow     6 │ … its answer six lines down ↖─────────│ this is the     │
│ (↻ Replay all)│ [ A book you have written in …        │ whole essay     │
│  200px sticky │   DOROTHEA VENN, 1931                 │  200px notes    │
│               │ byline 13px                           │                 │
├───────────────┴──────────── max 620px ────────────────┴─────────────────┤
     grid: 200px | minmax(0,620px) | 200px, gap 56px, centred, max 1160px
```

- `header.mast`: wordmark and issue line, `border-bottom: 1px solid --line`.
- `nav.picker[aria-label="Annotation picker"]`: `h2`, a `ul` of six `button.pick` (each with a 40×24 preview SVG of its mark, a Kalam label, and a `kbd` number), and `button.replay`.
- `article#page` (`position: relative`): kicker, `h1`, standfirst, two `p.body` with `span.an[data-k]` around each phrase (`white-space: nowrap`), a `blockquote[data-k=bracket]` with `cite`, two `p.note` (decorative, `aria-hidden`), the byline, and `svg.ink` absolutely covering the article (`inset: 0`, `overflow: visible`, `pointer-events: none`).

Copy:

- H1 "Read with a pen in your hand". Standfirst "The page is not a screen. It can take a mark, and it remembers it."
- P1: "Most of what we read slides past. We nod, turn the page, and by evening the argument has [left no mark at all]. The fix is old and almost [embarrassingly] simple: [write back to the page]."
- P2: "A margin is a conversation. You [nod along politely] argue. You circle the word you will look up on the bus. You draw a line from a doubt in paragraph two to its [answer] six lines down, and the book becomes a map of your attention."
- Quote: "A book you have written in is a book you have actually read." — Dorothea Venn, 1931. Byline: "Words by Tomas Ilve · 6 min read · Pencil recommended, pen preferred".

## Tokens

```css
:root {
  /* colour */
  --paper: #f3ecdf;    /* page */
  --paper-2: #ebe2d1;  /* picker hover */
  --ink: #1f1d1a;      /* text */
  --ink-2: #5d574d;    /* standfirst, captions, byline */
  --line: #d8cdb8;     /* rules, kbd border */
  --blue: #2346b8;     /* underline, bracket, note "ha. guilty." */
  --red: #cf3a25;      /* circle, strike, arrow, kicker, arrow note */
  --mint: #7fd9ad;     /* highlighter, multiply */

  /* type */
  --serif: "Literata", Georgia, serif;           /* opsz 7–72 */
  --hand: "Kalam", "Comic Sans MS", cursive;

  /* strokes */
  --pen: 2.2px;        /* circle, arrow */
  --pen-firm: 2.4px;   /* underline, strike, bracket */
  --marker: .78;       /* highlight thickness × line height */

  /* space */
  --s1: 4px; --s2: 8px; --s3: 14px; --s4: 20px; --s5: 26px; --s6: 36px; --s7: 56px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --draw: cubic-bezier(.45, .05, .25, 1);   /* a hand speeds up mid-stroke */
  --stagger: 380ms; --dim: 200ms;
}
```

Per-mark durations: underline 620ms, circle 820ms, highlight 520ms, strike 460ms, bracket 700ms, arrow 720ms. Any second stroke (return line, arrowhead) is 180ms and starts when the first ends.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Style |
|------|--------|-----:|-------:|------------:|---------:|-------|
| Wordmark | Literata | 26px | 400 | 1 | -0.01em | italic |
| Issue line, picker heading, kicker, cite | Literata | 11–12px | 600 | 1 | 0.14–0.16em | UPPER |
| H1 | Literata | 50px | 400 | 1.04 | -0.02em | roman |
| Standfirst | Literata | 21px | 400 | 1.45 | 0 | italic, `--ink-2` |
| Body | Literata | 19px | 400 | 1.65 | 0 | roman, max 62ch |
| Pull quote | Literata | 24px | 400 | 1.4 | 0 | italic, max 30ch |
| Margin notes | Kalam | 19px | 400 | 1.25 | 0 | rotated −3° / +2° |
| Picker labels | Kalam | 17px | 400 | 1 | 0 | – |
| Byline | Literata | 13px | 400 | 1.5 | 0 | `--ink-2` |

The hand face appears only where a hand would: notes and picker labels.

## Motion

| Mark | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|------|---------|----------|-----------|---------:|--------|----------------|
| All six | enter view (once), picker, key 1–6, Replay all | stroke-dashoffset | path length → 0 | see Tokens | `--draw` | drawn instantly |
| Second strokes | after first stroke | stroke-dashoffset | length → 0 | 180ms | `--draw` | instant |
| Scroll batch | same IntersectionObserver callback | delay | 250ms + i × 380ms | – | – | none |
| Others when picking | picker hover / focus | opacity | 1 → 0.18 | 200ms | `--ease` | instant |
| Picker / Replay buttons | hover | background | – | 160ms | `--ease` | instant |

Set `stroke-dasharray` and `stroke-dashoffset` to the path length + 2, force a layout read, then set the transition and drop the offset to 0.

## States

- **Undrawn:** the phrase is plain text; no path exists yet.
- **Drawing:** path transitions from hidden to full.
- **Drawn:** path present; rebuilt silently on resize.
- **Focused mark:** picker hover/focus adds `.dim` to the SVG and `.on` to that mark's paths; non-`.on` paths drop to 18%.
- **Picker item hover/focus:** `--paper-2` background; focus ring 2px blue, 3px offset.
- **Replay all hover:** fills ink with paper text.
- **Narrow layout:** picker becomes a wrapping row of bordered chips; kbd hints hidden.
- **Empty / error:** not applicable. If a target phrase is missing, skip its mark and leave its picker button disabled.

## Accessibility

- The marks are decoration over real text; the SVG is `aria-hidden`. Emphasis that matters to meaning should also be in the markup (`<em>`, `<mark>`, `<del>`) in a real article; the visual layer is extra.
- Margin notes are `aria-hidden` here because they repeat editorial voice; if a note carries content, drop `aria-hidden` and associate it with `aria-describedby` on its phrase.
- Picker buttons have explicit labels ("Replay underline", "Replay strike-through"). Preview SVGs are `aria-hidden`.
- Keys 1–6 replay marks (ignored with modifier keys and inside form fields). Tab order: picker items, Replay all, then the article.
- A polite status region announces each replay.
- Contrast: ink on paper 15:1, `--ink-2` 6.4:1, red kicker 4.6:1, blue note 7.6:1. The mint marker under ink keeps the text at 12:1 because of `multiply`.
- Hit targets: picker rows 40px, Replay all 40px.

## Responsive rules

- **≥ 1181:** three columns as drawn; notes pinned beside their lines by JS (`top` = phrase top − 4px for the strike note, + 64px for the arrow note).
- **861–1180:** two columns (180px picker, article up to 620px). Notes become static blocks under their paragraphs, right-aligned, max 240px.
- **≤ 860 (check 375):** one column, padding 24px 20px. Picker is a wrapping chip row above the article. H1 38px, body 18px, quote 21px with a 16px left margin so the bracket fits. Annotated phrases are short and `nowrap`, so they never split across lines; nothing scrolls sideways.
- Any width: a ResizeObserver on the article rebuilds paths so marks stay glued to the words.

## Acceptance checklist

### Always

- [ ] One absolutely positioned SVG overlay inside a `position: relative` article holds every mark.
- [ ] Each mark is computed from the phrase's measured box (Range rect for inline text, element rect for blocks), not from fixed coordinates.
- [ ] Six mark types: underline, circle, highlight, strike, bracket, arrow; each with its own colour and stroke.
- [ ] The highlight uses `mix-blend-mode: multiply` and sits beneath the other marks.
- [ ] Marks draw with `stroke-dashoffset` on first scroll into view, in reading order, staggered.
- [ ] Each picker item replays its mark with fresh jitter, and hovering it dims the others.
- [ ] Number keys 1–6 and Replay all work; a live region announces replays.
- [ ] Resize rebuilds marks instantly.
- [ ] Reduced motion shows finished marks.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Blue `#2346b8` underline and bracket, red `#cf3a25` circle, strike and arrow, mint `#7fd9ad` marker.
- [ ] Phrases: "left no mark at all", "embarrassingly", "write back to the page", "nod along politely", "answer", and the Dorothea Venn quote.
- [ ] Draw durations 620 / 820 / 520 / 460 / 700 / 720ms; stagger 380ms.
- [ ] Literata body 19px/1.65 on `#f3ecdf`; notes in Kalam 19px.

## Implementation notes

**Measure the words, not the span.** For inline phrases use a Range so padding and line-height do not leak in:

```js
function textRect(el) {
  const range = document.createRange(); range.selectNodeContents(el);
  const p = page.getBoundingClientRect(), r = range.getBoundingClientRect();
  return { x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height };
}
const rnd = seed => () => ((seed = (seed * 16807) % 2147483647) / 2147483647); // jitter
```

**A circle that overshoots.** Sample an ellipse from −200° to 185° every 30°, wobble the radius ±4%, push the tail out 6% and up 3px, then smooth with Catmull-Rom:

```js
circle(r, j) {
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2, rx = r.w / 2 + 9, ry = r.h / 2 + 5, pts = [];
  for (let a = -200; a <= 185; a += 30) {
    const t = a * Math.PI / 180, k = 1 + (j() - .5) * .08 + (a > 150 ? .06 : 0);
    pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k - (a > 120 ? 3 : 0)]);
  }
  return [smooth(pts)];   // Catmull-Rom → cubic Béziers
}
```

**Draw any path, including multi-stroke marks:**

```js
let t = delay;
paths.forEach((p, i) => {
  const len = p.getTotalLength() + 2, dur = i ? 180 : style.d;
  p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
  p.getBoundingClientRect();                    // commit the hidden state
  p.style.transition = `stroke-dashoffset ${dur}ms var(--draw) ${t}ms`;
  p.style.strokeDashoffset = 0;
  t += dur;
});
```

Common mistakes:

- Drawing on load before web fonts arrive. Wait for `document.fonts.ready`, or every mark lands in the fallback font's position.
- Using `text-decoration` or `background` for the marks. They cannot draw on and do not look hand-made.
- Perfect geometry: a closed ellipse, a dead-straight underline. Add a bow, a second stroke, an overshoot.
- One SVG per phrase with `overflow: hidden`. The circle and arrow need to escape the word box.
- Letting an annotated phrase wrap. Keep marked phrases short and `nowrap`, or compute per-line rects with `getClientRects()`.
- Linear easing on strokes. A hand accelerates and settles.

Rebuild order:

1. Masthead, three-column grid, article copy with `span.an[data-k]` phrases.
2. Overlay SVG and the measure helpers.
3. The six shape functions with seeded jitter.
4. The draw routine with dash offsets and chained second strokes.
5. IntersectionObserver batching in reading order after fonts load.
6. Picker buttons, dim-on-hover, keys 1–6, Replay all, live region.
7. Pinned margin notes at wide sizes, ResizeObserver rebuild, reduced motion, breakpoints.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
