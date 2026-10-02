---
title: "Story viewer with hold to pause"
summary: "A 390px story viewer: segmented 3px progress bars fill over 5s each, tap zones step forward and back, a 200ms hold pauses, and a pull-down of 120px closes the viewer over gradient scenes."
platform: mobile-web
type: animation
category: media
tags: [stories, gestures, progress, media, viewer]
styles: [dark, kinetic]
motion: rich
difficulty: 2
featured: false
published: 2026-09-29
palette: ["#0B0B0D", "#F4F2EE", "#FFB454", "#F2994A", "#2F6F9F"]
fonts: ["Bricolage Grotesque"]
related: []
---

# Story viewer with hold to pause

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A full-screen story viewer for a fictional travel app ("Mira"): four scenes, each a CSS gradient with a location eyebrow, a 30px title and a one-line caption. A row of segmented progress bars at the top fills one segment per story over 5 seconds using a single CSS animation; finished segments are solid, future ones are 28% white. The gestures are the piece: tap the right 70% to advance, the left 30% to go back, press and hold for 200ms to pause (a pause glyph fades in at the centre), and drag down more than 120px to dismiss (the viewer follows the finger, rounding its corners and shrinking slightly). Behind the viewer is a home screen with story rings that reopen it.

## Reference behaviour

1. Initial state: the viewer slides up over 380ms on load and story 1 ("First light on Reine", orange-to-plum gradient) is playing. Bar 1 is filling; bars 2–4 are empty tracks. The meta row shows an avatar, "Mira Journeys", "2h ago" and a close X.
2. After 5000ms bar 1 completes and story 2 fades in over 320ms (`opacity` crossfade of stacked scenes); bar 1 becomes solid; bar 2 starts filling from 0. Caption text swaps immediately.
3. Tap anywhere in the right 70%: the current bar jumps to solid and the next story starts; its bar starts from 0. Tapping on the last story closes the viewer.
4. Tap the left 30%: go to the previous story (on story 1, restart story 1).
5. Press and hold (any zone) for 200ms: `.paused` is added; the current bar's animation pauses in place; a 56px dark disc with a pause glyph scales from .8 to 1 and fades in over 160ms. Release: playback resumes from the same point; no navigation happens.
6. Drag down: from 8px of vertical travel the viewer follows the pointer (`translateY(dy) scale(1 − dy/1600)`), corners round to 18px, playback pauses. Release under 120px: the viewer springs back over 380ms and resumes. Release over 120px: the viewer closes (slides to `translateY(100%)`), and the home screen is interactive again with the last-seen ring focused.
7. Close X, Escape: close. Arrow Right/Left: next/previous. Space: toggle pause. Enter on a focused tap zone: that zone's action.
8. On the home screen, story rings show the scene gradient inside a 3px `--accent` ring; a ring seen at least once turns `--line` grey. Tapping a ring opens the viewer at that story (replay).

## Structure

```
390 × 844 (54px status reserve above, 80px browser bar below)
┌──────────────────────────────────────┐
│  ▬▬▬▬▬▬▬▬ ▬▬▬▬░░░░ ░░░░░░░░ ░░░░░░░░ │ bars: top 64, 3px, gap 4
│ (M) Mira Journeys              ×     │ meta: top 78, 32px avatar, 40px X
│     2h ago                           │
│                                      │
│                                      │
│ ┌──────────┬───────────────────────┐ │ tap zones: 30% | 70%, full height
│ │  prev    │        next           │ │ (transparent buttons, z 3)
│ │          │     ( || ) pause disc  │ │ 56px, centred, on hold
│ │          │                       │ │
│ └──────────┴───────────────────────┘ │
│ LOFOTEN · 06:12                      │ caption block, bottom 100
│ First light                          │ h2 30/1.05
│ on Reine                             │
│ Twelve hours of golden hour…         │ 14px, ≤ 34ch
│              (80px reserve)          │
└──────────────────────────────────────┘
Home (behind): h1 28px, paragraph, four 72px rings with labels, hint row.
```

