---
title: "Sign-in mascot with following eyes"
summary: "A library sign-in where Pip's pupils trail the pointer, read along the caret, cover up for the PIN, peek when it's shown, blink and squint."
platform: web
type: component
category: cursor
tags: [hover, cursor, mascot, sign-in, eyes, type]
styles: [playful, soft]
motion: rich
difficulty: 2
featured: false
published: 2026-10-31
palette: ["#17392E", "#FBF5EA", "#F0A63A", "#16241E", "#1E5B45"]
fonts: ["Be Vietnam Pro", "Reddit Sans"]
related: [split-sign-in, cursor-ink-blob, magnetic-buttons]
---

# Sign-in mascot with following eyes

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The member sign-in for a fictional public library, "Fernwick Library". A marigold creature called Pip peeks over the top edge of the sign-in card with its paws on the rim. Its pupils follow the pointer with a slight lag, follow the caret letter by letter while you type your card number, and when the PIN field takes focus Pip closes its eyes and covers them with both paws. Press "Show" and one paw slides aside so one eye can peek. A speech bubble beside Pip is the polite live region, so every mood change is also a sentence. The detail worth copying is the caret tracking: the target is measured from the text before the cursor, so the eyes move along the field as you type, not to its centre.

## Reference behaviour

1. First frame: deep green page, "Someone's expecting you." at 100px on the left, the sign-in card on the right with Pip above it. With no pointer yet, both pupils look down at the "Card number or email" field. Bubble: "Hello again. Your holds are on the cart."
2. Mouse move anywhere: each pupil gets its own direction from its own eye centre (so they converge on near targets), with an offset of 11.5 × (1 − e^(−d/90)) SVG units. That puts the pupil at the rim for anything over about 200px away and centres it as the pointer reaches the face. The drawn pupil eases toward the target with a 85ms time constant.
3. Pointer down anywhere: Pip squints (upper lids drop 20 units, lower lids rise 10) until pointer up or cancel. On touch or pen the pupils jump their target to the tap point; there is no hover on touch.
4. Pointer leaves the window: the eyes go back to the focused field, or the card number field if nothing is focused.
5. Focus the card field: the eyes go to the caret. Every input, keyup, click and select re-measures the caret. While typing, the mouth becomes a small "o"; 600ms after the last key it returns to a smile (bigger if the value is valid, 14 digits or an email). Bubble: "Card number or email, whichever is handy." then "Got it. Now the secret bit." once valid.
6. Focus the PIN field (or its Show button): both lids close, both paws rise 64 units, rotate ±10° and scale to 1.3 over the eyes (440ms spring). Bubble: "Not looking. Promise."
7. Press Show (`aria-pressed="true"`, label becomes "Hide", field becomes `type="text"`, focus returns to the field): the right paw slides to the side (translate 16, −60, rotate 32°), the right lid opens, and that eye reads the PIN at the caret. Bubble: "Okay, one tiny peek."
8. Focus leaves the form: paws drop, lids open, bubble returns to the greeting.
9. Submit with a bad card number (not 14 digits, not an email): the field gets `aria-invalid`, a red message under it, brows tilt ±12°, mouth frowns, focus moves to the field and the eyes follow it. Bubble: "Hmm, that number looks off. It is 14 digits, on the back of your card." A short PIN (< 4) does the same on the PIN field. Typing clears the error.
10. Submit valid: the eyes become two happy arcs, the mouth a wide smile, the button reads "Signed in" and is disabled. Bubble: "Welcome back, Odile. 3 holds are waiting at Larch Street." After 3600ms everything resets and focus returns to the button.
11. Blinks: every 2600–6200ms (random), the upper lids close and open over 170ms; one blink in five is a double (second one 280ms later). No blinks while covered.
12. Reduced motion: the pointer is ignored, the pupils snap with no lag to the focused element (the caret in text fields), there are no blinks, and paws and lids change instantly.

## Structure

