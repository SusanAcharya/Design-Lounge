<!-- Design Lounge Nº 153 · "Tabbed feature preview" · designlounge.vercel.app -->

# Tabbed feature preview

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A features section for a SaaS landing page (the fictional support platform "Northdesk"). A two-line 60px headline sits above a split: on the left, four vertical tabs; on the right, a large preview stage showing a product window built entirely from divs. The tabs autoplay: each active tab grows a 1px mint hairline under itself over 6 seconds, then hands off to the next. The preview crossfades with a 4px blur and a 10px rise, so changing tabs feels like focusing a lens, not swapping slides. A 200px outlined numeral ("01"…"04") in the bottom-left corner counts the active step. The detail worth copying: the progress is a CSS animation, and JS only listens for `animationend`, so pause-on-hover is one line of CSS.

## Structure

```
1280 × 800, padding 56 / 64
┌───────────────────────────────────────────────────────────────────────┐
│ ● NORTHDESK · PLATFORM                                 Autoplay [❚❚]  │
│ Every ticket arrives                          Northdesk reads, routes │
│ already half-solved.   (60px, line 2 muted)   … 340px paragraph       │
│                                                       ↕ 40px          │
│ ┌ 392px tablist ──────┐   48px  ┌ stage (1fr, radius 14) ───────────┐ │
│ │01 Triage that reads │         │   ┌ window (panel-2, radius 10) ┐ │ │
│ │   description…      │         │   │ 40px header · chips          │ │ │
│ │   ━━━━━━━──────────  │         │   │ rows / table / flow / log    │ │ │
│ │02 Shared views, live│         │   └──────────────────────────────┘ │ │
│ │03 Automations…      │         │     pane: inset 28px, v-centred   │ │
│ │04 An audit trail…   │         │                                   │ │
│ └─────────────────────┘         │                                   │ │
│  01 /04  (200px outline)        └───────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
```

- `<section aria-labelledby>` — CSS grid `392px 1fr`, rows `auto 1fr`, column gap 48px.
- `.head` spans both columns: grid `1fr 340px`, `align-items:end`. Eyebrow (6px mint dot with 4px tinted ring + mono label), `<h2>` with a `<span>` for the muted second line, and a `<p>`.
- `.ctrl` absolutely positioned at `right:64px; top:62px`.
- `.tabs[role=tablist][aria-orientation=vertical]` — four `<button role=tab>`; each is a 2-column grid `36px 1fr`: mono number, `<h3>` title, `.d` collapsible description, `.bar > i` hairline at the bottom edge (starts at x=36px).
- `.big` — absolute at `left:58px; bottom:22px`, the active number, with `::after` "/04".
- `.stage` — relative, `overflow:hidden`, contains four absolutely positioned `.pane[role=tabpanel]`, each with one `.win`.

## Motion

| Element            | Trigger           | Property                     | From → To                         | Duration | Easing       | Notes |
|--------------------|-------------------|------------------------------|-----------------------------------|---------:|--------------|-------|
| `.bar i`           | tab selected      | transform scaleX             | 0 → 1 (origin left)               | 6000ms   | linear       | time is linear by design; `forwards` |
| `.bar i`           | section hover / tab focus / paused | animation-play-state | running → paused            | —        | —            | resumes from same point |
| `.tab .d`          | selected          | grid-template-rows           | 0fr → 1fr                         | 420ms    | `--ease-out` | previous tab collapses on same clock |
| `.tab h3`          | hover / selected  | color                        | `--ink-2` → `--ink`               | 160ms    | `--ease`     | |
| `.pane`            | selected          | opacity, translateY, scale, blur | 0, 10px, .985, 4px → 1, 0, 1, 0 | 420ms   | opacity/blur `--ease`, transform `--ease-out` | outgoing pane runs the reverse at the same time |
| `.wire`            | always (pane 3)   | background-position          | 0 → 8px                           | 900ms    | linear, infinite | 4px dash / 4px gap |
| `.caret`           | always (pane 1)   | opacity                      | 1 → 0                             | 1000ms   | steps(2)     | blink |

Reduced motion: autoplay starts paused, bars render full (`scaleX(1)`), panes swap opacity in 1ms with no transform or blur, description expands instantly, wires and caret are static.

## States

