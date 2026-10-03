<!-- Design Lounge Nº 222 · "Mobile scroll story" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Mobile scroll story

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A phone web page that tells a brand story in six full-height chapters, like a printed zine you scroll. The brand is Ferry Rye, a bakery on Skerry Island whose loaves cross to the mainland on the 7:40 Saturday ferry. Each chapter has a 128px chapter number in deep blue with a fluoro pink copy printed 5px off, a small two-colour drawing, a condensed headline and a short serif paragraph. A thin bar of six segments at the top shows where you are and lets you tap to jump. Chapters snap with `scroll-snap-type: y proximity`, so the page settles on a chapter but never fights a slow read. The last chapter is the call to action. The detail worth copying is the print look done with `mix-blend-mode: multiply`: pink over blue turns a deep violet, exactly like two riso drums.

This is not `mobile-story-viewer`. That is a timed, tap-through story with a 5s clock. Here the reader scrolls a normal page and the bar only reports position.

## Reference behaviour

1. Initial state, 390×844: chapter 1 fills the screen. The bar shows segment 1 full in pink, segments 2 to 6 empty grey. Under the bar: "Ferry Rye · Skerry Island" left and "01 / 06" right. "01" with its pink offset sits top left, "A story in six crossings" top right. A blue loaf with a pink overprint and three score marks sits in the middle. The headline reads "How a Ferry Rye loaf gets to you", then one paragraph, then a "Scroll" hint with an arrow nudging 4px every 1.6s.
2. Scrolling 40px fades the hint out.
3. As chapter `i` enters from the bottom, segment `i` fills left to right with `scaleX`, from 0 when the chapter's top meets the bottom of the screen to 1 when its top meets the top of the screen.
4. The current chapter is the last one whose top is above the middle of the screen. Its segment turns pink (multiplied over the blue, so it reads violet when full). Past segments stay blue. The label updates to "02 / 06" and so on.
5. When a chapter is 45% visible it gets the class `in`. Its number, drawing, headline, paragraph and extras fade up 28px over 600ms, 0, 80, 160, 220 and 300ms apart. The pink copy of the number slides from 18px, 12px off to 5px, 4px off over 900ms: the plates come into register.
6. Each drawing has its own motion, which only runs while its chapter is `in`:
   - 01 loaf: rises from 60% height to full, 900ms.
   - 02 starter jar: three bubbles rise 80px and fade, 3.2s loop, 1.1s apart.
   - 03 mill: the wheel turns once every 18s.
   - 04 fold: three layers fold down from −80°, 700ms each, 250ms apart.
   - 05 oven: three heat lines rise and fade, 2.4s loop, 0.8s apart.
   - 06 ferry: the boat rocks ±3° over 3.6s, the waves slide 60px every 5s.
7. When a chapter drops under 5% visible it loses `in`, so it plays again next time.
8. Tapping a segment smooth-scrolls to that chapter's top and moves focus to its headline without a second scroll.
9. Chapter 6 ends with a full-width blue button "Order a loaf · £6.50" with a hard pink offset shadow, and a text link "See the four pickup points".
10. Every chapter leaves 84px plus 20px at the bottom for the browser bar that the Lounge draws.
11. With reduced motion: all content is visible at once, no loops run, pink is in register, and segment taps jump without smooth scrolling.

## Structure

```
390 × 844
┌──────────────────────────────┐
│ (54px clearance)             │
│ ▬▬▬▬ ▬▬▬▬ ▬▬▬▬ ▬▬▬▬ ▬▬▬▬ ▬▬▬▬ │ 6 buttons, 40px tall, 4px bar at 18px
│ FERRY RYE · SKERRY ISL  02/06│ 13px Anton
├──────────────────────────────┤ fixed header ends ~118px
│ 02               CHAPTER TWO │ number 128px, kicker 14px
│                  THE STARTER │
│                              │
│          ┌──────┐            │ drawing, flex 1, max 240px wide
│          │ jar  │            │
│          └──────┘            │
│                              │
│ AGNES LIVES IN A JAR         │ 44px Anton
│ Our starter is forty-one …   │ 17px serif, max 34ch
│                              │
│ (84px + 20px for browser bar)│
└──────────────────────────────┘
6 × section, min-height 100vh, snap start
```

