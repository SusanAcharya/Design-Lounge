---
title: "Vinyl record player"
summary: "A music player built around a turntable: the disc spins while playing, the tonearm swings on and tracks inward across the side, with a drag scrubber and A/B tracklist."
platform: web
type: component
category: media
tags: [music, player, vinyl, turntable, audio]
styles: [dark, retro, editorial]
motion: rich
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#0F1D1E", "#F3E9DC", "#F2785C", "#1F4E4F", "#ECDCC4"]
fonts: ["Instrument Serif", "Outfit"]
related: [record-detail-header]
---

# Vinyl record player

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A now-playing view for a music or listening-room product, built around a turntable instead of a square of album art. On the left, the LP "Salt Hours" by the invented band Marrow & Lune sits on a platter, half slid out of a CSS-drawn sleeve (a coral sun over striped teal sea). On the right, a 112px Instrument Serif title, transport controls, a drag scrubber and a Side A / Side B tracklist. The detail worth copying: the tonearm is a progress indicator. On play it swings from its rest at −2° onto the outer groove at 8°, and as the side plays it creeps inward to 28°, so the arm's angle is always the share of the side already played. Pause lifts it back to rest; the record's light reflection never turns with the disc.

## Reference behaviour

1. Initial state: playing. Side A, track 2 "Salt Hours", at 1:12 of 4:12. The disc spins at 33⅓ rpm (one turn per 1.8s), the arm rests on the record at about 12°, the eyebrow reads "Now spinning · LP · 2026" with a coral dot and a 4px coral halo, and the current row shows three animated equaliser bars in place of its "A2" number.
2. Press the 64px coral pause button: the disc stops where it is (animation paused, not reset), the arm swings back to −2° over 900ms with an expo-out curve, the eyebrow reads "Arm lifted" with a grey dot, the equaliser bars freeze at 40% height, and the button's icon and `aria-label` become Play.
3. Press play: the arm swings from −2° to its tracking angle over 900ms and the disc resumes.
4. While playing, position advances 0.25s every 250ms. The arm angle is `8 + 20 × (time played on this side ÷ side length)` degrees, so A1 at 0:00 sits at 8° and the end of A5 at 28°.
5. Drag the scrubber: the time, the coral fill and the arm angle follow the thumb live, with the arm on a 300ms transition so it glides rather than snaps. The thumb grows to 1.25× while held.
6. Click a row on the visible side: that track starts at 0:00 and the arm moves to its groove over 300ms. If the player was paused it starts playing.
7. Click a row on the other side: the arm lifts to rest, waits 700ms (the record is "flipped"), then drops onto the new side's groove and the label text changes to "SIDE B · 33⅓".
8. Next on A5 crosses to B1; previous more than 3s into a track restarts it, otherwise steps back, crossing from B1 to A5.
9. When A5 ends the player stops, the arm lifts, and a coral "Flip to side B" button appears at the right end of the tab row. Pressing it shows side B and starts B1.
10. The Side A / Side B tabs only change which list is shown; the current row stays marked on whichever side is playing.

## Structure

```
1280 × 800
┌───────────────────────── stage 760 × 800 ──────────────────┬──── 520 ───────────────┐
│                                         ( base 88 ) pivot   │ ● NOW SPINNING · LP    │
│          ┌──────────────────────┐   700,150  │              │ Salt          112px    │
│ ┌────────│      platter 480     │            │ arm 80×380   │    Hours               │
│ │ sleeve │   ┌──────────────┐   │           /               │ Marrow & Lune  20px    │
│ │ 360²   │   │ label 150 ●  │   │         /                 │ label line     13px    │
│ │ sun    │   └──────────────┘   │       ▫ headshell         │ (|<) ( || 64 ) (>|) np │
│ │ sea    │   centre 450,400     │   ▭ rest 688,470          │ 1:13 ━━━━━●─────── 4:12│
│ └────────│                      │                           │ Side A  Side B         │
│          └──────────────────────┘                           │ A1 Low Water     3:48  │
│                                                             │ ▮▮▮ Salt Hours   4:12  │
│                                                             │ … 5 rows × 38px        │
└─────────────────────────────────────────────────────────────┴────────────────────────┘
```

