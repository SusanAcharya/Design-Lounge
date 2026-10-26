#!/usr/bin/env node
// Release design-lounge-mcp in one step: sync the skill from the library, test, bump the version in package.json and
// server.json together, publish to npm (which bundles the skill and pictures first), publish to the MCP Registry,
// then commit and tag. It never pushes: push when you are ready.
//
//   pnpm --dir mcp release patch            0.2.0 -> 0.2.1 (also minor, major, or an exact version)
//   pnpm --dir mcp release patch --otp 123456
//   pnpm --dir mcp release patch --dry-run  everything except the publishes, the commit, and the tag
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const mcp = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.dirname(mcp);
const argv = process.argv.slice(2);
const dry = argv.includes('--dry-run');
const otp = argv.includes('--otp') ? argv[argv.indexOf('--otp') + 1] : null;
const bump = argv.find((a) => !a.startsWith('--') && a !== otp) || 'patch';

const run = (cmd, args, cwd = mcp) => { console.log(`\n$ ${cmd} ${args.join(' ')}`); execFileSync(cmd, args, { cwd, stdio: 'inherit' }); };
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const writeJson = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');

function next(version, how) {
  if (/^\d+\.\d+\.\d+$/.test(how)) return how;
  const [a, b, c] = version.split('.').map(Number);
  if (how === 'major') return `${a + 1}.0.0`;
  if (how === 'minor') return `${a}.${b + 1}.0`;
  if (how === 'patch') return `${a}.${b}.${c + 1}`;
  throw new Error(`Bump must be patch, minor, major, or x.y.z, not "${how}".`);
}

const pkgFile = path.join(mcp, 'package.json');
const serverFile = path.join(mcp, 'server.json');
const pkg = readJson(pkgFile);
const version = next(pkg.version, bump);
console.log(`design-lounge-mcp ${pkg.version} -> ${version}${dry ? ' (dry run)' : ''}`);

// 1. The skill's library comes from the site's sources. Sync it, so the package carries what the site shows.
run('node', ['--experimental-strip-types', 'scripts/sync-skill.mjs'], repo);
run('node', ['scripts/check-build.mjs'], repo);

// 2. Tests, against the synced skill.
run('node', ['--test', ...fs.readdirSync(path.join(mcp, 'test')).filter((f) => f.endsWith('.test.mjs')).map((f) => `test/${f}`)]);

// 3. One version everywhere.
const server = readJson(serverFile);
pkg.version = version;
server.version = version;
for (const p of server.packages) if (p.identifier === pkg.name) p.version = version;
if (!dry) { writeJson(pkgFile, pkg); writeJson(serverFile, server); }

// 4. npm. prepack bundles the skill, thumbnails, and demos.
if (dry) run('npm', ['pack', '--dry-run']);
else run('npm', ['publish', '--access', 'public', ...(otp ? ['--otp', otp] : [])]);

// 5. The MCP Registry reads the package's mcpName, so npm must come first.
if (!dry) {
  try { run('mcp-publisher', ['publish']); }
  catch { console.error('\nThe registry publish failed. If you are not signed in, run `mcp-publisher login github` in mcp/, then `mcp-publisher publish`.'); }
}

// 6. Commit the bump and tag it. Pushing is yours.
if (!dry) {
  run('git', ['add', 'mcp/package.json', 'mcp/server.json'], repo);
  run('git', ['commit', '-m', `Release design-lounge-mcp ${version}`], repo);
  run('git', ['tag', `mcp-v${version}`], repo);
  console.log(`\nReleased ${version}. When you are ready: git push && git push origin mcp-v${version}`);
}
