<!-- Design Lounge Nº 363 · "Postcard with stamp and postmark" · www.designlounge.live -->

# Postcard with stamp and postmark

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A single travel postcard on a deep sea-green desk. The front is a flat, screen-printed illustration of a fictional harbour town, "Cala Verdena", with a striped setting sun, white houses with terracotta roofs, a lighthouse and a sailboat, and a "Greetings from" title in fat display type with a two-step offset shadow. Turn it over and the back is a real postcard layout: handwritten message on the left, a hairline divider, a perforated stamp top right, ruled address lines, and a round postmark with wavy cancellation lines. The postmark is the moment: it thumps onto the card with a blur-to-sharp scale, a wet ink blot that dries off, and the card dips 1.5% under the pressure. Use it for travel, gifting, "send a card" flows, or a thank-you screen.

## Structure

```
1280 × 800, body grid centred, padding 32px 16px
desk: #173840 with a soft lighter radial and 2px/7px vertical grain
            Post No. 07 / Summer 2026          12px caps, 0.24em
┌──────────────────────── 720 × 472.5 ────────────────────────┐
│ FRONT (padding 2.2cqw cream border)                          │
│  Greetings from        (hand, rotated −4°)                   │
│  CALA                                         [lighthouse]   │
│  VERDENA  (display 10.2cqw, cream, coral+ink offset shadow)  │
│  [houses on hill]          [striped sun]                     │
│  ~~~~~~~ sea ~~~~~~~ [boat]              THE HARBOUR AT DUSK │
└──────────────────────────────────────────────────────────────┘
        [ Turn over ]  ( Postmark again )        40px pills
        drag it sideways, or press Enter, to turn it over

BACK (rotateY 180deg), grid 1.12fr | 1px | .88fr, column gap 4cqw, padding 5cqw
┌───────────────────────── POST CARD ──────────────────────────┐
│ Dear Ama,                       │      (postmark)) ~~~ [stamp] │
│ The ferry runs twice a day…     │                              │
│ Saving you a jar of …           │  Ama Thapa ________________  │
│              back Thursday, R.  │  14 Juniper Row ___________  │
│ NO. 07 OF 12 · PRINTED ON 300 GSM BOARD  Harrow Fold HF3 9QL _ │
└──────────────────────────────────────────────────────────────┘
```

- `.scene` holds `perspective: 1800px`. `.card` is `role="button"`, `tabindex="0"`, `aria-pressed`, `container-type: inline-size`, `transform-style: preserve-3d`, `transform: rotateY(var(--ry))`.
- Two `section.face` children, `position: absolute; inset: 0; backface-visibility: hidden`. The back has `transform: rotateY(180deg)`.
- The front illustration is one inline SVG, `viewBox="0 0 640 420"`, `preserveAspectRatio="xMidYMid slice"`. The title is an `h1` laid over it.
- The back: `.print` label centred at the top, `.left` with the message, a 1px `.divider`, `.right` holding the stamp, the postmark and the address. A small-print line is absolute at bottom left.
- All text sizes on the card are in `cqw`, so the whole card scales as one object down to 343px wide.

Copy, exactly:

- Message: "Dear Ama," / "The ferry runs twice a day, so the whole town keeps time by it. I swim before breakfast, eat sardines on the harbour wall, and fall asleep to the lighthouse sweeping my ceiling." / "Saving you a jar of the lemon honey." / "back Thursday, R." (right-aligned).
- Address: "Ama Thapa", "14 Juniper Row", "Harrow Fold  HF3 9QL".
- Postmark ring: "CALA VERDENA · PORTO VECCHIO · 1·", centre "12 AUG" over "2026".
- Stamp: "38" top left, "VERDENA" bottom, a lighthouse on teal with a sun.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| `.card` | click, Enter, Space, arrows, button | `transform: rotateY` | n·180° → (n±1)·180° | 820ms | `--ease` | instant |
| `.card.drag` | pointer drag | `rotateY` | start + dx·0.55° | 0 (rAF) | none | no rotation |
| `.card` | drag release | `rotateY` | current → nearest 180° multiple | 820ms | `--ease` | instant |
| `.postmark` | first arrival on back, or button | opacity, scale, blur | 0, 1.45, 3px → 1, .95, 0 (38%) → 1.02 (60%) → .86, 1, 0 | 620ms | `--ease` | shows at .86, no keyframes |
| `.postmark .wet` | same, 180ms later | opacity of a filled disc r=50 | .55 → 0 | 1400ms | ease-out | none |
| `.back` | 200ms after stamp | `scale` | 1 → .985 (40%) → 1 | 260ms | `--ease` | none |
| buttons | hover | border, bg, colour | → `--sun` | 160ms | `--ease` | instant |

