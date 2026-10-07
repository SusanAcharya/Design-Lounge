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

/** A reason that only names the slot, or says too little to explain a raise. */
export function isPlaceholder(reason) {
  const r = reason.trim();
  return r.length < 10 || /^<.*>$/s.test(r);
}

/**
 * The first real reason in a raise-ceiling tag in the given commit messages, or null. Nothing else allows a raise.
 * Placeholders do not count: "<reason>", anything wrapped in < >, or fewer than 10 characters. A message that
 * only describes the tag (as this repository's own commits do) therefore never opens it.
 */
export function raiseReason(message = '') {
  for (const m of message.matchAll(/\[raise-ceiling:\s*([^\]]*?)\s*\]/gi)) {
    if (!isPlaceholder(m[1])) return m[1].trim();
  }
  return null;
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
