<!-- Design Lounge Nº 215 · "Deploy status notification" · www.designlounge.live -->

# Deploy status notification

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The deploy notification of "Pipewright", a fictional hosting platform, shown in the bottom-right corner of a browser IDE after a push. It follows one commit through Queued, Build, Checks and Live. Each stage gets a segment with its duration, the newest log line slides in underneath, and three checks tick off while they run. It ends on a lime "Live on preview" with Open preview and Rollback. Rollback asks once, inline, then re-aliases. The look is graphite with one acid-lime accent, used only for "live" and the primary button. A humanist sans names things and a wide mono reports what machines say. The detail worth copying is that the toast never changes size by surprise. The stepper is always four segments, the log is always one 20px line, and the checks list opens and closes with a height transition only during the Checks stage.

## Structure

```
1280 × 800 (Lounge draws the browser chrome)
┌──────────────────────────────────────────────────────────────────────┐
│ ▶ Pipewright  fernhill / atlas-web / feat/cart-currency        44px  │
├──────────────┬───────────────────────────────────────────────────────┤
│ EXPLORER     │ currency.ts | coupon.ts | pipewright.toml            │
│ src          │ 14 export function switchCurrency(...)               │
│  cart        │ 17 // keep the coupon ...     (lime-tinted lines)    │
│  currency.ts │ ...                                                   │
│  ...  232px  │                 ┌───────────────────────────────────┐ │
│              │                 │ ▶ Pipewright [PREVIEW]  now  — ×  │ │ toast 404w
│              │                 │ ◌ Building atlas-web        0:03  │ │ right 24
│              │                 │ ┌ MO fix(cart): keep coupon… [a3f9c1e⧉]│ bottom 56
│              │                 │ ▔▔▔▔▔ ▔▔▔▔▔ ▔▔▔▔▔ ▔▔▔▔▔            │ │ 4 × 3px
│              │                 │ Queued Build Checks Live          │ │
│              │                 │ 1.2s   0:02  —      —             │ │
│              │                 │ › compiling 214 modules           │ │ 20px log
│              │                 │ [checks list, Checks stage only]  │ │
│              │                 │ [url row + Open preview | Rollback]│ │ live only
│              │                 └───────────────────────────────────┘ │
├──────────────┴───────────────────────────────────────────────────────┤
│ ● deploying a3f9c1e  feat/cart-currency  TS 5.6        ↑ Push again  │ 32px
└──────────────────────────────────────────────────────────────────────┘
```

- The toast is a `section role="status"` labelled by its title. The title is an `h2` holding the spinner, the text and the elapsed time.
- The commit card is a `div`. The hash is a `button` labelled "Copy commit hash a3f9c1e".
- The stepper is an `ol`. The current step has `aria-current="step"`.
- The log line is `aria-hidden`, because the live region carries the important parts.
- The checks are a `ul`, the actions are buttons, and the rollback confirm is a `div role="group"` labelled by its question.
- The minimised pill is a separate `button` in the same corner. The toast is `inert` while minimised.
- A visually hidden `aria-live="polite"` paragraph is used for announcements.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Toast | enter | translateY, scale, opacity | 24px, .97, 0 → 0, 1, 1 | 550ms | `--expo` | 1ms |
| Spinner | building, checks | rotate | 0 → 360° | 800ms loop | linear | static ring |
| Current step rule | active | gradient sweep | 100% → −50% | 1.1s loop | `--ease` | solid half fill |
| Log line | new message | translateY, opacity | 100%, 0 → 0, 1 | 240ms | `--ease` | instant swap |
| Checks list | enter / leave Checks | max-height | 0 ↔ 120px | 360ms | `--ease` | 1ms |
| Check icon | pass | spinner → lime disc | instant | — | — | same |
| Live dot | live | spinner → lime disc + 6px halo | instant | — | — | same |
| Preview window | open | translateY, scale, opacity | −12px, .98, 0 → 0, 1, 1 | 420ms | `--expo` | 1ms |
| Pill ↔ toast | minimise | translateY, scale, opacity | 16px, .96, 0 ↔ rest | 300–400ms | `--expo` | 1ms |
| Buttons | press | translateY | 0 → 1px | 120ms | `--ease` | same |

