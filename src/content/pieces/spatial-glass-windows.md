---
title: "Spatial glass windows"
summary: "Three floating glass windows at different depths over a soft room-light scene, with ornament toolbars, a window that comes forward on focus, and gaze hover."
platform: web
type: screen
category: mockups
tags: [spatial, glass, windows, reading, depth]
styles: [glass, soft, dark]
motion: subtle
difficulty: 3
featured: false
published: 2026-10-28
palette: ["#8F7B66", "#1E1E22", "#FFFFFF", "#F3C96A", "#B9A48C"]
fonts: ["Inter Tight", "Newsreader"]
related: []
---

# Spatial glass windows

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A web page that borrows the spatial-computing window language: a reading app called Sill shown as three grey glass windows floating in a softly blurred living room at late-afternoon light. The main window holds an essay set in Newsreader; a vertical tab ornament hangs off its left edge and a pill toolbar ornament straddles its bottom edge. Two side windows (Up next, Highlights) sit further back and turned toward the viewer with `rotateY(±18deg)`. Hover, focus or click a window and it comes forward in Z with a deeper shadow. Every button carries a gaze-like highlight: a 70px soft white spot that follows the pointer inside the button. The detail worth copying: the glass is a dark 82% tint, not a pale frost, so white text stays above 4.5:1 over any part of the room, and a solid `#2F2F34` takes over where `backdrop-filter` is missing.

## Reference behaviour

1. Initial state at 1280×800: the room fills the viewport (warm wall, bright window pane top right, sofa left, plant right, floor from 64% height). The Reading window is in front (`.front`, `translateZ(46px)`), Up next sits left at `translateZ(-160px) rotateY(18deg)`, Highlights sits right at `translateZ(-110px) rotateY(-18deg)`.
2. The Reading window shows a top bar (40px round back button, source line "Sill · Saved from The Lagoon Quarterly", "Page 3 of 8"), a gold kicker "ESSAY · 14 MIN READ", the 44px title "The salt roads of Aveiro", a byline, two paragraphs with one highlighted sentence, and a 3px reading progress bar at 38%.
3. The vertical tab ornament (Library, Reading, Highlights, Search) floats 76px left of the Reading window, vertically centred. Reading is the current tab: a white 48px disc with dark icon. Hovering a tab shows its name in a dark pill 66px to its right, fading in and sliding 4px over 160ms.
4. The toolbar ornament straddles the Reading window's bottom edge (`bottom:-30px`): Aa, a 1px divider, Listen with a three-bar wave and "14:02", Highlight, Saved (pressed, white disc), Share.
5. Hovering any window (or tabbing into it, or pressing on it) moves it forward: Reading to `translateZ(46px)`, Up next to `translateZ(-40px) rotateY(12deg)`, Highlights to `translateZ(0) rotateY(-12deg)`, over 360ms on the sheet spring. Its shadow deepens. A click or focus makes that window the persistent `.front` one; the others go back to rest.
6. Moving the pointer over any button paints a radial white spot (26% alpha at centre, 70px radius) where the pointer is, plus a 10% white fill. Pressing scales the button to 0.96.
7. Listen, Highlight and Saved are toggles (`aria-pressed`). Pressed state is a 90% white fill with `#1D1D21` icon. When Listen is on, its three wave bars animate between 6px and 14px. Each toggle announces its new state through a polite live region ("Reading aloud", "Paused", "Saved to library").
8. Under each side window a window bar floats 26px below: a 96×6px pill with a 16px close dot to its left.
9. Below 900px wide the 3D stage flattens: windows stack in one column (Reading, Highlights, Up next) 56px apart, the tab ornament hides, the toolbar drops Share and the time label, and the page scrolls over a fixed room.

## Structure

