import { photos, src } from '../data/photos.js';

// Heading whose words rise out of a mask when it scrolls into view.
export function Heading({ as: Tag = 'h2', text, className = 'wd-h2', anim = 'word-reveal', id }) {
  const words = text.split(' ');
  if (anim === 'letter-reveal') {
    let n = 0;
    return (
      <Tag id={id} className={className} data-reveal data-anim="letter-reveal">
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">
              {[...w].map((ch, ci) => (
                <span key={ci} className="wd-l" style={{ '--i': n++ }}>{ch}</span>
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Tag>
    );
  }
  return (
    <Tag id={id} className={className} data-reveal data-anim="word-reveal">
      {words.map((w, i) => (
        <span key={i}>
          <span className="wd-w"><span style={{ '--i': i }}>{w}</span></span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

export function Img({ k, className = '', loading = 'lazy', alt, ...rest }) {
  const p = photos[k];
  return (
    <img src={src(k)} alt={alt ?? p.alt} width={p.w} height={p.h} loading={loading} decoding="async" className={className} {...rest} />
  );
}

export function Btn({ href, children, variant = 'primary', className = '', ...rest }) {
  return (
    <a href={href} className={`wd-btn wd-btn-${variant} ${className}`} data-magnetic data-anim="magnetic" {...rest}>
      {children}
    </a>
  );
}

// Line icons drawn on reveal (stroke-dashoffset).
const ICONS = {
  eye: ['M3 24c6-9 13-14 21-14s15 5 21 14c-6 9-13 14-21 14S9 33 3 24z', 'M24 17a7 7 0 1 1 0 14a7 7 0 1 1 0-14'],
  frame: ['M4 22c0-4 3-6 8-6s8 2 8 6-2 9-8 9-8-5-8-9z', 'M28 22c0-4 3-6 8-6s8 2 8 6-2 9-8 9-8-5-8-9z', 'M20 21c2-2 6-2 8 0'],
  drop: ['M24 6c7 10 12 16 12 23a12 12 0 0 1-24 0c0-7 5-13 12-23z', 'M19 30a5 5 0 0 0 5 5'],
  star: ['M24 6l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z'],
  sun: ['M24 15a9 9 0 1 1 0 18a9 9 0 1 1 0-18', 'M24 4v5M24 39v5M4 24h5M39 24h5M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4'],
  tool: ['M30 8a8 8 0 0 0-8 10L8 32a4 4 0 0 0 6 6l14-14a8 8 0 0 0 10-8l-5 2-4-4 2-5z'],
  check: ['M10 25l9 9 19-20'],
  pin: ['M24 44s14-13 14-24a14 14 0 0 0-28 0c0 11 14 24 14 24z', 'M24 14a6 6 0 1 1 0 12a6 6 0 1 1 0-12'],
};

export function Icon({ name, className = 'w-12 h-12', delay = 0 }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name].map((d, i) => (
        <path key={i} d={d} className="wd-draw" style={{ '--len': 160, '--d': delay + i * 150 }} />
      ))}
    </svg>
  );
}

export function Logo({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true" fill="none" strokeWidth="5">
      <circle cx="18" cy="20" r="13" stroke="#0E5E63" />
      <circle cx="46" cy="20" r="13" stroke="#F0705A" />
      <path d="M31 18c0-2 2-3 1-3" stroke="#0E5E63" />
    </svg>
  );
}

export const money = (n) => '$' + n.toLocaleString('en-US');
