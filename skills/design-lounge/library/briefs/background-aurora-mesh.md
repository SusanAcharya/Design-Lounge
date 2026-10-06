<!-- Design Lounge Nº 174 · "Aurora mesh background" · www.designlounge.live -->

# Aurora mesh background

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A full-frame mesh-gradient background for a hero, shown here behind the landing page of "Polarmark", a small-group aurora trip operator. Four large radial-gradient blobs (teal, green, rose, deep sea blue) are squashed into wide ellipses, rotated a few degrees, and drift on slow Lissajous paths in the upper-right of the frame, so they read as curtains of light rather than "glowing orbs". A fixed SVG fractal-noise layer sits on top in `overlay` blend, a horizontal scrim keeps the left column dark for the copy, and a flat mountain-ridge silhouette anchors the bottom edge. The detail worth copying: no CSS `filter: blur()` anywhere. Softness comes from the gradient itself, and the only per-frame work is four `transform` writes, so the whole thing stays on the compositor. A floating panel switches between the Night preset and a warm Dawn preset and tunes drift speed and intensity.

## Structure

```
1280 × 800   .sky fixed inset 0 (decorative, aria-hidden), .page on top
┌──────────────────────────────────────────────────────────────────────┐
│ nav 76  ∧ Polarmark  Trips  Sky forecast  Cabins  Field notes   Sign in │
│                                                 ░░▒▒▓ teal/green ▓▒░  │
│  LOFOTEN & ABISKO · NOV 2026 – MAR 2027          ░▒▓▓▓▒░              │
│  Chase the lights, not                               ░▒ rose ▒░       │
│  the forecast.               104px serif                              │
│  sub 18px, max 470px                                                  │
│  (Find a night →)  48px pill                       ┌── panel 248 ──┐  │
│ /\/\__/\___/\/\____/\__/\/\  ridge 160px          │ SKY       (II)│  │
│                                                    │[Night][Dawn] │  │
│                                                    │Drift ──●── 1.0×│ │
│                                                    │Intensity ─● 80│ │
└────────────────────────────────────────────────────┴───────────────┘─┘
side padding 64px; panel 24px from right and bottom
```

- `.sky` (`position: fixed; inset: 0; overflow: hidden; pointer-events: none; aria-hidden="true"`): four `.blob` divs, `.grain`, `.scrim`, and an inline `<svg class="ridge">` with one path.
- `.page`: `<nav aria-label="Main">` → `<main class="hero">` with `p.eyebrow`, `h1` (one `<em>`), `p.sub`, `a.btn`.
- `<form class="ctl" aria-label="Background controls">`: header row, `<fieldset>` with visually hidden `<legend>Preset</legend>` and two radios, two `label + input[type=range] + output` rows.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Blobs | rAF loop | `transform` translate/rotate/scale | Lissajous paths above | continuous, `t += dt·speed` | sine | one frame at t = 8, no loop |
| Preset swap | radio change | background, color, fill, blob colours | Night ↔ Dawn tokens | 700ms | `--ease` | 1ms |
| Intensity | slider input | blob `opacity` | 0.2 → 1.0 | 700ms transition | `--ease` | 1ms |
| Button | hover / active | `transform` | 0 → translateY(−2px) / scale(.98) | 180ms | `--ease` | 1ms |
| Segment | radio change | background, color | — | 180ms | `--ease` | 1ms |

Loop rules: cap at 60fps (skip frames that arrive < 15.7ms after the last); clamp `dt` to 50ms so a long frame never jumps; cancel on `visibilitychange` hidden.

## States

- **Playing (default):** pause bars, `aria-pressed="false"`, label "Pause background".
- **Paused:** play triangle, `aria-pressed="true"`, label "Play background"; blobs hold position.
- **Drift 0:** loop runs but nothing moves; acceptable, pause is the real stop.
- **Night / Dawn selected:** active segment is ink-filled with background-coloured text.
- **Link hover:** `--ink-2` → `--ink`, 180ms.
- **Button hover:** lifts 2px; active presses to scale .98.
- **Focus-visible:** `outline: 2px solid var(--ink); outline-offset: 3px` on links, buttons, range inputs, and the segment's span when its radio has focus.
- **Hidden tab:** loop cancelled.

## Accessibility

- The whole `.sky` is decorative: `aria-hidden="true"`, `pointer-events: none`.
- The panel is a `<form>` with `aria-label="Background controls"`; the preset is a radio group inside a `<fieldset>` with a visually hidden legend "Preset". Arrow keys move between Night and Dawn natively.
- Sliders are native `input[type=range]` with `<label for>`; their `<output for>` readouts show "1.0×" and "80".
- The pause button satisfies WCAG 2.2.2 for continuous motion.
- Tab order: wordmark → 4 nav links → Sign in → Find a night → pause → preset radios → Drift → Intensity.
- Contrast: headline `#eef3f1` over the scrimmed left column stays above 12:1; sub `#a9b6b8` above 7:1. In Dawn, `#1f1a1c` on `#f4ece4` is 14.7:1 and `#55494b` is 7.4:1. Keep the copy inside the left 50%; the blobs are placed right of 55% by design.
- Panel hit targets: segment 30px tall with full-width labels, pause 32px; on touch layouts raise the pause button to 40px.

