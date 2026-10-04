---
title: "Handwritten night letter"
summary: "One night letter on a warm dark desk: date, salutation, three short paragraphs, a red margin note, a P.S., and a signature."
platform: web
type: screen
category: reading
tags: [letter, handwriting, reading, paper, night]
styles: [paper, editorial]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-04
palette: ["#1A1612", "#241E18", "#F3EAD8", "#9EC0EA", "#E08080"]
fonts: ["Gochi Hand", "Patrick Hand"]
related: [handwritten-homepage, handwritten-style]
---

# Handwritten night letter

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A single letter from Tess at Slip room to Ada, read at night. The desk is warm and dark. The sheet is a slightly lighter brown. Ink is a light cream. This is a reading page, not a homepage: no nav, no row of cards. It has a letterhead, a date, a salutation, three short paragraphs, a P.S., and a signature. A red margin note points at one sentence. Gochi Hand is the letterhead and the signature. Patrick Hand is everything you read, including the salutation, the paragraphs, the P.S., and the margin note. The palette is the night pair of the day letter, not the same cream page.

## Reference behaviour

1. Initial state at 1280×800: the sheet is centred on the desk (`align-items: safe center`). The top of the letter is in frame. The date "4 October 2026" and the salutation "Dear Ada," are visible. The whole letter, including the P.S. and the signature, also fits. The margin note "not the green tin" is visible in red, to the right of the second paragraph, rotated −1.5°. `aria-pressed` is false. The pointed sentence has no underline yet.
2. Paragraphs wrap inside 40ch. The sheet is 760px wide so the right side of the sheet can hold the note without the lines growing to fill it.
3. The note's arrow points left, at the sentence "Bring the blue glaze, not the green". The note sits about 26px below the top of that paragraph so it lines up with the sentence, not with the first words.
4. Click the note. `aria-pressed` becomes true. The note text gains a 1px underline, offset 3px. The sentence gains an inset blue underline: `box-shadow: inset 0 -2px 0 #9EC0EA`. Click again to clear both.
5. Keyboard: Tab reaches the note (the only control). Enter or Space toggles it. Focus-visible is a 2px blue ring, offset 3px.
6. Nothing loops. Reduced motion: transitions last 1ms. The tilt does not animate in.
7. First-frame test at 1280×800: the date and the salutation have `top` well under 800. The sheet is vertically centred, so a band of desk shows above and below. The note's left edge is to the right of the pointed sentence's right edge. They share a vertical range. The arrow points left.
8. Sideways test at 800×800: the note is under the sentence, the arrow points up, and `scrollWidth <= clientWidth`. The paragraph with the note still wraps inside 40ch.

## Structure

```
1280 × 800, desk #1A1612, sheet centred, width min(760px, 100%)
┌────────────────────────────────────────────────────────────┐
│ │ Slip room                         letterhead, Gochi 34   │
│ │ 4 October 2026                    date, blue, Patrick 20 │
│ │ Dear Ada,                         salutation, Patrick 28 │
│ │                                                          │
│ │ The kiln cooled overnight. The quay mug came out whole. │
│ │                                                          │
│ │ The blue line held. Bring the blue glaze,   ← not the   │
│ │ not the green, on Thursday.                    green tin │
│ │                                                          │
│ │ A cup with your initial waits on the shelf. ...         │
│ │ P.S. The door still sticks. Push near the latch.        │
│ │ Tess                              signature, Gochi 48   │
└────────────────────────────────────────────────────────────┘
margin rule: 1px, rgba(158,192,234,.5), 28px from the sheet's left
```

