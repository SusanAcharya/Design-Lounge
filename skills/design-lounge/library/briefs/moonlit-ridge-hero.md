<!-- Design Lounge Nº 529 · "Le Dernier Feu" · www.designlounge.live -->

# Le Dernier Feu

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A full-viewport night hero for **Le Dernier Feu**, a fictional mountain hut above Chamonix that serves dinner only after the last lift closes. The sky is drawn with real light on one `<canvas>`: a cold indigo gradient, about 650 stars, a crescent moon with a three-layer halo, four sharp Alpine ridgelines receding in blue with mist pooled between them, snow faces lit on the side that turns toward the moon, a small hut with glowing windows, embers rising from its chimney and flickering valley lights. Over it sits a giant overlapping serif name ("Le Dernier" in bone, "*Feu*" in italic amber), a small French subtitle tucked beside it, corner readouts (coordinates, altitude, local time), a live Chamonix clock and a pill counting down to the kitchen opening. A small "Hear the fire" button starts a quiet WebAudio fire-and-wind bed made from filtered noise, which also drives the waveform line.

Use it when the product is tied to **a place and an hour**: a label, a venue, a festival, a hotel, a late show, a night market, an observatory, a ferry. Reach for it when the person asks for spectacle. What makes it worth copying is that the place and the time are both live: the clock is that place's clock, the countdown is to the hour that matters, and the light is layered (halo, haze, glow, lit faces) rather than flat.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ Δ Le Dernier Feu      THE RULE  MENU  THE WALK  BOOK    ● CHAMONIX 18:47:20 │ 76px header
│ 45.9052° N                                                MOUNTAIN HUT │ meta @ top 96
│ 6.8915° E                                     ( ☾ )      LAST LIFT 16:45 │ moon .76W .19H
│ ALT. 2,412 M                                halo r×9         24 COVERS │
│                                               /\  /\                   │
│ L E   D E R N I E R  (bone, 198px)     /\/\  /░░\/░░\/\                 │ ridge 0 (lit faces)
│                                       /░░  \/        \/\               │
│ Refuge,      F E U  (amber italic,    ~~~~ mist ~~~~                   │ ridge 1 (faint snow)
│ 2412 m       indent 24vw, up .2em)        /\/\  ⌂ · ·                  │ ridge 2 + hut + lights
│ DINNER AFTER THE LAST LIFT         · ·  ·  ·   ·  ·                    │ ridge 3 + lights
│ ~~~~~~~~~~~~~~~~~~~~~~~~~ amber waveform @ .868H ~~~~~~~~~~~~~~~~~~~~~~ │
│ A mountain hut above…        ( ▶ HEAR THE FIRE ) ( ● KITCHEN OPENS AT 19:30 )│ foot, 34px bottom pad
└────────────────────────────────────────────────────────────────────────┘
then: section.next, 84px top / 96px bottom padding
```

- `section.hero`, `height: 100vh; min-height: 560px`, flex column, content pushed to the bottom with `justify-content: flex-end`, side padding `--pad`, bottom padding 34px.
- `canvas#sky[aria-hidden]` absolutely fills the hero at `z-index: -2`. `div.grain[aria-hidden]` sits above it at `z-index: -1`. `.hero::after` adds a bottom 30% fade to `rgba(6,7,12,.72)`.
- `header.top` (absolute): `a.mark` (inline SVG flame + span), `nav` with four links, `p.clock` with `span.dot` and `time#clk`.
- `div.meta.tl` and `div.meta.tr`, each three `span`s.
- `h1.title` starting with a visually hidden `span.vh` holding "Le Dernier Feu", then two `span.ln` lines, both `aria-hidden`. Line 1: `span.w` (the mask) holding one `span.ch` per letter (the space becomes `&nbsp;` so it keeps its width). Line 2: `span.fr[lang=fr]` with a `small` line, then `span.gl` (the glow wrapper) around `em.w` (the mask) with per-letter spans.
- `div.foot`: `p.sub`, then `div.ctl` with `button.play[aria-pressed]` and `div.status[role=timer]`.
- `section.next#rule`: `p` kicker and `h2`.

