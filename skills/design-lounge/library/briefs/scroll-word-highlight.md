<!-- Design Lounge Nº 395 · "Scroll word highlight" · www.designlounge.live -->

# Scroll word highlight

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The about section of a small bookbinding studio, Fenwick Bindery. One long paragraph of 71 words is set in Newsreader at 54px on warm white. The paragraph is pinned while the page scrolls past it. Scroll progress is spread across the words, so the words turn from 18% to 100% opacity one by one, in reading order. Three key phrases, "folded by hand", "has to last a lifetime" and "open flat", draw a 3px terracotta underline the moment their last word is fully lit. The feeling is quiet and slow, like someone reading the text aloud at your pace. The detail worth copying: screen readers get the whole sentence once, as plain text, while the word spans are `aria-hidden`.

This is not `text-mask-line-reveal`, which slides lines up once on load. It is not `text-marker-highlight-draw`, which draws marker strokes on a timer. Here scroll position is the clock, and the unit is the word.

## Structure

```
1280 × 800, sticky stage (100vh), padding 40px 120px 36px
┌──────────────────────────────────────────────────────────────┐
│ 02 ABOUT THE BINDERY                FENWICK BINDERY · LEITH… │  12px caps
│                                                              │
│  We bind books the slow way. Every signature                 │
│  is folded by hand, sewn on linen tape and                   │  54px serif
│  left under the press overnight, because glue                │  max-width 960px
│  dries in an hour but a spine has to last a                  │  ~9 lines
│  lifetime. We do not chase the season. We …                  │
│                                                              │
│ ↓ SCROLL TO READ                           0 / 71  ────────  │  12px caps
└──────────────────────────────────────────────────────────────┘
runway total height 340vh
──────────────────────────────────────────────────────────────── 1px rule
Visit the bench            ADDRESS  14 Coburg Lane …
one line of copy           HOURS    Tue to Fri …
( Book a Saturday visit → ) REPAIRS From £45 …
```

- `section.runway` (340vh, `aria-labelledby` the heading) holds `div.stage`.
- The stage is a 3-row grid: `header` (top row), the paragraph area (`1fr`, flex centred vertically), and `footer` (hint and counter).
- The top-left label is the section's `h1`. The "02" inside it is `aria-hidden`.
- The paragraph is one `p`. Key phrases are marked in the source with `mark` so the copy is editable without JS.
- At runtime the `p` is replaced with two children: a visually hidden `span` with the full sentence, and an `aria-hidden` span holding one `span.w` per word.
- The counter and track are `aria-hidden`. They repeat what the text already says.
- `section.visit` is a 2-column grid (1.3fr and 1fr), aligned to the bottom, 88px top and 96px bottom padding.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Word | scroll, per frame | opacity | 0.18 → 1 | Scrubbed. 140ms linear transition only smooths steps | All words at 1 |
| Key phrase underline | last word of phrase reaches 1 | transform scaleX | 0 → 1, origin left | 320ms expo out, 45ms per segment | Drawn, no transition |
| Underline retract | last word drops below 1 | transform scaleX | 1 → 0 | Same | Not used |
| Progress hairline | scroll | transform scaleX | 0 → t | Scrubbed | Hidden |
| Scroll arrow | load | translateY | 0 → 3px → 0 | 1.8s standard, infinite | Hidden |
| Scroll hint | scrollY > 40 | opacity, translateY | 1, 0 → 0, 6px | 300ms standard | Hidden |
| Button hover | hover | background, colour | outline → filled charcoal | 160ms standard | Same |

Rules:

1. Only `opacity` and `transform` change during scroll. Never animate `color`, `width` or `background-size` per frame.
2. Read layout once per frame: one `getBoundingClientRect()` on the runway. Do not measure each word.
3. Write a word's opacity only when it changed. Round to 3 decimals and compare to the last value.
4. One passive scroll listener schedules one `requestAnimationFrame`. A flag stops double scheduling.
5. The underline is a triggered transition, not scrubbed. Scrubbing a 3px line looks like a glitch.

## States

