<!-- Design Lounge Nº 284 · "Job board search" · www.designlounge.live -->

# Job board search

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep this layout.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The search screen of a job board called Placard. A search bar sits across the top: role, location, a Remote only switch, and a Search button. Below it are three columns: filters on the left (232px), the result list in the middle, and a detail pane on the right (440px). The look is quiet Swiss: white page, black ink, one green, hairline rules, 6px corners, a grotesk for words and a mono for every salary and count. The detail worth copying is that every number moves at once. Change a filter and the result count, each filter's own count, and the list all update on the same input event, with no Apply button.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────────┐
│ ■ Placard   [ ⌕ designer        | ⌖ City or country | (o) Remote only |Search]│ 68px
├──────────────┬──────────────────────────────────┬────────────────────────────┤
│ JOB TYPE     │ 10 roles             Newest first│ [NF] Senior Product Designer│
│ ☑ Full-time 7│──────────────────────────────────│      Northline Freight     │
│ ☑ Part-time 1│▌[NF] Senior Product Designer NEW │ $95k–125k per year         │
│ ☑ Contract  2│▌     Northline · Berlin · Hybrid │ TYPE | LEVEL | WHERE | POST│
│ SALARY RANGE │▌     $95k–125k            Today  │ [ Apply on Northline → ][⌑]│
│ $60k – $200k │▌     [Full-time][Figma]...   ⌑   │ ABOUT THE ROLE             │
│ ──●━━━━━━━●─ │──────────────────────────────────│ WHAT YOU WILL DO           │
│ EXPERIENCE   │ [CB] Product Designer, Payments  │ WHAT YOU BRING             │
│ POSTED WITHIN│ ...                              │ SIMILAR JOBS (3 rows)      │
│ Clear all    │                                  │                            │
│   232px      │        minmax(0, 1fr)            │          440px             │
└──────────────┴──────────────────────────────────┴────────────────────────────┘
```

- `header.top`: a two-column grid, `232px minmax(0,1fr)`, so the search bar's left edge lines up with the list column. Padding 12px 24px. 1px bottom rule.
- The search bar is a `form role="search"`, 44px tall, one 1px `--line-2` border, 6px radius. Inside: a grid `minmax(0,1.3fr) minmax(0,1fr) auto auto`. Fields are separated by 1px `--line` rules, not separate boxes.
- Remote only is a `button role="switch"`. Search is a black button flush to the right edge, radius on the right corners only.
- `main.app`: a grid `232px minmax(0,1fr) 440px` that fills the rest of the height. Each column scrolls on its own (`min-height:0; overflow:auto`). The page body does not scroll at 1280.
- Filters are an `aside` with `fieldset` + `legend` per group. The whole set sits in a `details` that is always open at desktop, with its `summary` hidden.
- Results are a `section` with an `h1` and an `ol`. Each row is an `li` with one `button.pick` (the title). The button's `::after` covers the row so the whole row is clickable.
- The list header is sticky at the top of the middle column.
- The detail pane is a `section aria-label="Job details"` with an `h2`, a `dl` for the facts, and `h3` section labels.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Row | hover | background | `--bg` → `--soft` | 140ms | `--ease` | instant |
| Remote switch track | toggle | background | `--line-2` → `--green` | 140ms | `--ease` | instant |
| Remote switch knob | toggle | transform | `translateX(0)` → `translateX(14px)` | 140ms | `--ease` | instant |
| Apply button | hover | background | `#0b7a3e` → `#086332` | 140ms | `--ease` | instant |

Nothing else moves. The list and the detail pane swap content with no fade or slide. A reflowing list is already enough change for the eye.

## States

- Row resting: white, 1px bottom rule.
- Row hover: `--soft` fill. The tile turns white so it stays visible.
- Row selected: `--soft` fill, 3px inset black bar on the left, `aria-current="true"` on its button.
- Row focus-visible: a 2px green outline drawn on the row's `::after` with `outline-offset:-2px`, so it frames the whole row and does not get clipped.
- Save resting: 36px square, `--ink-3` outline bookmark. Hover: 1px `--line-2` border, white fill, `--ink` icon.
- Save pressed: green, icon filled with `currentColor`.
- Checkbox ticked: black fill, white tick. Radio on: white with a 3.5px black inner ring.
- Switch on: green track, knob shifted 14px.
- Slider thumb: 18px white circle, 2px black border. Focus: 3px white gap, then 2px green ring.
- Input focus: a 2px green line on the bottom of that field (`inset 0 -2px 0`), not a full outline, so the joined bar keeps its shape.
- Apply done: black fill, check icon, "Application started".
- Empty: icon 40px, 18px heading, one line, outline button 40px tall.
- No-selection detail: centred `--ink-3` line, 80px from the top.
- Filter count of 0 still shows "0". Do not hide or disable the option.

