# Components

Every control in the product comes from this file. Piece briefs decide layout, content, and behaviour. They do not get their own button, field, or card.

Set the variables from the locked family, then use the components. In Tailwind, React, SwiftUI, or anything else, match these numbers. Do not restyle a control because the screen is new.

## Variables

Put these on `:root` with the theme colour tokens. Density comes from [practice.md](practice.md).

| Family | `--radius` | `--radius-card` | `--control` web / phone | `--gap` | `--pad` | Button |
| --- | --- | --- | --- | --- | --- | --- |
| quiet | 6px | 8px | 40 / 44 | 16px | 16px | solid primary, outline secondary |
| soft | 14px | 14px | 44 / 48 | 24px | 20px | soft fill, pill on the primary |
| sharp | 0 | 0 | 36 / 44 | 12px | 12px | outline, or a solid ink block |
| editorial | 2px | 2px | 40 / 44 | 24px | 20px | outline until hover |
| glass | 16px | 16px | 44 / 44 | 16px | 16px | soft, pill on tab items |
| industrial | 2px | 2px | 36 / 44 | 12px | 12px | solid |

`--shadow` is the family's shadow. Sharp, editorial, and industrial use `none`.

## Button

One height per platform: `var(--control)`. Padding 0 14px. Font 13px / 500 on web, 15px / 500 on phone. Icon 16px, gap 8px. One primary button per view.

```css
.btn {
  height: var(--control);
  padding: 0 14px;
  border-radius: var(--radius);
  border: 1px solid var(--line-strong);
  background: transparent;
  color: var(--ink);
  font: 500 13px/1 var(--font-text);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-primary {
  background: var(--primary);
  color: var(--primary-ink);
  border-color: transparent;
}
.btn-soft {
  background: var(--primary-soft);
  color: var(--ink);
  border-color: transparent;
}
.btn:disabled { opacity: .4; }
.btn:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }
```

Hover: primary darkens by using `--inverse` only when the family is sharp. Otherwise the border becomes `--ink` on outline buttons, and primary buttons stay the fill. Do not invent a third hover colour.

## Field

Label above, 12px, `--ink-2`. The input is the same height and radius as the button. Error text under the field, 12px, `--danger`. Hint is `--ink-3`.

```css
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font: 500 12px/1 var(--font-text); color: var(--ink-2); }
.field input, .field textarea, .field select {
  height: var(--control);
  padding: 0 12px;
  border-radius: var(--radius);
  border: 1px solid var(--line-strong);
  background: var(--surface);
  color: var(--ink);
  font: 400 14px/1.4 var(--font-text);
}
.field textarea { height: auto; min-height: 96px; padding: 12px; }
.field .error { font-size: 12px; color: var(--danger); }
.field input:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
```

## Select

A select is this field, not a second control. The closed control is a button of height `--control` and radius `--radius`. The list is `--surface` with a `--line` border and radius `--radius-card`. An option is at least 40px tall. Hover uses `--surface-2`. The selected option uses `--primary-soft`. The error, when the value is empty on submit, is 12px `--danger` under the field. Do not restyle the browser's native popup, and do not invent a new radius for the list.

## Card, row, badge

```css
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  padding: var(--pad);
  box-shadow: var(--shadow);
}
.row {
  min-height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  border-bottom: 1px solid var(--line);
}
.row:hover { background: var(--surface-2); }
.row[aria-selected="true"] { background: var(--primary-soft); }
.badge {
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--ink-2);
  font: 500 11px/22px var(--font-text);
  letter-spacing: .04em;
}
```

Status badges use `--success-soft`, `--warning-soft`, `--danger-soft`, `--info-soft` with the matching ink. They are for state, not decoration.

## Icon and nav

Icons are Lounge Icons from `library/icons.json`. 24px viewport, stroke 1.75, round caps, `currentColor`. A button icon may be 16px. Do not mix another set.

A nav item is a row or a 40px pill. The current item uses `--primary-soft` and `aria-current="page"`. One nav system per screen.

## Chart, empty, failed load

A chart is one series. Bars and sparks use `--primary` for the active mark and `--line` or `--surface-2` for the rest. A line is one stroke in `--primary`, with dots in the same ink. No area fill, no second series, no legend. The number the person came for is display size above the chart. The line is the evidence under it. Numbers are `--font-mono`. Grid lines are `--line`, or omit them. Do not import a chart library's palette, legend, or tooltip.

A single metric is one number at display size, a delta in `--success` or `--danger`, and a caption in `--ink-2`. If the screen has several figures, only one of them is display size. The others step down to the title role. Do not lay four equal numbers in a row.

An empty list is a heading, one sentence, and one primary button. The heading is the largest type on that view. No illustration unless the named piece is the illustrated empty. On a phone, use the phone empty piece: the screen name is a label, the empty heading is the answer, and the button is at least 44px tall.

A failed load is a banner in `--danger-soft` with `--danger` text and a retry button. It is not a toast, and it is not the empty state. Empty means zero rows. Failure means the load did not arrive.

## What you do not add

A gradient button. A second radius. A shadow on a family whose shadow is `none`. A purple focus ring. An emoji as an icon. A control whose height is not `--control`.
