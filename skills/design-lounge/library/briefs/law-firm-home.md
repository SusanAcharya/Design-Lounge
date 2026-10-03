<!-- Design Lounge Nº 283 · "Law firm home, editorial" · designlounge.vercel.app -->

# Law firm home, editorial

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The one-page home for a fictional eleven-lawyer disputes and advisory firm, Thorne & Aldridge, with offices in London, Edinburgh and Bristol. It reads like the front of a serious newspaper, not like a SaaS page. Ivory paper, ink navy, one oxblood, Bodoni Moda at display sizes, Schibsted Grotesk for everything else, 1px hairline rules, 0–2px radii, no shadows.

The hero is one sentence: "We are the firm you call when the outcome *cannot* be undone." at 88px, with "cannot" in oxblood italic. Below it: six numbered practice areas that reveal a one-line description on hover, a navy band of four case results, three partner profiles, an insights list, a confidential consultation form with a privacy note, and three offices. The detail worth copying is the **practice list**: a numbered table of contents where hover slides the title 8px, fades in a description, turns the arrow 45° and draws an oxblood rule under the row, with no layout shift.

## Reference behaviour

1. Initial state: the hero sentence fills the left of the first frame. A 280px aside on the right holds a 15px note and a "Speak to a partner today" underlined link. A hairline row under both lists three facts.
2. Header: logo "Thorne & Aldridge" with an oxblood italic ampersand, five text links, and a navy "Confidential consultation" button on the right. The header is sticky at 72px.
3. Practice areas: six rows, each a link to the form. On hover or keyboard focus of a row: the title moves right 8px (320ms, expo out), the description fades in and rises 6px into place (opacity 200ms, transform 320ms), the arrow rotates −45° and turns oxblood, and a 1px oxblood rule grows from 0 to full width under the row (320ms). Moving away reverses all four.
4. The description holds its space when hidden (opacity 0), so rows never change height.
5. Case results: a full-width navy band. Four numbers at 64px: "£41.2m", "48hrs", "0", "No action", each with a category label and one sentence. A fine-print line under them says past results do not guarantee outcomes.
6. Partners: three columns. Each has a 4:5 monogram panel (italic Bodoni initials at 96px inside an inset hairline frame), a role label, a name, a sentence, and a two-row definition list.
7. Insights: four rows. Date, title, category, read time. Hover turns the title oxblood.
8. Consultation form: submit with name, email or outline missing: each bad field's underline turns oxblood, focus moves to the first one, and the status line says "Please complete your name, a valid email and a short outline." With all three valid: the status reads "Received. A partner will contact you by email by the end of the next working day." The phrase follows the chosen reply method. The button then disables.
9. Offices: three columns split by hairlines. City in Bodoni 30px, address, phone link.
10. At 1023px and below, the nav hides and a 44px menu button opens a dropdown. Practice descriptions show at all times (no hover on touch).

## Structure

```
1280 × 800 (first frame)
┌───────────────────────────────────────────────────────────────────────┐
│ Thorne & Aldridge   Practice Results Partners Insights Offices  [Confidential consultation] │ 72
├───────────────────────────────────────────────────────────────────────┤ 1px rule
│ COMMERCIAL DISPUTES · CORPORATE ADVISORY · EST. 1998   (12px oxblood)  │
│ We are the firm you                                                   │
│ call when the                    88px Bodoni, 15ch      ───────────── │
│ outcome cannot be                                       note 15px     │
│ undone.                                                 Speak to… →   │
│ ───────────────────────────────────────────────────────────────────── │
│ 27 years in practice   Three offices …   Ranked tier 1 …   (14px)     │
├───────────────────────────────────────────────────────────────────────┤
│ PRACTICE AREAS      Six areas, each led by a partner… (52px)          │
│ ═════════════════════════════════════════════════════ 1px navy        │
│ 01   Commercial litigation      (description, hidden)            →    │
│ 02   International arbitration                                   →    │
└───────────────────────────────────────────────────────────────────────┘
below: results (navy) · partners · insights · consultation · offices · footer
```

