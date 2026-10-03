<!-- Design Lounge Nº 331 · "Phone launch splash lift" · designlounge.vercel.app -->

# Phone launch splash lift

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is the Industrial family: 2px radii, mono labels, one acid accent.

## What it is

The launch moment of Gantry, a fictional yard-operations app for truck docks. A near-black splash fills the phone. A square G mark draws itself in acid green in three strokes. The word GANTRY rises letter by letter out of a mask. A mono line reads "Yard operations". After a short hold, the whole splash slides up and off, trailing a 1px acid edge, and the real home screen settles in underneath. The home is not a placeholder. It greets the shift lead, shows inbound trailers with a bar strip and the next free dock with a progress bar. The whole run is 1520ms. The detail worth copying is that the home is already rendered under the splash, so the lift reveals content, not a blank screen that then loads.

## Reference behaviour

1. Load. The splash covers the frame. Background `#0c0d0b`. The home sits under it, scaled to 0.965, moved down 12px, at 35% opacity.
2. 0ms. Stroke 1 of the mark (top bar, left side, bottom bar, length 176) starts drawing. 440ms, expo out.
3. 70ms. Stroke 2 (the right side going up, length 28) starts. 440ms.
4. 140ms. Stroke 3 (the inner bar, length 26) starts. 440ms. The mark is done at 580ms.
5. 260ms. G rises from 105% below its mask in 380ms. A, N, T, R, Y follow at 40ms steps. Y lands at 840ms.
6. 700ms. "Yard operations" and the footer line ("v4.2.0", "Yard 4 · online") fade in over 220ms.
7. 920ms to 1100ms. Hold. Nothing moves.
8. 1100ms. The splash lifts to translateY(-101%) in 420ms with the iOS sheet curve. Its 1px acid bottom border sweeps up the screen. At the same time the home scales to 1, moves to 0 and fades to full in 420ms.
9. 1520ms. Done. The home is fully interactive. A hidden status line says "Gantry home loaded".
10. Tap "Replay" (bottom right, above the main button). The class that runs the timeline is removed, a reflow is forced, and the class is added back. The run starts again from step 1.
11. Reduced motion. No splash is shown. The home fades in from 0 to 1 in 200ms. Replay repeats the fade.

## Structure

```
390 x 844

Home (under the splash)
+--------------------------------------+
| 54px clearance                       |
| [G] GANTRY                    [bell] | 44px row
| SHIFT 2 · YARD 4 · WED 06:12         | 11px mono, accent on "Shift 2"
| Morning, Dev.                        | 40px / 700
| Six trailers are late. Dock 7 ...    | 15px
| +----------------------------------+ |
| | INBOUND TODAY          [6 LATE]  | | card, 1px line, 2px radius
| | 38  trailers booked              | | 52px number
| | ||| | || ||| | ||                 | | 12 bars, 40px tall, 3 acid
| | 05:00      11:00          17:00  | |
| +----------------------------------+ |
| +----------------------------------+ |
| | NEXT FREE DOCK           [BAY B] | |
| | Dock 7                    12 min | |
| | [==================------]       | | 6px meter, 72%
| | Trailer KT-4471 unloading    72% | |
| +----------------------------------+ |
|                          [ REPLAY ]  | 44px, fixed
| [ Start yard check              -> ] | 52px, acid
| 34px clearance                       |
+--------------------------------------+

Splash (on top, fixed, inset 0)
          [ G mark 84x84 ]
             G A N T R Y               44px / 800, 0.16em
           YARD OPERATIONS             11px mono
  v4.2.0                 Yard 4 · online   58px from bottom
```

- The home is a `main` with a 44px header row, a mono meta `p`, an `h1`, a sub `p`, two `section` cards and a full-width `button`.
- Each card has `aria-label`. The bar strip is `aria-hidden`. The dock meter is `role="progressbar"` with `aria-valuenow="72"`.
- The splash is a fixed `div` with `aria-hidden="true"` and `pointer-events: none`. It holds an inline SVG with three `path` elements, a `div` of six letter `span`s, and two mono lines.
- Each letter span sets `--i` from 0 to 5. Each path sets `--l` to its length.
- The Replay button is fixed, above the splash in z-order, so it is always reachable.

## Tokens