- `header.chrome` is fixed to the top, opaque `--paper`, padding `max(54px, safe-area-top) 16px 6px`.
- Inside it, a `nav` labelled "Chapters" holds an `ol` of six `button`s, built from the chapters. Under it, an `aria-hidden` label row.
- `main` holds six `section.ch`, each labelled by its `h2`. Each `h2` has `tabindex="-1"` so a segment tap can focus it.
- Each section is a flex column: `.head` (number and kicker), `.vis` (drawing, flex 1), `h2`, `p`, and any extras.
- The number is a `p` with `aria-hidden` and `data-n`. The pink copy is its `::after` with `content: attr(data-n)`.
- Drawings are inline SVG, viewBox 240×180, `aria-hidden`.

## Tokens

```css
:root {
  /* colour */
  --paper: #f3ecdc;     /* cream stock */
  --blue: #2338a0;      /* drum 1: type, drawings, button */
  --pink: #ff48b0;      /* drum 2: overprint, current segment, shadow */
  --ink: #1b2350;       /* body text */
  --track: #d6d3d6;     /* empty segment */
  --grain: rgba(35, 56, 160, .07);
  --focus: #ff48b0;

  /* type */
  --display: "Anton", Impact, sans-serif;
  --serif: "Source Serif 4", Georgia, serif;
  --size-num: 128px;
  --size-h2: 44px;
  --size-body: 17px;
  --size-kick: 14px;
  --size-label: 13px;
  --size-cta: 20px;

  /* layout */
  --top: max(54px, env(safe-area-inset-top));
  --bottom: 84px;           /* browser bar drawn by the Lounge */
  --pad-x: 20px;
  --seg-h: 40px;            /* hit target */
  --seg-bar: 4px;
  --seg-gap: 4px;
  --misreg: 5px 4px;        /* pink offset at rest */

  /* motion */
  --ease: cubic-bezier(.16, 1, .3, 1);
  --std: cubic-bezier(.2, .7, .2, 1);
  --dur-enter: 600ms;
  --dur-register: 900ms;
  --enter-shift: 28px;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case / colour |
| --- | --- | --- | --- | --- | --- | --- |
| Chapter number | Anton | 128px (96px under 780px tall) | 400 | 0.82 | -0.02em | `--blue`, pink copy |
| Headline | Anton | 44px (36px under 780px tall) | 400 | 0.98 | 0.005em | Upper, `--blue` |
| Body | Source Serif 4 | 17px | 400 | 1.5 | 0 | `--ink`, max 34ch |
| Kicker | Anton | 14px | 400 | 1.25 | 0.08em | Upper, right aligned, `--blue` |
| Bar label | Anton | 13px | 400 | 1 | 0.08em | Upper, tabular numbers |
| Hint | Anton | 13px | 400 | 1 | 0.1em | Upper |
| Button | Anton | 20px | 400 | 1 | 0.04em | Upper, `--paper` on `--blue` |
| Text link | Source Serif 4 | 17px | 600 | 1.5 | 0 | Underlined, 4px offset |

Anton is the condensed display face. Never set the paragraph in it. Source Serif 4 at 17px stays readable at 360 wide.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing / delay | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Segment fill | scroll | transform scaleX | 0 → 1 | Scrubbed per frame | Same, it is position |
| Current segment | chapter crosses mid screen | background | blue → pink multiply | Instant | Same |
| Number | chapter `in` | opacity, translateY | 0, 28px → 1, 0 | 600ms expo, 0ms | Visible |
| Pink plate | chapter `in` | transform translate | 18px 12px → 5px 4px | 900ms expo, 150ms | At 5px 4px |
| Drawing | chapter `in` | opacity, scale | 0, 0.92 → 1, 1 | 600ms expo, 80ms | Visible |
| Headline | chapter `in` | opacity, translateY | 0, 28px → 1, 0 | 600ms expo, 160ms | Visible |
| Paragraph | chapter `in` | opacity, translateY | 0, 28px → 1, 0 | 600ms expo, 220ms | Visible |
| Hint, button, link | chapter `in` | opacity, translateY | 0, 28px → 1, 0 | 600ms expo, 300ms | Visible |
| Loaf | chapter `in` | scaleY, origin bottom | 0.6 → 1 | 900ms expo, 200ms | Full |
| Bubbles | while `in` | translateY, opacity | 0 → −80px, fade | 3.2s loop, 1.1s apart | Still, visible |
| Mill wheel | while `in` | rotate | 0 → 360° | 18s linear loop | Still |
| Fold layers | chapter `in` | rotate, origin bottom left | −80° → 0 | 700ms expo, 250ms apart | Flat |
| Heat lines | while `in` | translateY, opacity | 10px → −26px | 2.4s loop, 0.8s apart | Hidden motion, lines still |
| Boat | while `in` | rotate, translateY | −3° → 3°, −5px | 3.6s ease-in-out alternate | Still |
| Waves | while `in` | translateX | 0 → −60px | 5s linear loop | Still |
| Hint arrow | always | translateY | 0 → 4px → 0 | 1.6s standard | Still |
| Button press | active | translate, shadow | 0 → 3px 3px, shadow 5/4 → 2/1 | 160ms standard | Same |
| Segment tap | click | page scroll | to chapter top | Smooth | Instant |

Loops use `animation-play-state: paused` until the chapter is `in`. Off-screen chapters cost nothing.

## States

- Segment empty: 4px `--track` bar. Filling: blue `scaleX(f)`. Current: pink with multiply. Past: full blue.
- Segment button: 40px tall, full flex width. The bar is drawn at 18px from its top.
- Chapter not `in`: content at opacity 0, 28px low. Chapter `in`: visible, loops running.
- Hint: visible at scroll 0 to 40px.
- Button resting: blue, pink 5px 4px shadow. Active: moves 3px down and right, shadow 2px 1px.
- Focus-visible: 2px pink outline, 2px offset, on segments, button and link. Headlines focused by script show no ring, since focus moved there by a tap.
- No JS: the `js` class is absent, so every chapter is fully visible. The bar is empty (it is built by script).

## Accessibility

- The bar is a `nav` labelled "Chapters" with six real buttons. Each has an `aria-label` like "Chapter 3 of 6: The mill".
- The current segment has `aria-current="step"`. Only one at a time.
- A segment tap moves focus to the chapter's `h2` with `preventScroll: true`, so screen reader users land in the right place.
- Each chapter is a `section` with `aria-labelledby` its headline.
- Big numbers and drawings are `aria-hidden`. The headline already names the chapter.
- The label row "02 / 06" is `aria-hidden` and not live. Announcing every chapter change during scroll is noise.
- Hit targets: segments are 40px tall and about 57px wide at 390. The button is 56px tall. The text link is 44px tall.
- Contrast: `#1b2350` on `#f3ecdc` is about 13:1. `#2338a0` on `#f3ecdc` is about 8:1. Pink is never used for text.
- Proximity snapping never traps a reader mid paragraph. Do not switch to `mandatory`.

