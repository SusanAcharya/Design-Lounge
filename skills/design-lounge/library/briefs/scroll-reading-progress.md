<!-- Design Lounge Nº 058 · "Scroll reading progress" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Scroll reading progress

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A reading page for a farm journal ("Loam Journal"): a 640px measure of 19px Newsreader under a sticky 56px masthead, with a 240px sticky table of contents to the left. Two things are driven by scroll position. A 3px mint bar pinned to the top of the viewport scales from 0 to full width as the reader moves from the top of the document to the bottom — with CSS `animation-timeline: scroll(root)` where supported, so it runs off the main thread, and a `scroll` listener otherwise. The table of contents marks whichever heading has most recently crossed a line 30% down the viewport, with a 1px accent rule on its left edge, and shows "% read" and "minutes left" figures. The detail worth copying is the progressive enhancement: the same keyframes and the same transform are used by both the CSS timeline and the JS fallback, so there is one visual definition.

## Reference behaviour

1. Initial state (scrollY = 0): bar at `scaleX(0)`; masthead reads "Loam Journal · Issue 12 · Field notes · 0 % read"; TOC lists six sections with the first marked current; stat reads "7 min left · 1,140 words". Article header: kicker, 46px title, italic dek, byline.
2. Scroll: the bar's `scaleX` equals `scrollY / (scrollHeight − innerHeight)`, linear. In browsers with scroll-driven animations this is the `grow` keyframe on `animation-timeline: scroll(root)`; otherwise JS sets `transform: scaleX(p)` on each scroll event (passive listener).
3. On every scroll event (both paths) JS updates: `aria-valuenow` on the bar (0–100), the "% read" figure, and "min left" = `ceil(7 × (1 − p))`.
4. TOC current section: the last `<h2>` whose top is at or above 30% of the viewport height. `aria-current="true"` moves to its link; the link's text goes `--ink-2` → `--ink` and its left border `transparent` → `--accent`, both over 240ms.
5. Click a TOC link: smooth scroll to the heading (`scroll-behavior: smooth` on `html`), landing with the heading 24px below the masthead (`scroll-padding-top: 80px`). The current mark follows as the page moves.
6. Hover a TOC link: text `--ink`, no border change. Focus-visible: 2px accent outline inset.
7. Reaching the end: bar full width, "100 % read", "0 min left", last section current. The "End of piece" line is inside the article bottom padding so the last heading can become current before the page stops.
8. Masthead is `position: sticky`, 88% opaque with an 8px backdrop blur, 1px bottom hairline. The bar sits above it (`z-index` 20 vs 10).
9. With `prefers-reduced-motion: reduce`: smooth scroll becomes instant, TOC transitions are removed, backdrop blur is removed. The progress bar still tracks scroll — it is a position indicator, not a motion effect.

## Structure

```
1280 × 800  (page taller than the viewport; scrolls)
┌═══════════════════════════════════════════════════════════════════════┐ ← bar 3px, scaleX = progress
│ Loam Journal                     Issue 12 · Field notes · 38 % read   │ sticky masthead 56
├───────────────────────────────────────────────────────────────────────┤
│         IN THIS PIECE      │ SOIL · SEASON REPORT                     │ pad-top 56
│         │ The dry spring   │ On rebuilding soil in a dry year   (46px)│
│         ▌ What the soil…   │ We lost 38 % of the spring rain, kept…   │ dek 22 italic
│         │ Cover crops…     │ By Ida Strand · Loam Farm · 21 Sep 2026  │
│         │ Where the water… │                                          │
│         │ Counting worms…  │ The dry spring                     (27px)│
│         │ Next year's plan │ The rain gauge on the barn read 41 mm…   │ 19/1.6, 640 wide
│         ────────────────── │ …                                        │
│         5 min left · 1,140 │ ▎Organic matter is not the goal. It is…  │ blockquote
│         (toc sticky @ 112) │                                          │
│            240        gap 80         640                              │
└───────────────────────────────────────────────────────────────────────┘
```

