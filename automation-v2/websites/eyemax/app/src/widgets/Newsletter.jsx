import { useState } from 'react';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);
  const [shake, setShake] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    const v = email.trim();
    const msg = !v ? 'Enter your email to get the letter.' : !EMAIL.test(v) ? 'That email looks incomplete. Check the part after the @.' : '';
    setErr(msg);
    if (msg) {
      setOk(false);
      setShake((s) => s + 1);
      return;
    }
    setOk(true);
    setEmail('');
  };

  return (
    <form id="newsForm" noValidate onSubmit={submit} data-widget="newsletter" className={shake ? 'wd-shake' : ''} key={shake} data-anim="form-shake">
      <label htmlFor="newsEmail" className="block font-display text-xl font-bold mb-1">The EyeMax letter</label>
      <p className="text-muted text-[0.95rem] mb-3">Four emails a year: exam reminders, new frame makers and one useful eye tip. No offers you did not ask for.</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="newsEmail"
          type="email"
          className="wd-input"
          placeholder="you@example.com"
          value={email}
          aria-invalid={err ? 'true' : 'false'}
          aria-describedby="newsErr"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="wd-btn wd-btn-teal shrink-0">Subscribe</button>
      </div>
      <p id="newsErr" className="wd-err mt-1" role="alert">{err}</p>
      {ok && (
        <p id="newsOk" className="wd-pop flex items-center gap-2 font-semibold text-teal" role="status">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 12l5 5L20 6" /></svg>
          Subscribed. The next letter goes out at the start of the season.
        </p>
      )}
    </form>
  );
}
