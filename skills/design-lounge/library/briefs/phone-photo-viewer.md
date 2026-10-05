<!-- Design Lounge Nº 488 · "Full-bleed photo viewer" · www.designlounge.live -->

# Full-bleed photo viewer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is an iOS photo viewer: full-bleed frames, a close control under the status-bar inset, 44px targets, and a caption on a bottom scrim. Do not draw a status bar. Pictures are CSS and inline SVG, not files.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The roll viewer of Dunlin, an invented coastal photo log. Four flat prints fill the 390 by 844 frame. The first is a dawn reed bed and it is the frame the piece opens on, unzoomed. A cream caption, a frame count, a Zoom control, and four page dots sit on a gradient scrim. Previous and Next sit on the sides. Close sits at the top right. Swipe or the buttons move between prints. Zoom scales the current print once, to 1.8, and Fit returns it. The detail worth copying is the print language: hard colour bands, a flat sun, no blur and no glow, with the type set in an italic serif over the dark scrim.

This is not a story timer. Auto-advancing stories are `mobile-story-viewer`. A scrolling feed is `phone-feed-posts`. This viewer waits for a swipe, a button, or a key.

## Structure

```
390 by 844, stage fixed, overflow clip
track, flex row, each slide flex 0 0 100 percent, overflow hidden
  art fills the slide (CSS ground plus one SVG)

close, 44px circle, top: max(54px, safe) + 8px, right 12px
prev, 44px circle, top 34 percent, left 10px
next, 44px circle, top 34 percent, right 10px

chrome, bottom gradient, pointer-events none except its controls
  padding 108px 20px max(34px, safe)
  DUNLIN                          1 of 4
  caption, italic 22px
  subline, 13px
  [ Zoom 44 ]          [ four 44px dots ]
```

- The stage is a region. The track holds four `section` slides. Only the track moves.
- The visible heading is the caption (`h1`). The word Dunlin in the chrome is a paragraph, not a second heading.
- The end screen is a `section`, hidden on the first frame. Its heading is an `h2`, "This roll is closed", so the caption remains the only `h1` in the viewer.
- Dots are a `role="group"` labelled "Frames". Each dot is a button labelled "Photo 1" through "Photo 4".
- Side buttons are labelled "Previous photo" and "Next photo". Close is "Close roll".
- Art SVGs are `aria-hidden`. The caption is the name of the print.
- A visually hidden `aria-live="polite"` paragraph reports page changes.

Picture 1, dawn, the opening frame. Ground:

`linear-gradient(#f0c5a0 0%, #e07a58 32%, #6e3d52 54%, #243044 70%, #152028 70%, #10181e 100%)`.

The repeated 70 percent stop is a hard horizon. SVG, viewBox `0 0 390 844`, `preserveAspectRatio="xMidYMid slice"`:

- Sun disc at (118, 392), radius 34, fill `#ffe4c0`, plus a ring radius 48, stroke `#f3d2ae`, width 1.5.
- Headland `#1a1418`: `M0 568C70 548 130 572 200 556c70-16 120 18 190 2v40H0Z`.
- Reeds, fill `#14110e`, wide triangles that frame the sun and leave the centre water open. Tips sit near y 460 to 620. Seed heads are 3 by 8 ellipses on the tallest tips.
- Two bird strokes, `#1a120e`, in the upper right sky.

Picture 2, the hut. Ground: `#c5c9cf` to 36 percent, `#6d7c82` from 36 to 56 percent, `#c9bba6` from 56 percent. SVG: a roof `#2a2420` from eaves y 420 to peak (200, 250), a chimney 16 by 88 at x 150 that meets the left slope, walls `#c44536` 124 by 172, door `#3a2c24`, two windows `#f3e6c4`, a sand ellipse `#b3a48c` under the walls, a four-post fence on the left, a small hull on the right, one bird stroke.

Picture 3, the feather. Ground `#e4d2b8`. One vane rotated -8 degrees around (200, 430), fill `#f7f1e6`, stroke `#2c211c`. Barbs are clipped to the vane so they do not stick out. A centre shaft runs the length.

