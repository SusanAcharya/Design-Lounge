<!-- Design Lounge Nº 673 · "Goal setup that builds your plan" · www.designlounge.live -->

# Goal setup that builds your plan

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The first-run setup of Fernway, a fictional movement coach. Three short steps ask what you want (large goal chips, up to three), how active you are now (a slider over a five-step staircase), and which days suit you (a week row with suggested days marked by a dot, plus a reminder time). Then a deep pine "Your plan" card assembles itself from those answers, one line at a time, ending with a four-week bar ramp. The language is Material 3 Expressive: tonal surfaces, a 60px pill primary, and selection shown by shape morph (20px corners become a 32px pill) as well as fill. Playfair Display carries the questions with an italic turn on the last words; Public Sans does the work. The detail worth copying is that the summary is written from the answers ("Four weeks to *walk further and sleep better*.") and the first session date is real.

## Structure

```
390 × 844, no page scroll; steps stack inside the stage
┌──────────────────────────────────────┐
│ 54 safe area                         │
│ (<)  ▬▬▬▬ ▬▬▭▭ ▭▭▭▭          Skip    │  top 56: back 44, 3 × 6px segments
│ STEP 1 OF 3                   13px   │
│ What would you like          34px    │  Playfair 500
│ more of?                     italic  │
│ Pick up to three. …           15px   │
│ ╭────────────╮ ╭────────────╮        │  chips 2 × 1fr, gap 10, 112 tall
│ │ icon    (v)│ │ icon    (v)│        │  r20 idle → r32 selected
│ │ Walk further│ │ Sleep better│       │
│ ╰────────────╯ ╰────────────╯        │
│ ... 3 rows                           │
│ 2 of 3 picked                        │
│                                      │
│ (          Continue  →           )   │  60 tall pill, 20px sides
│ 34 home indicator                    │
└──────────────────────────────────────┘
Plan step: the card replaces the content (r32, pine, 22/20 padding)
```

- `.top`: Back `<button>` (hidden on step 1 and the plan), `role="progressbar"` with `aria-valuenow`, Skip `<button>`.
- `<main class="stage">` with four `<section class="step" aria-labelledby>`; only `.on` is visible, the rest are `visibility:hidden` and `aria-hidden`.
- Step 1: `.chips` of `<button aria-pressed>`, an `aria-live` count.
- Step 2: `aria-hidden` stairs, name and description, native `<input type="range" min=1 max=5>` with `aria-valuetext`.
- Step 3: `.week[role=group]` of day buttons with `aria-pressed` and labels ("Monday, suggested"), the hint, `.times[role=group]` of three buttons.
- Plan: a visually hidden `<h1>Your plan</h1>`, `.card` built from the answers, Edit answers `<button>`.
- `.foot` with the one primary `<button>`; a hidden `aria-live` region.

## Motion

| What | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---|---|---|---|
| Step in | step change | `opacity`, `translateX` | 0, 28px → 1, 0 | 280ms / 420ms | `--std` / `--emph` | opacity 80ms | 200ms crossfade |
| Step out | step change | `opacity`, `translateX` | 1, 0 → 0, −28px | 280ms / 420ms | same | 0 | 200ms crossfade |
| Progress | step change | `scaleX` per segment | → 0, .5 or 1 | 480ms | `--emph` | 0 | instant |
| Chip select | tap | `border-radius`, `background` | 20 → 32px, surface → pine | 320ms / 200ms | `--emph` / `--std` | 0 | instant |
| Tick | chip select | `opacity`, `scale` | 0, .4 → 1, 1 | 160ms / 260ms | `--expo` | 0 | instant |
| Stairs | slider input | `background` | tonal ↔ pine | 240ms | `--std` | 0 | instant |
| Day / time select | tap | `border-radius`, `background` | 24 → 38px / 20 → 36px | 320ms | `--emph` | 0 | instant |
| Plan lines | plan opens | `opacity`, `translateY` | 0, 14px → 1, 0 | 520ms | `--expo` | 120 + i × 110ms | 200ms fade, no delay |
| Ramp bars | plan opens | `scaleY` (origin bottom) | 0 → 1 | 640ms | `--expo` | 670 + j × 70ms | 200ms fade |
| Primary press | `:active` | `scale`, `border-radius` | 1, pill → .98, 20px | 160ms | `--std` | 0 | same |

## States

- **Chip idle**: surface fill, 1.5px `--rule` inset outline, r20, empty tick ring in `--edge`.
- **Chip selected**: pine fill, on-pine text, r32, tick disc on-pine with a pine check, `aria-pressed="true"`.
- **Limit reached**: count reads "3 of 3 picked. Unpick one to swap."; further taps announce instead of selecting.
- **Level**: N of 5 stairs pine; the slider fill matches (`--p` = (N − 1) / 4).
- **Day suggested**: 6px pine dot under the name (on-pine when selected). **Day selected**: pine pill r38.
- **Primary disabled**: tonal fill, ink-2 text (5.6:1), when step 1 has no goals or step 3 no days.
- **Plan**: Back and Skip hidden, progress full, primary "Start my plan".
- **Focus-visible**: 3px pine outline at 3px offset; headings receive programmatic focus without a ring.

