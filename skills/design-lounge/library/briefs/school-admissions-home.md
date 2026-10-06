<!-- Design Lounge Nº 392 · "School admissions home" · www.designlounge.live -->

# School admissions home

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The home page of Ashcombe Vale College, a made-up day and boarding college for Grades 11 and 12. It is a long, scrolling page aimed at parents and students who are deciding where to apply for the 2027 intake. The ground is warm cream, the ink is navy, and two loud colours are rationed: tomato for the main action and the deadline, mustard for the next date, the scholarship note, and small dots. Headings are set in a book serif, everything else in a geometric sans. The detail worth copying: the campus drawing and the section icons are built only from circles, squares, and triangles in the four brand colours, so the page feels like a school with a point of view rather than a stock template.

## Structure

```
1280 wide, page scrolls, container 1200 max, 40px side padding
+--------------------------------------------------------------------------+
| [logo] Ashcombe Vale        Programmes Admissions Fees Life Parents [Apply]| 68 sticky
+--------------------------------------------------------------------------+
| . ADMISSIONS 2027 . GRADES 11 AND 12      |  +------------------------+   |
| Two years to find out                     |  |  sun   tower           |   |
| what *your* mind is for.        56px      |  |    hall   wing  flag   |   |
| lede 19px                                 |  |  ground band + road    |   |
| [Apply for 2027 ->] [Book a campus visit] |  +------------------------+   |
| 1,140 students | 14 per teacher | 38 clubs |      1.12fr : .88fr         |
+--------------------------------------------------------------------------+
| . KEY DATES   The 2027 intake, start to finish                            |
| o-----------o-----------<>-----------o-----------o    5 equal columns     |
+--------------------------------------------------------------------------+
| . PROGRAMMES  Choose a stream...         [All][Science][Arts][Commerce]   |
| [card][card][card]  x3 rows, gap 20                                       |
+--------------------------------------------------------------------------+
| . FEES  What a year costs  table 1.6fr      | Scholarships card 1fr        |
+--------------------------------------------------------------------------+
| . STUDENT LIFE  [38][11 inverted][220][96%]  one framed strip             |
+--------------------------------------------------------------------------+
| . FOR PARENTS  FAQ x5           | . ENQUIRE  form, 2 columns              |
+--------------------------------------------------------------------------+
| navy footer                                                              |
+--------------------------------------------------------------------------+
```

- `header.top` is sticky, with `a.logo`, `nav aria-label="Main"`, and the Apply link styled as a button.
- `main` holds six `section` elements, each with `aria-labelledby` pointing at its `h2`. Sections are split by a 1px `--line` top border and 72px vertical padding.
- The hero facts are a `dl`. The campus drawing is one inline `svg` with `role="img"` and an `aria-label`.
- Key dates is an `ol` with `time datetime` in each item.
- Filter chips are a `role="group"` of buttons with `aria-pressed`. Cards are an `ul` of `li.card`; hidden cards get the `hidden` attribute.
- Fees is a real `table` with `caption`, `th scope="col"` and `th scope="row"`. The scholarship card is an `aside`.
- Student life is an `ul` of four `li`.
- FAQ uses native `details` and `summary`.
- The form uses `label for`, `aria-describedby` to error spans, and a `role="status"` paragraph for the thank-you.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Anchor jumps | click nav or CTA | scroll | - | browser smooth | - | `scroll-behavior: auto` |
| Button press | active | translateY | 0 → 1px | 150ms | `--ease` | no transition |
| Button hover | hover | background | fill → darker or navy | 150ms | `--ease` | no transition |
| FAQ icon | open/close | rotate, background | 0 → 45deg, none → mustard | 240ms | `--ease` | instant |
| Filter | chip click | cards show/hide | - | instant | - | same |

Nothing animates on load. The page is calm on purpose.

## States

