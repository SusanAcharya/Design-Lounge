<!-- Design Lounge Nº 542 · "Taped photo grid" · www.designlounge.live -->

# Taped photo grid

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them. The hand face is for captions and the one note; the heading's kicker, the sentence and the dates stay in the sans.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A month of pages from Paste, a fictional scrapbook printer, laid out as a four-by-two grid on a kraft board. The closest piece is `collage-hero`, which stacks three pages as a hero; this is the grid under it, with its own eight pages, straight columns, and a hover that straightens one card at a time. Each page is a white card with a 10px paper margin and a 40px caption strip: a drawn picture at 4:3, a Caveat caption and a small sans date. Pages are rotated between -3° and 3° from a per-card custom property, and each is held down by either a translucent tape strip at a corner or along the top, or a red push pin. One carries a tilted red "Reprint" stamp. Hovering or focusing a page straightens it to 0° and lifts it 6px over 320ms, so the grid reads as physical without ever moving more than a few pixels. A blue handwritten note with an arrow sits at the bottom left, under the grid, where it covers nothing. The detail worth copying is the per-card `--rot` variable: the grid stays a real CSS grid with real links, and the scrapbook look is one line of CSS per card.

## Structure

```
1280 × 800, board #C9A97C with a 5px dot grain
wrap max 1200, padding 34/40
PASTE · BOOK 3                                          Eight of the thirty-one pages. Hover a photo…
May, taped in  48 Caveat
grid 4 × 1fr, gap 34 / 28, padding-top 10
┌ page -3° ─┐  ┌ page 2° ──┐  ┌ page -1° ─┐  ┌ page 3° ──┐
│ \ tape    │  │ ═ tape ═  │  │  ● pin    │  │  tape /  [REPRINT] │
│ picture   │  │ picture   │  │ picture   │  │ picture   │
│ caption · date (strip 40)                               │
└───────────┘  └───────────┘  └───────────┘  └───────────┘
┌ page 2° ──┐  ┌ page -2° ─┐  ┌ page 1° ──┐  ┌ page -3° ─┐
│ …         │  │  ● pin    │  │ ═ tape ═  │  │  tape /   │
                                                    ↗ order a reprint of any of these (Caveat 26, blue, bottom left, below the grid)
```

- `main.wrap` → `div.head` (`h1` with a `small` kicker, `p`), `div.grid`, `span.note[aria-hidden]`.
- Each page is `a.photo[style="--rot:…"]` (add `.pin` for a pinned one) → optional `span.tape.a|b|c[aria-hidden]`, optional `span.stamp[aria-hidden]`, `figure` → `span.img[aria-hidden]` with an inline SVG, `figcaption` with a `small` date.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---:|---|
| `.photo` | hover, focus-visible | transform | `rotate(var(--rot))` → `rotate(0) translateY(-6px)` | 320ms | `--expo` |

Reduced motion: transitions 1ms and the page keeps its tilt on hover.

## States

