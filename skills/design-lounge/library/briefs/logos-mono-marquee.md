<!-- Design Lounge Nº 121 · "Logos mono marquee" · www.designlounge.live -->

# Logos mono marquee

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A logos section for **Tally**, a payroll product. Two 96px rows of monochrome wordmarks — names set in Schibsted Grotesk or IBM Plex Mono, some with a 14px geometric prefix (square, circle, bars, plus) built from CSS, never from image files. Row A scrolls left in 42s; row B scrolls right in 54s. Hover or focus a row pauses that row only. Under `prefers-reduced-motion: reduce` both tracks are static and the duplicate set is hidden. This is a quiet swiss strip, not a kinetic type specimen: 18px marks on `#F4F4F0`, hairlines, no colour logos.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ ■ Tally      Payroll   Tax   Pricing                  Open a book    │ 56
│                                                                      │
│ USED IN 48 PAYROLLS                    Two rows                      │
│ Teams that run the book                Monochrome type               │
│ on Tally                               Hover a row to pause          │ 48+36
│──────────────────────────────────────────────────────────────────────│
│ ■ Northline │ HARBOR & CO │ ○ VALE CIVIC │ ≡ Kiln Studio │ … →      │ 96
│──────────────────────────────────────────────────────────────────────│
│ ← WESTBOUND │ ○ Ledger & Son │ ≡ MOTH HOUSE │ Brine │ …             │ 96
│──────────────────────────────────────────────────────────────────────│
│ Wordmarks set in type · no image files     42 s / 54 s · linear · …  │ 20+
└──────────────────────────────────────────────────────────────────────┘
  pad 64
```

- `<nav>` 56px: `.brand`, three mono `.links a`, `.cta`.
- `<section aria-label="Customer wordmarks">`: `.lead`, `.rows`, `.hint`.
- Each `.row` contains `.track` > two `.set`s. The second set is a clone (`aria-hidden="true"`) so `translateX(-50%)` loops.
- Each `.logo` is a `<span>`: optional `.ico` + `.w` word. Variants: default 18px Grotesk, `.caps` 13px/600 +0.18em uppercase Grotesk, `.mono` 13px/500 +0.08em uppercase Plex Mono.
- Icon classes: `.sq` filled 14px square, `.ci` 1.5px ring, `.bars` two 2px rules, `.plus` 2px cross.

Row A names, in order: Northline (sq), Harbor & Co (caps), Vale Civic (mono + ci), Kiln Studio (bars), Orchard (caps + plus), Pine Desk, Atlas Yard (mono), Copper Mill (sq).

Row B names, in order: Westbound (caps), Ledger & Son (ci), Moth House (mono + bars), Brine, Oak & Hour (caps + plus), Second Shift, Quarry (mono + sq), Redoubt.

Do not use real brand names. Do not draw SVG logos.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---------|---------|----------|-----------|---------:|--------|-------|
| `.row.a .track` | load | translateX | 0 → −50% | 42s | linear | infinite |
| `.row.b .track` | load | translateX | −50% → 0 | 54s | linear | infinite, opposite |
| `.track` | row hover / focus-within | animation-play-state | running → paused | 0 | — | that row only |

Reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .row.a .track, .row.b .track { animation: none; transform: none; }
  .set:last-child { display: none; }
}
```

No easing on the scroll. No speed-up. No colour pulse.

## States

- **Row rest:** scrolling.
- **Row hover / focus-within:** that track paused. 2px `#111` focus ring, 3px offset, on the row box.
- **CTA rest:** 32px, 1px `#111` border, transparent fill, 11px mono uppercase.
- **CTA hover:** inverted.
- **Link hover:** colour `#111`.
- Wordmarks do not have their own hover colour. They stay `--mark` `#3A3A38`.

## Accessibility

- Section: `aria-label="Customer wordmarks"`.
- Each row is focusable with an `aria-label` that names the direction (“Customer row one, scrolling left” / “row two, scrolling right”).
- The cloned set is `aria-hidden="true"` so names are not read twice.
- Icons are `aria-hidden="true"`; the name in `.w` is the accessible text.
- Keyboard: Tab through brand → links → CTA → row A → row B. Focusing a row pauses it.
- Contrast: `#111` on `#F4F4F0` is 17:1; `#3A3A38` on `#F4F4F0` is ~11:1; `#6E6E6A` on `#F4F4F0` is 5.1:1.
- Hit targets: rows are 96px tall; CTA 32px with 12px padding. The pause target is the whole row, not a single wordmark.

## Responsive rules

- ≥ 1280: pad 64px, heading 40px, logo padding 36px, both rows moving.
- 1024–1279: pad 36px, heading 32px. Speeds unchanged.
- 768–1023: nav links hide, heading 28px, logo padding 22px. Rows still 96px.
- < 640: heading 24px. Keep two rows; do not stack the marquees. Reduced-motion static row may clip — that is acceptable.

