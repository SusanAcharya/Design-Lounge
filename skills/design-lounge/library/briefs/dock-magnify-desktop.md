<!-- Design Lounge Nº 305 · "Magnifying desktop dock" · designlounge.vercel.app -->

# Magnifying desktop dock

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The app dock of an invented desktop OS, sitting 8px above the bottom edge of a full-screen desert-dune wallpaper, under a 30px translucent menu bar and two open app windows. Ten invented apps (Cobble, Gannet, Pipit, Wicket, Murrel, Sundial, Glint, Shale, Gully, and Bin after a separator) are drawn entirely in CSS and inline SVG. As the pointer travels along the dock, icons grow from 52px to 91px on a cosine falloff measured from each icon's resting centre, so neighbours swell too and the row widens like a lens. The detail worth copying is that the dock's frosted slab stays a fixed 68px tall while the icons grow out of it upward, and that the falloff uses resting positions so the lens never jitters.

## Structure

```
┌──────────────────────────────────────────────────────────── 1280 ──┐
│ ◐ Gannet  File Edit View Window Help          wifi 82%  Sun 4 Oct  │ 30px menu bar, blurred
│                                                                    │
│      ┌ shale — ~/studio ──────────┐                                │
│      │ ┌ Inbox — 3 unread ────────────────┐       ( sun )          │ windows 520px wide
│      └─│ Anika Shrestha        23:41      │                        │
│        │ Rohan Mehta           21:08      │                        │
│        │ Studio Pith           18:30      │                        │
│        └──────────────────────────────────┘                        │
│  ~~~~~~~~~~~~~~~ dunes (4 layered SVG paths) ~~~~~~~~~~~~~~~~~~~~~  │
│                ┌──────────────────────────────────┐                │
│                │ ▢ ▢³ ▢ ▢ ▢ 4 ▢ ▢ ▢ │ ▢ │  68px slab, icons 52px
│                └──•──•──────────•────────────────┘  8px from bottom │
└────────────────────────────────────────────────────────────────────┘
```

- Wallpaper: one inline `svg` with `preserveAspectRatio="xMidYMax slice"`, fixed, full viewport, `aria-hidden`.
- Menu bar: `header`. The front app name is a `b` that updates. The menu words are decorative (`aria-hidden`). The clock is a `time` with a `datetime` attribute.
- Windows: `main` labelled "Desktop" containing `section` elements, each with `aria-label="<App> window"`, a 38px title `header` with one real close `button` and two decorative lights, and an `h2` title.
- Dock: `ul role="toolbar" aria-label="Dock"`. Each `li.it` holds a `button.app` (the squircle icon inside), a `.tip` and a `.dot`. The separator is `li role="separator" aria-orientation="vertical"`.
- An `aria-live="polite"` visually hidden paragraph announces "Opening Pipit" and then "Pipit is open".

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Icon lens | pointermove / focus | width (and so height) | 52 → up to 91px | 80ms `--ease` while tracking | lens disabled |
| Icon rest | pointerleave / blur | width | current → 52px | 260ms `--ease` | instant |
| Tooltip | hover / focus-visible | opacity, translateY | 0, 4px → 1, 0 | 120ms `--ease` | instant |
| Launch bounce | click on idle app | translateY | 0 → −0.55·B → 0, ×2 | 560ms each, `cubic-bezier(.3,.6,.4,1)` | no bounce, opens at once |
| Running dot | launch done | opacity | 0 → 1 | 200ms | instant |
| Window open | window created | opacity, translateY, scale | 0, 14px, .97 → 1, 0, 1 | 360ms `--expo` | none |

The bounce runs on the `button`, not on the `li`, so the lens width and the bounce never fight over `transform`.

## States

- Resting icon: 52px, no tooltip.
- Hover: tooltip visible, icon sized by the lens.
- Active (pressed): icon face `filter: brightness(.82)`.
- Focus-visible: 2px `--cream` outline, 3px offset, on the squircle (`border-radius: 24%`), plus the tooltip.
- Running: 4px `--cream` dot centred 7px below the icon.
- Launching: bouncing, clicks ignored until it lands.
- Badge: 19px red pill, top-right, offset −5px, 1.5px cream ring.
- Back window: `filter: saturate(.85)`, grey lights `#d9c7b6`.
- Front window: lights `#e5604d`, `#e8b04b`, `#7dba5c`.

## Accessibility

- The dock is `role="toolbar"` with `aria-label="Dock"`; exactly one icon has `tabindex="0"`.
- Each icon button's name is composed in JS: "Gannet, running, 3 unread". Update it when the app starts running.
- Icon faces, badges, tooltips and dots are `aria-hidden`; the name lives on the button.
- Left/Right/Home/End move focus; Enter/Space launch (native button).
- The launch is announced through a polite live region.
- Each window close light is a real button labelled "Close Gannet window" with a visible focus ring.
- Contrast: `--cream` on the dark tooltip is above 12:1. Window body `#2b1a1e` on `#fff8f0` is above 14:1; meta `#8a6a5e` is used at 12px for timestamps only.
- Magnification is never needed to hit an icon: the resting icon is 52px.

