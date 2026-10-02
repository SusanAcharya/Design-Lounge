<!-- Design Lounge Nº 162 · "Y2K chrome design language kit" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Y2K chrome design language kit

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A kit sheet for "Helix Records", a fictional late-1990s label, that teaches a Y2K chrome dialect: ice-silver surfaces, 180deg metallic bevels, a white glass cap on primary pills, and a spinning chrome disc. The first row is a music-drop fragment for the album **Aurora 7** by Pulse Circuit, with CD / MP3 / Stream tabs that rewrite the copy and price. The rest of the sheet is a type specimen (72px Michroma "Aa"), five colour chips, buttons, chips, an email field, a link, an autoplay switch, three surface plates, and four grammar cards. The detail worth copying: **hot pink is used once**. It is a 22px LIVE badge and nothing else — no pink type, no pink fill, no pink gradient.

## Reference behaviour

1. Initial state: 54px chrome header with a 28px conic-gradient disc mark, "Helix kit / Y2K chrome 01", four section anchors, "Kit v1.0 · 31 Dec 1999". Below it a 12-column sheet on a #6B7788 grid. First 800px shows the 430px hero, the specimen, and the top of the component row.
2. The chrome disc at the right of the hero rotates 360deg over 18s, linear, infinite. A hot-pink LIVE pill sits above it.
3. Hover a pill button: it lifts `translateY(-1px)` and the drop shadow grows from 2px to 3px over 140ms. Press: `translateY(1px)`, shadow 1px.
4. Click CD / MP3 / Stream tabs (`role="tablist"`). The selected tab fills electric blue with white text. `#fmt-copy` and `#price` swap: CD "Preorder $12.99" + jewel-case copy; MP3 "Download $8.99" + 128 kbps / 52 MB; Stream "Included with Helix Radio" + 56k note.
5. Click "Play preview": `aria-pressed` flips and the label becomes "Pause preview".
6. Focus the email input: border `#0078FF`, 3px `rgba(0,120,255,.25)` ring. No glow beyond that.
7. Click format chips in cell 03: `aria-pressed` toggles the blue fill.
8. Click the Autoplay switch: the 20px chrome knob slides 22px right over 220ms expo-out; the track fills electric blue.
9. Header anchors jump to sections; hover is a 2px electric-blue underline.
10. With `prefers-reduced-motion: reduce`, the disc does not spin and all transitions are 1ms.

## Structure

```
1280 × 800 first frame (sheet continues; body scrolls)
┌──────────────────────────────────────────────────────────────────────────────┐
│ (disc) Helix kit / Y2K chrome 01     TYPE COLOUR CONTROLS SURFACE   v1.0     │ 54
├───────────────────────────────────────────────┬──────────────────────────────┤
│ Helix Records   Drops Artists Cart 1          │ 01 TYPE SPECIMEN             │
│ DROP 07 · PULSE CIRCUIT          [LIVE]       │ Aa (72px Michroma)           │
│ AURORA 7 (28px)              (chrome disc 228)│ Display 28 / H2 20 / Body 14 │
│ [CD] [MP3] [Stream]                           │                              │
│ [Play preview] Preorder $12.99   cols 1–7 430h│ cols 8–12 · 430h             │
├───────────┬───────────┬───────────┬──────────────────────────────────────────┤
│02 PALETTE │03 BUTTONS │04 INPUTS  │05 SURFACE                                │
│ 5 chips   │ 2 pills   │ email     │ Raised bevel / Inset well / Bubble       │
│ pink note │ 4 chips   │ link + sw │                                          │
├───────────┴───────────┴───────────┴──────────────────────────────────────────┤
│ Bevel · Bubble · Disc · Pink once   (span 3 each)                            │
│ footer: kit summary · "Format tabs rewrite the drop copy"                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

- `<header class="top">`: `.mark` (28px disc), `.brand`, `<nav aria-label="Kit sections">`, `.ver`.
- `<main class="sheet">`: `display: grid; grid-template-columns: repeat(12, 1fr); gap: 3px; background: #6B7788`.
- `.hero` (`<section>`, cols 1–7, 430px, padding 0): `.mini` bar, `.live` badge, `.disc`, `.copy` (eyebrow, h1, p, tablist, play + price).
- `.spec` cols 8–12, 430px. `.pal` `.ctl` `.inp` `.surf` span 3. `.gram` × 4 span 3. `.foot` spans 12.

