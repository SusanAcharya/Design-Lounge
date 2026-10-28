---
title: "Manga page hero"
summary: "A hero laid out as a manga page: five slanted panels with real gutters, a speech-bubble headline, CSS screentones and speed lines, panels that turn in one by one."
platform: web
type: section
category: hero
tags: [manga, comics, hero, screentone, panels]
styles: [editorial, playful, paper]
motion: subtle
difficulty: 3
featured: false
published: 2026-10-28
palette: ["#F5F1E8", "#FFFDF8", "#171513", "#C8202A", "#C9C2B4"]
fonts: ["Gochi Hand", "Rubik"]
related: [anime-cel-style, cartoon-sticker-landing]
---

# Manga page hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The top of the homepage for "Panelhouse", an invented reading app for independent comics, laid out as a black-and-white manga page with one spot red. Under a 64px nav, five panels with slanted edges and paper gutters split the hero: a headline in a giant speech bubble over a dotted-screentone night and a city silhouette; a "FWIP!" page-turn sound effect on speed lines; a phone showing a chapter on hatching; two stat boxes and a thought bubble on dots; and the call to action. On load the panels turn in one after another like a page being read. The detail worth copying: every panel is the full page box with a `clip-path` polygon in page percentages, and one SVG on top draws all the panel borders with `vector-effect: non-scaling-stroke`, so gutters stay parallel at any size and borders stay 3px.

## Reference behaviour

1. Initial state at 1280 × 800: white 64px nav with a 3px ink bottom border; below it the page area (inset 18px top, 24px sides, 22px bottom) on `--paper`, with five panels outlined in 3px ink.
2. On load each panel animates from `opacity 0, translateX(40px) rotateY(-18deg)` (origin left centre, perspective 1600px on the page) to rest over 620ms expo-out, staggered 90ms in reading order: headline, FWIP, chapter, numbers, CTA. The last one lands at 980ms.
3. Panel 1 (headline): dot screentone fading top to bottom, a moon (circle with a hard inset shade), a black city silhouette at the panel's foot, a white elliptical speech bubble with a tail pointing down at the city, holding the H1 "The next chapter drops Thursday." ("Thursday." in red). A narration box (rotated -1°) overlaps the bubble's lower left.
4. Panel 2: ink speed lines radiating from a white clearing top right; "FWIP!" in red Rubik 900 italic, rotated -9°, white 10px stroke behind and an ink 3px drop; an ink caption tab "Swipe turns a page in 180 ms".
5. Panel 3: diagonal hatching; a phone (ink body, rotated 6°) showing three mini panels; a white box: "Lanterns over Kessel / Chapter 112 · 24 pages / by Ines Varga · out Thu 30 Oct, 18:00".
6. Panel 4: dot tone; two stat boxes "2,400 series on the shelves" and "38k reading tonight"; a thought bubble "No ads. Not one." with two trailing circles.
7. Panel 5: faint speed lines from the bottom right; "Start reading free" (ink fill, red hard shadow) and "Browse shelves" (white, ink hard shadow); "14 days free · cancel in two taps".
8. Hover a button: it lifts `translate(-2px,-2px)` and the hard shadow grows 3px → 5px over 140ms; press drops it to 1px. Nav links hover with a 3px red underline.
9. Click "Turn the page again" (bottom-right tab overlapping the page edge): all panels replay the turn-in sequence.

## Structure

```
1280 × 800
+--------------------------------------------------------------------------------+
| [#] Panelhouse  Shelves  New this week  For artists  Pricing     Sign in [Start free] | 64
+--------------------------------------------------------------------------------+
|  +------------------------------------+   +--------------------------------+   |
|  | ( moon )   .-----------------.     |  /  speed lines        FWIP!       |   |
|  |  dots     (  The next chapter )    | /   [SWIPE TURNS A PAGE IN 180 MS] |   |
|  |  fade     (  drops Thursday.  )   / +--------------------------------+    |
|  | +narration box--+ '---v------'   /  +--------------------------------+    |
|  | |Panelhouse is..|  ##  ###  ##  /  /  hatch  [phone]  [chapter box]  |    |
|  | +---------------+ city ######  /  +---------------------------------+     |
|  +-------------------------------+   +---------------------------------+      |
|  | dots   [2,400] [38k]  (No ads.)|  /  [Start reading free] [Browse] |      |
|  |                                | /   14 days free · cancel ...     |      |
|  +--------------------------------+ +-----------------------------------+ [TURN THE PAGE AGAIN]
+--------------------------------------------------------------------------------+
panel polygons in % of the page box (x,y):
 P1 0,0 57,0 53.5,60 0,64        P2 59.5,0 100,0 100,27 57.8,31
 P3 57.6,34.5 100,30.5 100,64 55.6,68
 P4 0,67.5 53.3,63.5 52.6,100 0,100   P5 55.4,71.5 100,67.5 100,100 54.9,100
```

