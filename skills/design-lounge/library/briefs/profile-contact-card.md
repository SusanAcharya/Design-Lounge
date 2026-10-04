<!-- Design Lounge Nº 222 · "Digital business card" · designlounge.vercel.app -->

# Digital business card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A shareable contact page that is just the card: a 560×320 (7:4) business card on a warm stone ground. The front is deep teal with brass-foil serif type, a hairline arch monogram, faint concentric arches, and two tap-to-copy rows (email, phone). The back is bone paper with a QR code, the address, and a Save contact button. Underneath sit two pills, Show back and Download .vcf, and a one-line status.

It should feel like a letterpressed card in your hand: the whole card tilts a few degrees toward the pointer, the flip uses an iOS-sheet curve, and the name's brass gradient drifts slowly like foil catching light. The detail worth copying is that Save actually works: it builds an RFC 2426 vCard 3.0 string with CRLF line endings, wraps it in a `text/vcard` Blob, and downloads `teodora-ashgrove.vcf`. The card belongs to Teodora Ashgrove, principal at Kilnworth Studio.

## Structure

```
page 1280×800, radial stone gradient, content centred, gap 28px
        ┌──────────────── card 560 × 320, radius 14 ────────────────┐
front   │ ∩ arch mark 40px                         KILNWORTH        │
        │                                          STUDIO  (mono 10) │
        │ Teodora                                    ((( faint arches│
        │ Ashgrove   Gloock 52 / .92, brass foil      )))           │
        │ PRINCIPAL · LANDSCAPE ARCHITECTURE (mono 11)               │
        │ ───────────── brass hairline fading right ──────────────── │
        │ ✉ teodora@kilnworth.studio            ☏ +44 20 7946 0321   │
        └────────────────────────────────────────────────────────────┘
back    │ ┌─────────┐  Scan to save   (Gloock 30)                     │
        │ │ QR 176  │  14 Ropewalk Yard / Bristol BS1 6QA / UK        │
        │ │ on white│  (⤓ Save contact)  44px pill                    │
        │ └─────────┘  kilnworth.studio/teodora                       │
                 ( ⟲ Show back )  ( ⤓ Download .vcf )   42px pills
                 status line, mono 12px, role=status
```

- `main.wrap` (max 560px) → `.scene` (`container-type: inline-size`, `perspective: 1400px`) → `.tilt` (pointer rotation) → `.card` (flip, `preserve-3d`) → two `section.face` labelled "Card front" / "Card back".
- Front: decorative SVG mark, studio text, `h1` name, `p` title, decorative rule, two copy `button`s each with an icon, the value `span`, and an `aria-hidden` tag `span`.
- Back: `div.qr` containing `svg role="img"` with a label; `h2`, address `p`, Save `button`, fine-print `p`.
- Controls: Show back `button aria-pressed aria-controls="card"`, Download `button`.
- Status: `p role="status" aria-live="polite"`.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing |
| --- | --- | --- | --- | --- |
| Flip | Show back / card click | `transform: rotateY` | 0 → 180° | 800ms `--flip` |
| Tilt | pointermove on scene | rotateX, rotateY | 0 → ±4°, ±5° | 500ms `--expo` |
| Foil | always | `background-position` (200% gradient) | 0 → 100%, alternate | 6s `--ease`, infinite |
| Copied tag | copy success | opacity, translateY | 0, 4u → 1, 0 | 180ms `--ease`, held 1600ms |
| Copy row | hover | background | none → `--teal-2` | 160ms |
| Save pill | `:active` | scale | 1 → 0.97 | 120ms |

The foil loop is slow and low contrast so it can sit in a grid. Reduced motion: transitions and animations 0.01ms; `.card` gets no transform; both faces are stacked flat and the hidden one is `opacity: 0; visibility: hidden`.

## States

- Copy row hover: `--teal-2` wash, radius 8u. Success: tag visible for 1600ms.
- Flip button: teal fill; label toggles Show back / Show front; `aria-pressed`.
- Download pill: 60% bone fill with a 1px ink inset ring; hover full bone.
- Save pill: teal; hover `--teal-2`.
- Hidden face: `inert` (not focusable, not clickable).
- Focus-visible: 2px brass outline, offset 3px.
- Status idle hint → copy result → download result; never empty.

## Accessibility

