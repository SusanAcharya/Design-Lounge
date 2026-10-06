<!-- Design Lounge Nº 150 · "Sticky scroll feature steps" · www.designlounge.live -->

# Sticky scroll feature steps

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A features section for a kitchen-garden planner ("Loam"). Four long steps live in the left column; a 600px garden-plot card sticks in the right column and restyles itself as each step crosses the middle of the viewport. Step one is empty dashed beds and a sun disc; two fills them with companion crops; three stamps checkmarks and a Mar–Oct calendar; four drops kilogram tallies and a 12-bar sparkline. The feeling is paper, soil and serif: warm `#F4EFE6`, terracotta `#C65D3B` on one word of the 76px headline. The detail worth copying is that the sticky card is one DOM figure whose `data-step` drives every visual — no four stacked mockups, no image swaps.

## Structure

```
1280 × 800, .wrap grid 1fr 600px, gap 72px, pad 0 72px, max-width 1440
┌────────────────────────────────┬──────────────────────────────────────┐
│ pad-top 64                     │ .aside → .sticky top 48, h 704       │
│ — HOW LOAM WORKS               │ ┌ viz card, r 18, pad 22 24 ────────┐│
│ From bare soil to a            │ │ Back garden     Plot · 6.2×4.0 m  ││
│ full basket.  (76px, em terra) │ │ faces SSW                         ││
│ lede 17px, max 430             │ │ ┌ plot 336h, 3×2 beds, 34×18 gap ┐││
│                                │ │ │ sun                             │││
│ ①  STEP ONE · MAP              │ │ │ [beans] [courgette] [tomatoes]  │││
│    Draw your plot…  (62vh)     │ │ │ [kale]  [carrots]   [beetroot]  │││
│    6.2 × 4.0 m | 7 h 40 m      │ │ │ ruler 6.20 m                    │││
│ ②  STEP TWO · CHOOSE  (62vh)   │ │ └─────────────────────────────────┘││
│ ③  STEP THREE · TEND  (62vh)   │ │ foot 176h — one .panel visible     ││
│ ④  STEP FOUR · HARVEST (86vh)  │ └────────────────────────────────────┘│
└────────────────────────────────┴──────────────────────────────────────┘
  timeline: 1px --line-2 at x=19; 40px numeral at left 0, top 40
```

- `.wrap` — CSS grid. `.copy` left; `.aside` right.
- Eyebrow: 12/600 +0.16em uppercase terracotta, 24×1px rule `::before`.
- `<h2>` 76px Young Serif; `<em>full basket.</em>` terracotta, `font-style:normal`.
- `<ol class="steps">` — four `<li class="step" data-s>`. Each: `<button class="num">`, `<small>`, `<h3>`, `<p>`, two-stat `<ul>`.
- `.sticky` — `position:sticky; top:48px; height:704px; padding-top:16px`.
- `<figure class="viz" data-step aria-label="Plot planner preview">` — `.vh` header, `.plot` (sun + 6 `.bed` + `.ruler`), `.foot` with four `.panel.p1–p4`.
- Beds in DOM order: runner beans `#c9d3b9`, courgette `#efd79c`, tomatoes `#efc3b2`, kale `#d6dcc8`, carrots `#e6d3b6`, beetroot `#dcc9d6`. Each has `.rows`, `.dim`, `.crop`, `.tick` (check SVG), `.kg`.

## Motion

| Element              | Trigger     | Property                    | From → To                    | Duration | Easing      | Notes |
|----------------------|-------------|-----------------------------|--------------------------------|---------:|-------------|-------|
| `.step` opacity      | IO / click  | opacity                     | 0.38 → 1                       | 560ms    | `--ease`    | inactive stay 0.38, not 0 |
| Numeral fill         | same        | background, color, border   | paper/line → ink/bg            | 180ms    | `--ease`    | |
| Bed fill / border    | leave step 1| background, border-color    | dashed empty → solid `--c`     | 560ms    | `--ease`    | |
| Crop + rows          | leave step 1| opacity, translateY         | 0, 6px → 1, 0                  | 560ms    | ease / out  | |
| Tick discs           | step 3      | opacity, scale              | 0, .5 → 1, 1                   | 180 / 560| — / out     | beds 4–6 stay hidden |
| kg figures           | step 4      | opacity, scale              | 0, .8 → 1, 1                   | 560ms    | ease / out  | origin right top |
| Spark bars           | step 4      | transform scaleY            | 0 → 1                          | 560ms    | `--ease-out`| delay `i * 30ms` |
| Footer panels        | data-step   | opacity, translateY         | 0, 12px → 1, 0                 | 560ms    | ease / out  | only matching `.pN` |
| Beds 4–6             | step 3      | scale                       | 1 → 0.97                       | 560ms    | `--ease-out`| |
| html                 | anchors     | scroll-behavior             | smooth                         | —        | —           | `auto` if reduced |

