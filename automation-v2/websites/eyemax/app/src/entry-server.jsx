import { renderToString } from 'react-dom/server';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Book from './pages/Book.jsx';
import { imageUrls } from './data/photos.js';

// One entry per built HTML file; the post-build script injects each into its page.
export const pages = {
  'index.html': () => renderToString(<Home />),
  'services.html': () => renderToString(<Services />),
  'book.html': () => renderToString(<Book />),
};
export const precacheUrls = imageUrls;
