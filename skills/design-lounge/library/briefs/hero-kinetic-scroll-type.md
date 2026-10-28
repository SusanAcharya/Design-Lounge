<!-- Design Lounge Nº 551 · "Kinetic scroll type hero" · www.designlounge.live -->

# Kinetic scroll type hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The top of a site for Pacekeeper, an invented chip-timing company for road races. The headline "Split every second." is set in Anybody, a variable font with a width axis from 50 to 150, at up to 184px across three lines. The hero is pinned for the first 560px of scroll, and over that distance the three lines trade places in width and weight: the wide black first line goes condensed and light, the condensed light second line goes wide and black, the third line narrows. The pointer adds weight to whichever line it is nearest. The product sentence, buttons and race clock beneath a hairline never move, so the page stays readable while the type performs.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ ◷ Pacekeeper          Timing  Live results  Race directors  Pricing [Book a demo] │ nav 64, sticky
├──────────────────────────────────────────────────────────────────────┤
│ • LIVE NOW: LISBON HALF, 11,402 ON COURSE        CHIP TIMING SINCE 2014 │ meta 12px caps
│ SPLIT                               (184px, wdth 150, wght 820)       │
│            EVERY                    (wdth 62, wght 300, +14vw)         │
│                         SECOND▪     (wdth 112, wght 880, right)        │
│                                                                       │
│ ───────────────────────────────────────────────────────────────────── │ hairline
│ product sentence 16/1.55   [Book a demo →] [See Lisbon Half results]   RACE CLOCK │
│ max 440px                                                  01:12:44.3 │
└──────────────────────────────────────────────────────────────────────┘
.pin is 100vh − 64 + 560px tall; .hero inside it is sticky at top 64, height 100vh − 64 (min 736)
padding 28 / 48 / 36
```

- `<nav aria-label="Primary">` sticky, logo link, `<ul>` of four links, small lime button.
- `<main>` → `.pin` (div) → `<section class="hero" aria-labelledby="h">`: `.meta` row, `<h1 id="h" aria-label="Split every second.">` holding three `aria-hidden` `span.ln` lines, `.product` grid (paragraph, button row, clock).
- `<section class="results">` with `h2` and a five-row `<table>`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
|---|---|---|---|---|---|
| Line 1 | scroll 0–560px | font-stretch, font-weight, translateX | 150%/820/0 → 55%/300/30vw | scroll-linked | linear (scroll is the clock) |
| Line 2 | same | same | 62%/300/14vw → 150%/860/0 | scroll-linked | linear |
| Line 3 | same | same | 112%/880/0 → 52%/680/−4vw | scroll-linked | linear |
| Pointer weight | pointermove on hero | `--pw` per line | 0 → up to 1 | 420ms | expo out |
| Live dot | always | opacity | 1 → .35 → 1 | 1.6s loop | standard |
| Clock | always | text | +0.1s | 100ms interval | none |
| Buttons | hover / active | brightness / translateY | 1 → 1.08 / 0 → 1px | 160ms | standard |

Reduced motion removes all of the above; the first frame is complete on its own.

## States

- **Scroll 0:** first-frame layout above.
- **Pinned, mid scroll:** lines interpolated; the product row unchanged.
- **Released:** hero scrolls away at `--s = 1`; results table follows.
- **Pointer near a line:** that line's weight shifts by its `--pw` amount.
- **Primary button hover:** brightness 1.08. **Ghost button:** transparent with a 1.5px `--ink-3` ring (5.4:1 on `--bg`); hover ring turns `--ink`.
- **Focus-visible:** 2px lime outline, 3px offset.

## Accessibility

- The `h1` carries `aria-label="Split every second."`; the three line spans are `aria-hidden`, so a screen reader hears one sentence, not three fragments.
- The clock is `aria-live="off"` so it never chatters.
- Contrast: `--ink` on `--bg` 16.9:1; `--ink-2` on `--bg` 8.1:1; `--accent-ink` on lime 14:1.
- Keyboard: logo, four nav links, Book a demo (nav), Book a demo, See Lisbon Half results. The animation is decoration and needs no control.
- Reduced motion stops the scroll effect entirely, not just its easing.

## Responsive rules

- **≥1280:** as drawn, 48px gutters.
- **1024:** display size follows 13.6vw (≈139px); same pin.
- **<900 (phone at 390):** nav links hide; gutters 16px; the pin is removed (`.pin` height auto, hero position relative) so phones scroll normally while `--s` still runs over the first 560px; headline `clamp(48px, 17vw, 120px)`; product row stacks to one column with the clock left aligned; results table hides the Club column. No sideways scroll: the hero has `overflow:hidden` and body `overflow-x:hidden`.

## Acceptance checklist

**Always**
- [ ] The headline is one `h1` with an `aria-label`; visual lines are `aria-hidden` spans.
- [ ] Width and weight are animated with `font-stretch` and `font-weight` driven by one registered number, not by swapping fonts.
- [ ] The hero is pinned for exactly the animation range, so the whole effect is seen before the section leaves.
- [ ] The product sentence and buttons do not move, scale or change weight at any point.
- [ ] `@supports (animation-timeline: scroll())` gates the CSS path; a rAF scroll listener covers the rest.
- [ ] Reduced motion leaves the headline static, in its first-frame state, with no pointer response.
- [ ] Ghost button ring is at least 3:1 against the page.
- [ ] No horizontal scroll at 390 wide; long lines are clipped by the hero, not the page.

**This demo**
- [ ] Headline is "Split every second." with a lime full stop, 184px at 1280.
- [ ] Line 1 goes 150%/820 → 55%/300 and moves right 30vw over 560px of scroll.
- [ ] Line 2 goes 62%/300 → 150%/860 and slides from 14vw to 0.
- [ ] The race clock reads "01:12:44.3" at load and counts tenths.
- [ ] Results table lists Inês Varela first at 00:47:12.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state (scroll 0): "SPLIT" at width 150%, weight 820, flush left; "EVERY" at width 62%, weight 300, indented 14vw; "SECOND." at width 112%, weight 880, right aligned, with the full stop in lime `#C8F25A`.
2. Scroll the page: the hero sticks under the 64px nav for 560px. A registered custom property `--s` runs 0 → 1 over that range (CSS scroll-driven animation on the root scroller).
3. As `--s` rises: line 1 width 150 → 55, weight 820 → 300, moves right 0 → 30vw. Line 2 width 62 → 150, weight 300 → 860, moves left 14vw → 0. Line 3 width 112 → 52, weight 880 → 680, moves left 0 → 4vw. Scrolling back reverses exactly.
4. After 560px the pin releases and a results table ("Lisbon Half, leaders at 15 km", five rows) scrolls up.
5. Pointer over the hero: each line gets `--pw` = 1 − (vertical distance from pointer to line centre ÷ 1.4 × line height), clamped at 0. Line 1 gains up to 80 weight, line 2 up to 500, line 3 loses up to 300. `--pw` is a registered number, so it eases over 420ms expo out.
6. Pointer leaves: all `--pw` return to 0 over 420ms.
7. The race clock "01:12:44.3" counts up in tenths (100ms interval) to show the product is live; the meta row dot pulses opacity 1 → 0.35 on a 1.6s cycle.
8. No scroll-timeline support: a passive scroll listener writes `--s = min(1, scrollY / 560)` in one rAF. Reduced motion: no scroll animation, no pointer response, no clock ticking, no pulse; the headline rests in its first-frame state.

