<!-- Design Lounge Nº 049 · "Page transition curtain" · designlounge.vercel.app -->

# Page transition curtain

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A marketing site shell for a fjord-side hotel ("Halden") with four pages: Rooms, Dining, Spa, Journal. Clicking a nav link does not cut to the new page: two deep-green panels slide in from the left and right edges and meet in the centre (450ms), the content underneath is swapped while covered, the panels retract (450ms), and the new page's title arrives one letter at a time, each rising out of a clipped line box with a 28ms stagger and expo-out easing. The lede, the "Explore" link and the fact list follow on their own delays. The panels' meeting edges carry a 1px copper hairline so the seam reads as a deliberate line, not a glitch. The detail worth copying is the timing structure: one clock for the curtain, one for the letters, and an instant (non-animated) reset hidden behind the closed curtain.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ HALDEN   Rooms  Dining  Spa  Journal                   ( Book a stay )│ header 80
├──────────────────────────────────────────────────────────────────────┤
│  01 — 04                                          │ AT A GLANCE       │ pad 56/48
│                                                   │ ─────────────     │
│  R o o m s          ← 132px, letters clipped      │ From   NOK 2,400  │ aside 320
│                                                   │ ─────────────     │
│  Forty-two rooms on three floors, each facing…    │ Check-in  15:00   │ gap 64
│  (lede, max 560px)                                │ ─────────────     │
│                                                   │ Sea view 38 of 42 │
│  See all rooms →                                  │                   │
│                                                                       │
│  Halden, Hardangerfjord · 60.06° N                                    │ foot at 48,40
└──────────────────────────────────────────────────────────────────────┘
   [ left panel 640 wide ]|[ right panel 640 wide ]   ← curtain, fixed, z 10
