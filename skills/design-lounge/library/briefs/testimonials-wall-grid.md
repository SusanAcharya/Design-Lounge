<!-- Design Lounge Nº 156 · "Testimonials wall grid" · www.designlounge.live -->

# Testimonials wall grid

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A testimonials section for **Pebble**, a notes app. Seven short quotes sit in a 4-column × 8-row CSS grid that reads as masonry: two cards span two columns, the rest occupy single cells of uneven height. Every card has a 28px initials disc, a name, a role, and a tenure (`14 months`, `9 months`, …) that is invisible until hover or focus. One family only — Plus Jakarta Sans at 400 and 600. No serif, no second face. The feeling is a soft noticeboard, not a carousel and not a logo wall.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ (pebble) Pebble    Notes   Share   Pricing         Start a notebook  │ 56
│                                                                      │
│ FROM THE NOTEBOOKS                          7 notes · 4 columns ·    │
│ People who keep notes in Pebble             2 wide cards             │
│                                                                      │
│ ┌───────────────────┬──────────┬──────────┐                          │
│ │ Mina (wide, euc)  │ Rafi     │ Asha     │  rows 1–4 / Asha 1–3     │
│ │                   │          ├──────────┤                          │
│ │                   │          │ Theo     │  rows 4–6                │
│ ├────────┬──────────┴──────────┼──────────┤                          │
│ │ Jun    │ Eva (wide, sand)    │          │  rows 5–8 / Theo 4–6     │
│ │        │                     ├──────────┤                          │
│ │        │                     │ Noor     │  rows 7–8                │
│ └────────┴─────────────────────┴──────────┘                          │
└──────────────────────────────────────────────────────────────────────┘
  pad 48    gap 12    radius 14
```

- `<nav>` 56px: `.brand`, three `.links a`, `.cta` pill.
- `<section aria-label="Customer quotes">`: `.lead` (kicker + `h1` + `.meta`) then `.wall`.
- `.wall` is `display:grid; grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(8,1fr); gap:12px; flex:1`.
- Seven `<article class="card">` with explicit grid placement (`.c1`–`.c7`). Wide cards also have `.wide`.
- Each card: `<p>` quote, `<footer>` with `.av`, name/role, `<time class="when">`.

Placement and copy:

| Class | Grid | Wash | Quote | Name · role | Tenure | Initials |
|-------|------|------|-------|-------------|--------|----------|
| `.c1` | 1/3, 1/5 | `#E4EDE8` | I stopped opening a new doc for every meeting. The pebble from Tuesday is still the one I am writing in on Friday. | Mina Kade · Product · Orchard | 14 months | `#4A7C74` MK |
| `.c2` | 3/4, 1/5 | card | The weekly review is just the notes I already wrote. | Rafi Lutz · Eng · North Dock | 9 months | `#3D4A62` RL |
| `.c3` | 4/5, 1/4 | card | Shared a pebble with my pair. We did not fork a copy. | Asha Holm · Design · Vale | 1 year | `#C4786A` AH |
| `.c4` | 1/2, 5/9 | card | Tags I actually use: eleven of them. The rest never made it out of the picker. | Jun Cho · Research · Kiln | 6 months | `#6B5A46` JC |
| `.c5` | 2/4, 5/9 | `#EFE6D8` | Sunday night is the inbox. Monday morning is an outline I did not have to rebuild. | Eva Solberg · Editor · Field & Desk | 16 months | `#2F4A58` ES |
| `.c6` | 4/5, 4/7 | card | Offline on the train. Synced at the office door. | Theo Park · Ops · Harbor | 7 months | `#5A6B4A` TP |
| `.c7` | 4/5, 7/9 | card | Search hit the sentence I half-remembered. | Noor Wade · Counsel · Pine & Co | 10 months | `#7A5348` NW |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---------|---------|----------|-----------|---------:|--------|-------|
| `.card` | hover / focus-visible | transform | 0 → `translateY(-4px)` | 240ms | `--ease` | |
| `.card` | same | border-color | `--line` → `--ink` | 160ms | `--ease` | |
| `.card` | same | box-shadow | none → `0 10px 24px rgba(28,35,40,.08)` | 240ms | `--ease` | |
| `.when` | same | opacity, translateY | 0, 4px → 1, 0 | 160ms | `--ease` | stays in the footer layout |

