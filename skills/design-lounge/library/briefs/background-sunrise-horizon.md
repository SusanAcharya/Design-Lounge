<!-- Design Lounge Nº 424 · "Sunrise horizon background" · designlounge.vercel.app -->

# Sunrise horizon background

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A full-frame sunrise for an editorial hero, shown here behind the cover of "Eastlight Almanac", a quarterly journal about first light on far coasts. The sky is nine flat horizontal bands with hard edges (no smooth gradient), the sea is six more, and a 144px sun disc rises from behind a 1px horizon rule at 62% height. Every band's colour is interpolated from five dawn keyframes (05:30 → 08:00), so moving the clock recolours the whole print at once. Scrolling the page moves the clock forward; scrolling back rewinds it. The detail worth copying is the banding: stepped colour reads as a screen-print or a travel poster, which is why dark serif type sits directly on it with no scrim.

## Reference behaviour

1. Initial state: clock 06:12, the sun is half above the horizon at x = 72%, warm orange bands near the horizon, pale slate-blue at the top.
2. Autoplay runs on load: the clock advances 3.2 minutes per second (06:12 → 08:00 in ~34s). Bands cool toward pale blue and cream, the sun climbs and turns from `#F26B2A` to `#FDE3A0`.
3. At 08:00 autoplay stops by itself and the button shows play. Pressing play at 08:00 restarts from 05:40.
4. The time slider (05:30–08:00, step 1 minute) sets the clock directly and live; the large readout ("06:12") and `aria-valuetext` follow.
5. Scrolling: each pixel of scroll adds `90 / viewportHeight` minutes (one full screen = 90 minutes), clamped to 05:30–08:00. Scrolling up rewinds. Slider and readout update.
6. The sun's centre sits at `horizonY − altitude × skyHeight × 0.62`, where `altitude = (minutes − 370) / 100`; it is clipped by the sky container so it rises from behind the horizon.
7. Below the horizon a "glint" column of eight horizontal strokes (3px, widths 100% → 16% of 220px, 9px gaps) mirrors the sun. Its opacity is `clamp((altitude + .25) × 1.6, 0, 1)`; each stroke shimmers with `scaleX(.7 ↔ 1.12)` over 2.6–3.8s.
8. The nav ink switches to cream `#F7F1E6` when the top band's luminance is below 0.2 (before ~05:45), and back to ink `#221D18` above it. The copy column always stays ink because its bands never go below luminance 0.22.
9. The page scrolls to an "In this issue" section on paper `#F5EFE4` that slides over the fixed sky.
10. The loop is cancelled while the tab is hidden; it resumes at the same clock.
11. Under `prefers-reduced-motion: reduce` autoplay is off (button shows play), shimmer stops, and all transitions drop to 1ms. Scroll and slider still recolour the scene, because they are user-driven.

## Structure

```
1280 × 800   .scene fixed (aria-hidden) · .page scrolls on top
┌──────────────────────────────────────────────────────────────────────┐
│ Eastlight Almanac (italic)           Issues  Shore notes  Stockists  Subscribe │ band 0 18%
│──────────────────────────────────────────────────────────────────────│ band 1 15%
│ NO. 14 · SPRING 2027                                                  │ band 2 13%
│ Every morning arrives                                                 │ band 3 11%
│ in layers.                92px serif                                  │ band 4 10%
│ A quarterly journal…  20px serif, max 500px                           │ band 5  9%
│ [ Read issue 14 → ]                                    ( sun 144 )    │ band 6–8 8%
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━ horizon 62% ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                                       ═══════         │ sea 14
│                                                        ═════          │ sea 15…20
│                                         ┌ SUNRISE 06:12 ──●──── Scroll to… (II) ┐ │
└──────────────────────────────────────────────────────────────────────┘
then: section.issue (paper, 1px top rule): IN THIS ISSUE · 3 columns
```

- `.scene` (`position: fixed; inset: 0; overflow: hidden; pointer-events: none; aria-hidden`): `.sky` (flex column, height 62%, `overflow: hidden`) holding nine `<i>` bands and `.sun`; `.sea` (flex column, top 62% to bottom) holding six `<i>` bands and `.glint`; `.horizon-rule`.
- Band heights are flex ratios: sky `18 15 13 11 10 9 8 8 8`, sea `14 15 16 17 18 20`.
- `.page`: `<header class="hero">` (100vh, min 620px) with `<nav aria-label="Main">` and `.copy` (`p.kicker`, `h1` with `<em>`, `p.sub`, `a.btn`); then `<section class="issue" aria-labelledby>` with three `<article>`s (`<time>`, `<h3>`, `<p>`).
- `.ctl` (`role="group" aria-label="Time of day"`): `<label for="time">`, `<output>`, `input[type=range]`, hint span, play/pause button.

