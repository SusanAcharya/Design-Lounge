<!-- Design Lounge Nº 115 · "Giant wordmark reveal footer" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Giant wordmark reveal footer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The closing footer of a small design studio's site ("Halden", Patan, Kathmandu). Above it sits the tail of the page: a "Next case" row. The footer itself is calm and dark: an email call to action, a ticking local clock with an "in the studio / replies tomorrow" status, four sitemap columns and a legal row. Its signature is the wordmark `halden.` set so large it spans the full content width, cropped by the bottom edge of the page, with each letter rising out of the floor as the footer scrolls into view. The period is the single lavender accent. It should feel like the credits at the end of a film: quiet, then one big confident gesture.

## Reference behaviour

1. On load the page jumps (no animation) to the very bottom. The first frame shows the last ~100px of page content ("Next case · Northfold Bank, a rebrand in 14 weeks") and the full footer with the wordmark fully risen.
2. The wordmark is fitted to the footer's content width on load, after `document.fonts.ready`, and on resize: measure the word at 200px and scale the font size to `footerWidth − 80px`. At 1280 wide this lands at ~360px.
3. Scroll position drives a footer progress value `--p` from 0 (footer top at the viewport bottom) to 1 (footer fully in view, or one viewport of it in view if the footer is taller).
4. Each letter `i` (0–6) has its own progress `q = clamp(0, p × 1.5 − i × 0.07, 1)` and is translated down by `(1 − q) × 100%` of its own height. Letters therefore rise left to right with a stagger; the period arrives last.
5. A CSS transition of 520ms expo-out on `transform` smooths the scroll-driven values so the rise reads as motion, not scrubbing.
6. Hovering a letter turns it lavender (`--accent`) over 160ms.
7. Clicking **Replay reveal** jumps the page so only 80px of the footer is in view (letters sink out of sight), waits 420ms, then smooth-scrolls to the bottom, re-running the rise.
8. The clock shows Asia/Kathmandu time as `HH:MM:SS` updated every 1000ms; seconds are dimmed. The status text reads "in the studio now" between 10:00 and 18:00, "morning, opening at 10:00" between 06:00 and 10:00, otherwise "evening, replies tomorrow". A 7px lavender dot pulses (opacity 1 → 0.25 → 1, 2s).
9. Hovering the email draws a 2px lavender underline from left to right (background-size 0 → 100%, 400ms expo-out).
10. Hovering a sitemap link brightens it to `--ink` and grows a 14px lavender dash in front of it (width and right margin animate 0 → 14px / 8px over 240ms), pushing the label right.
11. Hovering the "Next case" row fills it with `--panel` and nudges the arrow 6px right.

## Structure

```
1280 × 800 (scrolled to bottom; document ≈ 1060px tall)
┌──────────────────────────────────────────────────────────────────────┐
│ NEXT CASE    Northfold Bank, a rebrand in 14 weeks   Identity · → │ 104  (end of page)
├──────────────────────────────────────────────────────────────────────┤
│ NEW BUSINESS, BOOKED THROUGH Q1 2027                     21:15:49    │
│ hello@halden.studio ●                  ● Patan · GMT+5:45 · status   │ ~120
├──────────────────────────────────────────────────────────────────────┤
│ STUDIO     WORK          SERVICES        ELSEWHERE    Halden is an…  │
│ About      Northfold     Identity        Are.na       (address,      │ ~170
│ Team       Ondo Health   Product design  Read.cv       hours)        │
│ Careers²   Saltmarsh     Design systems  Instagram                   │
│ Journal    All 38 cases  Motion          Newsletter                  │
│ © 2026 Halden Studio · Privacy · Imprint            (Replay reveal)  │ 30
│ ████ █   ███  █   ████ ████ ███                                      │
│ halden.   (≈360px type, box height 0.7em, cropped by page bottom)    │ ~250
└──────────────────────────────────────────────────────────────────────┘
 side padding 40px · grid 4 × 1fr + 1.3fr, gap 32px
```

- `<section class="tail">`: closing `<h2>` (64px) and an `<a class="next">` row, a 3-column grid `120px 1fr auto`, 104px tall, hairline on top.
- `<footer aria-label="Site footer">`: `position:relative; overflow:hidden; padding:36px 40px 0`.
  - `.top`: 2-column grid `1.25fr 1fr`, gap 48px, 28px bottom padding, 1px `--line` rule. Left: mono kicker + `<a class="mail">`. Right: `.clock` with `.t` (time) and `.z` (dot · place · zone · status), right-aligned.
  - `<nav class="cols" aria-label="Sitemap">`: four `<div>` columns each with `<h3>` + `<ul>`, then a `<p class="note">` address block.
  - `.legal`: flex row, copyright, two links, spacer, `<button class="replay">`.
  - `.word`: `aria-hidden="true"`, flex row of seven `<span>` letters each carrying `--i`. Last span `.end` is the accent period.

