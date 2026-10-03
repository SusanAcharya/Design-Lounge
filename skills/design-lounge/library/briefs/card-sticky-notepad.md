<!-- Design Lounge Nº 395 · "Sticky notes board" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Sticky notes board

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A team retro board, "Tackwall", with square sticky notes scattered over dark felt under three chalk column headings: Went well, To change, Try next. Each note sits at a slight angle, has a handwritten face, and peels its bottom-right corner when you hover it. You add notes in one of five colours, drag them anywhere with a little swing, and throw them in a round bin in the corner to delete them, with an Undo toast. The detail worth copying is the peel: a registered `--peel` length drives both the clip-path that cuts the corner and the folded flap drawn in the same square, so the fold is one variable and tweens.

## Reference behaviour

1. First frame: seven notes on the board, rotations between -3.6° and 3.8°, each 196 × 196. The top bar reads "Tackwall · Studio retro · Week 41 · 7 notes". Butter is the selected new-note colour.
2. Hover or focus inside a note: its bottom-right corner peels 30px in 260ms. The flap is a lighter-to-darker fold of the note colour.
3. Press anywhere on a note except its text and its colour dot: the note lifts. It comes to the front, the paper scales to 1.04, the shadow deepens and the peel flattens to 0.
4. While dragging, the note follows the pointer exactly (no easing) and tilts with horizontal speed, up to ±8° on top of its resting angle.
5. Dragging onto the bin: the bin (always on top) turns solid red `#e8553e`, scales to 1.22, its lid tips open -28°, and the note shrinks to 0.72 at 70% opacity under it. While any note is being dragged the bin outline brightens and scales to 1.08.
6. Release over the bin: the note scales to 0.2 and fades in 280ms, then is removed. The count drops. A toast slides up: "Note deleted" with an Undo button, for 5 s.
7. Undo restores the note at the same place, colour and text, with the drop-in animation, and focuses it.
8. Release anywhere else: the note settles back to its resting angle in 320ms on expo out. Its position is stored as a fraction of the board so it keeps its place when the window resizes.
9. "Add note" adds a blank note in the selected colour near the middle, with a drop-in (scale 1.15 → 1, fade in, 420ms), and focuses its text so you can type.
10. The small dot on each note cycles its colour: butter, mint, coral, sky, paper.
11. Each note's text is a real textarea. Typing updates the note's accessible name.
12. Keyboard: the note's handle button moves the note 16px per arrow key (Shift 48px). Delete or Backspace on the handle removes it (same toast). Enter jumps into the text.
13. With reduced motion: no peel tween, no drop-in, no settle or shrink tween; every state still appears.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────┐
│ Tackwall  Studio retro · Week 41 · 7 notes      ● ● ● ● ●  [+ Add note] │ ~68px bar
├──────────────────────────────────────────────────────────────────────────┤
│ Went well ─ ─ ─ ─ ─ ─ ─   To change ─ ─ ─ ─ ─ ─   Try next ─ ─ ─ ─ ─ ─   │ dashed rules
│  ┌──────┐            ┌──────┐                  ┌──────┐                  │
│  │⠿ WENT│  ┌──────┐  │⠿ TO C│                  │⠿ TRY │                  │
│  │ New  │  │ Ship │  └──────┘                  └──────┘                  │
│  └─────◸│  └──────┘     ┌──────┐               ┌──────┐                  │
│   ┌──────┐              │ Too  │               │ Book │                  │
│   │ Pair │              └──────┘               └──────┘                  │
│   └──────┘                                         Drag here to delete   │
│                         (Note deleted  [Undo])            ( bin 84px )   │
└──────────────────────────────────────────────────────────────────────────┘
```

- `header.bar`: wordmark and meta on the left (`#count` updates), a `fieldset` of five radio swatches (legend "Colour for new notes", each 40 × 40 with a 22px dot), and the `button#add`.
- `main.board` (`position: relative; overflow: hidden; touch-action: none`) holds the decorative column headings, the notes, the bin label, the bin and the toast.
- Each note is `div.note` (positioned with `translate(var(--x), var(--y)) rotate(var(--r))`, drop-shadow filter) → `div.paper` (colour, clip-path) → `div.grip` (handle `button.mv` with a 6-dot icon and the column name or date, and `button.dot`) and a `textarea`.
- The bin is a decorative 84px circle with a lid group in its SVG. The real delete path for keyboard users is Delete on the handle.
- The toast is `role="status"` with `aria-live="polite"`, centred 28px from the bottom.

