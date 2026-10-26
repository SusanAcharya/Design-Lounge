// The tells of a page that was generated and not designed: the Look fails in practice.md and the default looks in
// website.md, checked on the HTML and CSS. Each finding names the evidence and the fix. Judgment calls stay "warn".
import fs from 'node:fs';
import path from 'node:path';
import { visibleText } from './source.mjs';
import { hexToRgb, rgbDistance } from './library.mjs';

const GENERIC_FONTS = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-sans-serif', 'ui-serif', 'ui-monospace', 'ui-rounded', 'inherit', 'initial', 'unset', 'revert', 'emoji', 'math', '-apple-system', 'blinkmacsystemfont', 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol', 'noto color emoji']);
// Fallbacks a pairing file lists after its faces. They are not a fourth family.
const FALLBACK_FONTS = new Set(['georgia', 'times new roman', 'times', 'helvetica neue', 'helvetica', 'arial', 'segoe ui', 'roboto', 'menlo', 'monaco', 'consolas', 'courier new', 'courier', 'sf mono', 'sfmono-regular', 'liberation mono', 'ubuntu', 'cantarell', 'noto sans', 'oxygen', 'open sans', 'liberation sans', 'dejavu sans']);
const DEFAULT_FACES = ['inter', 'roboto', 'arial', 'helvetica', 'open sans', 'poppins', 'montserrat', 'lato', 'system-ui', '-apple-system'];

