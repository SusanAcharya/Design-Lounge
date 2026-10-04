<!-- Design Lounge Nº 124 · "M3 expressive music player" · designlounge.vercel.app -->

# M3 expressive music player

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A full-screen now-playing view for a fictional player ("Lull"), drawn in **Material 3 Expressive**: tonal surfaces, a 104px play control whose filled shape morphs (squircle → circle on press → 9-lobe cookie while playing), skip pills that squash on `:active`, and a liked heart that turns from a 20px squircle into a circle. The seeker is not a line-and-thumb: a 4px sine wave in `--primary` is clipped to elapsed time, a 4×24px rounded rect sits on the playhead, and the remaining time is a round-capped rest line. Changing track retints every token (wine / teal / saffron) over 600ms. Padding-top 54px and padding-bottom 34px leave the Lounge chrome clear. The detail worth copying is driving the play shape with a 72-point `clip-path: polygon(...)` so CSS can tween the morph.

## Structure

```
390 × 844   .app  column, pad 54 24 34
┌────────────────────────────────────────┐
│ [v] 48        Playing from album       │  top 48h
│               Late Bloom          [⋮]  │
│                                        │
│         ┌ art 326 × 326, r 44 ┐        │  margin 18 auto 0
│         │ LP · 03             │        │
│         │ LOW TIDE CHOIR      │        │
│         └─────────────────────┘        │
│  Paper Lanterns              [♥ 56]    │  like r 20 → 50%
│  Low Tide Choir                        │  title 26/700 Unbounded
│  [sine wave seek 342×28]               │  overlay range height 44
│  1:42                          3:58    │
│  [sfl]  [prev 68] (play 104) [next] [rep] │
│                                        │
│  [Lyrics] [Queue] [Studio speaker]     │  dock, margin-top auto
└────────────────────────────────────────┘
```

- `.app#app` — flex column, 100% height. Class `paused` when not playing.
- `.top` — minimise (chevron down, `aria-label="Minimise player"`), `.from` + `#album`, more (three dots, `aria-label="More options"`). Icon buttons 48×48.
- `#art` `role="img"` — `.no` top-right, `.lbl` bottom-left (two lines, Unbounded 13/700 uppercase).
- `.meta` — `<h1 id="title">`, `.artist`, `#like` 56×56.
- `.prog` — inline SVG `viewBox="0 0 342 28"` + range `#seek`. ClipPath `#cpr` rect. Wave `#wave` in group `.wv` > `.wp`. Thumb `#thumb`. Rest `#rest`.
- `.ctl` — shuffle, prev, play, next, repeat. Play contains `.sh#sh` (the morphing fill) and `#pi` icon.
- `.dock` — three buttons, 40px, 18px icons.

## Motion

| Element           | Trigger        | Property                 | From → To                         | Duration | Easing        | Notes |
|-------------------|----------------|--------------------------|-----------------------------------|----------|---------------|-------|
| Theme tokens      | track change   | bg, color on surfaces    | wine ↔ teal ↔ saffron             | 600ms    | `--ease-emph` | body class `t2` / `t3` |
| Play fill         | play / press   | clip-path                | squircle ↔ circle ↔ cookie        | 500ms    | `--ease-emph` | 72-gon polygon |
| Cookie            | playing        | rotate                   | 0 → 360°                          | 9s linear infinite | —     | `.play.on .sh` |
| Art out           | skip           | scale, translateX, opacity | 1,0,1 → .9, ±24px, 0            | 400 / 300ms | `--ease-emph` | swap at 260ms |
| Wave amplitude    | pause          | scaleY on `.wv`          | 1 ↔ 0                             | 400ms    | `--ease-emph` | origin 0 14px |
| Wave phase        | playing        | translateX on `.wp`      | 0 → −30px                         | 1.1s linear infinite | —  | paused via play-state |
| Like              | pressed        | radius, bg, color        | 20px squircle → circle            | 500ms    | `--ease-emph` | |
| Skip active       | :active        | width, radius            | 68 / pill → 76 / 16px             | 160ms    | `--ease-emph` | |
| Tone on type      | track change   | color                    | --on-surface / v                  | 600ms    | `--ease-emph` | |