- **Tab rest:** title `--ink-2`, number `--ink-3`, description collapsed, 1px `--line` bottom border.
- **Tab hover:** title `--ink`.
- **Tab selected:** `aria-selected="true"`, title `--ink`, number `--accent`, description expanded, hairline filling.
- **Tab focus-visible:** 2px `--accent` outline, 4px offset, 4px radius.
- **Paused:** class `.paused` on the section (or `:hover`); hairline frozen. Control label "Paused", icon play triangle.
- **Pause button hover:** border `--ink-3`, icon `--ink`. Focus-visible: 2px mint outline, 2px offset.
- **Highlighted row (pane 1):** `--panel-3` background plus `inset 2px 0 0 var(--accent)`.
- **Live node (pane 3):** border `rgba(134,225,176,.45)` and a 4px `--accent-dim` ring.
- Chip variants: neutral (`--line-2` border, `--ink-2`), `.g` mint text + mint-dim fill, `.y` amber text, `.r` coral text.

## Accessibility

- Tabs follow the ARIA tabs pattern: `role=tablist` with `aria-orientation="vertical"`, `role=tab` with `aria-controls`, `role=tabpanel` with `aria-labelledby`. Roving `tabindex`: selected tab 0, others −1.
- Arrow keys (all four), Home and End move selection and focus. Selection follows focus.
- Autoplay must never move keyboard focus; it only changes `aria-selected`. Any keyboard focus inside the tablist pauses autoplay (WCAG 2.2.2).
- Pause control is a real `<button>` with `aria-pressed` and a label that reads "Pause autoplay" / "Resume autoplay".
- Decorative pieces (giant numeral, live cursors) are `aria-hidden="true"`.
- Contrast: `--ink-2` on `--bg` 7.4:1; `--ink-3` on `--bg` 3.6:1 is used only for 11px mono labels and the muted headline line at 60px (large text).

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: tab column 320px, padding 40px, headline 48px, the intro paragraph hides, header becomes one column.
- 768–1023: stack: headline, then tabs as a horizontal scroller of pills (title only), then the stage at 16:10. Giant numeral hides.
- < 640: the tabs become an accordion; each tab's pane renders inside it below the description at full width, scaled to 0.8. Autoplay is off below 640.

## Acceptance checklist

- [ ] Tab column is 392px; column gap 48px; stage radius 14px; panes inset 28px and vertically centred.
- [ ] Each selected tab's hairline fills from x=36px to the right edge in exactly 6000ms, then the next tab activates; 04 wraps to 01.
- [ ] Hovering the section freezes the hairline mid-way and resumes from the same point on leave.
- [ ] Clicking a tab restarts its hairline from zero.
- [ ] The description expands via `grid-template-rows` 0fr → 1fr (420ms) with no height jump.
- [ ] Pane crossfade includes 10px rise, 0.985 scale and 4px blur, 420ms.
- [ ] Giant 200px outlined numeral updates with the selection and shows "/04".
- [ ] Arrow keys, Home and End work; roving tabindex is correct; focus never moves on autoplay.
- [ ] Pause button toggles `aria-pressed`, icon and label.
- [ ] Reduced motion: no autoplay on load, instant pane swap, static wires and caret.
- [ ] All four panes are made of HTML/CSS only, no images.
- [ ] No console errors.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: tab 01 "Triage that reads first" is selected, its description is expanded, its hairline starts filling left → right. The stage shows the Inbox window with a highlighted ticket and a dashed "Suggested reply" box with a blinking 7×14px mint caret.
2. After 6000ms the hairline is full; the next tab becomes selected. Its description expands (grid-rows 0fr → 1fr, 420ms) while the previous collapses; the pane crossfades; the giant numeral changes to "02". After tab 04 it wraps to 01.
3. Hovering anywhere over the section pauses the hairline where it is (`animation-play-state: paused`). Moving the pointer out resumes from the same point.
4. Clicking a tab selects it immediately and restarts its hairline from 0.
5. Keyboard: when a tab has focus, autoplay is paused; Up/Left and Down/Right move selection (and focus) with wrap-around, Home/End jump to first/last.
6. A 32px square pause button top-right (label "Autoplay" / "Paused" in mono to its left) toggles autoplay. Its icon swaps between two bars and a play triangle; `aria-pressed` mirrors the state.
7. The four panes are: **Inbox** (5 ticket rows, sentiment chips, a suggested reply), **Shared view** (filter chips, a 5-row SLA table with health meters, two live-cursor name tags), **Automation rule** (When → If → Then nodes joined by marching dashed wires, plus a 4-cell run stats strip), **Audit log** (6 timestamped entries on a dotted timeline).
8. With reduced motion, autoplay is off from the start (button shows "Paused"), panes switch instantly, wires and caret stop.