```
1280 × 800, radial green ground, 56px bookshelf strip at the bottom
┌──────────────────────────────────────────────────────────────────────────┐
│ [■] Fernwick Library                     Larch Street branch · open till │ 36/72
│                                       ┌bubble 196┐   .-~~~~-.            │
│ Someone's                             │Hello again│  /  ◉   ◉ \  Pip 240 │
│ expecting            100px / .94      └──────────▸  |  ‿      |  ×186   │
│ you.                                             ┌──(paw)──(paw)──────┐  │ card top y 270
│                                                  │ Sign in   28px     │  │
│ Sign in to renew loans… 17px, 420 max            │ Use the number…    │  │
│ ───────────────────────────────── 1px 18%        │ Card number or em… │  │
│ 41,820       09:00–20:00     Free                │ [ 48px input     ] │  │
│ cards issued Mon to Sat      for residents       │ PIN…  Forgot PIN?  │  │
│                                                  │ [ input   (Show) ] │  │
│                                                  │ [ Sign in  52px  ] │  │
│                                                  │ New to Fernwick?…  │  │
│                                                  └──── 420px ─────────┘  │ right 100
│▌▌▐▌▌▐▌▌▐▌▌▐▌▌▐▌▌▐▌▌▐▌▌▐ bookshelf spines, 6px top plank ▌▌▐▌▌▐▌▌▐▌▌▐▌▌▐│
└──────────────────────────────────────────────────────────────────────────┘
```

- Brand link, branch line `p`, `.copy` with the `h1`, lede and a `ul.facts`.
- `main.desk` (420px, absolute right 100, top 270) holds the mascot `svg.pip` (`aria-hidden`, `pointer-events: none`, z 2, at left 150, top −152), the bubble `p#say aria-live="polite"`, and the `form` labelled by its `h2`.
- Fields are real `label` + `input` pairs; errors are `p.err` linked with `aria-describedby`. The Show control is a `button type="button"` with `aria-pressed` and `aria-controls="pw"`.
- The shelf is a decorative `div aria-hidden`.

Mascot SVG (viewBox 0 0 240 186): body dome `M22 153V106C22 52 64 22 120 22S218 52 218 106V153Z`; tuft of three 4-unit strokes; cheeks rx 12 ry 7 at 45% opacity; brows; eyes at (88, 92) and (152, 92), sclera r 26, pupil r 11.5 with a r 3.6 highlight at (−4, −4.5); each eye is clipped to its circle and holds an upper lid (60 × 62 rect + a 3-unit lash line, closed = translateY 52) and a lower lid; a 2-unit fur-coloured ring sits over each eye to hide clip antialiasing; happy arcs; mouth path; paws are ellipses rx 24 ry 17 at (70, 160) and (170, 160) with a 2-unit outline and three toe strokes. The body ends at y 153, exactly on the card's top edge; the paws overlap the card by 18 units.

## Tokens

```css
:root {
  --green: #17392E;      /* page; radial from #1F4A3B at 78% 10% to #0F2A21 */
  --green-2: #0F2A21;
  --cream: #F6EEDC;      /* text on green, 13:1 */
  --cream-2: #B9C7B5;    /* secondary text on green, 7:1 */
  --card: #FBF5EA;       /* card and bubble */
  --ink: #16241E;        /* text on card, pupils, mouth */
  --ink-2: #55625A;      /* secondary on card, 6:1 */
  --edge: #7D8880;       /* input border, 3.6:1 on card */
  --go: #1E5B45;         /* primary button, links on card */
  --go-hover: #174A38;
  --err: #A3361F;        /* error text and border */
  --fur: #F0A63A;        /* Pip */
  --fur-2: #E0902E;      /* paws */
  --fur-line: #B86A1A;   /* tuft, brows, lash line, paw outline */
  --cheek: #E77F32;      /* at 45% */
  --white: #FFFDF6;      /* sclera */
  --show-bg: #EDE4CF;  --show-hover: #E4D8BD;

  --display: "Be Vietnam Pro", system-ui, sans-serif;
  --ui: "Reddit Sans", system-ui, sans-serif;

  --fs-display: 100px; --fs-card-title: 28px; --fs-lede: 17px; --fs-body: 16px; --fs-label: 14px; --fs-small: 13px; --fs-fact: 22px;
  --space: 6px 16px 22px 28px 32px 36px 44px 72px;
  --r-card: 20px; --r-input: 10px; --r-button: 12px; --r-show: 8px; --r-bubble: 14px 14px 4px 14px;
  --shadow-card: 0 30px 60px -30px rgba(0,0,0,.55);
  --shadow-bubble: 0 10px 24px -14px rgba(0,0,0,.6);

  --ease: cubic-bezier(.2,.7,.2,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
  --lag: 85ms;           /* pupil time constant */
  --lid: 120ms; --paw: 440ms; --blink: 170ms; --brow: 200ms;
  --pupil-max: 11.5;     /* SVG units */
}
```

