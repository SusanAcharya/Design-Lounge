---
title: "Mixed article cards"
summary: "A magazine grid that mixes one lead card with a CSS cover, two numbered text cards, and three small thumbnail cards. Each whole card is one link."
platform: web
type: section
category: cards
tags: [cards, blog, articles, magazine, grid]
styles: [editorial, paper]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#F2ECDF", "#16140F", "#1F44C4", "#E8E0CF", "#D3C9B4"]
fonts: ["Instrument Serif", "Schibsted Grotesk"]
related: [magazine-editorial-grid, blog-issue-index, content-card, paper-article-reader]
---

# Mixed article cards

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The "This week" block of a magazine site, "Tributary", issue 41. Three columns hold three kinds of card: one large lead story with a drawn cover, two "Most read" text cards with big cobalt numbers, and three small cards with square thumbnails. It reads like a newsprint page: cream stock, black ink, hairline rules between columns, one cobalt accent, a display serif for every title, and a grotesk for everything else. The detail worth copying is the link model. Each card has exactly one link, on the title, and that link is stretched over the whole card. Hovering anywhere on the card underlines the title and nudges the cover 4px up and to the right.

## Reference behaviour

1. First frame: masthead, a "This week" heading row, a 1px ink rule, then three columns. Every card is in its resting state.
2. The lead column holds one card: a 290px cover, the kicker "WATER", a 44px serif title, a 16px dek, and a byline.
3. The middle column holds two numbered cards, "01" and "02", split by a 1px rule. Each has a kicker, a 30px serif title, a 14px dek, and a byline. No image.
4. The right column holds three small cards, each a 96 × 96 thumbnail beside a kicker, a 21px serif title, and a read time. Below them sits an "All of issue 41 →" text link.
5. Hover any card: the title underline fades in from transparent to ink in 160ms. The underline is 1px with a 0.14em offset.
6. Hover a card with a cover (lead and small cards): the drawn art inside the cover moves `translate(4px, -4px)` in 240ms. The cover frame stays still; only the art inside moves. The art is 8px larger than the frame on every side so no gap shows.
7. Tab to a card: focus lands on the title link. A 2px cobalt outline is drawn around the whole card with a 6px offset. The cover nudges the same as on hover.
8. Click anywhere on a card (cover, kicker, dek, byline, blank space): it follows the title link.
9. Numbers "01" and "02" are decorative. Screen readers hear the kicker "Most read · Work" and then the title.
10. With reduced motion: the underline still appears, without a fade. The cover does not move.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────┐
│ ISSUE 41 · OCTOBER 2026          Tributary          Cities Water Work … │ 60px, 3px double rule
├──────────────────────────────────────────────────────────────────────────┤
│ padding 24px 48px                                                         │
│ This week (40px serif)                       6 STORIES · UPDATED 3 OCT    │
│ ═════════════════════════════ 1px ink ══════════════════════════════════ │
│ ┌──────────────────────────────┐│┌───────────────────┐│┌──────────────────┐
│ │ cover 290px                  │││ 01  (84px cobalt) │││ [96] CITIES      │
│ │ grid, river arc, sun, dots   │││ MOST READ · WORK  │││      A bus map…  │
│ │            [caption chip]    │││ Night shift at…   │││ ──────────────── │
│ ├──────────────────────────────┤││ dek, byline       │││ [96] ARCHIVE     │
│ │ WATER                        │││ ───────────────── │││      Letters to… │
│ │ The river that moved a town  │││ 02                │││ ──────────────── │
│ │ 400 metres west (44px)       │││ MOST READ · FOOD  │││ [96] WATER       │
│ │ dek 16px, byline 12px        │││ Why every hill…   │││      What a dry… │
│ └──────────────────────────────┘│└───────────────────┘││ All of issue 41 →│
│   1.62fr                         1fr                   1.08fr            │
└──────────────────────────────────────────────────────────────────────────┘
       columns split by 1px --rule, 24px padding each side of a rule
