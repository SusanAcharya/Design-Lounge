---
title: "Graph paper homepage"
summary: "A personal homepage typed onto engineering paper: a typewriter greeting, a torn photo print, paperclipped project slips and a notebook log."
platform: web
type: screen
category: portfolio
tags: [personal, homepage, typewriter, paper, notebook]
styles: [paper, retro, editorial]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#ECF0E1", "#FAFAF4", "#26271F", "#9C3324", "#C3D2B2"]
fonts: ["Courier Prime", "Caveat"]
related: [card-journal-page, card-polaroid-frames]
---

# Graph paper homepage

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from bermawy.com: the whole page is a desk. Graph paper behind everything, a typewriter face for all text, a photo with torn edges, project cards held by paperclips, and a table of articles that reads like a lab notebook. This piece is the homepage of a fictional bookbinder, Hana Kettleby. It opens with "hello, reader" typed out letter by letter in oxblood, an ink drawing in a torn, taped print, a three-paragraph introduction with one handwritten margin note, then "in the works" (three clipped slips) and "notebook" (four dated entries), and ends with her surname drawn in pencil hatching. The detail worth copying is restraint: one typewriter face, one accent, one handwritten note. The paper props do the personality, so the copy can stay short and plain.

## Reference behaviour

1. On load the `h1` types "hello, reader" one character at a time: 70–130ms per character, with a 260ms pause after the comma. A 4px underscore caret blinks after the text.
2. Clicking or pressing Enter on the heading clears it and types it again. Reduced motion shows the full text at once.
3. 900ms after load, the handwritten note "yes, all by hand." draws its curved arrow toward the first paragraph (stroke-dashoffset 120 → 0, 900ms expo-out).
4. The header is sticky, 92% paper, with a 2px oxblood rule under it.
5. Hovering or focusing a project card lifts it 6px and tilts it from the paperclip (top centre): -1.2deg, 1deg, -0.8deg for cards one to three. Shadow grows under it. 500ms expo-out.
6. Hovering or focusing a notebook row turns its border oxblood, its fill white, draws a 1px oxblood underline under the title from left to right (300ms), and nudges the spectacles icon 3px right with a -8deg tilt.
7. The photo and the three project slips have torn edges, generated once from a seeded random so they look the same on every load.
8. The footer wordmark "KETTLEBY" is SVG text filled with a -35deg hatch pattern and a 1.4px graphite stroke, like a pencil sketch.

## Structure

```
1280 × 800, page scrolls (≈ 1900px tall)
┌───────────────────────────────────────────────────────────────────────────┐
│ HANA KETTLEBY                                       [NOTES]  [CONTACT]    │ sticky, 2px oxblood rule
├───────────────────────────────────────────────────────────────────────────┤
│   hello, reader_                                         56px / 700       │
│   ┌──tape──┐                                                             │
│   │ torn print 340w │       intro p (max 470px)          yes, all by    │
│   │ ink drawing     │       intro p                       hand. ↙       │
│   │ caption (hand)  │       intro p                                      │
│   └─────────────────┘                                                    │
│   in the works ─────────────────────────────────────────────── 3 open    │
│   [ clip ]          [ clip ]          [ clip ]                            │ 3 cols, gap 28
│   slip 150h         slip              slip                                │
│   description       description       description                         │
│   notebook ─────────────────────────────────────────────── [view all]    │
│   │ 2026-09-28 │ Grain direction, explained with ...          │ ∞∞ │     │ 150 | 1fr | 64
│   × 4 rows, gap 10, min-height 56                                         │
│   ───────────────────────────────────────────────────────────────────    │
│                  K E T T L E B Y  (hatched SVG, full width)               │
└───────────────────────────────────────────────────────────────────────────┘
 main max-width 1120, padding 44px 40px 0
 hero grid: 340px | 1fr, gap 72px
```

- `header` (sticky) with a home link and `nav aria-label="Site"`.
- `main > section.hero`: `h1 > button#retype` containing the typed span and the caret; `figure.torn` (tape span, `.sheet` with clip-path, inline SVG `role="img"`, `figcaption`); `.intro` with three `p` and an `aria-hidden` margin note.
- `.lbl` rows are section labels with a 1px oxblood rule. They are plain text, not headings, because the page has one `h1`; if the product needs an outline, make them `h2` and keep the size.
- `ul.works > li > a.work`: paperclip SVG, `.slip` (torn, `aria-hidden`, holds the display name and a handwritten sub-line), `p` with the bold name and one sentence.
- `ol.log > li > a`: `time`, `.t` title, `.g` spectacles icon.
- `footer` with the hatched SVG wordmark, `role="img"`.

