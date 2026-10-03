<!-- Design Lounge Nº 082 · "iOS app switcher stack" · designlounge.vercel.app -->

# iOS app switcher stack

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

An iOS-style app switcher on a near-black background. Five 300×600 app cards (Fjord Bank, Nord Post, Orbital, Marrow, Halden — all fictional, each a flat two-tone gradient with real-looking screen content) are laid out as a horizontal fan: each card sits 80px to the right of the previous one, rotated −7° around Y inside a 1400px perspective, so the front card is fully visible and the older ones peek out on the left. Dragging horizontally scrolls the fan; dragging a card upward and releasing past 120px (or faster than 0.6px/ms) flings it off the top and the remaining cards reflow; tapping a card expands it to the full 390×844 frame in 420ms with the radius collapsing from 40px to 0. The detail worth copying is the single-transform layout: every card's position is three custom properties (`--x`, `--y`, `--s`) written by one `layout()` function, so drag, fling, reflow and expand all use the same CSS transition.

## Reference behaviour

1. Initial state: heading "Recent" (Syne 22/600) top-left at y = 76px with "5 apps" at the right; the fan is scrolled to its end so the newest card (Halden, purple) sits at x = 60px and the four older cards peek 80px each to its left; a caption "Drag to browse · swipe up to close · tap to open" sits at 64px from the bottom.
2. Pointer down on a card captures the pointer. After 6px of movement the gesture axis is locked to whichever of |dx|, |dy| is larger; the card gets `.drag`, which disables its transition so it tracks the finger 1:1.
3. Horizontal drag: `scroll = startScroll − dx`, clamped to `[0, (n−1) × 80]`. All cards recompute `--x = 60 + i × 80 − scroll` and move together (no transition while dragging).
4. Vertical drag: only the touched card moves; `--y = min(0, dy)` (cannot be dragged down).
5. Release after a vertical drag with `dy < −120px` or velocity `< −0.6px/ms`: the card gets `.gone` — it flies to `translateY(−900px)`, scales to .9 and fades to 0 over 320ms — and is removed from the list. The remaining cards reflow to their new `--x` over 380ms with `cubic-bezier(.2,.7,.2,1)`. The "N apps" counter updates.
6. Release after any drag that does not meet the fling threshold: the card springs back to `--y: 0` and the fan settles over 380ms.
7. Release with no movement (a tap): the card gets `.full` — `left/top` go to 0, `width/height` to 390×844, `border-radius` 40 → 0, transform to identity (no rotateY, scale 1) — all over 420ms with `cubic-bezier(.32,.72,0,1)`. The app content padding-top grows 28 → 70px on the same clock so the app title clears the status bar. Heading and caption fade out over 160ms. After the expansion, a footer line "Tap anywhere to return to the switcher" fades in.
8. Tapping the expanded card (any tap that arrives more than 400ms after opening) removes `.full`; the card shrinks back into its fan slot over 420ms; heading and caption return.
9. Keyboard: cards are `tabindex="0"`. Enter/Space toggles expand/collapse; Delete or Backspace flings the focused card; ArrowLeft/ArrowRight move focus and scroll that card to x = 60px; Escape collapses.
10. When every card has been flung: a centred "No recent apps" message with a 44px pill "Replay" button fades in over 240ms. Replay restores all five cards, scrolled to the end again.

## Structure

```
390 × 844
┌──────────────────────────────────────────┐
│ (54px status bar drawn by the Lounge)    │
│ Recent                          5 apps   │  y 76, Syne 22/600 · Manrope 12/500
│                                          │
│ ┃┃┃┃┌────────────────────────────┐       │  card top 150, 300 × 600, r 40
│ ┃┃┃┃│ [H] Halden                 │       │  older cards peek 80px each at
│ ┃┃┃┃│     Mira Lindqvist         │       │  x = −260, −180, −100, −20; front at 60
│ ┃┃┃┃│ ┌────────────────────────┐ │       │
│ ┃┃┃┃│ │ Did the invoice go out?│ │       │  rows: 14px chat lines, r 14
│ ┃┃┃┃│ └────────────────────────┘ │       │
│ ┃┃┃┃│ ┌────────────────────────┐ │       │
│ ┃┃┃┃│ │ Sent at 08:52, TS-2041.│ │       │
│ ┃┃┃┃│ └────────────────────────┘ │       │
│ ┃┃┃┃│ ...                        │       │
│ ┃┃┃┃└────────────────────────────┘       │  card bottom 750
│                                          │
│ Drag to browse · swipe up to close · tap │  caption, bottom 64
└──────────────────────────────────────────┘
   perspective 1400px, origin 50% 40%; every card rotateY(−7deg)
```