```

- `<header>` — flex, 48px side padding, 1px bottom hairline. `.brand` serif 22px uppercase. `<nav aria-label="Primary">` with four `<a href="#page" data-page>`; current has `aria-current="page"`. `<button class="book">` pushed right with `margin-left: auto`.
- `<main aria-live="polite">` — grid `1fr 320px`, gap 64px, padding `56px 48px 48px`, `position: relative`.
  - `<section>`: `.idx` (index), `<h1 id="title" aria-label="Rooms">` containing one `<span aria-hidden="true"><i style="--i:n">R</i></span>` per character, `<p class="lede">`, `<a class="more">`.
  - `<aside>`: 1px left border, 32px left padding, `align-self: end`; `<h2>` label and `<dl>` of `<div><dt/><dd/></div>` rows with `--i`.
  - `.foot` absolutely positioned bottom-left.
- `.curtain` — `position: fixed; inset: 0; pointer-events: none; z-index: 10; aria-hidden="true"` containing `.panel.l` and `.panel.r`.

Page data:

| key     | index | title   | italic char | lede | link label | facts |
|---------|-------|---------|-------------|------|------------|-------|
| rooms   | 01    | Rooms   | 0 | Forty-two rooms on three floors, each facing the water. Oak floors, wool blankets from Røros, and a window seat wide enough to sleep in. | See all rooms | From / NOK 2,400 / night · Check-in / 15:00 · Sea view / 38 of 42 |
| dining  | 02    | Dining  | 1 | One sitting at 19:30. Seven courses from whatever the boats and the garden brought in that morning, served at a single long table. | Tonight's menu | Seats / 24 · Tasting menu / NOK 1,650 · Wine pairing / NOK 890 |
| spa     | 03    | Spa     | 0 | A sauna on the jetty, a cold plunge into the fjord, and a stone room warmed to 42 °C. Towels are on the hook; the rest is up to you. | Book a slot | Open / 06:00 – 22:00 · Water today / 9 °C · Sauna / 85 °C |
| journal | 04    | Journal | 3 | Notes from the kitchen, the boathouse and the mountain behind us. Updated most Sundays, weather permitting. | Latest entry | Entries / 31 · Latest / 21 Sep · Read time / 4 min |

## Motion

| Element        | Trigger              | Property            | From → To                 | Duration | Easing       | Delay |
|----------------|----------------------|---------------------|---------------------------|---------:|--------------|-------|
| `.panel.l/.r`  | nav click            | translateX          | ∓100.5% → 0               | 450ms    | `--ease`     | 0 |
| `.panel.l/.r`  | swap done (t=490)    | translateX          | 0 → ∓100.5%               | 450ms    | `--ease`     | 0 |
| `h1 i`         | `.in` added          | translateY          | 110% → 0                  | 600ms    | `--ease-out` | `120ms + i × 28ms` |
| `h1 i`         | `.in` removed        | translateY          | 0 → 110%                  | 0        | none         | instant (`transition: none` on `:not(.in)`) |
| `.lede`        | `.in` added on h1    | opacity, translateY | 0, 8px → 1, 0             | 400ms    | `--ease` / `--ease-out` | 320ms |
| `.more`        | same                 | opacity, translateY | 0, 8px → 1, 0             | 400ms    | same         | 420ms |
| `dl div`       | `.in` added on dl    | opacity, translateY | 0, 6px → 1, 0             | 360ms    | same         | `360ms + i × 60ms` |
| `nav a::after` | current changes      | scaleX              | 0 → 1 (origin left)       | 240ms    | `--ease`     | 0 |
| `nav a`        | hover                | color               | `--ink-2` → `--ink`       | 160ms    | `--ease`     | 0 |
| `.more svg`    | hover                | translateX          | 0 → 4px                   | 160ms    | `--ease`     | 0 |

Absolute timeline for a click on "Rooms" → "Dining" (6 letters, italic index 1):

| t (ms) | Event |
|-------:|-------|
| 0      | `aria-current` moves; underline grows; panels start closing |
| 450    | panels meet; copper seam visible |
| 490    | content swapped behind the curtain; panels start opening; `.in` re-added |
| 610    | letter 0 ("D") starts rising |
| 638 … 750 | letters 1–5 start, 28ms apart |
| 810    | lede starts (490 + 320) |
| 850    | fact row 0 starts (490 + 360); rows 1–2 at 910, 970 |
| 910    | link starts (490 + 420) |
| 940    | panels fully open; click lock released |
| 1350   | last letter lands (750 + 600) |

Use `100.5%` not `100%` for the resting panel offset so the 1px copper border is fully off-screen at rest.

Reduced motion: `.panel { transition-duration: 1ms }`; letters and blocks get `transition-duration: 1ms; transition-delay: 0ms`.

## States

- **Nav resting:** `--ink-2`. **Hover:** `--ink`. **Current:** `--ink` + copper underline (1px, inset 12px from each side, 4px from the bottom).
- **Focus-visible (nav, Explore, Book):** `outline: 2px solid var(--accent)`, offset 2–4px.
- **Book hover:** background `--accent`, text `--bg`.
- **Transitioning:** JS `busy` flag; nav clicks are ignored. Do not visually disable the links — the curtain already communicates that the page is changing.
- **First load:** entrance plays without the curtain; the panels are off-screen from the start.

## Accessibility

- `<nav aria-label="Primary">`; the current page link carries `aria-current="page"`. Links are real anchors with hash hrefs; `preventDefault` only when the transition handles routing.
- The title `<h1>` has an `aria-label` equal to the page name; every letter span is `aria-hidden="true"` so screen readers hear "Rooms", not "R, o, o, m, s".
- `<main aria-live="polite">` announces the replaced content after the swap. If your framework re-renders the whole main, move `aria-live` to a visually hidden status element that announces "Now showing Dining".
- The curtain is `aria-hidden="true"` and `pointer-events: none`; it never traps focus.
- Keyboard: Tab order is wordmark (not focusable) → four nav links → Book → Explore link. Enter on a nav link triggers the transition.
- Contrast: `--ink` on `--bg` 14.3:1; `--ink-2` on `--bg` 7.0:1; `--accent` on `--bg` 6.1:1; `--ink-3` (12–13px meta) 3.6:1 — decorative only.
- Focus is not moved on page change (the shell stays put). If content becomes long, move focus to the `<h1>` after the swap with `tabindex="-1"`.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: `--title: 108px`, aside 280px, gap 48px.
- 768–1023: `--title: 88px`; aside moves below the section as a 3-column fact row; panels stay 50% each.
- < 640: `--title: 64px`, padding 24px, nav becomes a horizontal scroll row, "Book a stay" becomes "Book"; the curtain switches to two horizontal panels (top/bottom, 50% height each) so the slide distance stays short; letter stagger drops to 20ms.

## Acceptance checklist

- [ ] Two panels, each exactly 50% wide and full height, rest at `translateX(-100.5%)` and `translateX(100.5%)`.
- [ ] Close and open each take 450ms with `cubic-bezier(.2,.7,.2,1)`; the content swap happens at 490ms, never visible.
- [ ] At full close a single 1px `#c58b4a` line runs vertically down the centre.
- [ ] Title letters are individually wrapped in `overflow: hidden` spans and enter from `translateY(110%)` over 600ms with `cubic-bezier(.16,1,.3,1)`, delay `120ms + i × 28ms`.
- [ ] Removing `.in` hides letters instantly (no exit animation); only the entrance transitions.
- [ ] One designated letter per title is italic and copper.
- [ ] Lede, link and fact rows enter on delays 320ms, 420ms, and `360 + i × 60ms`.
- [ ] `aria-current="page"` moves to the clicked link at click time; the underline grows from the left over 240ms.
- [ ] Clicks during the 940ms transition window are ignored; clicking the current page does nothing.
- [ ] `<h1>` has `aria-label` with the page name and letter spans are `aria-hidden`.
- [ ] Focus rings visible on nav links, Book and Explore.
- [ ] The first page load plays the letter/lede/facts entrance without the curtain (panels are already off-screen).
- [ ] With `prefers-reduced-motion: reduce` the transition reads as a cut and content appears without stagger.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: header (80px) with the "HALDEN" wordmark, four nav links ("Rooms" current, with a 1px copper underline), and an outlined "Book a stay" pill on the right. Main shows "01 — 04", the title "Rooms" at 132px, a two-sentence lede, an "Explore" link with an arrow, and on the right an "At a glance" list of three facts. On first paint the title letters, lede, link and facts play their entrance (no curtain on first load).
2. Hover a nav link: colour goes `--ink-2` → `--ink` over 160ms. Hover the current link: nothing changes. The underline is a `::after` scaled from `scaleX(0)` to `scaleX(1)` from the left over 240ms and only shown on the current link.
3. Click a different nav link (t = 0): `aria-current` moves immediately to the clicked link and its underline grows. The two panels (each 50% of the viewport wide, full height, `--panel` fill) translate from `translateX(∓100.5%)` to `0` over 450ms with `cubic-bezier(.2,.7,.2,1)`. Their inner edges have a 1px `--accent` border, so at t = 450 a single copper line runs down the centre.
4. t = 490ms: content is replaced. The title's `.in` class is removed (instantly hiding the letters — no transition), text is swapped, index number updates ("02 — 04"), then `.in` is re-added after a forced reflow. The panels start retracting (450ms, same easing).
5. Letters: each `<i>` starts at `translateY(110%)` inside an `overflow: hidden` span and moves to `0` over 600ms with `cubic-bezier(.16,1,.3,1)`, delay `120ms + i × 28ms`. "Rooms" (5 letters) finishes at 490 + 120 + 112 + 600 = 1322ms after the click. One letter per title is italic and copper (Rooms: R; Dining: i; Spa: S; Journal: r — the 1st, 2nd, 1st and 4th characters).
6. Lede: opacity 0 → 1 and `translateY(8px)` → 0, 400ms, delay 320ms after the swap. "Explore" link: same, delay 420ms. Fact rows: opacity/translateY(6px), 360ms, delay `360ms + i × 60ms`.
7. Clicks during a transition (940ms window from click) are ignored; clicking the current page's link does nothing.
8. Hover the "Explore" link: its arrow translates 4px right over 160ms. Hover "Book a stay": fills copper with dark text.
9. With `prefers-reduced-motion: reduce`: panels move in 1ms (the page is covered for the 490ms swap window, so it reads as a cut), letters and blocks appear with no stagger or translate.

