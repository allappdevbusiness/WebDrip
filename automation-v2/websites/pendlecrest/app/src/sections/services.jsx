import { useEffect, useRef } from 'react';
import { subscribe, state, clamp, docRect, cached } from '../motion.js';
import { Reveal, Words, SectionHead, Ticks, Photo, Btn } from '../components/ui.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { header, inside, glossary, care, guarantee } from '../data/services.js';
import { PriceTabs, TierToggle, EstimateCalculator, TurnaroundEstimator, WaterGuide, Accordion, FaqSearch } from '../widgets/ServiceWidgets.jsx';

export function ServicesHeader() {
  return (
    <PageHeader
      label={header.label}
      title={header.title}
      lede={header.lede}
      photo="movementTools"
      actions={[{ href: '#estimate', label: 'Work out an estimate' }, { href: '#faq', label: 'Read the FAQ' }]}
    />
  );
}

export function Prices() {
  return (
    <section id="prices" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap grid gap-12 lg:grid-cols-[0.8fr_1.6fr]">
        <div>
          <SectionHead label="Price list" title="Starting prices, by kind of work." />
          <Reveal as="p" kind="up" className="mt-5 text-slate">
            Prices include VAT, the gaskets your watch needs, a pressure test and the timing printout. Parts are listed separately when
            we have to replace them, at the price we pay plus fitting.
          </Reveal>
          <Reveal as="p" kind="up" i={1} className="mt-4 text-slate">
            Not sure which line fits? The calculator below gets you closer, and the written estimate makes it exact.
          </Reveal>
        </div>
        <Reveal kind="right">
          <PriceTabs />
        </Reveal>
      </div>
    </section>
  );
}

export function Tiers() {
  return (
    <section id="tiers" className="bg-frost py-20 md:py-28">
      <div className="wd-wrap">
        <SectionHead
          label="Two levels of service"
          title="Standard for daily wearers, heritage for heirlooms."
          lede="Both levels get the same full mechanical work. Heritage adds the record-keeping and extra care for originality that matter on a watch with a past."
        />
        <Reveal kind="blur" className="mt-10">
          <TierToggle />
        </Reveal>
      </div>
    </section>
  );
}

export function Estimate() {
  return (
    <section id="estimate" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap">
        <SectionHead
          label="Estimate calculator"
          title="Build a rough price in four taps."
          lede="Choose the movement, anything it does besides tell the time, the state of the crystal and any extras. The figure updates as you go."
        />
        <Reveal kind="up" className="mt-10">
          <EstimateCalculator />
        </Reveal>
      </div>
    </section>
  );
}

