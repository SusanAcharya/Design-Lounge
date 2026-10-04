<!-- Design Lounge Nº 227 · "Download button with progress and retry" · designlounge.vercel.app -->

# Download button with progress and retry

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The release download card for "pocketknife", a fictional command-line task runner, on a near-black grid page. The hero is a 60px acid-lime button, "Download for macOS · arm64 · 18.4 MB". Clicking it turns the same 60px row into a progress bar with a moving stripe. The bar reads "Downloading 41%" on the left and "7.5 / 18.4 MB · 3.3 MB/s · 4s left" on the right. Pause and cancel squares grow out of the right edge. Done fills the bar solid, draws a check and names the file. A dropped connection turns the bar coral and keeps the bytes, and the pause square becomes Retry, which resumes from where it stopped. Below, three asset rows use a 40px progress ring as their button: download, pause, resume, retry, done.

The detail worth copying is the label that **inverts where the fill passes**. The text is drawn twice, light on the track and dark inside the fill, and the fill's `clip-path` reveals the dark copy. Every character stays readable at every percent.

## Structure

```
1280 × 800, panel 680px centred, 48px grid page with radial vignette
┌ panel ─────────────────────────────────────────────────────────┐ padding 28
│ [■] pocketknife v3.2.0 (latest)                                │
│ A pocket-sized task runner for monorepos. Released 2 Oct 2026. │
│ ┌ main (flex 1) ─────────────────────────────┐ ┌60┐ ┌60┐         │ 60px
│ │▓▓▓▓▓▓▓ Downloading 41% ░ 7.5 / 18.4 MB · …│ │ ‖│ │ ×│         │
│ └────────────────────────────────────────────┘ └──┘ └──┘         │
│ sha256 7c1e4f…09a3b2              (o) Simulate a dropped conn.  │
│ OTHER ASSETS                                                    │
│ [▤] pocketknife-3.2.0-linux-x64.tar.gz         ( ring 40 )      │ 12px rows
│     15.0 MB / 17.9 MB · 2.2 MB/s                                 │
│ [▤] pocketknife-3.2.0-windows-x64.zip          ( ring )         │
│ [▤] checksums.txt  1.2 KB · verified           ( disc + check ) │
└────────────────────────────────────────────────────────────────┘
```

- `.dl` is a 60px flex row: `.main` (flex 1, `position: relative`) holds `button.go` and `div.bar[role=progressbar]`, both `inset: 0`. Then `button#pause.ctl` and `button#cancel.ctl`.
- `.bar` contains `.txt` (light label) and `.fill` (lime, clipped). `.fill` contains a second `.txt` with the same spans in dark ink. JS writes both copies.
- `.under` is the checksum or "Download again", plus the switch (`<label>` wrapping `button[role=switch]`).
- `<h2>` then `ul.rows > li.row`: file icon (32px tile), `.fname` (mono name + mono meta), and `button.ring`. Inside the ring: `.disc`, an SVG with a track and arc circles (r=17, rotated −90°), and an icon SVG.
- One visually hidden polite live region.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| `.go` | start | opacity, scaleX | 1, 1 → 0, .97 | 160 / 280ms | `--ease` / `--ease-out` | 1ms |
| `.bar` | start | opacity | 0 → 1 | 160ms | `--ease` | 1ms |
| `.ctl` ×2 | start / end | width, margin-left, opacity | 0, 0, 0 ↔ 60px, 8px, 1 | 280ms | `--ease-out` | 1ms |
| `.fill` | progress | clip-path right inset | 100% → 0% | per frame | n/a (data) | kept, it is information |
| `.fill` stripes | running | background-position | 0 → 22.63px | 700ms loop | linear | static |
| hero check | done | stroke-dashoffset | 22 → 0 | 360ms, delay 120ms | `--ease` | drawn |
| ring arc | progress | stroke-dashoffset | 106.8 → 0 | per frame | n/a | kept |
| ring `.disc` | done | scale | 0 → 1 | 280ms | `--ease-out` | 1ms |
| ring check | done | stroke-dashoffset | 22 → 0 | 360ms, delay 120ms | `--ease` | drawn |
| switch knob | toggle | translateX | 0 → 16px | 160ms | `--ease` | 1ms |
| track/fill colour | pause, error | background-color | lime → dim / coral | 280ms | `--ease` | 1ms |

