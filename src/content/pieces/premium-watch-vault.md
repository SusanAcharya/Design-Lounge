---
title: "Collector's watch vault with turntable"
summary: "A private watch vault: six pieces from invented maisons in a gallery grid, then a hero view where you drag a CSS 3D watch from dial to profile to caseback."
platform: mobile-app
type: screen
category: ecommerce
tags: [watches, collection, drag, select, 3d, luxury]
styles: [luxe, editorial, minimal]
motion: rich
difficulty: 3
featured: false
published: 2026-11-06
palette: ["#F3F2EF", "#1B1A18", "#C4A167", "#77592B", "#5C5850"]
fonts: ["Bodoni Moda"]
related: [luxe-product-detail, hero-3d-product-turn, mockup-watch-faces]
---

# Collector's watch vault with turntable

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The vault screen of a private-collection app: Ishaan Rao's six watches from invented maisons (Maison Arvelle, Haussler & Fils, Corvin Genève, Okuda Tokei, Ravensworth London, Ballin Frères), insured at £412,600. The first screen is a gallery wall: a two-column grid of small cards, each with a drawn watch, the maison in spaced capitals, the model in italic Bodoni and its value and 12-month change. Tap one and its watch flies out of the card into a turntable: a CSS 3D watch built from a dial face, a caseback, a metal band, strap pieces and a crown, which you drag to turn from dial to profile to caseback. Below it sit the valuation with a sparkline, the reference, year, movement, case, provenance and a service-history timeline, and one primary action. The detail worth copying is the material discipline: one champagne-gold metal for every case and every accent, a cool gallery-white wall, ink type, and nothing else.

The language is iOS 26-ish but quiet: a sticky bar, a pill segmented control, 4px card radii because jewellery cases are crisp, 28px pill buttons.

## Reference behaviour

1. First frame, 390 × 844: wall `#f3f2ef`. From 62px: eyebrow "PRIVATE COLLECTION · ISHAAN RAO" (11px caps, 0.22em, bronze), title "The *Vault*" (46px, the second word italic), "Six pieces · insured at **£412,600**" where the total is summed in JS from the six values.
2. Grid: 2 columns, 10px gap, 20px side padding. Each card is a `button` on `#fbfaf8` with a 1px `#dedad3` inset ring, radius 4, padding 16 14 14: a 92px watch, maison (10px caps, bronze), model (18px italic), then a hairline and the value left, change right ("+6.1%" green `#2f5b3a`, "−1.3%" red `#8b2f24`). Hover turns the ring gold; press scales to 0.98.
3. The watches differ by dial only: ivory with batons and a small seconds subdial, black lacquer with dots and a date, salmon with paired Roman batons and two chronograph subdials, forest green with batons and a date, white enamel with paired batons and a subdial, slate with diamond indices and a subdial. All cases are the same gold radial gradient (`#f6e7c2 → #c4a167 → #7d6035`), and every dial has the same gilt hands at 10:09 and a soft white sheen arc.
4. Tap a card: the grid fades and scales to 0.97 (480ms) and becomes `visibility:hidden`; the hero view fades in. A copy of the card's watch flies from its rect to the turntable centre and scales to 180px in 520ms with the iOS sheet curve; then the real 3D watch appears and turns from −38° to 0° in 700ms (quartic out), so it lands facing you.
5. Hero: a sticky bar from 54px with a 44px round back button, "THE VAULT" and "3 OF 6". Centred title block: maison in bronze caps, model 38px italic.
6. Turntable stage, 320px tall, perspective 900px: the watch (180px case) on a soft elliptical plinth shadow, with leather strap pieces above and below that fade out with a mask. Under it an italic hint "⟷ Drag to turn" which fades away on the first drag.
7. Drag horizontally on the stage: rotation follows at 0.6°/px. On release it keeps spinning with the release velocity and decays by 0.94 per frame. Left/Right arrows on the focused stage turn 30° with the same 700ms ease.
8. Under the stage, a pill segmented control Dial / Profile / Caseback; each turns the watch the short way to 0°, 90° or 180°. The pressed segment follows the live angle (|a| < 45 Dial, > 135 Caseback, else Profile), so dragging updates it too.
9. At 90° you see the profile: a 16px gold band with a vertical highlight, the strap edges and a knurled crown cap. At 180° the caseback: brushed rings, six case-back notches and two engraved lines.
10. Watches with a subdial (or a chronograph) run a seconds hand on the hero watch, one step per second.
11. Below: "VALUATION · OCT 2026", the value at 40px, "+£9,996 (+9.8%) in 12 months" computed from the value and the percentage, and a 120 × 44 gold sparkline. Then a two-column spec list with hairlines: Reference, Year, Movement (full width), Case, Provenance. Then "Service history": a vertical hairline timeline with gold dots, newest first (filled), each with date, work and atelier.
12. A fixed 56px ink pill "— Arrange a viewing —" with gold hairlines either side, 34px from the bottom. Pressing it changes its text to "Viewing requested" and announces "The vault will confirm a slot within one working day."
13. Back, or Escape, returns to the grid and focuses the card you came from.
14. Reduced motion: no fly-out, no spin-in (the watch appears at 0°), segment buttons jump to the angle, no inertia after a drag, no seconds tick; views crossfade in 240ms.