## Responsive rules

- ≥1280: as specified.
- 1024 / 768: same 52px icons; the 11-slot dock is 655px wide and still fits.
- <640: gap drops to 4px and the resting size is computed as `floor((viewportWidth − 60) / 10) − gap`, clamped 24–52px (about 26px at 375). The menu words hide; the badge shrinks to 15px.
- Touch devices: no lens and no hero peek. Tap launches.
- Windows are `min(520px, 100vw − 32px)` wide and clamp to stay on screen.

## Acceptance checklist

### Always

- [ ] The dock slab height stays fixed (`B + 16px`) while icons grow upward out of it.
- [ ] The lens size uses each icon's resting centre, not its live position.
- [ ] Pointer updates are throttled to one `requestAnimationFrame` per frame.
- [ ] The falloff is a cosine curve, max 1.75 × B, radius 3 × B.
- [ ] Every icon has a tooltip on hover and focus.
- [ ] Launching an idle app bounces twice, then shows a running dot.
- [ ] Roving tabindex: one tab stop; arrows, Home and End work and wrap.
- [ ] Keyboard focus magnifies the same as hover.
- [ ] Reduced motion disables the lens and the bounce; the dock still works.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Ten apps, with a separator before Bin, all drawn in CSS/SVG.
- [ ] Cobble, Gannet and Shale start running; Gannet shows a "3" badge.
- [ ] Sundial's face shows today's month and day.
- [ ] The menu bar name follows the front window.
- [ ] Wallpaper is four dune layers from `#e3945f` to `#4a1f1f` under a `#fbe9cf` sun.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: Gannet's window (Inbox, 3 unread) is in front of Shale's terminal window. The menu bar reads "Gannet". Cobble, Gannet and Shale show running dots. Gannet carries a red "3" badge. On a hover-capable device the dock opens mid-magnify centred on Murrel with its tooltip showing; the peek ends on the first pointer entry or focus.
2. Pointer moves over the dock: every icon's width becomes `B + (M − B) × (cos(π·d/R) + 1) / 2` where `d` is the horizontal distance from the pointer to that icon's resting centre, `B = 52`, `M = 91` (1.75 × B), `R = 156` (3 × B). Icons further than R stay at B. Updates are throttled to one per animation frame.
3. Hovering an icon shows its name in a dark tooltip 12px above the icon, fading in over 120ms with a 4px rise.
4. Pointer leaves the dock: every icon returns to 52px over 260ms.
5. Clicking an app that isn't running: the icon bounces twice (560ms each, peak at 42% of the keyframe, height 0.55 × B), then the running dot fades in, the app's window opens and comes to the front, and the menu bar name changes.
6. Clicking a running app brings its window to the front, or reopens it if it was closed.
7. The red light in a window's title bar closes the window. The app keeps its running dot. The menu bar falls back to the next window in z-order, or "Cobble".
8. Clicking anywhere on a window brings it to the front. Back windows desaturate slightly and their traffic lights turn grey.
9. Keyboard: Tab enters the dock on one icon (roving tabindex). Left/Right move between icons and wrap. Home/End jump to the first and last. The focused icon magnifies its neighbourhood exactly like the pointer and shows its tooltip. Enter or Space launches.
10. The menu bar clock shows the real day, date and time and refreshes every 10 seconds.
11. Touch pointers never magnify. Taps launch.

## Tokens

```css
:root {
  /* wallpaper */
  --sky-1: #f6d9b8;  --sky-2: #efa77a;  --sun: #fbe9cf;
  --dune-1: #e3945f; --dune-2: #c4643f; --dune-3: #8a3a2c; --dune-4: #4a1f1f;
  /* chrome */
  --bar: rgba(58, 24, 20, .30);        /* menu bar */
  --dock: rgba(46, 20, 18, .34);       /* dock slab */
  --dock-line: rgba(255, 236, 214, .30);
  --cream: #fff1df;                    /* text on chrome, running dot, focus ring */
  /* windows */
  --win: #fff8f0; --win-line: #ecdccb;
  --ink: #2b1a1e; --ink-2: #5b3a30; --ink-3: #8a6a5e;
  --accent: #c4643f; --badge: #e5483a;
  /* type */
  --sans: "Familjen Grotesk", system-ui, sans-serif;
  --mono: "Martian Mono", ui-monospace, monospace;
  /* dock geometry */
  --b: 52px;          /* resting icon size, recomputed in JS */
  --gap: 6px;         /* 4px under 640px */
  --dock-pad: 7px 9px 9px;
  --slab-r: 20px;
  --icon-r: 23%;
  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-tip: 120ms; --t-rest: 260ms; --t-track: 80ms; --t-bounce: 560ms; --t-win: 360ms;
}
```

