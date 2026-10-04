<!-- Design Lounge Nº 122 · "Long-form product case study" · designlounge.vercel.app -->

# Long-form product case study

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

One case study from the portfolio of Noor Halabi, a fictional product designer: "Ebb", a ferry-pass app for Kelda Ferries. The page reads like a long magazine feature on a soft sage ground: a 250px italic serif title, a phone mockup floating over a gradient fjord, a four-column facts strip, then numbered sections (Problem, Process, Outcome) with sticky side labels, three hand-drawn SVG sketches that draw themselves on scroll, count-up metrics, a coral pull-quote card and a large next-project link. The detail worth copying is the restraint of the system: one serif, one sans, one coral accent, a 3/9 column split that never changes, and motion only where it explains something (sketches drawing, numbers arriving).

## Structure

```
1280 × 800 (56px side padding)
┌──────────────────────────────────────────────────────────────────────┐
│ Noor Halabi                     Case study 04/06  Work About Notes  Next project │ 60 sticky
│▔▔▔▔▔ 2px coral progress                                              │
├──────────────────────────────────────────┬───────────────────────────┤
│ • Kelda Ferries · iOS & Android · 2025   │ ┌───────────────────────┐ │
│                                          │ │ fjord gradient   sun  │ │
│  Ebb   (250px italic Literata, teal)     │ │     ┌─phone 236×480─┐ │ │ art card 500 tall, r22
│                                          │ │     │ ticket + QR   │ │ │
│  Making the 07:40 to Holm feel like a    │ │     │ Hold to board │ │ │
│  habit, not a hassle.  (34px, 17ch)      │ └─────┴───────────────┴─┘ │
├──────────┬──────────┬──────────┬─────────┴───────────────────────────┤ 1px ink rule
│ ROLE     │ TIMELINE │ TEAM     │ SHIPPED                             │ facts
└──────────┴──────────┴──────────┴─────────────────────────────────────┘
below the fold (each section is a 3fr / 9fr grid, 96px top padding):
  01 Problem   │ h3 44px + two paragraphs (62ch)
  02 Process   │ h3 + paragraph + 3 sketch figures (4:5 ruled pads)
  03 Outcome   │ h3 + 4-up metric row
  quote card (coral tint, 56/64 padding) → next-project band (min 260px)
```

- `<header class="bar">` with brand link, counter, nav links, and `<span class="prog">`.
- `<main>` → `<section class="hero">` (7fr/5fr grid): text column, `.art` (decorative, `aria-label` describing the scene), `<dl class="facts">` spanning both columns.
- Three `<section class="s">`, each with `<h2>` (number in `<b>` + label) and a content `<div>`.
- Sketches are `<figure>` with an inline SVG (`aria-hidden`) and a `<figcaption>`.
- `<blockquote>` with quote SVG, `<p>` and `<footer>` for attribution.
- `<a class="next">` as the closing band.

## Motion

| Element          | Trigger                    | Property            | From → To          | Duration | Easing         |
|------------------|----------------------------|---------------------|--------------------|---------:|----------------|
| `.prog`          | scroll                     | width               | 0 → 100%           | live     | —              |
| sketch strokes   | sketch row 35% in view     | stroke-dashoffset   | `--len` → 0        | 1400ms   | `--ease`       |
| sketch replay    | click sketch row           | dashoffset reset, then draw | instant → 1400ms | — | `--ease`   |
| metric figures   | metric row 35% in view     | text value          | 0 → target         | 1200ms   | ease-out-quart `1-(1-t)^4` |
| next arrow       | hover `.next`              | translateX, rotate  | 0,0 → −8px,−45°    | 360ms    | `--ease-out`   |
| anchor jump      | click "Next project"       | scroll              | smooth             | browser  | —              |

Reduced motion: transitions become 1ms, count-up duration 1ms (numbers appear final), `scroll-behavior:auto`.

## States

