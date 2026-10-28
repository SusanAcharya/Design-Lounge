import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Library } from '../src/library.mjs';
import { nameNumber, checkPick, pickDirection, recordPick, readHistory, sites } from '../src/picks.mjs';
import { readRequest } from '../src/route.mjs';
import { loadPage, siteFiles, imageSize } from '../src/source.mjs';
import { auditSlop, resolveKit, parseDesignMd } from '../src/slop.mjs';
import { auditSearch, parseRobots, robotsAllows, suggestSchema } from '../src/search.mjs';
import { ensureUserSkill, installProjectSkill } from '../src/skill-install.mjs';
import { connect } from './client.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (...p) => path.join(here, 'fixtures', ...p);
const lib = new Library();
const ids = (findings, level) => findings.filter((f) => !level || f.level === level).map((f) => f.id);

/* ---------- library ---------- */

test('library reads the skill folder', () => {
  assert.ok(lib.counts.pieces > 500);
  assert.ok(lib.piece('kpi-delta').brief.includes('Optional below this line'));
  assert.equal(lib.piece('no-such-piece'), null);
  assert.equal(lib.searchPieces({ query: 'pricing toggle' }).pieces[0].category, 'pricing');
  assert.equal(lib.resolveId('theme', 'Paper & Ink'), 'paper-ink');
  assert.equal(lib.resolveId('pairing', 'https://www.designlounge.live/type/gallery-wall'), 'gallery-wall');
  assert.match(lib.guideSection('practice.md', 'Recent picks'), /^### Recent picks/);
});

test('recipes rank by the kind map and everyday nouns', () => {
  assert.equal(lib.rankRecipes('a website for my momo counter in Patan')[0].id, 'restaurant');
  assert.equal(lib.rankRecipes('portfolio for a product designer')[0].id, 'portfolio-builder');
  assert.equal(lib.rankRecipes('a landing page for my bike repair shop')[0].id, 'landing');
  assert.equal(lib.rankRecipes('admin dashboard for warehouse ops')[0].id, 'dashboard');
});

test('requests route the way the table in SKILL.md does', () => {
  assert.equal(readRequest('go wild: an awwwards space site', lib).mode, 'Show, Free');
  assert.deepEqual(readRequest('a clean simple site for my dentist', lib).signals.calm, ['clean', 'simple']);
  assert.match(readRequest('redesign our bakery website', lib).flow, /^Adopt flow/);
  assert.match(readRequest('a neo-brutalist landing page', lib).flow, /^Named aesthetic/);
  assert.match(readRequest('a date picker component', lib).flow, /^Piece flow/);
  assert.match(readRequest('admin dashboard for ops', lib).flow, /recipe dashboard/);
});

/* ---------- picks ---------- */

test('name number matches the worked example in practice.md', () => {
  assert.equal(nameNumber('Tsering').sum, 92);
  assert.equal(nameNumber('Happy Easel!').sum, nameNumber('happyeasel').sum);
});

test('a claimed line and its finished line are one site', () => {
  const lines = [{ product: 'A', recipe: 'food', status: 'claimed' }, { product: 'B', recipe: 'food' }, { product: 'A', recipe: 'food', status: 'finished' }];
  assert.deepEqual(sites(lines).map((l) => l.product), ['B', 'A']);
});

test('the uniqueness check follows Recent picks', () => {
  const lines = [
    { product: 'Old Cafe', recipe: 'restaurant', direction: 'garden-supper (pairing swapped)', hero: 'editorial-landing-hero', work: 'gallery-contact-sheet', footer: 'footer-newsletter-split', shape: 'object', frame: ['navbar-split-centered-logo', 'none', 'contact-booking-hours'] },
    { product: 'Hotel', recipe: 'hotel', hero: 'x', work: 'restaurant-menu-page', footer: 'footer-centered-colophon', shape: 'type' },
  ];
  const same = checkPick({ recipe: 'restaurant', direction: 'garden-supper' }, lines);
  assert.equal(same.ok, false);
  assert.equal(same.problems[0].rule, 'direction');
  // Two of hero, work, footer against a recent site in the group ("a place").
  const group = checkPick({ recipe: 'food', hero: 'y', work: 'restaurant-menu-page', footer: 'footer-centered-colophon' }, lines);
  assert.ok(group.problems.some((p) => p.rule === 'group'));
  assert.ok(checkPick({ recipe: 'food', hero: 'y', work: 'restaurant-menu-page', footer: 'z' }, lines).ok);
  // Shape against the last two in the group, frame on all three parts.
  assert.ok(checkPick({ recipe: 'restaurant', shape: 'type' }, lines).problems.some((p) => p.rule === 'shape'));
  assert.ok(checkPick({ recipe: 'restaurant', frame: ['navbar-split-centered-logo', 'none', 'contact-booking-hours'] }, lines).problems.some((p) => p.rule === 'frame'));
  // A new page of the same product is allowed to match.
  assert.ok(checkPick({ recipe: 'restaurant', product: 'Old Cafe', direction: 'garden-supper' }, lines).ok);
});

test('pick_direction applies calm words, history, and the name number', () => {
  const recipe = lib.recipe('restaurant');
  const calm = pickDirection(recipe, { product: 'Tsering', fitting: ['market-kitchen', 'garden-supper', 'bistro-riso'], calm: true }, []);
  assert.ok(['quiet', 'editorial', 'sharp'].includes(calm.chosen.family));
  const open = pickDirection(recipe, { product: 'Tsering', fitting: ['market-kitchen', 'corner-cafe'] }, []);
  assert.equal(open.chosen.id, 'market-kitchen'); // 92 mod 2 = 0
  const used = [{ product: 'X', recipe: 'restaurant', direction: 'market-kitchen' }, { product: 'Y', recipe: 'restaurant', direction: 'corner-cafe' }];
  const reuse = pickDirection(recipe, { product: 'Tsering', fitting: ['market-kitchen', 'corner-cafe'] }, used);
  assert.equal(reuse.reuse, true);
  assert.equal(reuse.chosen.id, 'market-kitchen'); // used longest ago
});

test('record_pick appends and reports an earlier claim', () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'lounge-history-')), 'history.jsonl');
  const line = { recipe: 'restaurant', direction: 'tea-house', theme: 'sakura-desk', pairing: 'literary', status: 'claimed' };
  assert.equal(recordPick({ ...line, product: 'First' }, file).conflict, null);
  assert.equal(recordPick({ ...line, product: 'Second' }, file).conflict.product, 'First');
  assert.equal(readHistory(file).lines.length, 2);
});

