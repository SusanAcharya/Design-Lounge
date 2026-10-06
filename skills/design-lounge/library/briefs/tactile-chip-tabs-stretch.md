<!-- Design Lounge Nº 441 · "Tactile chip tabs with a stretch" · www.designlounge.live -->

# Tactile chip tabs with a stretch

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from 60fps.design, a gallery of mobile micro-interaction clips: this piece takes the "tactile tab button" idea from its travel shots (pills that squash when tapped while the highlight slides and the feed reloads) and rebuilds it as working tabs. It is the explore screen of a fictional Nepali travel app called Basera. Four raised chips (Stays, Homestays, Treks, Food walks) sit under a raised search pill. Each chip has a 3px "lip" under it, so pressing it sinks 3px and loses the lip like a physical key. The selected chip sits inside a dark well that travels to the new chip by stretching: the leading edge leaves first and the trailing edge follows 60ms later on a slower spring. The grid then shows four shimmering skeleton cards for 650ms and the real cards rise in. The detail worth copying is the two-edge stretch: animating `left` and `right` on different timings makes the indicator feel elastic without any physics library.

The language is clay: warm grey ground, cream raised surfaces with a hard lip and a soft drop shadow, inset shadows for wells, one brick accent for focus and saved hearts.

## Structure

```
390 × 844, padding-top 54
┌──────────────────────────────────────┐
│ ╭──────────────────────────────────╮ │ search pill 58px, margin 6 20 0
│ │ ⌕   Where to next?         ( ≡ ) │ │ filter well 42px
│ │     Any week · 2 guests          │ │
│ ╰──────────────────────────────────╯ │
│                                      │ 18px
│ [■ Stays 128] [⌂ Homestays 46] [▲ Tre│ chips 46px, gap 8, scrolls
│                                      │ 12px
│ Stays                128 near Pokhara│ serif 30 / 13px
│ ┌──────────────┐ ┌──────────────┐    │
│ │   art 4:4.6  │ │          (♡) │    │ cards in 2 cols, gap 14
│ └──────────────┘ └──────────────┘    │ radius 18
│ Lakeside Loft    Phewa Glass House   │ serif 20
│ Baidam, Pokhara  Sedi Bagar          │ 12px muted
│ Rs 4,200 / night Rs 6,800 / night    │ 13px, price bold
│ ┌──────────────┐ ┌──────────────┐    │
│ …                                    │
└──────────────────────────────────────┘
```

- The search is a single `button` with an `aria-label` that reads the whole pill.
- The chip row is a scroll container `div.tabs-wrap` (padding 4 20 12 so shadows are not clipped) holding `div.tabs[role=tablist]` with `width: max-content`.
- The well is a `span.ind` absolutely positioned inside `.tabs`, `aria-hidden`, under the chips (`z-index` 0 vs chips 1).
- Each chip is a `button role="tab"` with icon, label and a count `span`.
- The heading row has the `h1` (current tab name) and the count line.
- The panel is a `section role="tabpanel"` labelled by the `h1`, with `aria-busy`.
- Each listing is an `article` with an art block (inline SVG landscape), a heart `button`, `h2`, place `p` and price `p`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Chip press | pointerdown | transform, box-shadow | 0 → translateY(3px) scale(.95), raised → pressed | 90ms | `--spring` | 0 | none |
| Chip release | pointerup/leave | transform, box-shadow | back to rest | 320ms | `--spring` | 0 | none |
| Well, leading edge | select | `right` (moving right) or `left` (moving left) | old → new | 300ms | `--soft` | 0 | instant |
| Well, trailing edge | select | the other edge | old → new | 460ms | `--soft` | 60ms | instant |
| Chip colour | select | color, background-color | swap | 200ms | `--std` | 0 | 100ms linear |
| Row scroll | select off-screen chip | scrollLeft | — | browser smooth | — | 0 | auto |
| Skeleton shimmer | while loading | background-position | 100% → 0 | 1.1s loop | linear | 0 | static |
| Card rise | content arrives | opacity, translateY | 0,10px → 1,0 | 420ms | `--out` | 0/50/100/150ms | none |
| Heart press | :active | transform | 1 → 0.86 | 300ms | `--spring` | 0 | none |

