# Design Lounge reference

Read this only when you need a path, a kind map, or the local-file fallback. The procedure is in SKILL.md.

## Remote endpoints

`{base}` is `base` in lounge.json. No trailing slash.

| Need | GET |
| --- | --- |
| Map and rules | `{base}/llms.txt` |
| Full index | `{base}/api/pieces.json` |
| Search | `{base}/search.json` |
| Kit brief | `{base}/kit/brief/{kind}/{theme}/{pairing}/{family}.md` |
| Piece brief | `{base}/p/{id}.md` |
| Piece demo | `{base}/demo/{id}.html` |
| Human kit | `{base}/kit?kind=&theme=&pairing=&family=` |

`kind` is `website`, `product`, or `platform`. Theme, pairing, and family ids must be in that kind's lists inside `kit.kinds`. Any other combination 404s.

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

## Local fallback

Use only when `{base}` does not answer and this repository is available.

| Need | File |
| --- | --- |
| Kinds, families, brief template | `src/data/kit.ts` |
| Palettes and `themeCss` | `src/data/themes.ts` |
| Pairings and `pairingCss` | `src/data/type.ts` |
| Start recipes | `src/data/starts.ts` |
| Shelves | `src/data/collections.ts` |
| Motion | `src/data/motion.ts` |
| Icons | `src/data/icons.ts` |
| Piece brief | `src/content/pieces/{id}.md` |
| Piece demo | `src/demos/{id}.html` |

Build a kit brief by calling `kitBrief` in `src/data/kit.ts` with `themeCss` and `pairingCss`. Do not hand-write the token block.

## Token roles

Every theme has these. Match the names.

- Brand: `primary`, `primaryInk`, `primarySoft`, `secondary`, `secondaryInk`, `secondarySoft`, `tertiary`, `tertiaryInk`, `tertiarySoft`
- Surface: `bg`, `surface`, `surface2`, `surface3`, `ink`, `ink2`, `ink3`, `line`, `lineStrong`
- Feedback: `success`, `warning`, `danger`, `info`, each with `Ink` and `Soft`
- Chrome: `focus`, `link`, `overlay`, `inverse`, `inverseInk`

`accent` is an alias of `primary`. Prefer the role names.

## Credit

`Designed by Susan Acharya · Design Lounge · acharyasusan.com.np`

Portfolio: https://acharyasusan.com.np