## Structure

```
Grid view                                   Hero view (scrolls)
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│ 62px                             │        │ (‹) THE VAULT              3 OF 6│ sticky, pad 54 16 8
│ PRIVATE COLLECTION · ISHAAN RAO  │        │          CORVIN GENÈVE           │
│ The Vault                 46px   │        │             Saumon        38px   │
│ Six pieces · insured at £412,600 │        │              ║║                  │ strap (masked)
│ ┌──────────────┐┌──────────────┐ │        │          ╭───────╮               │
│ │     ( ◷ )    ││     ( ◷ )    │ │        │          │  ◷    │▯ crown        │ 180px case, persp 900
│ │ MAISON ARVELLE││HAUSSLER & FILS│ │       │          ╰───────╯               │ stage 320px
│ │ Méridienne    ││ Nachtwache    │ │       │              ║║                  │
│ │ £48,200  +6.1%││ £61,750 +2.4% │ │       │        ⟷ Drag to turn            │
│ └──────────────┘└──────────────┘ │        │     ( Dial | Profile | Caseback )│ 40px segments
│   … 3 rows, gap 10               │        │ VALUATION · OCT 2026     ╱╲╱‾    │
│                                  │        │ £112,000                         │
└──────────────────────────────────┘        │ Reference | Year / Movement / …  │
                                            │ Service history  ● ○ ○           │
                                            │ [—  Arrange a viewing  —]        │ fixed, bottom 34
                                            └──────────────────────────────────┘
```

- Two `view`s fixed to the viewport: `main.list` (labelled by the `h1`) and `section.hero` (labelled by the model `h2`, `aria-hidden` while closed, `visibility:hidden`).
- Cards: `button.w` with an `aria-label` "Corvin Genève Saumon, 1953, £112,000"; watch SVGs are `aria-hidden`.
- Stage: `div role="slider" tabindex="0"` with `aria-valuemin=-180`, `aria-valuemax=180`, `aria-valuenow` and `aria-valuetext="Profile, 90 degrees"`.
- Turntable `div.tt` with `transform-style: preserve-3d` holding: two strap divs, five case slices at z −8, −4, 0, 4, 8px, a `rotateY(90deg)` band, two strap-edge strips, a crown cap disc, a crown, the caseback face and the dial face.
- Segmented control: `div role="group"` of three `button`s with `aria-pressed`.
- Specs: `dl` of `div > dt + dd`. History: `ol` of `li > time + b + span`.

## Tokens

```css
:root {
  /* gallery */
  --wall: #f3f2ef;     /* page */
  --card: #fbfaf8;     /* cards, back button */
  --rule: #dedad3;     /* hairlines, card rings */
  --ink: #1b1a18;      /* type, CTA, pressed segment */
  --ink-2: #5c5850;    /* secondary type */
  /* the one metal */
  --gold: #c4a167; --gold-hi: #ecd9b0; --gold-lo: #8a6d3e;
  --bronze: #77592b;   /* metal as text (passes 4.5:1 on the wall) */
  --hand: #d6b97f; --hand-edge: #6e5530;
  /* change */
  --up: #2f5b3a; --down: #8b2f24;
  /* strap */
  --leather: #3a2a1d; --leather-hi: #5a4130;
  /* type */
  --serif: "Bodoni Moda", Didot, Georgia, serif;   /* opsz 6..96, optical sizing on */
  --fs-title: 46px; --fs-model: 38px; --fs-value: 40px; --fs-h3: 22px;
  --fs-card-model: 18px; --fs-dd: 17px; --fs-body: 15px; --fs-small: 13px; --fs-caps: 11px;
  /* layout */
  --gutter: 20px; --sheet-pad: 24px; --grid-gap: 10px;
  --r-card: 4px; --r-pill: 28px; --r-seg: 20px;
  --watch-card: 92px; --watch-hero: 180px; --stage-h: 320px; --perspective: 900px;
  --cta-h: 56px; --back: 44px;
  /* shadow */
  --sh-cta: 0 10px 24px rgba(27,26,24,.18);
  --plinth: radial-gradient(closest-side, rgba(27,26,24,.22), rgba(27,26,24,0));
  /* motion */
  --out: cubic-bezier(.16,1,.3,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  --t-view: 300ms; --t-fly: 520ms; --t-turn: 700ms; --deg-per-px: .6; --friction: .94;
}
```

