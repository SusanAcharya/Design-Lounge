<!-- Design Lounge Nº 077 · "Toast stack" · designlounge.vercel.app -->

# Toast stack

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A notification stack for a farm-operations app ("Loam"). Toasts arrive bottom-right; the newest sits in front at full size and pushes older ones up and back so they peek out 12px and 24px above it at scale 0.96 and 0.92, like a fanned deck of cards. Hovering (or tabbing into) the stack unfolds it into a normal list with 8px gaps and pauses every timer. Each toast has a 2px progress hairline in its tone colour that drains left-to-right over 5s; a dismiss button; an icon; a title and one line of detail. The detail worth copying is that the stacking, the unfolding and the pause are all driven by three custom properties and one class — no per-toast timers.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────┐
│ Loam.   Field log  Rigs  Blocks  Weather  Reports                        │ 56
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Block 7 · Winter barley   (DM Serif 40)                                 │
│  one-line subtitle                                                        │
│  ┌ Area 14.2 ha ┐ ┌ Last sprayed 3 d ┐ ┌ Soil moisture 31 % ┐            │
│  [● Save field note] [● Sync telemetry] [● Schedule sprayer]             │
│  hint line                                                                │
│                                                                          │
│                                                     ┌──── 360 ─────┐     │
│                                                    ┌┴──────────────┴┐    │ slot 2  −24px, .92
│                                                   ┌┴────────────────┴┐   │ slot 1  −12px, .96
│                                                   │ (!) Sync failed  ×│   │ slot 0  front
│                                                   │ Rig 2 telemetry… │   │
│                                                   │▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬│   │ 2px hairline
│                                                   └──────────────────┘   │ 24px from right/bottom
└──────────────────────────────────────────────────────────────────────────┘
expanded on hover: three full toasts stacked with 8px gaps, bottom-anchored
```

- `<header class="top">` — 56px, brand "Loam." (serif 22, accent full stop), nav.
- `<main>` — `<h1>`, `.sub`, `.field` grid of three `.card` stats, `.row` of three `<button class="btn" data-k>` triggers, `.hint`.
- `<div class="stack" role="region" aria-label="Notifications">` — fixed, `right:24px; bottom:24px; width:360px`. JS sets its `height`.
  - `<div class="toast" role="status" data-i style="--tone; --yc; --s; --ye">` — absolute, `right:0; bottom:0; width:100%`. The stacking transform lives here.
    - `<div class="t">` — the visible card: `--panel` background, 1px `--line` border, 12px radius, padding `14px 40px 16px 16px`, flex with 12px gap, `overflow:hidden`, the enter/leave animation lives here.
      - `.ic` 20px icon in `var(--tone)`; `<div><b>title</b><p>detail</p></div>`; `<button class="x" aria-label="Dismiss">` 28×28 at `top:10px; right:10px`; `<span class="prog">` 2px hairline at the bottom.

Messages: success "Field note saved" / "Block 7 · 14 rows · synced to Loam cloud"; error "Sync failed" / "Rig 2 telemetry could not reach the gateway. Retrying in 30 s."; info "Sprayer scheduled" / "Rig 2 · Block 3 · tomorrow 05:30 · 420 L/ha". Icons: success = circle + check, error = circle + exclamation, info = circle + i (circle r 9 on a 24 grid, 1.75 stroke).

### Burst timing (five clicks, 200ms apart)

| t (ms) | Event                   | Slots (front → back)                 | Notes |
|-------:|-------------------------|--------------------------------------|-------|
| 0      | click Save              | new, error, success, info            | seeded toasts released from `hold`; info now in slot 3 (opacity 0) |
| 200    | click Sync              | new, prev, error, success, info      | info in slot 4 (opacity 0) |
| 400    | click Schedule          | new, …, success (slot 4)             | 6 toasts → oldest (info) dismissed immediately via `leave` |
| 5000   | first release drain ends| —                                    | the toasts released at t=0 leave in the order they arrived |
| any    | hover                   | all five unfold                      | hidden slots 3–4 become visible; every hairline pauses |

### Edge cases

- Dismissing a back-slot toast (visible sliver hovered, then × clicked after unfold): the toast runs `leave`; `layout()` immediately excludes it (`.toast:not(.out)`), so the others re-slot while it fades.
- A toast that finishes draining while the stack is expanded cannot happen — expansion pauses every hairline.
- Rapid clicks beyond five: `layout()` calls `dismiss()` on the overflow, which is idempotent (`.out` guard).
- Seeded toasts keep `hold` until the first trigger click; hover still expands them.
- The container's height is recomputed on every layout so the hover region equals the visible column: front toast height when collapsed, `ye` (sum of heights + 8px gaps) when expanded.

## Motion

| Element            | Trigger              | Property               | From → To                              | Duration | Easing       | Notes |
|--------------------|----------------------|------------------------|----------------------------------------|---------:|--------------|-------|
| `.t` (new toast)   | append               | opacity, transform     | 0, `translateY(16px)` → 1, none        | 240ms    | `--ease-out` | keyframes `enter` on the inner card |
| `.toast` (others)  | append / remove      | transform              | slot n → slot n+1 (`-12px·n`, `1 − .04·n`) | 260ms | `--ease-out` | transform-origin bottom center |
| `.toast`           | append / remove      | opacity                | slots ≥ 3 → 0                          | 260ms    | `--ease`     | |
| `.toast`           | stack hover / focus-within | transform, opacity | slot → `translateY(-ye)` scale 1, opacity 1 | 260ms | `--ease-out` | `ye` = sum of newer toasts' heights + 8px each |
| `.prog`            | append               | transform `scaleX`     | 1 → 0                                  | 5000ms   | linear       | `forwards`; paused while `.expanded` or `.hold` |
| `.t` (leaving)     | timer end / dismiss  | opacity, transform     | 1, none → 0, `translateY(8px)`         | 160ms    | `--ease`     | keyframes `leave`; remove on `animationend` |
| `.btn`             | hover                | background, border     | `--panel` → `--panel-2`, `--line-2` → `--ink-3` | default | — | |

Reduced motion: enter/leave keyframes run at 1ms; stack re-slot and expand transitions 1ms; the 5s progress drain is kept (it is information, not decoration).

## States

- **Slot 0 (front):** scale 1, `translateY(0)`, opacity 1, interactive.
- **Slot 1 / 2:** `translateY(-12px) scale(.96)` / `translateY(-24px) scale(.92)`, opacity 1, interactive (their visible sliver is hoverable).
- **Slot 3 / 4:** opacity 0, `pointer-events:none`. **Slot ≥ 5:** dismissed.
- **Expanded (`.stack.expanded`):** every toast scale 1, opacity 1, positioned by `--ye`; progress paused.
- **Hold (`.toast.hold`):** progress paused; removed on the first trigger click.
- **Leaving (`.toast.out`):** inner card runs `leave`; the toast is excluded from layout immediately so the others re-slot in parallel.
- **Dismiss button:** `--ink-3`; hover `--panel-2` background + `--ink`; focus-visible 2px accent outline inset 2px.
- **Trigger buttons:** focus-visible 2px accent outline, 2px offset.
- **Tone colour** per kind sets the icon and hairline via `--tone`; the card itself stays neutral (no tinted backgrounds).

## Accessibility

- Container `role="region" aria-label="Notifications"`. Each toast `role="status"` (polite live region) so its text is announced on insertion; do not also put `aria-live` on the container (double announcements).
- Dismiss buttons are real `<button aria-label="Dismiss">`, 28×28 with a 6px radius; the hit target is fine for pointer; on touch, grow to 40px.
- Focus-within expands the stack so a keyboard user can see every toast they can tab to; hidden slots (3–4) are `pointer-events:none` but still tabbable — if that matters to you, also set `visibility:hidden` on them when collapsed.
- Hovering pauses timers (WCAG 2.2.1 "pause"); focus does the same.
- Contrast: `--ink-2` on `--panel` 8.7:1; `--ink-3` on `--panel` 3.9:1 (meta only); tone colours on `--panel` all ≥ 8:1.
- The seeded toasts' `hold` state prevents content from disappearing before a user has interacted.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: unchanged.
- 768–1023: `--toast-w: 340px`; stat grid stays 3 columns.
- < 640: stack becomes full-width with 12px side margins (`left:12px; right:12px; width:auto`), `bottom:12px`; the collapsed peek is 8px; expanding happens on tap of the front toast (toggle `.expanded`) instead of hover.

## Acceptance checklist

- [ ] Stack is 360px wide, 24px from the right and bottom edges; toasts are 12px radius with a 1px `#26332b` border and the long soft shadow.
- [ ] Front toast is scale 1; the two behind are `scale(.96)` at −12px and `scale(.92)` at −24px, transform-origin bottom centre.
- [ ] A 4th and 5th toast exist but are invisible; a 6th arrival dismisses the oldest.
- [ ] A new toast enters over 240ms from 16px below; existing toasts re-slot over 260ms on `cubic-bezier(.16,1,.3,1)`.
- [ ] Hovering the stack unfolds every toast to scale 1 with 8px gaps; leaving refolds it.
- [ ] Tabbing to a dismiss button unfolds the stack; tabbing out refolds it.
- [ ] Each toast has a 2px hairline in its tone colour that scales from 1 to 0 over exactly 5000ms, linear, and pauses while the stack is expanded.
- [ ] When the hairline reaches 0 the toast fades out over 160ms with an 8px drop, then is removed and the rest re-slot.
- [ ] The three seeded toasts do not start draining until the first trigger click.
- [ ] Each toast is `role="status"`; the container is not `aria-live`.
- [ ] With reduced motion, entering, leaving and re-slotting are instantaneous but the 5s drain still runs.
- [ ] No timers in JS other than the CSS animations (`animationend` drives removal).

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: three toasts are already stacked — an info toast at the back, a success toast in the middle, an error toast in front ("Sync failed · Rig 2 telemetry could not reach the gateway. Retrying in 30 s."). Their progress hairlines are full and **paused** (they carry a `hold` class) so the first frame stays put in a gallery. The page shows a "Block 7 · Winter barley" field summary with three trigger buttons: Save field note (success), Sync telemetry (error), Schedule sprayer (info).
2. Click any trigger: the `hold` is released on the seeded toasts (their hairlines start draining) and a new toast enters from 16px below with opacity 0 → 1 over 240ms (expo-out). Every existing toast moves back one slot over 260ms: slot 1 = `translateY(-12px) scale(.96)`, slot 2 = `translateY(-24px) scale(.92)`; slots 3 and 4 are fully transparent and non-interactive; beyond 5 total, the oldest is dismissed.
3. Hover the stack: it expands. Every toast animates to its unfolded position (cumulative height + 8px gap, scale 1, opacity 1) over 260ms; all progress hairlines pause (`animation-play-state: paused`). Moving the mouse off collapses it again and the timers resume from where they were.
4. Tabbing into any toast's dismiss button expands the stack the same way (focus-within); tabbing out collapses it.
5. Progress: the hairline scales from 1 to 0 over 5000ms, linear, from the left edge. When it reaches 0 the toast leaves: 160ms fade with an 8px downward drift, then it is removed and the remaining toasts re-slot.
6. Click ×: same leave animation immediately.
7. Toast body text varies slightly per arrival (block number cycles 6–9 in the success message) so repeated clicks read as distinct events.
8. The hover region is exactly the front toast's box when collapsed and the whole unfolded column when expanded (the container's height is set explicitly by JS after each layout).

