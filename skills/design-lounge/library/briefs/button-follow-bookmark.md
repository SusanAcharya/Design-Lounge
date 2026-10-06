<!-- Design Lounge Nº 251 · "Follow, unfollow and save buttons" · www.designlounge.live -->

# Follow, unfollow and save buttons

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The relationship buttons of "Driftline", a community for film photographers, shown on a cool grey page. On the left is a creator card for Wren Achebe with a primary Follow button and an "Also on Driftline" list with three compact follow pills. On the right is a story card with a Save (bookmark) button. Follow turns into Following with a drawn check. The button keeps its width because all three labels share one grid cell. Unfollow is offered only when the pointer comes back after leaving, so the click that followed can never accidentally unfollow. Following also reveals a 44px bell for post notifications. Save fills its ribbon top to bottom in cobalt, nudges it down 3px, ticks the count, and raises a dark toast with Undo. These are the four social verbs, follow, unfollow, notify and save, done crisply in one family.

The heart and like burst are `optimistic-like-button`. Do not add a like here.

## Structure

```
1280 × 800, two cards centred as a group (360 + 24 + 500)
┌──────────────────────────────────────────────────────────────────┐
│   ┌ creator 360 ─────────────┐ ┌ story 500 ──────────────────────┐ │
│   │ (WA) Wren Achebe          │ │ Story · 8 min read · 2 Oct     │ │
│   │      @wren.achebe · Lisbon│ │ Forty mornings on the river,   │ │
│   │ bio 14.5px, 3 lines       │ │ one roll each        (30px)    │ │
│   │ 12,408 followers 311 fol… │ │ excerpt 15px                   │ │
│   │ [ + Follow ] (bell 0→44)  │ │ ▮▮▮▮ contact strip, 4 frames   │ │
│   │───────────────────────────│ │────────────────────────────────│ │
│   │ ALSO ON DRIFTLINE         │ │ [ribbon Save 214]  38 replies… │ │
│   │ (IV) Ilse Varga [Following]│ └────────────────────────────────┘ │
│   │ (NC) Noor Castell [Follow]│                                   │
│   │ (MB) Mateo Brandt [Follow]│                                   │
│   └───────────────────────────┘                                   │
│                 ┌ toast ───────────────────────────┐              │
│                 │ ribbon  Saved to Reading list  Undo │ bottom 28px │
└──────────────────────────────────────────────────────────────────┘
```

- `<main class="stage">` is a grid `360px 500px`, gap 24px, `align-items: start`.
- The creator card is a `<section aria-labelledby="name">`: `.me` (avatar + `<h1 id="name">` + handle), `.bio`, `.stats` (follower `<b id="followers">`), `.acts` (Follow + bell), and `.sugg` (`<h2>` + `<ul>` of rows, each with avatar, `.who`, and `button.follow.sm`).
- The story card is an `<article>`: `.kick`, `<h2>`, `<p>`, `.strip` (decorative, four `<i>` frames drawn with gradients), `.foot` (`button.save` + `.meta`).
- `button.follow > .lab > span.l1 | span.l2 | span.l3`, all stacked in one grid cell.
- `button.save > .rib` holds two identical ribbon SVGs: an outline, and a filled copy above it that is clipped.
- `.toast[role=status]` is fixed at bottom centre: icon, text, `button#undo`.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Follow fill/colour/ring | toggle | background, color, box-shadow | ink → white + ring | 240ms | `--ease` | 1ms |
| `.l1` / `.l2` / `.l3` | state, armed hover | opacity, translateY | 0, ±6px ↔ 1, 0 | 160ms / 240ms | `--ease` / `--ease-out` | 1ms |
| check stroke | follow | stroke-dashoffset | 20 → 0 | 320ms, delay 80ms | `--ease` | drawn |
| follower count | ± | translateY, opacity | −8px, 0 → 0, 1 | 260ms | `--ease-out` | none |
| bell | follow / unfollow | width, opacity | 0, 0 ↔ 44px, 1 | 240ms / 160ms | `--ease-out` | 1ms |
| bell glyph | notify on | rotate | 0 → 16° → −12° → 7° → −3° → 0 | 600ms | `--ease` | none |
| ribbon fill | save | clip-path | `inset(0 0 100% 0)` → `inset(0)` | 380ms | `--ease` | 1ms |
| ribbon | save | translateY, scaleY | 0 → 3px, 1.06 (45 %) → 0 | 420ms, delay 200ms | `--ease-pop` | none |
| save count | ± | translateY, opacity | −8px, 0 → 0, 1 | 260ms | `--ease-out` | none |
| toast | show / hide | opacity, translateY | 0, 14px ↔ 1, 0 | 280ms | `--ease` / `--ease-out` | 1ms |
| any button | :active | scale | 1 → .96 | 160ms | `--ease` | kept |