## Responsive rules

- 390×844: as specified.
- 360 wide: same layout. The headline wraps to 2 lines, the paragraph to 4. Segments are about 52px wide. The button label "Order a loaf · £6.50" fits on one line.
- Under 780px tall: number 96px, headline 36px, drawing min-height 120px and max width min(200px, 54vw). Every chapter must still fit one screen, so the header never covers the number at the end of the page.
- Taller than 844: the drawing area grows, text stays the same size.
- 600px and wider (small tablet): content is capped to a 480px column centred, and the bar matches it. Do not stretch the 128px number across a tablet.
- Landscape phone: chapters grow taller than the screen, snapping still settles on their tops. Do not shrink type further.
- Never overflow sideways. The waves drawing clips to its own viewBox.

## Acceptance checklist

### Always

- [ ] Each chapter is a full-height section with `scroll-snap-align: start`. The root uses `scroll-snap-type: y proximity`, not mandatory.
- [ ] A fixed bar shows one segment per chapter, each a button at least 40px tall.
- [ ] Segment fill is driven by scroll position with `scaleX`, from one passive listener and one rAF per frame.
- [ ] Exactly one segment has `aria-current="step"` and it matches the chapter at mid screen.
- [ ] Tapping a segment scrolls to that chapter and focuses its headline.
- [ ] Chapter content animates in when 45% visible, using only opacity and transform, and resets under 5%.
- [ ] Looping drawings are paused unless their chapter is in view.
- [ ] The last chapter is the call to action with one primary button.
- [ ] The top clears 54px, the bottom clears 84px for the browser bar.
- [ ] Reduced motion: everything visible, no loops, instant jumps.
- [ ] Readable at 360 wide with no sideways scroll.