Do not animate `data-step` itself. CSS selectors: `.viz[data-step="1"] .p1` (etc.) set the visible panel; `.viz:not([data-step="1"])` fills beds.

## States

- **Active step:** `.step.on`, opacity 1, numeral `--ink` fill and `--bg` type, `aria-current="step"` on the button. Others `aria-current="false"`.
- **Step 1 exclusive:** sun opacity 1; ruler visible; bed 2 (`nth-child(2)`) 1.5px solid `--terra` and `rgba(198,93,59,.06)` fill; its `.dim` terracotta 600; two 9px square handles (`::before` top-right, `::after` bottom-right).
- **Steps 2–4:** `.dim` opacity 0; `.crop` and `.rows` visible; bed border solid transparent (colour comes from background `--c`).
- **Step 3 ticks:** first three beds only (`.bed:nth-child(n+4) .tick { opacity: 0 }`).
- **Step 4 rows:** opacity 0.35; `.kg` visible.
- **Numeral focus-visible:** 2px terracotta outline, 3px offset.
- **Spark:** `.spark i:nth-child(n+9)` terracotta; heights 12, 18, 26, 40, 52, 70, 88, 100, 84, 61, 37, 20%.

## Accessibility

- Steps are an `<ol>`. Each numeral is a real `<button>` with `aria-label="Go to step N"`.
- Figure has `aria-label="Plot planner preview"`. Calendar "Today · 2 Jun" and sparkline are `aria-hidden` where decorative.
- Keyboard: Tab through 1–4; Enter/Space on a numeral scrolls that step to centre. No arrow-key requirement.
- Contrast: `--ink-2` on `--bg` is ~5.8:1; `--ink-3` is used only for 11–12px meta. Numeral in the on-state is `--bg` on `--ink`.
- Hit target: 40×40px numerals. Step blocks themselves are not buttons.
- If `IntersectionObserver` is missing, clicking numerals still calls `set`.

## Responsive rules

- ≥ 1280: as specified.
- ≤ 1100: grid `1fr 480px`, gap 40px, padding 0 40px, headline 60px, plot height 300px.
- 768–1023: stack — copy first, sticky card becomes static under the intro (or sticky with `top: 16px` and height auto). Steps keep 62vh so IO still works.
- < 640: single column, padding 20px, headline 48px, hide the 6.20 m ruler text if it clips. Spark bars stay 12px wide.
- `scroll-behavior: smooth` off under reduced motion.

## Acceptance checklist

- [ ] Layout is `1fr / 600px` with 72px gap at 1280; the right card is sticky at `top: 48px` and 704px tall.
- [ ] Exactly four steps; inactive opacity is 0.38; last step min-height 86vh.
- [ ] IntersectionObserver uses `rootMargin: '-45% 0px -50% 0px'` and writes `data-step` plus `aria-current="step"`.
- [ ] Clicking a numeral centres that step and updates the card without waiting for the observer.
- [ ] Step 1 shows dashed beds, sun, ruler "6.20 m", and a terracotta selection on the courgette bed.
- [ ] Step 2 fills beds with the six crop colours and names listed in Structure.
- [ ] Step 3 shows checks on the first three beds only and the Mar–Oct calendar with "Today · 2 Jun".
- [ ] Step 4 shows kg tallies, **38.4 kg**, and 12 spark bars that grow with 30ms stagger.
- [ ] Morph duration is 560ms; reduced motion is 1ms and still changes step.
- [ ] Headline is 76px Young Serif; "full basket." is terracotta.
- [ ] Copy matches Loam: 6.2 × 4.0 m, 7 h 40 m, 14 crops, 12 min/week, 38.4 kg, £212.
- [ ] Numeral focus rings are 2px terracotta.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: step 1 is `.on` (opacity 1, numeral filled `--ink`). Steps 2–4 sit at opacity 0.38. The figure `data-step="1"`: six dashed empty beds, a 6.20 m ruler, a butter sun in the top-left, bed 2 (courgette slot) highlighted with a terracotta border and two 9px corner handles. Footer legend: 6 beds / 7 h 40 m sun / loam pH 6.8 / last frost 12 May.
2. Scrolling until a step's block intersects a band from 45% from the top to 50% from the bottom (`rootMargin: -45% 0px -50% 0px`) calls `set(n)`. The matching numeral gets `aria-current="step"`.
3. Clicking a numeral `scrollIntoView({ block: 'center' })` and sets that step immediately.
4. **Step 2:** dashed borders become solid fills using each bed's `--c`; crop names and row textures fade in; sun and ruler hide; legend becomes crop families (legumes, cucurbits, nightshades, roots).
5. **Step 3:** 22px ink check discs appear on the first three beds; beds 4–6 scale to 0.97 and hide their ticks. Footer is a 12-column calendar (Mar–Oct) with Sow / Thin / Feed / Harvest bars and a "Today · 2 Jun" hairline at 41% of the plot width.
6. **Step 4:** kilogram figures (9.2, 11.6, 7.8, 4.1, 3.9, 1.8) scale in at the top-right of each bed; row texture drops to 0.35 opacity; footer shows **38.4 kg** and a 12-bar sparkline that grows from `scaleY(0)` with 30ms stagger. Bars 9–12 are terracotta; 1–8 sage.
7. Morphs use 560ms `--ease` on colour/opacity and `--ease-out` on transform. Last step is 86vh tall so it can reach the observer band; others 62vh.
8. Reduced motion: `scroll-behavior: auto`; all transitions 1ms. IntersectionObserver still updates `data-step`.

