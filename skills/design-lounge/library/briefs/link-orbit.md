<!-- Design Lounge Nº 286 · "Link orbit" · designlounge.vercel.app -->

# Link orbit

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

## What it is

A ring of connections for the yard. The hub says Yard. Eight pills sit on a dashed circle: Gate mail, Night book, Month close, Yard map, Store tally, Desk chat, Load bell, Cold room. Gate mail starts pressed and the line reads "Gate mail is connected." Choosing another moves aria-pressed and rewrites the line. The ring does not spin. A grid of the same idea is `integrations-connect`. A logo tape is `logos-mono-marquee`.

## Reference behaviour

1. Gate mail is aria-pressed true.
2. The caption is "Gate mail is connected."
3. Clicking a pill presses it and unpresses the others.
4. The caption becomes the pill name plus " is connected."
5. The hub is not a button.
6. The pills do not navigate.
7. Positions use --i from 0 to 7, 45 degrees apart, 200px from the centre.

## Structure

```
centred column
Around the yard
520px orbit
hub Yard
caption
```

- Orbit box 520×520.
- Dashed ring inset 50px.
- Hub 120px, fill #1f4d3a.
- Each node is 92×40, radius 999px.
- Transform is rotate(i * 45deg) translateY(-200px) rotate(i * -45deg).

## Tokens

```css
:root {
  --bg:#f4f1ea; --surface:#fffdf8; --ink:#1a1814; --ink-2:#5c564c;
  --line:#e3ddd2; --primary:#1f4d3a; --soft:#e7f2ec;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Title | Fraunces | 40px | 560 | 1 | 0 |
| Node | Public Sans | 13px | 500 | 1 | 0 |
| Caption | Public Sans | 15px | 400 | 1.4 | 0 |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Pressed pill | click | surface | soft wash | none | instant |

## States

- Pressed: background #e7f2ec, border #1f4d3a, text #1f4d3a.
- Rest: surface #fffdf8, border #e3ddd2.
- Hub stays filled.
- Caption always names the pressed connection.

## Accessibility

- Each connection is a button with aria-pressed.
- The caption is aria-live polite.
- The hub is text, not a control.
- Do not rely on position to name the connection. The pill has a text label.
- Focus ring is 2px #1f4d3a, offset 3px.
- Eight is the count in this demo. A product may have fewer, not a spinning wheel of dozens.

## Responsive rules

- The orbit is 520px at 1280.
- Below 600 the orbit scales with width and the translate drops toward 120px so pills stay on screen.
- Do not replace the ring with a wrapping chip row at desktop. The ring is the section.

## Acceptance checklist

### Always

- [ ] One hub, one ring, one pressed connection.
- [ ] The caption names the pressed connection.
- [ ] The ring does not rotate.
- [ ] Pills are buttons.
- [ ] Labels are words, not logos of real companies.

### This demo

- [ ] The eight names are Gate mail, Night book, Month close, Yard map, Store tally, Desk chat, Load bell, Cold room.
- [ ] Gate mail starts pressed.
- [ ] The title is Around the yard.
- [ ] The hub word is Yard.
- [ ] Display is Fraunces. Text is Public Sans.

## Implementation notes

Counter-rotate the pill so the label stays upright.

```css
transform: rotate(calc(var(--i) * 45deg)) translateY(-200px) rotate(calc(var(--i) * -45deg));
```

Do not animate --i. A moving target is hard to press.

## Measurements to keep

- Orbit 520px. Ring inset 50px, dashed.
- Hub 120px. Node 92×40. Translate -200px.
- Step 45 degrees. Title 40px.
- Pressed wash #e7f2ec.
- Caption min-height 22px, margin-top 8px.

## Wrong turns

- Do not spin the ring.
- Do not use trademarks as the node names.
- Do not press more than one.
- Do not hide the caption.
- Do not draw connecting bezier lines that cross the type.
- Do not make the hub a link.

## Fit with the rest of the library

- A card grid of connections is `integrations-connect`.
- A logo marquee is `logos-mono-marquee`.
- This orbit is the radial form.
- Do not use both on one section.
- The ground is #f4f1ea.
- Nodes are pills, radius 999px, while cards elsewhere stay square to the family.

## Keyboard

- Tab moves through the eight pills.
- Enter presses a pill.
- Only one aria-pressed is true.
- The caption updates.
- The hub is not a tab stop.
- Arrow keys are not required.
- Do not use a positive tabindex.
- The ring is not focusable.
- Focus ring offset is 3px.
- Gate mail starts pressed.
- The live caption is polite.
- Reduced motion changes nothing.
- Labels stay upright.
- Display type is Fraunces.
- Text type is Public Sans.
- There are eight nodes.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
