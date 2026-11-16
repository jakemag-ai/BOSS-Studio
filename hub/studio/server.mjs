// Local server for the Editing Studio: serves the hub, keeps projects as folders, and runs Claude in them.
//   node hub/studio/server.mjs        (or double-click hub/open-studio.bat)
// Only answers to localhost, and its API only to requests that carry the x-studio header
// (a page on another website can't add it), so other sites can't drive it.
import http from 'node:http';
import { spawn } from 'node:child_process';
import { cpSync, createReadStream, createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PROJECTS = join(ROOT, 'projects');
const PORT = +process.env.PORT || 4630;
const SHOW = ['hub', 'my-style-presets', 'projects']; // the only folders served as files
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
mkdirSync(PROJECTS, { recursive: true });

const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'project';
const safeName = (s) => basename(String(s || 'file')).replace(/[\\/:*?"<>|]/g, '_');
const pdir = (id) => join(PROJECTS, slug(id));
const PRESETS = join(ROOT, 'my-style-presets');
const pendingDir = (propSlug) => join(PRESETS, '_pending', safeName(propSlug));
const readProject = (id) => { try { return JSON.parse(readFileSync(join(pdir(id), 'project.json'), 'utf8')); } catch { return null; } };
const writeProject = (p) => writeFileSync(join(pdir(p.id), 'project.json'), JSON.stringify(p, null, 2));
const send = (res, code, obj) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };
const body = (req, max = 60e6) => new Promise((ok, no) => { let n = 0; const c = []; req.on('data', (d) => { n += d.length; if (n > max) { no(new Error('too big')); req.destroy(); } else c.push(d); }); req.on('end', () => ok(Buffer.concat(c).toString('utf8'))); req.on('error', no); });

// ---- running Claude in the workspace
function trashProject(id) { // move a deleted project's folder to projects/.trash; if it is locked right now, try again later
  try { mkdirSync(join(PROJECTS, '.trash'), { recursive: true }); renameSync(pdir(id), join(PROJECTS, '.trash', id + '-' + Date.now())); return true; } catch { return false; }
}
const runs = new Map(); // project id -> { running, text, tool, error, code, child }
function findClaude() {
  const dirs = [...(process.env.PATH || '').split(';'), join(homedir(), '.local', 'bin')];
  for (const d of dirs) for (const n of ['claude.exe', 'claude.cmd']) if (d && existsSync(join(d, n))) return join(d, n);
  return null;
}
const PREFACE = (id) => {
  const p = readProject(id) || {};
  const f = p.format && p.format.w && p.format.h ? p.format : { label: 'TikTok', ratio: '9:16', w: 1080, h: 1920 };
  const draftW = Math.round(f.w * 0.9), draftH = Math.round(f.h * 0.9);
  const formatLine = `Target format: ${f.label || 'default'} (${f.ratio || ''}, ${f.w}x${f.h}). If a style's own guide assumes a different aspect ratio, adapt its captions, graphics placement and composition to this canvas while keeping its visual identity (colours, fonts, transitions, pacing) intact.`;
  return `You are working inside the bossstudio workspace for the video project "${id}". Follow .agents/skills/bossstudio/SKILL.md and my-rules.md.
Project folder: projects/${id}/
- raw/ holds the raw video. Do not modify it.
- cut/edited.mp4, when it exists, is the raw video with the words I removed in the Script step already cut out (its word timings: cut/source.mistakes-transcript.json). Edit from it instead of the raw video, and do not remove other words unless I ask.
- cut/voiceover-edited.m4a, when it exists, is my voiceover with the words I removed in the Script step already cut out (its word timings: cut/vo.mistakes-transcript.json). Use it as the audio track instead of the voiceover in voiceover/.
- frames/: write still image frames here as JPEG, about 540 px wide, named frame-001_t03.5.jpg (frame number, then _t, then the time in seconds). Replace the old frames when you update them.
- drafts/: write rendered draft videos here (only after I approve the frames).
- voiceover/: an existing voiceover audio file, or where you save one you generate with the ElevenLabs MCP from a script I paste. If I ask you to generate one and the ElevenLabs connector is not connected, stop and tell me to connect it first, with no other changes.
- reference/ holds a video whose editing style I want copied (uploaded, or downloaded from my link with yt-dlp).
- broll/ holds extra footage clips my notes ask you to cut in at a specific point or over a specific range.
- revisions/ holds my annotated snapshots. Look at each image file named in my notes.
Never overwrite or delete anything in drafts/. Save every new render as draft-v<N>.mp4, where N is one more than the highest number already there, so older versions stay in the gallery. Final renders are named final-<project>.mp4.
${formatLine}
Always render drafts at low resolution (about ${draftW}x${draftH}, scale 0.9, crf 24) so they are fast. Render full resolution (${f.w}x${f.h}) only when I press Render final.
How to edit: use the bossstudio pipeline in this repo, not Remotion and not a custom renderer. This beats any "Built with: Remotion" line in a style guide.
- Work in kit/video-projects/${id}/ (create it from kit/ with npm run new-video -- ${id} if it does not exist). Read kit/AGENTS.md and follow the kit skill short-form-edit (or edit-video for long horizontal videos).
- Transcripts: use projects/${id}/transcript.json (or cut/source.mistakes-transcript.json for the cut video) when it exists. Otherwise run node tools/transcribe.mjs <video>, which uses Groq in the cloud. Never use --local or a local Whisper model.
- Cuts: the kit's cut-silences and cut-mistakes scripts.
- Motion graphics and rendering: HyperFrames (the kit's hyperframes, hyperframes-video-beats and hyperframes-cli skills; render with npx hyperframes render from kit/). Take the look (colours, fonts, timing, layouts) from the style guide; the Remotion code in remotion/src/ is only a visual reference.
- Frames for review: hyperframes snapshot, saved to frames/ as above.
Reply briefly when done.\n\n`;
};
function startRun(id, prompt) {
  const exe = findClaude();
  const st = { running: true, text: '', tool: '', error: '', code: null, startedAt: Date.now() };
  runs.set(id, st);
  if (!exe) { st.running = false; st.error = "Can't find Claude Code. Install it and sign in first."; return st; }
  const p = readProject(id) || {};
  const args = ['-p', '--output-format', 'stream-json', '--verbose', '--model', 'claude-opus-5-5', '--effort', 'medium', '--permission-mode', 'acceptEdits', '--allowedTools', 'Bash,PowerShell,Read,Write,Edit,Glob,Grep,Skill,mcp__ElevenLabs__text_to_speech,mcp__ElevenLabs__search_voices,mcp__ElevenLabs__text_to_voice'];
  if (p.session) args.push('--resume', p.session);
  const child = spawn(exe, args, { cwd: ROOT, windowsHide: true });
  st.child = child;
  let buf = '';
  child.stdout.on('data', (d) => {
    buf += d; const lines = buf.split('\n'); buf = lines.pop();
    for (const l of lines) {
      let e; try { e = JSON.parse(l); } catch { continue; }
      if (e.session_id) { const q = readProject(id); if (q && q.session !== e.session_id) { q.session = e.session_id; writeProject(q); } }
      if (e.type === 'assistant') for (const c of e.message?.content || []) { if (c.type === 'tool_use') st.tool = c.name; else if (c.type === 'text') st.text = c.text.slice(0, 400); }
      if (e.type === 'result' && e.is_error) st.error = String(e.result || 'Claude stopped with an error').slice(0, 400);
    }
  });
  let err = ''; child.stderr.on('data', (d) => (err = (err + d).slice(-800)));
  child.on('close', (code) => { st.running = false; st.code = code; st.finishedAt = Date.now(); if (code && !st.error) st.error = err.trim().split('\n').pop() || 'Claude stopped (code ' + code + ')'; });
  child.on('error', (e) => { st.running = false; st.error = e.message; });
  child.stdin.end(PREFACE(id) + prompt);
  return st;
}
// ---- Script step: word-level transcript, cut suggestions, and text cuts applied to the video (no Claude involved)
const MISTAKES = join(ROOT, 'kit', '.agents', 'skills', 'cut-mistakes', 'scripts');
const busy = new Set(); // project ids with a script job running
const node = (args) => proc(process.execPath, args);
function proc(exe, args) {
  return new Promise((ok) => {
    const c = spawn(exe, args, { cwd: ROOT, windowsHide: true });
    let out = '', err = '';
    c.stdout.on('data', (d) => (out += d)); c.stderr.on('data', (d) => (err = (err + d).slice(-1500)));
    c.on('close', (code) => ok({ code, out, err: err.trim().split('\n').pop() || 'failed (code ' + code + ')' }));
    c.on('error', (e) => ok({ code: 1, out, err: e.message }));
  });
}
// Two sources Script can work on: the raw footage / voiceover (step 2, before frames exist, j.target
// absent — this is the only one that can cut anything, and every cut lands in the next version), or —
// on the Editing page (step 4) — the rendered draft itself (j.target === 'draft'), read-only: it's
// transcribed so the words can be selected, but never cut here.
async function scriptJob(id, p, b, j) {
  const dir = pdir(id), draftMode = j.target === 'draft';
  let media, tr, sd, stem;
  if (draftMode) {
    const file = safeName(j.file || '');
    if (!file || !existsSync(join(dir, 'drafts', file))) return { status: 400, error: 'Pick a rendered version first' };
    stem = file.replace(/\.[^.]+$/, ''); // e.g. "draft-v2"
    media = join(dir, 'drafts', file);
    tr = join(dir, 'script', stem + '.json');
    sd = join(dir, 'script', stem);
  } else {
    const vo = p.voiceoverFile && existsSync(join(dir, 'voiceover', p.voiceoverFile));
    if (!p.rawName && !vo) return { status: 400, error: 'Attach the raw video first' };
    stem = vo ? 'vo' : 'source';
    media = vo ? join(dir, 'voiceover', p.voiceoverFile) : join(dir, 'raw', p.rawName || '');
    tr = join(dir, vo ? 'vo-transcript.json' : 'transcript.json');
    sd = join(dir, 'script');
  }
  if (!existsSync(media)) return { status: 400, error: draftMode ? 'Pick a rendered version first' : 'Attach the raw video first' };
  if (b === 'transcribe') {
    mkdirSync(dirname(tr), { recursive: true });
    const r = await node([join(ROOT, 'tools', 'transcribe.mjs'), media]);
    const made = media.replace(/\.[^.\\/]+$/, '.json'); // transcribe.mjs writes beside the media
    if (r.code !== 0 || !existsSync(made)) return { status: 500, error: 'Transcription failed: ' + r.err };
    renameSync(made, tr);
    return { words: JSON.parse(readFileSync(tr, 'utf8')).words };
  }
  if (!existsSync(tr)) return { status: 400, error: draftMode ? 'Open this version in the Script panel first' : 'Transcribe the video first' };
  mkdirSync(sd, { recursive: true });
  if (b === 'suggest') {
    const r = await node([join(MISTAKES, 'find-cut-candidates.mjs'), tr, '--out-dir', sd]);
    if (r.code !== 0) return { status: 500, error: 'Could not find suggestions: ' + r.err };
    return JSON.parse(readFileSync(join(sd, stem + '.cut-candidates.json'), 'utf8')); // the kit names outputs after the transcript file
  }
  if (draftMode) return { status: 400, error: 'The Editing page only points at words; it never cuts. Cut in the Script step instead, before frames exist.' };
  const cuts = (Array.isArray(j.cuts) ? j.cuts : []).filter((c) => Number.isFinite(c.start) && Number.isFinite(c.end) && c.end > c.start);
  if (!cuts.length) { rmSync(join(dir, 'cut'), { recursive: true, force: true }); return { cutFile: '' }; }
  writeFileSync(join(sd, 'cuts.json'), JSON.stringify({ cuts }, null, 2));
  const vo = stem === 'vo', cd = join(dir, 'cut'); mkdirSync(cd, { recursive: true });
  if (vo) { // audio only: re-time the words with apply-cuts, cut the audio with FFmpeg
    const t = await node([join(MISTAKES, 'apply-cuts.mjs'), tr, '--cuts', join(sd, 'cuts.json'), '--out-dir', cd]);
    if (t.code !== 0) return { status: 500, error: 'Could not cut the voiceover: ' + t.err };
    const keep = 'not(' + cuts.map((c) => `between(t,${c.start},${c.end})`).join('+') + ')';
    const r = await proc('ffmpeg', ['-y', '-loglevel', 'error', '-i', media, '-af', `aselect='${keep}',asetpts=N/SR/TB`, '-c:a', 'aac', '-b:a', '192k', join(cd, 'voiceover-edited.m4a')]);
    if (r.code !== 0) return { status: 500, error: 'Could not cut the voiceover: ' + r.err };
    return { cutFile: 'cut/voiceover-edited.m4a' };
  }
  const out = join(cd, 'edited.mp4');
  const r = await node([join(MISTAKES, 'apply-cuts.mjs'), tr, '--cuts', join(sd, 'cuts.json'), '--video', media, '--output', out, '--out-dir', cd, '--apply']);
  if (r.code !== 0 || !existsSync(out)) return { status: 500, error: 'Could not cut the video: ' + r.err };
  return { cutFile: 'cut/edited.mp4' };
}
// Project card picture, as a path inside the project folder (or '' to fall back to the style cover).
// A voiceover project is faceless, so its raw video is only B-roll: show a rendered frame once BOSS has made some.
// Otherwise (or before frames exist) show a still from the raw video, made once with FFmpeg and kept as thumb.jpg.
async function thumbOf(q) {
  const dir = pdir(q.id);
  if (q.voiceoverFile) {
    let f; try { f = readdirSync(join(dir, 'frames')).filter((x) => /\.(jpe?g|png)$/i.test(x)).sort()[0]; } catch {}
    if (f) return 'frames/' + encodeURIComponent(f) + '?v=' + statSync(join(dir, 'frames', f)).mtimeMs;
  }
  const raw = join(dir, 'raw', q.rawName || ''), t = join(dir, 'thumb.jpg');
  if (!q.rawName || !existsSync(raw)) return '';
  if (!existsSync(t) || statSync(t).mtimeMs < statSync(raw).mtimeMs) {
    rmSync(t, { force: true });
    for (const ss of ['1', '0']) { await proc('ffmpeg', ['-y', '-loglevel', 'error', '-ss', ss, '-i', raw, '-frames:v', '1', '-vf', 'scale=480:-2', '-q:v', '4', t]); if (existsSync(t)) break; } // -ss 0 for clips under a second
  }
  return existsSync(t) ? 'thumb.jpg?v=' + statSync(t).mtimeMs : '';
}
const dataUrl = (u) => { const m = /^data:image\/(jpeg|png);base64,(.+)$/.exec(u || ''); return m ? { buf: Buffer.from(m[2], 'base64'), ext: m[1] === 'png' ? 'png' : 'jpg' } : null; };

// ---- API
async function api(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean).slice(1); // after /api
  const [a, id, b] = parts;
  if (a === 'ping') return send(res, 200, { ok: true });
  if (a === 'style-proposals') {
    const dir = pendingDir(id);
    if (req.method === 'GET') {
      const metaPath = join(dir, 'meta.json');
      if (!existsSync(metaPath)) return send(res, 404, { error: 'not ready yet' });
      let meta; try { meta = JSON.parse(readFileSync(metaPath, 'utf8')); } catch { return send(res, 500, { error: 'bad proposal data' }); }
      const guidePath = join(dir, 'STYLE-GUIDE.md');
      return send(res, 200, { ...meta, guide: existsSync(guidePath) ? readFileSync(guidePath, 'utf8') : '', hasCover: existsSync(join(dir, 'cover.jpg')) });
    }
    if (req.method === 'DELETE') { rmSync(dir, { recursive: true, force: true }); return send(res, 200, { ok: true }); }
    return send(res, 404, { error: 'not found' });
  }
  if (a !== 'projects') return send(res, 404, { error: 'not found' });
  if (!id) {
    if (req.method === 'GET') {
      const list = readdirSync(PROJECTS, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => readProject(d.name)).filter(Boolean).filter((q) => !q.deleted || (trashProject(q.id) && false)).sort((x, y) => (y.created || 0) - (x.created || 0));
      for (const q of list) q.thumb = await thumbOf(q);
      return send(res, 200, list);
    }
    if (req.method === 'POST') {
      const j = JSON.parse(await body(req, 1e5)); if (!String(j.name || '').trim()) return send(res, 400, { error: 'name needed' });
      let s = slug(j.name), n = 2; while (existsSync(pdir(s))) s = slug(j.name) + '-' + n++;
      for (const d of ['raw', 'frames', 'drafts', 'revisions', 'voiceover']) mkdirSync(join(pdir(s), d), { recursive: true });
      const p = { id: s, name: String(j.name).trim(), styleId: j.styleId || '', format: j.format && j.format.w && j.format.h ? j.format : undefined, rawName: '', notes: [], phase: 'script', brief: '', dur: 0, created: Date.now() };
      writeProject(p); return send(res, 200, p);
    }
  }
  const p = readProject(id); if (!p) return send(res, 404, { error: 'no such project' });
  if (!b && req.method === 'DELETE') {
    if (runs.get(id)?.running) return send(res, 409, { error: 'Claude is working on this project. Stop it first.' });
    p.deleted = true; writeProject(p); trashProject(p.id); return send(res, 200, { ok: true });
  }
  if (b === 'duplicate' && req.method === 'POST') {
    let n = slug(p.name + ' copy'), i = 2; while (existsSync(pdir(n))) n = slug(p.name + ' copy') + '-' + i++;
    cpSync(pdir(id), pdir(n), { recursive: true });
    const q = { ...p, id: n, name: p.name + ' copy', created: Date.now() }; delete q.session; writeProject(q); return send(res, 200, q);
  }
  if (!b && req.method === 'PUT') { const j = JSON.parse(await body(req, 5e6)); writeProject({ ...j, id: p.id, session: p.session || j.session }); return send(res, 200, { ok: true }); }
  if (b === 'raw' && req.method === 'PUT') {
    const name = safeName(url.searchParams.get('name')); const out = createWriteStream(join(pdir(id), 'raw', name));
    req.pipe(out); out.on('finish', () => {
      // a new raw video makes the old transcript and text cuts wrong
      rmSync(join(pdir(id), 'transcript.json'), { force: true }); rmSync(join(pdir(id), 'cut'), { recursive: true, force: true });
      Object.assign(p, { rawName: name, struck: [], cuts: [], cutFile: '' }); writeProject(p); send(res, 200, p);
    }); out.on('error', () => send(res, 500, { error: 'could not save' })); return;
  }
  if (b === 'rawpart' && req.method === 'PUT') { // one of several clips to be joined into one raw video before anything else happens
    const name = safeName(url.searchParams.get('name')); const out = createWriteStream(join(pdir(id), 'raw', name));
    req.pipe(out); out.on('finish', () => send(res, 200, { name })); out.on('error', () => send(res, 500, { error: 'could not save' })); return;
  }
  if (b === 'concat' && req.method === 'POST') { // joins the uploaded rawpart clips, in the given order, into the project's one raw video
    const j = JSON.parse(await body(req, 1e5));
    const files = (Array.isArray(j.files) ? j.files : []).map(safeName).filter((f) => existsSync(join(pdir(id), 'raw', f)));
    if (files.length < 2) return send(res, 400, { error: 'need at least two clips to combine' });
    const out = 'combined' + (extname(files[0]) || '.mp4'), outPath = join(pdir(id), 'raw', out), listFile = join(pdir(id), 'raw', '.concat-list.txt');
    writeFileSync(listFile, files.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join('\n'));
    // the fast path only works when the clips already match (codec/resolution); otherwise fall back to a re-encoding concat
    let r = await proc('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', outPath]);
    if (r.code !== 0 || !existsSync(outPath)) {
      const inputs = files.flatMap((f) => ['-i', join(pdir(id), 'raw', f)]);
      const filt = files.map((_, i) => `[${i}:v:0][${i}:a:0]`).join('') + `concat=n=${files.length}:v=1:a=1[v][a]`;
      r = await proc('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filt, '-map', '[v]', '-map', '[a]', outPath]);
    }
    rmSync(listFile, { force: true });
    if (r.code !== 0 || !existsSync(outPath)) return send(res, 500, { error: 'Could not join the clips: ' + r.err });
    files.forEach((f) => rmSync(join(pdir(id), 'raw', f), { force: true })); // the separate parts aren't needed once combined
    rmSync(join(pdir(id), 'transcript.json'), { force: true }); rmSync(join(pdir(id), 'cut'), { recursive: true, force: true });
    Object.assign(p, { rawName: out, struck: [], cuts: [], cutFile: '' }); writeProject(p); return send(res, 200, p);
  }
  if (b === 'broll' && req.method === 'PUT') { // extra footage a revision note asks BOSS to cut in
    const name = safeName(url.searchParams.get('name')); mkdirSync(join(pdir(id), 'broll'), { recursive: true });
    const out = createWriteStream(join(pdir(id), 'broll', name));
    req.pipe(out); out.on('finish', () => send(res, 200, { name })); out.on('error', () => send(res, 500, { error: 'could not save' })); return;
  }
  if (b === 'reference' && req.method === 'PUT') { // a video whose editing style BOSS should copy
    const name = safeName(url.searchParams.get('name')); mkdirSync(join(pdir(id), 'reference'), { recursive: true });
    const out = createWriteStream(join(pdir(id), 'reference', name));
    req.pipe(out); out.on('finish', () => { p.refFile = name; writeProject(p); send(res, 200, p); }); out.on('error', () => send(res, 500, { error: 'could not save' })); return;
  }
  if (b === 'voiceover' && req.method === 'PUT') {
    const name = safeName(url.searchParams.get('name')); mkdirSync(join(pdir(id), 'voiceover'), { recursive: true });
    const out = createWriteStream(join(pdir(id), 'voiceover', name));
    req.pipe(out); out.on('finish', () => {
      // the Script step now edits this voiceover, so old voiceover script edits no longer apply
      rmSync(join(pdir(id), 'vo-transcript.json'), { force: true }); rmSync(join(pdir(id), 'cut'), { recursive: true, force: true });
      Object.assign(p, { voiceoverFile: name, struck: [], cuts: [], cutFile: '' }); writeProject(p); send(res, 200, p);
    }); out.on('error', () => send(res, 500, { error: 'could not save' })); return;
  }
  const ls = (dir, re) => { try { return readdirSync(join(pdir(id), dir)).filter((f) => re.test(f)); } catch { return []; } };
  if (b === 'voiceover') { const f = ls('voiceover', /\.(mp3|wav|m4a|ogg)$/i).map((file) => ({ file, v: statSync(join(pdir(id), 'voiceover', file)).mtimeMs })).sort((x, y) => y.v - x.v); return send(res, 200, f); }
  if (b === 'frames') { const f = ls('frames', /\.(jpe?g|png)$/i).map((file) => ({ file, t: +(/_t(\d+(?:\.\d+)?)/.exec(file) || [0, 0])[1], v: statSync(join(pdir(id), 'frames', file)).mtimeMs })).sort((x, y) => x.t - y.t); return send(res, 200, f); }
  if (b === 'drafts' && req.method === 'DELETE') {
    const f = safeName(url.searchParams.get('file')), src = join(pdir(id), 'drafts', f);
    if (!existsSync(src)) return send(res, 404, { error: 'no such file' });
    if (runs.get(id)?.running) return send(res, 409, { error: 'Claude is rendering. Stop it first.' });
    try { mkdirSync(join(PROJECTS, '.trash'), { recursive: true }); renameSync(src, join(PROJECTS, '.trash', p.id + '-draft-' + Date.now() + '-' + f)); } catch { p.hiddenDrafts = [...new Set([...(p.hiddenDrafts || []), f])]; writeProject(p); } return send(res, 200, { ok: true });
  }
  if (b === 'drafts') { const f = ls('drafts', /\.(mp4|mov|webm)$/i).filter((x) => !(p.hiddenDrafts || []).includes(x)).map((file) => { const st = statSync(join(pdir(id), 'drafts', file)); return { file, v: st.mtimeMs, size: st.size }; }).sort((x, y) => y.v - x.v); return send(res, 200, f); }
  if (b === 'status') { const s = runs.get(id); return send(res, 200, s ? { running: s.running, text: s.text, tool: s.tool, error: s.error, code: s.code, startedAt: s.startedAt, finishedAt: s.finishedAt } : { running: false }); }
  if (['transcribe', 'suggest', 'apply'].includes(b) && req.method === 'POST') {
    if (busy.has(id) || runs.get(id)?.running) return send(res, 409, { error: 'Something is still running on this project. Wait for it to finish.' });
    const raw = await body(req, 5e6); let j; try { j = raw ? JSON.parse(raw) : {}; } catch { return send(res, 400, { error: 'bad request' }); }
    busy.add(id);
    try {
      const r = await scriptJob(id, p, b, j);
      if (b === 'apply' && !r.error) { const q = readProject(id); q.cutFile = r.cutFile; q.cuts = j.cuts || []; writeProject(q); }
      return send(res, r.status || 200, r.status ? { error: r.error } : r);
    } finally { busy.delete(id); }
  }
  if (b === 'cancel' && req.method === 'POST') { const s = runs.get(id); if (s?.child && s.running) s.child.kill(); return send(res, 200, { ok: true }); }
  if (b === 'run' && req.method === 'POST') {
    if (runs.get(id)?.running) return send(res, 409, { error: 'Claude is already working on this project' });
    const j = JSON.parse(await body(req, 40e6)); let prompt = String(j.prompt || ''); if (!prompt) return send(res, 400, { error: 'no prompt' });
    const batch = 'batch-' + Date.now(); let any = false;
    for (const [k, u] of Object.entries(j.images || {})) {
      const key = String(k).replace(/[^a-z0-9-]/gi, '').slice(0, 40), img = dataUrl(u); if (!key || !img) continue;
      mkdirSync(join(pdir(id), 'revisions', batch), { recursive: true });
      writeFileSync(join(pdir(id), 'revisions', batch, key + '.' + img.ext), img.buf); any = true;
      prompt = prompt.split('{{img:' + key + '}}').join('projects/' + id + '/revisions/' + batch + '/' + key + '.' + img.ext);
    }
    prompt = prompt.replace(/\{\{img:[a-z0-9-]+\}\}/gi, '(no image)');
    startRun(id, prompt); return send(res, 200, { ok: true, batch: any ? batch : '' });
  }
  return send(res, 404, { error: 'not found' });
}

// ---- files (with Range, so videos can seek)
function serve(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') { res.writeHead(302, { location: '/hub/#studio' }); return res.end(); }
  const file = normalize(join(ROOT, rel));
  const top = file.slice(ROOT.length + 1).split(sep)[0];
  if (!file.startsWith(ROOT + sep) || !SHOW.includes(top) || file.slice(ROOT.length).split(sep).some((x) => x.startsWith('.'))) { res.writeHead(404); return res.end('not found'); }
  let target = file; try { if (statSync(target).isDirectory()) target = join(target, 'index.html'); } catch { res.writeHead(404); return res.end('not found'); }
  let size; try { size = statSync(target).size; } catch { res.writeHead(404); return res.end('not found'); }
  const type = MIME[extname(target).toLowerCase()] || 'application/octet-stream';
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (m) {
    const s = m[1] ? +m[1] : Math.max(0, size - +m[2]), e = m[1] && m[2] ? Math.min(+m[2], size - 1) : size - 1;
    res.writeHead(206, { 'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${s}-${e}/${size}`, 'content-length': e - s + 1, 'cache-control': 'no-cache' });
    return createReadStream(target, { start: s, end: e }).pipe(res);
  }
  res.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes', 'content-length': size, 'cache-control': 'no-cache' });
  createReadStream(target).pipe(res);
}

http.createServer(async (req, res) => {
  const host = (req.headers.host || '').replace(/:\d+$/, '');
  if (host !== 'localhost' && host !== '127.0.0.1') { res.writeHead(403); return res.end('forbidden'); }
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname.startsWith('/api/')) {
      const o = req.headers.origin; if (req.headers['x-studio'] !== '1' || (o && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o))) return send(res, 403, { error: 'forbidden' });
      return await api(req, res, url);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    serve(req, res, url);
  } catch (e) { if (!res.headersSent) send(res, 500, { error: String(e.message || e) }); else res.end(); }
}).listen(PORT, '127.0.0.1', () => console.log(`Editing Studio running at http://localhost:${PORT}  (workspace: ${ROOT})`));
