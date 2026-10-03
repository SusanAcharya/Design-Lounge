<!-- Design Lounge Nº 006 · "Button state morph" · designlounge.vercel.app -->

# Button state morph

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A checkout confirmation button inside a 420px order card for a bakery pickup ("Halden", order 2418, $48.00). One `<button>` moves through four states without ever being replaced: **idle** ("Pay $48.00", 220 × 44 black pill) → **loading** (width collapses to 44px in 200ms while the label fades; a ring spinner turns) → **success** (a checkmark path draws itself from `stroke-dashoffset: 24` to 0 in 400ms) → **paid** (the pill widens to 140px in 300ms, turns green, the check slides left and "Paid" fades in beside it). Two seconds after "Paid", a hint appears and clicking the button resets it to idle and replays. The detail worth copying is that width, colour, label and icon each have their own transition clock, all attached to one `data-state` attribute — there is no DOM swapping, so focus never leaves the button.

## Reference behaviour

1. Initial state: card with order heading, three line items with quantity sub-lines, a "Total, incl. tax $48.00" row, the idle button centred, and a status line "Card ending 4471 · no charge until you confirm". Hint text is hidden (opacity 0).
2. Hover the idle button: lifts 1px (`translateY(-1px)`, 120ms). Active: `scale(.98)`. Focus-visible: 2px `--ink` outline, 3px offset.
3. Click (t = 0): `data-state="loading"`, `aria-disabled="true"`, `aria-label="Processing payment"`. Width 220 → 44px over 200ms `cubic-bezier(.2,.7,.2,1)`; label opacity 1 → 0 and `translateX(−6px)` over 120ms; spinner opacity 0 → 1 over 120ms and its dash rotates 360° every 900ms, linear. Status: "Contacting Fjord Bank…".
4. t = 1600ms: `data-state="success"`. Spinner opacity → 0 (120ms). Checkmark opacity → 1 (120ms) and its path's `stroke-dashoffset` transitions 24 → 0 over 400ms `cubic-bezier(.16,1,.3,1)` with a 60ms delay. Status: "Confirmed". `aria-label="Payment confirmed"`.
5. t = 2200ms: `data-state="paid"`. Width 44 → 140px over 300ms `cubic-bezier(.16,1,.3,1)`; background `#14201a` → `#1e8a5a` over 240ms; check translates `−30px` over 300ms (same clock as the width); "Paid" label fades in and settles at `translateX(12px)` over 120ms after a 120ms delay. `aria-disabled` removed; `aria-label="Paid"`. Status turns green with a 6px dot: "Paid · receipt sent to mara@halden.no".
6. t = 4200ms: hint "Click the button again to replay" fades in (240ms). Clicks on the button before this moment are ignored.
7. Click while paid and ready: state → idle (width 140 → 220 over 200ms, background back to black, "Paid" label out, "Pay $48.00" label in), status resets, hint hides; 350ms later the sequence from step 3 runs again.
8. Clicks during loading or success do nothing (`aria-disabled`, not `disabled`, so keyboard focus stays on the button through the whole sequence).
9. With `prefers-reduced-motion: reduce`: all transitions are 1ms (states still cut through in the same order and timing); the spinner slows to one rotation per 2s.

## Structure

```
1280 × 800  (card centred)
            ┌──────────────────────────────────────────────┐ 420 wide, pad 28
            │ Order 2418                Halden · pickup 18:30│
            │ ──────────────────────────────────────────── │
            │ Sourdough, seeded                       $9.00 │
            │ 1 × 800 g                                     │
            │ ──────────────────────────────────────────── │
            │ Cardamom buns                          $17.00 │
            │ 4 × $4.25                                     │
            │ ──────────────────────────────────────────── │
            │ Coffee beans, Loam blend               $22.00 │
            │ 1 × 250 g                                     │
            │ ──────────────────────────────────────────── │
            │ Total, incl. tax                       $48.00 │
            │                                               │
            │              (   Pay $48.00   )   220 × 44    │
            │     Card ending 4471 · no charge until you…   │ status
            │          Click the button again to replay     │ hint (hidden until ready)
            └──────────────────────────────────────────────┘

   idle 220 ──► loading 44 (ring) ──► success 44 (check draws) ──► paid 140 (check + "Paid", green)
```

