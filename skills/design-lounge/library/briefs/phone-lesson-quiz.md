<!-- Design Lounge Nº 478 · "Word-bank lesson card" · www.designlounge.live -->

# Word-bank lesson card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

One lesson card from Burrow, a fictional language app teaching Spanish. A coral mascot says an English sentence in a speech bubble. The learner taps word tiles in a bank to build the Spanish on a two-line ruled answer area. Tiles fly from the bank to the line and back. Each leaves a sunken slot behind, so the bank never reflows. Check becomes a green banner when right or a coral banner when wrong. A miss costs a heart. The style is clay: cream paper, chunky rounded type, and tiles with a 4px darker bottom edge that squashes when pressed. The detail worth copying is the empty slot. It keeps every tile where the learner's eye last saw it.

## Structure

```
390 × 844 frame, cream, 54px top clearance
┌──────────────────────────────────────┐
│ ×  [██████████░░░░░░]  flame 13  heart 5 │ 44px row: close, 18px bar, flame, heart
│                                      │
│ UNIT 4 · GETTING AROUND              │ 13px eyebrow, coral
│ Translate this sentence              │ 26px heading
│ ┌───┐ ╭───────────────────────────╮  │
│ │o o│◁│ Where is the bus stop?    │  │ mascot 76×84 + bubble
│ └───┘ ╰───────────────────────────╯  │
│ [Dónde] [está]                       │ answer area, 2 ruled lines
│ ──────────────────────────────────── │ at 58px and 116px
│                                      │
│ ──────────────────────────────────── │
│     [autobús] [     ] [el]           │ word bank, centred
│  [      ] [parada] [tren] [la]       │ tiles 50px, gap 10
│        [de] [es]                     │
│                                      │
│ ╭──────────────────────────────────╮ │ footer, banner rises above it
│ │             CHECK                │ │ 56px button
│ ╰──────────────────────────────────╯ │ 34px bottom clearance
└──────────────────────────────────────┘
```


- Header: a close `button` labelled "Quit lesson", a `div role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="10"`, `aria-valuenow`, and two status spans with `aria-label`s ("13 day streak", "5 hearts").
- Main: an eyebrow `span`, the `h1`, and a prompt row with an `aria-hidden` mascot `svg` and the sentence in a `p`.
- Answer area: `div role="group"` labelled "Your answer". Tiles are `button`s labelled "<word>, in answer, tap to remove".
- Bank: `div role="group"` labelled "Word bank". Each tile is a `button` inside a `span.slot`. The slot has the sunken colour and takes the tile's size.
- Footer: `position: relative; z-index: 4`. It holds the result block (absolutely placed above it) and one button that is Check, Continue, or Got it.
- Live region: a visually hidden `p aria-live="assertive"`.
- End screen: a fixed `section` labelled by its heading, `aria-hidden` until shown.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Tile to answer | tap in bank | transform | slot offset → 0 | 360ms | `--boing` | instant |
| Tile to bank | tap in answer | transform | answer offset → 0 | 360ms | `--boing` | instant |
| Answer reflow | a tile leaves | transform | old offset → 0 | 260ms | `--boing` | instant |
| Tile press | pointer down | bottom border, margin-top | 4px, 0 → 2px, 2px | instant | none | same |
| Banner | Check | translateY, opacity | 24px, 0 → 0, 1 | 380ms | `--boing` | instant |
| Footer colour | Check | background | cream → banner colour | instant | none | same |
| Progress bar | Check | width | n×10% → (n+1)×10% | 600ms | `--boing` | 1ms |
| Heart shake | wrong | translateX, rotate | ±4px, ±8° → 0 | 500ms | `--std` | removed |
| End screen | last Continue | opacity | 0 → 1 | 300ms | `--std` | 1ms |
| End flame | end screen | scale, rotate | 0.4, -8° → 1.08, 3° → 1, 0 | 900ms | `--boing` | removed |

Tiles move with the FLIP method: measure the start, move the element in the DOM, measure the end, then animate the difference back to zero. Raise the moving tile to `z-index: 3` while it flies.

## States

