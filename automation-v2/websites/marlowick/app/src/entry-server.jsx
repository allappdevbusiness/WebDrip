import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { imageUrls } from './data.js';

export const render = () => renderToString(<App />);
export const precacheUrls = imageUrls;
