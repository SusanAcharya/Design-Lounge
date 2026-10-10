#!/usr/bin/env node
// Gates every demo in dist/ against three checks, in headless Chromium, with prefers-reduced-motion on:
//   phone390   at 390×844: the layout viewport stays 390 wide, no text runs off the sides, no column collapses
//   contrast   at 1280×800 and 390×844: axe color-contrast (AA), plus a pixel check behind text axe could not decide
//   uiLines    form controls keep 3:1 against their ground (border or fill)
// Known failures live in scripts/gates/ratchet.json, listed once from pieces n ≤ 531, and the lists only shrink.
//
//   node scripts/gates/demos.mjs --all
//   node scripts/gates/demos.mjs --changed origin/main
//   node scripts/gates/demos.mjs --ids a,b [--json out.json] [--write-ratchet] [--concurrency 6]
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright';
import { raises, raiseReason, messagesSince, headMessage, ratchetAt } from './ratchet-guard.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const at = (...p) => path.join(root, ...p);
// GATE_DIST points a local run at a copy of dist, so a rebuild meanwhile does not pull the pages out from under it.
const dist = process.env.GATE_DIST ? path.resolve(process.env.GATE_DIST) : at('dist');
const RATCHET = at('scripts/gates/ratchet.json');
const NUMBERS = JSON.parse(fs.readFileSync(at('src/data/numbers.json'), 'utf8'));
const LEGACY_MAX = 531; // the ratchet may list only pieces numbered up to here
const CHECKS = ['phone390', 'contrast', 'uiLines'];
const axeSource = fs.readFileSync(at('node_modules/axe-core/axe.min.js'), 'utf8');

/* ---------- arguments ---------- */
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const value = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
const concurrency = Number(value('--concurrency') || 6);

function allIds() {
  return fs.readdirSync(path.join(dist, 'demo')).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)).sort();
}
function changedIds(ref) {
  const out = execSync(`git diff --name-only ${ref} -- src/demos src/content/pieces`, { cwd: root, encoding: 'utf8' });
  const ids = new Set();
  for (const line of out.split('\n')) {
    const m = line.match(/^src\/(?:demos|content\/pieces)\/([a-z0-9-]+)\.(?:html|md)$/);
    if (m) ids.add(m[1]);
  }
  const have = new Set(allIds());
  return [...ids].filter((id) => have.has(id)).sort();
}
let ids;
if (flag('--all') || flag('--write-ratchet')) ids = allIds();
else if (value('--changed')) ids = changedIds(value('--changed'));
else if (value('--ids')) ids = value('--ids').split(',').map((s) => s.trim()).filter(Boolean);
else { console.error('usage: demos.mjs --all | --changed <ref> | --ids a,b [--json file] [--write-ratchet]'); process.exit(2); }
if (!fs.existsSync(path.join(dist, 'demo'))) { console.error('dist/demo is missing. Run pnpm build first.'); process.exit(2); }

/* ---------- the ratchet only goes down ---------- */
// The ratchet in the working tree is compared with the one at the base: the commit before this push in CI
// (RATCHET_BASE, set from github.event.before), otherwise HEAD^. A raise needs [raise-ceiling: <reason>] in a commit
// message between the base and HEAD. This runs before any page opens, so a hand-edited ratchet fails at once.
if (!flag('--write-ratchet') && fs.existsSync(RATCHET)) {
  const base = process.env.RATCHET_BASE && !/^0+$/.test(process.env.RATCHET_BASE) ? process.env.RATCHET_BASE : 'HEAD^';
  const prev = ratchetAt(root, base);
  if (prev) {
    const found = raises(prev, JSON.parse(fs.readFileSync(RATCHET, 'utf8')));
    const reason = raiseReason(messagesSince(root, base));
    if (found.length && !reason) {
      console.error(`Gate failed: the ratchet went up since ${base}, and no commit says [raise-ceiling: <reason>]:\n` + found.map((f) => '  ✗ ' + f).join('\n'));
      process.exit(1);
    }
    if (found.length) console.log(`The ratchet went up since ${base}, allowed by [raise-ceiling: ${reason}]`);
  } else if (process.env.CI) {
    console.error(`Gate failed: could not read the ratchet at ${base} to compare with (is the checkout shallow, or is git refusing it?).`);
    process.exit(1);
  } else console.log(`(no ratchet at ${base} to compare with)`);
}

