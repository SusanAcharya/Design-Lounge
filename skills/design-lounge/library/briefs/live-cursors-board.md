<!-- Design Lounge Nº 495 · "Live cursors on a board" · www.designlounge.live -->

# Live cursors on a board

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A shared floor plan for House Lamp, a fictional theatre company, on Thursday's call. The sheet is warm paper on a slightly darker ground. Four set pieces sit on the plan: Riser A, Centre table, Window bay, Prompt desk. Three people are on the board. Mira is you. Jo Hale and Ellis Voss drift. Your cursor is a rust arrow with your name. Theirs are pine and navy. Click a set piece and it takes a rust inset ring and the word Mira. The one detail worth copying is that every cursor carries a name, and only the board hides the system pointer.

## Structure

```
1280 × 800
┌ header 64: House Lamp    FLOOR 2 · THURSDAY CALL     (Mira you) (Jo) (Ellis) ┐
│  room, inset 48px from the sides and 28px from top and bottom of the board   │
│  ┌──────────┐                                              ┌────────────┐    │
│  │ 01 Riser │                                              │ 03 Window  │    │
│  └──────────┘              ┌─ claimed ─────────┐           └────────────┘    │
│                            │ 02 Centre table   │                              │
│                            └───────────────────┘     ┌──────────────┐        │
│                                                      │ 04 Prompt    │        │
│  Click a piece to claim it.                          └──────────────┘  plate │
└──────────────────────────────────────────────────────────────────────────────┘
```

