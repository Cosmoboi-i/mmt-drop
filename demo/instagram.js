/* Dummy Instagram post + iOS-style share sheet.
   Self-contained: no MMT code, styles or data are imported here.
   Tapping the MMT tile hands the post id to the MMT app route. */

const POST = {
  id: 'DW8x2kQz1ab',
  user: 'mohak',
  place: 'Borra Caves',
  captionStruck: 'Indiana Jones',
  caption: 'Indian Mohak',
  url: 'https://www.instagram.com/p/DW8x2kQz1ab/',
  likes: '12,418'
};

/* ---------- inline art, so nothing loads from the network ---------- */
const ART = {
  cave: `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="mist" cx="50%" cy="46%" r="42%">
        <stop offset="0%" stop-color="#E9ECE6"/><stop offset="55%" stop-color="#C2C8BE"/>
        <stop offset="100%" stop-color="#7D857A"/>
      </radialGradient>
      <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#9AA396"/><stop offset="100%" stop-color="#5E6A58"/>
      </linearGradient>
    </defs>

    <rect width="400" height="500" fill="url(#mist)"/>
    <path d="M104 340 L150 292 L186 318 L226 282 L268 322 L300 300 L300 344 Z" fill="url(#far)" opacity=".5"/>
    <path d="M104 352 C150 336 206 338 252 352 C288 362 300 372 300 380 H100 C100 370 108 358 104 352 Z"
      fill="#5A6455" opacity=".8"/>

    <path fill-rule="evenodd" fill="#0B0F09" d="M0 0 H400 V500 H0 Z
      M200 46 C266 50 306 104 318 176 C330 248 322 320 294 368
      C270 410 236 430 200 434 C164 430 130 410 106 368
      C78 320 70 248 82 176 C94 104 134 50 200 46 Z"/>

    <path d="M96 150 C120 176 122 214 112 246 C104 274 110 304 122 330 C104 300 88 258 92 208 C94 182 94 164 96 150 Z" fill="#0B0F09"/>
    <path d="M304 160 C286 190 284 224 294 256 C302 282 298 312 286 336 C306 306 318 262 314 214 C312 188 308 172 304 160 Z" fill="#0B0F09"/>
    <path d="M150 62 C170 92 176 118 170 146 C186 116 184 84 176 60 Z" fill="#0B0F09"/>
    <path d="M244 64 C228 96 224 124 232 152 C218 122 218 88 226 62 Z" fill="#0B0F09"/>

    <g fill="#16210F">
      <circle cx="120" cy="120" r="30"/><circle cx="152" cy="92" r="22"/><circle cx="96" cy="166" r="24"/>
      <circle cx="286" cy="132" r="28"/><circle cx="256" cy="98" r="20"/><circle cx="308" cy="182" r="22"/>
      <circle cx="200" cy="66" r="24"/><circle cx="168" cy="72" r="16"/><circle cx="234" cy="74" r="18"/>
    </g>
    <g stroke="#16210F" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9">
      <path d="M124 146 C132 186 126 216 112 244"/>
      <path d="M282 158 C274 196 280 226 294 252"/>
      <path d="M186 88 C182 112 186 130 196 146"/>
    </g>

    <path d="M96 386 C142 366 186 360 208 372 C234 386 272 390 306 380 C306 408 292 428 264 436 H140 C114 428 98 410 96 386 Z"
      fill="#090C07"/>
    <path d="M140 380 C170 366 196 366 214 376 C196 382 168 384 140 380 Z" fill="#11160D"/>

    <g fill="#050704">
      <path d="M196 322 c1-7 6-10 8-16 c2-6-1-11 3-14 c5-4 11 0 10 6 c-1 6-5 8-6 13 c-1 6 3 11 2 17
               c-1 7-6 12-6 19 l1 12 l-6 1 l-2-13 c-1-8-5-16-4-25 Z"/>
      <path d="M204 356 l10 20 l-5 3 l-11-19 Z"/>
      <path d="M200 358 l-11 19 l5 3 l10-20 Z"/>
      <path d="M210 330 l14-7 l3 5 l-15 8 Z"/>
    </g>

    <g fill="#0B0F09" opacity=".55">
      <path d="M0 458 C70 442 140 448 200 462 C264 476 330 474 400 458 V500 H0 Z"/>
    </g>
  </svg>`,
  avatar: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="av" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9BB7D4"/><stop offset="100%" stop-color="#37506B"/></linearGradient></defs>
    <rect width="40" height="40" fill="url(#av)"/>
    <path d="M0 30 L10 22 L18 28 L28 18 L40 28 V40 H0 Z" fill="#20303F"/>
    <circle cx="20" cy="15" r="4" fill="#F2C9A0"/>
    <path d="M16 20 h8 v9 h-8 z" fill="#C7443B"/>
  </svg>`,
  friends: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F2B441"/><stop offset="100%" stop-color="#C0472F"/></linearGradient></defs>
    <rect width="64" height="64" fill="url(#fg)"/>
    <g fill="#8E2F22"><circle cx="16" cy="30" r="9"/><circle cx="32" cy="27" r="10"/><circle cx="48" cy="30" r="9"/></g>
    <g fill="#F7D9A6"><circle cx="16" cy="26" r="5"/><circle cx="32" cy="23" r="6"/><circle cx="48" cy="26" r="5"/></g>
    <path d="M0 48 c8-8 18-10 32-10 s24 2 32 10 v16 H0 Z" fill="#6E2318"/>
  </svg>`
};

