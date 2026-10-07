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
| bold | 4px | 6px | 44 / 48 | 16px | 16px | solid primary, 2px `--ink` border, the offset shadow |

`--shadow` is the family's shadow. Sharp, editorial, and industrial use `none`. Bold's is the hard offset `4px 4px 0 var(--ink)`, and hover moves the control into it.

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

The five roles in one row are `button-roles`. Save is the one solid. A destructive action on that same view stays outline. On a confirm dialog the destructive action is the one solid and cancel is outline. That dialog is `modal-dialog-focus-trap`. A primary action with a menu of sibling actions is `split-button`. A destructive confirm that must be dragged to the end is `drag-to-confirm`. A round menu of three actions on a goo filter is `gooey-menu`. A current link whose pill slides under that filter is `gooey-nav`. A draft that falls into strips is `shred-button`. One gold edge around a button is `edge-light-button`. A button that drops into its well is `press-well`. A short description of a control is `tooltip`. It shows on hover and on focus. Do not put a tooltip on a chart. A full-width row whose label rolls up to a second line, and whose ground inverts, is `label-roll-button`. The second line is a fact about the first, not a second action.

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

The specimen is `text-field`: label, hint, error, and a disabled value that stays readable. A visible set of two to five choices is `radio-group`. A stepped value is `slider-field`. A bar of search and chips above a list is `filter-toolbar`. The chip uses this radius and this height. A path above a page is `breadcrumb`. Pages of a long list are `pagination`. A count of units is `qty-stepper`. Nested pages are `tree-nav`. One day is `calendar-month`. A span of days is `date-range-picker`. A long note is `textarea-field`. A question with tone chips is `prompt-composer`. A password with a reveal is `password-field`. Several typed names are `token-field`. A code of digits is `otp-code`. A score from 1 to 5 is `rating-score`. A known count with an end is `progress-bar`. A panel with a button and no scrim is `popover-panel`. Facts on a record are `property-list`. A choice to keep one record is `consent-bar`. Several checks that can all be on are `checkbox-group`. A clock time is `time-field`. One setting that is on or off is `switch-row`. A round integer on a knob is `dial-knob`. A fenced sample with a language switch is `code-snippet-tabs`. A list of keys is `shortcut-sheet`. An archive that can be undone for a few seconds is `undo-toast`. A bar that appears when rows are checked is `selection-bar`. A trace of tool steps is `agent-step-trace`. A heading that becomes the field is `inline-edit`. Minutes from 1 to 30 on a wheel are `minute-wheel`. A switch thumb that widens while pressed is `stretch-switch`. A stick that leans toward a named side is `analog-stick`. A chip dragged into a bucket is `chip-bucket`. A side panel whose edge bows as it closes is `curve-drawer`.

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

When the icon you need is not in the set (a dumbbell, a tooth, a tractor), use this order:

1. A Lounge icon that means the same thing. Settings is `sliders` or `settings`, not a new gear.
2. Lucide (lucide.dev, ISC licence). It has the same grammar: 24px, stroke, round caps. Copy the SVG and set `stroke-width="1.75"`. Do not add the whole package for one icon.
3. Draw it yourself in the same grammar: 24px viewBox, 2px padding, `stroke="currentColor"`, `stroke-width="1.75"`, round caps and joins, no fill, at most about six strokes.

Never use emoji, a filled icon set, or a second outline set with a different stroke next to Lounge icons.

Brand and social logos (GitHub, Instagram, LinkedIn, app stores, payment cards) are not icons. Take them from Simple Icons (simpleicons.org, CC0) as one-colour SVGs in `currentColor`, the same size as the icons beside them. Use the official app store badges for download buttons. Never redraw or recolour a real company's logo.

## Logo and favicon

If they have a logo, use their file. Ask for SVG. Do not redraw it, recolour it, or put it in a box.

If they do not have one, make a wordmark, not a symbol:

- The name in the pairing's display face, at the display weight and tracking. Tighten the tracking a little for a short name.
- One small move at most: an italic letter, a ligature, a dot in `--primary`, or one letter swapped for a shape. No gradient, no mascot, no clip-art mark, no AI-generated logo.
- Export it as SVG with the text turned into paths, so it does not depend on the font loading.
- Make a monogram of one or two letters in the same face for small spaces.