- `header.head`: brand in Newsreader 22/600, meta in Public Sans 12/500 uppercase, tracking +0.08em.
- `.who`: three `.chip` pills, height 32px, sheet fill, 1px `--line` border, radius 999px. An 8px dot, then the name.
- `.board` fills the rest. `.room` is the sheet, 1px ink border, an inner rule at `inset: 10px`, and four 14px corner ticks.
- Each set piece is a `<button class="block">`: small uppercase index, a 20px serif title, and an italic "Mira" that is `display: none` unless `aria-pressed="true"`.
- Positions inside the room: Riser `36,48` 240×280. Centre table `320,210` 340×160. Window bay `760,48` 280×190. Prompt desk `700,400` 340×150.
- `.plate` sits `right: 28px; bottom: 24px`, 200px wide, a 1px ink rule on top, three uppercase lines.
- Each `.cur` is a zero-size point. A 22px filled arrow SVG and a 22px name chip (`left: 16px; top: 16px`, radius 4px, paper text on the person's colour).

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
| --- | --- | --- | --- | ---: | --- | --- |
| Mira cursor | pointermove in the room | transform | previous point → clamped pointer | 0 | — | set directly, no loop |
| Jo cursor | load | transform | (150,150) → (250,250) → (170,310) | 16s | `--ease` | `infinite alternate` |
| Ellis cursor | load | transform | (880,110) → (960,180) → (820,160) | 18s | `--ease` | `infinite alternate` |
| Claimed piece | click | background, box-shadow | sheet → `--you-soft` plus 2px inset rust | 0 | — | instant |

Reduced motion: `animation: none` on Jo and Ellis, so their inline first transforms remain. Mira still tracks the pointer.

## States

- **Idle piece:** sheet fill, 1px ink border, claim line hidden.
- **Hover piece:** background `#efe8dc`. The system cursor stays hidden.
- **Pressed piece:** background `--you-soft`, `box-shadow: inset 0 0 0 2px var(--mira)`, italic "Mira" visible. Only one piece is pressed.
- **Focus-visible:** `outline: 2px solid var(--mira); outline-offset: 3px`.
- **Your cursor:** rust fill `#9c3418`, chip the same, paper label "Mira".
- **Jo / Ellis:** pine `#1b5e45` and navy `#243e68`. Chips use paper text `#f7f3ec`.

## Accessibility

- The four set pieces are real buttons. `aria-pressed` is true on the claimed one only.
- Presence chips are not buttons. They are labelled by the group `aria-label="People on this board"`.
- Cursor arrows are `aria-hidden`. The names are visible text, not the only name of a control.
- Tab order is the four pieces. Cursors are not in the tab order.
- Contrast: ink `#1c1914` on sheet `#f4efe6` is above 12:1. Ink-2 `#5c564c` on sheet is about 6:1. Paper on rust, pine, and navy is above 4.5:1.
- Hit targets: each piece is at least 150×140.

## Responsive rules

- ≥ 1280: as drawn.
- 1024–1279: room padding drops to 24px. Pieces scale down by about 15% but keep the same corners. Cursors stay in percentages of the room if you convert the paths.
- 768–1023: pieces stack in a 2×2 grid inside the room. Header chips wrap under the wordmark. Cursor paths stay inside the room.
- < 768: one column of pieces. The board does not hide the system cursor, because a finger has no pointer to follow. Show the three names as chips only, and keep the claim interaction.

## Acceptance checklist

**Always**

- [ ] Exactly three cursors, each with a visible name chip.
- [ ] The local cursor follows the pointer only inside the plan, and is clamped 8px inside the edges.
- [ ] The system cursor is hidden on the plan and visible everywhere else.
- [ ] Cursors do not receive pointer events.
- [ ] Clicking a piece claims it and clears the previous claim.
- [ ] The two remote cursors move on a slow loop. Reduced motion freezes them at the start of that loop.
- [ ] Focus-visible outline is 2px in the local person's colour.

**This demo**

- [ ] The people are Mira (you, `#9c3418`), Jo Hale (`#1b5e45`), and Ellis Voss (`#243e68`).
- [ ] Centre table starts claimed.
- [ ] The four pieces are Riser A, Centre table, Window bay, and Prompt desk.
- [ ] Header reads "House Lamp" and "Floor 2 · Thursday call".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: header 64px, "House Lamp" in serif, "Floor 2 · Thursday call" in small caps. Three presence chips at the right: Mira (you), Jo Hale, Ellis Voss. Centre table is already claimed (`aria-pressed="true"`), filled `#f3d2c6` with a 2px inset rust ring, and the italic word Mira under the title. Mira's cursor sits on that table. Jo is by the riser. Ellis is on the window bay.
2. Moving the pointer inside the room moves Mira's cursor to that point, clamped 8px inside the room edges. The system cursor is `none` on the board only.
3. Jo's cursor loops a three-point path over 16s, alternate, easing `cubic-bezier(.2,.7,.2,1)`. Ellis loops a different path over 18s. Both are CSS animations. They do not follow the pointer.
4. Click a set piece: it becomes the only pressed piece. The others lose the ring, the wash, and the name. The clicked piece shows "Mira".
5. Cursors are `pointer-events: none`. They never block the click.
6. Tab reaches the four pieces. Focus-visible is a 2px rust outline, 3px offset.
7. Reduced motion: Jo and Ellis stay at their first positions. Mira still follows the pointer. Claiming still works.
8. Leaving the room leaves Mira where the pointer last was.

## Tokens

```css
:root {
  --bg: #e4ddd0;          /* page ground */
  --sheet: #f4efe6;       /* plan and chips */
  --ink: #1c1914;         /* titles, borders, plate name */
  --ink-2: #5c564c;       /* indexes, meta, hint */
  --line: #c9c0b2;        /* chip border */
  --mira: #9c3418;        /* you: cursor, claim, focus */
  --jo: #1b5e45;
  --ellis: #243e68;
  --you-soft: #f3d2c6;    /* claimed piece wash */
  --font: "Public Sans", system-ui, sans-serif;
  --serif: "Newsreader", Georgia, serif;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Wordmark | Newsreader | 22px | 600 | 1 | −0.02em | sentence |
| Meta, indexes, plate | Public Sans | 11–12px | 500 | 1.45 | +0.06em to +0.12em | uppercase |
| Chip name | Public Sans | 13px | 600 | 1 | 0 | sentence |
| Piece title | Newsreader | 20px | 600 | 1.1 | 0 | sentence |
| Claim name | Newsreader | 13px | 400 italic | 1.3 | 0 | sentence |
| Cursor name | Public Sans | 12px | 600 | 22px | 0 | sentence |
| Hint | Public Sans | 12px | 500 | 1 | 0 | sentence |

## Implementation notes

Remote cursors are CSS so the page does not run a frame loop. Give them a resting transform, then let the animation override it. When reduced motion sets `animation: none`, the resting transform shows again.

```css
.jo { transform: translate(150px, 150px); animation: jo 16s var(--ease) infinite alternate; }
@keyframes jo {
  0% { transform: translate(150px, 150px); }
  50% { transform: translate(250px, 250px); }
  100% { transform: translate(170px, 310px); }
}
@media (prefers-reduced-motion: reduce) { .jo, .ellis { animation: none; } }
```

The local cursor is a zero-size element. The arrow and the name hang off it. Clamp to the room, not the page:

```js
room.addEventListener('pointermove', function (e) {
  var r = room.getBoundingClientRect();
  var x = Math.max(8, Math.min(r.width - 28, e.clientX - r.left));
  var y = Math.max(8, Math.min(r.height - 28, e.clientY - r.top));
  you.style.transform = 'translate(' + x + 'px,' + y + 'px)';
});
```

Claim is exclusive. Set `aria-pressed` on the clicked button and clear the others. Do not also move that person's cursor to the piece. The cursor and the claim are separate.

Common mistakes: hiding the cursor on `body`, so the header cannot be used; running `requestAnimationFrame` forever for two drifting dots; making the name chip the only accessible name of the button.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
