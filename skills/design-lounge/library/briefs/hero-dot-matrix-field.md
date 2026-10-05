<!-- Design Lounge Nº 226 · "Dot-matrix blob field hero" · www.designlounge.live -->

# Dot-matrix blob field hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from lamalama.com: the agency hero where a halftone dot screen covers the whole viewport and organic black blobs eat into it, with a heavy caps headline bottom-left, bracketed mono labels, and a footer strip with a live clock. This rebuild is for **Hollowmill**, a fictional Lisbon studio for moving brands. There is no video under the dots. A canvas draws a staggered grid of square dots, and a metaball field of 16 slowly drifting blobs decides each dot's size and colour. Inside a blob there is no dot (black). At the rim, dots are full size and signal orange. Far from blobs, dots are small and cool grey. The pointer is one more blob, so moving it pushes a hole through the screen, and a click drops a seed blob that swells and fades over 2.6s. The detail worth copying is the colour bucketing: dots go into six `Path2D` batches by colour, so a 1280×800 frame is six `fill()` calls, not 12,000.

## Structure

```
1280 × 800, overflow hidden; canvas fixed full-bleed under everything
┌──────────────────────────────────────────────────────────────────────┐
│ ▣ [ STUDIO FOR MOVING BRANDS ]       WORK  STUDIO  JOURNAL [START A BRIEF ↗]│ top 24
│        ●●●  dot field ●●●   ( MOVE TO STIR · CLICK TO SEED )             │ top 96
│   ◯ blob      ◯ blob          ◯                                         │
│        ◯            ◯ blob            ◯                                 │
│ [ HOLLOWMILL / EST. 2014 ]                                              │
│ WE MAKE BRANDS                           Identity, motion and …   300w  │
│ THAT REFUSE TO               84px/.86    [ SEE THE REEL ↗ ]             │
│ SIT STILL.                                                              │ bottom 84
│─────────────────────────────────────────────────────────────────────────│
│ 17 RESTLESS MAKERS   LISBON, PT     [ ■ 14 : 02 : 37 ]      ▭ HOLD FIELD│ 56px
└──────────────────────────────────────────────────────────────────────┘
```

- `canvas#field` is `aria-hidden`, `position: fixed; inset: 0`, `cursor: crosshair`. It is sized to the viewport × devicePixelRatio (capped at 2).
- `div.scrim` is a fixed gradient over the canvas with `pointer-events: none`.
- `header.top` holds `a.mark` and `nav.links[aria-label=Main]`, including `a.brief`.
- `main.hero` is a two-column grid (`1fr 300px`, gap 40px, `align-items: end`) with the kicker, `h1`, and `.side` (paragraph and link).
- `footer.foot` is a four-column grid with the clock span (`aria-label="Local studio time"`) and `button#pause[aria-pressed]`.

## Motion

| Thing | Trigger | Property | From → to | Timing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Blob drift | rAF loop (32ms floor) | centre x, y | `base ± sin/cos(t·speed + phase)·(.06W, .07H)` | continuous | still frame |
| Blob breathe | loop | radius | ×(1 ± .12), `sin(t·.0004 + phase)` | continuous | still |
| Pointer blob | pointermove / leave | radius | 0 ↔ 7% min(W,H), lerp .12 per frame | ~300ms settle | jumps, redraws on move |
| Seed | pointerdown on canvas | radius | `sin(k·π)·11% min(W,H)`, k = age/2600 | 2600ms | full size, stays |
| Clock square | loop | opacity | 1 → .2 | 1s steps(2) | static |
| Brief button | hover | background | mist → signal | 160ms `--ease` | instant |
| Hold toggle knob | click | translateX | 0 → 9px | 160ms `--ease` | instant |

Clamp the frame delta to 64ms so a background tab does not jump the seeds when it returns.

## States

- "START A BRIEF" resting: mist fill, ink text. Hover: signal fill.
- "SEE THE REEL" resting: 1px `--line` border. Hover: mist border.
- Nav links resting: `--mist-2`. Hover: `--mist`.
- "HOLD FIELD" off: knob left, `--mist-2`. On: knob right, `--mist`, `aria-pressed="true"`, field frozen.
- Focus-visible: 2px signal outline, 3px offset, square corners.
- No loading state. Draw the first frame synchronously on load, at a fixed time offset (12000ms) and with a seeded random, so the composition is always the same.
- Canvas unsupported: the scrim and the page colour still show a finished, dark hero.