- `<section class="card" aria-labelledby="t">` — white, 1px border, 16px radius, soft shadow.
  - `.head` — `<h1 id="t">` + pickup note.
  - `<ul class="items">` — three `<li>` with name/`<small>` qty and a `<b>` price.
  - `.total` — label + `<b>` amount.
  - `.row` — flex column, centred, gap 14px:
    - `<button class="pay" type="button" data-state="idle">` containing `.lbl.idle`, `.lbl.paid`, `<svg class="ico spin">` (circle r 9) and `<svg class="ico check">` (path `M5 12.5l4.5 4.5L19 7.5`, length ≈ 24).
    - `.status` (`role="status"`) with a dot and `<span id="stxt">`.
    - `.hint`.

## Tokens

```css
:root {
  /* colour — sage-tinted page, white card, near-black button, one green */
  --bg: #eef1ec;
  --card: #ffffff;
  --line: #dce2db;        /* card border */
  --line-2: #eef1ec;      /* item separators */
  --ink: #14201a;
  --ink-2: #5f6b64;       /* status, total label */
  --ink-3: #8f9a93;       /* meta, hint */
  --btn: #14201a;         /* idle / loading / success fill */
  --btn-ink: #ffffff;
  --ok: #1e8a5a;          /* paid fill, status text, dot */
  --ok-soft: #e3f2ea;

  /* type */
  --display: "Gabarito", system-ui, sans-serif;
  --sans: "Onest", system-ui, sans-serif;

  /* geometry */
  --w-idle: 220px;
  --w-busy: 44px;
  --w-paid: 140px;
  --h: 44px;              /* radius = h / 2 = 22px, constant across states */
  --icon: 22px;
  --card-w: 420px;
  --r-card: 16px;
  --shadow-card: 0 1px 2px rgba(20,32,26,.04), 0 12px 32px -16px rgba(20,32,26,.18);

  /* motion */
  --t-collapse: 200ms;    /* 220 → 44 */
  --t-expand: 300ms;      /* 44 → 140 */
  --t-label: 120ms;       /* label / icon fades */
  --t-draw: 400ms;        /* checkmark */
  --draw-delay: 60ms;
  --t-spin: 900ms;        /* one rotation */
  --spin-for: 1400ms;     /* loading dwell */
  --hold: 600ms;          /* success dwell before paid */
  --ready-after: 2000ms;  /* paid → replay allowed */
  --reset: 350ms;         /* idle dwell before replay */
  --t-color: 240ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role         | Family  | Size | Weight | Line-height | Tracking | Case      |
|--------------|---------|-----:|-------:|------------:|---------:|-----------|
| Order title  | Gabarito| 20px | 600    | 1.2         | −0.01em  | sentence  |
| Pickup note  | Onest   | 12px | 400    | 1.5         | 0        | sentence  |
| Item name    | Onest   | 14px | 400    | 1.5         | 0        | sentence  |
| Item qty     | Onest   | 12px | 400    | 1.5         | 0        | sentence  |
| Item price   | Onest   | 14px | 500    | 1.5         | 0        | numerals (tabular) |
| Total label  | Onest   | 14px | 400    | 1.5         | 0        | sentence  |
| Total amount | Gabarito| 22px | 600    | 1.2         | −0.01em  | numerals (tabular) |
| Button label | Gabarito| 15px | 600    | 44px box    | 0        | sentence  |
| Status       | Onest   | 13px | 400    | 1.5         | 0        | sentence  |
| Hint         | Onest   | 12px | 400    | 1.5         | 0        | sentence  |

## Motion

| Element           | Trigger              | Property           | From → To            | Duration | Easing       | Delay |
|-------------------|----------------------|--------------------|----------------------|---------:|--------------|-------|
| `.pay`            | idle → loading       | width              | 220 → 44px           | 200ms    | `--ease`     | 0 |
| `.lbl.idle`       | idle → loading       | opacity, translateX| 1, 0 → 0, −6px       | 120ms    | `--ease`     | 0 |
| `.spin`           | loading              | opacity            | 0 → 1                | 120ms    | `--ease`     | 0 |
| `.spin circle`    | loading              | rotate             | 0 → 360°             | 900ms    | linear, infinite | 0; `dasharray: 38 60` on r = 9 |
| `.spin` / `.check`| loading → success    | opacity            | 1 → 0 / 0 → 1        | 120ms    | `--ease`     | 0 |
| `.check path`     | success              | stroke-dashoffset  | 24 → 0               | 400ms    | `--ease-out` | 60ms |
| `.pay`            | success → paid       | width              | 44 → 140px           | 300ms    | `--ease-out` | 0 |
| `.pay`            | success → paid       | background-color   | `--btn` → `--ok`     | 240ms    | `--ease`     | 0 |
| `.check`          | success → paid       | translateX         | 0 → −30px            | 300ms    | `--ease-out` | 0 |
| `.lbl.paid`       | success → paid       | opacity, translateX| 0, 10px → 1, 12px    | 120ms    | `--ease`     | 120ms |
| `.pay`            | paid → idle          | width, background  | 140 → 220px, green → black | 200ms / 240ms | `--ease` | 0 |
| `.hint`           | ready                | opacity            | 0 → 1                | 240ms    | `--ease`     | 0 |
| `.pay`            | hover / active       | transform          | `translateY(−1px)` / `scale(.98)` | 120ms | `--ease` | 0 |

Absolute timeline from a click in idle:

| t (ms) | State   | What is moving |
|-------:|---------|----------------|
| 0      | loading | width 220→44 (200ms); label out (120ms); spinner in (120ms) |
| 200    | loading | spinner alone, 900ms per turn |
| 1600   | success | spinner out, check in (120ms); check draws 1660–2060 |
| 2200   | paid    | width 44→140 (300ms); fill → green (240ms); check slides −30px (300ms); "Paid" in 2320–2440 |
| 2500   | paid    | settled |
| 4200   | paid    | hint visible; replay allowed |

Reduced motion: `transition-duration: 1ms !important` on the button, labels, icons, check path and hint; spinner `animation-duration: 2s`.

## States

| `data-state` | Width | Fill    | Visible          | `aria-disabled` | `aria-label` |
|--------------|------:|---------|------------------|-----------------|--------------|
| `idle`       | 220px | `--btn` | "Pay $48.00"     | false           | Pay $48.00 |
| `loading`    | 44px  | `--btn` | spinner          | true            | Processing payment |
| `success`    | 44px  | `--btn` | checkmark        | true            | Payment confirmed |
| `paid`       | 140px | `--ok`  | check + "Paid"   | false           | Paid |

- **Hover (idle, paid):** `translateY(−1px)`. **Active:** `scale(.98)`. **Focus-visible:** 2px outline in `--ink` (idle) or `--ok` (paid), offset 3px.
- **Cursor:** `pointer` in idle/paid, `progress` in loading/success.
- **Status line:** grey by default; green with a 6px dot in paid.
- **Error:** not shown in this piece. If you add one: from loading, expand to 220px with fill `#b4462f`, label "Try again", status explains why; keep the same clocks.

