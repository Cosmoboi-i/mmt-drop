# MMT Drop — prototype

A clickable, mobile-first prototype that turns a travel reel into a bookable MMT itinerary.
Everything here is mock data. No live APIs, no real auth, no real payments.

Run it: open `index.html` in a browser, or serve the folder (`python3 -m http.server 4173`).

## Core principle in the build

The plan is made once per reel, before any viewer arrives — drafted with AI help, then checked by an
MMT travel expert, then stored as a Trip Template. Only the price is fetched at view and booking time.
Every price in the UI carries a "Live price" chip and a fetch timestamp, and the trip card says so in
plain words: the plan is stored and reviewed, the number is live.

## Flow across the three scenarios

**1. Creator Circle (partner creator).** The creator sends a draft reel 1–2 hours before posting
(Creator role → Studio). MMT drafts the template, an expert reviews it (Ops role → Review queue), the
creator approves it (Creator → My drafts). The reel goes up with the link in the caption. A viewer who
taps it lands on a finished trip card labelled **Creator verified**, and the creator earns a payout on
confirmed bookings (visible in the creator dashboard).

**2. Non-Circle (watchlist).** A scheduled job checks 180 tracked creators every 2–3 hours (Ops →
Watchlist). New travel content becomes an itinerary, MMT reviews it, and it is stored against the reel
link. A viewer pasting that link sees the stored plan instantly, labelled **Curated by MMT from a public
reel**, with the original creator credited and no payout. If the viewer arrives before the scan cycle
finishes, they get the "We are preparing this itinerary" screen with a *Notify me* option, and ops can
invite that creator into the Circle from the same queue.

**3. Unrecognized reel.** No error state. The screen says plainly that MMT does not have an itinerary
for this reel yet, then offers similar trips through the alternate destination finder, *Notify me if an
itinerary appears*, and *Request this itinerary*, which files the reel into the ops request queue.

The **link resolver** panel on the home screen shows the actual order of checks — Creator Circle →
watchlist library → preparing queue → fallback — and has a demo toggle to force each outcome.

## What is real in the prototype vs mocked

Real: link resolution, the trip card, date-window / budget-tier / add-on toggles that refetch the price,
the alternate destination finder with vibe and season ranking, group voting and split pay, creator studio
and status tracker, ops review queue, watchlist monitor, funnels, and the Viewer / Creator / Ops role
switcher.

Mocked: AI drafting, the platform scanning job, payments, sharing, and all numbers.

## Files

- `index.html` — shell (Lato from Google Fonts)
- `theme.css` — every design token: colour, type, radius, spacing, elevation, illustration palettes
- `styles.css` — components, built only from tokens; no hardcoded colours
- `js/icons.js` — Lucide-style outline icons, stroked with `currentColor`
- `js/data.js` — data model and seed data (8 templates: 3 Circle, 5 watchlist, one of them still preparing)
- `js/app.js` — state, pricing, resolver, all screens
- `demo/` — dummy Instagram post and iOS-style share sheet, fully self-contained
  (`demo/index.html`, `demo/instagram.css`, `demo/instagram.js`); it has its own dark
  tokens and shares nothing with the MMT theme

## Share-to-MMT entry flow

`demo/index.html` is a dummy Instagram post by @manshuuuu. The paper-plane icon opens an
iOS-style share sheet; tapping the MMT tile hands the post id to the MMT app route
(`index.html?post=<id>`). MMT opens with a fade and scale, shows a "Finding your dream
vacation…" loader for two seconds, then renders the stored itinerary for that post with an
"Inspired by @manshuuuu's reel" chip at the top. The post id resolves through the same
reel → itinerary association the link resolver uses, so pasting the post URL into the MMT
home screen lands on the same plan. Reach it from the MMT home screen via "See it from the
reel side", or open `demo/index.html` directly.

## Design system

MakeMyTrip-adjacent: Lato, `#008CFF` as the only strong accent, gradient CTAs, white surfaces on light
grey, 16px cards, 8px controls, hairline borders and near-flat elevation. Restyling means editing
`theme.css` alone — components and the destination illustrations both read their colours from it.

Data model: `Creator`, `TripTemplate` (source, reelLink, destination, vibeTags, activities, dayPlan,
budgetTiers, recommendedDateWindows, nearbyAddOns, status), `WatchlistScan`, `GroupTrip`, `BookingMock`.

## Assumptions

1. Production scanning of creator accounts must run through official platform APIs (Instagram Graph,
   YouTube Data API) and stay inside platform terms. No scraping. The 2–3 hour cycle assumes API quota
   allows it for a list of this size.
2. Every template is human-reviewed before it goes live. The prototype shows the reviewing desk and the
   review date on each plan.
3. Prices are per person, domestic, land-only unless a line says otherwise, and come from MMT inventory
   at fetch time. In the prototype they are computed from a per-day base and a season factor.
4. Creator payouts are modelled as a flat amount per confirmed booking, with view and engagement bonuses
   as an option. The real commercial terms would be negotiated per creator.
5. Curated (watchlist) templates credit the creator and pay nothing. They are MMT's own itinerary
   inspired by public content, not a reproduction of the creator's material.
6. All figures, counts, handles and funnels in the prototype are illustrative.

## Risks and mitigations

**Creator adoption.** Circle only works if creators send drafts before posting, which is extra work at
their busiest moment. Mitigation: keep the creator's job to one upload plus one approval tap; show
earnings per template in the dashboard so the payoff is visible; seed the Circle by converting the
watchlist creators who already drive bookings — the ops queue has an *Invite to Circle* action on exactly
those profiles.

**Scan delay and template quality.** A 2–3 hour cycle means viewers can arrive before the plan exists,
and auto-drafted plans can be wrong. Mitigation: the "preparing" state is a designed screen with a notify
option, not an error; viewer demand is surfaced to ops so hot reels jump the queue; nothing publishes
without an expert review, and the review date and desk stay on the card so any claim is traceable. This
reduces error, it does not remove it.

**Pricing accuracy.** A stored plan with a stale price is worse than no price. Mitigation: plan and price
are split by design — the plan is cached, the price is never cached. Every price carries a live chip and
a timestamp, any change to dates, tier, add-ons or group vote refetches, and checkout locks the number
for a stated 15 minutes.

## Optional ideas, outside the core build

- Price-drop watch on a saved template, with an alert when a date window falls below what the viewer saw.
- A creator-facing "which day is losing people" view, from where viewers drop off in the day plan.
- Auto-draft the next template from a creator's recurring route once they have three approved ones.
- Let a group lock a date window with a partial deposit while votes are still open.
- Regional language versions of the plan text, taken from the same reviewed source.
- A weekly ops digest of requested-but-missing reels, ranked by how many viewers asked.
