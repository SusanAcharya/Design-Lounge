<!-- Design Lounge Nº 368 · "Sheen pill buttons" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Sheen pill buttons

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The booking buttons for "Orlé", a fictional chef's-counter restaurant. Full pill buttons on a green-black card: a solid champagne pill with a soft gold glow, a dark pill with a 1.5px gold conic gradient border, a quiet text pill, and a round icon pill. On hover a narrow diagonal band of light sweeps once across the pill in 1s, and the border gradient rotates 180°, so the metal looks like it caught the light. The two booking pills are asynchronous: click and the label cross-fades to a spinner with "Holding your table", the pill width animates to fit, then it turns sage with a drawn check and "Table for 2 · 20:30". The detail worth copying is that the sweep is a one-shot keyframe on hover, not a transition, so it never runs backwards when the pointer leaves.

## Reference behaviour

1. First frame: centred card. "Orlé" in Italiana 52px champagne, meta line "Chef's counter · Saturday 14 November · 2 guests", and on the right a tracked caption "Pill buttons · sheen on hover".
2. Live row: "Reserve the table" (solid, large), "Add wine pairing" (gradient edge, medium), "Tasting menu →" (gradient edge, small), "Gift an evening" (quiet, small), heart icon pill (edge, 52px circle, toggle).
3. Hover or keyboard focus: the sheen band travels from −130% to 130% of the pill's width over 1000ms, expo-out. The edge gradient's start angle animates 120° → 300° over 900ms. Solid pills grow their glow.
4. Press: scale 0.97 in 90ms.
5. Click "Reserve the table": `aria-busy="true"`, label swaps to a spinning 18px arc + "Holding your table"; the label fades up 6px in 260ms; the pill width animates from old to new in 420ms.
6. After 1500ms: `aria-busy` is removed, the pill gains `.ok`, turns sage (`#c9efd6 → #8fd3a8`) with dark green text, a check draws in 420ms, label "Table for 2 · 20:30". A polite live region says "Table reserved for 2 at 20:30".
7. After 3200ms more it morphs back to the idle label. Clicks while busy or in success are ignored.
8. "Add wine pairing" runs the same cycle: "Adding pairing" → "Pairing added · £68"; its success state is a sage 1.5px border with sage text.
9. Heart pill toggles `aria-pressed`; on, it turns rose `#e79a8a` and fills. The live region says "Saved to favourites" / "Removed from favourites".
10. A States sheet shows Solid, Gradient edge and Quiet at Default, Hover (sheen frozen mid-sweep), Pressed, Disabled, Focus; below it a Lifecycle strip: idle → loading → success.
11. Reduced motion: no sheen, no width tween, no fade, no check draw; the spinner slows to 2400ms per turn.

## Structure

```
1280 × 800, card width min(1060px, 100%), padding 36/44/32, radius 28, 1px line
┌──────────────────────────────────────────────────────────────────────────┐
│ Orlé (Italiana 52)                          PILL BUTTONS · SHEEN ON HOVER │
│ Chef's counter · Saturday 14 November · 2 guests                          │
│─────────────────────────────── 1px line ─────────────────────────────────│
│ (Reserve the table) (Add wine pairing) (Tasting menu →) Gift an evening (♡)│
│   58px solid         52px edge          42px edge        42px quiet  52px │
│─────────────────────────────── 1px line ─────────────────────────────────│
│ STATES        DEFAULT   HOVER   PRESSED   DISABLED   FOCUS                │
│ Solid         (Reserve) …                                     42px pills  │
│ Gradient edge (Pairing) …                                                 │
│ Quiet          Gift …                                                     │
│ LIFECYCLE  (Reserve the table) → (◌ Holding your table) → (✓ Table for 2) │
└──────────────────────────────────────────────────────────────────────────┘
```

- Card is `main` labelled by the `h1`.
- Live row: `section aria-label="Try the buttons"` of `button type="button"`; each label sits in a `span.lbl` so it can be swapped.
- A visually hidden `p aria-live="polite"` sits after the row.
- The sheet and lifecycle strip are wrapped in one `div inert aria-hidden="true"`, after a visually hidden description.

