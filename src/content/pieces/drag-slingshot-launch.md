---
title: "Slingshot launch to send"
summary: "Pull a paper-plane letter back on a rubber band, watch the dotted arc, let go: it flies with gravity into a mailbox or springs home with a wobble."
platform: web
type: component
category: micro
tags: [drag, physics, slingshot, gravity, keyboard, messaging]
styles: [paper, playful]
motion: rich
difficulty: 3
featured: false
published: 2026-10-31
palette: ["#F2E9DB", "#1B2540", "#B23F28", "#2B4B8A", "#D7BF98"]
fonts: ["Host Grotesk", "Golos Text"]
related: [drag-to-confirm, button-hold-to-confirm, optimistic-like-button]
---

# Slingshot launch to send

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The "send" moment of a fictional pen-pal app, "Postwind". The finished letter sits on an airmail-striped card; its folded paper plane waits in a slingshot at the bottom left, and the pen pal's rural mailbox stands on a mound at the bottom right. You pull the plane back, a rubber band stretches and thins, a dotted arc previews the flight; you let go and the plane flies under real gravity. If its nose enters the open mailbox door, the flag springs up, the card gets a "LANDED" postmark and the next letter loads. If it falls short, overshoots or bounces off the box, it sticks nose-first in the ground, then springs back to the sling with a wobble. The detail worth copying: the preview dots, the flight and the reduced-motion result all come from **one** integrator, so what you aim is exactly what you get, and a keyboard user can aim with arrows and launch with Space.

## Reference behaviour

1. First frame (after 450ms): the plane is already cocked in the sling at 38° and 64% pull, the band is stretched, 16 preview dots trace the first 0.8s of flight, and the ground reads "38° angle · 64% pull" under the sling and "Ines's box · Porto" under the mailbox. A dashed 76px ring around the plane marks the grab handle.
2. On load the plane starts unstretched in the pouch and is drawn back to the aim over 420ms (ease out cubic). That re-cock runs after every return and every new letter too.
3. Pointer down on the ring (primary button only): pointer capture, state `drag`. Moving sets the pull vector from the rest point: length clamps to 150px (P), angle clamps to 4°–84° above horizontal. The plane points along the launch direction, the band thins from 7px to 2.4px with stretch, the dots and the ground readout update every move.
4. Release with pull ≥ 14%: launch velocity = −pull ÷ P × vmax, starting from the pulled position. The band leaves the plane with 45% of the launch velocity and rings back to rest on a stiff spring (k 560, c 9), so you see it twang twice.
5. In flight the plane's rotation follows its velocity. Each 1/120s step: vy += g·dt, both components × (1 − 0.1·dt), position += v·dt.
6. Hit: the nose enters the opening (local box x −74…−46, y −174…−124) while moving right. The plane tweens into the door (200ms, scale to .5) and fades; the flag rotates −90° → 0 on a spring (560ms, `cubic-bezier(.34,1.56,.64,1)`); the box squashes to scale(1.04, .94) and back (300ms); the postmark stamps onto the card (380ms, scale 1.6 → 1, rotate 4° → −14°); "4 sent this week" becomes 5. Live region: "Delivered to Ines Faria in Porto. 5 letters sent this week."
7. After 2200ms the card fades up 8px and swaps to the next pen pal (Ines Faria, Porto → Tomas Lindqvist, Umeå → Aiko Wren, Otaru), the mailbox nameplate changes, the flag drops, and a new plane unfolds in the pouch (scale .2 → 1, 380ms, back-out), then re-cocks to the last aim.
8. Bounce: the nose enters the box body or the post. vx = −|vx| × .35, vy × .4; the plane falls to the ground.
9. Miss: nose reaches the ground (or leaves the screen). The plane sticks with its rotation clamped to 18°–50°, waits 650ms, then springs home: a 2D spring (k 130, c 13) with an upward kick of −260px/s, rotation on its own spring (k 210, c 9). Under-damped on purpose: it overshoots the pouch and wobbles. Live region says why: "Landed short of the mailbox. Add pull or raise the angle." / "Flew past the mailbox. Ease off the pull." / "Bounced off the mailbox. Aim for the open door."
10. Release with pull < 14%: no launch; pull snaps to 14% and the live region says "Too gentle to fly. Pull further back."
11. Keyboard on the focused ring: ↑/↓ angle ±2°, ←/→ pull ±4% (← pulls further back, mirroring the drag), Shift triples the step, Home returns to 38° / 64%, Space or Enter launches. 260ms after the last arrow the live region reads "Angle 46 degrees, pull 70 percent."
12. The default aim lands a little short on purpose, so the first Space press teaches the feedback; 38° at 68–72% delivers.

