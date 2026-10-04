<!-- Design Lounge Nº 421 · "Split navbar with centred wordmark" · designlounge.vercel.app -->

# Split navbar with centred wordmark

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The top bar for Verane, a fictional lake hotel with a dining room. The wordmark sits in the exact centre. Three links sit to its left (Rooms, Dining, Garden). Two links and an outlined "Reserve a table" button sit to its right (Events, Journal). At the top of the page the bar is transparent and its text is ivory over a deep green hero drawn in CSS: a radial gradient, three brass hairline arches, and a brass sun. After 80px of scroll the bar fills with paper, the text turns dark, a 1px hairline appears under it, and the wordmark scales from 40px to 24px. The detail worth copying: a three-column grid of `minmax(0,1fr) auto minmax(0,1fr)` keeps the wordmark in the true centre no matter how long each side is.

## Reference behaviour

1. First frame: scroll is 0. The bar is 104px tall, transparent, with ivory text `#f7f2e8` and a 1px bottom line in `rgba(247,242,232,.18)`.
2. The wordmark "VERANE" is Cormorant Garamond 500, 40px, tracked 0.32em, uppercase. Under it sits "EST. 1931" in Jost 9px, tracked 0.5em, at 80% opacity.
3. "Dining" is the current page. It has `aria-current="page"` and a 1px underline 4px below the text.
4. The hero fills the viewport (100vh, min 640px). Its headline "Supper under the long arches" is 76px serif, centred, 72px from the bottom. "long arches" is italic brass `#d9b878`.
5. The user scrolls. When `scrollY` passes 80, the bar gets the class `solid`. Over 320ms on `cubic-bezier(.2,.7,.2,1)`:
   - height goes 104px to 68px,
   - background goes transparent to paper `#f4efe4`,
   - text goes ivory to ink `#1b1f1c`,
   - the bottom line goes to `#d8cfbb`,
   - the wordmark scales from 1 to 0.6 (40px to 24px),
   - "EST. 1931" fades to 0 over 200ms.
6. The button "Reserve a table" is outlined in `currentColor` over the hero. In the solid bar its border and text turn deep green `#1d3a2f`.
7. Scrolling back above 80px reverses every change on the same timing.
8. Hovering a link draws the 1px underline from left to right over 200ms.
9. Hovering the button fills it. Over the hero: ivory fill, green text. In the solid bar: green fill, paper text.
10. The page scrolls through real sections below the hero: Dining (menu with prices), Rooms (three room cards), Garden, Reserve. Each section is a two-column band with a 1px rule under it.
11. Below 900px wide the links and the button hide. A 44px square menu button appears on the left. The wordmark stays centred.
12. Clicking the menu button opens a paper panel under the bar with all five links and the button at full width. `aria-expanded` flips. Escape closes it and returns focus to the button. Clicking a link closes it.

## Structure

```
1280 x 800 frame, header fixed, padding 0 48px

transparent state, 104px tall
+--------------------------------------------------------------------------+
| ROOMS  DINING  GARDEN        V E R A N E        EVENTS JOURNAL [RESERVE A TABLE ->] |
|                               EST. 1931                                  |
+------------------------------------------------------------------------- 1px rgba line
|                    deep green hero, 100vh                                 |
|        (arch)            ( arch  + sun )              (arch)              |
|                 HOTEL AND DINING ROOM · LAKE OSSIACH                     |
|                  Supper under the long arches   76px                     |
| SCROLL                                              KITCHEN 18:30 – 23:00 |
+--------------------------------------------------------------------------+

solid state, 68px tall, paper, 1px #d8cfbb line
| ROOMS  DINING  GARDEN           VERANE (24px)      EVENTS JOURNAL [RESERVE A TABLE ->] |

grid: minmax(0,1fr) | auto | minmax(0,1fr), gap 32px
```

- The bar is a `header`, `position: fixed`, full width, `z-index: 10`.
- Inside, one `div` holds the three-column grid, max-width 1280px.
- The left links are a `nav` labelled "Primary, left" with a `ul`.
- The wordmark is a link to the top of the page, `aria-label="Verane, home"`.
- The right column is a flex row, `justify-content: flex-end`: a `nav` labelled "Primary, right" with two links, then the button link.
- The menu button is the first child of the grid but is `display: none` above 900px, so it does not take a column.
- The mobile panel is a sibling of the header, fixed under it.
- The hero is a `section` with decorative `div`s for the arches, sun and floor shade. They carry no text.
- The sections below use `section` with an `h2` each. The hero `h1` is the only `h1`.

## Tokens

