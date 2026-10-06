<!-- Design Lounge Nº 416 · "Soft inset clay buttons" · www.designlounge.live -->

# Soft inset clay buttons

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The control panel of a ceramics kiln controller, "Kilnhouse", built in soft UI. Everything is the same terracotta-clay colour; shape comes only from a paired light and dark shadow. Buttons are raised pillows that sink into the clay when pressed. Toggles stay sunk while on. A switch and a three-way segmented control sit in carved wells. The piece is worth copying because it fixes the two things that make neumorphism fail: every control also has a 1px hairline edge so it reads without the shadows, and every "on" state also turns its label or icon ember-red, so state never relies on depth alone. All text clears 4.5:1.

## Structure

```
1280 × 800, stage width min(1060px, 100%), padding 34/40/32, radius 40
┌───────────────────────────────────────────────────────────────────────────┐
│ Kilnhouse (Gloock 34)                               (● Idle · 24°C) well  │
│ Kiln 2 · Stoneware · target 1,222°C                                       │
│                                                                           │
│ BUTTONS · L / M / M / S              1.5fr  │ TOGGLES                1fr  │
│ (● Start firing) (Hold temp) (Vent) [Unload]│ (◯●) Auto vent  On          │
│   60px            52px       52px    42px   │ (●◯) Slow cool  Off         │
│ ICON TOGGLES · 56PX                         │ PROGRAMME                   │
│ (bulb) (fan) (lock)                         │ [ Bisque |(Glaze)| Raku ]   │
│───────────────────────────── 1px hairline ────────────────────────────────│
│ STATES       DEFAULT  HOVER  PRESSED  DISABLED  FOCUS                     │
│ Primary      (Fire) …                                                     │
│ Raised       (Vent) …                                                     │
│ Icon toggle  (lock) …                                                     │
│ Switch       (◯●) …                                                       │
└───────────────────────────────────────────────────────────────────────────┘
```

- Stage is `main` labelled by the `h1`.
- Status is a `p aria-live="polite"`.
- Buttons are `button type="button"`; Start firing gains `aria-pressed` after first press.
- Icon toggles are `button` with `aria-label` and `aria-pressed`.
- Switches are `button role="switch" aria-checked`, the visible text is the name; the On/Off word is `aria-hidden`.
- Segmented control is `div role="radiogroup"` labelled by its caption, with three `button role="radio"` using roving `tabindex`; the thumb is an `aria-hidden` span.
- The states grid is `inert` and `aria-hidden`, with a visually hidden sentence before it.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Lift | :hover | box-shadow | raise → raise-hi | 200ms | --ease | none |
| Press | :active | box-shadow, scale | raise → sink, 1 → .985 | 90ms | --ease | shadow swap only |
| Toggle on | aria-pressed | box-shadow, colour | raise → sink, ink → ember | 200ms | --ease | instant |
| Switch knob | aria-checked | translateX, fill | 0 → 30px, clay → ember | 280ms | --out | instant |
| Segment thumb | selection | translateX | n × 100% | 320ms | --out | instant |
| Status dot | firing | fill | ink-2 → ember | 240ms | --ease | instant |

## States

- Default raised: `--raise` + 1px `--line` border.
- Hover: `--raise-hi`.
- Pressed (momentary): `--sink`, scale .985.
- On / selected: `--sink` and ember text or icon at 600. This is the non-depth signal.
- Disabled: no shadow, 1px dashed `rgba(90,55,35,.28)`, `--off-ink` text, `cursor: not-allowed`. Disabled switch knob `#d9bfab`, flat.
- Focus-visible: 2px `--ember` outline, offset 4px. Switch draws it on the track, not the whole label row. Segments draw it inset (offset −3px) so it stays inside the well.

## Accessibility