```
1280 × 800  (perspective 1700px, origin 50% 40%)
┌──────────────────────────────────────────────────────────────────────────┐
│ room: wall gradient · window pane (62%,6%,30%×48%) · sofa · plant · floor │
│                                                                          │
│        ┌──────────────────────────────┐                                  │
│ ┌─────┐│ ◀  source line      Page 3/8 │┌─────────┐                       │
│ │Up   │●│ KICKER                       ││Highlights│                      │
│ │next │●│ The salt roads of Aveiro    ││ quote    │                      │
│ │rows │●│ byline                       ││ quote    │                      │
│ │ ×4  │●│ body 18/1.56, 452 max        ││ quote    │                      │
│ └─────┘ │ ─────── progress 38%         │└─────────┘                       │
│  ○──    └───[Aa | ▶ Listen 14:02 ✎ ▣ ⇪]─┘   ○──                           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
 Up next 276×420 @ (30,150) · Reading 540×520 @ (404,72) · Highlights 280×384 @ (964,176)
 tab ornament: 64px wide column at Reading.left − 76 · toolbar: 60px tall, centred, bottom −30
```

- `.room` (`aria-hidden`, `position:fixed`): five `<i>` shapes, each blurred 6–10px, over a two-stop wall and floor gradient.
- `<main class="stage">`: the perspective container.
- `<section class="win left" tabindex="0" aria-label="Up next window">`: `h2`, count line, four `<button class="row">` with a 52px gradient cover tile, title and author line, then `.grab`.
- `<article class="win main" tabindex="0" aria-label="Reading window">`: top bar, kicker, `h1`, byline, `.body` paragraphs with one `<mark>`, `role="progressbar"`, then `<nav class="orn tabs" aria-label="Sections">` and `<div class="orn tool" role="toolbar">` positioned against the article.
- `<aside class="win right" aria-label="Highlights window">`: `h2`, count, three `.q` quotes, a "Send to notebook" button, `.grab`.
- `<p class="sr" aria-live="polite">` for toggle announcements.

## Tokens

```css
:root {
  /* room */
  --wall: #b9a48c;          /* mid wall */
  --wall-top: #c7b399;      /* wall at the ceiling */
  --wall-2: #8f7b66;        /* wall at the skirting, page fallback */
  --floor: #5d4d40;         /* floor from 64.2% */
  --floor-2: #4a3d33;       /* floor at the bottom edge */
  --sun: #f1dcb8;           /* window light, radial at 78% 18% */
  /* glass */
  --glass: rgba(30,30,34,.82);      /* window tint */
  --glass-orn: rgba(36,36,40,.84);  /* ornament tint */
  --glass-solid: #2f2f34;           /* no-backdrop-filter fallback */
  --glass-hi: rgba(255,255,255,.16);/* 1px top inner highlight */
  --edge: rgba(255,255,255,.22);    /* 1px inner rim */
  --edge-front: rgba(255,255,255,.30);
  /* ink */
  --ink: #ffffff;           /* titles, labels */
  --ink-2: #dcdce2;         /* body, top bar */
  --ink-3: #cdcdd5;         /* meta lines */
  --mark: #f3c96a;          /* kicker, quote bars, highlight (at 20%) */
  --pressed-ink: #1d1d21;   /* icon on a pressed white disc */
  --tip: #2a2a2e;           /* tab tooltip */
  /* type */
  --ui: "Inter Tight", system-ui, sans-serif;
  --read: "Newsreader", Georgia, serif;
  --fs-title: 44px; --fs-body: 18px; --fs-ui: 14px; --fs-meta: 13px; --fs-small: 12px;
  /* space */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 22px; --s-6: 34px; --s-7: 44px;
  /* radii */
  --r-win: 40px; --r-row: 22px; --r-quote: 20px; --r-cover: 14px; --r-orn: 999px; --r-btn: 999px;
  /* shadows */
  --sh-win: 0 30px 60px -20px rgba(28,18,8,.55), 0 8px 18px rgba(28,18,8,.22);
  --sh-front: 0 50px 90px -24px rgba(28,18,8,.7), 0 14px 30px rgba(28,18,8,.3);
  --sh-orn: 0 16px 30px -10px rgba(20,12,4,.5);
  --blur-win: blur(36px) saturate(1.5);
  --blur-orn: blur(30px) saturate(1.5);
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --spring: cubic-bezier(.32,.72,0,1);
  --t: 360ms; --t-fast: 160ms; --t-wave: 900ms;
}
```

