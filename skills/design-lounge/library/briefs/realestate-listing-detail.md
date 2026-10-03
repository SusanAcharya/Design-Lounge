<!-- Design Lounge Nº 352 · "Real estate listing detail" · designlounge.vercel.app -->

# Real estate listing detail

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The detail page for one house on a fictional estate agent site, Ashlar & Vane. The house is 7 Corbel Row, Clifton, Bristol, guide price £845,000. The page reads like an architect's drawing set: stone paper, charcoal ink, 1px rules, 2px corners, and one bronze accent. The gallery is five rooms drawn in CSS, not photos. Below it, a facts row, a short description, a floor plan where each room is a button that shows its size, an amenities list, a mortgage estimate, and a map drawn in SVG. On the right, a 360px card to book a viewing stays in view while the page scrolls. The detail worth copying is the floor plan: rooms are real controls, and the size readout updates beside the plan.

## Reference behaviour

1. First frame at 1280×800: header (64px), address title and price, the five-tile gallery, the facts row, and the top of the viewing card are all visible. No action is needed to see the point.
2. The Living room is selected on the floor plan at load. It is filled bronze tint. The readout reads `Living room` and `6.0 × 4.6 m · 27.6 m²`.
3. Click or press Enter/Space on another room. That room fills with bronze tint, the old one clears, and the readout updates. Only one room is selected at a time.
4. Hovering a room that is not selected tints it `#ede6dc`.
5. The Hall is drawn but is not a control. It has a 12px grey label only.
6. Click `Show all 24 photos` (bottom-right of the gallery). A modal dialog opens with a 4-column sheet of room tiles. Close with the × button, Esc, or a click on the backdrop. Focus returns to the button.
7. The viewing card starts with Tue 6 selected and 12:30 in the time select. Picking another day chip moves the dark fill to it.
8. Submit `Request viewing`. The page does not reload. A polite live line under the button reads `Requested Tue 6 Oct at 12:30. Imogen will confirm by email.` Changing any field clears the line.
9. The mortgage estimate starts at price 845,000, deposit 20%, rate 4.35%, term 25 years. It shows £3,700 a month on a £676,000 loan.
10. Dragging the deposit slider (5–50%, step 1) updates the percent, the deposit amount, the monthly figure and the loan line on every input event. Editing price, rate or term does the same.
11. The `Save` button in the header toggles `aria-pressed`. Pressed fills the heart bronze.
12. The viewing card is `position: sticky; top: 24px` and stays in view until the end of the main column.
13. Reduced motion: all transitions drop to 1ms. Nothing else changes.

## Structure

```
1280 × 800, content max 1280, side padding 48px
┌──────────────────────────────────────────────────────────────────────┐
│ [icon] Ashlar & Vane   Buy  Rent  Sell  Journal          [♡ Save]    │ 64, 1px rule
├──────────────────────────────────────────────────────────────────────┤
│ CLIFTON, BRISTOL · FREEHOLD TOWNHOUSE                     £845,000   │
│ 7 Corbel Row, BS8 4QE   (40px serif)       Guide price · Listed 21 Sep│ 24 top, 18 bottom
├────────────────────────────┬──────────────┬──────────────────────────┤
│                            │ Kitchen      │ Main bedroom             │ 180
│  Living room (2fr, 2 rows) ├──────────────┼──────────────────────────┤
│                            │ Bathroom     │ Rear garden [Show all 24]│ 180
└────────────────────────────┴──────────────┴──────────────────────────┘ gap 6
┌─ main minmax(0,1fr) ─────────────────────┐ 56 ┌─ aside 360 sticky ───┐
│ Bedrooms │ Bathrooms │ Floor area │ Built │    │ Book a viewing       │
│ 3        │ 2         │ 128 m²     │ 1891  │    │ [Tue6][Wed7][Thu8][Sat10]
│ A stone terrace, opened to the light      │    │ Time [12:30 v]       │
│ two paragraphs, 62ch                      │    │ [ Request viewing ]  │
│ Floor plan: SVG 640×420 │ readout 200px   │    │ (IR) Imogen Reyes [☎]│
│ What's here: 2-column list, 8 rows        │    └──────────────────────┘
│ Mortgage estimate: fields │ monthly 220px │
│ Neighbourhood: SVG 600×320 │ list 220px   │
└───────────────────────────────────────────┘
```

