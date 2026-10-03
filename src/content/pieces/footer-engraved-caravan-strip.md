---
title: "Engraved caravan footer"
summary: "A dark five-column footer with a ticking local time and an email form, ending in an engraved night plain where a herder and two pack llamas walk across."
platform: web
type: section
category: footer
tags: [footer, illustration, parallax, newsletter, clock, svg]
styles: [dark, editorial, paper]
motion: rich
difficulty: 3
featured: false
published: 2026-10-03
palette: ["#17211B", "#EBE3CC", "#E0623E", "#EFE8D6"]
fonts: ["Newsreader", "Figtree"]
related: [hero-engraved-moonrise-plate, text-rise-underline-whisper, throw-loop-engraved-strip]
---

# Engraved caravan footer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from acharyasusan.com.np: the closing footer, a dark brown sitemap with a ticking local time and an email box, that melts into an engraved mountain plain where a rider and pack horse slowly cross the page. This rebuild is for **Páramo Post**, a fictional slow-travel newsletter written on foot across the high Andes. The footer has five columns on deep moss, then an SVG strip: stars, two gliding birds, three hatched ridges, grass clumps, a cairn with fluttering flags, and a herder leading two pack llamas from left to right over 95 seconds. Legs step, bodies bob, necks nod and tails swish. The far and mid ridges sink a little as the footer scrolls into view. It should feel like the last page of a travel journal. The detail worth copying is how much life comes from tiny alternating CSS keyframes (0.55s leg swings, 1.4px bobs) on top of one very slow walk.

## Reference behaviour

1. On load the page jumps (no animation) to the very bottom. The first frame shows the tail of the page above (a cream band with "Letter no. 38 is packed") and the whole footer.
2. Footer grid, 64px top padding: column 1 is the brand (sun-on-horizon mark + "Páramo Post" in 30px serif), an italic tagline, three contact rows with 18px line icons (email, place, "On the trail at 16:22"), and three 40px icon links. Columns 2–4 are link lists "Letters", "Route", "Desk". Column 5 "Say hola" has an italic line, the email form and a status line.
3. Each column heading is 12px caps with 0.18em tracking and a 38px persimmon rule under it.
4. The local time shows America/La_Paz as `HH:MM`, refreshed every 30s. The colon blinks (2s cycle, 25% at half).
5. Hovering a sitemap link brightens it from 84% to 100% oat and nudges it 3px right (250ms).
6. Hovering an icon link turns it persimmon and lifts it 2px.
7. The form is one bordered box (1.5px, 90% oat) with an italic serif input and a 48px oat square button with an arrow. Focus inside the form adds a 3px persimmon glow. Hovering the button fills it persimmon and slides the arrow 3px right.
8. Submitting an invalid email shows "That address looks short a letter or two." in pale coral and puts focus back in the field. A valid one shows "Added. Letter no. 38 leaves on the first." and clears the field. Both go through a polite live region.
9. Legal row: italic serif "© 2026 Páramo Post, carried on foot." at left, three links with slashes at right.
10. Art strip (`viewBox 0 0 1600 380`, slice, height clamp(200px, 27vw, 360px)) starts right under the legal row with a −6px overlap.
11. The caravan walks from x −220 to x 1820 in 95s, starting at −52s so it is mid-page on load. Order from front: herder (hat, poncho, staff), llama 1 tied by a thin rope, llama 2 slightly smaller.
12. Ambient loops: 46 stars twinkle, two birds glide across in 64s and 80s with 1.3s wing flaps, every grass clump sways, seven flags on a rope flutter with a 0.2s offset each.
13. Scroll parallax: progress `p = (vh − art.top) / (vh + art.height)` clamped to 0–1. The far ridge shifts `(1 − p) × 40px` down, the mid ridge `(1 − p) × 18px`. Scrolling up a little pushes the mountains down behind the plain.

## Structure

```
1280 × 800, first frame after jumping to the bottom
┌──────────────────────────────────────────────────────────────────────┐
│ (tail of page: cream band)                                            │
├──────────────────────────────────────────────────────────────────────┤ footer, moss
│ ● Páramo Post      LETTERS        ROUTE           DESK         SAY HOLA      │
│ Slow letters…      ──             ──              ──           ──            │
│ ✉ desk@paramo.post Salt flat…     Altiplano map   About…       One letter…   │
│ ⌖ Sajama, Bolivia  Condor season  Huts and hosts  Contributors [Your email |→]│
│ ◷ On the trail 16:22 Market days  Walking cal.    Photo rules  status line   │
│ ⌁ ◎ ♪              Back issues    Pack list                                  │
│ © 2026 Páramo Post, carried on foot.        Colophon / Privacy / Plain-text  │
│   ·    ·   ⌒ bird      ·        ·      ·        ⌒      ·                     │
│  /\/\/\/\  far ridge (30%, hatched)   /\/\/\/\/\/\/\                          │
│ /\/\/\/\/\/ mid ridge (62%, hatched) /\/\/\/\/\/\/\/                          │
│ ,,,, ▲ flags~~~~▌    ,,,    🦙🦙🚶 →      ,,,,   ,,,  near plain (solid oat)   │
└──────────────────────────────────────────────────────────────────────┘
```