- Contrast: ink on clay ~10:1, `--ink-2` ~5:1, `--ember` ~5:1. The disabled `--off-ink` is intentionally below 4.5 (disabled controls are exempt) but the dashed outline still marks the shape.
- Shadows alone are under 3:1. The hairline, the dashed disabled outline and the ember on-state carry the meaning.
- Switches: Space and Enter toggle; name comes from the visible label, state from `aria-checked`.
- Segmented: Tab enters on the selected radio; Left/Up and Right/Down move and select, wrapping around.
- Icon toggles: fixed labels ("Chamber light", "Exhaust fan", "Lock door") with `aria-pressed`.
- Status is the only live region.
- Hit targets ≥ 42px; switch row ≥ 44px.

## Responsive rules

- ≥ 1024: two columns, 1.5fr / 1fr, gap 32.
- < 860: one column; stage padding 26/20, radius 28; the segmented control goes full width; the states grid drops its label column (labels span above each row) and shrinks controls to 40px.
- At 375 the four text buttons wrap onto two lines; nothing overflows.
- Do not use this on a white or dark page. Soft UI only works when the page and the controls are the same colour.

## Acceptance checklist

### Always

- [ ] Page, stage and controls share one surface colour.
- [ ] Raised = two outer shadows (light top-left, dark bottom-right); pressed/on = the same pair inset.
- [ ] Every raised control has a 1px hairline edge.
- [ ] On states change colour as well as depth.
- [ ] Disabled controls are flat with a dashed outline.
- [ ] All body and label text ≥ 4.5:1.
- [ ] Switches use `role="switch"`; segments use a radiogroup with arrow keys.
- [ ] Focus ring 2px accent, offset 4px, visible on every control.
- [ ] A states sheet shows default, hover, pressed, disabled and focus, and is inert.
- [ ] Reduced motion removes all transitions.

### This demo

- [ ] Brand "Kilnhouse", status "Idle · 24°C", toggling Start firing gives "Stop firing" and "Firing · ramp 150°C/h".
- [ ] Chamber light and Auto vent start on; Glaze starts selected.
- [ ] Clay `#e3cbb8`, shadows `#f7e8db` / `#b8957d`, ember `#8f3219`.
- [ ] Hold temp and Vent show their message for 2.4s.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: a raised clay stage, radius 40px. Top left "Kilnhouse" in Gloock 34px and "Kiln 2 · Stoneware · target 1,222°C". Top right a carved status pill with a dot: "Idle · 24°C".
2. Left column "Buttons · L / M / M / S": Start firing (large, ember text, small ember dot), Hold temp, Vent, Unload (small, disabled, dashed outline).
3. Below that "Icon toggles · 56px": three round toggles. Chamber light starts on (sunk, ember icon); Exhaust fan and Lock door start off.
4. Right column "Toggles": Auto vent switch (on, ember knob slid right, "On"), Slow cool switch (off, "Off"). Below, "Programme": Bisque / Glaze / Raku segmented control with Glaze selected.
5. Hover on a raised button: its shadow grows from 6px to 9px offset, so it lifts towards you.
6. Press: the button flips to an inset shadow and scales to 0.985 in 90ms. Release returns over 200ms.
7. Start firing toggles: it stays sunk with `aria-pressed="true"`, its label becomes "Stop firing", and the status reads "Firing · ramp 150°C/h" with the dot turning ember with a 3px halo. Pressing again restores "Idle · 24°C".
8. Hold temp sets the status to "Holding at 1,040°C" and Vent to "Vent opened for 30 s"; after 2.4s the status returns to the firing or idle line.
9. Icon toggles flip `aria-pressed`; on = inset + ember icon.
10. Switches flip `aria-checked`; the knob slides 30px in 280ms, becomes ember, and the track tints ember at 14%. The trailing word flips On/Off.
11. Segmented control: click or arrow keys move selection; a raised thumb slides under the chosen label in 320ms, and the label turns ember 600.
12. A "States" sheet underneath shows Primary, Raised, Icon toggle and Switch at Default, Hover, Pressed, Disabled, Focus.
13. Reduced motion: all transitions removed, no press scale.