## Tokens

```css
:root {
  /* colour: cool near-black with one lavender accent */
  --bg: #0e0f12;          /* page + footer */
  --panel: #15171b;       /* next-case hover */
  --line: #25282e;        /* hairlines */
  --line-2: #34373e;      /* replay button border */
  --ink: #ecebe6;         /* primary text, wordmark */
  --ink-2: #a3a39c;       /* links, secondary */
  --ink-3: #7c7d80;       /* mono labels, dimmed seconds */
  --accent: #b8a6ff;      /* period, dot, underline, zone */
  --accent-ink: #120c2b;  /* text on accent if needed */

  /* type */
  --font: "Familjen Grotesk", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --fs-body: 15px;
  --fs-note: 14px;
  --fs-label: 11px;
  --fs-meta: 12px;
  --fs-mail: 44px;
  --fs-clock: 44px;
  --fs-next: 40px;
  --fs-close: 64px;
  --word: 360px;          /* overwritten by the fit script */

  /* layout */
  --pad: 40px;
  --gap-cols: 32px;
  --next-h: 104px;
  --r-pill: 999px;

  /* motion */
  --t-micro: 160ms;
  --t-line: 240ms;
  --t-underline: 400ms;
  --t-letter: 520ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role             | Family            | Size   | Weight | Line-height | Tracking | Case      |
|------------------|-------------------|-------:|-------:|------------:|---------:|-----------|
| Wordmark         | Familjen Grotesk  | ~360px (fitted) | 600 | 0.8 | −0.06em | lowercase |
| Closing h2       | Familjen Grotesk  | 64px   | 500    | 1.0         | −0.04em  | sentence  |
| Next-case title  | Familjen Grotesk  | 40px   | 500    | 1.1         | −0.03em  | sentence  |
| Email CTA        | Familjen Grotesk  | 44px   | 500    | 1.0         | −0.035em | lowercase |
| Clock            | Geist Mono        | 44px   | 500    | 1.0         | −0.04em  | tabular numerals |
| Link             | Familjen Grotesk  | 15px   | 400    | 1.45        | 0        | sentence  |
| Address note     | Familjen Grotesk  | 14px   | 400    | 1.45        | 0        | sentence  |
| Column heading   | Geist Mono        | 11px   | 500    | 1.0         | +0.10em  | UPPERCASE |
| Kicker / zone    | Geist Mono        | 12px   | 400    | 1.3         | +0.06em  | UPPERCASE kicker, sentence zone |
| Legal            | Geist Mono        | 11px   | 400    | 1.3         | +0.04em  | sentence  |

## Motion

| Element           | Trigger         | Property            | From → To                     | Duration | Easing        | Notes |
|-------------------|-----------------|---------------------|-------------------------------|---------:|---------------|-------|
| `.word span`      | scroll (`--p`)  | translateY          | 100% → 0                      | 520ms    | `--ease-out`  | per-letter progress `clamp(0, p·1.5 − i·0.07, 1)` |
| `.word span`      | hover           | color               | `--ink` → `--accent`          | 160ms    | `--ease`      | |
| `.mail`           | hover / focus   | background-size     | 0 2px → 100% 2px              | 400ms    | `--ease-out`  | underline drawn from left |
| `.cols a::before` | hover           | width, margin-right | 0, 0 → 14px, 8px              | 240ms    | `--ease-out`  | label shifts right |
| `.next svg`       | hover           | translateX          | 0 → 6px                       | 240ms    | `--ease-out`  | |
| `.dot`            | always          | opacity             | 1 → 0.25 → 1                  | 2000ms   | `--ease`      | infinite, calm |
| Replay            | click           | scrollTop           | footerTop − vh + 80 → bottom  | browser smooth | —       | 420ms pause before scrolling |

Reduced motion: every transition becomes 1ms, the pulse stops, letters are forced to `transform:none` (always risen), and Replay jumps instead of smooth-scrolling.

## States

- **Link hover:** `--ink-2` → `--ink` plus the lavender lead dash.
- **Focus-visible (all interactive):** 2px `--accent` outline, 3px offset, 2px radius.
- **Email hover/focus:** underline fully drawn.
- **Replay hover:** border `--accent`, text `--ink`.
- **Next-case hover:** row background `--panel`, arrow offset 6px.
- **Clock status:** three copy states by hour (see behaviour 8). If `Intl` with `timeZone` throws, keep the last rendered string.
- **Footer partially in view:** letters partly risen, staggered left to right.

## Accessibility

- The wordmark is decorative: `aria-hidden="true"`. The brand name is still announced via the address note ("Halden is an independent design studio…").
- `<footer aria-label="Site footer">`, `<nav aria-label="Sitemap">` with real `<ul>` lists and `<h3>` headings per column.
- The clock container has `aria-label="Studio local time"`; do **not** put it in a live region (it would announce every second).
- Replay is a real `<button type="button">`; Tab order follows reading order: next case → email → links → legal → Replay.
- Contrast on `#0e0f12`: `--ink` 16.6:1, `--ink-2` 7.9:1, `--ink-3` 4.6:1 (used only for 11–12px mono meta).
- `user-select:none` on the wordmark only.

