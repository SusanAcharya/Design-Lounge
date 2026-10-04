#!/usr/bin/env node
/** Print where the installed Design Lounge library is. Agents run this before designing. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skillDir = path.dirname(fileURLToPath(import.meta.url));
const lounge = JSON.parse(fs.readFileSync(path.join(skillDir, 'lounge.json'), 'utf8'));
const indexPath = path.join(skillDir, 'library', 'map.json');
const briefsDir = path.join(skillDir, 'library', 'briefs');

let counts = null;
let error = '';
if (!fs.existsSync(indexPath)) error = 'library/map.json is missing. Reinstall the skill.';
else {
  try {
    counts = JSON.parse(fs.readFileSync(indexPath, 'utf8')).counts ?? null;
    if (!fs.existsSync(briefsDir)) error = 'library/briefs is missing. Reinstall the skill.';
  } catch (err) {
    error = err instanceof Error ? err.message : 'map.json could not be read';
  }
}

const ok = !error;
const out = {
  mode: 'installed',
  ok,
  error,
  skillDir,
  map: ok ? indexPath : '',
  pieces: ok ? path.join(skillDir, 'library', 'pieces.txt') : '',
  briefs: ok ? briefsDir : '',
  icons: ok ? path.join(skillDir, 'library', 'icons.json') : '',
  counts,
  repo: lounge.repo,
  lounge: lounge.lounge || '',
  author: lounge.author,
  credit: lounge.credit,
  next: ok ? ['library/map.json', 'library/starts/<id>.json', 'library/themes/<id>.css', 'library/pairings/<id>.css', 'search library/pieces.txt', 'library/briefs/<id>.md'] : [],
};
console.log(JSON.stringify(out, null, 2));
process.exit(ok ? 0 : 1);