```css
:root {
  /* surfaces */
  --paper: #f4efe4;        /* solid bar, page */
  --paper-2: #ebe4d4;      /* card swatches */
  --green: #1d3a2f;        /* hero, button in solid bar */
  --green-2: #142a22;      /* hero edge */

  /* ink */
  --ink: #1b1f1c;          /* text in solid bar */
  --ink-2: #4a524c;        /* body copy */
  --on-dark: #f7f2e8;      /* text over hero */
  --on-dark-2: rgba(247,242,232,.72);

  /* accent */
  --brass: #b08d4a;        /* arches, sun, focus ring */
  --brass-2: #8a6a2f;      /* kicker text on paper */
  --line: #d8cfbb;         /* hairline */

  /* type */
  --serif: "Cormorant Garamond", Georgia, serif;
  --sans: "Jost", system-ui, sans-serif;
  --fs-mark: 40px;
  --fs-link: 12px;
  --fs-h1: 76px;
  --fs-h2: 52px;
  --fs-body: 16px;

  /* space */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;

  /* bar */
  --bar-h: 104px;
  --bar-h-solid: 68px;
  --mark-scale-solid: 0.6;
  --threshold: 80px;

  /* radius and shadow */
  --radius: 0;
  --shadow: none;

  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --dur: 320ms;
  --dur-micro: 200ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Cormorant Garamond | 40px, scaled to 24px | 500 | 1 | 0.32em | upper |
| Wordmark sub | Jost | 9px | 500 | 1 | 0.5em | upper |
| Nav link | Jost | 12px | 500 | 1.6 | 0.22em | upper |
| Button | Jost | 12px | 500 | 1 | 0.2em | upper |
| Hero eyebrow | Jost | 12px | 400 | 1.6 | 0.32em | upper |
| Hero h1 | Cormorant Garamond | 76px | 500 | 1 | -0.01em | sentence |
| Section kicker | Jost | 12px | 400 | 1.6 | 0.28em | upper |
| Section h2 | Cormorant Garamond | 52px | 500 | 1.05 | 0 | sentence |
| Body | Jost | 16px | 400 | 1.6 | 0 | sentence |
| Menu item | Cormorant Garamond | 22px | 500 | 1.6 | 0 | sentence |

The serif is only for the wordmark, headings and menu items. Links and buttons stay in the sans. Add `margin-right: -0.32em` to the wordmark so its trailing tracking does not push it off centre.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Bar height | scrollY crosses 80 | height | 104px → 68px | 320ms | `--ease` |
| Bar fill | same | background-color | transparent → `#f4efe4` | 320ms | `--ease` |
| Bar text | same | color | `#f7f2e8` → `#1b1f1c` | 320ms | `--ease` |
| Bar line | same | border-bottom-color | `rgba(247,242,232,.18)` → `#d8cfbb` | 320ms | `--ease` |
| Wordmark | same | transform | scale(1) → scale(0.6) | 320ms | `--ease` |
| Sub line | same | opacity | 0.8 → 0 | 200ms | `--ease` |
| Button | same | border and text colour | currentColor → `#1d3a2f` | 200ms | `--ease` |
| Link underline | hover | transform | scaleX(0) → scaleX(1), origin left | 200ms | `--ease` |
| Button fill | hover | background, colour | none → filled | 200ms | `--ease` |

- There is no delay and no stagger. Everything moves together.
- Scale the wordmark with `transform`, not `font-size`, so the row does not reflow during the move.
- Reduced motion: set every transition to 0ms. The bar still switches at 80px, it just switches at once. Turn off smooth scroll.

## States

- Transparent bar: ivory text, no fill, faint ivory hairline.
- Solid bar: paper fill, ink text, `#d8cfbb` hairline, wordmark at 0.6 scale, sub line hidden.
- Link resting: no underline.
- Link hover: 1px underline in `currentColor`, 4px under the baseline box.
- Link current: `aria-current="page"` and the same underline, always shown.
- Button resting: 1px border, 42px tall, 0 18px padding, no radius.
- Button hover: filled (see Motion).
- Focus-visible: 2px brass outline `#b08d4a`, offset 3px, on every link, the wordmark, the button and the menu button.
- Menu panel closed: `display: none`. Open: paper panel with 1px rules between links. The current link is brass `#8a6a2f`.
- No loading, empty or error state. This is navigation.

## Accessibility

- Two `nav` elements, labelled "Primary, left" and "Primary, right". Screen readers read them in DOM order, left first.
- The wordmark is a link with `aria-label="Verane, home"`. The sub line is inside it and is decorative.
- The current link has `aria-current="page"`. Only one link carries it.
- The menu button has `aria-controls="panel"`, `aria-expanded`, and an `aria-label` that switches between "Open menu" and "Close menu".
- Escape closes the panel and returns focus to the menu button.
- Tab order: left links, wordmark, right links, button. On small screens: menu button, wordmark, then the panel links when open.
- Contrast: `#f7f2e8` on `#1d3a2f` is about 11:1. `#1b1f1c` on `#f4efe4` is about 15:1. Both pass at 12px.
- Hit targets: links are 12px text at line-height 1.6 with 10px vertical padding, so about 40px tall. The button is 42px. The menu button is 44px square.
- Decorative hero shapes carry no text and need no labels.
- Icons are inline SVG with `aria-hidden="true"`.

## Responsive rules