/* ---------- review ---------- */

test('the slop fixture trips the tells it was written with', async () => {
  const page = await loadPage({ path: fixture('slop.html') });
  const found = ids(auditSlop(page, resolveKit(lib, page), lib));
  for (const id of ['dash', 'buzzwords', 'stock-phrases', 'placeholder', 'emoji-icons', 'icon-card-trio', 'gradient-text', 'ai-purple', 'reduced-motion', 'placeholder-images', 'font-count', 'generic-cta', 'numbered-eyebrows', 'scroll-cue', 'made-up-brands', 'round-numbers', 'z-index', '100vh', 'two-primaries']) {
    assert.ok(found.includes(id), `expected ${id}`);
  }
});

test('the clean fixture passes, with its kit read from DESIGN.md', async () => {
  const page = await loadPage({ path: fixture('good') });
  const kit = resolveKit(lib, page);
  assert.deepEqual([kit.theme, kit.pairing, kit.family], ['paper-ink', 'gallery-wall', 'editorial']);
  assert.deepEqual(ids(auditSlop(page, kit, lib), 'fail'), []);
  const { findings, facts } = await auditSearch(page, await siteFiles(page));
  assert.deepEqual(ids(findings, 'fail'), []);
  assert.equal(facts.ogImage, '1200×630 png');
  assert.deepEqual(facts.aiCrawlers.blockedAnswer, []);
  assert.deepEqual(facts.aiCrawlers.blockedTraining, ['GPTBot']);
});

test('kit drift: faces, colours, and shadow against the locked kit', async () => {
  const html = `<html><head><style>
    body { font-family: Poppins, sans-serif; color: #123456; }
    .card { box-shadow: 0 8px 20px rgba(0,0,0,.2); border-radius: 16px; }
  </style></head><body><p>Hi</p></body></html>`;
  const page = await loadPage({ html });
  const found = ids(auditSlop(page, resolveKit(lib, page, { theme: 'paper-ink', pairing: 'gallery-wall', family: 'editorial' }), lib));
  for (const id of ['off-pairing', 'off-theme', 'off-shadow', 'off-radius']) assert.ok(found.includes(id), `expected ${id}`);
});