- `header.top` holds the brand link, `nav aria-label="Primary"` with four links (Buy is `aria-current="page"`), and the Save `button`.
- `.head` is a 2-column grid: crumb + `h1` on the left, price block on the right, aligned to the bottom.
- `.gallery` is a grid `minmax(0,2fr) minmax(0,1fr) minmax(0,1fr)`, rows `180px 180px`, gap 6px. The first `figure` spans 2 rows. Each `figure` has a `figcaption`. The `Show all 24 photos` button is absolutely placed 14px from the right and bottom.
- `.cols` is a grid `minmax(0,1fr) 360px`, gap 56px, `align-items: start`.
- `main` holds a `dl.facts` (4 columns) and five `section`s, each labelled by its `h2`.
- `aside` holds a `form.card`. The day chips are a `fieldset` of four radio inputs with labels. Time is a `select`.
- The photos sheet is a native `dialog` opened with `showModal()`.

## Tokens

```css
:root {
  --stone: #ebe6de;      /* page */
  --surface: #f5f2ec;    /* cards, plan paper, dialog */
  --wall: #d9d2c6;       /* tile base, avatar */
  --line: #d2cabd;       /* 1px rules, inputs */
  --ink: #22201e;        /* charcoal text, walls, strong rules */
  --ink-2: #55504a;      /* body copy */
  --ink-3: #6e675f;      /* labels, meta */
  --bronze: #8a5a2b;     /* the one accent: button, focus, slider, pin */
  --bronze-hover: #6f4720;
  --bronze-t: #e6d6c3;   /* selected room fill */

  --serif: "Cormorant Garamond", Georgia, serif;
  --sans: "Schibsted Grotesk", system-ui, sans-serif;

  --fs-11: 11px; --fs-12: 12px; --fs-13: 13px; --fs-14: 14px; --fs-15: 15px;
  --fs-20: 20px; --fs-26: 26px; --fs-28: 28px; --fs-34: 34px; --fs-40: 40px; --fs-44: 44px;

  --s-6: 6px; --s-8: 8px; --s-12: 12px; --s-16: 16px; --s-24: 24px;
  --s-36: 36px; --s-48: 48px; --s-56: 56px;

  --r: 2px;
  --shadow: none;        /* rules separate regions, not shadows */
  --t-micro: 150ms; --t-fill: 180ms;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Brand | Cormorant Garamond | 22px | 600 | 1 | 0.02em | Title |
| Address `h1` | Cormorant Garamond | 40px | 500 | 1.05 | -0.01em | Title |
| Price | Cormorant Garamond | 34px | 600 | 1 | 0 | lining nums |
| Section `h2` | Cormorant Garamond | 28px | 500 | 1.15 | 0 | Sentence |
| Fact value | Cormorant Garamond | 28px | 600 | 1.1 | 0 | lining nums |
| Monthly figure | Cormorant Garamond | 44px | 600 | 1 | 0 | lining nums |
| Eyebrow / labels | Schibsted Grotesk | 11–12px | 400 | 1.4 | 0.06–0.12em | UPPER |
| Body | Schibsted Grotesk | 15px | 400 | 1.55 | 0 | Sentence |
| Lists, buttons | Schibsted Grotesk | 14px | 500 | 1.4 | 0 | Sentence |

Set `font-variant-numeric: lining-nums` on every serif number. Cormorant defaults to old-style figures, which make `£845,000` look uneven. Never set body text in the serif. It is too thin below 20px.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Room fill | click / key | `fill` | surface → `--bronze-t` | 180ms | `--ease` | 1ms |
| Room hover | pointer | `fill` | surface → `#ede6dc` | 180ms | `--ease` | 1ms |
| Day chip | change | `background`, `border-color` | none → `--ink` | 150ms | `--ease` | 1ms |
| Request button | hover | `background` | `--bronze` → `--bronze-hover` | 150ms | `--ease` | 1ms |
| Dialog | open | native | none | 0 | none | same |

No scroll effects, no parallax on the gallery, no count-up on the price. The page is a document. Motion only confirms a choice.

## States

