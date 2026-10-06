<!-- Design Lounge Nº 309 · "Material rod rack CTA" · www.designlounge.live -->

# Material rod rack CTA

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from mwdtinc.com: the row of material rods standing on top of the closing "ready to talk?" card, so the stock itself introduces the call to action. This rebuild is for **Ostlund**, a fictional bar-stock supplier, and turns the static photo into a picker: the five rods are a radio group drawn in pure CSS (a shaded body and an elliptical cap), each at its own diameter. Choosing one raises it 30px out of the card's shadow, and the card below swaps to that material's grade, use, four specs and a button named for it. It should feel like a stock room with a counter in front of it. The detail worth copying is the overlap: the card sits 32px over the rods' feet, so the rods read as standing behind the counter.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ ◐ OSTLUND                Bar & rod stock · cut to length · ships …    │ 64, 1px rule
│                  ───────── PICK A MATERIAL ─────────                   │
│                   FIVE BARS WE KEEP ON THE RACK          (44px)         │
│            Tap a bar to see what it holds up to. …        (13px)       │
│        01 ZrO₂                                                          │
│        ╭────╮  02 G-10   03 PEEK    04 C110  05 Ti Gr 5               │
│        │    │  ╭───╮   ╭──────╮    ╭──╮    ╭───╮                       │ rack 330
│        │116 │  │96 │   │ 136  │    │84│    │104│                       │
│  ┌─────┴────┴──┴───┴───┴──────┴────┴──┴────┴───┴──────────────────┐    │
│  │ 01 / 05 · Y-TZP …   │ SERVICE TEMP  DENSITY │ [QUOTE A … BAR →] │    │ card 270
│  │ ZIRCONIA, CUT TO    │ 1000 °C       6.05    │ Or call the rack… │    │
│  │ YOUR LENGTH  (52px) │ HARDNESS      LEAD    │ 0800 412 377      │    │
│  │ Pump plungers, …    │ 1250 HV       5 days  │                   │    │
│  └──────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

- `header` with a link mark and a `p` strapline.
- `section.intro`: `.eyebrow` (hairlines are `::before`/`::after`), `h1`, `p.sub`.
- `div.rack[role=radiogroup][aria-label=Material]` holding five `button.rod[role=radio]`. Each rod: `.lab`, `.body`, `.cap` spans.
- `section.card[aria-live=polite]`: `#a` (kicker, `h2`, use line), `dl.stats` (four `dt`/`dd`), `.cta` (link button + phone line).
- Rack is `z-index: 1`, card `z-index: 2`, card `margin-top: -32px`.

## Motion

| Thing | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---:|---|---|
| Rod | select | translateY | 30px → 0 | 450ms | expo out | instant |
| Rod | deselect | translateY | 0 → 30px | 450ms | expo out | instant |
| Rod | hover (idle) | translateY | 30px → 20px | 450ms | expo out | instant |
| Material column | select | opacity, translateY | 1, 0 → 0, 10px → 1, 0 | 180ms / 320ms | standard / expo | instant swap |
| Specs column | select | same, +40ms out, +60ms in | — | 180ms / 320ms | standard / expo | instant swap |
| Button arrow | hover | translateX | 0 → 3px | 200ms | standard | none |

## States

- Rod idle: translateY 30px, label and number `--ink-2`.
- Rod hover: translateY 20px.
- Rod selected: translateY 0, `aria-checked="true"`, `tabindex=0`, label `--ink`, number `--signal`.
- Rod focus-visible: 2px signal outline, 6px offset, 6px radius.
- Button hover: `#FF7656`; active: translateY 1px; focus-visible: outline in `--on-card` because the fill is already signal.
- There is no empty state: one material is always selected.

## Accessibility

