---
title: "Fintech home"
summary: "A banking home screen: dark balance card with a 40px tabular amount and a blur-to-hide toggle, four circular quick actions, day-grouped transactions with initial avatars, under a glass top bar."
platform: mobile-app
type: screen
tags: [fintech, banking, list, glass, ios]
styles: [minimal, glass]
motion: subtle
difficulty: 2
featured: false
published: 2026-09-29
palette: ["#F4F4F6", "#111318", "#FFFFFF", "#0A66FF", "#1D9A5B"]
fonts: ["Onest"]
related: [ios-large-title-collapse, ios-grouped-settings]
---

# Fintech home

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The home screen of "Fjord Bank", a consumer banking app in an iOS 26-style language. A near-black balance card sits on a cool light grey page; the amount is set large in tabular numerals with the currency and decimals de-emphasised. An eye button hides the balance by blurring it (12px) rather than swapping to asterisks, so the card keeps its shape and the number re-focuses when shown again. Below: four circular quick actions (the first filled with the accent), then transactions grouped by day in inset white groups with two-letter merchant initials as coloured avatars and a per-day net total. The top bar is translucent glass that content scrolls under.

## Reference behaviour

1. Initial state: top bar shows "Fjord Bank / Personal · EUR" and a 36px avatar with initials "SH". Balance card shows "€12,480.55", the masked account number, and a green "+€1,240.00 this month" chip. Balance is visible.
2. Scroll: the page scrolls under the fixed glass top bar (20px blur, 160% saturation, 72% page-colour fill, 1px hairline bottom border). The top bar does not resize.
3. Tap the eye: the amount and account number blur (`filter: blur(12px)` / `blur(6px)`) and the amount drops to 70% opacity over 320ms `cubic-bezier(.2,.7,.2,1)`. The icon swaps to a crossed eye; `aria-pressed` becomes true and the label becomes "Show balance". The card height does not change.
4. Tap again: blur returns to 0 and opacity to 1 over 320ms.
5. Press a quick action: its circle scales to 0.9 over 160ms and returns on release. Send is filled with `--accent` and white; the other three are white with a hairline border.
6. Press a transaction row: its background flashes to `--bg` while pressed. Rows are buttons (they would open a detail screen).
7. The "Nord Post" row is pending: avatar at 55% opacity, amount in `--ink-3` at weight 500, subtitle "Pending · Card 4901".
8. Incoming amounts (salary) are green `--positive` with a leading "+"; outgoing are `--ink` with a leading "−" (U+2212, not a hyphen).

## Structure

```
390 × 844
┌────────────────────────────────────────┐
│ (54 status)  glass top bar, 102 tall   │
│ Fjord Bank                        (SH) │
│ Personal · EUR                         │
│────────────────────────────────────────│ hairline
│ 118 ┌──────────────────────────────┐   │
│     │ Everyday account          👁 │   │  balance card, r22, dark
│     │ € 12,480.55  (40px tabular)  │   │
│     │ NO71 3000 1284 4901 · Everyday│  │
│     │ [↑ +€1,240.00 this month]    │   │
│     └──────────────────────────────┘   │
│     (○)     (○)     (○)     (○)        │  quick actions 56px
│     Send  Request  Top up  Cards       │
│  Activity                  Statements  │
│  TODAY                        −€63.30  │
│  ┌──────────────────────────────────┐  │
│  │ [NP] Nord Post   Pending   −€8.90│  │  rows 64px
│  │ [BB] Brød & Bønner 08:12   −€6.40│  │
│  │ [LM] Loam Market 07:48    −€48.00│  │
│  └──────────────────────────────────┘  │
│  YESTERDAY, 28 SEP        +€2,176.20   │
│  ┌──────────────────────────────────┐  │
│  │ [TS] Tessel Studio     +€2,300.00│  │
│  │ ...                              │  │
└────────────────────────────────────────┘
```

- `<header class="top">`: fixed, `height:102px; padding:54px 20px 0`, flex row; `<h1>` 17/600 with a 12px sub-line; `<button class="avatar">`.
- `<main>`: the scroll container, `padding:118px 20px 50px`.
  - `<section class="bal" aria-live="polite">`: label row with `.eye` button, `.amt` (currency span, integer, decimal span), `.acct`, `.delta` chip.
  - `.qa[role=group]`: 4-column grid of `<button>` (circle `<i>` + label).
  - `.sec` heading row, then repeated `.day` label + `.group` of `<button class="tx">` rows: `.av` initials, `.t` (name + meta), `.v` amount.

## Tokens

