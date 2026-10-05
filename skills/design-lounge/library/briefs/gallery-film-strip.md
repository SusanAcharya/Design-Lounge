<!-- Design Lounge Nº 245 · "Film strip with loupe" · www.designlounge.live -->

# Film strip with loupe

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A photographer's roll review screen, set in a darkroom. A horizontal 35mm strip runs across the bottom of the frame: a near-black film base, a row of rounded sprocket holes top and bottom, and amber edge print ("14 ▸ 14A", "PELLHAM 400") between the holes and the pictures. Twelve frames sit on the strip. The selected one is enlarged above on a glowing light box, and a 176px circular loupe magnifies it 3× under the pointer. A Positive/Negative toggle flips every picture to an orange-based colour negative. The detail worth copying is the red grease-pencil ring around the chosen frame: a 3px, slightly rotated, irregularly rounded outline, the way a photographer marks a keeper.

The pictures are illustrated SVG scenes (pier at dusk, lighthouse, dunes, sails, beach huts, night ferry). No image files, no fetched URLs.

## Structure

```
1280 × 800, body grid rows: auto / 1fr / auto
┌───────────────────────────────────────────────────────────────┐
│ ROLL 07 · PELLHAM 400 · 36 EXP      [ POSITIVE | NEGATIVE ]   │ header, padding 28 40 0
│ COASTLINE, MARCH (Anton 44)                                   │
│                                                               │
│      ┌ light box 22px padding ───────┐   14A   (Anton 64)     │
│      │ ┌ 540 × 360, 6px black ─────┐ │   Pier at dusk         │ stage, gap 40
│      │ │        ( loupe 176 )      │ │   ─────────────        │
│      │ └───────────────────────────┘ │   EXPOSURE  f/5.6 ...  │ meta 220 wide
│      └───────────────────────────────┘   LENS / LOUPE         │
│ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪  │ sprocket row
│ 12 ▸ 12A        13 ▸ 13A       14 ▸ 14A        15 ▸ 15A       │ edge print
│ [200×133]  14  [200×133]  14  ((200×133))  14  [200×133] ...  │ frames, gap 14
│              PELLHAM 400                                      │
│ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪  │
│ Drag or scroll the strip · ← → step frames      Frame 6 of 12 │
└───────────────────────────────────────────────────────────────┘
```

- `header`: kicker `p`, the only `h1`, and a `div role="group"` with two `aria-pressed` buttons.
- `main.stage`: the light box `div`, holding `.view` (`tabindex="0"`, `role="img"`, labelled) with the big SVG and the loupe; then an `aside` with `aria-live="polite"` for frame number, title and a `dl` of exposure, lens, loupe.
- `section.rail` (labelled "Film strip"): a horizontal scroller containing the strip; the strip holds 12 `button.frame`.
- The body grid needs `grid-template-columns: minmax(0,1fr)` or the strip's intrinsic width widens the page.
- The scroller fades its ends with a horizontal mask (transparent → black at 6% and 94%).

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Enlarged frame | select | transform, opacity | strip rect scale, 0.6 → none, 1 | 460ms | `--expo` | no animation |
| Strip | select | scrollLeft | → centred | smooth | browser | instant |
| Grease ring | select | opacity, scale | 0, 0.92 → 1, 1 (rotate −1.2deg kept) | 180ms / 240ms | `--ease` / `--expo` | instant |
| Film base | toggle | background | `#0b0a09` ↔ `#5b2c12` | 400ms | `--ease` | instant |
| Toggle pill | toggle | background, colour | — | 180ms | `--ease` | instant |
| Loupe | pointer | transform | follows pointer | none (direct) | — | unchanged |

The loupe is never eased. A lagging loupe feels broken.

## States

- Frame resting: no border. Hover: picture at 86% opacity.
- Frame selected: `aria-current="true"`, red ring visible via `::after` (inset −9px −8px, radius `14px 10px 16px 9px`, rotate −1.2deg).
- Frame focus-visible: 2px `--edge` outline, offset 12px so it clears the ring.
- Toggle pressed: `--ink` fill, `--bg` text. Unpressed hover: text to `--ink`.
- Negative mode: `body.neg`. Scene filter `invert(1) sepia(.6) saturate(2.2) hue-rotate(-18deg) contrast(.85) brightness(.9 / b)`.
- Dragging: scroller has `.dragging`, cursor `grabbing`; the click that ends a drag does not select.
- No empty or error state on this frame: the roll always has 12 frames.

