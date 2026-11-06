---
title: "Knotwork word trace"
summary: "A 5×5 letter grid where you drag a rope through touching letters to find five themed words, with hints, a 3:00 clock, pause and a finish card."
platform: mobile-app
type: screen
category: games
tags: [word, puzzle, drag, press, timer, keyboard]
styles: [paper, playful]
motion: rich
difficulty: 3
featured: false
published: 2026-11-06
palette: ["#F1ECE1", "#FFFCF5", "#17303B", "#B8792A", "#9FD2C3"]
fonts: ["Young Serif", "Onest"]
related: [minigame-peg-drop, game-title-screen, swipe-flashcard-review]
---

# Knotwork word trace

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A daily word-trace puzzle from a fictional app called Knotwork. The board is a 5×5 grid of cream paper tiles set in Young Serif; five words on a hidden theme ("Harbour": ANCHOR, KNOT, BUOY, MAST, TIDE) are threaded through it. You drag across touching letters, the tiles you pass lift and turn harbour navy, and a short dotted rope ties each tile to the next in the gaps between them. Release on a real word and the word flies up into its slot, the tiles lock in that word's colour, and the score ticks; release on anything else and the tiles shake back. The detail worth copying: the rope is drawn only between tiles (each segment is trimmed by 44% of a tile at both ends), so it never sits on a letter and the trace still reads as one line.

## Reference behaviour

