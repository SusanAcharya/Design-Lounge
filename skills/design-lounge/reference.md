# Design Lounge reference

Read this only when you need a path or a kind map. The procedure is in SKILL.md. The catalogue is already installed beside this file.

## Installed files

| Need | Path, relative to this skill |
| --- | --- |
| The map: kinds, families, recipes, themes and pairings by mood, motion | `library/map.json` |
| One recipe | `library/starts/<id>.json` |
| One theme's CSS | `library/themes/<id>.css` |
| One pairing's CSS | `library/pairings/<id>.css` |
| The same theme, pairing, and family as numbers, for native apps | `library/themes/<id>.json`, `library/pairings/<id>.json`, `library/app.json` |
| Piece list, to search | `library/pieces.txt` |
| One piece spec | `library/briefs/<id>.md` |
| Icons | `library/icons.json` |
| HTML demo | `{site}/demo/<id>.html` |
| Everything in one file, for tools only | `library/index.json` (do not read it in a build) |
| Theme page | `{site}/themes/<id>` |
| Type page | `{site}/type/<id>` |

`site` is the field on `library/map.json`. Use these links when you show a pick. Do not paste a brief into the chat.

`kind` is `website`, `product`, `platform`, or `personal`. Theme, pairing, and family ids must be in that kind's lists inside `kinds` in `library/map.json`, unless they come from a recipe direction. A direction was chosen for that recipe and wins.

## Kind map

| They say | Kind | Then |
| --- | --- | --- |
| Marketing site, company site, brochure | `website` | Also recipe `marketing-site` |
| SaaS, a tool people subscribe to, a pricing page | `product` | Also recipe `saas`. Fog City. Not the fashion landing. |
| Fintech, banking, payments, a card | `product` | Also recipe `fintech` on the web, `bank` on a phone |
| Admin, ops, dashboard, internal tool | `platform` | Also recipe `dashboard`. Search dashboard, data, charts, navigation, settings, overlays, feedback, inputs, pickers. |
| Personal finance, household, one person's money | `personal` | Also recipe `personal`. Lokta and Devanagari when the product is Nepali. Not the staff dashboard, and not `bank`. |
| Portfolio of a developer, product manager, product designer, or founder | `website` | Also recipe `portfolio-builder`. Projects are drawn as small working screens. Not the dark `portfolio`. |
| Portfolio of a visual designer, photographer, architect, or studio; a showreel | `website` | Also recipe `portfolio`. Scroll, hover, or a cursor is one piece from Register in [website.md](website.md), not a second theme. |
| Personal site, a journal, not a showreel | `website` | Also recipe `personal-site` |
| Fashion, a lookbook, a luxury good | `website` | Also recipe `fashion` |
| Food, a local shop that sells or ships | `website` | Also recipe `food` |
| Restaurant, cafe, bar, a menu people come in for | `website` | Also recipe `restaurant` |
| Wellness, a retreat, a class | `website` | Also recipe `wellness` |
| Clinic, dentist, physio, vet, a doctor people book | `website` | Also recipe `clinic`. The phone app is `health`. |
| Gym, boxing, yoga or spin studio with a timetable | `website` | Also recipe `gym` |
| Real estate, a listing, an agent, rentals | `website` | Also recipe `real-estate` |
| School, college, an online course, a bootcamp | `website` | Also recipe `education` |
| Job board, many open roles, hiring marketplace | `product` | Also recipe `jobs`. One company's few roles stay `careers-role-list` on its own site. |
| Charity, nonprofit, fundraiser, donations | `website` | Also recipe `nonprofit` |
| Law firm, accountant, consultant, advisory | `website` | Also recipe `professional` |
| Crypto, trading, an exchange | `product` | Also recipe `fintech`. The trading screen is `crypto-exchange-trade`. |
| Hotel, a house, a reservation | `website` | Also recipe `hotel` |
| Agency, a studio site | `website` | Also recipe `agency` |
| Magazine, journal | `website` | Also recipe `editorial` |
| Docs, an API, a guide | `product` | Also recipe `docs` |
| Music site, a label, a release | `website` | Also recipe `music` |
| Event, festival, a night | `website` | Also recipe `event` |
| A game, arcade, web game, card game, lobby, or anything with a score | `website` | Also recipe `game`. Read Games and Three.js in [taste.md](taste.md). |
| Three.js, WebGL, a 3D scene, a model you orbit | `website` | Also recipe `game`, direction Orbit. The demo is raw WebGL. The brief says how to build it in Three.js. |
| Handwritten, hand-lettered, a letter, a notebook site | `website` | Also recipe `notebook`. Letter Hand for the whole site. Handwritten Notes only when the notes are the handwritten part. |
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

Public sites the screens study are in `library/sources.json`. They come from `websites.txt` in the Lounge repo. A new line there is a new source the next time the skill is synced.