The postmark keeps its own `rotate(-9deg)` in every keyframe so the scale does not untwist it.

## States

- **Card, front showing:** `aria-pressed="false"`, back face `aria-hidden="true"`. Cursor `grab`.
- **Card, back showing:** `aria-pressed="true"`, front face `aria-hidden="true"`, postmark visible at 0.86 opacity.
- **Dragging (`.drag`):** cursor `grabbing`, transition off, `user-select: none` so text never highlights.
- **Focus-visible on card:** `box-shadow: 0 0 0 3px var(--desk), 0 0 0 5px var(--sun)`, following the 6px radius. On buttons: 2px `--sun` outline, 3px offset.
- **Primary button:** `--sun` fill, `--ink` text; hover `#f6c46d`. Secondary: transparent, 1px border at 35% cream; hover border and text `--sun`.
- **Not stamped yet:** postmark opacity 0. There is no disabled state; "Postmark again" always works.

## Accessibility

- The card is one `role="button"` with `aria-pressed` and a label that says which side is showing and what Enter does: "Postcard from Cala Verdena, showing the picture side. Press Enter to turn it over."
- `aria-describedby` points at the visible hint.
- A polite live region reads "Picture side: the harbour at dusk." or "Message side." followed by the full message text, so screen reader users get the handwriting as text.
- The stamp is `role="img"` with "38 cent stamp with a lighthouse". The address block has an `aria-label` with the full address. The illustration SVG is `aria-hidden`; the `h1` carries the place name.
- Keys on the card: Enter and Space turn it, Arrow Left and Right turn it in that direction. The page does not scroll on these keys while the card is focused.
- Contrast: `--pen` on `--card` 9.5:1. `--ink-2` small print on `--card` 5.8:1. `--on-desk-2` hint on `--desk` 6.7:1. `--ink` on `--sun` button 7.0:1.
- Buttons are 40px tall.

## Responsive rules

- **≥ 1280:** card 720px wide, centred.
- **1024:** unchanged; there is room.
- **768:** card `min(720px, 100%)` with 16px side padding, so about 736px of space. Unchanged.
- **< 640:** card fills the width minus 32px (343px at 375). Every size inside is `cqw`, so the place name is 35px and the message 14px. Buttons wrap and centre; button padding drops to 14px; hint drops to 19px.
- Nothing scrolls sideways. `body { overflow-x: hidden }` is a guard, not the fix: the card width is the fix.

## Acceptance checklist

### Always

- [ ] One card with two faces that turns 180° in 820ms on expo out; both faces use `backface-visibility: hidden`.
- [ ] Click, Enter, Space, Arrow Left/Right, and a button all turn the card; arrows turn in their direction.
- [ ] Horizontal drag rotates the card live at 0.55°/px and snaps to the nearest side on release; a short drag counts as a click.
- [ ] The postmark stamps on automatically the first time the back shows, and on demand from a button.
- [ ] The stamp has perforated edges from a radial-gradient mask, not an image.
- [ ] The postmark and ink texture come from an SVG turbulence filter, not a bitmap.
- [ ] `aria-pressed` and the label reflect the side showing; the hidden face is `aria-hidden`.
- [ ] Card type is in `cqw` so it scales down to 343px with no overflow.
- [ ] Reduced motion: instant turn, no drag rotation, postmark appears without keyframes.

