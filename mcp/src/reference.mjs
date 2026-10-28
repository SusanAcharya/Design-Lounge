// Match a reference to the library: someone shows a site they like, and this measures its design language
// (colour roles, type, corners, shadows, density, page structure, motion) and finds the closest Lounge theme,
// pairing, family, and pieces. It matches the feel. It never copies the site: no logo, name, words, or photos.
import { hexToOklab, oklabDistance, contrastRatio, samplePalette } from './palette.mjs';
import { FONTS, classifyFont, fontDistance, parseTypeDescription } from './fonts.mjs';

/* ---------- measuring a live page ---------- */

/** Runs in the page. Everything a designer would read off the reference, as numbers. */
function measurePage() {
  const vw = innerWidth;
  const parse = (c) => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return { r, g, b, a }; };
  const hex = ({ r, g, b }) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const visible = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0.05 && r.width > 0 && r.height > 0; };
  const add = (map, k, w) => { if (k) map[k] = (map[k] || 0) + w; };
  const top = (map, n = 8) => Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, n);

  // Ground: the colour that covers the most of the page, counting only the visible part of each box.
  const area = {}, text = {}, controls = {}, links = {}, borders = {};
  const pageArea = vw * Math.max(document.documentElement.scrollHeight, innerHeight);
  const rootBg = parse(getComputedStyle(document.body).backgroundColor);
  const htmlBg = parse(getComputedStyle(document.documentElement).backgroundColor);
  const ground = rootBg && rootBg.a > 0.5 ? rootBg : htmlBg && htmlBg.a > 0.5 ? htmlBg : { r: 255, g: 255, b: 255, a: 1 };
  add(area, hex(ground), pageArea * 0.2);
  const all = [...document.body.querySelectorAll('*')].slice(0, 6000);
  for (const el of all) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    const bg = parse(s.backgroundColor);
    if (bg && bg.a > 0.6) add(area, hex(bg), Math.min(r.width, vw) * r.height);
    if (parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none') { const bc = parse(s.borderTopColor); if (bc && bc.a > 0.3) add(borders, hex(bc), 1); }
    const isControl = el.matches('a, button, [role="button"], input[type="submit"]');
    if (isControl && r.height >= 28 && r.width >= 60 && bg && bg.a > 0.6) add(controls, hex(bg), r.width * r.height);
    if (el.tagName === 'A') { const c = parse(s.color); if (c) add(links, hex(c), 1); }
  }
  // Ink: the colour most of the words are set in.
  const faces = { display: {}, text: {} };
  const sizes = { display: [], text: [] }, weights = { display: [], text: [] };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode.textContent.replace(/\s+/g, ' ').trim();
    const el = walker.currentNode.parentElement;
    if (!t || !el || seen.has(el) || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName) || !visible(el)) continue;
    seen.add(el);
    const s = getComputedStyle(el);
    const c = parse(s.color);
    if (c) add(text, hex(c), t.length);
    const size = parseFloat(s.fontSize);
    const role = el.closest('h1, h2, h3') || size >= 28 ? 'display' : size >= 13 && size <= 22 ? 'text' : null;
    if (!role) continue;
    const fam = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    add(faces[role], fam, t.length);
    sizes[role].push(size);
    weights[role].push(parseFloat(s.fontWeight) || 400);
  }
  const median = (a) => (a.length ? a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)] : null);

  // Corners and shadows, on the things a family decides: buttons and cards.
  const radii = { control: [], card: [] };
  let shadows = 0, hardShadows = 0, boxed = 0, blur = 0, outlineButtons = 0, filledButtons = 0, heroFilled = false;
  for (const el of all) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    const isControl = el.matches('a, button, [role="button"], input:not([type="hidden"]), select');
    const bg = parse(s.backgroundColor);
    const hasBox = (bg && bg.a > 0.6 && hex(bg) !== hex(ground)) || (parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none');
    if (!hasBox) continue;
    const radius = parseFloat(s.borderTopLeftRadius) || 0;
    if (isControl && r.height >= 28 && r.height <= 72) {
      radii.control.push(radius >= r.height / 2 - 1 ? 999 : radius);
      if (bg && bg.a > 0.6 && hex(bg) !== hex(ground)) filledButtons++; else outlineButtons++;
      // The first screen's main action says more than a count of every button on the page.
      if (r.top < innerHeight && bg && bg.a > 0.6 && Math.max(bg.r, bg.g, bg.b) - Math.min(bg.r, bg.g, bg.b) > 40) heroFilled = true;
    } else if (r.width >= 160 && r.height >= 100 && r.width < vw * 0.95) {
      radii.card.push(radius);
      boxed++;
      if (s.boxShadow && s.boxShadow !== 'none') {
        shadows++;
        if (/(?:^|\s)-?\d+px\s+-?\d+px\s+0(?:px)?(?:\s|$)/.test(s.boxShadow) && !/0px 0px 0px/.test(s.boxShadow)) hardShadows++;
      }
    }
    if (/blur\(/.test(s.backdropFilter || s.webkitBackdropFilter || '')) blur++;
  }

  // Structure: the nav, the first screen, and what each section is for.
  const header = document.querySelector('header, nav, [role="banner"]');
  const headerStyle = header ? getComputedStyle(header) : null;
  const h1 = document.querySelector('h1');
  const firstScreen = { media: 0, headline: h1 ? parseFloat(getComputedStyle(h1).fontSize) : null, align: h1 ? getComputedStyle(h1).textAlign : null, h1Left: h1 ? h1.getBoundingClientRect().left : null, h1Width: h1 ? h1.getBoundingClientRect().width : null };
  let mediaBox = null;
  for (const el of document.querySelectorAll('img, video, canvas, svg, picture, iframe')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0 && r.width * r.height > (mediaBox ? mediaBox.width * mediaBox.height : 0)) mediaBox = r;
  }
  if (mediaBox) firstScreen.media = (Math.min(mediaBox.width, vw) * Math.min(mediaBox.height, innerHeight)) / (vw * innerHeight);
  firstScreen.mediaLeft = mediaBox ? mediaBox.left : null;
  firstScreen.mediaWidth = mediaBox ? mediaBox.width : null;
  const heroBg = (() => { const el = h1 && h1.closest('section, header, div'); const bg = el && parse(getComputedStyle(el).backgroundColor); return bg && bg.a > 0.6 ? hex(bg) : null; })();
  const blocks = [...document.querySelectorAll('main > *, body > section, body > div > section, main section, footer')].filter((el) => visible(el) && el.getBoundingClientRect().height > 120);
  const sections = blocks.slice(0, 24).map((el) => {
    const heading = el.querySelector('h1, h2, h3');
    return {
      tag: el.tagName.toLowerCase(),
      cls: `${el.id || ''} ${el.className && el.className.baseVal === undefined ? el.className : ''}`.toLowerCase().slice(0, 120),
      heading: heading ? heading.textContent.replace(/\s+/g, ' ').trim().slice(0, 80) : '',
      height: Math.round(el.getBoundingClientRect().height),
      cards: el.querySelectorAll('article, li, [class*="card"]').length,
      forms: el.querySelectorAll('form, input[type="email"]').length,
      prices: (el.textContent.match(/[$€£₹]\s?\d|\/\s?mo\b|per month/gi) || []).length,
      quotes: el.querySelectorAll('blockquote, q, [class*="testimonial"], [class*="quote"]').length,
      logos: el.querySelectorAll('img[alt*="logo" i], [class*="logo"] img, [class*="logos"] svg').length,
      details: el.querySelectorAll('details, [aria-expanded]').length,
      images: el.querySelectorAll('img, picture, video').length,
    };
  });

  // Width and density: the main column, and the space between sections.
  const widths = [...document.querySelectorAll('main *, section *')].slice(0, 3000).filter(visible).map((el) => Math.round(el.getBoundingClientRect().width)).filter((w) => w < vw - 40 && w > 480);
  const pads = blocks.slice(0, 12).map((el) => parseFloat(getComputedStyle(el).paddingTop) + parseFloat(getComputedStyle(el).paddingBottom)).filter((n) => n > 0);

  // Motion: what moves, and whether a scroll library runs it.
  let animated = 0;
  for (const el of all) { const s = getComputedStyle(el); if ((s.animationName && s.animationName !== 'none') || (s.transitionDuration && s.transitionDuration !== '0s' && /transform|opacity|all/.test(s.transitionProperty))) animated++; }
  const scripts = [...document.scripts].map((s) => s.src).join(' ');
  const motionLibs = ['gsap', 'lenis', 'locomotive', 'framer-motion', 'motion', 'aos', 'barba', 'swiper', 'three', 'lottie'].filter((n) => new RegExp(`\\b${n}\\b`, 'i').test(scripts) || (n === 'gsap' && window.gsap) || (n === 'three' && window.THREE) || (n === 'lenis' && window.Lenis));

  return {
    title: document.title,
    colours: { ground: hex(ground), area: top(area), text: top(text, 6), controls: top(controls, 4), links: top(links, 4), borders: top(borders, 3) },
    faces: { display: top(faces.display, 3), text: top(faces.text, 3) },
    sizes: { display: median(sizes.display), text: median(sizes.text), h1: firstScreen.headline },
    weights: { display: median(weights.display), text: median(weights.text) },
    radii: { control: median(radii.control), card: median(radii.card) },
    surfaces: { boxed, shadows, hardShadows, blur, filledButtons, outlineButtons, heroFilled },
    nav: header ? { sticky: /sticky|fixed/.test(headerStyle.position), height: Math.round(header.getBoundingClientRect().height) } : null,
    firstScreen, heroBg, sections,
    column: median(widths), sectionPadding: median(pads),
    motion: { animated, libs: motionLibs },
    height: document.documentElement.scrollHeight,
  };
}

