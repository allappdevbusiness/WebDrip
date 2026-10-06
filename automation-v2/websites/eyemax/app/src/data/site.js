// Shared site data: navigation, hours, contact. EyeMax is a fictional concept brand.
export const brand = {
  name: 'EyeMax',
  tagline: 'See well. Look like yourself.',
  address: ['48 Fernhill Road', 'Larkfield Market Quarter', 'Larkfield LK4 2RD'],
  phone: '(555) 014-2290',
  phoneHref: 'tel:+15550142290',
  email: 'hello@eyemax.example',
};

export const nav = [
  { href: './index.html', label: 'Home', page: 'home' },
  { href: './services.html', label: 'Exams & lenses', page: 'services' },
  { href: './book.html', label: 'Book a visit', page: 'book' },
];

// day: 0 = Sunday. Times in 24h decimal hours.
export const hours = [
  { day: 1, label: 'Monday', open: 9, close: 18 },
  { day: 2, label: 'Tuesday', open: 9, close: 18 },
  { day: 3, label: 'Wednesday', open: 9, close: 18 },
  { day: 4, label: 'Thursday', open: 9, close: 20, note: 'Late clinic' },
  { day: 5, label: 'Friday', open: 9, close: 18 },
  { day: 6, label: 'Saturday', open: 9, close: 15 },
  { day: 0, label: 'Sunday', open: null, close: null, note: 'Closed' },
];

export const fmtHour = (h) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const suffix = hh >= 12 ? 'pm' : 'am';
  const h12 = ((hh + 11) % 12) + 1;
  return mm ? `${h12}:${String(mm).padStart(2, '0')}${suffix}` : `${h12}${suffix}`;
};

export const marqueeWords = [
  'Eye exams with an OCT scan',
  'Frames fitted by hand',
  'Free adjustments for life',
  'Kids exams every six months',
  'Contact lens teach sessions',
  'Dry eye clinic on Thursdays',
  '60-day varifocal guarantee',
];
