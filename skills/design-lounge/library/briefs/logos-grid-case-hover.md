<!-- Design Lounge Nº 239 · "Logos grid case hover" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Logos grid case hover

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A client logos section for **Hallam & Rowe**, a brand and interiors studio. Eight fictional client wordmarks sit in a 4 × 2 grid, split by brass hairlines on bone paper. Every wordmark is drawn in type or a small inline SVG, each in a different style, all in one near-black ink. Hover, focus or tap a cell and its content slides up by one full cell height: the wordmark leaves at the top and a one-line result comes in from below ("Shipped in 6 weeks"). Above the grid sits a 64px serif heading, "Trusted by *140* teams who build things to last." The feeling is a quiet hotel lobby wall. The detail worth copying is the two-row slide inside each cell: one transform, no fades, no swap of `display`.

This is not `logos-mono-marquee`. Nothing scrolls on its own here. The grid is still until a person asks.

## Reference behaviour

1. First frame: bone page. Kicker "HALLAM & ROWE · SELECTED CLIENTS" in dark brass. Heading on two lines at 64px Cormorant: "Trusted by *140* teams" / "who build things to last." The number is italic 500.
2. On the right of the heading, a 280px note: "Brand, interiors and digital work for hotels, makers and quiet software since 2014. Hover, focus or tap a name to read the result." Under it an "ALL CASE NOTES →" link with a brass underline.
3. The grid fills the rest of the frame. 1px solid brass rules at its top and bottom. Inside, 1px brass lines at 55% opacity between cells. No outer side borders.
4. Each cell shows a small index (01–08) in its top-left corner and the wordmark in the centre.
5. Hover a cell: its inner stack moves `translateY(-100%)` over 520ms with expo-out. The result face comes up. It has a slightly darker bone fill, a dark brass label ("ORLA · RETAIL"), a 30px serif line ("+64% online orders"), and a small "Read the note →".
6. Leave the cell: the stack slides back down on the same clock.
7. Keyboard focus a cell: same slide, plus a 1.5px ink frame inset 6px inside the cell.
8. Tap a cell on a touch screen: the first tap shows the result and does not follow the link. A second tap on the same cell follows the link. Tapping another cell closes the first.
9. The index stays fixed in the corner while the faces slide under it.
10. Reduced motion: the slide is instant. The result still replaces the wordmark.

## Structure

```
1280 × 800, section padding 64px 72px 56px, max-width 1280px
┌──────────────────────────────────────────────────────────────────────┐
│ HALLAM & ROWE · SELECTED CLIENTS                                      │
│ Trusted by 140 teams                         Brand, interiors and     │
│ who build things to last.     64px serif     digital work...  280px   │
│                                              ALL CASE NOTES →         │
│                                                              28px     │
├══════════════════╤═════════════════╤═════════════════╤════════════════┤ 1px brass
│ 01               │ 02              │ 03              │ 04             │
│  MAISON VERRE    │     orla.       │ Kestrel & Bow   │ (H) HALDEN     │ rows: minmax(180px,1fr)
│                  │                 │                 │                │
├──────────────────┼─────────────────┼─────────────────┼────────────────┤ 1px brass 55%
│ 05               │ 06              │ 07              │ 08             │
│  NORTH / QUAY    │     Sable       │   L U M E N     │   OSTRA        │
│                  │                 │   (outline)     │   ─HOTELS─     │
├══════════════════╧═════════════════╧═════════════════╧════════════════┤ 1px brass
└──────────────────────────────────────────────────────────────────────┘
```

Inside one cell:

```
┌───────────── cell, overflow hidden ─────────────┐
│ 06 (fixed)                                      │
│ ┌─ .slide, absolute inset 0, 2 rows of 100% ──┐ │
│ │ face 1: wordmark, centred                   │ │  ← visible at rest
│ ├─────────────────────────────────────────────┤ │
│ │ face 2: label / result / Read the note      │ │  ← visible on hover
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
translateY(0) at rest, translateY(-100%) on hover, focus or .on
```

