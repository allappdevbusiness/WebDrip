import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/instrument-sans';
import '../index.css';
import { hydrateRoot } from 'react-dom/client';
import Home from '../pages/Home.jsx';

// Reveal start states only apply once JavaScript runs, so the prerendered page is fully visible without it.
document.documentElement.classList.add('js');
hydrateRoot(document.getElementById('root'), <Home />);
