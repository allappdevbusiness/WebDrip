import { useState } from 'react';
import { spotlight } from '../data.js';

export default function Spotlight() {
  const [paused, setPaused] = useState(false);
  return (
    <section id="spotlight" className="wd-section wd-bg-sky" aria-labelledby="spotTitle">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:px-8">
        <div className={`wd-spot-media ${paused ? 'wd-paused' : ''}`} data-reveal="scale">
          <div className="wd-spot-img" data-speed="1.12">
            <img src={spotlight.img.src} alt={spotlight.alt} loading="lazy" decoding="async" />
          </div>
          <span className="wd-spot-ring" aria-hidden="true" />
          <button
            type="button"
            className="wd-spot-toggle"
            aria-pressed={paused}
            aria-label={paused ? 'Play the photo animation' : 'Pause the photo animation'}
            onClick={() => setPaused((v) => !v)}
          >
            {paused ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" /></svg>
            )}
            <span>{paused ? 'Play' : 'Pause'}</span>
          </button>
        </div>
        <div data-reveal="left">
          <p className="wd-mono wd-kicker">{spotlight.kicker}</p>
          <h2 id="spotTitle" className="wd-h2">{spotlight.title}</h2>
          <p className="wd-lead">{spotlight.copy}</p>
          <a href="#fittings" className="wd-btn wd-btn-ghost mt-6">How a fitting works</a>
        </div>
      </div>
    </section>
  );
}
