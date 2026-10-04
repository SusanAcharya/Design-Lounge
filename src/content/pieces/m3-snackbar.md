---
title: "M3 snackbar with undo"
summary: "One Woldwalk snackbar, Trail archived, with Undo. A second archive replaces it. It sits above the home inset and leaves after 4 seconds."
platform: mobile-app
type: screen
category: feedback
tags: [material, snackbar, android, undo, list]
styles: [material, dark]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-04
palette: ["#13110E", "#E8E1D6", "#E6C176", "#5C4300", "#1C1915"]
fonts: ["Newsreader", "Outfit"]
related: [m3-sign-in, m3-list-detail]
---

# M3 snackbar with undo

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is an Android Material 3 snackbar, one at a time, not a toast stack and not a banner.

## What it is

The saved-trails screen of Woldwalk, an invented walking log, in Material 3 on a dark brass scheme seeded from `#E6C176`. A flat list of trails fills the phone. Archiving a row removes it and shows one snackbar: the words "Trail archived" and an Undo action. The snackbar sits 8px above the 34px home inset, inset 16px from both sides, and leaves after 4 seconds. Undo puts that row back. A second archive while the snackbar is up replaces it: same sentence, new Undo target, timer restarted. Only one snackbar exists. The hero already has one row archived and the snackbar visible, with the rest of the list still on screen. Trail names are Newsreader. UI text, the count, and the snackbar are Outfit.

Language: Material 3 on Android. Dark tonal surfaces, inverse-surface snackbar, 48px targets, text action, ripple on press, M3 type scale. No grouped cards. No bottom navigation bar under the snackbar.

## Reference behaviour

1. **Initial state (hero).** Eight trails are visible. Mill beck is already archived, so it is absent. The count reads "8 trails on this phone". The snackbar is visible and settled (it does not play an enter on first paint): "Trail archived" and Undo. A polite live region has already said "Trail archived. Mill beck can be undone." The 4 second timer starts when the page script runs.
2. **After 4 seconds with no further archive.** The snackbar fades out (200ms) and `visibility` becomes hidden. Mill beck stays archived. The count stays at 8.
3. **Archive.** Each row is a button, min-height 72px, labelled "Archive" plus the trail name. Press collapses that row (height to 0, opacity to 0, 200ms) and then removes it. The snackbar shows for that trail. The count drops by one.
4. **One at a time.** There is a single snackbar node. A second archive does not stack a second bar. If the bar is already visible, it drops out and comes back in, and the 4 second timer restarts from zero. Undo restores only the latest trail. Earlier archives stay archived.
5. **Undo.** Restores the latest trail at its original index, hides the snackbar immediately, focuses that row's button, and announces "{name} restored." The count increments.
6. **Undo after the bar has gone.** Does nothing. The archive has stuck.
7. **Empty.** If every trail is archived and the snackbar has gone, the list hides and a line reads "No trails on this phone."
8. **Order.** Trails keep this order when restored: Harebell ridge, Kiln lane, Mill beck, Gorse common, Chapel stile, Quarry greenway, Reed fen, Beacon clough, Priory lane.

## Structure

```
390 x 844, dark surface
┌────────────────────────────────────┐
│ (54px safe area)                   │
│ Woldwalk                           │ 12/16 primary
│ Saved trails                       │ 22/28 Newsreader
│ 8 trails on this phone             │ 14/20
│ (HR) Harebell ridge          [box] │ 72px row
│      6.4 km, Wold edge             │
│ (KL) Kiln lane               [box] │
│ ... 8 rows, Mill beck missing ...  │
│                                    │
│ ╭────────────────────────────────╮ │ 8px above the 34px inset
│ │ Trail archived           Undo  │ │ min 48px, radius 4
│ ╰────────────────────────────────╯ │ left/right 16
│ (34px home inset)                  │
└────────────────────────────────────┘
```

