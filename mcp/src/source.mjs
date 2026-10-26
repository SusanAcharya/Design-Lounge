// Load what a reviewer needs from a page: its HTML as served, its CSS, and the site files a crawler reads first.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const PARSE = { comment: false, blockTextElements: { script: true, style: true, noscript: true, pre: true } };
const UA = 'DesignLoungeReview/0.1 (+https://www.designlounge.live)';
const MAX_SHEETS = 12;
const MAX_BYTES = 3_000_000;

async function get(url, { bytes = false, timeout = 15000 } = {}) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: bytes ? '*/*' : 'text/html,text/css,text/plain,application/xml;q=0.9,*/*;q=0.8' }, redirect: 'follow', signal: AbortSignal.timeout(timeout) });
    const body = bytes ? Buffer.from(await res.arrayBuffer()) : (await res.text()).slice(0, MAX_BYTES);
    return { ok: res.ok, status: res.status, url: res.url, redirected: res.redirected, headers: Object.fromEntries(res.headers), body, ms: Date.now() - t0 };
  } catch (err) {
    return { ok: false, status: 0, url, error: err.name === 'TimeoutError' ? `timed out after ${timeout / 1000}s` : err.message, body: bytes ? Buffer.alloc(0) : '', ms: Date.now() - t0 };
  }
}

/** Resolve a path argument: a directory means its index.html. */
function resolveFile(p) {
  let file = path.resolve(p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`No such file: ${file}`);
  return file;
}

export async function loadPage({ url, path: p, html }) {
  let page;
  if (html) {
    page = { kind: 'html', label: 'pasted HTML', html, status: 200 };
  } else if (url) {
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    const res = await get(url);
    if (!res.status) throw new Error(`Could not fetch ${url}: ${res.error}`);
    page = { kind: 'url', label: res.url, url: res.url, requested: url, html: res.body, status: res.status, redirected: res.redirected, headers: res.headers, ms: res.ms, bytes: Buffer.byteLength(res.body) };
  } else if (p) {
    const file = resolveFile(p);
    const body = fs.readFileSync(file, 'utf8');
    page = { kind: 'file', label: file, file, dir: path.dirname(file), html: body, status: 200, bytes: Buffer.byteLength(body) };
  } else {
    throw new Error('Give one of url, path, or html.');
  }
  page.root = parse(page.html, PARSE);
  page.styles = await collectStyles(page);
  return page;
}

async function collectStyles(page) {
  const styles = [];
  for (const el of page.root.querySelectorAll('style')) styles.push({ source: '<style>', text: el.text });
  const links = page.root.querySelectorAll('link').filter((l) => /\bstylesheet\b/i.test(l.getAttribute('rel') || ''));
  page.fontLinks = [];
  for (const link of links.slice(0, MAX_SHEETS)) {
    const href = link.getAttribute('href');
    if (!href) continue;
    if (/fonts\.googleapis\.com|use\.typekit\.net|fonts\.bunny\.net/.test(href)) { page.fontLinks.push(href); continue; }
    const text = await readAsset(page, href);
    if (text != null) styles.push({ source: href, text: String(text) });
  }
  // @import inside the CSS we have, one level deep, for Google Fonts and local sheets.
  for (const s of styles.slice()) {
    for (const m of s.text.matchAll(/@import\s+(?:url\()?["']?([^"')\s;]+)["']?\)?/g)) {
      if (/fonts\.googleapis\.com|fonts\.bunny\.net/.test(m[1])) page.fontLinks.push(m[1]);
      else if (styles.length < MAX_SHEETS + 4) {
        const text = await readAsset(page, m[1], s.source);
        if (text != null) styles.push({ source: m[1], text: String(text) });
      }
    }
  }
  const inline = page.root.querySelectorAll('[style]').map((el) => el.getAttribute('style')).join(';\n');
  if (inline) styles.push({ source: 'style=""', text: `inline { ${inline} }` });
  return styles;
}

/** Read a file the page refers to: fetched for a URL, read from disk for a file. Returns null when it is not there. */
export async function readAsset(page, href, from, { bytes = false } = {}) {
  if (page.kind === 'url' || /^https?:\/\//.test(href)) {
    const base = from && /^https?:/.test(from) ? from : page.url;
    let target;
    try { target = new URL(href, base).href; } catch { return null; }
    if (!/^https?:/.test(target)) return null;
    const res = await get(target, { bytes });
    return res.ok ? res.body : null;
  }
  if (page.kind === 'file') {
    const clean = href.split(/[?#]/)[0];
    const baseDir = from && !/^</.test(from) && !/^https?:/.test(from) ? path.dirname(path.resolve(page.dir, from)) : page.dir;
    const tries = clean.startsWith('/')
      ? ancestors(page.dir).flatMap((d) => [path.join(d, clean), path.join(d, 'public', clean)])
      : [path.resolve(baseDir, clean)];
    for (const t of tries) if (fs.existsSync(t) && fs.statSync(t).isFile()) return bytes ? fs.readFileSync(t) : fs.readFileSync(t, 'utf8');
  }
  return null;
}

const ancestors = (dir, n = 4) => { const out = []; let d = dir; for (let i = 0; i < n; i++) { out.push(d); const up = path.dirname(d); if (up === d) break; d = up; } return out; };

/** robots.txt, sitemap.xml, and llms.txt for the page's site. For a file, the nearest folder that has them, or its public/. */
export async function siteFiles(page) {
  const want = ['robots.txt', 'sitemap.xml', 'llms.txt'];
  const out = {};
  if (page.kind === 'url') {
    const origin = new URL(page.url).origin;
    await Promise.all(want.map(async (f) => {
      const res = await get(`${origin}/${f}`, { timeout: 10000 });
      // A soft 404 serves the HTML home page at every path; that is not the file.
      const isHtml = /<html|<!doctype html/i.test(res.body.slice(0, 500));
      out[f] = res.ok && !(isHtml && f !== 'sitemap.xml') ? { where: res.url, text: res.body } : { where: `${origin}/${f}`, missing: true, status: res.status };
    }));
  } else if (page.kind === 'file') {
    for (const f of want) {
      const hit = ancestors(page.dir).flatMap((d) => [path.join(d, f), path.join(d, 'public', f)]).find((t) => fs.existsSync(t));
      out[f] = hit ? { where: hit, text: fs.readFileSync(hit, 'utf8') } : { missing: true };
    }
  } else {
    for (const f of want) out[f] = { missing: true, unknown: true };
  }
  return out;
}

/** Width and height from the first bytes of a PNG, JPEG, GIF, or WebP. */
export function imageSize(buf) {
  if (!buf || buf.length < 24) return null;
  if (buf.readUInt32BE(0) === 0x89504e47) return { type: 'png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (buf.toString('ascii', 0, 3) === 'GIF') return { type: 'gif', width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const kind = buf.toString('ascii', 12, 16);
    if (kind === 'VP8X') return { type: 'webp', width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (kind === 'VP8 ') return { type: 'webp', width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (kind === 'VP8L') { const b = buf.readUInt32LE(21); return { type: 'webp', width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 }; }
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { type: 'jpeg', width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

/** The text a reader sees, from the HTML as served (no scripts run). */
export function visibleText(root) {
  const clone = parse(root.toString(), PARSE);
  for (const el of clone.querySelectorAll('script, style, noscript, template, svg title, [hidden], [aria-hidden="true"]')) el.remove();
  const body = clone.querySelector('body') || clone;
  return body.structuredText.replace(/[ \t]+/g, ' ').trim();
}
