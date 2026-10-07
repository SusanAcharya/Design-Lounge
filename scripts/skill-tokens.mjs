#!/usr/bin/env node
// Token load of the skill's three reading paths, counted with o200k_base on the raw file text.
//   Kit  = SKILL + brief + practice + reference + website, map.json, taste.md "Page shape" and "Craft",
//          the median starts file, two median themes, the median pairing
//   Show = Kit + show.md
//   App  = SKILL + brief + map.json + practice + reference + the same starts/themes/pairing + app.md + flows.md
//          + native.md "Looking at the app"
// Run: node scripts/skill-tokens.mjs [--json]
import fs from 'node:fs';
import path from 'node:path';
import { getEncoding } from 'js-tiktoken';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const skill = path.join(root, 'skills/design-lounge');
const lib = path.join(skill, 'library');
const enc = getEncoding('o200k_base');
const read = (p) => fs.readFileSync(p, 'utf8');
const count = (text) => enc.encode(text).length;
const md = (name) => read(path.join(skill, name));

/** A markdown section: from its `^##+ <name>` heading to the next line that starts with `## `. */
function section(text, name) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => new RegExp(`^##+ ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`).test(l));
  if (start < 0) throw new Error(`section "${name}" not found`);
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end < 0) end = lines.length;
  return lines.slice(start, end).join('\n');
}

/** The median file of a directory, by token count: sorted[len/2]. */
function median(dir, ext) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(ext)).map((f) => path.join(dir, f));
  const sized = files.map((f) => ({ f, n: count(read(f)) })).sort((a, b) => a.n - b.n);
  return sized[Math.floor(sized.length / 2)].f;
}

const starts = read(median(path.join(lib, 'starts'), '.json'));
const theme = read(median(path.join(lib, 'themes'), '.css'));
const pairing = read(median(path.join(lib, 'pairings'), '.css'));
const map = read(path.join(lib, 'map.json'));

const core = { 'SKILL.md': md('SKILL.md'), 'brief.md': md('brief.md'), 'practice.md': md('practice.md'), 'reference.md': md('reference.md') };
const locked = { 'map.json': map, 'starts (median)': starts, 'themes (2 × median)': theme + theme, 'pairings (median)': pairing };

const kit = { ...core, 'website.md': md('website.md'), 'taste.md Page shape': section(md('taste.md'), 'Page shape'), 'taste.md Craft': section(md('taste.md'), 'Craft'), ...locked };
const show = { ...kit, 'show.md': md('show.md') };
const app = { ...core, ...locked, 'app.md': md('app.md'), 'flows.md': md('flows.md'), 'native.md Looking at the app': section(md('native.md'), 'Looking at the app') };

const total = (parts) => Object.values(parts).reduce((n, t) => n + count(t), 0);
const paths = { Kit: kit, Show: show, App: app };
const out = {};
for (const [name, parts] of Object.entries(paths)) {
  out[name] = { total: total(parts), parts: Object.fromEntries(Object.entries(parts).map(([k, t]) => [k, count(t)])) };
}
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 2));
else {
  for (const [name, r] of Object.entries(out)) console.log(`${name.padEnd(5)} ${r.total.toLocaleString('en-US')}`);
  if (process.argv.includes('--parts')) for (const [name, r] of Object.entries(out)) { console.log(`\n${name}`); for (const [k, n] of Object.entries(r.parts)) console.log(`  ${k.padEnd(30)} ${n.toLocaleString('en-US')}`); }
}
