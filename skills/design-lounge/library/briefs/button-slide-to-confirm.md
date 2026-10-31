<!-- Design Lounge Nº 621 · "Slide to pay back a friend" · www.designlounge.live -->

# Slide to pay back a friend

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The settle-up screen of "Quits", an invented app for splitting group costs. You owe Maren £64.20 for a cabin weekend; at the bottom of the screen sits an ink pill with a gold handle. Drag the handle and the label "Slide to pay £64.20" vanishes letter by letter as the handle passes over it; past 72% the handle starts to resist; reach 90% and it snaps through, then grows to fill the whole track and turns into a receipt: check, "£64.20 sent", time. Let go short and it springs home with a small bounce. The action is irreversible but happy, so the friction is light and the payoff is warm, not alarming. Worth copying: the per-letter dimming, the rubber-band curve, and a keyboard path (arrows, then Enter twice) that is as deliberate as the drag.

## Structure

```
390 × 844 (column max-width 420, centred on wider screens)
┌──────────────────────────────────────┐ 62px top pad
│ (‹)  Cabin weekend                   │ back 40×40
│      Hartsfell · 3 people · 24…      │
│                                      │ 34
│ (MO) You owe Maren Okafor            │ avatar 44
│      She paid for the cabin…         │
│ £64.20                 88px / 125%   │
│ Your share of the weekend…           │ note 15px, max 330
│ ┌──────────────────────────────────┐ │ card r18, 1px #ddd5c4
│ │ Cabin, 2 nights, your third £48.00│ │ rows 11px v-pad
│ │ Friday shop, Penhallow…    £11.70│ │
│ │ Fuel, split three ways      £4.50│ │
│ │ From Everyday ·· 3318 Arrives now│ │
│ └──────────────────────────────────┘ │
│                (flex space)          │
│   Press Enter again to send £64.20   │ arm line, opacity 0 until armed
│ ┌──────────────────────────────────┐ │
│ │(→)  Slide to pay £64.20 →        │ │ track 68, handle 56 @ left 4 top 4
│ └──────────────────────────────────┘ │
│  Drag to the end, or press Enter…    │ 13px
│               Replay                 │ 40px, hidden (space kept)
└──────────────────────────────────────┘ 34px bottom pad
```

- `.app` is a flex column with `min-height: 100%`; the footer block takes `margin-top: auto`.
- Header is `header` with a real `button` (aria-label "Back to Cabin weekend").
- Amount is a `p` with `aria-label="64 pounds 20"`; the bill is a `dl` of `div > dt + dd` rows.
- Track is a `div`; inside it a trail span, an `aria-hidden` label span whose text is split into one `i` per character, and the handle `span role="slider" tabindex="0"` holding an `aria-hidden` icon box and an `aria-hidden` receipt box.
- Handle ARIA: `aria-label="Slide to pay Maren £64.20"`, `aria-describedby` the hint, `aria-valuemin 0`, `aria-valuemax 100`, `aria-valuenow`, `aria-valuetext` ("Not sent", "40 percent", "Ready. Press Enter to send", "Sent").
- One visually hidden `p aria-live="polite"`.

## Motion

| Thing | Trigger | Property | From → to | Duration / spring | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Nudge | load, once | translateX | 0 → 14 → −2 → 0 | 900ms --out, 700ms delay | none |
| Drag | pointer move | --x (translateX) | follows finger, tanh past 72% | 0 | same |
| Letter dim | --x changes | opacity per letter | 1 → 0.2 → 0 | 90ms linear | same |
| Spring home | release < 90%, Escape, timeout | --x | x → 0, wall bounce v × −0.3 | k 340, c 17 | instant |
| Key step | arrows | --x | ±10% | k 600, c 40 | instant |
| Arm | first Enter | --x; arm line opacity, translateY | → 84%; 0/4px → 1/0 | k 600, c 34; 180ms --ease | instant |
| Snap-through | x ≥ 90% | --x | → 100% | k 900, c 46 | instant |
| Morph | after snap | handle width, translateX | 56 → 100% − 8px; max → 0 | 440ms --out | instant |
| Check | done | stroke-dashoffset | 24 → 0 | 360ms --out, 180ms delay | instant |
| Receipt text | done | opacity, translateX | 0/−10px → 1/0 | 240/320ms, 200ms delay | instant |
| Strike | done | scaleX on amount ::after | 0 → 1 (origin left) | 520ms --out, 120ms delay | instant |