- `.bar` — `<div role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow>`; `position: fixed; top: 0; left: 0; width: 100%; height: 3px; transform-origin: left`.
- `.top` — sticky masthead, `<b>` journal name and a `<span>` with the issue and `<i id="pct">`.
- `.page` — CSS grid `240px 640px`, gap 80px, `justify-content: center`, padding `56px 40px 120px`.
  - `<nav class="toc" aria-label="Contents">` — sticky at `top: 112px` (masthead 56 + 56), `align-self: start`. `<h2>` label, `<ol>` with a 1px left border and six `<a href="#s1…#s6">`, and a `.stat` block.
  - `<article>` — `<header>` (kicker, `<h1>`, `.dek`, `.by`), then six `<h2 id="sN">` each followed by two `<p>`, one `<blockquote>` after section 2, and a `.end` line.

Section titles, in order: The dry spring · What the soil test said · Cover crops, not compost · Where the water went · Counting worms in August · Next year's plan. Title: "On rebuilding soil in a dry year". Byline: Ida Strand · Loam Farm, Jæren · 21 September 2026. Word count ≈ 1,140; reading time 7 min at 160 wpm. Write two paragraphs of 70–90 words per section in the register of a farm season report (rain in mm, organic-matter %, worm counts per 20 cm block).

## Tokens

