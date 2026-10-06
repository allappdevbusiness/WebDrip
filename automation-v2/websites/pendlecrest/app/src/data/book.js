// Booking page copy and widget data (fictional concept brand).

export const header = {
  label: 'Book a repair',
  title: 'Hand it over at the counter, or post it in.',
  lede: 'Both routes start the same way: a ticket number, a free inspection and a written estimate within three working days. Choose whichever suits you, pick a slot or follow the packing checklist, and track it until it’s back.',
};

export const ways = [
  {
    title: 'At the counter',
    tag: 'Best if you’re nearby',
    steps: [
      'Book a 10-minute slot below, or just walk in during counter hours.',
      'We look at the watch with you, note the symptoms and take photos of its condition.',
      'You leave with a paper ticket. Quick jobs are done while you wait.',
    ],
    note: 'Batteries, pressure tests, straps and bracelet sizing are usually done in under 20 minutes.',
  },
  {
    title: 'By post',
    tag: 'Anywhere in the UK',
    steps: [
      'Print or write down a ticket from the form on this page.',
      'Pack the watch using the checklist and send it tracked and insured.',
      'We email when it arrives and again when your estimate is ready.',
    ],
    note: 'Insured return delivery is £12, or free on any service over £200.',
  },
];

export const bookingServices = [
  { id: 'estimate', label: 'Free inspection and estimate', mins: 10 },
  { id: 'battery', label: 'Battery and seal check', mins: 20 },
  { id: 'bracelet', label: 'Bracelet sizing or strap fitting', mins: 15 },
  { id: 'collect', label: 'Collect a finished watch', mins: 10 },
];

export const quiz = [
  {
    q: 'What kind of watch is it?',
    options: [
      { label: 'Battery (quartz)', tag: 'quartz' },
      { label: 'Automatic or hand-wound', tag: 'mech' },
      { label: 'Pocket watch or very old', tag: 'vintage' },
    ],
  },
  {
    q: 'What’s it doing?',
    options: [
      { label: 'Stopped completely', tag: 'stopped' },
      { label: 'Running fast or slow', tag: 'timing' },
      { label: 'Fine, just overdue', tag: 'due' },
    ],
  },
  {
    q: 'What matters most to you?',
    options: [
      { label: 'Keeping the cost down', tag: 'cost' },
      { label: 'Keeping it original', tag: 'original' },
      { label: 'Getting it back quickly', tag: 'fast' },
    ],
  },
];

export function recommend(tags) {
  const [type, state, pref] = tags;
  if (type === 'quartz') {
    if (state === 'stopped') return { name: 'Battery and seal check first', price: '£24', why: 'Most stopped quartz watches only need a fresh cell. If it still stops, we move on to a quartz service (£135) and only charge for the battery once.' };
    return { name: 'Quartz service', price: 'from £135', why: 'A clean and coil test sorts most timing problems in quartz watches. If a new movement is cheaper, we’ll say so in the estimate.' };
  }
  if (type === 'vintage' || pref === 'original') return { name: 'Heritage service', price: 'from £325', why: 'A full service with a photo record, original parts kept wherever possible and only a light case refresh. Ideal for heirlooms.' };
  if (state === 'timing' && pref === 'fast') return { name: 'Demagnetise and regulate, same day', price: '£35', why: 'If it’s suddenly running fast, it’s usually magnetism, fixed while you wait. If not, we’ll book in a full service.' };
  if (pref === 'fast') return { name: 'Standard service with express', price: 'from £305', why: 'The standard full service with your watch moved to the front of the bench queue. Ready in about two weeks.' };
  return { name: 'Standard service', price: 'from £245', why: 'The full strip, clean, oil and regulation every mechanical watch needs every three to five years, with a 12-month guarantee.' };
}

export const checklist = [
  'Write your ticket number on a piece of paper and put it in the box',
  'Remove any loose straps or extra links and pack them in a separate bag',
  'Wrap the watch in a soft cloth, then bubble wrap, with the crown pushed in',
  'Use a small sturdy box with at least 3 cm of padding on every side',
  'Don’t write “watch” or a brand name anywhere on the outside',
  'Send it tracked and insured for its full value, and keep the receipt',
];

