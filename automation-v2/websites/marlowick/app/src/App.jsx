import { useEffect } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Suits from './components/Suits.jsx';
import Spotlight from './components/Spotlight.jsx';
import Hire from './components/Hire.jsx';
import Fittings from './components/Fittings.jsx';
import Visit from './components/Visit.jsx';
import Footer from './components/Footer.jsx';
import { startMotion } from './motion.js';
import { startReveals, startCounts, startParallax } from './effects.js';

export default function App() {
  useEffect(() => {
    startMotion();
    const stops = [startReveals(), startCounts(), startParallax()];
    document.documentElement.classList.add('wd-ready');
    window.__wdReady = true;
    return () => stops.forEach((s) => s());
  }, []);

  return (
    <>
      <a href="#suits" className="wd-skip">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <div className="wd-after">
          <Suits />
          <Spotlight />
          <Hire />
          <Fittings />
          <Visit />
        </div>
      </main>
      <Footer />
    </>
  );
}