export function Inside() {
  const secRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  useEffect(() => {
    return subscribe(() => {
      const track = trackRef.current;
      if (state.vw < 768 || state.reduced) {
        track.style.transform = '';
        return false;
      }
      const g = docRect(secRef.current);
      const total = Math.max(1, g.height - state.vh);
      const p = clamp((state.y - g.top) / total);
      const dist = cached(track, 'dist', () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth));
      track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px, 0, 0)`;
      barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      return false;
    });
  }, []);
  return (
    <section id="inside" ref={secRef} className="relative bg-ice md:h-[340vh]" data-anim="horizontal-scroll">
      <div className="py-20 md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-center md:overflow-hidden md:py-0">
        <div className="wd-wrap">
          <SectionHead label="Inside a full service" title="Eight stages, about eleven hours of bench time." />
          <div className="mt-6 hidden h-1 overflow-hidden rounded-full bg-white md:block" aria-hidden="true">
            <div ref={barRef} className="h-full origin-left bg-teal" style={{ transform: 'scaleX(0)' }} data-anim="scroll-progress" />
          </div>
        </div>
        <div className="mt-8 overflow-x-auto pb-4 md:overflow-visible md:pb-0 [scroll-snap-type:x_mandatory] md:[scroll-snap-type:none]">
          <ol ref={trackRef} className="flex w-max gap-5 px-4 md:px-[max(2rem,calc((100vw-1200px)/2))]">
            {inside.map((s, i) => (
              <li key={s.title} className="w-[78vw] max-w-[360px] shrink-0 [scroll-snap-align:center] md:w-[340px]">
                <article className="wd-card h-full overflow-hidden">
                  <Photo k={s.photo} className="wd-zoom aspect-[4/3]" />
                  <div className="p-5">
                    <p className="text-sm font-[640] text-brass">Stage {i + 1} of {inside.length}</p>
                    <h3 className="wd-h3 mt-1 text-xl">{s.title}</h3>
                    <p className="mt-2 text-[0.97rem] text-slate">{s.text}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Turnaround() {
  return (
    <section id="turnaround" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <SectionHead label="Turnaround" title="How long it will take, honestly." />
          <div className="wd-prose mt-6 text-slate">
            <Reveal as="p" kind="up">
              Most of the time a watch spends with us is not waiting in a queue. It’s the seven-day wear test and the time it takes
              parts to arrive. We would rather ring you a day late with a watch that keeps time than a day early with one that doesn’t.
            </Reveal>
            <Reveal as="p" kind="up" i={1}>
              If you need it back for a date, such as a wedding, a trip or a birthday, tell us at drop-off. Express service jumps the
              bench queue for £60, but it can’t shorten the wear test.
            </Reveal>
          </div>
          <Ticks className="mt-8" />
        </div>
        <Reveal kind="scale">
          <TurnaroundEstimator />
        </Reveal>
      </div>
    </section>
  );
}

export function Water() {
  return (
    <section id="water" className="relative overflow-hidden bg-frost py-20 md:py-28">
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-ice" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
        <path className="wd-bob" d="M0 80 C200 40 400 120 600 80 S1000 40 1200 80 V160 H0Z" fill="currentColor" data-anim="wave" />
      </svg>
      <div className="wd-wrap relative">
        <SectionHead
          label="Water resistance"
          title="What the number on the case back really means."
          lede="Depth ratings come from a static pressure test in a lab, not from swimming. Gaskets also age. Pick what you’ll do with the watch to see the rating you actually need."
        />
        <Reveal kind="up" className="mt-10">
          <WaterGuide />
        </Reveal>
      </div>
    </section>
  );
}

export function Glossary() {
  return (
    <section id="glossary" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHead label="Words on your estimate" title="A short glossary of watch parts." />
          <Reveal as="p" kind="up" className="mt-5 text-slate">
            Estimates name parts precisely so you know what you’re paying for. These are the eight words that come up most often.
          </Reveal>
          <Reveal kind="mask" className="mt-8 hidden aspect-[4/3] overflow-hidden rounded-[22px] lg:block">
            <Photo k="skeleton" className="h-full" />
          </Reveal>
        </div>
        <Reveal kind="left">
          <Accordion items={glossary} idPrefix="gl" widget="glossary-accordion" />
        </Reveal>
      </div>
    </section>
  );
}

export function Care() {
  return (
    <section id="care" className="bg-ice py-20 md:py-28">
      <div className="wd-wrap">
        <SectionHead center label="Care guide" title="Ten habits for a longer-lived watch." lede="Five things to do and five to avoid. None of them cost anything, and all of them push the next service further away." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal kind="left" className="wd-card p-6 md:p-8">
            <h3 className="wd-h3 text-xl text-ok">Do</h3>
            <ul className="mt-4 space-y-3">
              {care.dos.map((d) => (
                <li key={d} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ok" aria-hidden="true" />{d}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal kind="right" className="wd-card p-6 md:p-8">
            <h3 className="wd-h3 text-xl text-alert">Avoid</h3>
            <ul className="mt-4 space-y-3">
              {care.donts.map((d) => (
                <li key={d} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-alert" aria-hidden="true" />{d}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Guarantee() {
  return (
    <section id="guarantee" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
          <SectionHead label="Guarantee and policies" title="What we promise, in plain words." />
          <Reveal kind="right" className="flex items-center gap-5">
            <svg viewBox="0 0 120 120" className="wd-draw h-28 w-28 shrink-0 text-teal" data-reveal="up" data-anim="svg-draw" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <circle cx="60" cy="60" r="52" pathLength="1" />
              <circle cx="60" cy="60" r="40" pathLength="1" strokeDasharray="1" />
              <polyline points="40,62 54,76 82,46" pathLength="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-slate">Every service and repair carries a 12-month guarantee, starting from the day you collect.</p>
          </Reveal>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guarantee.map((g, i) => (
            <Reveal as="li" kind="flip" i={i % 3} key={g.title} className="wd-card wd-card-lift p-6">
              <h3 className="wd-h3 text-lg">{g.title}</h3>
              <p className="mt-2 text-[0.97rem] text-slate">{g.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="bg-frost py-20 md:py-28">
      <div className="wd-wrap max-w-3xl">
        <SectionHead center label="Questions" title="Fourteen questions we’re asked every week." />
        <Reveal kind="up" className="mt-10">
          <FaqSearch />
        </Reveal>
      </div>
    </section>
  );
}

export function ServicesCta() {
  return (
    <section id="next" className="bg-ivory py-20">
      <div className="wd-wrap grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <Words text="Got a price in mind? Book the free estimate." className="wd-h2" />
          <Reveal as="p" kind="up" className="mt-4 text-slate">
            Pick a counter slot or request a postal pack. We confirm the price in writing before anything else happens.
          </Reveal>
        </div>
        <Reveal kind="scale" className="flex flex-wrap gap-3 md:justify-end">
          <Btn href="./book.html#booking" magnetic>Book a slot</Btn>
          <Btn href="./book.html#postal" variant="ghost">Post it in</Btn>
        </Reveal>
      </div>
    </section>
  );
}
