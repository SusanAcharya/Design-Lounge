// Screenshot helper: node scripts/shot.mjs <url-path> <out.png> [width] [height] [fullPage] [theme]
import { chromium } from 'playwright';
const [, , path = '/', out = 'shot.png', w = '1440', h = '900', full = 'false', theme = ''] = process.argv;
const base = process.env.BASE || 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
if (theme) await page.addInitScript((t) => { try { if (window === window.top) localStorage.setItem('dl-theme', t); } catch {} }, theme);
await page.goto(base + path, { waitUntil: 'networkidle' });
if (full === 'true') {
  // scroll through so lazy frames load, then back to top
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
  await page.waitForTimeout(2500);
} else {
  await page.waitForTimeout(1800);
}
await page.screenshot({ path: out, fullPage: full === 'true' });
if (errors.length) console.log(errors.join('\n'));
console.log('saved', out);
await browser.close();
