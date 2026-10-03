<!-- Design Lounge Nº 274 · "Phone QR ticket scanner" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Phone QR ticket scanner

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens, but keep valid and invalid as two separate colours that never appear anywhere else.

## What it is

The scanner a door person holds at a gig. The app is Gatepost, the venue is Pier Nine, the door is Gate 2, the act is Mira Sol. The whole phone is the camera. A grainy dark scene shows a guest's phone held up with a QR on it, a little out of focus and drifting like a real hand. A white 248px reticle with four rounded corners breathes in and out, and a white scan line sweeps up and down inside it.

When a code is read, the reticle snaps down to 176px and turns 7 degrees to sit square on the QR, the picture comes into focus, and a colour edge pulses around the whole screen: mint for valid, red for invalid. A result sheet rises with the name, seat, time, and ticket id. One big white "Scan next" button resets everything.

The look is dark utility: true black, white, one mint `#4fe3a5` that only means valid, one red `#ff5a4f` that only means invalid. Geist for words, Geist Mono for codes and counts. iOS sheet behaviour and 44px round controls, no glass.

The detail worth copying: the reticle locks onto the code at the code's own angle. The staff member sees the app found that exact ticket, not just "something".

## Reference behaviour

1. First frame: camera scene, title "Scan tickets" with "Pier Nine · Gate 2", a count pill "312 / 480 checked in", the reticle with a moving scan line, the status "Point the camera at the ticket QR" over "Mira Sol · Doors 19:00", a dashed hint button "Demo · simulate scan", a gallery button, and a white "Enter code manually" button.
2. The scene drifts slowly: up to 4px and 0.4 degrees over 7 seconds, back and forth. The grain shifts in 6 steps every 1.2 seconds.
3. The reticle corners move 6px inward and back every 2.4 seconds. The scan line sweeps from top to bottom and back every 2.4 seconds with an in-out curve.
4. Tapping the torch button sets `aria-pressed="true"`, fills the button white with a black icon, and brightens the scene to 1.7. Tapping again turns it off.
5. Tapping the hint button runs a scan. Scans alternate: the first is valid, the second is invalid, then valid again.
6. Lock: the reticle shrinks from 248px to 176px and turns -7 degrees in 300ms. The scan line fades. The drift pauses. The blur on the guest's phone drops to zero. Status reads "Ticket found. Checking".
7. After 520ms, the verdict: corners and the result colour turn mint or red, a ring around the reticle grows to 1.28 and fades in 700ms, and the screen edge flashes an 8px inset band in the same colour that fades in 600ms. On invalid, the reticle also shakes 6px left and right in 360ms. If the device can vibrate, it buzzes 30ms for valid, 40-60-40ms for invalid.
8. Valid also adds one to the count: 312 becomes 313.
9. After 650ms more, the result sheet slides up in 420ms. Focus moves to "Scan next".
10. Valid sheet: mint check badge, "Valid ticket", "Admit one · scanned 19:31", name "Ines Albescu", Seat "Block B · Row 4 · Seat 12", Time "Doors 19:00 · Show 20:15", Ticket "PN9-7Q4K-2210".
11. Invalid sheet: red cross badge, "Already scanned", "Gate 2 · 19:12 · by Theo M.", name "Dario Pensa", Seat "Block D · Row 11 · Seat 3", same time row, Ticket "PN9-3H8D-0417".
12. "Scan next", a tap on the dark scrim, or Escape closes the sheet, unlocks the reticle, restores the status line, and returns focus to the control that started the scan.
13. "Enter code manually" opens a sheet with "Enter ticket code", a 60px mono input with placeholder "PN9-0000-0000", the help line "Printed under the QR. 11 letters and numbers.", a "Check code" button, and Cancel. Focus goes to the input.
14. Check code strips everything but letters and digits. If the result is not 11 characters, the input gets a red border and `aria-invalid`, and the help line turns red: "That code is 5 characters. Codes have 11." Focus stays in the input.
15. An 11-character code runs the verdict. "PN93H8D0417" (the used ticket) gives invalid. Any other gives valid with the typed id shown.
16. The gallery button changes the status to "No ticket images in Recents" over "Screenshots of a QR will show here".
17. With reduced motion: no drift, no grain shift, no breathing, the scan line rests across the middle, the lock and sheets appear without travel, and the verdict colours still change.

## Structure

