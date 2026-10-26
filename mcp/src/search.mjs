// Can people and machines find this page, and quote it correctly?
//   SEO: search engines index it and show it well.
//   AEO: answer engines (featured snippets, AI Overviews, voice) can lift a direct answer from it.
//   GEO: generative engines (ChatGPT, Claude, Perplexity, Gemini) can reach it, read it without running JS, and name the entity.
// Every check is one a person could verify by reading the page. Nothing here predicts a ranking.
import { visibleText, readAsset, imageSize } from './source.mjs';

const clip = (s, n = 110) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const wordCount = (s) => (String(s).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
const textOf = (el) => (el?.structuredText || el?.text || '').replace(/\s+/g, ' ').trim();

// Crawlers that fetch pages to answer a person's question right now, and crawlers that collect training data.
// Blocking the first kind keeps a site out of AI answers. Blocking the second is a choice, so it is only reported.
export const AI_BOTS = {
  answer: ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Bingbot', 'Applebot', 'DuckAssistBot'],
  training: ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'meta-externalagent', 'Bytespider', 'Amazonbot'],
};

/** robots.txt groups, and whether a user agent may fetch a path. Longest matching rule wins; Allow wins a tie. */
export function parseRobots(text) {
  const groups = [];
  let cur = null, lastWasAgent = false;
  const sitemaps = [];
  for (const raw of String(text).split('\n')) {
    const line = raw.replace(/#.*/, '').trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase(), val = m[2].trim();
    if (key === 'user-agent') {
      if (!cur || !lastWasAgent) { cur = { agents: [], rules: [] }; groups.push(cur); }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (key === 'sitemap') sitemaps.push(val);
      else if (cur && (key === 'allow' || key === 'disallow')) cur.rules.push({ allow: key === 'allow', path: val });
    }
  }
  return { groups, sitemaps };
}
export function robotsAllows(robots, agent, pathname = '/') {
  const a = agent.toLowerCase();
  const group = robots.groups.find((g) => g.agents.some((x) => x !== '*' && a.startsWith(x))) || robots.groups.find((g) => g.agents.includes('*'));
  if (!group) return { allowed: true, by: 'no rule' };
  let best = null;
  for (const r of group.rules) {
    if (r.path === '') continue; // "Disallow:" with no path allows everything
    const re = new RegExp('^' + r.path.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'));
    if (re.test(pathname) && (!best || r.path.length > best.len || (r.path.length === best.len && r.allow))) best = { allow: r.allow, len: r.path.length, rule: `${r.allow ? 'Allow' : 'Disallow'}: ${r.path}` };
  }
  return { allowed: best ? best.allow : true, by: best ? `${group.agents.join(', ')} › ${best.rule}` : `${group.agents.join(', ')} › no matching rule` };
}

/** Every JSON-LD block, flattened through @graph, with parse errors kept. */
export function jsonLd(root) {
  const items = [], errors = [];
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(s.text);
      const walk = (d) => { if (Array.isArray(d)) d.forEach(walk); else if (d && typeof d === 'object') { if (d['@graph']) walk(d['@graph']); if (d['@type']) items.push(d); } };
      walk(data);
    } catch (e) { errors.push(clip(e.message, 80)); }
  }
  return { items, errors, types: items.flatMap((i) => [].concat(i['@type'])) };
}

const ENTITY_TYPES = /^(?:Organization|Corporation|LocalBusiness|Restaurant|CafeOrCoffeeShop|Bakery|BarOrPub|Store|ClothingStore|Hotel|LodgingBusiness|MedicalBusiness|MedicalClinic|Dentist|Physician|HealthAndBeautyBusiness|DaySpa|BeautySalon|ExerciseGym|SportsActivityLocation|LegalService|Attorney|ProfessionalService|AccountingService|FinancialService|RealEstateAgent|EducationalOrganization|School|CollegeOrUniversity|NGO|Museum|MusicGroup|Person|Product|SoftwareApplication|WebApplication|MobileApplication|Event|Course|Book|CreativeWork|WebSite|Brand|ProfilePage|AboutPage)$/;
const LOCAL_TYPES = /^(?:LocalBusiness|Restaurant|CafeOrCoffeeShop|Bakery|BarOrPub|Store|ClothingStore|Hotel|LodgingBusiness|MedicalBusiness|MedicalClinic|Dentist|Physician|HealthAndBeautyBusiness|DaySpa|BeautySalon|ExerciseGym|LegalService|Attorney|ProfessionalService|AccountingService|RealEstateAgent)$/;