- Room resting: fill `--surface`, stroke `--ink` 3px.
- Room hover: fill `#ede6dc`.
- Room selected: `aria-pressed="true"`, fill `--bronze-t`, label goes from `--ink-2` to `--ink`.
- Room focus-visible: stroke turns `--bronze` at 5px. Do not rely on the default outline on SVG `g` elements; it is drawn as a box.
- Day chip resting: 1px `--line` border, 56px tall. Hover: border `--ink-3`. Checked: fill `--ink`, number in `--surface`, weekday in `#d9d2c6`.
- Chip focus: the hidden radio gets focus; draw a 2px bronze outline on its label.
- Save pressed: heart fill and stroke `--bronze`.
- Request button hover: `--bronze-hover`. There is no disabled state; every field has a default.
- Confirmation: one line of 13px `--ink-2` text. Clear it when any field changes.
- Mortgage empty price: treat as 0 and show £0. Do not throw.
- Focus-visible everywhere else: 2px solid `--bronze`, offset 2px.

## Accessibility

- One `h1` (the address). Each section has an `h2` and `aria-labelledby`.
- Facts are a `dl` with `dt` labels and `dd` values.
- The floor plan `svg` has `role="group"` and `aria-label="Floor plan. Select a room to see its size."`. Each room `g` has `role="button"`, `tabindex="0"`, and `aria-pressed`. Enter and Space select it. Its visible label is its name.
- The readout is `aria-live="polite"` so the new size is spoken after selection.
- The map `svg` is `role="img"` with a label that names the house and the four places. The numbered list beside it carries the same information as text.
- The deposit slider is a native range with a visible label and `aria-valuetext` like `20 percent, £169,000`.
- The monthly figure is an `output` with `aria-live="polite"`.
- Day chips are real radios in a `fieldset` with a `legend` "Day". Arrow keys move between them.
- The photos dialog is a native `dialog` with `aria-labelledby` on its heading. `showModal()` traps focus and Esc closes it.
- The call button has `aria-label="Call Imogen Reyes"`. Icons are `aria-hidden`.
- Contrast: `#22201e` on `#ebe6de` is about 14:1. `#55504a` on `#ebe6de` passes 6:1. Bronze `#8a5a2b` on `#f5f2ec` passes 5:1; white text on bronze passes 5.5:1.
- Hit targets: chips 56px tall, buttons 38–46px, call button 40px.

## Responsive rules

- ≥1280: as drawn. Content max 1280, padding 48px, aside 360px, gap 56px.
- 1024 (max-width 1100px): padding 32px. Aside 320px, gap 32px. The floor plan, the mortgage block and the map stack their two parts; the monthly figure moves under the fields with a 1px top rule instead of a left rule.
- 768 (max-width 820px): one column. The viewing card moves above the facts (`order: -1`) and stops being sticky. Header links hide; brand and Save stay. Gallery becomes 2 columns: living room full width at 240px, then 2×2 at 140px.
- <640: padding 16px. Price block goes under the title, left-aligned. `h1` 32px. Facts become 2×2 with a 1px rule between rows. Amenities and mortgage fields go to one column. Gallery rows 220/110/110. Photo sheet 2 columns. Save shows only the heart.
- Never scroll sideways at 390px. Every grid track uses `minmax(0, 1fr)`; the SVGs are `width: 100%; height: auto`.

## Acceptance checklist

### Always

- [ ] Gallery shows one large tile spanning two rows and four small tiles, gap 6px, with a "show all" button over the bottom-right.
- [ ] Facts row has exactly four facts with uppercase 11px labels and 28px serif values.
- [ ] Each floor plan room is a focusable control with `aria-pressed`; exactly one is pressed.
- [ ] Selecting a room updates a live readout with name, width × depth, and area.
- [ ] Mortgage estimate recalculates on every input with the standard repayment formula.
- [ ] Viewing card is sticky at 24px on desktop and static above the content under 820px.
- [ ] Day choice uses real radio inputs in a fieldset.
- [ ] Photos open in a modal dialog that closes on Esc, × and backdrop click.
- [ ] One accent colour only. All corners 2px. No drop shadows.
- [ ] No horizontal scroll at 390px.

### This demo

