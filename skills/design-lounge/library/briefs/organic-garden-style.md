<!-- Design Lounge Nº 133 · "Organic garden design language kit" · www.designlounge.live -->

# Organic garden design language kit

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A kit sheet for "Morrow Seed Co.", a fictional open-pollinated seed house in the Tule valley. It teaches a botanical dialect: warm soil paper `#F3EDE1` on a moss `#3D5C45` field, 8px gaps, 18px cell rounding, and imagery made of irregular four-value `border-radius` blobs — never circles, never rectangles. The first row is a seed-shop fragment: a 48px Young Serif headline, Spring / Autumn tabs, three overlapping blobs, and a 280px packet card (Bronze fennel, $4.50). Below: type specimen, five chips (themselves blob-shaped), a soft button set (moss, ghost, clay), chips, a postcode field, a sowing-calendar link, an "Organic only" switch, three blob plates, four grammar cards. The detail worth copying: **clay terracotta is one mark per view** — the mid hero blob in spring, or the autumn morph, or the gift button in the kit. Never all three competing. The product-scene eyebrow is moss.

## Structure

```
1280 × 800 first frame
┌──────────────────────────────────────────────────────────────────────────────┐
│ (blob) Morrow / garden language 02   TYPE COLOUR CONTROLS SURFACE   Lot 14   │ 56
├───────────────────────────────────────────────┬──────────────────────────────┤
│ MORROW SEED CO. · LOT 14     (leaf blob 280)  │ 01 TYPE SPECIMEN             │
│ Sow the quiet bed. (48px Young Serif)         │ Aa (96px)                    │
│ [Spring] [Autumn]            (clay + moss)    │ Display 48 / H2 28 / Body 15 │
│ ┌ Bronze fennel  $4.50 [Add packet] ┐         │                              │
│ └ card 280, bottom-left, 22px radius ┘ 424h   │ cols 8–12 · 424h             │
├───────────┬───────────┬───────────┬──────────────────────────────────────────┤
│02 PALETTE │03 BUTTONS │04 INPUTS  │05 SURFACE                                │
│ 5 chips   │ 3 pills   │ postcode  │ Leaf / Clay / Moss blob plates           │
│           │ 3 chips   │ link + sw │                                          │
├───────────┴───────────┴───────────┴──────────────────────────────────────────┤
│ Blob · Soil · Pill · Clay                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Cells: `border-radius: 18px` on a moss field. Hero padding 0, still 18px outer round (overflow hidden).
- Card is `position: absolute; left: 28px; bottom: 24px; width: 280px; border-radius: 22px; box-shadow: 0 10px 24px rgba(61,92,69,.18)`.
- Palette chips use a different blob radius (`40% 60% 50% 50% / 50% 40% 60% 50%`) so they do not look like the hero blobs copied.
- Copy column is `left: 28px; top: 28px; width: 340px; z-index: 2`. The card must clear the tabs; keep at least 16px between the tab row and the card top.
- Header mark is a 22px leaf blob, same `--r-blob` as the large hero shape, so the language starts in the chrome.
- In the spring scene the only terracotta is the mid clay blob. The eyebrow is moss. The gift button in cell 03 is the kit's sample of a clay control, not a second mark in the product scene.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---------|---------|----------|-----------|---------:|--------|
| `.btn` | hover | background, translateY | moss → leaf, 0 → −1px | 160ms | `--ease` |
| `.blob` | season tab | background, transform, border-radius | spring set → autumn set | 700ms | `--expo` |
| switch knob | toggle | translateX | 0 → 20px | 220ms | `--expo` |
| input focus | focus | border, box-shadow | soil-2 → leaf + 3px ring | 160ms | `--ease` |

Autumn blob set: `.b1` background clay, `translate(-30px, 20px)`, radius `48% 52% 36% 64% / 58% 42% 58% 42%`. `.b2` background moss, `translate(20px, -40px)`. `.b3` unchanged.

Reduced motion: transitions 1ms. Season still swaps copy and blob colours.

## States

- **Button rest:** 44px, 22px radius, no border. Primary moss / soil text. Ghost `--soil-2` / ink. Clay `#C4785B` / `#FFF8F2` (the one terracotta control in the button row).
- **Hover:** leaf (primary) or `#DDD0B8` (ghost), lift 1px. **Disabled:** `--soil-2` / `--ink-3`.
- **Tab selected:** moss fill, soil text, 34px tall, 17px radius. Unselected: `--soil-2`.
- **Chip pressed:** leaf / soil. Unpressed: `--soil-2` / ink.
- **Input:** `#FAF6EE` fill, 16px radius, 1px `--soil-2`. Focus: leaf border + 3px 25% leaf ring.
- **Switch on:** leaf track, white 22px knob +20px.
- **Focus-visible:** 2px solid clay, offset 3px (clay is the focus colour so it stays off the moss buttons).