- `section.ask` is the page tail. `footer[aria-labelledby=ft]` contains a hidden `h2#ft`.
- `div.fgrid` (CSS grid `1.45fr .85fr .85fr .85fr 1.3fr`, gaps 36px/30px): `div.brand`, three `nav.col[aria-label]`, `div.col.say`.
- `div.brand`: `a.logo`, `p.tag`, `ul.contact` (three `li`), `div.social` (three `a[aria-label]`).
- `div.say`: `h3`, `p`, `form#form[novalidate]` (hidden `label`, `input#email[type=email]`, `button.go[aria-label=Subscribe]`), `p#status[role=status][aria-live=polite]`.
- `div.legal`: a `span` and `nav[aria-label=Legal]`.
- `svg.art[aria-hidden=true]`: `g#stars`, two `g.bird-track`, `g#far`, `g#mid`, and an un-shifted near group with the plain, tufts, cairn and flags, and `g.walk` (herder + two `<use href="#llama">`).

## Tokens

```css
:root {
  /* colour */
  --moss: #17211b;            /* footer ground, hatch ink, silhouettes */
  --moss-2: #1e2a22;          /* reserve surface */
  --oat: #ebe3cc;             /* text and ridges */
  --oat-2: rgba(235,227,204,.84);  /* links, tagline */
  --oat-3: rgba(235,227,204,.6);   /* placeholder, status */
  --line: rgba(235,227,204,.16);
  --accent: #e0623e;          /* persimmon: rules, sun mark, flags, hover */
  --page: #efe8d6;            /* the page above the footer */
  --ink: #17211b;             /* text on the page above */
  --ok: #f0a184;              /* success status */
  --bad: #f4b9a6;             /* error status */

  /* type */
  --serif: "Newsreader", Georgia, serif;
  --sans: "Figtree", system-ui, sans-serif;

  /* layout */
  --wrap: 1080px;
  --pad: clamp(20px, 4.5vw, 36px);
  --art-h: clamp(200px, 27vw, 360px);

  /* motion */
  --ease: cubic-bezier(.22, 1, .36, 1);
  --walk: 95s;      /* one crossing */
  --stride: .55s;   /* one leg swing (alternate) */
}
```

Footer background also carries `radial-gradient(ellipse 60% 70% at 85% 0%, rgba(224,98,62,.12), transparent 60%)`, a faint warm glow in the top right.

Art numbers (viewBox 1600×380):

| Thing | Value |
|---|---|
| Far ridge | baseline 230, amp 140, step ~80, oat 30% + 5px hatch at −62° |
| Mid ridge | baseline 275, amp 70, step ~90, oat 62% + 7px hatch at −28° |
| Near plain | baseline 312, amp 14, step ~140, solid oat + 9px hatch at 18° (20%) |
| Stars | 46 in the top 150 units, r 0.7–1.7 |
| Grass clumps | 52, y 322–378, scale 0.7 + (y−322)/40, five strokes each |
| Cairn + flags | at 330,300; poles 70 and 64 tall, 160 apart; seven 10×12 flags |
| Caravan | ground y 324, scaled 1.22; herder at 0, llama 1 at −70, llama 2 at −150 (×0.92) |

## Typography

| Role | Family | Size | Weight | Line-height | Letter-spacing | Case |
|---|---|---|---|---|---|---|
| Wordmark | Newsreader | 30px | 500 | 1 | −0.025em | Title |
| Tagline | Newsreader italic | 17px | 400 | 1.5 | 0 | Sentence |
| Column heading | Figtree | 12px | 650 | 1 | 0.18em | UPPER |
| Sitemap link | Newsreader | 16.5px | 400 | 1.35 | 0 | Sentence |
| Contact rows | Figtree | 14.5px | 400 (time 650, tabular) | 1.6 | 0 | Sentence |
| Form line | Newsreader italic | 16px | 400 | 1.5 | 0 | Sentence |
| Input | Newsreader italic | 16px | 400 | 1.2 | 0 | Sentence |
| Status | Figtree | 13px | 400 | 1.6 | 0 | Sentence |
| Legal | Newsreader italic | 15px | 400 | 1.4 | 0 | Sentence |
| Page-tail kicker | Figtree | 11px | 650 | 1 | 0.2em | UPPER |
| Page-tail h2 | Newsreader | clamp(30px, 4vw, 44px) | 400 | 1.1 | −0.02em | Sentence |