- `header.bar`: brand, `h1`, and `#count` with `aria-live="polite"`.
- `ul.list` of `li` rows. Each row is one `button.row` containing a 40px monogram, the name, the supporting line, and an archive icon (`aria-hidden`).
- The snackbar is a `div.snack` outside the scroller, `position: fixed`. The visible sentence is a `p`. Undo is a `button`. A separate visually hidden `p` with `role="status"` carries the announcement, so the visible string stays exactly "Trail archived" while the name still gets announced.
- `#empty` is a `p`, hidden while any trail is visible.

Trails, in order. Mill beck starts archived.

| Id | Name | Distance | Place | Monogram |
| --- | --- | --- | --- | --- |
| harebell | Harebell ridge | 6.4 km | Wold edge | HR |
| kiln | Kiln lane | 3.1 km | Clay pits | KL |
| mill | Mill beck | 8.2 km | North wold | MB |
| gorse | Gorse common | 4.6 km | Open grass | GC |
| chapel | Chapel stile | 2.4 km | Village edge | CS |
| quarry | Quarry greenway | 5.8 km | Old workings | QG |
| reed | Reed fen | 7.1 km | Low wold | RF |
| beacon | Beacon clough | 9.4 km | High edge | BC |
| priory | Priory lane | 1.8 km | Town end | PL |

Supporting line is "{distance}, {place}" with a comma, not a dash.

## Tokens

```css
:root {
  --primary: #e6c176;
  --on-primary: #3f2e00;
  --primary-c: #5c4300;
  --on-primary-c: #ffdea0;
  --surface: #13110e;
  --surface-c: #201c18;
  --surface-high: #2b261f;
  --on-surface: #e8e1d6;
  --on-surface-v: #d0c6b6;
  --outline: #998e7c;
  --outline-v: #7a7164;
  --inverse: #e8e1d6;
  --inverse-on: #1c1915;
  --inverse-primary: #5c4300;
  --f-head: "Newsreader", Georgia, serif;
  --f-ui: "Outfit", system-ui, sans-serif;
  --ease: cubic-bezier(.2, 0, 0, 1);
  --t-ripple: 450ms;
  color-scheme: dark;
}
```

This is the dark tonal scheme of one brass seed. The snackbar uses the inverse roles: container `--inverse`, text `--inverse-on`, action `--inverse-primary`. Do not paint the snackbar in `--primary`.

## Typography

| Role | Family | Size / line | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Brand (label-medium) | Outfit | 12 / 16 | 500 | 0.5px | `--primary` |
| Title (title-large) | Newsreader | 22 / 28 | 500 | 0 | `--on-surface` |
| Count (body-medium) | Outfit | 14 / 20 | 400 | 0 | `--on-surface-v` |
| Trail name (title-medium) | Newsreader | 16 / 24 | 500 | 0 | `--on-surface` |
| Supporting (body-medium) | Outfit | 14 / 20 | 400 | 0 | `--on-surface-v` |
| Monogram (label-large) | Outfit | 14 / 20 | 600 | 0 | `--on-primary-c` |
| Snackbar text (body-medium) | Outfit | 14 / 20 | 400 | 0 | `--inverse-on` |
| Undo (label-large) | Outfit | 14 / 20 | 600 | 0.1px | `--inverse-primary` |
| Empty (body-large) | Outfit | 16 / 24 | 400 | 0 | `--on-surface-v` |

Newsreader is the trail name and the screen title. Everything else, including the snackbar, is Outfit.

## Motion

| Thing | Trigger | Property | From | To | Duration | Easing |
| --- | --- | --- | --- | --- | --- | --- |
| State layer | hover / focus-visible | opacity | 0 | .08 / .10 | 150ms | linear |
| Ripple | pointerdown, or Enter / Space | scale | 0 | 1 | 450ms | `--ease` |
| Ripple fade | release | opacity | .12 | 0 | 300ms | linear |
| Row leave | archive | height, opacity | measured, 1 | 0, 0 | 200ms / 150ms | `--ease` / linear |
| Snackbar enter | show, including a replace | opacity, translateY | 0, 16px | 1, 0 | 200ms | `--ease` |
| Snackbar exit | 4s timer, or Undo | opacity, translateY | 1, 0 | 0, 16px | 200ms | `--ease` |
| App bar | list scrolled | background | `--surface` | `--surface-c` | 200ms | `--ease` |

