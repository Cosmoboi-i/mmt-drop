/* MMT Drop — seed data. All figures are illustrative mock data for a prototype. */

const CREATORS = {
  riya:   { id: 'cr_01', handle: '@rideswithriya',  name: 'Riya Malhotra', platform: 'Instagram', isCircleMember: true,  followers: '412K', tier: 'Circle' },
  arjun:  { id: 'cr_02', handle: '@slowcoastarjun', name: 'Arjun Nair',    platform: 'YouTube',   isCircleMember: true,  followers: '228K', tier: 'Circle' },
  kabir:  { id: 'cr_03', handle: '@wanderwithkabir',name: 'Kabir Sen',     platform: 'Instagram', isCircleMember: false, followers: '1.1M', tier: 'Watchlist' },
  naina:  { id: 'cr_04', handle: '@nainaonroute',   name: 'Naina Rao',     platform: 'YouTube',   isCircleMember: false, followers: '760K', tier: 'Watchlist' },
  dev:    { id: 'cr_05', handle: '@devdoestrails',  name: 'Dev Bhatia',    platform: 'Instagram', isCircleMember: false, followers: '340K', tier: 'Watchlist' },
  meera:  { id: 'cr_06', handle: '@meeraeats',      name: 'Meera Iyer',    platform: 'Instagram', isCircleMember: false, followers: '520K', tier: 'Watchlist' }
};

/* Illustration keys. The actual colours live in theme.css as
   --illus-<key>-1..3 and are referenced by the inline SVG. */
const ART_KEYS = ['spiti','gokarna','meghalaya','jaisalmer','coorg','rishikesh','andaman','kasol'];

/* Budget tier multipliers apply to a per-person-per-day base. Illustrative only. */
const TIERS = {
  value:   { id: 'value',   label: 'Value',   mult: 1.00, blurb: 'Clean stays, shared transport' },
  comfort: { id: 'comfort', label: 'Comfort', mult: 1.55, blurb: '3–4 star stays, private cab' },
  luxury:  { id: 'luxury',  label: 'Luxury',  mult: 2.60, blurb: 'Boutique stays, private SUV' }
};

