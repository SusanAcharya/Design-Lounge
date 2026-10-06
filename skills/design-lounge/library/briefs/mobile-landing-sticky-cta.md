<!-- Design Lounge Nº 036 · "Mobile landing with sticky CTA" · www.designlounge.live -->

# Mobile landing with sticky CTA

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A single-scroll mobile marketing page for a fictional savings product ("Loam"). It stacks a sticky translucent header, a serif hero with the rate as the proof point, a horizontally scroll-snapping carousel of four feature cards, a social-proof block, a four-item FAQ accordion and a legal footer. The detail worth copying: a fixed conversion bar (rate + button) that stays hidden while the hero's own button is on screen and slides up from the bottom the moment the hero scrolls out, so the page never shows two primary buttons at once. Warm cream paper, one deep green accent, no shadows except under the bar.

## Structure

```
390 × 844 (54px status reserve above, 80px browser bar below)
┌──────────────────────────────────────┐
│ header 56 ─ ● Loam          Sign in │ sticky, blur
├──────────────────────────────────────┤
│ SAVINGS, DONE PROPERLY               │ eyebrow
│ Money that grows while you           │ h1 44/1.02 Fraunces
│ get on with life.                    │
│ lede 17px (≤ 32ch)                   │
│ [ Open an account ] [See how it works]│ 52px pills, 2-col grid
│ ───────────────────────────────      │
│ 4.35%  AER variable · paid monthly   │
├──────────────────────────────────────┤
│ h2 Built for people who forget…      │
│ ┌───────────┐ ┌───────────┐ ┌──      │ carousel: 300px cards, 12 gap
│ │ card 220+ │ │ card      │ │        │ snap start, 20px gutter
│ └───────────┘ └───────────┘ └──      │
│           ▬ · · ·                    │ dots
├──────────────────────────────────────┤
│ ┌ proof (surface-2, r20) ──────────┐ │
│ │ 5 stars 4.8 from 21,400 reviews    │ │
│ │ The Ledger  Weekend Money  …     │ │
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ h2 Questions, answered               │
│ ─ Is the 4.35% rate fixed?        +  │ details rows, 56px min
│ ─ Can I withdraw whenever…        +  │
│ …                                    │
│ footer (legal, 12px)                 │
├──────────────────────────────────────┤
│ ▲ bar: 4.35% AER  [Open an account]  │ fixed, bottom: 80px
└──────────────────────────────────────┘
```

- `<header class="top">` — `position: sticky; top: 0`, `margin-top: 54px` so it clears the status reserve. Contains the wordmark and a "Sign in" link.
- `<main>` → `<section class="hero">` (eyebrow `<p>`, `<h1>`, `.lede`, `.row` — a `grid-template-columns: 1fr 1fr; gap: 10px` grid of two `<a class="btn">` (52px, `padding: 0 16px`, `white-space: nowrap`) — and `.rate`).
- `<section>` features: `<h2>`, `.sub`, `<div class="carousel" tabindex="0" aria-roledescription="carousel">` of four `<article class="card">`, then `<div class="dots" role="tablist">` populated by JS.
- `<section class="proof">` — star row (five inline SVG stars, rating, count) and a wrapped row of press names set in Fraunces.
- `<section class="faq">` — four native `<details>` / `<summary>` pairs, each with a 20px plus SVG.
- `<footer>` — legal copy; bottom padding is `80px + 96px` so the last row can scroll above the bar.
- `<div class="bar" role="region" aria-label="Open an account">` — fixed, outside `<main>`, with a meta column and one `.btn-primary`.

### Content

