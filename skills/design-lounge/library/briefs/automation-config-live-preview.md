<!-- Design Lounge Nº 175 · "Automation builder with live preview" · www.designlounge.live -->

# Automation builder with live preview

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens and keep the 2px ink borders and hard offset shadows.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from usearticle.com: the "configure an automation, watch it come alive" section, where a real settings form sits beside a sticky dashboard card that redraws as you click. This version is Tidepost, a fictional service that writes and sends a harbour club newsletter on a schedule. The left column is three form cards (Schedule, Sections, Voice). The right column is a sticky preview with a Summary tab and a Calendar tab, plus one big orange call to action whose label carries the live total. The feeling is a friendly tool that is already running. The detail worth copying is that the preview headline reads as a sentence, "24 issues over 12 weeks", with the numbers in ink and the connecting words dimmed, so one glance gives the result of every setting.

## Structure

```
1280 × 800, page bg #FFF6E9, max-width 1180, padding 40/40/64
┌──────────────── form column (1fr) ─────────────┐ 40 ┌── preview 480px (sticky top 24) ─┐
│ [● TIDEPOST · ISSUE BUILDER]  pill, hard 2px   │    │ [Summary|Calendar] Updates as…   │
│ Set the run once. Watch it fill in.   48/800   │    │ ┌─6px green top border─────────┐ │
│ lede 18px, 52ch                                 │    │ │ ● LIVE      The Low Water Post│ │
│ ┌ card: Schedule ───────────────────────────┐   │    │ │ 24 issues over 12 weeks  38px │ │
│ │ [ic] Schedule                              │   │    │ │ Monday and Thursday · salty   │ │
│ │ CADENCE   [Weekly][Twice a week][Weekdays] │   │    │ │ PROGRESS          3 / 24 SENT │ │
│ │ RUN LENGTH [4][8][12][26] weeks            │   │    │ │ [█████░░░░░░░░░░░░░░] 10px    │ │
│ └────────────────────────────────────────────┘   │    │ │ [3 sections][2/wk][4 min]     │ │
│ ┌ card: Sections            3 / 6 ──────────┐   │    │ │ [Salty][900w][English][3 sec] │ │
│ │ [☑ Tide tables ][☑ Boat of the week]       │   │    │ │ NEXT ISSUES     ON SCHEDULE   │ │
│ │ [☐ Reader letters][☑ Harbour notes]        │   │    │ │ ● title ……………… Sent Thu 8 Oct│ │
│ │ [☐ Weekend forecast][☐ Gear swap]          │   │    │ └───────────────────────────────┘ │
│ └────────────────────────────────────────────┘   │    │ [ Start this run · 24 issues ] 52 │
│ ┌ card: Voice  tone chips + length slider ──┐   │    │  fine print 11px mono             │
└────────────────────────────────────────────────┘    └───────────────────────────────────┘
```

- Page: `main.wrap`, CSS grid `minmax(0,1fr) 480px`, gap 40px, `align-items: start` (sticky needs this).
- Form column: `section` labelled by the `h1`. Each card is a `div.card` with an `h2`.
- Radio groups: `div[role=radiogroup]` with `button[role=radio]` children. Tiles: `button[role=checkbox]` in a `role=group`.
- Preview: `aside` labelled "Live preview of the run", a `role=tablist` with two tabs, one `role=tabpanel` whose `data-view` switches content.
- CTA: a real `button`, full width of the aside.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Option button hover | pointer over | transform, box-shadow | none → translate(-1px,-1px) + 2px hard shadow | 150ms | standard |
| Checked tile | toggled on | transform, box-shadow, border | rule border → ink border + 2px hard shadow, lifted 1px | 150ms | standard |
| Progress fill | total changes | width | old % → new % | 400ms | standard |
| Changed region | any input | background | #ffe9b8 → transparent | 600ms | standard |
| CTA hover | pointer over | transform, box-shadow | 4px shadow → translate(2px,2px) + 2px shadow | 150ms | standard |
| CTA active | press | transform, box-shadow | → translate(4px,4px), no shadow | 150ms | standard |

Reduced motion: remove every transition and the flash animation. Values still update instantly; nothing else is lost.

## States

- Option resting: surface fill, 2px ink border, 40px tall. Hover: lift 1px, 2px hard shadow. Selected (`aria-checked=true`): ink fill, surface text.
- Tile unchecked: 2px `--rule` border, empty box. Hover: border becomes ink. Checked: ink border, filled ink box with white tick, 2px hard shadow.
- Last checked tile: click does not uncheck; it flashes amber.
- Tab selected: ink fill inside a 4px-padded ink-bordered track. Unselected: transparent.
- CTA: orange fill, 2px ink border, 4px hard shadow; hover presses halfway, active presses flat.
- Focus-visible everywhere: 2px `--primary` outline, 3px offset.
- Saved: fine print text swaps to the confirmation. No disabled state on this frame.