The favicon is the monogram on `--primary` with `--primary-ink`, or the monogram alone in `--ink`. Ship `favicon.svg`, a 32px `favicon.ico`, and a 180px `apple-touch-icon.png`. Add a dark-mode version inside the SVG with `prefers-color-scheme` when the site has a dark theme.

The share image (`og:image`, 1200 × 630) is the wordmark and the page's headline on `--bg`, in the pairing. One per site is enough. Make one per page only for articles or products.

A phone app needs an app icon. It is not the favicon made bigger.

- Draw it on a square 1024 × 1024 canvas with square corners and no transparency. The phone cuts the rounded shape itself.
- One idea: a single object or mark, kept inside the middle 80% so the corners never cut it. No words or letters. The name already sits under the icon.
- Light comes from the top: a slightly paler top half, a darker bottom edge, a thin light rim, and a soft shadow under the mark. That is enough depth.
- Shrink it to 29px early. If the shape and its two main colours can't be read at that size, simplify it.
- Make a dark version (the mark in its brand colour on a near-black plate) and a tinted version (one hue in three shades). Do not just invert the light one.
- Export every size from the master with a script: 1024, 180, 120, 60, and 29, plus what the platform asks for now.
- Use the pieces to check it: `app-icon-spec-sheet` for keylines, real sizes, and light and dark home screens, and `app-icon-home-screen-set` for the three looks side by side.

Client and partner logos in `logos-grid-case-hover` or `logos-mono-marquee` come from the person. If they have none, leave the block out. Never use real company logos they did not give you, and never invent fake ones to fill the row.

A nav item is a row or a 40px pill. The current item uses `--primary-soft` and `aria-current="page"`. One nav system per screen. The shell widths, how main flexes when the rail closes, and how that same list becomes a drawer or phone tabs are in Layout in [practice.md](practice.md).

## Chart, empty, failed load

A chart is one series. Bars and sparks use `--primary` for the active mark and `--line` or `--surface-2` for the rest. A line is one stroke in `--primary`, with dots in the same ink. No area fill, no second series, no legend, no pie. The number the person came for is display size above the chart. The line is the evidence under it. Grid lines are `--line`, or omit them. Do not import a chart library's palette, legend, or tooltip.

A stage count that narrows, one colour, is `funnel-chart`. Five named nodes, and only the lines that touch the pressed one, are `node-graph`. The stage the person picks is the display number. Where the money went is a ranked horizontal bar list, `chart-rank-spend`. One colour, longest first, the selected amount at display size. A budget list is `budget-meter`: only the row past its limit uses the warning wash. Do not paint every row amber. A series the person reads by dragging through time is `chart-scrub-readout`. One hairline, one dot, and the value in the display number. Arrow keys move one step. No tooltip on the line.

An amount is one string in one family. If it contains a glyph the mono face lacks, including रु, set the whole amount in the face that contains it. Nepal and India group by lakh: 1,24,000. Letter-spacing comes from the locked pairing. Do not pick a second tracking. Read Locale in [practice.md](practice.md).

Text on a feedback wash uses `--success-on-soft`, `--warning-on-soft`, `--danger-on-soft`, or `--info-on-soft`. Never the solid fill, and never a hex you invented.

A save confirmation is `saved-banner`. It stays on the page. It is not a toast. A failed load stays the failed-load piece.

A phone tab bar is `phone-tab-plain` unless the family is glass. Glass uses `ios-glass-tab-bar`. Do not put a glass bar on any other family. The plain bar's demo has four tabs. A product uses one tab per real section, three to five. A transaction list is `spend-list`. Do not invent a second list style. A conversation is `chat-thread`. A paid order that stays on the page is `order-confirmed`.

Website navigation. Pick one header per site, by the brand, not by habit:

