// Card posters for pieces that have none yet. Writes public/thumbs/<slug>.jpg.
// Run against a site that serves /demo: BASE=http://localhost:4330 node scripts/posters.mjs
// Then node scripts/webp.mjs, which turns the jpgs into webp.
import { chromium } from 'playwright';
import { readdir, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const base = process.env.BASE || 'http://localhost:4330';
const SIZES = { web: [1280, 800], 'mobile-web': [390, 844], 'mobile-app': [390, 844], pwa: [390, 844], tablet: [1180, 820] };
await mkdir(path.join(root, 'public/thumbs'), { recursive: true });
const slugs = (await readdir(path.join(root, 'src/demos')))
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace(/\.html$/, ''))
  .filter((s) => !existsSync(path.join(root, 'public/thumbs', s + '.webp')) && !existsSync(path.join(root, 'public/thumbs', s + '.jpg')));
console.log(slugs.length, 'posters to write');
const browser = await chromium.launch();
let n = 0;
const queue = [...slugs];
async function worker() {
  const page = await browser.newPage();
  while (queue.length) {
    const slug = queue.shift();
    const md = await readFile(path.join(root, 'src/content/pieces', slug + '.md'), 'utf8').catch(() => '');
    const platform = md.match(/^platform:\s*([a-z-]+)/m)?.[1] || 'web';
    const [w, h] = SIZES[platform] || SIZES.web;
    try {
      await page.setViewportSize({ width: w, height: h });
      await page.goto(`${base}/demo/${slug}.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(root, 'public/thumbs', slug + '.jpg'), type: 'jpeg', quality: 72 });
      n++;
      if (n % 20 === 0) console.log(n, '/', slugs.length);
    } catch (e) {
      console.log('!', slug, e.message.split('\n')[0]);
    }
  }
  await page.close();
}
await Promise.all(Array.from({ length: 4 }, worker));
await browser.close();
console.log('wrote', n, 'posters');
