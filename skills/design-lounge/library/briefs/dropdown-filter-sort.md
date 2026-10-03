<!-- Design Lounge Nº 232 · "Filter and sort dropdowns" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Filter and sort dropdowns

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, moss becomes the kit's primary and clay its danger or secondary accent.

## What it is

The toolbar above a stock table in Fernery, a plant nursery's back office. Filter opens a 320px popover with a search field, three groups of checkable options (Light, Category, Care & stock) and a count beside every option that updates as you pick. Sort opens a small menu of radio items, Sort by and Order, and a square button beside it flips the direction in one click. Applied filters live inline in the toolbar as moss chips with × buttons and a clay Clear all, so they stay visible while the popover is open. The detail worth copying is the faceted counts: each number says how many rows you would see if you ticked that option, given everything else already ticked, and options that would give zero are dimmed and skipped by the keyboard.

## Reference behaviour

1. First frame: the Filter popover is open under Filter, focus in Search filters. Bright indirect, Medium and Pet safe are ticked. Bright direct is the active option. The toolbar shows Filter with a 3 badge, Sort Price, the direction button (ascending), three chips (Light: Bright indirect, Light: Medium, Pet safe), Clear all, and "Showing 8 of 18 plants". The table lists those 8 sorted by price, low to high.
2. Typing in Search filters narrows the options to those whose name or group name contains the text; the matched part is highlighted `#f3e3a6`. Groups with no matches disappear. No matches shows "No filter called “…”".
3. ArrowDown/ArrowUp move the active option and wrap; PageUp/PageDown jump to first/last. Focus stays in the search field; the active option is exposed with `aria-activedescendant` and drawn with a moss-soft fill and a 1.5px moss inset ring.
4. Enter toggles the active option. Space toggles it too while the field is empty (otherwise Space types a space). Clicking an option toggles it and keeps focus in the field.
5. Every toggle immediately re-filters the table, updates the badge, chips, "Showing N of 18", the footer button ("Show 8 plants"), and every option count.
6. Options whose count is 0 and are not ticked render muted with `aria-disabled="true"`, cannot be toggled, and are skipped by the arrow keys.
7. Escape in the field clears the search if there is text; a second Escape closes the popover and focuses Filter. Clear unticks everything and keeps the popover open. Show N plants closes it. Clicking outside or tabbing out closes it without moving focus back.
8. Chips: × removes that filter and moves focus to the chip now in the same position, else the previous chip, else Filter. Clear all removes all and focuses Filter. With no filters the chip area reads "No filters. All bay 3 stock is listed."
9. Sort: pressing Sort, or ArrowDown on it, opens the menu with focus on the checked Sort by item; ArrowUp opens on the last item. Items: Sort by Name (A–Z), Price (€), Stock (units), Newest (added); separator; Order with two radios whose words follow the field: "A to Z / Z to A", "Low to high / High to low", "Newest first / Oldest first".
10. In the Sort menu: ArrowUp/Down wrap, Home/End jump, typeahead (500ms buffer), Enter/Space choose and close, Escape closes, Tab closes and moves on. Focus returns to Sort. Choosing a new field resets the order to the first option.
11. The direction button flips the order. Its icon arrow flips vertically over 240ms. Its label reads "Sort ascending, press to reverse" or "Sort descending, press to reverse". The sorted column header gets `aria-sort` and moss ink.
12. Rows fade up 4px over 220ms after each change, staggered 18ms, capped at 8 rows.
13. Placement: both popovers open 6px below their trigger, left-aligned, clamped 8px inside the viewport. If there is more room above than below and the popover doesn't fit below, it opens above. Whichever side it takes, if it's still too tall it gets `max-height` equal to the space and the option list scrolls inside, with the search and footer fixed.

## Structure

