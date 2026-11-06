<!-- Design Lounge Nº 637 · "Sleep breath wind-down" · www.designlounge.live -->

# Sleep breath wind-down

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The wind-down screen of **Hushwell**, an invented sleep app. One rich material, a lit sphere, sits on near-black: it swells and shrinks through a 4-7-8 breath (four seconds in, seven held, eight out), and its colours follow the hour, moonlit silver-blue at night, amber at dusk, peach at dawn, pale gold by day. A thin 300° ring around the orb doubles as the session dial: drag its ivory knob from 5 to 45 minutes and the end time updates beneath. Three sound chips (Rain, Brown noise, Harbour) are synthesised on the device with Web Audio, so nothing is fetched. Start lets the chrome dissolve over 1.4s, leaving the orb, the breath cue, a remaining time and one quiet "End session"; in the last stretch of the session the screen, the orb and the sound fade down together. The language is iOS 26-ish restraint: serif italics for the voice, a grotesk for the facts, one primary button.

## Structure

```
390 × 844 (54px top, 34px bottom clear)
┌──────────────────────────────────────┐
│ 54px safe area                       │
│ Hushwell                21:30 · Night│ header, 26px italic serif / 13px
│          ╭─────────────╮             │
│      ●  ╱   ╭───────╮   ╲            │ dial 300 × 300, ring r 140,
│        │   │  orb    │   │           │ orb 196px at scale 1 (min .72)
│        │   │ 196px   │   │           │ halo 340px behind
│         ╲   ╰───────╯   ╱            │
│        5  ╰─         ─╯  45          │ 60° gap at the bottom
│              Inhale                  │ 46px italic
│        through the nose · 3          │
│      ▬▬▬▬  ▬▬▬▬▬▬▬  ▬▬▬▬▬▬▬▬         │ cycle bar 228px, 4:7:8, 3px
│      In 4   Hold 7    Out 8          │
│         20 min · ends 21:50          │ margin-top 22
│ [ Rain ] [ Brown noise ] [ Harbour ] │ chips 48px, gap 8, margin-top auto
│ [        Start wind-down          ]  │ 56px, margin-top 14
│ 34px home indicator                  │
└──────────────────────────────────────┘
Session: header, arc, knob, length, chips and Start hidden; remaining time at the
length line's place; "End session" centred 34px above the bottom.
```

- `.app` (flex column, centred, padding 54 24 34) holds the `.veil`, `<header>`, `.dial`, `.phase`, `.len`, `.left`, `.sounds`, Start and End.
- `.dial`: an `<svg>` track (path, lit arc, ticks), `.halo`, `.orb`, two end labels, and `.knob` (`role="slider"`).
- `.sounds` is `role="group" aria-label="Sound"` with three `<button aria-pressed>` chips.
- A visually hidden `aria-live="polite"` line announces start, end and completion only.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---:|---|---|
| Orb + halo | always (19s loop, rAF) | scale | .72 → 1 → 1 → .72 | 4s / 7s / 8s | quadratic in-out | opacity .55 → 1 → .55 instead, no scale |
| Cycle bar | always | fill width | 0 → 100% per segment | 4s / 7s / 8s | linear (time) | kept (it is a readout) |
| Orb palette | hour changes | background | old → new gradient | 1.2s | `--calm` | 400ms |
| Chips | select | background, border, colour | off ↔ on | 200ms | `--ease` | kept |
| Chrome | Start / End | opacity, then visibility | 1 ↔ 0 | 1400ms | `--calm` | 400ms |
| Veil | Start | opacity | 0 → .35 | 1800ms | `--calm` | 400ms |
| Remaining time | Start | opacity | 0 → 1 | 1400ms, 600ms delay | `--calm` | 400ms |
| End session | Start | opacity | 0 → 1 | 1400ms, 900ms delay | `--calm` | 400ms |
| Fade window | last 20% (≤ 120s) | orb opacity, veil opacity, gain | 1 → .25, .35 → .95, level → 0 | the window | linear in time | same |
| Completion | 0:00 | orb opacity | → .2 | 3s | `--calm` | same |
| Start | press | scale | 1 → .98 | 160ms | `--ease` | kept |

