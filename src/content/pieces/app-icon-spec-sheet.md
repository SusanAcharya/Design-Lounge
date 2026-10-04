---
title: "App icon spec sheet"
summary: "One app icon as a review page: a 1024 master with a keyline overlay and mask toggle, real-pixel sizes, light and dark home screens, and the export set."
platform: web
type: screen
category: utility
tags: [app-icons, spec, keylines, export, ios]
styles: [swiss, industrial, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#E7E8E3", "#121417", "#FF2E88", "#F5F5F1", "#2F7FD6"]
fonts: ["Manrope", "Martian Mono"]
related: [app-icon-shelf-gallery, app-icon-home-screen-set, app-icon-colour-wall]
---

# App icon spec sheet

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from icon.museum: its detail view puts one icon large on a quiet page with its facts and palette underneath, and this piece turns that into the page a designer uses to sign off an icon. The invented app is "Kitefield", a wind forecast app whose icon is a faceted kite on open sky. One screen shows the 1024 master with a magenta keyline overlay, the four sizes people actually see at 1:1 pixels, the icon in a row of four on a light and a dark home screen, the export file list and four review checks. The detail worth copying is the honesty of the real-size row: 180, 120, 60 and 29 pixels with no scaling, so you see at once whether the idea survives at 29.

## Reference behaviour

1. First frame at 1280×800: a 60px tool bar, then a 440px left card (master, legend, export list) and a right column (real sizes, two home screens, review checks). Everything fits without scrolling.
2. The master is drawn at 78% of a 380px stage, about 29% of 1024. The caption computes that percentage from the real width and reads "Shown at 29% · OS applies the mask".
3. The Keylines switch starts off. Turning it on (click, or the G key anywhere) shows the overlay: outer square, both diagonals, centre cross, circles of diameter 88, 50 and 26, a 74 square, a 62×80 portrait and an 80×62 landscape rectangle, and a dashed 80 safe zone. Each line draws in with a stroke-dash reveal, 700ms, staggered 45ms.
4. The switch thumb slides 16px and the track turns magenta. A polite live region says "Keylines shown" or "Keylines hidden".
5. The Mask segmented control has Squircle (default) and Full bleed. Full bleed shows the master as the square artwork you deliver, with the squircle drawn as a dashed line on top. The caption changes to "Deliver the square · dash = mask".
6. Mask only changes the master. The real-size row and the home screens are always masked, because that is what the system shows.
7. The real-size row shows 180, 120, 60 and 29 pixel icons bottom-aligned, each with a mono size label and a two-line use note.
8. The light home screen shows a row of four 60px icons on a pale sky-to-sand gradient: Parcel, Kitefield, Tram, Lark. The dark home screen shows the same row on a night gradient; neighbours turn to dark plates with coloured glyphs and Kitefield uses its dark variant (night plate, same kite).
9. The export list shows five files with pixel size and use: icon-1024.png, icon-180.png, icon-120.png, icon-60.png, icon-29.png.
10. "Export 5 sizes" changes its label to "5 files ready" for 1.8s and announces "Export set ready: five PNG files".
11. The Review checks card lists four passed checks with ticks: One idea, No words, Light from above, Holds at 29 px.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────────────────┐
│ Kitefield / App icon [v3.2]          (◐ Keylines) [Squircle|Full bleed] [Export 5 sizes] │ 60px
├──────────────────────────┬────────────────────────────────────────────────┤
│ MASTER · 1024 × 1024     │ REAL SIZES · 1 PX = 1 PX                       │
│ ┌──────────────────────┐ │  ▢180      ▢120      ▢60     ▢29   bottom-aligned│
│ │                      │ │  180       120       60      29                 │
│ │      ▢ master        │ │  Home @3x  Home @2x  Notif.  Settings           │
│ │   78% of 380 stage   │ ├───────────────────────┬────────────────────────┤
│ │   keylines overlay   │ │ HOME SCREEN · LIGHT   │ HOME SCREEN · DARK      │
│ └──────────────────────┘ │ ▢ ▢ ▢ ▢  60px, labels │ ▢ ▢ ▢ ▢                 │
│ Shown at 29% …  sRGB…    │ note                  │ note                    │
│ — circles — square -- safe├───────────────────────┴────────────────────────┤
│ EXPORT SET               │ REVIEW CHECKS                                   │
│ icon-1024.png 1024 App St│ ✓ One idea           ✓ No words                 │
│ … five rows              │ ✓ Light from above   ✓ Holds at 29 px           │
└──────────────────────────┴────────────────────────────────────────────────┘
 grid: 440px | 1fr, gap 28px, padding 24px 32px 32px
```

- Tool bar is a `header`: breadcrumb text, a `button role="switch"` with `aria-checked`, a `role="group"` of two `aria-pressed` buttons labelled "Mask", and the export button.
- Each card is a `section` with an `h2` mono eyebrow, linked by `aria-labelledby`.
- The master is an `svg role="img"` with `aria-label="Kitefield icon at 1024 pixels"`; the overlay is a second absolutely-positioned `svg` with `aria-hidden="true"` and `pointer-events: none`.
- The export list is a `ul` with one `li` per file in a three-column grid.
- The review checks are a `ul`; each tick is a CSS pseudo-element, not an image.

## Tokens

```css
:root {
  /* colour */
  --bg: #e7e8e3;          /* stone */
  --panel: #f5f5f1;       /* cards */
  --ink: #121417;
  --ink-2: #454950;
  --ink-3: #5f646b;       /* eyebrows, captions */
  --line: #d3d5ce;
  --key: #ff2e88;         /* keyline magenta, switch on */
  --focus: #121417;
  /* the icon */
  --sky-top: #9edbff; --sky-bottom: #2f7fd6;
  --night-top: #22303e; --night-bottom: #0b1016;
  --kite-1: #fff6e6; --kite-2: #ff8a66; --kite-3: #f0dcc0; --kite-4: #e5533a; --bow: #ffd166;
  /* home wallpapers */
  --wall-light: linear-gradient(160deg, #dbe7ef, #f3ede2);
  --wall-dark: linear-gradient(160deg, #25313c, #0f1317);
  /* type */
  --sans: "Manrope", system-ui, sans-serif;
  --mono: "Martian Mono", ui-monospace, monospace;
  /* space */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 28px; --s-7: 32px;
  /* shape */
  --r-card: 18px; --r-stage: 12px; --r-seg: 9px; --r-switch: 999px;
  /* shadow */
  --sh-master: drop-shadow(0 24px 28px rgba(18,20,23,.2)) drop-shadow(0 3px 4px rgba(18,20,23,.12));
  --sh-size: drop-shadow(0 6px 10px rgba(18,20,23,.16));
  /* motion */
  --ease: cubic-bezier(.16,1,.3,1);
  --std: cubic-bezier(.2,.7,.2,1);
  --t-draw: 700ms; --t-stagger: 45ms; --t-switch: 250ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Breadcrumb app name | Manrope | 15px | 700 | 1.5 | 0 | Title |
| Breadcrumb trail | Manrope | 15px | 500 | 1.5 | 0 | Title, `--ink-3` |
| Version chip | Martian Mono | 11px | 500 | 1 | 0 | Lower, ink fill |
| Switch and segment labels | Manrope | 13px | 600 | 1 | 0 | Title |
| Export button | Manrope | 13px | 700 | 1 | 0 | Sentence |
| Card eyebrow | Martian Mono | 11px | 500 | 1 | 0.08em | Uppercase |
| Caption, file rows | Martian Mono | 11–11.5px | 400 (file name 500) | 1.5 | 0 | As written |
| Size label | Martian Mono | 12px | 500 | 1 | 0 | Numerals |
| Use note | Manrope | 12px | 400 | 1.3 | 0 | Sentence |
| App label on home screen | Manrope | 11px | 600 | 1.2 | 0 | Title |
| Check title | Manrope | 13px | 700 | 1.4 | 0 | Sentence |
| Check note | Manrope | 13px | 400 | 1.4 | 0 | Sentence |

Numbers that are measurements (1024, 180, px) are always in the mono. Words people read are in Manrope.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Overlay | switch on | opacity | 0 → 1 | 200ms | linear fade is fine | instant |
| Keylines | switch on | stroke-dashoffset | 420 → 0 | 700ms, delay n × 45ms (n = 0…7) | expo-out | lines shown fully drawn |
| Switch thumb | toggle | transform | 0 → translateX(16px) | 250ms | expo-out | instant |
| Switch track | toggle | background | #c9cbc4 → --key | 200ms | std | instant |
| Export label | click | text | "Export 5 sizes" → "5 files ready" → back | 1800ms hold | none | same |

Nothing moves on load. The page is a reference sheet; the only motion explains the overlay.

## States

- Switch off: grey track, thumb left, `aria-checked="false"`. On: magenta track, thumb right, overlay visible.
- Segment pressed: panel fill, 1px shadow, ink text, `aria-pressed="true"`; the other is `false`.
- Full bleed: master unclipped, dashed ink squircle on top, caption swapped. Squircle: master clipped, white-to-dark rim stroke.
- Focus-visible: 2px ink outline, 3px offset, 6px radius on every control.
- Export: label swap for 1.8s, then reset. There is no disabled state.
- Hover on segments and the export button: no colour change beyond the cursor. Keep it quiet.
- Loading, empty, error: not used.

## Accessibility

- The switch is a `button role="switch"` with `aria-checked`. Its visible text is "Keylines", with a visually hidden "(press G)".
- G toggles keylines unless a modifier key is held. Tab order: switch, Squircle, Full bleed, Export.
- Live region (`aria-live="polite"`) announces "Keylines shown", "Squircle mask", "Full bleed artwork", "Export set ready: five PNG files".
- Every Kitefield render is `role="img"` with its pixel size in the label ("Kitefield icon, dark at 60 pixels"). Neighbour icons are `aria-hidden` with their names as visible text.
- The overlay is decorative and `aria-hidden`; the legend under the master describes it in text.
- Contrast: `#121417` on `#f5f5f1` is 17:1; `#5f646b` on `#f5f5f1` is 5.6:1. Dark home labels `#eef1f4` on `#0f1317` pass easily.
- The magenta is never the only signal: the switch also moves its thumb and the live region speaks.

## Responsive rules

- ≥1280: as specified, two columns, 440px left.
- 1100 and below: one column. The left card caps at 520px wide; the right column follows it.
- 768: the tool bar wraps to two lines (breadcrumb, then tools). Home screens stack. Review checks become one column.
- Under 640 (375 tested): page padding 16px; the 180 icon is drawn at 120px so the row fits, and its label still says 180; the export rows drop to 9.5px mono; the master caption stacks.
- Never scale the 120, 60 and 29 icons. They are the point of the page.

## Acceptance checklist

### Always

- [ ] The master is shown large with the scale stated as a percentage of 1024.
- [ ] A keyline overlay can be toggled by a switch and a single-key shortcut, and its geometry is described in text.
- [ ] A mask toggle shows the delivered square artwork versus the system mask.
- [ ] Real sizes render at exactly 180, 120, 60 and 29 CSS pixels (measure `getBoundingClientRect().width`).
- [ ] The icon is shown in context on a light and a dark home screen, with a dark variant on the dark one.
- [ ] Home-screen and real-size renders are always masked, whatever the master toggle says.
- [ ] The export set lists every file with pixel size and use.
- [ ] No words appear inside the icon artwork.
- [ ] Reduced motion shows keylines fully drawn with no reveal.

### This demo

- [ ] App "Kitefield", version chip "v3.2", icon is a four-facet kite with a tail and two yellow bows on a `#9edbff` → `#2f7fd6` sky.
- [ ] Keyline colour `#ff2e88`; circles 88 / 50 / 26, square 74, rectangles 62×80 and 80×62, dashed safe zone 80.
- [ ] Neighbours on the home screens are Parcel, Tram and Lark.
- [ ] Use notes: 180 Home @3x 60 pt; 120 Home @2x, Spotlight @3x; 60 Notification @3x 20 pt; 29 Settings @1x 29 pt.
- [ ] Export button reads "5 files ready" for 1.8s after a click.

## Implementation notes

**1. Draw the overlay in the icon's own 100-unit space.** Put a second SVG with the same `viewBox="0 0 100 100"` absolutely over the master, and use `vector-effect: non-scaling-stroke` so lines stay 1px at any display size.

```html
<svg class="keys" viewBox="0 0 100 100" aria-hidden="true">
  <rect class="k" style="--d:0" x="0" y="0" width="100" height="100"/>
  <path class="k" style="--d:1" d="M0 0 100 100M100 0 0 100M50 0v100M0 50h100"/>
  <circle class="k" style="--d:2" cx="50" cy="50" r="44"/>
  <circle class="k" style="--d:3" cx="50" cy="50" r="25"/>
  <circle class="k" style="--d:4" cx="50" cy="50" r="13"/>
  <rect class="k" style="--d:5" x="13" y="13" width="74" height="74"/>
  <rect class="k" style="--d:6" x="19" y="10" width="62" height="80"/>
  <rect class="k" style="--d:7" x="10" y="19" width="80" height="62"/>
  <rect class="dash" x="10" y="10" width="80" height="80" rx="4"/>
</svg>
```

```css
.keys { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .2s; }
.keys * { fill: none; stroke: var(--key); stroke-width: 1; vector-effect: non-scaling-stroke; }
.on .keys { opacity: 1; }
.on .keys .k { stroke-dasharray: 420; stroke-dashoffset: 420;
  animation: draw .7s var(--ease) forwards; animation-delay: calc(var(--d) * 45ms); }
@keyframes draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) { .on .keys .k { animation: none; stroke-dashoffset: 0; } }
```

To replay the draw each time the switch turns on, clear and restore the inline `animation` on each `.k` with a forced reflow (`el.offsetWidth`) between.

**2. One render function, three switches.** Write `kite(px, dark, mask)` once. It returns an SVG at the given width and height; `dark` swaps the sky gradient for the night gradient and drops the sun glow; `mask` decides whether the clip is applied or the squircle is drawn dashed on top. Render the kite glyph once into `defs` as `<g id="kite">` and `<use href="#kite">` it everywhere, so all eight copies stay identical.

```js
function kite(px, dark, mask) {
  const clip = mask === 'bleed' ? '' : ' clip-path="url(#sq)"';
  const edge = mask === 'bleed'
    ? `<path d="${SQ}" fill="none" stroke="#121417" stroke-width=".5" stroke-dasharray="2 2"/>`
    : `<path d="${SQ}" fill="none" stroke="url(#rim)" stroke-width="1.4"/>`;
  return `<svg viewBox="0 0 100 100" width="${px}" height="${px}" role="img"
    aria-label="Kitefield icon${dark ? ', dark' : ''} at ${px} pixels"><g${clip}>
    <rect width="100" height="100" fill="url(#${dark ? 'skyD' : 'skyL'})"/>
    ${dark ? '' : '<circle cx="80" cy="18" r="22" fill="#fff" opacity=".18"/>'}
    <rect width="100" height="100" fill="url(#lit)"/><use href="#kite"/>${edge}</g></svg>`;
}
```

**3. Light comes from above in the artwork, not only in the overlay gradient.** The kite has four flat facets: the two upper facets are pale (`#fff6e6`, `#ff8a66`), the two lower are deeper (`#f0dcc0`, `#e5533a`). A shared top-light gradient (white 28% → clear at 50% → black 16%) and a rim stroke finish the plate. A glyph drop shadow (`dy 2.4`, blur 2, 32% navy) lifts the kite off the sky. Keep all of it subtle; at 29px only the two colours and the diamond survive, and that is the test.

Common mistakes:

- Scaling the "real" sizes with CSS transforms. Set width and height in pixels and measure them.
- Applying the full-bleed toggle to the home screens. The system always masks.
- Drawing your own rounded corners into the 1024 PNG. Deliver the square; the OS clips it.
- Putting the app name or a letter inside the artwork. Names live under the icon.
- Making the dark variant a simple invert. Keep the glyph's colours, darken the plate.
- Keylines as a raster image. They must stay 1px sharp at every size.
- A 2px keyline. At 29% scale it covers the art.

Where it sits:

1. As the review page in an icon handoff: designer, developer and product lead all sign off here before the asset catalogue is built.
2. As the detail page in a collection site (see `app-icon-shelf-gallery`), with the review checks swapped for credits.
3. With a tinted or clear appearance required by the platform, add a third home-screen panel rather than a toggle, so all variants are visible at once.
4. The export list is a statement of what ships; generate the files from the 1024 master with a script, never by hand.

Rebuild order:

1. Hidden `defs`: squircle clip, sky and night gradients, light and rim gradients, glyph shadow, the kite group.
2. The `kite()` function and the neighbour icon function.
3. Tool bar and the two-column grid.
4. Master stage with the computed percentage caption, then the overlay SVG.
5. Real-size row, home screens, export list, checks.
6. Switch, G shortcut, mask segment, export feedback and live region.
7. Reduced-motion rule; test at 375 for no sideways scroll.
