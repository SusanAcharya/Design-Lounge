<!-- Design Lounge Nº 225 · "Holographic foil pass" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Holographic foil pass

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A pass wallet for a fictional infrastructure conference, "SIGNAL/26". One large pass (Ink tier, speaker Priya Tamang) floats on a deep ink grid. Two smaller passes, Silver and Gold, wait to its right. Click one and it swaps into the large slot. The large pass tilts toward the pointer, at most 12° on each axis. A narrow foil band of three pastel stops (pink, aqua, lime) slides across it, and a soft glare spot follows the pointer. The arrow keys tilt it too. When idle it floats 8px up and down over 6 seconds. The left column lists the perks of whichever tier is in front. The detail worth copying is restraint: the foil is a 48% wide band at 24% opacity, not a rainbow over the whole card, and one function maps the tilt to every variable.

## Reference behaviour

1. First frame: Ink pass in front at a rest tilt of `rotateX(-3deg) rotateY(6deg)`, so the top edge and left edge sit slightly toward the viewer. The glare sits upper left. Silver and Gold sit to the right at half scale. The left column reads "Ink · Speaker", "By invitation", and three perks.
2. Idle: the front pass floats `translateY(0 → -8px)` over 6s, alternating, forever. Side passes do not float.
3. Pointer moves over the front pass: the edge under the pointer rises toward the viewer. With `x` and `y` from 0 to 1 across the card, `rotateX = (y − 0.5) × 24°` and `rotateY = (0.5 − x) × 24°`. Both are clamped to ±12°. Updates run once per animation frame. The transition is 80ms linear while tracking.
4. The same function sets three more variables: the foil band centre `--px = 50% − ry/12 × 40%`, the glare centre `--gx = 50% − ry/12 × 45%` and `--gy = 50% + rx/12 × 45%`. So the glare sits under the pointer and the foil band slides the same way.
5. Pointer leaves: the pass returns to the rest tilt over 600ms on expo out. The foil and glare return with it, because the variables are registered with `@property` and transition too.
6. Keyboard: Tab to the front pass. Arrow Right raises the right edge by 4° (`ry − 4`). Arrow Left raises the left edge (`ry + 4`). Arrow Up raises the top edge (`rx − 4`). Arrow Down raises the bottom (`rx + 4`). Each step clamps at ±12°. Escape or Home levels the pass to 0°, 0°. The arrows do not scroll the page.
7. Click a side pass, or focus it and press Enter or Space: it swaps slots with the front pass. Both move over 520ms on expo out. The new front pass takes the rest tilt and starts floating. The left column updates to that tier.
8. Touch: dragging a finger across the front pass tilts it (`touch-action: pan-y`, so vertical scroll still works). Tapping a side pass brings it forward.
9. Reduced motion: no tilt from pointer or keys, no float, no slot slide. The foil and glare stay at their static rest positions (`--px 50%`, `--gx 50%`, `--gy 50%`), so the pass still looks foiled. Swapping still works, instantly.

## Structure

```
1280 × 800, body is a grid centred both ways, padding 40px 48px
background: 40px grid of 1px lines at 10% ink
┌────────────────────────────────────────────────────────────────────────┐
│ ── PASS WALLET · 14–16 NOV 2026                                        │
│ SIGNAL/26 (56px wide)          ┌──────────────────────┐  ┌──────────┐  │
│ Ink · Speaker (22px)           │ SIGNAL/26   [SPEAKER]│  │ Silver   │  │
│ By invitation (aqua)           │ ((·)) PASS HOLDER    │  │ 220×139  │  │
│ ─────────────────────          │       Priya Tamang   │  └──────────┘  │
│ ✓ Green room and speaker…      │ Track B · Room 2 ||||│  ┌──────────┐  │
│ ✓ Reserved seat in row A…      │ Pier 9, Hall C S26-..│  │ Gold     │  │
│ ✓ Dinner on the pier…          └──────────────────────┘  │ 220×139  │  │
│ hint: arrows tilt, Esc levels      440 × 278, r 18px     └──────────┘  │
│   380px column     gap 64px          stage 420px tall                  │
└────────────────────────────────────────────────────────────────────────┘
```

