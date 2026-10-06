<!-- Design Lounge Nº 288 · "Laptop browser mockup" · www.designlounge.live -->

# Laptop browser mockup

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A front-view laptop mockup, the fictional Torva Book 14, for presenting a website in a case study. It is drawn in CSS: an aluminium lid with a notch, a black bezel, a dark hinge strip and a thin base with a thumb scoop. On load the lid swings up from flat to upright in 1.5s, then the screen boots: a desktop wallpaper and menu bar fade in, and a browser window rises into place. The browser has three working tabs that swap three small pages of a type studio called Brask and update the address bar. The stage is a pale sage wall meeting a desk surface exactly at the base of the laptop. The detail worth copying is the two-faced lid: the screen face and an aluminium back face share one 3D plane with `backface-visibility: hidden`, so mid-swing you see the right side at every angle.

## Structure

```
1280 × 800, wall #cfd5d0
┌──────────────────────────────────────────────────────────────────────┐
│ Torva Book 14                         [● SILVER|● SPACE] [↻ OPEN LID]│ 24px top
│ Browser mockup · brask.studio…                                        │
│                  ┌───────────── lid 90% of rig ─────────────┐         │
│                  │ Torva File Edit View History  ▂notch▂  Sun 4 Oct 9:41
│                  │   ┌─● ● ● [Brask, Index ×][Pricing][Changelog] + ┐│
│                  │   │ ‹ › 🔒 brask.studio/work                  ··· ││
│                  │   │  Brask              Work Type Studio Contact ││
│                  │   │  Type and tools for slow, careful reading.   ││
│                  │   │  [ Aa ]  [ ◯ ]  [ ||||| ]                    ││
│                  │   └──────────────────────────────────────────────┘│
│                  └──────────────────────────────────────────────────┘│
│                     ▀▀▀▀▀▀▀▀▀▀▀▀ hinge 84% ▀▀▀▀▀▀▀▀▀▀▀▀              │
│              ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ base 100% ▔▔▔ scoop ▔▔▔▔▔▔▔▔▔▔▔         │
│ ════════════════ desk surface from the base line down ══════════════ │
└──────────────────────────────────────────────────────────────────────┘
```

- `header.top`: caption block and a controls row (`div role="group" aria-label="Finish"` with two `aria-pressed` buttons, and a replay button).
- `main.stage` centres `.rig`: width `min(900px, 100vw − 48px, (100vh − 190px) × 1.42)`, `container-type: inline-size`, `perspective: 2400px`, `perspective-origin: 50% -40%` (eye above the laptop).
- `.rig::before` is the desk: from `100% − 1.2cqw` downwards, extended left and right by 100vw, clipped by `.stage { overflow: hidden }`.
- `.lid` (90% width, aspect 1.545, origin bottom centre) contains `.back` (rotated 180° on X) and `.face > .bezel > .notch + .screen`.
- `.screen` holds `.desk-ui` (wallpaper + menu bar) and `.win` (browser chrome + `.pages`).
- Tabs are `role="tablist"` with `button role="tab"`; each page is a `section role="tabpanel"`.
- Below the lid: `.hinge` (84% width), `.base` (full rig width), `.shadow` (blurred ellipse).

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Lid | load, replay | rotateX | −90° → 0° | 1500ms expo out | lid starts open |
| Desktop | 1000ms after start | opacity | 0 → 1 | 500ms standard | instant |
| Window | same | opacity, translateY, scale | 0, 1.2cqw, .97 → 1, 0, 1 | 450ms / 600ms expo out, 150ms delay | instant |
| Page swap | tab select | opacity, translateY | 0, .8cqw → 1, 0 | 280ms / 400ms expo out | instant |
| Tab hover | pointer | background | transparent → white 40% | 160ms | same |
| Finish | toggle | colours | swap | instant | same |

## States

