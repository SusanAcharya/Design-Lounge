<!-- Design Lounge Nº 489 · "Handwritten homepage" · designlounge.vercel.app -->

# Handwritten homepage

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The first page of Slip room, a fictional pottery workshop, written as a letter. A cream sheet sits on a warmer desk. Across the top is a short nav. The opening is a date, a two-line title, a salutation, two short paragraphs, and a signature. Three notes for three pieces of work sit in the right margin, spaced down the height of the letter. One word is struck in red and rewritten. Gochi Hand is only the nameplate, the title, the note titles, and the signature. Patrick Hand is every line a person reads: nav, date, salutation, paragraphs, note bodies, footer.

## Structure

```
1280 × 800, desk padding 28px 36px, sheet centred
┌──────────────────────────────────────────────────────────────────────────┐
│ Slip room (Gochi 34)              Letter   Work   Visit (Patrick 20)    │  head
│ ─ hairline ──────────────────────────────────────────────────────────── │
│ │ 4 October 2026 (blue)                  ┌ The quay mug ─────────────┐ │
│ │ Come by on                             │ one sentence               │ │
│ │ Thursday          h1, max 8.2em        └────────────────────────────┘ │
│ │ Dear friend,                                                              │
│ │ paragraph, 34ch                        ┌ Thursday hours  (−1.5°) ──┐ │
│ │ paragraph, 34ch                        │ one sentence               │ │
│ │ Tess                                   └────────────────────────────┘ │
│ │ at the slip room                       ┌ Twelve letters ───────────┐ │
│ ─ footer hairline ───────────────────────│ one sentence               │ │
│ Tess Pell, Cedar yard. Written by hand.  └────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
blue margin rule at 26px from the sheet's left, from 78px down to 52px up
```

- Desk is the page. Sheet is an `article`, width `min(1120px, 100%)`, radius 2px.
- Header is a flex row: nameplate (`div.mark`, not a paragraph) and `nav` labelled "Shop".
- The split is a grid: `minmax(0, 520px)` for the letter and `320px` for the notes, `justify-content: space-between`, gap 32px, items stretch.
- Notes are a `ul` with three `li`, each holding one `button.note`. The list is a column flex with `justify-content: space-between` and a 14px gap, so the three slips spread along the letter.
- Footer is one line under a hairline, margin-top 22px. It is not pushed by a growing empty region: the sheet is as tall as its content, and the desk centres that sheet.
- Semantic map: `article` > `header` (nameplate + `nav`) > letter `div#letter` + `ul#work` > `footer#visit`.

## Motion

| Element | Trigger | Property | From → to | Duration | Easing |
|---------|---------|----------|-----------|---------:|--------|
| Note | hover, pressed | background, border-color | slip / line → sheet / blue | 160ms | cubic-bezier(.2,.7,.2,1) |
| Note | active | transform | 0 → translateY(1px) | 160ms | same |
| Tilted note | active | transform | rotate(−1.5deg) → that plus translateY(1px) | 160ms | same |
| Nav link | hover, current | color | ink → blue | none (instant colour) | n/a |

No entrance animation. No looping animation. Reduced motion: every transition and animation duration is 1ms. The tilt is a resting position, not an animation, and it is removed below 900px.

## States

- **Nav rest:** ink `#1C2430`, no underline. **Current and hover:** blue `#1D4E89`. Initial current link is Letter.
- **Note rest:** slip fill `#F6F1E4`, 1px line border, radius 2px, extra sentence hidden. **Hover and pressed:** sheet fill, blue border. **Pressed** also shows the extra sentence in ink-2. **Active:** 1px down.
- **Second note only:** `rotate(-1.5deg)` at widths above 900px. The first and third notes are square to the page.
- **Correction:** the word "noon" is a `del` in red with a 2px strike. The word "ten" is an `ins` in red with no underline. Both stay Patrick Hand at the body size.
- **Focus-visible:** 2px solid blue, offset 3px, on links and note buttons. Remove the default outline only when `:focus-visible` replaces it.
- **Selection:** background blue, text sheet.

## Accessibility

- One `h1`: "Come by on Thursday". The nameplate is a `div`, not a second heading and not a paragraph in the script.
- Nav has `aria-label="Shop"`. Current page uses `aria-current="page"` on exactly one link.
- Each note is a `button type="button"` with `aria-pressed`. The extra line is a span with the `hidden` attribute while closed, so it leaves the accessibility tree.
- The struck word has `aria-hidden="true"` so the sentence is heard as "from ten", which is the corrected reading. The replacement remains an `ins`.
- Date is a `time` with `datetime="2026-10-04"`.
- Contrast, measured on the sheet `#FFFAF0` unless noted:

