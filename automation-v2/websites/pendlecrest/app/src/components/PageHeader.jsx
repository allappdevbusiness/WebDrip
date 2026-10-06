import { Letters, Photo, Btn } from './ui.jsx';

// Animated header for the inner pages: letter rise, a clip-path photo wipe and drifting rings.
export default function PageHeader({ label, title, lede, photo, actions = [] }) {
  return (
    <section id="top" className="relative overflow-hidden bg-ice">
      <svg className="wd-spin pointer-events-none absolute -left-24 top-10 h-[420px] w-[420px] text-white/70" viewBox="0 0 200 200" aria-hidden="true" data-anim="gear-spin">
        {Array.from({ length: 60 }, (_, i) => (
          <line key={i} x1="100" y1="6" x2="100" y2={i % 5 === 0 ? 20 : 13} stroke="currentColor" strokeWidth={i % 5 === 0 ? 3 : 1.4} transform={`rotate(${i * 6} 100 100)`} />
        ))}
      </svg>
      <div className="wd-blob h-96 w-96 right-1/3 -bottom-32" style={{ '--blob': 'rgba(241,230,200,0.9)' }} aria-hidden="true" data-anim="float-blob" />
      <div className="wd-wrap relative grid gap-10 py-14 md:grid-cols-[1.15fr_1fr] md:items-center md:py-20">
        <div>
          <p className="wd-fade-late wd-label mb-4">{label}</p>
          <Letters text={title} className="wd-display text-[clamp(2.5rem,6vw,4.9rem)]" />
          <p className="wd-fade-late wd-lede mt-6">{lede}</p>
          {actions.length ? (
            <div className="wd-fade-late mt-8 flex flex-wrap gap-3">
              {actions.map((a, i) => (
                <Btn key={a.href} href={a.href} variant={i === 0 ? 'primary' : 'ghost'} magnetic={i === 0}>
                  {a.label}
                </Btn>
              ))}
            </div>
          ) : null}
        </div>
        <div className="wd-header-photo relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_40px_80px_-40px_rgba(20,70,80,0.6)]" data-anim="clip-wipe-load">
          <Photo k={photo} eager className="absolute inset-0" parallax="0.08" />
        </div>
      </div>
    </section>
  );
}