/* ---------- static server ---------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(dist, url);
  if (!file.startsWith(dist)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

/* ---------- in-page scripts ---------- */
// phone390: the layout viewport, text past the edges, and columns that collapsed.
const PHONE_SCRIPT = `(() => {
  const LIMIT = 391;
  const fails = [];
  const vv = window.visualViewport ? visualViewport.width : innerWidth;
  const sw = document.documentElement.scrollWidth;
  if (vv > LIMIT) fails.push('visualViewport.width ' + Math.round(vv));
  if (sw > LIMIT) fails.push('scrollWidth ' + sw);
  const visible = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
      if (e.getAttribute && e.getAttribute('aria-hidden') === 'true' && e !== el) {} // decoration still counts if it paints
    }
    return true;
  };
  const scroller = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const ox = getComputedStyle(e).overflowX;
      if (ox === 'auto' || ox === 'scroll') return true;
    }
    return false;
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let n, seen = 0;
  while ((n = walker.nextNode())) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement;
    if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
    if (!visible(el)) continue;
    range.selectNodeContents(n);
    const r = range.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if ((r.right > LIMIT || r.left < -1) && !scroller(el)) {
      if (seen++ < 4) fails.push('text off-screen (' + Math.round(r.left) + '..' + Math.round(r.right) + '): "' + n.nodeValue.trim().slice(0, 40) + '"');
    }
  }
  let narrow = 0;
  for (const el of document.body.querySelectorAll('*')) {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'OPTION'].includes(el.tagName)) continue;
    const own = [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.nodeValue).join(' ').trim();
    if (own.split(/\\s+/).filter(Boolean).length < 3) continue;
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (r.width < 64 && narrow++ < 4) fails.push('collapsed column (' + Math.round(r.width) + 'px): "' + own.slice(0, 40) + '"');
  }
  return fails;
})()`;

// Shared colour helpers, evaluated in the page.
const COLOR_LIB = `
  const parse = (s) => { const m = (s || '').match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const contrast = (a, b) => { const [h, l] = [lum(a), lum(b)].sort((x, y) => y - x); return (h + 0.05) / (l + 0.05); };
  // The colour behind an element: its ancestors' backgrounds composited until one is opaque.
  const groundOf = (start) => {
    let acc = null;
    for (let e = start; e; e = e.parentElement) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (!c || c.a === 0) continue;
      acc = acc ? over(acc, c) : { ...c };
      if (acc.a >= 0.999) return acc;
    }
    const white = { r: 255, g: 255, b: 255, a: 1 };
    return acc ? over(acc, white) : white;
  };
  const visible = (el) => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return false; } const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
`;

// uiLines: every form control keeps a 3:1 edge or fill against the ground it sits on.
const UI_SCRIPT = `(() => {
  ${COLOR_LIB}
  const fails = [];
  const sel = 'input, select, textarea, [role=switch], [role=slider], [role=checkbox], [role=radio]';
  for (const el of document.querySelectorAll(sel)) {
    if (el.matches('input[type=hidden], input[type=submit], input[type=button]')) continue;
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const ground = groundOf(el.parentElement || document.body);
    let best = 0, how = '';
    const bw = parseFloat(cs.borderTopWidth) || 0;
    const bc = parse(cs.borderTopColor);
    if (bw > 0 && bc && bc.a > 0) { const c = contrast(over(bc, ground), ground); if (c > best) { best = c; how = 'border'; } }
    const fill = parse(cs.backgroundColor);
    if (fill && fill.a > 0) { const c = contrast(over(fill, ground), ground); if (c > best) { best = c; how = 'fill'; } }
    // An outline or a box-shadow ring can be the edge too, as long as it is a solid colour.
    const ow = parseFloat(cs.outlineWidth) || 0, oc = parse(cs.outlineColor);
    if (ow > 0 && cs.outlineStyle !== 'none' && oc && oc.a > 0) { const c = contrast(over(oc, ground), ground); if (c > best) { best = c; how = 'outline'; } }
    if (best < 3 && fails.length < 6) {
      const label = (el.getAttribute('aria-label') || el.id || el.className || el.tagName).toString().slice(0, 30);
      fails.push(el.tagName.toLowerCase() + '#' + label + ' ' + best.toFixed(2) + ':1 (' + (how || 'no edge') + ')');
    }
  }
  return fails;
})()`;

