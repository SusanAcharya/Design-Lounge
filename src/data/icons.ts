export const ICON_GROUPS = [
  { id: 'interface', label: 'Interface' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'media', label: 'Media' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'communication', label: 'Communication' },
  { id: 'files', label: 'Files' },
  { id: 'editing', label: 'Editing' },
  { id: 'status', label: 'Status' },
  { id: 'objects', label: 'Objects' },
] as const;

export type IconGroup = (typeof ICON_GROUPS)[number]['id'];

export interface IconDef {
  id: string;
  name: string;
  group: IconGroup;
  d: string;
}

/** 24×24, stroke 1.75, round caps. `d` is inner SVG markup (paths/circles/rects). */
export const ICONS: IconDef[] = [
  { id: 'search', name: 'Search', group: 'interface', d: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>' },
  { id: 'menu', name: 'Menu', group: 'interface', d: '<path d="M4 7h16M4 12h16M4 17h16"/>' },
  { id: 'x', name: 'Close', group: 'interface', d: '<path d="M6 6l12 12M18 6L6 18"/>' },
  { id: 'plus', name: 'Plus', group: 'interface', d: '<path d="M12 5v14M5 12h14"/>' },
  { id: 'minus', name: 'Minus', group: 'interface', d: '<path d="M5 12h14"/>' },
  { id: 'check', name: 'Check', group: 'interface', d: '<path d="M5 12l5 5 9-9"/>' },
  { id: 'more-h', name: 'More horizontal', group: 'interface', d: '<circle cx="6" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18" cy="12" r="1.2"/>' },
  { id: 'more-v', name: 'More vertical', group: 'interface', d: '<circle cx="12" cy="6" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="18" r="1.2"/>' },
  { id: 'filter', name: 'Filter', group: 'interface', d: '<path d="M4 6h16l-6 7v5l-4 2v-7z"/>' },
  { id: 'sliders', name: 'Sliders', group: 'interface', d: '<path d="M4 8h16M4 16h16M8 6v4M16 14v4"/>' },
  { id: 'settings', name: 'Settings', group: 'interface', d: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"/>' },
  { id: 'eye', name: 'Eye', group: 'interface', d: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>' },
  { id: 'eye-off', name: 'Eye off', group: 'interface', d: '<path d="M3 3l18 18M10.6 10.6A3 3 0 0012 15a3 3 0 002.4-4.8M6.1 6.1C3.8 7.8 2 12 2 12s4 7 10 7c2 0 3.8-.6 5.3-1.5M9.9 4.2C10.6 4.1 11.3 4 12 4c6 0 10 8 10 8a16 16 0 01-3.2 3.8"/>' },
  { id: 'lock', name: 'Lock', group: 'interface', d: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>' },
  { id: 'unlock', name: 'Unlock', group: 'interface', d: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 017.5-2"/>' },
  { id: 'user', name: 'User', group: 'interface', d: '<circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0116 0"/>' },
  { id: 'users', name: 'Users', group: 'interface', d: '<circle cx="9" cy="8" r="3"/><path d="M2 20a7 7 0 0114 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 20a6 6 0 006 0"/>' },
  { id: 'bell', name: 'Bell', group: 'interface', d: '<path d="M6 16h12l-1-7a5 5 0 00-10 0z"/><path d="M10 16v1a2 2 0 004 0v-1"/>' },
  { id: 'home', name: 'Home', group: 'navigation', d: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>' },
  { id: 'arrow-left', name: 'Arrow left', group: 'navigation', d: '<path d="M19 12H5M11 6l-6 6 6 6"/>' },
  { id: 'arrow-right', name: 'Arrow right', group: 'navigation', d: '<path d="M5 12h14M13 6l6 6-6 6"/>' },
  { id: 'arrow-up', name: 'Arrow up', group: 'navigation', d: '<path d="M12 19V5M6 11l6-6 6 6"/>' },
  { id: 'arrow-down', name: 'Arrow down', group: 'navigation', d: '<path d="M12 5v14M6 13l6 6 6-6"/>' },
  { id: 'chevron-left', name: 'Chevron left', group: 'navigation', d: '<path d="M15 6l-6 6 6 6"/>' },
  { id: 'chevron-right', name: 'Chevron right', group: 'navigation', d: '<path d="M9 6l6 6-6 6"/>' },
  { id: 'chevron-up', name: 'Chevron up', group: 'navigation', d: '<path d="M6 15l6-6 6 6"/>' },
  { id: 'chevron-down', name: 'Chevron down', group: 'navigation', d: '<path d="M6 9l6 6 6-6"/>' },
  { id: 'external', name: 'External', group: 'navigation', d: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5"/>' },
  { id: 'compass', name: 'Compass', group: 'navigation', d: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 6-6 2 2-6z"/>' },
  { id: 'map-pin', name: 'Map pin', group: 'navigation', d: '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/>' },
  { id: 'sidebar', name: 'Sidebar', group: 'navigation', d: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>' },
  { id: 'layout', name: 'Layout', group: 'navigation', d: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M10 10v10"/>' },
  { id: 'play', name: 'Play', group: 'media', d: '<path d="M8 6l12 6-12 6z"/>' },
  { id: 'pause', name: 'Pause', group: 'media', d: '<path d="M8 5v14M16 5v14"/>' },
  { id: 'skip-back', name: 'Skip back', group: 'media', d: '<path d="M5 5v14M19 5l-10 7 10 7z"/>' },
  { id: 'skip-fwd', name: 'Skip forward', group: 'media', d: '<path d="M19 5v14M5 5l10 7-10 7z"/>' },
  { id: 'volume', name: 'Volume', group: 'media', d: '<path d="M5 10v4h4l5 4V6l-5 4H5z"/><path d="M16 9.5a3.5 3.5 0 010 5"/>' },
  { id: 'mic', name: 'Mic', group: 'media', d: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0012 0M12 17v4"/>' },
  { id: 'image', name: 'Image', group: 'media', d: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 16l-5-5-8 8"/>' },
  { id: 'film', name: 'Film', group: 'media', d: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M17 9h4M3 15h4M17 15h4"/>' },
  { id: 'music', name: 'Music', group: 'media', d: '<path d="M9 18V6l12-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>' },
  { id: 'camera', name: 'Camera', group: 'media', d: '<path d="M4 8h4l2-2h4l2 2h4v11H4z"/><circle cx="12" cy="13" r="3.5"/>' },
  { id: 'headphones', name: 'Headphones', group: 'media', d: '<path d="M4 13a8 8 0 0116 0"/><rect x="3" y="13" width="4" height="7" rx="1.5"/><rect x="17" y="13" width="4" height="7" rx="1.5"/>' },
  { id: 'cart', name: 'Cart', group: 'commerce', d: '<path d="M4 6h2l2 11h10l2-8H7"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>' },
  { id: 'bag', name: 'Bag', group: 'commerce', d: '<path d="M6 8h12l-1 12H7z"/><path d="M9 8V7a3 3 0 016 0v1"/>' },
  { id: 'card', name: 'Card', group: 'commerce', d: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>' },
  { id: 'tag', name: 'Tag', group: 'commerce', d: '<path d="M3 12l9-9h8v8l-9 9z"/><circle cx="16" cy="8" r="1.2"/>' },
  { id: 'gift', name: 'Gift', group: 'commerce', d: '<rect x="4" y="10" width="16" height="10" rx="1"/><path d="M4 10h16M12 10v10M12 10c-2-4-6-4-6 0M12 10c2-4 6-4 6 0"/>' },
  { id: 'receipt', name: 'Receipt', group: 'commerce', d: '<path d="M7 3h10v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4z"/><path d="M9 8h6M9 12h6M9 16h4"/>' },
  { id: 'percent', name: 'Percent', group: 'commerce', d: '<path d="M6 18L18 6"/><circle cx="8" cy="8" r="2"/><circle cx="16" cy="16" r="2"/>' },
  { id: 'mail', name: 'Mail', group: 'communication', d: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 8l9 6 9-6"/>' },
  { id: 'send', name: 'Send', group: 'communication', d: '<path d="M4 12l16-8-6 16-2-7z"/>' },
  { id: 'message', name: 'Message', group: 'communication', d: '<path d="M4 5h16v11H8l-4 3z"/>' },
  { id: 'phone', name: 'Phone', group: 'communication', d: '<path d="M7 3h4l1 4-2 2a12 12 0 006 6l2-2 4 1v4c0 1-1 2-2 2C9 20 4 15 4 5c0-1 1-2 3-2z"/>' },
  { id: 'at', name: 'At', group: 'communication', d: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M15 12v2.5a2 2 0 003.5 1"/>' },
  { id: 'link', name: 'Link', group: 'communication', d: '<path d="M10 13a4 4 0 006 0l2-2a4 4 0 00-6-6l-1 1"/><path d="M14 11a4 4 0 00-6 0l-2 2a4 4 0 006 6l1-1"/>' },
  { id: 'share', name: 'Share', group: 'communication', d: '<circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="M8 11l8-4M8 13l8 4"/>' },
  { id: 'hash', name: 'Hash', group: 'communication', d: '<path d="M9 4l-2 16M17 4l-2 16M4 9h16M4 15h16"/>' },
  { id: 'file', name: 'File', group: 'files', d: '<path d="M7 3h8l5 5v13H7z"/><path d="M15 3v5h5"/>' },
  { id: 'folder', name: 'Folder', group: 'files', d: '<path d="M3 7h7l2 2h9v10H3z"/>' },
  { id: 'folder-plus', name: 'Folder plus', group: 'files', d: '<path d="M3 7h7l2 2h9v10H3z"/><path d="M12 12v6M9 15h6"/>' },
  { id: 'download', name: 'Download', group: 'files', d: '<path d="M12 4v12M7 12l5 5 5-5M5 20h14"/>' },
  { id: 'upload', name: 'Upload', group: 'files', d: '<path d="M12 20V8M7 12l5-5 5 5M5 4h14"/>' },
  { id: 'clipboard', name: 'Clipboard', group: 'files', d: '<rect x="7" y="4" width="10" height="16" rx="2"/><path d="M9 4V3h6v1"/>' },
  { id: 'copy', name: 'Copy', group: 'files', d: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M6 16H5a1 1 0 01-1-1V5a1 1 0 011-1h10a1 1 0 011 1v1"/>' },
  { id: 'trash', name: 'Trash', group: 'files', d: '<path d="M5 7h14M9 7V5h6v2M8 7l1 13h6l1-13"/>' },
  { id: 'archive', name: 'Archive', group: 'files', d: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>' },
  { id: 'edit', name: 'Edit', group: 'editing', d: '<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M13 7l4 4"/>' },
  { id: 'pen', name: 'Pen', group: 'editing', d: '<path d="M4 20l4-1 12-12-3-3L5 16z"/>' },
  { id: 'type', name: 'Type', group: 'editing', d: '<path d="M5 6h14M12 6v14M8 20h8"/>' },
  { id: 'bold', name: 'Bold', group: 'editing', d: '<path d="M7 5h6a4 4 0 010 8H7zM7 13h7a4 4 0 010 8H7z"/>' },
  { id: 'italic', name: 'Italic', group: 'editing', d: '<path d="M14 5H8M16 19H10M15 5l-6 14"/>' },
  { id: 'list', name: 'List', group: 'editing', d: '<path d="M9 7h11M9 12h11M9 17h11M5 7h.01M5 12h.01M5 17h.01"/>' },
  { id: 'align-left', name: 'Align left', group: 'editing', d: '<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>' },
  { id: 'crop', name: 'Crop', group: 'editing', d: '<path d="M7 3v14h14M3 7h14v14"/>' },
  { id: 'layers', name: 'Layers', group: 'editing', d: '<path d="M12 4l9 5-9 5-9-5z"/><path d="M3 14l9 5 9-5"/>' },
  { id: 'info', name: 'Info', group: 'status', d: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 8h.01"/>' },
  { id: 'alert', name: 'Alert', group: 'status', d: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>' },
  { id: 'success', name: 'Success', group: 'status', d: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/>' },
  { id: 'error', name: 'Error', group: 'status', d: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>' },
  { id: 'help', name: 'Help', group: 'status', d: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 014.5 1.6c0 1.6-2 2-2 3.4M12 17h.01"/>' },
  { id: 'loader', name: 'Loader', group: 'status', d: '<path d="M12 3a9 9 0 109 9"/>' },
  { id: 'wifi', name: 'Wifi', group: 'status', d: '<path d="M5 12a10 10 0 0114 0M8 15a6 6 0 018 0"/><circle cx="12" cy="18.5" r="1.2"/>' },
  { id: 'battery', name: 'Battery', group: 'status', d: '<rect x="3" y="8" width="16" height="8" rx="1.5"/><path d="M19 11h2v2h-2M6 10.5h8v3H6z"/>' },
  { id: 'sun', name: 'Sun', group: 'status', d: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>' },
  { id: 'moon', name: 'Moon', group: 'status', d: '<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>' },
  { id: 'lamp', name: 'Lamp', group: 'objects', d: '<path d="M8 3h8l3 9H5z" fill="currentColor" stroke="none"/><path d="M12 12v6M8.5 21h7"/>' },
  { id: 'book', name: 'Book', group: 'objects', d: '<path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2z"/><path d="M6 3v16"/>' },
  { id: 'bookmark', name: 'Bookmark', group: 'objects', d: '<path d="M7 4h10v16l-5-3-5 3z"/>' },
  { id: 'star', name: 'Star', group: 'objects', d: '<path d="M12 3l2.6 5.6L21 9.2l-4.4 4 1.2 6.3L12 16.6 6.2 19.5 7.4 13.2 3 9.2l6.4-.6z"/>' },
  { id: 'heart', name: 'Heart', group: 'objects', d: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2 4 4 0 017 2c0 5.6-7 10-7 10z"/>' },
  { id: 'flag', name: 'Flag', group: 'objects', d: '<path d="M6 4v16M6 4h12l-3 4 3 4H6"/>' },
  { id: 'clock', name: 'Clock', group: 'objects', d: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>' },
  { id: 'calendar', name: 'Calendar', group: 'objects', d: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>' },
  { id: 'globe', name: 'Globe', group: 'objects', d: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>' },
  { id: 'briefcase', name: 'Briefcase', group: 'objects', d: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6h6v2"/>' },
  { id: 'terminal', name: 'Terminal', group: 'objects', d: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10l3 2-3 2M13 14h4"/>' },
  { id: 'code', name: 'Code', group: 'objects', d: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/>' },
  { id: 'spark', name: 'Spark', group: 'objects', d: '<path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z"/>' },
];

export const ICON_CREDIT = `Lounge Icons · Designed using Design Lounge · designlounge.vercel.app`;

export function iconSvg(icon: IconDef, opts: { size?: number; stroke?: number } = {}) {
  const size = opts.size ?? 24;
  const stroke = opts.stroke ?? 1.75;
  return `<!-- ${ICON_CREDIT} · ${icon.name} -->
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${icon.name}">
  ${icon.d}
</svg>`;
}

export function iconSprite(icons: IconDef[] = ICONS) {
  return `<!-- ${ICON_CREDIT} -->
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${icons.map((i) => `  <symbol id="lounge-${i.id}" viewBox="0 0 24 24">${i.d}</symbol>`).join('\n')}
</svg>`;
}
