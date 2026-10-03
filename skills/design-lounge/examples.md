# Examples

The catalogue is `library/index.json` in this skill. Briefs are `library/briefs/<id>.md`.

## New product, they have not said go

User: "Payroll app for a Kathmandu studio. Next.js and Tailwind."

1. Kind `product`. Stack is Next.js + Tailwind. Do not ask the stack again.
2. Read `library/index.json`. Choose the first palette, pairing, and family on kind `product` (Fog City, Friendly SaaS, Quiet, unless the JSON lists a different order).
3. Reply with the theme page, the type page, and the demo link for each screen you will build. One question: build this, or swap the palette or one of these screens?
4. Stop. Do not write UI in this turn.
5. When they say yes, or "just build it", write `DESIGN.md` with those links under Sources, then build.

## They said go

User: "Same app. You pick. Just build it."

1. Lock that first palette, pairing, and family. Do not ask.
2. Write `DESIGN.md`, including Sources, before the screens.
3. Build. Put the same demo links in the reply so they can still compare and ask for a change.

## An ops home, they said go

User: "Yard desk. Staff open it every morning. Just build it."

1. Kind `platform`. Use the dashboard recipe in `starts` when it matches: Harbour Ledger, Developer Docs, and the pieces named there.
2. Write the four lines before layout. Who: yard dispatch, they already know today's date. Decision: which bays need a person. First thing: the count of runs today. Next action: open the week.
3. The count is `kpi-delta`, at display size. The evidence under it is `chart-line-range` or `chart-bar-week`, not a second headline. The list uses `list-empty-plain` when there are zero rows and `load-failed-retry` when the load does not arrive. On a phone, those two are `mobile-list-empty` and `mobile-load-failed`.
4. Write `DESIGN.md` with Sources, then build the minimum platform set. Do not add a marketing hero.

## They want options

User: "Company site. Show me palettes."

1. Kind `website`.
2. From that kind's `palettes`, name three: name, mood, and `{site}/themes/<id>`. No loose hex pickers.
3. After they pick, do the same for two pairings, then lock a family (default Editorial for a public site unless they say otherwise).
4. Copy the locked CSS and rules, read the named briefs, write Sources, and implement.

## They want one screen changed

User: "The table feels wrong. Use a different one."

1. Read Sources in `DESIGN.md`. Find the line whose role is the table.
2. Pick another piece in the index. Replace that line and its demo link.
3. Rebuild the table. Keep the theme, pairing, and family.

## They already have a design system

User: "Add a bench table to this admin. We have a DESIGN.md."

1. Adopt flow. Keep their colours, type, radius, and shadow. Do not lock Night Desk beside Harbour Ledger.
2. Read `library/briefs/dense-data-table.md` for structure, states, motion, and hit targets.
3. Their radius wins over the brief. If they have no radius and a Lounge family is locked, the family wins.
4. Hover and selected colours come from their tokens, mapped as in SKILL.md. Do not copy `#f3f5f9` out of the brief.

## Both modes

User: "Same product, day and night."

1. Lock one theme. Read its `pair`.
2. Paper & Ink pairs with Night Desk. Use both CSS blocks. Same pairing, same family.
3. Harbour Ledger's `pair` is null. Build the one mode and say it has no twin.

## One component, kit already locked

User: "Add the pricing section."

1. Do not open a new palette.
2. Find a `pricing` piece in `pieces`. Read `library/briefs/<id>.md`.
3. Rebuild it. Swap its colours and fonts for the locked kit. Keep its toggle, type scale, and motion.
