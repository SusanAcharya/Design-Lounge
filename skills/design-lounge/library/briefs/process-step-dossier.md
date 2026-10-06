<!-- Design Lounge Nº 367 · "Process step dossier" · www.designlounge.live -->

# Process step dossier

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from sibaldesign.com: the idea is the projects panel that says "hover a step for its story", where a project's process frames sit in a row and the one you point at lights up in the accent while a caption box explains it. This version is the Work section of Fennick, a fictional product designer, on graphite with a signal orange-red accent. Each project shows three or four artboards drawn at rising fidelity: dashed sketch, grey wireframe, full colour, and shipped (device-framed, with a LIVE tag). Under the row, the project name, a dash pager, and a caption box with an orange left rule tell the story of the selected step. Prev and Next switch projects. The detail worth copying is that a case study becomes one screen: the reader sees the whole process at a glance and reads only the step they care about.

The artboards are built from a handful of positioned blocks per layout. Fidelity is a class, not a new drawing. In a product, swap the blocks for real thumbnails and keep the fidelity order.

## Structure

```
1280 × 800, padding-inline 84px
┌──────────────────────────────────────────────────────────────────────────┐
│ FENNICK/                          INDEX  WORK  NOTES  CONTACT  ■ BOOKING │ top 56px, 1px rule
│ 02 WORK ───────────────────────────────────────────────────────────────  │ section title 30px
│ ┌ panel ───────────────────────────────────────────────────────────────┐ │
│ │ ■ PRJ.001 · MOB                             HOVER A STEP FOR ITS STORY│ │ head 38px
│ │  grid 24px                                                           │ │
│ │   01·SKETCH   02·WIREFRAME  ┏03·VISUAL┓   04·SHIPPED                 │ │ stage 372px
│ │   ┌╌╌╌╌┐      ┌────┐        ┃┌────┐  ┃   ╭────╮                     │ │ artboards 136×286
│ │   ╎    ╎      │▓▓▓▓│        ┃│████│  ┃   │████│LIVE                 │ │ gap 28px
│ │   └╌╌╌╌┘      └────┘        ┗└────┘  ┛   ╰────╯                     │ │
│ ├──────────────┬───────────────────────────────────────────────────────┤ │
│ │ TRANSIT PASS │ ┃ STEP 03 / 04 · VISUAL · 390                          │ │ lower, 250px | 1fr
│ │ ── ── ━━ ──  │ ┃ Night-blue base so the code reads in sun and in…     │ │
│ │ [IOS] [TICKETING] [FIELD RESEARCH] [PROTOTYPE]                        │ │ tags
│ └──────────────────────────────────────────────────────────────────────┘ │
│ 01 / 03  ━━━━──────────                         [‹ Prev] [Next project ›]│ foot
└──────────────────────────────────────────────────────────────────────────┘
```

- `header.top`: logo link, `nav` with `aria-current` on Work, availability label.
- Section title: number span + `h1` "WORK" + flexible rule (`::after`).
- `section.panel` labelled by the project `h2`.
- `.stage` is `role="tablist"` "Process steps". Each step is a `button role="tab"` containing a label row (number · name, size) and an `.art` div of absolutely positioned `i` blocks.
- `.lower`: left column (`h2` project title, dash pager `aria-hidden`), right column (caption box = `role="tabpanel"`, `tabindex=0`, `aria-labelledby` the selected step), tags spanning both columns.
- `.foot`: counter, progress line, two `button`s.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Step select | hover / focus / click | opacity, scale, border | .5, .96, none → 1, 1, orange | 240 / 320 / 200ms | ease / expo / ease | border and opacity only, instant |
| Caption swap | step change | opacity, translateX | 0, -6px → 1, 0 | 320ms | `--ease` | none |
| Dash pager | step change | width, colour | 12px grey → 22px orange | 300 / 200ms | expo / ease | instant |
| Steps enter | project change | opacity, translateY, scale | 0, 14px, .96 → 1, 0, 1 | 480ms, 50ms stagger | expo | none |
| Progress line | project change | scaleX | old → n/3 | 500ms | expo | instant |
| Row scroll (narrow) | step change | scrollLeft | → centred | smooth | browser | instant |

## States

