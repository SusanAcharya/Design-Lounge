<!-- Design Lounge Nº 090 · "Agency landing with case wall" · www.designlounge.live -->

# Agency landing with case wall

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The landing page of a fictional four-person Leeds studio, North Yard. The first frame is a huge uppercase lockup — "We show *the* **work.**" — over a 2×2 case wall with 2px black rules and square corners. Hovering or selecting a case inverts it to black with white type. A 56px sticky bar in signal orange sits on the bottom edge of the viewport with the only CTA: "Start a project". This is not a project list and not a marquee. The wall is the work.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ NORTH YARD          LEEDS · EST. 2016          WORK  STUDIO  CONTACT   │ 48, 2px rule
├────────────────────────────────────────────────────────────────────────┤
│ WE SHOW THE WORK. (88px Archivo Black)   Identity, type and wayfinding │
│ "the" is outlined; "work." is orange     Open Q1 2027     12 cases     │ ~200
├────────────────────────────────────────────────────────────────────────┤
│ 01 / HALL            ▪  │ 02 / TYPE            ▪                       │
│ PIER LEDGER             │ CIVIC CUT                                    │ 248
│ Port of Goole · 2026    │ Leeds Libraries · 2025                       │
├─────────────────────────┼──────────────────────────────────────────────┤
│ 03 / SIGN            ▪  │ 04 / MARK            ▪                       │
│ VOLT SHED               │ HARBOUR INDEX                                │ 248
│ Grid North · 2025       │ Humber Trust · 2024                          │
├─────────────────────────┴──────────────────────────────────────────────┤
│ NORTH YARD        AVAILABLE FROM JANUARY 2027        [ START A PROJECT]│ 56 fixed orange
└────────────────────────────────────────────────────────────────────────┘
  All rules 2px black. Radius 0. Art tiles 110×110, top-right of each case.
```

- `<nav aria-label="Primary">` — 48px, 3 equal columns: wordmark, location, three links.
- `<header class="hero">` — 2 columns, `1fr 220px`, 20px side pad. `h1` 88px / 0.84. Aside 13px + a 2px-ruled tag row.
- `<section class="wall" id="wall" aria-label="Case wall">` — 2×2. Each cell is a `<button class="case">` min-height 248px.
- `<div class="bar" role="region" aria-label="Start a project">` — 3 columns: name / availability / CTA link.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---------|---------|----------|-----------|---------:|--------|-------|
| `.case` | hover / current | background, color | white/black ↔ black/white | 0 | — | instant invert |
| `.art` | hover / current | outline | none → 2px orange | 0 | — | |
| `.bar .go` | hover | background, color | ink/bg ↔ bg/ink | 140ms | `--ease` | the only eased colour |

Reduced motion: `--t` to 1ms. Inversion remains a hard cut.

## States

- **Case default:** white, 2px black edges, 13px `--ink-2` client line.
- **Case hover / current:** black fill, white type, client line `#C8C8C8`, art outlined in orange.
- **CTA default:** 36px tall, black fill, white type, on the orange bar.
- **CTA hover:** white fill, black type.
- **Nav hover:** orange type.
- **Focus-visible:** 3px orange, offset −3px.

## Accessibility

- Cases are `<button>`. Current case uses `aria-current="true"` (a selected item in a set of destinations).
- The bar is a `role="region"` with an accessible name. The CTA is a link, 36px tall, ≥ 44px wide with 16px padding.
- Focus order: logo, 3 nav links, 4 cases, CTA.
- Contrast: black on white 21:1; orange `#FF4D00` on white ≈ 3.7:1 — orange is used at 88px and 16px display sizes only, never as 14px body. Black on orange ≈ 6.4:1.
- Do not rely on hover alone: click and keyboard set `aria-current`.

## Responsive rules

- ≥ 1280: as specified. Lockup 88px. Wall 2×2. Bar 3 columns.
- 900–1279: lockup 72px if it wraps to three lines; wall stays 2×2.
- < 900: lockup 64px. Hero stacks. Wall becomes 1 column; each case keeps the 2px bottom rule; drop the right rule. Bar hides the centre availability string.

## Acceptance checklist

