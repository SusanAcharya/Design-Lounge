---
title: "Desktop app menubar"
summary: "File Edit View Track Window Help for a dark audio workstation: hover-to-switch menus, submenus that flip, checkable and radio items, shortcuts."
platform: web
type: component
category: overlays
tags: [menubar, menu, submenu, desktop, keyboard, shortcuts]
styles: [dark, industrial, minimal]
motion: subtle
difficulty: 3
featured: false
published: 2026-10-03
palette: ["#151619", "#272A30", "#EBE7DF", "#F2A33A", "#E5484D"]
fonts: ["Onest", "Fragment Mono"]
related: [nested-dropdown-menu, dropdown-kebab-actions, dropdown-filter-sort]
---

# Desktop app menubar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, keep the amber-fill highlight idea but use the kit's primary and its on-primary ink.

## What it is

The in-window menubar of Tapehouse, a desktop audio workstation (think an Electron or web app that draws its own menus, as on Windows and Linux). Six top-level menus sit in a 36px title bar next to the app mark. Once any menu is open, sliding the pointer along the bar switches menus without clicking, the way native menubars behave. Menus hold plain commands with mono shortcuts, checkable items with an amber tick, a radio group with a dot, separators, and submenus that open to the right and flip left at the edge. The View menu really drives the app behind it: Mixer, Waveforms, Snap and Zoom change the arrangement. The highlighted item is a solid amber bar with near-black text, which is the detail that gives it a hardware feel.

## Reference behaviour

1. First frame: File is open (title amber), Open Recent is highlighted and its submenu is open to the right, listing Harbour Lights · mix v3, Basement Takes 0912, Choir Rehearsal, September, a separator, and Clear Menu. Focus is on Open Recent.
2. Pointer on the bar: pressing a closed title opens its menu with focus left on the title. Pressing an open title closes it. While any menu is open, hovering another title opens that one instead (no click).
3. Pointer in a menu: hovering an item focuses it (one highlight for mouse and keyboard). Hovering an item with a submenu opens it after 120ms. Hovering a plain item closes deeper submenus after 120ms. Moving into an open submenu keeps it open. Clicking an item with a submenu opens it immediately.
4. Keyboard on the bar: the bar is one tab stop (roving tabindex). ArrowLeft/Right move between titles and wrap; Home/End jump. If a menu is open, moving also switches the open menu. ArrowDown, Enter or Space opens and focuses the first item; ArrowUp opens on the last item. Escape closes. A letter jumps to the title starting with it. F10 anywhere focuses the bar.
5. Keyboard in a menu: ArrowUp/Down wrap; Home/PageUp and End/PageDown jump; typeahead with a 500ms buffer (any non-character key clears it). ArrowRight on a submenu item opens it and focuses its first item; ArrowRight on a plain item opens the next top-level menu on its first item. ArrowLeft in a submenu closes it and focuses its parent item; ArrowLeft in a top-level menu opens the previous top-level menu. Escape closes one level and returns focus to that level's trigger. Tab closes everything, focuses the bar title, and lets Tab carry on.
6. Enter/Space on a command: the menu blinks once (140ms, two steps), closes, focus returns to the bar title, and the status bar reads "File › Save".
7. Enter/Space on a checkbox or radio toggles it and keeps the menu open, so several view options can be set in one visit. The status bar announces the change ("Waveforms hidden", "Snap to Bar").
8. Disabled items (Redo) stay reachable, render `#6b6862`, and say "Nothing to redo" when activated.
9. View effects: Mixer shows a 132px mixer strip under the lanes. Waveforms hides the clip waveforms. Follow Playhead updates the status bar. Snap to Bar/Beat/Off updates the status bar. Zoom In/Out step the bar width by 25% between 50% and 200%, Fit Session resets to 100%; clips and the playhead slide to their new positions in 240ms.
10. Track › Arm for Recording toggles the red R on Lead Vocal.
11. Placement: a top-level menu hangs 4px under its title, left-aligned to it, clamped 6px inside the viewport. A submenu opens at the parent menu's right edge minus 3px, its first item level with the parent item (top minus 6px). If it would cross the right edge it opens on the left of the parent; if neither side fits it drops under the parent item, indented 16px. Heights are clamped 6px from the bottom. Clicking outside or resizing closes all menus.

## Structure

