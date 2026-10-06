import { hydrateRoot } from 'react-dom/client';
import '../index.css';
import Home from '../pages/Home.jsx';
import { startEffects } from '../effects.js';

hydrateRoot(document.getElementById('root'), <Home />);
// effects bind to the hydrated DOM on the next frame
requestAnimationFrame(() => startEffects());
