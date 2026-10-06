<!-- Design Lounge Nº 434 · "Swipe deck with undo" · www.designlounge.live -->

# Swipe deck with undo

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A decision deck for content, not dating: "Farfield · Weekend deck", seven short trips from Lisbon. Three cards are visible in a stack. Drag the top card and it follows the pointer, tilting with the drag, while a SAVE or PASS stamp fades in. Past 110px (or a quick flick) it flies off and the stack steps up. Arrow keys do the same, three round buttons mirror them, and Undo brings the last card back in from the side it left, removing it from the shortlist if it was saved. Saved trips gather as chips in the left column. Every card has a flat illustrated scene made from CSS gradients and clip-paths: no images.

The detail worth copying is the undo: the card is placed off-screen on the side it left, with transitions off, then released so it travels back onto the stack. Not `spring-deck`, which only springs back and never decides.

## Structure

```
1280 × 800, page #22302a with a lighter ellipse behind the deck
┌───────────────────────────────────────────────────────────────────────────────┐
│   ⊘ FARFIELD · WEEKEND DECK                          ┌───────────────────┐    │
│   Where next,                                        │ [HILLS]   ( SAVE )│    │
│   Inês?            (64px Gloock)                     │  scene 56%        │    │
│   Seven short trips from Lisbon…  (38ch)             │  sun, far, near   │    │
│   [←] pass [→] save [U] undo                         ├───────────────────┤    │
│   ─────────────────────────────                      │ Sintra (34px)     │    │
│   SAVED TRIPS                         2              │ Lisbon district…  │    │
│   (● Sintra) (● Douro Valley)                        │ pitch 14.5px      │    │
│                                                      │ 40 min│May–Oct│€60│    │
│   column 1fr                         gap 72px        └───────────────────┘    │
│                                                       ▔▔▔▔▔ two cards peek    │
│                                                      ( × )  (↶)  ( ♥ )        │
│                                                          1 of 7               │
└───────────────────────────────────────────────────────────────────────────────┘
card 360 × 500, r 20px; deck box 360 × 536; buttons 64 / 44 / 64, gap 18
```

- `main.wrap`: grid `minmax(0,1fr) auto`, gap 72px, max 1040px.
- Left: `header` (brand `p` with compass SVG, `h1`, lede `p`, keys `p` with `kbd`), then `section.saved` labelled by its `h2` with a `ul` of chips.
- Right: `.deck[role=group][aria-roledescription="card deck"][tabindex=0]`, `touch-action: none`, containing seven `article.card` and the `.end` slot. Then `.controls` with three buttons and the counter `p`.
- Card: grid rows `56% minmax(0,1fr)`. `.scene` (`aria-hidden`) holds `.sun`, `.far`, `.sea`, `.near`, the `.tag` pill and two `.stamp`s. `.info` holds `h3`, the region `p`, the pitch `p`, and a three-cell `ul.facts` pushed to the bottom with `margin-top: auto`.

Deck content (seven cards):

| Trip | Region | Tag | Facts | Scene |
|------|--------|-----|-------|-------|
| Sintra | Lisbon district · Portugal | Hills | 40 min by train · May–Oct · €60 | sage sky, pale sun right, peaks + hills |
| Comporta | Alentejo coast · Portugal | Dunes | 1 h 15 by car · Sep–Oct · €95 | apricot sky, persimmon sun left, rolling + flat |
| Douro Valley | Vila Real · Portugal | Vineyards | 3 h 30 by train · Oct harvest · €80 | sand sky, hills + stepped terraces |
| Berlengas | Off Peniche · Portugal | Island | 2 h car + boat · Jun–Sep · €45 | sea-glass sky, cliff left, striped sea 30% |
| Monsaraz | Évora district · Portugal | Village | 2 h by car · Oct–Apr · €70 | night navy sky, moon, dark hills |
| Serra da Estrela | Guarda · Portugal | Peaks | 3 h 30 by car · Oct–Nov · €65 | cold grey sky, peaks + rolling |
| Tavira | Algarve · Portugal | Coast | 2 h 45 by train · Sep–Nov · €75 | blush sky, low sun, flat shore, sea 36% |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Top card | drag | translate, rotate | follows pointer, rotate dx/18° | live | none | same |
| Stamp | drag | opacity | 0 → 1 at 110px | live | none | same |
| Top card | release under threshold | transform | current → identity | 420ms | `--expo` | instant |
| Top card | decide | translate, rotate, opacity | → ±(w+260), +40, ±24°, 0 | 380ms | `--fly` | instant hide |
| Stack | decide / undo | transform, opacity | depth n → n∓1 | 420ms | `--expo` | instant |
| Returning card | undo | transform, opacity | exit side → identity | 420ms | `--expo` | instant |
| Facts row | depth change | opacity | 0 ↔ 1 | 300ms | `--ease` | instant |
| Saved chip | added | scale, opacity | .7, 0 → 1, 1 | 400ms | `--expo` | none |
| Round buttons | active | scale | 1 → .92 | 160ms | `--ease` | none |

