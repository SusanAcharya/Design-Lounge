<!-- Design Lounge Nº 004 · "Bottom sheet with three detents" · designlounge.vercel.app -->

# Bottom sheet with three detents

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The "Nearby" sheet from "Halden", a local-places app, sitting over a map. The sheet is a full-height panel translated down so that only a chosen amount is visible; it rests at three detents: **peek** (120px visible), **half** (430px) and **full** (782px, i.e. top edge 62px from the top of the phone). You drag it by its header with pointer events; on release it snaps to the nearest detent, or flicks one detent in the direction of a fast release. A scrim darkens the map only between half and full, in proportion to progress. Map pins and list rows are linked: tapping a pin selects the row and brings the sheet to half. The map is entirely CSS (gradients for roads, rounded blocks for parks and a lake), so there are no image dependencies.

## Structure

```
390 × 844
┌────────────────────────────────────────┐
│ (54 status)                            │
│ 62 ┌ glass search pill 48 ───────────┐ │
│    │ ⌕ Near Grünerløkka, Oslo        │ │
│    └─────────────────────────────────┘ │
│   ┌──┐ park          ┌──┐  ▼ pin       │  map: roads = white gradients,
│   │  │  ▼ pin        │  │              │  parks #D3E3C8, lake #C9DCE6
│   └──┘ ─────── road ─┴──┴──────────    │
│      ▼ pin      park                   │
│  lake                                  │
│ ───────────────────────────────────────│ ← full: top at 62
│ ▓▓▓▓▓▓▓▓▓▓ scrim 0→.38 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ┌───────────── ▬ grabber ─────────────┐│ ← half: 430 visible
│ │ Nearby              18 places · 400m││
│ │ [All] [Coffee] [Bakeries] [Open now]││ ← peek: 120 visible
│ │──────────────────────────────────── ││
│ │ ◼ Brød & Bønner   4.8 · Bakery 120 m││
│ │ ◼ Vollen Park Kiosk 4.3 · ...  160 m││
│ │ ...                                 ││
│ └─────────────────────────────────────┘│
└────────────────────────────────────────┘
```

- `.map` (`aria-hidden`): absolute, full bleed; background is a stack of `linear-gradient` roads over a 64px `repeating-linear-gradient` grid on `--map`. Children: two `.park` rounded blocks, one `.water` blob (420px, `border-radius:48% 52% 40% 60%`, rotated −14°), three `.blk` building blocks, three `.lbl` street labels.
- Three `<button class="pin" aria-pressed data-i>`: 44×44 hit area, 30×38 SVG teardrop, anchored by `margin:-44px 0 0 -22px` so `left/top` is the pin tip.
- `.top`: glass search pill, `top:62px`, 48px tall.
- `.scrim`: absolute full bleed, `opacity` driven by JS.
- `<section class="sheet" role="dialog" aria-label="Places nearby" aria-modal="false">`: absolute, `height:100%`, `transform: translateY(H − visible)`. Flex column:
  - `.head` (drag handle, `tabindex=0 role=button`): grabber 36×5, `<h2>`, `.chips`.
  - `<ul class="list">`: `overflow-y:auto; flex:1`, rows are `<li tabindex=0>`.

## Motion

| Element   | Trigger        | Property   | From → To                         | Duration | Easing     | Notes |
|-----------|----------------|------------|-----------------------------------|---------:|------------|-------|
| `.sheet`  | pointer drag   | transform  | follows `translateY(H − v)`       | 0        | none       | class `dragging` removes the transition |
| `.sheet`  | release        | transform  | current → detent                  | 480ms    | `--spring` | |
| `.sheet`  | overshoot      | transform  | damped: `full + (v−full)·.25`     | 0        | —          | both ends |
| `.scrim`  | drag / snap    | opacity    | `max(0,(v−half)/(full−half))·.38` | 0 / 480ms| `--spring` | `pointer-events` on only above half+10px |
| `.pin`    | pressed        | transform  | 1 → scale(1.18)                   | 160ms    | `--ease`   | |
| `.name`   | row selected   | color      | `--ink` → `--accent`              | 160ms    | `--ease`   | |
| chip      | pressed        | bg/color   | white/`--ink-2` → `--ink`/white   | 0        | —          | instant |

Reduced motion: `.sheet`, `.scrim` and `.pin` transitions become 1ms. Snapping still happens; dragging still tracks the finger.

## States