## Responsive rules

- ≥ 1280: as specified. Blob sizes are in `vmax`, so the mesh scales with the window.
- 1024–1279: headline 88px; nothing else changes.
- 768–1023: headline 72px; nav links stay; panel stays bottom-right.
- < 760: nav links hide, side padding 20px, headline 60px, sub 16px; panel spans the bottom (12px insets); the horizontal scrim becomes a flat 45% wash of `--bg` over the whole frame, because the blobs now sit behind the copy.
- Keep the ridge 160px tall at every width (`preserveAspectRatio="none"`).

## Acceptance checklist

### Always

- [ ] Background is four radial-gradient elements; no `filter: blur()` and no canvas.
- [ ] Per frame, only `transform` is written (four elements); nothing triggers layout.
- [ ] Grain is a static SVG `feTurbulence` data-URI tile in `overlay` blend.
- [ ] A scrim keeps the copy column legible; copy contrast ≥ 4.5:1 in both presets.
- [ ] Loop capped at 60fps, `dt` clamped to 50ms, cancelled while the tab is hidden.
- [ ] Reduced motion draws one still frame and starts paused.
- [ ] Pause button toggles `aria-pressed` and its label.
- [ ] Preset is a real radio group; sliders are native ranges with visible values.
- [ ] Every control shows a 2px focus ring.

### This demo

- [ ] Night background `#060A12`; blobs `#2BD9B4`, `#8BF06A`, `#E2577F`, `#1E6FA8` in `screen`.
- [ ] Dawn background `#F4ECE4`; blobs `#F7A27A`, `#F3C969`, `#E9879B`, `#B9D6C6` in `multiply`.
- [ ] Headline "Chase the lights, *not* the forecast." at 104px Instrument Serif.
- [ ] Panel defaults: Night, Drift 1.0×, Intensity 80.
- [ ] Preset colours cross-fade over 700ms.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state (Night): page background `#060A12`; teal and green light fill the top-right quadrant, a rose patch sits right of centre; the left 45% of the frame is dark behind the copy.
2. The blobs drift continuously. Each blob's centre follows `x = cx + ax·sin(t·fx + p)`, `y = cy + ay·cos(t·fy + 0.7p)` in viewport fractions; its rotation wobbles ±8° and its horizontal scale breathes ±0.25. One visible "shape change" takes 20–40s at 1× drift.
3. Grain (SVG `feTurbulence`, 220px tile) is static, at 16% opacity in Night and 24% in Dawn.
4. The panel (bottom-right, 248px wide) contains: title "Sky", a 32px round pause button, a Night/Dawn segmented control, a Drift slider (0–3×, step 0.1, default 1.0×) and an Intensity slider (20–100, step 5, default 80).
5. Choosing Dawn swaps every colour token: background `#F4ECE4`, blobs peach/honey/rose/sage, blend mode `multiply` instead of `screen`, ink goes dark, the button becomes ink-on-cream, the ridge goes `#E6D6C8`. Colour properties cross-fade over 700ms.
6. Drift changes the speed multiplier immediately without a jump (time accumulates, it is not recomputed from the clock). Drift 0 freezes the field.
7. Intensity sets blob opacity (`value / 100`) live; readouts update as the thumb moves.
8. Pause toggles the loop. Icon swaps between two bars and a play triangle; `aria-pressed` and `aria-label` ("Pause background" / "Play background") follow.
9. When the tab is hidden the `requestAnimationFrame` loop is cancelled; when visible it resumes from the same phase.
10. Under `prefers-reduced-motion: reduce` the blobs are placed once at t = 8 and the loop never starts; the button starts in the "Play background" state. Presets and intensity still work.

## Tokens

