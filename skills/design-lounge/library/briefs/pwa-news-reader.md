<!-- Design Lounge Nº 056 · "PWA news reader" · www.designlounge.live -->

# PWA news reader

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The front page of "Meridian", an installed news PWA. Cream paper, a 30px Newsreader masthead, a horizontally scrolling row of section chips, a lead card whose image area is a CSS-drawn landscape (sky gradient, sun disc, two hills), and a hairline-separated list of six stories with 17px serif headlines, reading time and a green "saved" mark for anything cached for offline. Chips filter the list with a 280ms dip; bookmark buttons toggle the saved state and update the badge on the Saved tab. The detail worth copying is the offline affordance: saved stories say so inline in the meta line, in the same colour as the bookmark, not with a separate icon column.

## Structure

```
390 × 844
┌────────────────────────────────────┐
│ (54px clearance)                   │
│ Meridian        Tuesday 29 Sep · … │  masthead serif 30
│ (Top stories)(World)(Climate)(Tec… │  chips 36px, horizontal scroll
│ ╭────────────────────────────────╮ │
│ │  sky gradient · sun · hills    │ │  art 190px, CSS only
│ │────────────────────────────────│ │
│ │ CLIMATE                        │ │  kicker 11px red
│ │ The valley that moved its      │ │  h2 serif 26px
│ │ river back                     │ │
│ │ Forty years after it was…      │ │  dek 14px
│ │ Ines Kalder · 9 min read · ⇩saved │
│ ╰────────────────────────────────╯ │
│ LATEST                             │
│ ───────────────────────────────── │
│ [thumb] Nord coalition talks…   ▮  │  story: 72px thumb, serif 17px, bookmark
│         World · 4 min · ⇩saved     │
│ ───────────────────────────────── │
│ [thumb] Orbital's tiny chip…    ▯  │
│         Technology · 6 min         │
│ ───────────────────────────────── │
│  ... (4 more)                      │
│ ▤ Today   ≡ Sections   ▮ Saved³   ○ Me │  nav 64px
│ (34px clearance)                   │
└────────────────────────────────────┘
```

- `<main>` — absolute, `inset: 0 0 98px`, scrolls; `padding-top:54px`.
  - `<header class="mast">` — `<h1>` + date span.
  - `.chips` (`role="group" aria-label="Sections"`) — six `<button aria-pressed data-cat>`.
  - `<a class="lead">` — `.art` (with one `<i>` for the second hill) + `.txt` (kicker, `<h2>`, dek, `.meta`).
  - `<p class="sec">` section label.
  - `<ul class="list">` of `<li class="story" data-cat>`: `.thumb` (three custom properties `--c1/--c2/--c3`), `.body` (`<h3>`, `.meta`), `<button class="save" aria-pressed>`.
- `<nav class="nav" aria-label="Primary">` — four buttons; the Saved one holds a `.n` badge.

Sample content:

- Masthead: "Meridian" / "Tuesday 29 Sep · 08:14". Chips: Top stories (`all`), World, Climate, Technology, Culture, Sport.
- Lead: kicker "Climate"; headline "The valley that moved its river back"; dek "Forty years after it was straightened, the Tessel is being allowed to meander again — and the floods have stopped."; meta "Ines Kalder · 9 min read · saved".

| Story | Section | Read | Saved | Thumb `--c1/--c2/--c3` |
|-------|---------|-----:|:-----:|------------------------|
| Nord coalition talks stall over fisheries quota | World | 4 min | yes | #D9DFE6 / #7B8EA3 / #3F5468 |
| Orbital's tiny chip promises a week of battery — with caveats | Technology | 6 min | no | #E6DFD2 / #B89D6C / #A83A2A |
| Marrow Theatre reopens with a play performed in the dark | Culture | 5 min | yes | #E9D6D2 / #C0716A / #5C2B26 |
| Halden win the derby on a goal nobody saw coming | Sport | 3 min | no | #D6E4D7 / #5F9A6A / #F0C33C |
| Why September's heat felt different this year | Climate | 7 min | no | #DFE6D3 / #8A9A6A / #E2A04A |
| Fjord Bank to stop cash handling at 40 branches | World | 4 min | no | #E5DCD0 / #A58A68 / #2F6B4F |

Thumb drawing: `--c1` fill; `::before` a `--c2` half-ellipse rising from the bottom (inset −20% sides, −30% bottom, 70% tall); `::after` a 16px `--c3` disc at top-right (12px inset).

## Motion

| Element        | Trigger     | Property            | From → To         | Duration | Easing       | Notes |
|----------------|-------------|---------------------|-------------------|---------:|--------------|-------|
| `.chips button`| select      | background, color, border-color | outline → ink fill | 160ms | linear | |
| `.list.swap .story` | chip select | opacity, translateY | 1, 0 → 0, 6px | 280ms | `--ease-std` / `--ease-out` | reversed after the filter |
| `.save`        | toggle      | color, fill         | ink-3 → saved     | 0        | —            | instant |
| `.chips`       | swipe       | scroll-snap         | —                 | native   | —            | `scroll-snap-type:x proximity` |
| nav item       | select      | color               | ink-3 → ink       | 0        | —            | instant |

