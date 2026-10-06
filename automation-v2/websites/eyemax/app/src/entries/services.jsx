import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/instrument-sans';
import '../index.css';
import { hydrateRoot } from 'react-dom/client';
import Services from '../pages/Services.jsx';

// Reveal start states only apply once JavaScript runs, so the prerendered page is fully visible without it.
document.documentElement.classList.add('js');
hydrateRoot(document.getElementById('root'), <Services />);