- `<main class="home">` — heading, paragraph, `.rings` (one `<button class="ring">` + label per story), `.hint`. Gets `inert` while the viewer is open.
- `<section class="viewer" role="dialog" aria-modal="true" aria-label="Story viewer">` — absolutely positioned full-screen, `touch-action: none`, `user-select: none`.
  - `#scenes` — one absolutely positioned `.scene` per story with `--g` set to its gradient; `.cur` is visible. `::before`/`::after` draw the top and bottom scrims.
  - `.bars[aria-hidden]` — one `.bar > i` per story.
  - `.meta` — avatar, name/time, `<button class="x">`.
  - `.cap[aria-live=polite]` — `.loc`, `<h2>`, `<p>`; rewritten on every story change.
  - `.pause[aria-hidden]` — the centred disc.
  - `.zones` — a 2-column grid of two transparent `<button>`s with `aria-label`s "Previous story" / "Next story".

### Content

- Home: h1 "Stories from the road"; paragraph "Four scenes from this week's Mira itineraries. Tap a ring to watch; hold to pause; pull down to leave."; hint "Each story runs 5 seconds. Tap the left 30% to go back, the right 70% to skip ahead."
- Meta row: avatar "M" on `--accent`, name "Mira Journeys", relative time per story.
- Stories (gradient · location · title · caption · time):
  1. `--scene-1` · "Lofoten · 06:12" · "First light on Reine" · "Twelve hours of golden hour. The ferry leaves at seven, nobody is on it." · "2h ago"
  2. `--scene-2` · "Bergen · 14:40" · "Rain, then the fish market" · "Order the shrimp sandwich. Ask for extra dill. Sit under the awning." · "5h ago"
  3. `--scene-3` · "Hardanger · 09:05" · "Orchards along the fjord" · "The cider farm at Ulvik does tastings until four. Bring a jumper." · "8h ago"
  4. `--scene-4` · "Tromsø · 23:50" · "Waiting for the lights" · "Kp index 5 tonight. Coffee in a thermos, camera on a rock, patience." · "12h ago"
- Ring labels: the location before the " ·" (Lofoten, Bergen, Hardanger, Tromsø).

## Tokens

```css
:root {
  /* colour — near-black shell, warm off-white ink, one amber accent for the brand only */
  --bg: #0b0b0d;
  --surface: #17171b;
  --line: #2a2a30;            /* seen rings, hint rule */
  --ink: #f4f2ee;
  --ink-2: #a9a7a1;           /* captions, meta time */
  --ink-3: #6c6b67;           /* hint */
  --accent: #ffb454;          /* avatar, ring, location eyebrow */
  --track: rgba(255, 255, 255, .28);
  --fill: #f4f2ee;
  --scrim-top: linear-gradient(180deg, rgba(0,0,0,.55), transparent 140px);
  --scrim-bottom: linear-gradient(0deg, rgba(0,0,0,.6), transparent 220px);
  --pause-disc: rgba(0, 0, 0, .45);

  /* scenes (one gradient per story) */
  --scene-1: linear-gradient(160deg, #f2994a 0%, #c2553a 55%, #4a1f2b 100%);
  --scene-2: linear-gradient(200deg, #8fd3f4 0%, #2f6f9f 50%, #0d2a44 100%);
  --scene-3: linear-gradient(170deg, #c7e5b3 0%, #4f8a5b 45%, #16302a 100%);
  --scene-4: linear-gradient(160deg, #3b2f6b 0%, #20304f 50%, #0a1024 100%);

  /* type */
  --font: "Bricolage Grotesque", system-ui, sans-serif;

  /* layout */
  --safe-top: 54px;
  --safe-bottom: 80px;
  --gutter: 16px;
  --bar-h: 3px;
  --bar-gap: 4px;
  --avatar: 32px;
  --ring: 72px;
  --pause: 56px;
  --zone-left: 30%;
  --r: 18px;                  /* viewer corners while dragging */
  --r-pill: 999px;

  /* motion */
  --t-story: 5000ms;
  --t-hold: 200ms;            /* JS hold threshold */
  --t-fast: 160ms;            /* pause disc */
  --t-layout: 320ms;          /* scene crossfade */
  --t-close: 380ms;           /* viewer open/close/spring-back */
  --drag-close: 120px;        /* JS release threshold */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-sheet: cubic-bezier(.32, .72, 0, 1);
}
```

## Typography

