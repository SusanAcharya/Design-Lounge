<!-- Design Lounge Nº 477 · "Winding ribbon scroll story" · www.designlounge.live -->

# Winding ribbon scroll story

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from mindmarket.com: the big green ribbon that swoops down behind the "No more chaos / One brief / Global, for real" cards, tying the page into one path with flat illustrated figures riding along it. This version is a "how a move works" section for a fictional international moving company, Overlook. A 96px orange road with a dashed centre line winds from the hero down through four numbered stops (Survey, Pack, Cross, Unpack). Each stop has a white card on the opposite side and a small flat illustration (boxes, a plant, a suitcase, a sofa) next to the road. The road draws itself as you scroll; ahead of it a faint dotted line shows the route still to come; a little cobalt van rides the drawn tip, turning with the curve. The detail worth copying: the path is built in JavaScript from the real positions of the cards, so the road always passes beside its card at any width, and scroll position is mapped to path length through the path's own y-coordinates, so the van stays level with the reader's eye line.

## Structure

```
1280 wide, page scrolls (≈ 3400px tall)
┌────────────────────────────────────────────────────────────┐
│ nav 72px  ⟋ Overlook                    [Get a moving quote]│
├────────────────────────────────────────────────────────────┤
│ hero 440px, centred                                        │
│        door to door, 38 countries  (Caveat 28, −3°)        │
│             One crew.                                       │
│          One long road.    (104px / 800)                   │
│      International home moves run by … (17px, 440 wide)    │
├────────────────────────────── story (position: relative) ──┤
│                         ██ road start, x 50%, y 40          │
│  ┌ card 420 ─────┐          ██                              │
│  │ Day 1         │            ██ (1) pin at 70%   [boxes]   │ row 560
│  │ Survey        │          ██                              │
│  └───────────────┘      ██                                  │
│        [plant]   (2) ██                ┌ card 420 ──────┐   │ row 560
│                       ██               │ Day 9  Pack    │   │
│   … rows 3 and 4 alternate …                               │
│                         ██ end cap                          │
│                keys in hand / Home, again. / [quote]        │
└────────────────────────────────────────────────────────────┘
SVG overlay: absolute, inset 0, viewBox = story's pixel box.
```

- `header.nav`: fixed, brand link and a dark pill CTA.
- `section.hero` with the only `h1`.
- `section.story` labelled "How a move works": an `svg.route` (`aria-hidden`) holding the mask, the dotted guide, the masked road group and the van group; four `div.row` each holding an `article.card` with `h2`; four `svg.deco` illustrations; pins injected as `button.pin`; and a closing `div.end`.
- Card: `p.day` (handwritten), `h2`, `p`, `div.meta` with two facts.

## Motion

| Thing | Trigger | Property | From → To | Timing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Road draw | scroll | mask stroke-dasharray | 28 → total | scroll-linked | same (user-driven) |
| Van | scroll | translate + rotate along path | tip of road | scroll-linked | same |
| Card reveal | eye line within 260px of anchor | opacity, translateY | 0, 32px → 1, 0 | 500ms / 600ms `--expo` | appears instantly |
| Illustration pop | eye line within 200px | scale, translateY, opacity | 0.6, 16px, 0 → 1, 0, 1 | 700ms `--expo` | instant |
| Pin reached | van passes pin | background | `--card` → `--sun` | 240ms `--ease` | instant |
| Pin hover | hover | scale | 1 → 1.08 | 240ms `--expo` | none |
| Pin click | click | window scroll | — | smooth | `behavior: auto` |
| End CTA hover | hover | translateY | 0 → −2px | 180ms `--expo` | none |

Run all scroll work inside one requestAnimationFrame per burst. Never put a CSS transition on the van or the mask; it must track scroll exactly.

## States

- Pin upcoming: white fill, 3px ink ring, ink number.
- Pin reached: sun yellow fill. Only the van's position decides this, not the click.
- Pin hover: scale 1.08. Focus-visible: 3px cobalt ring, 3px offset.
- Card hidden: opacity 0, 32px down. Card shown: opacity 1, resting tilt.
- Nav CTA hover: ink → cobalt.
- Road before scrolling: a 28px stub with the van, never an empty gap.
- Loading: the path is rebuilt again after `document.fonts.ready`, because the card heights change when the fonts swap.

## Accessibility

- The SVG route is decorative (`aria-hidden="true"`). The story is fully readable as four `article`s in order.
- The section has `aria-label="How a move works"`. Each card's heading is an `h2` under the hero `h1`.
- Pins are `button`s with `aria-label="Go to stop 3: Cross"`. They are in DOM order after the cards; tabbing reaches them in stop order.
- A polite live region announces each newly reached stop.
- Illustrations are `aria-hidden`.
- Contrast: `#4a5a53` on `#fffdf8` is about 7:1; `#1d2b26` on `#f05a28` (end CTA) is about 4.3:1, so that label is set at 19px/800 to count as large text; white text is never placed on the orange.
- Pin hit target is 48×48.

