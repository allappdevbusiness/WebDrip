import { useEffect, useMemo, useRef, useState } from 'react';
import { symptoms, services, serviceCats, reviews } from '../data/home.js';
import { hours, fmtTime } from '../data/site.js';
import { Photo } from '../components/ui.jsx';

// Live watch dial: hour and minute hands follow the visitor's clock, the seconds hand sweeps.
export function Dial({ className = '' }) {
  const hourRef = useRef(null);
  const minRef = useRef(null);
  const secRef = useRef(null);
  useEffect(() => {
    const set = () => {
      const d = new Date();
      const s = d.getSeconds() + d.getMilliseconds() / 1000;
      const m = d.getMinutes() + s / 60;
      const h = (d.getHours() % 12) + m / 60;
      hourRef.current.style.transform = `rotate(${h * 30}deg)`;
      minRef.current.style.transform = `rotate(${m * 6}deg)`;
      return s;
    };
    const s = set();
    secRef.current.style.animationDelay = `-${s.toFixed(2)}s`;
    const id = setInterval(set, 20000);
    return () => clearInterval(id);
  }, []);
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="A watch dial showing the current time" data-anim="dial-sweep">
      <defs>
        <radialGradient id="dialFace" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f2f6f7" />
          <stop offset="1" stopColor="#d3e6e6" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="97" fill="#c5cbce" />
      <circle cx="100" cy="100" r="91" fill="url(#dialFace)" stroke="#8c6a1a" strokeWidth="1.5" />
      {Array.from({ length: 60 }, (_, i) => (
        <line
          key={i}
          x1="100"
          y1="13"
          x2="100"
          y2={i % 5 === 0 ? 24 : 18}
          stroke={i % 5 === 0 ? '#145e68' : '#7c8b90'}
          strokeWidth={i % 5 === 0 ? 2.6 : 1}
          transform={`rotate(${i * 6} 100 100)`}
        />
      ))}
      {[12, 3, 6, 9].map((n, i) => {
        const a = (i * 90 * Math.PI) / 180;
        return (
          <text key={n} x={100 + Math.sin(a) * 62} y={100 - Math.cos(a) * 62 + 6} textAnchor="middle" fontSize="17" fontWeight="700" fill="#13292f" style={{ fontStretch: '120%' }}>
            {n}
          </text>
        );
      })}
      <text x="100" y="74" textAnchor="middle" fontSize="7.5" fill="#44575d" letterSpacing="0.6">PENDLECREST</text>
      <text x="100" y="138" textAnchor="middle" fontSize="6.5" fill="#8c6a1a">serviced with care</text>
      <g ref={hourRef} className="wd-hand" style={{ transform: 'rotate(304deg)' }}>
        <path d="M97 104 L100 52 L103 104 Z" fill="#13292f" />
      </g>
      <g ref={minRef} className="wd-hand" style={{ transform: 'rotate(60deg)' }}>
        <path d="M98.2 106 L100 26 L101.8 106 Z" fill="#145e68" />
      </g>
      <g ref={secRef} className="wd-second">
        <line x1="100" y1="118" x2="100" y2="20" stroke="#8c6a1a" strokeWidth="1.2" />
        <circle cx="100" cy="100" r="4.2" fill="#8c6a1a" />
      </g>
      <circle cx="100" cy="100" r="1.6" fill="#fff" />
    </svg>
  );
}

const URGENCY = ['Not a fault', 'Soon', 'Within a few months', 'Stop wearing it'];

