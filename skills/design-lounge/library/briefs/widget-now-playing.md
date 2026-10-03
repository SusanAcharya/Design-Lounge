<!-- Design Lounge Nº 358 · "Vinyl now-playing widget" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Vinyl now-playing widget

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A home-screen style music widget for a fictional player, "Turntide", in two sizes. The page is cream with horizontal 70s stripes. The widget is espresso brown with a cream fat-italic display face and a mono for everything else. In the medium size, a square album sleeve sits on the left with a black record sliding out of it; the record spins while music plays and stops dead on pause. The right side has a four-bar equaliser, the title, the artist, a scrubber, times, and three round controls. The small size is a 212px square: the art fills it, the title and a play button sit on a dark fade at the bottom, and a 3px line shows progress. The detail worth copying: all three album covers are pure CSS gradients, swapped by one class on the widget, so the piece ships with no images.

## Reference behaviour

1. First frame: medium size, playing. Track "Monsoon Radio" by The Marigold Hours, album "Low Sun Over Patan", 3:48 long, at 1:14. The record spins (3.2s per turn). The four equaliser bars bounce. The size switch above reads Small | **Medium**.
2. Every second while playing, position advances one second: the scrubber thumb and orange fill move, elapsed counts up, remaining (`-m:ss`) counts down.
3. Play/pause (48px orange circle): toggles. On pause the record and the bars freeze where they are (`animation-play-state: paused`), the label above the title reads "Paused", the icon becomes a triangle, the button label becomes "Play".
4. Next: loads the next track at 0:00 and swaps the cover by class. Previous: if more than 3 seconds in, restarts the track; otherwise loads the previous track. Tracks loop.
5. Dragging the scrubber or pressing arrow keys on it seeks. While dragging, the clock does not move the thumb.
6. When a track ends it loads the next one automatically and a polite live region announces "Late Tram by Nilo Sato".
7. Hovering the sleeve (medium only) slides the record 12px further out of the sleeve over 420ms.
8. Small: the widget animates from 580 × 212 to 212 × 212 over 420ms expo out. The record fades out, the cover goes edge to edge, the medium body hides, and the mini overlay shows title, a small equaliser with the artist, a 44px play button, and the 3px progress line. Medium reverses it.
9. Reduced motion: no spin, no bouncing bars (they sit still at 70% height while playing), the size change is instant. The clock still runs.

## Structure

```
1280 × 800 · body grid, centred, padding 32px 16px · stack gap 28px
               ( SMALL | MEDIUM )                 segmented switch, 44px tall
┌──────────────────────────────────────────────────────────────┐
│ ┌──────────┐◖)                ▮▮▮▮ NOW PLAYING              │ medium 580 × 212
│ │  cover   │ record  ◖)       Monsoon Radio (28px display)   │ padding 20px, r 28px
│ │ 172×172  │ 160px            The Marigold Hours             │ grid 240px | 1fr, gap 20px
│ │Low Sun…  │◖)                ━━━━━━━●────────────────       │ scrubber 24px hit, 4px track
│ └──────────┘                  1:14                 -2:34     │
│                                ⏮   (⏸)   ⏭          Turntide │ 40px, 48px, 40px
└──────────────────────────────────────────────────────────────┘

small: 212 × 212, padding 0
┌────────────────┐
│  cover, full   │
│                │
│░Copper Bus  (⏸)│ fade from 0% to 92% espresso, 44px top padding
│░▮▮▮ Kesar & …  │
│░━━━━━━─────────│ 3px progress at bottom 6px
└────────────────┘
```

- Segmented control: `div[role=group][aria-label="Widget size"]` with two `button[aria-pressed]`.
- Widget: `section[aria-label="Turntide now playing"]` with `data-size="medium|small"`, class `playing` when playing, and a track class `t1|t2|t3`.
- `.sleeve` (`aria-hidden`): `.rec` (the record, absolute, top 6px, left 80px, 160px) under `.art` (absolute, inset 0, r 10px). The art carries the album name in the display face, bottom-left.
- `.body`: top line (equaliser + state word), `p.title`, `p.artist`, `.scrub` (`input[type=range]` + times row), `.ctrls` (prev, play/pause, next, wordmark).
- `.mini`: shown only in small. It repeats title, artist, play/pause, and a decorative progress bar.
- One `p[aria-live=polite]`, visually hidden.

## Tokens