// After axe: for each node it could not decide, hand back the line boxes of its own text, the text colour,
// and the threshold. Only the text's own glyph runs are sampled, never a sibling icon or a child span, and a run
// hidden behind another element (a stacked card) is skipped.
const INCOMPLETE_SCRIPT = `(selectors) => {
  ${COLOR_LIB}
  const out = [];
  const range = document.createRange();
  for (const s of selectors) {
    let el; try { el = document.querySelector(s); } catch { continue; }
    if (!el || !visible(el) || el.closest('svg')) continue;
    const cs = getComputedStyle(el);
    const color = parse(cs.color); if (!color || color.a === 0) continue; // gradient text (background-clip) has no colour to measure
    const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const rects = [];
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.nodeValue.trim()) continue;
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (r.width < 2 || r.height < 2) continue;
        // keep the run only where it is on top: five probes along its middle must land on this element
        let hits = 0;
        for (let i = 0; i < 5; i++) { const t = document.elementFromPoint(r.left + r.width * (i + .5) / 5, r.top + r.height / 2); if (t && (t === el || el.contains(t))) hits++; }
        if (hits >= 3) rects.push({ x: r.left, y: r.top + r.height * 0.2, width: r.width, height: r.height * 0.6 });
      }
    }
    // a glow (text-shadow) paints a halo in the text's own hue; it is part of the glyph, not the ground
    const near = cs.textShadow && cs.textShadow !== 'none' ? 150 : 90;
    if (rects.length) out.push({ selector: s, color, near, threshold: large ? 3 : 4.5, rects: rects.slice(0, 6), text: (el.textContent || '').trim().slice(0, 40) });
  }
  return out;
}`;

// Decode a screenshot of one line box in the page and find the worst ground behind the text. Pixels near the
// text colour are the glyphs; pixels on the line between the text colour and the dominant ground are
// anti-aliasing and glow; what is left is ground, and the worst cluster of it (at least 1% of the box) is measured.
const PIXEL_SCRIPT = `async ({ png, color, threshold, near }) => {
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const contrast = (a, b) => { const [h, l] = [lum(a), lum(b)].sort((x, y) => y - x); return (h + 0.05) / (l + 0.05); };
  const img = new Image(); img.src = 'data:image/png;base64,' + png; await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const px = [];
  for (let i = 0; i < d.length; i += 8) {
    const r = d[i], gg = d[i + 1], b = d[i + 2];
    if (Math.abs(r - color.r) + Math.abs(gg - color.g) + Math.abs(b - color.b) < (near || 90)) continue;
    px.push([r, gg, b]);
  }
  if (!px.length) return { ok: true, worst: null };
  const key = (p) => ((p[0] >> 3) << 10) | ((p[1] >> 3) << 5) | (p[2] >> 3);
  const count = new Map();
  for (const p of px) count.set(key(p), (count.get(key(p)) || 0) + 1);
  let domKey = null, domN = 0; for (const [k, n] of count) if (n > domN) { domN = n; domKey = k; }
  const dom = [0, 0, 0]; let dn = 0; for (const p of px) if (key(p) === domKey) { dom[0] += p[0]; dom[1] += p[1]; dom[2] += p[2]; dn++; }
  dom[0] /= dn; dom[1] /= dn; dom[2] /= dn;
  // distance from a pixel to the segment text colour → dominant ground
  const A = [color.r, color.g, color.b], B = dom, AB = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], ab2 = AB[0] ** 2 + AB[1] ** 2 + AB[2] ** 2 || 1;
  const seg = (p) => { let t = ((p[0] - A[0]) * AB[0] + (p[1] - A[1]) * AB[1] + (p[2] - A[2]) * AB[2]) / ab2; t = Math.max(0, Math.min(1, t)); const q = [A[0] + AB[0] * t, A[1] + AB[1] * t, A[2] + AB[2] * t]; return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
  const buckets = new Map(); let total = 0;
  for (const p of px) {
    if (seg(p) < 48 && key(p) !== domKey) continue;
    const k = key(p); const e = buckets.get(k) || { n: 0, r: 0, g: 0, b: 0 };
    e.n++; e.r += p[0]; e.g += p[1]; e.b += p[2]; buckets.set(k, e); total++;
  }
  let worst = Infinity, worstColor = null;
  for (const e of buckets.values()) {
    if (e.n / total < 0.01) continue;
    const bg = { r: e.r / e.n, g: e.g / e.n, b: e.b / e.n };
    const k = contrast(color, bg);
    if (k < worst) { worst = k; worstColor = bg; }
  }
  if (!isFinite(worst)) return { ok: true, worst: null };
  return { ok: worst >= threshold, worst: Number(worst.toFixed(2)), bg: worstColor && [worstColor.r, worstColor.g, worstColor.b].map(Math.round) };
}`;