Clip-path recipes (polar, 72 vertices, percent coords):

```
circle:  r = 48
squircle: r = 46 / ( |cos a|^4 + |sin a|^4 )^0.25
cookie:  r = 50 * (0.9 + 0.1 * cos(9a))
point i: (50 + r cos a, 50 + r sin a), a = i/72 * 2π
```

Wave path: `M -30 14` then `L x, 14 + 3.2*sin(x/30 * 2π)` for x from −30 to 372 step 2.

Progress draw: `p = max(6, t/dur * 342)`; clip rect width `max(0, p-6)`; thumb x `p-2`; rest x1 `min(342, p+8)`.

## States

- **Paused (first 600ms):** `.app.paused`, play squircle, triangle icon, `aria-label="Play"`, wave flat.
- **Playing:** `.play.on`, cookie + spin, pause icon, `aria-pressed="true"`, wave running.
- **Liked:** `aria-pressed="true"`, circle, `--primary-c`, filled heart.
- **Shuffle / Repeat pressed:** colour `--primary`, background `--surface-c`.
- **Skip active:** 76×56, radius 16px.
- **Focus-visible:** 3px `--primary` outline, 3px offset, 12px radius. Range itself `outline:none`; `.prog:focus-within` gets the 3px ring, 4px offset.
- **Dock cast:** `--primary-c` fill, pill radius; others 12px radius `--surface-c`.

## Accessibility

- Minimise, more, like, shuffle, prev, play, next, repeat all real `<button>`s with `aria-label`. Play also has `aria-pressed`. Like/shuffle/repeat use `aria-pressed`.
- Seek is `<input type="range" min="0" max="{dur}" aria-label="Seek" aria-valuetext="{cur} of {dur}">`.
- Art `role="img"` with album-specific `aria-label` ("Album art" then "Album art for {album}").
- Times are visible text; `aria-valuetext` stays in sync (`1:42 of 3:58`).
- Contrast: `--on-surface` on `--surface` is the primary pair (peach on wine, mint on teal, cream on saffron) and sits above 7:1. `--on-surface-v` is secondary 16px artist / 12px times.
- Hit targets: 48px icon buttons, 56px like, 68×56 skip, 104px play, 44px-tall seek overlay. Dock 40px (phone, at the bottom — keep 40px minimum).
- Status bar / home indicator: 54px / 34px padding on `.app`. Do not draw a status bar.

## Responsive rules

- 390 × 844: as specified. Art 326px (= 390 − 48).
- 360 wide: horizontal padding 16px; art `min(326px, 100vw − 32px)`; play 96px; skip 60px.
- Tablet width if shown: keep the column centred at 390px (`max-width: 390px; margin: 0 auto`); do not stretch the art into a landscape player.
- Reduced motion: morphs become instant; cookie does not spin; wave does not phase. Play still toggles.

## Acceptance checklist

