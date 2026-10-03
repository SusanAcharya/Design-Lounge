<!-- Design Lounge Nº 326 · "Photo post with carousel" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Photo post with carousel

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A single post from a square-photo feed, for an invented network called Weft, in a dark theme. A ceramicist's post holds four slides: a blue glazed bowl, an open kiln, a grid of glaze test tiles, and clay on the wheel. Every "photo" is painted with CSS gradients, so the piece ships with no images. It reads at a glance as the familiar format: story-ring avatar, handle with Follow, square media with a 1/4 pill, heart-comment-send on the left, dots in the middle, save on the right, then likes, caption with "more", and an add-comment row. The detail worth copying is the double-tap: a big white heart pops at the exact point you tapped, while a tap-drag swipes slides, and the two never confuse each other.

## Reference behaviour

1. First frame: slide 1 (the bowl), counter "1/4", first dot coral, Next arrow present but hidden until hover, Prev absent. Likes "Liked by tiago.m and 2,318 others".
2. Hover the photo: round 32px Prev/Next arrows fade in at the left and right edges. Prev is removed on slide 1, Next on slide 4.
3. Drag the photo horizontally: the track follows the pointer 1:1 with no transition. Past the first or last slide it follows at 30% (rubber band). Release: if the drag passed 20% of the width or moved faster than 0.5px/ms, go to the neighbouring slide; else snap back. Snap is 420ms expo-out.
4. Arrow keys on the focused photo move slides. The counter and dots follow; the active dot is coral and 1.2× size.
5. Double-tap the photo (two taps within 300ms, each moving less than 8px): a 96px white heart pops at the tap point, scales 0.2 → 1.15 → 0.95 → 1, holds, then floats up 30px and fades over 900ms. If the post was not liked, the like button fills red with a bump and the count ticks to 2,319. Double-tapping an already-liked post replays the heart but does not unlike.
6. Press L on the focused photo: same as a double-tap at the centre.
7. Click the heart button: toggles like and unlike. No big heart.
8. Click Save: bookmark fills, bumps, toast "Saved to Glazes". Again: "Removed from Glazes".
9. Click Follow: text becomes "Following" in muted ink.
10. Click "more": the rest of the caption appears inline with two hashtags and focus moves to it. The ellipsis and button are removed.
11. Type in "Add a comment…": Post enables. Submit: the comment appears under the caption as "you" with a rise-in, and "View all 86 comments" becomes 87.
12. Click the comment icon: focuses the comment field.

## Structure

```
stage 1280×800, dark radial, card centred
┌────────── card 440px, radius 20, 1px line, overflow hidden ──────────┐
│ (38 ring) noor.kiln · Follow                                  [ ⋯ ] │ 62
│           Kiln Lane Studio, Porto                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                           [1/4]      │
│ [‹]          slide: CSS-painted photo, 1:1 (440×440)          [›]    │
│                     ♥ heart pop at tap point                         │
├──────────────────────────────────────────────────────────────────────┤
│ [like][cmt][send]       • • • •                            [save]  │ 46
│ Liked by tiago.m and 2,318 others                                    │
│ noor.kiln Third firing of the tidepool series… more                  │
│ (your comments)                                                      │
│ View all 86 comments                                                 │
│ 2 HOURS AGO                                                          │
├──────────────────────────────────────────────────────────────────────┤
│ Add a comment…                                               Post    │ 52
└──────────────────────────────────────────────────────────────────────┘
```

- Card: `article` labelled by the handle.
- Photo: `div role="region" aria-roledescription="carousel" tabindex="0"` with a label that names the keys. Each slide is `role="group" aria-roledescription="slide"` with "n of 4: description". Off-screen slides get `aria-hidden="true"`.
- Arrows: buttons with "Previous photo" / "Next photo", hidden with the `hidden` attribute at the ends.
- Action bar: four icon buttons and a decorative dots strip.
- Caption: `p` with the handle in bold; "more" is a button with `aria-expanded` and `aria-controls`.
- Comment row: `form` with a visually hidden label, an input, and a submit button.
- Toast: `role="status"` live region.

## Tokens

