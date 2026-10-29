---
title: "Sleepy cat footer"
summary: "A tea shop footer with a hand-drawn ginger cat asleep on the sitemap: it breathes, lifts its head to watch the link you hover, and stretches when you click."
platform: web
type: section
category: footer
tags: [footer, illustration, sitemap, newsletter, character]
styles: [paper, playful, soft]
motion: rich
difficulty: 2
featured: false
published: 2026-10-29
palette: ["#EADBC0", "#F6EEDF", "#2B211A", "#A3401E", "#E7A35E"]
fonts: ["Grandstander", "Gelasio"]
related: [footer-growing-vine, footer-sitemap-columns, footer-local-hours-map]
---

# Sleepy cat footer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The closing block of the website for Little Oolong, a loose-tea shop and reading room in Hebden Bridge. It is a full, working footer (address, hours, a three-column sitemap, a newsletter form, a legal row) on kraft paper, and across the top of the sitemap lies Biscuit, the shop's ginger tabby, drawn in inline SVG with a wobbly ink line. She sleeps and breathes, a small "z" drifts up from her head; hover or focus any link and she lifts her head and her pupils turn toward it; click a link, the cat, or the newsletter button and she yawns, stretches long, flicks her tail up, then settles back to sleep. The detail worth copying is that the reaction is aimed: the eyes are computed toward the actual element, so she watches "Jobs" differently from "Green & white".

## Reference behaviour