## Accessibility

- Each step is a `<section>` labelled by its question; inactive steps are `visibility:hidden` and `aria-hidden="true"`, so neither focus nor reading reaches them.
- On each step change focus moves to the new question (`tabindex=-1`), not on first load.
- Chips, days and times are buttons with `aria-pressed`; days have full names ("Saturday, suggested").
- The level slider has `aria-valuetext` "Light walks. A short walk most days, not much else."
- The progress bar is `role="progressbar"` with `aria-valuenow` 1–3.
- A polite live region reads the plan summary: "Your plan: 3 sessions a week of 20 minutes, starting Sat 7 Nov." The ramp has an `aria-label` with the four totals.
- Contrast: ink-2 on ground 6.2:1, on-pine on pine 8.4:1, pine-2 on pine 6.1:1, ink-2 on tonal 5.6:1; non-text: tick ring and slider track 3.4:1 on surface.
- Hit targets: chips 112px tall, days 76px tall by 45px, times 72px, Back / Skip 44px, primary 60px.

## Responsive rules

- At 360 wide: chips stay two columns (152px each); questions drop to 30px; day pills shrink with `minmax(0,1fr)` to 40px wide and keep the three-letter name at 13px.
- Short phones (< 760 tall): the app keeps `min-height:760px` and each step scrolls inside the stage; the primary stays pinned.
- Tablet: the column caps at 430px and centres; do not spread the chips into three columns, the thumb reach is the point.
- Hidden steps translate 28px; the stage clips (`overflow:hidden`) so `scrollWidth` stays 390.

## Acceptance checklist

**Always**
- [ ] Exactly three question steps, each one decision, with a segmented progress bar and Skip on every step.
- [ ] Goals are large two-column chips; selection changes shape as well as colour.
- [ ] The level is a native range input with a visual that changes with it.
- [ ] Suggested days follow the level and are marked, not forced; the user can toggle any day.
- [ ] Skip lands on a complete plan built from defaults, never an empty card.
- [ ] The plan card's sentences are composed from the answers and the first session is a real upcoming date.
- [ ] Plan lines build one at a time, then the bars; reduced motion fades them in together.
- [ ] Inactive steps are `visibility:hidden`; focus moves to each new question.
- [ ] One primary per screen, in the bottom third.

**This demo**
- [ ] Fernway; six goals; Walk further and Sleep better preselected; three max.
- [ ] Levels: Mostly sitting 15 min, Light walks 20, Active a few days 25, Active most days 30, Training hard 35.
- [ ] Today is Fri 6 Nov 2026: with Saturday chosen the first session is Sat 7 Nov, otherwise the first chosen weekday of the week of 9 Nov.
- [ ] Weekly ramp = sessions × minutes × (1 + 0.12 × week), rounded to 5: 60, 65, 75, 80 for the defaults.
- [ ] Reminder times Morning 7:30, Lunch 12:30, Evening 18:30.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state, step 1 of 3: progress segment 1 at half, Back hidden, Skip top right. "What would you like *more of?*" with six 2-column chips (Walk further, Sleep better, Ease back pain, Build strength, Feel calmer, Run 5 km). Walk further and Sleep better are already selected. "2 of 3 picked". **Continue** at the bottom.
2. Tap a chip: it fills pine, its corners morph from 20px to 32px (320ms emphasized curve), the tick disc pops its check (scale .4 → 1, 260ms). A fourth pick is refused and announced: "You can pick three. Unpick one to swap." With none picked, Continue is disabled.
3. Continue: step 1 slides out 28px left and fades, step 2 slides in from 28px right (420ms); the first progress segment fills, the second goes to half; Back appears; focus moves to the new question.
4. Step 2, "How active are you *right now?*": five rising bars (20/38/56/76/100% of 150px) with the first N filled; a Playfair level name and one line ("Light walks / A short walk most days, not much else."); a slider 1–5 with end labels "Mostly sitting" and "Training hard". Sliding changes bars, name and line, and pre-selects the suggested days for step 3.
5. Step 3, "Which days *suit you?*": seven 76px day pills (Mon…Sun). Suggested days carry a 6px dot (level 2: Mon, Wed, Sat; level 1: Mon, Thu; level 4: Mon, Tue, Thu, Sat; level 5: Mon, Tue, Thu, Fri, Sun). A tonal hint reads "For light walks we suggest 3 days, marked with a dot." Below, "Remind me in the" with Morning 7:30 / Lunch 12:30 / Evening 18:30. Days toggle freely; with none, the primary disables. The primary reads **Build my plan**.
6. Build my plan (or Skip at any step): all three segments fill, Back and Skip hide, the plan card builds: kicker "Your plan · 4 weeks", headline, chips for the goals and the level, "3 sessions a week / Mon, Wed and Sat, mornings at 7:30", "20 minutes each, brisk walk and stretch / First one Sat 7 Nov, then it grows about 12% a week", then four bars W1 · 60m, W2 · 65m, W3 · 75m, W4 · 80m. Each line rises 14px and fades in, 110ms apart after 120ms; bars grow from the bottom 70ms apart after the last line.
7. The primary becomes **Start my plan** (reads "Plan saved" for 1.4s on tap). **Edit answers** returns to step 1 with every answer kept.

