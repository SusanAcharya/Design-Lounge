# Examples

The catalogue is `library/index.json` in this skill. Briefs are `library/briefs/<id>.md`.

## New product, they said go

User: "Payroll app for a Kathmandu studio. Next.js and Tailwind. Just pick something tasteful."

1. Kind `product`. Stack is Next.js + Tailwind. Do not ask again.
2. Read `library/index.json`. Lock the first palette, pairing, and family on kind `product` (Fog City, Friendly SaaS, Quiet, unless the JSON lists a different order). Say those names.
3. Copy that theme's `css`, that pairing's `css`, and that family's rules.
4. Read the briefs named on the kind and the family.
5. Build the landing and the app home. Colours and fonts come from the kit. Layout and motion come from the piece briefs.
6. Leave the credit comment on the token file.

## They want to choose

User: "Company site. Show me palettes."

1. Kind `website`.
2. From that kind's `palettes`, name three: name, mood, primary / secondary / tertiary. No loose hex pickers.
3. After they pick, do the same for two pairings, then lock a family (default Editorial for a public site unless they say otherwise).
4. Copy the locked CSS and rules, read the named briefs, and implement.

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
