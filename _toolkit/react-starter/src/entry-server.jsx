import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { imageUrls } from './data.js';

// One entry per built HTML file; scripts/prerender.mjs injects each into its page.
// Multi-page sites: add the other pages here and to build.rollupOptions.input in vite.config.js.
export const pages = {
  'index.html': () => renderToString(<App />),
};
export const precacheUrls = imageUrls;