## Accessibility

- Each radio group has `aria-labelledby` pointing to its mono label. Roving tabindex: only the checked radio is in the tab order; ArrowLeft/Up and ArrowRight/Down move and select, wrapping.
- Tiles are `role=checkbox` buttons with `aria-checked`; Space and Enter toggle (native button behaviour).
- The slider is a native `input[type=range]` with a `label` and an `output for`.
- The preview headline is `aria-live="polite"` so a screen reader hears "130 issues over 26 weeks" after each change. Do not make the whole card live.
- Progress is `role=progressbar` with `aria-valuenow`. The calendar grid is `role=img` with a label "130 send days across 26 weeks".
- Tabs: `role=tablist`, `aria-selected`, `aria-controls`, roving tabindex, Left/Right switch.
- Contrast: `#5a5146` on `#fffdf8` is above 7:1; `#7d7265` on `#fffdf8` is about 4.6:1 for 11px mono labels. The dim headline words (`#b9ad9c`) are decorative contrast inside a 38px heading and the live region reads the full sentence.
- Hit targets: options 40px tall, tiles at least 56px, CTA 52px.

## Responsive rules

- ≥1280: as drawn, 1180px max width.
- 1024: the form column narrows; preview stays 480px and sticky.
- ≤980: one column `minmax(0,1fr)`; the preview drops below the form and stops being sticky.
- <560: padding 24px 16px, h1 36px, tiles one column, hints lose the 48px indent, preview headline 30px, the "Updates as you tweak" note and run dates hide.
- Never allow horizontal scroll at 375px. Use `minmax(0,1fr)` not `1fr` for the single column, or the preview's min-content width pushes the page wide.

## Acceptance checklist

### Always

- [ ] Two columns at desktop: form left, preview right, preview `position: sticky` 24px from the top.
- [ ] Every form control updates the preview immediately, without a submit button.
- [ ] The preview headline is one sentence with numbers emphasised and connecting words dimmed.
- [ ] Changed preview regions flash for 600ms; reduced motion removes it.
- [ ] All borders are 2px ink; elevated items use a hard offset shadow with zero blur.
- [ ] Radio groups use roving tabindex and arrow keys; tabs do too.
- [ ] At least one checkbox stays checked.
- [ ] CTA label includes the live total.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] First frame reads "24 issues over 12 weeks" and "3 / 24 sent", bar at 13%.
- [ ] Weekdays + 26 weeks gives "130 issues over 26 weeks" and the CTA "Start this run · 130 issues".
- [ ] Six section tiles; Tide tables, Boat of the week, Harbour notes checked; counter "3 / 6".
- [ ] Calendar shows at most 12 rows and "+ 14 more weeks" for a 26-week run.
- [ ] CTA background `#ff5a1f`, card top border 6px `#2fae74`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 1280×800: eyebrow pill, 48px headline "Set the run once. Watch it fill in." with the second sentence orange on a butter marker stripe, lede, then the Schedule card and the top of Sections. On the right, the Summary tab is selected and the card shows "24 issues over 12 weeks", "Monday and Thursday · salty voice", progress "3 / 24 sent", a bar at 13%, three stats, four chips, and five next issues (two sent with green dots).
2. Cadence is a radio group: Weekly (1), Twice a week (2, selected), Weekdays (5). Run length is a radio group: 4, 8, 12 (selected), 26 weeks. Picking any option recomputes total = cadence × weeks, rewrites the headline, sub line, progress, bar width, next issues dates, calendar, and the CTA label "Start this run · N issues".
3. Sections are six checkbox tiles in a 2-column grid. Tide tables, Boat of the week and Harbour notes start checked. Toggling a tile updates the "3 / 6" counter, the sections stat, the chip and the next-issues titles, which rotate round-robin through checked sections in DOM order. The last checked tile cannot be unchecked; clicking it flashes it instead.
4. Voice is a radio group (Plain, Salty, Warm, Brisk; Salty selected). It changes the sub line and the first chip (butter fill).
5. Length is a range 300–2000 step 100, default 900. The output reads "900 words". It changes the "min read" stat (words ÷ 220, rounded, min 1) and the "900w" chip.
6. Whatever region changed flashes a pale amber background for 600ms so the eye finds it.
7. Calendar tab: a 7-column grid (M–S) of up to 12 week rows. Send days are ink blocks, the first three sent days are green, other days are outlined. Below: "+ 14 more weeks" when the run is longer than 12, else "Whole run shown".
8. Scrolling the page keeps the preview pinned 24px from the top while the form scrolls past.
9. Clicking the CTA changes the fine print to "Run saved · first issue goes out Thu 8 Oct". No navigation.

## Tokens

