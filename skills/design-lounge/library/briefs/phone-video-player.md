<!-- Design Lounge Nº 343 · "Phone video player" · designlounge.vercel.app -->

# Phone video player

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The watch screen of "Frameline", a video app for long travel films. A 16:9 player sits at the top under a black band. Below it are the title, the channel row with Follow, a description that expands into a chapter list, and an Up next list. The "video" is an animated SVG scene of salt flats at night: stars, a moon, two dune layers drifting at different speeds and a pair of headlights crossing. Pausing freezes the scene. The feel is cinematic and quiet: near-black, white text, one red for progress. The detail to copy: the scrubber is split into chapter segments with 3px gaps, and dragging shows a bubble with the time and the chapter name.

The language is iOS-ish dark: 44px round icon buttons, a 64px play button on a dark disc, sheet-spring easing for layout moves, no glass.

## Reference behaviour

1. First frame: playing at 6:12 of 18:42. Controls are showing: "The crossing · Chapter 2" top left, CC and "1x" top right, back 10, pause and forward 10 in the middle, "6:12 / 18:42" and the full-screen button bottom, the chaptered scrubber on the bottom edge. The time counts up in real time.
2. After 3000ms with no input, the controls fade out over 200ms. A 2px red line on the bottom edge of the video keeps showing progress.
3. A single tap on the video shows the controls and restarts the 3000ms timer. A single tap while they show hides them at once.
4. Taps in the left 35% or right 35% wait 300ms before acting, so a second tap can be a double tap. A tap in the middle 30% acts at once.
5. Double tap left: seek −10s. Double tap right: seek +10s. A half-ellipse ripple grows from that edge with two chevrons and "10 s". Each extra tap inside 320ms adds 10s and the label becomes "20 s", "30 s".
6. The back 10 and forward 10 buttons do the same seek and show the same ripple.
7. Play/pause swaps the glyph and the label. Paused: the scene freezes with `animation-play-state: paused`, and the controls stay up until the user hides them.
8. Press on the scrubber: the track grows from 3px to 5px and the thumb scales to 1.4 over 160ms. The time jumps to the pointer. Drag: the time follows. A bubble above the thumb shows the time in 17px bold and the chapter name in 11px. The bubble is clamped inside the scrubber. Release: the track and thumb shrink back and the 3000ms timer starts again.
9. Ahead of the red fill, the next 90 seconds show as a lighter "buffered" fill.
10. The top-left label always names the current chapter: Arrival 0:00, The crossing 3:10, Camp 7:45, Night sky 12:20, Dawn 16:05.
11. CC toggles captions. A caption sits 12px above the bottom edge. While the controls show, it moves to 48px from the top so it never sits on the play button. Cues change every 5 seconds of video time.
12. "1x" opens a speed panel over the video: "Playback speed" and six 44px chips, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x. Picking one sets the rate, updates the button text and closes the panel. Tapping outside the chips or pressing Escape closes it without a change.
13. The full-screen button rotates the player 90° into landscape over 420ms. The video letterboxes to 16:9 on black. The icon swaps to "exit". Tap it or press Escape to return.
14. Below the video: Follow toggles to "Following" on a dark pill. "more" expands the description and shows the five chapters as rows. Tapping a chapter row seeks to it.
15. Tapping an Up next item restarts the player at 0:00 and scrolls to the top.

## Structure

```
390 × 844, page #0B0B0C, page scrolls
┌──────────────────────────────────────┐
│ 54 black band (sticky with player)   │
├──────────────────────────────────────┤
│ The crossing · Chapter 2    [CC][1x] │  top row, 44 buttons
│                                      │
│        (<10)   (  || )   (10>)       │  64 disc, 28 gap
│                                      │
│ 6:12 / 18:42                    [⤢]  │  row at bottom 34
│ ━━━━━━ ━━━●━── ──────── ─────── ──── │  scrubber, 44 tall hit area
├──────── 390 × 219, 16:9 ─────────────┤
│ Salt Flats After Dark: Three Nights  │  18px bold
│ on the Rann                          │
│ 412K views · 2 days ago              │
│ (TF) Tidewater Films      [ Follow ] │  40 avatar, 44 pill
│      1.2M followers                  │
│ ──────────────────────────────────── │
│ ┌──────────────────────────────────┐ │
│ │ Three nights crossing the white… │ │  2-line clamp
│ │ more                             │ │
│ └──────────────────────────────────┘ │
│ Up next                              │
│ [ 136 × 77 ] Forty Hours on the …    │
│ [ 136 × 77 ] The Glassblowers of …   │
│ [ 136 × 77 ] Night Train to the …    │
│ [ 136 × 77 ] Monsoon on the Tea …    │
│ 34 bottom padding                    │
└──────────────────────────────────────┘
```

