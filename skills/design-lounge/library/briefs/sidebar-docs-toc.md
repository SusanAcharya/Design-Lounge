<!-- Design Lounge Nº 333 · "Paper docs with scrollspy TOC" · www.designlounge.live -->

# Paper docs with scrollspy TOC

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the three column widths, the 68ch measure and the scrollspy line.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A documentation page for Larkspur, a fictional background job runner. The page is "Retries and backoff". Three columns sit on warm paper: a 240px left nav with four groups and the current page marked in red, a centre article capped at 68ch with serif headings and sans body, and a 200px "On this page" list on the right. As you read, the list marks the heading in view and a 2px red line grows down its left edge to show how far you are. A small mono readout under the list says how much you have read. It should feel like a printed manual, not a dashboard. The detail worth copying is the progress line drawn on the TOC rail itself, so position and progress are one mark.

`docs-three-column` is the neutral white version with a top bar and a copy button. This piece is the paper one with no top bar.

## Structure

```
1280 × 800
┌──── 240 ────┬───────────────────── 1fr ──────────────────────┬──── 200 ────┐
│ Larkspur v4.2│        Jobs / Retries and backoff              │             │
│─────────────│        Retries and backoff        (h1 46px)    │ ON THIS PAGE│
│ START HERE  │        A job that fails is not finished…       │ │ How a re… │
│  Introduction│        (lede, serif 20px)                     │ ┃•How a re… │
│  Install     │        7 min read · Updated 28 September 2026 │ │   What co…│
│  Your first… │        ─────────────────────────────────────  │ │ Backoff…  │
│ JOBS        │        How a retry is scheduled   (h2 28px)    │ │ Idempot…  │
│  Defining…   │        prose 15/1.65 …                        │ │ When ret… │
│  Scheduling  │        What counts as a failure  (h3 15px)    │ │   Alertin…│
│▌Retries and…│        • …                                     │ │ Limits    │
│  Timeouts    │        ┌ code block, paper tint ─────────────┐ │ 0% read   │
│  Concurrency │        └──────────────────────────────────────┘ │ Back to top│
│ OPERATIONS  │        table …                                 │             │
│ REFERENCE   │        (scrolls)                               │             │
└─────────────┴────────── article max 68ch, padding 48 40 96 ───┴─────────────┘
```

- `body` is a grid: `grid-template-columns: 240px minmax(0, 1fr) 200px`, `height: 100%`, `overflow: hidden`.
- Left: `nav aria-label="Documentation"`. Brand row, then four groups. Each group is an `h2` label plus a `ul` with `aria-labelledby` on the label. Own scroll if it overflows. `border-right: 1px solid --line`.
- Centre: a `div` scroller (`overflow: auto`, `--sheet` background) holding one `article`. The article has `max-width: 68ch`, `margin: 0 auto`, padding 48px 40px 96px.
- Article order: breadcrumb `p`, `h1`, lede `p`, meta row, then sections. Each section is an `h2` with an `id`, prose, and sometimes an `h3`, a `pre`, a `table` or a note.
- Foot of the article: a two-column pager, Previous and Next.
- Right: `aside` labelled by its "On this page" label. Padding 56px 24px 32px 0. Inside: a positioned wrapper holding the 1px track, the 2px fill and an `ol` of links. `h3` links are indented 12px more. Then the readout and Back to top.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| TOC click scroll | click | scrollTop | current → heading − 32px | browser smooth | browser | `behavior: 'auto'`, instant |
| Progress fill | scroll | height | 0% → 100% | follows scroll, one update per frame | none | same, it is not an animation |
| TOC current | scroll | colour, weight, dot | idle → current | 160ms colour | `--ease` | instant |
| Link hover | hover | colour | muted → `--ink` | 160ms | `--ease` | instant |
| Pager hover | hover | border-colour | `--line-2` → `--ink` | 160ms | `--ease` | instant |