- Content max width 1280px, side padding 64px.
- Hero grid: `minmax(0,1fr) 280px`, 64px gap, items aligned to the bottom. The facts row spans both columns.
- Every band after the hero opens with a section head grid: `280px minmax(0,1fr)`, 64px gap. Left is a 12px uppercase label, right is a 52px Bodoni `h2`.
- Practice list: `<ol class="areas">` with a 1px navy top rule. Each `<li>` has a 1px `--rule` bottom border and holds one `<a>` laid out as `80px minmax(0,1fr) minmax(0,1fr) 40px`: number, title `h3`, description, arrow.
- Results: `section` with navy fill. A 4-column grid with a 1px top rule and 1px vertical dividers at 18% ivory alpha.
- Partners: 3 columns, 40px gap, each an `<article>` with a `<dl>`.
- Insights: `<ul>` of links laid out `140px minmax(0,1fr) 160px 100px`, each with a `<time datetime>`.
- Consultation: 2 columns `.9fr 1.1fr`, 72px gap. Left: label, 52px heading, paragraph, privacy box. Right: `<form novalidate>` in a 2-column grid, 22px row gap, 24px column gap.
- Offices: 3 columns, 1px navy top rule, 1px `--rule` left dividers, each an `<address>`.

## Tokens

```css
:root {
  --ivory: #f6f1e7;     /* page */
  --paper: #fbf8f1;     /* monogram panels, privacy box, text on navy */
  --ink: #14213a;       /* text, primary button, results band */
  --ink-2: #46506a;     /* secondary text */
  --ink-3: #6c7385;     /* labels, dates, hints */
  --rule: #d9d0bf;      /* hairlines */
  --rule-2: #14213a;    /* strong top rules on lists */
  --ox: #6e1f24;        /* the one accent: kicker, italics, hover, focus */
  --ox-2: #8a2a30;      /* reserved */

  --serif: "Bodoni Moda", Didot, Georgia, serif;
  --sans: "Schibsted Grotesk", system-ui, sans-serif;

  --fs-hero: 88px;
  --fs-h2: 52px;
  --fs-area: 34px;
  --fs-result: 64px;
  --fs-mono: 96px;
  --fs-body: 16px;
  --fs-small: 15px;
  --fs-label: 12px;

  --pad: 64px;
  --band: 88px;
  --gap-head: 64px;

  --r: 2px;

  --t: 200ms;
  --t-open: 320ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

No `box-shadow` anywhere. Regions are split by 1px `--rule`. Lists that start a region get a 1px `--rule-2` top rule.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Hero sentence | Bodoni Moda | 88px | 400 | 1.0 | -0.025em | sentence, "cannot" italic oxblood |
| Section heading | Bodoni Moda | 52px | 400 | 1.05 | -0.01em | sentence |
| Practice title | Bodoni Moda | 34px | 400 | 1.1 | -0.01em | sentence |
| Practice number | Bodoni Moda | 20px | 400 italic | 1 | 0 | "01" oxblood |
| Result number | Bodoni Moda | 64px | 400 | 1 | -0.02em | unit at 0.5em |
| Monogram | Bodoni Moda | 96px | 400 italic | 1 | 0 | initials |
| Partner / office name | Bodoni Moda | 28px / 30px | 400 | 1.1 | -0.01em | title |
| Insight title | Bodoni Moda | 24px | 400 | 1.25 | -0.01em | sentence |
| Logo | Bodoni Moda | 24px | 500 | 1 | 0.01em | "&" italic oxblood |
| Body | Schibsted Grotesk | 16px | 400 | 1.6 | 0 | sentence |
| Small / descriptions | Schibsted Grotesk | 15px | 400 | 1.5 | 0 | sentence |
| Label | Schibsted Grotesk | 12px | 600 | 1.4 | 0.14em | UPPERCASE |
| Form label | Schibsted Grotesk | 13px | 600 | 1.4 | 0 | sentence |
| Button | Schibsted Grotesk | 14–16px | 500 | 1 | 0 | sentence |

Load Bodoni Moda with the optical size axis (`opsz 6..96`) so the 88px hero uses the high-contrast cut and the 20px numbers stay sturdy.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | ---: | --- | --- |
| Practice title | row hover / focus | translateX | 0 → 8px | 320ms | `--expo` | no move |
| Practice description | row hover / focus | opacity, translateY | 0 → 1, 6px → 0 | 200ms / 320ms | `--ease` / `--expo` | 1ms |
| Practice arrow | row hover / focus | rotate, colour | 0 → -45°, ink → ox | 320ms | `--expo` | 1ms |
| Practice rule | row hover / focus | width | 0 → 100% | 320ms | `--expo` | 1ms |
| Buttons | hover | background, border | ink → ox | 200ms | `--ease` | 1ms |
| Insight title | hover | colour | ink → ox | 200ms | `--ease` | 1ms |
| Nav links | click | scroll | smooth | browser | — | auto |

No scroll reveals. No counting numbers in the results band. The numbers are facts; they appear at full value.

## States

- **Practice row resting:** number oxblood, title ink, description opacity 0, arrow ink.
- **Practice row hover / focus-visible:** as in Motion. Focus also draws a 2px oxblood outline inset by 2px so it does not collide with the rule.
- **Link (underlined):** 1px bottom border in `currentColor`, 2px padding. Hover: oxblood.
- **Primary button:** navy fill, ivory text, 1px navy border, 2px radius, 48px tall (42px in the header). Hover: oxblood fill and border. Disabled after a successful send.
- **Form field:** no box. 1px navy underline, 44px min height, transparent fill, 16px text. Focus-visible: 2px oxblood underline, no outline. Invalid: oxblood underline, `aria-invalid="true"`.
- **Radio:** 18px, `accent-color: var(--ox)`. Label row 40px tall.
- **Status line:** 15px 500 oxblood under the form. Empty on load.
- **Focus-visible (everything else):** 2px oxblood outline, 3px offset.
- **Menu open (≤1023px):** ivory dropdown under the header, links with 1px rules.

## Accessibility

- One `h1`: the hero sentence. Each band has an `h2` and `aria-labelledby`.
- The practice list is an `<ol>` so the order is announced. Numbers are visible text, not CSS counters, so they read on copy-paste too.
- Practice descriptions are in the DOM and read by screen readers at all times; only their opacity changes.
- Hover effects also fire on `:focus-visible`, so keyboard users get the same reveal.
- Results are `<article>` elements. Units ("m", "hrs") are inside `<small>` within the number, so "£41.2m" reads as one token.
- Monograms are `aria-hidden`. Names are in `h3`. Partner facts are a `<dl>`.
- Insight dates use `<time datetime="2026-09-24">`.
- The form has `novalidate` and its own messages. All inputs have visible `<label>`s. The reply method is a `<fieldset>` with a `<legend>`. The status is `role="status"`. The form is `aria-describedby` the encryption note.
- The privacy note sits next to the form, before the fields in reading order on mobile, so people read it before typing.
- Offices use `<address>`. Phones are `tel:` links.
- Contrast: `#14213a` on `#f6f1e7` is about 14:1. `#46506a` on ivory is about 7:1. `#6c7385` on ivory is about 4.6:1. `#6e1f24` on ivory is about 9:1. Ivory on navy is about 14:1. `#c9cdd8` on navy is about 10:1.
- Hit targets: buttons 48px, header button 42px, menu 44px, practice rows at least 78px tall, radio rows 40px.

