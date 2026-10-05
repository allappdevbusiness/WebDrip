import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, F } from '../theme';

// ---------- devices ----------
export const Phone: React.FC<{ w: number; children: React.ReactNode; style?: React.CSSProperties; shadow?: boolean }> = ({ w, children, style, shadow = true }) => {
  const h = w * 2.08;
  const b = w * 0.035;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.14,
        background: '#17110E',
        padding: b,
        boxShadow: shadow ? `0 ${w * 0.08}px ${w * 0.2}px rgba(63,42,31,.35), inset 0 0 0 ${Math.max(2, w * 0.006)}px #3a2c25` : undefined,
        ...style,
      }}
    >
      <div style={{ width: '100%', height: '100%', borderRadius: w * 0.11, overflow: 'hidden', position: 'relative', background: C.bone }}>
        {children}
        <div style={{ position: 'absolute', top: w * 0.025, left: '50%', width: w * 0.3, height: w * 0.075, marginLeft: -w * 0.15, borderRadius: w, background: '#17110E' }} />
      </div>
    </div>
  );
};

// a screenshot shown at the device width, offset vertically by `scroll` css-px of the 390px-wide page
export const Shot: React.FC<{ src: string; w: number; scroll?: number; cssW?: number; style?: React.CSSProperties }> = ({ src, w, scroll = 0, cssW = 390, style }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', ...style }}>
    <Img src={staticFile(src)} style={{ position: 'absolute', left: 0, top: -scroll * (w / cssW), width: w }} />
  </div>
);
// phone screen width for a Phone of width w
export const screenW = (w: number) => w - 2 * w * 0.035;

export const Browser: React.FC<{ w: number; children: React.ReactNode; style?: React.CSSProperties; url?: string }> = ({ w, children, style, url = 'carritorojo.com' }) => {
  const bar = w * 0.045;
  return (
    <div style={{ width: w, borderRadius: w * 0.018, overflow: 'hidden', background: C.paper, boxShadow: `0 ${w * 0.04}px ${w * 0.1}px rgba(63,42,31,.3)`, ...style }}>
      <div style={{ height: bar, background: C.shell, display: 'flex', alignItems: 'center', gap: bar * 0.22, paddingLeft: bar * 0.45, borderBottom: '1px solid rgba(63,42,31,.08)' }}>
        {[C.tomate, C.marigold, C.jade].map((c) => (
          <div key={c} style={{ width: bar * 0.26, height: bar * 0.26, borderRadius: '50%', background: c }} />
        ))}
        <div style={{ marginLeft: bar * 0.6, height: bar * 0.56, width: w * 0.36, borderRadius: bar, background: C.paper, display: 'flex', alignItems: 'center', paddingLeft: bar * 0.4, fontFamily: F.body, fontSize: bar * 0.3, color: C.clay }}>
          {url}
        </div>
      </div>
      <div style={{ position: 'relative', width: w, height: w * 0.625, overflow: 'hidden' }}>{children}</div>
    </div>
  );
};

// ---------- rebuilt site UI (crisp at any size) ----------
export type Dish = { img: string; name: string; price: string; badge?: string; badgeBg?: string; badgeFg?: string; desc: string; origin: string; fy?: number };
export const DISHES: Record<string, Dish> = {
  pollo: { img: 'img/pollo.jpg', name: 'POLLO A LA BRASA', price: '$16', badge: 'House specialty', badgeBg: C.rosa, badgeFg: C.bone, desc: 'Half a chicken brined overnight in beer, garlic and ají panca, then turned over coals for five hours.', origin: 'Perú' },
  birria: { img: 'img/birria.jpg', name: 'BIRRIA DE RES', price: '$13', badge: 'Most ordered', badgeBg: C.marigold, badgeFg: C.cacao, desc: 'Nine-hour braised beef shoulder, chile guajillo, three tacos griddled in the fat.', origin: 'Jalisco, México' },
  pastor: { img: 'img/pastor.jpg', name: 'TACOS AL PASTOR', price: '$12', desc: 'Achiote-marinated pork carved straight off the trompo, with charred pineapple.', origin: 'Ciudad de México' },
  elote: { img: 'img/elote.jpg', name: 'ELOTE LOCO', price: '$7', badge: 'Vegetarian', badgeBg: C.jade, badgeFg: C.bone, desc: 'Charcoal-grilled corn rolled in chipotle crema, cotija and chile-lime.', origin: 'México / El Salvador' },
  pupusas: { img: 'img/pupusas.jpg', name: 'PUPUSAS', price: '$10', badge: "Rosa's recipe", badgeBg: C.marigold, badgeFg: C.cacao, desc: 'Two hand-pressed masa rounds stuffed with chicharrón, frijol and quesillo.', origin: 'El Salvador' },
  arepa: { img: 'img/arepa.jpg', name: 'AREPA REINA', price: '$12', desc: 'Griddled corn cake split and packed with avocado-chicken salad.', origin: 'Venezuela' },
  empanadas: { img: 'img/empanadas.jpg', name: 'EMPANADAS', price: '$9', desc: 'Three baked salteñas, folded by hand every morning.', origin: 'Argentina / Bolivia' },
  ceviche: { img: 'img/ceviche.jpg', name: 'CEVICHE LIMEÑO', price: '$15', badge: 'Gluten free', badgeBg: C.jade, badgeFg: C.bone, desc: 'Gulf snapper cured in leche de tigre with rocoto, red onion and cilantro.', origin: 'Perú' },
  cubano: { img: 'img/cubano.jpg', name: 'CUBANO PRENSADO', price: '$14', desc: 'Mojo-roasted pork, smoked ham, Swiss, pickle and mustard, pressed glassy.', origin: 'Cuba / Miami' },
  churros: { img: 'img/churros.jpg', name: 'CHURROS', price: '$8', badge: 'Vegetarian', badgeBg: C.jade, badgeFg: C.bone, desc: 'Fried to order. Cinnamon sugar, with dulce de leche for dunking.', origin: 'Everywhere, honestly' },
};

