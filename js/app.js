/* MMT Drop — prototype app. Everything is mock data; no live APIs, auth or payments. */

/* ============================ state ============================ */
const S = {
  role: 'viewer',
  screen: 'home',
  tplId: null,
  tier: 'comfort',
  windowId: null,
  addOns: [],
  travellers: 2,
  customDates: '',
  saved: [],
  bookings: [],
  notifyList: [],
  requests: SEED_REQUESTS.slice(),
  drafts: SEED_DRAFTS.slice(),
  sheet: null,
  toast: null,
  cardLoading: false,
  priceLoading: false,
  priceTs: null,
  fetchSeq: 0,
  resolver: { input: '', forced: 'auto', running: false, stepIdx: -1, result: null, pendingTpl: null },
  finder: { month: 9, days: 5, budget: 30000, ran: false, fromTpl: null },
  creatorTab: 'studio',
  opsTab: 'queue',
  draftForm: null,
  group: null,
  checkout: { step: 'review', split: true },
  inspired: null,   /* {postId, handle, place, tplId} when opened from a share */
  confirmation: null
};

const $ = (sel) => document.querySelector(sel);
const tpl = (id) => TEMPLATES.find(t => t.id === id);
const cr = (key) => CREATORS[key];
const money = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function nowStr() {
  const d = new Date();
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

/* ============================ pricing ============================ */
/* The plan is pre-built and stored. Only the number below is "fetched live". */
function seededJitter(seed) {
  let x = 0;
  for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) % 100000;
  return 1 + ((x % 61) - 30) / 1000; /* ±3% */
}

/* Per-person cost genuinely moves with group size: a solo traveller carries a
   whole room and cab, sharing spreads them. Illustrative factors. */
const OCCUPANCY = [
  { upTo: 1, factor: 1.28, note: 'Solo traveller — single room, no sharing' },
  { upTo: 2, factor: 1.00, note: 'Twin sharing' },
  { upTo: 3, factor: 0.96, note: 'Triple sharing, cab split 3 ways' },
  { upTo: 5, factor: 0.92, note: 'Rooms and transport split across the group' },
  { upTo: 99, factor: 0.88, note: 'Large group rate, transport split further' }
];
function occupancy(pax) {
  return OCCUPANCY.find(o => pax <= o.upTo) || OCCUPANCY[OCCUPANCY.length - 1];
}

function priceFor(t, tierId, windowId, addOnIds, seq, pax) {
  const tier = TIERS[tierId] || TIERS.comfort;
  const win = (t.dateWindows.find(w => w.id === windowId)) || { delta: 0, label: 'Custom dates' };
  const occ = occupancy(pax || 2);
  const base = t.baseDay * t.days * tier.mult * occ.factor;
  const seasoned = base * (1 + win.delta / 100);
  const live = seasoned * seededJitter(t.id + tierId + (windowId || 'custom') + seq);
  const addons = (addOnIds || []).reduce((s, id) => {
    const a = t.addOns.find(x => x.id === id);
    return s + (a ? a.price : 0);
  }, 0);
  const perPerson = Math.round((live + addons) / 50) * 50;
  const listed = Math.round((seasoned * 1.12 + addons) / 50) * 50;
  return { perPerson, listed, occupancy: occ, tierLabel: tier.label, windowLabel: win.label, extraDays: (addOnIds || []).reduce((s, id) => {
    const a = t.addOns.find(x => x.id === id); return s + (a ? a.days : 0);
  }, 0) };
}

function fromPrice(t) {
  return priceFor(t, 'value', t.dateWindows.reduce((a, b) => a.delta < b.delta ? a : b).id, [], 0).perPerson;
}

function refetchPrice() {
  S.fetchSeq++;
  S.priceLoading = true;
  render();
  setTimeout(() => { S.priceLoading = false; S.priceTs = nowStr(); render(); }, 520);
}

/* ============================ art ============================ */
function artSvg(key, seedText) {
  const k = ART_KEYS.includes(key) ? key : ART_KEYS[0];
  const id = 'sky_' + k + String(seedText || '').length;
  return `<svg viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--illus-${k}-3)"/>
        <stop offset="100%" stop-color="var(--illus-${k}-2)"/>
      </linearGradient>
    </defs>
    <rect width="400" height="200" fill="url(#${id})"/>
    <circle cx="318" cy="48" r="22" fill="var(--illus-paper)" opacity=".85"/>
    <path d="M0 150 L70 104 L118 138 L178 92 L242 142 L308 112 L400 152 L400 200 L0 200 Z"
      fill="var(--illus-grey)" opacity=".9"/>
    <path d="M0 176 L86 126 L140 164 L214 122 L286 168 L400 132 L400 200 L0 200 Z"
      fill="var(--illus-${k}-1)"/>
    <path d="M214 122 L236 136 L224 140 L208 132 Z" fill="var(--illus-paper)" opacity=".9"/>
    <path d="M86 126 L106 139 L94 143 L78 135 Z" fill="var(--illus-paper)" opacity=".9"/>
    <path d="M0 176 L86 126 L140 164 L214 122 L286 168 L400 132"
      fill="none" stroke="var(--illus-ink)" stroke-width="2" stroke-linejoin="round"
      vector-effect="non-scaling-stroke" opacity=".35"/>
  </svg>`;
}

/* A template either carries a real photo or falls back to its illustration. */
function artFor(t, seedText) {
  if (t.photo) {
    return `<img class="art-photo" src="${esc(t.photo.src)}" alt="${esc(t.photo.alt)}" loading="lazy">`;
  }
  return artSvg(t.art, seedText);
}

function photoCredit(t) {
  return t.photo ? `<div class="tiny" style="margin-top:6px">${esc(t.photo.credit)}</div>` : '';
}

function trustBadge(t) {
  if (t.source === 'circle') return `<span class="badge verified">${icon('check', 13)} Creator verified</span>`;
  return `<span class="badge curated">MMT curated from a public reel</span>`;
}

function creditLine(t) {
  const c = cr(t.creator);
  return `<div class="tiny">From ${esc(c.platform)} · <strong>${esc(c.handle)}</strong>${t.source === 'watchlist' ? ' · original creator credited, not an MMT partner' : ' · MMT Creator Circle'}</div>`;
}

/* ============================ link resolver ============================ */
const RESOLVER_STEPS = [
  { k: 'circle',   lbl: 'Creator Circle registry',      pass: 'Matched a partner creator template' },
  { k: 'watchlist',lbl: 'Watchlist template library',   pass: 'Matched a stored curated template' },
  { k: 'preparing',lbl: 'Preparing queue',              pass: 'Reel detected, itinerary being drafted' },
  { k: 'none',     lbl: 'Fallback',                     pass: 'No itinerary mapped yet' }
];

function resolveLink(raw) {
  const s = (raw || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  if (!s) return { outcome: 'none', tpl: null, reason: 'Empty link' };
  const byToken = TEMPLATES.find(t => t.token && s.includes(t.token.toLowerCase()));
  const match = byToken || TEMPLATES.find(t => s.includes(t.reelLink.toLowerCase()) || t.reelLink.toLowerCase().includes(s));
  if (!match) return { outcome: 'none', tpl: null, reason: 'Creator is on neither list' };
  if (match.status === 'preparing') return { outcome: 'preparing', tpl: match, reason: 'Detected by the scan job, review pending' };
  return { outcome: match.source === 'circle' ? 'circle' : 'watchlist', tpl: match, reason: 'Template found' };
}

function runResolver() {
  const forced = S.resolver.forced;
  let res;
  if (forced === 'auto') {
    res = resolveLink(S.resolver.input);
  } else {
    const pick = {
      circle: TEMPLATES.find(t => t.source === 'circle' && t.status === 'live'),
      watchlist: TEMPLATES.find(t => t.source === 'watchlist' && t.status === 'live'),
      preparing: TEMPLATES.find(t => t.status === 'preparing'),
      none: null
    }[forced];
    res = { outcome: forced, tpl: pick, reason: 'Forced by demo toggle' };
    if (pick && !S.resolver.input) S.resolver.input = pick.reelLink;
  }
  S.resolver.running = true;
  S.resolver.stepIdx = 0;
  S.resolver.result = null;
  render();
  const target = RESOLVER_STEPS.findIndex(x => x.k === res.outcome);
  let i = 0;
  const tick = () => {
    if (i >= target) {
      S.resolver.stepIdx = target;
      S.resolver.running = false;
      S.resolver.result = res;
      render();
      return;
    }
    i++; S.resolver.stepIdx = i; render();
    setTimeout(tick, 340);
  };
  setTimeout(tick, 340);
}

function openResolvedTrip() {
  const r = S.resolver.result;
  if (!r) return;
  if (r.outcome === 'preparing') { go('preparing', r.tpl.id); return; }
  if (r.outcome === 'none') { go('unknown'); return; }
  openTrip(r.tpl.id);
}

function openTrip(id) {
  const t = tpl(id);
  S.tplId = id;
  S.tier = 'comfort';
  S.windowId = t.dateWindows[0].id;
  S.addOns = [];
  S.customDates = '';
  S.cardLoading = true;
  S.priceTs = null;
  S.screen = 'trip';
  window.scrollTo(0, 0);
  render();
  setTimeout(() => { S.cardLoading = false; S.priceTs = nowStr(); render(); }, 700);
}

/* ============================ nav helpers ============================ */
function go(screen, arg) {
  S.screen = screen;
  if (screen === 'preparing' || screen === 'trip') S.tplId = arg || S.tplId;
  window.scrollTo(0, 0);
  render();
}
function toast(msg) {
  S.toast = msg; render();
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { S.toast = null; render(); }, 2200);
}

