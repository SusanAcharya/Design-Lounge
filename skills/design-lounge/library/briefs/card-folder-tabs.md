<!-- Design Lounge Nº 306 · "Manila folder with tabs" · designlounge.vercel.app -->

# Manila folder with tabs

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A tabbed document viewer drawn as an architect's manila project folder. Four trapezoid tabs run along the top edge: Brief, Drawings, Budget, Minutes. The selected tab is lighter and sits 5px higher. Below, one sheet stands in the folder's pocket behind a front flap with a thumb notch and a typed sticker. Switch tabs and the current sheet drops into the pocket. The next one rises out of it, each sheet at its own slight tilt. Each sheet has its own content: a memo, a blueprint plan, a cost table, meeting minutes. To the right is the stacked variant, three job folders in a drawer with staggered tabs. Click a back folder and it lifts out and drops in front. Use the main folder for any record with four or five sections. Use the stack for picking a record. The detail worth copying is that the sheets go back into the pocket, behind the front flap, instead of cross-fading.

## Reference behaviour

1. First frame: Brief selected. The memo sheet stands in the pocket, tilted −0.5°, its bottom hidden behind the front flap. The flap sticker reads "Fernhill Library / Job 2291 · Stage 2 · Box 3 of 7"; the counter at right reads "Showing 01 of 04 / Brief". The stack shows Orchard School at the back, Tannery Lane Flats in the middle, Fernhill Library in front.
2. Hover an unselected tab: it rises from 5px down to 1px down, 200ms.
3. Click a tab, or focus the tab list and use Arrow Left/Right (wrapping), Home, End: the old sheet gets `.out` and falls to `translateY(78%)` in 240ms on an ease-in curve, behind the flap. The new sheet is unhidden and rises from `translateY(105%)` to `0` with its own tilt in 420ms on expo out, starting 90ms later. At 260ms the old sheet is set `hidden`.
4. Selection moves `aria-selected` and roving `tabindex`; with the keyboard, focus follows selection. The counter updates.
5. Fast clicking never leaves two sheets up: any sheet still in `.out` is hidden at once when a new switch starts.
6. Stack, hover a back folder: it lifts 12px, 220ms.
7. Stack, click a back folder (its visible tab or name strip), or focus it and press Enter or Space: it lifts 84px above the stack with `z-index: 20` for 230ms. Then every folder that was in front of it moves back one place, it takes place 0, and the `top` values animate over 380ms on expo out. The detail lines of the new front folder fade in; the old front's details fade out.
8. Clicking the front folder does nothing. Its label says "In front." and it has `aria-current="true"`.
9. Reduced motion: no slides, no lift. Sheets swap instantly and the stack reorders instantly.

## Structure

```
1280 × 800, body grid centred, padding 36px 32px
desk #d6dcdf with a top highlight and 4px horizontal hairlines
┌───────────────── 640px ─────────────────┐   72px   ┌──────── 360px ────────┐
│ OSTROM & LUNDE ARCHITECTS · JOB 2291     │          │ STACKED · OTHER JOBS…  │
│ Fernhill Library — stage 2 file (30px)   │          │            ┌2264┐      │ top 0
│ ┌01 BRIEF┐┌02 DRAWINGS┐┌03 BUDGET┐┌04 MIN.┐          │ ┌──────────┘    └───┐  │
│ ┌────────────────────────────────────────┐│          │ │Orchard School┌2278┐│  │ top 86
│ │  ┌──────────── sheet ───────────────┐  ││          │ ├──────────────┘    └┤  │
│ │  │ Client brief, revised  REV C…    │  ││          │ │Tannery┌2291┐       │  │ top 172
│ │  │ TO / FROM / RE                   │  ││          │ ├───────┘    └───────┤  │
│ │  │ The council has agreed…          │  ││          │ │ Fernhill Library   │  │
│ ├──┴─────────────( notch )────────────┴──┤│          │ │ Stage 2 · Concept… │  │
│ │ [Fernhill Library sticker]   SHOWING 01││          │ │ 4 documents 4.97m  │  │
│ └────────────────────────────────────────┘│          │ └────────────────────┘  │
└──────────── folder 520px tall ───────────┘          └──── stack 422px ───────┘
```

