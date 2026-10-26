// Pictures and demo code for pieces: the bundled copy, then the repo, then the live site.
// The agent builds better from a piece it has seen than from a brief it has only read.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const roots = () => [
  process.env.DESIGN_LOUNGE_ASSETS,
  path.join(here, '..', 'assets'),
  path.join(here, '..', '..'), // the repo: public/thumbs and src/demos
].filter(Boolean);
const places = {
  thumb: (root, id) => [path.join(root, 'thumbs', `${id}.webp`), path.join(root, 'public', 'thumbs', `${id}.webp`)],
  demo: (root, id) => [path.join(root, 'demos', `${id}.html`), path.join(root, 'src', 'demos', `${id}.html`)],
};
const urls = { thumb: (site, id) => `${site}/thumbs/${id}.webp`, demo: (site, id) => `${site}/demo/${id}.html` };
const safe = (id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);

/** A piece's thumbnail (bytes) or demo (text). Returns null when no copy can be found or fetched. */
export async function pieceAsset(kind, id, site) {
  if (!safe(id)) return null;
  for (const root of roots()) {
    for (const file of places[kind](root, id)) {
      if (fs.existsSync(file)) return kind === 'thumb' ? fs.readFileSync(file) : fs.readFileSync(file, 'utf8');
    }
  }
  try {
    const res = await fetch(urls[kind](site, id), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return kind === 'thumb' ? Buffer.from(await res.arrayBuffer()) : await res.text();
  } catch {
    return null;
  }
}

export const imageContent = (buf, mimeType) => ({ type: 'image', data: Buffer.from(buf).toString('base64'), mimeType });
