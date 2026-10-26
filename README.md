# Design Lounge

A design library by [Susan Acharya](https://acharyasusan.com.np). Browse it at [www.designlounge.live](https://www.designlounge.live), or give it to your agent, as an MCP server or as a skill, and let it design from it.

Free to use in products. Keep the credit. Do not republish the catalogue as a catalogue.

## Install the MCP server

The MCP server is the whole Lounge. It installs the skill for you, then adds tools the skill cannot have: library search with a picture of every piece, theme, and pairing; direction picks that come out the same every time and keep two sites apart; and a review of the page your agent built. The review covers AI giveaways, drift from the locked kit, accessibility, and whether search engines and AI assistants can find and quote it (SEO, AEO, GEO), with screenshots at laptop and phone size.

In Claude Code:

```bash
claude mcp add design-lounge --scope user -- npx -y design-lounge-mcp@latest
```

Cursor, Windsurf, Claude Desktop, and other clients take this in their MCP settings:

```json
{
  "mcpServers": {
    "design-lounge": { "command": "npx", "args": ["-y", "design-lounge-mcp@latest"] }
  }
}
```

Reload the client once after the first start, so it picks up the skill. For screenshots, ask your agent to run `install_browser` once. VS Code, Codex, every tool, and what the server writes and fetches are in [mcp/README.md](mcp/README.md).

For Claude.ai, ChatGPT, and other clients that cannot run a local program, there is a hosted endpoint: `https://www.designlounge.live/api/mcp`. Add it as a custom connector. It has the library and reviews public URLs, but it cannot read your files, keep your history, install the skill, or take screenshots.

## Or install the skill alone

The skill is lighter: files your agent reads, with nothing running. Run this in the project you want designed. The installer needs Node 22.20 or newer. It works in Cursor, Claude, Codex, and the other agents the installer lists. The skill arrives with the catalogue: palettes, type pairings, icons, motion, and every piece brief.

```bash
npx skills add SusanAcharya/Design-Lounge
```

Then describe the product, who it is for, and the job of this pass. The agent locks one palette, one type pairing, one component family, and the pieces that fit, and it keeps later screens on that same sheet. It does not invent a second set of colours or fonts.

That is the design system. It is not a person reviewing the finished screens, though the MCP server's review gets closer. When the library has no piece for the job, the agent is supposed to say so.

Install it once for every project:

```bash
npx skills add SusanAcharya/Design-Lounge -g
```

Skip the prompts and name the agents:

```bash
npx skills add SusanAcharya/Design-Lounge -g -y --agent cursor claude-code codex
```

Or point an agent at this repo: [github.com/SusanAcharya/Design-Lounge](https://github.com/SusanAcharya/Design-Lounge). It should read `AGENTS.md`, then `skills/design-lounge/SKILL.md`.

## What’s in it

- **Pieces** — heroes, footers, landings, portfolios, dashboards, phone screens, motion. By name at `/sections`, by problem at `/collections`, the whole floor at `/browse`.
- **System** — type pairings, full colour roles (primary, secondary, tertiary, feedback, surfaces), Lounge Icons, motion recipes.
- **Kit** — `/kit`. Choose a website, a product, or a platform. Pick a palette, a pairing, and a component family. A website frame and a phone both update. The last step is a brief.
- **Start** — `/start`. Eight recipes (marketing site, portfolio, landing, app, design system, dashboard, shop, editorial) that already name a theme, a pairing, and the pieces to open.

## Run the site

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm build          # static site in dist/
pnpm preview
pnpm check:pieces   # every piece against docs/PIECE-SPEC.md
pnpm mcp:test       # the MCP server's tests (run pnpm install in mcp/ first)
```

## Layout

```
src/demos/<slug>.html           live demo, one file
src/content/pieces/<slug>.md    frontmatter + agent brief
src/data/                       themes, type, icons, motion, kit, shelves, start recipes
src/pages/p/[slug].astro        piece page
src/pages/kit/                  composer
skills/design-lounge/           the agent skill, library included
mcp/                            the MCP server, which reads that skill folder
api/mcp.mjs                     the hosted MCP endpoint at /api/mcp
docs/PIECE-SPEC.md              the contract every piece follows
```

## Adding a piece

1. Read `docs/PIECE-SPEC.md`.
2. Add `src/demos/<slug>.html` and `src/content/pieces/<slug>.md`.
3. Run `pnpm check:pieces` until your slug is clean.
4. Add the slug to a shelf in `src/data/collections.ts` if it belongs on one.
5. Run `pnpm skill:sync` and commit `skills/design-lounge/library` so the next install includes it. The hosted MCP endpoint has it on the next deploy.
6. For people who use the MCP server from npm, release it: `pnpm --dir mcp release patch`. It syncs, tests, and publishes. Approve the npm release when npm asks.

Pieces are numbered by publish date, then title. Don’t backdate.

## Keyboard

| Key | Does |
| --- | --- |
| `⌘K` `/` | search |
| `r` | random piece |
| `t` | day / night |
| `[` `]` | previous / next piece |
| `c` | copy the brief |

## Credit

Susan Acharya · Kathmandu · [acharyasusan.com.np](https://acharyasusan.com.np)

The skill folds in ideas from [taste-skill](https://github.com/Leonxlnx/taste-skill) by Leon Lin (MIT) and brand files from [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) by VoltAgent (MIT), and it uses [playwright-cli](https://github.com/microsoft/playwright-cli) by Microsoft to look at pages. You do not need to install them separately.