## Accessibility

- The canvas is `aria-hidden`. It holds no content. All copy is real HTML above it.
- The field moves on its own, so "HOLD FIELD" is a real `button` with `aria-pressed`. It meets WCAG 2.2.2 for movement over 5 seconds. Reduced motion stops the loop entirely.
- Small text over the field sits on a 72% dark panel. Mono 11px mist-2 on that panel clears 4.5:1.
- Contrast: mist `#DCE3E6` on `#0D1013` is about 15:1. Signal orange is decorative except the full stop.
- The clock has `aria-label="Local studio time"`. The brackets and square are `aria-hidden`. Do not make it a live region, because it would announce every second.
- Tab order: mark, Work, Studio, Journal, Start a brief, See the reel, Hold field. Targets are 40px tall.

## Responsive rules

- ≥1280: as specified.
- ≤1000: the headline is 60px, the hero is one column (paragraph max 420px), and the nav text links hide (keep "START A BRIEF").
- ≤560: `--pad` is 16px, the headline 40px, the hero 72px above the bottom, the paragraph 15px. The footer shows only "17 RESTLESS MAKERS" and "HOLD FIELD". The hint and the mark label hide.
- The field adapts by itself. Blob radius scales with `min(W,H) × .62`, positions are fractions of W and H, and the grid recomputes on resize.
- Keep the 9px pitch at every size. Do not scale the dots with the viewport.

## Acceptance checklist

### Always

- [ ] A full-bleed canvas dot grid, with odd rows offset by half a pitch.
- [ ] Dot size and colour come from a metaball field. Dots inside a blob (`v > 1`) are skipped, and dots near the rim (`v > .82`) use the accent.
- [ ] Dots go into colour buckets and draw with one `fill()` per bucket.
- [ ] The pointer acts as an extra blob, and a click seeds a blob that swells and closes.
- [ ] A visible pause control with `aria-pressed` freezes the drift.
- [ ] The loop stops when the tab is hidden. Reduced motion draws a still frame and redraws only on input.
- [ ] The headline and copy are HTML over a bottom scrim, never drawn in the canvas.
- [ ] There is a live clock in the footer strip, and it is not announced every second.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] The page is `#0D1013`, the rim dots `#FF5A1F`, the far dots `#22313A` → `#DCE3E6` across five buckets.
- [ ] The pitch is 9px and the max dot 3.6px, with 16 seeded blobs.
- [ ] The headline is "WE MAKE BRANDS / THAT REFUSE TO / SIT STILL." in Familjen Grotesk 700 at 84px, with an orange full stop.
- [ ] Labels are in JetBrains Mono 11px caps: "[ STUDIO FOR MOVING BRANDS ]" and "[ HOLLOWMILL / EST. 2014 ]".
- [ ] The footer reads "17 RESTLESS MAKERS · LISBON, PT · [ ■ hh : mm : ss ] · HOLD FIELD", with the clock in Europe/Lisbon time.
- [ ] A seed lasts 2600ms and peaks at 11% of `min(W,H)`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: a blue-black page `#0D1013` covered by a staggered square-dot grid (9px pitch, odd rows offset 4.5px). Organic black shapes sit across the upper two-thirds, each outlined by a ring of orange dots. A vertical scrim darkens the bottom 40% so the headline reads.
2. Top bar at 24px from the top and 32px from the sides: a pixel "H" mark and "[ STUDIO FOR MOVING BRANDS ]" on a dark panel at left. At right, Work, Studio, Journal on a dark panel, then a mist-filled "START A BRIEF ↗" button.
3. The hint "( MOVE TO STIR · CLICK TO SEED )" sits at right, 96px from the top.
4. The hero block is 84px above the bottom. At left: the kicker "[ HOLLOWMILL / EST. 2014 ]" and the 84px caps headline "WE MAKE BRANDS / THAT REFUSE TO / SIT STILL." with an orange full stop. At right, in a 300px column: a 17px paragraph and an outlined "SEE THE REEL ↗" button.
5. Footer strip, 56px tall, with a hairline top and four columns: "17 RESTLESS MAKERS", "LISBON, PT", "[ ■ 14 : 02 : 37 ]" (a live clock in Europe/Lisbon time with a blinking orange square), and a "HOLD FIELD" toggle.
6. The field animates at about 30fps. Each blob drifts on sine and cosine paths (±6% of width, ±7% of height) and breathes ±12% in radius.
7. Pointer move: a pointer blob grows toward 7% of `min(W,H)` with a lerp of 0.12 per frame. Leaving the window shrinks it to 0.
8. Click or tap on the field: a seed blob appears at the point. Its radius follows `sin(progress × π) × 11% of min(W,H)` over 2600ms, so it swells and closes again. At most six seeds exist at once.
9. "HOLD FIELD" (`aria-pressed`) freezes the drift. The pointer and clicks still redraw a still frame.
10. The loop stops when the tab is hidden.
11. Reduced motion: one still frame. The pointer still carves its hole by redrawing on move. Clicks stamp a seed at full size that stays. No blinking clock square, no transitions.

