---
title: "Dark devtool landing page"
summary: "A full landing page for an edge image API: lime-on-graphite, tabbed curl/Node/Python samples with copy, a hairline feature grid, giant latency numerals and pricing."
platform: web
type: screen
category: landing
tags: [landing, api, developer, code, pricing]
styles: [dark, terminal]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-02
palette: ["#0A0B0D", "#111316", "#ECEEF1", "#C8F65A"]
fonts: ["Geist", "Geist Mono"]
related: []
---

# Dark devtool landing page

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The marketing home page for **Kiln**, a fictional edge image-rendering API. It scrolls through a sticky nav, a two-column hero (four-line 72px headline on the left, a tabbed code card on the right), a customer logo strip, a six-cell hairline feature grid, a latency section with 112px numerals and per-region bars, a three-tier pricing teaser and a footer with a ghosted 228px wordmark. The palette is graphite with one acid-lime accent. What makes it worth copying is the code card: it reads like a real terminal. It has line numbers, a syntax palette tuned for dark backgrounds, a response pane next to a gradient "rendered image" thumbnail, and a timing strip whose bar replays every time you switch language.

## Reference behaviour

1. Initial state: page scrolled to top. The first 800px show the nav, the eyebrow pill, the four-line headline ending in a lime "18ms.", the lede, both CTAs, the `npm i @kiln/sdk` install chip, the three meta stats, and the full code card with the `curl` tab selected.
2. On load the timing bar inside the code card grows from 0 to 18% width over 700ms (expo out).
3. Click `node.js` or `python`: that tab becomes selected (lighter background, full ink), its panel fades up 4px over 280ms and the others hide. The timing bar replays its 700ms grow.
4. With a tab focused, ArrowLeft/ArrowRight move selection cyclically and focus follows (roving tabindex).
5. Click **Copy** in the card header: the visible sample's text, without line numbers, goes to the clipboard. The button turns lime and reads "Copied" for 1400ms, then reverts. If the clipboard API is blocked, the visual confirmation still runs.
6. Click the copy icon in the install chip: copies `npm i @kiln/sdk` and flashes the same way (icon tints lime).
7. Scroll: the nav stays pinned (60px, 82% opaque graphite with a 10px backdrop blur and a hairline bottom border).
8. Hover a feature cell: its background fills with `--panel`. Hover a nav link: colour goes from `--ink-2` to `--ink`.
9. The footer ends with a 228px lowercase "kiln" wordmark in `--panel-2` (barely visible), then a fine-print row.

## Structure

```
1280 × 800 (first frame)                                    page height ≈ 3230px
┌──────────────────────────────────────────────────────────────────────────┐
│ ■ Kiln  Docs Product Network Pricing Changelog  ● All systems  Sign in [Get key] │ 60 sticky
├──────────────────────────────────────────────────────────────────────────┤
│ (v3.2) AVIF encoding…            ┌─ ● ● ●  curl node.js python   [Copy] ┐│
│                                  │ 1 curl -X POST api.kiln.dev/v1/render ││
│ Images,                72px      │ 2   -H "Authorization: …"             ││ code card
│ rendered at                      │ …  8 lines, min-height 236           ││ 560 wide
│ the edge in                      ├───────────────────────────┬──────────┤│
│ 18ms.  (lime)                    │ // 200 OK  {json}         │ thumb    ││
│ lede 18px, 470 max               ├───────────────────────────┴──────────┤│
│ [Start free →] [Read the docs]   │ fetch 4.1 · encode 11.2 · ━━━  17.8ms ││
│ $ npm i @kiln/sdk  ⧉             └──────────────────────────────────────┘│
│ 41B  99.995%  SOC 2                                                      │
├── logos strip 22px pad, hairline top + bottom ───────────────────────────┤
│ // PRIMITIVES  h2 48px  │ 3×2 hairline grid of feature cells            │
│ // NETWORK  h2 · 18ms 61ms (112px) │ region bars card                   │
│ // PRICING  h2 · three tiers, middle one lime-tinted                     │
│ footer: 2fr + 4×1fr columns · ghost wordmark 228px · fine print          │
└──────────────────────────────────────────────────────────────────────────┘
gutter 64px · hero grid 1fr 560px gap 56px · section padding 96px 0
```

