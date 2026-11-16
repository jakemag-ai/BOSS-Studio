import fs from 'node:fs';
let s = fs.readFileSync('app.js', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing: ' + a.slice(0, 60)); s = s.replace(a, () => b) };

rep("[['styles', 'Styles'], ['library', 'Style files']", "[['styles', 'Styles'], ['samples', 'Samples'], ['library', 'Style files']");

rep('    <section id="library">', [
  '    <section id="samples">',
  '      <div class="eyebrow">Samples</div><h2>Every <i>output</i> in one place</h2>',
  '      <p class="lede">All the finished videos and drafts from the individual style pages. Click a style name to open its page.</p>',
  '      ${allSamples()}',
  '    </section>',
  '',
  '    <section id="library">',
].join('\n'));

rep('  function skillTable(short) {', [
  '  function allSamples() {',
  '    const all = D.styles.flatMap((s) => (s.samples || []).map((v) => ({v, s})));',
  "    if (!all.length) return '<p class=\"empty\">No samples yet.</p>';",
  "    return '<div class=\"videos\">' + all.map(({v, s}) => '<figure class=\"vid\" style=\"margin:0\"><video controls preload=\"metadata\" playsinline src=\"' + v.src + '#t=' + (v.at || 3) + '\"></video><p><a href=\"#style-' + s.id + '\"><b>' + esc(s.short || s.name) + '</b></a> · ' + esc(v.title) + (v.note ? ' · ' + md(v.note) : '') + '</p></figure>').join('') + '</div>';",
  '  }',
  '',
  '  function skillTable(short) {',
].join('\n'));
fs.writeFileSync('app.js', s);
console.log('app.js updated');
