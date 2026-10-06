// Small shared building blocks used by every page.
import { photos } from '../data/photos.js';

const ANIM_FOR = {
  up: 'fade-up',
  left: 'slide-left',
  right: 'slide-right',
  scale: 'scale-in',
  rotate: 'rotate-in',
  blur: 'blur-in',
  wipe: 'clip-wipe',
  mask: 'mask-reveal',
  flip: 'flip-in',
  words: 'word-reveal',
  ticks: 'tick-draw',
};

// A scroll-revealed block. `as` picks the element; `kind` picks the reveal style.
export function Reveal({ as: Tag = 'div', kind = 'up', i = 0, anim, className = '', style, children, ...rest }) {
  return (
    <Tag data-reveal={kind} data-anim={anim || ANIM_FOR[kind]} className={className} style={{ '--i': i, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

// Splits a heading into words that rise in one after another when revealed.
export function Words({ text, as: Tag = 'h2', className = '', id }) {
  const words = text.split(' ');
  return (
    <Tag data-reveal="words" data-anim="word-reveal" className={className} id={id}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="wd-word" style={{ '--w': i }}>{w}</span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

// Splits a heading into letters for the page-header rise (spaces stay outside the inline-blocks).
export function Letters({ text, className = '', as: Tag = 'h1' }) {
  let n = 0;
  const words = text.split(' ');
  return (
    <Tag className={`wd-rise ${className}`} data-anim="letter-reveal" aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true">
          <span className="wd-word">
            {[...w].map((ch, ci) => (
              <span key={ci} className="wd-letter" style={{ '--l': n++ }}>{ch}</span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

export function SectionHead({ label, title, lede, center = false, className = '', titleClass = '' }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {label ? (
        <Reveal as="p" kind="left" className="wd-label mb-3">
          {label}
        </Reveal>
      ) : null}
      <Words text={title} className={`wd-h2 ${titleClass}`} />
      {lede ? (
        <Reveal as="p" kind="up" i={2} className={`wd-lede mt-5 ${center ? 'mx-auto' : ''}`}>
          {lede}
        </Reveal>
      ) : null}
    </div>
  );
}

export function Ticks({ className = '' }) {
  return (
    <Reveal kind="ticks" className={className} aria-hidden="true">
      <div className="wd-ticks" />
    </Reveal>
  );
}

// A photo in a frame. `k` is a key in photos.js.
export function Photo({ k, className = '', imgClass = '', imgId, eager = false, sizes, parallax, ...rest }) {
  const p = photos[k];
  return (
    <div className={`relative overflow-hidden ${className}`} {...rest}>
      <img
        id={imgId}
        src={p.src}
        alt={p.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`wd-img ${parallax ? 'scale-[1.18]' : ''} ${imgClass}`}
        sizes={sizes}
        data-parallax={parallax}
        data-anim={parallax ? 'parallax' : undefined}
      />
    </div>
  );
}

export function Btn({ href, children, variant = 'primary', className = '', magnetic = false, ...rest }) {
  const cls = `wd-btn wd-btn-${variant} ${className}`;
  const extra = magnetic ? { 'data-magnetic': '', 'data-anim': 'magnetic' } : {};
  if (href) {
    return (
      <a href={href} className={cls} {...extra} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...extra} {...rest}>
      {children}
    </button>
  );
}

export function CheckIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={`wd-check ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

// Email check shared by every form: empty, then shape.
export function emailError(v) {
  if (!v.trim()) return 'Please enter your email address.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'That email looks incomplete. Check it has a name, an @ and a domain.';
  return '';
}