```

- `header.mast`: three-column grid (`minmax(0,1fr) auto minmax(0,1fr)`), 60px tall, `border-bottom: 3px double var(--ink)`. Issue line left, wordmark link centre, `nav` labelled "Sections" right, with Water current.
- `main` holds `.head` (an `h1` and a `p`) and `.grid`.
- `.grid`: `grid-template-columns: minmax(0,1.62fr) minmax(0,1fr) minmax(0,1.08fr)`, `border-top: 1px solid var(--ink)`. Each column is a `div.col` with 20px top and bottom padding. Columns after the first get `border-left: 1px solid var(--rule)` and 24px left padding. Columns before the last get 24px right padding.
- Every card is an `article.card` with `position: relative`. Inside, the title is `h2` (lead) or `h3` (others) containing the only `a` in the card.
- Lead cover is a `figure.cover` with an `i` art layer (`aria-hidden`) and a `figcaption` chip "The 1931 bank, dotted".
- Small card: `article.card.sm` is a grid `96px minmax(0,1fr)`, gap 16px. The thumbnail is a `div.cover` with an `i` art layer.
- Numbered card: `span.big` (`aria-hidden`) holds the number, then the kicker, title, dek, byline.

Card copy:

| Kind | Kicker | Title | Dek | Byline |
|------|--------|-------|-----|--------|
| Lead | Water | The river that moved a town 400 metres west | Over ninety years the Karnel shifted its bed, and the market, the temple steps and two schools followed it. We walked the old shore with the people who remember it. | Asha Rai · 14 min read |
| 01 | Most read · Work | Night shift at the last ferry dock | Twelve crossings, one pilot, and a timetable written in chalk on a door. | Tomas Okafor · 8 min read |
| 02 | Most read · Food | Why every hill town makes its pickle sour | A short history of mustard oil, high sun and patience. | Mina Gurung · 6 min read |
| Small | Cities | A bus map drawn by the people who ride it | none | 5 min read |
| Small | Archive | Letters to the editor, monsoon of 1974 | none | 4 min read |
| Small | Water | What a dry well tells a geologist | none | 7 min read |

Masthead: "Issue 41 · October 2026", wordmark "Tributary" in italic serif, nav "Cities, Water, Work, Food, Archive". Heading row: "This week" and "6 stories · Updated 3 October".

## Tokens

```css
:root {
  /* colour: newsprint cream, black ink, one cobalt */
  --paper: #f2ecdf;    /* page */
  --paper-2: #e8e0cf;  /* cover wells */
  --ink: #16140f;      /* titles, rules, cover ink */
  --ink-2: #4b463c;    /* dek, issue line, byline name */
  --ink-3: #6e685c;    /* byline, read time */
  --rule: #d3c9b4;     /* column and card dividers */
  --cobalt: #1f44c4;   /* kickers, big numbers, river, current nav, focus */

  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Schibsted Grotesk", system-ui, sans-serif;

  /* space (4px base) */
  --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px; --s-12: 48px;

  /* layout */
  --cols: minmax(0, 1.62fr) minmax(0, 1fr) minmax(0, 1.08fr);
  --cover-h: 290px;
  --thumb: 96px;
  --nudge: 4px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-micro: 160ms;    /* underline */
  --t-nudge: 240ms;    /* cover art */
}
```

No shadows and no radii. Every corner is square. Regions are split by rules only.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Wordmark | Instrument Serif italic | 36px | 400 | 1 | -0.01em | Title |
| Issue line | Schibsted Grotesk | 12px | 400 | 1.5 | 0.06em | UPPER |
| Nav | Schibsted Grotesk | 13px | 500 | 1.5 | 0 | Title |
| Section heading | Instrument Serif | 40px | 400 | 1 | -0.01em | sentence |
| Heading meta | Schibsted Grotesk | 12px | 400 | 1.5 | 0.06em | UPPER |
| Kicker | Schibsted Grotesk | 11px | 700 | 1.5 | 0.12em | UPPER, cobalt |
| Lead title | Instrument Serif | 44px | 400 | 1.02 | -0.01em | sentence |
| Lead dek | Schibsted Grotesk | 16px | 400 | 1.5 | 0 | sentence, max 56ch |
| Big number | Instrument Serif | 84px | 400 | 0.8 | -0.03em | figures, cobalt |
| Numbered title | Instrument Serif | 30px | 400 | 1.06 | -0.01em | sentence |
| Numbered dek | Schibsted Grotesk | 14px | 400 | 1.5 | 0 | sentence |
| Small title | Instrument Serif | 21px | 400 | 1.12 | -0.01em | sentence |
| Byline | Schibsted Grotesk | 12px | 400 (name 500) | 1.5 | 0 | sentence |
| Caption chip | Schibsted Grotesk | 10px | 400 | 1 | 0.08em | UPPER |

Every title is the serif at weight 400. Do not bold the serif. Every label is the grotesk.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Title link | card hover | `text-decoration-color` | transparent → currentColor | 160ms | `--ease` | instant |
| Cover art `i` | card hover, focus inside card | transform | none → translate(4px, -4px) | 240ms | `--ease` | stays still |
| Nav link | hover | underline | none → 1px, offset 4px | instant | none | same |

There is no entrance animation. The page is still on load.

## States

- **Card resting:** title has a transparent underline already set, so only its colour changes on hover. No layout shift.
- **Card hover:** title underline in ink; cover art nudged 4px.
- **Card focus-visible:** the link's own outline is off. Its stretched `::after` gets `outline: 2px solid var(--cobalt); outline-offset: 6px`, so the ring wraps the whole card. Cover art nudged.
- **Card active:** no extra style; the browser follows the link.
- **Visited:** not styled. A magazine front page should not turn titles purple. If the product wants it, use `--ink-2` for visited titles.
- **Nav current:** `aria-current="page"`, text in cobalt.
- **Loading:** not shown. If needed, show grey blocks in `--paper-2` at the same sizes: 290px cover, three title lines, two dek lines.
- **Empty:** if fewer than six stories exist, drop small cards first, then the second numbered card. Never show an empty column; let the lead span two columns.

## Accessibility

- Each card is an `article`. Its heading is the only link, so the card's accessible name is the title.
- The stretched link uses `a::after { content: ""; position: absolute; inset: 0 }` on a `position: relative` card. Do not wrap the whole card in an `a`; that makes a screen reader read the kicker, title, dek, and byline as one long link name.
- Big numbers have `aria-hidden="true"`. The rank is already in the kicker text "Most read".
- Cover art layers are `aria-hidden`. The lead figure keeps its caption as visible text.
- One tab stop per card. Order: masthead wordmark, nav, lead, 01, 02, three small cards, "All of issue 41".
- Do not put other interactive elements (save buttons, author links) inside a stretched-link card unless they get `position: relative; z-index: 2` to sit above the overlay.
- Contrast: ink on paper 16:1. `--ink-2` on paper 7.9:1. `--ink-3` on paper 4.7:1. Cobalt on paper 6.5:1, so the 11px kicker passes.
- Hit target is the whole card, at least 96px tall on small cards.

## Responsive rules

- **≥ 1280:** three columns `1.62fr 1fr 1.08fr`, page padding 48px, as drawn.
- **1024 (901–1180):** two columns. The lead spans both and becomes a row: cover left (`1.3fr`), text right (`1fr`), gap 24px, title 38px, with a 1px rule under it. Numbered cards fill the left column below, small cards fill the right. Page padding 28px.
- **768 (641–900):** two columns. The lead spans both, with the cover on top and text below. Hide the header nav; keep the issue line and wordmark.
- **< 640:** one column. Page padding 16px. Hide the issue line. Lead title 34px, cover 220px tall, big numbers 64px. Columns stack with a 1px rule between them instead of a side rule. Small cards keep the 96px thumbnail beside the text.
- Every track is `minmax(0, …fr)`. Long titles wrap; nothing scrolls sideways.

## Acceptance checklist

### Always

- [ ] Three card kinds on one grid: one lead with a cover, two numbered text cards, three small thumbnail cards.
- [ ] Each card has exactly one link, on the title, stretched over the card with `::after`.
- [ ] Clicking blank space in a card follows its link.
- [ ] Hover underlines the title by changing only `text-decoration-color`, with no layout shift.
- [ ] Cover art moves exactly 4px up and 4px right; the cover frame does not move and no gap shows at the edges.
- [ ] Focus shows a 2px accent ring around the whole card with a 6px offset.
- [ ] Big numbers are `aria-hidden`; the rank is in visible text.
- [ ] Columns are split by 1px rules, never by shadows or cards with backgrounds.
- [ ] All tracks use `minmax(0, …fr)` and the page never scrolls sideways.
- [ ] Reduced motion: no nudge, underline still appears.

### This demo

- [ ] Masthead reads "Issue 41 · October 2026", "Tributary", and five sections with Water current in `#1f44c4`.
- [ ] Lead title "The river that moved a town 400 metres west" in Instrument Serif 44px over a 290px cover.
- [ ] Numbers "01" and "02" in Instrument Serif 84px cobalt.
- [ ] Small cards: Cities, Archive, Water, with 96 × 96 drawn thumbnails.
- [ ] Page `#f2ecdf`, cover wells `#e8e0cf`, rules `#d3c9b4`.

