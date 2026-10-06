<!-- Design Lounge Nº 114 · "Floating pill navbar" · www.designlounge.live -->

# Floating pill navbar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The top navigation for Solenne, a fictional home-battery company. At the top of the page it is a full-width, transparent 76px bar with cream text sitting over a dusk-landscape hero. Once the page scrolls past 48px it contracts into a 780 × 56px frosted pill that floats 16px below the viewport edge, switches to dark ink, and drops the wordmark and "Sign in" link so only the mark, the five section links and the orange CTA remain. A soft capsule behind the current section's link slides between links as the reader scrolls (scrollspy), with a 4px orange dot that tucks inside the capsule in the pill state. The detail worth copying: the link group keeps identical padding in both states, so the indicator never has to be re-measured mid-transition.

## Structure

```
1280 × 800, page scrolls
┌────────────────────────────────────────────────────────────────────┐
│ ◉ Solenne        [Overview] Battery Installers Pricing Journal   Sign in (Get a quote →) │ 76 full
├────────────────────────────────────────────────────────────────────┤
│ hero photo 680px tall (dusk gradient, sun, hills, house)           │
│   SOLENNE HOME CELL · SERIES 2                                     │
│   Store the                                      13.4 KWH · …      │
│   afternoon.   (156px)                           body 16px / 1.45  │
├────────────┬────────────┬────────────┬─────────────────────────────┤
│ 13.4 kWh   │ 92 %       │ 4,200      │ 15 yr          stats strip  │
├────────────┴────────────┴────────────┴─────────────────────────────┤
│ 02 / BATTERY   h2 84px …   (sections 620px min, 120px top pad)     │
└────────────────────────────────────────────────────────────────────┘

pill state (centered, top 16px):
        ╭──────────────────────────────────────────────────────╮
        │ ◉     [Overview] Battery Installers Pricing Journal  (Get a quote →) │ 780 × 56
        ╰──────────────────────────────────────────────────────╯
```

- `.nav-wrap` — `position:fixed; inset:0 0 auto 0; display:flex; justify-content:center; pointer-events:none`. Only the bar receives pointer events so the wrapper's padding never blocks the page.
- `<nav class="bar" aria-label="Primary">` — flex row, `gap:24px`, all transitions live here.
  - `a.logo` with `.mark` (28px circle, conic gradient, 8px-inset ink dot) and `.word`.
  - `ul.links` (`position:relative; margin:0 auto`) with five `<a href="#id">` and an absolutely positioned `span.ind` (inside an `aria-hidden` `li` with `display:contents`).
  - `a.login`, `a.cta` (40px tall, arrow SVG).
- `<main>`: `#overview` wraps the hero and stats strip; then `section.block#battery`, `#installers`, `#pricing`, `#journal`; a footer.
- Hero image is CSS + one inline SVG: a 5-stop vertical gradient sky, a radial sun at 62% / 60%, two radial hazes, and three hill paths plus a house silhouette with a lit window.

## Motion

| Element        | Trigger            | Property                         | From → To                          | Duration | Easing  |
|----------------|--------------------|----------------------------------|------------------------------------|---------:|---------|
| `.bar`         | scrollY crosses 48 | width                            | 100% → 780px                       | 420ms    | `--expo` |
| `.bar`         | same               | height, padding, border-radius   | 76px, 0 40px, 0 → 56px, 0 8px 0 18px, 999px | 420ms | `--expo` |
| `.bar`         | same               | background, colour, shadow, border | transparent/cream → glass/ink    | 420ms    | `--ease` |
| `.nav-wrap`    | same               | padding-top                      | 0 → 16px                           | 420ms    | `--expo` |
| `.word`, `.login` | same            | max-width, opacity               | 90px/60px, 1 → 0, 0                | 420ms / 160ms | `--expo` / `--ease` |
| `.ind`         | active section changes | transform, width              | previous link → new link           | 420ms    | `--expo` |
| `.ind::after`  | state change       | bottom                           | −9px → 3px                         | 420ms    | `--expo` |
| link           | hover              | opacity                          | .78 → 1                            | 160ms    | `--ease` |
| `.cta`         | hover              | translateY                       | 0 → −1px                           | 160ms    | `--ease` |

Reduced motion: every transition drops to 1ms and `scroll-behavior` returns to `auto`. The two states and the indicator still change; they just snap.

## States

- **Full (top of page):** transparent, cream text, hairline bottom border, wordmark and Sign in visible.
- **Pill (scrolled):** frosted cream glass, ink text, inset top highlight plus 32px soft shadow, wordmark and Sign in hidden.
- **Active link:** `aria-current="true"`, opacity 1, capsule behind it, orange dot.
- **Hover link:** opacity 1, no capsule.
- **Focus-visible (any link or CTA):** 2px `--accent` outline, 3px offset, radius 999px.
- **CTA hover:** lifts 1px; colour unchanged.

