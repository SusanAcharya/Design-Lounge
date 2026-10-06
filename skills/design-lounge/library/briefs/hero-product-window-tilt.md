<!-- Design Lounge Nº 140 · "Product window tilt hero" · www.designlounge.live -->

# Product window tilt hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The top of a marketing site for Ledgerline, a fictional expansion-revenue tool. The hero has a centred headline and two CTAs. Below them, a full app window built entirely from divs and SVG sits in perspective and leans toward the cursor by up to 8°. Four layers inside the window live at different `translateZ` depths: sidebar 24px, chart card 56px, status chip 84px, notification toast 120px. As the window turns, they slide over each other like real stacked glass. The detail worth copying: the window is a product screenshot that never goes stale, and its depth reads as quality before anyone reads a word.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────────┐
│ ▣ Ledgerline  Product Signals Customers Pricing Changelog [Sign in][Start free] │ nav 64
│                     ( New  Seat-usage signals… )                  │
│              See expansion revenue before                         │ h1 60/1.02
│                your customers ask for it.                         │ (2nd half ink-3)
│                    subline 16px, 520 max                          │
│              [Start a 14-day trial] [Book a demo]                 │ 44px buttons
│  (● Forecast recalculated)  Z84                                   │
│   ┌──────────────────────── window 1000×520 ─────────────────┐    │ top 418
│   │ ●●●  app.ledgerline.io/signals                       ⌘K  │ 38 │
│   │ side 196 Z24 │ Expansion signals        [7d|30d|90d]     │    │
│   │ Brightloom   │ [NRR 128.4%] [$1.84M] [12 at risk]        │    │
│   │ Overview     │ ┌ chart card Z56 ────────── tip ┐         │    │
│   │ Signals 18   │ │ mint area + dashed forecast  ┌┴ toast Z120 ┐ │
│   │ …            │ └──────────────────────────────│ Halcyon 95% │ │
│ ░░░░░░░░░░░░░░░░░░░░░ fade 120px ░░░░░░░░░░░░░░░░░└─────────────┘░│
└───────────────────────────────────────────────────────────────────┘
```

- `<nav aria-label="Primary">`: logo, `<ul>` of 5 links, right-aligned Sign in and Start free.
- `<section class="hero">`: centred text block, `padding-top:44px`.
- `.stage` (`role="img"`, `aria-label="Ledgerline app preview"`) is absolute, 1000×520, centred, `perspective:1700px`, `perspective-origin:50% 20%`.
  - `.win` has `transform-style:preserve-3d` and the rotate transform from `--rx`/`--ry`.
    - `.shell`: background, border, radius 14, grid rows `38px 1fr`. It holds the title bar and `.body` (a grid of `196px 1fr`).
      - `.side` at `translateZ(24px)`, with its own border and shadow.
      - `.main` holds the header, the KPI row and `.chart` at `translateZ(56px)` with an inner `.tip` (+30px), then account rows.
    - `.chip` (Z 84) at `left:-36px; top:-16px`. `.toast` (Z 120) at `right:-60px; top:282px`, 300px wide.
- `.fade` is a 120px gradient to `--bg` at the viewport bottom, `pointer-events:none`.

## Motion

| Element      | Trigger       | Property            | From → To                  | Duration | Easing | Delay |
|--------------|---------------|---------------------|----------------------------|---------:|--------|------:|
| `.win`       | load          | translate, opacity  | 0 60px, 0 → 0 0, 1         | 900ms    | expo   | 120ms |
| `.toast`     | load          | translate, opacity  | 0 14px, 0 → 0, 1           | 700ms    | expo   | 900ms |
| `.chip`      | load          | translate, opacity  | same                       | 700ms    | expo   | 1050ms |
| `.win` tilt  | pointermove   | rotateX / rotateY   | rest (6°, −3°) → target, max ±8° | lerp 0.09/frame | n/a | rAF |
| `.win` tilt  | pointerleave  | rotate              | current → rest             | lerp     | n/a    | |
| chip dot     | loop          | box-shadow ring     | 3px → 6px, fades           | 2400ms   | `--ease` | infinite |
| buttons      | hover         | background, border  | → lighter                  | 160ms    | `--ease` | |

Use the individual `translate` property for the entrance so it does not fight the `transform` that holds the rotation. Reduced motion: no entrance, no pulse, and the window stays at its resting tilt with no pointer tracking.

## States

- **Primary button:** mint fill, `--mint-ink` text. Hover `#9bf6d3`.
- **Secondary button:** transparent with a `--line-2` border. Hover fills `--panel-2` with a `#3a434d` border.
- **Nav link hover:** `--ink-2` → `--ink`.
- **Focus-visible:** 2px mint outline, 3px offset, 6px radius.
- **In-window active states** (static, for realism): Signals nav row on `--panel-3` with a mint count badge, and the `30d` segment selected.
- **Resting vs tracking:** resting is a 6° lean back and 3° turn left. While tracking, the window always faces the cursor.