```css
:root {
  /* colour */
  --splash: #0c0d0b;     /* splash plate */
  --bg: #141513;         /* home page */
  --surface: #1b1c1a;    /* cards */
  --surface-2: #232421;  /* bar track, meter track, replay chip */
  --ink: #ecece6;        /* headings, numbers */
  --ink-2: #a3a59c;      /* sub text, card titles */
  --ink-3: #7d8077;      /* mono meta, legends */
  --line: #2c2e2a;       /* card borders */
  --accent: #c8f031;     /* acid: mark, late bars, CTA, lift edge, focus */
  --on-accent: #0c0d0b;

  /* type */
  --sans: "Archivo", system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;

  /* shape */
  --radius: 2px;
  --hit: 44px;

  /* space: 4px base */
  --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px;

  /* motion */
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --sheet: cubic-bezier(0.32, 0.72, 0, 1);
  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --t-draw: 440ms;
  --t-rise: 380ms;
  --t-stagger: 40ms;
  --t-hold-end: 1100ms;
  --t-lift: 420ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Splash word | Archivo | 44px | 800 | 1.05 | 0.16em | upper |
| Splash line | JetBrains Mono | 11px | 500 | 1 | 0.16em | upper |
| Splash footer | JetBrains Mono | 11px | 400 | 1 | 0 | as set |
| Home brand | Archivo | 15px | 800 | 1 | 0.14em | upper |
| Meta line | JetBrains Mono | 11px | 500 | 1 | 0.08em | upper |
| Greeting | Archivo | 40px | 700 | 1 | -0.03em | sentence |
| Sub | Archivo | 15px | 400 | 1.4 | 0 | sentence |
| Card title, tag | JetBrains Mono | 11px | 500 | 1 | 0.08em | upper |
| Big number | Archivo | 52px | 700 | 0.9 | -0.04em | figures |
| Dock name | Archivo | 28px | 700 | 1 | -0.02em | title |
| Legend | JetBrains Mono | 11px | 400 | 1 | 0 | as set |
| CTA | Archivo | 15px | 700 | 1 | 0.02em | sentence |
| Replay | JetBrains Mono | 12px | 500 | 1 | 0.06em | upper |

- Mono is for labels, times and codes. Archivo is for words and numbers people read.
- The splash word has `padding-left: 0.16em` so its tracking stays optically centred.

## Motion

| Thing | Start | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Stroke 1 | 0ms | stroke-dashoffset | 176 → 0 | 440ms | `--expo` | not shown |
| Stroke 2 | 70ms | stroke-dashoffset | 28 → 0 | 440ms | `--expo` | not shown |
| Stroke 3 | 140ms | stroke-dashoffset | 26 → 0 | 440ms | `--expo` | not shown |
| Letters G to Y | 260ms + i × 40ms | translateY | 105% → 0 | 380ms | `--expo` | not shown |
| Line and footer | 700ms | opacity | 0 → 1 | 220ms | `--std` | not shown |
| Hold | 920ms | none | none | 180ms | none | none |
| Splash lift | 1100ms | translateY | 0 → -101% | 420ms | `--sheet` | not shown |
| Home settle | 1100ms | scale, translateY, opacity | 0.965, 12px, 0.35 → 1, 0, 1 | 420ms | `--sheet` | opacity 0 → 1, 200ms |

- Total run: 1100 + 420 = 1520ms. Keep it under 1600ms.
- Use `animation-fill-mode: both` on every step, so each part holds its start pose during its delay and its end pose after.
- The splash rests at translateY(-101%) without the run class. A forgotten class then shows the home, not a stuck splash.
- -101%, not -100%, so the 1px acid border also leaves the frame.

## States

- Running: `body.run` is set. The splash animates.
- Finished: the splash rests off-screen. The home is at full opacity and scale.
- Replay hover: border turns `--accent`.
- Focus-visible: 2px `--accent` outline, 2px offset, on Replay, the bell, and the CTA.
- CTA: `--accent` fill, `--on-accent` text, 52px tall, 2px radius, arrow on the right.
- Tag "6 late": filled `--accent`. Tag "Bay B": outlined in `--line`.
- Late bars: `--accent`. Other bars: `--surface-2`.
- Loading or error: not part of this piece. If data is not ready at 1100ms, lift anyway and show the home's own skeleton.

## Accessibility

- The splash is `aria-hidden="true"` and `pointer-events: none`. It is decoration.
- The home is in the DOM from the first frame, so a screen reader reads it at once.
- A `role="status"` line says "Gantry home loaded" when the lift ends.
- The bell is a 44×44 button labelled "Alerts, 2 new".
- Replay is a 44px tall button labelled "Replay launch animation".
- The dock meter is a `progressbar` with a label and a value.
- Contrast: `#ecece6` on `#141513` is about 15:1. `#a3a59c` on `#1b1c1a` is about 7:1. `#7d8077` on `#141513` is about 4.6:1. `#0c0d0b` on `#c8f031` is about 15:1.
- Reduced motion shows no splash. The home fades in over 200ms.
- Do not block input for the full 1520ms. The splash has no pointer events.

## Responsive rules