async function launch() {
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch { return null; }
}

/** Open the reference in Chromium and measure it. Returns null when there is no browser. */
export async function measureUrl(url, { timeout = 30000 } = {}) {
  const browser = await launch();
  if (!browser) return null;
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'load', timeout }).catch(() => {});
    await page.evaluate(() => document.fonts?.ready).catch(() => {});
    await page.waitForTimeout(1200);
    // Dismiss nothing, click nothing: measure what a visitor sees first.
    const data = await page.evaluate(measurePage);
    const shot = await page.screenshot({ type: 'jpeg', quality: 72 });
    await ctx.close();
    return { ...data, url: page.url(), shot };
  } finally {
    await browser.close();
  }
}

/* ---------- reading the measurements as roles ---------- */

// Sites rename the faces they serve: sohne-var, GeistSans, NotionInter. Find the known face inside the name.
const COMPACT = Object.keys(FONTS).map((k) => [k.replace(/[^a-z0-9]/g, ''), k]).filter(([c]) => c.length >= 4).sort((a, b) => b[0].length - a[0].length);
export function classifyFace(name) {
  const direct = classifyFont(name);
  if (!direct.guessed) return direct;
  const compact = String(name).toLowerCase().replace(/[^a-z0-9]/g, '');
  const hit = COMPACT.find(([c]) => compact.includes(c));
  return hit ? { ...classifyFont(hit[1]), family: name, via: hit[1] } : direct;
}

