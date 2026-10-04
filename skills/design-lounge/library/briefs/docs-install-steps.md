<!-- Design Lounge Nº 223 · "Docs install steps with code panels" · designlounge.vercel.app -->

# Docs install steps with code panels

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens; keep the code panels dark in both themes.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

Studied from tailwindcss.com/docs/installation: the numbered install steps where each step's short explanation sits beside its own dark code panel, and the lines you must add are highlighted. This version documents Wrenpack, a fictional build-time image optimiser. Above the steps, three tabs switch between whole guides (Build plugin, Standalone CLI, Script tag). Each step number is a small bracket-cornered tile that the reader can click to tick the step off, and a thin meter at the top counts "2 of 5 done". It is the content block inside a docs page; the shell around it is `docs-hatched-gutter-shell`, the three-column layout is `docs-three-column`, and a single multi-language sample is `code-snippet-tabs`. The detail worth copying is the highlighted line treatment: a faint blue wash across the full panel width plus a 2px blue bar at the left edge, so a reader sees what changes in a config file without a diff.

## Structure

```
1280 × 800, bg #F7F5F0, content max-width 1000, padding 56 48 96
INSTALLATION                          mono 12, 0.12em
Get started with Wrenpack             32 / 600
lede ×2                               16.5 / 1.7, max 70ch
Installation                          19 / 600, margin-top 40
[Build plugin] [Standalone CLI] [Script tag]   gap 26, 1px rule under, 2px ink under selected
intro (66ch)
5 steps · about 6 minutes ................. 1 of 5 done [====------] 120×4
┌44┬─────────── text 1fr ───────────┬28┬──────── code 400 ────────────┐
│▣ │ Create your project            │  │ Terminal               ⧉ Copy│
│| │ Start a new site if…           │  │ ┌──────────────────────────┐ │
│| │                                │  │ │ npm create site@latest … │ │
│| │                                │  │ └──────────────────────────┘ │
│02│ Install Wrenpack  …            │  │ …                            │
└──┴────────────────────────────────┴──┴──────────────────────────────┘   40px between steps
[i] Stuck on a step? …                                 (Browse setup guides)
```

- `main.page`; `h1`, `h2#inst`.
- Tabs: `div[role=tablist][aria-labelledby=inst]`, three `button[role=tab]`; one `div[role=tabpanel]` re-rendered on change.
- Steps: `ol.steps` of `li.step`. Number: `button.num[aria-pressed]`. Text: `div.txt > h3 + p`. Code: `div.code > div.code-h + pre > code > span.ln` (one span per line).
- Note: `div.note` with an icon, a `p` and a `button`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Tab panel | tab change | opacity, translateY | 0, 6px → 1, 0 | 260ms | standard |
| Number tile | toggle | background, border, colour | ivory → teal | 160ms | standard |
| Meter fill | toggle | width | n/M → (n±1)/M | 300ms | standard |
| Copy label | click | text and colour | Copy → Copied (green) → Copy | 1.6s hold, no tween | — |

Reduced motion: no fade, no width tween. State still changes.

## States

- Tab: resting `--ink-2`; hover and selected `--ink`; selected has a 2px ink bar on the rule.
- Number tile: resting ivory with a 1px `--rule-2` border and darker ink corner ticks at top-left and bottom-left; hover border `--ink-3`; done (`aria-pressed=true`) teal fill, white 14px check, corner ticks teal.
- Done step: title colour `--ink-2`. Body unchanged.
- Copy: resting `--code-dim`; hover `--code-ink` on `#1f2327`; copied green "Copied"; blocked clipboard "Selected" with the code text selected.
- Highlighted line: wash + 2px left bar, full width of the inner panel, even when the line is short.
- Focus-visible: 2px teal outline, 2px offset; inside code panels the Copy outline is `--hl-bar` for contrast on dark.

## Accessibility