## Tokens

```css
:root {
  --bg: #0D1013;                      /* page, blob interiors */
  --mist: #DCE3E6;                    /* headline, body, button fill */
  --mist-2: #8C979C;                  /* mono labels, inactive links */
  --line: rgba(220,227,230,.18);      /* footer rule, outlined button */
  --signal: #FF5A1F;                  /* blob rim dots, full stop, focus, clock square */
  --teal: #2A6F7A;                    /* low-mid dot bucket */
  --panel: rgba(13,16,19,.72);        /* behind small text over the field */
  --sans: "Familjen Grotesk", system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --pad: 32px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  /* field (JS constants) */
  --dot-step: 9px;  --dot-max: 3.6px;
  --dot-buckets: #22313A, #2A6F7A, #5E8E92, #A7B9BC, #DCE3E6, #FF5A1F;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Headline | Familjen Grotesk | 84px | 700 | 0.86 | −0.03em | Upper |
| Side paragraph | Familjen Grotesk | 17px | 400 | 1.4 | 0 | Sentence |
| Mono labels, nav, footer, buttons | JetBrains Mono | 11px | 400 | 1 | 0.08em | Upper |

Bracket the labels with literal square brackets and spaces: "[ LABEL ]". Wrap hints in round brackets.

## Implementation notes

**1. One pass, six paths.** Sum the field per dot, skip interiors, and push a rect into its colour bucket. Then fill each bucket once.

```js
const paths = COLORS.map(() => new Path2D());
for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
  const x = i * STEP + (j & 1 ? STEP / 2 : 0), y = j * STEP;
  let v = 0;
  for (const b of B) { const dx = x - b.x, dy = y - b.y; v += b.rr / (dx*dx + dy*dy + 1); }
  if (v > 1) continue;                               // inside a blob: black
  const e = Math.pow(v, .55), s = DOT * (.18 + e * .82);
  const c = v > .82 ? 5 : Math.min(4, Math.floor(e * 5.2));
  paths[c].rect(x - s / 2, y - s / 2, s, s);
}
ctx.clearRect(0, 0, W, H);
paths.forEach((p, i) => { ctx.fillStyle = COLORS[i]; ctx.fill(p); });
```

**2. Keep time yourself.** Use an accumulated clock `T += min(64, now - last)` instead of `performance.now()`. The first frame can then be drawn at T = 12000 before the loop starts, and pausing really freezes the composition.

**3. Seeded blobs.** Lay the 16 blobs out on a jittered 4×4 grid with a Park–Miller PRNG (`seed = seed * 16807 % 2147483647`), so they cover the frame evenly and the first frame is the same on every load.

Common mistakes:

- Setting `fillStyle` and calling `fill` per dot. It drops to single-digit fps at 1280 wide.
- Running the loop at 60fps. 30fps is enough for this drift and halves the cost.
- Drawing the canvas at CSS pixels on a retina screen. Scale by `devicePixelRatio` (cap 2) and `setTransform`.
- Blobs so large they merge into one mass. Keep the radius scale near `min(W,H) × .62 × (.07–.14)`.
- Putting the headline over the busiest part of the field with no scrim.
- Announcing the clock with `aria-live`.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
