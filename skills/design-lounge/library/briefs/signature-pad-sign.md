<!-- Design Lounge Nº 617 · "Signature pad with type instead" · www.designlounge.live -->

# Signature pad with type instead

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The last page of a tenancy renewal from "Ostler & Finch", an invented letting agent, for Flat 3, 27 Calder Row. The landlord has already signed; the tenant, Ilse Marchetti, signs in a white pad with a baseline and an ×. Ink is navy and behaves like a pen: quadratic smoothing between pointer samples, and a width that thins as the hand speeds up (4.2px slow, 0.9px fast). Undo removes the last stroke, Clear wipes the pad, and "Type instead" swaps the canvas for a name field that sets the signature in a script face, so keyboard and screen-reader users sign the same document. Signing enables "Sign and send" in the side rail; sending drops a red rubber stamp with today's date onto the signature.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────┐
│ [O] Ostler & Finch │ Tenancy renewal · Flat 3, 27 Calder Row  Page 4 of 4│ 56px bar
├──────────────────────────────────────────────────────────────────────────┤
│  desk #E3DED3, padding 28, gap 36                                         │
│  ┌──────────────── sheet 760, pad 40/56 ─────────┐  ┌── rail 330 ──────┐ │
│  │ Renewal of … · OF-58213           Page 4 of 4 │  │ NEW MONTHLY RENT │ │
│  │ 12. Rent and term                             │  │ £1,385   (46px)  │ │
│  │ Monthly rent   £1,385.00 £1,340.00            │  │ from 1 Dec …     │ │
│  │ Term / Deposit / Rent day                     │  │ ✓ Read           │ │
│  │ 13. Signatures                                │  │ ✓ Initial        │ │
│  │ By signing you confirm …                      │  │ ◉ Sign as tenant │ │
│  │ LANDLORD          TENANT        Type instead  │  │ [Sign and send]  │ │
│  │ ~~signature~~    ┌───────────────── [SIGNED]┐ │  │ fine print       │ │
│  │ ───────────      │ ×______________________  │ │  └──────────────────┘ │
│  │ Tobias Renning   │      Sign above the line │ │                        │
│  │ Signed 29 Oct    └──────────────────────────┘ │                        │
│  │  200px           Ilse Marchetti  ↶Undo ✕Clear │                        │
│  └───────────────────────────────────────────────┘                        │
└──────────────────────────────────────────────────────────────────────────┘
```

- `header.top` with brand, document name and page count.
- `main.sheet` labelled by the "Signatures" `h2`; the terms are a `table` with `th scope="row"`.
- Landlord signature: a `div role="img" aria-label="Signature of Tobias Renning"` holding an inline SVG path.
- Tenant block `div.tb`: label row with `button.swap` (`aria-controls="pad"`), `div.pad` (baseline span, × svg, hint span, `canvas role="img"` with instructions in its label, `div.typed aria-hidden`), a labelled `input` (hidden until typing), tools row with two `button`s, and the stamp (`aria-hidden`).
- `aside.rail` with the summary card, an `ol` of steps, the send `button` and fine print.
- One visually hidden `p aria-live="polite"`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Pad focus ring | pointer down, focus-within | border-color, box-shadow | edge → navy + 3px tint | 160ms | --ease | instant |
| Hint | first ink | opacity | 1 → 0 | 200ms | --ease | instant |
| Ink | pointer move | canvas | live | per event | — | same |
| Sending | click | label | "Sign and send" → "Sending" | 650ms hold | — | 0ms |
| Stamp | sent | scale, rotate, opacity | 1.7 −14° 0 → .94 −7° 1 → 1 | 380ms | --stamp-ease | appears in place |
| Pad nudge | sent | translate | 0 → 2px → 0 | 160ms, delay 220ms | ease | none |
| Button press | active | scale | 1 → .98 | 160ms | --ease | none |

## States

- Pad: rest (edge border), hover (`#6F6A5D`), inking or focus-within (navy border + 3px tint), has ink (hint hidden), done (edge border, no pointer events).
- Tools: Undo and Clear disabled while empty: text `#4F4B43` (still 6:1), icons at 55% opacity, `not-allowed`; hover `#F1EEE6` wash.
- Typing: canvas hidden, typed name shown, input visible with navy focus border and tint ring.
- Send: disabled `#DCD8CE` / `#4F4B43`; enabled navy, hover `#14204A`; sending; sent green with white text and a check.
- Steps: done (green disc, white check), current (white disc, 1.5px navy ring, 8px navy dot), current-done (green).
- Focus-visible everywhere: 2.5px navy outline, offset 3px.

