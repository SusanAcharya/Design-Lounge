<!-- Design Lounge Nº 406 · "Smooth scroll with inertia" · designlounge.vercel.app -->

# Smooth scroll with inertia

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A one-page site for a fictional identity and motion studio, Ostra, in Porto. The page scrolls with weight: the real scrollbar moves at once, and the content follows it, closing 10% of the gap every frame. Work images skew up to 4 degrees while the page moves fast and settle flat when it stops. The art inside each frame drifts slower than the frame, so every image has depth. The page ends on a giant "Ostra." word that rises into place at the very bottom. The detail worth copying is that nothing is faked: the native scrollbar, keyboard scrolling, anchor links, Tab focus and find-in-page all still work, and reduced motion gets plain native scroll.

Write the smooth scroll by hand. Do not add a scroll library. The whole engine is about 60 lines.

### When not to use it

Read this before you build. Smooth scroll is a mood, not a feature. Use it only on short, visual marketing pages: an agency home, a campaign page, a case study.

Do not use it on:

1. Docs, articles, help pages, or anything people read for more than two minutes. Readers want the page to stop where their finger stops.
2. App screens, dashboards, tables, and settings. They have their own scroll areas, and a transformed wrapper breaks them.
3. Pages with forms. The browser scrolls inputs into view when they get focus, and that fights the lerp.
4. Pages that need `position: sticky`. Sticky does not work inside a transformed parent. Put sticky things outside the wrapper or skip this pattern.
5. Infinite feeds and very long pages, more than about 12 screens. The whole page sits in one composited layer, which costs memory.
6. Touch devices. Phones already have momentum scrolling. This demo turns itself off when `(pointer: coarse)` matches.
7. Any user with `prefers-reduced-motion: reduce`. They get native scroll, no skew, no parallax. Not a shorter version. None.

## Reference behaviour

1. Load: the hero fills the first 800px. A 72px fixed header shows "Ostra." on the left, links Work, Method, Contact, and a "Smooth scroll" switch that starts on (`aria-pressed="true"`, red track).
2. The page content lives in one wrapper, `#view`. In smooth mode the wrapper is `position: fixed` at the top of the viewport. An empty `#spacer` after it gets the wrapper's height, so the document is as tall as the content and the native scrollbar is real.
3. Wheel or trackpad: `window.scrollY` changes at once. Each animation frame, `current += (scrollY - current) * 0.1`. The wrapper gets `transform: translate3d(0, -current px, 0)`. When the gap is under 0.1px, `current` snaps to `scrollY` and the loop stops. No loop runs while the page is still.
4. Velocity skew: each frame, `v = scrollY - current` (the gap, in px). Every work frame gets `skewY(clamp(v * 0.025, -4, 4) deg)`. A 160px gap is the full 4 degrees. At rest the skew is 0.
5. Inner parallax: each work frame clips an art layer that is 124% of the frame's height, starting at -12%. Each frame, `rel = (frameCenter - viewportCenter) / viewportHeight`. If `rel` is between -1.4 and 1.4, the art gets `translateY(rel * -0.1 * frameHeight px)`. Frames off-screen are skipped.
6. Footer word: "Ostra." at 27.4vw sits in a clipping box. It starts pushed down and reaches `translateY(0)` exactly when the page hits the bottom. Formula below.
7. Keyboard scroll: Space, Shift+Space, Page Up, Page Down, arrows, Home and End change `window.scrollY` natively, because the document is spacer-tall. The wrapper follows with the same lerp.
8. Anchor links (Work, Method, Contact, "Selected work", the logo): the click is caught. The target's top inside the wrapper, minus 72px for the header, becomes the new `scrollY` in one jump. The lerp turns the jump into a glide. The hash is updated with `history.replaceState`. Focus moves to the target section (`tabindex="-1"`) with `preventScroll: true`.
9. Tab focus: the browser cannot scroll a fixed wrapper into view, so a `focusin` handler does it. If the focused element's top is above `scrollY + 72`, or its first 120px reach below `scrollY + viewportHeight - 40`, set `scrollY` so the element sits at 30% of the viewport height.
10. Find in page: Cmd+F or Ctrl+F switches to native mode before the find bar opens. The wrapper becomes `position: relative`, the spacer height becomes 0, and the transform is cleared. The layout is identical, so the scroll position does not move. A status line at bottom left reads "Native scroll while you search" for 2200ms. The next wheel event turns smooth mode back on, unless the user turned it off with the switch.
11. The switch: click turns smooth mode off or on. Status reads "Native scroll" or "Smooth scroll, lerp 0.1". With reduced motion it stays off and reads "Reduced motion is on: native scroll".
12. Resize and font load: re-measure the wrapper height and every frame's offset. A `ResizeObserver` on the wrapper does this.
13. A URL that arrives with a hash scrolls to that section on load.

