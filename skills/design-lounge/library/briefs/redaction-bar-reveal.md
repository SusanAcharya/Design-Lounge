<!-- Design Lounge Nº 385 · "Redaction bar reveal" · www.designlounge.live -->

# Redaction bar reveal

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from f-list.cleancreatives.org: the "We are exposing" block, where each line of a paragraph starts behind a solid black redaction bar and the bars shrink away line by line as the section comes into view. This version is the findings block of a fictional investigative desk, Blackline Desk, on a grey-green newsprint page. Three paragraphs are set in 34px Antonio, a tall condensed face. On load, the bars over the first two paragraphs lift top to bottom with a 90ms stagger; the third paragraph stays covered until the reader clicks a bar, presses "Declassify next line", or "Declassify all". One phrase inside it is withheld for good: its bar never lifts, and hovering or focusing it shows a red "Withheld pending legal review" tag. When every line is lifted, a red double-ruled DECLASSIFIED stamp thumps onto the side column. The detail worth copying: bars are measured from the real rendered lines, so they fit any width, and they shrink toward the right edge, which reads like a marker being peeled back.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────┐
│ BLACKLINE DESK · FILE 07 / 2026     7 / 10 LINES  [NEXT][ALL][REDACT] │ 64px strip
├──────────────────────────────────────────────────────────────────┤
│ pad 56                                                            │
│ WHAT THE            │ Eleven packaging firms spent a combined …   │
│ FILINGS SHOW (68px) │ lobbying against bottle-deposit laws …      │
│ ─────────────────── │                                             │
│ Source   Public …   │ None of this appears in their …             │
│ Period   2019–2026  │                                             │
│ Pages    3,412      │ ████████████████████████████████████        │
│ Status   Partly …   │ ██████████████████████████████████          │
│                     │ ███████████████████████████                 │
│  [DECLASSIFIED]     │                                             │
│ ✋ Click any bar…    │ ─────────────────────────────────────────── │
│                     │ ■ 41 filings ■ 6 hearings ■ 2 ledgers ■ …   │
└──────────────────────────────────────────────────────────────────┘
grid: 340px | 1fr, column gap 72px, rows 1fr | auto
```

- `header.strip`: file label `span`, then a controls group with `output#count` (`aria-live="polite"`) and three `button`s.
- `main.doc`: a grid. `aside.side` spans both rows: `h2`, `ul.meta`, the stamp `div` (`aria-hidden`), `p.hint`.
- `article.text` labelled by the `h2`: three `p`, then `div.bars` (absolute overlay, `inset: 0`). The withheld phrase is a `span.withheld` with `tabindex="0"` and `aria-describedby` pointing at a visually hidden note.
- `footer.sources`: four mono facts with square bullets, under a hairline.

## Motion

| Thing | Trigger | Property | From → To | Duration / easing | Stagger | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Auto reveal | 450ms after fonts load | bar scaleX, origin right | 1 → 0 | 520ms `--expo` | 90ms, top→bottom | lifted instantly |
| Click a bar | click | same | 1 → 0 | 520ms `--expo` | — | opacity 1 → 0 instantly |
| Declassify all | button | same | 1 → 0 | 520ms `--expo` | 90ms, top→bottom | instant |
| Redact all | button | bar scaleX, origin left | 0 → 1 | 520ms `--expo` | 90ms, bottom→top | instant |
| Bar hover | hover | background | `#0d0d0d` → `#2b2b2b` | 160ms `--ease` | — | same |
| Stamp | all lifted | scale, opacity | 1.6, 0 → 1, 0.9 | 320ms `--expo` / 200ms | — | appears instantly |
| Withheld tag | hover / focus | opacity, translateY | 0, 4px → 1, 0 | 160ms `--ease` | — | instant |

## States

- Bar covered: solid `--bar`, pointer cursor, clickable.
- Bar hover: `--bar-hover`, so the reader sees it is a control.
- Bar lifted: `scaleX(0)`, `pointer-events: none`.
- Withheld bar: always solid, `cursor: help`, shows the red tag on hover. The span under it gets a 2px red focus outline with 4px offset when tabbed to, and the tag shows.
- Buttons: 40px tall, 1.5px ink border. Hover fills ink. The solid primary ("Declassify next line") hovers to stamp red. Disabled: 40% opacity, no hover fill.
- "Declassify next line" and "Declassify all" disable at 10 / 10. "Redact all" disables at 0 / 10.
- Stamp: visible only at 10 / 10.
- Loading: bars are not drawn until fonts are ready, so they never fit the fallback font's lines.

## Accessibility

