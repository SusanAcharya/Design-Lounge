<!-- Design Lounge Nº 624 · "Swipe tab pager with stretching pill" · www.designlounge.live -->

# Swipe tab pager with stretching pill

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The stall browser of "Wrenford Market", an invented app for a Saturday farmers' market in a canal yard. Four tabs (Produce, Bakery, Dairy, Flowers) sit over four full-width pages you swipe sideways. The tomato pill under the labels is driven by the page position itself, not by the selected index: mid-swipe its leading edge runs ahead and its trailing edge lags, so it stretches into a longer, thinner capsule and then contracts onto the next tab; label text inside the pill is cream, outside it is ink, cut exactly at the pill's edge. Release decides by velocity first and position second, a spring carries the momentum in, and the first and last page rubber-band while the pill squeezes against the wall. The language is close to Material 3 Expressive (tonal track, bold pill, springy motion), dressed in warm market colours. Worth copying: the sine/cosine edge interpolation, the clipped cream copy of the labels, and a direction lock that leaves vertical scrolling alone.

## Structure

```
390 × 844 (column max-width 440, centred on wider screens)
┌──────────────────────────────────────┐ 60px top pad
│ • Open now, until 13:00          (⌕) │ search 40×40
│ Wrenford Market                      │ 32px / 800
│ Canal Yard · Saturday 1 November ·…  │ 15px
│                                      │ 18
│ ┌──────────────────────────────────┐ │ tablist 48h, r24, pad 4, margin 0 12
│ │(Produce)  Bakery   Dairy  Flowers│ │ tabs 40h, pad 0 14, pill r20
│ └──────────────────────────────────┘ │
│ ┌─pager (flex 1, overflow hidden)──┐ │ margin-top 8
│ │ page: pad 12 16 120, scroll-y    │ │ 4 pages side by side, translateX
│ │ ┌hero r22────────────────────┐   │ │
│ │ │ art 132   [PITCH 7]        │   │ │
│ │ │ First leeks of the winter… │   │ │ 21px / 700
│ │ └────────────────────────────┘   │ │
│ │ [sw] Heritage tomatoes  £4.20 (✓)│ │ rows 12px v-pad, 1px rules
│ │ [sw] Cavolo nero        £1.80 (✓)│ │
│ │ [sw] Crown prince squash £2.60(+)│ │
│ ┌──────────────────────────────────┐ │ basket 60h r30, bottom 34, ink
│ │ 2 items · £6.00          (Basket)│ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

- `header` with a status line, a real `button` (aria-label "Search the market"), `h1`, and a subline `p`.
- `div role="tablist" aria-label="Stall types"` holding four `button role="tab"` (`id="t0"…`, `aria-controls="p0"…`, `aria-selected`, roving `tabindex`), then one `div.lit aria-hidden="true"` with four plain `span` copies of the labels.
- `div.pager` (overflow hidden, `touch-action: pan-y`) > `div.track` (flex) > four `section role="tabpanel" aria-labelledby="tN"`. Off-screen panels are `inert` and `visibility: hidden` at rest.
- Each panel: `article.hero` (art div + `h2` + `p`) and a `ul` of rows; each row ends with `button.add aria-pressed` labelled "Add Heritage tomatoes, mixed, £4.20 per kg, to basket".
- Basket bar is a `div` with a `p` (count + total) and a `button`. One visually hidden `p aria-live="polite"`.

## Motion

| Thing | Trigger | Property | From → to | Timing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Pager follow | locked drag | track translateX | 1:1, rubber-band past ends | frame | same |
| Pill edges | page position changes | clip-path inset left/right | sine lead, 1 − cos trail | frame | jumps with page |
| Pill thinning | stretch | clip inset top/bottom | 4 → 8px each | frame | none at rest |
| Pill squeeze | overscroll | width on the inner side | −0 → −30% | frame | same |
| Label colour | page position | color-mix ink-2 → ink by w | per tab | frame | jumps |
| Snap | release, tab tap, keys | translateX | x → −n·W, initial v from release | spring k 380, c 33 | instant |
| Peek | 1100ms after load, untouched | translateX | 0 → about −80px → 0 | spring, v₀ −1700px/s | none |
| Add press | :active | scale | 1 → 0.9 | 160ms --out | none |
| Add toggle | click | background, colour | transparent → ink | 160ms --ease | instant |
| Basket bump | add/remove | scale | 1 → 1.12 → 1 | 360ms --out | none |

## States

- Selected tab: underlying button text is transparent (the cream copy shows through the pill), `aria-selected="true"`, `tabindex="0"`.
- Unselected tab: ink-2 text; hover (pointer devices) darkens to ink.
- Mid-swipe: two labels partially in the pill, each split cream/ink at the pill edge; pill longer and up to 8px thinner.
- Overscroll: pager pulled past an end with resistance, pill squashed against that end.
- Focus-visible: 3px ink outline, 1px offset, around the tab (outside the pill so it shows on tomato and on the track); 3px ink outline on other buttons, cream outline on the basket button.
- Add button: rest 1.5px `#7d8378` ring with a plus; hover `#ebe6d9` fill; added: ink fill, cream check, `aria-pressed="true"`.
- Dragging: `cursor: grabbing`, `user-select: none` on the pager.