/* ============================ share hand-off: loader ============================ */
function viewLoading() {
  const insp = S.inspired;
  return `<div class="loader">
    <div class="loader-orb">
      <span class="loader-ring"></span>
      <span class="loader-plane">${icon('plane', 30)}</span>
    </div>
    <div class="loader-title">Finding your dream vacation…</div>
    <div class="loader-sub">${insp ? 'Matching ' + esc(insp.handle) + '\u2019s post to a reviewed MMT plan' : 'Matching this post to a reviewed MMT plan'}</div>
    <div class="loader-bars">
      <span class="sk line" style="width:72%"></span>
      <span class="sk line" style="width:54%"></span>
      <span class="sk line" style="width:63%"></span>
    </div>
  </div>`;
}

/* Opened from the Instagram share sheet: ?post=<id>. The post id is looked up
   in the same reel -> itinerary association the link resolver uses. */
function bootFromShare() {
  const q = new URLSearchParams(window.location.search);
  const postId = q.get('post');
  if (!postId) return false;
  const match = POST_TEMPLATES[postId];
  if (!match) return false;
  S.inspired = { postId, handle: match.handle, place: match.place, tplId: match.tplId };
  S.screen = 'loading';
  document.body.classList.add('handoff-in');
  setTimeout(() => { openTrip(match.tplId); }, 2000);
  return true;
}

/* ============================ viewer: home ============================ */
function viewHome() {
  const r = S.resolver;
  const opts = [['auto', 'Auto'], ['circle', 'Circle'], ['watchlist', 'Watchlist'], ['preparing', 'Preparing'], ['none', 'Unknown']];
  const samples = [
    ['Circle reel', TEMPLATES.find(t => t.id === 'tpl_spiti').reelLink],
    ['Watchlist reel', TEMPLATES.find(t => t.id === 'tpl_meghalaya').reelLink],
    ['Still preparing', TEMPLATES.find(t => t.id === 'tpl_coorg').reelLink],
    ['Unknown reel', 'instagram.com/reel/ziro-valley-music']
  ];
  const live = TEMPLATES.filter(t => t.status === 'live');

  return `
  <div class="screen">
    <h1>Saw a reel. Book that trip.</h1>
    <p class="sub">Paste the reel link, or open a creator's MMT link. If we have the trip, the plan is already waiting — only the price is fetched live.</p>

    <div class="card" style="margin-top:14px">
      <h2>Paste a reel link</h2>
      <div class="searchbar" style="margin-bottom:10px">
        ${icon('sparkles', 20)}
        <input id="reelInput" placeholder="Paste a reel or shorts link" value="${esc(r.input)}" data-act="reelType">
        <span class="orb">${icon('search', 16)}</span>
      </div>
      <div class="scrollrow" style="margin-bottom:10px">
        ${samples.map(([l, v]) => `<button class="chip small" data-act="sample" data-v="${esc(v)}">${l}</button>`).join('')}
      </div>
      <button class="btn cta" data-act="resolve">${r.running ? 'Checking…' : 'Find this trip'}</button>

      <div class="divider"></div>
      <div class="section-title" style="margin:0 0 6px">
        <h3 style="margin:0">Link resolver</h3>
        <span class="section-action">Demo ${'' }<span class="knob">${icon('chevronDown', 12)}</span></span>
      </div>
      <div class="scrollrow" style="margin-bottom:8px">
        ${opts.map(([k, l]) => `<button class="chip small ${r.forced === k ? 'on' : ''}" data-act="force" data-v="${k}">${l}</button>`).join('')}
      </div>
      ${resolverPanel()}
    </div>

    <a class="promo alt" href="demo/index.html">
      <span class="promo-art">${icon('video', 24)}</span>
      <span class="promo-body">
        <strong>See it from the reel side</strong>
        <span>Open a sample Instagram post and share it to MMT.</span>
      </span>
      <span class="promo-go">${icon('chevronRight', 20)}</span>
    </a>

    <div class="section-title"><h2>Trips from reels this week</h2><span class="tiny">illustrative</span></div>
    ${live.map(t => tripRow(t)).join('')}

    <div class="promo" data-act="goFinder">
      <span class="promo-art">${icon('mountain', 24)}</span>
      <span class="promo-body">
        <strong>Not sure about the destination?</strong>
        <span>Tell us your month, days and budget. We will rank trips with the same vibe.</span>
      </span>
      <span class="promo-go">${icon('chevronRight', 20)}</span>
    </div>
    ${footNote()}
  </div>`;
}

function resolverPanel() {
  const r = S.resolver;
  const doneIdx = r.result ? RESOLVER_STEPS.findIndex(x => x.k === r.result.outcome) : r.stepIdx;
  return `
  <div>
    ${RESOLVER_STEPS.map((st, i) => {
      let cls = '', note = 'waiting';
      if (r.stepIdx >= 0) {
        if (i < doneIdx) { cls = 'fail'; note = 'no match, continue'; }
        else if (i === doneIdx) {
          if (r.result) { cls = 'pass'; note = st.pass; }
          else { cls = 'active'; note = 'checking…'; }
        }
      }
      return `<div class="resolver-step ${cls}">
        <span class="bullet">${cls === 'pass' ? icon('check', 13) : cls === 'fail' ? '·' : i + 1}</span>
        <span><span class="lbl">${st.lbl}</span><br><span class="res">${note}</span></span>
      </div>`;
    }).join('')}
    ${r.result ? `<div class="notice ${r.result.outcome === 'none' ? 'warn' : 'ok'}" style="margin-top:8px">
        <strong>${{ circle: 'Creator verified itinerary found', watchlist: 'Curated itinerary found', preparing: 'Itinerary is being prepared', none: 'No itinerary for this reel yet' }[r.result.outcome]}</strong><br>
        ${r.result.tpl ? esc(r.result.tpl.destination) + ' · ' + esc(r.result.reason) : esc(r.result.reason)}
      </div>
      <button class="btn" style="margin-top:8px" data-act="openResolved">
        ${r.result.outcome === 'none' ? 'See what we can offer' : r.result.outcome === 'preparing' ? 'Open status' : 'Open the trip'}
      </button>` : ''}
  </div>`;
}

function tripRow(t) {
  const c = cr(t.creator);
  return `<div class="card" data-act="openTrip" data-v="${t.id}" style="padding:0;overflow:hidden">
    <div class="art small" style="border-radius:0">${artFor(t, t.id)}
      <div class="art-top">${trustBadge(t)}</div>
    </div>
    <div style="padding:12px">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">
        <div>
          <div style="font-weight:800;font-size:15px">${esc(t.destination)}</div>
          <div class="tiny">${t.days} days · ${esc(t.bestSeason)} · ${esc(c.handle)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:800">${money(fromPrice(t))}</div>
          <div class="tiny">from / person</div>
        </div>
      </div>
      <div style="margin-top:8px">${t.vibeTags.map(v => `<span class="tag">${esc(v)}</span>`).join('')}</div>
    </div>
  </div>`;
}

function footNote() {
  return `<div class="foot-note tiny">Prototype for a case study. All prices, counts and creator profiles are illustrative mock data.</div>`;
}