```
1280 × 800, body bg #151619, column flex
┌ title bar 36px ─────────────────────────────────────────────────────────────┐
│ [■] File Edit View Track Window Help            Harbour Lights · mix v3 · 48 kHz│
├ transport 52px ─────────────────────────────────────────────────────────────┤
│ [|◀] [▶] [●]  005.3.01 00:09.412   Tempo 124.00  Time 4/4  Key D min  CPU 18% │
├ heads 208px ┬ lanes (ruler 28px, 72px per track, 64px per bar) ──────────────┤
│ Lead Vocal  │ ▓▓Verse take 4▓▓   ▓▓Chorus comp▓▓▓   ▓Verse 2▓        │amber playhead
│ Room Guitar │ ▓▓▓▓Strum, capo 3▓▓▓▓▓▓  ▓▓▓Bridge picking▓▓▓        │at bar 5.3
│ Bass DI     │ ▓▓▓▓▓▓▓▓▓▓Bass, whole song▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓        │
│ Drums OH    │ ▓Intro brushes▓ ▓▓▓▓▓▓▓Main groove▓▓▓▓▓▓▓▓▓        │
│ Wurli       │       ▓Pad▓            ▓Chorus swell▓  ▓Outro▓       │
├ mixer 132px (hidden until View › Mixer) ────────────────────────────────────┤
├ status 26px: Snap Beat  Zoom 100%  Follow On ··········· (live status text) ┤
└─────────────────────────────────────────────────────────────────────────────┘

File menu (min 248px)            Open Recent submenu
┌──────────────────────────┐ ┌─────────────────────────────┐
│   New Session        ⌘N  │ │   Harbour Lights · mix v3   │
│   Open…              ⌘O  │ │   Basement Takes 0912       │
│ ▌ Open Recent          › ▐─┤   Choir Rehearsal, September│
│ ──────────────────────── │ │ ─────────────────────────── │
│   Save               ⌘S  │ │   Clear Menu                │
│   Save As…          ⇧⌘S  │ └─────────────────────────────┘
│   Bounce to Disk…    ⌘B  │
│   Export               › │
│ ──────────────────────── │
│   Close Session      ⌘W  │
└──────────────────────────┘
```

- Bar: `<div role="menubar" aria-label="Tapehouse">` holding six `role="menuitem"` titles with `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`.
- Each menu: `role="menu"`, `aria-labelledby` its title (top level) or `aria-label` its parent item's name (submenus). All menus are `position: fixed` siblings at body level, not nested in the DOM, so no ancestor clips them.
- Items: a 4-column grid `18px 1fr auto 14px`: check/dot gutter, label, shortcut `<kbd aria-hidden>`, chevron. Plain = `menuitem`; toggles = `menuitemcheckbox` with `aria-checked`; Snap and Sessions = `menuitemradio` inside `role="group" aria-label="Snap to"`. Submenu parents add `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`.
- Shortcuts are also exposed as `aria-keyshortcuts` ("Meta+S", "Shift+Meta+S").
- Status: `role="status" aria-live="polite"` at the right of the status bar.

Menu contents:

- File: New Session ⌘N, Open… ⌘O, Open Recent ›, —, Save ⌘S, Save As… ⇧⌘S, Bounce to Disk… ⌘B, Export › (Mixdown as WAV, 24-bit; Mixdown as FLAC; Stems… ⌥⌘E; —; Session Notes as PDF), —, Close Session ⌘W.
- Edit: Undo Move Clip ⌘Z, Redo ⇧⌘Z (disabled), —, Cut ⌘X, Copy ⌘C, Paste ⌘V, Duplicate ⌘D, —, Split at Playhead S, Select All ⌘A.
- View: Mixer ⌘2 ☐, Waveforms ⌥W ☑, Automation Lanes A ☐, Follow Playhead F ☑, —, Snap to: Bar / Beat ● / Off, —, Zoom › (Zoom In ⌘=, Zoom Out ⌘−, Fit Session ⌥Z).
- Track: New Audio Track ⌥⌘N, New Instrument Track, Duplicate Track, —, Arm for Recording R ☑, Freeze Track, —, Delete Track ⌘⌫ (danger ink).
- Window: Minimise ⌘M, Bring All to Front, —, Sessions: Harbour Lights · mix v3 ● / Basement Takes 0912.
- Help: Tapehouse Guide, Keyboard Shortcuts ⌘/, Release Notes 4.2.

## Tokens

