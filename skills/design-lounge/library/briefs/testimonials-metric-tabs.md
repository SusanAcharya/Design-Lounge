<!-- Design Lounge Nº 437 · "Testimonials metric tabs" · designlounge.vercel.app -->

# Testimonials metric tabs

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A case-study proof section for **Keel**, a subscription billing product. Four customer wordmarks sit in a tab row. The open tab shows one big result ("−38%"), what it means, two small supporting numbers, a quote, the person, and a **Read the case** button. The tabs move on by themselves every 7 seconds. A 2px mint line fills along the bottom of the open tab to show the time left. It pauses while the pointer is over the section or focus is inside it, and there is a pause button. The feeling is a quiet dark SaaS page: ink navy, white, one mint. The detail worth copying is that the progress line is a CSS animation, and its `animationend` event is the timer. Pausing is just `animation-play-state`.

## Reference behaviour

1. First frame: kicker "CUSTOMER RESULTS" in mint, then a 44px heading on two lines: "Billing teams that moved to Keel." in white and "In their numbers." in muted grey. On the right: "Auto-advance · 7s" and a 40px pause button.
2. Below, a tab row of four equal cells, 84px tall: **northvane** (heavy lowercase with a dot), **OKAPI** (spaced mono caps with a diamond), *Fernhouse* (italic serif), **Brightloop** (two linked rings + grotesk). Each cell has a small index 01–04 on the right.
3. Northvane is open. Its cell is the panel colour and white. A 2px track runs along its bottom edge, and a mint line fills that track from left to right over 7000ms, linear.
4. The panel under the tabs has two columns, 5 : 6. Left: "−38%" at 112px mono with the minus sign in mint, then "voluntary churn in two quarters after switching dunning to Keel", then a rule and two small stats: "CARDS RECOVERED 11,420" and "LIVE IN 9 days". Right: the quote with mint curly quote marks, then a rule, the person (initials disc, "Ines Okafor", "VP Finance, Northvane Freight") and the mint **Read the case** button.
5. When the line is full, the next tab opens. After Brightloop it wraps to Northvane.
6. Opening a tab: the new panel's left column fades up from 8px below over 360ms; the right column follows 60ms later. The new tab's line starts again from 0.
7. Pointer over any part of the section: the line stops where it is. Pointer leaves: it continues from the same point. It does not restart.
8. Focus anywhere inside the section: same pause as hover.
9. Click the pause button: it becomes a play button, `aria-pressed="true"`, the label text reads "Paused". The line stays still even after the pointer leaves. Click again to resume.
10. Click a tab: it opens at once. Arrow Right and Arrow Left move between tabs and open them. Home opens the first, End the last. Focus follows.
11. Reduced motion: the line is drawn full and still. The tabs still move on every 7s, but the panel swaps with no fade. Pause still works.

## Structure

```
1280 × 800, section padding 56px 64px 48px
┌──────────────────────────────────────────────────────────────────────┐
│ CUSTOMER RESULTS                                                      │
│ Billing teams that moved to Keel.                                     │
│ In their numbers.                          Auto-advance · 7s  [ || ]  │
│                                                              36px     │
│ ┌────────────────┬────────────────┬────────────────┬────────────────┐ │
│ │ northvane.  01 │ ◇ OKAPI     02 │ Fernhouse   03 │ ∞ Brightloop 04│ │ 84px tabs
│ │▬▬▬▬▬▬────────── │                │                │                │ │ 2px progress
│ ├────────────────┴───────┬────────┴────────────────┴────────────────┤ │
│ │                        │                                          │ │
│ │  −38%       112px mono │  "We moved retries and card updates to   │ │
│ │  voluntary churn in    │   Keel on a Tuesday..."   25px           │ │
│ │  two quarters...       │                                          │ │
│ │                        │                                          │ │
│ │  ───────────────────── │  ──────────────────────────────────────  │ │
│ │  CARDS RECOVERED LIVE  │  (IO) Ines Okafor        [Read the case→]│ │
│ │  11,420         9 days │       VP Finance, ...                    │ │
│ └────────────────────────┴──────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
  tabs + panel share one 1px border, radius 12px on the outer corners
```