- **Detent:** `data-detent="peek|half|full"` on the sheet, updated on every apply, so other UI can react.
- **Dragging:** `.sheet.dragging`, `.scrim.dragging` (no transitions); header cursor `grabbing`.
- **Selected row:** `.row.sel` → name in `--accent`; matching pin `aria-pressed="true"` and scaled.
- **Row focus-visible:** 2px `--accent` outline, `outline-offset:-2px`, 8px radius.
- **Pin focus-visible:** 2px `--accent` outline, 2px offset, circular.
- **Chip pressed:** `--ink` background, white text. **Chip focus-visible:** 2px accent outline, 2px offset.
- **Scrim at full:** 0.38 opacity, clickable; tap returns to half.
- **Empty (spec only):** if a chip filters to nothing, the list shows "No places match" in `--ink-3` centred with 40px padding; the sheet does not change detent.

## Accessibility

- The sheet is `role="dialog" aria-modal="false"` so the map stays reachable. The header is `role="button" tabindex="0"` with `aria-label="Drag to resize places sheet"`; ArrowUp / ArrowDown step through detents.
- Pins are `<button aria-label="Show <place>" aria-pressed>`, 44×44 hit area (the visible teardrop is 30×38).
- Rows are `<li tabindex="0">`; Enter or Space selects. Focus order: search pill → pins → header → chips → rows.
- Chips: `aria-pressed`, single-select group.
- Contrast: `--ink-2` on white is 6.4:1; `--star` (`#e0a12b`) is used only for the bold 13px rating and sits beside text, not alone; `--open` on white is 4.6:1.
- Announce detent changes with `aria-live="polite"` text like "Sheet expanded" if your platform lacks native sheet semantics.
- Never trap focus inside the sheet at peek or half.

## Responsive rules

- Detents are in visible px, not percent, except `full = min(782, viewportHeight − 62)`. Recompute on `resize`.
- 360 wide: rows and chips unchanged; the chips row hides overflow (no horizontal scroll indicator).
- ≥ 430 wide: sheet stays full-bleed; content inside is constrained to `max-width:480px; margin:0 auto`.
- Tablet: replace the bottom sheet with a 360px left panel at the same detent logic mapped to width (peek = 72px rail); the scrim is dropped.
- Landscape phone: half = 50% of height, full = height − 24px.

## Acceptance checklist

- [ ] Sheet rests at exactly 120px, 430px and 782px visible (top edge at 62px when full) on a 390×844 viewport.
- [ ] Dragging the header moves the sheet 1:1 with no transition; overshoot beyond full or below peek is damped to 25%.
- [ ] Slow release snaps to the nearest detent in 480ms `cubic-bezier(.32,.72,0,1)`.
- [ ] A release with |velocity| > 0.4 px/ms moves exactly one detent in the flick direction, clamped.
- [ ] Scrim opacity is 0 at and below half, 0.38 at full, linear in between, and only clickable above half.
- [ ] Tapping the scrim at full returns the sheet to half.
- [ ] ArrowUp / ArrowDown on the focused header step detents.
- [ ] Tapping a pin selects the matching row, scales the pin to 1.18 and snaps to half.
- [ ] The list scrolls inside the sheet; dragging the list does not move the sheet.
- [ ] The grabber is 36×5px, `#d3d6da`, 3px radius, centred with 12px below it.
- [ ] Sheet top corners are 22px radius with the two-layer shadow from the tokens.
- [ ] All pins, chips, rows and the header show a visible focus ring.
- [ ] Reduced motion: snaps are instantaneous, drag still tracks.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: sheet at **peek** (120px). Grabber, "Nearby · 18 places · 400 m" heading and the filter chips are visible; the list is below the fold. First pin ("Brød & Bønner") is pressed and its row is highlighted in `--accent`. Scrim opacity is 0.
2. Drag the header up: the sheet follows the pointer 1:1 with no transition. Past **full** the movement is damped to 25% (rubber band); the same below **peek**.
3. Release slowly: the sheet snaps to the nearest detent over 480ms `cubic-bezier(.32,.72,0,1)`.
4. Release fast (|velocity| > 0.4 px/ms): the sheet moves one detent in the flick direction regardless of where it is, clamped to the ends.
5. Between half and full the scrim's opacity rises linearly from 0 to 0.38 (`--scrim` = `#17191c`). Below half it is exactly 0 and `pointer-events:none`.
6. At full, tapping the scrim returns the sheet to half.
7. With the header focused, ArrowUp moves one detent up and ArrowDown one detent down.
8. Tap a map pin: the pin scales to 1.18, its row gets the accent name colour, the sheet snaps to half and the row scrolls into view. Tap a row: it becomes selected and the matching pin (if any) presses.
9. Chips are single-select (`aria-pressed`); the pressed chip fills with `--ink`.
10. The list scrolls independently inside the sheet once the sheet is at half or full; the header remains the only drag surface.

## Tokens

