<!-- Design Lounge Nº 398 · "Swinging kraft hang tag" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Swinging kraft hang tag

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A product card dressed as the physical swing tag on a garment, for a store's markdown page or an in-store kiosk. A brass hook sits at the top of the frame; a loden-green string drops to the grommet of a kraft tag with clipped top corners. The tag carries the brand (Pike & Ollerton, est. 1931), the product (Brushed cotton overshirt), the old price struck with a red diagonal, the sale price in a 68px Didone, a round "−35% OFF" sticker, five size chips (XL sold out), a "Hold size M · 24 h" button, and a perforated stub with a real EAN-13 barcode. Brush the pointer across the tag and it swings like a pendulum in the direction you pushed, then settles. The detail worth copying is that the swing is a damped spring driven by the pointer's horizontal velocity at entry, not a canned keyframe, so it feels pushed rather than animated.

Not `receipt-slip` (a till receipt) and not `card-product-quick-add` (a grid product card). This is one item's tag.

## Reference behaviour

1. First frame: tag hangs at the rest angle of −3° (bottom slightly right). 500ms after load it gets one small push and swings, then settles within about 3s. Left column: "Store 14 · Rack C · Menswear", "Autumn markdown" (76px italic Didone), a two-line note, an "Ends Sunday, 11 October" pill with a red dot, and a hint "Brush past the tag to swing it." (hidden on touch-only devices).
2. Brush: when the pointer enters the swing element, take the pointer's horizontal speed from the last move (px/ms). Impulse = `(0.35 + min(1, |vx| / 1.2) × 0.9) × 0.045` deg/ms, signed so the tag's bottom moves the same way as the pointer. If there was no movement, push away from the side of entry.
3. Pendulum: angular acceleration = `−(a − rest) × 0.00005 − v × 0.0026` per ms². That gives a period of about 890ms and settles from an 8° swing in about 3s. Velocity is clamped to ±0.07 deg/ms (about ±10°). The loop stops when `|a − rest| < .02°` and `|v| < .0005`.
4. Hovering does not keep it swinging; only entering does. The chips stay clickable because the swing decays quickly.
5. Sizes: XS (2), S (6), M (3, selected), L (1), XL (0, sold out). Clicking a chip selects it, nudges the tag (±2.2°), and updates the stock line: "Only 3 left in M", "6 in S on this rack", "Last one in L on this rack" (bold with a red dot). Sold-out XL is dashed, struck, and cannot be selected.
6. Arrow keys in the size group move the selection and skip sold-out sizes, wrapping at the ends.
7. Hold: the button reads "Hold size M · 24 h" with a bookmark icon. Pressing it fills it ink, swaps to a check, and reads "Held till 5 Oct, 6 pm"; the stock line says "Size M is held at the fitting rooms until tomorrow, 6 pm". Pressing again releases. Changing size while held releases the hold quietly and relabels the button.
8. Keyboard: the tag itself is focusable. Focus gives a small nudge (±2°). Space or Enter on the tag gives a bigger one (±5°). Focus shows an inset ink ring inside the clipped shape.
9. Reduced motion: the tag stays at −3°, never swings; everything else works.

## Structure

```
1280 × 800, wall #e3ded2 with 47px pinstripes at 3.5% and a soft light upper right
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                  ║ brass rail 14 × 58       │
│ STORE 14 · RACK C · MENSWEAR                      ╲╱ green string 96px tall  │
│ Autumn                                       ╱──────────╲                    │
│ markdown   (76px italic)                    │    ◎       │ grommet 26px      │
│ Green-string tags are already…              │  est. 1931 │                   │
│ [● Ends Sunday, 11 October]                 │PIKE & OLLERTON               │
│ Brush past the tag to swing it.             │────────────│                   │
│                                             │Brushed cotton overshirt        │
│                                             │Style 4471-LD · Loden · …       │
│  col 1fr                 gap 56px           │$1̶4̶8̶.̶0̶0̶          (−35%)│      │
│                                             │$96.00  (68px red)  sticker 68  │
│                                             │SIZE [XS][S][■M][L][X̸L̸]         │
│                                             │Only 3 left in M                │
│                                             │[ ⌑ HOLD SIZE M · 24 H ]        │
│                                             │- - - - - - - - - - - - - - - - │ perforation
│                                             │|||||||||||||   Sale ref.       │
│                                             │5 012345 447186  MD-26-35       │
│                                             └────────────────┘ tag 330px wide│
└──────────────────────────────────────────────────────────────────────────────┘
```

