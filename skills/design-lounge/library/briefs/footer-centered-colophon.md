<!-- Design Lounge Nº 099 · "Centered colophon footer" · designlounge.vercel.app -->

# Centered colophon footer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The last screen of a long essay in *Quarterly 41*, a fictional Lisbon literary magazine. The article is a scrollable column above a footer that never moves: centered italic wordmark "Quarterly", the issue name "Forty-one" in 13px uppercase grotesk, three text links, "Lisbon · MMXXVI", and a back-to-top control. The last paragraph of the essay is masked with a linear fade to paper so the type dissolves before the colophon. Back-to-top smoothly scrolls the article to its heading. The feeling is a printed magazine closing its last page — quiet, centered, no sitemap.

## Reference behaviour

1. Initial state: cool olive paper (`#e8e4d6`). The article column (`#top`) is `overflow-y: auto` in the space above the footer. On load, JS sets `essay.scrollTop = essay.scrollHeight`, so the first frame is the faded last paragraph sitting on the colophon, not the title.
2. The last `<p class="last">` uses a CSS mask `linear-gradient(180deg, #000 0%, transparent 92%)` so the type fades into the paper.
3. Footer is centered, full width, not a grid of columns. A 48×1px ink rule at 45% opacity sits 36px above the wordmark.
4. Wordmark is italic 52px EB Garamond "Quarterly". Under it, "Forty-one" is 13px Hanken Grotesk, uppercase, letter-spacing 0.16em, colour `--ink-2`.
5. Three links in a row, 28px apart: Index, Masthead, Submit. Hover: colour `--ink`, 1px ink underline. No current-route state.
6. Place line: italic 16px serif "Lisbon · MMXXVI", `--ink-2`, 36px above the button.
7. Back-to-top is a `<button>`: 18px chevron-up SVG over 11px uppercase "Back to top". Clicking it runs `essay.scrollTo({ top: 0, behavior: 'smooth' })`. Hover colour `--pine` (`#2f4a3c`).
8. Reduced motion: `scroll-behavior: auto` on both `html` and the JS call (`behavior: 'auto'`). The last-paragraph mask starts later (20% opaque) so more of the sentence stays readable.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────┐
│           (article scrolls in this  ~460px band)         │
│                                                          │
│     The last light in the bindery          (may be off)  │
│     … body copy …                                        │
│     last paragraph ── fades to paper ────────            │
├──────────────────────────────────────────────────────────┤
│                      ────                                │  48px rule
│                    Quarterly                             │  italic 52
│                    FORTY-ONE                             │  13 / .16em
│              Index   Masthead   Submit                   │  14px sans
│                  Lisbon · MMXXVI                         │  italic 16
│                        ↑                                 │
│                   BACK TO TOP                            │  11px sans
└──────────────────────────────────────────────────────────┘
  footer padding 56 / 32 / 40
