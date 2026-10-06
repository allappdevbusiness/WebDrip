import { useState } from 'react';
import { emailError, CheckIcon, Reveal } from './ui.jsx';

// Quarterly "bench notes" sign-up, the same on every page.
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);
  const [shake, setShake] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    const m = emailError(email);
    setErr(m);
    if (m) {
      setOk(false);
      setShake((s) => s + 1);
      return;
    }
    setOk(true);
  };

  return (
    <section id="newsletter" className="relative overflow-hidden py-20 md:py-24">
      <div className="wd-gradient absolute inset-0" data-anim="gradient-shift" aria-hidden="true" />
      <div className="wd-blob h-96 w-96 -left-16 top-0" style={{ '--blob': 'rgba(29,122,133,0.28)' }} data-anim="float-blob" aria-hidden="true" />
      <div className="wd-blob h-80 w-80 right-0 bottom-0" style={{ animationDelay: '-6s', '--blob': 'rgba(140,106,26,0.22)' }} aria-hidden="true" />
      <div className="wd-wrap relative grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div>
          <Reveal as="p" kind="left" className="wd-label mb-3">Bench notes, four times a year</Reveal>
          <Reveal as="h2" kind="blur" className="wd-h2">Care tips from the bench, not sales emails.</Reveal>
          <Reveal as="p" kind="up" i={1} className="wd-lede mt-4">
            One short letter each season: when to wind, when to worry, what we learned from the oddest watch that came in, and the
            dates we close for holidays. No discounts, no partner offers, and you can leave with one click.
          </Reveal>
        </div>
        <Reveal kind="scale" i={2}>
          <form id="newsForm" noValidate onSubmit={submit} data-widget="newsletter" className="wd-card p-6 md:p-8">
            <label htmlFor="newsEmail" className="block font-[620]">Email address</label>
            <div key={shake} className={`mt-2 flex flex-col gap-3 sm:flex-row ${shake ? 'wd-shake' : ''}`} data-anim="form-shake">
              <input
                id="newsEmail"
                type="email"
                autoComplete="email"
                className="wd-field"
                value={email}
                aria-invalid={err ? 'true' : 'false'}
                aria-describedby="newsErr"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <button type="submit" className="wd-btn wd-btn-primary shrink-0">Sign up</button>
            </div>
            <p id="newsErr" className="wd-err" role="alert">{err}</p>
            {ok ? (
              <p id="newsOk" className="wd-swap mt-1 flex items-center gap-2 font-[600] text-ok" role="status">
                <CheckIcon /> Signed up. The next bench notes arrive at the start of the season.
              </p>
            ) : null}
            <p className="mt-3 text-sm text-slate">Concept site: nothing is sent or stored.</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
