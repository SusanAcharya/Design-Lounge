<!-- Design Lounge Nº 220 · "Docs shell with hatched gutters" · designlounge.vercel.app -->

# Docs shell with hatched gutters

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens; keep the hatch, the hairlines and the crosshairs.

## What it is

Studied from tailwindcss.com/docs: the page frame, where the reading column is drawn as a strip of paper between two hairlines and the empty space either side is filled with fine diagonal hatching, so the layout grid itself becomes the decoration. This version is the docs for Rookery, a fictional headless component library, on the page "Theming and dark mode". A 56px top bar holds the logo, a version pill with a menu, search and site links. A 256px sticky nav rail sits on the left. The content is stacked in full-width bands; each band's bottom hairline runs through the hatched gutters, and a small crosshair marks where it meets the column edges. The footer is a three-column hairline grid with a System / Light / Dark switch that really rethemes the page, and the token table on the page marks which column is "in use". The detail worth copying is that the hatch lives on the container and the column paints over it, so the gutters need no extra elements at any width.

This is the shell. Put `docs-install-steps` inside it for an install page. The three-column version with an "On this page" list is `docs-three-column`; the paper version with scrollspy is `sidebar-docs-toc`.

## Reference behaviour

1. First frame at 1280×800, light theme: top bar; nav rail with four mono group headings (Getting started, Foundations, Components, Patterns); "Theming" current with a 1px ink bar and weight 600. The column (max 760px) shows eyebrow "FOUNDATIONS" in vermilion, 34px title, lede, then the "How a theme is applied" band with a code sample, then the top of "Colour tokens". Gutters either side are hatched at -45° every 9px.
2. Every band has a 1px bottom rule that crosses the gutters, and a 9px crosshair at the column's left and right edges on that rule.
3. Version pill "v2.4": click or ArrowDown opens a menu (v2.4 latest, v2.3 Jun 2026, v1.9 legacy) with focus on the checked item. ArrowUp/Down move, Enter selects, Escape closes and returns focus, Tab or an outside click closes. Choosing v2.3 or v1.9 shows a vermilion-tinted notice band at the top of the content: "You are reading the v1.9 docs. Go to v2.4". The link restores v2.4 and hides the band.
4. Theme switch (footer, bottom-left): three icon radios. Light is selected. Dark rethemes everything in 240ms; System follows `prefers-color-scheme` and updates live if the OS changes. The token table header changes to "Light · in use" or "Dark · in use" in the accent, and that column's cells turn full ink.
5. Clicking a nav item moves `aria-current`, updates the eyebrow to its group, and updates the mobile breadcrumb.
6. The nav rail is sticky under the top bar and scrolls on its own. The top bar is sticky with a 92% background and 8px blur.
7. Below 900px the rail becomes a 280px drawer opened from a breadcrumb bar ("☰ Foundations › Theming"); a scrim closes it, Escape closes it, choosing an item closes it.

## Structure

```
1280 × 800
┌ top 56px, sticky, 1px rule ─────────────────────────────────────────────────────────┐
│ ⌂ rookery (v2.4 ▾) (🔍 Search docs ⌘K)                Docs Components Changelog Showcase │
├ rail 256 ─────┬ main (hatched bg) ──────────────────────────────────────────────────┤
│ GETTING STARTED│ ////////│ col max 760, bg, 1px L/R rules, pad 40/48 │//////////│
│ │ Introduction │ ////////│ FOUNDATIONS                                │//////////│
│ │ Installation │ ////////│ Theming and dark mode  34/600              │//////////│
│ FOUNDATIONS    │ ////////│ lede 17                                    │//////////│
│ ┃ Theming      │ ────────+────────────────────────────────────────────+──────────│ band rule + crosshairs
│ │ Typography   │ ////////│ How a theme is applied  20/600             │//////////│
│ COMPONENTS     │ ////////│ p, p, pre                                  │//////////│
│ │ Accordion …  │ ────────+────────────────────────────────────────────+──────────│
│ PATTERNS       │ ////////│ Colour tokens · table Token|Light|Dark     │//////////│
│                │ ────────+──────────────┬──────────────┬──────────────+──────────│
│                │ ////////│ Rookery      │ Resources    │ Community    │//////////│ footer grid
│                │ ────────+──────────────┴──────────────┴──────────────+──────────│
│                │ ////////│ [◻ ☀ ☾]                 © 2026 Rookery Works│//////////│
└────────────────┴─────────────────────────────────────────────────────────────────┘
```

