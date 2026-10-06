// Services page content (exams, prices, lenses, policies, FAQ). Prices are sample figures for a fictional practice.
export const header = {
  title: 'Exams, lenses and what they cost',
  intro: 'Every price is on this page, including the ones most opticians keep behind the counter. If something is not listed here, ask and we will tell you before you commit to anything.',
};

export const exams = [
  { name: 'Essential eye exam', price: 95, time: '30 min', for: 'Adults with healthy eyes and no new symptoms', includes: ['Vision and prescription check', 'Eye pressure test', 'Retinal photograph', 'Binocular vision check', 'Written prescription to take anywhere'] },
  { name: 'Complete eye exam', price: 145, time: '45 min', for: 'Over 40s, a family history of glaucoma, diabetes, or anyone who wants the full picture', includes: ['Everything in the essential exam', '3D OCT scan of the retina and optic nerve', 'Visual field test', 'Side-by-side comparison with last year', 'Copy of your scans by email'], featured: true },
  { name: "Kids' eye exam", price: 65, time: '30 min', for: 'Children aged 3 to 16, with a parent in the room', includes: ['Picture and letter charts by age', 'Focusing and eye-team checks', 'Myopia risk assessment', 'Follow-up in 6 or 12 months', 'Free if you buy their glasses here'] },
  { name: 'Contact lens fitting', price: 85, time: '40 min + teach', for: 'New wearers, or anyone switching lens type', includes: ['Corneal measurements', 'Trial lenses to take home', 'One-to-one teach session', 'Two aftercare checks in 3 months', 'Fee credited to your first supply'] },
  { name: 'Dry eye assessment', price: 75, time: '40 min', for: 'Gritty, burning or watery eyes that do not settle', includes: ['Tear film break-up test', 'Meibomian gland imaging', 'Lid and lash check', 'A written home-care routine', 'Review visit at 6 weeks'] },
  { name: 'Contact lens check', price: 45, time: '20 min', for: 'Existing wearers who need their yearly review', includes: ['Fit and comfort check', 'Corneal health check', 'Updated lens prescription', 'Advice on solutions and cases'] },
];

export const plans = [
  { name: 'Essentials', monthly: 9, yearly: 96, text: 'For adults with healthy eyes who want one tidy payment.', perks: ['One essential exam a year', '15% off glasses and sunglasses', 'Free repairs and adjustments', 'Free replacement nose pads and screws'] },
  { name: 'Complete', monthly: 16, yearly: 168, text: 'For anyone over 40, or anyone who wants the OCT scan every year.', perks: ['One complete exam with OCT a year', '20% off glasses and sunglasses', 'Free accidental damage cover on one pair', 'Priority Thursday evening slots', 'Free repairs and adjustments'], featured: true },
  { name: 'Family', monthly: 29, yearly: 299, text: 'Up to two adults and three children at the same address.', perks: ['Exams for everyone, kids every 6 months', '20% off every pair in the house', 'Free damage cover on all kids’ glasses', 'Free repairs and adjustments'] },
];

export const steps = [
  { title: 'Questions first', time: '5 min', text: 'We ask about headaches, screens, driving, hobbies, medicines and family eye history. It sounds like small talk, but it decides which tests matter most for you.' },
  { title: 'Pre-tests', time: '10 min', text: 'A technician measures your eye pressure with a gentle puff of air or a light touch tonometer, takes a retinal photograph and, for complete exams, runs the OCT scan.' },
  { title: 'Vision and prescription', time: '10 min', text: 'Letter charts at distance and near, then the classic "one or two" with the phoropter until the lenses are as sharp as they can be.' },
  { title: 'How your eyes work together', time: '5 min', text: 'Focusing, eye alignment and how well your eyes converge for reading. This is where many screen headaches turn out to come from.' },
  { title: 'Eye health', time: '10 min', text: 'A slit lamp look at the front of the eye, then the retina and optic nerve. We put your images on the big screen and talk you through them.' },
  { title: 'Your plan', time: '5 min', text: 'A plain explanation of what we found, your written prescription, and when we would like to see you again. No sales pitch at the end.' },
];