const ICON = {
  back: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>`,
  heart: `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1z"/></svg>`,
  comment: `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-4.2-1L3 20l1.2-4.4A8.4 8.4 0 0 1 3 11.5a8.5 8.5 0 0 1 9-8.4 8.4 8.4 0 0 1 9 8.4z"/></svg>`,
  plane: `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,
  bookmark: `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  doc: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h10M4 11h8M4 16h6"/><path d="M18 5v14M16 5h4M16 19h4"/></svg>`,
  copy: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/></svg>`,
  people: `<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="8" r="3.4"/><circle cx="16.5" cy="9" r="2.8"/><path d="M2.5 18c0-3.2 2.9-5 6.5-5s6.5 1.8 6.5 5z"/><path d="M16.5 13.4c2.9 0 5 1.5 5 4.6h-4.2c0-1.8-.5-3.3-1.4-4.5z"/></svg>`,
  whatsapp: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.6 4.8-1.3A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 1.9c.1.2 0 .4-.1.5l-.3.4c-.1.1-.3.3-.1.6.1.3.6 1.1 1.3 1.7.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.2.1.7-.1 1.2z"/></svg>`
};

const APP_TILES = {
  linkedin: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" fill="#0A66C2"/>
    <circle cx="19" cy="19" r="5" fill="#fff"/><rect x="14" y="27" width="10" height="23" fill="#fff"/>
    <path d="M30 27h10v3c2-3 5-4 8-4 7 0 10 4 10 12v12H48V39c0-4-1-6-4-6s-4 2-4 6v11H30z" fill="#fff"/></svg>`,
  mmt: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" fill="#E4262C"/>
    <text x="32" y="43" font-family="Georgia,'Times New Roman',serif" font-size="30" font-style="italic" font-weight="700" fill="#fff" text-anchor="middle">my</text></svg>`,
  outlook: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" fill="#fff"/>
    <path d="M34 18l22 8-22 8z" fill="#28A8EA"/><path d="M34 30l22 8-22 8z" fill="#0078D4"/>
    <path d="M12 22h20v20H12z" fill="#0364B8"/><path d="M8 24l22-6v28L8 40z" fill="#14447D"/>
    <circle cx="19" cy="32" r="6" fill="#fff"/></svg>`,
  instagram: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#FDCB5C"/><stop offset="35%" stop-color="#E95950"/>
      <stop offset="70%" stop-color="#D62976"/><stop offset="100%" stop-color="#8134AF"/></linearGradient></defs>
    <rect width="64" height="64" fill="url(#ig)"/>
    <rect x="15" y="15" width="34" height="34" rx="10" fill="none" stroke="#fff" stroke-width="3.4"/>
    <circle cx="32" cy="32" r="8.5" fill="none" stroke="#fff" stroke-width="3.4"/>
    <circle cx="42.5" cy="21.5" r="2.4" fill="#fff"/></svg>`
};

/* ---------- render ---------- */
const app = document.getElementById('ig-app');
let sheetOpen = false;