```
1280 × 800, page #edf0e8, column max 1100, padding 24 32
Fernery   Stock  Orders  Suppliers  Care cards
Greenhouse stock (36px Young Serif)
Bay 3 · counted this morning at 07:40
[≡ Filter (3)] [⇅ Sort Price] [⇵] │ (Light: Bright indirect ×) (Light: Medium ×) (Pet safe ×) Clear all   Showing 8 of 18 plants
┌ Filter popover 320 ───────┐ ┌ table card, radius 10 ─────────────────────────────────┐
│ ⌕ Search filters          │ │ PLANT        CATEGORY   LIGHT     PETS    STOCK  PRICE │
├───────────────────────────┤ │ Zebra Haworthia  [Succulent] Bright indirect ✓ Safe 18 €11.00 │
│ LIGHT                     │ │ Haworthiopsis attenuata (serif, 12.5px)                 │
│ ▢ Bright direct         1 │ │ …                                                       │
│ ☑ Bright indirect       4 │ │                                                         │
│ ☑ Medium                4 │ │                                                         │
│ ▢ Low                   1 │ │                                                         │
│ CATEGORY                  │ │                                                         │
│ ▢ Foliage … Flowering     │ │                                                         │
│ CARE & STOCK              │ │                                                         │
│ ☑ Pet safe              8 │ │                                                         │
│ ▢ In stock             10 │ │                                                         │
├───────────────────────────┤ │                                                         │
│ [Clear]   [Show 8 plants] │ │                                                         │
└───────────────────────────┘ └─────────────────────────────────────────────────────────┘

Sort menu 228
┌───────────────────────┐
│ SORT BY               │
│   Name           A–Z  │
│ ✓ Price            €  │
│   Stock        units  │
│   Newest       added  │
│ ───────────────────── │
│ ORDER                 │
│ ✓ Low to high         │
│   High to low         │
└───────────────────────┘
```

- Filter trigger: `<button aria-haspopup="dialog" aria-expanded aria-controls="fpop">` with a visual badge (`aria-hidden`) and a visually hidden ", 3 applied".
- Filter popover: `role="dialog" aria-label="Filter plants"`, non-modal. It holds a text field, so it is not a menu.
- Search: `<input role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="flist" aria-activedescendant>`.
- Options: `role="listbox" aria-multiselectable="true"`, groups as `role="group" aria-labelledby` the group heading, items `role="option" aria-selected`, each with a 16px box, the label and a right-aligned count.
- Sort trigger: `<button aria-haspopup="menu" aria-expanded aria-controls="smenu">`. Sort menu: `role="menu"` with two `role="group"`s of `role="menuitemradio" aria-checked` and a `role="separator"`.
- Direction: a plain `<button>` whose label states the current order and the action.
- Chips: a `role="group" aria-label="Applied filters"`, each chip a span with a named × button.
- Count: `role="status" aria-live="polite"`.
- Table: a real `<table>` with `scope="col"` headers and `aria-sort` on the active column.

## Tokens