const chroma = (hex) => { const [, a, b] = hexToOklab(hex); return Math.hypot(a, b); };
const lightness = (hex) => hexToOklab(hex)[0];

/** Turn measured colours into the roles a theme has: ground, surface, ink, ink-2, primary. */
export function rolesFromMeasure(m) {
  const area = m.colours.area.map(([h, w]) => ({ h, w }));
  const bg = m.colours.ground;
  const surface = area.map((x) => x.h).find((h) => h !== bg && chroma(h) < 0.05 && Math.abs(lightness(h) - lightness(bg)) < 0.12 && oklabDistance(hexToOklab(h), hexToOklab(bg)) > 0.015) || null;
  const texts = m.colours.text.map(([h]) => h).filter((h) => contrastRatio(h, bg) >= 3);
  const ink = texts.sort((a, b) => contrastRatio(b, bg) - contrastRatio(a, bg))[0] || (lightness(bg) < 0.5 ? '#f5f5f5' : '#111111');
  const ink2 = m.colours.text.map(([h]) => h).find((h) => h !== ink && chroma(h) < 0.05 && contrastRatio(h, bg) >= 3) || null;
  // The accent: the most used chromatic colour on filled buttons, then links, then large areas.
  const chromatic = (list) => list.map(([h, w]) => ({ h, w })).filter((x) => chroma(x.h) > 0.05);
  const accent = chromatic(m.colours.controls)[0]?.h || chromatic(m.colours.links)[0]?.h || chromatic(m.colours.area)[0]?.h || null;
  return { mode: lightness(bg) < 0.5 ? 'dark' : 'light', bg, surface, ink, ink2, accent };
}

