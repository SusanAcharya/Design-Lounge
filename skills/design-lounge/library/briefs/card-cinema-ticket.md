<!-- Design Lounge Nº 192 · "Cinema ticket with tear-off stub" · designlounge.vercel.app -->

# Cinema ticket with tear-off stub

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A single cinema ticket for a fictional art deco picture house, the Marlowe Picture House, est. 1931. It lies on an oxblood velvet stage under a warm spotlight. The left part is the ticket: house name, a poster panel with a gold sunburst and the film title "The Lantern at Low Tide" in Limelight, and a row of facts (date, doors, screen, fare). The right part is a 180px stub with "Admit one", row F, seat 14 and serial Nº 031742, joined to the ticket by a dotted perforation with two semicircle notches. The user grabs the stub and pulls it away. It hinges open from the top, and once pulled far enough it tears: both edges go ragged, the stub drops a little to the side and stays as a keepsake, and a red double-ruled "Admitted" stamp lands on the ticket. The detail worth copying is that the tear happens on release, not on threshold, so a hesitant pull snaps back.

## Structure

```
1280 × 800, body grid centred, gap 28px
  eyebrow 13px, tracked .32em, gold
  .fit  width min(854px, 100%), height = 340 × k
  ┌────────────────────────────── 520 ──────────────────────────╮╭── 180 ──────┐
  │ MARLOWE PICTURE HOUSE                            EST. 1931   ○  RETAIN THIS │
  │ ─────────────────────────────────────────────────────────── │  ADMIT ONE  │
  │ ╔═══════════════════ poster (double rule) ═════════════════╗ :             │
  │ ║      A picture in eleven reels   (sunburst behind)        ║ :  ROW  SEAT  │
  │ ║          THE LANTERN / AT / LOW TIDE  42px                ║ :  F    14    │
  │ ║          VERA HALLORAN · TEODOR WYNN                      ║ :             │
  │ ╚═══════════════════════════════════════════════════════════╝ :  Nº 031742  │
  │ DATE          │ DOORS    │ SCREEN │ FARE                      :  Screen Two  │
  │ Sat 17 Oct    │ 7:40 pm  │ Two    │ £9.50 · Stalls           ○              │
  └──────────────────────────────────────────────────────────────╯╰─────────────┘
  caption row (hint + Reprint), min-height 44px
```

- `.fit` is a sized box. `.ticket` inside is `position: absolute`, 700 × 340, `transform: scale(k)` with `transform-origin: 0 0`. `k = min(1.22 on wide screens, fit width / 700)`. Absolute positioning keeps the unscaled 700px out of layout so nothing overflows at 375px.
- `.main` is an `article` labelled "Cinema ticket, The Lantern at Low Tide". Inside: `.house` row, `.poster` with an `h1`, and a `dl.facts` of four pairs.
- `.stub` is a `button` (it is the control), absolutely placed at left 520px. It holds "Admit one", a `dl` for row and seat, and the serial.
- `.stub-ring` is a sibling span that draws the focus ring, because the stub's own outline is clipped by its mask.
- A visually hidden `p[aria-live=polite]` announces progress and the tear.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing |
| --- | --- | --- | --- | --- |
| Stub hinge | pointer move / arrows | transform | `rotate(0)` → `translateX(6px) rotate(12deg)` | follows pointer, no transition |
| Stub snap back | release with p < 1 | transform | current → none | 420ms expo out |
| Stub keep | tear | transform | none → `translate(48px,34px) rotate(7deg)` | 640ms expo out |
| Ragged edges | tear | clip-path | none → polygon | instant |
| Stamp | tear | opacity, transform | 0, scale 1.6 → .85, scale 1 | 160ms / 320ms expo out, 260ms delay |
| Reprint | click | all of the above | end → start | same durations |

Reduced motion: all transitions removed. The hinge still follows the pointer because it is direct manipulation, not animation.

## States

- Stub resting: `cursor: grab`. Dragging: `cursor: grabbing`, transitions off (`.dragging`).
- Stub focus-visible: a 2px `--gold` ring 6px outside the stub (`.stub-ring`), because the mask clips a normal outline.
- Partially pulled: hinge angle shows progress; live region says "Tear 50 percent".
- Torn: `.is-torn` on the ticket. Stub `disabled`, `aria-label` "Stub torn and kept, row F seat 14", cursor default. Stamp visible. Reprint button visible.
- Reprint hover: background `rgba(184,134,47,.18)`.
- There is no error state. A tear is final until Reprint.

## Accessibility

