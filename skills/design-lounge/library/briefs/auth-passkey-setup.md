<!-- Design Lounge Nº 133 · "Passkey setup with face-scan ring" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Passkey setup with face-scan ring

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The last step of an onboarding flow in a fictional banking app, Wren, where the user creates a passkey. It uses an iOS 26 language: liquid-glass pill buttons and cards over a dark, softly lit background (teal light from the top left, ember from the bottom right). The centrepiece is a 216px ring of 72 ticks around a Face-ID-style glyph. When scanning starts the ticks light up mint one after another, the glyph nods left and right, and then the ticks dissolve into one solid ring with a check drawn inside it. The detail worth copying is that the headline, sub-copy and primary button all change with the ring's state, so the screen reads as one continuous conversation.

## Reference behaviour

1. Initial state (t = 0): ticks are 18%-white, the glyph is 68%-white, the state label reads "Ready", the headline reads "Sign in with a glance", and the primary button reads "Create passkey".
2. At 350ms the sequence auto-starts and enters **scanning**: ticks turn mint clockwise from 12 o'clock with a 22ms stagger (72 × 22 = 1584ms for the full sweep). The glyph brightens to full ink and does a 1.6s nod (−5px/−3° then +5px/+3°). A soft mint halo fades in behind it. The label reads "Scanning" in ink; the button turns translucent mint, reads "Look at your iPhone" and gets `aria-busy="true"`.
3. At 2200ms the screen enters **done**: ticks fade out with a fast 4ms stagger; the glyph scales to 0.7 and fades; a solid 5px mint circle (r 86) draws itself from 12 o'clock over 700ms (120ms delay); the check draws over 480ms (520ms delay).
4. In the done state the label reads "Passkey saved" in mint, the headline becomes "You're all set", the sub-copy names the saved passkey ("Wren · iPhone 17"), and the button reads "Continue to Wren".
5. Tapping the ring at any time restarts the sequence from step 1.
6. In the idle state, tapping "Create passkey" runs the sequence. In the done state, tapping "Continue to Wren" returns the demo to idle (in a real product it would navigate onward).
7. "Use a password instead" is a quiet text button below the CTA; "Skip" is a glass pill top right; Back is a 44px glass circle top left.

## Structure

```
390 × 844 (status bar overlay drawn by the Lounge in the top 54px)
┌──────────────────────────────────────┐
│               54px clear              │
│ (‹)    Step 3 of 3 · Security  (Skip) │ 44  glass pills
│                                      │
│            ╭ ┄ ┄ ┄ ┄ ┄ ╮             │
│           ┆  ⌜      ⌝  ┆             │ ring 216 × 216, margin-top 18
│           ┆    ˙ ˙     ┆             │ ticks r 96 → 106
│           ┆  ⌞  ◡   ⌟  ┆             │
│            ╰ ┄ ┄ ┄ ┄ ┄ ╯             │
│              ● Scanning              │ 20
│        Sign in with a glance         │ h1 30px
│   Create a passkey for Wren on …     │ sub, max 310
│ ┌──────────────────────────────────┐ │
│ │ [k] No password to forget        │ │ glass card, 3 rows
│ │ [s] Can't be phished             │ │
│ │ [d] Syncs with your keychain     │ │
│ └──────────────────────────────────┘ │
│              (flex spacer)           │
│ ( ======== Create passkey ======== ) │ 56
│        Use a password instead        │ 44
│               34px clear              │
└──────────────────────────────────────┘
  side padding 20
```

- `.app` is a flex column with `padding: 54px 20px 34px`; a `.grow` spacer pushes the CTA to the bottom.
- `.bar`: three items, `justify-content: space-between`. Back and Skip are `<button class="gbtn">`.
- `<button class="ringwrap" aria-label="Replay passkey scan">` holds `.halo` and one inline SVG (`viewBox 0 0 216 216`) with `<g id="ticks">` (72 generated `<line>`s), `circle.solid`, `g.face` and `path.check`.
- `.state` label (decorative, `aria-hidden`); a separate visually-hidden `aria-live` paragraph announces state changes.
- `.card role="list"`: three `.row role="listitem"`, each a 34px tinted icon tile plus a bold title and a 13px explanation.

## Tokens

