<!-- Design Lounge Nº 132 · "Pixel arcade design language kit" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Pixel arcade design language kit

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A kit sheet for "Stardrift", a fictional 8-bit shooter, that teaches a pixel dialect: a 4px grid, 0 radii, `image-rendering: pixelated`, `-webkit-font-smoothing: none`, and sprites built from `box-shadow` (and 4px background-image rects) — **no raster images, no emoji**. The first row is a pause / start-screen fragment: CRT scan 8px, four 4px stars, a 13-pixel ship, SCORE / HI in green Silkscreen, a 40px yellow "STARDRIFT" with a 4px red text-shadow, and CONTINUE / RESTART / OPTIONS as a vertical menu. Below: type specimen, five chips, hard-offset buttons, chips, a callsign field, a sound switch, three surface plates, four grammar cards. The detail worth copying: **easing is `steps(2)`**. Nothing eases. Selection is a yellow fill, not a glow.

## Reference behaviour

1. Initial state: 48px screen header, 16px RGB mark (red square + yellow/green/blue 4px shadows), "STARDRIFT / PIXEL KIT 06", four anchors, "1UP 000420". Sheet gap is 4px `#2060C8`. First 800px shows the 436px hero + specimen.
2. Hero background is CRT `#12121A` with a repeating 7px clear / 1px black scan. Four 4px stars are a `background-image` of four 4×4 gradients. The ship is a 4×4 red pixel plus a `box-shadow` list (white nose, yellow tip, blue wings), scaled 2.4 so it reads at poster size.
3. Hover a menu row or a `.btn`: fill becomes yellow, text CRT, over 80ms `steps(2)`. Ghost hover fills blue.
4. Click CONTINUE / RESTART / OPTIONS (`role="tablist"`). `aria-selected` moves; selected row is yellow on CRT. `#menu-copy` swaps: continue from last beacon; restart stage 03 from hangar; options (CRT scan 8px, pixel snap, sound).
5. Click 1UP / 2UP / HARD chips: pressed fills blue.
6. Focus the callsign input: border yellow. Font is Space Mono 14px, yellow on CRT, max 8 chars.
7. Click SOUND: `aria-checked` flips; track fills green; 12px knob jumps 18px (`steps(2)`).
8. Header link hover: yellow. "QUIT" is red fill, white text.
9. Reduced motion: transitions 1ms, animations none. Menu still selects.

## Structure

```
1280 × 800 first frame
┌──────────────────────────────────────────────────────────────────────────────┐
│ (RGB) STARDRIFT / PIXEL KIT 06    TYPE COLOUR CONTROLS SURFACE    1UP 000420 │ 48
├───────────────────────────────────────────────┬──────────────────────────────┤
│ SCORE 000420   (stars)                        │ 01 TYPE SPECIMEN             │
│ HI 009900      (ship box-shadow)              │ Aa (64px yellow + red shadow)│
│ STAGE 03 · PAUSED                             │ Display 40 / H2 20 / Body 13 │
│ STARDRIFT (40px, 4px red shadow)              │                              │
│ [CONTINUE] [RESTART] [OPTIONS]    cols 1–7    │ cols 8–12 · 436h             │
├───────────┬───────────┬───────────┬──────────────────────────────────────────┤
│02 PALETTE │03 BUTTONS │04 INPUTS  │05 SURFACE                                │
│ 5 chips   │ START etc │ callsign  │ Hard offset / Blue fill / 8-bit bar      │
│           │ 3 chips   │ link + sw │                                          │
├───────────┴───────────┴───────────┴──────────────────────────────────────────┤
│ Pixel · Snap · Select · Score                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Grid `gap: 4px; background: #2060C8; padding: 4px`. Cells `#1C1C28`.
- Menu buttons: `min-width: 220px; height: 36px; border: 4px solid white`.
- Header bottom border is 4px blue. All borders that are "pixel" are `--px` (4px), never 1px, except specimen inner rules which may be 1px `#2A2A3A` (subgrid, not chrome).
- Score block is `position: absolute; left: 16px; top: 12px`, two lines, green Silkscreen 12px: `SCORE 000420` / `HI 009900`.
- Copy column starts at `top: 150px` so it clears the ship. Menu gap is 8px (two pixel units).
- Callsign input is `maxlength="8"` and `spellcheck="false"` so a six-to-eight character tag stays on one line.

## Tokens

```css
:root {
  --crt: #12121a;       /* field, 60 % */
  --screen: #1c1c28;    /* cells */
  --white: #e8e4d4;     /* type, 15 % */
  --red: #e04020;       /* ship, quit, title shadow */
  --green: #40a848;     /* score, sound on */
  --yellow: #f0c820;    /* title, select */
  --blue: #2060c8;      /* grid, chips */
  --dim: #6a6878;
  --display: "Silkscreen", monospace;
  --mono: "Space Mono", ui-monospace, monospace;
  --fs-display: 40px; --fs-aa: 64px; --fs-h2: 20px; --fs-body: 13px; --fs-label: 11px;
  --px: 4px; --ctl: 40px; --pad: 16px; --radius: 0;
  --t-micro: 80ms;
  --ease: steps(2);
}
```

