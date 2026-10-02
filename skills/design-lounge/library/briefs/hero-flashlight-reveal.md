<!-- Design Lounge Nº 113 · "Flashlight reveal hero" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Flashlight reveal hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The hero of a fictional observability product, Nightjar. The visible layer is a dark, reassuring page: "EVERYTHING LOOKS FINE." in 172px Anton, a green status pill and a green 90-day uptime strip. Under the cursor, a 168px-radius disc with a hard edge (1px anti-aliased, no feather, no glow) cuts through to a second layer printed on light grid paper: "412 THINGS AREN'T." with the last word in alarm red, red failure bars in the same strip, and hairline annotations naming the incidents. Both layers share the exact same layout, so the torch reads like an x-ray. A "Reveal all · R" button expands the disc to cover the whole hero, which is the keyboard and touch fallback.

## Reference behaviour

1. Initial state: the torch sits at (380, 330) in hero coordinates, already cutting through the headline so the red "'T." of "AREN'T." shows inside the disc. A red 14px crosshair marks its centre and a mono readout "X 0380 · Y 0330" sits just outside its lower-right edge.
2. Move the pointer over the hero: the disc follows the pointer exactly (updated once per animation frame, no easing, no lag). The system cursor is hidden inside the hero; the crosshair replaces it.
3. Inside the disc, everything is the hidden layer: light paper `#EFECE4` with a 40px grid, black type, red accents. Outside, everything is the dark layer.
4. The hidden layer has three annotations (hairline leader + red title + 11px body) that are only ever seen through the torch: "retry storm", "200 OK, empty body", "cron skipped 6×".
5. Leaving the hero leaves the torch where it was.
6. Focus the hero (it is `tabindex="0"`) and press the arrow keys: the torch moves 32px per press, 96px with Shift, clamped to the hero bounds.
7. Click "Reveal all · R" (or press R anywhere): the radius animates from 168px to 1600px over 700ms on expo-out, revealing the full hidden page. The button turns red and reads "Torch mode · R"; the hint text reads "Everything, lit". Crosshair and readout fade out.
8. Click again (or press R): the disc shrinks back to 168px at the current pointer position.
9. The real CTAs ("Start a 14-day trial", "Book a demo") live in the dark layer and stay clickable through the torch, because the hidden layer has `pointer-events: none`.
10. On touch, dragging a finger moves the torch (`touch-action: none` on the hero); the button is the primary way to see everything.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────────┐
│ ◉ NIGHTJAR                     Product Pricing Docs Changelog Sign in [Start]│ 64 nav (above both layers)
├──────────────────────────────────────────────────────────────────────────────┤
│ (● All 214 services operational)          MOVE TO LOOK CLOSER [REVEAL ALL·R] │ hero = 736 tall
│                                                                              │ padding 48 64 44
│ EVERYTHING                ╭────────╮                                         │
│ LOOKS FINE.  172px Anton  │ torch  │ r = 168px                               │
│                           ╰────────╯ X 0380 · Y 0330                         │
│                                                                              │
│ lede 14px mono, 400px            CHECKOUT-API · LAST 90 DAYS        99.99%   │
│ [Start a 14-day trial →] [Book a demo]   ▌▌▌▌▌▌▌▌▌▌▌▌ 90 bars × 40px          │
└──────────────────────────────────────────────────────────────────────────────┘
 bottom row grid: 420px | 1fr, gap 72px, aligned to the bottom
