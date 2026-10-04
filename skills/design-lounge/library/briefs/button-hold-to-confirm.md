<!-- Design Lounge Nº 270 · "Hold and slide to confirm" · designlounge.vercel.app -->

# Hold and slide to confirm

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

Two friction patterns that replace "Are you sure?" dialogs, shown on the settings page of a fictional finance tool, "Tallyhut". On the left, hold-to-confirm: a red button fills with a darker red from left to right while it is held and shows a countdown; let go early and the fill drains back in 260ms; only a full fill acts, then an Undo appears. A smaller outline version and a 56px icon version with a progress ring show the same behaviour at shorter durations. On the right, slide-to-confirm: an ink pill with a cream thumb you drag to the end to pay; a green trail follows the thumb; released before 92% it springs home; at the end the track turns green and reads "Paid · ref TH-20931". The point worth copying is the keyboard path: holding Space or Enter fills the hold button exactly like a pointer, and the slider is a real `role="slider"` that arrow keys and End can complete.

## Structure

```
1280 × 800, panel width min(1080px, 100%), radius 20, 1px line
┌──────────────────────────────────────────────────────────────────────────┐
│ Tallyhut  Settings · Danger zone & payouts      Hold: … [Space]/[Enter]… │ 22/32 pad
├────────────────────────────────────┬─────────────────────────────────────┤
│ Hold to confirm (17px 600)         │ Slide to confirm                    │
│ desc 13px                          │ desc 13px                           │
│ [▓▓▓▓ Hold to delete workspace   ] │ ((→) Slide to pay £1,240.00  to…  ) │
│  56px, ≥300px                      │  64px track, ≤400px                 │
│ [ Hold to remove card ·· 4417    ] │ ((→)  Slide to move £85 to Savings) │
│  48px outline                      │  52px track, ≤320px                 │
│ (trash) ring 56px    caption       │ Reset sliders                       │
├────────────────────────────────────┴─────────────────────────────────────┤
│ STATES  [default][hover][60%][disabled][focus][done] (ring)             │
│         (slide)(slide)(55%)(disabled)(focus)(done)          #f5f4ee band │
└──────────────────────────────────────────────────────────────────────────┘
```

- The panel is `main`, labelled by the `h1`. Each column is a `section` labelled by its `h2`.
- Hold buttons are `button type="button"` with a `.fill` span (`aria-hidden`), an icon, a `.lab` text span (the accessible name) and a `.t` countdown span (`aria-hidden`).
- The Undo button is a sibling, `hidden` until done.
- Each slider is a `div.slide` holding a trail span, a label span (`aria-hidden`), and a `span.thumb` with `role="slider"`, `tabindex="0"`, `aria-label`, `aria-valuemin/max/now` and `aria-valuetext`.
- One visually hidden `p aria-live="polite"` serves both columns.
- The states sheet is `inert`, `aria-hidden`, with a visually hidden description.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Hold fill | held | --p (scaleX / ring dashoffset) | current → 1 | remaining of 1600/1000/900ms | linear (time) | same |
| Drain | release early | --p | current → 0 | 260ms × current | linear | same |
| Press | holding | scale | 1 → .985 (ring .94) | 140ms | --ease | none |
| Done | full | background, colour | red → ink | 200ms | --ease | instant |
| Thumb drag | pointer move | translateX | follows pointer | 0 | — | same |
| Spring home | release < 92% | translateX, trail width | x → 0 | 420ms | --spring | instant |
| Label fade | drag | opacity | 1 → 1 − 1.4p | 0 | — | same |

Linear is correct here because the fill is a clock, not a UI move. Drive it with `requestAnimationFrame` and elapsed time, not a CSS transition, so a release mid-way can read the exact value.

## States

- Hold default: solid red, white text. Hover: `#b02417`. Outline hover: `#fdf3f1` wash.
- Holding: scale .985, "Keep holding" + countdown, fill advancing.
- Done: ink background, cream text, fill hidden, Undo visible.
- Disabled: `--off` fill, `--off-ink` text, no ring, `cursor: not-allowed`.
- Focus-visible: 2px ink outline, offset 3px (ring button offset 8px so it clears the arc).
- Slider default: ink track, cream thumb with a 4px green halo from the trail. Hover: 6px cream glow around the thumb. Dragging: trail and fading label. Done: green track, check in thumb, label shifted left of the thumb.
- Slider focus: 3px `#f2c94c` outline on the thumb, offset 2px (visible on ink and on green).
- Slider disabled: `--off` track, flat thumb, no trail.

## Accessibility