## Typography

| Role | Family | Size | Weight | Line height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Display | Be Vietnam Pro | 100px (phone 36px) | 800 | 0.94 | −0.05em | Sentence |
| Brand | Be Vietnam Pro | 19px | 800 | 1 | −0.02em | Title |
| Card title | Be Vietnam Pro | 28px | 800 | 1.1 | −0.03em | Sentence |
| Fact numbers | Be Vietnam Pro | 22px | 700 | 1.2 | −0.02em | — |
| Lede | Reddit Sans | 17px | 400 | 1.55 | 0 | Sentence |
| Labels | Reddit Sans | 14px | 600 | 1.5 | 0 | Sentence |
| Inputs | Reddit Sans | 16px | 500 | — | 0.01em | — |
| Bubble | Reddit Sans | 14px (phone 13) | 500 | 1.4 | 0 | Sentence |
| Button | Reddit Sans | 16px | 700 | — | 0 | Sentence |
| Small, errors, links | Reddit Sans | 13px | 400 / 500 / 600 | 1.5 | 0 | Sentence |

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Pupil follow | pointer move, tap, caret move, focus | translate | current → target | exponential, τ 85ms, rAF only while moving | snaps, pointer ignored |
| Squint | pointer down | upper lid / lower lid | 0 → 20 / 0 → −10 | 120ms `--ease` | instant |
| Cover | PIN focus | lids; paws translate, rotate, scale | open → 52; rim → (±18, −64), ±10°, 1.3 | 120ms; 440ms `--spring` | instant |
| Peek | Show pressed | right paw; right lid | → (16, −60), 32°; 52 → 0 | 440ms `--spring`; 120ms | instant |
| Blink | random 2600–6200ms | upper lids | 0 → 52 → 0 | 170ms `--ease` | none |
| Happy | valid submit | sclera group / arcs opacity | 1 → 0 / 0 → 1 | 160ms `--ease` | instant |
| Worried brows | invalid submit | rotate | 0 → ∓12° | 200ms `--ease` | instant |
| Mouth | typing / valid / error / success | path swap | calm, o, glad, sad | instant | same |
| Button press | active | scale | 1 → .985 | 120ms `--ease` | none |

## States

- Idle: eyes on the card field or the pointer, smile, greeting bubble.
- Typing: "o" mouth, eyes on the caret. Valid: bigger smile, "Got it."
- Covered: lids shut, paws over eyes, no blinking.
- Peeking: left eye covered, right eye open and on the PIN caret, Show reads "Hide".
- Error: field border `--err`, 13px message, worried brows, frown; cleared on input.
- Signed in: arcs for eyes, button "Signed in" disabled for 3600ms.
- Input focus: border `--go` plus a 3px `rgba(30,91,69,.28)` ring. Show and button focus: 2px `--go` outline. Links and brand on green: 2px `--fur` outline, offset 3px.
- Hover: button `--go-hover`, Show `#E4D8BD`.

## Accessibility

- The mascot is decorative (`aria-hidden`); the bubble is `aria-live="polite"` and only changes on a state change, never per keystroke.
- Real labels, `autocomplete="username"` and `current-password`, `aria-invalid` and `aria-describedby` errors. Focus moves to the first invalid field.
- Show is a toggle button with `aria-pressed`, `aria-controls`, and a visible label that changes Show / Hide; pressing it returns focus to the PIN so typing continues.
- Pip never blocks input: `pointer-events: none` on the SVG.
- Contrast: cream on green 13:1, `--cream-2` 7:1, ink on card 15:1, `--ink-2` 6:1, placeholder `#6B746E` 4.6:1 on white, input edge 3.6:1, cream on `--go` 7.6:1, `--err` on card 6:1.
- Hit targets: inputs 48px, button 52px, Show 36px inside a 48px field.

## Responsive rules