```

- `<nav aria-label="Main">` sits outside the hero with its own dark background and `z-index: 3`; the torch never affects it.
- `<section class="stage" tabindex="0">` is the hero. It contains:
  - `.layer.base`: pill, `<h1>`, bottom `.row` with lede, buttons and an uptime strip.
  - `.layer.beam` (`aria-hidden="true"`, `pointer-events: none`): the same layout with the truth copy, red bars and three absolutely positioned `.note` annotations. Masked to the torch disc.
  - `.cross` and `.readout`: decorative, positioned with `transform` from `--px/--py`.
  - `.hint` with the toggle button (`aria-pressed`).
  - A visually hidden paragraph summarising the hidden layer, referenced by `aria-describedby`.

## Tokens

```css
@property --r { syntax: "<length>"; inherits: true; initial-value: 168px; }
:root {
  /* dark layer */
  --night: #0a0b0d;        /* hero + nav background */
  --night-2: #14161a;      /* toggle surface */
  --line-d: #24272d;       /* hairlines on dark */
  --ink-d: #eceae4;        /* headline, primary text */
  --ink-d2: #9a9ea6;       /* lede, nav links, readout */
  --ok: #5fd38d;           /* status dot, focus ring */
  --ok-bar: #2c4a39;       /* healthy uptime bar */

  /* beam layer */
  --beam: #efece4;         /* lit paper */
  --ink-b: #0a0b0d;        /* text on paper */
  --ink-b2: #4b4a46;       /* lede on paper */
  --line-b: rgba(10, 11, 13, .08); /* 40px grid */
  --bar-b: #c9c6bd;        /* neutral bar on paper */
  --alarm: #ff3b2f;        /* "aren't.", failure bars, crosshair, active toggle */

  /* type */
  --display: "Anton", Impact, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --fs-display: 172px;
  --fs-body: 14px;
  --fs-label: 11px;

  /* geometry */
  --nav-h: 64px;
  --torch: 168px;          /* radius */
  --torch-full: 1600px;    /* covers 1280 × 736 from any point */
  --grid: 40px;
  --radius: 2px;           /* buttons */

  /* motion */
  --t-micro: 160ms;
  --t-reveal: 700ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role             | Family     | Size  | Weight | Line-height | Tracking | Case      |
|------------------|------------|------:|-------:|------------:|---------:|-----------|
| Headline (both)  | Anton      | 172px | 400    | 0.9         | −0.005em | UPPERCASE |
| Logo             | Anton      | 20px  | 400    | 1           | +0.04em  | UPPERCASE |
| Nav links        | Geist Mono | 13px  | 400    | 1.5         | 0        | title     |
| Status pill      | Geist Mono | 12px  | 400    | 1           | +0.04em  | sentence  |
| Lede             | Geist Mono | 14px  | 400    | 1.6         | 0        | sentence  |
| Buttons          | Geist Mono | 13px  | 500    | 1           | 0        | sentence  |
| Strip heading    | Geist Mono | 11px  | 500    | 1           | +0.12em  | UPPERCASE |
| Annotation       | Geist Mono | 11px  | 500    | 1.35        | 0        | sentence  |
| Readout          | Geist Mono | 10px  | 500    | 1           | +0.08em  | UPPERCASE |

## Motion

| Element        | Trigger        | Property             | From → To            | Duration | Easing   | Notes |
|----------------|----------------|----------------------|----------------------|---------:|----------|-------|
| torch position | pointermove    | `--x`, `--y`         | pointer position     | 1 frame  | none     | rAF-throttled, no smoothing: a torch is held, not dragged |
| torch radius   | Reveal toggle  | `--r` (registered)   | 168px ↔ 1600px       | 700ms    | `--expo` | needs `@property` to interpolate |
| crosshair, readout | Reveal toggle | opacity           | 1 ↔ 0                | 160ms    | `--ease` | |
| toggle         | hover / pressed | border, background  | `--line-d` → ink / `--alarm` | 160ms | `--ease` | |

There are no loops. Reduced motion: remove the `--r` transition so the reveal is instant; pointer tracking stays (it is direct manipulation, not animation).

## States

- **Torch (default):** radius 168px; crosshair and readout visible.
- **Revealed:** radius 1600px; toggle `aria-pressed="true"`, red fill, label "Torch mode · R"; hint "Everything, lit".
- **Hero focus-visible:** 2px inset `--ok` ring around the whole hero; arrows move the torch.
- **Buttons hover:** ghost buttons border becomes `--ink-d`; the nav "Start free" goes to `#fff`.
- **Links/buttons focus-visible:** 2px `--ok` outline, 3px offset.
- **No hover device:** `@media (hover: none)` restores the normal cursor.

## Accessibility

- The hidden layer is `aria-hidden`; its meaning is given once via a visually hidden paragraph linked with `aria-describedby` on the hero, so screen-reader users get the punchline without hunting.
- The hero has `aria-label="Hero. Move the pointer, or use arrow keys, to shine the torch."`.
- Toggle is a `<button aria-pressed>`; R toggles globally (ignored when Cmd/Ctrl/Alt is held).
- Focus order: nav links → hero → hero CTAs → toggle.
- Contrast: `--ink-d2` on `--night` is 7.3:1; `--ink-b2` on `--beam` is 7.6:1; alarm red is only used at 172px or as a bar colour.
- The toggle is 40px tall; CTAs are 44px.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: headline 140px; annotations move 120px left; torch radius 150px.
- 768–1023: headline 112px; bottom row stacks (lede and buttons, then strip); annotations shift to the right column at 60% width.
- < 640: headline 72px, torch radius 110px. Do not start revealed (it gives the punchline away). Park the torch over the headline, let a finger drag it, and show the toggle full-width under the hint.

## Acceptance checklist

- [ ] The disc edge is hard: the mask uses a 1px stop gap, no blur, no glow, no shadow.
- [ ] Torch radius is 168px and follows the pointer with no easing.
- [ ] Both layers align exactly; the pill, headline, lede, buttons and strip sit at the same coordinates.
- [ ] The nav is never masked.
- [ ] The base CTAs remain clickable inside the torch.
- [ ] Arrow keys move the torch 32px (96px with Shift) when the hero is focused.
- [ ] R and the toggle animate the radius 168 → 1600px over 700ms with expo-out, and back.
- [ ] `aria-pressed`, toggle label and hint text update with the state.
- [ ] Crosshair and readout follow the torch and fade out when revealed.
- [ ] Ninety uptime bars render in both layers; eleven are red in the hidden layer.
- [ ] Reduced motion makes the reveal instant.
- [ ] The hidden copy is reachable by screen readers through `aria-describedby`.

## Implementation notes

**A crisp mask, driven by custom properties.** A 1px band between the two stops anti-aliases the edge without feathering it:

```css
.beam {
  -webkit-mask-image: radial-gradient(circle at var(--x) var(--y),
    #000 calc(var(--r) - .5px), transparent calc(var(--r) + .5px));
          mask-image: radial-gradient(circle at var(--x) var(--y),
    #000 calc(var(--r) - .5px), transparent calc(var(--r) + .5px));
  pointer-events: none;
  transition: --r 700ms cubic-bezier(.16, 1, .3, 1);
}
.stage.full { --r: 1600px; }
```

**Throttle to the frame, not to a timer:**

```js
let x = 380, y = 330, raf = 0;
function move(nx, ny) {
  const r = stage.getBoundingClientRect();
  x = Math.max(0, Math.min(r.width, nx)); y = Math.max(0, Math.min(r.height, ny));
  if (!raf) raf = requestAnimationFrame(() => {
    raf = 0; stage.style.setProperty('--x', x + 'px'); stage.style.setProperty('--y', y + 'px');
  });
}
stage.addEventListener('pointermove', e => {
  const r = stage.getBoundingClientRect(); move(e.clientX - r.left, e.clientY - r.top);
});
```

**Keep the layers identical except for words.** Build the hidden layer from the same components with a modifier class (`.beam .pill`, `.beam .btn`) so a font-size change in one never misaligns the other. Common mistakes: a soft radial gradient (reads as a glowing blob, which is the opposite of the idea), forgetting `@property` (the radius then snaps), and putting the real buttons in the top layer, which makes them unclickable outside the disc.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