## Accessibility

- Drawing is pointer-only by nature, so the keyboard route is first-class: "Type instead" sits in the label row before the pad in tab order, focuses a labelled input ("Type your full name to sign"), and the typed name is the signature.
- The canvas is `role="img"` whose label explains both routes; the typed preview is `aria-hidden` because the input already holds the value.
- Undo and Clear are real buttons with visible text; Cmd/Ctrl+Z works inside the block.
- Sign and send is a native disabled `button` until signed; the fine print below it says why.
- Live region: "Signature added. Sign and send is ready.", "Last stroke removed.", "Signature cleared.", "Signed and sent on 31 OCT 2026 at 14:22."
- After sending, focus moves to "Start again" so it is not lost on the disabled button.
- Contrast: body 15:1, `--ink-2` 6.6:1, pad border 3.8:1 (≥ 3:1 for a control edge), white on navy 13:1, white on green 6.4:1, stamp red 6:1.
- `touch-action: none` on the canvas.

## Responsive rules

- ≥ 1280: sheet and rail side by side as drawn.
- < 1100: rail moves under the sheet at the same 760px width and stops being sticky.
- < 640: top bar hides the document name; sheet padding 24/18; the two signature blocks stack; landlord ink area 84px; typed signature 54px; the hint hides; the stamp sits 30px down so it clears the label row.
- The canvas is always 100% of its block; on resize, the backing store is resized to `devicePixelRatio` and strokes are redrawn from stored fractions.

## Acceptance checklist

### Always

- [ ] Ink is smoothed with quadratic curves through midpoints, never straight polyline segments.
- [ ] Stroke width varies with pointer speed and is low-pass filtered so it never jumps.
- [ ] Coalesced pointer events are used when available; the canvas is sized for `devicePixelRatio`.
- [ ] Undo removes exactly one stroke; Clear removes all; both are disabled when the pad is empty.
- [ ] A typed-name path exists, is reachable before the pad by keyboard, and counts as a signature.
- [ ] The send button is disabled until a signature exists and says why underneath.
- [ ] Sending locks the signature and stamps the real date and time.
- [ ] The pad and the name input each have a border of at least 3:1 against the paper.
- [ ] A resize keeps the drawn signature.
- [ ] Reduced motion keeps everything working with no stamp animation.

### This demo