```css
:root {
  --page: #e9dcc0;     /* cream page */
  --stripe: #e2d2b1;   /* 4px stripes every 26px */
  --card: #2b1d14;     /* espresso widget */
  --card-2: #3a281c;   /* scrubber track, button hover */
  --ink: #f3e7cf;      /* title, icons on orange */
  --ink-2: #d2c1a2;    /* artist, idle icons */
  --ink-3: #a8957a;    /* labels, times, wordmark */
  --orange: #d9541e;   /* accent: play button, scrubber fill, record label, focus */
  --mustard: #e3a92b;  /* equaliser, selected size */
  --olive: #7b7a33;    /* cover 2 */
  --vinyl: #141010;

  --disp: "Shrikhand", Georgia, serif;
  --mono: "Space Mono", ui-monospace, monospace;

  --medium-w: 580px; --medium-h: 212px; --small: 212px;
  --pad: 20px; --r-widget: 28px; --r-cover: 10px;
  --cover: 172px; --record: 160px; --record-left: 80px;
  --shadow: 0 2px 0 #1a110b, 0 30px 50px -30px rgba(43, 29, 20, .7);

  --std: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-size: 420ms;
  --t-spin: 3.2s;   /* linear, one turn */
}
```

Covers, set as `--art` on the widget class:

```css
.t1 { --art: radial-gradient(circle at 50% 118%, #f3e7cf 0 14%, #e3a92b 14% 26%, #d9541e 26% 38%,
        #a5371a 38% 50%, #5a2a17 50% 62%, transparent 62%), linear-gradient(#efd9a8, #efd9a8); --ac: #2b1d14; }
.t2 { --art: radial-gradient(circle at 70% 30%, #e3a92b 0 18%, transparent 18.5%),
        repeating-linear-gradient(90deg, #7b7a33 0 18px, #5f5e26 18px 36px); --ac: #f3e7cf; }
.t3 { --art: repeating-radial-gradient(circle at 30% 70%, #f3e7cf 0 8px, #d9541e 8px 16px, #2b1d14 16px 24px); --ac: #f3e7cf; }
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Title | Shrikhand | 28px | 400 | 1.05 | 0 | Title, ellipsis |
| Cover album name | Shrikhand | 19px | 400 | 1 | -0.01em | Title, colour `--ac` |
| Mini title | Shrikhand | 18px | 400 | 1.05 | 0 | Title, ellipsis |
| Wordmark | Shrikhand | 14px | 400 | 1 | 0 | Title |
| State label | Space Mono | 10px | 700 | 1.4 | 0.16em | UPPER |
| Artist | Space Mono | 13px | 400 | 1.4 | 0 | Title, ellipsis |
| Times | Space Mono | 11px | 400 | 1.4 | 0 | tabular |
| Size switch | Space Mono | 12px | 700 | 1 | 0.08em | UPPER |

Shrikhand has one weight. Do not fake bold it. It is the only display face; everything else is Space Mono.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Record | playing | rotate | 0 → 360°, loop | 3.2s | linear | static |
| Record | pause | animation-play-state | running → paused | instant | — | — |
| Equaliser bar 1–4 | playing | scaleY | .25 → 1 → .45, alternate | 900 / 620 / 1100 / 740ms, delays 0 / −200 / −500 / −300ms | `--std` | static at .7 |
| Widget | size switch | width, height | 580×212 ↔ 212×212 | 420ms | `--expo` | instant |
| Record | size switch | opacity | 1 ↔ 0 | 240ms | `--std` | instant |
| Record | sleeve hover | left | 80 → 92px | 420ms | `--expo` | instant |
| Icon button | press | scale | 1 → .92 | 120ms | `--std` | same |
| Scrubber thumb | drag | scale | 1 → 1.25 | 120ms | `--std` | same |
| Segment | select | background, colour | transparent → mustard | 200ms | `--std` | instant |

Linear is right for the spin: a record turns at constant speed. Every UI move uses `--std` or `--expo`.

## States

- **Playing:** `.playing` on the widget; record spinning, bars moving, pause icon, label "Now playing".
- **Paused:** record and bars frozen mid-motion, play icon, label "Paused".
- **Medium / small:** `data-size` on the widget; the matching segment is mustard with espresso text and `aria-pressed="true"`.
- **Icon button hover:** background `--card-2`, icon `--ink`. Play button hover `#e8662f`.
- **Focus-visible:** 2px orange outline, 3px offset (0 on the range input).
- **Seeking:** while the range is being dragged, the clock does not overwrite it.
- **Track change:** cover class, title, artist, album name, and times update at once; position 0:00.
- **Empty:** a real product shows "Nothing playing" in the title slot with a flat `--card-2` cover and disabled controls. Not shown in the demo.

## Accessibility