```css
:root {
  /* colour — warm near-black, parchment ink, one mint accent */
  --bg: #18171a;
  --bg-2: #1e1d21;
  --line: #2c2b30;        /* hairlines, TOC rail */
  --ink: #ece6da;         /* body text, current TOC link */
  --ink-2: #a09a8f;       /* dek, TOC links, masthead text */
  --ink-3: #6c675f;       /* byline, TOC label, stat, end line */
  --accent: #8fc1a9;      /* progress bar, kicker, TOC current rule, blockquote rule, focus */

  /* type */
  --serif: "Newsreader", Georgia, serif;   /* opsz 6–72 */
  --sans: "Inter", system-ui, sans-serif;
  --body-size: 19px;
  --body-lh: 1.6;

  /* layout */
  --bar-h: 3px;
  --top-h: 56px;
  --toc-w: 240px;
  --measure: 640px;
  --col-gap: 80px;
  --toc-top: calc(var(--top-h) + 56px);   /* 112px */
  --scroll-pad: calc(var(--top-h) + 24px);/* 80px */
  --current-line: 30vh;                    /* JS: heading crossing line */

  /* motion */
  --t-micro: 160ms;
  --t-toc: 240ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role         | Family     | Size | Weight | Line-height | Tracking | Case      | Notes |
|--------------|------------|-----:|-------:|------------:|---------:|-----------|-------|
| Body         | Newsreader | 19px | 400    | 1.6         | 0        | sentence  | `"opsz" 18`; first paragraph's first letter 1.15em/500 |
| Title        | Newsreader | 46px | 400    | 1.12        | −0.015em | sentence  | `"opsz" 72` |
| Dek          | Newsreader | 22px | 400 italic | 1.6     | 0        | sentence  | colour `--ink-2` |
| Section h2   | Newsreader | 27px | 500    | 1.25        | −0.01em  | sentence  | `"opsz" 36`, margin 48px 0 14px |
| Blockquote   | Newsreader | 23px | 400 italic | 1.4     | 0        | sentence  | 2px accent left rule, 20px padding |
| Kicker       | Inter      | 12px | 500    | 1.5         | +0.12em  | UPPERCASE | colour `--accent` |
| Byline / end | Inter      | 13px | 400    | 1.5         | 0        | sentence  | name 500 `--ink-2` |
| Masthead     | Inter      | 13px | 400    | 1.5         | 0        | sentence  | journal name Newsreader 15px/500 |
| TOC label    | Inter      | 11px | 500    | 1.5         | +0.12em  | UPPERCASE | |
| TOC link     | Inter      | 13px | 400    | 1.5         | 0        | sentence  | padding 7px 0 7px 16px |
| TOC stat     | Inter      | 13px | 400    | 1.5         | 0        | sentence  | `tabular-nums` |
| Drop cap     | Newsreader | 1.15em | 500  | inherit     | 0        | —         | `::first-letter` of the first paragraph only |

## Motion

| Element   | Trigger        | Property      | From → To                     | Duration | Easing          | Notes |
|-----------|----------------|---------------|-------------------------------|---------:|-----------------|-------|
| `.bar`    | scroll         | scaleX        | 0 → 1                         | tied to scroll | linear    | `animation-timeline: scroll(root)`; JS fallback sets the same transform |
| `.toc a`  | current change | color, border-left-color | `--ink-2`, transparent → `--ink`, `--accent` | 240ms | `--ease` | previous link reverses on the same clock |
| `.toc a`  | hover          | color         | `--ink-2` → `--ink`           | 240ms    | `--ease`        | |
| document  | TOC click      | scroll position | current → heading − 80px    | UA-defined | `scroll-behavior: smooth` | instant under reduced motion |

Approximate positions at 1280 × 800 (document ≈ 3,900px tall, scroll range ≈ 3,100px):

| Heading | top offset | becomes current at scrollY | bar scaleX |
|---------|-----------:|---------------------------:|-----------:|
| The dry spring | 380px | 0 (initial) | 0.00 |
| What the soil test said | 900px | ≈ 660 | 0.21 |
| Cover crops, not compost | 1,560px | ≈ 1,320 | 0.43 |
| Where the water went | 2,080px | ≈ 1,840 | 0.59 |
| Counting worms in August | 2,600px | ≈ 2,360 | 0.76 |
| Next year's plan | 3,120px | ≈ 2,880 | 0.93 |

(Current = heading top ≤ 240px, i.e. 30% of 800.) Your numbers will differ with the copy; the rule is what matters.

There are no entrance animations; the page is static until the reader scrolls.

Reduced motion: `html { scroll-behavior: auto }`, `.toc a { transition: none }`, `.top { backdrop-filter: none }`. Keep the progress bar.

## States

- **TOC link resting:** `--ink-2`, transparent left border overlapping the rail (`margin-left: -1px`).
- **TOC link hover:** `--ink`.
- **TOC link current (`aria-current="true"`):** `--ink`, 1px `--accent` left border.
- **TOC link focus-visible:** `outline: 2px solid var(--accent); outline-offset: -2px; border-radius: 2px`.
- **Progress 0 / 100:** bar invisible (scaleX 0) / full; masthead "0 %" / "100 %"; stat "7 min" / "0 min".
- **Masthead over content:** while scrolling, article text passes under the 88% masthead; the 8px blur keeps it from reading as overlapping type.
- **TOC at the end:** the last section is current from scrollY ≈ 2,880 onward; the "0 min left" figure is reached only at the very bottom.
- **No JS:** bar still works in supporting browsers (pure CSS); TOC current mark stays on the first item; figures stay at their initial text.

## Accessibility

- The bar is `role="progressbar"` with `aria-valuemin/max/now`; `aria-valuenow` is updated by JS on scroll, rounded to an integer. It is not focusable.
- `<nav aria-label="Contents">` with an ordered list of same-page links; `aria-current="true"` marks the section being read. Headings have `id`s and `scroll-margin-top: 80px` so keyboard `Enter` on a link lands them below the masthead.
- Keyboard: Tab through the six TOC links; Enter scrolls. Page Down / Space / arrows scroll the document natively; the masthead and TOC never trap focus.
- Contrast: `--ink` on `--bg` 13.4:1; `--ink-2` 6.2:1; `--accent` 8.9:1; `--ink-3` 3.3:1 (13px byline/stat only — raise to `#807a70` for AA).
- Body text at 19px/1.6 on a 640px measure is 68–74 characters per line.
- The masthead blur is decorative; its 88% opacity keeps text under it from reducing contrast of the masthead labels.

## Responsive rules

- ≥ 1280: two columns as specified.
- 1024–1279: gap 48px; TOC 200px.
- 768–1023: TOC moves above the article as a horizontal scrolling row of links (sticky under the masthead, 44px tall); the current link is underlined with a 2px accent rule instead of a left border; stat hidden.
- < 640: measure 100% with 20px padding; body 17px/1.6; title 32px; TOC row remains; masthead text shortens to "38 %".

## Acceptance checklist