- The frame is 390×844. The home uses max(54px, env(safe-area-inset-top)) at the top and max(34px, env(safe-area-inset-bottom)) at the bottom.
- The splash centres its group at any size. The footer line sits 58px from the bottom.
- At 360 wide, keep the 44px splash word. GANTRY with tracking is about 260px wide.
- Under 760px tall, the card gap above shrinks to 18px and the big number drops to 44px.
- At tablet width, keep the splash full screen. Centre the home in a 480px column.
- Do not draw a status bar. The system bar sits over the splash.

## Acceptance checklist

### Always

- [ ] The home screen is rendered under the splash from the first frame.
- [ ] The mark draws with stroke-dashoffset. Each path's dash equals its length.
- [ ] The letters rise from a mask with a fixed stagger.
- [ ] There is a still hold before the lift.
- [ ] The splash leaves by moving, not by fading.
- [ ] The total run is under 1600ms.
- [ ] The splash is `aria-hidden` and has no pointer events.
- [ ] A Replay control, 44px or taller, restarts the run.
- [ ] Reduced motion skips the splash and fades the home in 200ms.
- [ ] Focus is visible on every control.

### This demo

- [ ] The mark is a square G drawn in `#c8f031` in three strokes of length 176, 28 and 26.
- [ ] The word reads GANTRY in Archivo 800 at 44px, with letters 40ms apart from 260ms.
- [ ] The lift starts at 1100ms and lasts 420ms with `cubic-bezier(0.32, 0.72, 0, 1)`.
- [ ] The home greets "Morning, Dev." with 38 trailers, 6 late, and Dock 7 free in 12 min.
- [ ] Every radius is 2px.

## Implementation notes

**One class runs the timeline.** Put every animation behind `body.run`. Replay removes it, forces a reflow, and adds it back.

```css
.splash { position: fixed; inset: 0; transform: translateY(-101%); pointer-events: none;
  border-bottom: 1px solid var(--accent); }
body.run .splash { animation: lift 420ms var(--sheet) 1100ms both; }
body.run .home { animation: settle 420ms var(--sheet) 1100ms both; }
body.run .logo path { animation: draw 440ms var(--expo) both; }
body.run .logo path:nth-child(2) { animation-delay: 70ms; }
body.run .logo path:nth-child(3) { animation-delay: 140ms; }
body.run .word span { animation: rise 380ms var(--expo) both; animation-delay: calc(260ms + var(--i) * 40ms); }
@keyframes lift { from { transform: none; } to { transform: translateY(-101%); } }
@keyframes settle { from { transform: scale(.965) translateY(12px); opacity: .35; } to { transform: none; opacity: 1; } }
@keyframes draw { from { stroke-dashoffset: var(--l); } to { stroke-dashoffset: 0; } }
@keyframes rise { from { transform: translateY(105%); } to { transform: none; } }
```

```js
replay.addEventListener('click', () => {
  document.body.classList.remove('run');
  void document.body.offsetWidth;
  document.body.classList.add('run');
});
```

**Dash length per path.** Set the length as a custom property on each path. Draw the G on an 84px box with square caps and a 5px stroke.

```html
<svg class="logo" viewBox="0 0 84 84" aria-hidden="true">
  <path d="M70 12H12v60h58" style="--l:176"/>
  <path d="M70 72V44" style="--l:28"/>
  <path d="M70 44H44" style="--l:26"/>
</svg>
```

**Reduced motion.** Skip the splash entirely. Do not just slow it down.

```css
@media (prefers-reduced-motion: reduce) {
  body.run .splash { animation: none; transform: translateY(-101%); }
  body.run .logo path, body.run .word span, body.run .line { animation: none; }
  body.run .home { animation: fade 200ms var(--std) both; }
}
```

Common mistakes:

- A splash that fades to black, then a home that loads. The home must be there already.
- A spinner on the splash. This piece has no spinner.
- Running longer than 1.6s "for the brand". Users open the app many times a day.
- Using `ease` or `linear` for the lift. Use the sheet curve.
- Forgetting `both`. The letters then flash in place before they rise.
- Clipping the letters with the splash, not a word mask. Each word needs `overflow: hidden`.
- A glow or a gradient on the mark. The acid is flat.
- Leaving the splash in the tab order or the accessibility tree.

Where it sits:

1. This is the first thing a returning user sees. Signed-out users go from the lift to `phone-sign-in`, restyled to Industrial.
2. First-time users can go from the lift to `ios-onboarding-carousel`, restyled to Industrial.
3. The app shell below the home can use `phone-tab-plain`. Its top mark becomes `--accent`.
4. An in-app wait that is not the launch uses `orbit-dots-loader` or `greeting-loader`, not this splash.

Rebuild order:

1. Build the home screen with real content first.
2. Lay the splash over it as a fixed plate.
3. Draw the mark with three paths and set each `--l`.
4. Set the word in six spans inside a mask.
5. Add the timeline under `body.run`.
6. Add the lift and the home settle at 1100ms.
7. Add Replay and the status line.
8. Add the reduced-motion fade and test it.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