- Step resting: opacity .5, scale .96, transparent border, label `--dim`.
- Step hover (not selected): opacity .8.
- Step selected: opacity 1, scale 1, 1px `--accent` border, `--accent-soft` background, label `--accent`, `aria-selected="true"`, `tabindex=0`.
- Focus-visible: 2px orange outline, offset 3px (also selects).
- Artboard fidelity: sketch = 1px dashed `--dim` edges and blocks, text lines as dashed rules; wireframe = `#26262b` board, `#3a3a41` blocks; visual = project colours; shipped = visual + 3px dark ring + 1px outer ring + drop shadow, 14px radius for phones, orange LIVE tag bottom-right.
- Prev / Next hover: border turns orange, text `--ink`.
- Nav link current: `--ink`.

## Accessibility

- Steps are a tablist with roving tabindex. Focus selects, so keyboard users get the same "hover" reading. Each tab has `aria-label="Step 3 of 4: Visual"`.
- The caption box is the tabpanel, labelled by the selected step.
- Project changes are announced in a polite live region. Prev and Next have `aria-label`s ("Previous project", "Next project") because their visible text hides on phones.
- The dash pager and progress line are `aria-hidden`; the counter "01 / 03" is visible text.
- Contrast: `#ece6da` on `#1c1c1f` about 14:1; `#bdb6aa` about 9:1; `#8f8a81` about 5:1; orange `#ff5b2e` on `#1c1c1f` about 5.6:1.
- Unselected steps at .5 opacity are previews, not text to read; their labels are repeated in the caption when selected.
- Targets: steps are at least 156px wide; buttons 40px tall.

## Responsive rules

- ≥1280: as drawn, the row is centred.
- 1024–1100: gutters 40px, artboards shrink (phone 116×244, dashboard 210×132, poster 150×212), gap 16px.
- 768: same as 1024; four posters still fit.
- <760: gutters 16px, nav links and the hint hidden. The stage becomes a horizontal scroller with `scroll-snap-type: x mandatory`; steps don't shrink; the selected step is centred. The lower area stacks: title + pager, then caption, then tags. Prev / Next show icons only; the progress line is 80px.
- No horizontal page overflow at 375px (only the stage scrolls).

## Acceptance checklist

### Always

- [ ] One project at a time, its steps side by side in process order, three or four steps.
- [ ] Fidelity rises left to right: sketch, wireframe, visual, shipped. Shipped is device-framed and tagged LIVE.
- [ ] Exactly one step is selected: accent border, accent wash, full opacity. The others are at .5 and slightly smaller.
- [ ] Hover, focus and click all select. Arrow keys, Home and End move between steps.
- [ ] The caption box shows "Step N / M · Name · Size" and one or two sentences, with a 2px accent left rule.
- [ ] Each project opens on a chosen step, not always the first.
- [ ] Prev / Next wrap, rebuild the row with a staggered entrance, update counter and progress, and announce the project.
- [ ] Narrow screens scroll the row sideways with snap; the page itself never scrolls sideways.
- [ ] Reduced motion keeps all state changes and drops movement.

### This demo

- [ ] Projects: Transit pass (PRJ.001 · MOB), Grain ledger (PRJ.002 · DSH), Harbour posters (PRJ.003 · PRN).
- [ ] Transit pass opens on "Step 03 / 04 · Visual · 390".
- [ ] Panel head right side reads "Hover a step for its story" in orange.
- [ ] Section title "02 WORK" at 30px with 0.18em tracking.
- [ ] Accent is `#ff5b2e` on `#1c1c1f`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Load: project 01 "Transit pass" (PRJ.001 · MOB). Four phone artboards: 01 Sketch · Paper, 02 Wireframe · 390, 03 Visual · 390, 04 Shipped · iOS 18. Step 03 is selected: full opacity, 1px orange border, 8% orange wash, orange label.
2. Unselected steps sit at opacity .5 and `scale(.96)`. Hovering one raises it to .8 before it becomes selected.
3. Hover, focus or click a step: it becomes selected (240ms opacity, 320ms expo scale, 200ms border). The caption meta changes to "Step 0N / 0M · Name · Size", the story text swaps, and the box slides in from -6px with a fade (320ms). The dash pager moves: the active dash grows from 12px to 22px and turns orange.
4. Arrow Left / Right move focus (and so selection) between steps, wrapping. Home / End go to the first and last step.
5. "Next project" / "Prev": the row is rebuilt for the new project. Steps enter with a 14px rise, scale .96 → 1 and fade (480ms expo, 50ms stagger). Header code, title, tags and the "0N / 03" counter update. The 220px progress line scales to (n / 3) over 500ms expo. Projects wrap.
6. Each project opens on its own most telling step: project 01 on Visual, project 02 "Grain ledger" on Layout, project 03 "Harbour posters" on Colour.
7. A polite live region announces "Project 2 of 3: Grain ledger" on project change.
8. On narrow screens the step row scrolls sideways with snap, and the selected step is scrolled to the centre.
9. Reduced motion: no scale, rise, slide or smooth scroll. Selection still changes border, opacity and text.

