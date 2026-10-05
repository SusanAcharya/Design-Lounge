<!-- Design Lounge Nº 088 · "Account menu panel" · www.designlounge.live -->

# Account menu panel

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the menu width, the focus rules, and the item list.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The account menu for North ledger. A 64px header has the product name on the left and a pill trigger on the right: a 32px avatar with the initials SA, and the name S. Acharya. The menu opens 8px under the header, aligned to the right edge with 28px page margin. It is 280px wide. Inside: the person's name and email, then Account, Billing, Keyboard shortcuts, and Sign out in danger colour. Choosing an item changes the page title and closes the menu. Escape and a click outside do the same and return focus to the trigger.

## Structure

```
header 64
  brand                          [avatar 32] S. Acharya
menu 280, top 72, right 28
  Susan Rai
  susan@northledger.test
  Account
  Billing
  Keyboard shortcuts
  Sign out
main
  h1 + one sentence
```

- Trigger is a `button` with `aria-haspopup="menu"` and `aria-controls` pointing at the menu.
- Menu has `role="menu"` and each row is `role="menuitem"`.
- Do not use a native `<select>`.

## Motion

No open animation. The menu appears and disappears. Reduced motion is already satisfied. Do not add a scale-in.

## States

- Trigger collapsed and expanded.
- Menuitem rest and hover (`--surface-2`).
- Sign out is always `--danger`.
- Menu hidden attribute when closed. Do not only set opacity 0. Hidden must remove it from pointer and reading order except as the spec's closed state.

## Accessibility

- Menu role and menuitem roles.
- Arrow keys wrap. Escape closes and restores focus.
- Focus ring 2px `--focus`, offset 2px.
- Avatar text "SA" is `aria-hidden`. The accessible name is the button's visible name "S. Acharya".
- Contrast of `--ink` on white is above 4.5. Danger on white is above 4.5.

## Responsive rules

- At 1280 and 1024 the menu is 280px, `right: 28px`, `top: 72px`.
- At 768 the header padding becomes 16px and the menu is `right: 16px`, still 280px.
- Below 640 the menu becomes full width minus 32px, still top-aligned under the header, not a bottom sheet.

## Acceptance checklist

- [ ] Header is 64px. Avatar is 32px.
- [ ] Menu is 280px and starts open.
- [ ] Four items. Sign out is danger coloured.
- [ ] Arrows move focus and wrap.
- [ ] Escape closes and focuses the trigger.
- [ ] Click outside closes the menu.
- [ ] Choosing an item sets the page title and closes the menu.
- [ ] Type is IBM Plex Sans only.
- [ ] No animation on open.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: menu open, trigger `aria-expanded="true"`. Page title is "Today".
2. Click the trigger: toggles the menu. Opening moves focus to the first menuitem.
3. Arrow Down and Arrow Up move through the four items and wrap.
4. Click an item: the page `h1` becomes that item's destination. Sign out sets the title to "Signed out" and the deck to the session-ended sentence. The menu closes. Focus returns to the trigger.
5. Escape from an item or from the page closes the menu and focuses the trigger.
6. A click that is not on the trigger or inside the menu closes it.
7. Hover on an item sets background `--surface-2`. Sign out stays `--danger` and does not turn black.
8. The trigger pill uses `--surface-2` while expanded.

## Tokens

```css
:root {
  --bg: #eef1f4;
  --surface: #ffffff;
  --surface-2: #e6ebf0;
  --ink: #12171c;
  --ink-2: #4c5864;
  --ink-3: #7d8b98;
  --line: #d5dde4;
  --primary: #0f4c81;
  --danger: #9b2c2c;
  --focus: #0f4c81;
  --font-text: "IBM Plex Sans", system-ui, sans-serif;
  --menu-w: 280px;
  --header: 64px;
  --radius: 8px;
  --shadow: 0 16px 40px -20px rgba(18,23,28,.35);
}
```

## Typography

- Brand and page title: IBM Plex Sans 500. Title 32px, tracking -0.03em. Brand 14px, weight 600.
- Identity name: 14px, weight 600. Email: 12px, `--ink-2`.
- Menu items: 13px, weight 400, min-height 36px.
- Deck under the title: 14px, `--ink-2`, max-width 46ch.

## Implementation notes

Keep the menu in the DOM. Toggle the `hidden` attribute. Do not recreate it on each open, or focus restoration gets lost.

Outside click: ignore events whose target is the trigger or inside the menu. The trigger click is a separate toggle. If both handlers run, the menu will open and immediately close.

Do not add profile photos. The avatar is initials on `#14324f`.

Rebuild in this order:

1. Page `#eef1f4`. Header `#ffffff`, 64px, padding 0 28px, bottom rule `#d5dde4`.
2. Brand "North ledger", 14px, weight 600, tracking -0.02em.
3. Trigger height 40, pill radius, gap 10, padding 0 8px 0 4px. Expanded fill `#e6ebf0`.
4. Avatar 32px circle, fill `#14324f`, initials SA at 12px weight 600, white.
5. Menu top 72, right 28, width 280, padding 6, radius 8, border `#d5dde4`, shadow `0 16px 40px -20px rgba(18,23,28,.35)`.
6. Identity block padding 10px 10px 12px, bottom rule, margin-bottom 6. Name 14px weight 600. Email 12px `#4c5864`.
7. Items min-height 36, radius 6, padding 0 10px, 13px. Hover fill `#e6ebf0`.
8. Sign out colour `#9b2c2c`, margin-top 4. It does not gain a hover that removes the danger colour. You may add the same hover fill behind it.
9. Page title 32px weight 500, tracking -0.03em. Deck 14px, max-width 46ch, colour `#4c5864`.
10. Stage padding 48px 28px, max-width 640.
11. Focus ring 2px `#0f4c81`, offset 2px.
12. Opening focuses the first menuitem. Closing focuses the trigger.
13. Arrow keys wrap across four items. There is no separator role.
14. Initial title is Today. Initial deck mentions Escape.
15. Do not add a theme switch, a photo, or a badge count.

Common mistakes to avoid:

- Using a native select for the menu.
- Scaling the menu in from 0.95. There is no open animation.
- Putting Sign out in the same colour as Account.
- Forgetting to set aria-expanded when the menu closes from an outside click.
- Focusing the trigger before the hidden attribute is set, which can scroll the page oddly. Set hidden, then focus.
- Adding a second header action, such as a bell, on this specimen.
- Making the menu 320px. It is 280.
- Using a serif for the name. The face is IBM Plex Sans only.
- Letting the menu grow with a long email. The email wraps inside 280px. It does not widen the panel.
- Closing on Arrow Left. Only Escape, outside click, and item activation close it.
- Rendering the menu inside the trigger button. It is a sibling, positioned against the page.
- Adding a checkmark on the current page. None of the items is the current page.
- Setting the email in a lighter grey than `#4c5864`.
- Giving the avatar a ring. It is a flat circle.
- Opening the menu below the fold. It sits 8px under the 64px header.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
