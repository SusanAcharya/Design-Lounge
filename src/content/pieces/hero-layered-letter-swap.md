---
title: "Layered letter word-swap hero"
summary: "A centred fintech hero whose second headline word swaps letter by letter: each glyph splits into coral and butter copies, then the new word gathers back."
platform: web
type: section
category: hero
tags: [hero, headline, word-swap, parallax, fintech]
styles: [playful, kinetic]
motion: rich
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#FBF7EF", "#0F3D2E", "#FF6B4A", "#FFC94D", "#BFE6D3"]
fonts: ["Unbounded", "Figtree"]
related: [scroll-lens-card-ticker, text-split-letter-wave]
---

# Layered letter word-swap hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from wickret.cuberto.com: the huge centred headline whose letters break into offset coloured copies and re-form into a new word, with floating cards and dots drifting around it. This rebuild is for **Brisa**, a fictional travel money card. The hero reads "Money, / Unfolded" and the second word cycles to "Unstuck" and "Unhurried". During a swap, each letter of the old word drops its ink colour and shows two copies, coral up-left and butter down-right, staggered left to right. Then the new word appears scattered and the copies slide home, so the ink letter is whole again. The feeling is a fintech that smiles. The detail worth copying is that the colour copies are pseudo-elements of each letter (`content: attr(data-c)`), so the effect costs no extra DOM and works on any word length.

## Reference behaviour

1. First frame: warm off-white page `#FBF7EF`. Top bar with the two-circle Brisa mark at left, links Cards, Travel, Security, and a mint "Get the app" pill at right. The centre stack reads eyebrow "ONE CARD · 38 CURRENCIES", then the headline "Money," over "Unfolded" at 112px, then a two-line lede, then a three-option segmented control. The top of a white phone card peeks up from the bottom edge.
2. On load, the letters of "Unfolded" start scattered and gather into place (620ms, 38ms stagger per letter).
3. Every 3600ms the second word advances: Unfolded → Unstuck → Unhurried → Unfolded. The segmented control follows, with `aria-pressed` on the current word.
4. A swap has two halves. Scatter: each old letter turns transparent and its coral and butter copies fly out to a random offset (coral −0.04 to −0.14em on x and −0.04 to −0.16em on y, butter +0.04 to +0.14em and +0.04 to +0.16em), 420ms expo-out, 38ms stagger. After `260 + letters × 38` ms the new word is built already scattered, and on the next frame the scatter class is removed, so the copies glide back and fade out over 620ms while the ink colour returns. The stagger is the same.
5. Clicking a segment swaps to that word right away and restarts the 3600ms timer. Clicking the current word does nothing. Clicks during a swap are ignored until it finishes.
6. Moving the pointer moves the nine floaters (six dots, three mini cards) by `pointer offset × depth`. Depth runs from −34 to +34px, and each mini card also rotates up to ±8° more. The phone card moves the other way (up to ±10px on x) and lifts 24px. All of it uses 900ms expo-out transitions. Leaving the window settles everything back.
7. Hovering "Get the app": a dark ink circle grows from the point where the pointer entered (scale 0 → 1.6, 360ms expo-out), the label turns off-white, and the label starts a ticker loop (four copies, 2.4s per loop).
8. The timer pauses when the tab is hidden.
9. Reduced motion: no auto-cycle, no scatter. A segment click replaces the word at once. No parallax, no ticker.

## Structure

```
1280 × 800, overflow hidden
┌──────────────────────────────────────────────────────────────────────┐
│ ●● Brisa                         Cards  Travel  Security [Get the app]│ 28px pad, 48px sides
│   •                                                        •          │
│ ▭(mini)            ONE CARD · 38 CURRENCIES                    ▭      │
│                      Money,                  112px / .98          │
│                     Unfolded                 (second line swaps)  │
│        •      Spend abroad at the rate you see. No       ◯        │
│               conversion fee, no surprise line …         ▭(mini)  │
│              [ Unfolded | Unstuck | Unhurried ]                   │
│     •                  ┌──────────────┐                    •      │
│                        │ TOTAL BALANCE│ phone 270×330, bottom -210│
└────────────────────────┴──────────────┴──────────────────────────────┘
```

- `header.top` holds `a.brand` and `nav.links` (`aria-label="Main"`), including `button.pill`.
- The floaters are `div.float` with `data-d` (depth px) and an optional `data-r` (resting rotation). They are absolutely positioned with percentage left and top values and have `pointer-events: none`.
- `main.stage` is the whole viewport (`position: absolute; inset: 0; display: grid; place-items: center`). It holds `p.eyebrow`, `h1`, `p.lede`, `div.swap[role=group]`, and a visually hidden `p#live[aria-live=polite]`.
- `h1` has two `span.line`. The second holds `span.w#word`, which JS fills with one `span.ch[data-c]` per letter, each with `--i`, `--dx1`, `--dy1`, `--dx2`, `--dy2`.
- `div.phone` is `aria-hidden`. It shows a balance label, "€4,812.60", and three coloured card chips.

