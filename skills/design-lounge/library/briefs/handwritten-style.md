<!-- Design Lounge Nº 492 · "Letter hand kit" · www.designlounge.live -->

# Letter hand kit

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The reference sheet for this handwriting. An agent copying a Slip room page copies this, not a memory of a script font on a hero. The sheet states the rule in one sentence, then shows the two hands, a button, a text field, a card, and three prohibitions. Gochi Hand is for titles. Patrick Hand is for every line you read: the rule, the captions, the button, the field, the card body, and the prohibitions. Paper is warm. Blue ink is `#1D4E89`. Red is `#B42323` and it is only the "Do not" rail. The card is the only tilted thing, and only by 1°.

## Structure

```
1280 × 800, paper #F6F1E4, padding 32 48 28
┌────────────────────────────────────────────────────────────────────────────┐
│ Letter hand (Gochi 48, one line)     Titles are Gochi Hand, and every ... │
│ ─ hairline ────────────────────────────────────────────────────────────── │
│ ┌ Type ─────────────────────────────────┐  Button                          │
│ │ Come by on Thursday   Gochi 56        │  [ Write back ]  48px blue       │
│ │ Title hand. Gochi Hand, 56px, ...     │  48px tall. Patrick Hand. ...    │
│ │ The kiln is on from ten. ...   34ch   │                                  │
│ │ Body hand. Patrick Hand, 22px, ...    │  Field                           │
│ └───────────────────────────────────────┘  Name for the bottom             │
│                                            Tess  _______________           │
│ Card                                                                         │
│ ┌ Thursday hours  (−1°) ────────────┐    │ Do not                         │
│ │ Ten until four. The door sticks...│    │ - No tracking on the hand.     │
│ │ One note. Not a row of figures.   │    │ - No paragraph in the script.  │
│ └───────────────────────────────────┘    │ - No handwritten dashboard.    │
└────────────────────────────────────────────────────────────────────────────┘
```

- Header is a flex row, `justify-content: space-between`, `align-items: center`, gap 40px, 1px `#E2D5BC` border under it, padding-bottom 16px.
- Grid: `minmax(0, 1.35fr)` and `minmax(280px, 0.85fr)`, gap 26px 36px, `align-items: start`. Row one is specimen + side. Row two is card section + do-not section.
- Specimen panel: sheet fill, 1px line border, radius 2px, padding 18px 22px 16px.
- Side column is a flex column, gap 26px, padding-top 4px. Button block, then field block.
- The card `article` is separate from its section label, max-width 460px, so the tilt does not rotate the word "Card".
- Do-not block: max-width 420px, border-left 3px red, padding-left 16px. The list has no markers. Each item draws a dash with `::before`.

## Motion

| Element | Trigger | Property | From → to | Duration | Easing |
|---------|---------|----------|-----------|---------:|--------|
| Button | hover | background, border-color | #1D4E89 → #173F6E | 160ms | cubic-bezier(.2,.7,.2,1) |
| Button | pressed | background, border-color, color | blue / paper → ink / paper | 160ms | same |
| Button | active | transform | 0 → translateY(1px) | 160ms | same |

The card's −1° rotation is rest state, not a transition. No looping animation. Reduced motion: durations 1ms. The label still changes.

## States

- **Button rest:** min-height 48px, min-width 148px, padding 0 18px, radius 2px, border 1.5px solid blue, fill blue, text `#F6F1E4`. **Hover:** `#173F6E`. **Active:** 1px down. **Pressed:** fill and border `#1C2430`, label "Sent Thursday". **Focus-visible:** 2px outline in ink `#1C2430`, offset 3px, because a blue ring on a blue button disappears.
- **Field rest:** transparent background, no side borders, 1.5px ink bottom border, height 48px, radius 0. **Placeholder:** ink-2, opacity 1. **Focus-visible:** 2px blue outline, offset 3px. Caret colour blue. Do not turn the field into a filled rounded box.
- **Card rest:** sheet fill, 1px line border, radius 2px, padding 16px 18px 14px, the sheet shadow. **Tilt:** `rotate(-1deg)`, origin left center, only at `min-width: 901px`. No hover lift.
- **Do not:** red heading, red 3px rail, red 14×2 dashes. The sentences stay ink, not red, so red stays rare.
- **Links:** this sheet has none. Do not add a "Get started" pill.
- **Selection:** background blue, text sheet.

## Accessibility