The roll animations restart on every change (remove class, reflow, add). The reduced-motion rule sets every animation and transition to 1ms with no delay, so states still land and nothing travels.

## States

- **Follow (rest):** ink fill `#0d1015`, white label, plus icon. Hover `#262b35`. Active scale .96.
- **Following:** white fill, ink label, check icon, 1px inset `--line` ring, `aria-pressed="true"`.
- **Following, armed, hover:** label "Unfollow", `--danger-soft` fill, `--danger` text, 1px ring `rgba(207,42,31,.35)`.
- **Following, not armed:** hover shows nothing new. This is the state right after the click.
- **Bell off:** 44px circle, 1px `--line` ring, outline glyph, hover `--surface-2`. **Bell on:** `--accent` fill, white filled glyph.
- **Save (rest):** transparent, ink label, outline ribbon, count `--ink-3`. Hover `--surface-2`.
- **Saved:** `--accent-soft` fill, cobalt label, count and ribbon (filled).
- **Toast:** ink surface, 14px radius, shadow `0 14px 34px rgba(13,16,21,.28)`. Undo is 36px tall, hover `rgba(255,255,255,.1)`.
- **Focus-visible:** 2px `--accent` outline, offset 3px. Inside the toast it is `#c3ceff` with offset −2px.

## Accessibility

- Follow buttons are toggle buttons (`aria-pressed`). Their `aria-label` is "Follow Wren" or "Following Wren. Press to unfollow". The visible Unfollow label is a hover hint, so keyboard and screen reader users get the same meaning from the label.
- Keyboard users arm the button by leaving it: blur arms it, the same as pointerleave. Tab away and back, and the focus ring shows on the Following state. Enter unfollows. Undo is in the toast.
- The bell is `inert` while not following, so it is not a tab stop. Its label is "Notify me when Wren posts" or "Notifications on for Wren. Press to turn off".
- Save's `aria-label` carries state and count: "Save story, 214 saves" or "Saved, 215 saves".
- The toast is `role="status"` (polite). Focus is not moved into it. Undo is reachable by Tab, and Escape closes it.
- Hover pauses the toast timer so pointer users can reach Undo.
- Contrast: `--ink-3` on white is 4.98:1. Cobalt on `--accent-soft` is 5.55:1. `--danger` on `--danger-soft` is 4.59:1. `#c3ceff` on the ink toast is 12.3:1.
- Hit targets: Follow and Save are 44px, compact pills 36px (pointer web; raise to 44px on touch), the bell 44px, Undo 36px.

## Responsive rules

- ≥ 1280: two columns as specified.
- 1024–1279: unchanged (884px).
- ≤ 920: one column, max 500px wide. The creator card comes first.
- < 480: card padding 20px, story title 25px, the reads and replies meta is hidden. The toast stays inside `100vw − 32px`.
- Compact pills keep their labels at every width. Never collapse Follow to an icon.

## Acceptance checklist

### Always

- [ ] Follow, Following and Unfollow share one width. The labels are stacked in one grid cell, and the button never resizes.
- [ ] Unfollow appears only on hover after the pointer has left once (or after blur). It never appears on the click that followed.
- [ ] Unfollow is instant and offers Undo in a toast. There is no confirm dialog.
- [ ] Notify is only reachable while following, and it resets when you unfollow.
- [ ] Save fills its ribbon top to bottom with a clip, not an opacity fade.
- [ ] Counts change on the same frame as the click.
- [ ] Every toggle uses `aria-pressed` and a label that states the next action or the state.
- [ ] The toast pauses on hover and closes on Escape.

### This demo