- `<main class="app">`: CSS grid `760px 1fr`, full height.
- `.stage` (`aria-hidden="true"`, decorative): all children absolutely placed in a 760 × 800 coordinate space multiplied by `--u` (1px on desktop, `100vw / 760` on phones), so the whole turntable scales as one drawing.
  - `.sleeve` 360 × 360 at (40, 210), rotated −3°: `.sun` (64% circle), `.sea` (bottom 46%, striped), band name top left, italic title bottom left.
  - `.platter` 480 × 480 at (210, 160): `.disc` (grooves and `.label`, rotates) and `.sheen` (reflection, does not rotate) both inset 10.
  - `.base` 88px disc at the pivot, `.rest` cradle at (688, 470), and the arm `<svg>` 80 × 380 at (660, 110) with `transform-origin: 50% 10.53%` (the pivot at 40, 40 in its viewBox).
- `<section class="side" aria-labelledby="ttl">`: eyebrow, `h1` with the second word on its own indented line, artist `p`, transport row (`button` × 3 plus a live "now playing" block), scrubber row (`input type="range"` between two time spans), `role="tablist"` with two tabs and the flip button, and `<ol role="tabpanel">` of track buttons.

## Tokens

```css
:root {
  /* surfaces */
  --bg: #0f1d1e;        /* deep sea-black page */
  --bg2: #142728;       /* row hover */
  --line: #28403f;      /* tab rule */
  --track: #5f7672;     /* scrubber track and outline buttons, 3.4:1 on bg */
  /* ink */
  --ink: #f3e9dc;       /* 15:1 on bg */
  --ink2: #b9c4bd;      /* secondary, 9.6:1 */
  --ink3: #93a39d;      /* eyebrow, track numbers, 6.3:1 */
  /* brand */
  --coral: #f2785c;     /* play button, label, progress fill */
  --coral-hi: #ff9479;  /* current row text, flip button, focus ring */
  --on-coral: #2a0f08;  /* icons and label text on coral, 7.4:1 */
  /* sleeve and record */
  --paper: #ecdcc4;
  --sea: #1f4e4f;
  --sea2: #2c6a69;
  --vinyl: #121212;
  --groove: #1d1d1d;
  --platter: #081010;
  --arm: #d9d4cc;
  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Outfit", system-ui, sans-serif;
  --fs-title: 112px; --fs-artist: 20px; --fs-np: 17px; --fs-body: 15px; --fs-meta: 13px; --fs-eyebrow: 12px;
  /* geometry */
  --u: 1px;             /* stage unit: 760 units across */
  --stage-w: 760; --platter: 480; --label: 150; --sleeve: 360;
  --arm-rest: -2deg; --arm-start: 8deg; --arm-end: 28deg;
  --play: 64px; --ctl: 44px; --row-h: 38px; --tab-h: 40px; --scrub-h: 6px; --thumb: 18px;
  --r-row: 8px; --r-pill: 999px;
  --shadow-stage: 0 30px 60px rgba(0,0,0,.55);
  /* motion */
  --rev: 1.8s;          /* 33⅓ rpm */
  --t-arm: 900ms;       /* swing on and off */
  --t-track: 300ms;     /* arm glide while scrubbing or jumping */
  --t-flip: 700ms;      /* pause between sides */
  --t-eq: 900ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Album title | Instrument Serif, second word italic | 112px (clamp 64 to 112) | 400 | 0.88 | −0.02em | title |
| Sleeve title | Instrument Serif italic | 38u | 400 | 1 | 0 | title |
| Label title | Instrument Serif italic | 24u | 400 | 1 | 0 | title |
| Artist | Outfit | 20px | 500 | 1.45 | 0 | title |
| Now-playing track | Outfit | 17px | 600 | 1.45 | 0 | title |
| Body, rows | Outfit | 15px | 400 | 1.45 | 0 | title |
| Meta, times, durations | Outfit, tabular-nums | 13px | 400 to 500 | 1.45 | 0 | sentence |
| Eyebrow | Outfit | 12px | 500 | 1 | +0.2em | UPPERCASE |
| Sleeve band, label lines | Outfit | 13u / 8u | 600 | 1 | +0.2em to +0.24em | UPPERCASE |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---:|---|---|
| `.disc` | playing | rotate | 0 → 360°, infinite | 1800ms per turn | linear (constant rpm) | still, no rotation |
| `.disc` | pause | animation-play-state | running → paused | instant | none | still |
| Arm | play / pause | rotate | −2° ↔ 8° to 28° | 900ms | `--expo` | instant |
| Arm | playback | rotate | about +0.004° per 250ms tick | inherits 900ms | `--expo` | instant |
| Arm | scrub, row jump | rotate | current → new groove | 300ms | `--expo` | instant |
| Arm | side change | rotate | groove → rest, 700ms wait, → new groove | 900ms each | `--expo` | instant |
| EQ bars | current row while playing | scaleY | 0.4 → 1, alternate | 900ms, offsets −0.3s and −0.6s | `--ease` | frozen at 0.4 |
| Play button | press | scale | 1 → 0.94 | 160ms | `--ease` | none |
| Scrub thumb | held | scale | 1 → 1.25 | 120ms | `--ease` | none |

The disc's spin is the one linear motion on purpose: a record turns at a constant speed. Every UI move uses the curves above.

## States

- **Playing:** coral eyebrow dot with `0 0 0 4px rgba(242,120,92,.2)` halo, pause icon, arm on the record, disc turning, EQ bars moving.
- **Paused ("Arm lifted"):** grey dot, play icon, arm at −2° over the rest cradle, disc frozen at its current angle.
- **Side finished:** paused state plus the "Flip to side B" button (coral-hi text, 600).
- **Current row:** text `--coral-hi`; its number is replaced by three 3 × 12px bars.
- **Row hover:** background `--bg2`, 8px radius.
- **Outline controls hover:** border from `--track` to `--ink`.
- **Play hover:** `--coral-hi`; active scale 0.94.
- **Selected tab:** full ink and a 2px coral underline; other tab `--ink2`.
- **Focus-visible:** 2px `--coral-hi` outline, 3px offset, on every button, tab and the range input.

## Accessibility

- The stage is decorative (`aria-hidden="true"`); all information it shows (side, track, progress) is also in text on the right.
- Play is one toggle `button` with `aria-pressed` and an `aria-label` that switches between "Pause" and "Play". Previous and next have labels.
- The scrubber is a native `input type="range"` with `aria-label="Position in track"` and `aria-valuetext` like "1:13 of 4:12"; arrow keys step one second, Page Up/Down step ten (native).
- The now-playing block is `aria-live="polite"`, so track changes are announced, but the clock is not inside it (it would announce four times a second).
- Tabs use `role="tablist"`/`tab`/`tabpanel` with `aria-selected`; Left and Right arrows switch sides.
- Contrast: all text on `--bg` is ≥ 6.3:1; coral row text `#FF9479` is 7.3:1; label text on coral is 7.4:1. Outline controls and the scrub track are ≥ 3:1 against the page.
- Targets: transport 44px and 64px, rows 38px full width, tabs 40px.