```css
:root {
  /* colour — cool light neutrals, ink-dark card, one blue accent */
  --bg: #f4f4f6;            /* page, row pressed state */
  --surface: #ffffff;       /* transaction groups, quick-action circles */
  --ink: #111318;
  --ink-2: #5c6270;         /* meta, labels */
  --ink-3: #8d92a0;         /* day labels, pending amount */
  --line: #e5e6ea;          /* hairlines */
  --card: #111318;  --card-2: #1c2028;         /* balance card gradient 160° */
  --card-ink: #f7f7f9;  --card-ink-2: #9aa0ad; /* card text */
  --card-glow: rgba(10,102,255,.45);           /* radial at top-right */
  --accent: #0a66ff;        /* Send button, links, focus */
  --accent-soft: #e6efff;
  --positive: #1d9a5b;      /* incoming amounts */
  --positive-chip: #7ed3a4; /* chip text on card */
  --positive-chip-bg: rgba(29,154,91,.18);
  --glass: rgba(244,244,246,.72);
  --glass-line: rgba(17,19,24,.08);
  --glass-blur: blur(20px) saturate(160%);

  /* avatar pairs (bg / text) */
  --av-1: #e8eefc / #2d4a9e;  --av-2: #fdebd9 / #a4581a;  --av-3: #e4f5ea / #1c6b40;
  --av-4: #f3e8f7 / #6e3b87;  --av-5: #fbe6e6 / #a03030;  --av-6: #e7f0f4 / #2a5f75;

  /* type */
  --font: "Onest", system-ui, -apple-system, sans-serif;

  /* layout */
  --top-h: 102px;  --content-top: 118px;  --gutter: 20px;
  --r-card: 22px;  --r-row: 14px;  --r-avatar: 14px;
  --qa: 56px;  --avatar: 40px;  --row-pad: 12px 14px;
  --card-shadow: 0 12px 32px rgba(17,19,24,.18);
  --blur-hide: 12px;  --blur-hide-meta: 6px;

  /* motion */
  --t-micro: 160ms;
  --t-layout: 320ms;
  --spring: cubic-bezier(.32, .72, 0, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role              | Family | Size | Weight | Line-height | Tracking | Case / numerals |
|-------------------|--------|-----:|-------:|------------:|---------:|-----------------|
| Body / row name   | Onest  | 15px | 500    | 1.4         | 0        | sentence |
| Top bar title     | Onest  | 17px | 600    | 1.3         | −0.01em  | sentence |
| Top bar sub       | Onest  | 12px | 500    | 1.3         | 0        | sentence |
| Card label        | Onest  | 13px | 500    | 1.4         | 0        | sentence |
| Balance integer   | Onest  | 40px | 600    | 1           | −0.03em  | `tabular-nums` |
| Currency sign     | Onest  | 22px | 500    | 1           | 0        | — |
| Decimals          | Onest  | 24px | 500    | 1           | 0        | `tabular-nums` |
| Account number    | Onest  | 12px | 400    | 1.4         | +0.04em  | `tabular-nums` |
| Delta chip        | Onest  | 12px | 600    | 1           | 0        | sentence |
| Quick-action label| Onest  | 12px | 500    | 1           | 0        | sentence |
| Section heading   | Onest  | 17px | 600    | 1.3         | −0.01em  | sentence |
| Day label         | Onest  | 12px | 600    | 1.3         | +0.04em  | UPPERCASE; total is 500, normal case, tabular |
| Row meta          | Onest  | 12px | 400    | 1.3         | 0        | sentence |
| Row amount        | Onest  | 15px | 600    | 1.3         | −0.01em  | `tabular-nums` |
| Avatar initials   | Onest  | 13px | 600    | 1           | +0.02em  | UPPERCASE |

## Motion

| Element        | Trigger     | Property         | From → To                   | Duration | Easing   | Notes |
|----------------|-------------|------------------|-----------------------------|---------:|----------|-------|
| `.amt`         | eye toggle  | filter, opacity  | `blur(0)`,1 → `blur(12px)`,.7 | 320ms  | `--ease` | reverse on show |
| `.acct`        | eye toggle  | filter           | `blur(0)` → `blur(6px)`     | 320ms    | `--ease` | |
| `.eye`         | hover       | background       | 8% → 14% white              | 160ms    | `--ease` | icon swap is instant |
| `.qa i`        | :active     | transform        | 1 → scale(.9)               | 160ms    | `--ease` | |
| `.tx`          | :active     | background       | transparent → `--bg`        | 160ms    | `--ease` | |

Reduced motion: transitions become 1ms; the blur still applies (it is a state, not motion).

## States

- **Balance hidden:** `.bal.hidden`; `.eye[aria-pressed="true"]`, label "Show balance", crossed-eye icon; amount blurred 12px at 70% opacity; account blurred 6px.
- **Eye focus-visible:** 2px white outline, 2px offset (it sits on the dark card).
- **Quick action focus-visible / row focus-visible / avatar focus-visible:** 2px `--accent` outline; rows use `outline-offset:-2px` so the ring stays inside the group's rounded clip.
- **Pending row:** `.tx.pending` → avatar opacity .55, amount `--ink-3` weight 500.
- **Incoming amount:** `.v.in` → `--positive`.
- **Empty day (spec only):** omit the group entirely; never render an empty white box.
- **Loading (spec only):** replace the amount with a 160×40 rounded block at 12% white and rows with 40px avatar circles + two grey bars; no shimmer.

## Accessibility

- `<header>` contains an `<h1>`; the avatar is a `<button aria-label="Profile, Sofie Hval">`.
- The balance section has `aria-live="polite"` so toggling announces the visible state; the eye button uses `aria-pressed` plus a label that flips between "Hide balance" and "Show balance". Blur is visual only, so also set `aria-hidden` on the amount when hidden if the product requires the value not be read out.
- Quick actions are real `<button>`s inside `role="group" aria-label="Quick actions"`; the label text is inside the button (no icon-only buttons).
- Transaction rows are `<button>`s with the name, meta and amount as their accessible name; hit height is 64px.
- Contrast: `--ink-2` on white 6.6:1; `--ink-3` only for 12px labels (4.6:1 on `--bg`); `--card-ink-2` on `--card` 6.2:1; `--positive` on white 4.6:1.
- Use U+2212 minus and a real "+" so screen readers read the sign.

## Responsive rules

- 360 wide: gutters stay 20px; the balance integer drops to 36px; quick-action circles stay 56px (gap 4px).
- ≥ 430 wide: content column `max-width:430px; margin:0 auto`; the top bar's inner row shares the same max width.
- Tablet: two columns, the balance card and quick actions on the left (360px), activity list on the right; top bar spans full width.
- Very long merchant names truncate with an ellipsis; amounts never wrap (`white-space:nowrap`).

## Acceptance checklist

- [ ] Top bar is fixed, 102px tall with 54px top padding, `rgba(244,244,246,.72)` fill, `backdrop-filter: blur(20px) saturate(160%)` and a 1px `rgba(17,19,24,.08)` bottom hairline; content visibly scrolls beneath it.
- [ ] Balance card is a 160° gradient `#111318 → #1c2028`, radius 22px, with a blue radial glow at the top-right and the shadow `0 12px 32px rgba(17,19,24,.18)`.
- [ ] Amount is 40px/600 with `font-variant-numeric: tabular-nums`; the "€" is 22px and ".55" is 24px, both in `#9aa0ad`.
- [ ] Hiding blurs the amount by 12px and the account number by 6px over 320ms; the card does not change height and the icon swaps.
- [ ] The eye button toggles `aria-pressed` and its label between "Hide balance" and "Show balance".
- [ ] Quick actions are four 56px circles in a 4-column grid; Send is filled `#0a66ff`; pressing scales a circle to 0.9.
- [ ] Transactions are grouped under uppercase day labels with a right-aligned tabular net total.
- [ ] Rows are 64px tall with 40px, 14px-radius initials avatars using the six colour pairs.
- [ ] Incoming amounts are `#1d9a5b` with "+"; outgoing use U+2212.
- [ ] Pending row shows the 55% avatar and grey amount.
- [ ] Every button (avatar, eye, quick actions, rows) has a visible focus ring.
- [ ] Main content starts at 118px so nothing is under the top bar on load; bottom padding keeps the last row above the 34px home indicator.