## Tokens

```css
:root {
  --ice: #d8e2ec;       /* surface, 55 % */
  --ice-2: #c4d0dc;     /* inner rules, chip fill */
  --chrome: #8a96a3;    /* bevel edge, 20 % */
  --shine: #f7fbff;     /* highlight stop */
  --ink: #1a2230;       /* text, 15 % */
  --ink-2: #3a4758;     /* secondary */
  --ink-3: #6b7788;     /* meta, grid */
  --blue: #0078ff;      /* action, 9 % */
  --blue-deep: #0054c4; /* press / selected */
  --pink: #ff2d7a;      /* LIVE badge only */
  --on: #f7fbff;
  --display: "Michroma", Verdana, sans-serif;
  --text: "Figtree", system-ui, sans-serif;
  --fs-display: 28px; --fs-aa: 72px; --fs-h2: 20px; --fs-body: 14px; --fs-label: 11px;
  --r: 10px; --pill: 22px; --ctl: 44px; --pad: 20px;
  --bevel: linear-gradient(180deg, #f7fbff 0%, #d8e2ec 42%, #8a96a3 50%, #e8eef4 100%);
  --t-micro: 140ms; --t-tab: 240ms; --t-switch: 220ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Hero headline | Michroma | 28px | 400 | .95 | +0.04em | UPPERCASE |
| Specimen glyph | Michroma | 72px | 400 | .8 | −0.04em | "Aa" |
| Brand / mini | Michroma | 10–12px | 400 | 1 | +0.08–0.1em | UPPERCASE |
| Grammar title | Michroma | 12px | 400 | 1.2 | +0.04em | UPPERCASE |
| H2 | Figtree | 20px | 700 | 1 | 0 | sentence |
| Body | Figtree | 14–15px | 400 | 1.45 | 0 | sentence |
| Button | Figtree | 14px | 600 | 1 | 0 | sentence |
| Label / eyebrow | Figtree | 10–11px | 600 | 1 | +0.14–0.16em | UPPERCASE |

Michroma has one weight. Do not request 700. It sits wide; keep headlines short (one or two words).

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---------|---------|----------|-----------|---------:|--------|
| `.disc` | load | transform rotate | 0 → 360deg | 18s linear infinite | linear |
| `.btn` | hover | translateY, box-shadow | 0 / 2px → −1px / 3px | 140ms | `--ease` |
| `.btn` | active | translateY, box-shadow | → 1px / 1px | 140ms | `--ease` |
| tab selected | click | background, color | silver → blue / white | instant fill | — |
| switch knob | toggle | translateX | 0 → 22px | 220ms | `--expo` |
| input focus | focus | border, box-shadow | chrome → blue + 3px ring | 140ms | `--ease` |

Reduced motion: `animation: none` on `.disc`; every transition 1ms.

## States

- **Button rest:** 44px tall, 22px radius, `--bevel` fill, 1px chrome border, white inset highlight, 2px chrome drop. Primary: blue 180deg gradient, white text, deep-blue drop.
- **Hover:** lift 1px. **Pressed:** drop 1px. **Disabled:** opacity .45, no lift.
- **Tab selected:** blue gradient, white text, deep-blue border. Unselected: silver bevel, ink text.
- **Chip pressed:** same as selected tab.
- **Input focus:** blue border + 3px 25% blue ring. **Switch on:** blue track, knob +22px.
- **LIVE badge:** 22px height, 11px radius, `#FF2D7A`, white 10px/700 Figtree, 2px `#C01858` drop. This is the only pink object.
- **Focus-visible:** 2px solid `--blue`, offset 3px.