## Responsive rules

- ≥ 1280: as specified, stage 760px, column 520px.
- 1024 to 1279: column narrows; the title clamps down toward 64px (`clamp(64px, 9vw, 112px)`).
- 901 to 1023: same two columns; the tracklist durations stay right aligned.
- ≤ 900: one column. The stage keeps its drawing and scales with `--u: calc(100vw / 760)`, trimmed to 680 units tall; the column follows with 20px gutters and the title at `clamp(56px, 17vw, 88px)`. The page scrolls vertically.
- At 360 wide the stage is 360 × 322; nothing in the transport row wraps because the now-playing text ellipsises.

## Acceptance checklist

**Always**

- [ ] The disc turns only while playing and stops in place on pause (play-state paused, not reset).
- [ ] The reflection layer sits above the grooves and does not rotate.
- [ ] Play swings the arm on over 900ms; pause swings it back to rest.
- [ ] The arm angle maps linearly from 8° to 28° across the whole side, including while scrubbing.
- [ ] Changing sides lifts the arm, waits 700ms, then drops it on the new side.
- [ ] The scrubber is a native range input with `aria-valuetext`, and its fill follows the value.
- [ ] Tabs switch the visible side without changing what is playing.
- [ ] Reduced motion: no spin, no EQ animation, the arm jumps; every state is still shown.
- [ ] No horizontal scroll at 390px; the turntable scales as one drawing.