## States

- Rest: handle gold with a 2px `#c98a12` inset top bevel; label full cream.
- Dragging: cursor grabbing, trail visible, letters dimming, label fading.
- Resisting: past 72% the handle moves less than the finger; no extra visual, the lag is the signal.
- Armed (keyboard): handle at 84%, "Press Enter again to send £64.20" visible above, `aria-valuetext` "Ready. Press Enter to send".
- Done: track filled by the gold pill, check + "£64.20 sent" + time; amount struck; Replay visible.
- Focus-visible: 3px cream outline, offset −7px, radius 28 (sits inside the gold so it reads on ink and on gold).
- Disabled (if your product needs it): track `#ddd5c4`, handle `#ece6d8`, no trail, `aria-disabled="true"`.

## Accessibility

- The handle is `role="slider"` so screen readers announce progress; its name says exactly what sending does, and `aria-describedby` points at the visible hint "Drag to the end, or press Enter twice."
- Arrows alone cannot send (capped at 80%). Sending by keyboard always takes two Enters within 5s, the keyboard version of dragging to the end. Escape and Home cancel.
- The visible label is `aria-hidden` (the handle has the name); the receipt is `aria-hidden` and announced through the live region instead.
- Polite live messages: arm prompt, "Not sent.", the success sentence, and "Reset. £64.20 to Maren, not sent." after Replay (focus returns to the handle).
- `touch-action: none` and `user-select: none` on the track and handle so a horizontal drag never scrolls or selects.
- Contrast: ink track against paper 15.0:1 (the track edge), cream label on ink 15.4:1, ink on gold 9.2:1, secondary text 6.4:1. Letters only dim while the user is dragging, never at rest.
- Hit targets: handle 56 × 56; back button 40 × 40; Replay 40px tall.

## Responsive rules

- 360 wide: track 324px, travel 264px; the label still fits on one line (white-space: pre).
- Heights under 700px: amount 68px, smaller top gaps; the track stays pinned to the bottom.
- Tablet or desktop: the column caps at 420px and centres; nothing stretches.
- Travel and letter centres are re-measured on pointer down, on each key, after fonts load and on resize; a done track stays full width.

## Acceptance checklist

### Always

- [ ] The handle follows the pointer with pointer capture, 1:1 up to 72%, rubber-banded after.
- [ ] Letters the handle has passed are hidden; the next 56px of letters dim progressively.
- [ ] Crossing 90% completes immediately without waiting for release; release short springs home with one bounce.
- [ ] Completion morphs the handle into a full-width receipt with check, amount and time, keeping its right edge fixed.
- [ ] Keyboard: arrows move ±10% up to 80%; Enter arms; a second Enter within 5s sends; Escape/Home/timeout cancel.
- [ ] `role="slider"` with value now and value text kept current; a polite live region announces arm, cancel and success.
- [ ] Track edge ≥ 3:1 against the screen; focus ring visible on gold and on ink.
- [ ] Reduced motion removes the nudge, springs and morph but keeps every state.
- [ ] No layout shift when the Replay link appears.

### This demo

