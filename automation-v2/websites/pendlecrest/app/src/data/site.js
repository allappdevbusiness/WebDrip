// Shared brand facts used by the nav, footer and every page.
export const brand = {
  name: 'Pendlecrest Watch Works',
  short: 'Pendlecrest',
  tagline: 'Every second, carefully restored.',
  address: ['14 Ropewalk Yard', 'Pendle Street', 'Harrowgate Quarter, HG4 7RW'],
  phone: '01632 960 418',
  phoneHref: 'tel:+441632960418',
  email: 'bench@pendlecrest.example',
};

export const nav = [
  { href: './index.html', label: 'Workshop', key: 'home' },
  { href: './services.html', label: 'Services & prices', key: 'services' },
  { href: './book.html', label: 'Book a repair', key: 'book' },
];

// day: 0 = Sunday. Times are 24h decimals. Monday is a bench-only day (counter closed).
export const hours = [
  { day: 1, label: 'Monday', open: null, note: 'Bench day, counter closed' },
  { day: 2, label: 'Tuesday', open: 9.5, close: 17.5 },
  { day: 3, label: 'Wednesday', open: 9.5, close: 17.5 },
  { day: 4, label: 'Thursday', open: 9.5, close: 19 },
  { day: 5, label: 'Friday', open: 9.5, close: 17.5 },
  { day: 6, label: 'Saturday', open: 10, close: 16 },
  { day: 0, label: 'Sunday', open: null, note: 'Closed' },
];

export const fmtTime = (t) => {
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  return `${h}:${String(m).padStart(2, '0')}`;
};

export const hoursText = (h) => (h.open == null ? h.note : `${fmtTime(h.open)} – ${fmtTime(h.close)}`);