/* ============================ viewer: trip card ============================ */
function viewTrip() {
  const t = tpl(S.tplId);
  if (!t) return viewHome();
  if (S.cardLoading) return tripSkeleton();

  const p = priceFor(t, S.tier, S.windowId, S.addOns, S.fetchSeq, S.travellers);
  const c = cr(t.creator);
  const addOnDays = t.addOns.filter(a => S.addOns.includes(a.id) && a.days > 0);
  const totalDays = t.days + p.extraDays;

  return `
  <div class="screen">
    <a class="backlink" data-act="go" data-v="home">${icon('arrowLeft', 16)} Back</a>
    ${inspiredChip(t)}
    <div class="art tall">${artFor(t, t.id)}<span class="scrim"></span>
      <div class="art-top">${trustBadge(t)}</div>
      <div class="art-bottom">
        <div class="big">${esc(t.destination)}</div>
        <div style="font-size:12.5px;opacity:.95">${esc(t.state)} · ${totalDays} days · best ${esc(t.bestSeason)}</div>
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      ${creditLine(t)}
      <p style="margin-top:8px">${esc(t.summary)}</p>
      <div>${t.vibeTags.map(v => `<span class="tag">${esc(v)}</span>`).join('')}</div>
      ${photoCredit(t)}
      <div class="divider"></div>
      ${priceBlock(t, p)}
    </div>

    <div class="card">
      <div class="section-title" style="margin:0 0 8px"><h2>Pick your dates</h2><span class="tiny">plan stays the same</span></div>
      <div class="scrollrow">
        ${t.dateWindows.map(w => `
          <button class="chip datechip ${S.windowId === w.id ? 'on' : ''}" data-act="setWindow" data-v="${w.id}">
            <span style="font-size:12.5px">${esc(w.label)}</span>
            <span style="font-size:10.5px;font-weight:600;opacity:.8">${esc(w.reason)} · ${w.delta > 0 ? '+' : ''}${w.delta}%</span>
          </button>`).join('')}
      </div>
      <div class="field" style="margin-top:10px">
        <label>Or pick your own dates</label>
        <span class="inputwrap">${icon('calendar', 18)}
          <input class="input" type="date" value="${esc(S.customDates)}" data-act="customDate"></span>
        <div class="hint">Changing dates refetches the price only. The day plan does not change.</div>
      </div>
    </div>

    <div class="card">
      <h2>Budget tier</h2>
      <div class="btnrow" style="margin-bottom:10px">
        ${Object.values(TIERS).map(tr => `
          <button class="tierbtn ${S.tier === tr.id ? 'on' : ''}" data-act="setTier" data-v="${tr.id}">
            <div class="l">${tr.label}</div>
            <div class="p">${money(priceFor(t, tr.id, S.windowId, S.addOns, S.fetchSeq, S.travellers).perPerson)}</div>
          </button>`).join('')}
      </div>
      <div class="kv"><span class="k">Stay</span><span class="v">${esc(t.stays[S.tier])}</span></div>
      <div class="kv"><span class="k">Transport</span><span class="v">${esc(t.transport[S.tier])}</span></div>
      <div class="tiny" style="margin-top:6px">Same itinerary, different stays and transport.</div>
    </div>

    <div class="card">
      <div class="section-title" style="margin:0 0 4px"><h2>Add nearby days</h2><span class="tiny">pre-curated</span></div>
      ${t.addOns.map(a => `
        <div class="row" data-act="toggleAddOn" data-v="${a.id}">
          <div>
            <div style="font-weight:700;font-size:13.5px">${esc(a.label)}</div>
            <div class="tiny">${a.days ? '+' + a.days + ' day' + (a.days > 1 ? 's' : '') : 'same day'} · +${money(a.price)} per person</div>
          </div>
          <span class="switch ${S.addOns.includes(a.id) ? 'on' : ''}"><i></i></span>
        </div>`).join('')}
    </div>

    <div class="card">
      <div class="section-title" style="margin:0 0 4px"><h2>Going as a group?</h2><span class="tiny">split pay</span></div>
      <p class="sub">Put everyone on the same booking. They vote on dates and tier, and each person pays only their own share by UPI.</p>
      <div class="steps">
        <div class="s now"><div class="c">1</div><div class="l">Invite</div></div>
        <div class="s"><div class="c">2</div><div class="l">Vote</div></div>
        <div class="s"><div class="c">3</div><div class="l">Split pay</div></div>
        <div class="s"><div class="c">4</div><div class="l">Booked</div></div>
      </div>
      <button class="btn ghost" data-act="startGroup" data-v="${t.id}">${icon('users', 16)} Bring your group onto this booking</button>
      ${S.group && S.group.tplId === t.id ? `<div class="notice ok" style="margin-top:10px">Group started · ${S.group.members.filter(m => m.joined).length} joined. <strong data-act="openGroupPage">Open the group page</strong></div>` : ''}
    </div>

    <div class="card">
      <div class="section-title" style="margin:0 0 4px"><h2>Day plan</h2><span class="tiny">reviewed by ${esc(t.reviewedBy || 'MMT')}</span></div>
      ${t.dayPlan.map(d => `
        <div class="day">
          <span class="num">D${d.d}</span>
          <span><span class="t">${esc(d.title)}</span><br><span class="x">${esc(d.text)}</span></span>
        </div>`).join('')}
      ${addOnDays.map((a, i) => `
        <div class="day">
          <span class="num addon">+${i + 1}</span>
          <span><span class="t">${esc(a.label)}</span><br><span class="x">Added day from your nearby picks.</span></span>
        </div>`).join('')}
      <div class="notice" style="margin-top:10px">This itinerary was drafted with AI help and checked by an MMT travel expert on ${esc(t.reviewedOn || '—')} before it went live. Details can still change on the ground, so we show the review date with every plan.</div>
    </div>

    <div class="promo alt" data-act="goFinderFrom" data-v="${t.id}">
      <span class="promo-art">${icon('search', 24)}</span>
      <span class="promo-body">
        <strong>Not this one?</strong>
        <span>Same vibe, different place — pick a month, days and budget.</span>
      </span>
      <span class="promo-go">${icon('chevronRight', 20)}</span>
    </div>
    ${footNote()}
  </div>
  ${tripFooter(t, p)}`;
}

function inspiredChip(t) {
  const insp = S.inspired;
  if (!insp || insp.tplId !== t.id) return '';
  return `<div class="inspired">
    <span class="inspired-thumb">${artFor(t, 'chip')}</span>
    <span class="inspired-body">
      <strong>Inspired by ${esc(insp.handle)}\u2019s reel</strong>
      <span>${esc(insp.place)} · opened from Instagram</span>
    </span>
    <span class="inspired-mark">${icon('video', 16)}</span>
  </div>`;
}

function priceBlock(t, p) {
  if (S.priceLoading) {
    return `<div><div class="sk line" style="width:52%;height:24px"></div><div class="sk line" style="width:34%"></div></div>`;
  }
  return `
  <div class="pricebox">
    <div>
      <div class="price">${money(p.perPerson)} <small>per person</small></div>
      <div><span class="strike">${money(p.listed)}</span> <span class="tiny">${esc(p.tierLabel)} · ${esc(S.customDates ? 'your dates' : p.windowLabel)}</span></div>
    </div>
    <div style="text-align:right">
      <span class="livechip"><span class="pulse"></span> Live price</span>
      <div class="tiny" style="margin-top:4px">fetched ${esc(S.priceTs || nowStr())}</div>
    </div>
  </div>
  <div class="row" style="border-top:1px solid var(--color-divider);margin-top:10px">
    <div><strong style="font-size:13.5px">Travellers</strong><div class="tiny">Total ${money(p.perPerson * S.travellers)} · ${esc(p.occupancy.note)}</div></div>
    <div class="chiprow stepper">
      <button class="chip small" data-act="pax" data-v="-">${icon('minus', 14)}</button>
      <span style="font-weight:800;min-width:18px;text-align:center">${S.travellers}</span>
      <button class="chip small" data-act="pax" data-v="+">${icon('plus', 14)}</button>
    </div>
  </div>
`;
}

function tripFooter(t, p) {
  const saved = S.saved.includes(t.id);
  return `<div class="sticky-footer">
    <button class="icbtn ${saved ? 'on' : ''}" data-act="save" data-v="${t.id}">${icon('heart', 20)}</button>
    <button class="icbtn" data-act="shareSheet">${icon('share', 20)}</button>
    <div class="book"><button class="btn cta" data-act="book">Book this trip<span>${money(p.perPerson * S.travellers)} for ${S.travellers} · ${money(p.perPerson)} each</span></button></div>
  </div>`;
}

function tripSkeleton() {
  return `<div class="screen">
    <a class="backlink" data-act="go" data-v="home">${icon('arrowLeft', 16)} Back</a>
    <div class="sk art"></div>
    <div class="card" style="margin-top:12px">
      <div class="sk line" style="width:40%"></div>
      <div class="sk line" style="width:86%"></div>
      <div class="sk line" style="width:64%"></div>
      <div class="divider"></div>
      <div class="sk line" style="width:52%;height:24px"></div>
      <div class="sk line" style="width:30%"></div>
    </div>
    <div class="card">
      <div class="sk line" style="width:34%"></div>
      <div class="sk line" style="width:92%"></div>
      <div class="sk line" style="width:78%"></div>
      <div class="sk line" style="width:88%"></div>
    </div>
    <div class="tiny" style="text-align:center">Loading the stored plan…</div>
  </div>`;
}

/* ============================ viewer: preparing + unknown ============================ */
function viewPreparing() {
  const t = tpl(S.tplId);
  const c = cr(t.creator);
  const notified = S.notifyList.includes(t.id);
  return `<div class="screen">
    <a class="backlink" data-act="go" data-v="home">${icon('arrowLeft', 16)} Back</a>
    <div class="art">${artFor(t, t.id)}<div class="art-top"><span class="badge prep">Preparing</span></div></div>
    <div class="card" style="margin-top:12px">
      <h1>We are preparing this itinerary</h1>
      <p class="sub">Our scan picked up this reel from ${esc(c.handle)} at ${esc(t.detectedAt || 'today')}. An MMT expert is checking the plan before it goes live. This usually takes a few hours.</p>
      <div class="steps">
        <div class="s done"><div class="c">${icon('check', 13)}</div><div class="l">Reel found</div></div>
        <div class="s done"><div class="c">${icon('check', 13)}</div><div class="l">Draft built</div></div>
        <div class="s now"><div class="c">3</div><div class="l">MMT review</div></div>
        <div class="s"><div class="c">4</div><div class="l">Live</div></div>
      </div>
      <button class="btn ${notified ? 'ghost' : ''}" data-act="notify" data-v="${t.id}">${notified ? icon('check', 16) + ' We will message you' : icon('bell', 16) + ' Notify me when it is ready'}</button>
    </div>
    <div class="card">
      <h2>What we already know</h2>
      <div class="kv"><span class="k">Destination</span><span class="v">${esc(t.destination)}</span></div>
      <div class="kv"><span class="k">Likely length</span><span class="v">${t.days} days</span></div>
      <div class="kv"><span class="k">Vibe</span><span class="v">${t.vibeTags.join(', ')}</span></div>
      <div class="tiny" style="margin-top:6px">Indicative only, until the review is done.</div>
    </div>
    <div class="card">
      <h2>Ready to go now?</h2>
      <p class="sub">Similar trips you can book today.</p>
      <button class="btn ghost" data-act="goFinderFrom" data-v="${t.id}">See similar trips</button>
    </div>
    ${footNote()}
  </div>`;
}