## Tokens

```css
:root {
  /* colour — mossy near-black, three tone colours, green accent */
  --bg: #0e1411;          /* page */
  --panel: #16201a;       /* toasts, cards, buttons */
  --panel-2: #1c2821;     /* hover surfaces */
  --line: #26332b;        /* hairlines, toast border */
  --line-2: #34443a;      /* button border */
  --ink: #edf3ee;
  --ink-2: #a3b3a8;       /* toast detail text */
  --ink-3: #6b7d70;       /* meta, dismiss icon */
  --success: #9be38c;
  --error: #ff8a78;
  --info: #8fc2ff;
  --accent: #9be38c;      /* focus rings, brand dot */
  --accent-ink: #0b1a0e;

  /* type */
  --serif: "DM Serif Display", Georgia, serif;
  --sans: "DM Sans", system-ui, sans-serif;

  /* layout */
  --toast-w: 360px;
  --gap: 8px;             /* expanded gap */
  --edge: 24px;           /* distance from viewport corner */
  --peek: 12px;           /* collapsed offset per slot */
  --r: 12px;
  --shadow: 0 16px 40px -12px rgba(0,0,0,.6);

  /* motion */
  --life: 5000ms;         /* auto-dismiss */
  --t-fast: 160ms;        /* leave */
  --t-enter: 240ms;
  --t-stack: 260ms;       /* re-slot / expand */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family          | Size | Weight | Line-height | Tracking | Notes |
|-----------------|-----------------|-----:|-------:|------------:|---------:|-------|
| Brand           | DM Serif Display| 22px | 400    | 1           | −0.01em  | full stop in `--accent` |
| Page h1         | DM Serif Display| 40px | 400    | 1.1         | −0.015em | |
| Stat value      | DM Serif Display| 26px | 400    | 1.2         | −0.01em  | unit in DM Sans 13 `--ink-3` |
| Subtitle        | DM Sans         | 15px | 400    | 1.45        | 0        | `--ink-2`, max-width 520px |
| Stat label      | DM Sans         | 13px | 500    | 1.3         | 0        | `--ink-3` |
| Button          | DM Sans         | 13px | 500    | 38px height | 0        | 8px dot before label |
| Toast title     | DM Sans         | 14px | 600    | 1.45        | 0        | `--ink` |
| Toast detail    | DM Sans         | 13px | 400    | 1.45        | 0        | `--ink-2` |
| Hint            | DM Sans         | 12px | 400    | 1.45        | 0        | `--ink-3` |

## Implementation notes

**Two layers per toast**: the outer `.toast` owns the stacking transform (custom properties set by JS), the inner `.t` owns enter/leave keyframes. Mixing both on one element makes the enter animation fight the slot transform.

```css
.toast { position: absolute; right: 0; bottom: 0; width: 100%; transform-origin: bottom center;
         transform: translateY(calc(-1 * var(--yc, 0px))) scale(var(--s, 1)); opacity: var(--o, 1);
         transition: transform var(--t-stack) var(--ease-out), opacity var(--t-stack) var(--ease); }
