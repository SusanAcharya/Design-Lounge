// Renders a poster image for every piece: public/thumbs/<slug>.jpg (native frame size, 1x) and
// public/og/<slug>.jpg (1200x630 social card). Run against a built site: BASE=http://localhost:4321 node scripts/thumbs.mjs
import { chromium } from 'playwright';
import { readdir, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const base = process.env.BASE || 'http://localhost:4321';
const only = process.argv[2];
const SIZES = { web: [1280, 800], 'mobile-web': [390, 844], 'mobile-app': [390, 844], pwa: [390, 844], tablet: [1180, 820] };

await mkdir(path.join(root, 'public/thumbs'), { recursive: true });
await mkdir(path.join(root, 'public/og'), { recursive: true });
const slugs = (await readdir(path.join(root, 'src/demos'))).filter((f) => f.endsWith('.html')).map((f) => f.replace(/\.html$/, '')).filter((s) => !only || s === only);
const browser = await chromium.launch();
let n = 0;
for (const slug of slugs) {
  const md = await readFile(path.join(root, 'src/content/pieces', slug + '.md'), 'utf8').catch(() => '');
  const platform = md.match(/^platform:\s*([a-z-]+)/m)?.[1] || 'web';
  const title = md.match(/^title:\s*"?(.*?)"?\s*$/m)?.[1] || slug;
  const [w, h] = SIZES[platform] || SIZES.web;
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  try {
    await page.goto(`${base}/demo/${slug}.html`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1400);
    await page.screenshot({ path: path.join(root, 'public/thumbs', slug + '.jpg'), type: 'jpeg', quality: 78 });
    // social card: the demo inside a paper frame with the title
    const shot = await page.screenshot({ type: 'jpeg', quality: 80 });
    const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    const isPhone = w < 600;
    await og.setContent(`<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
      <style>body{margin:0;width:1200px;height:630px;background:#f3efe6;font-family:Fraunces,serif;color:#171512;position:relative;overflow:hidden}
      .t{position:absolute;left:64px;top:64px;width:${isPhone ? 640 : 520}px}.k{font:500 14px JetBrains Mono,monospace;letter-spacing:.14em;text-transform:uppercase;color:#8c867b}
      h1{font-size:${title.length > 26 ? 56 : 68}px;line-height:.98;letter-spacing:-.02em;margin:18px 0 0;font-weight:400}
      .wm{position:absolute;left:64px;bottom:56px;font-size:28px;letter-spacing:-.02em}.wm i{font-style:italic}
      .f{position:absolute;right:${isPhone ? 96 : -40}px;top:${isPhone ? 70 : 110}px;width:${isPhone ? 300 : 720}px;border-radius:${isPhone ? 44 : 12}px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,.35);border:${isPhone ? 10 : 1}px solid #111;background:#111}
      .f img{display:block;width:100%}</style></head><body>
      <div class="t"><div class="k">Design Lounge · ${platform}</div><h1>${title.replace(/</g, '&lt;')}</h1></div>
      <div class="f"><img src="data:image/jpeg;base64,${shot.toString('base64')}"></div>
      <div class="wm">Design <i>Lounge</i></div></body></html>`, { waitUntil: 'networkidle' });
    await og.waitForTimeout(600);
    await og.screenshot({ path: path.join(root, 'public/og', slug + '.jpg'), type: 'jpeg', quality: 82 });
    await og.close();
    n++;
    process.stdout.write(`${slug} `);
  } catch (e) {
    console.log(`\n! ${slug}: ${e.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}
await browser.close();
console.log(`\n${n} thumbnails written`);