## States

- **Top card:** `cursor: grab`; `grabbing` while dragging; no veil.
- **Behind cards:** page-colour veil (18% / 34%), facts hidden, `aria-hidden="true"`.
- **Dragging:** transitions off on the top card; card behind shows its facts.
- **Busy:** during the 380ms fly or 420ms return, new decisions and undo are ignored.
- **Undo disabled:** opacity .35, `not-allowed`, when history is empty.
- **End:** dashed slot with title, summary, Deal again; Pass/Save disabled.
- **Empty shortlist:** "Nothing yet. Save a card to start a shortlist." in `--on-bg-2`, no dot.
- **Hover:** Pass gets a 6% light fill and stronger border; Save lightens to `#ec7650`; Undo text brightens.
- **Focus-visible:** 2px `#f2b38f` outline, 4px offset (8px on the deck).

## Accessibility

- The deck is one tab stop: `role="group"`, `aria-roledescription="card deck"`, label "Weekend trips. Left arrow passes, right arrow saves, U undoes.", and `aria-describedby` pointing at the "1 of 7" counter.
- Only the top card is exposed; cards behind are `aria-hidden`. Each card is an `article` labelled "Sintra, Lisbon district · Portugal".
- Buttons are labelled Pass, Undo last choice, Save; their icons are `aria-hidden`.
- Every decision and undo is announced in a polite live region with the next card's name.
- Dragging is never the only way: buttons and keys do everything.
- Contrast: `--on-bg` on page 11.2:1, `--on-bg-2` 7.3:1, card ink 12.9:1, `--ink-2` 6.6:1, Save icon `#2a140b` on persimmon 5.1:1.
- Hit targets: 64px Pass and Save, 44px Undo, 44px Deal again.

## Responsive rules

- **≥ 1280:** two columns, card 360 × 500.
- **981–1279:** same, gap 72px.
- **761–980:** gap 40px, headline 48px.
- **< 760:** one column. Header first, deck second, saved list third (`display: contents` on the left column and `order`). Lede and key legend hide. Headline 38px. Card `min(330px, 100vw − 32px)` × 440px, title 28px, pitch 13.5px. Page padding 24/16px.
- Fly-out distance is computed from the deck width, so it always clears the viewport. The body has `overflow-x: hidden` so the off-screen card never adds scroll.

## Acceptance checklist

### Always

- [ ] Three cards visible in a stack with depth transforms from the bottom-centre origin; a fourth is parked invisible.
- [ ] Drag follows the pointer with rotation proportional to dx and a directional stamp that reaches full opacity at the threshold.
- [ ] Decides on distance (110px) or flick (> .6px/ms past 30px); otherwise springs back.
- [ ] Left/Right arrows and two buttons decide; U, Backspace, Cmd/Ctrl+Z and a button undo.
- [ ] Undo returns the card from the side it left and reverses its effect on the shortlist.
- [ ] Input is ignored while a card is flying or returning.
- [ ] End state with a summary and a way to deal again.
- [ ] Only the top card is in the accessibility tree; decisions are announced.
- [ ] Reduced motion removes fly, step and pop tweens but keeps direct drag.
- [ ] No horizontal scroll at 375px, including mid-fly.

### This demo