/* ---------- matching to the library ---------- */

const dist = (a, b) => (a && b ? oklabDistance(hexToOklab(a), hexToOklab(b)) : null);

/** The closest themes by role, weighted the way people notice them: the ground and the accent first. */
export function matchThemes(lib, roles, limit = 3) {
  const W = { bg: 3, accent: 3, ink: 1, surface: 1 };
  const scored = lib.index.themes.map((t) => {
    const tk = t.tokens;
    const parts = { bg: dist(roles.bg, tk.bg), accent: dist(roles.accent, tk.primary), ink: dist(roles.ink, tk.ink), surface: dist(roles.surface, tk.surface) };
    // An accent can match the theme's secondary or tertiary too, at a small cost.
    if (roles.accent) parts.accent = Math.min(parts.accent, (dist(roles.accent, tk.secondary) ?? 9) + 0.04, (dist(roles.accent, tk.tertiary) ?? 9) + 0.04);
    let sum = 0, weight = 0;
    for (const [k, v] of Object.entries(parts)) if (v != null) { sum += v * W[k]; weight += W[k]; }
    const modePenalty = t.mode === roles.mode ? 0 : 0.25;
    // A theme with a strong look of its own should win on more than colour distance.
    const niche = (t.tags || []).some((g) => /y2k|chrome|arcade|pixel|neon|cyber|hud|retro|festival|game/.test(g)) ? 0.02 : 0;
    return { id: t.id, name: t.name, mode: t.mode, mood: t.mood, score: +(sum / weight + modePenalty + niche).toFixed(3), parts: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, v == null ? null : +v.toFixed(3)])) };
  });
  return scored.sort((a, b) => a.score - b.score).slice(0, limit);
}