- Tabs follow the ARIA tabs pattern: roving tabindex, ArrowLeft/Right wrap, Home/End, `aria-selected`, `aria-controls`, the panel `aria-labelledby` the current tab.
- Number tiles are toggle buttons: `aria-pressed`, and an `aria-label` "Step 3: mark done" / "Step 3: mark not done".
- "N of M done" sits in an `aria-live="polite"` span.
- Copy buttons have specific labels: "Copy build.config.ts snippet for step 3".
- Code is real text in `pre > code`, never an image. Highlight is not the only signal: the step text says which lines change.
- Contrast: `#55584f` on `#f7f5f0` ≈ 6.9:1; `#e6e3da` on `#181b1e` ≈ 13:1; `#8b9086` on `#101214` ≈ 5.6:1.
- Hit targets: tabs 40px tall, number tiles 31px (desktop docs), Copy 28px tall with padding; increase tiles to 40px on touch layouts.

## Responsive rules

- ≥1280: as drawn, 1000px content.
- 1024: same grid; the text column narrows.
- ≤900: the code panel drops under the text, in column 2 (aligned with the title, not the number), 14px above.
- <560: page padding 32/18/64, h1 27px, number column 38px, gap 14px, meter 72px wide, meta line wraps. Tabs scroll horizontally if they don't fit; never wrap tabs to two rows.
- Code panels scroll horizontally inside themselves (`overflow-x: auto`); the page never does.

## Acceptance checklist

### Always

- [ ] Each step is one row: number, text, code panel; code drops under text below 900px.
- [ ] A 1px connector runs between numbers and stops at the last one.
- [ ] Code panels are a dark frame with a label row and an inset inner panel.
- [ ] Added lines are highlighted with a full-width wash and a 2px left bar.
- [ ] Copy copies the code without highlight markers and confirms for 1.6s, with a fallback when the clipboard is blocked.
- [ ] Number tiles are toggle buttons; a meter counts done steps per guide.
- [ ] Guide tabs follow the ARIA tabs keyboard pattern.
- [ ] Code is real selectable text.
- [ ] No horizontal page scroll at 375px.

### This demo

- [ ] Title "Get started with Wrenpack"; tabs Build plugin, Standalone CLI, Script tag.
- [ ] Build plugin has 5 steps, step 01 starts done, meta reads "1 of 5 done".
- [ ] Step 03 file label `build.config.ts` with two highlighted lines.
- [ ] Code inner panel `#181b1e`, highlight bar `#86cbe6`, done tile `#0e7c66`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 1280×800: mono eyebrow "INSTALLATION", 32px title "Get started with Wrenpack", two lede paragraphs, the 19px "Installation" heading, the tab row with Build plugin selected (2px ink underline), the intro sentence, the meta line "5 steps · about 6 minutes" on the left and "1 of 5 done" plus a 120×4px meter on the right, then steps 01 and the top of 02.
2. Step 01 starts ticked: its tile is teal with a white check. The others show "02", "03"… in mono.
3. Each step is a three-column row: 44px number column, the text (15px/600 title, 14.5px body with inline code chips), and a 400px dark code panel. A 1px vertical line runs from each number down to the next.
4. Code panel: outer frame `#101214` with 12px radius and 4px padding, a 12px label row (filename or "Terminal") with a Copy button on the right, then an inner `#181b1e` panel with 9px radius holding the code.
5. Lines that start with `+` in the source are drawn highlighted (wash + left bar) and the `+` is stripped. Step 03 highlights the import and the plugin call; step 04 highlights the two `img` lines.
6. Clicking a number toggles that step done: tile fills teal, number becomes a check, the step title dims to `--ink-2`, the meter and "N of M done" update. Done state is remembered per guide while the page is open.
7. Copy: writes the snippet (without `+` markers) to the clipboard, the button turns green and reads "Copied" for 1.6s. If the clipboard is blocked (sandboxed iframe), it selects the code text instead and reads "Selected".
8. Tabs: click or ArrowLeft/ArrowRight/Home/End switch guides. The panel re-renders and fades up 6px over 260ms. Standalone CLI has 4 steps, Script tag has 3.
9. Below the steps, a bordered note "Stuck on a step?" with a pill button "Browse setup guides".

## Tokens

