// Replaces the Punch-In + Split entry in hub/data.js (id 'vertical01') with Hype Cam.
import fs from 'node:fs';
let s = fs.readFileSync('data.js', 'utf8');
const a = s.indexOf('    // ------------------------------------------------------------------ Punch-In + Split');
const b = s.indexOf('    // ------------------------------------------------------------------ Clean explainer');
if (a < 0 || b < 0 || b < a) throw new Error('entry markers not found');

const entry = `    // ------------------------------------------------------------------ Hype Cam
    {
      id: 'vertical01',
      group: 'Talking-head edits',
      short: 'Hype Cam',
      name: 'Hype Cam',
      titleHtml: '<i>Viral</i> Style v1',
      status: 'New · Draft v8',
      kind: 'Video · vertical',
      cover: IMG('viral-v1-3'),
      tagline: 'A talking-head explainer where the speaker sits in a rounded box at the bottom and her head pops out above it, over a black or pale-grid stage with animated grids. The explanation plays on a generic business website mockup, with one pink accent and italic serif accent words.',
      formats: ['9:16 vertical', '1080×1920 · 30 fps', 'Drafts 940×1672 · 24 fps', 'Test video: 53.9 s'],
      invoke: ['use Hype Cam', 'use Split-Card Reels'],
      aka: 'Split-Card Reels (studied from four reels)',
      origin: 'Studied from four short reels (Desire Hook Method, Claude YouTube skills, Sandcastles MCP, Instagram algorithm), then built and tested on the "Nobody visits your website to learn about you" post on 2026-11-12. It reuses the head pop-out from Kinetic Type and the website look of the companion webpage. Saved in \`my-style-presets/talking-head-edits/split-card-reels/\` and registered in \`my-rules.md\`.',
      samples: [],
      shots: [
        {src: IMG('viral-v1-1'), cap: 'Hook: headline and flip card on frame 1'},
        {src: IMG('viral-v1-2'), cap: 'Visitor on the website mockup'},
        {src: IMG('viral-v1-3'), cap: 'Tally bars count I / we / my / our'},
        {src: IMG('viral-v1-4'), cap: 'Full-frame face punch-in'},
        {src: IMG('viral-v1-5'), cap: 'Weak line struck and stamped'},
        {src: IMG('viral-v1-6'), cap: 'Stronger line in a callout'},
        {src: IMG('viral-v1-7'), cap: 'About page chips crossed out'},
        {src: IMG('viral-v1-8'), cap: 'Score 40 to 97, full screen'},
        {src: IMG('viral-v1-9'), cap: 'Result tiles with a sliding selector'},
        {src: IMG('viral-v1-10'), cap: 'Address box and 1 to 3 minutes'},
        {src: IMG('viral-v1-11'), cap: 'Call to action chip'},
      ],
      palette: [
        {name: 'Ink (black stage)', hex: '#0D0D0D'}, {name: 'Panel', hex: '#161618'}, {name: 'Paper (pale stage)', hex: '#ECEBE6'},
        {name: 'Accent pink', hex: '#F0287C'}, {name: 'Deep pink (on pale)', hex: '#B3124F'}, {name: 'Callout blue', hex: '#D6E4E8'},
        {name: 'Cream', hex: '#F6F3EA'}, {name: 'Mockup navy', hex: '#0F2A4A'}, {name: 'Mockup green', hex: '#12805C'},
      ],
      fonts: [
        {name: 'Space Grotesk 700', use: 'Headlines, captions, UI text', css: "font-family:'Space Grotesk';font-weight:700;letter-spacing:-.025em", sample: 'Nobody Visits Your Website'},
        {name: 'Instrument Serif italic', use: 'One accent word per headline and key caption words', css: "font-family:'Instrument Serif';font-style:italic;color:#F0287C;font-size:1.6rem", sample: 'Learn About You.'},
      ],
      sections: [
        {t: 'Layout', p: ['Vertical 9:16, **1080×1920**. Drafts at **940×1672, 24 fps**. Full quality only after you say **"final"**.', 'Two shots alternate every 3 to 8 seconds, switching on a spoken word with the next graphic already moving: a **full-frame face** with a slow punch-in, and a **split** with header, graphic and captions on top.', '**Speaker box:** wide rounded box (1000×620) near the bottom with a soft outline. A transparent cut-out of her sits on top, so **her head and hair pop above the box** over the graphics. She bounces up each time a split scene starts.', 'Chin stays above y 1455. Only her torso runs into the bottom 23%, and no text goes there.', '**Full-screen exception:** a big number moment (the 40 to 97 score) drops the box, scales the graphics up and moves the captions lower.', 'Hook: headline and a flip card ("About Me." turns into "About You.") on screen from frame 1. No intro.']},
        {t: 'Look', p: ['Two stages: **black** (#0D0D0D) for ideas and **pale grid paper** (#ECEBE6) for steps and data.', '**Both stages move:** the black one has a faint white grid that drifts up, a soft pink glow that travels across, and a few grid cells that pulse. The pale grid drifts slowly.', 'Headline in bold Space Grotesk with **one accent word in pink italic serif**.', 'Pink is the only accent. Callout cards are pale blue with a pink bar on the left. Result tiles are dark with green, red, amber and grey numbers.', 'Small items stay big enough for a phone: titles such as "About Me." sit on one line, pills and nav text are sized up.']},
        {t: 'Website mockups', p: ['The explanation plays on a **generic business website**, for example a lender: browser frame, nav bar, hero headline, button and a picture block.', 'The logo is a **text-free symbol** (navy disc, white rising chevron, small green coin). No logotype, no people or profile placeholder images, no company name.', 'On the page: the I / we / my / our words highlight and fill **three tally bars**, a weak line is typed, struck out and stamped "weak", the stronger line appears in a callout, and the About page chips cross out.', 'Every card **pops in with a bounce, then zooms 5% slowly**, so nothing sits still.']},
        {t: 'Other graphics', p: ['**Two white ring cards** (before and after) count up to a score, with a burst and a ding on 97.', 'Dark **result tiles** with a sliding selector that dims the others, and a pale blue pill for each point.', 'A typed address box, a "check it" button, then "1–3 min".', 'The call to action is a pink chip: **"Comment RANKER"**, with the line "to get the checker" under it.']},
        {t: 'Captions', p: ['One word at a time, bold white about 78px with a **heavy dark outline** so it reads on both stages.', 'Key words (you, your, them, weak, score, checker, 40, 97, minutes) switch to pink italic serif.', 'They sit just above the speaker box, and drop lower in full-screen scenes.']},
        {t: 'Pace', p: ['Cut every pause longer than about 0.25 s.', 'Let a key number breathe: a **0.75 s pause** was inserted after "97" so the reveal does not feel rushed. Everything after it shifts later.', 'Never a dead frame: something new on screen every 2 to 3 seconds.']},
        {t: 'Sound', p: ['Voice first, raised to about **-16 LUFS**. Remove "ah / uh" and the breath and mouth blips in the quiet gaps between words.', '**Mouse click** from your own file (alternate clicks pitched up about 4%). **Typing** cut from your typing recording, one piece per typed line. **Music** is Soft Presentation, very low (about 24 LU under the voice).', 'The other effects (ding, ping, soft thump, counter) are very low too. **No whooshes.**', 'Overall mix about -16 LUFS with peaks near -1 dBFS.']},
        {t: 'Companion webpage', p: ['A matching one-page website (\`site/ranker/index.html\`) uses the same fonts, colours, callouts, tally bars and ring cards, and the same flip card in its hero.']},
      ],
      notes: [
        'The draft video itself is not uploaded to this page. It is in \`outbox/avatar-video/avatar-viral-v1-2026-11-12-v8-940p.mp4\`.',
        'The example numbers on the website mockup (22 / 16 / 3) are illustrative, not real data.',
      ],
      build: [
        'Transcribe the voiceover for word times (\`node tools/transcribe.mjs\`), then cut silences and mistakes.',
        'Cut the speaker out with \`tools/.venv-matte/Scripts/python.exe tools/matte/matte.py <clip> assets/cutout.webm --crop 420,0,1200,1080\`.',
        'In the project, edit \`assets/index.tpl\` (layout, graphics, timeline) and \`build.mjs\` (words, sound cues); run \`node build.mjs\`. Add your sound files, set their levels and the music under the voice.',
        'Check with still frames first (\`npx hyperframes snapshot\`), not a video render. Show them and wait.',
        'Render a draft (\`npx hyperframes render --quality draft --fps 24\`), scale to 940×1672, copy to \`outbox/\`, wait for notes. Render final only on "final".',
      ],
      files: [
        ['my-style-presets/talking-head-edits/split-card-reels/viral-style-v1.md', 'The saved style (this page)'],
        ['my-style-presets/talking-head-edits/split-card-reels/Split-Card-Reels_reference-analysis.md', 'The study of the four reels'],
        ['kit/video-projects/avatar-viral-v1-2026-11-12/', 'The working project: assets/index.tpl, build.mjs, assets, renders'],
        ['outbox/avatar-video/avatar-viral-v1-2026-11-12-v8-940p.mp4', 'The latest draft'],
        ['site/ranker/index.html', 'The companion one-page website'],
        ['my-rules.md', 'The lasting rules from your notes (mockups, sizes, sound, no ah)'],
      ],
      guides: [
        {label: 'Read the style guide', path: 'my-style-presets/talking-head-edits/split-card-reels/viral-style-v1.md'},
        {label: 'Read the reel study', path: 'my-style-presets/talking-head-edits/split-card-reels/Split-Card-Reels_reference-analysis.md'},
      ],
      session: 'Session "Hype Cam": study of four reels, the test video and the companion webpage.',
    },

`;
s = s.slice(0, a) + entry + s.slice(b);

// library table row
const rowRe = /    \{style: 'Punch-In \+ Split', id: 'vertical01',\n.*\n/;
if (!rowRe.test(s)) throw new Error('library row not found');
s = s.replace(rowRe, `    {style: 'Hype Cam', id: 'vertical01',\n      group: 'Talking-head edits', aka: 'Split-Card Reels', file: 'my-style-presets/talking-head-edits/split-card-reels/viral-style-v1.md', what: 'Head pop-out box, website mockups, animated black and pale grids, one pink accent'},\n`);
s = s.replace('(Kinetic Type, Pastel Punch, Punch-In + Split…)', '(Kinetic Type, Pastel Punch, Hype Cam…)');
fs.writeFileSync('data.js', s);
console.log('data.js updated');