- One `h1`: "Letter hand". Specimen title is an `h3`. Card title is an `h3`. Section labels are `h2` elements associated with their sections by `aria-labelledby`.
- The rule is a `p`, Patrick Hand. It is the sentence you read, so it must not be the `h1` and must not be Gochi Hand.
- Button is `type="button"` with `aria-pressed`. The accessible name changes with the label ("Write back" / "Sent Thursday").
- The input has a real `label for="mug"`. `autocomplete="off"`, `spellcheck="false"`, `maxlength="24"`. Do not use placeholder as the only name.
- Do-not items are list items. The dash is `::before` and empty, so it is not announced as an extra word. The sentence carries the meaning.
- Contrast:

| Pair | Ratio | Where |
|------|------:|-------|
| `#1C2430` on `#F6F1E4` | 13.8:1 | rule, body, do-not lines |
| `#1C2430` on `#FFFAF0` | 15.0:1 | specimen paragraph, card body |
| `#F6F1E4` on `#1D4E89` | 7.4:1 | button label |
| `#F6F1E4` on `#173F6E` | above 7:1 | button label on hover |
| `#F6F1E4` on `#1C2430` | 13.8:1 | pressed button |
| `#3D4A5C` on `#F6F1E4` | about 8:1 | 18px captions and placeholder |
| `#B42323` on `#F6F1E4` | 5.8:1 | "Do not" at 20px |

- The hover blue `#173F6E` is the same blue ink, darker. It is not a second accent. Do not swap it for a purple or a gradient.
- Hit targets: button and field are 48px. Section headings are text, not controls.
- Focus order: button, then the field. Headings are not tab stops.

## Responsive rules

- ≥ 1280: as drawn. Header is one line plus the rule beside it. Specimen title 56px. Card tilted −1°. First frame includes the specimen and the button.
- 1024: same columns. The specimen title may stay 56px. If "Come by on Thursday" wraps, let it wrap. Do not shrink the body below 22px.
- 901 to 1023: still two columns (`minmax(280px, 0.85fr)`). Page `height: 100%` applies from 901px up. Card still tilted. Page title stays `white-space: nowrap` only while the header is a row.
- ≤ 900: padding 16px, header becomes one column with gap 8px, grid becomes one column. Page title 44px and may wrap. Specimen title 44px. The caption still says "56px": that caption is the token for the 1280 sheet, and the responsive size is the exception. Remove the card tilt. The page grows taller than 800px. Order stays: rule, specimen, button, field, card, do-not lines.
- < 640: same stack. Field is `width: 100%` with `box-sizing: border-box`. The button does not use `white-space: nowrap`. Nothing may extend past the viewport.
- At 800px wide, test `scrollWidth <= clientWidth`. A −1° tilt on a full-width card fails that test. That is why the tilt starts at 901px.

## Acceptance checklist

**Always**

- [ ] The sheet shows the rule in one sentence, a title specimen, a body specimen, a button, a text field, a card, and three "do not" lines.
- [ ] Gochi Hand is used for titles only: page title, specimen title, card title. Weight 400.
- [ ] Patrick Hand is used for the rule, captions, section labels, button, field, card body, and the three prohibitions. Weight 400.
- [ ] No `p` is set in Gochi Hand, Caveat, or Homemade Apple.
- [ ] Letter-spacing is 0 on both families. No `text-transform: uppercase`.
- [ ] Button and field are 48px tall. Button radius is 2px. Field radius is 0. Field is a bottom border, not a box.
- [ ] One blue ink for labels, button, focus, and caret. Red is only the Do not rail, heading, and dashes.
- [ ] At most the card is tilted, by 1°, and only above 900px.
- [ ] The button toggles `aria-pressed` and its label. Focus-visible is visible on both the blue button and the field.
- [ ] The first frame at 1280×800 shows the specimen and the button.
- [ ] At 800px wide, nothing overflows horizontally.

**This demo**