- A hotel, restaurant, fashion or luxury brand: `navbar-split-centered-logo`. It sits clear over the hero and turns solid on scroll.
- A SaaS, docs or tool site: `navbar-hide-on-scroll`. Many products to explain: `mega-menu-product-grid`.
- A portfolio, studio or agency: `navbar-vertical-rail`, `navbar-island-morph`, or `navbar-floating-pill-shrink`.
- On a phone the header becomes a menu button. An open menu or drawer keeps keyboard focus inside it, closes on Escape, and puts focus back on the button when it closes. A studio or brand site uses `hamburger-circle-reveal`. A shop or a site with many sections uses `hamburger-drawer-accordion`. A site people come back to every week, like a gym, a restaurant or a PWA, may use `mobile-web-bottom-nav` instead. A marketing page does not.
- An app shell: `sidebar-workspace-switcher`, or `collapsing-sidebar-rail` when the work needs room. Docs: `sidebar-docs-toc` or `docs-three-column`.

Website sections. Each block below has a piece. Use it, restyled onto the theme, before you build a generic block:

- Hero: a tool with a real interface uses `hero-split-ui-stack`. A marketplace, travel, or booking site leads with search, `hero-search-marketplace`.
- Features: `features-alternating-rows`, `features-tabbed-preview`, or `bento-feature-grid`. Never three equal icon cards.
- Proof: many short voices go in `testimonials-masonry-wall`. Customers with numbers go in `testimonials-metric-tabs`. Client names go in `logos-grid-case-hover` or `logos-mono-marquee`. Figures go in `stats-count-up-band`.
- Price: a price that grows with use is `pricing-usage-slider`. Fixed plans are `pricing-annual-toggle-roll`.
- Questions: more than eight questions use `faq-category-accordion`.
- Close: a signup ask is `cta-giant-email-band`. An agency or freelancer inquiry is `contact-project-brief-steps`.
- Footer: a product with many pages uses `footer-sitemap-columns`. A portfolio or personal site picks from the footer list in Sections, one by one in [website.md](website.md). Do not reach for the same footer every time.
- Work, about, and contact on a website also pick from the lists in Sections, one by one in [website.md](website.md).

App screens on the web. An AI assistant or chat tool is `ai-chat-workspace`: answers stream, sources are numbered, Stop is visible while it streams. Team and seats are `settings-team-members`. Uploads are `file-upload-manager`: every row shows progress, and a failed row has Retry. A week of bookings or shifts is `calendar-week-planner`. A first run that creates something is `onboarding-workspace-setup`, with a live preview of what they are making. A missing page is `error-404-editorial` or `terminal-404`: it has search and four real links, never only "Go home".

Tablet. A shop or cafe till is `tablet-pos-register`. Writing is `tablet-notes-three-pane`. A screen read from across a room, like a kitchen, is `tablet-cook-mode`. A front desk is `tablet-kiosk-checkin`, with 64px keys and an automatic reset. PWA offline: saved items are `pwa-offline-library`. Work done offline that must send later is `pwa-outbox-sync`.

Cards. A shop grid is `card-product-quick-add`. A blog or news grid is `card-article-mix`: one lead, then smaller cards, never six equal boxes. A pass, membership or ticket is `card-holo-foil`.

Paper things. A real ticket is `card-cinema-ticket`, `card-event-ticket-stub` or `card-boarding-pass`. A menu on the wall is `card-cafe-menu-board`. A price tag is `card-retail-price-tag`. A postcard, polaroid, stamped form or folder is `card-postcard-stamp`, `card-polaroid-frames`, `card-stamped-document` or `card-folder-tabs`. A magazine cover is `card-magazine-cover`. A long read card is `card-drop-cap-editorial`. A quote is `card-pull-quote`. Use one paper object per page. It is the memorable thing, not the layout.

Widgets. Health is `widget-heart-rate`, `widget-sleep-score`, `widget-activity-rings` or `widget-hydration`. Time is `widget-analog-clock`, `widget-world-clocks`, `widget-pomodoro` or `widget-stopwatch-laps`. Utility is `widget-compass`, `widget-weather-glance`, `widget-device-battery` or `widget-control-toggles`. Live things are `widget-ride-pickup`, `widget-flight-arrival`, `widget-now-playing` and `widget-voice-assistant`. A widget shows one number big and one action. Goals are `card-progress-goals`. A countdown is `card-event-countdown`.

Social. A post is `social-microblog-post`, `social-photo-post`, `social-pro-post` or `social-thread-card`. A profile is `social-profile-card`, `social-pro-profile` or `social-microblog-profile`. A developer profile shows `social-repo-card` and `social-contribution-graph`. A community is `social-chat-server-card`. A business card is `profile-contact-card`. A staff page is `profile-editorial-staff`. Invent the brand. Never draw a real company's logo.

