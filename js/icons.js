/* Lucide-style outline icons. Stroke is currentColor, so colour always
   comes from the theme via CSS. Presentation layer only. */
const ICON_PATHS = {
  arrowLeft:  '<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>',
  chevronRight:'<path d="M9 18l6-6-6-6"/>',
  chevronDown:'<path d="M6 9l6 6 6-6"/>',
  calendar:   '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  users:      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
  wallet:     '<path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5"/><path d="M17 13h.01"/>',
  mapPin:     '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  link:       '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  sparkles:   '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/>',
  search:     '<circle cx="11" cy="11" r="7"/><path d="M21 21l-3.6-3.6"/>',
  heart:      '<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1z"/>',
  share:      '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/>',
  check:      '<path d="M20 6L9 17l-5-5"/>',
  clock:      '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bell:       '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  plus:       '<path d="M12 5v14M5 12h14"/>',
  minus:      '<path d="M5 12h14"/>',
  sun:        '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  mountain:   '<path d="M8 3l4 8 3-4 6 11H3l5-15z"/>',
  ticket:     '<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4z"/><path d="M13 7v10"/>',
  mic:        '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  user:       '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  video:      '<rect x="2" y="5" width="14" height="14" rx="3"/><path d="M16 10l6-3v10l-6-3"/>',
  refresh:    '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>'
};

function icon(name, size) {
  const p = ICON_PATHS[name];
  if (!p) return '';
  const s = size || 18;
  return `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true" focusable="false">${p}</svg>`;
}
