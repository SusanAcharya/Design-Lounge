<!-- Design Lounge Nº 386 · "Restaurant menu page" · www.designlounge.live -->

# Restaurant menu page

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The menu page of a fictional Norwich bistro, Lanterne. It looks like a riso-printed menu card: cream paper with a fine dot grain, an oxblood band at the top, mustard used as a second ink, and a 136px condensed serif name printed slightly off-register. Type for everything else is a typewriter mono. Under the hero, a category bar sticks to the top and follows your scroll. Dishes sit in two columns with dotted leaders running to the price, the way a printed menu does. The detail worth copying is the leader: a flex spacer with a dotted bottom border, so prices line up on the right at every width without a table.

## Structure

```
1280 × 800, content max 1280, side padding 56px
┌──────────────────────────────────────────────────────────────────────┐
│ Lanterne(italic 26)  MENU  WINE LIST  PRIVATE DINING  FIND US        │ 56 oxblood
├──────────────────────────────────────────────────────────────────────┤
│ BISTRO & WINE BAR · SINCE 2014                ─────────────────────── │
│                                               ● Open until 23:00      │
│ Lanterne.   (136px serif, mustard offset)     Saturday · kitchen …    │ hero ≈ 170
│                                               112 Carrow Street …     │ oxblood +
│                                               [ RESERVE A TABLE ]     │ halftone right
├──────────────────────────────────────────────────────────────────────┤
│ 01 SMALL PLATES | 02 GRILL | 03 SIDES | 04 DESSERTS | 05 DRINKS       │ 52 sticky, 2px ink rule
├──────────────────────────────────────────────────────────────────────┤
│ 01 Small plates (52px)                      Two or three per person   │
│ ──────────────────────────────────────────────────────────────────── │
│ Gildas ··························· £4.50  │ Burrata ··············· £9.00 │
│ Anchovy, guindilla pepper… [GF]           │ Blood orange… [V][GF]         │
│ … two columns, 56px gap, dashed row rules                             │
│ 02 Grill                                                              │
│ ┌ CHEF'S PICK ───────────────────────┐   Bavette, 250g ········ £22.00│
│ │ Whole grilled plaice ····· £26.00  │                                │
│ └────────────────────────────────────┘                                │
│ … Sides, Desserts, Drinks                                             │
│ [!] Allergies and intolerances … legend V / VG / GF                   │
└──────────────────────────────────────────────────────────────────────┘
```

- `header.top` holds the wordmark link and `nav aria-label="Primary"`. Menu is `aria-current="page"`.
- `section.hero` is labelled by the `h1`. Its inner grid is `minmax(0,1fr) 340px`, gap 40px, `align-items: end`, padding 28px top and 34px bottom.
- The booking block is a `div.bk` (position relative) with the trigger `button` and the popover `div role="dialog"`.
- `nav.cats aria-label="Menu sections"` is a sibling of the hero, so it sticks across the whole page. It holds a `ul` of five anchor links.
- `main` holds five `section.menu` elements, each with `id`, `scroll-margin-top: 60px`, and an `h2`. Dishes are `li.it` in a `ul.items` grid with an `h3` name.
- The allergy note is an `aside` at the end of `main`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Popover | open | `opacity`, `transform` | 0, translateY(-6px) scale(.98) → 1, none | 220ms | `--ease` | none |
| Category jump | link click | scroll position | current → section | browser smooth | native | instant |
| Current category | scroll | `color`, `border-bottom-color` | ink-2, transparent → ink, oxblood | 150ms | `--ease` | 1ms |
| CTA hover | pointer | `transform`, `box-shadow` | 0, 3px → -1px, 4px | 150ms | `--ease` | 1ms |
| CTA press | active | `transform`, `box-shadow` | → 2px, 1px | 150ms | `--ease` | 1ms |

The press looks like a stamp pushed into paper: the button moves toward its shadow. Do not add a loop, a marquee, or a reveal on the dish rows.

## States