- `<section aria-labelledby>` with an `h2`.
- `.head`: grid `minmax(0,1fr) auto`. Left: kicker `p`, `h2`. Right: note `p` with the link.
- `.grid`: `ul` with `aria-label="Clients and results"`, `grid-template-columns: repeat(4, minmax(0,1fr))`, `grid-auto-rows: minmax(180px, 1fr)`, `flex: 1` so it takes the rest of the height.
- Each `li` holds one `a.cell` with `href="#<client>"` and an `aria-label` like "Orla: +64% online orders".
- Inside the link: `.idx` (aria-hidden), and `.slide` with two `.face` spans.

## Tokens

```css
:root {
  /* colour */
  --bone: #efe9df;               /* page */
  --bone-2: #e7dfd2;             /* result face */
  --ink: #17150f;                /* wordmarks, heading, result line */
  --ink-2: #4b463c;              /* note, Read the note */
  --ink-3: #6e675a;              /* index numbers, slash in North/Quay */
  --brass: #a8874a;              /* outer rules, link underline (lines only) */
  --brass-ink: #755a2a;          /* kicker and result labels (text) */
  --brass-soft: rgba(168,135,74,.55);  /* inner cell lines */
  --focus: #17150f;

  /* type */
  --serif: "Cormorant", Georgia, serif;
  --sans: "Jost", system-ui, sans-serif;
  --fs-h2: 64px;
  --fs-result: 30px;
  --fs-note: 14px;
  --fs-label: 11px;
  --fs-index: 11px;

  /* space */
  --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-6: 24px; --s-7: 28px;
  --pad: 64px 72px 56px;
  --row-min: 180px;

  /* shape */
  --rule: 1px solid var(--brass);
  --rule-soft: 1px solid var(--brass-soft);
  --focus-frame: 1.5px solid var(--focus);
  --focus-inset: 6px;
  --radius: 0;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-slide: 520ms;
  --t-micro: 200ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Kicker | Jost | 11px | 500 | 1 | 0.28em | upper, `--brass-ink` |
| Heading | Cormorant | 64px | 400 (number italic 500) | 0.98 | -0.02em | sentence |
| Note | Jost | 14px | 400 | 1.6 | 0 | sentence |
| Note link | Jost | 11px | 500 | 1 | 0.14em | upper |
| Index | Jost | 11px | 400 | 1 | 0.12em | — |
| Result label | Jost | 11px | 500 | 1 | 0.24em | upper, `--brass-ink` |
| Result line | Cormorant | 30px | 500 | 1.05 | -0.01em | sentence |
| Read the note | Jost | 12px | 400 | 1.5 | 0 | sentence |

The eight wordmarks. Each one is a different typographic idea. All are `--ink`, no colour, no images.

| # | Mark | How it is drawn |
| --- | --- | --- |
| 01 | MAISON VERRE | Cormorant 500, `clamp(14px, 1.56vw, 20px)`, caps, 0.3em tracking, same left padding to keep it centred |
| 02 | orla. | Jost 700, 40px, -0.06em, lowercase, 8px round dot after it |
| 03 | Kestrel & Bow | Cormorant italic 400, 36px; the ampersand is 44px and drops 4px |
| 04 | (H) HALDEN | 38px SVG circle with an H drawn in 1.25px strokes, then Jost 500, 15px, 0.34em caps |
| 05 | NORTH / QUAY | system mono, 20px, 0.06em caps; the slash in `--ink-3` |
| 06 | Sable | Jost 300, 46px, -0.04em |
| 07 | LUMEN | inline SVG `text`, Jost 500, 34px, `textLength="138"`, no fill, 1px stroke (outline letters) |
| 08 | OSTRA / HOTELS | stacked: Cormorant 600, 30px, 0.08em caps; under it a 1px rule and Jost 10px, 0.5em caps |

Keep the eight optically equal. Wide marks are smaller, short marks are bigger. None should touch the cell edge at 1280.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Cell stack | hover, focus-visible, `.on` | `transform` | `translateY(0)` → `translateY(-100%)` | 520ms | expo | instant |
| Cell stack | leave, blur | `transform` | back to 0 | 520ms | expo | instant |
| Note link arrow | hover | `translateX` | 0 → 3px | 200ms | standard | instant |

No entrance animation. No stagger across cells. The grid is still on load.

## States

- Cell rest: wordmark face shows. Index in the corner.
- Cell hover: result face shows on `--bone-2`.
- Cell focus-visible: result face shows, plus a 1.5px ink frame inset 6px. The browser outline is off on the cell because the frame replaces it.
- Cell tapped once (`.on`): result face shows; the click is cancelled. Blur or a tap on another cell removes `.on`.
- Cell active (second tap or click): follows the link to the case note.
- Note link hover: arrow moves 3px right.
- Empty: with fewer than eight clients, use a 3 × 2 or 2 × 2 grid. Never leave an empty cell.
- Disabled: not used. Every cell has a result.

## Accessibility

- The grid is a `ul` with a label. Each cell is a link, so it is in tab order and works with Enter.
- Each link has an `aria-label` of "Client: result", for example "Maison Verre: Shipped in 6 weeks". Without it, the name reads twice (logo and label) plus "Read the note".
- The index number is `aria-hidden="true"`.
- The LUMEN SVG has `role="img"` and `aria-label="Lumen"`. Other SVG marks are `aria-hidden` next to real text.
- No hover-only content: the result shows on hover, on keyboard focus, and on first tap. All three paths are wired.
- Focus order: note link, then cells 01 to 08 left to right, top to bottom.
- Contrast: `#17150f` on `#efe9df` is about 15:1. `#4b463c` on `#efe9df` is about 7.8:1. Light brass `#a8874a` is only 2.5:1 on `#e7dfd2`, so it is used for lines only. Small brass text uses `#755a2a`: 5.3:1 on bone, 4.9:1 on the result face.
- Cells are at least 132px tall on phones, well over a 44px target.

