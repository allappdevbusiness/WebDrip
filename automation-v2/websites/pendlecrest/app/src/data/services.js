// Services page copy and widget data (fictional concept brand, GBP prices).

export const header = {
  label: 'Services & prices',
  title: 'Prices you can read before you hand it over.',
  lede: 'Starting prices for the work we do most, a calculator for a closer figure, how long each job takes and what the guarantee covers. Every job still gets a free written estimate before work starts.',
};

export const priceTabs = [
  {
    id: 'servicing',
    label: 'Servicing',
    intro: 'A full service is the main maintenance a mechanical watch needs every three to five years. It includes everything in the walk-through further down this page.',
    rows: [
      { item: 'Hand-wound, three hands', price: '£245', note: 'Includes new gaskets, crown seal check and pressure test' },
      { item: 'Automatic, three hands or date', price: '£265', note: 'Rotor bearing checked and cleaned' },
      { item: 'Automatic with day-date or GMT', price: '£295', note: 'Calendar works stripped and lubricated' },
      { item: 'Chronograph, cam or column wheel', price: '£365', note: 'Hammers, clutch and reset adjusted' },
      { item: 'Alarm, moonphase or annual calendar', price: 'from £395', note: 'Quoted after inspection' },
      { item: 'Pocket watch, stem or key wind', price: '£295', note: 'Balance pivots polished as needed' },
    ],
  },
  {
    id: 'repairs',
    label: 'Repairs',
    intro: 'Repairs are quoted on top of a service when a part is broken or worn beyond cleaning. We always show you the part first.',
    rows: [
      { item: 'Mainspring replacement', price: '£38 + part', note: 'Most springs £14–£50' },
      { item: 'Balance staff fitted', price: '£55 + part', note: 'Made on the lathe if unavailable: from £140' },
      { item: 'Winding stem and crown', price: '£65', note: 'Generic or original, your choice' },
      { item: 'Hand refit after a knock', price: '£45', note: 'Includes a check of the balance pivots' },
      { item: 'Dry-out after water damage', price: 'from £95', note: 'Urgent: same-week inspection' },
      { item: 'Rotor bearing replacement', price: '£75 + part', note: 'For noisy or loose rotors' },
    ],
  },
  {
    id: 'restoration',
    label: 'Restoration',
    intro: 'Restoration is everything beyond keeping a watch running: case work, sourcing old parts and making new ones. We agree each step with you.',
    rows: [
      { item: 'Light case clean and brush refresh', price: '£40', note: 'Default with every vintage service' },
      { item: 'Full case and bracelet polish', price: '£95', note: 'Only on request, removes metal' },
      { item: 'Dial cleaning (safe dials only)', price: '£45', note: 'Never on fragile or printed-over dials' },
      { item: 'Period-correct crystal sourced', price: 'from £45', note: 'Domed acrylic or glass' },
      { item: 'Part made on the lathe', price: 'from £120', note: 'Staffs, stems, screws, pins' },
      { item: 'Heirloom restoration package', price: 'quote', note: 'Service, case, crystal, strap, photo record' },
    ],
  },
  {
    id: 'quick',
    label: 'Quartz & quick jobs',
    intro: 'Most quick jobs are done while you wait at the counter, usually in under 20 minutes.',
    rows: [
      { item: 'Battery and seal check', price: '£24', note: 'Silver-oxide cell, gasket greased' },
      { item: 'Quartz movement service', price: '£135', note: 'Or a new movement if cheaper' },
      { item: 'Pressure test (dry air)', price: '£18', note: 'Free with any service' },
      { item: 'Demagnetise and regulate', price: '£35', note: 'Same day' },
      { item: 'Bracelet sizing', price: '£10', note: 'Free if we serviced the watch' },
      { item: 'Strap fitting, spring bars included', price: '£8', note: 'Bring your own strap or choose ours' },
    ],
  },
];

export const tiers = {
  standard: {
    name: 'Standard service',
    blurb: 'Everything a healthy watch needs to run accurately for another five years.',
    prices: { 'Hand-wound': 245, Automatic: 265, Chronograph: 365 },
    weeks: '3–4 weeks',
  },
  heritage: {
    name: 'Heritage service',
    blurb: 'For vintage and sentimental pieces: the standard service plus a full photo record and extra care for originality.',
    prices: { 'Hand-wound': 325, Automatic: 345, Chronograph: 455 },
    weeks: '5–6 weeks',
  },
};

export const tierFeatures = [
  { f: 'Complete strip, clean and lubrication', standard: true, heritage: true },
  { f: 'Timing in five positions with printout', standard: true, heritage: true },
  { f: 'New gaskets and pressure test', standard: true, heritage: true },
  { f: 'Seven-day wear test on a winder', standard: true, heritage: true },
  { f: '12-month guarantee', standard: true, heritage: true },
  { f: 'Photo record of the strip-down', standard: false, heritage: true },
  { f: 'Original parts kept where at all possible', standard: false, heritage: true },
  { f: 'Light case refresh and crystal clean', standard: false, heritage: true },
  { f: 'Handwritten service card for the box', standard: false, heritage: true },
];