- `.wrap`: grid `minmax(0,380px) minmax(0,1fr)`, gap 64px, max width 1184px, items centred.
- Left: a `section` labelled by the `h1`. Eyebrow `p`, `h1`, then a `div[aria-live=polite]` holding the tier line, the price line, and a `ul` of three perks, then a hint `p` with `kbd` keys.
- Right: `.stage`, `position: relative`, 420px tall. Three `.slot` wrappers, each `position: absolute`, 440 × 278, `transform-origin: 0 0`, `perspective: 900px`, and a `data-slot` of 0, 1, or 2.
  - Slot 0 (front): `translate(0, 64px)`, `z-index: 2`.
  - Slot 1: `translate(504px, 40px) scale(.5)`.
  - Slot 2: `translate(504px, 232px) scale(.5)`.
- Inside each slot: `.float` (the idle bob, front only), then `.pass` (the tilt), `tabindex="0"`.
- `.pass` is a grid with three rows: top row (brand and tier badge), middle (emblem SVG and holder name), foot row (track and venue lines, barcode and pass number).
- `.pass::before` is the foil. `.pass::after` is the glare. Both `pointer-events: none`. The content sits above them with `position: relative; z-index: 1`.

Pass and tier copy:

| Tier | Badge | Holder | Foot line | Code | Left column price | Perks |
|------|-------|--------|-----------|------|-------------------|-------|
| Ink | Speaker | Priya Tamang | Track B · Room 2 / Pier 9, Hall C | S26-0417 | By invitation | Green room and speaker lounge · Reserved seat in row A, all three days · Dinner on the pier, 15 November |
| Silver | Silver | Jonah Lindqvist | Attendee · 3 days / Pier 9, Hall C | S26-2281 | $420 · 3 days | Every talk and workshop, 3 days · Lunch and coffee in Hall C · Recordings for 12 months |
| Gold | Gold | Adaeze Mensah | Patron · 3 days / Pier 9, Hall C | S26-0009 | $1,200 · 3 days | Everything in Silver · Front-row seat at the keynotes · Your name on the patron wall |

The emblem is a 52px broadcast mark: a 2px-radius dot with two or three pairs of arcs, stroke 1.25. Gold adds two short ticks above and below. The barcode is a 124 × 30 `repeating-linear-gradient` of 1–3px bars.

## Tokens

```css
@property --rx { syntax: "<angle>"; inherits: true; initial-value: 0deg; }
@property --ry { syntax: "<angle>"; inherits: true; initial-value: 0deg; }
@property --px { syntax: "<percentage>"; inherits: true; initial-value: 30%; }
@property --gx { syntax: "<percentage>"; inherits: true; initial-value: 28%; }
@property --gy { syntax: "<percentage>"; inherits: true; initial-value: 39%; }

:root {
  /* colour: deep ink, cool greys, three pastel foil stops */
  --bg: #0a0c12;           /* page */
  --bg-2: #121521;         /* spare surface */
  --ink: #e9ecf2;          /* main text */
  --ink-2: #a1a8b8;        /* perks, pass secondary text */
  --ink-3: #7a8194;        /* hint line */
  --line: rgba(233, 236, 242, .1); /* grid, rules, kbd borders */
  --pink: #f2c4d6;         /* foil stop 1 */
  --aqua: #bfe3ea;         /* foil stop 2, the UI accent: price, checks, focus, eyebrow rule */
  --lime: #e6edb8;         /* foil stop 3 */

  /* pass faces */
  --ink-face: linear-gradient(150deg, #232838, #11141d 70%);
  --silver-face: linear-gradient(150deg, #d7dbe2, #a4aab5 75%);
  --gold-face: linear-gradient(150deg, #e0c27a, #b08a3e 80%);

  /* type */
  --wide: "Archivo", system-ui, sans-serif;     /* used at font-stretch 112–125% */
  --mono: "JetBrains Mono", ui-monospace, monospace;

  /* geometry */
  --cw: 440px; --ch: 278px;  /* pass size */
  --r-pass: 18px;
  --pad-pass: 22px 24px;
  --persp: 900px;
  --max: 12deg;              /* tilt clamp per axis */
  --key-step: 4deg;

  /* motion */
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-track: 80ms;     /* linear, while the pointer moves */
  --t-return: 600ms;   /* back to rest */
  --t-swap: 520ms;     /* slot change */
  --t-float: 6s;       /* idle bob, alternate */
  --float: -8px;
}
```

