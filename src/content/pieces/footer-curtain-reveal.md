---
title: "Curtain reveal footer"
summary: "The page lifts like a curtain with a 36px rounded edge to uncover a forest-green footer parked underneath: giant contact line, sitemap, legal. No scroll listener."
platform: web
type: section
category: footer
tags: [footer, sticky, scroll, contact, sitemap]
styles: [editorial, dark]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#13261D", "#F1EEE6", "#EDEFE6", "#D4F35A", "#1A1C18"]
fonts: ["Archivo Black", "Archivo"]
related: [footer-giant-wordmark-reveal, footer-sitemap-columns]
---

# Curtain reveal footer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The closing block of a website for an architecture studio, Harbour Row in Lisbon. The footer does not scroll in after the content. It is already there, parked under the page, and the page slides up off it like a curtain: the content's bottom edge is rounded (36px) and casts a soft shadow onto the dark green footer as it lifts. The trick is pure layout, `position: sticky; bottom: 0` on the footer plus a higher `z-index` on the content, so there is no scroll listener and no jank. The footer leads with a two-line contact line in Archivo Black at 116px, the second line in lime, then a pill email button, phone and address, a four-column sitemap and a legal row.

## Reference behaviour

1. On load the document scrolls to its end, so the first frame shows the last 220px of the page (three project captions, a "Showing 12 of 12 projects" line and a portfolio download link) sitting on a rounded, shadowed edge, with the full 600px footer revealed below.
2. Scroll up: the footer does not move. The page content slides down over it and covers it; the footer stays pinned to the bottom of the viewport underneath.
3. Scroll down again: the content's rounded bottom edge lifts away and uncovers the footer from the top. In browsers with scroll-driven animations, the footer's inner block rises from `translateY(48px) scale(.97)` and `opacity .25` to rest across the last 600px of scroll. Without support it simply sits at rest.
4. Hover the contact line: the lime second line gets a 6px underline offset 10px.
5. Hover the lime email pill: its arrow slides 4px right and turns −45° over 320ms.
6. Hover any sitemap link: it turns lime. Legal links underline and brighten.
7. Click "Replay the curtain": the page jumps 640px up (footer covered), then smooth-scrolls back to the end, replaying the reveal.
8. Below 640px wide the curtain is turned off: the footer becomes a normal block after the content, because a stacked footer is taller than the phone viewport.

## Structure

```
1280 × 800 (scrolled to end)
┌──────────────────────────────────────────────────────────────────────┐
│ main (z 1, bg --page, radius 0 0 36 36, shadow)                      │
│  ▔▔ photo ▔▔▔▔▔▔▔▔▔▔  ▔▔ photo ▔▔▔▔▔▔  ▔▔ photo ▔▔▔▔▔▔               │
│  Vila Ferroviária · Barreiro 2025 │ Capela do Sal │ Escola das Hortas │
│  Showing 12 of 12 projects                 Download the 2026 portfolio│
│╰────────────────────────────────────────────────────────────────────╯│ ← y≈222
│ footer (sticky bottom 0, z 0, bg --foot, min-height 600)             │
│  ● Taking on new work …   Studio open Mon to Fri  (Replay)       │
│  Got a site?                                  ┌ studio@… ────── → ┐  │
│  Let's walk it.   (116px, lime)               └───────────────────┘  │
│                                               +351 · address         │
│  ───────────────────────────────────────────────────────────────── │
│  STUDIO        WORK          JOIN           READ                     │
│  4 links       4 links       3 links        3 links                  │
│  © 2026 … · NIF · Privacy · Accessibility                               │
└──────────────────────────────────────────────────────────────────────┘
  gutters 56px · contact grid 1fr 300px · sitemap 4 × 1fr, gap 24
```

- `<main>`: `position: relative; z-index: 1`, page background, bottom radius 36px, the curtain shadow. Holds the site bar (72px), an intro grid, the `.work` grid of three `<figure>` tiles (1.3fr 1fr 1fr, gap 20) and the `.endnote` row.
- Each tile: a `div.ph` with `role="img"` and `aria-label` (CSS gradient "photograph"), then a `<figcaption>` with a 1px ink top rule, bold name left, place and year right.
- `<footer>`: `position: sticky; bottom: 0; z-index: 0; margin-top: -36px`, so its top tucks under the rounded corners; `padding-top: 76px` (36 + 40).
  - `.reveal` wrapper (the only thing the scroll-driven animation touches).
  - `.kick` row: status dot + "Taking on new work from March 2027", hours on the right.
  - `.contact` grid: `<h2>` wrapping one `<a>`, and `.reach` with the email pill `<a>` and a `<p>` with phone link and address.
  - `<nav class="map" aria-label="Sitemap">` with four columns of `<h3>` + `<ul>`.
  - `.legal` row with copyright, tax number and two links. The Replay `<button>` sits at the right end of the `.kick` row, after the hours, so the bottom-right corner stays clear.

