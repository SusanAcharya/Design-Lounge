<!-- Design Lounge Nº 435 · "Swipe to pay, ember bloom" · www.designlounge.live -->

# Swipe to pay, ember bloom

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from 60fps.design, a gallery of mobile micro-interaction clips: this piece takes the "swipe to pay" idea from its finance shots and rebuilds it as a working control, not a video. It is the confirm step of a fictional wallet called Kosh, paying a tea house in Thamel. The user drags a cream knob along a 64px track. An ember gradient grows behind the knob, and the label fades as the knob travels. Past 86% of the track, release pays: the payee block lifts away, the keypad and slider drop out, a warm radial glow blooms from the centre, and a ring draws itself into a check. The detail worth copying is the feel of the drag: the knob grows 6% under the finger, gives a tiny squeeze at each quarter of the track like a haptic tick, and springs home with overshoot when you let go too early.

The design language is iOS-ish dark, not glass: flat warm-black surfaces, 1px hairlines, one ember accent, and spring motion.

## Structure

```
390 × 844, padding 54 top / 20 sides / 34 bottom
┌──────────────────────────────────────┐
│ [×]                            [···] │ 44px row
│                                      │
│               ( CG )                 │ 52px avatar
│         Chiya Ghar, Thamel           │ 16/700
│           chiyaghar@kosh             │ 12 mono
│                                      │
│           Rs  1,480                  │ 28 + 64/800
│      TWO MASALA, ONE SEL ROTI        │ 11 mono caps
│                                      │
│              (flex gap)              │
│ From Kosh Wallet ·· 4410  Check bal. │ 13px, hairline under
│ ╭──────────────────────────────────╮ │
│ │(→)≈≈≈≈≈ fill      Slide to pay   │ │ track 64px, knob 56px
│ ╰──────────────────────────────────╯ │
│    1           2           3         │ keys 52px tall
│    4           5           6         │
│    7           8           9         │
│    00          0           ⌫         │
└──────────────────────────────────────┘
Overlays: bloom (900px circle, centred), done block (centred), toast pill (top, 59px).
```

- `main.app` is a flex column, `overflow: hidden` so the 900px bloom never widens the page.
- The payee block is a `section` with the `h1` (payee name). The amount is an `output` with `aria-live="polite"`.
- The sheet is a `section` labelled "Pay": source row, track, keypad.
- The track is a `div`; the fill is a sibling under the knob; the label is a `span` with `pointer-events: none`.
- The knob is a `div role="slider" tabindex="0"` with `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow`, `aria-valuetext`.
- The keypad is twelve `button`s in a 3-column grid. Delete has `aria-label="Delete digit"` and an SVG.
- The done block is a `section aria-live="polite"` holding the SVG ring, the `h2`, the meta line, and the Done button.
- Do not draw the status bar. The toast sits 5px below the 54px clearance.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Label sheen | always | background-position | 110% → -110% | 2.6s loop | linear | 0 | removed, label solid `--ink-2` |
| Knob press | pointerdown | transform, box-shadow | scale 1 → 1.06, halo 0 → 6px | 200ms | `--spring` | 0 | no scale |
| Knob follow | pointermove | translateX | follows pointer | none | — | 0 | same |
| Quarter tick | progress crosses 25/50/75% | transform | 1 → 0.94 → 1 | 160ms | `--std` | 0 | removed |
| Return | release < 86% | translateX, fill width | x → 0 | 420ms | `--spring` | 0 | instant |
| Snap to end | release ≥ 86% | translateX | x → max | 420ms | `--spring` | 0 | instant |
| Payee lift | paid | opacity, translateY | 1,0 → 0,-16px | 280ms | `--std` | 0 | opacity 150ms |
| Sheet drop | paid | opacity, translateY | 1,0 → 0,60px | 320ms | `--out` | 0 | opacity 150ms |
| Bloom | paid | transform, opacity | scale 0 → 1, 0 → 1 | 700ms / 500ms | `--out` / `--std` | 120ms | fixed scale 1, opacity 200ms |
| Ring draw | paid | stroke-dashoffset | 327 → 0 | 500ms | `--out` | 360ms | drawn instantly |
| Check draw | paid | stroke-dashoffset | 60 → 0 | 260ms | `--out` | 820ms | drawn instantly |
| Toast | paid | scaleX, opacity | 0.3 → 1, 0 → 1 | 450ms | `--spring` | 500ms | opacity only |
| Key press | :active | background, scale | none → `--surface`, 1 → 0.94 | 120ms | `--std` | 0 | kept (tiny) |

