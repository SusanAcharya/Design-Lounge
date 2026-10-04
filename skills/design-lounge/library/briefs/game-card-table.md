<!-- Design Lounge Nº 493 · "Linnet pairs table" · designlounge.vercel.app -->

# Linnet pairs table

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A finished game of pairs on a walnut-framed felt table for Linnet, a fictional card parlour. Sixteen cards, eight faces, drawn in SVG. The first frame is the deal face down, ready to play: "0 moves" and "Find the pairs." Click or keyboard-activate two cards. A match stays face up with a brick inset. A miss waits 700ms and turns both back. Each attempt counts as one move, counted when the second card turns. When all eight pairs are up, the rail reads "All paired in N moves." Restart deals again. Arrow keys move a cursor across the grid. The table is paper and felt: cream cards, a green cloth, a walnut surround. It is not a CRT, not a scanline, and not a pixel cabinet.

The detail worth copying is the cursor. It is real focus on the card button, moved with arrows, and it does not flip the card. Enter and Space flip, because the card is a button.

## Structure

```
1280 x 800
┌ Walnut #3E2A1E, padding 16px ─────────────────────────────────────────┐
│ ┌ Rail #F4EBDA, height 72px ────────────────────────────────────────┐ │
│ │ Linnet          0 moves     Find the pairs.          [ RESTART ]  │ │
│ │ PAIRS                                                             │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│ ┌ Felt, radial green ───────────────────────────────────────────────┐ │
│ │                                                                   │ │
│ │     [back] [back] [back] [back]     card 156 x 156, gap 14       │ │
│ │     [back] [back] [back] [back]                                   │ │
│ │     [back] [back] [back] [back]     grid 4*156 + 3*14 = 666      │ │
│ │     [back] [back] [back] [back]                                   │ │
│ │                                                                   │ │
│ └───────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
```

- `.shell` is a column, height 100%, padding 16px, ground `--walnut`.
- `header.rail`: `h1.brand` (italic name plus a span "Pairs"), `p#moves`, `p#note`, `#restart`.
- `.felt` centres `.grid[role=grid]` with `aria-label="Pair cards"`.
- Four `div.row[role=row]`. Each holds four `button.card[role=gridcell]`.
- A card's inner span holds `.back` (always the same bird mark) and `.front` (the face SVG).
- `p#live`, visually hidden, `aria-live="polite"`. The visible note is not a live region, except that the win sentence is copied into the live region as well.

## Motion

| Thing | Trigger | Property | From | To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Card turn | class `up` added or removed | transform rotateY on `.inner` | 0deg | 180deg, or back | 280ms | cubic-bezier(0.2, 0.7, 0.2, 1) | transition none, face still changes |
| Miss | second card differs | class `up` removed | face up | face down | after 700ms | n/a | same 700ms wait, then instant |

The flip uses `transform-style: preserve-3d` and `backface-visibility: hidden`. The front is pre-rotated 180deg so it reads correctly when the inner hits 180deg. No looping animation. No particle burst on the win. The win is a sentence.

## States

- Card back: cream stock, 12px fold in the top-left via a 135deg gradient of `--fold`, inset rules at 1px and 9px in `--line` with an 8px cream band between them, and a 36px bird mark in `--brick` centred.
- Card face: cream stock, 1px `--line` inset, 72px stroke icon in `--ink`, centred. Stroke width 1.75, round caps and joins, fill none.
- Card, face up: `.inner` at `rotateY(180deg)`.
- Card, matched: face keeps the up transform and gains `box-shadow: inset 0 0 0 2px var(--brick)`. Cursor becomes default.
- Card, locked miss: both cards stay up, pointer input returns early while `lock` is true.
- Card, focus-visible: 2px `--ring` outline, offset 3px. This outline is the cursor. It sits on the felt, so the gold has to stay light.
- Restart, rest: height 44px, padding 0 18px, 1px `--ink` border, transparent ground.
- Restart, hover: ground `--ink`, type `--card`.
- Note, playing: "Find the pairs."
- Note, won: "All paired in N moves." The grid does not unmount.
- First card in the deal is the only `tabindex="0"` card.

Face paths, viewBox 0 0 24 24:

