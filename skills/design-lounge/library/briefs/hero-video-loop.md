<!-- Design Lounge Nº 193 · "Cinematic video loop hero" · www.designlounge.live -->

# Cinematic video loop hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. The demo fakes the footage on a canvas so it can ship with no files. In production, use a real `<video>` with the exact attributes in Implementation notes.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The opening of a small hotel's site. Casa Vellera has eleven rooms on Lake Orta, and the hero is a 10-second night film of the lake: warm shore lights on a dark hill line, their reflections breaking up on moving water, a small boat crossing, and film grain. A serif headline sits on the left over a scrim, with one warm call to action. A thin control bar at the bottom carries a visible Pause button, a captions toggle, a timecode and the location. The detail worth copying is that the film is treated like real media: it has a poster still, it stops when nobody can see it, it has captions for its sound, and the user can always stop it.

## Structure

```
1280 × 800, full-bleed, overflow hidden
┌──────────────────────────────────────────────────────────────────┐
│ Casa Vellera (italic serif)        ROOMS  THE TABLE  THE LAKE [RESERVE] │ 30px top, 56px sides
│                                                     • STILL · FILM PAUSED │ poster only
│  LAKE ORTA · PIEDMONT · SINCE 1911                                 │
│  The lake keeps          ~~~~~~ hill line + shore lights ~~~~~~~   │ horizon at 56%
│  late hours.  (104px)    ≡ ≡  reflections on water  ≡ ≡ ≡          │
│  Eleven rooms on the western shore …  (17px, max 430px)            │
│  [RESERVE A ROOM]   SEE THE ELEVEN ROOMS                           │ copy bottom 120px
│                     [ caption box when CC is on ]                  │ bottom 104px
│ ━━━━━━━━━━━━━━━──────────────────────────────────────────────────│ 1px rule + progress
│ [|| PAUSE] [CC]  00:03 / 00:10              45°48′N 8°24′E · FILMED AT 21:40 │ 72px bar
└──────────────────────────────────────────────────────────────────┘
layers, back to front: film → vignette → scrim → content
```

- `main.hero`: `position: relative; height: 100%; min-height: 560px; overflow: hidden; isolation: isolate`.
- The film: in the demo a `canvas` with `role="img"` and an `aria-label` describing the shot. In production a `video` (see notes).
- `.vignette`: `radial-gradient(120% 90% at 50% 45%, transparent 50%, rgba(0,0,0,.6) 100%)`, `aria-hidden`.
- `.scrim`: a left gradient and a bottom gradient, `aria-hidden`. It carries the text contrast.
- `header`: logo link and a `nav` labelled "Primary" with three links and the outlined "Reserve" link.
- `section.copy`: eyebrow `p`, the only `h1`, sub `p`, the filled CTA link and the underlined text link.
- `p.cap`: the caption box. `aria-live="off"` while captions are hidden, `polite` while shown.
- `.bar`: progress line, then the Play/Pause `button`, the CC `button` and the timecode at the left, and the location pushed right with `margin-left: auto`. Controls stay at the left end so a chat widget or host badge in the bottom-right corner never covers Pause.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Film frame | loop | canvas draw / video | frame n → n+1 | 41.7ms (24fps) | none | poster still |
| Camera push | loop | scale | 1.025 → 1.045 → 1.025 | 10s | sine | none |
| Camera drift | loop | x offset | ±0.2% width | 5s | sine | none |
| Boat light | loop | x | -10% → 110% | 10s | linear (it is a boat) | none |
| Reflections | loop | streak x, width, alpha | sine wobble | 3.3s and 5s cycles | sine | none |
| Light twinkle | loop | glow alpha | 0.5 → 1 | 3.3 to 10s | sine | none |
| Grain | every frame | tile offset | random | 41.7ms | none | static |
| Progress line | loop | scaleX | 0 → 1 | 10s | linear | fixed at poster time |
| Caption box | CC toggle | opacity | 0 → 1 | 200ms | `--ease` | instant |
| Copy block | CC toggle | bottom | 120px → 168px | instant | none | instant |
| CTA, links, controls | hover | colour, border | see States | 160 to 200ms | `--ease` | instant |