The stripe is the only loop, and it runs only while bytes are moving. It stops on pause, error, done and reduced motion.

## States

- **Idle:** lime button. Hover `brightness(1.06)`. Active scale .985.
- **Running:** striped lime fill over the `--surface-2` track with a 1px `--line` ring. Pause and cancel squares are visible.
- **Paused:** fill `#a9c447`, stripes still. Play glyph, label "Resume download".
- **Error:** coral-tinted track and ring, coral fill without stripes, coral text on the track side and `#1a0c08` inside the fill. Retry glyph in a coral-ringed square.
- **Done:** solid lime, drawn check, file name. The squares collapse, and "Download again" replaces the checksum.
- **Ring idle / running / paused / error / done:** download glyph / pause + lime arc / play + dim arc / retry + coral arc and coral meta / lime disc + dark check + `aria-disabled`.
- **Ring hover:** the track goes `#3a4234` (not when done).
- **Switch on:** coral track, dark knob at 16px.
- **Focus-visible:** 2px `--acid` outline, 3px offset, on every control including the squares and rings.

## Accessibility

- The hero idle button has a full label: "Download pocketknife for macOS, arm64, 18.4 megabytes".
- The bar is `role="progressbar"` with `aria-valuemin=0`, `aria-valuemax=100`, and `aria-valuenow` updated only when the integer percent changes. `aria-valuetext` is "41%, 7.5 MB of 18.4 MB". It is `aria-hidden` while idle.
- The squares are real buttons with labels that name the action: "Pause download", "Resume download", "Retry download", "Cancel download". They are `inert` when collapsed.
- Focus: start → Pause. Error → Retry. Done → "Download again". Cancel or again → the hero button. Focus never falls to `<body>` when a control collapses.
- The live region announces: paused at N%, resumed, connection dropped at N% (retry resumes from X MB), download complete with file name and size, and each row's downloaded or failed message. Progress ticks are not announced.
- Ring labels: "Download linux-x64.tar.gz, 17.9 MB", "Pause linux-x64.tar.gz", "Resume …", "Retry …", and "… downloaded" (`aria-disabled="true"`, so it stays focusable and explains itself).
- The switch is `role="switch"` with `aria-checked` and the visible label text.
- Contrast: `--ink-3` on `--surface` is 4.97:1. `--on-acid` on `--acid` is 14.2:1. `--err` on `--surface` is 6.5:1. Dark text on the coral fill is 6.75:1.
- Hit targets: hero row 60px, squares 60 × 60, rings 44 × 44.

## Responsive rules

- ≥ 1280: 680px panel, as specified.
- 1024–1279 and 768–1023: unchanged. The panel is `min(680px, 100%)`.
- ≤ 520: panel padding 20px. The hero's "arm64 · 18.4 MB" is hidden. The bar hides its right-hand meta and keeps "Downloading N%", because the squares need 136px. The checksum and switch stack. File names truncate with an ellipsis, so the ring never wraps.
- The page grid must use `grid-template-columns: minmax(0, 1fr)`. Otherwise long mono file names set the min-content width and push the page past 375px.

## Acceptance checklist

### Always

- [ ] The idle button and the progress bar occupy the same row and height. The bar does not appear somewhere else.
- [ ] The label stays legible across the fill edge (two layers, clipped).
- [ ] Bytes, total, speed and time left are shown while running, in a monospace face.
- [ ] Pause keeps the bytes. Resume continues from them.
- [ ] Error keeps the bytes, explains what happened, and offers Retry in the same square as Pause.
- [ ] Done names the file and offers a way to download again.
- [ ] The stripe loop stops whenever bytes are not moving.
- [ ] One rAF loop for all jobs, stopped when idle. No `setInterval` ticking.
- [ ] Focus moves to the control that replaces the one that disappeared.

### This demo

