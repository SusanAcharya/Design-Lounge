<!-- Design Lounge Nº 142 · "Stacking cards on scroll" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Stacking cards on scroll

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A product-routine page for a fictional skincare brand, Ondine. Five large step cards (Cleanse, Tone, Treat, Moisturise, Protect) each stick near the top of the viewport; the next card slides up over the previous one, and the one underneath scales down and dims slightly, so by the end the steps sit in a tidy pile with a 16px sliver of each earlier card showing like file-folder tabs. The feeling is calm and tactile: pastel paper cards, soft shadows, one terracotta accent. The detail worth copying is that the whole stack is driven by a single CSS view timeline on the list, with each card taking its own slice of it through `calc()`-based `animation-range`, so there is no scroll listener in browsers that support scroll-driven animations.

## Reference behaviour

1. Initial frame (scrollY 0): nav bar (72px), a two-line 96px headline "Five steps. / One slow morning." with "slow" in terracotta, a 300px intro column on the right with a "Scroll to build it" cue whose arrow bobs 4px every 1.8s, and the top 450px of the first card (blush) filling the lower half of the frame.
2. A fixed step rail sits 28px from the right edge, vertically centred: labels 01–05 with a short tick; the current step's tick widens from 8px to 20px and turns terracotta.
3. Scrolling: when the list's top reaches the viewport top, card 1 is already stuck at `top: 40px`. Card 2 rises from below and sticks at 56px (40 + 16), card 3 at 72px, card 4 at 88px, card 5 at 104px.
4. While card k+1 travels the height of one card (≈ 600px of scroll), card k animates from `scale(1)` to `scale(1 − (4 − k) × 0.035)` (so card 1 ends at 0.86, card 4 at 0.965) with `transform-origin: 50% 0`, and a dark overlay on it fades from 0 to 0.16 opacity. Because origin is the top edge, the shrinking cards keep their top edges visible as stacked tabs.
5. The last card never scales. After it sticks, the whole pile scrolls away together and a summary row appears: "Your routine, stacked." with Steps, Time and Total.
6. Each card has an "Add to routine" pill button. Clicking toggles `aria-pressed`, swaps a plus icon for a tick, inverts the pill to ink, and updates the summary's step count ("2 of 5") and total (starts at €46: Milk Cleanser €24 + Birch Mist €22).
7. Clicking a rail label smooth-scrolls to the scroll offset at which that card becomes stuck.
8. Reduced motion: cards do not scale or dim; they still stick and overlap (sticking is layout, not animation). The arrow does not bob.

## Structure

```
1280 × 800, document scrolls (≈ 4050px tall)
┌──────────────────────────────────────────────────────────────────────┐
│ nav 72: ● Ondine   Routines  Skin quiz  Ingredients  Journal  (Bag·2)│
│                                                                      │
│ Five steps.                                    intro 15px, 300 wide  │
│ One slow morning.        (96px, -0.045em)      ↓ SCROLL TO BUILD IT  │
│ ┌──────────────────────────────────────────────────────────┐   01 ── │
│ │ Step 01 / 05        07:02 │ ┌──────── art panel ───────┐ │   02 —  │
│ │                           │ │ PUMP · 150 ML  ╭───╮      │ │   03 —  │
│ │ CLEANSE                   │ │              ╭─┤ ▮ ├─╮    │ │   04 —  │
│ │ Milk  (112px light)       │ │              │ bottle │   │ │   05 —  │
│ │ copy 38ch                 │ │ ─────────── floor 96 ──── │ │         │
│ │ TIME | AMOUNT | KEY       │ └───────────────────────────┘ │         │
│ │ Milk Cleanser  €24 (+ Add)│                               │         │
└─┴───────────────────────────┴───────────────────────────────┴─────────┘
  card: 1120 × 580, x = 80; grid 500px | 1fr, gap 16, padding 16
  stuck tops: 40, 56, 72, 88, 104 (top + i × 16)
```

- `<header class="nav">`: logo link (18px gradient disc + wordmark 19/600), `<nav aria-label="Main">` with four links, "Bag · 2" pill link pushed right.
- `<section class="hero">`: 2-column grid `1fr 300px`, aligned to the bottom, 238px tall. `<h1>` with an `<em>`.
- `<ol class="stack">` with `view-timeline: --stack block`; five `<li style="--i:0..4">`, each `position: sticky; top: 0; padding-top: calc(40px + var(--i) * 16px)`.
  - `<article class="card" aria-labelledby>`: `.txt` column (step label row, `<h2>` with a mono kicker `<span>`, `<p>`, `<dl class="meta">` with three `dt/dd` pairs, buy row with `<button class="add" aria-pressed>`), and `.art` panel.
  - `.art`: tinted panel with a radial highlight, an arch (`::before`, 300 × 380, radius 150px 150px 0 0), a floor band (`::after`, 96px), a mono tag, and `.obj` (product built from a `.cap` and `.body`).
