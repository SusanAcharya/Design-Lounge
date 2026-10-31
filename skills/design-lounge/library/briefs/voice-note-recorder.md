<!-- Design Lounge Nº 616 · "Hold-to-record voice note" · www.designlounge.live -->

# Hold-to-record voice note

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The voice-note control in the chat composer of "Furrow", an invented messaging app for allotment neighbours, shown mid-conversation between you and Wren Okafor about frost-bitten broad beans. Press and hold the moss-green mic: it swells to 1.5× on a spring and turns vermilion, a live waveform grows from the left, a timer counts. Slide left and a bin fades in and eats the note; slide up past a lock pill and recording goes hands-free with Stop and Send; let go and the note lands in the thread as a bubble with a waveform you can play, drag to scrub, or step with arrow keys. The detail worth copying is that every gesture has a twin: Space on the mic records hands-free in the locked state, Escape discards, and the bubble's scrub knob is a real slider. The microphone is never requested; amplitude is simulated.

## Structure

```
390 × 844 (app column max 440px, centred on #E6E1D5 above that)
┌──────────────────────────────────────┐
│ 54px clear for status bar            │
│ (‹) (WO) Wren Okafor          (call) │ header, 62px top pad, 1px rule
│          Plot 14 · Fernhill …        │
├──────────────────────────────────────┤
│            Yesterday                 │ thread: flex column, scrolls,
│ [incoming 82%]                       │ first child margin-top:auto
│                  [outgoing moss 82%] │
│            Today                     │
│ [incoming]                           │
│                  [outgoing]          │
│ [(▶) ▌▍▌▎▍●▏▏▏▏▏  0:05 ]  252px     │ voice bubble
│                 ┌───────────────┐    │
│                 │Hold to record │ tip│ 78px thread bottom pad while tip shows
│                 └──────────── v─┘    │
├──────────────────────────────────────┤
│ (+) ( Message                ) (mic) │ grid 40 / 1fr / 48, gap 8
│                                      │ padding 10 12 44 10
└──────────────────────────────────────┘
Hold:   [bin][●][0:03][▌▍▌▎▍▌  ][‹ Slide to cancel]  (MIC 72)
                                                  [lock pill 40×92 above mic]
Locked: [bin][●][lock][0:07][▌▍▌▎▍▌▍▌▎▍  ][■]  (send 48)
```

- `header` with two icon `button`s (40px) and the contact name.
- `main.thread` with `aria-label="Messages with Wren Okafor"`; each message a `div.msg.in|out` holding `p` or `.note`, and a `.meta` time.
- `.note`: `button.play`, `div.wave` (two `aria-hidden` bar layers and a `span.knob role="slider"`), `span.dur` (`aria-hidden`).
- `.composer` carries `data-s` = "" | hold | locked | draft | bin. Inside: tip, lock pill (`aria-hidden`), attach `button`, `input.field`, `div.rec` strip (absolute over the first two columns, `visibility:hidden` when idle), `button.mic`.
- One visually hidden `p aria-live="polite"`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Mic swell | hold | scale, background | 1 → 1.5, moss → `#C23B26` | 420 / 160ms | --spring / --ease | scale 1.2, instant |
| Amplitude halo | each tick | box-shadow spread | 0–14px | 90ms | linear | same |
| Mic follow | drag | translate | finger × 0.9 | 0 | — | same |
| Mic return | lock, release | translate | → 0 | 380ms | --spring | instant |
| Live bar | tick | scale Y | .2 → 1 | 140ms | --ease | none |
| Recording dot | recording | opacity | 1 → .35 → 1 | 1100ms loop | --ease | static |
| Cancel label | drag left | translate, opacity | 0 → −92px, 1 → 0 | 0 | — | same |
| Lock pill | hold | opacity, translate | 0 → 1, 14px → 0 | 180 / 320ms | --soft | instant |
| Discard | 110px or bin | dot arc, lid rotate, bin sink | see Reference 6 | 420 / 640 / 900ms | expo-ish | reset after 200ms |
| Bubble arrival | send | translate, scale, opacity | 22px .92 0 → 0 1 1 | 420ms | --soft | none |
| Tip wiggle | short tap | scale | 1 → 1.06 → .98 → 1 | 420ms | --spring | none |