```css
:root {
  --bg: #151619;        /* app body, transport */
  --surface: #1d1f23;   /* title bar, track heads, status bar */
  --raised: #25282d;    /* title hover, fader track */
  --menu: #272a30;      /* menu surface */
  --menu-border: #3d4048;
  --line: #33363d;      /* region rules, separators */
  --line-2: #2a2d33;    /* lane rules, bar grid */
  --ink: #ebe7df;
  --ink-2: #b1ada4;     /* idle titles */
  --ink-3: #9c988f;     /* shortcuts, chevrons, group labels */
  --ink-disabled: #6b6862;
  --amber: #f2a33a;     /* highlight fill, ticks, timecode, playhead */
  --on-amber: #1d1406;  /* text on the amber fill */
  --amber-trail: #4a3a22; /* parent item while its submenu has focus */
  --rec: #e5484d;
  --danger-ink: #ff8a8d;

  --sans: "Onest", system-ui, sans-serif;
  --mono: "Fragment Mono", ui-monospace, monospace;

  --title-h: 26px; --item-h: 28px; --menu-pad: 5px; --menu-min: 248px;
  --r-menu: 8px; --r-item: 5px;
  --shadow-menu: inset 0 1px 0 rgba(255,255,255,.04), 0 18px 40px -8px rgba(0,0,0,.6), 0 4px 10px rgba(0,0,0,.3);
  --bar: 64px;          /* one bar at 100% zoom */
  --ease: cubic-bezier(.2,.7,.2,1);
  --hover-intent: 120ms;
}
```

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Menubar title | Onest | 13px | 500 | `--ink-2`, open: `--on-amber` |
| Menu item | Onest | 13px | 400 | `--ink`, highlighted: `--on-amber` |
| Group label (SNAP TO) | Onest | 11px | 400, uppercase, 0.04em | `--ink-3` |
| Shortcut | Fragment Mono | 11px | 400 | `--ink-3`, highlighted: `--on-amber` |
| Timecode | Fragment Mono | 22px | 400, 0.02em, tabular | `--amber` |
| Track name | Onest | 13px | 600 | `--ink` |
| Status bar | Onest | 11.5px | 400 / 500 values | `--ink-3` / `--ink-2` |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Menu open/close | any | none | appears in one frame | 0 | — |
| Submenu hover | pointer rests on parent | open | after delay | 120ms delay | — |
| Command confirm | Enter/click on command | opacity | 1 → .6 → 1 | 140ms | `steps(2)` |
| Zoom | View › Zoom | clip `left`/`width`, playhead `left` | old → new | 240ms | `--ease` |

Desktop menus do not fade or scale; they must feel instant when the pointer sweeps across the bar. The single blink on activation is the native confirmation. Reduced motion: no blink (the menu closes immediately), zoom jumps.

## States

- Title idle: transparent, `--ink-2`. Hover: `--raised`, `--ink`. Open (`aria-expanded="true"`): amber fill, `--on-amber`. Focus-visible: 2px inset amber ring (inset on-amber ring when open).
- Item idle: transparent. Focused or hovered: amber fill, on-amber text, tick and shortcut turn on-amber.
- Submenu parent while focus is inside the submenu: `--amber-trail` fill, `--ink` text, amber chevron. This trail shows the path.
- Checkbox checked: amber tick in the gutter; unchecked: empty gutter (no box).
- Radio checked: 8px amber dot in the gutter.
- Disabled: `--ink-disabled`; focused disabled shows `--raised`, never amber.
- Danger (Delete Track): `--danger-ink` text; turns on-amber when focused like every other item.

## Accessibility

- Roles: `menubar` › `menuitem` (titles) › `menu` › `menuitem` / `menuitemcheckbox` / `menuitemradio`, `separator`, `group`. Every popup trigger has `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`.
- One tab stop for the whole bar. Inside menus only the focused item has `tabindex="0"`.
- Keyboard map exactly as Reference behaviour 4–5, which follows the WAI-ARIA menubar pattern.
- Focus never lands on `body`: closing a level always focuses that level's trigger; activation returns to the bar title.
- Checkbox and radio activations keep the menu open and announce through the status region.
- `aria-keyshortcuts` carries the shortcut; the `<kbd>` glyphs are hidden so the name is just the label.
- Contrast on `--menu`: ink 11.7:1, `--ink-3` 5.0:1, danger ink 6.4:1, on-amber on amber 8.7:1.
- Hit targets: titles 26px tall, items 28px tall and at least 248px wide. This is a desktop pointer UI; do not use it on touch.

## Responsive rules

- ≥1280: as drawn; the session label sits at the right of the title bar.
- 1024: same.
- <720: session label and transport meta hide; track heads shrink to 132px; timecode 18px. The menubar still fits six titles at 375px.
- Narrow viewports: submenus flip left; if left doesn't fit either they drop under the parent item, indented 16px. Menus are clamped 6px from every edge.
- On a phone or tablet the product should switch to a single overflow button that opens a sheet. A menubar is a pointer-and-keyboard control.

## Acceptance checklist

### Always

