---
title: "Hero with a live browser card"
summary: "A SaaS hero: marker-highlighted headline, hard-shadow buttons, and a browser mockup whose schedule card ticks up, adds a post and pops a toast every 4.2s."
platform: web
type: section
category: hero
tags: [hero, saas, mockup, live, automation]
styles: [brutalist, playful]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#EEF3EA", "#FCFDF9", "#0F1E19", "#2443F0", "#FFE14D", "#15A05C"]
fonts: ["Familjen Grotesk", "Fragment Mono"]
related: [automation-config-live-preview, landing-devtool-dark]
---

# Hero with a live browser card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens and keep the hard 0-blur shadows.

## What it is

Studied from usearticle.com: the first screen, where the product is shown working inside a drawn browser window instead of as a static screenshot. This version is Ovenlight, a fictional service that publishes a recipe blog on a schedule. Left: a green live badge, a 64px headline with "cooking itself." in cobalt on a yellow marker stripe, a lede, two big hard-shadow buttons and three feature chips. Right: a browser frame with an 8px ink shadow, a tilted yellow sticker on its corner, and a schedule card that is visibly running: every 4.2 seconds the post count goes up by one, the progress bar grows, a new title drops into Recent posts and a "New post live" toast pops over the window's lower-left edge. The detail worth copying is that the mockup is alive but calm, with a real pause button, so the hero shows the product's promise ("it runs while you sleep") instead of claiming it.

## Reference behaviour

1. First frame: nav (logo, four links, cobalt "Start a kitchen" button), badge "Recipe autopublish · live" with a pulsing white dot, headline "Your recipe blog, cooking itself. Fresh every morning.", lede, buttons "Start a 14-day kitchen" (cobalt) and "Watch a post get made" (surface), chips "Daily at 7:00", "11 recipe formats", "9 languages", and mono fine print.
2. The browser shows "app.ovenlight.co/schedules" in the URL pill. The card: Live pill, pause and Edit buttons, "Weeknight Suppers", "weeknightsuppers.blog", progress "18 / 40 posts" at 45%, three stats (6 formats, 14 pans linked, 1/d for 40 days). Recent posts lists four titles with green dots and "1d ago" to "4d ago".
3. 1.6s after load, then every 4.2s: count +1, bar width animates, percentage updates, a new title is prepended with "just now", the older times shift (1d, 2d, 3d…), the list keeps four rows, and the toast shows for 2.2s.
4. At 40 / 40 the next tick wraps back to 18. Titles cycle through a list of eight.
5. Pause button: toggles `aria-pressed`, swaps the icon to a play triangle, the Live pill turns grey and reads "Paused", ticking stops. Pressing again resumes.
6. When the tab is hidden the interval is cleared; it restarts when visible unless paused.
7. Buttons press into their shadow on hover and flat on active. The sticker straightens from 9° to -3° and scales 1.06 on hover.

## Structure

```
1280 × 800, bg #EEF3EA with a 24px dot grid
nav  max 1180, padding 20/40   [logo Ovenlight] ............ links ×4 [Start a kitchen →]
hero max 1180, padding 28/40/48, grid minmax(0,1fr) | minmax(0,560px), gap 56, centred
┌ copy ──────────────────────────────┐   ┌ stage (padding 18 right/top) ─────────[sticker 9°]
│ [● RECIPE AUTOPUBLISH · LIVE]      │   │ ┌ window 2px ink, r14, shadow 8/8/0 ─────────────┐
│ Your recipe blog,           64/700 │   │ │ ● ● ●  [ app.ovenlight.co/schedules ]          │
│ cooking itself.  ← cobalt+marker   │   │ ├────────────────────────────────────────────────┤
│ Fresh every morning.               │   │ │ ┌ schedule card ───────────────────────────┐   │
│ lede 19px 46ch                     │   │ │ │ (● LIVE)                     [II] [Edit] │   │
│ [Start a 14-day kitchen][Watch…]56 │   │ │ │ Weeknight Suppers 22/700                 │   │
│ [◷ Daily at 7:00][≡ 11…][◍ 9…]     │   │ │ │ PROGRESS                    18 / 40 posts│   │
│ fine print mono 12                 │   │ │ │ [█████████░░░░░░░░░] 10px                │   │
└────────────────────────────────────┘   │ │ │ [6 formats][14 pans][1/d]                │   │
                                          │ │ └──────────────────────────────────────────┘   │
                                [toast]───┤ │ RECENT POSTS             ALL PUBLISHED         │
                                          │ │ ● title ………………………………… just now (4 rows × 30)│
                                          │ └────────────────────────────────────────────────┘
```