- The stub is a real `button` with `aria-label="Ticket stub, row F seat 14. Drag or press Enter to tear"` and `aria-describedby` pointing at the hint.
- Keys: ArrowRight / ArrowDown nudge 25%, ArrowLeft / ArrowUp / Escape reset, Enter / Space tear. Arrows call `preventDefault` so the page does not scroll.
- Live region (polite): "Tear 25 percent", "Ticket torn. Admitted.", "Fresh ticket printed."
- Focus moves to Reprint after a tear and back to the stub after reprint, so keyboard users never land on a disabled control.
- Contrast: `--ink` on `--paper` is 13:1. `--print` on `--paper` is 6.4:1. `--ink-2` labels are 7:1. The caption `#e2cfa8` on `--stage` is 9:1.
- Reprint button is 40px tall. The stub is 180 × 340 at scale 1.

## Responsive rules

- ≥1280: scale 1.22.
- 1024: the 854px cap still fits; scale 1.22.
- 768: scale = (768 − 32) / 700 ≈ 1.05, capped at 1 below 1000px wide.
- <640: scale = width / 700 (0.49 at 375). Still legible because the ticket is one object. Do not restack the stub under the ticket: the perforation is vertical by design.
- Body is `overflow: hidden`. The kept stub may poke past the edge at 375. That is fine; it never causes horizontal scroll because the ticket is absolutely positioned.

## Acceptance checklist

### Always

- [ ] One ticket, one stub, joined by a vertical perforation with two 14px semicircle notches cut through the paper (mask, not painted circles).
- [ ] Drag hinges the stub around its bottom-left corner. Release below threshold snaps back.
- [ ] Tear happens only on release at full progress, or on Enter / Space, or after four arrow presses.
- [ ] After a tear both edges are ragged and the stub is kept beside the ticket, not removed.
- [ ] A stamp confirms admission. A Reprint control restores the start state.
- [ ] Stub is a focusable button with a visible ring. Focus moves sensibly after tear and reprint.
- [ ] Live region announces progress and tear.
- [ ] No horizontal scroll at 375px.
- [ ] Reduced motion removes transitions but keeps the drag preview.

### This demo

- [ ] House "Marlowe Picture House · Est. 1931", film "The Lantern at Low Tide", cast "Vera Halloran · Teodor Wynn".
- [ ] Facts: Sat 17 Oct · 7:40 pm · Two · £9.50 · Stalls. Stub: Row F, Seat 14, Nº 031742.
- [ ] Ticket is 700 × 340, main 520px, stub 180px, scale 1.22 at 1280.
- [ ] Stamp reads "Admitted / Usher 07 · 7:32 pm" in `#9c2a22`, rotated −11°.
- [ ] Progress formula uses 150px and halves the vertical component.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the ticket is whole and centred, 700 × 340 at scale 1.22 on a 1280 frame (854 × 415 on screen). Above it, the eyebrow "Tonight in the Gilt Room". Below, the hint "Pull the stub away to tear it · → nudges · Enter tears".
2. Pointer down on the stub captures the pointer. Moving right or down opens the stub. Progress `p = (max(0, dx) + max(0, dy) × 0.5) / 150`, clamped 0–1, with `dx`/`dy` divided by the current scale.
3. While dragging, the stub's transform is `translateX(p × 6px) rotate(p × 12deg)` with `transform-origin: 0 100%` (bottom of the perforation). The gap opens at the top first, as paper does. No transition while dragging.
4. Release with `p < 1`: the stub springs back to 0 over 420ms on expo out.
5. Release with `p ≥ 1`: tear. Both the ticket's right edge and the stub's left edge get a ragged `clip-path` polygon (a point every 10px, inset 3–10px from the line, seeded so it is the same every time). The stub moves to `translate(48px, 34px) rotate(7deg)` over 640ms expo out and is disabled.
6. On tear, the "Admitted" stamp fades from 0 to 0.85 opacity and settles from `rotate(-11deg) scale(1.6)` to `scale(1)` over 320ms expo out, 260ms after the tear.
7. On tear, the hint changes to "Stub kept. Enjoy the picture." and a "Reprint ticket" button appears and takes focus.
8. Reprint: clip-paths clear, stamp fades out, stub returns to the perforation, the stub is enabled and focused again.
9. Keyboard on the stub: ArrowRight or ArrowDown adds 0.25 to `p` (four presses tear). ArrowLeft, ArrowUp or Escape resets to 0. Enter or Space tears at once.
10. Reduced motion: no transitions. Drag still previews the hinge (it follows the finger), tear and reprint jump to their end states.

## Tokens