- Tile resting: `--card`, 2px `--line` border, 4px `--line2` bottom border, radius 14px, 50px tall, 16px side padding.
- Tile hover: background `#fff`.
- Tile pressed: bottom border 2px and margin-top 2px, so the row height does not change and the tile looks pushed in.
- Tile gone from bank: `visibility: hidden`, `tabindex="-1"`, `aria-hidden="true"`. The slot shows `--well` at the same size.
- Tiles locked after Check: `pointer-events: none` on both groups.
- Check disabled: `#ede3d1` fill, `#8f8069` text, `#dccfb8` bottom edge.
- Check enabled: grass fill, 4px `--grass-dk` bottom edge. Pressed: bottom edge 2px and translateY 2px.
- Right: footer and banner `--ok-bg`, badge is a white 40px circle with a 3.2px green tick, button stays grass and reads CONTINUE.
- Wrong: footer and banner `--no-bg`, cross badge, button coral with `--coral-dk` edge, reads GOT IT.
- Hearts at 0: end screen "Out of hearts".
- Focus-visible: 3px `#2f6fdb` outline, 3px offset. Blue is outside the palette on purpose, so focus never reads as right or wrong.

## Accessibility

- Every tile is a real `button`. Enter or Space places or removes it.
- When a tile is placed by keyboard, focus moves to the next free bank tile, then to Check when the bank is empty. When a tile is removed by keyboard, focus moves to its neighbour on the line, or back to the tile. Mouse and touch taps do not move focus. Detect keyboard clicks with `event.detail === 0`.
- Answer tiles say what tapping does: "parada, in answer, tap to remove".
- The live region is assertive and reads the result once: "Correct. ¿Dónde está la parada de autobús?" or "Incorrect. Correct answer: ¿Dónde está la parada de autobús? You lost a heart. 4 left."
- The progress bar updates `aria-valuenow`. The streak and heart spans update their `aria-label`s.
- On the end screen focus moves to the button, and the live region reads the summary.
- Colour is never the only signal. Banners have a title, a badge shape (tick or cross), and a label.
- Contrast: `--on-grass` `#0f2e05` on `#5bc236` is above 7:1. `--ok-ink` on `--ok-bg` and `--no-ink` on `--no-bg` are both above 4.5:1. `--ink2` on cream is above 5:1. Do not put white text on the bright green. It fails.
- Hit targets: tiles 50px tall, buttons 56px, close button 44px.

## Responsive rules

- At 390 × 844 everything fits with room under the bank.
- At heights of 800px or less the mascot shrinks to 60 × 66, the heading to 23px, the prompt to 18px, and the answer margins to 12px and 14px.
- At 360 wide the bank wraps to three rows and stays centred. The prompt may wrap to two lines. No horizontal scroll.
- The banner is absolutely placed above the footer, so showing it never changes the layout above. It covers the bottom of the bank, which is locked by then.
- On tablet, cap the card at 560px wide and centre it. Keep the footer full width with the button capped at 560px.
- Do not draw a status bar. Top clearance max(54px, env(safe-area-inset-top)), footer bottom max(34px, env(safe-area-inset-bottom)).

## Acceptance checklist

### Always

- [ ] Tiles move between bank and answer with a FLIP animation, both ways.
- [ ] A placed tile leaves a same-size sunken slot. The bank never reflows.
- [ ] Removing a tile from the middle of the answer slides the rest left.
- [ ] Every tile has a 4px darker bottom edge that squashes to 2px when pressed, without moving the row.
- [ ] Check is disabled with an empty answer line.
- [ ] Check becomes a right or wrong banner with a title, badge, label, and the correct sentence, and the same button continues.
- [ ] A wrong answer costs one heart and shakes the heart. Zero hearts ends the lesson.
- [ ] The streak flame is inline SVG, not an emoji.
- [ ] Results are announced in an assertive live region.
- [ ] Keyboard placement moves focus forward. Mouse taps do not.
- [ ] Reduced motion removes flight, shake, and the flame pop, and the lesson still works.

### This demo

