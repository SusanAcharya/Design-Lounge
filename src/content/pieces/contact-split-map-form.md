---
title: "Split map contact form"
summary: "A two-column contact block: a stylised SVG city map whose studio switcher pans to each pin, beside a floating-label form with simulated send."
platform: web
type: section
category: contact
tags: [contact, form, map, locations, floating-labels]
styles: [minimal, soft]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-02
palette: ["#FAFAF7", "#E4E8E1", "#C3D5DA", "#1D2320", "#E2553B"]
fonts: ["Hanken Grotesk", "DM Mono"]
related: []
---

# Split map contact form

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The contact block of a small design studio ("Halden Studio") with three addresses in one city. The left side is a hand-drawn-feeling SVG city map built from two rotated block patterns, a channel of water, parks and white arterial roads with grey casing. The right side has a 76px headline, "Come by, or write.", and a four-field form with floating labels. A pill segmented control over the map switches studios. The map pans over 900ms to centre the chosen pin, and the address card and the form's "This one goes to…" line both update. The detail worth copying is how the map and the form are tied together: picking a studio changes who the message is addressed to, which the success state confirms by name.

## Reference behaviour

1. Initial state: "Harbour" is selected. The map is already centred on the Harbour pin (no pan on load). That pin is vermilion, scaled 1.35×, with a slow pulse ring. The address card bottom-left reads "Studio 01 · HQ / Kade 14, Harbour". Company and message fields are prefilled so the floating labels show both states at once.
2. Click "Old Town" in the switcher: the selected pill becomes ink-filled, the map world translates over 900ms with `cubic-bezier(.65,0,.15,1)` until the Old Town pin sits at 58% x / 44% y of the map panel. The previous pin goes grey and the new pin turns vermilion and gains the pulse.
3. During the pan, the card's text fades out over 200ms, swaps at t=200ms, then fades back in. The coordinates label in the bottom-right and the lead line ("This one goes to the Old Town print lab") update at the same moment.
4. Clicking a pin on the map selects that studio, the same as the tab.
5. Arrow Left / Right on the focused tab moves to the previous / next studio (wraps) and moves focus.
6. Focusing an empty field: border turns ink and gains a 4px `rgba(29,35,32,.07)` ring. The label rises 10px and scales to 0.75 over 200ms.
7. Submit with an empty name or an invalid email: the failing field gets a vermilion border and a 4px `--accent-soft` ring, its label turns vermilion, focus moves to the first failing field, and the note beside the button reads "Add your name and a valid email". Typing in a failing field clears its error.
8. Valid submit: the button shows "Sending", turns `--ink-2`, and its arrow spins. After 1400ms the success panel fades and rises 12px into place over the form column: a tick in a soft vermilion disc, "Message received.", and copy naming the studio contact (Ines, Pieter or Saskia).
9. "Send another" hides the success panel, resets the form and focuses the name field.

## Structure

```
1280 × 800
┌──────────────────────────────────────────┬──────────────────────────────┐
│ ( Harbour | Old Town | North Yards )     │ HALDEN STUDIO   CONTACT / 03 │ 56 top pad
│                                          │                              │
│        ▒▒ blocks ▒▒   park               │ Come by,                     │ 76px
│     ════ arterial road ═══════           │ or write.                    │
│              ◉ Harbour (pulse)           │ lead 16px, 400px max         │
│  ~~~~~~~~~ channel ~~~~~~~~~~~~~~        │ ┌─name────┐ ┌─email─────┐    │ 56px fields
│                                          │ ┌─company────────────────┐   │
│ ┌ address card 300w ┐                    │ ┌─message (116h)─────────┐   │
│ │ STUDIO 01 · HQ    │                    │ └────────────────────────┘   │
│ │ Kade 14, Harbour  │        51.91° N …  │ [ Send message → ] avg reply │ 52px pill
└──────────────────────────────────────────┴──────────────────────────────┘
          fluid (680 at 1280)                        600 fixed
```

- `<body>` is a two-column grid: `minmax(0,1fr) 600px`.
- `<section class="map" aria-label="Studio locations">`, `overflow:hidden`.
  - `.world` is a 1600 × 1300 absolutely positioned layer containing one inline `<svg>` and three `.pin` divs. Only this layer is transformed. It is `aria-hidden`; the card carries the real content.
  - `.switch[role=tablist]` at 32/32, three `<button role=tab>`.
  - `.card[aria-live=polite]` at left 32, bottom 32, 300px wide: tag, `<h3>` name, address, `<dl>` hours + phone.
  - `.coords` bottom-right, mono 11px.
- `<section class="side">` with 56/64/48 padding: eyebrow row, `<h1>`, `.lead`, `<form novalidate>` on a 2-column grid with 12px gap (name + email share a row; company and message span both), action row.
- `.done[role=status]` absolutely covers the side column for the success state.