- [ ] Creator: Wren Achebe, @wren.achebe · Lisbon, 12,408 followers, 311 following.
- [ ] List: Ilse Varga (Following), Noor Castell, Mateo Brandt.
- [ ] Story: "Forty mornings on the river, one roll each", Save count 214.
- [ ] The Follow min-width is 128px. The bell grows 0 → 44px.
- [ ] Toast copy: "Saved to Reading list", "Unfollowed Wren", "You'll hear when Wren posts".
- [ ] The accent is `#2443f5`. Unfollow uses `#cf2a1f` on `#fdeceb`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the creator card (360px) and the story card (500px) side by side, centred, gap 24px.
2. Creator card: a 64px avatar "WA" on `#c9d3ff`, "Wren Achebe" (23px), "@wren.achebe · Lisbon", a three-line bio, then "**12,408** followers  **311** following". Then a black pill "+ Follow", 44px tall, min-width 128px. The bell is collapsed to width 0 and is `inert`.
3. "Also on Driftline" lists Ilse Varga (already Following), Noor Castell (Follow) and Mateo Brandt (Follow). These are 36px compact pills.
4. Story card: kicker "**Story** · 8 min read · 2 Oct" with "Story" in cobalt, title "Forty mornings on the river, one roll each" (30px), a two-line excerpt, a four-frame contact strip, then a footer with "Save 214" on the left and "38 replies · 1.9k reads" on the right.
5. Click **Follow**: the label "+ Follow" slides up 6px and fades. "Following" with a check icon slides in from 6px below, and the check stroke draws over 320ms after an 80ms delay. The fill goes from ink to white with a 1px `--line` inset ring. The followers count becomes 12,409 and drops in from 8px above. The bell expands from width 0 to 44px with a fade. `aria-pressed="true"`.
6. While the pointer stays on the button after that click, it keeps reading Following. When the pointer leaves (or focus blurs), the button is **armed**.
7. Hover an armed Following button: the label crossfades to "Unfollow", the background goes to `--danger-soft`, the text goes to `--danger`, and the ring becomes `rgba(207,42,31,.35)`. Mouse out returns it to Following.
8. Click while following: the button returns to Follow immediately, the count decrements, the bell collapses and resets to off, and a toast appears: "Unfollowed Wren" with **Undo**. Undo restores Following (already armed) and the count.
9. Click the **bell**: it fills cobalt with a white filled glyph and rings (rotate 16° → −12° → 7° → −3° → 0 over 600ms). `aria-pressed="true"`. Toast: "You'll hear when Wren posts" (no Undo). Clicking again turns it off with the toast "Notifications off for Wren".
10. Compact pills in the list follow the same rules (Follow → Following → armed → Unfollow + toast with Undo). They don't affect the follower count or the bell.
11. Click **Save**: the ribbon's filled copy is revealed top to bottom with `clip-path` over 380ms. The ribbon drops 3px and stretches to 1.06 in Y, then settles (420ms after a 200ms delay, overshoot easing). The label becomes "Saved", the count becomes 215 and rolls, and the pill turns `--accent-soft` with cobalt text. Toast: "Saved to Reading list" with **Undo**.
12. Click Saved: it un-saves (ribbon empties, 214, "Save"). Toast: "Removed from Reading list" with Undo, which re-saves.
13. The toast slides up 14px and fades in over 280ms at `bottom: 28px`, centred. It hides after 4000ms. Hovering pauses the timer, and leaving restarts a 2000ms timer. Escape hides it. A new toast replaces the current one.

## Tokens