export const calc = {
  movements: [
    { id: 'quartz', label: 'Quartz', base: 135 },
    { id: 'handwound', label: 'Hand-wound', base: 245 },
    { id: 'automatic', label: 'Automatic', base: 265 },
    { id: 'pocket', label: 'Pocket watch', base: 295 },
  ],
  complications: [
    { id: 'date', label: 'Day-date or GMT', add: 30 },
    { id: 'chrono', label: 'Chronograph', add: 100 },
    { id: 'moon', label: 'Moonphase or alarm', add: 130 },
  ],
  crystals: [
    { id: 'none', label: 'Crystal is fine', add: 0 },
    { id: 'acrylic', label: 'New acrylic', add: 45 },
    { id: 'mineral', label: 'New mineral', add: 75 },
    { id: 'sapphire', label: 'New sapphire', add: 160 },
  ],
  extras: [
    { id: 'polish', label: 'Full case polish', add: 95 },
    { id: 'strap', label: 'New leather strap', add: 45 },
    { id: 'express', label: 'Express (jump the queue)', add: 60 },
  ],
};

export const inside = [
  { title: 'Inspection', text: 'Timing machine readings before anything is touched: rate, amplitude and beat error, so we can compare after.', photo: 'movementTools' },
  { title: 'Case opened', text: 'The movement comes out of the case. The dial and hands are removed and stored in your covered tray.', photo: 'holder' },
  { title: 'Full strip-down', text: 'Every wheel, bridge, spring and screw comes apart, often 100 to 200 parts, each checked under magnification.', photo: 'partsBench' },
  { title: 'Five-bath clean', text: 'Parts go through a cleaning machine: two cleaning baths, then three rinses, then warm-air drying.', photo: 'toolKit' },
  { title: 'Reassembly and oiling', text: 'Up to seven oils and greases, each applied in tiny amounts. Jewels get a drop smaller than a pinhead.', photo: 'skeleton' },
  { title: 'Regulation', text: 'Rate adjusted in five positions until it sits within a few seconds a day, with amplitude healthy.', photo: 'openDial' },
  { title: 'Case and seals', text: 'New gaskets, the crown and case back resealed, then a dry-air pressure test to its rated depth.', photo: 'fieldWatch' },
  { title: 'Seven-day wear test', text: 'A week on the winder and in the drawer, checked every morning, before we ring you to collect.', photo: 'watchRow' },
];

export const turnaround = {
  jobs: [
    { id: 'quick', label: 'Battery, strap or pressure test', days: [0, 0] },
    { id: 'quartz', label: 'Quartz service', days: [7, 12] },
    { id: 'full', label: 'Full mechanical service', days: [18, 26] },
    { id: 'chrono', label: 'Chronograph service', days: [24, 34] },
    { id: 'vintage', label: 'Vintage restoration', days: [42, 70] },
  ],
  parts: [
    { id: 'stock', label: 'Parts in stock', add: 0 },
    { id: 'order', label: 'Parts to order', add: 10 },
    { id: 'make', label: 'Part to be made', add: 14 },
  ],
};

export const water = [
  { id: 'rain', label: 'Rain and hand-washing', need: '30 m (3 bar)', ok: 'Any watch marked water resistant', tip: 'Keep the crown pushed in. Dry it off if it gets soaked.' },
  { id: 'shower', label: 'Showering', need: '50 m (5 bar), better 100 m', ok: 'Sports watches with a screw-down crown', tip: 'Hot water and soap age gaskets quickly. Many watchmakers would rather you took it off.' },
  { id: 'swim', label: 'Swimming in a pool or the sea', need: '100 m (10 bar)', ok: 'Divers and sports watches with a screw-down crown', tip: 'Rinse in fresh water after the sea, and pressure test yearly.' },
  { id: 'snorkel', label: 'Snorkelling', need: '200 m (20 bar)', ok: 'Dive watches tested within the last year', tip: 'Never operate the crown or pushers under water.' },
  { id: 'dive', label: 'Scuba diving', need: '200 m+ and an ISO 6425 dive rating', ok: 'Dedicated dive watches only', tip: 'Have it pressure tested before every dive season.' },
];

export const glossary = [
  { term: 'Mainspring', def: 'The coiled spring in the barrel that stores the energy. Over decades it loses strength, which shortens the power reserve.' },
  { term: 'Balance wheel and hairspring', def: 'The oscillator that beats several times a second and decides how fast the watch runs. Its spring is finer than a hair and easily magnetised.' },
  { term: 'Escapement', def: 'The pallet fork and escape wheel that release the gear train one tick at a time. Most of the oiling skill goes here.' },
  { term: 'Jewels', def: 'Synthetic rubies used as low-friction bearings for the pivots. A 17-jewel watch has jewels at every important point.' },
  { term: 'Amplitude', def: 'How far the balance swings, measured in degrees. Low amplitude usually means dirty oil, a tired spring or wear.' },
  { term: 'Beat error', def: 'How evenly the tick and tock are spaced. We adjust it close to zero for steady timekeeping.' },
  { term: 'Gaskets', def: 'Rubber seals at the case back, crown and crystal that keep water and dust out. They harden with age, so they’re replaced at every service.' },
  { term: 'Keyless works', def: 'The levers and wheels behind the crown that switch between winding and setting the time.' },
];

