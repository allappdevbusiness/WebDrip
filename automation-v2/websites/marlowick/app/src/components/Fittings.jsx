import { fittings } from '../data.js';
import SectionHead from './SectionHead.jsx';

export default function Fittings() {
  return (
    <section id="fittings" className="wd-section wd-bg-camel" aria-labelledby="fitTitle">
      <div className="relative mx-auto max-w-4xl px-5 md:px-8">
        <SectionHead id="fitTitle" align="center" {...fittings} />
        <ol className="wd-timeline mt-12">
          {fittings.steps.map((s, i) => (
            <li key={s.title} className="wd-step" data-reveal={i % 2 ? 'right' : 'left'} style={{ '--d': `${i * 0.06}s` }}>
              <span className="wd-mono wd-step-time">{s.time}</span>
              <span className="wd-step-dot" aria-hidden="true" />
              <div>
                <h3 className="wd-h3">{s.title}</h3>
                <p className="wd-body">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <dl className="wd-stats mt-14 grid gap-4 sm:grid-cols-3">
          {fittings.stats.map((s, i) => (
            <div key={s.label} className="wd-card wd-stat" data-reveal="up" style={{ '--d': `${i * 0.1}s` }}>
              <dt className="wd-body">{s.label}</dt>
              <dd className="wd-stat-num" data-count={s.value} data-prefix={s.prefix || ''} data-suffix={s.suffix}>
                {(s.prefix || '') + s.value + s.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