## Tokens

```css
:root {
  /* page (the curtain) */
  --page: #F1EEE6;        /* content background */
  --page-2: #E4DFD2;      /* reserved surface */
  --ink: #1A1C18;         /* page text */
  --ink-2: #55574F;       /* page secondary text, 6.9:1 on --page */
  --line-page: #CFC9BA;   /* hairline under the site bar */

  /* footer (behind the curtain) */
  --foot: #13261D;        /* footer and html background */
  --foot-2: #1C3328;      /* reserved raised surface */
  --foot-line: #2F4A3C;   /* sitemap top rule */
  --bone: #EDEFE6;        /* footer text, 14.6:1 */
  --bone-2: #A9B8AC;      /* footer secondary text, 8.1:1 */
  --lime: #D4F35A;        /* the one accent: line two, email pill, hover */
  --lime-ink: #13261D;    /* text on lime, 12.9:1 */

  /* type */
  --display: "Archivo Black", Impact, sans-serif;
  --font: "Archivo", system-ui, sans-serif;
  --fs-display: clamp(46px, 8.8vw, 116px);
  --fs-intro: clamp(34px, 4.4vw, 56px);
  --fs-body: 15px;
  --fs-meta: 13px;
  --fs-legal: 12px;
  --fs-label: 11px;

  /* layout */
  --foot-h: 600px;        /* footer min-height, also the animation range */
  --curtain-r: 36px;      /* rounded bottom edge of the page */
  --gutter: 56px;
  --pill-h: 52px;
  --tile-h: 300px;

  /* depth */
  --shadow-curtain: 0 24px 40px -16px rgba(8, 20, 14, .55), 0 2px 0 rgba(8, 20, 14, .25);

  /* motion */
  --t-fast: 160ms;
  --t-mid: 320ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role              | Family        | Size                         | Weight | Line-height | Tracking | Case      |
|-------------------|---------------|------------------------------|-------:|------------:|---------:|-----------|
| Contact line      | Archivo Black | clamp(46px, 8.8vw, 116px)    | 400    | 0.9         | −0.035em | sentence  |
| Intro headline    | Archivo Black | clamp(34px, 4.4vw, 56px)     | 400    | 0.98        | −0.025em | sentence  |
| Site bar name     | Archivo Black | 16px                         | 400    | 1           | −0.01em  | sentence  |
| Email pill        | Archivo       | 15px                         | 600    | 1           | 0        | lowercase |
| Sitemap link      | Archivo       | 15px                         | 400    | 1.5         | 0        | sentence  |
| Sitemap heading   | Archivo       | 11px                         | 600    | 1           | +0.14em  | UPPERCASE |
| Address, captions | Archivo       | 13–14px                      | 400/600| 1.45        | 0        | sentence  |
| Legal             | Archivo       | 12px                         | 400    | 1.5         | 0        | sentence  |

The contact line is the only display-size element. Everything else stays at or below 16px so the 116px line reads as the footer's one voice.

## Motion

| Element           | Trigger              | Property                    | From → To                                  | Duration      | Easing      | Notes |
|-------------------|----------------------|-----------------------------|--------------------------------------------|---------------|-------------|-------|
| Footer vs page    | scroll               | none (layout)               | sticky footer revealed by z-index          | scroll-linked | —           | no JS |
| `.reveal`         | scroll, last 600px   | opacity, transform          | .25, translateY(48px) scale(.97) → 1, none | scroll-linked | linear      | `animation-timeline: scroll(root)`, `@supports` only |
| Email arrow       | hover                | transform                   | none → translateX(4px) rotate(−45deg)      | 320ms         | `--ease-out`| |
| Email pill        | active               | transform                   | scale(1) → scale(.98)                      | 160ms         | `--ease`    | |
| Replay button     | hover                | background, color           | transparent/bone → bone/foot               | 160ms         | `--ease`    | |
| Replay            | click                | scrollTop                   | end − 640 → end                            | native smooth | —           | 420ms pause before the smooth scroll |

Reduced motion: transitions set to 1ms, the `.reveal` animation removed, and Replay jumps without smooth scrolling. The curtain itself still works, because it is layout, not animation.

## States

- **Contact line hover:** lime line gains `text-decoration: underline; thickness 6px; offset 10px`.
- **Email pill hover:** arrow slides and turns; **active:** pill scales to .98.
- **Sitemap link hover:** colour `--lime`. **Legal link hover:** colour `--bone`, underline.
- **Focus-visible:** 2px `--lime` outline, 3px offset, 4px radius in the footer; inside `<main>` the outline is `--ink` so it shows on the light page.
- **"Open roles" count:** a 10px lime superscript "2". Remove it when there are no roles; never show "0".
- **Status dot:** 8px lime disc with a 4px `rgba(212,243,90,.16)` halo. Swap the copy to "Fully booked until June 2027" and the dot to `--bone-2` when the studio is not taking work.

## Accessibility

- The footer is a real `<footer>` landmark after `<main>`; the sticky trick does not change DOM order, so reading and tab order are page first, then footer.
- The sitemap is `<nav aria-label="Sitemap">`, separate from the header `<nav aria-label="Main">`.
- The contact line is one link inside the `<h2>`, so it reads as a single "Got a site? Let's walk it." link, not two.
- Gradient photographs are `role="img"` with an `aria-label` that describes the building.
- Replay is a `<button type="button">`, with a decorative SVG marked `aria-hidden="true"`.
- Contrast: `--bone` on `--foot` 14.6:1, `--bone-2` on `--foot` 8.1:1, `--lime-ink` on `--lime` 12.9:1, `--ink-2` on `--page` 6.9:1. The Replay outline (`--bone-2`) is 8.1:1 against the footer, well above 3:1 for a control edge.
- Hit targets: email pill 52px tall, Replay 32px tall with 14px side padding; sitemap links have 8px gaps between 22px lines.

## Responsive rules

- ≥ 1280: as specified; gutters 56px.
- 901–1279: same layout; the contact line shrinks with `8.8vw`.
- 641–900: contact grid stacks (line, then the email column); the work grid becomes two columns with the first tile spanning both.
- ≤ 640: gutters 20px, curtain radius 24px, footer `position: relative` (curtain off) and the scroll-driven reveal removed. Header nav hides. Work tiles stack at 200px tall. Sitemap becomes 2 × 2. The kick row and the endnote stack. Contact line bottoms out at 46px. Nothing scrolls sideways at 390.
- Keep the curtain only while the footer fits the viewport: if the footer is taller than the window, sticky-bottom shows its bottom first, which reads as a bug.

## Acceptance checklist

**Always**

- [ ] The footer uses `position: sticky; bottom: 0` with a lower z-index than the content; there is no scroll event listener.
- [ ] The content block has a rounded bottom edge and a shadow that falls onto the footer, and the footer's top padding clears that radius.
- [ ] Reading and tab order are content first, then footer.
- [ ] Exactly one element is at display size (the contact line), and it is one link.
- [ ] Scrolling up covers the footer completely; scrolling to the end reveals all of it.
- [ ] The curtain turns off below 640px and nothing scrolls sideways at 390px.
- [ ] Reduced motion keeps the curtain but removes the rise animation and smooth scroll.
- [ ] Focus is visible on every link and on Replay, on both the light page and the dark footer.

**This demo**

- [ ] Curtain radius 36px, footer min-height 600px, gutters 56px.
- [ ] Contact line reads "Got a site?" / "Let's walk it." at up to 116px, second line `#D4F35A`.
- [ ] Email pill is 52px tall, lime, with "studio@harbourrow.pt" and an arrow that turns −45° on hover.
- [ ] Sitemap columns are Studio, Work, Join, Read, with a "2" on Open roles.
- [ ] The first frame shows three project captions above the footer edge.

