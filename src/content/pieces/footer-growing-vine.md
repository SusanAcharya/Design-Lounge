---
title: "Growing vine footer"
summary: "A nursery footer with an ink-and-wash honeysuckle along the sitemap: hover a link and a tendril draws down to it and a leaf unfurls; the current page wears a flower."
platform: web
type: section
category: footer
tags: [footer, illustration, sitemap, botanical, svg]
styles: [paper, organic, editorial]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-29
palette: ["#F2EDE0", "#24332B", "#A9BE98", "#3A6540", "#B0435A"]
fonts: ["Lora", "Shantell Sans"]
related: [footer-sleepy-cat, footer-sitemap-columns, footer-curtain-reveal]
---

# Growing vine footer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The closing block of the website for Fernhollow, a plant nursery and seed room in Kington, Herefordshire. Above its four sitemap columns runs a honeysuckle vine drawn like a botanical plate: a trembling ink stem with a second fine offset line, a watercolour wash bleeding along it, hatched leaves and pink buds. Hover or focus any link and a tendril draws itself from the vine down the column's left gutter to that link with `stroke-dashoffset`, ending in a small curl, while two leaves unfurl along it. The current page ("Seed room") keeps its tendril permanently and wears a madder-red flower. The detail worth copying is that every tendril is computed from where the link actually sits, so the drawing survives any copy, column count or viewport, including a phone, where the vine turns and runs down the side of the stacked links.

## Reference behaviour

1. First frame at 1280 × 800: the end of the Seed room page (a 30px Lora headline, a paragraph with a "See the full seed list" link) above a 1px hairline, then the footer: "Fernhollow" in 104px Lora italic with a handwritten subline, a four-cell contact block on the right, the vine band, four link columns, a handwritten figure caption, and the legal row pinned to the bottom of the viewport.
2. The vine spans the whole sitemap width at 54px below the band's top, waving with three summed sines (amplitude about 23px). A leaf sits every 46px, alternating above and below at 34 to 60deg, scaled 1 to 1.44; every third station adds a smaller opposite leaf; every seventh station has a pair of buds instead; every fourth station has a small ink curl.
3. "Seed room" (the current page, `aria-current="page"`, italic 600) already has its tendril drawn, its leaves out, and a 5-petal flower in the gutter beside it.
4. Hover or focus any other link: its tendril draws from the vine to 16px inside the column's left edge over 560ms (`--ease-out`), then, 330ms in, a leaf at the tip (pointing left and down, 150deg) and a smaller one at 55% of the tendril (−150deg) scale from 0 and rotate from −40deg to rest over 420ms. The link turns moss green with a 1px underline.
5. Leave or blur: the tendril retracts over 300ms and the leaves fold away over 220ms with no delay. A link that still has keyboard focus keeps its tendril when the pointer leaves.
6. Several tendrils can be out at once (one hovered, one focused).
7. On touch devices (`hover: none`), tapping a link grows its tendril and retracts every other non-current one.
8. At 390 wide the columns stack into one list with a 48px left gutter, the vine turns vertical at x ≈ 22px and runs the full height of the list, with leaves and buds alternating sides every 62px; tendrils are short sideways hooks from the vine to each link, and the flower sits in the gutter beside "Seed room".
9. On resize the whole drawing is regenerated (120ms debounce), so the vine always matches the layout.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ main.end  padding 40/56/34, flex space-between, hairline bottom      │
│  Seeds are packed by hand on        Orders placed by noon… link      │
│  Tuesdays, in paper we fold…                                         │
├──────────────────────────────────────────────────────────────────────┤
│ footer (flex 1) padding 34/56/22                                     │
│  Fernhollow (104px italic)                 Find us   Write or ring    │
│  Nursery and seed room… (hand 15px)         Open      Closed          │
│ nav.flora  padding-top 112  ┌ svg.vine absolute inset 0 ───────────┐ │
│  ~~~~❦~~~~❦~~~~~❦~~~~~❦~~~~~~❦~~~~~~❦~~~ vine at y 54 ~~~~~~~~~~~~~~ │
│  │ Nursery       Visit        Journal       Elsewhere                │
│  │ Plants A to Z …            …             …                        │
│  ❀ Seed room   (gutter 40px each column, gap 20)                     │
│  Fig. 1. Honeysuckle, Lonicera periclymenum, along the top bed       │
│  ──────────────────────────────────────────────────────────────────  │
│  © 2026 … no. 02184371  Privacy  Delivery  Plant health   Drawn and…  │
└──────────────────────────────────────────────────────────────────────┘
```

- `<main class="end">`: `<h2>` with an `<em>` second half, `<p>` with one link.
- `<footer>`: column flex, `flex: 1`; `.legal` uses `margin-top: auto` so it sits on the bottom edge.
- `.top`: `<p class="mark">` wordmark with a `<small>` subline; `.reach` is a 2 × 2 grid of `<address>` and `<div>`s, each led by a `<b>` label.
- `<nav class="flora" aria-label="Sitemap">`: `position: relative; padding-top: 112px`. Holds `<svg class="vine" aria-hidden="true">` absolutely filling the nav, with `<defs>` (two filters, `#leaf`, `#bud`, `#flower`) and an empty `<g id="art" filter="url(#rough)">` that JS fills; `.cols` is a 4 × 1fr grid, gap 0 20px, each column `padding-left: 40px`; `.fig` caption.
- Socials are text links in the Elsewhere column: Photo diary, Video garden walks, Seed swap forum, Journal by RSS.

