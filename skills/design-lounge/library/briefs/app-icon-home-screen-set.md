<!-- Design Lounge Nº 274 · "Home screen icon set" · www.designlounge.live -->

# Home screen icon set

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from icon.museum: the craft of the icons it collects (continuous-corner squircles, light from the top, a soft rim, one idea per icon) applied to a set of twelve original icons that belong together. They sit on an iOS 26-style home screen over a dusk landscape wallpaper, with a weather widget, a page indicator and a glass dock. A glass panel switches the whole set between Light, Dark and Tinted, the three appearances the system asks icon makers to supply, and Tinted adds a hue slider. The detail worth copying is that every icon is built from three colour roles (plate, glyph, accent), so one rule per appearance recolours the entire set and the colours cross-fade.

## Structure

```
390 × 844 (status bar drawn by the Lounge)
┌──────────────────────────────────────┐
│ padding-top 66px, sides 27px          │
│ ┌──────────────┐  ▢        ▢          │ row 1, 92px rows, 4 × 62 columns
│ │ Larkspur Bay ☀│ Brightday Waymark    │
│ │ 18°           │  ▢        ▢          │ row 2
│ │ Clear until 9 │ Fernbook Hearthly    │
│ │ H 21° L 12°   │                      │
│ └──────────────┘                       │
│    Brightday                           │
│  ▢       ▢       ▢       ▢             │ row 3
│ Pennyroyal Emberly Tidecall Beatwell   │
│                                        │
│            ( wallpaper sun )           │
│ ┌──────────────────────────────────┐   │ panel 316px wide, radius 26
│ │ ICON APPEARANCE                  │   │ bottom = 34 + 92 + 46
│ │ [▢ Light] [▢ Dark] [▢ Tinted]    │   │
│ │ Tint ━━━━━━━●━━━━━ (tinted only) │   │
│ └──────────────────────────────────┘   │
│               • •                      │ bottom = 34 + 92 + 18
│ ╭──────────────────────────────────╮   │ dock 92px, radius 34, inset 12
│ │  ▢       ▢        ▢        ▢     │   │
│ ╰──────────────────────────────────╯   │
│ 34px home clearance                    │
└──────────────────────────────────────┘
```

- The wallpaper is three fixed full-screen layers (light, dark, tint) that cross-fade by opacity.
- `main` holds a visually hidden `h1` "Home screen", the grid, the panel, the dots and the dock.
- The grid is a CSS grid: `grid-template-columns: repeat(4, 62px)`, `justify-content: space-between`, `grid-auto-rows: 92px`, `row-gap: 4px`. The widget box spans columns 1–2 and rows 1–2.
- The widget is a `div role="img"` with a full sentence `aria-label`; its label "Brightday" sits below it.
- Each icon is a `button` with `aria-label` set to the app name; the SVG is `aria-hidden`.
- The panel is a `role="group"` labelled by its `h2`; the options are `role="radio"` inside a `role="radiogroup"`.
- The dock is a `nav aria-label="Dock"`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Icon colours | appearance change | --b, --g, --a (registered colours) | old → new | 500ms, delay index × 28ms | std | instant |
| Wallpaper | appearance change | opacity of three layers | 0 ↔ 1 | 600ms | std | instant |
| Widget, dock | appearance change | background, colour, border | old → new | 500ms | linear | instant |
| Tint row | Tinted on/off | grid-template-rows | 0fr ↔ 1fr | 350ms | iOS sheet | instant |
| Icon press | pointer down | transform | 1 → .88 | 120ms | iOS sheet | none |
| Icon release | pointer up | transform | .88 → 1 | 350ms | iOS sheet | none |
| Hue slider | input | --h | live | none | none | same |

The ripple comes from `transition-delay: calc(var(--i) * 28ms)` with `--i` set 1–12 in reading order (grid, then dock).

## States

- Option checked: 18% white fill and a 1px 30% white inset ring, `aria-checked="true"`, `tabindex="0"`. Unchecked: no fill, `tabindex="-1"`.
- Icon pressed: 88% scale. There is no hover state on a phone.
- Focus-visible: 2px white outline, 3px offset, 16px radius, on icons, options and the slider.
- Light: colourful plates, warm dusk wallpaper, frosted white widget and dock with dark widget ink.
- Dark: `#1c1c1f` plates with brand-colour glyphs, night wallpaper with a small moon, smoked widget and dock with light text. The top-light layer drops to 60%.
- Tinted: one hue across plates, glyphs, accents, widget text, wallpaper and the slider thumb.
- Loading, empty, error: not used.

## Accessibility

