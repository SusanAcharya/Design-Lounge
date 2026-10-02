# Practice

This is how you design with the library. Read it before you write UI. The catalogue is the material. This file is the discipline.

The aim is one product that feels designed: same palette, type, icons, radius, spacing, motion, and components on every screen. A new screen extends the sheet. It does not start a second system.

## Before code

1. Write one sentence: who it is for, and the one job of this pass. If you cannot, you are not ready to pick a hero.
2. Decide new kit or adopt. Adopt when they already have tokens, a DESIGN.md, or styled screens, unless they asked for a new look.
3. Choose the system and the pieces. Search before you invent: settings, billing, search, upload, audit, account menu, inbox, table, dialog, toast, form, record, people, detail. If the index has no piece, say so, and build only from this sheet and from [components.md](components.md). Do not import another library's look.
4. Show that pick with links, and ask once, before any UI. Follow Show the pick in [SKILL.md](SKILL.md). Stop unless they already said just go, you pick, build it, or don't ask, or they already named the system.
5. When the system is locked, write the sheet below. If the project has no DESIGN.md, add it. If one exists and you are adopting it, do not overwrite it. If one exists from an earlier Lounge pass, update Sources when they change a screen. Do not start a second file.
6. Build the shell first (nav, tab bar, or frame), then the primary screen, then the rest of the minimum set below. A product is not done after the first screen.
7. Run the finish checklist. Fix failures. Report each line as pass or fail.

## System sheet

```
Product:
Job of this pass:
Kind: website | product | platform
Mode: new kit | adopt existing
Theme: id (pair: id or none)
Pairing: id
Family: id
Icons: Lounge Icons, 24px, stroke 1.75
Motion: cubic-bezier(0.2, 0.7, 0.2, 1) · UI 200ms · layout 320ms · sheets 400ms
Density: air | regular | dense
Pieces:
Kept from their system:

## Sources
- theme <id> — {site}/themes/<id>
- pairing <id> — {site}/type/<id>
- family <id> — radius
- <piece id> — layout | motion | component — demo url
```

`{site}` is the `site` field in `library/index.json`. One line per piece you actually build. The role is layout, motion, or component: what they should look at if they want to compare. When they ask to change a screen, change that line, then rebuild only that screen.

For a new product, the matching recipe in `starts` names the first pieces. Build those before you invent a screen the recipe did not name.

For a revamp, name three visual problems. Fix those inside the adopted system. Do not reskin the whole product unless they asked.

## Spacing

Base unit 4px. Use the locked family's density. Do not invent a third gap on the same screen.

| Density | Page padding | Stack gap | Card padding | Control height, web / phone |
| --- | --- | --- | --- | --- |
| air | 28–40 | 24 | 20 | 44 / 48 |
| regular | 20–32 | 16 | 16 | 40 / 44 |
| dense | 16–24 | 12 | 12 | 36 / 44 |

Phone margin 20. Web content width 1120 unless a piece brief sets a stage. Reading measure 58–66ch.

## Type

One display face, one text face, one mono for numbers and code. No fourth family.

| Role | Use |
| --- | --- |
| display | one headline per view |
| title | section titles |
| body | prose, 16px web / 17px phone, line-height 1.5 |
| label | 11–12px with tracking, never a sentence |
| caption | secondary, `--ink-2` |
| num | `--font-mono`, tabular numbers |

Body stays on `--font-text`. Do not set a paragraph in the display face. Do not set body in mono unless that pairing's `caution` says the body is mono on purpose.

## Layout

One primary action per view. Secondary and tertiary follow the family.

Web is a 12-column grid with a 16px gutter, or the grid in the piece brief. Phone is one column. The primary action sits in the thumb zone or in the sticky bar the piece specifies.

One navigation system. A header and a tab bar on the same phone screen is two systems.

The header, the button, and the text field look the same on every screen of this pass.

## Brand

If they already have a brand colour, the theme still supplies surfaces, ink, lines, and feedback. Their brand becomes `--primary` only. `--primary-ink` is `#141210` or `#fffdf8`, whichever reaches contrast 4.5 against that brand. `--link` is the brand walked darker on a light background, or lighter on a dark one, until it reaches 4.5 against `--bg`. Secondary and tertiary stay the theme's, unless they named those too.

## Components

Read [components.md](components.md) and use it for every control. Icons are Lounge Icons only. One size, one stroke. Do not mix in another set.

Buttons take their shape from the family: solid, outline, or soft. One height per platform.

Inputs match that height and radius. Label above the field. Error under it, in `--danger`.

Empty, loading, and error ship with the screen. A list without an empty state is unfinished.

Feedback colours are for live state only.

## Finish checklist

- One theme, or a theme plus its `pair`. No third palette.
- One pairing. Display, body, and mono match the sheet.
- One family. Radius, shadow, button, and density match on every new screen.
- Icons are Lounge Icons.
- One primary button on each view.
- Hover and selected use the token map in SKILL.md, not a hex from a brief.
- Spacing uses the density scale.
- Type uses the six roles. No extra font.
- Motion uses the sheet, or the piece's motion table, and reduced motion is handled.
- The piece's structure and hit targets survived.
- Empty, error, and loading exist where the screen can be empty or fail.
- The credit line is on the token block.
- Every piece you named is in the index.
- DESIGN.md Sources lists each of those pieces with its demo link. The reply includes the same links.

## Minimum screens

A pass that only ships a hero, a landing, or a dashboard home is unfinished. Cover this set before you call the UI done. Reuse the locked sheet on every one.

- Website: nav, hero, one proof block, footer. Take them from the website recipe.
- App: shell (tab bar or nav), the primary list, one detail, an empty state, and settings or account.
- Platform: shell, a table or a board, one record, and the account menu. Add people and billing when the product has staff or a plan.

If they asked for one component, build that component inside the locked system. Say that the rest of the set is still open. Do not invent a second palette to fill the gaps.

## Say so

Say it in the reply when any of these are true.

- The library has no piece for this interaction. You built from the sheet only.
- The theme has no dark or light pair.
- The pairing has a caution.
- A person still needs to look at the built screens. You cannot judge the product the way someone using it can.