export async function auditSearch(page, site) {
  const F = [];
  const add = (level, area, id, title, evidence, fix) => F.push({ level, area, id, title, evidence: (evidence || []).filter(Boolean).slice(0, 4).map((e) => clip(e)), fix });
  const root = page.root;
  const head = root.querySelector('head') || root;
  const meta = (name) => head.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ?? head.querySelector(`meta[property="${name}"]`)?.getAttribute('content') ?? null;
  const text = visibleText(root);
  const words = wordCount(text);
  const title = textOf(head.querySelector('title'));
  const desc = meta('description');
  const h1s = root.querySelectorAll('h1').map(textOf).filter(Boolean);
  const ld = jsonLd(root);
  const pageUrl = page.url ? new URL(page.url) : null;
  const facts = { title, description: desc, words, h1: h1s[0] || null, jsonLd: ld.types };

  /* ================= SEO ================= */
  if (!title) add('fail', 'seo', 'title', 'No <title>', [], 'Write one: what this page is, then the name. 30 to 60 characters.');
  else {
    if (/^(?:home|index|untitled|document|my app|react app|vite \+ react|vite app|new tab|welcome)$/i.test(title)) add('fail', 'seo', 'title', `A default title: "${title}"`, [title], 'Say what the page is, then the name: "Momo counter in Patan · Tsering\'s".');
    else if (title.length < 20 || title.length > 65) add('warn', 'seo', 'title-length', `Title is ${title.length} characters`, [title], 'Aim for 30 to 60 characters: the page\'s subject first, the name last. Search results cut at about 60.');
  }
  if (!desc) add('fail', 'seo', 'description', 'No meta description', [], 'One or two plain sentences, 70 to 160 characters, that answer "what is this and who is it for". Answer engines quote it.');
  else if (desc.length < 50 || desc.length > 170) add('warn', 'seo', 'description-length', `Description is ${desc.length} characters`, [desc], '70 to 160 characters. Lead with the fact a person would search for.');
  if (!root.querySelector('html')?.getAttribute('lang')) add('fail', 'seo', 'lang', 'No lang on <html>', [], 'Add lang="en" (or the page\'s language). Search and screen readers both use it.');
  if (!head.querySelector('meta[name="viewport"]')) add('fail', 'seo', 'viewport', 'No viewport meta', [], '<meta name="viewport" content="width=device-width, initial-scale=1">. Without it the phone page is not mobile-friendly.');
  const canonical = head.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (!canonical) add('warn', 'seo', 'canonical', 'No canonical link', [], 'Add <link rel="canonical" href="https://…/this-page">, absolute, the one URL you want indexed.');
  else if (!/^https?:\/\//.test(canonical)) add('warn', 'seo', 'canonical', 'Canonical is not absolute', [canonical], 'Use the full https URL.');
  const robotsMeta = `${meta('robots') || ''} ${page.headers?.['x-robots-tag'] || ''}`;
  const closed = /noindex/i.test(robotsMeta);
  if (closed) add('fail', 'seo', 'noindex', 'The page asks not to be indexed', [robotsMeta.trim()], 'Right for a pitch, staging, or private page. Before launch, remove noindex (and any robots.txt Disallow that goes with it).');

  if (h1s.length === 0) add('fail', 'seo', 'h1', 'No <h1>', [], 'One h1 that names the page\'s subject. It can be styled however the design needs.');
  else if (h1s.length > 1) add('warn', 'seo', 'h1', `${h1s.length} h1 elements`, h1s, 'One h1 per page. The rest are h2.');
  const levels = root.querySelectorAll('h1, h2, h3, h4, h5, h6').map((h) => Number(h.tagName[1]));
  const skips = [];
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) skips.push(`h${levels[i - 1]} → h${levels[i]}`);
  if (skips.length) add('warn', 'seo', 'heading-order', 'Heading levels skip', [...new Set(skips)], 'Go down one level at a time. Choose the level by the outline, then style it.');

  const imgs = root.querySelectorAll('img');
  const noAlt = imgs.filter((i) => i.getAttribute('alt') == null);
  if (noAlt.length) add('fail', 'seo', 'alt', `${noAlt.length} of ${imgs.length} images have no alt`, noAlt.map((i) => i.getAttribute('src')), 'Describe what the image shows. A decorative image gets alt="".');
  const badAlt = imgs.filter((i) => /^(?:image|img|photo|picture|logo|icon|banner|untitled|screenshot|dsc_?\d+.*|img_?\d+.*)$/i.test((i.getAttribute('alt') || '').trim()));
  if (badAlt.length) add('warn', 'seo', 'alt', `${badAlt.length} alt texts say nothing ("image", "photo")`, badAlt.map((i) => i.getAttribute('alt')), 'Say what it shows: "The counter at 7am, steam on the glass".');
  const noSize = imgs.filter((i) => !i.getAttribute('width') && !i.getAttribute('height') && !/aspect-ratio/.test(i.getAttribute('style') || ''));
  if (noSize.length > 1) add('warn', 'seo', 'img-size', `${noSize.length} images without width and height`, noSize.map((i) => i.getAttribute('src')), 'Set width and height (or aspect-ratio) so the page does not jump as images load. Layout shift is a Core Web Vital.');

  const links = root.querySelectorAll('a');
  const emptyLinks = links.filter((a) => !textOf(a) && !a.getAttribute('aria-label') && !a.querySelector('img[alt]:not([alt=""])') && !a.getAttribute('title'));
  if (emptyLinks.length) add('fail', 'seo', 'empty-links', `${emptyLinks.length} links with no name`, emptyLinks.map((a) => a.getAttribute('href')), 'Give icon links an aria-label that says where they go.');
  const vague = links.filter((a) => /^(?:click here|here|read more|learn more|more|link|this)$/i.test(textOf(a)));
  if (vague.length) add('warn', 'seo', 'vague-links', `${vague.length} links that say "read more" or "click here"`, vague.map((a) => `${textOf(a)} → ${a.getAttribute('href')}`), 'The link text says where it goes: "Read the menu", "See the 2025 report".');
  const deadHash = links.filter((a) => a.getAttribute('href') === '#' || a.getAttribute('href') === '');
  if (deadHash.length) add('warn', 'seo', 'dead-links', `${deadHash.length} links to "#"`, deadHash.map(textOf), 'A link goes where its label says. If you do not have the URL, drop the link and list it in the reply.');

  // Share card
  const og = { title: meta('og:title'), description: meta('og:description'), image: meta('og:image'), url: meta('og:url'), type: meta('og:type') };
  const missingOg = Object.entries(og).filter(([, v]) => !v).map(([k]) => `og:${k}`);
  if (missingOg.length) add(missingOg.includes('og:image') || missingOg.includes('og:title') ? 'fail' : 'warn', 'seo', 'open-graph', `Share card is missing ${missingOg.join(', ')}`, [], 'Add og:title, og:description, og:image (absolute URL, 1200 × 630), og:url, og:type. Links shared in chat apps and AI answers use these.');
  if (og.image) {
    if (!/^https?:\/\//.test(og.image) && page.kind === 'url') add('warn', 'seo', 'og-image', 'og:image is not an absolute URL', [og.image], 'Most scrapers need the full https URL.');
    const buf = await readAsset(page, og.image, null, { bytes: true });
    const size = buf ? imageSize(buf) : null;
    if (!buf && page.kind !== 'html') add('fail', 'seo', 'og-image', 'og:image does not load', [og.image], 'Point it at a real 1200 × 630 PNG or JPEG.');
    else if (size && (size.width !== 1200 || size.height !== 630)) add('warn', 'seo', 'og-image', `Share image is ${size.width} × ${size.height}`, [og.image], 'Make it exactly 1200 × 630: the wordmark and the headline on --bg, in the pairing (components.md › Logo and favicon).');
    facts.ogImage = size ? `${size.width}×${size.height} ${size.type}` : og.image;
  }
  if (!meta('twitter:card')) add('info', 'seo', 'twitter-card', 'No twitter:card', [], '<meta name="twitter:card" content="summary_large_image"> makes the share image large on X and some chat apps.');
  const icons = head.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]');
  if (!icons.length) add('warn', 'seo', 'favicon', 'No favicon link', [], 'favicon.svg, favicon.ico, and a 180 × 180 apple-touch-icon.png (components.md › Logo and favicon). Search results show the favicon.');
  else if (!head.querySelector('link[rel="apple-touch-icon"]')) add('info', 'seo', 'favicon', 'No apple-touch-icon', [], 'Add a 180 × 180 apple-touch-icon.png.');

  // Weight and blocking scripts
  if (page.bytes > 600_000) add('warn', 'seo', 'weight', `The HTML alone is ${Math.round(page.bytes / 1024)} KB`, [], 'Move inline data and SVG sprites out of the document.');
  const blocking = head.querySelectorAll('script[src]').filter((s) => !s.hasAttribute('defer') && !s.hasAttribute('async') && s.getAttribute('type') !== 'module');
  if (blocking.length) add('warn', 'seo', 'blocking-js', `${blocking.length} scripts in <head> block the first paint`, blocking.map((s) => s.getAttribute('src')), 'Add defer, or load them at the end of <body>.');
  if (page.kind === 'url') {
    if (pageUrl.protocol !== 'https:') add('fail', 'seo', 'https', 'Served over http', [page.url], 'Serve over https and redirect http to it.');
    if (page.status >= 400) add('fail', 'seo', 'status', `HTTP ${page.status}`, [page.url], 'The page must return 200.');
    if (page.ms > 1800) add('warn', 'seo', 'slow', `First response took ${page.ms} ms`, [], 'Aim under 800 ms: cache the HTML at the edge or render it statically.');
  }

  // robots.txt and sitemap
  const robotsTxt = site['robots.txt'];
  const robots = robotsTxt?.text ? parseRobots(robotsTxt.text) : null;
  const pathName = pageUrl ? pageUrl.pathname : '/';
  if (robotsTxt?.missing && !robotsTxt.unknown) add('warn', 'seo', 'robots', 'No robots.txt', [robotsTxt.where], 'Add one at the site root. Allow everything you want found, and list the sitemap: "Sitemap: https://…/sitemap.xml".');
  if (robots) {
    const g = robotsAllows(robots, 'Googlebot', pathName);
    if (!g.allowed && !closed) add('fail', 'seo', 'robots-block', 'robots.txt blocks search engines from this page', [g.by], 'Remove the Disallow for this path.');
    if (!robots.sitemaps.length) add('info', 'seo', 'robots-sitemap', 'robots.txt does not list a sitemap', [], 'Add "Sitemap: https://…/sitemap.xml".');
  }
  const sitemap = site['sitemap.xml'];
  if (sitemap?.missing && !sitemap.unknown && !robots?.sitemaps.length) add('warn', 'seo', 'sitemap', 'No sitemap.xml', [sitemap.where], 'List every page you want indexed, with <lastmod> only where the date is true.');

  /* ================= AEO ================= */
  // Questions as headings, each answered in the first sentences below it.
  const qHeads = root.querySelectorAll('h2, h3, h4, summary, dt, button[aria-expanded]').filter((h) => /\?\s*$/.test(textOf(h)) || /^(?:how|what|why|when|where|who|which|can|does|do|is|are|will|should)\b/i.test(textOf(h)));
  const answers = qHeads.map((h) => {
    let n = h.nextElementSibling;
    if (h.tagName === 'SUMMARY') n = h.parentNode?.querySelector('p, div:not(summary)');
    if (h.tagName === 'DT') n = h.nextElementSibling;
    while (n && !textOf(n) && n.nextElementSibling) n = n.nextElementSibling;
    if (!n && h.tagName === 'BUTTON') n = h.parentNode?.nextElementSibling;
    return { q: textOf(h), a: textOf(n) };
  });
  facts.questions = qHeads.length;
  if (qHeads.length) {
    const long = answers.filter((x) => wordCount(x.a.split(/(?<=[.!?])\s/).slice(0, 2).join(' ')) > 60);
    const none = answers.filter((x) => !x.a);
    if (none.length) add('warn', 'aeo', 'answer-missing', `${none.length} questions with no answer text after them in the HTML`, none.map((x) => x.q), 'Put the answer in the HTML right after the question. Answers loaded on click or by script are often not read.');
    if (long.length) add('warn', 'aeo', 'answer-first', `${long.length} answers that do not open with a short direct answer`, long.map((x) => x.q), 'Start each answer with one or two sentences, under 50 words, that answer it outright. Then the detail.');
  }
  else if (words >= 120) add('info', 'aeo', 'no-questions', 'No questions answered on the page', [], 'If people ask things before they buy or visit (price, hours, parking, how long it takes), answer the real ones as question headings with a short answer under each.');
  const faqLd = ld.items.find((i) => [].concat(i['@type']).includes('FAQPage'));
  if (qHeads.length >= 3 && !faqLd) add('warn', 'aeo', 'faq-schema', `${qHeads.length} questions on the page and no FAQPage data`, [], 'Add FAQPage JSON-LD with the same questions and answers, word for word as shown. Use suggest_schema.');
  if (faqLd) {
    const qs = [].concat(faqLd.mainEntity || []).map((q) => q?.name).filter(Boolean);
    const unseen = qs.filter((q) => !text.toLowerCase().includes(String(q).toLowerCase().slice(0, 40)));
    if (unseen.length) add('fail', 'aeo', 'faq-mismatch', `${unseen.length} FAQPage questions are not on the page`, unseen, 'Structured data must match what people see. Remove them, or show them.');
  }
  // The opening: does the page say what it is, near the top, in a sentence a machine can lift?
  const main = root.querySelector('main') || root.querySelector('body') || root;
  const firstP = main.querySelectorAll('p').map(textOf).find((t) => wordCount(t) >= 8);
  facts.lead = firstP ? clip(firstP, 160) : null;
  if (!firstP) add('warn', 'aeo', 'lead', 'No opening sentence in the HTML', [], 'Under the headline, one plain sentence: what this is, for whom, where. "A twelve-seat momo counter in Patan, open 7am to 3pm."');
  else if (wordCount(firstP) > 70) add('warn', 'aeo', 'lead', `The opening paragraph is ${wordCount(firstP)} words`, [firstP], 'Lead with one sentence under 30 words that a search engine could quote alone.');
  const stepsAsText = root.querySelectorAll('p').map(textOf).filter((t) => /^(?:step\s*)?\d[.)]\s/i.test(t));
  if (stepsAsText.length >= 3) add('info', 'aeo', 'steps-list', 'Steps written as paragraphs', stepsAsText, 'Use an <ol>. Answer engines lift ordered lists as steps.');

  /* ================= GEO ================= */
  // Most AI crawlers do not run JavaScript. What is in the HTML as served is what they read.
  const shell = root.querySelector('#root, #app, #__next, #___gatsby, [data-reactroot], #svelte');
  facts.serverWords = words;
  if (words < 80 && (shell || root.querySelectorAll('script[src]').length)) add('fail', 'geo', 'js-only', `Only ${words} words in the HTML as served`, [shell ? `empty mount: #${shell.getAttribute('id') || 'root'}` : 'content arrives by script'], 'Render the text on the server or at build time (SSG/SSR, Astro, Next static export). AI crawlers mostly read raw HTML and skip scripts.');
  else if (words < 150) add('warn', 'geo', 'thin', `Only ${words} words of text`, [], 'Answer engines quote text. Say what it is, who it is for, the facts (place, hours, prices, specs), and how to act, in sentences.');
  if (robots) {
    const blocked = AI_BOTS.answer.filter((b) => !robotsAllows(robots, b, pathName).allowed);
    const trainingBlocked = AI_BOTS.training.filter((b) => !robotsAllows(robots, b, pathName).allowed);
    if (blocked.length && closed) add('info', 'geo', 'ai-search-blocked', `robots.txt also blocks answer crawlers (${blocked.length})`, [], 'Goes with the noindex. Lift both at launch.');
    else if (blocked.length) add('fail', 'geo', 'ai-search-blocked', `robots.txt blocks answer crawlers: ${blocked.join(', ')}`, blocked.map((b) => robotsAllows(robots, b, pathName).by), 'These fetch the page when someone asks an AI about it. Blocking them keeps the site out of those answers. Allow them, even if you block the training crawlers.');
    facts.aiCrawlers = { blockedAnswer: blocked, blockedTraining: trainingBlocked };
    if (trainingBlocked.length) add('info', 'geo', 'ai-training-blocked', `Training crawlers blocked: ${trainingBlocked.join(', ')}`, [], 'A fair choice. It does not stop AI search answers, which use the answer crawlers.');
  }
  if (ld.errors.length) add('fail', 'geo', 'jsonld-error', `${ld.errors.length} JSON-LD blocks do not parse`, ld.errors, 'Fix the JSON. A broken block is ignored entirely.');
  const entity = ld.items.find((i) => [].concat(i['@type']).some((t) => ENTITY_TYPES.test(t) && t !== 'WebSite'));
  if (!entity) add('warn', 'geo', 'entity', 'No structured data that says who or what this is', ld.types.length ? [`has: ${ld.types.join(', ')}`] : [], 'Add JSON-LD for the entity: Organization, LocalBusiness (or Restaurant, Dentist...), Person, Product, or SoftwareApplication, with name, url, logo or image, and sameAs links to its real profiles. Use suggest_schema.');
  else {
    const t = [].concat(entity['@type']);
    if (!entity.name) add('warn', 'geo', 'entity-name', `${t[0]} has no name`, [], 'Add name, spelled exactly as on the page.');
    if (!entity.sameAs && !t.includes('Product')) add('info', 'geo', 'same-as', `${t[0]} has no sameAs`, [], 'List the real profiles (Google Business, Instagram, LinkedIn, GitHub, Wikipedia). It ties this page to the entity AI engines already know.');
    if (t.some((x) => LOCAL_TYPES.test(x))) {
      const miss = ['address', 'telephone', 'openingHoursSpecification'].filter((k) => !entity[k] && !(k === 'openingHoursSpecification' && entity.openingHours));
      if (miss.length) add('warn', 'geo', 'local-facts', `${t[0]} is missing ${miss.join(', ')}`, [], 'Add the facts people ask an assistant for: address, phone, hours. Only real ones.');
    }
    const name = String(entity.name || '').toLowerCase();
    if (name && title && !title.toLowerCase().includes(name.split(/\s+/)[0]) && !(h1s[0] || '').toLowerCase().includes(name.split(/\s+/)[0])) add('warn', 'geo', 'entity-consistency', `The entity name "${entity.name}" is not in the title or h1`, [title, h1s[0]], 'Use one name everywhere: title, h1, JSON-LD, footer. Engines join facts by name.');
  }
  // <article> is often a card. An article page says so in og:type or JSON-LD, or has one long <article>.
  const articles = root.querySelectorAll('article');
  const isArticle = og.type === 'article' || ld.types.some((t) => /Article|BlogPosting|NewsArticle/.test(t)) || (articles.length === 1 && wordCount(textOf(articles[0])) >= 300);
  if (isArticle) {
    const art = ld.items.find((i) => [].concat(i['@type']).some((t) => /Article|BlogPosting|NewsArticle/.test(t)));
    const byline = art?.author || head.querySelector('meta[name="author"]') || root.querySelector('[rel="author"], [itemprop="author"], .author, .byline');
    const date = art?.dateModified || art?.datePublished || root.querySelector('time[datetime]');
    if (!byline) add('warn', 'geo', 'author', 'An article with no author', [], 'Name the author, on the page and in Article JSON-LD. Engines weigh who said it.');
    if (!date) add('warn', 'geo', 'date', 'An article with no date', [], 'Show the date in <time datetime="2026-10-27"> and set datePublished and dateModified.');
  }
  if (words >= 250) {
    const numbers = (text.match(/\b\d[\d,.:]*\b/g) || []).length;
    if (numbers < 3) add('info', 'geo', 'facts', `${words} words and almost no specifics`, [], 'Generative engines quote facts: numbers, dates, places, prices, names. Add the real ones you have.');
  }
  if (pageUrl) {
    const external = links.map((a) => a.getAttribute('href') || '').filter((h) => /^https?:\/\//.test(h)).filter((h) => { try { return new URL(h).host !== pageUrl.host; } catch { return false; } });
    facts.externalLinks = external.length;
  }
  const llms = site['llms.txt'];
  facts.llmsTxt = llms ? !llms.missing : null;
  if (llms?.missing && !llms.unknown) add('info', 'geo', 'llms-txt', 'No llms.txt', [], 'Optional. A short Markdown map of the site for LLM tools. Cheap to add, but no major engine has said it uses it, so do it last.');

  return { findings: F, facts };
}