**This demo**

- [ ] "Salt Hours" by Marrow & Lune, Hollow Reed Records HRR-031, ten tracks, five a side.
- [ ] Starts playing Side A track 2 at 1:12 of 4:12.
- [ ] Label reads "MARROW & LUNE / Salt Hours / SIDE A · 33⅓ / HRR-031" around a light spindle.
- [ ] "Flip to side B" appears when A5 ends.

## Implementation notes

**The arm is a rotated SVG with its origin on the pivot.** Draw the arm in its own 80 × 380 viewBox with the pivot at (40, 40), then set the origin in percentages so it survives scaling. Drive the angle with one custom property:

```css
.arm { position: absolute; left: calc(660 * var(--u)); top: calc(110 * var(--u));
  width: calc(80 * var(--u)); height: calc(380 * var(--u));
  transform-origin: 50% 10.53%;            /* 40/80, 40/380 */
  transform: rotate(var(--a, -2deg));
  transition: transform 900ms cubic-bezier(.16,1,.3,1); }
.arm.track { transition-duration: 300ms; }  /* while scrubbing or jumping */
```

```js
function setArm() {
  const played = sideTracks.slice(0, track).reduce((a, t) => a + t.len, 0) + time;
  arm.style.setProperty('--a', playing ? (8 + 20 * played / sideLength).toFixed(2) + 'deg' : '-2deg');
}
```

Find the start and end angles from the geometry, not by eye: with the pivot at (700, 150), arm length 328 and the record centred at (450, 400), 8° lands the stylus 217 units from centre (outer groove) and 28° lands it 100 units out (just outside the 75-unit label).

**Spin with CSS, pause with play-state.** Toggling the `animation` itself snaps the disc back to 0°:

```css
.disc { background: repeating-radial-gradient(circle, #121212 0 2px, #1d1d1d 2px 3px);
  animation: spin 1.8s linear infinite; animation-play-state: paused; }
.playing .disc { animation-play-state: running; }
.sheen { background: conic-gradient(from 20deg, transparent 0 8%, rgba(255,240,220,.09) 13%,
  transparent 20% 52%, rgba(255,240,220,.07) 60%, transparent 68%);
  mask: radial-gradient(circle, transparent 34%, #000 35%); }
@keyframes spin { to { transform: rotate(360deg); } }
```

**Range fill without a second element.** Paint the played part as a background image sized by a custom property, and keep a solid `background-color` on the input itself so the track keeps its 3:1 edge:

```css
input[type=range] { appearance: none; height: 6px; border-radius: 3px;
  background-color: #5f7672; background-image: linear-gradient(#f2785c, #f2785c);
  background-size: var(--p, 0%) 100%; background-repeat: no-repeat; }
```

Common mistakes: rotating the reflection with the disc (it reads as a spinning picture, not a record); swinging the arm with `ease` so it lands with no settle; driving playback with `requestAnimationFrame` and updating the live region every frame; letting the label text sit over the spindle hole.