1. First frame at 1280 × 800: the last 240px of the page (a 68px Grandstander headline "Come in out of the rain. The kettle is already on." and a booking paragraph) above a 2px ink rule, then the kraft footer filling the rest of the viewport.
2. The cat lies along a hand-drawn shelf line that is the top edge of the sitemap columns, head at the left end over the Shop column, paws under her chin, tail wrapped along the front of her body with the darker tip curled over the paws. Eyes are closed arcs.
3. Idle loop: the torso scales to `scale(1.012, 1.05)` from its base and back over 4.2s; the head rises 1.6px in time with it. Three "z" strokes rise from above the head on a 4.2s loop, staggered 1.4s, fading in to .9 and out while drifting 16px right and 26px up.
4. Hover or focus any link (sitemap, phone, legal, the booking link) or the email field: the head lifts `translate(6px, -15px)` and rotates up to ±12deg toward the element over 520ms; the closed arcs swap for open green eyes; pupils move up to 2.4px horizontally and 1.8px vertically toward the element's centre; breathing quickens to 2.6s; the right ear twitches 9deg once every 2.8s; the "z" stops.
5. Moving between links re-aims the eyes (260ms on the pupils) without dropping the alert pose. Leaving all targets keeps her alert for 700ms, then she goes back to sleep.
6. Click a sitemap or legal link, the cat itself, or submit the form: a 2.6s stretch plays. 0 to 18% the head tips up and back with a yawn (open mouth), 40 to 64% the front paws slide 22px forward and stretch to 1.25 wide, the body lengthens to `scale(1.07, .96)` and tilts -4deg so the rear lifts, the head drops forward, the lying tail fades out and an upright curled tail fades in; 74 to 92% the eyes open; by 100% she is back in the resting pose. Clicking again restarts it.
7. Submitting the form with a valid address shows "Lovely. The November letter goes out on the 4th." in a polite live region; with an empty or invalid address it shows "Pop in an email address and Biscuit will wait." Both trigger the stretch.
8. At 390 wide the footer stacks: brand and hours, then the cat (236px wide, centred) on the shelf above a 2-column sitemap, then the newsletter, then the legal row as a column. Tapping a link focuses it (head lifts and looks) and plays the stretch.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ main.end  padding 44/56/40, grid 1fr 360px, align end                │
│  Come in out of the rain.            Walk-ins are welcome…           │
│  The kettle is already on. (68px)    Book the reading room           │
├══════════════════════════ 2px ink rule ══════════════════════════════┤
│ footer (flex 1, kraft + grain), padding 30/56/22                     │
│  grid 270px | 1fr | 300px, gap 52                                    │
│  ┌ brand ────┐  ┌ nav.map  padding-top 170 ───┐  ┌ form.news ─────┐  │
│  Little Oolong       ╭─╮ z                         THE STEEPING LETTER│
│  tagline (ital)     (- -)~~~~~~~~~~~~~╮  340px     copy              │
│  address, phone     ═══════════════════════ shelf  Email address     │
│  hours dl 4 rows    SHOP   VISIT   ABOUT           [field][Sign me up]│
│                     5 / 4 / 4 links                status line       │
│  ────────────────────────────────────────────────────────────────── │
│  © 2026 … Company no.   Privacy  Terms  Accessibility     note (ital)│
└──────────────────────────────────────────────────────────────────────┘
```

- `<main class="end">`: the tail of the page; an `<h2>` and a `<p>` with one link.
- `<footer>`: `flex: 1` inside a column-flex `<body>` so it always reaches the bottom of the viewport.
- `.brand`: wordmark `<b>`, tagline `<p>`, `<address>` with a `tel` link, a `<dl class="hours">` grid (`auto 1fr`, gap 2px 14px).
- `<nav class="map" aria-label="Sitemap">`: `position: relative; padding-top: 170px`. Holds the cat `<svg role="img">` (absolute, left 0, top 4px, width 340px), the shelf `<svg>` (absolute, top 160px, 8px tall, full width plus 6px each side, `preserveAspectRatio="none"`, `vector-effect: non-scaling-stroke`) and `.cols` (3 × 1fr, gap 24px, padding-top 22px) of `<h3>` + `<ul>`.
- `<form class="news" novalidate>`: `<h3>`, `<p>`, `<label for>`, a `.row` flex of `<input type="email">` and `<button type="submit">`, then `<p role="status" aria-live="polite">`.
- `.legal`: wrap-flex, 1px `--rule` top border; the closing joke right-aligned with `margin-left: auto`.
- Cat SVG, `viewBox="22 0 250 124"`, baseline y 117, all inside one `<g filter="url(#rough)">`, painted in this order: `.tail-up` (hidden), `.torso` (body, stripes, haunch line, belly hatching), `.head` (`.ear`, head shape, inner ear, stripes, blush, `.shut`, `.open` with `.pupil`, nose, mouth, `.yawn`, whiskers), `.paws`, `.tail-low`. The `.zz` group sits outside the filter.

## Tokens

```css
:root {
  /* paper */
  --page: #F6EEDF;       /* page tail background */
  --kraft: #EADBC0;      /* footer and html background */
  --ink: #2B211A;        /* text, drawing line, 11.5:1 on kraft */
  --ink-2: #5A4636;      /* secondary text, 6.5:1 on kraft */
  --rule: #B9A283;       /* legal row hairline */

  /* the one accent */
  --rust: #A3401E;       /* button fill, link hover, booking link; 4.7:1 on kraft, 5.5:1 on page */
  --rust-ink: #FFF6E8;   /* text on rust, 5.9:1 */
  --rust-hover: #8C3518;

  /* field */
  --field: #FBF5EA;      /* input fill */
  --field-line: #6E5947; /* input border, 6.1:1 on field, 4.8:1 on kraft */

  /* cat */
  --fur: #E7A35E;        /* ginger fill and tail core */
  --fur-dk: #B86A2E;     /* tabby stripes, hatching, tail tip */
  --eye: #CFD68A;        /* open iris */
  --pink: #D9877A;       /* nose, inner ear, blush at .45 */
  --mouth: #5A2A22;      /* yawn */

  /* type */
  --display: "Grandstander", system-ui, sans-serif;
  --font: "Gelasio", Georgia, serif;
  --fs-end: clamp(40px, 5.4vw, 68px);
  --fs-mark: 34px;
  --fs-body: 15px;
  --fs-small: 14px;
  --fs-legal: 13px;
  --fs-label: 13px;

  /* layout */
  --gutter: 56px;
  --cat-w: 340px;
  --cat-w-phone: 236px;
  --map-pad: 170px;
  --field-h: 46px;
  --r: 10px;

  /* stroke */
  --line: 2.1px;          /* in viewBox units */
  --line-thin: 1.3px;
  --rough-scale: 2.4;     /* feDisplacementMap */
  --rough-freq: .045;     /* feTurbulence baseFrequency */

  /* motion */
  --t-fast: 160ms;
  --t-head: 520ms;
  --t-eye: 260ms;
  --breath: 4.2s;
  --breath-alert: 2.6s;
  --stretch: 2.6s;
  --linger: 700ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-breath: cubic-bezier(.45, 0, .55, 1);
}
```

## Typography

| Role               | Family      | Size                    | Weight | Line-height | Tracking | Case      |
|--------------------|-------------|-------------------------|-------:|------------:|---------:|-----------|
| Page tail headline | Grandstander| clamp(40px, 5.4vw, 68px)| 700    | 0.98        | −0.02em  | sentence  |
| Wordmark           | Grandstander| 34px                    | 700    | 1           | −0.015em | title     |
| Column headings    | Grandstander| 13px                    | 700    | 1           | +0.08em  | UPPERCASE |
| Button             | Grandstander| 15px                    | 700    | 1           | 0        | sentence  |
| Body, links        | Gelasio     | 15px                    | 400    | 1.55        | 0        | sentence  |
| Tagline, legal note| Gelasio     | 15 / 13px               | 400 ital | 1.55      | 0        | sentence  |
| Hours, form copy   | Gelasio     | 14px                    | 400/600| 1.55        | 0        | sentence  |
| Legal              | Gelasio     | 13px                    | 400    | 1.55        | 0        | sentence  |

Only the page tail headline is at display size. Inside the footer the cat is the loudest thing, so the wordmark stays at 34px.

## Motion

| Element        | Trigger              | Property              | From → To                                         | Duration | Easing          | Notes |
|----------------|----------------------|-----------------------|---------------------------------------------------|---------:|-----------------|-------|
| `.torso`       | always               | transform             | scale(1,1) → scale(1.012,1.05) → back             | 4.2s ∞   | `--ease-breath` | origin 150px 116px (viewBox) |
| `.head`        | always, asleep       | transform             | translateY(0) → (-1.6px) → 0                      | 4.2s ∞   | `--ease-breath` | in step with the torso |
| `.zz path` × 3 | always, asleep       | opacity, transform    | 0, (0,6) scale .6 → .9 → 0, (16,-26) scale 1.1     | 4.2s ∞   | `--ease`        | delays 0 / 1.4 / 2.8s |
| `.head`        | hover/focus target   | transform             | none → translate(6px,-15px) rotate(--tilt)        | 520ms    | `--ease-out`    | `--tilt` = clamp(dx / 30, −12, 12) deg |
| `.pupil`       | hover/focus target   | transform             | 0 → (--px, --py)                                  | 260ms    | `--ease-out`    | max 2.4 / 1.8 units |
| `.shut`/`.open`| hover/focus target   | opacity               | swap 1 ↔ 0                                        | instant  |                 | |
| `.ear`         | while alert          | rotate                | 0 → 9deg → 0 at 86 to 100%                         | 2.8s ∞   | `--ease`        | origin 92px 62px |
| Stretch set    | click link, cat, submit | transform, opacity | keyframes in Reference behaviour 6                | 2.6s     | `--ease`        | class removed after 2.7s |
| Button         | active               | transform             | scale(1) → .97                                    | 160ms    | `--ease`        | |

Reduced motion: every animation and transition is removed. Asleep she shows one static "z"; on hover she snaps to the alert pose; a click snaps to the awake pose (eyes open, head lifted) for 2.7s and back, with no tweening.

## States

- **Asleep (default):** eyes are closed arcs, head resting on paws, "z" rising.
- **Alert:** head lifted and tilted toward the target, open eyes with pupils on the target, ear twitch, faster breath.
- **Stretching:** yawn, long body, tail up, then settle. Wins over alert while it runs; afterwards she returns to alert if a target is still hovered or focused, otherwise to sleep.
- **Sitemap link hover/focus:** colour `--rust`, 1.5px underline at 4px offset.
- **Legal link hover:** colour `--ink`.
- **Focus-visible:** 2px `--ink` outline, 3px offset, 4px radius; the input uses a 2px offset.
- **Button hover:** `--rust-hover`; **active:** scale .97.
- **Form success / error:** status line text as in Reference behaviour 7, in `--ink` at 14px; the field keeps its border colour (no red, the line explains).

## Accessibility

- The cat is `role="img"` with `<title>` "Biscuit, the shop cat, asleep along the top of the sitemap". The "z" strokes are `aria-hidden`. She is decoration that responds; nothing is only reachable through her.
- Every behaviour that hover triggers also runs on `focus`, and the tab order is page link, phone, sitemap, field, button, legal links.
- The newsletter field has a visible `<label>`, `type="email"`, `autocomplete="email"`; the result is announced through `role="status" aria-live="polite"`.
- "z" letters are SVG strokes, not text, so fading them never creates low-contrast text.
- Contrast: `--ink` on `--kraft` 11.5:1, `--ink-2` 6.5:1, `--rust` 4.7:1 on kraft and 5.5:1 on the page, button text 5.9:1, input border 4.8:1 on kraft and 6.1:1 on its own fill.
- Hit targets: field and button 46px tall; on phones sitemap links get 8px vertical padding (about 39px rows) and legal links stack.

## Responsive rules

- ≥ 1280: as specified.
- 1081 to 1279: same grid; the page tail headline scales with `5.4vw`.
- ≤ 1080: grid becomes 2 columns (brand, sitemap); the newsletter spans both on its own row.
- ≤ 640: gutters 20px; page tail stacks; footer is one column; `.map` padding-top 122px, cat 236px wide centred (`left: 50%; margin-left: -112px`), shelf at 107px; sitemap 2 columns with About spanning both and its links in 2 columns; legal row becomes a column. Nothing scrolls sideways at 390.
- Keep the cat on every size. Never hide her on phones; she shrinks and moves above the links.

## Acceptance checklist

**Always**

- [ ] The character is one inline SVG with a displaced, wobbly ink line, sitting exactly on a drawn line that is the top edge of the link columns.
- [ ] Idle breathing and the rising "z" loop calmly (4.2s) and stop while the character is alert.
- [ ] Hover and keyboard focus produce the same alert pose, and the pupils point toward the element that triggered it.
- [ ] Clicking a link, the character, or the newsletter button plays one wake-and-stretch sequence that ends back in the resting pose; repeated clicks restart it.
- [ ] Reduced motion removes all tweening and snaps between poses.
- [ ] The footer has address, hours, a sitemap, a labelled newsletter field with a ≥ 3:1 border on the input itself, and a legal row.
- [ ] Footer fills to the bottom of the viewport on the first frame.
- [ ] At 390 the drawing stays (smaller, above the links), taps trigger it, and nothing scrolls sideways.

**This demo**

- [ ] Shop is Little Oolong, 23 Mill Yard, Hebden Bridge; the cat is Biscuit, ginger tabby `#E7A35E` with `#B86A2E` stripes.
- [ ] Cat is 340px wide on desktop, 236px on phones.
- [ ] Sitemap columns Shop (5), Visit (4), About (4); newsletter "The Steeping Letter" with button "Sign me up" in `#A3401E`.
- [ ] Stretch lasts 2.6s; head lift is 15px with up to 12deg tilt.

