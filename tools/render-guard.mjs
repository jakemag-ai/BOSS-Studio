#!/usr/bin/env node
// Render guard: only ONE render per project at a time.
//
// Why it exists: a long HyperFrames render (HDR footage, lots of B-roll) can take 30+ minutes and prints
// nothing for a long time. A foreground command that hits the tool's time limit does NOT stop the render,
// so BOSS thought it had died and started the same render again. Two (then three) renders fought over the
// same CPU and the same output file, and every one of them got slower.
//
//   Start a render (run it in the background):
//     node tools/render-guard.mjs kit/video-projects/<id> -- npx hyperframes render -o renders/draft-v1.mp4 -q draft --crf 24
//   Ask how it is going (safe to repeat; never starts anything):
//     node tools/render-guard.mjs kit/video-projects/<id> --status
//   Only if you are SURE nothing is rendering (a leftover lock):
//     node tools/render-guard.mjs kit/video-projects/<id> --unlock
//
// Exit codes: 0 render finished OK, 3 a render is already running (nothing was started), other = the render's own code.
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, statSync, createWriteStream } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const dir = args[0] && !args[0].startsWith('-') ? resolve(args[0]) : null;
if (!dir) { console.error('Usage: node tools/render-guard.mjs <project-dir> (--status | --unlock | -- <render command...>)'); process.exit(2); }
const renders = join(dir, 'renders'), LOCK = join(renders, '.render.lock'), LOG = join(renders, 'render.log');
const STALE_MS = 3 * 60 * 60 * 1000; // a lock older than this is ignored even if a pid number has been reused

const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
const readLock = () => { try { return JSON.parse(readFileSync(LOCK, 'utf8')); } catch { return null; } };
// alive while the guard OR anything it started is still going (the guard itself can be killed by a tool time-out)
const pidsOf = (l) => [l.pid, l.childPid, ...(l.pids || [])].filter(Boolean);
const running = () => { const l = readLock(); return l && Date.now() - l.started < STALE_MS && pidsOf(l).some(alive) ? l : null; };
const mins = (ms) => (ms / 60000).toFixed(1);
const tail = (file, n = 4) => { try { return readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).slice(-n).join('\n'); } catch { return ''; } };

// every process below `root`: the shell wrapper dies early, the real renderer is a grandchild
function descendants(root) {
  let rows = '';
  try {
    rows = process.platform === 'win32'
      ? execFileSync('powershell', ['-NoProfile', '-Command', 'Get-CimInstance Win32_Process | ForEach-Object { "$($_.ProcessId) $($_.ParentProcessId)" }'], { encoding: 'utf8', windowsHide: true, timeout: 15000 })
      : execFileSync('ps', ['-A', '-o', 'pid=,ppid='], { encoding: 'utf8', timeout: 15000 });
  } catch { return []; }
  const kids = new Map();
  for (const line of rows.split(/\r?\n/)) { const [p, pp] = line.trim().split(/\s+/).map(Number); if (p && pp) (kids.get(pp) || kids.set(pp, []).get(pp)).push(p); }
  const out = [], q = [root];
  while (q.length) { const x = q.pop(); for (const k of kids.get(x) || []) if (!out.includes(k)) { out.push(k); q.push(k); } }
  return out;
}

if (args.includes('--unlock')) { rmSync(LOCK, { force: true }); console.log('Lock removed. A new render can start now.'); process.exit(0); }

if (args.includes('--status')) {
  const l = running();
  if (!l) { console.log('No render is running for this project.' + (existsSync(LOG) ? '\nLast log lines:\n' + tail(LOG) : '')); process.exit(0); }
  const logAge = existsSync(LOG) ? mins(Date.now() - statSync(LOG).mtimeMs) : 'n/a';
  console.log(`A render IS running: started ${mins(Date.now() - l.started)} min ago.\nCommand: ${l.cmd}\nLog last changed ${logAge} min ago.\n${tail(LOG) ? 'Last log lines:\n' + tail(LOG) : '(no log output yet, which is normal for a long render)'}`);
  console.log('\nDo NOT start another render. A heavy render can take 30-60+ minutes; silence is normal. Check again in a few minutes.');
  process.exit(0);
}

const sep = args.indexOf('--');
const cmd = sep >= 0 ? args.slice(sep + 1) : [];
if (!cmd.length) { console.error('Nothing to run. Put the render command after --'); process.exit(2); }

const l = running();
if (l) {
  console.error(`A render for this project is ALREADY RUNNING (started ${mins(Date.now() - l.started)} min ago).\nNothing was started. Do NOT launch another one: wait for it, then check with:\n  node tools/render-guard.mjs ${args[0]} --status`);
  process.exit(3);
}

mkdirSync(renders, { recursive: true });
const lockData = { pid: process.pid, started: Date.now(), cmd: cmd.join(' ') };
const writeLock = () => writeFileSync(LOCK, JSON.stringify(lockData));
const release = () => { const cur = readLock(); if (cur && cur.pid === process.pid) rmSync(LOCK, { force: true }); };
writeLock();
const log = createWriteStream(LOG, { flags: 'w' });
// one quoted command line (an unquoted args array breaks on spaces and brackets when a shell is used)
const quote = (a) => (/[\s"&|<>()^%!;'`$]/.test(a) ? '"' + a.replace(/"/g, '\\"') + '"' : a);
const child = spawn(cmd.map(quote).join(' '), { cwd: dir, shell: true, windowsHide: true });
lockData.childPid = child.pid; writeLock();
const track = () => { lockData.pids = descendants(child.pid); writeLock(); };
const first = setTimeout(track, 1500); const tick = setInterval(track, 8000); // remember the real renderer's pids
child.stdout.on('data', (d) => { process.stdout.write(d); log.write(d); });
child.stderr.on('data', (d) => { process.stderr.write(d); log.write(d); });
const done = (code, msg) => { clearTimeout(first); clearInterval(tick); log.end(`\n[${msg}]\n`); release(); process.exit(code); };
child.on('close', (code) => done(code ?? 1, `render finished with code ${code}`));
child.on('error', (e) => done(1, `render could not start: ${e.message}`));
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => { try { process.platform === 'win32' ? spawn('taskkill', ['/T', '/F', '/PID', String(child.pid)]) : child.kill(); } catch {} done(1, `stopped by ${s}`); });
process.on('exit', release);
