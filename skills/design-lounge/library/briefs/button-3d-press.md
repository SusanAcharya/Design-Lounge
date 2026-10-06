<!-- Design Lounge Nº 163 · "3D keycap press buttons" · www.designlounge.live -->

# 3D keycap press buttons

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A button set that behaves like mechanical keycaps. Each button has a face and a solid bottom edge drawn with a zero-blur offset shadow. On press the face travels down onto the edge (6px at medium size) in 60ms and springs back up in 220ms on release, so a click feels like it bottomed out, without any sound. Three faces (orange primary, charcoal, cream) come in three sizes, plus square 60px icon keys. One icon key is a toggle that latches half-way down with a small LED, like a caps-lock key. Every live key carries a tiny mono legend in its top-left corner, and pressing that letter on a real keyboard sinks the on-screen key. A state sheet under the live row shows each face at default, hover, pressed, disabled and focus.

## Structure

```
1280 × 800, deck centred, width min(1040px, 100% ), radius 28px, padding 28/32/30
┌──────────────────────────────────────────────────────────────────────────┐
│ Klakk.  (30px 800)                               [ Last: none yet · 0 ]  │
│ mono subline 12px                                  readout, inset pill   │
│──────────────────────────── 1px rule ────────────────────────────────────│
│ TEXT KEYS · L / M / M / S                         ICON KEYS · 60PX       │
│ [ Ship build ] [▷ Run tests] [ Save draft ] [Cancel]   [▷][mic][+][undo] │
│   60px tall      52px          52px          40px       60×60 each       │
│──────────────────────────── 1px rule ────────────────────────────────────│
│ STATES                                                                   │
│            DEFAULT   HOVER   PRESSED   DISABLED   FOCUS                  │
│ Primary     [Ship]   [Ship]  [Ship]    [Ship]     [Ship]  44px keys      │
│ Dark        [Run] …                                                      │
│ Cream       [Save] …                                                     │
│ Icon·latch  [mic] …                               48×48                  │
└──────────────────────────────────────────────────────────────────────────┘
```

- The deck is `main`, labelled by the `h1` wordmark.
- The readout is a `p` with `aria-live="polite"`.
- The live row is a `section aria-label="Try the buttons"` holding two groups of `button type="button"`.
- Icon keys have `aria-label`; their SVG and legend spans are `aria-hidden`.
- The state sheet is a `section` with an `h2` "States", a visually hidden sentence describing it, and a grid with `inert` and `aria-hidden="true"`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Hover lift | :hover | translateY, edge | 0 → −1px, d → d+1 | 220ms | --spring | none |
| Press | :active / .is-pressed | translateY, edge, shadow | 0 → d−1, d → 1px | 60ms | --press | instant |
| Release | pointer up / keyup | same, back | d−1 → 0 | 220ms | --spring (overshoot) | instant |
| Latch | aria-pressed=true | translateY, edge | → d/2 | 220ms | --spring | instant |
| LED | aria-pressed | background | grey → orange | 120ms | --press | instant |

The press and release use different durations. Set the long spring on the base rule and override `transition-duration: 60ms` only inside `:active`, so the browser uses the short one going down and the long one coming back.

## States

- Default: face gradient (white 28% → 0 over the top 45%) on the face colour, 1px inner top highlight, 2px inner bottom shade, solid edge `0 var(--d) 0 var(--edge)`, plus a soft drop `0 (d+5px) 10px −3px rgba(50,35,20,.38)`.
- Hover: up 1px, edge d+1, drop d+7.
- Pressed: down d−1, edge 1px, inner shade `inset 0 2px 4px rgba(0,0,0,.12)`.
- Latched (toggle on): down d/2, edge d/2, LED orange.
- Disabled: face `--off`, edge 2px `--off-edge`, text `--off-ink`, no gradient, no hover, `cursor: not-allowed`.
- Focus-visible: 3px `--ink` outline, offset 4px, following the radius.
- Dark face: top gradient is white 10% instead of 28%, text cream.

## Accessibility