The sweep and spinner stop the moment the deploy is live or rolled back.

## States

| Phase (`data-phase`) | Title | Indicator | Body |
| --- | --- | --- | --- |
| `build` | Building atlas-web | white spinner | stepper, log |
| `checks` | Running checks | white spinner | stepper, log, checks list open |
| `live` | Live on preview | lime dot, lime top rule | stepper, log, URL, Open preview + Rollback |
| `confirm` | (unchanged) | lime dot | red-tinted confirm box replaces the buttons |
| `rolling` | Rolling back to 9be20d4 | spinner with red head | log |
| `rolled` | Rolled back to 9be20d4 | grey dot, grey top rule | log, Redeploy a3f9c1e |

- Primary hover: lime lightens to `#d6ff6b`. Secondary hover: `--raise` fill.
- Icon buttons: `--text-3`, and on hover `--raise` fill with `--text`.
- Hash hover: border `--text-3`, text `--text`. After a click it reads "copied" for 1.4s.
- Focus-visible: 2px lime outline, 2px offset.
- Failure is not shown in this demo. A failed check turns its row's disc `--bad` with an "×", sets the title to "Checks failed" and the top rule to `--bad`, and offers "View logs" and "Redeploy". It never offers Open preview.

## Accessibility

- The toast is `role="status"`, so it is not interruptive. Announcements go through a separate polite live region, and only at stage changes: "Deploying a3f9c1e to preview.", "Build done in 5 seconds. Running 3 checks.", "atlas-web is live on preview. Commit a3f9c1e, 10 seconds.", "Rolling back." and "Rolled back to 9be20d4." Never announce each log line or each second.
- The stepper is an ordered list, and the running step has `aria-current="step"`. The values are text, so state is never colour alone.
- Rollback is two steps. Focus lands on Cancel, so pressing Enter twice does not roll back.
- Escape closes the preview window first, then cancels a confirm, then minimises the toast. Minimising moves focus to the pill and restoring moves it back.
- Dismiss moves focus to "Push again", so focus is never left on a removed node.
- Buttons are 36px tall on a desktop surface, icon buttons 32px, and the pill 40px.
- Contrast on `#131614`: `#e6e9e4` is about 15:1, `#a3aca5` about 8:1, and `#717a73` about 4.6:1 (used for meta only). `#10140a` on lime is about 15:1.

## Responsive rules

- ≥1280: as specified.
- 1100 and below: the preview window anchors right 24px, above the toast.
- 820 and below: the explorer hides and the preview spans the editor with 12px insets.
- 480 and below (checked at 375): the toast spans the width with 12px side insets, 44px from the bottom. The pill sits at the right. The status bar keeps only the deploy state and "Push again". The editor drops to 11px.
- Never let the toast grow past 404px. A wider toast reads as a panel.

## Acceptance checklist

### Always

- [ ] There are four fixed stages, each showing done (duration), current (live timer) or upcoming (—).
- [ ] One log line at a time, the newest sliding in, at a fixed 20px height.
- [ ] Checks appear only during the Checks stage, each turning from spinner to pass with a value.
- [ ] The accent is used only for the live state and the primary action.
- [ ] Commit message, branch, author and a copyable short hash are always visible.
- [ ] Open preview and Rollback appear only when live. Rollback needs an inline confirm with Cancel focused.
- [ ] The toast can minimise to a corner pill that keeps updating.
- [ ] The live region speaks only at stage changes.
- [ ] Spinners and sweeps stop when the deploy settles. Reduced motion removes them.
- [ ] No horizontal scroll at 375 wide.

### This demo