.stack.expanded .toast { transform: translateY(calc(-1 * var(--ye, 0px))) scale(1); opacity: 1; }
.toast[data-i="3"], .toast[data-i="4"] { opacity: 0; pointer-events: none; }
.t { animation: enter 240ms var(--ease-out); }
.toast.out .t { animation: leave 160ms var(--ease) forwards; }
```

**One layout pass computes both geometries** (collapsed `--yc`, expanded `--ye`) so hover only toggles a class:

```js
function layout() {
  const list = [...stack.querySelectorAll('.toast:not(.out)')].reverse();   // newest first
  let ye = 0;
  list.forEach((t, i) => {
    t.dataset.i = i;
    t.style.setProperty('--yc', (i * 12) + 'px');
    t.style.setProperty('--s', String(1 - i * .04));
    t.style.setProperty('--ye', ye + 'px');
    ye += t.offsetHeight + 8;
  });
  stack.style.height = (stack.classList.contains('expanded') ? ye : (list[0]?.offsetHeight || 0)) + 'px';
  while (list.length > 5) dismiss(list.pop());
}
```

**Let CSS be the timer**: the hairline's `animationend` dismisses the toast, and `animation-play-state: paused` on `.stack.expanded .prog` is the whole pause implementation.

```js
t.querySelector('.prog').addEventListener('animationend', () => dismiss(t));
function dismiss(t) {
  if (t.classList.contains('out')) return;
  t.classList.add('out');
  t.addEventListener('animationend', () => { t.remove(); layout(); }, { once: true });
}
```

Common mistakes: using `setTimeout` per toast (then hover-pause needs bookkeeping); positioning toasts with `flex-direction: column-reverse` (you lose the overlap); animating `top/bottom` instead of `transform`; forgetting to set the container's height so the hover region matches what's visible.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
