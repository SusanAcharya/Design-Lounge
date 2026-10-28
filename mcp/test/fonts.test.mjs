import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FONTS, classifyFont, parseTypeDescription, fontDistance } from '../src/fonts.mjs';

const PAIRING_FACES = [
  'Literata', 'Public Sans', 'Instrument Serif', 'JetBrains Mono', 'Silkscreen', 'Space Mono', 'Gloock', 'Figtree', 'Outfit', 'DM Mono',
  'Libre Caslon Text', 'Karla', 'Archivo Black', 'Archivo', 'Bagel Fat One', 'Fredoka', 'Anton', 'Crimson Pro', 'EB Garamond',
  'Hanken Grotesk', 'Italiana', 'Josefin Sans', 'Noto Serif Devanagari', 'Mukta', 'IBM Plex Mono', 'Geist', 'Geist Mono',
  'Plus Jakarta Sans', 'Inter', 'Young Serif', 'Sora', 'Caveat', 'Chakra Petch', 'Share Tech Mono', 'Bricolage Grotesque',
  'Big Shoulders Display', 'IBM Plex Sans', 'Gochi Hand', 'Patrick Hand', 'Playfair Display', 'Cormorant Garamond', 'Work Sans',
  'DM Serif Display', 'DM Sans', 'Bodoni Moda', 'Tenor Sans', 'Cinzel', 'Spectral', 'Familjen Grotesk', 'Chivo Mono', 'Monoton',
  'Newsreader', 'Noto Serif Display', 'Inter Tight', 'Pixelify Sans', 'Lexend', 'Baloo 2', 'Nunito', 'Bebas Neue', 'Red Hat Display',
  'Red Hat Mono', 'Rubik Mono One', 'Rubik', 'Space Grotesk', 'Zilla Slab', 'Syne', 'Manrope', 'Schibsted Grotesk', 'Fraunces',
  'Instrument Sans', 'Anybody', 'Epilogue', 'Unbounded', 'Onest', 'Michroma',
];
const KINDS = ['sans', 'serif', 'slab', 'mono', 'display', 'script', 'pixel'];
const STYLES = ['geometric', 'grotesk', 'neo-grotesk', 'humanist', 'rounded', 'didone', 'transitional', 'oldstyle', 'glyphic', 'slab', 'mono', 'handwritten', 'blackletter', 'pixel', 'decorative', 'tech'];

test('every library pairing face is in the table', () => {
  for (const face of PAIRING_FACES) {
    const c = classifyFont(face);
    assert.equal(c.guessed, false, face);
    assert.equal(c.family, face);
  }
});

test('the table uses only known values', () => {
  assert.ok(Object.keys(FONTS).length > 270);
  for (const [name, c] of Object.entries(FONTS)) {
    assert.equal(name, name.toLowerCase(), name);
    assert.ok(KINDS.includes(c.kind), name);
    assert.ok(STYLES.includes(c.style), name);
    if (c.contrast) assert.ok(['low', 'medium', 'high'].includes(c.contrast), name);
    if (c.width) assert.ok(['condensed', 'normal', 'wide'].includes(c.width), name);
  }
});

test('spot checks', () => {
  assert.deepEqual(classifyFont('Inter'), { family: 'Inter', kind: 'sans', style: 'neo-grotesk', guessed: false });
  const playfair = classifyFont('Playfair Display');
  assert.equal(playfair.kind, 'serif');
  assert.ok(['didone', 'transitional'].includes(playfair.style));
  assert.equal(playfair.contrast, 'high');
  assert.equal(classifyFont('JetBrains Mono').kind, 'mono');
  assert.deepEqual([classifyFont('Bebas Neue').kind, classifyFont('Bebas Neue').width], ['sans', 'condensed']);
  assert.deepEqual([classifyFont('Caveat').kind, classifyFont('Caveat').style], ['script', 'handwritten']);
  assert.equal(classifyFont('Söhne').guessed, false);
  assert.equal(classifyFont('sohne').guessed, false);
  assert.equal(classifyFont('Söhne Mono').kind, 'mono');
  assert.equal(classifyFont('Monoton').kind, 'display');
  assert.equal(classifyFont('Georgia').kind, 'serif');
  assert.equal(classifyFont('-apple-system').guessed, false);
});

