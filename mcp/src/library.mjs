// Reads the Design Lounge skill folder: the library (map, index, starts, themes, pairings, briefs, icons, Wada)
// and the method files (SKILL.md, practice.md, ...). One source of truth: the server never keeps its own copy of a rule.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * The skill folder: DESIGN_LOUNGE_SKILL, then the repo's own, then the copy bundled into the package. In the repo the
 * bundled copy is a leftover from the last pack and goes stale; an npm install has no repo copy, so it uses the bundle.
 */
export function findSkillDir() {
  const candidates = [
    process.env.DESIGN_LOUNGE_SKILL,
    path.join(here, '..', '..', 'skills', 'design-lounge'),
    path.join(here, '..', 'skill'),
  ].filter(Boolean);
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'library', 'map.json'))) return path.resolve(dir);
  }
  throw new Error(`Design Lounge library not found. Looked in: ${candidates.join(', ')}. Set DESIGN_LOUNGE_SKILL to the skill folder.`);
}

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const words = (s) => String(s || '').toLowerCase().match(/[a-z0-9]+(?:-[a-z0-9]+)*/g) || [];
const STOP = new Set(['a', 'an', 'the', 'and', 'or', 'for', 'of', 'to', 'in', 'on', 'with', 'my', 'our', 'me', 'i', 'we', 'is', 'it', 'that', 'this', 'make', 'build', 'create', 'design', 'want', 'need', 'please', 'site', 'website', 'page', 'some', 'cool', 'nice', 'modern', 'clean', 'simple']);
export const terms = (s) => [...new Set(words(s).flatMap((w) => [w, ...w.split('-')]).filter((w) => w.length > 1 && !STOP.has(w)))];

/** Score how well a query's terms hit weighted text fields. A whole-word hit counts, a prefix hit counts half. */
function score(queryTerms, fields) {
  let total = 0;
  for (const [text, weight] of fields) {
    const have = new Set(terms(text));
    for (const t of queryTerms) {
      if (have.has(t)) total += weight;
      else if (t.length > 3 && [...have].some((h) => h.startsWith(t) || t.startsWith(h) && h.length > 3)) total += weight / 2;
    }
  }
  return total;
}

export class Library {
  constructor(dir = findSkillDir()) {
    this.dir = dir;
    this.lib = path.join(dir, 'library');
    this.map = readJson(path.join(this.lib, 'map.json'));
    this.site = this.map.site || 'https://www.designlounge.live';
    this._index = null;
    this._starts = new Map();
  }

  get index() {
    return (this._index ??= readJson(path.join(this.lib, 'index.json')));
  }
  get pieces() { return this.index.pieces; }
  get counts() { return this.map.counts; }

  link(kind, id) {
    return { theme: `${this.site}/themes/${id}`, pairing: `${this.site}/type/${id}`, demo: `${this.site}/demo/${id}`, piece: `${this.site}/p/${id}` }[kind];
  }

  /* ---------- pieces ---------- */
  searchPieces({ query = '', platform, category, style, type, limit = 12 } = {}) {
    const q = terms(query);
    const rows = [];
    for (const p of this.pieces) {
      if (platform && p.platform !== platform) continue;
      if (category && p.category !== category) continue;
      if (style && !(p.styles || []).includes(style)) continue;
      if (type && p.type !== type) continue;
      const s = q.length
        ? score(q, [[p.id, 3], [p.title, 3], [p.category, 3], [(p.tags || []).join(' '), 2], [(p.styles || []).join(' '), 2], [p.summary, 1]])
        : 1;
      if (s > 0) rows.push({ s, p });
    }
    rows.sort((a, b) => b.s - a.s || a.p.id.localeCompare(b.p.id));
    return {
      total: rows.length,
      pieces: rows.slice(0, limit).map(({ p }) => ({
        id: p.id, title: p.title, platform: p.platform, category: p.category, styles: p.styles, motion: p.motion,
        summary: p.summary, demo: this.link('demo', p.id), page: this.link('piece', p.id),
      })),
    };
  }

  piece(id) {
    const meta = this.pieces.find((p) => p.id === id);
    const file = path.join(this.lib, 'briefs', `${id}.md`);
    if (!meta || !fs.existsSync(file)) return null;
    return { meta, brief: fs.readFileSync(file, 'utf8'), demo: this.link('demo', id), page: this.link('piece', id) };
  }