## Tokens

```css
:root {
  --bg: #0e1013;        /* page */
  --bg-2: #16191d;      /* results band */
  --line: #2a2e34;      /* hairlines */
  --ink: #f1efe8;       /* headline, strong text */
  --ink-2: #a9a79f;     /* body, meta */
  --ink-3: #8a8880;     /* ghost button ring */
  --accent: #c8f25a;    /* full stop, live dot, primary button */
  --accent-ink: #141a05;
  --font: "Anybody", system-ui, sans-serif;   /* wdth 50..150, wght 100..900 */
  --fs-display: clamp(64px, 13.6vw, 184px);
  --fs-clock: 34px; --fs-h2: 40px; --fs-lede: 16px; --fs-body: 15px; --fs-nav: 14px; --fs-meta: 12px; --fs-label: 11px;
  --space: 4px 8px 10px 16px 20px 28px 40px 48px 72px;
  --r-btn: 4px;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-micro: 160ms;
  --t-weight: 420ms;
  --pin-range: 560px;
}
@property --s  { syntax: "<number>"; inherits: true;  initial-value: 0; }
@property --pw { syntax: "<number>"; inherits: false; initial-value: 0; }
```

## Typography

| Role | Family | Size | Width | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|---|
| Headline line 1 | Anybody | 184px | 150% → 55% | 820 → 300 (+80 pointer) | 0.84 | -0.01em | upper |
| Headline line 2 | Anybody | 184px | 62% → 150% | 300 → 860 (+500 pointer) | 0.84 | -0.01em | upper |
| Headline line 3 | Anybody | 184px | 112% → 52% | 880 → 680 (−300 pointer) | 0.84 | -0.01em | upper |
| Logo | Anybody | 17px | 125% | 800 | 1 | 0.01em | |
| Results h2 | Anybody | 40px | 120% | 800 | 1.1 | -0.01em | upper |
| Race clock | Anybody | 34px | 80% | 600 | 1.1 | -0.01em | tabular |
| Product sentence | Anybody | 16px | 100% | 400, lead clause 600 | 1.55 | 0 | |
| Buttons | Anybody | 14px | 110% | 700 | 1 | 0.01em | |
| Meta, labels | Anybody | 12px / 11px | 100% | 600 | 1.4 | 0.1em | upper |

One family. The width axis does the work a second family would normally do: the clock is condensed, the logo and h2 are extended.

## Implementation notes

**One number drives everything.** Register `--s`, animate it on the root scroll timeline, and derive axis values with `calc()`:

```css
@property --s { syntax: "<number>"; inherits: true; initial-value: 0; }
@keyframes squeeze { to { --s: 1; } }
@supports (animation-timeline: scroll()) {
  h1 { animation: squeeze linear both; animation-timeline: scroll(root block); animation-range: 0 560px; }
}
.l1 { font-stretch: calc((150 - var(--s) * 95) * 1%);
      font-weight: calc(820 - var(--s) * 520 + var(--pw) * 80);
      transform: translateX(calc(var(--s) * 30vw)); }
```

**Pin for the range.** The wrapper is taller than the hero by exactly the animation range:

```css
.pin  { height: calc(100vh - 64px + 560px); }
.hero { position: sticky; top: 64px; height: calc(100vh - 64px); overflow: hidden; }
```

**Pointer weight eases for free.** Because `--pw` is a registered `<number>`, a transition on it interpolates the weight; JS only writes the target:

```js
lines.forEach((l) => {
  const b = l.getBoundingClientRect();
  const d = Math.abs(e.clientY - (b.top + b.height / 2)) / (b.height * 1.4);
  l.style.setProperty('--pw', Math.max(0, 1 - d).toFixed(3));
});
```

Common mistakes: loading the font without the `wdth` axis (`family=Anybody:wdth,wght@50..150,100..900`), so stretch does nothing; animating `font-variation-settings` strings, which cannot be combined from two sources; letting the product copy sit inside the animated element; using outline text for a light line, which fails contrast checks.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
