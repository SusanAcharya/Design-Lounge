<!-- Design Lounge Nº 053 · "PWA app shell hydration" · www.designlounge.live -->

# PWA app shell hydration

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The **app-shell layout** of "Halden", a public-transit PWA, demonstrating the cache-first pattern: the top bar (with a "shell · cache" source pill) and the bottom nav are static HTML that paint on the first frame; the content area is five cards that start as shimmering skeletons and hydrate 900ms later, each card's real content rising 8px into place with a 70ms stagger while its skeleton fades. A coral "Simulate cold start" button replays it. The feeling is a dark, engineered departures board. The detail worth copying is that skeleton and content live in the same card at the same size, so hydration never shifts layout.

## Structure

```
390 × 844
┌────────────────────────────────────┐
│ (54px clearance, shell colour)     │
│ Halden          ● shell · cache  ◔ │  top bar 56px, border-bottom 1px
│ Near Södra station  content · fet… │  meta 12px mono
│ ┌────────────────────────────────┐ │
│ │ ▬▬▬            (skeleton)      │ │  hero card, min 120px
│ │ ▬▬▬▬▬▬▬▬▬▬                     │ │
│ │ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬             │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ [12] Centralen           3 min │ │  departure card 74px, delay 70ms
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ [41] Kanalgatan          7 min │ │  delay 140ms
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ [12] Centralen           9 min │ │  delay 210ms
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ [3] Universitetet       14 min │ │  delay 280ms
│ └────────────────────────────────┘ │
│                [↻ Simulate cold start] │  40px, coral, above nav
│ ⌂ Home   ⌖ Stops   ▤ Tickets   ○ Me │  bottom nav 64px
│ (34px clearance, shell colour)     │
└────────────────────────────────────┘
```

- `<header class="top">` — absolute, `padding-top:54px; height:110px`, `<b>` wordmark, `.src` pill, icon `<button>`.
- `<main>` — absolute between the bars (`top:110px; bottom:98px`), `overflow:auto`, 16px padding. Children: `.meta`, then five `<section class="card">`, each containing `.real` (content) and `.sk` (skeleton, `aria-hidden`, absolutely covering the card).
- `<button class="replay">` — absolute, `right:16px; bottom:112px`.
- `<nav class="nav" aria-label="Primary">` — absolute bottom, `height:98px; padding-bottom:34px`, four `<button>`s with icon over 11px label.

Sample content:

- Top bar: wordmark "Halden"; source pill "shell · cache" with a 6px mint dot.
- Meta line: "Near **Södra station**" left; "content · fetching…" → "content · network · 912 ms" right.
- Hero card: "Tue 29 Sep · 08:12" / "Trains running to time." / "Line 12 is on a 6-minute headway until 09:00. Bus 41 diverts at Kanalgatan."
- Departures (badge · stop · detail · ETA): 12 coral · Centralen · Platform 2 · via Hamnen · 3 min; 41 mint · Kanalgatan · Stop C · diverted · 7 min; 12 coral · Centralen · Platform 2 · via Hamnen · 9 min; 3 lilac · Universitetet · Platform 1 · every 10 min · 14 min.
- Skeleton bars per card: hero 36% / 54% (22px tall) / 72%; departures 72% / 36%; each 12px tall, 8px radius, 10px gap.
- Nav: Home (current), Stops, Tickets, Me.

## Motion

| Element        | Trigger     | Property            | From → To          | Duration | Easing       | Delay |
|----------------|-------------|---------------------|--------------------|---------:|--------------|------:|
| `.sk i`        | always (until ready) | background-position | 0 → −200%  | 1400ms loop | linear   | 0 |
| `.sk`          | ready       | opacity             | 1 → 0              | 420ms    | `--ease-std` | 0/70/140/210/280ms |
| `.real`        | ready       | opacity, translateY | 0, 8px → 1, 0      | 420ms    | `--ease-out` | same stagger |
| `.sk`, `.real` | cold start  | (instant)           | reset              | 1ms      | —            | 0 |
| nav item       | select      | color               | ink-3 → coral      | 0        | —            | instant |
| nav/top buttons| hover       | background          | transparent → card | 160ms    | linear       | 0 |

