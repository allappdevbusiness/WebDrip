// Book page content. People and bios are fictional; photos are illustrative stock images.
export const header = {
  title: 'Book a visit',
  intro: 'Pick an exam and a time below, or call us. Most appointments are available within the week, and Saturday mornings are kept for working people and families.',
};

export const services = [
  { id: 'essential', label: 'Essential eye exam', mins: 30, price: 95 },
  { id: 'complete', label: 'Complete exam with OCT', mins: 45, price: 145 },
  { id: 'kids', label: "Kids' eye exam", mins: 30, price: 65 },
  { id: 'contacts', label: 'Contact lens fitting', mins: 40, price: 85 },
  { id: 'dry', label: 'Dry eye assessment', mins: 40, price: 75 },
  { id: 'styling', label: 'Frame styling (free)', mins: 30, price: 0 },
];

export const slots = ['9:00', '9:45', '10:30', '11:15', '12:00', '14:00', '14:45', '15:30', '16:15', '17:00'];
export const lateSlots = ['18:00', '18:45'];

export const bring = [
  'Your current glasses, including sunglasses and reading glasses',
  'Contact lenses in their case if you wear them, and the box or prescription',
  'A list of any medicines and eye drops you use',
  'Your previous prescription if you have one from elsewhere',
  'Health savings card or insurance details, if you use them',
  'Sunglasses for the walk home, in case we dilate your pupils',
];

export const before = [
  { title: 'Wear your contact lenses in', text: 'For a contact lens check, wear your lenses for at least two hours before you arrive so we can see how they settle.' },
  { title: 'Skip the eye make-up for dry eye visits', text: 'Mascara and liner sit on the gland openings we need to look at. Come with clean lids if you can.' },
  { title: 'Leave time for frames', text: 'The exam takes 30 to 45 minutes. If you want to choose glasses on the same day, allow another 30 minutes.' },
  { title: 'Bringing a child', text: 'Morning slots work best for under-fives. Bring their favourite toy, and do not worry if they do not know their letters yet.' },
];

export const timetable = {
  Mon: [
    { time: '9:00 - 13:00', title: 'Adult eye exams', who: 'Dr Lena Okafor' },
    { time: '14:00 - 18:00', title: 'Adult eye exams', who: 'Dr Sam Reyes' },
    { time: '12:00 - 14:00', title: 'Walk-in repairs and adjustments', who: 'Workshop' },
  ],
  Tue: [
    { time: '9:00 - 12:00', title: "Kids' clinic", who: 'Dr Mira Haddad' },
    { time: '13:00 - 18:00', title: 'Contact lens fittings and teach sessions', who: 'Jonah Pell' },
  ],
  Wed: [
    { time: '9:00 - 18:00', title: 'Adult eye exams with OCT', who: 'Dr Lena Okafor' },
    { time: '15:00 - 18:00', title: 'Frame styling appointments', who: 'Jonah Pell' },
  ],
  Thu: [
    { time: '9:00 - 14:00', title: 'Dry eye clinic', who: 'Dr Sam Reyes' },
    { time: '14:00 - 20:00', title: 'Late clinic: exams and collections', who: 'Dr Mira Haddad' },
  ],
  Fri: [
    { time: '9:00 - 13:00', title: 'Adult eye exams', who: 'Dr Sam Reyes' },
    { time: '13:00 - 18:00', title: 'Contact lens aftercare', who: 'Jonah Pell' },
  ],
  Sat: [
    { time: '9:00 - 15:00', title: 'Family exams and kids', who: 'Dr Mira Haddad' },
    { time: '9:00 - 15:00', title: 'Collections, fittings and repairs', who: 'Workshop' },
  ],
};

