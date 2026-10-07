---
title: "Sticker board"
summary: "A cork-framed kraft board of six paper notes, taped or pinned, beside a sticker sheet: click a sticker and it pops onto the board at its spot with a spring; click again to peel it off."
platform: web
type: section
category: profile
tags: [scrapbook, stickers, board, notes, personal]
styles: [paper, playful]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-07
palette: ["#C9A97C", "#FBF6EC", "#2B2118", "#D9442B", "#2F6F8F", "#E0A300"]
fonts: ["Caveat", "Inter"]
related: [collage-hero, taped-photo-grid, card-sticky-notepad]
---

# Sticker board

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. Stickers are decoration; any icon that means something stays a real icon.

## What it is

A personal "this month" board for Mira, a fictional bookbinder. Left: a 640px-tall kraft board with a 10px wooden frame, carrying six paper notes placed by hand (absolute positions, rotations between -3° and 3°), each held by a tape strip or a red pin: This month, Reading (with one title struck through), Shows, Buy, a yellow Call Amma note, and Done. Headings are Caveat; the lists and sentences are the sans. Right: a sticker sheet on dashed paper with six stickers drawn as inline SVG with a white die-cut edge: a star, a Done badge, a heart, a NEW label, a sun and an arrow. Clicking a sticker presses it (`aria-pressed`) and pops a copy onto the board at that sticker's own spot and angle, scaling from 0 with a 360ms overshoot; clicking it again peels it off. A live count says how many are stuck on, and a paper button peels them all. The detail worth copying is that the board is a static composition and the stickers are the only moving part, so it stays a page, not a toy.

## Reference behaviour

1. First frame: the board with six notes, the sheet with six stickers (none pressed), "0 stuck on", the button "Peel them all off".
2. Click a sticker: its button shows pressed (a blue inset ring, the art at 45%); a copy appears on the board at its spot (e.g. the star at 280,0 rotated 14° at 80px; the arrow at 280,500 rotated -20° at 110px), scaling 0 → 1 over 360ms with an overshoot; the count updates.
3. Click a pressed sticker: the copy is removed; the button returns; the count updates.
4. "Peel them all off": every copy is removed and every button unpressed.
5. Hover a sticker in the sheet: it scales 1.08 and tilts -4°.
6. The notes never move. Nothing animates on load. Reduced motion: stickers appear without the pop.

## Structure

```
1280 × 800, board #C9A97C
wrap max 1200, padding 30/40, grid minmax(0,1fr) | 300px, gap 36
┌ board 640 tall, 10px frame #8F7047 ─────────────────────────────┐  STICKER SHEET
│ ┌ This month, 280w, -3°, tape ┐  ┌ Reading, 250w, 2°, pin ┐      │  Stick one on  36 Caveat
│ │ heading 26 Caveat           │  │ · The Glass Hotel      │ [NEW]│  sentence 13px
│ │ sentence 14 Inter           │  │ · ~~Blue Nights~~      │      │  ┌ tray, paper, dashed ─┐
│ └─────────────────────────────┘  └────────────────────────┘      │  │ ★   ✓   ♥            │
│   [★]        ┌ Call Amma, 200w, yellow ┐                        │  │ NEW  ☼   ↗           │
│ ┌ Shows, 300w, -1°, tape ┐  ┌ Buy, 230w, 3°, pin ┐  [✓]         │  └──────────────────────┘
│ │ …                      │  │ · Bone folder      │               │  3 stuck on  (Caveat 22, blue)
│ └────────────────────────┘  └────────────────────┘  ┌ Done ─┐    │  [Peel them all off]
│   [↗]                                     [☼]       └───────┘    │
└──────────────────────────────────────────────────────────────────┘
```

- `main.wrap` → `div.board[aria-label]` (six `article.card.cN` with optional `span.tape` or the `.pin` class, and `div#stuck` for copies) and `aside.sheet` (`h1` with a `small` kicker, `p`, `div.tray[role=group]` of six `button.sk[aria-pressed][data-id][aria-label]`, `span.count[aria-live]`, `button.clear`).
- A stuck copy is `span.stuck[aria-hidden][data-id]` positioned by inline `left`, `top`, `--rot` and `--s`.