- `header.top` with logo link, `.ver` (button + `ul[role=menu]` of `menuitemradio`), search button, `nav[aria-label=Site]`.
- `div.crumb` (only visible under 900px) with the drawer toggle.
- `div.shell` grid `256px minmax(0,1fr)`: `nav#side[aria-label=Documentation]` and `main.main`.
- Each band: `div.band > div.col`. The notice band is `role=status`.
- `footer` inside main: two bands, the grid and the base row with `div[role=radiogroup][aria-label="Colour theme"]`.

## Tokens

```css
:root {
  --bg: #fafaf9;         /* page and column paper */
  --surface: #ffffff;    /* code block, menu, selected theme button */
  --ink: #121417;
  --ink-2: #4b5058;      /* body, nav items */
  --ink-3: #737881;      /* mono headings, crosshairs, meta */
  --line: #e4e5e8;       /* every hairline */
  --hatch: #e3e4e7;      /* 1px diagonal hatch lines */
  --accent: #c8402a;     /* eyebrow, in-use column, code attribute, focus */
  --accent-soft: #fbe9e5;/* old-version notice */
  --chip: #f0f0ee;       /* version pill, inline code, theme track */
  --sans: "Schibsted Grotesk", system-ui, sans-serif;
  --mono: "Martian Mono", ui-monospace, monospace;
  --top: 56px; --side: 256px; --col: 760px;
  --hatch-step: 9px; --cross: 9px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  color-scheme: light;
}
[data-theme=dark] {
  --bg: #0f1113; --surface: #15181b; --ink: #eceded; --ink-2: #a9adb3; --ink-3: #868b93;
  --line: #25292e; --hatch: #21252a; --accent: #ff7a59; --accent-soft: #2a1914; --chip: #1d2125;
  color-scheme: dark;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Logo | Schibsted Grotesk | 18px | 700 | 1 | -0.02em, lowercase |
| Version pill | Martian Mono | 11px | 500 | 1 | 0 |
| Site links | Schibsted Grotesk | 14px | 500 | 1 | 0 |
| Rail group heading | Martian Mono | 10.5px | 500 | 1 | 0.12em, upper |
| Rail item | Schibsted Grotesk | 14px | 400, current 600 | 1.7 | 0 |
| Eyebrow | Martian Mono | 11px | 500 | 1 | 0.12em, upper, accent |
| H1 | Schibsted Grotesk | 34px | 600 | 1.12 | -0.03em |
| Lede | Schibsted Grotesk | 17px | 400 | 1.7 | 0 |
| H2 | Schibsted Grotesk | 20px | 600 | 1.4 | -0.015em |
| Body | Schibsted Grotesk | 15px | 400 | 1.7 | 0 |
| Code, table hex | Martian Mono | 12–12.5px | 400 | 1.75 | 0 |
| Table header | Martian Mono | 10.5px | 500 | 1 | 0.08em, upper |
| Footer heading / link | Schibsted Grotesk | 14px | 600 / 400 | 1.7 | 0 |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Theme change | radio | background, colour on body and columns | light ↔ dark tokens | 240ms | standard |
| Version menu | open/close | opacity, translateY | 0, -4px ↔ 1, 0 | 160ms / 200ms | standard |
| Version chevron | open | rotate | 0 → 180° | 200ms | standard |
| Rail item hover | pointer | colour, left bar | transparent → `--ink-3` | 120ms | standard |
| Mobile drawer | toggle | translateX | -100% → 0 | 300ms | iOS sheet |
| Scrim | toggle | opacity | 0 → 1 (black 35%) | 240ms | standard |

Reduced motion: all transitions removed. The hatch is static; nothing loops.

## States

- Rail item: resting `--ink-2`, transparent 1px bar over the group's 1px rule; hover ink with `--ink-3` bar; current ink, 600, ink bar, `aria-current=page`.
- Version item: hover and focus `--chip` fill; checked item 600 with its small label in the accent.
- Old version: notice band visible, tinted `--accent-soft`, with a text button back to latest.
- Theme radio: resting `--ink-3` icon; hover ink; checked on a `--surface` pill with a 1px `--line` ring and a 1px shadow.
- Token table: the column for the active theme has an accent header with "· in use" and ink cells; the other column stays `--ink-2`.
- Focus-visible: 2px accent outline, 2px offset, on every control.

## Accessibility

- Version control: `button[aria-haspopup][aria-expanded][aria-controls]`; menu `role=menu`, items `role=menuitemradio` with `aria-checked`. The button label includes the current version.
- Theme switch: `role=radiogroup` labelled "Colour theme"; each icon button has `aria-label` System / Light / Dark; roving tabindex and arrow keys.
- The notice band is `role=status` so the version change is announced.
- Drawer: toggle has `aria-expanded` and swaps its label to "Close navigation"; opening moves focus to the current item; Escape and the scrim close it and return focus to the toggle. When closed the drawer is `visibility: hidden` so it is out of the tab order.
- Hatch and crosshairs are CSS backgrounds and pseudo elements, invisible to assistive tech.
- Contrast: `#4b5058` on `#fafaf9` ≈ 7.8:1; `#a9adb3` on `#0f1113` ≈ 8.9:1; accent `#c8402a` on `#fafaf9` ≈ 4.8:1 for the 11px eyebrow.
- Hit targets: theme buttons 32×28 (desktop docs footer); drawer toggle 40×40; menu items 36px.