```css
:root {
  --bg: #edf0e8;        /* page */
  --surface: #fbfcf8;   /* card, popovers, buttons */
  --sunk: #f3f5ef;      /* table header, hover, tags */
  --ink: #1e2a22;
  --ink-2: #4a584e;
  --ink-3: #65716a;     /* latin names, counts, group labels */
  --line: #d5dccf;
  --line-2: #e4e9de;
  --moss: #2f6b4f;      /* primary: badge, ticks, Show button, focus */
  --moss-soft: #dcebdf; /* chips, active option, expanded ring */
  --moss-ink: #1f4f39;  /* chip text, brand, sorted header */
  --clay: #a8482a;      /* Clear all, Sold out */
  --hit: #f3e3a6;       /* search match highlight */

  --serif: "Young Serif", Georgia, serif;
  --sans: "Libre Franklin", system-ui, sans-serif;

  --r-card: 10px; --r-pop: 12px; --r-btn: 8px; --r-option: 7px;
  --pop-w: 320px; --menu-w: 228px; --option-h: 34px; --menu-item-h: 32px; --btn-h: 38px;
  --shadow: 0 1px 2px rgba(30,42,34,.06), 0 16px 36px -10px rgba(30,42,34,.22);
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role | Family | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| Brand | Young Serif | 22px | 400 | `--moss-ink` |
| Page title | Young Serif | 36px | 400 | line-height 1.05, -0.01em |
| Latin name | Young Serif | 12.5px | 400 | `--ink-3`, not italic |
| Empty state title | Young Serif | 20px | 400 | |
| Toolbar buttons | Libre Franklin | 13.5px | 600 | "Sort" prefix 400 `--ink-2` |
| Table header | Libre Franklin | 11.5px | 600 | uppercase, 0.06em |
| Cells | Libre Franklin | 14px | 400 / 600 names | numbers tabular, right-aligned |
| Group label | Libre Franklin | 11px | 700 | uppercase, 0.08em, `--ink-3` |
| Option | Libre Franklin | 14px | 400 | count 12px tabular `--ink-3` |
| Chip | Libre Franklin | 12.5px | 600 | facet prefix 400 in `--moss` |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Popover in | open | opacity, translateY | 0, -4px (or +4px above) → 1, 0 | 180ms | `--expo` |
| Popover out | close | opacity | 1 → 0, `hidden` | 100ms | `--ease` |
| Checkbox | toggle | box fill, tick opacity/scale | empty, .6 → moss, 1 | 120ms | `--ease` |
| Chip in | added | scale, opacity | .85, 0 → 1, 1 | 180ms | `--expo` |
| Rows | any change | opacity, translateY | 0, 4px → 1, 0 | 220ms, 18ms stagger, max 8 | `--ease` |
| Direction icon | toggle | scaleY | 1 → -1 | 240ms | `--expo` |
| Expanded trigger | open | ring | none → 3px `--moss-soft` | instant | — |

Reduced motion: all durations 1ms, no translate. The table still updates and the count is still announced.

## States

- Toolbar button: 38px, 1px `--line`, radius 8. Hover `#b9c4b2` border. Expanded: moss border + 3px moss-soft ring.
- Badge: 20px pill, moss, white 11.5px; hidden at zero.
- Option: hover `--sunk`; active (keyboard or pointer) moss-soft + 1.5px moss inset; selected: moss box with white tick; disabled: `--ink-3` text, `--line` box border.
- Footer: Clear is outline 34px; Show N plants is moss fill 34px, the count matches the table.
- Menu radio: focus moss-soft; checked shows a moss tick and weight 600.
- Chips: 30px, radius 15, moss-soft; × button 24px round with 12% moss-ink hover.
- Sold out: clay 600 in the stock column. Pets: moss "✓ Safe" or `--ink-3` "Toxic".
- Empty table: one full-width cell, "No plants match" in Young Serif 20px and "Remove a filter or clear them all."

## Accessibility

- The filter surface is a non-modal dialog with a combobox and a multi-select listbox. A `role="menu"` with `menuitemcheckbox` would be the right model only if there were no search field. The Sort surface has no text input, so it is a real menu with radio items.
- Focus stays in the search field while arrowing through options (`aria-activedescendant`); the active option is scrolled into view with `block: "nearest"`.
- Counts are plain text inside the option, so the option reads as "Medium 4". Selection is `aria-selected`, not just the drawn box.
- The Filter button's accessible name includes the applied count: "Filter, 3 applied".
- The direction button's label always states the current order and the action.
- `aria-sort` sits on the sorted column header only.
- The live region announces "Showing 8 of 18 plants" after each change.
- After a chip is removed, focus moves to a neighbouring chip or back to Filter; it never drops to `body`.
- Contrast: `--ink-3` on surface 4.9:1 and on `--sunk` 4.6:1; moss-ink on moss-soft 7.6:1; white on moss 6.3:1; clay on page 5.0:1.
- Targets: buttons 38px, options 34px, menu items 32px, chip × 24px inside a 30px chip.

## Responsive rules

- ≥1100: as drawn; chips sit inline after a 1px divider, the count pushed right.
- <860: drop the Light and Pets columns.
- <640: chips wrap onto their own full-width row under the buttons (divider removed), the count goes full width, Category column hides, page padding 18px 14px, title 28px. The popover is `min(320px, 100vw - 16px)` and keeps left alignment with clamping.
- At 375 the Filter popover is taller than the space below; it stays below and its list scrolls, search and footer stay pinned.
- On a native phone app, use a full-height filter sheet instead; this is a pointer-and-keyboard pattern.

## Acceptance checklist

### Always