const BUZZ = [
  'elevate', 'elevates', 'seamless', 'seamlessly', 'unleash', 'supercharge', 'next-gen', 'next-generation', 'unlock', 'unlocks',
  'revolutionize', 'revolutionise', 'revolutionary', 'cutting-edge', 'game-changer', 'game-changing', 'empower', 'empowers', 'empowering',
  'leverage', 'synergy', 'world-class', 'best-in-class', 'state-of-the-art', 'effortless', 'effortlessly', 'streamline', 'streamlined',
  'robust', 'innovative', 'transformative', 'reimagine', 'reimagined', 'delve', 'tapestry', 'holistic', 'bespoke solutions', 'unparalleled',
  'supercharged', 'turbocharge', 'skyrocket', 'harness', 'paradigm', 'frictionless', 'boundless', 'limitless',
];
const PHRASES = [
  [/\bnot just (?:a |an |the )?[\w' -]{2,40}[,;.—–-]\s*(?:it'?s|but)\b/i, '"Not just X, it\'s Y"'],
  [/\bwhether you'?re (?:a |an )?[\w -]{2,40} or\b/i, '"Whether you\'re X or Y"'],
  [/\bin today'?s (?:fast[- ]paced|digital|modern|ever[- ]changing)\b/i, '"In today\'s fast-paced..."'],
  [/\b(?:say goodbye to|look no further|imagine a world|take (?:your|it) [\w ]{1,20} to the next level|discover the power of|transform the way you|at the intersection of|crafted with (?:care|love|passion)|designed with you in mind|we'?re on a mission to|built for the modern|the future of [\w ]{2,20} is here|your all[- ]in[- ]one|all[- ]in[- ]one platform|join thousands of)\b/i, 'stock marketing phrase'],
  [/\b(?:welcome to (?:the|our)|the future of|next[- ]generation)\b/i, 'headline that could sit on any company'],
];
const PLACEHOLDER = [
  [/\blorem ipsum\b|\bdolor sit amet\b/i, 'lorem ipsum'],
  [/\byour (?:text|headline|title|company|name|tagline|logo) here\b/i, '"your text here"'],
  [/\b(?:john|jane) (?:doe|smith)\b/i, 'John Doe'],
  [/\bacme(?: corp| inc)?\b/i, 'Acme'],
  [/\bcompany name\b|\bbrand name\b/i, '"Company name"'],
  [/\bfeature (?:one|two|three|1|2|3)\b/i, '"Feature one"'],
  [/\b123 main st(?:reet)?\b|\(555\)\s?\d{3}|\b555-\d{4}\b/i, 'fake address or phone'],
  [/[\w.]+@example\.(?:com|org)\b/i, 'example.com email'],
];
const MADE_UP_BRANDS = /\b(?:Nexus|SmartFlow|Cloudly|Lumina|Vertex|Zenith|Globex|Initech|Hooli|Nimbus|Quantum(?:ly)?|Synergix|Apex(?:Corp)?|Stellar(?:ly)?|Innovatech|TechCorp|DataFlow|FlowSync)\b/g;
const GENERIC_CTA = /^(?:get started|get started now|get started free|submit|click here|learn more|read more|discover more|explore|explore more|find out more|see more|start now|sign up now|try it now|book a demo today)$/i;
const POETIC = /^(?:field notes|from the bench|quietly trusted by|trusted by the best|loved by teams|the details|the craft|our story|in good company|selected work|notes from the studio)$/i;
const AI_PURPLE = ['#6366f1', '#4f46e5', '#4338ca', '#818cf8', '#8b5cf6', '#7c3aed', '#6d28d9', '#a78bfa', '#a855f7', '#9333ea', '#7e22ce', '#c084fc', '#d946ef', '#c026d3', '#ec4899'];
const TW_COLORS = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const EMOJI = /\p{Extended_Pictographic}/u;
const NOT_EMOJI = /[©®™←-⇿•‣▪-◿✓✔✕✖✗✘★☆]/gu;

/** The words around a match, cut at word boundaries. */
const around = (text, at, len = 0) => {
  const start = Math.max(0, text.lastIndexOf(' ', Math.max(0, at - 45)) + 1);
  let end = text.indexOf(' ', Math.min(text.length, at + len + 45));
  if (end < 0) end = text.length;
  return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
};
const clip = (s, n = 110) => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const uniq = (a) => [...new Set(a)];
const textOf = (el) => (el.structuredText || el.text || '').replace(/\s+/g, ' ').trim();
const hasEmoji = (s) => EMOJI.test(String(s).replace(NOT_EMOJI, ''));

/* ---------- CSS ---------- */

/** Innermost rules of a stylesheet, with selectors. @keyframes steps are kept apart. */
export function cssRules(styles) {
  const rules = [];
  for (const { source, text } of styles) {
    const clean = text.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = m[1].trim();
      const body = m[2];
      const decls = [];
      for (const d of body.split(';')) {
        const i = d.indexOf(':');
        if (i < 0) continue;
        decls.push([d.slice(0, i).trim().toLowerCase(), d.slice(i + 1).trim()]);
      }
      rules.push({ source, selector, decls, keyframe: /^(?:from|to|\d+(?:\.\d+)?%)(?:\s*,\s*(?:from|to|\d+(?:\.\d+)?%))*$/.test(selector) });
    }
  }
  return rules;
}

export function fontFamilies(value) {
  return value.split(',').map((f) => f.trim().replace(/^["']|["']$/g, '').trim()).filter(Boolean);
}

/** Families the page asks for: declarations, custom properties holding a font stack, and font links. */
export function declaredFonts(rules, fontLinks = []) {
  const first = new Map(); // first-choice family -> selectors using it
  const all = new Set();
  const vars = new Map();
  for (const r of rules) for (const [p, v] of r.decls) if (p.startsWith('--') && /font|family|face|serif|sans|mono/i.test(p) && !/size|weight|feature|variation|optical/i.test(p)) vars.set(p, v);
  const resolve = (v) => v.replace(/var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/g, (_, name, fb) => vars.get(name) ?? fb ?? '');
  for (const r of rules) {
    for (const [p, v] of r.decls) {
      let stack = null;
      if (p === 'font-family') stack = resolve(v);
      else if (p === 'font') { const m = resolve(v).match(/(?:\d[\w.%/]*\s+)((?:["'][^"']+["']|[\w -]+)(?:\s*,\s*(?:["'][^"']+["']|[\w -]+))*)\s*(?:!important)?$/); if (m) stack = m[1]; }
      else if (p.startsWith('--') && vars.has(p)) stack = resolve(v);
      if (!stack) continue;
      const fams = fontFamilies(stack);
      fams.forEach((f) => all.add(f));
      const lead = fams.find((f) => !GENERIC_FONTS.has(f.toLowerCase()));
      if (lead && !p.startsWith('--')) { if (!first.has(lead)) first.set(lead, []); first.get(lead).push(r.selector); }
    }
  }
  const linked = [];
  for (const href of fontLinks) {
    let url;
    try { url = new URL(href, 'https://x'); } catch { continue; }
    for (const fam of url.searchParams.getAll('family')) for (const part of fam.split('|')) linked.push(part.split(':')[0].replace(/\+/g, ' ').trim());
  }
  return { first, all: [...all], linked: uniq(linked) };
}

/* ---------- the kit the page was built to ---------- */

/** Find DESIGN.md beside the page or above it, and read the locked theme, pairing, family, mode, and named aesthetic. */
export function kitFromDesignMd(dir, lib) {
  if (!dir) return null;
  let d = dir;
  for (let i = 0; i < 5; i++) {
    const f = path.join(d, 'DESIGN.md');
    if (fs.existsSync(f)) return { file: f, ...parseDesignMd(fs.readFileSync(f, 'utf8'), lib) };
    const up = path.dirname(d);
    if (up === d) break;
    d = up;
  }
  return null;
}

export function parseDesignMd(text, lib) {
  const line = (label) => text.match(new RegExp(`^[-*\\s]*\\**${label}\\**\\s*:\\s*\\**\\s*(.+)$`, 'im'))?.[1]?.replace(/^\*+\s*/, '').trim() || '';
  const pick = (kind, raw) => {
    if (!raw) return null;
    const link = raw.match(/\/(?:themes|type)\/([a-z0-9-]+)/);
    if (link) return link[1];
    const word = raw.replace(/[`*_[\]]/g, '').split(/[,(·—–]| - /)[0].trim();
    return lib.resolveId(kind, word) || lib.resolveId(kind, raw.match(/`([a-z0-9-]+)`/)?.[1]);
  };
  const mode = line('Mode');
  return {
    theme: pick('theme', line('Theme')),
    pairing: pick('pairing', line('Pairing')),
    family: pick('family', line('Family')),
    free: /\bfree\b/i.test(mode) || /^free\b/i.test(line('Theme')),
    named: line('Named aesthetic') && !/^none/i.test(line('Named aesthetic')) ? line('Named aesthetic') : '',
  };
}

export function resolveKit(lib, page, kit = {}) {
  const fromFile = page.kind === 'file' ? kitFromDesignMd(page.dir, lib) : null;
  const k = {
    theme: lib.resolveId('theme', kit.theme) || fromFile?.theme || null,
    pairing: lib.resolveId('pairing', kit.pairing) || fromFile?.pairing || null,
    family: lib.resolveId('family', kit.family) || fromFile?.family || null,
    free: kit.free ?? fromFile?.free ?? false,
    named: kit.named || fromFile?.named || '',
    designMd: fromFile?.file || null,
  };
  k.themeData = k.theme ? lib.theme(k.theme) : null;
  k.pairTheme = k.themeData?.pair ? lib.theme(k.themeData.pair) : null;
  k.pairingData = k.pairing ? lib.pairing(k.pairing) : null;
  k.familyData = k.family ? lib.family(k.family) : null;
  k.locked = Boolean(k.theme || k.pairing || k.family);
  return k;
}

/**
 * Is this gradient a look (a wash of colour), or a technique? Techniques are left alone: a line drawn with one colour
 * twice, a small repeating tile (dots, grid, grain), and a scrim of black or white over a photo for legible text.
 */
function isLook(value, rule) {
  const stops = [...value.matchAll(/(#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|color-mix\([^)]*\)|var\(--[\w-]+\)|currentcolor|transparent|\b(?:white|black)\b)/gi)].map((m) => m[1].toLowerCase().replace(/\s+/g, ''));
  const colours = [...new Set(stops.filter((c) => c !== 'transparent'))];
  if (colours.length <= 1) return false; // one colour, or one colour fading out: a line, a dot, a fade
  if (colours.every((c) => /^(?:#000(?:0{3})?|#fff(?:f{3})?|black|white|rgba?\((?:0,0,0|255,255,255)(?:,[\d.]+)?\))$/.test(c))) return false; // a scrim
  const size = rule.decls.find(([p]) => p === 'background-size')?.[1] || value.match(/\/\s*([\d.]+px)\s+([\d.]+px)/)?.[0] || '';
  if ((size.match(/[\d.]+px/g) || []).every((n) => parseFloat(n) <= 48) && /\d/.test(size)) return false; // a tile
  return true;
}

/* ---------- the audit ---------- */

export function auditSlop(page, kit, lib) {
  const F = [];
  const add = (level, area, id, title, evidence, fix, ref) => F.push({ level, area, id, title, evidence: uniq(evidence.filter(Boolean)).slice(0, 4).map((e) => clip(e)), fix, ref });
  const root = page.root;
  const body = root.querySelector('body') || root;
  const text = visibleText(root);
  const rules = cssRules(page.styles);
  const named = (kit.named || '').toLowerCase();
  const lifted = (words) => words.some((w) => named.includes(w));
  const classes = root.querySelectorAll('[class]').map((el) => el.getAttribute('class')).join(' ');

  const headings = root.querySelectorAll('h1, h2, h3').map((h) => ({ tag: h.tagName.toLowerCase(), text: textOf(h) })).filter((h) => h.text);
  const h1s = headings.filter((h) => h.tag === 'h1');
  const actions = root.querySelectorAll('button, a, [role="button"], input[type="submit"]').map((el) => ({ el, text: textOf(el) || el.getAttribute('value') || '' }));
  const shortEls = body.querySelectorAll('p, span, small, div, li, a, h1, h2, h3, h4, h5, h6, label, strong, em, figcaption, button')
    .filter((el) => !el.querySelector('p, div, li, h1, h2, h3, section, article'))
    .map((el) => ({ el, text: textOf(el) })).filter((x) => x.text && x.text.length <= 60);

  /* ----- copy ----- */
  const dashes = [...text.matchAll(/[—–]/g)].map((m) => around(text, m.index, 1));
  if (dashes.length) add('fail', 'copy', 'dash', `Em or en dash in text people read (${dashes.length})`, dashes, 'Use a full stop, a comma, a colon, or brackets. Ranges use a hyphen: 2018-2026.', 'SKILL.md › Rules');

  const buzz = [];
  for (const w of BUZZ) {
    const re = new RegExp(`\\b${w.replace(/-/g, '[- ]')}\\b`, 'gi');
    for (const m of text.matchAll(re)) buzz.push({ w, at: m.index });
  }
  if (buzz.length) {
    const inHead = headings.filter((h) => BUZZ.some((w) => new RegExp(`\\b${w.replace(/-/g, '[- ]')}\\b`, 'i').test(h.text)));
    add(inHead.some((h) => h.tag !== 'h3') || buzz.length >= 3 ? 'fail' : 'warn', 'copy', 'buzzwords', `Words that mean nothing: ${uniq(buzz.map((b) => b.w.toLowerCase())).slice(0, 8).join(', ')}`,
      inHead.map((h) => `${h.tag}: ${h.text}`).concat(buzz.slice(0, 3).map((b) => around(text, b.at, b.w.length))),
      'Say what this product does with its own noun and a fact they gave you.', 'practice.md › Look');
  }
  const phrases = [];
  for (const [re, label] of PHRASES) {
    const hit = headings.find((h) => re.test(h.text)) || (re.test(text) ? { text: text.match(re)[0] } : null);
    if (hit) phrases.push(`${label}: ${hit.text}`);
  }
  if (phrases.length) add('fail', 'copy', 'stock-phrases', 'Stock AI copy patterns', phrases, 'Rewrite with a fact only this product has. If the sentence is still true with a competitor\'s name in it, it goes.', 'practice.md › Look');

  const triad = headings.filter((h) => /^(?:[A-Z][\w']+\.\s+){2,}[A-Z][\w']+\.?$/.test(h.text) || /^[\w']+,\s[\w']+,?\sand\s[\w']+\.?$/i.test(h.text));
  if (triad.length) add('warn', 'copy', 'triad', 'Three-beat headline ("Fast. Simple. Secure.")', triad.map((h) => h.text), 'Name the one thing it does, with its noun.', 'practice.md › Look');

  const ph = [];
  for (const [re, label] of PLACEHOLDER) { const m = text.match(re); if (m) ph.push(`${label}: "${m[0]}"`); }
  const tbc = (text.match(/\b(?:TBC|TBD|coming soon|to be confirmed)\b/gi) || []).length;
  if (tbc >= 6) ph.push(`"TBC" or "coming soon" ${tbc} times`);
  else if (tbc >= 3) add('warn', 'copy', 'markers', `"TBC" or "coming soon" ${tbc} times`, [], 'A marker sits on the one fact it qualifies. If a section is mostly markers, merge it or replace it with one line saying what is still to come.', 'website.md › Real content only');
  if (ph.length) add('fail', 'copy', 'placeholder', 'Placeholder copy', ph, 'Use their facts. Missing facts get one line ("The full menu comes from the café."), never rows of placeholders.', 'website.md › Real content only');

  const brands = uniq(text.match(MADE_UP_BRANDS) || []);
  if (brands.length) add('warn', 'copy', 'made-up-brands', `Names that sound made up: ${brands.join(', ')}`, brands, 'If these are not real clients they told you about, remove the logo row. Never invent clients.', 'website.md › Real content only');

  const roundNums = uniq(text.match(/\b(?:99\.9+%|100%|10x|100x|\d{1,3},000\+|\d+[kKmM]\+|\$1,000,000|5\.0 ?★|24\/7|#1)(?=\s|$|[.,)])/g) || []);
  if (roundNums.length) add('warn', 'copy', 'round-numbers', `Numbers that look made up: ${roundNums.join(', ')}`, roundNums, 'Keep a number only if they gave it. Real numbers are uneven: 47.2%, 1,284.', 'practice.md › Look');

  const cta = actions.filter((a) => GENERIC_CTA.test(a.text.trim()));
  if (cta.length) add('warn', 'copy', 'generic-cta', `Button labels with no verb of their own (${cta.length})`, cta.map((a) => a.text), 'Name the action on this screen: "Open the week", "Add to bag", "Book a table".', 'practice.md › Look');

  const steps = shortEls.filter((x) => /^step\s+(?:\d|one|two|three)\b/i.test(x.text));
  if (steps.length >= 2) add('warn', 'copy', 'step-labels', '"Step 1, Step 2, Step 3" as labels', steps.map((s) => s.text), 'The step\'s own verb is the label: Install, Connect, Ship.', 'practice.md › Look');

  const poetic = shortEls.filter((x) => POETIC.test(x.text));
  if (poetic.length) add('warn', 'copy', 'poetic-labels', 'Poetic labels where a plain one works', poetic.map((p) => p.text), 'Use the plain label: Work, Clients, Contact.', 'practice.md › Look');

  /* ----- page furniture ----- */
  const eyebrows = shortEls.filter((x) => /^0\d{1,2}\s*(?:[/·.—–-]\s*\S|$)/.test(x.text) || /^\d{2}\s*\/\s*\d{2}$/.test(x.text) || /^(?:section|chapter|part|question)\s+0?\d+\b/i.test(x.text));
  if (eyebrows.length >= 2) add('warn', 'slop', 'numbered-eyebrows', `Numbered eyebrows (${eyebrows.length})`, eyebrows.map((e) => e.text), 'Drop the numbers. The heading already says what the section is.', 'practice.md › Look');

  const dots = shortEls.filter((x) => (x.text.match(/\s[·•|/]\s/g) || []).length >= 3);
  if (dots.length) add('warn', 'slop', 'dot-strip', 'A strip of words with a dot between each', dots.map((d) => d.text), 'One separator per line at most. Say it as a sentence, or cut it.', 'practice.md › Look');

  const scrollCue = shortEls.filter((x) => /^(?:scroll|scroll down|scroll to (?:explore|discover|begin)|↓\s*scroll)$/i.test(x.text));
  if (scrollCue.length || /\b(?:scroll-(?:cue|indicator|hint|down)|mouse-(?:icon|wheel|scroll))\b/.test(classes)) add('warn', 'slop', 'scroll-cue', 'A "Scroll" cue or animated mouse', scrollCue.map((s) => s.text).concat(['class: scroll cue']), 'Remove it. A first screen that needs a cue is not holding them.', 'practice.md › Look');

  const firstBlock = body.querySelector('header, [class*="hero"], section, main') || body;
  const version = firstBlock.querySelectorAll('span, small, div, p, a').map(textOf).filter((t) => /^(?:beta|v\d+(?:\.\d+)+|new|alpha|preview)$/i.test(t) || /^(?:new|beta)\s*[:·-]/i.test(t));
  if (version.length) add('warn', 'slop', 'version-label', 'A version or BETA label in the first screen', version, 'Drop it unless this is a launch.', 'practice.md › Look');

  const emojiEls = shortEls.filter((x) => hasEmoji(x.text) && (x.text.replace(NOT_EMOJI, '').match(/\p{Extended_Pictographic}/gu) || []).length >= 1 && (x.text.length <= 4 || /^\p{Extended_Pictographic}/u.test(x.text.replace(NOT_EMOJI, ''))));
  if (emojiEls.length) add('fail', 'slop', 'emoji-icons', `Emoji used as icons (${emojiEls.length})`, emojiEls.map((e) => e.text), 'Use Lounge Icons (get_icons). Stickers only under a scrapbook Named aesthetic, never as the icon.', 'components.md › Icon and nav');

  /* ----- three identical cards ----- */
  const trios = [];
  for (const el of body.querySelectorAll('div, section, ul, ol')) {
    const kids = el.childNodes.filter((c) => c.nodeType === 1);
    if (kids.length !== 3 && kids.length !== 4) continue;
    const sig = (c) => `${c.tagName}.${(c.getAttribute('class') || '').split(/\s+/)[0]}`;
    if (new Set(kids.map(sig)).size !== 1) continue;
    const cardish = kids.every((c) => {
      const t = textOf(c);
      // A photo, a price, or a link makes it content (a dish, a product, a post), not an icon standing in for one.
      const icon = c.querySelector('svg, i, [class*="icon"]') || hasEmoji(t.slice(0, 3));
      const content = c.querySelector('img:not([src$=".svg"]), picture, video, a[href*="/"], button, input, table') || /[$£€₹¥]\s?\d|\d+(?:\.\d\d)\b/.test(t);
      return icon && !content && c.querySelector('h3, h4, h5, strong, [class*="title"]') && c.querySelector('p') && t.length < 260;
    });
    if (cardish) trios.push(kids.map((c) => (c.querySelector('h3, h4, h5, strong, [class*="title"]') || c).text.trim()).join(' / '));
  }
  if (trios.length) add('fail', 'slop', 'icon-card-trio', 'Identical cards (icon, title, one sentence) standing in for the product', trios, 'Show the product instead: a working screen, a real list, one large thing. A feature row is fine only when a named piece is that row and the copy is about this product.', 'practice.md › Look · website.md › The default looks');

  /* ----- CSS ----- */
  const sel = (r) => clip(`${r.selector}`, 60);
  const gradients = rules.filter((r) => !r.keyframe && r.decls.some(([p, v]) => /^(?:background(?:-image)?|border-image)$/.test(p) && /gradient\(/.test(v) && isLook(v, r)));
  const gradText = rules.filter((r) => r.decls.some(([p, v]) => /background-clip|-webkit-background-clip/.test(p) && /text/.test(v)) && r.decls.some(([, v]) => /gradient\(/.test(v)));
  if (gradText.length && !lifted(['y2k', 'vapor', 'maximal', 'synth', 'outrun', 'chrome'])) add('fail', 'slop', 'gradient-text', 'Gradient text', gradText.map(sel), 'Solid --ink, or --primary for one word. Only Show mode\'s one word that changes voice, or a Named aesthetic that lists it, may use gradient text.', 'practice.md › Look');
  const grads = gradients.filter((r) => !gradText.includes(r));
  // A gradient on a whole region is the generated look. A small one on a control or a mockup's chrome is a judgment call.
  const regionGrads = grads.filter((r) => /(?:^|[\s,>])(?:html|body|main|section|header|footer)(?:$|[\s,.:#[>])|hero|banner|section|band|backdrop|page|wrapper|\bbg\b/i.test(r.selector));
  if (grads.length) {
    const tw = (classes.match(/\b(?:bg-gradient-to-[a-z]+|from-[a-z]+-\d{2,3}|via-[a-z]+-\d{2,3})\b/g) || []).length;
    add((regionGrads.length || tw > 2) && !lifted(['y2k', 'vapor', 'maximal', 'aurora', 'glass', 'synth']) ? 'fail' : 'warn', 'slop', 'gradients', `Gradients, glows, or mesh (${grads.length} rule${grads.length > 1 ? 's' : ''}${tw ? `, ${tw} Tailwind gradient classes` : ''})`, regionGrads.concat(grads).map(sel),
      'Every region stays the theme\'s flat --bg. Only the locked effect piece, a Show mode centrepiece, or a Named aesthetic that lists it may use one.', 'practice.md › Look');
  }
  const purple = rules.flatMap((r) => r.decls.filter(([, v]) => AI_PURPLE.some((h) => v.toLowerCase().includes(h))).map(([p, v]) => `${sel(r)} { ${p}: ${clip(v, 50)} }`));
  const twPurple = classes.match(/\b(?:from|via|to|bg|text)-(?:indigo|violet|purple|fuchsia)-[4-7]00\b/g) || [];
  if (purple.length + twPurple.length) add('fail', 'slop', 'ai-purple', 'The indigo-to-violet palette every generated page uses', purple.concat(uniq(twPurple)), 'Lock a Lounge theme by the subject\'s world (get_theme) and use its --primary.', 'SKILL.md › Library flow');

  const glass = rules.filter((r) => r.decls.some(([p, v]) => /backdrop-filter/.test(p) && /blur/.test(v)));
  if (glass.length >= 3 && !lifted(['glass', 'frost'])) add('warn', 'slop', 'glass-everywhere', `Blur or glass on ${glass.length} rules`, glass.map(sel), 'Glass belongs to the glass family or a glass Named aesthetic. Elsewhere, solid surfaces from the theme.', 'practice.md › Look · taste.md › Glass');

  const glow = rules.filter((r) => r.decls.some(([p, v]) => (p === 'box-shadow' || p === 'text-shadow' || p === 'filter') && /(?:^|,|\s)0(?:px)?\s+0(?:px)?\s+(?:[2-9]\d|\d{3})px/.test(v) && !/rgba?\(0,\s*0,\s*0/.test(v)));
  if (glow.length && !lifted(['neon', 'synth', 'cyber', 'outrun', 'vapor', 'glow'])) add('warn', 'slop', 'glow', `Coloured glow (${glow.length})`, glow.map(sel), 'Remove the glow. The accent is the action and the live state, not decoration.', 'practice.md › Look');

  const black = rules.filter((r) => r.decls.some(([p, v]) => /^(?:color|background(?:-color)?|--[\w-]*(?:bg|ink|text|background))$/.test(p) && /(?:^|\s)(?:#000(?:000)?|black|rgb\(\s*0,\s*0,\s*0\s*\))(?:\s|$|;|!)/i.test(v)));
  if (black.length) add('warn', 'slop', 'pure-black', 'Pure #000', black.map(sel), 'Use the theme\'s --ink or --bg. Pure black reads as unstyled.', 'practice.md › Look');

  const easing = rules.flatMap((r) => r.decls.filter(([p, v]) => /^(?:transition(?:-timing-function)?|animation(?:-timing-function)?)$/.test(p) && /(?:^|[\s,])(?:ease|ease-in-out|ease-in|linear)(?:[\s,]|$)/.test(v) && !/infinite/.test(v)).map(([p, v]) => `${sel(r)} { ${p}: ${clip(v, 40)} }`));
  if (easing.length) add('warn', 'craft', 'easing', `Default easing on UI moves (${easing.length})`, easing, 'Use the motion tokens: cubic-bezier(0.2, 0.7, 0.2, 1). UI 200ms, layout 320ms, sheets 400ms.', 'SKILL.md › Library flow');

  const animated = rules.some((r) => r.decls.some(([p, v]) => (/^animation(?:-name)?$/.test(p) && !/^none$/.test(v)) || (p === 'transition' && /transform|opacity|all/.test(v)))) || page.styles.some((s) => /@keyframes/.test(s.text));
  const reduced = page.styles.some((s) => /prefers-reduced-motion/.test(s.text)) || /prefers-reduced-motion/.test(page.html);
  if (animated && !reduced) add('fail', 'craft', 'reduced-motion', 'Motion with no prefers-reduced-motion', [], 'Add @media (prefers-reduced-motion: reduce) and still every effect. The reduced frame must be complete.', 'SKILL.md › Library flow');

  const z = rules.flatMap((r) => r.decls.filter(([p, v]) => p === 'z-index' && Number(v) >= 5000).map(([, v]) => `${sel(r)} { z-index: ${v} }`));
  if (z.length) add('warn', 'craft', 'z-index', 'z-index in the thousands', z, 'Four levels only: sticky nav, overlay, modal, tooltip.', 'taste.md › Craft');

  const vh = rules.filter((r) => r.decls.some(([p, v]) => /height/.test(p) && /\b100vh\b/.test(v)));
  if (vh.length) add('warn', 'craft', '100vh', '100vh on full-height sections', vh.map(sel), 'Use min-height: 100dvh. 100vh hides content under the phone\'s toolbar.', 'taste.md › Page shape');

  const cursor = rules.filter((r) => r.decls.some(([p, v]) => p === 'cursor' && (/none/.test(v) || /url\(/.test(v))));
  if (cursor.length) add('warn', 'slop', 'custom-cursor', 'A custom cursor', cursor.map(sel), 'Not on a daily tool. On a website, only when it is the Idea.', 'practice.md › Look');

  const tw = uniq(classes.match(new RegExp(`\\b(?:bg|text|border|ring|from|to|via)-(?:${TW_COLORS})-\\d{2,3}\\b`, 'g')) || []);
  const twHex = uniq(classes.match(/\b[a-z-]+-\[#[0-9a-fA-F]{3,8}\]/g) || []);
  if (tw.length >= 6) add('warn', 'kit', 'tailwind-defaults', `The default Tailwind palette (${tw.length} colour classes)`, tw.slice(0, 6), 'Put the theme\'s tokens in the Tailwind theme and use bg-surface, text-ink, bg-primary. A project\'s stock Tailwind colours are not a design system.', 'practice.md › Stack');
  if (twHex.length) add('fail', 'kit', 'hex-in-class', `A hex in a class (${twHex.length})`, twHex, 'Use a token. A hex in a class is a fail.', 'practice.md › Stack');

  const placeholderImg = root.querySelectorAll('img, source').map((i) => i.getAttribute('src') || i.getAttribute('srcset') || '').filter((s) => /(?:placehold\.co|placehold\.it|placeholder\.com|placeholdit|picsum\.photos|dummyimage\.com|placekitten|placebear|source\.unsplash\.com|loremflickr|fakeimg\.pl|lorempixel)/.test(s));
  if (placeholderImg.length) add('fail', 'slop', 'placeholder-images', 'Placeholder or random stock images', placeholderImg, 'Draw the product as a small working screen in the theme, or leave a sized slot with one caption.', 'website.md › Show the work');

  /* ----- fonts ----- */
  const fonts = declaredFonts(rules, page.fontLinks);
  const leads = [...fonts.first.keys()];
  const leadSet = uniq(leads.concat(fonts.linked).map((f) => f.toLowerCase())).filter((f) => !GENERIC_FONTS.has(f) && !/\bfallback$/.test(f));
  const pairingFaces = kit.pairingData ? [kit.pairingData.display?.family, kit.pairingData.text?.family, kit.pairingData.mono?.family].filter(Boolean).map((f) => f.toLowerCase()) : [];
  const realFaces = leadSet.filter((f) => !FALLBACK_FONTS.has(f) || pairingFaces.includes(f));
  if (realFaces.length > 3) add('fail', 'kit', 'font-count', `${realFaces.length} type families`, realFaces, 'A pairing is two faces, three with a mono. Remove the rest.', 'practice.md › Look');
  if (kit.pairingData && !kit.free) {
    const stray = realFaces.filter((f) => !pairingFaces.includes(f));
    if (stray.length) add('fail', 'kit', 'off-pairing', `Faces that are not the ${kit.pairingData.name || kit.pairing} pairing: ${stray.join(', ')}`, stray.map((f) => `${f}: ${(fonts.first.get(leads.find((l) => l.toLowerCase() === f)) || ['font link']).slice(0, 2).join(', ')}`),
      `Use --font-display (${kit.pairingData.display?.family}) and --font-text (${kit.pairingData.text?.family}) from pairings/${kit.pairing}.css.`, 'SKILL.md › Rules');
    const display = kit.pairingData.display?.family?.toLowerCase();
    const bodyRule = rules.filter((r) => /^(?:body|html|:root|html,\s*body|body,\s*html|p)$/.test(r.selector)).flatMap((r) => r.decls.filter(([p]) => p === 'font-family').map(([, v]) => v));
    if (display && display !== kit.pairingData.text?.family?.toLowerCase() && bodyRule.some((v) => fontFamilies(v.replace(/var\(--font-display[^)]*\)/, display))[0]?.toLowerCase() === display)) {
      add('fail', 'kit', 'display-body', 'Body text in the display face', bodyRule, 'Body uses --font-text.', 'practice.md › Look');
    }
  } else if (!kit.free && realFaces.length && realFaces.every((f) => DEFAULT_FACES.includes(f))) {
    add('warn', 'kit', 'default-face', `Only default faces (${realFaces.join(', ')})`, realFaces, 'Lock a pairing by mood (get_pairing). Inter is right only when the pairing names it.', 'SKILL.md › Library flow');
  } else if (!kit.free && !realFaces.length) {
    add('warn', 'kit', 'default-face', 'No type set: the browser default face', [], 'Lock a pairing by mood (get_pairing) and copy its CSS.', 'SKILL.md › Library flow');
  }

  /* ----- colours against the theme ----- */
  const colourValues = [];
  for (const r of rules) for (const [p, v] of r.decls) {
    if (p.startsWith('--') || /mask/.test(p)) continue;
    for (const m of v.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g)) colourValues.push({ hex: m[0].toLowerCase(), where: `${sel(r)} { ${p} }` });
  }
  const distinct = uniq(colourValues.map((c) => c.hex));
  if (kit.themeData && !kit.free) {
    // The page's own tokens count: a brand colour set on --primary, or a nudge DESIGN.md records, is the theme now.
    const own = rules.filter((r) => /^(?::root|html|\[data-theme[^\]]*\]|:root\[[^\]]+\])/.test(r.selector)).flatMap((r) => r.decls.filter(([p]) => p.startsWith('--')).flatMap(([, v]) => v.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) || []));
    const tokens = Object.values(kit.themeData.colors || {}).concat(Object.values(kit.pairTheme?.colors || {}), own).map(hexToRgb).filter(Boolean);
    const offTheme = (h) => { const rgb = hexToRgb(h); return rgb && !tokens.some((t) => rgbDistance(t, rgb) < 8); };
    // Fills and strokes paint a drawing; colour, background, and borders paint the interface.
    const art = (c) => /\{ (?:fill|stroke|stop-color|flood-color) \}$/.test(c.where);
    const ui = uniq(colourValues.filter((c) => !art(c) && offTheme(c.hex)).map((c) => c.hex));
    const drawn = uniq(colourValues.filter((c) => art(c) && offTheme(c.hex)).map((c) => c.hex)).filter((h) => !ui.includes(h));
    const where = (h) => `${h} at ${colourValues.find((c) => c.hex === h).where}`;
    if (ui.length) add(ui.length > 3 ? 'fail' : 'warn', 'kit', 'off-theme', `${ui.length} interface colour${ui.length > 1 ? 's' : ''} that are not in ${kit.themeData.name} or the page's tokens`, ui.map(where),
      'Map each to its role with the table in When numbers disagree (SKILL.md). Hover is --surface-2 or the token itself, not a new hex.', 'SKILL.md › When numbers disagree');
    if (drawn.length > 4) add('info', 'kit', 'drawing-colours', `${drawn.length} colours in drawings that are not tokens`, drawn.slice(0, 4).map(where),
      'Fine for an illustration. If they are tints of the theme, write them as color-mix() of the tokens so a theme change carries them.', 'SKILL.md › When numbers disagree');
  } else if (!kit.locked && distinct.length > 14) {
    const varUse = rules.reduce((n, r) => n + r.decls.filter(([p, v]) => !p.startsWith('--') && /var\(--/.test(v)).length, 0);
    add('warn', 'kit', 'no-tokens', `${distinct.length} hard-coded colours${varUse < 10 ? ' and almost no tokens' : ''}`, distinct.slice(0, 6), 'Put one theme\'s roles on :root (get_theme) and use the variables.', 'practice.md › Stack');
  }

  /* ----- radius and shadow against the family ----- */
  const fam = kit.familyData;
  const radii = rules.flatMap((r) => r.decls.filter(([p]) => /^border(?:-[a-z]+)*-radius$/.test(p)).map(([, v]) => ({ v, r })));
  if (fam) {
    const allowed = new Set(['0', '0px', '50%', '100%', '999px', '9999px', 'inherit', '100vmax', '1000px']);
    for (const m of `${fam.radius} ${(fam.rules || []).filter((s) => /radius|corner/i.test(s)).join(' ')}`.matchAll(/\d+px/g)) allowed.add(m[0]);
    const off = radii.filter(({ v, r }) => !/var\(/.test(v) && !/:focus/.test(r.selector) && v.split(/\s+/).some((part) => !allowed.has(part.replace(/!important/, '').trim()) && /\d/.test(part)));
    if (off.length) add('warn', 'kit', 'off-radius', `Radius that is not the ${fam.name} family's (${fam.radius})`, off.map(({ v, r }) => `${sel(r)} { border-radius: ${v} }`), `The family locks the radius: ${((fam.rules || []).find((s) => /radius/i.test(s)) || fam.radius).replace(/\.$/, '')}.`, 'SKILL.md › When numbers disagree');
    if (fam.shadow === 'none' && !lifted(['brutal'])) {
      const shadows = rules.filter((r) => r.decls.some(([p, v]) => p === 'box-shadow' && !/^(?:none|0 0 0 \d+px|inset 0 0 0 \d+px)/.test(v) && !/var\(--(?:ring|focus)/.test(v)) && !/:focus/.test(r.selector));
      if (shadows.length) add('fail', 'kit', 'off-shadow', `Shadows on the ${fam.name} family, whose shadow is none`, shadows.map(sel), 'Use the hairline border instead.', 'practice.md › Look');
    }
  } else if (uniq(radii.map(({ v }) => v)).length > 5) {
    add('warn', 'kit', 'radius-drift', `${uniq(radii.map(({ v }) => v)).length} different corner radii`, uniq(radii.map(({ v }) => v)).slice(0, 6), 'Lock a family (get_families). One radius for controls, one for cards.', 'SKILL.md › When numbers disagree');
  }

  /* ----- one primary, static guess ----- */
  const primaries = actions.filter((a) => /(?:^|[\s_-])(?:btn-primary|button-primary|button--primary|btn--primary|primary|cta-primary)(?:$|[\s_-])/.test(a.el.getAttribute('class') || ''));
  const heroPrimaries = primaries.filter((a) => { let n = a.el; while (n && n !== body) { if (n === firstBlock) return true; n = n.parentNode; } return false; });
  if (heroPrimaries.length > 1) add('warn', 'slop', 'two-primaries', `${heroPrimaries.length} primary buttons in the first screen`, heroPrimaries.map((a) => a.text), 'One primary per view. The second becomes outline.', 'SKILL.md › Rules');

  /* ----- headline ----- */
  if (h1s.length && h1s[0].text.split(/\s+/).length > 16) add('warn', 'copy', 'long-h1', `A ${h1s[0].text.split(/\s+/).length}-word headline`, [h1s[0].text], 'Two or three lines at 1280px. Cut it to the answer.', 'taste.md › Page shape');

  /* ----- credit, for Lounge builds ----- */
  if (kit.locked && !/design lounge/i.test(text)) add('info', 'kit', 'credit', 'No Design Lounge credit line', [], 'Add `Designed using <a href="https://www.designlounge.live">Design Lounge</a>` once, in the footer\'s small text.', 'SKILL.md › Rules');

  return F;
}