## Accessibility

- Proper tabs pattern: `tablist` / `tab` / `tabpanel`, `aria-controls` and `aria-labelledby` wired both ways, roving tabindex, Left/Right (wrapping), Home, End. Automatic activation is fine because pages are already rendered.
- The cream label copies are `aria-hidden`; the buttons carry the names.
- Off-screen panels are `inert` so Tab never lands in a page you cannot see, and `visibility: hidden` at rest so screen readers and hit-testing ignore them.
- A swipe that changes page announces "Bakery, page 2 of 4" in a polite live region (keyboard changes already announce via focus). Add/remove announces "Added. 3 items, £8.60".
- `touch-action: pan-y` on the pager: vertical scrolling stays native, horizontal drags never scroll the page. Tabs use `touch-action: manipulation`.
- Contrast: cream on tomato 5.9:1, ink-2 on track 5.6:1, ink-2 on ground 6.3:1, cream on ink 15:1. Unfilled button rings 3.9:1 against the ground.
- Hit targets: tabs 40px tall and at least 68px wide; add and search buttons 40 × 40; Basket button 44px tall.

## Responsive rules

- 360 wide: tabs still fit on one line (labels nowrap, 14px side padding); the pill math uses measured tab boxes so nothing changes.
- More than five tabs or long labels: make the tablist scroll horizontally and keep the active tab in view (scroll it by the same `p` so it moves with the pill).
- Wider than 440px: the column caps at 440 and centres; the page width W is the pager's width, re-measured on resize, after fonts load and on every pointer down.
- Short screens (< 700px tall): keep the header; pages scroll inside, the basket bar stays pinned 34px from the bottom.

## Acceptance checklist

### Always

- [ ] Horizontal drag locks only after 8px with |dx| > 1.2·|dy|; vertical drags scroll the page natively.
- [ ] The pill's edges follow page position continuously with sine lead and 1 − cos trail; it stretches mid-swipe and thins by up to 8px.
- [ ] Labels are split cream/ink exactly at the pill edge; base label colour cross-fades ink-2 → ink by progress.
- [ ] Release over 0.3px/ms goes one page in the fling direction; otherwise nearest page; never more than one page per swipe.
- [ ] The snap spring starts with the release velocity; a pause before lifting cancels the fling.
- [ ] First and last pages rubber-band with the 0.55 coefficient, and the pill squeezes against that end.
- [ ] Tapping a tab springs there from any position; a drag never fires a click on a button inside a page.
- [ ] `role="tablist"` with roving tabindex; Left/Right wrap, Home/End; focus ring visible on pill and track.
- [ ] Off-screen panels are inert and hidden at rest; swipes announce the new page politely.
- [ ] Reduced motion removes the peek and springs; drag stays 1:1.

### This demo