function viewUnknown() {
  const link = S.resolver.input || 'this reel';
  const asked = S.requests.some(r => r.link === S.resolver.input);
  const notified = S.notifyList.includes('link:' + S.resolver.input);
  return `<div class="screen">
    <a class="backlink" data-act="go" data-v="home">${icon('arrowLeft', 16)} Back</a>
    <div class="card">
      <h1>We do not have an itinerary for this reel yet</h1>
      <p class="sub">${esc(link)} is not from a creator we work with or track. Nothing has gone wrong — we simply have not built and checked a plan for it.</p>
      <div class="divider"></div>
      <button class="btn" data-act="goFinder">Find trips with a similar vibe</button>
      <div style="height:8px"></div>
      <button class="btn ghost" data-act="notifyLink">${notified ? icon('check', 16) + ' We will tell you if it lands' : icon('bell', 16) + ' Notify me if an itinerary appears'}</button>
      <div style="height:8px"></div>
      <button class="btn ghost" data-act="requestItin">${asked ? icon('check', 16) + ' Sent to the MMT team' : icon('plus', 16) + ' Request this itinerary'}</button>
      <div class="tiny" style="margin-top:8px">A request flags the reel for the ops team. They decide whether to build it.</div>
    </div>
    <div class="section-title"><h2>Popular right now</h2></div>
    ${TEMPLATES.filter(t => t.status === 'live').slice(0, 3).map(tripRow).join('')}
    ${footNote()}
  </div>`;
}

/* ============================ viewer: alternate destination finder ============================ */
function priceForDays(t, tierId, days, monthIdx) {
  const win = bestWindowFor(t, monthIdx);
  const base = t.baseDay * days * TIERS[tierId].mult * (1 + win.delta / 100);
  return Math.round(base / 50) * 50;
}
function bestWindowFor(t, monthIdx) {
  const fit = SEASON_FIT[t.id] || [];
  if (fit.includes(monthIdx)) return t.dateWindows.reduce((a, b) => a.delta < b.delta ? a : b);
  return t.dateWindows[0];
}
function seasonVerdict(t, monthIdx) {
  const fit = SEASON_FIT[t.id] || [];
  if (fit.includes(monthIdx)) return { label: 'Right season', cls: 'verified' };
  if (fit.includes((monthIdx + 11) % 12) || fit.includes((monthIdx + 1) % 12)) return { label: 'Edge of season', cls: 'prep' };
  return { label: 'Off season', cls: 'none' };
}
function vibeMatch(t, src) {
  if (!src) return { pct: 70, shared: t.vibeTags.slice(0, 2) };
  const a = new Set([...src.vibeTags, ...src.activities].map(x => x.toLowerCase()));
  const b = [...t.vibeTags, ...t.activities].map(x => x.toLowerCase());
  const shared = b.filter(x => a.has(x));
  const pct = Math.min(96, 38 + shared.length * 17);
  const labels = [...t.vibeTags, ...t.activities].filter(x => a.has(x.toLowerCase()));
  return { pct, shared: labels.slice(0, 3) };
}

function finderResults() {
  const f = S.finder;
  const src = f.fromTpl ? tpl(f.fromTpl) : null;
  return TEMPLATES
    .filter(t => t.status === 'live' && t.id !== f.fromTpl)
    .map(t => {
      const vm = vibeMatch(t, src);
      const sv = seasonVerdict(t, f.month);
      let tierId = 'value', fits = false;
      ['luxury', 'comfort', 'value'].forEach(id => {
        if (!fits && priceForDays(t, id, f.days, f.month) <= f.budget) { tierId = id; fits = true; }
      });
      const price = priceForDays(t, tierId, f.days, f.month);
      const score = vm.pct + (sv.cls === 'verified' ? 30 : sv.cls === 'prep' ? 10 : 0) + (fits ? 20 : 0) - Math.abs(t.days - f.days) * 2;
      return { t, vm, sv, tierId, price, fits, score };
    })
    .sort((a, b) => b.score - a.score);
}

function viewFinder() {
  const f = S.finder;
  const src = f.fromTpl ? tpl(f.fromTpl) : null;
  const res = f.ran ? finderResults() : [];
  return `<div class="screen">
    <a class="backlink" data-act="go" data-v="${src ? 'trip' : 'home'}">${icon('arrowLeft', 16)} Back</a>
    <h1>Find a trip with the same feel</h1>
    <p class="sub">${src ? 'Matching the vibe of ' + esc(src.destination) + ' — ' + src.vibeTags.join(', ').toLowerCase() + '.' : 'Tell us when you can travel, for how long and what you can spend.'}</p>

    <div class="card" style="margin-top:12px">
      <div class="field">
        <label>Travel month</label>
        <span class="inputwrap">${icon('calendar', 18)}
        <select class="input" data-act="fMonth">
          ${MONTHS.map((m, i) => `<option value="${i}" ${f.month === i ? 'selected' : ''}>${m} ${i < 9 ? '2027' : '2026'}</option>`).join('')}
        </select></span>
      </div>
      <div class="field">
        <label>Days you have — <strong>${f.days}</strong></label>
        <input class="input" type="range" min="2" max="10" value="${f.days}" data-act="fDays" style="padding:6px 0;border:0">
      </div>
      <div class="field">
        <label>Budget per person — <strong>${money(f.budget)}</strong></label>
        <input class="input" type="range" min="8000" max="90000" step="2000" value="${f.budget}" data-act="fBudget" style="padding:6px 0;border:0">
      </div>
      <button class="btn cta" data-act="runFinder">Show me trips</button>
    </div>

    ${f.ran ? `
      <div class="section-title"><h2>${res.length} trips ranked for you</h2><span class="tiny">live prices</span></div>
      ${res.map(r => finderCard(r)).join('')}
      <div class="notice" style="margin-top:4px">Ranking uses vibe overlap with the reel, season fit for ${MONTHS[f.month]} and how the total sits against your budget. All numbers are illustrative.</div>
    ` : ''}
    ${footNote()}
  </div>`;
}

function finderCard(r) {
  const { t, vm, sv, tierId, price, fits } = r;
  return `<div class="card" data-act="openTrip" data-v="${t.id}" style="padding:0;overflow:hidden">
    <div class="art small" style="border-radius:0">${artFor(t, t.id + 'f')}
      <div class="art-top"><span class="badge ${sv.cls}">${sv.label}</span><span class="badge live">${vm.pct}% vibe match</span></div>
    </div>
    <div style="padding:12px">
      <div style="display:flex;justify-content:space-between;gap:10px">
        <div>
          <div style="font-weight:800;font-size:15px">${esc(t.destination)}</div>
          <div class="tiny">${esc(t.state)} · ${t.days} day plan · ${esc(t.bestSeason)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:800">${money(price)}</div>
          <div class="tiny">${TIERS[tierId].label} · ${S.finder.days} days</div>
        </div>
      </div>
      <div style="margin-top:8px">${vm.shared.map(s => `<span class="tag">${esc(s)}</span>`).join('') || `<span class="tag">${esc(t.vibeTags[0])}</span>`}</div>
      ${!fits ? `<div class="tiny" style="color:var(--color-warning)">Above your budget — the Value tier is the closest we have.</div>` : ''}
      <div class="btnrow" style="margin-top:8px">
        <button class="btn sm ghost" data-act="openTrip" data-v="${t.id}">Open trip card</button>
        <button class="btn sm ghost" data-act="openTierTrip" data-v="${t.id}" data-t="value">Cheaper version</button>
        <button class="btn sm ghost" data-act="openTierTrip" data-v="${t.id}" data-t="luxury">Luxury</button>
      </div>
    </div>
  </div>`;
}

/* ============================ viewer: saved ============================ */
function viewSaved() {
  return `<div class="screen">
    <a class="backlink" data-act="go" data-v="home">${icon('arrowLeft', 16)} Back</a>
    <h1>Saved trips</h1>
    ${S.saved.length ? S.saved.map(id => tripRow(tpl(id))).join('') : '<div class="card"><p class="sub">Nothing saved yet. Tap the heart on any trip card.</p></div>'}
    ${footNote()}
  </div>`;
}

/* ============================ share sheet + group ============================ */
const FRIENDS = [
  { id: 'f1', name: 'Ananya', init: 'A', cls: '' },
  { id: 'f2', name: 'Rohit', init: 'R', cls: 'teal' },
  { id: 'f3', name: 'Zoya', init: 'Z', cls: 'coral' },
  { id: 'f4', name: 'Trip crew (5)', init: 'TC', cls: '' },
  { id: 'f5', name: 'Office gang', init: 'OG', cls: 'teal' }
];

function shareSheet() {
  const t = tpl(S.tplId);
  const link = 'mmt.app/drop/' + (t.token || t.id).toLowerCase();
  return sheetWrap(`
    <h2>Share to group</h2>
    <p class="sub">Send an invite. Friends vote on dates and budget, and everyone sees the same live per-person price.</p>
    <div class="card flat" style="margin:10px 0">
      <div class="tiny">Invite link</div>
      <div style="font-weight:700;font-size:13.5px;word-break:break-all">${esc(link)}</div>
    </div>
    ${FRIENDS.map(f => `<div class="wa" data-act="sendInvite" data-v="${f.id}">
      <span class="avatar ${f.cls}">${f.init}</span>
      <span style="flex:1"><strong>${esc(f.name)}</strong><div class="tiny">Tap to send the invite</div></span>
      <span class="chip small on">Send</span>
    </div>`).join('')}
    <button class="btn" style="margin-top:12px" data-act="openGroup">Open the group trip page</button>
    <div class="tiny" style="margin-top:8px">Sharing is mocked in this prototype. Nothing leaves the browser.</div>
  `);
}

