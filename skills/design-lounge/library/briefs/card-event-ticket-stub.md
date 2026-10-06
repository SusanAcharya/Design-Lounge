<!-- Design Lounge Nº 198 · "Concert ticket stack with foil strip" · www.designlounge.live -->

# Concert ticket stack with foil strip

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The "your tickets" view after buying three seats for a fictional gig: Static Bloom, Low Orbit Tour, with Moth Radio, at Foundry Hall on Friday 23 October. Three paper tickets lie in a loose pile on a charcoal table. Each is 600 × 230 with a riso-printed art panel (pink and blue halftone dots overprinted with multiply), the band name in Dela Gothic One, a facts row, and a 150px stub behind a dotted perforation. The stub carries a 30px holographic foil strip, a mini seat map with section B filled pink and a dot for the seat, and a red serial number. Moving the pointer anywhere slides the foil's colour bands and sweeps a white sheen across it. "Fan out" spreads the pile like a hand of cards so all three stubs show; clicking a ticket lifts it. The ticket stocks are tinted cream, pink and blue so the three read apart. The detail worth copying is that the foil is driven by two global custom properties, so all strips catch the same light.

## Structure

```
1280 × 800, body grid centred, gap 10px, charcoal with a lighter radial centre
  header row, 12px mono caps
  .fit width min(943px, 100%)  →  .stage 820 × 470, scale k (max 1.15)
     tickets absolute at left 110, top 120, transform-origin 50% 380%
  ┌─ 150 art ─┬──────────── 300 body ─────────────┬┄┬30┬──── 120 side ────┐
  │ pink dots │ FOUNDRY HALL PRESENTS (pink 9px)  │┄│▓▓│ ADMIT ONE        │
  │  ◯  blue  │ STATIC                            │┄│▓▓│ [STAGE]          │
  │  dots ◯   │ BLOOM  34px Dela Gothic           │┄│▓▓│  ╭───╮ sec A     │
  │ ▬▬▬▬▬▬▬▬  │ Low Orbit Tour · with Moth Radio  │┄│▓▓│  ╰▓▓▓╯ sec B ●   │
  │ ▬▬▬▬▬     │ ───────────────────────────────── │┄│▓▓│  ╰───╯ sec C     │
  │ LOW ORBIT │ DATE    DOORS  SEC  ROW  SEAT     │┄│▓▓│ Serial Nº        │
  │ · 26      │ FRI 23·10 19:00  B   4    12      │┄│▓▓│ FH-004417        │
  └───────────┴───────────────────────────────────┴┄┴──┴──────────────────┘
  controls row: [ Fan out ]  hint
```

- `.stage` is a `div role="group"` labelled "Ticket stack", absolutely positioned inside `.fit` and scaled, so the 820px design never causes horizontal scroll.
- Each ticket is a `button` with a full `aria-label` sentence and `aria-current` on the top one. Inside it, only phrasing content (`span`s), because block elements are not valid inside a button.
- The stub notches are two 11px circles cut by `mask` at x = 450px, top and bottom.
- `.foil` is `aria-hidden` and holds the vertical micro-text "GENUINE · FH".
- The seat map is an inline SVG (100 × 64 viewBox): a stage bar, three arc sections, section B filled pink, a seat dot whose `cx` is 44, 50 or 56.
- A visually hidden live region announces the top ticket and mode.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing |
| --- | --- | --- | --- | --- |
| Ticket move | shuffle, select, fan, stack | transform | pile slot ↔ fan slot | 560ms expo out |
| Ticket shadow | becomes top | box-shadow | 18px/30px blur → 30px/44px blur | 300ms standard |
| Foil bands | pointermove | background-position-y | `--my × 100% + --h` | per frame (rAF), no transition |
| Foil sheen | pointermove | gradient stop positions | `--mx × 100%` ± 40% | per frame |
| Fan button | toggle | background | none → `--pink` | 160ms standard |

Pile slots by depth (0 = top): `translate(0,0) rotate(0)`, `translate(10px,-12px) rotate(-3.5deg)`, `translate(20px,-24px) rotate(3deg)`. Fan slots by seat: `translate(slot × 34px, lift) rotate(slot × 9deg)` with slot −1, 0, 1 and lift −26px for the top.

Reduced motion: no transitions; foil still tracks the pointer.

## States