Tables. Orders are `table-orders-status`. Money is `table-transactions-ledger`: amounts line up on the decimal point. Users and roles are `table-users-select`. Tasks are `table-tasks-inline`. Logs are `card-terminal-log`. On a phone every table becomes cards or scrolls inside its own box.

Menus and notices. Row actions are `dropdown-kebab-actions`. Sharing is `dropdown-share-menu`. A desktop app menu is `dropdown-menubar-file`. Filtering a list is `dropdown-filter-sort`. A search over everything is `spotlight-command-bar`. A rich notice is `notif-incoming-call`, `notif-deploy-status`, `notif-delivery-live` or `notif-payment-received`.

Buttons beyond the basic set. A physical key is `button-3d-press`. Soft UI is `button-inset-soft`. A premium pill is `button-sheen-pill`. Deleting or paying is `button-hold-to-confirm`. Shop, social, download and copy are `button-add-to-cart`, `button-follow-bookmark`, `button-download-progress` and `button-copy-share`. Pick one button language per product.

Inputs and waiting. A code by email or text is `otp-code` or `input-otp-underline`. A phone number is `input-phone-country`. Many spinners are in `loader-spinner-set`. Waiting on AI is `loader-text-shimmer`.

Showing work. A phone, laptop, watch or music player is `mockup-phone-showcase`, `mockup-laptop-browser`, `mockup-watch-faces` or `mockup-ipod-classic`. A desktop dock is `dock-magnify-desktop`. Editor tools are `dock-editor-tools`. Who is here is `dock-presence-bar`. Several named cursors on one shared board are `live-cursors-board`: yours follows the pointer, the others drift, and only the board hides the system cursor. A selection box is `frame-transform-box`. Notes pinned beside a still, one open at a time, are `shot-callout-pins`. The pin sits off the type, and a line runs to the note. Image frames with shapes are `frame-circle-cut`. Galleries are `gallery-film-strip`, `gallery-photo-album`, `gallery-museum-placard` and `gallery-wall-frames`.

Backgrounds. Soft colour is `background-aurora-mesh` or `background-sunrise-horizon`. Print is `background-halftone-pop` or `background-ink-wash`. Material is `background-terrazzo` or `background-linen-weave`. Technical is `background-graph-paper` or `background-diagonal-boxes`. A background sits behind one section, not the whole site, and text on it passes 4.5:1. Hand-drawn marks on words are `text-annotated-underlines`.

On Android, or when the family is Material, the tab bar is `m3-navigation-bar`. It is the same job as `phone-tab-plain`. Use one of the three, never two.

Phone app screens, one piece each. Restyle them onto the locked theme. Do not keep the demo's colours.

- Launch: `phone-splash-launch`. Under 1.6s, then the first real screen.
- Sign in: `phone-sign-in`. Sign up: `phone-sign-up-steps`. A passkey step is `auth-passkey-setup`.
- First run: `ios-onboarding-carousel`, then `phone-permission-prompt` before any system prompt. Never fire the system prompt on launch.
- Paid plan: `phone-paywall-plans`. Show the trial dates and the price per month. No fake countdown.
- A person: `phone-profile-header`. Comments: `phone-comments-sheet`. Alerts: `phone-notifications-list`.
- A product: `phone-product-detail`. The bag and payment: `mobile-one-page-checkout`.
- A form: `phone-form-fields`. Errors on blur, the first error gets focus on save.
- Adding photos: `phone-photo-picker`.
- Search: `phone-search-results`. Recent searches first, then results in tabs, and an empty state that suggests a real word.
- Places on a map: `phone-map-listings`. A trip: `phone-ride-request`. A delivery on its way: `phone-order-tracking`.
- A feed: `phone-feed-posts`. A video: `phone-video-player`.
- Cards, passes and tickets: `phone-wallet-cards`. Scanning a ticket or code: `phone-qr-scanner`.
- Picking a time: `phone-booking-slots`. A day or week of plans: `phone-calendar-agenda`.
- A timer you watch from a distance: `phone-workout-timer`. A lesson or quiz: `phone-lesson-quiz`.
- Editing a profile: `phone-account-edit`. Save is off until something changes. Leaving with changes asks first.
- Deleting an account: `phone-delete-account`. Say what goes, offer the export, give a grace period with undo. Both stores require this screen.
- Changing or cancelling a plan: `phone-subscription-manage`. The end date in plain words, and Keep and Cancel the same size.
- Notification choices: `phone-notification-settings`. If the system has them off, say so at the top with a way to fix it.
- Permissions and data: `phone-privacy-data`. Show what the phone allows; do not fake a switch for it.
- Asking for a rating: `phone-rating-prompt`. Only after a success, never on first launch, then hand off to the system prompt.
- Large text: `phone-large-text-layout`. At the biggest sizes rows stack and nothing is cut. Test every screen this way.

