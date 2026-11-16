import fs from 'node:fs';
const rep = (s, x, y) => { if (!s.includes(x)) throw new Error('missing: ' + x.slice(0, 80)); return s.replace(x, () => y) };

// 1) mark the horizontal (16:9) sample
let d = fs.readFileSync('data.js', 'utf8');
d = rep(d, "src: VID('clean-explainer-why-reviews'), at: 12,", "src: VID('clean-explainer-why-reviews'), at: 12, wide: true,");
fs.writeFileSync('data.js', d);

// 2) carousel cards respect the wide flag
let a = fs.readFileSync('app.js', 'utf8');
a = rep(a, "'<figure class=\"vid\" style=\"margin:0\"><video controls preload=\"metadata\" playsinline src=\"' + v.src + '#t=' + (v.at || 3) + '\"></video><p><a href=\"#style-'",
  "'<figure class=\"vid' + (v.wide ? ' wide' : '') + '\" style=\"margin:0\"><video controls preload=\"metadata\" playsinline src=\"' + v.src + '#t=' + (v.at || 3) + '\"></video><p><a href=\"#style-'");
fs.writeFileSync('app.js', a);

// 3) styles: wide videos take the whole row on a style page, and a larger card in the carousel
let c = fs.readFileSync('style.css', 'utf8');
c += [
  '',
  '/* horizontal videos: full-width row on style pages, bigger card in the carousel */',
  '.videos .vid.wide{flex:1 1 100%;max-width:100%}',
  '.videos .vid.wide video{width:100%}',
  '.track .vid.wide{flex:0 0 min(640px,86%)}',
  '',
].join('\n');
fs.writeFileSync('style.css', c);
console.log('wide videos set');