## Tokens

```css
:root {
  --bg: #151517;          /* graphite page */
  --panel: #1c1c1f;       /* panel body */
  --panel-2: #222226;     /* panel head */
  --line: #2d2d32;        /* inner rules, grid */
  --line-2: #3d3d44;      /* panel border, buttons, tags, artboard edges */
  --ink: #ece6da;         /* titles */
  --ink-2: #bdb6aa;       /* body */
  --dim: #8f8a81;         /* nav, labels, sketch lines */
  --accent: #ff5b2e;      /* signal: selected step, caption rule, progress */
  --accent-soft: rgba(255,91,46,.08);

  --sans: "Bai Jamjuree", system-ui, sans-serif;
  --mono: "Azeret Mono", ui-monospace, monospace;

  --gutter: 84px; --space: 6px 10px 14px 20px 28px;
  --art-mob: 136px 286px; --art-dsh: 288px 180px; --art-pst: 184px 260px;

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
}
/* per project, set on each .art: --c1 primary, --c2 highlight, --c3 surface, --c4 text lines */
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Section title | Bai Jamjuree | 30px | 600 | 1 | 0.18em | Upper |
| Project title | Bai Jamjuree | 21px | 600 | 1.35 | 0.16em | Upper |
| Story text | Bai Jamjuree | 14.5px | 400 | 1.6 | 0 | Sentence, max 620px |
| Logo | Bai Jamjuree | 15px | 600 | 1 | 0.14em | Upper, orange slash |
| Labels, nav, meta, buttons | Azeret Mono | 10.5px | 400–500 | 1.6 | 0.18em | Upper |
| Step label | Azeret Mono | 9px | 400 | 1 | 0.18em | Upper |
| Tags | Azeret Mono | 9.5px | 400 | 1 | 0.18em | Upper |
| LIVE tag | Azeret Mono | 8px | 500 | 1 | 0.14em | Upper, dark on orange |

## Implementation notes

1. Draw each layout once as blocks in percentages; fidelity is a class on the board. That keeps every step of a project the same composition, which is the point.

```js
const L = { mob: [['m',8,5,84,6],['m',8,16,84,42],['t',8,63,60,3],['t',8,70,44,3],['b',8,84,84,9]] };
const art = (kind, lvl) => `<div class="art k-${kind} f${lvl}">` +
  L[kind].map(([k,x,y,w,h]) => `<i class="${k}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></i>`).join('') +
  (lvl === 3 ? '<span class="live">LIVE</span>' : '') + '</div>';
```

```css
.f0, .f0 i { border: 1px dashed var(--dim); }
.f0 i.t { border: 0; border-top: 1px dashed var(--dim); height: 0 !important; }
.f1 { background: #26262b; } .f1 i { background: #3a3a41; }
.f2, .f3 { background: var(--c3); } .f2 i.m, .f3 i.m { background: var(--c1); }
.f3 { box-shadow: 0 0 0 3px #0e0e10, 0 0 0 4px var(--line-2), 0 18px 30px -12px rgba(0,0,0,.6); }
```

2. Select on focus, not only on hover. A hover-only reveal hides the story from keyboard and touch users. Bind `mouseenter`, `focus` and `click` to the same `select(i)`, and make arrow keys move focus (which then selects).

3. With three steps, map them to sketch, wireframe and shipped (levels 0, 1, 3), not 0, 1, 2. A three-step project should still end on the device-framed, LIVE board.

Common mistakes:

- Drawing each step as a different picture. The reader must see the same layout getting closer to real.
- Captions that describe the picture ("a blue phone screen"). Each story says what was decided and why, with one number when there is one.
- Letting unselected steps go below .5 opacity; they stop reading as a row.
- Scrolling the page sideways on phones instead of the stage.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