Batch scroll work in `requestAnimationFrame`. Do not put a CSS transition on the fill height. It lags behind the thumb.

## States

- Left nav link resting: `--ink-2`, 2px transparent left border.
- Left nav current: `aria-current="page"`, `--ink`, weight 600, 2px `--accent` left border, background `linear-gradient(90deg, --accent-soft, transparent 80%)`.
- TOC idle: `--ink-3`.
- TOC current: `aria-current="location"`, `--ink`, weight 500, a 5px `--accent` dot centred on the 1px track.
- Progress fill: 2px wide, `--accent`, from the top of the rail.
- Focus-visible: 2px `--focus` outline, offset 2px, 2px radius. In the left nav, offset -2px so the ring is not clipped by the column edge.
- Note block: 2px `--accent` left rule, `--paper` background, 12px 16px padding, label "Note." in the accent.
- Empty page (no `h2`): hide the TOC column content and keep the 200px column so the article does not jump.
- Loading: not used. Docs are static.

## Accessibility

- Three landmarks: `nav` "Documentation", `article` inside the main scroller, `aside` "On this page".
- One `h1` per page. Section headings are `h2`, subsections `h3`. The TOC mirrors that nesting with the indent.
- Left nav uses `aria-current="page"`. The TOC uses `aria-current="location"`. Do not mix them up.
- TOC links are real `href="#id"` links. They work with JavaScript off.
- After a TOC jump, move focus to the heading. Give the heading `tabindex="-1"` and call `focus({ preventScroll: true })`.
- The progress line and the readout are `aria-hidden`. They repeat what the scrollbar already says.
- Contrast: `#1f1b16` on `#fbf8f1` is about 16:1. `#6e6658` on `#f6f1e7` is about 5:1. `#b8321f` on `#fbf8f1` is about 5.6:1.
- Keep the body at 15px with 1.65 line-height. Keep the measure at 68ch. Do not stretch prose across the column.
- TOC and nav links are at least 28px tall on desktop. On touch layouts they become 44px.

## Responsive rules

- At 1280 and wider: 240 / 1fr / 200. The article stays at 68ch and centres in the middle column.
- At 1024 to 1279: keep all three columns. The article padding drops to 32px on the sides.
- Below 1024: the left nav becomes a drawer.
  - Add a 52px top bar to the article column with the brand and a 40px menu button. The button has `aria-expanded` and `aria-controls`.
  - The drawer is 280px wide, slides in from the left over 240ms with `cubic-bezier(0.2, 0.7, 0.2, 1)`, over a scrim of `rgba(31, 27, 22, .4)`.
  - Trap focus in the drawer. Escape and a scrim tap close it and return focus to the menu button.
  - The current page stays marked inside the drawer.
  - Reduced motion: no slide.
- Below 1024, the TOC also leaves its column. Move it to a collapsible "On this page" block under the meta row, a `details` element, closed by default. Keep the scrollspy off in this mode. Show the progress as a 2px red line fixed to the top of the article column instead.
- Below 640: article padding 24px 20px 64px. h1 drops to 34px. h2 drops to 24px. Code blocks scroll sideways inside themselves. The page never scrolls sideways.

## Acceptance checklist

### Always

- [ ] Three columns at desktop: 240px, `minmax(0, 1fr)`, 200px. Only the centre scrolls.
- [ ] Article measure is 68ch, centred.
- [ ] Headings are serif. Body, nav and TOC are sans. Code is mono.
- [ ] Exactly one left nav link has `aria-current="page"` with a 2px accent rule.
- [ ] The TOC marks one item with `aria-current="location"`, using a 120px line from the scroller top.
- [ ] At the scroll bottom, the last TOC item is current.
- [ ] The progress fill height tracks scroll progress, 0% to 100%.
- [ ] TOC click scrolls to 32px above the heading, smooth, and instant under reduced motion.
- [ ] Focus moves to the target heading after a jump.
- [ ] Focus rings are visible on every link.
- [ ] Below 1024 the nav is a drawer and the TOC is a collapsible block.
- [ ] No horizontal scroll at any width.

