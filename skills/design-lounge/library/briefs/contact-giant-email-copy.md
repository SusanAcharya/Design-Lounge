<!-- Design Lounge Nº 115 · "Giant email, click to copy" · www.designlounge.live -->

# Giant email, click to copy

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A full-viewport contact section for a sound-and-spatial studio ("Ferro Works"). The email **HI@FERRO.WORK** is the page: 200px condensed Anton, one line, flush left. Clicking it copies `hi@ferro.work`, inverts the whole page to black-on-cream for 1.6s, and runs a glyph scramble that resolves to **COPIED TO CLIPBOARD** then back to the address. A pill that says "Copy ↗" replaces the cursor over the address. The feeling is loud, physical, poster-like: 2px rules, four-column meta, a 52px inverted ticker of services. The detail worth copying is the fit-to-width resize — the display size is computed from a hidden probe so "COPIED TO CLIPBOARD" never overflows, even though it is longer than the email.

## Structure

```
1280 × 800  body grid: auto / 1fr / auto / auto   overflow hidden
│  pad-x 40px, 2px rules
┌────────────┬────────────┬────────────┬────────────┐  top, border-bottom 2px
│ FERRO WORKS│ LISBON /   │ NOW BOOKING│ RESPONSE   │  18/14 pad, uppercase
│ Sound +    │ ROTTERDAM  │ Projects   │ Under 24 h │  13px Space Mono
│ spatial…   │ Lisbon HH:MM│ from Feb 2027│ Mon–Fri │
├────────────┴────────────┴────────────┴────────────┤
│  CONTACT — THE FASTEST WAY IN          CLICK TO COPY   kick  uppercase │
│  HI@FERRO.WORK                              ~200px Anton / .86         │
│  (underline 14px at bottom 6px, scaleX 0 until hover)                  │
├────────────┬────────────┬────────────┬────────────┤  grid, border-top
│ NEW BUSINESS│ PRESS     │ CAREERS    │ STUDIO     │  h4 12/700 +0.06em
│ Inês Prado  │ Tom van   │ Two open   │ Rua do     │
│ +351 21…    │ Dijk      │ roles      │ Açúcar 88  │
├────────────┴────────────┴────────────┴────────────┤
│ WRITE TO US ◆ INSTALLATIONS ◆ SONIC BRANDING ◆ …   ticker 52px, inverted │
└────────────────────────────────────────────────────┘
  chip: position fixed, follows pointer, z-index 5
```

- `.top` — 4-column grid, `aria-label="Studio details"`. First line of each cell is `<b>`.
- `<main class="stage">` — flex column, vertically centred. `.kick` then `<button class="mail">`.
- `.mail` — `all:unset`; contains visible `.t` (`aria-hidden`) and `.sr` "Copy email address hi@ferro.work". `aria-describedby="hint"`.
- `#hint` sr: "Copies the address to your clipboard". `#live` sr `aria-live="assertive"`.
- `<section class="grid" aria-label="Other contacts">` — four cells. Copyable items are `<a href="#" data-copy="…">`.
- `.tick` — `aria-hidden`, inner flex row duplicated so the 38s loop is gapless. Each item has a 14px diamond `::after` (rotated 45° square).
- `.chip` — `aria-hidden`, not in the tab order.

## Motion

| Element              | Trigger        | Property                 | From → To                         | Duration | Easing      | Notes |
|----------------------|----------------|--------------------------|-----------------------------------|---------:|-------------|-------|
| Address underline    | hover / focus  | transform scaleX         | 0 → 1                             | 420ms    | `--ease-out`| origin left; 14px tall at bottom 6px |
| Chip                 | pointermove    | opacity, transform       | 0, scale .6 → 1, translate(14,14) | 140ms / 200ms | `--ease` / `--ease-out` | `left/top` = clientX/Y |
| Body flash           | copy success   | background, color        | orange/ink ↔ ink/paper            | 140ms    | `--ease`    | also invert rule colours |
| Glyph scramble       | copy / revert  | textContent per char     | random glyphs → target            | 720ms / 640ms | —     | refresh ≥48ms; see notes |
| Link hover           | hover          | background, color        | inherit → ink on `--bg`           | instant  | —           | flash invert: paper on ink |
| Ticker               | load, loop     | translateX               | 0 → −50%                          | 38s      | linear      | infinite; content duplicated |
| Link label           | data-copy click| textContent              | original → Copied → original      | 1400ms   | —           | |

