<!-- Design Lounge Nº 192 · "Click-wheel player mockup" · designlounge.vercel.app -->

# Click-wheel player mockup

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A classic pocket music player, the fictional Aubade 160, drawn in CSS on an acid-lime poster stage with a giant "Spin to scroll." headline. The player has a chrome rim, a hold switch and a headphone jack on the top edge, a colour LCD with a pixel-font menu, and a working click wheel. Drag your finger around the wheel and the highlight moves one row per 22° of rotation; press the centre to go in; press MENU to go back. Choosing a song opens Now Playing, where the wheel becomes a volume control. Finishes are White and Black. The detail worth copying is the angular accumulator: rotation is measured as the signed change in `atan2` between pointer events, unwrapped across ±180°, so the wheel works in both directions, at any speed, from any starting point.

## Reference behaviour

1. First frame: White finish, main menu with "Music" highlighted, a split screen with the menu on the left 52% and album art on the right. A track is paused at 1:04.
2. Main menu items: Music, Playlists, Artists, Settings, Shuffle Songs, Now Playing. All but Now Playing and the toggles show a `›` chevron.
3. Pointer down on the wheel ring, then move around it: once total rotation passes 12°, the gesture becomes a drag (pointer captured, a soft shaded arc appears under the finger). Every 22° clockwise moves the highlight down one row; anticlockwise moves it up. It stops at the ends, no wrap.
4. The right-hand art preview changes with the highlighted item.
5. A press on the ring without dragging hits the button under it: MENU (top) back, ⏮ (left) previous, ⏭ (right) next, ⏯ (bottom) play/pause.
6. Centre button: in a list, enter the item. Music → Songs (7). Playlists → 4 playlists. Artists → 3 artists. Settings → Shuffle / Repeat / Backlight, where pressing the centre cycles the value shown on the right of the row. Shuffle Songs plays a random track. A song, playlist or artist starts playback and opens Now Playing.
7. Now Playing: art (27cqw square), "3 of 7", title, artist, album, a progress bar with elapsed and `-remaining`. The header icon shows play when playing, pause when paused. Time advances once per second; at the end the next track starts.
8. Rotating the wheel in Now Playing changes volume by 4 per step; the progress bar is replaced by a volume bar for 1400ms after the last step.
9. Centre in Now Playing toggles play/pause. MENU goes back up the stack, one level per press.
10. Lists show six rows and scroll the window to keep the highlight visible.
11. Finish toggle: White or Black recolours the front, wheel, centre button, glyphs and rim.
12. A polite live region announces the highlighted item, "Now playing Paper Engines by The Velours", "Paused", or the finish.

## Structure

```
1280 × 800, lime #d6f03b
┌──────────────────────────────────────────────────────────────────────┐
│  padding 40px / clamp(24px, 7vw, 110px)                               │
│  Spin                    148px bold                ┌─ hold ─── jack ┐ │
│  to scroll.              outline stroke 2px        │┌──────────────┐│ │
│  Aubade 160, a click-wheel player mockup…          ││▶  Aubade  ▭  ││ │
│  FINISH (● White | ● Black)                        ││Music  ›│ art ││ │
│  Drag around the wheel  ↑ ↓ scroll · Enter …       ││…       │     ││ │
│                                                    │└──────────────┘│ │
│                                                    │     MENU       │ │
│                                                    │ ⏮   ( ◯ )   ⏭ │ │
│                                                    │      ⏯         │ │
│                                                    └─ 330 × 550 ────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

- `main.page`: grid `1fr auto`, gap 40px. `section.poster` holds the `h1` (second line outlined), a sub paragraph, the finish group and a hint.
- `.rig`: width `min(330px, 100vw − 72px, (100vh − 110px) × .6)`, `container-type: inline-size`.
- `.shell` (aspect 0.6, radius 9cqw, 1cqw chrome rim gradient) > `.hold`, `.jack`, `.front`.
- `.front` > `.lcd` (84 × 64cqw, black surround) > `.disp` > `.hdr` + `#v-list` (`ul role="listbox"` + `.peek`) + `#v-np`.
- `.wheel` (72cqw circle, 12cqw from the bottom) > `.ring` (`role="slider"`, `tabindex=0`, covers the wheel), four `button.wb`, `button.center` (27cqw).