## Motion

| Element | Trigger | Property | From → to | Duration | Easing | Delay / repeat | Reduced motion |
|---|---|---|---|---|---|---|---|
| Title letters | load | transform | translateY(105%) → none | 1100ms | `--ease` | 80ms + n × 60ms, counted across both words ("Feu" starts at letter 10, 680ms) | shown at once |
| Subtitle block | load | opacity | 0 → .9 | 1200ms | `--std` | 800ms | shown at once |
| Stars | always | alpha | a × (.55 + .45 sin(t × s + p)), s .4 to 2.2 | per frame | sine | infinite | fixed at .8a |
| Moon, ridges, hut, stars, embers | pointer | offset | layer × (pointer − .5) | per frame | 5% lerp | stars 5, moon 16, ridges 8/18/32/54, embers +30 px | none |
| Same layers | scroll | translateY | scrollY × .08 stars, .22 moon, .04/.11/.18/.25 ridges, .3 waveform | per frame | none | capped at one hero height | none |
| Snow faces | pointer | lit side | follows the moon's x as it shifts | per frame | none | none | static |
| Valley lights | always | alpha | .62 + .38 sin(t·.003 + f) sin(t·.0017 + f) | per frame | sine | infinite | fixed .8 |
| Hut windows | always | alpha | .78 + .22 sin(t·.011) sin(t·.0037 + 1) | per frame | sine | infinite | fixed .9 |
| Embers | always | alpha, x, y, size | rise, drift right, sway, shrink, sin² fade | 3 to 7s per ember | sine | infinite | hidden |
| Waveform | always | y | 5px ripple, ×3.5 within 25% of pointer x; live audio ×140 clamped ±40px | per frame | none | infinite | static ripple |
| Live dot, status lamp | kitchen open | box-shadow ring | 0 → 10px, .7 → 0 alpha | 1600ms | ease-out | infinite | static red |
| Nav underline | hover | scaleX | 0 → 1 from left | 320ms | `--ease` | none | instant |
| Sound pill | hover | border, disc fill | line → amber 60%, bone → amber | 200ms | `--std` | none | instant |
| Sound disc | active | scale | 1 → .94 | 240ms | `--ease` | none | instant |
| Sound gain | click | gain | 0 → .6 / current → 0 | 2500ms / 800ms | linear ramp | none | same (audio is not motion) |

Keep it cheap enough for a slow phone. The sky, the moon's halo, and each ridge (with its snow faces and mist) are painted once into offscreen layers. The sky and the back three ridges are composited into one image, and the front ridge into another. They are rebuilt only when the pointer or the scroll moves them. Each frame copies those two images and draws only what flickers: stars, the halo and moon (clipped to the sky above the back ridge), lamps, the hut, embers and the waveform. The loop starts on its own, runs at 30fps, and stops when the hero is off screen or the tab is hidden. The canvas resolution is capped at 1.5x. The waveform glow is a 7px stroke at .16 alpha under the 1.2px line, not `shadowBlur`. The pill buttons use a solid `rgba(6,7,12,.82)` fill, not `backdrop-filter`, because a blur over a moving canvas is redone every frame.

Pause the animation loop with an `IntersectionObserver` when the hero leaves the viewport. Never run a loop while reduced motion is on, except while the sound plays (so the live waveform still works).

## States