- With a real video, the push, drift, boat and grain are baked into the file. Only the progress line, captions and controls stay in code.

## States

- Playing: button "Pause" with pause bars, `aria-label="Pause film"`.
- Paused by the user: frame kept, button "Play" with a triangle, `aria-label="Play film"`.
- Paused by the system (off-screen, tab hidden): frame kept. The button does not change.
- Poster (reduced motion, or before the video can play): still at 6.2 s, tag "Still · film paused" at the top right, button "Play".
- Captions off: CC outlined, caption box opacity 0, `aria-live="off"`.
- Captions on: CC filled `--ivory` with `--black` icon, `aria-pressed="true"`, caption box shown, copy moved up 48px.
- Hover: CTA fill `#e9b872` → `#f3cb8f`. Outlined controls: border `--rule` → `--warm`. Nav: `--muted` → `--ivory`.
- Focus-visible: `outline: 2px solid #e9b872; outline-offset: 3px` on every link and button.
- Error (production): if the video fails to load, keep the poster and hide the Pause and CC buttons.

## Accessibility

- The Pause button is visible at all sizes. Motion runs longer than 5 s, so WCAG 2.2.2 requires it. Never hide it on hover or on phones.
- The Pause button has visible text on desktop and an `aria-label` that names the next action ("Pause film" / "Play film"). On phones the text hides and the label stays.
- The CC button is a toggle with `aria-pressed`. Captions describe sound, in brackets, as caption files do.
- The caption box is `aria-live="polite"` only while captions are on. Otherwise screen readers would hear three lines every 10 s.
- The demo canvas has `role="img"` and a short description of the shot. A production `video` that is decorative gets `aria-hidden="true"` instead, with the same sentence moved to a visually hidden paragraph if the film carries meaning.
- Focus order: logo, nav links, Reserve, Reserve a room, See the eleven rooms, Pause, CC.
- Contrast: `#f1e8da` on the scrim is above 13:1. `#b9ad9b` sub copy on the scrimmed left side is above 7:1. `#0b0907` on the `#e9b872` CTA is above 10:1.
- Hit targets: controls are 44px tall and at least 44px wide.

## Responsive rules

- ≥1280: as drawn. Horizon at 56% of the height.
- 1024: same layout. The headline wraps within 620px. The scrim keeps its percentages.
- 768 and below (`max-width: 900px`): nav links hide, "Reserve" stays. Padding 24px. Headline 64px. The scrim turns vertical (`0deg`, 0.9 → 0.55 → 0.1). The location label hides; Pause, CC and the timecode stay at the left. CC and Pause become 44 × 44px icon buttons with labels kept. The caption box sits 96px from the bottom at 14px.
- Portrait (width < height): the horizon moves up to 30% of the height so the lights sit above the copy, and the hill line is flattened to 45% height.
- Under 640: render the canvas at 0.5 of the capped DPR (0.65 on desktop, DPR capped at 1.5). With a real video, serve the 720p file, or the poster only when `navigator.connection.saveData` is true or the effective type is "2g" or "slow-2g".
- Never let the hero scroll horizontally. The film is `object-fit: cover` and the hero is `overflow: hidden`.

## Acceptance checklist

### Always

- [ ] The film starts playing on load, muted, with no sound control needed.
- [ ] A visible Pause/Play button at every size, with a label that names the next action.
- [ ] A poster still exists and shows under reduced motion, before the video can play, and on data saver.
- [ ] The film stops when off-screen (IntersectionObserver) and when the tab is hidden, and resumes only if the user had not paused it.
- [ ] Captions toggle with `aria-pressed`; the caption region is live only while shown.
- [ ] The loop has no visible cut at the 10 s mark.
- [ ] Copy sits on a scrim; body text contrast is at least 4.5:1.
- [ ] Production video is at most 4 MB, 8 to 12 s, WebM and MP4.
- [ ] Focus rings visible on every control.
- [ ] No horizontal overflow at 390 or 1280.

### This demo