## Accessibility

- Header nav labelled "Kit sections". Hero labelled "Composition: seed shop card". Season group is a `tablist`.
- Blobs are `aria-hidden="true"`. Card is an `<article>` with a live `<h3>` that updates.
- Switch `role="switch"` labelled "Organic only". Chips `aria-pressed`.
- Contrast: ink on soil 10.4:1; ink-2 on soil 5.8:1; soil on moss 8.7:1; soil on leaf 4.6:1 (chips at 12px/600). Clay on soil 4.5:1 at 14px/600 (gift button label is 14px on a clay fill, not clay text).
- Hit targets: buttons 44px; tabs 34× ≥ 64px; whole switch label is clickable.

## Responsive rules

- ≥ 1280: as drawn.
- 700–1100: hero and specimen span 12; components and grammar span 6; header nav hides.
- < 700: every cell spans 12; hero 540px; headline 36px; large blob `top: 280px` so it sits under the copy.
- Applying the language: keep blobs irregular (four different percentages). A true circle is a mistake. Do not cool the paper toward grey.

## Acceptance checklist

- [ ] Field is moss `#3D5C45`; cells are soil `#F3EDE1` with 18px radius and 8px gap.
- [ ] Imagery uses irregular `border-radius` blobs, not circles or rectangles.
- [ ] Hero headline is Young Serif 48px, line-height .95, sentence case.
- [ ] Buttons are 44px pills, 22px radius, no border; primary fill is moss.
- [ ] Clay `#C4785B` is an accent: spring's mid blob, the gift button, or the autumn morph — not a fourth fill on every control.
- [ ] Spring / Autumn tabs morph blobs over 700ms expo-out and rewrite the packet name, copy, and price.
- [ ] Packet card is 280px, 22px radius, 18 % moss shadow, bottom-left of the hero.
- [ ] Organic-only switch slides 20px and sets `aria-checked`.
- [ ] Focus-visible is 2px clay, 3px offset.
- [ ] Palette chips are blob-shaped, not squares.
- [ ] Only Young Serif and Hanken Grotesk are loaded.
- [ ] No emoji, no placeholder copy, no cool grey paper. Young Serif stays at weight 400.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: 56px soil header, 22px leaf blob mark, "Morrow / garden language 02", four anchors, "Autumn 2026 · Lot 14". Sheet on moss with 8px padding and 8px gap. First 800px shows the 424px hero + specimen.
2. Three blobs sit on the right of the hero: leaf 280×260, clay 160×150, moss 90×90, all using `--r-blob` (`64% 36% 48% 52% / 42% 58% 42% 58%`).
3. Hover a moss button: fill becomes leaf `#6B8F71`, lift `translateY(-1px)` over 160ms. Press: `translateY(1px)`. Ghost hover: `#DDD0B8`.
4. Click Spring / Autumn tabs. `aria-selected` moves. `hero.dataset.season` becomes `spring` or `autumn`. Autumn: the large blob turns clay and translates `(-30px, 20px)` with a new radius over 700ms expo-out; the clay blob turns moss and translates `(20px, -40px)`. The card becomes "Winter rye", "Cover crop, 80 g. Sow before the first hard frost.", "$3.80". Spring restores Bronze fennel / $4.50.
5. Click Herb / Flower / Root chips: `aria-pressed` toggles leaf fill and soil text.
6. Focus the postcode input: leaf border + 3px `rgba(107,143,113,.25)` ring.
7. Click Organic only: knob slides 20px over 220ms; track fills leaf.
8. Header link hover: moss. Card "Add packet" is a 36px-tall moss pill.
9. Reduced motion: blob morph is 1ms; still swaps season content.