- **Kitchen closed** (22:00 to 19:29 Paris): grey lamp `#3a3f5c`, bone title "Kitchen opens at 19:30", "in hh:mm:ss". Header dot at 40% bone.
- **Kitchen open** (19:30 to 21:59 Paris): lamp and header dot `--flame` with the pulse ring, title "Kitchen open" in flame, "Last plates 22:00".
- **Sound pill idle**: 1px `--line` border, `rgba(6,7,12,.5)` fill with 10px backdrop blur, bone 40px disc with a dark play triangle, text "Hear the fire".
- **Sound pill hover**: border amber at 60%, disc turns amber.
- **Sound pill playing** (`aria-pressed="true"`): amber border, `rgba(255,176,74,.1)` fill, amber disc with a 10px rounded square, text "Sound off". This is the visible off control.
- **Nav links**: bone-dim, hover to bone plus a 1px amber underline growing from the left.
- **Wordmark hover**: the flame mark lifts 3px and scales to 1.08 over 800ms.
- **Focus-visible** everywhere: 2px amber outline, 3px offset, 4px radius.
- **Fonts loading**: the canvas does not depend on fonts; redraw once on `document.fonts.ready` anyway.

## Accessibility

- The canvas and grain are decorative: `aria-hidden="true"`. Nothing in them is interactive.
- The h1 starts with a visually hidden "Le Dernier Feu" and both visual lines are `aria-hidden`, so screen readers hear the name once instead of letter spans and the subtitle.
- The subtitle block has `lang="fr"`.
- The clock is a `<time>` with `datetime` kept in sync. The status pill is `role="timer"` (implicitly not announced every second) with `aria-atomic="true"`. Do not use `aria-live="polite"` on a ticking element.
- The sound control is a real `<button>` with `aria-pressed` and visible text that changes ("Hear the fire" / "Sound off"). Its icons are `aria-hidden`.
- Sound starts only after a click and stops on the second click. Never autoplay.
- Contrast: bone on the darkest sky is about 17:1, bone-dim readouts about 9:1, amber "Feu" on indigo about 9:1. The paragraph keeps 4.5:1 or better thanks to its dark text-shadow over the lights.
- Hit targets: sound pill 56px tall, nav links at least 24px with 6px vertical padding.
- Tab order: wordmark, four nav links, sound button.

## Responsive rules

- **≥ 1280**: as described; the title caps at 232px.
- **1024**: same layout. The title is 159px. The moon stays at .76W, clear of "Le Dernier".
- **≤ 900**: the nav and the subtitle block hide, "Feu" indents only 10vw, and the bottom row stacks (paragraph above the controls).
- **< 640**: the right corner readout hides, the title becomes clamp(60px, 20vw, 120px) so "Le Dernier" fits on one line at 360, the controls wrap onto two rows. Ridge heights shrink with the aspect ratio (the A factor above). Rebuild the canvas on resize (debounced 120ms) so stars, ridges, lights and the hut refill the new size.
- Cap the canvas device pixel ratio at 2.

## Acceptance checklist

**Always**
- [ ] The whole sky is one canvas with the scene numbers above; no image files.
- [ ] The moon has three stacked radial halos drawn with `lighter`, and a dark limb that blocks the halo behind it.
- [ ] At least three ridgelines, each darker than the one behind, with a mist gradient pooled at the base of each.
- [ ] Lights and embers glow through a pre-rendered radial sprite, not `shadowBlur` per dot.
- [ ] Pointer moves layers by different amounts (nearest moves most), eased at 5% per frame; scroll sinks deeper layers faster.
- [ ] The title letters rise through a mask with 60ms stagger; the amber word's glow is not clipped into a rectangle.
- [ ] The clock shows the place's time from `Intl.DateTimeFormat` with `timeZone`, not the visitor's local time.
- [ ] The countdown pill switches state and copy when the window opens and when it closes.
- [ ] No sound before a click; second click fades out in 0.8s; `aria-pressed` and the visible text stay in sync.
- [ ] Reduced motion: no letter rise, no twinkle, no embers, no parallax; one complete static frame.
- [ ] Focus rings visible on every link and the button; at most two Google font families; demo under 40 KB.