- [ ] The headline reads "The lake keeps late hours." at 104px, with "late hours." italic in `#e9b872`.
- [ ] The CTA reads "Reserve a room"; the link reads "See the eleven rooms".
- [ ] The bar reads "45°48′N 8°24′E · Filmed at 21:40" and "00:00 / 00:10".
- [ ] The film runs at 24fps with a 10 s loop and grain at 14% overlay.
- [ ] The poster is the frame at 6.2 s.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the film is playing. Shore lights glow along a low hill line at 56% of the height. Broken gold reflections move on the water below. The timecode starts at "00:00 / 00:10" and a 1px gold progress line grows along the top of the control bar.
2. The film runs at 24 frames per second, not 60, so it reads as footage. One loop is 10 s and repeats with no visible cut: every motion is periodic over 10 s.
3. The camera does a slow push: scale 1.025 to 1.045 and back over one loop, with a 0.2% sideways drift twice per loop.
4. A small boat light crosses from left to right once per loop, fading in and out over the first and last 12% of its path.
5. Grain is redrawn every frame from three 128px noise tiles, offset each frame, at 14% opacity in overlay blend.
6. Click "Pause". The film freezes on the current frame. The button becomes "Play" with a triangle icon, and its label becomes "Play film". Click again to continue from the same frame.
7. Click "CC". The button fills ivory and `aria-pressed="true"`. A caption box appears 104px above the bottom, centred, and the copy block moves up 48px to make room. Captions change with the film time: 0 s "[Water laps against the jetty]", 3.4 s "[A boat engine, far off across the lake]", 7 s "[Glasses and quiet voices from the terrace]".
8. Scroll the hero out of view or switch tabs. The film stops. It resumes when visible again, unless the user paused it.
9. With `prefers-reduced-motion: reduce` the page shows the poster: a still frame at 6.2 s. A small "Still · film paused" tag appears at the top right. The button reads "Play". The user can press Play to run the film.
10. Nav links, the reserve link and the controls have 160 to 200ms colour and border shifts and a 2px gold focus ring.

## Tokens

```css
:root {
  /* colour */
  --black: #0b0907;      /* page, under the film */
  --ivory: #f1e8da;      /* headline, buttons text */
  --muted: #b9ad9b;      /* sub copy, nav, timecode */
  --warm: #e9b872;       /* accent words, eyebrow, CTA fill, progress, focus */
  --ember: #c9773b;      /* horizon haze in the film only */
  --rule: rgba(241, 232, 218, .2);
  --scrim: rgba(8, 6, 4, .78);
  --focus: #e9b872;

  /* type */
  --serif: "Cormorant Garamond", Georgia, serif;
  --sans: "Work Sans", system-ui, sans-serif;
  --fs-hero: 104px;
  --fs-sub: 17px;
  --fs-sc: 11px;      /* small caps labels */
  --fs-cap: 16px;

  /* space */
  --s-1: 8px; --s-2: 12px; --s-3: 22px; --s-4: 28px; --s-5: 34px; --s-6: 56px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-micro: 160ms;
  --t-btn: 200ms;

  /* film */
  --loop: 10s;
  --fps: 24;
  --poster-at: 6.2s;
  --grain-opacity: .14;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Logo | Cormorant Garamond italic | 28px | 400 | 1 | 0.01em | as written |
| Nav, labels, buttons | Work Sans | 11px | 500 | 1 | 0.2em | upper (small caps style) |
| Eyebrow | Work Sans | 11px | 500 | 1 | 0.2em | upper, `--warm` |
| Headline | Cormorant Garamond | 104px | 400 | 0.9 | -0.02em | sentence |
| Headline accent | Cormorant Garamond italic | 104px | 400 | 0.9 | -0.02em | "late hours." in `--warm` |
| Sub | Work Sans | 17px | 400 | 1.6 | 0 | sentence |
| Timecode | Work Sans | 12px | 400, tabular numbers | 1 | 0.06em | as written |
| Caption | Work Sans | 16px | 400 | 1.4 | 0 | as written |

- The small caps are uppercase Work Sans at 11px with 0.2em tracking. Do not fake them with `font-variant: small-caps` on a face that has no small caps.
- Keep the serif at weight 400. Bolder Cormorant looks cheap at 104px.

## Implementation notes

### 1. Shipping it with a real video

Replace the canvas with this. Every attribute matters.

```html
<video class="film" autoplay muted loop playsinline preload="metadata"
       poster="/media/orta-night-poster.jpg" aria-hidden="true"
       disablepictureinpicture disableremoteplayback>
  <source src="/media/orta-night-1080.webm" type="video/webm">
  <source src="/media/orta-night-1080.mp4" type="video/mp4">
  <track kind="captions" src="/media/orta-night.en.vtt" srclang="en" label="English">
