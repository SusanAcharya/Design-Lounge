<!-- Design Lounge Nº 126 · "Marker highlight draw" · designlounge.vercel.app -->

# Marker highlight draw

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A magazine pull-quote for "The Margin" (Issue 31, Autumn 2026). The 58px Newsreader sentence is annotated the way a reader would mark a galley: a yellow highlighter wipe, a red ink circle around *wait*, a wavy underline, two more highlights, then a −5° Caveat note with a hand-drawn arrow. Every stroke is an SVG path with `pathLength="1"` and `stroke-dashoffset` animated 1 → 0. A notebook rule sits 55px from the left. The detail worth copying is that the marks are **behind** the type (`z-index: -1` on the SVG, `mix-blend-mode: multiply` on highlights) so the serifs stay sharp and the yellow reads as ink on paper, not a box behind a span.

## Reference behaviour

1. First paint: `<main id="stage" class="run">`. Marks draw in this order (CSS `--d` delay, then `--draw` 650ms, except the circle 820ms):
   - 300ms — highlight "your attention."
   - 900ms — circle around italic *wait*
   - 1400ms — underline "remember where"
   - 1900ms — highlight "get out"
   - 2250ms — highlight "of the way."
   - 2500ms — arrow path; 380ms later the two-line note types in over 700ms (`clip-path` inset 100% → 0, `steps(14)`).
2. Hovering any `.mk` replays **that** path only: `animation: none`, force reflow via `getBBox()`, then `draw 650ms` (820ms if `.ci`) `cubic-bezier(.65, 0, .35, 1) 0ms backwards`.
3. **Replay** button: clear inline `animation` on all paths and `.note span`, remove `.run`, force reflow (`offsetWidth`), add `.run` again so the full sequence restarts from `--d`.
4. Header Subscribe pill inverts on hover (ink fill, paper type). Replay border goes `--ink` on hover.
5. Reduced motion: `.run` paths and note spans have `animation: none`. Marks are fully visible (dashoffset 0, clip open). Replay/hover still swap classes but there is nothing to watch.

Quote (exact wrapping):

> The best tools don’t ask for **your attention.**  
> They ***wait***, they **remember where**  
> you left off, and then they **get out**  
> **of the way.**

Kicker: "Notes on slow software". Byline: Ines Okafor · 11 min read · 2 October 2026 · Filed under Craft. Note: "the whole essay," / "in one word". Footer legend: Highlight / Pen, "Hover a mark to redraw it".

## Structure

```
1280 × 800  paper #F2F1EC, vertical rule at x=55–56
.page  grid rows 68px / 1fr / auto, pad 0 56 0 96
┌ header 68, border-bottom 1px ink ──────────────────────────────────────┐
│ The Margin (30px italic)     ESSAYS    ISSUE 31 · AUTUMN 2026  [Subscribe — €48/yr]
├ main grid 1fr 250px, gap 40, align centre, pad-top 8 ───────────────────┤
│ NOTES ON SLOW SOFTWARE ──                                          ↗   │
│ The best tools don’t ask for your attention.      arrow + Caveat note  │
│ They wait, they remember where                    "the whole essay,    │
│ you left off, and then they get out               in one word"         │
│ of the way.                                       −5deg, 30px          │
│ (IO) Ines Okafor · 11 min · 2 October 2026 · Craft                     │
├ footer 22/26 pad, 12px uppercase ───────────────────────────────────────┤
│ ■ Highlight   — Pen     Hover a mark to redraw it          [↻ Replay]  │
└────────────────────────────────────────────────────────────────────────┘
```

- `.page` — three rows. Header flex: `.mast`, two `<span>`s, pill `<a>`.
- `#stage.run` — quote column + `.note`.
- Each mark: `<span class="mk hl|ci|ul" style="--d:…">` wrapping the words, first child an `<svg aria-hidden>` with one `<path pathLength="1">`. Circle SVG sits above (`z-index: 1`) so the stroke rings the italic; highlights and underline sit behind.
- `.meta` — 36px `#CBD5E8` disc "IO", name, 3px dots, three facts.
- Footer: `.legend` (yellow 18×8 chip, red 18×2 rule), instruction, `#replay` 40px pill.

Path geometry (viewBoxes, keep these curves):