```css
:root {
  --stage: #0b0b0c;        /* page; behind a radial of #17151a at 50% 40% */
  --card: #141416;
  --raise: #1d1d20;        /* comment row on focus */
  --line: #28282c;
  --ink: #f2efe9;          /* warm white, never #fff for text */
  --ink-2: #b4b0a9;
  --ink-3: #8d8983;        /* meta, placeholders, idle dots */
  --accent: #ff6a4d;       /* Follow, active dot, Post, focus */
  --accent-2: #ffb547;     /* second stop of the story ring */
  --heart: #ff4f5e;        /* liked heart */
  --sans: "Manrope", system-ui, sans-serif;
  --serif: "Instrument Serif", Georgia, serif;   /* only inside painted photos */
  --r: 20px;
  --w: 440px;
  --t-micro: 160ms;
  --t-slide: 420ms;
  --t-heart: 900ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --ease-pop: cubic-bezier(.34,1.56,.64,1);
}
```

Card shadow `0 30px 60px -30px rgba(0,0,0,.8)`. Story ring: `conic-gradient(from 200deg, --accent, --accent-2, --accent)`, 2px padding, then a 2px card-coloured border on the avatar.

## Typography

| Role | Family | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| Handle | Manrope | 14px | 700 | header and caption |
| Follow | Manrope | 14px | 700 | coral; "Following" muted |
| Location | Manrope | 12px | 400 | `--ink-2` |
| Likes line | Manrope | 14px | 700 | |
| Caption | Manrope | 14px/1.45 | 400 | |
| "more", View all | Manrope | 14px | 600 / 500 | `--ink-3` |
| Age | Manrope | 11px | 400 | uppercase, 0.06em |
| Counter pill | Manrope | 12px | 600 | 0.02em, on 62% black |
| Photo captions | Instrument Serif italic | 20–22px | 400 | "Tidepool, cone 10", "Throwing day" |

The serif lives inside the pictures, as if hand-labelled. The UI chrome stays in Manrope.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Slide | arrow, key, release | track translateX | −i×100% → −j×100% | 420ms `--ease-out` | 1ms |
| Drag follow | pointermove | translateX | 1:1, 0.3 past ends | none | same |
| Arrows | hover / focus | opacity | 0 → 1 | 160ms | instant |
| Dot | slide change | colour, scale | grey 0.55 → coral 1.2 | 240ms `--ease` | instant |
| Heart pop | double-tap, L | scale, rotate, opacity, y | 0.2/−12° → 1.15/4° → 0.95 → 1 → 1.1/−30px/0 | 900ms `--ease-out` | not shown |
| Like / save icon | toggle on | scale | 0.6 → 1.25 → 1 | 420ms `--ease-pop` | instant |
| Likes number | change | translateY, opacity | 60%/0 → 0/1 | 320ms `--ease-out` | instant |
| New comment | submit | same as likes number | | 320ms | instant |
| Toast | message | opacity, y | 0/14px → 1/0 | 280ms, hides at 1.8s | instant |

## States

- Arrow hidden: absent from layout at the ends (`hidden`), so it is also out of the tab order.
- Like on: red stroke and fill, `aria-pressed="true"`, label "Unlike".
- Save on: filled bookmark, `aria-pressed="true"`, label "Remove from saved".
- Follow on: "Following", `aria-pressed="true"`, `--ink-2`.
- Post disabled: 40% opacity until the field has non-space text.
- Comment row focus-within: background `--raise`.
- Photo focus-visible: coral outline inset by 3px so it shows inside the square.
- Dragging: cursor `grabbing`, track transition off.

## Accessibility

- The carousel is one tab stop. Left/Right move slides; L likes. The region label says so.
- The visible "1/4" pill is `aria-hidden`; the slide group label carries "n of 4" plus a description of the painting.
- Double-tap is never the only way: the heart button and the L key do the same.
- Icon buttons: Like/Unlike, Comment, Share, Save/Remove from saved, More options, Previous photo, Next photo.
- The comment input has a real `label` (visually hidden).
- Contrast: `#f2efe9` on `#141416` is 15:1; `#8d8983` is 5.3:1; coral on card is 6.5:1.
- Icon buttons are 40×40; arrows are 32px visible inside a 440px image, and the image itself is the larger swipe target.

## Responsive rules