## Accessibility

- Toggle is a `role="group"` labelled "Film view"; each button has `aria-pressed`.
- Each frame is a `button` labelled "Frame 14A, Pier at dusk". Edge print is `aria-hidden`.
- `aria-current="true"` marks the selected frame.
- The enlarged view is focusable (`tabindex="0"`, `role="img"`), labelled "Enlarged frame. Arrow keys move the loupe."
- The meta `aside` is `aria-live="polite"` so selection is announced.
- Focus order: toggle, enlarged view, frames left to right.
- Contrast: `#f1ebe2` on `#121010` ≈ 16:1. `#e9a23b` on `#0b0a09` ≈ 9:1. `#7d746a` hints on `#121010` ≈ 4.2:1, used only for 11px secondary hints; raise to `--ink-2` if a product needs strict AA.
- Frames are 200×133, well above 40px.

## Responsive rules

- ≥1280: as drawn. Light box image 540 wide.
- 1024: same layout; image keeps 540, meta column still fits beside it.
- 768: the meta column wraps under the light box (flex-wrap).
- <640: header and stage padding 20px; frames become 150×100; meta full width; the loupe stays 176px; cursor is a crosshair instead of hidden. Image width is `min(540px, 100vw − 92px)`.
- Never let the strip widen the page. The scroller clips; the document scroll width equals the viewport.

## Acceptance checklist

### Always

- [ ] The strip scrolls horizontally by drag, trackpad, and vertical wheel; the page does not scroll sideways.
- [ ] A drag of more than 5px never selects a frame.
- [ ] Sprocket holes run along both edges; edge print sits between the holes and the pictures, never on the holes.
- [ ] Exactly one frame has `aria-current="true"` and the grease-pencil ring.
- [ ] The loupe magnifies the same picture at 3× and stays aligned with the pointer at every frame size.
- [ ] Arrow keys move the loupe when the view is focused; ← → step frames when a frame is focused.
- [ ] Negative mode applies to strip, light box and loupe, and changes the film base colour.
- [ ] Pictures are inline SVG; no image URLs.
- [ ] Reduced motion removes the FLIP and smooth scroll.

### This demo