| Face | Path |
| --- | --- |
| Moon | `M15 4a7 7 0 1 0 4.8 12.2A6 6 0 0 1 15 4z` |
| Leaf | `M5 19C6 11 12 5 20 4 19 13 13 19 5 19z` plus `M9 15c2-2 5-4 8-6` |
| Ring | circles at 12,12 with r 6.5 and r 2 |
| Peak | `M3 18l6.2-11 3.2 5.2L16 8l5 10z` |
| Wave | `M3 15c2-3 4-3 6 0s4 3 6 0 4-3 6 0` plus `M3 9c2-3 4-3 6 0s4 3 6 0 4-3 6 0` |
| Key | circle 8,10 r 3.2 plus `M11 10.2H20l-1.6 2.2M17.2 10.2v2.6` |
| Bell | `M6.5 16.5c.4-4.6 2.2-8 5.5-8s5.1 3.4 5.5 8z` plus `M10 16.6a2 2 0 0 0 4 0M5 16.5h14` |
| Seed | ellipse 12,12 rx 4.5 ry 7 plus `M12 5.2v13.6` |

Back mark, one path: `M5 15c3-.6 5-5 7-9 1.2 3.4 4 6.2 8 7.2-3.2.8-5.6 1.2-7.4 3.4C11 14.6 8.4 14 5 15z`.

## Accessibility

- The grid is `role="grid"` with `aria-label="Pair cards"`. Each row is `role="row"`. Each card is a `button` with `role="gridcell"`, `aria-rowindex` (1 to 4), and `aria-colindex` (1 to 4).
- Face-down accessible name: "Face down card". Face-up: "{Moon|Leaf|Ring|Peak|Wave|Key|Bell|Seed}, face up". Also set `aria-pressed` to match. Do not put the face name on a face-down card, or the game speaks the answer.
- Arrow keys move focus. They do not activate. Enter and Space activate because the control is a button. Document that in the rail only by the visible moves and the note. A separate hint is not required.
- One polite live region speaks the turned face, "No match.", "{Face} paired.", the win sentence, and "New deal. Cards are face down."
- Do not `disabled` the matched buttons. A disabled button drops out of the tab and arrow order, and the cursor could not cross the grid. Ignore clicks in script instead.
- Icons are `aria-hidden="true"`. The button name carries the meaning.
- Contrast: ink `#1C1915` on cream `#F4EBDA` is above 12:1. Cream on felt `#1E4A38` is about 6.4:1, which covers the rail if any cream type were on the cloth. Rail type is ink on cream. The gold ring is a focus indicator on the cloth, not body text.
- Hit targets: each card is 156px square. Restart is 44px tall.
- `prefers-reduced-motion: reduce` sets animation and transition to none. Turns are instant. The 700ms miss delay still happens so the player can see both faces.

## Responsive rules

- At 1280 and above: cards 156px, gap 14px, rail 72px on one line, page `overflow: hidden`. The grid is 666px square, centred on the felt. Side cloth is intentional.
- 761px to 1100px: cards 120px, face icons 56px. Rail stays one line.
- Below 760px: the page may scroll. The rail wraps (`flex-wrap`, min-height 72px, padding 12px 16px). The grid is width 100% with 16px padding and 8px gaps. Each row is four `minmax(0, 1fr)` tracks. Cards are `width: 100%`, `aspect-ratio: 1`. Arrow movement still uses the 4 by 4 index, not the pixel size.
- Do not collapse to a 2 column grid. The game is 4 by 4 at every width.

## Acceptance checklist

### Always

- [ ] First frame is a face-down 4 by 4, with a move count of 0 and a note that play can start. No title gate in front of the table.
- [ ] Turning the second card increments the move count by 1. A match stays up. A miss turns both down after 700ms.
- [ ] Input is ignored while a miss is showing. Matched cards do not turn down and do not accept another flip.
- [ ] The win sentence includes the move count and uses "move" only when the count is 1.
- [ ] Restart clears the timer, reshuffles, resets the count and the note, and focuses the first card.
- [ ] Arrow keys move a visible cursor one cell and stop at the edges. Enter and Space flip the focused card.
- [ ] Faces are inline SVG or CSS. No image files, no emoji.
- [ ] Focus-visible is a 2px gold ring. Cards are at least 44px. At the 1280 frame they are 156px.
- [ ] `prefers-reduced-motion: reduce` removes the rotate transition. The cards still turn and the win still names the moves.
- [ ] No sideways page scroll at 1280.

