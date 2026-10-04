<!-- Design Lounge Nº 348 · "Phone product page" · designlounge.vercel.app -->

# Phone product page

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This page is paper and retro. It is not glass.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The product page of a small pottery shop, Okra Studio, on a phone. The product is a stoneware cup called Tumbler No. 4. The top 404px is a swipeable gallery of three plates. The art is drawn in CSS, not photos. Under it sit the name, the price, the rating, four glaze swatches, four size chips, and a three-part accordion. A bar stays fixed at the bottom with the total and a big clay button, Add to bag.

The look is warm clay on cream. Every box has a 2px ink border, a 2px radius and a hard offset shadow, like a printed shop card. Type is a wide, heavy grotesk with a serif italic for the soft lines.

The detail worth copying is the glaze swatch. Picking a glaze recolours the drawn cup over 420ms, because the colour is one registered custom property that the gradients read. The second detail is Add to bag. A small dot flies from the button to the bag icon, then the badge count goes up and bumps.

## Structure

```
390 x 844
+--------------------------------------+
| gallery 404px, stage #E7D3B6         |
| [<]                      [heart][bag2]|  buttons top 58px, 44x44
|                                      |
|             ( cup art )              |  slide padding-top 54px
|  ----- shelf lines, 38% ------------ |
| PLATE 1 front              [= o o]   |  tag left 20px, dots right 20px
+==2px ink rule========================+
| OKRA STUDIO · STONEWARE        11px  |
| Tumbler No. 4                  36px  |
| thrown by hand, fired twice... 21px  |
| $38               * 4.8 · 212 reviews|
| ------------------ 1px line -------- |
| GLAZE Kiln red                       |
| [##][##][##][##]   44px swatches     |
| SIZE 260 ml                          |
| [180 ml][260 ml][-340 ml-][420 ml]   |  44px, 340 struck
| 340 ml is sold out...         12px   |
|==2px ink=============================|
| DETAILS                         x    |  52px rows
|   Wheel-thrown stoneware...          |
| CARE                            +    |
| SHIPPING                        +    |
|                                      |
+--------------------------------------+
| TOTAL  $38   [ + Add to bag ]  56px  |  fixed bar, 2px top rule
|            34px home clearance       |
+--------------------------------------+
```

- The page is a `main` that scrolls. Padding-bottom is 84px plus the 34px home clearance.
- The gallery is a `section` labelled "Product photos". The track is a horizontal scroll-snap row with three `div role="group"` slides. Each slide has an `aria-label`: "Front view", "Top view", "Two sizes side by side".
- The back, heart and bag controls are `button`s in an overlay row. The overlay has `pointer-events: none` so swipes pass through. The buttons turn pointer events back on.
- The dots are three `button`s with `aria-label="Photo n of 3"` and `aria-current`.
- The name is the only `h1`. Eyebrow and subline are `p`.
- Glaze and Size are each a `fieldset` with a `legend`. The options are real radio inputs, visually hidden, with styled `label`s after them.
- The accordion uses `h2 > button[aria-expanded][aria-controls]` and a `div role="region"` panel.
- The bar is a `div` fixed to the bottom. It holds the total and the Add to bag `button`.
- A visually hidden `p aria-live="polite"` announces the add.

## Motion

| Thing | Trigger | Property | From to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Gallery | swipe or dot | scroll position | snap per plate | native or smooth | browser | instant scroll |
| Dot | plate change | width, fill | 8px empty to 20px ink | 240ms | `--ease` | instant |
| Cup glaze | swatch change | `--glaze` | old to new colour | 420ms | `--ease` | instant |
| Swatch ring | select | border-color | transparent to ink | 160ms | `--ease` | instant |
| Size chip | select | background, colour | surface to ink | 160ms | `--ease` | instant |
| Accordion | header tap | grid-template-rows | 0fr to 1fr | 280ms | `--ease` | instant |
| Plus icon | header tap | rotate | 0 to 45deg | 240ms | `--ease` | instant |
| Add button press | pointer down | translate, shadow | 0 to 4px, 4px shadow to 0 | 120ms | `--ease` | instant |
| Add button state | click | background | clay to ink, back after 1400ms | 200ms | `--ease` | instant |
| Flying dot | click | transform | button centre to bag centre via 45% waypoint, scale 1 to 1.4 to 0.5 | 640ms | `--ease` | no dot, badge updates at once |
| Badge | dot lands | scale | 1 to 1.35 to 1 | 360ms | `--expo` | instant |