- `<section aria-labelledby>` with an `h2`. The section is the hover and focus area for pausing.
- `.head` grid `minmax(0,1fr) auto`: kicker + heading left, control group right.
- `.tabs` is `role="tablist"` with `aria-label="Customer stories"`. Grid `repeat(4, minmax(0,1fr))`.
- Each tab is a `button role="tab"` with `aria-selected`, `aria-controls`, roving `tabindex`. Inside: the wordmark, the index, and an empty `.bar` span at the bottom.
- `.panels` holds four `div role="tabpanel"` with `aria-labelledby` and `tabindex="0"`. Closed panels have `hidden`.
- `.panels` is `display: flex; flex: 1` so the open panel fills the frame height and the person row sits at the bottom. Under 1024 set `.panels { flex: none }` so a tall screen does not leave an empty block.
- Each panel: `.metric` (big number `p`, meaning `p`, `dl` of two stats) and `.story` (`blockquote`, then `.person` with disc, name, role and the link).

## Tokens

```css
:root {
  /* colour */
  --bg: #0c1222;        /* page, ink navy */
  --panel: #111a2e;     /* open tab and panel */
  --ink: #f3f5f9;       /* primary text */
  --ink-2: #b4bccb;     /* meaning line, hover tab */
  --ink-3: #8590a6;     /* closed tabs, labels, roles */
  --line: #22304a;      /* borders and rules */
  --line-2: #2e3f5f;    /* progress track, button border */
  --mint: #5ee3b1;      /* the one accent */
  --mint-ink: #0c1222;  /* text on mint */
  --focus: #5ee3b1;

  /* type */
  --sans: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --fs-metric: 112px;
  --fs-h2: 44px;
  --fs-quote: 25px;
  --fs-what: 20px;
  --fs-stat: 22px;
  --fs-wordmark: 22px;
  --fs-label: 11px;

  /* space */
  --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px;
  --s-9: 36px; --s-11: 44px; --s-12: 48px;

  /* shape */
  --radius-box: 12px;
  --radius-btn: 8px;
  --tab-h: 84px;
  --bar-h: 2px;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --dwell: 7s;
  --t-panel: 360ms;
  --t-stagger: 60ms;
  --t-micro: 200ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Kicker | Geist Mono | 12px | 500 | 1 | 0.12em | upper |
| Heading | Geist | 44px | 600 | 1.05 | -0.025em | sentence |
| Control label | Geist Mono | 12px | 400 | 1 | 0 | sentence |
| Big metric | Geist Mono | 112px | 500 | 0.9 | -0.06em | — |
| Meaning | Geist | 20px | 400 | 1.3 | 0 | sentence, max 22ch |
| Stat label | Geist Mono | 11px | 400 | 1.3 | 0.08em | upper |
| Stat value | Geist Mono | 22px | 500 | 1 | -0.02em | — |
| Quote | Geist | 25px | 400 | 1.38 | -0.012em | sentence |
| Name | Geist | 15px | 500 | 1.5 | 0 | — |
| Role | Geist | 13px | 400 | 1.5 | 0 | — |
| Button | Geist | 14px | 600 | 1 | 0 | sentence |
| Tab index | Geist Mono | 11px | 400 | 1 | 0 | — |

Wordmarks are fictional and drawn in CSS text. Each uses a different style, all in `currentColor`:

| Mark | Style |
| --- | --- |
| northvane | Geist 700, 22px, -0.04em, lowercase, 9px dot after the e |
| OKAPI | Geist Mono 500, 16px, 0.32em, caps, 14px outlined diamond before it |
| Fernhouse | Georgia italic, 25px, -0.01em |
| Brightloop | Geist 500, 21px, 22px SVG of two linked circles before it |

All numbers use mono so the digits line up. Use `font-variant-numeric: tabular-nums` on the metric.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Progress line | tab opens | `transform: scaleX` | 0 → 1, origin left | 7000ms | linear (it is a clock) | full and still, still fires end |
| Auto-advance | line `animationend` | open next tab | — | — | — | same, every 7s |
| Pause | section hover or focus-within | `animation-play-state` | running → paused | — | — | same |
| Pause button | click | `data-paused` on section | — | — | — | same |
| Metric column | panel opens | opacity, `translateY` | 0, 8px → 1, 0 | 360ms | standard | none |
| Story column | panel opens | opacity, `translateY` | 0, 8px → 1, 0 | 360ms, +60ms | standard | none |
| Tab colour | hover, select | color, background | — | 200ms | standard | none |
| Link arrow | hover | `gap` | 8px → 12px | 200ms | standard | none |

Linear is correct for the progress line only. It is time, not a move. Everything else uses the standard curve.

## States

- Tab closed: text `--ink-3`, no fill, no track.
- Tab hover: text `--ink-2`, background 2% white.
- Tab open: text `--ink`, background `--panel`, 2px track `--line-2` with the mint fill on top.
- Tab focus-visible: 2px mint outline drawn inside the cell (offset -4px), radius 12px. The tab bar's `overflow: hidden` would cut an outside ring.
- Section paused (hover, focus, or button): the mint fill stops at its current width.
- Pause button: shows two bars while running, a play triangle while paused. Label text beside it reads "Auto-advance · 7s" or "Paused". Hover: border `--ink-3`, fill `--panel`.
- Read the case: mint fill, navy text, 44px tall. Hover: the arrow moves 4px further away.
- Empty: with one customer, drop the tab row and the timer. Show the panel alone.
- Loading: not drawn. Do not show a spinner inside the panel.

## Accessibility

- Tab pattern: `role="tablist"`, `role="tab"`, `role="tabpanel"`. Each tab has `aria-controls`; each panel has `aria-labelledby`.
- Roving tabindex: the open tab is `tabindex="0"`, the others `-1`. Tab moves from the tab row into the open panel, then to its link.
- Keys on a tab: Arrow Right next, Arrow Left previous (both wrap), Home first, End last. Opening follows focus.
- Auto-advance never moves focus. It only changes which tab is open.
- Focus inside the section pauses the clock, so a keyboard user is never moved on while reading. This plus the pause button covers WCAG 2.2.2.
- Pause button: `aria-pressed` and an `aria-label` that says what a press will do ("Pause auto-advance" / "Resume auto-advance").
- Do not add `aria-live` to the panel. A region that changes every 7s and talks each time is noise.
- The wordmark text is the tab name. The diamond and the rings are `aria-hidden`. The index number is `aria-hidden`.
- Contrast on `#111a2e`: `#f3f5f9` is about 16:1, `#b4bccb` about 9:1, `#8590a6` about 5.4:1. Navy on mint is about 11:1.
- Targets: tabs 84px tall (64px under 640), pause 40px, link 44px.