### This demo

- [ ] Product is Larkspur v4.2. Page is "Retries and backoff" in the Jobs group.
- [ ] Groups are Start here, Jobs, Operations, Reference.
- [ ] TOC has five `h2` items and two `h3` items: What counts as a failure, Alerting on dead jobs.
- [ ] Paper `#f6f1e7`, sheet `#fbf8f1`, accent `#b8321f`.
- [ ] Fonts are Newsreader and IBM Plex Sans.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: article at the top. "Retries and backoff" in the left nav has `aria-current="page"`, a 2px red left rule, weight 600 and a soft red wash fading to the right. In the TOC, "How a retry is scheduled" is current. The progress line is 0% tall. The readout says "0% read".
2. Scroll the article: the TOC item for the last heading whose top has passed 120px below the scroller's top becomes current. It turns `--ink`, weight 500, and gets a 5px red dot on the rail.
3. While scrolling, the red line's height equals `scrollTop / (scrollHeight - clientHeight)` as a percentage of the list height. The readout updates to the rounded percent.
4. At the very bottom of the article, the last TOC item becomes current even if its heading has not reached the 120px line.
5. Click a TOC item: the article scrolls so the heading sits 32px below the top. Use smooth scrolling. Under reduced motion, jump with no animation. Focus moves to the heading with `preventScroll`, so screen readers land there.
6. Click "Back to top": same behaviour, target is the `h1`.
7. Hover a left nav link or TOC link: text goes from muted to `--ink` over 160ms. No underline, no background.
8. Hover a pager card at the foot: its border turns `--ink`.
9. Only the centre column scrolls. The left nav and the TOC stay put.

## Tokens

```css
:root {
  --paper: #f6f1e7;        /* page ground, side columns */
  --sheet: #fbf8f1;        /* article column */
  --code: #efe8da;         /* code blocks and inline code */
  --ink: #1f1b16;          /* headings and body */
  --ink-2: #4a443a;        /* nav links, lede */
  --ink-3: #6e6658;        /* labels, meta, idle TOC */
  --line: #e3d9c7;         /* column rules, table rules */
  --line-2: #d4c8b2;       /* TOC track, pager border */
  --accent: #b8321f;       /* current page rule, TOC dot and fill, note rule */
  --accent-soft: #f3e2d9;  /* current page wash */
  --string: #5b6b2f;       /* string colour in code */
  --focus: #b8321f;

  --serif: "Newsreader", Georgia, serif;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  --measure: 68ch;
  --col-nav: 240px;
  --col-toc: 200px;
  --spy-line: 120px;
  --anchor-gap: 32px;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-10: 40px; --space-12: 48px;
  --r-code: 4px; --r-inline: 3px;

  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --fast: 160ms;
}
```

The mono is a system stack on purpose. Two Google families is the limit, and the serif and sans carry the page.

## Typography

| Role | Family | Size / line-height | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Brand | Newsreader | 22px / 1 | 600 | -0.01em | `--ink` |
| Version | mono | 12px | 400 | 0 | `--ink-3` |
| Nav group label | IBM Plex Sans | 11px / 1.4 | 600 | 0.08em, uppercase | `--ink-3` |
| Nav link | IBM Plex Sans | 14px / 1.45 | 400, current 600 | 0 | `--ink-2`, current `--ink` |
| Breadcrumb | IBM Plex Sans | 13px | 400 | 0 | `--ink-3` |
| h1 | Newsreader, opsz 72 | 46px / 1.05 | 600 | -0.02em | `--ink` |
| Lede | Newsreader | 20px / 1.5 | 500 | 0 | `--ink-2` |
| h2 | Newsreader, opsz 36 | 28px / 1.2 | 600 | -0.01em | `--ink` |
| h3 | IBM Plex Sans | 15px / 1.4 | 600 | 0 | `--ink` |
| Body | IBM Plex Sans | 15px / 1.65 | 400 | 0 | `--ink` |
| Code block | mono | 13px / 1.6 | 400 | 0 | `--ink` |
| Inline code | mono | 13.5px | 400 | 0 | `--ink` on `--code` |
| Table head | IBM Plex Sans | 12px | 600 | 0.06em, uppercase | `--ink-3` |
| TOC label | IBM Plex Sans | 11px | 600 | 0.08em, uppercase | `--ink-3` |
| TOC link | IBM Plex Sans | 13px / 1.4, sub 12.5px | 400, current 500 | 0 | `--ink-3`, current `--ink` |
| Readout | mono | 12px | 400 | 0 | `--ink-3` |