- All keys are real `button type="button"` elements. Visible text is the name; icon keys use `aria-label` ("Play preview", "Mute microphone", "New track", "Undo").
- The mic key uses `aria-pressed` and keeps a constant label.
- Readout is `aria-live="polite"` and is the only thing announced.
- Keyboard: Tab order follows the visual order. Space and Enter activate a focused key and both show the travel. Letter legends fire only without Ctrl, Cmd or Alt, and call `preventDefault` so they do not scroll or type.
- The state sheet is `inert` so its 20 fake buttons are not in the tab order or the accessibility tree.
- Hit targets: smallest live key is 40px tall. Contrast: ink on cream ~15:1, ink on orange ~7:1, cream on charcoal ~13:1, captions `--ink-2` on deck ~5:1.

## Responsive rules

- ≥1024: as drawn; text keys left, icon keys right on one row.
- 768–1024: the live row wraps; icon keys drop below text keys with their caption.
- <760: deck padding 22/18; the sheet loses its row-label column: row labels span the full width above each row of five, keys shrink to 40px tall with 10px padding, column heads 8px. At 375 nothing overflows.
- Never scale the depth with the viewport. Depth is a size property, not a layout one.

## Acceptance checklist

### Always

- [ ] The bottom edge is a zero-blur box-shadow in a darker shade of the face, not a border or a pseudo-element.
- [ ] Press moves the face down by depth − 1px and collapses the edge to 1px; nothing else in the layout moves.
- [ ] Press is 60ms; release is 220ms with overshoot.
- [ ] Keys reserve `margin-bottom` equal to their depth.
- [ ] Toggle keys latch at half depth and expose `aria-pressed`.
- [ ] Enter shows the same pressed travel as Space.
- [ ] Disabled keys are flat (2px edge), muted, and do not lift on hover.
- [ ] Focus ring 3px ink, offset 4px, on every live key.
- [ ] A states sheet shows default, hover, pressed, disabled, focus for each face, and is inert.
- [ ] Reduced motion removes transitions and the hover lift.

### This demo

- [ ] Wordmark "Klakk." and readout "Last: none yet · 0 presses".
- [ ] Live keys: Ship build (L, orange, S), Run tests (M, charcoal, R), Save draft (M, cream, D), Cancel (S, cream, X), plus icon keys P, M (toggle), N, Z.
- [ ] Orange `#ff6b1a` with edge `#b8460b`; cream `#f7f2e8` with edge `#b8ac98`.
- [ ] Pressing the M key on a keyboard latches the mic and the readout reads "Mute microphone (on)".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the putty page with a centred deck card. Header reads "Klakk." with an orange-brown full stop, a mono subline, and a readout pill on the right: "Last: none yet · 0 presses".
2. Live row, left group "Text keys · L / M / M / S": "Ship build" (orange, large, legend S), "Run tests" (charcoal, medium, play icon, legend R), "Save draft" (cream, medium, legend D), "Cancel" (cream, small, legend X).
3. Live row, right group "Icon keys · 60px": Play preview (charcoal, P), Mute microphone (cream toggle with LED, M), New track (cream, N), Undo (orange, Z).
4. Hover: the key rises 1px and its edge grows by 1px.
5. Pointer down: the face drops to `translateY(depth − 1px)`, the edge collapses to 1px, the drop shadow tightens. 60ms, standard easing.
6. Release: the face springs back to rest over 220ms on an overshooting curve.
7. Each activation updates the readout: "Last: Ship build · 1 press", pluralised after the first.
8. The microphone key toggles `aria-pressed`. When on it latches at half depth (3px) and its LED turns orange with a soft 2px halo; the readout says "(on)" or "(off)".
9. Pressing S, R, D, X, P, M, N or Z on the keyboard (no modifier) adds the pressed class on keydown and fires the key on keyup. Holding the letter keeps it down; auto-repeat is ignored.
10. Enter on a focused key also shows the pressed travel (browsers give Space an `:active` state but not Enter).
11. State sheet below: four rows (Primary, Dark, Cream, Icon · latched) by five columns (Default, Hover, Pressed, Disabled, Focus). The sheet is inert reference art.
12. Reduced motion: no transitions and no hover lift. The pressed position still changes so the state reads.

