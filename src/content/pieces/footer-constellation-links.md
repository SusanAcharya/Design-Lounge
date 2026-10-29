---
title: "Constellation footer links"
summary: "A night-sky footer for an invented café and rooftop telescope: links are stars, and each one you hover is inked to the last while a drawn telescope turns to it."
platform: web
type: section
category: footer
tags: [footer, sitemap, illustration, hover, svg]
styles: [dark, playful, paper]
motion: rich
difficulty: 2
featured: false
published: 2026-10-29
palette: ["#111C2E", "#F1E7D2", "#F2C46D", "#0B1422", "#EFE6D4"]
fonts: ["Domine", "Delius"]
related: [nav-lighthouse-spotlight-menu, footer-curtain-reveal]
---

# Constellation footer links

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The footer of The Orrery Room, an invented café, bookshop and rooftop telescope in a fictional hilltop town. The sitemap is the night sky: sixteen links in four groups are placed as stars over a hand-drawn line of rooftops. Hovering, focusing or tapping a link brightens its star and inks a slightly bowed honey line from the previous lit star, so the visitor draws their own figure across the sitemap; a brass-and-cream telescope on the café's roof terrace swings to look at whichever star is newest, with a cat sitting beside it. Under the roofs it is a full working footer: brand, address, hours, a newsletter form and a legal row. The detail worth copying: the links are real, readable list items positioned with two custom properties, and the star field is drawn from their measured positions, so the same markup becomes a plain stacked sitemap on phones while the sky shrinks to a band.

## Reference behaviour

1. The first frame shows the last 146px of the page (a cream "On the roof this week" strip with three dated events), then the footer. A five-star figure is already drawn: Find us → Star charts → Roof sessions → Sky calendar → Journal. Journal is the newest star (honey, 4-point sparkle, soft halo); the telescope points at it; the counter says "5 stars joined".
2. Hover a link: its label turns honey, its star turns honey and gets a sparkle that springs from `scale(.2) rotate(−30deg)` to rest over 500ms, and a new line inks itself from the previous newest star over 560ms (stroke-dashoffset from its length to 0). The previous star keeps a smaller honey dot.
3. The telescope tube rotates around its mount, over 700ms with a slight overshoot, to point at the newest star, with its rotation clamped between −12° and +80°.
4. Hovering the newest star again does nothing. The trail holds 9 stars (8 lines); the 10th drops the oldest. All but the three newest lines fade to 50%.
5. Keyboard focus does the same as hover; Tab walks the groups in reading order (Visit, Shop, Look up, About). Click or tap a link: same as hover (the demo prevents navigation).
6. "Clear the sky" empties the trail: every star returns to a cream dot, the counter reads "No stars lit yet", the telescope rests at +14°.
7. Submit the newsletter form with a valid email: a polite live line confirms "Thanks. The first letter goes out with the new moon on 20 November."
8. Ambient: the cat's tail flicks 9° over 5s, alternating. Nothing else loops.
9. At 390 wide the sky becomes a 250px band of stars only (no labels), with the rooftops and telescope at its foot, and the links stack in two readable columns below it. Tapping a link lights its star in the band and the telescope turns to it.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────┐
│ main (paper) On the roof this week                     Full sky calendar │ 146px
│ ── Tue 4 Jupiter…        ── Thu 6 The Pleiades…   ── Sat 8 Kids' sky… │
├──────────────────────────────────────────────────────────────────────────┤
│ .sky (night, 430px)                                                      │
│ Run along the sitemap and you'll draw…        5 stars joined (Clear sky) │ top 20
│  VISIT              SHOP              LOOK UP            ABOUT           │ h3 at --x/--y
│  · Café & menu        · New books        ·──Roof sessions     · Our story│
│     · Opening times      ·─Star charts ─╯   ╲· Sky calendar ───·Journal ✦│
│ ·─Find us ──────────╯   · Book club     · Kids' sky club     · Jobs²    │
│     · Accessibility        · Gift cards       · Hire the roof   · Press  │
│ ▁▂▃ roofs, lit windows ▃▂▁▃▅▃▂▁▂▃▂▁▂▃▂▁▃▂▁▂▃▂▁▂ terrace ▬[telescope] cat │ 140px svg
├──────────────────────────────────────────────────────────────────────────┤
│ .base (night-2) The Orrery Room │ FIND US │ OPENING HOURS │ NEWSLETTER   │ 4 cols
│                 blurb            │ address │ Mon–Thu …     │ [email][Sub] │
├──────────────────────────────────────────────────────────────────────────┤
│ .legal © 2026 The Orrery Room Ltd · Company no.     Privacy · Cookies · … │
└──────────────────────────────────────────────────────────────────────────┘
 gutters 64px · base grid 1.15fr .95fr 1.3fr 1.35fr, gap 36
