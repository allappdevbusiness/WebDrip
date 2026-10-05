import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
const memo = new Map();
// Headless Chromium does not trust the agent proxy CA; fetch third-party assets with curl (which does) and hand them to the page.
async function viaCurl(route) {
  const url = route.request().url();
  if (url.startsWith('http://127.0.0.1') || url.startsWith('data:')) return route.continue();
  try {
    if (!memo.has(url)) {
      const body = execFileSync('curl', ['-sS', '--fail', '-L', '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36', url], { maxBuffer: 64 << 20 });
      const ct = url.includes('fonts.googleapis') ? 'text/css' : url.includes('gstatic') ? 'font/woff2' : url.includes('unsplash') ? 'image/jpeg' : 'application/javascript';
      memo.set(url, { body, ct });
    }
    const { body, ct } = memo.get(url);
    return route.fulfill({ status: 200, body, headers: { 'content-type': ct, 'access-control-allow-origin': '*' } });
  } catch (e) { return route.abort(); }
}
const OUT = process.argv[2];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--no-proxy-server'] });
async function page(w,h,dpr){ const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:dpr,reducedMotion:'reduce'}); await ctx.route('**/*', viaCurl); const p=await ctx.newPage(); await p.goto('http://127.0.0.1:8899/',{waitUntil:'networkidle'}); return p; }
async function settle(p){ await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));} window.scrollTo(0,0); const tt=document.getElementById('to-top'); if(tt) tt.style.display='none'; document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in')); document.querySelectorAll('img[data-src]').forEach(i=>{if(!i.src)i.src=i.dataset.src;i.classList.add('loaded')}); document.querySelectorAll('.count').forEach(c=>c.textContent=Number(c.dataset.to).toLocaleString()); }); await p.waitForTimeout(2500); }
// mobile
const m=await page(390,844,3); await settle(m);
await m.screenshot({path:`${OUT}/m_hero.png`});
for (const [id,name] of [['#menu','m_menu'],['#ruta','m_ruta'],['#taqueria','m_taco'],['#historia','m_story'],['#opiniones','m_reviews'],['#reserva','m_reserva']]) {
  await m.evaluate(s=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,document.querySelector(s).getBoundingClientRect().top+window.scrollY-70)},id); await m.waitForTimeout(600); await m.screenshot({path:`${OUT}/${name}.png`});
}
await m.screenshot({path:`${OUT}/m_full.png`,fullPage:true});
// element shots (mobile, crisp)
const els={dish0:'#menu-grid article:nth-child(1)',dish1:'#menu-grid article:nth-child(2)',dish2:'#menu-grid article:nth-child(3)',dish8:'#menu-grid article:nth-child(8)',filters:'[role=tablist]',route:'#ruta ul',heroCard:'#hero-card',marquee:'.marquee',stats:'main section.bg-shell dl',nav:'#nav'};
for (const [k,s] of Object.entries(els)) { const e=m.locator(s).first(); await e.scrollIntoViewIfNeeded(); await m.waitForTimeout(300); await e.screenshot({path:`${OUT}/el_${k}.png`}); }
// desktop
const d=await page(1440,900,2); await settle(d);
await d.screenshot({path:`${OUT}/d_hero.png`});
await d.evaluate(()=>window.scrollTo(0,document.querySelector('#top').offsetHeight*0.75)); await d.waitForTimeout(900); await d.screenshot({path:`${OUT}/d_hero_full.png`});
for (const [id,name] of [['#menu','d_menu'],['#ruta','d_ruta'],['#taqueria','d_taco'],['#reserva','d_reserva']]) { await d.evaluate(s=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,document.querySelector(s).getBoundingClientRect().top+window.scrollY-80)},id); await d.waitForTimeout(600); await d.screenshot({path:`${OUT}/${name}.png`}); }
await d.evaluate(()=>window.scrollTo(0,0)); await d.waitForTimeout(500); await d.screenshot({path:`${OUT}/d_full.png`,fullPage:true});
await browser.close();