- [ ] Filter is a non-modal dialog with a combobox search and a `listbox aria-multiselectable` of grouped options.
- [ ] Arrow keys move the active option with focus kept in the search field; Enter toggles; Space toggles only when the field is empty.
- [ ] Counts are faceted: each option shows the rows you'd get by adding it, given the other facets.
- [ ] Zero-count options are `aria-disabled`, muted, and skipped by arrows.
- [ ] Escape clears the search first, then closes and returns focus to Filter.
- [ ] Sort is a `role="menu"` of `menuitemradio`s in two groups, with arrows, Home/End, typeahead, Enter/Space, Escape, Tab.
- [ ] A separate direction button flips the order; the sorted header has `aria-sort`.
- [ ] Chips mirror the filters, each with a named × button and focus handoff; Clear all resets.
- [ ] Popovers flip above only when there is more room there, and otherwise clamp their height with an internal scrolling list.
- [ ] The result count is announced through a live region.

### This demo

- [ ] First frame: Bright indirect, Medium, Pet safe ticked; 8 of 18 plants; sorted by price, low to high.
- [ ] Groups: Light (4 options), Category (5), Care & stock (Pet safe, In stock).
- [ ] Typing "fern" leaves only Category › Fern with its highlighted match.
- [ ] Sort fields: Name, Price, Stock, Newest; order words change with the field.
- [ ] Popover 320px, radius 12, options 34px, footer button reads "Show 8 plants".

## Implementation notes

**Faceted counts.** Evaluate every facet except the one the option belongs to, then test the option. Within a facet, options are OR (Bright indirect or Medium); across facets, AND. "Care & stock" options are independent requirements, so they are AND.

```js
const passes = (p, skip) => FACETS.every(f =>
  f.k === skip || !sel[f.k].size ||
  (f.k === 'more'
    ? [...sel.more].every(v => match(p, 'more', v))
    : [...sel[f.k]].some(v => match(p, f.k, v))));
const countFor = (f, o) => P.filter(p => passes(p, f.k) && match(p, f.k, o)).length;
```

**Active descendant, not roving focus.** The input keeps focus so typing keeps filtering; arrows move a highlight.

```js
function setActive(i){
  const os = [...list.querySelectorAll('[role="option"]:not([aria-disabled="true"])')];
  list.querySelector('.act')?.classList.remove('act');
  if (!os.length) { input.removeAttribute('aria-activedescendant'); return; }
  active = (i + os.length) % os.length;
  os[active].classList.add('act');
  input.setAttribute('aria-activedescendant', os[active].id);
  os[active].scrollIntoView({ block: 'nearest' });
}
list.addEventListener('mousedown', e => e.preventDefault()); // clicks don't steal focus
```

Re-rendering the list on each toggle replaces the nodes, so restore the active index by option id afterwards, or the highlight jumps to the top.

**Placement with a scrolling middle.** The popover is a flex column; the listbox is `flex: 1; min-height: 0; overflow: auto`. Setting `max-height` on the popover then scrolls only the list.

```js
el.style.maxHeight = '';
const r = a.getBoundingClientRect(), m = el.getBoundingClientRect();
const below = innerHeight - 8 - r.bottom - 6, above = r.top - 6 - 8;
let top = r.bottom + 6;
if (m.height > below && above > below) { const h = Math.min(m.height, above); if (m.height > above) el.style.maxHeight = above + 'px'; top = r.top - 6 - h; }
else if (m.height > below) el.style.maxHeight = below + 'px';
```

Common mistakes:

- Static counts from the full dataset. They lie as soon as one filter is on.
- Putting the search field inside a `role="menu"`.
- Moving DOM focus into the options, so the next typed letter jumps instead of searching.
- Space always toggling, so "bright indirect" can never be typed.
- Chips below the toolbar, hidden under the open popover.
- Closing the popover on every toggle. Multi-select stays open; the table updates live behind it.
- Sorting "Newest" ascending by date and calling it newest first. Store age and sort it ascending.

Rebuild order:

1. Data, facets, `passes()`, sorting, and the table render.
2. Toolbar buttons, chips, count, live region.
3. Filter popover: search, grouped listbox, counts, active descendant, toggle, footer.
4. Sort menu with radio groups and the direction button.
5. Placement for both, outside click, focus-out close, Escape layering.
6. Row animation, reduced motion, 375px layout.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
