// The ratchet only goes down. Shared by the ratchet write (demos.mjs --write-ratchet) and the gate itself, and
// runnable on its own:
//   node scripts/gates/ratchet-guard.mjs <previous.json> <next.json>   exits 1 if next raises anything
// A raise is allowed only when the commit message (or RAISE_CEILING) carries [raise-ceiling: <reason>].
import fs from 'node:fs';
import { execSync } from 'node:child_process';

export const CHECKS = ['phone390', 'contrast', 'uiLines'];

/** Every way `next` is looser than `prev`: a ceiling or a list that grew, or an id that was not listed before. */
export function raises(prev, next) {
  const out = [];
  for (const k of CHECKS) {
    const pc = prev?.ceiling?.[k], nc = next?.ceiling?.[k];
    if (pc !== undefined && nc !== undefined && nc > pc) out.push(`${k}: ceiling ${pc} → ${nc}`);
    const pl = new Set(prev?.[k] || []), nl = next?.[k] || [];
    if (nl.length > pl.size) out.push(`${k}: list ${pl.size} → ${nl.length}`);
    const added = nl.filter((id) => !pl.has(id));
    if (added.length) out.push(`${k}: new ids ${added.join(', ')}`);
  }
  return out;
}

/** The reason in `[raise-ceiling: <reason>]` in the given commit messages, or null. Nothing else allows a raise. */
export function raiseReason(message = '') {
  const m = message.match(/\[raise-ceiling:\s*([^\]]*\S)\s*\]/i);
  return m ? m[1].trim() : null;
}

/** Commit messages from `base` (exclusive) to HEAD, or HEAD's alone when there is no base. */
export function messagesSince(cwd, base) {
  const range = base ? `${base}..HEAD` : '-1';
  try { return execSync(`git log ${range} --format=%B`, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; }
}
export const headMessage = (cwd) => messagesSince(cwd, null);

/** The ratchet as it was in `ref` (default HEAD^), or null when git cannot see it. */
export function ratchetAt(cwd, ref = 'HEAD^') {
  try { return JSON.parse(execSync(`git show ${ref}:scripts/gates/ratchet.json`, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })); } catch { return null; }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [prevFile, nextFile] = process.argv.slice(2);
  if (!prevFile || !nextFile) { console.error('usage: ratchet-guard.mjs <previous.json> <next.json>'); process.exit(2); }
  const found = raises(JSON.parse(fs.readFileSync(prevFile, 'utf8')), JSON.parse(fs.readFileSync(nextFile, 'utf8')));
  const reason = raiseReason(headMessage(process.cwd()));
  if (found.length && !reason) {
    console.error('Ratchet raised without [raise-ceiling: <reason>]:\n' + found.map((f) => '  ✗ ' + f).join('\n'));
    process.exit(1);
  }
  console.log(found.length ? `Ratchet raised, allowed: ${reason}\n` + found.map((f) => '  ' + f).join('\n') : 'Ratchet did not go up.');
}