## Acceptance checklist

- [ ] First frame shows the 40px heading and two 96px hairline rows of monochrome type already in motion.
- [ ] No `<img>`, no inline SVG wordmarks — names are type, icons are 14px CSS geometry.
- [ ] Row A duration is 42s left; row B duration is 54s right; both `linear` and infinite.
- [ ] Hovering or focusing a row pauses only that row; the other continues.
- [ ] Duplicate set is `aria-hidden` and the loop is `translateX(-50%)`.
- [ ] `prefers-reduced-motion: reduce` stops both tracks and hides the clones.
- [ ] Sixteen fictional names as specified; no real brands.
- [ ] CTA inverts on hover; focus rings are 2px `#111`, 3px offset.
- [ ] Palette stays near-white / black / grey — no accent colour on the marks.
- [ ] Demo fills 1280×800, starts with the piece header comment, and uses only Schibsted Grotesk + IBM Plex Mono.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: 56px nav (7px square + Tally + Payroll / Tax / Pricing in mono + “Open a book”). Lead: kicker “USED IN 48 PAYROLLS”, 40px heading “Teams that run the book on Tally”, right meta “**Two rows** / Monochrome type / Hover a row to pause”. Two hairline-boxed rows already moving. Footer hint names the 42 s / 54 s clocks.
2. Hover row A: `animation-play-state: paused` on that track only. Row B keeps moving.
3. Hover row B: same, only B pauses.
4. Keyboard-focus a row (`tabindex="0"`): same pause via `:focus-within`.
5. Leave the row: that track resumes from the same offset (CSS animation, not a JS restart).
6. Hover “Open a book”: invert to `#111` fill, `#F4F4F0` text.
7. Reduced motion: both animations `none`, transform none, the cloned `.set` is `display:none`. Eight wordmarks per row sit in document flow and may clip at the right edge — do not wrap them onto a second line inside the row.

## Tokens

```css
:root {
  --bg: #f4f4f0;          /* page */
  --ink: #111111;         /* type, CTA, focus, brand square */
  --ink-2: #6e6e6a;       /* kicker, links, meta */
  --ink-3: #9a9a94;       /* hint */
  --line: #d8d8d2;        /* hairlines */
  --mark: #3a3a38;        /* wordmarks + icons */

  --sans: "Schibsted Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;

  --nav-h: 56px;
  --row-h: 96px;
  --pad: 64px;
  --logo-pad-x: 36px;
  --ico: 14px;

  --t-fast: 160ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --dur-a: 42s;
  --dur-b: 54s;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Body | Schibsted Grotesk | 14px | 400 | 1.45 | 0 | sentence |
| Brand | Schibsted Grotesk | 15px | 600 | 1 | −0.03em | sentence |
| Nav links | IBM Plex Mono | 12px | 400 | 1 | 0 | sentence |
| CTA | IBM Plex Mono | 11px | 500 | 1 | +0.06em | UPPERCASE |
| Kicker / hint | IBM Plex Mono | 11px | 400 | 1–1.4 | +0.14em / +0.04em | UPPERCASE |
| Heading | Schibsted Grotesk | 40px | 600 | 1.1 | −0.03em | sentence |
| Meta | IBM Plex Mono | 12px | 400 / 500 | 1.5 | 0 | sentence |
| Wordmark default | Schibsted Grotesk | 18px | 500 | 1 | −0.02em | sentence |
| Wordmark caps | Schibsted Grotesk | 13px | 600 | 1 | +0.18em | UPPERCASE |
| Wordmark mono | IBM Plex Mono | 13px | 500 | 1 | +0.08em | UPPERCASE |

Heading measure is `max-width: 16ch` so it breaks onto two lines at 1280.

## Implementation notes

**Closed loop.** Duplicate the set so the track is two identical halves, then travel exactly 50%:

```css
.track { display: flex; width: max-content; }
.row.a .track { animation: marq 42s linear infinite; }
@keyframes marq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

Clone in JS on load so the markup lists each name once. Use `nextElementSibling`, not `[aria-hidden="true"]` — the 14px icons also have that attribute and would swallow the clone:

```js
['set-a', 'set-b'].forEach((id) => {
  const src = document.getElementById(id);
  src.nextElementSibling.innerHTML = src.innerHTML;
});
```

**Pause without restarting.** Do not remove the animation class. Use `animation-play-state: paused` on `:hover` and `:focus-within` of the row.

Common mistakes: colour logos or favicon PNGs; a single row; `ease` instead of `linear` (the seam jumps); restarting `animation` on mouseleave so the row snaps; giant kinetic type (that is a different piece); forgetting to hide the clone under reduced motion, which would show every name twice, static.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