- [ ] Ostler & Finch renewal for Flat 3, 27 Calder Row; tenant Ilse Marchetti; landlord Tobias Renning signed 29 Oct 2026.
- [ ] Pen `#1C2B57`, 4.2px to 0.9px, speed factor 2.2, smoothing .38; signed after 40px of ink.
- [ ] Stamp `#A8321F`, −7°, "SIGNED" and "DD MON YYYY · HH:MM".
- [ ] Typed signature in Mrs Saint Delafield 64px.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame (1280 × 800): a 56px top bar ("Ostler & Finch", "Tenancy renewal · Flat 3, 27 Calder Row", "Page 4 of 4") over a warm desk. A 760px paper sheet shows clause 12 "Rent and term" as a 4-row table (rent £1,385.00 with £1,340.00 struck through, term, deposit, rent day), clause 13 "Signatures" with a consent sentence, then two blocks: Landlord (a navy ink signature on a ruled line, "Tobias Renning / Signed 29 Oct 2026") and Tenant (the empty pad).
2. Right rail, 330px: "New monthly rent", "£1,385" at 46px, "from 1 December 2026, up £45", a 3-step list (two green checks, "Sign as tenant" as the current step with a navy ring and dot), a disabled "Sign and send", and the line "Add your signature to continue. Ostler & Finch countersign within one working day."
3. Pad at rest: 150px tall, 1.5px `#858072` border, radius 10, white. A baseline at 108px from the top, 22px inset; a 18px × above its left end; "Sign above the line" at the right under the baseline. Hover darkens the border to `#6F6A5D`.
4. Pointer down (primary) on the canvas: pointer capture, a dot at 70% of max width, the border turns navy with a 3px `#E7EAF2` ring. Each move (coalesced events included) adds a point if it is ≥ 1.2px from the last, with width `w = 0.62·w_prev + 0.38·clamp(4.2 − 2.2·v, 0.9, 4.2)` where `v` is px per ms. Each new point draws one quadratic segment from the previous midpoint through the previous point to the new midpoint.
5. Pointer up or cancel: the stroke is kept, the whole pad redraws, the hint fades out (200ms). Undo stroke and Clear enable.
6. Once total ink length passes 40px: Sign and send enables (navy), the current step turns green, the rail line reads "Ready. Ostler & Finch countersign within one working day.", and the live region says "Signature added. Sign and send is ready."
7. Undo stroke pops the last stroke and redraws ("Last stroke removed." or "Signature cleared."). Clear removes all. Cmd/Ctrl+Z inside the tenant block also undoes.
8. "Type instead" (text link in the Tenant label row) hides the canvas, shows "Type your full name to sign" with a 42px input, and focuses it. As you type, the name renders in Mrs Saint Delafield 64px navy on the baseline. Two or more characters count as signed. The link now reads "Draw instead"; switching back restores the drawn strokes.
9. Sign and send: label "Sending" for 650ms, then the tenant block locks (no drawing, tools hidden, input disabled), a stamp lands top right of the pad, rotated −7°: "SIGNED" over "31 OCT 2026 · 14:22" (the real date and time). It scales 1.7 → .94 → 1 and rotates −14° → −7° over 380ms; the pad nudges down 2px at 220ms like paper taking the blow.
10. The button becomes green "✓ Signed and sent"; the rail line reads "Sent 31 Oct 2026 at 14:22. A countersigned copy will follow by email."; a "Start again" link appears and takes focus. Start again resets everything.
11. Resizing redraws from stored strokes; points are stored as fractions of the pad width, so the signature scales with it.
12. Reduced motion: no stamp animation, no nudge, sending is instant; ink still draws live.

## Tokens

```css
:root {
  --desk: #e3ded3;      /* backdrop */
  --bar: #f7f5ef;       /* top bar */
  --paper: #fffefb;     /* sheet, rail card */
  --ink: #1f1e1a;
  --ink-2: #5d5a51;     /* labels, fine print ~6.6:1 on paper */
  --line: #e2ddd2;      /* table rules */
  --edge: #858072;      /* pad and input border 3.8:1 on paper */
  --pen: #1c2b57;       /* ink, primary button, links */
  --pen-hover: #14204a;
  --pen-tint: #e7eaf2;  /* focus ring around pad */
  --stamp: #a8321f;     /* rubber stamp */
  --ok: #2f6b46;        /* done steps, sent button */
  --off: #dcd8ce; --off-ink: #4f4b43;   /* disabled button 6.1:1 */
  --sans: "Afacad", system-ui, sans-serif;
  --script: "Mrs Saint Delafield", cursive;
  --r-pad: 10px; --r-input: 8px; --r-button: 10px; --r-card: 14px;
  --shadow-sheet: 0 1px 0 #d2ccbf, 0 14px 34px -14px rgba(60,50,30,.28);
  --ease: cubic-bezier(.2,.7,.2,1);
  --stamp-ease: cubic-bezier(.3,.7,.3,1);
  --pen-max: 4.2px; --pen-min: .9px; --pen-speed: 2.2; --pen-smooth: .38;
}
```