- `<section class="sum">`: 72px light headline + `<dl>` of three stats.
- `<footer>`, then `<nav class="rail" aria-label="Steps">` (fixed, buttons generated by JS).

## Tokens

```css
:root {
  /* surfaces and ink */
  --bg: #f3eee7;        /* warm paper page */
  --ink: #2a2420;       /* text, pills, caps */
  --ink-2: #62574f;     /* secondary text, mono labels */
  --line: #ddd3c8;      /* summary rule */
  --accent: #b4532a;    /* terracotta: "slow", kickers, active rail tick */

  /* card + art panel pairs */
  --c1: #f1d9cf; --a1: #e5bfae;   /* blush, Cleanse */
  --c2: #dce3d3; --a2: #c3d0b6;   /* sage, Tone */
  --c3: #f2e6c2; --a3: #e4d095;   /* butter, Treat */
  --c4: #d9e1e8; --a4: #bccad7;   /* mist, Moisturise */
  --c5: #ebcdb8; --a5: #dbae90;   /* clay, Protect */

  /* type */
  --sans: "Onest", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --fs-hero: 96px; --fs-card: 112px; --fs-sum: 72px; --fs-body: 16px; --fs-label: 11px;

  /* stack geometry */
  --n: 5;
  --top: 40px;          /* first stuck card's top */
  --step: 16px;         /* extra offset per card */
  --card-h: 580px;
  --r: 28px;            /* card radius */
  --r-art: 18px;        /* art panel radius */
  --gutter: 80px;

  /* depth */
  --shadow: 0 -1px 0 rgba(255,255,255,.6) inset, 0 30px 60px -36px rgba(74,48,32,.45);
  --dim-max: .16;       /* overlay opacity on a fully covered card */
  --scale-step: .035;   /* scale lost per card above */

  /* motion */
  --t-micro: 180ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --bob: 1.8s;
}
```

## Typography

| Role             | Family     | Size  | Weight | Line-height | Tracking  | Case      |
|------------------|------------|------:|-------:|------------:|----------:|-----------|
| Hero headline    | Onest      | 96px  | 400    | 0.96        | −0.045em  | sentence  |
| Card title       | Onest      | 112px | 300    | 0.9         | −0.055em  | sentence  |
| Card kicker      | Geist Mono | 13px  | 500    | 1           | +0.12em   | UPPERCASE |
| Step label row   | Geist Mono | 12px  | 500    | 1           | +0.12em   | sentence  |
| Body / card copy | Onest      | 16px  | 400    | 1.55        | 0         | sentence  |
| Meta `dt`        | Geist Mono | 10px  | 500    | 1.4         | +0.12em   | UPPERCASE |
| Meta `dd`        | Onest      | 15px  | 500    | 1.4         | 0         | sentence  |
| Pill button      | Onest      | 14px  | 500    | 1           | 0         | sentence  |
| Summary headline | Onest      | 72px  | 300    | 1           | −0.04em   | sentence  |
| Rail labels      | Geist Mono | 11px  | 500    | 1           | 0         | numerals  |

## Motion

| Element              | Trigger                 | Property                 | From → To                              | Duration / range                                                 | Easing  |
|----------------------|-------------------------|--------------------------|----------------------------------------|------------------------------------------------------------------|---------|
| `.card` k (0–3)      | scroll, `--stack` view timeline | transform, `--dim` | scale(1), 0 → scale(1 − (4 − k) × .035), .16 | `exit-crossing k/5 × 100%` → `exit-crossing (k+1)/5 × 100%` | linear (scroll-linked) |
| `.card` 4            | —                       | —                        | never animates                         | —                                                                | —       |
| `.cue svg`           | load, infinite          | translateY               | 0 → 4px → 0                            | 1.8s                                                             | `--ease` |
| `.add` pill          | hover / press           | background, colour       | transparent/ink → ink/paper            | 180ms                                                            | `--ease` |
| rail tick            | active step changes     | width, colour            | 8px ink-2 → 20px terracotta            | 180ms                                                            | `--ease` |
| rail click           | click                   | window scroll            | current → card's stuck offset          | browser smooth scroll                                            | native  |

Reduced motion: remove the card animation entirely (`animation: none`), stop the bob, set transitions to 1ms, and use `behavior: 'auto'` for rail scrolling. Cards still stick and overlap.

## States

- **Card resting (uncovered):** scale 1, overlay 0, shadow as token.
- **Card covered:** scaled per its depth, overlay `#2a2420` at 0.16.
- **Pill default:** 44px tall, 1px ink border, transparent fill, plus icon, "Add to routine".
- **Pill hover:** ink fill, paper text.
- **Pill pressed (`aria-pressed="true"`):** ink fill, tick icon, label "In routine". Cards 1 and 2 start pressed.
- **Focus-visible (all controls):** 2px terracotta outline, 3px offset.
- **Rail active (`aria-current="step"`):** ink label, 20px terracotta tick.

## Accessibility

