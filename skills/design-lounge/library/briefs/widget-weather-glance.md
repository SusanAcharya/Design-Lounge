<!-- Design Lounge Nº 458 · "Weather glance widget, three sizes" · designlounge.vercel.app -->

# Weather glance widget, three sizes

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A weather widget for an app called Cirro, shown over a dusk landscape so the frosted glass has something to blur. One widget, three sizes: small shows the place, temperature and condition; medium adds a six-hour strip; large adds a five-day list with temperature range bars. A segmented control morphs the widget between sizes with a sheet-like ease. The condition illustration is a tiny SVG scene (sun, two clouds, rain, a bolt) whose parts slide and fade between conditions instead of swapping icons, and tapping any hour previews that hour in the hero. Glass here is the point, so it is used once, on the widget only.

## Reference behaviour

1. First frame: Large size. Place "Harbour Hill", temperature 18°, condition "Partly cloudy", "H 21° · L 12°". The hourly strip shows Now / 15:00 / 16:00 / 17:00 / 18:00 / 19:00; Now is selected. The five-day list shows Today, Sun, Mon, Tue, Wed.
2. The condition scene is alive: sun rays turn once per 28s, the clouds drift ±3px over 7s alternating. Rain drops fall in rain and storm; the bolt flashes twice every 3.6s in storm.
3. Clicking an hour sets `aria-pressed="true"` on it (only one at a time), sets the hero temperature to that hour's value, sets the condition text, and morphs the scene to that condition (sun scales away, cloud darkens, rain fades in).
4. Hour data: Now partly 18°, 15:00 clear 19°, 16:00 partly 19°, 17:00 overcast 17°, 18:00 light rain 15°, 19:00 thunderstorm 14°.
5. Day data (low/high): Today partly 12/21, Sun rain 10/16, Mon overcast 9/17, Tue clear 11/20, Wed partly 13/22. Range bars are positioned on a shared 9°–22° scale.
6. The size control (Small / Medium / Large) changes the widget's width, height and corner radius over 420ms. Content re-lays out immediately and fades in from 4px below over 360ms.
7. Switching to Small resets the preview to Now, because the hourly strip is not visible to undo it.
8. In Medium the hero compresses into one row: place and 48px temperature on the left, condition and H/L in the middle, a 52px scene on the right; the hourly strip sits below. The daily list is hidden.
9. In Small the place and scene share the top row, the temperature is 58px centred vertically, and the condition and H/L sit at the bottom left.
10. "Updated 14:02 · tap an hour to preview it" sits below the control.

## Structure

```
1280×800 dusk sky gradient, sun disc, three hill silhouettes (bottom 46%)

         Large 404 × 420, r30                 Medium 404 × 198     Small 190 × 190, r26
 ┌────────────────────────────────────┐   ┌──────────────────────┐   ┌─────────────┐
 │ > Harbour Hill               [art] │   │ > Harbour Hill  cond  art│   │ > Harbour  art│
 │ 18°                          64px  │   │ 14°            H/L    │   │             │
 │                       Partly cloudy│   │ Now 15 16 17 18 19    │   │ 18°         │
 │                       H 21° · L 12°│   └──────────────────────┘   │ Partly cloudy│
 │ Now 15:00 16:00 17:00 18:00 19:00  │                              │ H 21° · L 12°│
 │ ────────────────────────────────── │                              └─────────────┘
 │ Today c  12° ━━━━━━━━━━━━━━  21°   │
 │ Sun   r  10° ━━━━━━          16°   │
 │ …five rows, 28px tall, 6px gap      │
 └────────────────────────────────────┘
           ( Small | Medium | Large )   pill, 36px buttons
           Updated 14:02 · tap an hour to preview it
```

- Scene: fixed, `aria-hidden`, a radial-gradient sun disc (220px, left 55%, top 47%) and one SVG with three filled hill paths, `preserveAspectRatio="none"`.
- Widget: `section` labelled "Cirro weather widget" with `data-size="s|m|l"`.
- Hero: a CSS grid with areas `place`, `temp`, `art`, `meta`. Each size redefines the areas; the DOM never changes.
- Scene illustration: one inline `svg` (viewBox 0 0 64 64) with `role="img"` and an `aria-label` equal to the condition name.
- Hourly strip: a `role="group"` of six `button`s with `aria-pressed`.
- Daily list: a `ul` of five `li`, each a 5-column grid `44px 22px 28px 1fr 28px` (day, icon, low, bar, high).
- Size control: `role="radiogroup"` with three `role="radio"` buttons, each with a tiny outline glyph of its shape (10×10, 18×10, 18×18).
- Small icons are `symbol`s in one hidden SVG sprite, used via `<use>`, stroke 1.6, `currentColor`.