- `<nav aria-label="Main">`: `position: sticky; top: 0`, flex row, gap 32px.
- `<header class="hero">`: dotted-grid `::before` (20px pitch, masked by a radial gradient centred at 72% 40%). Contains a two-column grid.
- Code card: `div.code` > `div.tabs[role=tablist]` with three `button[role=tab]` + copy button; three `pre[role=tabpanel]` (two `hidden`); `div.resp` (grid `1fr 156px`: response `pre` + `.thumb`); `div.timing`.
- `div.logos`: six fictional text wordmarks spaced with `justify-content: space-between`.
- `section#features`: `.grid` of six `.cell`s (border-top/left on the grid, border-right/bottom on cells, so hairlines never double).
- `section#latency`: two columns, giant numerals left, `.regions` list right (six rows, 44px each).
- `section#pricing`: `.price` three-column grid of `.tier` cards.
- `<footer>`: `.fgrid`, `.wordmark`, `.fine`.

## Tokens

```css
:root {
  /* surfaces */
  --bg: #0a0b0d;        /* page */
  --panel: #111316;     /* cards, code card */
  --panel-2: #171a1e;   /* selected tab, chips, wordmark */
  --line: #1f2329;      /* hairlines */
  --line-2: #2b3038;    /* stronger borders, dot grid */
  /* text */
  --ink: #eceef1;
  --ink-2: #9aa1ab;
  --ink-3: #646b75;
  /* accent */
  --accent: #c8f65a;    /* lime: CTA, highlights, checks */
  --accent-ink: #0d1400;
  --accent-hover: #d8ff7a;
  /* syntax */
  --k-str: #f0b37e;  --k-key: #8ab4ff;  --k-fn: #c8f65a;
  --k-com: #5a616b;  --k-num: #e58fb8;
  /* type */
  --sans: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  /* layout */
  --gutter: 64px;
  --nav-h: 60px;
  --r: 10px;      /* chips */
  --r-lg: 14px;   /* cards */
  --r-btn: 8px;
  /* elevation */
  --shadow-code: 0 30px 80px -30px rgba(0,0,0,.8), 0 0 0 6px rgba(255,255,255,.015);
  /* motion */
  --t-fast: 160ms;
  --t-layout: 280ms;
  --t-bar: 700ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Hero headline | Geist | 72px | 600 | 0.98 | −0.045em | sentence |
| Section h2 | Geist | 48px | 600 | 1.04 | −0.035em | sentence; second clause in `--ink-3` |
| Latency numerals | Geist | 112px | 600 | 0.9 | −0.06em | numerals; "ms" superscript 28px lime |
| Price | Geist | 44px | 600 | 1 | −0.04em | — |
| Lede | Geist | 18px | 400 | 1.5 | 0 | sentence |
| Body / cells | Geist | 14–15px | 400 | 1.55 | 0 | sentence |
| Cell title | Geist | 17px | 600 | 1.3 | −0.01em | sentence |
| Kicker | Geist Mono | 12px | 400 | 1 | +0.12em | UPPERCASE, prefixed `//` |
| Code | Geist Mono | 13px | 400 | 1.75 | 0 | — |
| Response / meta | Geist Mono | 12px | 400 | 1.7 | +0.08em for labels | UPPERCASE labels |
| Footer wordmark | Geist | 228px | 700 | 0.8 | −0.07em | lowercase |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---:|---|
| Timing bar `i` | load, tab change | width | 0 → 18% | 700ms | `--ease-out` |
| Tab panel | tab change | opacity, translateY | 0, 4px → 1, 0 | 280ms | `--ease-out` |
| Tab label | hover | color | `--ink-3` → `--ink` | 160ms | `--ease` |
| Copy button | click | color + border to lime, label "Copied" | instant, reverts after 1400ms | — | — |
| Buttons | hover | background / border-color | — | 160ms | `--ease` |
| Feature cell | hover | background | transparent → `--panel` | 160ms | `--ease` |

Replay the bar by setting `animation: none`, forcing reflow (`offsetWidth`), then clearing it. Reduced motion: animations off and transitions 1ms; the bar renders at 18% immediately.

## States