## Tokens

```css
:root {
  --paper: #f5efe4;       /* issue section, html background */
  --paper-ink: #221d18;
  --paper-2: #5e554b;     /* secondary text on paper */
  --rule: #ddd2c1;        /* hairlines, panel border */
  --ink: #221d18;         /* copy on the sky */
  --ink-light: #f7f1e6;   /* nav ink before ~05:45 */
  --accent: #c4471f;      /* slider thumb, story times */
  --panel: #fbf7f0;
  --serif: "Newsreader", Georgia, serif;
  --sans: "Schibsted Grotesk", system-ui, sans-serif;
  --horizon: 62%;
  --sun-size: 144px;
  --sun-x: 72%;
  --fs-display: 92px;
  --fs-sub: 20px;
  --fs-story: 28px;
  --fs-clock: 28px;
  --pad-x: 64px;
  --r: 2px;               /* button, panel: nearly square, print-like */
  --ease: cubic-bezier(.2,.7,.2,1);
  --t: 180ms;
  --t-ink: 600ms;         /* nav ink swap */
  --minutes-per-second: 3.2;
  --minutes-per-screen: 90;
}
```

Dawn keyframes (minute of day → top, mid, low/horizon, sun, water):

| Time | min | top | mid | low | sun | water |
|---|---:|---|---|---|---|---|
| 05:30 | 330 | `#4F5C76` | `#B9B3B9` | `#EFB08C` | `#E2552A` | `#3E4860` |
| 05:52 | 352 | `#7487A3` | `#DCC0B6` | `#F6A876` | `#EC5F27` | `#56637C` |
| 06:10 | 370 | `#9DB0C6` | `#EDCDB9` | `#F9B071` | `#F26B2A` | `#6E8098` |
| 06:50 | 410 | `#BCCDDC` | `#F3DFCB` | `#FBD496` | `#F8A04A` | `#89A0B3` |
| 08:00 | 480 | `#D3E0EA` | `#F0F0EA` | `#F7E8C8` | `#FDE3A0` | `#A7BCCB` |

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Masthead | Newsreader italic | 24px | 400 | 1 | −0.01em | Title |
| Headline | Newsreader (opsz auto) | 92px | 400, em italic | 0.98 | −0.025em | sentence |
| Sub | Newsreader | 20px | 400 | 1.5 | 0 | sentence |
| Kicker | Schibsted Grotesk | 12px | 600 | 1.5 | +0.18em | UPPERCASE |
| Nav / button | Schibsted Grotesk | 14px | 400 / 500 | 1.5 | 0 / +0.02em | sentence |
| Clock readout | Newsreader | 28px | 400 | 1 | 0 | tabular numerals |
| Panel label | Schibsted Grotesk | 11px | 600 | 1 | +0.14em | UPPERCASE |
| Story title | Newsreader | 28px | 400 | 1.15 | −0.01em | sentence |
| Story time | Schibsted Grotesk | 13px | 500 | 1 | 0 | tabular, accent |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Clock | autoplay (rAF, 30fps cap) | minutes | current → 480 | 3.2 min/s | linear time | off at load |
| Bands | clock change | `background` (inline rgb) | keyframe interpolation | per frame | piecewise linear | instant on input |
| Sun | clock change | `transform: translateY` | below → above horizon | per frame | linear in minutes | instant |
| Sun colour | clock change | `background` | `#E2552A` → `#FDE3A0` | per frame | — | instant |
| Glint strokes | CSS loop | `transform: scaleX` | .7 ↔ 1.12 | 2.6 / 3.2 / 3.8s alternate | `--ease` | none |
| Nav ink | luminance threshold | `color` | ink ↔ cream | 600ms | `--ease` | 1ms |
| Button | hover | background, color | transparent → ink fill | 180ms | `--ease` | 1ms |

Band colour rule: for sky band `i` of 9, `p = sqrt(i / 8)`; colour = `mix(top, mid, p / .6)` when `p < .6`, else `mix(mid, low, (p − .6) / .4)`. The square root pushes the light mid tone up behind the headline. Sea band `j` of 6: `mix(mix(low, mid, .35), water, .25 + .75 × j/5)`.

## States

- **Playing:** pause bars, `aria-pressed="false"`, label "Pause the morning"; glint shimmers.
- **Paused / ended:** play triangle, `aria-pressed="true"`, label "Play the morning"; `body.paused` stops the glint animation.
- **Early (before ~05:45):** nav turns cream; copy stays ink.
- **Slider focus:** 2px outline in `currentColor`, offset 3px; thumb is a 16px accent dot with a 3px panel-coloured ring.
- **Button hover:** fills with ink, text goes paper.
- **Panel button hover:** border `--rule` → `--paper-ink`.
- **Hidden tab:** loop cancelled.