## Tokens

```css
:root {
  --stage: #d6f03b;     /* acid lime poster */
  --ink: #0f0f0e;  --ink-2: #2c3010;
  --hl: #ff4fa3;        /* selection bar, progress, wheel focus */
  --sans: "Familjen Grotesk", system-ui, sans-serif;
  --pix: "Pixelify Sans", ui-monospace, monospace;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --step: 22deg;        /* rotation per menu row */
  /* White finish */
  --front: #f6f6f3; --front-2: #e4e4df; --wheel: #fbfbf9; --wheel-2: #e9e9e4;
  --glyph: #a4a4a0; --rim-1: #f4f5f6; --rim-2: #9ea2a7;
}
[data-finish="black"] { --front: #1d1d1f; --front-2: #0d0d0e; --wheel: #2b2b2e; --wheel-2: #1f1f22;
  --glyph: #8a8a8f; --rim-1: #7a7d82; --rim-2: #2a2b2e; }
```

LCD palette: page `#f7f8f6`, text `#141414`, header gradient `#fdfdfd → #d9dbd8` with a `#a9aca8` rule, selection gradient `#ff7cbc → #ff4fa3` with white text. Album art is CSS only: teal with a yellow sun (`a0`), red and cream stripes (`a1`), black with a yellow disc (`a2`).

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Headline | Familjen Grotesk | clamp(64px, 10.5vw, 148px) | 700 | 0.86 | −0.045em | sentence; line 2 outlined 2px |
| Sub | Familjen Grotesk | 17px | 500 | 1.4 | 0 | sentence |
| Labels, segmented | Familjen Grotesk | 12–14px | 700 | 1 | 0.14em for labels | uppercase labels |
| LCD menu | Pixelify Sans | 5.1cqw | 400 | 1 | 0 | title case |
| LCD header | Pixelify Sans | 5.1cqw | 600 | 1 | 0 | — |
| LCD meta / times | Pixelify Sans | 4–4.4cqw | 400 | 1 | 0 | — |
| Wheel MENU | Familjen Grotesk | 4.4cqw | 700 | 1 | 0.06em | uppercase |

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Drag arc | dragging | opacity of conic shade | 0 → 1 | 200ms standard | instant |
| Arc position | pointer angle | conic `from` angle | follows finger | live | same |
| Highlight | each 22° | row selection | instant row change | — | same |
| Volume bar | wheel in Now Playing | display swap | shown for 1400ms | — | same |
| Centre press | :active | scale | 1 → .97 | 100ms | instant |
| Wheel glyph press | :active | colour | glyph → pink | 120ms | instant |
| Finish | toggle | colours | swap | 300ms | instant |

The menu itself does not animate. A real click-wheel highlight jumps; easing it would feel laggy against the finger.

## States

- Row highlighted: pink gradient bar, white text, `aria-selected="true"`.
- Toggle rows (Settings): value right-aligned at 75% opacity, no chevron.
- Now Playing row and song rows: no chevron.
- Ring focus-visible: 3px pink outline, 2px offset, following the circle.
- Buttons on the poster: 3px ink outline, 3px offset.
- Finish button pressed: ink pill, lime text; its colour dot gets a lime ring.
- Playing / paused: header glyph swaps; progress advances only while playing and the tab is visible.

## Accessibility