## Tokens

```css
:root {
  /* paper and ink */
  --paper: #F2EDE0;     /* page and footer, plus 6% noise grain */
  --paper-2: #E9E2D0;   /* reserved surface */
  --ink: #24332B;       /* text, vine, leaf outlines; 11.3:1 */
  --ink-2: #4C5A4F;     /* labels, captions, legal; 6.2:1 */
  --rule: #B7B39F;      /* hairlines (decorative, not text) */

  /* the one accent */
  --moss: #3A6540;      /* link hover, "See the full seed list"; 5.8:1 */

  /* wash */
  --wash: #A9BE98;      /* watercolour along the stem, opacity .5 */
  --leaf: #C3D2B1;      /* leaf fill */
  --bud: #E6B9B5;       /* bud fill */
  --madder: #B0435A;    /* current-page flower petals */
  --ochre: #C99A3A;     /* flower centre */

  /* type */
  --serif: "Lora", Georgia, serif;
  --hand: "Shantell Sans", system-ui, sans-serif;
  --fs-mark: 104px;
  --fs-end: 30px;
  --fs-body: 15px;
  --fs-small: 14px;
  --fs-legal: 13px;

  /* layout */
  --gutter: 56px;
  --col-pad: 40px;        /* phone: 48px */
  --band: 112px;          /* vine band above the columns; phone: 8px */
  --vine-y: 54px;
  --leaf-step: 46px;      /* phone: 62px */

  /* drawing */
  --stem: 2.4px;
  --stem-2: .8px;         /* offset 1.6px 1.2px, opacity .7 */
  --wash-w: 16px;         /* phone: 10px */
  --tendril: 1.6px;
  --rough-scale: 2;
  --bleed-scale: 9;

  /* motion */
  --t-grow: 560ms;
  --t-retract: 300ms;
  --t-leaf: 420ms;
  --t-leaf-delay: 330ms;
  --t-fold: 220ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role              | Family        | Size   | Weight | Line-height | Tracking | Case      |
|-------------------|---------------|--------|-------:|------------:|---------:|-----------|
| Wordmark          | Lora italic   | 104px  | 600    | 0.9         | −0.025em | title     |
| Page tail headline| Lora          | 30px   | 500 (em 600 italic) | 1.2 | 0  | sentence  |
| Links, body       | Lora          | 15px   | 400    | 1.55        | 0        | sentence  |
| Current link      | Lora italic   | 15px   | 600    | 1.55        | 0        | sentence  |
| Contact           | Lora          | 14px   | 400    | 1.55        | 0        | sentence  |
| Column headings   | Shantell Sans | 14px   | 500    | 1.2         | 0        | sentence  |
| Labels (Find us)  | Shantell Sans | 13px   | 500    | 1.4         | 0        | sentence  |
| Subline, caption  | Shantell Sans | 15 / 13px | 400 | 1.4         | 0        | sentence  |
| Legal             | Lora          | 13px   | 400    | 1.55        | 0        | sentence  |

Shantell Sans plays the botanist's pencil: every label and the figure caption are handwritten, every link is set in Lora.

## Motion

| Element         | Trigger            | Property           | From → To                               | Duration | Easing       | Delay |
|-----------------|--------------------|--------------------|-----------------------------------------|---------:|--------------|------:|
| Tendril         | hover / focus / tap| stroke-dashoffset  | length → 0                              | 560ms    | `--ease-out` | 0     |
| Tip + mid leaf  | same               | transform, opacity | scale(0) rotate(−40deg), 0 → none, 1     | 420 / 200ms | `--ease-out` | 330ms |
| Tendril         | leave / blur       | stroke-dashoffset  | 0 → length                              | 300ms    | `--ease`     | 0     |
| Leaves          | leave / blur       | transform, opacity | back to scale(0), 0                     | 220ms    | `--ease`     | 0     |
| Link            | hover / focus      | colour, underline  | ink → moss, none → 1px at 4px offset    | instant  |              |       |

Nothing loops. Reduced motion: transitions are removed, so tendrils and leaves appear and disappear in their end state immediately.

## States

- **Resting:** vine, leaves and buds drawn; only the current page's tendril and flower are out.
- **Hover / focus-visible link:** tendril and two leaves out, link moss with underline; focus also shows a 2px ink outline, 3px offset.
- **Current page:** `aria-current="page"`, italic 600, permanent tendril and flower; hover does not retract it.
- **Touch tap:** grows the tapped link's tendril, retracts others (except current).
- **Legal link hover:** colour `--ink`.

## Accessibility

- The drawing is one `aria-hidden="true"` SVG behind the links with `pointer-events: none`, so it never blocks a click or a text selection.
- The sitemap is a `<nav aria-label="Sitemap">`; the current page is marked with `aria-current="page"`, not only with the flower and italics.
- Focus does exactly what hover does; a focused link keeps its tendril when the mouse leaves it.
- No text sits on the wash or leaves: the vine band holds only drawing, and on phones the vine stays inside the 48px gutter.
- Contrast: `--ink` 11.3:1, `--ink-2` 6.2:1, `--moss` 5.8:1 on `--paper`. Grain is 6% alpha and does not change these.
- Hit targets on phones: links get 9px vertical padding (about 41px rows); legal links stack with 6px padding.

## Responsive rules

- ≥ 1280: as specified.
- 1001 to 1279: four columns narrow; the vine regenerates to the new width.
- ≤ 1000: columns become 2 × 2 with 22px row gap; wordmark 80px. Tendrils for the second row start from the vine and descend past the first row in the gutter.
- ≤ 640: gutters 20px, column gutter 48px, one column list, band padding 8px, vine vertical at x ≈ 22px with wash 10px, leaf step 62px; wordmark 60px; contact grid stays 2 columns; legal stacks. Nothing scrolls sideways at 390.
- Always regenerate on resize; never scale a desktop drawing down for phones.

## Acceptance checklist

**Always**

- [ ] The vine is generated from the layout (link and column rectangles), not a fixed picture, and is rebuilt on resize.
- [ ] Hover, keyboard focus and tap each grow a tendril to the exact link, drawn with stroke-dashoffset, then unfurl leaves after a delay.
- [ ] Leaving retracts faster than growing; a focused link keeps its tendril.
- [ ] The current page has a permanent tendril and a flower, plus `aria-current="page"`.
- [ ] The drawing has an ink tremble (displacement filter), a second offset stem line, a bleeding wash and hatched leaves.
- [ ] No text overlaps the drawing at 1280 or 390, and the drawing never intercepts pointer events.
- [ ] Reduced motion shows end states without transitions.
- [ ] Contact, text-link socials, sitemap and a legal row are all present; legal sits on the bottom edge of the first frame.

**This demo**

- [ ] Nursery is Fernhollow, Hollow Lane, Kington HR5 3QE, 01544 230 187.
- [ ] Columns are Nursery (5), Visit (4), Journal (4), Elsewhere (4); "Seed room" is current.
- [ ] Vine 2.4px `#24332B` with wash `#A9BE98` at .5; flower petals `#B0435A`, centre `#C99A3A`.
- [ ] Tendril grows in 560ms, leaves start at 330ms.