- Wordmark: "Loam" with a 10px green dot. Header link: "Sign in".
- Eyebrow: "Savings, done properly". H1: "Money that *grows* while you get on with life." (italic word in accent).
- Lede: "A savings account with a 4.35% variable rate, round-ups from every card payment and no minimum balance. Open one in four minutes."
- Buttons: "Open an account" (primary), "See how it works" (ghost, links to `#faq`).
- Rate row: "4.35%" + "AER variable · interest paid monthly · deposits protected to £85,000".
- Section h2: "Built for people who forget to save"; sub: "Swipe through what Loam does on its own."
- Cards (tag / title / body): Automatic / "Round-ups on every card payment" / "£3.40 coffee becomes £4.00. The 60p lands in savings by midnight." · Goals / "Pots with a finish line" / "Name a pot, set a date, and Loam works out the weekly amount for you." · Payday / "Sweep the leftovers" / "The day before payday, anything above your buffer moves to savings." · Protected / "Covered up to £85,000" / "Deposits held with a regulated bank partner. Withdraw any time, no notice."
- Proof: five stars, "4.8", "from 21,400 reviews"; press names "The Ledger", "Weekend Money", "Fjord Review", "Northern Times".
- FAQ: "Is the 4.35% rate fixed?", "Can I withdraw whenever I want?", "How do round-ups work with shared cards?", "What does Loam cost?" — each with a two-sentence answer.
- Footer: "Loam Savings Ltd" + a two-line fictional regulatory notice.
- Bar: "4.35% AER variable" / "Four minutes to open. No minimum." / "Open an account".

## Motion

| Element            | Trigger                    | Property          | From → To                          | Duration | Easing       | Notes |
|--------------------|----------------------------|-------------------|------------------------------------|---------:|--------------|-------|
| `.bar`             | hero leaves viewport       | transform         | `translateY(calc(100% + 80px))` → `0` | 320ms | `--ease-out` | reverse on hero re-entering |
| `.top` border      | scroll > 0                 | border-color      | transparent → `--line`             | 160ms    | `--ease`     | |
| `.dot::before`     | nearest card changes       | width, background | 6px `--line-strong` → 18px `--accent` | 160ms | `--ease`     | |
| carousel           | dot tap                    | scrollLeft        | current → card offset − 20px       | native smooth | —       | `scroll-snap-type: x mandatory` |
| `details p`        | open                       | opacity, translateY | 0, −4px → 1, 0                   | 320ms    | `--ease-out` | `@keyframes rise` |
| `summary svg`      | open                       | rotate, stroke    | 0 → 45°, `--ink-3` → `--accent`    | 320ms    | `--ease-out` | |
| `.btn-primary`     | hover / active             | background / scale | `--accent` → `--accent-2` / 1 → .98 | 160ms  | `--ease`     | |

Reduced motion: every transition and animation duration becomes 1ms; `scroll-behavior` becomes `auto`. The bar still appears and disappears, instantly.

## States

- **Header stuck:** `.stuck` class adds the 1px bottom hairline. Background is `--bg` at 86% with `backdrop-filter: blur(10px)`.
- **Primary button hover:** background `--accent-2`. **Active:** `scale(.98)`.
- **Ghost button:** transparent, 1px `--line-strong` border, `--ink` text. Hover: no change (touch-first).
- **Focus-visible (links, buttons, dots, summaries):** `outline: 2px solid var(--accent); outline-offset: 3px`.
- **Dot current:** `aria-current="true"`, 18×6 pill in `--accent`. Others: 6px circle in `--line-strong`.
- **FAQ open:** `details[open]` — icon rotated 45° and green; answer visible with rise animation. Only one open at a time.
- **Bar hidden:** `aria-hidden="true"`, translated fully below the viewport (including the 80px reserve) so it never peeks.
- **Bar shown:** `.show`, `aria-hidden="false"`.

## Accessibility

- Header is a `<header>`; content lives in `<main>`; each block is a `<section>` with `aria-labelledby` pointing at its `<h2>` (proof block uses `aria-label`).
- The carousel container is keyboard-scrollable (`tabindex="0"`, `aria-roledescription="carousel"`, `aria-label="Features"`). Arrow keys scroll it natively; dots are `<button role="tab">` with `aria-label="Slide n of 4"` and `aria-current`.
- FAQ uses native `<details>`, so Enter/Space toggle and the state is exposed without ARIA. Hide the marker with `summary { list-style: none }` and `::-webkit-details-marker { display: none }`.
- The star row has `aria-label="Rated 4.8 out of 5"`; the SVGs are decorative.
- The sticky bar is `role="region"` with `aria-label`; toggle `aria-hidden` with visibility so the duplicate CTA is not announced while off screen.
- Hit targets: buttons 52px (bar button 44px), summaries ≥ 56px, dots 24px visual inside a 24px button spaced 6px apart (acceptable as secondary controls; the carousel itself is swipeable).
- Contrast: `--ink-2` on `--bg` 7.4:1; `--ink-3` on `--bg` 4.6:1 (used ≥ 12px); `--accent-ink` on `--accent` 7.1:1.