Nothing loops. The only motion at rest is none.

## States

- Icon button resting: surface fill, 2px ink border, 2px ink shadow down right.
- Icon button active: moves 2px down right, shadow goes to none. It looks pressed into the page.
- Heart pressed: icon fill and stroke become `--clay`.
- Swatch selected: 2px ink ring around the 30px colour square, inside a 44px target.
- Chip selected: ink fill, surface text.
- Chip disabled (sold out): dashed `--ink-3` border, `--ink-3` text, transparent fill, `text-decoration: line-through`, `cursor: not-allowed`.
- Accordion open: plus turned 45deg, panel visible. Closed panels get `hidden` after the close animation.
- Add to bag resting: clay fill, cream text, plus icon, 4px ink shadow.
- Add to bag pressed: shadow 0, moved 4px.
- Added: ink fill, tick icon, label "Added", for 1400ms. Further taps ignored.
- Focus-visible: 2px ink outline, offset 2px, on every control. For radios the ring goes on the label next to the focused input.
- Empty, error, loading: not on this frame. A failed add uses `mobile-load-failed` copy in the live region and keeps the button clay.

## Accessibility

- Name: the product name is the `h1`.
- Gallery track has `tabindex="0"` and an `aria-label`, so keyboard users can scroll it with arrow keys.
- Dots are buttons. Current dot has `aria-current="true"`, the others `"false"`.
- Back is labelled "Back to Cups". Heart is a toggle with `aria-pressed`. Bag is labelled "Bag, 2 items" and the label updates with the count. The visual badge is `aria-hidden`.
- Glaze and size are native radio groups inside fieldsets. Arrow keys move between options. The sold-out radio is `disabled` and has `aria-describedby` pointing to the sold-out note.
- Each swatch label holds a visually hidden name, so screen readers say "Kiln red" not "radio button".
- Accordion buttons have `aria-expanded` and `aria-controls`. Panels have `role="region"` and `aria-labelledby`.
- Add to bag announces through a polite live region.
- Hit targets: icon buttons 44x44, swatches 44x44, chips 44px tall and at least 72px wide, dots 24x44, accordion rows 52px, Add to bag 56px.
- Contrast: `#2a1e16` on `#fbf5ea` is above 14:1. `#fff6ec` on `#b5532f` is about 4.6:1 at 16px 800. `#7a6553` on `#f3e9d8` is about 4.7:1.
- Colour is not the only signal for sold out. The text is struck through and the note says it in words.

## Responsive rules

- Frame is 390x844. The gallery is 404px tall including the 54px top clearance. The bar has 34px of home clearance.
- At 360 wide: chips wrap to a second row if needed. Gap stays 8px. The name may wrap to two lines. Keep it 36px.
- At 430 wide: the gallery stays 404px tall. Slides stay 100% wide.
- Short phones (700px tall): keep the gallery at 404px. The page scrolls. Do not shrink the art.
- Tablet: do not stretch this. Put the gallery left and the info right in two columns, and move Add to bag into the info column. That is a different layout, not this piece.
- Do not draw a status bar or a home indicator. The padding is the clearance.

## Acceptance checklist

### Always

- [ ] One swipeable gallery with scroll-snap and one dot per slide. Dots are buttons with `aria-current`.
- [ ] Back, save and bag sit over the gallery as 44px bordered squares. Swipes still pass through the overlay row.
- [ ] Colour options are a native radio group. Choosing one recolours the art through one custom property.
- [ ] Size options are a native radio group. One option is disabled, struck through and explained in text.
- [ ] Accordion headers are buttons with `aria-expanded`. Panels animate grid rows, not `height: auto`.
- [ ] A fixed bottom bar holds the total and the primary button, with 34px home clearance.
- [ ] Add to bag gives feedback twice: the button state and the bag badge count.
- [ ] Every box is 2px radius with a 2px ink border. No blur, no glass, no soft drop shadows.
- [ ] Reduced motion removes the flying dot and all transitions but keeps every state change.

### This demo