## Implementation notes

**Stretched link, ring on the overlay.** One link per card, and the focus ring drawn on the overlay so it wraps everything:

```css
.card { position: relative; }
.card a::after { content: ""; position: absolute; inset: 0; z-index: 1; }
.card h2 a, .card h3 a {
  text-decoration: underline 1px transparent;
  text-underline-offset: .14em;
  transition: text-decoration-color var(--t-micro) var(--ease);
}
.card:hover h2 a, .card:hover h3 a { text-decoration-color: currentColor; }
.card a:focus-visible { outline: none; }
.card a:focus-visible::after { outline: 2px solid var(--cobalt); outline-offset: 6px; }
```

**Nudge the art, not the frame.** The frame clips; the art layer is oversized by 8px so a 4px move never reveals the edge:

```css
.cover { position: relative; overflow: hidden; background: var(--paper-2); }
.cover i { position: absolute; inset: -8px; transition: transform var(--t-nudge) var(--ease); }
.card:hover .cover i,
.card:focus-within .cover i { transform: translate(4px, -4px); }
```

**A cover drawn with gradients.** The lead cover is a map: a 23px grid, a cobalt river arc, an older bank as a thin ink arc, a sun, and a row of building blocks. All layers are on one element:

```css
.lead .cover i {
  background:
    radial-gradient(ellipse 70% 120% at 18% 120%, transparent 58%, var(--cobalt) 58.4% 66%, transparent 66.4%),
    radial-gradient(ellipse 70% 120% at 30% 120%, transparent 70%, var(--ink) 70.2% 70.6%, transparent 70.8%),
    radial-gradient(circle at 78% 26%, var(--ink) 0 34px, transparent 34.5px),
    repeating-linear-gradient(0deg, transparent 0 22px, rgba(22,20,15,.14) 22px 23px),
    repeating-linear-gradient(90deg, transparent 0 22px, rgba(22,20,15,.14) 22px 23px),
    repeating-linear-gradient(90deg, var(--ink) 0 10px, transparent 10px 26px) 0 60% / 100% 14px no-repeat;
}
```

