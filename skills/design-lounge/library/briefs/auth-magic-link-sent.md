<!-- Design Lounge Nº 125 · "Magic link sent" · designlounge.vercel.app -->

# Magic link sent

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The screen a passwordless product shows straight after the user asks for a sign-in link. A tall peach tile on the left holds a CSS envelope that receives a letter, folds its flap shut and gets stamped, while a dotted flight trail draws itself above it. On the right a 104px "Check your inbox." headline sits over the address the link went to (editable inline), three "open your mail app" shortcuts and a ring that counts 30 seconds down before resend unlocks. It should feel warm and a little cheeky, and above all calm: the user knows exactly what to do next. The detail worth copying is that "wrong address" and "didn't arrive" are both fixed on this screen, with no trip back to the form.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────────────────┐
│ ■ Fernwork                                 Pricing  Changelog  Help centre │ 72
├──────────────────────────────┬────────────────────────────────────────────┤
│ ┌──────────────────────────┐ │ ● LINK SENT · EXPIRES IN 15 MIN            │
│ │ sealed & sent! ↘    ∘∙∙  │ │ Check your                                 │
│ │                    ∙ trail│ │ inbox.            (104px / 0.9)            │
│ │     ┌──────────────┐     │ │ lede, 18px, max 470px                      │
│ │     │  envelope    │     │ │ ( maya.okafor@tidepool.studio  [Edit] )    │
│ │     │  300 × 196 ▣ │     │ │ [Larkmail] [Inkbox] [Default app]   60h    │
│ │     └──────────────┘     │ │ ◯ Didn't arrive? You can resend in 0:28    │
│ │   ◠ sun arc             │ │                                            │
│ │          tap to send again│ │ Check spam…   Use a password instead      │
│ └──────────────────────────┘ │                                            │
├──────────────────────────────┴────────────────────────────────────────────┤
  48 pad · tile 540 · gap 64 · copy column fills