- Tab selected: `--paper` background joining the address bar, dark text, close glyph at 60%. Unselected: `#5d5a53` text, close hidden. Focus-visible: 2px cobalt outline, offset −2px so it stays inside the strip.
- Finish button pressed: `--ink` fill, wall-coloured text. Hover (unpressed): 6% ink tint.
- Replay hover: 6% ink tint.
- Booting: screen is black until the lid has mostly opened.
- Pricing tier "Studio" is the highlighted card: dark fill, cobalt button.

## Accessibility

- Tabs follow the ARIA tabs pattern: roving `tabindex`, ArrowLeft/ArrowRight wrap, Home/End jump, `aria-selected`, `aria-controls`, panels `aria-labelledby` their tab.
- Finish buttons use `aria-pressed` inside a labelled group.
- The rig has `role="group"`, `aria-roledescription="device mockup"`, and a label that names the finish.
- The lid back, menu bar and decorative browser icons are `aria-hidden`.
- Contrast: `#131714` on `#cfd5d0` ≈ 13:1; `#5c665f` captions ≈ 4.6:1; page body `#56534c` on `#f3f1ec` ≈ 7:1. In-screen text is miniature by nature; it is a picture of a website, and the panels still carry real headings for screen readers.

## Responsive rules

- ≥1280: laptop up to 900px wide, limited by height: `(100vh − 190px) × 1.42`.
- 1024 / 768: same composition, laptop narrows; controls stay top right and wrap under the caption when needed.
- <640: caption title 18px, controls wrap to their own row, laptop `100vw − 48px` (327px at 375). Everything inside scales with `cqw`.
- The desk band is anchored to the laptop base, not to the viewport, so the laptop always sits on the desk.
- Never let the desk create horizontal scroll: it extends 100vw each side and the stage clips it.

## Acceptance checklist

### Always

- [ ] The device is CSS only; the browser contents are live HTML.
- [ ] The lid has a screen face and an aluminium back face, both `backface-visibility: hidden`, rotating together around the bottom edge.
- [ ] The screen boots only after the lid is mostly open.
- [ ] Tabs implement the ARIA tabs pattern and update the address bar.
- [ ] A replay control re-runs the opening.
- [ ] Every in-device size uses container units of the rig.
- [ ] Reduced motion: lid starts open, no fades, tabs still swap.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Device name "Torva Book 14", finishes Silver and Space.
- [ ] Tabs "Brask, Index", "Pricing, Brask", "Changelog" with paths `/work`, `/pricing`, `/changelog` on `brask.studio`.
- [ ] Menu bar "Torva File Edit View History" and "Sun 4 Oct 9:41".
- [ ] Index headline "Type and tools for *slow, careful* reading." with three cards (Aa, ring, barcode stripes).
- [ ] Pricing €40 / €180 / €600; Changelog v3.2, v3.1, v3.0.
- [ ] Lid opens over 1500ms; boot at 1000ms.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Load: the lid starts at `rotateX(-90deg)` (lying flat toward the viewer, back face up) and opens to `0deg` over 1500ms with expo-out easing.
2. At 1000ms the screen gets class `on`: the wallpaper and menu bar fade in over 500ms; the browser window fades in and rises from `translateY(1.2cqw) scale(.97)` over 450ms/600ms with a 150ms delay.
3. First frame after the animation: Index tab selected, address bar reads `brask.studio/work`.
4. Clicking a tab (or ArrowLeft/ArrowRight/Home/End with a tab focused) selects it, swaps the page with a 280ms fade and 0.8cqw rise, and sets the path: `/work`, `/pricing`, `/changelog`.
5. Hovering an unselected tab tints it `rgba(255,255,255,.4)` and reveals its close glyph at 60% opacity.
6. Finish toggle (Silver, Space) recolours the lid rim, the lid back, and the base gradient. The bezel stays black.
7. "Open lid again" resets the screen to black, restarts the lid animation and the boot sequence.
8. A polite live region announces "Space finish" or "Lid opening".

## Tokens