**This demo**
- [ ] Title reads "Le Dernier" in bone and "*Feu*" in `#ffb04a` italic, overlapping by 0.2em.
- [ ] Subtitle reads "Refuge, / 2412 m" with "DINNER AFTER THE LAST LIFT" under it; only Instrument Serif is loaded.
- [ ] Ridges are sharp and Alpine, with snow faces lit on the side facing the moon.
- [ ] Clock reads "CHAMONIX hh:mm:ss" in Europe/Paris time.
- [ ] Closed copy: "Kitchen opens at 19:30 / in hh:mm:ss"; open (19:30 to 22:00): "Kitchen open / Last plates 22:00".
- [ ] Corner readouts show 45.9052° N, 6.8915° E, Alt. 2,412 m and Mountain hut, Last lift 16:45, 24 covers.
- [ ] "Hear the fire" plays crackling fire and wind made from filtered noise; "Sound off" stops it.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 1280×800: a deep indigo sky, darkest at the top (`#03050a`), brightening to `#24305e` at the horizon. A crescent moon with a soft warm halo sits at 76% across and 19% down. Four ridgelines fill the lower half: the back one tall, jagged and snow-lit, the next three darker, with blue mist pooled in each valley.
2. On the two back ridges, every slope that turns toward the moon carries a pale snow highlight that fades downward; slopes turned away carry a faint shadow. Faces left of the moon light up when they descend to the right, faces right of the moon when they descend to the left, so the light reads as coming from the moon.
3. A 76px header sits on top: flame mark + "Le Dernier Feu" wordmark at left, four mono links in the middle (The Rule, Menu, The Walk, Book), and "● CHAMONIX 18:47:20" at right.
4. Corner readouts sit at 96px from the top: left "45.9052° N / 6.8915° E / ALT. 2,412 M", right "MOUNTAIN HUT / LAST LIFT 16:45 / 24 COVERS". The header clock is the third readout, top right.
5. The title fills the left two-thirds: "Le Dernier" at 198px (15.5vw), then "*Feu*" in amber italic, pulled up by 0.2em so its ascenders cut into "Le Dernier", indented by 24vw. A soft amber glow surrounds "Feu". The italic subtitle "Refuge, / 2412 m" (French, `lang="fr"`) sits in the indent under "Le Dernier", with "DINNER AFTER THE LAST LIFT" in 10.5px mono caps below it.
6. On load the title letters rise out of a mask one by one (1.1s each, 60ms stagger, "Le Dernier" first then "Feu"). The subtitle block fades in at 800ms.
7. A small hut silhouette sits on the third ridge at 63% across, two amber windows glowing through a 60px sprite. About 30 embers rise from its chimney, drift right on the wind, sway, shrink and fade.
8. Bottom row: a 3-line paragraph at left (with "*by firelight*" in serif italic), and at right a "Hear the fire" pill plus the status pill "Kitchen opens at 19:30 / in 01:12:40".
9. A thin amber waveform line crosses the full width at 86.8% of the height, just above the bottom row. At rest it ripples gently and swells near the pointer's x position.
10. The clock and countdown tick every second, aligned to the real second boundary, in **Europe/Paris** time regardless of the visitor's timezone (daylight saving handled by `Intl`).
11. Between 19:30 and 21:59 Paris time the pill flips: the lamp turns flame red and pulses, the title reads "Kitchen open" in red, and the second line reads "Last plates 22:00". The dot next to the header clock pulses red too.
12. Moving the pointer over the hero shifts the layers: stars 5px, moon 16px, ridges 8/18/32/54px (the hut rides on ridge 3), embers 30px more than the hut, all eased (5% per frame). Scrolling down pushes deeper layers down faster, so the scene sinks with depth.
13. Valley lights flicker independently on the two front ridges.
14. Clicking "Hear the fire" starts the fire-and-wind bed, fading in over 2.5s. The pill turns amber, the text becomes "Sound off", the icon becomes a square, and the waveform line now draws the live audio signal. A second click fades it out over 0.8s and the text returns. Nothing makes sound before that first click.
15. Below the hero, a short dark band ("01 The Rule" + one serif sentence) gives the scroll parallax somewhere to go.

