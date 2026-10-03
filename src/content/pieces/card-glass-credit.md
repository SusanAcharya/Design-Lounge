---
title: "Glass credit card with flip"
summary: "A frosted-glass payment card that tilts to the pointer with a moving holographic edge, flips to a back with a hold-to-reveal CVV, and switches between three cards."
platform: web
type: component
category: cards
tags: [cards, payments, wallet, tilt, flip]
styles: [glass, dark, luxe]
motion: rich
difficulty: 3
featured: false
published: 2026-10-03
palette: ["#0B1513", "#EEF2EC", "#C9733F", "#2FA39A", "#E8D9B5"]
fonts: ["Unbounded", "Sometype Mono"]
related: [card-holo-foil, card-flip-3d, hover-tilt-cards]
---

# Glass credit card with flip

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The card view of a wallet app for a fictional bank, "Vantor". One 470px card made of frosted glass floats over three crisp shapes: a copper disc, a teal ring, and a sand slab. The glass blurs them, so the card reads as a real pane. It tilts up to 12° toward the pointer, a thin holographic band runs around its edge and rotates to face the pointer, and a soft glare follows. A flip shows the back with a magnetic stripe, a signature strip, and a CVV that stays masked unless you hold a button. A three-tab switcher swaps cards; the shapes behind the glass slide and recolour so every card has its own light. The detail worth copying is that the glass is real `backdrop-filter`, and the background shapes are crisp, not glowing blobs, so the blur has something to show.

## Reference behaviour