## Typography

Bodoni Moda alone, with optical sizing so the 11px caps get the sturdier text cut and the 46px title gets the hairline display cut.

| Role | Size | Weight | Style | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Vault title | 46px | 400 | roman + italic word | 1 | −0.01em | Title |
| Hero model | 38px | 400 | italic | 1.05 | 0 | Title |
| Valuation | 40px | 400 | roman, lining | 1 | −0.01em | — |
| Section head | 22px | 400 | italic | 1.2 | 0 | Sentence |
| Card model | 18px | 400 | italic | 1.15 | 0 | Title |
| Spec value | 17px | 400 | roman, lining | 1.45 | 0 | Sentence |
| CTA | 17px | 400 | roman | 1 | 0.02em | Sentence |
| Body, summary | 15px | 400 | roman | 1.45 | 0 | Sentence |
| Card value, dates, change | 12–13px | 400 | roman, lining tabular | 1.45 | 0 | — |
| Caps labels | 10–11px | 500 | roman | 1 | 0.2–0.22em | Upper |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Grid | open | opacity, scale | 1 → 0, 1 → 0.97 | 300 / 480ms | `--ease` / `--out` | 240ms fade |
| Hero view | open | opacity | 0 → 1 | 300ms | `--ease` | 240ms fade |
| Flying watch | open | translate + scale | card rect → stage centre, 92 → 180px | 520ms | `--sheet` | none |
| Spin-in | open | rotateY | −38° → 0° | 700ms | quartic out | starts at 0° |
| Drag | pointer move | rotateY | +0.6°/px | live | — | live |
| Inertia | release | rotateY | velocity × 0.94 per frame | until < 0.05°/frame | — | none |
| Segment / arrow turn | press | rotateY | current → target (short way) | 700ms | quartic out | jump |
| Seconds hand | hero open | rotate | 0 → 360° in 60 steps | 60s loop | `steps(60)` | still |
| Segment pill | angle change | background, colour | — | 200ms | `--ease` | same |
| Card | hover / press | ring colour / scale 0.98 | — | 200ms | `--ease` | same |

## States

- **Card:** rest ring `#dedad3`; hover ring `#c4a167`; active scale 0.98; focus-visible 2px ink outline, 3px offset.
- **Segments:** pressed = ink fill, wall-colour text; others `--ink-2` on transparent.
- **Stage:** `cursor: grab`, `grabbing` while held; focus outline drawn 6px inside the stage.
- **Change:** positive in `#2f5b3a` with "+", negative in `#8b2f24` with a true minus "−".
- **CTA:** ink, hover `#33302b`; after press reads "Viewing requested".
- **History:** newest entry's dot filled gold, older entries hollow with a 1.5px gold ring.

## Accessibility

- Grid cards are real buttons with full labels; Tab order follows the grid. Escape or Back returns focus to the opened card.
- The hero view is `aria-hidden` and `visibility:hidden` when closed; the grid is `aria-hidden` while the hero is open.
- The turntable is a slider: Left/Right turn 30°; `aria-valuetext` names the view ("Caseback, 180 degrees"). The segmented buttons offer the same views without dragging.
- A polite live region announces the opened watch ("Corvin Genève Saumon, 1953. Valued at £112,000.") and the viewing request.
- Contrast on `#f3f2ef`: ink 15.5:1, `#5c5850` 6.3:1, bronze `#77592b` 5.8:1, `#2f5b3a` 7.0:1, `#8b2f24` 7.4:1. Gold `#c4a167` is never used for text.
- Hit targets: cards ≥ 170 × 180px, back 44px, segments 40px tall in a 48px pill, CTA 56px.

