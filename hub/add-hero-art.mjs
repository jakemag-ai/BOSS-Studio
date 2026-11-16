import fs from 'node:fs';
const rep = (s, x, y) => { if (!s.includes(x)) throw new Error('missing: ' + x.slice(0, 90)); return s.replace(x, () => y) };
let a = fs.readFileSync('app.js', 'utf8');
const snippet = fs.readFileSync('hero-art.snippet.js', 'utf8');
a = rep(a, '  // ---------- navigation ----------', snippet + '  // ---------- navigation ----------');
a = rep(a, "<div>${s.cover ? `<img src=\"${s.cover}\" alt=\"\" style=\"width:100%;border-radius:22px;box-shadow:var(--shadow);max-height:420px;object-fit:cover\">` : ''}</div>", '<div>${heroArt(s)}</div>');
fs.writeFileSync('app.js', a);

let c = fs.readFileSync('style.css', 'utf8');
c += '\n/* hero illustrations */\n.hero-art{display:block;width:100%;height:auto;max-height:420px}\n@media(max-width:860px){.hero-art{max-height:none}}\n';
fs.writeFileSync('style.css', c);
console.log('hero art added');