## Structure

```
1280 × 800, sky gradient, ground band from y = H − 92
┌──────────────────────────────────────────────────────────────────────────┐
│ (●) Postwind                      Outbox  Pen pals  Stamps  4 sent  (MR) │ 20/48 pad
│ ┌─airmail border 7px──────┐                          Pull back.          │
│ │ OUTBOX · BY AIR    (pm) │                          Let it fly.  112px  │
│ │ To Ines Faria  24px     │        Drag the plane back… [↑][↓] angle …   │
│ │ Rua do Almada 14, Porto │                                              │
│ │ - - - - - - - - - - - - │          ☁                        ☁          │
│ │ The figs finally…  15px │                                              │
│ │ 212 words…   Stamp 1.20 │                    ☁        ┌──────────┐ ⚑  │
│ └──── 352px ──────────────┘   · · · · ·                (│  FARIA   │    │
│        ( ✈ )\ /    · ·              · ·                ╲└────┬─────┘    │
│              Y  sling x = 22% W                               │ post     │
│              │                                  ___mound______│_____     │
│▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔│
│        38° angle · 64% pull                          Ines's box · Porto  │
└──────────────────────────────────────────────────────────────────────────┘
```

- `header` with the wordmark link, `nav aria-label="Main"` (current item `aria-current="page"`), the weekly tally, and an initials disc.
- `article.letter` labelled by its `h2` ("To Ines Faria"); the postmark is an inline `svg aria-hidden`.
- `.pitch` holds the `h1` and the hint `p#hint` with `kbd` keycaps; the grab button points at it with `aria-describedby`.
- One full-viewport `svg.scene` (`aria-hidden`, `pointer-events: none`, above the text layer) draws clouds, mound, ground, mailbox, fork, back band, dots, plane, pouch, front band, in that order. Its `viewBox` is `0 0 W H`, so physics runs in CSS px.
- `button.grab` (76px circle) is the only interactive scene element. It follows the plane while it is in the sling and parks on the rest point during flight.
- Two `p.ground-label` readouts (`aria-hidden`) and one visually hidden `p aria-live="polite"`.

## Tokens

```css
:root {
  --sky: #F2E9DB;        /* mid sky; gradient #EFE4D3 → #F2E9DB 52% → #E9DCC6 */
  --sky-2: #E9DCC6;
  --ground: #D7BF98;     /* ground band */
  --ground-line: #BFA273;/* 1px horizon */
  --mound: #CDB287;      /* hill under the mailbox */
  --cloud: #F8F2E8;
  --ink: #1B2540;        /* text, fork, dots, plane outline */
  --ink-2: #4D5367;      /* secondary text, 6:1 on sky */
  --paper: #FFFCF5;      /* card, plane, keycaps */
  --red: #B23F28;        /* airmail red, band, flag, postmark */
  --red-dark: #8E2E1C;   /* back band */
  --blue: #2B4B8A;       /* airmail blue, mailbox */
  --blue-rim: #3E63A8;   /* door rim */
  --post: #5B4530;
  --hole: #0E1630;
  --ring: #6A6F80;       /* dashed grab ring, 3.6:1 on sky */

  --display: "Host Grotesk", system-ui, sans-serif;
  --ui: "Golos Text", system-ui, sans-serif;

  --fs-display: 112px; --fs-card-title: 24px; --fs-body: 15px; --fs-small: 13px; --fs-label: 12px; --fs-eyebrow: 11px;
  --space: 4px 8px 12px 14px 20px 22px 24px 48px;
  --r-card: 6px; --r-key: 5px; --airmail-border: 7px;
  --shadow-card: 0 1px 0 rgba(27,37,64,.08), 0 14px 30px -18px rgba(27,37,64,.45);

  --ease: cubic-bezier(.2,.7,.2,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
  --cock: 420ms; --into-box: 200ms; --flag: 560ms; --stamp: 380ms; --unfold: 380ms; --land-wait: 650ms; --next-letter: 2200ms;

  /* physics, web (phone in brackets) */
  --pull-max: 150px;  /* (86px) */
  --gravity: 1500;    /* px/s², (780) */
  --air-drag: .1;     /* per second */
  --scene-scale: 1.12;/* fork + mailbox (0.64) */
  --plane-scale: 1.3; /* (0.88) */
}
```