## Tokens

```css
:root {
  --soil: #f3ede1;     /* paper, 55 % */
  --soil-2: #e8dcc8;   /* inner rules, ghost fill */
  --leaf: #6b8f71;     /* blobs, chips, switch on */
  --moss: #3d5c45;     /* primary button, field, 15 % */
  --clay: #c4785b;     /* one accent per view */
  --seed: #5c4033;
  --ink: #3a2a22;      /* text */
  --ink-2: #6a574c;
  --ink-3: #8e7a6c;
  --display: "Young Serif", Georgia, serif;
  --text: "Hanken Grotesk", system-ui, sans-serif;
  --fs-display: 48px; --fs-aa: 96px; --fs-h2: 28px; --fs-card: 22px; --fs-body: 15px; --fs-label: 11px;
  --pad: 20px; --ctl: 44px; --cell-r: 18px; --pill: 22px;
  --r-blob: 64% 36% 48% 52% / 42% 58% 42% 58%;
  --t-micro: 160ms; --t-blob: 700ms; --t-switch: 220ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Hero headline | Young Serif | 48px | 400 | .95 | 0 | sentence |
| Specimen glyph | Young Serif | 96px | 400 | .8 | 0 | "Aa" |
| Brand / card title | Young Serif | 22px | 400 | 1–1.1 | 0 | sentence |
| Grammar title | Young Serif | 20px | 400 | 1 | 0 | sentence |
| H3 / UI strong | Hanken Grotesk | 15–18px | 600–700 | 1.2 | 0 | sentence |
| Body | Hanken Grotesk | 15px | 400 | 1.5 | 0 | sentence |
| Button | Hanken Grotesk | 14px | 600 | 1 | 0 | sentence |
| Label / eyebrow | Hanken Grotesk | 11px | 600 | 1 | +0.14em | UPPERCASE, moss |

Young Serif is 400 only. Do not bold it; use size for hierarchy.

## Implementation notes

**Blob radius as a token.** Share it on the mark, the hero shapes, and the grammar glyph; vary it on chips so they do not clone the hero:

```css
:root { --r-blob: 64% 36% 48% 52% / 42% 58% 42% 58%; }
.blob { border-radius: var(--r-blob); transition: border-radius 700ms var(--expo), transform 700ms var(--expo); }
.hero[data-season="autumn"] .b1 {
  background: var(--clay);
  transform: translate(-30px, 20px);
  border-radius: 48% 52% 36% 64% / 58% 42% 58% 42%;
}
```

**Pills have no border.** Contrast comes from moss-on-soil, not from a line:

```css
.btn {
  height: 44px; padding: 0 18px; border: 0; border-radius: 22px;
  background: var(--moss); color: var(--soil); font: 600 14px var(--text);
}
.btn:hover { background: var(--leaf); transform: translateY(-1px); }
```

**Season state lives on the hero**, not on each blob. Tabs set `data-season` and look up a tiny pack map for the card. Common mistakes: using a perfect circle for "organic"; putting terracotta on every button; cooling `#F3EDE1` toward `#F5F5F5`; animating blobs faster than 700ms (they should feel like plants, not UI).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