## Tokens

```css
:root {
  /* colour */
  --ink: #06070c;                      /* page, nearest ridge, pill fills */
  --indigo: #18234a;                   /* low sky, back ridge base */
  --bone: #ece6d6;                     /* "Le Dernier", text, stars */
  --bone-dim: rgba(236,230,214,.62);   /* readouts, paragraph, nav */
  --line: rgba(236,230,214,.16);       /* pill borders, hairlines */
  --amber: #ffb04a;                    /* "Feu", hut windows, embers, lights, waveform, playing state */
  --flame: #e8442e;                    /* live dot and lamp, only while the kitchen is open */
  --sky-top: #03050a; --sky-mid: #0a1022; --sky-low: #18234a; --sky-horizon: #24305e;
  --ridge-1: #141b3c; --ridge-2: #0b0f24; --ridge-3: #06070d;
  --snow: #eef0ff; --snow-shade: #05081a;

  /* type */
  --serif: "Instrument Serif", "Times New Roman", serif;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --fs-title: clamp(88px, 15.5vw, 232px);
  --fs-sub-title: .16em;               /* of the title */
  --fs-mark: 22px;
  --fs-sub: 13.5px;
  --fs-readout: 10.5px;
  --fs-nav: 11px;

  /* layout */
  --pad: clamp(20px, 4.4vw, 56px);
  --header-h: 76px;
  --play-h: 56px;
  --play-disc: 40px;

  /* motion */
  --ease: cubic-bezier(.16, 1, .3, 1);     /* expo out: letter rise, hovers */
  --std: cubic-bezier(.2, .7, .2, 1);      /* colour changes, fades */
  --t-rise: 1100ms; --t-stagger: 60ms;
  --t-sub-title: 1200ms; --t-sub-title-delay: 800ms;
  --t-fade-in: 2500ms; --t-fade-out: 800ms;
}
```

Scene numbers (canvas CSS pixels, W×H = hero size):

| Thing | Value |
|---|---|
| Sky gradient | vertical: 0 `#03050a`, .38 `#0a1022`, .66 `#18234a`, 1 `#24305e` |
| Milky Way wash | linear from (.05W, 0) to (.5W, .7H), `rgba(120,135,210,.05)` at the middle, `lighter` |
| Stars | W×H/2600 (≈394), y = rand^1.5 × .7H, size .35 to 2.05px; plus 260 faint stars on the diagonal band |
| Bright stars | size > 1.4px get a 20px bone glow sprite at half their alpha |
| Moon | r = max(26, min(W,H) × .052) ≈ 42px; centre (.76W, .19H) |
| Crescent | disc filled radial `#fff8e6` → `#e6d8b4`, minus a circle of .9r offset (+.46r, −.24r) |
| Dark limb | full disc `#0e1430` at .55 alpha, then `#c8cdeb` at .06 (earthshine) |
| Halo | 3 radials centred (−.35r, +.15r) from the moon: .6r→9r at .16, .6r→3r at .20, .7r→1.6r at .26, warm `rgba(255,222,176,a)`, `lighter` |
| Valley glow | radial at (.5W, .95H), radius .6W, `rgba(255,150,70,.11)` → 0, `lighter` |
| Ridges | 129-point midpoint displacement, then height = t^sharp; base .64/.72/.81/.90 H; height .36/.17/.09/.05 × A, where A = H × min(1, .55 + .4W/H) so portrait screens don't get needles; roughness .70/.64/.55/.46; sharp 1.6/1.35/1.1/1; seeds 11/23/37/53 |
| Back ridge fill | from its highest point down .4H: `#59628f` 0, `#2e366b` .12, `#1b2250` .4, `#151b42` 1 |
| Moon wash | clipped to the back ridge: radial at the moon, radius .45W, `rgba(255,228,190,.2)` → 0 |
| Snow faces | ridges 0 and 1, only above 28% of the ridge height; per segment, f = slope × sign(moonX − segmentX); f > .04 lit `#eef0ff`, f < −.04 shade `#05081a`; depth 3 + min(1,\|f\|) × .16 × height × altitude; vertical gradient opaque → 0 over 1.3 × depth; alpha min(1, 1.5\|f\|) × altitude ramp × (.9 lit on ridge 0, .36 on ridge 1, .45 shade) |
| Mist | after ridge i: band from (next base − .2H) to next base, transparent → `rgba(90,105,160, .30 − .07i)` |
| Valley lights | W/5 (≈256); 22% on ridge 2 at .55 strength, the rest on ridge 3 down to the bottom; 82% `#ffb04a`, 18% `#dfe8ff`; radius .4 to 1.5px |
| Light glow | warm lights with r > 1.05 get a 12r amber sprite at .32 × flicker |
| Hut | on ridge 2 at .63W, scale s = clamp(.8, H/800, 1.4); 20s wide walls, 7s tall, roof peak 17s with 3s eaves, 3×6s chimney; filled with the ridge colour; two 3.4×3.6s windows `#ffc56e`; 60s amber sprite at .5 × flicker |
| Embers | 30 from the chimney top; cycle 3 to 7s; rise .16 to .40H; drift 20 to 110px right; sway 6 to 22px; sprite 6 to 16px shrinking 60%; 1.4px core `#ffe2a8`; alpha sin²(π·life) × (1 − life/2) |
| Waveform | y .868H, sampled every 3px, `rgba(255,176,74,.8)`, 1.2px, `shadowBlur 8` |
| Grain | 160px noise tile generated at runtime, `opacity: .045` |