- **Page rest:** tilted by `--rot`, paper, shadow, tape or pin. **Hover / focus:** straight, lifted, z-index 2. **Focus-visible:** 2px blue outline at 4px offset.
- **Pinned:** no tape; a 16px red disc at the top centre with a 2px shadow and an inner shade.
- **Stamped:** the Reprint stamp at the top right, `--red-ink` (#b8322a, 5.5:1) on a paper fill.

## Content rules

- One caption per page, four words or fewer, in the person's voice; the date is the only sans text on the card.
- Pages are in date order, left to right then down. Do not sort by colour or size.
- At most one stamp per eight pages, and only for a real state (reprint, favourite, sold). A stamp is not decoration.
- Pictures are the person's photos. The drawn placeholders in this demo stand in for them and are never shipped.

## Accessibility

- Every page is a link with a visible caption and date as its text; pictures, tape, pins, the stamp and the note are `aria-hidden`.
- Focus straightens the page like hover, so keyboard users get the same cue plus the ring.
- Contrast: `--ink-2` caption on paper 9.4:1; `--ink-3` date on paper 8.0:1 and on the board 4.6:1; the sentence `--ink-2` on the board 5.8:1; the `--blue` note on the board 4.6:1. Captions are one line (`white-space: nowrap`), so a caption never runs into its picture.
- Hit targets: each page is a whole-card link; nothing smaller than the card is interactive.

## Where it lives

- On a personal site or a scrapbook product, this is the month view: one grid per month, the title in the hand, the kicker naming the book.
- In a product with a detail page, each card links to the page's own view; the straightening on hover is the only preview. Do not add a lightbox.
- Under a collage hero (`collage-hero`), the grid is the second section; the hero's three pages are not repeated here.
- It never sits inside a card or a panel: the board is the page background, and the cards sit straight on it.

## Responsive rules

- ≥ 1280: four columns, gap 34 / 28.
- 1024–1279: four columns, gap 26 / 20, caption 19px.
- 768–1023: three columns; the head stacks.
- < 640: two columns, gap 22 / 14, padding 20px, caption 18px with the date on its own line under it (the strip grows to 46px), tape 72×20; rotations halved (`--tilt: .5`) so pages do not overlap; the note hidden.

## Acceptance checklist

**Always**
- [ ] A real CSS grid of link cards; each card's tilt comes from its own `--rot` custom property between -3° and 3°.
- [ ] Each card is held by one thing: a tape strip at a corner or the top, or a pin; never both, never none.
- [ ] Captions are in the hand face; dates, the kicker and the sentence are the sans.
- [ ] Hover or focus straightens the card to 0° and lifts it 6px over 320ms; nothing else moves.
- [ ] Pictures are decorative; the link text is the caption and date.
- [ ] Rotations and the lift are removed under reduced motion; focus rings stay.
- [ ] No photo texture on the board; one dot grain at most.
- [ ] The note sits below the grid and covers no card; the stamp may overhang a card's edge by a few pixels, nothing else does.

**This demo**
- [ ] Eight pages for May with the captions and dates above; pages 3 and 6 pinned; page 4 stamped "Reprint"; the note "order a reprint of any of these".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: "PASTE · BOOK 3 / May, taped in" (Caveat 48px), a sentence at the right ("Eight of the thirty-one pages from the bus, the roof and the garden…"), eight pages: Bus to Besisahar (2 May), Rain on the tin roof (6 May), Amma's garden (9 May, pinned), The 7:10 to work (13 May, stamped Reprint), Momos at the counter (16 May), Tej's new bike (20 May, pinned), Power cut, candles (23 May), The last mango (29 May). The note: "order a reprint of any of these".
2. Hover or focus a page: it rotates to 0°, rises 6px and comes to the front, over 320ms expo-out. Leave: it returns to its tilt.
3. Click a page: it is a link to the page's own view (here `#`).
4. Nothing animates on load. Reduced motion: no straightening; focus still shows the ring.

## Tokens

```css
:root {
  --board: #c9a97c;  --paper: #fbf6ec;  --paper-2: #efe2c8;
  --ink: #2b2118;  --ink-2: #4a3a2a;  --ink-3: #4d3d2c;  --line: #b08f62;
  --red: #d9442b;  --red-ink: #b8322a;  --blue: #1d4560;  --yellow: #e0a300;
  --tape: rgba(255,250,230,.6);
  --hand: "Caveat", cursive;  --sans: "Inter", system-ui, sans-serif;
  --r: 4px;  --shadow: 0 8px 20px -10px rgba(43,33,24,.45);
  --pad: 10px;  --strip: 40px;  --lift: 6px;  --tape-w: 92px;  --tape-h: 24px;  --pin: 16px;
  --t-micro: 200ms;  --t-tilt: 320ms;
  --ease: cubic-bezier(.2,.7,.2,1);  --expo: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Title | Caveat | 48px | 700 | 1 | 0 | as written |
| Kicker | Inter | 12px | 600 | 1 | +0.12em | UPPERCASE, `--ink-3` |
| Sentence | Inter | 14px | 400 | 1.5 | 0 | sentence, `--ink-2`, right-aligned |
| Caption | Caveat | 21px | 700 | 1 | 0 | sentence, `--ink-2` |
| Date | Inter | 11px | 500 | 1 | +0.04em | `--ink-3` |
| Stamp | Inter | 10px | 600 | 1 | +0.14em | UPPERCASE, `--red-ink` on a paper fill, 2px border, 8° |
| Note | Caveat | 26px | 700 | 1 | 0 | lower case, `--blue`, −3°, bottom left |

## Implementation notes

**Tilt per card**, one variable:

```css
.photo { transform: rotate(var(--rot)); transition: transform var(--t-tilt) var(--expo); }
.photo:hover, .photo:focus-visible { transform: rotate(0deg) translateY(calc(var(--lift) * -1)); z-index: 2; }
```

```html
<a class="photo" href="/pages/12-may" style="--rot:-3deg">…</a>
```

**Three tape positions** and one pin, as classes:

```css
.tape { position: absolute; width: 92px; height: 24px; background: var(--tape); box-shadow: 0 1px 2px rgba(43,33,24,.15); pointer-events: none; }
.tape.a { left: -24px; top: -9px; transform: rotate(-36deg); }   /* top-left corner */
.tape.b { right: -24px; top: -9px; transform: rotate(36deg); }   /* top-right corner */
.tape.c { left: 50%; top: -11px; transform: translateX(-50%) rotate(-2deg); }   /* along the top */
.pin::before { content: ""; position: absolute; left: 50%; top: -8px; width: 16px; height: 16px; border-radius: 50%;
  background: var(--red); transform: translateX(-50%); box-shadow: 0 2px 0 rgba(43,33,24,.35), inset -3px -3px 0 rgba(43,33,24,.2); }
```

**Pinned or taped** is per card, as a class, so a product can mark a kind (pinned = favourite, taped = ordinary) without a legend; say which in the caption's date line if the difference matters.

**Variants.** A three-column version at 1024 drops the gap to 26px and tilts to ±2°. With real photos, `.img` keeps the 4:3 box and uses `object-fit: cover`; square photos get a 1:1 box and the caption strip stays 40px. A month with fewer than eight pages leaves the grid short; do not pad it with blank cards.

Common mistakes: rotating the whole grid (only cards tilt); tilts over 3° at four columns (corners collide); a box-shadow on the tape; captions in the sans and dates in the hand (the other way round); forgetting `pointer-events: none` on the tape, so it steals the hover.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
