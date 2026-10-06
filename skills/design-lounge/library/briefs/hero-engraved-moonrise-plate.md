<!-- Design Lounge Nº 238 · "Engraved moonrise hero plate" · www.designlounge.live -->

# Engraved moonrise hero plate

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from acharyasusan.com.np: the "cover plate" hero, a night landscape drawn like a book engraving (hatched ridges, a big hatched moon, outline clouds, tiny figures) with a serif headline on the dark left side. This rebuild is for **Sigrun Tollefsen**, a fictional cartographer and interface designer in Ålesund. The whole scene is one inline SVG with three hatch patterns. Layers sink at different speeds as you scroll, so the plate gets depth. The page should feel like the first page of a field journal: quiet, hand-made, a little playful. The details worth copying are the hatching (a `pattern` of one rotated line laid over a flat fill) and the timed intro: the moon rises, the two headline lines rise, and 1 second later a hand-drawn underline strokes itself under the italic word.

## Structure

```
1280 × 800 (hero is min-height 100vh; a short light section follows)
┌──────────────────────────────────────────────────────────────────────┐
│ Sigrun.                         Routes  Print shop  Field notes  Talks  Hello │ 72px header, absolute
│      ·    ·        ☁ (drift)          ·   ╭──────╮  ·                    │
│  ·            ·                         │ MOON │      ·                  │
│ Sigrun Tollefsen  CARTOGRAPHER, ÅLESUND │ r150 │                         │
│ I draw maps that                         ╰──────╯                       │
│ still work in the rain.    ← h1 92px/0.95                               │
│ ‾‾‾‾‾ drawn underline                                                    │
│ Wayfinding, trail apps…   /\  /\/\     ─────────────────── whisper note │
│ (See the routes)(Write to me) | ○ ○ ○   /\/\ far ridge (hatched)         │
│    /\/\/\/\/\/\  mid ridge (hatched)            ◆ kite        ▲ lighthouse│
│ ,,, ,  ,,  near ground + tufts   ,,     🯅 flyer    ,,     ▐█▌ ⟋ beam      │
└──────────────────────────────────────────────────────────────────────┘
```

- `header.top` (absolute, z 10) holds `a.logo`, `button.burger[aria-expanded][aria-controls=links]` and `nav#links[aria-label=Main]`.
- `section.hero[aria-labelledby=h]`: `svg.scene[aria-hidden=true]`, `div.shade`, then `div.wrap > div.grid` with the copy column and `p.note[tabindex=0]`.
- The copy column: `p.name > span`, `h1#h` with two `span.line > span` children, `p.sub`, `div.actions` (two `a.btn`, `div.socials` with three `a[aria-label]`).
- The SVG has four `g.s-layer` groups: `.s-sky` (stars, shooting star, moon, clouds), `.s-far`, `.s-mid`, `.s-near` (ground, tufts, lighthouse, kite flyer).
- `section.next` follows: a light band with a kicker and an h2, so the parallax has somewhere to scroll.

## Motion

| Element | Trigger | Property | From → to | Duration | Easing | Delay / repeat | Reduced motion |
|---|---|---|---|---|---|---|---|
| Moon group | load | transform, opacity | translateY(70px), 0 → none, 1 | 1800ms | `--ease` | once, `both` | static |
| h1 line 1 | load | transform, opacity | translateY(.35em), 0 → none, 1 | 900ms | `--ease` | 0 | visible at once |
| h1 line 2 | load | same | same | 900ms | `--ease` | 160ms | visible at once |
| Underline path | load | stroke-dashoffset | 220 → 0 | 800ms | `--ease` | 1000ms | drawn at once |
| Stars | always | opacity | 0.25 ↔ 0.95 | 3–5.5s each | ease-in-out | random 0–3s, infinite | static |
| Shooting star | always | transform, opacity | (260,80) → (640,230), visible 2–8% of cycle | 11s | ease-in | 2.4s, infinite | hidden |
| Clouds | always | translate | −320px → 1900px | 95s / 130s | linear (ambient drift only) | second starts at −55s | static |
| Lamp | always | opacity | 0.85 → 1 → 0.65 → 0.85 | 2.4s | ease-in-out | infinite | static |
| Beam | always | rotate around lamp | −14° → 10° | 7s | ease-in-out | alternate | static |
| Kite + string | always | rotate around hand | −3° → 2.5° → −1° | 4.6s | ease-in-out | alternate | static |
| Kite tail | always | skewX | −14° → 12° | 1.2s | ease-in-out | alternate | static |
| Tufts (every 3rd) | always | skewX from bottom | −3° → 3° | 5.5s | ease-in-out | alternate | static |
| Sky / far / mid / near | scroll | translateY | scrollY × 0.35 / 0.22 / 0.12 / 0.04 px | per frame | none (rAF) | only while scrollY ≤ hero height | no parallax |
| Nav link underline | hover | scaleX | 0 → 1 from left | 300ms | `--ease` | — | instant |
| Buttons | hover | translateY, background | 0 → −2px | 250ms / 200ms | `--ease` | — | instant |
| Whisper note | hover / focus | color, border-color | 30% → 94% | 500ms | ease | — | instant |