- Unlit word: opacity 0.18. Lit word: opacity 1. In between: linear blend over one word of scroll.
- Key phrase before lit: no underline (scaleX 0). After lit: 3px terracotta line at 0.02em above the baseline box bottom, 0.055em tall with a 2px floor.
- Hint visible at scroll 0 to 40px, hidden after.
- Counter: "lit / total" in tabular numbers.
- Focus-visible: 2px terracotta outline, 3px offset, 2px radius, on the button and any link.
- Button hover: fills charcoal, text turns `--paper`. Min height 44px, pill radius.
- No loading, empty or error state. The copy is static.

## Accessibility

- The full sentence lives in a visually hidden span inside the `p`. Screen readers read it once, with normal punctuation.
- The word spans sit inside an `aria-hidden="true"` wrapper. Never let a reader announce 71 separate spans.
- Do not rely on `aria-label` on the `p`. A paragraph has no role that names reliably. Use the hidden text.
- The dim 18% words fail contrast on purpose. They are a preview, not the content. The hidden copy, the fully lit state, and the reduced-motion state carry the text.
- The section heading is a real `h1` with the visible label text. The "02" is decorative and `aria-hidden`.
- Keyboard: the page scrolls with Space, Page Down and arrows as normal. Nothing captures scroll. Tab goes to the visit button.
- Contrast: `#26231f` on `#f6f2ea` is about 14:1. `#5b554c` on `#f6f2ea` is about 6.6:1. `#6f685d` on `#fbf8f2` is about 5:1 for the 12px labels. Terracotta `#b4532f` on `#f6f2ea` is about 4.4:1, so use it only for the decorative "02" and the underline, never for words someone must read.
- Without JS the paragraph shows as plain charcoal text with no underlines. It is still complete.

## Responsive rules

- ≥1280: as specified. Paragraph at 54px (4vw caps at 54px past 1350px), max-width 960px, left aligned at the 120px gutter.
- 1024: paragraph about 41px, about 10 lines. The stage still fits 800px of height.
- 768: paragraph about 31px. Gutter clamps to 61px.
- <640: stage padding 28px 24px. The right-hand label hides. The track shrinks to 64px. Paragraph at the 28px floor, about 13 lines in 342px. The visit section becomes one column with 64px top and 72px bottom padding.
- Short screens: the stage has `min-height: 560px`. If the paragraph is taller than the stage, reduce the font clamp, never the word count.
- Never let the paragraph overflow sideways. `overflow-x: hidden` on the body is a guard, not a fix.

## Acceptance checklist

### Always

- [ ] One paragraph, split into one span per word at runtime. Spaces stay real spaces between spans.
- [ ] Unlit words sit at 18% opacity. Lit words sit at 100%. Only opacity changes per word.
- [ ] Words light in reading order, driven by scroll position, not by time.
- [ ] The paragraph is pinned with `position: sticky` inside a runway about 3.4 times the viewport height.
- [ ] Progress finishes at 80% of the runway, so the fully lit text holds before it leaves.
- [ ] Key phrases draw their underline only after their last word is fully lit, and retract on scroll back.
- [ ] Screen readers get the sentence once. Word spans are `aria-hidden`.
- [ ] One passive scroll listener and one rAF per frame. No per-word measuring.
- [ ] Reduced motion: no pinning, all words full, underlines drawn, hint hidden.
- [ ] Visible 2px focus ring on every link and button.

### This demo

