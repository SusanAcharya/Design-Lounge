<!-- Design Lounge Nº 120 · "Light fintech landing with tilting card" · designlounge.vercel.app -->

# Light fintech landing with tilting card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The landing page for **Quire**, a fictional business-banking product for small companies. Top to bottom: a light nav, a hero with a 92px Instrument Serif headline beside a debit card built entirely in CSS, a four-up trust-stat band, two alternating feature rows with miniature product UI, a centred serif testimonial, a cobalt CTA panel and a compliance footer. The page should feel like a calm, expensive stationery shop, not a crypto app. What makes it worth copying is the card. It sits in 3D on a faint 48px grid, floats gently at rest, and turns to follow the pointer with a soft-light glare that tracks the cursor. Three finish swatches recolour it.

## Structure

```
1280 × 800                                               page height ≈ 2730px
┌────────────────────────────────────────────────────────────────────────┐
│ ◯ Quire   Accounts Cards Tax vault Pricing Customers   Log in [Open an account] │ 72
├───────────────────────────────┬────────────────────────────────────────┤
│ (New) 4.10% APY…              │  ┌ Invoice #1042 paid ┐   48px grid,  │
│ Business banking     92px     │  └────────────────────┘   radial mask │
│ that keeps the                │        ╱▔▔▔▔▔▔▔▔▔▔▔▔▔▔╲  380×240 card │
│ books for you.                │       │ Quire  BUSINESS·DEBIT │ 3D   │
│ lede 19px / 460               │       │ ▣ chip                │      │
│ [ you@company.com  (Get started) ] │  │ 4417 2290 0183 6025   │      │
│ fine print 13px               │        ╲______________________╱      │
│                               │ Finish ● ● ●   ┌ +$1,240 to Tax vault ┐│
├───────────┬───────────┬───────┴───┬────────────────────────────────────┤
│ 48,000    │ $2.1B     │ $5M       │ 4.9          stats: 52px serif     │
└───────────┴───────────┴───────────┴────────────────────────────────────┘
below: feature row (copy | transactions UI) · feature row (vault UI | copy)
       testimonial 48px serif centred · cobalt CTA 72px · footer disclosures
hero grid 1.05fr 1fr, gap 24 · stage 540px tall · gutter 72px
```

- `<nav aria-label="Main">`: logo (serif wordmark with a 18px ring mark), links, two pill buttons.
- `<header class="hero">`: left column (`.pill`, `h1`, `.lede`, `form.signup`, `.fine`); right column `.stage` with `perspective: 1100px`.
- `.stage::before` holds the grid and white bloom, masked to fade at its edges. Chips and swatches sit above it unmasked.
- `.card[aria-label]`: `.top` (wordmark + tier), `.chipc` (EMV chip from gradients and two pseudo-element hairlines), `.num`, `.bot` (holder name, expiry, two overlapping circles).
- `.stats` four-column grid with left hairlines between items.
- `.rows` > two `section.row`; `.row.rev .copy { order: 2 }` swaps sides.
- `section.quote` > `blockquote` + `.who`; `section.cta`; `<footer>`.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---:|---|
| Card | idle | translate | 0 → −10px, alternate | 6s loop | `--ease` |
| Chips `.f1` / `.f2` | idle | translate | 0 → −8px, alternate | 5s / 5.5s (+0.8s delay) | `--ease` |
| Card | pointermove on stage | rotateX / rotateY | pointer-mapped, ±11° / ±14° | 80ms | linear (tracking) |
| Glare `::before` | pointermove | radial-gradient centre | follows pointer % | 80ms | linear |
| Card | pointerleave | transform | → resting pose | 500ms | `--ease-out` |
| Card | swatch click | background, color | finish A → B | 500ms | `--ease` |
| Buttons | hover / active | background; scale | → hover colour; 1 → .98 | 160ms | `--ease` |

Reduced motion: no float, no bob, and pointer tracking is not attached; the card stays in its resting pose. Swatches still work (1ms).

## States