`visibility` flips to hidden 200ms after the exit starts (`transition-delay` on visibility only), so the bar cannot be tapped at the end of the fade. The hero has the class `on` in the HTML, so the first paint is the settled bar and the timer is the only thing that starts. A replace removes `on`, forces reflow, and adds `on` again so the 200ms enter replays. Reduced motion: durations become 1ms, the row is removed without the height animation, the snackbar does not travel, and a replace does not flicker the bar off and on. The 4 second wait stays.

## States

- **Row rest:** transparent on `--surface`, hairline `--outline-v` on the bottom edge, full bleed. Monogram circle 40px, `--primary-c` fill, `--on-primary-c` letters. Archive icon `--on-surface-v`.
- **Row hover / focus-visible:** 8% / 10% state layer, plus a 2px `--primary` outline inset 2px on focus-visible.
- **Row leaving:** height animates to 0, overflow hidden, then the node is gone.
- **Snackbar visible:** class `on`, opacity 1, `visibility: visible`, `aria-hidden` absent.
- **Snackbar hidden:** opacity 0, translated 16px down, `visibility: hidden`, `aria-hidden="true"`. Undo is not in tab order while hidden.
- **Snackbar action:** text button, min 48x48, radius 24px, colour `--inverse-primary`. Focus ring uses that same colour so it stays visible on the light bar.
- **Count:** "No trails on this phone", "1 trail on this phone", or "N trails on this phone".
- **Empty list:** the `ul` is hidden and `#empty` shows the same "No trails on this phone." sentence.
- **Error:** there is no failure state. Archive always succeeds on this phone.

## Accessibility

- The row button's accessible name is "Archive {trail name}". The icon and the monogram are `aria-hidden`. The visible name and the distance remain on screen.
- The snackbar does not take focus when it appears. Undo is the next tab stop while the bar is visible. After Undo, focus moves to the restored row.
- The visible text is exactly "Trail archived". The `role="status"` node is visually hidden and reads "Trail archived. {name} can be undone." Clearing that node and setting it again forces a second announcement when a later archive replaces the first, even though the visible sentence does not change.
- Undo announces "{name} restored."
- The count is `aria-live="polite"`.
- Contrast: `#E8E1D6` on `#13110E` is 14.5:1. Supporting `#D0C6B6` on `#13110E` is 11.2:1. Monogram `#FFDEA0` on `#5C4300` is 7.2:1. Snackbar text `#1C1915` on `#E8E1D6` is 13.5:1. Undo `#5C4300` on `#E8E1D6` is 7.2:1. The hairline `#7A7164` on `#13110E` is 3.9:1, above the 3:1 bar for a non-text divider.
- Hit targets: each row is at least 72px tall and full width. Undo is at least 48x48.

## Responsive rules

- Frame 390x844. Bar padding-top 54px. List padding-bottom is `34px + 64px` so the last row can scroll clear of the snackbar and the home inset. The snackbar's `bottom` is `34px + 8px`. Left and right are 16px. Do not draw a status bar or a home glyph.
- **360 wide:** the bar is `left: 16px; right: 16px`, not a fixed width, so it cannot spill. Names wrap (`overflow-wrap: break-word`). The row is a flex line with `min-width: 0` on the text.
- **Largest text (about 200%):** rows use `min-height: 72px`, not a fixed height, so the name and the supporting line wrap and the row grows. The monogram and the icon stay `flex: none` and vertically centred. The snackbar grows with its sentence (`min-height: 48px`, `align-items: center`) and Undo stays 48px tall. Nothing scrolls sideways.
- **Tablet:** keep the snackbar at the bottom of the phone column. On a window wider than 600px, cap the list and the snackbar at 600px and centre them. Do not stretch the bar edge to edge across a tablet.

