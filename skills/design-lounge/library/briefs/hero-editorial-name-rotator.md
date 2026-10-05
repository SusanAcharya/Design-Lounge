<!-- Design Lounge Nº 109 · "Editorial name rotator hero" · www.designlounge.live -->

# Editorial name rotator hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The opening of an independent designer's site (Isaura Venn, Lisbon). A 72px nav, a 212px italic name stacked on two lines, a 392×384 art plate on the right, and a 38px deck line whose two variable-width slots rotate through five pairings: *identities for independent hotels.*, *interfaces for fintech founders.*, and so on. Each tick also crossfades the plate, the caption, a 5-tick progress, and the selected-work row. The feeling is fashion-editorial: wine `#1C0A0D`, cream type, one gold accent, Didot contrast. The detail worth copying is the slot width — each reel measures the upcoming word and eases the slot's `width` in 600ms so the line never has a gap or overlap.

## Structure

```
1280 × 800  bg #1C0A0D + radial #2B1114 at 80% 0
┌────────────────────────────────────────────────────────────────────────┐
│ nav 72  I.V          WORK  ABOUT  NOTES  CONTACT     ● Booking from Jan 2027 │
│ pad 0 48, gold dot on the I.V span, 1px cream/16 line                      │
│                                                                        │
│  INDEPENDENT DESIGNER · LISBON · SINCE 2014     left 48, top 100       │
│  Isaura                                         212px italic / .86     │
│           Venn.                                 2nd line pad-left 330  │
│                                         ┌ plate 392×384, left 840, top 100
│                                         │ p0…p4 CSS "photographs"      │
│                                         └ caption 01/05  Casa Alma…    │
│  Designs [identities] for [independent hotels.]   38px, top 556        │
│  [ Pause ]  ━━━━━━━━━  ticks                                           │
│                                         Selected work 2019–2026        │
│                                         01 Casa Alma, hotel identity 2026
│                                         02 Verdello banking app 2025   │
│                                         … five rows, left 840, top 552 │
│  studio@isauravenn.pt   +351 912 480 117   Represented by Atelier Norte│
└────────────────────────────────────────────────────────────────────────┘
  foot bottom 34px; availability pill on the nav right
```

- `<nav aria-label="Primary">` — `.mono` "I<span>.</span>V", four uppercase links, `.avail` with 6px gold pip.
- `.kick` — 11px +0.2em uppercase, gold middots.
- `<h1>` — two `<span>`s: "Isaura" / "Venn<em>.</em>". Pointer-events none (the plate is behind).
- `#plate` 392×384 at left 840 top 100, `aria-hidden`. Five absolutely stacked `.p0–.p4`.
- `#cap` under the plate: "Selected **01** / 05" and `#capt`.
- `.line` — visually "Designs {slot a} for {slot b}". An `.sr` sentence states the five pairings in full for assistive tech; the visual line is `aria-hidden`.
- `.ctl` — Pause button + `#ticks` (five `<i>` built in JS).
- `<section class="idx" aria-label="Selected work">` — heading + five `<a data-i>`.
- `.foot` — email, phone, representation.

Slot words (index-aligned with plates and rows):

| i | A (cream)       | B (gold)              | Caption                  | Row                                      | Plate |
|---|-----------------|-----------------------|--------------------------|------------------------------------------|-------|
| 0 | identities      | independent hotels.   | Casa Alma, Comporta      | 01 Casa Alma, hotel identity 2026        | p0 warm dusk |
| 1 | interfaces      | fintech founders.     | Verdello, Porto          | 02 Verdello banking app 2025             | p1 teal conic + gold disc |
| 2 | book jackets    | small publishers.     | Rua Editions, Lisbon     | 03 Rua Editions, book covers 2024        | p2 split cream/red, "Rua" |
| 3 | wayfinding      | public museums.       | Museu do Mar, Cascais    | 04 Museu do Mar signage 2022             | p3 navy bars + gold spine |
| 4 | packaging       | perfumers.            | Oriel, Paris             | 05 Oriel perfume packaging 2019          | p4 rose radial |

Plates are CSS only: layered radial / conic / repeating-linear gradients. p2's `::after` is the word "Rua" at 132px italic.

## Motion