- ≥ 1024: as drawn.
- 768–1023: the card stays 420px at right 100; the headline column narrows and wraps; facts may drop to two.
- < 700: everything flows in one column with 16px gutters. Branch line, lede and facts hide. The headline is 36px and wraps naturally (the `br` tags hide, so keep a space before each). The desk gets a 168px top margin for Pip, who aligns to the card's right edge (−6px); the bubble moves to the card's left at 150px wide, 13px. The page scrolls vertically if needed.
- The eye maths reads the SVG's on-screen size, so any scale works; re-aim on resize.

## Acceptance checklist

### Always

- [ ] Each pupil aims from its own eye centre and never leaves its sclera (max offset = sclera r − pupil r).
- [ ] Pupils ease with a short lag and the rAF loop stops when they settle.
- [ ] In a text field the eyes follow the caret position, not the field centre.
- [ ] Password focus closes the lids and covers the eyes; showing the password uncovers one eye only.
- [ ] Random blinks every few seconds, none while covered.
- [ ] Squint on pointer down, released on pointer up and pointer cancel.
- [ ] On touch the eyes follow the last tap and the focused field.
- [ ] Every mood change is a sentence in a polite live region.
- [ ] Reduced motion: pointer ignored, eyes snap to the focused element, no blinking, instant paws.
- [ ] Inputs keep a ≥ 3:1 edge on the card; focus is visible on every control.

### This demo

- [ ] Fernwick Library, Larch Street branch, open till 20:00; headline "Someone's expecting you."
- [ ] Card numbers are 14 digits (placeholder "2913 0044 1872 06"); PIN at least 4.
- [ ] Bubble lines: "Hello again. Your holds are on the cart.", "Not looking. Promise.", "Okay, one tiny peek.", "Welcome back, Odile. 3 holds are waiting at Larch Street."
- [ ] Pip `#F0A63A` on `#17392E`, card `#FBF5EA`, button `#1E5B45`.

## Implementation notes

**Aim and ease.** Compute targets in screen space from each eye's centre, store them in SVG units, and only run the loop while something is moving.

```js
function aim(pt) {
  const r = svg.getBoundingClientRect(), k = r.width / 240;
  eyes.forEach(e => {
    const dx = pt.x - (r.left + e.c.x * k), dy = pt.y - (r.top + e.c.y * k);
    const d = Math.hypot(dx, dy) || 1, m = 11.5 * (1 - Math.exp(-d / 90));
    e.tgt = { x: dx / d * m, y: dy / d * m };
    if (reduce.matches) { e.cur = { ...e.tgt }; draw(e); }
  });
  if (!reduce.matches && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
}
// tick: f = 1 - Math.exp(-dt / 0.085); cur += (tgt - cur) * f; stop when |tgt - cur| < .04
```

**Caret position.** Measure the text before the caret with a canvas using the input's own font; mask it for passwords.

```js
function caret(inp) {
  const cs = getComputedStyle(inp), r = inp.getBoundingClientRect();
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const n = inp.selectionStart ?? inp.value.length;
  const t = inp.type === 'password' ? '•'.repeat(n) : inp.value.slice(0, n);
  const x = r.left + parseFloat(cs.paddingLeft) + ctx.measureText(t).width - inp.scrollLeft;
  return { x: Math.min(x, r.right - 12), y: r.top + r.height / 2 };
}
```

**Lids, not pupils, do the expressions.** Clip each eye to its circle and slide body-coloured lids inside the clip; covering, peeking, squinting and blinking are all lid transforms, so the pupil maths never changes.

```css
.squint .lid { transform: translateY(20px); }
.cover .lid, .peek .l .lid { transform: translateY(52px); }
.cover .paw.l { transform: translate(18px, -64px) rotate(-10deg) scale(1.3); }
.peek .paw.r  { transform: translate(16px, -60px) rotate(32deg) scale(1.3); }
.blink .lid   { animation: blink 170ms cubic-bezier(.2,.7,.2,1); }
@keyframes blink { 50% { transform: translateY(52px); } }
```

Common mistakes:

- Computing one angle for both eyes; near targets look wrong without vergence.
- Clamping with a hard `min(d, max)`; the pupils snap to the rim. The exponential falls off smoothly near the face.
- Uncovering when focus moves from the PIN to its Show button; treat the field and its toggle as one zone.
- A live region that re-announces on every keystroke.
- Running a permanent rAF loop for idle eyes.
- Leaving pointer tracking on under reduced motion; the eyes should only move when focus moves.
