<!-- Design Lounge Nº 180 · "Contact sheet" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Contact sheet

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the selected frame uses a 2px `--ink` border and the caption uses the display face. The masonry wall is `masonry-gallery-captions`. This sheet is equal frames.

## What it is

A photographer's contact sheet, North plates. Eight squares, 120px, in four columns. They are flat colour fields, not photographs and not images fetched from anywhere. North wall starts selected, with a 2px ink border. The caption under the sheet is "North wall" at 28px, and the line under it is "Plate 01 · morning". Clicking another plate moves the border and rewrites both lines. There is no hover caption, no filter chip, and no lightbox. The masonry gallery already does the hover caption. This piece is the sheet you edit from.

## Reference behaviour

1. North wall is `aria-pressed="true"`. The caption and the meta match plate 01.
2. Clicking a plate presses that one only. The caption becomes its name. The meta becomes its plate number and time of day.
3. The eight names, in order: North wall, Gate light, Salt, River, Wool, Noon, Ink, Yard.
4. Their metas: Plate 01 · morning, Plate 02 · morning, Plate 03 · noon, Plate 04 · noon, Plate 05 · afternoon, Plate 06 · afternoon, Plate 07 · evening, Plate 08 · evening.
5. There is no animation. Focus ring is 2px `--focus`, offset 3px.
6. The frames are buttons. They do not open a second page in this demo.

## Structure

```
padding 48px 64px
NORTH PLATES                 12px
Contact sheet                40px serif
four columns of 120px, gap 8
North wall                   28px caption
Plate 01 · morning           15px
```

- Each frame is a button with an accessible name equal to the plate name.
- The colour is the art. It is a background, not a letter inside the square.
- One caption, under the whole sheet, not a bar inside every tile.

## Tokens

```css
:root {
  --bg: #f3efe6;
  --ink: #1a1814;
  --ink-2: #5c5348;
  --focus: #1a1814;
  --serif: "Fraunces", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;
}
```

The frame colours are the pictures: `#c4b49a`, `#d7c4a3`, `#e6e0d4`, `#b7c4c0`, `#c9b8a8`, `#e2c7a4`, `#2c2825`, `#b9c3a8`. They are not theme tokens. When a theme is locked, the page paper, the type, and the selection border follow the theme. The eight fields stay these colours, because they are the work, not the chrome. Do not recolour the plates to the brand.

Frame radius is 2px. The family may replace the chrome radius. A square family stays square. Do not turn the plates into circles.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Kicker | sans | 12px | 500 | `--ink-2` |
| Title | serif | 40px | 500 | `--ink` |
| Caption | serif | 28px | 500 | `--ink` |
| Meta | sans | 15px | 400 | `--ink-2` |

The kicker letter-spacing is 0.06em in this demo. The title is the largest type. The caption steps down. The meta is the text face.

## Motion

None. Selection changes in one frame. Reduced motion has nothing to remove. Do not zoom the plate.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Plate | click | which frame is pressed, caption, meta |
| Focus | keyboard | 2px ring, offset 3px |

## States

- Frame resting: 120px square, 2px transparent border, radius 2px.
- Frame selected: 2px solid `--ink`, `aria-pressed="true"`.
- Caption and meta update together. They are never empty.
- Focus-visible: 2px outline, offset 3px. It sits outside the selection border.
- Do not dim the unselected plates. The border is the selection. Dimming makes the work look disabled.
- Ink, the dark plate, has no text on it. The name is the button's accessible name and the caption below.

## Accessibility

- Every button has an accessible name, the plate name.
- `aria-pressed` marks the one selected plate.
- The caption is text, so the selection is not only a border.
- Hit target: 120px, which clears 40px.
- Contrast of the caption `#1a1814` on `#f3efe6` clears 4.5. The plates are art. Do not put a label in a colour that fails on `#e6e0d4` or on `#2c2825`.
- Keyboard users reach each plate in order and see the same caption a click would write.

## Responsive rules

- At 1280 the sheet is four columns, padding 48px 64px.
- At 768 it may be four columns still, since 4 times 120 plus gaps fits.
- Below 640 it becomes two columns. Frames stay 120px. Do not shrink them under 96px. The caption stays under the sheet, full width of the column.
- This is not a masonry. Every frame is the same size. A wall of mixed ratios is the other gallery.

## Acceptance checklist

- [ ] Eight frames, 120px, four columns, gap 8px.
- [ ] North wall starts selected with a 2px `#1a1814` border.
- [ ] The caption reads North wall. The meta reads Plate 01 · morning.
- [ ] Clicking Ink sets the caption to Ink and the meta to Plate 07 · evening, and clears the other border.
- [ ] Only one plate is pressed.
- [ ] The title is Contact sheet at 40px Fraunces.
- [ ] Unselected plates are not dimmed.
- [ ] There is no lightbox, no chip filter, and no hover caption.
- [ ] Focus ring is 2px, offset 3px.
- [ ] There is no animation and no fetched image.

## Implementation notes

Keep the name and the meta on the button. The caption reads them.

```js
cap.textContent = b.dataset.name;
meta.textContent = b.dataset.meta;
```

Common mistakes:

- A masonry of different heights. That is `masonry-gallery-captions`.
- A caption bar that slides up over the picture. The other gallery does that. Here the caption is one, under the sheet, for the selected plate.
- Circles, or a radius that fights a square family.
- Recolouring the plates to the brand primary.
- A lightbox the person must open before they can read the name.
- Text baked into the pale plates at a size that fails contrast.
- Loading remote images. The colour field is the picture.

Where it sits in a product:

1. Use it when the work is a set of equal frames and the person is choosing one.
2. A filtered wall of mixed crops is the masonry piece.
3. A case-study page is not this sheet. Do not add a long essay under plate 01.
4. The selection border is `--ink`, 2px. It is not a soft green wash across the picture.
5. The caption is the display face. The meta is the text face. A locked pairing replaces both.
6. The page paper follows the theme. The eight colours do not.
7. One sheet. Do not repeat it as a second grid of circles.
8. North wall is plate 01. The order of the buttons is the order of the plates.
9. Keep the credit line on the token block.
10. The kicker NORTH PLATES is the series name.

Rebuild order:

1. Set the paper, Fraunces, and Public Sans.
2. Place the kicker, the title, and the eight frames.
3. Select North wall.
4. Place the caption and the meta.
5. Wire a click to move the border and the words.
6. Check only one plate is pressed.
7. Map the border and the type onto the kit. Leave the plate colours.

Copy you keep:

1. NORTH PLATES.
2. Contact sheet.
3. The eight names and the eight plate lines, in order.
4. North wall starts selected.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