- [ ] Farfield · Weekend deck, "Where next, Inês?", seven Portuguese trips in the order above.
- [ ] Page `#22302a`, card `#f6eedf`, save `#e2643a`.
- [ ] Card 360 × 500, radius 20px, scene 56% of height.
- [ ] Gloock for headline, titles and stamps; Instrument Sans for everything else.
- [ ] Scenes are CSS gradients and clip-path polygons only.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: left column with brand line, "Where next, Inês?" (64px serif), a lede, a key legend, and "Saved trips 0" with an empty message. Right column: the deck with Sintra on top, Comporta and Douro Valley behind it, then Pass, Undo (disabled), Save buttons and "1 of 7".
2. Stack: depth 0 at identity; depth 1 at `translateY(18px) scale(.95)` with an 18% page-colour veil; depth 2 at `translateY(36px) scale(.90)` with a 34% veil; depth 3 is parked at depth 2's transform with opacity 0, so it can fade in when the stack steps. Transform origin is bottom centre. Cards behind the top hide their facts row so only the clean edge peeks.
3. Drag: pointer down on the top card captures the pointer and turns transitions off. The card moves `translate(dx, dy × .4)` and rotates `dx / 18` degrees. The stamp on the side of travel fades to full opacity at 110px: SAVE (persimmon, top right, rotated 12°) for right, PASS (dark green, top left, rotated −12°) for left. While dragging, the card behind shows its facts.
4. Release: if `|dx| > 110px`, or `|vx| > .6px/ms` with `|dx| > 30px`, the card decides in that direction. Otherwise it springs back to identity over 420ms on expo out and the stamps reset.
5. Decide: the card flies to `translate(±(deckWidth + 260px), dy + 40px) rotate(±24°)` and opacity 0 over 380ms on `cubic-bezier(.3,.6,.4,1)`. At the same moment the stack steps: every remaining card moves up one depth over 420ms expo. The fly-out card is set to `display: none` after 380ms. Input is locked during the fly.
6. Save adds the trip as a chip to "Saved trips" (pops in from 70% scale over 400ms) and updates the count. Pass adds nothing.
7. Keyboard on the focused deck: Right Arrow saves, Left Arrow passes, U, Backspace, or Cmd/Ctrl+Z undoes. The page does not scroll.
8. Undo: pops the last decision. That card is placed on its exit side at `translate(±(deckWidth + 260px), 40px) rotate(±24°)`, opacity 0, with no transition. After a forced reflow, transitions come back on and it returns to depth 0 over 420ms; the other cards step back down. A saved trip's chip is removed. Undo is disabled when there is nothing to undo.
9. End: after the seventh card, a dashed empty slot reads "That's the deck" and "You saved N of 7 trips. Undo to look again." with a "Deal again" button. Pass and Save disable; the counter reads "7 of 7 seen". Deal again clears history and restacks instantly with Sintra on top.
10. Live region announces each step: "Saved Sintra. Next: Comporta.", "Back to Douro Valley. Removed from saved.", "That was the last card."
11. Reduced motion: no drag tilt animation on release (cards jump), no fly-out (cards vanish), no stack tween, no chip pop. Dragging still moves the card under the finger because that is direct manipulation.

## Tokens

```css
:root {
  --bg: #22302a;        /* deep olive page */
  --bg-2: #2b3a33;      /* ellipse behind the deck */
  --paper: #f6eedf;     /* card */
  --paper-rule: #dccfb6;/* facts rule */
  --ink: #1f2a24;       /* card text */
  --ink-2: #4d564f;     /* region, fact labels */
  --on-bg: #efe7d6;     /* headline on page */
  --on-bg-2: #b9bfae;   /* lede, labels, counter */
  --line: rgba(239, 231, 214, .14);
  --save: #e2643a;      /* save button, SAVE stamp, chip dots, brand icon */
  --pass-stamp: #3d4d45;
  --focus: #f2b38f;

  --serif: "Gloock", Georgia, serif;
  --sans: "Instrument Sans", system-ui, sans-serif;

  --cw: 360px; --ch: 500px;
  --r-card: 20px; --r-pill: 99px;
  --depth-1: translateY(18px) scale(.95);
  --depth-2: translateY(36px) scale(.90);
  --threshold: 110px; --flick: .6;   /* px per ms */

  --expo: cubic-bezier(.16, 1, .3, 1);
  --fly: cubic-bezier(.3, .6, .4, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-step: 420ms; --t-fly: 380ms; --t-chip: 400ms; --t-micro: 160ms;
  --shadow-card: inset 0 1px 0 rgba(255,255,255,.6), 0 24px 50px -24px rgba(0,0,0,.55);
}
```

