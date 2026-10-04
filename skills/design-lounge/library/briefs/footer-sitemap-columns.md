<!-- Design Lounge Nº 411 · "Sitemap columns footer" · designlounge.vercel.app -->

# Sitemap columns footer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The big footer at the end of a product site for "Corvel", a fictional logs and metrics tool. It sits on dark warm charcoal and holds a lot: a short call to action, a brand block with a one-line mission and a newsletter field, five link columns, a status line, two selects, social links and a legal row. It stays calm because there is one accent (amber) and almost everything else is warm grey text on charcoal. The one detail worth copying: under 640px the five columns become five accordions with real buttons, and above 640px the same markup is plain open lists that are not in the tab order.

## Reference behaviour

1. Initial state at 1280×800: the footer fills the frame. Nothing is open, nothing is focused. The status dot pulses softly.
2. Top row: "Find the slow query before the pager finds you." at 36px, with "before" in amber. On the right, two buttons: "Book a demo" (outline) and "Start free for 14 days" (amber fill).
3. A 1px rule, then the main grid: brand block on the left, five link columns on the right.
4. Brand block: a 28px logo mark, the word "Corvel", the mission line "Logs, metrics and traces for teams who would rather be asleep at 3am.", then the newsletter form labelled "Monthly changelog".
5. Newsletter submit with an empty or bad email: the input border turns `--danger`, `aria-invalid="true"` is set, the hint under the field changes to an error sentence, and focus returns to the input.
6. Typing in the invalid input clears the error and restores the hint "One email a month. Unsubscribe in one click."
7. Newsletter submit with a valid email: the hint turns `--ok` and reads "Subscribed. The next changelog lands on 1 November." The input clears.
8. Link columns: Product (6 links), Solutions (5), Resources (6), Company (5), Legal (5). Product > Incidents carries an amber outline badge "New". Only one link has a badge.
9. Link hover: colour goes from `--text-2` to `--text`, a 1px underline appears 4px below the text in `--line-2`.
10. The bottom area is pushed to the bottom of the footer with `margin-top: auto`. It holds the status pill, two selects and the social links in one row.
11. Status pill: an 8px green dot, "All systems normal", then a mono "· checked 2 min ago". The dot sends a ring outward every 2.8s.
12. Language select (English, Deutsch, Français, Español, 日本語) and Data region select (EU · Frankfurt, UK · London, US · Virginia, APAC · Sydney). Both are native `select`s with visible labels.
13. Social links are text, not icons: GitHub, Mastodon, LinkedIn, YouTube, each with a 12px north-east arrow. Hover turns them amber.
14. Legal row: copyright and company number on the left in mono 12px; Cookie settings, Accessibility, Sitemap on the right.
15. Under 640px: each column heading becomes a 52px tall button with a chevron. All five start closed. Tapping one opens its list (rows 0fr → 1fr) and rotates the chevron 180°. Several can be open at once.
16. Resizing from mobile to desktop opens every list again and removes the buttons from the tab order. Resizing back closes them all.

## Structure

```
1280 × 800, footer padding 64 / 64 / 32
┌───────────────────────────────────────────────────────────────────────┐
│ Find the slow query before            [Book a demo] [Start free 14 d] │ pre row, 36px, pb 48, 1px rule
│ the pager finds you.                                                  │
├───────────────────────────────────────────────────────────────────────┤
│ [■] Corvel             PRODUCT  SOLUTIONS RESOURCES COMPANY  LEGAL     │ grid 2.1fr + 5 × 1fr, gap 32
│ Logs, metrics and…    Logs     Platform  Docs      About    Terms     │ links gap 12
│ MONTHLY CHANGELOG     Metrics  Startups  API ref   …        …         │
│ [you@team.dev][Subscribe]     Incidents NEW                          │
│ One email a month…    Pricing                                         │
│                                                                       │ flexible space
│ (● All systems normal · checked)  LANGUAGE  DATA REGION  GitHub ↗ …  │ mid row, pb 24, 1px rule
│                                   [English⌄] [EU·Frankfurt⌄]          │
├───────────────────────────────────────────────────────────────────────┤
│ © 2026 Corvel Systems Ltd. …            Cookie settings Accessibility …│ legal, mono 12
└───────────────────────────────────────────────────────────────────────┘
```

