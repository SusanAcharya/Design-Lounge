# Examples

The catalogue is `library/index.json` in this skill. Briefs are `library/briefs/<id>.md`.

## New product, they have not said go

User: "Payroll app for a Kathmandu studio. Next.js and Tailwind."

1. Kind `product`. Stack is Next.js + Tailwind. Do not ask the stack again.
2. Read `bestFor` on the kind's palettes. Payroll is paying people, so Harbour Ledger (finance) beats Fog City, which is first on the list and is a general app. Pairing is Friendly SaaS, which lists fintech. Family is Quiet, because the tool has to last. Say you rejected Fog City.
3. Reply with the theme page, the type page, and the demo link for each screen you will build. One question: build this, or swap the palette or one of these screens?
4. Stop. Do not write UI in this turn.
5. When they say yes, or "just build it", write `DESIGN.md` with those links under Sources, then build.

## They said go

User: "Same app. You pick. Just build it."

1. Lock the match you already named: Harbour Ledger, Friendly SaaS, Quiet. Do not ask. Do not switch to Fog City because it is first.
2. Write `DESIGN.md`, including Sources and the rejected theme, before the screens.
3. Build. Open the screens. Run Look, then One correction. Put the same demo links in the reply so they can still compare and ask for a change.

## An ops home, they said go

User: "Yard desk. Staff open it every morning. Just build it."

1. Kind `platform`. Use the dashboard recipe in `starts` when it matches: Harbour Ledger, Swiss Precision, and the pieces named there. Developer Docs is a docs face. It does not pair with a finance theme.
2. Write the four lines before layout. Who: yard dispatch, they already know today's date. Decision: which bays need a person. First thing: the count of runs today. Next action: open the week.
3. The count is `kpi-delta`, at display size. The evidence under it is `chart-line-range` or `chart-bar-week`, not a second headline. The list uses `list-empty-plain` when there are zero rows and `load-failed-retry` when the load does not arrive. On a phone, those two are `mobile-list-empty` and `mobile-load-failed`.
4. Write `DESIGN.md` with Sources, then build the minimum platform set. Do not add a marketing hero.

## A personal app, they said go

User: "A Nepali app for my own spending. Just build it."

1. Kind `personal`. Use the personal recipe: Lokta, Devanagari, and the pieces named there. Harbour Ledger is the staff ledger. It is the wrong lock here. Say you rejected it.
2. Four lines. Who: the person who spent the money. Decision: what is left, and what is over. First thing: the amount left, in one face, grouped as 44,211 or 1,24,000. Next action: see where it went, which opens `chart-rank-spend`.
3. Identity is the theme, one paper grain on the page background, and Noto Serif Devanagari on the amount. The nouns alone are not the Nepali part.
4. A budget row uses warning only when it is over the line. A save stays on screen as `saved-banner`. The phone uses `phone-tab-plain`, not the glass bar.
5. Write `DESIGN.md` with Sources, then build. Open the screens. If the browser cannot paint, measure the DOM as Look describes.

## A shop, they said go

User: "A clay shop. People should be able to buy a bowl. Just build it."

1. Use the commerce recipe in `starts`: Kiln, Atelier, and the pieces named there.
2. Four lines. Who: a buyer who already knows the shop. Decision: which piece to take home. First thing: the product name. Next action: add it to the bag, which opens the cart.
3. Order is fixed: `shop-collection`, then `shop-product`, then `shop-cart`, then `mobile-one-page-checkout`. The collection does not link to a fragrance page unless they asked for that product.
4. A form on the way uses `select-field` for a closed list of choices. Write `DESIGN.md` with Sources, then build.

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
3. Harbour Ledger pairs with Harbour Night. Lokta pairs with Lokta Night. Use both CSS blocks. If `pair` is null, build the one mode and say it has no twin.

## The screens exist, now look

User: "Just build it" — and the screens are in the app.

1. Open the home at 1280×800. Write the look notes.
2. The headline says "Unlock your workflow". That sentence still works if the product is a bank or a clinic. Rewrite it to the noun and the number they gave you. "Payroll for 46 people, filed Friday."
3. The features are three cards with the same icon circle, the same title size, and a sentence that could move to any site. Replace that row with the feature piece you named, and write copy that is only true here.
4. Open the screen again. Fails are none. Then run the finish checklist.

## One component, kit already locked

User: "Add the pricing section."

1. Do not open a new palette.
2. Find a `pricing` piece in `pieces`. Read `library/briefs/<id>.md`.
3. Rebuild it. Swap its colours and fonts for the locked kit. Keep its toggle, type scale, and motion.