## Implementation notes

**Aim the eyes from real geometry.** Measure the element and an anchor inside the drawing, normalise the vector, and feed it to CSS variables. Using a fraction of the SVG's box keeps it scale independent.

```js
function look(el) {
  const r = el.getBoundingClientRect(), e = cat.getBoundingClientRect();
  const ex = e.left + e.width * .2, ey = e.top + e.height * .62;   // between the eyes
  const dx = r.left + Math.min(r.width, 80) / 2 - ex, dy = r.top + r.height / 2 - ey;
  const d = Math.hypot(dx, dy) || 1;
  cat.style.setProperty('--px', (dx / d * 2.4).toFixed(2) + 'px');
  cat.style.setProperty('--py', (dy / d * 1.8).toFixed(2) + 'px');
  cat.style.setProperty('--tilt', Math.max(-12, Math.min(12, dx / 30)).toFixed(1) + 'deg');
}
```

**Pivot SVG parts in viewBox units.** Set `transform-box: view-box` and give each part a `transform-origin` in viewBox pixels: the head at the neck (`100px 104px`), the torso at its base (`150px 116px`), the ear at its root (`92px 62px`). Using `fill-box` instead makes the head pivot around its own centre and float away from the body.

**Hand-drawn line and tube tail.** One filter on the whole drawing gives every stroke the same tremble; the tail is two strokes of the same path, wide ink under narrower fur, which reads as an outlined tube.

```html
<filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="7"/>
  <feDisplacementMap in="SourceGraphic" scale="2.4"/></filter>
<path class="tube"    d="M228 106 C244 108 …"/>  <!-- stroke #2B211A, width 11 -->
<path class="tube-in" d="M228 106 C244 108 …"/>  <!-- stroke #E7A35E, width 7  -->
```

**Restart the stretch cleanly.** Remove the class, force a reflow, add it again, and clear it with a timer 100ms longer than the animation so the last frame lands.

Common mistakes: putting the "z" in `<text>` (a fading letter is low-contrast text to a checker); applying the displacement filter to the shelf line so it no longer meets the cat; forgetting `focus` listeners, which leaves keyboard users with a cat that never wakes; letting the stretch's paws slide over the Shop heading (keep the forward reach ≤ 22px).
