<!-- Design Lounge Nº 044 · "Onboarding carousel" · www.designlounge.live -->

# Onboarding carousel

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The first-run screen of "Mira", a sleep app. Three full-width slides scroll horizontally with mandatory snap; each has a 380px illustration card drawn entirely in CSS (a moon over hills, a sleep-stage bar chart that rises in, a readiness ring that sweeps to 72%), an italic-accented serif headline and one short paragraph. Below, three page dots: the active one stretches from an 8px circle to a 24px pill in the accent colour. A full-width "Continue" button advances; on the last slide its label swaps to "Get started" and "Skip" disappears. The mood is night-time and quiet: deep navy surfaces, a warm apricot accent, an old-style serif for the headings.

## Structure

```
390 × 844
┌────────────────────────────────────────┐
│ (54 status)                            │
│ 98  Mira (italic serif 22)       Skip  │  header, bottom-aligned
│ ┌────────────────────────────────────┐ │
│ │ art card 334×380, r24, #161B2E     │ │
│ │        ✦     ◐ moon 120            │ │
│ │  ✦            ╭────╮   ✦           │ │
│ │  ╭───────────╯      ╰──────╮       │ │  hills = large circles
│ └────────────────────────────────────┘ │
│  34                                    │
│  Fall asleep on purpose (serif 36)     │
│  Mira builds a wind-down for the hour  │  paragraph 15/1.55, max 300
│  before bed from your own patterns…    │
│                                        │
│              ▬ · ·  dots 24/8/8        │
│ ┌────────────────────────────────────┐ │
│ │           Continue (56)            │ │  bottom 44
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

- `<body>` is a flex column: `<header>` 98px → `.track` (flex 1) → `<footer>`.
- `.track`: `display:flex; overflow-x:auto; scroll-snap-type:x mandatory`, scrollbar hidden, `aria-roledescription="carousel"`.
- `.slide`: `flex:0 0 100%; scroll-snap-align:center; scroll-snap-stop:always; padding:8px 28px 0`. Each is a `<section role="group" aria-label="n of 3">` holding `.art` (aria-hidden), `<h2>`, `<p>`.
- `.art`: 380px tall, `border-radius:24px`, `--surface` with a 1px `--line` border and a radial apricot glow at the bottom (`::after`).
- `<footer>`: `padding:12px 24px 44px`, `.dots[role=tablist]` then `<button class="cta">`.

## Motion

| Element      | Trigger          | Property        | From → To                 | Duration | Easing     | Notes |
|--------------|------------------|-----------------|---------------------------|---------:|------------|-------|
| `.track`     | CTA / keys       | scrollLeft      | i·width → (i±1)·width     | native smooth | —     | `scroll-behavior` via `scrollTo({behavior:'smooth'})` |
| `.dots i`    | index change     | width           | 8px ↔ 24px                | 320ms    | `--spring` | |
| `.dots i`    | index change     | background      | `--ink-3` ↔ `--accent`    | 320ms    | `--ease`   | |
| `.bar`       | enter slide 2    | transform       | `scaleY(0)` → `scaleY(1)` | 700ms    | `--expo`   | delay = index · 40ms, `transform-origin:bottom` |
| `.ring`      | enter slide 3    | `--p` (conic)   | 0% → 72%                  | 1200ms   | `--expo`   | needs `@property --p` |
| `.cta span`  | label change     | opacity / transform | 1,0 → 0,6px then back | 160ms + 160ms | `--ease` | text swapped at the midpoint |
| `.cta`       | :active          | transform       | 1 → scale(.97)            | 160ms    | `--ease`   | |

Reduced motion: all transitions and animations are 1ms (dots jump, bars and ring appear complete), and the track uses `scroll-behavior:auto` so "Continue" jumps.

## States

- **Active slide:** `aria-current="true"` on the section; its dot has class `on` (24px, apricot).
- **Last slide:** `Skip` gets the `hidden` attribute; CTA text is "Get started".
- **CTA focus-visible:** 2px `--accent` outline, 3px offset. **Skip focus-visible:** same with 2px offset, 8px radius.
- **CTA active:** scale 0.97.
- **Dots** are presentational (`role="tablist"` without interactive tabs is acceptable here because the CTA and keys navigate); do not make dots the only way to move.
- **Loading (spec only):** while fonts load, headings fall back to Georgia; keep the 36px size so layout does not jump.

## Accessibility

- Track: `aria-roledescription="carousel" aria-label="Introduction"`; each slide `role="group" aria-label="1 of 3"` etc.
- `.art` blocks are `aria-hidden="true"`; the headline + paragraph carry the meaning.
- Keyboard: Tab order is Skip → CTA. ArrowLeft/ArrowRight move slides from anywhere on the page. The track itself is scrollable by keyboard when focused (native).
- Contrast: `--ink-2` on `--bg` is 8.1:1; `--accent-ink` on `--accent` is 11:1; `--ink-3` is only used for axis labels and inactive dots.
- Hit targets: CTA 56px tall; Skip has `min-height:40px`.
- Announce slide changes by updating `aria-current`; screen readers already read the group label when focus enters a slide.

## Responsive rules

- 390 wide: art card is 334px wide (390 − 2·28).
- 360 wide: same paddings; art card 304px, height stays 380; headline drops to 32px.
- ≥ 430 wide: constrain the whole column to `max-width:420px; margin:0 auto` so the art card stays under 380px wide.
- Short viewports (< 760px tall): art height 300px, header 80px.
- Tablet: show the three slides side by side as static cards (no carousel), dots removed, a single "Get started" button.

## Acceptance checklist

- [ ] Slides are exactly one viewport wide and snap one at a time (`scroll-snap-type:x mandatory`, `scroll-snap-stop:always`).
- [ ] Active dot is 24×8px in `#f0c27b`; inactive dots are 8×8px in `#6c7188`; width animates over 320ms `cubic-bezier(.32,.72,0,1)`.
- [ ] Index is derived from `Math.round(scrollLeft / clientWidth)` on scroll, so drag, keys and buttons all update the dots.
- [ ] On the last slide the CTA reads "Get started" and Skip is hidden; leaving it restores "Continue" and Skip.
- [ ] CTA text swaps via a 160ms fade-down / fade-up, not an instant change.
- [ ] Entering slide 2 replays the 18-bar rise with 40ms stagger; entering slide 3 replays the ring sweep to 72%.
- [ ] Art cards are 380px tall, radius 24px, `#161b2e` with a 1px `#262c45` border and a bottom apricot glow.
- [ ] Headline is Instrument Serif 36px with one italic accent phrase; paragraph is Manrope 15/1.55 with a 300px measure.
- [ ] CTA is 56px, radius 16px, full width, `#f0c27b` on `#2b1d05` text, and scales to 0.97 on press.
- [ ] Footer keeps 44px clear at the bottom; header content sits below the 54px status area.
- [ ] Focus rings visible on Skip and CTA.
- [ ] Reduced motion: no bar or ring animation, dots jump, Continue jumps.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: slide 1 ("Fall asleep on purpose") is centred, dot 1 is a 24px apricot pill, the button reads "Continue", "Skip" is top-right. The moon illustration is static with a three-ring halo.
2. Swipe or drag the track horizontally (mouse drag also works via native scroll): slides snap one at a time (`scroll-snap-stop: always`).
3. When the scroll position crosses the midpoint of a slide, the dot for that slide grows to 24px over 320ms `cubic-bezier(.32,.72,0,1)` and turns apricot; the previous one shrinks to 8px and returns to `--ink-3`.
4. Arriving on slide 2 replays its chart: 18 bars scale up from `scaleY(0)` over 700ms `cubic-bezier(.16,1,.3,1)`, staggered 40ms each.
5. Arriving on slide 3 replays the ring: the conic sweep goes 0% → 72% over 1200ms with the same expo-out curve. "Skip" hides. The button text fades out (160ms, 6px downward) and "Get started" fades in.
6. Tap "Continue": smooth-scrolls to the next slide. Tap "Get started": returns to slide 1 (the Lounge demo loops; in a product it dismisses onboarding).
7. Tap "Skip": jumps to slide 3.
8. ArrowRight / ArrowLeft anywhere move one slide.
9. Pressing the button scales it to 0.97 for 160ms.

