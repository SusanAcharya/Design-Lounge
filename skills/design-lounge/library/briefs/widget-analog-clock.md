<!-- Design Lounge Nº 225 · "Dress-watch analog clock widget" · designlounge.vercel.app -->

# Dress-watch analog clock widget

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A clock widget drawn as a 38mm dress watch: a gold case, a green lacquer sunburst dial, applied baton indices, faceted dauphine hands and a needle seconds hand that sweeps continuously instead of ticking. It reads the real local time. Two complications sit on the dial: a date window at 3 o'clock and a 24-hour sub-dial at 6 o'clock that shows a second city. Tapping the dial changes the dial colour (four options), the way a collector would swap watches. It lives on a dashboard, a "travel" page or a personal start page. The detail worth copying is the faceted hand: each hand is two triangles in two tones of the same metal, which reads as light catching a ridge.

## Reference behaviour

1. On load the hands show the current local time. The seconds hand moves continuously (60 fps), not in one-second steps.
2. The minute hand also advances smoothly (seconds / 60), and the hour hand advances with minutes (minutes / 60), so the hour hand sits between indices at half past.
3. The date window at 3 o'clock shows today's day of the month in 14px bold. It updates when the date changes.
4. The sub-dial at 6 o'clock is a 24-hour dial: 24 at top, 6 right, 12 bottom, 18 left. Its single hand points to the second zone's hour (hour + minute / 60) × 15°. The top half of the sub-dial is shaded darker for night.
5. The sub-dial shows the city code under its centre (TYO by default).
6. Clicking the dial, or pressing Enter / Space when it is focused, cycles the dial: Verde sunburst → Salmone → Ardoise → Grand feu enamel → Verde. The dial colour, index colour, hand colours and seconds-hand colour cross-fade over 500ms and the dial artwork does a 520ms settle (opacity 0.55 → 1, rotate −4° → 0).
7. A panel beside the watch shows the brand line, model name, the dial name with a one-line description, four dial swatches (radio group) and four second-zone cities (radio group) with their live local times.
8. Picking a swatch sets that dial directly. Picking a city changes the sub-dial hand and code immediately.
9. A visually hidden status line updates once a minute with the spoken time: "Local time 23:56, date 3. Tokyo 03:11."
10. With reduced motion, the seconds hand jumps once per second (driven by a 1000ms interval instead of rAF) and colour changes are instant.

## Structure

```
1280 × 800, content centred, gap 88px
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ╭───────── case 470px ─────────╮ ▮crown   VAUCLAIR · REF.  │
│   │  ╭─── dial inset 5.6% ───╮   │          Orrery 38  (40px)│
│   │  │       VAUCLAIR        │   │          Verde sunburst · │
│   │  │  ORRERY·AUTOMATIQUE   │   │  ─────── DIAL ─────────── │
│   │  │   ✦ hands     [ 3 ]   │   │  ● ● ● ●  (40px swatches) │
│   │  │     ( 24h sub )       │   │  ──── SECOND ZONE ─────── │
│   │  ╰───────────────────────╯   │  [Tokyo 03:11][New York ] │
│   ╰──────────────────────────────╯  [Lisbon    ][Kathmandu ] │
│                                     hint · Enter             │
└──────────────────────────────────────────────────────────────┘
panel width 300px
```

- `main.stage` is a flex row, centred in the viewport, gap 88px.
- `.watch` is a square `min(470px, 84vw)` box containing `.crown` (decorative div), `.case` (decorative div) and `button.dial`.
- `button.dial` holds a visually hidden label span and one inline SVG with `viewBox="-200 -200 400 400"` so (0,0) is the pivot.
- SVG layers in order: minute track + indices group, brand text, sub-dial group at `translate(0 82)`, date window, hands group.
- `.panel` is a `section` labelled by the `h1`. Dial and zone pickers are `fieldset` + `legend` with native radio inputs.

## Tokens