## Tokens

```css
:root {
  --bg: #e7e1d5;          /* page putty */
  --deck: #d6cebf;        /* stage card */
  --deck-lo: #c4bbaa;     /* deck bottom inner lip */
  --ink: #1f1b17;         /* text, focus ring */
  --ink-2: #5a5248;       /* captions, 5:1 on deck */
  --line: #c2b8a6;        /* hairlines */
  --cream: #f7f2e8;       --cream-edge: #b8ac98;
  --orange: #ff6b1a;      --orange-edge: #b8460b;   /* primary */
  --char: #2b2825;        --char-edge: #0e0c0b;
  --off: #e4ddd0;         --off-edge: #c9c0b1;  --off-ink: #8f867a;  /* disabled */
  --sans: "Gabarito", system-ui, sans-serif;
  --mono: "Reddit Mono", ui-monospace, monospace;
  --press: cubic-bezier(.2,.7,.2,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
}
```

Sizes (height / padding-x / font / radius / depth `--d`):

| Size | Height | Padding | Font | Radius | Depth |
| --- | --- | --- | --- | --- | --- |
| L | 60px | 30px | 18px | 14px | 7px |
| M | 52px | 24px | 16px | 12px | 6px |
| S | 40px | 16px (20px left) | 14px | 10px | 4px |
| Icon | 60×60 | 0 | — | 14px | 6px |
| Sheet | 44px (icon 48) | 18px | 15px | 12px | 5px |

Spacing: 6, 10, 12, 14, 16, 20, 28, 30. Every key reserves `margin-bottom: var(--d)` so the edge never collides with the next row.

## Typography

| Role | Family | Size | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Wordmark | Gabarito | 30px / 1 | 800 | −0.03em | Title |
| Key label | Gabarito | 14 / 16 / 18px | 700 | −0.01em | Sentence |
| Subline, readout | Reddit Mono | 12px | 500 (values 700) | 0.02em | Sentence |
| Group captions, column heads | Reddit Mono | 10px | 500 | 0.08em | Upper |
| Key legend | Reddit Mono | 9px | 700 | 0.04em | Upper, 55% opacity |

Ink on orange is about 7:1. Never put cream text on the orange face; it is under 3:1.

## Implementation notes

**The keycap in one rule.** Depth is a custom property so every size reuses the same shadows:

```css
.key { --d: 6px; margin-bottom: var(--d); border-radius: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,.28), transparent 45%), var(--face);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.55), inset 0 -2px 0 rgba(0,0,0,.07),
    0 var(--d) 0 var(--edge), 0 calc(var(--d) + 5px) 10px -3px rgba(50,35,20,.38);
  transition: transform 220ms var(--spring), box-shadow 220ms var(--spring); }
.key:active, .key.is-pressed { transform: translateY(calc(var(--d) - 1px));
  transition-duration: 60ms; transition-timing-function: var(--press);
  box-shadow: inset 0 2px 4px rgba(0,0,0,.12), 0 1px 0 var(--edge), 0 2px 3px -1px rgba(50,35,20,.4); }
```

**Keyboard legends.** Press on keydown, fire on keyup, ignore repeats:

```js
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const b = byKey[e.key.toLowerCase()]; if (!b) return;
  e.preventDefault(); if (!e.repeat) b.classList.add('is-pressed');
});
document.addEventListener('keyup', e => {
  const b = byKey[e.key.toLowerCase()];
  if (b?.classList.contains('is-pressed')) { b.classList.remove('is-pressed'); fire(b); }
});
```

Mirror the same add/remove for Enter on the focused key, because Enter never produces `:active`.

Common mistakes:

- Using `border-bottom` for the edge. It changes the box height on press and shoves siblings.
- Moving with `top` or `margin` instead of `transform`; it reflows on every press.
- Same duration down and up. Down must be near-instant or it feels mushy.
- A blurred shadow as the edge. The edge is solid; only the floor shadow is soft.
- Cream text on orange to "match" the charcoal key.
- Forgetting the margin, so the large key's edge sits on the caption below it.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