```css
:root {
  /* colour */
  --bg: #fff6e9;        /* page, warm cream */
  --surface: #fffdf8;   /* cards and controls */
  --ink: #1b1712;       /* text, 2px borders, hard shadows, selected fill */
  --ink-2: #5a5146;     /* body copy, hints */
  --ink-3: #7d7265;     /* mono labels, meta */
  --rule: #eadcc6;      /* unchecked tile border, stat border, dividers */
  --primary: #ff5a1f;   /* CTA, headline accent, slider thumb, focus */
  --live: #2fae74;      /* live dot, progress fill, sent marks, card top */
  --live-soft: #d8f5e6; /* live pill background, dot halo */
  --butter: #ffd84d;    /* marker stripe, voice chip */
  --dim: #b9ad9c;       /* the connecting words in the big headline */
  /* type */
  --display: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;
  /* shape */
  --r-card: 14px; --r-ctl: 9px; --r-cta: 12px;
  --border: 2px solid var(--ink);
  --hard: 4px 4px 0 var(--ink);
  --hard-sm: 2px 2px 0 var(--ink);
  /* space: 4 8 10 12 16 18 20 22 28 40 */
  /* motion */
  --micro: 150ms; --layout: 400ms; --flash: 600ms;
  --ease: cubic-bezier(.2,.7,.2,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Eyebrow pill | DM Mono | 12px | 500 | 1 | 0.08em | upper |
| H1 | Bricolage Grotesque | 48px | 800 | 1.0 | -0.03em | sentence |
| Lede | Bricolage Grotesque | 18px | 400 | 1.55 | 0 | sentence, `--ink-2` |
| Card title h2 | Bricolage Grotesque | 18px | 700 | 1.3 | -0.01em | sentence |
| Hint | Bricolage Grotesque | 14px | 400 | 1.5 | 0 | `--ink-2`, indented 48px |
| Field label | DM Mono | 11px | 500 | 1 | 0.08em | upper, `--ink-3` |
| Option button | Bricolage Grotesque | 14px | 600 | 1 | 0 | sentence |
| Tile title / desc | Bricolage Grotesque | 15px 700 / 13px 400 | | 1.35 | 0 | |
| Preview headline | Bricolage Grotesque | 38px | 800 | 1.02 | -0.03em | numbers `--ink`, words `--dim` |
| Stat number | Bricolage Grotesque | 22px | 800 | 1.1 | 0 | |
| Stat label, chips, dates | DM Mono | 11px | 400–500 | 1.4 | 0 | lower |
| CTA | Bricolage Grotesque | 17px | 800 | 1 | 0 | sentence, white |

Mono is only for labels, counts and dates. All prose and controls are in the grotesque.

## Implementation notes

The press-in hard shadow. Move the element by the amount the shadow shrinks, so the bottom-right edge stays put:

```css
.cta { border: 2px solid var(--ink); box-shadow: 4px 4px 0 var(--ink);
  transition: transform 150ms var(--ease), box-shadow 150ms var(--ease); }
.cta:hover  { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--ink); }
.cta:active { transform: translate(4px, 4px); box-shadow: none; }
```

One render function, one state object. Every input writes to state and calls `render(changedIds)`; render recomputes everything and flashes only the ids passed:

```js
const st = { cad: 2, weeks: 12, voice: 'Salty', len: 900 };
function flash(el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
function render(changed = []) {
  const total = st.cad * st.weeks;
  big.innerHTML = `${total} <span class="dim">issues over</span> ${st.weeks} <span class="dim">weeks</span>`;
  barFill.style.width = Math.round(3 / total * 100) + '%';
  cta.textContent = `Start this run · ${total} issues`;
  changed.forEach(id => flash(document.getElementById(id)));
}
```

The `void el.offsetWidth` line restarts the CSS animation when the same region changes twice in a row. Without it the second flash does nothing.

Sticky needs the grid to align items to the start. With the default `stretch`, the aside is as tall as the form and sticky has no room to move:

```css
.wrap { display: grid; grid-template-columns: minmax(0,1fr) 480px; gap: 40px; align-items: start; }
.side { position: sticky; top: 24px; }
```

Common mistakes:

- A "Preview" button. The point is that there is no button; it is live.
- Soft blurred shadows. These are hard 0-blur offsets in ink.
- Animating the numbers with a counting tween on every click. The flash is enough and stays calm.
- Making the whole preview `aria-live`; screen readers then read twenty lines on each click.
- Rounded pills everywhere. Controls are 9px radius, cards 14px, only the eyebrow and live pill are fully round.
- Letting the calendar grow to 26 rows and push the CTA off screen. Cap at 12.

Rebuild order:

1. Page grid and the sticky aside.
2. The three form cards with static markup.
3. State object and render, headline first.
4. Progress, stats, chips, next issues.
5. Calendar tab.
6. Keyboard behaviour for radios and tabs.
7. Flash and reduced motion.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