export const calc = {
  frames: [
    { id: 'studio', label: 'Studio acetate', price: 129 },
    { id: 'titanium', label: 'Titanium line', price: 219 },
    { id: 'atelier', label: 'Atelier handmade', price: 289 },
    { id: 'own', label: 'My own frame', price: 0 },
  ],
  lenses: [
    { id: 'single', label: 'Single vision', price: 89 },
    { id: 'office', label: 'Office / reading', price: 129 },
    { id: 'vari', label: 'Varifocal standard', price: 249 },
    { id: 'tailored', label: 'Varifocal tailored', price: 389 },
  ],
  materials: [
    { id: 'std', label: 'Standard 1.5', price: 0 },
    { id: 'poly', label: 'Polycarbonate', price: 39 },
    { id: 'thin', label: 'Thin 1.6', price: 49 },
    { id: 'ultra', label: 'Ultra-thin 1.67', price: 99 },
  ],
  extras: [
    { id: 'ar', label: 'Anti-reflective coating', price: 45 },
    { id: 'blue', label: 'Blue-light filter', price: 40 },
    { id: 'photo', label: 'Light-reactive (photochromic)', price: 89 },
    { id: 'sun', label: 'Polarised sun tint', price: 75 },
  ],
};

export const lensTypes = [
  { id: 'single', name: 'Single vision', best: 'One distance: driving, TV or reading only', zones: 'One', adapt: 'A day or two', from: '$89', guarantee: '30-day remake', tags: ['driving', 'price'] },
  { id: 'office', name: 'Office', best: 'Desk, laptop and meeting room in one lens', zones: 'Near and middle', adapt: 'Under a week', from: '$129', guarantee: '30-day remake', tags: ['screens', 'reading'] },
  { id: 'vari', name: 'Varifocal standard', best: 'Everyday all-distance wear', zones: 'Far, middle and near', adapt: '1 to 2 weeks', from: '$249', guarantee: '60-day non-adapt', tags: ['driving', 'reading'] },
  { id: 'tailored', name: 'Varifocal tailored', best: 'Wider zones designed from your fitting measurements', zones: 'Far, middle and near, wider', adapt: 'Often within days', from: '$389', guarantee: '60-day non-adapt', tags: ['screens', 'driving', 'reading'] },
];

export const priorities = [
  { id: 'driving', label: 'Driving' },
  { id: 'screens', label: 'Screens' },
  { id: 'reading', label: 'Reading' },
  { id: 'price', label: 'Lowest price' },
];

export const materials = [
  { title: 'Standard 1.5 plastic', text: 'Clear optics and the lowest price. Best for low prescriptions up to about ±2.00.' },
  { title: 'Polycarbonate', text: 'Very impact-resistant, so it is our default for children, sport and rimless frames.' },
  { title: 'Thin 1.6', text: 'About 20 percent thinner than standard. A sensible upgrade from ±2.50 or so.' },
  { title: 'Ultra-thin 1.67', text: 'For stronger prescriptions. Keeps the edge of the lens from showing past the frame.' },
  { title: 'Anti-reflective', text: 'Cuts reflections from about 8 percent to under 1. Includes scratch and easy-clean layers.' },
  { title: 'Light-reactive', text: 'Clear indoors, darkens outside in UV. Note that most car windscreens block the UV that triggers it.' },
  { title: 'Polarised', text: 'Blocks glare bouncing off water and wet roads. Ideal for driving sunglasses and fishing.' },
  { title: 'Blue-light filter', text: 'A faint tint that filters some blue light. Helpful for some people, not a fix for eye strain on its own.' },
];

export const contacts = {
  title: 'Contact lenses, taught properly',
  body: 'A fitting starts with measurements of the curve and size of your cornea and your pupil size in different light. We choose a trial lens, check how it moves on the eye, and send you home with trial lenses for one to two weeks. Before you leave, you will put them in and take them out yourself, more than once, with someone watching.',
  points: ['Daily disposables, monthlies and toric lenses for astigmatism', 'Multifocal contact lenses for reading without glasses', 'Aftercare checks at 1 week and 4 to 6 weeks', 'Lens supply by post every 3 months, cancel any time'],
};

export const kids = {
  title: "Kids' eyes",
  body: 'Children rarely complain that they cannot see, because they assume everyone sees the same way. We test from age three with pictures and shapes, and from about seven with letters. If a child is becoming short-sighted, we recommend myopia management spectacle lenses or contact lenses designed to slow the change, and a check every six months.',
  points: ['Exams free when you buy their glasses here', 'Polycarbonate lenses as standard', 'Free damage cover for one year', 'Spare pair at half price'],
};

export const dry = {
  title: 'Dry eye clinic',
  body: 'Dry, gritty or watery eyes are often caused by blocked oil glands along the eyelid rather than a lack of tears. We image the glands, measure how quickly your tear film breaks up and build a routine around warm compresses, lid hygiene and the right drops. Thursday is our dry eye clinic day.',
  points: ['Heated eye mask: $39', 'Lid hygiene kit: $18', 'In-clinic gland expression: $95', 'Review visit at 6 weeks included'],
};