- `footer aria-label="Site footer"`: `display:flex; flex-direction:column; min-height:100%`.
- Pre row: `div.pre` with a `p` and two links styled as buttons. It is not a heading.
- Main grid: `div.top`, `grid-template-columns: minmax(0,2.1fr) repeat(5, minmax(0,1fr))`, gap 32px.
- Brand: logo link with `aria-label="Corvel home"`, mission `p`, newsletter `form` with `label`, `input type=email`, `button type=submit`, hint `p` with `aria-live="polite"`.
- Each column: `nav aria-labelledby` its heading. Inside: `h2 > button[aria-controls]`, then `div.panel > div > ul`.
- Mid row: `div.mid`, `grid-template-columns: minmax(0,1fr) auto auto`, `align-items:end`. Status is a link. Selects are `label` + `select`. Social is `nav aria-label="Social"`.
- Legal row: `p` plus `nav aria-label="Legal shortcuts"`.

## Tokens

```css
:root {
  --bg: #1a1918;        /* page and footer */
  --surface: #222120;   /* select fill */
  --field: #2a2826;     /* input fill */
  --line: #34322f;      /* rules */
  --line-2: #45423e;    /* control borders, underline */
  --text: #ece7df;      /* primary text */
  --text-2: #b0a99f;    /* links, mission */
  --text-3: #8f897f;    /* labels, legal, hints */
  --accent: #f0a63a;    /* amber, one use per area */
  --ok: #6cc488;        /* status dot, success hint */
  --danger: #ff8a70;    /* error border and text */

  --sans: "Space Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;

  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px;
  --s5: 24px; --s6: 32px; --s7: 48px; --s8: 64px;
  --r: 4px;

  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --fast: 160ms;
  --layout: 260ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Pre row statement | Space Grotesk | 36px | 500 | 1.15 | -0.02em | sentence |
| Wordmark | Space Grotesk | 20px | 600 | 1 | -0.01em | sentence |
| Mission | Space Grotesk | 15px | 400 | 1.5 | 0 | sentence |
| Column heading | IBM Plex Mono | 12px | 500 | 1.5 | 0.08em | upper |
| Link | Space Grotesk | 14px | 400 | 1.5 | 0 | sentence |
| Field label | IBM Plex Mono | 11px | 400 | 1.5 | 0.08em | upper |
| Badge | IBM Plex Mono | 10px | 500 | 1.5 | 0.06em | upper |
| Status meta, legal | IBM Plex Mono | 12px | 400 | 1.6 | 0 | sentence |
| Buttons | Space Grotesk | 14px | 600 | 1 | 0 | sentence |

- The mission line has a 34ch max width.
- The pre row statement has a 22ch max width so it breaks into two lines.
- Keep mono for labels, meta and legal only. Links stay in the grotesk.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Status ring | loop | transform, opacity | scale 1, 0.55 → scale 2.6, 0 | 2.8s, rest from 70% | `--ease` | removed, dot stays solid |
| Link | hover | color | `--text-2` → `--text` | 160ms | `--ease` | instant |
| Social link | hover | color | `--text-2` → `--accent` | 160ms | `--ease` | instant |
| Input | hover, focus | border-color | `--line-2` → `#5a564f` / `--accent` | 160ms | `--ease` | instant |
| Subscribe | hover / active | filter, transform | brightness 1 → 1.08 / translateY 0 → 1px | 160ms | `--ease` | instant |
| Accordion panel | button click (<640px) | grid-template-rows | 0fr → 1fr | 260ms | `--ease` | instant |
| Chevron | button click (<640px) | transform | rotate 0 → 180deg | 260ms | `--ease` | instant |

- The status ring is the only loop. It is slow and small so it can sit in a grid of other pieces.
- No motion on page load.

## States