test('technique gradients are not the gradient look', async () => {
  const html = `<html><head><style>
    .u { background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat; }
    .dots { background: radial-gradient(var(--primary) 1px, transparent 1.5px) 0 0 / 8px 8px; }
    .scrim { background: linear-gradient(transparent, rgba(0,0,0,.6)); }
  </style></head><body></body></html>`;
  const page = await loadPage({ html });
  assert.ok(!ids(auditSlop(page, resolveKit(lib, page), lib)).includes('gradients'));
});

test('robots.txt: longest rule wins, groups by agent', () => {
  const r = parseRobots('User-agent: *\nDisallow: /private\nAllow: /private/ok\n\nUser-agent: GPTBot\nUser-agent: CCBot\nDisallow: /\n\nSitemap: https://x/sitemap.xml');
  assert.equal(robotsAllows(r, 'Googlebot', '/').allowed, true);
  assert.equal(robotsAllows(r, 'Googlebot', '/private/a').allowed, false);
  assert.equal(robotsAllows(r, 'Googlebot', '/private/ok').allowed, true);
  assert.equal(robotsAllows(r, 'GPTBot', '/').allowed, false);
  assert.equal(robotsAllows(r, 'CCBot/2.0', '/').allowed, false);
  assert.deepEqual(r.sitemaps, ['https://x/sitemap.xml']);
});

test('a JS-only page is invisible to AI crawlers', async () => {
  const page = await loadPage({ html: '<html lang="en"><head><title>App</title></head><body><div id="root"></div><script src="/main.js"></script></body></html>' });
  assert.ok(ids((await auditSearch(page, await siteFiles(page))).findings, 'fail').includes('js-only'));
});

test('suggest_schema uses only facts on the page', async () => {
  const page = await loadPage({ path: fixture('good') });
  const { jsonLd, missing } = suggestSchema(page, {});
  assert.equal(jsonLd[0].name, 'Kettle & Fold');
  assert.equal(jsonLd[0].image, 'https://kettleandfold.example/og.png');
  assert.equal(jsonLd[1]['@type'], 'FAQPage');
  assert.equal(jsonLd[1].mainEntity.length, 3);
  assert.deepEqual(missing, []);
  assert.ok(!('aggregateRating' in jsonLd[0]));
});

test('image sizes from file headers', () => {
  assert.deepEqual(imageSize(fs.readFileSync(fixture('good', 'og.png'))), { type: 'png', width: 1200, height: 630 });
});

test('DESIGN.md lines in either bold style', () => {
  const k = parseDesignMd('- **Mode:** Show, Free\n- Theme: **Loam**, https://www.designlounge.live/themes/loam\n- **Pairing:** The Lounge\n- Family: **Soft** (14px)', lib);
  assert.deepEqual([k.theme, k.pairing, k.family, k.free], ['loam', 'the-lounge', 'soft', true]);
});

/* ---------- the skill comes with the server ---------- */

test('core rules are read from SKILL.md and practice.md', () => {
  const rules = lib.coreRules();
  assert.match(rules, /^## Their words win/);
  assert.match(rules, /One primary button per view/);
  assert.match(rules, /These are fails/);
  assert.match(rules, /A piece you locked may use one of these/);
});

test('installing the server installs the skill, and never takes over a copy it did not make', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'lounge-home-'));
  fs.mkdirSync(path.join(home, '.claude'));
  const first = ensureUserSkill(lib.dir, { home, env: {} });
  assert.equal(first.status, 'installed');
  assert.ok(fs.existsSync(path.join(first.canonical, 'SKILL.md')));
  assert.ok(fs.existsSync(path.join(first.canonical, 'library', 'map.json')));
  assert.ok(!fs.existsSync(path.join(first.canonical, 'install.mjs')));
  assert.ok(fs.lstatSync(path.join(home, '.claude', 'skills', 'design-lounge')).isSymbolicLink());
  assert.ok(!fs.existsSync(path.join(home, '.cursor')), 'no folder for a client that is not installed');
  assert.equal(ensureUserSkill(lib.dir, { home, env: {} }).status, 'current');

  const mark = path.join(first.canonical, '.installed-by-design-lounge-mcp.json');
  fs.writeFileSync(mark, JSON.stringify({ hash: 'old' }));
  assert.equal(ensureUserSkill(lib.dir, { home, env: {} }).status, 'updated');

  fs.rmSync(mark);
  fs.appendFileSync(path.join(first.canonical, 'SKILL.md'), '\nmine');
  const kept = ensureUserSkill(lib.dir, { home, env: {} });
  assert.equal(kept.status, 'kept');
  assert.equal(kept.stale, true);
  assert.match(fs.readFileSync(path.join(first.canonical, 'SKILL.md'), 'utf8'), /mine$/);
  assert.equal(ensureUserSkill(lib.dir, { home, env: {}, replace: true }).status, 'replaced');
  assert.equal(ensureUserSkill(lib.dir, { home, env: { DESIGN_LOUNGE_SKILL_INSTALL: 'off' } }).status, 'off');
});