## Implementation notes

**The curtain is two lines of positioning.** The footer comes after the content in the DOM and sticks to the bottom; the content is lifted above it. The negative margin tucks the footer under the rounded corners so no seam shows.

```css
main   { position: relative; z-index: 1; background: var(--page);
         border-radius: 0 0 var(--curtain-r) var(--curtain-r);
         box-shadow: var(--shadow-curtain); }
footer { position: sticky; bottom: 0; z-index: 0;
         min-height: var(--foot-h);
         margin-top: calc(var(--curtain-r) * -1);
         padding-top: calc(var(--curtain-r) + 40px); }
html   { background: var(--foot); } /* overscroll shows footer colour, not white */
```

**The rise is progressive enhancement.** Scope it to the last `--foot-h` of scroll so it finishes exactly when the footer is fully uncovered:

```css
@supports (animation-timeline: scroll()) {
  .reveal { animation: rise linear both;
            animation-timeline: scroll(root);
            animation-range: calc(100% - var(--foot-h)) 100%; }
  @keyframes rise { from { opacity: .25; transform: translateY(48px) scale(.97); }
                    to   { opacity: 1; transform: none; } }
}
```

**Open on the revealed state and replay on demand.**

```js
const se = document.scrollingElement;
history.scrollRestoration = 'manual';
addEventListener('load', () => se.scrollTo({ top: se.scrollHeight }));
replay.onclick = () => {
  se.scrollTo({ top: se.scrollHeight - innerHeight - 640 });
  setTimeout(() => se.scrollTo({ top: se.scrollHeight, behavior: 'smooth' }), 420);
};
```

Common mistakes: using `position: fixed` on the footer plus a `margin-bottom` spacer on the content (works, but breaks when the footer height changes and needs JS to measure); forgetting `html { background }`, which flashes white on overscroll; putting `overflow: hidden` on `body` or a wrapper, which kills sticky; leaving the curtain on at phone width where the footer is taller than the screen.
