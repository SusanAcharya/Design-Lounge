---
title: "Handbill riso gig guide"
summary: "A city gig guide printed in fluoro pink, teal and federal blue: overprinted shapes, misregistration, grain, a week strip and a stamp that saves a gig."
platform: mobile-app
type: screen
category: media
tags: [events, music, listings, save, press, select]
styles: [riso, paper, playful]
motion: subtle
difficulty: 2
featured: false
published: 2026-11-06
palette: ["#F3EEE3", "#FF48B0", "#00838A", "#3D5588", "#1F2350"]
fonts: ["Archivo"]
related: [riso-print-style, style-bauhaus-habit-grid, app-podcast-chapters]
---

# Handbill riso gig guide

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The weekly listings screen of Handbill, a free gig guide for Bristol, built as if every screen came off a risograph. Three spot inks only: fluoro pink, teal and federal blue, printed on warm uncoated stock. Shapes overprint with `mix-blend-mode: multiply` so pink over teal turns a deep navy, every pink layer sits 1.5px right and 1px up of where it should be, and a fractal-noise grain covers the paper. Listings are hand-cut cards (jagged `clip-path` polygons over a blue offset shadow), each with a two-ink geometric print. Saving a gig thumps a round rubber stamp onto the card and drops the act into a "This week" tray. The detail worth copying: the style lives in how the inks combine, not in decoration, so the screen stays a perfectly ordinary, readable listings app.

## Reference behaviour

1. First frame: week 45, Friday 6 November selected ("Friday 6 Nov · Tonight", 3 listings). Salt Lick is already saved and carries the stamp; Ana Petrov (Saturday) is also saved, so the tray reads "This week · Salt Lick, Ana Petrov" with a count of 2.
2. Masthead: "HANDBILL" at 92px, Archivo 900, width 62%, in `--over`; an exact pink copy sits on top at (+3px, −2px) with `multiply`, so the letters print as a dark core with a pink fringe on the top-right edge.
3. Week strip: seven day buttons, Mon 2 to Sun 8. Each shows the day (11px caps), date (22px, width 75%) and one teal pip per listing. The selected day gets a pink disc rotated −8° (multiply) and a blue 2px ring that is misregistered by (1.5px, −1px); both scale in from 0 over 320ms expo out, the ring 40ms later.
4. Tapping a day re-renders the list: the header updates, cards drop in (opacity 0 → 1, translateY 14px → 0, rotate −1° → 0, 420ms, staggered 70ms), and every card's pink print layer slides back from (5px, −3px) to its resting misregistration over 520ms, as if the drum just turned.
5. Arrow Left / Right on a focused day moves the selection and wraps.
6. Each card: time chip (blue plate, paper text), venue (12px caps), act name (32px, 900, width 68%), genre and doors line, a Save button and the price. The print (104 × 104) sits top-right.
7. Tapping Save: the button fills blue and reads "Saved", the card thuds (translateY 2px, scale .992, then a 1px sideways nudge, 300ms), and the stamp lands: scale 1.9 → .92 → 1, rotate 4° → −13° → −12°, opacity 0 → 1 → .92 over 460ms expo out. The tray count bumps (scale 1.3, rotate −10°, 380ms) and the tray names update.
8. Tapping Saved again removes it: stamp gone, button back to outline, tray updates; no animation on removal.
9. The tray (fixed, 64px, 34px above the bottom) opens the "This week" sheet: a 380ms iOS-sheet slide up with a 35% blue scrim. It lists saved gigs in week order on dashed blue rules: day and time, act and venue, price. Close button, scrim tap or Escape closes it and returns focus to the tray.
10. Empty week: the tray reads "Nothing saved yet", the sheet reads "Tap Save on a listing and it lands here."

## Structure