- Top ticket: `aria-current="true"`, deeper shadow, `tabindex=0`. Others `tabindex=-1`.
- Focus-visible on a ticket: a 2px dashed `--pink` ring inset 4px inside the ticket (the mask would clip an outside outline).
- Fan button: resting 1.5px ring at 35% `--text`; hover 8% fill; pressed pink fill with ink text, label "Stack".
- No disabled or empty state. A product with one ticket hides the fan button.

## Accessibility

- Each ticket's label: "Ticket 1 of 3. Static Bloom, Foundry Hall, Friday 23 October, doors 19:00. Section B, row 4, seat 12. Serial FH-004417."
- The stack is a labelled group with one tab stop (roving tabindex). Arrows move between tickets; Enter or Space activates (shuffle when stacked and on top).
- Fan button uses `aria-pressed`.
- Live region (polite): "Seat 13 on top.", "Tickets fanned out.", "Tickets stacked."
- Foil, art and map are decorative (`aria-hidden`); the label carries the facts.
- Contrast: ink on the three stocks is 15:1 or better. `--pink` on cream is 2.9:1, so it is used only for 9px caps kicker that repeats information, the map fill, and large shapes; the serial uses `#d02b2b` (4.8:1). `--text-2` on the table is 6.6:1.
- Fan button is 44px tall.

## Responsive rules

- ≥1280: stage scaled 1.15 (943 × 540).
- 1024: same cap fits; scale 1.15.
- 768: scale = available width / 820, capped at 1 below 1000px wide.
- <640: scale = width / 820 (≈0.42 at 375). The header wraps onto two lines; the hint wraps below the button. No horizontal scroll.
- Touch: dragging a finger also emits pointer moves, so the foil responds while the finger is down.

## Acceptance checklist

### Always

- [ ] Three tickets, each with art panel, body, perforated stub with two cut notches, foil strip, mini seat map and serial.
- [ ] Ticket stocks differ slightly so the three read apart in the pile.
- [ ] Foil responds to pointer position through two custom properties updated at most once per frame.
- [ ] Stacked: clicking the top ticket sends it to the bottom; clicking a back ticket raises it.
- [ ] Fan toggle spreads tickets around a pivot well below them; the top ticket lifts.
- [ ] One tab stop for the stack, arrow keys move between tickets, focus ring visible inside the mask.
- [ ] Ticket buttons contain only phrasing content and have a full label.
- [ ] Live region announces top ticket and mode.
- [ ] Reduced motion makes moves instant. No horizontal scroll at 375px.

### This demo

- [ ] Static Bloom · Low Orbit Tour · with Moth Radio · Foundry Hall presents.
- [ ] FRI 23·10, doors 19:00, Sec B, Row 4, seats 12, 13, 14.
- [ ] Serials FH-004417, FH-004418, FH-004419 in `#d02b2b`.
- [ ] Ticket 600 × 230, art 150px, stub 150px with a 30px foil strip, notches at 450px.
- [ ] Fan slots ±9° and ±34px, lift 26px, pivot `50% 380%`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: stacked. Seat 12 (cream) is on top, flat. Seat 13 (pink) is 10px right, 12px up, rotated −3.5°. Seat 14 (blue) is 20px right, 24px up, rotated 3°. Header: "Your tickets ×3 · Foundry Hall · Fri 23 Oct". Controls: "Fan out" button and the hint.
2. Pointer moves anywhere on the page: `--mx` and `--my` (0–1 across the viewport) update once per animation frame. Each foil's band gradient (400% tall) shifts with `--my`, and a 115° white sheen slides with `--mx`. Each ticket offsets its bands by `--h` (0%, 35%, 70%) so the three strips show different colours.
3. Stacked, click the top ticket: it goes to the bottom of the pile and the next one rises. All three move to their new pile positions over 560ms expo out. The live region says "Seat 13 on top."
4. Stacked, click a ticket that peeks out behind: it comes to the top.
5. Click "Fan out": `aria-pressed="true"`, label "Stack", pink fill. Tickets rotate around a point 380% of their height below their centre: seat 12 to −9° and 34px left, seat 13 to 0°, seat 14 to 9° and 34px right. The top ticket is also lifted 26px. Hint changes to "click a ticket to lift it".
6. Fanned, click any ticket: it becomes the top (highest z-index, lifted 26px); the others keep their fan slots.
7. Arrow keys while a ticket has focus: Left/Up selects the previous seat, Right/Down the next, wrapping, in both modes. Focus follows.
8. Click "Stack": back to the pile, keeping the current top.
9. Reduced motion: moves are instant. The foil still follows the pointer because it is direct feedback with no autonomous motion.

