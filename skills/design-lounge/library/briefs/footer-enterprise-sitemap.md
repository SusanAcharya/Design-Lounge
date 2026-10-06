<!-- Design Lounge Nº 110 · "Enterprise sitemap footer" · www.designlounge.live -->

# Enterprise sitemap footer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The footer of a cloud infrastructure company ("Corvane"), shown under the page's final sign-up band. It holds 46 links in six columns without feeling like a phone book, because the Swiss devices do the organising: a 2px black rule under the header row, a 1px rule above each column, and a 64px blue index numeral (01–06) heading every column. Two utilities make it read as a real enterprise product: a green **All systems normal** pill that reveals a 90-day uptime strip on hover, and a **region · language** pill that opens a three-region popover. Certifications and a legal row close it out. The feeling: a well-run company that has nothing to hide.

## Structure

```
1280 × 800 (scrolled to bottom)
┌──────────────────────────────────────────────────────────────────────┐
│ Deploy your first service in 4 minutes. No card…  [Talk][Start →]   │ CTA band, 124 tall (≈100 visible)
├──────────────────────────────────────────────────────────────────────┤
│ ▣ Corvane    Cloud infrastructure for teams that   (●All systems)(⊕ US·EN ⌄)
│              ship on Fridays.                                        │ head, 2px ink rule below
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│ ─────── ─────── ─────── ─────── ─────── ───────                      │ 1px rule per column
│ 01      02      03      04      05      06        (64px blue)        │
│ Platform Solutions Developers Resources Company Support              │
│ 7–8 links each, 13px, 6px gap                                        │
├──────────────────────────────────────────────────────────────────────┤
│ ⛉ SOC 2 Type II  ◎ ISO 27001  ⊓ HIPAA  ≡ GDPR   14 regions · 212 edge│ certs, 1px rules
│ © 2026 Corvane, Inc. … Privacy Terms Cookie… Accessibility…   <> ▭ ▶ ⌁│ legal + social
└──────────────────────────────────────────────────────────────────────┘
 side padding 48px · columns 6 × 1fr, gap 24px
```

- `<section class="cta">` flex row: `<h2>` (flex 1) + two `<a class="btn">`.
- `<footer aria-label="Site footer">` `position:relative` (the popover anchors to it).
  - `.head`: grid `2fr 4fr auto`, gap 32px, `border-bottom:2px solid --ink`, 28px bottom padding. Logo link, `<p class="claim">`, `.tools` with the status `<a>` and region `<button>`.
  - `.pop` `role="dialog"` absolutely positioned `top:96px; right:48px`, grid of three `role="radiogroup"` columns with `role="radio"` buttons.
  - `<nav class="map" aria-label="Sitemap">`: six columns, each `<h3>` (numeral `<span>` + title) and a `<ul>`.
  - `.certs`: flex row of icon + mono label pairs, spacer, coverage stat.
  - `.legal`: copyright, five links, spacer, `.social` icon links with `aria-label`.

## Motion

| Element         | Trigger        | Property                 | From → To                         | Duration | Easing        |
|-----------------|----------------|--------------------------|-----------------------------------|---------:|---------------|
| Status dot      | always         | box-shadow spread        | 0 → 6px, alpha .45 → 0            | 2400ms   | `--ease`, infinite |
| Uptime card     | hover / focus  | opacity, translateY      | 0, 4px → 1, 0                     | 220ms    | opacity `--ease`, move `--ease-out` |
| Region popover  | click          | opacity, translateY, scale | 0, −6px, .98 → 1, 0, 1          | 220ms    | `--ease-out`  |
| Region chevron  | open/close     | rotate                   | 0 → 180°                          | 220ms    | `--ease`      |
| Pill border     | hover / open   | border-color             | `--line-2` → `--ink`              | 140ms    | linear colour |
| Link            | hover          | color                    | `--ink-2` → `--accent`            | 140ms    | —             |
| Social icon     | hover          | background, color        | transparent/ink → ink/paper       | 140ms    | —             |

Reduced motion: transitions become 1ms and the ping stops; the popover and uptime card still open and close.

## States