```
390 × 844, paper ground + fixed grain
┌──────────────────────────────────────┐
│ 54px clear                           │
│ (◎) BRISTOL            WEEK 45 · FREE│ kicker 11px, top 58
│ HANDBILL                             │ 92px / .8, width 62%, pink copy +3,−2
│ [GIGS] Mon 2 to Sun 8 November · 21  │ 14px
│ MON TUE WED THU (FRI) SAT SUN        │ 7 × 62px buttons, gap 2, rule 2px below
│  2   3   4   5   6    7   8          │
│ FRIDAY 6 NOV · TONIGHT   3 LISTINGS  │ 13px caps
│ ┌─────────────────────────╮ ┌print┐ │ card: grid 1fr 104px, pad 16 14 14 16
│ │[19:30] THE COALHOUSE    │ │ 104 │ │ hand-cut clip-path, blue shadow +3,+4
│ │SALT LICK                │ └─────┘ │
│ │Post-punk · Doors 19:30  │  (stamp)│ stamp 92 × 92, right 6, bottom 4
│ │[✓ SAVED]  £14           │         │ Save 40h, min 96w
│ └─────────────────────────╯         │ 14px gap between cards
│ ...                                  │ list pad-bottom 140
│ ┌──────────────────────────────────┐ │ tray: inset 14, bottom 34, 64h
│ │ THIS WEEK                    (2) │ │ blue plate, pink shadow +4,+3
│ │ Salt Lick, Ana Petrov            │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

- `header`: kicker `div` with a registration mark `svg`, `h1.mast` with an `aria-hidden` `<i>` copy, `p.sub`.
- `nav.week[aria-label]` with seven `button.day[aria-pressed]`, labels like "Fri 6 November, 3 listings".
- `main.list[aria-live=polite]`: `.dayhead` and `article.card` items; each card has `h3.act`, `button.save[aria-pressed]`, an `aria-hidden` print `svg` and stamp `svg`.
- `button.tray[aria-haspopup=dialog]` → `section.sheet[role=dialog][aria-modal]` with `ol` of saved gigs.
- A visually hidden assertive live region announces saves.

## Tokens

```css
:root {
  /* paper and inks */
  --paper: #F3EEE3;      /* uncoated stock */
  --paper-2: #EAE3D3;
  --pink: #FF48B0;       /* fluoro pink spot ink, shapes and stamp only */
  --teal: #00838A;       /* teal spot ink, shapes and pips only */
  --blue: #3D5588;       /* federal blue: body text, plates, borders */
  --over: #1F2350;       /* text on tints and on pink; reads as overprint */
  --tint-p: #FAD3E6;     /* pink at ~22%, card stock */
  --tint-t: #CFE5E2;     /* teal at ~20%, alternate card stock */
  --scrim: rgba(46,53,102,.35);
  /* registration */
  --reg-x: 1.5px; --reg-y: -1px;
  /* type */
  --font: "Archivo", system-ui, sans-serif;  /* variable: wdth 62–125, wght 400–900 */
  --fs-mast: 92px; --fs-act: 32px; --fs-sheet: 40px; --fs-day: 22px; --fs-tray: 20px;
  --fs-body: 13px; --fs-meta: 12px; --fs-kick: 11px;
  /* spacing */
  --gutter: 14px; --card-pad: 16px 14px 14px 16px; --card-gap: 14px;
  /* shape */
  --save-h: 40px; --tray-h: 64px; --print: 104px; --stamp: 92px;
  --shadow-card: 3px 4px;  /* blue offset, clipped to the same cut */
  --shadow-tray: 4px 3px;  /* pink offset, multiply */
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  --t-day: 320ms; --t-drop: 420ms; --t-reg: 520ms; --t-stamp: 460ms; --t-thud: 300ms; --t-sheet: 380ms;
}
```

## Typography

One family, Archivo, used across its width axis. Narrow widths do the shouting; normal width carries the reading.

| Role | Size | Weight | Width | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Masthead | 92px | 900 | 62% | .8 | −0.01em | upper |
| Sheet title | 40px | 900 | 64% | .9 | 0 | upper |
| Act name | 32px | 900 | 68% | .9 | −0.005em | upper |
| Date in strip | 22px | 800 | 75% | 1 | 0 | — |
| Tray title | 20px | 900 | 70% | 1 | 0.02em | upper |
| Price | 15px | 800 | 80% | 1.4 | 0 | — |
| Sub line | 14px | 600 | 88% | 1.4 | 0 | — |
| Genre line | 13px | 500 (doors 800) | 92% | 1.4 | 0 | — |
| Save label | 13px | 800 | 100% | 1 | 0.08em | upper |
| Venue, day head | 12–13px | 700–800 | 100% | 1 | 0.08–0.12em | upper |
| Kicker, day name | 11px | 700 | 100% | 1 | 0.1–0.14em | upper |

## Motion

| What | Trigger | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|
| Day disc | select | scale 0 → 1, rotate −8° | 320ms expo | instant |
| Day ring | select | scale 0 → 1, then misregistered | 320ms expo, 40ms delay | instant |
| Card drop | render | opacity 0, y 14px, −1° → rest | 420ms expo, 70ms stagger | instant |
| Pink layer re-register | day change | translate(5px,−3px) → (1.5px,−1px) | 520ms expo | instant |
| Stamp | save | scale 1.9 → .92 → 1, 4° → −13° → −12° | 460ms expo | appears, no motion |
| Card thud | save | y 2px, scale .992, x −1px | 300ms ease | none |
| Tray count bump | save or remove | scale 1.3, rotate −10° | 380ms expo | none |
| Sheet | open/close | translateY 105% → 0 | 380ms iOS sheet | instant |
| Scrim | open/close | opacity 0 → 1 | 240ms ease | instant |

## States

- **Day selected:** pink disc plus misregistered blue ring, text and pips in `--over`. Unselected days are blue text with teal pips on paper.
- **Save idle:** 2px blue border on paper, blue text, check-circle icon.
- **Saved:** blue fill, paper text, label "Saved", stamp visible at .92 opacity on the card.
- **Tonight:** the Friday header adds "· Tonight".
- **Sheet closed:** `visibility:hidden` and translated off; the scrim also hidden.
- **Empty tray:** "Nothing saved yet"; count 0.
- **Focus-visible:** 3px blue outline, 3px offset, on every button.

## Accessibility

- The masthead `h1` has `aria-label="Handbill"`; the pink duplicate is `aria-hidden`.
- Day buttons use `aria-pressed` and full labels ("Sat 7 November, 3 listings"); Arrow Left / Right move between them.
- Save buttons use `aria-pressed` and say what they save ("Save Salt Lick to this week"); an assertive live region confirms "Salt Lick saved to this week".
- Prints and stamps are `aria-hidden` SVG: the button state carries the meaning.
- The sheet is a modal dialog with a labelled title; focus moves to Close on open and back to the tray on close; Escape closes.
- Contrast: body text is `--blue` on paper (6.3:1) or on the tints; text that can sit on pink (the selected day, the masthead) uses `--over` (4.8:1 on pink). Pink and teal never carry text.
- Hit targets: days 50 × 62, Save 96 × 40, tray full width × 64, Close 44 × 44.

## Responsive rules

- The app column is max 430px wide and centred; the tray and sheet follow the same width.
- At 360 wide, the act name wraps to two lines at 32px; the print stays 104px and the text column shrinks.
- Masthead: at under 360 drop to 80px so "HANDBILL" stays on one line.
- On a tablet show two cards per row inside a 760px column; the week strip stays one row.

## Acceptance checklist

### Always

- [ ] Only three inks plus paper; every overlap uses `multiply`, so overlaps darken instead of covering.
- [ ] Every pink layer is offset by (1.5px, −1px); text is never misregistered off its own plate.
- [ ] Grain sits under the content, not over text, and uses `pointer-events:none`.
- [ ] Cards are hand-cut with three rotating `clip-path` polygons and a matching blue offset shadow.
- [ ] Changing day re-registers the pink layers and staggers the cards in.
- [ ] Save toggles `aria-pressed`, stamps the card, updates the tray and announces the change.
- [ ] The sheet is `visibility:hidden` when closed; Escape and the scrim close it.
- [ ] No text on pink or teal below 4.5:1; scroll width stays 390.
- [ ] Reduced motion: no thud, no bump, no slide; the stamp appears in place.

### This demo

- [ ] Handbill, Bristol, week 45, Mon 2 to Sun 8 November, 21 listings, three per day.
- [ ] Friday 6 opens: Salt Lick at The Coalhouse 19:30 £14, Kofi Mensah Quartet at St Kew's Hall 20:00 £18, Brass Futures at Basement 9 23:00 £10.
- [ ] Salt Lick and Ana Petrov start saved; the stamp reads "SAVED · THIS WEEK · WK 45 ·" around "GO".

## Implementation notes

**Misregistration as a variable.** Keep one offset for the whole sheet and apply it to every pink layer, so the "print" is consistent. Animate it from a larger offset when the content changes:

```css
:root { --reg-x: 1.5px; --reg-y: -1px; }
.art .p { mix-blend-mode: multiply; transform: translate(var(--reg-x), var(--reg-y)); }
.reg .art .p { animation: reg 520ms cubic-bezier(.16,1,.3,1); }
@keyframes reg { from { transform: translate(5px, -3px); } }
.mast i { position: absolute; inset: 0 auto auto 0; color: var(--pink);
  mix-blend-mode: multiply; transform: translate(3px, -2px); }