- [ ] Frame is a phone column with 54px top and 34px bottom padding; no status bar drawn.
- [ ] Play control is 104px; clip-path morphs squircle → circle on press → cookie while playing, 500ms `cubic-bezier(.2,0,0,1)`.
- [ ] Cookie rotates every 9s only while playing.
- [ ] Seek is a clipped sine wave (amplitude 3.2, period 30) plus a 4×24 thumb; times are tabular `m:ss`.
- [ ] Initial time is 1:42 of 3:58; play auto-starts at 600ms.
- [ ] Three tracks retint the scaffold (wine / teal / saffron) over 600ms and swap CSS album art.
- [ ] Next art exits left; previous exits right (`go-r`); swap happens at 260ms.
- [ ] Liked heart is a 56px tonal square that becomes a circle; shuffle/repeat use `aria-pressed`.
- [ ] Skip buttons grow to 76px and radius 16px while `:active`.
- [ ] Focus-visible is a 3px primary ring; the range focuses the `.prog` wrapper.
- [ ] Reduced motion removes spin and phase but still plays, skips and seeks.
- [ ] Copy matches: Paper Lanterns, Glasshouse, Saffron Hour, Studio speaker, Lull.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First paint: track 1 **Paper Lanterns** / Low Tide Choir / album Late Bloom. Play is a squircle in `--primary`. App has class `paused`. Like is `aria-pressed="true"` (filled). Repeat is on; shuffle is off. Seek value 102 of 238 (1:42 / 3:58). Waveform is `scaleY(0)`.
2. After 600ms, play turns on: `aria-pressed="true"`, `aria-label="Pause"`, icon becomes two bars, shape becomes the cookie, cookie rotates 360° every 9s, waveform `scaleY(1)` and the wave path translates −30px every 1.1s. `setInterval` advances `t` by 1s.
3. Pointer-down on play sets clip-path to the circle; pointer-leave restores cookie (if playing) or squircle. Click toggles play.
4. **Next** / **Previous** cycle three tracks. Art gets `.out` (scale 0.9, translateX −24px, or +24px if `go-r` for previous), opacity 0, over 400ms / 300ms. At 260ms swap body class, art class (`a1`/`a2`/`a3`), title, artist, album, `LP · 03` label, and `aria-label`. Next rAF removes `.out`. Time resets to 0. If `t` hits duration while playing, auto-advance next.
5. Seek `<input type="range">` is opacity 0 over the 28px svg (hit height 44px). `input` sets `t` and redraws clip width, thumb `x`, rest `x1`, times, `aria-valuetext`.
6. Like, shuffle, repeat toggle `aria-pressed`. Liked: radius 50%, background `--primary-c`, icon fill. Toggled icon-buttons: colour `--primary` on `--surface-c`.
7. Skip `:active`: width 76px, radius 16px (from 68×56 pill).
8. Dock: Lyrics, Queue, **Studio speaker** (the last is `--primary-c` pill). They are visual only in this demo.
9. Reduced motion: all transitions 1ms, animations none. Autoplay-at-600ms still fires (state changes, no spin).

Tracks (match exactly):

| k | body class | art | title | artist | album | badge | art label | duration |
|---|------------|-----|-------|--------|-------|-------|-----------|----------|
| 0 | *(none)* | a1 | Paper Lanterns | Low Tide Choir | Late Bloom | LP · 03 | Low Tide / Choir | 238 |
| 1 | t2 | a2 | Glasshouse | Mirelle Okafor | Conservatory Sessions | EP · 01 | Mirelle / Okafor | 201 |
| 2 | t3 | a3 | Saffron Hour | The Velvet Ferries | Harbour Lights | LP · 07 | Velvet / Ferries | 274 |

Art backgrounds are CSS only (radials, repeating-conic, repeating-linear) — never photographs.

## Tokens

```css
:root {
  /* colour — track 1 wine; t2 and t3 override the same names */
  --surface: #2b1418;
  --surface-c: #3c1f24;
  --surface-high: #4a2a2f;
  --on-surface: #ffdad4;
  --on-surface-v: #e0bfb8;
  --track: rgba(255, 218, 212, .24);
  --primary: #ffb59e;
  --on-primary: #5c1a0b;
  --primary-c: #7a2e1e;
  --on-primary-c: #ffdbcf;

  /* type */
  --display: "Unbounded", system-ui, sans-serif;
  --font: "Onest", system-ui, sans-serif;

  /* layout */
  --r-art: 44px;
  --r-pill: 999px;
  --r-tonal: 20px;
  --art: 326px;
  --play: 104px;
  --wave-w: 342;
  --wave-h: 28;

  /* motion */
  --t-micro: 160ms;
  --t-shape: 500ms;
  --t-tone: 600ms;
  --ease-emph: cubic-bezier(.2, 0, 0, 1);
}

body.t2 {
  --surface: #0f2224; --surface-c: #1b3234; --surface-high: #26403f;
  --on-surface: #d6f0ee; --on-surface-v: #a9c6c3; --track: rgba(214, 240, 238, .22);
  --primary: #80d5d0; --on-primary: #003735; --primary-c: #1f504d; --on-primary-c: #9ff2ec;
}
body.t3 {
  --surface: #24200b; --surface-c: #353016; --surface-high: #433d20;
  --on-surface: #f1ecd2; --on-surface-v: #cfc6a6; --track: rgba(241, 236, 210, .22);
  --primary: #e3c75b; --on-primary: #3a3000; --primary-c: #544810; --on-primary-c: #ffe98c;
}
```