- [ ] Shop is Okra Studio. Product is Tumbler No. 4 at $38 for 260 ml.
- [ ] Glazes are Kiln red `#b5532f`, Oat ash `#cdbb98`, Moss `#5e6b47`, Iron blue `#34465a`.
- [ ] Sizes are 180 ml $32, 260 ml $38, 340 ml sold out, 420 ml $46.
- [ ] Rating reads "4.8 · 212 reviews".
- [ ] Bag badge starts at 2 and reads 3 after one add.
- [ ] Button shows "Added" for 1400ms.
- [ ] Panels are Details (open), Care, Shipping.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: plate 1 (front view) is showing. Dot 1 is current. Glaze is Kiln red. Size is 260 ml. Price and total read $38. The bag badge reads 2. Details is open. Care and Shipping are closed.
2. Swipe the gallery left or right. It snaps one plate at a time. The current dot widens from 8px to 20px and fills with ink over 240ms.
3. Tap a dot. The gallery scrolls to that plate. Smooth scroll, or instant under reduced motion.
4. Tap the heart. It fills clay. `aria-pressed` becomes true and the label becomes "Saved to wishlist". Tap again to undo.
5. Tap a glaze swatch. The selected swatch gets a 2px ink ring. The legend text changes to the glaze name. All cups in the gallery recolour over 420ms. The small cup on plate 3 keeps its own Moss glaze.
6. Tap a size chip. It fills ink with cream text. The legend shows the size. Price and total change: 180 ml $32, 260 ml $38, 420 ml $46.
7. The 340 ml chip is sold out. It has a dashed muted border and struck-through text. It cannot be chosen. A note under the chips says "340 ml is sold out. Next firing 14 October."
8. Tap an accordion header. The panel opens by animating its row from 0fr to 1fr over 280ms. The plus icon turns 45 degrees into an x. More than one panel can be open.
9. Tap Add to bag. The button turns ink, its icon becomes a tick and its label becomes "Added". A 14px dot in the current glaze flies from the button centre to the bag icon in 640ms on a curved path. When it lands, the badge goes from 2 to 3 and scales to 1.35 and back over 360ms.
10. After 1400ms the button goes back to clay, plus icon, "Add to bag". Taps during that time do nothing.
11. A polite live region says "Added Tumbler No. 4, Kiln red, 260 ml to your bag."
12. The page scrolls under the fixed bar. The last accordion row stays reachable above it.

## Tokens

```css
@property --glaze { syntax: '<color>'; inherits: true; initial-value: #b5532f; }

:root {
  /* colour */
  --bg: #f3e9d8;        /* page cream */
  --surface: #fbf5ea;   /* bar, buttons, chips */
  --stage: #e7d3b6;     /* gallery backdrop */
  --ink: #2a1e16;       /* text, borders, shadows */
  --ink-2: #5a4637;     /* secondary text */
  --ink-3: #7a6553;     /* muted, sold out */
  --line: #d8c6aa;      /* hairlines */
  --clay: #b5532f;      /* primary button, heart, badge */
  --clay-ink: #fff6ec;  /* text on clay */
  --raw: #dcb994;       /* unglazed foot of the cup */
  --glaze: #b5532f;     /* current glaze, drives the art */

  /* type */
  --grot: "Archivo", system-ui, sans-serif;
  --serif: "Instrument Serif", Georgia, serif;

  /* shape */
  --r: 2px;
  --border: 2px solid var(--ink);
  --shadow-sm: 2px 2px 0 var(--ink);
  --shadow-lg: 4px 4px 0 var(--ink);

  /* space: 4px base. Used: 4 6 8 12 16 20 22 */
  --pad: 20px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --micro: 160ms;
  --layout: 280ms;
  --recolour: 420ms;
  --flight: 640ms;
}
```

The font link loads Archivo with the width axis (100 to 125) and weights 500 to 800, and Instrument Serif italic only.

## Typography

| Role | Family | Size | Weight | Width | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Eyebrow | Archivo | 11px | 700 | 100% | 0.14em | upper |
| Product name | Archivo | 36px / 1 | 800 | 118% | -0.02em | sentence |
| Subline | Instrument Serif italic | 21px / 1.2 | 400 | | 0 | lower |
| Price | Archivo | 26px | 800 | 110% | 0, tabular | |
| Rating | Archivo | 13px | 600 | 100% | 0 | |
| Legend | Archivo | 12px | 700 | 100% | 0.10em | upper |
| Legend value | Instrument Serif italic | 17px | 400 | | 0 | as written |
| Chip | Archivo | 14px | 700 | 100% | 0, tabular | |
| Accordion header | Archivo | 14px | 700 | 100% | 0.08em | upper |
| Body | Archivo | 14px / 1.45 | 400 | 100% | 0 | max 34ch |
| Plate tag | Archivo 11px 700 upper, then serif italic 15px | | | | 0.12em | |
| Bar total | Archivo | 22px | 800 | 110% | tabular | |
| Button | Archivo | 16px | 800 | 112% | 0.02em | sentence |