```
390 × 844, black, nothing scrolls

 (×)          Scan tickets           (torch)     top 54px, 44px round
            PIER NINE · GATE 2
          [ 312 / 480 checked in ]               pill, top 112px

          ┌──            ──┐
          │   ┌────────┐   │                     reticle 248px
          │   │  QR    │   │                     centre: 50% - 30px
          │ ──┴────────┴── │  scan line
          └──            ──┘
     Point the camera at the ticket QR           status, centre + 150px
          MIRA SOL · DOORS 19:00

          ( DEMO · SIMULATE SCAN )               dashed, 44px
 [img]  [   Enter code manually   ]              56px
 padding-bottom 34px

 result sheet (over everything)
┌──────────────────────────────────────┐ radius 22px 22px 0 0
│               ────                   │
│ (✓) Valid ticket                     │ badge 48px
│     ADMIT ONE · SCANNED 19:31        │
│ Ines Albescu                         │ 28px
│ SEAT          Block B · Row 4 · Seat 12 │ rows, 1px rules
│ TIME          Doors 19:00 · Show 20:15  │
│ TICKET                 PN9-7Q4K-2210 │
│ [          Scan next             ]   │ 56px white
└──────────────────────────────────────┘
```

- Camera: an `aria-hidden` wrapper with `overflow: hidden` holding the scene. The scene is 12px larger than the frame on every side so the drift never shows an edge. Inside: a table edge line, the guest's phone (196 × 360px, 30px radius, rotated -7 degrees) with a light screen and an SVG QR, and an SVG grain layer.
- Vignette and edge flash: two `aria-hidden` full-frame layers above the camera.
- Reticle: an `aria-hidden` box with four corner spans, a scan line, and a ring.
- Top: a `header` with a Close button, the `h1` and venue line, and the Torch toggle.
- Count: a `div` pill.
- Status: a `p role="status" aria-live="polite"`.
- Bottom: the hint button, then a row with the gallery button and the manual button.
- Sheets: two `section role="dialog" aria-modal="true"` with `aria-labelledby`, plus one scrim.
- Result facts: a `dl` with three `dt`/`dd` pairs in a two-column grid.
- Manual form: a `form novalidate` with `label`, `input`, a help `p` tied by `aria-describedby`, and two buttons.

## Tokens

```css
:root {
  /* colour */
  --bg: #000000;        /* camera black */
  --sheet: #111111;     /* sheets */
  --raise: #1b1b1b;     /* input field */
  --line: #2c2c2c;      /* hairlines */
  --ink: #ffffff;       /* text, reticle at rest, primary buttons */
  --ink-2: #b8b8b8;     /* secondary text */
  --ink-3: #8a8a8a;     /* fact keys */
  --valid: #4fe3a5;     /* valid only */
  --invalid: #ff5a4f;   /* invalid only */
  --lock: var(--ink);   /* reticle colour, set to valid or invalid on verdict */

  /* type */
  --sans: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;

  /* layout */
  --cy: calc(50% - 30px);   /* reticle centre */
  --size: 248px;            /* reticle at rest */
  --size-lock: 176px;       /* reticle on a code */

  /* shape */
  --r: 12px;          /* buttons, input */
  --r-sheet: 22px;    /* sheet top corners */
  --r-corner: 14px;   /* reticle corner curve */

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --sheet-e: cubic-bezier(.32, .72, 0, 1);
  --out: cubic-bezier(.16, 1, .3, 1);
  --breathe: 2400ms;
  --scan: 2400ms;
  --lock-t: 300ms;
  --check-t: 520ms;
  --sheet-t: 420ms;
}
```

The scene uses fixed greys outside the token list (`#161513`, `#0b0b0a`, `#262420`, `#d9d8d2`) because it is a picture, not UI. In a real app the scene is the live camera feed and those go away.

## Typography

| Role | Family | Size | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Title | Geist | 17px | 600 | -0.01em | sentence |
| Venue line | Geist Mono | 11px | 500 | 0.12em | upper |
| Count pill | Geist Mono | 12px | 500 / 600 | 0.08em | sentence |
| Status | Geist | 15px | 500 | 0 | sentence |
| Status sub | Geist Mono | 11px | 400 | 0.1em | upper |
| Hint button | Geist Mono | 11px | 500 | 0.12em | upper |
| Primary buttons | Geist | 16px | 600 | 0 | sentence |
| Result title | Geist | 24px | 700 | -0.02em | sentence, in `--lock` |
| Result sub | Geist Mono | 11px | 500 | 0.12em | upper |
| Guest name | Geist | 28px | 600 | -0.02em | sentence |
| Fact key | Geist Mono | 11px | 500 | 0.12em | upper |
| Fact value | Geist | 15px | 500 | 0 | sentence, tabular |
| Ticket id | Geist Mono | 14px | 500 | 0.06em | upper |
| Code input | Geist Mono | 22px | 500 | 0.1em | upper |