function sheetWrap(inner) {
  return `<div class="backdrop" data-act="closeSheet"><div class="sheet" data-stop="1"><div class="grab"></div>${inner}</div></div>`;
}

function newGroup(t) {
  return {
    tplId: t.id,
    host: 'You',
    members: [
      { name: 'You', joined: true, confirmed: true, voteWindow: S.windowId, voteTier: S.tier, paid: false },
      { name: 'Ananya', joined: true, confirmed: true, voteWindow: t.dateWindows[2].id, voteTier: 'comfort', paid: false },
      { name: 'Rohit', joined: true, confirmed: false, voteWindow: t.dateWindows[0].id, voteTier: 'value', paid: false },
      { name: 'Zoya', joined: false, confirmed: false, voteWindow: null, voteTier: null, paid: false }
    ]
  };
}

function groupWinner(g, t) {
  const tally = (key, opts) => {
    const counts = {};
    g.members.forEach(m => { if (m[key]) counts[m[key]] = (counts[m[key]] || 0) + 1; });
    let best = opts[0], n = -1;
    opts.forEach(o => { if ((counts[o] || 0) > n) { n = counts[o] || 0; best = o; } });
    return { best, counts };
  };
  return {
    win: tally('voteWindow', t.dateWindows.map(w => w.id)),
    tier: tally('voteTier', Object.keys(TIERS))
  };
}

function viewGroup() {
  const g = S.group;
  if (!g) return viewHome();
  const t = tpl(g.tplId);
  const w = groupWinner(g, t);
  const joined0 = g.members.filter(m => m.joined).length;
  const p = priceFor(t, w.tier.best, w.win.best, S.addOns, S.fetchSeq, joined0);
  const joined = g.members.filter(m => m.joined).length;
  const confirmed = g.members.filter(m => m.confirmed).length;

  return `<div class="screen">
    <a class="backlink" data-act="go" data-v="trip">${icon('arrowLeft', 16)} Back to trip</a>
    <div class="art">${artFor(t, t.id + 'g')}<span class="scrim"></span>
      <div class="art-top">${trustBadge(t)}</div>
      <div class="art-bottom"><div class="big">${esc(t.destination)}</div><div style="font-size:12.5px">Group trip · hosted by ${esc(g.host)}</div></div>
    </div>

    <div class="card" style="margin-top:12px">
      ${S.priceLoading ? `<div class="sk line" style="width:50%;height:24px"></div><div class="sk line" style="width:32%"></div>` : `
      <div class="pricebox">
        <div>
          <div class="price">${money(p.perPerson)} <small>per person</small></div>
          <div class="tiny">${money(p.perPerson * joined)} total for ${joined} joined · ${esc(p.tierLabel)} · ${esc(p.windowLabel)}</div>
        </div>
        <div style="text-align:right"><span class="livechip"><span class="pulse"></span> Live price</span>
        <div class="tiny" style="margin-top:4px">fetched ${esc(S.priceTs || nowStr())}</div></div>
      </div>`}
      <div class="tiny" style="margin-top:6px">The price follows the winning vote. It updates as people change their picks.</div>
    </div>

    <div class="card">
      <div class="section-title" style="margin:0 0 6px"><h2>Vote on dates</h2><span class="tiny">${w.win.counts[w.win.best] || 0} of ${joined} agree</span></div>
      ${t.dateWindows.map(win => {
        const n = w.win.counts[win.id] || 0;
        const pct = joined ? Math.round(n / joined * 100) : 0;
        const mine = g.members[0].voteWindow === win.id;
        return `<div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:13px">
            <span style="font-weight:${mine ? 800 : 600}">${esc(win.label)} ${mine ? '· your vote' : ''}</span>
            <span class="tiny">${n} vote${n === 1 ? '' : 's'}</span>
          </div>
          <div class="bar" style="margin:4px 0"><i style="width:${pct}%"></i></div>
          <button class="chip small ${mine ? 'on' : ''}" data-act="voteWindow" data-v="${win.id}">${mine ? 'Voted' : 'Vote for this'}</button>
        </div>`;
      }).join('')}
    </div>

    <div class="card">
      <h2>Vote on budget tier</h2>
      <div class="btnrow">
        ${Object.values(TIERS).map(tr => {
          const n = w.tier.counts[tr.id] || 0;
          const mine = g.members[0].voteTier === tr.id;
          return `<button class="tierbtn ${mine ? 'on' : ''}" data-act="voteTier" data-v="${tr.id}">
            <div class="l">${tr.label}</div><div class="p">${n} vote${n === 1 ? '' : 's'}</div></button>`;
        }).join('')}
      </div>
      <div class="tiny" style="margin-top:8px">Winning tier: <strong>${TIERS[w.tier.best].label}</strong> — ${esc(t.stays[w.tier.best])}.</div>
    </div>

    <div class="card">
      <div class="section-title" style="margin:0 0 6px"><h2>Who is in</h2><span class="tiny">${confirmed} confirmed · ${joined} joined</span></div>
      ${g.members.map((m, i) => `<div class="wa">
        <span class="avatar ${i % 3 === 1 ? 'teal' : i % 3 === 2 ? 'coral' : ''}">${esc(m.name[0])}</span>
        <span style="flex:1"><strong>${esc(m.name)}</strong>${i === 0 ? ' <span class="tag">host</span>' : ''}
          <div class="tiny">${m.joined ? (m.confirmed ? 'Confirmed · voted' : 'Joined, not confirmed') : 'Invite sent, not opened'}</div></span>
        ${m.joined && !m.confirmed ? `<button class="chip small" data-act="nudge" data-v="${i}">Nudge</button>` : ''}
      </div>`).join('')}
      <button class="btn ghost" style="margin-top:10px" data-act="shareSheet">Invite more people</button>
    </div>

    <div class="sticky-footer">
      <button class="icbtn" data-act="go" data-v="trip">${icon('arrowLeft', 20)}</button>
      <div class="book"><button class="btn cta" data-act="groupCheckout">Book for the group<span>Split pay · ${money(p.perPerson)} each</span></button></div>
    </div>
    ${footNote()}
  </div>`;
}

/* ============================ checkout ============================ */
function viewCheckout() {
  const t = tpl(S.tplId);
  const g = S.group;
  const groupMode = S.checkout.group && g;
  const people = groupMode ? g.members.filter(m => m.joined) : [{ name: 'You', paid: false }];
  const w = groupMode ? groupWinner(g, t) : null;
  const p = priceFor(t, groupMode ? w.tier.best : S.tier, groupMode ? w.win.best : S.windowId, S.addOns, S.fetchSeq, groupMode ? people.length : S.travellers);
  const total = p.perPerson * (groupMode ? people.length : S.travellers);
  const paidCount = groupMode ? people.filter(m => m.paid).length : 0;

  return `<div class="screen">
    <a class="backlink" data-act="go" data-v="${groupMode ? 'group' : 'trip'}">${icon('arrowLeft', 16)} Back</a>
    <h1>Checkout</h1>
    <p class="sub">Mock checkout. No real payment is taken.</p>

    <div class="card">
      <div style="display:flex;gap:10px">
        <div style="flex:0 0 76px" class="art small">${artFor(t, t.id + 'c')}</div>
        <div style="flex:1">
          <strong>${esc(t.destination)}</strong>
          <div class="tiny">${t.days + p.extraDays} days · ${esc(p.tierLabel)} · ${esc(p.windowLabel)}</div>
          <div class="tiny">${trustBadge(t)}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="kv"><span class="k">Per person</span><span class="v">${money(p.perPerson)}</span></div>
      <div class="kv"><span class="k">Travellers</span><span class="v">${groupMode ? people.length : S.travellers}</span></div>
      ${S.addOns.length ? `<div class="kv"><span class="k">Add-on days</span><span class="v">${S.addOns.length} selected</span></div>` : ''}
      <div class="kv"><span class="k">Total</span><span class="v">${money(total)}</span></div>
      <div class="tiny">Price locked at ${esc(S.priceTs || nowStr())} for 15 minutes.</div>
    </div>

    ${groupMode ? `
    <div class="card">
      <div class="section-title" style="margin:0 0 6px"><h2>Split payment</h2><span class="tiny">${paidCount} of ${people.length} paid</span></div>
      <p class="sub">Everyone pays their own share by UPI. No one fronts the whole amount.</p>
      ${people.map((m, i) => `<div class="wa">
        <span class="avatar ${i % 3 === 1 ? 'teal' : i % 3 === 2 ? 'coral' : ''}">${esc(m.name[0])}</span>
        <span style="flex:1"><strong>${esc(m.name)}</strong><div class="tiny">${money(p.perPerson)} share</div></span>
        ${m.paid ? '<span class="badge verified">Paid</span>' : `<button class="chip small on" data-act="payShare" data-v="${i}">${m.name === 'You' ? 'Pay by UPI' : 'Mark paid'}</button>`}
      </div>`).join('')}
      <div class="bar" style="margin-top:10px"><i style="width:${Math.round(paidCount / people.length * 100)}%"></i></div>
      <div class="tiny" style="margin-top:6px">Booking confirms when every share is in. Shares are refunded if the group drops out before confirmation.</div>
      <button class="btn cta" style="margin-top:10px" data-act="confirmBooking" ${paidCount < people.length ? 'disabled' : ''}>
        ${paidCount < people.length ? 'Waiting for ' + (people.length - paidCount) + ' more' : 'Confirm group booking'}</button>
    </div>` : `
    <div class="card">
      <h2>Payment</h2>
      <div class="row"><div><strong>UPI</strong><div class="tiny">you@okbank · mock</div></div><span class="badge verified">Selected</span></div>
      <div class="row"><div><strong>Bring your group onto this booking</strong><div class="tiny">Everyone votes, then pays their own share by UPI</div></div>
        <button class="chip small on" data-act="switchToGroup">Switch</button></div>
      <button class="btn cta" style="margin-top:12px" data-act="confirmBooking">Pay ${money(total)}</button>
    </div>`}
    ${footNote()}
  </div>`;
}

