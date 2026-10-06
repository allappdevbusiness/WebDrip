import { useEffect } from 'react';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import { initEffects } from '../effects.js';

export default function Layout({ page, credits, children, intro = false }) {
  useEffect(() => {
    initEffects();
  }, []);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] wd-btn wd-btn-primary">Skip to content</a>
      <div id="wdGlow" className="hidden [@media(pointer:fine)]:block" data-anim="cursor-glow" aria-hidden="true" />
      <Nav page={page} intro={intro} />
      <main id="main" data-anim="page-transition">{children}</main>
      <Footer credits={credits} />
    </>
  );
}