## Tokens

```css
:root {
  --board: #c9a97c;  --paper: #fbf6ec;  --paper-2: #efe2c8;  --frame: #8f7047;  --frame-2: #5e4a2e;
  --ink: #2b2118;  --ink-2: #4a3a2a;  --ink-3: #4d3d2c;  --line: #b08f62;
  --red: #d9442b;  --blue: #1d4560;  --yellow: #e0a300;  --green: #3f7a4a;  --note-yellow: #fff3b0;
  --tape: rgba(255,250,230,.6);
  --hand: "Caveat", cursive;  --sans: "Inter", system-ui, sans-serif;
  --r: 4px;  --shadow: 0 8px 20px -10px rgba(43,33,24,.45);
  --t-micro: 200ms;  --t-pop: 360ms;
  --ease: cubic-bezier(.2,.7,.2,1);  --pop: cubic-bezier(.34,1.56,.64,1);   /* the overshoot */
}
/* sticker spots: id → left, top, rotation, size */
/* star 280,0,14°,80 · done 640,230,-10°,92 · heart 300,250,8°,76 · new 500,14,-6°,96 · sun 640,520,0°,90 · arrow 280,500,-20°,110 */
/* notes: c1 28,30 270w -3° · c2 320,60 230w 2° · c3 40,330 290w -1° · c4 350,360 200w 3° · c5 565,40 190w -2° · c6 560,390 195w 1° (inside a 764 × 620 board) */
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Sheet title | Caveat | 36px | 700 | 1 | 0 | as written |
| Note heading | Caveat | 26px | 700 | 1 | 0 | sentence |
| Count | Caveat | 22px | 700 | 1 | 0 | `--blue` |
| Note text, list | Inter | 14px | 400 | 1.5 | 0 | sentence, `--ink-2`; struck items `--ink-3` |
| Sheet sentence | Inter | 13px | 400 | 1.5 | 0 | `--ink-2` |
| Kicker | Inter | 12px | 600 | 1 | +0.12em | UPPERCASE, `--ink-3` |
| Button | Inter | 13px | 600 | 1 | 0 | sentence |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---:|---|
| `.stuck` | added | transform | `rotate(r) scale(0)` → `rotate(r) scale(1)` | 360ms | `--pop` (overshoot) |
| `.sk` | hover | transform | none → `scale(1.08) rotate(-4deg)` | 200ms | `--ease` |
| `.sk` | press | background, box-shadow | none → `--paper-2`, 2px inset blue ring | 200ms | `--ease` |
| `.clear` | hover | transform, box-shadow | 0, `3px 3px 0` → `translate(2px,2px)`, `1px 1px 0` | 200ms | `--ease` |

Reduced motion: the pop and transitions 1ms.

## States

- **Sticker button unpressed / pressed:** plain / `--paper-2` fill, inset 2px blue ring, art at 45% opacity. **Hover:** scaled and tilted. **Focus-visible:** 2px blue outline at 3px offset.
- **Stuck copy:** present or absent; never a third state.
- **Count:** "N stuck on", live region.
- **Notes:** taped (one tape strip) or pinned (a red disc); the Call Amma note is `--note-yellow`.

## Content rules

- Six notes at most on one board; a seventh goes on a second board. Each note holds one heading and either one short paragraph (under 140 characters) or a list of two to four items.
- Headings are nouns or short imperatives ("Buy", "Call Amma"), never a sentence. Struck items stay on the list; they are the record.
- Stickers are the person's, not the product's: no logo stickers, no badges that mean a state.

## Accessibility

- Stickers are buttons with `aria-pressed` and an `aria-label` naming the sticker ("Gold star"); the group is labelled "Stickers". The copies on the board are `aria-hidden`; the live count tells a screen reader what happened.
- The board is labelled; each note is an `article` with a real heading and text, so the content reads in order without the stickers.
- Contrast: `--ink` on paper 14.1:1; `--ink-2` on paper 9.4:1 and on the yellow note 8.7:1; `--ink-3` struck text on paper 7.0:1; the count `--blue` on the board 4.6:1; the sheet sentence `--ink-2` on the board 5.8:1.
- Hit targets: sticker buttons about 84px square; the clear button 40px.

## Responsive rules

- ≥ 1280: grid `minmax(0,1fr) | 300px`, the board 640px tall.
- 1024–1279: the board 580px tall; note widths × 0.9; sticker spots scale with the board width (use percentages in your build).
- 768–1023: the sheet moves under the board as a row of six; the board 520px tall.
- < 640: the board becomes a column of notes with no absolute positions and rotations halved (at most 1.5°); the sheet is a six-across strip; stuck copies collect in a row under the notes at 64px, in the order they were stuck.

## Acceptance checklist

**Always**
- [ ] Six notes placed by hand with rotations within ±3°, each held by one tape strip or one pin; headings in the hand, text in the sans.
- [ ] Six sticker buttons with `aria-pressed` and labels; clicking adds or removes an `aria-hidden` copy at that sticker's own spot, angle and size.
- [ ] The copy pops in over 360ms with an overshoot curve; reduced motion removes the pop.
- [ ] A live count and a clear-all button that resets every sticker.
- [ ] Stickers have a white die-cut edge (a 5px paper stroke) so they read as stickers on any note.
- [ ] The notes never move; the stickers are the only motion.
- [ ] Real icons elsewhere in the product stay Lounge Icons; stickers are never used as icons.
- [ ] Every note and every sticker spot lies inside the board; nothing is clipped by the frame.
- [ ] A sticker may overlap a note's margin, never its text.

**This demo**
- [ ] Mira's October board: This month, Reading (Blue Nights struck), Shows, Buy, Call Amma, Done; stickers star, done, heart, NEW, sun, arrow at the spots listed in Tokens.

## Implementation notes

**One spot table**, so adding a sticker is data:

```js
const SPOTS = { star: { l: '280px', t: '0px', r: '14deg', s: '80px' }, arrow: { l: '280px', t: '500px', r: '-20deg', s: '110px' } /* … */ };
btn.addEventListener('click', () => {
  const on = btn.getAttribute('aria-pressed') !== 'true'; btn.setAttribute('aria-pressed', String(on));
  if (!on) return board.querySelector(`[data-id="${id}"]`)?.remove();
  const s = SPOTS[id], el = document.createElement('span');
  el.className = 'stuck'; el.dataset.id = id; el.setAttribute('aria-hidden', 'true');
  el.style.cssText = `left:${s.l};top:${s.t};--rot:${s.r};--s:${s.s}`; el.innerHTML = btn.innerHTML; board.appendChild(el);
});
```

**The pop** keeps the rotation inside the keyframes, or the sticker un-rotates while it scales:

```css
.stuck { animation: pop 360ms cubic-bezier(.34,1.56,.64,1) both; filter: drop-shadow(0 3px 2px rgba(43,33,24,.3)); }
@keyframes pop { from { transform: rotate(var(--rot)) scale(0) } to { transform: rotate(var(--rot)) scale(1) } }
```

**The die-cut edge** is a stroke in the paper colour on every sticker shape: `stroke="#fbf6ec" stroke-width="5"`.

**Keeping it inside the frame.** The board has `overflow: hidden`, so a note or spot past the inner width is simply cut. Lay the notes out for the board's real inner width (1120 minus the sheet and gap, minus the frame) and keep every spot at least its own size away from the right and bottom edges.

**Variants.** A read-only board (a public profile) drops the sheet and shows the stickers already stuck. A team board swaps the six notes for one per person and keeps the same tape-or-pin rule. On a dark pair, the frame goes to the theme's `--line` and the tape keeps its 60% white.

Common mistakes: making stickers draggable (then it is a toy and the positions stop being designed); using a sticker as the Done icon in a real list; more than one hand face; a photo texture on the board; letting the pop scale from the top-left corner (set `transform-origin: center`, the default for an inline-block span).