## States

- Chip resting: cream, 3px lip, soft drop shadow, ink label, muted count.
- Chip pressed: 3px lower, 0.95, no lip, small shadow.
- Chip selected: transparent background over the dark well, cream text, no shadow; pressing it scales 0.95 without the 3px drop.
- Focus-visible: 2px brick outline, 3px offset, on chips, search, hearts.
- Loading: skeleton grid, panel `aria-busy="true"`, shimmer.
- Loaded: real grid, `aria-busy="false"`.
- Heart off: ink outline. Heart on: brick fill and stroke, `aria-pressed="true"`.
- Empty (not in demo): replace the grid with one centred serif line "Nothing here this week" and a raised chip "Clear dates".
- Error (not in demo): keep skeletons static (no shimmer) and add a 13px line "Could not load. Pull to retry."

## Accessibility

- `role="tablist"` labelled "Kinds of trip"; each chip `role="tab"` with `aria-selected` and `aria-controls="panel"`.
- Roving tabindex: only the selected chip has `tabindex=0`. Arrow keys move and select; Home/End jump.
- The panel is `role="tabpanel"` labelled by the heading; `aria-busy` is true during skeletons.
- A hidden live region announces "31 guided routes" when the cards arrive.
- The well is `aria-hidden`; selection is also shown by text colour and by `aria-selected`.
- Hearts have `aria-label="Save Lakeside Loft"` and `aria-pressed`.
- Contrast: `#2b2a26` on `#f3efe6` ≈ 12:1; `#faf7f0` on `#2b2a26` ≈ 13:1; `#6f6b61` on `#e6e1d6` ≈ 4.5:1.
- Hit targets: chips 46px tall, search 58px, hearts 40px, filter 42px.

## Responsive rules

- At 360 wide the chip row still scrolls; the grid stays two columns (cards about 156px wide).
- Below 720px tall the art ratio drops from 4:4.6 to 4:3.6 so two rows still fit.
- At tablet width, the row fits without scrolling; the grid becomes four columns with the same 14px gap; chip sizes do not change.
- The scroll container has 20px side padding, so the first chip lines up with the page margin and the last chip can scroll fully into view.
- Do not draw a status bar.

## Acceptance checklist

### Always

- [ ] Raised surfaces have a hard 3px lip plus a soft shadow; pressing removes the lip and moves the element down 3px.
- [ ] Release springs back with overshoot.
- [ ] The selection well animates its two edges on different timings, so it stretches mid-move.
- [ ] The well stretches in the direction of travel (leading edge first).
- [ ] Changing tab shows skeletons, then staggered real content; rapid changes show only the last tab.
- [ ] The tab row scrolls inside itself; the page has no horizontal scroll at 375px.
- [ ] Tablist semantics with roving tabindex and arrow keys.
- [ ] `aria-busy` reflects loading.
- [ ] Reduced motion: no press transform, no stretch, no shimmer, no rise; all states still visible.
- [ ] Hit targets at least 40px.

### This demo