- **Link hover:** blue text, underline (offset 3px).
- **Focus-visible:** 2px `--accent` outline, 2px offset, 3px radius, on every link, pill and option.
- **Region pill open:** `aria-expanded="true"`, ink border, chevron up.
- **Selected region:** `aria-checked="true"`, blue country and language, weight 600.
- **Option hover:** `--bg` fill, 5px radius, extends 8px left of the text.
- **Status degraded (not in demo, but design for it):** pill fill `#fdf1dc`, text and dot `--warn`, label "Partial outage · 2 regions".
- **Primary button hover:** `--accent-press`.

## Accessibility

- The status pill is a link to the status page with `aria-describedby` pointing at the uptime card (`role="tooltip"`), so the summary is announced.
- Region trigger: `<button aria-haspopup="dialog" aria-expanded aria-controls="pop">`. The popover is `role="dialog"` with `aria-label="Choose region and language"`; each region column is a `role="radiogroup"` with an `aria-label`, options are `role="radio"` with `aria-checked`.
- Keyboard in popover: arrows move focus (±1 vertically, ±4 horizontally, wrapping), Enter/Space selects, Escape closes and returns focus to the trigger.
- Social links are icon-only, so each has an `aria-label` ("Corvane source code", "Community forum", "Video channel", "Changelog RSS").
- Contrast: `--ink-2` on `--bg` 7.0:1; `--ink-3` 5.0:1; `--ok` on `--ok-2` 4.6:1; `--accent` on `--bg` 6.9:1.
- Hit targets: pills 36px tall, social icons 34px, popover options 34px tall.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: same six columns; claim drops to 26px.
- ≤ 1100: sitemap becomes 3 × 2; the claim moves under the logo row spanning the full width.
- < 640: sitemap 2 columns; numerals drop to 44px; tools, certs and legal rows wrap; popover becomes full-width minus 16px gutters and a single column.

## Acceptance checklist

- [ ] On load the page shows the bottom of the CTA band above the footer.
- [ ] Six sitemap columns with a 1px ink rule above each and a 64px blue numeral 01–06.
- [ ] Header row is closed by a 2px `#121212` rule.
- [ ] Status dot pings every 2.4s; hovering the pill shows a 90-bar uptime card with two amber bars.
- [ ] Clicking the region pill opens the popover, rotates the chevron and focuses the selected option.
- [ ] Arrow keys move within the popover; Enter selects and updates the pill label.
- [ ] Escape and outside clicks close the popover; Escape returns focus to the pill.
- [ ] Exactly one option has `aria-checked="true"` at any time.
- [ ] Every icon-only control has an accessible name.
- [ ] All links show a visible blue focus outline.
- [ ] With reduced motion nothing pulses and popovers appear instantly.
- [ ] No horizontal scroll at 1280; nothing wraps in the header row.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: the page is scrolled to the bottom. The last 100px of page content (a white CTA band: "Deploy your first service in 4 minutes. No card required." with **Talk to sales** and **Start for free**) sits above the footer.
2. The status pill's 8px green dot emits a soft ring (box-shadow 0 → 6px, fading) every 2.4s.
3. Hover or focus the status pill: an uptime card (340px wide) fades in above it (opacity 0 → 1, translateY 4px → 0, 220ms). It shows "Uptime · last 90 days", "14 regions", 90 thin bars (two amber bars mark an incident) and a caption row "Jul 4 · 1 incident · 11 min, Aug 19 · Today".
4. Click the region pill ("United States · English"): its chevron rotates 180°, its border darkens to `--ink`, and a 560px popover drops in below the header aligned to the right edge (opacity 0 → 1, translateY −6px → 0, scale 0.98 → 1, 220ms, origin top right). Focus moves to the currently selected option.
5. The popover has three columns (Americas, Europe, Asia Pacific), four countries each, the language right-aligned in grey. The selected option is blue and 600 weight. A mono note runs underneath: "Prices shown in local currency. Data residency is set per project, not here."
6. Arrow Up/Down move focus within the list order (wrapping); Arrow Left/Right jump four options (one column). Enter/Space or click selects: the pill label updates (e.g. "Deutschland · Deutsch"), the popover closes and focus returns to the pill.
7. Escape or a click outside closes the popover; Escape returns focus to the pill.
8. Sitemap links hover to `--accent` with an underline offset 3px. Inline tags ("New", "41 open", black "v4.12") stay put.
9. Social icon buttons (34px squares) invert to a black fill with white glyph on hover.

## Tokens