- Page: a flex desk, min-height 100%, centred both ways with `align-items: safe center` so a taller letter starts at the top instead of clipping.
- Sheet: `article` width `min(760px, 100%)`, padding `36px 40px 40px 52px`, radius 2px, shadow `0 16px 36px -18px rgba(0,0,0,.6)`.
- Letterhead is the only `h1`. Date, salutation, paragraphs, and P.S. are `p` elements in Patrick Hand. Signature is a `div`.
- The second paragraph and the note share a grid: `minmax(0, 40ch)` and `168px`, column gap 18px, row gap 8px. The paragraph's own max-width is also 40ch, so a narrow layout cannot stretch that sentence across the sheet.
- The note is a `button` in column 2, margin-top 26px, width 168px.
- Other paragraphs are `max-width: 40ch` and margin-bottom 16px. They line up with the first grid column.

## Tokens

```css
:root {
  --desk: #1a1612;     /* night desk, page background */
  --sheet: #241e18;    /* letter paper, lighter than the desk */
  --ink: #f3ead8;      /* body, letterhead, signature */
  --ink-2: #cbbfa8;    /* spare secondary; do not use the dimmer #8d8070 for text */
  --line: #3a3128;     /* unused hairline, kept for borders if you add one */
  --blue: #9ec0ea;     /* date, focus, sentence underline, margin rule */
  --red: #e08080;      /* margin note only */
  --title: "Gochi Hand", cursive;
  --hand: "Patrick Hand", cursive;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --fast: 160ms;
  --radius: 2px;
  --measure: 40ch;
}
```

`#8D8070` fails 4.5:1 on the sheet (about 4.3:1). Do not use it for the date, the note, or body text. Secondary text, if you add any, is `--ink-2`.

Spacing:

| Token | Value | Use |
|-------|------:|-----|
| 4 | 4px | extra margin above the P.S. |
| 6 | 6px | gap between the arrow and the note words |
| 8 | 8px | signature margin-top, grid row gap, note padding |
| 12 | 12px | date margin-bottom |
| 16 | 16px | salutation margin-bottom, paragraph margin-bottom, narrow desk padding |
| 18 | 18px | letterhead margin-bottom, grid column gap |
| 26 | 26px | note margin-top, to meet the second line of the paragraph |
| 28 | 28px | desk padding, margin-rule inset, narrow sheet padding |
| 32 | 32px | margin rule top and bottom inset on the wide sheet |
| 36 | 36px | sheet padding-top |
| 40 | 40px | sheet padding-right and padding-bottom |
| 52 | 52px | sheet padding-left |

The margin rule is 1px, `rgba(158, 192, 234, .5)`, inset 28px from the sheet edges on the wide layout, and 14px from the left under 900px.

Exact strings:

- Letterhead: Slip room
- Date: 4 October 2026
- Salutation: Dear Ada,
- Paragraph 1: The kiln cooled overnight. The quay mug came out whole.
- Paragraph 2: The blue line held. Bring the blue glaze, not the green, on Thursday.
- Pointed span, inside paragraph 2: Bring the blue glaze, not the green
- Margin note: not the green tin
- Paragraph 3: A cup with your initial waits on the shelf. Tea is at ten if the bus is kind.
- P.S.: P.S. The door still sticks. Push near the latch.
- Signature: Tess

Arrow geometry, 24px grid, drawn at 22px, stroke 1.5, round caps, `currentColor`:

```
M19 12H6
M6 12l5-5
M6 12l5 5
```

That is a shaft to the left and two barbs. Do not replace it with a less-than sign or an emoji. On the narrow layout, rotate this SVG 90° so the shaft points up. Do not rotate the paragraph.

Load Gochi Hand and Patrick Hand only, both weight 400. `font-synthesis: none`. Letter-spacing 0 on `body`, and again on the button so a user-agent button style cannot add tracking.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Letterhead | Gochi Hand | 34px | 400 | 1.1 | 0 | sentence |
| Signature | Gochi Hand | 48px | 400 | 1 | 0 | a name, not a paragraph |
| Date | Patrick Hand | 20px | 400 | 1.5 | 0 | blue |
| Salutation | Patrick Hand | 28px | 400 | 1.25 | 0 | sentence |
| Paragraph and P.S. | Patrick Hand | 22px | 400 | 1.5 | 0 | sentence, 40ch |
| Margin note | Patrick Hand | 20px | 400 | 1.25 | 0 | sentence, red |