export const timetable = {
  Mon: { title: 'Bench day', counter: 'Counter closed', items: ['Strip-downs and cleaning machine runs', 'Postal arrivals unpacked and logged', 'Estimates written and emailed by 4pm'] },
  Tue: { title: 'Counter open 9:30–17:30', counter: 'Open', items: ['Drop-offs and free inspections', 'Battery and pressure tests while you wait', 'Lathe work for parts that have to be made'] },
  Wed: { title: 'Counter open 9:30–17:30', counter: 'Open', items: ['Drop-offs and collections', 'Chronograph and complication work', 'Postal returns sent by insured courier at 3pm'] },
  Thu: { title: 'Late counter until 19:00', counter: 'Open late', items: ['After-work collections until 7pm', 'Vintage and pocket watch consultations from 5pm', 'Timing checks on the week’s finished watches'] },
  Fri: { title: 'Counter open 9:30–17:30', counter: 'Open', items: ['Drop-offs and collections', 'Seven-day wear tests signed off', 'Postal returns sent at 3pm'] },
  Sat: { title: 'Counter open 10:00–16:00', counter: 'Open', items: ['Quick jobs only: batteries, straps, bracelets', 'Collections', 'No estimates on Saturdays, so the counter stays quick'] },
};

export const gallery = [
  { photo: 'pocketSilver', caption: 'Silver open-face pocket watch, new balance staff made on the lathe' },
  { photo: 'pocketChain', caption: 'Gold hunter, case hinge repaired and the original chain cleaned' },
  { photo: 'pocketYellow', caption: 'Cream-dial pocket watch, dial left untouched, movement fully serviced' },
  { photo: 'watchRow', caption: 'A typical Friday: the week’s finished watches waiting for collection' },
  { photo: 'mapDial', caption: 'Steel dress watch, new crystal and a light brush refresh' },
  { photo: 'fieldWatch', caption: 'Field watch, demagnetised and regulated, new strap fitted' },
];

export const team = [
  { initials: 'IC', name: 'Ines Calloway', role: 'Founder and watchmaker', bio: 'Trained on a two-year watchmaking course, then spent eight years servicing chronographs at a large service centre before opening Pendlecrest in 2014. Still does every final timing check.' },
  { initials: 'OT', name: 'Owen Thale', role: 'Watchmaker, vintage and pocket watches', bio: 'Came to watches from model engineering and runs the lathe. If a balance staff or stem hasn’t been made for fifty years, Owen makes one.' },
  { initials: 'MB', name: 'Mira Okafor-Bell', role: 'Counter, postal and case finishing', bio: 'Logs every arrival, writes the estimates you receive, and does careful case work. Will talk you out of a polish if it isn’t needed.' },
];

export const directions = {
  tram: { label: 'Tram', text: 'Take any line to Pendle Street. Leave by the north exit, turn left, and the Ropewalk Yard archway is 150 m on your right. About 2 minutes on foot.' },
  bus: { label: 'Bus', text: 'Routes 7 and 22 stop at Harrowgate Quarter, outside the old library. Cross at the lights and walk down Pendle Street for 3 minutes.' },
  car: { label: 'Car', text: 'Pay-and-display parking at Canal Wharf, 4 minutes away. The yard itself is pedestrian-only, but there is a 10-minute drop-off bay on Rope Lane.' },
  bike: { label: 'Bike', text: 'Covered bike stands just inside the archway, opposite the bakery. The canal towpath brings you within 200 m.' },
};

// Demo tickets for the tracker widget (sample data). stage = index into trackStages.
export const tickets = {
  'PW-2417': { watch: 'Automatic diver', stage: 3, note: 'Reassembled and on the timing machine. Wear test starts tomorrow.' },
  'PW-2388': { watch: '1950s hand-wound dress watch', stage: 1, note: 'Estimate sent on Monday. Waiting for your approval.' },
  'PW-2302': { watch: 'Hunter pocket watch', stage: 5, note: 'Ready to collect, or posted by insured courier on request.' },
};

export const trackStages = ['Received', 'Estimate sent', 'Approved', 'On the bench', 'Wear test', 'Ready'];

export const bookingQs = [
  { q: 'Do I need to book, or can I just walk in?', a: 'Walk-ins are welcome whenever the counter is open. A booked slot simply means you won’t queue behind someone else’s bracelet sizing on a busy Saturday or Thursday evening.' },
  { q: 'What should I bring to the counter?', a: 'The watch, any spare links or the original strap, and old service papers if you have them. A note of when it was last serviced helps us judge the state of the oils before we open it.' },
  { q: 'How do I pay, and when?', a: 'Nothing is paid at drop-off. Once you approve the written estimate we start work, and you pay by card or bank transfer when the watch is finished and you’re happy with it.' },
  { q: 'Is my watch insured while you have it?', a: 'Yes, up to £15,000 per watch while it’s in the workshop and on its insured return journey. Tell us at drop-off if it’s worth more and we’ll arrange extra cover.' },
  { q: 'Can someone else collect it for me?', a: 'Of course. They just need the paper ticket or the ticket number, and a name that matches the one you gave us. We’ll check the name before handing it over.' },
  { q: 'What if I change my mind after approving the estimate?', a: 'Ring or email the bench straight away. If we haven’t started, there’s nothing to pay. If we have, we only charge for the work already done, and we’ll tell you the amount before closing the watch up.' },
];