Per-tier foil settings: Ink `opacity .24`, `mix-blend-mode: screen`, text `--ink` and `--ink-2`. Silver `opacity .5`, `soft-light`, text `#14161c` and `#343843`. Gold `opacity .45`, `soft-light`, text `#1a1408` and `#2e240e`.

Pass shadow: `0 30px 60px -30px rgba(0,0,0,.8), inset 0 2px 0 rgba(255,255,255,.06)`. Pass border: `1px solid rgba(255,255,255,.14)`.

## Typography

| Role | Family | Size | Weight | Stretch | Line-height | Tracking | Case |
|------|--------|-----:|-------:|--------:|------------:|---------:|------|
| Eyebrow | JetBrains Mono | 12px | 400 | — | 1.5 | 0.14em | UPPER |
| Page title | Archivo | 56px | 800 | 125% | 0.95 | -0.02em | UPPER |
| Tier line | Archivo | 22px | 600 | 112% | 1.2 | 0 | Title |
| Price line | JetBrains Mono | 13px | 400 | — | 1.5 | 0.06em | as written, aqua |
| Perk | JetBrains Mono | 13px | 400 | — | 1.5 | 0 | sentence |
| Hint | JetBrains Mono | 11px | 400 | — | 1.5 | 0.04em | sentence |
| Pass brand | Archivo | 19px | 800 | 125% | 1 | -0.01em | UPPER |
| Pass badge | JetBrains Mono | 10px | 400 | — | 1 | 0.14em | UPPER, 1px border |
| Pass label | JetBrains Mono | 10px | 400 | — | 1.5 | 0.14em | UPPER |
| Holder name | Archivo | 27px | 700 | 118% | 1.05 | -0.01em | Title |
| Pass foot | JetBrains Mono | 11px | 400 | — | 1.5 | 0.04em | sentence |
| Pass code | JetBrains Mono | 10px | 400 | — | 1.5 | 0.12em | UPPER |

Load Archivo with the width axis: `family=Archivo:wdth,wght@112..125,500..800`. Without the axis the "wide grotesk" falls back to normal width and the look is lost.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| `.pass` (front) | pointermove | `--rx`, `--ry` via transform | rest → ±12° | 80ms | linear | none |
| `.pass` (front) | pointermove | `--px`, `--gx`, `--gy` | follow the tilt | 80ms | linear | static 50% |
| `.pass` (front) | pointerleave | all five variables | current → rest (-3°, 6°) | 600ms | `--expo` | none |
| `.pass` (front) | arrow keys | `--rx` or `--ry` | ±4° per press, clamp ±12° | 600ms | `--expo` | none |
| `.pass` (front) | Escape, Home | all five variables | current → 0°, 0° | 600ms | `--expo` | none |
| `.float` (slot 0) | always | translateY | 0 → -8px, alternate | 6s | `cubic-bezier(.45,0,.55,1)` | none |
| `.slot` | side pass chosen | transform | slot position → new slot position | 520ms | `--expo` | instant |
| side `.pass` | hover | border colour | white 14% → aqua | instant | — | same |

The foil band is `linear-gradient(115deg, transparent px−24%, pink px−12%, aqua px, lime px+12%, transparent px+24%)`, layered under a 3px vertical hairline texture at 7% white. The glare is `radial-gradient(circle at gx gy, rgba(255,255,255,.55), transparent 42%)` with `mix-blend-mode: soft-light`.

## States