export const care = {
  dos: [
    'Wind a hand-wound watch fully every morning, gently, until you feel resistance.',
    'Give a stopped automatic 20–30 turns of the crown before putting it on.',
    'Keep it in a dry box or pouch, out of direct sunlight, when you aren’t wearing it.',
    'Rinse a dive watch in fresh water after swimming in the sea.',
    'Have the water resistance tested once a year if it gets wet.',
  ],
  donts: [
    'Don’t set the date between 9pm and 3am on a mechanical calendar.',
    'Don’t operate the crown or pushers under water.',
    'Don’t leave it on a phone, laptop lid or magnetic charger.',
    'Don’t wear it in the sauna or hot tub: heat swells the seals.',
    'Don’t let a dead battery sit inside a quartz watch for months.',
  ],
};

export const guarantee = [
  { title: '12-month guarantee', text: 'Everything we serviced or replaced is covered for 12 months from collection. If it stops, loses time beyond the quoted tolerance or lets water in, we put it right free of charge.' },
  { title: 'Written estimate first', text: 'Every estimate is itemised and in writing. If we find something new once the watch is open, we stop and ask before doing more.' },
  { title: 'Free estimate, fair if declined', text: 'Estimates are free. If you decline, we close the watch and return it as it came, at no charge. Postal returns cost £12 for insured delivery.' },
  { title: 'Insured at all times', text: 'Watches are insured while in our care up to £15,000 each, and on the return journey by insured courier. Higher values on request.' },
  { title: 'What isn’t covered', text: 'Accidental damage, water damage after the case has been opened by someone else, worn straps, and batteries after 12 months.' },
  { title: 'Uncollected watches', text: 'We’ll remind you three times over six months. After a year, we write to you before anything else happens.' },
];

export const faqs = [
  { q: 'How often should my watch be serviced?', a: 'For most mechanical watches, every three to five years, or sooner if it starts gaining, losing or stopping. Quartz watches need a service far less often, roughly every eight to ten years, plus a new battery and seal check every two to three.' },
  { q: 'Is the estimate really free?', a: 'Yes. We inspect the watch, test it on the timing machine and send a written, itemised estimate. If you decline, we return it as it came. The only cost is insured return postage if you sent it by post.' },
  { q: 'How long will my service take?', a: 'A full mechanical service usually takes three to four weeks, a quartz service one to two, and vintage restorations six to ten. Parts we have to order or make add time. The turnaround estimator above gives a closer figure.' },
  { q: 'Do you use original parts?', a: 'We use original manufacturer parts where they are available, and good-quality generic parts where they are not. If a part has to be made or adapted, the estimate says so, and old parts are always returned to you.' },
  { q: 'Will you polish my watch?', a: 'Only if you ask. Polishing removes metal and softens the original edges, which matters to collectors. By default we do a light clean and brush refresh only.' },
  { q: 'Can I post my watch to you?', a: 'Yes. Follow the packing checklist on the booking page, send it by tracked and insured post, and include the printed ticket. We email you as soon as it arrives.' },
  { q: 'What does the guarantee cover?', a: 'All the work we did and every part we fitted, for 12 months from collection. It doesn’t cover accidental damage or water damage after someone else has opened the case.' },
  { q: 'My watch suddenly gains minutes every day. Is it broken?', a: 'Almost certainly it’s magnetised. It takes a few minutes to demagnetise and re-check on the timing machine, costs £35, and is usually done while you wait.' },
  { q: 'Do you work on smartwatches?', a: 'No. We work on mechanical and quartz watches, pocket watches and small carriage clocks. For smartwatches, the maker’s own service is the best route.' },
  { q: 'Can you make my watch water resistant again?', a: 'In most cases, yes: new gaskets, a crown seal and a pressure test to its original rating. Some vintage cases were never truly water resistant, and we’ll tell you honestly if that’s the case.' },
  { q: 'Is it worth servicing an inexpensive watch?', a: 'Sometimes not, and we’ll say so. For simple quartz watches a replacement movement is often cheaper than a service. For a watch with sentimental value, it’s usually worth it.' },
  { q: 'Do you service watches still under the maker’s warranty?', a: 'We’d rather you used the maker’s warranty first, since opening the case can void it. For batteries and straps, we can help without affecting it.' },
  { q: 'How do I pay?', a: 'Card or bank transfer when the work is finished and you have approved it. We don’t take deposits except for parts that have to be specially made.' },
  { q: 'What happens if you can’t fix it?', a: 'We tell you why, return any parts, and don’t charge for the attempt beyond what you agreed in writing. Sometimes we can suggest a specialist for very rare calibres.' },
];