- The rack is `role="radiogroup"` labelled "Material"; rods are `role="radio"` buttons with `aria-checked`. Roving tabindex: only the selected rod is in the tab order.
- Keys: ←/↑ previous, →/↓ next (wrap), Home first, End last. Selection follows focus.
- Each rod's accessible name is its label text ("01 ZrO₂").
- The card is `aria-live="polite"`, so the new material name and specs are announced.
- Contrast: `#E8EEF0` on `#0F1A24` ≈ 15:1, `#93A1AB` on `#0F1A24` ≈ 6.9:1, `#4B5862` on `#E3E7E8` ≈ 6:1 (idle rod labels and sublines), button text `#1A0A05` on `#FF5A36` ≈ 7:1. `--ink-3` is only used for the eyebrow hairlines, never for text.
- Rod hit targets are ≥ 84×298px.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1100: header and card padding 32px, card margins 24px, card becomes 2 columns with the CTA as a full-width row below.
- 768–1023: same; rods keep their widths.
- < 700: header strapline hides, heading 30px, rods shrink to 52% width and 200px tall with 22px caps, 10px gap, labels drop the numbers. The card stacks to one column, 12px side margins.
- At 375 the five rods still sit in one row. Do not wrap the rack.

## Acceptance checklist

### Always

- [ ] The items to choose from are drawn objects that stand behind the CTA card; the card overlaps their feet.
- [ ] Exactly one item is selected at load and it stands visibly taller.
- [ ] Selecting an item lifts it, drops the old one, and swaps every field in the card, including the button label.
- [ ] Radio group semantics with roving tabindex, arrow keys, Home and End.
- [ ] The card is a polite live region.
- [ ] Item widths encode a real attribute (diameter), not random variety.
- [ ] One accent colour, used for the button, the selected number and focus.
- [ ] Reduced motion makes every change instant.
- [ ] No horizontal scroll at 375px; the rack stays one row.

### This demo

- [ ] Rods 01–05: ZrO₂, G-10, PEEK, C110, Ti Gr 5, widths 116/96/136/84/104px.
- [ ] Zirconia shows 1000 °C, 6.05 g/cm³, 1250 HV, 5 days; copper shows 200 °C, 8.94 g/cm³, 95 HV, 1 day.
- [ ] Card `#0F1A24`, overlap 32px, radius 16px; button `#FF5A36`.
- [ ] Heading "FIVE BARS WE KEEP ON THE RACK" in Saira Condensed 800 at 44px.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: 64px header (Ostlund mark left, mono strapline right). Centred eyebrow "PICK A MATERIAL" between two 120px hairlines, a 44px condensed heading "FIVE BARS WE KEEP ON THE RACK", and a 13px mono subline.
2. Five rods centred with 30px gaps, widths 116 / 96 / 136 / 84 / 104px (the diameters differ on purpose). Rod 01 Zirconia starts selected and stands 30px taller than the others.
3. Each rod has a 12px mono label 30px above its cap: number + short name ("01 ZrO₂", "02 G-10", "03 PEEK", "04 C110", "05 Ti Gr 5"). The selected label is ink with the number in signal orange.
4. The dark card overlaps the rod bottoms by 32px, 80px side margins, 270px tall, 16px radius. Three columns: material, specs, CTA.
5. Hover an unselected rod: it rises 10px (preview). Click it: it rises the full 30px, the previous one drops back (450ms expo out).
6. On select, the material column fades down and out (180ms), the specs column follows 40ms later; text swaps at 190ms; the material column fades back up, the specs 60ms after.
7. The button label becomes "Quote a <material> bar"; its arrow nudges 3px on hover.
8. Keyboard: Tab lands on the selected rod only. Arrow keys move the selection and focus (wrapping); Home/End jump to first/last.
9. Reduced motion: rods jump to their positions, text swaps instantly.

## Tokens