The status line has `text-shadow: 0 1px 8px #000` so it reads over any camera picture.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Scene drift | load, loop alternate | translate, rotate | 0 → 4px/-3px/0.4deg → -3px/2px/-0.3deg | 7000ms | `--ease` | none |
| Grain | load, loop | translate | 6 offsets up to 21px | 1200ms, steps(6) | steps | none |
| Corners | load, loop alternate | translate | 0 → 6px inward | 2400ms | `--ease` | none |
| Scan line | load, loop alternate | top | 10px → 100% - 56px | 2400ms | cubic-bezier(.45,0,.55,1) | rests at middle |
| Lock | scan | width, height, rotate | 248px, 0 → 176px, -7deg | 300ms | `--out` | instant |
| Focus pull | scan | filter on guest phone | blur 1.4px → none | 300ms | `--ease` | instant |
| Verdict colour | +520ms | border colour | white → mint or red | 200ms | `--ease` | instant |
| Ring | verdict | scale, opacity | 1, 1 → 1.28, 0 | 700ms | `--out` | none |
| Edge flash | verdict | inset box-shadow, opacity | 8px, 1 → 0, 0 | 600ms | `--out` | none |
| Shake | invalid | margin-left | 0, -6, 6, -3, 0px | 360ms | `--ease` | none |
| Result sheet | verdict +650ms | translateY | 105% → 0 | 420ms | `--sheet-e` | instant |
| Torch | tap | scene brightness | 1 → 1.7 | 300ms | `--ease` | instant |

The breathing and scan line run all the time, so keep them slow and white. Colour is saved for the verdict.

## States

- Idle: white corners, scan line moving, scene drifting and blurred.
- Torch on: button white fill, black icon, `aria-pressed="true"`, scene brighter.
- Locked: reticle 176px at -7 degrees, scan line hidden, drift paused, guest phone sharp, status "Ticket found. Checking".
- Valid: `--lock` is mint. Corners, ring, edge flash, badge, and result title are mint. Count goes up by one.
- Invalid: `--lock` is red. Same parts in red, plus the shake. Count does not change.
- Manual input error: 1px red border, `aria-invalid="true"`, red help text with the character count.
- Gallery empty: status line swaps to the empty message. No sheet.
- Focus-visible: 2px white outline, 3px offset, 10px radius on buttons. The input uses a 2px white outline at 2px offset.
- Busy: while locked or a sheet is open, further simulate taps do nothing.
- Camera denied (not drawn): replace the scene with black, show `phone-permission-prompt` copy and a "Open Settings" button. Keep "Enter code manually" visible.
- Offline (not drawn): the count pill reads "Offline · 4 queued" and valid scans still show, marked "Will sync".

## Accessibility

- The camera, reticle, vignette, and flash are `aria-hidden`. The status line is the voice of the scanner.
- The status is `role="status"` with `aria-live="polite"`. It speaks "Ticket found. Checking", then "Valid ticket. Ines Albescu, Block B, Row 4, Seat 12." or "Invalid. Ticket already scanned at Gate 2 at 19:12."
- Colour is never the only signal. Valid shows a check and the word "Valid". Invalid shows a cross and "Already scanned".
- The torch is a toggle button with `aria-pressed`.
- Sheets are dialogs with `aria-modal="true"` and a heading. Focus moves in on open and back to the opener on close. Escape and the scrim close them.
- The input has a visible label, `autocomplete="off"`, `spellcheck="false"`, and `aria-describedby` pointing at the help line, which also carries the error.
- Hit targets: close and torch 44px, hint 44px tall, gallery 56px, manual 56px, Scan next 56px, Cancel 48px.
- Contrast: white on black is 21:1. `#b8b8b8` on `#111111` is about 9.8:1. `#8a8a8a` on `#111111` is about 5.3:1. Mint on `#111111` is about 11:1. Red `#ff5a4f` on `#111111` is about 6.1:1. Black on mint and black on red both clear 7:1.
- Vibration is a bonus. Wrap it in try/catch and never depend on it.

## Responsive rules

- 390 × 844: reticle 248px, centre at 50% - 30px, status 150px below centre.
- Under 800px tall (360 × 780): reticle 224px, centre at 50% - 40px, guest phone scaled 0.92, status 136px below centre.
- The bottom row always keeps the gallery square at 56px and gives the rest to the manual button.
- Never scroll, never scroll sideways. The camera wrapper clips the oversized scene.
- Landscape and tablet: keep the reticle square and centred, move the bottom controls to a right-hand column 88px wide, and open sheets as 420px centred panels.
- Do not draw a status bar. The scene runs under the top 54px. The header starts at 54px. The bottom row keeps 34px below it.

## Acceptance checklist

### Always