## Tokens

```css
:root {
  /* colour — deep navy, parchment text, apricot accent */
  --bg: #0e1220;
  --surface: #161b2e;      /* art cards */
  --surface-2: #1f2540;    /* hills, light-sleep bars */
  --surface-3: #1a2038;    /* far hill */
  --ink: #f3efe6;
  --ink-2: #a9adbd;        /* paragraphs, skip */
  --ink-3: #6c7188;        /* inactive dots, axis labels */
  --line: #262c45;         /* card border, ring track */
  --accent: #f0c27b;       /* CTA, active dot, deep-sleep bars, ring, italic words */
  --accent-ink: #2b1d05;   /* text on CTA */
  --moon: #f6e7c6;
  --rem: #8fa3d9;          /* REM bars */
  --glow: rgba(240,194,123,.22);

  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Manrope", system-ui, -apple-system, sans-serif;

  /* layout */
  --header-h: 98px;  --art-h: 380px;  --slide-pad: 28px;
  --r-card: 24px;  --r-btn: 16px;  --cta-h: 56px;
  --dot: 8px;  --dot-active: 24px;  --dot-gap: 6px;
  --footer-bottom: 44px;               /* 34 home indicator + 10 */

  /* motion */
  --t-micro: 160ms;
  --t-dot: 320ms;
  --t-hero: 700ms;
  --t-ring: 1200ms;
  --stagger: 40ms;
  --spring: cubic-bezier(.32, .72, 0, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family           | Size | Weight | Line-height | Tracking | Case      |
|-----------------|------------------|-----:|-------:|------------:|---------:|-----------|
| Brand           | Instrument Serif | 22px | 400 italic | 1.2     | −0.01em  | sentence  |
| Headline        | Instrument Serif | 36px | 400    | 1.1         | −0.015em | sentence; one `<i>` phrase in `--accent` |
| Paragraph       | Manrope          | 15px | 400    | 1.55        | 0        | sentence, `max-width:300px` |
| Skip            | Manrope          | 14px | 600    | 1           | 0        | sentence  |
| CTA             | Manrope          | 16px | 700    | 1           | −0.01em  | sentence  |
| Big stat        | Instrument Serif | 56px | 400    | 1           | −0.02em  | numerals  |
| Ring number     | Instrument Serif | 48px | 400    | 1           | 0        | numerals  |
| Stat caption    | Manrope          | 12px | 500    | 1.2         | +0.08em  | UPPERCASE |
| Axis            | Manrope          | 11px | 500    | 1           | +0.06em  | numerals  |

## Implementation notes

**Derive the index from scroll, never from what you think you did.** One listener covers swipe, keys and buttons:

```js
track.addEventListener('scroll', () => setIdx(Math.round(track.scrollLeft / track.clientWidth)));
function go(i) { track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }); }
function setIdx(i) {
  if (i === idx) return; idx = i;
  dots.forEach((d, k) => d.classList.toggle('on', k === i));
  const last = i === 2, label = last ? 'Get started' : 'Continue';
  if (ctaText.textContent !== label) {
    cta.classList.add('swap');
    setTimeout(() => { ctaText.textContent = label; cta.classList.remove('swap'); }, 160);
  }
  skip.hidden = last;
  track.children[i].querySelectorAll('.bar,.ring').forEach(el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
}
```

**Animating a conic gradient** needs a registered custom property; keep the ring a mask so the centre stays the card colour:

```css
@property --p { syntax: "<percentage>"; inherits: false; initial-value: 0%; }
.ring { width: 200px; height: 200px; border-radius: 50%;
  background: conic-gradient(var(--accent) 0 var(--p, 72%), var(--line) var(--p, 72%) 100%);
  mask: radial-gradient(circle, transparent 78px, #000 79px);
  animation: sweep 1.2s cubic-bezier(.16,1,.3,1) both; }
@keyframes sweep { from { --p: 0% } to { --p: 72% } }
```

**Stagger via a custom property**, so replaying by resetting `animation` does not wipe the delay:

```css
.bar { animation: rise 700ms cubic-bezier(.16,1,.3,1) both; animation-delay: var(--d, 0ms); transform-origin: bottom; }
```

Common mistakes: using `scroll-snap-align:start` with horizontal padding on the track (slides land off-centre); hiding Skip with `visibility` instead of `hidden` (it stays in the tab order); forgetting `overscroll-behavior-x:contain` so a swipe on the first slide triggers browser back-navigation; not handling `resize`, which leaves the track between snap points.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
