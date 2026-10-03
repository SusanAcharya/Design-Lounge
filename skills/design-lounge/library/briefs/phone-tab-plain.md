<!-- Design Lounge Nº 239 · "Plain phone tabs" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Plain phone tabs

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is the tab bar for families that are not glass.

## What it is

A phone shell for a personal app that is not using the glass language. Four tabs sit on a flat surface at the bottom: Home, Spend, Budgets, You. Spend starts current. The current tab is navy ink with a 2px crimson mark on its top edge. The others are muted. There is no blur, no translucent pill, and no floating capsule. Above the bar, the screen name is a 13px label and the current section is a 40px heading. The bar respects the home indicator with 34px of padding under the labels, and the page starts 54px below the top. The Lounge draws the status bar. Do not draw one here.

## Reference behaviour

1. Spend starts with `aria-current="page"`. The heading reads Spend.
2. Tapping a tab moves `aria-current` to it and sets the heading to that tab's name. The others lose the mark.
3. Only one tab is current.
4. The bar does not hide on scroll. This frame does not scroll.
5. No motion. Reduced motion has nothing to remove.
6. Icons are inline SVG, 22px, stroke 1.75, round caps, `currentColor`. No emoji.
7. Each tab's hit target is at least 44px tall, before the 34px home padding.

## Structure

```
padding-top 54px, padding-inline 20px
ASAR                         13px
Spend                        40px

fixed bottom bar, surface, 1px top rule
[ Home ] [ Spend ] [ Budgets ] [ You ]
padding-bottom 34px
```

- The label and the heading are in the page. The heading is the only `h1`.
- The bar is a `nav` with four buttons.
- The bar is `position: fixed` at the bottom, full width, `--surface`, `border-top: 1px solid --line`.
- Page padding-bottom is 96px so the heading can never sit under the bar.
- Grain is on the page. The bar is opaque surface, so the grain stops at the hairline.

## Tokens

```css
:root {
  --bg: #f4ead6;
  --surface: #fbf6ea;
  --ink: #1c2744;
  --ink-2: #3e4a66;
  --ink-3: #6d768c;
  --line: #d9cbb3;
  --primary: #c8102e;
  --focus: #c8102e;
  --display: "Noto Serif Devanagari", Georgia, serif;
  --sans: "Mukta", system-ui, sans-serif;
}
```

## Typography

| Role | Family | Size | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Label | Mukta | 13px | 600 | 0.04em | `--ink-2` |
| Section | Noto Serif Devanagari | 40px | 600 | -0.02em | `--ink` |
| Tab | Mukta | 11px | 600 | 0 | `--ink-3`, current `--ink` |

The section heading is the largest type. The tab labels stay 11px. Do not set the tabs in the display face.

## Motion

None. A tab change replaces the heading immediately. A sliding pill is the glass piece, `ios-glass-tab-bar`. Do not import it here.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Tab | click | aria-current moves, heading text becomes the tab name, top border becomes the primary |

## States

- Tab resting: colour `--ink-3`, top border 2px transparent, min-height 44px.
- Tab current: colour `--ink`, top border 2px `--primary`, `aria-current="page"`.
- No filled pill behind the current tab.
- Focus-visible: 2px outline, offset 2px.
- Disabled: not used. All four tabs are available.
- Do not add a badge count on this frame.

## Accessibility

- The nav is labelled "Sections".
- Each control is a button. The visible word is the name. The icon is `aria-hidden`.
- `aria-current="page"` is the current tab. Do not also set `aria-pressed`.
- Hit target is at least 44px tall and a quarter of the bar wide.
- Contrast: `#1c2744` on `#fbf6ea` clears 4.5. `#6d768c` on `#fbf6ea` is the muted tab. If a locked theme's muted ink fails 4.5 on the bar, use `--ink-2` instead of inventing a hex.
- The top mark is not the only signal. The current label is darker, and the heading repeats the name.

## Responsive rules

- The frame is 390×844. Padding top 54px. Bar padding bottom 34px.
- At 360 wide, the four labels still fit. Do not drop the words and leave only icons.
- At tablet width, do not stretch this bar across 1180px. A tablet uses the tablet recipe, with a sidebar or a split. This bar is a phone.
- Do not draw a status bar, a notch, or a home indicator glyph. The padding is the clearance.

## Acceptance checklist

### Always

- [ ] One current tab. This demo has four sections. A product uses three to five, one per real section, and does not add or drop a tab to match this demo.
- [ ] The bar is a flat surface with a 1px top rule. No blur, no glass, no floating capsule.
- [ ] The current tab uses a 2px top mark in the primary, not a pill fill.
- [ ] Each tab is at least 44px tall.
- [ ] The home clearance is 34px under the labels. The top clearance is 54px.
- [ ] Icons are stroke SVGs in `currentColor`, not emoji.
- [ ] One nav system. No second bar.

### This demo

- [ ] The first frame heading is Spend at 40px.
- [ ] Spend has `aria-current="page"` and a crimson top border.
- [ ] The other labels are Home, Budgets, and You.
- [ ] Tapping Budgets sets the heading to Budgets and moves the mark.
- [ ] The bar background is `#fbf6ea` with a `#d9cbb3` top rule.
- [ ] Page padding-top is max(54px, env(safe-area-inset-top)). Bar padding-bottom is max(34px, env(safe-area-inset-bottom)).
- [ ] No status bar is drawn.
- [ ] Focus ring is 2px, offset 2px.

## Implementation notes

Always: use this bar when the family is quiet, soft, sharp, editorial, or industrial. Use `ios-glass-tab-bar` only when the family is glass. Do not put a glass bar on a Lokta screen.

The current mark is a border, not an extra element:

```css
.tab { border-top: 2px solid transparent; min-height: 44px; color: var(--ink-3); }
.tab[aria-current="page"] { color: var(--ink); border-top-color: var(--primary); }
.bar { padding-bottom: max(34px, env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line); }
```

Common mistakes:

- Borrowing the glass tab bar because it is the first phone nav in the index.
- A floating rounded rectangle with a shadow.
- Icons only, no labels.
- Five tabs. Four is this piece.
- A badge, a FAB, and the bar all competing.
- Drawing the clock and the battery.
- Setting the tab labels in the display serif.
- A second navigation row under the heading.
- Blur on the bar "so the content shows through". The content stops above the bar.
- Using this bar on a tablet width.

Where it sits:

1. It is the shell of a personal phone app. The section heading is the screen you are on.
2. Spend opens `chart-rank-spend` stacked for the phone. Budgets opens `budget-meter`. Those pieces are not drawn inside this demo.
3. Home and You are named so the bar is complete. Their screens are still open unless the pass includes them.
4. Empty and failed lists on this shell use `mobile-list-empty` and `mobile-load-failed`, restyled onto the locked theme.
5. One primary button may exist in the page body. The tabs are navigation, not a second primary.
6. When a theme is locked, the mark is `--primary` and the bar is `--surface`.
7. Grain stays on the page, not on the bar.
8. Do not mix this with a sidebar. A phone has one nav.
9. The heading at 40px is the answer for this piece, which is "where am I". A money screen that uses this shell gives the amount the display size and drops this heading to a 13px label. Do not keep both at display size.
10. The credit line stays on the token block.

Rebuild order:

1. Set the phone padding, 54px top, room for the bar at the bottom.
2. Place the label and the 40px heading.
3. Place the fixed bar with four buttons, 34px under them.
4. Mark Spend current.
5. Wire taps to the heading and `aria-current`.
6. Confirm there is no blur and no pill.
7. Map colours onto the locked theme if a kit is on.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