Seed notes (colour, fractional x, y, text, label):

| Colour | x | y | Text | Label |
|--------|---|---|------|-------|
| butter | .04 | .14 | New empty states landed well. People noticed! | Went well |
| mint | .12 | .52 | Pairing on the upload bug saved two days | Went well |
| coral | .37 | .13 | Kickoff felt rushed. Give it 15 more minutes | To change |
| paper | .44 | .50 | Too many review pings after 6 pm | To change |
| sky | .68 | .14 | Pairing Fridays, 2 to 4, any project | Try next |
| butter | .73 | .50 | Book room 4B for demo day, 16 Oct (Mira) | Try next |
| mint | .26 | .30 | Ship onboarding copy by Thursday | Went well |

Rotations cycle through -3, 2.2, -1.4, 3.4, -2.6, 1.2, 3.8, -3.6, 1.8 degrees. New notes are labelled with the date, "Oct 3".

## Tokens

```css
@property --peel { syntax: "<length>"; inherits: true; initial-value: 0px; }

:root {
  /* board */
  --board: #2d2b28;    /* felt */
  --board-2: #36332f;  /* top bar */
  --chalk: #d9d2c3;    /* bar text, column headings on hover */
  --chalk-2: #a49c8d;  /* headings, meta, bin outline */
  --line: #48443e;     /* hairlines, dashed column rules */

  /* notes */
  --butter: #f6d365; --mint: #a8ddb5; --coral: #f5a08b; --sky: #9cc9ee; --paper: #f2eee6;
  --note-ink: #2a2620; /* handwriting and labels on every note */

  /* actions */
  --danger: #e8553e;   /* hot bin */

  /* type */
  --hand: "Kalam", cursive;
  --sans: "Karla", system-ui, sans-serif;

  /* size */
  --nw: 196px;         /* note side */
  --peel-on: 30px;
  --bin: 84px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

Felt texture: two dot layers on the board, `radial-gradient(rgba(255,255,255,.035) 1px, transparent 1.2px)` at 6px and `radial-gradient(rgba(0,0,0,.18) 1px, transparent 1.2px)` at 9px offset `3px 4px`. Note sheen: `linear-gradient(rgba(255,255,255,.22), transparent 40%)` over the colour.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Wordmark | Kalam | 24px | 700 | 1 | 0 | title |
| Bar meta | Karla | 13px | 400 | 1.4 | 0 | sentence |
| Column heading | Kalam | 22px | 400 | 1 | 0 | sentence |
| Note label | Karla | 11px | 600 | 1 | 0.06em | UPPER, 62% ink |
| Note text | Kalam | 19px | 400 | 1.3 | 0 | sentence |
| Add button | Karla | 14px | 700 | 1 | 0 | sentence |
| Toast | Karla | 14px | 600 | 1.4 | 0 | sentence |
| Bin label | Karla | 12px | 400 | 1.4 | 0 | sentence |

Only the handwriting face is on the notes and headings. UI chrome is Karla.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Note | hover / focus-within | `--peel` | 0 → 30px | 260ms | `--expo` | instant |
| Note | press (lift) | paper scale, filter, `--peel` | 1 → 1.04, deeper shadow, → 0 | 200ms | `--ease` | instant |
| Note | drag | translate, rotate | follows pointer, tilt ±8° | 0 | — | same |
| Note | release | rotate back, position | → rest angle | 320ms | `--expo` | instant |
| Note | over bin | paper scale, opacity | 1 → .72, 1 → .7 | 200ms | `--ease` | instant |
| Note | delete | scale, opacity | 1 → .2, 1 → 0 | 280ms | `--ease` | removed at once |
| Note | add / undo | scale, opacity | 1.15, 0 → 1, 1 | 420ms | `--expo` | none |
| Bin | any drag | scale, colour | 1 → 1.08, chalk-2 → chalk | 260ms | `--expo` | instant |
| Bin | note over it | background, scale; lid rotate | → `#e8553e`, 1.22; 0 → -28° | 260ms | `--expo` | instant |
| Toast | delete | translateY, opacity | 140% → 0, 0 → 1 | 320ms | `--expo` | instant |
| Add button | press | scale | 1 → .96 | 160ms | `--ease` | instant |