- Link resting: `--text-2`. Hover: `--text` plus underline offset 4px.
- Badge: 1px amber border, amber text, 3px radius, no fill.
- Input resting: `--field` fill, 1px `--line-2` border. Hover: border `#5a564f`. Focus-visible: border `--accent` plus the global ring at offset 1px.
- Input invalid: border `--danger`, hint text `--danger`, `aria-invalid="true"`.
- Newsletter success: hint `--ok`, input empty.
- Primary button: amber fill, text `#1a1205`. Ghost button: 1px `--line-2` border, hover border `--text-2`.
- Status pill: 1px `--line` border, 999px radius, min-height 40px. Hover border `--line-2`.
- Accordion closed (<640px): `aria-expanded="false"`, panel `inert`, chevron pointing down.
- Accordion open (<640px): `aria-expanded="true"`, panel not inert, chevron up.
- Desktop heading button: `tabindex="-1"`, no `aria-expanded`, default cursor, chevron hidden.
- Focus-visible everywhere: 2px solid `--accent`, offset 3px, 2px radius.
- Disabled: not used.

## Accessibility

- The footer has `aria-label="Site footer"`. Each column is a `nav` labelled by its `h2`.
- Use one `h2` per column. The pre row text is a paragraph, not a heading.
- Under 640px the column toggles are real `button`s with `aria-expanded` and `aria-controls`. Enter and Space toggle them.
- Closed panels are `inert`, so hidden links are not reachable with Tab.
- Above 640px the heading buttons have `tabindex="-1"` and no `aria-expanded`. Tab goes straight from the Subscribe button into the links.
- The newsletter input has a visible `label`. The hint is linked by `aria-describedby` and is an `aria-live="polite"` region, so errors and success are read out.
- On a failed submit, focus moves back to the input.
- Selects are native, with visible labels "Language" and "Data region".
- The status dot is `aria-hidden`. The words "All systems normal" carry the meaning.
- Contrast on `#1a1918`: `--text` about 14:1, `--text-2` about 8:1, `--text-3` about 5:1, amber about 9:1.
- Hit targets: buttons, inputs and selects are 40px tall. Under 640px each link row is 40px tall and each accordion heading is 52px tall.

## Responsive rules

- ≥1280: as drawn. Padding 64px sides. Grid is 2.1fr brand plus five 1fr columns. Mid row is status, selects, social in one row.
- 1024 (≤1100px): padding 48px. The brand block moves to its own full-width row and splits in two: logo and mission on the left, newsletter on the right. The five columns sit in one row of five below. The mid row becomes two columns (status left, selects right) and the social links wrap to their own row.
- 768 (≤900px): link columns go to three per row (Product, Solutions, Resources, then Company, Legal). Pre row statement drops to 26px.
- <640px: padding 32px top, 20px sides. Everything stacks in one column. The pre row stacks, statement 24px, the two buttons share the width 50/50. Brand block, then newsletter at full width. Then five accordions with 1px rules between them. Then status pill (it may wrap), then the two selects side by side 50/50, then social links wrapping, then the legal text and links stacked.
- Never scroll horizontally. Every grid uses `minmax(0, 1fr)`. Link text is `white-space: nowrap`; keep link labels short so they fit a 1fr column at 1024.
- At 390 wide the whole footer is about 1070px tall with all accordions closed.

## Acceptance checklist

### Always

- [ ] The footer is one landmark with a label, and each link group is a labelled `nav`.
- [ ] Five link columns of five or six links each. Only one link has a badge.
- [ ] One accent colour. It is used for the primary button, the badge, one word in the statement, social hover and focus rings only.
- [ ] Under 640px each column is a button with `aria-expanded` and a closed panel is `inert`.
- [ ] Above 640px every list is visible and the heading buttons are not in the tab order.
- [ ] The newsletter has a visible label, an `aria-describedby` hint, an error state and a success state.
- [ ] Failed submit focuses the input.
- [ ] Status uses a dot plus words. The dot is not the only signal.
- [ ] Language and region are native selects with visible labels.
- [ ] No horizontal scroll at 1280, 1024, 768, 390 or 360.
- [ ] The status pulse stops under `prefers-reduced-motion: reduce`.