## Responsive rules

- ≥1280: as drawn. Section padding 56px 64px. Four tabs in a row. Panel 5 : 6.
- 1024 (up to 1023): padding 40px 32px. Tab index numbers hidden. Metric 88px, quote 21px, panel padding 36px 28px / 36px 32px.
- 768 (up to 767): tabs become a 2 × 2 grid with a 1px rule between rows. The panel becomes one column: metric on top, a rule, then the story.
- <640: padding 32px 16px. The head stacks; the pause control sits under the heading. Heading 32px. Tabs 64px tall, wordmarks 18px. Metric 72px. Quote 19px. The case button takes the full row under the person.
- At every width, `scrollWidth` equals the viewport. Wordmarks never wrap; they shrink with the breakpoints.
- Do not turn the tabs into a horizontal scroller on phones. The 2 × 2 grid keeps every customer visible.

## Acceptance checklist

### Always

- [ ] The tab row is a real tablist with roving tabindex and arrow, Home and End keys.
- [ ] Exactly one tab is open. Its panel is the only one without `hidden`.
- [ ] The progress line is a CSS animation on the open tab, and `animationend` opens the next tab.
- [ ] Hover or focus inside the section pauses the line, and it resumes from the same point.
- [ ] A visible pause button with `aria-pressed` stops auto-advance until pressed again.
- [ ] Auto-advance never moves focus.
- [ ] Each panel has one big metric, one meaning line, a quote, a person, and one link.
- [ ] One accent colour. Mint is used for the line, the metric unit, quote marks, the kicker, the button and focus only.
- [ ] Four tabs in a row at 768 and up. A 2 × 2 grid under 768.
- [ ] Reduced motion: no fade and no moving line, but the tabs still change every 7s.

