<!-- Design Lounge Nº 221 · "M3 navigation bar" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# M3 navigation bar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map the tonal roles onto the kit tokens. This is the Android counterpart of `phone-tab-plain` and `ios-glass-tab-bar`. Use it when the product is in the Material 3 Expressive language.

## What it is

The bottom navigation bar of Tidepool, a fictional sea swimming app, on Android. It is drawn in Material 3 Expressive. Every colour comes from one teal seed, `#006A63`, as tonal roles. The bar is an 80px flat strip in `--surface-c` with four destinations: Today, Tides, Saved, Inbox. A 56px FAB, Log a swim, floats 16px above the bar on the right.

The active destination has a 64x32 pill in `--secondary-c` behind its icon. The pill stretches in from the centre. The active icon fills. Labels are always shown. Tides has a 6px red dot. Inbox has a red 16px badge reading 12.

Above the bar is just enough screen to show the point. A huge 88px title names the destination. A tonal card holds one figure. Tapping a destination changes the title, the page tint and the card tint. The page is never white. It is the tonal colour of the destination.

The detail worth copying is the pill. It grows from 32% width to full width over 400ms on the emphasized decelerate curve, while the icon fill fades in over 200ms. The title arrives at the same moment, from wide and thin to narrower and heavy, using Roboto Flex's width and weight axes.

This piece is the Android version of the phone tab bar. `phone-tab-plain` is the flat iOS-style bar for paper and quiet families. `ios-glass-tab-bar` is the iOS 26 glass bar. Pick one of the three per product. Never put two on one screen.

## Reference behaviour

1. Initial state: Today is current with `aria-current="page"`. Its pill is visible, its sun icon is filled, its label is weight 760. The page is `#ddf5ef`. The title reads Today in `#006a63`. The card is `#9ef2e6` and reads "Water temperature, 17°, Good for a 40 minute swim".
2. Tides shows a 6px dot. Inbox shows "12". The FAB sits at right 16px, 16px above the bar.
3. Tap Tides. On the old destination the pill shrinks to 32% and fades out in 120ms. On Tides the pill grows from `scaleX(.32)` to `scaleX(1)` over 400ms, and fades in over 120ms. The drop icon fills over 200ms. The label goes from 500 to 760.
4. At the same time the page fades to `#e4f0fa` and the card to `#cde5ff` over 500ms. The title becomes Tides in `#33618d` and plays the title entrance. The card plays its corner swap.
5. Visiting Tides clears its dot. The dot scales to 0 over 200ms and does not come back.
6. Tapping Inbox does not clear the 12. Reading messages clears it, not visiting.
7. Tapping the current destination does nothing. No replay.
8. Hover shows an 8% `--on-surface` layer on the 64x32 area. Press shows 12%.
9. Press the FAB. Its radius goes from 16px to 28px and it scales to 0.94 over 200ms, then springs back on release.
10. The four views:
    - Today: page `#ddf5ef`, card `#9ef2e6`, title `#006a63`, "17°".
    - Tides: page `#e4f0fa`, card `#cde5ff`, title `#33618d`, "2.4 m".
    - Saved: page `#e6f2ef`, card `#cce8e3`, title `#4a6360`, "Harbour Steps" at 40px.
    - Inbox: page `#eef1ef`, card `#dde4e1`, title `#161d1b`, "06:30".

## Structure

```
390 x 844
+--------------------------------------+
| top clearance 70px                   |
| Kettle Cove · Saturday 3 October 14px|
| Today                     88px / .92 |
| High water at 14:12. Calm... 18/26   |
|                                      |
| +----------------------------------+ |
| | Water temperature                | |  card 272px min
| |                                  | |  radius 48 48 48 12
| | 17°                         80px | |
| | Good for a 40 minute swim        | |
| +----------------------------------+ |
|                              +----+  |
|                              | +  |  |  FAB 56px, r16
|                              +----+  |  16px gap
+--------------------------------------+
|  (=sun=)   (drop).   (mark)  (msg)12 |  nav 80px, surface-c
|   Today     Tides    Saved   Inbox   |  pill 64x32 at top 12px
|          34px gesture clearance      |
+--------------------------------------+
```