Sequence matters: content leaves first (0–320ms), the glow arrives (120–820ms), the ring draws while the glow is still growing, the check lands last. Do not start the check before the ring finishes.

## States

- Knob resting: cream `--ink`, dark arrow, 2px + 6px shadow.
- Knob held: scale 1.06, ember halo `0 0 0 6px rgba(255,122,47,.18)`, shadow `0 10px 24px rgba(0,0,0,.5)`, cursor grabbing.
- Knob focus-visible: 2px `--ember-2` outline, 3px offset.
- Track progress: fill gradient transparent → 35% ember at 55% → solid ember at the knob.
- Label: opacity falls with progress; hidden past ~59%.
- Amount zero: paying is blocked; the knob springs back.
- Key active: `--surface` fill, scale 0.94.
- Paid: payee, amount, note and sheet hidden; bloom, ring, check, heading, meta, Done and toast shown.
- Done focus-visible: same outline as the knob.
- No loading spinner. In a real app, hold the paid state behind a request and show the ring spinning (stroke-dashoffset loop) until it resolves; then draw the check.
- Error (not in demo): spring back, shake the track 6px twice over 300ms, and replace the label with "Payment failed. Try again" for 2s.

## Accessibility

- The knob is a `role="slider"` so screen readers announce progress. `aria-valuetext` reads "Not paid. Press Enter or slide right to pay." and becomes "Paid" after payment.
- The knob's `aria-label` includes the amount: "Slide to pay Rs 1,480", updated on every keypad change.
- Enter, Space and End pay immediately. Arrow keys step a quarter of the track. Home resets. Dragging is never the only way.
- The amount `output` is `aria-live="polite"`, so keypad edits are announced.
- The done block is `aria-live="polite"`; focus moves to Done after the animation (50ms with reduced motion).
- Done is `tabindex="-1"` until paid so it is not reachable while hidden.
- Contrast: `#f4eee6` on `#12100e` is about 16:1. `#8a8076` on `#1c1916` (muted label) is about 4.6:1. The knob arrow `#12100e` on `#f4eee6` is about 16:1.
- Hit targets: knob 56px, keys 52px tall × a third of 350px, top icons 44px, Done 48px.
- The toast is `aria-hidden` because the done block already announces the same text.

## Responsive rules

- Frame is 390×844. At 360 wide the track shrinks with the sheet; the knob stays 56px and `max` is re-measured on resize.
- Below 720px tall, keys drop to 44px and the amount to 52px so the keypad still fits above the home clearance.
- At tablet width, do not stretch the track across the screen. Centre a 420px column and keep the same layout.
- The bloom is a fixed 900px circle clipped by `.app`; it never causes horizontal scroll.
- Do not draw the status bar, the island, or a home indicator.

## Acceptance checklist

### Always

- [ ] The knob follows the pointer 1:1 and uses pointer capture; drag works with mouse and touch.
- [ ] The fill grows with the knob and the label fades as progress rises.
- [ ] Release below 86% springs back with visible overshoot easing; release at 86% or more pays.
- [ ] A haptic-like squeeze plays at each quarter of the track while dragging forward.
- [ ] The success sequence runs in order: content leaves, glow blooms, ring draws, check draws.
- [ ] Enter, Space or End pays from the keyboard; arrows step by a quarter.
- [ ] The knob is a slider with `aria-valuenow` and `aria-valuetext` kept current.
- [ ] Reduced motion removes the sheen, the scale, the tick and the draw animations, and the piece is still complete.
- [ ] No horizontal scroll at 375px, including in the paid state.
- [ ] Hit targets are at least 44px.

### This demo