- `header.nav` with an `a.logo`, a `nav` labelled "Main", and a CTA link.
- `main.hero` with the copy `div` and `div.stage`.
- The window is `role=region` labelled "Product preview: a running recipe schedule". The traffic lights and URL are `aria-hidden`.
- Recent posts is an `ol` with `aria-live="polite"` and `aria-relevant="additions"`.
- The toast and sticker are `aria-hidden` decoration; the list announcement carries the news.

## Tokens

```css
:root {
  --bg: #eef3ea;         /* page, pale sage, with a #d3ddd0 1px dot every 24px */
  --surface: #fcfdf9;    /* window, cards, secondary button */
  --ink: #0f1e19;        /* text, borders, shadows */
  --ink-2: #44524c;      /* lede, nav links */
  --ink-3: #6b7871;      /* mono meta */
  --rule: #d7e0d4;       /* stat and list borders */
  --primary: #2443f0;    /* cobalt: headline accent, primary buttons, focus */
  --mark: #ffe14d;       /* marker stripe, sticker */
  --live: #15a05c;       /* badge, progress, dots, toast check */
  --live-soft: #d6f2e2;  /* live pill */
  --sans: "Familjen Grotesk", system-ui, sans-serif;
  --mono: "Fragment Mono", ui-monospace, monospace;
  --hard-sm: 3px 3px 0 var(--ink);
  --hard: 5px 5px 0 var(--ink);
  --hard-lg: 8px 8px 0 var(--ink);
  --r-btn: 10px; --r-cta: 12px; --r-win: 14px; --r-card: 12px;
  --micro: 150ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --tick: 4200ms; --toast-hold: 2200ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Logo | Familjen Grotesk | 21px | 700 | 1 | -0.02em |
| Nav link | Familjen Grotesk | 15px | 500 | 1.5 | 0 |
| Badge | Fragment Mono | 12px | 400 | 1 | 0.06em, upper |
| H1 | Familjen Grotesk | 64px | 700 | 0.98 | -0.035em |
| Lede | Familjen Grotesk | 19px | 400, bold run 600 | 1.55 | 0 |
| Hero buttons | Familjen Grotesk | 17px | 700 | 1 | 0 |
| Feature chip | Familjen Grotesk | 14px | 600 | 1 | 0 |
| Card title | Familjen Grotesk | 22px | 700 | 1.2 | -0.02em |
| Count | Familjen Grotesk | 15px | 700 | 1 | 0 |
| Labels, URL, times, domain | Fragment Mono | 11–12px | 400 | 1.4 | 0.06em when upper |
| List row | Familjen Grotesk | 13.5px | 500 | 30px rows | 0 |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Badge and Live dots | always | opacity | 1 → 0.35 → 1 | 2s loop | standard |
| Progress fill | tick | width | n/40 → (n+1)/40 | 500ms | expo out |
| New list row | tick | opacity, translateY | 0, -14px → 1, 0 | 500ms | expo out |
| Toast | tick | opacity, translateY, scale | 0, 10px, .96 → 1, 0, 1 | 300ms / 400ms | standard / expo |
| Toast hide | 2.2s after show | same, reversed | | 300ms | standard |
| Button hover | pointer | transform, shadow | 5px shadow → translate(3px,3px), 2px shadow | 150ms | standard |
| Button active | press | transform, shadow | → translate(5px,5px), none | 150ms | standard |
| Sticker hover | pointer | transform | rotate(9deg) → rotate(-3deg) scale(1.06) | 300ms | expo out |

Reduced motion: all transitions and keyframes are removed. Ticking continues so the content stays current, but numbers and rows change without movement, and the toast appears and disappears without sliding. The pause button is always available.

## States

- Primary button: cobalt fill, white text, 2px ink border, hard shadow. Secondary: surface fill, ink text.
- Hover: presses partway into the shadow. Active: flat, no shadow. Focus-visible: 2px cobalt outline, 3px offset.
- Live: green pill, pulsing dot. Paused: grey pill (`#eef0ec`, `--rule` border), static grey dot, text "Paused", play icon in the button.
- Toast: hidden (opacity 0) by default, shown for 2.2s per tick.
- Complete: at 40 / 40 the next tick wraps to 18; there is no separate done state in the hero.