## Accessibility

- Header `<nav aria-label="Kit sections">`. Hero labelled "Composition: music drop page". Format group is `role="tablist"`; each tab `role="tab"` with `aria-selected`.
- Decorative disc and mark are `aria-hidden="true"`.
- Play is a toggle button with `aria-pressed` and a live label. Switch is `<button role="switch" aria-checked>`.
- Contrast: ink on ice 11.8:1; ink-2 on ice 7.1:1; white on electric blue 4.6:1; white on hot pink 4.5:1 at 10px/700.
- Hit targets: pills 44px; tabs 32px tall but ≥ 44px wide; switch label is the hit area.

## Responsive rules

- ≥ 1280: as drawn. Sheet continues below 800px; body scrolls.
- 700–1100: hero and specimen span 12; component and grammar cells span 6; header nav hides; disc `right: 16px`.
- < 700: every cell spans 12; hero 520px; headline 22px; disc 160px, `top: 300px`.
- Applying the language: every raised control uses `--bevel`; never a flat grey. Never introduce a second pink object.

## Acceptance checklist

- [ ] Surfaces are ice silver `#D8E2EC`; body behind the grid is `#9AA8B6`; grid gap is `#6B7788`.
- [ ] Hot pink `#FF2D7A` appears on exactly one LIVE badge and nowhere else.
- [ ] Hero headline is Michroma 28px, uppercase, tracking +0.04em.
- [ ] Primary buttons are 44×pill with a white glass cap on the top 42 % (`::after`).
- [ ] Chrome bevel is a 180deg gradient through `#F7FBFF` / `#D8E2EC` / `#8A96A3` / `#E8EEF4`.
- [ ] Format tabs rewrite both the paragraph and the price; `aria-selected` tracks the active tab.
- [ ] The 228px disc is a conic-gradient with a 16% ink hub and spins 18s unless reduced motion.
- [ ] Autoplay switch slides 22px and sets `aria-checked`.
- [ ] Input focus is a 3px blue ring, not a glow blob.
- [ ] Focus-visible is 2px electric blue, 3px offset, on links, tabs, buttons, input, switch.
- [ ] Only Michroma and Figtree are loaded.
- [ ] No emoji, no placeholder copy, no second accent colour.

## Implementation notes

**Chrome bevel as a token**, reused on the header, mini bar, buttons, and the "Raised chrome bevel" plate:

```css
.btn {
  height: 44px; padding: 0 16px; border-radius: 22px;
  background: var(--bevel); border: 1px solid var(--chrome);
  box-shadow: inset 0 1px 0 #fff, 0 2px 0 var(--chrome);
}
.btn::after {
  content: ""; position: absolute; left: 12px; right: 12px; top: 4px; height: 42%;
  border-radius: inherit; background: linear-gradient(180deg, rgba(255,255,255,.7), transparent);
  pointer-events: none;
}
```

**Disc is CSS only** — conic metal, radial hub, no image:

```css
.disc {
  width: 228px; height: 228px; border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, #1a2230 0 16%, transparent 17%),
    conic-gradient(from 20deg, #c8d2dc, #fff 12%, #8a96a8, #e8eef4, #6b7788, #f7fbff 70%, #9aa8b8, #c8d2dc);
  box-shadow: inset 0 0 0 10px rgba(255,255,255,.28), 0 16px 28px rgba(26,34,48,.28);
  animation: spin 18s linear infinite;
}
```

**Tabs rewrite copy from `data-copy`.** Keep the three strings in the markup; do not fetch. Common mistakes: using pink as a hover colour; adding a purple-blue sky gradient behind the disc; requesting Michroma 700 (it will fall back and look wrong); spinning the disc faster than 18s (it becomes noisy in a gallery of twelve pieces).

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
