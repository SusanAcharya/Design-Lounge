<!-- Design Lounge Nº 371 · "Shop drawer with accordion sections" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Shop drawer with accordion sections

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The mobile menu of a homeware shop, "Loam & Linen". A hamburger in the shop header slides a warm white drawer in from the left. It covers 86% of the screen over a brown scrim. The drawer has a search field at the top, five shop sections, a tan promo row and two pinned links at the bottom: Account and Help. Sections with children open as accordions. Only one is open at a time, and the height animates. The detail worth copying is the pinned footer: the section list scrolls, but Account and Help never scroll away.

This is not `m3-navigation-drawer`. That is a native Material app drawer with destinations and a tonal active pill. This one is a website shop menu with search, nested categories and a promo.

## Reference behaviour

1. First frame (hero): the drawer is open with "Kitchen & dining" expanded. The body has `.open`, the hamburger has `aria-expanded="true"`, and the page is `inert`. No animation plays on load.
2. Tap the close button (top right of the drawer), tap the scrim, or press Esc: the drawer slides to `translateX(-104%)` over 260ms `cubic-bezier(.4,0,1,1)`. The scrim fades on the same clock. The drawer turns `visibility: hidden` at 260ms. Focus returns to the hamburger. Body scroll unlocks.
3. Tap the hamburger: the drawer slides from `-104%` to `0` over 380ms `cubic-bezier(.32,.72,0,1)`. The scrim fades from 0 to 1 (`rgba(58,42,31,.48)`) over 380ms. 60ms later focus moves to the close button.
4. Tap a closed section ("Bedroom"): its panel grows from 0 to its full height over 280ms, its chevron turns 180 degrees, and whichever section was open closes on the same clock.
5. Tap the open section again: it closes. Zero sections open is allowed.
6. Collapsed panels are `inert`, so their links are not in the tab order.
7. Tap a submenu link, "New in", the promo or a footer link: the drawer closes. The demo has no routing.
8. Typing in search and pressing Enter does nothing in the demo. A product sends it to its search results page.
9. The section list scrolls inside the drawer if it is taller than the space. The head, search and footer stay put.
10. Tab and Shift+Tab cycle only through visible controls inside the drawer.

## Structure

```
390 x 844 (54px status reserve on top, 84px browser bar drawn over the bottom)
+----------------------------------+------+
|                                  | page |  drawer: 86% wide, max 420px
| Loam & Linen                (X)  | dim  |  head 54 + 52px, close 44px disc
| [ Q  Search plates, linen, oak ] |      |  search 48px, radius 12
| New in              (48 pieces)  |      |  row 52px, serif 19px
| Kitchen & dining             ^   |      |  open
|  | Dinnerware                    |      |  sub row 44px, 2px tan rule
|  | Glassware                     |      |
|  | Table linen                   |      |
|  | Shop all kitchen              |      |  600 weight
| Bedroom                      v   |      |
| Living                       v   |      |
| Bath                         v   |      |
| [ Free delivery over $120    -> ]|      |  tan row, 64px, radius 12
|----------------------------------|      |  1px rule
| [ o Account ]   [ ? Help ]       |      |  48px, 2 columns, gap 8
|   (84px browser bar + 8px)       |      |
+----------------------------------+------+
gutter 20px · right corners radius 12px
```

- `<header class="top">` holds the hamburger (`aria-controls="drawer"`), the centred serif logo and a bag link with a count of 2.
- `<main class="page">` holds a tan hero card ("The long table") and a two-column product grid. It gets `inert` while the drawer is open.
- `<div class="scrim" data-close>` is fixed, `inset: 0`, `z-index: 10`.
- `<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">` is fixed to the left, `z-index: 11`, a flex column.
- `.d-head`: the logo text (`id="drawer-title"`) and the close button.
- `<form class="search" role="search">` with a visually hidden `<label>` and a 48px `type="search"` input.
- `<nav class="d-body" aria-label="Shop">` is `flex: 1; min-height: 0; overflow-y: auto`. It holds `<ul class="sections">` and the promo link.
- A section with children is a `<button class="row" aria-expanded aria-controls>` followed by `<div class="panel" role="region" aria-labelledby>` containing one inner `<div>` and a `<ul class="sub">`.
- A section without children ("New in") is a plain link styled as a row, with a pill tag.
- `.d-foot` is a two-column grid of links, outside the scroll area, so it stays pinned.

### Content

- Logo: "Loam & Linen". Bag count: 2.
- Search placeholder: "Search plates, linen, oak".
- Sections: New in (tag "48 pieces"); Kitchen & dining (Dinnerware, Glassware, Table linen, Shop all kitchen); Bedroom (Bedding, Throws & blankets, Sleepwear, Shop all bedroom); Living (Cushions, Rugs, Lamps, Shop all living); Bath (Towels, Robes, Soap & care, Shop all bath).
- Promo: "Free delivery over $120", "Until Sunday 12 October".
- Footer: Account, Help.
- Page: eyebrow "Autumn edit · 38 pieces", heading "The long table", line "Stoneware, washed linen and oiled oak for dinners that run past eleven.", button "Shop the edit"; products Ridge stoneware plate $28, Washed linen napkins set of 4 $36, Oak pouring jug $64, Amber tumbler $14.

