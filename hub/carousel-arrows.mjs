import fs from 'node:fs';
let a = fs.readFileSync('app.js', 'utf8');
const rep = (s, x, y) => { if (!s.includes(x)) throw new Error('missing: ' + x.slice(0, 80)); return s.replace(x, () => y) };

// markup: arrows sit on the left and right of the row; the counter stays on top
a = rep(a,
  "return '<div class=\"carousel\"><div class=\"car-nav\"><span class=\"car-count\" aria-live=\"polite\"></span><button type=\"button\" data-dir=\"-1\" aria-label=\"Previous videos\">←</button><button type=\"button\" data-dir=\"1\" aria-label=\"Next videos\">→</button></div><div class=\"track\"",
  "return '<div class=\"carousel\"><div class=\"car-nav\"><span class=\"car-count\" aria-live=\"polite\"></span></div><button type=\"button\" class=\"car-arrow prev\" data-dir=\"-1\" aria-label=\"Previous videos\">←</button><button type=\"button\" class=\"car-arrow next\" data-dir=\"1\" aria-label=\"Next videos\">→</button><div class=\"track\"");

// state helper
a = rep(a, "const nav = track.parentElement.querySelector('.car-nav');\n    if (!nav) return;", "const nav = track.parentElement;");
// click handler
a = rep(a, "e.target.closest('.car-nav [data-dir]')", "e.target.closest('.carousel [data-dir]')");
fs.writeFileSync('app.js', a);

let c = fs.readFileSync('style.css', 'utf8');
c += [
  '',
  '/* carousel arrows: large, orange, on the left and right of the row */',
  '.carousel{position:relative;padding:0 26px}',
  '.car-nav{padding-right:0}',
  '.car-arrow{position:absolute;top:calc(50% - 30px);z-index:3;width:56px;height:56px;padding:0;border-radius:50%;border:3px solid var(--bg);background:var(--accent);color:#fff;font:800 1.7rem/1 var(--sans);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 24px rgba(220,46,10,.4);transition:transform .15s ease,background .15s ease}',
  '.car-arrow.prev{left:0}',
  '.car-arrow.next{right:0}',
  '.car-arrow:hover{background:#B82405;border-color:var(--bg);transform:scale(1.08)}',
  '.car-arrow:focus-visible{outline:3px solid var(--ink);outline-offset:3px}',
  '.car-arrow:disabled{opacity:.3;cursor:default;box-shadow:none;transform:none}',
  '.car-arrow:disabled:hover{background:var(--accent);border-color:var(--bg)}',
  '@media(max-width:720px){.carousel{padding:0 16px}.car-arrow{width:46px;height:46px;font-size:1.4rem}}',
  '',
].join('\n');
fs.writeFileSync('style.css', c);
console.log('arrows moved');
