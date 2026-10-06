// Writes public/og/home.jpg from the current piece count. Run: node scripts/og-home.mjs
import { chromium } from 'playwright';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const slugs = (await readdir(path.join(root, 'src/content/pieces'))).filter((f) => f.endsWith('.md'));
const count = slugs.length;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(`<!doctype html>
<html><head>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;1,6..72,480&family=Geist:wght@500&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; background: #fafaf9; color: #18181b; }
  body { display: flex; flex-direction: column; justify-content: flex-end; padding: 72px 80px; box-sizing: border-box; }
  .k { margin: 0 0 18px; font: 500 15px/1 Geist, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #d4541a; }
  h1 { margin: 0; max-width: 16ch; font: 500 84px/0.96 Newsreader, Georgia, serif; letter-spacing: -.035em; }
  h1 i { font-style: italic; }
  p { margin: 28px 0 0; font: 500 22px/1 Geist, sans-serif; color: #5e5e66; }
</style></head>
<body>
  <p class="k">Design Lounge</p>
  <h1>Give your AI agent <i>design taste.</i></h1>
  <p>${count} design ideas</p>
</body></html>`, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(root, 'public/og/home.jpg'), type: 'jpeg', quality: 86 });
await browser.close();
console.log('wrote public/og/home.jpg', count);
