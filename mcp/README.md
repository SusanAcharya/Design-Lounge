# Design Lounge MCP

Design Lounge as an MCP server. Your agent can:

- **Design from the library**: 543 piece briefs, 84 themes, 46 type pairings, 43 recipes with directions, Lounge Icons, and Sanzo Wada's colour combinations. It picks a direction the same way every time and keeps two sites from looking alike.
- **Remove AI giveaways**: stock copy, em dashes, icon-card trios, gradients, the indigo palette, emoji icons, made-up numbers, and drift from the locked theme, pairing, and family.
- **Get found and quoted**: SEO, AEO (answer engines), and GEO (ChatGPT, Claude, Perplexity, Gemini). It checks the head, the share card, robots.txt for search and AI crawlers, server-rendered text, and JSON-LD.
- **Look at the page**: Chromium at 1280×800 and 390×844 with reduced motion. It runs axe, measures faces, labels, primaries, and tap targets, and saves the screenshots.

The server reads the same `skills/design-lounge` folder as the skill, so the rules live in one place. The skill is the method. The server does the parts that prose cannot: search, deterministic picks against the history, pictures of every piece, theme, and pairing, and checks that read and render the page.

## The skill comes with it

Installing the server installs the skill. When the server starts, it puts the skill in `~/.agents/skills/design-lounge` and links it into the skills folder of each client on the machine: Claude Code (`~/.claude/skills`), Cursor (`~/.cursor/skills`), and Codex (`~/.codex/skills`). That is the same layout the `skills` CLI uses. Clients that load skills then have the whole method before they design. Reload the client once after the first start.

- It updates its own copy when the server updates.
- It leaves alone a copy that something else installed, such as `npx skills add` or a hand edit, and says so. `install_skill` with `replace: true` swaps it for the server's copy.
- `install_skill` with `project_path` also copies it into a project's `.claude/skills`, `.cursor/skills`, and `.agents/skills`, for clients that only read project skills.
- In a client with no skill support, `start_design` returns the rules that must hold (their words win, the Rules list, and the Look fails), read from the same files, and `read_guide` serves the rest.
- `DESIGN_LOUNGE_SKILL_INSTALL=off` turns the install off.

## Add it to your agent

**Claude Code**

```sh
claude mcp add design-lounge --scope user -- npx -y design-lounge-mcp@latest
```

**Cursor** (`~/.cursor/mcp.json`), **Windsurf**, **Claude Desktop** (`claude_desktop_config.json`), and other clients that take this shape:

```json
{
  "mcpServers": {
    "design-lounge": { "command": "npx", "args": ["-y", "design-lounge-mcp@latest"] }
  }
}
```

**VS Code** (`.vscode/mcp.json`):

```json
{ "servers": { "design-lounge": { "type": "stdio", "command": "npx", "args": ["-y", "design-lounge-mcp@latest"] } } }
```

**Codex** (`~/.codex/config.toml`):

```toml
[mcp_servers.design-lounge]
command = "npx"
args = ["-y", "design-lounge-mcp@latest"]
```

`@latest` makes each start check for a new release, so library updates reach you without reinstalling. Reload the client once after the first start, so it picks up the skill the server installs.

The rendered checks (screenshots, axe, measured labels and buttons, theme boards and type specimens) need a headless Chromium. Ask your agent to run `install_browser` once (about 100 MB), or run `npx playwright install chromium --only-shell`. Without it, every other check still runs, and the report says it did not look.

To run it from a clone of the repo instead: `cd mcp && pnpm install`, then use `node /path/to/designs/mcp/src/server.mjs` as the command.

## Tools