- [ ] Lockup is 88px Archivo Black; "the" is outlined, "work." is `#FF4D00`.
- [ ] Case wall is exactly 2×2 with 2px black rules and 0 radius.
- [ ] Each case is ≥ 248px tall and contains a 110×110 geometric art tile.
- [ ] Hover and `aria-current` invert the case to black/white.
- [ ] Only one case is current; 01 starts current.
- [ ] Sticky bar is 56px, `#FF4D00`, `position: fixed; bottom: 0`, 2px black top rule.
- [ ] CTA reads "Start a project" and inverts on hover in 140ms.
- [ ] Body has 56px bottom padding so the last row is not covered.
- [ ] First 800px includes the lockup, all four cases, and the bar.
- [ ] Focus outline is 3px orange, inset.
- [ ] `prefers-reduced-motion: reduce` does not remove the invert, only the 140ms fade.
- [ ] No marquee, no project table, no second accent.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: case 01 "Pier Ledger" has `aria-current="true"` and is inverted (black fill, white type, orange outline on its 110×110 mark). The other three cases are white with black type.
2. Hover any case: invert to black / white over 0ms colour (no fade). The 110px art tile gets a 2px orange outline, 3px offset.
3. Click a case: it becomes current; the previous current returns to the default (unless hovered). Only one case is current.
4. Hover "Start a project": the button flips from black-on-orange-bar to white fill / black type over 140ms.
5. Nav links turn orange on hover. Focus-visible on every control is a 3px orange outline, −3px offset (sits inside the hard edge).
6. The CTA bar is `position: fixed; bottom: 0; height: 56px`. Body has `padding-bottom: 56px` so the wall is not hidden behind it.
7. Reduced motion: the 140ms button colour change becomes 1ms. Inversion stays instant.

## Tokens

```css
:root {
  --bg: #ffffff;
  --ink: #000000;
  --ink-2: #555555;
  --line: #000000;
  --orange: #ff4d00;      /* signal — the only accent */

  --display: "Archivo Black", Impact, sans-serif;
  --sans: "Archivo", Helvetica, Arial, sans-serif;

  --nav: 48px;
  --cta: 56px;
  --case-min: 248px;
  --art: 110px;
  --rule: 2px;

  --t: 140ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Lockup | Archivo Black | 88px | 400 | 0.84 | −0.03em | UPPERCASE |
| Case title | Archivo Black | 36px | 400 | 0.90 | −0.02em | UPPERCASE |
| Wordmark / bar name | Archivo Black | 16px | 400 | 1 | +0.04em | UPPERCASE |
| Nav / tags / CTA | Archivo | 11–12px | 600 | 1 | +0.08–0.14em | UPPERCASE |
| Aside / client line | Archivo | 13px | 400 | 1.4 | 0 | sentence |

Lockup treatment: "the" is `color: transparent; -webkit-text-stroke: 2px #000`. "work." is `#FF4D00` with no stroke.

## Implementation notes

**Hard edges are the style.** Do not radius the cases, the bar, or the CTA. Rules are 2px, not 1px.

```css
.wall { display: grid; grid-template-columns: 1fr 1fr; }
.case { min-height: 248px; border-right: 2px solid #000; border-bottom: 2px solid #000; border-radius: 0; }
.case:hover, .case[aria-current="true"] { background: #000; color: #fff; }
```

**Outlined word in the lockup** uses stroke, not a second font:

```css
h1 span { color: transparent; -webkit-text-stroke: 2px #000; }
h1 b { color: #ff4d00; -webkit-text-stroke: 0; }
```

**The bar must not cover the wall.** Fix it, then pad the document:

```css
body { padding-bottom: 56px; }
.bar { position: fixed; left: 0; right: 0; bottom: 0; height: 56px; background: #ff4d00; }
```

The four art tiles are CSS, 110×110, no SVG required:

1. Pier Ledger — `conic-gradient` in 25% slices: black / orange / black / white.
2. Civic Cut — 135° repeating bars, 10px black, 2px orange, 10px white.
3. Volt Shed — horizontal split: black 50%, 4px orange band, white below.
4. Harbour Index — orange 28% disc over 8px black/white stripes.

Orange is `#FF4D00` only. Do not introduce a second signal. The lockup uses Archivo Black at 88px; Archivo Regular is for 11–14px UI only.

Common mistakes: turning this into a project list plus marquee; using 1px grey rules; rounding the CTA into a pill; setting the lockup in Archivo Regular; adding blue or yellow as a second signal.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