- Hold buttons keep an accessible name that says what holding does ("Hold to delete workspace"). The countdown is `aria-hidden`; only the result is announced.
- Space/Enter held = pointer held. Prevent default on both so Space does not scroll and Enter does not click. Ignore `e.repeat`.
- Cancel on `blur` so tabbing away mid-hold never completes.
- Undo is a real button and gets announced via the live message "Undo available."; after Undo focus returns to the original button.
- Sliders use `role="slider"`; `aria-valuetext` reads "40 percent", then "Confirmed".
- End completes immediately. That is deliberate: a keyboard user has already reached a labelled payment control; if your product needs more friction, make End jump to 90% and require one more Right.
- Contrast: white on red 5.7:1, red on panel 5.5:1, cream on ink 16:1, cream on green 4.9:1, captions 6:1.
- Hit targets: smallest live target is the 44px thumb; Undo is 40px tall.

## Responsive rules

- ≥ 1024: two columns as drawn.
- < 860: one column; padding 20px; hold buttons go full width; the payee tag inside the large slider hides so the label stays on one line.
- Sliders are `min(400px, 100%)` / `min(320px, 100%)`; travel is re-measured on resize, and a done slider stays pinned to the end.
- At 375 nothing overflows; the sheet wraps into rows.
- Touch: `touch-action: none` on hold buttons and thumbs so a hold or drag never scrolls the page.

## Acceptance checklist

### Always

- [ ] Hold fill is driven by elapsed time and reaches 100% exactly at the duration.
- [ ] Releasing, cancelling, losing capture or blurring before 100% drains the fill and does nothing else.
- [ ] Only a completed hold acts; the click event never acts.
- [ ] Space/Enter held behave like a pointer hold; repeats are ignored.
- [ ] A completed destructive action offers Undo and announces it.
- [ ] Slide completes at ≥ 92% travel; below that the thumb springs home.
- [ ] The thumb is `role="slider"` with value, value text, arrows, Home, End, PageUp/PageDown.
- [ ] `touch-action: none` on every hold and drag surface.
- [ ] Focus is visible on hold buttons, ring button and thumbs.
- [ ] A states sheet shows default, hover, pressed, disabled, focus and done for both patterns, and is inert.

### This demo

- [ ] Durations 1600 / 1000 / 900ms; drain 260ms per full bar.
- [ ] Labels "Hold to delete workspace", "Hold to remove card ·· 4417", "Slide to pay £1,240.00", "Slide to move £85 to Savings".
- [ ] Done labels "Workspace deleted", "Card removed", "Paid · ref TH-20931", "Moved £85".
- [ ] Red `#c42a1c` with fill `#7e1409`; slide track `#151613`, done `#1e7a4a`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: a light panel with a header "Tallyhut" and mono "Settings · Danger zone & payouts", plus a hint line with key caps: "Hold: pointer, or Space/Enter held · Slide: drag, or → End". Two columns below, a states sheet at the bottom.
2. Hold column: "Hold to delete workspace" (red, 56px, min 300px, trash icon, 1600ms), "Hold to remove card ·· 4417" (outline red, 48px, 1000ms), and a 56px round trash button on a pale red disc (900ms). Each has a mono caption.
3. Pointer down (primary button only) on a hold button: pointer capture, scale .985, label becomes "Keep holding", a tabular countdown shows the seconds left ("0.8s"), and the fill's `scaleX` follows elapsed / duration.
4. Release, pointer cancel, losing capture, or blur before full: the fill drains from its current value to 0 at a rate of a full bar per 260ms; label returns to idle; countdown clears.
5. Holding to 100%: the button turns ink with cream text, label "Workspace deleted" / "Card removed"; the round one shows a check and its `aria-label` becomes "Draft discarded". An "Undo" text button appears beside it. A polite live region announces e.g. "Workspace Northfield deleted. Undo available."
6. Undo restores the idle state, announces "Restored.", and returns focus to the button. Without Undo, the button resets after 6000ms.
7. Keyboard: Space or Enter keydown (ignoring repeats) begins the hold; keyup cancels. The click event is suppressed so a quick press never acts.
8. Slide column: "Slide to pay £1,240.00 to Odalys Print Co." (64px track, 56px thumb, max 400px) and "Slide to move £85 to Savings" (52px, 44px thumb, max 320px), then a "Reset sliders" link.
9. Dragging the thumb moves it 1:1 with the pointer; the green trail grows behind it; the track label fades out as `1 − progress × 1.4`.
10. Release at ≥ 92% of travel: thumb snaps to the end, track goes green, label becomes the done text, arrow becomes a check, live region says "Payment of 1,240 pounds sent. Reference TH-20931." Release earlier: the thumb and trail spring back over 420ms with a slight overshoot.
11. Slider keys: Right/Up +10%, PageUp +25%, Left/Down −10%, PageDown −25%, Home or Escape back to 0, End completes. Reaching 100% by arrows also completes.
12. States sheet: hold buttons at Default, Hover, Pressed 60%, Disabled, Focus, Done, plus the ring at 60%; sliders at Default, Hover, Dragging 55%, Disabled, Focus, Done.
13. Reduced motion: no press scale, no spring; the fill and drain still track time because they are the feedback.

