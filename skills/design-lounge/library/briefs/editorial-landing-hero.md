<!-- Design Lounge Nº 012 · "Editorial landing hero" · designlounge.vercel.app -->

# Editorial landing hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The above-the-fold hero of a quarterly design magazine called *Marrow*. Warm paper background, a 56px hairline top nav, a small uppercase issue index, a two-line 104px Fraunces headline in weight 300 whose words rise one by one out of a clipped baseline, a 19px manifesto paragraph and exactly one outlined pill CTA. A footer hairline draws itself in from the left. The feeling is print: unhurried, low-contrast lines, one oxblood accent on a single italic word. The detail worth copying is the word-by-word rise, clipped per word so descenders never peek out early.

## Reference behaviour

1. First frame (t = 0): nav, index line and empty headline area are visible. Headline words are hidden below their own clip boxes; manifesto and CTA are at opacity 0; the footer rule has `scaleX(0)`.
2. t = 120ms: word 1 ("Make") starts rising from `translateY(112%)` to `0` over 760ms with expo-out easing. Each following word starts 70ms after the previous one (10 words, last starts at 120 + 9×70 = 750ms).
3. t = 400ms: footer hairline begins scaling from 0 to 1 over 900ms, origin left.
4. t = 1010ms: the manifesto + CTA row fades from 0 to 1 over 700ms.
5. By ~1.9s the page is fully settled. Nothing loops.
6. Hover a nav link: colour goes from `--ink-2` to `--ink` (160ms) and a 1px underline scales in from the left (240ms).
7. Hover the CTA: fills `--ink`, text becomes `--paper`, the arrow icon translates 4px right over 240ms. Active (mousedown) fills `--accent` instead.
8. Click anywhere on the main area that is not a link or button, or click the 32px round replay button bottom-right: the whole reveal replays from step 1.
9. With `prefers-reduced-motion: reduce` every element is in its final position from the first frame; replay does nothing visible.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ Marrow (italic)      Issues Essays Interviews Print About    Subscribe │ 56  nav, 1px rule below
├────────────────────────────────────────────────────────────────────────┤
│ ISSUE NO. 014 — AUTUMN 2026 — ON SLOWNESS                              │ 40px top pad, 12px caps
│                                                                        │
│  Make things that outlast                                              │ h1 104px / 0.98
│  the feed they were posted to.                                         │ ("outlast" italic oxblood)
│                                                                        │ 34px gap
│  Marrow is a quarterly on design ...        ( Read the issue → )       │ manifesto 520px max · CTA 52px
│                                                                        │
├── hairline draws left→right ───────────────────────────────────────────┤
│ Published 21 Sept 2026      Edited by I. Halvorsen & T. Marsh   2,400 copies · 96 pp │ 12px, 3 cols
└────────────────────────────────────────────────────────────────────────┘
 56px side gutters                                              replay ◯ 32px at right:16 bottom:14
