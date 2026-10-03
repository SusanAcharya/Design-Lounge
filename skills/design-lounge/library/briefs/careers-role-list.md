<!-- Design Lounge Nº 228 · "Open roles" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Open roles

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A hiring page for Harbour. Four roles sit in a list. One row is current. A panel 380px wide repeats that role: team, title, one sentence, place, and Apply. This is not a portrait grid. Portraits are `team-hover-portrait-grid`. This is not a staff directory inside a product. A staff list is `people-role-list`.

## Reference behaviour

1. The first frame current row is Yard lead. The panel title is Yard lead. The team line is Operations. The place is Kathmandu.
2. Clicking Ledger clerk, Night dispatcher, or Type designer moves `aria-current` to that button and rewrites the panel from that button's data.
3. Only one row is current.
4. Apply is a button. It does not navigate and it does not open a form. A form is a different piece.
5. The list does not filter. Place and team are labels, not controls.

## Structure

```
1280 × 800
padding 36px 56px 40px
grid: 1fr | 380px, gap 40px
Harbour
Open roles
rule
[Yard lead          Kathmandu   Operations]  current
[Ledger clerk       Biratnagar  Finance]
[Night dispatcher   Kathmandu   Operations]
[Type designer      Remote      Studio]

panel, surface, border, padding 28px 24px
  Operations
  Yard lead
  one sentence
  Kathmandu
  APPLY
```

- Each role is a `button` inside an `li`.
- The button is a three-column grid: title, place, team.
- The panel is an `aside`.

## Tokens

```css
:root {
  --bg: #f4f1ea;
  --surface: #fffdf8;
  --ink: #1a1814;
  --ink-2: #5c564c;
  --line: #e3ddd2;
  --primary: #1f4d3a;
  --soft: #e7f2ec;
  --display: "Fraunces", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Kicker | Public Sans | 11px | 500 | 1 | 0.14em, upper |
| Page title | Fraunces | 44px | 560 | 1 | -0.02em |
| Role name | Fraunces | 20px | 560 | 1.2 | 0 |
| Place, team | Public Sans | 13px | 400 | 1.3 | 0 |
| Panel title | Fraunces | 28px | 560 | 1.15 | 0 |
| Panel sentence | Public Sans | 15px | 400 | 1.45 | 0 |
| Apply | Public Sans | 12px | 500 | 40px | 0.08em, upper |

## Motion

None. The current row changes fill with no transition. Reduced motion has nothing to remove. Do not slide the panel.

## States

- The current row has `aria-current="true"` and background `--soft`.
- Other rows are transparent.
- Apply is outline: transparent fill, 1px `--ink` border, `--ink` text. Hover fills `--ink` and the text becomes `--bg`.
- Focus is a 2px `--primary` ring, offset 3px, on the role button and on Apply.
- Apply is never the solid primary. The current row is the selection. Apply is the verb, and it stays outline because this demo does not submit.

## Accessibility

- The role control is a `button`, not a link, because it changes the panel on this page.
- `aria-current="true"` is on the current button only. Remove it from the others. Do not set it to `"false"`.
- The panel sentence is plain text, not a live region. The change is in view.
- Hit height of a row is at least 52px. Apply is 40px tall.
- Place and team are in the button name so the accessible name is the role, the place, and the team.

## Responsive rules

- From 1024px up the panel sits in a 380px column.
- Below 1024 the panel stacks under the list, full width, with 24px between them.
- Below 640 the role button becomes one column: name, then place and team on one line. Padding stays 16px.
- Do not hide the panel on a small screen. The sentence is the point of the row.

## Acceptance checklist

### Always

- [ ] Four roles. One current.
- [ ] The panel repeats the current role's team, title, sentence, and place.
- [ ] Clicking a row moves the current state and rewrites the panel.
- [ ] Apply is outline, 40px tall, and does not navigate.
- [ ] The current row uses `--soft`. Other rows do not.
- [ ] The panel is 380px wide from 1024px up and stacks below that.
- [ ] Focus ring is 2px `--primary`, offset 3px.
- [ ] No portraits and no hover that swaps a photo.

### This demo

- [ ] The company is Harbour. The title is Open roles.
- [ ] The first current role is Yard lead, Kathmandu, Operations.
- [ ] Ledger clerk is Biratnagar, Finance.
- [ ] Night dispatcher is Kathmandu, Operations.
- [ ] Type designer is Remote, Studio.
- [ ] The Yard lead sentence mentions Gate 4.

## Implementation notes

Read the panel copy from `data-title`, `data-place`, `data-team`, and `data-copy` on the button. Do not keep a second copy of the sentences in a script object that can drift.

```js
b.addEventListener('click', () => {
  buttons.forEach((x) => x.removeAttribute('aria-current'));
  b.setAttribute('aria-current', 'true');
  title.textContent = b.dataset.title;
});
```

The button is `display: grid` and `width: 100%`. A default button will not stretch. Set `width: 100%`, `text-align: left`, and `font: inherit`.

Do not make Apply a primary fill. The selection is the row. Two solids on one screen is a second design.

This is not `team-hover-portrait-grid`. That piece is people and pictures. This piece is open jobs and one panel.

Measurements to keep:

- Page padding is 36px top, 56px sides, 40px bottom.
- The columns are `1fr` and 380px with a 40px gap.
- The page title is 44px. A role name is 20px. The panel title is 28px.
- A row has 16px padding and an 8px inline inset.
- The panel padding is 28px 24px. The sentence max width is 36ch.
- Apply is 40px tall, padding 0 16px, tracking 0.08em.
- The list's top rule is `--ink`. Row rules are `--line`.
- The current row does not add a border. The fill is the only change.
- Apply sits under the place, with 18px between the sentence and the button.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
