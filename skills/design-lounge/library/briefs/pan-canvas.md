<!-- Design Lounge Nº 214 · "Pan canvas" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Pan canvas

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A frame of 960 by 560 over a 1600 by 1000 grid of sixteen yard rooms. Drag pans the grid. Arrow keys move it 40px. The rooms are local samples. This is not a masonry of photos. That gallery is `masonry-gallery-captions`. The pan is the piece.

## Reference behaviour

1. The grid starts translated -80px, -40px.
2. Pointer drag updates the translation.
3. Arrow keys move 40px.
4. The frame clips the grid.
5. Each cell names a room and says the sample is local.
6. The cursor is grab, and grabbing while down.
7. Nothing is fetched.

## Structure

```
960×560 frame
1600×1000 grid of rooms
```

- Frame 960 by 560, overflow hidden.
- Grid 1600 by 1000, four columns, gap 16px.
- Cells min-height 220px.
- The hint Drag the map sits in the corner and does not capture the pointer.
- The frame is role application with a name.

## Tokens

```css
:root { --bg:#141311; --cell:#1c1b19; --ink:#f4f1ea; --ink-2:#a39b90; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Room | IBM Plex Sans | 20px | 600 |
| Note | IBM Plex Sans | 14px | 500 |
| Hint | IBM Plex Sans | 14px | 500 |

## Motion

- Pan | drag or arrows | old translate | new translate | none | the view still moves

## States

- Idle: grab cursor.
- Dragging: grabbing cursor.
- Arrow: view steps 40px.
- Cells do not select.

## Accessibility

- The frame is role application and is tabbable.
- The name says drag to pan and that arrows move the view.
- Cells are text, not buttons.
- Arrow keys move the view.
- Focus ring is 2px #d7b15e, offset 2px.
- Do not trap focus past the frame.

## Responsive rules

- The frame is 960 by 560 at 1280.
- Below 1000 the frame is calc(100% - 32px) and height 70vh.
- The grid stays larger than the frame so there is something to pan.

## Acceptance checklist

### Always

- [ ] The map is larger than the frame.
- [ ] Drag pans.
- [ ] Arrows pan.
- [ ] Room names are readable without dragging to a special zoom.
- [ ] Nothing is live data.

### This demo

- [ ] Sixteen rooms include Gate 1, Gate 4, Cold room, Biratnagar, Type room.
- [ ] The hint is Drag the map.
- [ ] Start offset is -80, -40.
- [ ] Arrow step is 40px.
- [ ] Ground of the frame is near-black.

## Implementation notes

Store the pointer offset on pointerdown.

```js
x = e.clientX - drag.x;
```

Do not use a map library.

## Measurements to keep

- Frame 960×560. Grid 1600×1000. Gap 16px.
- Cell min-height 220px. Padding 16px.
- Arrow step 40px. Start -80, -40.
- Room name 20px.
- Hint sits 16px from the left and 12px from the bottom.

## Wrong turns

- Do not zoom in this piece.
- Do not fetch tiles.
- Do not make each room a link.
- Do not inertia-spin forever.
- Do not hide the names.
- Do not use a scrollbar as the only pan.

## Fit with the rest of the library

- A photo masonry is `masonry-gallery-captions`.
- A lens is `lens-bento`.
- This is a pannable board.
- Do not add a minimap.
- Type is IBM Plex Sans.
- The frame clips.

## Keyboard

- ArrowLeft moves the view right by 40px, which reveals the left.
- ArrowRight, ArrowUp, and ArrowDown step 40px.
- The frame is one tab stop.
- Cells are not tab stops.
- Do not use a positive tabindex.
- Pointer capture stays during the drag.
- The hint is not a button.
- Focus ring is #d7b15e.
- There are 16 cells.
- Start offset is -80, -40.
- No zoom keys.
- No live data.
- Type is IBM Plex Sans.
- The role is application.
- Escape does nothing.
- Reduced motion still allows the pan, because the pan is the task.

## Rebuild order

1. Build step: The grid starts translated -80px, -40px.
2. Build step: Pointer drag updates the translation.
3. Build step: Arrow keys move 40px.
4. Build step: The frame clips the grid.
5. Build step: Each cell names a room and says the sample is local.
6. Build step: The cursor is grab, and grabbing while down.
7. Build step: Nothing is fetched.

- Keep this measurement while rebuilding: Frame 960×560. Grid 1600×1000. Gap 16px.
- Keep this measurement while rebuilding: Cell min-height 220px. Padding 16px.
- Keep this measurement while rebuilding: Arrow step 40px. Start -80, -40.
- Keep this measurement while rebuilding: Room name 20px.
- Keep this measurement while rebuilding: Hint sits 16px from the left and 12px from the bottom.

- While rebuilding, remember: Do not zoom in this piece.
- While rebuilding, remember: Do not fetch tiles.
- While rebuilding, remember: Do not make each room a link.
- While rebuilding, remember: Do not inertia-spin forever.
- While rebuilding, remember: Do not hide the names.
- While rebuilding, remember: Do not use a scrollbar as the only pan.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