## Tokens

```css
:root {
  /* map */
  --land: #e4e8e1;        /* street colour between blocks */
  --block: #d9ded5;       /* building blocks */
  --water: #c3d5da;
  --water-edge: #adc4cb;  /* 2px shoreline stroke */
  --park: #cfdcc4;
  --road: #fbfcfa;        /* arterial fill */
  --road-edge: #cdd3ca;   /* arterial casing, 4–5px wider than the fill */

  /* surfaces + text */
  --bg: #fafaf7;
  --field: #ffffff;
  --line: #e1e3dc;
  --line-2: #c9cdc3;      /* field border */
  --ink: #1d2320;
  --ink-2: #5b635d;
  --ink-3: #8a918b;       /* placeholders/labels at rest */
  --accent: #e2553b;      /* active pin, headline word, errors */
  --accent-soft: #fbe4de;
  --ok: #2f7a57;

  /* type */
  --sans: "Hanken Grotesk", system-ui, sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;

  /* shape */
  --r: 10px;              /* fields */
  --r-lg: 18px;           /* address card */
  --field-h: 56px;
  --shadow-card: 0 1px 0 rgba(29,35,32,.04), 0 12px 32px -12px rgba(29,35,32,.22);

  /* motion */
  --t-micro: 160ms;
  --t-label: 200ms;
  --t-pan: 900ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-pan: cubic-bezier(.65,0,.15,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role              | Family         | Size | Weight | Line-height | Tracking | Case      |
|-------------------|----------------|-----:|-------:|------------:|---------:|-----------|
| Headline          | Hanken Grotesk | 76px | 600    | 0.94        | −0.045em | sentence  |
| Success title     | Hanken Grotesk | 48px | 600    | 1           | −0.04em  | sentence  |
| Card name         | Hanken Grotesk | 22px | 600    | 1.3         | −0.02em  | sentence  |
| Lead              | Hanken Grotesk | 16px | 400    | 1.5         | 0        | sentence  |
| Field value/label | Hanken Grotesk | 15px | 400    | 1.45        | 0        | sentence  |
| Button            | Hanken Grotesk | 15px | 600    | 1           | 0        | sentence  |
| Tabs              | Hanken Grotesk | 13px | 500    | 1           | 0        | sentence  |
| Eyebrow / tag     | DM Mono        | 11–12px | 500 | 1.4        | +0.1em   | UPPERCASE |
| Pin label         | DM Mono        | 11px | 500    | 20px        | +0.06em  | UPPERCASE |
| Card meta / note  | DM Mono        | 12px | 400    | 1.6         | 0        | sentence  |

The single word "write." in the headline is `--accent`; nothing else in the column is coloured.

## Motion

| Element          | Trigger        | Property            | From → To                     | Duration | Easing       | Notes |
|------------------|----------------|---------------------|-------------------------------|---------:|--------------|-------|
| `.world`         | studio change  | transform           | current → centre on new pin   | 900ms    | `--ease-pan` | none on first paint (set transform with `transition:none`, restore after 2 rAFs) |
| `.pin i`         | select         | background, scale   | grey 1 → vermilion 1.35       | 160 / 200ms | `--ease` / `--ease-out` | |
| `.pin.on::before`| active pin     | scale, opacity      | 0.3, .9 → 1.6, 0              | 2400ms   | `--ease-out` | infinite, calm |
| card text        | studio change  | opacity             | 1 → 0 → 1                     | 200ms ×2 | `--ease`     | content swaps at 200ms |
| floating label   | focus / filled | translateY, scale   | 0, 1 → −10px, .75             | 200ms    | `--ease`     | `transform-origin:left top` |
| field ring       | focus          | border, box-shadow  | `--line-2` → `--ink` + 4px ring | 160ms  | `--ease`     | |
| send arrow       | hover          | translateX          | 0 → 3px                       | 200ms    | `--ease-out` | |
| send arrow       | busy           | rotate              | 0 → 360°                      | 800ms    | linear       | spinner only |
| `.done`          | success        | opacity, translateY | 0, 12px → 1, 0                | 400ms    | `--ease` / `--ease-out` | visibility delayed on hide |

Reduced motion: every transition is 1ms and all keyframe animations are removed (no pulse, no spinner). The pan becomes a jump; the content still updates.

## States

- **Tab hover:** text `--ink-2` → `--ink`. **Selected:** ink fill, `--bg` text, `aria-selected="true"`.
- **Pin:** inactive is a 14px grey disc with a 3px white border. Active is vermilion at 1.35× with a 52px pulse ring, and its label weight and colour go to `--ink`.
- **Field rest:** 1px `--line-2`, label 15px `--ink-3` vertically centred (top 18px).
- **Field focus / filled:** label raised (detected with `:placeholder-shown` on a `placeholder=" "`), border `--ink`, ring.
- **Field error:** `.bad` sets the border and label to `--accent` with a `--accent-soft` 4px ring, plus `aria-invalid="true"`.
- **Button hover:** `#000`; active scale .98; busy uses `aria-busy="true"`, `--ink-2` fill, spinner, pointer-events off.
- **Success:** a full-column overlay with a 64px tick disc, the title, a sentence naming the studio contact, and a ghost "Send another" button (44px).