1. First frame: the Everyday card, front side, resting at rotateX 6° and rotateY −12° so it already looks dimensional. The copper disc is behind its upper left, the teal ring behind its lower right.
2. Move the pointer anywhere on the page: the card eases toward rotateX `−cy × 12°`, rotateY `cx × 14°`, where `cx`, `cy` are the pointer position relative to the card centre, clamped to −1…1. Easing is a lerp of 0.12 per frame; the loop stops when it settles.
3. The glare (`radial-gradient` at the pointer, soft-light) and the holographic edge band (`conic-gradient` whose start angle is the pointer's angle from the card centre plus 30°) follow the pointer.
4. Pointer leaves the document: the card eases back to the resting tilt.
5. Click the card, press Enter or Space on it, or press "Show back": the card flips 180° about Y in 700ms with a quartic ease-out. At 90° the front content is swapped for the back content, which is mirrored back to read correctly. The button text becomes "Show front".
6. Back side: a 46px dark stripe 26px from the top, a striped signature panel with "Anika Rai" in italic mono, a white CVV box showing "•••", and a 40px pill "Hold to reveal CVV" with a 28px progress ring.
7. Press and hold the pill (pointer or Space/Enter): the ring fills over 500ms and the label reads "Keep holding…". When full, the CVV shows "382" and the label reads "Release to hide". Releasing, leaving, cancelling, or blurring masks it again immediately. Clicking the pill does not flip the card.
8. Arrow keys on the focused card nudge the tilt 4° per press, within ±12° / ±14°.
9. Pick "Travel" or "Vault" in the switcher (or ArrowLeft/ArrowRight between tabs): the card fades and drops 24px in 300ms, the body theme changes, the shapes slide to new positions and colours over 700ms, then the new card fades up. The back resets to the front. The balance line under the flip button changes.
10. Reduced motion: no tilt, the flip is an instant swap, the CVV reveals without the ring delay, the switch is instant.

## Structure

```
1280 × 800, page #0b1513, single centred column, gap 28px
                     VANTOR · WALLET            11px mono, 0.18em
                  Your cards · 3 active         Unbounded 22px
        ◯ copper disc           ▭ sand slab
          ┌──────────────────────────────────┐
          │ vantor EVERYDAY             )))  │  470 × 296 (ratio 1.586)
          │ [chip]                            │  radius 20px, blur 22px
          │                                   │  1.5px holographic edge
          │ •••• •••• ••••  4821              │
          │ CARD HOLDER  VALID THRU     ≡     │
          │ ANIKA RAI    09/29                │
          └──────────────────────────────────┘
                                 ◎ teal ring
                     ( ⟳ Show back )            40px pill
               Available NPR 84,210.50
      ┌──────────────────────────────────────────────┐
      │ [▭] Everyday ··4821 │ [▭] Travel ··0937 │ [▭] Vault ··5560 │  tablist
      └──────────────────────────────────────────────┘
```

- `main.wrap` (flex column, `overflow-x: clip` so the shapes never cause sideways scroll).
- `header.head`: kicker and `h1`.
- `.stage`: `width: 470px; aspect-ratio: 1.586`, `position: relative`. Inside: three `i.sh` shapes (decorative) and `div.card[role=group][tabindex=0][aria-roledescription="payment card"]`.
- `.card` holds `.face.front-f` and `.face.back-f`. Only one is displayed at a time; the back is mirrored with `scaleX(-1)` while the card is past 90°.
- `.ctrls`: the flip `button`, a polite balance paragraph, and `div[role=tablist]` with three `button[role=tab]`, each with a 36×24 mini card swatch, a name, and the last four digits.
- One visually hidden `p[role=status]`.

Cards:

| Tab | Type | Last 4 | Expiry | CVV | Balance line | Shapes s1 / s2 / s3 |
|-----|------|--------|--------|-----|--------------|---------------------|
| Everyday | debit | 4821 | 09/29 | 382 | Available NPR 84,210.50 | `#c9733f` / `#2fa39a` / `#e8d9b5` |
| Travel | credit | 0937 | 03/28 | 715 | Limit left USD 2,640.00 · no FX fee | `#f07457` / `#1f6fb2` / `#f2e3c6` |
| Vault | credit | 5560 | 11/30 | 049 | Limit left NPR 412,000.00 · metal | `#d9b45a` / `#3a4340` / `#ede6d6` |

## Tokens

```css
:root {
  /* colour */
  --bg: #0b1513;                     /* deep green-black page */
  --text: #eef2ec;                   /* all card text */
  --text-2: #a9b8b1;                 /* kicker, captions, inactive tabs */
  --line: rgba(238,242,236,.14);     /* pill and tablist borders */
  --s1: #c9733f;                     /* shape: disc */
  --s2: #2fa39a;                     /* shape: ring */
  --s3: #e8d9b5;                     /* shape: slab, focus ring, CVV progress */
  --tint: rgba(240,246,242,.10);     /* glass body tint, per card */

  /* type */
  --disp: "Unbounded", system-ui, sans-serif;
  --mono: "Sometype Mono", ui-monospace, monospace;

  /* geometry */
  --cw: 470px;                       /* card width; height from aspect-ratio 1.586 */
  --r-card: 20px; --r-pill: 999px; --r-tabs: 16px; --r-tab: 11px;
  --blur: 22px;

  /* space: 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 14px; --s-4: 18px; --s-5: 24px; --s-6: 28px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-flip: 700ms;    /* JS-driven, ease-out quart */
  --t-swap: 300ms;    /* card out / in */
  --t-shapes: 700ms;  /* background shapes move and recolour */
  --t-hold: 500ms;    /* CVV hold */
  --lerp: .12;        /* tilt smoothing per frame */
}
body[data-c="1"] { --s1: #f07457; --s2: #1f6fb2; --s3: #f2e3c6; --tint: rgba(236,244,255,.10); }
body[data-c="2"] { --s1: #d9b45a; --s2: #3a4340; --s3: #ede6d6; --tint: rgba(20,22,21,.28); }
```

Glass recipe: `background: linear-gradient(135deg, rgba(255,255,255,.16), rgba(255,255,255,.04)), var(--tint); backdrop-filter: blur(22px) saturate(1.5); box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 30px 60px -20px rgba(0,0,0,.55)`. Text on glass gets `text-shadow: 0 1px 3px rgba(5,10,9,.35)`.

## Typography

| Role | Family | Size | Weight | Tracking | Case |
|------|--------|-----:|-------:|---------:|------|
| Kicker | Sometype Mono | 11px | 400 | 0.18em | UPPER |
| Page title | Unbounded | 22px | 600 (suffix 400 in `--text-2`) | -0.01em | sentence |
| Card wordmark "vantor" | Unbounded | 20px | 700 | -0.02em | lower |
| Card kind | Sometype Mono | 10px | 400 | 0.16em | UPPER, 85% opacity |
| Card number | Sometype Mono | 21px | 500 | 0.12em | numerals, masked groups 75% |
| Field caption | Sometype Mono | 9px | 400 | 0.18em | UPPER, 75% |
| Field value | Sometype Mono | 13px | 400 | 0.06em | UPPER |
| CVV | Sometype Mono | 16px | 500 | 0.14em | numerals |
| Tab name | Unbounded | 12px | 600 | 0 | Title |
| Tab digits, balance | Sometype Mono | 11–12px | 400 / 500 | 0.04–0.06em | as written |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Card tilt | pointer move / arrows | rotateX, rotateY | current → target (±12°, ±14°) | per-frame lerp 0.12 | lerp | off |
| Glare | pointer move | gradient centre | follows pointer | immediate | – | static at 30% 20% |
| Edge band | pointer move | conic start angle | follows pointer angle + 30° | immediate | – | static 210° |
| Flip | click, Enter, Space, button | rotateY offset | 0 → 180° (and back) | 700ms | `1 − (1 − t)^4` | instant swap |
| Face swap | flip passes 90° | display | front ↔ back | – | – | same |
| Card switch | tab | opacity, translate | 1, 0 → 0, 24px → 1, 0 | 300ms each way | `--ease` | instant |
| Shapes | tab | transform, colour | per theme | 700ms | `--expo` / `--ease` | instant |
| CVV ring | hold | stroke-dashoffset | 69.1 → 0 | 500ms | linear | skipped |

Perspective is inside the transform (`perspective(1200px) rotateX() rotateY()`), not on a parent, so no `preserve-3d` is needed and `backdrop-filter` keeps working.

## States

- **Resting:** tilt 6° / −12°, front visible.
- **Tilting:** follows the pointer; edge band and glare track it.
- **Flipped (`.flipped`):** back visible and mirrored; flip button reads "Show front"; tilt Y target inverts so the motion still follows the pointer.
- **Holding:** pill `.holding`, ring filling, "Keep holding…".
- **Revealed:** CVV digits shown, "Release to hide". Any release masks.
- **Switching (`.out`):** card faded and 24px lower.
- **Tab selected:** `aria-selected="true"`, `rgba(255,255,255,.1)` fill, full-white text. Others `--text-2`; hover lifts them to `--text`.
- **Focus-visible:** 2px `--s3` outline, 3px offset; on the card the offset is 6px so it clears the edge band.
- **Disabled / frozen card (not drawn):** drop the tint to `rgba(20,22,21,.5)`, desaturate the shapes, and replace the hold pill with "Card frozen" text.

## Accessibility

- The card is `role="group"` with `aria-roledescription="payment card"` and a label that changes: "Everyday debit card ending 4821, front. Press Enter to flip." It is focusable; Enter and Space flip; arrows tilt.
- The full number is never in the DOM. The masked groups are `aria-hidden`; the label carries the last four.
- The CVV box is `aria-live="polite"` and its `aria-label` switches between "Security code hidden" and "Security code 3 8 2" (spaced digits).
- The hold pill is a real `button` with `aria-describedby` hint "Press and hold. The code hides again when you let go." It works with pointer (with pointer capture) and with Space/Enter held (ignoring `repeat`).
- The switcher is a `tablist` with roving `tabindex`; ArrowLeft/Right/Up/Down move and select.
- A polite status region announces "Showing back of card" and "Travel card ending 0937 selected".
- Contrast: card text sits on blurred colour, so it gets a soft text-shadow and the glass a tint; check the lightest shape (sand) under the captions. `--text` on `--bg` 16:1, `--text-2` on `--bg` 8.6:1.
- Hit targets: flip pill 40px, hold pill 40px, tabs 48px.

## Responsive rules

- **≥ 1280:** card 470px.
- **1024 / 768:** unchanged; the column is narrow by design.
- **< 520 (check 375):** card 330px; card padding 16px 18px; chip 38×28; number 16px; wordmark 16px; back stripe 36px; fine print hidden; tablist stacks vertically at up to 330px wide.
- Touch devices: tilt ignores `pointerType === 'touch'`; the card rests at its default tilt.
- Shapes may overhang the stage; the wrapper clips horizontal overflow so the page never scrolls sideways.

## Acceptance checklist

### Always

- [ ] The glass is a real `backdrop-filter` over crisp background shapes, not a blurred image or glowing blobs.
- [ ] Tilt is clamped (±12° X, ±14° Y), smoothed, and stops its loop when settled.
- [ ] The edge band and the glare both follow the pointer.
- [ ] Flip works from click, Enter, Space, and a visible button, and swaps faces at 90°.
- [ ] The CVV is masked by default, reveals only while held, and re-masks on release, blur, or cancel.
- [ ] Holding uses pointer capture and keyboard keydown/keyup, ignoring key repeat.
- [ ] The switcher is a tablist with roving tabindex and arrow keys; switching resets to the front.
- [ ] The full card number never appears in the DOM.
- [ ] Reduced motion removes tilt and animation but keeps flip, reveal, and switch.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Card 470px, ratio 1.586, radius 20px, blur 22px.
- [ ] Everyday 4821 (09/29), Travel 0937 (03/28), Vault 5560 (11/30), holder Anika Rai.
- [ ] Hold time 500ms; CVVs 382, 715, 049.
- [ ] Page `#0b1513`; Everyday shapes copper `#c9733f`, teal `#2fa39a`, sand `#e8d9b5`.

## Implementation notes

**Holographic edge with a mask.** One pseudo-element, a 1.5px padding, and a mask that removes the content box:

```css
.card::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1.5px; pointer-events: none;
  background: conic-gradient(from var(--a, 210deg),
    rgba(255,255,255,.14) 0deg, #fbe3b5 30deg, #a8f0de 60deg, #f7b8c8 90deg,
    rgba(255,255,255,.14) 130deg 360deg);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
}
.card::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  mix-blend-mode: soft-light;
  background: radial-gradient(circle at var(--gx, 30%) var(--gy, 20%), rgba(255,255,255,.55), transparent 45%);
}
```

**One transform, flip included.** Keep tilt and flip in the same `rotateY` so no 3D context is needed:

```js
function apply() {
  card.style.setProperty('--rx', rx + 'deg');
  card.style.setProperty('--ry', (ry + flipA) + 'deg');   // flipA animates 0 ↔ 180
  card.classList.toggle('flipped', flipA > 90);            // .flipped .back-f { display:flex; transform: scaleX(-1) }
}
function loop() {
  rx += (trx - rx) * .12; ry += (try_ - ry) * .12;
  if (anim) { const t = Math.min(1, (performance.now() - anim.t0) / 700);
    flipA = anim.from + (anim.to - anim.from) * (1 - Math.pow(1 - t, 4)); if (t === 1) anim = null; }
  apply();
  if (anim || Math.abs(trx - rx) > .05 || Math.abs(try_ - ry) > .05) requestAnimationFrame(loop);
}
```

**Hold, don't click.**

```js
hold.addEventListener('pointerdown', e => { hold.setPointerCapture(e.pointerId); start(); });
hold.addEventListener('keydown', e => { if (!e.repeat && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); start(); } });
['pointerup', 'pointercancel', 'lostpointercapture', 'keyup', 'blur'].forEach(t => hold.addEventListener(t, stop));
function start() { hold.classList.add('holding'); timer = setTimeout(reveal, 500); }
function stop()  { clearTimeout(timer); hold.classList.remove('holding'); mask(); }
```

Common mistakes:

- Putting `backdrop-filter` inside a `transform-style: preserve-3d` tree. Chrome drops the blur. Use the single-element flip above.
- Glass over a flat dark page. With nothing behind it, the blur shows nothing and the card looks grey.
- Rainbow foil over the whole face. Here the colour lives on a 1.5px edge only.
- Showing the CVV on click and leaving it up.
- Rendering the full PAN in hidden text "for screen readers".
- Copying a real card network mark. The three bars are an invented mark.

Rebuild order:

1. Page, header, stage with three shapes.
2. Glass card front: wordmark, chip, number, fields, mark.
3. Edge band and glare from custom properties.
4. The rAF tilt loop with lerp and pointer mapping.
5. JS-driven flip with face swap at 90°.
6. Back face, hold-to-reveal with ring.
7. Tablist switcher with shape themes and the out/in swap.
8. Labels, live region, reduced motion, 520px breakpoint.