- **Front, idle:** rest tilt, floating, glare upper left, foil band at 30% across. `cursor: grab`.
- **Front, tracking (`.track`):** fast 80ms linear transitions; tilt, foil, and glare follow the pointer.
- **Front, keyboard tilted:** holds the stepped angle until another key, Escape, or a pointer leave.
- **Front, focus-visible:** 2px aqua outline, 4px offset, following the pass's rounded corners.
- **Side pass:** flat (0°, 0°), half scale, no float, `role="button"`, `cursor: pointer`.
- **Side pass hover:** border turns aqua.
- **Side pass focus-visible:** 2px aqua outline at 4px offset, scaled with the pass.
- **Swapping:** both slots move at once; nothing fades.
- **Disabled, loading, error:** not part of this piece. A pass that cannot be shown should not render a broken card; show the tier line and perks only.

## Accessibility

- The front pass has `role="group"`, `aria-roledescription="pass"`, and `aria-label="Ink pass. Arrow keys tilt it."`. Its visible text (brand, badge, holder, venue, code) stays readable inside the group.
- Side passes have `role="button"` and `aria-label="Bring the Silver pass forward"`. Enter and Space activate them. These roles and labels are reassigned on every swap.
- Focus stays on the pass that was activated, which is now the front pass.
- The tier line, price, and perks sit in an `aria-live="polite"` region, so a swap is announced.
- Arrow keys call `preventDefault()` only while the front pass has focus, so the page still scrolls elsewhere.
- The tilt is decoration. Nothing is shown only through the tilt, foil, or glare.
- Contrast: `--ink` on the Ink face 14:1. `--ink-2` on the Ink face 7:1. `#343843` on the darkest silver 4.9:1. `#2e240e` on the darkest gold 4.6:1. `--ink-3` hint on the page 4.8:1. Check these again if you change the face gradients, because the foil lightens and the face darkens toward the lower right.
- Hit targets: the side passes are 220 × 139 at 1280.

## Responsive rules

- **≥ 1280:** two columns (380px copy, stage). Pass 440 × 278. Side passes at `translate(504px, 40px)` and `translate(504px, 232px)`, scale 0.5.
- **1024 (901–1180):** copy column 320px, gap 40px, title 44px. Pass 400 × 252. Side passes at `translate(424px, 40px)` and `translate(424px, 210px)`.
- **768 (641–900):** one column. Copy on top, stage below at 440px tall. Front pass at `translate(0, 0)`. Side passes in a row under it at `translate(0, 288px)` and `translate(216px, 288px)`, scale 0.5.
- **< 640:** body padding 24px 16px, title 36px, pass 328 × 207, holder name 21px, pass padding 16px 18px, emblem 40px. Stage 340px tall. Side passes at `translate(0, 230px)` and `translate(170px, 230px)`, scale 0.48.
- Slot positions live in media queries, so the JS never measures layout to place cards.
- Nothing scrolls sideways. Every grid track uses `minmax(0, …)`.

## Acceptance checklist

### Always

- [ ] One front card tilts toward the pointer: the edge under the pointer rises. Both axes clamp at ±12°.
- [ ] Arrow keys tilt the front card in 4° steps; Escape levels it; the page does not scroll while it has focus.
- [ ] Tilt, foil position, and glare position all come from one function that writes CSS custom properties.
- [ ] The foil is a narrow band of three pastel stops at low opacity, not a full-card rainbow.
- [ ] The five variables are registered with `@property`, so leaving the card animates the foil and glare back, not only the transform.
- [ ] Pointer updates run at most once per animation frame.
- [ ] The front card floats 8px over 6s when idle; side cards do not float or tilt.
- [ ] Clicking or pressing Enter on a side card swaps it to the front, and the roles and labels follow.
- [ ] A polite live region announces the new tier and perks.
- [ ] Reduced motion: no tilt, no float, no slide; the foil and glare are visible and static.
- [ ] No purple gradients, no glow blobs, no neon shadows.

### This demo

- [ ] SIGNAL/26 pass, Ink tier in front, holder Priya Tamang, code S26-0417.
- [ ] Silver (Jonah Lindqvist, S26-2281) and Gold (Adaeze Mensah, S26-0009) at half scale to the right.
- [ ] Foil stops `#f2c4d6`, `#bfe3ea`, `#e6edb8`; Ink foil at 0.24 opacity with `screen`.
- [ ] Page `#0a0c12` with a 40px grid of 10% lines.
- [ ] Pass 440 × 278, 18px radius, 900px perspective on the slot.
- [ ] Archivo at 125% width for the title and brand; JetBrains Mono for all labels.