## Accessibility

- Pause control is a `button` with `aria-pressed` and a label that flips between "Pause the live preview" and "Resume the live preview". This is the WCAG 2.2.2 control for auto-updating content.
- Recent posts `ol` is `aria-live="polite"` with `aria-relevant="additions"`, so only the new title is read.
- Progress is `role=progressbar` with min 0, max 40, `aria-valuenow`.
- The nav CTA keeps an `aria-label` because its text hides below 420px.
- Decorative pieces (traffic lights, URL, sticker, toast) are `aria-hidden`.
- Contrast: `#44524c` on `#eef3ea` ≈ 7:1; white on `#2443f0` ≈ 6.9:1; `#6b7871` on `#fcfdf9` ≈ 4.7:1.
- Hero buttons are 56px tall; nav button and card controls at least 34–44px.

## Responsive rules

- ≥1280: as drawn.
- 1100 and below: one column; the browser stage sits under the copy, max 560px wide.
- ≤720: nav links hide; padding 16px 20px; h1 44px; lede 17px; toast moves inside the window edge (left 8px); sticker sits flush right.
- ≤420: the nav CTA becomes an arrow-only button; hero buttons go full width.
- Never let the toast or sticker cause horizontal scroll; `body { overflow-x: hidden }` is a guard, not the fix. Keep their offsets inside the stage padding.

## Acceptance checklist

### Always

- [ ] Two columns at desktop, copy left, live product mockup right.
- [ ] One accent word in the headline with a marker stripe behind it.
- [ ] All elevated items use 0-blur ink shadows; buttons press into them.
- [ ] The mockup changes on a timer that is no faster than every 4s.
- [ ] A visible pause button stops all ticking, with `aria-pressed`.
- [ ] Ticking stops while the tab is hidden.
- [ ] New list items are announced politely; the list never grows past four rows.
- [ ] Reduced motion keeps the content but removes movement.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] First frame shows "18 / 40 posts" at 45%; first tick at 1.6s makes it "19 / 40" and adds "Crispy rice salad with herbs and lime".
- [ ] Headline accent "cooking itself." is `#2443f0` on a `#ffe14d` stripe.
- [ ] Window shadow 8px 8px 0 `#0f1e19`; sticker rotated 9°.
- [ ] Toast reads "New post live / Email sent · just now".

## Implementation notes

The tick. Keep it one function so pause and visibility only start and stop the interval:

```js
let n = 18, timer;
function tick() {
  n = n >= 40 ? 18 : n + 1;
  setProgress(n);
  list.querySelectorAll('time').forEach((t, i) => t.textContent = `${i + 1}d ago`);
  const li = document.createElement('li');
  li.className = 'in';
  li.innerHTML = `<span>${titles[qi++ % titles.length]}</span><time>just now</time>`;
  list.prepend(li);
  while (list.children.length > 4) list.lastElementChild.remove();
  showToast(2200);
}
const start = () => { timer = setInterval(tick, 4200); };
```

Update the old times before prepending, so the new row is the only "just now".

The marker highlight is a background gradient, not a pseudo element, so it wraps with the text:

```css
h1 .hl { color: var(--primary);
  background: linear-gradient(transparent 62%, var(--mark) 62% 90%, transparent 90%); }
```

The list must have a fixed height (4 × 30px = 120px, `overflow: hidden`) or the window grows by a row for 500ms on each tick and the whole hero jumps.

Common mistakes:

- A static screenshot in the frame. The point is that it moves.
- Ticking every second. It reads as a slot machine; 4.2s reads as "running".
- Soft drop shadows on the window. Use the 8px hard offset.
- Drawing a fake cursor clicking around. One loop: count, row, toast.
- No pause button. Auto-updating content needs one.
- Putting `aria-live` on the whole card, so the count, percent and title are all read every 4 seconds.

Rebuild order:

1. Nav and two-column grid.
2. Headline, lede, buttons, chips.
3. Browser frame, sticker, schedule card, list (static).
4. Tick function and interval.
5. Toast.
6. Pause and visibility handling.
7. Reduced motion and the narrow layout.