Spacing: 4, 8, 10, 12, 14, 18, 20, 22, 24, 28, 36, 40, 56. Pad 150px tall; baseline at 108px; × at (22, 84), 18px.

## Typography

| Role | Family | Size | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Brand | Afacad | 17px | 700 | −0.01em | Title |
| Running head, page count | Afacad | 13–15px | 400 | 0 | Sentence |
| Clause heading | Afacad | 17px | 600 (number 500, `--ink-2`) | −0.005em | Sentence |
| Table, body | Afacad | 15–16px | 400 / 500 values | 0 | Sentence |
| Block labels, rail kicker | Afacad | 13px | 600 | 0.06em | Upper |
| Rent figure | Afacad | 46px | 600 | −0.03em | — |
| Send button | Afacad | 17px | 600 | 0 | Sentence |
| Typed signature | Mrs Saint Delafield | 64px (54 under 640) | 400 | 0 | as typed |
| Stamp | Afacad | 20px / 13px | 700 / 600 | 0.16em / 0.04em | Upper |

## Implementation notes

**Speed-weighted, smoothed ink.** Store points as fractions of the pad width; draw each new point as one quadratic segment between midpoints:

```js
function add(e) {
  const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / W, y = (e.clientY - r.top) / W;
  const l = live[live.length - 1];
  if (!l) { live.push({ x, y, t: e.timeStamp, w: 4.2 * .7 }); return dot(live[0]); }
  const dist = Math.hypot(x - l.x, y - l.y) * W; if (dist < 1.2) return;
  const v = dist / Math.max(1, e.timeStamp - l.t);                  // px per ms
  const target = Math.max(.9, Math.min(4.2, 4.2 - v * 2.2));
  live.push({ x, y, t: e.timeStamp, w: l.w * .62 + target * .38 });
  if (live.length >= 3) seg(live, live.length - 1);
}
function seg(s, i) {
  const a = s[i - 2], b = s[i - 1], c = s[i], k = W;
  const m1 = i === 2 ? a : { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const m2 = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
  ctx.beginPath(); ctx.lineWidth = (b.w + c.w) / 2;
  ctx.moveTo(m1.x * k, m1.y * k); ctx.quadraticCurveTo(b.x * k, b.y * k, m2.x * k, m2.y * k); ctx.stroke();
}
cv.addEventListener('pointermove', e => { if (live) (e.getCoalescedEvents?.() ?? [e]).forEach(add); });
```

**Crisp on every screen.** Size the backing store to the device pixel ratio and redraw from data, never from a bitmap:

```js
function size() {
  const r = cv.getBoundingClientRect(), d = devicePixelRatio || 1;
  W = r.width; H = r.height; cv.width = Math.round(W * d); cv.height = Math.round(H * d);
  ctx.setTransform(d, 0, 0, d, 0, 0); redraw();
}
new ResizeObserver(size).observe(cv);
```

**The stamp.** One element, `visibility: hidden` until done, then a WAAPI keyframe set: `[{scale:1.7,opacity:0,rotate:'-14deg'},{scale:.94,opacity:1,rotate:'-7deg',offset:.6},{scale:1,opacity:1,rotate:'-7deg'}]`, 380ms. Give it a paper background and a double border (2.5px border plus `inset 0 0 0 2px paper, inset 0 0 0 3.5px red`) so it reads as rubber, not a badge.

Common mistakes:

- Drawing `lineTo` between raw samples; fast strokes turn into polygons.
- Mapping speed straight to width with no smoothing; the line pulses like a caterpillar.
- Leaving the canvas at CSS size on a 2× screen; the ink is blurry.
- Hiding the typed fallback in a menu, or making it a second-class "accessibility mode".
- Forgetting `touch-action: none`; on a phone the page scrolls instead of signing.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