vmax = √(2.4 × (mailboxX − slingX) × g), so the arc that reaches the box always sits in the middle of the pull range at any width. Fork in local units: stem 150 tall, prong tips at (±24, −5), stroke 11, red wraps 13 wide. Mailbox local units: body x −58…58, y −178…−120, radius 28 top corners; door ellipse rx 12 ry 29 at x −58; post 12 × 124; flag pole 5 × 64 pivoting at (46, −158).

## Typography

| Role | Family | Size | Weight | Line height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Display | Host Grotesk | 112px (phone 44px) | 800 | 0.9 | −0.055em | Sentence |
| Wordmark | Host Grotesk | 21px | 800 | 1 | −0.04em | Title |
| Card title | Host Grotesk | 24px (phone 20) | 700 | 1.1 | −0.025em | Sentence |
| Mailbox name | Host Grotesk | 13 units | 800 | — | 1.6 units | Upper |
| Letter body | Golos Text | 15px | 400 | 1.55 | 0 | Sentence |
| Nav, hint | Golos Text | 14px | 400 / 600 current | 1.5 | 0 | Sentence |
| Address, meta | Golos Text | 13px / 12px | 400 | 1.5 | 0 | Sentence |
| Eyebrow | Golos Text | 11px | 600 | 1 | 0.12em | Upper |
| Ground readout | Golos Text 12px + Host Grotesk 13px 700 numbers | | 500 | 1.3 | tabular-nums | Sentence |

## Motion

| Thing | Trigger | Property | From → to | Duration / model | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Cock | load +450ms, after return, after new plane | plane position, rotation | rest → aim | 420ms, ease-out cubic | instant |
| Drag | pointer move | plane, band ends, band width, dots | follows pointer | 0 | same |
| Band twang | release | band midpoint | pulled → rest | spring k 560, c 9 | no twang |
| Flight | release | position, rotation | integrator | 1/120s steps, g, drag .1/s | outcome computed instantly |
| Into box | hit | position, scale, opacity | door, .5, 0 | 200ms ease-out + 160ms fade | instant |
| Flag up | hit | rotate | −90° → 0 | 560ms `--spring` | instant |
| Box thunk | hit | scale | (1,1) → (1.04,.94) → (1,1) | 300ms `--ease` | none |
| Postmark | hit | opacity, scale, rotate | 0, 1.6, 4° → 1, 1, −14° | 380ms `--spring` | shown, no motion |
| Stick and return | miss | position, rotation | ground → pouch | wait 650ms, spring k 130 c 13, rot k 210 c 9 | plane never leaves |
| Next letter | 2200ms after hit | card opacity, translateY | 1, 0 → 0, −8px → 1, 0 | 220ms / 320ms `--ease` | instant swap |
| Unfold | new letter | plane scale | .2 → 1 | 380ms back-out | instant |
| Dots | sling states only | opacity | 0 ↔ 1 | 180ms `--ease` | instant |

Under `prefers-reduced-motion: reduce` the same `step()` runs synchronously up to 2400 times on release; a hit shows the delivered state at once, a miss leaves the plane cocked and only announces the result.

## States

- Cocked: dashed ring `#6A6F80` 1.5px; hover darkens it to `--ink`; cursor `grab`, `grabbing` while held.
- Dragging: band 7px → 2.4px (scaled), readout live, dots live.
- Focus-visible on the ring: 3px `--blue` outline, offset 3px, circular.
- Flight / landed / returning / delivered: ring becomes transparent and parks on the rest point; dots hidden; arrows and Space ignored.
- Delivered: flag up, postmark on the card, tally +1.
- Too gentle: pull clamps to 14%, nothing flies.

## Accessibility

- The grab handle is a real `button` named "Paper plane, angle 38 degrees, pull 64 percent", described by the visible hint. The name updates with every change.
- Keys: ↑ ↓ angle, ← → pull, Shift ×3, Home reset aim, Space/Enter launch. Prevent default on all of them so the page never scrolls; Space keyup is also prevented so the button never clicks.
- One polite live region carries aim summaries (debounced 260ms) and every result, with a reason and a correction for each miss. Clear it and write 40ms later so repeated identical messages are re-read.
- The scene SVG is `aria-hidden`; the card, the tally and the live region carry the meaning.
- Contrast: ink on sky ≈ 14:1, `--ink-2` on sky 6.1:1, red eyebrow on paper 5.6:1, paper on blue nameplate 8:1, ink readout on ground ≈ 8:1.
- Hit target: the grab ring is 76px. `touch-action: none` on it so a phone never scrolls mid-pull.

