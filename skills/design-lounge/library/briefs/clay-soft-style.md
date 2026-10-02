<!-- Design Lounge Nº 098 · "Clay soft design language kit" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Clay soft design language kit

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A kit sheet for "Pebble Days", a fictional kids' habit app, that teaches a clay dialect: cream `#FFF1E4` puffy surfaces, a white inner lip on the top edge, a 6–8px deep colour shelf underneath, and 20–28px radii. The first row is a home fragment: "Good morning, Nico.", Today / Week tabs, two habit tiles (Water done, Stretch waiting), and two clay blobs (sky 180px, butter 110px) with the same inner-light treatment. Below: type specimen, five puffy chips, a button set (coral, sky, ghost), place chips, a pebble-name field, a stretch-done switch that paints the Stretch tile mint, three puff plates, four grammar cards. The detail worth copying: **press is physical**. Active buttons `translateY(4px)` and shrink the shelf from 6px to 2px, as if the clay compressed.

## Reference behaviour

1. Initial state: 60px cream header, 28px coral sphere mark, "Pebble / clay kit 07", four anchors, "Day 12 of 21". Sheet on `#F3D7C4` with 14px gap. First 800px shows the 420px hero + specimen.
2. Hero has two clay spheres: sky 180×180, top-right, inner white 10px lip + 10px `#5EA3D0` shelf; butter 110×110, inner 6px + 8px `#E0B84A` shelf.
3. Hover a coral button: `translateY(-2px)` over 160ms. Press: `translateY(4px)`, shelf 2px. Sky and ghost use the same press math with their own shelf colours.
4. Click Today / Week. `aria-selected` moves; selected tab is coral with a 3px `#E55A3C` shelf. `#day-copy` swaps: two pebbles left today; this week 9 of 14, best day Tuesday, streak 13.
5. Click the Stretch done switch: `aria-checked` flips; the Stretch tile's 18px dot turns mint and the caption becomes "done for today". Off restores cream-2 and "not yet".
6. Click Home / Park / Bed chips: pressed fills mint with a `#5AA05E` shelf.
7. Focus the pebble-name input: 3px sky ring around an inset well (`inset 0 4px 6px rgba(61,43,36,.08)`).
8. Header link hover: coral-deep. "Add pebble" is the primary coral puff.
9. Reduced motion: transitions 1ms. The switch still recolors the tile.

## Structure

```
1280 × 800 first frame
┌──────────────────────────────────────────────────────────────────────────────┐
│ (sphere) Pebble / clay kit 07     TYPE COLOUR CONTROLS SURFACE   Day 12 of 21 │ 60
├───────────────────────────────────────────────┬──────────────────────────────┤
│ PEBBLE DAYS · HOME          (sky puff 180)    │ 01 TYPE SPECIMEN             │
│ Good morning, Nico. (44px Bagel) (butter 110) │ Aa (88px coral)              │
│ [Today] [Week]                                │ Display 44 / H2 26 / Body 15 │
│ ┌ Water 6/6 ┐ ┌ Stretch not yet ┐             │                              │
│ └ mint dot  ┘ └ cream dot       ┘  420h       │ cols 8–12 · 420h             │
├───────────┬───────────┬───────────┬──────────────────────────────────────────┤
│02 PALETTE │03 BUTTONS │04 INPUTS  │05 SURFACE                                │
│ 5 puffy   │ 3 puffs   │ name      │ Coral / Sky / Butter plates              │
│ chips     │ 3 chips   │ link + sw │                                          │
├───────────┴───────────┴───────────┴──────────────────────────────────────────┤
│ Puff · Chunk · Press · Done                                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Cells: `border-radius: 28px`, cream fill, `box-shadow: inset 0 3px 0 rgba(255,255,255,.7), 0 8px 0 rgba(61,43,36,.08)`.
- Habit tiles: 22px radius, 360px-wide 2-col grid, 18px status dots.
- Page field is `#F3D7C4` (a darker cream), not grey and not the cell cream — the cells have to sit up.

## Tokens

```css
:root {
  --cream: #fff1e4;       /* clay surface, 50 % */
  --cream-2: #ffe4cc;     /* wells, ghost, chips */
  --coral: #ff7a59;       /* primary */
  --coral-deep: #e55a3c;  /* coral shelf */
  --sky: #8ec5e8;         /* secondary */
  --sky-deep: #5ea3d0;    /* sky shelf, focus */
  --butter: #ffd56a;      /* highlight blob */
  --mint: #7bc47f;        /* done */
  --ink: #3d2b24;
  --ink-2: #7a5c50;
  --field: #f3d7c4;
  --display: "Bagel Fat One", system-ui, sans-serif;
  --text: "Fredoka", system-ui, sans-serif;
  --fs-display: 44px; --fs-aa: 88px; --fs-h2: 26px; --fs-body: 15px; --fs-label: 12px;
  --r: 28px; --ctl: 48px; --pad: 18px;
  --t-micro: 160ms; --t-switch: 220ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

Ink `#3D2B24` is required for text but is not one of the five published swatches (those are the clay colours). Document it in tokens anyway.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Hero headline | Bagel Fat One | 44px | 400 | .95 | 0 | sentence |
| Specimen glyph | Bagel Fat One | 88px | 400 | .8 | 0 | "Aa", coral |
| Brand / habit title | Bagel Fat One | 18–26px | 400 | 1 | 0 | sentence |
| Grammar title | Bagel Fat One | 20px | 400 | 1 | 0 | sentence |
| Button / tab | Fredoka | 14–15px | 600 | 1 | 0 | sentence |
| Body | Fredoka | 15px | 400 | 1.4 | 0 | sentence |
| Label | Fredoka | 12px | 700 | 1 | +0.06em | UPPERCASE, coral-deep |