1. First frame is mid-game: board 1 "Harbour", clock 2:31 and running, BUOY already found (its four tiles locked coral `#F2AA92`, its chip filled), "1 of 5 found", Hint 2. The readout says "Drag across touching letters". A ghost fingertip (44px navy ring at 16% fill) glides from the bottom-left tile toward the centre twice (2.6s each, 600ms delay), then stops.
2. Pointer down on a tile: pointer capture on the board, path = [that tile]. The tile lifts (`translateY(-4px) scale(1.06)`, navy fill, paper letter, lift shadow). The readout becomes a navy pill with the letters so far, Young Serif 20px, tracking 0.18em. The ghost hides for good.
3. Pointer move: a tile joins only if it is one of the 8 neighbours of the last tile, is not already on the path, the pointer is within 50% of a tile size of its centre (so diagonals don't catch corners), and the path is under 7 letters. Moving back onto the second-last tile pops the last one. A live rope segment runs from the last tile to the finger.
4. Release with fewer than 3 letters: the path clears silently.
5. Release on an unfound hidden word: the tiles lock to the word's colour (`--w0`…`--w4`), a copy of the word in a coloured pill flies from the readout to its chip (520ms, expo out, arcing 26px up at the midpoint, scaling to 0.72), then the chip fills with the word and pops (380ms spring). The readout shows "KNOT  +160" on a paper pill for 1100ms. Score += letters × 40. Live region: "KNOT found. 2 of 5."
6. Release on a word already found: readout turns brick `#A8432F` and says "Already found". Any other word: "GAT is not hidden here". Both: the traced tiles shake (360ms, ±7 → ±2px) and drop back after 420ms.
7. Hint button: picks the first word that is neither found nor hinted, writes its first letter into the chip's first box, gives the starting tile of one valid path a pulsing rope-coloured ring (1.2s, infinite until found), costs 30 points. Two hints per board; at 0 the button disables.
8. Keyboard: type a word into the "Type a word" field and press Enter (or the arrow button). If it is a hidden word and traceable, it locks exactly as a drag would. If it is 3+ letters and cannot be traced on the board, the readout says "SAIL cannot be traced". Escape toggles pause.
9. Clock: counts down from 3:00 in a rAF loop, delta capped at 100ms, stopped when paused or finished. At 0:30 and below it turns brick. At 0:00 the round ends as a loss.
10. Pause (button or Escape): the clock stops, the word chips and grid blur 8px, a bottom sheet rises (420ms iOS sheet curve): "Paused / The tide can wait", Resume and New puzzle. Resume refocuses the Pause button and restarts the loop.
11. Finish card (all five found, 700ms after the last lock): "Board cleared / Harbour, tied off / Every word found with 2:27 to spare." Three knot marks fill in one at a time (500ms, then 260ms apart, 420ms stamp), then the score counts up over 700ms (cubic out), then focus lands on Next board. Marks: 3 if more than 90s left, 2 if more than 40s, else 1. Final score = word points − hint costs + 5 per second left.
12. Loss card: "Time is up / 3 of 5 found / The rest were MAST, TIDE." One mark if 3+ were found.
13. Replay reloads the same board at 3:00; Next board cycles Harbour → Orchard → Night sky → Harbour.

## Structure

```
390 × 844, paper #F1ECE1, column padding 54 / 20 / 34
┌──────────────────────────────────────┐
│ 54px clear                           │
│ Knotwork            ( ◷ 2:31 ) (II)  │ header 48: timer 40h pill, pause 44
│ Board 1 of 3 · Thursday              │
│ HIDDEN THEME                         │ 11px caps
│ Harbour                  1 of 5 found│ 44px Young Serif
│ [□□□□□□] [□□□□] [BUOY] [□□□□]        │ chips 30h, gap 8, wrap, min 68h
│ [□□□□]                               │
│        ( Drag across touching… )     │ readout 44h, pill 40h
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐            │
│  │G │ │U │ │T │ │O │ │L │            │ tiles 62, gap 10, grid 350 × 350
│  └──┘ └──┘ └──┘ └──┘ └──┘            │ rope SVG over the grid
│  … 5 rows                            │
│                                      │
│ [ Hint 2 ] [ Type a word     ] [ → ] │ controls 52h, bottom of column
│ 34px clear                           │
└──────────────────────────────────────┘
Sheets (pause, finish): fixed, full width ≤390, radius 28 top, padding 28/24/46
```

- `header`: brand block (`b` + `span`), `div.timer[role=timer]`, `button#pauseBtn[aria-expanded]`.
- Theme: `small` kicker, `h1#theme`, `div.count`.
- `ul.words` of `li.chip`, each with one `i` box per letter and an `aria-label` ("4 letters, not found" / "BUOY, found").
- `div.readout > p` (aria-hidden; the live region speaks instead).
- `div.board[role=application]` holds `div.grid` of 25 `div.tile`, `svg.rope` with two paths (solid core + dotted fibres), and the ghost.
- Controls: `button.hint-btn`, `form` with a labelled `input` and a submit button.
- `section.sheet[role=dialog][aria-modal]` × 2; closed sheets are `visibility:hidden`.

## Tokens

```css
:root {
  /* surfaces */
  --paper: #F1ECE1;      /* page */
  --paper-2: #E8E1D2;    /* empty chip */
  --tile: #FFFCF5;       /* tile, pills, secondary buttons */
  --tile-line: #D6CCB8;  /* tile edge, hairlines */
  /* ink */
  --ink: #17303B;        /* text, selected tile, primary button */
  --ink-2: #4A5A60;      /* secondary text */
  --ink-3: #5E6A6C;      /* captions, placeholder */
  --pick: #17303B;
  --pick-ink: #FFFCF5;
  /* accents */
  --rope: #B8792A;       /* rope fibres, focus ring, hint ring, earned marks */
  --rope-core: #E3B46A;
  --bad: #A8432F;        /* invalid trace, low clock */
  /* word colours, ink text on all of them */
  --w0: #9FD2C3; --w1: #F2C46B; --w2: #F2AA92; --w3: #B9CBEA; --w4: #CFDC92;
  /* type */
  --serif: "Young Serif", Georgia, serif;
  --sans: "Onest", system-ui, sans-serif;
  --fs-title: 44px; --fs-tile: 28px; --fs-trace: 20px; --fs-sheet: 34px; --fs-body: 15px; --fs-cap: 11px;
  /* layout */
  --tile-s: 62px; --gap: 10px; --pad-x: 20px;
  --r-tile: 14px; --r-chip: 9px; --r-ctrl: 16px; --r-sheet: 28px; --r-pill: 999px;
  --lift: 0 6px 14px rgba(23,48,59,.22);
  --sheet-shadow: 0 -12px 40px rgba(23,48,59,.18);
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --sheet-ease: cubic-bezier(.32,.72,0,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
  --t-micro: 160ms; --t-layout: 320ms; --t-fly: 520ms; --t-sheet: 420ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Theme title | Young Serif | 44px | 400 | 1 | −0.02em | Title |
| Tile letter | Young Serif | 28px | 400 | 1 | 0 | Upper |
| Live trace | Young Serif | 20px | 400 | 1 | 0.18em | Upper |
| Found chip | Young Serif | 13px | 400 | 1 | 0.08em | Upper |
| Brand | Young Serif | 20px | 400 | 1 | −0.01em | Title |
| Sheet title | Young Serif | 34px | 400 | 1.05 | −0.02em | Sentence |
| Stat value | Young Serif | 24px | 400 | 1.1 | 0, tabular | — |
| Kicker | Onest | 11px | 600 | 1.4 | 0.14em | Upper |
| Body, prompts | Onest | 14–15px | 400–500 | 1.4 | 0 | Sentence |
| Timer | Onest | 15px | 600 | 1 | 0, tabular | — |
| Buttons | Onest | 14–16px | 600 | 1 | 0 | Sentence |

## Motion

| What | Trigger | Property | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|---|
| Tile lift | joins path | transform, bg | none → `translateY(-4px) scale(1.06)`, paper → navy | 160ms `--spring` | colour only, no transform |
| Rope | pointer move | SVG `d` | redrawn per move | none | same |
| Word flight | valid release | transform | readout → chip, mid arc −26px, scale 1 → 1.08 → 0.72 | 520ms `--expo` | chip fills at once |
| Chip pop | flight lands | transform | scale .8 → 1 | 380ms `--spring` | none |
| Tile lock | valid release | background | navy → word colour | 320ms `--ease` | instant |
| Shake | invalid release | translateX | 0, −7, 6, −4, 2, 0 | 360ms `--ease` | none; tiles drop after 500ms |
| Hint ring | hint | box-shadow | ring 0 → 8px fade | 1.2s infinite | static 2.5px rope ring |
| Ghost hand | load | transform, opacity | tile 20 → tile 12 | 2.6s × 2, 600ms delay | hidden |
| Sheet | pause / finish | transform | `translate(-50%,104%)` → 0 | 420ms `--sheet-ease` | instant |
| Marks | finish | scale, rotate, opacity | 1.5 / −12° / 0 → none | 420ms spring, 260ms stagger | instant, all at once |
| Score | after marks | number | 0 → final | 700ms cubic out | final value at once |

## States

- **Idle tile:** `--tile` fill, inset 1px `--tile-line` edge plus a 2px bottom lip in the same colour.
- **On path:** navy fill, paper letter, lifted with `--lift`. A locked tile can be reused and turns navy while traced.
- **Locked:** word colour, edge `rgba(23,48,59,.12)`.
- **Hint cue:** pulsing rope ring on the start tile; letter shown in the chip's first box.
- **Invalid:** brick readout pill with white text, tile shake.
- **Low time (≤ 0:30):** timer text `--bad`.
- **Paused:** chips and grid `filter: blur(8px)`; the scrim is navy at 40%.
- **Hint disabled:** `--ink-3` text, default cursor.
- **Focus-visible:** 2.5px `--rope` outline, 3px offset on every button and the input (1px offset).

## Accessibility

- The grid is `role="application"` with an `aria-label` explaining the drag and the typed fallback; tiles are not in the tab order, the input is the keyboard path.
- Tab order: Pause, Hint, input, Check word. Enter submits. Escape toggles pause.
- A polite live region announces finds, rejections, hints ("Hint: a 6 letter word starts with A."), pause, and the final result with the score.
- Chips carry `aria-label` with length and state; the timer is `role="timer"`.
- Sheets are `role="dialog"` with `aria-modal="true"` and a labelled heading; focus moves to Resume / Next board on open and back to Pause on resume.
- Contrast: ink `#17303B` on every word colour and on paper exceeds 7:1; `--ink-3` on paper is 5.2:1. The input's edge is `#8F8574`, above 3:1 on the paper.
- Hit targets: tiles 62px, pause 44px, controls 52px, sheet buttons 54px.

## Responsive rules

- At 360 wide: tiles drop to 56px with a 9px gap (grid 316px), padding stays 20px, the Hint label stays on one line.
- Taller than 844: the extra height goes between the grid and the controls; controls stay pinned to the bottom of the column.
- At tablet width: the column stays 390px centred on paper; sheets stay 390px wide and centred.
- Pointer maths reads the grid's live rect every move, so any tile size works.

## Acceptance checklist

### Always

- [ ] Only the 8 neighbours of the last tile can join; reversing onto the second-last tile pops one.
- [ ] A tile counts as entered only within 50% of a tile size of its centre.
- [ ] Rope segments are trimmed 44% of a tile at each end and never cover a letter.
- [ ] Valid words fly to their slot and lock the traced tiles; invalid traces shake and clear.
- [ ] The typed word path finds a traceable route and locks the same tiles a drag would.
- [ ] The clock runs on rAF with a 100ms delta cap and stops while paused or finished.
- [ ] Pause blurs the board and stops the clock; Escape toggles it.
- [ ] Finish card shows marks one at a time, then the count-up, then focuses the next action.
- [ ] Closed sheets are `visibility:hidden`; `document.documentElement.scrollWidth` is 390.
- [ ] Under reduced motion: no lift, shake, flight or ghost; the game is still winnable.

### This demo

- [ ] Boards: Harbour (ANCHOR, KNOT, BUOY, MAST, TIDE), Orchard (APPLE, CIDER, PEAR, PLUM, FIG), Night sky (COMET, MOON, STAR, DUSK, ORBIT).
- [ ] First frame: Harbour, 2:31, BUOY found in coral, Hint 2.
- [ ] Score: 40 per letter, −30 per hint, +5 per second left.
- [ ] Finish title "Harbour, tied off"; loss title "3 of 5 found".

## Implementation notes

**Hit test by centre distance, not by element.** `elementFromPoint` catches corners on diagonals. Compute the cell, then require the pointer to be near its centre:

```js
function tileAt(x, y) {
  const r = grid.getBoundingClientRect(), p = pitch(), s = tileSize();
  const lx = x - r.left, ly = y - r.top, c = Math.floor(lx / p), row = Math.floor(ly / p);
  if (c < 0 || c > 4 || row < 0 || row > 4) return -1;
  const cx = c * p + s / 2, cy = row * p + s / 2;
  return Math.hypot(lx - cx, ly - cy) < s * 0.5 ? row * 5 + c : -1;
}
const adj = (a, b) => a !== b && Math.abs((a / 5 | 0) - (b / 5 | 0)) <= 1 && Math.abs(a % 5 - b % 5) <= 1;
```

**Trim the rope to the gaps.** One path, many `M…L` segments, shortened at both ends (only the start for the live finger segment):

```js
const s = tileSize() * 0.44;
for (let k = 1; k < pts.length; k++) {
  const [a, b] = [pts[k - 1], pts[k]], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  const tEnd = isFinger(k) ? 0 : s;
  if (L < s + tEnd + 2) continue;
  d += `M${a[0] + dx / L * s} ${a[1] + dy / L * s}L${b[0] - dx / L * tEnd} ${b[1] - dy / L * tEnd}`;
}
```

Draw it twice: a 3px solid core in `#E3B46A`, then 7px round-capped fibres in `#B8792A` with `stroke-dasharray: 1 9`.

**The typed fallback needs a solver.** A depth-first search over the 25 tiles returns the first path that spells the word without reusing a tile; use it to lock tiles for typed words and to place the hint ring. Common mistake: accepting any typed word in the list without checking it can be traced.

Generate boards so that each word sits on its own tiles (no shared tiles) and fill the rest with letters that spell nothing on the theme; check every word has at least one path before shipping a board.
