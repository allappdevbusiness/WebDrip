import { useMemo, useState } from 'react';
import { plans, calc, lensTypes, priorities, steps, faq } from '../data/services.js';
import { money } from '../components/ui.jsx';

/* ---------- care plan pricing with monthly / yearly toggle ---------- */
export function PlanToggle() {
  const [yearly, setYearly] = useState(false);
  return (
    <div data-widget="pricing-toggle">
      <div className="inline-flex relative rounded-full bg-white p-1 border border-teal/20" role="group" aria-label="Billing period">
        <span className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-teal transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]" style={{ transform: yearly ? 'translateX(100%)' : 'none' }} data-anim="tab-slide" aria-hidden="true" />
        <button type="button" id="billMonthly" className={`relative z-10 min-h-11 px-6 rounded-full font-semibold transition-colors ${!yearly ? 'text-white' : 'text-ink'}`} aria-pressed={!yearly} onClick={() => setYearly(false)}>Monthly</button>
        <button type="button" id="billYearly" className={`relative z-10 min-h-11 px-6 rounded-full font-semibold transition-colors ${yearly ? 'text-white' : 'text-ink'}`} aria-pressed={yearly} onClick={() => setYearly(true)}>Yearly</button>
      </div>
      <p className="mt-3 text-muted text-sm">{yearly ? 'Paying yearly saves you up to two months.' : 'Cancel any time after the first three months.'}</p>
      <ul className="mt-8 grid gap-6 lg:grid-cols-3" data-reveal data-anim="stagger">
        {plans.map((p, i) => (
          <li key={p.name} style={{ '--i': i }} className={`wd-card wd-tilt p-7 flex flex-col ${p.featured ? 'ring-2 ring-coral lg:-translate-y-3' : ''}`} data-tilt data-anim="tilt">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl">{p.name}</h3>
              {p.featured && <span className="rounded-full bg-blush px-3 py-1 text-sm font-semibold">Most chosen</span>}
            </div>
            <p className="text-muted mt-2">{p.text}</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span key={yearly ? 'y' : 'm'} className="wd-swap font-display text-6xl font-extrabold text-teal" data-price={p.name}>{money(yearly ? p.yearly : p.monthly)}</span>
              <span className="text-muted font-semibold">{yearly ? 'a year' : 'a month'}</span>
            </p>
            <ul className="mt-6 space-y-2 flex-1">
              {p.perks.map((k) => (
                <li key={k} className="flex gap-2"><span className="text-coral font-bold" aria-hidden="true">+</span>{k}</li>
              ))}
            </ul>
            <a href="./book.html#contact" className={`wd-btn mt-7 ${p.featured ? 'wd-btn-primary' : 'wd-btn-ghost'}`}>Ask about {p.name}</a>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted mt-4">Sample prices for a fictional practice.</p>
    </div>
  );
}

/* ---------- glasses cost calculator ---------- */
function Choice({ legend, name, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="font-display text-xl font-bold mb-3">{legend}</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => (
          <label key={o.id} className={`relative flex flex-col justify-center min-h-16 rounded-2xl border-2 px-4 py-3 cursor-pointer transition-all duration-300 ${value === o.id ? 'border-teal bg-mint scale-[1.02]' : 'border-teal/15 bg-white hover:border-teal/40'}`}>
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            <span className="font-semibold leading-tight">{o.label}</span>
            <span className="text-sm text-muted">{o.price ? `+${money(o.price)}` : 'Included'}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CostCalculator() {
  const [frame, setFrame] = useState('studio');
  const [lens, setLens] = useState('single');
  const [material, setMaterial] = useState('std');
  const [extras, setExtras] = useState(['ar']);
  const [plan, setPlan] = useState(false);
  const find = (list, id) => list.find((x) => x.id === id);
  const lines = [
    ['Frame', find(calc.frames, frame)],
    ['Lenses', find(calc.lenses, lens)],
    ['Material', find(calc.materials, material)],
    ...extras.map((e) => ['Extra', find(calc.extras, e)]),
  ];
  const subtotal = lines.reduce((s, [, o]) => s + o.price, 0);
  const discount = plan ? Math.round(subtotal * 0.15) : 0;
  const total = subtotal - discount;
  const toggle = (id) => setExtras((x) => (x.includes(id) ? x.filter((v) => v !== id) : [...x, id]));
  return (
    <div data-widget="cost-calculator" className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-7">
        <Choice legend="Frame" name="calcFrame" options={calc.frames} value={frame} onChange={setFrame} />
        <Choice legend="Lens type" name="calcLens" options={calc.lenses} value={lens} onChange={setLens} />
        <Choice legend="Lens material" name="calcMat" options={calc.materials} value={material} onChange={setMaterial} />
        <fieldset>
          <legend className="font-display text-xl font-bold mb-3">Coatings and tints</legend>
          <div className="grid sm:grid-cols-2 gap-2">
            {calc.extras.map((o) => (
              <label key={o.id} className={`flex items-center gap-3 min-h-14 rounded-2xl border-2 px-4 py-2 cursor-pointer transition-colors ${extras.includes(o.id) ? 'border-coral bg-blush' : 'border-teal/15 bg-white'}`}>
                <input type="checkbox" id={`extra-${o.id}`} checked={extras.includes(o.id)} onChange={() => toggle(o.id)} className="w-5 h-5 accent-[#0E5E63]" />
                <span className="font-semibold leading-tight flex-1">{o.label}</span>
                <span className="text-sm text-muted">+{money(o.price)}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-3 min-h-12 font-semibold">
          <input type="checkbox" id="calcPlan" checked={plan} onChange={(e) => setPlan(e.target.checked)} className="w-5 h-5 accent-[#0E5E63]" />
          I am on an EyeMax care plan (15% off)
        </label>
      </div>
      <div className="lg:col-span-5">
        <div className="wd-card p-7 lg:sticky lg:top-28 bg-white">
          <h3 className="text-2xl">Your estimate</h3>
          <ul className="mt-4 space-y-2">
            {lines.map(([k, o]) => (
              <li key={k + o.id} className="wd-swap flex justify-between gap-4 border-b border-dashed border-teal/15 pb-2">
                <span><span className="text-muted">{k}:</span> {o.label}</span>
                <span className="font-semibold">{o.price ? money(o.price) : 'Included'}</span>
              </li>
            ))}
            {plan && (
              <li className="wd-swap flex justify-between text-teal font-semibold"><span>Care plan saving</span><span>-{money(discount)}</span></li>
            )}
          </ul>
          <p className="mt-6 flex items-baseline justify-between">
            <span className="font-semibold">Total</span>
            <span key={total} id="calcTotal" className="wd-pop font-display text-5xl font-extrabold text-teal">{money(total)}</span>
          </p>
          <p className="text-sm text-muted mt-3">Sample prices. Your final quote depends on your prescription and is confirmed before we order anything.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- lens comparison with priority highlight ---------- */
export function LensCompare() {
  const [prio, setPrio] = useState(null);
  const best = (l) => prio && l.tags.includes(prio);
  const rows = [
    ['Best for', 'best'],
    ['Focus zones', 'zones'],
    ['Getting used to them', 'adapt'],
    ['Price from', 'from'],
    ['Guarantee', 'guarantee'],
  ];
  return (
    <div data-widget="lens-compare">
      <div className="flex flex-wrap items-center gap-2 mb-6" role="group" aria-label="What matters most">
        <span className="font-semibold mr-2">What matters most to you?</span>
        {priorities.map((p) => (
          <button key={p.id} type="button" className="wd-chip" aria-pressed={prio === p.id} onClick={() => setPrio(prio === p.id ? null : p.id)}>{p.label}</button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-3xl border border-teal/15 bg-white">
        <table className="w-full min-w-[720px] text-left">
          <caption className="sr-only">Lens types compared</caption>
          <thead>
            <tr>
              <th scope="col" className="p-4 w-44"><span className="sr-only">Feature</span></th>
              {lensTypes.map((l) => (
                <th key={l.id} scope="col" className={`p-4 font-display text-xl align-bottom transition-colors duration-300 ${best(l) ? 'bg-teal text-white' : ''}`} data-col={l.id} data-best={best(l) || undefined}>
                  {l.name}
                  {best(l) && <span className="wd-pop block text-sm font-body font-semibold text-white/90">Good match</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, key]) => (
              <tr key={key} className="border-t border-teal/10">
                <th scope="row" className="p-4 font-semibold">{label}</th>
                {lensTypes.map((l) => (
                  <td key={l.id} className={`p-4 transition-colors duration-300 ${best(l) ? 'bg-mint' : ''}`}>{l[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- frame size guide ---------- */
export function SizeGuide() {
  const [lens, setLens] = useState(50);
  const [bridge, setBridge] = useState(19);
  const [temple, setTemple] = useState(145);
  const width = lens * 2 + bridge + 10;
  const fit = width < 120 ? 'Small: suits narrower faces and most teenagers.' : width < 134 ? 'Medium: the most common adult fit.' : 'Large: for wider faces or an oversized look.';
  const s = 1.6;
  const lx = 160 - (bridge / 2) * s - lens * s;
  const rx = 160 + (bridge / 2) * s;
  return (
    <div data-widget="size-guide" className="grid gap-8 lg:grid-cols-2 items-center">
      <div className="wd-card p-6">
        <svg viewBox="0 0 320 140" className="w-full" role="img" aria-label={`Frame preview: ${lens}-${bridge}-${temple}`}>
          <rect x={lx} y={30} width={lens * s} height={lens * s * 0.72} rx={22} fill="#DCEFEC" stroke="#0E5E63" strokeWidth="5" style={{ transition: 'all 300ms' }} />
          <rect x={rx} y={30} width={lens * s} height={lens * s * 0.72} rx={22} fill="#DCEFEC" stroke="#0E5E63" strokeWidth="5" style={{ transition: 'all 300ms' }} />
          <path d={`M${lx + lens * s} 46 Q160 ${30 - bridge / 3} ${rx} 46`} fill="none" stroke="#F0705A" strokeWidth="5" />
          <text x="160" y="132" textAnchor="middle" fontSize="13" fill="#42575B">Total width about {width} mm</text>
        </svg>
        <p className="font-display text-4xl font-extrabold text-center mt-2 text-teal" id="sizeCode">{lens}-{bridge}-{temple}</p>
        <p className="text-center mt-2 font-semibold" id="sizeFit">{fit}</p>
      </div>
      <div className="space-y-6">
        {[
          ['Lens width', lens, setLens, 40, 60, 'Measured across one lens at its widest point.'],
          ['Bridge width', bridge, setBridge, 14, 24, 'The gap between the lenses, where the frame sits on your nose.'],
          ['Temple length', temple, setTemple, 130, 150, 'The arm length from hinge to tip. Usually 135, 140 or 145.'],
        ].map(([label, v, set, min, max, help]) => (
          <label key={label} className="block">
            <span className="flex justify-between font-semibold"><span>{label}</span><span className="text-teal">{v} mm</span></span>
            <input type="range" min={min} max={max} value={v} onChange={(e) => set(Number(e.target.value))} className="w-full h-11 accent-[#0E5E63]" data-size={label} />
            <span className="block text-sm text-muted">{help}</span>
          </label>
        ))}
        <p className="text-muted">Find these three numbers printed inside the left arm of a pair that already fits you. Bring that pair in and we will match the fit.</p>
      </div>
    </div>
  );
}

/* ---------- exam process timeline ---------- */
export function ProcessTimeline() {
  const [i, setI] = useState(0);
  return (
    <div data-widget="process-timeline" className="grid gap-8 lg:grid-cols-12">
      <ol className="lg:col-span-5 relative space-y-2" role="tablist" aria-label="Eye exam steps" aria-orientation="vertical">
        {steps.map((s, idx) => (
          <li key={s.title} role="presentation">
            <button
              type="button"
              role="tab"
              id={`step-tab-${idx}`}
              aria-selected={i === idx}
              aria-controls="stepPanel"
              onClick={() => setI(idx)}
              className={`w-full text-left flex items-center gap-4 min-h-14 rounded-2xl px-4 py-3 transition-all duration-300 ${i === idx ? 'bg-teal text-white translate-x-2' : 'bg-white hover:bg-mint'}`}
            >
              <span className={`w-9 h-9 rounded-full grid place-items-center font-bold shrink-0 ${i === idx ? 'bg-coral text-ink' : 'bg-mint text-teal'}`}>{idx + 1}</span>
              <span className="font-semibold">{s.title}</span>
              <span className={`ml-auto text-sm ${i === idx ? 'text-white/85' : 'text-muted'}`}>{s.time}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="lg:col-span-7">
        <div id="stepPanel" role="tabpanel" aria-labelledby={`step-tab-${i}`} key={i} className="wd-swap wd-card p-8 h-full">
          <p className="text-coral font-display text-7xl font-extrabold leading-none">{i + 1}</p>
          <h3 className="text-3xl mt-4">{steps[i].title}</h3>
          <p className="text-lg text-muted mt-4">{steps[i].text}</p>
          <div className="mt-8 flex gap-3">
            <button type="button" className="wd-btn wd-btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}>Previous step</button>
            <button type="button" id="stepNext" className="wd-btn wd-btn-teal" disabled={i === steps.length - 1} onClick={() => setI(i + 1)}>Next step</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- searchable FAQ ---------- */
export function FaqSearch() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(0);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return faq.map((f, i) => ({ ...f, i })).filter((f) => !t || (f.q + ' ' + f.a).toLowerCase().includes(t));
  }, [q]);
  return (
    <div data-widget="faq-search">
      <label className="block max-w-lg mb-6">
        <span className="block font-semibold mb-1">Search the questions</span>
        <input id="faqSearch" type="search" className="wd-input" placeholder="Try varifocal, kids or OCT" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <p className="text-muted mb-3" aria-live="polite" id="faqCount">{list.length} of {faq.length} questions</p>
      <div className="divide-y divide-teal/15 border-y border-teal/15" data-anim="accordion">
        {list.map((f) => (
          <div key={f.q} className="wd-swap" data-faq>
            <h3>
              <button
                type="button"
                id={`faq-b${f.i}`}
                className="w-full flex items-center justify-between gap-6 text-left py-5 min-h-12 font-display text-xl md:text-2xl font-bold hover:text-teal transition-colors"
                aria-expanded={open === f.i}
                aria-controls={`faq-p${f.i}`}
                onClick={() => setOpen(open === f.i ? -1 : f.i)}
              >
                {f.q}
                <span className="wd-acc-icon shrink-0 w-9 h-9 rounded-full bg-mint grid place-items-center text-teal text-2xl leading-none" aria-hidden="true">+</span>
              </button>
            </h3>
            <div className="wd-acc-panel" id={`faq-p${f.i}`} data-open={open === f.i} role="region" aria-labelledby={`faq-b${f.i}`}>
              <div><p className="pb-6 pr-12 text-muted text-lg">{f.a}</p></div>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="mt-6 text-lg wd-swap">No question matches that yet. Call us on (555) 014-2290 and we will answer it.</p>}
    </div>
  );
}