/** JSON-LD built only from facts found on the page. Anything not found is left out and listed, never invented. */
export function suggestSchema(page, { type, name, url, extra = {} } = {}) {
  const root = page.root;
  const head = root.querySelector('head') || root;
  const meta = (n) => head.querySelector(`meta[name="${n}"]`)?.getAttribute('content') ?? head.querySelector(`meta[property="${n}"]`)?.getAttribute('content') ?? null;
  const canonical = head.querySelector('link[rel="canonical"]')?.getAttribute('href') || meta('og:url') || page.url || null;
  // The brand is usually the last part of the title ("Momo counter in Patan · Kettle & Fold"). The h1 is a headline, not a name.
  const titleParts = textOf(head.querySelector('title')).split(/\s+[·|–—-]\s+/).filter(Boolean);
  const existing = jsonLd(root).items.find((i) => [].concat(i['@type']).some((t) => ENTITY_TYPES.test(t) && t !== 'WebSite')) || {};
  const abs = (u) => { try { return u && canonical ? new URL(u, canonical).href : u; } catch { return u; } };
  const found = {};
  found.name = name || existing.name || meta('og:site_name') || (titleParts.length > 1 ? titleParts.at(-1) : null) || textOf(root.querySelector('h1')) || null;
  found.url = url || existing.url || canonical;
  found.description = existing.description || meta('description') || meta('og:description');
  found.image = abs(existing.image || meta('og:image'));
  const tel = root.querySelector('a[href^="tel:"]')?.getAttribute('href')?.slice(4);
  const mail = root.querySelector('a[href^="mailto:"]')?.getAttribute('href')?.slice(7).split('?')[0];
  const addressEl = root.querySelector('address');
  const social = root.querySelectorAll('a[href]').map((a) => a.getAttribute('href')).filter((h) => /^https:\/\/(?:www\.)?(?:instagram|facebook|linkedin|x|twitter|github|youtube|tiktok|threads|mastodon\.social|bsky)\.(?:com|app|net)\/|maps\.app\.goo\.gl|g\.page|wikipedia\.org/.test(h));
  const t = type || [].concat(existing['@type'] || 'Organization')[0];
  const out = { '@context': 'https://schema.org', ...existing, '@type': t };
  for (const [k, v] of Object.entries(found)) if (v) out[k] = v;
  if (tel && !out.telephone) out.telephone = tel;
  if (mail && !out.email) out.email = mail;
  if (addressEl && !out.address) out.address = textOf(addressEl);
  if (social.length) out.sameAs = [...new Set([].concat(out.sameAs || [], social))];
  Object.assign(out, extra);
  const missing = [];
  if (!out.name) missing.push('name');
  if (!out.url) missing.push('url');
  if (LOCAL_TYPES.test(t)) for (const k of ['address', 'telephone', 'openingHoursSpecification']) if (!out[k] && !(k === 'openingHoursSpecification' && out.openingHours)) missing.push(k);
  if (!out.sameAs && t !== 'Product') missing.push('sameAs');
  const blocks = [out];
  // FAQ from the page's own questions and answers.
  const qa = root.querySelectorAll('details').map((d) => ({ q: textOf(d.querySelector('summary')), a: textOf(d).replace(textOf(d.querySelector('summary')), '').trim() }))
    .concat(root.querySelectorAll('dt').map((dt) => ({ q: textOf(dt), a: textOf(dt.nextElementSibling) })))
    .concat(root.querySelectorAll('h2, h3').filter((h) => /\?\s*$/.test(textOf(h))).map((h) => ({ q: textOf(h), a: textOf(h.nextElementSibling) })))
    .filter((x) => x.q && x.a && /\?\s*$/.test(x.q));
  if (qa.length >= 2) blocks.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa.slice(0, 12).map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })) });
  return { jsonLd: blocks, missing, note: 'Built only from what is on the page. Fill the missing fields with real facts or leave them out. Never add a rating, review, or price that is not shown.' };
}
