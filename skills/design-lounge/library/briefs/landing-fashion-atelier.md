<!-- Design Lounge Nº 112 · "Fashion atelier landing page" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Fashion atelier landing page

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The public landing for a fictional Paris atelier, Atelier Lumen. The first viewport is the argument: a 92px Didone headline, a 460×520 "garment" still built from layered gradients (no photographs), and a single charcoal CTA. Below the hero, a four-look strip swaps the still. Further down, a two-column atelier note and the same CTA again. Colour is bone paper, charcoal type, one wine. The garment is the product shot — a highlight ridge and a vertical seam should read as draped cloth, not a generic blob.

## Reference behaviour

1. Initial state: Look 01 "Column" is pressed. The hero plate shows `.g0` (wine-to-bone silk column) at opacity 1. Caption: `Look 01 · Column` / `Silk faille`. Headline reads "Cloth that *holds* a room." with *holds* in wine italic.
2. Click Look 02, 03 or 04: that button gets `aria-pressed="true"` and lifts 4px; the matching `.fold` fades in over 480ms; others fade out. Caption and `aria-label` on the figure update. Only one look is pressed.
3. Hover a look: it lifts 4px even if not pressed. Pressed look also has a 1px charcoal border.
4. Hover the CTA: background changes from `--char` to `--wine` over 180ms. Active: scale 0.98.
5. Nav "Lookbook" is current (1px wine underline). Links scroll to `#looks` and `#atelier`.
6. The page scrolls. First 800px must include: nav, full hero (type + plate), and the look-strip heading plus the four tiles (tiles may clip slightly at 800; they must be recognizable).
7. Reduced motion: transitions 1ms; no lift; `scroll-behavior: auto`.

## Structure

```
1280 × 800  (first frame; page continues)
┌────────────────────────────────────────────────────────────────────────┐
│ ATELIER LUMEN                         LOOKBOOK  ATELIER  VISIT         │ 60
├────────────────────────────────────────────────────────────────────────┤
│ AUTUMN 26 · EIGHTEEN LOOKS                                             │
│ Cloth that                                                             │
│ holds a room.          (92px Bodoni)     ┌───────────────────────────┐ │
│                                          │  garment still 460 × 520  │ │
│ Cut in the 4th arrondissement…           │  seam at 42%              │ │
│ [ REQUEST A SITTING → ]                  │  Look 01 · Column         │ │
│                                          └───────────────────────────┘ │
│ THE STRIP                                              01 — 04 OF 18   │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐                                            │
│ │ 01 │ │ 02 │ │ 03 │ │ 04 │   each 168 tall, 12px gap                  │
└─┴────┴─┴────┴─┴────┴─┴────┴────────────────────────────────────────────┘
Below the fold:
  The room is the fitting. (56px italic)  |  2 paragraphs + hours + CTA
```

- `<nav aria-label="Primary">` — 60px. Logo 18px Bodoni, 0.22em tracking. Three Tenor Sans links, 12px, 0.16em tracking, 32px gap.
- `<section class="hero">` — 2-col, 1fr + 460px, 48px gap, 48px top pad, `align-items: end`.
- `<figure class="garment">` — 520px tall, fill `#CFC3B0`. Inner `.drape` clipped to a column-dress polygon (`30% 7%` … `12% 100%`). Four stacked `.fold` layers, a 54×28 neck cutout, a centre seam, and a caption.
- `<section class="looks" id="looks">` — h2 11px uppercase + 4-col `.strip`.
- `<section class="atelier" id="atelier">` — 2-col, 64px gap, 64px top pad, 1px `--line` above.

## Tokens

