// Builds the publish-ready copy of the Editing Hub in hub/online/.
//   node hub/build-online.mjs
// It inlines the styles, data and script into one page, adds dark-mode and phone-edge handling,
// and copies the sample images, videos and style guides next to it.
// To update the hosted hub: edit hub/data.js (and hub/assets/), run this, then ask Claude to republish hub/online/.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, statSync, existsSync, renameSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const hub = dirname(fileURLToPath(import.meta.url));
const root = join(hub, '..');
const out = join(hub, 'online');
const safe = (js) => js.replace(/<\/script/gi, '<\\/script');

mkdirSync(out, { recursive: true });
// clear the contents (not the folder itself: Windows can hold the folder open)
for (const n of readdirSync(out)) rmSync(join(out, n), { recursive: true, force: true });

const css = readFileSync(join(hub, 'style.css'), 'utf8');
const data = readFileSync(join(hub, 'data.js'), 'utf8');
const app = readFileSync(join(hub, 'app.js'), 'utf8');
// the hosted site does not include the studio itself: it runs on the user's own computer (see getApp() in app.js)

const hosted = `
/* ---- hosted copy: both themes, phone edges, safe areas ---- */
:root[data-theme="dark"]{--bg:#15120F;--card:#1F1B17;--ink:#F4EFE6;--muted:#A79F93;--line:#34302A;--tint:#2A2520;--shadow:0 10px 30px rgba(0,0,0,.4);color-scheme:dark}
body{padding-left:max(16px, env(safe-area-inset-left, 0px));padding-right:max(16px, env(safe-area-inset-right, 0px))}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top, 0px);z-index:30;background:var(--bg)}
.top{top:env(safe-area-inset-top, 0px);margin-left:calc(-1 * max(16px, env(safe-area-inset-left, 0px)));margin-right:calc(-1 * max(16px, env(safe-area-inset-right, 0px)));padding-left:max(16px, env(safe-area-inset-left, 0px));padding-right:max(16px, env(safe-area-inset-right, 0px))}
main{padding-left:0;padding-right:0}
.foot{padding-left:0;padding-right:0}
main.wide{margin-left:calc(-1 * max(16px, env(safe-area-inset-left, 0px)));margin-right:calc(-1 * max(16px, env(safe-area-inset-right, 0px)))}
`;

const page = `<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
<title>BOSS Studio</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800&family=Playfair+Display:ital,wght@1,700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
${css}
${hosted}
</style>
<header class="top">
  <a class="brand" href="#overview"><span class="dot"></span>BOSS <i>Studio</i><span class="by">by Krista Mashore</span></a>
  <nav id="nav" aria-label="Main"></nav>
  <nav id="subnav" aria-label="Style versions" hidden></nav>
</header>
<main id="app" tabindex="-1"></main>
<footer class="foot">Always Glad To Be Of Service!<div class="foot-by">BOSS Studio by Krista Mashore Coaching</div></footer>
<div id="lightbox" class="lightbox" hidden><button class="lb-x" aria-label="Close">×</button><img alt=""><p></p></div>
<div id="reader" class="reader" hidden><div class="rd-box"><div class="rd-bar"><b class="rd-title"></b><button class="rd-x" aria-label="Close">Close</button></div><pre></pre></div></div>
<script>window.HUB_BASE = '';</script>
<script>window.HUB_HOSTED = true;${process.env.NOEMBED ? ' window.HUB_NOEMBED = true;' : ''}</script>
<script>
${safe(data)}
</script>
<script>
${safe(app)}
</script>
`;
writeFileSync(join(out, 'index.html'), page);

// internal preview: ask search engines and AI crawlers not to index or train on it. This is a request, not security:
// real privacy needs a login in front of the site (see the host's access settings).
const bots = ['*', 'GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-Web', 'anthropic-ai', 'Google-Extended', 'GoogleOther', 'PerplexityBot', 'CCBot', 'Bytespider', 'Applebot-Extended', 'Amazonbot', 'Meta-ExternalAgent', 'cohere-ai', 'Diffbot'];
writeFileSync(join(out, 'robots.txt'), bots.map((b) => `User-agent: ${b}\nDisallow: /\n`).join('\n'));
writeFileSync(join(out, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex\n  Referrer-Policy: no-referrer\n');

// sample images and videos
cpSync(join(hub, 'assets'), join(out, 'assets'), { recursive: true, filter: (s) => !/[\\/]mine([\\/]|$)/.test(s) }); // assets/mine = personal styles, never published

// the Artifact host accepts files up to 15 MB: shrink any bigger sample video in the published copy only (needs ffmpeg)
if (process.env.NOEMBED) {
  const vids = join(out, 'assets', 'video');
  for (const n of existsSync(vids) ? readdirSync(vids) : []) {
    const f = join(vids, n);
    if (/\.mp4$/i.test(n) && statSync(f).size > 14.5e6) {
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', f, '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-crf', '28', '-c:a', 'aac', '-b:a', '112k', '-movflags', '+faststart', f + '.tmp.mp4']);
      renameSync(f + '.tmp.mp4', f);
    }
  }
}

// style guides (every .md/.html under my-style-presets, not the code snapshots)
const lib = join(root, 'my-style-presets');
const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  if (statSync(p).isDirectory()) return n === 'source' || n === '_mine' || n === '_pending' ? [] : walk(p); // personal and pending styles stay off the public site
  return /\.(md|html)$/i.test(n) ? [p] : [];
});
for (const f of walk(lib)) {
  const rel = relative(root, f);
  mkdirSync(dirname(join(out, rel)), { recursive: true });
  cpSync(f, join(out, rel));
}

// the Editing Studio draft app: same page, with the hub data inlined so it needs no ../data.js
// list of files to publish beside the page
const list = [];
const all = (d) => readdirSync(d).forEach((n) => {
  const p = join(d, n);
  statSync(p).isDirectory() ? all(p) : list.push(relative(out, p).replace(/\\/g, '/'));
});
all(out);
writeFileSync(join(out, '_files.json'), JSON.stringify(list.filter((f) => f !== 'index.html' && f !== '_files.json')));
const bytes = list.reduce((n, f) => n + statSync(join(out, f)).size, 0);
console.log(`built hub/online: ${list.length} files, ${(bytes / 1e6).toFixed(1)} MB, page ${(statSync(join(out, 'index.html')).size / 1024).toFixed(0)} KB`);
