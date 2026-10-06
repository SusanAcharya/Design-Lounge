# Examples

Start from `library/map.json` in this skill. Search pieces in `library/pieces.txt`. Briefs are `library/briefs/<id>.md`.

## New product

User: "Payroll app for a Kathmandu studio. Next.js and Tailwind."

1. Kind `product`. Stack is Next.js + Tailwind. Do not ask the stack again.
2. Read `bestFor` on the kind's palettes. Payroll is paying people, so Harbour Ledger (finance) beats Fog City, which is first on the list and is a general app. Pairing is Friendly SaaS, which lists fintech. Family is Quiet, because the tool has to last. Say you rejected Fog City.
3. Put the theme page, the type page, and the demo link for each screen at the top of the reply. Write them into `DESIGN.md` under Sources.
4. Build in the same turn. Open the screens. Run Look, then One correction. They can still say "swap the palette" or "change the table" after.

## A site with no mood words

User: "Site for Tsering's, a twelve-seat momo counter in Boudha. We fold every momo in front of you. No freezer. Open 11 to 8, closed Tuesday."

1. Recipe `restaurant`. No mood word like dark or loud, but the owner's words say a lot. Three words: small, made in front of you, slow.
2. Compare with the three directions' moods. Garden supper is "olive, cream, slow food". Lock it. Do not run the name number: there is no tie.
3. Idea from the habit: the menu is the counter, and each dish is shown being folded. Signature: each dish card folds shut like a momo as you scroll past it.
4. Sections by content. A short menu suits a still bento, not a sticky scroll. A place people visit suits `contact-booking-hours`. Only the hero and the signature move.
5. Real content only: no invented reviews, no star rating, no "since 1998" unless they said it.

## They want to choose first

User: "Payroll app. Show me a few looks before you build."

1. They asked to choose, so do not build yet.
2. Name three palettes and two pairings from the kind's lists, each with its page link. Names and moods only. Stop.

## They asked for more than a default allows

User: "Outdoor gear site, light and airy. I want parallax and lots of motion."

1. Recipe and direction as usual. The direction's theme is light. The parallax brief is written in dusk blue. Translate it by role: same layers and speeds, daylight colours from the theme.
2. Lead effect: `parallax-layered-hero` on the first screen. Supporting effects, one per section: `text-mask-scroll-reveal` on the story, `stacking-cards-scroll` on the products. All on the sheet's easing. Reduced motion stills all three.
3. Write one line in `DESIGN.md`: "Three effects instead of one, because they asked for lots of motion."

## They asked for spectacle

User: "A site for an aquarium's after-hours opening. You scroll and you sink to the bottom of the sea. Make it unforgettable."

0. Write the brief (`brief.md`). Product: the aquarium's after-hours opening. World: deep water, pressure, light that fades. The one thing: you scroll and you sink, their verb kept. Ambition: spectacle, because "unforgettable". Mode: Show, Free, because they named no theme or colour.
1. Recipe `event`. Their words are a journey and "unforgettable", so Show mode in `website.md`. Write `Show: yes, Free` on the sheet.
2. Lock the direction whose mood is a journey you scroll through: Deep field (Lit family). Its Deep Field theme and Night Show pairing are now candidates. If the direction is in recent history, take the next that fits, and claim it at once.
3. Free colour and type. The light is the sun from above, fading as you sink, so the palette is surface teal going to near-black, and one warm colour for the creatures' own light. Written as `--bg`, `--ink`, `--primary` and three `--scene-*`. Type: a display face that is not in the last three Free lines of the history, and a mono for the readouts. Write both on the sheet, each with its reason.
4. Idea as a thing you travel through: "Every scroll is ten more metres down, and the light goes with it." Centrepiece: `scroll-space-voyage`, re-skinned from space to depth: the surface glare instead of the limb of the Earth, then the twilight zone, the lantern fish, the trench. Light: the sun from above, fading.
5. Build the centrepiece first. Hold it to The rendering bar: three layers of depth, light shafts with additive glow, drifting particles, grain, the title huge with one word in the scene's light, three live readouts (depth, pressure, light left). Look at it, improve it twice.
6. Then two supporting sections from the lists, built still: the evenings and tickets (`contact-booking-hours`), and the footer. Not a card that fights the water.
7. The same request from a second person, or a second look for the same opening, lands on another direction, with different colours, faces, and centrepiece. Asked for two looks, one is Free and one is locked to a direction's own theme and pairing. Both are Design Lounge.

## A short request

User: "make a cool scrolling space website"

1. Write the brief first. The full one is the example in `brief.md`. "Cool" alone would mean ambition `finished`, but "scrolling space" is a world you travel through, so ambition `spectacle` and Mode `Show, Free`.
2. No name and no owner, so the product gets a working name marked "(working name, replace)", and Missing lists who it is for. No invented planetarium, no fake dates.
3. Then follow the brief exactly as in They asked for spectacle. The reply names the working name and every Missing line.

## An ops home, they said go

User: "Yard desk. Staff open it every morning. Just build it."