## Responsive rules

- ≥1280: as specified. Rows 560px, padding 8% each side, cards 420px.
- 1024: same layout; anchors stay at 30% / 70% of the story width, so the road tightens its swings by itself.
- <900: the road moves to a 36px lane down the left edge. Anchors alternate between x 34 and x 46 so it still wiggles slightly. Rows become auto height with padding `48px 16px 48px 76px`; cards fill the width; card h2 34px; illustrations hidden; the van scales to 0.6; hero h1 54px; closing h2 48px.
- <640: same as <900. Confirm no horizontal scroll at 375px.
- Rebuild the path on every resize. Never hard-code the `d` attribute.

## Acceptance checklist

### Always

- [ ] The path's `d` is generated from the measured row positions and regenerated on resize and after fonts load.
- [ ] Every segment uses vertical control handles, so y increases monotonically along the path.
- [ ] Scroll maps to length through the path's own y values, not a linear scroll fraction.
- [ ] The drawn portion is revealed by a mask, and the dashed centre line is inside the same masked group.
- [ ] A faint dotted guide shows the route ahead of the drawn road.
- [ ] The rider follows the tangent and is mirrored past ±90° so it never turns upside down.
- [ ] Each stop has a button pin that scrolls to it and fills when reached.
- [ ] Cards alternate sides and the road passes on the opposite side of each card.
- [ ] Scrolling up reverses everything.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Road 96px `#f05a28`, centre dashes 4px `#fff3e6` at 18/22.
- [ ] Hero "One crew. / One long road." at 104px Bricolage 800.
- [ ] Stops: Day 1 Survey, Day 9 Pack, Day 12 Cross, Day 31 Unpack.
- [ ] Eye line at 72% of the viewport height.
- [ ] Van is cobalt `#2f4bd8`, 68×42.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame (scrollY 0): a 72px nav, a centred hero ("One crew. / One long road." at 104px with a handwritten "door to door, 38 countries" tilted −3° above), then the start of the road: about 120px of orange ribbon under the hero with the van on it, a dotted guide running on to a hollow pin "1", the Day 1 Survey card on the left, and a stack of kraft boxes to the right of the pin.
2. The route: start at the story's horizontal centre, 40px from its top. Stop anchors are at the vertical centre of each 560px row, at 70% of the width when the card is on the left and 30% when it is on the right. The end anchor is at the centre, 16px into the closing block.
3. Between anchors, each segment is a cubic Bézier with vertical control handles of 55% of the segment's height. This makes y strictly increase along the path, which the scroll mapping depends on.
4. On scroll, the eye line is `scrollY + 0.72 × innerHeight`. The drawn length is the path length whose y equals the eye line, found by binary search over samples taken every 6px of length. Minimum drawn length is 28px.
5. The drawn road is revealed by a mask: a white stroke 8px wider than the road, with `stroke-dasharray: <drawn> <total + 200>`. The road and the centre dashes both sit inside the masked group.
6. The undrawn route is a 3px dotted line (`stroke-dasharray: 1 12`, round caps) in ink at 28% opacity, always visible.
7. The van sits at the drawn tip, rotated to the tangent (angle from the point at `len` to `len + 2`). When the angle passes ±90°, it is mirrored vertically so it never drives upside down.
8. A stop's pin turns from white to sun yellow when the van's y reaches the pin. A polite live region says "Stop 2 of 4: Pack".
9. A card fades and rises into place when the eye line is within 260px above its anchor: opacity 0 → 1, translateY 32px → 0 while keeping its resting tilt (−1.2° left, 1° right). The illustration pops from scale 0.6 when the eye line is within 200px.
10. Pins are buttons. Clicking pin n scrolls so the van lands just past that pin.
11. Scrolling back up undraws the road and hides cards again. Everything is reversible.
12. The road ends in a round cap above "keys in hand / Home, again." and an orange Get a moving quote pill.

## Tokens