- [ ] Copy "You owe Maren Okafor", "£64.20", "Slide to pay £64.20", "£64.20 sent", "You're square with Maren".
- [ ] Bill rows £48.00, £11.70, £4.50 and "From Everyday ·· 3318".
- [ ] Track `#1c1a15` 68px, handle `#f0b23a` 56px, trail `#3a3123`, strike `#c98a12`.
- [ ] Mona Sans at width 125% for the amount; Atkinson Hyperlegible Next for body.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame, 390 × 844 iOS-style (Lounge draws the status bar): 62px top padding. Back button (40px circle, 1.5px border) and "Cabin weekend / Hartsfell · 3 people · 24 to 26 Oct".
2. A 44px peach avatar "MO" with "You owe Maren Okafor / She paid for the cabin and the Friday shop", then the amount "£64.20" at 88px Mona Sans, width 125%, weight 760, with a raised 0.42em "£".
3. Note: "Your share of the weekend. Payments can't be recalled, so check the amount." Then a card: "Cabin, 2 nights, your third £48.00", "Friday shop, Penhallow Stores £11.70", "Fuel, split three ways £4.50", "From Everyday ·· 3318 Arrives now".
4. Bottom of the screen (pinned by `margin-top: auto`): a 68px ink track, 2px ink border, radius 34; a 56px gold handle with an arrow at left 4px; centred cream label "Slide to pay £64.20" followed by a small gold arrow. Under it, 13px: "Drag to the end, or press Enter twice."
5. 700ms after load the handle nudges once: 14px right, 2px back, home (900ms). It never loops.
6. Pointer down on the handle captures the pointer. The handle follows the finger 1:1 until 72% of travel; after that, travel follows `0.72 + 0.28 · tanh((r − 0.72)/0.28 · 1.1)` so the last stretch feels heavy (reaching 90% needs about 91% of finger travel).
7. While dragging, a darker trail (`#3a3123`) grows behind the handle; each letter whose centre the handle's right edge has passed goes to opacity 0; letters within 56px ahead dim from 0.2 to 1; the whole label also fades by `1 − 0.45p`.
8. The moment position reaches 90%, the drag ends by itself (snap-through): the handle springs to 100% (k 900, c 46), then grows to the full track width in 440ms expo-out while its left edge slides to 0, so the right edge stays put.
9. Success: the arrow becomes a check that draws itself (360ms, 180ms delay); "£64.20 sent" and the time (e.g. "14:32", tabular) fade in 200ms later. The heading becomes "You're square with Maren", the amount greys to `#5b5549` and a 7px gold-deep line strikes through it (520ms, 120ms delay), the note becomes "Paid from Everyday ·· 3318 at 14:32. Cabin weekend is settled for you.", the hint becomes "Maren gets a note from Quits right away." and a "Replay" link appears (its space is reserved, so nothing jumps).
10. Release short of 90%: the handle springs home (k 340, c 17) and bounces once off the left wall; if it was past 25% the live region says "Not sent."
11. Keyboard: Tab to the handle (cream 3px ring inset 7px). Right/Up +10%, Left/Down −10% (capped at 80%, arrows alone never send). Enter or Space arms: the handle glides to 84%, "Press Enter again to send £64.20" fades in above the track, and the live region says "Press Enter again to send £64.20 to Maren. Escape cancels." A second Enter within 5s sends. Escape or Home, or 5s without a second Enter, springs it home and says "Not sent."
12. On success a polite live region announces "Paid Maren £64.20 at 14:32. You're square."
13. Reduced motion: no nudge, no springs, no morph transition; the handle jumps home or straight to the receipt.

## Tokens