## Tokens

```css
:root {
  /* colour — warm paper, soil ink, terracotta accent, garden fills */
  --bg: #f4efe6;
  --card: #fbf8f2;
  --ink: #23291f;
  --ink-2: #5b6152;
  --ink-3: #8d8f80;
  --line: #ddd5c6;
  --line-2: #cbc1ae;
  --terra: #c65d3b;
  --sage: #a9b89a;
  --sage-d: #6f8460;
  --butter: #ebcb7a;
  --rose: #e9b8a6;
  --soil: #d9c6a8;

  /* type */
  --serif: "Young Serif", Georgia, serif;
  --sans: "Figtree", system-ui, sans-serif;

  /* layout */
  --aside-w: 600px;
  --sticky-h: 704px;
  --plot-h: 336px;
  --r: 18px;
  --r-bed: 10px;
  --shadow: 0 1px 0 rgba(35, 41, 31, .04), 0 30px 60px -30px rgba(70, 50, 20, .28);

  /* motion */
  --t-fast: 180ms;
  --t-morph: 560ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role           | Family      | Size | Weight | Line-height | Tracking | Case      |
|----------------|-------------|-----:|-------:|------------:|---------:|-----------|
| Body           | Figtree     | 16px | 400    | 1.6         | 0        | sentence  |
| Eyebrow / step kicker | Figtree | 12px | 600 | 1        | +0.16em / +0.14em | UPPERCASE |
| Headline       | Young Serif | 76px | 400    | 0.98        | −0.03em  | sentence  |
| Lede / step p  | Figtree     | 17px | 400    | 1.6         | 0        | sentence  |
| Step title     | Young Serif | 36px | 400    | 1.08        | −0.02em  | sentence  |
| Numeral        | Young Serif | 15px | 400    | 40px circle | 0        | numerals  |
| Stat value     | Young Serif | 26px | 400    | 1.1         | 0        | mixed     |
| Stat label     | Figtree     | 14px | 400    | 1.6         | 0        | sentence  |
| Card title     | Young Serif | 20px | 400    | 1           | 0        | sentence  |
| Card meta      | Figtree     | 13px | 400    | 1           | 0        | sentence  |
| Crop name      | Young Serif | 17px | 400    | 1.1         | 0        | sentence  |
| Bed dim / kg unit | Figtree  | 11px / 12px | 400/500 | 1 | 0   | mixed     |
| kg figure      | Young Serif | 34px | 400    | 1           | 0        | numerals  |
| Tally          | Young Serif | 92px | 400    | 0.9         | −0.04em  | numerals  |
| Calendar       | Figtree     | 11px | 400/500/600 | 1     | 0        | mixed     |
| Note           | Figtree     | 13px | 400    | 1.6         | 0        | sentence  |

## Implementation notes

**One figure, four looks.** Drive everything from `data-step` — do not mount four previews:

```css
.viz[data-step="1"] .p1,
.viz[data-step="2"] .p2,
.viz[data-step="3"] .p3,
.viz[data-step="4"] .p4 { opacity: 1; transform: none; }
.viz:not([data-step="1"]) .bed { border-style: solid; background: var(--c); }
```

**Observer band in the middle of the viewport**, not "when the top hits the top":

```js
const io = new IntersectionObserver(
  (es) => es.forEach((e) => { if (e.isIntersecting) set(e.target.dataset.s); }),
  { rootMargin: '-45% 0px -50% 0px' }
);
```

**Spark stagger** — set delay once, grow with a class on the figure:

```js
spark.forEach((b, i) => { b.style.transitionDelay = (i * 30) + 'ms'; });
/* CSS */ .viz[data-step="4"] .spark i { transform: scaleY(1); }
```

Common mistakes: making the right column `position:fixed` (it will overlap the next section on a real page); using four stacked images instead of CSS beds; putting `min-height: 100vh` on every step so step 4 never reaches the observer (the last one must be taller); fading inactive steps to 0 (the timeline should stay readable); forgetting `counter`/`data-s` as strings when comparing in `set`.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