- The ring is a focusable `role="slider"` labelled "Click wheel. Up and down arrows scroll, Enter selects, Escape goes back". `aria-valuetext` is the highlighted item, or "Volume 62 percent" in Now Playing.
- Keys on the ring: ArrowDown/ArrowRight next, ArrowUp/ArrowLeft previous, Enter select, Escape or Backspace back, Space play/pause.
- MENU, previous, next, play/pause and centre are real buttons with labels, reachable by Tab.
- The menu `ul` is `role="listbox"` with `role="option"` rows and `aria-activedescendant`.
- A drag never fires the button under the finger: the click is swallowed in the capture phase when a drag occurred.
- Contrast: `#0f0f0e` on `#d6f03b` ≈ 15:1; `#2c3010` sub ≈ 11:1; LCD text `#141414` on `#f7f8f6` ≈ 17:1; white on `#ff4fa3` selection is ≈ 3:1 and is reinforced by the bar itself (it is a picture of a device UI).

## Responsive rules

- ≥1280: poster left, player right at 330px.
- 1024: same; headline scales with `10.5vw`.
- ≤820: one column, player first, then poster; headline 64px.
- At 375 the player is `100vw − 72px` (303px) and everything inside scales with `cqw`; the wheel stays ≥ 210px, comfortable for a thumb.
- Do not shrink the wheel below 200px; below that a circular drag becomes unreliable.

## Acceptance checklist

### Always

- [ ] The player is CSS only; menus and screens are live HTML.
- [ ] Rotation is measured from unwrapped `atan2` deltas and accumulated; one row per fixed angle step.
- [ ] A drag threshold (12°) separates a press from a turn; a drag never triggers a wheel button.
- [ ] Centre selects, MENU goes back through a stack, the four wheel zones are real buttons.
- [ ] In the playing screen the wheel controls volume with a temporary bar.
- [ ] Keyboard parity on the focused ring.
- [ ] `touch-action: none` on the wheel.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Name "Aubade 160"; finishes White and Black.
- [ ] Main menu: Music, Playlists, Artists, Settings, Shuffle Songs, Now Playing.
- [ ] Seven songs: Salt Lines, Harbour Bells, Paper Engines, Ribbon Road, Night Bus to Vale, Sodium Glow, Last Ferry (artists Marit Sand, The Velours, Odun).
- [ ] 22° per row, volume step 4, volume bar shown 1400ms.
- [ ] Headline "Spin / to scroll." with the second line outlined.

## Implementation notes

**Angular accumulator.** Unwrap each delta into −180…180 so crossing the 9 o'clock seam doesn't jump a full turn.

```js
const ang = e => { const r = wheel.getBoundingClientRect();
  return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180 / Math.PI; };
wheel.addEventListener('pointermove', e => {
  if (!active) return;
  const a = ang(e); let d = a - prevA;
  if (d > 180) d -= 360; if (d < -180) d += 360;
  prevA = a; acc += d; total += Math.abs(d);
  if (!dragging && total > 12) { dragging = true; wheel.setPointerCapture(e.pointerId); }
  if (dragging) {
    while (acc >= 22) { acc -= 22; scroll(1); }
    while (acc <= -22) { acc += 22; scroll(-1); }
  }
});
```

**Swallow the click after a drag.** Listen in the capture phase on the wheel and stop it before it reaches a button.

```js
wheel.addEventListener('click', e => {
  if (swallow) { e.stopPropagation(); e.preventDefault(); swallow = false; return; }
  const b = e.target.closest('[data-act]'); if (b) act(b.dataset.act);
}, true);
```

**Shade under the finger.** One conic gradient whose start follows the pointer angle (+90° because `atan2` zero is east and conic zero is north).

```css
.wheel::before { content: ""; position: absolute; inset: 0; border-radius: 50%;
  background: conic-gradient(from calc(var(--a, 0) * 1deg - 45deg), transparent, rgba(0,0,0,.1) 45deg, transparent 90deg 360deg);
  opacity: 0; transition: opacity .2s var(--ease); }
.wheel.drag::before { opacity: 1; }
```

Common mistakes:

- Mapping absolute angle to a list index. It jumps on touch-down and can't scroll long lists.
- Easing the highlight between rows.
- Using vertical drag distance instead of rotation; it breaks on the left half of the wheel.
- Making the centre button part of the drag surface.
- Real product names or the original wheel's exact graphics. The glyphs here are generic transport icons.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
