export interface ThemeTokens {
  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  ink: string;
  ink2: string;
  ink3: string;
  line: string;
  lineStrong: string;
  primary: string;
  primaryInk: string;
  primarySoft: string;
  secondary: string;
  secondaryInk: string;
  secondarySoft: string;
  tertiary: string;
  tertiaryInk: string;
  tertiarySoft: string;
  success: string;
  successInk: string;
  successSoft: string;
  warning: string;
  warningInk: string;
  warningSoft: string;
  danger: string;
  dangerInk: string;
  dangerSoft: string;
  info: string;
  infoInk: string;
  infoSoft: string;
  /** Text that passes on the matching soft wash. Not the solid fill. */
  successOnSoft: string;
  warningOnSoft: string;
  dangerOnSoft: string;
  infoOnSoft: string;
  focus: string;
  /** Brand colour darkened or lightened until it reads as text on --bg. */
  link: string;
  overlay: string;
  inverse: string;
  inverseInk: string;
  /** @deprecated use primary */
  accent: string;
  /** @deprecated use primaryInk */
  accentInk: string;
  /** @deprecated use success */
  positive: string;
}

export interface Theme {
  id: string;
  name: string;
  mood: string;
  bestFor: string[];
  tags: string[];
  tokens: ThemeTokens;
  display: string;
  text: string;
  radius: string;
  shadow: string;
  specimen: string;
}

export const ROLE_SWATCHES = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'tertiary', label: 'Tertiary' },
  { key: 'success', label: 'Success' },
  { key: 'warning', label: 'Warning' },
  { key: 'danger', label: 'Danger' },
  { key: 'info', label: 'Info' },
] as const;

export const ROLE_GROUPS = [
  { id: 'brand', label: 'Brand', keys: ['primary', 'secondary', 'tertiary'] },
  { id: 'on-brand', label: 'On brand', keys: ['primaryInk', 'secondaryInk', 'tertiaryInk'] },
  { id: 'wash', label: 'Washes', keys: ['primarySoft', 'secondarySoft', 'tertiarySoft'] },
  { id: 'surface', label: 'Surface', keys: ['bg', 'surface', 'surface2', 'surface3'] },
  { id: 'ink', label: 'Ink', keys: ['ink', 'ink2', 'ink3'] },
  { id: 'line', label: 'Line', keys: ['line', 'lineStrong'] },
  { id: 'feedback', label: 'Feedback', keys: ['success', 'warning', 'danger', 'info'] },
  { id: 'on-feedback', label: 'On feedback', keys: ['successInk', 'warningInk', 'dangerInk', 'infoInk'] },
  { id: 'feedback-wash', label: 'Feedback wash', keys: ['successSoft', 'warningSoft', 'dangerSoft', 'infoSoft'] },
  { id: 'on-wash', label: 'Ink on wash', keys: ['successOnSoft', 'warningOnSoft', 'dangerOnSoft', 'infoOnSoft'] },
  { id: 'chrome', label: 'Chrome', keys: ['focus', 'overlay', 'inverse', 'inverseInk'] },
] as const;