Blue `#2060C8` is a sixth working colour used as the grid; it may be omitted from the published 5-swatch strip but must exist as a token. The five published swatches are CRT, white, red, yellow, green.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Hero headline | Silkscreen | 40px | 400 | .95 | 0 | UPPERCASE, yellow, 4px red `text-shadow` |
| Specimen glyph | Silkscreen | 64px | 400 | .8 | 0 | "Aa", same shadow |
| Menu / button | Silkscreen | 13–14px | 400 | 1 | 0 | UPPERCASE |
| Score / label | Silkscreen | 11–12px | 400 | 1 | +0.04–0.12em | UPPERCASE, green |
| Body / input | Space Mono | 13–14px | 400 | 1.4 | 0 | sentence in body, UPPERCASE callsign |
| Chip | Silkscreen | 11px | 400 | 1 | 0 | UPPERCASE |

Silkscreen is bitmap. Do not enable antialiasing (`-webkit-font-smoothing: none` on `body`). Scores are six digits with leading zeros.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---------|---------|----------|-----------|---------:|--------|
| `.btn` / menu | hover or selected | background, color, border | white box → yellow/CRT | 80ms | `steps(2)` |
| switch knob | toggle | transform | 0 → 18px | 80ms | `steps(2)` |
| ghost hover | hover | background | transparent → blue | 80ms | `steps(2)` |

No looping animation. The scanlines are a static repeating gradient. Reduced motion: 1ms.

## States

- **Button rest:** 40px, 4px white border, 0 radius. Solid: white fill, CRT text. Ghost: transparent, white text. Red: `#E04020` fill, white text.
- **Hover / selected menu:** yellow fill, CRT text, yellow border.
- **Chip pressed:** blue fill. Unpressed: 4px blue border, transparent.
- **Input:** CRT fill, 4px white border, yellow Space Mono. Focus: yellow border.
- **Switch on:** green track and border, CRT knob +18px.
- **Focus-visible:** 4px yellow, offset 4px (one pixel unit).
- **Title:** yellow Silkscreen with `text-shadow: 4px 4px 0 var(--red)` — a hard offset, not a blur.

## Accessibility

- Header nav labelled "Kit sections". Hero labelled "Composition: pause menu start screen". Menu is a `tablist`; each row `role="tab"` with `aria-selected`.
- Stars, ship, and RGB mark are `aria-hidden="true"`. Score is real text ("SCORE 000420").
- Switch labelled "Sound". Chips `aria-pressed`.
- Contrast: white on CRT 13.4:1; yellow on CRT 10.8:1; CRT on yellow 10.8:1; green on CRT 6.9:1 (scores at 12px). Red on CRT 4.8:1, used on QUIT at 13px.
- Hit targets: menu rows 36×220; buttons 40px; switch label is the hit area.

## Responsive rules

- ≥ 1280: as drawn.
- 700–1100: hero and specimen span 12; headline 32px; header nav hides; components and grammar span 6.
- < 700: every cell spans 12.
- Applying the language: snap every size to 4px. A 5px border is a bug. Never use `border-radius`. Never use `ease` or `cubic-bezier` for UI motion.

## Acceptance checklist

- [ ] The unit is 4px. Grid gap, borders, title shadow, focus ring, and ship pixels are multiples of 4.
- [ ] No `border-radius`. No raster images. No emoji.
- [ ] Hero headline is Silkscreen 40px, uppercase, yellow, with a 4px red hard shadow.
- [ ] The ship is a CSS `box-shadow` sprite on a 4×4 seed pixel, not an image or an SVG bitmap.
- [ ] CONTINUE / RESTART / OPTIONS rewrite `#menu-copy` and set `aria-selected`; selected is yellow on CRT.
- [ ] Body uses Space Mono 13px; scores use Silkscreen with six-digit zero padding.
- [ ] Motion easing is `steps(2)` at 80ms.
- [ ] Sound switch jumps 18px, fills green, and sets `aria-checked`.
- [ ] Focus-visible is 4px yellow, offset 4px.
- [ ] Scanlines are a static repeating gradient (7px clear, 1px black), not an animation.
- [ ] Only Silkscreen and Space Mono are loaded.
- [ ] `image-rendering: pixelated` and `-webkit-font-smoothing: none` are set on `body`.

## Implementation notes

**Pixel ship via box-shadow.** One 4px element carries the sprite. Keep the list on one line in production if you need bytes; the geometry is:

```css
.ship {
  width: 4px; height: 4px; background: var(--red); position: absolute;
  transform: translateX(-50%) scale(2.4); transform-origin: center top;
  box-shadow:
    4px 0 0 var(--red), -4px 0 0 var(--red), 0 -4px 0 var(--white),
    4px -4px 0 var(--white), -4px -4px 0 var(--white), 0 -8px 0 var(--yellow),
    8px 0 0 var(--blue), -8px 0 0 var(--blue), 0 4px 0 var(--red),
    4px 4px 0 var(--red), -4px 4px 0 var(--red), 8px 4px 0 var(--white),
    -8px 4px 0 var(--white), 0 8px 0 var(--blue),
    12px 8px 0 var(--yellow), -12px 8px 0 var(--yellow);
}
```

**Hard title offset**, not a glow:

```css
.hero h1 {
  font: 40px/.95 var(--display); color: var(--yellow);
  text-shadow: 4px 4px 0 var(--red);
}
```

**Menu selection is a tablist.** Do not implement hover-only selection; click (and keyboard, if you add arrows) must set `aria-selected`.

Stars are four 4×4 rects via `background-image` (two white, one yellow, one white) at 12%/18%, 78%/22%, 40%/12%, 88%/40% — not a particle system. Common mistakes: using Press Start 2P instead of Silkscreen (the brief specifies Silkscreen); blurring anything; adding a purple nebula; drawing the ship as an `<img>` or as a Unicode character; using 1px borders on chrome (they look like hairlines, not pixels); antialiasing the font.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
