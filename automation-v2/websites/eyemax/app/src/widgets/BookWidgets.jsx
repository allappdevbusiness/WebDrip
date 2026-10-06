import { useEffect, useRef, useState } from 'react';
import { services, slots, lateSlots, bring, timetable, transit, gallery } from '../data/book.js';
import { hours } from '../data/site.js';
import { Img, money } from '../components/ui.jsx';

const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ---------- appointment picker (no backend) ---------- */
export function BookingPicker() {
  const [service, setService] = useState('essential');
  const [days, setDays] = useState([]);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const out = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    while (out.length < 10) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) out.push({ key: d.toISOString().slice(0, 10), dow: d.getDay(), label: `${DAY[d.getDay()]} ${d.getDate()} ${MONTH[d.getMonth()]}` });
    }
    setDays(out);
  }, []);

  const svc = services.find((s) => s.id === service);
  const d = days.find((x) => x.key === day);
  const dayHours = d && hours.find((h) => h.day === d.dow);
  const times = d ? [...slots, ...(d.dow === 4 ? lateSlots : [])].filter((t) => parseFloat(t) < dayHours.close - 0.5) : [];
  // a few slots shown as taken so the grid looks like a real diary
  const taken = (t, i) => d && (i + d.dow * 3) % 4 === 0;

  return (
    <div data-widget="booking-picker" className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-8">
        <fieldset>
          <legend className="font-display text-2xl font-bold mb-3">1. Choose an appointment</legend>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {services.map((s) => (
              <label key={s.id} className={`flex flex-col justify-center min-h-16 rounded-2xl border-2 px-4 py-3 cursor-pointer transition-all duration-300 ${service === s.id ? 'border-teal bg-mint' : 'border-teal/15 bg-white hover:border-teal/40'}`}>
                <input type="radio" name="bookService" value={s.id} checked={service === s.id} onChange={() => { setService(s.id); setHeld(false); }} className="sr-only" />
                <span className="font-semibold leading-tight">{s.label}</span>
                <span className="text-sm text-muted">{s.mins} min, {s.price ? money(s.price) : 'free'}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-display text-2xl font-bold mb-3">2. Pick a day</legend>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" id="dayList">
            {days.length === 0 && <p className="text-muted">Loading the next two weeks of the diary.</p>}
            {days.map((x) => (
              <button key={x.key} type="button" className="wd-chip shrink-0" aria-pressed={day === x.key} onClick={() => { setDay(x.key); setTime(null); setHeld(false); }} data-day={x.key}>{x.label}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-display text-2xl font-bold mb-3">3. Choose a time</legend>
          {!d ? (
            <p className="text-muted">Pick a day to see the free times.</p>
          ) : (
            <div key={day} className="wd-swap grid grid-cols-3 sm:grid-cols-5 gap-2" id="timeGrid">
              {times.map((t, i) => (
                <button key={t} type="button" className="wd-chip justify-center disabled:opacity-60 disabled:line-through disabled:cursor-not-allowed" disabled={taken(t, i)} aria-pressed={time === t} onClick={() => { setTime(t); setHeld(false); }}>{t}</button>
              ))}
            </div>
          )}
        </fieldset>
      </div>
      <aside className="lg:col-span-4">
        <div className="wd-card p-7 lg:sticky lg:top-28" id="bookSummary">
          <h3 className="text-2xl">Your appointment</h3>
          <dl className="mt-4 space-y-2">
            <div className="flex justify-between gap-4"><dt className="text-muted">Type</dt><dd key={service} className="wd-swap font-semibold text-right">{svc.label}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Day</dt><dd key={day || 'x'} className="wd-swap font-semibold text-right">{d ? d.label : 'Not chosen'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Time</dt><dd key={time || 'y'} className="wd-swap font-semibold text-right" id="sumTime">{time || 'Not chosen'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Price</dt><dd className="font-semibold">{svc.price ? money(svc.price) : 'Free'}</dd></div>
          </dl>
          <button type="button" id="holdBtn" className="wd-btn wd-btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!d || !time} onClick={() => setHeld(true)}>Hold this time</button>
          {held && (
            <p className="wd-pop mt-4 rounded-2xl bg-mint p-4 font-semibold" role="status" id="holdOk">
              Held for 15 minutes. Reference EM-{day.replaceAll('-', '').slice(2)}-{time.replace(':', '')}. Add your details in the form below and we will confirm by email. (Concept site: nothing is actually booked.)
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

/* ---------- what-to-bring checklist ---------- */
export function Checklist() {
  const [done, setDone] = useState([]);
  const pct = Math.round((done.length / bring.length) * 100);
  return (
    <div data-widget="checklist" className="wd-card p-7">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl">What to bring</h3>
        <span className="font-display text-2xl font-bold text-teal" id="checkPct">{pct}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-mint mt-4 overflow-hidden" aria-hidden="true">
        <div className="h-full bg-coral origin-left transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]" style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
      <ul className="mt-5 space-y-2">
        {bring.map((b, i) => (
          <li key={b}>
            <label className={`flex gap-3 items-start min-h-12 rounded-xl px-3 py-2.5 cursor-pointer transition-colors ${done.includes(i) ? 'bg-mint' : 'hover:bg-paper'}`}>
              <input type="checkbox" className="mt-1 w-5 h-5 accent-[#0E5E63] shrink-0" checked={done.includes(i)} onChange={() => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))} />
              <span className={done.includes(i) ? 'line-through text-muted' : ''}>{b}</span>
            </label>
          </li>
        ))}
      </ul>
      {pct === 100 && <p className="wd-pop mt-4 font-semibold text-teal" id="checkDone">All packed. See you soon.</p>}
    </div>
  );
}

/* ---------- clinic timetable with day tabs ---------- */
export function Timetable() {
  const days = Object.keys(timetable);
  const [d, setD] = useState('Mon');
  const ref = useRef([]);
  const onKey = (e, i) => {
    const n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!n) return;
    const next = (i + n + days.length) % days.length;
    setD(days[next]);
    ref.current[next]?.focus();
  };
  return (
    <div data-widget="timetable">
      <div role="tablist" aria-label="Day of the week" className="flex gap-2 overflow-x-auto pb-2">
        {days.map((x, i) => (
          <button
            key={x}
            ref={(el) => (ref.current[i] = el)}
            role="tab"
            type="button"
            id={`tt-${x}`}
            aria-selected={d === x}
            aria-controls="ttPanel"
            tabIndex={d === x ? 0 : -1}
            className="wd-chip shrink-0 min-w-16 justify-center"
            onClick={() => setD(x)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {x}
          </button>
        ))}
      </div>
      <ul id="ttPanel" role="tabpanel" aria-labelledby={`tt-${d}`} key={d} className="wd-swap mt-5 grid gap-3 md:grid-cols-2" data-anim="tab-swap">
        {timetable[d].map((s, i) => (
          <li key={s.title + s.time} style={{ '--i': i }} className="wd-card p-5 flex gap-4 items-start">
            <span className="rounded-xl bg-blush px-3 py-2 font-semibold text-sm whitespace-nowrap">{s.time}</span>
            <div>
              <h3 className="text-xl">{s.title}</h3>
              <p className="text-muted">{s.who}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- illustrated map with travel tabs ---------- */
const ROUTES = {
  walk: 'M40 250 C 90 240, 120 200, 170 190 S 250 170, 300 150',
  bus: 'M20 120 L 120 120 L 200 140 L 300 150',
  bike: 'M60 30 C 80 90, 140 90, 180 120 S 260 140, 300 150',
  car: 'M480 260 L 420 220 L 360 180 L 300 150',
};

export function MapTransit() {
  const [mode, setMode] = useState('walk');
  const t = transit[mode];
  return (
    <div data-widget="map-transit" className="grid gap-8 lg:grid-cols-12 items-start">
      <div className="lg:col-span-7 wd-card overflow-hidden">
        <svg viewBox="0 0 500 300" className="w-full block bg-[#EEF5F3]" role="img" aria-label={`Illustrated map: ${t.label} route to EyeMax`}>
          <rect x="0" y="0" width="500" height="300" fill="#EEF5F3" />
          <path d="M0 210 Q 250 170 500 230" stroke="#BFDCE0" strokeWidth="26" fill="none" />
          <g stroke="#FFFFFF" strokeWidth="14" fill="none" strokeLinecap="round">
            <path d="M0 120 H500" /><path d="M300 0 V300" /><path d="M120 0 L 200 300" /><path d="M380 300 L 460 0" />
          </g>
          <rect x="315" y="60" width="90" height="50" rx="8" fill="#F6EFE0" stroke="#D9C9A6" />
          <text x="360" y="90" textAnchor="middle" fontSize="12" fill="#42575B">Covered market</text>
          <rect x="20" y="230" width="70" height="40" rx="8" fill="#FCE7E1" stroke="#F0B3A5" />
          <text x="55" y="255" textAnchor="middle" fontSize="11" fill="#42575B">Station</text>
          <text x="250" y="200" fontSize="11" fill="#5C7E83" transform="rotate(-6 250 200)">Larkfield river path</text>
          <path key={mode} d={ROUTES[mode]} stroke="#F0705A" strokeWidth="5" strokeDasharray="8 7" fill="none" strokeLinecap="round" className="wd-route" />
          <g transform="translate(300 150)">
            <circle r="22" fill="#0E5E63" className="wd-map-pin" />
            <circle cx="-7" cy="0" r="5" fill="none" stroke="#fff" strokeWidth="2.5" />
            <circle cx="7" cy="0" r="5" fill="none" stroke="#F0705A" strokeWidth="2.5" />
          </g>
          <text x="300" y="190" textAnchor="middle" fontSize="13" fontWeight="700" fill="#10252A">EyeMax</text>
        </svg>
      </div>
      <div className="lg:col-span-5">
        <div role="tablist" aria-label="How are you travelling?" className="flex flex-wrap gap-2">
          {Object.entries(transit).map(([k, v]) => (
            <button key={k} type="button" role="tab" id={`tr-${k}`} aria-selected={mode === k} aria-controls="trPanel" className="wd-chip" onClick={() => setMode(k)}>{v.label}</button>
          ))}
        </div>
        <div id="trPanel" role="tabpanel" aria-labelledby={`tr-${mode}`} key={mode} className="wd-swap mt-6">
          <p className="font-display text-3xl font-bold text-teal">{t.time}</p>
          <p className="text-lg text-muted mt-3">{t.text}</p>
        </div>
        <p className="mt-6 text-sm text-muted">Illustrated map of a fictional location. No external map service is used.</p>
      </div>
    </div>
  );
}

/* ---------- gallery with lightbox ---------- */
export function Gallery() {
  const [open, setOpen] = useState(-1);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  useEffect(() => {
    if (open < 0) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(-1);
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open >= 0]);
  useEffect(() => {
    if (open < 0 && lastFocus.current) lastFocus.current.focus();
  }, [open]);
  return (
    <div data-widget="gallery-lightbox">
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5" data-reveal data-anim="stagger">
        {gallery.map((g, i) => (
          <li key={g.photo} style={{ '--i': i }} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
            <button type="button" className="wd-media wd-sheen block w-full h-full aspect-square rounded-2xl" onClick={(e) => { lastFocus.current = e.currentTarget; setOpen(i); }} aria-label={`Open photo: ${g.caption}`} data-anim="img-zoom">
              <Img k={g.photo} alt={g.caption} />
            </button>
          </li>
        ))}
      </ul>
      {open >= 0 && (
        <div className="wd-lightbox fixed inset-0 z-[80] bg-[rgba(16,37,42,0.88)] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Photo viewer" id="lightbox" onClick={(e) => e.target === e.currentTarget && setOpen(-1)}>
          <figure key={open} className="max-w-5xl w-full">
            <Img k={gallery[open].photo} alt={gallery[open].caption} loading="eager" className="w-full max-h-[75vh] object-contain rounded-2xl" />
            <figcaption className="text-white text-center mt-4 text-lg">{gallery[open].caption} ({open + 1} of {gallery.length})</figcaption>
          </figure>
          <button ref={closeRef} type="button" id="lbClose" className="absolute top-4 right-4 wd-btn wd-btn-ghost" onClick={() => setOpen(-1)}>Close</button>
          <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 wd-btn wd-btn-ghost w-12 px-0" aria-label="Previous photo" onClick={() => setOpen((open - 1 + gallery.length) % gallery.length)}>&#8249;</button>
          <button type="button" id="lbNext" className="absolute right-3 top-1/2 -translate-y-1/2 wd-btn wd-btn-ghost w-12 px-0" aria-label="Next photo" onClick={() => setOpen((open + 1) % gallery.length)}>&#8250;</button>
        </div>
      )}
    </div>
  );
}

/* ---------- contact form with validation ---------- */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const [v, setV] = useState({ name: '', email: '', phone: '', topic: 'booking', message: '' });
  const [err, setErr] = useState({});
  const [ok, setOk] = useState(false);
  const [shake, setShake] = useState(0);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!v.name.trim()) er.name = 'Add your name so we know who to reply to.';
    if (!v.email.trim()) er.email = 'Please enter your email address.';
    else if (!EMAIL.test(v.email.trim())) er.email = 'That email looks incomplete. Check the part after the @.';
    if (v.phone.trim() && !/^[+()\d\s-]{7,}$/.test(v.phone.trim())) er.phone = 'Use digits, spaces or dashes only.';
    if (v.message.trim().length < 10) er.message = 'Tell us a little more (at least 10 characters).';
    setErr(er);
    if (Object.keys(er).length) {
      setOk(false);
      setShake((s) => s + 1);
      return;
    }
    setOk(true);
    setV({ name: '', email: '', phone: '', topic: 'booking', message: '' });
  };

  const field = (k, label, props = {}) => (
    <div>
      <label htmlFor={k} className="block font-semibold mb-1">{label}</label>
      {props.as === 'textarea' ? (
        <textarea id={k} rows="5" className="wd-input" value={v[k]} onChange={set(k)} aria-invalid={err[k] ? 'true' : 'false'} aria-describedby={`${k}Err`} />
      ) : (
        <input id={k} type={props.type || 'text'} autoComplete={props.auto} className="wd-input" value={v[k]} onChange={set(k)} aria-invalid={err[k] ? 'true' : 'false'} aria-describedby={`${k}Err`} />
      )}
      <p id={`${k}Err`} className="wd-err mt-1">{err[k] || ''}</p>
    </div>
  );

  return (
    <form id="contactForm" noValidate onSubmit={submit} data-widget="contact-form" className={`wd-card p-7 md:p-9 space-y-3 ${shake ? 'wd-shake' : ''}`} key={shake} data-anim="form-shake">
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
        {field('name', 'Your name', { auto: 'name' })}
        {field('email', 'Email', { type: 'email', auto: 'email' })}
        {field('phone', 'Phone (optional)', { type: 'tel', auto: 'tel' })}
        <div>
          <label htmlFor="topic" className="block font-semibold mb-1">What is it about?</label>
          <select id="topic" className="wd-input" value={v.topic} onChange={set('topic')}>
            <option value="booking">Confirming a booking</option>
            <option value="glasses">Glasses or lenses</option>
            <option value="contacts">Contact lenses</option>
            <option value="repair">A repair</option>
            <option value="other">Something else</option>
          </select>
        </div>
      </div>
      {field('message', 'Message', { as: 'textarea' })}
      <button type="submit" className="wd-btn wd-btn-teal">Send message</button>
      {ok && (
        <p id="contactOk" className="wd-pop flex items-center gap-3 rounded-2xl bg-mint p-4 font-semibold" role="status">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-teal" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 12l5 5L20 6" className="wd-draw" style={{ '--len': 30 }} /></svg>
          Message sent. We reply within one working day. (Concept site: nothing is actually sent.)
        </p>
      )}
    </form>
  );
}
