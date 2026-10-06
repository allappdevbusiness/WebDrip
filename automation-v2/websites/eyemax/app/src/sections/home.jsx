import { useEffect, useState } from 'react';
import { heroLines, intro, services, glare, spotlight, journey, care, visit } from '../data/home.js';
import { brand } from '../data/site.js';
import { Heading, Img, Btn, Icon, Logo } from '../components/ui.jsx';
import { FrameFilter, FrameQuiz, BeforeAfter, ReviewCarousel, OpenNow, Accordion, SpotlightImage } from '../widgets/HomeWidgets.jsx';

function IntroLoader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="wd-loader" data-anim="intro-loader" aria-hidden="true">
      <svg viewBox="0 0 64 40" className="w-32 h-20" fill="none" strokeWidth="4">
        <circle cx="18" cy="20" r="13" stroke="#0E5E63" />
        <circle cx="46" cy="20" r="13" stroke="#F0705A" />
      </svg>
    </div>
  );
}

export function Hero() {
  let n = 0;
  const sizes = ['text-[clamp(3.6rem,13vw,9.5rem)]', 'text-[clamp(2.6rem,8.6vw,6.2rem)]', 'text-[clamp(2.1rem,6.4vw,4.6rem)]'];
  return (
    <section id="top" className="wd-intro relative min-h-[100svh] flex items-center" aria-labelledby="heroTitle">
      <IntroLoader />
      <div className="wd-hero-stage" aria-hidden="true">
        <img id="heroImg" src="./assets/images/hero.jpg" alt="" width="2400" height="1600" fetchPriority="high" data-anim="hero-3d" />
        <div className="wd-hero-scrim" />
      </div>
      <div className="absolute right-[8%] top-[18%] pointer-events-none hidden sm:block" data-depth="0.25" aria-hidden="true">
      <svg className="wd-hero-ring w-40 h-40 md:w-64 md:h-64 text-coral" viewBox="0 0 100 100" fill="none" data-anim="float-blob">
        <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 7" />
        <circle cx="50" cy="50" r="30" stroke="#0E5E63" strokeWidth="1.5" />
      </svg>
      </div>
      <div className="wd-wrap relative z-10 py-24">
        <div data-depth="0.12">
          <h1 id="heroTitle" className="font-display font-extrabold text-ink leading-[0.92] tracking-[-0.04em]" data-anim="letter-reveal">
            {heroLines.map((line, li) => (
              <span key={line} className={`wd-chart-line ${sizes[li]}`}>
                {line.split(' ').map((w, wi, arr) => (
                  <span key={wi}>
                    <span className="inline-block whitespace-nowrap">
                      {[...w].map((ch, ci) => (
                        <span key={ci} className="wd-l" style={{ '--i': n++ }}>{ch}</span>
                      ))}
                    </span>
                    {wi < arr.length - 1 ? ' ' : ''}
                  </span>
                ))}
                {li < heroLines.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
        </div>
        <div data-depth="0.05" className="mt-8 max-w-xl">
          <p className="text-lg md:text-xl text-ink/85 font-medium">
            An independent optician in Larkfield. Eye exams that take the time they need, an OCT scan when you want the full picture, and frames fitted by hand.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href="./book.html#booking">Book an eye exam</Btn>
            <Btn href="#frames" variant="ghost">Browse frames</Btn>
          </div>
        </div>
      </div>
      <a href="#about" className="wd-scroll-cue absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-white/80 grid place-items-center" aria-label="Scroll to the next section" data-anim="scroll-cue">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
      </a>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="wd-section relative z-10 bg-paper overflow-hidden">
      <div className="wd-blob w-[520px] h-[520px] -left-48 -top-32 bg-[radial-gradient(circle,rgba(20,122,120,0.18),rgba(20,122,120,0)_70%)]" data-anim="float-blob" aria-hidden="true" />
      <div className="wd-wrap relative grid gap-12 lg:grid-cols-12 items-start">
        <div className="lg:col-span-6">
          <Heading text={intro.title} />
          <div className="mt-6 space-y-4 text-lg text-muted" data-reveal data-anim="fade-up">
            {intro.body.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
          </div>
        </div>
        <div className="lg:col-span-6 lg:pt-4">
          <dl className="grid grid-cols-2 gap-4" data-reveal data-anim="stagger">
            {intro.stats.map((s, i) => (
              <div key={s.label} className="wd-card p-6" style={{ '--i': i }}>
                <dt className="text-muted font-semibold">{s.label}</dt>
                <dd className="font-display text-5xl md:text-6xl font-extrabold text-teal mt-2" data-count={s.value} data-suffix={s.suffix} data-anim="count-up">{s.value}{s.suffix}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted mt-3">Sample figures for a fictional practice.</p>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="wd-section relative z-10 bg-white">
      <div className="wd-wrap">
        <div className="max-w-2xl">
          <Heading text="Everything for your eyes under one roof" />
          <p className="wd-lead mt-5" data-reveal data-anim="blur-in">Exams, glasses, contact lenses and repairs are all done here, by the same small team. Nothing is sent away except the rare soldered frame repair.</p>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal data-anim="svg-draw">
          {services.map((s, i) => (
            <li key={s.title} className="wd-card wd-tilt p-7 flex flex-col" data-tilt data-anim="tilt">
              <span className="text-teal"><Icon name={s.icon} delay={i * 120} /></span>
              <h3 className="text-2xl mt-5">{s.title}</h3>
              <p className="text-muted mt-2 flex-1">{s.text}</p>
              <a href={s.href} className="wd-link font-semibold text-teal mt-5 self-start min-h-11 inline-flex items-center">More about {s.title.toLowerCase()}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Frames() {
  return (
    <section id="frames" className="wd-section relative z-10 bg-sand">
      <div className="wd-wrap">
        <div className="grid lg:grid-cols-2 gap-6 items-end mb-10">
          <Heading text="A few frames from the wall" />
          <p className="text-lg text-muted" data-reveal data-anim="slide-right">Seven from the six hundred or so on display. Prices include basic single vision lenses with a scratch-resistant coating. Filter by shape and material, or search by colour.</p>
        </div>
        <FrameFilter />
      </div>
    </section>
  );
}

export function Quiz() {
  return (
    <section id="finder" className="wd-section relative z-10 bg-mint overflow-hidden">
      <div className="wd-spin-glow absolute -right-60 -bottom-60 w-[640px] h-[640px] rounded-full bg-[conic-gradient(from_0deg,rgba(240,112,90,0.22),rgba(20,122,120,0.18),rgba(240,112,90,0.22))]" data-anim="glow-spin" aria-hidden="true" />
      <div className="wd-wrap relative grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Heading text="Not sure where to start?" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">Three questions, then two frames to try first. It is a starting point, not a rule. Plenty of people with round faces look great in round frames.</p>
          <p className="mt-4 text-muted" data-reveal data-anim="fade-up">In the studio, Jonah will look at your face shape, skin tone, prescription and how you wear your hair before suggesting anything.</p>
        </div>
        <div className="lg:col-span-8" data-reveal data-anim="scale-in">
          <FrameQuiz />
        </div>
      </div>
    </section>
  );
}

export function Glare() {
  return (
    <section id="coatings" className="wd-section relative z-10 bg-white">
      <div className="wd-wrap grid gap-12 lg:grid-cols-2 items-center">
        <div data-reveal data-anim="clip-wipe">
          <BeforeAfter />
        </div>
        <div>
          <Heading text={glare.title} />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">{glare.body}</p>
          <ul className="mt-6 space-y-3" data-reveal data-anim="stagger">
            {glare.points.map((p, i) => (
              <li key={p} className="flex gap-3 items-start" style={{ '--i': i }}>
                <span className="mt-1 w-6 h-6 rounded-full bg-coral/20 text-ink grid place-items-center shrink-0" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l4 4 10-10" /></svg>
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Spotlight() {
  return (
    <section id="fitting" className="wd-section relative z-10 bg-blush overflow-hidden">
      <div className="wd-wrap grid gap-12 lg:grid-cols-12 items-center">
        <div className="lg:col-span-5 lg:order-2" data-reveal data-anim="rotate-in">
          <SpotlightImage />
        </div>
        <div className="lg:col-span-7 lg:order-1 lg:pr-10">
          <Heading text={spotlight.title} className="wd-h2 lg:text-[4.2rem]" anim="letter-reveal" />
          {spotlight.body.map((p) => (
            <p key={p.slice(0, 20)} className="text-lg text-muted mt-5" data-reveal data-anim="slide-left">{p}</p>
          ))}
          <div className="mt-8" data-reveal data-anim="fade-up">
            <Btn href="./book.html#booking" variant="teal">Book a fitting</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

const storyImgs = ['exam', 'svcHead', 'contacts', 'f7'];

export function Journey() {
  return (
    <section id="visit" className="relative z-10 bg-paper lg:h-[340vh]" data-story data-anim="pinned-story">
      <div className="lg:sticky lg:top-0 lg:min-h-[100svh] flex items-center py-20">
        <div className="wd-wrap grid gap-8 lg:grid-cols-2 items-center w-full">
          <div>
            <Heading text="Your visit, start to finish" />
            <ol className="mt-8 space-y-3 relative pl-5">
              <span className="absolute left-0 top-0 bottom-0 w-1 rounded bg-mint" aria-hidden="true" />
              <span data-story-bar className="absolute left-0 top-0 bottom-0 w-1 rounded bg-coral origin-top transition-transform duration-500" style={{ transform: 'scaleY(1)' }} aria-hidden="true" />
              {journey.map((s, i) => (
                <li key={s.title} className={`wd-story-step rounded-2xl border border-teal/15 bg-white p-4 md:p-5 ${i === journey.length - 1 ? 'wd-active' : ''}`}>
                  <h3 className="text-xl md:text-2xl"><span className="text-coral mr-2">{i + 1}.</span>{s.title}</h3>
                  <p className="text-muted mt-1 text-[0.95rem] md:text-base">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative hidden lg:block aspect-[4/5] wd-media rounded-[28px]">
            {storyImgs.map((k, i) => (
              <Img key={k} k={k} className={`wd-story-img absolute inset-0 w-full h-full object-cover ${i === storyImgs.length - 1 ? 'wd-active' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="wd-section relative z-10 bg-mint">
      <div className="wd-wrap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <Heading text="What patients tell us" />
          <p className="text-muted max-w-sm" data-reveal data-anim="fade-up">These are sample reviews written for this concept site. EyeMax is a fictional practice.</p>
        </div>
        <div data-reveal data-anim="slide-right">
          <ReviewCarousel />
        </div>
      </div>
    </section>
  );
}

export function Care() {
  return (
    <section id="care" className="wd-section relative z-10 bg-white">
      <div className="wd-wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Heading text="Six habits that make glasses last" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">Small things that save coatings, keep frames straight and stop contact lens trouble before it starts.</p>
          <div className="wd-media aspect-[4/3] mt-8 hidden lg:block" data-reveal data-anim="blur-in">
            <Img k="f2" data-parallax="0.06" data-anim="parallax" className="scale-110" />
          </div>
        </div>
        <div className="lg:col-span-8" data-reveal data-anim="fade-up">
          <Accordion items={care} id="care" widget="care-accordion" />
        </div>
      </div>
    </section>
  );
}

export function Hours() {
  return (
    <section id="hours" className="wd-section relative z-10 bg-paper">
      <div className="wd-wrap grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <Heading text={visit.title} />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">{visit.body}</p>
          <address className="not-italic mt-6 text-lg" data-reveal data-anim="fade-up">
            {brand.address.map((l) => <span key={l} className="block font-semibold">{l}</span>)}
            <a href={brand.phoneHref} className="wd-link text-teal font-semibold">{brand.phone}</a>
          </address>
          <div className="mt-8 flex flex-wrap gap-3" data-reveal data-anim="fade-up">
            <Btn href="./book.html#find-us" variant="teal">Directions and map</Btn>
            <Btn href="./book.html#timetable" variant="ghost">Clinic timetable</Btn>
          </div>
        </div>
        <div data-reveal data-anim="slide-right">
          <OpenNow />
        </div>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section id="cta" className="relative z-10 bg-coral overflow-hidden py-20 md:py-28">
      <div className="wd-blob w-[380px] h-[380px] -left-24 -bottom-40 bg-[radial-gradient(circle,rgba(255,255,255,0.45),rgba(255,255,255,0)_70%)]" data-anim="float-blob" aria-hidden="true" />
      <div className="wd-wrap relative text-center">
        <Logo className="w-20 h-12 mx-auto" />
        <Heading text="Due an eye exam? Most people are." className="font-display text-[clamp(2.4rem,6vw,4.8rem)] mt-6 max-w-4xl mx-auto" />
        <p className="text-lg mt-5 max-w-xl mx-auto text-ink/85" data-reveal data-anim="fade-up">If it has been two years or more, or anything has changed, book a time this week. It takes thirty to forty-five minutes.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3" data-reveal data-anim="scale-in">
          <Btn href="./book.html#booking" variant="teal">Book an eye exam</Btn>
          <Btn href="./services.html#exams" variant="ghost">See exam prices</Btn>
        </div>
      </div>
    </section>
  );
}