- [ ] Brand is Ashlar & Vane; title is `7 Corbel Row, BS8 4QE`; price `£845,000`.
- [ ] Facts read 3, 2, 128 m², 1891.
- [ ] Living room is selected at load with `6.0 × 4.6 m · 27.6 m²`.
- [ ] Defaults 845,000 / 20% / 4.35% / 25 years give £3,700 a month on £676,000.
- [ ] Chips are Tue 6, Wed 7, Thu 8, Sat 10; time defaults to 12:30.
- [ ] Agent is Imogen Reyes; map list is Clifton Village 4 min, Christ Church Primary 7 min, Clifton Down station 11 min, Harbourside 14 min.

## Implementation notes

**1. Rooms drawn with CSS.** Each tile is a wall gradient over a floor gradient, plus `::before` and `::after` for a window and one piece of furniture. Keep it to three layers. More detail starts to look like clip art.

```css
.ph { position: relative; overflow: hidden; border-radius: 2px; }
.ph::before, .ph::after { content: ""; position: absolute; }
.living { background: linear-gradient(#cfc7ba 0 70%, #a88f73 70%); }
.living::before {               /* sash window with glazing bars */
  left: 14%; top: 14%; width: 34%; height: 50%;
  outline: 6px solid #e9e4db;
  background:
    linear-gradient(90deg, transparent 49%, #8c8378 49% 51%, transparent 51%),
    linear-gradient(transparent 48%, #8c8378 48% 50%, transparent 50%),
    linear-gradient(160deg, #f3efe7, #dcd6cb);
}
.living::after {                /* sofa + rug */
  left: 52%; bottom: 16%; width: 38%; height: 17%;
  background: #3b3632; box-shadow: -30px 14px 0 -6px #6b5a48;
}
```

Use percentages so the tile works at 180px and at 240px tall.

**2. SVG rooms as buttons.** Draw the plan at 50px per metre in a `0 0 640 420` viewBox. Store the name, size and area on the element so the readout never does maths.

```html
<g class="room" tabindex="0" role="button" aria-pressed="true"
   data-n="Living room" data-d="6.0 × 4.6 m" data-a="27.6">
  <rect x="20" y="20" width="300" height="230"/><text x="40" y="50">Living</text>
</g>
```

```js
rooms.forEach(r => {
  const pick = () => {
    rooms.forEach(o => o.setAttribute('aria-pressed', 'false'));
    r.setAttribute('aria-pressed', 'true');
    nameEl.textContent = r.dataset.n;
    dimEl.textContent = `${r.dataset.d} · ${r.dataset.a} m²`;
  };
  r.addEventListener('click', pick);
  r.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
  });
});
```

Set `pointer-events: none` on the `text` so clicks on a label still hit the room. Draw door gaps last, as 5px strokes in the paper colour over the walls.

**3. Monthly repayment.** Parse the price by stripping everything but digits, so `845,000` works. Guard a 0% rate.

```js
const price = parseFloat(priceEl.value.replace(/[^\d.]/g, '')) || 0;
const loan = price * (1 - deposit / 100);
const r = rate / 1200, n = years * 12;
const monthly = r ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
out.textContent = '£' + Math.round(monthly).toLocaleString('en-GB');
```

Common mistakes:

- Using real photos or stock images. The tiles are drawn on purpose; they keep the page one colour family.
- Rounding corners to 8px or more. This look is 2px everywhere, including chips and the dialog.
- Adding a second accent (green for "available", red for "reduced"). Bronze is the only colour.
- A sticky card with a shadow. It has a 1px charcoal border and no shadow.
- Making the floor plan a static image with a legend. Rooms must be controls.
- Letting the gallery grid use `1fr` without `minmax(0, …)`. The caption chips then push the grid wider than the screen at 390px.
- Old-style figures in the price and facts. Put `font-variant-numeric: lining-nums` after any `font` shorthand on the same element; the shorthand resets it.
- Showing a countdown or "3 people viewing now". This is a calm, high-value page.

Rebuild order:

1. Set the tokens, the header and the title row.
2. Build the gallery grid and draw the five rooms.
3. Lay out the two columns and make the card sticky.
4. Add facts and description.
5. Draw the floor plan and wire the readout.
6. Add amenities, the mortgage form, and the map.
7. Add the photos dialog.
8. Check 1024, 768 and 390.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