## Responsive rules

- 360 wide: the grid keeps two columns (cards ≈ 155px); maison names are 10px caps on one line with `white-space:nowrap`; the hero model can wrap to two lines.
- Taller phones: the grid gains bottom space; the stage keeps 320px and the sheet scrolls under the sticky bar.
- Tablet: three-column grid at ≥ 700px; hero becomes two columns (turntable left, sheet right) with the CTA in the sheet.
- Low-power devices: keep the 3D turntable; drop the flying copy and crossfade instead.

## Acceptance checklist

### Always

- [ ] Grid of six cards in two columns; the collection total is summed from the items, not typed.
- [ ] One metal: every case, hand, rule accent and the sparkline use the same gold family; text never uses the light gold.
- [ ] Opening a card flies its watch into the turntable and lands facing the viewer.
- [ ] Dragging turns the watch at 0.6°/px with inertia; dial, profile and caseback are all real faces (no mirrored dial at 180°).
- [ ] Segmented control and arrow keys reach Dial 0°, Profile 90°, Caseback 180°; the pressed segment follows the live angle.
- [ ] Hero shows value with 12-month change and sparkline, reference, year, movement, case, provenance and a dated service history.
- [ ] One primary action, fixed in the thumb zone with 34px below it.
- [ ] Closed view is `visibility:hidden` and `aria-hidden`; focus returns to the opened card.
- [ ] Reduced motion removes the fly, spin and inertia; everything still works.
- [ ] No horizontal scroll at 390px.

### This demo

- [ ] "The Vault", "Private collection · Ishaan Rao", total £412,600.
- [ ] Six maisons and models: Méridienne, Nachtwache, Saumon, Shinrin, Admiralty, Ardoise.
- [ ] Corvin Genève Saumon, ref. CG 3448, 1953, £112,000, +9.8%.
- [ ] Bodoni Moda is the only family.

## Implementation notes

**Fake a solid with five slices and a band.** Two faces with hidden backfaces give the front and back; stacked rings give thickness at oblique angles; a single strip turned 90° reads as the case side at profile.

```css
.tt { transform-style: preserve-3d; transform: rotateY(var(--a)); }
.tt > * { position: absolute; inset: 0; }
.face, .cb { backface-visibility: hidden; }
.face { transform: translateZ(8px); }
.cb   { transform: rotateY(180deg) translateZ(8px); }
.sl   { inset: 4px; border-radius: 50%; border: 5px solid #8a6d3e; } /* z = -8,-4,0,4,8 */
.band { left: 82px; width: 16px; top: 2px; bottom: 2px; border-radius: 8px;
        background: linear-gradient(#7d6035, #ecd9b0 22%, #c4a167 50%, #ecd9b0 78%, #7d6035);
        transform: rotateY(90deg); }
.cap  { left: 79px; top: 79px; width: 22px; height: 22px; border-radius: 50%;
        transform: rotateY(90deg) translateZ(102px); }  /* crown end, seen at profile */
```

**Turn the short way.** Segment buttons add the signed shortest difference to the current angle, so a watch at 340° goes to 360°, not back through 180°.

```js
const short = (from, to) => ((((to - from) % 360) + 540) % 360) - 180;
seg.onclick = () => spin(ang + short(ang, +btn.dataset.a));
function spin(to) {
  const a0 = ang, t0 = performance.now();
  const k = now => { const t = Math.min(1, (now - t0) / 700), e = 1 - (1 - t) ** 4;
    setA(a0 + (to - a0) * e); if (t < 1) raf = requestAnimationFrame(k); };
  raf = requestAnimationFrame(k);
}
```

**Fly a copy, not the original.** Clone the card's SVG into a fixed element at the card's rect, animate it to the stage centre with the Web Animations API, then remove it and reveal the 3D watch. The card stays put, so Back has somewhere to return focus.

Common mistakes:

- Drawing the dial text in SVG at 4px; it is illegible and fails contrast. Use short bars for maker marks.
- Giving each watch a different case metal; the "one material" rule is what makes it read as a vault, not a shop.
- Forgetting `touch-action: pan-y` on the stage, so horizontal drags scroll the page or vertical scrolls are trapped.