Tilt is smoothed: `tilt = clamp(-8, tilt * .7 + dx * .6, 8)` per pointer move, where `dx` is the horizontal movement since the last event.

## States

- **Note rest:** rotated, two drop shadows (`0 1px 1px rgba(0,0,0,.35)` and `0 8px 10px rgba(0,0,0,.28)`), no peel.
- **Note hover / focus-within:** 30px peel.
- **Note lifted:** z-index on top, scale 1.04, shadows `0 2px 2px rgba(0,0,0,.3)` and `0 22px 22px rgba(0,0,0,.35)`, cursor `grabbing`.
- **Note doomed (over bin):** scale .72, opacity .7.
- **Text focused:** a 2px inset ring at 60% ink inside the paper.
- **Handle focus-visible:** 2px butter outline, 3px offset.
- **Swatch selected:** 3px bar-colour gap and a 2px ring in the swatch colour; focus adds a butter outline 6px out.
- **Bin hot:** solid `#e8553e`, white icon, lid open, label turns paper.
- **Empty board:** count reads "0 notes"; the column headings and bin remain. Add note still works.
- **Toast:** visible 5 s after a delete; Undo restores the last deleted note only.

## Accessibility

- Each note's handle is a `button` labelled `Move note "<first five words>". Arrow keys move, Delete removes`. Arrows move 16px, Shift 48px; Delete or Backspace deletes; Enter focuses the text.
- The textarea has `aria-label="Note text"`. Typing refreshes the handle label.
- The colour dot is a `button` labelled "Colour: mint. Change colour". A polite region announces the new colour.
- The swatches are native radios in a `fieldset` with a hidden legend "Colour for new notes", each with an `aria-label`.
- The bin is `aria-hidden` and `pointer-events: none`; dragging is never the only way to delete.
- After a delete, focus moves to the next note's handle. The toast is a polite status; Undo is a real button and puts focus on the restored note.
- Hit targets: swatches 40 × 40, add button 40px tall, handle 32px tall across the label, colour dot 28 × 28 (inside a 36px strip).
- Contrast: `#2a2620` on every note colour is above 8:1 (sky is the lowest). `--chalk-2` on the board 5.9:1.

## Responsive rules

- **≥ 1280:** notes 196px, bar padding 14px 32px.
- **1024 / 768:** same note size; fractional positions keep the layout, and notes are clamped inside the board.
- **< 640:** notes 132px with 15px text and a 30px strip, column headings 16px, bin 68px at 16px from the corner, bin label hidden, board meta hidden. The bar wraps: swatches beside the wordmark, Add note on the next line.
- Notes are clamped so at least half of a note stays on the board while dragging, and fully inside on load and on resize.
- The board is `overflow: hidden`; nothing scrolls sideways at 375px.

## Acceptance checklist

### Always

