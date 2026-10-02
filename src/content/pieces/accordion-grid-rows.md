---
title: "Grid-rows FAQ accordion"
summary: "A six-question FAQ whose answers animate open with grid-template-rows 0fr → 1fr over 320ms, one open at a time, chevron rotation and arrow-key movement between serif questions on a paper ground."
platform: web
type: component
tags: [accordion, faq, disclosure, keyboard, grid]
styles: [paper, editorial, minimal]
motion: subtle
difficulty: 1
featured: false
published: 2026-09-30
palette: ["#F4F0E8", "#221D17", "#B5472A", "#DDD5C6"]
fonts: ["Newsreader", "Inter"]
related: []
---

# Grid-rows FAQ accordion

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A help-page FAQ for a soil subscription product. Six questions set in Newsreader at 22px sit on hairline rules over a warm paper background; the answer panels animate height with `grid-template-rows: 0fr → 1fr` so no JS ever measures `scrollHeight`. Only one answer is open at a time, the chevron rotates 180° on the same 320ms clock, and Up/Down/Home/End move focus between questions like a proper disclosure group. The detail worth copying is the height animation: pure CSS, content-agnostic, and it works with `prefers-reduced-motion` by collapsing to 1ms.

## Reference behaviour

1. Initial state: left column (400px) with kicker "Loam · Help", a 44px serif heading and a short paragraph; right column lists six numbered questions. Question 01 is open, its chevron pointing up and its text in `--accent`.
2. Hover a closed question: its text turns `--accent` over 160ms. No background change, no movement.
3. Click question 03: question 01's panel collapses (`1fr → 0fr`, 320ms) while 03's expands on the same clock; 01's chevron rotates back to 0°, 03's rotates to 180°. The answer text inside 03 fades in and slides up 4px over the same 320ms.
4. `aria-expanded` is `true` on exactly one button, or none.
5. Click the open question again: it collapses; nothing is open.
6. With focus on any question: ArrowDown moves focus to the next question (wrapping from 06 to 01), ArrowUp to the previous (wrapping), Home to 01, End to 06. Moving focus does not open anything; Enter/Space toggles the focused question.
7. Focus-visible on a question shows a 2px `--accent` outline inset 2px, rounded 6px.
8. Some answers end with a small pill tag ("Sizing", "Delivery", "Coverage") in `--accent` on `--accent-soft`.

## Structure

```
1280 × 800
┌──────────────────────┬───────────────────────────────────────────────┐
│ 400                  │ 6 QUESTIONS            Use ↑ ↓ Home End …      │
│ LOAM · HELP          │ ─────────────────────────────────────── strong │
│ Questions people     │ 01  How much soil does one bag…         ⌃      │
│ ask before they      │     One 40-litre bag fills a 60 × 40 …         │
│ plant.               │     [Sizing]                                   │
│                      │ ─────────────────────────────────────── line   │
│ Short answers …      │ 02  When do deliveries go out…          ⌄      │
│                      │ ─────────────────────────────────────── line   │
│                      │ 03  What is in the mix?                 ⌄      │
│                      │ ───────────────────────────────────────        │
│ ─────────────        │ 04  A bag arrived torn. What now?       ⌄      │
│ Still stuck? …       │ 05 … 06 …                                      │
└──────────────────────┴───────────────────────────────────────────────┘
  aside 64px/48px padding      main 64px top, 72px right, 64px left
```

- `<aside>` — kicker, `<h1>`, paragraph, `.contact` pinned to the bottom with `margin-top: auto` and a top hairline.
- `<main>` — `.count` line (mono-ish uppercase caption) then `<ul class="faq">`.
- `<li class="item">` — one per question. Contains `<h3>` wrapping `<button class="q" aria-expanded aria-controls>` and the `.panel`.
- `.q` — three children: `.n` (28px-wide number), `.t` (question text, flex 1), inline chevron SVG (20px).
- `.panel` — `display: grid; grid-template-rows: 0fr`, `role="region" aria-labelledby`. Its single child has `overflow: hidden; min-height: 0`; inside that, `.a` holds the answer with padding `0 60px 22px 28px`.

## Tokens