- [ ] The camera fills the frame. Nothing scrolls at 360px or 390px.
- [ ] Reticle has four corners and a scan line. Both move slowly and in white.
- [ ] On a read, the reticle snaps to the code's size and angle before any colour shows.
- [ ] Valid and invalid each have their own colour, icon, and word. Those colours appear nowhere else.
- [ ] A screen-edge flash and a ring mark the verdict. Invalid also shakes.
- [ ] The result sheet is a modal dialog with focus in and focus back.
- [ ] Manual entry validates length and shows the error in text, not only colour.
- [ ] Torch is a toggle with `aria-pressed`.
- [ ] Status changes go through one polite live region.
- [ ] Every control is 44px or larger and shows a focus ring.
- [ ] Reduced motion stops drift, grain, breathing, and the sweep but keeps the verdict.

### This demo

- [ ] App Gatepost, title "Scan tickets", "Pier Nine · Gate 2", count "312 / 480 checked in".
- [ ] Valid: Ines Albescu, Block B · Row 4 · Seat 12, Doors 19:00 · Show 20:15, PN9-7Q4K-2210.
- [ ] Invalid: "Already scanned", "Gate 2 · 19:12 · by Theo M.", Dario Pensa, PN9-3H8D-0417.
- [ ] Mint `#4fe3a5`, red `#ff5a4f`, sheet `#111111`, sheet radius 22px.
- [ ] Reticle 248px at rest, 176px at -7 degrees when locked.

## Implementation notes

**1. One variable drives every verdict colour.** Set `--lock` with a class on `body` and let the corners, ring, flash, badge, and title read it. Then valid and invalid are one line of JS each.

```css
:root { --lock: var(--ink); }
body.ok  { --lock: var(--valid); }
body.bad { --lock: var(--invalid); }
.c, .ring { border-color: var(--lock); }
.badge { background: var(--lock); }
.band h2 { color: var(--lock); }
body.locked .reticle { width: 176px; height: 176px; transform: translate(-50%, -50%) rotate(-7deg); }
body.locked .scanline { opacity: 0; animation: none; }
body.ok .ring, body.bad .ring { animation: ring .7s var(--out); }
body.bad .reticle { animation: shake .36s var(--ease); }
.flash.go { animation: flash .6s var(--out); }
@keyframes flash { 0% { opacity: 1; box-shadow: inset 0 0 0 8px var(--lock); }
  100% { opacity: 0; box-shadow: inset 0 0 0 0 var(--lock); } }
```

To replay the flash on back-to-back scans, remove the class, read `offsetWidth`, then add it again.

**2. Line the code up with the reticle.** The reticle centre and the QR centre must be the same point, and the guest phone must rotate around the QR, not its own middle. Otherwise the locked reticle sits a few pixels off and looks broken.

```css
.phone { position: absolute; left: 50%; top: var(--cy);
  width: 196px; height: 360px; margin: -158px 0 0 -98px;   /* QR centre is 158px down */
  transform: rotate(-7deg); transform-origin: 50% 158px; }
.reticle { position: absolute; left: 50%; top: var(--cy);
  width: var(--size); height: var(--size); transform: translate(-50%, -50%); }
```

With a real camera, the decoder returns four corner points. Set the reticle's centre, size, and angle from them instead of the fixed 176px and -7 degrees.

**3. Grain without an image.** One inline SVG with `feTurbulence`, sized a little larger than the frame, moved in steps. Set the filter region to the full box or Chrome cuts it into a visible rectangle.

```html
<svg class="grain"><filter id="n" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/>
  <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0"/>
</filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<style>.grain { position: absolute; inset: -40px; width: calc(100% + 80px); height: calc(100% + 80px);
  opacity: .16; mix-blend-mode: screen; animation: grain 1.2s steps(6) infinite; }</style>
```

Common mistakes:

- Making the scan line mint. Then mint means "scanning" and stops meaning "valid".
- A green check that appears with no lock first. Staff cannot tell which code was read.
- Glowing blobs as the "camera". The scene is a dim, real-looking picture: a surface, a held phone, a QR.
- Letting the drift show the edge of the scene. Oversize it and clip the wrapper.
- Grain that flickers every frame. Six steps over 1.2 seconds is the ceiling.
- Hiding "Enter code manually" behind a menu. Damaged screens happen at every door.
- Leaving the simulate button in production. It is a demo control only.
- Drawing a status bar.

Rebuild order:

1. Black page, camera wrapper, scene gradient, table edge, guest phone with the QR, grain, vignette.
2. Reticle with four corners, scan line, ring. Line its centre up with the QR.
3. Header with close, title, torch. Count pill. Status line.
4. Bottom hint, gallery, manual button.
5. Scrim, result sheet, manual sheet.
6. Lock, verdict, sheet timing, and the `--lock` colour switch.
7. Manual validation and the error text.
8. Focus moves, Escape, and live region text.
9. Reduced-motion block. Check 360 × 780.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