- Each icon is a button named by its app ("Hearthly"); the visible label is `aria-hidden` to avoid a double read. Dock labels are visually hidden, not removed.
- The widget is one `role="img"` with "Brightday weather: Larkspur Bay, 18 degrees, clear until 9 pm".
- The appearance options follow the radio pattern: `role="radiogroup"` with `aria-label="Appearance"`, roving `tabindex`, Arrow keys select and move focus, wrapping at both ends.
- The slider is a native `input type="range"` with `aria-label="Tint hue"` and a visible "Tint" label.
- A polite live region announces "Light icons", "Dark icons", "Tinted icons".
- Hit targets: icons 62px, options at least 44px tall, slider 44px tall.
- Labels are white with a text shadow on every wallpaper. Check the lightest point of the light wallpaper (`#f6dcae`) at the top rows: the shadow carries the contrast there. If a product wallpaper is lighter, raise the shadow to 50%.

## Responsive rules

- 390 wide is the design. Grid is 4 × 62px with space-between inside 27px side padding.
- At 360 and below: icon 58px, side padding 22px, panel 296px. Four columns stay.
- At tablet width do not stretch the phone grid. A tablet home screen has 6 columns with 76px icons; rebuild the grid rather than scaling this one.
- Keep 66px top clearance and 34px home clearance. Do not draw the status bar, notch or home indicator.
- Never drop below four columns; drop the widget to 2×1 first.

## Acceptance checklist

### Always

- [ ] The set has 8–12 icons that share one construction: squircle clip, flat plate, top-light gradient, rim stroke, glyph shadow.
- [ ] Each icon has one idea and no words or letters.
- [ ] Each icon defines plate, glyph and accent colours, plus dark glyph and dark accent.
- [ ] Light, Dark and Tinted are offered as a radio group and recolour every icon, the wallpaper, widget and dock.
- [ ] Tinted exposes a hue control and every element follows it live.
- [ ] Colours cross-fade with a short per-icon delay; reduced motion switches instantly.
- [ ] Icons are 62px in a four-column grid with 92px rows; the dock is glass, 92px tall, 34px above the bottom.
- [ ] Icons are buttons with names; the radio group works with Arrow keys.
- [ ] No status bar is drawn.

### This demo

- [ ] Twelve apps: Brightday, Waymark, Fernbook, Hearthly, Pennyroyal, Emberly, Tidecall, Beatwell in the grid; Postling, Snapjar, Jotwell, Wavelet in the dock.
- [ ] The widget reads Larkspur Bay, 18°, Clear until 9 pm, H 21° L 12°.
- [ ] The tint slider starts at hue 28; at 200 the set turns ice blue.
- [ ] Dark plate is `#1c1c1f`; the light wallpaper runs `#f6dcae` → `#e8b26a` → `#d98f58` with teal hills.
- [ ] Previews in the panel use the Hearthly icon.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 390×844: the screen starts 66px from the top (the Lounge draws the status bar). A 2×2 weather widget sits top-left; eight icons fill the rest of three rows; the wallpaper sun sits in the empty middle; the appearance panel, two page dots and the dock sit at the bottom.
2. Grid icons, in order: Brightday (weather), Waymark (maps), Fernbook (plant journal), Hearthly (recipes), Pennyroyal (money), Emberly (focus timer), Tidecall (tides), Beatwell (metronome). Dock: Postling (mail), Snapjar (camera), Jotwell (notes), Wavelet (radio). Twelve icons in total.
3. Every icon is 62px with an 11.5px label 6px under it. Dock icons have no visible label.
4. The appearance panel has three radio options, each with a 40px preview of the Hearthly icon in that appearance. Light starts checked.
5. Choosing Dark: plates become `#1c1c1f`, glyphs take each app's bright colour, the wallpaper cross-fades to night, the widget and dock darken. Each icon's colour change is delayed 28ms more than the previous one, so the switch ripples across the grid.
6. Choosing Tinted: plates become a very dark version of the tint hue, glyphs a light version, accents a mid version. The wallpaper fades to a tinted night. The panel grows to reveal a "Tint" hue slider (0–360, starts at 28).
7. Dragging the slider recolours icons, widget, wallpaper and the slider thumb live.
8. The radio group is keyboard operable: Arrow keys move and select with wrap-around; only the checked option is in the tab order.
9. Pressing any icon shrinks it to 88% in 120ms and springs back in 350ms on release.
10. Reduced motion: appearances switch instantly, no ripple, no press spring, no panel growth animation.

## Tokens

