import { brand, credits, nav } from '../data.js';

export default function Footer() {
  return (
    <footer className="wd-footer">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 py-14 text-center">
        <a href="#top" className="wd-logo flex items-center gap-2.5">
          <span className="wd-logo-mark" aria-hidden="true">M</span>
          <span className="wd-logo-word">{brand.name}</span>
        </a>
        <p className="wd-body">{brand.tagline}</p>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-6">
          {nav.map((l) => (
            <a key={l.href} href={l.href} className="wd-link">{l.label}</a>
          ))}
        </nav>
        <ul className="wd-credits">
          {credits.map((c) => (
            <li key={c.name}>
              Photo by{' '}
              <a href={c.profile} target="_blank" rel="noopener noreferrer">{c.name}</a> on{' '}
              <a href="https://unsplash.com/?utm_source=webdrip_concept&utm_medium=referral" target="_blank" rel="noopener noreferrer">Unsplash</a>
            </li>
          ))}
        </ul>
        <p className="wd-concept">
          <a href="https://getwebdrip.com" target="_blank" rel="noopener">Concept design by WebDrip — fictional brand</a>
        </p>
      </div>
    </footer>
  );
}