## Responsive rules

- ≥1280: as drawn. 4 × 2, rows `minmax(180px, 1fr)`, padding 64px 72px 56px, heading 64px.
- 1024 (up to 1279): heading 56px so it stays on two lines. Maison Verre shrinks with its clamp to 16px. Nothing else changes.
- Up to 1023: padding 48px 40px, heading 52px, result line 25px. Wordmarks step down: orla 34px, Kestrel 30px, Sable 38px.
- 768 (up to 767): grid becomes 2 × 4. Reset the inner lines: left line on every even cell, top line on every cell after the first two.
- <640: padding 36px 20px. The head stacks: heading 42px, then the note. Rows are a fixed 132px. Result line 21px, label 10px, and "Read the note" is hidden. Wordmarks step down again so the widest fits a 175px cell.
- At every width, `scrollWidth` equals the viewport. Wordmarks never wrap inside a cell.
- Do not switch to a marquee on phones. The point is that every client is visible at once.

## Acceptance checklist

### Always

- [ ] Eight cells in a 4 × 2 grid at 768 and up, 2 × 4 under 768.
- [ ] Every wordmark is text or inline SVG, one ink colour, and each uses a different type idea.
- [ ] Brass rules: solid at the grid top and bottom, 55% between cells, none on the outer sides.
- [ ] Each cell slides its two-face stack by exactly one cell height with one transform.
- [ ] The slide works on hover, on keyboard focus, and on the first tap.
- [ ] A second tap follows the link. Tapping another cell closes the first.
- [ ] Focused cells show an ink frame inset 6px.
- [ ] Each link has an `aria-label` that reads "Client: result".
- [ ] Reduced motion makes the slide instant.
- [ ] No horizontal scroll at 390. No wordmark touches a cell edge at 1280.

### This demo

- [ ] Heading reads "Trusted by 140 teams who build things to last." with 140 in italic.
- [ ] Clients in order: Maison Verre, Orla, Kestrel & Bow, Halden, North Quay, Sable, Lumen, Ostra Hotels.
- [ ] Results: "Shipped in 6 weeks", "+64% online orders", "Four stores, one voice", "Won 3 tenders in a year", "Bookings up 2.3×", "Live in 11 markets", "Catalogue in 9 days", "Direct stays +41%".
- [ ] Labels read "CLIENT · SECTOR", for example "ORLA · RETAIL".