- [ ] A 3px `#8fc1a9` bar is fixed at the very top, above the masthead, with `transform-origin: left`.
- [ ] In a browser supporting `animation-timeline`, the bar is driven by `scroll(root)` with a `linear` keyframe from `scaleX(0)` to `scaleX(1)` and no JS transform is applied.
- [ ] In a browser without support, `CSS.supports('animation-timeline: scroll()')` is false and JS sets `scaleX(scrollY / (scrollHeight − innerHeight))` on scroll.
- [ ] The CSS animation is declared inside `@supports (animation-timeline: scroll())` so unsupported browsers do not fill to the end state.
- [ ] `aria-valuenow`, "% read" and "min left" update on every scroll event.
- [ ] The current TOC item is the last heading whose top ≤ 30% of viewport height; exactly one link has `aria-current="true"` at all times.
- [ ] Current link shows a 1px accent left rule overlapping the 1px `--line` rail (no double line).
- [ ] Clicking a TOC link smooth-scrolls so the heading sits 24px under the 56px masthead.
- [ ] Masthead is sticky, 56px, 88% opaque with 8px blur; TOC is sticky at 112px and never overlaps the masthead.
- [ ] Body measure is 640px at 19px/1.6; section headings are 27px/500 with 48px above.
- [ ] Reduced motion disables smooth scroll and TOC transitions but keeps the progress bar working.
- [ ] Focus rings are visible on all six TOC links.
- [ ] `aria-valuenow` reaches exactly 100 at the bottom of the document (the `min(1, …)` clamp handles overscroll).
- [ ] Headings carry `scroll-margin-top: 80px` so keyboard activation of a TOC link never hides the heading under the masthead.

## Implementation notes

**One definition, two drivers.** Declare the keyframes once; attach the scroll timeline only where supported, and let JS write the same transform elsewhere:

```css
.bar { position: fixed; top: 0; left: 0; width: 100%; height: var(--bar-h);
       background: var(--accent); transform-origin: left; transform: scaleX(0); z-index: 20; }
@supports (animation-timeline: scroll()) {
  .bar { animation: grow linear both; animation-timeline: scroll(root); }
}
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
```

```js
const native = CSS.supports('animation-timeline: scroll()');
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, scrollY / max) : 1;
  if (!native) bar.style.transform = `scaleX(${p})`;
  bar.setAttribute('aria-valuenow', Math.round(p * 100));
  pct.textContent = Math.round(p * 100) + ' %';
  left.textContent = Math.max(0, Math.ceil(7 * (1 - p))) + ' min';
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();
```

**Current heading = last one above the 30% line.** Six `getBoundingClientRect()` calls per scroll event are cheap; an IntersectionObserver is not more accurate here because you want "most recently passed", not "currently intersecting":

```js
function track() {
  let i = 0;
  heads.forEach((h, j) => { if (h.getBoundingClientRect().top <= innerHeight * .3) i = j; });
  links.forEach((a, j) => j === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
}
addEventListener('scroll', track, { passive: true }); track();
```

**Narrow-screen TOC** (< 1024): the same list becomes a horizontal, sticky strip under the masthead; the current marker moves from a left border to a bottom border:

```css
@media (max-width: 1023px) {
  .page { grid-template-columns: 1fr; gap: 24px; }
  .toc { position: sticky; top: var(--top-h); height: 44px; display: flex; align-items: center;
         overflow-x: auto; background: var(--bg); border-bottom: 1px solid var(--line); }
  .toc ol { display: flex; gap: 20px; border: 0; }
  .toc a { padding: 12px 0; border-left: 0; border-bottom: 2px solid transparent; white-space: nowrap; }
  .toc a[aria-current="true"] { border-bottom-color: var(--accent); }
}
```

**Make the document the scroller.** Keep `html, body { height: 100% }` but do not set `overflow-y: auto` on `body`; if the body becomes its own scroll container, `window.scrollY` stays 0 and `scroll(root)` never advances. `overflow-x: hidden` on body is fine (it propagates to the viewport).

Common mistakes: using `width` instead of `transform: scaleX` for the bar (layout on every frame); putting `scroll-margin-top` only on the links, not the headings; letting the sticky TOC's parent be shorter than the article (sticky needs the grid item to stretch — use `align-self: start` on the TOC, not on the grid).

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
