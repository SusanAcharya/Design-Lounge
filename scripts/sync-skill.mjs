#!/usr/bin/env node
/**
 * Copy the catalogue into skills/design-lounge/library so `npx skills add`
 * installs the library with the skill. Commit the output.
 *
 * Run: node --experimental-strip-types scripts/sync-skill.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES, THEME_PAIRS, themeCss } from '../src/data/themes.ts';
import { PAIRINGS, pairingCss, SCALES } from '../src/data/type.ts';
import { KINDS, FAMILIES } from '../src/data/kit.ts';
import { ICONS, ICON_CREDIT, ICON_GROUPS, iconSvg } from '../src/data/icons.ts';
import { EASINGS, DURATIONS, RECIPES, tokensCss } from '../src/data/motion.ts';
import { STARTS } from '../src/data/starts.ts';
import { COLLECTIONS } from '../src/data/collections.ts';
import { sourcesFrom, studyPiece } from '../src/data/sources.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const piecesDir = path.join(root, 'src/content/pieces');
const skillLib = path.join(root, 'skills/design-lounge/library');
const briefsDir = path.join(skillLib, 'briefs');
const repo = 'https://github.com/SusanAcharya/Design-Lounge';
const lounge = 'https://www.designlounge.live';
const raw = 'https://raw.githubusercontent.com/SusanAcharya/Design-Lounge/main';
const author = { name: 'Susan Acharya', site: 'https://acharyasusan.com.np' };
const credit = 'Designed using Design Lounge · https://www.designlounge.live';

function parseFrontmatter(rawText) {
  const match = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: rawText.trim() };
  const data = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((part) => part.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    data[kv[1]] = value;
  }
  return { data, body: match[2].trim() };
}

const pieces = fs
  .readdirSync(piecesDir)
  .filter((name) => name.endsWith('.md'))
  .map((name) => {
    const id = name.replace(/\.md$/, '');
    const parsed = parseFrontmatter(fs.readFileSync(path.join(piecesDir, name), 'utf8'));
    return { id, ...parsed };
  })
  .sort((a, b) => String(a.data.published).localeCompare(String(b.data.published)) || String(a.data.title).localeCompare(String(b.data.title)));

const siteSources = sourcesFrom(fs.readFileSync(path.join(root, 'websites.txt'), 'utf8'));
const sourceOf = new Map(pieces.map((piece) => [piece.id, studyPiece(piece, siteSources)]));

fs.rmSync(briefsDir, { recursive: true, force: true });
fs.mkdirSync(briefsDir, { recursive: true });

// Briefs ship with the parts every build needs first. The demo's own paint and the long notes go below a marker.
const OPTIONAL = ['Reference behaviour', 'Tokens', 'Typography', 'Implementation notes'];
const briefNote = '> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo\'s colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo\'s names, prices, and sentences belong to the demo. Write this product\'s facts in short sentences.';
function reorderBrief(body) {
  const parts = body.split(/\n(?=## )/);
  const title = parts.shift();
  const name = (p) => p.split('\n', 1)[0].slice(3).trim();
  const core = parts.filter((p) => !OPTIONAL.includes(name(p)));
  const rest = OPTIONAL.map((o) => parts.find((p) => name(p) === o)).filter(Boolean);
  const out = [title.trimEnd() + '\n\n' + briefNote, ...core.map((p) => p.trimEnd())];
  if (rest.length) out.push('---\n\n**Optional below this line.** Open it when you build the motion, get stuck, or want the demo\'s exact paint.', ...rest.map((p) => p.trimEnd()));
  return out.join('\n\n');
}
for (const piece of pieces) {
  const n = String(pieces.indexOf(piece) + 1).padStart(3, '0');
  const head = `<!-- Design Lounge Nº ${n} · "${piece.data.title}" · www.designlounge.live -->\n\n`;
  const foot = `\n\n---\n\n*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*\n`;
  fs.writeFileSync(path.join(briefsDir, `${piece.id}.md`), head + reorderBrief(piece.body) + foot);
}

const index = {
  name: 'Design Lounge',
  author,
  credit,
  license: 'Free to use in products. Credit appreciated. Do not republish as a catalogue.',
  repo,
  site: lounge,
  raw,
  readme: 'This file ships inside the skill. Read it when the skill is invoked. Briefs are briefs/<id>.md next to this file. HTML demos are on the live site at demo.',
  counts: {
    pieces: pieces.length,
    themes: THEMES.length,
    pairings: PAIRINGS.length,
    icons: ICONS.length,
    recipes: RECIPES.length,
    starts: STARTS.length,
    sources: siteSources.length,
  },
  sources: siteSources.map((source) => ({
    id: source.id,
    name: source.name,
    url: source.url,
    host: source.host,
    line: source.line,
    take: source.take,
    studied: source.studied,
    pieces: pieces.filter((piece) => sourceOf.get(piece.id)?.source.id === source.id).map((piece) => piece.id),
  })),
  kit: {
    kinds: KINDS.map((k) => ({
      id: k.id,
      title: k.title,
      blurb: k.blurb,
      when: k.when,
      palettes: k.palettes,
      pairings: k.pairings,
      families: k.families,
      pieces: k.pieces,
    })),
    families: FAMILIES.map((f) => ({
      id: f.id,
      name: f.name,
      mood: f.mood,
      radius: f.radius,
      button: f.button,
      density: f.density,
      shadow: f.shadow,
      pieces: f.pieces,
      rules: f.rules,
    })),
  },
  starts: STARTS,
  collections: COLLECTIONS.map((c) => ({ slug: c.slug, title: c.title, blurb: c.blurb, pieces: c.pieces })),
  themes: THEMES.map((t) => {
    const pair = THEME_PAIRS[t.id];
    if (!pair) throw new Error(`THEME_PAIRS missing ${t.id}`);
    return {
      id: t.id,
      name: t.name,
      mood: t.mood,
      bestFor: t.bestFor,
      tags: t.tags,
      mode: pair.mode,
      pair: pair.pair,
      display: t.display,
      text: t.text,
      radius: t.radius,
      tokens: t.tokens,
      css: themeCss(t),
    };
  }),
  pairings: PAIRINGS.map((p) => ({
    id: p.id,
    name: p.name,
    mood: p.mood,
    bestFor: p.bestFor,
    tags: p.tags,
    display: p.display.family,
    text: p.text.family,
    mono: p.mono?.family ?? '',
    numbers: p.numbers ?? 'mono',
    caution: p.caution ?? '',
    css: pairingCss(p),
  })),
  scales: SCALES,
  motion: {
    css: tokensCss(),
    easings: EASINGS,
    durations: DURATIONS,
    recipes: RECIPES,
  },
  pieces: pieces.map((p, i) => ({
    id: p.id,
    n: String(i + 1).padStart(3, '0'),
    title: p.data.title,
    summary: p.data.summary,
    platform: p.data.platform,
    type: p.data.type,
    category: p.data.category,
    tags: p.data.tags,
    styles: p.data.styles,
    motion: p.data.motion,
    difficulty: p.data.difficulty,
    featured: p.data.featured,
    published: p.data.published,
    brief: `briefs/${p.id}.md`,
    demo: `${lounge}/demo/${p.id}.html`,
    source: sourceOf.get(p.id)?.source.id ?? '',
  })),
};

fs.writeFileSync(
  path.join(skillLib, 'sources.json'),
  JSON.stringify({
    note: 'One product, one source. Do not blend two. Do not copy the palette. A locked Lounge theme still wins. New lines in websites.txt appear here after the next sync.',
    sources: index.sources,
  }, null, 2),
);

fs.writeFileSync(path.join(skillLib, 'index.json'), JSON.stringify(index));

// Small files an agent reads one at a time, so a build never loads the whole catalogue.
for (const dir of ['starts', 'themes', 'pairings']) {
  fs.rmSync(path.join(skillLib, dir), { recursive: true, force: true });
  fs.mkdirSync(path.join(skillLib, dir), { recursive: true });
}
for (const s of STARTS) fs.writeFileSync(path.join(skillLib, 'starts', `${s.id}.json`), JSON.stringify(s, null, 1));
for (const t of index.themes) {
  const head = `/* ${t.name} · ${t.mode}${t.pair ? ` · pair: ${t.pair}` : ' · no pair'}\n   ${t.mood}\n   Best for: ${(t.bestFor || []).join(', ')} */\n`;
  const colourOnly = t.css
    .split('\n')
    .filter((line) => !/--(font-(display|text|mono)|radius|shadow)\s*:/.test(line))
    .map((line) => line.replace(/\s*font-family:\s*var\(--font-[a-z]+\);?/g, ''))
    .filter((line) => !/^\s*(h1, h2, h3, \.display|body)\s*\{\s*\}\s*$/.test(line))
    .join('\n');
  fs.writeFileSync(path.join(skillLib, 'themes', `${t.id}.css`), head + '/* Colour only. Fonts come from the locked pairing file. Radius and shadow come from the locked family. */\n' + colourOnly + '\n');
}
for (const p of index.pairings) {
  const head = `/* ${p.name} · display ${p.display} · text ${p.text}${p.mono ? ` · mono ${p.mono}` : ' · no mono'} · numbers ${p.numbers}\n   ${p.mood}${p.caution ? `\n   Caution: ${p.caution}` : ''} */\n`;
  fs.writeFileSync(path.join(skillLib, 'pairings', `${p.id}.css`), head + p.css + '\n');
}
// The same system as plain numbers, for React Native, Flutter, SwiftUI, and Compose.
for (const t of index.themes) {
  fs.writeFileSync(path.join(skillLib, 'themes', `${t.id}.json`), JSON.stringify({ id: t.id, name: t.name, mode: t.mode, pair: t.pair, colors: t.tokens }, null, 1));
}
const face = (f) => f && ({ family: f.family, weight: f.weight, italic: Boolean(f.italic), upper: Boolean(f.upper), trackingEm: parseFloat(f.tracking ?? '0') || 0, google: f.spec ?? null });
for (const p of PAIRINGS) {
  fs.writeFileSync(path.join(skillLib, 'pairings', `${p.id}.json`), JSON.stringify({
    id: p.id, name: p.name, display: { ...face(p.display), lineHeight: 1 }, text: { ...face(p.text), lineHeight: 1.55 },
    mono: face(p.mono) ?? null, numbers: p.mono ? (p.numbers ?? 'mono') : 'text', caution: p.caution ?? '',
  }, null, 1));
}
const bezier = (css) => (css.match(/cubic-bezier\(([^)]+)\)/)?.[1].split(',').map(Number)) ?? null;
fs.writeFileSync(path.join(skillLib, 'app.json'), JSON.stringify({
  readme: 'Numbers for native apps. CSS px = iOS pt = Android dp = Flutter logical px. Pair this with themes/<id>.json and pairings/<id>.json. See native.md.',
  families: FAMILIES.map((f) => ({ id: f.id, radius: parseFloat(f.radius) || 0, button: f.button, density: f.density, shadow: f.shadow, rules: f.rules })),
  density: {
    air: { pagePadding: 20, stackGap: 24, cardPadding: 20, controlHeight: 48 },
    regular: { pagePadding: 20, stackGap: 16, cardPadding: 16, controlHeight: 44 },
    dense: { pagePadding: 16, stackGap: 12, cardPadding: 12, controlHeight: 44 },
  },
  type: { body: 17, label: 12, caption: 13, title: 22, display: 34, lineHeightBody: 1.5, note: 'Phone sizes. Display is one per screen. Sizes scale with the user text size setting.' },
  touchTarget: { ios: 44, android: 48 },
  motion: {
    durations: Object.fromEntries(DURATIONS.map((d) => [d.id, d.ms])),
    easings: Object.fromEntries(EASINGS.map((e) => [e.id, bezier(e.css)]).filter(([, v]) => v)),
  },
}, null, 1));

const brief = (o, keys) => Object.fromEntries(keys.map((k) => [k, o[k]]));
fs.writeFileSync(
  path.join(skillLib, 'map.json'),
  JSON.stringify({
    name: index.name,
    site: index.site,
    credit,
    license: index.license,
    readme: 'Read this first. Then open only what you lock: starts/<id>.json for the recipe, themes/<id>.css, pairings/<id>.css, and briefs/<id>.md for each piece. Search pieces.txt for pieces. Do not read index.json; it is the whole catalogue for tools.',
    counts: index.counts,
    kinds: index.kit.kinds,
    families: index.kit.families,
    starts: STARTS.map((s) => ({ id: s.id, surface: s.surface, title: s.title, when: s.when, directions: s.directions.map((d) => `${d.id}: ${d.mood}`) })),
    themes: index.themes.map((t) => brief(t, ['id', 'name', 'mood', 'bestFor', 'mode', 'pair'])),
    pairings: index.pairings.map((p) => brief(p, ['id', 'name', 'mood', 'bestFor', 'mono', 'numbers', 'caution'])),
    scales: SCALES,
    motion: { css: tokensCss(), durations: DURATIONS },
  }),
);
fs.writeFileSync(
  path.join(skillLib, 'pieces.txt'),
  `# Design Lounge pieces · id | platform | category | title | tags\n# Spec: briefs/<id>.md · Live demo: ${lounge}/demo/<id>.html\n# Search this file. Do not read it top to bottom.\n` +
    index.pieces.map((p) => [p.id, p.platform, p.category, p.title, (p.tags || []).join(' ')].join(' | ')).join('\n') + '\n',
);
fs.writeFileSync(
  path.join(skillLib, 'icons.json'),
  JSON.stringify({
    credit: ICON_CREDIT,
    stroke: 1.75,
    size: 24,
    groups: ICON_GROUPS,
    icons: ICONS.map((icon) => ({ id: icon.id, name: icon.name, group: icon.group, svg: iconSvg(icon) })),
  }),
);

const bytes = (dir) =>
  fs.readdirSync(dir, { recursive: true }).reduce((sum, name) => {
    const file = path.join(dir, name);
    return sum + (fs.statSync(file).isFile() ? fs.statSync(file).size : 0);
  }, 0);

console.log(`skill library: ${pieces.length} briefs, ${THEMES.length} themes, ${(bytes(skillLib) / 1024 / 1024).toFixed(1)} MB`);