- [ ] Hero file: macOS arm64, 18.4 MB, about 3.4 MB/s (finishes in about 5–6s).
- [ ] Flaky switch: the next run fails at 47 % ("8.6 / 18.4 MB kept").
- [ ] linux-x64.tar.gz starts at 38 % on load. windows-x64.zip fails once at 62 %. checksums.txt starts done.
- [ ] The accent is `#c8f04a`, paused `#a9c447`, error `#ff6a4d`.
- [ ] Squares are 60px. Ring radius 17, stroke 2.5, circumference 106.8.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: a 680px panel. Header: 36px lime mark, "pocketknife" (24px/700), "v3.2.0" in mono, and a "latest" outline tag. Lede: "A pocket-sized task runner for monorepos. Released 2 Oct 2026."
2. The hero button is idle: lime fill, a download glyph, "Download for macOS", and "arm64 · 18.4 MB" right-aligned in mono at 75 % opacity. Below it, on the left, "sha256 7c1e4f…09a3b2" in mono. On the right, a switch "Simulate a dropped connection" (off).
3. "Other assets": linux-x64.tar.gz (17.9 MB) is **already downloading** from 38 % at about 2.2 MB/s, so the page is alive on load. windows-x64.zip (19.2 MB) is idle. checksums.txt (1.2 KB) is done, with a lime disc and a check.
4. Click the hero: the button fades (160ms) and scales X to .97. The bar fades in under it. The pause and cancel squares grow from width 0 to 60px with an 8px left margin (280ms). Focus moves to Pause.
5. While running, the fill width is the true fraction. The stripes (−45°, 8px dark at 9 % / 8px clear) slide continuously, 700ms per tile. The left label is "Downloading N%". The right label is "got / total MB · speed MB/s · Ns left". Speed wanders between 70 % and 130 % of 3.4 MB/s and is smoothed, so the number breathes rather than flickers.
6. **Pause:** the stripes stop, the fill dims to `#a9c447`, the label reads "Paused at N%" and "got / 18.4 MB", and the square shows a play glyph labelled "Resume download". Resume continues from the same byte.
7. **Cancel:** returns to the idle button at 0 and focuses it. The live region says "Download cancelled."
8. **Done** (18.4 of 18.4): the fill becomes solid lime with no stripes. A check draws (360ms after 120ms) before "Downloaded", with the file name "pocketknife-3.2.0-macos-arm64.pkg" on the right. The squares collapse to 0. Under the bar, the checksum is replaced by a lime "Download again" text button, which takes focus.
9. **Error:** with the switch on, the next download stops at exactly 47 %. The track turns `rgba(255,106,77,.14)` with a coral ring, and the fill turns coral with no stripes. The label reads "(!) Connection dropped" and "8.6 / 18.4 MB kept". The pause square becomes a coral Retry glyph and takes focus. Retry resumes from 8.6 MB. Each run fails at most once.
10. **Ring rows:** click idle to start (the ring arc draws, the meta shows "got / total MB · speed MB/s", the centre shows pause). Click to pause (the arc dims, "Paused · got / total MB", play glyph). Click to resume. windows-x64.zip fails once at 62 % (the arc goes coral, the meta reads "Mirror reset at 62% · tap to retry", retry glyph). Done: a lime disc scales in from 0 behind a drawn dark check, the meta reads "17.9 MB · verified", and the button becomes `aria-disabled`.
11. One `requestAnimationFrame` loop drives every running job and stops itself when nothing is running.

## Tokens