// Hold the page still for a screenshot. Playwright's animations: 'disabled' finishes finite animations, which fires
// animationend, and a demo that advances a tab on animationend then shows the next tab in the shot. Pause instead,
// and cancel infinite ones to their resting state as Playwright does. No end events fire.
const FREEZE = `document.getAnimations().forEach((a) => {
  try { const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null; if (t && t.iterations === Infinity) a.cancel(); else a.pause(); } catch {}
})`;

/* ---------- one demo ---------- */
async function contrastAt(page, label) {
  const fails = [];
  // axe schedules its checks with setTimeout. The page's timers are fake and paused, so hand axe the real ones.
  await page.addScriptTag({ content: `(function (setTimeout, clearTimeout) {\n${axeSource}\n}).call(window, window.__gateTimers.setTimeout, window.__gateTimers.clearTimeout);` });
  const res = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'rule', values: ['color-contrast'] }, resultTypes: ['violations', 'incomplete'] }));
  for (const v of res.violations) for (const node of v.nodes.slice(0, 4)) {
    const data = node.any?.[0]?.data || {};
    fails.push(`${label}: ${data.fgColor || ''} on ${data.bgColor || ''} ${data.contrastRatio ? data.contrastRatio + ':1' : ''} (needs ${data.expectedContrastRatio || ''}) "${(node.html || '').replace(/\s+/g, ' ').slice(0, 60)}"`);
  }
  const selectors = [];
  for (const inc of res.incomplete) for (const node of inc.nodes) { const t = node.target?.[0]; if (typeof t === 'string') selectors.push(t); }
  if (selectors.length) {
    const items = await page.evaluate(`(${INCOMPLETE_SCRIPT})(${JSON.stringify(selectors.slice(0, 40))})`);
    const vw = page.viewportSize().width, vh = page.viewportSize().height;
    for (const it of items) {
      let worst = null;
      for (const box of it.rects) {
        const x = Math.max(0, box.x), y = Math.max(0, box.y);
        const clip = { x, y, width: Math.min(box.width - (x - box.x), vw - x), height: Math.min(box.height - (y - box.y), vh - y) };
        if (clip.width < 2 || clip.height < 2) continue;
        let png;
        await page.evaluate(FREEZE);
        try { png = (await page.screenshot({ clip })).toString('base64'); } catch { continue; }
        const r = await page.evaluate(`(${PIXEL_SCRIPT})(${JSON.stringify({ png, color: it.color, threshold: it.threshold, near: it.near })})`);
        if (r.worst !== null && (!worst || r.worst < worst.worst)) worst = r;
      }
      if (worst && !worst.ok && fails.length < 8) fails.push(`${label}: pixel check ${worst.worst}:1 (needs ${it.threshold}) behind "${it.text}" on rgb(${worst.bg})`);
    }
  }
  return fails;
}

// Demos that draw with Math.random (stars, grain, scattered dots) must render the same on every run, or the
// ratchet flaps. Every page gets a seeded generator in place of Math.random before any script runs.
const SEED_SCRIPT = `(() => { let s = 0x9e3779b9; Math.random = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })()`;

// Every page runs on a paused fake clock (Date, setTimeout, setInterval, requestAnimationFrame) that starts at the
// same instant. The gate advances it by exactly STEP_MS, so a readout moved by requestAnimationFrame or a menu opened
// by setTimeout is measured in the same state on a loaded runner and a quiet one. Real time only moves CSS.
const CLOCK_START = new Date('2026-03-14T10:00:00Z');
// Runs before the fake clock is installed, so the gate's own in-page work (axe) keeps real timers.
const REAL_TIMERS = `window.__gateTimers = { setTimeout: setTimeout.bind(window), clearTimeout: clearTimeout.bind(window), raf: requestAnimationFrame.bind(window) };`;
// Two real frames: scroll, resize, and observer callbacks queued by the last step run before the next one.
const FRAME = `new Promise((r) => window.__gateTimers.raf(() => window.__gateTimers.raf(r)))`;
const STEP_MS = 1500;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Finite CSS animations and transitions still running. Infinite ones are left running.
const PENDING = `document.getAnimations().filter((a) => {
  const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
  return (!t || t.iterations !== Infinity) && (a.playState === 'running' || a.playState === 'pending');
}).length`;

