import { hire } from '../data.js';
import SectionHead from './SectionHead.jsx';

export default function Hire() {
  return (
    <section id="hire" className="wd-section wd-bg-white" aria-labelledby="hireTitle">
      <div className="wd-blob wd-blob-d" aria-hidden="true" data-speed="0.6" />
      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
          <SectionHead id="hireTitle" {...hire} />
          <div className="wd-hire-photo" data-reveal="right">
            <img src={hire.img.src} alt={hire.imgAlt} loading="lazy" decoding="async" data-speed="1.1" />
          </div>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {hire.plans.map((p, i) => (
            <li
              key={p.name}
              className={`wd-card wd-plan ${p.featured ? 'wd-plan-featured' : ''}`}
              data-reveal="flip"
              style={{ '--d': `${i * 0.12}s` }}
            >
              {p.featured && <span className="wd-mono wd-badge">Most booked</span>}
              <h3 className="wd-h3">{p.name}</h3>
              <p className="wd-plan-price">
                <span className="wd-plan-cur">$</span>
                <span data-count={p.price}>{p.price}</span>
                <span className="wd-mono wd-plan-per">{p.per}</span>
              </p>
              <p className="wd-body">{p.text}</p>
              <ul className="wd-points">
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <a href="#visit" className={`wd-btn ${p.featured ? 'wd-btn-primary' : 'wd-btn-ghost'} mt-auto justify-center`}>
                Book this hire
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
