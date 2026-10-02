# Design Lounge reference

Read this only when you need a path or a kind map. The procedure is in SKILL.md. The catalogue is already installed beside this file.

## Installed files

| Need | Path, relative to this skill |
| --- | --- |
| Catalogue, palettes, type, kit, motion | `library/index.json` |
| One piece spec | `library/briefs/<id>.md` |
| Icons | `library/icons.json` |
| HTML demo | `demo` field on that piece in the index (GitHub raw) |

`kind` is `website`, `product`, or `platform`. Theme, pairing, and family ids must be in that kind's lists inside `kit.kinds`.

## Kind map

| They say | Kind | Then |
| --- | --- | --- |
| Marketing site, studio, company site, brochure | `website` | Kit flow |
| SaaS, tool, service, pricing page | `product` | Kit flow |
| Admin, ops, dashboard, internal tool | `platform` | Also recipe `dashboard`. Search dashboard, data, charts, navigation, settings, overlays, feedback, inputs, pickers. |
| Portfolio, personal site | `website` | Also recipe `portfolio` in `starts` |
| One landing page | `website` | Also recipe `landing` |
| Phone app, iOS, Android, PWA | `product` | Also recipe `mobile-app`. Prefer `platform` `mobile-app` pieces. |
| Shop, checkout | `product` | Also recipe `commerce` |
| Magazine, journal, docs | `website` | Also recipe `editorial` |
| Design system only, no screen yet | `product` | Also recipe `design-system` |

## Token roles

Copy the theme `css` block. Do not rename the variables.

Brand: `primary`, `secondary`, `tertiary`, each with `Ink` and `Soft`. Surfaces: `bg`, `surface`, `surface2`, `surface3`. Ink: `ink`, `ink2`, `ink3`. Lines: `line`, `lineStrong`. Feedback: `success`, `warning`, `danger`, `info`, each with ink and soft. Chrome: `focus`, `link`, `overlay`, `inverse`, `inverseInk`.

`link` is for text on `bg`. Buttons use the fill plus its ink.

Hover is `--surface-2`. Selected is `--primary-soft`. Selected and hovered is `--surface-3`. Do not invent a hover hex from a light-mode brief.

## Modes

`mode` is `light` or `dark`. `pair` is the other mode of the same palette, or null.

Twins: Paper & Ink / Night Desk, Linen Shop / Atelier Noir, Kiln / Copper Works. Harbour Ledger, Fog City, and the rest have no twin. Stay in that one mode.

## Cautions

If a pairing's `caution` is set, say it. Arcade and HUD set body text in a monospace face on purpose. Swiss Precision, Friendly SaaS, Developer Docs, and the other data pairings keep a sans for prose and a mono for numbers and code.

## Credit

`Designed by Susan Acharya · Design Lounge · acharyasusan.com.np`

Free to use in products. Do not republish the catalogue as a catalogue.