- [ ] Product "Pipewright", project "fernhill / atlas-web", branch "feat/cart-currency", author "Maya Ostrowski".
- [ ] Commit "fix(cart): keep coupon on currency switch", hash a3f9c1e, rollback target 9be20d4.
- [ ] Stage times: queued 1.2s, build 5.0s, checks 4.2s, live at 10.4s.
- [ ] Checks "Lint and types 4.1s", "Unit tests 412/412", "Lighthouse, /cart 96".
- [ ] Graphite `#0c0e0d`, toast `#131614`, lime `#c8f25a`, red `#ff6b5b`.
- [ ] Toast 404px wide, 24px from the right, 56px from the bottom.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The background is a browser IDE. It has a 44px top bar ("Pipewright · fernhill / atlas-web / feat/cart-currency"), a 232px file explorer with `currency.ts` modified, a code editor showing the coupon fix, and a 32px status bar reading "● deploying a3f9c1e" with a "Push again" button on the right.
2. 200ms after load, the toast rises into the bottom-right corner, 24px from the right and 56px from the bottom so it clears the status bar. It is 404px wide and goes from translateY(24px) scale(.97) to rest over 550ms with expo-out.
3. Toast header: the Pipewright mark, a "PREVIEW" environment tag, "now", and 32px Minimise (—) and Dismiss (×) buttons.
4. Title row: a 16px spinner, "Building atlas-web", and an elapsed timer on the right in mono ("0:03"). The demo starts 2.4s into the deploy, so the first frame is already mid-build.
5. Commit card: a 24px avatar "MO" and "fix(cart): keep coupon on currency switch" over "feat/cart-currency · Maya Ostrowski". On the right is a hash button "a3f9c1e" with a copy icon. Clicking it shows "copied" for 1.4s.
6. Stepper: four equal segments with a 3px rule on top, a label, and a mono value:
   - Done: grey rule, duration ("1.2s", "5.0s", "4.2s").
   - Current: a white sweep runs along the rule (1.1s loop), and the value is a live "0:02".
   - Upcoming: dim rule, "—".
   - When live, the Live segment's rule turns lime and its value becomes the hash.
7. Log line: one line under the stepper. Each new message slides up from below over 240ms and replaces the old one. The sequence is: "queued on runner eu-west-2b", "installing deps from lockfile, 1,284 packages", "compiling 214 modules", "bundling client, 1.21 MB → 342 kB gzip", "uploading 38 assets", "running 3 checks in parallel", and then a √ line for each check.
8. At 6.2s the stage becomes Checks. The title reads "Running checks" and a three-row list opens (max-height 0 → 120px, 360ms): "Lint and types", "Unit tests" and "Lighthouse, /cart". Each row has a spinner that becomes a lime check with a value ("4.1s", "412/412", "96") at 7.4s, 8.6s and 9.8s.
9. At 10.4s the deploy is live:
   - The top 2px rule of the toast turns lime and the spinner becomes a lime dot with a soft 6px halo.
   - The title reads "Live on preview" and the timer freezes.
   - The checks list collapses 900ms later.
   - A URL row appears: "atlas-web-a3f9c1e.preview.pipewright.dev", with the subdomain in lime.
   - Two buttons appear: "Open preview ↵" (lime fill) and "Rollback" (outlined).
   - The header time starts counting "1s ago", "2s ago" and so on.
   - The status bar reads "● live a3f9c1e" with a lime dot.
10. Open preview: a 420px cream preview window slides in at the top of the editor (right 452px, top 60px) showing the cart in GBP with "Coupon AUTUMN15 −£14.40". That proves the fix. A close button or Escape closes it.
11. Rollback: the buttons are replaced by a red-tinted box: "Roll preview back to 9be20d4? This deploy stays in history." with "Roll back" (red fill) and "Cancel". Focus goes to Cancel.
12. Roll back: the spinner border turns red, the title reads "Rolling back to 9be20d4", and the log reads "re-aliasing preview to 9be20d4". After 1.6s the title reads "Rolled back to 9be20d4" with a grey dot and a grey top rule. The log reads "√ preview serves 9be20d4 · a3f9c1e kept". The Live value becomes "9be20d4" and a "Redeploy a3f9c1e" button appears.
13. Minimise (— or Escape) collapses the toast into a 40px pill in the same corner, showing a spinner and "Building · 0:07". The pill keeps updating and reads "Live · a3f9c1e" when done. Click it to restore.
14. Dismiss (×) slides the toast away and moves focus to "Push again". "Push again" or "Redeploy" replays from step 2.

## Tokens

