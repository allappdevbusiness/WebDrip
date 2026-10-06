import { useEffect, useMemo, useRef, useState } from 'react';
import { frames, quiz, reviews } from '../data/home.js';
import { hours, fmtHour } from '../data/site.js';
import { Img, money } from '../components/ui.jsx';

/* ---------- frame filter + search ---------- */
const SHAPES = ['all', 'round', 'rectangle', 'square', 'browline', 'aviator'];
const MATERIALS = ['any', 'acetate', 'titanium', 'metal', 'mixed'];

export function FrameFilter() {
  const [shape, setShape] = useState('all');
  const [material, setMaterial] = useState('any');
  const [q, setQ] = useState('');
  const list = useMemo(
    () =>
      frames.filter(
        (f) =>
          (shape === 'all' || f.shape === shape) &&
          (material === 'any' || f.material === material) &&
          (!q.trim() || `${f.name} ${f.colour} ${f.note}`.toLowerCase().includes(q.trim().toLowerCase()))
      ),
    [shape, material, q]
  );
  return (
    <div data-widget="frame-filter">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-end justify-between mb-8">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Frame shape">
            {SHAPES.map((s) => (
              <button key={s} type="button" className="wd-chip capitalize" aria-pressed={shape === s} onClick={() => setShape(s)}>{s === 'all' ? 'All shapes' : s}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Frame material">
            {MATERIALS.map((m) => (
              <button key={m} type="button" className="wd-chip capitalize" aria-pressed={material === m} onClick={() => setMaterial(m)}>{m === 'any' ? 'Any material' : m}</button>
            ))}
          </div>
        </div>
        <label className="block lg:w-72">
          <span className="block font-semibold mb-1">Search frames</span>
          <input id="frameSearch" type="search" className="wd-input" placeholder="Try tortoise or gold" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      <p className="font-semibold text-teal mb-4" aria-live="polite" id="frameCount">{list.length} {list.length === 1 ? 'frame' : 'frames'} shown</p>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" id="frameGrid">
        {list.map((f) => (
          <li key={f.id} className="wd-card wd-zoom wd-tilt wd-swap overflow-hidden" data-tilt data-anim="tilt">
            <div className="wd-media wd-sheen aspect-[4/3] rounded-none" data-anim="sheen">
              <Img k={f.id} alt={`${f.name} frame: ${f.colour}`} />
            </div>
            <div className="p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-2xl">{f.name}</h3>
                <span className="font-display text-xl font-bold text-teal">{money(f.price)}</span>
              </div>
              <p className="text-muted mt-1 text-[0.95rem]">{f.colour}. Size {f.fit}.</p>
              <p className="mt-2">{f.note}</p>
              <p className="mt-3 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-mint px-3 py-1 capitalize">{f.shape}</span>
                <span className="rounded-full bg-blush px-3 py-1 capitalize">{f.material}</span>
                <span className="rounded-full bg-sand px-3 py-1 capitalize">{f.size}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
      {list.length === 0 && (
        <p className="wd-swap text-lg mt-4" id="frameEmpty">
          Nothing matches that combination online. We have more than 600 frames in the studio, so{' '}
          <button type="button" className="underline font-semibold text-teal" onClick={() => { setShape('all'); setMaterial('any'); setQ(''); }}>clear the filters</button> or ask us to set some aside.
        </p>
      )}
    </div>
  );
}

/* ---------- frame quiz ---------- */
export function FrameQuiz() {
  const [step, setStep] = useState(0);
  const [tags, setTags] = useState([]);
  const done = step >= quiz.length;
  const pick = (opt) => {
    setTags((t) => [...t, ...opt.tags]);
    setStep((s) => s + 1);
  };
  const result = useMemo(() => {
    if (!done) return null;
    const score = (f) => tags.filter((t) => t === f.shape || t === f.material).length;
    return [...frames].sort((a, b) => score(b) - score(a) || a.price - b.price).slice(0, 2);
  }, [done, tags]);
  return (
    <div className="wd-card p-6 md:p-10" data-widget="frame-quiz" id="quiz">
      <div className="flex items-center gap-3 mb-6" aria-hidden="true">
        {quiz.map((_, i) => (
          <span key={i} className="h-2 flex-1 rounded-full bg-mint overflow-hidden">
            <span className="block h-full bg-coral origin-left transition-transform duration-500" style={{ transform: `scaleX(${i < step ? 1 : 0})` }} />
          </span>
        ))}
      </div>
      {!done ? (
        <div key={step} className="wd-swap">
          <p className="text-muted font-semibold">Question {step + 1} of {quiz.length}</p>
          <h3 className="text-3xl md:text-4xl mt-2 mb-6">{quiz[step].q}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {quiz[step].options.map((o) => (
              <button key={o.label} type="button" className="wd-btn wd-btn-ghost justify-start text-left rounded-2xl" onClick={() => pick(o)}>{o.label}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="wd-swap" id="quizResult">
          <h3 className="text-3xl md:text-4xl">Try these two first</h3>
          <p className="text-muted mt-2">Based on your answers. Bring this list in, or ask us to set them aside for a fitting.</p>
          <ul className="grid gap-4 sm:grid-cols-2 mt-6">
            {result.map((f) => (
              <li key={f.id} className="flex gap-4 items-center rounded-2xl bg-mint p-3 wd-pop">
                <div className="wd-media w-28 h-20 shrink-0 rounded-xl"><Img k={f.id} alt={`${f.name} frame`} /></div>
                <div>
                  <p className="font-display text-2xl font-bold">{f.name}</p>
                  <p className="text-muted text-sm capitalize">{f.shape}, {f.material}, {money(f.price)}</p>
                </div>
              </li>
            ))}
          </ul>
          <button type="button" className="wd-btn wd-btn-ghost mt-6" onClick={() => { setStep(0); setTags([]); }}>Start again</button>
        </div>
      )}
    </div>
  );
}

/* ---------- before / after glare slider ---------- */
export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <div data-widget="before-after" className="relative wd-media aspect-[4/3] rounded-3xl select-none" style={{ '--pos': pos + '%' }}>
      <Img k="glare" alt="Reading through lenses without an anti-reflective coating" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(255,255,255,0.85),rgba(255,255,255,0)_32%),radial-gradient(circle_at_72%_60%,rgba(255,255,255,0.7),rgba(255,255,255,0)_26%)]" aria-hidden="true" />
      <div className="wd-ba-top absolute inset-0" id="baTop">
        <Img k="glare" alt="The same view through lenses with an anti-reflective coating" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold">With coating</span>
      <span className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold">No coating</span>
      <div className="absolute inset-y-0 w-1 bg-white shadow-lg pointer-events-none" style={{ left: `calc(${pos}% - 2px)` }} aria-hidden="true">
        <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-12 h-12 rounded-full bg-coral border-4 border-white grid place-items-center text-ink font-bold">&#8596;</span>
      </div>
      <label className="sr-only" htmlFor="baRange">Compare coated and uncoated lenses</label>
      <input id="baRange" type="range" min="0" max="100" value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
      <output htmlFor="baRange" className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-1 text-sm font-semibold" id="baOut">{pos}% coated view</output>
    </div>
  );
}

/* ---------- review carousel ---------- */
export function ReviewCarousel() {
  const [i, setI] = useState(0);
  const n = reviews.length;
  const go = (d) => setI((v) => (v + d + n) % n);
  return (
    <div data-widget="review-carousel" className="relative" aria-roledescription="carousel" aria-label="Sample reviews">
      <div className="overflow-hidden rounded-3xl">
        <ul className="flex transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)]" style={{ transform: `translateX(-${i * 100}%)` }} data-anim="carousel-slide" id="reviewTrack">
          {reviews.map((r, idx) => (
            <li key={r.name} className="w-full shrink-0 grid md:grid-cols-[280px_1fr] gap-6 md:gap-10 items-center bg-white p-6 md:p-10" aria-hidden={idx !== i} aria-label={`Review ${idx + 1} of ${n}`}>
              <div className="wd-media aspect-square rounded-2xl max-w-[220px] md:max-w-none"><Img k={r.photo} alt={`Portrait used with sample review from ${r.name}`} /></div>
              <figure>
                <svg viewBox="0 0 48 36" className="w-12 h-9 text-coral" aria-hidden="true"><path fill="currentColor" d="M0 36V20C0 8 7 1 18 0v8c-6 1-9 5-9 11h9v17H0zm27 0V20C27 8 34 1 45 0v8c-6 1-9 5-9 11h9v17H27z" /></svg>
                <blockquote className="font-display text-2xl md:text-3xl font-semibold leading-snug mt-4">{r.text}</blockquote>
                <figcaption className="mt-5 text-muted"><strong className="text-ink">{r.name}</strong>, {r.role}. Sample review.</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-3 mt-6">
        <button type="button" className="wd-btn wd-btn-ghost w-12 px-0" onClick={() => go(-1)} aria-label="Previous review">&#8249;</button>
        <button type="button" className="wd-btn wd-btn-ghost w-12 px-0" onClick={() => go(1)} aria-label="Next review" id="reviewNext">&#8250;</button>
        <div className="flex gap-2 ml-2">
          {reviews.map((r, idx) => (
            <button key={r.name} type="button" className="w-11 h-11 grid place-items-center" aria-label={`Show review ${idx + 1}`} aria-current={idx === i} onClick={() => setI(idx)}>
              <span className={`block h-2.5 rounded-full transition-all duration-500 ${idx === i ? 'w-8 bg-teal' : 'w-2.5 bg-teal/30'}`} />
            </button>
          ))}
        </div>
        <p className="ml-auto font-semibold text-muted" id="reviewPos">{i + 1} / {n}</p>
      </div>
    </div>
  );
}

/* ---------- open now indicator ---------- */
export function OpenNow() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  let status = 'Checking today’s hours…';
  let open = null;
  let today = -1;
  if (now) {
    today = now.getDay();
    const h = now.getHours() + now.getMinutes() / 60;
    const row = hours.find((r) => r.day === today);
    open = row.open != null && h >= row.open && h < row.close;
    if (open) status = `Open now until ${fmtHour(row.close)}`;
    else {
      for (let k = 0; k < 8; k++) {
        const d = (today + k) % 7;
        const r = hours.find((x) => x.day === d);
        if (r.open == null) continue;
        if (k === 0 && h >= r.open) continue;
        status = `Closed now. Opens ${k === 0 ? 'today' : k === 1 ? 'tomorrow' : r.label} at ${fmtHour(r.open)}`;
        break;
      }
    }
  }
  return (
    <div data-widget="open-now" className="wd-card p-6 md:p-8">
      <p className="flex items-center gap-3 font-display text-2xl font-bold" id="openStatus" aria-live="polite">
        <span className={`relative inline-block w-3.5 h-3.5 rounded-full ${open ? 'bg-teal2 text-teal2 wd-pulse' : 'bg-coral text-coral'}`} data-anim="pulse" aria-hidden="true" />
        {status}
      </p>
      <ul className="mt-5 divide-y divide-teal/10">
        {hours.map((r) => (
          <li key={r.label} className={`flex justify-between py-2.5 px-2 rounded-lg transition-colors ${r.day === today ? 'bg-mint font-semibold' : ''}`} data-today={r.day === today || undefined}>
            <span>{r.label}{r.day === today ? ' (today)' : ''}</span>
            <span className="text-muted">{r.open == null ? 'Closed' : `${fmtHour(r.open)} to ${fmtHour(r.close)}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- accordion ---------- */
export function Accordion({ items, id = 'acc', widget = 'accordion', initial = 0 }) {
  const [open, setOpen] = useState(initial);
  return (
    <div data-widget={widget} className="divide-y divide-teal/15 border-y border-teal/15" data-anim="accordion">
      {items.map((it, i) => (
        <div key={it.q}>
          <h3>
            <button
              type="button"
              id={`${id}-b${i}`}
              className="w-full flex items-center justify-between gap-6 text-left py-5 min-h-12 font-display text-xl md:text-2xl font-bold hover:text-teal transition-colors"
              aria-expanded={open === i}
              aria-controls={`${id}-p${i}`}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              {it.q}
              <span className="wd-acc-icon shrink-0 w-9 h-9 rounded-full bg-mint grid place-items-center text-teal text-2xl leading-none" aria-hidden="true">+</span>
            </button>
          </h3>
          <div className="wd-acc-panel" id={`${id}-p${i}`} data-open={open === i} role="region" aria-labelledby={`${id}-b${i}`}>
            <div><p className="pb-6 pr-12 text-muted text-lg">{it.a}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- spotlight pause/play ---------- */
export function SpotlightImage() {
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  return (
    <div className="relative wd-media aspect-[4/5] md:aspect-[5/6] rounded-[28px]" data-widget="spotlight-toggle">
      <Img k="spot" ref={ref} className={`wd-kenburns ${paused ? 'wd-paused' : ''}`} data-anim="ken-burns" id="spotImg" />
      <button type="button" id="spotToggle" className="absolute bottom-4 right-4 wd-btn wd-btn-ghost bg-white/90" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        {paused ? 'Play motion' : 'Pause motion'}
      </button>
    </div>
  );
}
