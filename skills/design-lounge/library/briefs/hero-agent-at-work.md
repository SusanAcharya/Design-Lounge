<!-- Design Lounge Nº 555 · "Agent at work hero" · www.designlounge.live -->

# Agent at work hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The top of a site for Ledgerline, an invented agent that reconciles a company's bank feed against its open invoices. The headline names the job ("Matches every bank line to its invoice. Then shows you why.") and the right half shows the agent doing it, in a panel plainly tagged "Example run": the task as a person wrote it, a five-step plan that ticks off, a log of tool calls and their results, a drafted journal entry as a diff, and a status line that ends on "Waiting for approval … no writes yet". It is honest about what an agent does: the copy and the run both say nothing is posted until a person approves. The detail worth copying is that the first frame is already mid-run, so the panel reads as work in progress rather than an empty terminal.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ ≡ Ledgerline            How it works  Controls  Integrations  Pricing [Book a walkthrough] │ nav 64
├─────────────────────────────────────┬────────────────────────────────┤
│ Reconciliation agent for finance…   │ [Example run] Harbor & Pine…  [↻ Replay] │ 12/16
│                                     ├────────────────────────────────┤
│ Matches every                        │ task sentence 14px            │
│ bank line to its      60/1.02        │ started 06:02 by Priya Anand…  │
│ invoice. Then shows                  ├──────────┬─────────────────────┤
│ you why.  (second sentence ink-2)    │ ✓ Pull…  │ > bank.fetch(…)     │
│ lede 17/1.6, max 470                 │ ◌ Match… │   1,284 lines · …   │
│ [Run it on last month →] [Read the…] │ ○ Flag…  │ > match(line=841…)  │
│ ─────────────────────────            │ ○ Draft… │   INV-2291 …        │
│ 96.1%          4 h                   │ ○ Wait…  │ + Dr 6810 …  - Cr … │
│                                      ├──────────┴─────────────────────┤
│                                      │ • Step 2 of 5 · 1,236 …  ▬▬▬▬░ │ status
└─────────────────────────────────────┴────────────────────────────────┘
grid: 1fr | 620px, gap 56, padding 40 48; panel max-height 640, plan column 236px
```

- `<nav aria-label="Primary">`: logo link, four links, small accent button.
- `<section class="hero" aria-labelledby="h">`
  - Copy `div`: mono eyebrow `p`, `h1` (second sentence in a `span`), lede, button row, `.facts` with two figures.
  - `.run[role=region][aria-label="Example run of the agent"]`: `.rhead` (tag, run title, Replay `button`), `.task` (`p` + `small`), `.body` grid with `ol.plan` and `.log[aria-hidden]`, `.status[role=status][aria-live=polite]` with dot, text, bar.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Log line | event | opacity, translateY | 0, 6px → 1, 0 | 280ms | expo out | none |
| Spinner | step running | rotate | 0 → 360° | 900ms loop | linear (spinner) | static ring |
| Plan step colour | step change | color | ink-3 → ink → ink-2 | 280ms | standard | instant |
| Progress bar | status event | width | previous → new % | 600ms | expo out | instant |
| Status dot | running | opacity | 1 → .35 → 1 | 1.4s loop | standard | static |
| Event clock | load | sequence | 15 events instant, then 600ms + 1.1–1.3s gaps | ≈5.4s | n/a | final state |
| Replay | click | sequence | from empty | ≈8s | n/a | final state |

## States

- **Step idle:** 16px ring `--ring`, text `--ink-3`. **Running:** accent ring with a transparent right edge, spinning; text `--ink`. **Done:** filled `--add` with a dark check; text `--ink-2`. **Waiting:** dashed `--warn` ring; text `--ink`.
- **Log line kinds:** call (accent, `> ` prefix), result (ink-2, 14px indent), flag (warn, indented), journal header (ink), add (green on 8% green), del (red on 8% red).
- **Status running:** pulsing accent dot. **Holding:** amber dot, no pulse, bar full.
- **Replay button:** 1px `--ring` border; hover border `--ink`.
- **Focus-visible:** 2px accent outline, 3px offset.

## Accessibility

- The panel is a labelled region; the visual log is `aria-hidden` because it changes quickly. The status line is `role="status"` with `aria-live="polite"`, so a screen reader hears each step summary, not every tool call.
- The plan is an ordered list; state is visible in text colour and icon shape, and the status line repeats it in words.
- "Example run" is a visible tag, not hover text, so nobody mistakes the panel for their own data.
- Contrast on `--panel`: ink 14.6:1, ink-2 7.0:1, ink-3 5.0:1, accent 8.3:1, warn 11:1, add 10:1, del 7.2:1. Ghost rings `#5D6A78` are 3.1:1 on the page.
- Tab order: logo, four nav links, Book a walkthrough, Run it on last month, Read the audit trail spec, Replay.

