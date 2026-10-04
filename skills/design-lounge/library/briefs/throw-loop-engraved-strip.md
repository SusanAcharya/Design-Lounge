<!-- Design Lounge Nº 237 · "Engraved disc throw loop" · designlounge.vercel.app -->

# Engraved disc throw loop

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from acharyasusan.com.np: the small game of catch in her hero valley, where two tiny figures throw a glowing disc back and forth along a curved path and the disc leaves a faint streak. This rebuild makes that the main event, in daylight, for **Fenmoor Disc Club**, a fictional Sunday pickup group. It is a living illustration you can drop behind a hero or a section. Everything (arm wind-up, release, the disc's flight, its wobble, the trail, the catch) runs on a single CSS custom property `--t: 14s`, and the second player is the same animation shifted by half a cycle. A bottom bar adds play/pause, speed and a "show flight path" switch, and reads out the current phase and a throw count. The details worth copying are `offset-path` for the flight and the half-cycle delay trick, which keeps two players in step without any JS timing.

## Reference behaviour

1. First frame (1280×800): a 68px header ("Fenmoor Disc Club" with a pink disc mark at left, "SUN 10:00 · FENMOOR COMMON · FREE" in mono at right). Below it the stage fills the rest, with a 72px control bar at the bottom.
2. Headline at the top left of the stage: "Throw it long." / "Catch it *late.*" ("late." in pink), with a 16px line under it.
3. Scene (SVG, `viewBox 160 180 1280 520`, slice): a hatched sun with an ink outline (r 78), two outline clouds drifting, a far hill band (solid sage + hatch), a mid band (pale sage + hatch), a cream near field with a light hatch and 44 grass tufts, a small tent with a rope of nine bunting flags, and two players about 750 units apart.
4. Ada (left, facing right) holds the disc. At 6–12% of the cycle her arm winds back to 115°; at 14% it snaps forward to −60° and the disc leaves her hand.
5. From 14% to 40% the disc flies along an S-shaped path (rises, dips, rises, drops into Jun's hand), tilting through a scripted wobble, with a white glint flicking across it every 0.35s. A pink comet trail follows: a soft 5px stroke (16 units long) and a 1.6px core (7 units long).
6. At 40% Jun (right, mirrored) reaches −80° and catches. The flying disc hides; the disc in Jun's hand shows.
7. Jun's cycle is the same, shifted by half: he winds up at 56–62% and throws at 64%. The disc flies the same path backwards to Ada (64% → 90%), and Ada catches at 90%.
8. Ambient: the sun rises 60px on load (1.6s), clouds drift (110s and 150s), every third tuft sways, the bunting flutters with a 0.17s offset per flag.
9. Control bar:
   - Pause/Play (44px square button) pauses and resumes every animation in place.
   - Speed (radio group 0.5× / 1× / 2×) changes `playbackRate` on every animation, so nothing restarts or drifts out of sync.
   - "Show flight path" (switch) fades in a dashed guide of the path with a filled dot at the release point, a ring at the catch point, and mono labels "release 14%" and "catch 40%".
   - Readout at right: "Now" with the current phase (Ada holds, Ada winds up, Disc in flight, Jun has it, Jun winds up, Disc coming back, Ada catches) and "Throws" counting each release.
10. Reduced motion: no animation. The disc is shown frozen at 55% of the path with its trail behind it, both held discs hidden, the play button disabled, and the phase reads "Held mid-flight".

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ ◒ Fenmoor Disc Club                 SUN 10:00 · FENMOOR COMMON · FREE │ 68px
├──────────────────────────────────────────────────────────────────────┤
│ Throw it long.                     ☁                  ╭────╮          │
│ Catch it late.                                        │ sun│ hatched  │
│ Sunday pickup for every level…                        ╰────╯          │
│   ⌒⌒⌒⌒ far hills (sage, hatched) ⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒⌒                │
│      ╭── ─ ─ ─ ─ ─flight path─ ─ ─ ─╮                                  │
│  o  ◐~~            ▲ tent + flags     ╲  o                             │
│ /|\                                     /|\    ← Ada left, Jun right   │
│ / \  ,,,  ,,  near field + tufts ,,  ,  / \                            │
├──────────────────────────────────────────────────────────────────────┤
│ [❚❚] [0.5×|1×|2×] (○ Show flight path)              Now: Disc in flight  Throws 3│ 72px
└──────────────────────────────────────────────────────────────────────┘
```

- `header.top`: `span.logo` (inline SVG disc + text), `span.when`.
- `section.stage[aria-labelledby=h]`: `div.copy` (h1, p) and `svg.scene[role=img][aria-label]`.
- In the SVG: `g.sun`, a cloud group, three hill pairs (fill + hatch), `g#tufts`, tent group with `g#flags`, `g.guide`, `g.p-a` and `g.p-b` (the players; each has a `g.arm` holding a `use.held` disc), two `path.trail`, `g.fly > g.tilt > use + path.shine`.
- `div.bar[role=group][aria-label="Throw controls"]`: `button#play`, `div.seg[role=radiogroup]`, `button#path[aria-pressed]`, `div.read`.

## Tokens

```css
:root {
  /* colour */
  --sky: #dfe7e2;          /* stage, lower sky */
  --sky-2: #e9eee9;        /* upper sky, cloud fill */
  --ground: #f1ece0;       /* near field, control bar */
  --hill-far: #a7b7ad;     /* far band */
  --hill-mid: #cdd6cd;     /* mid band */
  --sun: #f6ead2;
  --ink: #22312c;          /* figures, hatch lines, text */
  --ink-2: #4d5b55;        /* paragraph, mono labels */
  --ink-3: #7a8680;
  --line: rgba(34,49,44,.16);
  --accent: #d6336c;       /* the disc, trail, flags, "late." */
  --accent-dk: #a3204f;    /* disc rim */

  /* type */
  --display: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: "Spline Sans Mono", ui-monospace, monospace;

  /* motion */
  --t: 14s;                                  /* one full there-and-back */
  --ease: cubic-bezier(.22, 1, .36, 1);      /* UI and sun rise */
  --flight: cubic-bezier(.3, .55, .55, 1);   /* fast release, floating finish */
  --wind: cubic-bezier(.6, 0, .9, .5);       /* arm snap at release */
}
```

Scene numbers (SVG user units):

| Thing | Value |
|---|---|
| Flight path | `M452 574C540 470 660 420 780 430C880 438 940 470 1010 456C1080 444 1120 500 1148 574` |
| Ada | head r 8 at 424,530; shoulder 432,556; hand and held disc at 452,574 |
| Jun | the same drawing mirrored with `translate(1600 0) scale(-1 1)` |
| Disc | ellipse rx 9 ry 3 pink over a rim ellipse 1.2 lower; inner ring rx 5.2 at 60% |
| Trail | same path, `pathLength="100"`, `stroke-dasharray: var(--len) 300` |
| Hills | far baseline 470 amp 140; mid baseline 540 amp 80; near baseline 612 amp 16 (quadratic bumps) |
| Hatches | 5px at −62° (45%), 7px at −28° (45%), 9px at 18° (20%), sun 6px at 35% (30%) |
| Narrow view | below 760px: `viewBox 390 380 820 260`, `xMidYMax meet`, `overflow: visible` |

## Typography

| Role | Family | Size | Weight | Line-height | Letter-spacing | Case |
|---|---|---|---|---|---|---|
| Headline | Bricolage Grotesque | clamp(36px, 5.4vw, 68px) | 700 | 0.98 | −0.035em | Sentence |
| Headline accent | same | inherit | 700 | — | — | pink |
| Paragraph | Bricolage Grotesque | 16px | 500 | 1.5 | 0 | Sentence |
| Wordmark | Bricolage Grotesque | 18px | 700 | 1 | −0.01em | Title |
| Header meta | Spline Sans Mono | 12px | 500 | 1 | 0.02em | UPPER |
| Buttons, switch | Bricolage Grotesque | 14px | 700 / 500 | 1 | 0 | Sentence |
| Speed chips | Spline Sans Mono | 13px | 500 | 1 | 0 | — |
| Readout label / value | Spline Sans Mono | 12px / 13px | 500 | 1.3 | 0 | Sentence |
| Guide labels (SVG) | Spline Sans Mono | 15 units | 400 | — | — | lower |

## Motion

All throw parts share `--t` (14s) and loop forever. Percentages are of one cycle.

| Element | Property | Keyframes | Easing | Delay | Reduced motion |
|---|---|---|---|---|---|
| Ada arm | rotate around shoulder | 0–6% 0° · 12% 115° · 14% −60° · 22–84% 0° · 90% −80° · 93% −70° · 100% 0° | ease-in-out; `--wind` into 14%; ease-out after | 0 | still |
| Jun arm | same | same | same | `calc(var(--t) / -2)` | still |
| Held disc (each) | opacity | 1 until 13.9% · 0 from 14% to 89.9% · 1 from 90% | steps by keyframe | Jun −t/2 | hidden |
| Flying disc | offset-distance, opacity | hidden to 13.9% · 14% 0% → 40% 100% · hidden 40.1–63.9% · 64% 100% → 90% 0% · hidden after | `--flight` on each leg | 0 | fixed at 55%, visible |
| Disc tilt | rotate | 0–14% −18° · 19% 6° · 24% −8° · 31% −24° · 36% 12° · 40–64% 0° · 69% 16° · 74% −20° · 81% 8° · 86% −6° · 90–100% −18° | ease-in-out | 0 | still |
| Glint | translateX, opacity | −4px, 0 → 4px, 0 (0.9 at 50%) | linear | 0.35s loop | still |
| Trail (soft, core) | stroke-dashoffset, opacity | 14% len → 40% len−100 · fade by 42% · 64% −100 → 90% 0 · fade by 92% | `--flight` | 0 | static streak ending at 55% |
| Sun | translateY, opacity | 60px, 0 → 0, 1 | `--ease` | 1.6s once | still |
| Clouds | translate | −300px → 1900px | linear drift | 110s / 150s (−70s) | still |
| Tufts (every 3rd) | skewX from bottom | −3° → 3° | ease-in-out | 5.5s alternate | still |
| Flags | skewX, scaleY from top | −8° → 8°, 1 → 0.9 | ease-in-out | 1.4s alternate, −0.17s each | still |
| Flight guide | opacity | 0 → 1 | `--ease` | 300ms on toggle | instant |
| Switch knob | translateX | 0 → 16px | `--ease` | 250ms | instant |

Controls act on the running animations through the Web Animations API (`document.getAnimations()`), not by changing `--t`, so speed changes never restart or desync the loop.

## States

- **Play/Pause button**: 44px square, 12px radius, 1.5px ink border. Shows a pause icon while running and a play icon while paused; `aria-label` switches between "Pause" and "Play". Hover: ink fill, cream icon. Active: scale 0.96. Disabled at 40% opacity in reduced motion.
- **Speed chips**: joined segmented control with 1.5px ink borders. Checked chip: ink fill, cream text. Hover on unchecked: 8% ink.
- **Flight path switch**: 38×22 track; off 20% ink, on pink with the knob 16px to the right; `aria-pressed`.
- **Readout**: phase text updates every frame from the disc animation's progress; the throw count increases at 14% and 64%.
- **Focus-visible**: 2px pink outline, 3px offset.

## Accessibility

- The scene is `role="img"` with the label "Two players on a hillside trade a pink flying disc back and forth". Its parts are not focusable.
- The headline is a real `h1` and labels the stage section.
- Pause is always available and is the first control in the bar, so anyone bothered by motion can stop it in one step (WCAG 2.2.2).
- Speed is a `radiogroup` with roving tabindex and Left/Right arrow keys. The path switch is a toggle button with `aria-pressed`.
- The readout is `aria-live="off"`; it changes several times a second and must not be announced.
- Contrast: ink on sky about 11:1; ink-2 paragraph on sky about 6:1; pink on sky about 4.6:1 (used for the large headline word, not body text).
- Targets: every control is at least 44px tall.

## Responsive rules

- **≥ 1280**: as described; the slice crop keeps both players and the tent in view.
- **1024**: same viewBox; the crop trims the sky edges a little more.
- **< 760**: header meta hides. The SVG switches to `viewBox 390 380 820 260` with `meet` and `overflow: visible`, so the whole throw fits the width and the hills and sun still paint above it. The readout moves to its own full-width row under the controls.
- **375**: headline 36px; both players visible near the bottom of the stage; controls wrap to two rows plus the readout. No horizontal scroll.

## Acceptance checklist

**Always**
- [ ] One custom property (`--t`) drives arms, held discs, flight, tilt and trail.
- [ ] The second player uses the same keyframes with `animation-delay: calc(var(--t) / -2)` and a mirrored drawing.
- [ ] The disc follows an SVG-coordinate `offset-path` with `offset-rotate: 0deg` (it must not turn along the curve).
- [ ] Release happens at 14% and 64%; catches at 40% and 90%; the held disc and flying disc swap at exactly those points.
- [ ] Trail uses `pathLength="100"` and a dash of 16 (soft) and 7 (core) units that leads into the catch and fades within 2%.
- [ ] Pause freezes everything in place and resumes from the same frame.
- [ ] Speed uses `playbackRate`; the two players stay in step after any change.
- [ ] The flight-path guide shows the exact path the disc follows.
- [ ] Reduced motion shows a complete still frame with the disc mid-flight.
- [ ] No horizontal scroll at 375px.

**This demo**
- [ ] Club name "Fenmoor Disc Club"; headline "Throw it long. / Catch it *late.*"
- [ ] Players are named Ada (left) and Jun (right) in the phase readout.
- [ ] Guide labels read "release 14%" and "catch 40%".
- [ ] Nine bunting flags alternate pink and ink.

## Implementation notes

1. **Flight with `offset-path`, gated by opacity.** One element flies both ways: forward from 14% to 40%, backward from 64% to 90%. Hide it between legs with near-duplicate keyframe stops (`40%` then `40.1%`) so it does not slide back visibly.

```css
.fly {
  opacity: 0;
  offset-path: path("M452 574C540 470 660 420 780 430C880 438 940 470 1010 456C1080 444 1120 500 1148 574");
  offset-rotate: 0deg;
  animation: fly var(--t) infinite;
}
@keyframes fly {
  0%, 13.9%   { offset-distance: 0%;   opacity: 0; }
  14%         { offset-distance: 0%;   opacity: 1; animation-timing-function: cubic-bezier(.3,.55,.55,1); }
  40%         { offset-distance: 100%; opacity: 1; }
  40.1%, 63.9%{ offset-distance: 100%; opacity: 0; }
  64%         { offset-distance: 100%; opacity: 1; animation-timing-function: cubic-bezier(.3,.55,.55,1); }
  90%         { offset-distance: 0%;   opacity: 1; }
  90.1%, 100% { offset-distance: 0%;   opacity: 0; }
}
```

2. **The comet trail is a dash sliding along the same path.** With `pathLength="100"` and `stroke-dasharray: len 300`, a dash offset of `len` hides it before the start, `len − 100` parks it at the end, `−100` hides it past the end, and `0` parks it at the start.

```css
.trail { fill: none; stroke: var(--accent); stroke-linecap: round;
         stroke-dasharray: var(--len) 300; opacity: 0; animation: trail var(--t) infinite; }
.trail-soft { --len: 16; stroke-width: 5;   stroke-opacity: .16; }
.trail-core { --len: 7;  stroke-width: 1.6; stroke-opacity: .55; }
@keyframes trail {
  0%, 13.9% { stroke-dashoffset: var(--len); opacity: 0; }
  14%  { stroke-dashoffset: var(--len); opacity: 1; animation-timing-function: cubic-bezier(.3,.55,.55,1); }
  40%  { stroke-dashoffset: calc(var(--len) - 100); opacity: 1; }
  42%, 63.9% { stroke-dashoffset: -100; opacity: 0; }
  64%  { stroke-dashoffset: -100; opacity: 1; animation-timing-function: cubic-bezier(.3,.55,.55,1); }
  90%  { stroke-dashoffset: 0; opacity: 1; }
  92%, 100% { stroke-dashoffset: 0; opacity: 0; }
}
```

3. **Mirror the drawing, not the keyframes.** Put Jun's body and arm inside `<g transform="translate(1600 0) scale(-1 1)">` using Ada's coordinates. Rotate the arm with `transform-box: fill-box; transform-origin: 0 0` (the shoulder is the top-left of the arm's box), and his wind-up turns the correct way for free. Writing a second, negated keyframe set is the usual mistake.

4. **Control every animation at once.**

```js
const anims = () => document.getAnimations().filter(a => a.animationName);
const setPaused = p => anims().forEach(a => p ? a.pause() : a.play());
const setRate = r => anims().forEach(a => { a.playbackRate = r; });
// phase: read progress from the flight animation
const fly = document.getAnimations().find(a => a.animationName === 'fly');
const p = (fly.currentTime % fly.effect.getTiming().duration) / fly.effect.getTiming().duration;
```

5. **A different crop for phones.** A wide scene sliced into a tall phone stage loses both players. Swap the viewBox and switch to `meet`, and let the SVG paint outside its viewBox so the sky and hills still fill the space above.

```js
const fit = () => {
  const narrow = innerWidth < 760;
  scene.setAttribute('viewBox', narrow ? '390 380 820 260' : '160 180 1280 520');
  scene.setAttribute('preserveAspectRatio', narrow ? 'xMidYMax meet' : 'xMidYMax slice');
};
fit(); addEventListener('resize', fit);
```

Common mistakes: letting `offset-rotate` default to `auto` (the disc turns on its side along the curve), changing `--t` for speed (every animation restarts from 0), and using `transform-origin` in pixels for the mirrored arm (the origin lands on the wrong side).

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