- `.player` is `position: sticky; top: 0` with 54px top padding on black. It holds `.frame`, which is `aspect-ratio: 16/9; overflow: hidden`.
- Inside `.frame`, bottom to top: the scene `svg`, a full-size tap `button` ("Show or hide controls"), the 2px mini progress, the caption box, two ripple layers, the controls layer, the speed panel.
- The controls layer has `pointer-events: none`. Its buttons and the scrubber have `pointer-events: auto`. Hidden controls use `visibility: hidden` so they leave the tab order.
- The scrubber is a `div role="slider"` with `tabindex="0"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `aria-valuetext`.
- The speed panel is a `div role="dialog"` holding a `role="radiogroup"` of buttons with `role="radio"`.
- The info area is `main`: an `h1`, a meta `p`, the channel row, the description box with its `ul` of chapter buttons, an `h2` "Up next" and a `ul` of item buttons.

## Tokens

```css
:root {
  --bg: #0b0b0c;          /* page */
  --surface: #161618;     /* description box */
  --surface-2: #202023;   /* avatar, Following pill */
  --line: #26262a;        /* hairlines */
  --ink: #f5f5f4;         /* text, icons, Follow pill */
  --ink-2: #c4c4c7;       /* secondary text on video */
  --ink-3: #9a9a9f;       /* meta */
  --red: #e5322d;         /* progress, thumb, chapter times. The only colour. */
  --track: rgba(255,255,255,.24);
  --buffer: rgba(255,255,255,.4);
  --scrim: linear-gradient(rgba(0,0,0,.6), transparent 34%, transparent 58%, rgba(0,0,0,.72));

  --sans: "Hanken Grotesk", system-ui, sans-serif;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 22px;
  --r-thumb: 8px; --r-box: 12px; --r-pill: 22px;

  --std: cubic-bezier(.2, .7, .2, 1);
  --ios: cubic-bezier(.32, .72, 0, 1);
  --micro: 160ms;
  --layout: 320ms;
  --hide-after: 3000ms;
  --double-tap: 300ms;
}
```

Scene colours (inside the SVG only): sky `#05070d → #121a29 → #3a2b2b`, far dune `#1b1f28`, salt `#2b2f38 → #0c0e12`, near dune `#07080b`, moon `#e9e5da`, headlights `#ffd9a0`.

## Typography

| Role | Size | Weight | Line-height | Colour |
| --- | --- | --- | --- | --- |
| Video title | 18px | 700 | 1.3 | `--ink`, tracking -0.01em |
| Meta | 13px | 400 | 1.45 | `--ink-3` |
| Channel name | 15px | 600 | 1.45 | `--ink` |
| Followers | 12px | 400 | 1.45 | `--ink-3` |
| Follow pill | 14px | 700 | 44px box | black on `--ink` |
| Description | 14px | 400 | 1.45 | `--ink-2` |
| Chapter label on video | 13px | 600, suffix 500 | — | `--ink`, suffix `--ink-2` |
| Time on video | 13px | 600, total 500 | — | `--ink`, total `--ink-2` |
| Bubble time | 17px | 700 | — | `--ink` |
| Bubble chapter | 11px | 500 | — | `--ink-2` |
| Caption | 14px | 500 | 1.45 | `--ink` on rgba(0,0,0,.72) |
| Up next title | 14px | 600 | 1.3, 2-line clamp | `--ink` |
| Duration badge | 11px | 600 | 1.5 | `--ink` on rgba(0,0,0,.78) |
| Section head | 15px | 700 | — | `--ink` |