## States

- Mic idle: moss; hover `--moss-2`; focus-visible 2.5px `#C23B26` outline, offset 3px.
- Hold: red, 1.5×, halo; strip shows dot, timer, wave, cancel label; lock pill visible.
- Locked: mic is moss Send (paper plane, 16px filled); strip shows bin, dot, closed lock icon, timer, wave, Stop (40px ring, red 1.5px border, red square).
- Draft: dot and bars `--ink-2`, Stop hidden, dot still.
- Bin: timer and wave fade in 200ms while the bin plays.
- Voice bubble playing: pause icon; knob scales 1.25 on hover or focus.
- Message field focus: border becomes `--moss`.

## Accessibility

- The mic is one `button` whose `aria-label` flips "Record voice note" ↔ "Send voice note"; `aria-describedby` points to the tip.
- Space/Enter on the mic records hands-free (locked) so keyboard users never need to hold. Escape discards. Stop and the bin are real buttons inside the strip, in tab order only while recording.
- A click after a pointer hold is swallowed (`skip` flag) so a release never double-sends; keyboard clicks have `detail === 0`.
- Live region messages: "Recording. Release to send.", "Locked, recording hands-free…", "Stopped at 0:07. Send or discard.", "Voice note sent, 0:07.", "Voice note discarded."
- The knob is `role="slider"` with `aria-valuemin 0`, `aria-valuemax` = duration seconds, `aria-valuenow`, `aria-valuetext` "0:05 of 0:14".
- Contrast: body text 15:1, meta 6.2:1 on `--app`, outgoing text 9.6:1, field edge 3.4:1, tip text 15:1.
- Hit targets: mic 48px, play 40px, stop and bin 40px, knob 12px drawn inside a 34px-tall scrub area.
- `touch-action: none` on the mic and on every wave so the thread never scrolls during a gesture.

## Responsive rules

- At 360 wide the composer grid holds; the strip shrinks the wave first (it is `flex:1; min-width:0`).
- The app column is `max-width: 440px`, centred; above that the page is `#E6E1D5` with a 1px `--line` edge.
- Bubbles are max 82% wide; voice bubbles are a fixed 252px.
- Tablet: keep the column, never stretch the composer past 440px.

## Acceptance checklist

### Always

- [ ] Pointer down records immediately; the mic swells on a spring and the waveform grows from the left.
- [ ] Release after ≥ 350ms sends; a shorter tap discards silently and re-shows the hint.
- [ ] Sliding left past the cancel distance discards with a bin animation and an announcement.
- [ ] Sliding up past the lock distance locks, returns the mic to its seat, and shows Stop and Send.
- [ ] The drag locks to one axis after 8px.
- [ ] Space/Enter on the mic starts a locked recording; pressing again sends; Escape discards.
- [ ] Sent notes become bubbles whose waveform is built from the recorded samples.
- [ ] Bubble playback fills the played part; drag and arrow keys scrub; the knob is a slider.
- [ ] No microphone permission is ever requested in the demo.
- [ ] Reduced motion removes springs and the bin animation and stays fully usable.

### This demo

