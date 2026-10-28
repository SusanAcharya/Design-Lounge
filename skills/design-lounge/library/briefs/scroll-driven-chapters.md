<!-- Design Lounge Nº 593 · "Scroll-driven chapters" · www.designlounge.live -->

# Scroll-driven chapters

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A magazine long read ("The ferry that waits for the tide", Tideline Quarterly, issue 14) split into four chapters, each with its own colour world: dawn cream, sea teal, marsh green and dusk wine. A fixed 240px rail on the left lists the chapters; a 2px bar beside each chapter name fills top to bottom as you read that chapter, and the whole rail (panel, ink, accent) swaps to the chapter's colours the moment the chapter's top passes the middle of the screen. Each chapter's background tints in from the previous chapter's colour, and each drawn plate settles from 1.22x scale and 55% saturation to rest as it crosses the viewport. All of it runs on CSS `view-timeline` with `timeline-scope`, no scroll listener; a 40-line JS fallback produces the same states where scroll-driven animations are missing. The detail worth copying: four named view timelines hoisted to `body` drive both the content and a fixed element that sits outside every chapter.

## Structure

```
1280 × 800 (document scrolls; ~5,600px tall)
┌──────────────┬──────────────────────────────────────────────────────────┐
│ RAIL 240     │ COVER 100vh (min 640)  padding 56 64 48 264              │
│ fixed        │  kicker 12px caps                                        │
│ Tideline     │  H1 104px/0.94, max-width 960                            │
│ Quarterly    │  standfirst 22px (max 520) ········· byline right        │
│              │ ┌──────────────────────────────────────────────────────┐ │
│ ▌Chapter one │ │ plate, flex 1, min 180                               │ │
│ ▏Chapter two │ └──────────────────────────────────────────────────────┘ │
│ ▏Chapter 3   ├──────────────────────────────────────────────────────────┤
│ ▏Chapter 4   │ CHAPTER (full-bleed bg, padding 120 64 140 264)          │
│              │  kicker · H2 88px italic                                 │
│ 14 min read  │  body column 640  (drop cap 76px)                        │
│              │  plate max 960 × clamp(240, 52vh, 440) · caption row     │
└──────────────┴──────────────────────────────────────────────────────────┘
```

- `<nav class="rail" aria-label="Chapters">`: `position:fixed; left:0; top:0; bottom:0; width:240px; padding:40px 32px`, flex column with `justify-content:space-between`. Holds `<a class="mast">`, `<ol class="toc">` of four `<li>` → `<a href="#cN">` with `.kick` and `<b>`, then `<p class="meta">`.
- `<main>` holds `<section class="cover">`, four `<section class="ch" id="c1..c4" aria-labelledby>` and `<footer class="end">`. Sections are full-bleed and carry `padding-left: calc(240px + 24px)` so their colour runs under the rail.
- Each chapter: `<header>` (kicker + `<h2>`), paragraphs, `<figure class="plate">` with one inline SVG (viewBox 1000×440, `preserveAspectRatio="xMidYMid slice"`), and a `<figcaption>` with the caption left and "Plate N" italic right.
- `body` declares `timeline-scope: --c1, --c2, --c3, --c4`; each chapter declares `view-timeline: --cN`.

## Motion

| Element | Timeline | Range | Property | From → To | Notes |
|---|---|---|---|---|---|
| `.ch` background | `view()` | entry 0% → entry 45% | background-color | previous chapter ground → own ground | linear, fill both |
| `.ch` text | `view()` | same | color | previous ink until 50% of range, own ink from 50.1% | stepped inside keyframes |
| `.plate svg` | `view()` | entry 0% → exit 30% | transform, filter | `scale(1.22) translateY(-3%)`, `saturate(.55)` → `scale(1) translateY(2%)`, `saturate(1)` at 60% | origin 50% 60% |
| `.rail` | `--c1…--c4` | entry 50% → exit 50% | `--rail`, `--dim`, `--acc`, `--rbg` | discrete chapter set | fill none, ranges are adjacent so only one is active |
| `.toc li` bar | `--cN` | entry 50% → exit 50% | `--f` (registered number) | 0 → 1 | fill both, so finished chapters stay full |
| `.toc li` label | `--cN` | same | color | dim ink → full ink | fill none |
| Mobile chapter name | `--cN` | same | opacity | 0 → 1 | names stacked, only active one shows |
| Fallback plate | IntersectionObserver 25% | n/a | transform | `scale(1.14)` → none | 1200ms `--ease-out` |
| Fallback rail | scroll rAF | n/a | colour set | discrete | 240ms `--ease` colour transition |

