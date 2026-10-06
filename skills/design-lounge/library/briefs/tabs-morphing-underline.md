<!-- Design Lounge Nº 073 · "Tabs with morphing underline" · www.designlounge.live -->

# Tabs with morphing underline

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A tab strip for a newsletter publication's settings ("Wren · Morning Dispatch"): nine tabs (some with count pills) in a 720px strip that scrolls horizontally, and a 2px olive underline that morphs rather than jumps. On change the underline first **stretches** to cover both the old and the new tab (180ms, expo-out), then **settles** onto the new tab (200ms, standard ease). The panel below crossfades over 200ms with a 4px rise. Where tabs overflow, the strip's edges fade to transparent via a mask that only appears on the side that actually has more content. Dark warm brown, serif headings, one olive accent.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────┐
│ Wren   Publications / Morning Dispatch                                   │ 56
├──────────────────────────────────────────────────────────────────────────┤
│              PUBLICATION                                                 │ 720 column, centred
│              Morning Dispatch — weekday letter  (Libre Caslon 34)        │
│              Sent 06:30 Europe/Oslo · 41,208 subscribers · …             │
│              ┌───────────────────── 720 ─────────────────────┐           │
│              │Overview Subscribers 41k Posts 184 Revenue Integ…│ ▒▒│     │ tabs 44 tall, fade 40
│              │▔▔▔▔▔▔▔▔                                        │           │ 2px underline
│              └───────────────────────────────────────────────┘           │ 1px hairline
│              ┌ Open rate ┐ ┌ Click rate ┐ ┌ Net new ┐                    │ panel, 24 above
│              │ 58.2 % +1.4│ │ 14.9 % +0.3│ │ +1,204  │                    │ tiles 3-col, 12 gap
│              └───────────┘ └───────────┘ └─────────┘                    │
└──────────────────────────────────────────────────────────────────────────┘
```

- `<main>` — 720px column, 40px top padding: `.kick`, `<h1>`, `.sub`.
- `.strip` — `position:relative; width:720px; border-bottom:1px solid --line`, with `data-l` / `data-r` attributes ("0"/"1") driving the masks.
  - `.scroll` — `overflow-x:auto; overflow-y:hidden`, scrollbar hidden (`scrollbar-width:none` + `::-webkit-scrollbar{display:none}`); this is the element that receives the `mask-image`.
    - `<div class="tabs" role="tablist" aria-label>` — `display:flex; gap:4px; width:max-content; position:relative; padding-bottom:1px`.
      - `<button class="tab" role="tab" id="tN" aria-controls="pN" aria-selected tabindex>` × 9 — 44px tall, `0 14px` padding, 8px gap to an optional `<span class="n">` pill.
      - `<span class="ink" aria-hidden>` — absolute, `bottom:0; height:2px`, `left`/`width` set by JS.
- `.panels` — `display:grid; margin-top:24px`; nine `<section class="panel" role="tabpanel" id="pN" aria-labelledby="tN" tabindex="0">` all at `grid-area:1/1`.

Tabs and panels: Overview (3 tiles) · Subscribers 41k (3-row list: Sofie Marthinsen, Jonas Refsnes, Ada Kvernmo paused) · Posts 184 (3 issues: "The port that stopped waiting" issue 184 Mon 28 Sep; "Three rate decisions, one krone" 183; "Counting the cod by ear" 182) · Revenue (MRR kr 86,420 +3.1 %; Paid subscribers 1,842 +38; Churn 1.6 %) · Integrations 3 (Fjord Bank Payments, Nord Post CMS connected; Halden Analytics token expired) · Domains (dispatch.wren.pub default; morning.example.no custom; both "TLS ok") · Webhooks 2 (subscriber.created, post.published → hooks.example.no/wren, 200) · Team 6 (Liv Marstrand owner, Henrik Dahl editor, Sigrid Aune writer) · Settings (one prose paragraph: sending window 06:30–06:45, reply-to hello@wren.pub, double opt-in on).

### Underline phases, worked example

With tab boxes measured as Overview `{l: 0, w: 92}` and Revenue `{l: 356, w: 84}` (values depend on font metrics — always measure):

| Phase   | t (ms) | `left` | `width` | Transition |
|---------|-------:|-------:|--------:|------------|
| rest    | 0      | 0      | 92      | — |
| stretch | 0→180  | 0      | 440     | `.stretch`: 180ms expo-out on both properties |
| settle  | 180→380| 356    | 84      | default: 200ms standard ease on both |

Selecting a tab to the **left** (Revenue → Overview): stretch sets `left: 0; width: 440` (left edge travels, right edge holds), settle sets `left: 0; width: 92`. The `min/max` computation makes both directions symmetrical without a branch.

### Overflow and mask state

| `scrollLeft`                         | `data-l` | `data-r` | Mask |
|--------------------------------------|----------|----------|------|
| 0–2                                  | 0        | 1        | right 40px fade |
| between                              | 1        | 1        | both fades |
| ≥ `scrollWidth − clientWidth − 2`    | 1        | 0        | left 40px fade |
| no overflow (wide viewport)          | 0        | 0        | none |

`edges()` runs on `scroll` (passive), on `resize`, and once after initial placement and after `document.fonts.ready` (font swap changes `scrollWidth`).

## Motion

| Element      | Trigger        | Property        | From → To                                   | Duration | Easing       | Notes |
|--------------|----------------|-----------------|---------------------------------------------|---------:|--------------|-------|
| `.ink`       | select (phase 1)| left, width    | old box → `min(oldL,newL)`, `max(oldR,newR) − min(…)` | 180ms | `--ease-out` | `.stretch` class swaps the transition |
| `.ink`       | select (phase 2)| left, width    | span → new tab's `offsetLeft`/`offsetWidth` | 200ms    | `--ease`     | starts at t = 180ms via `setTimeout` |
| `.panel` out | select         | opacity         | 1 → 0                                       | 200ms    | `--ease`     | `visibility` hidden after 200ms |
| `.panel` in  | select         | opacity, transform | 0, `translateY(4px)` → 1, none           | 200ms    | opacity `--ease`, transform `--ease-out` | |
| `.tab`       | hover / select | color           | `--ink-2` → `--ink`                         | 140ms    | `--ease`     | background snaps |
| `.scroll`    | select hidden tab | scrollLeft   | native smooth                               | native   | —            | `scrollIntoView({inline:'nearest'})` |
| masks        | scroll         | `mask-image`    | attribute-driven, no transition             | 0        | —            | |

Reduced motion: transitions 1ms; `scrollIntoView` uses `behavior:'auto'`. The two-phase timing collapses to an instant jump.

## States

- **Tab default:** `--ink-2`, transparent. **Hover:** `--ink`, `--panel` background, radius `8px 8px 0 0`. **Selected (`aria-selected="true"`):** `--ink`, pill inverted (`--accent` bg, `--accent-ink` text).
- **Tab focus-visible:** `box-shadow: inset 0 0 0 2px var(--accent)` (inset so it isn't clipped by the scroll container).
- **Panel focus-visible:** 2px accent outline, 8px offset.
- **Overflow masks:** `data-l="1"` → left 40px fade; `data-r="1"` → right 40px fade; both → both; neither → no mask. Thresholds: left when `scrollLeft > 2`, right when `scrollLeft + clientWidth < scrollWidth − 2`.
- **Status dots (lists):** `--accent` active, `--line-2` inactive/paused.

## Accessibility

- `role="tablist"` with `aria-label`; tabs `role="tab"`, `aria-selected`, `aria-controls`, ids; panels `role="tabpanel"`, `aria-labelledby`, `tabindex="0"`.
- Roving tabindex: selected tab `0`, others `−1`. Arrow keys select (automatic activation) — if your panels are expensive, switch to manual activation (arrows move focus, Enter/Space selects) and say so.
- `scrollIntoView` on select with `block:'nearest'` so the page doesn't jump; focus with `preventScroll:true` to avoid a second scroll.
- Inactive panels are `visibility:hidden`, so only the active panel's content is in the tab order.
- The underline is `aria-hidden`.
- Masks are purely visual; hidden tabs remain reachable via keyboard and scroll.
- Contrast: `--ink-2` on `--bg` 9.8:1; `--ink-3` on `--bg` 4.6:1; `--accent-ink` on `--accent` 10:1.
- Hit targets: tabs 44px tall; pills are not interactive.

## Responsive rules

- ≥ 1280: as specified (720px strip).
- 1024–1279: unchanged.
- 768–1023: column and strip `calc(100vw − 64px)`; more tabs overflow; masks do the work.
- < 640: strip full-bleed with 16px gutters; tab padding 12px; tiles become one column; the count pills hide except on the selected tab.

## Acceptance checklist

- [ ] Strip is 720px with a 1px `#2d2822` bottom rule; tabs 44px tall, `0 14px` padding, 4px gaps; underline 2px `#b5c27a`.
- [ ] Changing tabs runs two phases: stretch to span both tabs over 180ms `cubic-bezier(.16,1,.3,1)`, then settle over 200ms `cubic-bezier(.2,.7,.2,1)`.
- [ ] The stretch covers `min(left)` to `max(right)` regardless of direction.
- [ ] Panels crossfade over 200ms; the incoming panel rises 4px; inactive panels are `visibility:hidden`.
- [ ] Right fade (40px) visible on load; left fade appears after scrolling > 2px; right fade disappears at the end.
- [ ] Scrollbar is hidden but the strip scrolls with trackpad/wheel and via `scrollIntoView`.
- [ ] → ← Home End move and select with wrapping; only the selected tab is tabbable; Tab then enters the panel.
- [ ] Selected tab's count pill is olive with dark text; others are `#26211b` with `#7d7467` text.
- [ ] Focus ring is an inset 2px olive box-shadow (not clipped by the scroll container).
- [ ] Underline is placed without animation on load, on resize and after `document.fonts.ready`.
- [ ] Reduced motion: no stretch/settle, no smooth scroll.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: "Overview" selected; underline exactly under it; the Overview panel shows three stat tiles (Open rate 58.2 %, Click rate 14.9 %, Net new +1,204). The strip is scrolled to the start: no left fade, a 40px right fade (tabs 7–9 are partly hidden).
2. Click "Revenue" (three tabs to the right): phase 1 — the underline's `left` snaps to Overview's left and its `width` grows to reach Revenue's right edge over 180ms; phase 2 — after 180ms `left` moves to Revenue's left and `width` shrinks to Revenue's width over 200ms. Total 380ms. The Overview panel fades out while Revenue fades in (200ms, the incoming panel also rises from `translateY(4px)`).
3. Click a tab to the left: same two phases; phase 1 grows leftward (left moves, width grows), phase 2 the right edge retracts.
4. Click a partly hidden tab (e.g. "Team"): it scrolls into view (smooth) and the underline morphs across the scrolling strip; the left fade appears once `scrollLeft > 2px`; the right fade disappears when the end is reached.
5. Keyboard: Tab focuses the selected tab only. → / ← move to the next/previous tab (wrapping) and select it immediately (automatic activation); Home / End go to first/last. Selection scrolls the tab into view. Tab again moves focus into the visible panel (`tabindex="0"`).
6. Hover a tab: text brightens to `--ink` and the tab gets a `--panel` background with 8px top radii. The count pill on the selected tab inverts to olive with dark text.
7. Resizing re-measures the underline without animation; fonts loading late also re-place it.