```

- `<header>` 72px: logo (30px ink tile with 10/10/10/2px radii and a 12px sun dot), name 20/800; `<nav>` with three links on the right.
- `<main>` grid: `540px 1fr`, gap 64px, padding `8px 48px 40px`.
- `<button class="stage">` the illustration tile, radius 36px. Children: an SVG trail, the handwritten `.note`, `.env-wrap` (envelope), `.replay` hint. All decorative children are `aria-hidden`.
- Envelope layers, back to front: `.back` (#F2B896), `.flap` (triangle, starts rotated open), `.letter` (paper card with three skeleton lines and a tomato CTA pill), `.pocket` (V-cut front via `clip-path`), `.stamp`.
- `<section class="copy">`: eyebrow, `<h1>`, lede, `.who` (chip or form), `.apps` group of three `<a>`, `.resend` row, `.fine` footer row pushed to the bottom with `margin-top:auto`.
- `.toast` fixed bottom centre, `role="status"`.

## Motion

| Element        | Trigger            | Property              | From → To                    | Duration | Easing       | Delay |
|----------------|--------------------|-----------------------|------------------------------|---------:|--------------|------:|
| `.letter`      | load / replay      | translateY            | −120px → 16px                | 600ms    | `--ease-out` | 250ms |
| `.flap`        | load / replay      | rotateX, z-index      | 180° (z 1) → 0° (z 5)        | 420ms    | `--ease`     | 850ms |
| `.stamp`       | load / replay      | scale, rotate         | 0, −20° → 1, 8°              | 380ms    | `--spring`   | 1300ms |
| trail path     | load / replay      | stroke-dashoffset, opacity | 120, 0 → 0, .35         | 1400ms   | `--ease`     | 1400ms |
| `.env-wrap`    | after sequence     | translateY, rotate    | 0 → −8px, −1.5° → 0 (loop)   | 4800ms   | `--ease`     | 2200ms, infinite |
| ring `.fg`     | every second       | stroke-dashoffset     | +100.5/30 per tick           | 1000ms   | linear (it is a clock) | — |
| `.app`         | hover              | translateY, shadow    | 0 → −2px                     | 160ms    | `--ease`     | — |
| `.form.bad`    | invalid submit     | translateX            | 0 → −6 → 6 → 0               | 300ms    | `--ease`     | — |
| `.toast`       | send               | opacity, translateY   | 0, 24px → 1, 0               | 240ms    | `--ease-out` | hides after 2600ms |

Reduced motion: all animations collapse to 1ms with no delay and a single iteration, so the envelope appears sealed and stamped, the bob loop stops, and transitions are instant. The countdown still counts.

## States

- **Sending (default):** green status dot with a 4px 16%-alpha halo; ring counting.
- **Ready to resend:** `.resend.ready`; countdown copy hidden, tomato "Resend link" pill shown (40px tall, hover scale 1.04 with the spring curve).
- **Editing:** `.who.editing`; chip hidden, form shown with 1.5px ink border.
- **Invalid email:** form border `--accent`, shake, `aria-invalid="true"`.
- **Hover:** chip "Edit" button background `--bg` → `--tile`; app shortcut lift + ink border; header links `--ink-2` → `--ink`.
- **Focus-visible:** 3px tomato outline, 3px offset, 8px radius, on every interactive element including the tile.
- **Toast visible:** `.toast.on`.

## Accessibility

- The illustration is a real `<button aria-label="Replay the envelope animation">`; every visual child inside it is `aria-hidden`.
- The page heading is the `<h1>`; the copy column is a `<section aria-labelledby>`.
- "Edit" has `aria-label="Edit email address"`. The inline input has an accessible name and `autocomplete="email"`.
- Keyboard: Tab order is header links, tile, Edit, apps, resend, footer links. Enter submits the inline form; Esc cancels and restores focus to Edit.
- The toast is `role="status" aria-live="polite"`, so "New link sent to …" is announced.
- Do not announce every countdown tick; the countdown text is not a live region.
- Contrast: `--ink` on `--bg` 14.8:1; `--ink-2` on `--bg` 6.2:1; `--ink-3` is only used for 12–13px fine print on `--bg` (4.6:1). White on `--accent` passes at the 15px bold size used.
- Hit targets: app buttons 60px tall, chip and form 48px, resend 40px.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: tile column shrinks to 440px; h1 drops to 88px.
- 768–1023: single column; tile becomes a 280px-tall banner above the copy with the envelope at 0.8 scale; h1 72px.
- < 640: tile 200px tall, h1 52px with `line-height:.95`; app shortcuts stack full-width (56px each); the address chip may wrap, so let the address ellipsize with `text-overflow:ellipsis` and keep Edit visible.

## Acceptance checklist

- [ ] The envelope sequence plays on load in the order letter, flap, stamp, trail, then bobs on a 4.8s loop.
- [ ] The flap is behind the letter while open and in front of it once closed (no letter visible through the flap).
- [ ] The letter never pokes out below the envelope at its resting position.
- [ ] The h1 is 104px / 800 with −0.055em tracking and a tomato full stop.
- [ ] The countdown starts at 0:30, uses tabular numerals, and the ring empties in step with it.
- [ ] At 0:00 a "Resend link" button replaces the countdown copy.
- [ ] Resend replays the envelope, resets the countdown and shows a toast for 2600ms.
- [ ] Edit swaps to an inline form with the address pre-selected; Enter saves and Esc cancels.
- [ ] An invalid address shakes the field, turns its border tomato and sets `aria-invalid`.
- [ ] Clicking the illustration tile replays the sequence.
- [ ] Every interactive element shows a 3px tomato focus ring.
- [ ] With reduced motion, the envelope is shown sealed and stamped with no bob loop.
- [ ] No emoji; all icons are inline SVG with `currentColor` strokes.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: on load the envelope sequence plays once (letter slides in at 250ms, flap closes at 850ms, stamp pops at 1300ms, trail draws at 1400ms), then the envelope bobs gently on a 4.8s loop starting at 2.2s.
2. The headline, address chip, app shortcuts and resend row are static and fully visible from frame one.
3. The resend ring starts full and loses 1/30 of its arc every second; the label reads "Didn't arrive? You can resend in 0:30" and counts down in tabular numerals.
4. At 0:00 the label is replaced by a tomato pill button "Resend link".
5. Click "Resend link": the envelope sequence replays from the start, the countdown resets to 0:30, and a dark toast slides up from the bottom centre: "New link sent to maya.okafor@tidepool.studio". It auto-hides after 2600ms.
6. Click "Edit" in the address chip: the chip is replaced by an inline form (same 48px pill height, 1.5px ink border) with the address pre-selected and a dark "Send link" button.
7. Submit a valid address: the chip returns with the new address, focus goes back to "Edit", and everything in step 5 happens.
8. Submit an invalid address: the field border turns tomato, the pill shakes ±6px over 300ms, `aria-invalid="true"` is set. Esc cancels editing and returns focus to "Edit".
9. Click anywhere on the illustration tile: the envelope sequence replays (it is a `<button>`), with a handwritten "tap to send again" hint in the tile's bottom-right corner.
10. Hovering an app shortcut lifts it 2px, darkens its border to ink and adds the soft shadow.

## Tokens

```css
:root {
  /* colour */
  --bg: #fff1e6;          /* page, warm peach cream */
  --tile: #ffd9c2;        /* illustration tile, chip hover */
  --tile-2: #ffc7a6;      /* sun arc inside the tile */
  --paper: #fffdf9;       /* letter, chips, app buttons */
  --pocket: #fff6ee;      /* envelope front */
  --envelope-back: #f2b896;
  --flap: #ffe6d6;
  --ink: #2a1636;         /* plum: text, logo, toast */
  --ink-2: #6b5770;       /* body copy */
  --ink-3: #8f7c90;       /* fine print, app sub-labels */
  --line: #f0d6c6;        /* borders on paper */
  --line-2: #e6bfa9;      /* envelope fold lines */
  --accent: #ff5a36;      /* tomato: full stop, ring, resend, stamp */
  --accent-ink: #ffffff;
  --sun: #ffc94d;         /* logo dot, toast check */
  --ok: #2f8f5b;          /* "sent" status dot */

  /* type */
  --font: "Bricolage Grotesque", system-ui, sans-serif;
  --hand: "Caveat", cursive;
  --fs-display: 104px;
  --fs-lede: 18px;
  --fs-body: 16px;
  --fs-chip: 17px;
  --fs-small: 13px;

  /* shape */
  --r-tile: 36px;
  --r-btn: 16px;
  --r-pill: 999px;
  --shadow: 0 18px 40px -18px rgba(42,22,54,.35), 0 2px 0 rgba(42,22,54,.06);

  /* spacing (4px base) */
  --s-2: 8px; --s-3: 12px; --s-5: 20px; --s-7: 28px; --s-12: 48px; --s-16: 64px;

  /* motion */
  --t-micro: 160ms;
  --t-move: 600ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
}
```

## Typography

| Role            | Family              | Size | Weight | Line-height | Tracking | Case      |
|-----------------|---------------------|-----:|-------:|------------:|---------:|-----------|
| Display h1      | Bricolage Grotesque (opsz 96) | 104px | 800 | 0.9 | −0.055em | sentence |
| Lede            | Bricolage Grotesque | 18px | 400    | 1.5         | 0        | sentence  |
| Address chip    | Bricolage Grotesque | 17px | 600    | 1           | −0.01em  | lowercase |
| Eyebrow         | Bricolage Grotesque | 13px | 600    | 1           | +0.06em  | UPPERCASE |
| App name        | Bricolage Grotesque | 15px | 600    | 1.2         | 0        | sentence  |
| App sub-label   | Bricolage Grotesque | 12px | 500    | 1.1         | 0        | sentence  |
| Countdown       | Bricolage Grotesque | 15px | 700    | 1.5         | 0        | tabular numerals |
| Handwritten note| Caveat              | 30px | 700    | 1           | 0        | lowercase, rotated −7° |
| Replay hint     | Caveat              | 22px | 700    | 1           | 0        | lowercase |

The h1 full stop is coloured `--accent`; it is the only accent in the headline.

## Implementation notes

**The flap must change stacking order mid-fold.** Animate `z-index` inside the same keyframes as the rotation; it interpolates as an integer, so it flips at the halfway point when the flap is edge-on and the swap is invisible:

```css
.flap { transform-origin: 50% 0; transform: rotateX(180deg); z-index: 1;
        clip-path: polygon(0 0, 100% 0, 50% 100%); }