Reduced motion: every animation and transition is removed. JS runs the fallback in state-only mode: rail colours and filled bars still track the reading position (discrete, no transition), chapter grounds are their static colours, plates sit at scale 1.

## States

- **Before chapter one:** rail uses the dawn set; every bar is an empty 28% track.
- **Active chapter:** entry ink is `--rail`, its accent bar fills with reading progress; others use `--dim`.
- **Completed chapter:** bar full in the current chapter's accent (accent follows the rail set, not the chapter it belongs to).
- **Hover rail link:** none beyond cursor; the link is already high contrast.
- **Focus-visible:** `outline: 2px solid currentColor; outline-offset: 3px` on every link.
- **Mid-tint:** for at most 45% of a viewport of scroll the ground is between two colours; ink switches at the midpoint.

## Accessibility

- Rail is `<nav aria-label="Chapters">` with an ordered list; each link points to the chapter's id, so the rail is also the table of contents.
- Chapters are `<section aria-labelledby>` pointing at their `<h2>`; cover has the only `<h1>`.
- Plates are decorative drawings inside `<figure>`; SVGs are `aria-hidden="true"` and the `<figcaption>` carries the meaning. The cover plate has an `aria-label` describing the drawing.
- Contrast on own grounds: dawn ink 12.9:1, dawn dim 5.4:1, rust accent 5.1:1; sea ink 9.9:1, sea dim 6.2:1, sea accent 6.1:1; marsh ink 10.6:1, marsh dim 5.4:1, marsh accent 5.6:1; dusk ink 13.4:1, dusk dim 7.7:1, dusk accent 8.0:1. Caption text uses full ink.
- The colour swap is never the only cue: the active rail entry also gets full ink and a filling bar.
- Keyboard: Tab order is masthead, four chapter links, then the article. No custom keys.

## Responsive rules

- ≥ 1280: as specified; body column 640px leaves the right third open, plates run to 960px.
- 1024–1279: same layout; headline and chapter titles shrink through their clamps.
- 900–1023: same; plate height follows `clamp(240px, 52vh, 440px)`.
- < 900: `--rail-w` becomes 0. The rail turns into a fixed 52px top bar with its own ground (`--rbg`): masthead at 18px on the left, the active chapter name at 17px italic on the right, and four 3px progress segments (3px gaps) along the bottom edge filling left to right. Kickers and meta hide. Cover becomes auto height (min 100vh), padding 84px 16px 32px, standfirst 19px, byline stacks under it, plate keeps min 280px. Chapters pad 88px 16px 96px; body 18px; captions stack.
- At 390 nothing scrolls sideways (`overflow-x: clip` on body).

## Acceptance checklist

**Always**
- [ ] Four chapters each declare a named `view-timeline`, and `body` hoists them with `timeline-scope` so the fixed rail can use them.
- [ ] Rail ranges are `entry 50% exit 50%`, adjacent, with `fill: none`, so exactly one chapter set is active at any scroll position past chapter one.
- [ ] Each progress bar is 2px wide (3px tall segments below 900px) and fills 0 → 1 across its chapter, staying full afterwards.
- [ ] Chapter grounds tint from the previous ground over `entry 0% → entry 45%`; ink switches at the midpoint.
- [ ] Plates scale 1.22 → 1 inside a clipped frame; the frame itself does not move.
- [ ] Without `animation-timeline` support, the JS fallback produces the same rail states and an IntersectionObserver plate settle.
- [ ] With reduced motion, nothing animates, rail state still tracks reading position, plates rest at scale 1.
- [ ] Focus outline visible on masthead and all chapter links.
- [ ] Body text ≥ 4.5:1 on every chapter ground; nothing scrolls sideways at 390px.