## Tokens

```css
:root {
  /* colour */
  --bg: #FBF7EF;        /* page */
  --ink: #0F3D2E;       /* headline, primary text, active segment */
  --ink-2: #3F5E52;     /* lede, eyebrow, inactive segment */
  --line: #E8E0D0;      /* segmented control border, phone border */
  --coral: #FF6B4A;     /* first letter copy, focus, link underline */
  --butter: #FFC94D;    /* second letter copy */
  --mint: #BFE6D3;      /* pill rest, mini cards */
  --card: #FFFFFF;      /* phone, segmented control */
  /* type */
  --display: "Unbounded", system-ui, sans-serif;
  --sans: "Figtree", system-ui, sans-serif;
  /* space */
  --s1: 4px; --s2: 8px; --s3: 16px; --s4: 24px; --s5: 40px; --s6: 64px;
  /* radii */
  --r-pill: 999px; --r-card: 14px;
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-scatter: 420ms;
  --t-gather: 620ms;
  --stagger: 38ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Headline | Unbounded | 112px | 700 | 0.98 | −0.055em | Sentence |
| Brand | Unbounded | 20px | 700 | 1 | −0.02em | Title |
| Phone balance | Unbounded | 30px | 700 | 1.1 | −0.04em | — |
| Eyebrow | Figtree | 13px | 600 | 1 | 0.14em | Upper |
| Lede | Figtree | 18px | 400 | 1.5 | 0 | Sentence, max 440px |
| Nav links | Figtree | 15px | 600 | 1.5 | 0 | Title |
| Pill / segments | Figtree | 15px / 14px | 700 / 600 | 1 | 0 | Title |
| Phone label | Figtree | 11px | 600 | 1.4 | 0.06em | Upper |

Unbounded is wide. Keep its tracking negative, or "Unhurried" will not fit at 112px inside 1280px.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Stagger | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Letter ink | swap start | color | `--ink` → transparent | 180ms `--ease` | 38ms × i | instant swap |
| Coral copy | swap start | transform, opacity | 0 → (dx1, dy1), 0 → 1 | 420ms expo, opacity 160ms | 38ms × i | none |
| Butter copy | swap start | transform, opacity | 0 → (dx2, dy2), 0 → 1 | 420ms expo, opacity 160ms | 38ms × i | none |
| New word gather | rebuild + next frame | transform, opacity, color | scattered → home, copies fade 300ms | 620ms expo | 38ms × i | none |
| Auto-cycle | interval | word index | +1 | every 3600ms | — | off |
| Floaters | pointermove | translate, rotate | 0 → offset × depth | 900ms expo | — | static |
| Phone | pointermove | translate | 0 → (−10x, −24 − 14y) px | 900ms expo | — | static |
| Pill fill | pointerenter | scale | 0 → 1.6 from entry point | 360ms expo | — | none |
| Pill label | hover / focus | translateX ticker | 0 → −50% | 2.4s linear loop | — | static label |
| Nav link | hover | underline background-size | 0 → 100% × 2px | 240ms `--ease` | — | keep |

A word with N letters fully gathers after about `620 + N × 38` ms. Unlock clicks only after that.

## States

- Segment resting: `--ink-2` text on white. Hover: `--ink`. Pressed: `--ink` fill, `--bg` text, `aria-pressed="true"`.
- Pill resting: mint fill, ink label, one visible copy. Hover and focus-visible: ink circle fill, off-white label, ticker running.
- Nav link hover: a 2px coral underline grows from the left.
- Focus-visible everywhere: 2px coral outline, 3px offset, 6px radius.
- Busy (mid-swap): segment clicks are ignored. No visual disabled state, because the swap takes under a second.
- There are no loading or error states. The hero is static content.

## Accessibility

- One `h1`. The live region `#live` (`aria-live="polite"`) announces "Money, unstuck" on each swap. The `h1` points to it with `aria-describedby`.
- The `.ch` copies are pseudo-elements, so screen readers hear the word once. Do not render copies as real text nodes.
- The segmented control is `role="group"` with `aria-label="Headline word"`. Each option is a `button` with `aria-pressed`.
- Tab order: brand, three links, pill, three segments.
- The auto-cycle stops under reduced motion. If a product keeps it, add a pause control. WCAG 2.2.2 applies to movement that lasts longer than 5 seconds.
- Contrast: `#0F3D2E` on `#FBF7EF` is about 11:1, and `#3F5E52` on `#FBF7EF` is about 6.7:1. The coral and butter copies are decorative and only appear during a swap.
- Floaters and the phone are `aria-hidden` or have no text, and they ignore the pointer.
- Hit targets: segments are 40px tall, and the pill is 44px.

