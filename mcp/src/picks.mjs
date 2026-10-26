// Pick a direction and keep sites from rhyming: the rules of "Pick a direction" and "Recent picks" in practice.md,
// done in code so every agent gets the same answer from the same history.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const historyPath = () => process.env.DESIGN_LOUNGE_HISTORY || path.join(os.homedir(), '.design-lounge', 'history.jsonl');

export const GROUPS = {
  'showing work': ['portfolio', 'portfolio-builder', 'personal-site', 'agency'],
  'a place': ['restaurant', 'food', 'hotel', 'wellness', 'gym', 'clinic'],
  selling: ['marketing-site', 'saas', 'landing', 'commerce', 'fashion', 'fintech'],
  culture: ['editorial', 'museum', 'music', 'event', 'education'],
  'a service': ['professional', 'nonprofit', 'real-estate', 'jobs'],
  'the tool': ['web-app', 'dashboard'],
};
const CALM_FAMILIES = new Set(['quiet', 'editorial', 'sharp']);
export const CALM_WORDS = ['clean', 'simple', 'professional', 'plain', 'calm', 'quiet', 'corporate', 'serious', 'trustworthy'];

export const groupOf = (recipe) => Object.entries(GROUPS).find(([, ids]) => ids.includes(recipe))?.[0] || null;
const related = (recipe) => { const g = groupOf(recipe); return g ? GROUPS[g] : [recipe]; };
// History lines are written by agents, so a direction can carry a note: "garden-supper (pairing the-lounge ...)".
const slug = (v) => (typeof v === 'string' ? (v.trim().toLowerCase().match(/^[a-z0-9]+(?:-[a-z0-9]+)*/)?.[0] || '') : '');
const real = (v) => { const s = slug(v); return s && s !== 'none' && s !== 'null' && s !== 'custom' ? s : ''; };

export function readHistory(file = historyPath(), last = 24) {
  if (!fs.existsSync(file)) return { file, exists: false, lines: [], skipped: 0 };
  const lines = [];
  let skipped = 0;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!raw.trim()) continue;
    try { lines.push(JSON.parse(raw)); } catch { skipped++; }
  }
  return { file, exists: true, lines: lines.slice(-last), skipped };
}

/** One line per site: a claimed line and its finished line are the same site, and the later one wins. */
export function sites(lines) {
  const byKey = new Map();
  for (const l of lines) {
    const key = `${(l.product || '').toLowerCase()}|${l.recipe}|${l.folder || ''}`;
    byKey.delete(key);
    byKey.set(key, l);
  }
  return [...byKey.values()];
}

/** The name number: each letter's place in the alphabet, summed. Spaces, digits, and punctuation are ignored. */
export function nameNumber(name) {
  const letters = String(name || '').toLowerCase().normalize('NFKD').replace(/[^a-z]/g, '');
  const parts = [...letters].map((c) => c.charCodeAt(0) - 96);
  return { sum: parts.reduce((a, b) => a + b, 0), parts };
}

function matchesOf(dir, line) {
  return ['hero', 'work', 'footer'].filter((k) => real(dir[k]) && real(dir[k]) === real(line[k]));
}

/**
 * Check a planned pick against the history. Returns every problem with the line that causes it,
 * and the Unlike line for the sheet.
 */
export function checkPick(pick, lines, { reuse = false } = {}) {
  lines = sites(lines);
  const problems = [];
  const product = (pick.product || '').toLowerCase();
  const others = lines.filter((l) => (l.product || '').toLowerCase() !== product || !product);
  const same = others.filter((l) => l.recipe === pick.recipe);
  const group = others.filter((l) => related(pick.recipe).includes(l.recipe));
  const who = (l) => `${l.product || 'an earlier site'} (${l.recipe}, ${l.date || 'no date'})`;

  if (!reuse) {
    for (const l of same) {
      if (real(pick.direction) && real(l.direction) === real(pick.direction)) problems.push({ rule: 'direction', detail: `direction ${pick.direction} was used for ${who(l)}` });
      if (real(pick.hero) && real(l.hero) === real(pick.hero)) problems.push({ rule: 'hero', detail: `hero ${pick.hero} was used for ${who(l)}` });
      if (real(pick.effect) && real(l.effect) === real(pick.effect)) problems.push({ rule: 'effect', detail: `effect ${pick.effect} was used for ${who(l)}` });
    }
  }
  // Two of hero, work, and footer matching one recent site in the group reads as the same site. A reuse compares work and footer only.
  const compare = reuse ? { work: pick.work, footer: pick.footer } : pick;
  for (const l of group) {
    const m = matchesOf(compare, l);
    if (m.length >= 2) problems.push({ rule: 'group', detail: `${m.join(' and ')} match ${who(l)}` });
  }
  // Shape: differs from both of the last two in the group. Frame: not all three parts equal to any of the last three.
  if (pick.shape) {
    for (const l of group.slice(-2)) if (l.shape && l.shape === pick.shape) problems.push({ rule: 'shape', detail: `hero shape ${pick.shape} repeats ${who(l)}` });
  }
  if (Array.isArray(pick.frame) && pick.frame.length === 3) {
    for (const l of group.slice(-3)) {
      if (Array.isArray(l.frame) && l.frame.length === 3 && l.frame.every((f, i) => slug(f) === slug(pick.frame[i]))) {
        problems.push({ rule: 'frame', detail: `frame ${pick.frame.join(' · ')} matches ${who(l)} on all three parts` });
      }
    }
  }

  const seen = new Set();
  const unique = problems.filter((p) => !seen.has(p.detail) && seen.add(p.detail));
  problems.length = 0;
  problems.push(...unique);

  const closest = group.map((l) => ({ l, m: matchesOf(pick, l) })).sort((a, b) => b.m.length - a.m.length)[0];
  let unlike;
  if (!group.length) unlike = `Unlike recent ${groupOf(pick.recipe) || pick.recipe} sites: none in the history.`;
  else if (!closest.m.length) unlike = `Unlike recent ${groupOf(pick.recipe) || pick.recipe} sites: hero, work, footer${pick.shape ? ', shape' : ''}${pick.frame ? ', and frame' : ''} are all different.`;
  else unlike = `Unlike ${closest.l.product || 'the closest site'}: ${['hero', 'work', 'footer'].map((k) => `${k} ${closest.m.includes(k) ? 'matches' : 'differs'}`).join(', ')}. ${closest.m.length === 1 ? 'One match, so it stands.' : 'Two matches, so take the next direction.'}`;
  return { ok: problems.length === 0, problems, unlike };
}

