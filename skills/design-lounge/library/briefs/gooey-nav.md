<!-- Design Lounge Nº 258 · "Gooey nav" · www.designlounge.live -->

# Gooey nav

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A row of four links: Yard, Holds, Night book, Month close. Yard starts current. A green pill matches the current link and slides when another is chosen. The pill is filtered so its edge softens. The words sit outside the filter. This is not a round action menu. That menu is `gooey-menu`. This is not a segmented control for a view. That control is `segmented-control-sliding`. These are navigation links.

## Structure

```
pill row
Yard  Holds  Night book  Month close
```

- Nav is a flex row, gap 8px, padding 8px.
- Links are 44px tall.
- The blob is absolute, height 44px, radius 999px, fill #1f4d3a.
- Filter stdDeviation is 6.
- Current link is aria-current page.

## Motion

- Pill | click | old x and width | new x and width | 320ms cubic-bezier(0.16,1,0.3,1). Reduced motion jumps.

## States

- Current: aria-current page, light text, pill underneath.
- Other links: dark text, no pill.
- Hover does not move the pill. Click does.
- Focus ring offset 4px.

## Accessibility

- The nav is labelled Yard.
- The current link has aria-current page.
- Links are real anchors whose default is prevented in the demo.
- Text is outside the SVG filter so it stays sharp.
- Reduced motion still moves the current item.
- Focus ring is 2px #1f4d3a, offset 4px.

## Responsive rules

- The row is content-sized and centered at 1280.
- Below 520 the links may wrap. The pill math uses getBoundingClientRect so it still tracks.
- Do not collapse this into a hamburger in the demo.

## Acceptance checklist

### Always

- [ ] One current link.
- [ ] The pill matches that link’s box.
- [ ] Words are not inside the filter.
- [ ] Click changes the current link.
- [ ] No route change in the demo.

### This demo

- [ ] Labels are Yard, Holds, Night book, Month close.
- [ ] Yard starts current.
- [ ] Fill is #1f4d3a.
- [ ] Ground is #f6f4ef.
- [ ] Type is IBM Plex Sans.

## Measurements to keep

- Link height 44px. Gap 8px. Padding 8px.
- Slide 320ms. Blur stdDeviation 6.
- Current text #fffdf8. Rest text #161513.
- Radius 999px.
- Focus offset 4px.

## Wrong turns

- Do not put the filter on the words.
- Do not use light text on the resting links.
- Do not navigate away.
- Do not animate a wobble loop.
- Do not add a logo in this piece.
- Do not make every link current.

## Fit with the rest of the library

- A round goo menu is `gooey-menu`.
- A segmented control is `segmented-control-sliding`.
- A shrinking pill bar is `navbar-floating-pill-shrink`.
- This is the melting current pill.
- One nav.
- Type is IBM Plex Sans.

## Keyboard

- Enter activates the focused link.
- aria-current moves.
- Tab order is the four links.
- The blob is not a tab stop.
- Do not use a positive tabindex.
- Reduced motion jumps.
- Focus offset is 4px.
- There are four links.
- Yard starts current.
- Escape does nothing.
- No dropdown.
- Text stays outside the filter.
- Type is IBM Plex Sans.
- The nav name is Yard.
- Click preventDefault.
- The pill width follows the label.

## Rebuild order

1. Build step: Yard is current. The pill sits under it.
2. Build step: Clicking a link prevents navigation and moves aria-current.
3. Build step: The pill width and x match the link.
4. Build step: The slide is 320ms.
5. Build step: Current text is #fffdf8. Other text is #161513.
6. Build step: Reduced motion removes the filter and the transition. The pill still jumps.
7. Build step: The links do not leave the page.

- Keep this measurement while rebuilding: Link height 44px. Gap 8px. Padding 8px.
- Keep this measurement while rebuilding: Slide 320ms. Blur stdDeviation 6.
- Keep this measurement while rebuilding: Current text #fffdf8. Rest text #161513.
- Keep this measurement while rebuilding: Radius 999px.
- Keep this measurement while rebuilding: Focus offset 4px.

- While rebuilding, remember: Do not put the filter on the words.
- While rebuilding, remember: Do not use light text on the resting links.
- While rebuilding, remember: Do not navigate away.
- While rebuilding, remember: Do not animate a wobble loop.
- While rebuilding, remember: Do not add a logo in this piece.
- While rebuilding, remember: Do not make every link current.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Yard is current. The pill sits under it.
2. Clicking a link prevents navigation and moves aria-current.
3. The pill width and x match the link.
4. The slide is 320ms.
5. Current text is #fffdf8. Other text is #161513.
6. Reduced motion removes the filter and the transition. The pill still jumps.
7. The links do not leave the page.

## Tokens

```css
:root { --bg:#f6f4ef; --primary:#1f4d3a; --ink:#161513; --on:#fffdf8; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Link | IBM Plex Sans | 14px | 500 |

## Implementation notes

Measure the link against the nav, not the page.

```js
blob.style.setProperty("--x", (r.left - nav.left - 8) + "px");
```

Keep the filter on the blob only.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