## Responsive rules

- **≥1280:** as specified. Hero 88px. Section heads in two columns. Results 4 across. Partners and offices 3 across.
- **1024–1279 (below 1180px):** side padding 48px. Hero 72px. Section head columns `200px minmax(0,1fr)`, 40px gap. Insights drop the category column: `120px minmax(0,1fr) 90px`.
- **768–1023:** hide the nav, show the menu button left of the header button. Hero aside drops under the sentence. Section heads stack. Practice rows become `56px minmax(0,1fr) 32px` with the description always visible under the title (opacity 1). Results 2 × 2. Consultation stacks to 1 column.
- **<640:** side padding 20px. Hide the header button. Hero 44px. Facts row stacks, 6px gap. Section and form headings 36px. Practice rows `40px minmax(0,1fr) 24px`, titles 26px. Results 1 column with bottom rules, numbers 52px. Partners and offices 1 column. Monograms go 16:9. Insights stack date, title, read time. Form 1 column.
- Every grid uses `minmax(0, 1fr)`. Nothing scrolls sideways at 390px.

## Acceptance checklist

### Always

- [ ] The hero is a single sentence at the largest size on the page, with one word in the accent italic.
- [ ] One accent colour (oxblood). No gradients, no shadows, radii 2px or less.
- [ ] Practice areas are an ordered list with visible two-digit numbers.
- [ ] Hover and focus reveal the description, slide the title, rotate the arrow, and draw the rule, with no change in row height.
- [ ] At 1023px and below, descriptions are always visible.
- [ ] Case results show a number, a category label, one sentence, and a past-results disclaimer.
- [ ] Partners use initials monograms with an inset hairline frame. No photos.
- [ ] The consultation form has a privacy note, labelled fields, a reply-method radio group, inline errors, and a status line.
- [ ] Offices use `<address>` and `tel:` links.
- [ ] Focus rings are 2px oxblood. Form fields focus with a 2px underline.
- [ ] Reduced motion removes the title slide and shortens every transition to 1ms.
- [ ] At 390px there is a menu button, and no horizontal scroll.