- [ ] Payee "Chiya Ghar, Thamel", handle `chiyaghar@kosh`, amount "Rs 1,480", note "TWO MASALA, ONE SEL ROTI".
- [ ] Source row "From Kosh Wallet ·· 4410" with "Check balance".
- [ ] Track 64px, knob 56px, ember `#ff7a2f` on `#12100e`.
- [ ] Paid block "Rs 1,480 paid", "Ref KS-20961 · 09:46", button "Done".
- [ ] Toast "Paid Rs 1,480" with a glowing ember dot.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: close and more icons at the top, payee avatar "CG", name "Chiya Ghar, Thamel", handle `chiyaghar@kosh`, amount "Rs 1,480" at 64px, a mono note "TWO MASALA, ONE SEL ROTI".
2. The bottom sheet shows the funding source "From Kosh Wallet ·· 4410" with a "Check balance" link, then the slider track, then a 3×4 keypad.
3. The track label "Slide to pay" has a slow light sheen moving right to left every 2.6s. It is the only looping motion.
4. The keypad is live. Digits append to the amount (max 6 digits). "00" appends two zeros. The delete key removes the last digit; an empty amount reads 0. Leading zeros are stripped. The amount is formatted with `en-IN` grouping (1,480; 12,500; 1,25,000).
5. Pointer down on the knob: the knob scales to 1.06 and gains a 6px ember halo (18% alpha) plus a deeper shadow. The pointer is captured so the drag continues if the finger leaves the knob.
6. Dragging moves the knob 1:1 with the pointer, clamped between 0 and the track's inner width. The ember fill's width is knob position + knob width + 8px. The label opacity is `1 − progress × 1.7`, so it is gone by ~59%.
7. Each time progress crosses 25%, 50% and 75% while dragging forward, the knob plays a 160ms squeeze to 0.94 and calls `navigator.vibrate(8)` where available. This is the haptic stand-in.
8. Release below 86%: the knob and fill spring back to 0 over 420ms with `cubic-bezier(.34,1.56,.64,1)` (a visible overshoot past the left edge is clipped by the track). The label returns.
9. Release at or above 86%: the knob snaps to the end (420ms spring), and 200ms later the screen enters the paid state.
10. Paid state, in order: payee, amount and note fade and lift 16px (280ms); the sheet fades and drops 60px (320ms expo-out); the bloom scales from 0 to 1 (700ms expo-out, 120ms delay); the ring stroke draws (500ms, 360ms delay); the check draws (260ms, 820ms delay); a black pill toast "Paid Rs 1,480" stretches from 30% width to full with a spring (450ms, 500ms delay).
11. The paid block reads "Rs 1,480 paid", "to Chiya Ghar, Thamel", "Ref KS-20961 · 09:46", and a "Done" button. Focus moves to Done after 900ms.
12. Done resets: paid state removed, knob springs back to 0, focus returns to the knob.
13. If the amount is 0, the slider will not pay; it springs back.
14. Keyboard on the knob: Enter, Space or End pays. Arrow Right/Up moves the knob a quarter of the track; reaching the end pays. Arrow Left/Down moves back a quarter. Home returns to 0.

## Tokens