| Pair | Ratio | Where |
|------|------:|-------|
| `#1C2430` on `#FFFAF0` | 15.0:1 | body, titles, notes |
| `#1C2430` on `#F6F1E4` | 13.9:1 | note text on slip paper |
| `#1D4E89` on `#FFFAF0` | 8.1:1 | date, current nav |
| `#1D4E89` on `#F6F1E4` | 7.4:1 | blue on a slip, if a border is not enough |
| `#B42323` on `#FFFAF0` | 6.3:1 | the correction at 22px |
| `#3D4A5C` on `#FFFAF0` | above 7:1 | footer and the place line |

- Do not grey the footer down to `#6A6256` thinking it looks softer. `#3D4A5C` is the secondary ink that still clears 4.5:1 at 20px.
- Hit targets: nav links min-height 44px. Note buttons are the full slip, well above 44px.
- Focus order: Letter, Work, Visit, then the three notes. Enter or Space activates a note.

## Responsive rules

- ≥ 1280: as drawn. The sheet is centred. The first viewport shows the letter, all three notes, and the footer line.
- 1024 to 1279: same two columns. The letter column may shrink (`minmax(0, 520px)`). Title stays 52px until the 900px break. Paragraphs stay 34ch.
- 901 to 1023: still two columns if both fit. If the 320px note column plus the letter crowd the padding, allow the sheet to be `width: 100%`. Do not drop the tilt until 900px.
- ≤ 900: the desk is block layout, padding 12px. The split stacks. Notes follow the letter with margin-top 22px and gap 12px, top-aligned, not spaced apart. Remove the −1.5° tilt so a full-width slip cannot poke past the viewport. Title drops to 44px. The page may grow taller than 800px. It must not scroll sideways.
- < 640: same stack. Nav may wrap. The margin rule stays 12px from the sheet edge. Paragraph max-width remains 34ch so a wide phone in landscape does not grow a long line.
- Horizontal overflow is a failure at every width, including 800px. Test `documentElement.scrollWidth <= clientWidth`.

## Acceptance checklist

**Always**

- [ ] The page is a letter: date, salutation, a few short paragraphs, a sign-off, three notes, a one-line footer, and a short nav.
- [ ] Titles, the nameplate, note titles, and the signature use Gochi Hand at weight 400. Paragraphs, nav, buttons, and the footer use Patrick Hand at weight 400.
- [ ] No paragraph is set in Gochi Hand, Caveat, or another signature script.
- [ ] Letter-spacing is 0 on both families. Nothing uses uppercase styling.
- [ ] At most one element is tilted, and by no more than 2 degrees. Below 900px that tilt is removed.
- [ ] One blue ink and one red. Red appears only on the correction.
- [ ] Body measure stays near 34ch. Lines do not run the full viewport.
- [ ] Note buttons toggle `aria-pressed` and reveal one extra sentence. Opening one closes the others.
- [ ] Focus-visible is a 2px blue ring, offset 3px. Nav targets are at least 44px tall.
- [ ] Reduced motion shortens transitions to 1ms. There is no looping motion.
- [ ] At 800px wide, nothing overflows horizontally.

**This demo**