- `<header class="nav">`: logo link (28px SVG mark: a panelled square with one red cell, plus "Panelhouse" Rubik 800 20px), `<nav><ul>` of four links, "Sign in" link, "Start free" `.btn.ink`.
- `<main class="page">`: `position: relative; perspective: 1600px; min-height: 620px`, flex 1 under the nav.
  - `<svg class="outline" viewBox="0 0 100 100" preserveAspectRatio="none">` with five `<polygon>`s, stroke 3, `z-index: 5`, `pointer-events: none`.
  - Five `<section class="p pN" aria-label>`: each `position: absolute; inset: 0; clip-path: polygon(...)`. Children are `.in` absolutely placed in page percentages.
  - `<button class="replay">`.

## Tokens

```css
:root {
  /* paper, ink and one spot colour */
  --paper: #f5f1e8;     /* gutters and page ground */
  --white: #fffdf8;     /* panel fill, bubbles, boxes */
  --ink: #171513;       /* borders, text, silhouettes, speed lines */
  --ink-2: #4b463f;     /* secondary copy (9.2:1 on white) */
  --tone: #c9c2b4;      /* screentone dots, hatching, moon shade */
  --red: #c8202a;       /* "Thursday.", FWIP!, button shadow, logo cell */

  /* type */
  --hand: "Gochi Hand", "Comic Sans MS", cursive;
  --sans: "Rubik", system-ui, sans-serif;
  --fs-h1: clamp(34px, 4.3vw, 60px);
  --fs-sfx: clamp(44px, 6vw, 84px);
  --fs-stat: clamp(30px, 3.4vw, 46px);
  --fs-body: 15px; --fs-narr: 14.5px; --fs-chap: 13.5px; --fs-cap: 12px;

  /* shape */
  --o: 3px;                         /* every border */
  --gut: 12px;                      /* phone gutter */
  --nav-h: 64px;
  --btn-h: 44px;
  --btn-shadow: 3px 3px 0 var(--ink);
  --btn-shadow-lift: 5px 5px 0 var(--ink);
  --tone-dot: radial-gradient(circle, var(--tone) 1.4px, transparent 1.6px) 0 0 / 7px 7px;
  --tone-hatch: repeating-linear-gradient(-35deg, var(--tone) 0 2px, transparent 2px 9px);

  /* motion */
  --t-in: 620ms; --stagger: 90ms;
  --t-micro: 140ms;
  --expo: cubic-bezier(.16, 1, .3, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size / line | Weight | Notes |
|---|---|---|---|---|
| H1 in bubble | Gochi Hand | clamp(34px, 4.3vw, 60px) / 0.98 | 400 | centred, -0.01em; "Thursday." in `--red` |
| Thought bubble | Gochi Hand | 20 / 1.05 | 400 | centred |
| SFX "FWIP!" | Rubik | clamp(44px, 6vw, 84px) / 1 | 900 italic | `--red`, 10px white stroke behind (`paint-order: stroke fill`), `drop-shadow(3px 3px 0 ink)`, -0.03em |
| Logo | Rubik | 20 / 1 | 800 | -0.02em |
| Nav links | Rubik | 15 | 500 | |
| Buttons | Rubik | 15 / 1 | 700 | |
| Narration, chapter | Rubik | 14.5 / 1.45, 13.5 / 1.4 | 400, title 700 15px | |
| Stat numeral | Rubik | clamp(30px, 3.4vw, 46px) / 1 | 800 | -0.03em |
| Caption tab | Rubik | 12 / 1 | 500 | uppercase, 0.08em, white on ink |

Gochi Hand is only for what a character says or thinks. Everything the product says (narration, data, buttons) is Rubik.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Stagger | Reduced motion |
|---|---|---|---|---|---|---|
| Panel turn-in | load, replay | opacity, transform | 0, translateX(40px) rotateY(-18deg) → 1, none | 620ms expo-out | 90ms × index | no animation, panels at rest |
| Button lift | hover | transform, box-shadow | 0 → (-2px,-2px), 3px → 5px | 140ms `--ease` | | 1ms |
| Button press | active | transform, box-shadow | → (2px,2px), 1px | 140ms | | 1ms |
| Nav underline | hover | border-color | transparent → red | instant | | same |

Replay resets each panel with `animation: none`, a forced reflow, then clears the inline style so the stylesheet animation runs again with its delays.

## States

- **Button default (white):** 3px ink border, `3px 3px 0` ink shadow. **Ink variant:** ink fill, white text, red `3px 3px 0` shadow. **Hover:** lifted with a 5px shadow. **Active:** pressed, 1px shadow.
- **Focus-visible:** 3px `--red` outline at 3px offset on every link and button.
- **Replay tab:** 2px ink border on paper, uppercase 12px; hover inverts to ink fill and white text.
- **During turn-in:** panels are clickable as soon as they appear; nothing waits for the sequence.

## Accessibility

- One `<h1>` (the bubble). The page is `<main aria-label>`; each panel is a `<section aria-label>` that names its role (headline, page turn, chapter, numbers, start reading).
- Decorative layers (tones, moon, city, phone, speed lines, "FWIP!") are `aria-hidden`. The SFX meaning is repeated in the caption tab as text.
- Reading order in the DOM matches the visual order (left top, right top, right middle, left bottom, right bottom).
- Contrast: ink on white 17.9:1; red on white 5.6:1; `--ink-2` on white 9.2:1; white on ink 17.9:1. All text sits on white boxes or white panel fill, never on a tone, so the dots and hatching never sit behind words.
- The outline SVG has `pointer-events: none` so it does not block the buttons under it.
- Buttons are 44px tall; on phones 44px stays.

## Responsive rules

- ≥ 1280: as drawn; the page fills the viewport under the nav with `min-height: 620px`.
- 1100–1279: polygons scale with the box; type scales with its clamps.
- 760–1100: nav links hide (logo, Sign in, Start free stay); narration widens to 36%, the chapter box to 21% with 12.5px type.
- < 760: the page becomes a flex column with 12px gutters; panels become plain rectangles with 3px ink borders (clip-path off, outline SVG and replay hidden); every `.in` becomes static flow except tones (absolute full-bleed), the moon (top right, 56px), the city (bottom, 90px tall) and FWIP! (top right). Panel 1 is at least 420px tall with the bubble, then the narration, then the city. Panel 3 lays phone (72 × 128) and chapter box side by side. At 390 nothing scrolls sideways.

## Acceptance checklist

**Always**
- [ ] Panels are clipped with `clip-path: polygon()` in page percentages, and adjacent edges are parallel with 2.5–3.5% gutters.
- [ ] One SVG with `viewBox="0 0 100 100" preserveAspectRatio="none"` draws all borders at 3px with `vector-effect: non-scaling-stroke`.
- [ ] Screentones and speed lines are CSS gradients (radial dots 7px, hatching -35°, conic lines 0.6° in 5°); no images.
- [ ] No text sits directly on a tone; text lives on white boxes or panel fill.
- [ ] Panels turn in with a 90ms stagger in reading order and a replay control reruns it.
- [ ] Reduced motion shows every panel at rest with no animation.
- [ ] Handwritten type is used only for speech and thought; product copy is a sans.
- [ ] Buttons lift on hover and press on active within 140ms; focus shows a 3px red ring.
- [ ] Below 760px the panels stack as bordered rectangles and nothing scrolls sideways at 390.

**This demo**
- [ ] H1 reads "The next chapter drops Thursday." with "Thursday." in `#C8202A`.
- [ ] The sound effect reads "FWIP!" and the caption "Swipe turns a page in 180 ms".
- [ ] The chapter box names "Lanterns over Kessel", chapter 112, 24 pages, Ines Varga, Thu 30 Oct, 18:00.
- [ ] Stats read 2,400 and 38k; the thought bubble reads "No ads. Not one."
- [ ] Narration names $5 a month, 14 days free and 70% to artists.