### This demo

- [ ] The parlour is Linnet. The eyebrow is "Pairs". The opening note is "Find the pairs."
- [ ] Seed 20261004 deals, in order: Key, Leaf, Bell, Wave, Moon, Moon, Leaf, Bell, Ring, Seed, Peak, Peak, Ring, Key, Seed, Wave.
- [ ] Moon is adjacent at row 2 columns 1 and 2. Peak is adjacent at row 3 columns 3 and 4. Playing only true pairs from this deal wins in 8 moves: "All paired in 8 moves."
- [ ] Restart uses seed 20261005 and a different order. The live text is "New deal. Cards are face down."
- [ ] Miss copy is "No match." Match copy is "{Face} paired."
- [ ] Palette is walnut `#3E2A1E`, felt `#1E4A38`, card `#F4EBDA`, brick `#8C3A2F`. Type is Libre Baskerville and Source Sans 3.
- [ ] The back mark is the bird path above, in brick, on every card. Fronts use the eight paths above, in ink.

### Seeded pairs

Indexes are 0 to 15, row-major. A perfect game turns these eight couples and nothing else:

| Pair | Indexes | Where |
| --- | --- | --- |
| Moon | 4 and 5 | row 2, columns 1 and 2 |
| Peak | 10 and 11 | row 3, columns 3 and 4 |
| Leaf | 1 and 6 | row 1 column 2, row 2 column 3 |
| Bell | 2 and 7 | row 1 column 3, row 2 column 4 |
| Key | 0 and 13 | row 1 column 1, row 4 column 2 |
| Wave | 3 and 15 | row 1 column 4, row 4 column 4 |
| Ring | 8 and 12 | row 3 column 1, row 4 column 1 |
| Seed | 9 and 14 | row 3 column 2, row 4 column 3 |

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: walnut page, 16px inset, cream rail 72px, felt filling the rest. Rail: "Linnet" in italic, small "Pairs", "0 moves", note "Find the pairs.", button "Restart". All 16 cards show their backs. None have the face-up class. No win sentence. The first card (row 1, column 1) has `tabindex="0"`. The other cards have `tabindex="-1"`.
2. The first deal uses seed `20261004` and the shuffle in the implementation notes. Reading order, row by row: Key, Leaf, Bell, Wave / Moon, Moon, Leaf, Bell / Ring, Seed, Peak, Peak / Ring, Key, Seed, Wave. Faces are hidden until turned, including from the accessible name.
3. Pointer: click a face-down card. It turns. Its accessible name becomes "{Face}, face up". The live region speaks the face name, for example "Moon". Click a second card. Moves becomes "1 move" on the first attempt and "N moves" after that.
4. If the two faces differ, the live region says "No match." Both stay up for 700ms, then turn down. Their names return to "Face down card". Further clicks are ignored while that lock is held.
5. If the two faces match, both keep the face-up class and gain a matched class (2px brick inset on the face). The live region says "{Face} paired." The lock is not held. A matched card ignores later clicks because it is already up.
6. Clicking the already-up card does nothing. Clicking a third card while two unmatched cards are showing does nothing.
7. When the eighth pair matches, the note and the live region become "All paired in N moves." with "move" when N is 1 and "moves" otherwise. The cards stay up. The moves figure stays at N. A perfect reading of the seeded deal is 8 moves if the player never misses. Any miss raises the count.
8. Restart increments the seed by 1, shuffles again, clears any pending 700ms timer, turns every card down, sets moves to 0, sets the note back to "Find the pairs.", announces "New deal. Cards are face down.", and moves focus to row 1 column 1. The second deal is not the same layout as the first.
9. Keyboard: ArrowLeft, ArrowRight, ArrowUp, ArrowDown move the roving tabindex by one cell. The move stops at the edge. It does not wrap. It does not flip. Prevent default so the page does not scroll. Enter or Space on the focused card flips it (native button activation). After a click, that card becomes the tabindex 0 cell so arrows continue from it.
10. Focus ring is the cursor: 2px `#F3E2A0`, offset 3px, on `:focus-visible`.
11. Do not use images, a sprite sheet, localStorage, cookies, alert, console.log, or document.write.