- [ ] The first prompt is "Where is the bus stop?" with "Dónde" and "está" already placed.
- [ ] The bank for question 1 is: autobús, está, el, Dónde, parada, tren, la, de, es.
- [ ] Progress starts at 60%. Streak 13, hearts 5.
- [ ] The four questions are the bus stop, a ticket, the nine o'clock train, and "Is it far from here?".
- [ ] A full right run ends on 14, +40 XP, 100%.
- [ ] Right titles cycle: "Nice one!", "Spot on!", "Exactly right!", "You nailed it!". Wrong title is "Not quite".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: question 1 of 4, "Where is the bus stop?". "Dónde" and "está" are already on the answer line, and their bank slots are empty. Progress is 6 of 10 (60%). Streak 13, hearts 5. Check is enabled.
2. Tap a bank tile. It flies along the path from its slot to the end of the answer line in 360ms with a small overshoot. Its slot stays as a sunken shape of the same size.
3. Tap a tile on the answer line. It flies back to its own slot. The tiles after it slide left to close the gap in 260ms.
4. Check is disabled when the answer line is empty. The label is CHECK.
5. Tap Check with the right words in the right order. Compare words without case. The tiles lock. A green banner rises 24px from behind the footer over the bottom of the bank: a check badge, "Nice one!", the label MEANING, and "¿Dónde está la parada de autobús?". The button turns into CONTINUE. Progress grows by 10%.
6. Tap Check with a wrong answer. A coral banner rises: a cross badge, "Not quite", the label CORRECT ANSWER, and the correct sentence. The heart counter drops by one and the heart shakes for 500ms. The button turns coral and reads GOT IT. Progress still grows by 10%.
7. Continue loads the next question with an empty answer line and a full bank.
8. After question 4, the end screen fades in: a 132px flame pops in from 40% scale, the streak number reads 14, "Day streak!", "Lesson complete. Come back tomorrow to make it 15.", a week row with Monday to Saturday ticked and Saturday ringed, then two cards: Total XP (+10 per right answer) and Accuracy (right ÷ answered). The header flame also reads 14.
9. If hearts reach 0, Continue goes to the end screen titled "Out of hearts". The streak stays at 13 and the button reads TRY AGAIN.
10. The end button resets everything to the first frame.

## Tokens

```css
:root {
  --bg: #fbf4e6;          /* cream page */
  --card: #fffdf7;        /* tiles, bubble, cards */
  --well: #efe5d3;        /* empty slot, empty week day */
  --line: #e5d8c1;        /* tile border, ruled lines */
  --line2: #d6c5a8;       /* tile bottom edge */
  --ink: #3a2e22;         /* warm brown, never black */
  --ink2: #76664f;

  --grass: #5bc236;       /* check button, progress */
  --grass-dk: #3e9a1c;    /* its bottom edge */
  --on-grass: #0f2e05;
  --ok-bg: #ddf5c8;       /* right banner */
  --ok-ink: #2a730d;

  --coral: #ff7a59;       /* wrong button, mascot */
  --coral-dk: #d9573a;    /* its bottom edge, eyebrow */
  --on-coral: #3d0f04;
  --no-bg: #ffe3da;       /* wrong banner */
  --no-ink: #ad371c;

  --flame: #ff9a1f; --flame-in: #ffd23f; --flame-ink: #b35400;
  --heart: #ff5a4e;
  --focus: #2f6fdb;

  --round: "Fredoka", system-ui, sans-serif;
  --sans: "Nunito", system-ui, sans-serif;

  --tile-h: 50px;         /* includes 2px top border and 4px bottom border */
  --r-tile: 14px; --r-btn: 16px; --r-bubble: 18px; --r-card: 18px; --r-banner: 24px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px;

  --boing: cubic-bezier(.34, 1.36, .64, 1);   /* overshoot for tiles, banner, bar */
  --std: cubic-bezier(.2, .7, .2, 1);
  --dur-fly: 360ms; --dur-shift: 260ms; --dur-banner: 380ms; --dur-bar: 600ms;
}
```

## Typography

