---
title: "Creator profile with masthead"
summary: "Essayist Mira Joshi: a 104px Literata name, toggleable role chips, a 3-up work strip, and a Sunday-letter subscribe row."
platform: web
type: screen
category: profile
tags: [profile, editorial, masthead, subscribe, chips]
styles: [editorial, paper]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-02
palette: ["#F6F1E6", "#1C1914", "#3D4F3A", "#5C564C"]
fonts: ["Literata", "Public Sans"]
related: []
---

# Creator profile with masthead

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A profile page for a fictional Kathmandu essayist, Mira Joshi. The first frame is a paper-coloured masthead: a 13px olive kicker, a 104px Literata name, four role chips, a one-sentence italic bio, then a 3-up strip of recent work and a subscribe row for "The Sunday letter". Public Sans carries the UI. Do not use Fraunces — that is the Lounge house face. Olive is the single accent. The page should feel like the front of a slim journal, not a social profile.

## Reference behaviour

1. Initial state: chips "Essayist" and "Editor" are `aria-pressed="true"` (ink fill, paper type). "Speaker" and "Teacher" are unpressed (1px `--line` border). The email field is empty. Subscribe is enabled.
2. Click a chip: it toggles pressed independently (these are roles she claims, not exclusive filters). Pressed: `#1C1914` fill, `#F6F1E6` type. Unpressed hover: border and type go `--ink`.
3. Hover a work card: 1px border becomes `--ink`, the card lifts 3px over 320ms. Focus-visible uses the same lift plus the olive ring.
4. Submit subscribe with an empty or invalid value: the live region reads `Enter a full address.` and the field is focused. Valid pattern: one `@`, a dot in the domain, no spaces.
5. Valid submit: button label becomes `Subscribed`, class `ok` (ink fill), button and input `disabled`. Live region: `Next letter: Sunday 4 Oct.`
6. Nav "Essays" is current (1px olive underline). Index and Subscribe scroll to `#work` and `#sub`.
7. Reduced motion: durations 1ms; cards do not lift.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ Mira Joshi (italic 18)                      ESSAYS  INDEX  SUBSCRIBE   │ 54
├────────────────────────────────────────────────────────────────────────┤
│ KATHMANDU · ESSAYS, 2019–2026                                          │
│ Mira Joshi                         (104px Literata, −0.035em)          │
│ [Essayist] [Editor] [Speaker] [Teacher]     chips 32px, 8px gap        │
│ Long pieces on rooms, rivers…      (20px italic, 48ch)                 │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                     │
│ │ plate 120    │ │ plate 120    │ │ plate 120    │                     │
│ │ A kitchen…   │ │ Keeping a…   │ │ The river…   │  cards 248 min      │
│ └──────────────┘ └──────────────┘ └──────────────┘                     │
│ The Sunday letter (28px italic)   │  [ email ] [ Subscribe ]           │
└────────────────────────────────────────────────────────────────────────┘
  Side pad 56px. Work gap 16px. Subscribe row has a 1px ink top rule.
```

- `<nav aria-label="Primary">` — 54px. Italic Literata mark, three Public Sans links.
- `<header class="mast">` — kicker, `h1`, `.chips` (`role="group"`), bio paragraph.
- `<section class="work" id="work" aria-label="Recent work">` — three `<a class="card">`. Each: 120px CSS plate, 11px olive label, 22px italic title, 13px deck.
- `<section class="sub" id="sub">` — 2 columns. Left: title + count. Right: `<form novalidate>` + `#msg` live region.

## Tokens