Picture 4, stones. Ground `#12302c`. A bridge beam `#0c1918` at y 168, height 16, with two posts. Four stones as paired ellipses (body plus a lighter highlight): `#5e6a66` / `#9aa29c`, `#c4b8a4` / `#e6dccb`, `#3e4c4a` / `#6a7874`, `#8a8074` / `#c8bfb2`. Three ripple strokes `#1e4a44`.

Every art has a faint tooth: a 4px radial dot of `rgba(20,16,12,.16)` at 35 percent opacity. It is not a blur and not a glow.

## Motion

| Thing | Trigger | Property | From | To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Page | release past 48px, button, key, or dot | transform | current translate | next index times -100 percent | 280ms | standard ease | none |
| Drag | pointer move, not zoomed | transform | index translate | index translate plus dx | 0 | none | none |
| Snap back | release under 48px | transform | dragged | index translate | 280ms | standard ease | none |
| Zoom | Zoom or Fit | transform on the art | scale 1 | scale 1.8 | 240ms | standard ease | none |

The track gets the class that enables the transition only when animating. During a drag the class is off, so the print follows the finger. Percentage in the transform is the track's own width, which is the viewport, and each slide is that same width. `translate3d(calc(-100% + 0px))` therefore moves exactly one print.

Zoom uses `transform-origin: center center` and the slide has `overflow: hidden`, so the scaled print cannot widen the page.

## States

- Zoom resting: transparent dark fill `rgba(18,17,15,.35)`, cream border, label "Zoom", `aria-pressed="false"`.
- Zoom on: fill `#e6a322`, label `#1a1408`, border amber, label "Fit", `aria-pressed="true"`.
- Dot resting: 7px disc at 45 percent cream.
- Dot current: 18 by 7 amber pill, `aria-current="true"`. Only one dot is current.
- Close, Previous, Next: 44px circle, fill `#12110f`, cream icon, 1px cream border at 45 percent. Hover fill `#1c1a17`.
- End screen: hidden on the first frame. When open, the stage is `hidden` and the amber "Open roll" pill is shown.
- Focus-visible: 2px amber outline, offset 3px.
- Empty and error: this roll always has four prints. Closing is the empty state, with "This roll is closed" and "Open it again on the same frame." There is no failed-load state.

## Accessibility

- Close, Previous, Next, Zoom, the four dots, and Open roll are buttons. Each hit target is at least 44px. Open roll is at least 48px tall.
- ArrowLeft and ArrowRight change the print and wrap. Home and End jump to the ends. Escape closes. Keys are ignored on the end screen.
- The group of dots is labelled "Frames". `aria-current="true"` marks the visible print. Do not also set `aria-selected` unless you rebuild the dots as tabs.
- The live region announces "Photo N of 4" plus the caption after a change. It is visually hidden and starts empty.
- Contrast: `#f4efe6` and `#d9d0c3` sit on the dark scrim, which is at least 62 percent `#0c0a08` behind the type. `#1a1408` on `#e6a322` is the Fit label and the Open roll label. Do not put cream type on the bare dawn sky. The scrim is what makes the caption readable on the sand print as well as on the night water.
- Icons are 22px strokes, width 1.8, round caps, `currentColor`, `aria-hidden`. No emoji. No external image.
- `touch-action: none` on the stage so the browser does not steal the horizontal swipe. Buttons still receive clicks because a pointer down on a button does not start a drag.

## Responsive rules

- The frame is 390 by 844. Close sits 8px below the 54px top inset. The caption block sits above the 34px home inset. The prints themselves run edge to edge, under the insets. Controls do not.
- At 360 wide, the caption is 20px and the tools row may wrap. Dots stay 44px. The side buttons stay 44px and 10px from the edges.
- At a 200 percent text size, the caption and subline wrap inside the scrim. The scrim grows upward. Zoom stays at least 44px tall. Dots do not shrink below 44px. The track stays `overflow: clip` on the stage so a scaled print cannot create sideways overflow.
- At tablet width, do not letterbox this viewer inside a phone frame drawn by the piece. The Lounge supplies the device. If the viewport is wider than 500px, keep the prints full bleed and let the caption measure stay under 32em, aligned to the left inset.
- Do not draw a status bar, a notch, or a home glyph.

## Acceptance checklist

### Always

