---
title: "Giant numeral steps"
summary: "How it works in three steps: 250px numerals on hairline columns, each tucked behind a real artefact: a terminal, a priced form, a restore result."
platform: web
type: section
category: features
tags: [features, steps, how-it-works, numerals, backup]
styles: [swiss, editorial]
motion: subtle
difficulty: 1
featured: false
published: 2026-10-28
palette: ["#ECEAE4", "#FBFAF7", "#151514", "#C2255C", "#1B1B1A"]
fonts: ["Bricolage Grotesque"]
related: [features-sticky-scroll-steps, features-vertical-label-columns]
---

# Giant numeral steps

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The "how it works" section for "Fernhill", an invented off-site backup service for small offices. Three columns hang from a 1px ink rule. Each starts with a numeral set at about 250px in Bricolage Grotesque 800, tight enough that it reads as a shape, with the step's verb (Install, Choose, Restore) and a time beside it. A working artefact card slides 30px up over the foot of each numeral: a terminal transcript with a Copy button, a folder picker whose price updates as you tick, and a restore result you can run again. The detail to copy: the overlap. The number sits behind the proof, so the section reads as one composition, not three tiles.

## Reference behaviour

1. Initial state: headline (two lines at 52px) left, raspberry "Back up 1 TB free" and a price note right; a 1px `--ink` rule; three columns split by 1px `--line` verticals.
2. Hover or focus anything inside a column: its numeral turns from ink to raspberry over 240ms.
3. Install: Copy writes `sudo sh fernhill-install.sh` to the clipboard (guarded; failures are silent), and the button reads "Copied" for 1600ms.
4. Choose: three folder checkboxes (/Clients 412 GB on, /Accounts 38 GB on, /Photo shoots 1.24 TB off) and a "Keep versions for" select (30 days ×1, 90 days ×1.4, 1 year ×2.1). Price = GB × £0.014 × multiplier. Initial: "450 GB protected", £8.82 a month. Ticking /Photo shoots gives "1.69 TB protected", £33.12.
5. Restore: a done state "Restored to Tue 28 Oct, 14:00", path, a full 6px meter, and three stats (14,382 files, 41.7 GB, 6m 12s). "Run the restore again" refills the meter from 0 over 2400ms (expo-out), the status reads "Restoring 14,382 files" and the button is disabled until it finishes.
6. Footer hairline with company and proof line.

## Structure

```
1280 × 800
┌──────────────────────── wrap 1200 max, padding 64 / 44 / 48 ─────────────────────────┐
│ Off-site backups for the office,                       [Back up 1 TB free] 14 days…  │
│ set up before the kettle boils.  (52px, 700)                                          │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1px ink ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│ █  Install          │ ██  Choose            │ ███ Restore                              │
│ █  About 2 minutes  │  █  About 1 minute    │   █ When the worst happens               │
│ █  One command…     │ █   Tick the folders… │ ███ Pick a folder…                       │
│┌terminal──────────┐ │┌form───────────────┐  │┌result────────────────┐                 │
││ $ sudo sh …      │ ││ ☑ /Clients 412 GB │  ││ ✓ Restored to Tue…   │  ← card overlaps │
││ Linked to fra-02 │ ││ Keep versions [90]│  ││ meter · 3 stats      │    numeral by 30 │
│└──────────────────┘ ││ 450 GB    £8.82   │  │└──────────────────────┘                 │
│                     │└───────────────────┘  │                                          │
│ footer: Fernhill Backup Ltd, Bristol…                 2,310 offices restored…         │
└───────────────────────────────────────────────────────────────────────────────────────┘
 columns 1fr ×3 · inner padding 28 either side of each vertical rule
```

- `<section aria-labelledby>` → `.head` (`<h2>` + `.cta`), `<ol>` of three `<li>`, `.foot`.
- Each `<li>`: `.top` grid (`auto 1fr`, gap 18) holding `<span class="n" aria-hidden="true">` and `.lab` (`<h3>` with a visually hidden "Step 1: ", `.t` time, `<p>`). Then `.art`, the artefact.
- Artefacts: `div.term` (dark), `form.form` (checkbox labels, select, live total), `div.res` (status, path, meter, stats, ghost button).

