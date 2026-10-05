import { hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/inter/index.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import './index.css';
import App from './App.jsx';

hydrateRoot(document.getElementById('root'), <App />);

if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {});
  });
}