## Motion

| Element | Trigger | Property | From → to | Duration | Easing | Delay / repeat | Reduced motion |
|---|---|---|---|---|---|---|---|
| Caravan (`.walk`) | always | translateX | −220px → 1820px | 95s | linear (constant walk) | −52s, infinite | parked at x 980 |
| Bodies (`.bob`) | always | translateY | 0 → −1.4px | 0.55s | ease-in-out | alternate; llama 2 −0.2s | static |
| Legs (`.leg`) | always | rotate from top | −16° → 16° | 0.55s | ease-in-out | alternate; `.b` legs alternate-reverse | static |
| Llama neck | always | rotate from base | −3° → 3° | 1.1s | ease-in-out | alternate | static |
| Llama tail | always | rotate from root | −10° → 12° | 1.6s | ease-in-out | alternate | static |
| Birds | always | translate | (−80, y) → (1700, y − 22) | 64s / 80s | linear | −20s / −58s | parked at x 420 / 1150 |
| Wings | always | scaleY | 1 → 0.4 | 1.3s | ease-in-out | alternate | static |
| Stars | always | opacity | 0.2 ↔ 0.9 | 3–6s | ease-in-out | random | static |
| Grass | always | skewX from bottom | −3° → 3° | 5.5s / 7s | ease-in-out | alternate, half at −3s | static |
| Flags | always | skewY + scaleX from left | −7° → 7°, 1 → 0.88 | 1.4s | ease-in-out | −0.2s per flag | static |
| Far / mid ridge | scroll | translateY | (1 − p) × 40 / 18 px | 150ms | linear smoothing | rAF throttled | none |
| Clock colon | always | opacity | 1 → 0.25 | 2s | steps(1) | infinite | solid |
| Sitemap link | hover | color, translateX | 84% → 100%, 0 → 3px | 200 / 250ms | `--ease` | — | instant |
| Icon link | hover | color, translateY | → persimmon, −2px | 200 / 250ms | `--ease` | — | instant |
| Form button | hover | background, arrow | oat → persimmon, arrow +3px | 200 / 250ms | `--ease` | — | instant |

## States

- **Sitemap links**: rest 84% oat; hover 100% oat + 3px right; focus-visible persimmon 2px outline.
- **Contact email link**: hover underlines with a 3px offset.
- **Form**: rest border 90% oat on 4% oat fill. `:focus-within`: full oat border + `0 0 0 3px rgba(224,98,62,.35)`. The input itself has no outline (the box shows focus).
- **Form button**: rest oat with moss arrow; hover persimmon with oat arrow.
- **Status**: empty (22px reserved so the layout does not jump). Error: "That address looks short a letter or two." in `--bad`. Success: "Added. Letter no. 38 leaves on the first." in `--ok`.
- **Legal links**: hover full oat with underline.
- **Clock**: shows `--:--` until the script runs, then `HH:MM`.

## Accessibility

- The art SVG is decorative: `aria-hidden="true"`, `focusable="false"`.
- The footer is labelled by a visually hidden `h2`. Each sitemap column is a `nav` with its own `aria-label`; the legal links are a `nav[aria-label=Legal]`.
- Icon-only links have labels ("Feed", "Photo log", "Audio letters"). The submit button is labelled "Subscribe".
- The email input has a real (hidden) `label`, `type="email"` and `autocomplete="email"`. The form uses `novalidate` and does its own check so the message is in the page voice.
- The status line is `role="status"` with `aria-live="polite"`. The clock is `aria-live="off"` so it never interrupts.
- Contrast: oat on moss about 13:1; 84% oat links about 10:1; status coral about 8:1.
- Targets: icon links 40×40, form button 48px wide by the full field height (about 46px).
- Tab order: logo, email link, three icon links, Letters, Route, Desk links, email input, Subscribe, legal links.

## Responsive rules

- **≥ 1280**: five columns as above.
- **1024**: same, columns narrow.
- **≤ 1000**: three columns. Brand and "Say hola" span the full width; the three link lists sit in a row between them.
- **≤ 600**: two columns with 32px/20px gaps. Brand and form are full width, link lists pair up. The legal row stacks.
- **375**: the art strip drops to its 200px minimum and crops evenly at the sides, so the caravan may be off-stage for part of its walk. That is fine. No horizontal scroll.
- The art always keeps its bottom edge (slice, YMax), so the plain meets the page bottom.

