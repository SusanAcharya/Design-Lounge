// Classify font families by kind (sans, serif, mono, ...) and style (geometric, didone, ...), so a reference site's
// type can be described in the library's terms and matched to the nearest pairing. Plain data plus a few lookups.

// Each group is [kind, style, extra, names]. Names are lowercase family names as CSS writes them.
const GROUPS = [
  /* ---------- sans ---------- */
  ['sans', 'neo-grotesk', {}, [
    'inter', 'inter tight', 'inter display', 'public sans', 'geist', 'ibm plex sans', 'instrument sans', 'roboto', 'roboto flex',
    'arimo', 'heebo', 'be vietnam pro', 'sofia sans', 'golos text', 'geologica', 'pretendard', 'helvetica', 'helvetica neue',
    'helvetica now', 'arial', 'neue haas grotesk', 'neue haas unica', 'untitled sans', 'graphik', 'neue montreal',
    'pp neue montreal', 'pp mori', 'switzer', 'sf pro', 'sf pro display', 'sf pro text', 'san francisco', '-apple-system',
    'blinkmacsystemfont', 'system-ui', 'ui-sans-serif', 'liberation sans', 'dejavu sans', 'nimbus sans', 'akkurat', 'aktiv grotesk',
  ]],
  ['sans', 'neo-grotesk', { width: 'condensed' }, ['roboto condensed', 'sofia sans condensed', 'ibm plex sans condensed', 'helvetica neue condensed']],
  ['sans', 'grotesk', {}, [
    'karla', 'archivo', 'archivo black', 'hanken grotesk', 'bricolage grotesque', 'work sans', 'familjen grotesk', 'space grotesk',
    'schibsted grotesk', 'anybody', 'epilogue', 'libre franklin', 'franklin gothic', 'chivo', 'overpass', 'barlow', 'encode sans',
    'din', 'din pro', 'din next', 'akzidenz grotesk', 'söhne', 'gt america', 'founders grotesk', 'abc diatype', 'abc favorit',
    'abc monument grotesk', 'monument grotesk', 'basis grotesque', 'apercu', 'calibre', 'messina sans', 'matter', 'haffer', 'mabry',
    'clash display', 'cabinet grotesk', 'rethink sans', 'darker grotesque', 'host grotesk', 'funnel sans', 'funnel display',
  ]],
  ['sans', 'grotesk', { width: 'condensed' }, [
    'anton', 'bebas neue', 'big shoulders display', 'oswald', 'archivo narrow', 'barlow condensed', 'fjalla one',
    'pathway gothic one', 'league gothic', 'encode sans condensed', 'alumni sans', 'druk', 'druk condensed', 'tusker grotesk',
    'antonio', 'six caps',
  ]],
  ['sans', 'grotesk', { width: 'wide' }, ['syne', 'söhne breit', 'druk wide', 'archivo expanded', 'monument extended', 'pp monument extended']],
  ['sans', 'geometric', {}, [
    'figtree', 'outfit', 'josefin sans', 'plus jakarta sans', 'sora', 'dm sans', 'lexend', 'lexend deca', 'red hat display',
    'red hat text', 'manrope', 'onest', 'montserrat', 'poppins', 'raleway', 'urbanist', 'kanit', 'albert sans', 'mulish', 'jost',
    'league spartan', 'questrial', 'prompt', 'futura', 'futura pt', 'avenir', 'avenir next', 'century gothic', 'gotham', 'gilroy',
    'proxima nova', 'brandon grotesque', 'circular', 'circular std', 'gt walsheim', 'euclid circular a', 'euclid circular b',
    'satoshi', 'general sans', 'aeonik', 'chillax', 'tt commons', 'cera pro', 'museo sans', 'nexa', 'spartan', 'didact gothic',
    'righteous', 'wix madefor display', 'wix madefor text', 'reddit sans',
  ]],
  ['sans', 'geometric', { width: 'wide' }, ['unbounded', 'lexend zetta', 'krona one', 'syncopate']],
  ['sans', 'humanist', {}, [
    'mukta', 'tenor sans', 'open sans', 'lato', 'source sans 3', 'source sans pro', 'pt sans', 'noto sans', 'ubuntu', 'fira sans',
    'cabin', 'assistant', 'segoe ui', 'verdana', 'tahoma', 'trebuchet ms', 'gill sans', 'gill sans mt', 'optima', 'myriad pro',
    'frutiger', 'calibri', 'nunito sans', 'hind', 'alegreya sans', 'merriweather sans', 'catamaran', 'asap', 'oxygen', 'cantarell',
    'atkinson hyperlegible', 'atkinson hyperlegible next', 'titillium web', 'source sans', 'lucida grande', 'lucida sans', 'fira sans condensed',
    'ff meta', 'meta', 'noto sans display',
  ]],
  ['sans', 'humanist', { width: 'condensed' }, ['pt sans narrow', 'ubuntu condensed', 'open sans condensed', 'yanone kaffeesatz']],
  ['sans', 'rounded', {}, [
    'fredoka', 'baloo 2', 'nunito', 'rubik', 'quicksand', 'varela round', 'comfortaa', 'm plus rounded 1c', 'sf pro rounded',
    'ui-rounded', 'gt maru', 'lilita one', 'mplus rounded', 'arial rounded mt bold', 'dosis', 'baloo', 'grandstander',
  ]],
  ['sans', 'tech', {}, ['chakra petch', 'saira', 'rajdhani', 'exo 2', 'exo', 'oxanium', 'electrolize', 'tomorrow']],
  ['sans', 'tech', { width: 'condensed' }, ['teko']],
  ['sans', 'tech', { width: 'wide' }, ['michroma', 'orbitron', 'audiowide', 'eurostile', 'zen dots']],
  ['sans', 'handwritten', {}, ['comic sans ms', 'comic neue', 'comic sans']],

  /* ---------- serif ---------- */
  ['serif', 'didone', { contrast: 'high' }, [
    'gloock', 'italiana', 'bodoni moda', 'libre bodoni', 'bodoni', 'bodoni 72', 'didot', 'prata', 'abril fatface', 'yeseva one',
    'antic didone', 'gt super', 'gt super display', 'playfair display sc', 'rozha one', 'chonburi',
  ]],
  ['serif', 'transitional', { contrast: 'high' }, [
    'playfair display', 'playfair', 'dm serif display', 'noto serif display', 'tiempos headline', 'freight display', 'editorial new',
    'pp editorial new', 'reckless', 'reckless neue', 'domaine display', 'zodiak', 'gt sectra', 'old standard tt', 'gambetta',
  ]],
  ['serif', 'transitional', { contrast: 'high', width: 'condensed' }, ['instrument serif']],
  ['serif', 'transitional', { contrast: 'medium' }, [
    'literata', 'noto serif devanagari', 'spectral', 'newsreader', 'merriweather', 'source serif 4', 'source serif pro', 'pt serif',
    'libre baskerville', 'baskerville', 'lora', 'noto serif', 'gelasio', 'georgia', 'times new roman', 'times', 'tinos',
    'frank ruhl libre', 'roboto serif', 'domine', 'dm serif text', 'tiempos text', 'tiempos', 'publico', 'publico text',
    'publico headline', 'tobias', 'gt alpina', 'rufina', 'cambria', 'ui-serif', 'new york', 'charter', 'bitstream charter',
    'source serif', 'baskervville', 'libre caslon display', 'brygada 1918', 'besley',
  ]],
  ['serif', 'transitional', { contrast: 'low' }, ['ibm plex serif', 'untitled serif', 'pt serif caption', 'noto serif jp']],
  ['serif', 'oldstyle', { contrast: 'medium' }, [
    'libre caslon text', 'crimson pro', 'crimson text', 'eb garamond', 'young serif', 'fraunces', 'garamond', 'adobe garamond pro',
    'palatino', 'palatino linotype', 'book antiqua', 'alegreya', 'vollkorn', 'cardo', 'sorts mill goudy', 'goudy bookletter 1911',
    'bona nova', 'eczar', 'caslon', 'adobe caslon pro', 'hoefler text', 'iowan old style', 'lyon', 'lyon text', 'lyon display',
    'freight text', 'freight text pro', 'recoleta', 'cooper', 'cooper black', 'linden hill', 'gentium book plus', 'pt serif pro',
  ]],
  ['serif', 'oldstyle', { contrast: 'high' }, ['cormorant garamond', 'cormorant', 'cormorant infant', 'big caslon', 'ogg', 'ogg text']],
  ['serif', 'glyphic', { contrast: 'medium' }, ['cinzel', 'cinzel decorative', 'marcellus', 'trajan', 'trajan pro', 'forum', 'canela', 'canela text', 'albertus']],

  /* ---------- slab ---------- */
  ['slab', 'slab', {}, [
    'zilla slab', 'roboto slab', 'josefin slab', 'bitter', 'arvo', 'aleo', 'rockwell', 'noticia text', 'crete round', 'alfa slab one',
    'ultra', 'american typewriter', 'museo slab', 'courier prime', 'kameron', 'podkova', 'clarendon', 'egyptienne',
  ]],

  /* ---------- mono ---------- */
  ['mono', 'mono', {}, [
    'jetbrains mono', 'space mono', 'dm mono', 'ibm plex mono', 'geist mono', 'red hat mono', 'chivo mono', 'roboto mono', 'fira code',
    'fira mono', 'source code pro', 'ubuntu mono', 'inconsolata', 'courier new', 'courier', 'menlo', 'monaco', 'consolas', 'sf mono',
    'sfmono-regular', 'ui-monospace', 'berkeley mono', 'commit mono', 'söhne mono', 'anonymous pro', 'overpass mono', 'cascadia code',
    'cascadia mono', 'victor mono', 'martian mono', 'azeret mono', 'pt mono', 'noto sans mono', 'liberation mono', 'dejavu sans mono',
    'lucida console', 'andale mono', 'jetbrains mono nl', 'space grotesk mono', 'gt america mono', 'abc diatype mono',
    'input mono', 'operator mono', 'hack', 'iosevka', 'xanh mono', 'spline sans mono', 'sometype mono', 'monaspace neon', 'geist pixel mono',
  ]],
  ['mono', 'tech', {}, ['share tech mono', 'major mono display', 'syne mono', 'b612 mono']],

  /* ---------- pixel ---------- */
  ['pixel', 'pixel', {}, ['silkscreen', 'pixelify sans', 'press start 2p', 'vt323', 'dotgothic16', 'jersey 10', 'tiny5', 'micro 5', 'handjet', 'sixtyfour', 'workbench']],

  /* ---------- script ---------- */
  ['script', 'handwritten', {}, [
    'caveat', 'gochi hand', 'patrick hand', 'permanent marker', 'indie flower', 'shadows into light', 'kalam', 'architects daughter',
    'homemade apple', 'reenie beanie', 'dancing script', 'pacifico', 'lobster', 'great vibes', 'sacramento', 'satisfy', 'kaushan script',
    'allura', 'parisienne', 'courgette', 'cookie', 'yellowtail', 'nanum pen script', 'rock salt', 'just another hand', 'covered by your grace',
    'gloria hallelujah', 'handlee', 'marck script', 'nothing you could do', 'caveat brush', 'mrs saint delafield', 'pinyon script',
    'alex brush', 'brush script mt', 'snell roundhand', 'zapfino', 'bradley hand', 'segoe script', 'segoe print',
  ]],
  ['script', 'handwritten', { width: 'condensed' }, ['amatic sc']],

  /* ---------- display ---------- */
  ['display', 'decorative', {}, [
    'bagel fat one', 'monoton', 'bungee', 'bungee shade', 'bungee inline', 'fascinate', 'shrikhand', 'bowlby one', 'bowlby one sc',
    'titan one', 'chango', 'luckiest guy', 'rampart one', 'rubik glitch', 'rubik bubbles', 'climate crisis', 'dela gothic one',
    'creepster', 'fugaz one', 'sniglet', 'modak', 'gasoek one', 'rubik dirt', 'bungee spice', 'nabla', 'honk', 'tilt warp', 'tilt prism',
  ]],
  ['display', 'decorative', { width: 'wide' }, ['rubik mono one', 'lexend giga', 'bungee hairline']],
  ['display', 'decorative', { width: 'condensed' }, ['bangers', 'passion one']],
  ['display', 'tech', {}, ['black ops one', 'major mono', 'vt323 display']],
  ['display', 'blackletter', {}, ['unifrakturmaguntia', 'unifrakturcook', 'pirata one', 'old english text mt', 'grenze gotisch', 'jacquard 24', 'new rocker']],
];

