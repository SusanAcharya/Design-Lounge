<!-- Design Lounge Nº 066 · "Sticky split scroll story" · www.designlounge.live -->

# Sticky split scroll story

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A long-form feature ("Aster Observatory · One night on Skarvfjell") split in two: the left half is four chapters of text, each a full viewport tall, with a numbered rail that tracks progress; the right half is a `position: sticky` illustration of the sky over the observatory — gradient layers, a sun/moon disc, a ridge line, a small dome — that crossfades and moves as each chapter crosses the middle of the viewport. The page's accent colour (kickers, italic phrases, rail marker, disc) shifts with the chapter: ochre at dusk, blue-grey at midnight, apricot at dawn, sage at noon. The mechanism worth copying is that all visual state hangs off one attribute, `data-ch` on `<body>`, set by an IntersectionObserver with a 45 % inset root margin.

## Structure

```
1280 × 800 (page scrolls; total height ≈ 4 × 100vh + intro)
┌──────────────────────────────────┬─────────────────────────────────────┐
│ 01│ ASTER OBSERVATORY · ONE NIGHT…│                                     │
│ 02│                               │   gradient layer (active chapter)   │
│ 03│  CHAPTER ONE · DUSK           │            stars (ch 2)             │
│ 04│  The dome opens at 19:42.     │                     ● disc          │
│   │  paragraph (44ch)             │        ▲▲  ridge  ▲▲  ◠ dome        │
│   │  paragraph                    │  ────────────────────────────────── │
│   │  19:42   −3.4 °C   61 %       │  19:42 LOCAL          DUSK · SUN…   │
│   │  (next chapter below, 100vh)  │  (sticky, 100vh)                    │
└──────────────────────────────────┴─────────────────────────────────────┘
 left column: padding 0 72px 0 96px; rail at left −60px, top 44px
 right column: 1px left hairline; HUD at 32px insets, 28px from bottom
```

- `<body data-ch="1">` → `.wrap` (`grid-template-columns: 1fr 1fr; min-height: 100%`).
- `.text`: `.rail` (`position: sticky; top: 0; height: 0`) containing an `<ol>` of four anchor links; `.intro` line; four `<section class="ch" id="cN" data-n="N">` each with `.k` kicker, `<h2>` with `<em>`, two `<p>`, and `.fig` (three figures with `<small>` captions).
- `<aside class="visual" aria-label="…">` (`position: sticky; top: 0; height: 100vh; overflow: hidden`): four `.layer` gradient divs, `.stars`, `.disc`, `.ground` (clip-path ridge), `.dome` (with `::after` slit), `.hud`.

## Motion

| Element        | Trigger             | Property             | From → To                                    | Duration | Easing       |
|----------------|---------------------|----------------------|----------------------------------------------|---------:|--------------|
| `.layer.lN`    | `data-ch` change    | opacity              | 1 → 0 (old) and 0 → 1 (new), simultaneously  | 800ms    | `--ease`     |
| `.stars`       | ch 2 in / out       | opacity              | 0 ↔ .9                                       | 800ms    | `--ease`     |
| `.disc`        | `data-ch` change    | transform            | ch1 `translate(120px,150px) scale(1)` → ch2 `translate(−160px,−180px) scale(.45)` → ch3 `translate(−40px,120px) scale(.8)` → ch4 `translate(90px,−220px) scale(.6)` | 1000ms | `--ease-out` |
| `.disc`        | `data-ch` change    | background, box-shadow | accent ↔ `--moon` ↔ `--sun-noon`; glow 80px/10px → 60/6 → 90/20 → 100/30 | 800ms | `--ease` |
| `.dome::after` | `data-ch` change    | rotate               | −40° → −70° → −20° → 0°                      | 1000ms   | `--ease`     |
| `.k`, `h2 em`, rail marker | `data-ch` change | color            | previous accent → new accent                 | 800ms / 160ms (rail) | `--ease` |
| `body`         | `data-ch` change    | background           | unchanged by default; hook available for tinting | 800ms | `--ease`     |
| rail click     | click               | scroll               | smooth scroll to chapter (`scroll-behavior: smooth` on `html`) | native | — |

Reduced motion: all transitions 1ms (state still switches), `scroll-behavior: auto`.

## States

- **Chapter active:** determined only by `data-ch`; the text sections themselves do not change style, the rail and visual do.
- **Rail link rest:** `--ink-3`, transparent 2px left border. **Hover:** `--ink-2`. **Active (`.on`):** `--accent` text and border. **Focus-visible:** 2px `--accent` outline, 2px offset.
- **Disc per chapter:** see the transform table; behind the ridge in chapters 1 and 3 (DOM order: disc before ground).
- **HUD:** text swaps instantly at the state change (`<b id="hudTime">`, `<span id="hudLabel">`).
- No loading, empty or error states.