## Implementation notes

**One function owns every variable.** Pointer, keys, rest, and reset all call it, so the foil and glare can never drift from the tilt:

```js
const MAX = 12;
const clamp = v => Math.max(-MAX, Math.min(MAX, v));
function tilt(pass, rx, ry) {
  if (reduce) { rx = 0; ry = 0; }
  pass.rx = rx = clamp(rx);
  pass.ry = ry = clamp(ry);
  pass.style.setProperty('--rx', rx + 'deg');
  pass.style.setProperty('--ry', ry + 'deg');
  pass.style.setProperty('--px', (50 - ry / MAX * 40).toFixed(1) + '%');
  pass.style.setProperty('--gx', (50 - ry / MAX * 45).toFixed(1) + '%');
  pass.style.setProperty('--gy', (50 + rx / MAX * 45).toFixed(1) + '%');
}
// pointer: x, y are 0..1 across the card's bounding box
tilt(pass, (y - .5) * 2 * MAX, (.5 - x) * 2 * MAX);
```

Sign check: positive `rotateX` tips the top edge away from the viewer, and positive `rotateY` tips the right edge away. That is why the pointer maths has `(y − .5)` and `(.5 − x)`. Get this wrong and the card leans away from the hand.

**Foil and glare as pseudo-elements that read the variables:**

```css
.pass { position: relative; overflow: hidden; border-radius: 18px;
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 600ms var(--expo), --px 600ms var(--expo), --gx 600ms var(--expo), --gy 600ms var(--expo); }
.pass.track { transition: transform 80ms linear, --px 80ms linear, --gx 80ms linear, --gy 80ms linear; }
.pass::before { content: ""; position: absolute; inset: 0; pointer-events: none;
  mix-blend-mode: var(--blend); opacity: var(--foil);
  background:
    repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, transparent 1px 3px),
    linear-gradient(115deg, transparent calc(var(--px) - 24%), var(--pink) calc(var(--px) - 12%),
      var(--aqua) var(--px), var(--lime) calc(var(--px) + 12%), transparent calc(var(--px) + 24%)); }
.pass::after { content: ""; position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light;
  background: radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,.55), transparent 42%); }
.pass > * { position: relative; z-index: 1; }
```

**Three wrappers, three transforms.** The slot moves between positions, the float bobs, the pass tilts. If two of these share one element, the last `transform` wins and the others vanish:

```html
<div class="slot" data-slot="0">      <!-- translate + scale, perspective 900px -->
  <div class="float">                 <!-- idle translateY -->
    <div class="pass" tabindex="0">…</div>  <!-- rotateX / rotateY -->
  </div>
</div>
```

Common mistakes:

- A full-card conic rainbow at 60% opacity. It reads as a sticker, not foil. Keep the band narrow and the opacity under 0.3 on dark faces.
- Forgetting `@property`. Without it, `--px` jumps instead of easing back, and the foil snaps on pointer leave.
- Tilting on `focus`. Keyboard users choose the tilt with arrows; focus alone should not move the card.
- Putting `perspective()` inside the pass's own transform. Put `perspective` on the slot.
- Measuring the stage in JS to place the side cards. Slot positions are CSS, per breakpoint.
- Letting side cards respond to the pointer. Only the front card tracks.
- Glow shadows in aqua or pink around the pass. The foil is the only colour on the card.
- Arrow keys that also scroll the page. Call `preventDefault()` for the four arrows, Escape, and Home on the front card.

Rebuild order:

1. Page grid background, the two-column wrap, the copy column.
2. One pass at 440 × 278 with its three rows of content.
3. The foil and glare pseudo-elements, reading `--px`, `--gx`, `--gy`.
4. The `tilt()` function, the rest pose, and the pointer handler with rAF.
5. Keyboard steps and reset.
6. Three slots, the swap, and the role and label updates.
7. The idle float on slot 0 only.
8. Reduced motion, the live region, and the three smaller layouts.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
