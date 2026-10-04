// Copies one-prompt builds from design-examples/ (git-ignored workspace) into public/built/,
// rewrites relative asset links to absolute ones, and shoots desktop + phone covers.
// Usage: pnpm examples [id ...]
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const src = join(root, 'design-examples');
const dest = join(root, 'public', 'built');
const SKIP = /^(_|\.)/;

const { EXAMPLES } = await import(join(root, 'src/data/examples.ts')).catch(async () => {
  const txt = readFileSync(join(root, 'src/data/examples.ts'), 'utf8');
  const pairs = [...txt.matchAll(/id:\s*'([^']+)',\s*slug:\s*'([^']+)'/g)];
  return { EXAMPLES: pairs.map((m) => ({ id: m[1], slug: m[2] })) };
});
const wanted = process.argv.slice(2);
const list = EXAMPLES.filter((e) => !wanted.length || wanted.includes(e.id) || wanted.includes(e.slug));

for (const { id, slug } of list) {
  const from = join(src, slug);
  if (!existsSync(join(from, 'index.html'))) { console.log(`skip ${slug}: no build in design-examples/`); continue; }
  const to = join(dest, id);
  rmSync(to, { recursive: true, force: true });
  mkdirSync(to, { recursive: true });
  for (const f of readdirSync(from)) {
    if (SKIP.test(f)) continue;
    cpSync(join(from, f), join(to, f), { recursive: true });
  }
  const html = readFileSync(join(to, 'index.html'), 'utf8').replace(
    /\b(href|src)="(?![a-z][a-z0-9+.-]*:|\/|#|\?)([^"]+)"/gi,
    (_, attr, url) => `${attr}="/built/${id}/${url.replace(/^\.\//, '')}"`,
  );
  writeFileSync(join(to, 'index.html'), html);
  console.log(`copied ${slug} -> /built/${id}/`);
}

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.md': 'text/plain', '.json': 'application/json', '.woff2': 'font/woff2' };
const pub = join(root, 'public');
const server = createServer((req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  let file = join(pub, p);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!file.startsWith(pub) || !existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const shots = [
  { name: 'cover.jpg', width: 1280, height: 800, mobile: false },
  { name: 'phone.jpg', width: 390, height: 844, mobile: true },
];
for (const { id } of list) {
  if (!existsSync(join(dest, id, 'index.html'))) continue;
  for (const s of shots) {
    const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: s.mobile ? 2 : 1.5, isMobile: s.mobile, hasTouch: s.mobile });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('requestfailed', (r) => { if (r.url().startsWith(base)) errors.push('404 ' + r.url()); });
    await page.goto(`${base}/built/${id}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3200);
    await page.screenshot({ path: join(dest, id, s.name), type: 'jpeg', quality: 78 });
    if (errors.length) console.log(`  ${id} ${s.name}: ${errors.join(' | ')}`);
    await ctx.close();
  }
  console.log(`shot ${id}`);
}
await browser.close();
server.close();