One family, Hanken Grotesk, 400 to 700. All times use `font-variant-numeric: tabular-nums`, so the clock does not jitter.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Controls | show / hide | opacity, visibility | 0 ↔ 1 | 200ms | `--std` |
| Mini progress | controls hide | opacity | 0 → 1 | 200ms | default |
| Scrub track | press | height | 3px → 5px | 160ms | `--std` |
| Scrub thumb | press | scale | 1 → 1.4 | 160ms | `--std` |
| Time bubble | press | opacity, translateY | 0, 4px → 1, 0 | 160ms | `--std` |
| Ripple disc | double tap | scale, opacity | 0.6, 1 → 1, 0 | 650ms | `--std` |
| Ripple label | double tap | opacity | 1 held to 60%, then 0 | 650ms | `--std` |
| Play disc | press | scale | 1 → 0.92 | 160ms | `--std` |
| Full screen | toggle | rotate, scale | 0°, 0.56 → 90°, 1 | 420ms | `--ios` |
| Follow pill | toggle | background, colour | white → `--surface-2` | 160ms | `--std` |
| Scene zoom | playing | scale | 1 → 1.06, alternate | 40s | `--std` |
| Far dune | playing | translateX | 0 → −120 units, loop | 70s | linear |
| Near dune | playing | translateX | 0 → −80 units, loop | 26s | linear |
| Headlights | playing | translateX | −10 → 170 units, loop | 48s | linear |
| Stars | playing | opacity | 1 → 0.55, alternate | 5s | ease-in-out |

The scene loops are linear because they stand in for camera movement, not UI. All scene loops pause with the video.

Reduced motion: every scene animation is removed, so the frame is a still. All transitions drop to 1ms. The ripple and the rotate still happen, at 1ms, so the user still gets the result.

## States

- Playing: pause glyph, label "Pause", scene moving, controls auto-hide.
- Paused: play glyph (a triangle), label "Play", scene frozen, controls stay.
- Ended (18:42): playback stops on the play glyph. Play restarts from 0:00.
- Controls hidden: `.frame.hide`. Only the 2px red line and any caption show.
- Dragging: `.frame.drag`. Thicker track, larger thumb, bubble visible, auto-hide paused.
- Speed panel open: auto-hide paused. The checked chip is white with black text.
- Captions on: CC icon fills white with black letters, `aria-pressed="true"`.
- Following: dark pill, white text, label "Following".
- Description open: no clamp, chapter rows visible, button reads "less".
- Focus-visible: 2px `--ink` outline, offset 2px. The tap layer's ring is inset (−3px) so it is not clipped by the frame.
- Hover is not used. This is a touch screen.

## Accessibility

- The tap layer is a real button labelled "Show or hide controls". Keyboard users reach the controls through it. Hidden controls are `visibility: hidden`, so Tab never lands on an invisible button.
- Focus inside the player shows the controls. The auto-hide does not fire while focus is on a control.
- Buttons: "Back 10 seconds", "Forward 10 seconds", "Pause"/"Play", "Captions" with `aria-pressed`, "Playback speed, 1x" with `aria-haspopup` and `aria-expanded`, "Full screen"/"Exit full screen".
- Scrubber: ArrowLeft and ArrowRight seek 10s, Home and End jump to the ends. `aria-valuetext` reads "6:12 of 18:42, The crossing".
- Speed panel: focus moves to the checked chip on open, and back to the speed button on close. Escape closes it. Escape also leaves full screen.
- Description "more" has `aria-expanded`. Follow has `aria-pressed`.
- Hit targets: every icon button 44 × 44, the play disc 64 × 64, speed chips 44px tall, scrubber hit area 44px tall, chapter rows and Up next rows at least 44px.
- Contrast: `#f5f5f4` on `#0b0b0c` is about 18:1. `#9a9a9f` on `#0b0b0c` is about 7:1. Text on the video always sits on the 60–72% black scrim.

## Responsive rules

- The frame is 390×844. The player band starts with max(54px, safe-area top) of black. The last Up next row has max(34px, safe-area bottom) under it.
- The video is always 100% wide at 16:9. At 360 it is 360 × 202. The controls still fit: 44 top row, 64 middle, 44 bottom row.
- At 360 the six speed chips are about 48px wide each. Do not wrap them to two rows. Drop 0.75x first if a product needs room.
- In full screen the player is `100vh × 100vw` rotated 90°. The frame width is `min(100vh, 100vw × 16/9)`, so a 390 × 844 phone shows a 693 × 390 video with 75px of black either side.
- In full screen, read the pointer's Y for the scrubber and the double-tap zones, because the frame is rotated.
- At tablet width, cap the page at 720px and keep the player at the top. Do not put the Up next list beside the video on a phone layout.
- No horizontal scroll at 360 to 390.

## Acceptance checklist

### Always

