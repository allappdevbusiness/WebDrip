// Home page copy and widget data. Everything here is fictional (concept brand).

export const hero = {
  label: 'Independent watchmakers in the Harrowgate Quarter',
  title: 'Every second, carefully restored.',
  lede: 'Servicing, repair and gentle restoration for mechanical and quartz watches, done on one bench by two watchmakers. You get a written estimate before we touch the movement, and a 12-month guarantee after.',
  ticket: {
    title: 'On the bench today',
    watch: '1962 hand-wound dress watch',
    job: 'New mainspring and a full service',
    day: 6,
    of: 9,
  },
};

export const benchList = [
  'Hand-wound dress watches',
  'Automatic divers',
  'Column-wheel chronographs',
  'Everyday quartz',
  'Hunter and open-face pocket watches',
  'Military field watches',
  'Cocktail watches',
  'Carriage clocks',
  'GMT travellers',
  'Moonphase calendars',
  'Tuning-fork era electronics',
  'Mid-century calendar watches',
];

export const benchIntro = [
  'Most of what we see is ordinary in the best way: a watch someone wears every day that has started losing a minute a week, or a grandfather’s watch found in a drawer that hasn’t run since the 1980s. Both get the same process and the same care.',
  'We work on mechanical and quartz movements from the 1920s onwards, from simple three-hand calibres to chronographs, alarms and calendars. If a watch needs a part that is no longer made, we say so in the estimate, and we tell you whether we can make or adapt one.',
];

export const symptoms = [
  { id: 'gaining', label: 'Suddenly gaining minutes a day', cause: 'Magnetised hairspring', service: 'Demagnetise and regulate', price: 'from £35', urgency: 1, note: 'Usually fixed the same day at the counter. Phones, laptop lids and magnetic bag clasps are the usual culprits.' },
  { id: 'losing', label: 'Slowly losing time over months', cause: 'Old oils thickening and wear', service: 'Full service', price: 'from £245', urgency: 2, note: 'A sign the lubricants have dried. Running it like this wears the pivots, so book a service in the next few months.' },
  { id: 'stops', label: 'Stops overnight, short power reserve', cause: 'Tired mainspring or dirty train', service: 'Full service with mainspring check', price: 'from £245', urgency: 2, note: 'A healthy automatic should run 38 hours or more off the wrist. We test the reserve before and after.' },
  { id: 'crown', label: 'Crown feels gritty, stiff or loose', cause: 'Worn stem, crown seal or keyless works', service: 'Crown and stem repair', price: 'from £65', urgency: 2, note: 'Stop winding if it grinds. A loose crown can also let water in.' },
  { id: 'mist', label: 'Mist or droplets under the glass', cause: 'Water has got past a seal', service: 'Urgent dry-out and service', price: 'quote after inspection', urgency: 3, note: 'Bring it in within a day or two if you can. Moisture rusts steel parts fast. Don’t leave it on a radiator.' },
  { id: 'rattle', label: 'Rattle, grinding or a loose rotor', cause: 'Rotor bearing or a loose screw', service: 'Inspection and repair', price: 'from £85', urgency: 3, note: 'Take it off and stop wearing it. A loose part inside can damage the dial or the balance.' },
  { id: 'date', label: 'Date changes at midday, not midnight', cause: 'Time set 12 hours out', service: 'Free reset at the counter', price: 'free', urgency: 0, note: 'Not a fault: wind past the date change, then set the time. We’ll show you how.' },
  { id: 'battery', label: 'New battery, but it still stops', cause: 'Dirty quartz movement or a coil fault', service: 'Quartz service', price: 'from £135', urgency: 1, note: 'A leaking old battery often leaves residue. We clean the movement or fit a replacement if it’s cheaper.' },
  { id: 'hands', label: 'Hands loose or catching each other', cause: 'Hand fit or a knock', service: 'Hand refit and check', price: 'from £45', urgency: 2, note: 'Usually after a drop. We check the balance pivots at the same time, as they take the same shock.' },
  { id: 'chrono', label: 'Chronograph won’t return to zero', cause: 'Heart cam or hammer adjustment', service: 'Chronograph service', price: 'from £365', urgency: 1, note: 'Avoid pressing reset repeatedly. Often an adjustment, sometimes a worn part.' },
];

