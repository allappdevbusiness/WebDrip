import { useRef, useState } from 'react';
import { visit } from '../data.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v) {
  const e = { name: '', email: '' };
  if (!v.name.trim()) e.name = 'Please enter your name.';
  if (!v.email.trim()) e.email = 'Please enter your email.';
  else if (!EMAIL.test(v.email.trim())) e.email = 'That email looks incomplete. Check it and try again.';
  return e;
}

export default function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', occasion: visit.occasions[0], date: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [sent, setSent] = useState(false);
  const formRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const set = (k) => (ev) => {
    setValues((v) => ({ ...v, [k]: ev.target.value }));
    if (sent) setSent(false);
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const e = validate(values);
    setErrors(e);
    if (e.name || e.email) {
      setSent(false);
      const form = formRef.current;
      form.classList.remove('wd-shake');
      void form.offsetWidth; // restart the shake animation
      form.classList.add('wd-shake');
      (e.name ? nameRef : emailRef).current.focus();
      return;
    }
    setSent(true);
  };

  return (
    <form id="bookForm" ref={formRef} className="wd-card wd-form" noValidate onSubmit={onSubmit} data-reveal="up">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="wd-field">
          <label htmlFor="name">Your name</label>
          <input
            id="name"
            ref={nameRef}
            name="fullname"
            autoComplete="name"
            value={values.name}
            onChange={set('name')}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby="nameErr"
          />
          <p id="nameErr" className="wd-err" aria-live="polite">{errors.name}</p>
        </div>
        <div className="wd-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            ref={emailRef}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby="emailErr"
          />
          <p id="emailErr" className="wd-err" aria-live="polite">{errors.email}</p>
        </div>
        <div className="wd-field">
          <label htmlFor="occasion">What’s it for?</label>
          <select id="occasion" name="occasion" value={values.occasion} onChange={set('occasion')}>
            {visit.occasions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="wd-field">
          <label htmlFor="date">Preferred day <span className="wd-optional">(optional)</span></label>
          <input id="date" name="day" type="date" value={values.date} onChange={set('date')} />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" className="wd-btn wd-btn-primary wd-sheen">Book my fitting</button>
        <a href="#hire" className="wd-btn wd-btn-ghost">See hire prices</a>
      </div>
      <p id="formOk" className="wd-ok" role="status" hidden={!sent}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path className="wd-check" d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        Thanks, {values.name.trim().split(' ')[0] || 'there'}. This is a demo site, so nothing was sent, but on the real site we’d email you to confirm.
      </p>
    </form>
  );
}