export const repairs = [
  { title: 'Free for our patients', text: 'Adjustments, screw replacement, new nose pads and ultrasonic cleaning, for as long as you own a frame from us. No appointment needed.' },
  { title: 'Frames from elsewhere', text: 'We adjust any frame for free. New screws or nose pads are $10, hinge repairs from $25. Some soldered metal repairs go to a specialist and take a week.' },
  { title: 'Reglazing your own frame', text: 'Bring a frame you love and we will fit new lenses into it. We check it first and tell you honestly if it will survive the glazing.' },
];

export const policies = [
  { title: '60-day varifocal guarantee', text: 'Wear new varifocals for at least two weeks. If you still cannot get on with them within 60 days, we remake them in a different design or switch them to single vision lenses at no charge.' },
  { title: '30-day prescription check', text: 'If anything about a new prescription feels wrong, come back within 30 days and we will recheck your eyes for free and remake the lenses if needed.' },
  { title: '12-month frame warranty', text: 'Manufacturing faults in frames, such as broken hinges or peeling plating, are covered for a year. Accidental damage is covered on care plans.' },
  { title: 'Cancelling an appointment', text: 'Please give us 24 hours’ notice so we can offer the time to someone else. A second missed appointment without notice carries a $25 fee.' },
  { title: 'Running late', text: 'We can usually still see you if you are up to 10 minutes late. After that we will offer the next free slot, often the same day.' },
  { title: 'Your prescription is yours', text: 'You always leave with a written copy. There is no obligation to buy glasses or lenses from us.' },
];

export const faq = [
  { q: 'How often should I have an eye exam?', a: 'Every one to two years for most adults with healthy eyes. Once a year if you are over 65, have diabetes or a family history of glaucoma, or wear contact lenses. Children who are becoming short-sighted should be seen every six months.' },
  { q: 'What is an OCT scan and do I need one?', a: 'Optical coherence tomography takes a cross-section image of the retina and optic nerve, a bit like an ultrasound with light. It shows changes from glaucoma and macular degeneration years before they affect your sight. We recommend it for everyone over 40 and anyone with a family history.' },
  { q: 'Will my eyes be dilated?', a: 'Not usually. Our retinal camera and OCT work through a normal pupil. If we need to dilate, for example to check a floater or flash, we will tell you first. Your vision will be blurry for a few hours and you should not drive.' },
  { q: 'Does the puff of air test hurt?', a: 'No. It is a gentle puff that surprises people more than it hurts. If you really dislike it, we can measure pressure with a light-touch tonometer instead.' },
  { q: 'Can I bring my own frames?', a: 'Yes. We will check the frame is in good enough condition for new lenses and quote you for the lenses only. Adjustments are free.' },
  { q: 'How long do glasses take?', a: 'Single vision lenses usually take three to five working days. Varifocals, thin lenses and tints take five to seven. We text you when they are ready to collect and fit.' },
  { q: 'Is blue-light filtering worth it?', a: 'For most people, no. Screen tiredness usually comes from blinking less and focusing up close for hours. An up-to-date prescription, a good anti-reflective coating and regular breaks help more. We will tell you honestly if we think it is worth adding.' },
  { q: 'Why are varifocals so expensive?', a: 'Each lens contains a smooth change of power from distance at the top to reading at the bottom, cut to your measurements. Tailored designs are calculated from how your frame sits on your face, which widens the clear zones.' },
  { q: 'What if I cannot get used to my varifocals?', a: 'Give them two weeks of full-time wear. If they still do not work within 60 days, we will adjust, remake them in a different design or change them to single vision lenses without charge.' },
  { q: 'Can I get contact lenses if I have astigmatism?', a: 'Yes. Toric soft lenses correct most astigmatism and come as daily disposables or monthlies. We will try them on your eyes before you commit.' },
  { q: 'At what age should my child have their first eye test?', a: 'We see children from age three, or earlier if you notice a turn in the eye, squinting or sitting very close to the TV. Children do not need to know their letters.' },
  { q: 'Do you accept vision insurance and health savings cards?', a: 'We accept most health savings and flexible spending cards and give you an itemised receipt to claim from insurers. Ask us before your visit if you are unsure.' },
  { q: 'Do you do driving vision checks?', a: 'Yes. Every exam includes a check against the driving standard, and we can complete driving vision forms at the same visit for a small fee.' },
  { q: 'What happens to my data and scans?', a: 'Your records and images are stored securely and only shared with your doctor or a hospital eye service with your permission. You can ask for a copy of your scans at any time.' },
];