## Tokens

```css
:root {
  --clay: #e3cbb8;      /* surface: page, stage and every control */
  --hi: #f7e8db;        /* light shadow (top-left) */
  --lo: #b8957d;        /* dark shadow (bottom-right) */
  --ink: #3a261b;       /* text ~10:1 */
  --ink-2: #6b4a38;     /* captions ~5:1 */
  --ember: #8f3219;     /* the one accent: on-state text, knob, dot ~5:1 */
  --line: rgba(90,55,35,.14);  /* hairline on every raised control */
  --off-ink: #a08573;   /* disabled text */
  --serif: "Gloock", Georgia, serif;
  --sans: "Lexend", system-ui, sans-serif;
  --ease: cubic-bezier(.2,.7,.2,1);
  --out: cubic-bezier(.16,1,.3,1);
  --raise: 6px 6px 14px var(--lo), -6px -6px 14px var(--hi);
  --raise-hi: 9px 9px 20px var(--lo), -9px -9px 20px var(--hi);
  --sink: inset 4px 4px 9px var(--lo), inset -4px -4px 9px var(--hi);
  --well: inset 3px 3px 7px var(--lo), inset -3px -3px 7px var(--hi);
}
```

Stage shadow: `14px 14px 34px var(--lo), -14px -14px 34px var(--hi)` plus `1px solid rgba(255,255,255,.35)`.

Sizes: L 60px tall / 32px padding / radius 20; M 52 / 26 / 18; S 42 / 18 / 14; icon 56px circle. Switch track 64×34, knob 26. Segmented: 5px well padding, items 42px tall, thumb radius 14, well radius 18.

Spacing: 4, 6, 10, 14, 16, 22, 26, 32, 40.

## Typography

| Role | Family | Size | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Wordmark | Gloock | 34px / 1 | 400 | −0.01em | Title |
| Meta, status | Lexend | 13px | 400 / 500 | 0 | Sentence |
| Button labels | Lexend | 14 / 15 / 16px | 500 (primary and on 600) | 0 | Sentence |
| Captions, column heads | Lexend | 11px / 10px | 500 | 0.12em | Upper |
| On/Off word | Lexend | 12px | 400 | 0 | Title |

Gloock appears once. Never set button labels in it.

## Implementation notes

**Shadows as tokens.** Define the four shadow recipes once; every control picks one:

```css
.soft { background: var(--clay); border: 1px solid var(--line); box-shadow: var(--raise);
  transition: box-shadow 200ms var(--ease), transform 200ms var(--ease), color 200ms var(--ease); }
.soft:hover { box-shadow: var(--raise-hi); }
.soft:active { box-shadow: var(--sink); transform: scale(.985); transition-duration: 90ms; }
.soft[aria-pressed="true"] { box-shadow: var(--sink); color: var(--ember); font-weight: 600; }
.soft:disabled { box-shadow: none; border: 1px dashed rgba(90,55,35,.28); color: var(--off-ink); }
```

**Segment thumb.** One absolutely positioned thumb, a third of the inner width, moved by percent of its own width:

```js
function pick(i, focus) {
  radios.forEach((r, j) => { r.setAttribute('aria-checked', j === i); r.tabIndex = j === i ? 0 : -1; });
  thumb.style.transform = `translateX(${i * 100}%)`;
  if (focus) radios[i].focus();
}
```

Thumb CSS: `top:5px; left:5px; width:calc((100% - 10px)/3); height:calc(100% - 10px)`.

Common mistakes:

- Pale grey text on the clay because "soft". It fails contrast; use `--ink`.
- Depth as the only state signal. Users with low vision cannot see a 4px inset.
- Shadows on a page colour that differs from the control colour; it turns into a cheap bevel.
- Pure white highlight. The light shadow is a warm `#f7e8db`, not `#fff`.
- Blurring the shadows past ~20px on small controls; they turn to fog.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
