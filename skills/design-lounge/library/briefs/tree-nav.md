<!-- Design Lounge Nº 463 · "Tree" · www.designlounge.live -->

# Tree

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the current row uses `--primary-soft` and the row height follows the family. This is not the collapsing sidebar. That piece is a rail of icons. This piece is nested pages.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A tree of places, 320px wide. Dispatch is open. Inside it, Asar is open on Gate 4 and Gate 2, and Gate 4 is the current page. Bhadra is closed, and it holds Shift list. People is closed, and it holds Roles. A branch button shows – when open and + when closed. Opening Bhadra reveals Shift list. Clicking a leaf moves `aria-current="page"` to that leaf. The current row sits on the soft green. There is no indentation ornament beyond 16px per level, and no animation.

## Structure

```
padding 48px 64px
Places                       12px
tree, width 320
  – Dispatch
      – Asar
          Gate 4             current
          Gate 2
      + Bhadra
  + People
each row min-height 40, indent 16px per level
```

- Nested `ul` elements. The outer list has no bullets.
- A branch is a button with `aria-expanded`. Its child list is the next sibling.
- A leaf is a button. The current leaf has `aria-current="page"`.
- The + and – marks are `aria-hidden`. The button name is the place.

## Motion

None. A branch opens in one frame. Reduced motion has nothing to remove. Do not animate the height.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Branch | click | expanded, mark, child list |
| Leaf | click | which row is current |
| Focus | keyboard | 2px ring |

## States

- Row resting: min-height 40px, padding 0 8px, transparent, radius 2px, gap 8px.
- Branch open: `aria-expanded="true"`, mark –, child list visible.
- Branch closed: `aria-expanded="false"`, mark +, child list `display: none`. Use the attribute in CSS so a closed list is not only visually gone if you also hide it from the tree. `display: none` removes it from the accessibility tree.
- Current leaf: background `--primary-soft`, weight 500.
- Focus-visible: 2px outline, offset 2px.
- Do not invert the current row into a solid primary button.
- Hover may use `--surface-2`. Current wins over hover.

## Accessibility

- Branch buttons expose `aria-expanded`.
- The current page is `aria-current="page"` on one leaf.
- Marks are `aria-hidden="true"`.
- Tab order follows the visible rows. Closed children are not tabbed.
- Hit target: every row is at least 40px, and 44px on a phone.
- Contrast: `#161513` on `#e7f2ec` clears 4.5.
- Do not use a triangle image with no button name. The place name is the name.

## Responsive rules

- At 1280 the tree is 320px, padding 48px 64px.
- Below 640 the tree is full width inside 20px padding. Indent stays 16px. Rows stay at least 40px.
- Do not collapse this tree into a select. The nesting is the point.
- A product with one level of pages uses a list, not a tree. This demo has two levels under Dispatch and one under People.

## Acceptance checklist

- [ ] Dispatch and Asar start open. Bhadra and People start closed.
- [ ] Gate 4 starts as the current page, on `#e7f2ec`.
- [ ] Opening Bhadra shows Shift list. Opening People shows Roles.
- [ ] The mark is – when open and + when closed, and it is hidden from assistive tech.
- [ ] Clicking Gate 2 moves the current page and clears Gate 4.
- [ ] Closing Asar hides its gates. Reopening shows Gate 4 current if it was current.
- [ ] Rows are at least 40px. Indent is 16px. The tree is 320px wide.
- [ ] Radius is 2px.
- [ ] There is no animation and no icon rail.
- [ ] Focus ring is 2px, offset 2px.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Dispatch and Asar are expanded. Gate 4 has `aria-current="page"`. Bhadra and People are collapsed, and their children are not shown.
2. Clicking a branch toggles `aria-expanded` and swaps the mark between – and +.
3. Clicking Gate 2, Shift list, or Roles makes that leaf current and clears the previous current. The branches stay as they were.
4. Collapsing Asar hides Gate 4 and Gate 2. Gate 4 remains the current page even while hidden, and it shows again when Asar opens.
5. There is no animation. Focus ring is 2px `--focus`, offset 2px.
6. The tree does not navigate the frame. Current is a state on the row.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --ink: #161513;
  --ink-2: #5a554c;
  --primary-soft: #e7f2ec;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Row radius is 2px. The family replaces it. Do not put each row in a card. The current row is the only fill.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Row | sans | 14px | 400 | `--ink` |
| Current | sans | 14px | 500 | `--ink` |
| Mark | sans | 12px | 400 | `--ink-2` |

The where-line letter-spacing is 0.04em. The mark is 16px wide so the words align.

## Implementation notes

The child list is the next sibling of the branch button. CSS hides it while the button is collapsed.

```css
button[aria-expanded="false"] + ul { display: none; }
```

Toggle the attribute and the mark together.

Common mistakes:

- A collapsing icon rail. That is `collapsing-sidebar-rail`.
- A dropdown menu. That is `nested-dropdown-menu`. It closes when you leave. A tree stays on the page.
- A breadcrumb plus a tree that repeat the same path in two styles. The breadcrumb is the path of the current page. The tree is the map. If both are on one screen, Gate 4 is current in both.
- Checkboxes on the rows. This tree navigates. It does not multi-select.
- Animating the open height.
- A current row in solid primary.
- Pill rows on a square family.

Where it sits in a product:

1. Use it for nested places: a yard, a file tree, a set of settings groups.
2. A flat nav of five items is not a tree.
3. The current row is `--primary-soft` and `aria-current="page"`.
4. Height and radius follow the family.
5. When a theme is locked, the current fill is that theme's `--primary-soft`.
6. One tree per screen. Do not also draw a second sidebar of the same pages.
7. The where-line Places is the screen name.
8. Gate 4 here is the same gate as the breadcrumb demo. Do not rename it on one and not the other if both are in the product.
9. People holds Roles, which is the list in `people-role-list`. Do not invent a second role set inside the tree.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the nested lists. Open Dispatch and Asar. Close Bhadra and People.
3. Mark Gate 4 current.
4. Wire branch toggles.
5. Wire leaf clicks to move the current page.
6. Check a closed branch is not in the tab order.
7. Map the current fill and the radius onto the kit.

Copy you keep:

1. Places.
2. Dispatch, Asar, Gate 4, Gate 2, Bhadra, Shift list, People, Roles.
3. Gate 4 starts current.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