## Tokens

```css
:root {
  /* colour — warm dark brown, olive accent */
  --bg: #16130f;
  --panel: #1e1a15;       /* tiles, lists, tab hover */
  --panel-2: #26211b;     /* count pills */
  --line: #2d2822;        /* hairlines */
  --line-2: #3b342c;      /* inactive status dots */
  --ink: #f3ede3;
  --ink-2: #b9b0a2;       /* tab labels, list meta */
  --ink-3: #7d7467;       /* subtitles, pills, right-aligned meta */
  --accent: #b5c27a;      /* underline, kicker, selected pill, focus, status dots */
  --accent-ink: #151a08;
  --positive: #9ccf8e;

  /* type */
  --serif: "Libre Caslon Text", Georgia, serif;
  --sans: "Work Sans", system-ui, sans-serif;

  /* layout */
  --strip-w: 720px;
  --tab-h: 44px;
  --tab-pad: 14px;
  --tab-gap: 4px;
  --fade: 40px;           /* edge mask width */
  --ink-h: 2px;
  --r: 10px;              /* tiles, lists */
  --r-tab: 8px 8px 0 0;

  /* motion */
  --t-fast: 140ms;        /* tab colour */
  --t-stretch: 180ms;     /* underline phase 1 */
  --t-settle: 200ms;      /* underline phase 2 */
  --t-xfade: 200ms;       /* panel crossfade */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family            | Size | Weight | Line-height | Tracking | Notes |
|-----------------|-------------------|-----:|-------:|------------:|---------:|-------|
| Brand           | Libre Caslon Text | 20px | 400    | 1           | 0        | |
| Kicker          | Work Sans         | 11px | 600    | 1.3         | +0.14em  | UPPERCASE `--accent` |
| Page h1         | Libre Caslon Text | 34px | 400    | 1.15        | −0.01em  | italic suffix in `--ink-2` |
| Subtitle        | Work Sans         | 14px | 400    | 1.5         | 0        | `--ink-3` |
| Tab label       | Work Sans         | 14px | 500    | 1           | 0        | `--ink-2`; selected/hover `--ink` |
| Count pill      | Work Sans         | 11px | 500    | 1.4         | 0        | `1px 7px` padding, 999px radius |
| Tile value      | Libre Caslon Text | 28px | 400    | 1.2         | −0.01em  | delta 12px `--positive` |
| Tile label      | Work Sans         | 12px | 400    | 1.4         | 0        | `--ink-3` |
| List row        | Work Sans         | 13px | 400    | 1.5         | 0        | name 500; meta `--ink-2`; right `--ink-3` `tabular-nums` |
| Prose           | Work Sans         | 14px | 400    | 1.5         | 0        | `--ink-2`, strong `--ink` 500 |

## Implementation notes

**Two-phase morph = two transitions and one timeout.** Swap the transition definition with a class for phase 1, then remove it and set the final box:

```css
.ink { position: absolute; bottom: 0; height: 2px; background: var(--accent);
       transition: left 200ms var(--ease), width 200ms var(--ease); }
