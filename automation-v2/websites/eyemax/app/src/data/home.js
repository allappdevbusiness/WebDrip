// Home page content.
export const heroLines = ['See well.', 'Look like', 'yourself.'];

export const intro = {
  title: 'An independent optician on Fernhill Road',
  body: [
    'EyeMax is a small practice with two consulting rooms, a fitting bench by the window and a workshop at the back where lenses are edged and frames are adjusted. You see the same optometrist each year, so the person checking your eyes already knows what they looked like last time.',
    'We test eyes properly, which takes longer than the high-street quarter hour. Every adult exam includes a retinal photograph, and our complete exam adds a 3D OCT scan of the layers at the back of the eye. That is how early glaucoma and macular changes are found before you notice anything.',
    'Then we help you choose glasses that suit your face and your day. No commission on frames, no pressure to upgrade lenses you do not need, and every pair is adjusted on your face before you leave.',
  ],
  stats: [
    { value: 45, suffix: ' min', label: 'Average complete exam' },
    { value: 600, suffix: '+', label: 'Frames on the wall' },
    { value: 12, suffix: ' yrs', label: 'Seeing patients on Fernhill Road' },
    { value: 98, suffix: '%', label: 'Patients who rebook' },
  ],
};

export const services = [
  { icon: 'eye', title: 'Eye exams', text: 'Essential and complete exams, with retinal photos as standard and an OCT scan when you want the full picture.', href: './services.html#exams' },
  { icon: 'frame', title: 'Glasses', text: 'Over 600 frames from small independent makers, fitted by hand and finished with lenses edged in our own workshop.', href: './services.html#calculator' },
  { icon: 'drop', title: 'Contact lenses', text: 'Fittings for first-time wearers, a proper teach session and two aftercare checks included in the first three months.', href: './services.html#contacts' },
  { icon: 'star', title: "Kids' eyes", text: 'Unhurried exams for children, myopia management lenses and free damage cover on every child’s pair for a year.', href: './services.html#kids' },
  { icon: 'sun', title: 'Sunglasses', text: 'Prescription and plain sunglasses with UV400 lenses, polarised for driving glare and water, single vision or varifocal.', href: './services.html#lenses' },
  { icon: 'tool', title: 'Repairs', text: 'Walk in for screws, nose pads and adjustments. Free for our patients, a small fee for frames bought elsewhere.', href: './services.html#repairs' },
];

export const frames = [
  { id: 'f1', name: 'Arden', shape: 'rectangle', material: 'acetate', size: 'medium', price: 149, colour: 'Black and crystal', fit: '52-18-145', note: 'A steady everyday frame with a slightly rounded top line.' },
  { id: 'f2', name: 'Cobble', shape: 'round', material: 'acetate', size: 'small', price: 139, colour: 'Warm tortoise', fit: '47-21-140', note: 'Soft round lenses and a keyhole bridge that sits low on the nose.' },
  { id: 'f3', name: 'Lindley', shape: 'round', material: 'titanium', size: 'medium', price: 219, colour: 'Brushed gold', fit: '49-20-145', note: 'Thin titanium rims that weigh almost nothing. Good for sensitive skin.' },
  { id: 'f4', name: 'Pell', shape: 'round', material: 'titanium', size: 'small', price: 209, colour: 'Matte black wire', fit: '45-22-140', note: 'A fine wire frame for smaller faces and lighter prescriptions.' },
  { id: 'f5', name: 'Harrow', shape: 'square', material: 'acetate', size: 'large', price: 169, colour: 'Dark tortoise', fit: '54-19-145', note: 'A thicker front with real presence. Takes high prescriptions well.' },
  { id: 'f6', name: 'Marlo Sun', shape: 'aviator', material: 'metal', size: 'medium', price: 189, colour: 'Gold with amber lenses', fit: '55-17-145', note: 'A teardrop sunglass with UV400 lenses. Can be glazed to prescription.' },
  { id: 'f7', name: 'Quill', shape: 'browline', material: 'mixed', size: 'medium', price: 179, colour: 'Tortoise brow, silver rim', fit: '50-21-145', note: 'An acetate brow over a metal rim. Reads as smart without trying.' },
];

export const quiz = [
  {
    q: 'What does your face look like from the front?',
    options: [
      { label: 'Wider at the cheeks, soft jaw', tags: ['rectangle', 'square'] },
      { label: 'Longer than it is wide', tags: ['round', 'aviator'] },
      { label: 'Strong jaw and forehead', tags: ['round', 'browline'] },
      { label: 'Not sure, it is fairly even', tags: ['browline', 'rectangle'] },
    ],
  },
  {
    q: 'How do you want your glasses to feel?',
    options: [
      { label: 'Light enough to forget about', tags: ['titanium'] },
      { label: 'Bold, part of my look', tags: ['acetate'] },
      { label: 'Somewhere in between', tags: ['mixed'] },
    ],
  },
  {
    q: 'Where will you wear them most?',
    options: [
      { label: 'At a screen all day', tags: ['rectangle', 'acetate'] },
      { label: 'Outdoors and driving', tags: ['aviator', 'metal'] },
      { label: 'Reading and close work', tags: ['round', 'titanium'] },
      { label: 'Everywhere, all the time', tags: ['browline', 'mixed'] },
    ],
  },
];

