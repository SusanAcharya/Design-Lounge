import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Library } from '../src/library.mjs';
import { classifyFace, rolesFromMeasure, matchThemes, matchPairings, matchFamily, sectionKinds, heroShape, matchReference, readMeasure, measureUrl } from '../src/reference.mjs';
import { classifyFont } from '../src/fonts.mjs';

const lib = new Library();
const here = path.dirname(fileURLToPath(import.meta.url));

test('renamed faces resolve to the face they are', () => {
  assert.equal(classifyFace('GeistSans').via, 'geist');
  assert.equal(classifyFace('NotionInter').via, 'inter');
  assert.equal(classifyFace('sohne-var').guessed, false);
});

test('a theme by its own colours matches itself first', () => {
  const t = lib.theme('kiln').colors;
  const top = matchThemes(lib, { mode: 'light', bg: t.bg, surface: t.surface, ink: t.ink, accent: t.primary })[0];
  assert.equal(top.id, 'kiln');
  assert.ok(top.score < 0.01);
});

test('pairings: the same faces win, and a shared name beats a near style', () => {
  const geist = { ...classifyFont('Geist'), family: 'Geist', weight: 600 };
  assert.equal(matchPairings(lib, { display: geist, text: geist })[0].id, 'developer-docs');
  const caslon = { ...classifyFont('Libre Caslon Text'), family: 'TNYAdobeCaslonPro', weight: 400 };
  assert.equal(matchPairings(lib, { display: caslon, text: caslon })[0].id, 'bookish');
});

test('families: cards decide the radius, pill buttons lean soft, a hard offset shadow is bold', () => {
  assert.equal(matchFamily(lib, { mode: 'light', radius: 4, cardRadius: 6, shadow: 'none', buttons: 'solid', glass: false })[0].id, 'quiet');
  assert.equal(matchFamily(lib, { mode: 'light', radius: 999, cardRadius: 24, shadow: 'none', buttons: 'solid', glass: false })[0].id, 'soft');
  assert.equal(matchFamily(lib, { mode: 'light', radius: 4, cardRadius: 4, shadow: 'hard', buttons: 'solid', glass: false })[0].id, 'bold');
  assert.equal(matchFamily(lib, { mode: 'light', radius: 0, cardRadius: 0, shadow: 'none', buttons: 'outline', glass: false })[0].id, 'sharp');
});

test('sections and hero shape read like a designer would', () => {
  const kinds = sectionKinds([
    { tag: 'section', cls: 'pricing', heading: 'Plans', prices: 3, cards: 3 },
    { tag: 'section', cls: '', heading: 'Questions', details: 4 },
    { tag: 'footer', cls: '', heading: '' },
  ].map((s) => ({ quotes: 0, logos: 0, images: 0, forms: 0, prices: 0, details: 0, cards: 0, height: 400, ...s })));
  assert.deepEqual(kinds.map((k) => k.kind), ['pricing', 'faq', 'footer']);
  assert.equal(heroShape({ firstScreen: { media: 0.7 }, heroBg: null }, { accent: null }), 'object');
  assert.equal(heroShape({ firstScreen: { media: 0.05, headline: 96 }, heroBg: null }, { accent: null }), 'type');
});

test('measuring a real page end to end: the fixture comes back as its own kit', async (t) => {
  const m = await measureUrl(pathToFileURL(path.join(here, 'fixtures', 'good', 'index.html')).href);
  if (!m) return t.skip('Chromium is not installed');
  const input = readMeasure(m);
  assert.equal(input.roles.bg, '#f3efe6');
  assert.equal(input.roles.ink, '#171512');
  const match = matchReference(lib, input);
  assert.equal(match.themes[0].id, 'paper-ink');
  assert.ok(match.pairings.slice(0, 3).some((p) => p.id === 'gallery-wall'), JSON.stringify(match.pairings));
  assert.ok(match.pieces.hero.length);
});

test('rolesFromMeasure picks the chromatic button colour as the accent', () => {
  const roles = rolesFromMeasure({ colours: { ground: '#ffffff', area: [['#ffffff', 9], ['#f5f5f7', 2]], text: [['#1d1d1f', 900], ['#6e6e73', 200]], controls: [['#0071e3', 50]], links: [], borders: [] } });
  assert.deepEqual([roles.mode, roles.bg, roles.surface, roles.ink, roles.accent], ['light', '#ffffff', '#f5f5f7', '#1d1d1f', '#0071e3']);
});
