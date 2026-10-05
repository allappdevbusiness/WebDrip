import { useEffect, useRef } from 'react';
import { brand, heroTags, photos } from '../data.js';
import { subscribe, state, approach, clamp, easeInOut } from '../motion.js';

// Scroll-driven 3D camera: the framed photo starts tilted and small under the
// headline, then the camera pushes in until it fills the screen. Reverses on
// the way back up. Only transform and opacity are animated.
export default function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const imgRef = useRef(null);
  const copyRef = useRef(null);
  const tagRefs = useRef([]);
  const capRef = useRef(null);

  useEffect(() => {
    let p = 0;
    return subscribe((dt) => {
      const section = sectionRef.current;
      if (!section) return false;
      const span = Math.max(1, section.offsetHeight - state.vh);
      const target = clamp(state.y / span);
      p = state.reduced ? target : approach(p, target, dt, 120);
      const e = easeInOut(p);
      const mobile = state.vw < 768;
      const startScale = mobile ? 0.86 : 0.6;
      const scale = startScale + (1.04 - startScale) * e;
      const ty = (1 - e) * (mobile ? 70 : 50); // keep in sync with .wd-hero-frame in index.css
      const tilt = (1 - e) * 16;
      frameRef.current.style.transform = `translate3d(0, ${ty.toFixed(3)}vh, 0) rotateX(${tilt.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
      imgRef.current.style.transform = `translate3d(0, ${(-4 * e).toFixed(3)}%, 0) scale(${(1.18 - 0.12 * e).toFixed(4)})`;
      copyRef.current.style.transform = `translate3d(0, ${(-p * 34).toFixed(3)}vh, 0)`;
      copyRef.current.style.opacity = String(clamp(1 - p * 2.2).toFixed(3));
      tagRefs.current.forEach((el, i) => {
        if (!el) return;
        const sp = heroTags[i].speed;
        el.style.transform = `translate3d(0, ${(-p * 48 * sp).toFixed(3)}vh, 0)`;
        el.style.opacity = String(clamp(1 - p * 1.8 * sp).toFixed(3));
      });
      capRef.current.style.opacity = String(clamp((p - 0.6) / 0.3).toFixed(3));
      capRef.current.style.transform = `translate3d(0, ${((1 - clamp((p - 0.6) / 0.3)) * 24).toFixed(2)}px, 0)`;
      // hide the fixed stage once the next section fully covers it
      stageRef.current.style.opacity = state.y > section.offsetHeight + state.vh * 0.2 ? '0' : '1';
      return p !== target;
    });
  }, []);

  return (
    <section id="top" ref={sectionRef} className="wd-hero relative" aria-labelledby="heroTitle">
      <div ref={stageRef} className="wd-hero-stage" aria-hidden="false">
        <div className="wd-hero-persp">
          <div ref={frameRef} className="wd-hero-frame">
            <img
              id="heroImg"
              ref={imgRef}
              src={photos.hero.src}
              alt="Suit jackets in cobalt, camel, sky blue and cream hanging on a shop rail"
              fetchPriority="high"
              decoding="async"
            />
            <div className="wd-hero-shade" aria-hidden="true" />
            <p ref={capRef} className="wd-hero-cap">
              <span className="wd-mono">On the rail this week</span>
              Cobalt, camel, sky and cream, all in your size.
            </p>
          </div>
        </div>
        <div className="wd-blob wd-blob-a" aria-hidden="true" />
        <div className="wd-blob wd-blob-b" aria-hidden="true" />
      </div>

      <div className="wd-hero-fore">
        <div ref={copyRef} className="wd-hero-copy mx-auto max-w-3xl px-5 text-center">
          <p className="wd-mono wd-kicker wd-intro" style={{ '--d': '0.15s' }}>
            {brand.kicker}
          </p>
          <h1 id="heroTitle" className="wd-h1 wd-intro" style={{ '--d': '0.3s' }}>
            <span className="wd-line">Sharp suits,</span> <span className="wd-line wd-accent">fitted properly.</span>
          </h1>
          <p className="wd-lead mx-auto max-w-xl wd-intro" style={{ '--d': '0.5s' }}>
            {brand.intro}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 wd-intro" style={{ '--d': '0.65s' }}>
            <a href="#visit" className="wd-btn wd-btn-primary wd-sheen">
              Book a fitting
            </a>
            <a href="#suits" className="wd-btn wd-btn-ghost">
              See the suits
            </a>
          </div>
        </div>
        {heroTags.map((t, i) => (
          <div key={t.label} ref={(el) => (tagRefs.current[i] = el)} className={`wd-tag ${t.pos} wd-intro`} style={{ '--d': `${0.85 + i * 0.12}s` }}>
            <span className="wd-tag-dot" aria-hidden="true" />
            <span className="wd-tag-label">{t.label}</span>
            <span className="wd-mono wd-tag-price">{t.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