## Structure

```
1280 × 800 viewport, document height = content height (≈ 4260px)
┌──────────────────────────────────────────────────────────────────────┐
│ Ostra.  Work  Method  Contact  (● Smooth scroll)                     │ header 72, fixed, outside wrapper
├──────────────────────────────────────────────────────────────────────┤
│ IDENTITY & MOTION STUDIO · PORTO · SINCE 2014              13px caps │ hero, min-height 100vh
│ Brands that                                               188px 800  │ padding-top 144
│ move slowly.            ← "slowly" serif italic, "." red             │
│ ────────────────────────────────────────────────────────────────────  │
│ We are twelve people…   Now booking for spring 2027.   SELECTED WORK ↓│ 5fr 4fr 3fr
└──────────────────────────────────────────────────────────────────────┘
  Selected work  2023 — 2026                                         04   head, 1px rule, 72 below
  ┌───────────── p1 cols 1–7, 4:3 ─────┐   ┌── p2 cols 8–12, 4:5 ──┐      row gap 96
  │ art 124% tall, drifts              │   │ (180px lower)          │
  └────────────────────────────────────┘   └────────────────────────┘
  01 Salt Archive …                         02 Lumen Rail …
     ┌── p3 cols 2–6, 1:1 ──┐   ┌──── p4 cols 7–12, 3:2 ────┐ (120px lower)
  Method  Six weeks, three phases
  Slow is a decision. We listen for three weeks, then make it look easy.   72px max 17ch
  i. Listen        ii. Draw         iii. Hand over                        3 columns
  ─────────────────────────────── footer ───────────────────────────────
  Start a project / hello@ostra.studio   Rua do Almada 212…   Mon to Thu…
                O S T R A .        ← 27.4vw, rises into its clip box
  © 2026 Ostra Studio Lda.                Set in Inter Tight and Instrument Serif
[ #spacer: height = #view height, empty ]
```

- `<header class="nav">` is fixed and lives outside the wrapper. So does the status line. Nothing fixed or sticky goes inside the wrapper.
- `<div id="view">` holds `<main>` (hero, `#work`, `#method`) and `<footer id="contact">`.
- The hero, each section and the footer carry `tabindex="-1"` so anchor links can move focus to them.
- Each project is a `<figure>`: a `.frame` (overflow hidden, aspect ratio, skewed) holding an `.art` layer (`aria-hidden`), then a `<figcaption>` with index, name, discipline, client and year.
- The four arts are CSS only. Salt Archive: a bone circle over a red horizon line. Lumen Rail: thin vertical rails and one red slab. Kiln Week: two arches, one bone, one red. Northbound: a dot grid with a serif italic "Nb".
- The footer word is `.frame.word` with `aria-hidden="true"`. It does not skew.
- `<p class="status" role="status">` announces mode changes.

Copy:

| Project | Discipline | Client, year |
| --- | --- | --- |
| 01 Salt Archive | Identity and archive system | Museu do Sal, 2026 |
| 02 Lumen Rail | Wayfinding and motion | Linha Norte, 2025 |
| 03 Kiln Week | Festival identity | Kiln Week Porto, 2024 |
| 04 Northbound | Type family and campaign | Northbound Ferries, 2023 |

Method steps: "Listen: Three weeks of interviews, archives and site visits before a single sketch." "Draw: Marks, type and motion rules drawn together, tested at 16 pixels and at 16 metres." "Hand over: A system your team runs without us: source files, motion rules and a 40-page manual."

## Tokens