## Tokens

```css
@property --ang { syntax: "<angle>"; inherits: false; initial-value: 120deg; }
:root {
  --bg: #0f1412;        /* page, green-black */
  --surface: #161c19;   /* card */
  --surface-2: #1d2420; /* edge pill fill */
  --ivory: #f2ebdd;     /* text */
  --ink-2: #a8a293;     /* captions ~7:1 on card */
  --line: rgba(242,235,221,.1);
  --gold-1: #f4e2b8;  --gold-2: #d4b073;  --gold-3: #8f6c3a;   /* champagne ramp */
  --on-gold: #1d160a;   /* text on solid pill ~10:1 */
  --sage: #8fd3a8;      /* success */
  --rose: #e79a8a;      /* favourite on */
  --serif: "Italiana", Georgia, serif;
  --sans: "Urbanist", system-ui, sans-serif;
  --ease: cubic-bezier(.2,.7,.2,1);
  --out: cubic-bezier(.16,1,.3,1);
}
```

Sizes: L 58px / 34px padding / 16px; M 52 / 28 / 15; S 42 / 20 / 14; icon 52×52; sheet 42 / 20 / 14. Radius always 999px. Gap 10px between icon and label; 18px between pills.

Solid fill: `linear-gradient(180deg, #f4e2b8, #d4b073 60%, #c49c5c)` + `inset 0 1px 0 rgba(255,255,255,.6)`, `inset 0 -1px 0 rgba(90,60,20,.4)`, `0 10px 26px -12px rgba(212,176,115,.55)`.

## Typography

| Role | Family | Size | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Wordmark | Italiana | 52px / 0.9 | 400 | 0.01em | Title, `--gold-1` |
| Meta | Urbanist | 14px | 400 | 0 | Sentence |
| Pill label | Urbanist | 14 / 15 / 16px | 600 | 0.01em | Sentence |
| Captions, column heads | Urbanist | 11px / 10px | 600 | 0.16em | Upper |
| Row labels | Urbanist | 13px | 400 | 0 | Sentence |

Italiana is display-only. Labels stay Urbanist 600 so they read at 14px on gold.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Sheen | :hover, :focus-visible | ::after translateX | −130% → 130% | 1000ms, once | --out | none |
| Border turn | :hover | --ang | 120° → 300° | 900ms | --out | instant |
| Glow | :hover (solid) | box-shadow y/blur | 10/26 → 14/32 | 240ms | --ease | instant |
| Press | :active | scale | 1 → .97 | 90ms | --ease | none |
| Label swap | state change | opacity, translateY | 0, 6px → 1, 0 | 260ms | --out | none |
| Width fit | state change | width | old px → new px | 420ms | --out | instant |
| Spinner | busy | rotate | 0 → 360° | 800ms linear, loop | linear | 2400ms |
| Check | success | stroke-dashoffset | 24 → 0 | 420ms, 80ms delay | --out | drawn |

Linear is right for the spinner only.

## States

- Default: as tokens.
- Hover: sheen sweep, border turn, solid glow grows, quiet gets an 8% champagne wash.
- Pressed: scale .97.
- Focus-visible: 2px `--gold-1` outline, offset 4px; also plays the sheen once.
- Disabled: fill `#1c211e`, text `#6f6b61`, edge border flat `#3a3f3a`, no sheen, no glow, `cursor: not-allowed`.
- Loading: `aria-busy="true"`, spinner + present-tense label, `cursor: progress`, clicks ignored.
- Success: `.ok`; solid becomes sage gradient with `#0d2617` text; edge becomes sage border and sage text; check icon draws.
- Favourite on: `aria-pressed="true"`, rose, filled heart.

## Accessibility