| Tool | What it does |
| --- | --- |
| `start_design` | Call first. Reads their words (flow, mode, named style, calm words), ranks recipes, reads the project folder and the recent picks, and returns the brief and the steps |
| `get_recipe` | A recipe's directions, each marked when the history blocks it |
| `pick_direction` | Calm-word filter, the history, the group check, then the name number. You pass the directions that fit |
| `check_pick` | The uniqueness check for hero, work, footer, shape, and frame. Returns the Unlike line |
| `record_pick` | Appends a claimed or finished line to `~/.design-lounge/history.jsonl` and reports an earlier claim |
| `search_pieces` / `get_piece` | Find a piece and read its brief. `get_piece` attaches the demo's thumbnail, and `demo: true` adds its HTML source. `search_pieces` with `images: true` attaches the first six thumbnails |
| `browse_library` | Themes and pairings by mood, plus families, recipes, categories, collections, kinds, motion, and scales |
| `get_theme` / `get_pairing` / `get_family` | The locked tokens and rules, as CSS. A theme comes with a board of its roles, and a pairing with a type specimen |
| `get_icons` / `search_wada` | Lounge Icons as SVG. Wada's combinations by word or by nearest hex |
| `read_guide` | Any method file, or one section of it |
| `review_page` | Everything at once: design, accessibility, SEO, AEO, GEO. Fails come first, each with its evidence and fix. The web and phone frames come back as images |
| `install_skill` | Install the skill in a project, or replace a user copy installed another way |
| `install_browser` | Download the headless Chromium the rendered checks use, once |
| `audit_slop` | Design only: AI giveaways and kit drift |
| `audit_search` | SEO, AEO, and GEO only |
| `suggest_schema` | JSON-LD built only from facts on the page, with the missing fields listed |

Every review tool takes `path` (a file, or a folder with `index.html`), `url` (live or localhost), or `html`. For a `path`, it reads `DESIGN.md` beside the page or above it to learn the locked theme, pairing, family, Free mode, and Named aesthetic. A Named aesthetic lifts the bans it lists.

The server also offers three prompts, `design`, `review`, and `deslop`, and the method files as resources at `lounge://guide/<file>`.

## What it writes, and what leaves your machine

- **The skill.** On start, it writes the skill to `~/.agents/skills/design-lounge` and links it into `~/.claude/skills`, `~/.cursor/skills`, and `~/.codex/skills` for the clients you have. A copy it did not make is never replaced. `DESIGN_LOUNGE_SKILL_INSTALL=off` turns this off. To remove it, delete those folders.
- **Recent picks.** `record_pick` appends a line to `~/.design-lounge/history.jsonl`, so two sites you make do not come out alike. Nothing else reads it.
- **Cached images.** Theme boards and type specimens are cached in `~/.cache/design-lounge/boards`. Screenshots go to your temp folder, or to `out_dir`.
- **The network.** A review fetches the page you name, its stylesheets, robots.txt, sitemap.xml, llms.txt, and the share image, from your machine. Google Fonts loads for type specimens. Thumbnails and demos are bundled; designlounge.live is asked only for one that is missing. Nothing is sent to Design Lounge, and there is no tracking.

## Settings

| Variable | Default |
| --- | --- |
| `DESIGN_LOUNGE_SKILL` | The bundled `skill/`, then `../skills/design-lounge` |
| `DESIGN_LOUNGE_HISTORY` | `~/.design-lounge/history.jsonl` |
| `DESIGN_LOUNGE_SKILL_INSTALL` | on. Set `off` to skip installing the skill |
| `DESIGN_LOUNGE_ASSETS` | The bundled `assets/`, then the repo's `public/thumbs` and `src/demos`, then the live site |
| `DESIGN_LOUNGE_CACHE` | `~/.cache/design-lounge/boards`, for rendered theme boards and specimens |

## Develop

```sh
pnpm test                              # unit tests and a stdio round trip
pnpm release patch --dry-run           # sync the skill, test, and pack, without publishing
node test/client.mjs                   # list the tools
node test/client.mjs review_page '{"path":"test/fixtures/slop.html"}'
```

`pnpm release patch` (or minor, major, x.y.z, with `--otp <code>` for npm 2FA) syncs the skill from the library, runs the tests, bumps package.json and server.json together, publishes to npm and the MCP Registry, then commits and tags. It never pushes.

`pnpm pack` first copies the skill folder into `skill/`, and the thumbnails and demos into `assets/` (`scripts/bundle.mjs`), so the published package carries the library and the pictures. About 12 MB packed.

Designed using [Design Lounge](https://www.designlounge.live) by Susan Acharya.