### This demo

- [ ] Desk `#173840`, card stock `#f4e9d3`, postmark ink `#2c3f78`, handwriting `#24366e`.
- [ ] Front reads "Greetings from" / "Cala Verdena" with coral then ink offset shadow, and "The harbour at dusk".
- [ ] Back message starts "Dear Ama," and ends "back Thursday, R."; address "Ama Thapa, 14 Juniper Row, Harrow Fold HF3 9QL".
- [ ] Postmark reads "12 AUG 2026" in a 46px-radius double ring, rotated −9°, four wavy lines running over the stamp.
- [ ] Stamp shows "38" and "VERDENA" with a lighthouse, rotated 2°.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the picture side faces the viewer, centred, 720px wide, aspect 640:420. Eyebrow above reads "Post No. 07 / Summer 2026". Two buttons below ("Turn over", "Postmark again") and a handwritten hint "drag it sideways, or press Enter, to turn it over".
2. Click (pointer moves under 6px between down and up) on the card, the "Turn over" button, Enter or Space on the focused card: the card turns 180° around the Y axis in 820ms on expo out.
3. Arrow Right turns it +180°, Arrow Left −180°. The angle accumulates (0, 180, 360…), so the turn always continues in the direction you asked for.
4. Drag horizontally: once the pointer has moved 6px, the card follows the hand at 0.55° per pixel with no transition, updated once per animation frame. On release it snaps to the nearest multiple of 180°. If you dragged more than 50° but the nearest multiple is still the start angle, it completes the turn in the drag direction anyway.
5. The first time the back faces the viewer, 520ms after the turn starts (so the turn has nearly settled), the postmark stamps on. It never stamps again on its own.
6. "Postmark again": if the back is showing, restamp immediately (remove the class, force reflow, add it back). If the front is showing, turn the card over and stamp on arrival.
7. The flip button label swaps between "Turn over" and "Show the picture". `aria-pressed` on the card is true when the back is showing.
8. Reduced motion: the turn is instant, drag does not rotate the card (release turns it in the drag direction), the postmark appears with no thump, no blot, no dip.

## Tokens

```css
:root {
  /* desk */
  --desk: #173840;        /* page */
  --desk-2: #1f4952;      /* radial lift behind the card */
  --on-desk: #f4e9d3;     /* button text */
  --on-desk-2: #a9c3c2;   /* eyebrow, hint */

  /* card stock */
  --card: #f4e9d3;        /* both faces, front border */
  --card-2: #ece0c4;
  --rule: #cbb994;        /* divider, address rules */
  --ink: #24323a;         /* "Greetings from", deep shadow, boat */
  --ink-2: #5b5a4e;       /* printed labels on the back */
  --pen: #24366e;         /* handwriting */
  --post: #2c3f78;        /* postmark ink */

  /* scene */
  --coral: #e2553f;       /* sun, roofs, first shadow step */
  --sun: #f0b14a;         /* accent: primary button, focus ring, sail */
  --sea: #2b7a78;         /* sea, stamp ground */

  --display: "Abril Fatface", Georgia, serif;
  --hand: "Reenie Beanie", "Bradley Hand", cursive;

  --card-w: 720px;  --card-ratio: 640 / 420;  --radius: 6px;
  --persp: 1800px;
  --flip: 820ms;    --ease: cubic-bezier(.16, 1, .3, 1);
  --drag-rate: .55; /* degrees per pixel */
  --shadow-card: 0 1px 0 rgba(255,255,255,.5) inset, 0 30px 50px -24px rgba(0,0,0,.7), 0 6px 14px -6px rgba(0,0,0,.45);
}
```