Nothing flashes and nothing moves faster than 4 seconds once the session starts.

## States

- **Set-up:** full chrome; knob ivory with a 5px `--bg` collar so it sits "on" the ring.
- **Dragging:** cursor `grabbing`; the arc and end time follow the pointer live; the knob captures the pointer.
- **Chip selected:** `--chip-on` fill, `--chip-on-line` border, `--text` label (`aria-pressed="true"`). Unselected: `--surface`, `--line`, `--text-2`.
- **Focus-visible:** 2px `--text` outline, 4px offset (knob, chips, Start, End).
- **Session:** chrome hidden, veil at 35%, remaining time ticking once per frame.
- **Fading:** orb and veil interpolate across the window; the sound line keeps its text.
- **Complete:** "Sleep well / Session complete", orb at 20%, auto-return after 6s.
- **No sound:** session line reads "Silence, screen dims at the end".

## Accessibility

- The knob is `role="slider"` with `aria-valuemin="5"`, `aria-valuemax="45"`, `aria-valuenow` and `aria-valuetext="20 minutes"`, labelled "Session length"; its hit area is 46px via a `::before` inset of −10px.
- The breath cue is `aria-hidden` and not live: announcing every phase would be noise. Starting announces once: "Wind-down started, 20 minutes. Breathe in for 4, hold for 7, out for 8."
- Sound chips use `aria-pressed`; the group is labelled "Sound".
- Escape ends a session from anywhere; End takes focus on start and Start takes focus on end.
- Contrast: `--text` on `--bg` 15.5:1; `--text-2` on `--bg` 8.8:1 and on `--surface` 8.0:1; `--text-3` on `--bg` 6.4:1; `--bg` on the ivory Start 15.5:1; selected chip label 11.3:1.
- Hit targets: chips 48px, Start 56px, End 44px, knob 46px.
- Audio is generated locally and only starts from the Start tap, so it never autoplays.

## Responsive rules

- 390 × 844: as drawn.
- 360 wide: the dial shrinks to 280px (orb 182px, ring r 130); the chips keep equal thirds and "Brown noise" may drop its icon.
- Under 760px tall: the cycle bar moves beside the guidance line and the gap above the chips closes first.
- Tablet: keep the 430px column centred; scale the dial to 360px.
- No horizontal scroll at any width.

## Acceptance checklist

**Always**
- [ ] The breath runs 4 s in, 7 s hold, 8 s out on `requestAnimationFrame`, with the phase word and a per-phase countdown.
- [ ] A three-segment cycle bar is proportioned 4 : 7 : 8 and fills with the current phase.
- [ ] The orb's gradient comes from the local hour in four bands and updates while the screen is open.
- [ ] The dial is a 300° ring around the orb; dragging and the keyboard set whole minutes from 5 to 45; the end time follows.
- [ ] Sound chips are single-select with an off state; audio starts only after Start.
- [ ] Start hides the chrome with `visibility:hidden` after the fade, leaving orb, cue, remaining time and End.
- [ ] The last 20% (at most 120s) dims the orb, darkens the veil and fades the sound together.
- [ ] Reduced motion swaps the orb's scale for an opacity breath; everything still works.
- [ ] Text never sits on the orb gradient; nothing fixed in the top 54px or bottom 34px.