.ink.stretch { transition: left 180ms var(--ease-out), width 180ms var(--ease-out); }
```

```js
function morph(from, to) {
  const a = box(from), b = box(to), l = Math.min(a.l, b.l), r = Math.max(a.l + a.w, b.l + b.w);
  ink.classList.add('stretch'); ink.style.left = l + 'px'; ink.style.width = (r - l) + 'px';
  clearTimeout(busy);
  busy = setTimeout(() => { ink.classList.remove('stretch'); ink.style.left = b.l + 'px'; ink.style.width = b.w + 'px'; }, 180);
}
```

`box(i)` is `{ l: tab.offsetLeft, w: tab.offsetWidth }` — offsets relative to `.tabs`, which is `position:relative` and scrolls together with the underline, so scrolling never desyncs them.

**Edge masks driven by scroll position** — put the mask on the scrolling element and switch it with data attributes:

```css
.strip[data-r="1"] .scroll { mask-image: linear-gradient(90deg, #000 0, #000 calc(100% - 40px), transparent); }
.strip[data-l="1"] .scroll { mask-image: linear-gradient(90deg, transparent, #000 40px, #000 100%); }
.strip[data-l="1"][data-r="1"] .scroll { mask-image: linear-gradient(90deg, transparent, #000 40px, #000 calc(100% - 40px), transparent); }
```

```js
function edges() {
  strip.dataset.l = scroll.scrollLeft > 2 ? '1' : '0';
  strip.dataset.r = scroll.scrollLeft + scroll.clientWidth < scroll.scrollWidth - 2 ? '1' : '0';
}
scroll.addEventListener('scroll', edges, { passive: true });
```

Common mistakes: putting the underline outside the scrolling element (it stops tracking once the strip scrolls); using `transform: scaleX` for the stretch (distorts the rounded ends); forgetting to disable the transition for the initial placement (the underline slides in from `width:0` on load); relying on `mask` on `.strip` instead of `.scroll` (the mask then clips the panel's focus ring).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