```css
:root {
  /* surfaces */
  --bg: #12100e;          /* warm black page */
  --surface: #1c1916;     /* track, key press */
  --surface-2: #26221e;   /* avatar, Done button */
  --line: #2f2a25;        /* hairlines, track border */
  /* ink */
  --ink: #f4eee6;         /* primary text, knob */
  --ink-2: #b9afa3;       /* secondary text */
  --ink-3: #8a8076;       /* muted label, 00 and delete keys */
  /* accent */
  --ember: #ff7a2f;       /* fill end, ring, toast dot */
  --ember-2: #ffb27a;     /* avatar initials, focus ring */
  --ember-deep: #5a2208;  /* outer bloom stop */
  /* type */
  --sans: "Manrope", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  /* sizes */
  --track-h: 64px;
  --knob: 56px;
  --r-key: 14px;
  --r-pill: 999px;
  /* spacing (4 base) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px;
  /* motion */
  --spring: cubic-bezier(.34, 1.56, .64, 1);
  --out: cubic-bezier(.16, 1, .3, 1);
  --std: cubic-bezier(.2, .7, .2, 1);
  --t-micro: 160ms;
  --t-return: 420ms;
  --t-bloom: 700ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Amount | Manrope | 64px | 800 | 1 | -0.04em | tabular numerals |
| Currency | Manrope | 28px | 700 | 1 | -0.04em | as written, `--ink-2` |
| Payee name (h1) | Manrope | 16px | 700 | 1.4 | -0.01em | sentence |
| Handle | IBM Plex Mono | 12px | 400 | 1 | 0 | lower |
| Note | IBM Plex Mono | 11px | 400 | 1 | 0.14em | upper |
| Source row | Manrope | 13px | 400 / 600 bold part | 1.4 | 0 | sentence |
| Track label | Manrope | 15px | 600 | 1 | 0.01em | sentence |
| Keypad digit | Manrope | 22px | 500 | 1 | 0 | — |
| Paid heading (h2) | Manrope | 30px | 800 | 1.2 | -0.03em | sentence |
| Paid meta | IBM Plex Mono | 12px | 400 | 1.4 | 0 | sentence |
| Toast | Manrope | 13px | 600 | 1 | 0 | sentence |

Mono is only for machine-ish strings: handle, note, reference. Never set the amount in mono.

## Implementation notes

**1. The drag.** Measure the travel once per drag, capture the pointer, and drive both the knob and the fill from one function. Do not animate during the drag; only animate the return.

```js
let x = 0, max = 0, startX = 0, base = 0, drag = false, lastStep = 0;
const measure = () => { max = track.clientWidth - knob.offsetWidth - 6; };
function set(v, animate) {
  x = Math.max(0, Math.min(max, v));
  const p = max ? x / max : 0;
  const t = animate ? 'transform .42s var(--spring), width .42s var(--spring)' : 'none';
  knob.style.transition = fill.style.transition = t;
  knob.style.transform = `translateX(${x}px)` + (drag ? ' scale(1.06)' : '');
  fill.style.width = (x + knob.offsetWidth + 8) + 'px';
  label.style.opacity = Math.max(0, 1 - p * 1.7);
  knob.setAttribute('aria-valuenow', Math.round(p * 100));
  const step = Math.floor(p * 4);
  if (drag && step > lastStep && step < 4) tick();
  lastStep = step;
}
knob.onpointerdown = e => { measure(); drag = true; startX = e.clientX; base = x; knob.setPointerCapture(e.pointerId); set(x); };
knob.onpointermove = e => drag && set(base + e.clientX - startX);
knob.onpointerup = knob.onpointercancel = () => { drag = false; x / max > .86 ? pay() : set(0, true); };
```

Common mistakes: listening on `document` instead of capturing the pointer (drag dies off-knob); forgetting `touch-action: none` on the track and knob (the page scrolls instead); using `left` instead of `transform`.

**2. The haptic tick.** Restart a CSS animation by removing the class, forcing reflow, and adding it back. Vibration is a bonus only.

```js
function tick() {
  knob.classList.remove('tick'); void knob.offsetWidth; knob.classList.add('tick');
  try { navigator.vibrate && navigator.vibrate(8); } catch (e) {}
}
```

```css
.knob.tick { animation: tick .16s var(--std); }
@keyframes tick { 50% { transform: scale(.94); } }
```

**3. The success choreography in CSS only.** Put one class on the root and let delays sequence everything. This keeps JS to a single class toggle and makes reduced motion a CSS override.

```css
.app.paid .sheet { opacity: 0; transform: translateY(60px); pointer-events: none; }
.app.paid .bloom { transform: scale(1); opacity: 1;
  transition: transform .7s var(--out) .12s, opacity .5s var(--std) .12s; }
.app.paid .ring circle { stroke-dashoffset: 0; transition: stroke-dashoffset .5s var(--out) .36s; }
.app.paid .ring path   { stroke-dashoffset: 0; transition: stroke-dashoffset .26s var(--out) .82s; }
.ring circle { stroke-dasharray: 327; stroke-dashoffset: 327; transform: rotate(-90deg); transform-origin: center; }
.ring path   { stroke-dasharray: 60;  stroke-dashoffset: 60; }
```

The ring circumference for r=52 is 2π×52 ≈ 327. If you change the radius, recompute it or the ring will start part-drawn.

Common mistakes overall:

- Making the whole track draggable. Only the knob starts a drag; tapping the track does nothing.
- Paying on pointerdown at the end. Pay on release.
- A green success colour. The accent stays ember from drag to check.
- Confetti. This success is a glow and a check, nothing else.
- Leaving the 900px bloom unclipped; it creates horizontal scroll.
- Drawing a fake status bar to place the toast. The toast sits under the 54px clearance.
- Forgetting to re-measure on resize, so the knob overshoots the track after rotation.

Where it sits: the last step of a pay flow (scan → amount → confirm). The keypad belongs to the amount step; on a product where the amount is fixed, drop the keypad and let the sheet hold only source row and track. Keep the success screen for at least 1.5s before auto-dismissing, or wait for Done as here.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
