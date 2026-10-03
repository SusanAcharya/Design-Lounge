<!-- Design Lounge Nº 222 · "Page transition tile wipe" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Page transition tile wipe

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A three-page site for a fictional Basel design studio, Raster: Home, Work, Studio. Clicking a nav link covers the whole screen with 24 cobalt squares that spin and grow in on a diagonal wave, holds for a beat with the next page's name on the blue, swaps the page underneath, and spins the squares out in the same direction. The new title then rises one line at a time from behind a clip. The URL hash changes on every page, and the browser's Back and Forward buttons run the same transition. The detail worth copying is direction: going forward in the nav, the wave starts top-left; going back, it starts bottom-right. The wipe always reads as moving through the site, not just covering it.

This is not `page-transition-curtain`. That piece uses two panels and letter-by-letter titles in a luxe serif. This one is a grid wipe with whole lines of grotesk type.

## Reference behaviour

1. Load: the page in the hash (`#home`, `#work` or `#studio`) renders. No hash means Home. There is no wipe on first load. The two title lines rise, then the lede and panel fade up.
2. Header (64px, 1px black rule): cobalt-and-black mark plus "Raster" on the left; nav links "01 Home", "02 Work", "03 Studio"; "Basel, CH · 47.56° N" in mono on the right. The current link is ink with an 8px cobalt square before it. Others are grey.
3. Nav links are real anchors with hash hrefs. Clicking one changes the hash. A `hashchange` listener runs the transition. Back and Forward also fire `hashchange`, so they run it too. No element on the page has an id equal to a hash, so the browser never jumps.
4. t = 0: the tiles pick their order. Forward (new page later in the nav): delay step `d = col + row`, so the top-left tile starts first. Backward: `d = (cols - 1 - col) + (rows - 1 - row)`, so the bottom-right tile starts first.
5. 0 to 660ms: each tile goes from `scale(0) rotate(-90deg)` to `scale(1.02) rotate(0)` over 380ms with `cubic-bezier(.65,0,.35,1)`, delay `d × 35ms`. On 6×4 the last diagonal is `d = 8`, so cover is complete at 280 + 380 = 660ms. Scale 1.02 hides the hairline seams between tiles.
6. 560ms: the label in the middle of the blue fades in over 160ms: "02 / 03" in 13px mono above "Work" in 72px white grotesk.
7. 800ms: the page content swaps behind the full cover. Use `document.startViewTransition(render)` when it exists, with the root view-transition animation set to `none`, so the swap commits in one frame. Without the API, call `render` directly. Focus moves to the new `<h1>` (`tabindex="-1"`, `preventScroll`).
8. 800 to 1480ms: tiles leave from `scale(1.02) rotate(0)` to `scale(0) rotate(90deg)`, same 380ms, same easing, same diagonal order. They keep turning the same way they came in. The label fades out over 160ms.
9. Title lines: each line sits in an `overflow: hidden` box and rises from `translateY(105%)` to 0 over 700ms with `cubic-bezier(.16,1,.3,1)`, delay `200ms + line × 90ms` after the swap. Line 0 starts at 1000ms, line 1 at 1090ms, the last lands at 1790ms.
10. Lede and panel: opacity 0 → 1 over 400ms and `translateY(10px)` → 0 over 500ms, delay 380ms after the swap.
11. 1480ms: tiles snap back to their hidden state with transitions off. The lock is released.
12. A hash change during a transition is queued. Only the last one runs, right after the current transition ends. Clicking the current page does nothing.
13. Reduced motion: no tiles. With the View Transitions API the swap runs as a 240ms root crossfade. Without it, `<main>` fades to 0 over 180ms, swaps, and fades back over 180ms. Title lines, lede and panel appear with no movement. Focus still moves to the `<h1>`.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ ■ Raster   ▪01 Home   02 Work   03 Studio            Basel, CH · 47.56° N│ header 64, 1px #0a0a0a rule
├──────────────────────────────────────────────────────────────────────┤
│ 01 / 03                                          STUDIO FÜR GESTALTUNG │ mono 12, padding 40 48 0
│                                                                        │
│ Form follows                                         ← 168px, line 0   │ 12-col grid, gap 24
│ the grid.          ← "grid." cobalt                  ← line 1          │
│                                                                        │
│ We design posters, signage   │ ───────────────────────────────────────│ lede cols 1–5
│ and type systems on a…       │ 1994        │ 412          │ 06        │ panel cols 7–12
│                              │ Founded…    │ Posters…     │ People…   │ 40 above footer
├──────────────────────────────────────────────────────────────────────┤
│ Raster GmbH · Klybeckstrasse 141 · 4057 Basel  Posters, signage, type… │ footer 48, 1px #dcdcdc rule
└──────────────────────────────────────────────────────────────────────┘
 overlay: fixed, inset 0, z 20, grid 6 × 4 tiles (213 × 200 each), pointer-events none