| Element          | Trigger     | Property            | From → To                      | Duration | Easing   | Notes |
|------------------|-------------|---------------------|--------------------------------|----------|----------|-------|
| Reel A           | tick        | translateY          | −j×100/(n+1)%                  | 700ms    | `--expo` | immediate |
| Reel B           | tick        | translateY          | same                           | 700ms    | `--expo` | delay 200ms |
| Slot width       | tick        | width               | previous word → next offsetWidth | 600ms  | `--expo` | both slots |
| Plate            | tick / row  | opacity, scale      | 0, 1.06 → 1, 1                 | 500 / 1200ms | ease / expo | only `.on` |
| Index row        | active      | color, padding-left | cream-2, 0 → cream, 10px       | 180 / 700ms | ease / expo | gold numeral when `.on` |
| Ticks            | active      | background          | line → gold                    | 180ms    | —        | |
| Wrap snap        | j === n     | transform           | −n → 0, no transition          | after 720ms | —     | duplicate first word |
| Pause / nav      | hover       | border, color       | line / cream-2 → gold / cream  | 180ms    | `--ease` | |

Autoplay: `setInterval(next, 2600)`. `next` calls `show(i+1)` with `i` stored as `w = j % n` for plates/rows. Reduced motion: durations 1ms, interval never started.

## States

- **Playing (default):** Pause label, two bars, `aria-pressed="false"`.
- **Paused:** Play label, triangle path `M2 1l7 4-7 4z`, `aria-pressed="true"`. Interval cleared.
- **Row hover / focus / `.on`:** cream type, 10px left padding, gold italic numeral.
- **Nav hover / current:** cream (from cream-2).
- **Availability:** 1px `--line` pill, 7px 14px padding, 6px gold disc.
- **Focus-visible:** 1px gold outline, 4px offset on links and the Pause button.
- **Plate rest:** opacity 0, scale 1.06; `.on` opacity 1, scale 1.

## Accessibility

- Selected work is a labelled `<section>`. Rows are links (hash prevented) so they take focus; hover and focus both pin the index.
- The visual rotator is `aria-hidden`. An `.sr` sentence lists every pairing in reading order so a screen reader is not trapped in a looping live region.
- Pause is a real `<button>` with `aria-pressed`. Reduced motion starts paused.
- Tab order: monogram → Work (current) → About → Notes → Contact → five work rows → email → Pause.
- Contrast: cream on wine is high; `--cream-2` (~8:1) is secondary; `--cream-3` is 11px uppercase only.
- Hit targets: Pause 32px tall, rows ~32px (7px pad + line), nav links have 72px bar.

## Responsive rules

- ≥ 1280: as specified. Name 212px, plate at x=840.
- 1024–1279: name 160px; second line pad-left 240px; plate 320px wide, shift left to 720.
- 768–1023: stack — plate under the name at full content width; slots may wrap the deck onto two lines (keep `white-space: nowrap` on each reel word, not the whole line).
- < 640: name 72px; hide the five-row index or move it below; Pause stays. Still wait on `fonts.ready` before measuring slot widths.
- Reduced motion as above.

## Acceptance checklist

- [ ] Name is 212px italic Bodoni; second line is padded 330px; the period is gold.
- [ ] Plate is 392×384 at left 840 / top 100 and crossfades among five CSS plates.
- [ ] Deck reads "Designs {A} for {B}" with A cream italic and B gold italic.
- [ ] Slots change every 2600ms; B lags A by 200ms; width eases 600ms to the new word's width.
- [ ] Pairings, captions and rows stay index-aligned (Casa Alma with identities / hotels, Oriel with packaging / perfumers).
- [ ] Hover or focus on a work row jumps to that index and pauses autoplay; leave resumes.
- [ ] Pause toggles `aria-pressed`, the icon, and the interval.
- [ ] After the fifth word the reel snaps to 0 without a visible jump (duplicate first item).
- [ ] Reduced motion loads paused on pairing 0 with 1ms transitions.
- [ ] Work rows show 01–05, years 2026…2019, and gold numerals when current.
- [ ] Focus rings are 1px gold, 4px offset.
- [ ] Slot widths are measured after `document.fonts.ready`, not on first paint.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state after `document.fonts.ready`: slots show "identities" and "independent hotels."; plate 0 (Casa Alma sunset) is `.on` at scale 1; caption "Selected **01** / 05" + "Casa Alma, Comporta"; first work row `.on`; first tick gold. Autoplay every 2600ms.
2. Each tick: left reel moves immediately; right reel moves 200ms later (`--lag`). Transform `translateY(-j * 100 / (n+1)%)` over 700ms expo. Slot width eases to the new word's `offsetWidth` over 600ms. Plate `.on` swaps (opacity 500ms, scale 1.06 → 1 over 1200ms).
3. After the last word, the reel includes a duplicate of index 0. When `j === n`, after 720ms snap `translateY(0)` with `transition:none` so the next cycle has no visible jump.
4. Hover or focus a selected-work row: `show(+dataset.i)` and **pause** the interval. Mouseleave / blur resumes (`run()`). Click is `preventDefault` (the rows are not navigations in the demo).
5. Pause button: toggles `paused`, `aria-pressed`, label Pause ↔ Play, icon bars ↔ triangle. While paused the interval is cleared; Play calls `run()`.
6. Reduced motion: all transition-durations 1ms; `paused` starts true; button reads Play. `show(0)` still runs so widths are correct. Autoplay does not start.
7. Nav "Work" has `aria-current="page"`. Hash links prevent default.