/** Wada combinations close to the reference's accent and ground, for when no theme is near (Free colour, a brand board). */
export function matchWada(lib, roles, limit = 3) {
  if (!roles.accent) return [];
  return lib.wada.rows.map((row) => {
    const hexes = row.match(/#[0-9a-f]{6}/gi) || [];
    const a = Math.min(...hexes.map((h) => dist(h, roles.accent)));
    return { row, score: +a.toFixed(3) };
  }).sort((x, y) => x.score - y.score).slice(0, limit);
}

const GENERIC_WORDS = new Set(['sans', 'serif', 'display', 'text', 'mono', 'grotesk', 'grotesque', 'variable', 'adobe', 'std', 'pro', 'web', 'new', 'neue']);
const nameWords = (n) => String(n || '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !GENERIC_WORDS.has(w));
const sharesName = (a, b) => { const wa = nameWords(a); return nameWords(b).some((w) => wa.includes(w)); };

/** The closest pairings: the same families first, then the same kind and style of face. */
export function matchPairings(lib, type, limit = 3) {
  const oneFamily = type.display?.family && type.text?.family && type.display.family === type.text.family;
  const scored = lib.index.pairings.map((p) => {
    const pd = classifyFont(p.display), pt = classifyFont(p.text);
    const full = lib.pairing(p.id);
    let s = 0;
    // Ties are common among sans pairings, so the headline's weight and one face throughout break them.
    if (type.display?.weight && full?.display?.weight) s += Math.abs(type.display.weight - full.display.weight) / 400;
    if (oneFamily != null) s += (p.display === p.text) === oneFamily ? 0 : 0.6;
    // The headline face is what people notice, so it counts for more than the body face. A shared name
    // ("Caslon" in TNYAdobeCaslonPro and Libre Caslon Text) is the strongest signal of all.
    if (type.display) s += 2.5 * fontDistance(type.display, pd) - (sharesName(type.display.family, p.display) ? 1 : 0);
    if (type.text) s += 0.6 * fontDistance(type.text, pt) - (sharesName(type.text.family, p.text) ? 0.5 : 0);
    return { id: p.id, name: p.name, display: p.display, text: p.text, mood: p.mood, score: +s.toFixed(2) };
  });
  return scored.sort((a, b) => a.score - b.score).slice(0, limit);
}

/** The family: corners, how shadows are made, and whether buttons are filled or outlined. */
export function matchFamily(lib, look) {
  // Cards decide the radius; pill buttons are common in many families, so they only lean toward soft.
  const pill = look.radius >= 999;
  const radius = look.cardRadius ?? (pill ? 14 : look.radius ?? 6);
  const fams = lib.families().map((f) => {
    const fr = parseFloat(f.radius) || 0;
    const shadow = f.shadow === 'none' ? 'none' : /var\(--ink\)|\d+px \d+px 0(?:\s|$)/.test(f.shadow) ? 'hard' : 'soft';
    // Corners: a 4px miss matters at 2px, not at 20px, so the tolerance grows with the radius.
    const target = Math.min(fr >= 999 ? 24 : fr, 40);
    let s = Math.min(Math.abs(Math.min(radius, 40) - target) / Math.max(3, target * 0.5), 4);
    if (look.shadow && look.shadow !== shadow) s += look.shadow === 'hard' || shadow === 'hard' ? 1.5 : 0.75;
    if (pill && f.id === 'soft') s -= 0.5;
    if (f.id === 'lit' && !(look.mode === 'dark' && pill)) s += 2;
    if (f.id === 'tactile' && look.shadow !== 'soft') s += 1.5;
    if (look.buttons && f.button !== look.buttons && !(f.button === 'soft' && look.buttons === 'solid')) s += 1;
    if (look.glass && f.id === 'glass') s -= 2;
    if (look.glass === false && f.id === 'glass') s += 1;
    return { id: f.id, name: f.name, radius: f.radius, button: f.button, shadow, score: +s.toFixed(2) };
  });
  return fams.sort((a, b) => a.score - b.score).slice(0, 2);
}

// What a section is for, from its heading, its class names, and what it holds.
const SECTION_RULES = [
  ['pricing', (s) => s.prices >= 2 || /pric|plan|tier/.test(s.cls + s.heading.toLowerCase())],
  ['faq', (s) => s.details >= 3 || /faq|question/.test(s.cls + s.heading.toLowerCase())],
  ['testimonials', (s) => s.quotes >= 1 || /testimonial|review|what (?:people|customers)|loved by/.test(s.cls + s.heading.toLowerCase())],
  ['logos', (s) => s.logos >= 3 || /logos|clients|trusted by|customers/.test(s.cls)],
  ['newsletter', (s) => s.forms && /newsletter|subscribe|inbox/.test(s.cls + s.heading.toLowerCase())],
  ['contact', (s) => s.forms && /contact|get in touch|book|visit/.test(s.cls + s.heading.toLowerCase())],
  ['stats', (s) => /stat|numbers|by the numbers|metrics/.test(s.cls + s.heading.toLowerCase())],
  ['team', (s) => /team|people|about us|founders/.test(s.cls + s.heading.toLowerCase())],
  ['gallery', (s) => s.images >= 6],
  ['blog', (s) => /blog|journal|news|articles|stories/.test(s.cls + s.heading.toLowerCase())],
  ['cta', (s) => /cta|get started|start|try|ready/.test(s.cls + s.heading.toLowerCase()) && s.height < 600],
  ['footer', (s) => s.tag === 'footer' || /footer/.test(s.cls)],
  ['features', (s) => s.cards >= 3],
];

export function sectionKinds(sections) {
  const out = [];
  for (const s of sections) {
    const kind = SECTION_RULES.find(([, test]) => test(s))?.[0] || null;
    if (kind && !out.some((o) => o.kind === kind)) out.push({ kind, heading: s.heading });
  }
  return out;
}

/** The hero's shape, in the skill's words (website.md › Hero shape and the frame). */
export function heroShape(m, roles) {
  const fs = m.firstScreen;
  if (m.heroBg && roles.accent && dist(m.heroBg, roles.accent) < 0.08) return 'band';
  if (fs.media > 0.55) return 'object';
  if (fs.media > 0.15 && fs.mediaLeft != null && fs.h1Left != null && Math.abs(fs.mediaLeft - fs.h1Left) > 200) return 'split';
  if ((fs.headline || 0) >= 72) return 'type';
  return fs.media > 0.15 ? 'split' : 'type';
}

/** Pieces for each part the reference has, from search, so the agent opens real briefs. */
// Styles that clash with a family's feel. A quiet kit should not be handed a brutalist pricing table.
const CLASHES = {
  quiet: ['brutalist', 'pixel', 'y2k', 'cyber', 'retro', 'playful', 'riso', 'clay'],
  soft: ['brutalist', 'pixel', 'cyber', 'terminal', 'industrial'],
  editorial: ['brutalist', 'pixel', 'y2k', 'cyber', 'playful', 'clay', 'glass'],
  sharp: ['clay', 'soft', 'playful', 'glass'],
  industrial: ['clay', 'soft', 'playful', 'luxe'],
  glass: ['brutalist', 'pixel', 'paper', 'riso'],
  bold: ['luxe', 'glass', 'minimal'],
  tactile: ['brutalist', 'terminal', 'cyber'],
  lit: ['paper', 'riso', 'clay', 'brutalist'],
};

export function matchPieces(lib, parts) {
  const clash = new Set(CLASHES[parts.family] || []);
  const pick = (category, query, n = 2) => {
    // A heading search can return one piece; the whole category keeps a choice that fits the family.
    const byQuery = lib.searchPieces({ category, query, limit: 12 }).pieces;
    const found = [...byQuery, ...lib.searchPieces({ category, limit: 24 }).pieces.filter((p) => !byQuery.some((q) => q.id === p.id))];
    // A web reference gets web pieces first, then pieces whose style fits the family.
    const web = found.filter((p) => p.platform === 'web');
    const pool = web.length >= n ? web : found;
    const fits = pool.filter((p) => !(p.styles || []).some((st) => clash.has(st)));
    return (fits.length ? fits : pool).slice(0, n).map((p) => ({ id: p.id, title: p.title, demo: p.demo }));
  };
  const out = {};
  if (parts.nav) out.nav = pick('navbar', parts.nav.sticky ? 'sticky shrink floating' : 'split centered', 2);
  out.hero = pick('hero', { split: 'split ui stack product', object: 'product window browser scene', type: 'type lockup wordmark asymmetric', band: 'band colour bold' }[parts.shape] || '', 3);
  for (const s of parts.sections) {
    if (s.kind === 'footer') continue;
    const p = pick(s.kind, s.heading, 2);
    if (p.length) out[s.kind] = p;
  }
  out.footer = pick('footer', '', 2);
  if (parts.motion?.libs?.length || parts.motion?.animated > 40) out.motion = pick('scroll', parts.motion.libs.join(' ') || 'reveal', 2);
  return out;
}

/* ---------- the whole match ---------- */

export function matchReference(lib, { roles, type, look, sections, shape, motion, nav }) {
  const themes = matchThemes(lib, roles);
  const families = matchFamily(lib, look);
  return {
    roles,
    themes,
    wada: themes[0].score > 0.09 ? matchWada(lib, roles) : [],
    pairings: type.display || type.text ? matchPairings(lib, type) : [],
    families,
    shape,
    pieces: matchPieces(lib, { nav, shape, sections, motion, family: families[0]?.id }),
  };
}

/** From a measured URL to the inputs matchReference wants. */
export function readMeasure(m) {
  const roles = rolesFromMeasure(m);
  const face = (list, weight) => (list[0] ? { ...classifyFace(list[0][0]), family: list[0][0], weight } : null);
  const type = { display: face(m.faces.display, m.weights?.display), text: face(m.faces.text, m.weights?.text) };
  const control = m.radii.control, card = m.radii.card;
  const s = m.surfaces;
  const look = {
    mode: roles.mode,
    radius: control ?? card ?? 0,
    cardRadius: card,
    shadow: s.boxed === 0 ? null : s.hardShadows >= Math.max(2, s.shadows / 2) ? 'hard' : s.shadows / s.boxed > 0.3 ? 'soft' : 'none',
    buttons: s.heroFilled ? 'solid' : s.filledButtons + s.outlineButtons === 0 ? null : s.filledButtons >= s.outlineButtons ? 'solid' : 'outline',
    glass: s.blur >= 2,
  };
  return { roles, type, look, sections: sectionKinds(m.sections), shape: heroShape(m, roles), motion: m.motion, nav: m.nav };
}

/** From a screenshot plus what the agent saw, to the same inputs. */
export async function readScreenshot(buffer, mimeType, hints = {}) {
  // At the default 240px, body text blurs into the ground; twice that keeps the ink readable.
  const pal = await samplePalette(buffer, mimeType, { size: 480 });
  if (!pal) return null;
  const type = hints.type ? parseTypeDescription(hints.type) : { display: null, text: null };
  // A face the agent names ("like Caslon") is the strongest signal, so keep the words as the family to compare.
  if (hints.type) for (const k of ['display', 'text']) if (type[k] && !type[k].family) type[k].family = hints.type;
  const radius = { sharp: 0, small: 4, medium: 10, large: 18, pill: 999 }[hints.corners] ?? null;
  const look = { radius: radius ?? 6, shadow: hints.shadows || null, buttons: hints.buttons || null, glass: hints.glass ?? null };
  const sections = (hints.sections || []).map((k) => ({ kind: String(k).toLowerCase(), heading: '' }));
  return { palette: pal, roles: { ...pal.roles, accent: pal.roles.accent }, type, look, sections, shape: hints.shape || null, motion: null, nav: hints.sticky_nav ? { sticky: true } : null };
}

/* ---------- the report ---------- */

export function formatMatch(lib, { source, m, match, input }) {
  const L = (kind, id) => lib.link(kind, id);
  const out = [`# Reference: ${source}`, ''];
  out.push('Match the design language, not the site. Use the Lounge kit below with their own name, words, and pictures. Never copy the reference\'s logo, name, wordmark, photos, or copy. Write it in DESIGN.md Sources as `Reference: <url> (feel only)`.', '');
  const r = match.roles;
  out.push('## What it measured');
  out.push(`- Colour (${r.mode}): ground ${r.bg}${r.surface ? `, surface ${r.surface}` : ''}, ink ${r.ink}${r.ink2 ? `, ink-2 ${r.ink2}` : ''}, accent ${r.accent || 'none found'}`);
  const face = (f) => (f ? `${f.family && f.family.length < 40 ? `${f.family} ` : ''}(${f.kind}, ${f.style}${f.width ? `, ${f.width}` : ''})` : 'unknown');
  if (input.type.display || input.type.text) out.push(`- Type: display ${face(input.type.display)} · text ${face(input.type.text)}${m?.sizes ? ` · headline ${Math.round(m.sizes.h1 || m.sizes.display || 0)}px, body ${Math.round(m.sizes.text || 0)}px` : ''}`);
  out.push(`- Corners and depth: controls ${input.look.radius >= 999 ? 'pill' : `${Math.round(input.look.radius)}px`}${input.look.cardRadius != null ? `, cards ${Math.round(input.look.cardRadius)}px` : ''}, shadows ${input.look.shadow || 'unknown'}, buttons ${input.look.buttons || 'unknown'}${input.look.glass ? ', frosted glass' : ''}`);
  if (m) out.push(`- Layout: column about ${m.column || '?'}px, section padding about ${Math.round(m.sectionPadding || 0)}px, nav ${m.nav ? (m.nav.sticky ? 'sticky' : 'static') : 'none found'}, hero shape ${match.shape}`);
  else if (match.shape) out.push(`- Hero shape: ${match.shape}`);
  if (input.sections.length) out.push(`- Sections: ${input.sections.map((s) => s.kind).join(', ')}`);
  if (m?.motion) out.push(`- Motion: ${m.motion.animated} animated elements${m.motion.libs.length ? `, ${m.motion.libs.join(', ')}` : ''}`);
  out.push('', '## The closest Lounge kit');
  const t = match.themes[0];
  out.push(`- Theme: **${t.name}** (${t.id}, ${t.mode}) ${L('theme', t.id)}. Distance ${t.score}: ground ${t.parts.bg}, accent ${t.parts.accent}, ink ${t.parts.ink}. Then ${match.themes.slice(1).map((x) => `${x.name} (${x.score})`).join(', ')}.`);
  if (t.score > 0.09) out.push(`  No theme is close (above 0.09). For a product, lock ${t.name} and say the reference's colour is not in the library. If the reference is their own brand, keep the theme's surfaces and set --primary to ${r.accent} (SKILL.md › Rules). For Free colour, the nearest Wada lines are: ${match.wada.map((w) => w.row.split(' | ').slice(0, 2).join(' ')).join(' · ') || 'none'}.`);
  if (match.pairings.length) { const p = match.pairings[0]; out.push(`- Pairing: **${p.name}** (${p.display} over ${p.text}) ${L('pairing', p.id)}. Then ${match.pairings.slice(1).map((x) => `${x.name} (${x.display} / ${x.text})`).join(', ')}.`); }
  else out.push('- Pairing: no type was given. Describe the faces you see (`type`) to match one.');
  const f = match.families[0];
  out.push(`- Family: **${f.name}** (${f.radius}, ${f.button} buttons, ${f.shadow} shadow)${match.families[1] ? `. Then ${match.families[1].name}` : ''}.`);
  if (match.shape) out.push(`- Hero shape: ${match.shape} (website.md › Hero shape and the frame).`);
  out.push('', '## Pieces to open (get_piece)');
  for (const [part, list] of Object.entries(match.pieces)) if (list.length) out.push(`- ${part}: ${list.map((p) => `${p.id}`).join(', ')}`);
  out.push('', '## Next');
  out.push('1. start_design with their words and "in the feel of <reference>", then lock the kit above. Swap in what they named (rule 1 of Pick a direction).');
  out.push('2. get_theme, get_pairing, get_family, then get_piece for each part. Build their page with their facts.');
  out.push('3. review_page on the result. It fails anything the reference brought in that the Lounge counts as a giveaway, such as gradient text or the indigo palette.');
  return out.join('\n');
}
