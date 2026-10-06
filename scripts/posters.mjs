// Card posters, written straight to WebP. Run against a site that serves /demo:
//   BASE=http://localhost:4330 node scripts/posters.mjs          (only pieces without a poster)
//   ALL=1 BASE=http://localhost:4330 node scripts/posters.mjs    (every piece)
// <slug>.webp is the whole screen at its own aspect, 640px wide (phones 390), used by cards and device frames.
// When a piece fills under a quarter of the screen, <slug>-card.webp is a 640x480 crop around it for the card.
import { chromium } from 'playwright';
import { readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const thumbs = path.join(root, 'public/thumbs');
const base = process.env.BASE || 'http://localhost:4330';
const all = process.env.ALL === '1';
const only = process.env.ONLY ? new Set(process.env.ONLY.split(',')) : null;
const PHONE = new Set(['mobile-web', 'mobile-app', 'pwa']);
const SIZES = { web: [1280, 800], 'mobile-web': [390, 844], 'mobile-app': [390, 844], pwa: [390, 844], tablet: [1180, 820] };
const SPARSE = 0.25;

const slugs = (await readdir(path.join(root, 'src/demos')))
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace(/\.html$/, ''))
  .filter((s) => (only ? only.has(s) : all || !existsSync(path.join(thumbs, s + '.webp'))));
console.log(slugs.length, 'posters to write');

const browser = await chromium.launch();
const encoder = await browser.newPage();
await encoder.setContent('<canvas></canvas>');
// Encodes the full screen at ow wide, and measures where the ink is: pixels that differ from the
// top-left background colour. If the ink covers under SPARSE of the screen, also encodes a 4:3 crop around it.
const encode = (png, ow, crop) => encoder.evaluate(async ({ data, ow, crop, SPARSE }) => {
  const img = new Image();
  img.src = `data:image/png;base64,${data}`;
  await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.querySelector('canvas');
  const g = c.getContext('2d', { willReadFrequently: true });
  c.width = W; c.height = H;
  g.drawImage(img, 0, 0);
  const px = g.getImageData(0, 0, W, H).data;
  const [br, bg, bb] = px;
  let x1 = W, y1 = H, x2 = 0, y2 = 0;
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
    const i = (y * W + x) * 4;
    if (Math.abs(px[i] - br) + Math.abs(px[i + 1] - bg) + Math.abs(px[i + 2] - bb) > 24) {
      if (x < x1) x1 = x; if (x > x2) x2 = x; if (y < y1) y1 = y; if (y > y2) y2 = y;
    }
  }
  const out = (sx, sy, sw, sh, w, h) => {
    c.width = w; c.height = h;
    g.imageSmoothingQuality = 'high';
    g.fillStyle = `rgb(${br},${bg},${bb})`;
    g.fillRect(0, 0, w, h);
    const k = w / sw, ix = Math.max(0, sx), iy = Math.max(0, sy);
    const iw = Math.min(W, sx + sw) - ix, ih = Math.min(H, sy + sh) - iy;
    g.drawImage(img, ix, iy, iw, ih, (ix - sx) * k, (iy - sy) * k, iw * k, ih * k);
    return c.toDataURL('image/webp', 0.82).split(',')[1];
  };
  const full = out(0, 0, W, H, ow, Math.round(ow * H / W));
  const share = x2 > x1 ? ((x2 - x1) * (y2 - y1)) / (W * H) : 1;
  if (!crop || share >= SPARSE) return { full, card: null, share };
  const pad = W * 0.04;
  let w = Math.max(x2 - x1 + pad * 2, W * 0.32), h = Math.max(y2 - y1 + pad * 2, W * 0.24);
  if (w / h > 4 / 3) h = w * 3 / 4; else w = h * 4 / 3;
  return { full, card: out((x1 + x2) / 2 - w / 2, (y1 + y2) / 2 - h / 2, w, h, 640, 480), share };
}, { data: png.toString('base64'), ow, crop, SPARSE });

let n = 0;
const sparse = [];
const queue = [...slugs];
async function worker() {
  const ctx = await browser.newContext({ deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  while (queue.length) {
    const slug = queue.shift();
    const md = await readFile(path.join(root, 'src/content/pieces', slug + '.md'), 'utf8').catch(() => '');
    const platform = md.match(/^platform:\s*([a-z-]+)/m)?.[1] || 'web';
    const [vw, vh] = SIZES[platform] || SIZES.web;
    try {
      await page.setViewportSize({ width: vw, height: vh });
      await page.goto(`${base}/demo/${slug}.html`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(1400);
      await page.evaluate(() => document.querySelector('lounge-signature')?.remove());
      const phone = PHONE.has(platform);
      const r = await encode(await page.screenshot({ type: 'png' }), phone ? 390 : 640, !phone);
      await writeFile(path.join(thumbs, slug + '.webp'), Buffer.from(r.full, 'base64'));
      const card = path.join(thumbs, slug + '-card.webp');
      if (r.card) {
        await writeFile(card, Buffer.from(r.card, 'base64'));
        sparse.push(slug);
      } else if (existsSync(card)) await unlink(card);
      if (existsSync(path.join(thumbs, slug + '.jpg'))) await unlink(path.join(thumbs, slug + '.jpg'));
      n++;
      if (n % 40 === 0) console.log(n, '/', slugs.length);
    } catch (e) {
      console.log('!', slug, e.message.split('\n')[0]);
    }
  }
  await ctx.close();
}
await Promise.all(Array.from({ length: 4 }, worker));
await browser.close();
console.log('wrote', n, 'posters,', sparse.length, 'with a zoomed card crop');
console.log(sparse.join(' '));