## Responsive rules

- ≥1280: as specified. The headline is 112px.
- 1024: the same layout. The headline still fits. Floaters keep their percentage positions.
- ≤900: the headline is 64px, the nav links hide (keep the pill), the top padding is 20px, and the lede is 16px with 20px side padding.
- <480: the headline is 42px, segment padding is 12px, and the mini cards hide. The dots stay.
- The phone card always stays centred and peeks from the bottom. It never pushes layout. It is absolute.
- Check that `document.documentElement.scrollWidth` equals the viewport width at 375. The page is `overflow: hidden`.

## Acceptance checklist

### Always

- [ ] The headline has two lines, and only the second word swaps.
- [ ] Each letter is its own span with two pseudo-element copies (`::before` and `::after`) using `content: attr(data-c)`.
- [ ] Scatter offsets are random per letter. Copy one goes up-left and copy two goes down-right.
- [ ] The swap is staggered left to right at a fixed delay per letter.
- [ ] Old letters scatter, the new word appears scattered, then gathers. Text never jumps without the copies.
- [ ] The segmented control shows the current word with `aria-pressed`, and clicks restart the timer.
- [ ] A live region announces each new phrase.
- [ ] Pointer parallax moves floaters by depth, and the phone moves the opposite way.
- [ ] Under reduced motion there is no auto-cycle, no scatter, no parallax, and no ticker.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] The headline reads "Money," / "Unfolded" in Unbounded 700 at 112px, `#0F3D2E`.
- [ ] The words cycle Unfolded → Unstuck → Unhurried every 3600ms.
- [ ] The copies are coral `#FF6B4A` and butter `#FFC94D` (butter in multiply).
- [ ] Scatter takes 420ms, gather 620ms, stagger 38ms, all expo-out `cubic-bezier(.16,1,.3,1)`.
- [ ] The "Get the app" pill is mint `#BFE6D3`. Its ink fill grows from the entry point and the label tickers.
- [ ] The phone card shows "€4,812.60" and three chips (ink, coral, butter).

## Implementation notes

**1. The letter copies are pseudo-elements.** One span per glyph, and the glyph also goes into `data-c`, so `::before` and `::after` can draw it twice. Put the transition delay on both the span and its pseudo-elements with the same `--i`.

```css
.ch { position: relative; display: inline-block; color: var(--ink);
  transition: color 180ms var(--ease) calc(var(--i) * var(--stagger)); }
.ch::before, .ch::after { content: attr(data-c); position: absolute; inset: 0 auto auto 0;
  opacity: 0; pointer-events: none;
  transition: transform var(--t-gather) var(--expo) calc(var(--i) * var(--stagger)),
              opacity 300ms var(--ease) calc(var(--i) * var(--stagger)); }
.ch::before { color: var(--coral); }
.ch::after  { color: var(--butter); mix-blend-mode: multiply; }
.w.out .ch { color: transparent; }
.w.out .ch::before { opacity: 1; transform: translate(var(--dx1), var(--dy1)); }
.w.out .ch::after  { opacity: 1; transform: translate(var(--dx2), var(--dy2)); }
```

**2. Build the new word already scattered, then release it on the next frame.** If you remove `.out` in the same frame you insert the spans, the browser never paints the scattered state and nothing animates.

```js
function swapTo(word) {
  el.classList.add('out');                       // old letters scatter
  setTimeout(() => {
    build(word);                                  // new spans, random --dx/--dy
    el.classList.add('out');
    el.offsetWidth;                               // force style flush
    requestAnimationFrame(() => el.classList.remove('out'));  // gather
  }, 260 + el.children.length * 38);
}
```

**3. The pill fill grows from the pointer.** Read the entry point on `pointerenter` and set it as `transform-origin` on the `::before` circle. Scale to 1.6 so a 148×44 pill is fully covered from any edge.

Common mistakes:

- Rendering the copies as real text. Screen readers then read "UUUnnn…".
- Using `ease` or `linear` for the gather. It needs the long expo tail so letters "land".
- Forgetting `display: inline-block` on `.ch`. Transforms do nothing on inline boxes.
- Letting the auto-cycle run under reduced motion.
- Animating `letter-spacing` or `width` for the swap, which makes the line reflow every frame. Only transform and opacity move.
- Different word widths shifting the line: it is centred, so this is fine and expected. Do not fix the width.