/** Lowercase family name -> { kind, style, contrast?, width? }. */
export const FONTS = {};
for (const [kind, style, extra, names] of GROUPS) for (const name of names) FONTS[name] = { kind, style, ...extra };
// Plain-ASCII spellings of the Söhne family, as CSS often writes them.
for (const name of Object.keys(FONTS)) {
  const ascii = name.normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (ascii !== name && !FONTS[ascii]) FONTS[ascii] = FONTS[name];
}
Object.freeze(FONTS);

// CSS generic families: not faces, but they say what the page falls back to.
const GENERIC = {
  'serif': { kind: 'serif', style: 'transitional', contrast: 'medium' },
  'sans-serif': { kind: 'sans', style: 'neo-grotesk' },
  'monospace': { kind: 'mono', style: 'mono' },
  'cursive': { kind: 'script', style: 'handwritten' },
  'fantasy': { kind: 'display', style: 'decorative' },
  'math': { kind: 'serif', style: 'transitional', contrast: 'medium' },
};

const WEIGHTS = /[\s_-]+(?:hairline|thin|extralight|extra light|ultralight|light|regular|normal|book|roman|medium|semibold|semi bold|demibold|bold|extrabold|extra bold|ultrabold|black|heavy|italic|oblique|variable|vf|var|web|webfont|\[wght\]|\d{3})$/;
const SUFFIXES = /\s+(?:display|text|std|pro|lt|mt|neue|next|headline|deck|micro)$/;
const WIDTHS = [[/\s+(?:condensed|narrow|compressed|cond|xcondensed|extra condensed)$/, 'condensed'], [/\s+(?:wide|extended|expanded|broad)$/, 'wide']];