## Tokens

```css
:root {
  /* colour: cool stone, ink, one raspberry */
  --bg: #ECEAE4;          /* page */
  --card: #FBFAF7;        /* form and result cards */
  --sunk: #E2DFD6;        /* row dividers, empty meter, ghost hover */
  --line: #CFCBC0;        /* column rules, card borders */
  --line-2: #8E897D;      /* select and ghost borders, 3:1 on --card */
  --ink: #151514;         /* headline, numerals, top rule, meter */
  --ink-2: #47453F;       /* body */
  --ink-3: #64615A;       /* time labels, units, footer */
  --accent: #C2255C;      /* primary, checkbox, done tick, numeral hover */
  --accent-hover: #A51D4D;
  --accent-ink: #FFFFFF;
  --term: #1B1B1A;  --term-ink: #E9E6DD;  --term-dim: #A7A296;
  --term-ok: #7FD3A0;  --term-prompt: #F08DB0;

  /* type */
  --font: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: ui-monospace, "SF Mono", Menlo, monospace;   /* system mono, terminal only */
  --num: clamp(150px, 21vw, 280px);
  --fs-h2: clamp(32px, 4.2vw, 52px);
  --fs-verb: 26px;
  --fs-figure: 22–26px;
  --fs-body: 14px;
  --fs-meta: 12–13px;

  /* layout */
  --col-pad: 28px;
  --overlap: -30px;       /* artefact margin-top */
  --r: 6px;
  --shadow-card: 0 1px 0 rgba(21,21,20,.04), 0 12px 28px -16px rgba(21,21,20,.28);

  /* motion */
  --t: 160ms;
  --t-num: 240ms;
  --t-restore: 2400ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
|---|---|---:|---:|---:|---:|---|
| Numeral | Bricolage Grotesque | clamp(150px, 21vw, 280px) | 800 | 0.78 | -0.07em | `opsz` 96, margin-left −6px to sit on the rule's edge |
| Headline | Bricolage Grotesque | clamp(32px, 4.2vw, 52px) | 700 | 1.0 | -0.035em | max 24ch |
| Step verb | Bricolage Grotesque | 26px | 700 | 1.0 | -0.02em | the label, never "Step 1" |
| Time | Bricolage Grotesque | 13px | 500 | 1.4 | 0 | `--ink-3` |
| Step body | Bricolage Grotesque | 14px | 400 | 1.45 | 0 | `--ink-2` |
| Price, stats | Bricolage Grotesque | 26px / 22px | 800 | 1.1 | -0.03em | tabular numerals |
| Terminal | system mono | 13px | 500 | 1.6 | 0 | wraps, never scrolls sideways |
| Meta | Bricolage Grotesque | 12–13px | 400–600 | 1.35 | 0 | |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| `.n` numeral | hover / focus-within on its column | color | `--ink` → `--accent` | 240ms | `--ease` | 1ms |
| `.meter i` | Run the restore again | transform scaleX | 0 → 1 | 2400ms | `--expo` | no animation; status flips after 50ms |
| Copy label | click | text | Copy → Copied → Copy | 1600ms hold | none | same |

Nothing moves on load. The first frame is the finished composition.

## States

- **Primary:** raspberry fill, white text, 44px; hover `#A51D4D`.
- **Copy (on dark):** 28px tall, 1px `#6E6A61` border; hover `#2A2A28`; after click reads "Copied".
- **Checkbox:** custom (`appearance: none`), 18px, 1.5px `--ink-3` border (5.4:1 on `--card`), 4px radius; checked fills raspberry with a white tick. Unchecked rows keep their size so the total row never jumps.
- **Select:** 36px, 1px `--line-2` border on `--card`.
- **Restore running:** status "Restoring 14,382 files", meter refilling, button `disabled`.
- **Focus-visible:** 2px raspberry outline, 2px offset, on every control.
- **Column hover/focus:** numeral raspberry.

## Accessibility

