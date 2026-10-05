export interface Easing {
  id: string;
  name: string;
  css: string;
  feel: string;
  use: string;
}

export interface Recipe {
  id: string;
  name: string;
  trigger: string;
  property: string;
  from: string;
  to: string;
  duration: string;
  easing: string;
  delay?: string;
  reduced: string;
  note: string;
}

export const EASINGS: Easing[] = [
  { id: 'standard', name: 'Lounge standard', css: 'cubic-bezier(0.2, 0.7, 0.2, 1)', feel: 'Decisive, a little heavy at the start, lands clean.', use: 'Default for UI moves: width, opacity, colour, small translates.' },
  { id: 'expo-out', name: 'Expo out', css: 'cubic-bezier(0.16, 1, 0.3, 1)', feel: 'Fast start, long settle. The “it arrived” curve.', use: 'Hero reveals, shared-element expands, sheets rising.' },
  { id: 'ios-sheet', name: 'iOS sheet', css: 'cubic-bezier(0.32, 0.72, 0, 1)', feel: 'Apple’s sheet: almost linear, then a soft stop.', use: 'Bottom sheets, drawers, large vertical translates.' },
  { id: 'enter', name: 'Enter', css: 'cubic-bezier(0.16, 1, 0.3, 1)', feel: 'Same as expo out; named so agents pick it for incoming.', use: 'Anything that appears: toasts, menus, tooltips.' },
  { id: 'exit', name: 'Exit', css: 'cubic-bezier(0.4, 0, 1, 1)', feel: 'Leaves quickly. Don’t linger on things going away.', use: 'Dismissals under 180ms. Pair with enter, never the reverse.' },
  { id: 'emphasized', name: 'Emphasized', css: 'cubic-bezier(0.2, 0, 0, 1)', feel: 'Material 3 Expressive. Slow, then a committed finish.', use: 'Container transforms, FAB morphs, large layout changes.' },
  { id: 'emphasized-decel', name: 'Emphasized decelerate', css: 'cubic-bezier(0.05, 0.7, 0.1, 1)', feel: 'Incoming M3 motion. Soft arrival.', use: 'Elements entering a scene in Material language.' },
  { id: 'emphasized-accel', name: 'Emphasized accelerate', css: 'cubic-bezier(0.3, 0, 0.8, 0.15)', feel: 'Outgoing M3 motion. Leaves with intent.', use: 'Elements exiting a Material scene.' },
  { id: 'spring-soft', name: 'Soft spring (approx)', css: 'cubic-bezier(0.22, 1.2, 0.36, 1)', feel: 'A polite overshoot. One bounce, then still.', use: 'Likes, checkboxes, small toggles. Never on layout width.' },
  { id: 'spring-snappy', name: 'Snappy spring (approx)', css: 'cubic-bezier(0.34, 1.4, 0.64, 1)', feel: 'Playful overshoot. Use once per screen.', use: 'Onboarding, clay/playful kits, success states.' },
  { id: 'linear', name: 'Linear', css: 'linear', feel: 'No personality. Correct for loops and progress.', use: 'Marquees, indeterminate bars, rotating loaders.' },
  { id: 'in-out', name: 'In–out cubic', css: 'cubic-bezier(0.65, 0, 0.35, 1)', feel: 'Symmetric. Good when the move will reverse.', use: 'Theme toggles, accordion height, play/pause morphs.' },
];

export const DURATIONS = [
  { id: 'micro', ms: 120, name: 'Micro', use: 'Colour, opacity, focus rings, checkbox ticks.' },
  { id: 'fast', ms: 160, name: 'Fast', use: 'Hover lifts, tooltip fade, underline grow.' },
  { id: 'ui', ms: 200, name: 'UI', use: 'Buttons, chips, segmented controls.' },
  { id: 'layout', ms: 320, name: 'Layout', use: 'Sidebar width, grid reflow, tab panels.' },
  { id: 'sheet', ms: 400, name: 'Sheet', use: 'Drawers, dialogs, shared-element expands.' },
  { id: 'hero', ms: 640, name: 'Hero', use: 'First-paint reveals, page curtains, logo draws.' },
  { id: 'cinematic', ms: 900, name: 'Cinematic', use: 'Once-per-session intros. Never loop this long.' },
];