1. Kind `platform`. Use the dashboard recipe in `starts` when it matches: Harbour Ledger, Swiss Precision, and the pieces named there. Developer Docs is a docs face. It does not pair with a finance theme.
2. Write the four lines before layout. Who: yard dispatch, they already know today's date. Decision: which bays need a person. First thing: the count of runs today. Next action: open the week.
3. The count is `kpi-delta`, at display size. The evidence under it is `chart-line-range` or `chart-bar-week`, not a second headline. The list uses `list-empty-plain` when there are zero rows and `load-failed-retry` when the load does not arrive. On a phone, those two are `mobile-list-empty` and `mobile-load-failed`.
4. Write `DESIGN.md` with Sources, then build the minimum platform set. Do not add a marketing hero.

## A personal app, they said go

User: "A Nepali app for my own spending. Just build it."

1. Kind `personal`. Use the personal recipe: Lokta, Devanagari, and the pieces named there. Harbour Ledger is the staff ledger. It is the wrong lock here. Say you rejected it.
2. What to build, before the four lines. The job is a list of their own transactions. Cut the staff dashboard. The home is `spend-list`, not a chart. Four lines. Who: the person who spent the money. Decision: what is left, and which lines made it. First thing: the amount left, in one face, grouped by lakh. Next action: a row opens that line. Where it went is `chart-rank-spend`, a later screen.
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
2. Pick another piece from `pieces.txt`. Replace that line and its demo link.
3. Rebuild the table. Keep the theme, pairing, and family.

## They already have a design system

User: "Add a bench table to this admin. We have a DESIGN.md."

1. Adopt flow. Keep their colours, type, radius, and shadow. Do not lock Night Desk beside Harbour Ledger.
2. Read `library/briefs/dense-data-table.md` for structure, states, motion, and hit targets.
3. Their radius wins over the brief. If they have no radius and a Lounge family is locked, the family wins.
4. Hover and selected colours come from their tokens, mapped as in SKILL.md. Do not copy `#f3f5f9` out of the brief.

## They name a brand

User: "Make our invoicing app look like Stripe."

1. Brand flow. Fetch `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/stripe/DESIGN.md`.
2. Its colours, fonts, and radius are the system. Its font isn't free, so use the stand-in it names.
3. Pieces still give the structure: an invoice table, a record, an empty state. Map the brief's colours onto the brand file's roles.
4. Keep their app's own name and logo. Sources lists the brand file's URL and each piece's demo link.

## A redesign

User: "Redesign our clinic site. It looks dated."

1. They didn't say whether to keep the brand. The logo and teal are on every page, so ask once: "Keep the current brand, or start the look again?"
2. They say keep it. Open the site and write the Redesign block in practice.md.
3. Fix the type first, then the spacing, then calm the neutrals. Stop once it no longer looks dated.
4. The URLs, the nav labels, and the booking form's fields stay exactly as they were.

## Both modes

User: "Same product, day and night."

1. Lock one theme. Read its `pair`.
2. Paper & Ink pairs with Night Desk. Use both CSS blocks. Same pairing, same family.
3. Fog City pairs with Fog Night. Signal Green pairs with Signal Paper. Every theme has a pair. Put the second block under `@media (prefers-color-scheme: dark)` or a `[data-mode]` switch.

## The screens exist, now look

User: "Just build it" — and the screens are in the app.

1. Open the home at 1280×800. Write the look notes.
2. The headline says "Unlock your workflow". That sentence still works if the product is a bank or a clinic. Rewrite it to the noun and the number they gave you. "Payroll for 46 people, filed Friday."
3. The features are three cards with the same icon circle, the same title size, and a sentence that could move to any site. Replace that row with the feature piece you named, and write copy that is only true here.
4. Open the screen again. Fails are none. Then run the finish checklist.

## One component, kit already locked

User: "Add the pricing section."

1. Do not open a new palette.
2. Search `pieces.txt` for `pricing`. Read `library/briefs/<id>.md`.
3. Rebuild it. Swap its colours and fonts for the locked kit. Keep its toggle, type scale, and motion.

## A Flutter app

User: "Flutter app for a Pokhara cycling club. Members log rides and see the weekend route."

1. Kind `personal` is wrong: this is a group. Recipe `mobile-app`, then pick a direction by their words (outdoor, a club, weekends). Read [app.md](app.md) and [native.md](native.md).
2. Build `theme.dart` from `library/themes/<id>.json` (and its `pair` for dark mode), `library/pairings/<id>.json`, and `library/app.json`. Map the roles onto `ColorScheme` by the table in native.md. No `ColorScheme.fromSeed`.
3. Load the pairing's fonts with `google_fonts`, or bundle them, since riders are often offline. Tracking in em becomes points.
4. Screens from pieces: `phone-tab-plain` (or `m3-navigation-bar` on Android), `mobile-run-detail` for a ride, `phone-map-listings` for the route, `mobile-list-empty`, `mobile-load-failed`, `ios-grouped-settings`. Translate each brief's CSS with the CSS to native table.
5. Look on a simulator: light, dark, and the largest text size, on iOS and Android. Name the screenshot files in the closing block.
