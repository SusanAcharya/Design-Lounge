<!-- Design Lounge Nº 141 · "Record detail header" · designlounge.vercel.app -->

# Record detail header

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens and take buttons from the component grammar. Keep this header, the two tabs, and the side panel.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The detail page for a single yard run, Bay 14. A 48px breadcrumb sits on a white bar. Below it, the title, a warning badge "Waiting on driver", and two actions: Hold (outline) and Confirm load (the only solid primary). Two tabs, Overview and Notes. Overview is a definition list of weight, driver, slot, gate, and reference. Notes is one paragraph. A 300px panel on the right repeats the next step and an outline button with the same verb. Confirming from either button disables both, changes both labels to Confirmed, and turns the badge into a calm green status. One view, one solid button. This is the page you open from a table row. It is not a second dashboard.

## Structure

```
1280 × 800
crumb 48
head: title + badge | Hold + Confirm
tabs 40
grid: main | 300px panel
```

- Breadcrumb is text, not a nav of five levels. "Runs / Bay 14".
- Tabs are `role="tab"`. Overview content is a `dl`. Notes is a paragraph.
- The panel is an `aside`.

## Motion

None. Tab changes are instant. Reduced motion changes nothing.

## States

- Tab selected and idle.
- Badge waiting (warning soft) and confirmed (green soft `#e7f2ec` / `#1f4d3a`).
- Primary button enabled and disabled at opacity from the disabled attribute. Do not invent a third colour.
- Notes hidden or shown.

## Accessibility

- Tabs expose `aria-selected` and `aria-controls`.
- The badge text changes, so colour is not the only status.
- Confirm is a button with a visible label.
- Contrast of `#1f4d3a` on `#f6f4ef` is the primary fill with light ink `#f6f4ef` on the button, which clears 4.5.
- Do not rely on the green badge alone. The word Confirmed is the status.

## Responsive rules

- At 1280 the panel is 300px and the definition list label column is 140px.
- At 1024 the panel remains.
- At 768 the panel stacks under the main column, full width, border-top instead of border-left.
- Below 640 the header actions wrap under the title, and both buttons are full width, primary last.

## Acceptance checklist

- [ ] Breadcrumb bar is 48px.
- [ ] Title is Bay 14 at 32px.
- [ ] One warning badge and two buttons. Only one is solid primary.
- [ ] Overview shows five meta rows. Values are mono.
- [ ] Notes hides the list and shows the inspection sentence.
- [ ] Side panel is 300px.
- [ ] Either confirm changes the badge to Confirmed and disables both confirm buttons. Only the header one is solid.
- [ ] Radius on buttons is 2px.
- [ ] No toast, no second typeface, no photo.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial tab is Overview, `aria-selected="true"`. Notes copy is hidden.
2. Click Notes: Overview hides, the note paragraph shows, Notes becomes selected. Click Overview to reverse.
3. The selected tab has a 2px ink underline. The other tab is `--ink-3` with a transparent underline.
4. Confirm load, in the header or in the panel, sets both buttons to Confirmed, disables both, and changes the badge text to Confirmed with fill `#e7f2ec` and ink `#1f4d3a`.
5. Only the header button is solid. The panel button is outline. They call the same action. Do not add a second success toast.
6. Hold does nothing in the demo. It is the outline button beside the one solid primary.
7. Focus ring is 2px `--focus`, offset 2px.
8. Meta values use mono. Labels use the text face in `--ink-3`.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #8a847a;
  --line: #e4dfd4;
  --primary: #1f4d3a;
  --primary-ink: #f6f4ef;
  --warning: #8a5a10;
  --warning-soft: #f8efd8;
  --focus: #1f4d3a;
  --font-text: "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --radius: 2px;
}
```

## Typography

- Title: IBM Plex Sans 500, 32px, tracking -0.03em.
- Breadcrumb: 13px. Current crumb weight 500, ink. Parent `--ink-3`.
- Badge: 11px, weight 600, height 22px.
- Buttons: 14px, weight 500, height 36px, radius 2px.
- Tab: 14px, height 40px. Selected weight 600.
- Definition labels: 12px `--ink-3`. Values: IBM Plex Mono 13px.
- Panel heading: 14px weight 600. Panel body: 13px `--ink-2`.

## Implementation notes

Hide Overview with `display` and show Notes with a class. Do not unmount the nodes if you want the tab pattern to stay simple.

The header button is the only solid primary. The panel repeats the verb as an outline button and calls the same action. A brief that draws two solid primaries is wrong. Keep one.

Rebuild order:

1. Page `#f6f4ef`. Crumb bar white, 48px, padding 0 32px, rule `#e4dfd4`.
2. Title 32px weight 500. Badge height 22, fill `#f8efd8`, ink `#8a5a10`.
3. Buttons height 36, radius 2. Outline is transparent with a 1px ink border. Primary fill `#1f4d3a`, ink `#f6f4ef`.
4. Tabs sit on the page background, gap 18px, padding 0 32px, bottom rule.
5. Selected tab underline 2px `#161513`.
6. Body grid `1fr 300px`.
7. Definition grid `140px 1fr`, row gap 10, column gap 16.
8. Values: 2,400 kg, Mira Lama, 06:40, North 2, RUN-1844.
9. Panel padding 20, left rule, white fill.
10. Note copy: "Inspection stays with the driver. Do not retag the pallet. The next slot is only held until 06:40."

Common mistakes:

- Turning this into a dashboard with charts.
- Adding a third tab.
- Using a serif for the title.
- Making both buttons solid.
- Animating the tab indicator. It is a border.
- Putting the badge to the right of the buttons.
- Colouring the whole header green after confirm. Only the badge changes.
- A 16px radius. This record is 2px.
- A sticky footer of actions. The actions live in the header and again in the panel.
- Replacing the definition list with a two-column card grid of icons.
- A second status colour for the gate. One badge is enough.

Copy you keep, in this order:

1. Crumb text is exactly "Runs / Bay 14".
2. Title is exactly "Bay 14".
3. Waiting badge reads "Waiting on driver".
4. Outline button reads "Hold".
5. Both confirm buttons read "Confirm load", then "Confirmed". Only the header one is solid.
6. Tab labels are "Overview" and "Notes".
7. Weight value is "2,400 kg".
8. Driver value is "Mira Lama".
9. Slot value is "06:40".
10. Gate value is "North 2".
11. Reference value is "RUN-1844".
12. Panel heading is "Next".
13. Panel sentence is "Confirm the load before the slot drops. Holding it pages the yard desk."
14. Confirmed badge fill is `#e7f2ec` and ink is `#1f4d3a`.
15. Page gutter on the head and tabs is 32px.
16. Panel width stays 300px until the 768px stack.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
