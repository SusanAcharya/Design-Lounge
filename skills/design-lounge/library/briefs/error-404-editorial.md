<!-- Design Lounge Nº 232 · "Editorial 404 with search" · www.designlounge.live -->

# Editorial 404 with search

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them. When a kit is locked, keep the two-plate idea: the kit's ink for the key plate and its accent for the offset plate.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A 404 page for a small riso print studio, Inkwell Print Co. The number 404 is set huge in a serif, printed twice: a fluoro pink plate sits 11px right and 8px up from the black plate, like a sheet that went through the press out of register. The middle 0 is printed as a halftone. A torn paper strip crosses the numerals with "Page not found × misprint" in mono. Under it, one sentence says sorry in plain words. On the right, a search field is already filled from the broken address and shows live matches from the site map. Four popular links and a "Report a broken link" button finish the page. The detail worth copying is that the page helps: it guesses the search, and the report confirms inline without leaving.

This is not `terminal-404`. That piece is a dark command line. This one is a printed page.

## Structure

```
1280 × 800
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⊕                                                                         ⊕ │
│ Inkwell Print Co.                        SHOP  WORKSHOPS  JOURNAL  STUDIO  │ 64px, 1px ink rule
├─────────────────────────────────────────────────────────────────────────────┤
│ ERROR 404  /journal/spring-zine-fair-2025   │ SEARCH THE SITE               │
│                                             │ [⌕ zine fair            ×]    │ 52px, 4px pink offset
│   4 0 4    (pink plate under black plate)   │ hint                          │
│ ~~~~ torn strip, rotated -3.5deg ~~~~~~~~~  │ match row ×3                  │ ~46px each
│                                             │ 3 pages match                 │
│ Sorry, the page at this address has         │ MOST VISITED                  │
│ moved or no longer exists.                  │ 01 Riso basics …   WORKSHOPS  │ 44px rows
│                                             │ 02 … 03 … 04 …                │
│                                             │ [REPORT A BROKEN LINK]        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Inkwell Print Co. · Patan Dhoka, Lalitpur     Open Tuesday to Saturday …   │
└─────────────────────────────────────────────────────────────────────────────┘
  main: grid-template-columns minmax(0,1.3fr) minmax(0,1fr), gap 64px, padding 36px 56px 24px
```

- `body` is a grid with rows `64px minmax(0,1fr) auto` and holds `header`, `main`, `footer`.
- The header has the wordmark link and a `nav` labelled "Main" with 4 links.
- The left column is a `section` labelled by the `h1`. The kicker is a `p`. The composition is a `div` with `aria-hidden="true"`, 300px tall.
- The composition stacks three layers, all absolute: the pink plate `div`, the torn strip `div`, and the black key plate `div` with three `span` digits. The key plate is last so it prints over the strip.
- The `h1` is the apology sentence. The big 404 is decoration. The kicker carries "Error 404" as text.
- The right column is a `section` labelled "Find your way". It holds the search block, the popular list, and the report block.
- The search input is a `role="combobox"` that controls a `ul role="listbox"`. A `p role="status"` holds the count and the opening message.
- `main` has `overflow-x: clip` so the strip can bleed into the page padding without causing sideways scroll.

## Motion

| Thing | Trigger | Property | From → to | Duration | Delay | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Pink plate | load | transform, opacity | none, 0.2 → offset, 1 | 900ms | 150ms | `--expo` | starts at offset |
| Strip text | load | translateX, opacity | -40px, 0 → 0, 1 | 1100ms | 300ms | `--expo` | static |
| Stamp | report click | scale, opacity | 1.4, 0 → 1, 1 (rotate -12deg kept) | 260ms | 0 | `--expo` | appears |
| Match list | typing | none | rows replace instantly | — | — | — | same |

No loops. The misregistration is the one moment of delight.

## States

- Search field resting: `--sheet` fill, 1.5px ink border, radius 2px, 4px pink offset shadow.
- Search field focus: 2px ink outline, offset 3px, on the field wrapper with `:focus-within`.
- Match row hover and active: `--sheet` background. Active also gets `box-shadow: inset 3px 0 0 var(--pink)` and `aria-selected="true"`.
- Match highlight: `mark` with no background and a pink-soft underline 0.35em tall.
- No matches: one muted mono row with two suggested words.
- Empty field: list hidden, `aria-expanded="false"`, clear button hidden.
- Popular link hover: the title gets the pink-soft underline.
- Report button hover: ink fill, sheet text. After click: replaced by the confirmation. It does not come back.
- Nav link hover: 2px pink bottom border.
- Focus-visible everywhere: 2px ink outline, offset 3px.

## Accessibility