Reduced motion: shimmer removed (`.sk i` becomes flat `--card-2`); hydration transitions 1ms with no delays; the 900ms fetch delay stays (it's data, not decoration).

## States

- **Cold (default on load):** `main` lacks `.ready`; skeletons opaque; `.real` opacity 0; replay disabled; meta "content · fetching…".
- **Ready:** `main.ready`; skeletons `opacity:0; pointer-events:none`; content visible; replay enabled; meta "content · network · 912 ms".
- **Nav current:** `aria-current="page"`, colour `--coral`.
- **Hover (top/nav buttons):** background `--card`.
- **Focus-visible:** 3px `--coral` outline, −3px offset (inside the rounded hit area).
- **Replay disabled:** opacity .6, `cursor:default`.

## Accessibility

- The hero card is `aria-live="polite"` so the headline is announced once when it hydrates; departure rows are not live (too chatty).
- Skeletons are `aria-hidden="true"`; `.real` content stays in the DOM at opacity 0 so nothing is announced before it's meaningful — if your screen-reader testing reads hidden opacity-0 text, add `visibility:hidden` to `.real` until ready.
- Nav: `<nav aria-label="Primary">` with `<button aria-current="page">`; arrow keys are not required for a tab bar.
- Replay button is a real `<button>` with `disabled` while fetching.
- Contrast: `--ink-2` on `--card` 8.1:1; `--ink-3` on `--shell` 4.6:1 (used for 11–12px mono meta only); `--coral-ink` on `--coral` 8.9:1.
- Hit targets: nav items ≥ 80×52, top icon 44px, replay 40px (give it a 44px `::after` hit area on touch).

## Responsive rules

- 390 wide: as specified.
- 360 wide: hero headline 24px; ETA 20px; badges stay 48×32.
- ≥ 600 wide: content column caps at 560px centred; bars stay full-bleed; replay button aligns to the content column's right edge.
- ≥ 840 wide (tablet): move the nav to a 80px left rail (icons over labels), keep the top bar; skeleton/hydration behaviour unchanged.

## Acceptance checklist

- [ ] Top bar (110px including 54px clearance) and bottom nav (98px including 34px clearance) are `#1B232C` and paint before any content.
- [ ] Content area is absolutely positioned between the bars and scrolls independently.
- [ ] Five cards start as skeletons with a 1.4s linear shimmer from `#2A3541` through `#2F3B48`.
- [ ] Hydration begins at 900ms; each card's content rises 8px and fades in over 420ms `cubic-bezier(.16,1,.3,1)` with 70ms stagger.
- [ ] Skeleton and content share the card box, so no card changes height on hydration.
- [ ] Meta line reads "content · fetching…" then "content · network · 912 ms".
- [ ] "Simulate cold start" resets instantly, disables itself for 900ms, and restarts the sequence.
- [ ] Line badges are 48×32 with 8px radius: 12 coral, 41 mint, 3 lilac.
- [ ] Current nav item is coral and carries `aria-current="page"`.
- [ ] Focus rings visible on nav, top icon and replay.
- [ ] Reduced motion removes the shimmer and stagger but keeps the 900ms fetch delay.
- [ ] Demo stays under 10 KB with no external assets besides fonts.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: top bar "Halden" with a mint-dot pill "shell · cache" and a notification icon; bottom nav with four items ("Home" current in coral); a meta line "Near Södra station · content · fetching…"; five cards showing skeleton bars with a moving shimmer (1.4s linear loop).
2. At 900ms: `main.ready`. Skeletons fade to 0 over 420ms; real content fades from 0 and translates from 8px to 0 over 420ms `cubic-bezier(.16,1,.3,1)`. Card delays: 0, 70, 140, 210, 280ms top to bottom. Meta line becomes "content · network · 912 ms".
3. Hydrated cards: a hero card (date in mono, 26px headline "Trains running to time.", a sentence of service notes) and four departure rows: a 48×32 line badge (coral "12", mint "41", lilac "3"), stop name and platform, and a right-aligned 22px mono ETA with a "min" sub-label.
4. Tap **Simulate cold start** (40px coral button above the nav, right-aligned): `ready` is removed instantly (skeletons reappear at full opacity, content hides), the button disables, meta returns to "fetching…", and the 900ms timer restarts. Rapid taps reset the timer rather than stacking.
5. Tap a bottom-nav item: it becomes `aria-current="page"` (coral); the others go `--ink-3`. Content does not change (out of scope).
6. Content scrolls between the fixed bars; the bars never move.

## Tokens

```css
:root {
  /* dark slate neutrals */
  --bg: #141a21;          /* content background */
  --shell: #1b232c;       /* top bar + bottom nav */
  --card: #222c37;
  --card-2: #2a3541;      /* skeleton base */
  --line: #2f3b48;        /* borders, skeleton highlight */
  --ink: #eef2f5;
  --ink-2: #a3b0bd;
  --ink-3: #6c7a88;

  /* accents */
  --coral: #ff6a4d;       /* current nav, line 12, replay button */
  --coral-ink: #2a0c05;
  --mint: #7fe0b2;        /* cache dot, line 41 */
  --lilac: #c9b2ff;       /* line 3 */

  /* type */
  --font: "Chivo", system-ui, sans-serif;
  --mono: "Chivo Mono", ui-monospace, monospace;
  --fs-wordmark: 20px; --fs-hero: 26px; --fs-eta: 22px; --fs-stop: 16px; --fs-body: 14px; --fs-nav: 11px; --fs-meta: 12px;

  /* layout */
  --top-clear: 54px;
  --top-h: 56px;
  --nav-h: 64px;
  --bottom-clear: 34px;
  --r-card: 16px;
  --r-sk: 8px;
  --r-badge: 8px;
  --card-gap: 10px;

  /* motion */
  --t-micro: 160ms;
  --t-hydrate: 420ms;
  --stagger: 70ms;
  --t-net: 900ms;          /* simulated fetch */
  --t-shimmer: 1400ms;
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-std: cubic-bezier(.2, .7, .2, 1);

  /* elevation */
  --shadow-replay: 0 6px 18px rgba(0,0,0,.35);
}
```

## Typography

| Role            | Family     | Size | Weight | Line-height | Tracking | Case     |
|-----------------|------------|-----:|-------:|------------:|---------:|----------|
| Wordmark        | Chivo      | 20px | 800    | 1           | −0.02em  | sentence |
| Hero headline   | Chivo      | 26px | 800    | 1.1         | −0.02em  | sentence |
| Hero body       | Chivo      | 14px | 500    | 1.45        | 0        | sentence |
| Stop name       | Chivo      | 16px | 700    | 1.3         | 0        | sentence |
| Stop detail     | Chivo      | 13px | 500    | 1.4         | 0        | sentence |
| ETA             | Chivo Mono | 22px | 500    | 1           | −0.02em  | numerals |
| ETA unit        | Chivo Mono | 11px | 400    | 1.2         | 0        | lowercase |
| Line badge      | Chivo Mono | 14px | 700    | 1           | 0        | numerals |
| Meta / source   | Chivo Mono | 11–12px | 400–500 | 1.4      | 0        | lowercase |
| Nav label       | Chivo      | 11px | 500    | 1           | 0        | sentence |

## Implementation notes

**Skeleton over content, same box.** Absolutely position the skeleton inside the card so the card's height is set by the real content:

```css
.card { position:relative; min-height:74px; border-radius:16px; }
.sk { position:absolute; inset:0; border-radius:inherit; background:var(--card);
  transition: opacity 420ms var(--ease-std); }
.real { opacity:0; transform:translateY(8px); transition: opacity 420ms var(--ease-out), transform 420ms var(--ease-out); }
.ready .real { opacity:1; transform:none; }
.ready .sk { opacity:0; pointer-events:none; }
```

**Shimmer with one gradient** — animate `background-position`, not a moving pseudo-element:

```css
.sk i { display:block; height:12px; border-radius:8px;
  background: linear-gradient(90deg, var(--card-2) 0%, var(--line) 40%, var(--card-2) 80%);
  background-size: 200% 100%; animation: shimmer 1.4s linear infinite; }
@keyframes shimmer { to { background-position: -200% 0 } }
```

**Replayable cold start** — reset synchronously, then one timer:

```js
function cold() {
  clearTimeout(t); main.classList.remove('ready'); replay.disabled = true;
  state.textContent = 'content · fetching…';
  t = setTimeout(() => { main.classList.add('ready'); state.textContent = 'content · network · 912 ms'; replay.disabled = false; }, 900);
}
```

Common mistakes: rendering skeletons as separate DOM that's swapped out (causes a height jump); staggering with JS `setTimeout` per card instead of CSS `transition-delay`; putting the shell bars inside the scroll container.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
