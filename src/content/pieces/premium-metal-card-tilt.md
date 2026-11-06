---
title: "Premium metal card tilt"
summary: "A private-banking card in brushed titanium that tilts under your finger with a moving specular sweep, flips to a hold-to-reveal CVV, above a calm ledger."
platform: mobile-app
type: screen
category: cards
tags: [card, fintech, banking, drag, press, wallet]
styles: [luxe, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-11-06
palette: ["#ECE7DE", "#C6C2B9", "#2F2C29", "#24473B", "#F6F2EB"]
fonts: ["Gloock", "Lexend"]
related: [fintech-metal-card-landing, fintech-card-controls, card-glass-credit]
---

# Premium metal card tilt

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The card screen of Haldane & Wray, an invented private bank. One material does all the work: a pale brushed-titanium card (a four-stop pewter gradient with a stretched fractal-noise grain) whose specular sweep slides across the surface as you tilt it. Drag on the card and it leans up to 14° toward your finger in 3D and springs back on release; on a phone that grants motion access, the device's own tilt drives it. Tapping turns it over to the back, where the CVV stays masked until you press and hold. Below sits a quiet ledger on warm bone paper: available balance in Gloock, three controls (Freeze, Limits, PIN) and three recent lines. The palette avoids the black-and-gold cliché: bone, pewter, a dark graphite for engraving and one deep spruce green for the only active colour. The language is iOS 26-ish: 18px card radius, 28px sheets with a grabber, the iOS sheet curve.

## Reference behaviour

1. On load the card is flat, front up. At 300ms it makes a short showcase: it leans to (rx 3.5°, ry −9.8°), then at 950ms to (−2.1°, 8.4°), then at 1,600ms settles flat, so the sweep crosses the card once. Skipped under reduced motion.
2. **Drag** (pointer down on the card and move): the target tilt is `rx = −14° × (dy / halfHeight)` and `ry = 14° × (dx / halfWidth)`, both clamped to ±14°, measured from the card's centre. The card follows with a lerp of .14 per frame. The sweep band moves from `background-position-x: 50%` by `−4.2% per degree of ry`; a soft radial highlight moves with the tilt too. On release the target returns to 0.
3. **Tap** (pointer up after less than 6px of travel), Enter or Space: the card flips with `rotateY(180deg)` over 700ms (`cubic-bezier(.16,1,.3,1)`). The hint under the card becomes "Tap card to turn back" and a "Hold to show CVV" pill appears beside it.
4. **Hold to show CVV**: pressing (pointer or Space/Enter held) fills the pill with spruce from the left over 350ms; at 350ms the CVV changes from "•••" to "418". Releasing, leaving, cancelling or blurring masks it again immediately. Turning the card back to the front re-masks it.
5. **Arrow keys** on the focused card tilt it 7° in that direction; it returns flat 700ms after the last press.
6. **Device orientation**: on the first touch the demo asks for motion permission where the browser requires it; when granted, `beta` (around 45°) and `gamma` drive the tilt within ±30° of travel, except while dragging.
7. **Freeze** toggles: the tile turns spruce with label "Frozen" (`aria-pressed="true"`), the card desaturates slightly and an engraved "FROZEN" plate fades in on the front (300ms).
8. **Limits** opens a sheet: "Card limits", a note, four rows (Daily card spend £5,000, Cash withdrawals £500, Online and phone On, Travel: France, 4–9 Nov Noted) and a spruce Done button.
9. **PIN** opens a sheet: "Your PIN", the note "Shown only while you hold. Nobody from Haldane & Wray will ask for it.", "••••" at 44px, a dark "Hold to show PIN" button (reveals "7302" after 350ms) and an outlined Done.
10. Sheets close with Done, the scrim or Escape, and focus returns to the control that opened them.

## Structure

```
390 × 844 · .app padding 56 24 34, max-width 390, centred
┌──────────────────────────────────┐
│ 54px clear                       │
│ Haldane & Wray              (EV) │ 44px header, Gloock 20 + 11px caps, 40px avatar
│ PRIVATE CLIENT                   │
│ ┌──────────────────────────────┐ │ stage: perspective 900px, margin 16 −2 0
│ │ HALDANE & WRAY          ◯◯   │ │ card 346 × 216, radius 18
│ │ TITANIUM RESERVE             │ │
│ │ [chip] )))          [FROZEN] │ │ chip 44 × 34 at (22, 84)
│ │ 4471 0928 6603 4471          │ │ number 21px Gloock, bottom 52
│ │ ELEANOR VANCE     EXP 09/30  │ │ 11px caps, bottom 20
│ └──────────────────────────────┘ │
│   Drag to tilt · tap to turn over│ 44px row, margin-top 10 (holds the CVV pill on the back)
│ AVAILABLE          Limit £60,000 │
│ £48,210.36       Statement 28 Nov│ 40px figures, 24px pence
│ [ Freeze ] [ Limits ] [  PIN  ]  │ three 66px tiles, gap 10
│ RECENT              All activity │
│ (M) Maison Avelle     −£358.20   │ rows: 38px disc, 10px padding, hairlines
│ (F) Fernhill Wine…    −£186.00   │
│ (W) From Wray Reserve +£5,000.00 │
│ 34px home indicator              │
└──────────────────────────────────┘
Back face: 40px graphite stripe at top 24; signature panel 200 × 38 at (22, 84);
CVV box 88 × 38 at (232, 84); lost-card line bottom-left, 11px.
```

- The card is one `<button aria-pressed>` (pressed = showing the back) containing an inner rotator `span` and two `span.face`s with `backface-visibility:hidden`. The CVV hold control sits outside the card so there is no button inside a button.
- Each face holds an inline SVG with an `feTurbulence` filter (`baseFrequency=".002 .85"`) for the brushed grain, so no image asset is needed.
- The faces also toggle `visibility`, so the hidden side is never read or measured.
- Controls: `div role="group" aria-label="Card controls"` with three buttons; Freeze is a toggle with `aria-pressed`.
- Recent: `section` of rows, each a 3-column grid (disc, text, amount).
- Sheets: `section role="dialog" aria-modal="true"` inside a layer with a scrim.

## Tokens

```css
:root {
  /* paper */
  --page: #ECE7DE;      /* warm bone */
  --tile: #F6F2EB;      /* control tiles, sheets */
  --line: #D6CFC3;      /* 1px hairlines and tile rings */
  --disc: #DDD6CA;      /* avatar and merchant discs */
  --disc-in: #D3DED7;   /* incoming transfer disc */
  --ink: #1D211F;
  --sub: #585C57;       /* 5.5:1 on page */
  --spruce: #24473B;    /* the only active colour: pressed tiles, Done, links, incoming */
  --on-spruce: #F3EFE6;
  /* titanium */
  --metal-1: #D3CFC6; --metal-2: #B4B0A7; --metal-3: #C6C2B9; --metal-4: #ACA89F;
  --grain-alpha: .16;   /* feColorMatrix alpha for the brushed noise */
  --engrave: #2F2C29;   /* engraved text and graphite parts, 5.8:1 on the darkest metal stop */
  --engrave-hi: rgba(255, 255, 255, .55); /* 1px highlight under each glyph */
  --engrave-lo: rgba(0, 0, 0, .12);       /* 1px shade above */
  --stripe: #2F2C29; --sig-1: #EEEAE2; --sig-2: #E2DDD3; --cvv-bg: #F4F1EA;
  --sweep: rgba(255, 255, 255, .9);       /* specular band peak, soft-light blend */
  --scrim: rgba(29, 33, 31, .42);
  /* type */
  --serif: "Gloock", Georgia, serif;
  --sans: "Lexend", system-ui, sans-serif;
  --fs-pin: 44px; --fs-balance: 40px; --fs-pence: 24px; --fs-sheet-title: 26px;
  --fs-number: 21px; --fs-brand: 20px; --fs-card-brand: 19px; --fs-row: 14px;
  --fs-small: 12px; --fs-caps: 11px; --fs-card-caps: 10px;
  /* sizes */
  --card-h: 216px; --tile-h: 66px; --disc: 38px; --hold-h: 40px; --sheet-btn-h: 54px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 24px;
  /* radii */
  --r-card: 18px; --r-tile: 18px; --r-sheet: 28px; --r-btn: 16px; --r-plate: 5px; --r-pill: 999px;
  /* depth */
  --card-shadow: inset 0 1px 0 rgba(255,255,255,.7), inset 0 -1px 0 rgba(0,0,0,.18),
                 0 1px 2px rgba(29,33,31,.18), 0 18px 34px -14px rgba(29,33,31,.45);
  /* motion */
  --tilt-max: 14deg; --tilt-lerp: .14; --perspective: 900px;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --flip-ease: cubic-bezier(.16, 1, .3, 1);
  --sheet-ease: cubic-bezier(.32, .72, 0, 1);
  --t-flip: 700ms; --t-hold: 350ms; --t-sheet: 420ms; --t-scrim: 300ms; --t-freeze: 300ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| PIN digits | Gloock | 44px | 400 | 1 | 0.32em, tabular | — |
| Balance | Gloock | 40px (pence 24px) | 400 | 1 | −0.01em, tabular | — |
| Sheet title | Gloock | 26px | 400 | 1.1 | 0 | sentence |
| Card number | Gloock | 21px | 400 | 1 | 0.14em, tabular | — |
| Bank name (header / card) | Gloock | 20px / 19px | 400 | 1 | 0.01–0.02em | title |
| Signature | Gloock italic (synthesised) | 15px | 400 | 1 | 0 | name |
| Merchant, amount | Lexend | 14px | 500 | 1.25 | 0, amounts tabular | sentence |
| Control label | Lexend | 13px | 500 | 1 | 0 | sentence |
| Row meta, hint, sheet note | Lexend | 12–13px | 400 | 1.3–1.45 | 0.02em | sentence |
| Labels (AVAILABLE, RECENT) | Lexend | 11px | 500 | 1 | 0.2em | upper |
| Card caps (name, tier, expiry) | Lexend | 10–11px | 500 | 1 | 0.18–0.24em | upper |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Showcase lean | load | rx, ry | 0 → (3.5, −9.8) → (−2.1, 8.4) → 0 | three steps at 300 / 950 / 1,600ms | lerp .14 per frame | skipped |
| Drag tilt | pointer move | rx, ry | → ±14° from pointer offset | continuous | lerp .14 per frame | capped at ±5.6° (40%) |
| Release | pointer up | rx, ry | → 0 | ~500ms to settle | lerp .14 | same |
| Specular sweep | tilt | band `background-position-x` | 50% − 4.2%·ry | with tilt | — | same, smaller |
| Radial highlight | tilt | centre | (50 + 3.4·ry, 40 − 4·rx)% | with tilt | — | same |
| Flip | tap / Enter | rotateY | 0 → 180° | 700ms | `--flip-ease` | 250ms crossfade between faces |
| Hold fill | press | scaleX of fill | 0 → 1 | 350ms | linear | reveal at once |
| Freeze | toggle | filter, plate opacity | none → saturate(.4) brightness(1.04) | 400ms / 300ms | `--ease` | same |
| Sheet | open / close | translateY | 105% → 0 | 420ms | `--sheet-ease` | 250ms fade |

The rAF loop runs only while the tilt has not settled (sum of differences > .02°), so an idle screen costs nothing.

## States

- **Front / back**: `aria-pressed` false / true on the card. Only the visible face has `visibility:visible`; the other switches after 200ms, at the flip's midpoint.
- **CVV masked / revealed**: "•••" / "418"; masked again on any release or on turning back.
- **Frozen**: Freeze tile spruce with "Frozen"; card desaturated; engraved FROZEN plate at top right of the chip row.
- **Focus-visible**: 2px spruce outline offset 3px (6px on the card).
- **Tile active**: scale .97. **Pressed tile**: spruce fill, bone text, no ring.
- **Sheet open**: scrim over the page; first focus on Done (Limits) or Done after the hold button (PIN).

## Accessibility

- The card's label names the action: "Titanium card ending 4471. Drag or use arrow keys to tilt, press to turn over".
- Arrow keys tilt; Enter and Space flip (keyboard clicks have `event.detail === 0`, so they flip once without double-firing the pointer path).
- Hold buttons work with Space or Enter held down (`keydown` starts, `keyup` and `blur` stop, `repeat` ignored); the revealed digits sit in `aria-live="polite"` regions.
- The CVV pill is `hidden` while the front is showing, so it is not in the tab order.
- Sheets are modal dialogs with labelled titles; Escape closes; focus returns to the opener. Closed sheets and scrims are `visibility:hidden`.
- Contrast: engraved `#2F2C29` on the darkest metal stop `#ACA89F` 5.8:1 (lighter stops more); ink on page 13:1; sub on page 5.5:1; bone on spruce 9.0:1.
- Targets: card 346 × 216; tiles 66px; hold pill 40px (54px in the sheet); sheet buttons 54px; avatar is not interactive.

## Responsive rules

- At 360 wide, the card keeps a 1.6 aspect ratio at `width: 100%` of the 312px column (195px tall) and the card number drops to 19px; tiles keep three columns.
- If the content would pass 844px, reduce the Recent list to two rows before shrinking anything else.
- At tablet width the column stays 390px and centred; tilt maths uses the card's own rect, so it scales without change.
- No motion permission or no gyroscope: drag and arrow keys remain the only tilt inputs, with no message.

## Acceptance checklist

**Always**
- [ ] One material: every card surface comes from one metal gradient plus a grain; no second texture or foil.
- [ ] Dragging tilts the card toward the finger, clamped at ±14°, and it springs back on release.
- [ ] The specular sweep and highlight move with the tilt, not on a timer.
- [ ] A tap under 6px of travel flips; a drag never flips.
- [ ] The secret (CVV, PIN) shows only while held and re-masks on release, leave, cancel and blur.
- [ ] Only the visible face is `visibility:visible`; closed sheets are `visibility:hidden`.
- [ ] Engraved text passes 4.5:1 on the darkest part of the metal.
- [ ] Arrow keys tilt; Enter and Space flip; Escape closes sheets.
- [ ] The rAF loop stops when the tilt has settled.
- [ ] `document.documentElement.scrollWidth` is 390 and the screen fits 844px.

**This demo**
- [ ] Bank "Haldane & Wray", "Private client", tier "Titanium Reserve", card 4471 0928 6603 4471, "Eleanor Vance", "Exp 09/30".
- [ ] Available £48,210.36; Limit £60,000; Statement 28 Nov.
- [ ] Recent: Maison Avelle −£358.20 (€412.00), Fernhill Wine Merchants −£186.00, From Wray Reserve +£5,000.00.
- [ ] CVV 418, PIN 7302, both after a 350ms hold.

## Implementation notes

1. **Tilt is a target plus a lerp.** Pointer, keys, device orientation and the load showcase all only set a target; one rAF loop eases toward it and stops when settled.

```js
const MAX = 14, cur = { x: 0, y: 0 }, tgt = { x: 0, y: 0 }; let raf = 0;
const clamp = (v) => Math.max(-1, Math.min(1, v));
function aim(x, y) { tgt.x = x * MAX; tgt.y = y * MAX; if (!raf) raf = requestAnimationFrame(tick); }
function tick() {
  cur.x += (tgt.x - cur.x) * .14; cur.y += (tgt.y - cur.y) * .14;
  card.style.setProperty('--rx', cur.x + 'deg'); card.style.setProperty('--ry', cur.y + 'deg');
  card.style.setProperty('--sx', 50 - cur.y * 4.2);
  raf = Math.abs(tgt.x - cur.x) + Math.abs(tgt.y - cur.y) > .02 ? requestAnimationFrame(tick) : 0;
}
card.addEventListener('pointermove', (e) => {
  if (!drag) return; const r = card.getBoundingClientRect();
  aim(-clamp((e.clientY - r.top - r.height / 2) / (r.height / 2)),
       clamp((e.clientX - r.left - r.width / 2) / (r.width / 2)));
});
```

2. **The sweep is a blended band, positioned by a variable.** A 260%-wide linear gradient with a narrow white peak, blended `soft-light`, reads as light moving across brushed metal; a plain white overlay reads as glare.

```css
.face::after{content:"";position:absolute;inset:0;pointer-events:none;mix-blend-mode:soft-light;
  background:
    linear-gradient(105deg,transparent 34%,rgba(255,255,255,.9) 47%,rgba(255,255,255,.2) 53%,transparent 64%)
      calc(var(--sx,50) * 1%) 0 / 260% 100% no-repeat,
    radial-gradient(240px 160px at calc(var(--px,30) * 1%) calc(var(--py,20) * 1%),
      rgba(255,255,255,.55),transparent 70%)}
.eng{color:#2F2C29;text-shadow:0 1px 0 rgba(255,255,255,.55),0 -1px 0 rgba(0,0,0,.12)}
```

3. **Brushed grain without an image**: an inline SVG per face with `<feTurbulence type="fractalNoise" baseFrequency=".002 .85" numOctaves="2">` (almost no horizontal frequency, lots of vertical, so it streaks sideways) and an `feColorMatrix` that turns it into mid-grey at 16% alpha, over the gradient. Common mistakes: making the engraving mid-grey for realism (it fails contrast; go dark and let the 1px highlight do the "cut" effect), putting the CVV button inside the card button, and leaving the back face `visibility:visible` so screen readers read the CVV label from the front.
