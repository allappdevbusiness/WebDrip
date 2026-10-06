import { header, exams, materials, contacts, kids, dry, repairs, policies } from '../data/services.js';
import { Heading, Img, Btn, Icon, money } from '../components/ui.jsx';
import { PlanToggle, CostCalculator, LensCompare, SizeGuide, ProcessTimeline, FaqSearch } from '../widgets/ServiceWidgets.jsx';

export function PageHeader() {
  return (
    <section id="top" className="relative z-10 bg-paper pt-10 pb-16 md:pb-24 overflow-hidden">
      <div className="wd-wrap grid gap-10 lg:grid-cols-12 items-end">
        <div className="lg:col-span-6 relative z-10">
          <h1 className="font-display font-extrabold text-[clamp(3rem,7.5vw,6rem)] leading-[0.95] tracking-[-0.04em]" data-reveal data-anim="letter-reveal">
            {header.title.split(' ').map((w, wi, arr) => (
              <span key={wi}>
                <span className="inline-block whitespace-nowrap">
                  {[...w].map((ch, ci) => <span key={ci} className="wd-l" style={{ '--i': wi * 6 + ci }}>{ch}</span>)}
                </span>
                {wi < arr.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="wd-lead mt-6" data-reveal data-anim="blur-in" style={{ '--d': 300 }}>{header.intro}</p>
          <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2" data-reveal data-anim="stagger">
            {[['Exams', '#exams'], ['Care plans', '#plans'], ['Cost calculator', '#calculator'], ['Lenses', '#lenses'], ['FAQ', '#faq']].map(([l, h], i) => (
              <a key={h} href={h} className="wd-chip" style={{ '--i': i }}>{l}</a>
            ))}
          </nav>
        </div>
        <div className="lg:col-span-6" data-reveal data-anim="header-mask">
          <div className="wd-hm-img wd-media aspect-[5/4] rounded-[28px]">
            <Img k="svcHead" loading="eager" className="wd-kenburns" data-anim="ken-burns" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Exams() {
  return (
    <section id="exams" className="wd-section relative z-10 bg-white">
      <div className="wd-wrap">
        <div className="grid lg:grid-cols-2 gap-6 items-end">
          <Heading text="Eye exams and appointments" />
          <p className="text-lg text-muted" data-reveal data-anim="fade-up">Every exam ends with a written prescription and a plain explanation of your images. You never have to buy anything to get one.</p>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-reveal data-anim="stagger">
          {exams.map((e, i) => (
            <li key={e.name} style={{ '--i': i }} className={`wd-card wd-tilt p-7 flex flex-col ${e.featured ? 'bg-mint ring-2 ring-teal' : ''}`} data-tilt data-anim="tilt">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl">{e.name}</h3>
                <span className="font-display text-3xl font-extrabold text-teal">{money(e.price)}</span>
              </div>
              <p className="text-sm font-semibold text-coral mt-1">{e.time}</p>
              <p className="text-muted mt-3">{e.for}</p>
              <ul className="mt-4 space-y-1.5 text-[0.97rem] flex-1">
                {e.includes.map((x) => <li key={x} className="flex gap-2"><span className="text-teal" aria-hidden="true">&#10003;</span>{x}</li>)}
              </ul>
              <a href="./book.html#booking" className="wd-link font-semibold text-teal mt-5 self-start min-h-11 inline-flex items-center">Book this exam</a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted mt-4">Sample prices for a fictional practice.</p>
      </div>
    </section>
  );
}

export function Plans() {
  return (
    <section id="plans" className="wd-section relative z-10 bg-sand overflow-hidden">
      <div className="wd-blob w-[460px] h-[460px] -right-40 -top-20 bg-[radial-gradient(circle,rgba(20,122,120,0.2),rgba(20,122,120,0)_70%)]" data-anim="float-blob" aria-hidden="true" />
      <div className="wd-wrap relative">
        <div className="max-w-2xl mb-8">
          <Heading text="Care plans: one payment, no surprises" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">Spread the cost of your exams, get money off glasses and have repairs and damage cover sorted. Switch between monthly and yearly to compare.</p>
        </div>
        <PlanToggle />
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="wd-section relative z-10 bg-mint">
      <div className="wd-wrap">
        <div className="max-w-2xl mb-10">
          <Heading text="What happens in a complete exam" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">About forty-five minutes, in six parts. Tap a step to see what it involves and why we do it.</p>
        </div>
        <div data-reveal data-anim="slide-left">
          <ProcessTimeline />
        </div>
      </div>
    </section>
  );
}

export function Calculator() {
  return (
    <section id="calculator" className="wd-section relative z-10 bg-white">
      <div className="wd-wrap">
        <div className="max-w-2xl mb-10">
          <Heading text="Work out what a pair will cost" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">Choose a frame range, a lens type and any extras. The estimate updates as you go and matches what we would quote at the desk.</p>
        </div>
        <div data-reveal data-anim="fade-up">
          <CostCalculator />
        </div>
      </div>
    </section>
  );
}

export function Lenses() {
  return (
    <section id="lenses" className="wd-section relative z-10 bg-paper">
      <div className="wd-wrap">
        <div className="max-w-2xl mb-10">
          <Heading text="Single vision, office or varifocal?" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">Pick what matters most and the lenses that suit it light up. If you need help with more than one distance, varifocals are usually the answer, and our 60-day guarantee takes the risk out of trying them.</p>
        </div>
        <div data-reveal data-anim="blur-in">
          <LensCompare />
        </div>
      </div>
    </section>
  );
}

export function Materials() {
  return (
    <section id="materials" className="relative z-10 bg-blush lg:h-[260vh]" data-hscroll data-anim="horizontal-scroll">
      <div className="lg:sticky lg:top-0 lg:h-[100svh] flex flex-col justify-center py-16 overflow-hidden">
        <div className="wd-wrap mb-8">
          <Heading text="Lens materials and coatings, explained" />
          <p className="text-lg text-muted mt-4 max-w-2xl" data-reveal data-anim="fade-up">Keep scrolling to move through the options. On a phone, swipe the cards.</p>
        </div>
        <div className="wd-wrap overflow-x-auto lg:overflow-visible">
          <ul className="wd-hs-track flex gap-5 w-max pb-4">
            {materials.map((m, i) => (
              <li key={m.title} className="wd-card w-[270px] md:w-[320px] p-7 shrink-0">
                <span className="font-display text-5xl font-extrabold text-coral">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-2xl mt-4">{m.title}</h3>
                <p className="text-muted mt-3">{m.text}</p>
              </li>
            ))}
            <li className="w-[270px] md:w-[320px] shrink-0 rounded-[22px] bg-teal text-white p-7 flex flex-col justify-between">
              <h3 className="text-2xl">Still unsure?</h3>
              <p className="text-white/90 mt-3">Bring your prescription to a free frame styling session and we will show you lens samples side by side.</p>
              <a href="./book.html#booking" className="wd-btn wd-btn-primary mt-6">Book styling</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function SizeSection() {
  return (
    <section id="sizes" className="wd-section relative z-10 bg-white">
      <div className="wd-wrap">
        <div className="max-w-2xl mb-10">
          <Heading text="Read the numbers on your frame" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">Every frame has three numbers printed inside the arm, in millimetres. Move the sliders to see how each one changes the shape and the fit.</p>
        </div>
        <div data-reveal data-anim="scale-in">
          <SizeGuide />
        </div>
      </div>
    </section>
  );
}

function Feature({ id, data, img, flip, anim }) {
  return (
    <div id={id} className={`grid gap-8 lg:grid-cols-2 items-center scroll-mt-24 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div className="wd-media aspect-[4/3] wd-zoom" data-reveal data-anim={anim}>
        <Img k={img} />
      </div>
      <div data-reveal data-anim="fade-up">
        <h3 className="text-3xl md:text-4xl">{data.title}</h3>
        <p className="text-lg text-muted mt-4">{data.body}</p>
        <ul className="mt-5 grid sm:grid-cols-2 gap-2">
          {data.points.map((p) => <li key={p} className="rounded-2xl bg-white border border-teal/15 px-4 py-3 font-semibold">{p}</li>)}
        </ul>
      </div>
    </div>
  );
}

export function Specialist() {
  return (
    <section id="clinics" className="wd-section relative z-10 bg-mint">
      <div className="wd-wrap space-y-16">
        <div className="max-w-2xl">
          <Heading text="Contact lenses, children and dry eyes" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">Three services that need more time than a standard exam, so each has its own clinic slot in the week.</p>
        </div>
        <Feature id="contacts" data={contacts} img="contacts" anim="clip-wipe" />
        <Feature id="kids" data={kids} img="kids" flip anim="mask-reveal" />
        <Feature id="dry" data={dry} img="dry" anim="rotate-in" />
      </div>
    </section>
  );
}

export function Repairs() {
  return (
    <section id="repairs" className="wd-section relative z-10 bg-white">
      <div className="wd-wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Heading text="Repairs, guarantees and the small print" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">Written plainly, so you know what happens if something goes wrong before it does.</p>
          <ul className="mt-8 space-y-4" data-reveal data-anim="svg-draw">
            {repairs.map((r, i) => (
              <li key={r.title} className="flex gap-4">
                <span className="text-coral shrink-0"><Icon name="tool" className="w-9 h-9" delay={i * 150} /></span>
                <div>
                  <h3 className="text-xl">{r.title}</h3>
                  <p className="text-muted mt-1">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <ul className="lg:col-span-7 grid gap-4 sm:grid-cols-2" data-reveal data-anim="stagger">
          {policies.map((p, i) => (
            <li key={p.title} style={{ '--i': i }} className="wd-card p-6">
              <span className="text-teal inline-block" data-anim="svg-draw"><Icon name="check" className="w-8 h-8" /></span>
              <h3 className="text-xl mt-3">{p.title}</h3>
              <p className="text-muted mt-2">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="wd-section relative z-10 bg-paper">
      <div className="wd-wrap max-w-4xl">
        <div className="text-center mb-10">
          <Heading text="Questions people ask us" />
          <p className="text-lg text-muted mt-5 mx-auto max-w-xl" data-reveal data-anim="fade-up">Fourteen of the questions we hear most at the front desk. Search them, or call us if yours is not here.</p>
        </div>
        <div data-reveal data-anim="fade-up">
          <FaqSearch />
        </div>
      </div>
    </section>
  );
}

export function ServicesCta() {
  return (
    <section id="cta" className="relative z-10 bg-teal text-white py-20 md:py-28 overflow-hidden">
      <div className="wd-spin-glow absolute -left-40 -top-60 w-[560px] h-[560px] rounded-full bg-[conic-gradient(from_90deg,rgba(240,112,90,0.35),rgba(255,255,255,0.08),rgba(240,112,90,0.35))]" data-anim="glow-spin" aria-hidden="true" />
      <div className="wd-wrap relative grid gap-8 lg:grid-cols-2 items-center">
        <Heading text="Seen the prices. Ready to book?" className="font-display text-[clamp(2.4rem,5.5vw,4.4rem)]" />
        <div data-reveal data-anim="slide-right">
          <p className="text-lg text-white/90">Choose an exam and a time on the booking page. If you are not sure which exam you need, pick the essential one and we will upgrade it on the day only if you ask.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn href="./book.html#booking">Book an appointment</Btn>
            <Btn href="./index.html#frames" variant="ghost">Browse frames</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}
