// Turn findings into a report an agent can act on: scores per area, fails first, each with its evidence and fix.
import path from 'node:path';

export const AREAS = {
  design: { title: 'Design: AI giveaways and kit', parts: ['copy', 'slop', 'kit', 'craft', 'render'] },
  a11y: { title: 'Accessibility', parts: ['a11y'] },
  seo: { title: 'SEO', parts: ['seo'] },
  aeo: { title: 'AEO: answer engines', parts: ['aeo'] },
  geo: { title: 'GEO: generative engines', parts: ['geo'] },
};
const MARK = { fail: '✗', warn: '!', info: '·' };
const WEIGHT = { fail: 14, warn: 5, info: 1 };

export function scoreOf(findings) {
  return Math.max(0, 100 - findings.reduce((n, f) => n + WEIGHT[f.level], 0));
}

function line(f) {
  const ev = f.evidence?.length ? `\n  ${f.evidence.map((e) => `\`${String(e).replace(/`/g, "'")}\``).join(' · ')}` : '';
  const ref = f.ref ? ` (${f.ref})` : '';
  return `- ${MARK[f.level]} **${f.title}**${ev}\n  Fix: ${f.fix}${ref}`;
}

export function formatReport({ label, kit, findings, facts, render, only }) {
  const out = [];
  out.push(`# Review: ${label}`);
  if (kit) {
    const parts = [kit.theme && `theme ${kit.theme}`, kit.pairing && `pairing ${kit.pairing}`, kit.family && `family ${kit.family}`, kit.free && 'Free mode', kit.named && `named aesthetic: ${kit.named}`].filter(Boolean);
    out.push(`Kit: ${parts.length ? parts.join(' · ') : 'none locked, so kit checks are general'}${kit.designMd ? ` (read from ${kit.designMd})` : ''}`);
  }
  if (render) {
    if (render.skipped) out.push(`Looked at: not looked. ${render.skipped}`);
    else out.push(`Looked at: ${render.shots.map((s) => path.basename(s)).join(', ')} in ${render.dir}, with Chromium, reduced motion on.${render.images?.length ? ' The web and phone frames are attached below. Look at them: what do you remember after five seconds, and could it be anyone\'s site?' : ' Open them before you call it done.'}`);
  }
  const areas = Object.entries(AREAS).filter(([k]) => !only || only.includes(k));
  out.push('', '| Area | Score | Fails | Warnings |', '| --- | --- | --- | --- |');
  for (const [k, a] of areas) {
    const fs = findings.filter((f) => a.parts.includes(f.area));
    if (k === 'a11y' && render?.skipped && !fs.length) { out.push(`| ${a.title} | not run | | |`); continue; }
    out.push(`| ${a.title} | ${scoreOf(fs)} | ${fs.filter((f) => f.level === 'fail').length} | ${fs.filter((f) => f.level === 'warn').length} |`);
  }
  out.push('', 'Scores count what failed: 14 per fail, 5 per warning. They measure this checklist, not a ranking.');

  const fails = findings.filter((f) => f.level === 'fail');
  if (fails.length) {
    out.push('', '## Fix first');
    fails.slice(0, 8).forEach((f, i) => out.push(`${i + 1}. **${f.title}**: ${f.fix}`));
  } else out.push('', 'No fails. Read the warnings: each one is a judgment call, and some are right for this page.');

  for (const [, a] of areas) {
    const fs = findings.filter((f) => a.parts.includes(f.area)).sort((x, y) => WEIGHT[y.level] - WEIGHT[x.level]);
    if (!fs.length) continue;
    out.push('', `## ${a.title}`, ...fs.map(line));
  }

  if (facts) {
    out.push('', '## What the page says about itself');
    const rows = [
      ['Title', facts.title], ['Description', facts.description], ['h1', facts.h1], ['Opening sentence', facts.lead],
      ['Words in the HTML as served', facts.serverWords], ['Words after scripts run', facts.renderedWords],
      ['JSON-LD', facts.jsonLd?.length ? facts.jsonLd.join(', ') : 'none'], ['Share image', facts.ogImage],
      ['Question headings', facts.questions], ['llms.txt', facts.llmsTxt == null ? null : facts.llmsTxt ? 'yes' : 'no'],
      ['Faces rendered', facts.faces], ['Body text', facts.bodySize && `${facts.bodySize}px`],
    ].filter(([, v]) => v != null && v !== '');
    for (const [k, v] of rows) out.push(`- ${k}: ${typeof v === 'string' ? v.replace(/\s+/g, ' ').slice(0, 200) : v}`);
  }
  out.push('', 'After fixing, run the review again. A fail that is still on the screen means the pass is open.');
  return out.join('\n');
}
