import fs from 'node:fs';
const rep = (s, x, y) => { if (!s.includes(x)) throw new Error('missing: ' + x.slice(0, 90)); return s.replace(x, () => y) };

let a = fs.readFileSync('app.js', 'utf8');

// overview: hero (title, art, jump chips, stats) becomes one dark band
a = rep(a, '    <div class="ovhero">', '    <div class="band hero-band">\n    <div class="ovhero">');
a = rep(a, '    <section id="styles">', '    </div>\n\n    <section id="styles">');

// style pages: start bar, title, tags and origin note become the dark hero band
a = rep(a, '    return `\n    <div class="startbar">', '    return `\n    <div class="band hero-band">\n    <div class="startbar">');
a = rep(a, "    ${s.origin ? `<div class=\"note\"><b>Where it came from.</b> ${md(s.origin)}</div>` : ''}", "    ${s.origin ? `<div class=\"note\"><b>Where it came from.</b> ${md(s.origin)}</div>` : ''}\n    </div>");
a = rep(a, "${s.session ? `<p class=\"note\"><b>Built in:</b> ${esc(s.session)}</p>` : ''}", "${s.session ? `<section><p class=\"note\" style=\"margin:0\"><b>Built in:</b> ${esc(s.session)}</p></section>` : ''}");

// list pages: title block is a dark band, the table sits in a section below
a = rep(a, '`<div class="eyebrow">Skills</div>', '`<div class="band hero-band"><div class="eyebrow">Skills</div>');
a = rep(a, '</p>${skillTable(false)}`', '</p></div><section>${skillTable(false)}</section>`');
a = rep(a, '`<div class="eyebrow">Connectors and tools</div>', '`<div class="band hero-band"><div class="eyebrow">Connectors and tools</div>');
a = rep(a, '</p>${connTable(false)}`', '</p></div><section>${connTable(false)}</section>`');
a = rep(a, '`<div class="eyebrow">Repos</div>', '`<div class="band hero-band"><div class="eyebrow">Repos</div>');
a = rep(a, '</p>${repoTable()}`,\n  };', '</p></div><section>${repoTable()}</section>`,\n  };');

// route: the page uses full-width bands
a = rep(a, "    renderNav(h);", "    renderNav(h);\n    app.classList.add('wide');");
fs.writeFileSync('app.js', a);

let c = fs.readFileSync('style.css', 'utf8');
c += `
/* ---- full-width bands: dark hero, then alternating section backgrounds ---- */
:root{--band-b:#EEE8DB;--hero-bg:#14110F;--hero-fg:#F6F3EC;--hero-muted:#B9B1A5;--hero-line:rgba(255,255,255,.16);--hero-accent:#FF6A3D}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--band-b:#1C1814;--hero-bg:#0C0A08}}
:root[data-theme="dark"]{--band-b:#1C1814;--hero-bg:#0C0A08}
main.wide{max-width:none;padding:0}
main.wide>section,main.wide>.band{margin:0;padding:56px max(clamp(16px,4vw,40px),calc((100% - 1180px)/2))}
main.wide>section:nth-of-type(even){background:var(--band-b)}
main.wide>section{border-top:1px solid var(--line)}
main.wide>.hero-band{background:var(--hero-bg);color:var(--hero-fg);padding-top:44px;padding-bottom:60px;border:0}
.hero-band h1{color:var(--hero-fg)}
.hero-band h1 i,.hero-band h2 i{color:var(--hero-accent)}
.hero-band .eyebrow,.hero-band .lede,.hero-band .aka{color:var(--hero-muted)}
.hero-band .aka b{color:var(--hero-fg)}
.hero-band .stat{background:rgba(255,255,255,.06);border-color:var(--hero-line)}
.hero-band .stat b{color:#fff}
.hero-band .stat span{color:var(--hero-muted)}
.hero-band .jump a{background:rgba(255,255,255,.06);border-color:var(--hero-line);color:var(--hero-muted)}
.hero-band .jump a:hover{color:#fff;border-color:#fff}
.hero-band .tag{background:rgba(255,255,255,.1);color:var(--hero-muted)}
.hero-band .tag.accent{background:var(--accent);color:#fff}
.hero-band .startbar{background:#26211C;color:#F6F3EC;border:1px solid var(--hero-line)}
.hero-band .say code{background:#F6F3EC;color:#14110F}
.hero-band button,.hero-band .btn{background:transparent;color:#F6F3EC;border-color:rgba(255,255,255,.32)}
.hero-band button:hover,.hero-band .btn:hover{border-color:#fff}
.hero-band .startbar button.go{background:var(--accent);border-color:var(--accent);color:#fff}
.hero-band .note{background:rgba(255,255,255,.07);color:var(--hero-muted)}
.hero-band .note b{color:var(--hero-fg)}
.hero-band code{background:rgba(255,255,255,.12);color:#F6F3EC}
.hero-band .say code{background:#F6F3EC;color:#14110F}
@media(max-width:720px){main.wide>section,main.wide>.band{padding-top:40px;padding-bottom:40px}}
`;
fs.writeFileSync('style.css', c);

// hosted copy only: the page body has side padding, so let the bands bleed to the screen edges
let b = fs.readFileSync('build-online.mjs', 'utf8');
b = rep(b, '.foot{padding-left:0;padding-right:0}', '.foot{padding-left:0;padding-right:0}\nmain.wide{margin-left:calc(-1 * max(16px, env(safe-area-inset-left, 0px)));margin-right:calc(-1 * max(16px, env(safe-area-inset-right, 0px)))}');
fs.writeFileSync('build-online.mjs', b);
console.log('bands added');