function viewConfirm() {
  const b = S.confirmation;
  const t = tpl(b.tplId);
  return `<div class="screen">
    <div class="card" style="text-align:center">
      <div class="avatar" style="margin:0 auto 10px;width:52px;height:52px;flex:0 0 52px">${icon('check', 26)}</div>
      <h1>Booking confirmed</h1>
      <p class="sub">Reference ${esc(b.ref)} · mock booking</p>
      <div class="divider"></div>
      <div class="kv"><span class="k">Trip</span><span class="v">${esc(t.destination)}</span></div>
      <div class="kv"><span class="k">Dates</span><span class="v">${esc(b.window)}</span></div>
      <div class="kv"><span class="k">Tier</span><span class="v">${esc(b.tier)}</span></div>
      <div class="kv"><span class="k">Travellers</span><span class="v">${b.people}</span></div>
      <div class="kv"><span class="k">Total paid</span><span class="v">${money(b.total)}</span></div>
      ${t.source === 'circle' ? `<div class="notice ok" style="margin-top:10px">${esc(cr(t.creator).handle)} earns a payout on this booking as an MMT Creator Circle partner.</div>`
        : `<div class="notice" style="margin-top:10px">Itinerary curated by MMT from a public reel by ${esc(cr(t.creator).handle)}. No creator payout applies.</div>`}
    </div>
    <div class="card">
      <h2>Your day plan is saved</h2>
      <p class="sub">The same reviewed plan you booked, now in your trips.</p>
      <button class="btn ghost" data-act="openTrip" data-v="${t.id}">View itinerary</button>
      <div style="height:8px"></div>
      <button class="btn" data-act="go" data-v="home">Back to home</button>
    </div>
    ${footNote()}
  </div>`;
}

/* ============================ creator studio (circle only) ============================ */
const ME = 'riya'; /* logged-in creator for the demo */

function viewCreator() {
  const me = cr(ME);
  const mine = TEMPLATES.filter(t => t.creator === ME);
  const tabs = [['studio', 'Studio'], ['drafts', 'My drafts'], ['dash', 'Dashboard']];
  return `<div class="screen">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
      <span class="avatar teal">R</span>
      <div style="flex:1"><strong>${esc(me.handle)}</strong><div class="tiny">${esc(me.platform)} · ${esc(me.followers)} followers</div></div>
      <span class="badge verified">Creator Circle</span>
    </div>
    <div class="tabbar">${tabs.map(([k, l]) => `<button class="${S.creatorTab === k ? 'on' : ''}" data-act="cTab" data-v="${k}">${l}</button>`).join('')}</div>
    ${S.creatorTab === 'studio' ? creatorStudio(mine) : S.creatorTab === 'drafts' ? creatorDrafts() : creatorDash(mine)}
    ${footNote()}
  </div>`;
}

function creatorStudio(mine) {
  const f = S.draftForm || { destination: '', days: 5, notes: '', reel: '' };
  return `
  <div class="card">
    <h2>Send a draft reel</h2>
    <p class="sub">Send it 1 to 2 hours before you post. We draft the itinerary with AI help, an MMT expert checks it, and you approve before it goes live.</p>
    <div class="field"><label>Destination</label><span class="inputwrap">${icon('mapPin', 18)}<input class="input" placeholder="e.g. Ladakh" value="${esc(f.destination)}" data-act="dfField" data-k="destination"></span></div>
    <div class="field"><label>Trip length — <strong>${f.days} days</strong></label><input class="input" type="range" min="2" max="12" value="${f.days}" data-act="dfField" data-k="days" style="border:0;padding:6px 0"></div>
    <div class="field"><label>Reel link or working title</label><span class="inputwrap">${icon('link', 18)}<input class="input" placeholder="instagram.com/reel/…" value="${esc(f.reel)}" data-act="dfField" data-k="reel"></span></div>
    <div class="field"><label>Notes for the MMT desk</label><input class="input" placeholder="Stays, permits, anything the plan must include" value="${esc(f.notes)}" data-act="dfField" data-k="notes"></div>
    <button class="btn" data-act="submitDraft">Submit draft</button>
    <div class="tiny" style="margin-top:8px">AI drafting is mocked here. In production the draft is built from your reel, then reviewed by a person before any viewer sees it.</div>
  </div>

  <div class="section-title"><h2>Your live templates</h2></div>
  ${mine.map(t => `<div class="card">
    <div style="display:flex;justify-content:space-between;gap:8px">
      <div><strong>${esc(t.destination)}</strong><div class="tiny">${t.days} days · ${esc(t.reelLink)}</div></div>
      <span class="badge verified">Live</span>
    </div>
    <div class="divider"></div>
    <div class="kv"><span class="k">Caption link</span><span class="v">mmt.app/drop/${esc((t.token || '').toLowerCase())}</span></div>
    <div class="kv"><span class="k">Reviewed by</span><span class="v">${esc(t.reviewedBy)}</span></div>
    <div class="btnrow" style="margin-top:8px">
      <button class="btn sm ghost" data-act="copyLink" data-v="${t.id}">Copy link</button>
      <button class="btn sm ghost" data-act="openTrip" data-v="${t.id}">Preview card</button>
      <button class="btn sm ghost" data-act="editTpl" data-v="${t.id}">Edit plan</button>
    </div>
  </div>`).join('')}`;
}

const DRAFT_STAGES = ['submitted', 'in_review', 'ready', 'live'];
const STAGE_LABEL = { submitted: 'Submitted', in_review: 'In review', ready: 'Ready for you', live: 'Live' };

function creatorDrafts() {
  const mine = S.drafts.filter(d => d.creator === ME);
  if (!mine.length) return `<div class="card"><p class="sub">No drafts yet. Send one from the Studio tab.</p></div>`;
  return mine.map(d => {
    const idx = DRAFT_STAGES.indexOf(d.status);
    return `<div class="card">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <div><strong>${esc(d.title)}</strong><div class="tiny">Sent ${esc(d.submittedAt)} · posts in ${esc(d.postsIn)}</div></div>
        <span class="badge ${d.status === 'live' ? 'verified' : d.status === 'ready' ? 'live' : 'prep'}">${STAGE_LABEL[d.status]}</span>
      </div>
      <div class="steps">
        ${DRAFT_STAGES.map((s, i) => `<div class="s ${i < idx ? 'done' : i === idx ? 'now' : ''}">
          <div class="c">${i < idx ? icon('check', 13) : i + 1}</div><div class="l">${STAGE_LABEL[s]}</div></div>`).join('')}
      </div>
      ${d.status === 'ready' ? `<button class="btn" data-act="approveDraft" data-v="${d.id}">Review and approve</button>`
        : d.status === 'live' ? `<div class="notice ok">Live. Put <strong>mmt.app/drop/${esc(d.id)}</strong> in your caption.</div>`
        : `<div class="notice">Waiting on the MMT desk. Switch to the Ops role to move it along in the demo.</div>`}
    </div>`;
  }).join('');
}

function creatorDash(mine) {
  const tot = mine.reduce((a, t) => ({ views: a.views + t.stats.views, clicks: a.clicks + t.stats.clicks, bookings: a.bookings + t.stats.bookings }), { views: 0, clicks: 0, bookings: 0 });
  const mineBookings = S.bookings.filter(b => mine.some(t => t.id === b.tplId));
  const earnings = mine.reduce((a, t) => a + t.stats.bookings * 1250, 0) + mineBookings.length * 1250;
  return `
  <div class="grid2">
    <div class="stat"><div class="n">${tot.views.toLocaleString('en-IN')}</div><div class="l">Reel views</div></div>
    <div class="stat"><div class="n">${tot.clicks.toLocaleString('en-IN')}</div><div class="l">Link taps</div></div>
    <div class="stat"><div class="n">${(tot.bookings + mineBookings.length).toLocaleString('en-IN')}</div><div class="l">Bookings</div></div>
    <div class="stat"><div class="n">${money(earnings)}</div><div class="l">Earnings</div></div>
  </div>
  <div class="card" style="margin-top:12px">
    <h2>Per template</h2>
    ${mine.map(t => {
      const ctr = (t.stats.clicks / t.stats.views * 100).toFixed(1);
      const conv = (t.stats.bookings / t.stats.clicks * 100).toFixed(1);
      return `<div style="padding:10px 0;border-bottom:1px solid var(--color-divider)">
        <div style="display:flex;justify-content:space-between"><strong>${esc(t.destination)}</strong><span class="tiny">${money(t.stats.bookings * 1250)}</span></div>
        <div class="bar" style="margin:6px 0"><i style="width:${Math.min(100, ctr * 6)}%"></i></div>
        <div class="tiny">${t.stats.views.toLocaleString('en-IN')} views → ${t.stats.clicks.toLocaleString('en-IN')} taps (${ctr}%) → ${t.stats.bookings} bookings (${conv}% of taps)</div>
      </div>`;
    }).join('')}
    <div class="tiny" style="margin-top:10px">Payout model in this demo: a flat ₹1,250 per confirmed booking, plus optional view and engagement bonuses. Illustrative only.</div>
  </div>`;
}