## Tokens

```css
:root {
  --bg: #EEF0E6;          /* sage paper ground */
  --surface: #F8F9F3;     /* idle chips, day pills, level card */
  --tonal: #DCE7DE;       /* idle stairs, hint plate, disabled primary */
  --ink: #18231F;         /* text, 15:1 on surface */
  --ink-2: #4F5B55;       /* secondary text, 6.2:1 on --bg */
  --edge: #7C8A83;        /* tick ring, slider track, 3.4:1 on surface */
  --rule: #D4DAD0;        /* 1.5px inset outline on idle chips */
  --pine: #1F4D45;        /* the one accent: selected, progress, primary, plan card */
  --on-pine: #F4F1E6;     /* text on pine, 8.4:1 */
  --pine-2: #BFD3C8;      /* progress track, secondary text on pine (6.1:1) */
  --pine-3: #2D6359;      /* goal chips inside the plan card */
  --hairline-on-pine: rgba(244, 241, 230, .2);

  --serif: "Playfair Display", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;
  --fs-question: 34px; --fs-level: 28px; --fs-plan-title: 28px;
  --fs-button: 17px; --fs-chip: 16px; --fs-body: 15px; --fs-day: 14px;
  --fs-kicker: 13px; --fs-small: 12px;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px;
  --r-chip: 20px; --r-chip-on: 32px; --r-day: 24px; --r-day-on: 38px;
  --r-card: 32px; --r-hint: 20px; --r-pill: 999px;

  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --emph: cubic-bezier(0.2, 0, 0, 1);      /* M3 emphasized */
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-micro: 160ms; --t-colour: 200ms; --t-tick: 260ms; --t-fade: 280ms; --t-morph: 320ms;
  --t-stair: 360ms; --t-step: 420ms; --t-progress: 480ms; --t-rise: 520ms; --t-bar: 640ms;
  --stagger: 110ms; --bar-stagger: 70ms;
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Case |
|---|---|---|---|---|---|
| Question | Playfair Display | 34px / 1.08 | 500, last words italic pine | −0.01em | sentence |
| Level name | Playfair Display | 28px / 1.1 | 500 | 0 | sentence |
| Plan headline | Playfair Display | 28px / 1.12 | 500, goals italic | 0 | sentence |
| Primary | Public Sans | 17px | 600 | 0 | sentence |
| Chip label, fact title | Public Sans | 16px / 1.2 | 600 | 0 | sentence |
| Body, hint, level line | Public Sans | 15px / 1.45 | 400 | 0 | sentence |
| Day, time | Public Sans | 14–15px | 600 | 0 | "Mon" |
| Fact detail, count | Public Sans | 14px | 400 | 0 | sentence |
| Kicker | Public Sans | 13px | 600 | 0.08em | upper |
| Plan chips, bar labels | Public Sans | 13px / 12px | 600 / 400 | 0 | — |

## Implementation notes

1. **Stacked steps that can't leak.** Keep every step in the DOM, but let only one be visible; delay `visibility` on the way out so the slide can finish, and drop the delay on the way in.

```css
.stage { position: relative; flex: 1; overflow: hidden; }
.step { position: absolute; inset: 0; visibility: hidden; opacity: 0; transform: translateX(28px);
  transition: opacity 280ms var(--std), transform 420ms var(--emph), visibility 0s 420ms; }
.step.on { visibility: visible; opacity: 1; transform: none;
  transition: opacity 280ms var(--std) 80ms, transform 420ms var(--emph); }
.step.out { transform: translateX(-28px); }
```

2. **Stagger from a custom property.** Write each card line with its index and let CSS do the delay; the bars add their own index on top so they start after the last line.

```css
.card > * { animation: rise 520ms var(--expo) backwards; animation-delay: calc(var(--i) * 110ms + 120ms); }
.ramp i { transform-origin: bottom; animation: bar 640ms var(--expo) backwards;
  animation-delay: calc(var(--i) * 110ms + var(--j) * 70ms + 160ms); }
@keyframes rise { from { opacity: 0; transform: translateY(14px) } }
@keyframes bar { from { transform: scaleY(0) } }
```

3. **Sentences from answers.** Keep a short phrase per goal and join with an Oxford-free "and"; the first session looks for the weekend before next week.

```js
const list = (a) => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
const title = `Four weeks to <em>${list(goals.map((g) => g.phrase))}</em>.`;
const first = days.find((d) => d > 4) ?? days[0];           // today is Friday (index 4)
const date = first >= 5 ? `${DAYS[first]} ${first === 5 ? 7 : 8} Nov` : `${DAYS[first]} ${9 + first} Nov`;
```

Common mistakes: an instruction screen before the first question, a plan card with generic copy that ignores the answers, chips that only change colour (fails for colour-blind users and looks flat), and hidden steps that are merely translated off-canvas so their text still reads and overflows.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