## Accessibility

- The whole window is decoration plus a picture of the product: `role="img"` with `aria-label="Ledgerline app preview"`, and nothing inside it is focusable. Use non-link `<a>` elements or divs inside it.
- Real focus order: logo, 5 nav links, Sign in, Start free, trial CTA, demo CTA.
- Pointer tracking is cosmetic and has no keyboard equivalent, by design.
- Contrast: `--ink-2` on `--bg` is 7.6:1. `--ink-3` is used for the headline's second clause at 60px (large text, 3.6:1) and for small meta inside the decorative window.
- Buttons are 36px in the nav and 44px in the hero.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: scale the stage with `transform: scale(.86)` from top centre (keep the inner pixel values). The headline drops to 52px.
- 768–1023: hide the toast's overflow beyond the window (move it to `right:16px`), headline 44px, and the stage scales to 0.72.
- < 640: drop pointer tracking (touch has no hover). Show the window flat at `rotateX(8deg)`, scaled to the width, with the sidebar hidden. The headline goes to 36px with left-aligned text, and the CTAs stack at full width.

## Acceptance checklist

- [ ] The window is built from HTML/SVG. No images.
- [ ] Resting transform is `rotateX(6deg) rotateY(-3deg)` inside a `perspective:1700px` stage.
- [ ] Tilt never exceeds ±8° on either axis.
- [ ] Sidebar, chart, chip and toast sit at Z 24, 56, 84 and 120px and visibly parallax against each other while tilting.
- [ ] No element between `.win` and a raised layer has `overflow:hidden`, `opacity < 1` or `filter`, any of which would flatten the 3D.
- [ ] Tilt follows the cursor with easing, not instantly, and the rAF loop stops when settled.
- [ ] On pointer leave, the window returns to rest.
- [ ] The toast and chip enter after the window, at 900ms and 1050ms.
- [ ] The headline's second clause is `--ink-3`.
- [ ] Only the chip dot loops. Nothing else moves at rest.
- [ ] Focus rings show on all nav links and CTAs. Nothing inside the window takes focus.
- [ ] Reduced motion leaves a static, complete composition.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: near-black page with a 24px dot grid. Nav at the top. A "New" pill, a 60px two-tone headline, a subline and two CTAs, all centred. The window sits at `top:418px`, 1000×520, resting at `rotateX(6deg) rotateY(-3deg)` and cropped by a 120px fade at the bottom of the viewport.
2. On load, the window rises 60px → 0 and fades in over 900ms on expo-out after 120ms. The chip pops in at 1050ms and the toast at 900ms (700ms each, translateY 14px → 0, fade in).
3. Moving the pointer anywhere in the viewport sets a target tilt. `rotateY = nx × 8°`, where `nx` is −1…1 across the window's horizontal centre. `rotateX = clamp(2 − ny × 6, −8, 8)°`, where `ny` is −1…1 from a third of the way down the window. The current tilt follows the target with a 0.09 lerp per animation frame, which settles in about 500ms. The loop stops once the difference drops below 0.01°.
4. Because each layer has its own Z, the toast (Z 120) visibly travels further than the chart (Z 56), which travels further than the sidebar (Z 24), which moves past the flat window shell.
5. When the pointer leaves the document, the window eases back to its resting tilt.
6. The chip's mint dot pulses its ring outward every 2.4s. That is the only looping motion.
7. Hovering a button lightens its background over 160ms. CTAs are links; the demo cancels navigation.