const lookup = (name) => FONTS[name] || FONTS[name.replace(/[-_]+/g, ' ')] || GENERIC[name] || null;

/** Guess from words in the name, for faces the table does not know. */
function guess(name) {
  const n = name.replace(/sans[\s-]?serif/g, 'sans');
  let c;
  if (/mono|code|typewriter|courier/.test(n)) c = { kind: 'mono', style: 'mono' };
  else if (/pixel|8[\s-]?bit|bitmap/.test(n)) c = { kind: 'pixel', style: 'pixel' };
  else if (/slab/.test(n)) c = { kind: 'slab', style: 'slab' };
  else if (/script|hand|brush|marker|signature/.test(n)) c = { kind: 'script', style: 'handwritten' };
  else if (/fraktur|blackletter|gotisch/.test(n)) c = { kind: 'display', style: 'blackletter' };
  else if (/serif/.test(n) && !/sans/.test(n)) c = { kind: 'serif', style: 'transitional' };
  else if (/grotesk|grotesque|gothic/.test(n)) c = { kind: 'sans', style: 'grotesk' };
  else if (/round/.test(n)) c = { kind: 'sans', style: 'rounded' };
  else c = { kind: 'sans', style: 'neo-grotesk' };
  if (/condensed|narrow|compressed/.test(n)) c.width = 'condensed';
  else if (/wide|extended|expanded/.test(n)) c.width = 'wide';
  return c;
}