- [ ] Notes are square, slightly rotated, and come to the front when touched.
- [ ] Hover or focus peels the bottom-right corner with a folded flap; lifting flattens it.
- [ ] Drag follows the pointer exactly and tilts with speed, within ±8°.
- [ ] Dropping on the bin deletes; the bin reacts before release (colour, scale, lid).
- [ ] Every delete shows an Undo toast for 5 s.
- [ ] Keyboard can move, recolour, edit and delete every note.
- [ ] New notes take the selected colour and focus their text.
- [ ] Positions are stored as fractions of the board and survive a resize.
- [ ] Reduced motion removes the tweens but keeps every state.

### This demo

- [ ] Seven seed notes in three columns: Went well, To change, Try next.
- [ ] Felt `#2d2b28`; note colours `#f6d365`, `#a8ddb5`, `#f5a08b`, `#9cc9ee`, `#f2eee6`; bin hot `#e8553e`.
- [ ] Notes 196px, text Kalam 19px/1.3, labels Karla 11px caps.
- [ ] Peel 30px in 260ms; bin 84px, scales to 1.22 with the lid at -28°.
- [ ] Count reads "7 notes" and updates on add, delete and undo.

## Implementation notes

**One variable for the peel.** The paper is clipped by a polygon whose corner depends on `--peel`, and the flap is a pseudo-element of exactly `--peel` square filled on its inner half. Registering `--peel` lets both tween together.

```css
.note { --peel: 0px; transition: --peel 260ms var(--expo); filter: drop-shadow(0 8px 10px rgba(0,0,0,.28)); }
.note:hover, .note:focus-within { --peel: 30px; }
.paper {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - var(--peel)),
                     calc(100% - var(--peel)) 100%, 0 100%);
}
.paper::after {
  content: ""; position: absolute; right: 0; bottom: 0;
  width: var(--peel); height: var(--peel);
  background: linear-gradient(to bottom right,
    color-mix(in srgb, var(--c), #fff 35%) 0,
    color-mix(in srgb, var(--c), #000 14%) 50%, transparent 50%);
}
```

Put the shadow on the outer `.note` as `filter: drop-shadow`, not `box-shadow` on the paper. A clipped element's box-shadow is clipped too, and box-shadow would draw a square under the peeled corner.

**Drag from the note, not a tiny grip.** Listen on the whole note and skip the textarea and the colour dot, then capture the pointer:

```js
note.addEventListener('pointerdown', e => {
  if (e.target.closest('.dot, textarea') || e.button > 0) return;
  e.preventDefault();
  note.style.zIndex = ++z; note.classList.add('lift'); board.classList.add('dragging');
  note.setPointerCapture(e.pointerId);
  drag = { ox: e.clientX - left - x, oy: e.clientY - top - y, lx: e.clientX, tilt: 0 };
});
note.addEventListener('pointermove', e => {
  if (!drag) return;
  drag.tilt = Math.max(-8, Math.min(8, drag.tilt * .7 + (e.clientX - drag.lx) * .6));
  drag.lx = e.clientX;
  const hot = overBin(e.clientX, e.clientY);       // bin rect grown by 28px
  bin.classList.toggle('hot', hot); note.classList.toggle('doom', hot);
});
```

**Exclude transform from the transition while lifted.** The rest state transitions transform for the settle; the `.lift` rule redeclares `transition` without transform so the note does not lag behind the pointer.

Common mistakes:

- A grip so small that pressing a note's edge does nothing. The whole note except the text is a handle.
- Box-shadow on a clip-pathed element.
- Deleting with no undo.
- The bin hidden under a note being dragged; keep it on top with `pointer-events: none`.
- Pixel positions that push notes off the board on a narrower window. Store fractions.
- Emoji or an image for the bin. It is a 24-grid stroke SVG with a separate lid group.
- A handwriting face for the toolbar. Only the notes and headings are handwritten.

Rebuild order:

1. Bar with swatches and Add, felt board with column headings.
2. Note markup, colours, rotation, shadow filter, then the peel.
3. Pointer drag with tilt and fractional storage.
4. Bin hot state, delete animation, toast and Undo.
5. Add note, colour dot, keyboard handle, live region.
6. Reduced motion and the phone breakpoint.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