- [ ] Furrow thread with Wren Okafor, "Plot 14 · Fernhill allotments", Wren's note 0:14 paused at 0:05.
- [ ] Mic `#24483A` 48px → 1.5× `#C23B26`; cancel 110px, lock 80px, tick 90ms.
- [ ] Tip "Hold to record / Slide up to lock, left to cancel".
- [ ] New notes stamped 08:24, 08:25 and so on.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame (390 × 844): a header with back, a "WO" avatar, "Wren Okafor / Plot 14 · Fernhill allotments", and call. The thread shows "Yesterday" with two messages, "Today" with two more, then Wren's 0:14 voice note paused 38% in (reads "0:05"). Composer: plus, a "Message" pill field, and a 48px moss mic. A dark tip above the mic reads "Hold to record / Slide up to lock, left to cancel".
2. Pointer down (primary only) on the mic: pointer capture, state `hold`. The mic scales 1 → 1.5 with a 420ms overshoot spring and turns `#C23B26`; a halo ring around it breathes with the amplitude (0–14px). The tip hides for good.
3. In `hold` the composer row is covered by a recording strip: pulsing red dot, timer "0:00", live waveform, and "‹ Slide to cancel". A 40 × 92px lock pill rises 14px into view above the mic with a lock and a bobbing up-chevron.
4. Every 90ms a new bar is appended (3px wide, 2px gap, height 3 + amplitude × 25px), growing in from 20% height over 140ms. When the strip is full the oldest bar is removed, so the wave scrolls left.
5. After 8px of travel the drag locks to one axis. The mic follows the finger at 0.9× along that axis only (left or up; right and down clamp to 0).
6. Sliding left: `--cx` = distance / 110px. The "Slide to cancel" label moves left by `cx × 92px` and fades (`1 − cx × 1.15`); a red bin grows from 0.6 to 1.1 scale at the strip's left. At 110px the note is discarded: the dot hops in an arc into the bin (420ms), the lid opens 38° and closes (640ms), and the bin sinks 10px and fades (900ms total). Announce "Voice note discarded."
7. Sliding up: `--ly` = distance / 80px. The lock shackle closes 3px and the chevron fades. At 80px the state becomes `locked`: the mic springs back to its seat (380ms), shrinks to 1×, turns moss and shows a send arrow. The strip shows bin, dot, a small closed lock, timer, wave, and a 40px Stop button.
8. Releasing in `hold` after at least 350ms sends. A release under 350ms is a tap: discard silently, re-show the tip with a 420ms wiggle, and announce "Hold to record. Or press Space to record hands-free."
9. Send: the samples are bucketed into 30 bars (max per bucket) and a moss bubble appears at the end of the thread, rising 22px and scaling .92 → 1 over 420ms, timestamp 08:24 (then 08:25…), with a sent tick. The thread scrolls to the bottom.
10. Locked: Stop freezes the strip into a draft (grey dot and bars, no Stop button). Send (the mic) sends; the bin discards with the same animation; Escape discards from `hold`, `locked` or `draft`.
11. Keyboard: Space or Enter on the focused mic starts recording straight into `locked`, and focus stays on the same button, now labelled "Send voice note". Pressing it again sends.
12. Voice bubbles: a 40px play button and a waveform. Play runs a rAF clock at real time; the played part fills from the left with a clip, a 12px knob rides the edge, and the time shows the position. At the end it resets to 0 and shows the duration. Only one note plays at a time; recording pauses playback.
13. Scrubbing: pointer down anywhere on the wave captures the pointer and seeks; dragging scrubs. The knob is the slider: Left/Right ±1s, PageUp/PageDown ±5s, Home, End, Space plays or pauses.
14. Reduced motion: no animations or springs; the hold scale is 1.2 instead of 1.5; discard resets after 200ms with no bin animation; bubbles appear in place.

## Tokens

```css
:root {
  --page: #e6e1d5;      /* outside the app column */
  --app: #f4f1e9;       /* thread ground */
  --card: #fffdf8;      /* incoming bubble, composer */
  --ink: #1e1d19;
  --ink-2: #5c5950;     /* meta, placeholder, hints ~6.2:1 on --app */
  --line: #ded8ca;      /* hairlines, incoming bubble border */
  --edge: #8c877a;      /* message field border 3.4:1 on --card */
  --moss: #24483a;      /* mic, outgoing bubbles, play */
  --moss-2: #1a382c;    /* mic hover */
  --on-moss: #f4f0e6;   /* text on moss 9.6:1 */
  --meta-moss: #b9c7bc;
  --rec: #c23b26;       /* recording, bin, stop */
  --rec-halo: rgba(194,59,38,.16);
  --bar: #b5ae9e;       /* unplayed bars, incoming */
  --bar-moss: #6f8a7c;  /* unplayed bars, outgoing */
  --sprout: #cfdcb8;    /* avatar disc */
  --tip: #1e1d19;
  --sans: "Parkinsans", system-ui, sans-serif;
  --num: "Radio Canada Big", system-ui, sans-serif;
  --r-bubble: 20px; --r-bubble-tail: 6px; --r-note: 22px; --r-field: 22px; --r-tip: 14px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --spring: cubic-bezier(.34,1.56,.64,1);   /* mic swell and return */
  --soft: cubic-bezier(.34,1.3,.64,1);      /* lock pill, bubble arrival */
  --t-swell: 420ms; --t-return: 380ms; --t-tick: 90ms; --t-bar: 140ms; --t-bin: 900ms;
  --cancel: 110px; --lock: 80px; --tap: 350ms;
}
```