```css
:root {
  --bg: #0c0e0d;          /* workspace */
  --panel: #131614;       /* commit card, pill */
  --raise: #191d1a;       /* hovers, selected file */
  --line: #242a26;        /* hairlines */
  --line-2: #323a34;      /* toast border, idle rules */
  --text: #e6e9e4;
  --text-2: #a3aca5;
  --text-3: #717a73;

  --live: #c8f25a;        /* the one accent: live state, primary button */
  --live-ink: #10140a;    /* text on lime */
  --warn: #f2b84b;        /* status-bar "deploying" dot, code keywords */
  --bad: #ff6b5b;         /* rollback only */
  --focus: #c8f25a;

  --sans: "Wix Madefor Text", system-ui, sans-serif;
  --mono: "Martian Mono", ui-monospace, monospace;

  --toast-w: 404px;
  --toast-r: 12px;
  --btn-h: 36px;
  --btn-r: 7px;
  --gap-corner: 24px;

  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-enter: 550ms;
  --t-log: 240ms;
  --t-checks: 360ms;
}
```

The toast fill is `rgba(19,22,20,.97)` with a 1px `--line-2` border and a shadow of `0 0 0 1px rgba(0,0,0,.4), 0 28px 60px -18px rgba(0,0,0,.85)`. A 2px top rule sits inside: `--line-2`, then `--live` when live, then `--text-3` once rolled back.

## Typography

| Role | Family | Size | Weight | Notes |
| --- | --- | ---: | ---: | --- |
| Title | Wix Madefor Text | 16px | 600 | −0.01em |
| Commit message | Wix Madefor Text | 13px | 400 | one line, ellipsis |
| Buttons | Wix Madefor Text | 13px | 600 | |
| Step label | Wix Madefor Text | 12px | 400 | |
| Check row | Wix Madefor Text | 12.5px | 400 | |
| Elapsed | Martian Mono | 12px | 500 | tabular |
| Hash | Martian Mono | 11px | 500 | |
| Log line | Martian Mono | 11px | 400 | 20px line box, values in 500 `--text-2` |
| Step value | Martian Mono | 10.5px | 400 | tabular |
| Env tag | Martian Mono | 10px | 500 | 0.04em, upper, 1px border |
| Editor | Martian Mono | 12.5px | 400 | line-height 1.95 |

Anything a person wrote (commit message, labels) is sans. Anything the machine reports (hash, times, counts, log) is mono.

## Implementation notes

**Drive the UI from events, not timers.** The demo plays a script, but a real build sends events. Keep one reducer and let every view (toast, pill, status bar) read from it.

```js
// events from your deploy API / websocket
// { type: 'stage', stage: 'build' | 'checks' | 'live', at }
// { type: 'log', line }   { type: 'check', id, status: 'pass' | 'fail', value }
function reduce(s, e) {
  switch (e.type) {
    case 'stage': return { ...s, phase: e.stage, stages: { ...s.stages, [e.stage]: { start: e.at } } };
    case 'log':   return { ...s, log: e.line };                    // keep only the newest
    case 'check': return { ...s, checks: { ...s.checks, [e.id]: e } };
    default: return s;
  }
}
```

**The running segment sweep is one gradient.** It needs no extra element.

```css
.steps li::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; border-radius: 2px; background: var(--line-2); }
.steps li.done::before { background: var(--text-2); }
.steps li.now::before {
  background: linear-gradient(90deg, var(--text) 0 30%, var(--line-2) 30% 100%);
  background-size: 300% 100%; animation: run 1.1s var(--ease) infinite; }
@keyframes run { from { background-position: 100% 0 } to { background-position: -50% 0 } }
```

**One-line log without layout jumps.** Give the log a fixed `height: 20px; overflow: hidden` box. Replace its child on each message and animate the new child up from `translateY(100%)`. Do not append lines, or the toast grows.

**Rollback is a re-alias, not a rebuild.** Point the preview alias back at the previous immutable deploy. It takes about a second and keeps the bad deploy in history, so "Redeploy" is just re-aliasing again.

Common mistakes:

- A progress percentage. Deploys do not know their percent, so show stages and elapsed time.
- Streaming the whole log into the toast. Link to the full log and show one line.
- Lime on everything: spinners, borders, headings. Lime means live.
- A modal for rollback confirm. Keep it inline in the toast.
- Auto-dismissing a live toast that holds actions. Let it sit and count "Ns ago".
- Toasts that cover the status bar. Sit 56px up.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
