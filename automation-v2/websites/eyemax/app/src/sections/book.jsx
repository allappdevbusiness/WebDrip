import { header, before, team, quick, after, access } from '../data/book.js';
import { brand } from '../data/site.js';
import { Heading, Img, Btn, Icon } from '../components/ui.jsx';
import { BookingPicker, Checklist, Timetable, MapTransit, Gallery, ContactForm } from '../widgets/BookWidgets.jsx';
import { OpenNow } from '../widgets/HomeWidgets.jsx';

export function BookHeader() {
  return (
    <section id="top" className="relative z-10 overflow-hidden bg-mint">
      <div className="absolute inset-0" data-reveal data-anim="header-mask">
        <div className="wd-hm-img absolute inset-0 overflow-hidden">
          <Img k="bookHead" loading="eager" className="w-full h-full object-cover wd-kenburns" data-anim="ken-burns" alt="" />
        </div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(220,239,236,0.97)_0%,rgba(220,239,236,0.9)_45%,rgba(220,239,236,0.25)_100%)]" aria-hidden="true" />
      <div className="wd-wrap relative py-20 md:py-28">
        <div className="max-w-2xl">
          <h1 className="font-display font-extrabold text-[clamp(3.2rem,9vw,7rem)] leading-[0.92] tracking-[-0.045em]" data-reveal data-anim="word-reveal">
            {header.title.split(' ').map((w, i, arr) => (
              <span key={i}><span className="wd-w"><span style={{ '--i': i }}>{w}</span></span>{i < arr.length - 1 ? ' ' : ''}</span>
            ))}
          </h1>
          <p className="text-lg md:text-xl mt-6 text-ink/85" data-reveal data-anim="slide-left" style={{ '--d': 250 }}>{header.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3" data-reveal data-anim="fade-up" style={{ '--d': 400 }}>
            <Btn href="#booking">Choose a time</Btn>
            <Btn href={brand.phoneHref} variant="ghost">Call {brand.phone}</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Booking() {
  return (
    <section id="booking" className="wd-section relative z-10 bg-white scroll-mt-16">
      <div className="wd-wrap">
        <div className="max-w-2xl mb-10">
          <Heading text="Choose your appointment" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">Three quick steps. We hold the time for fifteen minutes while you send your details, then confirm by email. Thursday evening slots run until 8pm.</p>
        </div>
        <div data-reveal data-anim="fade-up">
          <BookingPicker />
        </div>
      </div>
    </section>
  );
}

export function Prepare() {
  return (
    <section id="prepare" className="wd-section relative z-10 bg-sand">
      <div className="wd-wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Heading text="Before you come in" />
          <ul className="mt-8 space-y-6" data-reveal data-anim="stagger">
            {before.map((b, i) => (
              <li key={b.title} style={{ '--i': i }} className="flex gap-4">
                <span className="w-11 h-11 rounded-full bg-white grid place-items-center text-teal shrink-0 shadow-sm"><Icon name="check" className="w-6 h-6" /></span>
                <div>
                  <h3 className="text-2xl">{b.title}</h3>
                  <p className="text-muted mt-1">{b.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6" data-reveal data-anim="slide-right">
          <Checklist />
        </div>
      </div>
    </section>
  );
}

export function Schedule() {
  return (
    <section id="timetable" className="wd-section relative z-10 bg-paper">
      <div className="wd-wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Heading text="Who is in, and when" />
          <p className="text-lg text-muted mt-5 mb-8" data-reveal data-anim="fade-up">Each day has its own clinics, so you can book the optometrist you saw last time or the session that suits your visit.</p>
          <Timetable />
        </div>
        <div className="lg:col-span-4" data-reveal data-anim="blur-in">
          <OpenNow />
        </div>
      </div>
    </section>
  );
}

export function Team() {
  return (
    <section id="team" className="wd-section relative z-10 bg-white">
      <div className="wd-wrap">
        <div className="grid lg:grid-cols-2 gap-6 items-end mb-12">
          <Heading text="The people you will see" />
          <p className="text-lg text-muted" data-reveal data-anim="fade-up">Four of us, all in the building every week. Names and biographies are fictional and the photos are illustrative stock images.</p>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal data-anim="stagger">
          {team.map((t, i) => (
            <li key={t.name} style={{ '--i': i }} className="wd-card wd-zoom wd-tilt overflow-hidden flex flex-col" data-tilt data-anim="tilt">
              <div className="wd-media wd-sheen aspect-[4/5] rounded-none overflow-hidden">
                <Img k={t.photo} alt={`Illustrative portrait for ${t.name}`} data-parallax="0.04" data-anim="parallax" className="scale-110" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="self-start rounded-full bg-blush px-3 py-1 text-sm font-semibold">{t.role}</span>
                <h3 className="text-2xl mt-3">{t.name}</h3>
                <p className="text-muted mt-2 flex-1">{t.bio}</p>
                <a href="#booking" className="wd-link font-semibold text-teal mt-4 self-start min-h-11 inline-flex items-center">Book with {t.name.split(' ').slice(-1)[0] === 'Pell' ? 'Jonah' : t.name.split(' ')[1]}</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FindUs() {
  return (
    <section id="find-us" className="wd-section relative z-10 bg-mint scroll-mt-16">
      <div className="wd-wrap">
        <div className="max-w-2xl mb-10">
          <Heading text="Finding Fernhill Road" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">{brand.address.join(', ')}. Step-free entrance, a hearing loop at the desk and both consulting rooms on the ground floor.</p>
        </div>
        <div data-reveal data-anim="svg-draw">
          <MapTransit />
        </div>
      </div>
    </section>
  );
}

export function Inside() {
  return (
    <section id="gallery" className="wd-section relative z-10 bg-white">
      <div className="wd-wrap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <Heading text="A look around the studio" />
          <p className="text-muted max-w-sm" data-reveal data-anim="fade-up">Tap any photo to open it larger. Use the arrow keys to move between them and Esc to close.</p>
        </div>
        <Gallery />
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="wd-section relative z-10 bg-blush overflow-hidden scroll-mt-16">
      <div className="wd-blob w-[460px] h-[460px] -left-40 bottom-0 bg-[radial-gradient(circle,rgba(20,122,120,0.2),rgba(20,122,120,0)_70%)]" data-anim="float-blob" aria-hidden="true" />
      <div className="wd-wrap relative grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Heading text="Send us a message" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">Confirm a held appointment, ask about a care plan or tell us what is wrong with your glasses.</p>
          <ul className="mt-8 space-y-5" data-reveal data-anim="stagger">
            {quick.map((q, i) => (
              <li key={q.title} style={{ '--i': i }} className="rounded-2xl bg-white/80 p-5">
                <h3 className="text-xl">{q.title}</h3>
                <p className="text-muted mt-1">{q.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-semibold" data-reveal data-anim="fade-up">
            <a className="wd-link" href={brand.phoneHref}>{brand.phone}</a> or <a className="wd-link" href={`mailto:${brand.email}`}>{brand.email}</a>
          </p>
        </div>
        <div className="lg:col-span-7" data-reveal data-anim="rotate-in">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export function Policy() {
  return (
    <section id="policy" className="wd-section relative z-10 bg-paper">
      <div className="wd-wrap grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Heading text="Booking policy, briefly" />
        </div>
        <ul className="lg:col-span-2 grid gap-4 sm:grid-cols-2" data-reveal data-anim="stagger">
          {[
            ['24 hours’ notice', 'Please let us know a day ahead if you cannot make it, so someone else can have the slot.'],
            ['10 minutes’ grace', 'Running late? We can usually still see you within ten minutes. After that we offer the next free slot.'],
            ['Second no-show fee', 'A second missed appointment without notice carries a $25 fee. The first one never does.'],
            ['Children and carers', 'Under-16s are seen with a parent or carer in the room. Bring a favourite toy for the under-fives.'],
          ].map(([t, d], i) => (
            <li key={t} style={{ '--i': i }} className="wd-card p-6">
              <h3 className="text-xl">{t}</h3>
              <p className="text-muted mt-2">{d}</p>
            </li>
          ))}
        </ul>
        <div className="lg:col-span-3 mt-6 flex flex-wrap gap-3" data-reveal data-anim="fade-up">
          <Btn href="./services.html#faq" variant="ghost">Read the full FAQ</Btn>
          <Btn href="./index.html" variant="teal">Back to the home page</Btn>
        </div>
      </div>
    </section>
  );
}

export function AfterVisit() {
  return (
    <section id="after" className="wd-section relative z-10 bg-white">
      <div className="wd-wrap">
        <div className="max-w-2xl mb-12">
          <Heading text="What happens after your exam" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">From the moment you leave the consulting room to the point your new glasses feel like your own. Most people need just one more visit to collect them.</p>
        </div>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative" data-reveal data-anim="svg-draw">
          <svg className="hidden lg:block absolute left-0 right-0 top-6 w-full h-4 text-coral pointer-events-none" viewBox="0 0 1000 16" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path d="M10 8 H990" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" className="wd-draw" style={{ '--len': 1000 }} />
          </svg>
          {after.map((a, i) => (
            <li key={a.title} className="relative">
              <span className="relative z-10 w-12 h-12 rounded-full bg-teal text-white grid place-items-center font-display text-xl font-bold shadow-lg">{i + 1}</span>
              <h3 className="text-2xl mt-5">{a.title}</h3>
              <p className="text-muted mt-2">{a.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Access() {
  return (
    <section id="access" className="wd-section relative z-10 bg-sand">
      <div className="wd-wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Heading text="Access, support and paying" />
          <p className="text-lg text-muted mt-5" data-reveal data-anim="fade-up">Tell us when you book if you need anything set up before you arrive. You will not need to explain it again on the day.</p>
        </div>
        <ul className="lg:col-span-8 grid gap-4 sm:grid-cols-2" data-reveal data-anim="stagger">
          {access.map((a, i) => (
            <li key={a.title} style={{ '--i': i }} className="wd-card wd-tilt p-6" data-tilt data-anim="tilt">
              <h3 className="text-xl">{a.title}</h3>
              <p className="text-muted mt-2">{a.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