## Responsive rules

- 390 (reference): as specified. Cards 300px, so ~1.15 cards visible, hinting there is more.
- 360 wide: gutter stays 20px; cards shrink to `min(300px, 100vw - 60px)` so the peek is preserved; H1 drops to 40px.
- ≥ 600 (tablet or desktop preview): cap the content column at 560px centred, keep the bar full-width with the same 560px inner column, and set `--safe-bottom: 0` because there is no bottom browser bar. Carousel cards stay 300px so the snap behaviour is still demonstrable.
- Landscape phone (height < 500): the bar keeps its position; reduce its vertical padding to 8px.

## Acceptance checklist

- [ ] Header is sticky at `top:0` with a 54px top margin, 56px tall, and shows a `--line` bottom border only once the page has scrolled.
- [ ] The bottom bar is fixed at `bottom: 80px`, hidden by `translateY(calc(100% + 80px))`, and becomes visible only when no part of the hero is on screen.
- [ ] Bar show/hide animates over 320ms `cubic-bezier(.16,1,.3,1)` and toggles `aria-hidden`.
- [ ] Carousel uses `scroll-snap-type: x mandatory`; cards are 300px wide with a 12px gap and `scroll-snap-align: start`.
- [ ] Four dots reflect the nearest card; the current dot is an 18×6px green pill.
- [ ] Tapping a dot scrolls the carousel to that card.
- [ ] FAQ is native `<details>`; opening one closes the others; the plus icon rotates 45°.
- [ ] Hero buttons sit side by side in a two-column grid, each 52px tall, neither wrapping its label at 390px.
- [ ] H1 is Fraunces 44px, line-height 1.02, tracking −0.025em, with the italic word in `--accent` at weight 600.
- [ ] Only one primary button is visible at any scroll position (hero button or bar button, never both).
- [ ] All interactive elements show a 2px `--accent` outline on `:focus-visible`.
- [ ] No fixed element occupies the top 54px or bottom 80px.
- [ ] Reduced motion: bar and accordion still work, with ≤ 1ms motion.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: header at the top (below the 54px status-bar reserve), hero visible with eyebrow, 44px headline, lede, two buttons and the rate row. No bottom bar is visible.
2. Scroll down 1px or more: the header gains a 1px `--line` bottom border (it stays sticky at `top:0`, translucent with a 10px blur).
3. Keep scrolling until the hero's bottom edge passes under the header: the bottom bar slides up from `translateY(100% + 80px)` to `translateY(0)` over 320ms `--ease-out`. Its `aria-hidden` flips to `false`.
4. Scroll back so any part of the hero is visible again: the bar slides down and `aria-hidden` returns to `true`. This is the replay.
5. Swipe the feature carousel: cards are 300px wide with a 12px gap and snap to the left gutter (`scroll-snap-align: start`). Four dot indicators below update as the nearest card changes; the current dot stretches from a 6px circle to an 18×6 pill in `--accent`.
6. Tap a dot: the carousel scrolls smoothly to that card.
7. Tap an FAQ question: its answer appears with a 4px rise + fade over 320ms; the plus icon rotates 45° into a cross and turns `--accent`. Opening one question closes any other open question.
8. Tap either "Open an account" button: no navigation in the demo (href `#`), but it is the only primary action on the page.

## Tokens

