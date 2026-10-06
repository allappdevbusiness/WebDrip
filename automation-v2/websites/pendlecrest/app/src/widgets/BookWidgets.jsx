import { useEffect, useRef, useState } from 'react';
import { bookingServices, quiz, recommend, checklist, timetable, gallery, directions, tickets, trackStages } from '../data/book.js';
import { hours, fmtTime } from '../data/site.js';
import { photos } from '../data/photos.js';
import { CheckIcon, emailError } from '../components/ui.jsx';

// Next open counter days, built on the client (dates differ per visitor).
function openDays(count = 8) {
  const out = [];
  const d = new Date();
  for (let k = 1; out.length < count && k < 30; k++) {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + k);
    const h = hours.find((x) => x.day === day.getDay());
    if (h.open == null) continue;
    const slots = [];
    for (let t = h.open; t + 0.5 <= h.close; t += 0.5) {
      // a believable spread of already-booked slots, stable for each date
      const taken = (day.getDate() * 7 + Math.round(t * 2) * 3) % 5 === 0;
      slots.push({ t, taken });
    }
    out.push({ key: day.toISOString().slice(0, 10), label: day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }), slots });
  }
  return out;
}

export function BookingPicker() {
  const [svc, setSvc] = useState('');
  const [days, setDays] = useState(null);
  const [day, setDay] = useState('');
  const [time, setTime] = useState(null);
  const [ref, setRef] = useState('');
  useEffect(() => setDays(openDays()), []);
  const chosenDay = days?.find((d) => d.key === day);
  const svcLabel = bookingServices.find((s) => s.id === svc)?.label;
  const ready = svc && day && time != null;
  const hold = () => {
    const n = 2400 + ((day.split('-').join('') * 1 + Math.round(time * 2)) % 600);
    setRef(`PW-${n}`);
  };
  return (
    <div data-widget="booking-picker" className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-8">
        <fieldset>
          <legend className="wd-h3 mb-3">1. What’s the visit for?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {bookingServices.map((s) => (
              <label key={s.id} className={`wd-chip !justify-between !rounded-xl !px-4 ${svc === s.id ? '!border-teal !bg-teal !text-white' : ''}`}>
                <input type="radio" name="bsvc" value={s.id} checked={svc === s.id} onChange={() => { setSvc(s.id); setRef(''); }} className="sr-only" />
                <span>{s.label}</span>
                <span className="text-sm opacity-80">{s.mins} min</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="wd-h3 mb-3">2. Choose a day</legend>
          {days ? (
            <div id="dayList" className="flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => (
                <button key={d.key} type="button" className="wd-chip shrink-0" aria-pressed={day === d.key} onClick={() => { setDay(d.key); setTime(null); setRef(''); }}>
                  {d.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate">Loading the next open days…</p>
          )}
        </fieldset>
        <fieldset>
          <legend className="wd-h3 mb-3">3. Pick a time</legend>
          {chosenDay ? (
            <div id="timeGrid" key={day} className="wd-swap grid grid-cols-3 gap-2 sm:grid-cols-5">
              {chosenDay.slots.map((s) => (
                <button
                  key={s.t}
                  type="button"
                  disabled={s.taken}
                  aria-pressed={time === s.t}
                  onClick={() => { setTime(s.t); setRef(''); }}
                  className={`wd-chip justify-center tabular-nums ${s.taken ? 'cursor-not-allowed line-through opacity-40' : ''}`}
                  aria-label={s.taken ? `${fmtTime(s.t)}, already booked` : fmtTime(s.t)}
                >
                  {fmtTime(s.t)}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate">Choose a day to see free times. Crossed-out times are already booked.</p>
          )}
        </fieldset>
      </div>
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="wd-card p-6">
          <h3 className="wd-h3 text-lg">Your visit</h3>
          <dl className="mt-4 space-y-3 text-[0.97rem]">
            <div className="flex justify-between gap-4"><dt className="text-slate">Visit</dt><dd id="sumSvc" className="text-right font-[620]">{svcLabel || 'Not chosen'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate">Day</dt><dd id="sumDay" className="text-right font-[620]">{chosenDay?.label || 'Not chosen'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate">Time</dt><dd id="sumTime" className="text-right font-[620]">{time != null ? fmtTime(time) : 'Not chosen'}</dd></div>
          </dl>
          <button id="holdBtn" type="button" className="wd-btn wd-btn-primary mt-6 w-full" disabled={!ready} onClick={hold}>
            Hold this slot
          </button>
          {ref ? (
            <p id="holdOk" className="wd-swap mt-4 flex items-start gap-2 rounded-xl bg-ok/10 p-3 text-[0.95rem] text-ok" role="status">
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <span>Held for you. Reference {ref}. Concept site, so no real booking was made.</span>
            </p>
          ) : (
            <p className="mt-4 text-sm text-slate">Slots are held for 24 hours. No payment is taken until the work is done.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

export function ServiceQuiz() {
  const [answers, setAnswers] = useState([]);
  const step = answers.length;
  const done = step >= quiz.length;
  const result = done ? recommend(answers) : null;
  return (
    <div id="quiz" data-widget="service-quiz" className="wd-card mx-auto max-w-2xl overflow-hidden">
      <div className="h-1.5 bg-silver-2" aria-hidden="true">
        <div className="h-full origin-left bg-brass transition-transform duration-500" style={{ transform: `scaleX(${step / quiz.length})` }} />
      </div>
      <div className="p-6 md:p-8" aria-live="polite">
        {!done ? (
          <div key={step} className="wd-swap">
            <p className="text-sm font-[620] text-brass">Question {step + 1} of {quiz.length}</p>
            <h3 className="wd-h3 mt-1 text-2xl">{quiz[step].q}</h3>
            <div className="mt-5 grid gap-2">
              {quiz[step].options.map((o) => (
                <button key={o.tag} type="button" className="wd-chip !min-h-[52px] !justify-start !rounded-xl !px-5 text-left" onClick={() => setAnswers((a) => [...a, o.tag])}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div id="quizResult" className="wd-swap">
            <p className="text-sm font-[620] text-brass">Our suggestion</p>
            <h3 className="wd-h3 mt-1 text-2xl">{result.name}</h3>
            <p className="mt-1 text-xl font-[720] text-teal">{result.price}</p>
            <p className="mt-3 text-slate">{result.why}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#booking" className="wd-btn wd-btn-primary">Book a slot for this</a>
              <button id="quizRestart" type="button" className="wd-btn wd-btn-ghost" onClick={() => setAnswers([])}>Start again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PostalChecklist() {
  const [done, setDone] = useState([]);
  const pct = Math.round((done.length / checklist.length) * 100);
  return (
    <div data-widget="postal-checklist" className="wd-card p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h3 className="wd-h3 text-lg">Packing checklist</h3>
        <span id="checkPct" className="font-[720] tabular-nums text-teal">{pct}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-silver-2" aria-hidden="true">
        <div className="h-full origin-left rounded-full bg-teal transition-transform duration-500" style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
      <ul className="mt-5 space-y-2">
        {checklist.map((c, i) => {
          const on = done.includes(i);
          return (
            <li key={i}>
              <label className={`flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${on ? 'bg-ice' : 'hover:bg-frost'}`}>
                <input type="checkbox" checked={on} onChange={() => setDone((d) => (on ? d.filter((x) => x !== i) : [...d, i]))} className="mt-1 h-5 w-5 shrink-0 accent-teal" />
                <span className={on ? 'text-slate line-through' : ''}>{c}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {pct === 100 ? (
        <p id="checkDone" className="wd-swap mt-4 flex items-center gap-2 font-[640] text-ok" role="status">
          <CheckIcon /> Ready to post. Send it to {`14 Ropewalk Yard, Pendle Street, HG4 7RW`}.
        </p>
      ) : null}
    </div>
  );
}

export function BenchTimetable() {
  const keys = Object.keys(timetable);
  const [tab, setTab] = useState('Tue');
  const refs = useRef({});
  const onKey = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = keys[(keys.indexOf(tab) + d + keys.length) % keys.length];
    setTab(next);
    refs.current[next]?.focus();
  };
  const t = timetable[tab];
  return (
    <div data-widget="bench-timetable">
      <div role="tablist" aria-label="Day of the week" className="flex gap-2 overflow-x-auto pb-2" onKeyDown={onKey}>
        {keys.map((k) => (
          <button key={k} id={`tt-${k}`} ref={(el) => (refs.current[k] = el)} role="tab" type="button" aria-selected={tab === k} aria-controls="ttPanel" tabIndex={tab === k ? 0 : -1} className="wd-chip shrink-0 !px-5" onClick={() => setTab(k)}>
            {k}
          </button>
        ))}
      </div>
      <div id="ttPanel" role="tabpanel" aria-labelledby={`tt-${tab}`} key={tab} className="wd-swap mt-5 grid gap-5 md:grid-cols-[1fr_1.6fr]">
        <div className="rounded-2xl bg-teal p-6 text-white">
          <p className="text-sm text-white/85">{t.counter}</p>
          <p className="mt-1 text-2xl font-[740] [font-stretch:115%]">{t.title}</p>
        </div>
        <ul className="space-y-2">
          {t.items.map((it, i) => (
            <li key={it} className="wd-swap flex items-center gap-3 rounded-xl border border-silver-2 bg-white px-4 py-3" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="h-2 w-2 rounded-full bg-brass" aria-hidden="true" />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function GalleryLightbox() {
  const [open, setOpen] = useState(-1);
  const closeRef = useRef(null);
  const n = gallery.length;
  useEffect(() => {
    if (open < 0) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(-1);
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % n);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + n) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, n]);
  const g = open >= 0 ? gallery[open] : null;
  return (
    <div data-widget="gallery-lightbox">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((it, i) => (
          <li key={it.photo} data-reveal="scale" data-anim="scale-in" style={{ '--i': i % 3 }}>
            <button type="button" onClick={() => setOpen(i)} className="wd-zoom group relative block aspect-[4/3] w-full overflow-hidden rounded-[14px] text-left" aria-label={`Open photo: ${it.caption}`} data-anim="zoom-hover">
              <img src={photos[it.photo].src} alt={photos[it.photo].alt} loading="lazy" className="wd-img" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 pt-10 text-sm font-[560] text-white">{it.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      {g ? (
        <div id="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" className="wd-lightbox fixed inset-0 z-[70] grid place-items-center bg-ink/85 p-4" onClick={(e) => e.target === e.currentTarget && setOpen(-1)}>
          <figure key={open} className="relative w-full max-w-4xl">
            <img src={photos[g.photo].src} alt={photos[g.photo].alt} className="max-h-[72vh] w-full rounded-2xl object-contain" />
            <figcaption className="mt-3 text-center text-white">
              {g.caption} ({open + 1} of {n})
            </figcaption>
            <div className="mt-4 flex justify-center gap-3">
              <button id="lbPrev" type="button" className="wd-btn wd-btn-light" onClick={() => setOpen((i) => (i - 1 + n) % n)}>Previous</button>
              <button id="lbClose" ref={closeRef} type="button" className="wd-btn wd-btn-light" onClick={() => setOpen(-1)}>Close</button>
              <button id="lbNext" type="button" className="wd-btn wd-btn-light" onClick={() => setOpen((i) => (i + 1) % n)}>Next</button>
            </div>
          </figure>
        </div>
      ) : null}
    </div>
  );
}

export function DirectionsTabs() {
  const keys = Object.keys(directions);
  const [tab, setTab] = useState('tram');
  return (
    <div data-widget="directions-tabs">
      <div role="tablist" aria-label="How are you travelling?" className="flex flex-wrap gap-2">
        {keys.map((k) => (
          <button key={k} id={`tr-${k}`} role="tab" type="button" aria-selected={tab === k} aria-controls="trPanel" className="wd-chip" onClick={() => setTab(k)}>
            {directions[k].label}
          </button>
        ))}
      </div>
      <p id="trPanel" role="tabpanel" aria-labelledby={`tr-${tab}`} key={tab} className="wd-swap mt-4 rounded-xl bg-white p-4 text-slate">
        {directions[tab].text}
      </p>
    </div>
  );
}

export function TicketTracker() {
  const [val, setVal] = useState('');
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const v = val.trim().toUpperCase();
    if (!/^PW-\d{4}$/.test(v)) {
      setRes(null);
      setErr('Ticket numbers look like PW-2417: the letters PW, a dash and four digits.');
      return;
    }
    const t = tickets[v];
    setErr(t ? '' : `We can’t find ${v}. Try one of the sample tickets below.`);
    setRes(t ? { ...t, id: v } : null);
  };
  return (
    <div data-widget="ticket-tracker" className="wd-card p-6 md:p-8">
      <form id="trackForm" noValidate onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="ticket" className="mb-1 block font-[620]">Ticket number</label>
          <input id="ticket" className="wd-field uppercase" placeholder="PW-0000" value={val} onChange={(e) => setVal(e.target.value)} aria-invalid={err ? 'true' : 'false'} aria-describedby="ticketErr" />
        </div>
        <button type="submit" className="wd-btn wd-btn-primary">Track repair</button>
      </form>
      <p id="ticketErr" className="wd-err" role="alert">{err}</p>
      <p className="text-sm text-slate">Sample tickets to try: PW-2417, PW-2388, PW-2302.</p>
      {res ? (
        <div id="trackResult" key={res.id} className="wd-swap mt-6">
          <p className="font-[680]">{res.id}: {res.watch}</p>
          <ol className="mt-4 grid grid-cols-6 gap-1" aria-label="Repair progress">
            {trackStages.map((s, i) => (
              <li key={s} className="text-center">
                <span className={`mx-auto block h-2 rounded-full transition-colors duration-500 ${i <= res.stage ? 'bg-teal' : 'bg-silver-2'}`} style={{ transitionDelay: `${i * 90}ms` }} />
                <span className={`mt-2 block text-[0.7rem] leading-tight sm:text-xs ${i === res.stage ? 'font-[700] text-teal' : 'text-slate'}`}>{s}</span>
              </li>
            ))}
          </ol>
          <p id="trackStage" className="mt-4 rounded-xl bg-ice p-4">Now: {trackStages[res.stage]}. {res.note}</p>
        </div>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', watch: '', message: '' });
  const [errs, setErrs] = useState({});
  const [ok, setOk] = useState(false);
  const [shake, setShake] = useState(0);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const n = {
      name: f.name.trim() ? '' : 'Please enter your name.',
      email: emailError(f.email),
      message: f.message.trim().length >= 10 ? '' : 'Tell us a little more: at least 10 characters about the watch or your question.',
    };
    setErrs(n);
    const bad = Object.values(n).some(Boolean);
    setOk(!bad);
    if (bad) setShake((s) => s + 1);
  };
  return (
    <form id="contactForm" noValidate onSubmit={submit} data-widget="contact-form" className="wd-card p-6 md:p-8">
      <div key={shake} className={`grid gap-5 sm:grid-cols-2 ${shake ? 'wd-shake' : ''}`} data-anim="form-shake">
        <div>
          <label htmlFor="name" className="mb-1 block font-[620]">Your name</label>
          <input id="name" className="wd-field" autoComplete="name" value={f.name} onChange={set('name')} aria-invalid={errs.name ? 'true' : 'false'} aria-describedby="nameErr" />
          <p id="nameErr" className="wd-err" role="alert">{errs.name || ''}</p>
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block font-[620]">Email</label>
          <input id="email" type="email" className="wd-field" autoComplete="email" value={f.email} onChange={set('email')} aria-invalid={errs.email ? 'true' : 'false'} aria-describedby="emailErr" />
          <p id="emailErr" className="wd-err" role="alert">{errs.email || ''}</p>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="watchType" className="mb-1 block font-[620]">What kind of watch? (optional)</label>
          <select id="watchType" className="wd-field" value={f.watch} onChange={set('watch')}>
            <option value="">Choose one</option>
            <option>Automatic or hand-wound wristwatch</option>
            <option>Quartz wristwatch</option>
            <option>Pocket watch</option>
            <option>Small clock</option>
            <option>Not sure</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1 block font-[620]">Your question</label>
          <textarea id="message" rows="5" className="wd-field" value={f.message} onChange={set('message')} aria-invalid={errs.message ? 'true' : 'false'} aria-describedby="messageErr" placeholder="What’s it doing, roughly how old is it, and is there a date you need it back by?" />
          <p id="messageErr" className="wd-err" role="alert">{errs.message || ''}</p>
        </div>
      </div>
      <button type="submit" className="wd-btn wd-btn-primary mt-2">Send question</button>
      {ok ? (
        <p id="contactOk" className="wd-swap mt-4 flex items-center gap-2 font-[640] text-ok" role="status">
          <CheckIcon /> Thanks, {f.name.trim()}. A watchmaker will reply within one working day. (Concept site: nothing was sent.)
        </p>
      ) : null}
    </form>
  );
}
