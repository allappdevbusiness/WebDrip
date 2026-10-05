import { useEffect, useRef, useState } from 'react';
import { brand, nav } from '../data.js';
import { startChrome } from '../effects.js';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const barRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => startChrome(navRef.current, barRef.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header id="nav" ref={navRef} className="wd-nav fixed inset-x-0 top-0 z-50">
      <div className="wd-nav-inner mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 md:px-8">
        <a href="#top" className="wd-logo flex items-center gap-2.5" aria-label="Marlowick, back to top">
          <span className="wd-logo-mark" aria-hidden="true">M</span>
          <span className="wd-logo-word">{brand.name}</span>
        </a>
        <nav aria-label="Main" className="wd-nav-links hidden items-center gap-8 md:flex">
          {nav.map((l) => (
            <a key={l.href} href={l.href} className="wd-link">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#visit" className="wd-btn wd-btn-primary wd-nav-cta hidden md:inline-flex">
          Book a fitting
        </a>
        <button
          id="burger"
          ref={burgerRef}
          type="button"
          className={`wd-burger md:hidden ${open ? 'wd-burger-open' : ''}`}
          aria-expanded={open}
          aria-controls="mobileMenu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div
        id="mobileMenu"
        className={`wd-menu md:hidden ${open ? 'wd-menu-open' : ''}`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="flex flex-col px-5 pb-6 pt-2">
          {nav.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              className="wd-menu-link"
              style={{ '--i': i }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a href="#visit" tabIndex={open ? 0 : -1} className="wd-btn wd-btn-primary mt-4 justify-center" onClick={() => setOpen(false)}>
            Book a fitting
          </a>
        </nav>
      </div>
      <div className="wd-progress" aria-hidden="true">
        <span ref={barRef} />
      </div>
    </header>
  );
}