Reduced motion: the list swap dip is removed (`opacity:1; transform:none`), the filter still applies after 280ms; all transitions 1ms.

## States

- **Chip pressed:** `aria-pressed="true"`, fill `--ink`, text `--paper`, border `--ink`.
- **Chip idle:** transparent, 1px `--line` border, text `--ink-2`.
- **Story saved:** bookmark `aria-pressed="true"`, icon filled `--saved`; meta gains "· saved" with a 14px download-check icon in `--saved`.
- **Story hidden (filtered):** `hidden` attribute → `display:none`.
- **Nav current:** `aria-current="page"`, colour `--ink`.
- **Focus-visible:** 3px `--red` outline, 2px offset on chips, bookmarks, nav and the lead link.
- **Empty section:** not reachable with the sample data; if a section has zero stories, show the label "Technology · 0 stories" and leave the list empty.

## Accessibility

- Chips: `role="group" aria-label="Sections"` with `aria-pressed` buttons (toggle semantics, not tabs, because the list below is filtered rather than replaced).
- Bookmarks: `<button aria-pressed aria-label="Save for offline">`; the visible "saved" text in the meta line duplicates the state for sighted users.
- The lead card is one `<a>` with heading, dek and meta inside, so its accessible name is the headline (put `aria-labelledby` on it pointing at the `<h2>` if your framework flattens link names).
- Thumbnails and the landscape are `aria-hidden` decorative CSS.
- Badge count is inside the "Saved" button so its name reads "Saved 3".
- Contrast: `--ink-2` on `--paper` 7.0:1; `--ink-3` on `--paper` 3.6:1 — used only for 11–12px meta at weight 500, so bump to `#7d756a` (4.6:1) if AA on meta is required; `--red` on `--paper` 5.9:1; `--saved` on `--paper` 5.7:1.
- Hit targets: chips 36px tall with 8px gaps (allow 44px row), bookmarks 40px, nav items ≥ 88×52.

## Responsive rules

- 390 wide: as specified.
- 360 wide: gutter 16px; lead headline 24px; thumbs 64px.
- ≥ 600 wide: two-column story grid under a full-width lead; chips stay a single scrolling row.
- ≥ 840 wide (tablet): lead card and list side by side (lead 5/12, list 7/12); bottom nav becomes a left rail.

## Acceptance checklist

- [ ] Background is `#FAF6EE`; headlines are Newsreader 600 at 30 / 26 / 17px; UI text is Inter.
- [ ] Chip row scrolls horizontally with no visible scrollbar and proximity snapping; pressed chip is `#1C1A17` with paper text.
- [ ] Selecting a chip dips the list 6px / opacity 0 over 280ms, filters, then restores; the section label reports "Section · N stories".
- [ ] Lead card is `#F1EBDF`, 18px radius, with a 190px CSS-drawn landscape (gradient sky, 64px sun, two hills) — no image files.
- [ ] Each story row has a 72px thumb, a serif headline, a meta line with section and reading time, and a 40px bookmark button.
- [ ] Saved stories show "· saved" in `#2F6B4F` with a download-check icon; the bookmark is filled.
- [ ] Toggling a bookmark updates the meta line and the Saved tab badge count.
- [ ] Stories are separated by 1px `#E3DCCD` hairlines, not cards.
- [ ] Bottom nav is 64px plus 34px clearance; current item is ink-coloured with `aria-current="page"`.
- [ ] Focus rings visible on chips, lead link, bookmarks and nav.
- [ ] Reduced motion removes the list dip but keeps filtering.
- [ ] No fixed control inside the top 54px.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: "Top stories" chip pressed; lead card (Climate) with "saved"; six stories, two of them saved; Saved tab badge reads 3 (lead + 2).
2. Swipe the chip row: it scrolls horizontally with the scrollbar hidden and proximity snap on each chip.
3. Tap a chip (e.g. "Technology"): the previously pressed chip returns to outline; the tapped one fills `--ink` with paper text (160ms). The list dips to opacity 0 / 6px down over 280ms. At 280ms, stories not in that section are hidden, the section label changes to "Technology · 1 story", and the list returns.
4. Tap "Top stories" to show all six again; label returns to "Latest".
5. Tap a story's bookmark (40px round button, right column): `aria-pressed` flips; the icon fills `--saved` green; a "· saved" fragment with a download-check icon is appended to (or removed from) the story's meta line; the Saved badge recounts.
6. Tap a bottom-nav item: it becomes `aria-current="page"` (ink colour); others stay `--ink-3`. Only visual in this piece.
7. The lead card is a single link; tapping it would open the article (out of scope).

