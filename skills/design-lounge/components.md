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

A filter, a chip, and a segmented control use `--radius` and `--control` too. A brief that draws a pill does not win unless this family's button is already a pill.

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

The five roles in one row are `button-roles`. Save is the one solid. A destructive action on that same view stays outline. On a confirm dialog the destructive action is the one solid and cancel is outline. That dialog is `modal-dialog-focus-trap`. A short description of a control is `tooltip`. It shows on hover and on focus. Do not put a tooltip on a chart.

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

The specimen is `text-field`: label, hint, error, and a disabled value that stays readable. A visible set of two to five choices is `radio-group`. A stepped value is `slider-field`. A bar of search and chips above a list is `filter-toolbar`. The chip uses this radius and this height. A path above a page is `breadcrumb`. Pages of a long list are `pagination`. A count of units is `qty-stepper`. Nested pages are `tree-nav`. One day is `calendar-month`. A span of days is `date-range-picker`. A long note is `textarea-field`. A password with a reveal is `password-field`. Several typed names are `token-field`. A code of digits is `otp-code`. A score from 1 to 5 is `rating-score`. A known count with an end is `progress-bar`. A panel with a button and no scrim is `popover-panel`. Facts on a record are `property-list`. A choice to keep one record is `consent-bar`. Several checks that can all be on are `checkbox-group`. A clock time is `time-field`. One setting that is on or off is `switch-row`.

## Select

A select is this field, not a second control. The closed control is a button of height `--control` and radius `--radius`. The list is `--surface` with a `--line` border and radius `--radius-card`. An option is at least 40px tall. Hover uses `--surface-2`. The selected option uses `--primary-soft`. The error, when the value is empty on submit, is 12px `--danger` under the field. Do not restyle the browser's native popup, and do not invent a new radius for the list. Four known options and no typing is `select-field`. A longer list you filter by typing is `combobox`.

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

A single record in a list is `content-card`. Its radius is `--radius-card`. Hover is `--surface-2`. The open card is `--primary-soft`. An open card under the pointer is `--surface-3`. It does not tilt.

Status badges use `--success-soft`, `--warning-soft`, `--danger-soft`, `--info-soft` with the matching ink. They are for state, not decoration. The four washes on a queue are `status-badge`. A message in the page is `inline-alert`. One message. It is not a toast.

## Icon and nav

Icons are Lounge Icons from `library/icons.json`. 24px viewport, stroke 1.75, round caps, `currentColor`. A button icon may be 16px. Do not mix another set.

A nav item is a row or a 40px pill. The current item uses `--primary-soft` and `aria-current="page"`. One nav system per screen. The shell widths, how main flexes when the rail closes, and how that same list becomes a drawer or phone tabs are in Layout in [practice.md](practice.md).

## Chart, empty, failed load

A chart is one series. Bars and sparks use `--primary` for the active mark and `--line` or `--surface-2` for the rest. A line is one stroke in `--primary`, with dots in the same ink. No area fill, no second series, no legend, no pie. The number the person came for is display size above the chart. The line is the evidence under it. Grid lines are `--line`, or omit them. Do not import a chart library's palette, legend, or tooltip.

Where the money went is a ranked horizontal bar list, `chart-rank-spend`. One colour, longest first, the selected amount at display size. A budget list is `budget-meter`: only the row past its limit uses the warning wash. Do not paint every row amber.

An amount is one string in one family. If it contains a glyph the mono face lacks, including रु, set the whole amount in the face that contains it. Nepal and India group by lakh: 1,24,000. Letter-spacing comes from the locked pairing. Do not pick a second tracking. Read Locale in [practice.md](practice.md).

Text on a feedback wash uses `--success-on-soft`, `--warning-on-soft`, `--danger-on-soft`, or `--info-on-soft`. Never the solid fill, and never a hex you invented.

A save confirmation is `saved-banner`. It stays on the page. It is not a toast. A failed load stays the failed-load piece.

A phone tab bar is `phone-tab-plain` unless the family is glass. Glass uses `ios-glass-tab-bar`. Do not put a glass bar on any other family. The plain bar's demo has four tabs. A product uses one tab per real section, three to five. A transaction list is `spend-list`. Do not invent a second list style. A conversation is `chat-thread`. A paid order that stays on the page is `order-confirmed`.

A single metric is one number at display size, a delta in `--success` or `--danger`, and a caption in `--ink-2`. If the screen has several figures, only one of them is display size. The others step down to the title role. Do not lay four equal numbers in a row.

An empty list is a heading, one sentence, and one primary button. The heading is the largest type on that view. No illustration unless the named piece is the illustrated empty. On a phone, use the phone empty piece: the screen name is a label, the empty heading is the answer, and the button is at least 44px tall.

A failed load is a banner in `--danger-soft` with `--danger-on-soft` text and a retry button. It is not a toast, and it is not the empty state. Empty means zero rows. Failure means the load did not arrive.

## What you do not add

A gradient button. A glass surface on every card. A second radius. A shadow on a family whose shadow is `none`. A purple focus ring. An emoji as an icon. A control whose height is not `--control`. A default face such as Inter, Roboto, or Arial when a pairing is locked. The full list of generated-page tells is Look in [practice.md](practice.md).