```

- `body` is a column flex, `height: 100%`, `overflow: hidden`.
- `<article class="essay" id="top">` is `flex: 1; min-height: 0; overflow-y: auto; max-width: 62ch; margin: 0 auto; padding: 40px 32px 8px`.
  - `.kicker` 11px uppercase pine.
  - `<h1>` 42px/1.15 EB Garamond 500.
  - Body paragraphs 18px/1.6 serif. First paragraph has class `drop` (64px italic pine first-letter, floated).
  - Last paragraph has class `last` and the fade mask.
- `<footer>` is `flex: none`, column, `align-items: center`, padding `56px 32px 40px`.
  - `.rule` 48×1px.
  - `.mark` `<p>`, `.issue` `<p>`, `<ul class="links">` of three `<a>`, `.place` `<p>`, `<button class="top" id="topbtn">`.

## Tokens

```css
:root {
  --paper: #e8e4d6;            /* page */
  --paper-2: #ddd8c8;
  --ink: #1c1b18;              /* type, rule, hover */
  --ink-2: #5c574e;            /* issue, links, place */
  --ink-3: #8a8478;            /* back-to-top rest */
  --line: rgba(28, 27, 24, .18);
  --pine: #2f4a3c;             /* kicker, drop cap, top hover */
  --pine-soft: #d5ddd6;
  --serif: "EB Garamond", "Palatino Linotype", Palatino, serif;
  --sans: "Hanken Grotesk", system-ui, sans-serif;
  --measure: 62ch;
  --pad: 80px;
  --t-micro: 160ms;
  --t-fade: 900ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role           | Family          | Size | Weight | Line-height | Tracking | Case      |
|----------------|-----------------|-----:|-------:|------------:|---------:|-----------|
| Essay title    | EB Garamond     | 42px | 500    | 1.15        | −0.02em  | sentence  |
| Body           | EB Garamond     | 18px | 400    | 1.6         | 0        | sentence  |
| Drop cap       | EB Garamond     | 64px | italic 400 | 0.8     | 0        |           |
| Wordmark       | EB Garamond     | 52px | italic 400 | 1       | −0.03em  | Title     |
| Place          | EB Garamond     | 16px | italic 400 | 1.4     | 0        | Title     |
| Issue          | Hanken Grotesk  | 13px | 500    | 1           | +0.16em  | UPPERCASE |
| Links          | Hanken Grotesk  | 14px | 500    | 1           | 0        | Title     |
| Kicker         | Hanken Grotesk  | 11px | 500    | 1           | +0.18em  | UPPERCASE |
| Back to top    | Hanken Grotesk  | 11px | 500    | 1           | +0.14em  | UPPERCASE |

Measure 62ch. Body never full-bleeds.

## Motion

| Element        | Trigger     | Property        | From → To        | Duration | Easing   | Notes |
|----------------|-------------|-----------------|------------------|---------:|----------|-------|
| Article scroll | back-to-top | scrollTop       | end → 0          | native smooth | —   | JS `behavior: 'smooth'` |
| Link underline | hover       | color, border   | ink-2 → ink      | 160ms    | `--ease` | 1px bottom border |
| Back-to-top    | hover       | color           | ink-3 → pine     | 160ms    | `--ease` | |

The fade is a static CSS mask, not an animation. Reduced motion: JS uses `behavior: 'auto'`; `html { scroll-behavior: auto }`. Do not animate the mask.

## States

- **Link hover:** `--ink`, 1px ink underline. No visited colour.
- **Back-to-top hover:** `--pine`. Resting colour `--ink-3`.
- **Focus-visible:** 2px `--pine` outline, 4px offset, on links and the button.
- **Scroll:** article is the only scroller. Footer stays pinned to the bottom of the 800px frame.

## Accessibility

- Back-to-top is a real `<button>`, not an anchor that hijacks. Visible label "Back to top" plus decorative SVG `aria-hidden`.
- Hit target: button has `min-width/min-height: 40px` and 8px padding.
- Tab order: any in-view essay focusables (none in the demo), then Index, Masthead, Submit, Back to top.
- On load the article is scrolled to the end; that is a visual choice, not a skip of the heading for AT. The heading remains in the DOM at the start of the article.
- Contrast: body ink on paper exceeds 10:1. `--ink-2` on paper is about 6.8:1. `--ink-3` on the button is a control, not body copy; hover darkens it.

## Responsive rules

- ≥ 1280: as specified, measure 62ch centered.
- 1024–1279: same, padding 32px.
- 768–1023: wordmark 44px, title 36px. Links stay in one row.
- < 640: wordmark 36px. Links stack with 12px vertical gap. Footer padding 40px 20px 32px. Back-to-top remains 40px.

## Acceptance checklist

- [ ] First painted frame after load shows the faded last paragraph above the colophon, not the essay title (article `scrollTop` equals `scrollHeight`).
- [ ] Last paragraph uses a linear mask that reaches 0 opacity by 92% of its height.
- [ ] Colophon is centered: italic 52px "Quarterly", 13px uppercase "Forty-one", three links, "Lisbon · MMXXVI".
- [ ] No multi-column sitemap, no newsletter field, no giant wordmark that fills the width.
- [ ] Back-to-top smoothly scrolls the article to `top: 0` (not the window). Reduced motion jumps.
- [ ] Button hit area is at least 40×40px and has a visible text label.
- [ ] Focus rings are 2px `#2f4a3c` with a 4px offset.
- [ ] Body type is 18px/1.6 EB Garamond on a 62ch measure.
- [ ] Palette is olive paper `#e8e4d6` and pine `#2f4a3c`, not warm apricot and not amber-on-black.
- [ ] Only EB Garamond and Hanken Grotesk load.

## Implementation notes

**Pin the footer and scroll only the essay** so the colophon is always in the 800px frame:

```css
html, body { height: 100%; margin: 0; }
body { display: flex; flex-direction: column; overflow: hidden; }
.essay { flex: 1; min-height: 0; overflow-y: auto; max-width: 62ch; margin: 0 auto; }
footer { flex: none; }
```

**Start at the end, return with the button:**

```js
const essay = document.getElementById('top');
essay.scrollTop = essay.scrollHeight;
topBtn.addEventListener('click', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  essay.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
});
```

**Fade the last paragraph with a mask, not opacity on the whole block:**

```css
.essay p.last {
  margin: 0;
  mask-image: linear-gradient(180deg, #000 0%, transparent 92%);
  -webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 92%);
}
```

Common mistakes: calling `window.scrollTo` while `body` is `overflow: hidden` (nothing moves). Putting the fade on a duplicate paragraph. Centering with `text-align` but leaving the links in a left-aligned wrap on small screens without a column flex.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
