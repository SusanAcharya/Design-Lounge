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

## One component, kit already locked

User: "Add the pricing section."

1. Do not open a new palette.
2. Find a `pricing` piece in `pieces`. Read `library/briefs/<id>.md`.
3. Rebuild it. Swap its colours and fonts for the locked kit. Keep its toggle, type scale, and motion.