## Tokens

```css
:root {
  --walnut: #3E2A1E;    /* page frame */
  --felt-0: #2A6A50;    /* radial highlight */
  --felt: #1E4A38;      /* cloth mid */
  --felt-2: #173E2F;    /* cloth edge */
  --card: #F4EBDA;      /* rail and card stock */
  --fold: #E7D7BC;      /* back corner fold */
  --ink: #1C1915;       /* type and face stroke */
  --muted: #5C4E3E;     /* "Pairs" label */
  --line: #C4B49A;      /* card rule */
  --brick: #8C3A2F;     /* bird mark, matched inset */
  --ring: #F3E2A0;      /* keyboard cursor */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --card-size: 156px;
  --gap: 14px;
  --rail-h: 72px;
  --frame: 16px;
  --dur-flip: 280ms;
  --dur-miss: 700ms;
}
```

Felt background, one gradient, no texture image:

```css
background: radial-gradient(ellipse at 50% 42%, var(--felt-0) 0%, var(--felt) 58%, var(--felt-2) 100%);
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Libre Baskerville italic | 26px | 400 | 1 | -0.02em | Sentence |
| Eyebrow | Source Sans 3 | 12px | 600 | 1.2 | 0.16em | Uppercase |
| Moves | Source Sans 3 | 18px | 600 | 1 | 0 | Sentence, tabular nums, min-width 92px |
| Note, including the win line | Libre Baskerville | 18px | 400 | 1.3 | 0 | Sentence |
| Restart | Source Sans 3 | 15px | 600 | 1 | 0.06em | Uppercase |

Faces have no captions. The drawing is the only sighted clue. Fallback: "Libre Baskerville", Georgia, serif. "Source Sans 3", "Avenir Next", sans-serif.

## Implementation notes

**Shuffle with a known seed so the first frame is stable.** `mulberry32(20261004)` then Fisher-Yates. Restart does `seed += 1` before dealing. Do not use `Math.random` for the first deal.

```js
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shuffle(s) {
  var deck = FACES.concat(FACES);
  var rand = mulberry32(s);
  for (var i = deck.length - 1; i > 0; i--) {
    var j = Math.floor(rand() * (i + 1));
    var tmp = deck[i]; deck[i] = deck[j]; deck[j] = tmp;
  }
  return deck;
}
```

**Lock the miss, and let restart invalidate the timer.** A generation token beats a race where the timeout fires after a new deal and turns the new cards down.

```js
function flip(btn) {
  if (lock || btn.classList.contains('up')) return;
  btn.classList.add('up');
  open.push(btn);
  if (open.length < 2) return;
  moves += 1;
  var a = open[0], b = open[1];
  if (a.dataset.face === b.dataset.face) {
    a.classList.add('matched'); b.classList.add('matched'); open = [];
    if (matched === 8) note.textContent = 'All paired in ' + moves + ' moves.';
  } else {
    lock = true; var mine = ++token;
    setTimeout(function () {
      if (mine !== token) return;
      a.classList.remove('up'); b.classList.remove('up');
      open = []; lock = false;
    }, 700);
  }
}
```

The snippet omits the live region and the singular "move". Keep those. Common mistake: counting a move on the first card, so a player who peeks once already has a score. Count when the second card turns.

**Cursor.** Roving tabindex on the buttons. Arrows compute the next row and column and bail at the edge.

```js
grid.addEventListener('keydown', function (e) {
  var step = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
  if (!step) return;
  e.preventDefault();
  var i = cards().indexOf(document.activeElement);
  var r = Math.floor(i / 4) + step[0];
  var c = (i % 4) + step[1];
  if (r < 0 || r > 3 || c < 0 || c > 3) return;
  focusAt(r * 4 + c).focus();
});
```

Common mistake: `disabled` on matched cards, which removes them from the arrow path, or flipping on ArrowRight. Also avoid a separate cursor `div` that can drift from focus.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