## Accessibility

- The switcher is a real tablist. Use roving `tabindex` (selected = 0, others = −1), and let Arrow Left/Right move and select.
- The map layer is `aria-hidden="true"`. The address card is `aria-live="polite"`, so the new studio's name and address are announced after a switch.
- Each field has a real `<label for>`. The floating label is the visible label, not a placeholder.
- Errors set `aria-invalid` and focus the first bad field. The note beside the button is `aria-live="polite"`.
- The success panel is `role="status"`, and focus moves to "Send another".
- Focus-visible: a 2px vermilion outline with 2px offset on tabs and buttons. Fields use the ink border + ring.
- Contrast: `--ink-2` on `--bg` is 6.3:1. Field labels at rest (`--ink-3`) are 3.4:1 and are acceptable only because the value text they sit beside is `--ink`; raise them to `--ink-2` if your audit requires 4.5:1 for labels.

## Responsive rules

- ≥ 1280: as specified; the map column is fluid and the form column is fixed at 600px.
- 1024–1279: form column 520px, headline 64px, side padding 48px.
- 768–1023: stack the columns. The map is 360px tall on top, and the card moves to the map's bottom-left at 24px. The form takes the full width with a 640px max.
- < 640: map 280px; the switcher becomes a horizontally scrollable row; name and email stack to one column; headline 48px.
- Re-run the pan on `resize`, because pin centring depends on the map panel's size.

## Acceptance checklist

- [ ] The body grid is `minmax(0,1fr) 600px` at 1280 × 800, and nothing scrolls.
- [ ] The map is a single inline SVG with two rotated `<pattern>` block grids, water, three parks and cased arterial roads. No raster tiles.
- [ ] Switching studios translates only the `.world` layer, over 900ms with `cubic-bezier(.65,0,.15,1)`.
- [ ] The selected pin ends at 58% / 44% of the map panel.
- [ ] No pan animation on first load.
- [ ] Card text fades out, swaps at 200ms and fades in. Coordinates and the form's lead line update too.
- [ ] Arrow keys move between tabs with roving tabindex.
- [ ] Floating labels rise to −10px at scale .75 on focus and when filled, and never overlap the value.
- [ ] Invalid submit marks fields with `aria-invalid`, focuses the first one, and updates the live note.
- [ ] Valid submit shows the busy state for 1400ms, then a success panel naming the selected studio's contact.
- [ ] "Send another" restores the form and focuses the name field.
- [ ] Reduced motion removes the pulse and spinner and makes the pan instant.
- [ ] Focus is visible on every tab, field and button.

## Implementation notes

**Pan a fixed-size world, not the SVG viewBox.** Animating `transform` on a wrapper is GPU-friendly and lets the HTML pins ride along with the SVG.

```js
function pan() {
  const r = map.getBoundingClientRect(), s = STUDIOS[cur];
  world.style.transform =
    `translate(${Math.round(r.width * .58 - s.x)}px, ${Math.round(r.height * .44 - s.y)}px)`;
}
world.style.transition = 'none'; pan();
requestAnimationFrame(() => requestAnimationFrame(() => world.style.transition = ''));
```

**City blocks from a pattern.** Two patterns, rotated −14° and 22°, give the map an old-district and new-district grain with almost no markup:

```html
<pattern id="grid" width="56" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
  <rect width="56" height="44" fill="var(--land)"/>
  <rect x="4" y="4" width="48" height="36" rx="3" fill="var(--block)"/>
</pattern>
```

Draw each arterial twice, a wide `--road-edge` stroke and then a narrower `--road` stroke on the same path. That gives the road its casing.

**Floating labels without JS.** Give every input `placeholder=" "` and key off `:placeholder-shown`:

```css
.f input:focus + label,
.f input:not(:placeholder-shown) + label { transform: translateY(-10px) scale(.75); color: var(--ink-2); }
.f input { padding: 24px 16px 8px; height: 56px; }
```

Common mistakes:

- Putting the label before the input, which breaks the sibling selector.
- Animating `top` instead of `transform`.
- Forgetting to re-pan on resize.
- Letting the address card live inside the transformed world, which makes it slide away with the map.
