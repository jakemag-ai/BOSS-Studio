import fs from 'node:fs';
let a = fs.readFileSync('app.js', 'utf8');
const start = a.indexOf('<div class="studio"><svg class="studio-art"');
const end = a.indexOf('</svg></div>', start);
if (start < 0 || end < 0) throw new Error('studio svg not found');
const img = '<div class="studio"><img class="studio-art" src="assets/img/studio-hero.gif" width="780" height="600" alt="Animated illustration of an editing studio: a playhead sweeps a timeline while the waveform ripples under a preview monitor">';
a = a.slice(0, start) + img + '</div>' + a.slice(end + '</svg></div>'.length);
fs.writeFileSync('app.js', a);

let c = fs.readFileSync('style.css', 'utf8');
c += '\n/* animated studio GIF in the home hero */\n.studio{display:flex;justify-content:center}\n.studio img.studio-art{display:block;width:auto;max-width:100%;height:auto;max-height:340px;border-radius:26px}\n@media(max-width:860px){.studio img.studio-art{width:100%;max-height:none}}\n';
fs.writeFileSync('style.css', c);
console.log('gif applied');