| Role | Family | Size | Weight | Tracking | Case | Colour |
| --- | --- | --- | --- | --- | --- | --- |
| Heading | Fredoka | 26px, line-height 1.1 | 700 | 0 | sentence | `--ink` |
| Prompt | Fredoka | 20px, line-height 1.25 | 500 | 0 | sentence | `--ink` |
| Tile | Fredoka | 19px | 500 | 0 | as written | `--ink` |
| Button | Fredoka | 18px | 700 | 0.06em | upper | `--on-grass` or `--on-coral` |
| Banner title | Fredoka | 22px | 700 | 0 | sentence | `--ok-ink` or `--no-ink` |
| Streak / hearts | Fredoka | 18px | 700 | 0 | | `--flame-ink`, `--heart` |
| End number | Fredoka | 84px, line-height 0.9 | 700 | 0 | | `--flame-ink` |
| Eyebrow | Nunito | 13px | 900 | 0.08em | upper | `--coral-dk` |
| Banner label | Nunito | 13px | 900 | 0.04em | upper | banner ink |
| Banner sentence | Nunito | 16px | 700 | 0 | sentence | banner ink |
| Body | Nunito | 16px | 700 | 0 | sentence | `--ink2` |

Keep the Spanish accents and the opening ¿ in both fonts. Both families include them.

## Implementation notes

**FLIP for a tile leaving the bank.**

```js
function place(i) {
  const src = bankTile(i), from = src.getBoundingClientRect();
  src.classList.add('gone'); src.tabIndex = -1; src.setAttribute('aria-hidden', 'true');
  const t = makeTile(i, src.textContent); answer.append(t);
  fly(t, from);
}
function fly(el, from, ms = 360) {
  if (reduced.matches) return;
  const to = el.getBoundingClientRect(), dx = from.left - to.left, dy = from.top - to.top;
  if (!dx && !dy) return;
  el.classList.add('fly');
  el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }],
    { duration: ms, easing: 'cubic-bezier(.34,1.36,.64,1)' }).onfinish = () => el.classList.remove('fly');
}
```

For removal, record the rects of every answer tile first, remove the tile, show its bank twin, then call `fly` on the twin and on each remaining answer tile with its old rect.

**The clay tile.** The darker edge is a real bottom border. The press moves the border into a top margin so the row height holds.

```css
.slot { display: inline-block; border-radius: 14px; background: var(--well); }
.tile { height: 50px; padding: 0 16px; border-radius: 14px; background: var(--card);
  border: 2px solid var(--line); border-bottom: 4px solid var(--line2); }
.tile:active { border-bottom-width: 2px; margin-top: 2px; }
.tile.gone { visibility: hidden; }
```

**The banner over the content.** Place the result block above the footer and let it inherit the footer's colour, so the two read as one sheet.

```css
.ft { position: relative; z-index: 4; }
.res { display: none; position: absolute; left: 0; right: 0; bottom: 100%;
  padding: 18px 20px 6px; background: inherit; border-radius: 24px 24px 0 0; }
.ft[data-s="right"] { background: var(--ok-bg); }
.ft[data-s="wrong"] { background: var(--no-bg); }
.ft[data-s="right"] .res, .ft[data-s="wrong"] .res { display: flex; animation: rise .38s var(--boing); }
```

Common mistakes:

- Removing the bank tile from the DOM. The bank reflows and every tile jumps.
- Footer without `z-index`. The tiles are `position: relative`, so they paint over it.
- Growing the footer to fit the banner. The whole lesson shifts up.
- White text on bright green.
- An emoji flame or heart. Both are two-path SVGs with a highlight.
- Comparing with punctuation. Compare the word list, then show the full sentence with ¿ and ? in the banner.
- Moving focus on every mouse tap. The ring jumps around for pointer users.

Rebuild order:

1. Lay out the header, prompt, ruled answer area, bank, and footer.
2. Render a question from data, with the pre-placed tiles.
3. Add place and remove with FLIP.
4. Add Check, the two banners, hearts, and progress.
5. Add Continue and the four questions.
6. Add the end screen and the out-of-hearts branch.
7. Add keyboard focus rules and the live region.
8. Test at 360 × 780 and with reduced motion.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