```css
@property --b { syntax: "<color>"; inherits: true; initial-value: #000; }
@property --g { syntax: "<color>"; inherits: true; initial-value: #fff; }
@property --a { syntax: "<color>"; inherits: true; initial-value: #888; }
:root {
  /* appearance */
  --h: 28;                 /* tint hue, 0–360 */
  --plate-d: #1c1c1f;      /* dark appearance plate */
  /* wallpaper, light */
  --sky-1: #f6dcae; --sky-2: #e8b26a; --sky-3: #d98f58;
  --hill-1: #2a5a55; --hill-2: #3e7c74; --hill-3: #1e4642; --sun: #fff3cf;
  /* wallpaper, dark */
  --night-1: #111a20; --night-2: #1c2f33; --night-hill: #0d2220; --moon: #dce6e0;
  /* glass */
  --glass-light: rgba(255,255,255,.24); --glass-dark: rgba(20,22,24,.5);
  --panel: rgba(28,26,24,.42); --dock-light: rgba(255,255,255,.22); --dock-dark: rgba(30,30,32,.4);
  /* text */
  --ink: #ffffff; --widget-ink: #2b1d10; --focus: #ffffff;
  /* type */
  --sans: "Albert Sans", system-ui, sans-serif;
  --serif: "Fraunces", Georgia, serif;
  /* layout */
  --icon: 62px; --row: 92px; --side: 27px; --top: 66px; --home: 34px; --dock-h: 92px;
  /* shape */
  --r-widget: 24px; --r-panel: 26px; --r-dock: 34px; --r-option: 16px;
  /* motion */
  --spring: cubic-bezier(.32,.72,0,1);
  --std: cubic-bezier(.2,.7,.2,1);
  --t-colour: 500ms; --t-ripple: 28ms; --t-wall: 600ms; --t-press: 120ms; --t-release: 350ms;
}
```

The twelve icons, each as plate / glyph / accent in light, then glyph / accent in dark:

| App | Glyph | Light plate | Light glyph | Light accent | Dark glyph | Dark accent |
| --- | --- | --- | --- | --- | --- | --- |
| Brightday | sun behind cloud | #4ba3e3 | #ffffff | #ffc93c | #8fcbff | #ffc93c |
| Waymark | map pin | #2fa36b | #ffffff | #1e6b45 | #4fd08f | #1c1c1f |
| Fernbook | fern frond | #6e8b3d | #f3f7e4 | #f3f7e4 | #a9d46a | #a9d46a |
| Hearthly | pot with steam | #e4572e | #fff3e8 | #8c2a12 | #ff7a50 | #a8361a |
| Pennyroyal | coin with star | #e8b23a | #fff6da | #b57a10 | #f4c552 | #8a5c0c |
| Emberly | flame | #2b1b17 | #ff7a3d | #ffd166 | #ff7a3d | #ffd166 |
| Tidecall | moon over waves | #1f4e79 | #cfe8ff | #ffe7a3 | #6cb4f5 | #ffe7a3 |
| Beatwell | metronome | #f2ede4 | #2b2724 | #3e7c74 | #f2ede4 | #3e9c90 |
| Postling | envelope | #3e7c74 | #ffffff | #3e7c74 | #6fd1c2 | #1c1c1f |
| Snapjar | camera | #e9e6df | #2a2a2c | #24425e | #d8d4cc | #3d6e9e |
| Jotwell | folded note | #ffd45c | #ffffff | #d9a21c | #ffd45c | #6b5212 |
| Wavelet | radio waves | #d6336c | #ffffff | #ffffff | #ff6b9a | #ff6b9a |

Tinted, for every icon: plate `hsl(var(--h) 24% 13%)`, glyph `hsl(var(--h) 85% 76%)`, accent `hsl(var(--h) 45% 44%)`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| App label | Albert Sans | 11.5px | 500 | 1.4 | 0.01em | white, `text-shadow: 0 1px 3px rgba(0,0,0,.35)` |
| Widget city | Albert Sans | 13px | 600 | 1.4 | 0 | widget ink |
| Widget temperature | Fraunces | 46px | 500 | 1 | -0.03em | optical size high |
| Widget sky line | Albert Sans | 12px | 500 | 1.4 | 0 | 85% opacity |
| Widget high/low | Albert Sans | 12px | 600 | 1.4 | 0 | |
| Panel heading | Albert Sans | 12px | 600 | 1 | 0.04em | uppercase, 80% opacity |
| Option label | Albert Sans | 13px | 600 | 1 | 0 | |
| Slider label | Albert Sans | 12px | 600 | 1 | 0 | |

Fraunces appears once, for the temperature. Everything else is Albert Sans, which stands in for the system face.

## Implementation notes