```css
:root {
  --bg: #f7f5f0;          /* page, warm ivory */
  --ink: #1d1f1b;         /* headings, selected tab, inline code text */
  --ink-2: #55584f;       /* body */
  --ink-3: #7a7d73;       /* meta, icon */
  --rule: #e2ded3;        /* tab rule, note border, meter track */
  --rule-2: #d2cdc0;      /* step connector line, number tile border */
  --accent: #0e7c66;      /* done tile, meter, link underline, focus */
  --chip: #ece8de;        /* inline code background */
  --code-frame: #101214;  /* outer panel */
  --code-bg: #181b1e;     /* inner panel */
  --code-ink: #e6e3da;    /* plain code */
  --code-dim: #8b9086;    /* label row, comments, flags */
  --code-line: #2a2f33;   /* inner panel 1px inset edge */
  --t-key: #f28b6b;       /* keywords, shell command, tag names */
  --t-str: #b4dc8f;       /* strings, copied state */
  --t-fn: #86cbe6;        /* calls, shell args */
  --t-attr: #e7c87a;      /* html attributes */
  --hl-bg: rgba(134,203,230,.11);  /* highlighted line wash */
  --hl-bar: #86cbe6;               /* highlighted line left bar */
  --sans: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --r-frame: 12px; --r-inner: 9px; --r-tile: 6px; --r-chip: 4px;
  --step-gap: 40px; --col-num: 44px; --col-code: 400px; --col-gap: 28px;
  --ease: cubic-bezier(.2,.7,.2,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Eyebrow | Geist Mono | 12px | 500 | 1 | 0.12em, upper |
| H1 | Geist | 32px | 600 | 1.15 | -0.025em |
| Lede | Geist | 16.5px | 400 | 1.7 | 0 |
| H2 | Geist | 19px | 600 | 1.4 | -0.015em |
| Tab | Geist | 14.5px | 500 | 1 | 0 |
| Meta, meter text | Geist Mono | 12px | 400 | 1 | 0 |
| Step number | Geist Mono | 11px | 500 | 1 | 0 |
| Step title | Geist | 15px | 600 | 1.4 | -0.005em |
| Step body | Geist | 14.5px | 400 | 1.75 | 0 |
| Inline code | Geist Mono | 13px | 500 | 1 | 0, chip `--chip` |
| Panel label, Copy | Geist | 12px | 400 | 1 | 0 |
| Code | Geist Mono | 13px | 400 | 1.7 | 0 |

## Implementation notes

Store guides as data and mark highlighted lines with a leading `+`. Render one span per line so the wash can span the full width:

```js
const lines = step.code.split('\n');
pre.innerHTML = '<code>' + lines.map(l =>
  `<span class="ln${l.startsWith('+') ? ' hl' : ''}">${hi(l.replace(/^\+/, ''), step.lang) || ' '}</span>`
).join('') + '</code>';
const raw = lines.map(l => l.replace(/^\+/, '')).join('\n');   // what Copy writes
```

```css
pre { padding: 16px 0; overflow-x: auto; }
pre .ln { display: block; padding: 0 18px; white-space: pre; min-height: 1.7em; }
pre .ln.hl { background: var(--hl-bg); box-shadow: inset 2px 0 0 var(--hl-bar); }
```

Padding goes on the line, not the `pre`, or the wash stops 18px short of each edge.

Highlight in one pass. Chaining `.replace()` calls re-matches the `class="…"` you just inserted and prints it as code. Use one alternation regex and escape each token:

```js
const re = /('[^']*'|"[^"]*")|\b(import|from|export|default)\b|\b([a-zA-Z]+)(?=\()|([\s\S])/g;
line.replace(re, (m, str, kw, fn) =>
  str ? span('s', str) : kw ? span('k', kw) : fn ? span('f', fn) : esc(m));
```

If you inline code samples in a `<script>`, write `<\/script>` inside strings. A literal closing tag ends the script block.

Common mistakes:

- One giant code block per page. The point is one small panel per step, next to its sentence.
- Green/red diff gutters with `+` signs. Use the quiet wash and bar.
- Line numbers. These are short snippets; numbers add noise.
- Copy that includes the `+` markers or the `# output` comment lines the reader shouldn't run. (This demo keeps comment lines; drop them if your product prints output.)
- Light code panels on a light page. Keep the dark panel; it is what the eye scans for.

Rebuild order:

1. Page header and tabs.
2. Step grid with static text.
3. Code panels and the line renderer.
4. Highlighter.
5. Copy with fallback.
6. Tick-off and meter.
7. Narrow layout.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