```

- `<header>`: `.logo` link to `#home` with an inline SVG mark (cobalt circle r10, black 10×10 square on its top-left) and the word. `<nav aria-label="Primary">` with three `<a href="#…" data-page>`; each has a `<small>` mono number. The current one carries `aria-current="page"`.
- `<main>`: a 12-column grid with rows `auto auto 1fr`. Children: `.idx` (index and kicker), `<h1 tabindex="-1">` with one `<span class="ln"><span style="--i:n">…</span></span>` per line, `.lede`, `.panel`.
- `<footer>`: two mono strings.
- `.wipe`: `aria-hidden="true"`, `position: fixed; inset: 0; z-index: 20; pointer-events: none`, a CSS grid of 24 empty `<i>` tiles plus one centred `<p>` label with `z-index: 1`.
- A visually hidden `role="status"` paragraph announces "Work page" after each swap.

Page data:

| Hash | No. | Kicker | Title lines (cobalt word) | Lede | Panel |
| --- | --- | --- | --- | --- | --- |
| home | 01 | Studio für Gestaltung | Form follows / the **grid.** | We design posters, signage and type systems on a twelve-column grid that has not changed since 1994. | 3 stats: 1994 Founded in Basel, 412 Posters printed, 06 People, one table |
| work | 02 | Selected work, 2021 to 2026 | Thirty years / of **posters.** | Every sheet starts as a pencil grid on A0 paper. Five recent projects, newest first. | 5 rows: 2026 Kunsthalle Rhein, Season identity · 2025 Basel Jazz Tage, 14 posters · 2024 Regio Nord Rail, Wayfinding · 2023 Typo Bern, Type system · 2021 Museum Klang, Exhibition |
| studio | 03 | Klybeckstrasse 141, third floor | Six people, / one **table.** | We work at one long table in a former print shop. Visits by appointment, Tuesday to Thursday. | 6 people in 2 columns: Anna Reiter Partner, type · Jonas Mäder Partner, motion · Lea Frei Designer · Nico Baumann Designer · Mira Sutter Producer · Tim Vogt Studio manager |

## Tokens

```css
:root {
  /* colour: white paper, black ink, one cobalt */
  --paper: #ffffff;     /* page */
  --ink: #0a0a0a;       /* type, header rule, panel top rules */
  --ink-2: #5c5c5c;     /* nav resting, mono meta */
  --line: #dcdcdc;      /* row rules, footer rule */
  --cobalt: #1f3fff;    /* tiles, current marker, cobalt word, first stat, focus */
  --on-cobalt: #ffffff; /* label on the tiles */

  /* type */
  --sans: "Schibsted Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --title: 168px;

  /* layout */
  --pad: 48px;
  --head-h: 64px;
  --foot-h: 48px;
  --col-gap: 24px;

  /* tiles */
  --cols: 6;
  --rows: 4;
  --t-tile: 380ms;
  --stagger: 35ms;      /* per diagonal step */
  --cover-at: 660ms;    /* 8 steps × 35 + 380 */
  --swap-at: 800ms;     /* cover + 140ms hold for the label */
  --leave: 680ms;

  /* text */
  --t-line: 700ms;
  --line-gap: 90ms;
  --line-delay: 200ms;
  --block-delay: 380ms;

  /* easing */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-tile: cubic-bezier(.65, 0, .35, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Schibsted Grotesk | 22px | 800 | 1 | -0.04em | sentence |
| Nav link | Schibsted Grotesk | 15px | 500 | 40px box | 0 | sentence |
| Nav number | IBM Plex Mono | 11px | 500 | 1 | +0.04em | numerals |
| Location, footer | IBM Plex Mono | 12px | 400 | 1.5 | +0.04em | sentence |
| Index, kicker | IBM Plex Mono | 12px | 500 | 1.5 | +0.06em | UPPERCASE |
| Page title | Schibsted Grotesk | 168px | 800 | 0.92 | -0.055em | sentence |
| Lede | Schibsted Grotesk | 19px | 400 | 1.45 | 0 | sentence, max 30ch |
| Stat number | Schibsted Grotesk | 56px | 800 | 1 | -0.05em | tabular numerals |
| Row name | Schibsted Grotesk | 15px | 500 | 40px row | 0 | sentence |
| Row meta | IBM Plex Mono | 12px | 400 | 1.5 | +0.04em | sentence |
| Tile label | Schibsted Grotesk | 72px | 800 | 1 | -0.05em | sentence |
| Tile label number | IBM Plex Mono | 13px | 500 | 1 | +0.08em | numerals |

The cobalt word is the last word of the title and inherits weight 800. Do not italicise it.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Delay |
| --- | --- | --- | --- | --- | --- | --- |
| Tile | hash change | transform | scale(0) rotate(-90deg) → scale(1.02) rotate(0) | 380ms | `--ease-tile` | d × 35ms |
| Tile label | cover | opacity | 0 → 1 | 160ms | `--ease` | 560ms |
| Content | 800ms | swap | old → new | 1 frame | none (view transition animation off) | — |
| Tile | after swap | transform | scale(1.02) rotate(0) → scale(0) rotate(90deg) | 380ms | `--ease-tile` | d × 35ms |
| Tile label | after swap | opacity | 1 → 0 | 160ms | `--ease` | 0 |
| Tile | 1480ms | transform | back to scale(0) rotate(-90deg) | 0 | none | instant reset |
| Title line | after swap | translateY | 105% → 0 | 700ms | `--ease-out` | 200ms + i × 90ms |
| Lede, panel | after swap | opacity, translateY | 0, 10px → 1, 0 | 400ms / 500ms | `--ease` / `--ease-out` | 380ms |
| Nav marker | current changes | scale | 0 → 1 | 240ms | `--ease` | 0 |
| Nav link | hover | color | `--ink-2` → `--ink` | 160ms | `--ease` | 0 |

Timeline for Home → Work:

| t (ms) | Event |
| ---: | --- |
| 0 | hash is `#work`; top-left tile starts |
| 280 | bottom-right tile starts |
| 560 | label "02 / 03 Work" starts fading in |
| 660 | screen fully cobalt |
| 800 | swap, `aria-current` moves, focus on the h1, tiles start leaving top-left first |
| 1000 | title line 0 starts rising |
| 1090 | title line 1 starts |
| 1180 | lede and panel start |
| 1480 | last tile gone; reset; lock released |
| 1790 | last title line lands |