### This demo

- [ ] Six chapters: The loaf, The starter, The mill, The fold, The oven, The ferry.
- [ ] Numbers are Anton 128px `#2338a0` with a `#ff48b0` copy at 5px, 4px in multiply.
- [ ] The label reads "Ferry Rye · Skerry Island" and "01 / 06" on load.
- [ ] Button reads "Order a loaf · £6.50" with a 5px 4px pink shadow.
- [ ] Page is `#f3ecdc` with a 4px dot grain at 7% blue.

## Implementation notes

**1. Fill and current chapter from one scroll read.** Read `scrollY` and each chapter's `offsetTop` once per frame. Write only when a value changes.

```js
function frame() {
  ticking = false;
  const y = scrollY, vh = innerHeight;
  let now = 0;
  chapters.forEach((ch, i) => {
    const f = Math.min(1, Math.max(0, (y + vh - ch.offsetTop) / ch.offsetHeight));
    const v = Math.round(f * 1000) / 1000;
    if (v !== segs[i].last) { segs[i].last = v; segs[i].fill.style.transform = `scaleX(${v})`; }
    if (ch.offsetTop <= y + vh * 0.5) now = i;
  });
  if (now !== current) {
    segs[current]?.b.removeAttribute('aria-current');
    segs[now].b.setAttribute('aria-current', 'step');
    where.textContent = `${pad(now + 1)} / ${pad(total)}`;
    current = now;
  }
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
```

**2. Enter and reset with one observer.** Two thresholds give you hysteresis, so a chapter half off screen does not flicker.

```js
const io = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (e.intersectionRatio >= 0.45) e.target.classList.add('in');
    else if (e.intersectionRatio < 0.05) e.target.classList.remove('in');
  }
}, { threshold: [0, 0.05, 0.45] });
chapters.forEach(ch => io.observe(ch));
```

**3. The overprint number.** One element, one pseudo copy, multiply.

```css
.num { position: relative; font: 400 128px/.82 var(--display); color: var(--blue); }
.num::after {
  content: attr(data-n); position: absolute; left: 0; top: 0;
  color: var(--pink); mix-blend-mode: multiply;
  transform: translate(5px, 4px);
}
.js .num::after { transform: translate(18px, 12px); transition: transform 900ms var(--ease) 150ms; }
.js .in .num::after { transform: translate(5px, 4px); }
```

Gate the hidden start state behind a `js` class on `html`. Without it, a reader with no script sees six blank chapters.

**4. Jump without a double scroll.**

```js
button.addEventListener('click', () => {
  ch.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
  ch.querySelector('h2').focus({ preventScroll: true });
});
```

Common mistakes:

- `scroll-snap-type: y mandatory`. On a phone it yanks the reader to the next chapter mid sentence.
- A 2px tall segment as the button. The bar can be 4px, the button must be 40px.
- Animating `width` on the segment fill. Use `scaleX` with `transform-origin: left`.
- Running all six loops at once. Pause them off screen.
- Making the number the heading. The number is decoration. The `h2` is the name.
- Fitting chapters with `height: 100vh` and `overflow: hidden`. Use `min-height`, so long copy at 360 wide grows instead of clipping.
- Forgetting the 84px bottom clearance. The browser bar then covers the button.
- A gradient or glow anywhere. Riso is two flat inks on paper. Overlap is the only blend.

Where it sits:

1. It is a brand story, a product launch story, or an annual report on a phone. One page, one story.
2. Keep it to four to eight chapters. Six is this demo.
3. Each chapter gets one idea, one drawing, one headline and at most 40 words.
4. The last chapter carries the only primary button on the page.

Rebuild order:

1. Lay out one chapter at 390×844 with the clearances.
2. Copy it into six chapters and add snapping.
3. Build the bar from the chapters and wire the fill.
4. Wire current chapter, label and segment taps.
5. Add the observer and the enter transitions.
6. Draw the six visuals and their motions.
7. Add the call to action.
8. Check 360×740, reduced motion and no-JS.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