```css
:root {
  --stage: #0a1411;        /* page, deep green-black */
  --stage-2: #15241f;      /* spotlight centre */
  --text: #ece2c8;         /* panel text */
  --text-2: #a99f86;       /* muted panel text */
  --line: rgba(236,226,200,.14);
  --gold-1: #7d6436; --gold-2: #e8d29c; --gold-3: #a2834b; --gold-4: #f4e3b4;
  --display: "Marcellus", Georgia, serif;
  --sans: "Mulish", system-ui, sans-serif;
  --size: min(470px, 84vw);
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
}
/* per dial, set on .watch[data-dial] */
[data-dial="verde"]   { --dial:#143f33; --ink:#eadfc1; --hand:#d8b673; --hand-2:#9c7b3f; --accent:#e2c27f; --sub:rgba(0,0,0,.18) }
[data-dial="salmone"] { --dial:#d99a7d; --ink:#3b2219; --hand:#2a3a5a; --hand-2:#141e33; --accent:#1d2b4a; --sub:rgba(80,30,10,.10) }
[data-dial="ardoise"] { --dial:#2b2f34; --ink:#efe9dc; --hand:#dfe1e3; --hand-2:#8d9195; --accent:#e3a43b; --sub:rgba(0,0,0,.22) }
[data-dial="email"]   { --dial:#f1e9d8; --ink:#1d1a16; --hand:#24407e; --hand-2:#122452; --accent:#a8322a; --sub:rgba(60,40,10,.07) }
```

Spacing runs on 4/8: 8, 12, 20, 24, 28, 88. Radii: 50% for case, dial and swatches; 6px for zone tiles; 4px for the crown and `kbd`.

## Typography

| Role | Family | Size | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Model name (h1) | Marcellus | 40px / 1.05 | 400 | 0.01em | Title |
| Brand on dial | Marcellus | 15 SVG units | 400 | 0.32em | Upper |
| Dial sub-line | Mulish | 6.4 units | 700 | 0.28em | Upper |
| Sub-dial numerals | Mulish | 7 units | 700 | 0 | — |
| Date | Mulish | 14 units | 700 | 0 | — |
| Eyebrow, legends | Mulish | 11px | 700 | 0.24em | Upper |
| Dial name line | Mulish | 15px | 600 name / 400 note | 0 | Sentence |
| Zone city / time | Mulish | 14px 600 / 12px tabular | — | 0 | — |

Marcellus is a flared, engraved-feeling roman. Use it only for the brand and the model name. Everything functional is Mulish.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Seconds hand | rAF loop | rotate | (s + ms/1000) × 6° | continuous | none (time-driven) | 1 step per second |
| Minute hand | rAF loop | rotate | (m + s/60) × 6° | continuous | — | updates per second |
| Hour hand | rAF loop | rotate | (h%12 + m/60) × 30° | continuous | — | updates per second |
| Dial colours | dial change | fill / stroke / background-color | old → new | 500ms | --ease | instant |
| Dial settle | dial change | opacity, rotate on SVG | .55, −4° → 1, 0 | 520ms | --expo | none |
| Dial press | :active | scale | 1 → .992 | 160ms | --ease | none |
| Swatch hover | hover | scale inner disc | 1 → 1.08 | 160ms | --ease | none |

Do not add a CSS rotation animation to the hands. Rotation is computed from `Date` every frame so the watch can never drift.

## States

- Dial button: hover has no visual change (the cursor is enough). Active scales to .992. Focus-visible draws a 2px `--gold-2` ring offset 10px around the dial circle.
- Swatch: unchecked shows only the disc. Checked adds a 1px `--gold-2` ring 2px outside the disc. Hover scales the disc 1.08.
- Zone tile: rest 1px `--line` border. Hover border `rgba(236,226,200,.35)`. Checked border `--gold-2` and background `rgba(232,210,156,.08)`.
- Focus on radios is drawn on the label wrapper (`:has(input:focus-visible)`), 2px `--gold-2`, offset 3px.
- Loading: none. The clock renders on the first frame.

## Accessibility

- `button.dial` has a visually hidden name: "Change dial. Current dial: Verde sunburst", updated on each change.
- The SVG is `aria-hidden`. The time is exposed through a visually hidden `role="status"` paragraph linked with `aria-describedby`, rewritten once per minute, never per second.
- The dial name line is `aria-live="polite"` so a change is announced.
- Swatches are native radios with `aria-label` set to the dial name. Cities are native radios with visible text.
- Keyboard: Tab reaches the dial, then the swatch group (arrows move between swatches), then the city group (arrows move). Enter or Space on the dial cycles.
- Contrast: `#ece2c8` on `#0a1411` ≈ 14:1. Muted `#a99f86` ≈ 7:1. Hit targets: swatches 40px, zone tiles 44px tall.

## Responsive rules