## Acceptance checklist

**Always**

- [ ] One snackbar node. A second action replaces it and restarts the timer. It does not stack.
- [ ] The bar sits 8px above a 34px bottom inset, 16px from the left and right, radius 4px, min-height 48px.
- [ ] Container is inverse surface, message is inverse on-surface, action is inverse primary. The action is a text button, at least 48px tall.
- [ ] The bar leaves 4 seconds after it is shown. Undo before that restores the item and hides the bar.
- [ ] The bar does not take focus when it appears. The action is reachable with Tab while it is visible.
- [ ] Archive controls are at least 48px. Rows are at least 72px and full width, with a full-bleed hairline, not a card.
- [ ] Reduced motion skips the row collapse and the bar's travel. The 4 second wait remains.

**This demo**

- [ ] Brand Woldwalk, title "Saved trails". Hero shows 8 trails and a visible snackbar. Mill beck is the missing row.
- [ ] The visible snackbar text is exactly "Trail archived" with an Undo button.
- [ ] Archiving Harebell ridge and then Kiln lane leaves both gone, and Undo brings back only Kiln lane.
- [ ] Four seconds after the latest archive, the bar is gone and the row stays gone.
- [ ] Surface `#13110E`, snackbar `#E8E1D6`, action `#5C4300`. Fonts Newsreader and Outfit.

## Implementation notes

### Worked example

Start: visible rows are Harebell ridge, Kiln lane, Gorse common, Chapel stile, Quarry greenway, Reed fen, Beacon clough, Priory lane. Snackbar on. `undoId` is `mill`.

| Time | Action | List | Snackbar | Undo restores |
| --- | --- | --- | --- | --- |
| 0s | page load | 8 rows, no Mill beck | visible, "Trail archived" | Mill beck |
| 4s | timer | unchanged | hidden | nothing |
| later | archive Harebell ridge | 7 rows | visible, timer reset | Harebell ridge |
| +1s | archive Kiln lane | 6 rows, both gone | replays enter, timer reset | Kiln lane only |
| +1s | Undo | Kiln lane back, Harebell ridge still gone | hidden |  |
| later | archive Gorse common, wait 4s | Gorse common stays gone | hidden | nothing |

Count strings for those steps: "8 trails on this phone", then "7 trails on this phone", then "6 trails on this phone", then "7 trails on this phone" again.

Snackbar box:

- `position: fixed; left: 16px; right: 16px; bottom: calc(34px + 8px); z-index: 5`.
- `min-height: 48px; display: flex; align-items: center; gap: 8px; padding: 0 4px 0 16px`.
- `border-radius: 4px`. Elevation 3, same shadow as an M3 dialog: `0 4px 8px 3px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.3)`.
- Message `flex: 1; min-width: 0` so a long translation wraps instead of pushing Undo off screen. This demo's sentence is one line.
- Undo `flex: none; min-width: 48px; min-height: 48px; padding: 0 12px; border-radius: 24px; text-align: center`.

Row box: `min-height: 72px; padding: 12px 8px 12px 16px; gap: 16px`. Monogram 40px circle. Icon 24px. Hairline is `border-bottom: 1px solid var(--outline-v)` on the button, full width of the row.

The archive glyph is a 24px stroke icon: a lid, a box, and a downward chevron inside the box. Stroke 1.8, round caps, `currentColor`. It is decorative.

**One timer, one node.** Keep a generation counter so a stale timeout cannot dismiss a newer bar.

```js
let gen = 0, timer = 0, undoId = 'mill';
function arm() {
  const g = ++gen;
  clearTimeout(timer);
  timer = setTimeout(() => { if (g === gen) dismiss(); }, 4000);
}
function showFor(id) {
  undoId = id;
  if (!reduce && snack.classList.contains('on')) {
    snack.classList.remove('on');
    void snack.offsetWidth;
  }
  snack.classList.add('on');
  arm();
}
```