```

- `<main>` (paper): `<header>` with `<h2>` and a link, then `<ul class="ev">` of three events, each a 1px ink top rule with a bold date and two lines.
- `<footer>` holds `.sky`, `.base` and `.legal`.
- `.sky` (`position: relative; overflow: hidden`): `svg.field` (full size, no viewBox, `aria-hidden`) with three groups in paint order: `.bg` (90 seeded dust stars), `.ink` (lines), `.stars` (one `<g class="st">` per link, holding halo, sparkle and dot). Then `svg.roofs` (`viewBox 0 0 1280 140`, `preserveAspectRatio="xMaxYMax slice"`, `aria-hidden`) with the skyline, lit windows, terrace railing, telescope and cat. Then `.grain` (above the chips, 14% screen), `.hint` (copy, a live counter and the Clear button) and `<nav class="map" aria-label="Sitemap">`.
- `.map`: four `<div>`s, each an `<h3>` and a `<ul>` of four `<li><a>`; every `<h3>` and `<a>` has inline `--x` (percent of width) and `--y` (px from the sky's top). Each link holds `<i class="dot">` (a 0×0 marker at the star point) and a `<span>` label on a solid night chip.
- `.base`: brand, Find us, a `<dl>` of hours, and a `<form>` with a visually hidden `<label>`, an email `<input>`, a Subscribe `<button>` and a polite status `<p>`.

## Tokens

```css
:root {
  /* page end */
  --paper: #EFE6D4;      /* content above the footer */
  --paper-ink: #1F2433;  /* 12.5:1 on paper */
  --paper-2: #5A5A62;    /* event meta, 5.5:1 */
  --paper-line: #D3C7AE; /* reserved hairline */

  /* night */
  --night: #111C2E;      /* sky */
  --night-2: #0B1422;    /* rooftops, base, legal, html background */
  --line: #2B3B57;       /* legal rule, underline colour */
  --roof-edge: #3A4C6B;  /* skyline outline */
  --rail: #55688A;       /* terrace railing, cat outline */
  --cream: #F1E7D2;      /* labels, body text, telescope tube */
  --cream-2: #C6BEAD;    /* muted text, input border, tripod */
  --honey: #F2C46D;      /* the one accent: lit stars, lines, headings, button */
  --honey-ink: #111C2E;  /* text on honey */
  --brass: #D9A85B;      /* telescope dew shield, focuser, mount */

  /* type */
  --head: "Domine", Georgia, serif;
  --body: "Delius", "Trebuchet MS", sans-serif;
  --fs-h2: 26px;
  --fs-brand: 26px;
  --fs-label: 15px;
  --fs-body: 14px;
  --fs-cap: 12px;        /* group headings, letter-spacing .16em */
  --fs-legal: 13px;

  /* layout */
  --sky-h: 430px;
  --roofs-h: 140px;
  --gutter: 64px;
  --hit-h: 32px;         /* star link height on desktop, 40px on phone */
  --star-r: 2.6px;       /* unlit; 3.6 lit; 4.2 newest */
  --halo-r: 16px;
  --trail-max: 9;

  /* motion */
  --t-micro: 160ms;
  --t-ink: 560ms;
  --t-turn: 700ms;
  --t-spark: 500ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --swing: cubic-bezier(.34, 1.2, .5, 1);
}
```

## Typography

| Role             | Family | Size | Weight | Line-height | Tracking | Case |
|------------------|--------|-----:|-------:|------------:|---------:|------|
| Page-end heading | Domine | 26px | 700    | 1.1         | −0.01em  | sentence |
| Event date       | Domine | 15px | 700    | 1.3         | 0        | title |
| Event text / meta| Delius | 14px / 13px | 400 | 1.35   | 0        | sentence |
| Group heading    | Domine | 12px | 700    | 1           | +0.16em  | UPPERCASE, honey |
| Star label       | Delius | 15px | 400    | 1.5         | 0        | sentence |
| Hint, counter    | Delius | 14px | 400    | 1.5         | 0        | sentence |
| Brand            | Domine | 26px | 700    | 1.1         | −0.01em  | title |
| Base text, hours | Delius | 14px | 400    | 1.55        | 0        | sentence |
| Subscribe        | Domine | 14px | 700    | 1           | 0        | title |
| Legal            | Delius | 13px | 400    | 1.5         | 0        | sentence |

## Motion

| Element        | Trigger              | Property                  | From → To                                    | Duration | Easing |
|----------------|----------------------|---------------------------|----------------------------------------------|---------:|--------|
| New line       | link lit             | stroke-dashoffset         | path length → 0                              | 560ms    | `--ease` |
| Star dot       | lit                  | r, fill                   | 2.6 cream .85 → 3.6 honey 1 (4.2 if newest)  | 160ms    | `--ease` |
| Sparkle        | becomes newest       | opacity, transform        | 0, `scale(.2) rotate(−30deg)` → 1, none      | 200ms / 500ms | `--swing` |
| Halo           | becomes newest       | opacity, transform        | 0, `scale(.3)` → .2, none                    | 300ms / 400ms | `--ease` / `--swing` |
| Telescope tube | newest changes       | rotate about (1176, 48)   | previous → `atan2` angle − 7.1°, clamped −12°…+80°  | 700ms    | `--swing` |
| Label          | hover / newest       | color                     | cream → honey                                | 160ms    | default |
| Cat tail       | ambient              | rotate                    | 0 → 9deg                                     | 5s alternate, infinite | ease-in-out |
| Clear button   | hover                | background, color         | transparent, cream → cream, night            | 160ms    | default |

Reduced motion: all transitions cut to 1ms and the tail stops; new lines are added without the dash animation (the JS checks the media query), so the figure and the telescope snap to the end state.

## States

- **Unlit star:** 2.6px cream dot at 85%; label cream on its night chip.
- **Lit (in the trail):** 3.6px honey dot.
- **Newest:** 4.2px honey dot, 26px 4-point sparkle, 16px honey halo at 20%, label honey, telescope aimed at it.
- **Lines:** 1.7px honey, round caps, 90% opacity; older than the newest three at 50%.
- **Empty sky:** counter "No stars lit yet"; with one star, "1 star lit"; otherwise "N stars joined" (polite live region).
- **Focus-visible:** 2px honey outline, 3px offset, 6px radius in the footer; ink outline on the paper strip.
- **"Jobs":** a 10px honey superscript count; drop it when there are no open roles.
- **Form:** input border 1.5px cream-2; on submit the honey status line appears under it. Invalid email uses the browser's own `required` / `type=email` validation.

## Accessibility

- The sitemap is one `<nav aria-label="Sitemap">` of four headed lists; stars, lines, roofs and the telescope are all `aria-hidden` SVG, so screen readers get a normal footer.
- DOM order is the reading order; absolute positioning never reorders it. Groups are laid out left to right so visual and tab order agree.
- Labels sit on solid `--night` chips above the line layer, so ink lines and dust stars never pass behind text: cream 13.9:1, honey 10.5:1, cream-2 9.3:1 on night; cream 15:1 on night-2; paper-ink 12.5:1 and paper-2 5.5:1 on paper.
- The email field has a real `<label>` (visually hidden) and its 1.5px cream-2 border is 10:1 against night-2. Subscribe is honey with night text, 10.5:1.
- The counter is `aria-live="polite"`; the form status is a second polite region.
- Star links are 32px tall on desktop with 26px of left padding covering the star, so the star itself is part of the hit area; on phones every link is a 40px row.

## Responsive rules

- ≥ 1280: as specified.
- 1101–1279: same sky; `--x` is a percentage so stars spread with the width.
- 641–1100: gutters 40px, the base becomes 2 × 2.
- ≤ 640: `.sky` gets `padding-top: 250px`; `svg.field` is 250px tall and the roofs SVG sits at `top: 150px`, 100px tall (the `xMaxYMax slice` keeps the terrace, telescope and cat in view at the right). The hint stacks under the band. `.map` becomes static: a 2-column grid of the four groups, gap 22 × 16, chips removed, links 40px rows. JS places band stars at `x = width × (.04 + x% × .98)`, `y = 24 + y × .46`, alternating ±4px so rows don't line up. Base stacks to one column, legal stacks. Nothing scrolls sideways at 390.
- On resize the whole field (dust, stars, lines, telescope angle) re-measures after a 120ms debounce.

## Acceptance checklist

**Always**

- [ ] Each sitemap link is a real `<a>` inside grouped lists; star positions come from measuring the links, not a second hard-coded list.
- [ ] Hover, keyboard focus and tap all light the star, ink a line from the previous one and turn the drawn object toward it.
- [ ] Lines animate in by stroke-dashoffset and never pass behind label text (labels sit on solid chips above the line layer).
- [ ] The trail is capped and older lines fade; a Clear control empties it and resets the counter and the drawing.
- [ ] Address, hours, newsletter form with a real label, and a legal row are present and usable.
- [ ] Reduced motion snaps lines, star states and the telescope with no tween.
- [ ] At 390 the links stack into readable groups, the sky stays as a band with the drawing, and nothing scrolls sideways.
- [ ] All text reaches 4.5:1 against what is behind it; the unfilled input border reaches 3:1.

**This demo**

- [ ] Four groups (Visit, Shop, Look up, About) of four links each, 16 stars.
- [ ] Initial figure Find us → Star charts → Roof sessions → Sky calendar → Journal, "5 stars joined".
- [ ] Sky 430px `#111C2E`, honey `#F2C46D` lines 1.7px, trail of 9.
- [ ] Telescope pivots at (1176, 48) in the roof viewBox, scaled 1.45 from its feet, turning over 700ms.
- [ ] Copy: "9 Lantern Yard, Haverleigh", hours Mon–Thu 8:00–18:00, Fri–Sat to 23:00, Sun 10:00–17:00.

