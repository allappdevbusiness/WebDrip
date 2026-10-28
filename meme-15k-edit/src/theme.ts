import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import brand from '../public/brand.json';

// Marca do vídeo: paleta e fontes do guia de estilo aprovado pelo usuário (public/brand.json).
// Fontes locais (OFL, de @fontsource) porque o browser do render não alcança o Google Fonts.
loadFont({family: 'Anton', url: staticFile('fonts/anton-latin-400-normal.woff2'), weight: '400'});
loadFont({family: 'Playfair Display', url: staticFile('fonts/playfair-display-latin-900-italic.woff2'), weight: '900', style: 'italic'});
loadFont({family: 'Space Mono', url: staticFile('fonts/space-mono-latin-400-normal.woff2'), weight: '400'});
loadFont({family: 'Space Mono', url: staticFile('fonts/space-mono-latin-700-normal.woff2'), weight: '700'});
loadFont({family: 'Special Elite', url: staticFile('fonts/special-elite-latin-400-normal.woff2'), weight: '400'});

export const C = brand.colors;
export const BRAND = brand;
export const FONT = '"Anton", Impact, sans-serif';
export const ACCENT = '"Playfair Display", Georgia, serif';
export const MONO = '"Space Mono", Menlo, monospace';
export const NOTE = '"Special Elite", "Courier New", monospace';

/** Escala tipográfica em px para o lado menor de 1080; multiplique por `u` de useFormat(). */
export const type = {hero: 300, title: 130, caption: 88, lead: 64, body: 44, label: 30};