Call `arm()` once at startup for the hero. Do not call `showFor` on startup, or the settled bar will flicker. Skip the remove-and-reflow when reduced motion is on, but still reset the 4 seconds.

**Put the row back in its original index.** Store `archived` on the data, and render `filter(t => !t.archived)` in array order. Undo clears the flag and re-renders. Do not append the restored row at the bottom.

Plural for the count is three branches, not a suffix hack: 0 is "No trails on this phone", 1 is "1 trail on this phone", and every other count is "N trails on this phone". The empty paragraph uses the zero sentence too, with a full stop: "No trails on this phone."

The list is the scroll container (`flex: 1; overflow-y: auto`), not the page. `html` and `body` are `overflow: hidden` and `height: 100%`, so a long name wraps inside the row instead of growing `scrollWidth`. Padding-bottom on the list is `calc(34px + 64px)`: 34px for the home inset and 64px so the last row can sit fully above the snackbar. The bar itself is not inside the scroller, so it stays put while the list moves. When `scrollTop > 0` the bar background changes from `--surface` to `--surface-c` over 200ms.

Do not queue snackbars. If a product later needs a queue, that is a different component. This piece always shows the latest archive only, and Undo forgets the ones that were replaced.

Header stack, from the top of the viewport: 54px safe area, then a row of `min-height: 64px` with 16px inline padding. Inside it, the brand is 12/16 and the title is 22/28 with no margin, so the pair is about 44px and sits centred in the 64px row. The count is a separate line, 14/20, with 8px of padding under it. That puts the first row near y 146. Eight rows at 72px end near y 722. The snackbar top, on an 844px frame, is near y 754 (`844 - 34 - 8 - 48`), so the last row clears the bar without scrolling. A ninth restored row (Mill beck back) makes the list scroll, and the extra bottom padding keeps that row from hiding under the bar.

Monogram discs use `--primary-c` (`#5C4300`) and `--on-primary-c` (`#FFDEA0`). They are 40px, radius 50%, and they do not grow when text size grows (`flex: none`). The two letters are Outfit 14/20 weight 600.

Google Fonts: `Newsreader` opsz 6..72 at 400, 500, and 600, and `Outfit` at 400, 500, and 600. Two families. The snackbar does not use Newsreader, so a long message stays in the UI face.

Undo's focus ring is `--inverse-primary`, not `--primary`. A gold ring on the light bar would be the page accent, and it is the wrong surface. The inset 2px outline stays inside the 48px target. The row focus ring stays `--primary` (`#E6C176`) because those buttons sit on the dark surface, where that gold clears the 3:1 non-text bar easily (it is about 11:1 against `#13110E`).

The live status is a 1px clipped node (`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0)`). It is not `display: none`, or the announcement would not fire. Set its text to an empty string and then to the new sentence in the same turn so a repeated "Trail archived" still announces when the trail name changes.

On load the status already contains "Trail archived. Mill beck can be undone." so the hero does not need a script write to be announced. `showFor` overwrites it only after a later archive. Undo overwrites it with "{Name} restored." and does not restart the 4 second timer, because `dismiss` has cleared `undoId` and the bar is already hidden.

`color-scheme: dark` is set so the browser's form controls and the focus outline match the dark surface. The snackbar paints its own light background, so it does not follow that scheme. Do not set `color-scheme: light` on the bar or the Undo label will pick up a light-theme focus colour and disappear on `#E8E1D6`.

**Collapse, then render.** Set the `li` height to its `offsetHeight`, force reflow, add the leaving class, set height to 0. On `transitionend` for `height` (and a 280ms fallback), render the list and show the snackbar. A `settled` flag stops the fallback and the event from both running. The snackbar message stays the fixed sentence. The name goes only in the visually hidden status, set to empty and then to the new sentence so a repeated announcement still fires.