- **Primary dark button:** `--ink` fill, hover `#2b2e36`. **Cobalt button:** hover `--accent-2`. **Ghost:** hover `--surface-2`.
- **Active (pressed):** `scale(.98)`.
- **Focus-visible:** 2px cobalt outline, 3px offset, 8px radius. The signup uses `:focus-within` for its border and halo instead.
- **Swatch selected:** `box-shadow: 0 0 0 2px var(--ink)` (2px page-coloured border inside keeps a gap); unselected `0 0 0 1px var(--line-2)`.
- **Live tilt:** `.stage.live` swaps the card's transition to 80ms linear and removes the float animation.
- **Amounts:** outgoing in `--ink` with a true minus (U+2212); incoming `--pos` with a plus.

## Accessibility

- The card is a `div` with `aria-label="Quire business card"`; its number and chip are `aria-hidden` so screen readers don't read a fake PAN.
- Swatches are `<button aria-pressed>` with names (Graphite, Cobalt, Bone) inside `role="group" aria-label="Card finish"`.
- Email input has a visually hidden `<label>`; the submit is a real `<button type="submit">`.
- Tilt is pointer-only decoration; nothing depends on it.
- Contrast: `--ink-2` on `--bg` 6.6:1; `--ink-3` (3.3:1) is used only for 13px fine print and placeholders. Pair it with `--ink-2` if your audit requires 4.5:1. White on cobalt 6.9:1.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: h1 76px; stage 460px tall; card 330×208; stats stay 4-up.
- 768–1023: hero stacks, stage below the copy at 420px; stats 2×2; feature rows stack with the UI below the copy (`order` reset); CTA single column.
- < 640: gutter 20px; nav collapses to logo + "Open an account"; h1 52px; card 300×190 with tilt disabled (no hover on touch); testimonial 30px; CTA h2 44px with 32px padding.

## Acceptance checklist

- [ ] The headline is three lines at 1280 with "keeps the books" italic and `#2f4bff`.
- [ ] The full stat band is visible above 800px.
- [ ] The card is 380×240 with an 18px radius, built only from CSS (no images), including the EMV chip.
- [ ] At rest the card floats 10px on a 6s loop; while hovered the float stops.
- [ ] Pointer tilt maps to at most ±14° Y and ±11° X, and the glare follows the pointer.
- [ ] On pointer leave the card returns to `rotateX(8deg) rotateY(-16deg) rotateZ(-4deg)` over 500ms.
- [ ] The three swatches recolour the card and update `aria-pressed`.
- [ ] The grid behind the card fades out at its edges while chips and swatches stay fully opaque.
- [ ] The signup shows a cobalt border and 4px soft halo on focus.
- [ ] Feature rows alternate sides; vault meters render as 6px bars.
- [ ] The footer carries a "not a bank" disclosure.
- [ ] With reduced motion nothing moves, but every section is complete.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: top of the page. The nav, the "New 4.10% APY" pill, the three-line headline ("Business banking / that *keeps the* / *books* for you." with the italic words in cobalt), the lede, the email signup and the full stat band are visible within 800px.
2. At rest the card is posed at `rotateX(8deg) rotateY(-16deg) rotateZ(-4deg)` and floats 10px up and down on a 6s alternate loop. Two white notification chips bob 8px on 5s and 5.5s loops (the second is delayed 0.8s).
3. Move the pointer over the hero's right-hand stage: the float pauses and the card tilts toward the pointer. rotateY ranges ±14deg across the stage width and rotateX ±11deg across its height. It follows on an 80ms linear transition, and the glare highlight moves to the pointer position.
4. Pointer leaves the stage: the card eases back to its resting pose over 500ms (expo out) and the float resumes.
5. Click a finish swatch (Graphite, Cobalt, Bone): the card gradient and text colour cross-fade over 500ms; the pressed swatch gets a 2px ink ring and `aria-pressed="true"`.
6. Focus the email field: the pill-shaped signup gets a cobalt border plus a 4px `--accent-soft` halo. Submitting does nothing (demo).
7. Scroll: the feature rows alternate copy-left/UI-right, then UI-left/copy-right. The testimonial sits between two hairlines and the CTA panel is a 28px-radius cobalt block with concentric rings in the top-right.

## Tokens