## Tokens

```css
:root {
  /* colour — deep green surfaces, warm off-white ink, copper accent */
  --bg: #0f1b17;        /* page */
  --panel: #17302a;     /* curtain panels */
  --line: #24403a;      /* hairlines */
  --ink: #efe9dd;       /* headings, primary text */
  --ink-2: #a29b8b;     /* lede, nav resting, dt */
  --ink-3: #6f6a5e;     /* index, aside label, footer */
  --accent: #c58b4a;    /* underline, italic letter, panel seam, Book button */

  /* type */
  --serif: "Playfair Display", Georgia, serif;
  --sans: "Inter", system-ui, sans-serif;
  --title: 132px;

  /* layout */
  --header-h: 80px;
  --pad-x: 48px;
  --aside-w: 320px;
  --col-gap: 64px;
  --lede-max: 560px;

  /* motion */
  --t-curtain: 450ms;
  --t-letter: 600ms;
  --stagger: 28ms;
  --letter-delay: 120ms;   /* first letter waits this long after the swap */
  --swap-at: 490ms;        /* curtain duration + 40ms guard */
  --lock: 940ms;           /* clicks ignored for this long */
  --t-micro: 160ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role        | Family           | Size  | Weight | Line-height | Tracking | Case      |
|-------------|------------------|------:|-------:|------------:|---------:|-----------|
| Wordmark    | Playfair Display | 22px  | 400    | 1           | +0.04em  | UPPERCASE |
| Nav link    | Inter            | 14px  | 500    | 1.55        | +0.01em  | sentence  |
| Book button | Inter            | 13px  | 500    | 40px box    | +0.06em  | UPPERCASE |
| Index       | Inter            | 13px  | 400 (number 500) | 1.55 | +0.12em | numerals |
| Page title  | Playfair Display | 132px | 400    | 1.05 (span) | −0.02em  | sentence  |
| Italic letter | Playfair Display italic | 132px | 400 | — | — | — |
| Lede        | Inter            | 18px  | 400    | 1.6         | 0        | sentence  |
| Explore link| Inter            | 14px  | 500    | 1.55        | 0        | sentence  |
| Aside label | Inter            | 13px  | 400    | 1.55        | +0.12em  | UPPERCASE |
| dt          | Inter            | 13px  | 400    | 1.55        | 0        | sentence  |
| dd          | Playfair Display | 17px  | 400    | 1.55        | 0        | sentence  |
| Footer      | Inter            | 12px  | 400    | 1.55        | +0.06em  | sentence  |

## Implementation notes

**Instant reset, animated entrance.** CSS transitions read `transition-*` from the *after-change* style, so put `transition: none` on the not-`.in` state. Removing the class snaps everything to its hidden position; re-adding it after a forced reflow animates:

```css
h1 i { transform: translateY(110%); transition: transform var(--t-letter) var(--ease-out);
       transition-delay: calc(var(--i) * var(--stagger) + var(--letter-delay)); }