```css
:root {
  /* colour */
  --bg: #0b1315;                         /* base under the lighting */
  --light-teal: #1d4b47;                 /* radial light, top left */
  --light-ember: #3b2a1a;                /* radial light, bottom right */
  --ink: #eef6f3;
  --ink-2: rgba(238,246,243,.68);        /* body */
  --ink-3: rgba(238,246,243,.46);        /* step label, idle state */
  --mint: #7df0c8;                       /* the single accent */
  --mint-ink: #062019;                   /* text on mint */
  --tick: rgba(238,246,243,.18);         /* idle ticks */

  /* glass */
  --glass: rgba(255,255,255,.07);
  --glass-2: rgba(255,255,255,.12);
  --glass-line: rgba(255,255,255,.14);
  --glass-hi: inset 0 1px 0 rgba(255,255,255,.18);
  --blur: blur(24px) saturate(160%);

  /* type */
  --font: "Figtree", -apple-system, system-ui, sans-serif;
  --fs-h1: 30px; --fs-body: 15px; --fs-small: 13px; --fs-cta: 17px;

  /* shape */
  --r-card: 22px;
  --r-tile: 10px;
  --r-pill: 999px;
  --ring: 216px;
  --cta-h: 56px;

  /* motion */
  --t-micro: 160ms;
  --t-move: 360ms;
  --t-hero: 700ms;
  --tick-stagger: 22ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

## Typography

One family, Figtree, at five roles. Tracking tightens as size grows.

| Role           | Size | Weight | Line-height | Tracking | Notes |
|----------------|-----:|-------:|------------:|---------:|-------|
| Headline h1    | 30px | 800    | 1.08        | −0.03em  | centred, swaps text with state |
| CTA            | 17px | 700    | 1           | −0.01em  | on mint |
| Row title      | 15px | 600    | 1.4         | −0.01em  | |
| Body / sub     | 15px | 400    | 1.4         | 0        | `--ink-2`, max-width 310px |
| Row detail     | 13px | 400    | 1.4         | 0        | `--ink-2` |
| Step / state   | 13px | 600    | 1           | +0.02em  | `--ink-3`, ink or mint by state |

## Motion

| Element      | Trigger     | Property            | From → To                    | Duration | Easing       | Delay / stagger |
|--------------|-------------|---------------------|------------------------------|---------:|--------------|-----------------|
| `.tick`      | scan        | stroke              | `--tick` → `--mint`          | 160ms    | `--ease`     | `i × 22ms` (clockwise from 12) |
| `.face`      | scan        | translateX, rotate  | 0 → −5px/−3° → +5px/+3° → 0  | 1600ms   | `--ease`     | — |
| `.halo`      | scan        | opacity             | 0 → 1                        | 700ms    | `--ease`     | — |
| `.tick`      | done        | opacity             | 1 → 0                        | 300ms    | `--ease`     | `i × 4ms` |
| `.face`      | done        | opacity, scale      | 1, 1 → 0, 0.7                | 300 / 400ms | `--ease-out` | — |
| `.solid`     | done        | stroke-dashoffset   | 540 → 0                      | 700ms    | `--ease-out` | 120ms |
| `.check`     | done        | stroke-dashoffset   | 110 → 0                      | 480ms    | `--ease-out` | 520ms |
| `.cta`       | press       | scale               | 1 → 0.97                     | 160ms    | `--ease`     | — |

Timeline: idle 0–350ms, scan 350–2200ms, done from 2200ms (check finishes at about 3200ms).

Reduced motion: no nod, no staggers; all transitions are 1ms. Scan starts at 0ms and done follows at 10ms, so the user sees the finished ring and check immediately.

## States

- **Idle:** grey ticks, glyph at 68% ink, "Ready", CTA solid mint "Create passkey".
- **Scanning:** mint ticks sweeping, halo on, "Scanning" in ink; CTA background `rgba(125,240,200,.35)`, ink text, `aria-busy="true"`.
- **Done:** solid ring and check, "Passkey saved" in mint, headline and sub swapped, CTA "Continue to Wren".
- **Pressed:** CTA scales to 0.97.
- **Focus-visible:** 2px mint outline at 3px offset on every button, including the ring (which is circular via `border-radius:50%`).
- **Error (to add in production):** if the platform credential call rejects, return to idle and replace the sub-copy with "Face ID didn't finish. Try again or use your password." Keep the tick colour grey; never show red on a biometric screen.

## Accessibility

- The ring is a `<button>` labelled "Replay passkey scan"; the SVG inside is `aria-hidden`.
- State changes are announced through a visually-hidden `<p aria-live="polite">`: "Scanning with Face ID", then "Passkey created". The on-screen state label is `aria-hidden` to avoid double reading.
- The explanation card is `role="list"` with three list items, so VoiceOver announces "list, 3 items".
- Focus order: Back, Skip, ring, CTA, "Use a password instead".
- Hit targets: every control is at least 44px tall (Back 44 × 44, Skip 44 tall, CTA 56, text button 44).
- Contrast: `--ink` on the darkest background is 16:1; `--ink-2` body is about 9:1; mint-ink on mint is 12:1.

## Responsive rules

- 390 × 844: as specified.
- 360 wide: side padding 16px; ring 196px (scale tick radii proportionally: 87 → 96); h1 27px.
- Short phones (height < 720): drop the third row's detail line and reduce the ring's top margin to 8px so the CTA stays above the 34px home-indicator zone.
- Tablet / iPad sheet: render inside a 540px-wide form sheet, centred; ring 240px; the card keeps a 480px max-width.

## Acceptance checklist

- [ ] Exactly 72 ticks sit between radii 96 and 106 in a 216px SVG, starting at 12 o'clock.
- [ ] Scanning sweeps clockwise with a 22ms per-tick stagger.
- [ ] The glyph nods during scan and fades and shrinks to 0.7 in done.
- [ ] The solid ring starts drawing at 12 o'clock (rotated −90°), not at 3 o'clock.
- [ ] The check finishes drawing after the ring, about 1s after done begins.
- [ ] Headline, sub-copy, state label and CTA text all change with each state.
- [ ] The CTA is `aria-busy="true"` only while scanning.
- [ ] Tapping the ring restarts the sequence cleanly even mid-scan (no stuck half-lit ticks).
- [ ] Glass surfaces use `backdrop-filter: blur(24px) saturate(160%)`, a 14%-white border and a 1px inner top highlight.
- [ ] Nothing interactive sits in the top 54px or bottom 34px.
- [ ] State changes are announced by a polite live region.
- [ ] Reduced motion shows the finished check immediately with no nod.

## Implementation notes

**Generate the ticks in JS and stagger them with a custom property.** One CSS rule then drives the whole sweep:

```js
const N = 72, NS = 'http://www.w3.org/2000/svg';
for (let i = 0; i < N; i++) {
  const a = i / N * Math.PI * 2 - Math.PI / 2;           // start at 12 o'clock
  const l = document.createElementNS(NS, 'line');
  l.setAttribute('x1', 108 + Math.cos(a) * 96);  l.setAttribute('y1', 108 + Math.sin(a) * 96);
  l.setAttribute('x2', 108 + Math.cos(a) * 106); l.setAttribute('y2', 108 + Math.sin(a) * 106);
  l.setAttribute('class', 'tick'); l.style.setProperty('--i', i);
  ticks.appendChild(l);
}
```

```css
.scan .tick, .done .tick { stroke: var(--mint); transition-delay: calc(var(--i) * 22ms); }
.done .tick { opacity: 0; transition-delay: calc(var(--i) * 4ms); }
```

**Draw the ring and check with dash offsets**, and rotate the circle so it starts at the top:

```css
.solid { stroke-dasharray: 540; stroke-dashoffset: 540;   /* 2π × 86 ≈ 540 */
         transform: rotate(-90deg); transform-origin: center;
         transition: stroke-dashoffset 700ms var(--ease-out); }
.done .solid { stroke-dashoffset: 0; transition-delay: 120ms; }
```

**Restart safely.** Keep the timeouts in an array, clear them, reset to idle and force a reflow before scheduling again; otherwise a second tap while scanning leaves transitions half-applied. In production, swap the second timeout for the resolution of `navigator.credentials.create({ publicKey })`.

Common mistakes: putting `backdrop-filter` on an element with no translucent background (it does nothing); stacking blur on the full-screen background, which is expensive (only the pills and the card blur); using a green-to-blue gradient for "success" (one flat mint does the job).

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
