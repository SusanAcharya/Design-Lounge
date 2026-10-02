// Validates every piece: both files exist, frontmatter is sane, demo obeys the spec.
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const demosDir = path.join(root, 'src/demos');
const briefsDir = path.join(root, 'src/content/pieces');
const PLATFORMS = ['web', 'mobile-web', 'mobile-app', 'pwa', 'tablet'];
// Single source of truth is src/content.config.ts; parse the lists out of it.
const config = await readFile(path.join(root, 'src/content.config.ts'), 'utf8');
const list = (name) => [...(config.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\] as const`))?.[1] ?? '').matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
const TYPES = list('TYPES');
const STYLES = list('STYLES');
const CATEGORIES = list('CATEGORIES');
const SECTIONS = ['## What it is','## Reference behaviour','## Structure','## Tokens','## Typography','## Motion','## States','## Accessibility','## Responsive rules','## Acceptance checklist','## Implementation notes'];
const BANNED_WORDS = /\b(lorem|ipsum|stunning|seamless|sleek)\b/i;

const demos = (await readdir(demosDir)).filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, ''));
const briefs = (await readdir(briefsDir)).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, ''));
const slugs = new Set([...demos, ...briefs]);
let errors = 0, warnings = 0;
const err = (s, m) => { errors++; console.log(`  ✗ ${s}: ${m}`); };
const warn = (s, m) => { warnings++; console.log(`  ! ${s}: ${m}`); };

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('[')) v = v.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    else if (v === 'true' || v === 'false') v = v === 'true';
    else if (/^\d+$/.test(v)) v = Number(v);
    else v = v.replace(/^["']|["']$/g, '');
    fm[kv[1]] = v;
  }
  return { fm, body: m[2] };
}

for (const slug of [...slugs].sort()) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err(slug, 'slug must be kebab-case');
  if (!demos.includes(slug)) { err(slug, 'missing demo html'); continue; }
  if (!briefs.includes(slug)) { err(slug, 'missing brief md'); continue; }
  const html = await readFile(path.join(demosDir, slug + '.html'), 'utf8');
  const md = await readFile(path.join(briefsDir, slug + '.md'), 'utf8');
  const size = (await stat(path.join(demosDir, slug + '.html'))).size;

  // demo checks
  if (!html.startsWith('<!-- Design Lounge piece: ' + slug)) err(slug, 'demo must start with the piece header comment');
  if (!/<!doctype html>/i.test(html)) err(slug, 'demo missing <!doctype html>');
  if (size > 40 * 1024) err(slug, `demo is ${(size/1024).toFixed(1)} KB (> 40 KB)`);
  else if (size > 30 * 1024) warn(slug, `demo is ${(size/1024).toFixed(1)} KB (> 30 KB)`);
  if (/<script[^>]+src=/i.test(html)) err(slug, 'external script');
  const externals = [...html.matchAll(/https?:\/\/[^\s"'<>)]+/g)].map(x => x[0]).filter(u => !/fonts\.(googleapis|gstatic)\.com|www\.w3\.org/.test(u));
  if (externals.length) err(slug, 'external URLs: ' + [...new Set(externals)].slice(0, 3).join(', '));
  if (BANNED_WORDS.test(html)) err(slug, 'demo contains banned word: ' + html.match(BANNED_WORDS)[0]);
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(html)) err(slug, 'demo contains emoji');
  if (/localStorage|sessionStorage|document\.cookie|alert\(|console\.log|document\.write/.test(html)) err(slug, 'demo uses forbidden API');
  if (!/prefers-reduced-motion/.test(html) && /animation|transition/.test(html)) warn(slug, 'demo animates but has no prefers-reduced-motion rule');
  if (!/<meta name="viewport"/.test(html)) err(slug, 'demo missing viewport meta');

  // brief checks
  const parsed = parseFrontmatter(md);
  if (!parsed) { err(slug, 'brief has no frontmatter'); continue; }
  const { fm, body } = parsed;
  for (const k of ['title','summary','platform','type','category','tags','styles','motion','difficulty','published','palette','fonts']) if (fm[k] === undefined) err(slug, `frontmatter missing ${k}`);
  if (fm.category && !CATEGORIES.includes(fm.category)) err(slug, 'bad category ' + fm.category);
  if (fm.title && fm.title.length > 48) err(slug, 'title > 48 chars');
  if (fm.summary && fm.summary.length > 200) err(slug, 'summary > 200 chars');
  if (fm.platform && !PLATFORMS.includes(fm.platform)) err(slug, 'bad platform ' + fm.platform);
  if (fm.type && !TYPES.includes(fm.type)) err(slug, 'bad type ' + fm.type);
  if (Array.isArray(fm.styles)) for (const s of fm.styles) if (!STYLES.includes(s)) err(slug, 'bad style ' + s);
  if (Array.isArray(fm.palette)) for (const c of fm.palette) if (!/^#[0-9a-fA-F]{6}$/.test(c)) err(slug, 'bad palette colour ' + c);
  const header = html.match(/platform: ([a-z-]+)/);
  if (header && fm.platform && header[1] !== fm.platform) err(slug, `demo header platform (${header[1]}) ≠ frontmatter (${fm.platform})`);
  for (const s of SECTIONS) if (!body.includes(s)) err(slug, `brief missing section "${s}"`);
  const lines = body.split('\n').length;
  if (lines < 150) warn(slug, `brief is short (${lines} lines)`);
  if (BANNED_WORDS.test(body)) warn(slug, 'brief contains banned word: ' + body.match(BANNED_WORDS)[0]);
  if (!/- \[ \]/.test(body)) err(slug, 'brief has no checklist items');
}

console.log(`\n${slugs.size} pieces · ${errors} errors · ${warnings} warnings`);
process.exit(errors ? 1 : 0);