Thumbnails use the same idea: slanted stripes (`repeating-linear-gradient(170deg, …)`), a cobalt disc on an ink band, and vertical ink lines with a cobalt bar. In a real product, swap the `i` for an `img` with `object-fit: cover` and keep the same nudge.

Common mistakes:

- Wrapping the whole `article` in an `<a>`. The link name becomes every word in the card.
- Adding a second link on the author name or the kicker. With a stretched overlay those links sit under it and cannot be clicked.
- Animating `text-decoration` from `none` to `underline`. That snaps. Set the underline from the start and fade its colour.
- Scaling the cover image on hover. This piece moves it 4px; it does not zoom.
- Rounding the covers or adding card backgrounds and shadows. Newsprint has rules, not boxes.
- Bold serif titles. Instrument Serif at 400 carries the page.
- Using cobalt for titles. Cobalt is for kickers, numbers, the river, and focus only.
- Setting `1fr` tracks; a long unbroken word can widen a column. Use `minmax(0, …fr)`.

Rebuild order:

1. Masthead with the double rule and the centred italic wordmark.
2. Heading row and the three-column grid with side rules.
3. The lead card with its cover, kicker, title, dek, and byline.
4. Two numbered cards with a rule between them.
5. Three small cards with thumbnails, then the "All of issue 41" link.
6. Stretched links, hover underline, focus ring on the overlay.
7. The 4px art nudge and its reduced-motion fallback.
8. The 1024, 768, and phone layouts.