- At 1280 and above: the full layout. Bar padding 0 48px. Link gap 32px. Button reads "Reserve a table".
- At 1180 and below: padding 0 32px, grid gap 24px, link gap 24px, link tracking 0.16em, the button reads "Reserve".
- At 1024: the same as 1180. Check that the right column does not touch the wordmark.
- Below 900: hide both `nav` elements and the button. Show the 44px menu button in the left column. The wordmark drops to 28px and the sub line hides. The bar is 72px tall, 60px when solid. The solid wordmark scale is 0.86.
- Below 900, also: the hero h1 is 44px, the h2 is 38px, and sections stack to one column with 72px 24px padding. Room cards stack to one column.
- Never let the row wrap. If a product has more than three links per side, collapse earlier instead of shrinking type below 11px.
- The page never scrolls sideways. Use `minmax(0,1fr)` on every grid column.

## Acceptance checklist

### Always

- [ ] The wordmark is centred in the viewport within 1px at every width, whatever the link count on each side.
- [ ] The bar is transparent with light text at scroll 0 and solid with dark text past the threshold.
- [ ] The switch happens at one scroll threshold and reverses when scrolling back.
- [ ] The wordmark shrinks with `transform: scale`, not by changing font-size.
- [ ] Exactly one link has `aria-current="page"`.
- [ ] The primary action is an outlined button on the right, 42px tall.
- [ ] Focus rings are visible on every control in both bar states.
- [ ] Below the collapse width a 44px menu button opens a panel; `aria-expanded` tracks it; Escape closes it.
- [ ] Reduced motion removes every transition but keeps both states.
- [ ] No horizontal scroll at any width from 360 to 1600.

### This demo

- [ ] The threshold is 80px of scroll.
- [ ] The bar is 104px tall, then 68px when solid.
- [ ] The wordmark is "VERANE", 40px, scaling to 0.6 (24px).
- [ ] Left links: Rooms, Dining, Garden. Right links: Events, Journal. Button: "Reserve a table".
- [ ] Dining is the current link.
- [ ] Hero is `#1d3a2f` with three brass arches and a brass sun, no images.
- [ ] The solid bar is `#f4efe4` with a `#d8cfbb` hairline.
- [ ] The menu collapses below 900px.

## Implementation notes

Always: this is one bar with two looks. Do not render two headers and swap them.

The grid that keeps the wordmark centred:

```css
.bar-in {
  display: grid;
  grid-template-columns: minmax(0,1fr) auto minmax(0,1fr);
  align-items: center;
  gap: 32px;
  height: 100%;
  padding: 0 48px;
}
.right-group { display: flex; justify-content: flex-end; align-items: center; gap: 32px; min-width: 0; }
.mark { letter-spacing: .32em; margin-right: -.32em; transform-origin: center; }
```

The two outer columns are equal, so the middle one sits in the true centre. A flex row with `space-between` does not do this: with three links on the left and two links plus a button on the right, the wordmark drifts.

The scroll switch, throttled to one frame:

```js
const bar = document.getElementById('bar');
const THRESHOLD = 80;
let ticking = false;
function update() {
  bar.classList.toggle('solid', window.scrollY > THRESHOLD);
  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(update); ticking = true; }
}, { passive: true });
update();
```

Call `update()` once on load so a page restored mid-scroll starts solid.

The state styles:

```css
.bar { height: var(--bar-h); color: var(--on-dark); background: rgba(244,239,228,0);
  border-bottom: 1px solid rgba(247,242,232,.18);
  transition: height var(--dur) var(--ease), background-color var(--dur) var(--ease),
              color var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.bar.solid { height: var(--bar-h-solid); background: var(--paper); color: var(--ink); border-bottom-color: var(--line); }
.mark { transition: transform var(--dur) var(--ease); }
.bar.solid .mark { transform: scale(.6); }
.bar.solid .cta { border-color: var(--green); color: var(--green); }
```

Use `rgba(244,239,228,0)` as the start colour, not `transparent`. Some engines fade `transparent` through grey.

Common mistakes:

- Centring the wordmark with `position: absolute; left: 50%` and letting links slide under it at 1024px.
- Animating `font-size` on the wordmark, which reflows the row 20 times during the move.
- Forgetting `margin-right: -0.32em`, so a tracked wordmark sits a few pixels left of centre.
- Putting the hero under the bar with a top margin. The hero starts at 0 and the bar floats over it.
- Leaving ivory text in the solid bar, or dark text over the hero, for one frame on load.
- A drop shadow on the solid bar. The hairline is the separation.
- Using a photo for the hero. This piece draws it in CSS.
- Five links on one side and none on the other. Split them so each side reads as a group.
- A filled button. On a luxe site the reserve action is outlined until hover.

Rebuild order:

1. Build the fixed header with the three-column grid.
2. Place three links, the wordmark, two links and the button.
3. Build the green hero at 100vh with the arches and sun.
4. Add the `solid` class styles and the scroll listener.
5. Add the sections below so the page scrolls.
6. Add the 1180 and 900 breakpoints and the menu panel.
7. Check focus rings in both states.
8. Turn on reduced motion and confirm the switch is instant.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