export function SymptomChecker() {
  const [picked, setPicked] = useState([]);
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const results = symptoms.filter((s) => picked.includes(s.id)).sort((a, b) => b.urgency - a.urgency);
  return (
    <div data-widget="symptom-checker" className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <fieldset>
        <legend className="wd-h3 text-lg">What is your watch doing? Pick all that apply.</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {symptoms.map((s) => (
            <button key={s.id} type="button" className="wd-chip" aria-pressed={picked.includes(s.id)} onClick={() => toggle(s.id)} data-sym={s.id}>
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="wd-panel p-6 md:p-7" aria-live="polite">
        {results.length === 0 ? (
          <p id="symEmpty" className="text-slate">
            Your likely cause, the service that fixes it and a starting price appear here. It’s a guide, not a diagnosis: we confirm
            everything in the written estimate.
          </p>
        ) : (
          <ul id="symResult" className="space-y-4">
            {results.map((r) => (
              <li key={r.id} className="wd-swap rounded-xl border border-silver-2 bg-white p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="wd-h3">{r.service}</span>
                  <span className="font-[650] text-teal">{r.price}</span>
                </div>
                <p className="mt-1 text-sm text-slate">Likely cause: {r.cause}</p>
                <p className="mt-2 text-[0.95rem]">{r.note}</p>
                <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-[650] ${r.urgency >= 3 ? 'bg-alert/10 text-alert' : r.urgency === 0 ? 'bg-ok/10 text-ok' : 'bg-brass-soft text-brass'}`}>
                  Urgency: {URGENCY[r.urgency]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function ServiceFilter() {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return services.filter((x) => (cat === 'All' || x.cat === cat) && (!s || (x.name + ' ' + x.text).toLowerCase().includes(s)));
  }, [cat, q]);
  return (
    <div data-widget="service-filter">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          {serviceCats.map((c) => (
            <button key={c} type="button" className="wd-chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="md:w-72">
          <label htmlFor="svcSearch" className="mb-1 block text-sm font-[600]">Search services</label>
          <input id="svcSearch" type="search" className="wd-field" placeholder="e.g. crystal, pocket" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <p id="svcCount" className="mt-5 text-sm text-slate" aria-live="polite">
        {list.length} {list.length === 1 ? 'service' : 'services'} shown
      </p>
      {list.length === 0 ? (
        <div id="svcEmpty" className="wd-swap mt-4 rounded-xl border border-dashed border-silver p-8 text-center">
          <p>Nothing matches that. Most jobs fit one of these, and the rest we quote individually.</p>
          <button type="button" className="wd-btn wd-btn-ghost mt-4" onClick={() => { setQ(''); setCat('All'); }}>
            Show all services
          </button>
        </div>
      ) : (
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <li key={s.name + cat + q} className="wd-swap" style={{ animationDelay: `${i * 40}ms` }}>
              <article className="wd-card wd-tilt h-full overflow-hidden" data-tilt="" data-anim="tilt-card">
                <Photo k={s.photo} className="wd-zoom aspect-[16/10]" data-anim="zoom-hover" />
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="wd-h3 text-lg">{s.name}</h3>
                    <span className="shrink-0 rounded-full bg-ice px-2.5 py-0.5 text-xs font-[620] text-teal">{s.cat}</span>
                  </div>
                  <p className="mt-2 text-[0.95rem] text-slate">{s.text}</p>
                  <dl className="mt-4 flex justify-between border-t border-silver-2 pt-3 text-sm">
                    <div>
                      <dt className="text-slate">Price</dt>
                      <dd className="font-[680] text-ink">{s.price}</dd>
                    </div>
                    <div className="text-right">
                      <dt className="text-slate">Usually takes</dt>
                      <dd className="font-[680] text-ink">{s.time}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Before/after: the same photo, with an aged treatment on the "before" side.
export function BeforeAfter() {
  const [v, setV] = useState(50);
  return (
    <div data-widget="before-after">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-silver-2 bg-ice select-none" style={{ '--ba': `${v}%` }}>
        <Photo k="vintageCase" className="absolute inset-0" />
        <div className="wd-ba-top absolute inset-0" aria-hidden="true">
          <Photo k="vintageCase" className="absolute inset-0" imgClass="[filter:sepia(0.75)_contrast(0.78)_brightness(0.82)_blur(0.6px)]" />
          <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 400 300" preserveAspectRatio="none">
            <path d="M40 60l90 40M210 40l-60 120M260 200l90-30M120 230l40-60M300 80l-30 50" stroke="#fff" strokeWidth="0.8" fill="none" />
          </svg>
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-[650] text-ink">Before</span>
        </div>
        <span className="absolute right-4 top-4 rounded-full bg-teal px-3 py-1 text-sm font-[650] text-white">After</span>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(20,94,104,0.4)]" style={{ left: `${v}%` }} aria-hidden="true">
          <span className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-teal shadow-lg">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M9 6l-5 6 5 6M15 6l5 6-5 6" /></svg>
          </span>
        </div>
      </div>
      <label htmlFor="baRange" className="mt-4 block text-sm font-[600]">Drag to compare before and after a service and light case clean</label>
      <input id="baRange" type="range" min="0" max="100" value={v} onChange={(e) => setV(Number(e.target.value))} className="mt-2 h-11 w-full accent-teal" />
      <p className="text-sm text-slate">
        <output id="baOut" htmlFor="baRange">{v}% before view</output>. The aged side is an illustration of a dull, scratched crystal and tired case.
      </p>
    </div>
  );
}

export function ReviewCarousel() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const n = reviews.length;
  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % n), 8000);
    return () => clearInterval(id);
  }, [auto, n]);
  const go = (d) => {
    setAuto(false);
    setI((x) => (x + d + n) % n);
  };
  return (
    <div data-widget="review-carousel" className="relative mx-auto max-w-3xl text-center" onFocus={() => setAuto(false)}>
      <svg viewBox="0 0 80 60" className="wd-bob mx-auto h-14 w-20 text-brass" data-anim="float" aria-hidden="true">
        <path d="M8 56V34C8 16 18 6 34 4v10c-9 2-13 8-13 16h13v26zm40 0V34c0-18 10-28 26-30v10c-9 2-13 8-13 16h13v26z" fill="currentColor" opacity="0.85" />
      </svg>
      <div className="mt-6 overflow-hidden" aria-live="polite">
        <ul id="reviewTrack" className="flex transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)]" style={{ transform: `translateX(-${i * 100}%)` }} data-anim="carousel-slide">
          {reviews.map((r, k) => (
            <li key={k} className="w-full shrink-0 px-2" aria-hidden={k !== i}>
              <blockquote>
                <p className="text-[clamp(1.25rem,2.6vw,1.9rem)] font-[560] leading-snug [font-stretch:104%] text-ink">“{r.quote}”</p>
                <footer className="mt-6">
                  <span className="block font-[680]">{r.name}</span>
                  <span className="block text-sm text-slate">{r.watch}</span>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button id="reviewPrev" type="button" className="wd-btn wd-btn-ghost h-12 w-12 !px-0" aria-label="Previous review" onClick={() => go(-1)}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span id="reviewPos" className="min-w-16 font-[650] tabular-nums">{i + 1} / {n}</span>
        <button id="reviewNext" type="button" className="wd-btn wd-btn-ghost h-12 w-12 !px-0" aria-label="Next review" onClick={() => go(1)}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="mt-4 flex justify-center gap-1" role="group" aria-label="Choose a review">
        {reviews.map((_, k) => (
          <button key={k} type="button" aria-label={`Review ${k + 1}`} aria-current={k === i ? 'true' : undefined} onClick={() => { setAuto(false); setI(k); }} className="grid h-11 w-8 place-items-center">
            <span className={`block h-2 rounded-full transition-all duration-300 ${k === i ? 'w-6 bg-teal' : 'w-2 bg-silver'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function statusAt(d) {
  const today = hours.find((h) => h.day === d.getDay());
  const t = d.getHours() + d.getMinutes() / 60;
  if (today.open != null && t >= today.open && t < today.close) {
    return { open: true, text: `Open now, until ${fmtTime(today.close)}` };
  }
  for (let k = 0; k < 8; k++) {
    const day = (d.getDay() + k) % 7;
    const h = hours.find((x) => x.day === day);
    if (h.open == null) continue;
    if (k === 0 && t >= h.open) continue;
    const when = k === 0 ? 'today' : k === 1 ? 'tomorrow' : h.label;
    return { open: false, text: `Closed now, opens ${when} at ${fmtTime(h.open)}` };
  }
  return { open: false, text: 'Closed now' };
}

export function OpenNow() {
  const [s, setS] = useState(null);
  useEffect(() => {
    const tick = () => setS(statusAt(new Date()));
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);
  const today = s ? new Date().getDay() : -1;
  return (
    <div data-widget="open-now" className="wd-card p-6">
      <p id="openStatus" className={`flex items-center gap-3 text-lg font-[680] ${s?.open ? 'text-ok' : 'text-ink'}`} aria-live="polite">
        <span className={`wd-pulse-dot inline-block h-3 w-3 rounded-full ${s ? (s.open ? 'bg-ok text-ok' : 'bg-alert text-alert') : 'bg-silver text-silver'}`} data-anim="pulse" aria-hidden="true" />
        {s ? s.text : 'Checking today’s hours…'}
      </p>
      <ul className="mt-4 space-y-1">
        {hours.map((h) => (
          <li key={h.day} className={`flex justify-between rounded-lg px-3 py-2 text-[0.97rem] ${h.day === today ? 'bg-ice font-[650]' : ''}`}>
            <span>{h.label}</span>
            <span className="text-slate">{h.open == null ? h.note : `${fmtTime(h.open)} – ${fmtTime(h.close)}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpotlightPhoto() {
  const [paused, setPaused] = useState(false);
  return (
    <div data-widget="spotlight-toggle" className="relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] md:aspect-[5/6]">
        <Photo k="microscope" imgId="spotImg" className="absolute inset-0" imgClass={`wd-kenburns ${paused ? 'wd-paused' : ''}`} data-anim="ken-burns" />
        <div className="wd-sheen absolute inset-0" data-anim="sheen" aria-hidden="true" />
      </div>
      <button
        id="spotToggle"
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
        className="wd-btn wd-btn-light absolute bottom-4 left-4 shadow-lg"
      >
        {paused ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M7 5l12 7-12 7z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
        )}
        {paused ? 'Play motion' : 'Pause motion'}
      </button>
    </div>
  );
}