- [ ] Nameplate "Slip room". Title "Come by on Thursday". Salutation "Dear friend,".
- [ ] The correction reads noon struck and ten in red `#B42323`, inside the sentence about the kiln.
- [ ] Notes: "The quay mug", "Thursday hours" (the tilted one), "Twelve letters".
- [ ] Footer: "Tess Pell, Cedar yard. Written by hand."
- [ ] Date text "4 October 2026", colour `#1D4E89`.
- [ ] Desk `#EFE6D2`, sheet `#FFFAF0`, slip `#F6F1E4`, ink `#1C2430`.
- [ ] At 1280×800 the first frame shows the letter and the first note without scrolling, and the footer is on that same screen.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state at 1280×800: the sheet is centred on the desk and the whole page fits without scrolling. Nav reads Letter (current), Work, Visit. The letter and the first note, "The quay mug", are both fully visible. All three notes are visible. Each note's extra line is hidden. No note has `aria-pressed="true"`.
2. The title "Come by on Thursday" wraps to two lines because its max-width is 8.2em. Body lines wrap inside 34ch. They are not stretched across the sheet.
3. Hover a note: background becomes the sheet colour `#FFFAF0`, border becomes blue `#1D4E89`, over 160ms. Hover a nav link: colour becomes blue.
4. Click a note. That note sets `aria-pressed="true"`, border and background match the hover, and its hidden line appears. The other two notes close: `aria-pressed="false"` and their extra lines hide. Click the open note again to close it.
5. Click Letter, Work, or Visit. That link gets `aria-current="page"` and the others lose it. The browser follows the hash. Letter starts as the current link. Work and Visit do not open a note, because their targets are not buttons. If a nav target is itself a note button, open that note with the same toggle as a click.
6. Active (mouse down) on a note: it moves down 1px. The tilted note keeps its −1.5° while it moves.
7. Nothing loops. The red correction is static. Reduced motion: transitions last 1ms.
8. First-frame test at 1280×800, before any click: the `h1` bottom is above 800, the first `.note` bottom is above 800, and the footer bottom is above 800. The extra lines report `hidden === true` and `display: none`. If those lines are visible, a `display: block` rule is overriding the `hidden` attribute.
9. Sideways test at 800×800: `documentElement.scrollWidth <= clientWidth`. The page may be taller than 800. The letter and the first note should still both start inside the first viewport. The tilt is gone at this width.

## Tokens

```css
:root {
  --desk: #efe6d2;     /* page, the table under the sheet */
  --sheet: #fffaf0;    /* letter paper */
  --slip: #f6f1e4;     /* note paper, a step darker than the sheet */
  --ink: #1c2430;      /* text */
  --ink-2: #3d4a5c;    /* footer, place line, hidden note line */
  --line: #e2d5bc;     /* hairlines, note borders */
  --blue: #1d4e89;     /* the one blue ink: date, current link, focus, pressed border */
  --red: #b42323;      /* the one red: the crossed word and its replacement */
  --title: "Gochi Hand", cursive;
  --hand: "Patrick Hand", cursive;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --fast: 160ms;
  --radius: 2px;
  --shadow: 0 10px 24px -16px rgba(28, 36, 48, .2);
}
```

Load only those two families, weight 400, from one Google Fonts stylesheet. Do not request a bold weight. Set `font-synthesis: none` so the browser does not fake one.

Spacing on an 8px grid, with 4px and 2px only where a hairline needs them:

| Token | Value | Use |
|-------|------:|-----|
| 2 | 2px | place-line margin above the signature |
| 4 | 4px | gap under a note title |
| 6 | 6px | gap above a revealed note line |
| 8 | 8px | date margin-bottom |
| 10 | 10px | salutation margin-bottom, header padding-bottom |
| 12 | 12px | paragraph margin-bottom, footer padding-top, narrow desk padding |
| 14 | 14px | title margin-bottom, note-list gap |
| 16 | 16px | signature margin-top, note padding inline |
| 22 | 22px | header margin-bottom, footer margin-top, nav column gap |
| 26 | 26px | sheet padding-top |
| 28 | 28px | desk padding-top, header column gap |
| 32 | 32px | split gap |
| 36 | 36px | desk padding inline |
| 40 | 40px | sheet padding-right |
| 48 | 48px | sheet padding-left, so text clears the margin rule |

The margin rule is 1px wide, `rgba(29, 78, 137, .4)`, `left: 26px`, `top: 78px`, `bottom: 52px`. It starts under the header and stops above the footer. It is not a border on the text column.

Exact strings for this demo, in order:

- Nameplate: Slip room
- Nav: Letter, Work, Visit
- Date: 4 October 2026
- Title: Come by on Thursday
- Salutation: Dear friend,
- Paragraph: The kiln is on from noon ten. Bring the mug you want glazed, and a name for the bottom. ("noon" is the struck word, "ten" is the replacement.)
- Paragraph: I keep tea on until the last cup comes out. Push the door if it sticks.
- Signature: Tess
- Place: at the slip room
- Note 1 title / body / more: The quay mug / A white cup with one blue line, promised for the 18th. / The line is cobalt, laid on after the bisque.
- Note 2 title / body / more: Thursday hours / Ten until four. The door is the blue one on Cedar yard. / If you are late, leave the mug on the stone sill.
- Note 3 title / body / more: Twelve letters / A folded note for each seat at a winter supper. / The name goes on the outside, in blue ink.
- Footer: Tess Pell, Cedar yard. Written by hand.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Nameplate "Slip room" | Gochi Hand | 34px | 400 | 1 | 0 | sentence |
| Page title | Gochi Hand | 52px | 400 | 1.15 | 0 | sentence, max-width 8.2em |
| Note title | Gochi Hand | 28px | 400 | 1.15 | 0 | sentence |
| Signature "Tess" | Gochi Hand | 46px | 400 | 1 | 0 | name, a div, not a p |
| Nav link | Patrick Hand | 20px | 400 | 1 | 0 | sentence |
| Date | Patrick Hand | 20px | 400 | inherit | 0 | blue |
| Salutation | Patrick Hand | 24px | 400 | 1.45 | 0 | sentence |
| Body paragraph | Patrick Hand | 22px | 400 | 1.45 | 0 | sentence, max-width 34ch |
| Note body | Patrick Hand | 20px | 400 | 1.35 | 0 | one sentence |
| Place line and footer | Patrick Hand | 20px | 400 | 1.45 | 0 | ink-2 |

Letter-spacing on every one of these is 0. Do not add tracking to either hand. Do not set `text-transform: uppercase` on either hand. A paragraph, a link, a button label, and a footer line are Patrick Hand. Gochi Hand is a title, a nameplate, or a signature.

## Implementation notes

The demo is one HTML file. First line:

```
<!-- Design Lounge piece: handwritten-homepage · platform: web · 1280x800 -->
```

`html, body { height: 100%; margin: 0 }`. Viewport meta is `width=device-width`. The only external request is the Google Fonts stylesheet for `Gochi+Hand` and `Patrick+Hand`. No `<script src>`, no images, no fetches. Inline the open-note script at the end of `body`. Do not touch `localStorage`. Do not call `alert` or `console.log`.

Hover colour on the nav can be instant. The 160ms transition is for the note fill and border only. Keep the easing `cubic-bezier(.2, .7, .2, 1)`, not `ease` and not `linear`.

Sheet radius is 2px. Shadow is `0 10px 24px -16px rgba(28, 36, 48, .2)` and it belongs on the sheet only, not on each note. Notes separate themselves with the slip colour `#F6F1E4` and a 1px `#E2D5BC` border. A drop shadow on every slip starts to look like a card grid. One tilt, on Thursday hours, is enough to keep the three from reading as equal feature tiles.

The desk centres the sheet with `align-items: safe center`. At 1280×800 the sheet is shorter than the viewport, so a margin of desk shows around it and the footer is still on the first screen. Under 900px the desk switches to block layout so a stacked page starts at the top and can grow past 800px. Do not force `min-height: 100vh` on the sheet at that breakpoint. An empty cream band under a short letter is the failure that rule prevents.

Gochi Hand and Patrick Hand ship at weight 400 only. Do not set `font-weight: 700` on a note title to make it win. `font-synthesis: none` is there so the browser will not invent a bold. If a note title needs more presence, raise the size (28px is the note title) rather than the weight.

Selection colour is blue fill with sheet text: `background: #1D4E89; color: #FFFAF0`. It matches the ink already in the date, so a selected phrase does not introduce a new hue.

The focus ring is that same blue: 2px, offset 3px. This page has no filled blue button, so the ring does not need a second colour.

**Hidden lines must stay hidden.** A class that sets `display: block` overrides the user-agent rule for the `hidden` attribute. Close it again:

```css
.more { display: block; margin-top: 6px; color: var(--ink-2); }
.more[hidden] { display: none !important; }
```

**One open note.** Do not leave every slip expanded on load. The first frame is the short form.

```javascript
function openNote(btn) {
  var on = btn.getAttribute("aria-pressed") === "true";
  notes.forEach(function (b) {
    b.setAttribute("aria-pressed", "false");
    b.querySelector(".more").hidden = true;
  });
  if (!on) {
    btn.setAttribute("aria-pressed", "true");
    btn.querySelector(".more").hidden = false;
  }
}
```

**Hands.** Put Gochi Hand on `h1`, `.mark`, `.sign`, and `.nt` only. The signature is a `div`, not a `p`. If a stylesheet sets `p { font-family: Gochi Hand }`, the piece is wrong. Common mistakes: a hero headline in a script with a pill button under it; `letter-spacing: 0.08em` on the nav; small-caps or uppercase labels; tilting all three notes; a purple gradient on the desk; loading Caveat or Homemade Apple for the paragraphs; faking bold on a family that only has weight 400.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