/** Classify one family name, as a page or a font link writes it. */
export function classifyFont(family) {
  const raw = String(family || '').split(',')[0].trim().replace(/^["']+|["']+$/g, '').trim();
  let name = raw.toLowerCase().replace(/\s+/g, ' ');
  const found = (c, width) => ({ family: raw, ...c, ...(width ? { width } : {}), guessed: false });
  // Strip weights and file-name tails one at a time, checking the table as we go.
  for (let i = 0; i < 4; i++) {
    const hit = lookup(name);
    if (hit) return found(hit);
    const next = name.replace(WEIGHTS, '').trim();
    if (next === name) break;
    name = next;
  }
  // A width or a family tail on a known base: "Inter Condensed", "Lato Display".
  for (const [re, width] of WIDTHS) {
    const base = name.replace(re, '');
    if (base !== name && lookup(base)) return found(lookup(base), width);
  }
  const base = name.replace(SUFFIXES, '');
  if (base !== name && lookup(base)) return found(lookup(base));
  const ascii = name.normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (lookup(ascii)) return found(lookup(ascii));
  return { family: raw, ...guess(name), guessed: true };
}

/* ---------- descriptions ---------- */

const DISPLAY_ROLE = /\b(?:headlines?|headings?|headers?|display|titles?|hero|h1|h2|wordmark|logo)\b/;
const TEXT_ROLE = /\b(?:body|text|paragraphs?|copy|prose|ui|labels?|reading)\b/;
const BOTH_ROLE = /\b(?:everywhere|throughout|all text|whole (?:page|site)|only|single family|one family)\b/;

// Words to style, checked in order; the first hit wins.
const STYLE_WORDS = [
  [/\bneo grot|\bneutral\b|\bswiss\b|\bhelvetica\b|\bplain sans\b|\bsystem\b/, 'neo-grotesk'],
  [/\bgrot(?:esk|esque)\b|\bgothic sans\b|\bquirky sans\b/, 'grotesk'],
  [/\bgeometric\b|\bcircular\b|\bfutura\b/, 'geometric'],
  [/\bhumanist\b|\bwarm sans\b|\bcalligraphic sans\b/, 'humanist'],
  [/\brounded\b|\bround\b|\bsoft sans\b|\bbubbly\b/, 'rounded'],
  [/\bdidone\b|\bbodoni\b|\bdidot\b|\bfashion\b|\bmodern serif\b/, 'didone'],
  [/\btransitional\b|\bbaskerville\b|\bnewspaper\b/, 'transitional'],
  [/\bold ?style\b|\bgaralde\b|\bgaramond\b|\bvenetian\b|\bbookish\b|\bclassical\b/, 'oldstyle'],
  [/\bglyphic\b|\bincised\b|\binscriptional\b|\broman capitals\b|\bflared\b/, 'glyphic'],
  [/\bslab\b|\begyptian\b/, 'slab'],
  [/\bmono(?:space|spaced)?\b|\bcode\b|\bterminal\b|\btypewriter\b/, 'mono'],
  [/\bhand ?(?:written|writing|drawn|lettered)\b|\bscript\b|\bcursive\b|\bmarker\b|\bscrawl/, 'handwritten'],
  [/\bblackletter\b|\bfraktur\b|\bgothic script\b/, 'blackletter'],
  [/\bpixel(?:ated)?\b|\bbitmap\b|\b8 ?bit\b|\bretro game\b/, 'pixel'],
  [/\btech(?:y|no)?\b|\bfuturistic\b|\bsci fi\b|\bsquared\b|\bsquarish\b/, 'tech'],
  [/\bdecorative\b|\bnovelty\b|\bfat face\b|\bblobby\b|\binline\b|\bpsychedelic\b|\bchunky display\b/, 'decorative'],
];
const KIND_WORDS = [
  [/\bmono(?:space|spaced)?\b|\bcode\b|\bterminal\b|\btypewriter\b/, 'mono'],
  [/\bpixel(?:ated)?\b|\bbitmap\b|\b8 ?bit\b/, 'pixel'],
  [/\bslab\b|\begyptian\b/, 'slab'],
  [/\bscript\b|\bhand ?(?:written|writing|lettered)\b|\bcursive\b|\bcalligraph(?:y|ic) script\b/, 'script'],
  [/\bsans\b|\bgrot(?:esk|esque)\b/, 'sans'],
  [/\bserif\b/, 'serif'],
  [/\bdecorative\b|\bnovelty\b|\bblackletter\b|\bfraktur\b/, 'display'],
];
const STYLE_KIND = {
  geometric: 'sans', grotesk: 'sans', 'neo-grotesk': 'sans', humanist: 'sans', rounded: 'sans', tech: 'sans',
  didone: 'serif', transitional: 'serif', oldstyle: 'serif', glyphic: 'serif',
  slab: 'slab', mono: 'mono', handwritten: 'script', pixel: 'pixel', blackletter: 'display', decorative: 'display',
};
const KIND_STYLE = { sans: 'neo-grotesk', serif: 'transitional', slab: 'slab', mono: 'mono', script: 'handwritten', pixel: 'pixel', display: 'decorative' };

// Named faces in a description, longest first, so "Inter Tight" wins over "Inter". Short names would match common words.
const NAMES = Object.keys(FONTS).filter((n) => n.length > 3 && !/^(?:meta|text|matter|times|optima|hack|exo|din|ultra|display)$/.test(n)).sort((a, b) => b.length - a.length);

/** Read one clause of a description into a classification, or null if it names no type. */
function describe(clause) {
  let kind = KIND_WORDS.find(([re]) => re.test(clause))?.[1] || null;
  let style = STYLE_WORDS.find(([re]) => re.test(clause))?.[1] || null;
  let contrast = /\bhigh contrast\b|\bhairline\b|\bfashion\b/.test(clause) ? 'high'
    : /\blow contrast\b|\bmonoline\b|\bsturdy\b/.test(clause) ? 'low'
      : /\b(?:medium|moderate) contrast\b/.test(clause) ? 'medium' : null;
  const width = /\bcondensed\b|\bnarrow\b|\bcompressed\b|\btall\b|\bposter\b/.test(clause) ? 'condensed'
    : /\bwide\b|\bextended\b|\bexpanded\b/.test(clause) ? 'wide' : null;
  if (!kind && !style) {
    const named = NAMES.find((n) => new RegExp(`(?:^|\\s)${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`).test(clause));
    if (named) ({ kind, style } = FONTS[named]), contrast ||= FONTS[named].contrast || null;
  }
  if (!kind && !style && !width && !contrast) return null;
  if (!kind) kind = style ? STYLE_KIND[style] : contrast ? 'serif' : 'sans';
  // A style word that belongs to another kind ("grotesk mono") gives way to the kind word.
  const fits = style && (STYLE_KIND[style] === kind || (style === 'tech' && kind !== 'serif') || (style === 'handwritten' && kind === 'sans'));
  // A condensed poster sans is a grotesk, like Anton and Bebas Neue.
  if (!fits) style = kind === 'sans' && width === 'condensed' ? 'grotesk' : KIND_STYLE[kind];
  const out = { kind, style };
  if (contrast && (kind === 'serif' || kind === 'slab' || kind === 'display')) out.contrast = contrast;
  if (width) out.width = width;
  return out;
}

/** Turn a free description ("didone headline, neutral grotesk body") into display and text classifications. */
export function parseTypeDescription(text) {
  const s = String(text || '').toLowerCase().replace(/sans[\s-]serif/g, 'sans').replace(/[-–—]/g, ' ').replace(/\s+/g, ' ');
  const parts = s.split(/[,;+/\n.]|\bwith\b|\bplus\b|\bover\b|\band\b|\bpaired with\b|\bwhile\b|\bbut\b/).map((p) => p.trim()).filter(Boolean);
  const clauses = [];
  for (const p of parts) {
    const roles = { display: DISPLAY_ROLE.test(p), text: TEXT_ROLE.test(p) };
    if (BOTH_ROLE.test(p)) roles.display = roles.text = true;
    const type = describe(p.replace(DISPLAY_ROLE, ' ').replace(TEXT_ROLE, ' ').replace(/\s+/g, ' ').trim());
    // A clause that only names a role ("... for headings and body") lends it to the clause before.
    if (!type) { const prev = clauses.at(-1); if (prev) { prev.roles.display ||= roles.display; prev.roles.text ||= roles.text; } continue; }
    clauses.push({ type, roles });
  }
  const result = { display: null, text: null };
  if (!clauses.length) return result;
  if (clauses.length === 1 && !(clauses[0].roles.display !== clauses[0].roles.text)) {
    return { display: { ...clauses[0].type }, text: { ...clauses[0].type } };
  }
  for (const c of clauses) {
    if (c.roles.display && !result.display) result.display = c.type;
    if (c.roles.text && !result.text) result.text = c.type;
  }
  // Clauses with no role fill whatever is still empty, display first.
  for (const c of clauses.filter((c) => !c.roles.display && !c.roles.text)) {
    if (!result.display) result.display = c.type;
    else if (!result.text) result.text = c.type;
  }
  // One described face with one role leaves the other role open.
  return result;
}

/* ---------- distance ---------- */

const pairKey = (a, b) => [a, b].sort().join('|');
const NEAR_KINDS = new Set(['serif|slab', 'mono|pixel', 'display|script', 'display|sans']);
const NEAR_STYLES = new Set(['grotesk|neo-grotesk', 'didone|transitional', 'oldstyle|transitional', 'glyphic|oldstyle', 'geometric|rounded', 'humanist|neo-grotesk']);

/**
 * How far apart two classifications are; 0 is the same. Weights: a different kind costs 3, a near kind 2
 * (serif/slab, mono/pixel, script/display, sans/display), and a monospace against a tech sans or a condensed sans
 * against a display face 1.5 (with no width cost on top). Style only counts within one kind: 1, or 0.5 for near styles (grotesk/neo-grotesk,
 * didone/transitional, transitional/oldstyle, oldstyle/glyphic, geometric/rounded, humanist/neo-grotesk).
 * Contrast (when both sides say it) and width (missing means normal) cost 0.5 each. Strings are classified first.
 */
export function fontDistance(a, b) {
  if (typeof a === 'string') a = classifyFont(a);
  if (typeof b === 'string') b = classifyFont(b);
  if (!a || !b) return Infinity;
  let d = 0;
  if (a.kind !== b.kind) {
    const k = pairKey(a.kind, b.kind);
    const tech = (x, y) => x.kind === 'mono' && y.style === 'tech';
    const poster = (x, y) => x.kind === 'display' && y.kind === 'sans' && y.width === 'condensed';
    if (poster(a, b) || poster(b, a)) return 1.5; // the narrow width is what makes it read as a poster face
    if (tech(a, b) || tech(b, a)) d += 1.5;
    else d += NEAR_KINDS.has(k) ? 2 : 3;
  } else if (a.style !== b.style) {
    d += NEAR_STYLES.has(pairKey(a.style, b.style)) ? 0.5 : 1;
  }
  if (a.contrast && b.contrast && a.contrast !== b.contrast) d += 0.5;
  if ((a.width || 'normal') !== (b.width || 'normal')) d += 0.5;
  return d;
}