export const team = [
  { photo: 't1', name: 'Dr Lena Okafor', role: 'Optometrist and founder', bio: 'Opened EyeMax after eight years in hospital eye clinics, where she saw too many people arrive with glaucoma that a scan could have caught earlier. Leads the OCT and glaucoma monitoring service.' },
  { photo: 't2', name: 'Dr Sam Reyes', role: 'Optometrist, dry eye lead', bio: 'Runs the Thursday dry eye clinic and most of our adult exams. Spends his weekends restoring old cameras and has opinions about lens coatings.' },
  { photo: 't3', name: 'Dr Mira Haddad', role: 'Optometrist, children and myopia', bio: 'Sees most of our younger patients and runs the myopia management programme. Keeps a drawer of stickers that has never once run out.' },
  { photo: 't4', name: 'Jonah Pell', role: 'Dispensing optician', bio: 'Measures, fits and adjusts every pair that leaves the building, and teaches new contact lens wearers. Can tell your frame size from across the room.' },
];

export const transit = {
  walk: { label: 'On foot', time: '5 min from Larkfield station', text: 'Leave the station by the market exit, walk down Fernhill Road past the covered market, and we are on the left opposite the clock.' },
  bus: { label: 'Bus', time: 'Routes 12 and 40', text: 'Get off at Market Quarter. The stop is directly outside the covered market, about 40 metres from our door.' },
  bike: { label: 'Bike', time: 'Racks outside', text: 'There are four bike stands outside the practice and more under the market canopy. The Larkfield river path ends two streets away.' },
  car: { label: 'Car', time: 'Market car park', text: 'The Market Street car park is two minutes away. The first hour is free on Saturdays. Two blue badge bays are on Fernhill Road itself.' },
};

export const gallery = [
  { photo: 'store', caption: 'Browsing the frame wall' },
  { photo: 'exam', caption: 'The phoropter, for the "one or two" part' },
  { photo: 'f7', caption: 'A browline from the current collection' },
  { photo: 'sun', caption: 'Prescription sunglasses, polarised' },
  { photo: 'f3', caption: 'Thin titanium rims on the fitting bench' },
  { photo: 'contacts', caption: 'Retinal and corneal imaging' },
];

export const quick = [
  { title: 'Call us', text: 'Monday to Saturday during opening hours. Thursday lines are open until 8pm.' },
  { title: 'Email us', text: 'We reply within one working day. Send a photo if your question is about a broken frame.' },
  { title: 'Walk in', text: 'Repairs, adjustments and collections need no appointment. Exams do.' },
];

export const after = [
  { title: 'Same day: your prescription', text: 'You leave with a printed copy of your prescription and a short summary of what we found. If we took OCT or retinal images, we can email them to you that evening so you have your own record to compare next time.' },
  { title: 'Days 1 to 7: your glasses are made', text: 'Lenses are ordered the same afternoon. Single vision lenses usually arrive in three to five working days and varifocals or thin lenses in five to seven. We edge and glaze them in our own workshop and check every pair against your prescription before we text you.' },
  { title: 'Collection: a proper fitting', text: 'Collections take about fifteen minutes. We warm and shape the arms, set the nose pads and check that the optical centres line up with your pupils. For varifocals we check the reading zone with a book and a phone before you leave.' },
  { title: 'Weeks 2 to 8: aftercare', text: 'Most new prescriptions settle within a week or two. If anything still feels off, come back. Prescription rechecks within 30 days and varifocal adjustments within 60 days are free, and adjustments are free for as long as you own the frame.' },
];

export const access = [
  { title: 'Step-free and ground floor', text: 'A level entrance from Fernhill Road, a wide front door and both consulting rooms, the fitting bench and the accessible toilet on the ground floor.' },
  { title: 'Hearing and sight support', text: 'A hearing loop at the front desk and in room one. Large-print prescriptions and price lists on request, and we will read anything out for you.' },
  { title: 'Longer appointments', text: 'If you would like more time, for example for a relative living with dementia or a child who needs breaks, ask for a double slot at no extra cost.' },
  { title: 'Ways to pay', text: 'Cards, contactless, health savings and flexible spending cards. We give itemised receipts so you can claim from your vision insurance.' },
  { title: 'Spreading the cost', text: 'Care plans spread exam costs across the year. For glasses over $300 we can split the payment across three months with no interest.' },
  { title: 'Home visits', text: 'For patients who cannot leave home, Dr Okafor runs home visits on the first Friday of each month. Call us to check whether you qualify.' },
];
