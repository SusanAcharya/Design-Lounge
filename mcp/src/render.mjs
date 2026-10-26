// Open the page in Chromium at the frame sizes from Look in practice.md, with reduced motion on, and measure what a
// screenshot can hide: sideways scroll, faces in use, label count, the primary buttons, tap targets, contrast.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const FRAMES = { web: { width: 1280, height: 800 }, phone: { width: 390, height: 844 } };

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml', '.mp4': 'video/mp4', '.webm': 'video/webm', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm' };

/** Serve a folder on 127.0.0.1, the way a static host would: / is index.html, /about is about.html or about/index.html. */
function serve(root) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(root, url);
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    const tries = [file, path.join(file, 'index.html'), `${file}.html`];
    file = tries.find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
    if (!file) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}` })));
}

async function chromium() {
  try { return (await import('playwright')).chromium; } catch { return null; }
}

/** In the page: everything Look measures, for one frame. Runs in the browser, so it cannot use anything from this file. */
function measure(frame) {
  const vw = innerWidth, vh = innerHeight;
  const doc = document.documentElement;
  const visible = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0.05 && r.width > 0 && r.height > 0; };
  const inFirst = (r) => r.top < vh && r.bottom > 0;
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(/[,/ ]+/).filter(Boolean).map(Number); return { r, g, b, a }; };
  const sat = ({ r, g, b }) => { const mx = Math.max(r, g, b) / 255, mn = Math.min(r, g, b) / 255; return mx === 0 ? 0 : (mx - mn) / mx; };
  const near = (a, b) => a && b && Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) < 24;

  const faces = {};
  let firstChars = 0, smallChars = 0;
  const labels = [], display = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode.textContent.replace(/\s+/g, ' ').trim();
    if (!t) continue;
    const el = walker.currentNode.parentElement;
    if (!el || seen.has(el) || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName) || !visible(el)) continue;
    seen.add(el);
    const s = getComputedStyle(el);
    const fam = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    faces[fam] = (faces[fam] || 0) + t.length;
    const r = el.getBoundingClientRect();
    const size = parseFloat(s.fontSize);
    if (inFirst(r)) {
      firstChars += t.length;
      if (size <= 13) smallChars += t.length;
      const tracked = s.textTransform === 'uppercase' || parseFloat(s.letterSpacing) / size >= 0.06;
      if (tracked && size <= 14 && t.length <= 40 && !el.closest('nav, button, a[class*="btn"], [role="button"]')) labels.push(t);
      if (size >= 48 && !display.some((d) => d.el.contains(el) || el.contains(d.el))) display.push({ el, t: t.slice(0, 60), size });
    }
  }

  const bodyBg = parse(getComputedStyle(document.body).backgroundColor);
  const pageBg = bodyBg && bodyBg.a > 0 ? bodyBg : parse(getComputedStyle(doc).backgroundColor);
  const primaryVar = getComputedStyle(doc).getPropertyValue('--primary').trim();
  let primaryRgb = null;
  if (primaryVar) { const probe = document.createElement('i'); probe.style.color = primaryVar; document.body.appendChild(probe); primaryRgb = parse(getComputedStyle(probe).color); probe.remove(); }
  const controls = [...document.querySelectorAll('a, button, [role="button"], input[type="submit"]')].filter(visible);
  const filled = controls.filter((el) => {
    const r = el.getBoundingClientRect();
    if (!inFirst(r) || r.height < 28 || r.width < 60) return false;
    const bg = parse(getComputedStyle(el).backgroundColor);
    if (!bg || bg.a < 0.6 || near(bg, pageBg)) return false;
    return primaryRgb ? near(bg, primaryRgb) : sat(bg) > 0.3 || (bg.r + bg.g + bg.b) / 3 < 60;
  }).map((el) => (el.innerText || el.value || '').trim().slice(0, 40));

  const small = frame === 'phone' ? controls.filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.height >= 44 && r.width >= 44) return false;
    if (r.right <= 0 || r.left >= vw || r.bottom <= 0) return false; // parked off screen, like a skip link before focus
    if (el.closest('p, li p, figcaption') && el.tagName === 'A') return false; // inline links in a sentence
    return r.height < 44;
  }).map((el) => `${(el.innerText || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30)} (${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)})`) : [];

  const h1 = document.querySelector('h1');
  let h1Lines = null;
  if (h1 && visible(h1)) { const s = getComputedStyle(h1); const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.15; h1Lines = Math.round(h1.getBoundingClientRect().height / lh); }

  const pictures = [...document.querySelectorAll('img, svg, canvas, video, picture, iframe, [style*="background-image"]')].filter((el) => {
    if (!visible(el)) return false;
    const r = el.getBoundingClientRect();
    return inFirst(r) && r.width * r.height >= vw * vh * 0.06;
  }).length;
  const paras = [...document.querySelectorAll('p')].filter((p) => visible(p) && p.innerText.trim().length >= 60).map((p) => parseFloat(getComputedStyle(p).fontSize)).sort((a, b) => a - b);
  const words = (document.body.innerText.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;

  return {
    frame, vw, vh,
    overflow: doc.scrollWidth > doc.clientWidth + 1 ? doc.scrollWidth - doc.clientWidth : 0,
    faces: Object.entries(faces).sort((a, b) => b[1] - a[1]).map(([f, n]) => ({ family: f, chars: n })),
    labels, display: display.map((d) => `${d.t} (${Math.round(d.size)}px)`),
    filled, small: small.slice(0, 8), smallCount: small.length,
    smallRatio: firstChars ? smallChars / firstChars : 0,
    h1Lines, pictures, bodySize: paras.length ? paras[Math.floor(paras.length / 2)] : null,
    words, height: doc.scrollHeight,
  };
}

export async function renderChecks(page, { outDir, runAxe = true } = {}) {
  const browserType = await chromium();
  if (!browserType) return { skipped: 'Playwright is not installed. Run `npm i -D playwright && npx playwright install chromium` to turn on the rendered checks.' };
  let target, tmp, local;
  if (page.kind === 'url') target = page.url;
  else {
    let root = page.dir, name = path.basename(page.file || 'index.html');
    if (page.kind === 'html') { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-lounge-')); fs.writeFileSync(path.join(tmp, 'index.html'), page.html); root = tmp; name = 'index.html'; }
    local = await serve(root);
    target = `${local.origin}/${name === 'index.html' ? '' : encodeURIComponent(name)}`;
  }

  const dir = outDir || path.join(os.tmpdir(), 'design-lounge', `${(page.label || 'page').replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').slice(0, 60)}-${Date.now().toString(36)}`);
  fs.mkdirSync(dir, { recursive: true });
  let browser;
  try { browser = await browserType.launch(); } catch (e) {
    local?.server.close();
    const missing = /Executable doesn't exist|install/i.test(String(e.message));
    return { skipped: missing ? 'Chromium is not installed yet. Ask the person, then call install_browser (about 100 MB, once) and review again.' : `Chromium did not start (${String(e.message).split('\n')[0]}).` };
  }
  const F = [];
  const add = (level, area, id, title, evidence, fix, ref) => F.push({ level, area, id, title, evidence: (evidence || []).filter(Boolean).slice(0, 4), fix, ref });
  const frames = {}, shots = [], images = [], errors = [];
  let axe = null;
  try {
    for (const [name, size] of Object.entries(FRAMES)) {
      const ctx = await browser.newContext({ viewport: size, reducedMotion: 'reduce', deviceScaleFactor: 1, isMobile: name === 'phone', hasTouch: name === 'phone' });
      const tab = await ctx.newPage();
      tab.on('pageerror', (e) => errors.push(`${name}: ${String(e.message).split('\n')[0]}`));
      tab.on('console', (m) => { if (m.type() === 'error' && !/^Failed to load resource/.test(m.text())) errors.push(`${name}: ${m.text().slice(0, 160)}`); });
      tab.on('response', (r) => { if (r.status() >= 400) errors.push(`${name}: ${r.status()} ${r.url().replace(/^http:\/\/127\.0\.0\.1:\d+/, '')}`); });
      tab.on('requestfailed', (r) => { if (!/favicon/.test(r.url())) errors.push(`${name}: ${r.failure()?.errorText || 'failed'} ${r.url().replace(/^http:\/\/127\.0\.0\.1:\d+/, '')}`); });
      try { await tab.goto(target, { waitUntil: 'load', timeout: 30000 }); } catch (e) { errors.push(`${name}: ${String(e.message).split('\n')[0]}`); }
      await tab.evaluate(() => document.fonts?.ready).catch(() => {});
      await tab.waitForTimeout(700);
      frames[name] = await tab.evaluate(measure, name);
      const file = path.join(dir, `${name}-${size.width}x${size.height}.png`);
      await tab.screenshot({ path: file });
      shots.push(file);
      // A small JPEG of the same frame goes back inline, so the agent sees the page without opening a file.
      images.push({ frame: name, data: await tab.screenshot({ type: 'jpeg', quality: 70 }) });
      if (name === 'web') {
        const full = path.join(dir, `web-full-${size.width}.png`);
        await tab.screenshot({ path: full, fullPage: true, timeout: 15000 }).then(() => shots.push(full)).catch(() => {});
        if (runAxe) {
          try {
            await tab.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
            axe = await tab.evaluate(async () => {
              const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] }, resultTypes: ['violations'] });
              return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, count: v.nodes.length, targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }));
            });
          } catch (e) { axe = { error: String(e.message).split('\n')[0] }; }
        }
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    local?.server.close();
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  }

  const { web, phone } = frames;
  if (phone?.overflow) add('fail', 'render', 'overflow', `The phone page scrolls sideways by ${phone.overflow}px`, [], 'Find the wide element (often a marquee, a tilt, or a fixed width) and put overflow-x: clip on the page wrapper.', 'taste.md › Page shape');
  const faces = (web?.faces || []).filter((f) => f.chars >= 12);
  if (faces.length > 3) add('fail', 'render', 'faces', `${faces.length} faces render on the page`, faces.map((f) => `${f.family} (${f.chars} chars)`), 'Two faces, three with a mono. The rest fall back to the pairing.', 'practice.md › Look');
  if (web && web.labels.length > 3) add('fail', 'render', 'labels', `${web.labels.length} small tracked labels in the first screen`, web.labels, 'Three per view at most, the labels a piece draws included.', 'website.md › Size and contrast');
  if (web && web.smallRatio > 0.5) add('warn', 'render', 'small-text', `${Math.round(web.smallRatio * 100)}% of the first screen's text is 13px or smaller`, [], 'Body text 17 to 19px on a website. A page where half the text is tiny grey labels looks unfinished.', 'website.md › Size and contrast');
  if (web?.bodySize && web.bodySize < 16) add('warn', 'render', 'body-size', `Body text is ${web.bodySize}px`, [], 'Use 17 to 19px on a website, 15 to 16px in a dense app.', 'website.md › Size and contrast');
  if (web && web.filled.length > 1) add('warn', 'render', 'primaries', `${web.filled.length} filled primary-looking buttons in the first screen`, web.filled, 'One primary per view. The other becomes outline, same height.', 'SKILL.md › Rules');
  if (web && web.display.length > 1) add('warn', 'render', 'display', `${web.display.length} elements at display size in the first screen`, web.display, 'One answer at display size. Step the others down to a title.', 'practice.md › Look');
  if (web?.h1Lines > 3) add('warn', 'render', 'h1-lines', `The headline wraps to ${web.h1Lines} lines at 1280px`, [], 'Two or three lines. Widen its box up to 1100px and step the size down before you cut words.', 'taste.md › Page shape');
  if (web && web.pictures === 0) add('warn', 'render', 'no-picture', 'The first screen is type with no picture', [], 'On a website, the first screen shows the work: a drawn screen, the object, a photo slot. Not big type alone.', 'website.md › Show the work');
  if (phone?.smallCount) add('warn', 'render', 'tap-targets', `${phone.smallCount} controls under 44px tall on the phone`, phone.small, 'Buttons and nav links at least 44px on a phone.', 'practice.md › Look');
  if (errors.length) add('fail', 'render', 'console', `${errors.length} console errors`, [...new Set(errors)], 'Fix them. A page with console errors is not done.', 'practice.md › Finish checklist');
  if (Array.isArray(axe)) {
    const serious = axe.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    const contrast = axe.find((v) => v.id === 'color-contrast');
    if (contrast) add('fail', 'a11y', 'contrast', `Text below AA contrast (${contrast.count} elements)`, contrast.targets, 'Body text 4.5:1, large text 3:1. Use --ink or --ink-2 on --bg, never --ink-3 for a sentence.', 'website.md › Size and contrast');
    for (const v of serious.filter((x) => x.id !== 'color-contrast')) add('fail', 'a11y', `axe-${v.id}`, `${v.help} (${v.count})`, v.targets, `axe rule ${v.id}.`, null);
    for (const v of axe.filter((x) => x.impact === 'moderate' || x.impact === 'minor')) add('warn', 'a11y', `axe-${v.id}`, `${v.help} (${v.count})`, v.targets, `axe rule ${v.id}.`, null);
  }
  return { findings: F, frames, shots, images, dir, axe: Array.isArray(axe) ? axe.length : axe };
}