/**
 * Pick a direction in a recipe. The agent says which directions fit the subject (rules 1, 2, and 4 need judgment).
 * The server applies the calm-word filter, the history, the group check, and the name number.
 */
export function pickDirection(recipe, { product, fitting, calm = false }, lines) {
  const all = recipe.directions || [];
  const unknown = (fitting || []).filter((id) => !all.some((d) => d.id === id));
  let fit = fitting?.length ? all.filter((d) => fitting.includes(d.id)) : all.slice();
  const notes = [];
  if (!fitting?.length) notes.push('No fitting list given, so every direction counts as fitting. Pass `fitting` with the directions whose mood names this subject\'s world.');
  if (unknown.length) notes.push(`Not directions of ${recipe.id}: ${unknown.join(', ')}.`);
  if (calm && fit.length > 1) {
    const calmFit = fit.filter((d) => CALM_FAMILIES.has(d.family));
    if (calmFit.length) { fit = calmFit; notes.push(`Calm words: kept directions in quiet, editorial, or sharp families (${calmFit.map((d) => d.id).join(', ')}).`); }
    else notes.push('Calm words, but no fitting direction is quiet, editorial, or sharp. Kept them all; let the dials make it calm.');
  }

  const checked = fit.map((d) => ({ d, check: checkPick({ recipe: recipe.id, product, direction: d.id, hero: d.hero, effect: d.effect, work: d.work, footer: d.footer }, lines) }));
  const open = checked.filter((c) => c.check.ok);
  let chosen, how, reuse = false;

  if (open.length === 1) { chosen = open[0].d; how = checked.length > 1 ? 'the only fitting direction the history leaves open' : 'the only direction that fits'; }
  else if (open.length > 1) {
    const n = nameNumber(product);
    if (!n.sum) { chosen = open[0].d; how = 'no product name, so the first open direction. Pass `product` (or the first noun of their message) for the name number'; }
    else {
      const i = n.sum % open.length;
      chosen = open[i].d;
      how = `${product} = ${n.parts.join('+')} = ${n.sum}, ${open.length} open directions, ${n.sum} mod ${open.length} = ${i}`;
    }
  } else if (fit.length) {
    // Every fitting direction is recent: reuse the one used longest ago, and change what people notice.
    reuse = true;
    const lastUse = (d) => { let at = -1; lines.forEach((l, i) => { if (l.recipe === recipe.id && real(l.direction) === d.id) at = i; }); return at; };
    chosen = fit.slice().sort((a, b) => lastUse(a) - lastUse(b))[0];
    const used = lines.filter((l) => l.recipe === recipe.id && real(l.direction) === chosen.id).at(-1);
    how = `every fitting direction is recent, so reuse the one used longest ago${used ? ` (${used.product}, ${used.date})` : ''}. Keep its theme, pairing, and family. Change the Idea and Signature, the hero shape and frame, and the effect (or quiet). Use a different work or footer piece if Sections allows it`;
  }

  const sheet = chosen ? [
    `Direction: ${chosen.id} (${how})`,
    `Theme: ${chosen.theme} · Pairing: ${chosen.pairing} · Family: ${chosen.family}`,
    reuse ? `Recent: all fitting ${recipe.id} directions used; reusing ${chosen.id} with shape, frame, and effect changed` : null,
  ].filter(Boolean) : [];

  return {
    recipe: recipe.id,
    chosen: chosen || null,
    reuse,
    how,
    sheet,
    blocked: checked.filter((c) => !c.check.ok).map((c) => ({ direction: c.d.id, because: c.check.problems.map((p) => p.detail) })),
    open: open.map((c) => c.d.id),
    notes,
  };
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Append a claimed or finished line, then read the file again: an earlier claim on the same recipe and direction wins. */
export function recordPick(line, file = historyPath()) {
  const entry = { date: today(), ...line, status: line.status || 'claimed', at: new Date().toISOString() };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, JSON.stringify(entry) + '\n');
  const { lines } = readHistory(file);
  const hourAgo = Date.now() - 3600_000;
  const rival = lines.find((l) => l !== lines.at(-1) && l.recipe === entry.recipe && real(l.direction) === real(entry.direction)
    && (l.product || '').toLowerCase() !== (entry.product || '').toLowerCase()
    && l.status === 'claimed' && (l.at ? Date.parse(l.at) >= hourAgo : l.date === entry.date));
  return { file, entry, conflict: entry.status === 'claimed' && rival ? { product: rival.product, date: rival.date, at: rival.at || null } : null };
}