## Responsive rules

- ≥1280: as drawn; gutters are whatever is left beside the 760px column.
- ≤1100: site links hide; search moves right.
- ≤900: one column. Rail becomes a fixed 280px drawer; the 48px breadcrumb bar appears, sticky under the top bar.
- ≤640: column gets 12px side margins so a sliver of hatch still frames it; column padding 28px 20px; h1 28px; footer grid stacks with top rules instead of left rules; search shrinks to an icon.
- The column is never wider than 760px. On very wide screens the hatch simply grows.

## Acceptance checklist

### Always

- [ ] Content column bordered left and right by 1px hairlines; gutters filled with a -45° 1px hatch.
- [ ] The hatch is the container's background; the column paints `--bg` over it. No gutter elements.
- [ ] Every band's bottom rule crosses the gutters, with a 9px crosshair at each column edge.
- [ ] Sticky top bar and sticky, independently scrolling nav rail.
- [ ] The current nav item has a 1px ink bar on the group's rule, not a filled pill.
- [ ] Version menu is keyboard operable and an old version shows a notice with a way back.
- [ ] System / Light / Dark switch rethemes the whole page; System follows the OS live.
- [ ] Below 900px the rail is a drawer with scrim, Escape and focus return.
- [ ] No horizontal page scroll at 375px; code scrolls inside its block.

### This demo

- [ ] Page title "Theming and dark mode", eyebrow "FOUNDATIONS", current item "Theming".
- [ ] Version pill reads v2.4; choosing v1.9 shows "You are reading the v1.9 docs."
- [ ] Token table lists five `--rk-*` tokens with light and dark swatches.
- [ ] Light accent `#c8402a`, dark accent `#ff7a59`, hatch line `#e3e4e7` every 9px.

## Implementation notes

Hatch on the container, paper on the column. The bands are full width, so their borders cross the gutters for free:

```css
.main { background: repeating-linear-gradient(-45deg, var(--hatch) 0 1px, transparent 1px 9px);
        background-attachment: fixed; }
.band { border-bottom: 1px solid var(--line); }
.col  { position: relative; max-width: 760px; margin: 0 auto; background: var(--bg);
        border-inline: 1px solid var(--line); padding: 40px 48px; }
```

`background-attachment: fixed` keeps the hatch phase continuous from band to band; without it each band restarts the pattern and you see seams.

Crosshairs are two 1px gradients in one 9px pseudo element, centred on the corner:

```css
.col::before, .col::after { content: ""; position: absolute; bottom: -5px; width: 9px; height: 9px;
  background:
    linear-gradient(var(--ink-3), var(--ink-3)) center / 9px 1px no-repeat,
    linear-gradient(var(--ink-3), var(--ink-3)) center / 1px 9px no-repeat; }
.col::before { left: -5px; } .col::after { right: -5px; }
```

Theme: resolve System at apply time and listen for changes:

```js
const mq = matchMedia('(prefers-color-scheme: dark)');
function apply() {
  const t = mode === 'system' ? (mq.matches ? 'dark' : 'light') : mode;
  document.documentElement.dataset.theme = t;
}
mq.addEventListener('change', () => mode === 'system' && apply());
```

Persist the choice in your real product (this demo can't, the sandbox blocks storage) and set the attribute in a blocking script in `<head>` so dark-mode visitors don't see a light flash.

Common mistakes:

- Hatching the whole page, including the column. The column must be solid paper.
- Thick or dark hatch. It is 1px at roughly 1.1:1 against the background; it should be felt more than seen.
- Box shadows on the column. Hairlines only.
- Rounded column corners. This is a drafting grid; corners are square and marked with crosshairs.
- A theme toggle that only flips light/dark. Offer System, and make it the honest default in a real product.
- Forgetting `color-scheme`, so scrollbars and form controls stay light in dark mode.

Rebuild order:

1. Tokens for both themes.
2. Top bar and shell grid with the sticky rail.
3. Hatched main with bands and the column.
4. Crosshairs.
5. Footer grid and theme switch.
6. Version menu and notice band.
7. Drawer below 900px.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