## Tokens

```css
:root {
  /* paper neutrals */
  --paper: #faf6ee;
  --paper-2: #f1ebdf;      /* lead card */
  --line: #e3dccd;         /* hairlines, chip borders */
  --ink: #1c1a17;
  --ink-2: #5e5850;        /* dek, chip text */
  --ink-3: #948c80;        /* meta, inactive nav, bookmark idle */

  /* accents */
  --red: #a83a2a;          /* kicker, badge, focus */
  --red-soft: #f3ddd6;
  --saved: #2f6b4f;        /* saved mark, filled bookmark */

  /* lead illustration */
  --sky: #e9d9c0;
  --sky-2: #f4e4cd;
  --sun: #e2a04a;
  --hill: #8a9a6a;
  --hill-2: #5e6f48;

  /* type */
  --serif: "Newsreader", Georgia, serif;     /* opsz 6..72, wght 500/600 */
  --sans: "Inter", system-ui, sans-serif;
  --fs-mast: 30px; --fs-lead: 26px; --fs-story: 17px; --fs-dek: 14px; --fs-chip: 13px; --fs-meta: 12px; --fs-kicker: 11px; --fs-nav: 11px;

  /* layout */
  --nav-h: 64px;
  --bottom-clear: 34px;
  --gutter: 20px;
  --art-h: 190px;
  --thumb: 72px;
  --r-card: 18px;
  --r-thumb: 10px;
  --r-chip: 999px;

  /* motion */
  --t-micro: 160ms;
  --t-swap: 280ms;
  --ease-std: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family     | Size | Weight | Line-height | Tracking | Case      |
|-----------------|------------|-----:|-------:|------------:|---------:|-----------|
| Masthead        | Newsreader | 30px | 600    | 1           | −0.01em  | sentence  |
| Lead headline   | Newsreader | 26px | 600    | 1.15        | −0.01em  | sentence  |
| Story headline  | Newsreader | 17px | 600    | 1.25        | 0        | sentence  |
| Dek             | Inter      | 14px | 400    | 1.45        | 0        | sentence  |
| Kicker / section label | Inter | 11px | 600  | 1.3         | +0.08em  | UPPERCASE |
| Chip            | Inter      | 13px | 500    | 1           | 0        | sentence  |
| Meta line       | Inter      | 12px | 500    | 1.4         | 0        | sentence  |
| Date            | Inter      | 12px | 500    | 1.4         | 0        | sentence  |
| Nav label       | Inter      | 11px | 500    | 1           | 0        | sentence  |
| Badge           | Inter      | 10px | 600    | 16px        | 0        | numerals  |

Set the serif with `font-optical-sizing:auto` so 17px and 26–30px get different optical sizes.

## Implementation notes

**Landscape in three pseudo-elements.** Sun and hills are border-radius shapes; the second hill's shadow gives a third band:

```css
.art { height:190px; position:relative; overflow:hidden;
  background: linear-gradient(180deg, var(--sky) 0%, var(--sky-2) 100%); }
.art::before { content:""; position:absolute; left:58%; top:34px; width:64px; height:64px; border-radius:50%; background:var(--sun); }
.art::after  { content:""; position:absolute; left:-10%; right:-10%; bottom:-40px; height:120px;
  border-radius:50% 50% 0 0 / 100% 100% 0 0; background:var(--hill); box-shadow: 0 26px 0 12px var(--hill-2); }
.art i { position:absolute; left:20%; bottom:30px; width:150%; height:80px;
  border-radius:60% 60% 0 0 / 100% 100% 0 0; background:var(--hill-2); opacity:.85; }
```

**Filter after the dip, not during.** One timer, cleared on rapid taps:

```js
list.classList.add('swap'); clearTimeout(t);
t = setTimeout(() => {
  const c = chip.dataset.cat; let n = 0;
  stories.forEach(s => { const show = c === 'all' || s.dataset.cat === c; s.hidden = !show; if (show) n++; });
  label.textContent = c === 'all' ? 'Latest' : `${chip.textContent} · ${n} ${n === 1 ? 'story' : 'stories'}`;
  list.classList.remove('swap');
}, 280);
```

**Saved mark lives in the meta line.** Append/remove the fragment next to the reading time rather than toggling a hidden span, so the DOM matches what's announced:

```js
if (on && !sv) meta.insertAdjacentHTML('beforeend', '<span>·</span><span class="sv">…saved</span>');
else if (!on && sv) { sv.previousElementSibling.remove(); sv.remove(); }
```

Common mistakes: using `<img>` placeholders for thumbs (the brief wants CSS colour blocks driven by custom properties); making chips tabs with `role="tablist"` (the content is filtered, not swapped); letting the chip row wrap at 360px.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
