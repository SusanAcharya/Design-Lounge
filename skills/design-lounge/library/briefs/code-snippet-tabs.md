<!-- Design Lounge Nº 193 · "Code snippet tabs" · designlounge.vercel.app -->

# Code snippet tabs

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

## What it is

A code deck for a yard loads request. Three languages share one panel: curl, JavaScript, Python. The gate number 4 is marked. Copy writes the visible panel and the button reads Copied for 1.6 seconds. This is not the docs layout. That layout is `docs-three-column`. This is the fenced sample inside it. Arrow keys move the selected tab.

## Reference behaviour

1. curl is selected. Its panel is visible. The other panels are hidden.
2. Clicking JavaScript or Python moves aria-selected and shows that panel.
3. ArrowRight selects the next tab. ArrowLeft selects the previous. Both wrap.
4. Copy writes the visible text. The button reads Copied, then Copy after 1600ms.
5. The marked gate number is 4 in every panel.
6. Nothing is fetched. The samples are text.
7. There is no line-number gutter.

## Structure

```
640px deck
[ curl | JavaScript | Python        Copy ]
panel, mono 14px, padding 20px
```

- Deck width 640px, background #161513, radius 2px.
- Tabs are role tab inside a tablist.
- Panels are role tabpanel. Hidden panels use the hidden attribute.
- Copy sits at the right of the header.
- The gate number sits in a span with class mark.

## Tokens

```css
:root {
  --surface:#161513; --ink:#f4f1ea; --ink-2:#cfc6b8; --line:#3a342c;
  --primary:#1f4d3a; --mark-bg:#2c3a32; --mark:#d7efe4;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Tab | IBM Plex Sans | 13px | 500 | 1 | 0 |
| Code | IBM Plex Mono | 14px | 400 | 1.6 | 0 |
| Copy | IBM Plex Sans | 13px | 500 | 1 | 0 |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Copy label | click | Copy | Copied | 1600ms hold | same hold |

## States

- Selected tab: background #2a2622, text #f4f1ea, aria-selected true.
- Other tabs: transparent, text #cfc6b8.
- Copied: button text Copied for 1.6s.
- Hidden panels are not displayed.

## Accessibility

- The tablist has aria-label Language.
- Each tab has aria-controls and the panel has aria-labelledby.
- Arrow keys change the tab from the document listener in this demo. In a product, listen when a tab is focused.
- Copy has an accessible name.
- The mark is part of the code text, not an image.
- Focus ring is 2px #1f4d3a, offset 3px.

## Responsive rules

- The deck is 640px at 1280.
- Below 700 it is calc(100% - 32px). The header wraps if Copy no longer fits.
- Do not show all three panels at once.

## Acceptance checklist

### Always

- [ ] One panel visible.
- [ ] Copy copies the visible panel, not all three.
- [ ] The samples do not call a network.
- [ ] A value that changes is marked in each language.
- [ ] Tabs are buttons, not links.

### This demo

- [ ] Languages are curl, JavaScript, Python.
- [ ] The gate is 4.
- [ ] Host text is yard.internal, with no scheme.
- [ ] Copy becomes Copied.
- [ ] Mono is IBM Plex Mono. Sans is IBM Plex Sans.

## Implementation notes

Read innerText of the visible panel so the marked number is included.

```js
await navigator.clipboard.writeText(panels[i].innerText);
```

If the clipboard is blocked, still flip the label. Do not alert.

## Measurements to keep

- Deck 640px. Header padding 10px 12px. Tab height 32px.
- Panel padding 20px. Code 14px on 1.6.
- Copy height 32px. Label reset 1600ms.
- Selected tab fill #2a2622. Mark fill #2c3a32.
- Radius 2px on the deck.

## Wrong turns

- Do not embed a live request.
- Do not use a URL scheme in the sample.
- Do not highlight a whole line in rainbow colours.
- Do not add a fourth language unless the product has one.
- Do not copy HTML tags. Copy the visible text.
- Do not animate the panel in.

## Fit with the rest of the library

- A documentation page is `docs-three-column`.
- Underlined page tabs are `tabs-morphing-underline`.
- A command palette is `command-palette`.
- This deck is a sample, not a terminal session.
- Do not pair it with a glowing frame.
- The page behind the deck is #f6f4ef.

## Keyboard

- ArrowRight moves to the next language.
- ArrowLeft moves to the previous language.
- The index wraps.
- Enter on a tab selects it.
- Enter on Copy copies.
- Tab moves from the tabs to Copy.
- Hidden panels are not tabbable.
- Do not use a positive tabindex.
- The tablist is labelled Language.
- aria-selected is true on one tab.
- Copied lasts 1600ms.
- Do not steal Arrow keys when focus is in a different field. Scope the listener to the deck in a product.
- The mark stays in the copied string.
- There is no search inside the deck.
- Focus ring stays visible on the dark surface.
- Reduced motion changes nothing, because there is no transition.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