- The steps are an `<ol>`, so order is announced. The numerals are `aria-hidden`; each `<h3>` carries a visually hidden "Step 1: " so the label is complete for screen readers while sighted users see only the verb.
- The form uses real `<label>` wrappers and a labelled `<select>`; the total line is `aria-live="polite"`.
- The restore status is `aria-live="polite"`.
- The terminal has `aria-label="Install commands"`; its text is real text, selectable.
- Contrast: `--ink-2` on `--bg` 8.7:1; `--ink-3` on `--bg` 5.4:1; `--term-dim` on `--term` 6.9:1; white on raspberry 5.6:1; `--line-2` border on `--card` 3.3:1.
- Hit targets: primary 44px, select and ghost 36px, checkbox rows 34px tall.

## Responsive rules

- ≥ 1280: three columns as drawn; numerals 250–280px.
- 1024–1279: same; numerals follow 21vw.
- < 1024: one column; each step separated by a 1px bottom rule and 32px padding; artefacts cap at 520px wide.
- < 760: wrap padding 32px 16px; head stacks with the button above the note; numerals hit the 150px floor. `.lab` keeps 34px bottom padding so, when the text is taller than the numeral, the 30px overlap only eats padding and never covers words. At 390 wide nothing scrolls sideways.

## Acceptance checklist

**Always**
- [ ] Numerals are at least 200px on desktop, weight 800, line-height 0.78.
- [ ] Each step is labelled by its verb, never "Step 1"; numerals are `aria-hidden`.
- [ ] The artefact card overlaps the foot of its numeral by 30px and sits above it (`z-index: 1`).
- [ ] Overlap never covers the step's text at any width.
- [ ] Columns hang from a 1px ink rule and are divided by 1px hairlines; no card backgrounds on the columns themselves.
- [ ] Numeral turns accent on column hover and on focus-within.
- [ ] Every artefact does something: copy, recompute, replay.
- [ ] Reduced motion: no meter animation, the result still completes.
- [ ] At 390 wide: one column, no sideways scroll, terminal text wraps.

**This demo**
- [ ] Verbs Install, Choose, Restore with times "About 2 minutes", "About 1 minute", "When the worst happens".
- [ ] Price starts at 450 GB, £8.82 a month, and becomes £33.12 with /Photo shoots ticked.
- [ ] Restore stats read 14,382 files, 41.7 GB, 6m 12s.
- [ ] Headline "Off-site backups for the office, set up before the kettle boils."

## Implementation notes

**The overlap, safe at every width.** Pull the artefact up with a negative margin and reserve the same space under the text column, so the overlap lands on the numeral when it is taller and on padding when the text is taller.

```css
.top { display: grid; grid-template-columns: auto 1fr; gap: 18px; align-items: start; }
.n   { font: 800 var(--num)/.78 var(--font); letter-spacing: -.07em;
       font-variation-settings: "opsz" 96; margin: 22px 0 0 -6px; }
.lab { padding: 26px 0 34px; }          /* 34 > 30 overlap */
.art { position: relative; z-index: 1; margin-top: -30px; }
```

**Price from the form, one function.**

```js
function price() {
  let gb = 0;
  plan.querySelectorAll('input[type=checkbox]').forEach(c => { if (c.checked) gb += +c.dataset.gb; });
  const p = gb * 0.014 * +keep.value;
  gbEl.textContent = (gb >= 1000 ? (gb / 1000).toFixed(2) + ' TB' : gb + ' GB') + ' protected';
  priceEl.firstChild.nodeValue = '£' + p.toFixed(2);   // keeps the " a month" span
}
plan.addEventListener('change', price);
```

**Replay a CSS animation.** Remove the class, force a reflow, add it back.

```js
res.classList.remove('run'); void res.offsetWidth; res.classList.add('run');
```

Common mistakes: setting the numerals in a light weight (they stop reading as shapes); putting "01 / 03" eyebrows on top of the numerals; letting the terminal scroll sideways on phones; drop shadows on the columns themselves (only the overlapping artefacts get the soft shadow, because they float over the numeral).