```css
:root {
  --paper: #f6f1e6;       /* page */
  --ink: #1c1914;         /* name, pressed chip, rules */
  --ink-2: #5c564c;       /* bio, deck, nav */
  --ink-3: #8a8376;       /* unused tertiary */
  --line: #d8d0c0;        /* hairlines, chip/card border */
  --olive: #3d4f3a;       /* kicker, labels, subscribe, focus */
  --olive-2: #2c3a2a;     /* subscribe hover */

  --serif: "Literata", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;

  --pad: 56px;
  --nav: 54px;
  --chip-h: 32px;
  --plate-h: 120px;
  --card-min: 248px;
  --field-h: 48px;

  --t: 180ms;
  --t-swap: 320ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Name | Literata | 104px | 400 | 0.82 | −0.035em | title |
| Bio | Literata italic | 20px | 400 | 1.4 | 0 | sentence |
| Card title / subscribe h3 | Literata italic | 22–28px | 400 | 1.15–1.2 | 0 | sentence |
| Nav mark | Literata italic | 18px | 400 | 1 | 0 | title |
| UI / body | Public Sans | 13–15px | 400–600 | 1.55 | 0 | sentence |
| Kicker / card label | Public Sans | 11–13px | 600 | 1 | +0.10–0.12em | UPPERCASE |
| Chip | Public Sans | 12px | 400 | 1 | +0.04em | title |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---------|---------|----------|-----------|---------:|--------|-------|
| `.card` | hover / focus | translateY, border | 0 → −3px | 320ms | `--expo` | |
| `.chip` | hover / press | colour, background | line → ink | 0–180ms | `--ease` | |
| Subscribe button | hover | background | olive → olive-2 | 180ms | `--ease` | |
| Subscribe success | submit | label + fill | olive → ink | 0 | — | class `ok` |

Reduced motion: 1ms durations; no card lift.

## States

- **Chip default:** transparent, 1px `--line`, `--ink-2` type, 32px / 999px radius.
- **Chip hover:** `--ink` border and type.
- **Chip pressed:** `--ink` fill, `--paper` type, `aria-pressed="true"`.
- **Card default:** `#FBF7EE`, 1px `--line`. Hover/focus: `--ink` border, −3px.
- **Email default:** 48px, 1px `--line`, transparent fill. Focus: `--olive` border (no extra outline besides `:focus-visible`).
- **Subscribe default:** 48px, olive fill, paper type. Success: ink fill, label "Subscribed", disabled.
- **Nav current:** 1px olive underline.

## Accessibility

- Chips are `<button aria-pressed>` inside `role="group"` labelled "Roles".
- Work items are links (whole card). Plates are `aria-hidden`.
- Form is `novalidate` so the custom message is used. Input has `aria-label="Email for the Sunday letter"`. `#msg` is `aria-live="polite"`.
- Contrast: ink on paper > 13:1; `--ink-2` on paper ≈ 6.1:1; paper on olive > 8:1; olive kicker 13px / 600 on paper ≈ 6.8:1.
- Hit targets: chips 32× ≥ 72px, fields 48px, cards ≥ 248px. Focus ring 2px olive, 3px offset.

## Responsive rules

- ≥ 1280: as specified. Name 104px. Work 3 columns. Subscribe 2 columns.
- 900–1279: name 88px if needed to stay one line; work stays 3 columns until 900.
- < 900: name 72px. Work 1 column. Subscribe stacks; the form sits under the copy.
- < 640: side pad 20px. Chips may wrap to two lines.

## Acceptance checklist

- [ ] Name is 104px Literata (not Fraunces, not Instrument Serif).
- [ ] UI face is Public Sans. Olive `#3D4F3A` is the only accent.
- [ ] Four chips; Essayist and Editor start pressed; each toggles independently.
- [ ] Three work cards in one row at 1280, each with a 120px CSS plate (no photographs).
- [ ] Card titles are italic Literata 22px.
- [ ] Subscribe validates the address, announces via `aria-live`, and disables the field on success.
- [ ] Invalid submit focuses the input and does not disable the form.
- [ ] First 800px includes the name, chips, bio, 3-up strip, and the subscribe rule.
- [ ] Focus rings are 2px olive on chips, cards, input, and the button.
- [ ] `prefers-reduced-motion: reduce` removes the 3px card lift.
- [ ] Subject is Mira Joshi, not the Lounge curator. No emoji, no placeholder copy.

## Implementation notes

**Do not load Fraunces.** The pairing is Literata + Public Sans only:

```html
<link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;1,7..72,400&family=Public+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

**Chips are independent toggles**, not a single-select filter:

```js
chips.forEach((c) => c.addEventListener('click', () => {
  c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
}));
```

**Validate in JS** because `novalidate` is on. Keep the pattern small:

```js
const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
if (!ok) { msg.textContent = 'Enter a full address.'; input.focus(); return; }
```

The three plates, 120px tall:

1. Kitchen — 165° split: olive to 38%, 2px `--line`, then paper. Reads as a wall meeting a counter.
2. Week — vertical 18px rules on `#EFE6D2`, 2px olive baseline. Reads as a ruled page.
3. River — radial highlight at 80% 20% plus a 135° olive-to-ink wash.

Copy is fixed: "A kitchen that faces west" (4 200 words), "Keeping a week" (Letter No. 41), "The river as a sentence" (28 min). The letter count is `4 800 readers` with a thin space, not a comma.

Common mistakes: setting the name in Fraunces; using a purple subscribe pill; making chips exclusive; replacing the three plates with grey boxes; adding a photograph avatar. The masthead is the portrait.
