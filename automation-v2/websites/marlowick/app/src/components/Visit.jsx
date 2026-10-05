import { visit } from '../data.js';
import ContactForm from './ContactForm.jsx';

export default function Visit() {
  return (
    <section id="visit" className="wd-section wd-bg-ivory wd-visit" aria-labelledby="visitTitle">
      <div className="wd-portraits" aria-hidden="true">
        {visit.portraits.map((p) => (
          <div key={p.cls} className={`wd-portrait ${p.cls}`} data-speed={p.speed}>
            <img src={p.img.src} alt="" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
      <div className="relative mx-auto max-w-2xl px-5 text-center md:px-8">
        <div data-reveal="mask">
          <p className="wd-mono wd-kicker">{visit.kicker}</p>
          <h2 id="visitTitle" className="wd-h2">{visit.title}</h2>
          <p className="wd-lead mx-auto">{visit.copy}</p>
        </div>
        <div className="mt-10 text-left">
          <ContactForm />
        </div>
        <div className="wd-hours mt-8" data-reveal="up">
          <p className="wd-mono wd-kicker">Opening hours</p>
          <ul>
            {visit.hours.map(([d, h]) => (
              <li key={d}>
                <span>{d}</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