- **Bar links:** `--ink-2` at rest, `--ink` on hover; "Next project" is always `--ink` 600.
- **Focus-visible:** 2px coral outline, 3px offset, 4px radius on every link and the sketch row.
- **Sketches before reveal:** strokes invisible (fully dashed out); pads and captions are visible so the row never looks empty.
- **Metrics before reveal:** show "0%", "0.0", "0k" in final typography so layout doesn't shift.
- **Next band hover:** arrow disc shifts and rotates; band background unchanged.

## Accessibility

- Facts use a `<dl>`; each fact is a `<div>` with `<dt>`/`<dd>`.
- Section labels are real `<h2>`s; the big statement in each section is an `<h3>`.
- Sketch SVGs are `aria-hidden`; the caption carries the meaning.
- The metric count-up changes text content; it is not a live region (it runs once and would be noisy). Final values are reached within 1.2s.
- Body copy `--ink-2` on `--bg` is 6.4:1; `--ink-3` labels are 3.6:1 and only used at 12px+ uppercase 600 for non-essential labels.
- The phone art is `aria-label`led as one image; its fake UI is not focusable.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: title 200px; art card 440px tall; section grid 2fr/10fr.
- 768–1023: hero stacks (text above, art card full width at 420px tall); facts 2×2; section labels stop being sticky and sit above content; sketches stay 3-up.
- < 640: title 140px; lede 26px; sketches 1-up; metrics 2×2 at 56px; quote 26px with the mark above the text; side padding 20px.

## Acceptance checklist

- [ ] Title is italic Literata at 250px, colour `#2f5a57`, line-height .8.
- [ ] Hero, phone mockup and the full facts strip are visible within the first 800px.
- [ ] Facts strip has a 1px ink top rule and 1px `--line` dividers between four columns.
- [ ] Progress line on the bar tracks scroll from 0 to 100%.
- [ ] Section labels stick at `top:84px` beside their section.
- [ ] Sketches draw in over 1400ms when 35% visible, and clicking the row replays them.
- [ ] Metrics count up once over 1200ms to −38%, 61%, 4.8, 212k with 32px suffixes.
- [ ] The QR code has three finder squares and is built in SVG, not an image.
- [ ] Next band arrow moves −8px and rotates −45° on hover.
- [ ] Every link shows a coral focus ring.
- [ ] With reduced motion, everything is visible in its final state with no animation.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state (scrollTop 0): sticky 60px bar, hero with eyebrow, "Ebb", lede, the phone art card, and the facts strip all inside the first 800px.
2. A 2px coral progress line along the bar's bottom edge grows from 0 to 100% width as the page scrolls.
3. Scroll to Problem: left column shows "01" (64px coral serif) over the uppercase label; it is `position:sticky; top:84px` so it stays beside the text while the section scrolls.
4. Scroll to Process: when the sketch row is 35% visible, all strokes in the three SVG sketches draw in over 1400ms (stroke-dashoffset to 0). Accent shapes are coral and 2.2px; the rest are ink and 1.6px.
5. Clicking the sketch row replays the drawing (dashoffset resets with transitions disabled for one frame, then draws again).
6. Scroll to Outcome: when the metric row is 35% visible, four numbers count up over 1200ms with ease-out-quart: −38%, 61%, 4.8, 212k. Suffixes render at 32px next to the 72px figure.
7. Below: a coral-tint quote card, then the "Next case study" band. Hovering it moves the round arrow button 8px left and rotates it −45° over 360ms.
8. The "Next project" link in the bar smooth-scrolls to the band.

## Tokens