```css
:root {
  --bg: #ebedf1;            /* cool page */
  --surface: #ffffff;       /* cards, Following fill */
  --surface-2: #f4f5f8;     /* hovers, list dividers */
  --line: #dfe3ea;
  --ink: #0d1015;           /* Follow fill, toast */
  --ink-2: #4b5261;         /* bio, excerpt */
  --ink-3: #687080;         /* handles, meta, counts at rest */
  --accent: #2443f5;        /* saved ribbon, bell on, focus ring, kicker */
  --accent-soft: #e7ebff;   /* saved pill */
  --danger: #cf2a1f;        /* unfollow hover text */
  --danger-soft: #fdeceb;   /* unfollow hover fill */

  --display: "Funnel Display", system-ui, sans-serif;
  --sans: "Funnel Sans", system-ui, sans-serif;

  --r-card: 20px;
  --r-pill: 999px;
  --h-btn: 44px;
  --h-btn-sm: 36px;

  --t-micro: 160ms;
  --t-morph: 240ms;
  --t-fill: 380ms;
  --t-toast: 280ms;
  --hold-toast: 4000ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-pop: cubic-bezier(.34, 1.56, .64, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Creator name | Funnel Display | 23px | 600 | 1.15 | −0.015em | |
| Story title | Funnel Display | 30px | 600 | 1.12 | −0.02em | 25px under 480px |
| Avatar initials | Funnel Display | 22px / 13px | 600 | 1 | 0 | large / list |
| Bio | Funnel Sans | 14.5px | 400 | 1.55 | 0 | `--ink-2` |
| Excerpt | Funnel Sans | 15px | 400 | 1.6 | 0 | `--ink-2` |
| Handle, meta | Funnel Sans | 13–14px | 400 | 1.5 | 0 | `--ink-3` |
| Stats numbers | Funnel Sans | 14px | 600 | 1.5 | 0 | `tabular-nums`, `--ink` |
| Follow label | Funnel Sans | 15px / 13.5px | 600 | 1 | 0 | main / compact |
| Save label | Funnel Sans | 14.5px | 600 | 1 | 0 | count 500 `tabular-nums` |
| Section label | Funnel Sans | 12px | 600 | 1 | 0.08em | UPPERCASE `--ink-3` |
| Toast | Funnel Sans | 14.5px | 400 | 1.5 | 0 | Undo 600 `#c3ceff` |

## Implementation notes

**Width-stable labels.** Stack every label in the same grid cell. The button sizes to the widest one, so the morph is a crossfade, not a resize.

```css
.follow .lab { display: grid; }
.follow .lab > span { grid-area: 1 / 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: opacity 160ms var(--ease), transform 240ms var(--ease-out); }
.follow .l2, .follow .l3 { opacity: 0; transform: translateY(6px); }
.follow[aria-pressed=true] .l1 { opacity: 0; transform: translateY(-6px); }
.follow[aria-pressed=true] .l2 { opacity: 1; transform: none; }
.follow[aria-pressed=true].armed:hover .l2 { opacity: 0; transform: translateY(-6px); }
.follow[aria-pressed=true].armed:hover .l3 { opacity: 1; transform: none; }
```

**Arming.** Clear the armed flag on every toggle, and set it when the pointer leaves or focus blurs. This one class prevents a double-click from following and unfollowing.

```js
btn.addEventListener('pointerleave', () => { if (pressed(btn)) btn.classList.add('armed'); });
btn.addEventListener('blur',         () => { if (pressed(btn)) btn.classList.add('armed'); });
btn.addEventListener('click', () => {
  const on = !pressed(btn);
  btn.setAttribute('aria-pressed', on); btn.classList.remove('armed');
  if (!on) showToast(`Unfollowed ${name}`, () => { btn.setAttribute('aria-pressed', true); btn.classList.add('armed'); });
});
```

**Ribbon fill.** Two copies of the same path. The top one is filled and clipped from the bottom. Transition `clip-path`, then delay the drop until the fill is mostly done.

```css
.rib { position: relative; width: 22px; height: 22px; }
.rib svg { position: absolute; inset: 0; }
.rib .fill { color: var(--accent); clip-path: inset(0 0 100% 0); transition: clip-path 380ms var(--ease); }
.rib .fill path { fill: currentColor; }
.save[aria-pressed=true] .fill { clip-path: inset(0); }
.save[aria-pressed=true] .rib { animation: drop 420ms 200ms var(--ease-pop) both; }
@keyframes drop { 45% { transform: translateY(3px) scaleY(1.06); } }
```

Common mistakes:

- Showing Unfollow the instant the button becomes Following. The user's pointer is still on it.
- Measuring and animating `width` between labels. That causes jank and reflows neighbours.
- A confirm modal for unfollow. Undo is kinder and faster.
- Leaving the bell focusable while it is collapsed to 0px.
- Colour-only saved state. The label also changes to Saved.
- Using the brand accent for Follow. Follow is ink. Cobalt is reserved for saved and notified, the things you own.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
