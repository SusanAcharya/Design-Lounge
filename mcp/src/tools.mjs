// Every Design Lounge tool, behind one createServer(). The local server (server.mjs) and the hosted one (http.mjs)
// share it. Hosted leaves out what touches the person's machine: file paths, the history, the skill and browser installs,
// and the rendered checks.
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { createRequire } from 'node:module';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Library } from './library.mjs';
import { readHistory, pickDirection, checkPick, recordPick, nameNumber, historyPath, groupOf } from './picks.mjs';
import { readRequest, readProject } from './route.mjs';
import { loadPage, siteFiles } from './source.mjs';
import { auditSlop, resolveKit } from './slop.mjs';
import { auditSearch, suggestSchema } from './search.mjs';
import { renderChecks } from './render.mjs';
import { formatReport } from './report.mjs';
import { pieceAsset, imageContent } from './assets.mjs';
import { themeBoard, pairingSpecimen } from './visual.mjs';
import { ensureUserSkill, installProjectSkill } from './skill-install.mjs';
import { measureUrl, readMeasure, readScreenshot, matchReference, formatMatch } from './reference.mjs';


export const lib = new Library();
export const { version: VERSION } = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

/**
 * Build the server. hosted: true is the public endpoint, with no access to the person's machine.
 * skillLine says where the local server installed the skill.
 */