- The `h1` is the apology, so screen readers hear the message, not "four hundred and four".
- The big numerals, the strip, and the registration marks are `aria-hidden="true"`.
- The input has `role="combobox"`, `aria-controls="list"`, `aria-autocomplete="list"`, `aria-expanded`, and `aria-activedescendant` pointing at the active option id.
- The list is `role="listbox"` labelled "Matching pages". Each row is `role="option"` with an id and `aria-selected`.
- Keys in the field: Arrow Down and Up move the active option and wrap. Enter opens the active or first option. Escape clears.
- The count line is `role="status"`, so "3 pages match" is read after typing pauses.
- The report confirmation is `role="status"` with `tabindex="-1"` and takes focus.
- The input label "Search the site" is a real `label`.
- Contrast: `#161412` on `#f2ebdd` is about 16:1. `#4a443c` on `#f2ebdd` is about 8:1. Pink is never used for text that must be read. Pink is only plate, offset, stamp and highlight.
- Hit targets: popular rows 44px, match rows about 46px, report button 40px, clear button 32px inside a 52px field.

## Responsive rules

- At 1280 and wider: two columns, 1.3fr and 1fr, numerals 320px, composition 300px tall.
- At 1024 (below 1100): gap 40px, padding 40px, numerals 260px, composition 250px, strip at 120px from the top.
- At 768 (below 900): one column. The composition comes first, then the h1, then search, popular, report. The body grows with content and the page scrolls.
- Below 640: header padding 20px, nav hidden, numerals 150px, composition 136px, strip 40px tall at 58px from the top with 11px text, pink plate offset 6px and -5px, h1 28px, registration marks hidden.
- The page never scrolls sideways. The strip is clipped by `main`.

## Acceptance checklist

### Always

- [ ] The h1 is one plain sentence of apology. The big number is decoration and hidden from screen readers.
- [ ] The search field is filled from the broken address on first frame, with matches visible.
- [ ] Suggestions filter live on each keystroke, show at most 4 rows, and highlight matched words.
- [ ] The combobox works with Arrow Up, Arrow Down, Enter and Escape, using `aria-activedescendant`.
- [ ] A no-match row suggests words to try.
- [ ] Exactly 4 popular links, each with a section tag.
- [ ] The report action confirms in place, names the broken path, and moves focus to the confirmation.
- [ ] The offset plate sits behind the key plate with `mix-blend-mode: multiply`.
- [ ] No horizontal scroll at 390px. Reduced motion removes the plate slide and the stamp.
- [ ] Focus rings are visible on links, the field, options and buttons.

### This demo

- [ ] The brand is Inkwell Print Co. and the broken path is /journal/spring-zine-fair-2025.
- [ ] The pink plate offset is 11px right, 8px up, rotated -0.6deg.
- [ ] The middle 0 is a 6px halftone and sits 6px low with a 2deg tilt.
- [ ] The torn strip is rotated -3.5deg and reads "Page not found × misprint".
- [ ] The report id is TP-0419.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame shows the composition, the apology, and the search field holding "zine fair". Three matches are already listed: "Zine fair 2026, table list", "Spring zine fair 2025, photos", "Zine fair stall applications". The count line says "3 pages match".
2. A hint under the field says "We filled this in from the address you followed." After the first edit it says "Results update as you type. Press Enter to open the first one."
3. On load the pink plate slides from no offset to its offset, `translate(11px,-8px) rotate(-0.6deg)`, over 900ms after 150ms. The strip text slides in from -40px over 1100ms after 300ms. Nothing loops.
4. Typing filters the site map on every keystroke. A page matches when every word typed appears in its title, section or path. Show at most 4 matches. Matched words get a pink highlighter underline.
5. Arrow Down and Arrow Up move the active match. The active row gets a `--sheet` background and a 3px pink bar on its left. Enter opens the active match, or the first match when none is active.
6. Opening a match sets the status line to "Opening How we mix fluoro pink at /journal/mixing-fluoro-pink". In a product, navigate.
7. When nothing matches, one row says "No pages match “xyzzy”. Try workshop, paper or ink." The count line says "No matches".
8. An empty field hides the list. The clear button (×) appears only when the field has text. Escape clears the field.
9. The "Most visited" list has 4 numbered links: Riso basics, a Saturday class; Paper packs and offcuts; Zine fair 2026, table list; Book the studio by the hour.
10. "Report a broken link" turns into a confirmation in place: a pink circle stamp with a tick, and "Thanks. Report TP-0419 logged for /journal/spring-zine-fair-2025. We fix broken links within two working days." The stamp lands from 1.4 scale over 260ms. Focus moves to the confirmation.
11. Registration marks sit in the two top corners of the page, one black, one pink.

## Tokens

```css
:root {
  --paper: #f2ebdd;       /* page */
  --sheet: #f8f3e8;       /* search field, torn strip, active row */
  --ink: #161412;         /* key plate, text, rules */
  --ink-2: #4a443c;       /* secondary text */
  --ink-3: #6b6358;       /* placeholder, numbers */
  --rule: #d8cdb8;        /* light rules between matches */
  --pink: #ff4fa3;        /* fluoro plate, field offset, stamp */
  --pink-soft: #ffd3e8;   /* highlighter */
  --focus: #161412;

  --serif: "Fraunces", Georgia, serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;

  --step-404: 320px;      /* display numerals */
  --step-h1: 36px;
  --step-row: 17px;       /* match titles; popular links 18px */
  --step-input: 18px;
  --step-mono: 12px;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-14: 56px; --space-16: 64px;

  --r: 2px;                       /* field and buttons, nearly square */
  --offset: 4px 4px 0 var(--pink); /* the field's printed shadow */

  --expo: cubic-bezier(.16,1,.3,1);
  --ease: cubic-bezier(.2,.7,.2,1);
}
```

