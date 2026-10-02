#!/usr/bin/env node
/** Print where the installed Design Lounge library is. Agents run this before designing. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skillDir = path.dirname(fileURLToPath(import.meta.url));
const lounge = JSON.parse(fs.readFileSync(path.join(skillDir, 'lounge.json'), 'utf8'));
const indexPath = path.join(skillDir, 'library', 'index.json');
const briefsDir = path.join(skillDir, 'library', 'briefs');

let counts = null;
let error = '';
if (!fs.existsSync(indexPath)) error = 'library/index.json is missing. Reinstall the skill.';
else {
  try {
    counts = JSON.parse(fs.readFileSync(indexPath, 'utf8')).counts ?? null;
    if (!fs.existsSync(briefsDir)) error = 'library/briefs is missing. Reinstall the skill.';
  } catch (err) {
    error = err instanceof Error ? err.message : 'index.json could not be read';
  }
}

const ok = !error;
const out = {
  mode: 'installed',
  ok,
  error,
  skillDir,
  index: ok ? indexPath : '',
  briefs: ok ? briefsDir : '',
  icons: ok ? path.join(skillDir, 'library', 'icons.json') : '',
  counts,
  repo: lounge.repo,
  author: lounge.author,
  credit: lounge.credit,
  next: ok ? ['library/index.json', 'library/briefs/<id>.md', 'library/icons.json'] : [],
};
console.log(JSON.stringify(out, null, 2));
process.exit(ok ? 0 : 1);