- Primary button: tomato fill, white text. Hover `#ad3522`. Active moves down 1px.
- Secondary button: 2px navy outline, transparent. Hover fills navy with cream text.
- Nav link: hover shows a 2px mustard underline.
- Chip: 1.5px navy outline. Hover `--sand` fill. Pressed navy fill, cream text.
- Card: no hover lift. Cards are information, not links.
- Timeline dot: default hollow navy circle 20px. Next: mustard fill. Deadline: tomato square rotated 45deg.
- FAQ: closed shows a plus in a 28px ring. Open rotates it to a cross and fills mustard.
- Input: 1.5px `--line` border, white fill, 46px tall. Focus: navy border plus a 3px `--mustard-bg` ring. Error: tomato border, message in `#b23a24` 13px.
- Success: status paragraph appears with `--mustard-bg` fill and 6px radius. Empty, it is `display: none`.
- Focus-visible on links and buttons: 2px tomato outline, offset 3px.

## Accessibility

- One `h1`. Each section has an `h2`, and `aria-labelledby` ties the section to it.
- The campus `svg` has `role="img"` and a one-sentence label. All icon SVGs are `aria-hidden="true"`.
- Chips use `aria-pressed`. The count line under them is `aria-live="polite"` so the result is announced.
- Hidden cards use the `hidden` attribute, so they leave the accessibility tree.
- The fees table has a caption and row and column headers.
- FAQ uses native `details`, so Enter and Space toggle it with no script.
- Every input has a visible label. Errors are linked with `aria-describedby`, the field gets `aria-invalid="true"`, and focus moves to the first bad field.
- The thank-you message is `role="status"`.
- Contrast: navy `#1b2a4a` on cream is about 13:1. `#5f6a80` on cream is about 5:1. White on tomato `#c8402a` is about 5:1. Do not lighten the tomato; `#d9482f` drops under 4.5:1.
- Buttons are 48px tall (40px in the nav). Chips are 40px. Checkbox is 20px with the whole label clickable.

## Responsive rules

- 1280 and up: as drawn. Container 1200px, 40px side padding.
- 1024 (up to 1100): nav link gap 16px, h1 46px, student life becomes 2x2.
- 768 (up to 900): nav links hide; logo and Apply stay. Hero, fees, and FAQ+form stack to one column with 40px gap. Programmes grid becomes 2 columns. Hero drawing sits under the text.
- Under 640 (up to 767): side padding 20px, section padding 52px, h1 38px, h2 30px, lede 17px. Timeline turns vertical: the line runs down the left at 10px, dots sit on it, text indents 40px. Programmes, student life, and the form go to one column. The "Lab or studio" column hides; the per-year total stays. The logo subline hides.
- At 390 nothing overflows sideways. Every grid uses `minmax(0,1fr)`.

## Acceptance checklist

### Always

- [ ] Four colours only: cream ground, navy ink, tomato and mustard in small doses. Tomato marks the main action and the deadline.
- [ ] Headings in the serif, body in the geometric sans. One italic word in the h1.
- [ ] Radius is 6px on buttons, cards, inputs, and the drawing. No pill shapes.
- [ ] The illustration and icons use only circles, squares, and triangles. Inline SVG, no images.
- [ ] Two hero actions: apply (filled) and visit (outline).
- [ ] The timeline marks the next date and the deadline differently from the rest, not by colour alone (diamond vs circle, plus a "Next" tag).
- [ ] Filters use `aria-pressed` and a live count line.
- [ ] Form errors show per field, and focus moves to the first one.
- [ ] Timeline goes vertical under 768. No horizontal scroll at 390px.

### This demo