## Tokens

```css
:root {
  /* colour: warm white, tan, deep brown */
  --page: #fbf7f1;          /* page and input background */
  --surface: #fffdf9;       /* drawer */
  --tan: #d8c2a3;           /* promo row, submenu rule */
  --tan-soft: #f1e6d6;      /* close disc, tags, hero card */
  --tan-deep: #b8996f;      /* product art only */
  --ink: #3a2a1f;           /* text, primary button, focus */
  --ink-2: #6e5a49;         /* secondary text, chevrons, sub links */
  --line: #e8dccb;          /* hairlines and borders */
  --scrim: rgba(58, 42, 31, .48);

  /* type */
  --serif: "Fraunces", Georgia, serif;
  --sans: "Source Sans 3", system-ui, sans-serif;

  /* layout */
  --top: 54px;
  --chrome-bottom: 84px;    /* browser bar over the frame; env(safe-area-inset-bottom) in production */
  --gutter: 20px;
  --r: 12px;
  --r-sm: 8px;
  --shadow: 0 0 0 1px rgba(58, 42, 31, .06), 24px 0 48px -24px rgba(58, 42, 31, .35);

  /* motion */
  --std: cubic-bezier(.2, .7, .2, 1);
  --sheet: cubic-bezier(.32, .72, 0, 1);
  --t-drawer: 380ms;
  --t-drawer-out: 260ms;
  --t-acc: 280ms;
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Drawer logo | Fraunces | 20px / 1 | 600 | -0.01em | `--ink` |
| Section row | Fraunces | 19px / 1.2 | 500 | -0.01em | `--ink` |
| Promo title | Fraunces | 16px / 1.25 | 600 | 0 | `--ink` |
| Sub link | Source Sans 3 | 16px | 400 | 0 | `--ink-2` |
| Sub "Shop all" | Source Sans 3 | 16px | 600 | 0 | `--ink` |
| Tag pill | Source Sans 3 | 12px / 1 | 600 | 0.04em | `--ink-2` |
| Search input | Source Sans 3 | 16px | 400 | 0 | `--ink` |
| Footer link | Source Sans 3 | 15px | 600 | 0 | `--ink` |
| Promo date | Source Sans 3 | 13px | 400 | 0 | `--ink` |
| Page heading | Fraunces | 34px / 1.05 | 600 | -0.02em | `--ink` |
| Eyebrow | Source Sans 3 | 13px | 600 | 0.06em, upper | `--ink-2` |

Keep the search input at 16px. Smaller input text makes iOS Safari zoom the page on focus.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Drawer | open | transform | translateX(-104%) → 0 | 380ms | `--sheet` |
| Drawer | close | transform | 0 → translateX(-104%) | 260ms | cubic-bezier(.4,0,1,1) |
| Scrim | open / close | opacity | 0 ↔ 1 | 380ms / 260ms | `--std` |
| Drawer, scrim | close | visibility | visible → hidden | 0 | step at 260ms |
| Panel | toggle | grid-template-rows | 0fr ↔ 1fr | 280ms | `--std` |
| Chevron | toggle | transform | rotate(0) ↔ rotate(180deg) | 280ms | `--std` |

The previous section closes on the same 280ms clock as the new one opens. There is no stagger between them.

Reduced motion: the drawer does not slide. It fades `opacity 0 → 1` over 150ms. The scrim fades over 150ms. Accordion panels and chevrons switch with no transition.

## States

- Drawer closed: off screen at -104% and `visibility: hidden`. The extra 4% hides the shadow too.
- Drawer open: on screen, right corners radius 12px, shadow `--shadow`.
- Section closed: chevron down, `aria-expanded="false"`, panel `inert`, height 0.
- Section open: chevron up, `aria-expanded="true"`, panel full height.
- Row focus-visible: 2px `--ink` outline inset by 2px, so it is not clipped by the scroll area.
- Sub link hover: `--ink-2` to `--ink`.
- Close button: `--tan-soft` disc, hover `--line`.
- Search focus-visible: border hidden, 2px `--ink` outline at 0 offset.
- Footer link: `--page` fill, 1px `--line` border, radius 8px.
- Empty search, loading and error are not in this piece. A product shows results on its search page.

## Accessibility

- The drawer is `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing at the logo text.
- The hamburger has `aria-controls="drawer"` and `aria-expanded`, and the label "Open menu". The close button is labelled "Close menu".
- Section buttons use `aria-expanded` and `aria-controls`. Panels are `role="region"` with `aria-labelledby` back to their button.
- Collapsed panels get `inert`, so their links are skipped by Tab and by screen readers.
- Focus trap: on Tab, collect `a[href], button, input` inside the drawer, filter out anything inside `[inert]`, and wrap at the ends.
- Esc closes. The scrim closes on tap. Focus returns to the hamburger.
- While open, `<main>` gets `inert` and the body gets `overflow: hidden`.
- The search field has a real `<label>` that is visually hidden. The placeholder is not the label.
- Icons are `aria-hidden` SVGs. Chevrons carry no text.
- Contrast: `#3a2a1f` on `#fffdf9` is about 13:1. `#6e5a49` on `#fffdf9` is about 6.3:1. `#3a2a1f` on `#d8c2a3` is about 7.5:1.
- Hit targets: section rows 52px, sub links 44px, close and hamburger 44px, search 48px, footer links 48px.