- `main.wrap`: grid `minmax(0,1fr) minmax(0,420px)`, gap 56px, max 1040px, full height.
- Left: `section.note` labelled by the `h1`.
- Right: `.rack` (relative, full height) with `.rail` (decorative) and `.swing`: absolute, top 66px, centred, 330px wide, `transform-origin: 50% 0`, `rotate: var(--a)`. Inside: the string SVG (two cubic strands from the hook to the grommet), then a shadow wrapper, then `article.tag[tabindex=0]` labelled by the product name and described by the price block.
- Tag: `clip-path: polygon(18% 0, 82% 0, 100% 7%, 100% 100%, 0 100%, 0 7%)`, padding 58px 28px 0. Contents in order: grommet `span`, brand `p`, hairline, `h2` product, meta `p`, `.prices` (was, now, sticker), `fieldset.sizes` with `legend` and a `div[role=radiogroup]` of five `button[role=radio]`, stock `p[aria-live=polite]`, hold `button[aria-pressed]`, `.stub` with the barcode SVG (`role=img`) and the sale reference.
- The shadow lives on a wrapper `div` around the tag, because `clip-path` clips the tag's own `filter`.

## Tokens

```css
:root {
  --wall: #e3ded2;      /* page */
  --kraft-3: #d8b88f;   /* tag top */
  --kraft: #c9a47a;     /* tag middle */
  --kraft-2: #c29a6c;   /* tag bottom */
  --ink: #2a2017;       /* text, barcode, selected chip, held button */
  --ink-2: #3f3022;     /* brand line, legend, stock, sku */
  --ink-3: #4a3a2a;     /* meta, struck price, eyebrow */
  --sale: #8f2010;      /* sale price, strike line, sticker, low-stock dot, ends dot */
  --string: #4f6b3a;    /* loden-green string */
  --brass: #a8843f;     /* rail and hook */
  --focus: #2a2017;

  --serif: "Bodoni Moda", Didot, Georgia, serif;   /* opsz 6–96 */
  --mono: "Courier Prime", ui-monospace, monospace;

  --tw: 330px;          /* tag width */
  --rest: -3deg;
  --k: 0.00005;         /* spring, per ms² */
  --damp: 0.0026;       /* per ms */
  --vmax: 0.07;         /* deg per ms */

  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-micro: 150ms;
}
```

Kraft surface, top to bottom of the stack:

```css
background:
  radial-gradient(circle at 20% 30%, rgba(255,255,255,.12), transparent 40%),
  repeating-linear-gradient(17deg, rgba(90,60,30,.05) 0 1px, transparent 1px 4px),
  repeating-linear-gradient(-71deg, rgba(255,240,210,.06) 0 1px, transparent 1px 5px),
  linear-gradient(170deg, var(--kraft-3), var(--kraft) 40%, var(--kraft-2));
```

Shadow wrapper: `drop-shadow(0 22px 22px rgba(42,32,23,.2)) drop-shadow(0 2px 2px rgba(42,32,23,.15))`. Grommet: 26px circle filled with the wall colour, ring `0 0 0 5px #d9c9a8`, outer hairline `0 0 0 6px rgba(42,32,23,.3)`, inner shade `inset 0 2px 3px rgba(42,32,23,.35)`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Eyebrow | Courier Prime | 12px | 400 | 1.5 | 0.18em | UPPER |
| Headline | Bodoni Moda italic, opsz 96 | 76px | 500 | 0.95 | -0.02em | Title |
| Note body | Courier Prime | 14px | 400 | 1.6 | 0 | sentence, 36ch |
| Brand est. | Bodoni Moda italic | 13px | 500 | 1 | 0.02em | lower |
| Brand name | Bodoni Moda | 22px | 700 | 1 | 0.14em | UPPER |
| Product | Bodoni Moda | 24px | 500 | 1.1 | -0.005em | Sentence |
| Meta | Courier Prime | 12px | 400 | 1.5 | 0.04em | as written |
| Was price | Courier Prime | 16px | 400 | 1.5 | 0 | — |
| Sale price | Bodoni Moda, opsz 96 | 68px ($ 30px, .00 26px superscript) | 700 | 0.9 | -0.02em | lining |
| Sticker | Courier Prime | 20px (OFF 10px, 0.12em) | 700 | 0.9 | 0 | UPPER |
| Legend | Courier Prime | 11px | 400 | 1 | 0.16em | UPPER |
| Chip, hold | Courier Prime | 13px | 700 | 1 | 0 / 0.08em | UPPER |
| Barcode digits | Courier Prime | 10px | 400 | 1.5 | 0.2em | — |
| Sale ref. | Courier Prime | 15px 700 over 10px labels | | 1.2 | 0.02em | UPPER |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| `.swing` | pointer enters | `rotate` via `--a` | rest → damped swing, up to ~10° | ~3s to settle | spring (k .00005, c .0026) | stays −3° |
| `.swing` | load + 500ms | `rotate` | one push of .03 deg/ms (~4°) | ~3s | spring | none |
| `.swing` | chip pick | `rotate` | ±2.2° impulse | ~2s | spring | none |
| `.swing` | hold toggle | `rotate` | ±3° (hold) / ±1.5° (release) | ~2s | spring | none |
| `.swing` | tag focus / Space | `rotate` | ±2° / ±5° | ~2–3s | spring | none |
| Chip, hold | hover / select | background, colour | — | 150ms | `--ease` | instant |