export const RECIPES: Recipe[] = [
  { id: 'fade-rise', name: 'Fade and rise', trigger: 'First paint or [data-replay]', property: 'opacity, transform', from: '0 / translateY(12px)', to: '1 / none', duration: '520ms', easing: 'expo-out', delay: 'stagger 60ms', reduced: 'opacity only, 1ms', note: 'The Lounge .reveal. Cap stagger at 8 items.' },
  { id: 'underline-grow', name: 'Underline grow', trigger: 'hover / focus-visible', property: 'transform (scaleX)', from: '0, origin left', to: '1', duration: '200ms', easing: 'standard', reduced: 'instant underline', note: 'Use a ::after, not text-decoration, so you can ease it.' },
  { id: 'rail-collapse', name: 'Sidebar rail', trigger: 'toggle / ⌘B', property: 'width', from: '240px', to: '64px', duration: '320ms', easing: 'standard', delay: 'labels 0–160ms opacity', reduced: 'width snap, no label slide', note: 'Fade labels out *before* the width finishes so they never wrap.' },
  { id: 'sheet-up', name: 'Sheet up', trigger: 'open', property: 'transform', from: 'translateY(100%)', to: '0', duration: '400ms', easing: 'ios-sheet', reduced: 'opacity 160ms, no travel', note: 'Dim the scrim on a 240ms linear fade, not the sheet curve.' },
  { id: 'dialog-scale', name: 'Dialog in', trigger: 'open', property: 'opacity, transform', from: '0 / scale(.96)', to: '1 / 1', duration: '240ms', easing: 'expo-out', reduced: 'opacity only', note: 'Focus the first field after the transitionend, not immediately.' },
  { id: 'toast-stack', name: 'Toast enter', trigger: 'push', property: 'transform, opacity', from: 'translateY(8px)', to: '0', duration: '200ms', easing: 'enter', reduced: 'opacity 120ms', note: 'Older toasts shift up 8px on the layout curve, not the enter curve.' },
  { id: 'tab-ink', name: 'Tab ink bar', trigger: 'selected change', property: 'left, width', from: 'previous rect', to: 'new rect', duration: '280ms', easing: 'standard', reduced: 'snap', note: 'Measure getBoundingClientRect; don’t animate with magic numbers.' },
  { id: 'count-up', name: 'Count up', trigger: 'in view / replay', property: 'text content', from: '0', to: 'target', duration: '800ms', easing: 'expo-out (via JS ease)', reduced: 'set final number immediately', note: 'tabular-nums. Never more than four counters on one frame.' },
  { id: 'draw-stroke', name: 'SVG stroke draw', trigger: 'first paint / replay', property: 'stroke-dashoffset', from: 'path length', to: '0', duration: '700ms', easing: 'standard', reduced: 'offset 0 immediately', note: 'Set dasharray to the measured length. Replay resets to length then plays.' },
  { id: 'marquee', name: 'Marquee', trigger: 'always', property: 'transform', from: '0', to: '−50%', duration: '40–70s linear infinite', easing: 'linear', reduced: 'static, no animation', note: 'Duplicate the row so the loop is seamless. Pause on hover.' },
  { id: 'like-pop', name: 'Like pop', trigger: 'click', property: 'transform', from: '1', to: '1.18 then 1', duration: '280ms', easing: 'spring-soft', reduced: 'colour change only', note: 'Optimistic: flip state first, then animate.' },
  { id: 'page-curtain', name: 'Page curtain', trigger: 'route change', property: 'clip-path or translateY', from: 'inset(0 0 100% 0)', to: 'inset(0)', duration: '640ms out, 520ms in', easing: 'emphasized / expo-out', reduced: 'crossfade 160ms', note: 'Hold the outgoing page until the curtain covers, then swap.' },
  { id: 'shared-expand', name: 'Shared expand', trigger: 'card click', property: 'top/left/width/height or grid-row', from: 'card rect', to: 'stage rect', duration: '400ms', easing: 'emphasized', reduced: 'instant swap', note: 'One element travels. Don’t fade a new one in on top.' },
  { id: 'skeleton-swap', name: 'Skeleton to content', trigger: 'data ready', property: 'opacity, filter', from: 'skeleton 1 / content 0', to: 'inverse', duration: '240ms', easing: 'standard', reduced: 'instant swap', note: 'Crossfade, don’t pop. Skeleton geometry should match the content.' },
  { id: 'magnetic', name: 'Magnetic pull', trigger: 'pointer within 48px', property: 'transform', from: '0,0', to: 'dx*0.28, dy*0.28', duration: '160ms', easing: 'standard', reduced: 'no follow', note: 'Reset on leave. Never more than 8px of travel.' },
  { id: 'theme-circle', name: 'Theme circle wipe', trigger: 'toggle', property: 'clip-path on view transition', from: 'circle(0 at origin)', to: 'circle(max radius)', duration: '520ms', easing: 'standard', reduced: 'instant theme swap', note: 'This is how the Lounge day/night toggle works.' },
];

export function easingCss(e: Easing) {
  return `/* ${e.name} · easing from Designed using Design Lounge (https://www.designlounge.live) */
--ease-${e.id}: ${e.css};`;
}

export function tokensCss() {
  return `/* Motion tokens · Designed using Design Lounge (https://www.designlounge.live) */
:root {
${EASINGS.map((e) => `  --ease-${e.id}: ${e.css};`).join('\n')}
${DURATIONS.map((d) => `  --t-${d.id}: ${d.ms}ms;`).join('\n')}
}`;
}

export function recipeCss(r: Recipe) {
  return `/* ${r.name} · motion recipe from Designed using Design Lounge (https://www.designlounge.live)
   Trigger: ${r.trigger}
   ${r.property}: ${r.from} → ${r.to}
   ${r.duration} ${r.easing}${r.delay ? ` · ${r.delay}` : ''}
   Reduced motion: ${r.reduced} */
.recipe-${r.id} {
  transition: ${r.property.split(',')[0].trim()} ${r.duration} var(--ease-${r.easing}, cubic-bezier(0.2, 0.7, 0.2, 1));
}
@media (prefers-reduced-motion: reduce) {
  .recipe-${r.id} { transition-duration: 1ms; }
}`;
}