</video>
```

File rules:

1. Length 8 to 12 s. This demo is 10 s. Cut on a frame that matches the first, or crossfade the last 0.5 s into the first in the edit.
2. Size at most 4 MB for the 1080p file, at most 1.5 MB for the 720p file. No audio track at all (strip it, do not just mute it).
3. WebM (VP9 or AV1) first, MP4 (H.264, `+faststart`) second.
4. 24fps. Grain is baked in at encode, not added in CSS over the video.
5. Poster: a JPEG or AVIF of the frame you want as the still, at most 120 KB, same aspect ratio.
6. `preload="metadata"`, never `auto`. `muted` and `playsinline` are both required for autoplay on iOS.
7. Captions: a WebVTT file with the three sound cues. The CC button toggles `track.mode` between `showing` and `hidden`, or renders cues into the caption box from `cuechange`.

### 2. Play, pause, poster, visibility

```js
const video = document.querySelector('.film');
let userPaused = false, onScreen = true;
function update() {
  const should = !userPaused && onScreen && !document.hidden;
  if (should && video.paused) video.play().catch(() => showPoster());
  else if (!should && !video.paused) video.pause();
}
new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; update(); }, { threshold: 0.25 }).observe(video);
document.addEventListener('visibilitychange', update);
playBtn.addEventListener('click', () => { userPaused = !userPaused; syncButton(); update(); });
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const saveData = navigator.connection?.saveData;
if (reduce.matches || saveData) { userPaused = true; video.removeAttribute('autoplay'); video.pause(); syncButton(); }
video.addEventListener('error', showPoster, true);
```

`showPoster()` keeps the poster visible and hides the Pause and CC buttons. A blocked `play()` promise must land on the poster, not on a black box.

### 3. The canvas stand-in (demo only)

The demo draws the shot at 24fps on a canvas at reduced resolution, so it ships as one file. Throttle rAF to the film rate and keep time periodic:

```js
const LOOP = 10, FPS = 24;
function frame(now) {
  acc += Math.min(now - last, 100);
  last = now;
  if (acc >= 1000 / FPS) {
    t = (t + acc / 1000) % LOOP;
    acc = 0;
    draw(t);                   // every motion uses sin(t / LOOP * 2π * n)
  }
  raf = requestAnimationFrame(frame);
}
```

Draw order per frame: sky gradient, ember haze (`rgba(201,119,59,.22)` radial at 62% across the horizon), hill silhouette `#050404` with quadratic curves, water gradient `#120c08` → `#040303`, then lights and reflections in `lighter` blend, then grain in `overlay` at 0.14. Each light gets a radial glow, a soft vertical column, and 6 to 16 broken horizontal streaks whose gaps grow 22% per row and whose widths and x offsets follow two sines. Skip a streak when the wobble is under 0.35, so the reflection breaks up like real water.

Common mistakes:

- An autoplay video with no Pause control, or a Pause control that only appears on hover.
- Forgetting `playsinline`. iOS then opens the video full screen.
- `preload="auto"` on a hero. It downloads the whole file before the page is useful.
- A 20 MB, 30-second "brand film" in a hero. Keep it at 4 MB and 10 s.
- A sound track that is muted but still downloaded.
- Letting the video play in a background tab or below the fold.
- Reduced motion that still autoplays "because it is slow". Show the poster.
- Putting text on the bright part of the shot with no scrim.
- Adding CSS grain over a real video. Bake it in the encode.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
