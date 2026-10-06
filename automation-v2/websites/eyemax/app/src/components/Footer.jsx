import { brand, nav, hours, fmtHour, marqueeWords } from '../data/site.js';
import { photos } from '../data/photos.js';
import { Logo } from './ui.jsx';
import Newsletter from '../widgets/Newsletter.jsx';

function Marquee() {
  const row = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {marqueeWords.map((w) => (
        <li key={w} className="flex items-center font-display text-2xl md:text-4xl font-bold whitespace-nowrap px-6">
          {w}
          <svg viewBox="0 0 64 40" className="w-10 h-6 ml-12" aria-hidden="true" fill="none" strokeWidth="5"><circle cx="18" cy="20" r="13" stroke="#fff" /><circle cx="46" cy="20" r="13" stroke="#F0705A" /></svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="wd-marquee overflow-hidden bg-teal text-white py-5" data-anim="marquee">
      <div className="wd-marquee-track">{row(false)}{row(true)}</div>
    </div>
  );
}

export default function Footer({ credits }) {
  const used = [...new Set(credits)].map((k) => photos[k]);
  const people = [];
  used.forEach((p) => {
    if (!people.find((x) => x.name === p.name)) people.push(p);
  });
  return (
    <footer className="relative z-10 bg-mint overflow-hidden">
      <Marquee />
      <div className="wd-blob w-[420px] h-[420px] -right-40 top-24 bg-[radial-gradient(circle,rgba(240,112,90,0.28),rgba(240,112,90,0)_70%)]" data-anim="float-blob" aria-hidden="true" />
      <div className="wd-wrap relative py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4" data-reveal data-anim="fade-up">
          <a href="./index.html" className="flex items-center gap-2.5 text-ink">
            <Logo className="w-12 h-9" />
            <span className="font-display text-3xl font-extrabold">EyeMax</span>
          </a>
          <p className="mt-4 text-muted max-w-xs">{brand.tagline} An independent optician and eyewear studio in Larkfield Market Quarter.</p>
          <address className="not-italic mt-5 leading-relaxed">
            {brand.address.map((l) => <span key={l} className="block">{l}</span>)}
            <a className="wd-link font-semibold" href={brand.phoneHref}>{brand.phone}</a><br />
            <a className="wd-link font-semibold" href={`mailto:${brand.email}`}>{brand.email}</a>
          </address>
        </div>
        <div className="md:col-span-2" data-reveal data-anim="fade-up" style={{ '--d': 100 }}>
          <h2 className="font-display text-xl mb-3">Pages</h2>
          <ul className="space-y-1">
            {nav.map((l) => (
              <li key={l.page}><a className="wd-link inline-flex min-h-11 items-center font-semibold" href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3" data-reveal data-anim="fade-up" style={{ '--d': 200 }}>
          <h2 className="font-display text-xl mb-3">Opening hours</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.95rem]">
            {hours.map((h) => (
              <div key={h.label} className="contents">
                <dt className="font-semibold">{h.label}</dt>
                <dd className="text-muted">{h.open == null ? 'Closed' : `${fmtHour(h.open)} to ${fmtHour(h.close)}`}{h.note && h.open != null ? ` (${h.note.toLowerCase()})` : ''}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="md:col-span-3" data-reveal data-anim="fade-up" style={{ '--d': 300 }}>
          <Newsletter />
        </div>
      </div>
      <div className="wd-wrap relative border-t border-teal/15 py-8 text-sm text-muted space-y-3">
        <p>
          Photos on this page from Unsplash:{' '}
          {people.map((p, i) => (
            <span key={p.name}>
              Photo by <a className="underline hover:text-teal" href={p.user} rel="noopener">{p.name}</a> on{' '}
              <a className="underline hover:text-teal" href="https://unsplash.com/?utm_source=webdrip_eyemax&utm_medium=referral" rel="noopener">Unsplash</a>
              {i < people.length - 1 ? '; ' : '.'}
            </span>
          ))}
        </p>
        <p>EyeMax is a fictional brand. Reviews are sample reviews, figures are sample figures and the people named are invented. Team photos are illustrative.</p>
        <p className="flex flex-wrap justify-between gap-3">
          <span>&copy; 2026 EyeMax concept site</span>
          <a className="font-semibold text-ink underline hover:text-teal" href="https://getwebdrip.com">Concept design by WebDrip — fictional brand</a>
        </p>
      </div>
    </footer>
  );
}