Android versions. When the platform is Android or the family is Material, use these in place of the iOS piece:

- Sign in: `m3-sign-in` (outlined fields, errors under the field).
- Settings: `m3-settings-list` (flat list, section titles, no grouped cards).
- A list that opens a detail: `m3-list-detail` (the row grows into the screen; back shrinks it home).
- A screen title that collapses: `m3-top-app-bar-scroll`. On iOS this is `ios-large-title-collapse`.
- A bottom sheet: `m3-modal-bottom-sheet`, with the main button pinned to the bottom.
- A confirm: `m3-dialog`. Text buttons, the destructive one in the error colour. A tap on the scrim does not dismiss.
- Undo after an action: `m3-snackbar`. One at a time, above the bottom inset, about 4 seconds.
- Search: `m3-search-results`. Recent searches first, live results, an empty line that repeats the query.

More phone screens:

- Forgot password: `phone-forgot-password`. The sent state shows the address they typed and a resend that waits.
- A code: `phone-code-entry`. Paste fills every box. A wrong code shows its error under the boxes.
- An app lock: `phone-app-lock`. The biometric button first, the keypad as the fallback. No copy of the system lock screen.
- Bag, checkout, and history: `phone-cart`, `phone-checkout`, `phone-orders`. Totals are computed from the lines.
- Writing: `phone-composer`. Post stays off until there is text. Leaving with text asks first.
- Photos: `phone-photo-viewer`. Swipe between them, one zoom step, a close control.
- First load of a list: `phone-skeleton-list`. Placeholders the shape of the real rows, then the rows.

A game. The title is `game-title-screen`. A game you can finish is `game-playfield` or `game-card-table`. The chrome over it is `game-hud`. A room of players is `game-lobby`. Scores are `game-leaderboard`. The pixel kit is `pixel-arcade-style`. Read Games and Three.js in [taste.md](taste.md) before you invent a Play button.

A 3D scene. A shader with no objects is `webgl-shader-hero`. A box of flat faces is `object-3d-turntable`. A lit object you orbit is `three-orbit-object`. A world tied to scroll is `three-scroll-world`. A room you look around is `three-room-look`. Build the product in Three.js from the brief. The demo stays raw WebGL.

A handwritten site. The whole page in a hand is `handwritten-homepage` or `handwritten-letter`, and the kit is `handwritten-style`. Notes on a normal page are `text-annotated-underlines`. Do not set paragraphs in a signature script.

A single metric is one number at display size, a delta in `--success` or `--danger`, and a caption in `--ink-2`. If the screen has several figures, only one of them is display size. The others step down to the title role. Do not lay four equal numbers in a row.

An empty list is a heading, one sentence, and one primary button. The heading is the largest type on that view. No illustration unless the named piece is the illustrated empty. On a phone, use the phone empty piece: the screen name is a label, the empty heading is the answer, and the button is at least 44px tall.

A failed load is a banner in `--danger-soft` with `--danger-on-soft` text and a retry button. It is not a toast, and it is not the empty state. Empty means zero rows. Failure means the load did not arrive.

## What you do not add

A gradient button. A glass surface on every card. A second radius. A shadow on a family whose shadow is `none` (unless lifted by Named aesthetic in [practice.md](practice.md)). A purple focus ring. An emoji as an icon. A control whose height is not `--control`. A default face such as Inter, Roboto, or Arial when a pairing is locked. The full list of generated-page tells is Look in [practice.md](practice.md).