- The list is an `<ol>`, so the step order is announced. Each card is an `<article aria-labelledby>` pointing at its `<h2>`.
- Meta is a real `<dl>` (Time, Amount, Key).
- Pills are `<button aria-pressed>`; the visible label also changes, so it reads correctly either way.
- Rail buttons have `aria-label="Step 3: Treat"`; the current one carries `aria-current="step"`.
- Body copy `--ink-2` on the pastel cards is ≥ 5.6:1; `--ink` on any card ≥ 11:1. Terracotta kickers are 13px bold-ish mono at 4.6:1 on blush.
- Overlap is visual only; DOM order is the reading order, and Tab moves card by card through the pills.
- Hit targets: pills 44px tall, rail rows 22px tall but 60px wide; add vertical padding if the rail is used on touch.

## Responsive rules

- ≥ 1280: as specified; gutters 80px.
- 1024–1279: gutters 48px; card grid becomes `440px 1fr`; card title 96px.
- 768–1023: card height 640px, stacked internally (art panel 260px on top, text below); stuck offsets stay 40 + i × 16; hide the rail.
- < 640: gutters 16px, `--step: 10px`, card title 64px, hero 52px. Keep the stacking: it reads well on phones. Drop the dim overlay to 0.1.

## Acceptance checklist

- [ ] First frame shows the headline, intro, scroll cue and the top 450px of card 1; nothing overlaps the rail.
- [ ] Cards stick at tops 40, 56, 72, 88 and 104px exactly.
- [ ] Each earlier card ends at scale 0.86 / 0.895 / 0.93 / 0.965 (cards 1–4); card 5 stays at 1.
- [ ] Scaling uses `transform-origin: 50% 0` so the earlier cards' top edges stay visible as 16px tabs.
- [ ] A covered card's overlay reaches 0.16 opacity at the moment the next card sticks.
- [ ] In Chromium the effect runs with zero scroll listeners touching transforms (scroll-driven animation only).
- [ ] In browsers without `animation-timeline`, the JS fallback produces the same visual result.
- [ ] Rail highlights the current step and scrolls to it on click.
- [ ] "Add to routine" toggles `aria-pressed`, swaps icon and label, and updates the summary count and total.
- [ ] Focus rings are visible on nav links, pills and rail buttons.
- [ ] With reduced motion, no card scales or dims and the arrow is still.
- [ ] No horizontal overflow at 1280 × 800.

## Implementation notes

**One timeline, five slices.** Put the view timeline on the list, not on each sticky card (a sticky element's own view progress barely changes while it is stuck). Each card claims 1/n of the list's `exit-crossing` range:

```css
.stack { view-timeline: --stack block; }
.stack > li { position: sticky; top: 0; padding-top: calc(var(--top) + var(--i) * var(--step)); }
.card {
  transform-origin: 50% 0;
  animation: recede linear both;
  animation-timeline: --stack;
  animation-range: exit-crossing calc(var(--i) / var(--n) * 100%)
                   exit-crossing calc((var(--i) + 1) / var(--n) * 100%);
}
@keyframes recede { to { transform: scale(calc(1 - (var(--n) - 1 - var(--i)) * .035)); --dim: .16; } }
@property --dim { syntax: "<number>"; inherits: true; initial-value: 0; }
.card::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: #2a2420; opacity: var(--dim); }
```

`--dim` must be registered with `inherits: true`, otherwise the `::after` never sees the animated value.

**Fallback without a second set of keyframes.** Pause the same animation with a 1s duration and scrub it with a negative delay:

```js
if (!CSS.supports('animation-timeline: view()')) {
  cards.slice(0, -1).forEach(c => c.style.animation = 'recede 1s linear both paused');
  addEventListener('scroll', () => requestAnimationFrame(() => {
    const p = (scrollY - stack.offsetTop) / stack.offsetHeight;
    cards.slice(0, -1).forEach((c, i) => {
      const t = Math.min(1, Math.max(0, p * cards.length - i));
      c.style.animationDelay = -t + 's';
    });
  }), { passive: true });
}
```

**Products are two divs.** Each bottle is a `.cap` plus a `.body` whose cylinder shading is a single gradient layered over a base colour, sized by custom properties per variant (pump, atomiser, dropper, jar, tube with a `clip-path` taper):

```css
.body { width: var(--bw); height: var(--bh); border-radius: var(--br);
  background: linear-gradient(90deg, rgba(0,0,0,.12), rgba(255,255,255,.55) 28%, rgba(255,255,255,0) 52%, rgba(0,0,0,.1)), var(--bc); }
.o5 .body { clip-path: polygon(0 0, 100% 0, 88% 100%, 12% 100%); }
```

Common mistakes: putting `overflow: hidden` on any ancestor of the sticky `<li>` (sticking silently stops); scaling from the centre, which hides the tabs; animating the last card, which leaves a gap at the end of the pile; and using `filter: brightness()` for the dim, which repaints every frame on large cards.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