- Category link resting: `--ink-2`, 4px transparent bottom border. Hover: `--ink`. Current: `aria-current="true"`, `--ink`, weight 700, 4px oxblood bottom border that overlaps the bar's 2px rule (`margin-bottom: -2px`).
- CTA resting: mustard fill, ink text, 3px ink offset shadow. Hover lifts 1px. Active presses 2px.
- Popover closed: `hidden`. Open: visible, trigger `aria-expanded="true"`.
- Stepper at 1: minus `disabled`, opacity 0.35. At 8: plus `disabled`.
- Find a table hover: `--ox-2`.
- Confirmation: 13px ink line under the button. Cleared on any change.
- Chef's pick: mustard-tint card, 2px ink border, oxblood offset, stamp. Its leader turns ink, not ink-2.
- Focus-visible: 2px outline, offset 2px. Oxblood on cream areas, mustard inside the oxblood bands. Set it with a `--focus` variable per region.

## Accessibility

- One `h1` (the name). Each menu section is labelled by its `h2`. Dish names are `h3`.
- The category bar is a `nav` with a label. The current link has `aria-current="true"` (a location in the page, not a new page).
- Dietary badges are `abbr` elements with `title="Vegetarian"`, `"Vegan"`, `"Gluten free"`. The legend spells them out as plain text, so meaning is not hover-only.
- The trigger has `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` pointing to the popover.
- The popover has `role="dialog"` and `aria-labelledby` on its title. It is not modal: the page behind stays usable, so no focus trap. Esc closes it and returns focus to the trigger.
- The stepper is a `role="group"` labelled `Party size`. The buttons are `Fewer guests` and `More guests`. The count is an `output` with `aria-live="polite"`.
- The booking result line is `aria-live="polite"`.
- The open dot is decorative and `aria-hidden`; the words say Open.
- Contrast: cream on oxblood is about 10:1. Ink on cream about 14:1. `#5b4440` on cream passes 7:1. Mustard is never used for small text on cream; on oxblood the eyebrow uses the lighter `#f0d79a`.
- Hit targets: category links 52px tall, stepper buttons 44px, selects 44px, CTA 46px.

## Responsive rules

- ≥1280: as drawn. Padding 56px. Hero grid `minmax(0,1fr) 340px`. Two dish columns, 56px gap.
- 1024 (max-width 1100px): padding 40px. Name 112px. Hero right column 300px. Dish gap 36px.
- 768 (max-width 820px): top-bar links hide; the wordmark stays. Hero stacks: name, then the today block. Name 96px. One dish column. Popover aligns to the left edge of the button.
- <640: padding 18px. Name 72px with a 3px 2px shadow. Section headings 40px; their side note hides. Category bar padding 8px, links 48px tall and 12px side padding, scrolling sideways with no visible scrollbar. Dish names 21px. Popover width `min(320px, 100vw - 36px)`.
- Never scroll the page sideways at 390px. Only the category bar may scroll on the x axis.

## Acceptance checklist

### Always

- [ ] The category bar is a sibling of the hero and sticks at `top: 0` for the whole page.
- [ ] Exactly one category is current; it changes as sections pass under the bar, and the last one is current at the page end.
- [ ] Section anchors use `scroll-margin-top` so headings land under the bar, not behind it.
- [ ] Every price is right-aligned by a dotted leader that fills the remaining width.
- [ ] Dietary tags are text badges with full-word titles, plus a legend in text.
- [ ] One highlighted dish per menu, with a stamp label.
- [ ] The booking popover opens from the trigger, moves focus inside, closes on Esc (focus back to trigger) and on outside click.
- [ ] Party size is clamped with disabled ends.
- [ ] `body` uses `min-height: 100%`, not a fixed `height`, or sticky stops after one screen.
- [ ] No horizontal page scroll at 390px.

### This demo