- `.page`: grid `minmax(0,640px) minmax(0,360px)`, gap 72px, `align-items: end`.
- Main: `section` labelled by the `h1`. `.folder` (relative, 520px tall, one drop shadow filter for the whole object) contains:
  - `.tabs` `role="tablist"`: four `button role="tab"`, 138 × 42, gap 6px, starting 18px in.
  - `.back`: the folder back, `inset: 40px 0 0`, so the tabs overlap its top 2px.
  - `.pocket`: `left/right 26px, top 66px, bottom 0`, `overflow: hidden`. Four `article.doc role="tabpanel"`, each absolute, 420px tall, `top: 10px`.
  - `.front`: the flap, 150px tall at the bottom, `z-index: 3`, with a 30px-radius thumb notch masked out of its top centre, a sticker, and the polite counter.
- Stack: `section` with a kicker and `.stack` (relative, 422px). Three `button.sf`, each 250px tall, `top: calc((2 - var(--pos)) * 86px)`, `z-index: calc(10 - var(--pos))`. Inside: `.t` tab (132 × 32 at `left: var(--tx)`) and `.b` body (`inset: 30px 0 0`) with name, a `.sub` line and a `.meta` row.

Sheet content:

| Tab | Sheet | Tilt | Content |
|-----|-------|-----:|---------|
| 01 Brief | Client brief, revised · REV C · 18 SEP | −0.5° | To / From / Re rows, then two paragraphs about keeping the 1931 reading room and its north light |
| 02 Drawings | Ground floor plan · DWG A-101 · 1:200 | 0.6° | Blueprint sheet `#27467a`, line plan SVG with room labels in mono |
| 03 Budget | Cost plan, stage 2 · GBP · EXCL. VAT | −0.3° | Five rows and a total "4,973,500" against a "5,000,000 cap", total in the accent |
| 04 Minutes | Design team meeting 14 · 02 OCT · SITE HUT | 0.4° | Four numbered actions, owner initials in the accent |

Stack folders: 2264 Orchard School (`#d3b274`, tab at 196px, "Stage 4 · Tender issued", 18 drawings, Nov 26 site start), 2278 Tannery Lane Flats (`#e9cf9b`, tab at 108px, "Stage 3 · Planning submitted", 42 homes, 12 Dec decision due), 2291 Fernhill Library (`#e4c78e`, tab at 20px, "Stage 2 · Concept signed off", 4 documents, 4.97m of 5m cap).

## Tokens