Scene recipe per card, as custom properties on `.scene`: `--sky1`, `--sky2` (vertical gradient), `--sun` and `--sx`/`--sy` (76px disc), `--far` + `--farp` (62% tall band, clip-path polygon), `--near` + `--nearp` (42% band), `--sea` + `--seah` (striped band: 7px colour, 1px 20% lighter). The polygons are shared presets: PEAKS, HILLS, ROLL, FLAT, CLIFF, TERRACES.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Brand line | Instrument Sans | 12px | 600 | 1 | 0.16em | UPPER |
| Headline | Gloock | 64px | 400 | 1 | -0.01em | Sentence, max 9ch |
| Lede | Instrument Sans | 16px | 400 | 1.5 | 0 | sentence, 38ch |
| Section label | Instrument Sans | 12px | 600 | 1 | 0.14em | UPPER |
| Chip | Instrument Sans | 14px | 500 | 1 | 0 | Title |
| Card title | Gloock | 34px | 400 | 1.02 | -0.01em | Title |
| Region | Instrument Sans | 14px | 400 | 1.5 | 0 | — |
| Pitch | Instrument Sans | 14.5px | 400 | 1.5 | 0 | sentence |
| Fact value / label | Instrument Sans | 14px 600 / 12px 400 | | 1.3 | 0 | — |
| Scene tag | Instrument Sans | 11px | 600 | 1 | 0.1em | UPPER |
| Stamp | Gloock | 30px | 400 | 1 | 0.04em | UPPER, 3px border |

## Implementation notes

**Depth is a data attribute; CSS owns the stack.** JS only writes `data-depth`, and inline transforms only while dragging or flying:

```css
.card { transition: transform .42s var(--expo), opacity .42s var(--expo); transform-origin: 50% 100%; }
.card[data-depth="0"] { z-index: 4; }
.card[data-depth="1"] { z-index: 3; transform: translateY(18px) scale(.95); }
.card[data-depth="2"] { z-index: 2; transform: translateY(36px) scale(.90); }
.card[data-depth="3"] { z-index: 1; transform: translateY(36px) scale(.90); opacity: 0; }
.card[data-depth="gone"] { display: none; }
.deck.dragging .card[data-depth="0"] { transition: none; }
```

**Undo: teleport, reflow, release.**

```js
function undo() {
  if (busy || !history.length) return;
  busy = true;
  const h = history.pop(), el = cards[h.i], w = deck.offsetWidth;
  el.style.transition = 'none';
  el.dataset.depth = '0';
  el.style.opacity = '0';
  el.style.transform = `translate(${h.dir * (w + 260)}px, 40px) rotate(${h.dir * 24}deg)`;
  el.getBoundingClientRect();            // commit the off-screen pose
  el.style.transition = reduce ? 'none' : '';
  el.style.opacity = ''; el.style.transform = '';
  top = h.i; layout();                   // others step back down
  setTimeout(() => { busy = false; }, reduce ? 0 : 420);
}
```

**Flick velocity from the last move, not the whole drag.** Average velocity over a slow drag is near zero even when the user flicks at the end:

```js
deck.addEventListener('pointermove', e => {
  if (!drag) return;
  const now = performance.now();
  drag.vx = (e.clientX - drag.lx) / Math.max(1, now - drag.lt);
  drag.lx = e.clientX; drag.lt = now;
  drag.x = e.clientX - drag.x0; drag.y = (e.clientY - drag.y0) * .4;
  drag.el.style.transform = `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 18}deg)`;
});
```

Common mistakes:

- Re-creating card nodes on every decision. Transitions have nothing to run from.
- Forgetting `setPointerCapture`; the drag drops when the pointer leaves the card.
- `touch-action: auto` on the deck; the page scrolls instead of the card moving.
- Undo that fades the card in at the top instead of returning it from its exit side. The direction is the feedback.
- Letting a second arrow press start before the first fly ends; two cards fly and history goes out of step.
- Facts rows peeking out under the top card. Hide them on depth ≥ 1 and show depth 1's while dragging.
- A heart-and-cross dating look with gradients. This is a shortlist tool: paper cards, a serif, one accent.

Rebuild order:

1. Two-column layout and one static card with its scene.
2. Seven cards, `data-depth` stack and `layout()`.
3. Buttons and keys calling `decide(dir)` with the fly-out and busy lock.
4. History, undo, shortlist chips, counter.
5. Pointer drag with stamps, threshold and flick.
6. End state and Deal again, live region, reduced motion, < 760 layout.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
