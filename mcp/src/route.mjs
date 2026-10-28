// Read a request the way "What they are asking" in SKILL.md and "Reading the request" in brief.md do.
// The server suggests; the agent decides. Every signal says which words triggered it.
import fs from 'node:fs';
import path from 'node:path';
import { CALM_WORDS } from './picks.mjs';

const has = (re, s) => { const m = s.match(re); return m ? m[0] : null; };

export function readRequest(request, lib) {
  const s = ` ${request.toLowerCase()} `;
  const signals = {};
  signals.justBuild = has(/\b(?:just build it|just build|go ahead|decide for me|you decide|don'?t ask|no questions)\b|\bgo\b[.!]?\s*$/, s);
  signals.spectacle = has(/\b(?:go wild|unforgettable|awwwards|site of the day|award[- ]level|award[- ]winning|an experience|immersive|mind[- ]blowing|jaw[- ]dropping|wow factor)\b|\byou scroll and\b|\blet people play\b/, s);
  signals.calm = CALM_WORDS.filter((w) => new RegExp(`\\b${w}\\b`).test(s));
  signals.redesign = has(/\b(?:redesign|revamp|refresh|re-skin|reskin|modernise|modernize|make (?:it|my|our|this) (?:site |website |app )?(?:look )?better|improve (?:my|our|the) (?:site|website|app|landing))\b/, s);
  signals.reference = has(/https?:\/\/\S+|\b[a-z0-9-]+\.(?:com|io|app|co|dev|design|studio|live|org|net)\b(?!\s*(?:domain|address))|\b(?:screenshot|like this (?:site|website|page|one)|this reference|in the style of this)\b/, s);
  signals.brand = has(/\b(?:look|feel)s? like (?:stripe|linear|apple|notion|vercel|airbnb|figma|github|spotify|framer|arc|raycast|[a-z]+\.(?:com|io|app))\b|\bin the style of [a-z]+\b|\blike (?:stripe|linear|apple|notion|vercel)'?s?\b/, s);
  signals.platform = has(/\b(?:react native|expo|flutter|swiftui|jetpack compose|compose)\b/, s) || has(/\b(?:ios|android|iphone|phone app|mobile app)\b/, s) || has(/\bpwa\b|progressive web app/, s) || has(/\b(?:electron|tauri|desktop app|mac app)\b/, s);
  signals.app = has(/\b(?:dashboard|admin|back ?office|ops|internal tool|crm|web app|logged[- ]in|saas app|portal)\b/, s);
  signals.game = has(/\b(?:game|lobby|leaderboard|scoreboard|arcade)\b/, s);
  signals.three = has(/\b(?:three\.?js|3d scene|webgl|orbit)\b/, s);
  signals.handwritten = has(/\b(?:handwritten|hand-lettered|hand lettered)\b/, s);
  signals.brandKit = has(/\b(?:brand kit|brand board|identity|logo system|logo|brand guidelines)\b/, s);
  signals.piece = !/\b(?:site|website|app|homepage|landing|portfolio|shop|store)\b/.test(s) && has(/\b(?:button|modal|dialog|table|navbar|nav bar|menu|dropdown|form|card|hero section|footer|pricing table|tabs|toast|tooltip|date picker|sidebar|chart|component|widget|loader|toggle)\b/, s);
  signals.libraryOnly = !/\b(?:site|website|app|page|screen)\b/.test(s) && has(/\b(?:palette|colou?rs?|font|fonts|type pairing|typeface|icons?|easing|motion tokens?)\b/, s);
  signals.options = has(/\b(?:show me options|some options|a few options|choose between|two looks|alternatives)\b/, s);

  const styles = [];
  for (const [said, route] of lib.styleRows()) {
    const words = said.replace(/["*]/g, '').split(/,|\bor\b/).map((w) => w.trim().toLowerCase()).filter((w) => w.length > 2 && !/\(|with|no colour|signature/.test(w));
    const hit = words.find((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(s));
    if (hit) styles.push({ said: hit, route: route.slice(0, 220) });
  }

  // The first row of the table that matches wins.
  let flow, why;
  if (signals.reference && !signals.redesign) { flow = 'Reference flow (flows.md): match_reference on the site or screenshot first, then the flow for what they are making'; why = signals.reference; }
  else if (signals.redesign) { flow = 'Adopt flow, then Redesign (the audit). Run review_page on the current site first'; why = signals.redesign; }
  else if (signals.brand) { flow = 'Brand flow (flows.md)'; why = signals.brand; }
  else if (signals.libraryOnly) { flow = 'Library flow: browse_library, get_theme, get_pairing, search_wada, get_icons'; why = signals.libraryOnly; }
  else if (signals.piece) { flow = 'Piece flow: search_pieces, then get_piece, inside the locked kit if one exists'; why = signals.piece; }
  else if (signals.brandKit) { flow = 'Kit flow, then Brand board in taste.md'; why = signals.brandKit; }
  else if (signals.three && !signals.spectacle) { flow = 'Kit flow, recipe game, direction Orbit'; why = signals.three; }
  else if (signals.game) { flow = 'Kit flow, recipe game, then Games and Three.js in taste.md'; why = signals.game; }
  else if (signals.handwritten) { flow = 'Kit flow, recipe notebook'; why = signals.handwritten; }
  else if (signals.platform) { flow = 'Kit flow, then the app short path (flows.md) and native.md'; why = signals.platform; }
  else if (signals.app) { flow = `Kit flow, then the app short path, recipe ${/dashboard|admin|ops|internal|back ?office/.test(signals.app) ? 'dashboard' : 'web-app'}`; why = signals.app; }
  else if (signals.spectacle) { flow = 'Kit flow, then Show mode (show.md). Free colour and type unless they named a theme, colour, or brand'; why = signals.spectacle; }
  else { flow = 'Kit flow'; why = 'a new product, site, or app'; }
  if (styles.length) flow = `Named aesthetic first (styles.md row for "${styles[0].said}"), then ${flow}`;
  if (signals.options) flow += '. They asked for options: Kit flow twice, on two directions that differ in theme, pairing, and hero';

  const ambition = signals.spectacle ? 'spectacle' : 'finished';
  const mode = signals.spectacle ? 'Show, Free' : 'Kit';
  return { signals, styles, flow, why, ambition, mode };
}

/** What is already in the project folder: a DESIGN.md, a stack, or nothing. */
export function readProject(dir) {
  if (!dir) return null;
  const root = path.resolve(dir);
  if (!fs.existsSync(root)) return { dir: root, exists: false };
  const files = fs.readdirSync(root).filter((f) => !f.startsWith('.'));
  const out = { dir: root, exists: true, empty: files.length === 0 };
  const design = path.join(root, 'DESIGN.md');
  if (fs.existsSync(design)) {
    const text = fs.readFileSync(design, 'utf8');
    out.designMd = { file: design, hasBrief: /^## Brief/m.test(text), head: text.slice(0, 1200) };
  }
  const pkgFile = path.join(root, 'package.json');
  if (fs.existsSync(pkgFile)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      out.stack = ['next', 'astro', '@sveltejs/kit', 'nuxt', 'vue', 'react', 'solid-js', 'svelte', 'expo', 'react-native', 'tailwindcss', 'electron', '@tauri-apps/api'].filter((d) => deps[d]);
    } catch { out.stack = ['package.json (unreadable)']; }
  } else if (files.includes('pubspec.yaml')) out.stack = ['flutter'];
  else if (files.some((f) => f.endsWith('.xcodeproj'))) out.stack = ['swiftui'];
  else if (files.includes('index.html')) out.stack = ['plain html'];
  return out;
}