```css
:root {
  --page: #e3e7e8;      /* cool grey page */
  --page-2: #d3d9db;    /* header rule */
  --card: #0f1a24;      /* the counter */
  --card-line: rgba(226, 233, 236, 0.14);
  --ink: #0f1a24;
  --ink-2: #4b5862;     /* strapline, subline, eyebrow */
  --ink-3: #6f7b84;     /* eyebrow hairlines only */
  --on-card: #e8eef0;
  --on-card-2: #93a1ab; /* kicker, spec labels, units */
  --signal: #ff5a36;    /* button, selected number, focus */

  --cond: "Saira Condensed", "Arial Narrow", sans-serif;
  --mono: "Red Hat Mono", ui-monospace, monospace;

  --rack-h: 330px;
  --rod-h: 298px;
  --rod-gap: 30px;
  --rod-lift: 30px;
  --cap-h: 36px;
  --overlap: 32px;
  --card-h: 270px;
  --r-card: 16px;
  --r-btn: 6px;

  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Rod colour sets (`--c1` base, `--c2` highlight, `--c3` shade, `--c4` edge):

| Rod | Width | c1 | c2 | c3 | c4 |
|---|---:|---|---|---|---|
| 01 Zirconia | 116 | `#E7E1D1` | `#FBF8EF` | `#C2BAA6` | `#A59D89` |
| 02 G-10 | 96 | `#5D7246` | `#8EA472` | `#3D4C2D` | `#2D3922` |
| 03 PEEK | 136 | `#C49D66` | `#E4C799` | `#9C7745` | `#7D5E34` |
| 04 C110 copper | 84 | `#B5653A` | `#F0B48C` | `#7E3F1D` | `#5D2C12` |
| 05 Ti grade 5 | 104 | `#8B9198` | `#E1E6EB` | `#5B6168` | `#42474D` |

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Mark | Saira Condensed | 20px | 800 | 1 | 0.06em | UPPER |
| Strapline / body | Red Hat Mono | 12–14px | 400 | 1.5 | 0.04em | sentence |
| Eyebrow | Red Hat Mono | 12px | 500 | 1 | 0.20em | UPPER |
| Heading | Saira Condensed | 44px | 800 | 1 | 0.01em | UPPER |
| Rod label | Red Hat Mono | 12px | 500 | 1 | 0.06em | as written |
| Card kicker | Red Hat Mono | 12px | 500 | 1 | 0.08em | UPPER |
| Material name | Saira Condensed | 52px | 800 | 0.94 | 0.005em | UPPER |
| Use line | Red Hat Mono | 13px | 400 | 1.5 | 0 | sentence, max 36ch |
| Spec label | Red Hat Mono | 11px | 500 | 1 | 0.12em | UPPER |
| Spec value | Saira Condensed | 32px | 600 | 1 | tabular | as written |
| Spec unit | Saira Condensed | 14px | 500 | 1 | 0.04em | as written |
| Button | Saira Condensed | 18px | 600 | 1 | 0.08em | UPPER |
| Phone number | Red Hat Mono | 15px | 500 | 1.6 | 0.04em | — |

## Implementation notes

**A rod is two spans.** The body's horizontal gradient fakes the cylinder; the cap is an ellipse with a darker lower lip for the chamfer.

```css
.rod .body { position: absolute; inset: 18px 0 0; border-radius: 0 0 4px 4px;
  background: linear-gradient(90deg, var(--c3) 0%, var(--c1) 14%, var(--c2) 32%,
              var(--c1) 52%, var(--c3) 88%, var(--c4) 100%); }
.rod .cap { position: absolute; inset: 0 0 auto; height: 36px; border-radius: 50%;
  background: radial-gradient(ellipse 70% 60% at 40% 40%, var(--c2), var(--c1) 70%);
  box-shadow: inset 0 -3px 0 var(--c3),
              inset 0 0 0 3px color-mix(in srgb, var(--c2) 60%, transparent); }
.rod { transform: translateY(30px); transition: transform .45s var(--expo); }
.rod[aria-checked="true"] { transform: none; }
```

The cap comes after the body in the DOM so it paints on top. Metals (copper, titanium) get a much lighter `--c2` than plastics; that contrast is what reads as metal.

**Staggered swap.** Fade out, change text while invisible, fade in. Clear pending timers so fast arrow-key presses never show a half-swapped card:

```js
clearTimeout(t1); clearTimeout(t2);
a.classList.add('out');
t1 = setTimeout(() => b.classList.add('out'), 40);
t2 = setTimeout(() => { fill(i); a.classList.remove('out');
  setTimeout(() => b.classList.remove('out'), 60); }, 190);
```

**Units as a child.** Keep each `dd` as `value<small>unit</small>` and update `firstChild.nodeValue` and `lastChild.textContent`, so the unit styling survives.

Common mistakes: product photos of rods (the CSS version is crisp and recolourable); rods in front of the card; every rod the same width; a select dropdown instead of the objects; forgetting to rename the button; making all five rods tabbable.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