## Responsive rules

- **≥1280:** as drawn.
- **1180:** panel 540px, plan column 200px, h1 50px, gap 40px.
- **900–1180:** same two columns.
- **<900 (phone at 390):** body scrolls; one column with copy first and the panel below; the plan sits above the log (full width, hairline under it); the log is 240px tall; the header's spacer hides and the tag never wraps. No sideways scroll: log lines use `pre-wrap` and `break-word`, and calls are written short enough (≤ 46 characters) to stay on one line at 1280.

## Acceptance checklist

**Always**
- [ ] The headline names the job the agent does, in plain words.
- [ ] The run panel carries a visible "Example run" tag.
- [ ] The first frame is mid-run: at least one step done, one running, and a filled log.
- [ ] The run ends on a waiting-for-approval state and does not loop by itself; Replay restarts it.
- [ ] Copy and the final status both say nothing is written before a person approves.
- [ ] The log is `aria-hidden`; the status line is a polite live region.
- [ ] Unfilled controls (ghost buttons, Replay) have rings of at least 3:1.
- [ ] Reduced motion renders the final state immediately.
- [ ] No horizontal scroll at 390 wide.

**This demo**
- [ ] Plan has five steps from "Pull 1,284 lines from the bank feed" to "Wait for approval, then post".
- [ ] Log includes `bank.fetch("CB-0193", month="2026-10")`, three `match(…)` calls, one `flag([…])` with six line numbers, and JE-1031 as a `+ Dr 6810` / `- Cr 1010` pair for €48.50.
- [ ] Status ends "Waiting for approval · 4 entries · 6 flags · 3m 12s · no writes yet".
- [ ] Facts read "96.1%" and "4 h".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: step 1 ("Pull 1,284 lines from the bank feed") is done, step 2 ("Match against 412 open invoices") is spinning, steps 3–5 are idle. The log already shows ten lines (bank fetch, open invoices, match rules, two matches, each with its result) and the status reads "Step 2 of 5 · 1,031 of 1,284 matched" with the bar at 52%.
2. The run continues on its own clock: 1.8s after load a card spend with no invoice is flagged (status 1,236, 68%), then step 3 starts (flag six lines), then step 4 (draft journal JE-1031 shown as a green `+ Dr` line and a red `- Cr` line), each 1.1–1.3s apart. The status text and bar update with each event; the bar width eases over 600ms.
3. Final state, about 5.4s after load: steps 1–4 done (green filled circle with a check), step 5 ("Wait for approval, then post") shows a dashed amber ring, the status dot turns amber and stops pulsing, and the status reads "Waiting for approval · 4 entries · 6 flags · 3m 12s · no writes yet". The run then holds; it never loops by itself.
4. New log lines fade and rise 6px over 280ms (expo out) and push older lines up; the log keeps at most 26 lines.
5. "Replay" in the panel header clears the plan and log and plays every event from the start at 120ms per instant event plus each event's delay (full run about 8s).
6. Hover the primary buttons: brightness 1.08; ghost buttons: ring goes from `#5D6A78` to `--ink`.
7. Reduced motion: the final state is rendered at once, no spinner, no pulse, no line animation. Replay redraws the final state.

