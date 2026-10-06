import { useEffect, useState } from 'react';
import Nav, { LogoMark } from './Nav.jsx';
import { nav, brand, hours, hoursText } from '../data/site.js';
import { photos } from '../data/photos.js';

function Loader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1700);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;
  return (
    <div className="wd-loader text-teal" data-anim="intro-loader" aria-hidden="true">
      <svg viewBox="0 0 80 80" className="h-20 w-20">
        <circle cx="40" cy="40" r="31" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M40 40V20M40 40l12 7" stroke="#8C6A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

function Footer({ credits }) {
  const used = [...new Set(credits)].map((k) => photos[k]);
  return (
    <footer className="border-t border-silver-2 bg-frost pt-16 pb-10">
      <div className="wd-wrap grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <a href="./index.html" className="flex items-center gap-3 text-teal">
            <LogoMark className="h-11 w-11" />
            <span className="text-xl font-[740] text-ink [font-stretch:118%]">Pendlecrest Watch Works</span>
          </a>
          <p className="mt-4 max-w-sm text-slate">
            An independent bench for servicing, repairing and gently restoring mechanical and quartz watches, pocket watches and
            the occasional carriage clock.
          </p>
          <address className="mt-5 not-italic text-ink">
            {brand.address.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
            <a className="wd-link mt-2 inline-block text-teal" href={brand.phoneHref}>{brand.phone}</a>
            <br />
            <a className="wd-link text-teal" href={`mailto:${brand.email}`}>{brand.email}</a>
          </address>
        </div>
        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="wd-h3 text-base">Pages</h2>
          <ul className="mt-3 space-y-1">
            {nav.map((n) => (
              <li key={n.key}>
                <a className="wd-link inline-flex min-h-[44px] items-center text-ink" href={n.href} data-anim="underline">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <h2 className="wd-h3 text-base">Counter hours</h2>
          <ul className="mt-3 space-y-1.5 text-[0.95rem]">
            {hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4 border-b border-silver-2 pb-1.5">
                <span>{h.label}</span>
                <span className="text-slate">{hoursText(h)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <h2 className="wd-h3 text-base">Photography</h2>
          <ul className="mt-3 space-y-1 text-sm text-slate">
            {used.map((p) => (
              <li key={p.id}>
                Photo by{' '}
                <a className="wd-link text-teal" href={p.user}>{p.name}</a> on{' '}
                <a className="wd-link text-teal" href="https://unsplash.com/?utm_source=pendlecrest_concept&utm_medium=referral">Unsplash</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wd-wrap mt-12 flex flex-col gap-3 border-t border-silver pt-6 text-sm text-slate md:flex-row md:items-center md:justify-between">
        <p>
          Pendlecrest Watch Works is a fictional brand. Reviews and figures on this site are samples, and the address and
          phone number are invented.
        </p>
        <p>
          <a className="wd-link font-[600] text-teal" href="https://getwebdrip.com">Concept design by WebDrip — fictional brand</a>
        </p>
      </div>
    </footer>
  );
}

export default function Layout({ current, credits, loader = false, children }) {
  return (
    <>
      {loader ? <Loader /> : null}
      <div id="cursorGlow" data-anim="cursor-glow" aria-hidden="true" />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-teal focus:px-5 focus:py-3 focus:text-white">
        Skip to content
      </a>
      <Nav current={current} />
      <main id="main" data-anim="page-transition">{children}</main>
      <Footer credits={credits} />
    </>
  );
}