- `<div class="top">` — absolute, `top: 54px; padding: 22px 24px 0`; `<h1>` + `<span id="count">`.
- `<div class="stage" role="list">` — absolute inset 0, `perspective: 1400px; perspective-origin: 50% 40%`.
  - `<article class="card" role="listitem" tabindex="0" aria-label="<app>">` × 5, each with inline `--c1`/`--c2` (top and bottom of its gradient).
    - `.app` — flex column, `padding: 28px 24px 24px`, gradient `--c1 → --c2`.
      - `.id` — 44px rounded icon (initial letter, Syne 18/700) + app name (Syne 18/700) + 12px subtitle.
      - Optional `.big` (Syne 40/600 figure) + `.sub` (13px), optional `.bars` (7 bars, 80px tall sparkline), `.rows` (14px pills, `rgba(255,255,255,.12)`; `.ghost` rows at `.07`).
    - `.done` — absolute bottom caption inside the card, visible only in `.full`.
- `<p class="foot">` — absolute, `bottom: 64px`, centred, 12px/500 tertiary ink.
- `<div class="empty">` — absolute inset 0 grid, hidden until the list is empty; contains `<p>` and `<button id="replay">`.

## Tokens

```css
:root {
  /* colour — near-black stage, cool neutrals, five app pairs (top / bottom of gradient) */
  --bg: #0b0b10;            /* stage base; radial highlight #1b1b26 at top */
  --bg-2: #17171f;
  --ink: #f4f3f7;           /* heading, empty-state text, replay button fill */
  --ink-2: #a09fae;         /* counter, empty-state secondary */
  --ink-3: #5d5c6b;         /* caption */
  --line: rgba(255,255,255,.08);
  --a1: #1f6f5a; --a1-2: #0f3b30;   /* Fjord Bank, green */
  --a2: #e0632a; --a2-2: #6d2a10;   /* Nord Post, orange */
  --a3: #2b62d9; --a3-2: #0e2354;   /* Orbital, blue */
  --a4: #b83c4e; --a4-2: #4b1420;   /* Marrow, red */
  --a5: #6c4fd3; --a5-2: #2a1c5a;   /* Halden, violet */

  /* type */
  --font: "Manrope", system-ui, sans-serif;
  --display: "Syne", system-ui, sans-serif;

  /* layout */
  --card-w: 300px;
  --card-h: 600px;
  --card-top: 150px;
  --card-x0: 60px;          /* x of the card scrolled into front position */
  --step: 80px;             /* horizontal gap between stacked cards */
  --r-card: 40px;

  /* elevation */
  --shadow-card: 0 24px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06);

  /* motion */
  --t-reflow: 380ms;
  --t-fling: 320ms;
  --t-expand: 420ms;
  --t-micro: 160ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --sheet: cubic-bezier(.32, .72, 0, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role               | Family  | Size | Weight | Line-height | Tracking | Case     |
|--------------------|---------|-----:|-------:|------------:|---------:|----------|
| Switcher heading   | Syne    | 22px | 600    | 1.1         | −0.02em  | sentence |
| App name           | Syne    | 18px | 700    | 1.1         | −0.01em  | sentence |
| App icon letter    | Syne    | 18px | 700    | 1           | 0        | UPPER    |
| Big figure         | Syne    | 40px | 600    | 1           | −0.03em  | numerals |
| Empty-state title  | Syne    | 20px | 600    | 1.2         | 0        | sentence |
| App subtitle       | Manrope | 12px | 400    | 1.3         | 0        | sentence |
| Figure caption     | Manrope | 13px | 400    | 1.4         | 0        | sentence |
| Row text           | Manrope | 14px | 500    | 1.3         | 0        | sentence |
| Row value          | Manrope | 14px | 600    | 1.3         | 0        | numerals |
| Counter / caption  | Manrope | 12px | 500    | 1.3         | 0        | sentence |
| Replay button      | Manrope | 14px | 600    | 1           | 0        | sentence |

## Motion

| Element      | Trigger                 | Property                              | From → To                                  | Duration | Easing    | Notes |
|--------------|-------------------------|---------------------------------------|---------------------------------------------|---------:|-----------|-------|
| `.card`      | horizontal drag         | `--x` (transform)                     | tracks finger 1:1                           | 0        | none      | `.drag` sets `transition: none` |
| `.card`      | vertical drag           | `--y` (transform)                     | `min(0, dy)`                                | 0        | none      | only the touched card |
| `.card`      | release, no fling       | transform                             | dragged → resting slot                      | 380ms    | `--ease`  | |
| `.card.gone` | fling                   | transform, opacity                    | y 0 → −900px, s → .9, 1 → 0                 | 320ms    | `--ease`  | `pointer-events: none`, `aria-hidden` |
| siblings     | fling                   | `--x` (transform)                     | old slot → new slot                         | 380ms    | `--ease`  | reflow starts in the same frame as the fling |
| `.card.full` | tap                     | width, height, top, left, radius, transform | 300×600 @ (x,150), r40, rotateY −7° → 390×844 @ (0,0), r0, identity | 420ms | `--sheet` | z-index 20 |
| `.full .app` | tap                     | padding-top                           | 28px → 70px                                 | 420ms    | `--sheet` | same clock |
| `.done`      | expansion               | opacity                               | 0 → 1                                       | 160ms    | `--ease`  | delay 420ms |
| `.top`, `.foot` | expansion / empty    | opacity                               | 1 → 0                                       | 160ms    | `--ease`  | `.dim` class |
| `.empty`     | last card flung         | opacity                               | 0 → 1                                       | 240ms    | `--ease`  | |
| depth scale  | any reflow              | `--s` (transform)                     | `1 − depth × 0.02` (front 1, back .92)      | 380ms    | `--ease`  | depth = distance from the front card |

Reduced motion: all transition durations and delays become 1ms and the `rotateY(−7deg)` is dropped (cards stack flat). Drags still track the finger because dragging has no transition to begin with.

## States

- **Resting card:** `translate3d(--x, 0, 0) rotateY(−7deg) scale(--s)`, `--shadow-card`, `cursor: grab`, z-index = index + 1 so newer cards overlap older ones.
- **Dragging:** `.drag` — transition off, `cursor: grabbing`.
- **Flung:** `.gone` — off-screen, transparent, `aria-hidden="true"`, `tabindex="-1"`, no pointer events; kept in the DOM for Replay.
- **Expanded:** `.full` — fills the frame, `aria-expanded="true"`, `cursor: default`, `.done` caption visible.
- **Focus-visible (card):** 3px white outline, −3px offset (inside the radius so it is not clipped).
- **Focus-visible (Replay):** 2px `--ink` outline, 3px offset.
- **Empty:** `.empty.on` — heading and caption dimmed, message and Replay button shown.

## Accessibility

- The stage is `role="list"`; each card is `role="listitem"` with `aria-label` set to the app name and `tabindex="0"`. Expanded state is exposed with `aria-expanded`.
- Keyboard: Tab through cards in DOM order (oldest first). Enter / Space toggle expand. Delete / Backspace fling the focused card and move focus to the new front card (or to Replay when none remain). ArrowLeft / ArrowRight move focus between neighbours and scroll that card into the front slot. Escape collapses an expanded card.
- Pointer capture (`setPointerCapture`) keeps a drag alive when the finger leaves the card's box.
- `touch-action: none` on `<body>` so the browser never claims a vertical swipe as a scroll; there is nothing else to scroll on this screen.
- Contrast: `--ink` on `--bg` 18:1; `--ink-2` 8.7:1; the 12px caption in `--ink-3` is decorative (3.1:1) and duplicated by the keyboard affordances above. White text on every gradient bottom colour is ≥ 8:1; on the top colours (`--a2` orange 3.6:1, `--a3` blue 5.3:1) only 18px bold and 40px text is placed, which meets AA large-text.
- Hit targets: cards are 300×600; Replay is 44px tall.

## Responsive rules

- 390 × 844 (reference): as specified.
- 360 wide: keep the 300px card and 80px step; set `--card-x0: 45px` so the front card keeps a 15px right gutter.
- Heights below 780: reduce `--card-h` to 70% of the viewport height and `--card-top` to `54px + 96px`; the expand target is always the full viewport, so read `innerWidth/innerHeight` instead of the 390/844 literals.
- ≥ 600 wide (tablet): `--card-w: 340px`, `--step: 120px`, `--card-x0: calc(50% − 170px)`; perspective-origin stays at 50% 40%.
- Pointer devices: horizontal wheel/trackpad scrolling should also drive `scroll`; hover raises the front card's shadow by 8px (optional).

## Acceptance checklist

- [ ] Five 300×600 cards with 40px radius, stacked 80px apart, rotated `rotateY(−7deg)` inside `perspective: 1400px`.
- [ ] On load the fan is scrolled to its end: the newest card is at x = 60px and the oldest four peek 80px each to the left.
- [ ] Horizontal drag moves all cards 1:1 with the pointer and clamps at both ends (no rubber-banding required).
- [ ] Vertical drag moves only the touched card and never below its resting y.
- [ ] Releasing at `dy < −120px` or `velocity < −0.6px/ms` flings the card (−900px, opacity 0, 320ms); otherwise it snaps back over 380ms.
- [ ] Remaining cards reflow over 380ms with `cubic-bezier(.2,.7,.2,1)` and the counter decrements.
- [ ] A tap (no movement beyond 6px) expands the card to 390×844 in 420ms with `cubic-bezier(.32,.72,0,1)`; radius animates 40 → 0 and the rotation returns to 0.
- [ ] The card's own click does not immediately collapse it (ignore clicks within 400ms of opening).
- [ ] Tapping the expanded card returns it to its slot in 420ms; heading and caption fade back in.
- [ ] Enter/Space, Delete/Backspace, ArrowLeft/ArrowRight and Escape behave as specified with visible focus rings.
- [ ] When all cards are flung, "No recent apps" and a 44px Replay button appear; Replay restores all five.
- [ ] Under `prefers-reduced-motion: reduce`, cards are flat (no rotateY) and every transition is 1ms.
- [ ] No console errors when flinging during a reflow or tapping during an expansion.

## Implementation notes

**One layout function, three custom properties.** Never write `transform` per card by hand; compute the slot and let the base rule compose it:

```js
function layout() {
  const n = cards.length, max = Math.max(0, (n - 1) * STEP);
  scroll = Math.min(max, Math.max(0, scroll));
  cards.forEach((c, i) => {
    const depth = n - 1 - i;
    c.style.setProperty('--x', X0 + i * STEP - scroll + 'px');
    c.style.setProperty('--s', (1 - depth * 0.02).toFixed(3));
    c.style.zIndex = i + 1;
  });
}
```

```css
.card { transform: translate3d(var(--x), var(--y), 0) rotateY(-7deg) scale(var(--s));
        transition: transform var(--t-reflow) var(--ease), opacity var(--t-fling) var(--ease),
                    width var(--t-expand) var(--sheet), height var(--t-expand) var(--sheet),
                    top var(--t-expand) var(--sheet), border-radius var(--t-expand) var(--sheet); }
.card.drag { transition: none; }
```

**Lock the gesture axis once.** Decide after 6px and never re-decide, otherwise a diagonal swipe both scrolls and lifts:

```js
if (!d.axis && Math.abs(dx) + Math.abs(dy) > 6) {
  d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; d.moved = true; d.c.classList.add('drag');
}
if (d.axis === 'x') { scroll = d.s - dx; layout(); }
else if (d.axis === 'y') d.c.style.setProperty('--y', Math.min(0, dy) + 'px');
```

**Expand by overriding the slot, not by cloning.** `.full` sets `--x: 0; --y: 0; --s: 1`, `left/top: 0`, `width/height` to the frame and `transform: translate3d(0,0,0) rotateY(0) scale(1)`; because the base rule already transitions width, height, top and border-radius, the expansion needs no JS measurement. Give `.full` `z-index: 20 !important` since `layout()` writes inline z-indexes.

Common mistakes: forgetting `setPointerCapture`, so a fast upward fling loses the pointer at the card edge; using `left` for the horizontal scroll (layout thrash on every move); attaching the collapse to `click` without the 400ms guard, which makes the same tap that opened the card close it; hiding flung cards with `display: none`, which removes them from the Replay path and breaks the 320ms exit.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