- [ ] College name Ashcombe Vale, est. 1962. Headline "Two years to find out what your mind is for."
- [ ] Facts: 1,140 students, 14 per teacher, 38 clubs.
- [ ] Five dates from 1 Nov 2026 to 15 Mar 2027. Deadline 31 Jan 2027.
- [ ] 9 programmes, 3 per stream. Science, Arts, Commerce.
- [ ] Fees per year 186,000, 155,000, 156,000 NPR, admission 25,000.
- [ ] Sixty merit scholarships of 25-100 percent.
- [ ] Five FAQ items. The first is open.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 1280x800: sticky nav, the hero (headline, lede, two buttons, three facts, campus drawing), and the top of Key dates with the timeline line in view.
2. The nav is sticky at the top, 68px tall, with a 1px hairline under it. It holds the logo, five links, and an "Apply for 2027" button in tomato.
3. Hero buttons: "Apply for 2027" (tomato fill, arrow icon) and "Book a campus visit" (navy 2px outline, calendar icon). Both jump to the enquiry form. Scrolling is smooth unless reduced motion is on.
4. Key dates shows five dates on one horizontal line: 1 Nov 2026 Applications open, 12-13 Dec Open days, 31 Jan 2027 Deadline, 20 Feb Entrance test, 15 Mar Results.
5. The next date (Applications open) has a mustard dot and a "Next" tag. The deadline has a tomato diamond instead of a circle. Other dates have hollow navy circles.
6. A line above the timeline reads "Today is 3 October 2026. Applications open in 29 days."
7. Programmes shows 9 cards in a 3-column grid, three per stream. Filter chips sit top right: All, Science, Arts, Commerce. All starts pressed.
8. Clicking a chip shows only that stream's 3 cards and updates the count line, for example "Showing 3 programmes in Science". All restores 9. The count line is a polite live region.
9. Each card shows a stream mark (navy circle for Science, tomato triangle for Arts, mustard square for Commerce), the stream name, the programme name, its subjects, then seats and "2 years" under a hairline.
10. Fees shows a table: Science, Arts, Commerce, and a one-off admission fee. Columns: Per term, Lab or studio, Per year. Per year is term times three plus lab. A caption under the table says amounts are in NPR and boarding adds NPR 210,000 a year.
11. Beside the table, a mustard-tint scholarship card explains merit and need-based aid, with a link to the FAQ.
12. Student life is a 4-cell strip inside one navy 1px frame: 38 clubs, 11 sports teams, 220 boarding places, 96% go on to university. The second cell is inverted (navy ground, cream text).
13. Parent FAQ has five questions in `details` elements. The first starts open. Its round plus icon rotates 45 degrees and fills mustard when open.
14. The enquiry form sits beside the FAQ: Parent name, Email, Phone, Student enters (select), I would like to (select), Message, a prospectus checkbox, and "Send enquiry".
15. Submitting with errors marks each bad field with a tomato border and a message under it, and moves focus to the first bad field. Required: name (2+ characters), email (has @ and a dot), grade.
16. A valid submit shows a mustard-tint status line: "Thank you, [name]. We have your request to [choice]. Admissions will reply within two working days."
17. Footer is a navy band with the address, office hours, email, and phone.

## Tokens

```css
:root {
  /* ground */
  --cream: #f4eee1;      /* page */
  --paper: #fbf8f1;      /* cards, form, life cells */
  --sand: #e8dfcc;       /* drawing ground, chip hover */
  --line: #d6cbb4;       /* hairlines, input borders */

  /* ink */
  --navy: #1b2a4a;       /* text, frames, buttons outline */
  --navy-2: #34466e;     /* italic word, drawing wing */
  --ink-2: #46526b;      /* lede, card body */
  --ink-3: #5f6a80;      /* captions, meta */

  /* rationed accents */
  --tomato: #c8402a;     /* primary action, deadline, focus */
  --mustard: #e2a72e;    /* next date, eyebrow dots, open FAQ icon */
  --mustard-bg: #f6e6bd; /* scholarship card, tags, success, input glow */

  --serif: "Libre Caslon Text", Georgia, serif;
  --sans: "Jost", system-ui, sans-serif;

  /* type scale */
  --t-12: 12px; --t-13: 13px; --t-14: 14px; --t-15: 15px; --t-16: 16px;
  --t-17: 17px; --t-19: 19px; --t-22: 22px; --t-24: 24px; --t-30: 30px;
  --t-36: 36px; --t-56: 56px;

  /* spacing, 4px base */
  --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px;
  --s-7: 28px; --s-8: 32px; --s-10: 40px; --s-14: 56px; --s-18: 72px;

  --r: 6px;              /* buttons, cards, inputs, drawing */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --fast: 150ms;
  --med: 240ms;
}
```

