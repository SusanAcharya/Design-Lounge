<!-- Design Lounge Nº 286 · "Split button" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Split button

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

## What it is

A split button for Hollis, a yard desk. The wide part sends the Gate 4 note now. The 44px chevron opens a menu of the other ways that same note can leave: send now, schedule for 18:00, or save as a draft. The menu is part of the control, not a second button somewhere else on the page. This is not the five roles in `button-roles`. This is not a nested nav menu. That menu is `nested-dropdown-menu`. One primary action, one menu of siblings.

## Reference behaviour

1. The first frame shows the menu open. The chevron is expanded. The status line reads "Choose how the Gate 4 note leaves."
2. The wide button reads Send now. Clicking it sets the status to "Sent now · Gate 4 note" and closes the menu.
3. Clicking the chevron toggles the menu. aria-expanded follows the open state.
4. The menu has three items: Send now, Schedule for 18:00, Save as a draft.
5. Choosing an item writes that action plus "· Gate 4 note" into the status line and closes the menu.
6. The menu does not navigate. Nothing is emailed.
7. Focus rings stay 2px on the primary green, offset 3px.

## Structure

```
320px column, centered on 1280×800
[ Send now            | v ]  44px tall
[ Send now               ]
[ Schedule for 18:00     ]
[ Save as a draft        ]
status line, 72px under the split
```

- A 320px wrap. The split is a flex row, position relative, height 44px.
- The main button is flex 1. The chevron is 44×44.
- The menu is absolute, top 52px, left 0, right 0.
- Each item is a button with role menuitem. The menu has role menu.
- The status is a paragraph with aria-live polite.

## Tokens

```css
:root {
  --bg: #f6f4ef; --surface: #fff; --ink: #161513; --ink-2: #5a554c;
  --line: #e4dfd4; --primary: #1f4d3a; --primary-ink: #fffdf8; --soft: #e7f2ec;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Main label | IBM Plex Sans | 14px | 500 | 1 | 0 |
| Menu item | IBM Plex Sans | 14px | 400 | 1 | 0 |
| Status | IBM Plex Sans | 14px | 400 | 1.45 | 0 |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Menu | click chevron | hidden | shown | none | already instant |

## States

- Menu open: aria-expanded true, menu visible.
- Menu closed: hidden attribute, aria-expanded false.
- Menu item hover and focus: background --soft.
- There is no disabled state in this demo. A product may disable the main button while a send is in flight, and must say so in the status line.

## Accessibility

- The chevron has aria-label "More send actions" and aria-controls the menu.
- aria-expanded is a string true or false.
- Menu items are buttons, so Enter and Space activate them.
- The status line is aria-live polite.
- Hit targets are 44px on the split and 40px on each item.
- Do not close the menu by moving focus with a mousemove listener.

## Responsive rules

- At 1280 the control is 320px, centered.
- Below 400 the wrap is calc(100% - 32px). The menu still matches the split width.
- Do not turn this into a full-screen sheet on desktop.

## Acceptance checklist

### Always

- [ ] One wide action and one chevron of equal height.
- [ ] The menu lists related actions for that same object, not unrelated navigation.
- [ ] Choosing an item updates a live status line and closes the menu.
- [ ] The chevron exposes aria-expanded.
- [ ] Focus is visible.

### This demo

- [ ] The note is the Gate 4 note.
- [ ] The menu starts open.
- [ ] Items are Send now, Schedule for 18:00, Save as a draft.
- [ ] The status after a choice ends with "· Gate 4 note".
- [ ] Type is IBM Plex Sans. Radius is 2px. Fill is #1f4d3a.

## Implementation notes

Keep the menu in the same stacking context as the split. top: 52px is 44px control plus 8px gap.

```js
function setOpen(on) {
  menu.hidden = !on;
  more.setAttribute('aria-expanded', String(on));
}
```

Do not use a native select. The point is one filled control with a shared menu. Do not add a fourth item that goes to another page.

## Measurements to keep

- Split height 44px. Chevron width 44px. Wrap width 320px.
- Menu top 52px, padding 4px, item height 40px, item padding 0 12px.
- Status margin-top 72px so it clears the open menu. Min-height 22px.
- Main label padding 0 16px. Radius 2px on the outer corners only.
- Chevron has a 1px translucent divider on its left.

## Wrong turns

- Do not make two separate buttons with a gap between them. The split is one shape.
- Do not put navigation in the menu. Settings, profile, and logout are an account menu.
- Do not close the menu on mouseleave. A person using a keyboard never entered with a pointer.
- Do not animate the menu with a bounce. This demo has no motion.
- Do not add icons to every item. The words are the menu.
- Do not use a native disclosure triangle in the chevron slot. The chevron is a 16px stroke icon.

## Fit with the rest of the library

- Five button roles in a row are `button-roles`.
- A menu of pages is `nested-dropdown-menu`.
- A panel that is not a menu of actions is `popover-panel`.
- A destructive confirm that must be dragged is `drag-to-confirm`.
- A toast that can be undone is `undo-toast`.
- This control sends one note. It does not open a composer. A composer is `prompt-composer`.

## Keyboard

- Tab moves from the main button to the chevron, then into the menu items when the menu is open.
- Enter on the main button sends now.
- Enter on the chevron toggles the menu.
- Enter on a menu item chooses it.
- Space activates the focused button. Do not scroll the page.
- Escape may close the menu in a product. This demo leaves Escape unused so the open menu stays for the first frame.
- Arrow keys are not required. The items are a short list of buttons.
- Do not trap focus in the menu. Tab may leave it.
- The live status is not a focused element.
- A focused menu item uses the same --soft fill as hover.
- The chevron icon is aria-hidden. The button name is the aria-label.
- Do not put tabindex greater than 0 on any control.
- The menu is in the tab order only while it is not hidden.
- Hidden uses the hidden attribute, which removes the items from the tab order.
- There is one status, not a toast and a status.
- After a choice, focus may stay on the item that just closed. Do not move focus to the body.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