- [ ] 71 words, Newsreader 400 at clamp(28px, 4vw, 54px), line-height 1.16.
- [ ] Underlined phrases: "folded by hand", "has to last a lifetime", "open flat".
- [ ] Label reads "02 About the bindery". Right label reads "Fenwick Bindery · Leith, since 1987".
- [ ] Counter starts at "0 / 71" and ends at "71 / 71".
- [ ] Page `#f6f2ea`, text `#26231f`, underline `#b4532f`, 3px tall at 54px.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state, scroll 0: the section fills the 1280×800 frame. Top row: "02" in terracotta and "About the bindery" on the left, "Fenwick Bindery · Leith, since 1987" on the right. The paragraph sits in the middle. The first word "We" is 60% lit. Every other word is at 18% opacity. Bottom row: "Scroll to read" with a down arrow on the left, "0 / 71" and a 120px hairline track on the right.
2. The arrow nudges down 3px and back, every 1.8s.
3. Scrolling past 40px fades the scroll hint out (opacity 0, translateY 6px, 300ms).
4. The section is a 340vh runway. Its inner stage is `position: sticky; top: 0; height: 100vh`, so the paragraph stays still while the page moves 240vh under it.
5. Progress `t` runs from 0 to 1 over the first 80% of that travel. The last 20% is a hold, so the fully lit paragraph rests on screen before it leaves.
6. Each frame, word `i` (0 to 70) gets opacity `0.18 + 0.82 × clamp(f − i, 0, 1)`, where `f = 0.6 + t × (N + 0.4)` and N = 71. So about one word is mid-fade at any moment, and the rest are either dim or fully lit.
7. When the last word of a key phrase reaches full opacity, the phrase's underline draws left to right. Each word and each space in the phrase has its own underline segment. Segments start 45ms apart and each takes 320ms with expo-out.
8. Scrolling back up dims the words again in reverse order. Underlines retract when their last word drops below full.
9. The counter shows how many words are fully lit, for example "53 / 71". The hairline under it fills with `scaleX(t)`.
10. At t = 1 all 71 words are charcoal, all three underlines are drawn, and the counter reads "71 / 71".
11. After the runway, a "Visit the bench" section scrolls in on a slightly lighter paper colour: a 40px serif heading, one line of body copy, a pill link "Book a Saturday visit", and a definition list with address, hours and repair price.
12. With reduced motion, the section is not pinned, every word is at full opacity, the three underlines are already drawn, and the hint and counter are hidden.

## Tokens