## Responsive rules

- ≥ 1024: as drawn. Sling at max(220px, 22% W), mailbox at 80% W, ground 92px tall.
- 768–1023: same layout; the headline may wrap tighter but stays right-aligned.
- < 700: the card and headline join the normal flow (card 16px gutters, headline 44px left-aligned, keycap hint hidden); scene scale .64, plane .88, sling at x 98, mailbox at W − 70, pull max 86px, gravity 780, ground 96px tall.
- Every resize recomputes the layout and vmax and re-places a cocked plane at the same angle and pull percentage.

## Acceptance checklist

### Always

- [ ] Preview dots, animated flight and reduced-motion result use the same `step()` and agree to the pixel.
- [ ] Pull clamps at the max length and to 4°–84°; a pull under 14% never launches.
- [ ] Band width thins with stretch (7 → 2.4 at full pull) and twangs after release.
- [ ] Plane rotation follows velocity in flight; it sticks nose-first on a miss and springs home with visible overshoot.
- [ ] A hit is detected only when the nose enters the door moving toward the box; the roof and post bounce it.
- [ ] Arrow keys aim, Shift triples, Home resets, Space/Enter launches, nothing scrolls.
- [ ] The live region names the result and what to change.
- [ ] Grab target ≥ 76px with `touch-action: none` and a visible focus ring.
- [ ] Under reduced motion there is no flight, twang or spring, and the outcome is still correct.

### This demo

- [ ] Default aim 38° / 64% lands short; 38° at 68–72% delivers at 1280 × 800.
- [ ] Pen pals cycle Ines Faria (Porto) → Tomas Lindqvist (Umeå) → Aiko Wren (Otaru), nameplate FARIA / LINDQVIST / WREN.
- [ ] Postmark reads "LANDED · 31 OCT"; tally starts at "4 sent this week".
- [ ] Headline "Pull back. Let it fly." at 112px Host Grotesk 800.

## Implementation notes

**One integrator.** Preview, animation and the instant result all call this. Fixed 1/120s steps, several per frame, so a slow frame never changes the arc.

```js
const DT = 1 / 120, AIR = .1;
function step() {
  v.y += g * DT; v.x *= 1 - AIR * DT; v.y *= 1 - AIR * DT;
  p.x += v.x * DT; p.y += v.y * DT;
  const t = nose();                                  // p + rotate(42 × scale)
  if (v.x > 0 && inRect(t, door)) return deliver();
  if (inRect(t, body) || inRect(t, post)) { v.x = -Math.abs(v.x) * .35; v.y *= .4; }
  if (t.y >= groundY - 2) return land(t);
}
// launch: v = (rest - pulled) / P * vmax;  vmax = Math.sqrt(2.4 * (boxX - slingX) * g)
```

**Pull from pointer to polar and back.** Store angle and pull as the source of truth so keyboard and pointer share one state, and resizing keeps the aim.

```js
const dx = e.clientX - off.x - rest.x, dy = e.clientY - off.y - rest.y;
pull = Math.min(1, Math.hypot(dx, dy) / P);
angle = clamp(Math.atan2(dy, -dx) * 180 / Math.PI, 4, 84);
p = { x: rest.x - Math.cos(rad(angle)) * pull * P, y: rest.y + Math.sin(rad(angle)) * pull * P };
rot = -angle;
```

**Spring home.** Semi-implicit Euler, same 1/120s substeps; stop when both distance and speed are tiny, then re-cock.

```js
s.vx += (-130 * (p.x - s.x) - 13 * s.vx) * DT;
s.vy += (-130 * (p.y - s.y) - 13 * s.vy) * DT;
s.vr += (-210 * rot - 9 * s.vr) * DT;
p.x += s.vx * DT; p.y += s.vy * DT; rot += s.vr * DT;
if (Math.hypot(p.x - s.x, p.y - s.y) < .4 && Math.hypot(s.vx, s.vy) < 6) settle();
```

Common mistakes:

- Animating the flight with CSS keyframes and the preview with maths; they drift apart and the dots lie.
- Variable `dt` in the integrator; frame drops change where the plane lands.
- Launching from the rest point instead of the pulled point; the preview starts in the wrong place.
- Hiding the sling handle during flight with `display: none`; it drops keyboard focus.
- A critically damped return; the wobble is what makes the miss feel forgiving.
- Spamming the live region on every pointer move; announce aim only from the keyboard, and results always.