| Role            | Family              | Size | Weight | Line-height | Tracking | Case      |
|-----------------|---------------------|-----:|-------:|------------:|---------:|-----------|
| Body            | Bricolage Grotesque | 15px | 400    | 1.45        | 0        | sentence  |
| Home h1         | Bricolage Grotesque (opsz 96) | 28px | 700 | 1.05  | −0.02em  | sentence  |
| Story title h2  | Bricolage Grotesque (opsz 96) | 30px | 700 | 1.05  | −0.02em  | sentence, ≤ 12ch |
| Location eyebrow| Bricolage Grotesque | 12px | 500    | 1.3         | +0.12em  | UPPERCASE |
| Caption         | Bricolage Grotesque | 14px | 400    | 1.45        | 0        | sentence, ≤ 34ch |
| Meta name       | Bricolage Grotesque | 14px | 500    | 1.3         | 0        | sentence  |
| Meta time, ring label | Bricolage Grotesque | 13px / 12px | 400 | 1.3 | 0    | sentence  |
| Avatar initial  | Bricolage Grotesque | 13px | 700    | 1           | 0        | UPPERCASE |
| Hint            | Bricolage Grotesque | 13px | 400    | 1.45        | 0        | sentence  |

## Motion

| Element        | Trigger              | Property            | From → To                          | Duration | Easing         | Notes |
|----------------|----------------------|---------------------|------------------------------------|---------:|----------------|-------|
| `.bar.cur i`   | story shown          | width               | 0 → 100%                           | 5000ms   | linear         | `forwards`; `animationend` advances |
| `.bar.cur i`   | `.paused`            | animation-play-state| running → paused                   | 0        | —              | resumes in place |
| `.scene`       | story change         | opacity             | 0 → 1 (previous 1 → 0)             | 320ms    | `--ease`       | scenes stacked |
| `.pause`       | hold ≥ 200ms         | opacity, scale      | 0, .8 → 1, 1                       | 160ms    | `--ease-out`   | |
| `.viewer`      | open / close         | transform           | `translateY(100%)` ↔ 0             | 380ms    | `--ease-sheet` | |
| `.viewer.drag` | pointer drag         | transform, radius   | follows: `translateY(dy) scale(1 − dy/1600)`, radius 0 → 18px | 0 (no transition) | — | |
| `.viewer`      | release < 120px      | transform           | dragged → 0                        | 380ms    | `--ease-sheet` | class `.drag` removed first |
| `.ring`        | seen                 | background          | `--accent` → `--line`              | 0        | —              | instant |

Reduced motion: viewer, scene and pause transitions become 1ms. The 5000ms bar fill is kept because it is the story timer; the crossfade becomes a cut. Drag-follow is unchanged (it is direct manipulation, not an animation).

## States

- **Playing:** `.viewer.on` without `.paused`; current bar animating.
- **Paused:** `.viewer.paused`; bar frozen; pause disc visible at opacity 1.
- **Dragging:** `.viewer.drag.paused`; no transition; inline transform; corners 18px.
- **Closed:** `.viewer` without `.on`, `aria-hidden="true"`, translated off-screen; home without `inert`.
- **Bar done / current / future:** `.done` (width 100% fill), `.cur` (animating), neither (empty track).
- **Ring seen:** `.seen`, grey ring. **Ring focus-visible:** 2px `--accent` outline, 3px offset.
- **Zone focus-visible:** 2px `--ink` outline inset 6px with 12px radius (only visible to keyboard users; the buttons are otherwise transparent).
- **Close X focus-visible:** 2px `--ink` outline, 2px offset.

## Accessibility

- Viewer is `role="dialog" aria-modal="true"` with `aria-label`; when open, the home `<main>` gets `inert` and focus moves to the close button (only when opened by a user action, not on the automatic open at load, so the first frame shows no focus ring); on close, focus returns to the ring of the last story seen.
- Tap zones are real `<button>`s with `aria-label`s, so screen-reader users get "Previous story" / "Next story"; Enter activates them. Arrow keys, Space (pause toggle) and Escape are handled on `window` while open.
- The caption block is `aria-live="polite"` so each story's location, title and caption are announced on change; the bars and pause disc are `aria-hidden`.
- Progress uses CSS `animation-play-state` so pausing does not lose position; no `setInterval` polling.
- Text on scenes sits on gradient scrims: top scrim 55% black over 140px, bottom scrim 60% black over 220px, giving ≥ 4.5:1 for `--ink-2` on every gradient's darkest region.
- Hit targets: zones are full height (30% / 70% width), close 40px, rings 72px.
- `touch-action: none` on the viewer so vertical drags do not scroll the page; `user-select: none` so a hold does not start a text selection.

