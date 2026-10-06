// Runs before every build. Fails it when the site and the skill would disagree, or when a card would
// quietly lose its poster. Each of these used to fall back without an error, so a missing file never showed.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const at = (...p) => path.join(root, ...p);
const errors = [];

// The site lists every piece that has both a brief and a demo (see getPieces in src/lib/pieces.ts).
const slugsIn = (dir, ext) => readdirSync(at(dir)).filter((f) => f.endsWith(ext)).map((f) => f.slice(0, -ext.length));
const demos = new Set(slugsIn('src/demos', '.html'));
const site = slugsIn('src/content/pieces', '.md').filter((s) => demos.has(s)).sort();
const skill = JSON.parse(readFileSync(at('skills/design-lounge/library/index.json'), 'utf8')).pieces.map((p) => p.id).sort();

if (site.length !== skill.length) errors.push(`the site has ${site.length} pieces but skills/design-lounge/library/index.json lists ${skill.length}. Run pnpm skill:sync.`);
const onlySite = site.filter((s) => !skill.includes(s));
const onlySkill = skill.filter((s) => !site.includes(s));
if (onlySite.length) errors.push(`on the site but not in the skill: ${onlySite.join(', ')}`);
if (onlySkill.length) errors.push(`in the skill but not on the site (their /p/ and /demo/ pages would 404): ${onlySkill.join(', ')}`);

// Public numbers (Nº 001…) are fixed in src/data/numbers.json. A new piece takes the next free number; old ones never move.
const numbers = JSON.parse(readFileSync(at('src/data/numbers.json'), 'utf8'));
const top = Math.max(0, ...Object.values(numbers));
const unnumbered = site.filter((s) => !(s in numbers));
if (unnumbered.length) errors.push(`pieces with no number in src/data/numbers.json: ${unnumbered.map((s, i) => `"${s}": ${top + i + 1}`).join(', ')}`);
const seen = new Map();
for (const [s, n] of Object.entries(numbers)) {
  if (seen.has(n)) errors.push(`Nº ${n} is used by both ${seen.get(n)} and ${s} in src/data/numbers.json`);
  seen.set(n, s);
}
const skillNumbers = JSON.parse(readFileSync(at('skills/design-lounge/library/index.json'), 'utf8')).pieces;
const offNumbers = skillNumbers.filter((p) => p.id in numbers && Number(p.n) !== numbers[p.id]);
if (offNumbers.length) errors.push(`the skill numbers ${offNumbers.length} pieces differently from src/data/numbers.json (first: ${offNumbers[0].id}). Run pnpm skill:sync.`);

// scripts/posters.mjs records every piece it gave a zoomed card crop. Without the file, the card falls back to the full screen.
const cards = JSON.parse(readFileSync(at('public/thumbs/cards.json'), 'utf8'));
const missingCards = cards.filter((s) => !existsSync(at('public/thumbs', `${s}-card.webp`)));
if (missingCards.length) errors.push(`missing card posters in public/thumbs: ${missingCards.map((s) => `${s}-card.webp`).join(', ')}`);
// A piece whose own slug ends in -card has a full poster named like a crop; only <piece slug>-card.webp is a crop.
const strayCards = slugsIn('public/thumbs', '-card.webp').filter((s) => demos.has(s) && !cards.includes(s));
if (strayCards.length) errors.push(`card posters not listed in public/thumbs/cards.json: ${strayCards.join(', ')}`);

if (errors.length) {
  console.error('\nBuild check failed:\n' + errors.map((e) => `  ✗ ${e}`).join('\n') + '\n');
  process.exit(1);
}
console.log(`Build check: ${site.length} pieces on the site and in the skill, ${cards.length} card posters present.`);