```css
:root {
  /* colour — warm cream paper, one deep green accent */
  --bg: #f6f1e8;           /* page */
  --surface: #fffdf8;      /* cards, sticky bar */
  --surface-2: #ece5d8;    /* proof block */
  --line: #e0d7c6;         /* hairlines */
  --line-strong: #c9bea8;  /* ghost button border, idle dots */
  --ink: #1e1b16;          /* headings, body */
  --ink-2: #5d564b;        /* lede, answers */
  --ink-3: #8a8273;        /* meta, footer */
  --accent: #2f6b3a;       /* buttons, eyebrow, icons, active dot */
  --accent-2: #245430;     /* button hover */
  --accent-ink: #f6f1e8;   /* text on accent */
  --accent-soft: #dfe9d9;  /* card tag background */

  /* type */
  --serif: "Fraunces", Georgia, serif;
  --sans: "Instrument Sans", system-ui, sans-serif;

  /* layout */
  --safe-top: 54px;        /* status bar reserve (Lounge draws it) */
  --safe-bottom: 80px;     /* browser URL bar reserve (Lounge draws it) */
  --gutter: 20px;
  --card-w: 300px;
  --card-gap: 12px;
  --r: 12px;
  --r-lg: 20px;
  --r-pill: 999px;
  --shadow-bar: 0 -8px 24px rgba(30, 27, 22, .10);

  /* motion */
  --t-fast: 160ms;
  --t-layout: 320ms;
  --t-hero: 600ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family          | Size | Weight | Line-height | Tracking | Case      |
|-----------------|-----------------|-----:|-------:|------------:|---------:|-----------|
| Body            | Instrument Sans | 15px | 400    | 1.5         | 0        | sentence  |
| Wordmark        | Fraunces        | 22px | 600    | 1           | −0.02em  | sentence  |
| Eyebrow         | Instrument Sans | 12px | 500    | 1           | +0.12em  | UPPERCASE |
| H1              | Fraunces (opsz 144) | 44px | 400 (em: 600 italic) | 1.02 | −0.025em | sentence |
| Lede            | Instrument Sans | 17px | 400    | 1.5         | 0        | sentence  |
| Button          | Instrument Sans | 16px | 600    | 1           | 0        | sentence  |
| Rate figure     | Fraunces        | 32px | 600    | 1           | −0.03em  | numerals  |
| Section h2      | Fraunces        | 24px | 600    | 1.15        | −0.02em  | sentence  |
| Card h3         | Fraunces        | 20px | 600    | 1.2         | −0.01em  | sentence  |
| Card tag        | Instrument Sans | 11px | 500    | 1           | +0.08em  | UPPERCASE |
| FAQ question    | Instrument Sans | 16px | 500    | 1.35        | 0        | sentence  |
| FAQ answer, card body | Instrument Sans | 14px | 400 | 1.5       | 0        | sentence  |
| Bar title       | Instrument Sans | 15px | 600    | 1.2         | 0        | sentence  |
| Footer          | Instrument Sans | 12px | 400    | 1.6         | 0        | sentence  |

## Implementation notes

**Drive the bar from an IntersectionObserver, not a scroll listener.** Observe the hero with a `rootMargin` equal to the header height so "hero gone" means "gone under the header", and check `boundingClientRect.top < 0` so the bar never appears when the hero is below the viewport (e.g. on a deep-link scroll-up):

```js
const hero = document.getElementById('hero'), bar = document.getElementById('bar');
new IntersectionObserver(([e]) => {
  const past = !e.isIntersecting && e.boundingClientRect.top < 0;
  bar.classList.toggle('show', past);
  bar.setAttribute('aria-hidden', String(!past));
}, { threshold: [0, 1], rootMargin: '-56px 0px 0px 0px' }).observe(hero);
```

**Hide the bar below the reserved browser-bar area**, otherwise it peeks above the URL bar while hidden:

```css
.bar { position: fixed; left: 0; right: 0; bottom: var(--safe-bottom);
       transform: translateY(calc(100% + var(--safe-bottom)));
       transition: transform var(--t-layout) var(--ease-out); }
.bar.show { transform: translateY(0); }
```

**Dot sync with rAF throttling.** Card pitch is width + gap (312px); round the scroll offset to the nearest pitch:

```js
let raf = 0;
car.addEventListener('scroll', () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const i = Math.round(car.scrollLeft / 312);
    dots.forEach((d, j) => d.setAttribute('aria-current', String(j === i)));
  });
});
```

Common mistakes: forgetting `padding-bottom` on the footer so the last FAQ row is trapped under the bar; using `display:none` for the hidden bar (kills the slide); naming a global `const top` (collides with `window.top` and throws in strict environments); hiding the `<details>` marker only with `list-style` and leaving the WebKit marker.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