Scramble: for target string of length `n` and duration `dur`, char `i` locks at `at[i] = (i/n)*dur*0.7 + random()*dur*0.3`. Before `at[i]*0.4` show the previous character if it exists; otherwise pick from `#%&*+=/\\<>[]{}?!0123456789ABCDEFGHJKLMNPQRSTUVWXYZ`. Spaces lock immediately. Reduced motion: set `textContent` to the target and skip the loop.

## States

- **Default:** orange page, black type, chip opacity 0, underline `scaleX(0)`.
- **Address hover:** chip `.on`, underline full, `cursor: none`.
- **Address focus-visible:** 3px ink outline, 6px offset; underline also wipes in.
- **Copied / flash:** page black, type cream, rules cream, ticker orange with black diamonds. Chip: background `--paper`, colour `--ink`. Address colour `--paper`.
- **Busy:** a second click during the 1600ms hold clears the timeout and runs copy again; `busy` stays true until the return scramble finishes.
- **Copy failed:** live region "Copy failed. The address is hi@ferro.work"; scramble target stays `HI@FERRO.WORK` (do not show COPIED TO CLIPBOARD).
- **Grid link copied:** text "Copied" or "Copy failed" for 1400ms.
- **Grid link hover:** background `--ink`, colour `--bg`; 2px underline is `border-bottom: 2px solid currentColor`.
- **No hover (touch):** `.mail { cursor: pointer }`, chip `display: none`.

## Accessibility

- Address is a real `<button type="button">`. Visible Anton span is `aria-hidden`; an `.sr` child names the action. `aria-describedby` points at the hint.
- Live region is `aria-live="assertive"` and visually clipped (1×1).
- Grid copy controls are links with `href="#"`; `preventDefault` on click. Studio block has no copy action.
- Keyboard: Tab hits the address button then the three copy links. Enter/Space activates copy (native button). Focus ring 3px on the address, 2px on grid links.
- Chip is pointer-only decoration (`aria-hidden`, `pointer-events: none`).
- Contrast: black on `#FF4F1A` is well above 4.5:1 for 13px mono; cream on black during flash likewise. Anton at 200px is display type.
- Hit target: the address button includes 14px + 26px vertical padding; grid links are inline but sit in padded cells.

## Responsive rules

- ≥ 1280: as specified. Address fits via the probe; do not wrap.
- 1024–1279: keep four columns; the probe will drop the Anton size below 200px as needed (floor is whatever `min(260, 200 * width / probe)` yields).
- 768–1023: top and grid become 2×2; ticker still 52px. Address `white-space: nowrap` remains — shrink the font, never wrap.
- < 640: single column meta; `--pad: 20px`. Hide the ticker or let it clip. Chip already hidden on coarse pointers.
- Reduced motion as above. Do not disable copy.

## Acceptance checklist

- [ ] Display string is `HI@FERRO.WORK` in Anton, one line, fitted so it never overflows the content width.
- [ ] Click copies `hi@ferro.work` (lowercase) and announces success or the spoken fallback address.
- [ ] Successful copy flashes the page to black/cream and scrambles to `COPIED TO CLIPBOARD` in 720ms, holds 1600ms, scrambles back in 640ms.
- [ ] Hovering the address hides the system cursor and shows a "Copy ↗" pill that tracks the pointer.
- [ ] A 14px underline wipes in over 420ms with `cubic-bezier(.16,1,.3,1)`.
- [ ] Phone, press@ and jobs@ each copy their `data-copy` value and briefly read "Copied".
- [ ] Lisbon clock uses `Europe/Lisbon` and updates at least every 30s.
- [ ] Ticker loops in 38s; content is duplicated so the join is invisible.
- [ ] Reduced motion skips scramble frames and the ticker animation; copy still works.
- [ ] Focus-visible rings are present on the address and every copy link.
- [ ] On touch (`hover: none`) the address uses `cursor: pointer` and the chip is not shown.
- [ ] Rules are 2px and invert with the flash.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: orange field `#FF4F1A`. Top strip of four cells (studio, cities + live Lisbon clock, booking, response time). Giant address. Four contact cells. Black ticker rolling services.
2. Hovering the address: custom cursor hidden; a black pill "Copy ↗" tracks 14px down-right of the pointer; a 14px black underline wipes left → right in 420ms (`scaleX` 0 → 1, origin left).
3. Clicking the address copies `hi@ferro.work` (lowercase) via `navigator.clipboard.writeText`, with a `textarea` + `execCommand('copy')` fallback. `aria-live="assertive"` announces "Copied hi@ferro.work to clipboard" (or the failure string with the address spoken).
4. On success: `body` gets `.flash` (background `--ink`, colour `--paper`); the address gets `.copied` (type and underline become `--paper`); chip text becomes "Copied"; glyphs scramble to `COPIED TO CLIPBOARD` over 720ms.
5. After 1600ms hold, flash and `.copied` drop; chip returns to "Copy ↗"; glyphs scramble back to `HI@FERRO.WORK` over 640ms. Further clicks during the hold restart the timeout.
6. Clicking a `data-copy` link in the grid (phone, press, jobs) copies that string, swaps the link text to "Copied" for 1400ms, and announces via the same live region. Studio address is not copyable.
7. Lisbon clock (`#clock`) formats `Europe/Lisbon` as `Lisbon HH:MM` with `en-GB`, 2-digit hour and minute, and refreshes every 30s.
8. Display size: `font-size = min(260px, 200px * mail.clientWidth / probeWidth)` so the current string always fits. Recalculate on font load and resize.
9. Ticker: duplicated phrase list scrolls `translateX(-50%)` over 38s linear infinite.
10. Reduced motion: scramble snaps to the target string; ticker animation is `none`; transitions 1ms. Pointer-coarse (`hover:none`): native pointer on the address, chip hidden.