```css
:root {
  /* colour: off-black ground, bone ink, one signal red */
  --bg: #0e0d0c;        /* page */
  --bg-2: #171513;      /* empty frame behind art */
  --ink: #eae4d8;       /* headings, primary text */
  --ink-2: #a8a195;     /* body copy, nav resting */
  --ink-3: #8a8478;     /* meta, legal, switch knob off */
  --line: #2a2826;      /* hairlines, switch track off */
  --red: #ea3a22;       /* the one accent: full stops, indices, switch on, focus */

  /* type */
  --sans: "Inter Tight", system-ui, sans-serif;
  --serif: "Instrument Serif", Georgia, serif;

  /* layout */
  --pad: 48px;          /* 20px under 768 */
  --nav-h: 72px;        /* 64px under 768 */
  --col-gap: 24px;
  --section-pad: 120px; /* 80px under 768 */

  /* scroll engine */
  --lerp: 0.1;          /* share of the gap closed each frame */
  --skew-max: 4;        /* degrees */
  --skew-gain: 0.025;   /* degrees per px of gap */
  --parallax: 0.1;      /* art travel, share of frame height per viewport */
  --art-overscan: 12%;  /* art is 124% tall, top -12% */

  /* motion */
  --t-micro: 160ms;
  --t-switch: 200ms;
  --t-status: 300ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Logo | Inter Tight | 22px | 800 | 1 | -0.04em | sentence, red full stop |
| Nav link | Inter Tight | 14px | 500 | 1.55 | 0 | sentence |
| Switch label | Inter Tight | 13px | 400 | 1 | 0 | sentence |
| Eyebrow | Inter Tight | 13px | 400 | 1.55 | +0.14em | UPPERCASE |
| Hero title | Inter Tight | clamp(64px, 14.8vw, 188px) | 800 | 0.88 | -0.055em | sentence |
| Hero italic word | Instrument Serif italic | 1.08em of title | 400 | — | -0.02em | lowercase |
| Body | Inter Tight | 16px | 400 | 1.55 | 0 | sentence, max 40ch |
| Section head | Inter Tight | 40px | 700 | 1 | -0.04em | sentence, italic word in serif at 1.1em |
| Caption name | Inter Tight | 20px | 700 | 1.3 | -0.02em | sentence |
| Caption meta | Inter Tight | 14px | 400 | 1.55 | 0 | sentence |
| Statement | Inter Tight | clamp(40px, 5.6vw, 72px) | 700 | 1 | -0.045em | sentence, max 17ch |
| Step numeral | Instrument Serif italic | 28px | 400 | 1 | 0 | roman, red |
| Step title | Inter Tight | 22px | 700 | 1.3 | -0.02em | sentence |
| Contact heading | Inter Tight | 56px | 700 | 1 | -0.04em | sentence |
| Email | Inter Tight | 24px | 500 | 1.3 | 0 | lowercase, red underline 6px offset |
| Footer word | Inter Tight | 27.4vw | 800 | 0.8 | -0.07em | sentence, red full stop |
| Legal | Inter Tight | 13px | 400 | 1.55 | 0 | sentence |

The italic serif appears once per heading, never for a whole line. Red appears on full stops, indices, step numerals, the switch, focus rings and one slab in one artwork. Nowhere else.

## Motion

| Element | Trigger | Property | From → To | Timing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| `#view` | scroll | translateY | `-current` follows `-scrollY` | lerp 0.1 per frame, stop under 0.1px | not fixed, no transform, native scroll |
| `.frame` (work) | scroll | skewY | 0 → clamp(gap × 0.025, ±4) deg → 0 | every frame while the gap is open | 0 always |
| `.art` (work) | scroll | translateY | rel × -0.1 × frame height | every frame, only when \|rel\| < 1.4 | none |
| `.word .art` | scroll near bottom | translateY | up to 100% → 0% | `clamp(dist / h × 70, 0, 100)%` | none, sits at 0 |
| Switch knob | click | translateX, background | 0 → 12px | 200ms `--ease` | instant |
| Status line | mode change | opacity | 0 → 1, hold 2200ms → 0 | 300ms `--ease` | instant |
| Nav link | hover | color | `--ink-2` → `--ink` | 160ms `--ease` | same |

There is no time-based easing on the scroll itself. The lerp is the easing: each frame closes 10% of what is left, so a 1000px jump covers 650px in 10 frames and is inside 1px after about 66 frames, roughly 1.1s at 60Hz.

## States