- [ ] The name is `Lanterne.` at 136px with a 4px 3px mustard shadow.
- [ ] Hero reads `Open until 23:00`, `Saturday · kitchen 12:00–22:30`, `112 Carrow Street, Norwich NR1 2HQ`.
- [ ] Categories are numbered 01–05: Small plates, Grill, Sides, Desserts, Drinks.
- [ ] Chef's pick is Whole grilled plaice at £26.00.
- [ ] Popover starts at 2 guests, Sat 3 Oct, 19:30.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 1280×800: 56px oxblood top bar, the hero band (name, today's hours, address, `Reserve a table`), the category bar, and the first three rows of Small plates. `Small plates` is the current category.
2. The hero shows `Open until 23:00` with a 10px mustard dot, then `Saturday · kitchen 12:00–22:30`, then `112 Carrow Street, Norwich NR1 2HQ`.
3. Scroll down. When the category bar reaches the top it sticks there (`top: 0`). The current category follows the section under the bar: a section becomes current when its top passes 24px below the bar's bottom edge. At the very bottom of the page, the last category (Drinks) is current.
4. Click a category. The page scrolls to that section (smooth unless reduced motion). The section heading lands 60px from the top, just under the bar. The category becomes current.
5. On narrow screens the bar scrolls sideways. When the current category changes, the bar scrolls so the current link sits in the middle.
6. Every dish row is: name (24px serif), a dotted leader, price (16px mono bold). Under it, one line of description in 13px mono and any dietary tags.
7. Dietary tags are small bordered text badges: `V`, `VG`, `GF`. Each is an `abbr` with a full-word title. A legend in the allergy note repeats what they mean.
8. The Grill section opens with one Chef's pick: Whole grilled plaice, £26.00. It has a mustard tint, a 2px ink border, a 4px oxblood offset shadow, and an oxblood `Chef's pick` stamp tilted -2° over its top edge.
9. Click `Reserve a table`. A popover opens under the button (right-aligned on desktop, left-aligned under 820px) with a 220ms fade and 6px drop. Focus moves to the minus button.
10. In the popover: party size stepper (1–8, starts at 2; minus disables at 1, plus at 8), Date select (Sat 3 Oct first), Time select (19:30 selected), and `Find a table`.
11. Submit. No reload. A polite live line reads `Held: 3 at 19:30, Sat 3 Oct. We will text to confirm.` Any change clears it.
12. Esc closes the popover and returns focus to the button. A click outside closes it without moving focus. Clicking the button again closes it.
13. Reduced motion: no smooth scroll, no popover animation, transitions 1ms.

## Tokens

```css
:root {
  --cream: #f2e6cf;      /* page paper */
  --paper: #f8efdc;      /* category bar, popover, note */
  --ox: #6b1e23;         /* oxblood: bands, headings, tags, focus on cream */
  --ox-2: #86292f;       /* oxblood hover */
  --ink: #2a1a17;        /* text, rules, offset shadows */
  --ink-2: #5b4440;      /* descriptions, labels */
  --mustard: #d79b22;    /* second ink: misregister, CTA, dot, halftone, focus on oxblood */
  --mustard-t: #f0d79a;  /* Chef's pick fill, eyebrow on oxblood */
  --rule: #d8c6a6;       /* section and row rules */

  --display: "Instrument Serif", Georgia, serif;
  --mono: "Courier Prime", "Courier New", monospace;

  --fs-10: 10px; --fs-11: 11px; --fs-12: 12px; --fs-13: 13px; --fs-15: 15px; --fs-16: 16px;
  --fs-22: 22px; --fs-24: 24px; --fs-30: 30px; --fs-52: 52px; --fs-136: 136px;

  --s-4: 4px; --s-8: 8px; --s-16: 16px; --s-24: 24px; --s-40: 40px; --s-56: 56px;

  --r: 3px;
  --offset-sm: 3px 3px 0 var(--ink);   /* CTA */
  --offset-md: 4px 4px 0 var(--ox);    /* Chef's pick */
  --offset-lg: 6px 6px 0 var(--ox);    /* popover */
  --t-micro: 150ms; --t-pop: 220ms;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
}
```

Grain: `background: var(--cream) radial-gradient(rgba(107,30,35,.07) .7px, transparent .8px) 0 0 / 4px 4px` on `body`.

Halftone: a `::before` on the hero, right-aligned, 520px wide, full height, with `radial-gradient(var(--mustard) 1.6px, transparent 1.9px) 0 0 / 9px 9px`, masked by a radial fade, opacity 0.55.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Name `h1` | Instrument Serif | 136px | 400 | 0.86 | -0.02em | Title, mustard shadow 4px 3px |
| Open line | Instrument Serif | 30px | 400 | 1 | 0 | Sentence |
| Section `h2` | Instrument Serif | 52px | 400 | 1 | 0 | Sentence, `--ox` |
| Dish `h3` | Instrument Serif | 24px | 400 | 1.15 | 0 | Sentence |
| Popover title | Instrument Serif | 30px | 400 | 1 | 0 | Sentence |
| Body | Courier Prime | 15px | 400 | 1.55 | 0 | Sentence |
| Description | Courier Prime | 13px | 400 | 1.55 | 0 | Sentence, max 44ch |
| Price | Courier Prime | 16px | 700 | 1 | 0 | `£0.00` |
| Category link | Courier Prime | 13px | 400, current 700 | 1 | 0.1em | UPPER |
| Eyebrow, labels | Courier Prime | 11–12px | 400 | 1.4 | 0.14–0.18em | UPPER |
| Tag badge | Courier Prime | 10px | 700 | 16px | 0.06em | UPPER |

Always print prices with two decimals so the leaders end at the same visual width. The serif is display only; never set a description in it.

## Implementation notes

**1. Dotted leaders.** Use flex with a growing spacer. Nudge the spacer up so the dots sit near the baseline of the name, not under the descenders.

```css
.row { display: flex; align-items: baseline; gap: 8px; }
.row h3 { margin: 0; font: 400 24px/1.15 var(--display); }
.lead {
  flex: 1; min-width: 16px;
  border-bottom: 2px dotted var(--ink-2);
  transform: translateY(-5px);
}
.pr { font: 700 16px var(--mono); }
```

Do not fill the gap with a string of `.` characters. It breaks at every width and is read aloud.

**2. Scrollspy.** Measure on scroll inside `requestAnimationFrame`. Compare each section's top to the bar's bottom edge. Only touch the DOM when the current index changes.

```js
function spy() {
  const y = bar.getBoundingClientRect().bottom + 24;
  let cur = 0;
  sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= y) cur = i; });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) cur = sections.length - 1;
  if (links[cur].getAttribute('aria-current') === 'true') return;
  links.forEach((a, i) => a.setAttribute('aria-current', i === cur ? 'true' : 'false'));
  const ul = bar.querySelector('ul'), a = links[cur];
  ul.scrollLeft = a.offsetLeft - (ul.clientWidth - a.offsetWidth) / 2;
}
let tick = false;
addEventListener('scroll', () => {
  if (!tick) { tick = true; requestAnimationFrame(() => { spy(); tick = false; }); }
}, { passive: true });
```

The bottom-of-page rule matters: a short last section can never reach the bar, so without it Drinks is never current.

**3. Off-register name and halftone.** The riso feel is two inks slightly out of line. One text shadow does it. Keep the halftone in a `::before` that stays inside the hero box, so the hero does not need `overflow: hidden` (which would clip the popover).

```css
h1 { font: 400 136px/.86 var(--display); color: var(--cream);
     text-shadow: 4px 3px 0 var(--mustard); }