### This demo

- [ ] Brand "Thorne & Aldridge", hero "We are the firm you call when the outcome cannot be undone."
- [ ] Six areas: Commercial litigation, International arbitration, Employment and partnership, Corporate and M&A, Regulatory investigations, Insolvency and recovery.
- [ ] Results £41.2m, 48hrs, 0, No action.
- [ ] Partners Eleanor Thorne KC, James Aldridge, Nadia Okafor.
- [ ] Offices London EC4A 2BN, Edinburgh EH2 4QX, Bristol BS1 6SU.

## Implementation notes

**Reveal without layout shift.** Keep the description in the grid and change only opacity and transform. Animating `height` or `grid-template-rows` makes the rows below jump.

```css
.area a { display: grid; grid-template-columns: 80px minmax(0,1fr) minmax(0,1fr) 40px;
  gap: 24px; align-items: baseline; padding: 22px 0; position: relative; text-decoration: none; }
.area h3 { transition: transform var(--t-open) var(--expo); }
.area .rev { opacity: 0; transform: translateY(6px); color: var(--ink-2);
  transition: transform var(--t-open) var(--expo), opacity var(--t) var(--ease); }
.area a::before { content: ""; position: absolute; left: 0; bottom: -1px; height: 1px; width: 0;
  background: var(--ox); transition: width var(--t-open) var(--expo); }
.area a:is(:hover, :focus-visible) h3 { transform: translateX(8px); }
.area a:is(:hover, :focus-visible) .rev { opacity: 1; transform: none; }
.area a:is(:hover, :focus-visible) .arr { transform: rotate(-45deg); color: var(--ox); }
.area a:is(:hover, :focus-visible)::before { width: 100%; }
```

**Underline fields.** Remove the box, keep a 1px rule, thicken it on focus. Do not remove the focus signal; the 2px oxblood underline is the ring.

```css
.fl input, .fl select, .fl textarea { border: 0; border-bottom: 1px solid var(--ink);
  background: transparent; min-height: 44px; padding: 8px 0; border-radius: 0; }
.fl :focus-visible { outline: none; border-bottom: 2px solid var(--ox); }
.fl [aria-invalid="true"] { border-bottom-color: var(--ox); }
```

**Validate and confirm.**

```js
cf.addEventListener('submit', e => {
  e.preventDefault();
  const F = cf.elements; let first = null;
  [F.fullname, F.email, F.outline].forEach(el => {
    const bad = el === F.email ? !/^\S+@\S+\.\S+$/.test(el.value) : !el.value.trim();
    el.setAttribute('aria-invalid', bad);
    if (bad && !first) first = el;
  });
  if (first) { ok.textContent = 'Please complete your name, a valid email and a short outline.'; first.focus(); return; }
  const via = { email: 'by email', phone: 'by phone', meet: 'to arrange a meeting' }[F.via.value];
  ok.textContent = `Received. A partner will contact you ${via} by the end of the next working day.`;
  cf.querySelector('[type=submit]').disabled = true;
});
```

Name the full-name input `fullname`, not `name`. `form.name` is the form's own attribute and will not return the input.

**Monogram panel.** A 4:5 box, paper fill, 1px rule border, and an `::after` frame inset 14px with its own 1px rule. Initials in italic Bodoni 96px. This reads as a letterpress card, not a missing photo.

Common mistakes:

- A stock photo of a handshake, a gavel, or a skyline.
- Gold. The accent is oxblood, and there is only one.
- Navy hero blocks with white text. The hero is ivory; navy is kept for the results band.
- Practice areas as icon cards in a 3 × 2 grid. They are a numbered list.
- Counting-up numbers in the results band.
- Boxed form fields with 8px radii.
- Bodoni for body text. It is for 20px and up only.
- Hiding descriptions on touch screens, where there is no hover.

Rebuild order:

1. Tokens, fonts with the optical size axis, sticky header.
2. Hero sentence, aside, facts row.
3. Section head grid used by every band.
4. Practice list with the hover reveal.
5. Results band.
6. Partner monograms and facts.
7. Insights list.
8. Consultation intro, privacy note, form, validation.
9. Offices and footer.
10. Breakpoints at 1180, 1023 and 640, then the menu toggle. Reduced motion and focus pass.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