Spacing: 2, 4, 6, 8, 10, 12, 14, 16, 18. Shadow (lock pill only): `0 6px 18px rgba(30,29,25,.12)`.

## Typography

| Role | Family | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| Contact name | Radio Canada Big | 16px | 600 | 1.2 | −0.01em |
| Avatar initials | Radio Canada Big | 14px | 600 | — | — |
| Status line | Parkinsans | 12.5px | 400 | 1.4 | `--ink-2` |
| Message text, field | Parkinsans | 15px | 400 | 1.38 | — |
| Day divider, hint label | Parkinsans | 12–13.5px | 400 | — | `--ink-2` |
| Times, durations | Radio Canada Big | 11.5–12.5px | 500 | — | no tabular figures (the colon gaps) |
| Recording timer | Radio Canada Big | 15px | 600 | — | min-width 36px |
| Tip | Parkinsans | 13px | 600 / 400 | 1.35 | two lines |

## Implementation notes

**One pointer session, three exits.** Capture on down; move decides cancel or lock; up sends only if still holding:

```js
mic.addEventListener('pointerdown', e => {
  if (e.button || state !== 'idle') return;
  mic.setPointerCapture(e.pointerId);
  sess = { x: e.clientX, y: e.clientY, ax: null, t: performance.now() };
  start('hold');
});
mic.addEventListener('pointermove', e => {
  if (!sess || state !== 'hold') return;
  let dx = Math.min(0, e.clientX - sess.x), dy = Math.min(0, e.clientY - sess.y);
  if (!sess.ax && Math.hypot(dx, dy) > 8) sess.ax = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  if (sess.ax !== 'x') dx = 0; if (sess.ax !== 'y') dy = 0;
  mic.style.translate = dx * .9 + 'px ' + dy * .9 + 'px';
  comp.style.setProperty('--cx', Math.min(1, -dx / 110));
  comp.style.setProperty('--ly', Math.min(1, -dy / 80));
  if (-dx >= 110) discard(); else if (-dy >= 80) lock();
});
mic.addEventListener('pointerup', () => {
  if (!sess) return; skip = true;
  const short = performance.now() - sess.t < 350; sess = null;
  if (state === 'hold') short ? (reset(), nudge()) : send();
});
```

**Separate `scale` and `translate`.** Use the individual CSS properties so the swell can spring while the follow tracks the finger with no transition. In `hold`, leave `translate` out of the transition list; outside `hold`, transition it with the spring so the mic flies home:

```css
.mic { transition: scale 420ms var(--spring), translate 380ms var(--spring), background-color 160ms var(--ease); }
[data-s=hold] .mic { scale: 1.5; background: var(--rec);
  transition: scale 420ms var(--spring), background-color 160ms var(--ease), box-shadow 90ms linear; }
```

**Played fill without per-bar work.** Render the bars twice and clip the top copy to `--p`; the knob sits at `left: calc(var(--p) * 100%)`:

```css
.bars.top { clip-path: inset(0 calc(100% - var(--p) * 100%) 0 0); }
```

Common mistakes:

- Asking for the microphone in a demo; simulate amplitude with a syllable-shaped function plus jitter.
- Acting on `click` after a hold (it fires after `pointerup` and double-sends once locked).
- Letting the mic follow diagonally; it reads as loose. Lock the axis.
- Forgetting `touch-action: none`, so the thread scrolls under the thumb.
- Keyboard users stuck with "hold": give them the locked state directly.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
