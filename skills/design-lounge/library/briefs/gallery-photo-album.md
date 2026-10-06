<!-- Design Lounge Nº 355 · "Photo album with page turns" · www.designlounge.live -->

# Photo album with page turns

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A family photo album from summer 1986, open on a bottle-green felt table. The album has a brown leather cover and black paper pages. Prints have a 7px cream border, sit at small angles, and are held by four cream photo corners. Captions are handwritten in white gel pen (Caveat). The leaves turn over the spine in real 3D: each leaf is a two-faced card that rotates −180° around its left edge. The detail worth copying is the photo corner: one pseudo-element with four diagonal gradients, so any print gets corners without extra markup.

Every photo is an illustrated SVG scene (canoe on a dock, cabin under pines, birthday cake, station wagon, dog, rope swing, campfire, watermelon picnic, fireflies in a jar). No image files.

## Structure

```
1280 × 800, column flex
┌───────────────────────────────────────────────────────────────┐
│ ALBUM NO. 3 · SUMMER 1986                                     │ header max 1040, padding 26 24 0
│ Kettle Pond (Lora italic 30)                 Pages 2–3 of 8   │
│  ┌ cover, inset −12 −14, leather ──────────────────────────┐  │
│  │┌ left page 480×600 ─────────┐┌ right page 480×600 ──────┐│  │
│  ││  [print −3°]   note+arrow  ││   [print 2°, 320 wide]   ││  │ book 960×600
│  ││  caption                   ││   caption + small line   ││  │ scaled by --s
│  ││        [print 2°]          ││     [print −3.5°]        ││  │
│  ││        caption       2     ││     caption        3     ││  │
│  │└────────────────────────────┘└──────────────────────────┘│  │
│  └───────────────────────────── ribbon ───────────────────────┘
│                (‹)   ← → turn the page   (›)                  │ nav, padding 34 0 20
└───────────────────────────────────────────────────────────────┘
```

- `header`: kicker `p`, the only `h1`, and a counter `p` with `aria-live="polite"`.
- `.fit` reserves `960×600 × --s` of layout; `.book` inside is 960×600 with `transform: scale(var(--s))`, origin top left, `perspective: 2400px`.
- Two static `.page`s: left inside cover, right inside back cover.
- Four `.leaf` elements stacked on the right half (`left:480px`), each with `section.face.front` (odd page) and `section.face.back` (even page, pre-rotated 180°).
- Each photo is a `figure.ph` with a `.print` holding the SVG, and a `figcaption`. Optional `.note` handwritten asides with a drawn arrow.
- Two transparent `button.hit` areas over the left and right page (`tabindex="-1"`, the visible buttons are the keyboard path).
- `nav.controls` labelled "Album pages" with Previous and Next icon buttons.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Leaf turn forward | next | transform | `rotateY(0)` → `rotateY(-180deg)` | 900ms | `--sheet` | 1ms |
| Leaf turn back | prev | transform | `rotateY(-180deg)` → `rotateY(0)` | 900ms | `--sheet` | 1ms |
| Leaf shade | during turn | opacity | 0 → 1 (50%) → 0 | 900ms | `--sheet` | none |
| Turning z-index | turn start/end | z-index | 100+n while moving, stack value after | instant | — | same |
| Buttons | hover | background, border | `#00000026` → `#efe8d814` | 160ms | `--ease` | none |

## States

- Hit areas: pointer cursor. Disabled at the ends (`default` cursor, no click).
- Buttons: resting `1px #efe8d833` border, 44px circle. Hover lightens. Disabled at 35% opacity.
- Focus-visible: 2px `--ribbon` outline, offset 3px.
- Faces not in the open spread are `aria-hidden="true"`.
- No loading, empty or error state; the album always has 8 pages.

## Accessibility

- `.book` has `aria-roledescription="photo album"` and a label; each face is a `section` labelled "Page N".
- Photos are `figure` + `figcaption`; the caption is the accessible text. SVGs are decorative.
- ← and → are global shortcuts; Previous/Next buttons are reachable by Tab, 44px.
- The counter is `aria-live="polite"` and announces the new pages at the start of each turn.
- Hidden faces are `aria-hidden` so the reader only hears the open spread.
- Contrast: `#efe8d8` on `#1c1c1a` ≈ 14:1. `#b9b19f` ≈ 8:1. `#8a8578` page numbers ≈ 4.6:1.