"P.S." is the ordinary abbreviation inside the Patrick Hand paragraph. It is not a styled uppercase heading and not Gochi Hand. Do not set the salutation in Gochi Hand: it is a line you read. Do not letter-space the note to make it look more handwritten.

## Motion

| Element | Trigger | Property | From → to | Duration | Easing |
|---------|---------|----------|-----------|---------:|--------|
| Pointed sentence | note pressed | box-shadow | none → inset 0 −2px 0 blue | 160ms if you transition it | cubic-bezier(.2,.7,.2,1) |
| Note label | pressed | text-decoration | none → underline, offset 3px, thickness 1px | instant is fine | n/a |

The −1.5° tilt is the note's rest transform, origin `left top`. It does not animate on load. Reduced motion: any transition duration is 1ms. The underline still appears.

## States

- **Note rest:** transparent background, no border, red `#E08080`, arrow plus the words "not the green tin", rotated −1.5°. Min-height 44px.
- **Note pressed:** same colour and tilt, plus an underline on the button. The sentence `#sent` has class `on`.
- **Sentence rest:** cream ink, no decoration. **On:** a 2px blue underline drawn with an inset shadow, not a background gradient.
- **Focus-visible:** 2px solid `#9EC0EA`, offset 3px. The button must not lose this ring when pressed.
- **Selection:** background blue, text desk `#1A1612`.
- There is no hover fill. A filled red chip would spend the red ink twice. Red is the note. Blue is the date, the rule, the focus ring, and the pressed underline.

## Accessibility

- The sheet is an `article` labelled by the `h1` "Slip room" (`aria-labelledby`).
- The note is a `button` with `aria-pressed` and `aria-controls="sent"`. The sentence is a `span` with that id, inside the second paragraph.
- The arrow is an inline SVG, 24px viewBox, 22px rendered, stroke 1.5, `currentColor`, `aria-hidden="true"`. The accessible name is the text "not the green tin".
- Date is a `time` with `datetime="2026-10-04"`.
- Contrast on the sheet `#241E18`:

| Pair | Ratio | Where |
|------|------:|-------|
| `#F3EAD8` on `#241E18` | 13.8:1 | paragraphs, letterhead, signature |
| `#F3EAD8` on `#1A1612` | 15.1:1 | if any text sits on the desk |
| `#9EC0EA` on `#241E18` | 8.8:1 | date, focus ring, pressed underline |
| `#E08080` on `#241E18` | 5.9:1 | margin note at 20px |
| `#CBBFA8` on `#241E18` | 9.1:1 | spare secondary ink |
| `#8D8070` on `#241E18` | 4.3:1 | fails. Do not use it |

- Do not put the red note on a red wash. The sheet behind the note stays `#241E18`.
- The only tab stop is the margin note. Reading order is letterhead, date, salutation, paragraph one, paragraph two, the note, paragraph three, P.S., signature. Keep the note after the sentence in the DOM even though it sits in the right column.
- `safe center` keeps the date on screen if the letter is ever taller than the viewport. Do not use plain `center`, which can clip the salutation.

## Responsive rules

- ≥ 1280: sheet 760px, centred. Note in the right column, rotated −1.5°, arrow pointing left.
- 1024: same. The desk padding is 28px. The sheet does not grow past 760px, so the measure stays 40ch on a wide monitor.
- 901 to 1023: same two-column note if the 168px column still fits inside the sheet. It does, down to the 900px break.
- ≤ 900: desk padding 16px. Sheet padding `28px 18px 28px 28px`. The grid becomes one column. The note loses its tilt (`transform: none`), width auto, max-width 220px, margin-top 8px. The arrow SVG rotates 90° so it points up at the sentence now above it. Paragraph max-width stays 40ch.
- < 640: same stack. The 40ch measure is the line length, not the sheet width. A full-width paragraph on a phone in landscape is a failure.
- At 800px wide, `scrollWidth` must not exceed `clientWidth`. The tilted note is the usual cause; that is why the tilt is removed at this break.