```css
:root {
  --wall: #cfd5d0;
  --desk: #b4bcb5;  --desk-2: #a6afa8;
  --ink: #131714;   --ink-2: #3f4842;  --ink-3: #5c665f;
  --line: #a9b2ab;
  --accent: #2346d8;   /* cobalt: in-page accent and focus ring */
  --paper: #f3f1ec;    /* browser page */
  --sans: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --open: 1500ms;
  /* aluminium ramp — Silver */
  --al-1: #f2f3f4; --al-2: #d6d8db; --al-3: #a9adb2; --al-4: #7d8187;
}
[data-finish="space"] { --al-1: #9a9ea4; --al-2: #5f6368; --al-3: #45484c; --al-4: #2a2c2f; }
```

Geometry in `cqw` of the rig: lid radius 2.4cqw top / 0.9cqw bottom, rim 0.32cqw, bezel padding 1.25cqw sides and top / 1.6cqw bottom, notch 10% × 2.5cqw with 0.9cqw bottom radii, hinge 0.75cqw tall, base 1.55cqw tall with a 13% × 55% scoop. Browser: tab strip 3.4cqw, tabs 2.6cqw tall, address field 2.4cqw.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Caption title | Bricolage Grotesque | 22px | 800 | 1.1 | −0.01em | — |
| Caption sub, controls | JetBrains Mono | 12px | 400 | 1.4 | 0.02–0.06em | controls uppercase |
| Menu bar | Bricolage Grotesque | 1cqw | 500 / 800 for app name | 1 | 0 | — |
| Tab label | Bricolage Grotesque | 1cqw | 500 | 1 | 0 | — |
| Address | JetBrains Mono | 1.05cqw | 400 | 1 | 0 | lowercase |
| Page headline | Bricolage Grotesque | 4.6cqw | 800 | 0.95 | −0.035em | sentence |
| Page body | Bricolage Grotesque | 1.25cqw | 400 | 1.45 | 0 | sentence |
| Changelog dates | JetBrains Mono | 1cqw | 400 | 1 | 0 | — |

## Implementation notes

**Two-faced lid.** The back face is rotated 180° on X so that when the lid lies flat toward the viewer, the viewer (eye above) sees aluminium; as it rises, the screen face takes over.

```css
.rig { perspective: 2400px; perspective-origin: 50% -40%; container-type: inline-size; }
.lid { width: 90%; margin: 0 auto; aspect-ratio: 1.545; transform-origin: 50% 100%; transform-style: preserve-3d; }
.lid.anim { animation: open var(--open) var(--ease-out) both; }
@keyframes open { from { transform: rotateX(-90deg); } to { transform: rotateX(0); } }
.face, .back { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 2.4cqw 2.4cqw .9cqw .9cqw; }
.back { transform: rotateX(180deg); background: radial-gradient(60% 80% at 50% 40%, var(--al-1), var(--al-2) 70%, var(--al-3)); }
```

**Replay without a stuck animation.** Remove the class, force a reflow, add it again; restart the boot timer.

```js
function open() {
  clearTimeout(boot); screen.classList.remove('on');
  lid.classList.remove('anim'); void lid.offsetWidth;
  if (reduce) { screen.classList.add('on'); return; }
  lid.classList.add('anim');
  boot = setTimeout(() => screen.classList.add('on'), 1000);
}
```

**Desk that meets the base.** Draw the desk from the rig, not the body, so it always lines up:

```css
.rig::before { content: ""; position: absolute; left: -100vw; right: -100vw; top: calc(100% - 1.2cqw);
  height: 100vh; background: linear-gradient(var(--desk), var(--desk-2)); z-index: -2; }
.stage { overflow: hidden; }
```

Common mistakes:

- Rotating the lid with `rotateX(90deg)`: that folds it away from the viewer, through the back of the base.
- Forgetting `perspective-origin` above centre; a dead-centre eye shows the lid as a line until the last frames.
- Using an `iframe` for the browser page; it adds a document, breaks `cqw` scaling and blocks the boot fade.
- Drawing real browser branding or real traffic-light colours. The window dots here are neutral grey.
- Body-level `overflow: hidden` alone; `scrollWidth` still counts the desk. Clip on the stage.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
