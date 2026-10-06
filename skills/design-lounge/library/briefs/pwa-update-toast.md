<!-- Design Lounge Nº 057 · "PWA update toast" · www.designlounge.live -->

# PWA update toast

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The **"new version available" toast** for "Kestrel", a task-list PWA, shown when a service worker has installed a fresh build and is waiting to activate. A light toast rises from just above the bottom nav: lime download tile, "New version available / v2.4.1 · fixes offline sync", a dark "Reload" button and a dismiss × wrapped in a 36px countdown ring that empties over 10s before auto-dismissing. Reload hides the toast and sweeps a full-screen lime panel up from the bottom, holds "v2.4.1" for 900ms, then sweeps it off the top to reveal the same page with its version pill updated. The detail worth copying is the countdown ring: an SVG circle's `stroke-dashoffset` animated once over exactly the auto-dismiss duration, restarted by reflow whenever the toast is re-shown.

## Structure

```
390 × 844
┌────────────────────────────────────┐
│ (54px clearance)                   │
│ Kestrel                  (v2.4.0)  │  h1 28px/800 · version pill
│ Tuesday · 5 open, 2 done           │
│ ┌────────────────────────────────┐ │
│ │ ☑ Ship release notes…    done  │ │  task rows 56px, 14px radius
│ │ ☑ Reply to Loam Studio…  done  │ │
│ │ ☐ Review the drawer scrim 10:30│ │
│ │ ☐ Book dentist…          today │ │
│ │ ...                            │ │
│ └────────────────────────────────┘ │
│ ╭────────────────────────────────╮ │
│ │ ▣ New version available        │ │  toast, bottom 112, 16px radius
│ │   v2.4.1 · fixes offline sync  │ │  [Reload] 36px · (×) ring 36px
│ ╰────────────────────────────────╯ │
│ ✓ Today  ▦ Upcoming  ≡ Lists  ⚙ Settings │  nav 64px
│ (34px clearance)                   │
└────────────────────────────────────┘
      wipe: full-screen lime panel, "v2.4.1" 56px centred
```

- `<header class="top">` — `<h1>` + `.ver` pill. `<p class="sub">` line.
- `<ul class="tasks">` — `<li><button role="checkbox" aria-checked>` with `.box` (22px), label span, `<small>` time.
- `<button class="again">` — absolute, `left:16px; bottom:112px`.
- `<div class="toast" role="status" aria-live="polite">` — padding `12px 6px 12px 14px`, 10px gaps; `.ic` tile 36px, `.txt` (`<b>` + `<small>`), `<button class="act">Reload`, `<button class="dis">` containing an SVG ring (`.tr` track + `.pr` progress) and a 14px × glyph.
- `<div class="wipe" aria-hidden>` — absolute `inset:0`, z-index 5, `<b>` version and `<small>` caption.
- `<nav class="nav" aria-label="Primary">` — four buttons.

## Motion

| Element         | Trigger        | Property             | From → To            | Duration | Easing        | Delay |
|-----------------|----------------|----------------------|----------------------|---------:|---------------|------:|
| `.toast`        | show           | translateY, opacity  | 24px, 0 → 0, 1       | 420 / 200ms | `--ease-out` / linear | 0 |
| `.toast`        | hide           | translateY, opacity  | 0, 1 → 24px, 0       | 240ms    | `--ease-in`   | 0 |
| `.ring .pr`     | show           | stroke-dashoffset    | 0 → 100.5            | 10s      | linear        | 0, `forwards` |
| `.wipe`         | reload         | translateY           | 100% → 0             | 520ms    | `--ease-emph` | 0 |
| `.wipe b/small` | reload         | opacity, translateY  | 0, 10px → 1, 0       | 200 / 300ms | `--ease-out` | 300ms |
| `.wipe`         | unwipe         | translateY           | 0 → −100%            | 520ms    | `--ease-in`   | 1420ms after reload (JS) |
| `.ver`          | unwipe         | color, border-color  | ink-3 → lime         | 160ms    | linear        | at 1420ms |
| `.box`          | toggle         | background, border   | transparent → lime   | 160ms    | linear        | 0 |
| `.act:active`   | press          | scale                | 1 → .97              | 0        | —             | instant |

Reduced motion: transitions and animations 1ms; the ring shows full (no countdown drawing) but the 10s auto-dismiss timer still runs; the wipe still cuts to lime and back on the same JS timings.

## States