The string rotates with the tag because it is inside `.swing`; the rail does not move. Use the individual `rotate` property, not `transform`, so nothing else on the element fights it.

## States

- **Rest:** −3°, still.
- **Swinging:** angle written every animation frame until it settles; the loop then stops entirely.
- **Chip resting:** 40px tall, 1.5px border at 45% ink, 3px radius. **Hover:** 8% ink fill. **Selected:** ink fill, `--kraft-3` text, `aria-checked="true"`, `tabindex=0`.
- **Sold out:** dashed border, 42% ink text, a 1.5px diagonal strike at −24°, `aria-disabled="true"`, not selectable by click or arrows.
- **Low stock (1 left):** stock line bold ink with an 8px red dot.
- **Hold:** 44px tall, 1.5px ink border. **Hover:** 8% ink fill. **Held:** ink fill, kraft text, check icon, `aria-pressed="true"`.
- **Tag focus-visible:** `box-shadow: inset 0 0 0 3px ink, inset 0 0 0 5px kraft-3` (an outline would be clipped).
- **Other focus-visible:** 2px ink outline, 3px offset.

## Accessibility

- The tag is an `article` labelled by the product name and described by the price block, so it reads "Brushed cotton overshirt, Was $148.00 Now $96.00".
- The struck price has a visually hidden "Was" and the sale price a hidden "Now"; the decorative `$` and sticker are `aria-hidden` and a hidden `$` is spoken instead.
- Sizes are a `radiogroup` inside a `fieldset` with a legend. Each radio is labelled with its stock: "M, 3 left", "XL, sold out". Roving `tabindex`; arrows move and skip sold-out sizes.
- Stock and hold messages share a polite live region.
- The barcode SVG is `role="img"` with the number as its label; the digits are also printed.
- The swing is decoration. No information depends on it, and it never runs under reduced motion.
- Contrast on kraft `#c9a47a`: ink 6.9:1, `--ink-2` 5.5:1 (4.9:1 on the darker bottom `#c29a6c`), `--ink-3` 4.7:1 (used only in the lighter upper half). Sale red is used for the 68px price (3.8:1, large text) and as fills, never for small text. Sticker text `#fbeee3` on `#8f2010` 7.7:1.
- Hit targets: chips 40px tall and at least 46px wide; hold 44px.

## Responsive rules

- **≥ 1280:** two columns, tag 330px, swing anchor 66px from the top. Tag bottom sits near y 760 at rest.
- **901–1279:** same layout; the note column narrows first.
- **≤ 900:** one column. Note centred on top (headline 48px), then the rack with `min-height: 820px`; the page scrolls vertically.
- **≤ 420:** tag 300px, padding 54px 22px 0, sale price 58px, headline 40px, note body hidden. `.rack` gets `overflow-x: clip` so the rotated tag never creates sideways scroll. Do not clip at wider sizes or the swing gets cut.
- Touch: the hint hides under `(hover: none)`. A tap still triggers `pointerenter` and gives a push.

## Acceptance checklist

### Always