- **Tab selected:** `aria-selected="true"`, `--panel-2` background, `--ink` text; unselected tabs `--ink-3`, `tabindex="-1"`.
- **Copy (idle):** 1px `--line` border, `--ink-2` text. **Copied:** text and icon `--accent`, border `rgba(200,246,90,.4)`.
- **Primary button hover:** `#d8ff7a`. **Ghost button hover:** border `--ink-3`, background `--panel`.
- **Focus-visible (everything):** 2px lime outline, 2px offset, 6px radius.
- **Pricing "Pro" tier:** border `rgba(200,246,90,.45)`, background fades from 6% lime to `--panel` at 40%, "most teams" label in lime, filled CTA.
- **Status dot:** 6px lime dot with a 3px 15% lime halo (static, no pulse).

## Accessibility

- Tabs follow the WAI-ARIA tabs pattern: `role=tablist` with `aria-label`, each tab `aria-controls` its panel, panels `aria-labelledby` their tab. Arrow keys move selection, Tab leaves the list.
- The copy button has `aria-live="polite"`, so "Copied" is announced. The install copy button has `aria-label="Copy install command"`.
- Line numbers are `user-select: none` and excluded from copied text.
- The dot grid, window dots, thumbnail and wordmark are decorative (`aria-hidden` or CSS-only).
- Contrast: `--ink-2` on `--bg` is 7.6:1; `--ink-3` (4.0:1) is used only for 12px mono meta and labels; lime on `--bg` is 15:1, `--accent-ink` on lime is 14:1.

## Responsive rules

- ≥ 1280: as specified; content max-width 1280 with 64px gutters.
- 1024–1279: hero grid becomes `1fr 480px`; headline 60px; code sample font 12px.
- 768–1023: hero stacks (code card below copy, full width); feature grid 2 columns; latency section stacks; pricing 3 columns stay but drop the bullet lists to two items.
- < 640: gutter 20px; nav links collapse to a menu button; headline 44px; numerals 72px; feature grid and pricing single column; footer columns 2-up; wordmark 120px.

## Acceptance checklist

- [ ] Headline is exactly four lines at 1280: "Images, / rendered at / the edge in / 18ms." with "18ms" in `#c8f65a`.
- [ ] The full code card, both CTAs and the install chip are visible without scrolling at 1280×800.
- [ ] Switching tabs shows exactly one panel and replays the 700ms timing bar.
- [ ] ArrowLeft/ArrowRight cycle tabs, and only the selected tab is in the Tab order.
- [ ] Copy puts the sample text without line numbers on the clipboard and shows "Copied" for 1.4s.
- [ ] The page never throws if `navigator.clipboard` is unavailable.
- [ ] The nav stays sticky with a blurred, 82%-opaque background and a 1px bottom hairline.
- [ ] Feature grid hairlines are 1px everywhere (no doubled borders).
- [ ] Latency numerals are 112px with a 28px lime "ms" superscript.
- [ ] Only one accent colour is used outside the syntax palette.
- [ ] Focus rings are visible on nav links, tabs, copy buttons, CTAs and footer links.
- [ ] Reduced motion disables the panel fade and bar grow without hiding content.

## Implementation notes

**Dotted hero field that fades out.** One background-image plus a mask; no SVG needed:

```css
.hero::before {
  content: ""; position: absolute; inset: 0; opacity: .7;
  background-image: radial-gradient(var(--line-2) 1px, transparent 1px);
  background-size: 20px 20px;
  mask: radial-gradient(70% 80% at 72% 40%, #000 0, transparent 75%);
}
```

**Copy without line numbers.** Put each number in a `.ln` span that is a direct child of the `pre`, then skip those nodes:

```js
const p = document.querySelector('pre[role=tabpanel]:not([hidden])');
const text = [...p.childNodes]
  .filter(n => !(n.classList && n.classList.contains('ln')))
  .map(n => n.textContent).join('');
try { await navigator.clipboard.writeText(text); } catch (e) {}
```

**Hairline grid without doubles.** Borders go on the container's top/left and each cell's right/bottom:

```css
.grid { display: grid; grid-template-columns: repeat(3, 1fr);
        border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
.cell { border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 28px; }
```

Common mistakes: writing full `https://` URLs in code samples (keep them scheme-less, as curl accepts); letting the code `pre` wrap (use `white-space: pre; overflow: hidden`, since the samples are written to fit 560px); giving the logo strip real brand names.