**This demo**
- [ ] Hushwell; default 20 minutes; Rain selected; Start reads "Start wind-down".
- [ ] Bands: Dawn 05–09, Day 09–17, Dusk 17–21, Night 21–05, with the hexes in Tokens.
- [ ] Completion reads "Sleep well" and returns after 6s.
- [ ] Cormorant Garamond for voice and numbers, Hanken Grotesk for everything else.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: Hushwell wordmark, clock and time-of-day name ("21:30 · Night"), dial set to 20 minutes with the arc lit from the 5 end to the knob, "20 min · ends 21:50", Rain selected, "Start wind-down".
2. The orb breathes from the first frame on a 19s cycle driven by `requestAnimationFrame`: scale .72 → 1 over 4s (ease-in-out), held at 1 for 7s, 1 → .72 over 8s. A halo behind it scales with it.
3. Under the orb the phase word ("Inhale", "Hold", "Exhale") in a 46px italic serif, a guidance line with a countdown ("through the nose · 3"), and a three-segment cycle bar whose widths are 4 : 7 : 8 ("In 4", "Hold 7", "Out 8"). The current segment fills left to right and its label turns `--text`.
4. Time of day picks the orb palette from the local hour: 05–09 Dawn, 09–17 Day, 17–21 Dusk, 21–05 Night. It re-checks every minute and crossfades.
5. Dial: drag the knob (or press anywhere on the ring band, 28px inside to 24px outside the track) to set 5–45 minutes in whole minutes. The arc runs 300°, from −150° (5 min, lower left) to +150° (45 min, lower right) with the gap at the bottom; nine ticks mark every 5 minutes. The end time is recomputed from the clock on every change.
6. Keyboard on the knob: arrows ±1 minute, Page Up / Page Down ±5, Home 5, End 45.
7. Sound chips are single-select and can all be off: tap the selected chip to deselect it.
8. Start: the header, dial arc and knob, length line, chips and Start fade out over 1.4s and become `visibility:hidden`; a veil fades to 35% black over 1.8s; the remaining time ("19:59", 40px serif) and the sound line ("Rain, fading out with you") fade in after 600ms; "End session" (44px, hairline) fades in after 900ms and takes focus. The breath restarts at Inhale. The chosen sound fades in over about 6s.
9. The fade window is the last 20% of the session, at most 120s. Across it the orb and halo dim from 100% to 25%, the veil darkens from 35% to 95% and the sound gain glides to zero.
10. At zero: the time reads "Sleep well", the line "Session complete", the orb sits at 20%. After 6s the screen returns to the set-up state.
11. End session or Escape at any point: the sound fades in 0.3s, the chrome returns, focus goes to Start.

## Tokens