- Each copy button has an explicit `aria-label` ("Copy email teodora@kilnworth.studio"); the "Copied" tag is `aria-hidden` and the result is announced by the status line.
- Show back is a toggle (`aria-pressed`) with `aria-controls` pointing at the card. The face that is turned away is `inert`, so keyboard users never tab into invisible buttons.
- Card-surface click is a convenience; the button is the accessible way to flip.
- QR `svg` has `role="img"` and a label. The address and the Save button repeat its content in text.
- Contrast: `#f1ece2` on `#11302d` ≈ 12:1; `#b9c8c3` on teal ≈ 8:1; `#5a6662` on bone ≈ 5.3:1; brass `#d6a25a` on teal ≈ 6.4:1.
- Hit targets: page pills 42px; Save 44u; copy rows `max(36px, 40u)`.

## Responsive rules

- ≥1280 / 1024 / 768: card 560px.
- <640 (checked at 375): card is the viewport minus 32px; every inner size scales via `--u` (container query units), so the layout is identical, just smaller. Copy rows keep a 36px minimum height. The pills stay full size below.
- The phone number and email never wrap (`white-space: nowrap`); the copied tag is absolutely positioned so it doesn't push them.
- No horizontal overflow at 375px.

## Acceptance checklist

### Always

- [ ] Card is 7:4 and every inner dimension scales from one container-relative unit.
- [ ] Flip is a 3D rotateY with `backface-visibility: hidden`; the hidden face is `inert`.
- [ ] Flip is reachable by a labelled toggle button, not only by clicking the card.
- [ ] Copy uses the Clipboard API with a textarea fallback and announces the result in a status region.
- [ ] The copied tag does not change the row's layout.
- [ ] Save builds a vCard 3.0 string with CRLF endings, escapes commas in values, and downloads a `.vcf` Blob with a sensible filename; the object URL is revoked.
- [ ] Pointer tilt is subtle (≤ 5°) and disabled under reduced motion.
- [ ] Reduced motion still flips (instant swap) and still copies and saves.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Name "Teodora Ashgrove", studio "Kilnworth Studio", title "Principal · Landscape Architecture".
- [ ] Email `teodora@kilnworth.studio`, phone `+44 20 7946 0321`, address 14 Ropewalk Yard, Bristol BS1 6QA.
- [ ] File `teodora-ashgrove.vcf`, 291 bytes.
- [ ] Front `#11302d` with brass `#d6a25a`→`#f0c98a` foil; back `#f1ece2`.
- [ ] QR is 29×29 modules on white with three finder squares.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: front face up. Name "Teodora / Ashgrove" in brass foil, the foil gradient sliding back and forth over 6s. Status reads "Tap the email or phone to copy. Flip for the QR."
2. Moving the pointer over the card tilts it: rotateX = −y × 8°, rotateY = x × 10° (x, y from −0.5 to 0.5 across the card), easing over 500ms. Leaving resets to flat.
3. Clicking the email row copies `teodora@kilnworth.studio`. A small brass "Copied" tag rises 4px into view above the row's right end for 1600ms, the row shows its hover wash, and the status reads "Email copied. teodora@kilnworth.studio". Same for phone (`+44 20 7946 0321`, "Phone number copied.").
4. If the Clipboard API is refused, fall back to a hidden readonly textarea + `execCommand('copy')`. If that fails too, the status says "Copy blocked here. Select … manually." and no tag appears.
5. Clicking Show back (or any non-button area of the card) rotates the card 180° on Y over 800ms. The button label becomes "Show front" with `aria-pressed="true"`. The hidden face is `inert`, so its buttons leave the tab order.
6. On the back, Save contact (and Download .vcf below, on either side) generates the vCard, triggers a download named `teodora-ashgrove.vcf`, revokes the object URL after 1s, and sets the status to "teodora-ashgrove.vcf created · 291 bytes · vCard 3.0" (size from `blob.size`).
7. The QR is drawn as one SVG `path` on a 29×29 grid: three finder squares, timing rows, an alignment square at (22,22), and data modules seeded from a hash of the vCard text. It is illustrative; production should encode the vCard or a profile URL with a real QR encoder.
8. Reduced motion: no tilt, no foil drift, no 3D. Flipping swaps faces instantly (opacity/visibility).

## Tokens