Reduced motion: no tiles. View Transitions: `::view-transition-old(root), ::view-transition-new(root) { animation-duration: 240ms }`. Fallback: `<main>` opacity 1 → 0 over 180ms, swap, 0 → 1 over 180ms. Text appears without transforms.

## States

- Nav resting: `--ink-2`, marker hidden (`scale(0)`).
- Nav hover: `--ink`.
- Nav current: `--ink`, 8px cobalt square at `scale(1)`, `aria-current="page"`.
- Focus-visible on links: `outline: 2px solid --cobalt; outline-offset: 3px`.
- `<h1>` after a transition: focused, no ring for pointer users. With keyboard focus-visible it shows a 2px cobalt ring at 6px offset.
- Transitioning: a `busy` flag. Links stay clickable; extra hash changes queue, last one wins. Do not grey out the nav.
- First load: no tiles. Text entrance only.
- Empty, error, disabled: not used.

## Accessibility

- Links are real `<a href="#work">`. Middle-click, copy link, and Back all work.
- `aria-current="page"` moves to the new link at the swap, not at the click, so it matches what is on screen.
- Focus moves to the new `<h1>` at the swap with `preventScroll: true`. The next Tab goes to the first link in the new content, not back to the nav.
- A visually hidden `role="status"` reads "Work page" after the swap.
- The tile overlay is `aria-hidden="true"` and `pointer-events: none`. It never takes focus.
- `document.title` changes to "Work — Raster" so history entries are named.
- Contrast: `--ink` on white 19.8:1. `--ink-2` on white 6.7:1. Cobalt on white 6.5:1. White label on cobalt 6.5:1.
- Hit targets: nav links 40px tall with 12px side padding.
- Reduced motion: no spinning tiles at all. A 240ms crossfade is the whole transition.

## Responsive rules

- ≥ 1280: as specified. Tiles 6 × 4, each about 213 × 200.
- 1024 to 1279: same layout. The title stays 168px; "Thirty years" still fits in 12 columns.
- 768 to 1023: title 120px. Lede takes columns 1 to 6, panel 7 to 12.
- Under 768: `--pad: 20px`, title clamp(48px, 14vw, 72px), location hidden, nav numbers hidden, nav padding 8px. Lede and panel stack full width, aligned to the top. People list goes to one column. Stat numbers 40px. Tile label 44px. Footer keeps only the address.
- Portrait screens under 768 use a 4 × 6 tile grid (`--cols: 4; --rows: 6`) so tiles stay close to square. Read `--cols` from CSS when computing the delays, so CSS owns the grid.
- Never more than 24 tiles. More tiles means more layers and the wave starts to look like noise.
- `body` has `overflow-x: hidden`. Tiles at `scale(1.02)` overhang the viewport by 1% and must not make a scrollbar.

## Acceptance checklist

### Always