```css
:root {
  /* surfaces */
  --bg: #f5f3ee;          /* warm paper page */
  --surface: #fffdfa;     /* cards, chips, inputs */
  --surface-2: #ece9e1;   /* tags, meter tracks, ghost hover */
  --line: #e0dcd2;
  --line-2: #cbc6ba;
  /* text */
  --ink: #15171c;
  --ink-2: #575a62;
  --ink-3: #8b8d93;
  /* accent */
  --accent: #2f4bff;      /* cobalt */
  --accent-2: #2238d6;    /* hover */
  --accent-soft: #e3e7ff; /* focus halo, icon tiles */
  --pos: #1f7a4d;         /* incoming money */
  /* card finish (swapped by JS) */
  --card-a: #2a2c31;  --card-b: #15161a;  --card-ink: #e9e6df;
  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Hanken Grotesk", system-ui, sans-serif;
  /* layout */
  --gutter: 72px;
  --r: 12px;  --r-lg: 20px;  --r-card: 18px;  --r-panel: 28px;
  /* elevation */
  --shadow-card: 0 40px 60px -30px rgba(21,23,28,.45), 0 12px 24px -12px rgba(21,23,28,.25);
  --shadow-chip: 0 10px 30px -12px rgba(21,23,28,.25);
  /* motion */
  --t-fast: 160ms;
  --t-tilt: 500ms;
  --t-follow: 80ms;
  --float: 6s;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

Finishes: Graphite `#2a2c31 → #15161a` / ink `#e9e6df`; Cobalt `#4560ff → #1c2fc4` / ink `#f3f4ff`; Bone `#efe9dc → #d6cfbf` / ink `#2a2c31`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Hero h1 | Instrument Serif | 92px | 400 | 0.94 | −0.025em | sentence; italic cobalt emphasis |
| Section h2 | Instrument Serif | 56px | 400 | 1.0 | −0.02em | sentence; one italic word |
| CTA h2 | Instrument Serif | 72px | 400 | 1.0 | −0.02em | sentence, white |
| Testimonial | Instrument Serif | 48px | 400 | 1.12 | −0.015em | sentence, curly quotes |
| Stat value | Instrument Serif | 52px | 400 | 1 | −0.02em | numerals |
| Logo | Instrument Serif | 28px | 400 | 1 | −0.01em | — |
| Lede | Hanken Grotesk | 19px | 400 | 1.5 | 0 | sentence |
| Body | Hanken Grotesk | 16–17px | 400 | 1.55 | 0 | sentence |
| Kicker | Hanken Grotesk | 13px | 600 | 1 | +0.14em | UPPERCASE cobalt |
| Card number | Hanken Grotesk | 19px | 500 | 1 | +0.16em | tabular numerals |
| Card meta | Hanken Grotesk | 11–12px | 400 | 1.3 | +0.06–0.14em | UPPERCASE |

## Implementation notes

**Tilt from pointer position.** Map the pointer's position within the stage to custom properties and let CSS do the transform:

```js
stage.addEventListener('pointermove', e => {
  const r = stage.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  stage.classList.add('live');
  card.style.setProperty('--ry', ((x - .5) * 28).toFixed(2) + 'deg');
  card.style.setProperty('--rx', ((.5 - y) * 22).toFixed(2) + 'deg');
  card.style.setProperty('--gx', x * 100 + '%');
  card.style.setProperty('--gy', y * 100 + '%');
});
stage.addEventListener('pointerleave', () => {
  stage.classList.remove('live');
  ['--rx', '--ry', '--gx', '--gy'].forEach(p => card.style.removeProperty(p));
});
```

**Two transition speeds on one element.** The resting pose eases slowly; live tracking must be nearly instant or the card feels laggy:

```css
.card { transform: rotateX(var(--rx)) rotateY(var(--ry)) rotateZ(-4deg);
        transition: transform 500ms var(--ease-out);
        animation: float 6s var(--ease) infinite alternate; }
.stage.live .card { transition: transform 80ms linear; animation: none; }
@keyframes float { to { translate: 0 -10px; } }
```

Use the individual `translate` property for the float so it composes with `transform` instead of overwriting the tilt.

**Glare and brushed texture** are two pseudo-elements: a pointer-centred radial gradient in `mix-blend-mode: soft-light`, and a 115° repeating stripe at 3.5% white.

```css
.card::before { content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,.28), transparent 45%);
  mix-blend-mode: soft-light; }
```

Common mistakes: masking the whole stage, which also fades the chips and swatches (mask a `::before` instead); forgetting `transform-style: preserve-3d` so the `translateZ` on the number and chip has no parallax; using a straight quote `"` in the 48px testimonial.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