```css
:root {
  --desk: #d6dcdf;  --desk-2: #c8d0d4;
  --ink: #1d2a33;   --ink-2: #4b5963;  --ink-3: #6b7780;
  --manila: #e4c78e;      /* folder, selected tab */
  --manila-hi: #ecd5a6;   /* flap highlight */
  --manila-lo: #d3b274;   /* unselected tabs */
  --manila-edge: #b8955a; /* flap edge line */
  --sheet: #fbf8f1;  --rule: #e2dccd;
  --accent: #2449a8;      /* selected tab number, focus, owners, budget total */
  --blueprint: #27467a;

  --slab: "Zilla Slab", Rockwell, Georgia, serif;
  --mono: "Overpass Mono", ui-monospace, monospace;

  --folder-h: 520px; --tab-w: 138px; --tab-h: 42px; --tab-cut: 12px; --tab-drop: 5px;
  --pocket-inset: 26px; --sheet-h: 420px; --flap-h: 150px; --notch: 30px;
  --stack-step: 86px; --sf-h: 250px;

  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --in: cubic-bezier(.5, 0, .75, 0);
  --t-out: 240ms; --t-in: 420ms; --t-in-delay: 90ms; --t-tab: 200ms;
  --t-lift: 230ms; --t-restack: 380ms;
  --shadow-folder: drop-shadow(0 22px 22px rgba(29,42,51,.22));
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Kicker | Overpass Mono | 11px | 600 | 1 | 0.16em | UPPER, `--ink-3` |
| Title | Zilla Slab | 30px | 600, then 400 italic | 1.05 | −0.01em | Title |
| Tab | Overpass Mono | 11px | 600 | 1 | 0.12em | UPPER, number 400 |
| Sheet heading | Zilla Slab | 21px | 600 | 1.1 | 0 | sentence |
| Sheet meta | Overpass Mono | 11px | 400 | 1 | 0.06em | UPPER, `--ink-3` |
| Memo rows | Overpass Mono | 12px | 400 | 1.5 | 0.08em labels | UPPER labels |
| Body | Zilla Slab | 15px | 400 | 1.5 | 0 | sentence, 56ch |
| Table | Overpass Mono | 13px | 400 / 600 total | 1 | 0 | tabular nums |
| Sticker name | Zilla Slab | 17px | 600 | 1.2 | 0 | Title |
| Sticker line, counter | Overpass Mono | 11px | 400 | 1.4–1.5 | 0.04–0.08em | — |
| Stack tab | Overpass Mono | 10.5px | 600 | 32px | 0.12em | UPPER |
| Stack name | Zilla Slab | 19px | 600 | 1.2 | 0 | Title |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Tab | hover | translateY | 5px → 1px | 200ms | `--ease` | instant |
| Tab | selected | translateY, background | 5px → 0, `--manila-lo` → `--manila` | 200ms | `--ease` | instant |
| Old sheet | tab change | translateY | 0 → 78% (behind flap) | 240ms | `--in` | hidden at once |
| New sheet | tab change | translateY + rotate | 105% → 0 + own tilt | 420ms, 90ms delay | `--expo` | shown at once |
| Stack folder | hover (back only) | translateY | 0 → −12px | 220ms | `--ease` | instant |
| Stack folder | click | translateY | → −84px, z 20 | 230ms | `--ease` | none |
| All stack folders | after lift | `top` | old slot → new slot | 380ms | `--expo` | instant |
| `.sub`, `.meta` | become front / back | opacity | 0 ↔ 1 | 200ms | `--ease` | instant |

## States

- **Tab resting:** `--manila-lo`, `--ink` text with the number in `#594520`, 5px lower than the selected tab.
- **Tab selected:** `--manila`, `--ink` text, number in `--accent`, `aria-selected="true"`, `tabindex="0"`.
- **Tab focus-visible:** no outline (it would be clipped by the trapezoid). A 2px `--accent` bar 20px in from each side, 8px above the bottom, plus a 3px inset bottom shadow.
- **Sheet hidden:** `hidden` attribute and `visibility: hidden` at `translateY(105%)`.
- **Sheet focus-visible:** 2px `--accent` outline, 3px offset. Each panel has `tabindex="0"` so its content is reachable.
- **Stack back folder:** details hidden (opacity 0), only tab and name strip show; `cursor: pointer`.
- **Stack front folder:** details visible, `cursor: default`, `aria-current="true"`.
- **Stack focus-visible:** 2px `--accent` outline drawn inside both the tab and the body (offset −4px).

## Accessibility

- WAI-ARIA tabs: `role="tablist"` with `aria-label="Documents in the Fernhill Library file"`, `role="tab"` buttons with `aria-controls`, panels with `role="tabpanel"` and `aria-labelledby`. Roving tabindex, automatic activation on arrows, Home and End.
- The blueprint SVG is `role="img"` with a sentence describing the plan.
- The counter on the flap is `aria-live="polite"`, so the new sheet name is announced.
- Stack folders are buttons with labels like "Orchard School, job 2264. Bring to front." A polite live region says "Orchard School is now in front."
- Focus stays on the clicked folder after it moves to the front.
- Contrast: `--ink` on `--manila` 9:1; `--ink` on `--manila-lo` 7.3:1 (unselected tabs keep full ink; position and fill mark the selection, not fading text); tab numbers `#594520` on `--manila-lo` 4.5:1; stack detail text `#3a3a32` on the darkest folder 5.7:1; `--ink` on `--sheet` 13.8:1; `#dfe8f6` on the blueprint 7.6:1; counter `#5e4a22` on `--manila` 5.2:1.
- Tabs are 42px tall; stack strips are 86px tall.

## Responsive rules

- **≥ 1280:** folder 640px and stack 360px side by side, bottoms aligned.
- **1024 (≤ 1100):** one column; folder 640px, stack below at up to 420px wide, 56px gap.
- **768:** same single column.
- **< 640 (375):** body padding 28px 14px; tabs share the width at 25% each with 2px gaps, 9.5px labels, 7px cuts, numbers hidden; pocket inset 12px; sheet padding 20px 18px; flap 130px with the counter hidden; stack tabs 108px wide. Sheet headers wrap their meta under the heading.
- No horizontal scroll at any width.