## Implementation notes

**Hide with blur, not with text replacement.** Blur keeps the layout and lets the reveal feel like focusing a lens:

```css
.amt { font-variant-numeric: tabular-nums; transition: filter 320ms var(--ease), opacity 320ms var(--ease); }
.bal.hidden .amt  { filter: blur(12px); opacity: .7; }
.bal.hidden .acct { filter: blur(6px); }
.eye .off { display: none; }
.bal.hidden .eye .on  { display: none; }
.bal.hidden .eye .off { display: block; }
```

```js
eye.addEventListener('click', () => {
  const hide = !bal.classList.contains('hidden');
  bal.classList.toggle('hidden', hide);
  eye.setAttribute('aria-pressed', String(hide));
  eye.setAttribute('aria-label', hide ? 'Show balance' : 'Hide balance');
});
```

**Glass top bar over a scrolling main.** The bar must be a sibling of the scroller, and the scroller needs top padding equal to the bar height plus the gap:

```css
.top { position: fixed; inset: 0 0 auto 0; height: 102px; padding: 54px 20px 0;
  background: rgba(244,244,246,.72); backdrop-filter: blur(20px) saturate(160%);
  border-bottom: 1px solid rgba(17,19,24,.08); box-shadow: inset 0 1px 0 rgba(255,255,255,.6); }
main { height: 100%; overflow-y: auto; padding: 118px 20px 50px; }
```

**Amount markup** — split the number so the sizes differ without breaking tabular alignment: `<span class="cur">€</span>12,480<span class="dec">.55</span>` in a flex row with `align-items: baseline`.

Common mistakes: using `letter-spacing` on the tabular figures (breaks column alignment across rows); putting the hide state in the button only and forgetting the account number; `overflow:hidden` on the group without `outline-offset:-2px`, which clips focus rings; hyphen-minus instead of U+2212 in amounts.