- **Toast shown:** `.toast.on` — interactive, ring animating, `auto` timer armed.
- **Toast hidden:** no `.on` — `pointer-events:none`, "Simulate update" reachable.
- **Wiping / unwiping:** `body.wiping` then `body.unwiping`; the panel is `aria-hidden` and `pointer-events:none` throughout.
- **Version pill updated:** `.ver.new` — lime text and border.
- **Task checked:** `aria-checked="true"`, box filled lime with dark check, label strikethrough in `--ink-3`, time reads "done".
- **Nav current:** `aria-current="page"`, lime.
- **Row hover:** `--panel-2`.
- **Focus-visible:** 3px lime outline, 2px offset, on all buttons.

## Accessibility

- Toast is `role="status" aria-live="polite"` so "New version available v2.4.1 · fixes offline sync" is announced once; it does not steal focus.
- Dismiss button label: "Dismiss, auto-closes in 10 seconds". Esc also dismisses.
- Reload is a plain `<button>`; in production it posts `SKIP_WAITING` to the waiting worker and calls `location.reload()` on `controllerchange`.
- The wipe panel is `aria-hidden` decoration; the version pill text change is the accessible signal of the update.
- Tasks are `role="checkbox"` buttons; the time cell text ("done") updates with the state.
- Contrast: `--toast-sub` on `--toast` 5.6:1; `--ink-2` on `--bg` 8.3:1; `--lime-ink` on `--lime` 13.4:1; `--ink-3` on `--panel` 4.5:1.
- Hit targets: Reload 36px tall (give it a 44px `::after` hit area on touch), dismiss 36px visual within a 44px row, tasks 56px, nav ≥ 88×52.

## Responsive rules

- 390 wide: as specified.
- 360 wide: toast subline may truncate — set `white-space:nowrap; overflow:hidden; text-overflow:ellipsis` on `.txt small`.
- ≥ 600 wide: toast caps at `max-width:420px`, anchored bottom-left of the content column at 24px insets; the wipe stays full-viewport.
- Tablet with a left rail: `--toast-bottom` becomes 24px (no bottom nav to clear).

## Acceptance checklist

- [ ] Toast is `#F1F0EC` on the dark page, 16px radius, at `bottom:112px` with 16px side insets, casting `0 12px 32px rgba(0,0,0,.45)`.
- [ ] Toast enters over 420ms `cubic-bezier(.16,1,.3,1)` from 24px below; exits over 240ms `cubic-bezier(.4,0,1,1)`.
- [ ] Countdown ring is a 36px SVG (r=16) whose `stroke-dashoffset` goes 0 → 100.5 over exactly 10s, and the toast auto-dismisses at 10s.
- [ ] Re-showing the toast restarts the ring from full (forced reflow between class removal and re-add).
- [ ] × and Esc dismiss immediately.
- [ ] Reload sweeps a `#C8F04C` panel up over 520ms `cubic-bezier(.2,0,0,1)`, shows "v2.4.1" at 56px/800, holds 900ms, then sweeps off the top over 520ms.
- [ ] The header version pill reads "v2.4.0" before and "v2.4.1" in lime after the wipe.
- [ ] "Simulate update" resets the pill to v2.4.0 and re-shows the toast with a new countdown.
- [ ] Toast has `role="status"`; dismiss button label mentions the auto-close.
- [ ] Task checkboxes toggle with lime fill and strikethrough; nav current item is lime.
- [ ] Focus rings visible on every button.
- [ ] Reduced motion keeps the 10s timer and the reload sequence but removes drawn motion.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: dark task list (7 tasks, 2 done) with a "v2.4.0" outline pill in the header; bottom nav with "Today" current in lime; the toast is already visible at `bottom:112px` and its ring is counting down from full.
2. The ring (r=16, circumference 100.5) animates `stroke-dashoffset` 0 → 100.5 over 10s linear. At 10s the toast drops 24px and fades over 240ms `cubic-bezier(.4,0,1,1)`.
3. Tap × or press Esc: same exit, immediately.
4. Tap **Reload**: toast exits; `body.wiping` — the lime panel translates from 100% to 0 over 520ms `cubic-bezier(.2,0,0,1)`; at 300ms into that, the 56px "v2.4.1" label and "Kestrel · updated" line fade/rise in (200ms/300ms).
5. At 1420ms after Reload: the header pill text becomes "v2.4.1" and turns lime; `wiping` is swapped for `unwiping` — the panel translates from 0 to −100% over 520ms `cubic-bezier(.4,0,1,1)`, revealing the page.
6. At 2000ms `unwiping` is removed; the panel is parked below the viewport again.
7. Tap **Simulate update** (40px outline button, bottom-left, visible once the toast has gone): version pill resets to "v2.4.0", the toast re-enters (rise from 24px, 420ms `cubic-bezier(.16,1,.3,1)`; opacity 200ms) and a fresh 10s countdown starts.
8. Task rows toggle their checkbox (lime fill, strikethrough, "done" label) on tap; the nav switches its current item. Neither affects the toast.