## Responsive rules

- ≥ 1280: as specified; wordmark fits `width − 80px`.
- 1024–1279: same layout; the fit script shrinks the wordmark proportionally. Sitemap stays 5 tracks.
- 768–1023: `.top` stacks (clock left-aligned under the email); sitemap becomes 2 × 2 with the note spanning both columns; email and clock drop to 36px.
- < 640: sitemap becomes 2 columns, note full width; legal row wraps with Replay on its own line; wordmark keeps fitting the width (≈ 90px at 390 wide) and its box height stays 0.7em so the crop proportion holds.

## Acceptance checklist

- [ ] On load the page is scrolled to the bottom and the "Next case" row is visible above the footer.
- [ ] The wordmark exactly fills the content width (±4px) at 1280 and after resizing.
- [ ] The wordmark box is 0.7em tall with `overflow:hidden` on the footer, so letter bottoms are cropped by the page edge.
- [ ] Letters rise left to right while scrolling into the footer; the period is last.
- [ ] Scrolling back up sinks the letters again (state is driven by scroll, not a one-shot).
- [ ] Replay reveal sinks the letters and replays the rise.
- [ ] Clock shows Kathmandu time with seconds dimmed and updates every second.
- [ ] Status copy changes at 06:00, 10:00 and 18:00 Kathmandu time.
- [ ] Sitemap links show the 14px lavender lead dash on hover without layout jump elsewhere.
- [ ] Focus rings are visible on every link and the Replay button.
- [ ] With reduced motion the wordmark is static and fully visible; no pulse.
- [ ] No console errors; fonts load from Google Fonts only.

## Implementation notes

**Per-letter scroll progress in pure CSS.** JS writes one number; CSS derives each letter's offset. `clamp()` inside `calc()` keeps every letter between sunk and risen:

```css
footer { --p: 1; overflow: hidden; }
.word { display: flex; width: max-content; height: .7em;
        font: 600 var(--word)/.8 var(--font); letter-spacing: -.06em; }
.word span {
  --q: clamp(0, calc(var(--p) * 1.5 - var(--i) * .07), 1);
  transform: translateY(calc((1 - var(--q)) * 100%));
  transition: transform var(--t-letter) var(--ease-out);
}
```

**Progress from the footer's rect**, normalised by the smaller of footer height and viewport height so tall footers still reach 1:

```js
function update() {
  const r = foot.getBoundingClientRect(), vh = innerHeight;
  const p = Math.max(0, Math.min(1, (vh - r.top) / Math.max(1, Math.min(r.height, vh))));
  foot.style.setProperty('--p', p.toFixed(3));
}
addEventListener('scroll', update, { passive: true });
```

**Fit the wordmark after fonts load.** Measure at a known size, then scale; re-run on resize:

```js
function fit() {
  word.style.setProperty('--word', '200px');
  const avail = foot.clientWidth - 80;
  word.style.setProperty('--word', (200 * avail / word.scrollWidth).toFixed(1) + 'px');
}
document.fonts.ready.then(() => { fit(); scrollTo(0, document.body.scrollHeight); update(); });
```

Common mistakes: using `justify-content: space-between` to fill the width (it spreads the letters into a ransom note; scale the font instead); fitting before the webfont has loaded (the fallback font is wider); putting the clock in `aria-live`; forgetting `overflow:hidden` on the footer so the sunk letters create extra scroll height.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