## Tokens

```css
:root {
  /* colour — wine ground, cream type, one gold */
  --bg: #1c0a0d;
  --bg-2: #26100f;        /* plate backing */
  --cream: #f2e7d8;
  --cream-2: #c9b9a6;
  --cream-3: #8f7b70;
  --line: rgba(242, 231, 216, .16);
  --gold: #c9a86a;
  --wine: #5a1a22;

  /* type */
  --serif: "Bodoni Moda", Didot, "Times New Roman", serif;
  --sans: "Tenor Sans", "Gill Sans", sans-serif;

  /* layout */
  --name: 212px;
  --slot-h: 1.26em;
  --plate-w: 392px;
  --plate-h: 384px;
  --nav-h: 72px;

  /* motion */
  --t-micro: 180ms;
  --t-slot: 700ms;
  --t-width: 600ms;
  --t-plate: 500ms;
  --dwell: 2600ms;
  --lag: 200ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family      | Size | Weight | Line-height | Tracking | Case      |
|-----------------|-------------|-----:|-------:|------------:|---------:|-----------|
| Body            | Tenor Sans  | 14px | 400    | 1.5         | 0        | sentence  |
| Monogram        | Bodoni Moda | 26px | 500 italic | 1        | −0.02em  | letters   |
| Nav             | Tenor Sans  | 12px | 400    | 1           | +0.16em  | UPPERCASE |
| Availability    | Tenor Sans  | 12px | 400    | 1           | +0.06em  | sentence  |
| Kick            | Tenor Sans  | 11px | 400    | 1           | +0.2em   | UPPERCASE |
| Name            | Bodoni Moda | 212px| 400 italic | 0.86     | −0.045em | title     |
| Period          | Bodoni Moda | 212px| 400    | 0.86        | −0.045em | —         |
| Deck            | Bodoni Moda | 38px | 400    | 1.1         | −0.01em  | sentence  |
| Slot words      | Bodoni Moda | 38px | 400 italic | 1.26em   | −0.01em  | sentence  |
| Caption / idx h | Tenor Sans  | 11px | 400    | 1           | +0.14em / +0.2em | UPPERCASE |
| Index rows      | Tenor Sans  | 13px | 400    | 1           | 0        | sentence  |
| Index numeral   | Bodoni Moda | 11px | 400 italic | 1        | 0        | numerals  |
| Controls        | Tenor Sans  | 12px | 400    | 32px h      | +0.08em  | sentence  |
| Footer          | Tenor Sans  | 12px | 400    | 1           | +0.06em  | mixed     |

Second name line is padded 330px so "Venn." sits under the empty right of "Isaura" and beside the plate. Gold period via `<em>`.

## Implementation notes

**Build n+1 reel items** (duplicate index 0) and size the slot from the live child:

```js
function build(slot, words) {
  const reel = slot.firstChild;
  words.concat(words[0]).forEach((w) => {
    const s = document.createElement('span'); s.textContent = w; reel.appendChild(s);
  });
  return reel;
}
function move(slot, reel, j, instant) {
  reel.style.transition = instant ? 'none' : '';
  reel.style.transform = 'translateY(' + (-j * 100 / (n + 1)) + '%)';
  slot.style.width = reel.children[j].offsetWidth + 'px';
  if (j === n) setTimeout(() => {
    reel.style.transition = 'none';
    reel.style.transform = 'translateY(0)';
    void reel.offsetWidth;
    reel.style.transition = '';
  }, 720);
}
```

**Stagger B, keep plates on `j % n`:**

```js
function show(j) {
  const w = j % n;
  move(sa, ra, j);
  setTimeout(() => move(sb, rb, j), 200);
  plates.forEach((p, x) => p.classList.toggle('on', x === w));
  /* rows, ticks, caption similarly */
}
```

**Do not measure before Bodoni loads** or the first width will be fallback serif and jump:

```js
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(init);
```

Common mistakes: animating `top` on each word instead of one reel `translateY` (widths will not stay in a slot); using `ch` units instead of measured px (italic Didot is not monospaced); starting the interval before `fonts.ready`; putting both slots on the same clock (the 200ms lag is the editorial beat); drawing the plates as empty grey boxes instead of the specified gradients.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
