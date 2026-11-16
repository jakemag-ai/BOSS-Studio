(function () {
  const D = window.HUB;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const md = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  const app = $('#app');

  // ---------- hero illustrations: flat vector, one per style ----------
  const F = 'font-family="Montserrat,Arial,sans-serif" font-weight="800"';
  const svg = (label, body) => '<svg class="hero-art" viewBox="0 0 520 400" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="508" height="388" rx="26" fill="var(--tint)"/>' + body + '</svg>';
  const phone = (x, y, w, h, screen) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="26" fill="var(--ink)"/><rect x="' + (x + 8) + '" y="' + (y + 8) + '" width="' + (w - 16) + '" height="' + (h - 16) + '" rx="20" fill="' + screen + '"/>';
  const bar = (x, y, w, h, fill) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '" fill="' + fill + '"/>';
  // a presenter: shoulders, hair, face (cx, cy = head centre, s = scale)
  const person = (cx, cy, s, suit, hair) => '<ellipse cx="' + cx + '" cy="' + (cy + 34 * s) + '" rx="' + 38 * s + '" ry="' + 28 * s + '" fill="' + suit + '"/><circle cx="' + cx + '" cy="' + (cy - 3 * s) + '" r="' + 21 * s + '" fill="' + hair + '"/><circle cx="' + cx + '" cy="' + (cy + 2 * s) + '" r="' + 17 * s + '" fill="#F2C9A5"/>';
  const dots = (cx, cy, fill) => [0, 1, 2].map((i) => '<circle cx="' + (cx + i * 12) + '" cy="' + cy + '" r="3.5" fill="' + fill + '"/>').join('');

  const ART = {
    // Kinetic Type: typewriter headline, iris wipe, presenter popping out of a rounded box
    boss01: () => svg('Illustration of a vertical video: a typewriter headline, an orange iris wipe and a presenter whose head pops out of a rounded box',
      phone(190, 20, 150, 360, '#FBFAF8') +
      bar(208, 52, 112, 14, '#14110F') + bar(208, 74, 74, 14, '#DC2E0A') + '<rect x="287" y="71" width="4" height="20" rx="2" fill="#14110F"/>' +
      '<circle cx="265" cy="154" r="40" fill="#DC2E0A"/><circle cx="265" cy="154" r="20" fill="#FBFAF8"/>' +
      '<rect x="214" y="206" width="102" height="44" rx="10" fill="#fff" stroke="#E1DACD" stroke-width="2"/><rect x="214" y="206" width="102" height="6" rx="3" fill="#DC2E0A"/><circle cx="233" cy="232" r="8" fill="#1E9E5A"/><path d="M229 232l3 3 6-7" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' + bar(247, 228, 55, 8, '#E1DACD') +
      '<rect x="204" y="290" width="122" height="74" rx="14" fill="#2a2420"/>' + person(265, 282, 1.15, '#DC2E0A', '#3a2a1c') +
      '<rect x="40" y="120" width="116" height="92" rx="16" fill="var(--card)" stroke="var(--line)"/><rect x="40" y="120" width="116" height="9" rx="4" fill="var(--accent)"/><text x="98" y="185" text-anchor="middle" ' + F + ' font-size="46" fill="var(--ink)">16</text>' +
      bar(368, 126, 104, 20, 'var(--ink)') + bar(368, 158, 76, 20, 'var(--accent)') + bar(368, 190, 112, 20, 'var(--muted)') +
      '<circle cx="420" cy="290" r="30" fill="none" stroke="var(--line)" stroke-width="10"/><circle cx="420" cy="290" r="30" fill="none" stroke="var(--accent)" stroke-width="10" stroke-linecap="round" stroke-dasharray="120 70" transform="rotate(-90 420 290)"/>'),

    // Pastel Punch: beige, navy and hot pink slides with big step numbers
    boss02: () => svg('Illustration of three carousel slides with big pink step numbers in beige, navy and pink',
      '<g transform="rotate(-8 150 210)"><rect x="70" y="92" width="150" height="230" rx="20" fill="#E7DCC5" stroke="#8FB8B6" stroke-width="3"/><text x="104" y="190" ' + F + ' font-size="88" fill="#EE1A7B">1</text>' + bar(92, 214, 96, 12, '#050F18') + bar(92, 238, 70, 12, '#050F18') + '</g>' +
      '<g transform="rotate(7 380 220)"><rect x="300" y="100" width="150" height="230" rx="20" fill="#EE1A7B"/><text x="336" y="198" ' + F + ' font-size="88" fill="#fff">3</text>' + bar(322, 222, 96, 12, '#fff') + bar(322, 246, 62, 12, '#050F18') + '</g>' +
      '<rect x="185" y="70" width="150" height="250" rx="20" fill="#050F18"/><text x="224" y="176" ' + F + ' font-size="96" fill="#EE1A7B">2</text>' + bar(207, 204, 106, 13, '#fff') + bar(207, 230, 78, 13, '#0E8A86') +
      '<rect x="207" y="262" width="106" height="36" rx="18" fill="#fff"/><circle cx="228" cy="280" r="9" fill="#22C55E"/><path d="M223 280l3.5 3.5 7-8" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' + bar(244, 275, 54, 10, '#8FB8B6') +
      '<rect x="110" y="352" width="300" height="8" rx="4" fill="var(--line)"/><rect x="110" y="352" width="190" height="8" rx="4" fill="#EE1A7B"/>'),

    // Hype Cam: black grid stage, website mockup, head pop-out box, tally bars
    vertical01: () => svg('Illustration of a black grid stage with a website mockup and a presenter whose head pops out of a rounded box',
      phone(190, 20, 150, 360, '#0D0D0D') +
      [58, 88, 118, 148, 178, 208, 238, 268, 298, 328].map((y) => '<path d="M198 ' + y + 'H332" stroke="#fff" stroke-opacity=".07"/>').join('') +
      [222, 246, 270, 294, 318].map((x) => '<path d="M' + x + ' 28V372" stroke="#fff" stroke-opacity=".07"/>').join('') +
      '<rect x="246" y="88" width="30" height="30" fill="#F0287C" opacity=".35"/>' +
      bar(210, 46, 100, 13, '#fff') + bar(210, 66, 56, 13, '#F0287C') +
      '<rect x="206" y="100" width="118" height="116" rx="10" fill="#fff"/><rect x="206" y="100" width="118" height="16" rx="8" fill="#161618"/>' + dots(214, 108, '#555563') +
      '<circle cx="222" cy="132" r="8" fill="#0F2A4A"/><path d="M218 134l4-5 4 5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' + bar(236, 129, 48, 6, '#E8E8E4') + bar(290, 129, 24, 6, '#12805C') +
      bar(214, 148, 64, 7, '#161618') + bar(214, 160, 48, 7, '#161618') +
      '<rect x="212" y="176" width="106" height="32" rx="8" fill="#0D0D0D"/>' + bar(218, 182, 70, 5, '#F0287C') + bar(218, 191, 48, 5, '#F0287C') + bar(218, 200, 14, 5, '#fff') +
      bar(232, 252, 66, 11, '#fff') +
      '<rect x="204" y="284" width="122" height="78" rx="14" fill="#2a2420"/>' + person(265, 280, 1.15, '#F0287C', '#3a2a1c') +
      '<rect x="40" y="130" width="120" height="76" rx="14" fill="#161618"/><text x="100" y="178" text-anchor="middle" ' + F + ' font-size="21" fill="#F6F3EA">About Me.</text>' + bar(52, 186, 20, 11, 'none') + dots(62, 194, '#F6F3EA') +
      '<rect x="364" y="140" width="120" height="116" rx="16" fill="#fff"/><circle cx="424" cy="196" r="34" fill="none" stroke="#E8E8E4" stroke-width="9"/><circle cx="424" cy="196" r="34" fill="none" stroke="#1F8A5B" stroke-width="9" stroke-linecap="round" stroke-dasharray="205 214" transform="rotate(-90 424 196)"/><text x="424" y="205" text-anchor="middle" ' + F + ' font-size="26" fill="#0D0D0D">97</text>'),

    // Light Explainer: landscape screen, circle presenter bottom right, numbered slots
    clean: () => svg('Illustration of a horizontal explainer video: a big title, a browser mockup, a circle presenter at the bottom right and numbered step slots',
      '<rect x="46" y="58" width="428" height="244" rx="18" fill="var(--ink)"/><rect x="60" y="72" width="400" height="216" rx="10" fill="#FBFAF8"/>' +
      bar(86, 100, 168, 16, '#14110F') + bar(86, 126, 108, 16, '#DC2E0A') + bar(86, 154, 140, 8, '#E1DACD') +
      '<rect x="282" y="94" width="150" height="96" rx="10" fill="#fff" stroke="#E1DACD" stroke-width="2"/><rect x="282" y="94" width="150" height="16" rx="8" fill="#14110F"/>' + dots(290, 102, '#6B645C') + bar(296, 124, 70, 8, '#E1DACD') + bar(296, 140, 100, 8, '#E1DACD') + '<rect x="296" y="158" width="46" height="18" rx="9" fill="#DC2E0A"/>' +
      [0, 1, 2].map((i) => '<rect x="' + (86 + i * 56) + '" y="214" width="44" height="44" rx="10" fill="none" stroke="#1E9E5A" stroke-width="2.5" stroke-dasharray="6 5"/>').join('') +
      '<circle cx="104" cy="236" r="9" fill="#1E9E5A"/><path d="M99 236l3.5 3.5 7-8" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="416" cy="250" r="34" fill="#EDE6D9" stroke="#DC2E0A" stroke-width="4"/><clipPath id="pc"><circle cx="416" cy="250" r="30"/></clipPath><g clip-path="url(#pc)">' + person(416, 244, 1.0, '#14110F', '#3a2a1c') + '</g>' +
      '<rect x="228" y="302" width="64" height="22" fill="var(--muted)"/><rect x="186" y="324" width="148" height="10" rx="5" fill="var(--muted)"/>'),

    // Skill Score: pink and cream, tilted card, highlight box, caption pill, progress bar
    recreate: () => svg('Illustration of a pink and cream vertical video with a tilted white card, a pink highlight box and a dark caption pill',
      phone(190, 20, 150, 360, '#F6F1E9') +
      '<circle cx="206" cy="50" r="58" fill="#F7C6DC" opacity=".75"/><circle cx="330" cy="352" r="66" fill="#F7C6DC" opacity=".75"/>' +
      '<rect x="206" y="34" width="118" height="5" rx="2.5" fill="#E8D9D6"/><rect x="206" y="34" width="70" height="5" rx="2.5" fill="#E6007E"/>' +
      bar(208, 62, 104, 15, '#141414') + bar(208, 84, 62, 15, '#E6007E') +
      '<g transform="rotate(-3 265 170)"><rect x="212" y="120" width="106" height="100" rx="16" fill="#fff"/>' + bar(224, 134, 52, 9, '#E6007E') + bar(224, 152, 80, 7, '#E8D9D6') + bar(224, 166, 66, 7, '#E8D9D6') + '<rect x="224" y="182" width="82" height="26" rx="8" fill="#F7C6DC"/><rect x="222" y="130" width="86" height="19" rx="7" fill="none" stroke="#E6007E" stroke-width="3"/></g>' +
      '<g transform="rotate(4 265 262)"><rect x="224" y="232" width="84" height="46" rx="12" fill="#fff"/><text x="266" y="266" text-anchor="middle" ' + F + ' font-size="26" fill="#E6007E">87</text></g>' +
      '<rect x="212" y="318" width="106" height="30" rx="15" fill="#141414"/><text x="265" y="338" text-anchor="middle" ' + F + ' font-size="13" fill="#fff">graded <tspan fill="#E6007E">well</tspan></text>' +
      '<rect x="62" y="116" width="96" height="72" rx="14" fill="var(--card)" stroke="var(--line)"/><path d="M76 168l16-20 14 12 14-18 20 26z" fill="#E6007E" opacity=".85"/><circle cx="90" cy="134" r="7" fill="#F7C6DC"/>' +
      '<rect x="368" y="214" width="96" height="72" rx="14" fill="var(--card)" stroke="var(--line)"/>' + [0, 1, 2].map((i) => bar(380, 228 + i * 18, 72 - i * 14, 9, i === 1 ? '#E6007E' : 'var(--line)')).join('')),

    // Dark Terminal: onyx and gold app screens
    bossui: () => svg('Illustration of three onyx and gold app screens fanned out, with gold headlines, list rows and a draft folder',
      '<g transform="rotate(-11 160 230)"><rect x="70" y="86" width="132" height="236" rx="20" fill="var(--ink)"/><rect x="78" y="94" width="116" height="220" rx="14" fill="#0B0907"/>' + bar(90, 112, 70, 12, '#E3A82B') + [0, 1, 2, 3].map((i) => '<rect x="90" y="' + (142 + i * 38) + '" width="92" height="28" rx="8" fill="#1d1812"/>' + bar(98, 152 + i * 38, 56 - i * 6, 8, '#E3A82B')).join('') + '</g>' +
      '<g transform="rotate(11 360 230)"><rect x="318" y="86" width="132" height="236" rx="20" fill="var(--ink)"/><rect x="326" y="94" width="116" height="220" rx="14" fill="#0B0907"/><rect x="338" y="112" width="92" height="64" rx="10" fill="#E3A82B"/>' + bar(346, 128, 48, 10, '#0B0907') + bar(346, 146, 70, 8, '#0B0907') + bar(338, 194, 92, 10, '#6B645C') + bar(338, 214, 66, 10, '#6B645C') + bar(338, 234, 80, 10, '#6B645C') + '</g>' +
      '<rect x="196" y="60" width="128" height="268" rx="22" fill="var(--ink)"/><rect x="204" y="68" width="112" height="252" rx="16" fill="#0B0907"/>' +
      '<text x="260" y="124" text-anchor="middle" ' + F + ' font-size="32" fill="#E3A82B">BOSS</text>' + bar(222, 138, 76, 7, '#6B645C') +
      [0, 1, 2].map((i) => '<circle cx="226" cy="' + (172 + i * 34) + '" r="7" fill="#E3A82B"/>' + bar(240, 168 + i * 34, 60 - i * 8, 8, '#F4EFE6')).join('') +
      '<path d="M222 286h20l5 7h31a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6h-56a6 6 0 0 1-6-6v-21a6 6 0 0 1 6-6z" fill="#E3A82B"/>' +
      '<path d="M120 62l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" fill="#E3A82B"/><path d="M410 48l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#E3A82B" opacity=".8"/>'),
  };
  const heroArt = (s) => (ART[s.id] ? ART[s.id]() : s.cover ? '<img src="' + s.cover + '" alt="" style="width:100%;border-radius:22px;box-shadow:var(--shadow);max-height:420px;object-fit:cover">' : '');

  // ---------- navigation ----------
  function renderNav(route) {
    // styles that share a 'family' get ONE nav link (to the first member) and a sub menu row
    const seen = new Set();
    const styleLinks = [];
    D.styles.forEach((s) => {
      if (s.family) {
        if (seen.has(s.family)) return;
        seen.add(s.family);
        const kids = D.styles.filter((x) => x.family === s.family);
        styleLinks.push(['#style-' + s.id, s.family, kids.some((k) => route === 'style-' + k.id)]);
      } else styleLinks.push(['#style-' + s.id, s.short || s.name, route === 'style-' + s.id]);
    });
    const cur0 = D.styles.find((x) => route === 'style-' + x.id);
    const sub = $('#subnav');
    if (cur0 && cur0.family) {
      sub.innerHTML = '<span>' + esc(cur0.family) + '</span>' + D.styles.filter((x) => x.family === cur0.family)
        .map((k) => '<a href="#style-' + k.id + '" ' + (k.id === cur0.id ? 'aria-current="page"' : '') + '>' + esc(k.short || k.name) + '</a>').join('');
      sub.hidden = false;
    } else { sub.innerHTML = ''; sub.hidden = true; }
    const links = [
      ['#overview', 'Overview', route === 'overview'],
      ['__styles__', 'Editing Style', D.styles.some((x) => route === 'style-' + x.id)],
      ['#skills', 'Skills', route === 'skills'],
      ['#connectors', 'Connectors', route === 'connectors'],
      ['#repos', 'Repos', route === 'repos'],
      ['#case-study', 'Case study', route === 'case-study'],
      ['#studio', 'Editing App', route === 'studio'],
    ];
    let html = '';
    links.forEach(([href, label, on], i) => {
      if (i === 1 || label === 'Skills' || label === 'Editing App') html += '<span class="sep"></span>';
      if (href === '__styles__') {
        html += '<div class="dd"><button class="ddbtn' + (on ? ' on' : '') + '" type="button" aria-haspopup="true" aria-expanded="false">Editing Style <span aria-hidden="true">&#9662;</span></button><div class="ddmenu" role="menu" hidden>' +
          D.styles.map((s) => '<a role="menuitem" href="#style-' + s.id + '"' + (route === 'style-' + s.id ? ' aria-current="page"' : '') + '>' + esc(s.short || s.name) + '</a>').join('') + '</div></div>';
        return;
      }
      html += `<a href="${href}" ${on ? 'aria-current="page"' : ''}${label === 'Editing App' ? ' class="cta"' : ''}>${esc(label)}</a>`;
    });
    $('#nav').innerHTML = html;
    const cur = $('#nav [aria-current]');
    if (cur) cur.scrollIntoView({inline: 'center', block: 'nearest'});
  }

  // ---------- pieces ----------
  const tags = (arr, cls = '') => `<div class="tags">${(arr || []).map((t) => `<span class="tag ${cls}">${esc(t)}</span>`).join('')}</div>`;
  const list = (items) => `<ul>${items.map((i) => `<li>${md(i)}</li>`).join('')}</ul>`;
  const media = (src) => (src.startsWith('http') ? src : src);

  function videos(samples, wide) {
    if (!samples || !samples.length) return '<p class="empty">No finished sample for this style yet.</p>';
    return `<div class="videos">${samples
      .map(
        (v) => `<figure class="vid ${v.wide || wide ? 'wide' : ''}" style="margin:0">
        <video controls preload="metadata" playsinline ${v.poster ? `poster="${v.poster}"` : ''} src="${v.src}#t=${v.at || 3}"></video>
        <p><b>${esc(v.title)}</b>${v.note ? ' · ' + md(v.note) : ''}</p></figure>`
      )
      .join('')}</div>`;
  }

  function gallery(shots, wide, xl) {
    if (!shots || !shots.length) return '<p class="empty">No screenshots saved for this style yet.</p>';
    return `<div class="gallery ${wide ? 'wide' : ''} ${xl ? 'xl' : ''}">${shots
      .map((s) => `<button data-lb="${s.src}" data-cap="${esc(s.cap || '')}" aria-label="${esc(s.cap || 'Open image')}"><img loading="lazy" src="${s.src}" alt="${esc(s.cap || '')}"></button>`)
      .join('')}</div>`;
  }

  function swatches(p) {
    if (!p || !p.length) return '';
    return `<div class="swatches">${p.map((c) => `<div class="sw"><i style="background:${c.hex}"></i><b>${esc(c.name)}</b><span>${esc(c.hex)}</span></div>`).join('')}</div>`;
  }

  function fonts(f) {
    if (!f || !f.length) return '';
    return `<div class="type">${f.map((x) => `<div><small>${esc(x.use)}</small><div class="spec" style="${x.css || ''}">${esc(x.sample || 'Aa Why reviews matter')}</div><small>${esc(x.name)}</small></div>`).join('')}</div>`;
  }

  function table(head, rows) {
    return `<div class="tablewrap"><table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows
      .map((r) => `<tr>${r.map((c, i) => `<td data-label="${esc(head[i])}">${c}</td>`).join('')}</tr>`)
      .join('')}</tbody></table></div>`;
  }

  // ---------- overview ----------
  function overview() {
    const nVideos = D.styles.reduce((n, s) => n + (s.samples ? s.samples.length : 0), 0);
    return `
    <div class="band hero-band">
    <div class="hslider" aria-roledescription="carousel" aria-label="Highlights">
      <div class="hslides">
        <div class="hslide on" data-hs="0">
    <div class="ovhero">
      <div>
        <div class="eyebrow">Everything editing, in one place</div>
        <h1>BOSS <i>Studio</i></h1>
        <p class="lede">${esc(D.intro)}</p>
      </div>
      <div class="studio"><img class="studio-art" src="assets/img/studio-hero.gif" width="780" height="600" alt="Animated illustration of an editing studio: a playhead sweeps a timeline while the waveform ripples under a preview monitor"></div>
    </div>
        </div>
        <div class="hslide" data-hs="1" aria-hidden="true">
    <div class="ovhero">
      <div>
        <div class="eyebrow">New · the Editing App</div>
        <h1>Your vision. <i>BOSS</i> does the editing.</h1>
        <p class="lede">Turn raw footage into polished content on your own computer. Upload your video, choose a style, and tell BOSS what you want. Review your script and video side by side, then point to any word or frame to request changes. Send your notes in one batch, and let BOSS handle the edits.</p>
        <div class="app-steps"><span>1 · Script</span><span>2 · Instructions</span><span>3 · Editing</span><span>4 · Gallery</span></div>
      </div>
      <div class="studio"><svg class="app-art" viewBox="0 0 780 600" role="img" aria-label="The Editing App: four steps, a video player beside capture, style, notes and final-version modules" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="760" height="580" rx="34" fill="#EDE6D9"/>
        <g font-family="Montserrat,sans-serif" font-weight="800" font-size="13" text-anchor="middle">
          <rect x="70" y="36" width="150" height="30" rx="15" fill="#1E9E5A"/><text x="145" y="56" fill="#fff">1 · SCRIPT</text>
          <rect x="230" y="36" width="160" height="30" rx="15" fill="#1E9E5A"/><text x="310" y="56" fill="#fff">2 · INSTRUCTIONS</text>
          <rect class="a-p3" x="400" y="36" width="120" height="30" rx="15" fill="#14110F"/><text x="460" y="56" fill="#fff">3 · EDITING</text>
          <rect class="a-p4" x="530" y="36" width="120" height="30" rx="15" fill="#F6F3EC" stroke="#E1DACD"/><text class="a-t4" x="590" y="56" fill="#6B645C">4 · GALLERY</text>
        </g>
        <rect x="40" y="86" width="330" height="480" rx="22" fill="#fff" stroke="#E1DACD"/>
        <rect x="58" y="104" width="294" height="360" rx="14" fill="#F6F3EC"/>
        <rect x="140" y="116" width="130" height="336" rx="12" fill="#14110F"/>
        <rect x="152" y="146" width="80" height="9" rx="4" fill="#F6F3EC"/><rect x="152" y="162" width="52" height="9" rx="4" fill="#DC2E0A"/>
        <rect x="152" y="196" width="106" height="62" rx="9" fill="#fff"/><ellipse class="a-ann" cx="205" cy="228" rx="64" ry="38" fill="none" stroke="#E24B4A" stroke-width="4" stroke-linecap="round" pathLength="1"/>
        <circle cx="205" cy="320" r="26" fill="#6B645C"/><ellipse cx="205" cy="402" rx="44" ry="22" fill="#6B645C"/>
        <path d="M185 232l36 20-36 20z" fill="#DC2E0A" transform="translate(-12 -30)"/>
        <rect x="58" y="484" width="294" height="7" rx="3.5" fill="#E1DACD"/><rect class="a-prog" x="58" y="484" width="294" height="7" rx="3.5" fill="#DC2E0A"/>
        <circle cx="86" cy="526" r="17" fill="#14110F"/><path d="M81 518l12 8-12 8z" fill="#F6F3EC"/>
        <rect x="112" y="512" width="34" height="28" rx="14" fill="#fff" stroke="#E1DACD"/><rect x="152" y="512" width="34" height="28" rx="14" fill="#fff" stroke="#E1DACD"/><rect x="192" y="512" width="34" height="28" rx="14" fill="#fff" stroke="#E1DACD"/>
        <rect x="390" y="86" width="350" height="88" rx="18" fill="#fff" stroke="#E1DACD"/>
        <rect x="408" y="104" width="120" height="9" rx="4" fill="#6B645C"/>
        <rect x="408" y="126" width="112" height="32" rx="16" fill="#DC2E0A"/><rect x="530" y="126" width="132" height="32" rx="16" fill="#fff" stroke="#E1DACD"/>
        <rect x="390" y="186" width="350" height="96" rx="18" fill="#fff" stroke="#E1DACD"/>
        <rect x="408" y="204" width="130" height="9" rx="4" fill="#6B645C"/>
        <rect x="408" y="226" width="200" height="34" rx="12" fill="#fff" stroke="#E1DACD"/><rect x="618" y="226" width="106" height="34" rx="12" fill="#fff" stroke="#E1DACD"/>
        <rect x="390" y="294" width="350" height="166" rx="18" fill="#fff" stroke="#E1DACD"/>
        <rect x="408" y="312" width="110" height="9" rx="4" fill="#6B645C"/>
        <rect x="408" y="334" width="314" height="40" rx="12" fill="#fff" stroke="#E1DACD"/>
        <g class="a-n1"><rect x="408" y="386" width="296" height="26" rx="10" fill="#EDE6D9"/><rect x="414" y="392" width="30" height="14" rx="5" fill="#14110F"/></g>
        <g class="a-n2"><rect x="408" y="418" width="296" height="26" rx="10" fill="#EDE6D9"/><rect x="414" y="424" width="30" height="14" rx="5" fill="#14110F"/></g>
        <rect x="390" y="472" width="350" height="94" rx="18" fill="#fff" stroke="#1E9E5A" stroke-width="3"/>
        <rect x="408" y="490" width="120" height="9" rx="4" fill="#1E9E5A"/>
        <rect class="a-final" x="408" y="512" width="220" height="38" rx="19" fill="#DC2E0A"/>
      </svg></div>
    </div>
        </div>
      </div>
      <button class="hb hb-prev" data-sdir="-1" aria-label="Previous slide">&#8249;</button><button class="hb hb-next" data-sdir="1" aria-label="Next slide">&#8250;</button>

    </div>
    </div>
    <div class="band stats-band">
    <nav class="jump" aria-label="Jump to a section">
      ${[['styles', 'Styles'], ['samples', 'Samples'], ['library', 'Style files'], ['pipeline', 'Pipeline'], ['setup', 'Setup'], ['appworks', 'The app'], ['cheat', 'Cheat sheet'], ['skills-o', 'Skills'], ['conn-o', 'Connectors'], ['repos-o', 'Repos'], ['rules', 'Rules']]
        .map(([id, l]) => `<a href="#overview" data-jump="${id}">${l}</a>`)
        .join('')}
    </nav>
    <div class="stats">
      <div class="stat"><b>${D.styles.length}</b><span>styles built</span></div>
      <div class="stat"><b>${D.skills.length}</b><span>skills</span></div>
      <div class="stat"><b>${D.connectors.filter((c) => c.status === 'used').length}</b><span>connectors used</span></div>
      <div class="stat"><b>${D.repos.length}</b><span>repos</span></div>
      <div class="stat"><b>${nVideos}</b><span>sample videos</span></div>
    </div>

    </div>

    <section id="styles">
      <div class="eyebrow">Styles</div><h2>Every style we <i>built</i></h2>
      <p class="lede">Click a style to open its guidelines, palette, screenshots, samples and the files behind it.</p>
      <div class="groups">${[...new Set(D.styles.map((s) => s.group))]
        .map(
          (g) => `<div class="group"><h3 class="grp">${esc(g)}</h3>
      <div class="grid cards">${D.styles
        .filter((s) => s.group === g)
        .map(
          (s) => `<a class="card h" href="#style-${s.id}">
          <div class="thumb" style="background-image:url('${s.cover}')"></div>
          <div class="body"><div class="tags"><span class="tag ${s.status === 'Active' ? 'accent' : ''}">${esc(s.status)}</span><span class="tag">${esc(s.kind)}</span></div>
          <h3>${esc(s.name)}</h3><p>${esc(s.tagline)}</p></div></a>`
        )
        .join('')}</div></div>`
        )
        .join('')}</div>
    </section>

    <section id="samples">
      <div class="eyebrow">Samples</div><h2>Every <i>output</i> in one place</h2>
      <p class="lede">All the finished videos and drafts from the individual style pages. Click a style name to open its page.</p>
      ${allSamples()}
    </section>

    <section id="library">
      <div class="eyebrow">Style files</div><h2>The style <i>library</i></h2>
      <p class="lede">Every guide file, named for what the style does. They all live in <code>my-style-presets/</code> (index: <code>INDEX.md</code>). <code>my-style.md</code> stays at the repo root because the editor reads it by that name.</p>
      <p class="lede" style="margin-top:10px">Pattern: <code>my-style-presets/&lt;category&gt;/&lt;style&gt;/&lt;Style-Name&gt;_&lt;kind-of-document&gt;.md</code></p>
      ${table(['Category', 'Style', 'Guide file', 'What it does'], D.library.map((l) => [esc((D.styles.find((s) => s.id === l.id) || {}).group || ''), `<a href="#style-${l.id}"><b>${esc(l.style)}</b></a>`, `<code>${esc(l.file)}</code>`, md(l.what)]))}
    </section>

    <section id="pipeline">
      <div class="eyebrow">How a video gets made</div><h2>The <i>pipeline</i></h2>
      <div class="steps">${D.pipeline.map((p) => `<div class="step"><h3>${esc(p.t)}</h3><p>${md(p.d)}</p></div>`).join('')}</div>
    </section>

    <section id="setup">
      <div class="eyebrow">Get started</div><h2>Set up <i>BOSS Studio</i></h2>
      <p class="lede">Do this once. After that, starting the studio is one double-click.</p>
      <div class="steps">
        <div class="step"><h3>Get what you need</h3><p>An AI agent that runs terminal commands (Claude Code, signed in), plus <b>Node.js 22+</b>, <b>Git</b>, <b>FFmpeg</b> and <b>Chrome</b>. About 1 GB of disk. Setup tells you what is missing.</p></div>
        <div class="step"><h3>Download it</h3><p>Run <code>git clone https://github.com/vincentkmc2023/BOSSStudio.git</code> or use <b>Code &gt; Download ZIP</b> on GitHub and unzip it.</p></div>
        <div class="step"><h3>Open the folder in your agent</h3><p>In a terminal: <code>cd BOSSStudio</code> then <code>claude</code>. In the Claude desktop app, open the Code tab, pick Local and the folder.</p></div>
        <div class="step"><h3>Type <code>start</code></h3><p>The agent checks your computer, installs what is missing (with your OK), renders a test video and asks a few questions about your style.</p></div>
        <div class="step"><h3>Add transcription</h3><p>Free either way: a Groq key in <code>.env</code> as <code>GROQ_API_KEY</code> (copy <code>.env.example</code>), or leave it blank and use local faster-whisper (<code>pip install faster-whisper</code>).</p></div>
        <div class="step"><h3>Start the studio</h3><p>Double-click <code>hub/open-studio.bat</code>. It opens this hub at <b>http://localhost:1988/hub/</b>; click <b>Editing App</b> to work on your projects. Keep that window open; close it to stop. Projects are saved as folders in <code>projects/</code>.</p></div>
        <div class="step"><h3>Make your first video</h3><p>Press <b>New project</b>, drop a video or voiceover, write your first prompt, pick a style and a format, then press <b>Create project</b> (or <b>Magic Edit</b>).</p></div>
      </div>
      <p class="lede" style="margin-top:22px">Voiceover, music and sound effects use ElevenLabs. BOSS asks before it calls any paid service. If the studio says it saves in this browser only, the server is not running: start it with <code>open-studio.bat</code>.</p>
    </section>

    <section id="appworks">
      <div class="eyebrow">BOSS Studio</div><h2>How the <i>app</i> works</h2>
      <p class="lede">Four steps across the top of every project: Script, Instructions, Editing, Gallery. You review and send notes; BOSS (Claude) does the editing.</p>
      <div class="shots">
        <figure><img src="assets/img/app-1-new.jpg" alt="New project screen in BOSS Studio" loading="lazy"><figcaption><b>1 · Create a project.</b> Name it, drop a video or just a voiceover, write your first prompt, pick a style and a format. Add reference links to copy another video's editing, or press <b>Magic Edit</b> to let BOSS decide everything.</figcaption></figure>
        <figure><img src="assets/img/app-2-editing.jpg" alt="Editing step in BOSS Studio with video, script or frames, and revision notes" loading="lazy"><figcaption><b>2 · Edit with notes.</b> Watch the draft, switch between <b>Script</b> and <b>Frames</b>, take a <b>Snapshot</b>, write revision notes (add an image or B-roll to any note), then press <b>Render Draft</b>.</figcaption></figure>
      </div>
      <div class="steps appnotes">
        <div class="step"><h3>Script</h3><p>Click any word to jump there and cut what you don't want. Voiceover-only projects generate the voice here.</p></div>
        <div class="step"><h3>Instructions</h3><p>Your first prompt, the project style, references and options. It locks once frames exist; change things in Editing.</p></div>
        <div class="step"><h3>Editing</h3><p>Frames first (no video yet), then drafts. Change the whole style, or <b>Save As New Style</b> to add the look to the style picker.</p></div>
        <div class="step"><h3>Gallery</h3><p>Every version, oldest to latest. <b>Render Final Version</b> gives full resolution (1080p, 30 fps); drafts stay small and fast.</p></div>
      </div>
    </section>

    <section id="cheat">
      <div class="eyebrow">Cheat sheet</div><h2>What to <i>say</i> to the editor</h2>
      ${table(['Say this', 'You get'], D.cheat.map((c) => [`<code>${esc(c[0])}</code>`, md(c[1])]))}
    </section>

    <section id="skills-o">
      <div class="eyebrow">Skills</div><h2>The skills we <i>use</i></h2>
      ${skillTable(true)}
      <p><a class="btn" href="#skills">All skills</a></p>
    </section>

    <section id="conn-o">
      <div class="eyebrow">Connectors and tools</div><h2>What we <i>plugged in</i></h2>
      ${connTable(true)}
      <p><a class="btn" href="#connectors">All connectors</a></p>
    </section>

    <section id="repos-o">
      <div class="eyebrow">Repos</div><h2>Where the code <i>lives</i></h2>
      ${repoTable()}
    </section>

    <section id="rules">
      <div class="eyebrow">Lasting rules</div><h2>Rules the editor <i>always follows</i></h2>
      <p class="lede">From <code>my-rules.md</code>. These beat every style.</p>
      <div class="cols">${D.rules.map((r) => `<div class="panel"><h3>${esc(r.t)}</h3><p>${md(r.d)}</p><p><small style="color:var(--muted)">${esc(r.quote)}</small></p></div>`).join('')}</div>
    </section>

    `;
  }

  function allSamples() {
    const all = D.styles.flatMap((s) => (s.samples || []).map((v) => ({v, s})));
    if (!all.length) return '<p class="empty">No samples yet.</p>';
    const cards = all.map(({v, s}) => '<figure class="vid' + (v.wide ? ' wide' : '') + '" style="margin:0"><video controls preload="metadata" playsinline src="' + v.src + '#t=' + (v.at || 3) + '"></video><p><a href="#style-' + s.id + '"><b>' + esc(s.short || s.name) + '</b></a> · ' + esc(v.title) + (v.note ? ' · ' + md(v.note) : '') + '</p></figure>').join('');
    return '<div class="carousel"><div class="car-nav"><span class="car-count" aria-live="polite"></span></div><button type="button" class="car-arrow prev" data-dir="-1" aria-label="Previous videos">&larr;</button><button type="button" class="car-arrow next" data-dir="1" aria-label="Next videos">&rarr;</button><div class="track" tabindex="0" role="region" aria-label="Sample videos, scroll sideways">' + cards + '</div></div>';
  }

  function carState(track) {
    const nav = track.parentElement;
    const cards = [...track.children];
    const step = cards[0] ? cards[0].offsetWidth + 20 : 1;
    const max = track.scrollWidth - track.clientWidth - 2;
    nav.querySelector('[data-dir="-1"]').disabled = track.scrollLeft <= 2;
    nav.querySelector('[data-dir="1"]').disabled = track.scrollLeft >= max;
    nav.querySelector('.car-count').textContent = Math.min(cards.length, Math.round(track.scrollLeft / step) + 1) + ' / ' + cards.length;
  }
  let slideT = null;
  function goSlide(n) {
    const sl = [...document.querySelectorAll('.hslide')]; if (!sl.length) return;
    n = (n + sl.length) % sl.length;
    sl.forEach((s, k) => { s.classList.toggle('on', k === n); s.setAttribute('aria-hidden', k === n ? 'false' : 'true'); });
    document.querySelectorAll('.hd').forEach((d, k) => d.classList.toggle('on', k === n));
  }
  const slideNow = () => Math.max(0, [...document.querySelectorAll('.hslide')].findIndex((s) => s.classList.contains('on')));
  function startSlider() {
    clearInterval(slideT);
    slideT = setInterval(() => { if (!document.querySelector('.hslides')) return clearInterval(slideT); if (document.hidden || document.querySelector('.hslider:hover') || document.querySelector('.hslider:focus-within')) return; goSlide(slideNow() + 1); }, 9000);
  }
  function skillTable(short) {
    const rows = (short ? D.skills.slice(0, 8) : D.skills).map((s) => [`<b>${esc(s.name)}</b>`, md(s.what), esc(s.where), `<span class="tag ${s.used ? 'green' : ''}">${s.used ? 'used' : 'available'}</span>`]);
    return table(['Skill', 'What it does', 'Where it lives', ''], rows);
  }
  function connTable(short) {
    const list = short ? D.connectors.filter((c) => c.status === 'used') : D.connectors;
    return table(['Connector / tool', 'Used for', 'How it is set up', ''], list.map((c) => [`<b>${esc(c.name)}</b>`, md(c.used), md(c.setup), `<span class="tag ${c.status === 'used' ? 'green' : ''}">${esc(c.status)}</span>`]));
  }
  function repoTable() {
    return table(['Repo / source', 'What it is', 'Link'], D.repos.map((r) => [`<b>${esc(r.name)}</b>`, md(r.what), r.url ? `<a href="${r.url}" target="_blank" rel="noopener">${esc(r.url.replace('https://', ''))}</a>` : `<code>${esc(r.local)}</code>`]));
  }

  function guidesHtml(g) {
    if (!g || !g.length) return '';
    const btns = g
      .map((x) => (x.html ? '<a class="btn" href="' + (window.HUB_BASE || '') + x.path + '" target="_blank" rel="noopener">' + esc(x.label) + ' ↗</a>' : '<button data-guide="' + x.path + '">' + esc(x.label) + '</button>'))
      .join('');
    return '<section><div class="eyebrow">Style guide file</div><h2>Read the <i>guide</i></h2><div class="say" style="margin-top:14px">' + btns + '</div></section>';
  }

  // ---------- style page ----------
  function stylePage(id) {
    const s = D.styles.find((x) => x.id === id);
    if (!s) return '<h1>Not found</h1><p><a href="#overview">Back to the overview</a></p>';
    const idx = D.styles.indexOf(s);
    const prev = D.styles[idx - 1], next = D.styles[idx + 1];
    return `
    <div class="band hero-band">
    <div class="eyebrow">${esc(s.group)} · ${esc(s.kind)} · ${esc(s.status)}</div>
    <div class="hero">
      <div>
        <h1>${s.titleHtml || esc(s.name)}</h1>
        <p class="lede">${esc(s.tagline)}</p>
        ${tags(s.formats)}
        ${s.invoke && s.invoke.length ? `<div class="say"><span class="eyebrow" style="margin:0">Say</span>${s.invoke.map((i) => `<code>${esc(i)}</code>`).join('')}<button data-copy="${esc(s.invoke[0])}">Copy</button></div>` : ''}
      </div>
      <div>${heroArt(s)}</div>
    </div>
    ${s.origin ? `<div class="note"><b>Where it came from.</b> ${md(s.origin)}</div>` : ''}
    </div>

    <section><div class="eyebrow">Samples</div><h2>Finished <i>outputs</i></h2>${videos(s.samples)}</section>

    <section><div class="eyebrow">Screenshots</div><h2>How it <i>looks</i></h2>${gallery(s.shots, s.wideShots, s.wideShots || (s.samples || []).some((v) => v.wide))}
      ${s.refShots && s.refShots.length ? `<h3 style="margin-top:34px">${esc(s.refTitle || 'Reference frames')}</h3>${gallery(s.refShots, true)}` : ''}</section>

    ${s.palette && s.palette.length ? `<section><div class="eyebrow">Look</div><h2>Colour and <i>type</i></h2>${swatches(s.palette)}${fonts(s.fonts)}</section>` : ''}

    <section><div class="eyebrow">Guidelines</div><h2>The <i>rules</i> of this style</h2>
      <div class="cols">${(s.sections || []).map((sec) => `<div class="panel"><h3>${esc(sec.t)}</h3>${list(sec.p)}</div>`).join('')}</div>
      ${s.notes ? s.notes.map((n) => `<div class="note">${md(n)}</div>`).join('') : ''}
    </section>

    ${s.build && s.build.length ? `<section><div class="eyebrow">Build it</div><h2>How to make a <i>new one</i></h2><div class="steps">${s.build.map((b) => `<div class="step"><p>${md(b)}</p></div>`).join('')}</div></section>` : ''}

    ${s.files && s.files.length ? `<section><div class="eyebrow">Files</div><h2>What is <i>behind it</i></h2><div class="panel"><ul class="filelist">${s.files.map((f) => `<li><code>${esc(f[0])}</code><span>${md(f[1])}</span></li>`).join('')}</ul></div></section>` : ''}

    ${guidesHtml(s.guides)}

    ${s.session ? `<section><p class="note" style="margin:0"><b>Built in:</b> ${esc(s.session)}</p></section>` : ''}

    <section style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
      ${prev ? `<a class="btn" href="#style-${prev.id}">← ${esc(prev.short || prev.name)}</a>` : '<span></span>'}
      <a class="btn" href="#overview">Overview</a>
      ${next ? `<a class="btn" href="#style-${next.id}">${esc(next.short || next.name)} →</a>` : '<span></span>'}
    </section>`;
  }

  // ---------- case study: reference in, Neon Explainer out ----------
  function caseStudy() {
    const s = D.styles.find((x) => x.id === 'explainer-video') || {};
    const sm = (s.samples || [])[0] || {};
    const REF = 'https://www.facebook.com/reel/2382371192514255';
    const flow = [
      ['Reference', 'A Facebook reel about AI employees. You paste its link into a new project.', 'ti-link'],
      ['Study', 'BOSS watches it and pulls out the look: stages, colours, type, motion and pacing.', 'ti-eye'],
      ['Script + voice', "The selling is removed. Krista's script and ElevenLabs voice, music and effects replace the original.", 'ti-microphone'],
      ['Stills', 'Frames come first, with no video yet. You click a frame and draw a note on it.', 'ti-photo'],
      ['Drafts', 'Draft v1, v2, v3. Each round you write notes and press Render Draft.', 'ti-movie'],
      ['Approved', 'Draft v3 is approved. The final render is full resolution.', 'ti-circle-check'],
      ['Saved style', 'Save As New Style turns it into Neon Explainer, ready for the next video.', 'ti-bookmark'],
    ];
    const kept = ['A glowing navy stage and a soft blue-grey stage that take turns', 'Mock app windows, robot tiles, counters and diagrams', 'Inter headlines with gradient accent words, word by word on the spoken word', 'B-roll in the presenter slots, with a big caption bottom-left', 'Blur cross-dissolves on every change, no whooshes'];
    const changed = ['The selling was removed', "Krista's script and ElevenLabs voice replace the original voiceover", 'Music and sound effects are generated, soft clicks and dings', 'Made faceless on purpose, so no presenter is needed', 'Rendered 16:9 horizontal (1440×810 draft, 1920×1080 final)'];
    return `
    <div class="band hero-band cs-hero"><div class="eyebrow">Case study</div><h1>One reel in, <i>one style</i> out</h1>
      <p class="lede">BOSS Studio can study an edit you like and rebuild it with your own script and voice. Here is one real run, from a Facebook reel to the Neon Explainer style.</p></div>

    <section class="cs">
      <div class="eyebrow">The workflow</div><h2>From reference to <i>reusable style</i></h2>
      <div class="flow" role="list">${flow.map((f, i) => `<div class="fnode" role="listitem"><span class="fnum">${i + 1}</span><i class="ti ${f[2]}" aria-hidden="true"></i><h3>${esc(f[0])}</h3><p>${esc(f[1])}</p></div>${i < flow.length - 1 ? '<span class="farrow" aria-hidden="true">&#8594;</span>' : ''}`).join('')}</div>
      <div class="floop"><svg viewBox="0 0 700 56" aria-hidden="true"><path d="M630 4v22a14 14 0 0 1-14 14H84a14 14 0 0 1-14-14V12" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round"/><path d="M62 18l8-10 8 10z" fill="var(--accent)"/></svg><span>Notes and new drafts repeat until you approve</span></div>
    </section>

    <section class="cs">
      <div class="eyebrow">Side by side</div><h2>Reference <i>and</i> output</h2>
      <div class="vs">
        <figure class="vs-ref"><div class="vs-frame ref"><iframe title="The reference reel on Facebook" src="https://www.facebook.com/plugins/video.php?height=560&amp;href=${encodeURIComponent(REF + '/')}&amp;show_text=false&amp;width=315" width="315" height="560" style="border:0;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" loading="lazy"></iframe></div>
          <figcaption><b>Reference.</b> The original reel. <a href="${REF}" target="_blank" rel="noopener">Open on Facebook</a> if the player does not load.</figcaption></figure>
        <figure class="vs-out"><div class="vs-frame out"><video controls playsinline preload="metadata" poster="${esc(s.cover || '')}" src="${esc(sm.src || '')}#t=${sm.at || 0}"></video></div>
          <figcaption><b>Output.</b> Neon Explainer, ${esc(sm.title || '')}. ${esc(sm.note || '')}</figcaption></figure>
      </div>
    </section>

    <section class="cs">
      <div class="eyebrow">What carried over</div><h2>Kept <i>and</i> changed</h2>
      <div class="kc">
        <div class="panel"><h3>Carried into the style</h3><ul>${kept.map((k) => '<li>' + esc(k) + '</li>').join('')}</ul></div>
        <div class="panel"><h3>Changed on purpose</h3><ul>${changed.map((k) => '<li>' + esc(k) + '</li>').join('')}</ul></div>
      </div>
    </section>

    <section class="cs">
      <div class="eyebrow">The result</div><h2>Moments from the <i>output</i></h2>
      <div class="cs-shots">${(s.shots || []).map((x) => `<figure><img src="${esc(x.src)}" alt="${esc(x.cap)}" loading="lazy"><figcaption>${esc(x.cap)}</figcaption></figure>`).join('')}</div>
      ${swatches(s.palette || [])}
      <p style="margin-top:26px"><a class="btn" href="#style-explainer-video">Open the Neon Explainer style</a> <a class="btn" href="#studio">Try it in the Editing App</a></p>
      <p class="lede" style="margin:18px auto 0">To use it on a new video, say <code>use Neon Explainer</code>. To copy a different reference, paste its link in New project under Reference Link(s).</p>
    </section>`;
  }

  // ---------- lists ----------
  const pages = {
    'case-study': caseStudy,
    studio: () => '<iframe id="studio" title="BOSS Studio" allowfullscreen style="width:100%;border:0;min-height:80vh;display:block" ' + (window.HUB_STUDIO_DOC ? 'srcdoc="' + window.HUB_STUDIO_DOC.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"' : 'src="studio/index.html"') + '></iframe>',
    skills: () => `<div class="band hero-band"><div class="eyebrow">Skills</div><h1>All <i>skills</i></h1><p class="lede">Agent Skills the editor and the sessions rely on. "Used" means a session actually used it.</p></div><section>${skillTable(false)}</section>`,
    connectors: () => `<div class="band hero-band"><div class="eyebrow">Connectors and tools</div><h1>Connectors <i>and tools</i></h1><p class="lede">What is plugged in, what it did, and how it is set up. Keys are never shown here.</p></div><section>${connTable(false)}</section>`,
    repos: () => `<div class="band hero-band"><div class="eyebrow">Repos</div><h1>Repos <i>and sources</i></h1><p class="lede">The code and models behind the editing setup.</p></div><section>${repoTable()}</section>`,
  };

  // ---------- router ----------
  function route() {
    const raw = location.hash.replace(/^#\/?/, '') || 'overview';
    const h = raw.startsWith('style/') ? 'style-' + raw.slice(6) : raw;
    renderNav(h);
    app.classList.add('wide');
    $('#reader').hidden = true;
    if (h === 'overview') app.innerHTML = overview();
    else if (h.startsWith('style-')) app.innerHTML = stylePage(h.slice(6));
    else if (pages[h]) app.innerHTML = pages[h]();
    else app.innerHTML = overview();
    const t = h.startsWith('style-') ? (D.styles.find((x) => 'style-' + x.id === h) || {}).name : h[0].toUpperCase() + h.slice(1).replace(/-/g, ' ');
    document.title = (t ? t + ' · ' : '') + 'BOSS Studio';
    window.scrollTo({top: 0});
    document.querySelectorAll('.track').forEach(carState);
    if (h === 'overview') startSlider();
    app.focus({preventScroll: true});
    if (location.hash.startsWith('#/overview#')) {}
  }

  // Editing Style dropdown
  function closeDd() { document.querySelectorAll('.ddmenu').forEach((m) => { m.hidden = true; }); document.querySelectorAll('.ddbtn').forEach((b) => b.setAttribute('aria-expanded', 'false')); }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.ddbtn');
    if (b) {
      const m = b.parentElement.querySelector('.ddmenu'), open = m.hidden;
      closeDd();
      if (open) { const r = b.getBoundingClientRect(); m.style.top = r.bottom + 6 + 'px'; m.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 228)) + 'px'; m.hidden = false; b.setAttribute('aria-expanded', 'true'); }
      return;
    }
    closeDd();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDd(); });
  window.addEventListener('scroll', closeDd, {passive: true});
  window.addEventListener('resize', closeDd);
  window.addEventListener('hashchange', route);
  window.addEventListener('message', (e) => { const f = $('#studio'); if (f && e.data && e.data.studioH) f.style.height = e.data.studioH + 'px'; });

  // lightbox + copy
  document.addEventListener('click', (e) => {
    const sb = e.target.closest('[data-sdir],[data-slide]'); if (sb) { goSlide(sb.dataset.slide !== undefined ? +sb.dataset.slide : slideNow() + +sb.dataset.sdir); return; }
    const ea = e.target.closest('#nav a.cta'); if (ea && location.hash === '#studio') { e.preventDefault(); route(); return; } // already on the Editing App: go back to the projects list
    const lb = e.target.closest('[data-lb]');
    if (lb) {
      const box = $('#lightbox');
      $('img', box).src = lb.dataset.lb;
      $('p', box).textContent = lb.dataset.cap || '';
      box.hidden = false;
      return;
    }
    if (e.target.closest('.lb-x') || e.target.id === 'lightbox') $('#lightbox').hidden = true;
    const cp = e.target.closest('[data-copy]');
    if (cp) {
      const label = cp.dataset.label || (cp.dataset.label = cp.textContent);
      const done = (ok) => {
        cp.textContent = ok ? (cp.dataset.done || 'Copied') : 'Copy failed: select the text';
        cp.classList.toggle('copied', ok);
        setTimeout(() => { cp.textContent = label; cp.classList.remove('copied'); }, 2200);
      };
      const fallback = () => {
        try {
          const t = document.createElement('textarea');
          t.value = cp.dataset.copy; t.style.position = 'fixed'; t.style.opacity = '0';
          document.body.appendChild(t); t.select();
          const ok = document.execCommand('copy');
          t.remove();
          done(ok);
        } catch (err) { done(false); }
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(cp.dataset.copy).then(() => done(true), fallback);
        else fallback();
      } catch (err) { fallback(); }
    }
    const jump = e.target.closest('a[data-jump]');
    if (jump) {
      e.preventDefault();
      const el = document.getElementById(jump.dataset.jump);
      if (el) el.scrollIntoView({behavior: 'smooth'});
    }
  });
  // full-guide reader (loads the style file from the repo and shows it as text)
  document.addEventListener('click', async (e) => {
    const g = e.target.closest('[data-guide]');
    if (!g) return;
    const box = $('#reader');
    $('.rd-title', box).textContent = g.dataset.guide;
    $('pre', box).textContent = 'Loading…';
    box.hidden = false;
    try {
      const res = await fetch((window.HUB_BASE || '') + g.dataset.guide);
      if (!res.ok) throw new Error(res.status);
      $('pre', box).textContent = await res.text();
    } catch (err) {
      $('pre', box).textContent = 'Could not load this file here. Open it from the folder:\n' + g.dataset.guide;
    }
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('.rd-x') || e.target.id === 'reader') $('#reader').hidden = true;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $('#lightbox').hidden = true;
      $('#reader').hidden = true;
    }
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.carousel [data-dir]');
    if (!b) return;
    const track = b.closest('.carousel').querySelector('.track');
    const card = track.children[0];
    track.scrollBy({left: Number(b.dataset.dir) * (card ? card.offsetWidth + 20 : 300), behavior: 'smooth'});
  });
  document.addEventListener('scroll', (e) => { if (e.target.classList && e.target.classList.contains('track')) carState(e.target); }, true);
  window.addEventListener('resize', () => document.querySelectorAll('.track').forEach(carState));
  document.addEventListener('play', (e) => {
    if (e.target.tagName === 'VIDEO' && e.target.closest('.track')) document.querySelectorAll('.track video').forEach((v) => { if (v !== e.target) v.pause(); });
  }, true);
  route();
  document.querySelectorAll('.track').forEach(carState);
})();
