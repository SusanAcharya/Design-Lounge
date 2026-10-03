---
title: "Phone photo picker"
summary: "A dark photo picker sheet: album menu, camera tile, 3-column grid, numbered multi-select up to 4, a toast at the limit, and a tray with removable thumbnails."
platform: mobile-app
type: component
category: pickers
tags: [photos, picker, sheet, multi-select, media]
styles: [dark, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#0A0A0A", "#161616", "#262626", "#F5F5F5", "#FFE500"]
fonts: ["Inter", "IBM Plex Mono"]
related: [ios-bottom-sheet-detents, toast-stack, gallery-contact-sheet, pwa-install-sheet, ios-grouped-settings]
---

# Phone photo picker

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is the dark media family: flat dark greys, white type, one electric yellow, 6px radii.

## What it is

A photo picker sheet for a fictional film photography app called Silverline. It lets the user add up to four photos to a new roll post. The sheet rises over a dimmed composer card. A header holds Cancel, an album menu and a `3/4` counter. A 3-column grid starts with a camera tile. Tapping photos marks them with numbered yellow badges in the order picked. A tray at the bottom shows the picks as thumbnails you can remove, and an "Add 3" button.

The detail worth copying is the order badge. The number is the order the photos will post in. Removing photo 1 renumbers the rest at once, in the grid and in the tray.

This piece follows the iOS 26 photo picker shape, without Liquid Glass. It uses a sheet with a grabber, iOS sheet easing and system-like type, on flat dark surfaces.

## Reference behaviour

1. The first frame shows the sheet already up, with three photos picked: 1, 2 and 3. The counter reads `3/4`. The button reads "Add 3".
2. Behind the sheet, at the top, a dimmed composer card reads "New roll · Silverline" at 94% scale and 60% opacity.
3. The sheet rises 40px and fades in over 420ms on load.
4. The header shows "Cancel" on the left, "Recents" with a chevron in the centre, and the counter on the right. The picked count is yellow.
5. The grid has 3 columns, 3px gaps and 3px side padding. Cell one is the camera tile. Then twenty photos follow.
6. Photos are drawn with CSS gradients only: hills at dusk, a sea horizon, a portrait, a cup on a table, a street at night, a leaf close-up. Two tiles are videos with a mono duration in the bottom left, such as `0:22`.
7. Every photo shows a 26px ring in its top right. The ring is white at 90%, on a 28% black fill.
8. Tapping an unpicked photo adds it to the end of the order. Its badge fills yellow and shows the number in black mono. The image shrinks to 88% inside the cell, and a 2px yellow inset frame appears.
9. Tapping a picked photo removes it. Every later number drops by one.
10. With four picked, tapping a fifth photo does not pick it. The tile shakes 4px for 300ms. A light toast rises above the tray: "You can add up to 4 photos". It hides after 2.4s.
11. The tray lists the picks as 52px thumbnails with a small yellow order number in the bottom left. Each has a white 20px remove dot on the top right corner, inside a 44px hit area.
12. Removing from the tray updates the grid. Focus moves to the next remove button, or the previous one, or the Add button if none are left.
13. With nothing picked, the tray reads "Pick up to 4 for this roll". The button reads "Add" and is disabled in grey.
14. Tapping the album name opens a menu below it: Recents 248, Favourites 31, Pokhara, March 64, Film scans 112. The current album has a yellow tick. The chevron turns 180deg.
15. Picking an album swaps the grid and scrolls it to the top. Picks from other albums stay picked and stay in the tray.
16. The camera tile shows a toast: "Camera opens full screen here". It never counts as a pick.
17. "Add 3" shows the toast "3 photos added to your roll". "Cancel" clears the picks in this demo. In a product, Cancel closes the sheet.

## Structure

```
390 x 844, backdrop #0a0a0a
54px top clearance
+--------------------------------------------+
|  [ New roll · Silverline ] dimmed, 94%     |  composer card behind
+--------------------------------------------+  sheet top = 54 + 14px
| ---- grabber 36x5 ----                     |
| Cancel        Recents v            3/4     |  52px header
+--------------------------------------------+
| [ camera ] [ photo ] [ photo (1) ]         |  3 cols, ~126px, 3px gap
| [ photo  ] [ photo ] [ photo (3) ]         |
| [ photo (2)][ 0:22 ] [ photo ]             |
| [ ...                          ]  scrolls  |
+--------------------------------------------+
| [t1][t2][t3]                  [ Add 3 ]    |  tray, 1px top rule
| 34px home clearance                        |  thumbs 52px, button 48px
+--------------------------------------------+
```

- The sheet is a `section role="dialog" aria-modal="true"` labelled "Add photos to your roll".
- The header is a `header` with a 3-column grid: `1fr auto 1fr`.
- The album control is a `button aria-haspopup="menu" aria-expanded aria-controls`.
- The menu is a `div role="menu"` with `button role="menuitemradio"` items and `aria-checked`.
- The grid is a `div role="group" aria-label="Photos"`. Each photo is a `button` with `aria-pressed`.
- The camera tile is a plain `button`. It has no `aria-pressed`.
- The tray is a `footer` with a `ul aria-label="Selected photos"` and the Add `button`.
- The toast is one `div role="status" aria-live="polite"` outside the sheet.

## Tokens

```css
:root {
  --backdrop: #0a0a0a;    /* behind the sheet */
  --sheet: #161616;       /* sheet surface */
  --raised: #202020;      /* camera tile, menu, disabled button */
  --tile: #262626;        /* cell behind a shrunken photo */
  --line: #2c2c2c;        /* sheet top rule, tray rule */
  --text: #f5f5f5;
  --text-2: #b3b3b3;      /* Cancel */
  --text-3: #8c8c8c;      /* counter total, empty tray, menu counts */
  --accent: #ffe500;      /* electric yellow: badges, count, Add */
  --on-accent: #111111;
  --sans: "Inter", system-ui, -apple-system, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --r: 6px;
  --gap: 3px;
  --cell-badge: 26px;
  --thumb: 52px;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --sheet-ease: cubic-bezier(0.32, 0.72, 0, 1);
  --fast: 160ms;
  --mid: 280ms;
}
```

There is one accent. Yellow marks only what the user picked and the button that commits it. Do not use it for links, the album name or focus on dark grey cells, except the focus ring itself.

## Typography

| Role | Family | Size | Weight | Line-height | Colour |
| --- | --- | --- | --- | --- | --- |
| Album name | Inter | 17px | 600 | 1 | `--text` |
| Cancel | Inter | 16px | 400 | 1 | `--text-2` |
| Counter | IBM Plex Mono | 13px | 600 | 1 | `--text-3`, picked count `--accent` |
| Badge number | IBM Plex Mono | 13px | 600 | 1 | `--on-accent` |
| Tray number | IBM Plex Mono | 11px | 600 | 1 | `--on-accent` |
| Duration | IBM Plex Mono | 11px | 500 | 1 | `#fff` with a 1px 2px shadow |
| Camera label | Inter | 13px | 500 | 1 | `--text` |
| Menu item | Inter | 15px | 400 | 1 | `--text` |
| Menu count | IBM Plex Mono | 12px | 500 | 1 | `--text-3` |
| Add button | Inter | 16px | 600 | 1 | `--on-accent` |
| Toast | Inter | 14px | 500 | 1.4 | `#111` on `#f5f5f5` |

Numbers are mono so `1`, `2`, `3` and `3/4` do not shift width as they change.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Sheet | load | translateY, opacity | 40px, 0 → 0, 1 | 420ms | `--sheet-ease` | instant |
| Photo pick | tap | inner image scale, radius | 1, 6px → 0.88, 4px | 280ms | `--ease` | instant |
| Badge | pick | scale | 0.6 → 1.12 → 1 | 240ms | `--ease` | instant |
| Limit shake | fifth tap | translateX | 0 → -4 → 4 → -2 → 0px | 300ms | `--ease` | none, toast only |
| Toast | show, hide | opacity, translateY | 0, 12px → 1, 0 | 160ms, 280ms | `--ease` | 1ms |
| Tray thumb | added | opacity, scale | 0, 0.96 → 1, 1 | 200ms | `--ease` | instant |
| Album menu | open | opacity, scale, translateY | 0, 0.96, -4px → 1, 1, 0 | 200ms | `--ease` | instant |
| Chevron | menu toggle | rotate | 0 → 180deg | 160ms | `--ease` | instant |

The toast stays 2.4s. A new toast resets the timer instead of stacking. Under `prefers-reduced-motion: reduce`, drop every animation and set transitions to 1ms. The yellow badge and the numbers still change, so no meaning is lost.

## States

- Photo resting: full-bleed image, 6px radius, empty ring badge.
- Photo picked: `aria-pressed="true"`, image at 88%, 2px yellow inset frame, yellow badge with the order number.
- Photo blocked at the limit: shake and toast. It stays unpicked.
- Focus-visible: 2px `--accent` outline, 2px offset, on every button, tile and thumb remove control.
- Hover on header buttons: `--raised` fill.
- Menu item hover and focus: `#2c2c2c` fill. Checked item: yellow tick.
- Add enabled: yellow fill, black text, "Add N". Disabled: `--raised` fill, `--text-3` text, "Add".
- Tray empty: one line of `--text-3` copy.
- Video tile: duration label. It picks the same as a photo.
- Loading: not drawn. In a product, show `--tile` squares with no shimmer while thumbnails decode.
- Error: not drawn. If an album fails to load, show one line in the grid area and a Retry text button.

## Accessibility

- Each photo button has a full label: "Photo, hills at dusk, 2 Oct, selected 1 of 3". Videos start with "Video, 0:22".
- Use `aria-pressed` for picked, not a checkbox inside a button.
- The badge number is `aria-hidden`. The order is in the label.
- The counter is `aria-hidden`. The Add button text and the tile labels carry the count.
- The toast is `role="status"` so the limit message is read without moving focus.
- Album menu: Enter or Space opens it and focuses the checked item. Arrow Up and Down move. Enter picks. Escape or Tab closes and returns focus to the album button. A tap outside closes it.
- Removing a thumb moves focus to the next remove button, then the previous, then Add. Focus never drops to the body.
- Each remove button is labelled "Remove hills at dusk, 2 Oct".
- Hit targets: tiles about 126px, header buttons 44px, menu items 44px, remove buttons 44px, Add 48px.
- Contrast: `#f5f5f5` on `#161616` is above 16:1. `#8c8c8c` on `#161616` is about 5.4:1. `#111` on `#ffe500` is above 14:1.
- Photos are not decorative. The label describes the scene in a few words.

## Responsive rules

- The frame is 390×844. The sheet top sits at 54px plus 14px. The tray has `max(34px, env(safe-area-inset-bottom))` under it.
- At 360 wide, keep 3 columns. Shrink tray thumbs to 44px with a 6px gap so four fit beside the button.
- At tablet width, use 5 columns and cap the sheet at 600px wide, centred, with 6px radius on all four corners.
- In landscape phone, use 5 columns and keep the tray.
- The grid scrolls inside the sheet. The header and tray never scroll.
- Do not draw a status bar. The padding is the clearance.

## Acceptance checklist

### Always

- [ ] The first cell is a camera tile that never counts as a pick.
- [ ] Picks show numbered badges in pick order, and numbers close gaps on removal.
- [ ] The maximum is enforced. A blocked pick shows a toast and does not change the selection.
- [ ] The tray mirrors the grid, and each thumb can be removed with a 44px target.
- [ ] The commit button shows the count and is disabled at zero.
- [ ] The album menu is keyboard operable and keeps picks across albums.
- [ ] Each photo button has `aria-pressed` and a label with its order.
- [ ] Focus is visible on every control and never lost on removal.
- [ ] One accent colour only. Radii are 6px, badges are circles.
- [ ] Reduced motion removes the sheet rise, shake and badge pop.

### This demo

- [ ] The sheet opens with three picks, the counter reads 3/4 and the button reads "Add 3".
- [ ] The limit is 4, with the toast "You can add up to 4 photos".
- [ ] Albums are Recents 248, Favourites 31, Pokhara, March 64, Film scans 112.
- [ ] The accent is `#ffe500` on a `#161616` sheet.
- [ ] Photos are CSS gradients, with no image files and no external requests.
- [ ] The composer card behind reads "New roll · Silverline".

## Implementation notes

Keep the selection as an ordered array of IDs. The order badge is just the index plus one:

```js
const MAX = 4;
let selected = ['rec-1', 'rec-4', 'rec-2'];
function toggle(id, el) {
  const i = selected.indexOf(id);
  if (i > -1) selected.splice(i, 1);
  else if (selected.length >= MAX) {
    el.classList.remove('nope'); void el.offsetWidth; el.classList.add('nope');
    return toast(`You can add up to ${MAX} photos`);
  } else selected.push(id);
  sync(); // re-label every tile, rebuild the tray, update count and button
}
```

Do not store the number on the tile. Re-derive it in `sync()` from the array. That is how removal renumbers for free.

The pick look is a shrink inside a frame, not an overlay tint:

```css
.tile { position: relative; aspect-ratio: 1; border-radius: 6px; overflow: hidden; background: var(--tile); }
.tile .img { position: absolute; inset: 0; border-radius: 6px; transition: transform 280ms var(--ease); }
.tile[aria-pressed="true"] .img { transform: scale(.88); border-radius: 4px; }
.tile[aria-pressed="true"] { box-shadow: inset 0 0 0 2px var(--accent); }
.badge { position: absolute; top: 6px; right: 6px; width: 26px; height: 26px; border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,.9); background: rgba(0,0,0,.28); }
.tile[aria-pressed="true"] .badge { background: var(--accent); border-color: var(--accent); }
```

The remove dot is small, but its button is 44px. Hang it off the corner:

```css
.thumbs li { position: relative; width: 52px; height: 52px; }
.rm { position: absolute; top: -12px; right: -12px; width: 44px; height: 44px; display: grid; place-items: center; }
.rm span { width: 20px; height: 20px; border-radius: 50%; background: #f5f5f5; box-shadow: 0 0 0 2px #121212; }
```

A gradient "photo" is three or four layers: a subject shape, a light source, and a sky or wall. For example, hills: two `radial-gradient` ellipses anchored at the bottom, a small pale sun circle, and a two-stop sky. In a product, replace them with real thumbnails and keep everything else.

Common mistakes:

- Checkmarks instead of numbers. The number carries the post order.
- Storing the number on the DOM node. It goes stale on removal.
- Silently ignoring the fifth tap. Always say why.
- A 20px remove target. Hang a 44px button behind the dot.
- Clearing picks when the album changes.
- Yellow on the album name, Cancel and the counter total. One accent, for picks only.
- Purple gradients in the fake photos. Use dusk orange, sea blue, olive and clay.
- A glass blur on the sheet. This family is flat dark grey.
- Using real photo files in the demo.

Where it sits:

1. It opens from the composer's add photo button as a sheet. Detents and drag-to-dismiss come from `ios-bottom-sheet-detents`.
2. The limit and success toasts use one slot. For several messages at once, use `toast-stack`.
3. After Add, the picks appear in the composer in badge order. A full-screen review uses `gallery-contact-sheet` styled dark.
4. The camera tile hands off to the system camera, then drops the new shot into slot N+1.

Rebuild order:

1. Draw the backdrop, the composer card and the sheet with its grabber.
2. Build the header with Cancel, the album button and the counter.
3. Build the grid with the camera tile and photo buttons.
4. Write the ordered selection, `toggle()` and `sync()`.
5. Add the limit shake and the toast.
6. Build the tray with thumbs, remove buttons and focus handling.
7. Build the album menu with keyboard support.
8. Add the reduced-motion block and test with a screen reader.