## Implementation notes

**Draw the stem from points, smoothed with quadratic midpoints.** Sample a wobble function every 12px and join midpoints; it gives a continuous, organic curve with no visible joins.

```js
const wob = (t) => Math.sin(t / 74) * 13 + Math.sin(t / 31 + 1.3) * 4 + Math.sin(t / 190) * 6;
const at = (t) => vert ? [22 + wob(t) * .55, t] : [t, 54 + wob(t)];
const smooth = (pts) => pts.reduce((d, p, i) => i
  ? d + ` Q${pts[i-1][0]} ${pts[i-1][1]} ${(p[0]+pts[i-1][0])/2} ${(p[1]+pts[i-1][1])/2}`
  : `M${p[0]} ${p[1]}`, '');
```

**One tendril per link, aimed from its rectangle.** Start on the vine above the column gutter, S-curve down, finish with a curl toward the text; measure its length once for the dash.

```js
const sx = col.left - R.left + 12, sy = at(sx)[1];
const ex = col.left - R.left + 16, ly = r.top - R.top + r.height / 2;
const d = `M${sx} ${sy} C${sx - 18},${sy + (ly - sy) * .36} ${ex + 24},${sy + (ly - sy) * .7} ${ex} ${ly}`
        + ' c3 4 10 4 10 -1 c0 -4 -5 -5 -6 -2';
p.setAttribute('d', d);
const len = p.getTotalLength();
p.style.strokeDasharray = len; p.style.strokeDashoffset = len;   // hidden until .on
```

**Unfurl leaves around their own base.** Wrap each leaf `<use>` in a `.sprout` group with `transform-box: fill-box`, start at `scale(0) rotate(-40deg)`, and delay the transition until the tendril has nearly arrived.

Common mistakes: drawing after the web font loads changes link positions, so wait for `document.fonts.ready`; putting the flower over the first letters of the link (keep it in the gutter, ≤ 30px from the column edge); scaling one SVG for phones instead of regenerating the vertical version; forgetting `pointer-events: none` on the overlay.