.play .flap { animation: close 420ms var(--ease) .85s forwards; }
@keyframes close {
  0%   { transform: rotateX(180deg); z-index: 1; }
  49%  { z-index: 1; }
  50%  { z-index: 5; }
  100% { transform: rotateX(0);      z-index: 5; }
}
```

**The envelope front is one element.** A V-shaped `clip-path` makes the pocket; the two fold lines are hairline diagonal gradients on its `::after`, one per half:

```css
.pocket { clip-path: polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%); }
.pocket::after { content: ""; position: absolute; inset: 0;
  background:
    linear-gradient(to top right, transparent 49.6%, var(--line-2) 50%, transparent 50.4%) left / 50% 100% no-repeat,
    linear-gradient(to top left,  transparent 49.6%, var(--line-2) 50%, transparent 50.4%) right / 50% 100% no-repeat; }
```

**Replaying CSS animations** means removing the class, forcing a reflow, then adding it back. Reuse the same helper for the invalid-field shake:

```js
function replay() {
  stage.classList.remove('play');
  void stage.offsetWidth;            // flush styles
  stage.classList.add('play');
}
```

Common mistakes: putting the countdown in a live region (screen readers read every second); using `setInterval` without clearing it on resend, which runs two clocks at once; forgetting that the bob loop must start after the sequence, or the envelope wobbles while the letter is still dropping in.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