## Tokens

```css
:root {
  --paper: #ecf0e1;        /* engineering-pad green */
  --grid: #d6e0c8;         /* 16px minor grid */
  --grid-major: #c3d2b2;   /* 80px major grid */
  --card: #fafaf4;         /* cards, rows, photo sheet */
  --card-2: #f1f1e6;       /* slip inside a card */
  --ink: #26271f;          /* body text */
  --ink-2: #4a4c40;        /* card copy, captions */
  --ink-3: #6b6e5e;        /* dates, hatch */
  --line: #b9c4a8;         /* card borders, row dividers */
  --accent: #9c3324;       /* oxblood: name, nav, h1, bold words, rules */
  --focus: #9c3324;
  --tape: rgba(214,196,150,.72);

  --type: "Courier Prime", "Courier New", monospace;
  --hand: "Caveat", "Bradley Hand", cursive;

  --fs-h1: 56px; --fs-body: 15px; --fs-row: 14.5px; --fs-small: 13px;
  --space: 4px 8px 16px 18px 22px 28px 32px 44px 72px;
  --radius: 0;             /* nothing is rounded; paper is square */
  --shadow-print: drop-shadow(0 6px 8px rgba(38,39,31,.16));
  --shadow-lift: 0 18px 24px -14px rgba(38,39,31,.35);

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
}
body {
  background-color: var(--paper);
  background-image:
    linear-gradient(var(--grid-major) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-major) 1px, transparent 1px),
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px;
}
```

## Typography

| Role | Family | Size / LH | Weight | Tracking | Case / colour |
| --- | --- | --- | --- | --- | --- |
| Name mark | Courier Prime | 17px | 700 | 0.16em | uppercase, accent |
| Nav | Courier Prime | 14px | 400 | 0.08em | uppercase, in [brackets], accent |
| Greeting h1 | Courier Prime | 56px / 1 | 700 | -0.01em | lowercase, accent |
| Body | Courier Prime | 15px / 1.6 | 400 | 0 | `--ink`; key phrases 700 accent |
| Section label | Courier Prime | 13px | 400 | 0.1em | lowercase, accent |
| Slip name | Courier Prime | 30px / 1 | 700 | 0.04em | uppercase, `--ink-2`, 1px white text-shadow (debossed) |
| Card copy | Courier Prime | 13.5px / 1.6 | 400 | 0 | `--ink-2`, name bold accent |
| Log date | Courier Prime | 14px | 400 | 0 | ISO `YYYY-MM-DD`, `--ink-3` |
| Log title | Courier Prime | 14.5px | 400 | 0 | sentence case, `--ink` |
| Handwriting | Caveat | 20–24px / 1.05 | 500–700 | 0 | caption `--ink-2`, note accent |
| Wordmark | Courier Prime (SVG) | 196 units | 700 | -6 | uppercase, hatched |

Handwriting appears in three places only: the photo caption, the margin note, and the slip sub-lines. It never carries a heading or a link.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Greeting | load, heading click | text content | "" → "hello, reader" | 70–130ms per char, +260ms after comma | full text at once |
| Caret | always | opacity | 1 ↔ 0 | 1s `steps(1)` | steady |
| Margin arrow | load | stroke-dashoffset | 120 → 0 | 900ms expo, 900ms delay | drawn |
| Project card | hover / focus | translateY, rotate | 0 → -6px, 0 → ±1deg (origin top centre) | 500ms expo | none |
| Card shadow | hover / focus | box-shadow | none → lift | 300ms ease | none |
| Log underline | hover / focus | background-size | 0 → full width, 1px | 300ms expo | instant |
| Spectacles | hover / focus | translateX, rotate | 0 → 3px, -8deg | 300ms expo | none |
| Row border | hover / focus | border-color, background | line → accent, card → white | 160ms ease | instant |

## States

- Nav link hover: underline, 4px offset.
- Heading button: cursor is a text cursor; focus-visible is the dashed oxblood ring at 6px offset.
- Card resting: square, 1px `--line`, no shadow. Hover/focus: lifted, tilted from the clip, shadow.
- Row resting: `--card`, 1px `--line`. Hover/focus: white, oxblood border, underline drawn, icon nudged.
- Focus-visible everywhere: 2px dashed `--accent`, 4px offset. Dashed reads as pencil, not as browser chrome.
- Empty notebook (product case): one row reading "Nothing written this month." in `--ink-3`, no icon column.

## Accessibility

