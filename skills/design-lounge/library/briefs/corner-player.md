<!-- Design Lounge Nº 205 · "Corner player" · www.designlounge.live -->

# Corner player

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A night-shift page with a small player fixed in the corner. Open grows it to the middle of the frame. Play starts an 8 second bar. There is no media file. The bar is the progress. This is not a music screen. Now playing is `ios-now-playing`. A full player is `m3-music-player-expressive`. This is the corner clip.

## Structure

```
page title
fixed player, corner
[ Play  bar  Open ]
```

- The player is position fixed.
- Open state uses right 50%, bottom 50%, translate 50% 50%, width 640, height 360.
- Buttons are 36px.
- The track is 4px, mark #d7b15e.
- The page title is 40px.

## Motion

- Frame | Open | 220×124 corner | 640×360 center | 360ms cubic-bezier(0.16,1,0.3,1). Bar | Play | width 0 | width 100% | 8s linear. Reduced motion snaps and skips the bar.

## States

- Corner, paused: Play and Open.
- Playing: button reads Pause, bar runs.
- Open: button reads Close, frame is large.
- Both can be true together.

## Accessibility

- Play is aria-pressed.
- Open is aria-expanded.
- The bar is aria-hidden. There is no real duration to expose.
- Button names change with state.
- Focus ring is 2px #1f4d3a, offset 3px.
- Do not autoplay on load.

## Responsive rules

- At 1280 the open size is 640 by 360.
- Below 700 the open size is calc(100% - 32px) and height auto, min 220px.
- The corner size stays 220 by 124 until the viewport is under 360, then it is calc(100% - 24px).

## Acceptance checklist

### Always

- [ ] Starts in the corner, paused.
- [ ] Open and Close are the same button.
- [ ] Play does not load a file.
- [ ] The bar is the only progress.
- [ ] No autoplay.

### This demo

- [ ] The clip title is Gate 4 · 0:42.
- [ ] The page title is Night shift.
- [ ] Open size is 640 by 360.
- [ ] The bar is #d7b15e on #3a342c.
- [ ] Type is IBM Plex Sans.

## Measurements to keep

- Corner 220×124, inset 28px. Open 640×360.
- Grow 360ms. Bar 8s, height 4px.
- Buttons 36px. Page title 40px.
- Player radius 8px.
- Mark #d7b15e.

## Wrong turns

- Do not autoplay.
- Do not fetch media.
- Do not hide the corner behind a modal scrim.
- Do not loop the bar in this demo.
- Do not use a native video element with a remote src.
- Do not start expanded.

## Fit with the rest of the library

- A music screen is `ios-now-playing`.
- An expressive player is `m3-music-player-expressive`.
- This is the corner clip.
- Do not add a playlist.
- Type is IBM Plex Sans.
- The page ground is #f4f1ea.

## Keyboard

- Enter on Play toggles play.
- Enter on Open toggles size.
- aria-pressed and aria-expanded follow.
- The bar is not a slider.
- Do not use a positive tabindex.
- No autoplay.
- Reduced motion skips the bar.
- Focus offset is 3px.
- The title is text.
- Two buttons only.
- Starts paused and small.
- Type is IBM Plex Sans.
- No remote file.
- Escape does not close. Close does.
- The grow is 360ms.
- There is no volume.

## Rebuild order

1. Build step: The player starts 220 by 124, 28px from the right and bottom.
2. Build step: The title reads Gate 4 · 0:42.
3. Build step: Play sets aria-pressed and the bar animates to full over 8 seconds. Pause stops the attribute.
4. Build step: Open sets aria-expanded and grows the player to 640 by 360, centered.
5. Build step: Close returns it to the corner.
6. Build step: The grow is 360ms.
7. Build step: Reduced motion snaps the size and does not run the bar.

- Keep this measurement while rebuilding: Corner 220×124, inset 28px. Open 640×360.
- Keep this measurement while rebuilding: Grow 360ms. Bar 8s, height 4px.
- Keep this measurement while rebuilding: Buttons 36px. Page title 40px.
- Keep this measurement while rebuilding: Player radius 8px, unless the family sets one.
- Keep this measurement while rebuilding: Mark #d7b15e.

- While rebuilding, remember: Do not autoplay.
- While rebuilding, remember: Do not fetch media.
- While rebuilding, remember: Do not hide the corner behind a modal scrim.
- While rebuilding, remember: Do not loop the bar in this demo.
- While rebuilding, remember: Do not use a native video element with a remote src.
- While rebuilding, remember: Do not start expanded.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The player starts 220 by 124, 28px from the right and bottom.
2. The title reads Gate 4 · 0:42.
3. Play sets aria-pressed and the bar animates to full over 8 seconds. Pause stops the attribute.
4. Open sets aria-expanded and grows the player to 640 by 360, centered.
5. Close returns it to the corner.
6. The grow is 360ms.
7. Reduced motion snaps the size and does not run the bar.

## Tokens

```css
:root { --bg:#f4f1ea; --player:#1a1814; --ink:#f4f1ea; --mark:#d7b15e; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Page title | IBM Plex Sans | 40px | 600 |
| Clip title | IBM Plex Sans | 14px | 400 |
| Button | IBM Plex Sans | 13px | 500 |

## Implementation notes

Toggle data-open and data-play. The bar animation is gated on data-play.

```css
.player[data-play="true"] .track i { animation: go 8s linear; }
```

Do not point the player at a network video.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