export function createServer({ hosted = false, skillLine = '' } = {}) {
  const INSTRUCTIONS = `Design Lounge is the design library of Susan Acharya (${lib.site}): ${lib.counts.pieces} piece briefs, ${lib.counts.themes} themes, ${lib.counts.pairings} type pairings, ${lib.counts.starts} recipes with directions, icons, and Sanzo Wada's colour combinations. It also reviews pages for AI giveaways and for SEO, AEO, and GEO.

For any website, app, screen, or UI: call start_design first with their words. Then lock a recipe direction with get_recipe and pick_direction, and build from get_theme, get_pairing, get_family, and get_piece. Do not invent a palette, a type pairing, a radius, or a component language. Their words win over every default.

After you build or change a page, call review_page on the ${hosted ? 'URL (or its HTML)' : 'file or URL'}. Fix every fail${hosted ? '' : ', look at the frames it attaches,'} and run it again.${hosted ? '' : ' Before you finish a website, record_pick with status "finished".'}

When they show a site or a screenshot they like: match_reference first, then build from the kit it names. Match the feel, never copy the site.

To clean up an existing page: review_page (or audit_slop for design only, audit_search for search only), then fix in the order it lists. read_guide gives any section of the method.

${hosted ? `This is the hosted server. It cannot read files on the person's machine, keep their history, or take screenshots. For those, and to install the skill, they can run it locally: npx -y design-lounge-mcp@latest.` : skillLine} ${hosted ? 'start_design returns the rules that must hold, and read_guide serves the rest of the method.' : 'If your client loads skills, it is already in your context: follow it. If not, start_design returns the rules that must hold, and read_guide serves the rest.'}`;

  const server = new McpServer({ name: 'design-lounge', version: VERSION }, { instructions: INSTRUCTIONS });

  const text = (t, images = []) => ({ content: [{ type: 'text', text: typeof t === 'string' ? t : JSON.stringify(t, null, 1) }, ...images.filter(Boolean)] });
  const fail = (t) => ({ content: [{ type: 'text', text: t }], isError: true });
  const RO = { readOnlyHint: true, openWorldHint: false };
  const target = {
    url: z.string().max(2048).optional().describe(hosted ? 'A public URL, such as https://example.com' : 'A live or local URL, such as http://localhost:4321/ or https://example.com'),
    ...(hosted ? {} : { path: z.string().optional().describe('An HTML file or a folder with index.html. DESIGN.md beside it or above it is read for the locked kit') }),
    html: z.string().max(2_000_000).optional().describe('Raw HTML, when there is no file or URL'),
  };
  // The local server reads ~/.design-lounge/history.jsonl. A hosted client can pass its own recent lines instead.
  const historyArg = { history: z.array(z.record(z.string(), z.any())).max(48).optional().describe('Recent pick lines, for a client that keeps its own history. The local server reads ~/.design-lounge/history.jsonl') };
  const historyLines = (given) => given ?? (hosted ? [] : readHistory().lines);
  const kitShape = z.object({
    theme: z.string().optional(), pairing: z.string().optional(), family: z.string().optional(),
    named: z.string().optional().describe('The Named aesthetic line, which lifts the bans it lists'),
    free: z.boolean().optional().describe('Show mode, Free: colour and type are not locked to the library'),
  }).optional().describe('The locked kit, by id, name, or Lounge link. Read from DESIGN.md when omitted');

  /* ======================= design ======================= */

  server.registerTool('start_design', {
    title: 'Start a design',
    description: 'Call first for any new website, app, screen, or UI. Reads their request the way the method does (flow, mode, named style, calm words), ranks the recipes, reads the project folder and the recent picks, and returns the brief to fill and the steps, each naming the tool to use.',
    inputSchema: {
      request: z.string().describe('Their message, word for word'),
      product: z.string().optional().describe('The product or brand name, if they gave one'),
      ...(hosted ? historyArg : { project_path: z.string().optional().describe('The folder the build goes in') }),
    },
    annotations: RO,
  }, async ({ request, product, project_path, history }) => {
    const read = readRequest(request, lib);
    const project = hosted ? null : readProject(project_path);
    const recipes = lib.rankRecipes(`${request} ${product || ''}`, 4);
    const lines = historyLines(history);
    const exists = hosted ? Boolean(history) : readHistory().exists;
    const recent = recipes.map((r) => ({ recipe: r.id, group: groupOf(r.id), recentLines: lines.filter((l) => l.recipe === r.id).length }));
    const template = (lib.guideSection('brief.md', 'The template') || '').match(/```\n([\s\S]*?)```/)?.[1]
      ?.replace('"<their sentence>"', JSON.stringify(request))
      .replace('<everyday | finished | spectacle>', `${read.ambition}`)
      .replace('<Kit | Show, Free | Show, locked>', read.mode);
    const isApp = /app short path|Piece flow|Library flow/.test(read.flow);
    const steps = isApp && !/app short path/.test(read.flow) ? [
      'Lock a theme and pairing first if the project has none (browse_library what=themes/pairings with a mood, then get_theme, get_pairing).',
      'search_pieces for the job, then get_piece for the brief. The brief is the spec for structure, counts, motion, and states.',
      'Translate its paint onto the locked tokens (read_guide practice.md "Adapting a brief"). One primary per view.',
      'review_page on the result. Fix every fail.',
    ] : [
      project?.designMd?.hasBrief ? `DESIGN.md already has a Brief (${project.designMd.file}). Reuse it.` : 'Fill the brief below and put it at the top of DESIGN.md under ## Brief. Never invent facts: list them under Missing.',
      `Write three words for the subject's world (materials, tools, place). get_recipe for the best recipe below, keep the directions whose mood names that world, then pick_direction with those as \`fitting\`${read.signals.calm.length ? ' and calm: true' : ''} and the product name. record_pick status "claimed" right away.`,
      read.styles.length ? `Write the Named aesthetic line from the styles.md row for "${read.styles[0].said}" (read_guide styles.md).` : null,
      isApp ? 'read_guide flows.md "An app, the short path" and app.md "The one screen". Write the four lines.' : 'read_guide website.md "Write the idea": write Idea, Signature, and Avoiding (the default look you will not make). Then Hero shape and Frame.',
      isApp ? null : 'check_pick with the hero, work, footer, shape, and frame you chose. If it fails, take the next direction.',
      'get_theme, get_pairing, get_family for the locked direction. Copy the CSS as is. get_piece for every piece you build: header, hero, work, footer, phone bar.',
      read.mode.startsWith('Show') ? 'read_guide show.md: the centrepiece and the rendering bar.' : null,
      'Build with their facts only. A sentence still true with another product\'s name in it gets rewritten.',
      'review_page on the built file. Open the screenshots. Fix every fail, make one correction (read_guide practice.md "One correction"), review again.',
      isApp ? null : 'record_pick status "finished" with work, footer, shape, and frame. End with the closing block in SKILL.md "The reply".',
    ].filter(Boolean);
    const ask = [];
    if (!read.signals.justBuild) {
      if (project?.empty && !project.stack) ask.push('The folder is empty and they named no stack: ask which, and say plain HTML + CSS + a little JS is the default.');
      if (read.signals.redesign) ask.push('A redesign: if you cannot tell, ask once whether to keep the brand or start the look again.');
      if (read.signals.options) ask.push('They asked for options: name three palettes and two pairings with links, names, and moods only.');
    }
    return text({
      request,
      flow: read.flow, because: read.why, ambition: read.ambition, mode: read.mode,
      signals: Object.fromEntries(Object.entries(read.signals).filter(([, v]) => v && (!Array.isArray(v) || v.length))),
      namedStyles: read.styles,
      recipes, recent: exists ? recent : hosted ? 'no history: the hosted server keeps none. Pass history to compare with your recent sites' : 'no history yet at ' + historyPath(),
      project,
      askFirst: ask.length ? ask : read.signals.justBuild ? 'They said to just build it. Do not ask.' : 'Nothing that needs a question. Decide and say what you assumed.',
      steps,
      brief: template,
      skill: hosted ? 'Hosted: the skill is not installed from here. For the full method in your client, run the local server (npx -y design-lounge-mcp@latest) or npx skills add SusanAcharya/Design-Lounge.' : skillLine,
      rules: lib.coreRules(),
      sayThePick: `At the top of your reply: Theme name and ${lib.site}/themes/<id>, Pairing and ${lib.site}/type/<id>, Family and its radius, each piece and ${lib.site}/demo/<id>.`,
    });
  });

  server.registerTool('get_recipe', {
    title: 'Get a recipe',
    description: 'A recipe (start) with its directions: each a complete look (theme, pairing, family, hero, effect, work, footer). Each direction says whether the recent history blocks it.',
    inputSchema: { id: z.string().describe('Recipe id, such as saas, restaurant, portfolio. browse_library what=recipes lists them'), product: z.string().optional(), ...historyArg },
    annotations: RO,
  }, async ({ id, product, history }) => {
    const r = lib.recipe(id);
    if (!r) return fail(`No recipe "${id}". Recipes: ${lib.recipes().map((s) => s.id).join(', ')}`);
    const lines = historyLines(history);
    const directions = (r.directions || []).map((d) => {
      const c = checkPick({ recipe: r.id, product, direction: d.id, hero: d.hero, effect: d.effect, work: d.work, footer: d.footer }, lines);
      return { ...d, recent: !c.ok, because: c.problems.map((p) => p.detail) };
    });
    return text({ ...r, directions, group: groupOf(r.id) });
  });

  server.registerTool('pick_direction', {
    title: 'Pick a direction',
    description: 'Apply rules 3 to 5 of Pick a direction and the Recent picks check: calm words narrow to quiet, editorial, or sharp families; the history blocks recent directions, heroes, and effects; the group check blocks two-of-three matches; the name number breaks the tie. You judge which directions fit the subject (rules 1, 2, 4) and pass them as `fitting`.',
    inputSchema: {
      recipe: z.string(),
      product: z.string().optional().describe('Product or brand name, for the name number. Without one, the first noun of their message'),
      fitting: z.array(z.string()).optional().describe('Direction ids whose mood names this subject\'s world'),
      calm: z.boolean().optional().describe('They used a calm word: clean, simple, professional, plain, calm, quiet, corporate, serious, trustworthy'),
      ...historyArg,
    },
    annotations: RO,
  }, async ({ recipe, product, fitting, calm, history }) => {
    const r = lib.recipe(recipe);
    if (!r) return fail(`No recipe "${recipe}".`);
    const result = pickDirection(r, { product, fitting, calm }, historyLines(history));
    if (result.chosen) result.links = { theme: lib.link('theme', result.chosen.theme), pairing: lib.link('pairing', result.chosen.pairing), hero: result.chosen.hero && lib.link('demo', result.chosen.hero) };
    result.next = hosted ? 'Keep this pick in your own history and pass it next time, so the next site does not rhyme with this one.' : 'record_pick with status "claimed" now, so an agent running beside you does not take the same direction.';
    return text(result);
  });

  server.registerTool('check_pick', {
    title: 'Check a pick against recent sites',
    description: 'The uniqueness check from Recent picks: direction, hero, and effect against this recipe; two of hero, work, footer against the related group; hero shape against the last two; frame against the last three. Returns problems and the Unlike line for the sheet.',
    inputSchema: {
      recipe: z.string(), product: z.string().optional(), direction: z.string().optional(),
      hero: z.string().optional(), work: z.string().optional(), footer: z.string().optional(), effect: z.string().optional(),
      shape: z.enum(['split', 'object', 'type', 'band']).optional(),
      frame: z.array(z.string()).length(3).optional().describe('[header piece, phone piece or "none", find-us piece]'),
      reuse: z.boolean().optional().describe('Reusing a direction because every fitting one is recent: compares shape, frame, work, and footer only'),
      ...historyArg,
    },
    annotations: RO,
  }, async ({ history, ...pick }) => text(checkPick(pick, historyLines(history), { reuse: pick.reuse })));

  if (!hosted) server.registerTool('record_pick', {
    title: 'Record a pick in the history',
    description: `Append a line to ${historyPath()}: "claimed" right after you lock, "finished" after the check passes. A claimed line is read back: if another product claimed the same recipe and direction in the last hour, yours loses and the result says so.`,
    inputSchema: {
      product: z.string(), folder: z.string().optional(), recipe: z.string(), direction: z.string(),
      theme: z.string(), pairing: z.string(), family: z.string().optional(),
      hero: z.string().optional(), work: z.string().optional(), footer: z.string().optional(), effect: z.string().nullable().optional(),
      shape: z.enum(['split', 'object', 'type', 'band']).optional(), frame: z.array(z.string()).length(3).optional(),
      mode: z.enum(['kit', 'free']).optional(), fonts: z.array(z.string()).optional(), colours: z.array(z.string()).optional(),
      status: z.enum(['claimed', 'finished']),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (line) => {
    const res = recordPick(line);
    if (res.conflict) res.next = `${res.conflict.product} claimed ${line.recipe}/${line.direction} first. Take the next fitting direction (pick_direction without this one) and claim that.`;
    return text(res);
  });

  server.registerTool('search_pieces', {
    title: 'Search pieces',
    description: `Search ${lib.counts.pieces} piece briefs by words (job, component, style, tag) and filters. Returns ids, summaries, and demo links. Then get_piece for the brief.`,
    inputSchema: {
      query: z.string().optional().describe('Such as "pricing toggle", "sticky mobile cta", "kanban", "footer wordmark"'),
      platform: z.enum(['web', 'mobile-web', 'mobile-app', 'pwa', 'tablet']).optional(),
      category: z.string().optional().describe('browse_library what=categories lists them'),
      style: z.string().optional(), limit: z.number().int().min(1).max(40).optional(),
      images: z.boolean().optional().describe('Attach thumbnails of the first six, to compare them by eye'),
    },
    annotations: RO,
  }, async ({ images, ...args }) => {
    const found = lib.searchPieces(args);
    const thumbs = images ? await Promise.all(found.pieces.slice(0, 6).map(async (p) => { const b = await pieceAsset('thumb', p.id, lib.site); return b && imageContent(b, 'image/webp'); })) : [];
    if (images) found.imagesInOrder = found.pieces.slice(0, 6).map((p, i) => (thumbs[i] ? p.id : `${p.id} (no thumbnail)`));
    return text(found, thumbs);
  });

  server.registerTool('get_piece', {
    title: 'Get a piece brief',
    description: 'The spec for one piece, with a picture of its demo: structure, counts, sizes, motion timing, states, hit targets, acceptance checklist. By default stops at "Optional below this line"; full=true adds the demo\'s exact paint and motion notes. demo=true adds the demo\'s HTML source, the acceptance file. Its colours and fonts are the demo\'s: translate them onto the locked kit.',
    inputSchema: {
      id: z.string(), full: z.boolean().optional(),
      image: z.boolean().optional().describe('Attach the demo\'s thumbnail (default true)'),
      demo: z.boolean().optional().describe('Add the demo\'s HTML source'),
    },
    annotations: RO,
  }, async ({ id, full, image, demo }) => {
    const p = lib.piece(id);
    if (!p) {
      const near = lib.searchPieces({ query: id.replace(/-/g, ' '), limit: 5 }).pieces.map((x) => x.id);
      return fail(`No piece "${id}". Do not invent a slug. Closest: ${near.join(', ') || 'none'}`);
    }
    const cut = p.brief.indexOf('**Optional below this line.**');
    const brief = full || cut < 0 ? p.brief : p.brief.slice(0, cut) + '**Optional below this line.** Call get_piece with full=true for the rest.';
    const thumb = image === false ? null : await pieceAsset('thumb', id, lib.site);
    const source = demo ? await pieceAsset('demo', id, lib.site) : null;
    const parts = [`Demo: ${p.demo}`, `Piece page: ${p.page}`, thumb ? 'The demo\'s first frame is attached. It shows the structure and the point; the paint is the demo\'s, not yours.' : null, '', brief];
    if (demo) parts.push('', source ? `## Demo source (${p.id}.html)\n\n\`\`\`html\n${source}\n\`\`\`` : 'The demo source could not be loaded.');
    return text(parts.filter((x) => x != null).join('\n'), [thumb && imageContent(thumb, 'image/webp')]);
  });

  server.registerTool('browse_library', {
    title: 'Browse the library',
    description: 'List themes, pairings, families, recipes, piece categories, collections, or kinds. Themes and pairings can be ranked by a mood ("warm craft", "editorial serif", "dark technical").',
    inputSchema: {
      what: z.enum(['themes', 'pairings', 'families', 'recipes', 'categories', 'collections', 'kinds', 'motion', 'scales']),
      mood: z.string().optional(), mode: z.enum(['light', 'dark']).optional(), limit: z.number().int().min(1).max(100).optional(),
    },
    annotations: RO,
  }, async ({ what, mood, mode, limit = 24 }) => {
    switch (what) {
      case 'themes': return text(lib.themes({ mood, mode }).slice(0, limit));
      case 'pairings': return text(lib.pairings({ mood }).slice(0, limit));
      case 'families': return text(lib.families().map((f) => ({ id: f.id, name: f.name, mood: f.mood, radius: f.radius, button: f.button, density: f.density, shadow: f.shadow })));
      case 'recipes': return text(lib.recipes());
      case 'categories': return text(lib.categories());
      case 'collections': return text(lib.index.collections.map((c) => ({ slug: c.slug, title: c.title, blurb: c.blurb, pieces: c.pieces.length })));
      case 'kinds': return text(lib.map.kinds.map((k) => ({ id: k.id, title: k.title, when: k.when, blurb: k.blurb })));
      case 'motion': return text(lib.map.motion);
      case 'scales': return text(lib.map.scales);
    }
  });

  server.registerTool('get_theme', {
    title: 'Get a theme',
    description: 'A theme\'s full CSS (primary, secondary, tertiary, feedback, surfaces, link) and its pair for the other mode. Colour only: fonts come from the pairing, radius and shadow from the family.',
    inputSchema: { id: z.string().describe('Theme id, name, or Lounge link'), image: z.boolean().optional().describe('Attach a board of the theme\'s roles (default true)') },
    annotations: RO,
  }, async ({ id, image }) => {
    const t = lib.theme(lib.resolveId('theme', id) || id);
    if (!t) return fail(`No theme "${id}". browse_library what=themes lists them.`);
    const board = image === false ? null : await themeBoard(t).catch(() => null);
    return text(`${t.name} · ${t.mode} · pair: ${t.pair || 'none'} · ${t.link}${board ? '\nA board of its roles is attached: ground, card, ink levels, the primary, outline, accents, feedback.' : ''}\n\n${t.css}`, [board && imageContent(board, 'image/jpeg')]);
  });

  server.registerTool('get_pairing', {
    title: 'Get a type pairing',
    description: 'A pairing\'s CSS (Google Fonts import, --font-display, --font-text, mono if any), its numbers face, and any caution to say before you write.',
    inputSchema: { id: z.string().describe('Pairing id, name, or Lounge link'), image: z.boolean().optional().describe('Attach a type specimen (default true)') },
    annotations: { readOnlyHint: true, openWorldHint: true },
  }, async ({ id, image }) => {
    const p = lib.pairing(lib.resolveId('pairing', id) || id);
    if (!p) return fail(`No pairing "${id}". browse_library what=pairings lists them.`);
    const caution = p.caution ? `\nCaution, say it before you write: ${p.caution}` : '';
    const specimen = image === false ? null : await pairingSpecimen(p).catch(() => null);
    return text(`${p.id} · display ${p.display?.family} · text ${p.text?.family} · mono ${p.mono?.family || 'none'} · numbers ${p.numbers} · ${p.link}${caution}${specimen ? '\nA specimen is attached.' : ''}\n\n${p.css}`, [specimen && imageContent(specimen, 'image/jpeg')]);
  });

  server.registerTool('get_family', {
    title: 'Get a component family',
    description: 'A family\'s rules: radius, button style, density, shadow, and the sentences that lock them. The family wins over a brief for radius, shadow, button, and density.',
    inputSchema: { id: z.string() },
    annotations: RO,
  }, async ({ id }) => {
    const f = lib.family(lib.resolveId('family', id) || id);
    return f ? text(f) : fail(`No family "${id}". Families: ${lib.families().map((x) => x.id).join(', ')}`);
  });

  server.registerTool('get_icons', {
    title: 'Get Lounge Icons',
    description: 'SVG for Lounge Icons by name (24px, stroke 1.75). With no names, lists them by group. Missing names come back as missing: then follow Icon and nav in components.md, never an emoji.',
    inputSchema: { names: z.array(z.string()).optional(), group: z.string().optional() },
    annotations: RO,
  }, async ({ names = [], group }) => text(lib.findIcons(names, group)));

  server.registerTool('search_wada', {
    title: 'Search Wada colour combinations',
    description: 'Sanzo Wada\'s 348 combinations, by colour or material word (russet, slate, "dark warm") or nearest to a hex. Only for Free colour, a brand board no theme fits, or colours they asked for. Take one line whole; the header says how to map it to roles.',
    inputSchema: { query: z.string().optional(), near: z.string().optional().describe('A hex like #b14f1c'), limit: z.number().int().min(1).max(30).optional() },
    annotations: RO,
  }, async (args) => text(lib.searchWada(args)));

  server.registerTool('read_guide', {
    title: 'Read the method',
    description: `Read a method file or one section of it. Files: ${lib.guides().join(', ')}. Give a heading ("Look", "Write the idea", "Recent picks") to get only that section; outline=true lists the headings.`,
    inputSchema: { file: z.string(), section: z.string().optional(), outline: z.boolean().optional() },
    annotations: RO,
  }, async ({ file, section, outline }) => {
    if (outline) { const h = lib.headings(file); return h.length ? text(h.join('\n')) : fail(`No guide "${file}".`); }
    const t = lib.guideSection(file, section);
    return t ? text(t) : fail(section ? `No section "${section}" in ${file}. Headings:\n${lib.headings(file).join('\n')}` : `No guide "${file}". Files: ${lib.guides().join(', ')}`);
  });

  server.registerTool('name_number', {
    title: 'Name number',
    description: 'The tie-break from rule 5 of Pick a direction: the sum of each letter\'s place in the alphabet, mod the number of fitting directions.',
    inputSchema: { name: z.string(), count: z.number().int().min(1).optional() },
    annotations: RO,
  }, async ({ name, count }) => {
    const n = nameNumber(name);
    return text({ ...n, line: `${name} = ${n.parts.join('+')} = ${n.sum}${count ? `, ${count} fit, ${n.sum} mod ${count} = ${n.sum % count}` : ''}` });
  });

  /* ======================= review ======================= */

  async function load(args) {
    if (hosted && args.path) throw new Error('The hosted server cannot read files. Give a public url or the html.');
    if (!args.url && !args.path && !args.html) throw new Error(hosted ? 'Give url or html.' : 'Give url, path, or html.');
    return loadPage(args);
  }

  server.registerTool('review_page', {
    title: 'Review a page',
    description: 'The all-in-one check for a built page: AI giveaways and kit drift (the Look fails), SEO, AEO, GEO, and, when Chromium is available, a rendered pass at 1280×800 and 390×844 with axe accessibility, measured labels, faces, primaries, tap targets, and saved screenshots. Returns scores, fails first, each with its evidence and fix.',
    inputSchema: {
      ...target, kit: kitShape,
      render: z.boolean().optional().describe('Open it in Chromium (default true)'),
      out_dir: z.string().optional().describe('Where to save screenshots (default: a temp folder)'),
      images: z.boolean().optional().describe('Attach the web and phone frames (default true)'),
      format: z.enum(['markdown', 'json']).optional(),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  }, async (args) => {
    let page;
    try { page = await load(args); } catch (e) { return fail(e.message); }
    const kit = resolveKit(lib, page, args.kit);
    const search = await auditSearch(page, await siteFiles(page));
    const findings = [...auditSlop(page, kit, lib), ...search.findings];
    let render = null;
    const facts = { ...search.facts };
    if (hosted) render = { skipped: 'The hosted server does not open pages in a browser. Run the local server (npx -y design-lounge-mcp@latest) for screenshots, axe, and the measured checks.' };
    else if (args.render !== false) {
      render = await renderChecks(page, { outDir: args.out_dir });
      if (!render.skipped) {
        // axe repeats three checks the SEO pass already reports with a fix.
        const dup = { 'axe-html-has-lang': 'lang', 'axe-image-alt': 'alt', 'axe-link-name': 'empty-links' };
        findings.push(...render.findings.filter((f) => !(dup[f.id] && findings.some((g) => g.id === dup[f.id]))));
        facts.renderedWords = render.frames.web?.words;
        facts.faces = render.frames.web?.faces.slice(0, 4).map((f) => f.family).join(', ');
        facts.bodySize = render.frames.web?.bodySize;
        if (facts.serverWords != null && facts.renderedWords > 200 && facts.serverWords < facts.renderedWords * 0.5 && !findings.some((f) => f.id === 'js-only')) {
          findings.push({ level: 'fail', area: 'geo', id: 'js-rendered', title: `${facts.renderedWords - facts.serverWords} words only appear after scripts run`, evidence: [`served: ${facts.serverWords} words · rendered: ${facts.renderedWords}`], fix: 'Render that text on the server or at build time. Most AI crawlers read the HTML as served.' });
        }
      }
    }
    if (args.format === 'json') return text({ label: page.label, kit: { ...kit, themeData: undefined, pairTheme: undefined, pairingData: undefined, familyData: undefined }, findings, facts, render: render && { skipped: render.skipped, shots: render.shots, frames: render.frames } });
    const frames = args.images === false || !render?.images ? [] : render.images.map((i) => imageContent(i.data, 'image/jpeg'));
    return text(formatReport({ label: page.label, kit, findings, facts, render: frames.length ? render : render && { ...render, images: [] } }), frames);
  });

  server.registerTool('audit_slop', {
    title: 'Find AI giveaways',
    description: 'Design only: the tells of a generated page (stock copy, em dashes, buzzwords, icon-card trios, gradients, the indigo palette, emoji icons, numbered eyebrows, placeholder copy, made-up numbers) and drift from the locked kit (faces, colours, radius, shadow). Static by default; render=true adds the measured checks.',
    inputSchema: { ...target, kit: kitShape, render: z.boolean().optional(), out_dir: z.string().optional() },
    annotations: { readOnlyHint: true, openWorldHint: true },
  }, async (args) => {
    let page;
    try { page = await load(args); } catch (e) { return fail(e.message); }
    const kit = resolveKit(lib, page, args.kit);
    const findings = auditSlop(page, kit, lib);
    let render = null;
    if (args.render && !hosted) { render = await renderChecks(page, { outDir: args.out_dir, runAxe: false }); if (!render.skipped) findings.push(...render.findings.filter((f) => f.area === 'render')); }
    return text(formatReport({ label: page.label, kit, findings, render, only: ['design'] }), (render?.images || []).map((i) => imageContent(i.data, 'image/jpeg')));
  });

  server.registerTool('audit_search', {
    title: 'Check SEO, AEO, and GEO',
    description: 'Whether search engines can index the page and show it well (SEO), answer engines can lift a direct answer (AEO), and AI engines can reach it, read it without JavaScript, and name the entity (GEO): title, description, headings, alt, share card and its 1200×630 image, canonical, robots.txt for search and AI crawlers, sitemap, JSON-LD, question headings with short answers, server-rendered text.',
    inputSchema: { ...target },
    annotations: { readOnlyHint: true, openWorldHint: true },
  }, async (args) => {
    let page;
    try { page = await load(args); } catch (e) { return fail(e.message); }
    const { findings, facts } = await auditSearch(page, await siteFiles(page));
    return text(formatReport({ label: page.label, findings, facts, only: ['seo', 'aeo', 'geo'] }));
  });

  server.registerTool('suggest_schema', {
    title: 'Suggest JSON-LD',
    description: 'JSON-LD for the page built only from facts on it: the entity (Organization, LocalBusiness subtypes, Person, Product, SoftwareApplication) with name, url, description, image, phone, email, address, sameAs; and FAQPage from its own questions. Lists the fields it could not find. Never invents ratings, reviews, or prices.',
    inputSchema: {
      ...target,
      type: z.string().optional().describe('schema.org type, such as Restaurant, Dentist, Person, SoftwareApplication. Default Organization'),
      name: z.string().optional(),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  }, async (args) => {
    let page;
    try { page = await load(args); } catch (e) { return fail(e.message); }
    const s = suggestSchema(page, args);
    return text(`${s.note}\nMissing: ${s.missing.join(', ') || 'none'}\n\n${s.jsonLd.map((b) => `<script type="application/ld+json">\n${JSON.stringify(b, null, 2)}\n</script>`).join('\n\n')}`);
  });

  if (!hosted) server.registerTool('match_reference', {
    title: 'Match a reference site',
    description: 'They showed a site or a screenshot and want that feel. Measures its design language (colour roles, type, corners, shadows, density, hero shape, sections, motion) and returns the closest Lounge theme, pairing, family, and pieces per section, with what does not match. Matches the feel only: never copy the reference\'s logo, name, words, or photos. For a screenshot, also describe the type you see (`type`) and anything else you can tell (corners, shadows, sections).',
    inputSchema: {
      url: z.string().optional().describe('The reference site'),
      image_path: z.string().optional().describe('A screenshot file'),
      image: z.string().optional().describe('A screenshot as base64, when there is no file'),
      mime_type: z.string().optional().describe('image/png, image/jpeg, or image/webp (default png)'),
      type: z.string().optional().describe('For a screenshot: the faces you see, such as "high-contrast serif headline, neutral grotesk body"'),
      corners: z.enum(['sharp', 'small', 'medium', 'large', 'pill']).optional(),
      shadows: z.enum(['none', 'soft', 'hard']).optional(),
      buttons: z.enum(['solid', 'outline']).optional(),
      shape: z.enum(['split', 'object', 'type', 'band']).optional().describe('The hero shape you see'),
      sections: z.array(z.string()).optional().describe('Section kinds you see: features, pricing, testimonials, faq, logos, stats, team, gallery, blog, cta, contact, newsletter'),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  }, async (args) => {
    try {
      let m = null, input, source, shot = null;
      if (args.url) {
        source = /^https?:\/\//.test(args.url) ? args.url : `https://${args.url}`;
        m = await measureUrl(source);
        if (!m) return fail('Chromium is not installed, so the page cannot be measured. Ask the person, then run install_browser and try again.');
        input = readMeasure(m);
        shot = m.shot;
      } else if (args.image_path || args.image) {
        const buf = args.image_path ? fs.readFileSync(args.image_path) : Buffer.from(args.image, 'base64');
        const mime = args.mime_type || (/\.jpe?g$/i.test(args.image_path || '') ? 'image/jpeg' : /\.webp$/i.test(args.image_path || '') ? 'image/webp' : 'image/png');
        input = await readScreenshot(buf, mime, args);
        if (!input) return fail('Chromium is not installed, so the screenshot cannot be read. Ask the person, then run install_browser and try again.');
        source = args.image_path || 'pasted screenshot';
      } else return fail('Give url, image_path, or image.');
      const match = matchReference(lib, input);
      return text(formatMatch(lib, { source, m, match, input }), [shot && imageContent(shot, 'image/jpeg')]);
    } catch (e) { return fail(e.message); }
  });

  if (!hosted) server.registerTool('install_skill', {
    title: 'Install the Design Lounge skill',
    description: 'The server installs the skill for this user when it starts. Use this to put it in a project as well (.claude/skills, .cursor/skills, .agents/skills), for clients that only read project skills, or with replace: true to swap a copy installed another way for this server\'s.',
    inputSchema: {
      project_path: z.string().optional().describe('A project folder. Omit to install for this user'),
      replace: z.boolean().optional().describe('Replace a user-level copy that something else installed'),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ project_path, replace }) => {
    try {
      if (project_path) return text({ installed: installProjectSkill(lib.dir, project_path, { version: VERSION }), next: 'Reload the client so it picks up the skill.' });
      return text({ ...ensureUserSkill(lib.dir, { version: VERSION, replace }), next: 'Reload the client so it picks up the skill.' });
    } catch (e) { return fail(e.message); }
  });

  if (!hosted) server.registerTool('install_browser', {
    title: 'Install the browser for rendered checks',
    description: 'Download the headless Chromium that review_page uses to look at the page: screenshots, axe, measured labels and buttons, and theme boards and type specimens. About 100 MB, once. Ask the person first.',
    inputSchema: {},
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async () => {
    let cli;
    // cli.js is the package's bin, not one of its exports, so find it beside package.json.
    try { cli = path.join(path.dirname(createRequire(import.meta.url).resolve('playwright/package.json')), 'cli.js'); }
    catch { return fail('Playwright is not installed with this server. Reinstall it with npm so its optional dependencies come too.'); }
    return new Promise((resolve) => execFile(process.execPath, [cli, 'install', 'chromium', '--only-shell'], { timeout: 600000, maxBuffer: 8 << 20 }, (err, stdout, stderr) => {
      const tail = `${stdout}\n${stderr}`.trim().split('\n').slice(-6).join('\n');
      resolve(err ? fail(`The download failed:\n${tail}`) : text(`Chromium is installed. review_page can look at pages now.\n${tail}`));
    }));
  });

  /* ======================= resources and prompts ======================= */

  server.registerResource('guide', new ResourceTemplate('lounge://guide/{file}', {
    list: async () => ({ resources: lib.guides().map((f) => ({ uri: `lounge://guide/${f}`, name: f, mimeType: 'text/markdown' })) }),
  }), { title: 'Design Lounge method', description: 'The method files of the Design Lounge skill', mimeType: 'text/markdown' },
  async (uri, { file }) => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: lib.guide(String(file)) || `No guide ${file}` }] }));

  server.registerResource('map', 'lounge://library/map.json', { title: 'Library map', description: 'Kinds, families, recipes, themes and pairings by mood, motion tokens', mimeType: 'application/json' },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(lib.map) }] }));

  server.registerPrompt('design', {
    title: 'Design with Design Lounge',
    description: 'Design a site, app, or screen from the Lounge library, then review it',
    argsSchema: { request: z.string().describe('What to make, in your words'), folder: z.string().optional() },
  }, ({ request, folder }) => ({
    messages: [{ role: 'user', content: { type: 'text', text: `${request}\n\nUse the Design Lounge tools. Start with start_design (request word for word${folder ? `, project_path ${folder}` : ''}), follow its steps, and finish with review_page on what you built. Fix every fail before you reply. ${lib.guideSection('SKILL.md', 'The reply') ? 'End with the closing block from read_guide SKILL.md "The reply".' : ''}` } }],
  }));

  server.registerPrompt('review', {
    title: 'Review a page',
    description: 'AI giveaways, kit drift, SEO, AEO, GEO, and accessibility, then fix',
    argsSchema: { target: z.string().describe('A file path or URL') },
  }, ({ target: t }) => ({
    messages: [{ role: 'user', content: { type: 'text', text: `Run review_page on ${t}. Open the screenshots it saves. Fix every fail in the order it lists, keeping their brand, URLs, nav labels, and form fields. Then run it again and tell me what changed and what is still open.` } }],
  }));

  server.registerPrompt('deslop', {
    title: 'Remove AI giveaways',
    description: 'Strip the tells of a generated page and rewrite the copy with real facts',
    argsSchema: { target: z.string().describe('A file path or URL') },
  }, ({ target: t }) => ({
    messages: [{ role: 'user', content: { type: 'text', text: `Run audit_slop on ${t} with render=true. For each fail, fix it on the page: copy with their facts only, the kit's faces, colours, radius, and shadow, Lounge Icons for emoji. Do not invent clients, numbers, or quotes; where a fact is missing, write one line saying what is still to come. Run audit_slop again until it has no fails.` } }],
  }));

  return server;
}