type Core = {
  bg: string; surface: string; surface2: string;
  ink: string; ink2: string; ink3: string; line: string;
  primary: string; secondary: string; tertiary: string;
  success?: string; warning?: string; danger?: string; info?: string;
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number) {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function mix(a: string, b: string, t: number) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

function luma(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luma(a), luma(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const INK_LIGHT = '#fffdf8';
const INK_DARK = '#141210';

/** Pick the ink that actually passes on this fill. Cream on gold fails; near-black does not. */
function onColor(fill: string) {
  const onLight = contrast(INK_LIGHT, fill);
  const onDark = contrast(INK_DARK, fill);
  if (onDark >= 4.5 && onLight < 4.5) return INK_DARK;
  if (onLight >= 4.5 && onDark < 4.5) return INK_LIGHT;
  return onDark >= onLight ? INK_DARK : INK_LIGHT;
}

function role(fill: string, bg: string, dark: boolean) {
  const onLight = contrast(INK_LIGHT, fill);
  const onDark = contrast(INK_DARK, fill);
  const ink = onLight >= onDark ? INK_LIGHT : INK_DARK;
  const toward = ink === INK_LIGHT ? '#000000' : '#ffffff';
  let color = fill;
  for (let i = 0; i < 16 && contrast(ink, color) < 4.5; i++) color = mix(color, toward, 0.08);
  return {
    fill: color,
    ink,
    soft: mix(fill, bg, dark ? 0.76 : 0.86),
  };
}

/** Feedback text on its own wash. The solid fill is often too light to read there. */
function inkOnSoft(source: string, soft: string, dark: boolean) {
  const toward = dark ? '#ffffff' : '#000000';
  let c = source;
  for (let i = 0; i < 24 && contrast(c, soft) < 4.5; i++) c = mix(c, toward, 0.12);
  return c;
}

/** Brand colour as text on the page background. Fills can stay loud; links have to pass. */
function linkOn(color: string, bg: string) {
  const toward = luma(bg) > 0.4 ? '#000000' : '#ffffff';
  let c = color;
  for (let i = 0; i < 18 && contrast(c, bg) < 4.5; i++) c = mix(c, toward, 0.1);
  return c;
}

/** Expand a brand trio into a shippable role set. Material-style: primary / secondary / tertiary + feedback + surfaces. */
export function paint(c: Core): ThemeTokens {
  const dark = luma(c.bg) < 0.38;
  const success = c.success ?? (dark ? '#8fbf7a' : '#2f7a4a');
  const warning = c.warning ?? (dark ? '#e0a34b' : '#c27a14');
  const danger = c.danger ?? (dark ? '#ff6b5a' : '#c4121a');
  const info = c.info ?? (dark ? '#7ab8d4' : '#2a6f97');
  const p = role(c.primary, c.bg, dark);
  const s = role(c.secondary, c.bg, dark);
  const t = role(c.tertiary, c.bg, dark);
  const ok = role(success, c.bg, dark);
  const wr = role(warning, c.bg, dark);
  const dg = role(danger, c.bg, dark);
  const inf = role(info, c.bg, dark);
  return {
    bg: c.bg,
    surface: c.surface,
    surface2: c.surface2,
    surface3: mix(c.surface2, c.ink, dark ? 0.1 : 0.06),
    ink: c.ink,
    ink2: c.ink2,
    ink3: c.ink3,
    line: c.line,
    lineStrong: mix(c.line, c.ink, 0.38),
    primary: p.fill, primaryInk: p.ink, primarySoft: p.soft,
    secondary: s.fill, secondaryInk: s.ink, secondarySoft: s.soft,
    tertiary: t.fill, tertiaryInk: t.ink, tertiarySoft: t.soft,
    success: ok.fill, successInk: ok.ink, successSoft: ok.soft,
    warning: wr.fill, warningInk: wr.ink, warningSoft: wr.soft,
    danger: dg.fill, dangerInk: dg.ink, dangerSoft: dg.soft,
    info: inf.fill, infoInk: inf.ink, infoSoft: inf.soft,
    successOnSoft: inkOnSoft(ok.fill, ok.soft, dark),
    warningOnSoft: inkOnSoft(wr.fill, wr.soft, dark),
    dangerOnSoft: inkOnSoft(dg.fill, dg.soft, dark),
    infoOnSoft: inkOnSoft(inf.fill, inf.soft, dark),
    focus: p.fill,
    link: linkOn(p.fill, c.bg),
    overlay: dark ? '#070605' : '#141210',
    inverse: c.ink,
    inverseInk: c.bg,
    accent: p.fill,
    accentInk: p.ink,
    positive: ok.fill,
  };
}

export const THEMES: Theme[] = [
  { id: 'paper-ink', name: 'Paper & Ink', mood: 'Warm newsprint. The default of a well-printed book, not a template.', bestFor: ['Editorial', 'Portfolios', 'Libraries'], tags: ['paper', 'editorial', 'warm'],
    tokens: paint({ bg: '#f3efe6', surface: '#eae5d9', surface2: '#e0dacb', ink: '#171512', ink2: '#5b564e', ink3: '#8c867b', line: '#d6cfc0', primary: '#a8661a', secondary: '#3f6b4a', tertiary: '#3d4f6b', success: '#3f6b4a', warning: '#b45309', danger: '#9b2c2c', info: '#3d4f6b' }),
    display: 'Fraunces', text: 'Instrument Sans', radius: '4px', shadow: '0 12px 32px -12px rgba(23,21,18,.25)', specimen: 'Interfaces worth sitting with' },
  { id: 'night-desk', name: 'Night Desk', mood: 'A lamp over a dark table. Warm paper type on near-black.', bestFor: ['Dev tools', 'Studios after dark', 'Writing apps'], tags: ['dark', 'warm', 'editorial'],
    tokens: paint({ bg: '#141311', surface: '#1b1a17', surface2: '#242320', ink: '#ece7dc', ink2: '#a7a196', ink3: '#6f6a60', line: '#2b2925', primary: '#e0a34b', secondary: '#8fbf7a', tertiary: '#c48a8a', success: '#8fbf7a', warning: '#e08a3a', danger: '#e07060', info: '#8ab4c8' }),
    display: 'Fraunces', text: 'Instrument Sans', radius: '4px', shadow: '0 16px 40px -16px rgba(0,0,0,.7)', specimen: 'Write until the lamp is the only light' },
  { id: 'alpine-clinic', name: 'Alpine Clinic', mood: 'Cool, washed, trustworthy. Mint air and a precise teal.', bestFor: ['Health', 'Clinics', 'Wellness apps'], tags: ['soft', 'health', 'cool'],
    tokens: paint({ bg: '#eef6f3', surface: '#ffffff', surface2: '#dceae4', ink: '#11302a', ink2: '#3d5c55', ink3: '#6d8a83', line: '#c5d8d0', primary: '#0f8a6e', secondary: '#2a6f97', tertiary: '#6b5a8a', success: '#0f8a6e', warning: '#c27a1a', danger: '#b53838', info: '#2a6f97' }),
    display: 'Sora', text: 'Sora', radius: '12px', shadow: '0 10px 28px -14px rgba(17,48,42,.28)', specimen: 'Your next appointment is Thursday' },
  { id: 'harbour-ledger', name: 'Harbour Ledger', mood: 'Navy wool, cream paper, a brass stamp.', bestFor: ['Finance', 'Insurance', 'Civic'], tags: ['luxe', 'finance', 'classic'],
    tokens: paint({ bg: '#f4efe4', surface: '#fffaf0', surface2: '#e8e0d0', ink: '#152033', ink2: '#4a5568', ink3: '#7a8494', line: '#d4cbb8', primary: '#b08a3e', secondary: '#1e3a5f', tertiary: '#8a3a3a', success: '#2f6b4f', warning: '#c27a14', danger: '#8a2a2a', info: '#2a4a7a' }),
    display: 'Libre Caslon Text', text: 'IBM Plex Sans', radius: '2px', shadow: '0 1px 0 rgba(21,32,51,.06)', specimen: 'Accounts settled before the tide' },
  { id: 'kiln', name: 'Kiln', mood: 'Fired clay, sand, charcoal. A studio that still has dust on the floor.', bestFor: ['Craft', 'Food', 'Studios'], tags: ['organic', 'warm', 'craft'],
    tokens: paint({ bg: '#f3e6d4', surface: '#faefe0', surface2: '#e6d2b8', ink: '#2a1b14', ink2: '#6a4e3e', ink3: '#9a7d68', line: '#d8c0a4', primary: '#c45c2a', secondary: '#4f6b3a', tertiary: '#3a4558', success: '#3d7a32', warning: '#d4a02a', danger: '#9b2c2c', info: '#3a5a78' }),
    display: 'Young Serif', text: 'Hanken Grotesk', radius: '8px', shadow: '0 14px 30px -16px rgba(42,27,20,.3)', specimen: 'Twelve bowls, one firing' },
  { id: 'signal-green', name: 'Signal Green', mood: 'A terminal that grew up. Phosphor on soot, no nostalgia drag.', bestFor: ['CLIs', 'Infra', 'Changelogs'], tags: ['terminal', 'dark', 'tech'],
    tokens: paint({ bg: '#0b0f0c', surface: '#121814', surface2: '#1a221c', ink: '#c8f7d4', ink2: '#7fb38c', ink3: '#4d6e56', line: '#1e2a21', primary: '#3ddc84', secondary: '#e6c35c', tertiary: '#7ab8c8', success: '#3ddc84', warning: '#e6c35c', danger: '#ff6b5a', info: '#7ab8c8' }),
    display: 'JetBrains Mono', text: 'IBM Plex Sans', radius: '0px', shadow: 'none', specimen: '$ git push --tags' },
  { id: 'atelier-noir', name: 'Atelier Noir', mood: 'Bone type on black. Luxury as the absence of extra lines.', bestFor: ['Fashion', 'Fragrance', 'Hotels'], tags: ['luxe', 'dark', 'fashion'],
    tokens: paint({ bg: '#0c0b0a', surface: '#161412', surface2: '#211e1b', ink: '#efe6d6', ink2: '#b3a894', ink3: '#746b5c', line: '#2a2622', primary: '#c9a54a', secondary: '#8a3a3a', tertiary: '#6a7a8a', success: '#8fbf7a', warning: '#e08a3a', danger: '#c45c4a', info: '#7a8aa0' }),
    display: 'Bodoni Moda', text: 'Tenor Sans', radius: '0px', shadow: 'none', specimen: 'Eau de Nuit, No. 7' },
  { id: 'loam', name: 'Loam', mood: 'Garden journal. Olive, cream, a rust that looks like soil.', bestFor: ['Food', 'Wellness', 'Field notes'], tags: ['organic', 'warm', 'editorial'],
    tokens: paint({ bg: '#eef0e6', surface: '#f7f6ee', surface2: '#dde1d0', ink: '#1e2a1e', ink2: '#4e5c4c', ink3: '#7a8776', line: '#c9d0bc', primary: '#c46a3c', secondary: '#4a6b38', tertiary: '#6a3a4a', success: '#4a6b38', warning: '#c46a3c', danger: '#9b2c2c', info: '#3d5a6b' }),
    display: 'Young Serif', text: 'Hanken Grotesk', radius: '10px', shadow: '0 12px 28px -16px rgba(30,42,30,.22)', specimen: 'Tomatoes, late August' },
  { id: 'ice-station', name: 'Ice Station', mood: 'Pale, northern, a little severe. Blue-gray air.', bestFor: ['Research', 'Maps', 'Climate'], tags: ['cool', 'minimal', 'civic'],
    tokens: paint({ bg: '#e8eef2', surface: '#f7fafc', surface2: '#d5dee6', ink: '#14202b', ink2: '#445564', ink3: '#7a8a98', line: '#c5d0da', primary: '#2a6f97', secondary: '#5a7a8a', tertiary: '#b86a1a', success: '#2a7a62', warning: '#b86a1a', danger: '#a83838', info: '#2a6f97' }),
    display: 'Literata', text: 'Public Sans', radius: '6px', shadow: '0 10px 24px -14px rgba(20,32,43,.2)', specimen: 'Groundwater in the Terai' },
  { id: 'press-room', name: 'Press Room', mood: 'Newsprint and one red. Headlines do the shouting.', bestFor: ['News', 'Magazines', 'Campaigns'], tags: ['editorial', 'swiss', 'loud'],
    tokens: paint({ bg: '#f4f1e8', surface: '#fffdf6', surface2: '#e6e1d4', ink: '#111111', ink2: '#444444', ink3: '#777777', line: '#cfc8b8', primary: '#c4121a', secondary: '#1a2744', tertiary: '#c49a2a', success: '#1f6b3a', warning: '#c49a2a', danger: '#c4121a', info: '#1a2744' }),
    display: 'Newsreader', text: 'Work Sans', radius: '0px', shadow: 'none', specimen: 'The river that moved a border' },
  { id: 'velvet-club', name: 'Velvet Club', mood: 'Burgundy walls, a gold rail, last orders at two.', bestFor: ['Nightlife', 'Wine', 'Memberships'], tags: ['luxe', 'dark', 'deco'],
    tokens: paint({ bg: '#1a0e12', surface: '#26151b', surface2: '#341e26', ink: '#f3e6d8', ink2: '#c4a992', ink3: '#8a6f62', line: '#3d2630', primary: '#d4a24a', secondary: '#8a2a44', tertiary: '#6a8a7a', success: '#8fbf7a', warning: '#d4a24a', danger: '#e07070', info: '#8aa0c4' }),
    display: 'Cinzel', text: 'Spectral', radius: '2px', shadow: '0 18px 40px -18px rgba(0,0,0,.6)', specimen: 'Members after ten' },
  { id: 'greenhouse', name: 'Greenhouse', mood: 'Leaf-filtered light. Soft, wet, growing.', bestFor: ['Gardens', 'Kids', 'Habits'], tags: ['organic', 'playful', 'soft'],
    tokens: paint({ bg: '#e7f0dc', surface: '#f4f8ec', surface2: '#d4e2c4', ink: '#1d2e18', ink2: '#4a5e40', ink3: '#7a8c6e', line: '#bfd0ae', primary: '#4f7a32', secondary: '#2a4a28', tertiary: '#c46a6a', success: '#4f7a32', warning: '#c47a28', danger: '#b53838', info: '#3a6a7a' }),
    display: 'Baloo 2', text: 'Nunito', radius: '16px', shadow: '0 10px 24px -12px rgba(29,46,24,.2)', specimen: 'Water the plant before nine' },
  { id: 'circuit', name: 'Circuit', mood: 'Engineered and a little expensive. Lime on charcoal.', bestFor: ['Hardware', 'Mobility', 'Energy'], tags: ['industrial', 'dark', 'tech'],
    tokens: paint({ bg: '#0e0f12', surface: '#16181d', surface2: '#1f2229', ink: '#eef0f3', ink2: '#9aa3b0', ink3: '#6a7380', line: '#2a2e36', primary: '#c6ff3d', secondary: '#3d8aff', tertiary: '#ffb020', success: '#c6ff3d', warning: '#ffb020', danger: '#ff5a4a', info: '#3d8aff' }),
    display: 'Unbounded', text: 'Onest', radius: '8px', shadow: '0 16px 36px -18px rgba(0,0,0,.55)', specimen: 'Range: 612 km' },
  { id: 'marble-hall', name: 'Marble Hall', mood: 'White stone, dove shadows, a brass plaque.', bestFor: ['Museums', 'Law', 'Universities'], tags: ['classic', 'luxe', 'civic'],
    tokens: paint({ bg: '#f3f1ec', surface: '#ffffff', surface2: '#e6e3db', ink: '#1c1914', ink2: '#5a554c', ink3: '#8a8478', line: '#d4d0c6', primary: '#8a6a2f', secondary: '#4a5560', tertiary: '#6a2a2a', success: '#3d6b4a', warning: '#c27a14', danger: '#8a2a2a', info: '#3d4f6b' }),
    display: 'Cinzel', text: 'Spectral', radius: '2px', shadow: '0 1px 0 rgba(28,25,20,.06)', specimen: 'Hall of the Mallas' },
  { id: 'cinder', name: 'Cinder', mood: 'Yard ops. Safety orange on poured concrete.', bestFor: ['Logistics', 'Manufacturing', 'Field tools'], tags: ['industrial', 'utility', 'loud'],
    tokens: paint({ bg: '#e7e6e1', surface: '#f4f3ef', surface2: '#d4d3cd', ink: '#1b1c1e', ink2: '#4e5054', ink3: '#7c7e82', line: '#c4c3bd', primary: '#ff5a1f', secondary: '#3a4a5a', tertiary: '#e6b020', success: '#2f7a4a', warning: '#e6b020', danger: '#ff5a1f', info: '#3a4a5a' }),
    display: 'Big Shoulders Display', text: 'IBM Plex Sans', radius: '2px', shadow: 'none', specimen: 'Bay 14. Load 2,400 kg' },
  { id: 'sakura-desk', name: 'Sakura Desk', mood: 'Blush paper, black ink, one stamp of red.', bestFor: ['Personal sites', 'Poetry', 'Studios'], tags: ['paper', 'soft', 'editorial'],
    tokens: paint({ bg: '#f6ebe8', surface: '#fff7f4', surface2: '#ead8d3', ink: '#2a1716', ink2: '#6a4a46', ink3: '#9a7a74', line: '#e0c8c2', primary: '#c43b3b', secondary: '#2a1716', tertiary: '#d4a09a', success: '#3d6b4a', warning: '#c47a28', danger: '#c43b3b', info: '#5a4a6b' }),
    display: 'Cormorant Garamond', text: 'Work Sans', radius: '6px', shadow: '0 10px 24px -14px rgba(42,23,22,.18)', specimen: 'Letters from the hill station' },
  { id: 'observatory', name: 'Observatory', mood: 'Deep navy, star-gold, a little ice on the glass.', bestFor: ['Science', 'Maps', 'Night products'], tags: ['dark', 'luxe', 'cool'],
    tokens: paint({ bg: '#0b1220', surface: '#121a2c', surface2: '#1a2438', ink: '#e8eef8', ink2: '#9aacc4', ink3: '#667894', line: '#243044', primary: '#e0b44a', secondary: '#5ec8a0', tertiary: '#6a5a9a', success: '#5ec8a0', warning: '#e0b44a', danger: '#e07070', info: '#6a8ac8' }),
    display: 'Instrument Serif', text: 'IBM Plex Sans', radius: '6px', shadow: '0 18px 40px -18px rgba(0,0,0,.55)', specimen: 'Uplink 98.2 percent' },
  { id: 'market-stall', name: 'Market Stall', mood: 'Turmeric, tomato, kraft paper. Loud in a friendly way.', bestFor: ['Food', 'Local shops', 'Festivals'], tags: ['playful', 'warm', 'organic'],
    tokens: paint({ bg: '#f6ead2', surface: '#fff6e4', surface2: '#ead8b4', ink: '#2a1a10', ink2: '#6a4a30', ink3: '#9a7454', line: '#d8c094', primary: '#d23a1e', secondary: '#d4a020', tertiary: '#3d6b2a', success: '#3d6b2a', warning: '#d4a020', danger: '#d23a1e', info: '#2a5a7a' }),
    display: 'Zilla Slab', text: 'Karla', radius: '10px', shadow: '0 12px 26px -14px rgba(42,26,16,.22)', specimen: 'Mangoes before noon' },
  { id: 'fog-city', name: 'Fog City', mood: 'Cool gray, white, one cobalt. Civic and calm.', bestFor: ['SaaS', 'Gov', 'Docs'], tags: ['minimal', 'cool', 'product'],
    tokens: paint({ bg: '#eef1f3', surface: '#ffffff', surface2: '#dfe4e8', ink: '#0f1418', ink2: '#4a5560', ink3: '#7a8690', line: '#cdd3d8', primary: '#0f6fff', secondary: '#3d4a5c', tertiary: '#0f8a6e', success: '#1f8a5a', warning: '#c27a14', danger: '#c4121a', info: '#0f6fff' }),
    display: 'Familjen Grotesk', text: 'Chivo Mono', radius: '8px', shadow: '0 10px 24px -14px rgba(15,20,24,.16)', specimen: 'Annual report 2025' },
  { id: 'archive', name: 'Archive', mood: 'Manila folders, faded navy, a stamp of red.', bestFor: ['Archives', 'Legal', 'Libraries'], tags: ['paper', 'retro', 'editorial'],
    tokens: paint({ bg: '#efe4c8', surface: '#f7eed6', surface2: '#e0d2ae', ink: '#231c12', ink2: '#5a4e38', ink3: '#8a7a58', line: '#d4c49a', primary: '#8b1e1e', secondary: '#2a3a5a', tertiary: '#c4a86a', success: '#3d5c2a', warning: '#c4a86a', danger: '#8b1e1e', info: '#2a3a5a' }),
    display: 'EB Garamond', text: 'Hanken Grotesk', radius: '0px', shadow: 'none', specimen: 'On the keeping of records' },
  { id: 'neon-alley', name: 'Neon Alley', mood: 'Black wet street, magenta and cyan tubes.', bestFor: ['Music', 'Nightlife', 'Games'], tags: ['cyber', 'dark', 'y2k'],
    tokens: paint({ bg: '#0a0612', surface: '#140c20', surface2: '#1e1230', ink: '#f2e9ff', ink2: '#b8a0d4', ink3: '#7a6894', line: '#2a1a44', primary: '#ff4fa3', secondary: '#19e6c1', tertiary: '#8a4fff', success: '#19e6c1', warning: '#ffb020', danger: '#ff4fa3', info: '#8a4fff' }),
    display: 'Monoton', text: 'Josefin Sans', radius: '4px', shadow: '0 0 24px -6px rgba(255,79,163,.45)', specimen: 'Open late' },
  { id: 'linen-shop', name: 'Linen Shop', mood: 'Flax, clay, sage. Washed twice so it arrives soft.', bestFor: ['Fashion', 'Home', 'Lifestyle'], tags: ['soft', 'organic', 'fashion'],
    tokens: paint({ bg: '#efe7dc', surface: '#f8f2e8', surface2: '#e2d6c6', ink: '#2a211b', ink2: '#6a5a4c', ink3: '#9a8878', line: '#d4c6b4', primary: '#9d4b2c', secondary: '#6a7a5a', tertiary: '#b08a4a', success: '#4a6b3a', warning: '#b08a4a', danger: '#9d4b2c', info: '#4a5a6b' }),
    display: 'Gloock', text: 'Figtree', radius: '8px', shadow: '0 12px 28px -16px rgba(42,33,27,.2)', specimen: 'The linen edit' },
  { id: 'copper-works', name: 'Copper Works', mood: 'Soot walls, a copper pipe, cream labels.', bestFor: ['Hardware', 'Whisky', 'Workshops'], tags: ['industrial', 'warm', 'craft'],
    tokens: paint({ bg: '#1a1410', surface: '#241c16', surface2: '#30261e', ink: '#f0e6d6', ink2: '#b4a08a', ink3: '#7a6a56', line: '#3a3026', primary: '#c46a32', secondary: '#8fbf7a', tertiary: '#c4a86a', success: '#8fbf7a', warning: '#c46a32', danger: '#e07060', info: '#7a9ab4' }),
    display: 'Zilla Slab', text: 'IBM Plex Sans', radius: '4px', shadow: '0 16px 36px -18px rgba(0,0,0,.5)', specimen: 'Batch 14, still warm' },
  { id: 'glacier', name: 'Glacier', mood: 'Almost white, a glacial blue, slate type.', bestFor: ['Health', 'Climate', 'Architecture'], tags: ['minimal', 'cool', 'soft'],
    tokens: paint({ bg: '#f2f6f8', surface: '#ffffff', surface2: '#e0e8ee', ink: '#1a2430', ink2: '#4a5a68', ink3: '#7a8a98', line: '#c8d4dc', primary: '#3a8aa8', secondary: '#4a5a68', tertiary: '#2a8a6a', success: '#2a8a6a', warning: '#c28a20', danger: '#b53838', info: '#3a8aa8' }),
    display: 'Sora', text: 'Sora', radius: '14px', shadow: '0 10px 24px -16px rgba(26,36,48,.16)', specimen: 'Ice retreated 42 metres' },
  { id: 'festival', name: 'Festival', mood: 'Two inks, one drum. Fluoro pink on indigo cream.', bestFor: ['Zines', 'Festivals', 'Merch'], tags: ['riso', 'playful', 'loud'],
    tokens: paint({ bg: '#f6f1ea', surface: '#fffaf4', surface2: '#ebe0d2', ink: '#1f2a6b', ink2: '#4a4e8a', ink3: '#7a7aa4', line: '#d4c8ba', primary: '#ff4f8b', secondary: '#1f2a6b', tertiary: '#f0c84a', success: '#1f2a6b', warning: '#f0c84a', danger: '#ff4f8b', info: '#1f2a6b' }),
    display: 'Rubik Mono One', text: 'Rubik', radius: '0px', shadow: '4px 4px 0 #1f2a6b', specimen: 'Print club, issue 9' },
  { id: 'courtroom', name: 'Courtroom', mood: 'Deep green leather, cream paper, a gold rule.', bestFor: ['Law', 'Universities', 'Foundations'], tags: ['classic', 'luxe', 'civic'],
    tokens: paint({ bg: '#f3eee2', surface: '#faf6ec', surface2: '#e4dcc8', ink: '#14241c', ink2: '#4a5a4c', ink3: '#7a8a78', line: '#d0c6ae', primary: '#b5381f', secondary: '#14241c', tertiary: '#b08a3e', success: '#2a5c3a', warning: '#b08a3e', danger: '#b5381f', info: '#3d4f6b' }),
    display: 'EB Garamond', text: 'Public Sans', radius: '2px', shadow: 'none', specimen: 'In the matter of the river' },
  { id: 'playroom', name: 'Playroom', mood: 'Butter walls, coral buttons, a navy that keeps it honest.', bestFor: ['Kids', 'Learning', 'Consumer apps'], tags: ['playful', 'clay', 'soft'],
    tokens: paint({ bg: '#fff4d6', surface: '#fffaf0', surface2: '#ffe8a8', ink: '#2c2140', ink2: '#5a4e78', ink3: '#8a7ea4', line: '#ead8a0', primary: '#ff6b4a', secondary: '#2c2140', tertiary: '#f0c84a', success: '#2f9e5b', warning: '#f0c84a', danger: '#ff6b4a', info: '#4a6ab4' }),
    display: 'Bagel Fat One', text: 'Fredoka', radius: '20px', shadow: '0 8px 0 #2c2140', specimen: 'Trace the letter B' },
  { id: 'oxide', name: 'Oxide', mood: 'Rusted metal, olive, bone. A shed that still works.', bestFor: ['Outdoor', 'Tools', 'Field notes'], tags: ['industrial', 'organic', 'warm'],
    tokens: paint({ bg: '#e6dcc8', surface: '#f2ead8', surface2: '#d4c8ae', ink: '#2a2218', ink2: '#5a5244', ink3: '#8a8070', line: '#c8bca4', primary: '#a84828', secondary: '#4a6b32', tertiary: '#5a6a7a', success: '#3d6b2a', warning: '#c49a2a', danger: '#8a2a2a', info: '#3d4f6b' }),
    display: 'Roboto Slab', text: 'IBM Plex Sans', radius: '4px', shadow: '0 12px 26px -16px rgba(42,34,24,.28)', specimen: 'Tools that outlast the job' },
  { id: 'y2k-chrome', name: 'Y2K Chrome', mood: 'Ice silver, bevels, one electric blue. Millennium optimism.', bestFor: ['Music drops', 'Fashion', 'Nightlife'], tags: ['y2k', 'retro', 'playful'],
    tokens: paint({ bg: '#e8ecf2', surface: '#f4f6fa', surface2: '#d0d6e0', ink: '#10131a', ink2: '#4a5260', ink3: '#7a8290', line: '#c0c6d0', primary: '#2f6bff', secondary: '#ff4fa3', tertiary: '#1aa87a', success: '#1aa87a', warning: '#e6b020', danger: '#ff4fa3', info: '#2f6bff' }),
    display: 'Michroma', text: 'Figtree', radius: '14px', shadow: 'inset 0 1px 0 #fff, 0 8px 20px -10px rgba(16,19,26,.3)', specimen: 'Millennium mixtape' },
  { id: 'hud-teal', name: 'HUD Teal', mood: 'Cockpit glass. Signal teal, scanline black.', bestFor: ['Ops', 'Security', 'Games'], tags: ['cyber', 'dark', 'tech'],
    tokens: paint({ bg: '#07090d', surface: '#0e1218', surface2: '#161c26', ink: '#d6e2f0', ink2: '#8aa0b8', ink3: '#5a7088', line: '#1e2834', primary: '#19e6c1', secondary: '#e6c419', tertiary: '#5aa8e6', success: '#19e6c1', warning: '#e6c419', danger: '#ff5a4a', info: '#5aa8e6' }),
    display: 'Chakra Petch', text: 'Share Tech Mono', radius: '0px', shadow: '0 0 0 1px #19e6c1', specimen: 'Signal acquired' },
  { id: 'lokta', name: 'Lokta', mood: 'Lokta paper, flag crimson, navy ink. A Nepali surface, not a Western fintech skin.', bestFor: ['Nepal', 'Personal finance', 'Civic'], tags: ['paper', 'warm', 'editorial'],
    tokens: paint({ bg: '#f4ead6', surface: '#fbf6ea', surface2: '#e8dcc4', ink: '#1c2744', ink2: '#3e4a66', ink3: '#6d768c', line: '#d9cbb3', primary: '#c8102e', secondary: '#1c2744', tertiary: '#8a6232', success: '#1f6b45', warning: '#a15c12', danger: '#9b1b2e', info: '#1c2744' }),
    display: 'Noto Serif Devanagari', text: 'Mukta', radius: '6px', shadow: '0 10px 24px -16px rgba(28,39,68,.18)', specimen: 'रु 44,211 बाँकी' },
  { id: 'lokta-night', name: 'Lokta Night', mood: 'The same crimson on navy after dark. The paper colour moves into the type.', bestFor: ['Nepal', 'Personal finance', 'Civic'], tags: ['dark', 'warm', 'editorial'],
    tokens: paint({ bg: '#121820', surface: '#1a2230', surface2: '#243044', ink: '#f4ead6', ink2: '#c9bfae', ink3: '#8a8174', line: '#314056', primary: '#e85a68', secondary: '#f4ead6', tertiary: '#d4b06a', success: '#7dba9a', warning: '#e0a34b', danger: '#ff8a96', info: '#9bb4d4' }),
    display: 'Noto Serif Devanagari', text: 'Mukta', radius: '6px', shadow: 'none', specimen: 'रु 44,211 बाँकी' },
  { id: 'harbour-night', name: 'Harbour Night', mood: 'The same ledger after the lamps go down. Cream type, a brighter brass stamp.', bestFor: ['Finance', 'Insurance', 'Civic'], tags: ['luxe', 'finance', 'dark'],
    tokens: paint({ bg: '#121820', surface: '#1a2330', surface2: '#243044', ink: '#f4efe4', ink2: '#c5c0b4', ink3: '#8a8478', line: '#314056', primary: '#d4b06a', secondary: '#8eb0d4', tertiary: '#c47a7a', success: '#7dba9a', warning: '#e0a34b', danger: '#e07070', info: '#8eb0d4' }),
    display: 'Libre Caslon Text', text: 'IBM Plex Sans', radius: '2px', shadow: 'none', specimen: 'Accounts settled before the tide' },
];

export function themeCss(t: Theme) {
  const k = t.tokens;
  return `/* ${t.name} · full palette from Design Lounge by Susan Acharya (acharyasusan.com.np)
   Primary / secondary / tertiary + feedback + surfaces. Match the numbers.
   Free to use. A credit link is appreciated: https://acharyasusan.com.np */
:root {
  /* Brand */
  --primary: ${k.primary};
  --primary-ink: ${k.primaryInk};
  --primary-soft: ${k.primarySoft};
  --secondary: ${k.secondary};
  --secondary-ink: ${k.secondaryInk};
  --secondary-soft: ${k.secondarySoft};
  --tertiary: ${k.tertiary};
  --tertiary-ink: ${k.tertiaryInk};
  --tertiary-soft: ${k.tertiarySoft};

  /* Surface */
  --bg: ${k.bg};
  --surface: ${k.surface};
  --surface-2: ${k.surface2};
  --surface-3: ${k.surface3};
  --ink: ${k.ink};
  --ink-2: ${k.ink2};
  --ink-3: ${k.ink3};
  --line: ${k.line};
  --line-strong: ${k.lineStrong};

  /* Feedback — reserved for live state, never decoration */
  --success: ${k.success};
  --success-ink: ${k.successInk};
  --success-soft: ${k.successSoft};
  --success-on-soft: ${k.successOnSoft};
  --warning: ${k.warning};
  --warning-ink: ${k.warningInk};
  --warning-soft: ${k.warningSoft};
  --warning-on-soft: ${k.warningOnSoft};
  --danger: ${k.danger};
  --danger-ink: ${k.dangerInk};
  --danger-soft: ${k.dangerSoft};
  --danger-on-soft: ${k.dangerOnSoft};
  --info: ${k.info};
  --info-ink: ${k.infoInk};
  --info-soft: ${k.infoSoft};
  --info-on-soft: ${k.infoOnSoft};

  /* Chrome */
  --focus: ${k.focus};
  --link: ${k.link};
  --overlay: ${k.overlay};
  --inverse: ${k.inverse};
  --inverse-ink: ${k.inverseInk};

  /* Aliases */
  --accent: var(--primary);
  --accent-ink: var(--primary-ink);
  --positive: var(--success);

  --font-display: "${t.display}", Georgia, serif;
  --font-text: "${t.text}", system-ui, sans-serif;
  --radius: ${t.radius};
  --shadow: ${t.shadow};
}
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-text);
}
h1, h2, h3, .display { font-family: var(--font-display); }`;
}

/** Day/night twins. A null pair means this palette has no other mode. Do not borrow a second theme. */
export const THEME_PAIRS: Record<string, { mode: 'light' | 'dark'; pair: string | null }> = {
  'paper-ink': { mode: 'light', pair: 'night-desk' },
  'night-desk': { mode: 'dark', pair: 'paper-ink' },
  'linen-shop': { mode: 'light', pair: 'atelier-noir' },
  'atelier-noir': { mode: 'dark', pair: 'linen-shop' },
  'kiln': { mode: 'light', pair: 'copper-works' },
  'copper-works': { mode: 'dark', pair: 'kiln' },
  'alpine-clinic': { mode: 'light', pair: null },
  'harbour-ledger': { mode: 'light', pair: 'harbour-night' },
  'harbour-night': { mode: 'dark', pair: 'harbour-ledger' },
  'lokta': { mode: 'light', pair: 'lokta-night' },
  'lokta-night': { mode: 'dark', pair: 'lokta' },
  'signal-green': { mode: 'dark', pair: null },
  'loam': { mode: 'light', pair: null },
  'ice-station': { mode: 'light', pair: null },
  'press-room': { mode: 'light', pair: null },
  'velvet-club': { mode: 'dark', pair: null },
  'greenhouse': { mode: 'light', pair: null },
  'circuit': { mode: 'dark', pair: null },
  'marble-hall': { mode: 'light', pair: null },
  'cinder': { mode: 'light', pair: null },
  'sakura-desk': { mode: 'light', pair: null },
  'observatory': { mode: 'dark', pair: null },
  'market-stall': { mode: 'light', pair: null },
  'fog-city': { mode: 'light', pair: null },
  'archive': { mode: 'light', pair: null },
  'neon-alley': { mode: 'dark', pair: null },
  'glacier': { mode: 'light', pair: null },
  'festival': { mode: 'light', pair: null },
  'courtroom': { mode: 'light', pair: null },
  'playroom': { mode: 'light', pair: null },
  'oxide': { mode: 'light', pair: null },
  'y2k-chrome': { mode: 'light', pair: null },
  'hud-teal': { mode: 'dark', pair: null },
};

export function themeById(id: string) {
  return THEMES.find((t) => t.id === id);
}

const FAMILY_SPEC: Record<string, string> = {
  'Fraunces': 'Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900',
  'Instrument Sans': 'Instrument+Sans:wght@400..700',
  'Instrument Serif': 'Instrument+Serif:ital@0;1',
  'Sora': 'Sora:wght@400;600;800',
  'Libre Caslon Text': 'Libre+Caslon+Text:ital,wght@0,400;0,700;1,400',
  'IBM Plex Sans': 'IBM+Plex+Sans:wght@400;500;600;700',
  'Young Serif': 'Young+Serif',
  'Hanken Grotesk': 'Hanken+Grotesk:wght@400;600;800',
  'JetBrains Mono': 'JetBrains+Mono:wght@400;500;700',
  'Bodoni Moda': 'Bodoni+Moda:ital,wght@0,400;0,700;1,400',
  'Tenor Sans': 'Tenor+Sans',
  'Literata': 'Literata:ital,wght@0,400;0,600;1,400',
  'Public Sans': 'Public+Sans:wght@400;500;700',
  'Newsreader': 'Newsreader:ital,wght@0,400;0,600;1,400',
  'Work Sans': 'Work+Sans:wght@400;500;600',
  'Cinzel': 'Cinzel:wght@400;700',
  'Spectral': 'Spectral:ital,wght@0,400;0,600;1,400',
  'Baloo 2': 'Baloo+2:wght@400;600;800',
  'Nunito': 'Nunito:wght@400;600;800',
  'Unbounded': 'Unbounded:wght@400;600;800',
  'Onest': 'Onest:wght@400;600;800',
  'Big Shoulders Display': 'Big+Shoulders+Display:wght@400;700;900',
  'Cormorant Garamond': 'Cormorant+Garamond:ital,wght@0,400;0,600;1,400',
  'Zilla Slab': 'Zilla+Slab:wght@400;600;700',
  'Karla': 'Karla:wght@400;500;700',
  'Familjen Grotesk': 'Familjen+Grotesk:wght@400;600;700',
  'Chivo Mono': 'Chivo+Mono:wght@400;500',
  'EB Garamond': 'EB+Garamond:ital,wght@0,400;0,600;1,400',
  'Monoton': 'Monoton',
  'Josefin Sans': 'Josefin+Sans:wght@300;400;600',
  'Gloock': 'Gloock',
  'Figtree': 'Figtree:wght@400;600;800',
  'Roboto Slab': 'Roboto+Slab:wght@400;700',
  'Michroma': 'Michroma',
  'Chakra Petch': 'Chakra+Petch:wght@400;500;700',
  'Share Tech Mono': 'Share+Tech+Mono',
  'Bagel Fat One': 'Bagel+Fat+One',
  'Fredoka': 'Fredoka:wght@400;500;600;700',
  'Rubik Mono One': 'Rubik+Mono+One',
  'Rubik': 'Rubik:wght@400;600;800',
  'Noto Serif Devanagari': 'Noto+Serif+Devanagari:wght@400;600;700',
  'Mukta': 'Mukta:wght@400;500;600;700',
};

export function themeFontHref(t: Theme) {
  const specs = [FAMILY_SPEC[t.display], FAMILY_SPEC[t.text]].filter(Boolean);
  return `https://fonts.googleapis.com/css2?${specs.map((s) => `family=${s}`).join('&')}&display=swap`;
}
