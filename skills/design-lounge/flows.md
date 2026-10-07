# Flows for other jobs

Open this file only when What they are asking in [SKILL.md](SKILL.md) sends you to one of these: an app, a project that already has a design system or a site to redesign, or a named brand. A new website never needs it.

## An app, the short path

The full method is long. For a phone app, a web app, a desktop window, or a native app, these are the steps. Open the named section only when you reach its step. A public website uses the website short path in [SKILL.md](SKILL.md). A PWA uses the recipe for its job, then PWAs in [native.md](native.md).

0. Write the brief ([brief.md](brief.md)). An app is always Mode `Kit`.
1. Read `~/.design-lounge/history.jsonl`. Write three words for the subject's world. Take the recipe from the kind map in [reference.md](reference.md): bank, health, messages, music, news, shop, social, weather, `personal` for someone's own money or habits (not `bank`), or the general mobile app. Then open its file and lock a direction whose mood names that world, not one used recently for this recipe. The name number only breaks a tie. Append the pick.
2. Write the Idea (The one screen in [app.md](app.md)). Name the real tabs, three to five. Do not copy Home, Search, Activity, Profile unless those are the product's sections.
3. Pick the platform once. iOS uses the `phone-` and `ios-` pieces. Android, or a Material family, uses the `m3-` piece when one exists for that job. One tab bar. A web app or a desktop window has no phone tab bar: the shell is `sidebar-workspace-switcher` or `collapsing-sidebar-rail`.
4. Build the minimum set before you stop: the shell, the primary list, one detail, the empty state, the failed load, and settings or account. Open each brief down to "Optional below this line".
5. Accounts add sign-in and delete-account. A price adds the paywall or the subscription screen, with real dates. A rating uses `phone-rating-prompt`, after a success, never on first launch.
6. Restyle every piece onto the locked theme and pairing. The demo's colours and fonts do not come along.
7. Screenshot light, dark, and the large text size (Looking at the app in [native.md](native.md)). Fix what you see. Make one correction.
8. End with the closing block in The reply in [SKILL.md](SKILL.md).

## Adopt flow

Use this when a design system is already in the project.

1. Keep their colours, type, radius, and shadow. Do not lock a second Lounge palette on top.
2. Take structure, states, motion, and hit targets from the piece briefs. Name the demos you take structure from.
3. Restyle onto a Lounge kit only when they asked for a new look. A refine that asks for scroll, hover, or a cursor keeps their colours and adds effect pieces from Register in [website.md](website.md).

For a redesign, first decide which kind it is: keep the brand, or start the look again. If you can't tell, follow When to ask in [SKILL.md](SKILL.md). Then follow Redesign in [practice.md](practice.md), which is the audit. Keeping the brand stays in this flow: no new theme, and no brief unless the product itself changes, but read the files for its kind (for a site, [website.md](website.md) and Page shape and Craft in [taste.md](taste.md)). Starting the look again is a new build: write the brief and take the website or app short path, keeping the content. Look at the site before you change it. Never change the URLs, the nav labels, the form field names, the logo, or the legal text unless they asked.

## Brand flow

Use this when they want the product to look like a brand they named.

1. Find the brand in Brand files in [reference.md](reference.md). Fetch its file from `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<slug>/DESIGN.md`. It lists that brand's colours, type, radius, spacing, and components.
2. Treat that file as their design system and follow Adopt flow, with the brand file as "their" system: its colours, fonts, and radius replace the project's own and win over the Lounge theme. The project keeps its pages, names, and content. The structure, states, and motion still come from the piece briefs, and an app still takes its screens from the app short path.
3. If the brand uses a font you can't load, use the stand-in the file names. Never copy the brand's logo, name, wordmark, photos, or words. The product keeps its own name.
4. Put the file's URL in `DESIGN.md` under Sources.

If the brand isn't in the list, say so. Then pick the closest Lounge theme and pairing, and say which one you picked and why.