## Accessibility

- The search is a `form role="search"`. Each input has a visually hidden label: "Role or keyword", "Location".
- Remote only is `role="switch"` with `aria-checked`. Its visible text is its name.
- Filter groups are `fieldset` + `legend`. Native checkboxes and radios, restyled with `appearance:none`, keep keyboard use: Space toggles, arrows move in the radio group.
- The two salary thumbs are native `input type="range"` with `aria-label` "Minimum salary" and "Maximum salary" and an `aria-valuetext` such as "$60k" or "$220k or more". Arrow keys step $5k. Home and End jump to the ends.
- A visually hidden `aria-live="polite"` paragraph announces "10 roles match" after each change.
- Row: the title is the button. `aria-current="true"` marks the selected one. The save button's label is "Save Senior Product Designer at Northline Freight", with `aria-pressed`.
- The detail pane has `tabindex="-1"` and gets focus when a similar job is picked, so screen reader users land on the new content.
- Tab order: role, location, switch, Search, filters top to bottom, Clear all, then each row (title, save), then the detail pane (Apply, save, similar jobs).
- Contrast: `#6b6b6b` on white is 5.3:1. `#0b7a3e` on white is 5.4:1. White on `#0b7a3e` is 5.4:1.
- Hit targets: rows are at least 96px tall. Save is 36px on desktop rows and 44px in the pane. Inputs and buttons are 44px. Filter options are 30px tall on desktop.

## Responsive rules

- ≥1280: three columns, 232px / fluid / 440px. Each column scrolls on its own.
- 1180 down to 1025: columns go to 208px / fluid / 380px. The header grid uses 208px too.
- 1024: two columns, list and detail, each `minmax(0,1fr)`. Filters move above them, full width, inside the `details`, which starts closed. Its `summary` shows "Filters" and "2 active". Open, the groups lay out in a `repeat(auto-fit, minmax(180px,1fr))` grid.
- 768: same as 1024. The detail pane is half the width. The fact row keeps four cells.
- <640: one column, and the page body scrolls instead of the columns. The search bar stacks: role on a full row, then location with Search beside it, then Remote only on a full row. Each row is 44px. Filters stay in the closed `details`. The list is followed by the detail pane, separated by an 8px `--soft` band. Selecting a row scrolls the detail into view. The fact row becomes 2 × 2. The age text hides; the New badge stays.
- Never scroll sideways. Every grid track is `minmax(0, …)` and every input has `min-width:0`.

## Acceptance checklist

### Always

- [ ] Three regions at desktop: filters, results, detail. Each scrolls on its own and the body does not.
- [ ] Every filter change updates the list, the heading count, and each option's count on the same event. There is no Apply filters button.
- [ ] The salary filter is one track with two thumbs, each a native range input with its own label and `aria-valuetext`.
- [ ] The thumbs keep a minimum gap and cannot cross.
- [ ] Salary matching uses overlap of bands.
- [ ] The whole row is clickable, and the save button inside it does not select the row.
- [ ] Saved state is shared between the row and the detail pane.
- [ ] An empty state with a clear action appears when nothing matches.
- [ ] Money and counts are mono. Words are not.
- [ ] One accent colour. No shadows.
- [ ] No horizontal scroll at 390px.
- [ ] Visible focus on every control, including both thumbs and the row.

### This demo