```css
:root {
  /* map */
  --map: #e9ece4;   --road: #ffffff;   --road-2: #f5f6f1;
  --water: #c9dce6; --park: #d3e3c8;   --block: #e0e3da;

  /* sheet + text */
  --sheet: #ffffff;
  --ink: #17191c;   --ink-2: #5f646b;  --ink-3: #9198a1;
  --line: #e6e8eb;  --grab: #d3d6da;
  --accent: #e2553b;       /* pins, selected row, focus rings */
  --accent-soft: #fbe7e2;
  --star: #e0a12b;         /* rating number */
  --open: #2d8b7f;         /* "Open" label */
  --scrim: #17191c;        /* at 0 → .38 opacity */

  /* category icon squares */
  --cat-green: #5b8a4c; --cat-orange: #c56a2c; --cat-blue: #3b6f9e;
  --cat-plum: #8a5b9c;  --cat-red: #b8433a;    --cat-teal: #2d8b7f;

  /* type */
  --font: "Public Sans", system-ui, -apple-system, sans-serif;

  /* detents (visible height) */
  --peek: 120px;  --half: 430px;  --full: 782px;   /* full = 844 − 62 */
  --rubber: .25;                                    /* overshoot damping */
  --flick: .4;                                      /* px/ms threshold */

  /* layout */
  --r-sheet: 22px;  --r-icon: 12px;  --r-chip: 16px;
  --row-pad: 14px;  --icon: 44px;   --grabber: 36px 5px;
  --sheet-shadow: 0 -1px 0 rgba(23,25,28,.06), 0 -12px 40px rgba(23,25,28,.14);

  /* motion */
  --t-micro: 160ms;
  --t-snap: 480ms;
  --spring: cubic-bezier(.32, .72, 0, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role          | Family      | Size | Weight | Line-height | Tracking | Case      |
|---------------|-------------|-----:|-------:|------------:|---------:|-----------|
| Body / row    | Public Sans | 15px | 400    | 1.4         | 0        | sentence  |
| Sheet title   | Public Sans | 22px | 700    | 1.2         | −0.02em  | sentence  |
| Title count   | Public Sans | 13px | 500    | 1.2         | 0        | sentence  |
| Chip          | Public Sans | 13px | 500    | 1           | 0        | sentence  |
| Row name      | Public Sans | 15px | 600    | 1.3         | 0        | sentence  |
| Row meta      | Public Sans | 13px | 400    | 1.4         | 0        | sentence  |
| Distance      | Public Sans | 13px | 600    | 1.4         | 0        | tabular numerals |
| Search pill   | Public Sans | 15px | 500/600| 1.4         | 0        | sentence  |
| Map label     | Public Sans | 11px | 500    | 1.2         | +0.04em  | UPPERCASE |

## Implementation notes

**Position by visible height, not by top.** Keep the sheet `height:100%` and translate it by `H − visible`. That way the list's scroll area is always the full remaining height and never needs a resize:

```js
const det = () => [120, 430, Math.min(782, innerHeight - 62)];
function apply(v, animate) {
  const [, half, full] = det();
  sheet.classList.toggle('dragging', !animate);
  sheet.style.transform = `translateY(${innerHeight - v}px)`;
  scrim.style.opacity = (Math.max(0, (v - half) / (full - half)) * .38).toFixed(3);
  scrim.style.pointerEvents = v > half + 10 ? 'auto' : 'none';
}
```

**Rubber-band and flick on the header only.** Capture the pointer so the drag survives leaving the element; track velocity from the last two move events:

```js
head.addEventListener('pointerdown', e => { drag = true; startY = lastY = e.clientY; startVis = vis; head.setPointerCapture(e.pointerId); });
head.addEventListener('pointermove', e => {
  if (!drag) return;
  const [pk, , fu] = det(); let v = startVis + (startY - e.clientY);
  if (v > fu) v = fu + (v - fu) * .25;  if (v < pk) v = pk - (pk - v) * .25;
  vel = (e.clientY - lastY) / Math.max(1, e.timeStamp - lastT); lastY = e.clientY; lastT = e.timeStamp;
  apply(v, false);
});
```

On `pointerup`: if `Math.abs(vel) > .4`, snap to `d[i ± 1]` (negative velocity = finger moving up = expand); otherwise snap to the nearest detent to the released value.

**Map without images.** Roads are non-repeating `linear-gradient(#fff 0 0)` layers sized `100% 14px` at a given `y`, over two `repeating-linear-gradient` grids at 64px pitch; parks are rounded `div`s. Keep `touch-action:none` on `body` so the browser does not steal the vertical drag.

Common mistakes: making the whole sheet the drag surface (then the list cannot scroll); animating `top` or `height`; forgetting `setPointerCapture` so fast drags drop the sheet; letting the scrim intercept taps at half; not removing the transition during drag (the sheet lags the finger by 480ms).

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