- [ ] `role="menubar"` with one tab stop; titles are `menuitem` with `aria-haspopup`, `aria-expanded`, `aria-controls`.
- [ ] Hovering a title while any menu is open switches menus without a click.
- [ ] Submenus open after 120ms of hover, immediately on click, ArrowRight, Enter or Space.
- [ ] ArrowRight on a plain item and ArrowLeft in a top menu move to the adjacent top-level menu.
- [ ] Escape closes exactly one level and focuses that level's trigger; Tab closes all.
- [ ] Typeahead works in the bar and in menus; non-character keys clear the buffer.
- [ ] Checkbox and radio items use the right roles, show tick/dot in a fixed gutter, and keep the menu open.
- [ ] Submenus flip left at the right edge and fall back to below the parent when neither side fits.
- [ ] Menus have no open/close animation; activation blinks once (removed under reduced motion).
- [ ] Shortcuts are in `aria-keyshortcuts`, not in the accessible name.

### This demo

- [ ] First frame: File open, Open Recent highlighted with its submenu open.
- [ ] Titles: File, Edit, View, Track, Window, Help.
- [ ] View › Waveforms hides the waveforms; View › Mixer shows the mixer; Snap and Zoom update the status bar.
- [ ] Zoom steps 25% between 50% and 200% and slides clips in 240ms.
- [ ] Redo is disabled; Delete Track is in danger ink.
- [ ] Highlight is `#f2a33a` with `#1d1406` text.

## Implementation notes

**A menu stack, not nested DOM.** Keep `stack = [{menu, trigger}]`. Level 0 is the open top-level menu. `closeFrom(n)` pops everything at depth ≥ n and resets `aria-expanded`. Every key handler asks `levelOf(item)` and acts on that level.

```js
const levelOf = el => stack.findIndex(s => s.menu === el.closest('.menu'));
function closeFrom(level){
  while (stack.length > level){
    const s = stack.pop(); s.menu.hidden = true; s.trigger.setAttribute('aria-expanded','false');
  }
}
function openSub(item, focusFirst){
  closeFrom(levelOf(item) + 1);
  item._sub.hidden = false; item.setAttribute('aria-expanded','true');
  placeSub(item._sub, item); stack.push({ menu: item._sub, trigger: item });
  if (focusFirst) focusIn(item._sub, 0);
}
```

**Hover-to-switch and hover intent.** The bar switches on `pointerover` only when something is open. Inside menus, a 120ms timer decides between opening a submenu and closing deeper ones; re-entering the open submenu's parent cancels it.

```js
bar.addEventListener('pointerover', e => {
  const b = e.target.closest('[role="menuitem"]');
  if (b && stack.length && stack[0].trigger !== b) openTop(tops.indexOf(b), null);
});
menus.addEventListener('pointerover', e => {
  const el = e.target.closest('[role^="menuitem"]'); if (!el) return;
  clearTimeout(hoverT); const lv = levelOf(el); el.focus();
  if (stack[lv + 1]?.trigger === el) return;
  hoverT = setTimeout(() => el._sub ? openSub(el, false) : closeFrom(lv + 1), 120);
});
```

**Submenu placement with two fallbacks.**

```js
let left = parentRect.right - 3, top = itemRect.top - 6;
if (left + w > innerWidth - 6) left = parentRect.left - w + 3;      // flip left
if (left < 6) { left = Math.min(parentRect.left + 16, innerWidth - 6 - w); top = itemRect.bottom + 2; } // drop below
if (top + h > innerHeight - 6) top = Math.max(6, innerHeight - 6 - h);
```

Common mistakes:

- Opening menus on hover when nothing is open. The first open needs a press; only switching is hover.
- Closing the whole menu when a checkbox is toggled.
- Using `mouseenter` on each item and forgetting keyboard focus, so two items look highlighted.
- Rendering submenus inside their parent with `position: absolute`, which gets clipped by the parent's overflow and breaks the flip.
- Fading menus in. A 150ms fade on every title makes sweeping the bar feel laggy.
- Putting "⌘S" in the accessible name.
- Forgetting that ArrowLeft/Right inside a menu move between top-level menus.

Rebuild order:

1. Build the app shell (title bar, transport, lanes, status) so the menus have something to act on.
2. Render menus from data; set every role and ARIA attribute.
3. Implement the stack, `openTop`, `openSub`, `closeFrom`, and placement.
4. Wire keyboard for the bar, then for menus.
5. Wire pointer: press on titles, hover-to-switch, hover intent, outside click.
6. Wire actions: commands, checkboxes, radios, zoom, status announcements.
7. Check 375px submenu fallback and reduced motion.
