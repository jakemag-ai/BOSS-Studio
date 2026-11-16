import fs from 'node:fs';
const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8');
  for (const [x, y] of pairs) { if (!s.includes(x)) throw new Error(file + ' missing: ' + x.slice(0, 80)); s = s.split(x).join(y) }
  fs.writeFileSync(file, s);
};
edit('data.js', [
  ["connector we set up on Nov 11, 2026: the BOSS motion-graphics styles", "connector we set up: the BOSS motion-graphics styles"],
  ["learn about you\" post on 2026-11-12. It reuses", "learn about you\" post. It reuses"],
  ["with every composition built today.", "with every composition built."],
  ["Facts come from the files in this project and from today's (2026-11-11) Claude sessions.", "Facts come from the files in this project and from the Claude sessions."],
]);
edit('app.js', [
  ["Finished files and drafts from today. Full-size", "Finished files and drafts. Full-size"],
  ["${s.used ? 'used today' : 'available'}", "${s.used ? 'used' : 'available'}"],
  ["\"Used today\" means a session actually used it.", "\"Used\" means a session actually used it."],
  ["what it did today, and how it is set up", "what it did, and how it is set up"],
]);
console.log('dates removed');