export const serviceCats = ['All', 'Mechanical', 'Quartz', 'Vintage', 'Small jobs'];

export const services = [
  { name: 'Full service', cat: 'Mechanical', price: 'from £245', time: '3–4 weeks', text: 'Complete strip, clean, oil, regulate and pressure test for three-hand automatics and hand-wound watches.', photo: 'gears' },
  { name: 'Chronograph service', cat: 'Mechanical', price: 'from £365', time: '4–5 weeks', text: 'The full service plus the chronograph works: reset hammers, clutch and the column wheel or cam timing.', photo: 'stopwatch' },
  { name: 'Quartz service', cat: 'Quartz', price: 'from £135', time: '1–2 weeks', text: 'Movement clean, coil and circuit test, new gaskets and a pressure test. Or a new movement if it costs less.', photo: 'pastelStraps' },
  { name: 'Battery and seal check', cat: 'Quartz', price: '£24', time: 'While you wait', text: 'A quality silver-oxide cell, the case-back gasket checked and greased, and the current draw measured.', photo: 'leatherStrap' },
  { name: 'Vintage restoration', cat: 'Vintage', price: 'quote after inspection', time: '6–10 weeks', text: 'Service plus sourced or made parts, light case refinishing on request, and the dial left original unless you ask.', photo: 'vintageCase' },
  { name: 'Pocket watch service', cat: 'Vintage', price: 'from £295', time: '5–8 weeks', text: 'Key-wind and stem-wind, open-face and hunter. Balance staffs and mainsprings replaced or made to fit.', photo: 'pocketGold' },
  { name: 'Crystal replacement', cat: 'Small jobs', price: 'from £55', time: '3–7 days', text: 'Acrylic, mineral and sapphire, domed or flat, fitted with a new gasket and pressure tested.', photo: 'dialMacro' },
  { name: 'Demagnetise and regulate', cat: 'Small jobs', price: '£35', time: 'Same day', text: 'For watches suddenly running minutes fast. Checked on the timing machine in five positions afterwards.', photo: 'mapDial' },
  { name: 'Pressure test', cat: 'Small jobs', price: '£18', time: 'While you wait', text: 'Dry air test to the rated depth. Free with any service. Recommended once a year if you swim in it.', photo: 'fieldWatch' },
  { name: 'Bracelet and strap fitting', cat: 'Small jobs', price: 'from £10', time: 'While you wait', text: 'Links removed or added evenly on both sides, spring bars replaced and straps fitted to your wrist.', photo: 'wrist' },
];

export const process = [
  { title: 'Drop it off or post it in', short: 'Day 0', text: 'Bring it to the counter, Tuesday to Saturday, or post it to us fully insured using our packing checklist. You get a ticket number straight away.' },
  { title: 'Inspection and a written estimate', short: 'Within 3 working days', text: 'We open the case, check the movement on the timing machine and photograph anything worn. You get a written, itemised estimate. Nothing chargeable happens until you say yes.' },
  { title: 'Strip and clean', short: 'Week 1', text: 'Every part comes out, from the mainspring to the smallest jewel setting. Parts are checked under magnification and cleaned in five baths of watch-cleaning solution.' },
  { title: 'Repair, oil and reassemble', short: 'Week 1–2', text: 'Worn parts are replaced. Up to seven different oils and greases go on in the right places, in tiny amounts, as the movement is rebuilt.' },
  { title: 'Timing and pressure tests', short: 'Week 2–3', text: 'We regulate it in five positions, check amplitude and beat error, pressure test the case, then wear-test it on a winder for seven days.' },
  { title: 'Back on your wrist', short: 'Collection or insured post', text: 'You get the timing printout, any old parts in a little bag, and a 12-month guarantee covering everything we did.' },
];