Pick one source for a public site. Read its `line` and `take`. The pieces listed on that source are the screens that already study it. Do not blend two sources. Do not copy the site's palette. The locked Lounge theme still wins. A source with `studied: false` is on the list only. No screen claims it yet.

## Brand files

Use these for Brand flow in SKILL.md. Each one is a DESIGN.md that describes a real brand's look: colours, type, radius, spacing, components, and dos and don'ts. They come from [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT). The site [getdesign.md](https://getdesign.md) shows each file with a preview.

The file is at `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<slug>/DESIGN.md`. The slugs:

`airbnb`, `airtable`, `apple`, `binance`, `bmw`, `bmw-m`, `bugatti`, `cal`, `claude`, `clay`, `clickhouse`, `cohere`, `coinbase`, `composio`, `cursor`, `dell-1996`, `elevenlabs`, `expo`, `ferrari`, `figma`, `framer`, `hashicorp`, `hp`, `ibm`, `intercom`, `kraken`, `lamborghini`, `linear.app`, `lovable`, `mastercard`, `meta`, `minimax`, `mintlify`, `miro`, `mistral.ai`, `mongodb`, `nike`, `nintendo-2001`, `notion`, `nvidia`, `ollama`, `opencode.ai`, `pinterest`, `playstation`, `posthog`, `raycast`, `renault`, `replicate`, `resend`, `revolut`, `runwayml`, `sanity`, `sentry`, `shopify`, `slack`, `spacex`, `spotify`, `starbucks`, `stripe`, `supabase`, `superhuman`, `tesla`, `theverge`, `together.ai`, `uber`, `vercel`, `vodafone`, `voltagent`, `warp`, `webflow`, `wired`, `wise`, `x.ai`, `zapier`.

If the fetch fails, the list may have moved. Say so, and use the closest Lounge theme.

## Opening the page

Look in [practice.md](practice.md) needs a real browser. A native app needs a simulator instead: the commands are in Looking at the app in [native.md](native.md). Use [playwright-cli](https://github.com/microsoft/playwright-cli). If the `playwright-cli` command is missing, try `npx playwright cli`. If that is missing too, ask before you install it with `npm install -g @playwright/cli@latest`. Installing it is their call.

```bash
playwright-cli open file:///abs/path/index.html
playwright-cli resize 1280 800
playwright-cli screenshot --filename=web.png
playwright-cli --raw eval "document.documentElement.scrollWidth <= innerWidth"
playwright-cli console warning
playwright-cli resize 390 844
playwright-cli screenshot --filename=phone.png
playwright-cli set-reduced-motion reduce
playwright-cli reload
playwright-cli screenshot --filename=still.png
playwright-cli close
```

Look at each screenshot. The `eval` must print `true`, which means nothing scrolls sideways. `console` must show no errors. With reduced motion on, the still frame must show the finished page, not a blank one waiting for an animation.

To see a scroll effect run, scroll in steps and screenshot each step: `playwright-cli mousewheel 0 400`, wait half a second, then `screenshot`. Five steps through the effect is enough.

If they won't install it, use the browser your editor gives you. Its screenshots can lag behind the scroll, so scroll with a script (`window.scrollTo`), wait about 600ms, then take the shot. Where a shot still looks stale, measure the page instead, as Look in [practice.md](practice.md) says. Say in the reply which tool you used, and which effects you never saw running.

## Token roles

Copy the theme's CSS file. Do not rename the variables.

Brand: `primary`, `secondary`, `tertiary`, each with `Ink` and `Soft`. Surfaces: `bg`, `surface`, `surface2`, `surface3`. Ink: `ink`, `ink2`, `ink3`. Lines: `line`, `lineStrong`. Feedback: `success`, `warning`, `danger`, `info`, each with ink, soft, and on-soft. Text on a wash uses on-soft. Chrome: `focus`, `link`, `overlay`, `inverse`, `inverseInk`.

`link` is for text on `bg`. Buttons use the fill plus its ink.

Hover is `--surface-2`. Selected is `--primary-soft`. Selected and hovered is `--surface-3`. Do not invent a hover hex from a light-mode brief.

## Modes

`mode` is `light` or `dark`. `pair` is the other mode of the same palette. Every theme has one, so a site or app can follow the system setting. The pair keeps the same fonts and the same brand hue, lifted or deepened to read on the other ground.

Use the pair as it is. Do not rebuild the second mode from the first by inverting it. The theme's sample radius and shadow lose to the family.

## Cautions

If a pairing's `caution` is set, say it. Arcade and HUD set body text in a monospace face on purpose. Swiss Precision, Friendly SaaS, Developer Docs, and the other data pairings keep a sans for prose and a mono for numbers and code.

## Credit

`Designed using Design Lounge` with Design Lounge linked to https://designlounge.vercel.app. Once, in the footer or about screen, in small text. As a comment on copied token blocks.

Free to use in products. Do not republish the catalogue as a catalogue.
