import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const vo = require('../src/promo/vo.json');
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const toks = vo.words.map((w) => norm(w.text));
const at = (p) => { const q = p.split(' ').map(norm); for (let i = 0; i + q.length <= toks.length; i++) if (q.every((x, k) => toks[i + k] === x)) return vo.words[i].start; throw new Error(p); };
const tour = at('lets take a quick tour'), nw = at('start a project'), s1 = at('step one'), s2 = at('step two'), s3 = at('step three'), s4 = at('step four'), cl = at('thats it');
console.log({tour, nw, s1, s2, s3, s4, cl});
const list = process.argv.slice(2);
const SHOTS = {
  '01-hook': 6.2, '02-title': 11.2, '03-record': 16.8, '04-never-busy': 21.2, '05a-cleanup-marked': 26.0, '05b-cleanup-clean': 28.4,
  '06-styles': 33.6, '07-adds': 39.8, '08-formats': 44.4, '09-slate-you-stay-the-boss': 47.0,
  '10-tour-projects': tour + 3.0, '11a-new-name': nw + 3.2, '11b-new-style': at('then pick a style') + 1.0, '11c-new-two-ways': at('or press magic') + 1.6,
  '12a-script-read': s1 + 5.5, '12b-script-tools': at('or press suggest') + 2.0, '12c-script-preview': at('press preview edits') + 2.4,
  '13a-instructions-type': at('for example') + 2.6, '13b-instructions-ticks': at('add soft music') + 0.8, '13c-instructions-reference': at('you can even paste') + 1.6,
  '14a-editing-working': at('a progress bar') + 0.6, '14b-editing-draft': at('watch the draft') + 1.0, '14c-editing-frames': at('and the frames') + 1.0,
  '14d-snapshot-draw': at('circle it') + 1.4, '14e-snapshot-note': at('each note sticks') + 0.6, '14f-render-draft': at('when you have your notes') + 1.2,
  '15a-gallery': at('open any of them') + 1.0, '15b-final': at('render final version') + 0.8,
  '16a-close-steps': cl + 3.4, '16b-close-need': at('you just need') + 1.2, '16c-close-final': at('start creating') + 1.2,
};
const pick = list.length ? Object.fromEntries(Object.entries(SHOTS).filter(([k]) => list.some((l) => k.startsWith(l)))) : SHOTS;
const out = process.env.OUT;
const serveUrl = await bundle({entryPoint: 'src/index.ts', publicDir: 'public'});
const comp = await selectComposition({serveUrl, id: 'BossPromo', browserExecutable: 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
for (const [name, t] of Object.entries(pick)) {
  await renderStill({composition: comp, serveUrl, output: `${out}/${name}.png`, frame: Math.round(t * 30), browserExecutable: 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  console.log('ok', name, t.toFixed(1));
}