```css
:root {
  /* colour */
  --bg: #e4efe6;        /* mint paper */
  --card: #fffdf8;      /* cards, pin fill */
  --ink: #1d2b26;       /* text, pin ring, guide line */
  --ink-2: #4a5a53;     /* body copy */
  --line: #c6d6ca;      /* card border, rules, nav rule */
  --road: #f05a28;      /* ribbon, handwritten notes, end CTA */
  --road-mark: #fff3e6; /* centre dashes */
  --cobalt: #2f4bd8;    /* van, focus ring, nav CTA hover */
  --sun: #ffc93c;       /* reached pin, sofa */
  --kraft: #d9a066;     /* boxes */
  --leaf: #3e9b5f;      /* plant */

  /* type */
  --display: "Bricolage Grotesque", system-ui, sans-serif;
  --hand: "Caveat", cursive;

  /* shape */
  --road-w: 96px;
  --r-card: 24px;
  --row-h: 560px;
  --card-w: 420px;
  --pin: 48px;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Hero h1 | Bricolage Grotesque, opsz 96 | 104px | 800 | 0.92 | −0.045em |
| Closing h2 | Bricolage Grotesque | 88px | 800 | 0.95 | −0.045em |
| Card h2 | Bricolage Grotesque | 44px | 800 | 1 | −0.035em |
| Body | Bricolage Grotesque | 17px | 400 | 1.5 | 0 |
| Card meta | Bricolage Grotesque | 14px | 600 | 1.5 | 0 |
| End CTA label | Bricolage Grotesque | 19px | 800 | 1 | 0 |
| Nav CTA label | Bricolage Grotesque | 15px | 600 | 1 | 0 |
| Pin number | Bricolage Grotesque | 18px | 800 | 1 | 0 |
| Brand | Bricolage Grotesque | 22px | 800 | 1 | −0.03em |
| Handwritten notes | Caveat | 26–28px | 600 | 1 | 0, in `--road` |

Handwriting is only for the small day labels and the two hero/closing notes. Never set a heading in Caveat.

## Implementation notes

1. Build the path from anchors. Vertical handles make each segment an S-curve whose y never goes backwards:

```js
let d = `M${a[0].x} ${a[0].y}`;
for (let i = 1; i < a.length; i++) {
  const p = a[i - 1], q = a[i], k = (q.y - p.y) * 0.55;
  d += ` C${p.x} ${p.y + k} ${q.x} ${q.y - k} ${q.x} ${q.y}`;
}
[guide, road, mark, maskPath].forEach(el => el.setAttribute('d', d));
total = road.getTotalLength();
samples = [];
for (let l = 0; l <= total; l += 6) samples.push([l, road.getPointAtLength(l).y]);
```

2. Map the eye line to a length with a binary search, then interpolate:

```js
function lengthAtY(y) {
  if (y <= 0) return 0;
  let lo = 0, hi = samples.length - 1;
  if (y >= samples[hi][1]) return total;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; samples[m][1] < y ? lo = m : hi = m; }
  const [l0, y0] = samples[lo], [l1, y1] = samples[hi];
  return l0 + (l1 - l0) * ((y - y0) / ((y1 - y0) || 1));
}
```

3. Draw with a mask, not by dashing the road itself. Dashing the road would fight the centre line's own dasharray:

```html
<defs><mask id="drawn" maskUnits="userSpaceOnUse"><path class="mask-path" id="maskPath"/></mask></defs>
<path class="guide"/>
<g mask="url(#drawn)"><path class="road"/><path class="mark"/></g>
```

```css
.mask-path { fill: none; stroke: #fff; stroke-width: calc(var(--road-w) + 8px); stroke-linecap: round; }
```

```js
maskPath.style.strokeDasharray = `${len} ${total + 200}`;
```

Common mistakes:

- Mapping scroll fraction straight to path length. On the long horizontal swings the van then races ahead of the reader and lags on the straights.
- Drawing the road with a fixed viewBox and `preserveAspectRatio`. At other widths it no longer passes beside the cards and the stroke width scales.
- Letting the van flip upside down on leftward segments.
- Putting the road above the cards. The SVG is under the cards (`z-index` 1 vs 2) and pins sit above both.
- Measuring before the fonts load. Card heights change, the anchors drift, and the road cuts through a card.
- Using a CSS transition on the van to "smooth" it. It lags behind the road tip.

Where it sits:

1. It is the "how it works" or "why us" middle of a landing page, between the hero and a CTA band. It is not a hero by itself.
2. Three to six stops. Fewer and the road has nothing to wind between; more and the page becomes a scroll chore.
3. The rider is a small flat object that fits the product (a van for moving, a paper plane for travel, a parcel for delivery). Keep it under 72px long.
4. The illustrations are flat shapes in the page palette, no outlines, no gradients. One per stop, on the road's open side.
5. If the page already has a pinned section, do not put this right after it. Two scroll-driven sections back to back feel like the page is fighting the reader.

Rebuild order:

1. Lay out the hero, four rows and the closing block in normal flow, with cards alternating sides.
2. Add the absolute SVG overlay and size its viewBox to the story box.
3. Compute anchors from the rows and draw the full path as the dotted guide.
4. Add the road and centre line inside a masked group; drive the mask from a fixed length to check it.
5. Add the y-sampled length lookup and wire it to scroll.
6. Add the van with tangent rotation and the vertical mirror.
7. Inject the pins, then the card and illustration reveals.
8. Rebuild on resize and after fonts load. Check 375px.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