const TEMPLATES = [
  {
    id: 'tpl_spiti',
    source: 'circle',
    status: 'live',
    creator: 'riya',
    reelLink: 'instagram.com/reel/spiti-loop-7d',
    token: 'MMT-SPITI-7D',
    destination: 'Spiti Valley',
    state: 'Himachal Pradesh',
    art: 'spiti',
    days: 7,
    summary: 'High-altitude desert loop from Manali with monastery stays and cold-desert villages.',
    vibeTags: ['Mountains', 'Road trip', 'Offbeat'],
    activities: ['Road trip', 'Monastery visits', 'Stargazing', 'Light trekking'],
    bestSeason: 'Jun – Sep',
    baseDay: 4200,
    reviewedBy: 'MMT Himalayas desk',
    reviewedOn: '12 Sep 2026',
    stays: { value: 'Homestays + guesthouses', comfort: 'Boutique camps + 3★ hotels', luxury: 'Luxury glamping + heated suites' },
    transport: { value: 'Shared tempo traveller', comfort: 'Private Innova', luxury: 'Private 4x4 + driver' },
    dayPlan: [
      { d: 1, title: 'Manali to Jispa', text: 'Drive over Atal Tunnel, stop at Sissu waterfall, night at Jispa by the Bhaga river.' },
      { d: 2, title: 'Jispa to Kaza', text: 'Kunzum Pass crossing, Chandratal viewpoint stop, reach Kaza by evening.' },
      { d: 3, title: 'Key, Kibber, Chicham', text: 'Key Monastery morning prayers, Chicham bridge, sunset at Kibber.' },
      { d: 4, title: 'Hikkim and Langza', text: 'World\'s highest post office, fossil hunting at Langza, Komic village lunch.' },
      { d: 5, title: 'Dhankar and Pin Valley', text: 'Dhankar lake walk, Pin Valley national park drive, night at Mudh.' },
      { d: 6, title: 'Tabo to Nako', text: 'Tabo monastery caves, apple orchards, Nako lake by evening.' },
      { d: 7, title: 'Nako to Shimla', text: 'Long descent along the Sutlej, drop at Shimla or Chandigarh.' }
    ],
    dateWindows: [
      { id: 'w1', label: 'Late Jun 2026', reason: 'Roads just opened, fewer cars', delta: -8 },
      { id: 'w2', label: 'Mid Aug 2026', reason: 'Clear skies, peak season', delta: 12 },
      { id: 'w3', label: 'Mid Sep 2026', reason: 'Best light, shoulder pricing', delta: -14 }
    ],
    addOns: [
      { id: 'a1', label: 'Chandratal camping night', days: 1, price: 4800 },
      { id: 'a2', label: 'Kalpa and Sangla detour', days: 2, price: 8900 },
      { id: 'a3', label: 'Manali paragliding morning', days: 0, price: 2600 }
    ],
    stats: { views: 184200, clicks: 21400, bookings: 386 }
  },
  {
    id: 'tpl_gokarna',
    source: 'circle',
    status: 'live',
    creator: 'arjun',
    reelLink: 'youtube.com/shorts/gokarna-slow-4d',
    token: 'MMT-GOKARNA-4D',
    destination: 'Gokarna',
    state: 'Karnataka',
    art: 'gokarna',
    days: 4,
    summary: 'Five beaches on foot, cliff cafes and a slow temple-town evening.',
    vibeTags: ['Beaches', 'Cafes', 'Slow travel'],
    activities: ['Beach hopping', 'Cafe hopping', 'Coastal trek', 'Sunset kayaking'],
    bestSeason: 'Nov – Feb',
    baseDay: 3100,
    reviewedBy: 'MMT West Coast desk',
    reviewedOn: '08 Sep 2026',
    stays: { value: 'Beach huts', comfort: 'Sea-view boutique rooms', luxury: 'Cliffside private villas' },
    transport: { value: 'Local buses + scooter', comfort: 'Scooter + airport cab', luxury: 'Private sedan all days' },
    dayPlan: [
      { d: 1, title: 'Arrive and Kudle beach', text: 'Check in near Kudle, sunset walk, first dinner at a cliff cafe.' },
      { d: 2, title: 'Beach trek', text: 'Om to Half Moon to Paradise beach on foot, boat back before dark.' },
      { d: 3, title: 'Town and temple', text: 'Morning at Mahabaleshwar temple, afternoon kayaking, cafe evening.' },
      { d: 4, title: 'Slow exit', text: 'Breakfast at Namaste Cafe, Yana rocks stop if time allows, depart.' }
    ],
    dateWindows: [
      { id: 'w1', label: 'Late Nov 2026', reason: 'Post-monsoon, calm sea', delta: -6 },
      { id: 'w2', label: 'Late Dec 2026', reason: 'Peak holiday week', delta: 22 },
      { id: 'w3', label: 'Early Feb 2027', reason: 'Warm, thin crowds', delta: -11 }
    ],
    addOns: [
      { id: 'a1', label: 'Murudeshwar day trip', days: 1, price: 3200 },
      { id: 'a2', label: 'Honnavar backwater kayak', days: 1, price: 2900 },
      { id: 'a3', label: 'Sunset catamaran', days: 0, price: 1800 }
    ],
    stats: { views: 96400, clicks: 12800, bookings: 241 }
  },
  {
    id: 'tpl_meghalaya',
    source: 'watchlist',
    status: 'live',
    creator: 'kabir',
    reelLink: 'instagram.com/reel/meghalaya-living-roots',
    token: 'MMT-MEGH-6D',
    destination: 'Meghalaya',
    state: 'Shillong to Dawki',
    art: 'meghalaya',
    days: 6,
    summary: 'Living root bridges, the double-decker trek and the clear water at Dawki.',
    vibeTags: ['Waterfalls', 'Trekking', 'Monsoon'],
    activities: ['Trekking', 'Caving', 'Waterfalls', 'River camping'],
    bestSeason: 'Sep – Nov',
    baseDay: 3600,
    reviewedBy: 'MMT North East desk',
    reviewedOn: '14 Sep 2026',
    stays: { value: 'Village homestays', comfort: '3★ Shillong hotel + homestays', luxury: 'Boutique resort + riverside cottage' },
    transport: { value: 'Shared sumo', comfort: 'Private cab', luxury: 'Private SUV + guide' },
    dayPlan: [
      { d: 1, title: 'Guwahati to Shillong', text: 'Umiam lake stop, evening at Police Bazaar.' },
      { d: 2, title: 'Shillong to Cherrapunji', text: 'Mawkdok viewpoint, Nohkalikai falls, Arwah caves.' },
      { d: 3, title: 'Double-decker trek', text: 'Tyrna to Nongriat, 3000 steps down, night in the village.' },
      { d: 4, title: 'Nongriat to Dawki', text: 'Climb out, drive to Dawki, boat on the Umngot river.' },
      { d: 5, title: 'Mawlynnong and Riwai', text: 'Single root bridge, village walk, Bangladesh viewpoint.' },
      { d: 6, title: 'Back to Guwahati', text: 'Elephant falls stop, airport drop.' }
    ],
    dateWindows: [
      { id: 'w1', label: 'Late Sep 2026', reason: 'Full waterfalls, lower rates', delta: -9 },
      { id: 'w2', label: 'Late Oct 2026', reason: 'Clear skies, peak demand', delta: 14 },
      { id: 'w3', label: 'Mid Nov 2026', reason: 'Dry trails, easy trekking', delta: -4 }
    ],
    addOns: [
      { id: 'a1', label: 'Krang Suri falls day', days: 1, price: 3400 },
      { id: 'a2', label: 'Kaziranga safari extension', days: 2, price: 11200 },
      { id: 'a3', label: 'Mawsmai cave guide', days: 0, price: 900 }
    ],
    stats: { views: 210500, clicks: 18600, bookings: 173 }
  },
  {
    id: 'tpl_jaisalmer',
    source: 'watchlist',
    status: 'live',
    creator: 'naina',
    reelLink: 'youtube.com/shorts/jaisalmer-desert-3d',
    token: 'MMT-JSM-3D',
    destination: 'Jaisalmer',
    state: 'Rajasthan',
    art: 'jaisalmer',
    days: 3,
    summary: 'Golden fort mornings, Sam dunes at sunset and one night under the stars.',
    vibeTags: ['Desert', 'Heritage', 'Camps'],
    activities: ['Fort walks', 'Dune camping', 'Camel safari', 'Folk music night'],
    bestSeason: 'Oct – Feb',
    baseDay: 2900,
    reviewedBy: 'MMT Rajasthan desk',
    reviewedOn: '15 Sep 2026',
    stays: { value: 'Haveli guesthouse + swiss tent', comfort: 'Heritage haveli + deluxe camp', luxury: 'Palace hotel + luxury desert camp' },
    transport: { value: 'Shared jeep', comfort: 'Private cab', luxury: 'Private SUV + guide' },
    dayPlan: [
      { d: 1, title: 'Fort and old city', text: 'Golden fort walk, Patwon ki Haveli, rooftop dinner facing the fort.' },
      { d: 2, title: 'Dunes and camp', text: 'Kuldhara ruins, Sam dunes camel ride, folk music and night at camp.' },
      { d: 3, title: 'Gadisar and exit', text: 'Sunrise at Gadisar lake, textile market, evening train or flight.' }
    ],
    dateWindows: [
      { id: 'w1', label: 'Mid Oct 2026', reason: 'Season opens, softer rates', delta: -7 },
      { id: 'w2', label: 'Late Dec 2026', reason: 'Peak week, desert festival buildup', delta: 26 },
      { id: 'w3', label: 'Early Feb 2027', reason: 'Desert festival, warm days', delta: 9 }
    ],
    addOns: [
      { id: 'a1', label: 'Jodhpur stopover', days: 2, price: 7600 },
      { id: 'a2', label: 'Longewala border day', days: 1, price: 2800 },
      { id: 'a3', label: 'Private dune dinner', days: 0, price: 3500 }
    ],
    stats: { views: 132900, clicks: 9700, bookings: 128 }
  },
  {
    id: 'tpl_coorg',
    source: 'watchlist',
    status: 'preparing',
    creator: 'meera',
    reelLink: 'instagram.com/reel/coorg-coffee-weekend',
    token: null,
    destination: 'Coorg',
    state: 'Karnataka',
    art: 'coorg',
    days: 3,
    summary: 'Coffee estate stays, misty morning walks and one waterfall that is worth the mud.',
    vibeTags: ['Forest', 'Coffee', 'Monsoon'],
    activities: ['Estate walks', 'Waterfalls', 'Cafes', 'Short treks'],
    bestSeason: 'Sep – Feb',
    baseDay: 3300,
    reviewedBy: null,
    reviewedOn: null,
    detectedAt: '19 Sep 2026, 09:40',
    stays: { value: 'Estate homestay', comfort: 'Plantation resort', luxury: 'Luxury estate villa' },
    transport: { value: 'Bus + local auto', comfort: 'Private cab', luxury: 'Private SUV' },
    dayPlan: [
      { d: 1, title: 'Madikeri and estate check-in', text: 'Raja\'s Seat sunset, estate walk with the planter.' },
      { d: 2, title: 'Abbey falls and Mandalpatti', text: 'Early falls visit, jeep to Mandalpatti viewpoint, cafe evening.' },
      { d: 3, title: 'Dubare and exit', text: 'Elephant camp morning, coffee shopping, drive back.' }
    ],
    dateWindows: [
      { id: 'w1', label: 'Late Sep 2026', reason: 'Green and quiet', delta: -10 },
      { id: 'w2', label: 'Late Dec 2026', reason: 'Peak holiday demand', delta: 20 },
      { id: 'w3', label: 'Mid Jan 2027', reason: 'Cool mornings, clear roads', delta: -3 }
    ],
    addOns: [
      { id: 'a1', label: 'Nisargadhama and Bylakuppe', days: 1, price: 2400 },
      { id: 'a2', label: 'Wayanad extension', days: 2, price: 8200 },
      { id: 'a3', label: 'Coffee cupping session', days: 0, price: 1200 }
    ],
    stats: { views: 41200, clicks: 0, bookings: 0 }
  },
  {
    id: 'tpl_rishikesh',
    source: 'watchlist',
    status: 'live',
    creator: 'dev',
    reelLink: 'instagram.com/reel/rishikesh-river-4d',
    token: 'MMT-RSH-4D',
    destination: 'Rishikesh',
    state: 'Uttarakhand',
    art: 'rishikesh',
    days: 4,
    summary: 'River rafting, a short Himalayan trek and cafes above the Ganga.',
    vibeTags: ['Adventure', 'River', 'Cafes'],
    activities: ['Rafting', 'Short trek', 'Cafes', 'Bungee'],
    bestSeason: 'Sep – Nov, Feb – Apr',
    baseDay: 2700,
    reviewedBy: 'MMT North desk',
    reviewedOn: '11 Sep 2026',
    stays: { value: 'Riverside hostel', comfort: 'Boutique riverside hotel', luxury: 'Spa retreat' },
    transport: { value: 'Volvo bus + auto', comfort: 'Private cab', luxury: 'Private SUV' },
    dayPlan: [
      { d: 1, title: 'Arrive and Tapovan', text: 'Check in, Laxman Jhula walk, Ganga aarti at Parmarth.' },
      { d: 2, title: 'Rafting day', text: '16 km Shivpuri to Ram Jhula raft, cliff jump, riverside lunch.' },
      { d: 3, title: 'Kunjapuri sunrise trek', text: 'Early trek for the Himalayan line, afternoon cafe crawl.' },
      { d: 4, title: 'Optional bungee and exit', text: 'Jumpin Heights slot, drive to Dehradun airport.' }
    ],
    dateWindows: [
      { id: 'w1', label: 'Late Sep 2026', reason: 'Rafting season opens', delta: -5 },
      { id: 'w2', label: 'Late Oct 2026', reason: 'Clear mountain views', delta: 10 },
      { id: 'w3', label: 'Mid Mar 2027', reason: 'Warm water, thin crowds', delta: -8 }
    ],
    addOns: [
      { id: 'a1', label: 'Chopta and Tungnath trek', days: 2, price: 7400 },
      { id: 'a2', label: 'Haridwar aarti evening', days: 1, price: 1900 },
      { id: 'a3', label: 'Bungee jump slot', days: 0, price: 3700 }
    ],
    stats: { views: 158300, clicks: 14100, bookings: 209 }
  },
  {
    id: 'tpl_andaman',
    source: 'circle',
    status: 'live',
    creator: 'arjun',
    reelLink: 'youtube.com/shorts/andaman-reef-5d',
    token: 'MMT-AND-5D',
    destination: 'Andaman Islands',
    state: 'Havelock and Neil',
    art: 'andaman',
    days: 5,
    summary: 'Reef dives at Havelock, a quiet day on Neil and two sunsets worth the ferry.',
    vibeTags: ['Beaches', 'Islands', 'Diving'],
    activities: ['Scuba diving', 'Snorkelling', 'Beach days', 'Island ferries'],
    bestSeason: 'Nov – Apr',
    baseDay: 5200,
    reviewedBy: 'MMT Islands desk',
    reviewedOn: '10 Sep 2026',
    stays: { value: 'Beach cottages', comfort: 'Resort rooms', luxury: 'Private pool villas' },
    transport: { value: 'Govt ferry + auto', comfort: 'Private ferry + cab', luxury: 'Premium ferry + private car' },
    dayPlan: [
      { d: 1, title: 'Port Blair', text: 'Cellular jail light and sound show, Corbyn\'s Cove evening.' },
      { d: 2, title: 'Ferry to Havelock', text: 'Radhanagar beach sunset, beach dinner.' },
      { d: 3, title: 'Dive day', text: 'Two guided dives at Nemo reef, evening at Kalapathar.' },
      { d: 4, title: 'Neil island', text: 'Bharatpur snorkelling, natural bridge at low tide.' },
      { d: 5, title: 'Return', text: 'Morning ferry to Port Blair, flight out.' }
    ],
    dateWindows: [
      { id: 'w1', label: 'Mid Nov 2026', reason: 'Season opens, calm sea', delta: -6 },
      { id: 'w2', label: 'Late Dec 2026', reason: 'Peak week', delta: 28 },
      { id: 'w3', label: 'Early Mar 2027', reason: 'Best visibility for diving', delta: 4 }
    ],
    addOns: [
      { id: 'a1', label: 'Baratang limestone caves', days: 1, price: 4100 },
      { id: 'a2', label: 'PADI open water start', days: 2, price: 16500 },
      { id: 'a3', label: 'Sunset kayak at Havelock', days: 0, price: 2200 }
    ],
    stats: { views: 121700, clicks: 15900, bookings: 264 }
  },
  {
    id: 'tpl_kasol',
    source: 'watchlist',
    status: 'live',
    creator: 'kabir',
    reelLink: 'instagram.com/reel/kasol-kheerganga-4d',
    token: 'MMT-KSL-4D',
    destination: 'Kasol and Kheerganga',
    state: 'Himachal Pradesh',
    art: 'kasol',
    days: 4,
    summary: 'Parvati valley cafes and one overnight trek to a hot spring at 3000 m.',
    vibeTags: ['Mountains', 'Trekking', 'Cafes'],
    activities: ['Trekking', 'Cafes', 'Hot springs', 'Riverside camping'],
    bestSeason: 'Mar – Jun, Sep – Nov',
    baseDay: 2500,
    reviewedBy: 'MMT Himalayas desk',
    reviewedOn: '13 Sep 2026',
    stays: { value: 'Hostel + trek tent', comfort: 'Riverside cottage + deluxe tent', luxury: 'Boutique villa + premium camp' },
    transport: { value: 'Volvo + shared cab', comfort: 'Private cab', luxury: 'Private SUV' },
    dayPlan: [
      { d: 1, title: 'Arrive Kasol', text: 'Riverside cafe afternoon, Chalal walk at sunset.' },
      { d: 2, title: 'Kheerganga trek', text: 'Barshaini to Kheerganga, hot spring, night in a tent.' },
      { d: 3, title: 'Descend and Tosh', text: 'Trek down, drive to Tosh, slow evening with valley views.' },
      { d: 4, title: 'Manikaran and exit', text: 'Gurudwara hot springs, langar lunch, night bus back.' }
    ],
    dateWindows: [
      { id: 'w1', label: 'Late Mar 2027', reason: 'Snow line still visible', delta: -7 },
      { id: 'w2', label: 'Mid May 2027', reason: 'Peak summer demand', delta: 15 },
      { id: 'w3', label: 'Late Sep 2026', reason: 'Clear post-monsoon trails', delta: -12 }
    ],
    addOns: [
      { id: 'a1', label: 'Malana village day', days: 1, price: 2100 },
      { id: 'a2', label: 'Jibhi and Tirthan extension', days: 2, price: 6900 },
      { id: 'a3', label: 'Riverside bonfire night', days: 0, price: 1100 }
    ],
    stats: { views: 174600, clicks: 16200, bookings: 198 }
  }
];