- Switch on: `aria-pressed="true"`, track `--red`, knob `--ink` moved 12px right.
- Switch off: `aria-pressed="false"`, track `--line`, knob `--ink-3` at the left.
- Native for find: same as off, but the next wheel event turns it back on.
- Reduced motion: switch shows off and stays off. Clicking it only announces why.
- Nav link hover: `--ink`. There is no current-page state; this is one page.
- Email hover: none beyond the cursor. The red underline is always on.
- Focus-visible on any link or button: `outline: 2px solid --red; outline-offset: 3px`.
- Sections reached by anchor get focus with no visible ring (`tabindex="-1"` targets only show the ring with `:focus-visible`).
- Loading: none. Empty and error: not used.

## Accessibility

- Real document scroll. The scrollbar, scroll keys, and screen reader browse mode work because the document height is real.
- The header is `<header>` with `<nav aria-label="Primary">`. The switch is a `<button>` with `aria-pressed` and the visible label "Smooth scroll". The track graphic is `aria-hidden`.
- Every anchor target has `tabindex="-1"`. After an anchor click, focus is on the target, so the next Tab continues from there.
- The `focusin` handler keeps focused elements on screen in smooth mode. Without it, Tab moves focus off-screen. This is the most common bug in hand-written smooth scroll.
- The status line is `role="status"` and announces mode changes.
- All artwork and the footer word are `aria-hidden`. Captions carry the meaning.
- Contrast: `--ink` on `--bg` 15.3:1. `--ink-2` on `--bg` 7.6:1. `--ink-3` on `--bg` 5.2:1. `--red` on `--bg` 4.7:1, used for short text only.
- Hit targets: switch 40px tall. Nav links are 14px text, padded to 40px height under 768 where they hide anyway.
- Reduced motion: never enable the engine. Skew and parallax are also forced off in CSS so nothing slips through.

## Responsive rules

- ≥ 1280: as specified. Title 188px. Projects on the 12-column grid with the 180px and 120px drops.
- 1024 to 1279: the title follows 14.8vw, about 152px at 1024. Everything else holds.
- 768 to 1023: same grid. The statement follows 5.6vw. Captions may wrap to two lines; keep three columns.
- Under 768: `--pad: 20px`, header 64px, nav links hidden, the switch stays on the right. Hero min-height 80vh. Title clamp(52px, 17vw, 96px). Hero foot and contact stack. Projects go full width with no drops, row gap 56px. Steps stack, 32px gap. Contact heading 40px, email 20px.
- Touch or `(pointer: coarse)` at any width: native scroll. Parallax stays, skew stays 0.
- The wrapper has `overflow-x: clip` and the body has `overflow-x: hidden`, so a 4 degree skew never makes a horizontal scrollbar.

## Acceptance checklist

### Always

- [ ] The native scrollbar is visible and real. The document height equals the content height through a spacer.
- [ ] The content follows `scrollY` with a lerp of 0.1 per frame and stops when the gap is under 0.1px. No animation loop runs at rest.
- [ ] Skew is capped at 4 degrees in both directions and is 0 at rest.
- [ ] Inner art drifts inside a clipping frame and never shows the frame's edge (art is 124% tall).
- [ ] Space, Page Down, arrows, Home and End scroll the page.
- [ ] Anchor links land with the target 72px below the top, update the hash, and move focus to the target.
- [ ] Tab never leaves focus off-screen.
- [ ] Cmd+F or Ctrl+F switches to native scroll without moving the page.
- [ ] Reduced motion and coarse pointers get native scroll with no skew.
- [ ] Nothing fixed or sticky sits inside the transformed wrapper.
- [ ] No horizontal scrollbar at any width.

### This demo

- [ ] Header reads "Ostra." with links Work, Method, Contact and a "Smooth scroll" switch that starts on.
- [ ] Hero title reads "Brands that move slowly." with "slowly" in Instrument Serif italic and a red full stop.
- [ ] Four projects: Salt Archive, Lumen Rail, Kiln Week, Northbound, with CSS-only art.
- [ ] The footer word "Ostra." reaches `translateY(0)` exactly at the bottom of the page.
- [ ] Colours: ground `#0e0d0c`, ink `#eae4d8`, accent `#ea3a22`.

## Implementation notes

**1. The engine.** Measure, translate, stop. The wrapper is fixed only in smooth mode, so turning it off is one class.