const FONTS = `(() => { document.body && document.body.getBoundingClientRect(); return document.fonts.ready.then(() => document.fonts.status); })()`;

async function openStill(page, url) {
  await page.clock.install({ time: CLOCK_START });
  await page.clock.pauseAt(CLOCK_START);
  await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  // Web fonts load with display=swap. Measure in the real face, not the fallback that was showing a moment earlier.
  // Laying the page out first makes it request the faces it uses; fonts.ready before that resolves at once.
  await Promise.race([page.evaluate(FONTS), sleep(8000)]);
  // In 100ms steps with real frames between them, so a scroll event a timer caused is handled before the next timer
  // fires, as it would be in a browser left alone. One 1500ms jump fired every timer before any event ran.
  for (let t = 0; t < STEP_MS; t += 100) { await page.clock.runFor(100); await page.evaluate(FRAME); }
  // The page's own timers are fake now, so wait for CSS from here, in real time, up to 4s.
  for (let waited = 0; waited < 4000 && (await page.evaluate(PENDING)) > 0; waited += 100) await sleep(100);
  await Promise.race([page.evaluate(FONTS), sleep(8000)]);
}

async function gateOne(browser, id) {
  const url = `${base}/demo/${id}.html`;
  const result = { id, n: NUMBERS[id] ?? null, phone390: [], contrast: [], uiLines: [] };
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  try {
    for (const ctx of [phone, desktop]) { await ctx.addInitScript(REAL_TIMERS); await ctx.addInitScript(SEED_SCRIPT); }
    const p = await phone.newPage();
    await openStill(p, url);
    result.phone390 = await p.evaluate(PHONE_SCRIPT);
    result.contrast.push(...await contrastAt(p, '390'));
    result.uiLines.push(...(await p.evaluate(UI_SCRIPT)).map((s) => '390: ' + s));
    const d = await desktop.newPage();
    await openStill(d, url);
    result.contrast.push(...await contrastAt(d, '1280'));
    result.uiLines.push(...(await d.evaluate(UI_SCRIPT)).map((s) => '1280: ' + s));
  } catch (e) {
    result.error = String(e.message || e).split('\n')[0];
  } finally {
    await phone.close(); await desktop.close();
  }
  return result;
}

/* ---------- run ---------- */
const browser = await chromium.launch();
const results = [];
let next = 0;
async function worker() {
  while (next < ids.length) {
    const id = ids[next++];
    const r = await gateOne(browser, id);
    results.push(r);
    const cell = (k) => (r[k].length ? `FAIL (${r[k][0]})` : 'ok');
    console.log(`${id} · phone390 ${cell('phone390')} · contrast ${cell('contrast')} · uiLines ${cell('uiLines')}${r.error ? ' · error ' + r.error : ''}`);
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, ids.length) }, worker));
await browser.close();
results.sort((a, b) => a.id.localeCompare(b.id));

/* ---------- retry ---------- */
// A demo whose result differs from the committed ratchet is gated twice more. A check that gives the same answer
// three times is believed. One that changes between runs is unstable: it keeps its committed state, so it can neither
// fail the gate nor enter or leave the ratchet, and it is reported so the demo can be made still.
const committed = fs.existsSync(RATCHET) ? JSON.parse(fs.readFileSync(RATCHET, 'utf8')) : {};
const listedIn = (k, id) => (committed[k] || []).includes(id);
const fails = (r, k) => Boolean(r[k].length || r.error);
const unstable = [];
const suspects = results.filter((r) => CHECKS.some((k) => fails(r, k) !== listedIn(k, r.id)));
if (suspects.length) {
  const again = await chromium.launch();
  for (const r of suspects) {
    const runs = [r, await gateOne(again, r.id), await gateOne(again, r.id)];
    // A page that errored once but loaded on a retry is judged by the retry, not counted as failing everything.
    const clean = r.error && runs.find((x) => !x.error);
    if (clean) { for (const k of CHECKS) r[k] = clean[k]; delete r.error; runs[0] = { ...r }; }
    for (const k of CHECKS) {
      const seen = new Set(runs.map((x) => fails(x, k)));
      if (seen.size === 1) continue;
      unstable.push(`${k}: ${r.id}`);
      r[k] = listedIn(k, r.id) ? [`unstable: ${runs.find((x) => fails(x, k))[k][0] || 'error'}`] : [];
    }
  }
  await again.close();
  console.log(`re-gated ${suspects.length} demo${suspects.length === 1 ? '' : 's'} that differed from the ratchet`);
}
server.close();
if (unstable.length) console.log('Unstable, kept as committed (not a failure):\n' + unstable.map((u) => '  ~ ' + u).join('\n'));