- The paragraphs are real text in the DOM at all times. Bars are visual only; screen readers read the full copy. The overlay is not focusable.
- The withheld phrase is in the DOM too, so the text stays grammatical for screen readers, and its `aria-describedby` note says "Withheld pending legal review."
- Keyboard users drive the reveal with the three buttons; they do not need to click bars.
- `output#count` is `aria-live="polite"`. It is updated once at the end of each action, not once per line, so it does not chatter.
- Focus order: three buttons, then the withheld phrase.
- Contrast: `#111111` on `#dcdfd6` is about 14:1; `#3d403a` on `#dcdfd6` about 8:1; white on `#d7261e` about 4.9:1.
- Button targets are 40px tall.

## Responsive rules

- ≥1280: as specified, 340px side column, 34px body.
- 1024: same grid; the text column narrows and the bars re-measure.
- <1000: one column. Side column first (headline 48px, meta, hint), then text, then sources. The stamp moves to the top right of the side column at 1.15 start scale so it never overflows.
- <640: the strip wraps: label, then the counter on its own line, then the buttons. Headline 40px, body 24px, stamp 20px.
- No horizontal scroll at 375px. The withheld phrase wraps like normal text; it gets one bar per fragment.

## Acceptance checklist

### Always

- [ ] One bar per rendered line, measured from word rects after fonts load, rebuilt on resize.
- [ ] Bars are sized from the computed line-height, leave a thin seam, and cover ascenders and descenders.
- [ ] Lifting scales from the right edge; re-covering grows from the left edge.
- [ ] Group actions stagger at 90ms; single clicks lift one line.
- [ ] At least one phrase stays covered permanently and explains why on hover and focus.
- [ ] The text is always in the DOM; bars are `aria-hidden` and not focusable.
- [ ] The counter is a polite live region updated once per action.
- [ ] Buttons disable when there is nothing left to do.
- [ ] Reduced motion swaps the scale for an instant opacity change.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Page `#dcdfd6`, bars `#0d0d0d`, stamp and accents `#d7261e`.
- [ ] Headline "What the filings show", 68px Antonio 700 uppercase.
- [ ] Body 34px Antonio 500, line-height 1.2.
- [ ] First frame ends at "7 / 10 lines declassified" with paragraph 3 covered.
- [ ] The stamp reads DECLASSIFIED and appears only at 10 / 10.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: a 64px mono strip (file label left; counter and three buttons right); a 340px side column with a 68px uppercase headline "What the filings show", a four-row meta list and a hint; and the text column. Within 450ms + 7 × 90ms the bars over paragraphs 1 and 2 (7 lines at 1280) have lifted. Paragraph 3 (3 lines) is still behind bars.
2. Bars are built after `document.fonts.ready`. Each word is wrapped in a span; spans are grouped into lines by their rect top (within 8px). One bar per line spans the leftmost to the rightmost word, plus 4px each side, plus a small fixed jitter of `(i × 37) mod 13` px on the right so the ragged edge looks hand-drawn.
3. Bar height is 95% of the computed line-height, offset 11% of the line-height down from the line box top. Adjacent bars leave a 2px seam of paper.
4. Lifting a bar: `transform: scaleX(1 → 0)`, origin right centre, 520ms expo-out. The line's text is revealed left to right.
5. Clicking any covered bar lifts just that line. Bars cannot be clicked once lifted.
6. "Declassify next line" lifts the first covered line in reading order. "Declassify all" lifts all covered lines with a 90ms stagger, top to bottom.
7. "Redact all" re-covers every lifted line, bottom to top, 90ms stagger. Re-covering grows from the left (`transform-origin: 0 50%`), as if a marker is drawn again.
8. The counter reads "7 / 10 lines declassified" and updates after each action (polite live region). Buttons disable when they have nothing to do.
9. The withheld phrase ("a name we are not yet allowed to print") has its own bar per rendered fragment, above the line bars. It never lifts. Hover or keyboard focus shows a red mono tag above it.
10. When all lines are lifted, the stamp scales from 1.6 to 1 at −8°, 320ms expo-out, at 90% opacity with `mix-blend-mode: multiply`. It hides again as soon as any line is covered.
11. On resize, bars are rebuilt and each line keeps its lifted state by index.

## Tokens