- [ ] Kicker "Roll 07 · Pellham 400 · 36 exp", title "Coastline, March".
- [ ] Twelve frames, numbered 9 to 20, with 14A selected first.
- [ ] Frame 15 is the 14A scene 18% brighter.
- [ ] Loupe is 176px with a 5px `#1c1a18` ring.
- [ ] Ring colour `#d8402f`, edge print `#e9a23b`, negative base `#5b2c12`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: frame 14A, "Pier at dusk", is selected and enlarged. The loupe sits over the pier at 42% across, 60% down. The strip is scrolled so 14A is centred. Positive is pressed.
2. Moving the pointer over the enlarged frame moves the loupe centre to the pointer. The cursor is hidden over the frame (the loupe is the cursor). The loupe never leaves the frame bounds (its centre is clamped to 0–100% of width and height).
3. With the enlarged frame focused, arrow keys move the loupe by 3% of the frame; Shift+arrow moves 10%.
4. Dragging the strip horizontally scrolls it. A drag starts after 5px of movement; a press that moved less than 5px counts as a click. The cursor is `grab`, and `grabbing` while dragging.
5. A vertical mouse wheel over the strip scrolls it horizontally.
6. Clicking a frame selects it: the grease-pencil ring moves to it, the light box shows it, the meta column updates (frame number, A suffix, title, exposure), the counter reads "Frame N of 12", and the strip smooth-scrolls to centre it.
7. On selection the enlarged image grows out of the clicked strip frame (a FLIP from the strip frame's rect to the light box) over 460ms.
8. With a strip frame focused, ← and → step to the previous and next frame (wrapping), select it and move focus.
9. Negative: every scene (strip, light box, loupe) is shown as a colour negative, and the film base turns orange-brown `#5B2C12`. Positive restores.
10. Frame 15 is a bracketed exposure of 14A, rendered 18% brighter. In negative mode it reads denser, not lighter.

## Tokens

```css
:root {
  --bg: #121010;          /* darkroom */
  --bg-2: #1a1715;        /* toggle track */
  --line: #2c2724;        /* hairlines */
  --ink: #f1ebe2;         /* primary text */
  --ink-2: #a89f94;
  --ink-3: #7d746a;       /* hints, dt */
  --edge: #e9a23b;        /* edge print, kicker, focus */
  --mark: #d8402f;        /* grease pencil */
  --table: #f4f1ea;       /* light box */
  --base: #0b0a09;        /* slide film base */
  --base-neg: #5b2c12;    /* negative film base */
  --display: "Anton", Impact, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --frame-w: 200px;
  --frame-h: 133px;
  --loupe: 176px;
  --zoom: 3;
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --space: 4px 8px 14px 22px 40px;
}
```

Shadows: light box `0 0 0 1px #fff3, 0 0 80px -10px #f4f1ea55, 0 30px 60px -20px #000`. Loupe ring `0 0 0 5px #1c1a18, 0 0 0 6px #4a4540, 0 18px 30px -8px #000c`.

The page background is `radial-gradient(120% 80% at 50% 30%, #1d1916 0, #121010 60%)`.

## Typography

| Role | Family | Size | Weight | Tracking | Case / colour |
| --- | --- | --- | --- | --- | --- |
| Kicker | IBM Plex Mono | 11px | 400 | 0.14em | upper, `--edge` |
| Title h1 | Anton | 44px / 1 | 400 | 0.01em | upper, `--ink` |
| Toggle | IBM Plex Mono | 11px | 400 | 0.12em | upper |
| Frame number | Anton | 64px / 1 | 400 | 0 | `--ink`, suffix 12px mono `--edge` |
| Frame title | IBM Plex Mono | 15px | 400 | 0 | `--ink` |
| dt | IBM Plex Mono | 11px | 400 | 0.1em | upper, `--ink-3` |
| dd / body | IBM Plex Mono | 13px / 1.5 | 400 | 0 | `--ink` |
| Edge print | IBM Plex Mono | 10px | 500 number, 400 rest | 0.08em (stock 0.14em) | `--edge` |

## Implementation notes

**The loupe.** Put a second copy of the scene inside a round, `overflow:hidden` box. Size the copy at `zoom ×` the view, then offset it so the pointer point lands in the loupe centre. Set the copy's size in CSS pixels in JS; a `width:100%` rule on SVGs elsewhere will override `width` attributes and the loupe goes blank.

```js
const Z = 3, r = 88; // loupe radius
function place() {
  const w = view.clientWidth, h = view.clientHeight;
  lens.style.width = w * Z + 'px';
  lens.style.height = h * Z + 'px';
  const x = lx * w, y = ly * h;           // lx, ly are 0..1
  loupe.style.transform = `translate(${x - r}px, ${y - r}px)`;
  lens.style.transform  = `translate(${r - x * Z}px, ${r - y * Z}px)`;
}
```

**Drag vs click.** Track the press on the scroller, the move on `window`, and swallow the click if it moved.

```js
scroller.addEventListener('pointerdown', e => { down = { x: e.clientX, l: scroller.scrollLeft }; moved = false; });
addEventListener('pointermove', e => {
  if (!down) return;
  const dx = e.clientX - down.x;
  if (Math.abs(dx) > 5) moved = true;
  if (moved) scroller.scrollLeft = down.l - dx;
});
addEventListener('pointerup', () => down = null);
```

**Sprocket holes and negative.** Draw the holes as a tiny repeating SVG data URI on `::before`/`::after` (22×14 tile, 10×10 rect, rx 2, fill = page colour). Exposure brackets use a CSS variable so the negative filter still applies:

```css
.scene { filter: brightness(var(--b, 1)); }
.neg .scene { filter: invert(1) sepia(.6) saturate(2.2) hue-rotate(-18deg) contrast(.85) brightness(calc(.9 / var(--b, 1))); }
```

Common mistakes:

- An inline `filter` on one frame that silently overrides the negative filter.
- Using `scroll-snap` on the strip. Film is continuous; snapping fights the drag.
- Easing the loupe position.
- A plain rectangle for the selection. The mark is hand-drawn: uneven radii and a small rotation.
- Edge print in white. It is amber, as exposed on real stock.
- Letting the strip's `max-content` width widen a CSS grid; use `minmax(0,1fr)`.

Rebuild order:

1. Page, header, toggle.
2. Ten SVG scenes (two reused for the bracket and the second gull) as `<symbol>`s, referenced by `<use>` in strip, view and loupe.
3. Strip with holes and edge print; scroller with drag and wheel.
4. Light box with the enlarged scene, then the loupe.
5. Selection, FLIP, keyboard.
6. Negative mode.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
