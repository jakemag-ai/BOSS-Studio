import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const only = process.argv.slice(2);
const SC = [['broll-open',0,3.2],['avatars',3.2,6.8],['assistants',6.8,8.4],['editors',8.4,9.6],['web',9.6,10.7],['research',10.7,12.4],['competitive',12.4,13.9],['marketing',13.9,15.7],['exponential',15.7,21.1],['search',21.1,25.0],['email',25.0,29.7],['three',29.7,33.3],['superpowers',33.3,35.3],['agentic',35.3,40.5],['brain',40.5,45.0],['broll-output',45.0,48.8],['one-job',48.8,52.4],['tiles',52.4,57.3],['setup',57.3,62.4],['broll-nocode',62.4,65.5],['team',65.5,71.1],['eliminate',71.1,76.6],['broll-value',76.6,80.6],['timer',80.6,85.0],['build',85.0,88.0],['end',88.0,97.4]];
const url = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl: url, id: 'FbReel'});
let n = 0;
for (const [id, from, to] of SC) {
  n++;
  if (only.length && !only.includes(id)) continue;
  const t = id === 'end' ? 96.4 : to - 0.05;
  await renderStill({composition: comp, serveUrl: url, frame: Math.round(t * 30), output: `../outbox/fb-reel-recreate/stills/${String(n).padStart(2, '0')}-${id}.png`});
  console.log('done', id);
}