## Responsive rules

- ≥1280: scale 1 at 800 high.
- The book scales as a unit: `--s = min(1, (innerWidth − 48) / 988, (innerHeight − 214) / 624)`, floor 0.3. The `.fit` box reserves the scaled size so nothing overlaps.
- 1024 and 768: same spread, scaled down.
- <640: the spread still shows at about 0.33. In a product, switch to one page at a time below 640 (each face full width, the turn becomes a horizontal slide) rather than going smaller.
- Never let the book cause a horizontal scrollbar.

## Acceptance checklist

### Always

- [ ] Each leaf is one element with two backface-hidden faces; the back face is pre-rotated 180°.
- [ ] The turn rotates around the spine (`transform-origin: 0 50%`), with perspective on the parent.
- [ ] A turning leaf is on top for the whole turn and the stack is correct afterwards.
- [ ] ← / → keys, the buttons, and clicking a page all turn pages.
- [ ] Previous is disabled on the first spread and Next on the last.
- [ ] Every print has four photo corners from a single pseudo-element.
- [ ] Captions are handwritten and sit under their print, never over another print or the page number.
- [ ] Reduced motion makes the turn instant.
- [ ] No image URLs; pictures are inline SVG.

### This demo

- [ ] Opens on pages 2–3: "Nell turns 7!" and "Watermelon contest" left, "The Wagon. 212,000 miles" and "Biscuit, refusing to swim" right.
- [ ] Four leaves, eight pages, plus title page and end page.
- [ ] Kicker "Album no. 3 · Summer 1986", title "Kettle Pond".
- [ ] Turn is 900ms on `cubic-bezier(.32,.72,0,1)`.
- [ ] Corners `#d3c8b0`, 26px; print border 7px `#f2ecdf`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the album is open at pages 2–3 (the first leaf is already turned). Header counter reads "Pages 2–3 of 8".
2. Pressing → (anywhere), the Next button, or clicking anywhere on the right page turns the top right leaf over to the left in 900ms. The counter updates as the turn starts.
3. Pressing ←, the Previous button, or clicking the left page turns the top left leaf back.
4. A shade gradient sweeps across the turning leaf: opacity 0 → 1 at the midpoint → 0.
5. Turns can be queued quickly; each turning leaf goes on top while it moves (z-index 100+), then settles into the stack.
6. At the start (title page and page 1) Previous is disabled; at the end (page 8 and the end page) Next is disabled. The page clicks follow the same rule.
7. The left inside cover is a title page: "Kettle Pond", a rule, "Cabin 4 · July 19 – August 24, 1986", "The Okafor-Lindqvist family". The right inside back cover reads "Same time next year."
8. Reduced motion: the turn is instant (1ms) and the shade does not animate.

## Tokens

```css
:root {
  --bg: #26332b;        /* felt table */
  --bg-2: #1e2922;      /* table edge */
  --cover: #5a2f24;     /* leather */
  --page: #1c1c1a;      /* black album paper */
  --ink: #efe8d8;       /* white gel pen, primary text */
  --ink-2: #b9b19f;     /* second caption line, notes */
  --ink-3: #8a8578;     /* page numbers, hint */
  --corner: #d3c8b0;    /* photo corners */
  --print: #f2ecdf;     /* print border */
  --ribbon: #c8962f;    /* bookmark, focus */
  --hand: "Caveat", cursive;
  --serif: "Lora", Georgia, serif;
  --turn: 900ms;
  --sheet: cubic-bezier(.32,.72,0,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --page-w: 480px;
  --page-h: 600px;
  --corner-size: 26px;
}
```