## Typography

| Role | Family | Size | Weight | Line-height | Letter-spacing | Case |
|---|---|---|---|---|---|---|
| "Le Dernier" | Instrument Serif | clamp(88px, 15.5vw, 232px) | 400 | 0.82 | −0.04em | Title |
| "Feu" | Instrument Serif italic | same | 400 | 0.82 | −0.04em | Title, `--amber` |
| Subtitle "Refuge, 2412 m" | Instrument Serif italic | 0.16em of title (≈32px) | 400 | 1.1 | 0 | as written, 90% opacity |
| Subtitle small line | mono | 10.5px | 400 | 1.6 | 0.18em | UPPER |
| Wordmark | Instrument Serif | 22px | 400 | 1 | 0 | Title |
| Nav, clock | mono | 11px | 400 | 1.6 | 0.14em (time 0.08em) | UPPER, tabular nums |
| Corner readouts | mono | 10.5px | 400 | 1.6 | 0.16em | UPPER, tabular nums |
| Paragraph | mono | 13.5px | 400 | 1.65 | 0 | Sentence, max 420px |
| Paragraph emphasis | Instrument Serif italic | 1.4em | 400 | 1 | 0 | lower, bone |
| Sound button text | mono | 11px | 600 | 1 | 0.14em | UPPER |
| Status title | mono | 11px | 600 | 1.6 | 0.14em | UPPER |
| Status line | mono | 12px | 400 | 1.6 | 0 | Sentence, tabular nums |
| Next h2 | Instrument Serif | clamp(34px, 4.4vw, 58px) | 400 | 1.04 | −0.02em | Sentence |

Load one Google family: `Instrument+Serif:ital@0;1`. The mono is the system stack. The paragraph has `text-shadow: 0 1px 14px rgba(6,7,12,.95)` so it reads over the lights.

## Implementation notes