- [ ] Tabs "Produce", "Bakery", "Dairy", "Flowers"; pill `#b8401f` with `#fff7ec` labels on a `#e6e1d4` track.
- [ ] Title "Wrenford Market", "Canal Yard · Saturday 1 November · 31 stalls".
- [ ] Produce opens with "First leeks of the winter, pulled Thursday" and two items added; basket "2 items · £6.00".
- [ ] Wix Madefor Display for title, headlines and prices; Anek Latin at 94% width for tabs and body.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame, 390 × 844 (Lounge draws the status bar): 60px top padding. A green "Open now, until 13:00" with an 8px dot and a 3px pale halo, a 40px round search button at right, the title "Wrenford Market" (32px Wix Madefor Display 800) and "Canal Yard · Saturday 1 November · 31 stalls".
2. 18px below, the tab track: a 48px capsule (`#e6e1d4`, radius 24, 4px padding) with four content-width tabs spread by `justify-content: space-between`. "Produce" sits in a 40px tomato pill (`#b8401f`) in cream; the other labels are ink-2 `#545b52`.
3. Below, the pager fills the rest of the screen. Each page scrolls vertically on its own and holds a hero card (132px gradient "photograph" of the stall with a white pitch tag, then a 21px headline and a 15px note) and five product rows: 52px gradient swatch (radius 16), name and stall, price with unit, and a 40px round add button. Two items on Produce start added (ink fill, cream check).
4. A 60px ink basket bar floats 34px above the bottom: "2 items · £6.00 / Collect at Pitch 1 from 8:30" and a cream "Basket" button. Pages have 120px bottom padding so the last row clears it.
5. 1100ms after load, if nobody has touched it, the pager peeks once: a spring with an initial velocity of −1700px/s pulls the pager about 80px left and back, which shows the pill stretching toward "Bakery". It never repeats.
6. Pointer down anywhere on the pager does nothing until the pointer has moved 8px. If horizontal movement wins (|dx| > 8 and |dx| > 1.2·|dy|) the gesture locks horizontal: pointer capture, any running spring stops, the start point is rebased so nothing jumps. If vertical wins first, the gesture is abandoned and the page scrolls natively.
7. While locked, the pager follows the finger 1:1. Past the first or last page the overflow is rubber-banded: `(1 − 1/(|d|·0.55/W + 1))·W`, so a 200px pull moves about 85px.
8. Every frame, page position `p = −x/W` drives the pill. Between tabs i and i+1 with `t = p − i`: left edge = `lerp(left_i, left_i+1, 1 − cos(t·π/2))`, right edge = `lerp(right_i, right_i+1, sin(t·π/2))`. Going right the right edge leads; going left the left edge leads. The pill's stretch beyond its resting width (as a fraction of the tab distance) thins it by up to 8px (40 → 32px tall).
9. Overscroll at either end squeezes the pill toward the wall: it loses up to 30% of its width on the side away from the wall (`min(0.3, |overflow| · 1.4)`).
10. Label colour: each tab gets a weight `w = max(0, 1 − |p − k|)`; its base text mixes ink-2 → ink by w. A cream copy of all four labels on a tomato ground sits above the tabs, clipped to the pill with `clip-path: inset(... round 20px)`, so the part of a label inside the pill is cream and the part outside is ink.
11. Release: velocity is measured over the last 90ms of samples (and is zero if the finger paused 100ms before lifting). If |v| > 0.3px/ms the pager goes one page in the direction of the fling; otherwise it rounds to the nearest page. The target is clamped to the current page ±1 and the pager ends. A spring (stiffness 380, damping 33, slightly under-damped) starts from the release velocity, so a hard fling arrives with a small overshoot.
12. Tapping a tab selects it at once and springs there from wherever the pager is; jumping two tabs makes the pill slide (and stretch) through the tab between.
13. Keyboard: the tabs are a `role="tablist"`. Only the selected tab is in the tab order. Left/Right move to the previous/next tab, wrapping, and activate it (automatic activation); Home and End go to the first and last. Focus follows the new tab and the pager springs there.
14. Add buttons toggle (`aria-pressed`); the basket count bumps (scale 1.12 at 30%, 360ms) and the total updates. A drag that locked horizontal swallows the click that would follow, so swiping across a button never adds it.
15. Reduced motion: no peek; tab taps, keys and releases jump straight to the page (the pill and labels jump with them). Dragging still follows the finger 1:1.

## Tokens

