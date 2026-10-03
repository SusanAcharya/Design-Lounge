# Design Lounge reference

Read this only when you need a path or a kind map. The procedure is in SKILL.md. The catalogue is already installed beside this file.

## Installed files

| Need | Path, relative to this skill |
| --- | --- |
| Catalogue, palettes, type, kit, motion | `library/index.json` |
| One piece spec | `library/briefs/<id>.md` |
| Icons | `library/icons.json` |
| HTML demo | `demo` field on that piece in the index |
| Theme page | `{site}/themes/<id>` |
| Type page | `{site}/type/<id>` |

`site` is the field on `library/index.json`. Use these links when you show a pick. Do not paste a brief into the chat.

`kind` is `website`, `product`, `platform`, or `personal`. Theme, pairing, and family ids must be in that kind's lists inside `kit.kinds`.

## Kind map

| They say | Kind | Then |
| --- | --- | --- |
| Marketing site, company site, brochure | `website` | Also recipe `marketing-site` |
| SaaS, a tool people subscribe to, a pricing page | `product` | Also recipe `saas`. Fog City. Not the fashion landing. |
| Fintech, banking, payments, a card | `product` | Also recipe `fintech` on the web, `bank` on a phone |
| Admin, ops, dashboard, internal tool | `platform` | Also recipe `dashboard`. Search dashboard, data, charts, navigation, settings, overlays, feedback, inputs, pickers. |
| Personal finance, household, one person's money | `personal` | Also recipe `personal`. Lokta and Devanagari when the product is Nepali. Not the staff dashboard, and not `bank`. |
| Portfolio of a developer, product manager, product designer, or founder | `website` | Also recipe `portfolio-builder`. Projects are drawn as small working screens. Not the dark `portfolio`. |
| Portfolio of a visual designer, photographer, architect, or studio; a showreel | `website` | Also recipe `portfolio`. Scroll, hover, or a cursor is one piece from Register, not a second theme. |
| Personal site, a journal, not a showreel | `website` | Also recipe `personal-site` |
| Fashion, a lookbook, a luxury good | `website` | Also recipe `fashion` |
| Food, a local shop, a menu | `website` | Also recipe `food` |
| Wellness, a retreat, a class | `website` | Also recipe `wellness` |
| Hotel, a house, a reservation | `website` | Also recipe `hotel` |
| Agency, a studio site | `website` | Also recipe `agency` |
| Magazine, journal | `website` | Also recipe `editorial` |
| Docs, an API, a guide | `product` | Also recipe `docs` |
| Music site, a label, a release | `website` | Also recipe `music` |
| Event, festival, a night | `website` | Also recipe `event` |
| Museum, gallery, a collection | `website` | Also recipe `museum` |
| One landing page, and they did not name the world | `website` | Also recipe `landing`. If they named fashion, wellness, fintech, or a tool, use that recipe instead. A tilt or a sticky scroll is one piece from Register. |
| Phone app, iOS, Android, PWA, and they did not name the world | `product` | Also recipe `mobile-app`. Prefer `platform` `mobile-app` pieces. |
| Health, fitness, a clinic app | `product` | Also recipe `health` |
| Messages, mail, chat | `product` | Also recipe `messages` |
| Music app, now playing | `product` | Also recipe `music-app` |
| News on a phone | `product` | Also recipe `news` |
| Shop on a phone | `product` | Also recipe `shop-app`. A shop in a browser is `commerce`. |
| Social app, a feed, stories | `product` | Also recipe `social` |
| Weather | `product` | Also recipe `weather` |
| Field tool, ops on a phone | `platform` | Also recipe `field` |
| Shop, checkout, in a browser | `product` | Also recipe `commerce`. Order is collection, product, cart, checkout, then `order-confirmed`. |
| Tablet, iPad, landscape | `product` | Also recipe `tablet`. Do not stretch a phone screen to 1180px. |
| Design system only, no screen yet | `product` | Also recipe `design-system`. The controls are `text-field`, `textarea-field`, `password-field`, `radio-group`, `checkbox-group`, `slider-field`, `select-field`, `combobox`, `token-field`, `otp-code`, `rating-score`, `calendar-month`, `time-field`, `switch-row`, `button-roles`, `breadcrumb`, `tree-nav`, `pagination`, `filter-toolbar`, `qty-stepper`, `progress-bar`, `property-list`, `content-card`, `status-badge`, `inline-alert`, `tooltip`, `popover-panel`, `consent-bar`, `prompt-composer`, `split-button`, `drag-to-confirm`, `dial-knob`, `undo-toast`, `code-snippet-tabs`, `selection-bar`, `shortcut-sheet`, `inline-edit`, `minute-wheel`, `stretch-switch`, `gooey-nav`, `edge-light-button`, `shred-button`, `receipt-slip`, `focus-dim`, `node-graph`, `cited-answer`, `analog-stick`, `chip-bucket`, `press-well`, `curve-drawer`. |

## Sources

Public sites the screens study are `sources` in `library/index.json`, and again in `library/sources.json`. They come from `websites.txt` in the Lounge repo. A new line there is a new source the next time the skill is synced.

Pick one source for a public site. Read its `line` and `take`. The pieces listed on that source are the screens that already study it. Do not blend two sources. Do not copy the site's palette. The locked Lounge theme still wins. A source with `studied: false` is on the list only. No screen claims it yet.

## Token roles

Copy the theme `css` block. Do not rename the variables.

Brand: `primary`, `secondary`, `tertiary`, each with `Ink` and `Soft`. Surfaces: `bg`, `surface`, `surface2`, `surface3`. Ink: `ink`, `ink2`, `ink3`. Lines: `line`, `lineStrong`. Feedback: `success`, `warning`, `danger`, `info`, each with ink, soft, and on-soft. Text on a wash uses on-soft. Chrome: `focus`, `link`, `overlay`, `inverse`, `inverseInk`.

`link` is for text on `bg`. Buttons use the fill plus its ink.

Hover is `--surface-2`. Selected is `--primary-soft`. Selected and hovered is `--surface-3`. Do not invent a hover hex from a light-mode brief.

## Modes

`mode` is `light` or `dark`. `pair` is the other mode of the same palette, or null.

Twins: Paper & Ink / Night Desk, Linen Shop / Atelier Noir, Kiln / Copper Works, Harbour Ledger / Harbour Night, Lokta / Lokta Night. Fog City and the rest have no twin. Stay in that one mode. The theme's sample radius and shadow lose to the family.

## Cautions

If a pairing's `caution` is set, say it. Arcade and HUD set body text in a monospace face on purpose. Swiss Precision, Friendly SaaS, Developer Docs, and the other data pairings keep a sans for prose and a mono for numbers and code.

## Credit

`Designed by Susan Acharya · Design Lounge · acharyasusan.com.np`

Free to use in products. Do not republish the catalogue as a catalogue.