- The bar is a `nav` labelled "Main" with four `button`s. In a routed app use links with `aria-current="page"`.
- Each destination is a column: a 64x32 icon box at 12px from the top, a 4px gap, a 16px label. The whole quarter-width, 80px-tall column is the target.
- The icon box holds three layers: the pill (`.ind`), a state layer (`::after`), and the 24px SVG. Badges sit on top of all three.
- The FAB is a `button` with `aria-label="Log a swim"`, fixed, right 16px, bottom `80px + 34px + 16px`.
- The title is the only `h1`. The card is a `section` with a polite live region so the new figure is read.

## Tokens

```css
:root {
  /* tonal roles, seed #006A63, light scheme */
  --primary: #006a63;
  --on-primary: #ffffff;
  --primary-c: #9ef2e6;       /* FAB */
  --on-primary-c: #00201d;
  --secondary-c: #cce8e3;     /* active pill */
  --on-secondary-c: #051f1c;  /* active icon */
  --surface: #f4fbf8;
  --surface-c: #e9efec;       /* the bar */
  --on-surface: #161d1b;      /* active label, state layer */
  --on-surface-v: #3f4946;    /* inactive icon and label */
  --error: #ba1a1a;           /* badges */
  --on-error: #ffffff;

  /* per destination, set from JS */
  --page: #ddf5ef;
  --card: #9ef2e6;
  --on-card: #00201d;
  --title: #006a63;

  /* type */
  --font: "Roboto Flex", "Google Sans", "Roboto", system-ui, sans-serif;

  /* shape */
  --r-pill: 16px;             /* 64x32 indicator */
  --r-fab: 16px;
  --r-fab-pressed: 28px;
  --r-card: 48px 48px 48px 12px;
  --r-badge: 8px;

  /* size */
  --bar-h: 80px;
  --gesture: 34px;
  --ind-w: 64px;
  --ind-h: 32px;
  --icon: 24px;

  /* motion */
  --emph: cubic-bezier(.2, 0, 0, 1);        /* emphasized */
  --emph-d: cubic-bezier(.05, .7, .1, 1);   /* emphasized decelerate, entering */
  --emph-a: cubic-bezier(.3, 0, .8, .15);   /* emphasized accelerate, leaving */
  --t-pill: 400ms;
  --t-fill: 200ms;
  --t-tone: 500ms;
}
```

The Google Fonts link loads Roboto Flex with `opsz 8..144`, `wdth 25..151`, `wght 300..900`. If it fails, Google Sans or Roboto take over. The axes then do nothing, which is fine.

## Typography

| Role | Size / line | wdth | wght | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Eyebrow | 14 / 21 | 100 | 500 | 0.01em | `--on-surface-v` |
| Title | 88 / 0.92 | 118 | 780 | -0.035em | `--title` |
| Supporting line | 18 / 26 | 100 | 420 | 0 | `--on-surface-v`, max 28ch |
| Card label | 14 | 100 | 500 | 0.02em | `--on-card` |
| Card figure | 80 / 1, or 40 when longer than 6 chars | 100 | 300 | -0.03em | `--on-card`, tabular |
| Card note | 16 | 100 | 500 | 0 | `--on-card` |
| Nav label | 12 / 16 | 100 | 500, active 760 | 0.04em | inactive `--on-surface-v`, active `--on-surface` |
| Badge | 11 / 16 | 100 | 600 | 0 | `--on-error` |

Set `opsz` to 144 on the title and the figure. The title is the expressive moment. The bar text stays small and plain.

## Motion

| Thing | Trigger | Property | From to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Pill in | becomes current | transform, opacity | `scaleX(.32)` 0 to `scaleX(1)` 1 | 400ms, opacity 120ms | `--emph-d`, opacity linear | instant |
| Pill out | loses current | transform, opacity | reverse | 400ms, opacity 120ms | `--emph-d` | instant |
| Icon fill | becomes current | fill-opacity | 0 to 1 | 200ms | `--emph` | instant |
| Label weight | becomes current | `wght` | 500 to 760 | 200ms | `--emph` | instant |
| Page tint | destination change | background-color | old to new | 500ms | `--emph` | instant |
| Card tint | destination change | background-color | old to new | 500ms | `--emph` | instant |
| Title entrance | destination change | opacity, translateY, wdth, wght | 0, 28px, 151, 320 to 1, 0, 118, 780 | 500ms | `--emph` | instant |
| Card corner swap | destination change | border-radius, scale | `12 48 48 48`, .96 to `48 48 48 12`, 1 | 500ms | `--emph` | instant |
| Tides dot | first visit | scale | 1 to 0 | 200ms | `--emph` | instant |
| State layer | hover, press | opacity | 0 to .08, .12 | 120ms | linear | keep |
| FAB press | pointer down | radius, scale | 16px 1 to 28px .94 | 200ms | `--emph` | instant |