  categories() {
    const out = {};
    for (const p of this.pieces) out[p.category] = (out[p.category] || 0) + 1;
    return out;
  }

  /* ---------- recipes ---------- */
  recipe(id) {
    if (this._starts.has(id)) return this._starts.get(id);
    const file = path.join(this.lib, 'starts', `${id}.json`);
    const r = fs.existsSync(file) ? readJson(file) : null;
    this._starts.set(id, r);
    return r;
  }
  recipes() { return this.map.starts; }

  /** The kind map in reference.md: what they say, and the recipe it sends to. */
  kindMap() {
    if (this._kindMap) return this._kindMap;
    const section = this.guideSection('reference.md', 'Kind map') || '';
    this._kindMap = section.split('\n').filter((l) => l.startsWith('| ') && !/^\| (?:They say|---)/.test(l)).map((l) => {
      const [said, kind, then] = l.split(' | ').map((c) => c.replace(/^\|\s*|\s*\|$/g, ''));
      return { said, kind, then, recipe: then?.match(/recipe `([a-z-]+)`/)?.[1] || then?.match(/^`([a-z-]+)`/)?.[1] || null };
    }).filter((r) => r.recipe);
    return this._kindMap;
  }

  /** Recipes ranked against a request: the kind map's words first, then each recipe's title, when-line, and directions. */
  rankRecipes(request, limit = 4) {
    const q = terms(request);
    const kindWords = {};
    for (const row of this.kindMap()) kindWords[row.recipe] = `${kindWords[row.recipe] || ''} ${row.said}`;
    const ranked = this.map.starts.map((s) => {
      const r = this.recipe(s.id) || s;
      const moods = (r.directions || []).map((d) => `${d.name} ${d.mood}`).join(' ');
      return { s: score(q, [[kindWords[r.id] || '', 5], [SUBJECTS[r.id] || '', 4], [`${r.id} ${r.title}`, 4], [r.when, 2], [r.blurb, 2], [(r.categories || []).join(' '), 1], [moods, 1]]), r };
    }).filter((x) => x.s > 0);
    // When recipes overlap, rule 1: a page kind they named wins.
    const named = /\blanding page\b/i.test(request) && !/\b(?:fashion|wellness|fintech|bank|tool|software|saas|app)\b/i.test(request) ? 'landing'
      : /\b(?:online store|online shop|e-?commerce)\b/i.test(request) ? 'commerce'
      : /\b(?:book a table|our menu|the menu)\b/i.test(request) ? 'restaurant' : null;
    if (named) { const hit = ranked.find((x) => x.r.id === named); if (hit) hit.s += 100; else ranked.push({ s: 100, r: this.recipe(named) }); }
    ranked.sort((a, b) => b.s - a.s);
    const kind = (id) => this.kindMap().find((k) => k.recipe === id);
    return ranked.slice(0, limit).map(({ r }) => ({ id: r.id, title: r.title, surface: r.surface, when: r.when, kindMap: kind(r.id) ? `${kind(r.id).said} → ${kind(r.id).then}` : undefined, directions: (r.directions || []).map((d) => d.id) }));
  }

  /* ---------- themes, pairings, families ---------- */
  themes({ mood, mode } = {}) {
    const q = terms(mood);
    return this.index.themes
      .filter((t) => !mode || t.mode === mode)
      .map((t) => ({ t, s: q.length ? score(q, [[`${t.id} ${t.name}`, 2], [t.mood, 2], [(t.tags || []).join(' '), 2], [(t.bestFor || []).join(' '), 2]]) : 1 }))
      .filter((x) => x.s > 0).sort((a, b) => b.s - a.s)
      .map(({ t }) => ({ id: t.id, name: t.name, mode: t.mode, pair: t.pair, mood: t.mood, bestFor: t.bestFor, link: this.link('theme', t.id) }));
  }
  theme(id) {
    const css = path.join(this.lib, 'themes', `${id}.css`);
    if (!fs.existsSync(css)) return null;
    return { ...readJson(path.join(this.lib, 'themes', `${id}.json`)), css: fs.readFileSync(css, 'utf8'), link: this.link('theme', id) };
  }
  pairings({ mood } = {}) {
    const q = terms(mood);
    return this.index.pairings
      .map((p) => ({ p, s: q.length ? score(q, [[`${p.id} ${p.name}`, 2], [p.mood, 2], [(p.tags || []).join(' '), 2], [(p.bestFor || []).join(' '), 2]]) : 1 }))
      .filter((x) => x.s > 0).sort((a, b) => b.s - a.s)
      .map(({ p }) => ({ id: p.id, name: p.name, display: p.display, text: p.text, mono: p.mono || null, mood: p.mood, caution: p.caution || '', link: this.link('pairing', p.id) }));
  }
  pairing(id) {
    const css = path.join(this.lib, 'pairings', `${id}.css`);
    if (!fs.existsSync(css)) return null;
    return { ...readJson(path.join(this.lib, 'pairings', `${id}.json`)), css: fs.readFileSync(css, 'utf8'), link: this.link('pairing', id) };
  }
  families() { return this.map.families; }
  family(id) { return this.map.families.find((f) => f.id === id) || null; }