/* ============================ ops ============================ */
function viewOps() {
  const tabs = [['queue', 'Review queue'], ['watch', 'Watchlist'], ['funnel', 'Funnel']];
  return `<div class="screen">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
      <span class="avatar">OP</span>
      <div style="flex:1"><strong>MMT content ops</strong><div class="tiny">Template review and watchlist monitoring</div></div>
    </div>
    <div class="tabbar">${tabs.map(([k, l]) => `<button class="${S.opsTab === k ? 'on' : ''}" data-act="oTab" data-v="${k}">${l}</button>`).join('')}</div>
    ${S.opsTab === 'queue' ? opsQueue() : S.opsTab === 'watch' ? opsWatch() : opsFunnel()}
    ${footNote()}
  </div>`;
}

function opsQueue() {
  const prep = TEMPLATES.filter(t => t.status === 'preparing');
  return `
  <div class="section-title"><h2>Circle drafts</h2><span class="tiny">creator sent, pre-post</span></div>
  ${S.drafts.map(d => {
    const c = cr(d.creator);
    return `<div class="card">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <div><strong>${esc(d.title)}</strong><div class="tiny">${esc(c.handle)} · sent ${esc(d.submittedAt)}</div></div>
        <span class="badge ${d.status === 'live' ? 'verified' : 'prep'}">${STAGE_LABEL[d.status]}</span>
      </div>
      <div class="notice warn" style="margin-top:8px">Reel posts in ${esc(d.postsIn)}. The template should be live before that.</div>
      <div class="btnrow" style="margin-top:10px">
        ${d.status === 'submitted' ? `<button class="btn sm" data-act="opsAdvance" data-v="${d.id}">Start review</button>` : ''}
        ${d.status === 'in_review' ? `<button class="btn sm" data-act="opsAdvance" data-v="${d.id}">Approve and send to creator</button>` : ''}
        ${d.status === 'ready' ? `<button class="btn sm ghost" data-act="opsAdvance" data-v="${d.id}">Mark live</button>` : ''}
        ${d.status === 'live' ? `<span class="badge verified">Published</span>` : ''}
      </div>
    </div>`;
  }).join('')}

  <div class="section-title"><h2>Watchlist detections</h2><span class="tiny">from the scan job</span></div>
  ${prep.length ? prep.map(t => {
    const c = cr(t.creator);
    return `<div class="card">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <div><strong>${esc(t.destination)}</strong><div class="tiny">${esc(c.handle)} · detected ${esc(t.detectedAt)}</div></div>
        <span class="badge prep">Needs review</span>
      </div>
      <div class="tiny" style="margin-top:6px">${esc(t.reelLink)}</div>
      <div class="btnrow" style="margin-top:10px">
        <button class="btn sm" data-act="opsPublish" data-v="${t.id}">Approve and publish</button>
        <button class="btn sm ghost" data-act="opsInvite" data-v="${t.creator}">Invite to Circle</button>
      </div>
      <div class="tiny" style="margin-top:8px">${S.notifyList.includes(t.id) ? '1 viewer is waiting on a notification for this template.' : 'No one waiting yet.'}</div>
    </div>`;
  }).join('') : '<div class="card"><p class="sub">Queue is clear.</p></div>'}

  <div class="section-title"><h2>Viewer requests</h2><span class="tiny">unrecognized reels</span></div>
  ${S.requests.map(r => `<div class="card">
    <div style="display:flex;justify-content:space-between;gap:8px">
      <div><strong style="font-size:13.5px;word-break:break-all">${esc(r.link)}</strong><div class="tiny">${esc(r.raisedBy)} · ${esc(r.at)}</div></div>
      <span class="badge ${r.status === 'New' ? 'live' : 'curated'}">${esc(r.status)}</span>
    </div>
    <div class="btnrow" style="margin-top:10px">
      <button class="btn sm ghost" data-act="opsAssign" data-v="${r.id}">${r.status === 'New' ? 'Assign to a writer' : 'Assigned'}</button>
    </div>
  </div>`).join('')}`;
}

function opsWatch() {
  return `
  <div class="card">
    <h2>Watchlist monitor</h2>
    <p class="sub">180 creators tracked. The job checks each account every 2 to 3 hours. Scanning in production must go through official platform APIs and stay within platform terms.</p>
    <div class="grid2" style="margin-top:10px">
      <div class="stat"><div class="n">180</div><div class="l">Creators tracked</div></div>
      <div class="stat"><div class="n">2–3 h</div><div class="l">Scan interval</div></div>
      <div class="stat"><div class="n">4</div><div class="l">New reels today</div></div>
      <div class="stat"><div class="n">1</div><div class="l">Awaiting review</div></div>
    </div>
  </div>
  ${WATCHLIST_SCANS.map(s => {
    const c = cr(s.creator);
    return `<div class="card">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <div><strong>${esc(c.handle)}</strong><div class="tiny">${esc(c.platform)} · ${esc(c.followers)} followers</div></div>
        <span class="badge ${s.templateStatus === 'live' ? 'verified' : 'prep'}">${s.templateStatus === 'live' ? 'Mapped' : 'Preparing'}</span>
      </div>
      <div class="kv"><span class="k">Last scan</span><span class="v">${esc(s.lastScanTime)}</span></div>
      <div class="kv"><span class="k">New reels found</span><span class="v">${s.newReelsFound}</span></div>
      <div class="tiny">${esc(s.note)}</div>
      ${!c.isCircleMember ? `<button class="btn sm ghost" style="margin-top:8px" data-act="opsInvite" data-v="${s.creator}">Invite to Creator Circle</button>` : ''}
    </div>`;
  }).join('')}`;
}

function opsFunnel() {
  const live = TEMPLATES.filter(t => t.status === 'live');
  const tot = live.reduce((a, t) => ({ v: a.v + t.stats.views, c: a.c + t.stats.clicks, b: a.b + t.stats.bookings }), { v: 0, c: 0, b: 0 });
  return `
  <div class="card">
    <h2>All templates</h2>
    <div class="grid2">
      <div class="stat"><div class="n">${tot.v.toLocaleString('en-IN')}</div><div class="l">Views</div></div>
      <div class="stat"><div class="n">${tot.c.toLocaleString('en-IN')}</div><div class="l">Link taps</div></div>
      <div class="stat"><div class="n">${(tot.b + S.bookings.length).toLocaleString('en-IN')}</div><div class="l">Bookings</div></div>
      <div class="stat"><div class="n">${(tot.b / tot.c * 100).toFixed(1)}%</div><div class="l">Tap to booking</div></div>
    </div>
  </div>
  ${live.map(t => {
    const ctr = t.stats.clicks / t.stats.views * 100;
    const conv = t.stats.bookings / t.stats.clicks * 100;
    return `<div class="card">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <div><strong>${esc(t.destination)}</strong><div class="tiny">${esc(cr(t.creator).handle)}</div></div>
        ${t.source === 'circle' ? '<span class="badge verified">Circle</span>' : '<span class="badge curated">Watchlist</span>'}
      </div>
      <div class="bar" style="margin:8px 0 4px"><i style="width:100%"></i></div>
      <div class="tiny">${t.stats.views.toLocaleString('en-IN')} views</div>
      <div class="bar" style="margin:8px 0 4px"><i style="width:${Math.min(100, ctr * 8)}%;background:var(--color-primary-strong)"></i></div>
      <div class="tiny">${t.stats.clicks.toLocaleString('en-IN')} taps · ${ctr.toFixed(1)}%</div>
      <div class="bar" style="margin:8px 0 4px"><i style="width:${Math.min(100, conv * 25)}%;background:var(--color-primary-soft)"></i></div>
      <div class="tiny">${t.stats.bookings} bookings · ${conv.toFixed(1)}% of taps</div>
    </div>`;
  }).join('')}
  <div class="notice">All counts are illustrative mock data for the prototype.</div>`;
}

/* ============================ edit sheet ============================ */
function editSheet() {
  const t = tpl(S.sheet.tplId);
  return sheetWrap(`
    <h2>Edit the plan — ${esc(t.destination)}</h2>
    <p class="sub">Changes go back to the MMT desk for a quick recheck before they are live.</p>
    ${t.dayPlan.map(d => `<div class="field">
      <label>Day ${d.d} — ${esc(d.title)}</label>
      <input class="input" value="${esc(d.text)}" data-act="editDay" data-d="${d.d}">
    </div>`).join('')}
    <button class="btn" data-act="saveEdit">Send changes for recheck</button>
  `);
}

/* ============================ shell + render ============================ */
function shell(inner) {
  const roles = [['viewer', 'Viewer'], ['creator', 'Creator'], ['ops', 'Ops']];
  return `
  <div class="topbar">
    <span class="logo"><span class="dot"></span>MMT Drop</span>
    <span class="spacer"></span>
    <div class="roleswitch">${roles.map(([k, l]) => `<button class="${S.role === k ? 'on' : ''}" data-act="role" data-v="${k}">${l}</button>`).join('')}</div>
  </div>
  ${inner}
  ${S.sheet ? (S.sheet.kind === 'share' ? shareSheet() : editSheet()) : ''}
  ${S.toast ? `<div class="toast">${esc(S.toast)}</div>` : ''}`;
}