## Tokens

```css
:root {
  --bg: #22201d;      --bg-2: #2c2925;   /* table */
  --stock: #f6efe0;                       /* ticket a; b #f4e2e4; c #e0e7ee */
  --ink: #1b1a17;     --ink-2: #5d574d;
  --pink: #ff4f8b;                        /* riso pink: art, kicker, map, fan button, focus */
  --blue: #3255ff;                        /* riso blue: art overprint only */
  --serial: #d02b2b;
  --text: #ece5d6;    --text-2: #a39b8c;  /* on the table */
  --display: "Dela Gothic One", Impact, sans-serif;
  --mono: "Martian Mono", ui-monospace, monospace;
  --foil: linear-gradient(180deg, #ff9ec7, #8fe3f5, #f7ea8a, #b9a6ff, #93ecc0, #ff9ec7, #8fe3f5);
  --mx: .5; --my: .5;                     /* pointer, 0–1 */
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --t-move: 560ms;
  --ticket-r: 10px;
}
```

## Typography

| Role | Family | Size | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- | --- |
| Header | Martian Mono | 12px | 400 / 600 | .14em | caps, `--text-2`, values `--text` |
| Kicker | Martian Mono | 9px | 600 | .24em | caps, `--pink` |
| Band | Dela Gothic One | 34px / .95 | 400 | −.01em | caps, two lines |
| Tour line | Martian Mono | 10px | 400 | 0 | `--ink-2` |
| Fact label | Martian Mono | 8px | 400 | .2em | caps |
| Fact value | Martian Mono | 14px | 600 | 0 | |
| Serial | Martian Mono | 13px | 600 | .06em | `--serial`, tabular |
| Art side text | Martian Mono | 9px | 600 | .2em | vertical |
| Buttons | Martian Mono | 12px | 600 | .12em | caps |

## Implementation notes

The foil is three background layers. Only background positions and stop positions change, so it is cheap:

```css
.foil {
  background:
    linear-gradient(115deg, transparent calc(var(--mx) * 100% - 40%),
      rgba(255,255,255,.95) calc(var(--mx) * 100% - 4%), transparent calc(var(--mx) * 100% + 30%)),
    repeating-linear-gradient(0deg, rgba(255,255,255,.28) 0 1px, transparent 1px 3px),
    var(--foil) 50% calc(var(--my) * 100% + var(--h, 0%)) / 100% 400%;
}
```

```js
let raf = 0, px = .5, py = .5;
addEventListener('pointermove', e => {
  px = e.clientX / innerWidth; py = e.clientY / innerHeight;
  if (!raf) raf = requestAnimationFrame(() => {
    raf = 0;
    document.documentElement.style.setProperty('--mx', px.toFixed(3));
    document.documentElement.style.setProperty('--my', py.toFixed(3));
  });
});
```

The riso art is two dot grids blended with multiply and cut to shapes with masks. Offset the blue grid by half a cell so the dots interleave like a two-pass print:

```css
.art::before { background: radial-gradient(circle, var(--pink) 1.6px, transparent 1.9px) 0 0 / 6px 6px; mix-blend-mode: multiply;
  mask: radial-gradient(circle at 40% 42%, #000 46px, transparent 47px), linear-gradient(#000,#000) 0 160px / 100% 18px no-repeat; }
.art::after  { background: radial-gradient(circle, var(--blue) 1.3px, transparent 1.6px) 3px 3px / 6px 6px; mix-blend-mode: multiply;
  mask: radial-gradient(circle at 62% 52%, #000 40px, transparent 41px), linear-gradient(#000,#000) 0 186px / 70% 12px no-repeat; }
```

Keep pile order in one array where the last index is the top. `layout()` derives z-index, `aria-current`, tabindex and transform from it, so shuffle, select and fan never disagree.

Common mistakes:

- Tilting the whole ticket in 3D. That is `card-holo-foil`. Here the paper stays flat and only the strip catches light.
- A rainbow foil across the entire ticket. It is a 30px security strip.
- Fanning around the ticket centre. The pivot must be far below, or the fan looks like a spinner.
- Putting `dl`/`div` inside the ticket button.
- Updating the foil on every pointer event instead of once per frame.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