```css
:root {
  /* colour */
  --bg: #f6f2ea;        /* page, warm white */
  --paper: #fbf8f2;     /* visit section */
  --ink: #26231f;       /* charcoal text */
  --ink-2: #5b554c;     /* labels, secondary copy */
  --ink-3: #6f685d;     /* dt labels */
  --line: #e2dacb;      /* hairlines, empty track */
  --accent: #b4532f;    /* terracotta: underlines, section number */
  --focus: #b4532f;

  /* type */
  --serif: "Newsreader", Georgia, serif;
  --sans: "Instrument Sans", system-ui, sans-serif;
  --size-manifesto: clamp(28px, 4vw, 54px);
  --size-h2: clamp(28px, 3vw, 40px);
  --size-body: 15px;
  --size-label: 12px;

  /* scroll */
  --dim: 0.18;          /* unlit word opacity */
  --runway: 340vh;
  --active-share: 0.8;  /* share of the runway that drives words */

  /* space */
  --pad-x: clamp(24px, 8vw, 120px);
  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 48px; --space-5: 88px;

  /* motion */
  --ease: cubic-bezier(.16, 1, .3, 1);      /* expo out: underline */
  --std: cubic-bezier(.2, .7, .2, 1);       /* hint, button */
  --dur-underline: 320ms;
  --stagger-underline: 45ms;
  --dur-word: 140ms;                        /* smoothing only */
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case / colour |
| --- | --- | --- | --- | --- | --- | --- |
| Manifesto | Newsreader, optical size auto | clamp(28px, 4vw, 54px) | 400 | 1.16 | -0.012em | Sentence, `--ink` |
| Section label | Instrument Sans | 12px | 600 | 1.5 | 0.12em | Uppercase, `--ink-2`, title part `--ink` |
| Section number | Instrument Sans | 12px | 600 | 1.5 | 0.12em | `--accent` |
| Hint, counter | Instrument Sans | 12px | 600 | 1.5 | 0.12em | Uppercase, tabular numbers |
| Visit heading | Newsreader | clamp(28px, 3vw, 40px) | 400 | 1.1 | -0.01em | Sentence |
| Body | Instrument Sans | 15px | 400 | 1.5 | 0 | `--ink-2`, max 44ch |
| dt | Instrument Sans | 12px | 600 | 1.5 | 0.12em | Uppercase, `--ink-3` |

Set `font-optical-sizing: auto` so Newsreader uses its display cut at 54px. Use `text-wrap: pretty` on the paragraph to avoid a one-word last line. Keep the measure at 960px max. At 54px that is about 40 characters per line, which is right for display text.

## Implementation notes

**1. Split the words and keep the sentence whole.** Walk the paragraph's child nodes. Text nodes become word spans. `mark` elements become word spans with a group. Split on whitespace but keep punctuation glued to its word, so "lifetime." is one span and no space appears before the full stop.

```js
const sr = Object.assign(document.createElement('span'), { className: 'sr' });
sr.textContent = p.textContent.replace(/\s+/g, ' ').trim();
const vis = document.createElement('span');
vis.setAttribute('aria-hidden', 'true');
const words = [], groups = [];
const add = (text, g) => {
  for (const tok of text.match(/\s+|\S+/g) || []) {
    const s = document.createElement('span');
    s.textContent = /^\s/.test(tok) ? ' ' : tok;
    if (/^\s/.test(tok) && !g) { vis.append(' '); continue; }
    if (!/^\s/.test(tok)) { s.className = 'w'; words.push({ el: s, o: -1 }); }
    if (g) { s.classList.add('k'); s.style.setProperty('--j', g.els.length); g.els.push(s); if (s.classList.contains('w')) g.last = words.length - 1; }
    vis.append(s);
  }
};
for (const n of [...p.childNodes]) n.nodeType === 3 ? add(n.textContent) : add(n.textContent, groups[groups.push({ els: [], last: 0 }) - 1]);
p.replaceChildren(sr, vis);
```

Inside a key phrase the spaces are spans too. That is what lets the underline run under the gap between words without hanging past the last word on a line.

**2. Map scroll to words.** One rect read, one loop, writes only on change.

```js
const range = runway.offsetHeight - innerHeight;
const t = clamp(-runway.getBoundingClientRect().top / (range * 0.8));
const f = 0.6 + t * (N + 0.4);
for (let i = 0; i < N; i++) {
  const o = +(0.18 + 0.82 * clamp(f - i)).toFixed(3);
  if (o !== words[i].o) { words[i].o = o; words[i].el.style.opacity = o; }
}
for (const g of groups) {
  const on = f >= g.last + 1;
  if (on !== g.on) { g.on = on; g.els.forEach(el => el.classList.toggle('on', on)); }
}
```

The 0.6 offset means the first word is already half lit at scroll 0. The first frame then shows what will happen, which beats a fully dim block.

**3. The underline is one pseudo element per segment.**

```css
.k { position: relative; }
.k::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: .02em;
  height: max(2px, .055em); background: var(--accent);
  transform: scaleX(0); transform-origin: 0 50%;
  transition: transform 320ms var(--ease);
  transition-delay: calc(var(--j) * 45ms);
}
.k.on::after { transform: scaleX(1); }
```

Common mistakes:

- Animating `color` from grey to black per word. That repaints text every frame. Use opacity.
- Splitting into letters. The unit is the word. Letters make the paragraph shimmer.
- Using `aria-label` on the `p` and leaving the spans exposed. Readers then hear both, or neither.
- A scroll listener without `passive: true`, or one rAF per word.
- A scrubbed underline that grows with scroll. It should be a short triggered draw.
- Mapping progress over the whole runway, so the last word lights as the section leaves.
- One `::after` across the whole phrase. It breaks when the phrase wraps to two lines.
- Adding a second accent colour for lit words. Lit words are charcoal. Terracotta is only the underline and the "02".

Where it sits:

1. Use it once per page, for the one paragraph the brand wants read slowly: about, manifesto, mission.
2. Keep the copy between 50 and 90 words. Under 50 the runway feels empty. Over 90 it no longer fits a 100vh stage at 1024 wide.
3. Pick two or three key phrases, each two to five words. More turns the underline into noise.
4. Put normal content right after it so the hold ends in something useful.

Rebuild order:

1. Set the runway, the sticky stage and the 3-row grid.
2. Set the paragraph in Newsreader with the clamp and the 960px measure.
3. Split the words and add the hidden copy.
4. Wire the scroll mapping and check the counter goes 0 to 71.
5. Add the underline groups and the stagger.
6. Add the hint, the counter and the hairline.
7. Add the visit section.
8. Check reduced motion and the 390px width.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