## Tokens

```css
:root {
  /* scene */
  --sky-1: #14243d;   /* top of sky */
  --sky-2: #2c5568;   /* mid sky */
  --sky-3: #c98f74;   /* lower haze */
  --glow: #f3b27f;    /* horizon */
  --hill-1: #203a4a; --hill-2: #15283a; --hill-3: #0d1a28;

  /* text on glass */
  --text: #f7f2ea;
  --text-2: rgba(247, 242, 234, .74);
  --text-3: rgba(247, 242, 234, .5);   /* daily lows only */

  /* glass */
  --glass: rgba(255, 250, 244, .13);
  --glass-hi: rgba(255, 250, 244, .22);
  --edge: rgba(255, 250, 244, .3);
  --blur: blur(26px) saturate(150%);

  /* weather accents */
  --sun: #ffd28a;     /* sun core + rays, bolt, focus ring */
  --cool: #9fd0df;    /* rain, cold end of range bar */
  --warm: #f6b48f;    /* warm end of range bar */

  /* type */
  --sans: "Outfit", system-ui, sans-serif;
  --serif: "Instrument Serif", Georgia, serif;
  --fs-temp-l: 64px; --fs-temp-m: 48px; --fs-temp-s: 58px;
  --fs-body: 14px; --fs-meta: 13px; --fs-small: 11px;

  /* shape + space */
  --r-l: 30px; --r-s: 26px; --r-chip: 14px; --r-pill: 999px;
  --pad: 18px 20px;
  --shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 24px 50px -24px rgba(5,12,24,.55);

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --sheet: cubic-bezier(.32, .72, 0, 1);
  --dur-size: 420ms; --dur-swap: 360ms; --dur-micro: 160ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Notes |
| --- | --- | --- | --- | --- | --- |
| Temperature | Instrument Serif | 64 / 48 / 58px (L / M / S) | 400 | 0.95 | -0.02em, tabular |
| Place | Outfit | 14px (13px in S) | 500 | 1.4 | nowrap in S |
| Condition | Outfit | 13px | 500 | 1.35 | `--text` |
| H / L | Outfit | 13px | 400 | 1.35 | `--text-2` |
| Hour label | Outfit | 11px | 400 | — | 0.02em, `--text-2` |
| Hour temp | Outfit | 14px | 500 | — | tabular |
| Day name | Outfit | 13px | 500 | — | — |
| Day low / high | Outfit | 13px | 400 | — | low `--text-3`, high `--text` |
| Size buttons | Outfit | 13px | 500 | — | — |
| Footnote | Outfit | 12px | 400 | — | `--text-2` |

Only the temperature uses the serif. Everything else is Outfit.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Widget size | size radio | width, height, border-radius | L 404×420 r30 ↔ M 404×198 ↔ S 190×190 r26 | 420ms `--sheet` | instant |
| Content swap | size radio | opacity, translateY | 0, 4px → 1, 0 | 360ms `--ease` | none |
| Strip / list reveal | size radio | opacity (visibility hidden when off) | 0 → 1 | 260ms `--ease`, 140ms delay | instant |
| Sun rays | always | rotate | 0 → 360° | 28s linear, infinite | static |
| Cloud drift | always | translateX | −2px → 3px | 7s `--ease`, alternate | static |
| Rain drops (3) | rain, storm | translateY, opacity | −5px, 0 → 7px, 0 (peak 1 at 30%) | 1s linear, staggered −0.33s | static drops |
| Bolt | storm | opacity | flash at 64–70% of cycle | 3.6s loop | bolt shown solid |
| Scene morph | hour click | sun transform/opacity, cloud fill | e.g. clear: sun translate(8px,8px) scale(1.25), clouds out right 14px | 520ms `--sheet` (transform), 420ms (opacity, fill) | instant |
| Hour chip | hover / press | background, scale | → 10% white; press 0.95 | 160ms `--ease` | no scale |

## States

- Hour resting: transparent. Hover: `rgba(255,250,244,.1)`. Active: scale 0.95. Selected: `rgba(255,250,244,.2)` with a 1px inset ring at 28% white.
- Size radio checked: background `--text`, label `--sky-1`. Unchecked: transparent, `--text-2`.
- Focus-visible everywhere: 2px `--sun` outline, 2px offset.
- Conditions map onto the scene: clear (big sun only), partly (sun top-left, clouds), overcast (clouds only), light rain (darker clouds + drops), thunderstorm (darker clouds + drops + bolt).
- No loading or error state in this demo. In a product, the stale state keeps the last reading and changes the footnote to "Updated 2 h ago", never empties the widget.

## Accessibility

- The temperature has `aria-live="polite"` so previewing an hour announces the new value.
- Each hour button's accessible name is "15:00, Clear, 19 degrees". The visible text is decorative to the name.
- Each day row has an `aria-label` such as "Sun: Light rain, low 10, high 16"; the bar is `aria-hidden`.
- The scene SVG is `role="img"` with the condition as its label, updated with each change.
- Size control: radiogroup; arrow keys move and select, wrapping. Buttons are 36px tall inside a 4px-padded pill (44px hit).
- Hidden content uses `visibility: hidden` (not just opacity), so the hourly strip is not tabbable in Small.
- Contrast: `#f7f2ea` on the glass over `#2c5568` is above 7:1. `--text-2` stays above 4.5:1. `--text-3` is used only for daily lows, which repeat in the row label.

