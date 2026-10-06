import { useEffect, useMemo, useRef, useState } from 'react';
import { priceTabs, tiers, tierFeatures, calc, turnaround, water, glossary, faqs } from '../data/services.js';
import { CheckIcon } from '../components/ui.jsx';

const gbp = (n) => `£${n.toLocaleString('en-GB')}`;

export function PriceTabs() {
  const [tab, setTab] = useState(priceTabs[0].id);
  const refs = useRef({});
  const idx = priceTabs.findIndex((t) => t.id === tab);
  const onKey = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = priceTabs[(idx + d + priceTabs.length) % priceTabs.length];
    setTab(next.id);
    refs.current[next.id]?.focus();
  };
  const t = priceTabs[idx];
  return (
    <div data-widget="price-tabs">
      <div role="tablist" aria-label="Price list" className="relative flex gap-2 overflow-x-auto pb-2" onKeyDown={onKey}>
        {priceTabs.map((p) => (
          <button
            key={p.id}
            id={`pt-${p.id}`}
            ref={(el) => (refs.current[p.id] = el)}
            role="tab"
            type="button"
            aria-selected={tab === p.id}
            aria-controls="ptPanel"
            tabIndex={tab === p.id ? 0 : -1}
            className="wd-chip shrink-0"
            onClick={() => setTab(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div id="ptPanel" role="tabpanel" aria-labelledby={`pt-${t.id}`} key={t.id} className="wd-swap mt-6" data-anim="tab-slide">
        <p className="max-w-2xl text-slate">{t.intro}</p>
        <table className="mt-6 w-full border-collapse text-left">
          <thead className="sr-only">
            <tr><th scope="col">Job</th><th scope="col">Price</th><th scope="col">Notes</th></tr>
          </thead>
          <tbody>
            {t.rows.map((r, i) => (
              <tr key={r.item} className="wd-swap grid grid-cols-[1fr_auto] gap-x-4 border-b border-silver-2 py-4 md:table-row" style={{ animationDelay: `${i * 45}ms` }}>
                <th scope="row" className="font-[640] md:py-4 md:pr-6">{r.item}</th>
                <td className="text-right font-[700] text-teal md:py-4 md:pr-6 md:text-left tabular-nums">{r.price}</td>
                <td className="col-span-2 text-sm text-slate md:py-4">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TierToggle() {
  const [tier, setTier] = useState('standard');
  const t = tiers[tier];
  return (
    <div data-widget="tier-toggle">
      <div className="inline-flex rounded-full border border-silver bg-white p-1" role="radiogroup" aria-label="Service level">
        {Object.entries(tiers).map(([id, v]) => (
          <button
            key={id}
            id={`tier-${id}`}
            type="button"
            role="radio"
            aria-checked={tier === id}
            onClick={() => setTier(id)}
            className={`min-h-[44px] rounded-full px-5 font-[620] transition-colors duration-300 ${tier === id ? 'bg-teal text-white' : 'text-ink hover:bg-ice'}`}
          >
            {v.name}
          </button>
        ))}
      </div>
      <div key={tier} className="wd-swap mt-8 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="text-lg text-slate">{t.blurb}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {Object.entries(t.prices).map(([k, v]) => (
              <li key={k} className="wd-card flex items-baseline justify-between p-4">
                <span className="font-[620]">{k}</span>
                <span className="text-2xl font-[760] text-teal [font-stretch:120%] tabular-nums" data-tier-price={k}>{gbp(v)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate">Usually ready in {t.weeks}.</p>
        </div>
        <ul className="wd-card divide-y divide-silver-2">
          {tierFeatures.map((f) => {
            const has = f[tier];
            return (
              <li key={f.f} className={`flex items-center gap-3 px-5 py-3.5 ${has ? '' : 'text-slate'}`} data-has={String(has)}>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${has ? 'bg-teal text-white' : 'bg-silver-2 text-slate'}`}>
                  {has ? <CheckIcon className="h-4 w-4" /> : <span aria-hidden="true">–</span>}
                </span>
                <span>{f.f}</span>
                <span className="sr-only">{has ? 'included' : 'not included'}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function EstimateCalculator() {
  const [mv, setMv] = useState('automatic');
  const [comp, setComp] = useState([]);
  const [crystal, setCrystal] = useState('none');
  const [extras, setExtras] = useState([]);
  const toggle = (list, set, id) => set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const total = useMemo(() => {
    let t = calc.movements.find((m) => m.id === mv).base;
    comp.forEach((c) => (t += calc.complications.find((x) => x.id === c).add));
    t += calc.crystals.find((c) => c.id === crystal).add;
    extras.forEach((e) => (t += calc.extras.find((x) => x.id === e).add));
    return t;
  }, [mv, comp, crystal, extras]);
  const isQuartz = mv === 'quartz';
  return (
    <div data-widget="estimate-calculator" className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-7">
        <fieldset>
          <legend className="wd-h3 mb-3">1. Movement</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {calc.movements.map((m) => (
              <label key={m.id} className={`wd-chip justify-center ${mv === m.id ? '!border-teal !bg-teal !text-white' : ''}`}>
                <input type="radio" name="mv" value={m.id} checked={mv === m.id} onChange={() => { setMv(m.id); if (m.id === 'quartz') setComp([]); }} className="sr-only" />
                {m.label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset disabled={isQuartz}>
          <legend className="wd-h3 mb-3">2. Complications {isQuartz ? <span className="text-sm font-[500] text-slate">(not for quartz)</span> : null}</legend>
          <div className="flex flex-wrap gap-2">
            {calc.complications.map((c) => (
              <label key={c.id} className={`wd-chip ${comp.includes(c.id) ? '!border-teal !bg-teal !text-white' : ''} ${isQuartz ? 'opacity-50' : ''}`}>
                <input id={`comp-${c.id}`} type="checkbox" checked={comp.includes(c.id)} onChange={() => toggle(comp, setComp, c.id)} className="sr-only" />
                {c.label} <span className="opacity-80">+{gbp(c.add)}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="wd-h3 mb-3">3. Crystal</legend>
          <div className="flex flex-wrap gap-2">
            {calc.crystals.map((c) => (
              <label key={c.id} className={`wd-chip ${crystal === c.id ? '!border-teal !bg-teal !text-white' : ''}`}>
                <input type="radio" name="crystal" value={c.id} checked={crystal === c.id} onChange={() => setCrystal(c.id)} className="sr-only" />
                {c.label} {c.add ? <span className="opacity-80">+{gbp(c.add)}</span> : null}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="wd-h3 mb-3">4. Extras</legend>
          <div className="flex flex-wrap gap-2">
            {calc.extras.map((c) => (
              <label key={c.id} className={`wd-chip ${extras.includes(c.id) ? '!border-teal !bg-teal !text-white' : ''}`}>
                <input id={`extra-${c.id}`} type="checkbox" checked={extras.includes(c.id)} onChange={() => toggle(extras, setExtras, c.id)} className="sr-only" />
                {c.label} <span className="opacity-80">+{gbp(c.add)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="wd-card overflow-hidden">
          <div className="bg-teal p-6 text-white">
            <p className="text-sm text-white/85">Estimated starting price</p>
            <p id="calcTotal" key={total} className="wd-swap mt-1 text-5xl font-[780] [font-stretch:125%] tabular-nums" aria-live="polite" data-anim="count-swap">
              {gbp(total)}
            </p>
            <p className="mt-2 text-sm text-white/85">Most watches land within 15% of this. Parts found worn at inspection are quoted separately.</p>
          </div>
          <ul className="space-y-1 p-6 text-sm text-slate">
            <li>Includes gaskets, pressure test and timing printout</li>
            <li>12-month guarantee on all work</li>
            <li>Free written estimate before anything starts</li>
          </ul>
          <div className="px-6 pb-6">
            <a href="./book.html#booking" className="wd-btn wd-btn-primary w-full">Book with this estimate</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TurnaroundEstimator() {
  const [job, setJob] = useState('full');
  const [parts, setParts] = useState('stock');
  const [ready, setReady] = useState(null);
  const j = turnaround.jobs.find((x) => x.id === job);
  const add = turnaround.parts.find((x) => x.id === parts).add;
  const lo = j.days[0] + (j.days[0] ? add : 0);
  const hi = j.days[1] + (j.days[1] ? add : 0);
  useEffect(() => {
    const fmt = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const a = new Date();
    const b = new Date();
    a.setDate(a.getDate() + lo);
    b.setDate(b.getDate() + hi);
    setReady(hi === 0 ? 'Today, while you wait' : `Between ${fmt(a)} and ${fmt(b)}`);
  }, [lo, hi]);
  return (
    <div data-widget="turnaround-estimator" className="wd-card p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="taJob" className="mb-1 block font-[620]">Type of job</label>
          <select id="taJob" className="wd-field" value={job} onChange={(e) => setJob(e.target.value)}>
            {turnaround.jobs.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="taParts" className="mb-1 block font-[620]">Parts</label>
          <select id="taParts" className="wd-field" value={parts} onChange={(e) => setParts(e.target.value)} disabled={j.days[1] === 0}>
            {turnaround.parts.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div key={`${lo}-${hi}`} className="wd-swap mt-6 rounded-xl bg-ice p-5">
        <p id="taResult" className="text-2xl font-[740] text-teal [font-stretch:115%]">
          {hi === 0 ? 'Done while you wait' : `${lo}–${hi} days`}
        </p>
        <p id="taDates" className="mt-1 text-slate">{ready || 'Working out the dates…'}</p>
      </div>
      <p className="mt-4 text-sm text-slate">Counted from the day you approve the estimate. December and the week after Easter run a few days longer.</p>
    </div>
  );
}

export function WaterGuide() {
  const [act, setAct] = useState('swim');
  const w = water.find((x) => x.id === act);
  return (
    <div data-widget="water-guide">
      <div className="flex flex-wrap gap-2" role="group" aria-label="What will you do with it?">
        {water.map((x) => (
          <button key={x.id} type="button" className="wd-chip" aria-pressed={act === x.id} onClick={() => setAct(x.id)}>
            {x.label}
          </button>
        ))}
      </div>
      <div key={act} className="wd-swap mt-6 grid gap-4 md:grid-cols-3">
        <div className="wd-card p-5">
          <p className="text-sm text-slate">Rating you need</p>
          <p id="waterNeed" className="mt-1 text-xl font-[720] text-teal">{w.need}</p>
        </div>
        <div className="wd-card p-5">
          <p className="text-sm text-slate">Suitable watches</p>
          <p className="mt-1 font-[620]">{w.ok}</p>
        </div>
        <div className="wd-card p-5">
          <p className="text-sm text-slate">Bench tip</p>
          <p className="mt-1">{w.tip}</p>
        </div>
      </div>
    </div>
  );
}

export function Accordion({ items, idPrefix, widget = 'accordion', single = true }) {
  const [open, setOpen] = useState(0);
  return (
    <div data-widget={widget} className="divide-y divide-silver-2 rounded-2xl border border-silver-2 bg-white" data-anim="accordion">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.term}>
            <h3>
              <button
                id={`${idPrefix}-b${i}`}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-p${i}`}
                onClick={() => setOpen(isOpen && single ? -1 : i)}
                className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-3 text-left font-[650]"
              >
                {it.term}
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ice text-teal transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
              </button>
            </h3>
            <div id={`${idPrefix}-p${i}`} role="region" aria-labelledby={`${idPrefix}-b${i}`} hidden={!isOpen} data-open={String(isOpen)} className={isOpen ? 'wd-drop px-5 pb-5 text-slate' : ''}>
              <p>{it.def}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FaqSearch() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(-1);
  const list = faqs.map((f, i) => ({ ...f, i })).filter((f) => !q.trim() || (f.q + ' ' + f.a).toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div data-widget="faq-search">
      <label htmlFor="faqSearch" className="block font-[620]">Search the questions</label>
      <input id="faqSearch" type="search" className="wd-field mt-2" placeholder="e.g. polish, post, guarantee" value={q} onChange={(e) => setQ(e.target.value)} />
      <p id="faqCount" className="mt-3 text-sm text-slate" aria-live="polite">
        {list.length} of {faqs.length} questions
      </p>
      <ul className="mt-4 space-y-3">
        {list.map((f) => {
          const isOpen = open === f.i;
          return (
            <li key={f.i} data-faq="" className="wd-swap wd-card overflow-hidden">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a${f.i}`}
                  onClick={() => setOpen(isOpen ? -1 : f.i)}
                  className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-3 text-left font-[650]"
                >
                  {f.q}
                  <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 text-teal transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                </button>
              </h3>
              <div id={`faq-a${f.i}`} hidden={!isOpen} className={isOpen ? 'wd-drop px-5 pb-5 text-slate' : ''}>
                <p>{f.a}</p>
              </div>
            </li>
          );
        })}
      </ul>
      {list.length === 0 ? (
        <p id="faqEmpty" className="wd-swap mt-4 rounded-xl border border-dashed border-silver p-6 text-center">
          No question matches that. Ask us directly on the booking page and we’ll answer within a working day.
        </p>
      ) : null}
    </div>
  );
}