/* Watchlist scan log — mock output of the scheduled job. */
const WATCHLIST_SCANS = [
  { creator: 'kabir', lastScanTime: '19 Sep 2026, 11:10', newReelsFound: 2, templateStatus: 'live', note: '1 mapped, 1 not travel' },
  { creator: 'naina', lastScanTime: '19 Sep 2026, 11:10', newReelsFound: 0, templateStatus: 'live', note: 'No new uploads' },
  { creator: 'meera', lastScanTime: '19 Sep 2026, 09:40', newReelsFound: 1, templateStatus: 'preparing', note: 'Coorg reel in drafting' },
  { creator: 'dev',   lastScanTime: '19 Sep 2026, 08:15', newReelsFound: 1, templateStatus: 'live', note: 'Rishikesh reel mapped' }
];

/* Requests raised by viewers from the Scenario 3 screen. */
const SEED_REQUESTS = [
  { id: 'rq_01', link: 'instagram.com/reel/ziro-valley-music', raisedBy: 'Viewer', at: '19 Sep 2026, 10:02', status: 'New' },
  { id: 'rq_02', link: 'youtube.com/shorts/gurez-valley-drive', raisedBy: 'Viewer', at: '19 Sep 2026, 08:44', status: 'Assigned' }
];

/* Circle drafts waiting on the expert review step. */
const SEED_DRAFTS = [
  { id: 'dr_01', creator: 'riya',  title: 'Ladakh 8 day loop', submittedAt: '19 Sep 2026, 10:30', postsIn: '1 h 20 m', status: 'in_review' },
  { id: 'dr_02', creator: 'arjun', title: 'Pondicherry 3 day slow', submittedAt: '19 Sep 2026, 09:05', postsIn: '3 h 00 m', status: 'submitted' }
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* Which months each destination actually suits. Used by the alternate finder. */
const SEASON_FIT = {
  tpl_spiti:     [5,6,7,8],
  tpl_gokarna:   [0,1,10,11],
  tpl_meghalaya: [8,9,10],
  tpl_jaisalmer: [0,1,9,10,11],
  tpl_coorg:     [8,9,10,11,0,1],
  tpl_rishikesh: [1,2,3,8,9,10],
  tpl_andaman:   [0,1,2,3,10,11],
  tpl_kasol:     [2,3,4,5,8,9,10]
};
