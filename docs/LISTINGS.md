# Directory listings for Design Lounge

Copy-paste text for MCP and AI-tool directories. Each listing links back to https://www.designlounge.live,
which is what builds search ranking. Counts are rounded on purpose (the library grows).

## Facts every listing uses

- Name: Design Lounge
- One line: A free design library and reviewer for AI coding agents: 600+ live UI pieces with build briefs, 80+ themes, 40+ type pairings, and a review for AI giveaways, SEO, AEO and GEO.
- Website: https://www.designlounge.live
- Install (Claude Code): `claude mcp add -s user design-lounge -- npx -y design-lounge-mcp@latest`
- Install (any MCP client): command `npx`, args `-y design-lounge-mcp@latest`
- Remote endpoint: https://www.designlounge.live/api/mcp
- npm: https://www.npmjs.com/package/design-lounge-mcp
- MCP Registry name: io.github.SusanAcharya/design-lounge
- Source: https://github.com/SusanAcharya/Design-Lounge
- Benchmark: https://www.designlounge.live/benchmark
- Author: Susan Acharya, https://acharyasusan.com.np
- Price: free. Licence: free to use in your products (see LICENSE).
- Tags: design, ui, frontend, design-system, accessibility, seo, mcp, claude-code, cursor

## Short description (about 300 characters)

Design Lounge gives your AI coding agent design taste. It locks one palette, one type pairing and a component family from a library of 600+ live pieces, builds each section from a numeric brief, then reviews the page for AI giveaways, accessibility, SEO, AEO and GEO. Free, on npm and as a hosted MCP endpoint.

## Long description

Most AI-built pages look the same: a gradient hero, three feature cards, grey text nobody can read. Design Lounge is an MCP server and agent skill that gives the agent a real direction instead.

- **start_design** reads what you are making and returns a plan: the product kind, the rules, the next calls.
- **get_recipe, get_theme, get_pairing, get_family** lock one look: a palette as CSS tokens, a type pairing with sizes, a radius and density.
- **get_piece, search_pieces** return build briefs for 600+ live pieces (sections, app screens, components, motion), each with a picture.
- **review_page** opens the built page in Chromium and fails what looks machine-made, then checks accessibility (axe), SEO, AEO and GEO.
- **match_reference** names the kit closest to a site or screenshot you like.

On the same prompts and model, builds with Design Lounge had 0 review fails against 16 without it, no text below readable contrast against 92 elements, and an accessibility score of 100. The builds are linked on https://www.designlounge.live/benchmark.

Works in Claude Code, Cursor, Codex, VS Code, Windsurf and Claude Desktop through npm, and in Claude.ai or ChatGPT through the hosted endpoint.

## Where to submit

| Directory | How | Notes |
|---|---|---|
| awesome-mcp-servers (punkpeye) | Pull request adding one line under a fitting category | One line: `- [SusanAcharya/Design-Lounge](https://github.com/SusanAcharya/Design-Lounge) 📇 🏠 ☁️ - <one line above>` |
| Glama | glama.ai/mcp/servers, "Add server", point at the GitHub repo | Indexes the repo and scores it |
| mcp.so | "Submit" on the site, paste the GitHub URL | |
| Smithery | smithery.ai, "Add server", connect the GitHub repo | Can also list the remote endpoint |
| PulseMCP | Reads the official MCP Registry; check it is listed, else use its submit form | Already in the Registry |
| Product Hunt | A launch post with the benchmark screenshots | Best on a Tuesday to Thursday |
| Your profiles | GitHub profile README, Dribbble, LinkedIn, X bio | Link https://www.designlounge.live |