## Accessibility

- `<nav aria-label="Primary">` with a real `<ul>` of in-page anchors. The logo link has `aria-label="Solenne home"` because the wordmark disappears in the pill state.
- The current link gets `aria-current="true"` (location within the page, not `page`).
- The indicator is decorative: it lives in an `aria-hidden` list item with `display:contents`, so the list still reports five items.
- Collapsed wordmark and Sign in use `max-width:0` + `opacity:0`, not `display:none`, but Sign in should also get `tabindex="-1"` in the pill state if your framework allows; it stays reachable from the hero.
- Tab order: logo, five links, Sign in, CTA. Focus rings are visible on both cream and glass backgrounds because the outline is orange.
- Contrast: ink on the pill glass over the lightest hero sky is above 9:1; cream on the darkest sky is above 10:1; nav links at .78 opacity remain above 4.5:1 in both states.
- Hit targets: links are 41px tall, the CTA 40px.

## Responsive rules

- **≥ 1280:** as specified; pill width 780px.
- **1024–1279:** pill width `min(780px, calc(100vw - 48px))`; hero display drops to 128px.
- **768–1023:** the five links collapse to Overview, Battery, Pricing; display 104px; the side copy moves under the headline.
- **< 640:** no pill morph of the link row. The full bar is 64px with logo + menu button; on scroll it becomes a 56px pill `calc(100vw - 24px)` wide containing logo, menu button and the CTA. Links live in a sheet. Display 64px.

## Acceptance checklist

- [ ] Full bar is 76px tall with 40px side padding; pill is exactly 780 × 56px, 16px from the top, centred.
- [ ] The morph is triggered by `scrollY > 48` and reverses when scrolling back to the top.
- [ ] Width, height, radius and padding animate together over 420ms `cubic-bezier(.16,1,.3,1)`.
- [ ] Pill uses `backdrop-filter: blur(18px) saturate(1.6)` over `rgba(251,246,238,.58)`, with a 1px white 55% border.
- [ ] Text colour animates cream → ink as the pill forms; no frame shows cream text on cream glass.
- [ ] Wordmark and Sign in collapse without causing the link row to jump.
- [ ] The capsule follows the active section; a section becomes active when its top crosses 40% of the viewport.
- [ ] At the page bottom the last link is active even if its section is short.
- [ ] Capsule slides with `transform` + `width`, never `left`.
- [ ] The orange dot moves from below the capsule to inside it in the pill state.
- [ ] Scroll handler is passive and rAF-throttled.
- [ ] `aria-current="true"` follows the active link.
- [ ] Reduced motion makes both state changes instant.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. On load the page sits at `scrollY = 72` (the demo nudges itself there after 60ms) so the first frame shows the pill over the sky of the hero; scrolling to the top restores the full bar.
2. **Full state** (scrollY ≤ 48): bar spans the viewport, 76px tall, 40px side padding, no background, 1px bottom hairline `rgba(251,246,238,.22)`, cream text. Left: 28px conic-gradient mark + "Solenne" wordmark (19px/600). Centre: five links. Right: "Sign in" text link then the orange "Get a quote" button.
3. **Pill state** (scrollY > 48): over 420ms with expo-out the bar's width goes 100% → 780px, height 76 → 56px, radius 0 → 999px, padding `0 40px` → `0 8px 0 18px`, the wrapper gains 16px top padding, background goes to `rgba(251,246,238,.58)` with `blur(18px) saturate(1.6)`, text colour cream → ink, and a soft shadow appears. The wordmark and "Sign in" collapse via `max-width → 0` and `opacity → 0`.
4. The active-section capsule (full link height, radius 999px) translates and resizes to the current link over 420ms expo-out. Its fill is `rgba(251,246,238,.16)` in the full state and `rgba(19,32,26,.08)` in the pill.
5. The 4px orange dot sits 9px **below** the capsule in the full state and moves to 3px **inside** its bottom edge in the pill state.
6. The current section is the last one whose top edge is above 40% of the viewport height. At the very bottom of the page the last link (Journal) is forced active.
7. Clicking a link smooth-scrolls to its section (`scroll-behavior:smooth`); the capsule follows as sections pass the 40% line.
8. Hovering a link raises its opacity from .78 to 1. The CTA lifts 1px on hover.
9. Scroll handling is rAF-throttled; there is no work on frames without a scroll event.

## Tokens