// dish card at width w (site card ≈ 360 css px; everything scales from that)
export const DishCard: React.FC<{ dish: Dish; w: number; style?: React.CSSProperties; price?: React.ReactNode; img?: React.ReactNode; highlight?: number; compact?: boolean }> = ({ dish, w, style, price, img, highlight = 0, compact }) => {
  const k = w / 360;
  return (
    <div
      style={{
        width: w,
        borderRadius: 16 * k,
        background: C.paper,
        overflow: 'hidden',
        border: `${2 * k}px solid ${highlight ? `rgba(217,27,98,${0.3 + 0.7 * highlight})` : 'rgba(63,42,31,.08)'}`,
        boxShadow: `0 ${14 * k}px ${36 * k}px rgba(63,42,31,.16)`,
        ...style,
      }}
    >
      <div style={{ position: 'relative', height: 208 * k, overflow: 'hidden' }}>
        {img ?? <Img src={staticFile(dish.img)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${dish.fy ?? 50}%` }} />}
        {dish.badge && (
          <span style={{ position: 'absolute', top: 12 * k, left: 12 * k, borderRadius: 99, background: dish.badgeBg, color: dish.badgeFg, padding: `${4 * k}px ${12 * k}px`, fontFamily: F.body, fontWeight: 700, fontSize: 11 * k, letterSpacing: 0.06 * 11 * k, textTransform: 'uppercase' }}>
            {dish.badge}
          </span>
        )}
      </div>
      <div style={{ padding: `${20 * k}px ${22 * k}px ${compact ? 18 : 22}px` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 * k }}>
          <div style={{ fontFamily: F.display, fontSize: 24 * k, letterSpacing: 0.025 * 24 * k, color: C.cobalt, lineHeight: 1.05 }}>{dish.name}</div>
          <div style={{ fontFamily: F.display, fontSize: 21 * k, color: C.rosa, flexShrink: 0 }}>{price ?? dish.price}</div>
        </div>
        {!compact && <div style={{ marginTop: 10 * k, fontFamily: F.body, fontSize: 14 * k, lineHeight: 1.6, color: C.clay }}>{dish.desc}</div>}
        <div style={{ marginTop: 12 * k, fontFamily: F.body, fontSize: 11 * k, letterSpacing: 0.15 * 11 * k, textTransform: 'uppercase', color: 'rgba(119,87,74,.7)' }}>{dish.origin}</div>
      </div>
    </div>
  );
};

export const Chip: React.FC<{ label: string; active?: number; k?: number; style?: React.CSSProperties }> = ({ label, active = 0, k = 1, style }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 44 * k,
      padding: `0 ${20 * k}px`,
      borderRadius: 99,
      border: `${2 * k}px solid ${active > 0.5 ? C.cobalt : 'rgba(63,42,31,.15)'}`,
      background: active > 0.5 ? C.cobalt : 'transparent',
      color: active > 0.5 ? C.bone : C.clay,
      fontFamily: F.body,
      fontWeight: 600,
      fontSize: 14 * k,
      transform: `scale(${1 + 0.08 * Math.sin(Math.PI * Math.min(1, active))})`,
      ...style,
    }}
  >
    {label}
  </div>
);

export const RouteRow: React.FC<{ day: string; where: string; hours: React.ReactNode; today?: boolean; dim?: boolean; k?: number; style?: React.CSSProperties }> = ({ day, where, hours, today, dim, k = 1, style }) => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16 * k,
      borderRadius: 12 * k,
      border: `${2 * k}px solid ${today ? C.rosa : 'rgba(63,42,31,.08)'}`,
      background: today ? C.blush : C.paper,
      padding: `${18 * k}px ${20 * k}px`,
      overflow: 'hidden',
      boxShadow: today ? `0 ${10 * k}px ${24 * k}px rgba(217,27,98,.14)` : undefined,
      ...style,
    }}
  >
    {today && (
      <span style={{ position: 'absolute', top: 0, right: 0, background: C.rosa, color: C.bone, fontFamily: F.body, fontWeight: 700, fontSize: 10 * k, letterSpacing: 0.08 * 10 * k, textTransform: 'uppercase', padding: `${4 * k}px ${12 * k}px`, borderBottomLeftRadius: 8 * k }}>Today</span>
    )}
    <div>
      <div style={{ fontFamily: F.display, fontSize: 20 * k, letterSpacing: 0.025 * 20 * k, color: today ? C.rosa : dim ? 'rgba(63,42,31,.35)' : C.cobalt }}>{day}</div>
      <div style={{ fontFamily: F.body, fontSize: 14 * k, color: today ? 'rgba(63,42,31,.75)' : C.clay }}>{where}</div>
    </div>
    <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 14 * k, color: dim ? 'rgba(119,87,74,.45)' : C.rosa, flexShrink: 0, marginTop: today ? 16 * k : 0 }}>{hours}</div>
  </div>
);

export const Pill: React.FC<{ label: string; bg?: string; fg?: string; k?: number; style?: React.CSSProperties; outline?: boolean }> = ({ label, bg = C.rosa, fg = C.bone, k = 1, style, outline }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 56 * k,
      padding: `0 ${30 * k}px`,
      borderRadius: 99,
      background: outline ? 'transparent' : bg,
      border: outline ? `${2 * k}px solid rgba(63,42,31,.2)` : undefined,
      color: outline ? C.cacao : fg,
      fontFamily: F.body,
      fontWeight: 700,
      fontSize: 17 * k,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      boxShadow: outline ? undefined : `0 ${10 * k}px ${26 * k}px ${bg}55`,
      ...style,
    }}
  >
    {label}
  </div>
);

export const Logo: React.FC<{ k?: number; style?: React.CSSProperties }> = ({ k = 1, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 * k, ...style }}>
    <div style={{ width: 40 * k, height: 40 * k, borderRadius: '50%', background: C.rosa, color: C.bone, fontFamily: F.display, fontSize: 20 * k, display: 'grid', placeItems: 'center', paddingTop: 2 * k }}>CR</div>
    <div style={{ fontFamily: F.display, fontSize: 26 * k, letterSpacing: 0.025 * 26 * k, color: C.cobalt }}>
      CARRITO<span style={{ color: C.rosa }}>ROJO</span>
    </div>
  </div>
);

// ✓ UPDATED stamp
export const Updated: React.FC<{ k?: number; style?: React.CSSProperties }> = ({ k = 1, style }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 * k, background: C.jade, color: C.bone, borderRadius: 99, padding: `${12 * k}px ${28 * k}px ${12 * k}px ${14 * k}px`, boxShadow: `0 ${10 * k}px ${30 * k}px rgba(15,157,99,.35)`, ...style }}>
    <div style={{ width: 44 * k, height: 44 * k, borderRadius: '50%', background: C.bone, color: C.jade, display: 'grid', placeItems: 'center', fontFamily: F.body, fontWeight: 800, fontSize: 28 * k }}>✓</div>
    <div style={{ fontFamily: F.display, fontSize: 40 * k, letterSpacing: 0.04 * 40 * k }}>UPDATED</div>
  </div>
);

// tap ring (finger tap indicator)
export const Tap: React.FC<{ t: number; at: number; x: number; y: number; k?: number }> = ({ t, at, x, y, k = 1 }) => {
  if (t < at - 0.12 || t > at + 0.45) return null;
  const pre = t < at;
  const q = pre ? 1 - (at - t) / 0.12 : (t - at) / 0.45;
  return (
    <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', width: 64 * k, height: 64 * k, left: -32 * k, top: -32 * k, borderRadius: '50%', background: 'rgba(63,42,31,.28)', transform: `scale(${pre ? 0.6 + 0.4 * q : 1 - 0.2 * q})`, opacity: pre ? q : 1 - q }} />
      {!pre && <div style={{ position: 'absolute', width: 64 * k, height: 64 * k, left: -32 * k, top: -32 * k, borderRadius: '50%', border: `${4 * k}px solid ${C.rosa}`, transform: `scale(${1 + 1.6 * q})`, opacity: 1 - q }} />}
    </div>
  );
};