```

**Hand-cut cards without clipping focus rings.** Put the cut on pseudo-elements, not the card, so the Save button's outline is never clipped:

```css
.card { position: relative; isolation: isolate; }
.card::before { content: ""; position: absolute; inset: 0; background: var(--tint-p);
  clip-path: var(--cut); z-index: -2; }
.card::after { content: ""; position: absolute; inset: 0; background: var(--blue);
  clip-path: var(--cut); transform: translate(3px, 4px); z-index: -3; }
.card:nth-child(3n+1) { --cut: polygon(1% 3%,34% 0,62% 2%,99% 0,100% 38%,98% 71%,100% 98%,66% 100%,31% 97%,0 100%,2% 64%,0 30%); }
```

**Paper grain from one filter.** A fixed SVG rect with fractal noise, turned into a warm dark speckle by the colour matrix and multiplied into the paper:

```html
<svg class="grain" aria-hidden="true"><filter id="g">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/>
  <feColorMatrix values="0 0 0 0 .24  0 0 0 0 .2  0 0 0 0 .16  0 0 0 -1.6 .9"/>
</filter><rect width="100%" height="100%" filter="url(#g)"/></svg>
```

The stamp is an SVG with the ring text on a `textPath` and a light `feDisplacementMap` so its edge looks inked, not vector-perfect.

Common mistakes: putting pink or teal under small text (riso pink is 2.9:1 on paper), placing the grain above the text so contrast checks read noise, offsetting text itself instead of its duplicate, and using `opacity` instead of `multiply` for overprint, which washes inks out instead of darkening them.