```css
:root {
  /* colour */
  --page: #f3eee6;               /* page background, warm paper */
  --ink: #13201a;                /* text on light, pill text */
  --ink-2: #4b5a52;              /* body secondary */
  --ink-3: #7a857e;              /* mono meta */
  --line: rgba(19, 32, 26, .12); /* hairlines */
  --cream: #fbf6ee;              /* text on the hero, full-state nav text */
  --accent: #e8542a;             /* CTA, indicator dot, section numbers */
  --accent-ink: #fff7f0;         /* text on accent */
  --glass: rgba(251, 246, 238, .58);      /* pill fill */
  --glass-line: rgba(255, 255, 255, .55); /* pill border */
  --sky-1: #24314a; --sky-2: #5b4a68; --sky-3: #c06e6e; --sky-4: #f0a66e; --sky-5: #f7c98d;
  --hill-far: #6a4d5e; --hill-mid: #2f3836; --hill-near: #161d1a; --window: #ffc985;

  /* type */
  --sans: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --fs-display: 156px; --fs-h2: 84px; --fs-stat: 56px; --fs-lede: 19px;
  --fs-body: 16px; --fs-link: 15px; --fs-cta: 14px; --fs-meta: 12px;

  /* layout */
  --bar-h: 76px; --pill-h: 56px; --pill-w: 780px; --pill-top: 16px;
  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-5: 40px;
  --r-pill: 999px; --r-card: 16px; --r-panel: 20px;

  /* elevation */
  --shadow-pill: 0 1px 0 rgba(255,255,255,.6) inset, 0 12px 32px -12px rgba(19,32,26,.35);
  --blur-pill: blur(18px) saturate(1.6);

  /* motion */
  --t-micro: 160ms;
  --t-layout: 420ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role             | Family              | Size  | Weight | Line-height | Tracking | Case      |
|------------------|---------------------|------:|-------:|------------:|---------:|-----------|
| Hero display     | Bricolage Grotesque | 156px | 600    | 0.86        | −0.055em | sentence  |
| Section h2       | Bricolage Grotesque | 84px  | 600    | 0.92        | −0.045em | sentence  |
| Stat numeral     | Bricolage Grotesque | 56px  | 500    | 1           | −0.04em  | numerals, unit as 20px `sup` |
| Lede             | Bricolage Grotesque | 19px  | 400    | 1.5         | 0        | sentence  |
| Wordmark         | Bricolage Grotesque | 19px  | 600    | 1           | −0.02em  | sentence  |
| Nav link         | Bricolage Grotesque | 15px  | 500    | 1.5         | 0        | sentence  |
| CTA              | Bricolage Grotesque | 14px  | 600    | 1           | 0        | sentence  |
| Kicker / section number | Geist Mono   | 12px  | 500    | 1           | +0.14em / +0.12em | UPPERCASE |
| Stat caption     | Geist Mono          | 12px  | 400    | 1.4         | 0        | lowercase |

Use the `opsz` axis at 96 for the display line so the counters tighten.

## Implementation notes

**One class on the root drives everything.** Put the state on `<html>` so the wrapper, the bar, the wordmark and the indicator can all key off it:

```css
.bar { width: 100%; height: var(--bar-h); padding: 0 40px; border-radius: 0;
  transition: width var(--t-layout) var(--expo), height var(--t-layout) var(--expo),
    padding var(--t-layout) var(--expo), border-radius var(--t-layout) var(--expo),
    background var(--t-layout) var(--ease), color var(--t-layout) var(--ease); }
.pill .nav-wrap { padding-top: var(--pill-top); }
.pill .bar { width: var(--pill-w); height: var(--pill-h); padding: 0 8px 0 18px;
  border-radius: 999px; color: var(--ink); background: var(--glass);
  backdrop-filter: var(--blur-pill); box-shadow: var(--shadow-pill); }
```

**Scrollspy that survives the morph.** Measure the link relative to the `ul`, which keeps the same padding in both states, so the measurement is valid even while the bar is animating:

```js
function place(i) {
  const a = links[i];
  ind.style.width = a.offsetWidth + 'px';
  ind.style.transform = `translateX(${a.offsetLeft}px)`;
}
function update() {
  root.classList.toggle('pill', scrollY > 48);
  const line = innerHeight * 0.4; let cur = 0;
  sections.forEach((s, k) => { if (s.getBoundingClientRect().top <= line) cur = k; });
  if (innerHeight + scrollY >= document.body.scrollHeight - 2) cur = sections.length - 1;
  setActive(cur);
}
addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
```

**Collapse text with max-width, not width or display.** `max-width` from a generous fixed value (90px) to 0 animates without measuring and keeps the element in the accessibility tree.

Common mistakes: animating `left`/`right` on a fixed bar instead of width inside a centring flex wrapper (the pill drifts off-centre mid-animation); forgetting `pointer-events:none` on the wrapper so its 16px padding swallows clicks; putting the backdrop-filter on the wrapper, which blurs a full-width strip instead of the pill; using an IntersectionObserver with a zero threshold, which flickers between two short sections.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