test('names are normalised before lookup', () => {
  assert.equal(classifyFont('Inter Variable').style, 'neo-grotesk');
  assert.equal(classifyFont('Inter Variable').guessed, false);
  assert.equal(classifyFont('"Inter"').family, 'Inter');
  assert.equal(classifyFont("'Geist Mono'").kind, 'mono');
  assert.equal(classifyFont('JetBrains-Mono-Regular').kind, 'mono');
  assert.equal(classifyFont('Fraunces VF').guessed, false);
  assert.equal(classifyFont('Lato Display').style, 'humanist');
  assert.equal(classifyFont('Inter Condensed').width, 'condensed');
  assert.equal(classifyFont('Inter Condensed').guessed, false);
});

test('generic families and unknown names', () => {
  assert.equal(classifyFont('serif').kind, 'serif');
  assert.equal(classifyFont('sans-serif').kind, 'sans');
  assert.equal(classifyFont('monospace').kind, 'mono');
  assert.equal(classifyFont('cursive').kind, 'script');
  const cases = [
    ['Acme Code', 'mono', 'mono'], ['Foo Slab', 'slab', 'slab'], ['Brand Serif', 'serif', 'transitional'],
    ['Brand Sans Serif', 'sans', 'neo-grotesk'], ['Quill Script', 'script', 'handwritten'], ['Tiny Pixel', 'pixel', 'pixel'],
    ['House Grotesk', 'sans', 'grotesk'], ['Studio Grotesque', 'sans', 'grotesk'], ['Mystery Face', 'sans', 'neo-grotesk'],
  ];
  for (const [name, kind, style] of cases) {
    const c = classifyFont(name);
    assert.equal(c.guessed, true, name);
    assert.deepEqual([c.kind, c.style], [kind, style], name);
  }
  assert.equal(classifyFont('House Sans Narrow').width, 'condensed');
});

test('descriptions split into display and text', () => {
  assert.deepEqual(parseTypeDescription('high-contrast didone serif headline, neutral grotesk body'), {
    display: { kind: 'serif', style: 'didone', contrast: 'high' },
    text: { kind: 'sans', style: 'neo-grotesk' },
  });
  const rounded = parseTypeDescription('rounded friendly sans');
  assert.deepEqual(rounded.display, { kind: 'sans', style: 'rounded' });
  assert.deepEqual(rounded.text, rounded.display);
  const poster = parseTypeDescription('condensed poster sans');
  assert.deepEqual(poster.display, { kind: 'sans', style: 'grotesk', width: 'condensed' });
  assert.deepEqual(poster.text, poster.display);
  const mono = parseTypeDescription('monospace everywhere');
  assert.deepEqual([mono.display.kind, mono.text.kind], ['mono', 'mono']);
  assert.deepEqual(parseTypeDescription('geometric sans display, humanist sans body'), {
    display: { kind: 'sans', style: 'geometric' },
    text: { kind: 'sans', style: 'humanist' },
  });
  const both = parseTypeDescription('old-style serif for headings and body');
  assert.equal(both.display.style, 'oldstyle');
  assert.equal(both.text.style, 'oldstyle');
  const named = parseTypeDescription('Inter-like body with a Playfair headline');
  assert.equal(named.display.kind, 'serif');
  assert.equal(named.text.style, 'neo-grotesk');
  const headOnly = parseTypeDescription('a slab serif headline');
  assert.equal(headOnly.display.kind, 'slab');
  assert.equal(headOnly.text, null);
  assert.deepEqual(parseTypeDescription('nothing about type here'), { display: null, text: null });
});

test('distance ranks closer faces first', () => {
  assert.equal(fontDistance('Inter', 'Inter'), 0);
  assert.equal(fontDistance('Inter', 'Helvetica'), 0);
  assert.ok(fontDistance('Inter', 'Helvetica') < fontDistance('Inter', 'Playfair Display'));
  assert.ok(fontDistance('Inter', 'Work Sans') < fontDistance('Inter', 'Poppins'));
  assert.equal(fontDistance('Bodoni Moda', 'Playfair Display'), 0.5);
  assert.ok(fontDistance('JetBrains Mono', 'Chakra Petch') < fontDistance('JetBrains Mono', 'Inter'));
  assert.ok(fontDistance('Monoton', 'Anton') < fontDistance('Monoton', 'Inter'));
  assert.equal(fontDistance('Inter', 'Inter Tight'), 0);
  assert.equal(fontDistance('Inter', 'Roboto Condensed'), 0.5);
  const want = parseTypeDescription('high-contrast didone serif headline').display;
  const ranked = ['Inter', 'EB Garamond', 'Bodoni Moda', 'Zilla Slab'].sort((a, b) => fontDistance(want, a) - fontDistance(want, b));
  assert.equal(ranked[0], 'Bodoni Moda');
});
