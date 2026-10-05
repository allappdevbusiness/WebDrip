import { suits } from '../data.js';
import SectionHead from './SectionHead.jsx';

export default function Suits() {
  return (
    <section id="suits" className="wd-section wd-bg-ivory" aria-labelledby="suitsTitle">
      <div className="wd-blob wd-blob-c" aria-hidden="true" data-speed="1.4" />
      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <SectionHead id="suitsTitle" {...suits} />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suits.items.map((s, i) => (
            <li key={s.title} className="wd-card wd-suit" data-reveal="up" style={{ '--d': `${(i % 3) * 0.09}s` }}>
              <div className="wd-suit-media">
                <img src={s.img.src} alt={s.alt} loading="lazy" decoding="async" />
              </div>
              <div className="wd-suit-body">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="wd-h3">{s.title}</h3>
                  <p className="wd-price">
                    <span className="wd-mono wd-price-unit">{s.unit}</span> ${s.price}
                  </p>
                </div>
                <p className="wd-body">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
