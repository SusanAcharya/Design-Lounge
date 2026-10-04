<!-- Design Lounge Nº 104 · "CTA split dark band" · designlounge.vercel.app -->

# CTA split dark band

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The last block on the **Volta Range** hardware site. A 196px concrete remnant (`#CFC8B8`) shows three pack models so the band reads as a closer, not a hero. Below it, a `#121512` band with a 3px oxide rule on top splits 1.15 / 0.85: giant stacked Unbounded “ORDER / THE / RANGE.” on the left, a 20px reason and a 56px email + “Request slot” row on the right. Submit validates a work email, locks the field, and the button label becomes “Held”. The feeling is a shop floor, not a SaaS banner.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ VOLTA RANGE · BUILD BOOK 04                    PACK 2 / 48 V         │ 22+
│ Range S              │ Range M              │ Range H                │
│ Field kit…  9.2      │ Shop pack… 14.6      │ Yard pack… 21.0        │ 196
├──────────────────────────────────────────────────────────────────────┤ 3px oxide
│ BUILD SLOT · Q4 2026 │ The pack is cut when you take a slot.         │
│ ORDER                │ No catalogue stock. Leave a work email…       │
│ THE                  │                                               │
│ RANGE.               │ WORK EMAIL                                    │
│                      │ ┌────────────────────────┬──────────────┐     │
│ Made to order ·      │ │ name@yard.co           │ REQUEST SLOT │     │ 56
│ 14-day ship…         │ └────────────────────────┴──────────────┘     │
│                      │ One slot per address. We reply within two…    │
└──────────────────────┴───────────────────────────────────────────────┘
  1.15fr                 0.85fr
  pad 48×64              pad 48×64
```

- `.page` 196px: `.top` meta row + `.models` 3-column grid of `<article>` (h3, p, `.n` weight).
- `<section class="band" aria-label="Order the range">` CSS grid `1.15fr 0.85fr`.
  - `.left`: kicker, `h1` with three `<span>` lines, `.note`.
  - `.right`: reason `<p>`, `<form id="form" novalidate>` with `<label for="email">`, `.row` (input + `button.go`), `#msg` `role="status" aria-live="polite"`, `.fine`.
- A 1px `--line` splits the two band columns. The remnant uses `--rule` `#B4AD9C`.

Model copy (do not invent other SKUs):

| Model | Blurb | Weight |
|-------|-------|-------:|
| Range S | Field kit. 9.2 kg dry. One-day charge on a 16 A line. | 9.2 |
| Range M | Shop pack. 14.6 kg. Two circuits, shared bus. | 14.6 |
| Range H | Yard pack. 21.0 kg. Three-phase inlet, 48 V out. | 21.0 |

Reason paragraph, exact: “The pack is cut when you take a slot. No catalogue stock. Leave a work email and we send the build sheet for Range S, M, or H.”

Fine print, exact: “One slot per address. We reply within two working days with a 20-minute call, not a drip sequence.”

## Motion

Almost none. This is a closer, not a reveal.

| Element | Trigger | Property | From → To | Duration | Notes |
|---------|---------|----------|-----------|---------:|-------|
| `.row` border | focus-within | border-color | `--line` → `--ink` | 0 | instant |
| `.row.bad` | invalid submit | border-color | → `--oxide` | 0 | |
| `.row.done` | valid submit | border-color | → `--ok` | 0 | |
| `button.go:hover` | hover | filter | 1 → 1.08 | 0 | enabled only |

Reduced motion: no transitions declared on the row or button. Do not add a headline entrance.

## States

- **Input rest:** transparent field, 1px `--line` on `.row`, placeholder `--ink-3`.
- **Input focus:** `.row` border `--ink`. Focus ring on the input itself is none; the row is the cue. Button focus-visible is a 2px white ring, −4px offset, so it sits inside the oxide fill.
- **Invalid:** `.row.bad`, message `.msg.bad`.
- **Success:** `.row.done`, message `.msg.ok`, `email.disabled`, `go.disabled`, button label “Held”.
- **Button rest:** oxide fill, white 13px/600 uppercase, min-width 128px, height 56px (flush with the row).
- **Other chrome:** `:focus-visible` 2px oxide, 3px offset (used if a link is added later).

## Accessibility

- Band is a `<section aria-label="Order the range">`.
- Form: real `<label for="email">`, `type="email"`, `autocomplete="email"`, `required`. Use `novalidate` on the form so the custom message runs instead of the browser bubble.
- `#msg` is `role="status"` + `aria-live="polite"` so success and error are announced.
- After an invalid submit, return focus to the input.
- After a valid submit, leave focus where it is; the live region announces the hold. Do not move focus to a non-focusable status line.
- Contrast: `#ECE7DA` on `#121512` ~12:1; `#9A9588` on `#121512` ~6.1:1; white on `#E24A1A` ~3.6:1 — the button is 13px/600 uppercase, so keep it 13px and do not lighten oxide. Kicker oxide on the band is ~4.6:1 at 11px/500.
- Hit target: the whole 56× (flex) row; the button is 56×128px minimum.

## Responsive rules

- ≥ 1280: as specified, headline 88px, pads 64px, remnant 196px.
- 1024–1279: headline 64px, horizontal padding 36px. Two-column band stays.
- 768–1023: band stacks (left then right). Left loses the vertical rule and gains a 1px bottom rule, 28px padding-bottom. Headline 48px. Remnant models stack to one column if they overflow; at 768 they may stay 3-up if the type still fits.
- < 640: headline 40px. Form row may stack (input full width, button 56px full width underneath). Remnant models become one column.