## Accessibility

- The button is a single persistent `<button type="button">`; its `aria-label` is rewritten per state so the accessible name is always meaningful even while the visible label is at opacity 0.
- Use `aria-disabled="true"` (and ignore clicks in JS) rather than `disabled` during loading/success, so the focus ring and the focus position survive the sequence.
- `.status` has `role="status"` (polite live region); it announces "Contacting Fjord Bank…", "Confirmed", and the receipt line. Do not also put `aria-live` on the button.
- SVGs are `aria-hidden="true"`.
- Keyboard: Tab to the button; Enter/Space runs the sequence; after "Paid" and the 2s wait, Enter/Space replays. There are no other focusable elements in the card.
- Contrast: white on `--btn` 15.1:1; white on `--ok` 4.6:1; `--ink-2` on white 5.9:1; `--ok` status text on white 4.6:1; `--ink-3` (12px meta/hint) 3.3:1 — decorative.
- Hit target: 44px tall in every state, never narrower than 44px.

## Responsive rules

- ≥ 1280: card 420px, centred, as specified.
- 1024–1279 and 768–1023: identical (the card is fixed-width and centred).
- < 640: card 100% width with 16px page padding; button widths unchanged (220 / 44 / 140); the status line may wrap to two lines — reserve `min-height: 40px`.
- If the button ever sits in a full-width layout, keep collapsing to 44px *centred* (transform-origin is irrelevant because width is animated, but `margin: 0 auto` must remain).