```css
:root {
  /* colour — warm paper, ink, one rust accent */
  --bg: #f4f0e8;           /* page */
  --panel: #faf7f1;        /* reserved for cards/inputs */
  --line: #ddd5c6;         /* hairlines between items */
  --line-strong: #b8ad98;  /* top rule of the list, link underline */
  --ink: #221d17;          /* questions, headings */
  --ink-2: #5c5449;        /* answers, paragraphs */
  --ink-3: #8c8272;        /* numbers, chevrons, captions */
  --accent: #b5472a;       /* open/hover question, chevron, kicker, tag */
  --accent-soft: #f1e2dc;  /* tag background */

  /* type */
  --serif: "Newsreader", Georgia, serif;
  --sans: "Inter", system-ui, sans-serif;

  /* layout */
  --aside-w: 400px;
  --r: 6px;                /* button focus radius */
  --answer-pad: 0 60px 22px 28px;

  /* motion */
  --t-open: 320ms;
  --t-fast: 160ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role            | Family     | Size | Weight | Line-height | Tracking | Case      |
|-----------------|------------|-----:|-------:|------------:|---------:|-----------|
| Page heading    | Newsreader (opsz 72) | 44px | 400 | 1.05  | −0.015em | sentence  |
| Question        | Newsreader (opsz 30) | 22px | 400 | 1.25  | −0.005em | sentence  |
| Pull quote in answer | Newsreader italic (opsz 18) | 17px | 400 | 1.5 | 0 | sentence |
| Answer body     | Inter      | 15px | 400    | 1.55        | 0        | sentence  |
| Answer emphasis | Inter      | 15px | 500    | 1.55        | 0        | as written |
| Kicker / count  | Inter      | 11px | 500    | 1.3         | +0.14em  | UPPERCASE |
| Question number | Inter      | 12px | 400    | 1           | +0.06em  | tabular numerals |
| Tag             | Inter      | 11px | 500    | 1.3         | +0.06em  | title     |
| Contact line    | Inter      | 13px | 400    | 1.55        | 0        | sentence  |

## Motion

| Element      | Trigger        | Property             | From → To        | Duration | Easing   | Notes |
|--------------|----------------|----------------------|------------------|---------:|----------|-------|
| `.panel`     | open / close   | grid-template-rows   | 0fr ↔ 1fr        | 320ms    | `--ease` | inner wrapper `overflow:hidden; min-height:0` |
| `.a`         | open / close   | opacity, translateY  | 0, −4px ↔ 1, 0   | 320ms    | `--ease` | same clock, no delay |
| chevron SVG  | open / close   | rotate               | 0 ↔ 180°         | 320ms    | `--ease` | |
| `.q`         | hover / open   | color                | `--ink` → `--accent` | 160ms | `--ease` | |
| chevron SVG  | hover / open   | color                | `--ink-3` → `--accent` | 160ms | `--ease` | |

Closing and opening happen simultaneously when switching questions; the list height changes by the difference, which is what you want.

Reduced motion: `.panel, .q svg, .a { transition-duration: 1ms }`. State is complete instantly.

## States

- **Closed:** question `--ink`, chevron `--ink-3` pointing down, panel at `0fr`.
- **Hover (closed):** question text `--accent`; chevron stays `--ink-3`.
- **Open:** `aria-expanded="true"`, question and chevron `--accent`, chevron rotated 180°, panel `1fr`, answer visible.
- **Focus-visible:** `outline: 2px solid var(--accent); outline-offset: -2px; border-radius: 6px` on the button. Works on open and closed items.
- **Contact link focus-visible:** same 2px accent outline, offset 2px.
- **Empty / loading / error:** not applicable; content is static.

## Accessibility

- Each question is a `<button>` inside an `<h3>` (heading level chosen to sit under the page `<h1>`).
- `aria-expanded` on the button, `aria-controls` pointing at the panel id; the panel is `role="region" aria-labelledby="<button id>"`.
- Keyboard: Tab moves in and out of the list (each button is a tab stop, as in the WAI-ARIA accordion pattern); ArrowUp/ArrowDown/Home/End move between buttons with `preventDefault` so the page does not scroll; Enter/Space toggle.
- Collapsed panels are hidden with `0fr` + `overflow: hidden`, so their content is out of view but still in the accessibility tree. If your stack cares, add `inert` or `aria-hidden` to collapsed panels after the transition ends.
- Contrast: `--ink` on `--bg` 14.3:1; `--ink-2` 7.2:1; `--ink-3` (captions and numbers only) 4.5:1; `--accent` on `--bg` 5.0:1.
- Hit targets: question rows are ≥ 63px tall (18px padding + 27.5px line); chevron is decorative (no `role`, no label).

## Responsive rules

- ≥ 1280: two columns, aside 400px, as drawn.
- 1024–1279: aside 320px; main padding 48px.
- 768–1023: stack; aside becomes a 48px-padded header block with the contact line inline; list below at full width.
- < 640: aside padding 24px, heading 32px, questions 19px, answer padding `0 32px 18px 28px`.

## Acceptance checklist

- [ ] Panels animate with `grid-template-rows` from `0fr` to `1fr` over 320ms, `cubic-bezier(.2,.7,.2,1)`; no `max-height` hacks and no JS height measurement.
- [ ] Only one panel is open at any time; opening one closes the other on the same clock.
- [ ] Clicking the open question closes it, leaving none open.
- [ ] Chevron rotates 180° over 320ms and is `--accent` when open.
- [ ] Question text turns `--accent` on hover and when open.
- [ ] ArrowDown/ArrowUp wrap around the ends; Home/End jump to first/last.
- [ ] Arrow keys move focus only; they do not open panels.
- [ ] `aria-expanded` and `aria-controls` are present and correct on every button; panels have `role="region"`.
- [ ] Focus ring is a 2px accent outline, inset 2px, on every question.
- [ ] First question is open on load.
- [ ] Reduced motion collapses all transitions to 1ms and the UI still completes every state change.
- [ ] Body text contrast ≥ 4.5:1 throughout.

## Implementation notes

**The height trick is two elements, not one.** The animated grid needs a child with `min-height: 0` and `overflow: hidden`; without both, `0fr` still shows content:

```css
.panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 320ms cubic-bezier(.2,.7,.2,1); }
.item.open .panel { grid-template-rows: 1fr; }
.panel > div { overflow: hidden; min-height: 0; }
```

**One open at a time** — set every item from a single index, so state never drifts:

```js
function setOpen(idx) {
  items.forEach((it, i) => {
    const on = i === idx;
    it.classList.toggle('open', on);
    btns[i].setAttribute('aria-expanded', String(on));
  });
}
btn.addEventListener('click', () => setOpen(item.classList.contains('open') ? -1 : i));
```

**Arrow keys with wrap:**

```js
btn.addEventListener('keydown', (e) => {
  const n = btns.length; let j = i;
  if (e.key === 'ArrowDown') j = (i + 1) % n; else if (e.key === 'ArrowUp') j = (i - 1 + n) % n;
  else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1; else return;
  e.preventDefault(); btns[j].focus();
});
```

Common mistakes: putting padding on the `overflow: hidden` wrapper (it leaks height at `0fr`; pad the inner `.a` instead); animating `height: auto` (does not transition); forgetting `min-height: 0` (grid items default to `min-height: auto`, which defeats `0fr`).