```css
:root {
  /* colour */
  --paper: #f3eee4;      /* screen */
  --card: #fbf8f1;       /* bill card */
  --ink: #1c1a15;        /* text, track */
  --ink-2: #5b5549;      /* secondary text, paid amount, 6.4:1 */
  --line: #ddd5c4;       /* hairlines, card border */
  --back-edge: #8a8272;  /* back button border */
  --gold: #f0b23a;       /* handle, label arrow */
  --gold-deep: #c98a12;  /* handle top bevel, strike line */
  --trail: #3a3123;      /* drag trail on the ink track */
  --cream: #f7f1e3;      /* label on ink, handle focus ring */
  --peach: #f6d9c4;      /* avatar */

  /* type */
  --display: "Mona Sans", system-ui, sans-serif;            /* variable wdth 75–125 */
  --sans: "Atkinson Hyperlegible Next", system-ui, sans-serif;
  --fs-amount: 88px; --fs-label: 16px; --fs-body: 15px; --fs-small: 14px; --fs-hint: 13px;

  /* geometry */
  --track-h: 68px; --track-r: 34px; --track-border: 2px;
  --handle: 56px; --handle-inset: 4px;      /* travel = track.clientWidth − 64 */
  --label-left: 72px; --label-right: 18px;
  --r-card: 18px; --avatar: 44px; --back: 40px;
  --pad-top: 62px; --pad-x: 16px; --pad-bottom: 34px;
  --space: 4px 8px 10px 12px 16px 18px 24px 34px;

  /* behaviour */
  --resist-from: .72;   /* tanh rubber band starts here */
  --snap-at: .90;       /* snap-through threshold */
  --arm-at: .84;        /* where Enter parks the handle */
  --key-step: .10;  --key-max: .80;  --arm-timeout: 5000ms;

  /* motion */
  --out: cubic-bezier(.16,1,.3,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --morph: 440ms;  --check-draw: 360ms;  --strike: 520ms;  --nudge: 900ms;
  --spring-home: 340 17;  --spring-snap: 900 46;  --spring-key: 600 40;  /* stiffness, damping */
}
```

## Typography

| Role | Family | Size | Weight | Width | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Amount | Mona Sans | 88px (68px if height < 700) | 760 | 125% | −0.035em | tabular, "£" at 0.42em raised |
| Track label | Mona Sans | 16px | 650 | 112% | 0.01em | cream on ink, 15.4:1 |
| Receipt amount | Mona Sans | 16px | 700 | 110% | 0 | ink on gold, 9.2:1 |
| Avatar initials | Mona Sans | 15px | 700 | 110% | 0 | |
| Header title | Atkinson Hyperlegible Next | 15px | 600 | — | 0 | |
| Body, note | Atkinson Hyperlegible Next | 15–16px | 400 | — | 0 | line-height 1.45 |
| Bill rows | Atkinson Hyperlegible Next | 14px | 400 / 600 values | — | 0 | values tabular |
| Hint, sublines, time | Atkinson Hyperlegible Next | 13px | 400 / 600 | — | 0 | |

## Implementation notes

**Rubber band and snap-through.** Map raw finger progress to handle progress, and complete inside `pointermove`:

```js
const resist = r => r <= .72 ? r : .72 + .28 * Math.tanh((r - .72) / .28 * 1.1);
handle.addEventListener('pointermove', e => {
  if (!drag) return;
  x = resist(Math.max(0, ox + e.clientX - sx) / max) * max; draw();
  if (x >= max * .9) { drag = false; complete(); }   // snaps through, no release needed
});
handle.addEventListener('pointerup', () => { if (drag) { drag = false; springTo(0, 340, 17); } });
```

**Letters that dim as the handle passes.** Split the label once, cache each letter's centre relative to the track, then compare with the handle's right edge every frame:

```js
const edge = 4 + x + 56;   // inset + travel + handle width
letters.forEach((l, i) => {
  const d = cx[i] - edge;
  l.style.opacity = (d < 0 ? 0 : d < 56 ? .2 + .8 * d / 56 : 1) * (1 - p * .45);
});
```

**Morph without measuring.** Animate width and translate together with the same curve; because `x + 56 = max + 56 = width`, the right edge never moves:

```css
.track.done .handle {
  width: calc(100% - 8px); transform: translateX(0);
  transition: width 440ms var(--out), transform 440ms var(--out);
}
```

Common mistakes:

- Completing on release only; the snap-through is what makes 90% feel like a detent.
- Letting arrow keys reach 100% and send; keep a separate, two-step Enter confirmation.
- Measuring letter positions before the web font loads; re-measure on `document.fonts.ready`.
- Dimming the label at rest or using a shimmer that drops contrast below 4.5:1.
- Using `display: none` for the Replay link, which shifts the track up the moment payment lands.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