## Acceptance checklist

**Always**

- [ ] One letter: letterhead, date, salutation, three short paragraphs, a P.S., a signature, and one margin note.
- [ ] Letterhead and signature are Gochi Hand. Salutation, paragraphs, P.S., date, and the margin note are Patrick Hand.
- [ ] No paragraph uses Gochi Hand, Caveat, or another signature script.
- [ ] Letter-spacing is 0. No uppercase styling on either hand.
- [ ] Measure is 40ch on every paragraph, including the one with the note, at every breakpoint.
- [ ] The margin note is red, points at one sentence, and toggles an underline on that sentence.
- [ ] Tilt is −1.5° on the note only, and only above 900px.
- [ ] Palette is the night desk, not the cream day page. One blue, one red.
- [ ] Focus-visible is 2px blue, offset 3px. The note's hit area is at least 44px tall.
- [ ] The first frame shows the date and the salutation.
- [ ] At 800px wide, nothing overflows horizontally.

**This demo**

- [ ] Letterhead "Slip room". Date "4 October 2026" in `#9EC0EA`. Salutation "Dear Ada,".
- [ ] Paragraph one: "The kiln cooled overnight. The quay mug came out whole."
- [ ] Pointed sentence: "Bring the blue glaze, not the green". Note text: "not the green tin".
- [ ] Paragraph three mentions the cup on the shelf and tea at ten. P.S. mentions the door and the latch.
- [ ] Signature text is "Tess".
- [ ] Desk `#1A1612`, sheet `#241E18`, ink `#F3EAD8`, red `#E08080`.
- [ ] Pressed sentence underline is blue, 2px, inset. The note itself stays red.

## Implementation notes

The demo is one HTML file. First line:

```
<!-- Design Lounge piece: handwritten-letter · platform: web · 1280x800 -->
```

`html, body { height: 100%; margin: 0 }`. Viewport meta is `width=device-width`. The only external request is the Google Fonts stylesheet for `Gochi+Hand` and `Patrick+Hand`. No `<script src>`, no images, no fetches. The toggle script is inline. Do not read storage. Do not draw a lamp glow, a status bar, or a second sheet behind this one.

`align-items: safe center` is required. Plain `center` will clip "Dear Ada," if the copy ever runs long. If `safe` is unsupported, use `flex-start` with 28px padding rather than clipping the date.

Sheet radius is 2px. Shadow is `0 16px 36px -18px rgba(0, 0, 0, .6)`. That is the only shadow. The margin rule is the blue ink at rest, before anyone presses the note.

**Put the note in a grid, not in a float that collides with the next paragraph.**

```css
.with-note {
  display: grid;
  grid-template-columns: minmax(0, 40ch) 168px;
  gap: 8px 18px;
  align-items: start;
}
.with-note p { margin: 0; max-width: 40ch; }
.callout {
  margin-top: 26px;
  width: 168px;
  color: var(--red);
  transform: rotate(-1.5deg);
  transform-origin: left top;
}
```

**The arrow is a short stroke, not a character.** 24-grid, 1.5 stroke, pointing left. At the narrow break, rotate the SVG 90° and un-rotate the button. Rotating a full-width button by even 1° on an 800px screen makes `scrollWidth` larger than the viewport.

```javascript
btn.addEventListener("click", function () {
  var on = btn.getAttribute("aria-pressed") === "true";
  btn.setAttribute("aria-pressed", on ? "false" : "true");
  sent.classList.toggle("on", !on);
});
```

```css
#sent.on { box-shadow: inset 0 -2px 0 var(--blue); }
```

Common mistakes: setting "Dear Ada," in Gochi Hand; painting the night page with the day cream palette; a glowing lamp blob behind the sheet; letter-spacing on the red note; using `#8D8070` for the date; letting the second paragraph go full width under 900px because the grid column became `1fr`.