- Highlight: `viewBox="0 0 100 10"`, SVG left −0.1em, width calc(100% + .2em), top .3em, height .66em. Stroke `--marker` 9, opacity .92, round caps. Path 1: `M1 6 C 25 4.6, 60 5.8, 99 4.2`. Path get out: `M1 5.4 C 30 6.2, 64 4.4, 99 5.6`. Path of the way: `M1 4.8 C 30 5.8, 70 4.2, 99 5.4`.
- Underline: SVG top .98em, height .26em, full width. Stroke `--pen` 2.2. `M1 5 C 14 2, 26 8, 40 5 S 66 2, 80 5.5 S 94 6, 99 3`.
- Circle: SVG left −0.3em, width calc(100% + .6em), top −.06em, height 1.34em. Stroke `--pen` 2.4. `M62 5 C 24 1, 3 16, 5 32 C 7 50, 46 58, 80 52 C 99 47, 101 22, 86 11 C 72 3, 46 3, 30 9`.
- Arrow: 150×84, `M140 80 C 120 40, 70 18, 12 22 M26 10 L 10 22 L 26 34`. Stroke 2.2.

`preserveAspectRatio="none"` on the quote SVGs so they stretch to the word width.

## Tokens

```css
:root {
  /* colour — warm paper, navy ink, yellow marker, red pen */
  --paper: #F2F1EC;
  --paper-2: #E8E6DE;
  --ink: #1B2333;
  --ink-2: #4A5163;
  --ink-3: #6E7383;
  --rule: #D3D0C6;
  --marker: #FFD43B;
  --pen: #D9402A;
  --av: #CBD5E8;

  /* type */
  --serif: "Newsreader", Georgia, serif;
  --hand: "Caveat", cursive;

  /* sizes */
  --fs-quote: 58px;
  --fs-body: 17px;
  --fs-label: 12px;
  --fs-hand: 30px;
  --rule-x: 55px;

  /* motion */
  --draw: 650ms;
  --draw-circle: 820ms;
  --write: 700ms;
  --ease-pen: cubic-bezier(.65, 0, .35, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role           | Family     | Size | Weight | Line-height | Tracking | Case      |
|----------------|------------|-----:|-------:|------------:|---------:|-----------|
| Body           | Newsreader | 17px | 400    | 1.6         | 0        | sentence  |
| Masthead       | Newsreader | 30px | 400 italic | 1        | −0.02em  | title     |
| Header meta    | Newsreader | 12px | 500    | 1           | +0.14em  | UPPERCASE |
| Subscribe      | Newsreader | 14px | 500    | 1           | 0        | sentence  |
| Kicker         | Newsreader | 12px | 500    | 1           | +0.14em  | UPPERCASE |
| Quote          | Newsreader | 58px | 400    | 1.16        | −0.022em | sentence  |
| Quote italic   | Newsreader | 58px | 400 italic | 1.16     | −0.022em | sentence  |
| Note           | Caveat     | 30px | 600    | 1.05        | 0        | sentence  |
| Byline         | Newsreader | 15px | 400/500| 1.6         | 0        | sentence  |
| Footer / legend| Newsreader | 12px | 500    | 1           | +0.14em  | UPPERCASE |
| Replay         | Newsreader | 14px | 500    | 40px h      | 0        | sentence  |

Quote uses `font-variation-settings: "opsz" 72`. Marks are `white-space: nowrap` so a highlight never wraps mid-stroke.

## Motion

| Element          | Trigger     | Property                 | From → To              | Duration | Easing       | Delay |
|------------------|-------------|--------------------------|------------------------|----------|--------------|------:|
| Highlight paths  | `.run`      | stroke-dashoffset        | 1 → 0                  | 650ms    | `--ease-pen` | 300 / 1900 / 2250 |
| Underline path   | `.run`      | stroke-dashoffset        | 1 → 0                  | 650ms    | `--ease-pen` | 1400 |
| Circle path      | `.run`      | stroke-dashoffset        | 1 → 0                  | 820ms    | `--ease-pen` | 900 |
| Arrow path       | `.run`      | stroke-dashoffset        | 1 → 0                  | 650ms    | `--ease-pen` | 2500 |
| Note lines       | `.run`      | clip-path inset          | 0 100% 0 0 → 0 0 0 0   | 700ms steps(14) | —     | 2880 |
| Single mark      | hover       | same draw keyframes      | replay                 | 650 / 820| `--ease-pen` | 0 |
| Full sequence    | Replay click| re-add `.run`            | full timeline          | —        | —            | — |

CSS:

```css
.mk path { stroke-dasharray: 1; stroke-dashoffset: 0; }
.run .mk path, .run .note path {
  animation: draw var(--draw) var(--ease-pen) backwards;
  animation-delay: var(--d);
}
.run .ci path { animation-duration: 820ms; }
@keyframes draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
```

`backwards` keeps dashoffset at 1 during the delay so marks are invisible until their turn.

## States

- **Running (default):** `.run` on `#stage`. All delays honour `--d`.
- **Hover a mark:** that path retraces from empty. Other marks stay finished.
- **Replay:** sequence starts over from delay 0 of the first highlight.
- **Subscribe hover:** background `--ink`, colour `--paper`.
- **Replay hover:** border `--ink`.
- **Focus-visible:** 2px `--pen` outline, 3px offset (Subscribe, Replay).