/* ---------- ratchet ---------- */
const failing = Object.fromEntries(CHECKS.map((k) => [k, results.filter((r) => r[k].length || r.error).map((r) => r.id)]));
let ratchet = fs.existsSync(RATCHET) ? JSON.parse(fs.readFileSync(RATCHET, 'utf8')) : { ceiling: {}, phone390: [], contrast: [], uiLines: [] };
const problems = [];
if (flag('--write-ratchet')) {
  const fresh = { ceiling: {}, phone390: [], contrast: [], uiLines: [] };
  for (const k of CHECKS) {
    fresh[k] = failing[k].filter((id) => (NUMBERS[id] ?? Infinity) <= LEGACY_MAX).sort();
    fresh.ceiling[k] = fresh[k].length;
    for (const id of failing[k]) if ((NUMBERS[id] ?? Infinity) > LEGACY_MAX) problems.push(`${k}: ${id} (n ${NUMBERS[id]}) fails and is too new for the ratchet`);
  }
  // The new lists may only shrink against the committed ratchet, unless HEAD's message says [raise-ceiling: <reason>].
  const up = raises(ratchet, fresh);
  const reason = raiseReason(headMessage(root));
  if (up.length && !reason) {
    problems.push(...up.map((u) => `would raise the ratchet (${u}); add [raise-ceiling: <reason>] to the commit message to allow it`));
    console.error('Not written: the measured ratchet is higher than the committed one.');
  } else {
    fs.writeFileSync(RATCHET, JSON.stringify(fresh, null, 2) + '\n');
    if (up.length) {
      console.log(`raise allowed: ${reason}\n` + up.map((u) => '  ' + u).join('\n'));
      if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `raise_reason=${reason.replace(/\n/g, ' ')}\n`);
    }
    ratchet = fresh;
    console.log(`wrote ${path.relative(root, RATCHET)}: ${CHECKS.map((k) => `${k} ${fresh[k].length}`).join(' · ')}`);
  }
} else {
  const checked = new Set(ids);
  for (const k of CHECKS) {
    const listed = new Set(ratchet[k] || []);
    for (const id of failing[k]) if (!listed.has(id)) problems.push(`${k}: ${id} fails and is not in the ratchet`);
    for (const id of listed) if (checked.has(id) && !failing[k].includes(id)) problems.push(`${k}: ${id} now passes; remove it from the ratchet`);
    for (const id of listed) if ((NUMBERS[id] ?? Infinity) > LEGACY_MAX) problems.push(`${k}: ${id} (n ${NUMBERS[id]}) is too new to be in the ratchet`);
    if ((ratchet.ceiling?.[k] ?? Infinity) < listed.size) problems.push(`${k}: ${listed.size} listed, ceiling ${ratchet.ceiling[k]}`);
  }
}
if (value('--json')) fs.writeFileSync(value('--json'), JSON.stringify({ base: 'dist', ids, results, failing, problems }, null, 2));

const line = `${results.length} demos · ${CHECKS.map((k) => `${k} ${failing[k].length} fail (ratchet ${(ratchet[k] || []).length})`).join(' · ')}`;
console.log(line);
if (problems.length) {
  console.error('\nGate failed:\n' + problems.map((p) => '  ✗ ' + p).join('\n'));
  for (const r of results) if (r.phone390.length || r.contrast.length || r.uiLines.length) {
    const all = [...r.phone390.map((s) => 'phone390: ' + s), ...r.contrast.map((s) => 'contrast: ' + s), ...r.uiLines.map((s) => 'uiLines: ' + s)];
    if (problems.some((p) => p.includes(` ${r.id} `))) console.error(`  ${r.id}\n` + all.map((s) => '    ' + s).join('\n'));
  }
  process.exit(1);
}