```css
:root {
  /* colour */
  --bg: #0b0f14;        /* night ground */
  --surface: #141a22;   /* chips */
  --line: #263040;      /* dial track, chip borders, empty cycle bar */
  --text: #ece6da;      /* ivory: phase word, knob, Start fill */
  --text-2: #a9b0ba;    /* secondary text, lit cycle bar */
  --text-3: #8d95a1;    /* tertiary text, dial end labels */
  --arc: #c9cfd8;       /* lit dial arc */
  --tick: #3a4352;      /* dial ticks, End border */
  --chip-on: #232c39; --chip-on-line: #5b6b82;
  --veil: #030507;
  /* orb palette, set from the hour */
  --c1: #e6ecf7; --c2: #8fa7cf; --c3: #1e3a5c; --glow: rgba(143,167,207,.32);   /* Night 21–05 */
  --dusk-1: #ffd9a8; --dusk-2: #e0835a; --dusk-3: #4f2f45; --dusk-glow: rgba(224,131,90,.30);
  --dawn-1: #ffe3c8; --dawn-2: #f2a584; --dawn-3: #6e3a4a; --dawn-glow: rgba(242,165,132,.30);
  --day-1: #fff4d6;  --day-2: #e9c27a;  --day-3: #4e6f76;  --day-glow: rgba(233,194,122,.28);
  /* type */
  --serif: "Cormorant Garamond", Georgia, serif;
  --sans: "Hanken Grotesk", system-ui, sans-serif;
  --fs-phase: 46px; --fs-left: 40px; --fs-mark: 26px; --fs-len: 22px;
  --fs-btn: 16px; --fs-body: 15px; --fs-small: 14px; --fs-meta: 13px; --fs-label: 12px;
  /* size */
  --gutter: 24px; --ring: 300px; --ring-r: 140px; --orb: 196px; --halo: 340px;
  --knob: 26px; --knob-hit: 46px; --chip-h: 48px; --btn-h: 56px; --stop-h: 44px; --cycle-w: 228px;
  --r-pill: 999px;
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --calm: cubic-bezier(.45,0,.2,1);
  --breath-in: 4s; --breath-hold: 7s; --breath-out: 8s; --orb-min: .72;
  --t-chrome: 1400ms; --t-veil: 1800ms; --t-left-delay: 600ms; --t-stop-delay: 900ms; --t-done-hold: 6000ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
|---|---|---:|---:|---:|---:|---|
| Phase word | Cormorant Garamond | 46px | 400 italic | 1 | .01em | sentence case |
| Remaining time | Cormorant Garamond | 40px | 500 | 1 | 0 | lining, tabular figures |
| Wordmark | Cormorant Garamond | 26px | 500 italic | 1 | .01em | |
| Length value | Cormorant Garamond | 22px | 500 | 1 | 0 | lining figures |
| Start | Hanken Grotesk | 16px | 600 | 1 | .01em | |
| Guidance, chips, length meta | Hanken Grotesk | 14px | 400–500 | 1.45 | 0 | |
| Clock, sound line | Hanken Grotesk | 13px | 400 | 1.45 | 0 | tabular |
| Cycle labels, dial ends | Hanken Grotesk | 12px | 400 | 1.2 | 0 | tabular |

Cormorant's default figures are old-style; set `font-variant-numeric: lining-nums` wherever a number is read as a time.

## Implementation notes

**One loop for breath and session.** Derive the phase from elapsed time instead of chaining timeouts, so the cycle never drifts:

```js
const frame = (now) => {
  const c = ((now - t0) / 1000) % 19;
  const i = c < 4 ? 0 : c < 11 ? 1 : 2, into = i === 0 ? c : i === 1 ? c - 4 : c - 11;
  const k = i === 0 ? ease(into / 4) : i === 1 ? 1 : 1 - ease(into / 8);
  let dim = 1;
  if (sess) {
    const rem = Math.max(0, sess.mins * 60 - (now - sess.start) / 1000);
    const fw = Math.min(120, sess.mins * 60 * .2), f = rem < fw ? rem / fw : 1;
    dim = .25 + .75 * f; veil.style.opacity = .35 + (1 - f) * .6;
    if (rem <= 0) return finish();
  }
  orb.style.transform = `scale(${.72 + .28 * k})`; orb.style.opacity = dim;
  requestAnimationFrame(frame);
};
```

**Angle to minutes on a 300° ring.** Measure clockwise from 12 o'clock with `atan2(x, -y)`; a pointer in the bottom gap clamps to the nearer end (5 or 45):

```js
let deg = Math.atan2(x, -y) * 180 / Math.PI;      // −180..180, 0 = up; the gap is |deg| > 150
deg = Math.max(-150, Math.min(150, deg));
setMins(5 + (deg + 150) / 300 * 40);
```

**Sounds without files.** Fill a 3s buffer with white noise (rain, through a 2.4 kHz band-pass) or brown noise (`l = (l + .02 * w) / 1.02`, through a 520 Hz or 320 Hz low-pass); loop it; for Harbour add a .09 Hz oscillator into the gain for a slow swell. Fade with `gain.setTargetAtTime(0, now, window / 4)`.

Common mistakes: putting the phase word on the orb (it fails contrast on the bright highlight); a purple-to-blue night gradient; an orb that snaps between phases; leaving the hidden chrome focusable during a session; starting audio on load.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
