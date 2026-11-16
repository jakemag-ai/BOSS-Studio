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