## Tokens

```css
:root {
  --bg: #0f1216;        /* page */
  --panel: #151a20;     /* run panel */
  --panel-2: #1b2129;   /* status bar */
  --line: #262e38;      /* hairlines */
  --line-2: #34404d;    /* tag border, bar track */
  --ink: #e9edf1;
  --ink-2: #9aa6b2;     /* secondary, results */
  --ink-3: #7f8b97;     /* idle plan steps, meta */
  --ring: #5d6a78;      /* ghost buttons, idle step rings */
  --accent: #6cb6ff;    /* calls, spinner, bar, primary button */
  --accent-ink: #06223d;
  --add: #7fd19b;       /* done steps, + lines */
  --del: #f2857a;       /* - lines */
  --warn: #f0c36a;      /* example tag, flags, waiting */
  --sans: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --fs-h1: 60px; --fs-lede: 17px; --fs-fact: 22px; --fs-body: 14px; --fs-plan: 13px; --fs-mono: 12px;
  --r-panel: 14px; --r-btn: 8px; --r-tag: 4px;
  --space: 4px 8px 10px 12px 14px 16px 18px 28px 36px 40px 48px 56px;
  --shadow-panel: 0 40px 80px -40px rgba(0, 0, 0, .6);
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-micro: 160ms; --t-line: 280ms; --t-bar: 600ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
|---|---|---|---|---|---|---|
| h1 | Geist | 60px (50 under 1180; clamp(36px,10vw,52px) phone) | 600 | 1.02 | -0.035em | second sentence `--ink-2` |
| Lede | Geist | 17px | 400, last sentence 500 ink | 1.6 | 0 | |
| Facts | Geist | 22px over 13px | 500 / 400 | 1.1 / 1.5 | -0.02em | |
| Logo | Geist | 16px | 600 | 1 | 0 | |
| Task, buttons, nav | Geist | 14px | 400 / 600 | 1.5 | 0 | |
| Plan steps | Geist | 13px | 400 | 1.4 | 0 | |
| Eyebrow, header, log, status | Geist Mono | 12px | 400 / 500 | 1.6 | 0.02em eyebrow | `> ` prefix on calls |

## Implementation notes

**One event list drives everything.** Each entry is `[delayMs, kind, payload]`; the same `apply()` renders the first frame, the timed run and the reduced-motion final state:

```js
const E = [[0,'step',0], [0,'call','bank.fetch("CB-0193", month="2026-10")'], /* … */
           [1300,'step',4], [0,'hold','Waiting for approval · 4 entries · 6 flags · 3m 12s · no writes yet',100]];
function run() {
  let i = 0, t = 0;
  for (; i < E.length && i < 15; i++) apply(E[i]);          // first frame is already mid-run
  for (; i < E.length; i++) { t += E[i][0]; const e = E[i]; timers.push(setTimeout(() => apply(e), t + 600)); }
}
```

**Bottom-anchored log.** Flex column with `justify-content: flex-end` and hidden overflow; new lines append at the end and old ones fall off the top. Cap the node count:

```css
.log { display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
.ln  { animation: in 280ms cubic-bezier(.16,1,.3,1) both; white-space: pre-wrap; word-break: break-word; }
@keyframes in { from { opacity: 0; transform: translateY(6px); } }
```

**Plan icons from one element.** The same `i` is a ring, a spinner (transparent right border plus rotation), a filled check (pseudo-element tick) or a dashed wait ring, chosen by the `li` class.

Common mistakes: an empty terminal on first paint; logs that loop forever and read as fake; tool calls so long they wrap into unreadable fragments; a mask fade on the log that drops old lines below contrast; announcing every log line to screen readers.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
