<!-- Design Lounge Nº 209 · "Curve drawer" · www.designlounge.live -->

# Curve drawer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A page titled Night desk and a right-hand panel, Gate 4 hold. The panel starts open, edge straight. Close sends it off to the right while the left corners radius goes to 120px, so the edge bows as it leaves. Open brings it back and the radius returns to 0. This is not a navigation drawer. That drawer is `m3-navigation-drawer`. This is not a record column. That column is `record-detail-header`. The bow is the piece.

## Structure

```
Night desk
[ Close the hold ]          | Gate 4 hold
                            | twelve loads
                            | Close
```

- The panel is fixed, top 0, right 0, width 340px, height 100%, padding 32px 28px.
- Fill is #fffdf8. Border-left is 1px #e3ddd2.
- The page title is 36px.
- The page button is 44px, fill #1f4d3a.
- The inside Close is 40px, outline.

## Motion

- Panel | open or close | translateX 110% and radius 120px | flat and radius 0 | 420ms cubic-bezier(0.16,1,0.3,1). Reduced motion snaps.

## States

- Open: radius 0, on screen, button Close the hold.
- Closed: bowed, off screen, button Open the hold.
- Moving: both properties transition together.
- The copy inside does not change.

## Accessibility

- The page button exposes aria-expanded.
- The panel is an aside named Hold.
- Close is a button inside the panel.
- Focus ring is 2px #1f4d3a, offset 3px.
- Reduced motion still opens and closes.
- Do not trap focus in this demo. A product dialog would. This panel is a side sheet that leaves the page usable.

## Responsive rules

- The panel is 340px at 1280.
- Below 480 the panel is 100% wide. The radius still bows on the left while it is closed.
- The page padding stays 48px until 400, then 24px.

## Acceptance checklist

### Always

- [ ] Starts open and flat.
- [ ] Closed pose is bowed and off-screen.
- [ ] Open pose is flat.
- [ ] The button name matches.
- [ ] 420ms or none.

### This demo

- [ ] The page title is Night desk.
- [ ] The panel title is Gate 4 hold.
- [ ] The sentence names twelve loads and six hours.
- [ ] The bow is 120px.
- [ ] Type is IBM Plex Sans.

## Measurements to keep

- Panel width 340px. Padding 32px 28px.
- Closed radius 120px on the left. Travel translateX 110%.
- Duration 420ms.
- Page title 36px. Panel title 24px.
- Page button height 44px. Close height 40px.

## Wrong turns

- Do not start closed.
- Do not bow the open edge.
- Do not use a scrim that blocks the page.
- Do not slide from the left in this piece.
- Do not fade without the radius.
- Do not put navigation links in the panel.

## Fit with the rest of the library

- A nav drawer is `m3-navigation-drawer`.
- A record column is `record-detail-header`.
- This is the bowed edge.
- One panel.
- Type is IBM Plex Sans.
- The ground is paper.

## Keyboard

- Enter on the page button toggles.
- Enter on Close closes.
- aria-expanded matches the panel.
- Do not use a positive tabindex.
- Focus offset is 3px.
- Reduced motion snaps.
- The aside is not a dialog.
- Escape does not close in this demo. Close does.
- Starts open.
- The bow is 120px.
- Type is IBM Plex Sans.
- Two buttons.
- The page stays readable beside an open panel at 1280.
- No scrim.
- Do not trap focus.
- The inside copy stays.

## Pass

- Measure the first frame before changing a number.
- Keep the names in this brief.
- Keep the duration written above.
- Honour reduced motion.
- Do not add a second accent.
- Do not add a second type family.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The panel starts open. The page button reads Close the hold. aria-expanded is true.
2. The open panel has border-radius 0 and transform none.
3. The closed panel is translateX 110% and border-radius 120px 0 0 120px.
4. The page button toggles.
5. Close inside the panel sets it closed.
6. The move is 420ms for both transform and radius.
7. Reduced motion snaps. The open and closed poses stay.

## Tokens

```css
:root { --bg:#f4f1ea; --panel:#fffdf8; --ink:#1a1814; --ink-2:#5c564c; --line:#e3ddd2; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Page title | IBM Plex Sans | 36px | 600 |
| Panel title | IBM Plex Sans | 24px | 600 |
| Body | IBM Plex Sans | 16px | 400 |

## Implementation notes

Animate radius with the transform so the bow is the travel, not a second effect.

```css
.panel { border-radius: 120px 0 0 120px; transform: translateX(110%); }
.panel[data-open="true"] { border-radius: 0; transform: none; }
```

Start with data-open true.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
