import { useEffect, useRef } from 'react';
import { subscribe, state, approach, clamp, docRect } from '../motion.js';
import { Reveal, Words, Letters, SectionHead, Ticks, Photo, Btn, CheckIcon } from '../components/ui.jsx';
import { photos } from '../data/photos.js';
import { brand } from '../data/site.js';
import { hero, benchList, benchIntro, process, restoration, spotlight, stats, compare, visit, tips } from '../data/home.js';
import { Dial, SymptomChecker, ServiceFilter, BeforeAfter, ReviewCarousel, OpenNow, SpotlightPhoto } from '../widgets/HomeWidgets.jsx';

export function Hero() {
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const copyRef = useRef(null);
  const dialRef = useRef(null);
  const ticketRef = useRef(null);

  useEffect(() => {
    let cur = 0;
    let drawn = -1;
    let vis = '';
    return subscribe((dt) => {
      const target = state.reduced ? 0 : clamp(state.y / state.vh, 0, 1.4);
      cur = approach(cur, target, dt, 120);
      const v = state.y > state.vh * 1.6 ? 'hidden' : 'visible';
      if (v !== vis) {
        stageRef.current.style.visibility = v;
        vis = v;
      }
      if (cur === drawn) return false;
      drawn = cur;
      const e = cur;
      imgRef.current.style.transform = `translate3d(${(-e * 30).toFixed(2)}px, ${(e * 70).toFixed(2)}px, ${(e * 120).toFixed(2)}px) rotateX(${(e * 7).toFixed(3)}deg) rotateY(${(-e * 4).toFixed(3)}deg) scale(${(1.08 + e * 0.18).toFixed(4)})`;
      copyRef.current.style.transform = `translate3d(0, ${(-e * 150).toFixed(2)}px, 0)`;
      copyRef.current.style.opacity = String(clamp(1 - e * 0.95).toFixed(3));
      dialRef.current.style.transform = `translate3d(0, ${(-e * 260).toFixed(2)}px, 0) rotate(${(-e * 28).toFixed(2)}deg) scale(${(1 - e * 0.12).toFixed(4)})`;
      ticketRef.current.style.transform = `translate3d(0, ${(-e * 90).toFixed(2)}px, 0)`;
      return cur !== target;
    });
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden text-white">
      <div ref={stageRef} className="wd-hero-stage" aria-hidden="true">
        <img id="heroImg" ref={imgRef} src={photos.hero.src} alt="" data-anim="hero-camera" fetchPriority="high" />
        <div className="wd-hero-veil" />
      </div>
      <div className="wd-wrap relative z-[1] grid min-h-[calc(100svh-68px)] items-end gap-8 pb-14 pt-10 md:grid-cols-[0.9fr_1.1fr] md:items-center md:pb-20">
        <div className="order-2 flex flex-col items-start gap-6 md:order-1">
          <div ref={dialRef} className="hidden md:block" data-anim="parallax-layer">
            <Dial className="h-56 w-56 drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)] lg:h-72 lg:w-72" />
          </div>
          <div ref={ticketRef} className="wd-fade-late wd-late-2 max-w-xs rounded-2xl bg-ivory/95 p-4 text-ink shadow-2xl" data-anim="float-card">
            <p className="flex items-center gap-2 text-sm font-[640] text-teal">
              <span className="wd-pulse-dot inline-block h-2.5 w-2.5 rounded-full bg-teal text-teal" aria-hidden="true" />
              {hero.ticket.title}
            </p>
            <p className="mt-1 font-[680]">{hero.ticket.watch}</p>
            <p className="text-sm text-slate">{hero.ticket.job}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-silver-2">
              <div className="h-full origin-left rounded-full bg-brass" style={{ transform: `scaleX(${hero.ticket.day / hero.ticket.of})` }} />
            </div>
            <p className="mt-1 text-xs text-slate">Day {hero.ticket.day} of {hero.ticket.of} (sample)</p>
          </div>
        </div>
        <div ref={copyRef} className="order-1 md:order-2 md:text-right">
          <div className="mb-6 md:hidden">
            <Dial className="h-28 w-28 drop-shadow-xl" />
          </div>
          <p className="wd-fade-late wd-late mb-5 font-[600] text-white/90 [font-stretch:92%]">{hero.label}</p>
          <Letters text={hero.title} className="wd-display wd-late text-[clamp(2.9rem,8.2vw,6.6rem)] md:ml-auto md:max-w-[11ch]" />
          <p className="wd-fade-late wd-late-2 mt-6 max-w-xl text-[1.08rem] leading-relaxed text-white/90 md:ml-auto">{hero.lede}</p>
          <div className="wd-fade-late wd-late-3 mt-8 flex flex-wrap gap-3 md:justify-end">
            <Btn href="./book.html#booking" magnetic>Get a written estimate</Btn>
            <Btn href="./services.html#prices" variant="light">See prices</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BenchList() {
  const doubled = [...benchList, ...benchList];
  return (
    <section id="bench" className="bg-ivory py-16 md:py-20">
      <div className="wd-marquee-host border-y border-silver-2 bg-white py-5" data-anim="marquee">
        <ul className="wd-marquee" aria-label="Watches we work on">
          {doubled.map((w, i) => (
            <li key={i} className="flex items-center gap-6 px-6 text-xl font-[640] text-ink [font-stretch:112%] whitespace-nowrap" aria-hidden={i >= benchList.length}>
              <svg viewBox="0 0 20 20" className="wd-spin h-5 w-5 text-brass" aria-hidden="true"><path d="M10 1l2 5 5-2-2 5 4 1-4 2 2 5-5-2-2 5-1-5-5 2 2-5-4-1 4-2-2-5 5 2z" fill="currentColor" /></svg>
              {w}
            </li>
          ))}
        </ul>
      </div>
      <div className="wd-wrap mt-14 grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <Words text="What comes across the bench" className="wd-h2" />
        <div className="wd-prose text-[1.05rem] text-slate">
          {benchIntro.map((p, i) => (
            <Reveal as="p" kind="up" i={i} key={i}>{p}</Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Symptoms() {
  return (
    <section id="symptoms" className="bg-frost py-20 md:py-28">
      <div className="wd-wrap">
        <SectionHead
          label="Is it time for a service?"
          title="Tell us the symptom, we’ll tell you what it usually means."
          lede="Mechanical watches want a service every three to five years. But the watch usually tells you sooner: by gaining, losing, stopping or misting up. Pick what you’ve noticed."
        />
        <Reveal kind="blur" className="mt-10">
          <SymptomChecker />
        </Reveal>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead
            label="Services at a glance"
            title="Ten jobs we do every week, priced up front."
            lede="Prices are starting points for a typical watch. Complications, rare calibres and parts change the figure, which is why every job gets an itemised written estimate first."
          />
          <Reveal kind="right">
            <a className="wd-link font-[640] text-teal" href="./services.html#prices">Full price list and calculator</a>
          </Reveal>
        </div>
        <Reveal kind="up" className="mt-10">
          <ServiceFilter />
        </Reveal>
      </div>
    </section>
  );
}

export function ProcessStory() {
  const secRef = useRef(null);
  const ringRef = useRef(null);
  const bigRef = useRef(null);
  const listRef = useRef(null);
  useEffect(() => {
    let idx = 0;
    return subscribe(() => {
      if (state.vw < 768) return false;
      const g = docRect(secRef.current);
      const total = Math.max(1, g.height - state.vh);
      const p = clamp((state.y - g.top) / total);
      ringRef.current.style.strokeDashoffset = (1 - p).toFixed(4);
      const n = Math.min(process.length - 1, Math.floor(p * process.length));
      if (n !== idx) {
        idx = n;
        [...bigRef.current.children].forEach((c, k) => (c.dataset.active = String(k === n)));
        [...listRef.current.children].forEach((c, k) => (c.dataset.active = String(k === n)));
      }
      return false;
    });
  }, []);
  return (
    <section id="process" ref={secRef} className="relative bg-ice md:h-[460vh]" data-anim="pinned-story">
      <div className="py-20 md:sticky md:top-0 md:flex md:h-screen md:items-center md:py-0">
        <div className="wd-wrap grid gap-10 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <SectionHead label="How a service works" title="Six steps from ticket to wrist." />
            <div className="relative mt-10 hidden aspect-square max-w-[420px] md:block">
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="100" cy="100" r="92" fill="none" stroke="#c5cbce" strokeWidth="2" strokeDasharray="1 4.8" />
                <circle ref={ringRef} cx="100" cy="100" r="92" fill="none" stroke="#145e68" strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" data-anim="svg-draw" />
              </svg>
              <div ref={bigRef} className="absolute inset-[14%] rounded-full bg-white shadow-[0_30px_60px_-30px_rgba(20,70,80,0.5)]">
                {process.map((s, i) => (
                  <div
                    key={i}
                    data-active={String(i === 0)}
                    className="invisible absolute inset-0 flex translate-y-4 flex-col items-center justify-center p-10 text-center opacity-0 transition-[opacity,transform,visibility] duration-500 data-[active=true]:visible data-[active=true]:translate-y-0 data-[active=true]:opacity-100"
                  >
                    <span className="text-6xl font-[780] text-teal [font-stretch:125%]">{i + 1}</span>
                    <span className="mt-2 text-sm font-[640] text-brass">{s.short}</span>
                    <span className="mt-2 text-lg font-[680] leading-tight">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ol ref={listRef} className="space-y-3">
            {process.map((s, i) => (
              <li
                key={i}
                data-active={String(i === 0)}
                className="rounded-2xl border border-transparent p-5 transition-[transform,background-color,border-color,box-shadow] duration-500 md:data-[active=true]:translate-x-2 md:data-[active=true]:border-silver-2 md:data-[active=true]:bg-white md:data-[active=true]:shadow-[0_20px_40px_-30px_rgba(20,70,80,0.6)]"
              >
                <Reveal kind="left" i={i} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal font-[700] text-white">{i + 1}</span>
                  <div>
                    <h3 className="wd-h3 text-lg">{s.title}</h3>
                    <p className="text-sm font-[620] text-brass">{s.short}</p>
                    <p className="mt-1 text-[0.97rem] text-slate">{s.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Restoration() {
  return (
    <section id="restoration" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap grid gap-12 md:grid-cols-2 md:items-center">
        <Reveal kind="scale">
          <BeforeAfter />
        </Reveal>
        <div>
          <Reveal as="p" kind="left" className="wd-label mb-3">Restoration</Reveal>
          <Words text={restoration.title} className="wd-h2" />
          <div className="wd-prose mt-6 text-slate">
            {restoration.paras.map((p, i) => (
              <Reveal as="p" kind="up" i={i} key={i}>{p}</Reveal>
            ))}
          </div>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {restoration.points.map((p, i) => (
              <Reveal as="li" kind="up" i={i} key={p} className="flex items-start gap-2 text-[0.97rem]">
                <span className="mt-0.5 text-teal"><CheckIcon /></span>
                {p}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Spotlight() {
  return (
    <section id="spotlight" className="relative overflow-hidden bg-frost py-20 md:py-28">
      <svg className="wd-spin-rev pointer-events-none absolute -right-24 -top-24 h-80 w-80 text-ice-2" viewBox="0 0 100 100" data-anim="gear-spin" aria-hidden="true">
        <path d="M50 8l5 9 10-3 1 10 10 2-4 10 8 6-8 6 4 10-10 2-1 10-10-3-5 9-5-9-10 3-1-10-10-2 4-10-8-6 8-6-4-10 10-2 1-10 10 3z" fill="currentColor" />
        <circle cx="50" cy="50" r="14" fill="#f2f6f7" />
      </svg>
      <div className="wd-wrap relative grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
        <Reveal kind="mask">
          <SpotlightPhoto />
        </Reveal>
        <div>
          <Reveal as="p" kind="left" className="wd-label mb-3">At the bench</Reveal>
          <Words text={spotlight.title} className="wd-h2" />
          <div className="wd-prose mt-6 text-slate">
            {spotlight.paras.map((p, i) => (
              <Reveal as="p" kind="up" i={i} key={i}>{p}</Reveal>
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {spotlight.tools.map((t, i) => (
              <Reveal as="li" kind="scale" i={i} key={t} className="rounded-full border border-silver bg-white px-4 py-2 text-sm font-[600]">
                {t}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Numbers() {
  return (
    <section id="numbers" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap">
        <SectionHead label="Sample figures" title="Small bench, steady numbers." lede="These are sample figures for a fictional workshop, shown to illustrate the kind of facts a real bench would publish." />
        <Ticks className="mt-10" />
        <dl className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} kind="flip" i={i}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-[clamp(2.6rem,5vw,3.8rem)] font-[760] leading-none text-teal [font-stretch:125%] tabular-nums" data-count={s.value} data-suffix={s.suffix} data-anim="count-up">
                  {s.value.toLocaleString('en-GB')}
                  {s.suffix}
                </span>
                <span className="mt-3 block text-slate">{s.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
        <Reveal kind="up" className="mt-16 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="mb-4 text-left wd-h3 text-xl">An independent bench compared with sending it away (typical ranges)</caption>
            <thead>
              <tr className="border-b-2 border-teal text-sm">
                <th scope="col" className="py-3 pr-4 font-[650]"> </th>
                <th scope="col" className="py-3 pr-4 font-[650] text-teal">Pendlecrest</th>
                <th scope="col" className="py-3 font-[650] text-slate">Sent to a distant service centre</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((c) => (
                <tr key={c.label} className="border-b border-silver-2">
                  <th scope="row" className="py-3 pr-4 font-[620]">{c.label}</th>
                  <td className="py-3 pr-4 font-[600] text-ink">{c.us}</td>
                  <td className="py-3 text-slate">{c.away}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden bg-ice py-20 md:py-28">
      <div className="wd-blob h-[26rem] w-[26rem] -left-20 top-10" style={{ '--blob': 'rgba(255,255,255,0.95)' }} aria-hidden="true" data-anim="float-blob" />
      <div className="wd-wrap relative">
        <SectionHead center label="Sample reviews" title="What people say when they collect." lede="These are sample reviews written for this concept site, not real customer reviews." />
        <Reveal kind="blur" className="mt-12">
          <ReviewCarousel />
        </Reveal>
      </div>
    </section>
  );
}

export function Visit() {
  return (
    <section id="visit" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap grid gap-12 md:grid-cols-[1.1fr_1fr]">
        <div>
          <SectionHead label="Visit the counter" title="Ring the brass bell." />
          <div className="wd-prose mt-6 text-slate">
            {visit.paras.map((p, i) => (
              <Reveal as="p" kind="up" i={i} key={i}>{p}</Reveal>
            ))}
          </div>
          <Reveal kind="up" i={2} className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="wd-card p-5">
              <h3 className="wd-h3">Address</h3>
              <p className="mt-2 text-slate">{brand.address.join(', ')}</p>
            </div>
            <div className="wd-card p-5">
              <h3 className="wd-h3">Phone and email</h3>
              <p className="mt-2 text-slate">
                <a className="wd-link text-teal" href={brand.phoneHref}>{brand.phone}</a>
                <br />
                <a className="wd-link text-teal" href={`mailto:${brand.email}`}>{brand.email}</a>
              </p>
            </div>
          </Reveal>
          <Reveal kind="up" i={3} className="mt-6">
            <a className="wd-link font-[640] text-teal" href="./book.html#find" data-anim="underline">Map, parking and tram directions</a>
          </Reveal>
        </div>
        <Reveal kind="right">
          <OpenNow />
        </Reveal>
      </div>
    </section>
  );
}

export function Tips() {
  return (
    <section id="tips" className="bg-frost py-20 md:py-28">
      <div className="wd-wrap">
        <SectionHead label="Three habits" title="Small habits that keep a watch running longer." />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {tips.map((t, i) => (
            <Reveal as="li" kind="rotate" i={i} key={t.title}>
              <article className="wd-card wd-tilt wd-card-lift h-full p-6" data-tilt="" data-anim="tilt-card">
                <svg viewBox="0 0 48 48" className="wd-draw h-12 w-12 text-teal" data-reveal="up" data-anim="svg-draw" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="24" cy="24" r="18" pathLength="1" />
                  <path d="M24 12v12l8 5" pathLength="1" strokeLinecap="round" />
                </svg>
                <h3 className="wd-h3 mt-4 text-xl">{t.title}</h3>
                <p className="mt-2 text-slate">{t.text}</p>
              </article>
            </Reveal>
          ))}
        </ul>
        <Reveal kind="up" className="mt-8">
          <a className="wd-link font-[640] text-teal" href="./services.html#care">Read the full care guide</a>
        </Reveal>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section id="cta" className="bg-ivory py-20 md:py-24">
      <div className="wd-wrap">
        <Reveal kind="wipe">
          <div className="relative overflow-hidden rounded-[28px] bg-teal px-6 py-14 text-white md:px-14 md:py-20">
          <Photo k="partsBench" className="absolute inset-0" parallax="0.12" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal via-teal/90 to-teal/60" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <h2 className="wd-h2">Ready when your watch is.</h2>
            <p className="mt-4 text-lg text-white/90">
              Book a counter slot or request a postal pack. Either way, the estimate is free, written down, and yours to say no to.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn href="./book.html#booking" variant="light" magnetic>Book a counter slot</Btn>
              <Btn href="./book.html#postal" variant="ghost" className="!bg-transparent !text-white ![box-shadow:inset_0_0_0_1.5px_#fff]">Send it by post</Btn>
            </div>
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
