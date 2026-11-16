import fs from 'node:fs';
let a = fs.readFileSync('app.js', 'utf8');
const rep = (s, x, y) => { if (!s.includes(x)) throw new Error('missing: ' + x.slice(0, 70)); return s.replace(x, () => y) };

// 1) markup: the samples become a snap-scrolling carousel with prev / next buttons
const start = a.indexOf('  function allSamples() {');
const end = a.indexOf('  function skillTable(short) {');
if (start < 0 || end < 0) throw new Error('allSamples not found');
const fn = [
  '  function allSamples() {',
  '    const all = D.styles.flatMap((s) => (s.samples || []).map((v) => ({v, s})));',
  "    if (!all.length) return '<p class=\"empty\">No samples yet.</p>';",
  "    const cards = all.map(({v, s}) => '<figure class=\"vid\" style=\"margin:0\"><video controls preload=\"metadata\" playsinline src=\"' + v.src + '#t=' + (v.at || 3) + '\"></video><p><a href=\"#style-' + s.id + '\"><b>' + esc(s.short || s.name) + '</b></a> · ' + esc(v.title) + (v.note ? ' · ' + md(v.note) : '') + '</p></figure>').join('');",
  "    return '<div class=\"carousel\"><div class=\"car-nav\"><span class=\"car-count\" aria-live=\"polite\"></span><button type=\"button\" data-dir=\"-1\" aria-label=\"Previous videos\">←</button><button type=\"button\" data-dir=\"1\" aria-label=\"Next videos\">→</button></div><div class=\"track\" tabindex=\"0\" role=\"region\" aria-label=\"Sample videos, scroll sideways\">' + cards + '</div></div>';",
  '  }',
  '',
  '  function carState(track) {',
  "    const nav = track.parentElement.querySelector('.car-nav');",
  '    if (!nav) return;',
  '    const cards = [...track.children];',
  '    const step = cards[0] ? cards[0].offsetWidth + 20 : 1;',
  '    const max = track.scrollWidth - track.clientWidth - 2;',
  "    nav.querySelector('[data-dir=\"-1\"]').disabled = track.scrollLeft <= 2;",
  "    nav.querySelector('[data-dir=\"1\"]').disabled = track.scrollLeft >= max;",
  "    nav.querySelector('.car-count').textContent = Math.min(cards.length, Math.round(track.scrollLeft / step) + 1) + ' / ' + cards.length;",
  '  }',
  '',
].join('\n');
a = a.slice(0, start) + fn + a.slice(end);

// 2) behaviour: buttons, state, one video at a time
a = rep(a, '  route();\n})();', [
  '  document.addEventListener(\'click\', (e) => {',
  "    const b = e.target.closest('.car-nav [data-dir]');",
  '    if (!b) return;',
  "    const track = b.closest('.carousel').querySelector('.track');",
  '    const card = track.children[0];',
  "    track.scrollBy({left: Number(b.dataset.dir) * (card ? card.offsetWidth + 20 : 300), behavior: 'smooth'});",
  '  });',
  "  document.addEventListener('scroll', (e) => { if (e.target.classList && e.target.classList.contains('track')) carState(e.target); }, true);",
  "  window.addEventListener('resize', () => document.querySelectorAll('.track').forEach(carState));",
  "  document.addEventListener('play', (e) => {",
  "    if (e.target.tagName === 'VIDEO' && e.target.closest('.track')) document.querySelectorAll('.track video').forEach((v) => { if (v !== e.target) v.pause(); });",
  '  }, true);',
  '  route();',
  "  document.querySelectorAll('.track').forEach(carState);",
  '})();',
].join('\n'));
a = rep(a, "    window.scrollTo({top: 0});", "    window.scrollTo({top: 0});\n    document.querySelectorAll('.track').forEach(carState);");
fs.writeFileSync('app.js', a);

// 3) styles
let c = fs.readFileSync('style.css', 'utf8');
c += [
  '',
  '/* samples carousel */',
  '.carousel{margin-top:18px}',
  '.car-nav{display:flex;justify-content:flex-end;align-items:center;gap:10px}',
  '.car-count{font:700 .78rem var(--mono);letter-spacing:.08em;color:var(--muted);margin-right:6px}',
  '.car-nav button{width:44px;height:44px;border-radius:50%;padding:0;font-size:1.2rem;line-height:1;display:inline-flex;align-items:center;justify-content:center}',
  '.car-nav button:disabled{opacity:.35;cursor:default}',
  '.car-nav button:disabled:hover{border-color:var(--line)}',
  '.track{display:flex;gap:20px;margin-top:14px;padding:4px 2px 16px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none}',
  '.track::-webkit-scrollbar{display:none}',
  '.track:focus-visible{outline:2px solid var(--accent);outline-offset:4px;border-radius:12px}',
  '.track .vid{flex:0 0 min(290px,78%);scroll-snap-align:start}',
  '@media(prefers-reduced-motion:reduce){.track{scroll-behavior:auto}}',
  '',
].join('\n');
fs.writeFileSync('style.css', c);
console.log('carousel added');