```css
:root {
  --stage: #3b1418;        /* velvet, top */
  --stage-2: #24090c;      /* velvet, bottom */
  --paper: #f2e4c4;        /* ticket stock */
  --paper-2: #e8d5ab;
  --ink: #2b1b14;          /* black print */
  --ink-2: #5a4334;        /* labels */
  --print: #9c2a22;        /* second print colour: title, stamp, serial */
  --gold: #b8862f;         /* sunburst, focus, button rule */
  --chalk: #f6ead0;        /* text on the stage */
  --display: "Limelight", Georgia, serif;
  --text: "Spectral", Georgia, serif;
  --notch: 14px;           /* notch radius */
  --perf-dot: 2.6px;       /* perforation hole radius, 13px pitch */
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --t-spring: 420ms;
  --t-tear: 640ms;
  --t-stamp: 320ms;
}
```

Stage background: a radial warm spot `rgba(255,196,120,.16)` at 50% 42%, a vertical curtain stripe (`repeating-linear-gradient(90deg, …)` with a 92px period), over a `--stage → --stage-2` gradient.

## Typography

| Role | Family | Size | Weight | Tracking | Case / colour |
| --- | --- | --- | --- | --- | --- |
| Eyebrow | Spectral | 13px | 400 | .32em | upper, `#d9b97a` |
| House row | Spectral | 11px | 400 | .28em | upper, `--print` |
| Tagline | Spectral italic | 13px | 400 | 0 | `--ink-2` |
| Film title | Limelight | 42px / 0.95 | 400 | .02em | upper, `--print` |
| Title "at" | Limelight | 20px | 400 | .3em | upper, `--ink` |
| Cast | Spectral | 11px | 400 | .24em | upper, `--ink-2` |
| Fact label | Spectral | 10px | 400 | .24em | upper, `--ink-2` |
| Fact value | Spectral | 19px / 1.2 | 600 | 0 | lining numerals |
| Admit one | Limelight | 26px | 400 | .06em | upper, `--print` |
| Row / seat | Limelight | 40px | 400 | 0 | `--ink` |
| Serial | Spectral | 15px | 600 | .14em | `--print`, tabular |
| Stamp | Limelight | 24px | 400 | .12em | upper, `--print`, multiply |

Limelight is the period poster face. Use it only for the title, "Admit one", the seat and the stamp. Everything else is Spectral.

## Implementation notes

Notches are cut with two half-height masks per part. The ticket gets circles on its right corners, the stub on its left:

```css
.main {
  mask:
    radial-gradient(circle at 100% 0,    #0000 14px, #000 14.5px) top    / 100% 51% no-repeat,
    radial-gradient(circle at 100% 100%, #0000 14px, #000 14.5px) bottom / 100% 51% no-repeat;
}
.stub { /* same with 0 0 and 0 100% */ transform-origin: 0 100%; touch-action: none; }
.ticket { filter: drop-shadow(0 18px 24px rgba(0,0,0,.45)); } /* shadow follows the mask */
```

Use `drop-shadow` on the parent, not `box-shadow` on the parts, or the shadow ignores the notches and the ragged edge.

The tear polygon is seeded so it is stable:

```js
function jag(side) {
  const pts = []; let s = 7;
  for (let y = 0; y <= 340; y += 10) { s = (s * 9301 + 49297) % 233280; pts.push(3 + (s / 233280) * 7, y); }
  return side === 'main'
    ? 'polygon(0 0,' + pts.reduce((a, v, i) => i % 2 ? a : a + `${520 - pts[i]}px ${pts[i + 1]}px,`, '') + '0 340px)'
    : 'polygon(' + pts.reduce((a, v, i) => i % 2 ? a : a + `${pts[i] - 3}px ${pts[i + 1]}px,`, '') + '180px 340px,180px 0)';
}
```

Both parts use the same seed, so the edges are complementary.

Drag maths must undo the scale, or the stub tears twice as fast on a small screen:

```js
stub.addEventListener('pointerdown', e => { start = { x: e.clientX, y: e.clientY }; stub.setPointerCapture(e.pointerId); });
stub.addEventListener('pointermove', e => {
  if (!start) return;
  const dx = (e.clientX - start.x) / k, dy = (e.clientY - start.y) / k;
  show((Math.max(0, dx) + Math.max(0, dy) * 0.5) / 150);
});
stub.addEventListener('click', e => { if (e.detail === 0) tear(); }); // keyboard Enter / Space only
```

Common mistakes:

- Tearing as soon as progress hits 1 mid-drag. The user loses the chance to change their mind.
- Removing the stub from the DOM after the tear. Keep it; it is the souvenir.
- Painting the notches as stage-coloured circles. The stage is a gradient, so they show.
- Setting the poster title in a generic display sans. The piece is the period face.
- Letting the inline `transform` from the drag override the torn-state class. Clear it before adding `.is-torn`.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
