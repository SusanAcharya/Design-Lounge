<!-- Design Lounge Nº 541 · "Collage hero" · www.designlounge.live -->

# Collage hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them. The hand face is for the notes only; the headline, body and buttons stay in the sans (the Handwritten Notes caution).

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The first screen of Paste, a fictional service that prints a month of photos as a scrapbook. The page is a kraft board with a faint paper grain. Left: a white paper block with torn top and bottom edges (a `clip-path` polygon), held by a strip of translucent tape, carrying a 64px sans headline with one phrase on a yellow marker stripe, one sentence and two paper buttons with a 3px hard shadow. Under it, a blue handwritten note in Caveat with a drawn arrow: "this one is from May". Right: three photo pages (320, 260 and 220px wide), each a white card with a drawn picture, a Caveat caption and a date, taped at a corner and rotated -6°, 5° and 2°, placed so no caption is covered; hovering the stage shifts each a few pixels and degrees, like pages lifting. A round yellow sticker reads "24 pages" and a dashed ticket stub says "Admit one · May". The detail worth copying is the restraint: one hand face, used three times, and tape and tilt doing the rest; everything you read is set in the sans.

## Structure

```
1280 × 800, board #C9A97C with a 5px dot grain at 8%
nav 22/40   [Paste] (paper, -2°)                     [Books] [Paper] [Prices]  (paper tabs)
hero max 1200, padding 30/40, grid minmax(0,1fr) | 520px, gap 40, centred
┌ torn block, paper, padding 30/34 ───────────────┐   ┌ stage 520 × 560 ───────────────────────┐
│ ═══ tape ═══ (top centre, -3°)                   │   │  ┌ page 1, 320w, -6° ┐     (24 PAGES) ● │
│ A scrapbook you can                     64/600   │   │  │ picture 4:3       │ ┌ page 2, 260w, 5° ┐
│ [send in the post.]  ← marker stripe             │   │  │ caption   12 May  │ │ picture          │
│ one sentence 18px, 42ch                          │   │  └───────────────────┘ │ caption   19 May │
│ [Start a book, 1,800] [Flick through one]        │   │       ┌ page 3, 220w, 2° ┐─────────────────┘
└──────────────────────────────────────────────────┘   │ [ADMIT ONE · MAY]  │ picture          │     │
   ↗ this one is from May  (Caveat 28, blue, -5°)      │                    │ caption   26 May │     │
                                                        └────────────────────┴──────────────────┴─────┘
```

- `header.nav` → `a.brand`, `nav.links`.
- `main.hero` → a wrapper holding `span.tape.top`, `section.torn[aria-labelledby]` (`h1` with `mark`, `p`, `div.ctas`), `span.note[aria-hidden]` with an SVG arrow; and `div.stage[aria-label]` → three `figure.photo` (`span.tape`, `div.img[aria-hidden]` with an inline SVG, `figcaption` with a `small` date), `span.sticker[aria-hidden]`, `span.ticket[aria-hidden]`.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---:|---|
| `.p1` | stage hover | transform | `rotate(-6deg)` → `rotate(-8deg) translate(-6px,-4px)` | 320ms | `--expo` |
| `.p2` | stage hover | transform | `rotate(5deg)` → `rotate(7deg) translate(6px,-6px)` | 320ms | `--expo` |
| `.p3` | stage hover | transform | `rotate(2deg)` → `rotate(0) translateY(-8px)` | 320ms | `--expo` |
| `.btn` | hover | transform, box-shadow | 0, `3px 3px 0` → `translate(2px,2px)`, `1px 1px 0` | 200ms | `--ease` |

Reduced motion: transitions 1ms; the pages stay put on hover.

## States

- **Button default:** paper, 2px ink border, 3px ink shadow. **Red:** `--red` fill, cream text. **Hover:** pushed 2px. **Focus-visible:** 2px blue outline at 3px offset.
- **Nav link hover:** `--paper-2` fill.
- **Pages at rest / lifted:** the rotations above; page 3 always on top.

## Accessibility

- The headline, sentence and buttons are real text in the sans; the note, sticker and ticket are `aria-hidden` decoration, and nothing they say is needed to use the page.
- The stage is labelled "Three pages from a finished book"; each page is a `figure` with a real caption and date; the pictures are `aria-hidden` SVGs.
- Contrast: `--ink` on paper 14.1:1; `--ink-2` on paper 9.4:1; cream on the red button 4.9:1; `--ink-3` date on paper 7.0:1; `--blue` note on the board 3.6:1 (decoration, 28px). The tape is 60% white and never sits over text.
- Hit targets: buttons 48px, nav tabs 32px tall with 12px padding (make them 44px on touch).

## Responsive rules

- ≥ 1280: grid `minmax(0,1fr) | 520px`; headline 64px.
- 1024–1279: right column 440px; pages 280 / 230 / 200 wide; headline 56px.
- 768–1023: one column; the stage below the block at 420px tall; the note moves under the buttons.
- < 640: padding 20px; headline 40px; buttons stacked full width; the stage shows pages 1 and 2 only (hide page 3 and the ticket); the sticker 72px. Keep the torn edge; it is the piece.

## Acceptance checklist

**Always**
- [ ] The headline block has torn top and bottom edges from a `clip-path` polygon and one tape strip; its text is the sans at display size, not the hand.
- [ ] The hand face appears only on notes, captions, the wordmark and the sticker; body and buttons are the sans.
- [ ] Three pages at three rotations, each taped at one corner, with a one-line caption and a date that no other page covers; hover shifts them by at most 8px and 2°.
- [ ] One filled button and one paper button with a 3px hard shadow; hover pushes them.
- [ ] One sticker and one ticket stub, both decorative and `aria-hidden`.
- [ ] A faint dot grain on the board, under 10% opacity; no photo texture, no second gradient.
- [ ] Focus rings visible on nav links and buttons.
- [ ] Reduced motion: no hover shift.

