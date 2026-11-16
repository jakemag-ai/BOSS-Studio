import fs from 'node:fs';
const rep = (s, x, y) => { if (!s.includes(x)) throw new Error('missing: ' + x.slice(0, 80)); return s.replace(x, () => y) };

let a = fs.readFileSync('app.js', 'utf8');
a = rep(a, 'function gallery(shots, wide) {', 'function gallery(shots, wide, xl) {');
a = rep(a, "return `<div class=\"gallery ${wide ? 'wide' : ''}\">${shots", "return `<div class=\"gallery ${wide ? 'wide' : ''} ${xl ? 'xl' : ''}\">${shots");
// a style is "horizontal" when a sample is flagged wide, or it sets wideShots itself
a = rep(a, '${gallery(s.shots, s.wideShots)}', "${gallery(s.shots, s.wideShots, s.wideShots || (s.samples || []).some((v) => v.wide))}");
fs.writeFileSync('app.js', a);

let c = fs.readFileSync('style.css', 'utf8');
c += [
  '',
  '/* horizontal styles: big screenshots */',
  '.gallery.xl{grid-template-columns:repeat(auto-fill,minmax(min(100%,380px),1fr));gap:18px}',
  '',
].join('\n');
fs.writeFileSync('style.css', c);
console.log('big shots set');