```css
:root {
  /* colour */
  --bg: #cdc8bd;          /* stone ground, centre */
  --bg-2: #bfb9ad;        /* stone ground, edge */
  --teal: #11302d;        /* card front, primary buttons */
  --teal-2: #1b423e;      /* hover on teal */
  --brass: #d6a25a;       /* foil base, icons, rule, focus */
  --brass-2: #f0c98a;     /* foil highlight, studio text, copied tag */
  --bone: #f1ece2;        /* card back, text on teal */
  --bone-ink: #132a27;    /* text and QR on bone */
  --bone-3: #5a6662;      /* address text */
  --ink: #1d1f1c;         /* page text */
  --ink-2: #45473f;       /* status text */

  /* type */
  --serif: "Gloock", Georgia, serif;
  --mono: "Azeret Mono", ui-monospace, monospace;

  /* card unit: 1 design px at 560px card width */
  --u: calc(100cqw / 560);

  /* shape */
  --r-card: calc(var(--u) * 14);
  --r-qr: calc(var(--u) * 10);
  --r-pill: 999px;
  --shadow-card: 0 1px 0 rgba(255,255,255,.25) inset,
                 0 calc(var(--u)*30) calc(var(--u)*50) calc(var(--u)*-24) rgba(20,24,20,.55),
                 0 calc(var(--u)*4) calc(var(--u)*10) rgba(20,24,20,.18);

  /* motion */
  --flip: cubic-bezier(.32,.72,0,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-flip: 800ms; --t-tilt: 500ms; --t-foil: 6s;
}
```

## Typography

All card sizes are `calc(var(--u) * N)` with N below, so the card scales as one object.

| Role | Family | Size (N) | Weight | Tracking / case | Colour |
| --- | --- | --- | --- | --- | --- |
| Name | Gloock | 52 / lh 0.92 | 400 | -0.01em | brass foil gradient |
| Studio | Azeret Mono | 10 / 1.5 | 500 | 0.22em upper | `--brass-2` |
| Title | Azeret Mono | 11 | 400 | 0.08em upper | `#b9c8c3` |
| Copy rows | Azeret Mono | 12.5 | 500 | 0 | `--bone` |
| Copied tag | Azeret Mono | 10 | 500 | 0.1em upper | `--teal` on `--brass-2` |
| Back heading | Gloock | 30 / 1 | 400 | 0 | `--bone-ink` |
| Address | Azeret Mono | 11.5 / 1.55 | 400 | 0 | `--bone-3` |
| Save button | Azeret Mono | 12.5 | 600 | 0 | `--bone` on teal |
| Fine print | Azeret Mono | 10 | 400 | 0.06em | `--bone-3` |
| Page controls | Azeret Mono | 13px | 500 | 0 | |
| Status | Azeret Mono | 12px | 400 / 600 for the subject | 0 | `--ink-2` |

## Implementation notes

**The vCard.** Keep fields in one object and build lines from it. Escape `,` `;` `\` in text values. Use `\r\n`.

```js
const vcard = [
  'BEGIN:VCARD', 'VERSION:3.0',
  `N:${c.last};${c.first};;;`, `FN:${c.first} ${c.last}`,
  `ORG:${c.org}`, `TITLE:${c.title.replace(/,/g, '\\,')}`,
  `TEL;TYPE=WORK,VOICE:${c.tel}`, `EMAIL;TYPE=WORK:${c.email}`,
  `ADR;TYPE=WORK:;;${c.street};${c.city};;${c.zip};${c.country}`,
  'END:VCARD', ''
].join('\r\n');

function save() {
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = 'teodora-ashgrove.vcf';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
```

On iOS Safari a `.vcf` download opens the Contacts sheet directly, which is the "tap to save" moment. Sandboxed iframes without `allow-downloads` block it silently; keep the status line truthful about what was created.

**Flip plus tilt.** Put tilt and flip on different elements, or the pointer transform overwrites the 180°.

```css
.scene { container-type: inline-size; perspective: 1400px; }
.tilt  { transform-style: preserve-3d; transition: transform .5s var(--expo); }
.card  { position: relative; aspect-ratio: 7/4; transform-style: preserve-3d;
         transition: transform .8s var(--flip); }
.card.flipped { transform: rotateY(180deg); }
.face  { position: absolute; inset: 0; backface-visibility: hidden; }
.back  { transform: rotateY(180deg); }
```

```js
function flip(toBack) {
  card.classList.toggle('flipped', toBack);
  flipBtn.setAttribute('aria-pressed', toBack);
  front.inert = toBack; back.inert = !toBack;
}
```

**One unit for the whole card.** `--u: calc(100cqw / 560)` declared on `:root` is substituted where it's used, so inside `.scene` it resolves against the card's width. Write every card size as `calc(var(--u) * N)` with N straight from the 560px design.

Common mistakes:

- Leaving the back's buttons focusable while the front is showing.
- A QR from a remote image API. Generate it locally; never fetch.
- Calling the download "saved to contacts". A browser can only create the file.
- Using `\n` line endings; some contact apps reject the card.
- Tilting more than 5°. It becomes a toy instead of a card.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
