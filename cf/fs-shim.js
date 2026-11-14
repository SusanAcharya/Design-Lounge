// node:fs for the hosted MCP Worker. The MCP server reads the skill folder with fs; in the Worker those files live
// in memory: the bundled library (cf/library.gen.js) plus the briefs cf/mcp.js fetches before a get_piece call.
// Anything else does not exist, so code that looks for local files (history, thumbnails, caches) finds nothing
// and takes its no-file path. Writes are refused: the hosted server keeps nothing.
import bundled from './library.gen.js';

const files = new Map(Object.entries(bundled));
const BRIEFS = '/skill/library/briefs/';
const MAX_BRIEFS = 200; // briefs held in memory per Worker instance, oldest dropped first

const norm = (p) => {
  let s = p instanceof URL ? p.pathname : String(p);
  if (s.startsWith('file://')) s = new URL(s).pathname;
  // tools.mjs reads its own package.json relative to the module; in the bundle that resolves somewhere odd.
  if (s.endsWith('/package.json')) return '/mcp/package.json';
  return s.replace(/\/+$/, '') || '/';
};
const isDir = (p) => { const pre = `${p}/`; for (const k of files.keys()) if (k.startsWith(pre)) return true; return false; };
const missing = (p) => Object.assign(new Error(`ENOENT: no such file or directory, '${p}'`), { code: 'ENOENT' });
const refused = () => Object.assign(new Error('The hosted Design Lounge server cannot write files.'), { code: 'EROFS' });

/** Called by cf/mcp.js with a brief it fetched. */
export function putBrief(id, text) {
  const key = `${BRIEFS}${id}.md`;
  files.delete(key);
  files.set(key, text);
  let extra = [...files.keys()].filter((k) => k.startsWith(BRIEFS)).length - MAX_BRIEFS;
  for (const k of files.keys()) { if (extra <= 0) break; if (k.startsWith(BRIEFS)) { files.delete(k); extra--; } }
}
export const hasBrief = (id) => files.has(`${BRIEFS}${id}.md`);

export function existsSync(p) { const n = norm(p); return files.has(n) || isDir(n); }
export function readFileSync(p, opts) {
  const n = norm(p);
  if (!files.has(n)) throw missing(n);
  const text = files.get(n);
  const enc = typeof opts === 'string' ? opts : opts?.encoding;
  return enc ? text : new TextEncoder().encode(text);
}
export function statSync(p) {
  const n = norm(p);
  const file = files.has(n);
  if (!file && !isDir(n)) throw missing(n);
  return { isFile: () => file, isDirectory: () => !file, size: file ? files.get(n).length : 0, mtimeMs: 0 };
}
export function readdirSync(p, opts) {
  const n = norm(p);
  const pre = `${n}/`;
  const names = new Map();
  for (const k of files.keys()) {
    if (!k.startsWith(pre)) continue;
    const rest = k.slice(pre.length);
    const name = rest.split('/')[0];
    names.set(name, rest.includes('/'));
  }
  if (!names.size && !files.has(n)) throw missing(n);
  const list = [...names.keys()].sort();
  return opts?.withFileTypes ? list.map((name) => ({ name, isDirectory: () => names.get(name), isFile: () => !names.get(name) })) : list;
}
const noWrite = () => { throw refused(); };
export const writeFileSync = noWrite, appendFileSync = noWrite, mkdirSync = noWrite, rmSync = noWrite, renameSync = noWrite,
  unlinkSync = noWrite, copyFileSync = noWrite, mkdtempSync = noWrite, symlinkSync = noWrite;
export const promises = {
  readFile: async (p, o) => readFileSync(p, o),
  stat: async (p) => statSync(p),
  readdir: async (p, o) => readdirSync(p, o),
  access: async (p) => { if (!existsSync(p)) throw missing(norm(p)); },
  writeFile: async () => noWrite(), mkdir: async () => noWrite(), rm: async () => noWrite(),
};
export const constants = { F_OK: 0, R_OK: 4, W_OK: 2, X_OK: 1 };
export default {
  existsSync, readFileSync, statSync, readdirSync, writeFileSync, appendFileSync, mkdirSync, rmSync, renameSync,
  unlinkSync, copyFileSync, mkdtempSync, symlinkSync, promises, constants,
};