## Acceptance checklist

### Always

- [ ] Four trapezoid tabs cut with `clip-path`, the selected one lighter and 5px higher.
- [ ] Sheets live in a pocket with `overflow: hidden` behind a front flap; switching drops the old one in and raises the new one out.
- [ ] Only one sheet is visible after any sequence of fast clicks.
- [ ] Full WAI-ARIA tabs keyboard model with roving tabindex.
- [ ] Each sheet has its own slight tilt between −0.6° and +0.6°.
- [ ] The flap has a thumb notch made with a radial-gradient mask, so the sheet shows through it.
- [ ] Stacked variant: back folders show only their tab and name; clicking one lifts it out and drops it in front; slots are pure CSS from one `--pos` variable.
- [ ] Polite announcements for the sheet and the stack change.
- [ ] Reduced motion swaps instantly with no slides.

### This demo

- [ ] Desk `#d6dcdf`, manila `#e4c78e`, sheet `#fbf8f1`, accent `#2449a8`.
- [ ] Tabs "01 Brief", "02 Drawings", "03 Budget", "04 Minutes"; Brief starts selected.
- [ ] Budget total "4,973,500" against "5,000,000 cap" in the accent.
- [ ] Stack order on load: 2264 Orchard School back, 2278 Tannery Lane Flats middle, 2291 Fernhill Library front, 86px apart.
- [ ] Sticker "Fernhill Library / Job 2291 · Stage 2 · Box 3 of 7".

## Implementation notes

**Drop in, rise out.** Two classes and one timer. Hidden sheets wait below the pocket:

```css
.pocket { position: absolute; left: 26px; right: 26px; top: 66px; bottom: 0; overflow: hidden; }
.doc { position: absolute; left: 0; right: 0; top: 10px; height: 420px; transform: translateY(105%); visibility: hidden; }
.doc.on { transform: translateY(0) rotate(var(--tilt, 0deg)); visibility: visible;
  transition: transform 420ms 90ms var(--expo), visibility 0s 90ms; }
.doc.out { visibility: visible; transform: translateY(78%); transition: transform 240ms var(--in); }
```

```js
document.querySelectorAll('.doc.out').forEach(d => { d.classList.remove('out'); d.hidden = true; });
oldP.classList.remove('on'); oldP.classList.add('out');
timer = setTimeout(() => { oldP.classList.remove('out'); oldP.hidden = true; }, 260);
newP.hidden = false; void newP.offsetWidth; newP.classList.add('on');
```

**Stack slots from one variable.** JS only writes `--pos` and `data-pos`:

```css
.sf { position: absolute; left: 0; right: 0; height: 250px;
  top: calc((2 - var(--pos)) * 86px); z-index: calc(10 - var(--pos));
  transition: top 380ms var(--expo), transform 220ms var(--ease); }
.sf.lift { transform: translateY(-84px) !important; }
.sf:not([data-pos="0"]) .sub, .sf:not([data-pos="0"]) .meta { opacity: 0; }
```

**Thumb notch.**

```css
.front { mask: radial-gradient(circle 30px at 50% 0, transparent 29px, #000 30px); }
```

Common mistakes:

- Cross-fading sheets. The pocket is the point; sheets travel through the flap.
- Putting the tabs inside the folder back with `overflow: hidden`; they get clipped. They sit in their own layer above it.
- `outline` focus rings on clip-path tabs. They are cut off; draw an inner bar.
- Inverting the stack so the front folder is at the top. The front folder is lowest; back folders peek above it.
- Showing every line of every back folder. Front folders' tabs then sit on top of back folders' text.
- Naming component classes so they collide with utility classes elsewhere in the page.

Rebuild order:

1. Desk, two-column page, title.
2. Folder back, tabs with `clip-path`, flap with sticker and notch.
3. Pocket and four sheets with their content.
4. Tab logic: select, drop and rise, keyboard, counter.
5. Stack: three folders on `--pos`, hover lift, click to front, details fade.
6. Live regions, reduced motion, single column and 375px tabs.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