1. **Re-skinning for another place.** Keep the layer stack (sky, light source, 3 to 4 silhouettes, mist, lights, drifting warm lights, waveform) and swap the silhouette generator. Ridges come from midpoint displacement (roughness .45 to .7) raised to a power for sharpness (1 for rolling hills, 1.6 for Alpine peaks). For a **skyline**, replace it with stepped rectangles of random width 20 to 80px and height, and put lights in a grid inside them as windows. For a **sea**, draw 3 flat bands with a slow sine edge (amplitude 2 to 6px) and reflect the moon as a vertical column of short amber dashes. For **dunes**, use the same displacement with roughness .35, sharpness 1 and a warm sky, and drop the snow faces. Then change three constants: the timezone string, the hour window and the copy. A Lisbon fado bar might use `Europe/Lisbon` and 22:00 to 02:00; a desert festival `Asia/Dubai` and sunset. If the place has a local name in another script, set it in the subtitle slot with a matching script face as the second font family, with the right `lang`.

```js
function ridge(seed, base, amp, rough, sharp) {
  const R = rng(seed), n = 129, p = new Array(n).fill(0);
  p[0] = R(); p[n - 1] = R();
  for (let step = n - 1, sc = 1; step > 1; step /= 2, sc *= rough)
    for (let k = step / 2; k < n; k += step)
      p[k] = (p[k - step / 2] + p[k + step / 2]) / 2 + (R() - .5) * sc;
  const lo = Math.min(...p), hi = Math.max(...p);
  return p.map((v) => base - Math.pow((v - lo) / (hi - lo), sharp) * amp);
}
const rng = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
```

Use a seeded PRNG so the horizon is the same on every visit. `Math.random()` is fine for flicker and audio only.

2. **Drawing light.** Light is additive. Switch to `globalCompositeOperation = 'lighter'` for stars, halos, valley glow, lights, hut windows and embers; switch back to `source-over` for the moon body, ridges and snow faces. Stack halos of different radii instead of one big gradient: a wide faint one (9r) gives atmosphere, a medium one (3r) gives the glow, a tight one (1.6r) gives the corona. Offset them toward the lit side of the crescent. Pre-render one radial sprite per colour and `drawImage` it; `shadowBlur` on hundreds of dots will drop frames.

```js
function sprite(r, rgb, core) {
  const c = document.createElement('canvas'); c.width = c.height = r * 2;
  const g = c.getContext('2d'), gr = g.createRadialGradient(r, r, 0, r, r, r);
  gr.addColorStop(0, `rgba(${rgb},1)`);
  gr.addColorStop(core, `rgba(${rgb},.35)`);
  gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, r * 2, r * 2); return c;
}
const halo = (r0, r1, a) => {
  const g = x.createRadialGradient(hx, hy, r0, hx, hy, r1);
  g.addColorStop(0, `rgba(255,222,176,${a})`);
  g.addColorStop(.4, `rgba(255,210,160,${a * .32})`);
  g.addColorStop(1, 'rgba(255,210,160,0)');
  x.fillStyle = g; x.fillRect(hx - r1, hy - r1, r1 * 2, r1 * 2);
};
x.globalCompositeOperation = 'lighter';
halo(mr * .6, mr * 9, .16); halo(mr * .6, mr * 3, .2); halo(mr * .7, mr * 1.6, .26);
```

Depth comes from mist: after each ridge, fill a band that fades from transparent to a pale blue at the next ridge's base, then draw the next ridge over it. Clip the back ridge and paint a radial wash at the moon's position so the peaks nearest the moon catch light. Then add the snow faces: walk the ridge segment by segment, multiply the slope by the sign of (moon x − segment x) so the lit side flips as you pass under the moon, and paint a short quad under each facing segment with a vertical gradient that fades to nothing. Hard-edged quads look like shards; the gradient makes them read as snow.

```js
const f = (p[i + 1] - p[i]) / dx * Math.sign(mcx - x0 - dx / 2);
if (Math.abs(f) < .04) continue;
const g = x.createLinearGradient(0, y0, 0, y0 + d * 1.3);
const c = f > 0 ? '238,240,255' : '5,8,26';
g.addColorStop(0, `rgba(${c},1)`); g.addColorStop(1, `rgba(${c},0)`);
x.globalAlpha = Math.min(1, Math.abs(f) * 1.5) * altitudeRamp * (f > 0 ? snow : .45);
```