Reduced motion: `transition-duration: 1ms` on `.card` and `.when`; hover/focus must not translate. Tenure still appears. No looping animation.

## States

- **Card rest:** `--card` fill (or wash), 1px `--line`, radius 14px, padding 18px 18px 16px.
- **Card hover / focus-visible:** lift 4px, border `--ink`, shadow as above, tenure visible. `outline: none` on the card itself.
- **Nav / CTA / brand focus-visible:** 2px `--euc` outline, 3px offset.
- **CTA rest:** 34px pill, `--ink` fill, `--card` text, 14px horizontal padding.
- **CTA hover:** fill `--euc`.
- **Link hover:** colour `--ink`.
- There is no selected, loading, or empty state.

## Accessibility

- Section labelled `aria-label="Customer quotes"`.
- Cards are focusable (`tabindex="0"`) so keyboard users get the same lift and tenure as pointer users. They are not buttons and do not fire an action.
- Tenure is a real `<time datetime>` so the string “14 months” has a machine date (`2025-11`, etc.).
- Decorative pebble mark is `aria-hidden="true"`.
- Tab order: brand → Notes → Share → Pricing → CTA → Mina → Rafi → Asha → Jun → Eva → Theo → Noor (source order, not visual masonry order).
- Contrast: `--ink` on `--bg` ~13:1; `--ink` on `--card` ~14:1; `--ink-2` on `--card` ~5.8:1; `--euc` on `--bg` ~4.7:1 (kicker 11px/600). Initials are `#FFFCFA` on the disc colours, all ≥ 5:1.
- Hit targets: CTA 34× auto (≥ 40px wide with padding). Cards are large regions. Tenure is not a separate control.

## Responsive rules

- ≥ 1280: 4 columns, 8 equal rows filling the leftover height, `--pad: 48px`, wide quotes 20px.
- 1024–1279: `--pad: 28px`, single quotes 15px, wide quotes 17px. Placement classes stay.
- 768–1023: wall becomes 2 columns, `grid-auto-rows: minmax(140px, auto)`, placement classes are ignored (`grid-column:auto; grid-row:auto`) except `.wide` which still spans 2. Nav links hide.
- < 640: same 2-column stack; both wide cards remain full width. Heading 24px if it wraps. Do not drop to one column until 480 if the host page needs it; the demo’s hard floor is 2.

## Acceptance checklist

- [ ] First frame is a filled 4-column wall on `#EEF1F3` with heading “People who keep notes in Pebble”.
- [ ] Exactly seven cards; Mina spans 2 columns (rows 1–4); Eva spans 2 columns (rows 5–8).
- [ ] Mina wash is `#E4EDE8`; Eva wash is `#EFE6D8`; the other five are `#FFFCFA`.
- [ ] Wide quotes are 20px/400; single quotes are 16px/400; one family only (Plus Jakarta Sans at 400 and 600).
- [ ] Hover or focus lifts a card 4px over 240ms and reveals tenure on the right.
- [ ] Tenure is hidden at rest (`opacity:0`) but remains in the DOM.
- [ ] CTA is a 34px pill that turns eucalyptus on hover.
- [ ] Focus-visible rings (2px `#4A7C74`, 3px offset) appear on brand, links, and CTA.
- [ ] `prefers-reduced-motion: reduce` removes the lift; tenure still appears.
- [ ] No images, no second font family, no emoji, no dummy copy, no JS required.
- [ ] Demo fills 1280×800 with no page scrollbar and starts with the piece header comment.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: cool mist page `#EEF1F3`, 56px nav (irregular 14px pebble mark + Pebble + Notes / Share / Pricing + pill “Start a notebook”). Lead line: kicker “FROM THE NOTEBOOKS”, 28px heading “People who keep notes in Pebble”, right meta “**7 notes** · 4 columns · 2 wide cards”. The wall fills the remaining height. Card 1 (Mina, eucalyptus wash) spans columns 1–2, rows 1–4. Card 5 (Eva, sand wash) spans columns 2–4, rows 5–8. Quote 01 is already the largest type (20px).
2. Hover a card: it lifts `translateY(-4px)` over 240ms, border becomes `--ink`, a 10px/24px shadow at 8% ink appears. The tenure on the right of the footer fades in and rises 4px over 160ms.
3. Keyboard-focus a card (`tabindex="0"`): the same lift, border, shadow, and tenure. Outline is none because the ink border is the focus cue; a 2px eucalyptus ring still appears on nav chrome via `:focus-visible`.
4. Leave the card: lift, border, shadow, and tenure reverse on the same clocks.
5. Hover “Start a notebook”: fill changes from `--ink` to `--euc` over 0ms (colour only).
6. No click handler. Cards do not expand, flip, or navigate.
7. `prefers-reduced-motion: reduce` sets all transition durations to 1ms and cancels the 4px lift; tenure still appears.

