<!-- Design Lounge Nº 342 · "Phone showcase mockup" · designlounge.vercel.app -->

# Phone showcase mockup

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A device frame for presenting phone work in a case study or a landing page, drawn entirely in CSS. No images, no SVG device outlines. The phone, a fictional Corvo 3, has a brushed titanium edge, three keys on the left, a side button on the right, a black bezel, and a pill-shaped island with a camera lens. Inside sits real HTML: a lock screen, a journal list and a run summary. A side panel switches the finish (Raw, Graphite, Dune, Fjord), the screen and the stage (warm bone gallery or espresso dark). Moving the pointer over the stage turns the phone in 3D, and a glare band slides across the glass. The detail worth copying is the stacked depth layers: four copies of the body outline at −4, −8, −12 and −16px on Z give the phone real thickness when it turns, so it never looks like a flat card.

## Reference behaviour

1. First frame: light stage, Raw finish, Lock screen. The phone rests at `rotateX(5deg) rotateY(-20deg)` so the left keys and the edge thickness are visible.
2. Pointer moves over the stage: target tilt is `rotateX = -ny * 24`, `rotateY = nx * 56`, where `nx`, `ny` are pointer position in −0.5…0.5 of the stage box. The current tilt eases toward the target by 10% per animation frame.
3. Pointer leaves the stage: the target returns to the rest pose and the phone eases back.
4. The glare band on the screen moves with `rotateY`: its centre is at `42 − ry × 1.6` percent across the screen.
5. The floor shadow under the phone shifts sideways by `−1.4px × ry` and narrows as the tilt grows.
6. Finish swatches (radio group): the edge gradient, depth layers and keys recolour instantly; the legend reads "Finish Graphite" etc.
7. Screen segmented control (Lock, Journal, Run): the outgoing screen fades out, the incoming one fades in from `scale(1.04)` to `1`.
8. When Run is shown, the island widens from 29% to 52% of the phone width and shows a green dot, "Run" and an elapsed time "24:18". It shrinks back for other screens.
9. Stage segmented control (Light, Dark): background, text and the floor shadow switch over 400ms.
10. The right side button is a real button. Pressing it puts the screen to sleep (all screens fade to black, island shrinks). Pressing again or choosing any screen wakes it.
11. A polite live region announces each change: "Graphite finish", "Run screen", "dark stage", "Screen asleep".

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│  padding 40px / clamp(24px, 6vw, 96px)                                │
│  ┌── copy 260–340px ──┐          ┌──────── stage (perspective 1100) ─┐│
│  │ CORVO 3 · PRES…    │          │          ┌───────────┐            ││
│  │ Hold it to         │          │          │ ◖ island ◗│ 300 × 628  ││
│  │ the light.  56px   │          │  keys ▌  │  screen   │ ▐ side btn ││
│  │ lede 32ch          │          │          │           │            ││
│  │ FINISH Raw         │          │          └───────────┘            ││
│  │ ○ ○ ○ ○  40px      │          │           floor shadow            ││
│  │ SCREEN  STAGE      │          │ hint 12px, bottom 12px            ││
│  │ [Lock|Journal|Run] │          └───────────────────────────────────┘│
│  └────────────────────┘                                               │
└──────────────────────────────────────────────────────────────────────┘
```

- `main.page` is a two-column grid: `minmax(260px, 340px) 1fr`, gap 40px.
- `section.copy` holds eyebrow `p`, the only `h1`, a lede `p`, and three `fieldset`s with `legend`s.
- `section.stage` is labelled ("Corvo 3 phone in Raw, showing the Lock screen") and carries `aria-roledescription="device mockup"`.
- `.rig` sets the phone width and is `container-type: inline-size`, so every part of the phone and its screens is sized in `cqw`.
- `.phone` (aspect 300/628, `transform-style: preserve-3d`) contains: four `.depth` layers, three decorative `.key` elements on the left, `button.k-pow` on the right, then `.edge > .bezel > .screen`.
- `.screen` holds `.island`, three `.scr` panels and a `.glare` overlay.

## Tokens

```css
:root {
  --bg: #ebe5da;        /* bone wall */
  --bg-2: #f6f2ea;      /* spotlight centre */
  --ink: #1d1a16;
  --ink-2: #5b544a;
  --ink-3: #7a7266;
  --line: #d3cabb;
  --accent: #b4561f;    /* ochre: headline italic, focus, journal FAB */
  --floor: rgba(40, 28, 14, .32);
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Geist", system-ui, sans-serif;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  /* finish ramp, light → dark */
  --f1: #e4e0d8; --f2: #b3ada3; --f3: #77726a; --f4: #4e4a44;   /* Raw */
}
body.dark { --bg: #14120f; --bg-2: #26221c; --ink: #efe8dc; --ink-2: #b6ad9f; --ink-3: #91887a; --line: #3a342b; --accent: #e08a4f; --floor: rgba(0,0,0,.7); }
[data-finish="graphite"] { --f1: #8d9096; --f2: #4a4d52; --f3: #2b2d31; --f4: #17181a; }
[data-finish="dune"]     { --f1: #f1dcc6; --f2: #c9a385; --f3: #8f6c52; --f4: #5c4433; }
[data-finish="fjord"]    { --f1: #dfe8ee; --f2: #9fb2bf; --f3: #677c8a; --f4: #3f4f5a; }
```

Phone geometry, all in `cqw` of the rig (rig = 300px at full size): body radius 15.5cqw, edge padding 1.7cqw, bezel radius 13.8cqw and padding 1.5cqw, screen radius 12.4cqw, island 29 × 8.6cqw at top 3.4cqw.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Headline | Instrument Serif | 56px (44px narrow) | 400, second line italic in accent | 1 | −0.01em | sentence |
| Eyebrow / legends | Geist | 12px | 500 | 1.45 | 0.14em | uppercase |
| Lede | Geist | 15px | 400 | 1.45 | 0 | sentence |
| Segmented labels | Geist | 14px | 500 | 1 | 0 | sentence |
| Lock time | Instrument Serif | 30cqw | 400 | 1 | −0.02em | — |
| Journal title, run distance | Instrument Serif | 11cqw / 24cqw | 400 | 1 | −0.02em | — |
| In-screen body | Geist | 3.4–3.6cqw | 400/600 | 1.3 | 0 | — |

The serif carries every big number and title, inside and outside the phone. That shared voice is what makes the mockup feel art-directed rather than dropped in.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Tilt | pointermove on stage | rotateX, rotateY | current → target | rAF lerp 0.1 per frame, stops under 0.02° | disabled, phone stays at rest pose |
| Return | pointerleave | rotateX, rotateY | current → 5°, −20° | same lerp | — |
| Glare | follows tilt | gradient stop | 42% − ry × 1.6 | with tilt | static |
| Screen swap | screen radio | opacity, scale | 0, 1.04 → 1, 1 | 380ms standard / 500ms expo out | instant |
| Island | Run on/off | width | 29cqw ↔ 52cqw, content fades in after 200ms | 450ms expo out | instant |
| Sleep | side button | screen opacity, scale | 1 → 0, 0.98 | 380ms | instant |
| Stage | stage radio | background, colour | light ↔ dark | 400ms standard | instant |
| Swatch | checked | inner dot scale | 1 → 0.86, ring appears | 180ms | instant |

## States

- Swatch resting: 28px gradient dot inside a 40px hit target. Checked: dot scales to 0.86 and a 1.5px `--ink` ring appears 2px inside the target.
- Segmented option checked: filled `--ink` pill with `--bg` text. Unchecked: `--ink-2` text on transparent.
- Focus-visible on radios: 2px `--accent` outline, 2px offset, drawn on the label (`label:has(input:focus-visible)`).
- Side button: `aria-pressed="true"` while the screen sleeps. Active: brightness 0.8.
- Screen asleep: black glass, island collapsed even on Run.
- Dark stage: espresso background, the accent lifts to `#e08a4f` to keep contrast.

## Accessibility

- Finish, Screen and Stage are radio groups inside `fieldset`/`legend`, so arrow keys move within each group for free. Swatch inputs carry `aria-label` with the finish name.
- The stage `section` label is rebuilt on every change: "Corvo 3 phone in Dune, showing the Journal screen" or "…, screen asleep".
- Hidden screens carry `aria-hidden="true"`.
- The side button is a real `button` with `aria-label="Side button: sleep or wake the screen"` and an invisible hit extension (`::before` inset −6px −16px −6px −8px) because the visible key is only ~5px wide.
- Tilt is pointer-only decoration; nothing is lost without it.
- Contrast: `#1d1a16` on `#ebe5da` ≈ 14:1; `#5b544a` lede ≈ 6.3:1; `#7a7266` labels ≈ 4.1:1 at 12px caps, used for labels only.

## Responsive rules

- ≥1280: two columns, phone 300px wide, height-limited by `(100vh − 120px) × 0.48`.
- 1024: same layout, the copy column shrinks to 260px.
- ≤820: one column, stage first, phone `min(240px, 100vw − 96px)`, headline 44px, hint flows under the phone.
- At 375 wide the phone is 240px and every in-screen size scales through `cqw`. The stage clips overflow so the 3D turn never creates horizontal scroll.
- Never scale the phone with `transform: scale()`; size the rig and let `cqw` do the rest.

## Acceptance checklist

### Always

- [ ] The device is HTML/CSS only: no images, no device SVG.
- [ ] Every size inside the device is in container units of the rig.
- [ ] At least three Z-offset depth layers give visible thickness when tilted.
- [ ] Finish, screen and stage are radio groups with legends; finish swatches have 40px targets.
- [ ] Tilt eases toward a target with a lerp, stops its rAF when settled, and returns to a rest pose on leave.
- [ ] Reduced motion: no tilt, no transitions; every control still works.
- [ ] The side button is a real button with an enlarged hit area and `aria-pressed`.
- [ ] No horizontal scroll at 375px wide.

### This demo

- [ ] Four finishes: Raw, Graphite, Dune, Fjord, using the ramps in Tokens.
- [ ] Three screens: Lock (9:41, "Sunday 4 October", Fieldnote reminder), Journal (5 dated entries, "Search 214 notes"), Run (8.42 km, pace 5'24", time 45:28, climb 62 m, splits).
- [ ] Island widens to 52cqw with "Run 24:18" only on the Run screen.
- [ ] Rest pose `rotateX(5deg) rotateY(-20deg)`, perspective 1100px.
- [ ] Headline "Hold it to *the light.*" in Instrument Serif, italic half in ochre.

## Implementation notes

**Edge and thickness.** The edge is one gradient that fakes a rounded titanium band: dark at the outer 1.6%, a highlight just inside, flat mid-tone across. Stack depth layers behind it.

```css
.phone { aspect-ratio: 300/628; transform-style: preserve-3d;
  transform: rotateX(calc(var(--rx,5)*1deg)) rotateY(calc(var(--ry,-20)*1deg)); }
.depth { position:absolute; inset:0; border-radius:15.5cqw; background:var(--f4); }
.depth.d1 { transform:translateZ(-4px); background:var(--f2); }
.depth.d2 { transform:translateZ(-8px); background:var(--f3); }
.depth.d3 { transform:translateZ(-12px); }
.depth.d4 { transform:translateZ(-16px); }
.edge { position:absolute; inset:0; border-radius:15.5cqw; padding:1.7cqw;
  background:linear-gradient(90deg,var(--f4),var(--f1) 1.6%,var(--f2) 5%,var(--f2) 95%,var(--f1) 98.4%,var(--f4));
  box-shadow:inset 0 0 0 .35cqw rgba(255,255,255,.25),
             inset 0 .8cqw .6cqw -.4cqw rgba(255,255,255,.55),
             inset 0 -.8cqw .8cqw -.4cqw rgba(0,0,0,.35); }
```

**Tilt loop.** Write unitless numbers to custom properties and let CSS multiply by `1deg`, so the same value drives the glare and the shadow.

```js
const REST = { rx: 5, ry: -20 }; let t = { ...REST }, c = { ...REST }, raf = 0;
function tick() {
  c.rx += (t.rx - c.rx) * .1; c.ry += (t.ry - c.ry) * .1;
  phone.style.setProperty('--rx', c.rx); phone.style.setProperty('--ry', c.ry);
  screen.style.setProperty('--gx', 42 - c.ry * 1.6);
  raf = Math.abs(t.rx - c.rx) + Math.abs(t.ry - c.ry) > .02 ? requestAnimationFrame(tick) : 0;
}
stage.addEventListener('pointermove', e => {
  const r = stage.getBoundingClientRect();
  t = { rx: -((e.clientY - r.top) / r.height - .5) * 24, ry: ((e.clientX - r.left) / r.width - .5) * 56 };
  if (!raf) raf = requestAnimationFrame(tick);
});
```

**Keys behind, button in front.** Decorative keys sit at `translateZ(-8px)` so the edge overlaps their inner half. The clickable side button must sit at `translateZ(1px)`: in a 3D context, hit testing follows Z, and a button behind the edge never receives the click.

Common mistakes:

- Using `box-shadow` spread for thickness. It scales with the element and reads as a halo, not depth.
- Putting `overflow: hidden` on `.phone`; it flattens `preserve-3d`. Clip on the stage instead.
- A drop shadow attached to the phone. The floor shadow is a separate blurred ellipse that stays on the floor.
- Leaving the rAF running forever after the pointer stops.
- Drawing a brand logo on the device. Corvo is invented; keep the back and edge blank.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