- The widget is a `section` labelled "Turntide now playing". The sleeve is decorative (`aria-hidden`).
- Play/pause is a button whose `aria-label` flips between "Play" and "Pause". Both play buttons (medium and mini) stay in sync.
- Previous and next have labels "Previous track" and "Next track".
- The scrubber is a native `input[type=range]` with `aria-label="Seek"` and `aria-valuetext="1:14 of 3:48"`, updated each second. Arrow keys seek by 1s, Page Up/Down by 10% (native).
- The size switch is a group of two toggle buttons with `aria-pressed`.
- A polite live region names the new track on next, previous, or auto-advance. It does not announce the clock.
- Hit targets: 40px for prev/next, 48px play (44px in small), 24px-tall scrubber hit area, 36px segments inside a 44px pill.
- Contrast: `--ink` on `--card` 13:1. `--ink-3` on `--card` 5.6:1. `--ink` on `--orange` 3.6:1 is icon-only (≥ 3:1 for UI graphics).

## Responsive rules

- **≥ 640:** medium is 580 × 212, small 212 × 212, centred.
- **< 540:** medium becomes a column: width 100%, height auto, padding 16px, cover 150px, record 140px at left 70px, title 24px. Small stays 212px.
- The widget's width is `min(580px, 100%)`, so it never causes horizontal scroll at 375px.
- Long titles and artists ellipsis on one line in both sizes; they never wrap.
- If shown on a phone home screen, small maps to a 2 × 2 widget and medium to 4 × 2.

## Acceptance checklist

### Always

- [ ] Two sizes from one element, switched with a `data-size` attribute and a 420ms width/height transition.
- [ ] The record spins only while playing, and pause freezes it in place rather than resetting.
- [ ] Equaliser bars use different durations and negative delays so they never move in step.
- [ ] Covers are CSS gradients, swapped by one class; no image files.
- [ ] Scrubber is a native range with a filled track and `aria-valuetext` in m:ss.
- [ ] Previous restarts the track if more than 3s in.
- [ ] Both play buttons share one state and one label.
- [ ] Track changes are announced politely; the clock is not.
- [ ] Hit targets ≥ 40px for buttons.
- [ ] Reduced motion: no spin, still bars, instant resize.

### This demo

- [ ] Turntide, tracks Monsoon Radio (3:48), Copper Bus (4:12), Late Tram (3:05).
- [ ] Opens at 1:14 of Monsoon Radio, playing, medium.
- [ ] Widget `#2b1d14`, r 28px; page `#e9dcc0` with `#e2d2b1` stripes 4px every 26px.
- [ ] Play button 48px `#d9541e`; equaliser `#e3a92b`.
- [ ] Shrikhand for title and cover text; Space Mono for the rest.

## Implementation notes

**Pause by freezing, not removing.** Removing the animation snaps the record back to 0°. `animation-play-state` holds the frame:

```css
.rec { animation: spin 3.2s linear infinite; animation-play-state: paused; }
.w.playing .rec { animation-play-state: running; }
.eq span { transform-origin: bottom; animation: eq 900ms var(--std) infinite alternate; animation-play-state: paused; }
.w.playing .eq span { animation-play-state: running; }
@keyframes eq { 0% { transform: scaleY(.25) } 50% { transform: scaleY(1) } 100% { transform: scaleY(.45) } }
```

**A filled range track with one custom property.** Write the percentage from JS; the track gradient reads it:

```css
input[type=range] { -webkit-appearance: none; appearance: none; height: 24px; background: transparent; --v: 0%; }
input[type=range]::-webkit-slider-runnable-track {
  height: 4px; border-radius: 2px;
  background: linear-gradient(90deg, var(--orange) var(--v), var(--card-2) var(--v)); }
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 14px; height: 14px; margin-top: -5px;
  border-radius: 50%; background: var(--ink); border: 3px solid var(--orange); }
```

Set `--v` on the widget too, so the small size's 3px bar reads the same number.

**Don't fight the user's drag.** The 1s clock must skip writing `seek.value` while the thumb is held:

```js
seek.addEventListener('input', () => { dragging = true; pos = +seek.value; paint(); });
seek.addEventListener('change', () => { dragging = false; });
setInterval(() => { if (!playing || dragging) return; pos++; pos >= dur ? next() : paint(); }, 1000);
```

The record is a radial gradient for the label and spindle hole plus a `repeating-radial-gradient` of 1px lighter rings every 3px for grooves, with a faint conic highlight in `::after`. The highlight spins with the record; that is acceptable at this size.

Common mistakes:

- A glossy gradient play button. The button is flat orange.
- Spinning the cover instead of the record.
- Letting the title wrap to two lines in medium; the scrubber gets pushed out of the widget.
- Using `ease` for the resize. Use expo out so the small square settles.
- Duplicating state for the mini play button instead of sharing one `setPlaying()`.
- Purple or neon equaliser bars. They are mustard.

Rebuild order:

1. Page stripes, segmented switch.
2. Medium shell, sleeve with cover and record.
3. Body: label, title, artist, range, times, controls.
4. Track data, `load()`, `paint()`, the 1s clock.
5. Play/pause with frozen animations; equaliser.
6. Small size overlay and the resize transition.
7. Live region, reduced motion, the column layout under 540px.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