- [ ] Chips Stays 128, Homestays 46, Treks 31, Food walks 19; Stays selected first.
- [ ] Search reads "Where to next?" and "Any week · 2 guests".
- [ ] Ground `#e6e1d6`, chips `#f3efe6`, lip `#cbc3b3`, well `#2b2a26`, brick `#c2412d`.
- [ ] First grid: Lakeside Loft, Phewa Glass House, Annapurna Rooftop, Old Bazaar Rooms with prices in Rs per night.
- [ ] Skeleton duration 650ms; well edges 300ms and 460ms with 60ms delay.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: search pill "Where to next? / Any week · 2 guests" with a sunken filter button; chips Stays 128, Homestays 46, Treks 31, Food walks 19; Stays is selected (cream text in the dark well); heading "Stays" in serif with "128 near Pokhara"; a 2×2 grid of listings.
2. The chip row scrolls horizontally inside itself (scrollbar hidden). At 390 wide the third chip is cut off at the edge, which tells the user it scrolls. The page never scrolls sideways.
3. Pointer down on a chip: it moves 3px down and scales to 0.95 in 90ms; its lip shadow goes to 0 and its drop shadow shrinks. `navigator.vibrate(6)` fires where supported.
4. Pointer up or leave: the chip returns in 320ms on `cubic-bezier(.34,1.56,.64,1)`, overshooting slightly upward.
5. Click selects the chip. The well moves: if moving right, its right edge animates over 300ms and its left edge over 460ms with a 60ms delay; moving left, the reverse. Both use `cubic-bezier(.34,1.3,.64,1)`. Mid-move the well is wider than either chip.
6. Selected text turns cream (`#faf7f0`) and its count turns `#b8b2a5`; the previously selected chip regains its raised cream surface.
7. If the chosen chip is partly out of view, the row scrolls smoothly to bring it in, with 40px to spare on the left.
8. The heading and count line change immediately (e.g. "Treks / 31 guided routes").
9. The grid becomes four skeleton cards (photo block + two bones) with a 1.1s left-to-right shimmer. The panel has `aria-busy="true"`.
10. After 650ms the real cards replace the skeletons; each rises 10px and fades in over 420ms, staggered 0, 50, 100, 150ms. `aria-busy` returns to false and a live region announces the count line.
11. Selecting quickly again cancels the pending swap; only the latest tab's cards appear.
12. Each card has a 40px heart button; tapping toggles `aria-pressed`, fills it brick, and squeezes it to 0.86 while pressed.
13. Keyboard: the chips are a tablist with roving tabindex. Arrow Left/Right wrap, Home and End jump; selection follows focus. Enter or Space plays the press animation for 120ms.

## Tokens

```css
:root {
  --bg: #e6e1d6;        /* clay ground */
  --chip: #f3efe6;      /* raised surfaces */
  --lip: #cbc3b3;       /* 3px key lip under raised surfaces */
  --ink: #2b2a26;       /* text, the well */
  --ink-2: #55524a;     /* search secondary */
  --ink-3: #6f6b61;     /* counts, meta */
  --line: #d3ccbe;
  --brick: #c2412d;     /* focus ring, saved heart */
  --paper: #faf7f0;     /* text on the well */
  --skel: #dcd6ca;      /* skeleton base */
  --skel-hi: #ebe6dc;   /* skeleton shimmer */
  --sans: "Bricolage Grotesque", system-ui, sans-serif;
  --serif: "Instrument Serif", Georgia, serif;
  --chip-h: 46px;
  --search-h: 58px;
  --r-pill: 999px;
  --r-card: 18px;
  --s-2: 8px; --s-3: 12px; --s-4: 14px; --s-5: 18px; --s-6: 20px;
  --raised: inset 0 1px 0 #fff, 0 3px 0 var(--lip), 0 8px 14px -8px rgba(43,42,38,.35);
  --pressed: inset 0 1px 0 #fff, 0 0 0 var(--lip), 0 2px 4px -2px rgba(43,42,38,.3);
  --well: inset 0 2px 4px rgba(0,0,0,.4), 0 1px 0 rgba(255,255,255,.5);
  --spring: cubic-bezier(.34, 1.56, .64, 1);   /* chip release */
  --soft: cubic-bezier(.34, 1.3, .64, 1);      /* well edges */
  --out: cubic-bezier(.16, 1, .3, 1);
  --std: cubic-bezier(.2, .7, .2, 1);
  --t-press: 90ms; --t-release: 320ms;
  --t-lead: 300ms; --t-trail: 460ms; --t-trail-delay: 60ms;
  --t-skeleton: 650ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Section heading (h1) | Instrument Serif | 30px | 400 | 1 | -0.01em |
| Card title (h2) | Instrument Serif | 20px | 400 | 1.1 | 0 |
| Search title | Bricolage Grotesque | 15px | 700 | 1.4 | 0 |
| Search sub | Bricolage Grotesque | 12px | 400 | 1.4 | 0 |
| Chip label | Bricolage Grotesque | 15px | 500 | 1 | 0 |
| Chip count | Bricolage Grotesque | 12px | 400 | 1 | 0 |
| Count line | Bricolage Grotesque | 13px | 400 | 1.4 | 0 |
| Card meta | Bricolage Grotesque | 12px | 400 | 1.4 | 0 |
| Price | Bricolage Grotesque | 13px | 700 amount / 400 unit | 1.4 | 0 |

The serif names places. The grotesk does every control and number.

## Implementation notes

**1. The stretching well.** Position it with `left` and `right` (both measured from the tab container), and choose which edge leads by direction. Set the class before the new values so the right transition is in place.

```js
function place(i, animate) {
  const c = chips[i], w = tabs.offsetWidth;
  const left = c.offsetLeft, right = w - (c.offsetLeft + c.offsetWidth);
  ind.classList.remove('go-r', 'go-l');
  if (animate) ind.classList.add(i > cur ? 'go-r' : 'go-l');
  ind.style.left = left + 'px';
  ind.style.right = right + 'px';
}
```

```css
.ind { position: absolute; top: 0; height: 46px; border-radius: 999px;
  background: var(--ink); box-shadow: var(--well); pointer-events: none; }
