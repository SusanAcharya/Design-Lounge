#!/usr/bin/env node
/** Print where Design Lounge can be read from. Agents run this before designing. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skillDir = path.dirname(fileURLToPath(import.meta.url));
const lounge = JSON.parse(fs.readFileSync(path.join(skillDir, 'lounge.json'), 'utf8'));
const base = String(lounge.base || '').replace(/\/$/, '');

function findRepo(start) {
  let dir = path.resolve(start);
  for (let i = 0; i < 8; i++) {
    const themes = path.join(dir, 'src/data/themes.ts');
    const pieces = path.join(dir, 'src/content/pieces');
    if (fs.existsSync(themes) && fs.existsSync(pieces)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const repo = findRepo(process.cwd()) || findRepo(skillDir);

let ok = false;
let error = '';
if (base) {
  try {
    const res = await fetch(`${base}/llms.txt`, { signal: AbortSignal.timeout(5000) });
    const text = res.ok ? await res.text() : '';
    ok = res.ok && text.includes('Design Lounge');
    if (!ok) error = `HTTP ${res.status}`;
  } catch (err) {
    error = err instanceof Error ? err.message : 'unreachable';
  }
} else {
  error = 'lounge.json has no base';
}

const mode = repo ? 'local' : 'remote';
const out = {
  mode,
  base,
  ok,
  error: ok ? '' : error,
  repo: repo || '',
  author: lounge.author,
  credit: lounge.credit,
  next: ok
    ? [`${base}/llms.txt`, `${base}/api/pieces.json`]
    : repo
      ? ['src/data/kit.ts', 'src/data/themes.ts', 'src/data/type.ts', 'src/content/pieces/<id>.md']
      : [],
};
console.log(JSON.stringify(out, null, 2));
process.exit(ok || repo ? 0 : 1);