- [ ] Every page change, including Back and Forward, runs the same transition through `hashchange`.
- [ ] The tile wave starts top-left going forward and bottom-right going back. Tiles leave in the same order they arrived.
- [ ] Tiles fully cover the screen before the swap. No frame of old and new content mixes.
- [ ] Tiles scale to 1.02 at full cover, so there are no hairline gaps.
- [ ] Title lines rise from `translateY(105%)` inside clipping boxes, one line after another.
- [ ] Hiding the text before the swap is instant. Only the entrance animates.
- [ ] Focus is on the new `<h1>` after the swap. `aria-current` and `document.title` match the new page.
- [ ] Hash changes during a transition queue; only the last one runs.
- [ ] Reduced motion shows no tiles and uses a crossfade under 250ms.
- [ ] The View Transitions API is used for the swap when present; the page still works without it.
- [ ] No horizontal scrollbar at any size.

### This demo

- [ ] Three pages: Home, Work, Studio, with hashes `#home`, `#work`, `#studio`.
- [ ] 24 tiles in `#1f3fff`, 6 × 4 on desktop, 4 × 6 under 768.
- [ ] Tile timing: 380ms, 35ms per diagonal, swap at 800ms, done at 1480ms.
- [ ] The label reads "02 / 03" over "Work" in white on the cobalt.
- [ ] Titles: "Form follows the grid.", "Thirty years of posters.", "Six people, one table.", with the last word cobalt.

## Implementation notes

**1. Diagonal order and the three tile states.** One class per state. The reset state turns transitions off so tiles jump home invisibly.

```css
.wipe { position: fixed; inset: 0; z-index: 20; pointer-events: none; display: grid;
  grid-template-columns: repeat(var(--cols), 1fr); grid-template-rows: repeat(var(--rows), 1fr); }
.wipe i { background: var(--cobalt); transform: scale(0) rotate(-90deg);
  transition: transform var(--t-tile) var(--ease-tile); transition-delay: calc(var(--d) * var(--stagger)); }
.wipe.cover i { transform: scale(1.02) rotate(0); }
.wipe.leave i { transform: scale(0) rotate(90deg); }
.wipe.reset i { transition: none; }
```

```js
function setOrder(forward) {
  const cols = parseInt(getComputedStyle(wipe).getPropertyValue('--cols'), 10) || 6;
  const rows = 24 / cols;
  wipe.querySelectorAll('i').forEach((t, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    t.style.setProperty('--d', forward ? c + r : (cols - 1 - c) + (rows - 1 - r));
  });
}
```

**2. The sequence, with View Transitions for the swap.** The hash drives everything, so Back works for free.

```js
function go(key) {
  if (key === current) return;
  if (busy) { pending = key; return; }
  busy = true;
  setOrder(ORDER.indexOf(key) > ORDER.indexOf(current));
  wipe.classList.remove('reset', 'leave'); wipe.classList.add('cover');
  setTimeout(() => {
    document.documentElement.classList.add('tiling');           // root VT animation: none
    const done = () => {
      document.documentElement.classList.remove('tiling');
      wipe.classList.replace('cover', 'leave');
      title.focus({ preventScroll: true });
      setTimeout(() => { wipe.classList.add('reset'); wipe.classList.remove('leave'); busy = false; flush(); }, 680);
    };
    if (document.startViewTransition) document.startViewTransition(() => render(key)).updateCallbackDone.then(done, done);
    else { render(key); done(); }
  }, 800);
}
addEventListener('hashchange', () => go(keyFromHash()));
```

```css
html.tiling::view-transition-old(root), html.tiling::view-transition-new(root) { animation: none; }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 240ms; }
```

**3. Lines that hide instantly and rise slowly.** Put `transition: none` on the hidden state. Remove `.in`, swap the text, force a reflow, add `.in` back.

```css
h1 .ln { display: block; overflow: hidden; padding-bottom: .06em; margin-bottom: -.06em; }
h1 .ln span { display: block; transform: translateY(105%);
  transition: transform var(--t-line) var(--ease-out); transition-delay: calc(200ms + var(--i) * 90ms); }
main.in h1 .ln span { transform: none; }
main:not(.in) h1 .ln span { transition: none; }
```

Common mistakes:

- Calling `preventDefault` on the nav links and pushing state by hand. Let the hash change and listen for `hashchange`; Back and Forward then need no extra code.
- Giving a section the same id as a hash. The browser jumps to it before the wipe starts.
- Swapping at 660ms, the exact moment of full cover. A late frame shows the new page through a gap. Hold to 800ms.
- Rotating the tiles back the way they came on exit. Keep turning the same way (-90 → 0 → 90) so the motion reads as one gesture.
- Animating `width`, `height` or `clip-path` per tile. Use `transform` only.
- Leaving focus on the old nav link. Screen reader users hear nothing changed.
- Running the full tile wipe for reduced-motion users at a shorter duration. They get a crossfade.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