## Tokens

```css
:root {
  /* colour */
  --bg: #07080a;        /* page */
  --bg-2: #0c0e11;      /* window shell, pill */
  --panel: #111418;     /* sidebar, KPI cards */
  --panel-2: #161a1f;   /* chart card, button hover */
  --panel-3: #1c2128;   /* active nav, chip */
  --line: #22272e;      /* inner hairlines */
  --line-2: #2d343c;    /* outer borders */
  --ink: #eef1f4;
  --ink-2: #9aa3ad;
  --ink-3: #626b75;
  --mint: #7cf2c4;      /* the one accent */
  --mint-dim: rgba(124,242,196,.14);
  --mint-ink: #03140d;  /* text on mint */
  --warn: #f2b37c;      /* risk delta only */

  /* type */
  --sans: "Onest", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;

  /* depth */
  --tilt-max: 8deg;
  --z-side: 24px;
  --z-chart: 56px;
  --z-chip: 84px;
  --z-toast: 120px;
  --perspective: 1700px;

  /* shape */
  --r-win: 14px;
  --r: 8px;
  --shadow-lift: 0 18px 40px -12px rgba(0,0,0,.7);
  --shadow-win: 0 0 0 1px rgba(0,0,0,.6), 0 40px 120px -20px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.06);

  /* motion */
  --t-micro: 160ms;
  --t-in: 900ms;
  --lerp: .09;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role               | Family     | Size   | Weight | Line-height | Tracking | Notes |
|--------------------|------------|-------:|-------:|------------:|---------:|-------|
| Headline           | Onest      | 60px   | 600    | 1.02        | −0.045em | 2nd clause `--ink-3` |
| Subline            | Onest      | 16px   | 400    | 1.55        | 0        | max 520px |
| Nav links          | Onest      | 13.5px | 400    | 1.5         | 0        | `--ink-2` |
| Buttons            | Onest      | 13.5 / 14.5px | 500 | 1      | 0        | 36 / 44px tall |
| Window h2          | Onest      | 16px   | 600    | 1.3         | −0.015em | |
| KPI value          | Onest      | 22px   | 600    | 1.2         | −0.03em  | |
| Window body        | Onest      | 12–12.5px | 400–500 | 1.4    | 0        | |
| URL, KPI labels, deltas | Geist Mono | 10–11.5px | 400 | 1.4   | 0        | |
| Sidebar group      | Geist Mono | 9.5px  | 500    | 1           | +0.12em  | UPPERCASE |

## Implementation notes

**The preserve-3d chain must be unbroken.** Every ancestor between the rotating element and a raised layer needs `transform-style: preserve-3d`, and none of them may clip:

```css
.stage { perspective: 1700px; perspective-origin: 50% 20%; }
.win { transform-style: preserve-3d;
       transform: rotateX(var(--rx, 6deg)) rotateY(var(--ry, -3deg)); }
.win * { transform-style: preserve-3d; }
.side  { transform: translateZ(24px); }
.chart { transform: translateZ(56px); }
.toast { transform: translateZ(120px); }
```

**Lerp loop that sleeps when idle:**

```js
function step() {
  c.x += (t.x - c.x) * .09; c.y += (t.y - c.y) * .09;
  win.style.setProperty('--rx', c.x.toFixed(2) + 'deg');
  win.style.setProperty('--ry', c.y.toFixed(2) + 'deg');
  raf = (Math.abs(t.x - c.x) > .01 || Math.abs(t.y - c.y) > .01)
    ? requestAnimationFrame(step) : 0;
}
addEventListener('pointermove', (e) => {
  /* nx, ny in −1…1 */ t.x = clamp(2 - ny * 6, -8, 8); t.y = nx * 8;
  if (!raf) raf = requestAnimationFrame(step);
});
```

**Rounded window without `overflow:hidden`:** give the sidebar its own `border-bottom-left-radius:14px` and keep every child inside the shell's box. Clipping is what kills the depth.

Common mistakes: putting the entrance on `transform`, which overwrites the rotation (use `translate`). Tilting toward the screen centre instead of the window centre. Using a CSS transition on transform for tracking, which stutters on every pointermove.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
