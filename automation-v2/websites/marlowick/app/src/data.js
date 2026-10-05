// All page copy, prices and image choices live here.
import { photos } from './photos.js';

export { photos };

export const brand = {
  name: 'Marlowick',
  tagline: 'Sharp suits, fitted properly.',
  kicker: 'Menswear · Suits · Formal hire',
  intro:
    'Suits, dinner suits, shirts and ties to buy or hire. Every piece is fitted on you in the shop before it goes home.',
};

export const nav = [
  { href: '#suits', label: 'Suits' },
  { href: '#hire', label: 'Hire' },
  { href: '#fittings', label: 'Fittings' },
  { href: '#visit', label: 'Visit' },
];

export const heroTags = [
  { label: 'Navy two-piece', price: 'from $420', speed: 1.35, pos: 'wd-tag-a' },
  { label: 'Dinner suit hire', price: '$120 a weekend', speed: 0.7, pos: 'wd-tag-b' },
  { label: 'Fitting included', price: 'with every suit', speed: 1.1, pos: 'wd-tag-c' },
];

export const suits = {
  kicker: '01 — The rail',
  title: 'A suit for every day you need one.',
  copy: 'Six things most men come in for. Each suit price includes a fitting and simple alterations.',
  items: [
    {
      title: 'The Navy Two-Piece',
      text: 'Half-canvas wool in a mid navy. Right for the office, interviews and most weddings.',
      price: 420,
      unit: 'from',
      img: photos.navy,
      alt: 'A man in a navy suit and glasses standing against a white wall',
    },
    {
      title: 'The Grey Three-Piece',
      text: 'Soft grey flannel with a matching waistcoat, for colder months and more formal days.',
      price: 560,
      unit: 'from',
      img: photos.grey,
      alt: 'A grey three-piece suit with a white bow tie and a buttonhole flower',
    },
    {
      title: 'The Check Suit',
      text: 'A quiet blue and grey check for when plain navy feels too safe.',
      price: 480,
      unit: 'from',
      img: photos.check,
      alt: 'A man in a checked three-piece suit adjusting his tie',
    },
    {
      title: 'The Dinner Suit',
      text: 'Black wool with satin lapels, ready for black-tie dinners and evening weddings.',
      price: 640,
      unit: 'from',
      img: photos.dinner,
      alt: 'A man in a black waistcoat fastening a black bow tie',
    },
    {
      title: 'Dress Shirts',
      text: 'Cotton poplin and twill in white, sky blue and pale lilac. Collar sizes 14 to 18.',
      price: 75,
      unit: 'each',
      img: photos.shirt,
      alt: 'A white shirt collar with a lilac knitted tie',
    },
    {
      title: 'Ties & Pocket Squares',
      text: 'Silk and wool ties, with pocket squares cut to go with them.',
      price: 45,
      unit: 'from',
      img: photos.tie,
      alt: 'A dark blue shirt with a bright red silk tie',
    },
  ],
};

export const spotlight = {
  kicker: 'The fitting',
  title: 'Every suit is fitted before it leaves the shop.',
  copy:
    'You stand in front of the mirror while a fitter pins the sleeves, the waist and the trouser length. Simple changes are ready to collect in 3 to 5 days.',
  img: photos.spot,
  alt: 'A fitter adjusting the lapel of a grey suit jacket',
};

export const hire = {
  kicker: '02 — Wedding & event hire',
  title: 'Hire the suit. Skip the scramble.',
  copy: 'Pick it up on Thursday, wear it all weekend, bring it back on Monday. Shirt and tie are part of the price.',
  img: photos.groom,
  imgAlt: 'A smiling groom in a blue suit outdoors',
  plans: [
    {
      name: 'Single hire',
      price: 95,
      per: 'per weekend',
      text: 'One suit for a wedding, a party or an interview.',
      points: ['Navy, grey or check suit', 'Shirt and tie included', 'One fitting appointment'],
    },
    {
      name: 'Black tie',
      price: 120,
      per: 'per weekend',
      text: 'Everything you need for a black-tie invitation.',
      points: ['Dinner suit with satin lapels', 'Dress shirt and silk bow tie', 'Cummerbund and studs'],
      featured: true,
    },
    {
      name: "Groom's party",
      price: 85,
      per: 'per person',
      text: 'Matching suits for a group of four or more.',
      points: ['One group fitting day', 'Matching ties for the party', "The groom's suit is free with six or more"],
    },
  ],
};

export const fittings = {
  kicker: '03 — How a fitting works',
  title: 'About 45 minutes, start to finish.',
  copy: 'Book a time, come in as you are, and leave with everything measured and pinned.',
  steps: [
    { time: '0 min', title: 'Tell us the occasion', text: 'A wedding, a new job, a black-tie dinner. It decides what we bring out first.' },
    { time: '5 min', title: 'Try on two or three sizes', text: 'We start with the jacket, because the shoulders are the one thing that can’t be changed later.' },
    { time: '20 min', title: 'Pin and chalk', text: 'Sleeves, waist and trouser length are marked while you stand at the mirror.' },
    { time: '35 min', title: 'Pick the shirt and tie', text: 'We lay out a few options next to the cloth so you can see them together.' },
    { time: '3–5 days', title: 'Collect it ready to wear', text: 'Come back for a final try-on. If anything feels off, we fix it there and then.' },
  ],
  stats: [
    { value: 45, suffix: ' min', label: 'for a full fitting' },
    { value: 5, prefix: '3–', suffix: ' days', label: 'for simple alterations' },
    { value: 18, prefix: '14–', suffix: '', label: 'collar sizes in stock' },
  ],
};

export const visit = {
  kicker: '04 — Visit',
  title: 'Book a fitting.',
  copy: 'Tell us when you’d like to come in and what it’s for. We’ll reply by email to confirm the time.',
  occasions: ['A wedding', 'Black tie', 'Work or interview', 'Something else'],
  hours: [
    ['Mon – Fri', '10:00 – 19:00'],
    ['Saturday', '9:00 – 18:00'],
    ['Sunday', 'Closed'],
  ],
  portraits: [
    { img: photos.p1, alt: 'A buttonhole flower being pinned to a lapel', cls: 'wd-float-a', speed: 0.9 },
    { img: photos.p2, alt: 'A young man in a tuxedo having his tie adjusted', cls: 'wd-float-b', speed: 1.3 },
    { img: photos.p3, alt: 'A navy suit jacket with a white buttonhole flower', cls: 'wd-float-c', speed: 0.6 },
    { img: photos.jacket, alt: 'Tweed and linen jackets on a copper rail', cls: 'wd-float-d', speed: 1.15 },
  ],
};

export const credits = Object.values(photos).filter((p, i, a) => a.findIndex((q) => q.name === p.name) === i);

// Image URLs the service worker precaches.
export const imageUrls = Object.values(photos).map((p) => p.src);