## Accessibility

- The scene is decorative (`aria-hidden="true"`, `pointer-events: none`).
- The slider is a native range labelled "Sunrise"; `aria-valuetext` is the formatted clock ("06:12"), so screen readers don't announce "372".
- The output readout is visible; it is not a live region (the slider already announces).
- The play/pause button names the action; it satisfies WCAG 2.2.2.
- Scroll-to-scrub is a bonus, never the only way: the slider covers the full range by keyboard (arrows ±1 min, Page Up/Down ±10%).
- Contrast: ink `#221D18` on the darkest band behind the copy (band 1 at 05:30, about `#9A9CAA`) is 6.1:1; on the horizon peach it is 9:1. Cream nav on `#4F5C76` is 6.0:1.
- Tab order: masthead → 4 nav links → Read issue 14 → slider → play button → (scroll) section content.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: headline 80px; sun stays at 72%.
- 768–1023: headline 68px; stories become 2 columns + 1.
- < 760: nav links hide, padding 20px, headline 54px, sub 18px; sun shrinks to 96px at x = 78%; stories stack; the hint text hides and the panel spans the bottom edge (12px insets) with the slider flexing.
- Minutes per screen stays 90 at every height, so a phone scrolls the same morning.

## Acceptance checklist

### Always

- [ ] Sky and sea are flat bands with hard edges, recoloured from keyframes; no CSS gradient on them.
- [ ] One time value drives bands, sun position, sun colour, glint and nav ink.
- [ ] The sun is clipped by the horizon (`overflow: hidden` on the sky).
- [ ] Scroll down advances, scroll up rewinds, clamped to the slider range.
- [ ] The slider has `aria-valuetext` in hh:mm.
- [ ] Autoplay stops at the end of its range and can be replayed.
- [ ] Loop capped at 30fps and cancelled while hidden.
- [ ] Reduced motion: no autoplay, no shimmer; scroll and slider still work.
- [ ] Copy contrast ≥ 4.5:1 at every time in range.

### This demo

- [ ] Nine sky bands `18 15 13 11 10 9 8 8 8`, six sea bands, horizon at 62%.
- [ ] Opens at 06:12 with the sun half risen at x = 72%.
- [ ] Clock range 05:30–08:00; autoplay 3.2 min/s; one screen of scroll = 90 minutes.
- [ ] Headline "Every morning arrives *in layers.*" at 92px Newsreader.
- [ ] Panel reads "SUNRISE 06:12" with a 180px slider and "Scroll to move the morning".

## Implementation notes

**Keyframe interpolation.** Find the bracketing pair, mix each channel:

```js
function stops(m) {
  let i = 0; while (i < K.length - 2 && m > K[i + 1][0]) i++;
  const a = K[i], b = K[i + 1];
  const f = Math.max(0, Math.min(1, (m - a[0]) / (b[0] - a[0])));
  return [1, 2, 3, 4, 5].map(j => mix(hex(a[j]), hex(b[j]), f));   // top, mid, low, sun, water
}
```

**Scroll as a delta, not a position.** Mapping `scrollY` straight to time breaks the slider (the next scroll would snap back). Add the delta instead:

```js
let lastY = scrollY;
addEventListener('scroll', () => {
  const d = scrollY - lastY; lastY = scrollY;
  minutes = Math.max(330, Math.min(480, minutes + d / innerHeight * 90));
  if (!raf) render();
}, { passive: true });
```

**Sun rising from behind the horizon.** Put the sun inside the sky container, which clips it:

```css
.sky { position: absolute; inset: 0 0 auto 0; height: var(--horizon); overflow: hidden; display: flex; flex-direction: column; }
.sky i { flex: var(--h) 0 0; }
.sun { position: absolute; left: 72%; top: 0; width: 144px; height: 144px; margin: -72px 0 0 -72px; border-radius: 50%; }
/* JS: sun.style.transform = `translate3d(0, ${H - alt * H * .62}px, 0)` */
```

Common mistakes:

- A smooth `linear-gradient` sky. It reads as a generic sunset wallpaper; the hard bands are the piece.
- Letting the earliest keyframe go navy behind the headline, then needing a scrim. Keep the copy bands light and switch only the nav.
- Driving the sun with CSS keyframes and the bands with JS; they drift apart. One clock.
- Running the clock with `Date.now()` and no clamp; returning from a hidden tab jumps the sun.
- Putting the scene inside the scrolling content; it must be `position: fixed` so the issue section slides over it.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
