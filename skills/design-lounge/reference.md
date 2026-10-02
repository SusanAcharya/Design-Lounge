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
| Admin, ops, dashboard, internal platform | `platform` | Kit flow |
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

## Credit

`Designed by Susan Acharya · Design Lounge · acharyasusan.com.np`

Free to use in products. Do not republish the catalogue as a catalogue.