## Acceptance checklist

- [ ] First 196px is the concrete remnant with Range S / M / H and weights 9.2 / 14.6 / 21.0.
- [ ] Band is `#121512` with a 3px `#E24A1A` rule on top and a 1.15 / 0.85 split.
- [ ] Headline is Unbounded 88px/700/0.88, three stacked uppercase lines: Order / the / range.
- [ ] Right column has the exact reason sentence, a 56px email row, and “Request slot” in oxide.
- [ ] Invalid submit shows the oxide message and does not disable the field.
- [ ] Valid submit disables input + button, label becomes “Held”, live region names the address.
- [ ] Focus-within draws an `#ECE7DA` border on the row; button focus-visible is a 2px white inset ring.
- [ ] No amber-on-black palette; oxide is `#E24A1A`, not `#E0A34B`.
- [ ] `prefers-reduced-motion: reduce` does not change the validation path.
- [ ] No images, no emoji, no dummy copy. Demo fills 1280×800 and starts with the piece header comment.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: remnant shows “Volta Range · Build book 04” and “Pack 2 / 48 V”, then three model cells (Range S 9.2 / Range M 14.6 / Range H 21.0). The dark band fills the rest of 800px. Left: kicker “BUILD SLOT · Q4 2026” in oxide, the 88px stacked headline, footer note “Made to order · 14-day ship window · EU + UK”. Right: the reason paragraph, an empty email field with placeholder `name@yard.co`, oxide button “Request slot”, and the fine-print line. Input is enabled.
2. Focus the email field: the 56px row border changes from `--line` `#2A2E2A` to `--ink` `#ECE7DA`.
3. Submit with an empty or invalid value: `preventDefault`, row gets `.bad` (oxide border), `#msg` reads “Use a full work address, not a first name.” in oxide, focus returns to the input. Button stays “Request slot”.
4. Submit with a value matching `^[^\s@]+@[^\s@]+\.[^\s@]+$`: row gets `.done` (`#8FBF7A` border), `#msg` reads “Slot held. Build sheet is on its way to {email}.” in the same green, input and button `disabled`, button text becomes “Held”.
5. Hover the enabled button: `filter: brightness(1.08)`. Disabled button does not hover.
6. No other motion. The headline does not animate in.
7. `prefers-reduced-motion: reduce` removes transitions on the row and button. Validation still works.

## Tokens

```css
:root {
  --page: #cfc8b8;        /* remnant concrete */
  --page-ink: #2a271f;
  --page-2: #6a6456;
  --rule: #b4ad9c;        /* remnant rules */

  --bg: #121512;          /* band */
  --ink: #ece7da;         /* band text */
  --ink-2: #9a9588;       /* labels */
  --ink-3: #6a6e66;       /* fine print */
  --line: #2a2e2a;        /* band rules + idle input */

  --oxide: #e24a1a;       /* 3px rule, kicker, button, errors */
  --oxide-ink: #1a0804;
  --ok: #8fbf7a;          /* success border + message */

  --display: "Unbounded", system-ui, sans-serif;
  --sans: "Onest", system-ui, sans-serif;

  --remnant: 196px;
  --band-pad-y: 48px;
  --band-pad-x: 64px;
  --row-h: 56px;
  --display-size: 88px;

  --t-fast: 160ms;
  --t-state: 280ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Remnant meta | Onest | 11px | 500 / 600 | 1 | +0.14em | UPPERCASE |
| Model name | Unbounded | 13px | 500 | 1 | +0.04em | UPPERCASE |
| Model blurb | Onest | 13px | 400 | 1.45 | 0 | sentence |
| Model weight | Unbounded | 28px | 700 | 1 | −0.03em | numerals |
| Band kicker | Onest | 11px | 500 | 1 | +0.16em | UPPERCASE |
| Headline | Unbounded | 88px | 700 | 0.88 | −0.04em | UPPERCASE |
| Left note | Onest | 12px | 400 | 1.4 | +0.04em | UPPERCASE |
| Reason | Onest | 20px | 400 / 600 | 1.4 | 0 | sentence |
| Field label | Onest | 11px | 500 | 1 | +0.12em | UPPERCASE |
| Input | Onest | 16px | 400 | 1 | 0 | as typed |
| Button | Onest | 13px | 600 | 1 | +0.08em | UPPERCASE |
| Message / fine | Onest | 13 / 12px | 400 | 1.45 | 0 | sentence |

Headline is three block spans (`Order` / `the` / `range.`) so the line-height 0.88 stacks tight. Do not put it on one line.

## Implementation notes

**Custom validation, not the browser bubble.** `novalidate` plus a tight regex keeps the message on-brand:

```js
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = email.value.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  if (!ok) { row.classList.add('bad'); msg.textContent = 'Use a full work address, not a first name.'; email.focus(); return; }
  row.classList.add('done');
  msg.textContent = 'Slot held. Build sheet is on its way to ' + v + '.';
  email.disabled = true; go.disabled = true; go.textContent = 'Held';
});
```

**Headline stack.** Three block spans, not a `<br>`, so tracking and line-height apply per line:

```html
<h1><span>Order</span><span>the</span><span>range.</span></h1>
```

```css
h1 { font: 700 88px/0.88 var(--display); letter-spacing: -.04em; text-transform: uppercase; }
h1 span { display: block; }
```

**Remnant is required.** Without the 196px concrete models the band reads as a hero. Keep the 3-column spec row even if the host page already has a features section above.

Common mistakes: pairing Unbounded with Inter; making the headline a single 64px line; a purple or amber accent; auto-focusing the email on load (the first frame must already look finished without a caret).

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