## Typography

| Role              | Family      | Size | Weight | Line-height | Tracking | Case      |
|-------------------|-------------|-----:|-------:|------------:|---------:|-----------|
| Essay title       | Newsreader (opsz 72) | 44px | 400 | 1.04 | −0.015em | sentence |
| Essay body        | Newsreader  | 18px | 400    | 1.56        | 0        | sentence  |
| Quote             | Newsreader italic | 15px | 400 | 1.4      | 0        | sentence  |
| Kicker            | Inter Tight | 12px | 500    | 1           | +0.08em  | UPPERCASE |
| Window heading    | Inter Tight | 20px | 600    | 1.2         | −0.01em  | sentence  |
| Toolbar label     | Inter Tight | 14px | 500    | 1.4         | 0        | sentence  |
| Row title         | Inter Tight | 14px | 500    | 1.25        | 0        | sentence  |
| Meta / byline     | Inter Tight | 12–13px | 400 | 1.4        | 0        | sentence  |
| "Aa" glyph        | Newsreader  | 17px | 500    | 1           | 0        | as set    |

## Motion

| Element        | Trigger                  | Property            | From → To                          | Duration | Easing     |
|----------------|--------------------------|---------------------|------------------------------------|---------:|------------|
| `.win.main`    | hover, focus-within, `.front` | transform      | `translateZ(0)` → `translateZ(46px)` | 360ms | `--spring` |
| `.win.left`    | same                     | transform           | `Z(-160) rotY(18)` → `Z(-40) rotY(12)` | 360ms | `--spring` |
| `.win.right`   | same                     | transform           | `Z(-110) rotY(-18)` → `Z(0) rotY(-12)` | 360ms | `--spring` |
| `.win`         | same                     | box-shadow          | `--sh-win` → `--sh-front`           | 360ms    | `--ease`   |
| `.gz::after`   | hover                    | opacity             | 0 → 1 (spot follows pointer)        | 160ms    | `--ease`   |
| `.gz`          | active                   | transform           | scale 1 → .96                       | 160ms    | `--ease`   |
| `.tl` tooltip  | tab hover / focus-visible | opacity, translate | 0, −4px → 1, 0                      | 160ms    | `--ease`   |
| `.wave i`      | Listen pressed           | height              | 6px ↔ 14px, alternate, staggered −300ms | 900ms | `--ease`   |

Reduced motion: every transition is 1ms and the wave does not animate. Windows still change depth, instantly.

## States

- **Window at rest:** `--glass` fill, 1px `--edge` inner rim, 1px `--glass-hi` top highlight, `--sh-win`.
- **Window forward (hover, focus-within, `.front`):** rim to `--edge-front`, `--sh-front`, `z-index:5`, transform per the motion table.
- **Window focus-visible:** 2px inner white ring plus `--sh-front`.
- **Button hover:** 10% white fill plus the gaze spot.
- **Button focus-visible:** 2px white outline, 2px offset.
- **Pressed / current:** 90% white fill, `--pressed-ink` icon and text.
- **Listen on:** wave bars animate; live region says "Reading aloud".
- **No backdrop-filter:** windows and ornaments switch to `--glass-solid`.

## Accessibility

- Each window is a landmark-like region with an `aria-label` and `tabindex="0"`, so keyboard users can bring it forward by tabbing into it.
- Tab ornament is a `<nav aria-label="Sections">`; the current tab carries `aria-current="page"`; icon-only buttons have `aria-label`. Tooltip text is `aria-hidden` because the label already names the button.
- Toolbar is `role="toolbar"` with `aria-label="Reading tools"`; toggles use `aria-pressed`.
- Progress uses `role="progressbar"` with `aria-valuenow="38"`.
- Contrast: `--ink` on the darkest wall composite is about 6.5:1; `--ink-3` meta on glass stays above 4.5:1 because the tint is 82%, not the common 40%.
- Hit targets: toolbar buttons 44px tall, tab buttons 48px, side rows about 72px.
- Tab order: Up next rows, back button, essay, tabs, toolbar, Highlights.