```css
:root {
  --bg: #0b0d0a;            /* page, 48px grid lines in --line, radial vignette to --bg at 70% */
  --surface: #121510;       /* panel */
  --surface-2: #1a1e17;     /* bar track, control squares, file tiles */
  --line: #262c22;
  --ink: #e4e9d8;
  --ink-2: #a3ac95;
  --ink-3: #7f8872;
  --acid: #c8f04a;          /* the one accent: button, fill, ring arc, done disc, focus */
  --acid-dim: #a9c447;      /* paused fill and arc */
  --on-acid: #10140a;
  --err: #ff6a4d;
  --err-soft: rgba(255, 106, 77, .14);

  --sans: "Epilogue", system-ui, sans-serif;
  --mono: "Fragment Mono", ui-monospace, monospace;

  --r: 10px;                /* button, bar, squares */
  --r-panel: 16px;
  --h: 60px;                /* hero row */
  --ring: 40px;             /* ring svg; button is 44px */
  --ring-c: 106.8;          /* 2π·17 */

  --t-micro: 160ms;
  --t-morph: 280ms;
  --t-check: 360ms;
  --t-stripe: 700ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Product name | Epilogue | 24px | 700 | 1 | −0.02em | |
| Lede | Epilogue | 15px | 500 | 1.5 | 0 | `--ink-2` |
| Hero label | Epilogue | 16px | 700 | 1 | 0 | `--on-acid` |
| Bar status | Epilogue | 15px | 600 | 1 | 0 | "Downloading 41%" |
| Bar meta | Fragment Mono | 13px | 400 | 1 | 0 | bytes · speed · eta, ellipsis |
| Version, tag, sha | Fragment Mono | 12–13px | 400 | 1.5 | 0 | |
| Section label | Epilogue | 12px | 600 | 1 | 0.1em | UPPERCASE `--ink-3` |
| File name | Fragment Mono | 13.5px | 400 | 1.4 | 0 | ellipsis |
| File meta | Fragment Mono | 12.5px | 400 | 1.4 | 0 | `--ink-3`, error `--err` |
| Switch label | Epilogue | 13px | 500 | 1 | 0 | `--ink-2` |

Numbers are mono so the bytes and speed don't jitter sideways while ticking.

## Implementation notes

**Inverting label with one clip.** Render the label twice. The dark copy lives inside the fill, and the fill is clipped from the right by the remaining percent. Set `--p` on the bar each frame.

```css
.bar { position: relative; overflow: hidden; background: var(--surface-2); border-radius: 10px; }
.txt { position: absolute; inset: 0; display: flex; align-items: center; gap: 16px; padding: 0 20px; white-space: nowrap; }
.fill { position: absolute; inset: 0; background-color: var(--acid); color: var(--on-acid);
  clip-path: inset(0 calc(100% - var(--p, 0%)) 0 0);
  background-image: repeating-linear-gradient(-45deg, rgba(16,20,10,.09) 0 8px, transparent 8px 16px);
  background-size: 22.63px 22.63px; }
[data-state=running] .fill { animation: stripes 700ms linear infinite; }
@keyframes stripes { to { background-position: 22.63px 0; } }
```

`22.63px` is 16 × √2, which makes the −45° stripe tile with no visible join.

**One loop, smoothed speed, single failure.**

```js
function tick(t) {
  const dt = last ? Math.min(.1, (t - last) / 1000) : 0; last = t;
  let any = false;
  for (const j of jobs) {
    if (j.state !== 'running') continue; any = true;
    j.v += (j.base * (.7 + Math.random() * .6) - j.v) * Math.min(1, dt * 3);   // ease toward a jittered target
    j.got = Math.min(j.total, j.got + j.v * dt);
    if (j.failAt && j.got >= j.failAt * j.total) { j.got = j.failAt * j.total; j.failAt = 0; j.set('error'); continue; }
    if (j.got >= j.total) { j.set('done'); continue; }
    j.paint();
  }
  raf = any ? requestAnimationFrame(tick) : (last = 0, 0);
}
```

Clamp `dt` to 100ms so a backgrounded tab doesn't jump to done on return. In a real app, replace the simulator with `fetch` plus a `ReadableStream` reader for bytes, and with `Range: bytes=N-` for resume.

**Ring.** `stroke-dasharray: 106.8; stroke-dashoffset: calc(106.8 * (1 - var(--f)))`, rotated −90° so it starts at 12 o'clock. Only rotate the ring SVG, not the centre icon. A broad `.ring > svg` selector turns the pause bars sideways.

Common mistakes:

- Putting the overlay bar on top of the idle button without `pointer-events: none`. It silently eats the first click.
- Animating `width` on the fill. Use `clip-path` or `scaleX`, and keep the label layers aligned.
- Proportional digits for bytes and speed. The line shimmies every frame.
- Restarting from zero on retry. Keep the bytes and say so ("8.6 / 18.4 MB kept").
- Announcing every percent to screen readers.
- Leaving the stripe animating on a paused or failed bar. It tells the user something is moving when nothing is.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