Paper grain is two dot patterns on the body: black dots at 7% on a 4px grid and pink dots at 6% on a 7px grid, offset 2px 3px.

## Typography

| Role | Family | Size | Weight | Line height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Numerals | Fraunces, opsz 144 | 320px | 800 | 0.86 | -0.05em | — |
| Apology h1 | Fraunces | 36px | 400, italic for the second half | 1.12 | -0.02em | sentence |
| Wordmark | Fraunces | 22px | 600, "Print Co." italic 400 | 1.2 | -0.02em | as written |
| Match title | Fraunces | 17px | 600 | 1.25 | 0 | sentence |
| Popular link | Fraunces | 18px | 400 | 1.25 | 0 | sentence |
| Search input | Fraunces | 18px | 400 | 52px | 0 | — |
| Nav, labels, section tags | IBM Plex Mono | 11–12px | 500–600 | 1.2 | 0.08em | upper |
| Paths, hint, status | IBM Plex Mono | 12px | 400 | 1.5 | 0 | lower |
| Torn strip | IBM Plex Mono | 13px | 600 | 1 | 0.24em | upper |

The h1 is capped at 20ch. The italic half carries the pink highlighter: `box-shadow: inset 0 -0.32em 0 var(--pink-soft)`.

## Implementation notes

**1. Two plates and a halftone digit.** Set the same text twice in the same box. The pink copy goes first and multiplies. The key copy goes on top. The halftone digit uses a dot gradient clipped to the glyph.

```css
.digits { position: absolute; left: -10px; top: 0; font: 800 320px/.86 var(--serif);
  font-variation-settings: "opsz" 144; letter-spacing: -.05em; white-space: nowrap; }
.plate { color: var(--pink); mix-blend-mode: multiply;
  transform: translate(11px, -8px) rotate(-.6deg); animation: reg .9s var(--expo) .15s both; }
@keyframes reg { from { transform: none; opacity: .2; } }
.key .ht { color: transparent; -webkit-background-clip: text; background-clip: text;
  background: radial-gradient(circle, var(--ink) 40%, transparent 43%) 0 0 / 6px 6px; }
```

Common mistakes: using `text-shadow` for the pink plate. A shadow sits under the black and never shows the overlap colour. Use a second element with multiply. Also do not blur the plate. Riso misregistration is sharp.

**2. Torn strip.** A plain box with a jagged `clip-path` on top and bottom edges. About 24 points per edge is enough. Keep the strip text one line and let it overflow hidden.

```css
.tear { position: absolute; left: -56px; right: -24px; top: 154px; height: 58px;
  background: var(--sheet); transform: rotate(-3.5deg); overflow: hidden;
  clip-path: polygon(0 14%, 3% 4%, 6% 16%, 10% 2%, /* … */ 100% 6%,
                     100% 90%, 96% 100%, 92% 88%, /* … */ 0 88%); }
```

**3. Word matching and highlight.** Split the query on spaces. Match when every word appears in title, section or path. Escape the text before you insert `mark` tags, and escape regex characters in the words.

```js
const words = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
const hits = MAP.filter(([t, s, p]) => words.every(w => (t + ' ' + s + ' ' + p).toLowerCase().includes(w))).slice(0, 4);
const hl = (text) => words.reduce((out, w) =>
  out.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'), esc(text));
```

The demo fixes the prefill to "zine fair". In a product, take the last path segment, drop years, turn dashes into spaces, and keep the two words that give the most matches. "spring-zine-fair-2025" gives "zine fair".

Common mistakes:

- A 404 with only "Go home". Give search and real links.
- Pink text on cream. It fails contrast. Keep pink for ink effects.
- A cute illustration instead of type. The type is the illustration here.
- A report form with five fields. One click is enough. The path is known.
- Looping glitch animation. This is print, not a screen fault.

Where it sits:

1. It replaces the site's default 404 for every missing path. Keep the real header and footer so people know they are still on the site.
2. Return a real 404 status code from the server. The page only looks friendly. It is still an error.
3. The site map for suggestions is a small static list built at deploy time, 10 to 50 entries. Do not call a search API on every keystroke for a 404.
4. Popular links come from analytics once a month. Four is the count. Do not grow it into a sitemap.
5. The report sends the missing path and the referrer. Nothing else. No email field.
6. A 500 error is a different page. Do not reuse this apology for a server fault.

Rebuild order:

1. Set the page grid, header, footer and paper grain.
2. Build the composition: pink plate, strip, key plate. Check the overlap at 320px.
3. Add the h1 and kicker.
4. Build the combobox with the 14-entry site map and the prefill.
5. Add the popular list and the report confirmation.
6. Add the load motion and the reduced-motion rule.
7. Check 1024, 768 and 390 widths.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