- [ ] Four prints, full bleed, paged by swipe and by buttons. The index wraps.
- [ ] Zoom is one step to 1.8 and back. A page change clears it. A swipe does not change page while zoomed.
- [ ] A caption, a close control, and a page indicator are visible on the first frame.
- [ ] The first frame is print 1, unzoomed.
- [ ] Controls are at least 44px. Close is below the 54px top inset. The caption is above the 34px bottom inset.
- [ ] Pictures are drawn, not loaded from files.
- [ ] Focus is a 2px ring. Arrow keys move. Escape closes.
- [ ] Reduced motion removes the slide and the zoom tween.
- [ ] The scaled print does not widen the document.

### This demo

- [ ] The brand is Dunlin. The first caption is "Reed bed at first light" with "Mile 4, just after six" and "1 of 4".
- [ ] Print 1 is the dawn gradient with a hard horizon at 70 percent, a sun at (118, 392), and reeds that leave the centre open.
- [ ] The other captions are the red hut, the feather, and the stones under the footbridge.
- [ ] Zoom reads "Zoom", then "Fit" on amber `#e6a322`.
- [ ] Close shows "This roll is closed" and "Open roll" returns to the same index.
- [ ] Swipe threshold is 48px. Slide duration is 280ms. Zoom duration is 240ms.
- [ ] Fonts are Libre Baskerville and Figtree. The caption is italic Baskerville.
- [ ] Page background is `#12110f`. Type is `#f4efe6`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: index 0, transform none, zoom off. The heading reads "Reed bed at first light". The subline reads "Mile 4, just after six". The count reads "1 of 4". Zoom reads "Zoom" with `aria-pressed="false"`. Dot 1 has `aria-current="true"`. The end screen is hidden. The live region is empty.
2. Next, the right arrow, or a leftward swipe of at least 48px moves to the next print. Previous, the left arrow, or a rightward swipe of at least 48px moves back. The index wraps. Photo 1 follows photo 4.
3. A drag shorter than 48px snaps back to the current print. Dragging updates the track without a transition. Releasing with a page change animates for 280ms.
4. While zoomed, swipes do not change the page. The side buttons, the dots, and the arrow keys still change the page, and they clear the zoom first.
5. Zoom toggles scale 1.8 on the current print only, from the centre. The button label becomes "Fit" and `aria-pressed` becomes `"true"`. Fit, or any page change, returns the scale to 1. The chrome does not scale.
6. A dot jumps straight to that print and clears zoom. The current dot is an 18 by 7 amber pill. The others are 7px cream dots at 45 percent opacity.
7. Close hides the stage, shows "This roll is closed", and focuses "Open roll". Zoom is cleared. The index is kept.
8. Open roll hides the end screen, shows the same print, and focuses Close.
9. Home jumps to photo 1. End jumps to photo 4. Escape closes the roll. These keys do nothing while the end screen is up.
10. Each page change writes the live region: "Photo 2 of 4. The red hut past the sluice." The first frame does not announce.
11. The four captions, in order: "Reed bed at first light" / "Mile 4, just after six"; "The red hut past the sluice" / "Roll 12, second frame"; "A feather on wet sand" / "Found on the tide line"; "Stones under the footbridge" / "The bridge at mile 6".

## Tokens

```css
:root {
  --bg: #12110f;          /* page, discs, end screen */
  --ink: #f4efe6;         /* caption, icons, Zoom label */
  --muted: #d9d0c3;       /* subline and count */
  --amber: #e6a322;       /* current dot, Fit fill, focus */
  --amber-ink: #1a1408;   /* label on amber */
  --serif: "Libre Baskerville", Georgia, serif;
  --sans: "Figtree", system-ui, sans-serif;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --move: 280ms;          /* page slide */
  --zoom: 240ms;          /* scale */
}
```

Scrim: `linear-gradient(to top, rgba(12,10,8,.9) 0%, rgba(12,10,8,.62) 42%, transparent 100%)`. Disc border: `1px solid rgba(244,239,230,.45)`. Resting dot: `rgba(244,239,230,.45)`.

## Typography