Headings are serif. Everything you scan or click is sans. Code is mono. Do not set the nav or the TOC in the serif.

## Implementation notes

The scrollspy is a loop over headings on scroll, not an IntersectionObserver. An observer fires on enter and leave, so short sections between two long ones get skipped. The loop is cheap with fewer than 30 headings.

```js
const LINE = 120;
function update() {
  const top = scroller.getBoundingClientRect().top;
  let idx = 0;
  heads.forEach((h, i) => { if (h.getBoundingClientRect().top - top <= LINE) idx = i; });
  const max = scroller.scrollHeight - scroller.clientHeight;
  if (max > 0 && scroller.scrollTop >= max - 2) idx = heads.length - 1;
  links.forEach((a, i) => i === idx
    ? a.setAttribute('aria-current', 'location')
    : a.removeAttribute('aria-current'));
  const p = max > 0 ? scroller.scrollTop / max : 1;
  fill.style.height = (p * 100).toFixed(1) + '%';
  pct.textContent = Math.round(p * 100) + '% read';
}
scroller.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
```

Smooth scroll that respects the setting. Read the media query at click time, not once at load.

```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
function go(id) {
  const el = document.getElementById(id);
  const y = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top
    + scroller.scrollTop - 32;
  scroller.scrollTo({ top: Math.max(0, y), behavior: reduce.matches ? 'auto' : 'smooth' });
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
```

The rail. The track and the fill live in a positioned wrapper next to the `ol`, not inside it. An `ol` may only hold `li`.

```css
.rail { position: relative; }
.track, .fill { position: absolute; left: 0; top: 0; width: 1px; background: var(--line-2); }
.track { bottom: 0; }
.fill { width: 2px; left: -.5px; background: var(--accent); height: 0; }
.toc a[aria-current="location"]::before {
  content: ""; position: absolute; left: -2px; width: 5px; height: 5px;
  margin-top: 6px; border-radius: 50%; background: var(--accent);
}
```

Common mistakes:

- Scrolling the whole window and making the side columns `position: sticky`. That works, but then the scroller is `window`. Pick one and measure against it.
- Letting prose run the full column width. Cap at 68ch.
- A blue link colour. The only colour is the red accent.
- Using the accent for every link. Links in prose stay ink with an underline.
- Pure white `#fff` for the article. Use `--sheet`.
- Code blocks in a dark theme on a paper page. Keep them on `--code` with ink text.
- Highlighting the first heading only when it is in view. At the top of the page, the first heading is current.
- A CSS transition on the fill height. It trails the scroll.
- Drawing a second progress bar at the top of the page on desktop. The rail is the progress.

Rebuild order:

1. Set the three column grid and make only the centre scroll.
2. Build the left nav with groups and the current page rule.
3. Set the article measure, the serif headings and the body type.
4. Add the TOC list from the `h2` and `h3` ids.
5. Add the rail, the fill and the readout.
6. Wire the scrollspy and the click scroll.
7. Check reduced motion and focus after a jump.
8. Add the drawer and the collapsible TOC below 1024.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