## Implementation notes

**Position links with two variables; let the dot mark the star.** The same markup flows as a list on phones once the absolute positioning is dropped.

```css
.map a   { position: absolute; left: calc(var(--x) - 14px); top: calc(var(--y) - 16px);
           display: flex; align-items: center; height: 32px; padding: 0 6px 0 26px; }
.map a .dot  { position: absolute; left: 14px; top: 16px; width: 0; height: 0; }
.map a span  { background: var(--night); padding: 1px 6px; border-radius: 4px; }
@media (max-width: 640px) { .map { position: static; display: grid; grid-template-columns: 1fr 1fr; }
  .map a, .map h3 { position: static; } .map a .dot { display: none; } }
```

**Ink a hand-bowed line and draw it in.** Two control points pushed off the chord by small, deterministic amounts read as a pen, not a ruler; no filter needed, so the line stays crisp.

```js
function line(a, b, animate) {
  const [ax, ay] = pos[a], [bx, by] = pos[b], dx = bx - ax, dy = by - ay;
  const k = ((a * 7 + b * 3) % 5 - 2) * .035, j = ((a * 5 + b * 11) % 7 - 3) * .012;
  const d = `M${ax} ${ay}C${ax + dx * .33 - dy * (k + j)} ${ay + dy * .33 + dx * (k + j)} ` +
            `${ax + dx * .68 - dy * (k - j)} ${ay + dy * .68 + dx * (k - j)} ${bx} ${by}`;
  const p = ink.appendChild(svgEl('path', { d }));
  if (!animate || reduce.matches) return;
  const L = p.getTotalLength();
  p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
  p.getBoundingClientRect();               // commit the start state
  p.classList.add('drawing'); p.style.strokeDashoffset = 0;
}
```

**Aim the telescope in screen space, then correct for how it was drawn.** The tube is drawn pointing left and 7.1° up, so subtract that from the angle to the star.

```js
const pr = pivot.getBoundingClientRect(), sr = field.getBoundingClientRect();
const px = pr.left + pr.width / 2 - sr.left, py = pr.top + pr.height / 2 - sr.top;
let ang = Math.atan2(ty - py, tx - px) * 180 / Math.PI;
ang = (ang + 360) % 360 - 180 - 7.1;                // 0 = pointing straight left
tube.style.transform = `rotate(${Math.max(-12, Math.min(80, ang))}deg)`; // origin 1176px 48px
```

Grain is a 160px feTurbulence data URI over the whole sky at 14% opacity, `mix-blend-mode: screen`, `z-index: 3`: above the chips on purpose, so the solid label chips don't read as flat boxes on a grainy sky. Keep it that faint; text still clears 9:1.

Common mistakes: letting the line layer or dust stars sit above the labels (contrast drops and the pixel check fails); a displacement filter on thin lines, which breaks them into stair-steps; hard-coding star coordinates separately from the links, so they drift apart at other widths; putting the roofs SVG under a `.sky > svg { height: 100% }` rule, which slices it three times too big.