**This demo**
- [ ] Cover headline "The ferry that waits for the tide" at 104px with "waits" in `#a3442a` italic.
- [ ] Chapters in order: Slack water (`#f2e8d7`), The crossing (`#173f44`), Saltmarsh (`#dde4cb`), Last light (`#2a171b`).
- [ ] Pull quote in chapter two: "You do not cross the sea here. You borrow it, and you give it back by noon."
- [ ] Footer is dusk ground with a `#5a3f42` hairline and the credits line.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial frame (scrollY 0, 1280×800): the cover fills the viewport. Rail on the left shows the masthead "Tideline / Quarterly · Issue 14", the four chapter entries (kicker + italic name) vertically centred, and "14 min read / Photographs drawn by Ines Marrow" at the bottom. All four progress bars are empty (2px tracks at 28% opacity). The cover shows the kicker "Long read · Autumn 2026" in rust, the 104px headline with "waits" in rust italic, a 22px standfirst, a right-aligned byline, and a full-width dawn plate (ferry, low sun, sea bands) filling the remaining height.
2. Scroll into chapter one ("Slack water"): it shares the cover's cream, so no tint is visible; when its top crosses 50% of the viewport, the rail's "Chapter one" entry turns full ink and its rust bar starts filling. The bar reaches full when the chapter's bottom crosses 50%.
3. Each later chapter enters with its background tinting from the previous chapter's colour to its own while its top travels from the viewport bottom to 45% of the way up (`entry 0% → entry 45%`). Text colour holds the old ink for the first half of that range and switches to the new ink at the midpoint, so it is never mid-grey on mid-grey for long.
4. When a chapter's top crosses the viewport middle, the rail swaps discretely: panel background, ink, dim ink and accent take the chapter's set. The previous chapter's bar stays full (fill forwards); the current one starts at 0.
5. Plates: as a plate scrolls from just entering to 30% into its exit, the SVG inside goes from `scale(1.22) translateY(-3%)` and `saturate(.55)` to `scale(1) translateY(2%)`, reaching full saturation at 60%. The plate's frame never moves; only the drawing inside does, clipped by `overflow:hidden`.
6. Chapter two holds a 44px italic pull quote in the chapter accent; every chapter's first paragraph opens with a 76px drop cap in the accent.
7. Clicking a rail entry jumps to that chapter (plain anchor). Tabbing reaches the masthead and four chapter links with a visible 2px focus outline in the current ink.
8. After chapter four, a footer in the dusk colour closes the page with a hairline and credits, so the rail colour still matches at the very end.
9. Scrolling back up reverses every effect exactly; nothing is one-shot.
10. Without scroll-driven animation support, JS sets `--f` on each rail entry and `data-ch` on `<html>` from `getBoundingClientRect` on scroll (rAF-throttled), and plates get an `.in` class from an IntersectionObserver at 25% that transitions the scale over 1200ms. Chapter backgrounds are static.

## Tokens

```css
:root {
  /* chapter colour sets: ground, ink, dim ink, accent */
  --dawn: #f2e8d7;   --dawn-ink: #2b2219;  --dawn-dim: #6b5a48;  --dawn-acc: #a3442a;
  --sea: #173f44;    --sea-ink: #e6f0ec;   --sea-dim: #a9c4bf;   --sea-acc: #eab27c;
  --marsh: #dde4cb;  --marsh-ink: #22301d; --marsh-dim: #4f5d43; --marsh-acc: #4b5c1f;
  --dusk: #2a171b;   --dusk-ink: #f2e2d2;  --dusk-dim: #c4a99a;  --dusk-acc: #efa068;
  --hair-dusk: #5a3f42;      /* footer rule */

  /* plate drawing colours (dawn plate) */
  --plate-sky: #f6d9b4; --plate-glow: #eeb48a; --plate-sea: #c98a6a;
  --plate-deep: #6d4a3c; --plate-sun: #f9ecd6; --plate-hull: #3a241c;

  /* type */
  --serif: "Newsreader", Georgia, serif;   /* opsz 6..72, weights 400/500, roman + italic */
  --t-body: 20px;  --t-stand: 22px; --t-h1: clamp(44px, 7.6vw, 104px);
  --t-h2: clamp(48px, 6.4vw, 88px); --t-quote: clamp(28px, 3.4vw, 44px);
  --t-drop: 76px;  --t-rail-name: 21px; --t-kick: 12px; --t-caption: 14px;

  /* layout */
  --rail-w: 240px;   /* 0 below 900px */
  --col: 640px;      /* reading measure */
  --plate-max: 960px;
  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 48px; --space-5: 56px;
  --radius-plate: 2px;
  --track-opacity: .28;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --plate-from-scale: 1.22;
  --fallback-plate: 1200ms;
}
```