```css
:root {
  /* Night (default) */
  --bg: #060a12;          /* sky */
  --ink: #eef3f1;         /* headline, active segment */
  --ink-2: #a9b6b8;       /* sub, nav links, panel text */
  --ink-3: #748389;
  --line: rgba(238,243,241,.14);
  --b1: #2bd9b4;          /* teal curtain */
  --b2: #8bf06a;          /* green curtain */
  --b3: #e2577f;          /* rose fringe */
  --b4: #1e6fa8;          /* deep sea base glow */
  --ridge: #03060b;
  --accent: #8bf06a;      /* primary button */
  --accent-ink: #05140a;
  --panel: rgba(6,10,18,.72);
  --blend: screen;
  --grain: .16;
  --scrim: linear-gradient(90deg, rgba(6,10,18,.78) 0%, rgba(6,10,18,.35) 45%, rgba(6,10,18,0) 70%);

  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Space Grotesk", system-ui, sans-serif;
  --fs-display: 104px;
  --fs-sub: 18px;
  --fs-body: 15px;
  --fs-label: 12px;
  --pad-x: 64px;
  --nav-h: 76px;
  --r-pill: 999px;
  --r-panel: 14px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --t: 180ms;             /* hovers, segment */
  --t-preset: 700ms;      /* preset colour cross-fade */
}
[data-preset="dawn"] {
  --bg: #f4ece4; --ink: #1f1a1c; --ink-2: #55494b; --ink-3: #7a6b6a; --line: rgba(31,26,28,.14);
  --b1: #f7a27a; --b2: #f3c969; --b3: #e9879b; --b4: #b9d6c6; --ridge: #e6d6c8;
  --accent: #1f1a1c; --accent-ink: #f8f1ea; --panel: rgba(248,242,236,.8);
  --blend: multiply; --grain: .24;
  --scrim: linear-gradient(90deg, rgba(244,236,228,.7) 0%, rgba(244,236,228,.3) 45%, rgba(244,236,228,0) 70%);
}
```

Blob sizes and paths (viewport fractions; `s` in vmax; scale Y fixed at 0.62):

| Blob | Colour | Size | cx, cy | ax, ay | fx, fy | phase | scaleX | base rotate |
|---|---|---|---|---|---|---|---|---|
| b4 | `--b4` | 90vmax | .62, .05 | .18, .10 | .031, .023 | 0 | 1.7 | −12° |
| b1 | `--b1` | 78vmax | .70, .30 | .20, .14 | .043, .037 | 1.7 | 2.1 | −18° |
| b2 | `--b2` | 62vmax | .84, .18 | .14, .12 | .052, .029 | 3.1 | 1.9 | −24° |
| b3 | `--b3` | 54vmax | .92, .58 | .12, .16 | .038, .047 | 4.6 | 1.4 | −8° |

Paint order bottom to top: b4, b1, b2, b3, grain, scrim, ridge.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Headline | Instrument Serif | 104px | 400 (em italic) | 0.94 | −0.02em | sentence |
| Eyebrow | Space Grotesk | 12px | 500 | 1.5 | +0.16em | UPPERCASE |
| Sub-copy | Space Grotesk | 18px | 400 | 1.55 | 0 | sentence |
| Nav links | Space Grotesk | 14px | 400 | 1.5 | 0 | sentence |
| Wordmark | Space Grotesk | 16px | 600 | 1 | +0.01em | sentence |
| Button | Space Grotesk | 15px | 600 | 1 | 0 | sentence |
| Panel title | Space Grotesk | 11px | 600 | 1 | +0.08em | UPPERCASE |
| Panel labels | Space Grotesk | 12px | 400/500 | 1.5 | 0 | sentence, tabular readouts |

## Implementation notes

**Blob without blur.** The fall-off lives in the gradient; `closest-side` keeps it circular before the transform squashes it:

```css
.blob {
  position: absolute; left: 0; top: 0;
  width: var(--s); height: var(--s);
  margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);   /* centre on (0,0) so translate = centre */
  border-radius: 50%;
  background: radial-gradient(closest-side,
    var(--c) 0%, color-mix(in srgb, var(--c) 45%, transparent) 45%, transparent 100%);
  mix-blend-mode: var(--blend);
  opacity: var(--o, .8);
  will-change: transform;
}
```

**The loop.** Time accumulates by `dt × speed`, so changing speed or pausing never jumps:

```js
function place() {
  for (const b of blobs) {
    const x = (b.cx + b.ax * Math.sin(t * b.fx + b.p)) * W;
    const y = (b.cy + b.ay * Math.cos(t * b.fy + b.p * .7)) * H;
    const rot = b.r + 8 * Math.sin(t * b.fx * .6 + b.p);
    const sx = b.sx + .25 * Math.sin(t * b.fy + b.p);
    b.el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${sx},.62)`;
  }
}
function frame(now) {
  raf = requestAnimationFrame(frame);
  const dt = now - last; if (dt < 1000 / 60 - 1) return;
  last = now; t += Math.min(dt, 50) / 1000 * speed; place();
}
```

**Grain tile.** Encode the SVG inline; the colour matrix turns noise into mid-grey speckle with alpha so `overlay` brightens and darkens evenly:

```css
.grain { position: absolute; inset: 0; opacity: var(--grain); mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 1.6 -.3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
```

Common mistakes:

- `filter: blur(120px)` on moving blobs. It re-rasterises every frame and drops to 20fps on laptops.
- Animating `left/top` or `background-position` instead of `transform`.
- Round blobs. Squash them (scale Y .62) and tilt them, or the field reads as lava-lamp orbs.
- Using the same blend mode for both presets: `screen` on a light background washes out to white; Dawn needs `multiply`.
- Purple-to-blue. This palette is teal, green and rose on blue-black; keep it.
- Letting the light drift under the headline; keep `cx ≥ .62` and the scrim on.
- Restarting the CSS animation to change speed. Accumulate time in JS instead.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