## Tokens

```css
:root {
  --bg: #eeede7;        /* page */
  --panel: #fafaf6;     /* panel */
  --ink: #151613;       /* text, slider track, done state */
  --ink-2: #5c5e57;     /* captions ~6:1 */
  --line: #d9d8d0;
  --red: #c42a1c;       /* destructive; white text 5.7:1 */
  --red-deep: #7e1409;  /* hold fill */
  --red-tint: #f6dcd7;  /* outline fill, ring disc */
  --go: #1e7a4a;        /* slide trail and done; cream text ~4.9:1 */
  --cream: #f4f1e6;     /* thumb, text on ink */
  --off: #e4e3dc;  --off-ink: #8c8d86;   /* disabled */
  --sans: "Commissioner", system-ui, sans-serif;
  --mono: "Fragment Mono", ui-monospace, monospace;
  --ease: cubic-bezier(.2,.7,.2,1);
  --spring: cubic-bezier(.34,1.4,.64,1);
}
```

Sizes: hold L 56px / radius 12 / padding 24 / min-width 300; hold M 48px outline (inset 1.5px ring). Ring button 56px, arc svg 66px (r 31, stroke 3, dasharray 194.8). Slider L 64px track, 56px thumb inset 4px; M 52 / 44. Durations: L 1600ms, M 1000ms, icon 900ms. Completion threshold for slide: 92%.

Spacing: 4, 6, 10, 14, 16, 18, 22, 28, 32.

## Typography

| Role | Family | Size | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Brand | Commissioner | 22px | 700 | −0.02em | Title |
| Column heading | Commissioner | 17px | 600 | −0.01em | Sentence |
| Description | Commissioner | 13px | 400 | 0 | Sentence |
| Button / slider label | Commissioner | 15px (M 14) | 600 | 0 | Sentence |
| Countdown | Commissioner | 15px | 600, tabular-nums | 0 | — |
| Captions, hint, payee tag | Fragment Mono | 11–12px | 400 | 0 | Sentence |
| Sheet labels | Fragment Mono | 10px | 400 | 0.06em | Upper |

## Implementation notes

**Hold loop.** One rAF loop handles both filling and draining from wherever the bar is:

```js
function frame(now) {
  if (state === 'holding') {
    set(Math.min(1, from + (now - start) / ms));
    if (p >= 1) return finish();
  } else if (state === 'draining') {
    set(Math.max(0, from - (now - start) / 260));
    if (p <= 0) { state = 'idle'; return; }
  }
  raf = requestAnimationFrame(frame);
}
// begin(): state='holding'; from=p; start=performance.now();
// cancel(): state='draining'; from=p; start=performance.now();
```

`set(v)` writes `--p`; CSS uses it as `transform: scaleX(var(--p))` on the fill and `stroke-dashoffset: calc(194.8 * (1 - var(--p)))` on the ring.

**Pointer and keys.** Capture the pointer so sliding off the button doesn't cancel by accident, but losing capture does:

```js
btn.addEventListener('pointerdown', e => { if (e.button) return; btn.setPointerCapture(e.pointerId); begin(); });
['pointerup', 'pointercancel', 'lostpointercapture', 'blur'].forEach(t => btn.addEventListener(t, cancel));
btn.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) begin(); } });
btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); cancel(); } });
btn.addEventListener('click', e => e.preventDefault());
```

**Slider travel.** `max = track.clientWidth − thumb.offsetWidth − 8` (4px inset each side). Write `--x` in px and `--k = x / max`; the trail is `width: calc(var(--x) + 64px)` so it always covers the thumb.

Common mistakes:

- Using a CSS transition for the fill; on release you can't know the current value to drain from.
- Acting on `click` as well as on completion; a fast tap deletes the workspace.
- Forgetting `blur` cancel; Tab mid-hold leaves the bar filling.
- A slider built from divs with no role, no keys, no value text.
- Letting the page scroll under a touch drag.
- Using these for reversible, low-stakes actions. They are for deletes and money only.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
