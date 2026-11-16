# My style: Explainer Video (faceless, navy glow and white cards)

Recreated from a Facebook reel (an AI-employees explainer) and approved as draft v3 of `fb-reel-recreate`. The code is `remotion/src/fbreel/FbReel.tsx`, so hex values and sizes here are exact. Use it for faceless horizontal explainers with a voiceover: one idea per graphic, mock app windows, counters and diagrams.

- Format: horizontal 16:9, 1920x1080 at 30 fps. Drafts render at 1440x810 (`--scale=0.75`).
- Faceless: no presenter. Where the reference cut to the speaker, use B-roll (AI-generated clips in the same navy and cyan grade, no faces, no text) with a big word-by-word caption bottom-left.
- Rhythm: a new graphic on every spoken idea, often every 1 to 2 seconds in lists (one scene per list item), 3 to 6 seconds for explanations. About 1 B-roll shot for every 5 graphics.
- Two stages, alternating:
  - **Dark:** navy #070C3A with a big cobalt glow low in the centre (#2D52E0 → #1A2C9A → #0B1456), plus a faint violet glow top-right. The glow drifts slowly sideways.
  - **Light:** soft blue-grey #E9EDF7 (never pure white) with a mint glow top-left and a lavender glow bottom-right.
- Typography: Inter only. Headlines 84 to 96px Bold 700, centred near the top (y 120), tight letter spacing (-2.5%). Big statements (Exponential, 3%, the ending) 130 to 340px ExtraBold 800.
- Accent words: a gradient fill on one or two key words. Dark stage: teal #6FF0D9 → periwinkle #8FA2FF. Light stage: blue #3B5BF0 → violet #6A5CF0. Ink on light: #0F1648.
- Word reveal: each headline word appears on the exact spoken word (word timestamps from the voiceover), fading up 22px from an 8px blur in 0.3s.
- Building blocks:
  - **Mock app window:** white card, 24px radius, traffic-light dots, small grey title (schedule, AI editor, website, market chart, competitor table, ads manager, chat vs search, email composer). On dark stages the window is translucent white (9%).
  - **Avatar row:** round blue-gradient person icons with labels; robots appear under each for "their own AI employees".
  - **Robot tiles:** white rounded squares with a navy-and-cyan robot icon, numbered badges for "one hire at a time".
  - **Counters:** stat cards counting up, driven by one smooth eased value (never stepped), tabular figures.
  - **Diagrams:** trigger → robot → task pills with ticks (arrows draw themselves); a glowing cyan brain with orbiting chips and a level counter; a strike-through list that turns "Automated ✓"; a timer ring.
- Contrast on light stages: cards get a 2px #C3CCEE border and a deep two-layer shadow (0 34px 80px rgba(20,30,110,.30) plus 0 8px 20px rgba(20,30,110,.14)). Never white cards on white.
- Motion: cards pop in on their word (y 34, scale 0.9, back-out ease, 0.4s). Lines draw in. Nothing exits early.
- Transitions: cross-dissolve with blur and scale (in: blur 12px and scale 1.05 over 0.3s; out: over 0.25s). No hard cuts, no whooshes.
- B-roll: slow push-in, dark gradient at the bottom, caption Inter ExtraBold 92px bottom-left. Loop any clip shorter than its scene so nothing freezes.
- Ending: a generic closing line on the dark stage over a faint looping B-roll; no call to action unless asked.
- Sound: voice first (Krista Mashore, ElevenLabs, speed 0.95). A subtle upbeat corporate music bed at 12% with fade in and out. ElevenLabs effects: soft click on each scene change and card pop, clean high-tech ding on success moments, soft deep keyboard under typing, soft ticks under counters. No whooshes. Normalise to about -14 LUFS.