## Typography

| Role              | Family     | Size                    | Weight | Line-height | Tracking | Case      |
|-------------------|------------|-------------------------|-------:|------------:|---------:|-----------|
| Cover headline    | Newsreader | clamp(44, 7.6vw, 104px) | 400    | 0.94        | −0.035em | sentence; one word italic in accent |
| Chapter title     | Newsreader italic | clamp(48, 6.4vw, 88px) | 400 | 0.98     | −0.03em  | sentence  |
| Pull quote        | Newsreader italic | clamp(28, 3.4vw, 44px) | 400 | 1.15     | −0.02em  | curly quotes |
| Standfirst        | Newsreader | 22px                    | 400    | 1.45        | 0        | sentence  |
| Body              | Newsreader | 20px (18px < 900)       | 400    | 1.6         | 0        | sentence  |
| Drop cap          | Newsreader | 76px                    | 400    | 0.8         | 0        | float left, accent |
| Kicker            | Newsreader | 12px (rail 11px)        | 500    | 1.2         | +0.16em  | UPPERCASE |
| Rail chapter name | Newsreader italic | 21px             | 400    | 1.15        | 0        | sentence  |
| Masthead          | Newsreader italic | 22px             | 500    | 1           | −0.01em  | sentence  |
| Caption, byline   | Newsreader | 14px                    | 400/500| 1.4–1.5     | 0        | sentence  |

One family at two optical sizes: let `font-optical-sizing:auto` pick the display cut for the 104px and 88px lines and the text cut for 20px body.

## Implementation notes

**Hoist the chapter timelines so a fixed element can read them.** A fixed rail is not a descendant of any chapter, so name the view timelines on the chapters and declare their scope on a common ancestor:

```css
body { timeline-scope: --c1, --c2, --c3, --c4; }
#c1 { view-timeline: --c1; } #c2 { view-timeline: --c2; } /* … */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .rail { animation: r1 linear none, r2 linear none, r3 linear none, r4 linear none;
            animation-timeline: --c1, --c2, --c3, --c4;
            animation-range: entry 50% exit 50%; }
  }
}
@keyframes r2 { from, to { --rail: var(--sea-ink); --dim: var(--sea-dim); --acc: var(--sea-acc); --rbg: var(--sea); } }
```

**Register the progress number** so it interpolates and can drive either axis (vertical bars on desktop, horizontal segments on mobile) from one keyframe:

```css
@property --f { syntax: '<number>'; inherits: true; initial-value: 0; }
@keyframes fill { from { --f: 0 } to { --f: 1 } }
.toc li { animation: fill linear both, lit linear none; animation-range: entry 50% exit 50%; }
.toc li:nth-child(2) { animation-timeline: --c2, --c2; }
.toc li::after { transform-origin: top; transform: scaleY(var(--f)); }
```

**Fallback writes the same variables**, so CSS stays the single source of the look:

```js
const tick = () => {
  const mid = innerHeight / 2; let on = 0;
  chs.forEach((c, i) => {
    const r = c.getBoundingClientRect();
    lis[i].style.setProperty('--f', Math.min(1, Math.max(0, (mid - r.top) / r.height)));
    if (r.top <= mid && r.bottom > mid) on = i + 1;
  });
  document.documentElement.dataset.ch = on;   // [data-ch="2"] .rail { --rail: … }
};
```

Common mistakes: using `fill: both` on the rail animations (the last one in the list then wins everywhere); scaling the `<figure>` instead of the SVG inside it, which shoves the caption around; tinting `color` linearly across the range, which leaves grey text on a grey ground for half a screen; and forgetting that the rail needs its own ground, or its ink will sit on two different chapter colours at once.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