```css
:root {
  --bone: #efe7da;        /* page */
  --bone-2: #e4d9c8;      /* deeper bone in folds */
  --char: #2a2420;        /* type, CTA, pressed border */
  --char-2: #4a433c;      /* lede, inactive nav */
  --line: #d4c9b6;        /* hairlines */
  --wine: #7a2436;        /* italic word, kicker, CTA hover */
  --wine-2: #5c1a28;      /* reserved deeper wine */

  --serif: "Bodoni Moda", Didot, serif;
  --sans: "Tenor Sans", Georgia, sans-serif;

  --pad: 56px;
  --nav: 60px;
  --plate-w: 460px;
  --plate-h: 520px;
  --look-h: 168px;
  --cta-h: 52px;

  --t: 180ms;
  --t-swap: 480ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Logo | Bodoni Moda | 18px | 500 | 1 | +0.22em | UPPERCASE |
| Headline | Bodoni Moda | 92px | 400 | 0.90 | −0.03em | sentence |
| Headline italic | Bodoni Moda italic | 92px | 400 | 0.90 | −0.03em | sentence |
| Atelier title | Bodoni Moda italic | 56px | 400 | 0.95 | −0.02em | sentence |
| Nav / CTA / kicker | Tenor Sans | 11–12px | 400 | 1 | +0.14–0.20em | UPPERCASE |
| Lede / body | Tenor Sans | 15–16px | 400 | 1.5 | 0 | sentence |
| Look labels | Tenor Sans | 11px | 400 | 1 | +0.12em | UPPERCASE |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---------|---------|----------|-----------|---------:|--------|-------|
| `.fold` | look click | opacity | 0 ↔ 1 | 480ms | `--expo` | one `.on` |
| `.look` | hover / pressed | translateY | 0 → −4px | 180ms | `--ease` | |
| `.cta` | hover | background | `--char` → `--wine` | 180ms | `--ease` | |
| `.cta` | active | scale | 1 → 0.98 | 180ms | `--ease` | |
| Pressed look | selected | border-color | transparent → `--char` | 180ms | `--ease` | 1px |

Reduced motion: all durations 1ms; lifts removed; smooth scroll off.

## States

- **Look default:** no border, bone captions over the gradient.
- **Look hover:** translateY −4px.
- **Look pressed:** `aria-pressed="true"`, 1px `--char` border, −4px lift.
- **CTA default:** charcoal fill, bone type, 52× auto, 26px side pad.
- **CTA hover:** wine fill.
- **Nav current:** wine 1px inset underline. Hover: `--char`.
- **Focus-visible:** 2px wine, 3px offset.

## Accessibility

- Look tiles are `<button aria-pressed>`. The strip uses `role="list"` / `role="listitem"` on the buttons.
- The figure has `aria-label` that updates with look name and cloth (`Look 02 · Coat, Bone wool`).
- One primary CTA in the hero (`Request a sitting`) and one in the atelier (`Write to sit`). Both are links, 52px tall.
- Contrast: `--char` on `--bone` > 11:1; `--char-2` on `--bone` ≈ 6.2:1; wine on bone ≈ 7.4:1; bone on charcoal > 12:1.
- Focus order: logo, three nav links, hero CTA, four looks, atelier CTA.

## Responsive rules

- ≥ 1280: as specified. Headline 92px, plate 460×520.
- 1024–1279: headline 72px; plate 380×440; gap 28px.
- 768–1023: hero stacks; plate full width, 360px tall, 24px top margin.
- < 768: hide nav links (logo remains). Headline 64px. Look strip one column. Atelier stacks. Side pad 24px.

## Acceptance checklist

- [ ] First 800px shows nav, 92px Didone headline, 460×520 garment plate, CTA, and the four-look strip.
- [ ] Palette is bone `#EFE7DA`, charcoal `#2A2420`, wine `#7A2436` only as accent.
- [ ] Fonts are Bodoni Moda + Tenor Sans; no Fraunces.
- [ ] *holds* is italic and wine.
- [ ] Clicking a look crossfades the plate in 480ms and updates the caption.
- [ ] Only one look is `aria-pressed="true"`.
- [ ] Hero CTA is charcoal, 52px, uppercase 12px / 0.14em; hover is wine.
- [ ] Garment is CSS gradients + a 1px seam at 42% — no `<img>`, no stock photo.
- [ ] Nav is one 60px row, three links, wine underline on Lookbook.
- [ ] Focus rings are 2px wine on every control.
- [ ] `prefers-reduced-motion: reduce` removes lifts and makes the swap instant.
- [ ] No real fashion houses, no emoji, no placeholder copy.

## Implementation notes

**A garment still is a directed gradient, not a blob.** Give it a highlight (bone at ~68%), a body (wine or charcoal), and one hard seam so it reads as cloth:

```css
.g0 {
  background:
    radial-gradient(60% 80% at 72% 18%, rgba(239,231,218,.35), transparent 55%),
    linear-gradient(118deg, #4a2a30 0%, #7a2436 28%, #c9a08a 52%, #efe7da 68%, #2a2420 100%);
}
.seam { position: absolute; left: 42%; top: 8%; bottom: 8%; width: 1px;
        background: linear-gradient(transparent, rgba(239,231,218,.55), transparent); }
```

**Swap folds with opacity, not `display`.** Four layers sit in the same figure; one has `.on`:

```js
function set(i) {
  folds.forEach((f, n) => f.classList.toggle('on', n === i));
  looks.forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
}
```

**Keep a single CTA verb.** Hero: "Request a sitting". Atelier: "Write to sit". Do not add Shop / Cart / Account — this is an appointment house.

Common mistakes: a purple-blue hero gradient; rounding the plate; a second accent gold; setting Bodoni below 80px so it no longer reads Didone; putting the look strip entirely below 900px so the screenshot is only type.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
