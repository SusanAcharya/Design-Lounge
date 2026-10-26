// Installing the MCP installs the skill. The skill is where the method lives, and clients that load skills
// (Claude Code, Cursor, Codex) read it before they design. This follows the `skills` CLI layout: one copy in
// ~/.agents/skills/design-lounge, linked into each client's skills folder.
//
// It never replaces a copy something else installed (the skills CLI, a person) unless asked, and it only links
// into clients that are on this machine. DESIGN_LOUNGE_SKILL_INSTALL=off turns it off.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const NAME = 'design-lounge';
const MARK = '.installed-by-design-lounge-mcp.json';
// [the client's home folder, its user skills folder]
const CLIENTS = [['.claude', '.claude/skills'], ['.cursor', '.cursor/skills'], ['.codex', '.codex/skills']];
const SKIP = new Set(['install.mjs', MARK, 'node_modules', '.DS_Store']);

/** A fingerprint of the skill: every file's path and size, and the text of the method files and the map. */
export function skillHash(dir) {
  const h = crypto.createHash('sha1');
  const walk = (d, rel = '') => {
    for (const name of fs.readdirSync(d).sort()) {
      if (SKIP.has(name)) continue;
      const full = path.join(d, name), r = path.join(rel, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full, r);
      else {
        h.update(`${r}:${st.size};`);
        if (name.endsWith('.md') && !rel.includes('briefs') || name === 'map.json') h.update(fs.readFileSync(full));
      }
    }
  };
  walk(dir);
  return h.digest('hex').slice(0, 16);
}

function copySkill(src, dest, hash, version) {
  const tmp = `${dest}.tmp-${process.pid}`;
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.cpSync(src, tmp, { recursive: true, filter: (f) => !SKIP.has(path.basename(f)) });
  fs.writeFileSync(path.join(tmp, MARK), JSON.stringify({ hash, version, at: new Date().toISOString(), note: 'Installed by the Design Lounge MCP server. It updates this folder when the server updates. Delete this file to keep your own copy.' }, null, 1));
  // Swap in one step, so an agent reading the skill never sees half of it.
  fs.rmSync(dest, { recursive: true, force: true });
  fs.renameSync(tmp, dest);
}

const readMark = (dir) => { try { return JSON.parse(fs.readFileSync(path.join(dir, MARK), 'utf8')); } catch { return null; } };
const isLink = (p) => { try { return fs.lstatSync(p).isSymbolicLink(); } catch { return false; } };
const present = (p) => { try { fs.lstatSync(p); return true; } catch { return false; } };

/** Put the skill where this machine's agents look for it. Returns what it did, for the tools to report. */
export function ensureUserSkill(src, { home = os.homedir(), version = '', replace = false, env = process.env } = {}) {
  if (env.DESIGN_LOUNGE_SKILL_INSTALL === 'off') return { status: 'off', note: 'DESIGN_LOUNGE_SKILL_INSTALL=off, so the skill was not installed.' };
  const hash = skillHash(src);
  const canonical = path.join(home, '.agents', 'skills', NAME);
  const out = { canonical, hash, links: [] };
  const mark = readMark(canonical);
  if (!present(canonical)) { fs.mkdirSync(path.dirname(canonical), { recursive: true }); copySkill(src, canonical, hash, version); out.status = 'installed'; }
  else if (mark || replace) {
    if (!mark || mark.hash !== hash || replace) { copySkill(src, canonical, hash, version); out.status = mark ? 'updated' : 'replaced'; }
    else out.status = 'current';
  } else {
    out.status = 'kept';
    out.stale = skillHash(canonical) !== hash;
    out.note = `A copy installed another way is at ${canonical}${out.stale ? ', and it differs from this server\'s' : ''}. It was left alone. Run install_skill with replace: true to use this server's copy, or update it the way you installed it (npx skills update).`;
  }
  for (const [clientHome, skills] of CLIENTS) {
    if (!fs.existsSync(path.join(home, clientHome))) continue;
    const link = path.join(home, skills, NAME);
    if (present(link)) {
      const ours = !isLink(link) && readMark(link);
      if (ours && ours.hash !== hash) { copySkill(src, link, hash, version); out.links.push({ client: clientHome.slice(1), path: link, status: 'copy updated' }); }
      else out.links.push({ client: clientHome.slice(1), path: link, status: isLink(link) ? 'linked' : ours ? 'copy current' : 'own copy, left alone' });
      continue;
    }
    fs.mkdirSync(path.dirname(link), { recursive: true });
    try { fs.symlinkSync(path.relative(path.dirname(link), canonical), link, 'dir'); out.links.push({ client: clientHome.slice(1), path: link, status: 'linked now' }); }
    catch { copySkill(src, link, hash, version); out.links.push({ client: clientHome.slice(1), path: link, status: 'copied (links not allowed here)' }); }
  }
  return out;
}

/** Copy the skill into a project's agent folders, as install.mjs does, for clients that only read project skills. */
export function installProjectSkill(src, projectPath, { version = '' } = {}) {
  const root = path.resolve(projectPath);
  if (!fs.existsSync(root)) throw new Error(`No such folder: ${root}`);
  if (fs.existsSync(path.join(root, 'src/content/pieces')) && fs.existsSync(path.join(root, 'src/demos'))) {
    throw new Error('This is the Design Lounge repo itself. Install the skill in the product you are designing, not in the library.');
  }
  const hash = skillHash(src);
  return ['.claude/skills', '.cursor/skills', '.agents/skills'].map((folder) => {
    const dest = path.join(root, folder, NAME);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    copySkill(src, dest, hash, version);
    return dest;
  });
}