Bagel Fat One is 400 only and very heavy. Use it for names and greetings, not for paragraphs. Fredoka carries UI.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---------|---------|----------|-----------|---------:|--------|
| `.btn` | hover | transform | 0 → −2px | 160ms | `--ease` |
| `.btn` | active | transform, box-shadow | −2px / 6px shelf → +4px / 2px shelf | 160ms | `--ease` |
| switch knob | toggle | translateX | 0 → 22px | 220ms | `--expo` |
| Stretch dot | switch | background | cream-2 → mint | instant | — |
| input focus | focus | box-shadow | inset well → well + 3px sky | 160ms | `--ease` |

Reduced motion: 1ms. Press still happens (the 4px drop is the language; it just snaps).

## States

- **Button rest:** 48px, 24px radius, no border. Coral: `#FF7A59` / white, inner `inset 0 4px 0 rgba(255,255,255,.4)`, shelf `0 6px 0 #E55A3C`. Sky: sky fill, ink text, shelf `#5EA3D0`. Ghost: cream-2, shelf `#E8C8AC`.
- **Hover:** lift 2px. **Active:** drop 4px, shelf 2px. **No disabled specimen required.**
- **Tab selected:** coral, white text, 3px coral-deep shelf. Unselected: cream-2, 3px `#E8C8AC`.
- **Chip pressed:** mint, `#214226` text, `#5AA05E` shelf.
- **Input:** cream-2 fill, 20px radius, inset shadow well. Focus: + 3px sky ring.
- **Switch on:** mint track, white 24px knob +22px.
- **Habit done:** 18px mint dot. Waiting: cream-2 dot.
- **Focus-visible:** 3px solid `#5EA3D0`, offset 3px.

## Accessibility

- Header nav labelled "Kit sections". Hero labelled "Composition: kids habit app home". Day range is a `tablist`.
- Blobs `aria-hidden="true"`. Stretch state is reflected in visible text (`#ss`) as well as the dot colour.
- Switch labelled "Mark stretch done". Chips `aria-pressed`.
- Contrast: ink on cream 10.1:1; ink-2 on cream 5.2:1; white on coral 2.4:1 at small sizes — **coral buttons are 15px/600 and 48px tall**; do not set coral body text. Ink on sky 6.8:1. Ink on butter 8.4:1. `#214226` on mint 6.1:1.
- Hit targets: buttons 48px; tabs 36px; whole switch label is clickable; habit tiles are display-only (the switch is the control).

## Responsive rules

- ≥ 1280: as drawn.
- 700–1100: hero and specimen span 12, height auto; habits 100% wide; header nav hides; components and grammar span 6.
- < 700: every cell spans 12; headline 34px.
- Applying the language: keep the inner white lip. A flat coral rectangle is not clay. Do not add a dark drop-shadow blur; the shelf is a hard 0-blur offset in the same hue family.

## Acceptance checklist

- [ ] Surfaces are cream `#FFF1E4` with an inset white lip and a hard colour shelf, 20–28px radius.
- [ ] Primary buttons are 48px, coral, with `inset 0 4px 0 rgba(255,255,255,.4)` and `0 6px 0 #E55A3C`.
- [ ] Press drops the button 4px and shrinks the shelf to 2px.
- [ ] Hero headline is Bagel Fat One 44px, sentence case, line-height .95.
- [ ] Today / Week tabs rewrite `#day-copy` and set `aria-selected`.
- [ ] Stretch-done switch turns the Stretch dot mint, changes the caption, and sets `aria-checked`.
- [ ] Mint `#7BC47F` means done. Coral means still to do. No tick icons, no emoji.
- [ ] Input is an inset well; focus is a 3px sky ring, not a glow blob.
- [ ] Focus-visible is 3px `#5EA3D0`, offset 3px.
- [ ] Page field is `#F3D7C4`, darker than the cells, so the clay sits up.
- [ ] Only Bagel Fat One and Fredoka are loaded.
- [ ] No purple-blue gradient, no glass blur.

## Implementation notes

**Puff is two shadows**, inner light and a same-hue shelf. Reuse on buttons, plates, blobs, chips:

```css
.btn {
  height: 48px; padding: 0 18px; border: 0; border-radius: 24px;
  background: var(--coral); color: #fff; font: 600 15px var(--text);
  box-shadow: inset 0 4px 0 rgba(255,255,255,.4), 0 6px 0 var(--coral-deep);
}
.btn:hover { transform: translateY(-2px); }
.btn:active {
  transform: translateY(4px);
  box-shadow: inset 0 4px 0 rgba(255,255,255,.4), 0 2px 0 var(--coral-deep);
}
```

**The switch drives the habit tile.** Keep the mapping in one listener so the home scene stays honest:

```js
sw.addEventListener('click', () => {
  const on = sw.getAttribute('aria-checked') !== 'true';
  sw.setAttribute('aria-checked', String(on));
  sd.style.background = on ? 'var(--mint)' : 'var(--cream-2)';
  ss.textContent = on ? 'done for today' : 'not yet';
});
```

**Bagel Fat One will overflow** if you set a long headline. The greeting is two short lines ("Good morning, / Nico.") on purpose. Common mistakes: using a blurred `box-shadow` (clay shelves are 0 blur); drawing checkmarks; putting coral on 12px body text; cooling the cream toward white `#FFFFFF`.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