```css
:root {
  /* colour */
  --ground: #f2efe6;     /* screen */
  --card: #fbf9f3;       /* hero card, pitch tag */
  --track: #e6e1d4;      /* tablist capsule */
  --ink: #1f2620;        /* text, added button, basket bar */
  --ink-2: #545b52;      /* inactive tabs, secondary text */
  --line: #dcd6c6;       /* row rules, card border */
  --edge: #7d8378;       /* outline of unfilled round buttons, 3.9:1 */
  --pill: #b8401f;       /* tab pill */
  --on-pill: #fff7ec;    /* cream labels on pill, text on ink */
  --leaf: #2f6a3c;       /* open-now dot and text */
  --leaf-halo: #d5e3d2;

  /* type */
  --display: "Wix Madefor Display", system-ui, sans-serif;
  --ui: "Anek Latin", system-ui, sans-serif;      /* variable wdth 75–125 */
  --fs-title: 32px; --fs-hero: 21px; --fs-tab: 17px; --fs-row: 16px; --fs-body: 15px; --fs-meta: 14px; --fs-tag: 12px;

  /* geometry */
  --pad-top: 60px; --pad-x: 16px; --pad-bottom: 34px;
  --tablist-h: 48px; --tablist-r: 24px; --tablist-pad: 4px;
  --tab-h: 40px; --tab-pad-x: 14px; --pill-r: 20px; --pill-thin: 8px;   /* max height loss mid-stretch */
  --hero-art: 132px; --r-hero: 22px; --swatch: 52px; --r-swatch: 16px; --btn: 40px;
  --basket-h: 60px; --page-pad-bottom: 120px;
  --space: 2px 4px 6px 8px 12px 14px 16px 18px 20px;

  /* behaviour */
  --lock-px: 8px;  --lock-ratio: 1.2;   /* horizontal lock */
  --rubber: .55;                         /* iOS-style coefficient, D = page width */
  --fling-v: .3;                         /* px per ms */
  --velocity-window: 90ms;  --pause-kills-fling: 100ms;
  --spring: 380 33;                      /* stiffness, damping (per unit mass) */
  --peek-v: -1700;                       /* px/s, once, 1100ms after load */

  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --out: cubic-bezier(.16,1,.3,1);
  --t-press: 160ms; --t-bump: 360ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Title | Wix Madefor Display | 32px | 800 | 1.02 | −0.025em | |
| Hero headline | Wix Madefor Display | 21px | 700 | 1.15 | −0.015em | |
| Prices, basket count | Wix Madefor Display | 16px | 700 | 1 | 0 | tabular numerals |
| Tab label | Anek Latin | 17px | 620 | 1 | 0.005em | width 94%, nowrap |
| Row name | Anek Latin | 16px | 640 | 1.2 | 0 | |
| Body, note | Anek Latin | 15px | 400 | 1.4 | 0 | ink-2 |
| Stall line, basket text | Anek Latin | 14px | 400 | 1.25 | 0 | |
| Open now, button labels | Anek Latin | 13–15px | 600–650 | 1 | 0.02em | |
| Pitch tag, unit | Anek Latin | 12px | 650 / 500 | 1 | 0.06em / 0 | tag uppercase |

## Implementation notes

**The stretching pill.** Measure each tab once (and on resize/fonts), then drive both edges from the fractional page:

```js
const p = -x / W, pc = Math.max(0, Math.min(N - 1, p));
const i = Math.min(N - 2, Math.floor(pc)), t = pc - i, a = geo[i], b = geo[i + 1]; // [left, width]
const lead = Math.sin(t * Math.PI / 2), trail = 1 - Math.cos(t * Math.PI / 2);
let l = a[0] + (b[0] - a[0]) * trail;
let r = a[0] + a[1] + (b[0] + b[1] - a[0] - a[1]) * lead;
const rest = a[1] + (b[1] - a[1]) * t;
const stretch = Math.max(0, r - l - rest) / (b[0] - a[0]);
const over = p - pc;                               // rubber band past the ends
if (over) { const s = Math.min(.3, Math.abs(over) * 1.4) * (r - l); over < 0 ? r -= s : l += s; }
const y = 4 + 4 * Math.min(1, stretch * 1.6);      // thinner while stretched
lit.style.clipPath = `inset(${y}px ${TW - r}px ${y}px ${l}px round 20px)`;
```

**Cream inside, ink outside.** Do not animate the pill as a separate shape under the labels; put a second copy of the labels on a tomato background above the tabs and clip it. Mid-swipe each label is then cut exactly at the pill edge instead of being a muddy half-colour:

```css
.lit { position: absolute; inset: 0; padding: 4px; display: flex; justify-content: space-between;
       background: var(--pill); color: var(--on-pill); pointer-events: none; }
.tab, .lit span { height: 40px; padding: 0 14px; font: 620 17px/1 var(--ui); font-stretch: 94%; }
.tab { color: color-mix(in oklab, var(--ink) calc(var(--w) * 100%), var(--ink-2)); }
.tab.on { color: transparent; }   /* fully under the pill: let the cream copy speak */
```

**Velocity decides, then position.** Keep 90ms of samples, ignore them if the finger paused, clamp to one page:

```js
const vel = g[0] > f[0] && e.timeStamp - g[0] < 100 ? (g[1] - f[1]) / (g[0] - f[0]) : 0;
let n = Math.abs(vel) > .3 ? (vel < 0 ? Math.ceil(p) : Math.floor(p)) : Math.round(p);
n = Math.max(idx - 1, Math.min(idx + 1, n));
spring(-n * W, vel * 1000);   // v += (380·(target − x) − 33·v)·dt, 4 substeps per frame
```

Common mistakes:

- Driving the pill from the selected index with a CSS transition; it then cannot follow the finger or stretch.
- Moving both pill edges with the same easing: the pill just slides, it never stretches.
- `touch-action: none` on the pager, which kills vertical scrolling of each page.
- Leaving off-screen pages focusable, so Tab walks into invisible content.
- Forgetting to swallow the click after a swipe, so a drag that starts on a plus adds the item.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