## Responsive rules

- 390 (reference): as specified.
- 360 wide: title 28px, caption ≤ 30ch; bars keep the 16px gutter.
- Height < 720: bottom caption moves to `bottom: 80px + 12px`; title 26px.
- ≥ 600 wide (tablet/desktop preview): the viewer becomes a 390×844 centred panel with 18px radius on a `--bg` backdrop; the home screen is laid out in a 560px column. Gestures and keys are identical.

## Acceptance checklist

- [ ] Four progress segments, 3px tall, 4px apart, at `top: 64px`, with a 28% white track and `#f4f2ee` fill.
- [ ] The current segment fills from 0 to 100% over exactly 5000ms linear and advancing is driven by `animationend`, not a timer.
- [ ] Holding for 200ms pauses the fill in place (via `animation-play-state`) and shows the 56px pause disc; releasing resumes without navigating.
- [ ] A tap (< 8px movement, < 200ms) in the right 70% advances; in the left 30% goes back; advancing past story 4 closes the viewer.
- [ ] Dragging down more than 8px makes the viewer follow the pointer with rounded 18px corners and a slight scale-down; releasing beyond 120px closes, below it springs back over 380ms.
- [ ] Scenes crossfade over 320ms; the caption block changes instantly and is a polite live region.
- [ ] Arrow Right / Left, Space and Escape work while the viewer is open; Enter on a focused zone triggers it.
- [ ] Opening moves focus to the close button; closing returns focus to the last story's ring; the home screen is `inert` while open.
- [ ] Rings are 72px with a 3px accent ring; a seen story's ring turns `#2a2a30`.
- [ ] No fixed control occupies the top 54px or bottom 80px (bars start at 64px; caption ends 100px from the bottom).
- [ ] Reduced motion: open/close and crossfade are cuts; the 5s timer still runs.

## Implementation notes

**Restart the fill animation when re-entering a story.** Removing and re-adding the class in the same frame does nothing; force a reflow between them:

```js
function show(i) {
  cur = i;
  scenes.forEach((s, j) => s.classList.toggle('cur', j === i));
  bars.forEach((b, j) => {
    b.classList.toggle('done', j < i);
    b.classList.remove('cur'); void b.offsetWidth;   // reflow resets the animation
    b.classList.toggle('cur', j === i);
  });
}
barsEl.addEventListener('animationend', () => { if (open && !viewer.classList.contains('paused')) next(); });
```

**Distinguish tap, hold and drag from one pointer sequence.** Capture the pointer on the zone so moves outside it still arrive:

```js
zone.addEventListener('pointerdown', e => {
  zone.setPointerCapture(e.pointerId); held = false; y0 = e.clientY; x0 = e.clientX; dy = 0;
  hold = setTimeout(() => { held = true; viewer.classList.add('paused'); }, 200);
});
zone.addEventListener('pointermove', e => {
  if (!e.buttons) return; dy = Math.max(0, e.clientY - y0);
  if (dy > 8) { clearTimeout(hold); viewer.classList.add('drag', 'paused');
    viewer.style.transform = `translateY(${dy}px) scale(${1 - dy / 1600})`; }
});
zone.addEventListener('pointerup', e => {
  clearTimeout(hold); viewer.classList.remove('drag'); viewer.style.transform = '';
  if (dy > 120) return close();
  viewer.classList.remove('paused');
  if (!held && dy < 8 && Math.abs(e.clientX - x0) < 8) (zone.id === 'prev' ? prev : next)();
});
```

**Pause without losing position** is one CSS rule; never toggle the animation itself:

```css
.bar.cur i { animation: fill var(--t-story) linear forwards; }
.paused .bar.cur i { animation-play-state: paused; }
```

Common mistakes: driving progress with `setInterval` (drifts, and pausing needs bookkeeping); listening to `click` as well as `pointerup` (double navigation); forgetting `touch-action: none` (the browser starts a scroll and cancels your pointer); leaving `transition` on while dragging (the viewer lags the finger).