  /** Resolve a name, id, or Lounge link to a theme, pairing, or family id. */
  resolveId(kind, value) {
    if (!value) return null;
    const v = String(value).trim();
    const fromLink = v.match(/\/(?:themes|type)\/([a-z0-9-]+)/);
    if (fromLink) return fromLink[1];
    const list = kind === 'theme' ? this.index.themes : kind === 'pairing' ? this.index.pairings : this.map.families;
    const slug = v.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const hit = list.find((x) => x.id === slug || x.id === v.toLowerCase() || (x.name || '').toLowerCase() === v.toLowerCase()
      || (x.name || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-') === slug);
    return hit ? hit.id : null;
  }

  /* ---------- icons, Wada ---------- */
  get icons() { return (this._icons ??= readJson(path.join(this.lib, 'icons.json'))); }
  findIcons(names = [], group) {
    const all = this.icons.icons;
    if (!names.length) return { groups: this.icons.groups, icons: all.filter((i) => !group || i.group === group).map((i) => ({ id: i.id, name: i.name, group: i.group })) };
    const found = [], missing = [];
    for (const n of names) {
      const t = terms(n);
      const hit = all.find((i) => i.id === n) || all.find((i) => t.some((w) => terms(`${i.id} ${i.name}`).includes(w)));
      if (hit) found.push({ asked: n, id: hit.id, svg: hit.svg });
      else missing.push(n);
    }
    return { stroke: this.icons.stroke, size: this.icons.size, found, missing };
  }

  get wada() {
    if (this._wada) return this._wada;
    const lines = fs.readFileSync(path.join(this.lib, 'wada.txt'), 'utf8').split('\n');
    this._wada = { head: lines.filter((l) => l.startsWith('#')), rows: lines.filter((l) => /^\d{3} \|/.test(l)) };
    return this._wada;
  }
  searchWada({ query = '', near, limit = 8 }) {
    const { head, rows } = this.wada;
    let hits;
    if (near) {
      const target = hexToRgb(near);
      if (!target) return { head, rows: [], error: `Not a hex colour: ${near}` };
      hits = rows.map((r) => ({ r, d: Math.min(...(r.match(/#[0-9a-f]{6}/gi) || []).map((h) => rgbDistance(hexToRgb(h), target))) }))
        .sort((a, b) => a.d - b.d).map((x) => x.r);
    } else {
      const q = terms(query);
      hits = rows.filter((r) => q.every((t) => r.toLowerCase().includes(t)));
      if (!hits.length) hits = rows.filter((r) => q.some((t) => r.toLowerCase().includes(t)));
    }
    return { head, rows: hits.slice(0, limit) };
  }

  /* ---------- method files ---------- */
  guides() {
    return fs.readdirSync(this.dir).filter((f) => f.endsWith('.md')).sort();
  }
  guide(file) {
    const name = path.basename(file.endsWith('.md') ? file : `${file}.md`);
    const full = path.join(this.dir, name);
    return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
  }
  /** One section of a method file, by heading text. The section runs to the next heading of the same or higher level. */
  guideSection(file, heading) {
    const text = this.guide(file);
    if (!text) return null;
    if (!heading) return text;
    const lines = text.split('\n');
    const isHead = headingLines(lines);
    const want = heading.toLowerCase().replace(/^#+\s*/, '');
    const start = lines.findIndex((l, i) => isHead[i] && l.replace(/^#+\s*/, '').toLowerCase() === want);
    const at = start >= 0 ? start : lines.findIndex((l, i) => isHead[i] && l.toLowerCase().includes(want));
    if (at < 0) return null;
    const level = lines[at].match(/^#+/)[0].length;
    let end = lines.length;
    for (let i = at + 1; i < lines.length; i++) {
      if (isHead[i] && lines[i].match(/^#+/)[0].length <= level) { end = i; break; }
    }
    return lines.slice(at, end).join('\n').trim();
  }
  headings(file) {
    const text = this.guide(file);
    if (!text) return [];
    const lines = text.split('\n');
    const isHead = headingLines(lines);
    return lines.filter((l, i) => isHead[i] && /^#{1,3} /.test(l));
  }

  /**
   * The rules that must hold even when the client never loaded the skill: their words win, the Rules list in
   * SKILL.md, and the Look fails in practice.md. Read from the files, so an edit there reaches every agent.
   */
  coreRules() {
    const look = this.guideSection('practice.md', 'Look') || '';
    const from = look.indexOf('These are fails.');
    const lifted = look.indexOf('A piece you locked may use');
    const end = lifted > from ? look.indexOf('\n\n', lifted) : -1;
    const fails = from >= 0 ? look.slice(from, end > 0 ? end : undefined).trim() : '';
    return [
      this.guideSection('SKILL.md', 'Their words win'),
      this.guideSection('SKILL.md', 'Rules'),
      fails && `## The Look fails (practice.md)\n\n${fails}`,
    ].filter(Boolean).join('\n\n');
  }

  /** The style alias table in styles.md, as [synonyms, route, notes]. */
  styleRows() {
    const text = this.guide('styles.md') || '';
    return text.split('\n').filter((l) => l.startsWith('| ') && !l.startsWith('| They say') && !l.startsWith('| ---'))
      .map((l) => l.split(' | ').map((c) => c.replace(/^\|\s*|\s*\|$/g, '').trim()))
      .filter((c) => c.length >= 2);
  }
}

// Everyday nouns for each recipe's subject that the recipe files never spell out. Ranking only: the agent still
// settles overlaps with When recipes overlap in practice.md.
const SUBJECTS = {
  restaurant: 'cafe café coffee bistro bar pub eatery diner brunch dumpling dumplings momo momos ramen noodle noodles pizza pizzeria sushi tapas taqueria kitchen counter dine dining table tables reservation supper',
  food: 'bakery bread cake cakes chocolate deli grocer grocery butcher cheese honey spices tea roaster delivery meal-kit preorder',
  hotel: 'inn lodge guesthouse homestay bnb airbnb resort villa hostel cabin rooms stay',
  wellness: 'spa massage retreat meditation ayurveda reiki therapy salon skincare',
  gym: 'fitness crossfit pilates climbing boxing yoga spin martial dojo trainer',
  clinic: 'doctor dentist dental physio physiotherapy vet veterinary optician pharmacy hospital therapist',
  professional: 'lawyer accountant accounting tax consultant consultancy advisory architect firm agency-services plumber electrician builder contractor repair',
  commerce: 'shop store ecommerce boutique sell products cart checkout merch',
  portfolio: 'photographer illustrator artist designer studio showreel architect',
  'portfolio-builder': 'developer engineer programmer founder product-manager',
  education: 'course class lessons tutor tutoring teacher academy bootcamp workshop',
  event: 'wedding conference concert gig festival party meetup launch',
  music: 'band album label dj musician release tour',
  nonprofit: 'charity ngo donate donation fundraiser volunteer',
  'real-estate': 'property apartment flat house homes rental realtor',
  saas: 'software startup platform api tool subscription b2b',
};

/** Which lines are Markdown headings. A "## Brief" inside a code fence is part of a template, not a heading. */
function headingLines(lines) {
  let fence = false;
  return lines.map((l) => {
    if (/^\s*```/.test(l)) { fence = !fence; return false; }
    return !fence && /^#{1,6} /.test(l);
  });
}

/** How many, as copy says it: rounded down with a plus ("600+", "80+"). Small sets stay exact. */
export const about = (n) => (n >= 100 ? `${Math.floor(n / 100) * 100}+` : n >= 20 ? `${Math.floor(n / 10) * 10}+` : String(n));

export function hexToRgb(hex) {
  const m = String(hex).trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
export const rgbDistance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