- [ ] The first frame is playing with controls up, and they hide after 3000ms of no input.
- [ ] Single tap toggles the controls. Double tap on an outer third seeks ±10s with an edge ripple, and repeats stack.
- [ ] The scrubber is split by chapter, shows a buffer fill, and shows a time and chapter bubble while dragging.
- [ ] The speed panel lists six speeds as radios and fits inside the video.
- [ ] Captions never cover the play button.
- [ ] Full screen rotates to landscape and letterboxes to 16:9.
- [ ] Hidden controls cannot be tabbed to. The scrubber is a slider with arrow keys.
- [ ] Every hit target is at least 44px.
- [ ] Reduced motion stills the scene and keeps every state.
- [ ] No status bar is drawn. 54px top and 34px bottom clearance.

### This demo

- [ ] Starts at 6:12 of 18:42 in "The crossing · Chapter 2".
- [ ] Chapters at 0:00, 3:10, 7:45, 12:20, 16:05.
- [ ] Red `#e5322d` is the only colour outside the scene.
- [ ] Title "Salt Flats After Dark: Three Nights on the Rann", channel "Tidewater Films", 1.2M followers.
- [ ] Four Up next items with CSS thumbnails and duration badges.
- [ ] Hanken Grotesk is the only family.

## Implementation notes

**1. Tell single from double taps by zone.** Middle taps act at once. Edge taps wait 300ms. A second edge tap on the same side inside 320ms cancels the wait and seeks.

```js
let pend = 0, lastTap = 0, lastSide = 0, streak = 0;
tap.addEventListener('click', e => {
  if (!e.detail) return toggle();                         // keyboard
  const r = frame.getBoundingClientRect();
  const x = fs ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
  const side = x < .35 ? -1 : x > .65 ? 1 : 0, now = performance.now();
  if (side && side === lastSide && now - lastTap < 320) {
    clearTimeout(pend); streak++; seek(side * 10); ripple(side, streak); lastTap = now; return;
  }
  streak = 0; lastSide = side; lastTap = now; clearTimeout(pend);
  side ? (pend = setTimeout(toggle, 300)) : toggle();
});
```

**2. Build the scrubber from chapter segments.** Each segment gets `flex-grow` equal to its length in seconds, and holds its own buffer and fill. The thumb is one element on top, placed by percent.

```js
const segs = CH.map(([start], i) => {
  const end = CH[i + 1]?.[0] ?? DUR, d = document.createElement('div');
  d.className = 'seg'; d.style.flexGrow = end - start; d.innerHTML = '<i></i><b></b>';
  track.append(d); return [start, end, d.children[0], d.children[1]];
});
function paint(t) {
  segs.forEach(([a, b, buf, fill]) => {
    const f = x => Math.min(1, Math.max(0, (x - a) / (b - a))) * 100 + '%';
    fill.style.width = f(t); buf.style.width = f(t + 90);
  });
  thumb.style.left = (t / DUR) * 100 + '%';
}
```

Use `gap: 3px` on the track. With `flex-basis: 0` the gaps do not skew the proportions much at this width.

**3. Rotate for full screen with CSS, not the Fullscreen API.** The sandbox blocks the API, and the rotation is the effect.

```css
body.fs .player {
  position: fixed; left: 50%; top: 50%; width: 100vh; height: 100vw; padding: 0;
  display: grid; place-items: center; z-index: 50;
  transform: translate(-50%, -50%) rotate(90deg);
  animation: rot 420ms var(--ios);
}
body.fs .frame { width: min(100vh, calc(100vw * 16 / 9)); }
@keyframes rot { from { transform: translate(-50%, -50%) rotate(0) scale(.56); } }
```

In a real app with a real video element, call the platform's full-screen API and lock orientation. Keep this CSS as the fallback.

Common mistakes:

- Running a `requestAnimationFrame` loop while paused. Stop the loop on pause and restart it on play.
- Hiding controls with `opacity` only. They stay focusable and clickable.
- A single tap that waits 300ms everywhere. The middle should feel instant.
- Centring captions with `left: 50%; transform: translateX(-50%)`. The box can only use half the width and wraps early. Use `left: 5%; right: 5%; width: fit-content; margin: 0 auto`.
- A speed menu as a tall list. It does not fit a 219px video.
- Using red for anything but progress and chapter times.
- Forgetting to swap the pointer axis in rotated full screen.

Rebuild order:

1. Page, sticky black band, 16:9 frame.
2. The SVG scene and its loops, paused by a class.
3. Time loop, play/pause, mini progress.
4. Controls layer with the 3000ms auto-hide.
5. Chaptered scrubber, drag, bubble, keys.
6. Tap zones and ripples.
7. Captions, speed panel, full screen.
8. Info area, description, Up next.
9. Reduced motion and focus rings.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