## Tokens

```css
:root {
  /* colour — safety-orange field, near-black ink, cream flash */
  --bg: #ff4f1a;          /* page */
  --ink: #0d0d0d;         /* type, rules, ticker, chip */
  --paper: #f2efe6;       /* flash type, copied address */
  --line: rgba(13, 13, 13, .9);  /* 2px rules */
  --ink-2: #3a1a0e;       /* declared; body colour is --ink */

  /* type */
  --display: "Anton", Impact, sans-serif;
  --mono: "Space Mono", ui-monospace, monospace;

  /* layout */
  --pad: 40px;
  --rule: 2px;
  --mail-fs: 200px;       /* base; JS may raise to 260px cap */
  --tick-h: 52px;

  /* motion */
  --t-micro: 140ms;
  --t-wipe: 420ms;
  --t-scramble-out: 720ms;
  --t-hold: 1600ms;
  --t-scramble-in: 640ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --roll: 38s;
}
```

## Typography

| Role             | Family     | Size | Weight | Line-height | Tracking | Case      |
|------------------|------------|-----:|-------:|------------:|---------:|-----------|
| Address / copied | Anton      | 200px (fit) | 400 | 0.86   | −0.01em  | UPPERCASE |
| Ticker           | Anton      | 28px | 400    | 1           | +0.02em  | UPPERCASE |
| Body / meta      | Space Mono | 13px | 400    | 1.5         | 0        | sentence  |
| Top labels       | Space Mono | 13px | 400/700| 1.5         | +0.04em  | UPPERCASE |
| Kick             | Space Mono | 13px | 700/400| 1.5         | +0.04em  | UPPERCASE |
| Grid headings    | Space Mono | 12px | 700    | 1           | +0.06em  | UPPERCASE |
| Chip             | Space Mono | 12px | 700    | 1           | +0.06em  | UPPERCASE |
| Grid links       | Space Mono | 13px | 400    | 1.5         | 0        | as written|

Kick right label is weight 400; left is 700. Top cells: `<b>` 700, second line 400.

## Implementation notes

**Fit the string with a hidden probe cloned from `.t`**, 200px, off-canvas. Measure after fonts.ready and on resize:

```js
function sizeFor(str) {
  probe.textContent = str;
  const w = probe.getBoundingClientRect().width || 1;
  return Math.min(260, 200 * (mail.clientWidth / w));
}
t.style.fontSize = sizeFor(str).toFixed(1) + 'px';
```

**Clipboard with fallback** (the iframe sandbox may lack clipboard permission):

```js
async function copyText(s) {
  try { await navigator.clipboard.writeText(s); return true; }
  catch {
    const a = document.createElement('textarea');
    a.value = s; a.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(a); a.select();
    const ok = document.execCommand('copy'); a.remove(); return ok;
  }
}
```

**Scramble lock times** — later characters stay noisy longer; cap glyph refresh at 48ms so it does not look like a flicker storm:

```js
const at = [...to].map((_, i) => (i / n) * dur * .7 + Math.random() * dur * .3);
// each frame: (e >= at[i] || c === ' ') ? c : (e < at[i]*.4 && from[i] ? from[i] : GLYPHS[rnd])
```

Common mistakes: copying the display string `HI@FERRO.WORK` instead of lowercase; wrapping the Anton line; using `cursor: none` on `body` (only the address); driving the ticker with JS instead of a 38s CSS loop; forgetting `all:unset` on the button so a native border shows; putting the live region in a `polite` status that is skipped during the scramble.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