test('a project install goes to every agent folder, and never into the Lounge repo', () => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), 'lounge-project-'));
  const dests = installProjectSkill(lib.dir, project);
  assert.deepEqual(dests.map((d) => path.relative(project, d)), ['.claude/skills/design-lounge', '.cursor/skills/design-lounge', '.agents/skills/design-lounge']);
  assert.throws(() => installProjectSkill(lib.dir, path.join(here, '..', '..')), /Design Lounge repo/);
});

/* ---------- the server, over stdio ---------- */

test('the server lists its tools and answers over MCP', async () => {
  const client = await connect({ DESIGN_LOUNGE_HISTORY: path.join(os.tmpdir(), `lounge-none-${Date.now()}.jsonl`) });
  try {
    const { tools } = await client.listTools();
    for (const name of ['start_design', 'pick_direction', 'check_pick', 'record_pick', 'search_pieces', 'get_piece', 'get_theme', 'review_page', 'audit_slop', 'audit_search', 'suggest_schema', 'install_skill', 'install_browser', 'match_reference']) {
      assert.ok(tools.some((t) => t.name === name), name);
    }
    const theme = await client.callTool({ name: 'get_theme', arguments: { id: 'kiln' } });
    assert.match(theme.content[0].text, /--primary: #c9693b/);
    const missing = await client.callTool({ name: 'get_piece', arguments: { id: 'hero-made-up' } });
    assert.equal(missing.isError, true);
    const start = JSON.parse((await client.callTool({ name: 'start_design', arguments: { request: 'a site for my momo counter' } })).content[0].text);
    assert.equal(start.recipes[0].id, 'restaurant');
    assert.match(start.brief, /"a site for my momo counter"/);
    assert.match(start.rules, /These are fails/);
    const piece = await client.callTool({ name: 'get_piece', arguments: { id: 'kpi-delta' } });
    assert.ok(piece.content.some((c) => c.type === 'image' && c.mimeType === 'image/webp'));
    assert.ok(!piece.content[0].text.includes('Optional below this line.**\n\n'));
    const { prompts } = await client.listPrompts();
    assert.deepEqual(prompts.map((p) => p.name).sort(), ['design', 'deslop', 'review']);
    const { resources } = await client.listResources();
    assert.ok(resources.some((r) => r.uri === 'lounge://guide/practice.md'));
  } finally {
    await client.close();
  }
});

test('search audit: nested entities, dated creative works, and statement headings are not flagged', async () => {
  const html = `<!doctype html><html lang="en"><head><title>Kettle and Fold momo counter in Patan</title>
    <meta property="og:type" content="article">
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","author":{"@type":"Person","name":"Tsering"},
      "isPartOf":{"@type":"WebSite","publisher":{"@type":"Organization","name":"Kettle and Fold","sameAs":["https://instagram.com/x"]}},
      "mainEntity":{"@type":"CreativeWork","name":"Menu","datePublished":"2026-10-01"}}</script></head>
    <body><main><h1>Kettle and Fold</h1><p>A twelve-seat momo counter in Patan, open from seven.</p>
    <h2>What you get</h2><p>Twelve seats.</p><h2>How it works</h2><p>Call ahead.</p><h2>Who folds them</h2><p>Tsering.</p></main></body></html>`;
  const page = await loadPage({ html });
  const found = ids((await auditSearch(page, await siteFiles(page))).findings);
  for (const id of ['entity', 'author', 'date', 'faq-schema', 'answer-first']) assert.ok(!found.includes(id), `${id} should not fire`);
});