## Accessibility

- The visual is an `<aside aria-label="Sky above the observatory, changing with each chapter">`; all its children are decorative and carry no text except the HUD, which is real text.
- Chapters are `<section>`s with `<h2>`; the rail is an `<ol>` of `<a href="#cN">` so it works without JS and appears in the tab order before the chapters.
- The IntersectionObserver only sets `data-ch`; nothing important is conveyed by colour alone (each chapter's kicker names the time of day, the HUD names it again).
- Contrast: `--ink-2` on `--bg` 9.6:1; `--ink-3` on `--bg` 4.6:1 (used at 11–12px 500 uppercase); accents on `--bg`: ochre 8.6:1, blue-grey 7.9:1, apricot 7.2:1, sage 7.6:1. HUD uses `mix-blend-mode: screen` so it stays legible on the light noon sky (ink on `#dfe6d0` ≈ 1.2:1 without the blend — if blend modes are unavailable, give the HUD a 60 % `--bg` backdrop pill).
- Smooth scrolling and all transitions respect `prefers-reduced-motion`.

## Responsive rules

- ≥ 1280: two equal columns; chapters `min-height: 100vh`.
- 1024–1279: same; headline 44px; left padding 64px.
- 768–1023: single column; the visual moves to the top (`order: -1`), 44vh tall, sticky; text scrolls beneath it; chapters lose the 100vh minimum and use 64px vertical padding; rail sits at left −36px below the visual.
- < 640: visual 36vh; headline 34px; figures wrap; rail hidden (chapters still have ids for in-page links).

## Acceptance checklist

- [ ] Layout is a two-column grid; the right column is `position: sticky; top: 0; height: 100vh; overflow: hidden`.
- [ ] Each chapter section is at least 100vh tall with 96px vertical padding and content vertically centred.
- [ ] The active chapter is tracked with an IntersectionObserver using `rootMargin: "-45% 0px -45% 0px"` and written to `data-ch` on `<body>`.
- [ ] Sky gradients crossfade by opacity over 800ms; only one layer is at opacity 1 at rest.
- [ ] The disc moves and scales between the four listed transforms over 1000ms with `cubic-bezier(.16,1,.3,1)` and changes colour over 800ms.
- [ ] Stars are visible only in chapter 2 (opacity .9).
- [ ] The accent custom property changes with `data-ch` and recolours kickers, italic phrases, rail marker, disc and dome slit.
- [ ] HUD time and label update to the chapter's values.
- [ ] Rail numbers are links that scroll to their chapter and become active immediately on click.
- [ ] Scrolling back up restores the previous chapter's visual.
- [ ] Headline is Cormorant Garamond 52px/1.02 with a max measure of 14ch; body is Karla 16px/1.6 at 44ch.
- [ ] With reduced motion, chapters still switch the visual, instantly.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state (`data-ch="1"`): rail marker on "01", kicker "Chapter one · Dusk" in ochre, headline with an italic ochre phrase, two paragraphs, three serif figures. Right: dusk gradient (violet to copper to ochre), a 180px ochre disc low-right behind the ridge, dome slit tilted −40°, HUD reads "19:42 local" and "Dusk · Sun setting".
2. Scroll until chapter two's box overlaps the middle 10 % band of the viewport: `data-ch` becomes 2. The dusk layer fades out and the midnight layer fades in (800ms); nine stars fade to 90 %; the disc travels to the upper-left, shrinks to 45 % and turns bone-white (1000ms expo-out); the dome slit rotates to −70°; the accent turns blue-grey; the HUD updates to "00:10 · Midnight · Moon in the west".
3. Chapter three: dawn gradient, stars fade out, disc returns low-centre at 80 % in apricot with a wider glow, slit −20°, HUD "04:20 · Dawn · Field low in the east".
4. Chapter four: daylight gradient, small pale disc high-right at 60 %, slit 0°, HUD "12:00 · Noon · Dome closed", accent sage.
5. Scrolling back up reverses every step; transitions run in both directions.
6. Click a rail number: the page scrolls smoothly to that chapter and the state is set immediately (so the visual leads the scroll).
7. The rail (01–04) is sticky at the top-left; the active number is in the current accent with a 2px left bar.

## Tokens

```css
:root {
  /* colour — warm near-black page, bone text, chapter accents */
  --bg: #14110f;
  --ink: #efe9df;
  --ink-2: #b7ae9f;      /* body copy */
  --ink-3: #77705f;      /* rail numbers, captions */
  --line: #2b2622;       /* hairlines */
  --c1: #d9a441;         /* dusk — ochre */
  --c2: #8fa7c9;         /* midnight — blue-grey */
  --c3: #e28a5a;         /* dawn — apricot */
  --c4: #8fae8b;         /* noon — sage */
  --accent: var(--c1);   /* re-pointed by [data-ch] */
  --moon: #e9e4d6; --sun-noon: #fff5d6; --ground: #0f0d0b;
  /* sky layers (top → bottom stops) */
  --sky-1: linear-gradient(180deg, #3a2b3f 0, #8a4a3a 55%, #d9a441 100%);
  --sky-2: linear-gradient(180deg, #05070f 0, #101a2e 60%, #1d2b45 100%);
  --sky-3: linear-gradient(180deg, #2c3a55 0, #b06a4a 60%, #f0c28a 100%);
  --sky-4: linear-gradient(180deg, #6f9fc9 0, #a9c9dc 60%, #dfe6d0 100%);

  /* type */
  --serif: "Cormorant Garamond", Georgia, serif;
  --sans: "Karla", system-ui, sans-serif;
  --fs-h2: 52px; --fs-body: 16px; --fs-fig: 30px; --fs-kicker: 12px; --fs-rail: 12px; --fs-hud: 12px;
  --measure: 44ch; --h2-measure: 14ch;

  /* layout */
  --text-pad: 0 72px 0 96px; --ch-pad: 96px 0; --rail-x: -60px; --rail-y: 44px;
  --disc: 180px; --dome-w: 64px; --dome-h: 40px; --ground-h: 34%;
  --spy-inset: 45%;   /* IntersectionObserver rootMargin top/bottom */

  /* motion */
  --t-micro: 160ms; --t-fade: 800ms; --t-move: 1000ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
[data-ch="2"] { --accent: var(--c2); }
[data-ch="3"] { --accent: var(--c3); }
[data-ch="4"] { --accent: var(--c4); }
```

## Typography

| Role          | Family             | Size | Weight     | Line-height | Tracking | Case |
|---------------|--------------------|-----:|-----------:|------------:|---------:|------|
| Chapter title | Cormorant Garamond | 52px | 500        | 1.02        | −0.015em | sentence, max 14ch, `text-wrap: balance`; `<em>` italic 500 in `--accent` |
| Body          | Karla              | 16px | 400        | 1.6         | 0        | `--ink-2`, max 44ch |
| Kicker        | Karla              | 12px | 500        | 1           | +0.16em  | UPPERCASE `--accent` |
| Figure        | Cormorant Garamond | 30px | 600        | 1           | 0        | numerals; caption Karla 11px 500 +0.10em UPPERCASE `--ink-3` |
| Intro line    | Karla              | 12px | 500        | 1           | +0.12em  | UPPERCASE; product name in `--ink` |
| Rail number   | Karla              | 12px | 500        | 1           | +0.08em  | "01"–"04" |
| HUD           | Karla              | 12px | 500        | 1           | +0.10em  | UPPERCASE; time in `--ink`, rest `--ink-2` |

## Implementation notes

**One attribute drives everything.** Observe the chapters with a root margin that leaves only the middle 10 % of the viewport, so exactly one chapter can be "current" at a time:

```js
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) set(e.target.dataset.n); });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
document.querySelectorAll('.ch').forEach(c => io.observe(c));
function set(n) {
  if (document.body.dataset.ch === String(n)) return;
  document.body.dataset.ch = n;
  links.forEach(a => a.classList.toggle('on', a.dataset.n === String(n)));
}
```

**Crossfade gradients with stacked layers**, because `background-image` gradients cannot transition:

```css
.layer { position: absolute; inset: 0; opacity: 0; transition: opacity var(--t-fade) var(--ease); }
[data-ch="1"] .l1, [data-ch="2"] .l2, [data-ch="3"] .l3, [data-ch="4"] .l4 { opacity: 1; }
.disc { transition: transform var(--t-move) var(--ease-out), background var(--t-fade) var(--ease); }
[data-ch="2"] .disc { transform: translate(-160px, -180px) scale(.45); background: var(--moon); }
```

**Ridge with `clip-path`** — one element, no SVG, and the disc sits behind it by DOM order:

```css
.ground { position: absolute; left: 0; right: 0; bottom: 0; height: 34%; background: var(--ground);
  clip-path: polygon(0 38%, 18% 30%, 34% 40%, 52% 24%, 68% 36%, 84% 22%, 100% 34%, 100% 100%, 0 100%); }
```

Common mistakes: putting `overflow: hidden` on an ancestor of the sticky column (sticky silently stops working); using `threshold: .5` instead of a root margin (tall chapters never reach 50 % visibility on short viewports); transitioning `background-image` (it snaps); animating `top/left` on the disc instead of `transform`.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
