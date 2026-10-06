import { useEffect, useState } from 'react';
import { nav, brand } from '../data/site.js';

export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 40 40" className={`wd-logo-mark ${className}`} aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="20" y1="5.5" x2="20" y2={i % 3 === 0 ? 9.5 : 7.5} stroke="currentColor" strokeWidth={i % 3 === 0 ? 2 : 1.2} transform={`rotate(${i * 30} 20 20)`} />
      ))}
      <path d="M20 20V11.5M20 20l6 3.5" stroke="#8C6A1A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="20" r="1.8" fill="#8C6A1A" />
    </svg>
  );
}

export default function Nav({ current }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header id="nav" data-anim="nav-shrink" className="sticky top-0 z-50 bg-ivory/90 md:bg-ivory/70 md:backdrop-blur-sm border-b border-silver-2">
      <div className="wd-nav-inner wd-wrap flex h-[68px] items-center justify-between gap-4">
        <a href="./index.html" className="flex items-center gap-3 text-teal" aria-label={`${brand.name}, home`}>
          <LogoMark />
          <span className="leading-tight">
            <span className="block text-[1.05rem] font-[720] text-ink [font-stretch:118%] tracking-tight">Pendlecrest</span>
            <span className="block text-[0.78rem] text-slate [font-stretch:92%]">Watch Works</span>
          </span>
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.key}>
                <a
                  href={n.href}
                  aria-current={current === n.key ? 'page' : undefined}
                  data-anim="underline"
                  className={`inline-flex min-h-[44px] items-center rounded-full px-4 text-[0.97rem] font-[580] transition-colors ${
                    current === n.key ? 'bg-teal text-white' : 'text-ink hover:bg-ice'
                  }`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="./book.html#booking" className="wd-btn wd-btn-primary hidden lg:inline-flex" data-magnetic="" data-anim="magnetic">
          Get an estimate
        </a>
        <button
          id="burger"
          type="button"
          className="wd-burger inline-flex h-12 w-12 flex-col items-center justify-center rounded-full text-ink hover:bg-ice md:hidden"
          aria-expanded={open}
          aria-controls="mobileMenu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          data-anim="burger-morph"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div id="mobileMenu" hidden={!open} className="wd-menu border-t border-silver-2 bg-ivory md:hidden" data-anim="menu-slide">
        <ul className="wd-wrap py-4">
          {nav.map((n, i) => (
            <li key={n.key} style={{ '--i': i }}>
              <a
                href={n.href}
                aria-current={current === n.key ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={`flex min-h-[52px] items-center justify-between rounded-xl px-4 text-lg font-[620] ${current === n.key ? 'bg-teal text-white' : 'text-ink'}`}
              >
                {n.label}
                {current === n.key ? <span className="text-sm font-[500] opacity-85">You are here</span> : null}
              </a>
            </li>
          ))}
          <li style={{ '--i': nav.length }} className="mt-3 px-1">
            <a href={brand.phoneHref} onClick={() => setOpen(false)} className="wd-btn wd-btn-ghost w-full">
              Call the bench: {brand.phone}
            </a>
          </li>
        </ul>
      </div>
      <div id="progress" data-anim="scroll-progress" className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal via-steel to-brass" aria-hidden="true" />
    </header>
  );
}