- One `h1`. Its button has `aria-label="hello, reader. Activate to retype."`; the typed span and caret are `aria-hidden`, so screen readers never hear partial words.
- The torn print is `role="img"` with a plain description. The margin note is decorative and `aria-hidden` because it repeats nothing essential.
- Project slips are `aria-hidden`; the card link's name comes from its sentence, which starts with the bold project name.
- Rows are links inside an `ol`, with `time datetime`. The spectacles are `aria-hidden`.
- Contrast: `#26271f` on `#ecf0e1` ≈ 13:1; `#9c3324` on `#ecf0e1` ≈ 6.4:1; `#6b6e5e` on `#fafaf4` ≈ 5:1.
- The sticky header is 56px; anchor targets need `scroll-margin-top: 72px` in a product.
- Hit targets: nav links get 6px vertical padding; rows are 56px tall.

## Responsive rules

- ≥1280: as drawn. The margin note hangs 180px to the right of the intro column.
- ≤1180: the note moves inline above the first paragraph, rotated -3deg, arrow hidden.
- ≤860: hero becomes one column, the print max 320px; project cards stack; h1 42px.
- ≤560: header padding 14px 18px, nav 12px, page padding 18px; log rows drop the icon column and use 96px for the date; footer wordmark scales with the SVG.
- The grid background never scales; it stays 16/80px at every width.

## Acceptance checklist

### Always

- [ ] One typewriter family for everything except three handwritten touches.
- [ ] Graph paper background with a minor and a major grid.
- [ ] Greeting types itself on load, can be retyped, and shows instantly under reduced motion.
- [ ] Photo and slips have torn edges from a seeded generator; the photo has a strip of tape.
- [ ] Project cards tilt from the paperclip, not from their centre.
- [ ] Notebook rows have three columns: ISO date, title, icon, divided by 1px rules.
- [ ] No rounded corners anywhere.
- [ ] Dashed focus ring on every link and the heading button.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Heading reads "hello, reader" at 56px in `#9c3324`.
- [ ] Paper `#ecf0e1`, cards `#fafaf4`, grid 16px `#d6e0c8` and 80px `#c3d2b2`.
- [ ] Projects: Weatherbook, Grain School, Spine & Co.
- [ ] Four notebook rows, first dated 2026-09-28.
- [ ] Footer wordmark "KETTLEBY" hatched at -35deg.

## Implementation notes

1. **Seeded torn edges.** Build a `polygon()` with jitter on all four sides. Seed it so it is stable across renders (no layout shift on reload). Apply it to an inner sheet, not the element carrying the drop-shadow, or the shadow gets clipped away.

```js
function tear(seed, n) {
  let s = seed; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const p = [];
  for (let i = 0; i <= n; i++) p.push(`${i/n*100}% ${(r()*2.4).toFixed(2)}%`);
  for (let i = 1; i <= n; i++) p.push(`${(100-r()*1.6).toFixed(2)}% ${i/n*100}%`);
  for (let i = n; i >= 0; i--) p.push(`${i/n*100}% ${(100-r()*2.4).toFixed(2)}%`);
  for (let i = n-1; i > 0; i--) p.push(`${(r()*1.6).toFixed(2)}% ${i/n*100}%`);
  return `polygon(${p.join(",")})`;
}
sheet.style.clipPath = tear(7, 48);   /* figure keeps filter: drop-shadow */
```

2. **Typing with rhythm.** Vary the delay so it reads as a person, and pause on punctuation. Clear any running timer before retyping.

```js
function type() {
  clearTimeout(tid); out.textContent = "";
  if (reduced) { out.textContent = words; return; }
  let i = 0;
  (function step() {
    out.textContent = words.slice(0, ++i);
    if (i < words.length) tid = setTimeout(step, words[i-1] === "," ? 260 : 70 + (i*37) % 60);
  })();
}
```

3. **Pencil wordmark without an image.** SVG text filled with a rotated line pattern, plus a thin stroke:

```html
<pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
  <path d="M0 0V6" stroke="#6b6e5e" stroke-width="1.3"/>
</pattern>
<text x="520" y="150" text-anchor="middle" font-weight="700" font-size="196"
      fill="url(#hatch)" stroke="#4a4c40" stroke-width="1.4">KETTLEBY</text>
```

Common mistakes:

- Mixing in a sans for "readability". The typewriter face is the voice; keep it at 15px with 1.6 line-height.
- Handwriting everywhere. Three touches, no more.
- Rounded cards and soft shadows on everything. Only the print and the lifted card cast shadows.
- Copying a real person's portrait idea literally. Use a drawn object that says what the person makes.
- A typing effect that screen readers announce letter by letter.
- Retyping on every scroll into view. It types on load and on request only.