function postScreen() {
  return `
  <div class="ig-topbar">
    <button aria-label="Back">${ICON.back}</button>
    <span class="ig-title">Posts</span>
  </div>

  <div class="ig-userrow">
    <span class="ig-avatar">${ART.avatar}</span>
    <span class="ig-who">
      <span class="ig-name">${POST.user}</span><br>
      <span class="ig-place">${POST.place}</span>
    </span>
    <button class="ig-menu" aria-label="More"><i></i><i></i></button>
  </div>

  <div class="ig-media">
    <img src="../assets/borra-caves.jpg" alt="Inside Borra Caves"
         onerror="this.replaceWith(Object.assign(document.createElement('div'),{innerHTML:ART.cave}).firstChild)">
  </div>

  <div class="ig-actions">
    <button aria-label="Like">${ICON.heart}</button>
    <button aria-label="Comment">${ICON.comment}</button>
    <button class="ig-share-btn" data-act="openSheet" aria-label="Share">${ICON.plane}</button>
    <span class="ig-spacer"></span>
    <button aria-label="Save">${ICON.bookmark}</button>
  </div>

  <div class="ig-likes">${POST.likes} likes</div>
  <div class="ig-caption"><b>${POST.user}</b><s>${POST.captionStruck}</s> ${POST.caption}</div>
  <div class="ig-meta">2 hours ago</div>`;
}

function shareSheet() {
  const contacts = [
    { label: 'Friiends', art: ART.friends },
    { label: 'My Family', icon: ICON.people },
    { label: 'BoysTrip', icon: ICON.people }
  ];
  const apps = [
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'mmt', label: 'MMT', act: 'toMMT' },
    { key: 'outlook', label: 'Outlook' },
    { key: 'instagram', label: 'Instagram' }
  ];
  return `
  <div class="ig-backdrop" id="ig-backdrop" data-act="closeSheet">
    <div class="ig-sheet" data-stop="1">
      <div class="ig-sheet-head">
        <button class="ig-cancel" data-act="closeSheet">Cancel</button>
        <span class="ig-sheet-title">Sharing text</span>
        <span class="ig-ghost"></span>
      </div>

      <div class="ig-preview">
        <span class="ig-doc">${ICON.doc}</span>
        <span class="ig-ptext">
          <s>${POST.captionStruck}</s> ${POST.caption}
          <span class="ig-url">${POST.url}</span>
        </span>
        <button class="ig-copy" data-act="copy" aria-label="Copy">${ICON.copy}</button>
      </div>

      <div class="ig-row">
        ${contacts.map(c => `
          <span class="ig-target">
            <span class="ig-badgewrap">
              <span class="ig-circle">${c.art || c.icon}</span>
              <span class="ig-wa">${ICON.whatsapp}</span>
            </span>
            <span class="ig-label">${c.label}</span>
          </span>`).join('')}
      </div>

      <div class="ig-divider"></div>

      <div class="ig-row">
        ${apps.map(a => `
          <span class="ig-target ig-app ${a.key === 'mmt' ? 'is-mmt' : ''}" ${a.act ? `data-act="${a.act}"` : ''}>
            <span class="ig-tile">${APP_TILES[a.key]}</span>
            <span class="ig-label">${a.label}</span>
          </span>`).join('')}
      </div>
    </div>
  </div>`;
}

function render() {
  app.innerHTML = postScreen() + (sheetOpen ? shareSheet() : '') + '<div class="ig-handoff" id="ig-flash"></div>';
}

/* ---------- interactions ---------- */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;

  if (act === 'openSheet') { sheetOpen = true; render(); }

  if (act === 'closeSheet') {
    if (e.target.closest('[data-stop]') && el.classList.contains('ig-backdrop')) return;
    const bd = document.getElementById('ig-backdrop');
    if (bd) {
      bd.classList.add('closing');
      setTimeout(() => { sheetOpen = false; render(); }, 220);
    }
  }

  if (act === 'copy') { el.style.opacity = '.4'; setTimeout(() => { el.style.opacity = '1'; }, 220); }

  /* Hand the post id to the MMT app route. No network call, no auth. */
  if (act === 'toMMT') {
    document.getElementById('ig-flash').classList.add('on');
    app.classList.add('leaving');
    setTimeout(() => {
      window.location.href = '../index.html?post=' + encodeURIComponent(POST.id) + '&from=instagram';
    }, 320);
  }
});

render();