## Implementation notes

**Panels as clipped full-page layers, borders drawn once.** Clip-path cuts borders, so never put `border` on a clipped panel; draw the outlines in one SVG.

```css
.page { position: relative; perspective: 1600px; }
.p { position: absolute; inset: 0; overflow: hidden; background: var(--white);
     transform-origin: 0 50%; animation: turn 620ms var(--expo) both;
     animation-delay: calc(var(--i) * 90ms); }
.p1 { clip-path: polygon(0 0, 57% 0, 53.5% 60%, 0 64%); --i: 0; }
.p2 { clip-path: polygon(59.5% 0, 100% 0, 100% 27%, 57.8% 31%); --i: 1; }
.outline polygon { fill: none; stroke: var(--ink); stroke-width: 3;
                   vector-effect: non-scaling-stroke; stroke-linejoin: round; }
@keyframes turn { from { opacity: 0; transform: translateX(40px) rotateY(-18deg); } }
```

To get parallel gutters, pick one edge line per gutter (`x = 60.5 - 0.069y` for the vertical one here) and offset the neighbour's edge by the gutter width; write the polygons from those lines rather than by eye.

**Screentone and speed lines with a clearing:**

```css
.dots { background-image: radial-gradient(circle, var(--tone) 1.4px, transparent 1.6px);
        background-size: 7px 7px;
        mask: linear-gradient(180deg, #000 10%, transparent 78%); }
.lines { background: repeating-conic-gradient(from 0deg at 84% 16%,
           var(--ink) 0 .6deg, transparent .6deg 5deg); }
.lines::after { content: ""; position: absolute; inset: 0;
  background: radial-gradient(ellipse 34% 60% at 84% 16%, var(--white) 0 60%, transparent 61%); }
```

**Replay without timers:**

```js
replay.addEventListener('click', () => page.querySelectorAll('.p').forEach(p => {
  p.style.animation = 'none'; void p.offsetWidth; p.style.animation = '';
}));
```

Common mistakes: putting the `perspective` on each panel instead of the page (each panel then turns around its own vanishing point and the page looks broken); placing panel children in panel-local units (every panel is the full page box, so `left: 63%` means 63% of the page); letting red SFX sit straight on ink speed lines (the white stroke behind it is what keeps it legible).