### This demo

- [ ] Customers in order: northvane, OKAPI, Fernhouse, Brightloop.
- [ ] Metrics: "−38%", "4.2×", "$1.9M", "11d".
- [ ] People: Ines Okafor (VP Finance, Northvane Freight), Daniel Kowalczyk (Controller, Okapi Robotics), Priya Raman (Head of Growth, Fernhouse), Mateo Silva (Staff Engineer, Brightloop).
- [ ] The dwell is 7s and the control label reads "Auto-advance · 7s".
- [ ] Heading reads "Billing teams that moved to Keel. In their numbers."

## Implementation notes

**1. Let the animation be the timer.** No `setInterval`. The newly selected tab gets the animation through its selector, so it starts from 0 by itself.

```css
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; }
.tab[aria-selected="true"] .bar { background: var(--line-2); }
.tab[aria-selected="true"] .bar::after {
  content: ""; position: absolute; inset: 0;
  background: var(--mint); transform-origin: left;
  animation: fill var(--dwell) linear forwards;
}
.sec:hover .bar::after,
.sec:focus-within .bar::after,
.sec[data-paused] .bar::after { animation-play-state: paused; }
@keyframes fill { from { transform: scaleX(0) } to { transform: scaleX(1) } }
```

```js
tabs.forEach((t, i) => {
  t.querySelector('.bar').addEventListener('animationend', () => select(i + 1));
});
```

**2. Reduced motion must still end.** If you set `animation: none`, `animationend` never fires and the tabs stop for good. Swap the keyframes for a still one with the same duration.

```css
@media (prefers-reduced-motion: reduce) {
  .tab[aria-selected="true"] .bar::after { animation-name: hold; }
  @keyframes hold { from, to { transform: none } }
  .panel.in .metric, .panel.in .story { animation: none; }
}
```

**3. Select and keys.**

```js
function select(i, focus) {
  i = (i + tabs.length) % tabs.length;
  tabs.forEach((t, j) => {
    const on = j === i;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    const p = document.getElementById(t.getAttribute('aria-controls'));
    p.hidden = !on;
    p.classList.toggle('in', on);
  });
  if (focus) tabs[i].focus();
}
// keydown on each tab
const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
if (k !== undefined) { e.preventDefault(); select(k, true); }
```

Common mistakes:

- A `setInterval` plus a separate CSS line. They drift apart, and pausing one does not pause the other.
- Restarting the line from 0 when the pointer leaves. Pause means hold, not reset.
- Real company logos. Use fictional names drawn in text.
- Coloured wordmarks. They stay in `currentColor`; the open one is white, the rest grey.
- Moving focus to the next tab on auto-advance.
- A hyphen for the minus. Use `&minus;` (U+2212).
- A second accent for the big numbers. The number is white; only its sign or unit is mint.
- Glow or gradient behind the metric. The panel is flat `#111a2e`.

Rebuild order:

1. Navy page, heading, control group.
2. Tablist with four wordmarks and empty bars.
3. Four panels, two columns each, first one open.
4. Select function and keys.
5. Progress keyframes, `animationend`, pause selectors.
6. Pause button.
7. Panel fade.
8. Breakpoints at 1023, 767, 639.
9. Reduced motion with the still keyframes.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