3. **Timezone clock and countdown.** Read the time from `Intl`, not from `getHours()` plus an offset (offsets break with daylight saving; Paris moves between UTC+1 and UTC+2). Align the interval to the second boundary so the display never skips.

```js
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
const OPEN = 19 * 3600 + 30 * 60, CLOSE = 22 * 3600;
function tick() {
  const p = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
  const sec = (+p.hour % 24) * 3600 + +p.minute * 60 + +p.second;
  const open = sec >= OPEN && sec < CLOSE;
  status.classList.toggle('open', open);
  title.textContent = open ? 'Kitchen open' : 'Kitchen opens at 19:30';
  line.textContent = open ? 'Last plates 22:00' : `in ${hms((OPEN - sec + 86400) % 86400)}`;
}
tick();
setTimeout(() => { tick(); setInterval(tick, 1000); }, 1000 - (Date.now() % 1000));
```

4. **Gesture-gated fire and wind.** Build the graph inside the click handler, never at load. Fill one 2-second buffer with white noise and reuse it for everything. Wind: loop it through a 420Hz bandpass (Q .9) at gain .07, with one LFO sweeping the cutoff ±260Hz at 0.09Hz and another moving the gain ±.04 at 0.13Hz. Fire bed: loop it through a 240Hz lowpass at gain .16. Crackles: every 200ms, schedule 0 to 3 short slices of the buffer through a 1.8 to 4.8kHz highpass, peaking at .08 to .28 within 2ms and decaying exponentially over 10 to 50ms; 12% of them are pops instead (700Hz bandpass, peak .5, 90ms). Fade the master in and out; suspend the context after the fade so it costs nothing.

```js
function noise(dest, type, f, q, g) {
  const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), gn = ac.createGain();
  s.buffer = buf; s.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = q; gn.gain.value = g;
  s.connect(fl); fl.connect(gn); gn.connect(dest); s.start(0, Math.random() * 2);
  return { fl, gn };
}
function crackle() {
  for (let i = 0, c = Math.floor(Math.random() * 4); i < c; i++) {
    const t = ac.currentTime + .02 + Math.random() * .18;
    const s = ac.createBufferSource(), hp = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = buf; hp.type = 'highpass'; hp.frequency.value = 1800 + Math.random() * 3000;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.08 + Math.random() * .2, t + .002);
    g.gain.exponentialRampToValueAtTime(.0001, t + .01 + Math.random() * .04);
    s.connect(hp); hp.connect(g); g.connect(out); s.start(t, Math.random() * 1.9, .12);
  }
}
btn.onclick = () => {
  const on = btn.getAttribute('aria-pressed') !== 'true';
  btn.setAttribute('aria-pressed', on);
  if (!ac) buildAudio();
  const now = ac.currentTime, my = ++token;
  out.gain.cancelScheduledValues(now); out.gain.setValueAtTime(out.gain.value, now);
  if (on) { ac.resume(); out.gain.linearRampToValueAtTime(.6, now + 2.5); timer = setInterval(crackle, 200); }
  else { out.gain.linearRampToValueAtTime(0, now + .8); clearInterval(timer);
         setTimeout(() => my === token && ac.suspend(), 900); }
};
```

While playing, route the master through an `AnalyserNode` and draw the waveform from `an.getByteTimeDomainData()`, scaled ×140 and clamped to ±40px.

Common mistakes: putting `text-shadow` on text inside an `overflow: hidden` reveal mask (the glow gets clipped into a visible rectangle; put a `filter: drop-shadow()` on a wrapper outside the mask instead); letting a space inside a split word collapse to zero width (render it as `&nbsp;`); drawing the dark side of the crescent as transparent, so the halo shows through the moon; lighting the same side of every peak regardless of where the moon is; using the visitor's local time; announcing the ticking countdown with `aria-live`; creating the `AudioContext` on load (browsers block it and some log warnings); and racing a restart against the delayed `suspend()` (guard it with a token).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