```css
:root {
  /* colour: sage ground, deep teal, one coral accent */
  --bg: #e8ede6;          /* page */
  --surface: #f5f6f1;     /* phone screen */
  --sea-1: #bcd3cc;       /* fjord light */
  --sea-2: #6f9c94;       /* fjord mid */
  --sea-3: #2f5a57;       /* fjord deep, title, figures, buttons */
  --ink: #1c2a24;         /* text, rules */
  --ink-2: #4c5d55;       /* body copy (6.4:1) */
  --ink-3: #7d8b84;       /* labels */
  --line: #c9d3cb;        /* hairlines */
  --accent: #d9674f;      /* numbers, progress, highlights, focus */
  --accent-soft: #f3d6cc; /* quote card */
  --pad-paper: #f7f4ea;   /* sketch pad */
  --pad-rule: #e9e3d1;    /* sketch pad ruling, 24px pitch */
  --next-a: #4a3a26; --next-b: #8a6a3e; --next-glow: #e9b97a; --next-ink: #f6efe2;

  /* type */
  --serif: "Literata", Georgia, serif;
  --sans: "Figtree", system-ui, sans-serif;

  /* layout */
  --pad: 56px;
  --bar-h: 60px;
  --r: 22px;
  --r-sm: 12px;
  --shadow: 0 24px 48px -24px rgba(28, 42, 36, .35);

  /* motion */
  --t-micro: 180ms;
  --t-draw: 1400ms;
  --t-count: 1200ms;
  --t-arrow: 360ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role              | Family   | Size  | Weight | Line-height | Tracking | Case      |
|-------------------|----------|------:|-------:|------------:|---------:|-----------|
| Title "Ebb"       | Literata italic | 250px | 400 | .8     | −0.05em  | Title     |
| Lede              | Literata | 34px  | 400    | 1.18        | −0.015em | sentence  |
| Section h3        | Literata | 44px  | 400    | 1.12        | −0.02em  | sentence  |
| Section number    | Literata | 64px  | 400    | 1           | −0.03em  | numerals  |
| Metric figure     | Literata | 72px (suffix 32px) | 400 | 1  | −0.04em  | tabular   |
| Quote             | Literata | 36px  | 400    | 1.25        | −0.015em | sentence  |
| Next title        | Literata | 64px  | 400    | 1           | −0.03em  | Title     |
| Figcaption        | Literata italic | 15px | 400 | 1.4      | 0        | sentence  |
| Body              | Figtree  | 17px  | 400    | 1.6         | 0        | sentence  |
| Facts value       | Figtree  | 15px  | 400    | 1.45        | 0        | sentence  |
| Labels (dt, h2)   | Figtree  | 12–13px | 600  | 1.2         | +0.08em  | UPPERCASE |
| Bar links         | Figtree  | 14px  | 400    | 1           | 0        | Title     |

## Implementation notes

**Self-drawing sketches.** Give each shape its own path length via a custom property so one rule handles every stroke; disable transitions for one frame to replay.

```css
.sk svg * { stroke-dasharray: var(--len, 600); stroke-dashoffset: var(--len, 600);
            transition: stroke-dashoffset 1400ms cubic-bezier(.2, .7, .2, 1); }
.sk.drawn svg * { stroke-dashoffset: 0; }
.sk.reset svg * { transition: none; }
```

```js
sk.addEventListener('click', () => {
  sk.classList.add('reset'); sk.classList.remove('drawn');
  void sk.offsetWidth; sk.classList.remove('reset');
  requestAnimationFrame(() => sk.classList.add('drawn'));
});
```

**Count-up with stable layout.** Render the final typography at zero first; animate text only.

```js
function count(el) {
  const to = +el.dataset.to, dec = +(el.dataset.dec || 0), t0 = performance.now();
  (function f(t) {
    const k = Math.min(1, (t - t0) / 1200), e = 1 - Math.pow(1 - k, 4);
    el.innerHTML = (el.dataset.pre || '') + (to * e).toFixed(dec) + `<small>${el.dataset.suf || ''}</small>`;
    if (k < 1) requestAnimationFrame(f);
  })(t0);
}
```

**A believable QR from a seeded grid.** 25×25 modules, three 7×7 finder squares drawn as one even-odd path each, the rest from a deterministic PRNG so it looks the same every load.

```js
let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
// skip finder zones, add <rect width=1 height=1> where rnd() > .52
```

Common mistakes: putting the sticky label on the section instead of the `<h2>` (it needs `align-self:start` inside the grid), counting numbers with `setInterval`, and letting the phone mockup's fake buttons receive focus.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
