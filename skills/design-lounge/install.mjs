#!/usr/bin/env node
/** Copy this skill, library included, into the current project's agent folders. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skillDir = path.dirname(fileURLToPath(import.meta.url));
const targets = ['.cursor/skills', '.agents/skills', '.claude/skills'];
const destName = 'design-lounge';
const root = process.cwd();

if (fs.existsSync(path.join(root, 'src/content/pieces')) && fs.existsSync(path.join(root, 'src/demos'))) {
  console.error('This is the Design Lounge repo. Run the installer from the product you want to design, not from the library.');
  process.exit(1);
}

if (!fs.existsSync(path.join(skillDir, 'library', 'map.json'))) {
  console.error('This skill has no library. From the Design Lounge repo run: node --experimental-strip-types scripts/sync-skill.mjs');
  process.exit(1);
}

function copySkill(dest) {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(skillDir)) {
    if (name === 'install.mjs') continue;
    fs.cpSync(path.join(skillDir, name), path.join(dest, name), { recursive: true });
  }
}

for (const folder of targets) {
  const dest = path.join(root, folder, destName);
  copySkill(dest);
  console.log(`installed ${path.relative(root, dest)}`);
}

console.log('Design Lounge is installed. Ask your agent for a design, a palette, or a screen.');