.ind.go-r { transition: right .3s var(--soft), left .46s var(--soft) .06s; }
.ind.go-l { transition: left .3s var(--soft), right .46s var(--soft) .06s; }
```

Common mistake: animating `transform: translateX` plus `width`. That moves the centre, not the edges, and the stretch looks like a zoom. Re-measure after fonts load, or the well starts a few pixels off.

**2. The key press.** Use a class on pointerdown rather than `:active`, so the press shows instantly on touch and the release can have its own slower spring.

```css
.chip { box-shadow: var(--raised);
  transition: transform .32s var(--spring), box-shadow .32s var(--std); }
.chip.down { transform: translateY(3px) scale(.95); box-shadow: var(--pressed);
  transition-duration: .09s; }
```

```js
chip.addEventListener('pointerdown', () => chip.classList.add('down'));
['pointerup', 'pointerleave', 'pointercancel'].forEach(ev =>
  chip.addEventListener(ev, () => chip.classList.remove('down')));
```

**3. Skeleton hand-over with cancellation.**

```js
clearTimeout(timer);
panel.setAttribute('aria-busy', 'true');
grid.className = 'grid skel'; grid.innerHTML = skeletonHTML;
timer = setTimeout(() => {
  grid.className = 'grid real'; grid.innerHTML = cardsHTML(tab);
  panel.setAttribute('aria-busy', 'false'); status.textContent = tab.meta;
}, 650);
```

In a real app replace the timeout with the request, but keep a minimum of about 300ms so the skeleton never flashes for one frame.

Common mistakes overall:

- Letting the chip row widen the page instead of scrolling inside its own container.
- Clipping the chip shadows with `overflow-x: auto` and no vertical padding (keep 4px top, 12px bottom).
- A brick-coloured well. The well is ink; brick is only for focus and saved hearts.
- Using the serif for chip labels.
- Swapping the cards without skeletons, which loses the "feed reloads" beat that sells the tab change.
- Shimmer moving right to left. It runs left to right, like reading.
- Forgetting `pointerleave`, so a chip stays pressed when the finger slides off.

Where it sits: the top of a browse feed in any marketplace (stays, food, classes). Use three to six chips; past six, the stretch travels too far and should be replaced by a plain underline.

Rebuild order:

1. Set the clay ground and build the raised search pill with its lip and sunken filter well.
2. Build one raised chip with icon, label and count; confirm the 3px lip and soft shadow.
3. Put four chips in a `max-content` row inside a scroll container with 20px side padding.
4. Add the press class on pointerdown and the release spring; test sliding a finger off a chip.
5. Add the dark well under the chips; position it with `left` and `right` after fonts load.
6. Add the two direction classes so the leading edge moves first.
7. Wire selection, roving tabindex, arrow keys and scroll-into-view.
8. Build the card grid from data with SVG landscape art and heart buttons.
9. Add the skeleton swap with cancellation and `aria-busy`, then the staggered rise.
10. Add the reduced-motion override and check 360, 375 and short screens.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
