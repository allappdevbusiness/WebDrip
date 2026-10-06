import { useEffect, useState } from 'react';
import { nav } from '../data/site.js';
import { Logo } from './ui.jsx';

export default function Nav({ page, intro = false }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header id="nav" className={`wd-nav sticky top-0 z-50 ${intro ? 'wd-intro-nav' : ''}`} data-anim="nav-shrink">
      <div id="wdProgress" className="absolute left-0 right-0 bottom-0 h-[3px] bg-coral" data-anim="scroll-progress" aria-hidden="true" />
      <div className="wd-nav-inner wd-wrap flex items-center justify-between gap-4 py-3">
        <a href="./index.html" className="flex items-center gap-2.5 no-underline text-ink" aria-label="EyeMax home">
          <Logo className="w-11 h-8" />
          <span className="font-display text-2xl font-extrabold tracking-tight">EyeMax</span>
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 font-semibold">
            {nav.map((l) => (
              <li key={l.page}>
                <a href={l.href} className="wd-link py-2" data-anim="link-underline" aria-current={l.page === page ? 'page' : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="./book.html#booking" className="wd-btn wd-btn-teal hidden md:inline-flex" data-magnetic data-anim="magnetic">Book an exam</a>
        <button
          id="burger"
          type="button"
          className="wd-burger md:hidden inline-flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white border border-teal/20 text-ink"
          aria-expanded={open}
          aria-controls="mobileMenu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
          data-anim="burger-morph"
        >
          <span /><span /><span />
        </button>
      </div>
      <div id="mobileMenu" className={`wd-menu md:hidden absolute left-0 right-0 top-full bg-paper border-b border-teal/15 shadow-xl ${open ? 'wd-open' : ''}`} data-anim="menu-slide">
        <ul className="wd-wrap py-4 flex flex-col">
          {nav.map((l) => (
            <li key={l.page}>
              <a
                href={l.href}
                className="flex items-center min-h-12 py-3 text-2xl font-display font-bold border-b border-teal/10"
                aria-current={l.page === page ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
                {l.page === page && <span className="ml-3 text-sm font-body font-semibold text-teal">You are here</span>}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <a href="./book.html#booking" className="wd-btn wd-btn-primary w-full" onClick={() => setOpen(false)}>Book an exam</a>
          </li>
        </ul>
      </div>
    </header>
  );
}