Body also transitions `background-color` and `color` over `--t-tone`.

## Typography

| Role         | Family    | Size | Weight | Line-height | Tracking | Case      |
|--------------|-----------|-----:|-------:|------------:|---------:|-----------|
| Body         | Onest     | 15px | 400    | 1.4         | 0        | sentence  |
| Playing from | Onest     | 12px | 400    | 1.3         | 0        | sentence  |
| Album        | Onest     | 14px | 600    | 1.3         | 0        | sentence  |
| Art badge    | Onest     | 11px | 500    | 1           | +0.12em  | mixed     |
| Art label    | Unbounded | 13px | 700    | 1.15        | +0.02em  | UPPERCASE |
| Title        | Unbounded | 26px | 700    | 1.15        | −0.02em  | sentence  |
| Artist       | Onest     | 16px | 400    | 1.4         | 0        | sentence  |
| Times        | Onest     | 12px | 500    | 1           | 0        | tabular   |
| Dock         | Onest     | 13px | 600    | 40px h      | 0        | sentence  |

Title is nowrap + ellipsis. Times use `font-variant-numeric: tabular-nums`. Format `m:ss` with padded seconds.

## Implementation notes

**Build the three polygons once** and assign the string; CSS will tween `clip-path` if vertex counts match (all 72):

```js
const N = 72;
const poly = (f) => 'polygon(' + Array.from({ length: N }, (_, i) => {
  const a = i / N * 2 * Math.PI, r = f(a);
  return (50 + r * Math.cos(a)).toFixed(2) + '% ' + (50 + r * Math.sin(a)).toFixed(2) + '%';
}).join(',') + ')';
const SH = {
  circle: poly(() => 48),
  squircle: poly((a) => 46 / Math.pow(Math.pow(Math.abs(Math.cos(a)), 4) + Math.pow(Math.abs(Math.sin(a)), 4), .25)),
  cookie: poly((a) => 50 * (.9 + .1 * Math.cos(9 * a))),
};
```

**Wave + clip as the only seek UI** (the range is invisible):

```js
function draw() {
  const dur = T[k].d, p = Math.max(6, t / dur * W);
  cpr.setAttribute('width', Math.max(0, p - 6));
  thumb.setAttribute('x', p - 2);
  rest.setAttribute('x1', Math.min(W, p + 8));
  cur.textContent = fmt(t); durEl.textContent = fmt(dur);
  seek.max = dur; seek.value = t;
  seek.setAttribute('aria-valuetext', fmt(t) + ' of ' + fmt(dur));
}
```

**Theme is a body class**, not per-element colours:

```js
document.body.className = x.c;          // '', 't2', or 't3'
art.className = 'art ' + x.a + ' out';  // keep .out for one frame, then drop it
```

Common mistakes: using `border-radius` instead of clip-path (you cannot get a cookie); drawing a standard M3 slider under the wave; swapping PNG album art; forgetting the 54/34 safe padding so the Lounge chrome covers the chevron and dock; running the 1s tick while paused; using `ease` instead of `cubic-bezier(.2, 0, 0, 1)` — Expressive motion is emphasized, not standard.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