## States

- **Primary pill** (`See the routes`): bone fill, night text. Hover: marigold fill and border, lift 2px. Active: back to 0 and scale 0.98.
- **Ghost pill** (`Write to me`): transparent with a 1px bone-faint border. Hover: bone border, 6% bone fill, lift 2px.
- **Icon links**: 44px circles with a bone-faint border at 72% bone. Hover: full bone icon, marigold border, `--accent-soft` fill.
- **Nav links**: bone-dim. Hover: bone, plus a 1.5px marigold line that grows from the left.
- **Whisper note**: 30% bone by default. Hover or `:focus-visible`: 94% bone and a full marigold top rule. On touch devices (`hover: none`) it rests at 64% so it can still be read.
- **Menu button** (< 760px): `aria-expanded` false/true. Open shows the panel (night-2 fill, 1px bone-faint border, 16px radius, links 16px with 12px vertical padding).
- **Focus-visible** everywhere: 2px marigold outline, 3px offset.

## Accessibility

- The SVG scene is decorative: `aria-hidden="true"` and `focusable="false"`. Nothing in it is interactive.
- `section.hero` is labelled by the h1. The h1 is real text; the underline SVG inside it is `aria-hidden`.
- Icon-only links carry `aria-label` ("Field journal", "Print shop", "Monthly letter"). Their SVGs are `aria-hidden`.
- The whisper note has `tabindex="0"` so keyboard users can reveal it. It is a `p`, not a button, because it does nothing.
- Menu button: `aria-controls="links"` and `aria-expanded` kept in sync. Escape closes the panel. Clicking any link closes it.
- Contrast: bone on night is about 14:1. Bone-dim paragraph on night is about 9:1. Night text on the bone pill is about 14:1. The whisper note at rest is decorative on purpose (low contrast) and reaches full contrast on hover or focus. Keep its words in the page somewhere else if they matter.
- Hit targets: pills 52px tall, icon links and menu button 44px.
- Tab order: logo, menu button (mobile only), nav links, primary pill, ghost pill, three icon links, whisper note.

## Responsive rules

- **≥ 1280**: as described. The wrap is 1080px wide and centred.
- **1024**: same layout. The scene crops evenly at both sides (slice), the moon stays right of the copy.
- **≤ 980**: the whisper note is hidden and the grid becomes one column.
- **≤ 760**: links fold into the menu button. The hero switches to centred text, aligned to the top with 120px top padding. The shade becomes a top-to-bottom gradient (70% → 35% → 0) so the text reads over the moon. Pills become `flex: 1 1 140px` with 16px side padding and no wrapping. Icon links move to their own centred row with no divider.
- **375**: h1 lands at 46px. The two pills sit side by side. The moon shows as a big disc at the right edge behind the paragraph. No horizontal scroll.

## Acceptance checklist

**Always**
- [ ] The scene is one SVG with `preserveAspectRatio="xMidYMax slice"`; the ground touches the bottom edge at every width.
- [ ] Ridges use a flat fill plus a hatch pattern made of a single rotated line; three different hatch angles (−62°, −28°, 18°).
- [ ] Headline line 2 starts rising 160ms after line 1; both take 900ms with `cubic-bezier(.22,1,.36,1)`.
- [ ] The underline under the italic word starts drawing at 1000ms and finishes by 1800ms.
- [ ] Scrolling moves sky, far, mid and near layers at 0.35, 0.22, 0.12 and 0.04 × scrollY, and stops updating past the hero height.
- [ ] Whisper note is faint at rest and reaches full contrast on hover and on keyboard focus.
- [ ] Menu button below 760px toggles `aria-expanded` and closes on Escape.
- [ ] All icon links are 44px and have labels; focus rings are visible on every control.
- [ ] With reduced motion: no loops, no parallax, headline and underline fully shown on the first frame.
- [ ] No horizontal scroll at 375px.