- ≥1280: watch 470px, panel 300px beside it.
- 1024: same layout; the watch remains 470px.
- ≤900: the stage stacks; the watch sits above the panel; panel width `min(340px, 100%)`; gap 40px.
- <640: the watch is 84vw (≈315px at 375). The SVG scales with it; text inside the dial is in SVG units so it scales too. The crown hangs 14px outside the case; keep `overflow-x: hidden` on body.

## Acceptance checklist

### Always

- [ ] Hand angles are computed from `new Date()` every frame. No CSS keyframe rotation.
- [ ] Seconds hand sweeps (sub-second positions). With reduced motion it steps once per second.
- [ ] Hour hand includes minutes; minute hand includes seconds.
- [ ] Each hand is two triangles in `--hand` and `--hand-2` (faceted), with a soft drop shadow.
- [ ] Date window shows the day of month; sub-dial is a 24-hour dial with 24 at the top.
- [ ] Clicking or pressing Enter on the dial cycles through every dial and wraps.
- [ ] Dial and zone pickers are native radio groups with visible focus.
- [ ] Spoken time updates at most once a minute.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Brand VAUCLAIR, model "Orrery 38", eyebrow "Vauclair · Ref. 3810".
- [ ] Dials in order: Verde sunburst `#143f33`, Salmone `#d99a7d`, Ardoise `#2b2f34`, Grand feu enamel `#f1e9d8`.
- [ ] Cities: Tokyo (TYO, default), New York (NYC), Lisbon (LIS), Kathmandu (KTM).
- [ ] Case is a 470px conic gold gradient; dial inset 5.6%.
- [ ] Index at 3 o'clock is replaced by the 38×26 date window.

## Implementation notes

**Hands from time, sub-second.** One function, called by rAF (or a 1s interval when reduced motion is on):

```js
function draw() {
  const d = new Date();
  const s = rm.matches ? d.getSeconds() : d.getSeconds() + d.getMilliseconds() / 1000;
  const m = d.getMinutes() + s / 60;
  const h = (d.getHours() % 12) + m / 60;
  sec.setAttribute('transform', `rotate(${s * 6})`);
  min.setAttribute('transform', `rotate(${m * 6})`);
  hour.setAttribute('transform', `rotate(${h * 30})`);
}
```

Use SVG `transform` attributes on groups whose origin is (0,0) in a centred viewBox. Rotating with CSS `transform` on SVG children needs `transform-box` fiddling; the attribute does not.

**Second zone without a library.** `Intl.DateTimeFormat` with `timeZone` and `hourCycle: 'h23'` gives the hour and minute in any IANA zone. Cache one formatter per zone and only recompute when the integer second changes:

```js
const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const p = f.formatToParts(d);
const zh = +p.find(x => x.type === 'hour').value, zm = +p.find(x => x.type === 'minute').value;
zoneHand.setAttribute('transform', `rotate(${(zh + zm / 60) * 15})`);
```

Kathmandu is UTC+5:45. Do not compute offsets by hand in whole hours.

**Faceted dauphine hand.** Two paths sharing the spine:

```svg
<g id="hMin">
  <path fill="var(--hand)"   d="M0 18 L-6.5 0 L0 -160Z"/>
  <path fill="var(--hand-2)" d="M0 18 L6.5 0 L0 -160Z"/>
</g>
```

The hour hand is the same shape at 8 wide and 102 long. The seconds hand is a 1.6-unit needle from +40 to −170 with a 5-unit counterweight disc at +30 in `--accent`.

**Sunburst without images.** The dial is a flat `background-color` (so it can transition) with a neutral overlay on `::before`:

```css
.dial::before {
  content: ""; position: absolute; inset: 0; border-radius: 50%;
  background:
    repeating-conic-gradient(rgba(255,255,255,.05) 0 1deg, rgba(0,0,0,.05) 1deg 2deg),
    radial-gradient(circle at 35% 25%, rgba(255,255,255,.16), transparent 55%);
}
```

Common mistakes:

- Ticking the seconds hand with a 1000ms interval while claiming a sweep.
- Putting the date window over the 3 o'clock index instead of replacing it.
- A 12-hour sub-dial. The second zone is 24-hour so day and night read at a glance.
- Announcing the time every second in a live region.
- Gradients on the dial colour itself; then the dial swap cannot cross-fade.
- Drawing numerals at every hour. This dial uses batons, with a doubled baton at 12.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
