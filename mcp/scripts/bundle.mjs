#!/usr/bin/env node
// Copy the skill folder into the package as skill/, and the thumbnails and demos as assets/, so
// `npx design-lounge-mcp` carries the library, the method, and the pictures.
// The repo keeps one copy in skills/design-lounge; this runs before npm pack and publish.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const from = path.join(here, '..', '..', 'skills', 'design-lounge');
const to = path.join(here, '..', 'skill');
if (!fs.existsSync(path.join(from, 'library', 'map.json'))) {
  console.error(`No skill at ${from}. Run node --experimental-strip-types scripts/sync-skill.mjs in the repo first.`);
  process.exit(1);
}
fs.rmSync(to, { recursive: true, force: true });
fs.cpSync(from, to, { recursive: true, filter: (src) => !/install\.mjs$|resolve\.mjs$/.test(src) });
fs.copyFileSync(path.join(here, '..', '..', 'LICENSE'), path.join(to, 'LICENSE'));
const count = fs.readdirSync(path.join(to, 'library', 'briefs')).length;
console.log(`Bundled the skill into ${to}: ${count} briefs.`);

// Each piece's thumbnail (not the -card variant) and its demo, so get_piece can show and quote it offline.
const repo = path.join(here, '..', '..');
const assets = path.join(here, '..', 'assets');
fs.rmSync(assets, { recursive: true, force: true });
fs.mkdirSync(path.join(assets, 'thumbs'), { recursive: true });
let thumbs = 0;
for (const f of fs.readdirSync(path.join(repo, 'public', 'thumbs'))) {
  if (!f.endsWith('.webp') || f.endsWith('-card.webp')) continue;
  fs.copyFileSync(path.join(repo, 'public', 'thumbs', f), path.join(assets, 'thumbs', f));
  thumbs++;
}
fs.cpSync(path.join(repo, 'src', 'demos'), path.join(assets, 'demos'), { recursive: true });
console.log(`Bundled ${thumbs} thumbnails and ${fs.readdirSync(path.join(assets, 'demos')).length} demos into ${assets}.`);