## Tokens

```css
:root {
  --bg: #eef1f3;          /* page mist */
  --card: #fffcf8;        /* default card */
  --ink: #1c2328;         /* text, CTA, hover border */
  --ink-2: #5c666e;       /* secondary */
  --ink-3: #8a939a;       /* tenure */
  --line: #d7dce0;        /* card border */
  --line-2: #c3c9ce;
  --euc: #4a7c74;         /* kicker, mark, CTA hover, focus */
  --euc-soft: #e4ede8;    /* Mina wash */
  --rose: #c4786a;        /* Asha disc */
  --sand: #efe6d8;        /* Eva wash */
  --slate: #3d4a62;       /* Rafi disc */

  --font: "Plus Jakarta Sans", system-ui, sans-serif;

  --nav-h: 56px;
  --pad: 48px;
  --r: 14px;
  --gap: 12px;
  --av: 28px;

  --t-fast: 160ms;
  --t-lift: 240ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

One family. Two optical sizes on the quotes (16px single, 20px wide), two weights.

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Body / links | Plus Jakarta Sans | 13–14px | 400 | 1.45 | 0 | sentence |
| Brand | Plus Jakarta Sans | 15px | 600 | 1 | −0.02em | sentence |
| CTA | Plus Jakarta Sans | 13px | 600 | 1 | 0 | sentence |
| Kicker | Plus Jakarta Sans | 11px | 600 | 1 | +0.14em | UPPERCASE |
| Heading | Plus Jakarta Sans | 28px | 600 | 1.15 | −0.03em | sentence |
| Meta | Plus Jakarta Sans | 13px | 400 / 600 | 1.4 | 0 | sentence |
| Quote (single) | Plus Jakarta Sans | 16px | 400 | 1.4 | −0.015em | sentence |
| Quote (wide) | Plus Jakarta Sans | 20px | 400 | 1.35 | −0.02em | sentence |
| Author | Plus Jakarta Sans | 12px | 600 | 1.2 | 0 | sentence |
| Role | Plus Jakarta Sans | 11px | 400 | 1.3 | 0 | sentence |
| Tenure | Plus Jakarta Sans | 11px | 400 | 1 | +0.02em | sentence |
| Initials | Plus Jakarta Sans | 10px | 600 | 1 | +0.03em | UPPERCASE |

## Implementation notes

**Masonry without a library.** Use a fixed 4×8 track grid and place each card by line numbers. Do not use `masonry` or JS measuring:

```css
.wall { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(8, 1fr); gap: 12px; flex: 1; }
.c1 { grid-column: 1 / 3; grid-row: 1 / 5; }
.c5 { grid-column: 2 / 4; grid-row: 5 / 9; }
```

**Footer sticks to the bottom of every card** so short quotes do not leave the name floating mid-card:

```css
.card { display: flex; flex-direction: column; }
.card footer { margin-top: auto; padding-top: 14px; }
```

**Tenure stays in flow.** Fade it; do not `display:none`, or the footer will shift on hover:

```css
.when { opacity: 0; transform: translateY(4px); }
.card:hover .when, .card:focus-visible .when { opacity: 1; transform: none; }
```

Common mistakes: loading a serif “for the quotes”; equal-height cards that read as a boring 4-up; drop shadows at rest; a carousel hidden inside the wall; using `grid-auto-flow: dense` without explicit spans so the screenshot order changes between browsers.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