## Tokens

```css
:root {
  /* charcoal neutrals */
  --bg: #191a1c;
  --panel: #212326;        /* task rows, nav */
  --panel-2: #2a2d31;      /* row hover */
  --line: #33373c;
  --ink: #f1f0ec;
  --ink-2: #a9aaa4;
  --ink-3: #6f716c;        /* idle nav, checkbox border, times */

  /* accent — lime */
  --lime: #c8f04c;         /* checkbox fill, current nav, toast tile, wipe panel */
  --lime-ink: #1b2400;

  /* toast is light on dark */
  --toast: #f1f0ec;
  --toast-ink: #191a1c;
  --toast-sub: #5f615c;
  --ring-track: rgba(25,26,28,.12);

  /* type */
  --font: "Bricolage Grotesque", system-ui, sans-serif;   /* opsz 12..96, wght 400/600/800 */
  --fs-h1: 28px; --fs-wipe: 56px; --fs-body: 15px; --fs-toast: 14px; --fs-btn: 13px; --fs-meta: 12px; --fs-nav: 11px;

  /* layout */
  --nav-h: 64px;
  --bottom-clear: 34px;
  --toast-bottom: 112px;   /* 34 + 64 + 14 */
  --r-toast: 16px;
  --r-btn: 10px;
  --r-row: 14px;
  --r-box: 7px;
  --ring: 36px; --ring-r: 16; --ring-c: 100.5;

  /* elevation */
  --shadow-toast: 0 12px 32px rgba(0,0,0,.45);

  /* motion */
  --t-micro: 160ms;
  --t-toast: 420ms;
  --t-exit: 240ms;
  --t-count: 10s;
  --t-wipe: 520ms;
  --t-hold: 900ms;
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-std: cubic-bezier(.2, .7, .2, 1);
  --ease-in: cubic-bezier(.4, 0, 1, 1);
  --ease-emph: cubic-bezier(.2, 0, 0, 1);
}
```

## Typography

| Role           | Family              | Size | Weight | Line-height | Tracking | Case     |
|----------------|---------------------|-----:|-------:|------------:|---------:|----------|
| App title      | Bricolage Grotesque | 28px | 800    | 1           | −0.02em  | sentence |
| Wipe version   | Bricolage Grotesque | 56px | 800    | 1           | −0.04em  | as is    |
| Toast title    | Bricolage Grotesque | 14px | 600    | 1.2         | 0        | sentence, nowrap |
| Toast subline  | Bricolage Grotesque | 12px | 400    | 1.4         | 0        | sentence |
| Reload button  | Bricolage Grotesque | 13px | 600    | 1           | 0        | sentence |
| Task label     | Bricolage Grotesque | 15px | 400    | 1.4         | 0        | sentence |
| Task time      | Bricolage Grotesque | 12px | 600    | 1           | 0        | lowercase |
| Version pill   | Bricolage Grotesque | 12px | 600    | 1           | 0        | as is    |
| Nav label      | Bricolage Grotesque | 11px | 600    | 1           | 0        | sentence |

## Implementation notes

**Countdown ring** — one circle, dasharray equal to the circumference, offset animated over the dismiss duration:

```css
.ring { position:absolute; inset:0; width:36px; height:36px; transform:rotate(-90deg); }
.ring circle { fill:none; stroke-width:2; }
.ring .pr { stroke:var(--toast-ink); stroke-dasharray:100.5; stroke-dashoffset:0; stroke-linecap:round; }
.toast.on .ring .pr { animation: count 10s linear forwards; }
@keyframes count { to { stroke-dashoffset:100.5 } }
```

**Restart the ring on re-show** by forcing a reflow between removing and re-adding the class:

```js
function show() {
  clearTimeout(auto);
  toast.classList.remove('on'); void toast.offsetWidth; toast.classList.add('on');
  auto = setTimeout(hide, 10000);
}
```

**Two-phase wipe with keyframes, not transitions**, so the exit direction differs from the entry:

```css
.wipe { position:absolute; inset:0; background:var(--lime); transform:translateY(100%); z-index:5; pointer-events:none; }
.wiping   .wipe { animation: wipe 520ms var(--ease-emph) forwards; }
.unwiping .wipe { transform:none; animation: unwipe 520ms var(--ease-in) forwards; }
@keyframes wipe   { to { transform:none } }
@keyframes unwipe { to { transform:translateY(-100%) } }
```

Common mistakes: placing the toast over the nav instead of above it; animating the ring with JS intervals (drift, and it fights reduced-motion); forgetting `forwards` so the ring snaps back to full at 10s just before the toast disappears.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
