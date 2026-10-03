<!-- Design Lounge Nº 278 · "Status badge" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Status badge

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the washes are the theme's soft colours and the words use the matching on-soft ink. A badge is state, not decoration.

## What it is

A short queue of Asar loads. Each row is a name, a gate, and one badge. Rice is Cleared. Oil is Held. Salt is Refused. Tea is Booked. The four badges use four different washes because the four loads are in four different states. A list where every row is Held has no Held. The badge is 22px tall, a full pill, 11px type. The row is 56px. This is not a button. Clicking a row is a different piece.

## Reference behaviour

1. The first frame shows the four rows in that order.
2. Nothing toggles. The badges do not filter the list. Filtering is `filter-toolbar`.
3. There is no animation and no hover that changes the badge colour.
4. The badge text is the state. The wash agrees with it. Do not add a second icon that repeats the word.

## Structure

```
padding 48px 64px
Asar loads                   12px
list, width 560, surface, radius 2
  Rice        Gate 4     Cleared
  Oil         Gate 2     Held
  Salt        Gate 1     Refused
  Tea         Gate 4     Booked
each row min-height 56, padding 0 16
```

- The list is a `ul`. Each row is an `li`.
- The badge is a `span`. It is not a button.
- Name is 14px weight 500. Gate is 12px `--ink-2` under the name.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --line: #e4dfd4;
  --success-soft: #d6e8dc;
  --success-on-soft: #1b5e3d;
  --warning-soft: #f3e6d0;
  --warning-on-soft: #7d470e;
  --danger-soft: #f8e4e2;
  --danger-on-soft: #8a1f1f;
  --info-soft: #e4eef5;
  --info-on-soft: #1a4060;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

The badge radius is 999px because a badge is a pill in the component sheet, even when the family's button is square. Do not square it to match the button. The list radius is 2px and does follow the family's card radius.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Name | sans | 14px | 500 | `--ink` |
| Gate | sans | 12px | 400 | `--ink-2` |
| Badge | sans | 11px | 500 | the on-soft ink |

Badge letter-spacing is 0.04em. Line-height is 22px, matching the height. The words are not uppercase.

## Motion

None. Reduced motion has nothing to remove.

| Thing | Trigger | What changes |
| --- | --- | --- |
| None | the states are the content | the badge does not animate |

## States

- Cleared: background `--success-soft`, text `--success-on-soft`.
- Held: background `--warning-soft`, text `--warning-on-soft`.
- Refused: background `--danger-soft`, text `--danger-on-soft`.
- Booked: background `--info-soft`, text `--info-on-soft`.
- Badge box: height 22px, padding 0 8px, radius 999px.
- Row: min-height 56px, a 1px `--line` between rows, none on the last row.
- Do not use the solid success, warning, or danger as the badge fill. Text on a wash uses the on-soft token.
- A neutral count, if you need one, uses `--surface-2` and `--ink-2`. These four are states.

## Accessibility

- The state is a word, not a colour alone.
- The row is not a button in this piece, so it is not a tab stop.
- Contrast: each on-soft ink on its wash clears 4.5. `#1b5e3d` on `#d6e8dc`, `#7d470e` on `#f3e6d0`, `#8a1f1f` on `#f8e4e2`, `#1a4060` on `#e4eef5`.
- Do not put the solid red `#9b2c2c` as text on the danger wash if the on-soft token is the one that was walked for that wash. Use the token.
- The where-line is not a heading that replaces the list. The names are the content.

## Responsive rules

- At 1280 the list is 560px, padding 48px 64px.
- Below 640 the list is full width inside 20px padding. The badge stays on the row. Do not move it under the name unless the row is under 320px, and then keep the 22px height.
- Rows stay at least 56px.

## Acceptance checklist

- [ ] The rows are Rice Cleared, Oil Held, Salt Refused, Tea Booked.
- [ ] Gates are 4, 2, 1, and 4.
- [ ] Each badge is 22px tall, padding 0 8px, radius 999px, type 11px.
- [ ] Cleared text is `#1b5e3d` on `#d6e8dc`.
- [ ] Held text is `#7d470e` on `#f3e6d0`.
- [ ] Refused text is `#8a1f1f` on `#f8e4e2`.
- [ ] Booked text is `#1a4060` on `#e4eef5`.
- [ ] The list is 560px. Rows are at least 56px.
- [ ] Badges are not buttons and do not share one wash.
- [ ] There is no animation.

## Implementation notes

Map the word to the pair. Do not colour by index.

```css
.ok { background: var(--success-soft); color: var(--success-on-soft); }
.wait { background: var(--warning-soft); color: var(--warning-on-soft); }
```

Common mistakes:

- The solid fill as the badge background, with white text that fails on a light red.
- Every row Held, so the warning means nothing.
- A badge used as a filter chip. Chips are `filter-toolbar`.
- Uppercase tracking so wide the word wraps.
- A dot with no word.
- Squaring the badge because the family radius is 0. The badge stays a pill.
- A second colour you invented beside the four tokens.

Where it sits in a product:

1. Put a badge on a row or beside a title when the object has a state.
2. One state per object. Four tones on one row is noise.
3. A page-level message is `inline-alert`. A save that stays is `saved-banner`. A toast is `toast-stack`.
4. Text on the wash is the on-soft token, never the solid colour.
5. When a theme is locked, use that theme's soft and on-soft pairs. Do not keep these hexes.
6. The list radius follows the family's card radius. The badge does not.
7. Do not make the badge the primary button.
8. Rice, Oil, Salt, and Tea are this demo. A product uses its own nouns.
9. Held is warning. It is not a second brand colour.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper, the four washes, and IBM Plex Sans.
2. Place the where-line and the 560px list.
3. Place the four rows and the four badges.
4. Check each ink on its wash.
5. Check the rows do not all share a wash.
6. Map the pairs onto the theme when a kit is on.

Copy you keep:

1. Asar loads.
2. Rice, Oil, Salt, Tea.
3. Gate 4, Gate 2, Gate 1, Gate 4.
4. Cleared, Held, Refused, Booked.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