## Tokens

```css
:root {
  /* surfaces — cool near-black, hairlines instead of shadows */
  --bg: #0a0b0d;
  --panel: #111317;        /* stage base, flow nodes */
  --panel-2: #16191e;      /* product window */
  --panel-3: #1c2026;      /* highlighted row, inline code */
  --line: #1f2329;         /* hairlines */
  --line-2: #2b3038;       /* stronger hairline, chip border */

  /* ink */
  --ink: #eceef1;
  --ink-2: #9aa1ac;
  --ink-3: #646b76;

  /* accent + status */
  --accent: #86e1b0;                  /* mint: progress, selected number, positive chips */
  --accent-dim: rgba(134,225,176,.12);
  --warn: #f2c46d;
  --red: #ef8b7a;

  /* type */
  --sans: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --fs-display: 60px;
  --fs-numeral: 200px;
  --fs-tab: 17px;
  --fs-body: 14px;
  --fs-small: 13px;
  --fs-label: 11px;

  /* space + shape */
  --pad-y: 56px;
  --pad-x: 64px;
  --gap: 48px;
  --r: 10px;               /* window */
  --r-lg: 14px;            /* stage */
  --r-chip: 5px;
  --shadow-win: 0 24px 60px -24px rgba(0,0,0,.7);

  /* motion */
  --dwell: 6000ms;
  --t-fast: 160ms;
  --t-pane: 420ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

Stage background: `radial-gradient(120% 80% at 80% 0%, #141a1a 0%, var(--panel) 55%)`, a barely visible green-tinted light from the top right.

## Typography

| Role              | Family     | Size  | Weight | Line-height | Tracking | Case      |
|-------------------|------------|------:|-------:|------------:|---------:|-----------|
| Headline          | Geist      | 60px  | 500    | 0.98        | −0.045em | sentence  |
| Giant numeral     | Geist      | 200px | 500    | 0.8         | −0.07em  | digits, 1px outline only |
| Eyebrow           | Geist Mono | 11px  | 500    | 1           | +0.14em  | UPPERCASE |
| Intro paragraph   | Geist      | 15px  | 400    | 1.55        | 0        | sentence  |
| Tab title         | Geist      | 17px  | 500    | 22px        | −0.015em | sentence  |
| Tab number        | Geist Mono | 11px  | 500    | 22px        | 0        | digits    |
| Tab description   | Geist      | 13.5px| 400    | 1.55        | 0        | sentence  |
| Window header     | Geist Mono | 12px  | 500    | 1           | 0        | sentence  |
| Chip              | Geist Mono | 10.5px| 500    | 1           | 0        | lowercase |
| Table header      | Geist Mono | 10.5px| 500    | 1.3         | +0.08em  | UPPERCASE |
| Stat value        | Geist      | 22px  | 500    | 1.2         | −0.03em  | digits    |

Headline second line uses `--ink-3`. Selected tab number uses `--accent`.

## Implementation notes

**Let CSS own the clock.** The progress bar is a CSS animation; JS advances on `animationend`. Restarting the animation needs a reflow:

```js
function show(i) {
  cur = (i + tabs.length) % tabs.length;
  tabs.forEach((t, k) => {
    t.setAttribute('aria-selected', k === cur);
    t.tabIndex = k === cur ? 0 : -1;
    const b = t.querySelector('.bar i');
    b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
  });
  panes.forEach((p, k) => p.classList.toggle('on', k === cur));
}
bar.addEventListener('animationend', () => { if (!paused && k === cur) show(cur + 1); });
```

**Pause is CSS.** No timers to clear:

```css
.tab[aria-selected="true"] .bar i { animation: fill var(--dwell) linear forwards; }
section:hover .bar i, section.paused .bar i { animation-play-state: paused; }
@keyframes fill { to { transform: scaleX(1); } }
```

**Height-animating the description** without measuring:

```css
.tab .d { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 420ms var(--ease-out); }
.tab .d > p { overflow: hidden; }
.tab[aria-selected="true"] .d { grid-template-rows: 1fr; }
```

Common mistakes: using `setInterval` for autoplay (drifts and can't pause mid-way); moving focus when autoplay advances; stacking panes with `display:none` (kills the crossfade); letting the outgoing pane keep `pointer-events`, so clicks land on an invisible layer.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