The pill grows from its own centre. Do not slide one pill between destinations. In Material 3 each destination owns its pill.

## States

- Destination inactive: icon outline in `--on-surface-v`, no pill, label 500.
- Destination current: pill `--secondary-c`, icon filled in `--on-secondary-c`, label 760 in `--on-surface`, `aria-current="page"`.
- Hover: 8% `--on-surface` layer on the 64x32 box only, not the whole column.
- Pressed: 12% layer.
- Focus-visible: 3px `--primary` outline, offset 2px, drawn around the pill box, not the whole column.
- Small badge: 6px dot, `--error`, at 38px from the left of the icon box and 4px from its top.
- Large badge: 16px tall, at least 16px wide, 4px side padding, 8px radius, at left 34px and top 1px of the icon box. Numbers over 999 show "999+".
- Badge cleared: scale 0, then keep it hidden.
- FAB resting: `--primary-c`, 16px radius, level 3 shadow. FAB pressed: 28px radius, scale .94.
- Disabled: not used. Every destination is available.
- Loading: not used on the bar. The screen content loads; the bar stays.

## Accessibility

- `nav` with `aria-label="Main"`. Four buttons in reading order. The current one has `aria-current="page"`.
- Labels are always visible. Do not hide inactive labels. The visible word is the name.
- Badges are part of the name, not separate elements for screen readers. Tides is labelled "Tides, new data" until the dot clears. Inbox is "Inbox, 12 unread". The badge spans are `aria-hidden` or inside the button's own label.
- Icons are `aria-hidden`.
- The FAB has `aria-label="Log a swim"`. It comes after the content and before the bar in the DOM, so focus order is content, FAB, then Today to Inbox.
- The card is `aria-live="polite"` so the new figure is read after a change.
- Hit targets: each destination is a quarter of 390px (97.5px) wide and 80px tall. The FAB is 56px. Both clear 48dp.
- Contrast: `#3f4946` on `#e9efec` is 8.3:1. `#051f1c` on `#cce8e3` is over 14:1. White on `#ba1a1a` is 6.5:1.
- The current destination has three signals: the pill, the filled icon and the heavier label. Do not rely on colour alone.

## Responsive rules

- Frame is 390x844. Top clearance 70px for the content. The bar sits on a 34px gesture clearance. On a real Android device with a 24px gesture bar, use `env(safe-area-inset-bottom)` and keep the 80px bar height.
- At 360 wide: four destinations still fit at 90px each. Keep labels on. The title drops to 76px if it would wrap.
- Three to five destinations only. With five, each column is 78px at 390, still above 48dp.
- At 600dp and wider: replace the bar with a navigation rail on the left. Use `m3-navigation-drawer` at 840dp and up. Do not stretch this bar across a tablet.
- Landscape phone: the bar stays at the bottom, 80px tall. Labels stay on.
- Do not draw a status bar, a gesture pill or system buttons. The padding is the clearance.

## Acceptance checklist

### Always

- [ ] One bar, 80px tall, `--surface-c`, no top border and no shadow, above a 34px gesture clearance.
- [ ] Three to five destinations. Each is a full-height column at least 48dp wide.
- [ ] The current destination has a 64x32 pill with a 16px radius behind a 24px icon.
- [ ] The pill grows from `scaleX(.32)` at its own centre. It does not slide between items.
- [ ] Active icon is filled. Inactive icons are outlined.
- [ ] Labels are always visible, 12px, and go heavier when current.
- [ ] Small badge is a 6px dot. Large badge is 16px tall with a number. Both are in the accessible name.
- [ ] One FAB at most, 56px, 16px radius, 16px right and 16px above the bar.
- [ ] Colours are tonal roles from one seed. No extra accent.
- [ ] Reduced motion makes every change instant.