Paper grain on both faces: `::after` with `radial-gradient(rgba(70,50,20,.07) .6px, transparent .7px) 0 0 / 3px 3px`, `mix-blend-mode: multiply`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case / colour |
|------|--------|-----:|-------:|------------:|---------:|---------------|
| Eyebrow | Abril Fatface | 12px | 400 | 1.5 | 0.24em | UPPER, `--on-desk-2`, slash in `--sun` |
| "Greetings from" | Reenie Beanie | 6.4cqw | 400 | 1 | 0 | `--ink`, rotate −4° |
| Place name | Abril Fatface | 10.2cqw | 400 | 0.86 | −0.01em | `--card`, shadow `.45cqw .45cqw 0 coral, .9cqw .9cqw 0 ink` |
| Front caption | Abril Fatface | 1.7cqw | 400 | 1 | 0.2em | UPPER, `--card` |
| "POST CARD" | Abril Fatface | 1.75cqw | 400 | 1 | 0.42em | UPPER, `--ink-2` |
| Message | Reenie Beanie | 4.15cqw | 400 | 1.16 | 0 | `--pen`, rotate −1.2° |
| Address | Reenie Beanie | 3.8cqw | 400 | 1.25 | 0 | `--pen` on 1px `--rule` lines |
| Small print | Abril Fatface | 1.45cqw | 400 | 1.3 | 0.14em | UPPER, `--ink-2` |
| Buttons | Abril Fatface | 13px | 400 | 1 | 0.12em | UPPER |
| Hint | Reenie Beanie | 22px | 400 | 1 | 0 | `--on-desk-2` |

At 720px wide, 1cqw = 7.2px: the place name is about 73px and the message about 30px.

## Implementation notes

**Perforated stamp edge with one mask.** A grid of transparent circles tiled with `round`, plus a solid rectangle inset by one tile, gives teeth on all four sides:

```css
.stamp {
  width: 15.5cqw; aspect-ratio: 96 / 118; padding: .9cqw; background: #fbf6ea;
  --p: radial-gradient(circle at center, transparent .62cqw, #000 .66cqw);
  mask: var(--p) 50% 50% / 1.7cqw 1.7cqw round,
        linear-gradient(#000, #000) 50% / calc(100% - 1.7cqw) calc(100% - 1.7cqw) no-repeat;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,.18));
}
```

**Worn ink filter.** Fractal noise becomes an alpha mask that punches holes, then a low-frequency turbulence roughens the edges by 2.4px:

```html
<filter id="worn">
  <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.2 1.75" result="holes"/>
  <feComposite in="SourceGraphic" in2="holes" operator="in" result="cut"/>
  <feTurbulence type="turbulence" baseFrequency=".04" seed="9" result="w"/>
  <feDisplacementMap in="cut" in2="w" scale="2.4"/>
</filter>
```

**Drag that snaps but never stalls.**

```js
const now = base + (lastX - startX) * .55;
const snapped = Math.round(now / 180) * 180;
setAngle(snapped === base && Math.abs(now - base) > 50
  ? base + 180 * Math.sign(now - base)  // a deliberate drag always completes
  : snapped);
const isBack = a => Math.abs(Math.round(a / 180)) % 2 === 1;
```

Common mistakes:

- Normalising the angle to 0/180 on every turn. The card then spins backwards from 180 to 0. Keep accumulating.
- Putting `perspective()` inside the card's own transform. Put `perspective` on the parent.
- Stamping the postmark at the start of the turn; it lands on the hidden face. Wait about 520ms.
- Restarting a CSS animation without a reflow. Remove the class, read `offsetWidth`, add it back.
- Using px for card text. At 375px the message overflows. Use container query units.
- A photo for the front. The illustration is a dozen flat SVG shapes; keep it flat, no gradients except the sky.
- Text selection while dragging. Set `user-select: none` on the card.

Rebuild order:

1. Desk background, the centred column, eyebrow, buttons, hint.
2. The card shell with perspective, two faces, and `cqw` container.
3. Front SVG scene, then the title overlay.
4. Back grid: message, divider, address lines, small print.
5. Stamp with the mask, postmark SVG with the filter.
6. `setAngle()`, click and key turns, then drag with rAF and snapping.
7. Postmark keyframes, wet blot, card dip, and the first-arrival timer.
8. Live region, labels, reduced motion, and the 375px check.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