| Role | Family | Size | Weight | Line height | Tracking | Colour |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Figtree | 11px | 700 | 1 | 0.18em, uppercase | ink |
| Count | Figtree | 13px | 600 | 1 | 0 | muted |
| Caption | Libre Baskerville | 22px | 400 italic | 1.3 | -0.01em | ink |
| Subline | Figtree | 13px | 500 | 1.4 | 0 | muted |
| Zoom, Fit | Figtree | 15px | 700 | 1 | 0 | ink, or amber-ink when pressed |
| End title | Libre Baskerville | 28px | 400 italic | 1.25 | 0 | ink |
| End sentence | Figtree | 15px | 400 | 1.4 | 0 | muted |
| Open roll | Figtree | 16px | 700 | 1 | 0 | amber-ink on amber |

The caption is the only italic serif on the viewer. Counts and controls stay in Figtree. At 360 wide the caption may drop to 20px so it still fits beside the count.

## Implementation notes

Keep each slide exactly one viewport wide, and move the track by that same width. A 400 percent track whose percentage transform is based on the track's border box will skip or stall.

```css
.stage { position: fixed; inset: 0; overflow: clip; }
.track { display: flex; width: 100%; height: 100%; }
.slide { flex: 0 0 100%; height: 100%; overflow: hidden; }
.art.zoom { transform: scale(1.8); }
```

```js
function apply(extra, animate) {
  if (reduce) animate = false;
  track.classList.toggle('anim', !!animate);
  track.style.transform =
    'translate3d(calc(' + (-index * 100) + '% + ' + (extra || 0) + 'px),0,0)';
}
```

Ignore the drag when the pointer starts on a button, and ignore a page change when zoomed:

```js
if (e.target.closest('button')) return;
if (!zoomed && dx <= -48) go(index + 1);
else if (!zoomed && dx >= 48) go(index - 1);
else apply(0, true);
```

Common mistakes:

- A file input or remote image. These four prints are drawn.
- A pinch-zoom or a slider. There is one step, 1.8, then back.
- Letting the zoomed art expand the scroll width. Clip the slide.
- A 400 percent track with `translateX(-100%)` calculated on that wide box.
- Caption type sitting on the bare sky of print 1. The scrim is required.
- A glassy blur behind the buttons. The discs are flat `#12110f`.
- Auto-advancing the roll. It moves only on input.
- Drawing the status bar across the dawn.
- Announcing the first print on load. The live region starts empty.

Where it sits:

1. It is the full-screen viewer of a phone photo log. The roll is already chosen.
2. Close does not delete the roll. Open roll returns to the same index.
3. Map `--amber` to the locked accent and `--bg` to the locked ink if a kit is on. Keep the prints as flat colour, not photographs.
4. Two families only. The caption is the serif. Everything else is the sans.
5. Print 1 is the frame to judge. The sun stays clear of the reeds. The horizon is a hard stop, not a blur.
6. The end screen sentence is "Open it again on the same frame." The button is "Open roll".
7. Dots are 44px hit targets even though the mark inside is 7px, or 18px when current.
8. Side buttons sit at 34 percent from the top so they clear both the close control and the scrim.
9. Pointer capture stays on the stage for the drag, and `pointercancel` snaps back to the current index.
10. The live sentence is "Photo N of 4. " plus the caption, with a period. It is not announced on the first frame.
11. Open roll focuses Close. Close focuses Open roll. Do not leave focus on a `hidden` control.
12. Grain is a 4px dot grid at 35 percent opacity on the art only. It must not cover the caption, because the caption sits in the chrome above the art.
13. Print order is fixed: dawn, hut, feather, stones. Do not shuffle them. The opening index is always 0.
14. The count string is "1 of 4", "2 of 4", "3 of 4", "4 of 4", in Figtree 13px, weight 600, colour `#d9d0c3`.
15. Zoom scale is exactly 1.8, not a second step and not a continuous pinch. Fit is the only way back, besides changing the page.
16. The close disc, the side discs, and the Zoom pill all keep a 2px amber focus ring at a 3px offset.
17. Do not put a wordmark in the top left. Dunlin lives in the scrim, at 11px, tracking 0.18em, uppercase.
18. The end screen is centred, with the same top and bottom insets, on `#12110f`. It is not the first frame.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