function currentScreen() {
  if (S.role === 'creator') return viewCreator();
  if (S.role === 'ops') return viewOps();
  switch (S.screen) {
    case 'loading': return viewLoading();
    case 'trip': return viewTrip();
    case 'preparing': return viewPreparing();
    case 'unknown': return viewUnknown();
    case 'finder': return viewFinder();
    case 'saved': return viewSaved();
    case 'group': return viewGroup();
    case 'checkout': return viewCheckout();
    case 'confirm': return viewConfirm();
    default: return viewHome();
  }
}

function render() {
  const focusAct = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.act : null;
  const focusK = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.k : null;
  const selStart = document.activeElement && document.activeElement.selectionStart;
  $('#phone').innerHTML = shell(currentScreen());
  if (focusAct) {
    const el = document.querySelector(`[data-act="${focusAct}"]${focusK ? `[data-k="${focusK}"]` : ''}`);
    if (el && el.tagName === 'INPUT' && el.type !== 'range') {
      el.focus();
      try { el.setSelectionRange(selStart, selStart); } catch (e) {}
    }
  }
}

/* ============================ events ============================ */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const a = el.dataset.act, v = el.dataset.v;
  if (el.tagName === 'INPUT' || el.tagName === 'SELECT') return;

  switch (a) {
    case 'role':
      S.role = v; S.screen = 'home'; window.scrollTo(0, 0); render(); break;
    case 'go': go(v); break;
    case 'sample': S.resolver.input = v; S.resolver.forced = 'auto'; S.resolver.result = null; S.resolver.stepIdx = -1; render(); break;
    case 'force': S.resolver.forced = v; S.resolver.result = null; S.resolver.stepIdx = -1; render(); break;
    case 'resolve': runResolver(); break;
    case 'openResolved': openResolvedTrip(); break;
    case 'openTrip': openTrip(v); break;
    case 'openTierTrip': openTrip(v); S.tier = el.dataset.t; break;
    case 'setWindow': S.windowId = v; S.customDates = ''; refetchPrice(); break;
    case 'setTier': S.tier = v; refetchPrice(); break;
    case 'toggleAddOn':
      S.addOns = S.addOns.includes(v) ? S.addOns.filter(x => x !== v) : S.addOns.concat(v);
      refetchPrice(); break;
    case 'pax': {
      const next = Math.max(1, Math.min(9, S.travellers + (v === '+' ? 1 : -1)));
      if (next === S.travellers) break;
      S.travellers = next;
      refetchPrice(); break;
    }
    case 'save':
      S.saved = S.saved.includes(v) ? S.saved.filter(x => x !== v) : S.saved.concat(v);
      toast(S.saved.includes(v) ? 'Saved to your trips' : 'Removed from saved'); break;
    case 'shareSheet': S.sheet = { kind: 'share' }; render(); break;
    case 'startGroup':
      if (!S.group || S.group.tplId !== S.tplId) S.group = newGroup(tpl(S.tplId));
      S.sheet = { kind: 'share' };
      render(); break;
    case 'openGroupPage':
      if (!S.group || S.group.tplId !== S.tplId) S.group = newGroup(tpl(S.tplId));
      go('group'); break;
    case 'switchToGroup':
      if (!S.group || S.group.tplId !== S.tplId) S.group = newGroup(tpl(S.tplId));
      S.checkout = { group: true };
      toast('Group booking started');
      go('group'); break;
    case 'closeSheet': if (!e.target.closest('[data-stop]')) { S.sheet = null; render(); } break;
    case 'sendInvite': toast('Invite sent (mock)'); break;
    case 'openGroup':
      S.sheet = null;
      if (!S.group || S.group.tplId !== S.tplId) S.group = newGroup(tpl(S.tplId));
      go('group'); break;
    case 'voteWindow': S.group.members[0].voteWindow = v; refetchPrice(); break;
    case 'voteTier': S.group.members[0].voteTier = v; refetchPrice(); break;
    case 'nudge': toast('Nudge sent (mock)'); break;
    case 'book': S.checkout = { group: false }; go('checkout'); break;
    case 'groupCheckout': S.checkout = { group: true }; go('checkout'); break;
    case 'payShare': {
      const people = S.group.members.filter(m => m.joined);
      people[+v].paid = true; toast('Share paid by UPI (mock)'); render(); break;
    }
    case 'confirmBooking': {
      const t = tpl(S.tplId);
      const groupMode = S.checkout.group && S.group;
      const w = groupMode ? groupWinner(S.group, t) : null;
      const people0 = groupMode ? S.group.members.filter(m => m.joined).length : S.travellers;
      const p = priceFor(t, groupMode ? w.tier.best : S.tier, groupMode ? w.win.best : S.windowId, S.addOns, S.fetchSeq, people0);
      const people = groupMode ? S.group.members.filter(m => m.joined).length : S.travellers;
      S.confirmation = { tplId: t.id, ref: 'MMT' + Math.floor(100000 + Math.random() * 899999), window: p.windowLabel, tier: p.tierLabel, people, total: p.perPerson * people };
      S.bookings.push({ tplId: t.id, at: nowStr(), total: S.confirmation.total });
      go('confirm'); break;
    }
    case 'notify':
      if (!S.notifyList.includes(v)) S.notifyList.push(v);
      toast('We will message you when it is ready'); break;
    case 'notifyLink': {
      const k = 'link:' + S.resolver.input;
      if (!S.notifyList.includes(k)) S.notifyList.push(k);
      toast('We will tell you if an itinerary appears'); break;
    }
    case 'requestItin':
      if (!S.requests.some(r => r.link === S.resolver.input)) {
        S.requests.unshift({ id: 'rq_' + Date.now(), link: S.resolver.input || 'unknown reel', raisedBy: 'Viewer', at: 'just now', status: 'New' });
      }
      toast('Sent to the MMT team'); break;
    case 'goFinder': S.finder.fromTpl = null; S.finder.ran = false; go('finder'); break;
    case 'goFinderFrom': S.finder.fromTpl = v; S.finder.ran = true; S.finder.days = tpl(v).days; go('finder'); break;
    case 'runFinder': S.finder.ran = true; render(); break;
    case 'cTab': S.creatorTab = v; render(); break;
    case 'oTab': S.opsTab = v; render(); break;
    case 'submitDraft': {
      const f = S.draftForm || {};
      if (!f.destination) { toast('Add a destination first'); break; }
      S.drafts.unshift({ id: 'dr_' + Date.now(), creator: ME, title: f.destination + ' ' + (f.days || 5) + ' day trip', submittedAt: 'just now', postsIn: '1 h 30 m', status: 'submitted' });
      S.draftForm = null; S.creatorTab = 'drafts';
      toast('Draft sent to the MMT desk'); break;
    }
    case 'approveDraft': {
      const d = S.drafts.find(x => x.id === v);
      d.status = 'live'; toast('Approved. Template is live.'); render(); break;
    }
    case 'opsAdvance': {
      const d = S.drafts.find(x => x.id === v);
      d.status = DRAFT_STAGES[Math.min(3, DRAFT_STAGES.indexOf(d.status) + 1)];
      toast('Moved to ' + STAGE_LABEL[d.status]); render(); break;
    }
    case 'opsPublish': {
      const t = tpl(v);
      t.status = 'live'; t.token = 'MMT-' + t.destination.slice(0, 4).toUpperCase() + '-' + t.days + 'D';
      t.reviewedBy = 'MMT South desk'; t.reviewedOn = '19 Sep 2026';
      toast(S.notifyList.includes(v) ? 'Published. Waiting viewers notified.' : 'Published.');
      render(); break;
    }
    case 'opsInvite': toast('Invite sent to ' + cr(v).handle + ' (mock)'); break;
    case 'opsAssign': {
      const r = S.requests.find(x => x.id === v);
      r.status = 'Assigned'; toast('Assigned to a writer'); render(); break;
    }
    case 'copyLink': toast('Link copied (mock)'); break;
    case 'editTpl': S.sheet = { kind: 'edit', tplId: v }; render(); break;
    case 'saveEdit': S.sheet = null; toast('Sent for recheck'); render(); break;
  }
});

document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const a = el.dataset.act;
  if (a === 'reelType') { S.resolver.input = el.value; S.resolver.result = null; S.resolver.stepIdx = -1; }
  else if (a === 'customDate') { S.customDates = el.value; S.windowId = null; refetchPrice(); }
  else if (a === 'fMonth') { S.finder.month = +el.value; render(); }
  else if (a === 'fDays') { S.finder.days = +el.value; render(); }
  else if (a === 'fBudget') { S.finder.budget = +el.value; render(); }
  else if (a === 'dfField') {
    S.draftForm = S.draftForm || { destination: '', days: 5, notes: '', reel: '' };
    S.draftForm[el.dataset.k] = el.dataset.k === 'days' ? +el.value : el.value;
    if (el.dataset.k === 'days') render();
  } else if (a === 'editDay') {
    const t = tpl(S.sheet.tplId);
    const d = t.dayPlan.find(x => x.d === +el.dataset.d);
    if (d) d.text = el.value;
  }
});

bootFromShare();
render();