## Responsive rules

- ≥ 1280: as specified, three windows in perspective.
- 1024–1279: keep the layout and scale the stage with `transform: scale(calc(100vw / 1280px))` from the top centre, or shrink side windows to 240px.
- 900–1023: hide the Up next window; Reading and Highlights stay in 3D.
- < 900 (phones at 390): flatten. `perspective:none`, windows `position:relative`, full width minus 16px gutters, stacked Reading, Highlights, Up next with a 56px gap so the toolbar and window bars have room. Corner radius drops to 32px, title to 32px, body to 17px. Tabs hide; toolbar keeps Aa, Listen, Highlight, Saved.

## Acceptance checklist

**Always**
- [ ] Glass tint is at least 80% opaque, and a solid fallback is used when `backdrop-filter` is unsupported.
- [ ] Exactly one window is `.front`; hover, focus-within or click moves a window forward in Z over 360ms with the spring curve.
- [ ] The toolbar ornament straddles the main window's bottom edge, half in and half out.
- [ ] Every button shows the pointer-following gaze spot on hover and a 2px white focus ring on keyboard focus.
- [ ] Toggles expose `aria-pressed` and announce through a polite live region.
- [ ] Body text is at least 4.5:1 against the composited glass at 1280 and 390.
- [ ] At 390 nothing scrolls sideways; windows stack in one column.
- [ ] Reduced motion removes transitions and the wave animation.

**This demo**
- [ ] Reading window is 540×520 at (404, 72); Up next 276×420 at (30, 150); Highlights 280×384 at (964, 176).
- [ ] Title reads "The salt roads of Aveiro" in Newsreader 44px; kicker "ESSAY · 14 MIN READ" in `#F3C96A`.
- [ ] Toolbar reads Aa, Listen 14:02, Highlight, Saved (pressed), Share.
- [ ] Highlights shows "6 in this essay" and three italic quotes with 3px gold bars.

## Implementation notes

1. **The gaze spot.** One delegated `pointermove` writes the pointer position into custom properties on whichever button is under it; CSS does the painting. Do not attach a listener per button.

```css
.gz { position: relative; overflow: hidden; }
.gz::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  pointer-events: none; opacity: 0; transition: opacity 160ms var(--ease);
  background: radial-gradient(70px circle at var(--gx,50%) var(--gy,50%),
    rgba(255,255,255,.26), rgba(255,255,255,0) 70%);
}
.gz:hover::after { opacity: 1; }
```

```js
document.addEventListener('pointermove', e => {
  const b = e.target.closest?.('.gz'); if (!b) return;
  const r = b.getBoundingClientRect();
  b.style.setProperty('--gx', e.clientX - r.left + 'px');
  b.style.setProperty('--gy', e.clientY - r.top + 'px');
});
```

2. **Depth without a 3D engine.** Put `perspective:1700px` on the stage and give each window a resting `translateZ` plus `rotateY`. The forward state is a selector list, so hover, keyboard focus and the clicked window share one rule. Raise `z-index` on the forward window, because a negative `translateZ` does not stop a later sibling painting on top.

```css
.win { transition: transform 360ms var(--spring), box-shadow 360ms var(--ease); }
.left { transform: translateZ(-160px) rotateY(18deg); }
.left:is(:hover, :focus-within, .front) { transform: translateZ(-40px) rotateY(12deg); z-index: 5; }
```

3. **Glass that passes contrast.** The common mistake is a pale 30–40% frost; white text then fails over the bright window pane. Use a dark 82% tint and test the fallback:

```css
.win { background: rgba(30,30,34,.82); backdrop-filter: blur(36px) saturate(1.5); }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .win, .orn { background: #2f2f34; }
}
```

Do not dim the back windows with `filter: brightness()` to fake depth: it drags their text under 4.5:1. Depth comes from Z, rotation and shadow only.