- [ ] The swing is a damped spring integrated per frame, pushed by pointer velocity on entry, settling and stopping on its own.
- [ ] Rotation origin is the top of the string, and the string rotates with the tag.
- [ ] The tag shape is a clip-path with clipped top corners and a grommet hole showing the wall colour.
- [ ] The shadow is on a wrapper, not on the clipped element.
- [ ] Old price is struck by a diagonal line, not just `text-decoration`, and the sale price dominates.
- [ ] Size chips are a radiogroup with roving tabindex; sold-out sizes are visible, struck, and skipped.
- [ ] The barcode is real bars generated from the digits, with the digits printed below.
- [ ] Tag focus ring is visible inside the clip shape.
- [ ] Reduced motion: no swing at all, everything else intact.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Pike & Ollerton, est. 1931; Brushed cotton overshirt, Style 4471-LD, Loden, 100% cotton twill.
- [ ] Was $148.00, now $96.00, sticker −35% OFF.
- [ ] Sizes XS 2, S 6, M 3 (selected), L 1, XL sold out.
- [ ] Barcode 5 012345 447186; sale ref. MD-26-35, Rack C · 14.
- [ ] Wall `#e3ded2`, kraft `#c9a47a`, sale `#8f2010`, string `#4f6b3a`.
- [ ] Bodoni Moda for brand, product and prices; Courier Prime for everything typed.

## Implementation notes

**The pendulum.** A semi-implicit Euler step per frame, clamped dt, and a stop condition so it doesn't run forever:

```js
let a = -3, v = 0, raf = 0;
const REST = -3, K = 0.00005, DAMP = 0.0026;
function run() {
  let last = performance.now();
  const tick = t => {
    const dt = Math.min(32, t - last); last = t;
    v += (-(a - REST) * K - v * DAMP) * dt;
    a += v * dt;
    swing.style.setProperty('--a', a.toFixed(3) + 'deg');
    if (Math.abs(a - REST) < .02 && Math.abs(v) < .0005) { a = REST; raf = 0; return; }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}
function kick(dv) { if (reduce) return; v = Math.max(-.07, Math.min(.07, v + dv)); if (!raf) run(); }
```

Sign: CSS `rotate` is clockwise-positive, and with the origin at the top a positive angle moves the bottom to the left. A pointer moving right must give a negative impulse: `kick(-Math.sign(vx) * magnitude)`.

**EAN-13 bars from the digits.** The first digit chooses the L/G parity of the left six; the right six use R codes:

```js
const L = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
const G = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
const R = L.map(p => [...p].map(c => c === '0' ? '1' : '0').join(''));
const PAR = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];
const d = '5012345447186'.split('').map(Number);
let bits = '101';
d.slice(1, 7).forEach((n, k) => bits += (PAR[d[0]][k] === 'L' ? L : G)[n]);
bits += '01010';
d.slice(7).forEach(n => bits += R[n]);
bits += '101';                       // 95 modules: one 1-unit rect per '1', guards 48 tall, others 42
```

**Perforated stub.** A 2px dashed top border plus two wall-coloured 14px circles half off each edge:

```css
.stub { position: relative; margin: 22px -28px 0; padding: 16px 28px 18px; border-top: 2px dashed rgba(42,32,23,.4); }
.stub::before, .stub::after { content: ""; position: absolute; top: -8px; width: 14px; height: 14px; border-radius: 50%; background: var(--wall); }
.stub::before { left: -7px; } .stub::after { right: -7px; }
```

Common mistakes:

- A CSS `@keyframes` wobble on hover. It loops while you try to click a chip, and it ignores direction.
- Putting `filter: drop-shadow` on the clipped tag; the shadow is clipped away.
- A white string on a pale wall. It disappears; the string is the colour cue ("green-string tags").
- Small text in sale red on kraft (2.8–3.8:1). Red is for the big price and for fills.
- `outline` for the tag's focus state; `clip-path` cuts it off.
- `overflow: hidden` on the rack at desktop widths, which slices the tag mid-swing.
- A fake barcode of random stripes. Generate it from the printed number.

Rebuild order:

1. Two-column layout, wall texture, rail and hook.
2. Tag shape, kraft surface, grommet, shadow wrapper, and the string.
3. Content: brand, product, prices with strike and sticker.
4. Size radiogroup with stock line; hold toggle.
5. Barcode and stub.
6. Pendulum, pointer impulse, nudges, focus ring.
7. Reduced motion and the narrow layouts.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