**This demo**
- [ ] Paste; "A scrapbook you can send in the post."; buttons "Start a book, 1,800" and "Flick through one"; pages "The lake at seven" (12 May), "Tej's first ticket" (19 May), "The good plate" (26 May); sticker "24 pages"; stub "Admit one · May".
- [ ] The note reads "this one is from May" with a drawn arrow pointing at the pages.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: nav with a tilted paper wordmark "Paste" and three paper links; the torn block with "A scrapbook you can send in the post." (the last four words on the marker stripe), the sentence, buttons "Start a book, 1,800" (red) and "Flick through one" (paper); the note and arrow; the three pages, the sticker, the stub.
2. Hover the stage: page 1 rotates to -8° and moves (−6, −4)px, page 2 to 7° and (6, −6), page 3 to 0° and up 8px, over 320ms expo-out. Leave: back.
3. Hover a button: it moves (2, 2)px into its 3px shadow. Nav links darken to the second paper tone on hover.
4. Nothing animates on load. Reduced motion: the pages do not move on hover.

## Tokens

```css
:root {
  --board: #c9a97c;    /* page */
  --paper: #fbf6ec;  --paper-2: #efe2c8;
  --ink: #2b2118;  --ink-2: #4a3a2a;  --ink-3: #5e4d3a;  --line: #b08f62;
  --red: #d9442b;      /* primary: the one filled button */
  --blue: #2f6f8f;     /* secondary: the pen, focus */
  --yellow: #e0a300;   /* tertiary: the marker stripe, the sticker */
  --tape: rgba(255,250,230,.6);
  --hand: "Caveat", cursive;
  --sans: "Inter", system-ui, sans-serif;
  --r: 4px;
  --shadow: 0 8px 20px -10px rgba(43,33,24,.45);
  --t-micro: 200ms;  --ease: cubic-bezier(.2,.7,.2,1);  --expo: cubic-bezier(.16,1,.3,1);
}
/* torn edge */
.torn { clip-path: polygon(0 3%,4% 0,12% 2%,21% 0,33% 2%,44% 0,55% 3%,66% 0,78% 2%,89% 0,100% 2%,100% 97%,95% 100%,84% 98%,73% 100%,62% 97%,50% 100%,39% 98%,27% 100%,15% 97%,5% 100%,0 98%); }
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Headline | Inter | 64px | 600 | 1.02 | −0.035em | sentence; one phrase on the marker stripe |
| Lede | Inter | 18px | 400 | 1.5 | 0 | sentence, `--ink-2` |
| Button | Inter | 16px | 600 | 1 | 0 | sentence |
| Nav link | Inter | 14px | 600 | 1 | 0 | sentence, on paper tabs |
| Wordmark | Caveat | 30px | 700 | 1 | 0 | as written, on paper, −2° |
| Note | Caveat | 28px | 700 | 1 | 0 | lower case, `--blue`, −5° |
| Caption | Caveat | 22px | 700 | 1 | 0 | sentence, one line (`white-space: nowrap`), `--ink-2`; date 12px Inter 500 `--ink-3` |
| Sticker | Caveat | 22px | 700 | 1 | 0 | centred, two lines |
| Ticket | Inter | 11px | 600 | 1 | +0.14em | UPPERCASE, dashed border |

## Implementation notes

**The torn edge** is one polygon on the block; keep the points under 3% so it reads as paper, not a saw:

```css
.torn { clip-path: polygon(0 3%, 4% 0, 12% 2%, 21% 0, 33% 2%, 44% 0, 55% 3%, 66% 0, 78% 2%, 89% 0, 100% 2%,
  100% 97%, 95% 100%, 84% 98%, 73% 100%, 62% 97%, 50% 100%, 39% 98%, 27% 100%, 15% 97%, 5% 100%, 0 98%); }
```

Note that `clip-path` clips the shadow too, so the block's shadow goes on a wrapper or is accepted as cut; the tape sits on the wrapper, outside the clip.

**Tape** is a translucent strip with a 1px shadow; rotate it from its centre:

```css
.tape { position: absolute; width: 120px; height: 30px; background: rgba(255,250,230,.6); box-shadow: 0 1px 2px rgba(43,33,24,.15); }
.tape.tl { left: -30px; top: -12px; transform: rotate(-38deg); }
```

**Pages lift together** on the stage's hover, each to its own end state:

```css
.photo { transition: transform 320ms var(--expo); }
.stage:hover .p1 { transform: rotate(-8deg) translate(-6px,-4px); }
.stage:hover .p3 { transform: rotate(0) translateY(-8px); }
```

**Placing the pages.** Lay the three cards so each caption strip stays clear: the first high and left, the second high and right, the third low and between them, overlapping only the pictures above it. Check the overlap at every breakpoint; a caption hidden by a corner is the most common defect in this piece.

**Variants.** A product with real photos puts them in `.img` at 4:3 with `object-fit: cover` and keeps the paper margin; a one-page version keeps page 2 only, straight, with the sticker. The torn block can hold a form instead of buttons (one field and one button) without changing the edge.

Common mistakes: setting the headline in the hand face (it becomes a greeting card); more than one note; a photo texture on the board; tape over the caption; a drop shadow on the tape (it is flat).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
