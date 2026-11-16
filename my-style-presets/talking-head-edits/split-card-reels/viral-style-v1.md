# Viral Style v1: head pop-out explainer with website mockups

Studied from four short reels (Desire Hook Method, Claude YouTube skills, Sandcastles MCP, Instagram algorithm), then built and tested on the "Nobody visits your website to learn about you" post (2026-11-12). Study notes: `Split-Card-Reels_reference-analysis.md`. Say **"use Viral Style v1"**. Rules in `my-rules.md` still win.

Working project: `kit/video-projects/avatar-viral-v1-2026-11-12/` (`assets/index.tpl` is the template, `build.mjs` writes `index.html`).

## Layout
- Format: vertical 9:16, 1080x1920, 30 fps. Drafts are 940x1672 at 24 fps; full quality only after "final".
- Two shots that alternate every 3 to 8 seconds, switching on a spoken word with the next graphic already moving:
  - **Full-frame face:** tight vertical crop with a slow punch-in (1.00 to 1.12).
  - **Split:** header at the top (y 205), the graphic below it (content scaled 0.70, about y 385 to 900), captions just above the speaker box (y 915), then the speaker box.
- **Speaker box:** a wide rounded box (1000x620 at y 1120) with a soft white outline and shadow. A transparent cut-out of her sits on top, unclipped, so her head and hair pop above the box over the graphics. She bounces up each time a split scene starts. Chin stays above y 1455; only her torso runs into the bottom 23%, with no text there.
- **Full-screen exception:** a key number moment (the 40 to 97 score) drops the speaker box, scales the graphics to full size and moves the captions down to y 1180.
- Hook: headline and a flip card ("About Me." turns into "About You.") on screen from frame 1. No intro.

## Look
- Two stages: **black** (#0D0D0D) for ideas, **pale grid paper** (#ECEBE6, faint 64 px grid) for steps and data.
- Both stages move: the black one has a faint white grid that drifts up, a soft pink glow that travels across, and a few grid cells that pulse. The pale grid drifts slowly.
- Headline: bold Space Grotesk, one accent word in pink italic Instrument Serif ("Learn About *You.*").
- Pink #F0287C is the only accent (deep pink #B3124F on pale scenes). Callout cards are pale blue (#D6E4E8) with a pink bar on the left. Result tiles are dark with green, red, amber and grey numbers.
- Small items stay big enough to read on a phone: titles like "About Me." on one line, pills and nav text sized up.

## Website mockups (the explainer lives on a real-looking page)
- A **generic business website**, for example a lender: browser frame, nav bar, hero with a headline, a button and a picture block.
- The logo is a **text-free symbol** (navy disc, white rising chevron, small green coin dot). No logotype, no people or profile placeholder images, no company name.
- The explanation plays on the page: the I / we / my / our words highlight and fill three tally bars, a weak line is typed, struck out and stamped "weak", the stronger line appears in a callout, the About page chips cross out.
- Every card **pops in with a bounce, then zooms 5% slowly** so nothing sits still.
- Other graphics: two white ring cards (before and after) for scores, dark tiles with a sliding selector, a typed address box, and the call to action as a pink chip ("Comment RANKER").

## Captions
- One word at a time, bold white about 78 px with a heavy dark outline so it reads on both stages. Key words switch to pink italic serif.
- Sit just above the speaker box; lower in full-screen scenes.

## Pace
- Cut every pause longer than about 0.25 s. Let a big number breathe: a 0.75 s pause was inserted after "97" so the reveal does not feel rushed.
- Never a dead frame: something new on screen every 2 to 3 seconds.

## Sound
- Voice first, raised to about -16 LUFS. Remove "ah / uh" and the breath and mouth blips in the quiet gaps between words.
- **Mouse click** from `Mouse Click 1 Single.wav` (alternate clicks pitched up about 4%). **Typing** cut from `Typing.mp3`, one piece per typed line. **Music** `Soft Presentation.wav`, very low (about 24 LU under the voice).
- Other effects (ding, ping, soft thump, counter) very low as well. No whooshes. Overall mix about -16 LUFS with peaks near -1 dBFS.

## Companion page
A matching one-page website (`site/ranker/index.html`) uses the same fonts, colours, callouts, tally bars and ring cards.