```

- `<nav aria-label="Primary">` — flex row, 56px, `border-bottom: 1px solid --line`. Contains `<a class="mark">` (wordmark), `<ul>` of five links, `<a class="sub">` Subscribe in accent.
- `<main>` — grid, rows `auto 1fr auto`, padding `40px 56px 0`.
  - `<p class="index">` — three spans separated by 32px × 1px `<i>` rules.
  - `<section class="hero">` — `<h1>` with each word wrapped as `<span class="w"><span>word</span></span>`; `<br>` after the fourth word; then `.row` holding `<p class="manifesto">` and `<button class="cta">`.
  - `<footer>` — 3-column grid of meta spans; the rule is `footer::before`.
- `<button class="replay">` — fixed bottom-right, replays the reveal.

## Tokens

```css
:root {
  /* colour — warm paper, near-black ink, one oxblood accent */
  --paper:   #f3efe6;  /* page */
  --paper-2: #ebe6db;  /* reserved: hover surfaces */
  --ink:     #1c1a17;  /* headline, CTA border, nav hover */
  --ink-2:   #5f5a52;  /* manifesto, nav links, footer labels */
  --ink-3:   #9a948a;  /* index caps, footer meta, replay icon */
  --line:    #d9d3c7;  /* hairlines */
  --accent:  #8a2b1d;  /* italic word, issue number, Subscribe, focus ring */

  /* type */
  --serif: "Fraunces", Georgia, serif;          /* opsz 144 for the headline */
  --sans:  "Instrument Sans", system-ui, sans-serif;
  --h1: 104px;                                  /* 84px ≤1100, 60px ≤820 */

  /* layout */
  --nav-h: 56px;
  --gutter: 56px;                               /* 40 ≤1100, 24 ≤820 */
  --cta-h: 52px;
  --r-pill: 999px;

  /* motion */
  --t-micro: 160ms;
  --t-word: 760ms;
  --t-rule: 900ms;
  --t-fade: 700ms;
  --stagger: 70ms;
  --delay-words: 120ms;
  --delay-rule: 400ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role          | Family          | Size  | Weight | Line-height | Tracking | Case      |
|---------------|-----------------|------:|-------:|------------:|---------:|-----------|
| Headline      | Fraunces, opsz 144 | 104px | 300 | 0.98        | −0.035em | sentence  |
| Headline em   | Fraunces italic | 104px | 300    | 0.98        | −0.035em | sentence, `--accent` |
| Wordmark      | Fraunces italic | 22px  | 300    | 1           | −0.01em  | sentence  |
| Nav links     | Instrument Sans | 13px  | 500    | 1.5         | +0.02em  | sentence  |
| Issue index   | Instrument Sans | 12px  | 400 (number 500) | 1 | +0.14em | UPPERCASE |
| Manifesto     | Instrument Sans | 19px  | 400 (lead sentence 500) | 1.45 | −0.005em | sentence |
| CTA           | Instrument Sans | 14px  | 500    | 1           | +0.02em  | sentence  |
| Footer meta   | Instrument Sans | 12px  | 400 (labels 500) | 1.5 | +0.02em | sentence |

Headline measure is capped at 1120px so the copy breaks after "outlast" at 1280 wide; force the break with `<br>` rather than relying on wrapping.

## Motion

| Element            | Trigger   | Property   | From → To            | Duration | Easing   | Delay / stagger |
|--------------------|-----------|------------|----------------------|---------:|----------|-----------------|
| `.w > span` (word) | load / replay | transform | `translateY(112%)` → `0` | 760ms | `--expo` | 120ms + i × 70ms, i = 0…9 |
| `.row`             | load / replay | opacity   | 0 → 1               | 700ms    | `--ease` | 11 × 70 + 240 = 1010ms |
| `footer::before`   | load / replay | transform | `scaleX(0)` → `1`, origin left | 900ms | `--expo` | 400ms |
| nav link `::after` | hover     | transform  | `scaleX(0)` → `1`, origin left | 240ms | `--ease` | — |
| nav link           | hover     | color      | `--ink-2` → `--ink`  | 160ms    | `--ease` | — |
| `.cta`             | hover     | background, color | transparent/ink → ink/paper | 160ms | `--ease` | — |
| `.cta svg`         | hover     | transform  | `0` → `translateX(4px)` | 240ms | `--expo` | — |

Each `.w` wrapper is `display:inline-block; overflow:hidden` with `padding-bottom:.08em; margin-bottom:-.08em` so descenders (the "g" in "things", "p" in "posted") are not clipped once risen, while the word is still fully hidden at 112%.

Reduced motion: `.w > span, .row, footer::before { animation: none; transform: none; opacity: 1 }` and all transitions 1ms.

## States

- **Nav link hover:** colour `--ink`, 1px underline grows from left.
- **Subscribe:** always `--accent`, weight 500; hover has no change (it is already the loudest thing in the nav).
- **CTA default:** 1px `--ink` border, transparent fill, `--ink` text, 999px radius, 52px tall, 26px side padding, 14px gap to a 16px arrow icon.
- **CTA hover:** fill `--ink`, text `--paper`, arrow +4px.
- **CTA active:** fill and border `--accent`.
- **Focus-visible (all links/buttons):** `outline: 2px solid var(--accent); outline-offset: 4px`.
- **Replay button hover:** icon `--ink`, border `--ink-2`.
- **Replaying:** a `.hold` class is applied to `<main>` for one frame to cancel animations, then removed; no visible intermediate state.

## Accessibility

- The `<h1>` carries `aria-label` with the full sentence, because the per-word spans would otherwise be read with pauses. Keep the visible text identical to the label.
- Word spans are presentational; no roles needed. Do not use `aria-hidden` on the h1 itself.
- Nav is `<nav aria-label="Primary">` with a `<ul>`; Subscribe is a link, not a button (it navigates).
- The CTA is a `<button type="button">` here; make it an `<a>` if it navigates in your product.
- Replay control is a real `<button>` with `aria-label="Replay the reveal"` and `title`. Clicking the main background also replays but is not the only way, so keyboard users are not excluded.
- Focus order: wordmark → five nav links → Subscribe → CTA → replay.
- Contrast: `--ink-2` on `--paper` = 6.4:1; `--ink-3` on `--paper` = 3.2:1 and is only used for 12px uppercase meta with +0.14em tracking; if your a11y bar requires AA on that text, darken to `#7d776d` (4.6:1).
- Motion honours `prefers-reduced-motion`; nothing flashes; nothing loops.

## Responsive rules

- ≥ 1280: as specified (`--h1: 104px`, gutters 56px).
- 1024–1279: `--h1: 84px`, gutters 40px; headline still breaks after "outlast".
- 768–1023: `--h1: 60px`; `.row` stacks (manifesto above CTA, 24px gap); nav `<ul>` hidden behind a menu button of your choosing (the demo simply hides it).
- < 640: `--h1: 44px`, gutters 20px, footer becomes a single column with 8px row gap, replay button stays.
- Height: the hero is vertically centred in the `1fr` row, so at 640px tall the layout still fits without scroll; below that let the page scroll.

## Acceptance checklist

- [ ] Nav is 56px tall with a 1px `#d9d3c7` bottom rule; wordmark is Fraunces italic 22px.
- [ ] Headline is Fraunces 104px, weight 300, line-height 0.98, tracking −0.035em, breaks after "outlast".
- [ ] "outlast" is italic and `#8a2b1d`; no other word is coloured.
- [ ] Each word is individually clipped and rises from `translateY(112%)` over 760ms with `cubic-bezier(.16,1,.3,1)`.
- [ ] Word delays are 120ms + 70ms × index; the tenth word starts at 750ms.
- [ ] Descenders are fully visible after the rise (no clipped "g" or "p").
- [ ] Manifesto + CTA fade in together starting at ~1010ms over 700ms.
- [ ] Footer hairline scales from 0 to 1, origin left, 900ms, starting at 400ms.
- [ ] CTA is a 52px outlined pill; hover fills `#1c1a17` and moves the arrow 4px right.
- [ ] Clicking empty hero space or the replay button restarts the entire reveal.
- [ ] Focus rings (2px accent, 4px offset) are visible on every link and button.
- [ ] With reduced motion, the first frame equals the settled frame.
- [ ] Demo contains no images; the only network request is Google Fonts.

## Implementation notes

**Per-word clip with descender room.** Clip each word with its own wrapper; the negative margin cancels the padding so line-height is unaffected:

```css
.w { display: inline-block; overflow: hidden; vertical-align: top;
     padding-bottom: .08em; margin-bottom: -.08em; }
.w > span { display: inline-block; transform: translateY(112%);
            animation: rise var(--t-word) var(--expo) forwards;
            animation-delay: calc(var(--i) * var(--stagger) + var(--delay-words)); }
@keyframes rise { to { transform: none; } }
```

Set `--i` inline on each wrapper (`style="--i:3"`). Do not put `overflow:hidden` on the `<h1>`: a single clip box would let the second line's words show through the first line's box.

**Replay without cloning nodes.** Cancel all animations for one frame via a class, force a reflow, remove the class:

```js
function replay() {
  main.classList.add('hold');      // .hold .w>span, .hold .row, .hold footer::before { animation: none }
  void main.offsetWidth;           // flush styles so the removal restarts the animations
  main.classList.remove('hold');
}
main.addEventListener('click', e => { if (!e.target.closest('a,button')) replay(); });
```

This works for pseudo-elements too, which `element.style.animation = 'none'` does not.

**Hairline underline on nav links** — transform, not width, so it does not trigger layout:

```css
nav ul a::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background: var(--ink); transform: scaleX(0); transform-origin: left; transition: transform 240ms var(--ease); }
nav ul a:hover::after { transform: scaleX(1); }
```

Common mistakes: using `ease` on the rise (it reads as a bounce-less thud; expo-out is the point); animating `top` instead of `transform`; forgetting `forwards` so words snap back; making the CTA a filled button, which breaks the paper restraint.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