No shadows except the 3px mustard-tint focus glow on inputs. No gradients.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Hero h1 | Libre Caslon Text | 56px | 400 | 1.06 | -0.01em | sentence, one italic word |
| Section h2 | Libre Caslon Text | 36px | 400 | 1.15 | -0.01em | sentence |
| Card h3 | Libre Caslon Text | 22px | 400 | 1.2 | -0.01em | title |
| Timeline date | Libre Caslon Text | 24px | 400 | 1.2 | 0 | - |
| Fact and life numbers | Libre Caslon Text | 30px / 34px | 400 | 1.1 / 1 | 0 | - |
| Eyebrow | Jost | 13px | 600 | 1.5 | 0.12em | upper |
| Lede | Jost | 19px | 400 | 1.55 | 0 | sentence |
| Body | Jost | 16px | 400 | 1.55 | 0 | sentence |
| Card body | Jost | 15px | 400 | 1.55 | 0 | sentence |
| Stream label, table head | Jost | 12-13px | 600 | 1.5 | 0.06-0.1em | upper |
| Buttons, nav | Jost | 15-16px | 500-600 | 1 | 0 | sentence |
| Meta, caption | Jost | 13-14px | 400 | 1.5 | 0 | sentence |

The italic word in the h1 ("your") is `--navy-2`. Serif is for headings and numbers only. Never set body in the serif.

## Implementation notes

**1. The timeline is one line and five dots.** Draw the line once on the `ol`, not per item. Flip it to vertical with the same pseudo-element.

```css
.dates ol { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); position: relative; list-style: none; padding: 0; }
.dates ol::before { content: ""; position: absolute; left: 0; right: 0; top: 11px; height: 2px; background: var(--navy); }
.dates li { position: relative; padding: 40px 20px 0 0; }
.dates li::before { content: ""; position: absolute; top: 2px; left: 0; width: 20px; height: 20px;
  border-radius: 50%; background: var(--cream); border: 2px solid var(--navy); }
.dates li.next::before { background: var(--mustard); }
.dates li.due::before { background: var(--tomato); border-color: var(--tomato); border-radius: 3px; transform: rotate(45deg); }
@media (max-width: 767px) {
  .dates ol { grid-template-columns: minmax(0,1fr); }
  .dates ol::before { left: 10px; right: auto; top: 6px; bottom: 6px; width: 2px; height: auto; }
  .dates li { padding: 0 0 28px 40px; }
}
```

**2. Windows with an SVG pattern.** The hall and the wing are one `rect` each, filled with a `pattern` of small window rects. This keeps the drawing under 2 KB.

```html
<pattern id="w" width="26" height="32" patternUnits="userSpaceOnUse">
  <rect x="7" y="8" width="12" height="16" fill="#f4eee1"/>
</pattern>
<rect x="40" y="180" width="270" height="190" fill="#1b2a4a"/>
<rect x="53" y="196" width="244" height="160" fill="url(#w)"/>
```

Build order inside the drawing: mustard sun, sand hills, navy hall, tower with a tomato roof and a cream clock, tomato arched door, lighter navy wing with mustard windows, flag, navy ground band with a dashed cream road line.

**3. Filter with one handler.** Keep the cards in the DOM and toggle `hidden`.

```js
chips.forEach(b => b.addEventListener('click', () => {
  chips.forEach(c => c.setAttribute('aria-pressed', c === b));
  const f = b.dataset.f; let n = 0;
  grid.querySelectorAll('.card').forEach(c => {
    const on = f === 'all' || c.dataset.s === f; c.hidden = !on; n += on;
  });
  count.textContent = `Showing ${n} programmes${f === 'all' ? '' : ' in ' + b.textContent}`;
}));
```

Remember `.card[hidden] { display: none }`, because `.card { display: flex }` beats the default `hidden` rule.

Common mistakes:

- Using tomato for every button and link. It is for Apply and the deadline only.
- Adding a fifth colour for the "Science" tag. Streams use navy, tomato, mustard shapes.
- A photo hero. The point is the geometric drawing.
- Rounded pills on chips. Keep 6px.
- A carousel for programmes. Use the grid and the filter.
- Errors shown only as a red border with no message.
- Leaving the "Lab or studio" column at 390px so the table scrolls sideways.

Rebuild order:

1. Tokens and the two fonts.
2. Sticky nav.
3. Hero text, buttons, facts.
4. Campus drawing.
5. Timeline, then its vertical version.
6. Programmes data, cards, filter.
7. Fees table and scholarship card.
8. Student life strip.
9. FAQ and form, with validation.
10. Footer, then the breakpoints at 1100, 900, and 767.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