```css
:root {
  /* colour: warm off-white, ink black, one Swiss blue, one status green */
  --bg: #f7f7f5;        /* footer */
  --paper: #ffffff;     /* CTA band, popover, cards */
  --line: #e3e3df;      /* 1px separators */
  --line-2: #cfcfca;    /* pill and button borders */
  --ink: #121212;       /* text, 2px header rule, column rules */
  --ink-2: #55554f;     /* links */
  --ink-3: #6c6c66;     /* meta, languages */
  --accent: #1f3bff;    /* numerals, link hover, selected region, primary button */
  --accent-press: #1530d6;
  --accent-2: #e8ecff;  /* "New" tag fill */
  --ok: #12864a;        /* status text and bars */
  --ok-2: #e3f4ea;      /* status pill fill */
  --warn: #d98a00;      /* incident bars */

  /* type */
  --font: "Hanken Grotesk", system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --fs-link: 13px;
  --fs-legal: 12px;
  --fs-meta: 11px;
  --fs-tag: 9.5px;
  --fs-claim: 30px;
  --fs-cta: 36px;
  --fs-index: 64px;

  /* layout */
  --pad: 48px;
  --col-gap: 24px;
  --pill-h: 36px;
  --btn-h: 44px;
  --r: 6px;
  --r-pop: 10px;
  --shadow: 0 1px 0 rgba(0,0,0,.04), 0 12px 32px -8px rgba(18,18,18,.18);

  /* motion */
  --t-micro: 140ms;
  --t-pop: 220ms;
  --t-ping: 2400ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role              | Family          | Size   | Weight | Line-height | Tracking | Case      |
|-------------------|-----------------|-------:|-------:|------------:|---------:|-----------|
| CTA headline      | Hanken Grotesk  | 36px   | 600    | 1.05        | −0.03em  | sentence  |
| Claim             | Hanken Grotesk  | 30px   | 500 (700 on blue phrase) | 1.1 | −0.03em | sentence |
| Logo              | Hanken Grotesk  | 20px   | 700    | 1           | −0.03em  | title     |
| Index numeral     | Hanken Grotesk  | 64px   | 700    | 0.9         | −0.06em  | numerals  |
| Column title      | Hanken Grotesk  | 13px   | 700    | 1.45        | 0        | title     |
| Link              | Hanken Grotesk  | 13px   | 400    | 1.45        | 0        | sentence  |
| Status pill       | Hanken Grotesk  | 13px   | 600    | 1           | 0        | sentence  |
| Uptime %, certs   | JetBrains Mono  | 11px   | 500    | 1.3         | 0        | as written |
| Popover region h4 | JetBrains Mono  | 10px   | 500    | 1           | +0.10em  | UPPERCASE |
| Tag               | JetBrains Mono  | 9.5px  | 500    | 1           | +0.04em  | as written |
| Legal             | Hanken Grotesk  | 12px   | 400    | 1.45        | 0        | sentence  |

## Implementation notes

**Big index numerals as part of the heading.** Put the numeral inside the `<h3>` so the column is self-labelled, and stack it with flex:

```css
.map h3 { display: flex; flex-direction: column; gap: 10px;
          border-top: 1px solid var(--ink); margin: 0 0 14px; font: 700 13px var(--font); }
.map h3 span { font: 700 64px/.9 var(--font); letter-spacing: -.06em;
               color: var(--accent); margin-top: 10px; }
```

**Popover keyboard model.** One flat list of options; vertical arrows step by one, horizontal by a column (four):

```js
opts.forEach((b, i) => b.addEventListener('keydown', (e) => {
  const d = { ArrowDown: 1, ArrowUp: -1, ArrowRight: 4, ArrowLeft: -4 }[e.key];
  if (d) { e.preventDefault(); opts[(i + d + opts.length) % opts.length].focus(); }
}));
```

**The ping without a pseudo-element.** Animate the dot's own box-shadow spread so it never shifts layout:

```css
.status i { width: 8px; height: 8px; border-radius: 50%; background: var(--ok);
            animation: ping 2.4s var(--ease) infinite; }
@keyframes ping { 70% { box-shadow: 0 0 0 6px rgba(18,134,74,0); }
                  100% { box-shadow: 0 0 0 0 rgba(18,134,74,0); } }
```

Common mistakes: opening the popover upward into the CTA band (anchor it to the footer below the header row); using a `<select>` for region, which can't show language and country side by side; letting the status card capture pointer events while hidden (`pointer-events:none` until shown); making every link blue at rest, which turns the sitemap into noise.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
