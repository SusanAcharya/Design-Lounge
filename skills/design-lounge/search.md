# Found and quoted

Read this when you finish a public website, or when they ask about SEO, AEO, GEO, AI search, or being found. Not for an app behind a login.

SEO is search engines indexing the page and showing it well. AEO is answer engines (featured snippets, AI Overviews, voice) lifting a direct answer from it. GEO is generative engines (ChatGPT, Claude, Perplexity, Gemini) reaching it, reading it, and naming the business right. Every check here is one you can verify on the page. None of them promises a ranking, so do not promise one in the reply.

With the Design Lounge MCP, `audit_search` runs these checks and `suggest_schema` writes the JSON-LD from the page's own facts.

## The head

- Title: what the page is, then the name. 30 to 60 characters. "Momo counter in Patan · Kettle & Fold". Never "Home" or the framework's default.
- Description: one or two plain sentences, 70 to 160 characters: what it is, who it is for, where. Answer engines quote it.
- `lang` on `<html>`, the viewport meta, and an absolute https canonical.
- Share card: `og:title`, `og:description`, `og:image` (absolute URL, the 1200 × 630 image from Logo and favicon in [components.md](components.md)), `og:url`, `og:type`, and `twitter:card` set to `summary_large_image`.
- No `noindex` at launch. A pitch or staging copy keeps `noindex` and a robots.txt Disallow, and the reply says to lift both at launch.

## The page

- One h1 that names the subject. Headings go down one level at a time. Choose the level by the outline, then style it however the design needs.
- The first sentence under the headline says what it is, for whom, and where, in under 30 words. It is the sentence that gets quoted.
- Every image has alt text that says what it shows. A decorative one gets `alt=""`. Every image has width and height, so the page does not jump.
- The text is in the HTML as served. Most AI crawlers do not run JavaScript. Build it static or render it on the server. An empty `#root` is invisible to them.

## Questions

When people ask things before they come or buy (the price, the hours, parking, how long it takes), answer the real ones with their facts. Do not invent questions they would not ask.

- The question is a heading. The answer starts in the first sentence under it, under 50 words, then the detail.
- The answer is in the HTML, not loaded on click. `faq-two-column-search` and `faq-category-accordion` keep it there.
- Steps are an `<ol>`. A comparison is a `<table>`.

## Structured data

- One JSON-LD block for the business or person, in the most specific schema.org type: `Restaurant`, `Dentist`, `LocalBusiness`, `Person`, `SoftwareApplication`, or `Organization`.
- It holds `name`, spelled as on the page, `url`, `image` or `logo`, and only the facts they gave: `address`, `telephone`, `openingHoursSpecification`, and `sameAs` with their real profiles.
- A FAQ section gets `FAQPage`, with the same questions and answers, word for word as shown.
- An article gets `author`, `datePublished`, and `dateModified`, and shows the author and date on the page too.
- Never a rating, a review, or a price that is not on the page.
- One name everywhere: the title, the wordmark or h1, the JSON-LD, and the footer. Engines join facts by name.

## Crawlers

- `robots.txt` at the root allows everything they want found, and has a `Sitemap:` line. `sitemap.xml` lists each page, with `<lastmod>` only where the date is true.
- Answer crawlers (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot) fetch the page when someone asks an assistant about it. Never block them. Blocking training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) is the owner's choice and does not take the site out of AI answers. Leave them allowed unless they said otherwise.
- `llms.txt` is optional. No major engine has said it reads one, so add it last, if at all.

## In the reply

Under Still open, list the facts the structured data needs that they did not give: the address, the hours, the profiles.