## Responsive rules

- At 360 wide, the drawer is 310px. Footer labels are one word each so both fit in two columns. Long labels truncate with an ellipsis. Do not wrap them.
- At 390 wide, the drawer is 335px and the page shows as a 55px dimmed strip on the right, which tells the user the page is still there.
- The drawer never goes above 420px wide, so on a large phone or small tablet the page strip grows.
- At 768px and wider, do not use this drawer. Use a header with a mega menu, such as `editorial-mega-menu`.
- When the list is taller than the space, only `.d-body` scrolls. Add `overscroll-behavior: contain` so the page does not scroll behind it.
- Bottom padding of the footer is `--chrome-bottom + 8px`. In the Lounge frame that is 84px because the browser bar covers the bottom. In production use `max(12px, env(safe-area-inset-bottom))`.
- Do not draw a status bar or a URL bar.

## Acceptance checklist

### Always

- [ ] The drawer is 86% of the screen width, max 420px, from the left, over a dimmed page.
- [ ] Open is 380ms with the sheet curve. Close is 260ms and faster than open.
- [ ] Only one accordion section is open at a time, and the open one can be closed.
- [ ] Panel height animates; it does not jump.
- [ ] Collapsed panels are `inert`.
- [ ] Search is the first control under the head and is 48px tall with 16px text.
- [ ] Account and help links stay pinned while the list scrolls.
- [ ] Esc, the close button and the scrim all close it. Focus returns to the hamburger.
- [ ] Tab never leaves the drawer while it is open.
- [ ] Every hit target is at least 44px.
- [ ] Reduced motion replaces the slide with a 150ms fade.

### This demo

- [ ] First frame shows the drawer open with "Kitchen & dining" expanded.
- [ ] Sections read New in, Kitchen & dining, Bedroom, Living, Bath, in Fraunces 19px.
- [ ] The promo row is `#d8c2a3` and reads "Free delivery over $120".
- [ ] The footer reads Account and Help.
- [ ] Drawer `#fffdf9`, text `#3a2a1f`, radius 12px on the right corners.

## Implementation notes

Animate accordion height with a grid row instead of measuring `scrollHeight`. The inner element needs `min-height: 0` and `overflow: hidden`, or the row will not shrink.

```css
.panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--t-acc) var(--std); }
.row[aria-expanded="true"] + .panel { grid-template-rows: 1fr; }
.panel > div { overflow: hidden; min-height: 0; }
.row svg { transition: transform var(--t-acc) var(--std); }
.row[aria-expanded="true"] svg { transform: rotate(180deg); }
```

One open at a time, with `inert` kept in step:

```js
function toggleRow(row) {
  const willOpen = row.getAttribute('aria-expanded') !== 'true';
  rows.forEach(r => {
    const on = r === row && willOpen;
    r.setAttribute('aria-expanded', on);
    document.getElementById(r.getAttribute('aria-controls')).inert = !on;
  });
}
```

Pin the footer by making the drawer a flex column and only letting the middle scroll:

```css
.drawer { position: fixed; top: 0; bottom: 0; left: 0; width: 86%; max-width: 420px; display: flex; flex-direction: column; }
.d-body { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.d-foot { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; border-top: 1px solid var(--line); }
```

Common mistakes:

- Putting the footer links at the end of the scrolling list, so they scroll out of view.
- Allowing several sections open at once. On a phone the list runs off the screen.
- Animating `height: auto`. It does not animate. Use the grid row or measure.
- Leaving collapsed links focusable, so Tab lands on links you cannot see.
- Search text under 16px, which zooms the page on iOS.
- Using `translateX(-100%)`, which leaves the shadow peeking at the left edge.
- Same speed for open and close. Close should feel quicker.
- A full-width drawer. The dimmed page strip is how people know they can tap out.
- Making "New in" an accordion with one child. A section with no children is a link.

Rebuild order:

1. Build the shop header and page.
2. Build the drawer as a flex column: head, search, scrolling list, pinned footer.
3. Add the sections and the grid-row accordion with one open at a time.
4. Add the scrim and the slide timings.
5. Add `inert`, scroll lock, the focus trap, Esc and scrim close.
6. Add the reduced-motion block.
7. Render the open state first with transitions off for two frames.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