### This demo

- [ ] The brand is "Corvel" and the mission reads "Logs, metrics and traces for teams who would rather be asleep at 3am."
- [ ] The columns are Product, Solutions, Resources, Company, Legal.
- [ ] Product > Incidents has the "New" badge.
- [ ] The status reads "All systems normal · checked 2 min ago" with an 8px `#6cc488` dot.
- [ ] Background `#1a1918`, accent `#f0a63a`, link text `#b0a99f`.
- [ ] Legal reads "© 2026 Corvel Systems Ltd. Registered in Scotland, SC614072. 9 Commercial Quay, Leith."

## Implementation notes

**1. One markup, two behaviours.** Do not render the columns twice. Use a heading button that is a toggle on mobile and inert on desktop, and sync it with `matchMedia`.

```js
const mq = matchMedia('(max-width: 639px)');
const heads = [...document.querySelectorAll('.col h2 button')];
function mode() {
  heads.forEach(b => {
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    if (mq.matches) {
      b.removeAttribute('tabindex');
      b.setAttribute('aria-expanded', 'false');
      panel.classList.remove('open');
      panel.inert = true;
    } else {
      b.setAttribute('tabindex', '-1');
      b.removeAttribute('aria-expanded');
      panel.classList.add('open');
      panel.inert = false;
    }
  });
}
mq.addEventListener('change', mode);
mode();
```

**2. Height animation without measuring.** Animate `grid-template-rows` between `0fr` and `1fr`. Put `overflow: hidden` on the inner wrapper only inside the mobile query, or the desktop badge gets clipped.

```css
.col h2 button { all: unset; display: flex; width: 100%; justify-content: space-between; }
@media (max-width: 639px) {
  .col h2 button { cursor: pointer; min-height: 52px; }
  .panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 260ms var(--ease); }
  .panel.open { grid-template-rows: 1fr; }
  .panel > div { overflow: hidden; }
  .col li a { display: flex; align-items: center; min-height: 40px; }
}
```

**3. Push the bottom rows down.** The footer is a flex column with `min-height: 100%`. The mid row has `margin-top: auto`. Then the status and legal rows always sit at the bottom of a tall frame, and the gap stays above them, not between the links.

```css
footer { min-height: 100%; display: flex; flex-direction: column; padding: 64px 64px 32px; }
.mid { margin-top: auto; padding-top: 48px; padding-bottom: 24px; border-bottom: 1px solid var(--line); }
.dot::after { content: ""; position: absolute; inset: 0; border-radius: 50%; background: var(--ok); animation: pulse 2.8s var(--ease) infinite; }
@keyframes pulse { 0% { transform: scale(1); opacity: .55 } 70%, 100% { transform: scale(2.6); opacity: 0 } }
```

Common mistakes:

- Using `<details>` and forcing them open on desktop. The summary stays focusable and clickable on desktop, which is confusing.
- Hiding closed panels with `height: 0` only. The links are still in the tab order. Use `inert` or `hidden`.
- Icon-only social links. This footer uses words. Keep the words.
- A second accent colour for the status. Green is a status colour on a dot, not an accent. Do not use it for links or buttons.
- Using `#000` for the background. The charcoal is warm, `#1a1918`.
- Putting the newsletter error in a `title` tooltip. It goes in the hint line under the field.
- A 1fr grid without `minmax(0, …)`. Long links then push the page wider than the frame.

Rebuild order:

1. Set the tokens and the flex column footer.
2. Build the pre row and the main grid at 1280.
3. Add the brand block and the newsletter form with its three hint states.
4. Add the five columns with heading buttons and panels.
5. Add the mid row (status, selects, social) and the legal row.
6. Add the 1100, 900 and 639px breakpoints.
7. Wire the `matchMedia` toggle and the accordion clicks.
8. Tab through at 1280 and at 390, then check reduced motion.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