## Responsive rules

- ≥1024: widget centred, sizes exactly as above.
- 768: unchanged.
- <640: widget gets `max-width: calc(100vw - 32px)`; at 375 the Large widget is 343px wide, the strip keeps six columns, and range bars shrink. No horizontal overflow.
- On a real home screen the three sizes map onto the grid's 2×2, 4×2 and 4×4 cells; keep the aspect ratios, not the pixel values.

## Acceptance checklist

### Always

- [ ] One widget element whose layout is driven by a single `data-size` attribute; no duplicated markup per size.
- [ ] Size morph animates width, height and radius together with the sheet easing.
- [ ] Hidden sections are `visibility: hidden` so they leave the tab order.
- [ ] The condition scene morphs parts between conditions; it never hard-swaps an icon.
- [ ] Exactly one hour is pressed; clicking it updates temperature, condition text, and scene label.
- [ ] Range bars share one scale across all days.
- [ ] Glass (blur + translucent fill + 1px light edge + inset top highlight) is on the widget only.
- [ ] Reduced motion: no loops, no size tween; storm shows a static bolt.

### This demo

- [ ] First frame is Large, Harbour Hill, 18°, Partly cloudy, H 21° · L 12°.
- [ ] Sizes are 190×190, 404×198, 404×420.
- [ ] Temperature in Instrument Serif at 64px in Large.
- [ ] Hours: Now, 15:00, 16:00, 17:00, 18:00, 19:00 with 18, 19, 19, 17, 15, 14 degrees.
- [ ] 19:00 shows "Thunderstorm" with a flashing bolt.
- [ ] Range bar gradient runs `#9fd0df` → `#f6b48f`.

## Implementation notes

**One DOM, three grids.** Keep the hero markup fixed and swap grid areas by size. This is what lets the box tween while the contents re-flow:

```css
.hero { display: grid; grid-template-columns: 1fr auto;
  grid-template-areas: "place art" "temp art" "temp meta"; }
.w[data-size="m"] .hero { grid-template-columns: 1fr auto auto;
  grid-template-areas: "place meta art" "temp meta art"; }
.w[data-size="s"] .hero { grid-template-areas: "place art" "temp temp" "meta meta";
  grid-template-rows: auto 1fr auto; height: 154px; }
.w[data-size="s"] .hours, .w[data-size="s"] .days,
.w[data-size="m"] .days { visibility: hidden; opacity: 0; }
```

**Replay the swap fade.** Restart the keyframe on every size change by removing the class and forcing a reflow:

```js
w.dataset.size = s;
w.classList.remove('swap'); void w.offsetWidth; w.classList.add('swap');
```

**A scene, not icons.** Build the illustration once: a sun group (core + 8 rays), a cloud set (back cloud, front cloud, inside a drifting group), three rain lines, a bolt. Condition is a `data-c` attribute, and each condition only moves or fades groups:

```css
.art[data-c="clear"] .sun { transform: translate(8px, 8px) scale(1.25); }
.art[data-c="clear"] .cloudset { opacity: 0; transform: translateX(14px); }
.art[data-c="rain"] .sun, .art[data-c="storm"] .sun { opacity: 0; transform: scale(.6); }
.art:not([data-c="rain"]):not([data-c="storm"]) .rain { opacity: 0; }
.art[data-c="storm"] .bolt { animation: flash 3.6s infinite; }
```

Common mistakes:

- Putting the glass on a flat colour background. Blur needs content behind it; the sun disc sits partly behind the widget on purpose.
- Scaling the whole widget with `transform: scale()` for the sizes. Text gets blurry and the radius scales. Tween the real box.
- Animating `display`. Use `visibility` + `opacity`.
- Emoji or icon-font weather glyphs. Use the stroke sprite.
- A purple-to-blue sky. This sky runs navy → teal → apricot.
- Leaving the preview on 19:00 after shrinking to Small, where the user can't see which hour is shown.

Where it sits: a home-screen or dashboard widget gallery next to `widget-compass`, `widget-device-battery` and `widget-control-toggles`, each in its own look.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