## Implementation notes

**1. The two-face stack.** The cell clips. The stack is two rows, each 100% of the cell. Moving the stack by -100% shows row two.

```css
.cell { position: relative; display: block; height: 100%; min-height: 180px; overflow: hidden; outline: none; }
.slide {
  position: absolute; inset: 0;
  display: grid; grid-template-rows: 100% 100%;
  transition: transform 520ms var(--expo);
}
.face { display: grid; place-items: center; padding: 24px; }
.res  { place-items: start; align-content: end; padding: 24px 28px 26px; background: var(--bone-2); gap: 8px; }
.cell:hover .slide,
.cell:focus-visible .slide,
.cell.on .slide { transform: translateY(-100%); }
.cell:focus-visible::after { content: ""; position: absolute; inset: 6px; border: 1.5px solid var(--focus); pointer-events: none; }
@media (prefers-reduced-motion: reduce) { .slide { transition: none; } }
```

**2. Tap first, follow second.** Safari does not focus a link on tap, and `:hover` on touch is unreliable. Catch the first touch click.

```js
document.querySelectorAll('.cell').forEach(c => {
  let touch = false;
  c.addEventListener('pointerdown', e => { touch = e.pointerType === 'touch'; });
  c.addEventListener('click', e => {
    if (!touch || c.classList.contains('on')) return;
    e.preventDefault();
    document.querySelectorAll('.cell.on').forEach(o => o.classList.remove('on'));
    c.classList.add('on');
  });
  c.addEventListener('blur', () => c.classList.remove('on'));
});
```

**3. Hairlines without doubles.** Draw left and top lines on each cell, then remove them on the first column and the first row. Reset at the 2-column breakpoint.

```css
.grid { border-top: 1px solid var(--brass); border-bottom: 1px solid var(--brass); }
.grid li { border-left: 1px solid var(--brass-soft); border-top: 1px solid var(--brass-soft); }
.grid li:nth-child(4n+1) { border-left: 0; }
.grid li:nth-child(-n+4) { border-top: 0; }
@media (max-width: 767px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid li:nth-child(n) { border-left: 1px solid var(--brass-soft); border-top: 1px solid var(--brass-soft); }
  .grid li:nth-child(2n+1) { border-left: 0; }
  .grid li:nth-child(-n+2) { border-top: 0; }
}
```

**4. Outline type in SVG.** `-webkit-text-stroke` looks different across browsers. An SVG `text` with `fill="none"` and a 1px stroke is steady and stays in `currentColor`. Use `textLength` instead of `letter-spacing`; spacing in SVG text can make letters collide while the web font loads.

```html
<svg viewBox="0 0 150 40" role="img" aria-label="Lumen">
  <text x="75" y="31" text-anchor="middle" font-family="Jost, sans-serif"
        font-size="34" font-weight="500" textLength="138" lengthAdjust="spacing"
        fill="none" stroke="currentColor" stroke-width="1">LUMEN</text>
</svg>
```

Common mistakes:

- Real client logos, or logo image files. Draw fictional marks in type.
- Grey logos that go to colour on hover. Everything stays in one ink.
- A fade or a flip instead of the vertical slide.
- Showing the result only on `:hover`. Focus and tap must work too.
- Swapping `display: none` between the faces. You lose the slide and it jumps.
- Box shadows or rounded cells. The cells are flat and square; only hairlines split them.
- Heavy 2px rules or solid brass between cells. The inner lines are 55%.
- Letting wide wordmarks like MAISON VERRE touch the cell edge. Check at 1280, at exactly 1024, and at 390. A `max-width: 1023px` query does not cover 1024.
- Gold gradients on the brass. Brass is one flat `#a8874a` for lines and `#755a2a` for small text.
- Setting the 11px kicker in the light brass. It fails contrast.

Rebuild order:

1. Bone page, kicker, heading with the italic count, note and link.
2. The grid with eight cells and the hairline rules.
3. Eight wordmarks, each its own style.
4. The two-face stack and the slide on hover and focus.
5. The focus frame.
6. Tap-first script.
7. Breakpoints at 1023, 767, 639.
8. Reduced motion.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