**1. Register the three colour roles so they animate.** Without `@property`, custom properties swap instantly. With it, a single rule per appearance gives a smooth cross-fade, and the stagger is a delay.

```css
@property --b { syntax: "<color>"; inherits: true; initial-value: #000; }
@property --g { syntax: "<color>"; inherits: true; initial-value: #fff; }
@property --a { syntax: "<color>"; inherits: true; initial-value: #888; }
.ic { --b: var(--lb); --g: var(--lg); --a: var(--la);
  transition: --b .5s var(--std), --g .5s var(--std), --a .5s var(--std);
  transition-delay: calc(var(--i, 0) * 28ms); }
[data-mode=dark]   .ic { --b: var(--plate-d); --g: var(--dg); --a: var(--da); }
[data-mode=tinted] .ic { --b: hsl(var(--h) 24% 13%); --g: hsl(var(--h) 85% 76%); --a: hsl(var(--h) 45% 44%); }
.ic .bg { fill: var(--b); }  .ic .gl { fill: var(--g); }  .ic .gl .a { fill: var(--a); }
.ic .gl .s { fill: none; stroke: var(--g); stroke-width: 6; stroke-linecap: round; }
```

Each icon element carries its own `--lb --lg --la --dg --da` inline. The previews inside the panel need higher-specificity overrides (`.mini[data-mode=dark] .ic`) so they show their own appearance whatever the page is in.

**2. Keep gradients shared.** Because the plate is a flat `fill: var(--b)` and the lighting is a separate shared gradient rect on top, there is one `#lit` and one `#rim` for all twelve icons and the three panel previews. Gradients with `var()` stops would need a unique id per icon and still inherit from where they are defined, not where they are used.

```html
<svg class="ic" viewBox="0 0 100 100" style="--lb:#e4572e;--lg:#fff3e8;--la:#8c2a12;--dg:#ff7a50;--da:#a8361a;--i:4">
  <g clip-path="url(#sq)">
    <rect class="bg" width="100" height="100"/>
    <rect class="lit" width="100" height="100" fill="url(#lit)"/>
    <g class="gl" filter="url(#gs)">
      <path d="M27 49h46v9a18 18 0 0 1-18 18H45a18 18 0 0 1-18-18z"/>
      <rect class="a" x="22" y="44" width="56" height="7" rx="3.5"/>
      <path class="s" style="stroke-width:4" d="M43 36q-4-5 0-10M57 36q-4-5 0-10"/>
    </g>
    <path d="M31 0H69C92 0 100 8 100 31V69C100 92 92 100 69 100H31C8 100 0 92 0 69V31C0 8 8 0 31 0Z"
          fill="none" stroke="url(#rim)" stroke-width="1.6"/>
  </g>
</svg>
```

**3. The panel grows with a grid row, not a height.** Animating `height: auto` does not work; `grid-template-rows: 0fr → 1fr` does.

```css
.tint { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s var(--spring); }
[data-mode=tinted] .tint { grid-template-rows: 1fr; }
.tint > div { overflow: hidden; }
```

Rules the set follows, so new icons fit it:

1. Canvas 100 units; the glyph lives inside the central 56–60 units and never touches the edge.
2. One glyph plus at most one accent detail.
3. Light from the top: the shared gradient adds 34% white at the top and 22% black at the bottom.
4. Rim: white 70% at the top edge fading out by 30%, black 20% at the bottom.
5. Glyph shadow: 2.2 units down, 1.8 blur, 26% black.
6. Strokes are round-capped, 4–6 units, never thinner (they vanish at 29px).
7. Plates are saturated mid-tones; avoid pure white plates except one neutral (Beatwell, Snapjar).
8. Dark glyph colours are the brand colour lifted to stay readable on `#1c1c1f`.

Common mistakes:

- Making Dark an inversion of Light. Dark keeps the brand colour in the glyph and darkens only the plate.
- Tinted that only shifts hue. Tinted is monochrome: one hue, three lightness steps.
- Leaving the wallpaper unchanged when the icons go dark.
- Mixing icon styles in the set (one flat, one glossy, one 3D). The set is one recipe.
- Drawing the time, battery or notch.
- A segmented control with `aria-pressed` for appearance. It is a single choice; use radios.

Rebuild order:

1. Wallpaper layers and the screen padding.
2. Shared `defs`, the glyph map and the `icon()` function.
3. Grid with widget, eight icons, then the dock with four.
4. Appearance panel, radio behaviour and live region.
5. The `@property` colour roles and the three appearance rules.
6. Tint slider and the growing row.
7. Press spring and the reduced-motion block.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