### This demo

- [ ] Destinations are Today, Tides, Saved, Inbox. Today is current first.
- [ ] Seed is `#006a63`. Pill is `#cce8e3`. Bar is `#e9efec`.
- [ ] Tides has a dot that clears on first visit. Inbox shows 12 and keeps it.
- [ ] The title is 88px Roboto Flex at wdth 118, wght 780.
- [ ] The FAB is labelled Log a swim.

## Implementation notes

Each destination owns its pill. Scale it from the centre and fade it fast, so the stretch reads as growth, not a fade:

```css
.ic { position: relative; width: 64px; height: 32px; display: grid; place-items: center; }
.ind {
  position: absolute; inset: 0; border-radius: 16px; background: var(--secondary-c);
  transform: scaleX(.32); opacity: 0;
  transition: transform 400ms cubic-bezier(.05,.7,.1,1), opacity 120ms linear;
}
.dest[aria-current="page"] .ind { transform: none; opacity: 1; }
.ic::after { content: ""; position: absolute; inset: 0; border-radius: 16px;
  background: var(--on-surface); opacity: 0; transition: opacity 120ms linear; }
.dest:hover .ic::after { opacity: .08; }
.dest:active .ic::after { opacity: .12; }
```

Filled versus outlined from one SVG. Draw closed shapes, then fade in the fill:

```css
.ic svg { width: 24px; height: 24px; fill: currentColor; fill-opacity: 0;
  stroke: currentColor; stroke-width: 2; stroke-linejoin: round;
  transition: fill-opacity 200ms var(--emph); }
.dest[aria-current="page"] .ic svg { color: var(--on-secondary-c); fill-opacity: 1; }
```

If the icon set ships separate outlined and filled glyphs, swap them instead. Do not cross-fade two glyphs; that blurs for 200ms.

The title entrance animates the font axes. Restart it by removing the class and forcing a reflow:

```css
@keyframes titleIn {
  from { opacity: 0; transform: translateY(28px);
         font-variation-settings: "wdth" 151, "wght" 320, "opsz" 144; }
  to   { opacity: 1; transform: none;
         font-variation-settings: "wdth" 118, "wght" 780, "opsz" 144; }
}
h1.in { animation: titleIn 500ms cubic-bezier(.2,0,0,1) both; }
```

```js
function replay(el) { el.classList.remove('in'); void el.offsetWidth; el.classList.add('in'); }
```

Set the four per-destination tokens (`--page`, `--card`, `--on-card`, `--title`) on `:root` from a table. Let CSS transitions do the tint.

Common mistakes:

- One shared pill that slides left and right. That is the iOS glass bar. Material 3 grows a pill per item.
- A pill that wraps the icon and the label. The pill is 64x32 around the icon only.
- Hiding labels on inactive items.
- A top border or a shadow on the bar. Material 3 separates it by tone.
- A white page. The page uses the destination's tonal colour.
- Badge numbers in a second colour. Badges are `--error` only.
- The FAB centred or docked into a notch. This is the Material 3 position: right, above the bar.
- Using `ease` or `linear` for the pill. Use emphasized decelerate.
- A status bar drawn at the top.
- Mixing this bar with an iOS tab bar in one app.

Where it sits:

1. Use this bar for Android or Material 3 products with three to five top-level sections.
2. Use `phone-tab-plain` for flat iOS-style families and `ios-glass-tab-bar` for iOS 26 glass. They are the same job in other languages.
3. Pair the FAB with `m3-fab-menu` when the FAB opens more than one action.
4. Screen bodies come from other pieces, such as `m3-expressive-home`. This piece only owns the bar, the FAB position and the tint switch.

Rebuild order:

1. Tonal roles from the seed, and the four per-destination sets.
2. The fixed bar with four columns and the gesture clearance.
3. Icon box with pill, state layer and SVG. Then the labels.
4. Current state and the pill stretch.
5. Badges, the dot clear, and the accessible names.
6. The FAB position and press.
7. The title, card and tint switch.
8. Reduced motion and a keyboard pass.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
