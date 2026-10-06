import { hydrateRoot } from 'react-dom/client';
import '../index.css';
import Services from '../pages/Services.jsx';
import { startEffects } from '../effects.js';

hydrateRoot(document.getElementById('root'), <Services />);
// effects bind to the hydrated DOM on the next frame
requestAnimationFrame(() => startEffects());