## Acceptance checklist

**Always**
- [ ] Footer opens at the bottom of the page on load, with no scroll animation.
- [ ] Five columns at desktop; each heading has a 38px accent rule under it.
- [ ] Local time uses `Intl.DateTimeFormat` with a fixed `timeZone`, refreshes every 30s, and uses tabular numbers.
- [ ] Form shows an error and success message through a polite live region; invalid input returns focus to the field.
- [ ] The art strip is one SVG with three hatched ridges and a solid near plain; ridges are fill + pattern.
- [ ] The caravan crosses in 95s; legs swing ±16° every 0.55s with front and back pairs in opposite phase.
- [ ] Far and mid ridges shift on scroll by up to 40px and 18px.
- [ ] Animated SVG parts placed with a `transform` attribute get the animation on an inner element, never on the positioned one.
- [ ] Reduced motion: nothing moves, the caravan is parked mid-plain, birds parked, colon solid.
- [ ] No horizontal scroll at 375px.

**This demo**
- [ ] Brand reads "Páramo Post" with a persimmon sun mark.
- [ ] Clock row reads "On the trail at HH:MM" in America/La_Paz time.
- [ ] Columns are Letters, Route, Desk and Say hola.
- [ ] The caravan is one herder and two pack llamas with persimmon-strapped packs.

## Implementation notes

1. **A walk cycle is three tiny loops inside one slow loop.** The track moves at constant speed; inside it, the body bobs and the legs swing on the same 0.55s beat. Front-left and back-right legs share a phase; the other two run `alternate-reverse`. Use `transform-box: fill-box` so each leg rotates from its own top.

```css
.walk { animation: walk 95s linear -52s infinite; }
@keyframes walk { from { transform: translateX(-220px) } to { transform: translateX(1820px) } }
.bob { animation: bob .55s ease-in-out var(--dl, 0s) infinite alternate; }
@keyframes bob { to { transform: translateY(-1.4px) } }
.leg { transform-box: fill-box; transform-origin: 50% 0;
       animation: step .55s ease-in-out var(--dl, 0s) infinite alternate; }
.leg.b { animation-direction: alternate-reverse; }
@keyframes step { from { transform: rotate(-16deg) } to { transform: rotate(16deg) } }
```

2. **One llama symbol, two llamas.** Define the llama once as a `<symbol>` and place it twice with `<use>`. Descendant selectors like `.second .leg` do not reach into a `<use>` copy, but custom properties do inherit. Offset the second animal with a variable.

```html
<g transform="translate(-70 0)"><use href="#llama"/></g>
<g transform="translate(-150 1) scale(.92)" style="--dl:-.2s"><use href="#llama"/></g>
```

3. **Scroll parallax only while the strip is on screen.** Throttle with rAF and skip the work when the art is out of view.

```js
const par = () => {
  ticking = false;
  const r = art.getBoundingClientRect(), vh = innerHeight || 1;
  if (r.top > vh || r.bottom < 0) return;
  const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
  far.style.transform = `translateY(${((1 - p) * 40).toFixed(1)}px)`;
  mid.style.transform = `translateY(${((1 - p) * 18).toFixed(1)}px)`;
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(par); } }, { passive: true });
```

Give the ridge groups `transition: transform .15s linear` so the shift is smooth between frames.

4. **Grass that sways in place.** Put the random position on a `<g transform="translate(x y) scale(k)">` and the `.sway` class on the `<use>` inside it. If the class sits on the positioned element, the CSS transform wipes the attribute and every clump stacks at 0,0.

5. **The local clock.** Format in the place's own time zone, not the visitor's, and wrap the colon so it can blink without re-rendering the digits every second. A 30s refresh is enough for `HH:MM`.

```js
const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/La_Paz', hour: '2-digit', minute: '2-digit',
});
const tick = () => {
  const [h, m] = fmt.format(new Date()).split(':');
  timeEl.innerHTML = `${h}<span class="c">:</span>${m}`;
};
tick(); setInterval(tick, 30000);
```

6. **Open at the bottom.** A footer demo should start in its best state. Jump with `scrollTo(0, document.documentElement.scrollHeight)` once immediately and again on `load` (fonts change the height). Do not use smooth scrolling for this jump.

7. **Silhouettes, not outlines.** Every figure in the plain is a solid moss shape on the oat ground. The only colour inside the art is the persimmon pack strap and three of the seven flags. Keep it that way; more colour breaks the engraving look.

Common mistakes: making the walk faster than about 60s (it turns into a cartoon), forgetting to reserve height for the status line, and letting the art strip shrink below 200px on phones.