export const restoration = {
  title: 'We restore what’s worn, not the history.',
  paras: [
    'A watch that has been worn for sixty years should look like it. We clean dials gently and only where it is safe, keep original hands and crowns when they can be saved, and never refinish a dial unless you specifically ask.',
    'Polishing removes metal. A heavy polish rounds off the sharp edges a case was made with, and collectors notice. So by default we only do a light clean and a brush refresh. A full polish is an option you tick, with a note on what it will change.',
    'If a part can’t be found, we can often make one on the lathe: a balance staff, a stem or a screw. Every replaced part is returned to you so the watch’s story stays complete.',
  ],
  points: ['Original dial left untouched by default', 'Light case refresh, full polish only on request', 'Old parts returned in a labelled bag', 'Photos of the strip-down on request'],
};

export const spotlight = {
  title: 'One bench, two watchmakers, no conveyor belt.',
  paras: [
    'Your watch stays in this room from the moment it arrives. It sits in its own covered tray with your ticket and is worked on by one watchmaker from start to finish, so someone always knows exactly where it is.',
    'The bench has a timing machine, a five-bath cleaning machine, a dry-air pressure tester, a demagnetiser and a watchmaker’s lathe for making small parts. Daylight-balanced lamps and a stereo microscope mean nothing is guessed.',
  ],
  tools: ['Timing machine', 'Five-bath cleaning machine', 'Dry-air pressure tester', 'Watchmaker’s lathe', 'Stereo microscope', 'Demagnetiser'],
};

export const stats = [
  { value: 3180, suffix: '', label: 'watches serviced since we opened in 2014' },
  { value: 9, suffix: ' days', label: 'median time for a quartz service, ticket to collection' },
  { value: 96.4, suffix: '%', label: 'of repairs ready on or before the quoted date' },
  { value: 12, suffix: ' months', label: 'guarantee on every service and repair' },
];

export const compare = [
  { label: 'Typical full service', us: 'from £245', away: '£450–£700' },
  { label: 'Turnaround', us: '3–4 weeks', away: '8 weeks to 6 months' },
  { label: 'Who you talk to', us: 'The watchmaker doing the work', away: 'A call centre or the shop that sent it' },
  { label: 'Original parts kept', us: 'Returned to you', away: 'Often swapped as standard' },
];

export const reviews = [
  { quote: 'My father’s watch hadn’t run since 1991. They rang me before doing anything, explained the broken balance staff, and made a new one. It’s now on my wrist every day.', name: 'Sample review: Helen, Harrowgate', watch: '1950s hand-wound dress watch' },
  { quote: 'The estimate came with photos of the worn parts and two options. I picked the cheaper one and they didn’t push the other at all.', name: 'Sample review: Tomasz, by post', watch: 'Automatic diver' },
  { quote: 'I walked in thinking I needed a service. Ten minutes and £35 later it was demagnetised and keeping perfect time.', name: 'Sample review: Priya, Pendle Street', watch: 'Automatic field watch' },
  { quote: 'They told me not to polish my vintage chronograph, which saved me money and probably its value too. Honest people.', name: 'Sample review: Gareth, Old Town', watch: '1970s chronograph' },
  { quote: 'Posted my pocket watch from the other end of the country. Tracking updates, an itemised quote, and it came back in a padded box with the old mainspring.', name: 'Sample review: Ruth, by post', watch: 'Hunter pocket watch' },
];

export const visit = {
  paras: [
    'The counter is in the old rope-works yard, two minutes from Pendle Street tram stop. Ring the brass bell if the door is shut: the watchmaker is probably bent over something small.',
    'Bring the watch and any old receipts or service papers if you have them. They help us date the last service. You can stay while we do batteries, pressure tests and bracelet sizing.',
  ],
};

export const tips = [
  { title: 'Wind it in the morning', text: 'Hand-wound watches keep the most even rate in the first 24 hours after winding. Wind fully each morning, gently, about 30 turns, and stop when you feel resistance.' },
  { title: 'Mind the date between 9pm and 3am', text: 'On most mechanical calendars the date wheel is engaged overnight. Setting the date in that window can strain the teeth, so move the hands to 6 o’clock first.' },
  { title: 'Keep it away from magnets', text: 'Phones, laptop lids, tablet covers and handbag clasps can magnetise a hairspring. If your watch suddenly runs minutes fast, it’s usually this, and it takes minutes to fix.' },
];