**This demo**
- [ ] Wordmark reads "Sigrun." with a marigold full stop.
- [ ] Headline reads "I draw maps that / *still* work in the rain." with "still" in marigold italic.
- [ ] Paragraph contains bold "42" and "1.2M".
- [ ] The scene includes a lighthouse with a sweeping beam and a figure flying a marigold kite.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 1280×800: a teal-black night (`--night`) fills the viewport. A 72px header sits on top: the wordmark "Sigrun." (marigold full stop) at left, five links at right (Routes, Print shop, Field notes, Talks, Hello).
2. The SVG scene covers the hero (`viewBox 0 0 1600 900`, `preserveAspectRatio="xMidYMax slice"`), so the ground always touches the bottom edge and the sides crop on narrow screens.
3. Scene, back to front: about 70 twinkling stars, a shooting star, the moon (r 150 at 1080,250, with a soft radial glow r 260, hatch overlay and four faint craters), two outline clouds drifting left to right, a far ridge (bone at 30% plus fine hatch), a mid ridge (bone at 60% plus medium hatch), the near ground (solid bone plus a light hatch), 46 grass tufts, a lighthouse with a flickering lamp and a sweeping beam, and a stick figure flying a marigold kite.
4. A shade sits between the scene and the copy: a left-to-right gradient from 84% night to 0% at 64% width, plus a top fade, so the copy reads on the left while the moon stays bright on the right.
5. Copy block, left column (max 40rem), vertically centred: the name line "Sigrun Tollefsen" in 24px serif with the role "CARTOGRAPHER, ÅLESUND" in 11px marigold caps next to it. Then the headline in two lines: "I draw maps that" / "*still* work in the rain." Then a 16.5px paragraph with two bold numbers. Then the actions row.
6. Actions row: a bone pill "See the routes" with a compass icon, a ghost pill "Write to me", a 1px vertical divider, and three 44px round icon links (Field journal, Print shop, Monthly letter).
7. Right column, aligned to the bottom of the copy: a "whisper" note in italic serif at 30% opacity with a marigold hairline on top. Hover or focus brings it to 94% opacity and a full marigold rule over 500ms.
8. On load: the moon rises 70px and fades in (1.8s). Headline line 1 rises 0.35em and fades in (0.9s). Line 2 does the same 160ms later. At 1000ms the underline path under "still" draws from left to right (0.8s).
9. Loops: stars twinkle (opacity 0.25 → 0.95, 3–5.5s each, random delays). The shooting star crosses every 11s, starting 2.4s after load. Clouds drift across in 95s and 130s. The lamp flickers (2.4s). The beam sweeps −14° → 10° (7s, alternate). The kite and its string swing around the flyer's hand (4.6s). The kite tail ripples (1.2s). Every third tuft sways ±3° (5.5s).
10. Scrolling: until the page has scrolled one hero height, the layers move down at different rates: sky 0.35 × scrollY, far ridge 0.22, mid ridge 0.12, near ground 0.04. The copy scrolls normally, so the sky seems to lag behind.
11. Below 760px the links fold into a 44px round menu button. It opens a panel under the header and closes on link click or Escape.

## Tokens

```css
:root {
  /* colour */
  --night: #0e1a1c;          /* page and sky */
  --night-2: #152427;        /* mobile menu panel */
  --bone: #e9e4d4;           /* text on dark, moon, ridges */
  --bone-dim: rgba(233,228,212,.72);   /* paragraph, nav links */
  --bone-faint: rgba(233,228,212,.2);  /* outlines, dividers */
  --accent: #f2a93b;         /* marigold: italic word, underline, kite, lamp, role caps */
  --accent-soft: rgba(242,169,59,.14); /* icon hover fill */
  --hatch-ink: #0e1a1c;      /* hatch lines are drawn in the night colour */

  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Manrope", system-ui, sans-serif;
  --fs-h1: clamp(46px, 7.4vw, 92px);
  --fs-name: 24px;
  --fs-sub: 16.5px;
  --fs-btn: 14.5px;
  --fs-nav: 14px;
  --fs-caps: 11px;
  --fs-note: 17px;

  /* layout */
  --wrap: 1080px;
  --pad: clamp(20px, 4.5vw, 36px);
  --header-h: 72px;
  --btn-h: 52px;
  --icon-btn: 44px;

  /* motion */
  --ease: cubic-bezier(.22, 1, .36, 1);   /* expo-like out, used for every reveal */
  --t-line: 900ms;
  --t-line-stagger: 160ms;
  --t-draw: 800ms;
  --t-draw-delay: 1000ms;
  --t-moon: 1800ms;
}
```

Scene numbers (SVG user units, viewBox 1600×900):

| Thing | Value |
|---|---|
| Far ridge | baseline y 600, peaks up to 210 units tall, step ~70 (×0.6–1.4 jitter), fill bone 30% + `hatch-far` |
| Mid ridge | baseline y 690, amp 110, step ~80, fill bone 60% + `hatch` |
| Near ground | baseline y 776, amp 22, step ~130, solid bone + `hatch-near` |
| `hatch-far` | 5×5 tile, one vertical line 0.9px at 50% opacity, rotated −62° |
| `hatch` | 7×7 tile, line 1.1px at 55%, rotated −28° |
| `hatch-near` | 9×9 tile, line 0.8px at 22%, rotated 18° |
| `hatch-moon` | 6×6 tile, line 1px at 28%, rotated 35° |
| Moon | centre 1080,250, r 150; glow r 260 radial bone 30% → 7% → 0 |
| Stars | 70, x 0–1600, y 0–480, r 0.8–1.9 |
| Tufts | 46, y 790–895, scale 0.7 + (y−790)/70 (bigger near the bottom) |
| Lighthouse | tower 1380–1412 at y 664–760, lamp r 5 at 1396,655 |
| Kite flyer | figure at x 760, hand at 778,736, kite centre 880,590 |