.hero { position: relative; background: var(--ox); }
.hero::before {
  content: ""; position: absolute; right: 0; top: 0;
  width: min(520px, 100%); height: 100%; pointer-events: none; opacity: .55;
  background: radial-gradient(var(--mustard) 1.6px, transparent 1.9px) 0 0 / 9px 9px;
  mask: radial-gradient(closest-side, #000, transparent);
}
```

Common mistakes:

- `overflow: hidden` on the hero. The popover is clipped at the hero's bottom edge.
- `html, body { height: 100% }` left as is. The sticky bar scrolls away after 800px.
- Putting the category bar inside the hero or inside `main`'s first section. Sticky only works inside its parent.
- Emoji or leaf icons for vegan. Use text badges.
- A drop shadow with blur. Every shadow here is a hard offset, like a misprinted second ink.
- Mustard text on cream. It fails contrast. Mustard is a fill and a shadow only.
- A modal for booking. This is a small non-modal popover.
- Prices without decimals next to prices with decimals.

Rebuild order:

1. Set tokens, grain, and the top bar.
2. Build the hero with the halftone and the off-register name.
3. Add the sticky category bar after the hero.
4. Build one section with the leader rows, then copy for all five.
5. Add the Chef's pick card and the allergy note.
6. Wire scrollspy.
7. Build the popover and its keyboard rules.
8. Check 1024, 768 and 390.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
