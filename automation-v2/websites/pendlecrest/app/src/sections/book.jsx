import { Reveal, Words, SectionHead, Ticks, Photo } from '../components/ui.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { OpenNow } from '../widgets/HomeWidgets.jsx';
import { header, ways, team, bookingQs } from '../data/book.js';
import { brand } from '../data/site.js';
import { BookingPicker, ServiceQuiz, PostalChecklist, BenchTimetable, GalleryLightbox, DirectionsTabs, TicketTracker, ContactForm } from '../widgets/BookWidgets.jsx';

export function BookHeader() {
  return (
    <PageHeader
      label={header.label}
      title={header.title}
      lede={header.lede}
      photo="pocketTable"
      actions={[{ href: '#booking', label: 'Pick a counter slot' }, { href: '#postal', label: 'Send it by post' }]}
    />
  );
}

export function Ways() {
  return (
    <section id="ways" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap">
        <SectionHead label="Two ways in" title="Same bench, same care, whichever way it arrives." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ways.map((w, wi) => (
            <Reveal key={w.title} kind={wi === 0 ? 'left' : 'right'} className="wd-card wd-tilt wd-card-lift p-6 md:p-8" data-tilt="">
              <div className="flex items-center justify-between gap-4">
                <h3 className="wd-h3 text-2xl">{w.title}</h3>
                <span className="rounded-full bg-brass-soft px-3 py-1 text-sm font-[620] text-brass">{w.tag}</span>
              </div>
              <ol className="mt-6 space-y-4">
                {w.steps.map((s, i) => (
                  <li key={s} className="flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-teal font-[700] text-teal">{i + 1}</span>
                    <span className="pt-1">{s}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-t border-silver-2 pt-4 text-sm text-slate">{w.note}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Booking() {
  return (
    <section id="booking" className="bg-frost py-20 md:py-28">
      <div className="wd-wrap">
        <SectionHead
          label="Counter slots"
          title="Pick ten minutes at the counter."
          lede="Booking isn’t required, but a slot means no waiting on Thursday evenings and Saturdays. Inspections and estimates are free. Quick jobs are paid for on the day."
        />
        <Reveal kind="up" className="mt-10">
          <BookingPicker />
        </Reveal>
      </div>
    </section>
  );
}

export function Quiz() {
  return (
    <section id="quiz-section" className="relative overflow-hidden bg-ice py-20 md:py-28">
      <div className="wd-blob h-[26rem] w-[26rem] right-10 top-0" style={{ '--blob': 'rgba(255,255,255,0.95)' }} aria-hidden="true" data-anim="float-blob" />
      <div className="wd-wrap relative">
        <SectionHead center label="Not sure what to ask for?" title="Three questions, one suggestion." lede="Answer three quick questions and we’ll suggest where to start. The written estimate confirms it once we’ve seen the watch." />
        <Reveal kind="flip" className="mt-10">
          <ServiceQuiz />
        </Reveal>
      </div>
    </section>
  );
}

export function Postal() {
  return (
    <section id="postal" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHead label="Posting it in" title="Pack it like it’s going across the country, because it might be." />
          <div className="wd-prose mt-6 text-slate">
            <Reveal as="p" kind="up">
              Watches travel well when they can’t move. A small, sturdy box with plenty of padding is safer than a big box with a
              little. Push the crown in and wrap the watch in a soft cloth first, so the bubble wrap can’t scratch the crystal.
            </Reveal>
            <Reveal as="p" kind="up" i={1}>
              Use a tracked, insured service and insure it for its full replacement value. Keep the receipt until we email to say
              it has arrived, which we do the same working day.
            </Reveal>
          </div>
          <Reveal kind="up" i={2} className="mt-8">
            <svg viewBox="0 0 320 120" className="wd-draw w-full max-w-md text-teal" data-reveal="up" data-anim="svg-draw" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Diagram: a watch in a cloth, in bubble wrap, in a padded box">
              <rect x="10" y="30" width="80" height="60" rx="10" pathLength="1" />
              <circle cx="50" cy="60" r="16" pathLength="1" />
              <path d="M50 60v-8M50 60l6 3" pathLength="1" />
              <path d="M100 60h20M114 54l6 6-6 6" pathLength="1" />
              <rect x="130" y="22" width="80" height="76" rx="18" strokeDasharray="1" pathLength="1" />
              <path d="M220 60h20M234 54l6 6-6 6" pathLength="1" />
              <rect x="250" y="16" width="60" height="88" rx="6" pathLength="1" />
              <path d="M250 40h60M280 16v24" pathLength="1" />
            </svg>
          </Reveal>
        </div>
        <Reveal kind="right">
          <PostalChecklist />
        </Reveal>
      </div>
    </section>
  );
}

export function Bench() {
  return (
    <section id="bench-week" className="bg-frost py-20 md:py-28">
      <div className="wd-wrap">
        <SectionHead label="A week at the bench" title="What happens on which day." lede="The counter keeps short hours so the watchmakers get long, quiet stretches at the bench. Here’s how the week runs." />
        <Ticks className="mt-8" />
        <Reveal kind="up" className="mt-8">
          <BenchTimetable />
        </Reveal>
      </div>
    </section>
  );
}

export function Gallery() {
  return (
    <section id="gallery" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHead label="Recent work" title="From the finished shelf." />
          <Reveal as="p" kind="right" className="max-w-sm text-slate">Tap any photo to see it larger. Captions describe the kind of work we do. The photos are stock imagery for this concept.</Reveal>
        </div>
        <div className="mt-10">
          <GalleryLightbox />
        </div>
      </div>
    </section>
  );
}

export function Team() {
  return (
    <section id="team" className="bg-ice py-20 md:py-28">
      <div className="wd-wrap">
        <SectionHead center label="The people at the bench" title="Three people, one room, every watch." lede="Fictional people for a fictional workshop. The kind of team a small independent bench really runs on." />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {team.map((t, i) => (
            <Reveal as="li" kind="rotate" i={i} key={t.name} className="wd-card wd-card-lift p-6 text-center">
              <div className="relative mx-auto h-28 w-28">
                <svg viewBox="0 0 100 100" className="wd-spin absolute inset-0 h-full w-full text-brass" aria-hidden="true">
                  <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 5" />
                </svg>
                <span className="absolute inset-3 grid place-items-center rounded-full bg-teal text-3xl font-[760] text-white [font-stretch:125%]">{t.initials}</span>
              </div>
              <h3 className="wd-h3 mt-5 text-xl">{t.name}</h3>
              <p className="text-sm font-[620] text-brass">{t.role}</p>
              <p className="mt-3 text-[0.97rem] text-slate">{t.bio}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function MapIllustration() {
  return (
    <svg viewBox="0 0 480 340" className="h-full w-full" role="img" aria-label="Illustrated map: Pendlecrest is in Ropewalk Yard, just north of the Pendle Street tram stop and near the canal">
      <rect width="480" height="340" fill="#f2f6f7" />
      <path d="M0 250 C120 230 200 290 320 262 S440 230 480 240 V300 C420 290 340 320 260 312 S100 270 0 300Z" fill="#d3e6e6" />
      <text x="40" y="292" fontSize="12" fill="#145e68">Canal towpath</text>
      <g stroke="#c5cbce" strokeWidth="14" strokeLinecap="round">
        <path d="M60 40 L60 230" />
        <path d="M20 140 L460 140" />
        <path d="M300 20 L300 230" />
      </g>
      <g stroke="#fff" strokeWidth="2" strokeDasharray="6 8">
        <path d="M20 140 L460 140" />
      </g>
      <text x="320" y="132" fontSize="12" fill="#44575d">Pendle Street</text>
      <text x="70" y="60" fontSize="12" fill="#44575d" transform="rotate(90 70 60)">Rope Lane</text>
      <rect x="150" y="60" width="110" height="62" rx="8" fill="#fff" stroke="#c5cbce" />
      <text x="205" y="96" fontSize="12" textAnchor="middle" fill="#44575d">Ropewalk Yard</text>
      <rect x="330" y="160" width="90" height="40" rx="6" fill="#fff" stroke="#c5cbce" />
      <text x="375" y="185" fontSize="11" textAnchor="middle" fill="#44575d">Canal Wharf P</text>
      <g transform="translate(300 152)">
        <rect x="-26" y="-2" width="52" height="20" rx="10" fill="#4a6fa5" />
        <text y="12" fontSize="10" textAnchor="middle" fill="#fff">Tram</text>
      </g>
      <path className="wd-draw-route" d="M300 150 C290 128 260 120 222 112" fill="none" stroke="#8c6a1a" strokeWidth="3" strokeDasharray="4 6" />
      <g className="wd-bob" data-anim="map-pin">
        <path d="M205 104 c-14 0 -24 -10 -24 -23 c0 -18 24 -38 24 -38 s24 20 24 38 c0 13 -10 23 -24 23z" fill="#145e68" />
        <circle cx="205" cy="80" r="8" fill="#fff" />
      </g>
    </svg>
  );
}

export function Find() {
  return (
    <section id="find" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <Reveal kind="mask" className="overflow-hidden rounded-[22px] border border-silver-2">
          <div className="aspect-[48/34]">
            <MapIllustration />
          </div>
        </Reveal>
        <div>
          <SectionHead label="Finding us" title="Through the archway, past the bakery." />
          <Reveal as="p" kind="up" className="mt-5 text-slate">
            {brand.address.join(', ')}. The workshop is the green door at the far end of the yard. It’s step-free, with a bench to sit
            on while you wait.
          </Reveal>
          <Reveal kind="up" i={1} className="mt-6">
            <DirectionsTabs />
          </Reveal>
          <Reveal kind="up" i={2} className="mt-6">
            <OpenNow />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Track() {
  return (
    <section id="track" className="bg-frost py-20 md:py-28">
      <div className="wd-wrap grid gap-12 md:grid-cols-[1fr_1.3fr] md:items-center">
        <div>
          <SectionHead label="Already with us?" title="Track your repair." />
          <Reveal as="p" kind="up" className="mt-5 text-slate">
            Every watch gets a ticket number at drop-off or when the parcel arrives. Enter it here to see which of the six stages it
            has reached. We also email you at each step, so there’s no need to check daily.
          </Reveal>
        </div>
        <Reveal kind="scale">
          <TicketTracker />
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="bg-ivory py-20 md:py-28">
      <div className="wd-wrap grid gap-12 lg:grid-cols-[0.9fr_1.4fr]">
        <div>
          <SectionHead label="Ask a watchmaker" title="A question before you book?" />
          <Reveal as="p" kind="up" className="mt-5 text-slate">
            Send a description, and a photo afterwards if you like. A watchmaker, not a sales team, replies within one working day.
            For anything urgent, such as water inside the case, ring the bench.
          </Reveal>
          <Reveal kind="up" i={1} className="mt-6 space-y-2">
            <p><a className="wd-link font-[640] text-teal" href={brand.phoneHref}>{brand.phone}</a></p>
            <p><a className="wd-link font-[640] text-teal" href={`mailto:${brand.email}`}>{brand.email}</a></p>
          </Reveal>
          <Reveal kind="mask" i={2} className="mt-8 hidden aspect-[4/3] overflow-hidden rounded-[22px] lg:block">
            <Photo k="pocketSilver" className="h-full" />
          </Reveal>
        </div>
        <Reveal kind="up">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

export function BookingQuestions() {
  return (
    <section id="questions" className="bg-ice py-20 md:py-28">
      <div className="wd-wrap">
        <SectionHead label="Before you book" title="Six things people ask at the counter." />
        <dl className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {bookingQs.map((b, i) => (
            <Reveal key={b.q} kind={i % 2 ? 'right' : 'left'} i={Math.floor(i / 2)} className="border-t-2 border-teal pt-5">
              <dt className="wd-h3 text-lg">{b.q}</dt>
              <dd className="mt-2 text-slate">{b.a}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