## Acceptance checklist

- [ ] Button is one persistent element with `data-state` cycling idle → loading → success → paid; no DOM replacement.
- [ ] Height is 44px and border-radius 22px in every state; width is 220 / 44 / 44 / 140px.
- [ ] Collapse takes 200ms `cubic-bezier(.2,.7,.2,1)`; expand takes 300ms `cubic-bezier(.16,1,.3,1)`.
- [ ] The idle label fades out over 120ms while sliding 6px left; it never wraps or clips during the collapse (`white-space: nowrap; overflow: hidden`).
- [ ] The spinner is a 22px SVG circle (r 9, `stroke-dasharray: 38 60`) rotating 360° every 900ms, visible only in loading.
- [ ] Loading lasts 1400ms; success lasts 600ms; then paid.
- [ ] The check path (`M5 12.5l4.5 4.5L19 7.5`) draws from `stroke-dashoffset: 24` to 0 over 400ms after a 60ms delay.
- [ ] In paid, the fill is `#1e8a5a`, the check sits 30px left of centre and "Paid" sits 12px right of centre.
- [ ] `aria-label` reflects each state; `aria-disabled` is true only in loading and success; focus stays on the button throughout.
- [ ] The status region announces three messages per run; hint appears 2000ms after paid.
- [ ] Clicking during loading/success does nothing; clicking after the hint resets to idle then replays after 350ms.
- [ ] Reduced motion: state changes are instant but the sequence and timings are unchanged.
- [ ] Hover lift (−1px) and active scale (.98) apply in idle and paid only; loading/success show `cursor: progress` and no transform.

## Implementation notes

**Everything hangs off `data-state`.** Use attribute selectors, and give the expand its own transition so the two width changes can have different curves:

```css
.pay { width: var(--w-idle); height: var(--h); border-radius: calc(var(--h) / 2); overflow: hidden;
       transition: width var(--t-collapse) var(--ease), background-color var(--t-color) var(--ease); }
.pay[data-state="loading"], .pay[data-state="success"] { width: var(--w-busy); cursor: progress; }
.pay[data-state="paid"] { width: var(--w-paid); background: var(--ok);
       transition: width var(--t-expand) var(--ease-out), background-color var(--t-color) var(--ease); }
.check path { stroke-dasharray: 24; stroke-dashoffset: 24; }
.pay[data-state="success"] .check path,
.pay[data-state="paid"]    .check path { stroke-dashoffset: 0;
       transition: stroke-dashoffset var(--t-draw) var(--ease-out) var(--draw-delay); }
```

**Sequence with cancellable timers** so a replay can never double-schedule:

```js
let timers = [], ready = false;
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
function set(s) {
  btn.dataset.state = s;
  btn.setAttribute('aria-label', { idle: 'Pay $48.00', loading: 'Processing payment', success: 'Payment confirmed', paid: 'Paid' }[s]);
  btn.setAttribute('aria-disabled', String(s === 'loading' || s === 'success'));
}
function run() {
  timers.forEach(clearTimeout); timers = []; ready = false;
  set('loading');
  later(() => set('success'), 200 + 1400);
  later(() => set('paid'),    200 + 1400 + 600);
  later(() => { ready = true; hint.classList.add('show'); }, 200 + 1400 + 600 + 2000);
}
```

**Icons are absolutely centred** (`left: 50%; top: 50%; margin: −11px 0 0 −11px`) so they don't participate in the width animation; only opacity and, in paid, `translateX` move them. Measure the check path with `getTotalLength()` once if you change the path — 24 is for the path above at a 24-unit viewBox.

Common mistakes: swapping the button's `innerHTML` per state (kills focus and the width transition); using `disabled` (drops focus, and Safari stops the transition); animating `border-radius` (it should be constant at 22px so the pill never looks squarish mid-collapse); forgetting `overflow: hidden` so the idle label pokes out of the 44px circle for a frame.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