- [ ] Rule text: "Titles are Gochi Hand, and every line you read is Patrick Hand."
- [ ] Specimen title: "Come by on Thursday" at 56px. Body: "The kiln is on from ten. Bring the mug you want glazed, and a name for the bottom."
- [ ] Button labels: "Write back" and "Sent Thursday".
- [ ] Field label: "Name for the bottom". Placeholder: "Tess".
- [ ] Card title: "Thursday hours". Card sentence mentions ten until four and the latch.
- [ ] The three lines are exactly: "No tracking on the hand." "No paragraph in the script." "No handwritten dashboard."
- [ ] Page `#F6F1E4`, sheet `#FFFAF0`, ink `#1C2430`, blue `#1D4E89`, red `#B42323`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state at 1280×800: page padding 32px 48px 28px. Header is one row. "Letter hand" is Gochi Hand at 48px on one line. To its right, the rule in Patrick Hand, max-width 36ch: "Titles are Gochi Hand, and every line you read is Patrick Hand." Below, a two-column grid. The left cell is the type specimen. The right cell starts with the button, so the specimen and the button are both in the first frame without scrolling. The card and the three "Do not" lines are also in that frame.
2. Specimen: an `h3` in Gochi Hand at 56px, "Come by on Thursday", then a caption, then a Patrick Hand paragraph at 22px inside 34ch, then a second caption. Captions are Patrick Hand at 18px in ink-2. They are not Gochi Hand.
3. Button rest: "Write back", 48px tall, blue fill, paper text, radius 2px, Patrick Hand 22px, sentence case. Hover: fill and border become `#173F6E`. Active: translateY(1px). Click: `aria-pressed` flips. Pressed label is "Sent Thursday", fill and border ink `#1C2430`, text still paper. Click again to return to "Write back".
4. Field: visible label "Name for the bottom", then a 48px writing line (bottom border only, no box). Placeholder "Tess" in ink-2. Caret is blue. Focus-visible: 2px blue outline, offset 3px. Max length 24. The value is Patrick Hand 22px.
5. Card: heading "Thursday hours" in Gochi Hand 32px, one Patrick Hand sentence, one hint. At widths above 900px the card rotates −1°. The "Card" label above it stays level.
6. "Do not" is red. Three lines, each with a 14×2px red dash: "No tracking on the hand." "No paragraph in the script." "No handwritten dashboard."
7. Reduced motion: transitions last 1ms. The button still toggles.
8. First-frame test at 1280×800: the specimen `h3` and the button both have bottoms under 800. The page title is one line (its height is about 53px at 48px type, not two stacked words). The card's computed transform is a −1° rotation. The button's `aria-pressed` is false and its text is "Write back".
9. Sideways test at 800×800: columns stack, the card is not rotated, and `scrollWidth <= clientWidth`. The specimen and the button are still both reachable without a horizontal scroll. The page may be taller than 800.

## Tokens

```css
:root {
  --paper: #f6f1e4;    /* page */
  --sheet: #fffaf0;    /* specimen panel and card */
  --ink: #1c2430;      /* text, pressed button, field line */
  --ink-2: #3d4a5c;    /* captions, hints, placeholder */
  --line: #e2d5bc;     /* hairline, panel border, card border */
  --blue: #1d4e89;     /* section labels, button, focus, caret */
  --blue-2: #173f6e;   /* button hover, same ink, darker */
  --red: #b42323;      /* Do not label, rail, dashes */
  --title: "Gochi Hand", cursive;
  --hand: "Patrick Hand", cursive;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --fast: 160ms;
  --radius: 2px;
  --control: 48px;
  --shadow: 0 10px 24px -16px rgba(28, 36, 48, .2);
}
```

Two families, weight 400 only. `font-synthesis: none`. `letter-spacing: 0` on `body`, and on `button` and `input` because those elements do not always inherit it. `text-transform: none` on `body`. Do not load a third family. Do not load Caveat or Homemade Apple.

Spacing:

| Token | Value | Use |
|-------|------:|-----|
| 2 | 2px | field padding under the glyphs, do-not block padding |
| 4 | 4px | gap under the specimen title, gap under the field label, side padding-top |
| 6 | 6px | gap under the card title |
| 8 | 8px | hint margin-top, do-not item margin, narrow header gap |
| 10 | 10px | section-label margin-bottom, dash gap, card hint margin-top |
| 14 | 14px | do-not dash length |
| 16 | 16px | specimen body margin-top, header padding-bottom, card padding, do-not padding-left, narrow page padding |
| 18 | 18px | specimen padding-top, button padding inline, card padding inline |
| 22 | 22px | page column gap, specimen padding inline |
| 26 | 26px | grid row gap, side column gap |
| 28 | 28px | page padding-bottom, header row gap |
| 32 | 32px | page padding-top |
| 36 | 36px | grid column gap |
| 40 | 40px | header gap when the rule sits beside the title |
| 48 | 48px | page padding inline, control height |

Control height is 48px for both the button and the field. Radius is 2px on the button, the specimen panel, and the card. The field radius is 0. The do-not dash is 14px by 2px, translated up 3px so it sits on the x-height. The do-not rail is 3px.

Exact strings:

- Title: Letter hand
- Rule: Titles are Gochi Hand, and every line you read is Patrick Hand.
- Specimen label: Type
- Specimen title: Come by on Thursday
- Caption: Title hand. Gochi Hand, 56px, tracking 0.
- Specimen paragraph: The kiln is on from ten. Bring the mug you want glazed, and a name for the bottom.
- Caption: Body hand. Patrick Hand, 22px, tracking 0.
- Button label, rest: Write back
- Button label, pressed: Sent Thursday
- Button hint: 48px tall. Patrick Hand. Sentence case.
- Field label: Name for the bottom
- Placeholder: Tess
- Field hint: A writing line, not a boxed dashboard field.
- Card label: Card
- Card title: Thursday hours
- Card body: Ten until four. The door sticks, so push near the latch.
- Card hint: One note. Not a row of figures.
- Do-not label: Do not
- Line 1: No tracking on the hand.
- Line 2: No paragraph in the script.
- Line 3: No handwritten dashboard.

The three lines are the law of the kit. "No tracking" means `letter-spacing: 0` on Gochi Hand and on Patrick Hand. "No paragraph in the script" means a `p` is Patrick Hand, never Gochi Hand, Caveat, or Homemade Apple. "No handwritten dashboard" means you do not add stat tiles, charts, or a grid of equal numbers in this hand. A single card with one sentence is the most chrome this language gets.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Page title | Gochi Hand | 48px | 400 | 1.1 | 0 | sentence, nowrap at ≥ 901px |
| Specimen title | Gochi Hand | 56px | 400 | 1.15 | 0 | sentence |
| Card title | Gochi Hand | 32px | 400 | 1.15 | 0 | sentence |
| Rule | Patrick Hand | 22px | 400 | 1.35 | 0 | one sentence, max-width 36ch |
| Section label (h2) | Patrick Hand | 20px | 400 | 1.2 | 0 | sentence, blue, except Do not |
| Specimen paragraph | Patrick Hand | 22px | 400 | 1.45 | 0 | sentence, max-width 34ch |
| Caption and hint | Patrick Hand | 18px | 400 | 1.3 | 0 | ink-2 |
| Button | Patrick Hand | 22px | 400 | 1 | 0 | sentence case |
| Field label | Patrick Hand | 20px | 400 | 1.45 | 0 | sentence |
| Field value | Patrick Hand | 22px | 400 | 1 | 0 | sentence |
| Do-not line | Patrick Hand | 22px | 400 | 1.3 | 0 | sentence |
| Card body | Patrick Hand | 20px | 400 | 1.4 | 0 | sentence, max-width 36ch |

Section labels are read, so they stay Patrick Hand even though they are headings. Gochi Hand is reserved for the page title, the specimen title, and the card's own title. The words "tracking 0" in the captions are the rule written out. The CSS value is `letter-spacing: 0`, which computes to `normal`. Do not "match the caption" by setting `letter-spacing: 0.12em`.

## Implementation notes

The demo is one HTML file. First line:

```
<!-- Design Lounge piece: handwritten-style · platform: web · 1280x800 -->
```

`html, body { height: 100%; margin: 0 }`. Viewport meta is `width=device-width`. The only external request is the Google Fonts stylesheet for `Gochi+Hand` and `Patrick+Hand`. No `<script src>`, no images, no fetches. The button script is inline. From 901px up, the page itself is `height: 100%` so the sheet fills the frame. Below that, height is auto so the stack can grow.

Do not set the specimen paragraph's font to Gochi Hand to make the sample "more consistent." The inconsistency is the point: 56px script title, 22px Patrick Hand paragraph under it.

Page radius is 2px on the specimen and the card. The button matches. The field does not: its radius stays 0 so the writing line stays a line.

**Split the hands in the selectors.** If `h2` inherits a title face, the section labels become script and the rule is lost.

```css
body { font: 22px/1.45 "Patrick Hand", cursive; letter-spacing: 0; font-synthesis: none; }
h1, h3 { font-family: "Gochi Hand", cursive; font-weight: 400; letter-spacing: 0; }
h2, p, button, label, input, li { font-family: "Patrick Hand", cursive; letter-spacing: 0; }
```

**Button focus on a blue fill.** The global ring is blue. On this button, switch the ring to ink or it vanishes into the fill.

```css
:focus-visible { outline: 2px solid var(--blue); outline-offset: 3px; }
.btn:focus-visible { outline-color: var(--ink); }
.btn[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: var(--paper); }
```

**Do not build the forbidden things while demonstrating them.** The third line says "No handwritten dashboard." Do not add a chart, a stat row, or a second button to balance the grid. The field hint may say it is not a boxed dashboard field. That sentence is Patrick Hand. Common mistakes: letter-spacing on the specimen "so the script breathes"; setting the 22px paragraph in Gochi Hand because it "looks more handmade"; a gradient button; a 12px radius; Caveat for the captions; tilting the specimen, the button, and the do-not list as well as the card.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