Icon faces (top → bottom gradients, glyph colour):

| App | Face | Glyph |
| --- | --- | --- |
| Cobble (files) | `#f5bf66 → #e0892f` | folder, `#3a1f12` |
| Gannet (mail) | `#fbf6ee → #e7d8c5` | envelope, `#b5543a` |
| Pipit (notes) | `#ffe896 → #f4c540` | page with lines, `#5a4210` |
| Wicket (browser) | `#2a706d → #123f3e` | compass, `#e9f7f2` |
| Murrel (music) | `#ea6a5d → #b3352e` | two notes, `#fff4ec` |
| Sundial (calendar) | `#fffdf8`, red `#d8473a` month band | live month + day number |
| Glint (photos) | `#fffaf2 → #f1e4d4` | five overlapping coloured petals |
| Shale (terminal) | `#3a383e → #1f1e22` | `>_` in Martian Mono, `#a8eba0` |
| Gully (maps) | `#d9ebcd → #b9d6a6` | folded map, `#2f5a3a` |
| Bin | translucent cream `.42 → .16` | bin, `--cream` |

Every face: `border-radius: 23%`, `box-shadow: inset 0 1px 0 rgba(255,255,255,.5), inset 0 -1px 0 rgba(0,0,0,.14), 0 7px 14px -6px rgba(40,10,6,.6)`. Glyph SVG is 58% of the icon, stroke 1.8, round caps.

## Typography

| Role | Family | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| Menu bar | Familjen Grotesk | 13px | 400, app name 700 | `--cream` |
| Clock | Martian Mono | 12px | 500 | letter-spacing −0.02em |
| Tooltip | Familjen Grotesk | 12.5px | 500 | `--cream` on `rgba(43,26,30,.9)` |
| Badge | Familjen Grotesk | 11px | 700 | white on `--badge`, 19px pill |
| Window title | Familjen Grotesk | 13px | 600 | `--ink-2`, centred |
| Window body | Familjen Grotesk | 14px | 400 / 600 | meta 12px `--ink-3` |
| Terminal | Martian Mono | 12px | 400 | line-height 1.8 |
| Calendar face | Familjen Grotesk | 0.17 × icon (month), 0.48 × icon (day) | 700 / 600 | scales with magnification |

## Implementation notes

Compute resting centres from arithmetic, not from `getBoundingClientRect()`. Rects taken mid-transition are wrong, and the lens starts chasing itself.

```js
function measure() {
  const W = innerWidth, n = apps.length;
  GAP = W < 640 ? 4 : 6;
  B = Math.max(24, Math.min(52, Math.floor((W - 60) / n) - GAP));
  M = Math.round(B * 1.75); R = B * 3;
  let total = 18;                       // dock padding 9 + 9
  items.forEach((it, i) => total += (it.sep ? 11 : B) + (i ? GAP : 0));
  let x = W / 2 - total / 2 + 9;        // dock is centred
  items.forEach(it => { const w = it.sep ? 11 : B; it.cx = x + w / 2; x += w + GAP; });
}
function magnify(px) {
  apps.forEach(it => {
    const d = Math.abs(px - it.cx);
    const s = d < R ? B + (M - B) * (Math.cos(Math.PI * d / R) + 1) / 2 : B;
    it.el.style.setProperty('--s', s.toFixed(1) + 'px');
  });
}
```

Draw the slab as a pseudo-element pinned to the bottom so it doesn't grow with the icons:

```css
.dock { position: fixed; left: 50%; bottom: 8px; transform: translateX(-50%);
        display: flex; align-items: flex-end; gap: var(--gap); padding: 7px 9px 9px; }
.dock::before { content: ""; position: absolute; inset: auto 0 0 0;
        height: calc(var(--b) + 16px); border-radius: 20px; background: var(--dock);
        border: 1px solid var(--dock-line); backdrop-filter: blur(26px) saturate(1.4); }
.it { width: var(--s, var(--b)); transition: width 260ms var(--ease); }
.dock.mag .it { transition: width 80ms var(--ease); }
.app { width: 100%; aspect-ratio: 1; }
.it.bounce .app { animation: bounce 560ms cubic-bezier(.3,.6,.4,1) 2; }
@keyframes bounce { 0%,100% { transform: none } 42% { transform: translateY(calc(var(--b) * -.55)) } }
```

Common mistakes:

- Scaling icons with `transform: scale()`. Neighbours don't move apart, and icons overlap. Animate width so flex layout spreads them.
- Growing the whole dock background with the icons. The slab stays put; icons rise out of it.
- Leaving the 260ms transition on while tracking. The lens lags a quarter second behind the pointer. Use 80ms while `.mag` is set.
- Magnifying on touch. A finger can't hover; it just causes a jump before the tap.
- Making every icon a tab stop. Ten tabs to cross the dock is too many; use one with arrow keys.
- Real OS or app logos. Invent the apps and draw the faces.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