The serif italic is only for soft lines: the subline, legend values, plate captions. Never set a price or a button in the serif.

## Implementation notes

The recolour only animates if the colour is a registered property. Plain custom properties inside gradients jump. Register it and transition it on every element that paints with it:

```css
@property --glaze { syntax: '<color>'; inherits: true; initial-value: #b5532f; }

.cup {
  width: 146px; height: 166px;
  border-radius: 4px 4px 34px 34px / 4px 4px 20px 20px;
  background:
    linear-gradient(90deg, rgba(42,30,22,.22), transparent 26%,
      rgba(255,246,236,.22) 40%, transparent 56%, rgba(42,30,22,.28)),
    linear-gradient(var(--glaze) 0 70%, var(--raw) 70%);
  transition: --glaze 420ms var(--ease);
}
/* glaze drips over the raw foot */
.cup::after {
  content: ""; position: absolute; left: 4px; right: 4px; top: calc(70% - 2px); height: 16px;
  background: radial-gradient(circle at 9px 0, var(--glaze) 6px, transparent 6.5px) 0 0 / 23px 16px repeat-x;
  transition: --glaze 420ms var(--ease);
}
```

Set `--glaze` on the gallery from the radio's `data-c`. Every cup inherits it. A cup that should keep its own colour sets `--glaze` locally.

The flying dot uses the Web Animations API with measured rects. Create it fixed, at the button centre, and remove it on finish:

```js
const a = btn.getBoundingClientRect(), b = bag.getBoundingClientRect();
const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
const dx = b.left + b.width / 2 - x0, dy = b.top + b.height / 2 - y0;
const fly = Object.assign(document.createElement('span'), { className: 'fly' });
fly.style.left = x0 + 'px'; fly.style.top = y0 + 'px';
document.body.append(fly);
fly.animate([
  { transform: 'translate(0,0) scale(1)' },
  { transform: `translate(${dx * .35}px, ${dy * .55}px) scale(1.4)`, offset: .45 },
  { transform: `translate(${dx}px, ${dy}px) scale(.5)` }
], { duration: 640, easing: 'cubic-bezier(.2,.7,.2,1)' })
  .onfinish = () => { fly.remove(); bumpBadge(); };
```

The waypoint is less than halfway across but more than halfway up. That bends the path into an arc without a bezier library.

The accordion animates with a grid row trick:

```css
.acc-p { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 280ms var(--ease); }
.acc-p > div { overflow: hidden; }
.acc-b[aria-expanded="true"] + .acc-p { grid-template-rows: 1fr; }
```

Remove `hidden` first, then set `aria-expanded` on the next frame, or the opening has no start value.

Common mistakes:

- Using real photos or an `img` tag. The art is CSS. In a real shop, swap each slide's art for an image and keep everything else.
- Glass buttons over the gallery. This family is paper. Buttons are opaque cream with ink borders.
- Rounded pills. The radius is 2px everywhere, including the badge and the dots.
- Soft blurred shadows. Shadows are hard offsets in ink.
- Hiding the sold-out size. Show it, disable it, strike it, explain it.
- Making swatches 24px. The colour square is 30px but the target is 44px.
- Updating the badge before the dot lands. The count changes on arrival.
- Letting a second tap during "Added" queue another add.
- Putting the serif on the price.
- Drawing a status bar over the gallery.

Rebuild order:

1. Tokens, fonts, the registered `--glaze`.
2. The scrolling `main` with the fixed bar and its clearance.
3. The gallery track, three slides, CSS cups, dots synced to scroll.
4. The overlay buttons.
5. Name, subline, price, rating.
6. Glaze radios wired to `--glaze`. Size radios wired to price and total.
7. Accordion.
8. Add to bag states, then the flying dot, then the badge bump.
9. Reduced motion pass. Tab through every control.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