- [ ] Brand "Placard", search text "designer", heading "10 roles" on the first frame.
- [ ] Northline Freight's Senior Product Designer is selected, with "$95k–125k".
- [ ] Salary starts at $60k – $200k on a $40k – $220k track, step $5k, gap $10k.
- [ ] Experience starts with Mid, Senior, Lead ticked and Junior unticked.
- [ ] Rows posted today or yesterday show a green New badge.
- [ ] Quillworks' Design Systems Designer starts saved.
- [ ] Apply reads "Apply on Northline" and becomes "Application started".
- [ ] Columns are 232px / fluid / 440px. Radius is 6px. Green is `#0b7a3e`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame has "designer" in the role field. Experience has Mid, Senior, and Lead ticked. Salary runs $60k to $200k. The list shows 10 roles, newest first.
2. The first row, Senior Product Designer at Northline Freight, is selected. It has a soft grey fill and a 3px black bar on its left edge. Its details fill the right pane.
3. Typing in the role field filters by title, company, and tags. Typing in the location field filters by city. Both filter on every keystroke.
4. The Remote only switch toggles `aria-checked`. When on, only rows with mode Remote stay.
5. Job type and Experience are checkbox groups. Posted within is a radio group: Any time, Past 24 hours, Past 3 days, Past week, Past month.
6. Each filter option shows a mono count on the right. The count is how many rows would match if that option were the only one in its group, with all other filters applied.
7. The salary filter is one track with two thumbs, $40k to $220k, step $5k. The thumbs cannot get closer than $10k. The value line above reads "$60k – $200k". At the top end it reads "$220k+".
8. A row matches salary when its band overlaps the chosen range, not when it sits fully inside it.
9. The heading reads "10 roles". The number is mono. It says "1 role" for one.
10. Each row shows: a 40px initials tile, the title, a New badge when posted today or yesterday, company · city · mode, the salary band in mono, tags, the age ("Today", "1d ago"), and a save button.
11. Clicking anywhere on a row selects it. The detail pane swaps to that job. The save button inside the row does not select the row.
12. The save button toggles `aria-pressed`. Pressed is a filled green bookmark. The row and the detail pane share the saved state: saving in one updates the other.
13. The detail pane shows: a 52px tile, title, company · city, the salary band at 18px mono with "per year, before tax", a four-cell fact row (Type, Level, Where, Posted), a green Apply button and a save button, then About the role, What you will do, What you bring, and Similar jobs.
14. Similar jobs lists three other roles that share the level, a tag, or the mode. Clicking one selects it and scrolls the pane to the top.
15. Apply turns black and reads "Application started" with a check. It does not leave the page in this demo.
16. If the selected job is filtered out, the first remaining row is selected.
17. If nothing matches, the list shows an empty state: an icon, "No roles match these filters", one line of advice, and a Clear filters button. The detail pane reads "Pick a role to see the details."
18. Clear all filters, and Clear filters in the empty state, tick every box, set Any time, and reset salary to $40k – $220k. They do not clear the search text.

## Tokens

```css
:root {
  /* colour */
  --bg: #ffffff;          /* page */
  --soft: #f5f5f4;        /* hover, selected row, tile fill */
  --ink: #0b0b0b;         /* text, selected bar, Search button */
  --ink-2: #454545;       /* secondary text */
  --ink-3: #6b6b6b;       /* labels, counts, ages */
  --line: #e6e6e6;        /* hairlines */
  --line-2: #d0d0d0;      /* input border, unticked box */
  --green: #0b7a3e;       /* the only accent: Apply, switch on, slider fill, saved, New */
  --green-tint: #e8f3ec;  /* New badge fill */
  --focus: #0b7a3e;

  /* type */
  --sans: "Inter Tight", system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --t-11: 11px; --t-12: 12px; --t-13: 13px; --t-14: 14px;
  --t-15: 15px; --t-18: 18px; --t-22: 22px; --t-24: 24px;

  /* space (4px base) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px;

  /* shape */
  --r: 6px;
  --r-tag: 4px;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --fast: 140ms;
}
```

No shadows. Regions are split by 1px `--line` rules. The selected row uses `box-shadow: inset 3px 0 0 var(--ink)` as a bar, not as depth.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Brand | Inter Tight | 18px | 700 | 1 | -0.03em | Title |
| Result heading word | Inter Tight | 22px | 600 | 1.2 | -0.025em | Sentence |
| Result count number | JetBrains Mono | 20px | 500 | 1.2 | -0.02em | — |
| Row title | Inter Tight | 15px | 600 | 1.35 | -0.01em | Title |
| Row meta | Inter Tight | 13px | 400 | 1.45 | 0 | Sentence |
| Salary band (row) | JetBrains Mono | 13px | 500 | 1.4 | 0 | — |
| Tag | Inter Tight | 12px | 400 | 1.4 | 0 | Sentence |
| New badge | Inter Tight | 11px | 600 | 1.4 | 0.04em | Upper |
| Filter legend, detail h3 | Inter Tight | 11px | 600 | 1.4 | 0.08em | Upper |
| Filter count, age | JetBrains Mono | 12px | 400 | 1.4 | 0 | — |
| Detail title | Inter Tight | 24px | 600 | 1.15 | -0.03em | Title |
| Detail salary | JetBrains Mono | 18px | 500 | 1.3 | -0.02em | — |
| Body | Inter Tight | 14px | 400 | 1.45 | 0 | Sentence |

