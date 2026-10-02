#!/usr/bin/env node
/** Copy this skill into the current project's agent folders. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skillDir = path.dirname(fileURLToPath(import.meta.url));
const files = ['SKILL.md', 'reference.md', 'examples.md', 'lounge.json', 'resolve.mjs'];
const targets = ['.cursor/skills', '.agents/skills', '.claude/skills'];
const destName = 'design-lounge';
const root = process.cwd();

if (fs.existsSync(path.join(root, 'src/content/pieces')) && fs.existsSync(path.join(root, 'src/demos'))) {
  console.error('This is the Design Lounge repo. Run the installer from the product you want to design, not from the library.');
  process.exit(1);
}

for (const folder of targets) {
  const dest = path.join(root, folder, destName);
  fs.mkdirSync(dest, { recursive: true });
  for (const file of files) {
    fs.copyFileSync(path.join(skillDir, file), path.join(dest, file));
  }
  console.log(`installed ${path.relative(root, dest)}`);
}

console.log('Design Lounge skill is in this project. Ask your agent for a design, a palette, or a screen.');