```css
:root {
  /* colour */
  --paper: #dcdfd6;     /* page, grey-green newsprint */
  --paper-2: #e8eae3;   /* reserved for a lighter panel */
  --ink: #111111;       /* text, button borders */
  --ink-2: #3d403a;     /* meta labels, counter, sources */
  --line: #b9bdb2;      /* hairlines */
  --bar: #0d0d0d;       /* redaction bar */
  --bar-hover: #2b2b2b; /* bar under the pointer */
  --stamp: #d7261e;     /* stamp, file number, withheld tag, focus */
  --focus: #d7261e;

  /* type */
  --cond: "Antonio", "Arial Narrow", sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --lift: 520ms;
  --stagger: 90ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Headline h2 | Antonio | 68px | 700 | 0.95 | −0.01em | UPPER |
| Body paragraphs | Antonio | 34px | 500 | 1.2 | −0.005em | Sentence |
| Stamp | Antonio | 28px | 700 | 1 | 0.08em | UPPER |
| Strip label, buttons | IBM Plex Mono | 12px | 500 / 600 | 1 | 0.08em | UPPER |
| Meta list | IBM Plex Mono | 13px | 400 | 1.5 | 0 | Sentence |
| Sources, hint | IBM Plex Mono | 12px | 400 | 1.5 | 0.04em | Sentence |
| Withheld tag | IBM Plex Mono | 11px | 600 | 1 | 0.06em | UPPER |

The body is the condensed face, not the mono. Bars over 34px condensed text read as a dossier; bars over mono read as a code block.

## Implementation notes

1. Wrap words, then group rects into lines. Do this once; measure again on resize:

```js
p.childNodes.forEach(n => { if (n.nodeType === 3) {
  const frag = document.createDocumentFragment();
  n.textContent.split(/(\s+)/).forEach(t => {
    if (!t) return;
    if (/^\s+$/.test(t)) frag.append(t);
    else { const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s); }
  });
  p.replaceChild(frag, n);
}});
```

```js
text.querySelectorAll('.w, .withheld').forEach(el => {
  for (const r of el.getClientRects()) {
    const top = Math.round(r.top - box.top);
    let ln = lines.find(l => Math.abs(l.top - top) < 8);
    if (!ln) lines.push(ln = { top, h: r.height, l: Infinity, r: -Infinity });
    ln.l = Math.min(ln.l, r.left - box.left);
    ln.r = Math.max(ln.r, r.right - box.left);
  }
});
```

2. Size bars from the line-height, not from the rect height. A condensed face's glyph box is taller than its line box, so rect-sized bars merge into one block:

```js
const lh = parseFloat(getComputedStyle(p).lineHeight);
const y = ln.top + (ln.h - lh) / 2 + lh * 0.11;
bar.style.cssText = `left:${ln.l - 4}px;top:${y}px;width:${ln.r - ln.l + 8 + (i * 37 % 13)}px;height:${lh * 0.95}px`;
```

3. One CSS rule does the lift and the re-cover. Swapping the origin is the whole trick:

```css
.bar { transform-origin: 100% 50%; transition: transform 520ms var(--expo); }
.bar.lifted { transform: scaleX(0); pointer-events: none; }
.bar.cover { transform-origin: 0 50%; }
@media (prefers-reduced-motion: reduce) {
  .bar { transition: opacity .01s; }
  .bar.lifted { transform: none; opacity: 0; }
}
```

Common mistakes:

- Using `color: transparent` or a black `background` on the text itself. The bar must be a separate layer so it can animate and so text stays selectable afterwards.
- Hard-coding bar positions. They break at the first resize or font swap.
- Removing the text from the DOM while "redacted". Screen readers then hear nothing.
- Announcing every line. Update the live region once per action.
- Lifting the bars with opacity. It loses the peel; scale from one edge.
- Setting the body in the mono face. Keep mono for labels and the strip.

Where it sits:

1. It is the "what we found" block of a report, a campaign page or a press release, right after the hero. One per page.
2. Two to four short paragraphs. Long copy under bars becomes a wall of black and nobody reads it.
3. Pick the withheld phrase with care: it should be a name, a sum or a date that the story genuinely cannot print yet. Never withhold a phrase only for effect.
4. If the page has its own scroll reveal system, swap the 450ms auto-start for an IntersectionObserver at 40% visibility and keep the rest.
5. The stamp is the only decoration. Do not add tape, coffee rings or paper texture.

Rebuild order:

1. Set the strip, the side column and the three paragraphs with real type.
2. Wrap words after fonts load; group them into lines and log the result.
3. Draw one bar per line from the line-height, then the permanent bars.
4. Wire click-to-lift, then the three buttons with the stagger.
5. Add the counter, the disabled states and the stamp.
6. Add the ResizeObserver rebuild that keeps state by index.
7. Check reduced motion, keyboard focus on the withheld phrase, and 375px.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