Rule: every money figure and every count is mono. Words are never mono.

## Implementation notes

**1. The dual slider.** Stack two range inputs on one track. Let only the thumbs take pointer events, so either thumb can be grabbed even though the inputs overlap. Draw the green fill as a separate element.

```css
.dual { position: relative; height: 24px; }
.dual .track, .dual .fill { position: absolute; top: 11px; height: 2px; }
.dual .track { left: 0; right: 0; background: var(--line); }
.dual .fill { background: var(--green); }
.dual input { position: absolute; inset: 0; width: 100%; margin: 0;
  appearance: none; background: none; pointer-events: none; }
.dual input::-webkit-slider-thumb { appearance: none; pointer-events: auto;
  width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 2px solid var(--ink); }
.dual input::-moz-range-thumb { pointer-events: auto; width: 14px; height: 14px;
  border-radius: 50%; background: #fff; border: 2px solid var(--ink); }
```

```js
function clampThumbs() {
  let a = +min.value, b = +max.value;
  if (a > b - 10) {
    if (document.activeElement === min) min.value = a = b - 10;
    else max.value = b = a + 10;
  }
  const pct = v => (v - 40) / 180 * 100;
  fill.style.left = pct(a) + '%';
  fill.style.right = (100 - pct(b)) + '%';
  min.setAttribute('aria-valuetext', '$' + a + 'k');
  max.setAttribute('aria-valuetext', '$' + b + 'k' + (b >= 220 ? ' or more' : ''));
}
```

Push back the thumb the user is not moving, never the one under their finger.

**2. Faceted counts.** An option's count must ignore its own group, or ticking one box makes every other box in the group read 0. Pass the group to skip into the match function.

```js
function matches(job, skipGroup) {
  if (query && !haystack(job).includes(query)) return false;
  if (remoteOnly && job.mode !== 'Remote') return false;
  if (skipGroup !== 'type' && !types.has(job.type)) return false;
  if (skipGroup !== 'exp' && !levels.has(job.exp)) return false;
  if (skipGroup !== 'age' && job.age > maxAge) return false;
  if (job.hi < salMin || job.lo > salMax) return false; // overlap
  return true;
}
// count for "Contract" = jobs.filter(j => matches(j, 'type') && j.type === 'Contract').length
```

**3. The whole-row click.** Put one real button in the row (the title) and stretch its hit area over the row. Lift the save button above it with `z-index`.

```css
.job { position: relative; }
.pick::after { content: ""; position: absolute; inset: 0; }
.pick:focus-visible { outline: 0; }
.pick:focus-visible::after { outline: 2px solid var(--focus); outline-offset: -2px; }
.save { position: relative; z-index: 1; }
```

Common mistakes:

- Making the `li` itself clickable with no button inside. Keyboard users cannot reach it.
- Putting a save button inside a button. Nested buttons are invalid HTML.
- An Apply filters button. The list is live.
- Counts that ignore the other groups, or that include their own group.
- Salary matching that requires the band to sit fully inside the range. A $95k–125k role should show for a $100k – $200k search.
- Letting the whole page scroll at desktop so the search bar and filters scroll away.
- Using the green for tags, links, and headings too. It belongs to Apply, the switch, the slider fill, saved, and New.
- Coloured company logos. The tile is two initials on grey.
- Setting salaries in the grotesk. The mono keeps digits lined up down the list.
- Drop shadows on cards. This is a list with rules, not a grid of cards.

Rebuild order:

1. Set the header grid and the joined search bar.
2. Set the three-column body with independent scrolling.
3. Build the row with the stretched title button and the save button.
4. Write the match function with the skip-group argument.
5. Wire every input to one render function: count, option counts, list, selection.
6. Build the dual slider and its clamp.
7. Build the detail pane and similar jobs.
8. Add the empty state and the clear actions.
9. Add the 1024 and <640 layouts, then test at 390px for sideways scroll.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