export const glare = {
  title: 'What an anti-reflective coating actually changes',
  body: 'Uncoated lenses reflect around eight percent of the light that hits them. That shows up as white flashes from screens and headlights, and as a mirror over your eyes in photos and video calls. A good multi-layer coating cuts that reflection to under one percent. Drag the handle to compare the same view with and without it.',
  points: [
    'Fewer halos around headlights and street lamps when driving at night',
    'Your eyes stay visible on video calls instead of two bright rectangles',
    'Thinner high-index lenses need it most, because they reflect more',
    'Our coatings include a hard scratch layer and an easy-clean top coat',
  ],
};

export const spotlight = {
  title: 'Fitted on your face, not on a chart',
  body: [
    'Most glasses are measured once and never touched again. At EyeMax the person who measured you is the person who hands them over, and the fitting takes as long as it needs.',
    'We warm acetate arms and shape them around the ear, set nose pads so the lens centres line up with your pupils, and check the angle of the front so varifocal zones land where your eyes actually look. Come back whenever they slip. Adjustments are free for as long as you own the frame.',
  ],
};

export const journey = [
  { title: 'Book a time that suits', text: 'Choose an essential or complete exam online or by phone. Thursday evenings and Saturday mornings go first, so book a week ahead if you can.' },
  { title: 'Pre-tests with a technician', text: 'Eye pressure, a retinal photograph and, for complete exams, a 3D OCT scan. It takes about ten minutes and nothing touches your eye.' },
  { title: 'Your exam with an optometrist', text: 'We check your vision, your prescription and how your eyes work together, then go through every image with you on the screen.' },
  { title: 'Choose and fit your frames', text: 'Try on as many as you like. We measure your pupils and fitting height, then glaze the lenses in our workshop in five to seven working days.' },
];

export const reviews = [
  { photo: 'r1', name: 'Daniel, 34', role: 'First varifocals', text: 'I put off varifocals for two years because I was told they make you seasick. The fitting took twenty minutes, they set the heights twice, and I was reading menus on the walk home.' },
  { photo: 'r2', name: 'Priya, 29', role: 'Contact lens wearer', text: 'The teach session was the first time anyone actually watched me put lenses in and corrected what I was doing wrong. No more red eyes by four o’clock.' },
  { photo: 'r3', name: 'Margaret, 71', role: 'Yearly OCT patient', text: 'They compared this year’s scan with last year’s side by side and showed me exactly what they were watching. I felt looked after rather than processed.' },
  { photo: 'r4', name: 'Theo, 23', role: 'Screen-heavy job', text: 'Turns out I didn’t need blue-light anything. A small prescription and a good coating fixed the headaches. They talked me out of spending money, which was a surprise.' },
];

export const care = [
  { q: 'Clean lenses with water first, not your shirt', a: 'Dust is abrasive. Rinse both lenses under lukewarm water, add a drop of unscented washing-up liquid, rub gently with your fingertips, rinse again and dry with a clean microfibre cloth. A dry shirt corner grinds grit into the coating.' },
  { q: 'Take your glasses off with two hands', a: 'Pulling them off one-handed twists the front and loosens the hinges over time. Two hands keep the arms parallel and the fit you paid for stays put for much longer.' },
  { q: 'Never leave them on the dashboard', a: 'A car in sunshine can reach over 60°C inside. Acetate softens and loses its shape, and anti-reflective coatings can craze into a fine web of cracks. Keep them in the case, in the glovebox or your bag.' },
  { q: 'Do not park them on top of your head', a: 'It stretches the arms outwards so the frame slides down your nose afterwards. If they already slip, bring them in and we will reshape them for free.' },
  { q: 'Follow the 20-20-20 rule at a screen', a: 'Every 20 minutes, look at something about 20 feet away for 20 seconds. Your blink rate drops from around 20 a minute to 6 or 7 while you concentrate on a screen, which is what makes eyes feel dry and tired.' },
  { q: 'Replace contact lens cases every month', a: 'Cases grow a biofilm that solution alone does not remove. Rinse with fresh solution, never tap water, leave it upside down to air dry and swap it for a new one each time you open a new bottle.' },
];

export const visit = {
  title: 'Find us on Fernhill Road',
  body: 'Five minutes from Larkfield station, opposite the covered market. Step-free entrance, a hearing loop at the front desk and two consulting rooms on the ground floor.',
};