- Pills are real buttons. Visible label is the name; the heart uses `aria-label="Save to favourites"` + `aria-pressed`.
- Loading sets `aria-busy` and the live region announces the loading text, then a full sentence on success ("Table reserved for 2 at 20:30"), not the abbreviated label.
- Do not set `disabled` while loading; that drops focus. Ignore clicks instead.
- Contrast: `--on-gold` on gold ~10:1; ivory on `--surface-2` ~15:1; `--gold-1` quiet text on card ~13:1; dark green on sage ~10:1.
- Keyboard: Tab order follows the row; Enter/Space activate; focus plays the sheen so keyboard users get the same moment.
- Hit targets ≥ 42px.

## Responsive rules

- ≥ 1024: single live row as drawn.
- 640–1024: the live row wraps; pills keep their sizes.
- < 860: card padding 26/20, wordmark 42px; the sheet drops the row-label column, labels sit above each row, pills shrink to 36px with 7px padding and 11.5px text; lifecycle arrows hide and the strip wraps.
- At 375 nothing overflows. Never shrink a live pill below 42px tall.

## Acceptance checklist

### Always

- [ ] Every button is a full pill (radius 999px).
- [ ] The sheen is an `::after` band swept by a one-shot keyframe on hover/focus, clipped by `overflow: hidden`.
- [ ] The gradient border is a two-layer background (padding-box fill, border-box gradient) on a transparent 1.5px border.
- [ ] The border gradient angle animates via a registered `@property`.
- [ ] Async buttons go idle → loading (`aria-busy`) → success → idle, ignoring clicks while busy.
- [ ] Width animates between label lengths instead of jumping.
- [ ] Success is announced in a polite live region with a full sentence.
- [ ] Focus ring 2px, offset 4px; disabled is flat and sheen-free.
- [ ] A states sheet shows default, hover, pressed, disabled, focus, plus the lifecycle, and is inert.
- [ ] Reduced motion removes sweep, fade, width tween and check draw.

### This demo

- [ ] Wordmark "Orlé"; live pills Reserve the table, Add wine pairing, Tasting menu, Gift an evening, heart.
- [ ] Loading 1500ms, success held 3200ms.
- [ ] Success labels "Table for 2 · 20:30" and "Pairing added · £68".
- [ ] Card `#161c19` on `#0f1412`; solid gold `#f4e2b8 → #d4b073`; success `#8fd3a8`.

## Implementation notes

**Sheen and border.** Keyframe, not transition, so leaving does not play it in reverse:

```css
.pill { position: relative; isolation: isolate; overflow: hidden; border-radius: 999px;
  transition: --ang 900ms var(--out), width 420ms var(--out); }
.pill::after { content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,.5) 48%,
    rgba(255,255,255,.12) 56%, transparent 70%);
  transform: translateX(-130%); }
.pill:hover::after, .pill:focus-visible::after { animation: sheen 1000ms var(--out); }
@keyframes sheen { to { transform: translateX(130%); } }
.edge { border: 1.5px solid transparent;
  background: linear-gradient(var(--surface-2), var(--surface-2)) padding-box,
    conic-gradient(from var(--ang), #f4e2b8, #8f6c3a 25%, #d4b073 50%, #5a4526 75%, #f4e2b8) border-box; }
.pill:hover { --ang: 300deg; }
```

On the solid pill the band must sit above the gradient fill but below the label: give the label `position: relative; z-index: 1`.

**Width morph.** `width: auto` can't transition, so measure:

```js
function morph(btn, html) {
  const lbl = btn.querySelector('.lbl'), w0 = btn.offsetWidth;
  btn.style.width = 'auto'; lbl.innerHTML = html;
  const w1 = btn.offsetWidth;
  btn.style.width = w0 + 'px'; void btn.offsetWidth; btn.style.width = w1 + 'px';
}
```

Common mistakes:

- A full-width shimmer looping forever; the sweep plays once per hover.
- A purple-blue gradient border. The ramp is champagne to bronze only.
- Swapping to `disabled` during loading, which kills focus and screen-reader context.
- Announcing "Table for 2 · 20:30" literally; announce a sentence.
- Letting the label wrap during the width tween; set `white-space: nowrap`.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