## Accessibility

- Decorative SVGs `aria-hidden="true"`. The quote is real text in a `<blockquote>` — marks do not replace letters.
- Initials disc `aria-hidden`. Legend `aria-hidden` (the footer sentence explains hover).
- Replay is a real `<button type="button">` with visible "Replay" text and a 16px undo icon.
- Subscribe is a link, 40px-class padding (10 16) plus 1px border, radius 999.
- Tab order: Subscribe → Replay. Quote is not interactive; hover-redraw is pointer-only (Replay is the keyboard equivalent for the full sequence).
- Contrast: navy on paper is high; `--ink-2` for 12–15px meta; yellow marker is a graphic over black type (multiply), not text colour. Red pen on paper ~4.7:1 at 2.2px — it is decoration around already-readable type.
- Hit target: Replay 40px. Mark hover uses the word boxes (large display type).

## Responsive rules

- ≥ 1280: quote 58px, main `1fr 250px`, page pad 0 56 0 96, rule at 55px.
- 1024–1279: quote 48px; keep two columns.
- 768–1023: quote 40px; stack the note under the byline (one column); left pad 64px; rule at 32px.
- < 640: quote 32px; header pill may wrap; Replay stays 40px. Highlights stay nowrap — if a phrase would overflow, drop quote size before allowing a wrap through a `.mk`.
- Reduced motion: no dash or clip animation; every mark is drawn on first paint.

## Acceptance checklist

- [ ] Quote is 58px Newsreader / 1.16 / −0.022em / opsz 72, on paper with a 1px rule at x=55.
- [ ] Highlight strokes are 9px `#FFD43B`, opacity .92, `mix-blend-mode: multiply`, behind the glyphs.
- [ ] Circle and underline are `#D9402A` 2.4 / 2.2px and use the paths in Structure.
- [ ] Sequence delays are 300, 900, 1400, 1900, 2250, 2500ms; circle draws in 820ms, others 650ms, easing `cubic-bezier(.65,0,.35,1)`.
- [ ] Note is Caveat 30/600, −5deg, with the 150×84 arrow; words clip in 700ms steps(14) after the arrow starts + 380ms.
- [ ] Hovering a mark retraces only that stroke; Replay retraces the whole timeline.
- [ ] `pathLength="1"` + `stroke-dasharray: 1` (not a huge computed length).
- [ ] Masthead "The Margin", Issue 31 · Autumn 2026, Subscribe — €48/yr, Ines Okafor, 2 October 2026.
- [ ] Reduced motion shows finished marks with no draw.
- [ ] Focus rings are 2px pen-red on Subscribe and Replay.
- [ ] Highlight spans do not wrap (`white-space: nowrap`).
- [ ] Circle SVG sits above the italic; highlight SVGs sit behind.

## Implementation notes

**`pathLength="1"`** so every curve, regardless of pixel length, uses the same 0–1 dash math:

```html
<svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
  <path pathLength="1" d="M1 6 C 25 4.6, 60 5.8, 99 4.2"/>
</svg>
```

**Restart a single stroke on hover** without restarting the page:

```js
m.addEventListener('mouseenter', () => {
  const p = m.querySelector('path'); if (!p) return;
  p.style.animation = 'none';
  void p.getBBox();
  p.style.animation = 'draw ' + (m.classList.contains('ci') ? 820 : 650)
    + 'ms cubic-bezier(.65,0,.35,1) 0ms backwards';
});
```

**Replay the sequence** by cycling the class (inline styles from hover must be cleared first):

```js
btn.addEventListener('click', () => {
  stage.querySelectorAll('path, .note span').forEach((p) => { p.style.animation = ''; });
  stage.classList.remove('run');
  void stage.offsetWidth;
  stage.classList.add('run');
});
```

Common mistakes: a CSS `background` underline instead of a stretched path (it will be ruler-straight); `mix-blend-mode` on the text instead of `.hl` (the type will stain); animating `stroke-dashoffset` from a JS-measured length while also setting `pathLength="1"` (the two fight); putting the SVG after the words in DOM without `z-index: -1` so the yellow covers serifs; using `forwards` instead of `backwards` (marks flash finished during their delay).

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