```js
const LERP = 0.1, SKEW_MAX = 4;
let smooth = true, cur = scrollY, raf = 0;
function measure() {
  spacer.style.height = smooth ? view.offsetHeight + 'px' : '0px';
  frames.forEach(o => { o.top = topIn(o.f); o.h = o.f.offsetHeight; });
}
function tick() {
  const target = scrollY, gap = target - cur;
  cur = smooth ? cur + gap * LERP : target;
  if (Math.abs(target - cur) < 0.1) cur = target;
  if (smooth) view.style.transform = `translate3d(0,${-cur}px,0)`;
  const skew = smooth ? Math.max(-SKEW_MAX, Math.min(SKEW_MAX, gap * 0.025)) : 0;
  view.style.setProperty('--skew', skew.toFixed(3));   // .frame { transform: skewY(calc(var(--skew) * 1deg)) }
  parallax();
  raf = cur !== target ? requestAnimationFrame(tick) : 0;
}
addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
new ResizeObserver(measure).observe(view);
```

```css
#view { position: relative; width: 100%; overflow-x: clip; }
.smooth #view { position: fixed; top: 0; left: 0; will-change: transform; }
```

Set one custom property for the skew, not a style per frame. Cache offsets in `measure()`; never call `getBoundingClientRect` inside the loop.

**2. Keeping the browser's own tools working.**

```js
const topIn = el => { let y = 0; while (el && el !== view) { y += el.offsetTop; el = el.offsetParent; } return y; };
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const el = document.querySelector(a.getAttribute('href')); if (!el) return;
  e.preventDefault();
  scrollTo(0, Math.max(0, topIn(el) - 72));          // lerp turns the jump into a glide
  history.replaceState(null, '', a.getAttribute('href'));
  el.focus({ preventScroll: true });
});
document.addEventListener('focusin', e => {
  if (!smooth || e.target.closest('.nav')) return;
  const t = topIn(e.target), h = Math.min(e.target.offsetHeight, 120);
  if (t < scrollY + 72 || t + h > scrollY + innerHeight - 40) scrollTo(0, Math.max(0, t - innerHeight * 0.3));
});
addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f' && smooth) setSmooth(false);
});
```

Check only the first 120px of the focused element. A section taller than the viewport would otherwise always count as "off-screen" and fight the anchor jump. Find from the browser menu, without the shortcut, is not caught; the matches still exist, they just highlight where the wrapper puts them. That is the reason this pattern belongs on short pages only.

**3. Parallax and the footer word.**

```js
for (const o of frames) {
  if (o.word) {                                  // o.tail = wrapper height - (o.top + o.h)
    const dist = o.top + o.h - cur - (innerHeight - o.tail);
    o.art.style.transform = `translate3d(0,${Math.min(100, Math.max(0, dist / o.h * 70))}%,0)`;
    continue;
  }
  const rel = (o.top - cur + o.h / 2 - innerHeight / 2) / innerHeight;
  if (rel < -1.4 || rel > 1.4) continue;
  o.art.style.transform = `translate3d(0,${rel * -o.h * 0.1}px,0)`;
}
```

`dist` is 0 at the last possible scroll position, so the word is always whole at the end. A formula that centres on the viewport leaves the word half-clipped at the bottom of the page.

**Frame rate.** A lerp of 0.1 per frame glides faster on a 120Hz screen. If the product must feel the same everywhere, use `cur += gap * (1 - Math.pow(0.9, dt / 16.67))` with `dt` from the rAF timestamp. Keep 0.1 at 60Hz as the reference.

Common mistakes:

- Hiding the native scrollbar and listening to `wheel` only. Keyboard, scrollbar drag and screen readers stop working.
- Putting the header or a sticky element inside the wrapper. Fixed and sticky children break inside a transformed parent.
- Running the rAF loop forever. Stop it when the gap closes and restart on the next `scroll` event.
- Skewing by scroll delta per event instead of the lerp gap. The gap is smooth; raw deltas jitter.
- Forgetting `ResizeObserver`. Web fonts load after first paint, the page grows, and the bottom gets cut off.
- Reading layout inside the loop. Cache offsets in `measure()`.
- Giving reduced-motion users a "slower" smooth scroll. They get none.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
