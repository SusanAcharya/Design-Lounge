# Apps and tools

Read this after [practice.md](practice.md) when the job is an app, a tool, a dashboard, a platform, a shop, or a tablet screen. A daily tool stays quiet: motion is the sheet's 200, 320, and 400ms, with no effect piece unless they asked. If they did, Register is in [website.md](website.md). A native app or a PWA also reads [native.md](native.md).

## The one screen

A daily tool stays quiet. It still needs one screen that could only be this product. Write it on the sheet as `Idea:`. It is a picture, not an adjective.

These are fails, unless they asked for one by name:

- Four tabs named Home, Search, Activity, and Profile, filled with the demo's sample rows.
- A home made of four equal numbers.
- A greeting ("Good evening, Alex"), a purple gradient, and a glass card.

Good: "The home is today's three deliveries, and the next stop is already open." "The first screen is the recording, the timer big enough to read from across the counter."

Not an idea: "Clean and modern." "A sleek dashboard." "Intuitive and premium."

The idea picks the primary screen. The tabs are the real sections of that product, three to five. Write `Avoiding:` with the default you did not use.

One thing on that primary screen is made only for this product: a control, a layout, or a piece of type. That is the Signature. A new palette is not a signature.

## Which piece

Open the brief. Read it down to "Optional below this line". Restyle it onto the locked theme and pairing. The longer list is in [components.md](components.md). If `pieces.txt` has no piece for the job, say so. Do not invent a slug.

On Android, or when the family is Material, use the `m3-` piece when one is named for that job. Otherwise use the phone piece and follow the Android rules in [native.md](native.md): a flat list, a top app bar, a back arrow. Do not put iOS grouped cards on Android, or a Material back arrow on iOS.

- First open: `phone-splash-launch`, under 1.6s, then the primary screen. Not a marketing hero.
- Sign in: `phone-sign-in`, or `m3-sign-in` on Android. Sign up: `phone-sign-up-steps`. A passkey: `auth-passkey-setup`.
- First run: `ios-onboarding-carousel`, then `phone-permission-prompt` before any system prompt. Never on launch.
- The list: the piece that matches the content (inbox, feed, spend, search, map). Empty is `mobile-list-empty`. A failed load is `mobile-load-failed`. Pull to refresh is `ios-pull-to-refresh`.
- The detail: the piece for that content. On Android, a row that grows into the screen is `m3-list-detail`. On iOS, a large title that collapses is `ios-large-title-collapse`.
- Settings: `ios-grouped-settings` or `m3-settings-list`. Then only the rows the product has: `phone-account-edit`, `phone-notification-settings`, `phone-privacy-data`, `phone-subscription-manage`.
- An account the person can create needs `phone-delete-account`. A price needs `phone-paywall-plans` or `phone-subscription-manage`, with the date and the monthly price.
- A rating ask is `phone-rating-prompt`, after a success, never on first launch, then the system prompt.
- Large text: build every screen so it survives `phone-large-text-layout`. Rows grow. A two-column row stacks. Nothing ends in "...".

## After the action

The next action lands on a named screen. Write that name in the system sheet before you draw the button.

- A list opens the detail you already named.
- A form stays on the form until the fields are valid. Then it confirms on that screen, or opens the next named screen. A field error sits under the field. It is not a toast.
- A shop is four screens, in this order: collection, one product, cart, checkout. Do not invent a fifth. The collection's action opens the product. The product's action opens the cart. The cart's action opens checkout. On the web, take them from the commerce recipe. On a phone, take them from the shop-app recipe.
- A tablet is the tablet recipe: a split or a sidebar, one primary pane, one detail. A phone list stretched wide is the wrong piece.
- The confirmation says what changed, in one sentence, and offers one next action. It keeps the same theme, pairing, and family.
- If the action can fail, use the failed-load piece or the field error. A toast that disappears is not the failure.

## Break one rule

One display size, one primary, and the sample tab count are defaults. A designer breaks one when the content cannot be said otherwise. You may break one per screen. Write it on the sheet, or you did not break it.

- One display size. Break it only when two numbers are both the decision, such as money in and money out. The second is one step smaller, not equal. A third display size is not allowed.
- Tab count. `phone-tab-plain` shows four tabs because that demo has four sections. A product uses three to five, one per real section. Do not add a tab to match the demo, and do not drop a section they named to stay at four.

A confirm dialog does not break the one-primary rule. Cancel is outline. The destructive action is the one solid button.

Do not break a rule to fill empty space, to look more designed, or because another app had it. If you cannot name the content that required the break, keep the default.

## Minimum screens

A pass that only ships a hero, a landing, or a dashboard home is unfinished. Cover this set before you call the UI done. Reuse the locked sheet on every one.

- Website: nav, hero, one proof block, footer. Take them from the website recipe. The proof block is pictures of the work or the product, not a list.
- App: shell (tab bar or nav), the primary list, one detail, an empty state, and settings or account.
- Platform: shell, a table or a board, one record, and the account menu. Add people and billing when the product has staff or a plan.
- Shop: a collection, one product, the cart, and checkout. Take them from the commerce recipe.
- Tablet: a split or a sidebar, one primary pane, and one detail. Take them from the tablet recipe.

If they asked for one component, build that component inside the locked system. Say that the rest of the set is still open. Do not invent a second palette to fill the gaps.
