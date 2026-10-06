import { hydrateRoot } from 'react-dom/client';
import '../index.css';
import Book from '../pages/Book.jsx';
import { startEffects } from '../effects.js';

hydrateRoot(document.getElementById('root'), <Book />);
// effects bind to the hydrated DOM on the next frame
requestAnimationFrame(() => startEffects());
