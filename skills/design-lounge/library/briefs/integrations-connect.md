<!-- Design Lounge Nº 177 · "Connection grid" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Connection grid

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A connections block for Field ledger. Six tools sit in a grid of three. Each card is a name, one sentence, and one button. The button reads Connect or Connected. This is not a logo marquee. A marquee of customer marks is `logos-mono-marquee`. This is not a feature tour with a preview. A tabbed preview is `features-tabbed-preview`.

## Reference behaviour

1. The first frame has Gate mail, Night book, and Month close pressed. Their buttons read Connected.
2. Yard map, Store tally, and Desk chat are off. Their buttons read Connect.
3. Clicking a button toggles that card only. The others stay as they were.
4. Pressed text is Connected. Unpressed text is Connect.
5. Nothing else on the card is a control. The name is a heading.

## Structure

```
1280 × 800
padding 36px 64px 40px
Field ledger
Connections
grid, 3 columns, gap 16px
card, surface, border, padding 22px 20px, min-height 168px
  name
  one sentence, max 28ch
  button, margin-top auto, height 36px, pill
```

- Six `article` elements. Each has an `h2`, a `p`, and a `button`.
- The button sits at the bottom of the card because the card is a column and the button has `margin-top: auto`.

## Tokens

```css
:root {
  --bg: #f4f1ea;
  --surface: #fffdf8;
  --ink: #1a1814;
  --ink-2: #5c564c;
  --line: #e3ddd2;
  --primary: #1f4d3a;
  --soft: #e7f2ec;
  --display: "Fraunces", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Kicker | Public Sans | 11px | 500 | 1 | 0.14em, upper |
| Title | Fraunces | 44px | 560 | 1 | -0.02em |
| Card name | Fraunces | 22px | 560 | 1.2 | 0 |
| Sentence | Public Sans | 14px | 400 | 1.45 | 0 |
| Button | Public Sans | 12px | 500 | 36px | 0.06em, upper |

The sentence colour is `--ink-2`. The card name is `--ink`.

## Motion

None. The button fill changes at once. Do not animate a checkmark into the label. Reduced motion has nothing to remove.

## States

- `aria-pressed="false"`: transparent fill, 1px `--ink` border, label Connect.
- `aria-pressed="true"`: `--soft` fill, `--primary` border, `--primary` text, label Connected.
- Hover does not change a pressed button into a second colour. The pressed state is the state.
- Focus is a 2px `--primary` ring, offset 3px.
- There is no disabled card. A tool that cannot connect is a different piece.

## Accessibility

- The button's accessible name is its visible label, Connect or Connected.
- Do not add a second status word beside the button. The label is the status.
- `aria-pressed` tracks the state. Update the text in the same click.
- Cards are not links. Connecting is the only action.
- The button is at least 36px tall. Horizontal padding is 14px.

## Responsive rules

- At 1280 the grid is three columns.
- At 800 the grid is two columns. Card min-height stays 168px.
- Below 560 the grid is one column. Page padding becomes 20px. The title drops to 36px.
- Do not turn the cards into a marquee.

## Acceptance checklist

### Always

- [ ] Six cards, three columns from 800px up.
- [ ] Each card has a name, one sentence, and one button.
- [ ] The button toggles Connect and Connected on that card only.
- [ ] Pressed uses `--soft`, a `--primary` border, and `--primary` text.
- [ ] The button sits at the bottom of a card that is at least 168px tall.
- [ ] Focus ring is 2px `--primary`, offset 3px.
- [ ] No logos, no marquee, and no second status label.

### This demo

- [ ] The product is Field ledger. The title is Connections.
- [ ] Gate mail, Night book, and Month close start Connected.
- [ ] Yard map, Store tally, and Desk chat start as Connect.
- [ ] Month close mentions रु and lakh grouping.
- [ ] Gate mail mentions the note when a load is booked.

## Implementation notes

Toggle text and `aria-pressed` together. If you toggle the attribute and forget the text, the state and the word disagree.

```js
const on = b.getAttribute('aria-pressed') === 'true';
b.setAttribute('aria-pressed', on ? 'false' : 'true');
b.textContent = on ? 'Connect' : 'Connected';
```

The card is a flex column. `margin-top: auto` on the button pins it when sentences wrap to two lines. Do not absolutely position the button.

This is not `logos-mono-marquee`. That piece is a moving row of marks. This piece is six tools you connect, one button each.

Do not store the pressed state. The demo has no account. A refresh returns to the first frame.

Measurements to keep:

- Page padding is 36px top, 64px sides, 40px bottom.
- The title is 44px. The gap under it is 28px.
- The grid gap is 16px. Three columns at 1280.
- A card min-height is 168px. Padding is 22px 20px.
- The card name is 22px Fraunces. The sentence is 14px, max 28ch.
- The button is 36px tall, padding 0 14px, radius 999px.
- Connected is not a second element. It is the button label.
- Three cards start pressed. Three start off. Clicking one does not reset the others.
- The sentence can wrap to two lines. The button still sits on the bottom edge because of `margin-top: auto`.
- Do not add a logo, a mark, or a coloured tile in place of the name. The name is the identity.
- Gate mail's sentence is about the note. Yard map's sentence names Gate 4 and the salt room.
- Desk chat names Mira. Store tally names rice, oil, salt, and tea.
- Night book says held loads stay held after 18:00.
- The kicker is Field ledger, 11px, uppercase, tracking 0.14em, colour `--ink-2`.
- The title is Connections, 44px Fraunces, tracking -0.02em, with 28px under it.
- Card border is 1px `--line`. The page background is `--bg`, not the card surface.
- A card does not lift on hover. The button is the only thing that changes.
- The six names, in order: Gate mail, Yard map, Night book, Store tally, Desk chat, Month close.
- Row one is Gate mail, Yard map, Night book. Row two is the other three.
- Month close is the last card and it starts Connected.
- Yard map is the second card and it starts as Connect.
- Do not sort the cards. The order above is the order on the page.
- A refresh restores Gate mail, Night book, and Month close to Connected.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