h1.in i { transform: none; }
h1:not(.in) i, h1:not(.in) ~ .lede, h1:not(.in) ~ .more, dl:not(.in) div { transition: none; }
```

```js
function render(key) {
  const p = pages[key];
  title.classList.remove('in'); facts.classList.remove('in');
  title.setAttribute('aria-label', p.t);
  title.innerHTML = [...p.t].map((c, i) =>
    `<span aria-hidden="true"><i class="${i === p.it ? 'it' : ''}" style="--i:${i}">${c}</i></span>`).join('');
  /* …lede, index, facts… */
  void title.offsetWidth;                 // flush styles so the hidden state is committed
  title.classList.add('in'); facts.classList.add('in');
}
```

**Sequencing the curtain** — two timers, one lock:

```js
function go(key) {
  if (busy) return; busy = true;
  setCurrent(key);
  curtain.classList.add('closed');                                     // t = 0, close 450ms
  setTimeout(() => { render(key); curtain.classList.remove('closed'); }, 490);   // swap + open
  setTimeout(() => { busy = false; }, 940);
}
```

**Hash routing.** The demo prevents navigation; in a product, update the URL when the swap happens so back/forward work, and run the same `go()` on `popstate`:

```js
setTimeout(() => { render(key); history.pushState({ key }, '', '#' + key); curtain.classList.remove('closed'); }, 490);
addEventListener('popstate', e => { if (e.state?.key) go(e.state.key); });
```

**Clipping descenders:** Playfair's descenders ("J", "g") get cut by `overflow: hidden` on the letter span. Give the span `padding-bottom: .06em; margin-bottom: -.06em` so the clip box extends below the baseline without changing the line box.

Common mistakes: animating the panels with `left/right` instead of `transform`; swapping content at exactly 450ms (a frame of new content can show before the panels are fully closed — use a 40ms guard); forgetting `pointer-events: none` on the curtain so the nav stays clickable during the open; wrapping the whole title in one `overflow: hidden` instead of each letter (kerning still works per letter because each span is `inline-block` with no extra spacing).

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