- Table: `radial-gradient(90% 70% at 50% 45%, #2e3d33, #26332b 55%, #1e2922)`.
- Cover: horizontal gradient `#4c271e → #5a2f24 8% … #3a1d16 50% (spine) … #5a2f24 92% → #4c271e`, radius 6px, shadow `0 30px 60px -20px #000c, 0 4px 10px #0006`.
- Paper grain: two dot grids (`#ffffff06` at 5px, `#00000030` at 7px offset 2px 3px).
- Gutter: 40px gradient from `#000a` at the spine edge of each page.
- Print shadow: `0 2px 3px #0009, 0 8px 16px -6px #0008`. Photos get `sepia(.22) saturate(.86) contrast(.96)` to read as 1980s prints.

## Typography

| Role | Family | Size / line | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Kicker | Lora | 12px | 400 | 0.16em, upper | `--ink-2` |
| Title h1 | Lora italic | 30px / 1.1 | 500 | 0 | `--ink` |
| Counter | Lora | 14px | 400 | 0 | `--ink-2` |
| Caption | Caveat | 25px / 1.05 | 500 | 0 | `--ink` |
| Caption second line | Caveat | 19px | 500 | 0 | `--ink-2` |
| Note | Caveat | 22px / 1.1 | 500 | 0 | `--ink-2` |
| Title page | Caveat | 58px / 1 | 600 | 0 | `--ink` |
| Page number | Lora | 12px | 400 | 0.1em | `--ink-3` |

Captions counter-rotate at −1.4× the print angle, so the handwriting is not parallel to the print.

## Implementation notes

**The leaf.** Faces are absolutely stacked; only the leaf rotates.

```css
.book { perspective: 2400px; }
.leaf { position: absolute; left: 480px; width: 480px; height: 600px;
  transform-style: preserve-3d; transform-origin: 0 50%;
  transition: transform var(--turn) var(--sheet); }
.leaf.turned { transform: rotateY(-180deg); }
.face { position: absolute; inset: 0; backface-visibility: hidden; }
.face.back { transform: rotateY(180deg); }
```

**Z-order.** Unturned leaves stack first-on-top; turned leaves stack last-on-top. While turning, lift the leaf above both.

```js
function z() {
  leaves.forEach((l, i) => {
    if (!l.classList.contains('flipping')) l.style.zIndex = i < spread ? i + 1 : N * 2 - i;
  });
}
function go(d) {
  const t = spread + d; if (t < 0 || t > N) return;
  const leaf = leaves[d > 0 ? spread : spread - 1];
  spread = t;
  leaf.classList.add('flipping'); leaf.style.zIndex = 100 + (++busy);
  leaf.classList.toggle('turned', d > 0);
  setTimeout(() => { leaf.classList.remove('flipping'); busy--; z(); }, 920);
}
```

**Photo corners.** One pseudo-element, inset −6px, four triangles.

```css
.print::after { content: ""; position: absolute; inset: -6px; --c: var(--corner);
  background:
    linear-gradient(135deg, var(--c) 0 50%, #0000 50%) top left / 26px 26px no-repeat,
    linear-gradient(225deg, var(--c) 0 50%, #0000 50%) top right / 26px 26px no-repeat,
    linear-gradient(45deg,  var(--c) 0 50%, #0000 50%) bottom left / 26px 26px no-repeat,
    linear-gradient(315deg, var(--c) 0 50%, #0000 50%) bottom right / 26px 26px no-repeat;
  filter: drop-shadow(0 1px 1px #0007); }
```

Common mistakes:

- Applying the initial "turned" class from JS after first paint, so the album plays a turn on load. Put it in the markup.
- Swapping z-index at the end of the turn only; the leaf slides under its neighbour halfway through.
- `overflow:hidden` on the leaf; it flattens `preserve-3d`. Put it on the faces.
- Rotating the captions with the print. They are written on the page, not on the photo.
- White album pages. This album is black paper; the white pen only works on black.
- Scaling the book with `width` percentages; scale the whole 960×600 unit so the 3D maths stays in pixels.

Rebuild order:

1. Table, header, cover and two static pages.
2. One leaf with two faces; get the turn right.
3. Prints, corners, captions, notes on all eight faces.
4. Stack order, queueing, end-of-album limits.
5. Keyboard, counter, aria-hidden faces.
6. Scale to fit.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