## Typography

| Role | Family | Size | Weight | Line-height | Letter-spacing | Case |
|---|---|---|---|---|---|---|
| Headline h1 | Instrument Serif | clamp(46px, 7.4vw, 92px) | 400 | 0.95 | −0.025em | Sentence |
| Italic word | Instrument Serif italic | inherit | 400 | inherit | inherit | lower, marigold |
| Name line | Instrument Serif | 24px | 400 | 1.2 | 0 | Title |
| Role caps | Manrope | 11px | 700 | 1 | 0.18em | UPPER, marigold |
| Paragraph | Manrope | 16.5px | 400 (bold numbers 700) | 1.6 | 0 | Sentence |
| Buttons | Manrope | 14.5px | 700 | 1 | 0 | Sentence |
| Nav links | Manrope | 14px | 500 | 1.6 | 0 | Title |
| Wordmark | Instrument Serif | 28px | 400 | 1 | −0.02em | Title + marigold "." |
| Whisper note | Instrument Serif italic | 17px | 400 | 1.5 | 0 | Sentence |
| Next-section h2 | Instrument Serif | clamp(36px, 4.6vw, 52px) | 400 | 1.05 | −0.02em | Sentence |

The h1 has `text-shadow: 0 2px 30px rgba(14,26,28,.6)` so it stays readable where it crosses the ridges.

## Implementation notes

1. **Hatching is a pattern over a fill, not a texture image.** Draw each ridge path twice: once with a flat fill, once with `fill="url(#hatch)"`. The pattern is one line, rotated with `patternTransform`, so it stays crisp at any size and costs almost nothing.

```html
<pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse"
         patternTransform="rotate(-28)">
  <line y2="7" stroke="#0e1a1c" stroke-width="1.1" opacity=".55"/>
</pattern>
<g class="s-layer s-mid">
  <path d="…ridge…" fill="#e9e4d4" opacity=".6"/>
  <path d="…ridge…" fill="url(#hatch)"/>
</g>
```

2. **Jagged ridges from a seeded generator.** Alternate a high point and a low point and jitter the step, so peaks look hand-cut but stay the same on every load. Use a tiny deterministic PRNG, never `Math.random()`, or the plate changes on each visit.

```js
let s = 7;
const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
function ridge(base, amp, step) {
  let d = `M0 900L0 ${base}`, i = 0;
  for (let x = 0; x <= 1600 + step; x += step * (.6 + rnd() * .8), i++) {
    const y = base - (i % 2 ? (.45 + rnd() * .55) * amp : rnd() * amp * .25);
    d += `L${x.toFixed(0)} ${y.toFixed(0)}`;
  }
  return d + 'L1600 900Z';
}
```

3. **Parallax through one custom property.** Write `scrollY` into `--sy` on the SVG once per animation frame; each layer multiplies it in CSS. Do not set four transforms from JS.

```css
.s-sky  { transform: translateY(calc(var(--sy, 0) * .35px)); }
.s-far  { transform: translateY(calc(var(--sy, 0) * .22px)); }
.s-mid  { transform: translateY(calc(var(--sy, 0) * .12px)); }
.s-near { transform: translateY(calc(var(--sy, 0) * .04px)); }
```

```js
let tick = false;
addEventListener('scroll', () => {
  if (tick) return; tick = true;
  requestAnimationFrame(() => {
    tick = false;
    if (scrollY <= hero.offsetHeight) scene.style.setProperty('--sy', scrollY);
  });
}, { passive: true });
```

4. **Do not put a CSS animation on an element that is positioned with a `transform` attribute.** A CSS `transform` replaces the SVG attribute, so a swaying tuft placed with `transform="translate(…)"` jumps to 0,0. Put the position on a wrapping `<g>` and the animation class on the inner `<use>`. Set `transform-box: fill-box; transform-origin: bottom center` on the sway.

5. **The underline is a path, not a border.** Use `viewBox="0 0 200 20"` with `preserveAspectRatio="none"`, place it absolutely under the word (left −3%, width 106%, height 0.18em), and set `stroke-dasharray` and starting `stroke-dashoffset` to a value longer than the path (220). Animate the offset to 0.

Common mistakes: using `ease` or `linear` for the reveals (they need the expo-like curve), letting the moon sit behind the copy on narrow screens without the vertical shade, and leaving the whisper note unreachable by keyboard.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