- ≥1280 through 768: card fixed at 440px, centred. The painted photos are in percentages, so they scale with the square.
- <640: card is `min(440px, 100%)` with 16px page padding. At 375 the square is 341px; everything still fits on one line except the caption, which wraps.
- If the caption is expanded and the card outgrows the viewport, the page scrolls vertically; it never scrolls sideways.
- Touch: `touch-action: pan-y` on the photo so vertical scroll still works while horizontal drag swipes.

## Acceptance checklist

### Always

- [ ] Header: ring avatar, handle, Follow, location, more button.
- [ ] Media is 1:1 with a counter pill, edge arrows on hover, and a dot per slide below.
- [ ] Drag follows the pointer, rubber-bands at the ends, and snaps by distance (20%) or speed (0.5px/ms).
- [ ] Double-tap within 300ms pops a heart at the tap point and likes; it never unlikes.
- [ ] A drag longer than 8px never counts as a tap.
- [ ] Heart and Save are `aria-pressed` toggles with a bump animation.
- [ ] Caption truncates with "more", which expands inline and moves focus.
- [ ] Post is disabled until there is text; submitting adds the comment and bumps the count.
- [ ] Reduced motion: no heart pop, slides change instantly.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Handle noor.kiln at Kiln Lane Studio, Porto; four slides: bowl, kiln, tiles, wheel.
- [ ] Likes start at 2,318 and become 2,319 after a double-tap.
- [ ] Save toast reads "Saved to Glazes".
- [ ] Comments read "View all 86 comments" and become 87 after posting.
- [ ] Slide 3 caption reads "Tidepool, cone 10" in italic serif.

## Implementation notes

**Tap, double-tap and drag on one surface.** Track the pointer from down to up. If it moved more than 8px it was a drag; otherwise compare with the previous tap time.

```js
frame.addEventListener('pointerup', e => {
  track.classList.remove('drag');
  const w = frame.clientWidth, v = Math.abs(dx) / (performance.now() - t0);
  if (Math.abs(dx) > 8) {               // a swipe, never a tap
    go(Math.abs(dx) > w * .2 || v > .5 ? i - Math.sign(dx) : i);
    return;
  }
  go(i);
  const now = performance.now(), r = frame.getBoundingClientRect();
  if (now - lastTap < 300) { like(true, e.clientX - r.left, e.clientY - r.top); lastTap = 0; }
  else lastTap = now;
});
```

**Rubber band.** During the drag, scale the offset when pulling past an end.

```js
const edge = (i === 0 && dx > 0) || (i === N - 1 && dx < 0) ? .3 : 1;
track.style.transform = `translateX(calc(${-i * 100}% + ${dx * edge}px))`;
```

**Painting a photo with CSS.** The bowl is one div: a bottom-rounded half ellipse with a radial glaze, plus `::before` for the rim and `::after` for a soft highlight.

```css
.bowl { position:absolute; left:20%; top:46%; width:60%; height:32%;
  border-radius: 0 0 50% 50% / 0 0 100% 100%;
  background: radial-gradient(120% 90% at 30% 10%, #7fc3d2, #1f6f8b 40%, #0f3f57 70%, #0a2533); }
.bowl::before { content:""; position:absolute; left:0; right:0; top:-14%; height:28%; border-radius:50%;
  background: radial-gradient(closest-side, #0c3346 60%, #1c5f78 80%, #c9dfe0 96%, transparent); }
```

**Common mistakes.**

- Using `dblclick`. It fires after two clicks that may include a drag, and is unreliable on touch.
- Letting a double-tap toggle the like off. It only ever likes.
- Centring the big heart instead of placing it at the tap point.
- Leaving off-screen slides readable by screen readers.
- Copying the real app's gradient logo or the camera glyph. Weft is coral and amber.
- Pure `#fff` body text on the dark card; use the warm `--ink`.

**Rebuild order.**

1. Card shell, header with ring avatar.
2. Square frame, track, four painted slides.
3. Arrows, counter, dots, keyboard.
4. Pointer drag with rubber band and snap.
5. Double-tap heart and like state.
6. Save, Follow, toast.
7. Caption "more", comment form.
8. Reduced motion and 375px check.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
