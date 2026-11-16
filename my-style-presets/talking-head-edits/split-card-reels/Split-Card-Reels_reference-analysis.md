# Split-Card Reels: study of 4 Facebook reels (+ Clean Motion Explainer)

Sources (9:16, 720x1280, 44 to 101 s):
1. Desire Hook Method, facebook.com/reel/1911480050212333 (101 s)
2. Claude YouTube skills, facebook.com/reel/1036994846087576 (44 s)
3. Sandcastles MCP, facebook.com/reel/1426191802933842 (56 s)
4. Instagram algorithm, facebook.com/reel/2691525744652220 (97 s)
5. Clean Motion Explainer (youtube REAOFI534lk): already saved as `youtube-explainers/clean-motion-explainer/`. Not re-studied.

Method: 1 frame per second contact sheets, scene-cut count, loudness. Colours eyeballed. I cannot hear the audio, so music and sound effects are NOT confirmed (see Sound).

## The shared pattern (reels 1, 3, 4 are one creator system; reel 2 is the same layout in a different brand)

**Two-state layout that alternates:**
- A. Full-frame talking head. Vertical, tight, dark moody room, cap, soft rim lights. Slow punch-in feel. Used for hooks, opinions, emotional beats, and the CTA.
- B. Split frame. Graphic fills the top ~65%. The speaker sits in a small rounded-corner "picture-in-picture" strip at the bottom (about 85% width, 25% height) so he never disappears. Used for every explanation.
- The reel swaps A and B every 3 to 8 seconds. Cut rate is low (6 to 20 hard cuts per reel); most change is the graphic animating inside a state.

**Captions:** one word at a time, bold white sans, small (about 4% of height), centred, pinned just above the picture-in-picture strip in state B and at chest height in state A. No highlight box. Key word sometimes swaps to an italic serif ("rulesets", "consensus", "Hooks") or a colour (green "Eats"). Punctuation kept.

**Title bar (state B):** a small header at the top of each graphic section, bold sans + one italic serif accent word ("3 Elements Of A Hook / That Drives *More Sales*", "Claude *Learns* Skills", "Claude Just *Changed* Social Media Forever"). Key phrase sits on a solid red (or terracotta) label with a thin lighter underline. Header changes per section (Identity Callout, Desire Frame, Proof Anchor, Choose Your Priority).

**Colour systems (pick one per video):**
- Black + crimson red (#B3121A-ish) + white: reels 1, 4. Dark sections on near-black; light sections on pale grey grid paper (#EDEDEA with faint grid lines) for "data" ideas.
- Black + terracotta/orange (#D9775A) + cream: reel 2 (Claude brand). Pixel-art "Claude crab" mascot as a recurring character.
- Black + royal blue (#1F4FD8) accents for tool logos: reel 3.
- Dark/light alternation is deliberate: dark = concept, light = proof/data/UI.

**Graphics vocabulary:**
- Glassy dark UI cards with 1px light border, rounded corners, soft glow when "active" (reel 1 pills, reel 3 diagram frame).
- Stacked list pills: items dim to 30% except the one being discussed (focus-dimming).
- Mock UI: Claude chat box with typing text, phone mockup with Reels UI, profile cards, spreadsheet/doc thumbnails, email composer. Typing animates in sync with speech.
- Counters that roll up (23,295 to 152,317 reach; 345K to 543K followers; likes 97K to 317K). Numbers tick fast, ease out.
- Node diagrams: icon, dashed/curved connector lines that draw themselves, branches (Viewer, Painpoint, Desire; platforms into one hub).
- Orbit rings with dots and social icons rotating around a centre logo ("Content Director ... 24/7").
- Particle/dot fields (red dots, green "Connected" vs red "Un-connected" tags) for algorithm explanations.
- Red label chips that slide in with a left wipe, then text types in inside them ("10 Principles For Content", "Better The Proof And More Specific...").
- Circular red burst/radar expanding from a point as a punctuation hit (reel 1 Proof Anchor "validate").

**Animation language:**
- Text: letter-by-letter type-on inside chips, then blur-to-sharp settle. Headers drop in with a short slide + fade.
- Objects: scale-up with ease-out + slight overshoot, then drift. Cards slide in from the side, push neighbours.
- Cursor/hand pointer taps UI to trigger the next state.
- Camera: slow zoom or pan inside a graphic (e.g., zooming into a script doc to highlight a line in red).
- Highlights: red underline sweeps across text; yellow underline for emphasis in doc mocks.
- Transitions: mostly *no* named transition. State A to B is a hard cut timed on a word, with the graphic already animating in. Graphic to graphic inside B is a push/slide or fade-through-black. Occasional whip with motion blur when swapping the phone mockup. Blur-dissolve on mockup swaps (reel 3).

**Hook (first 3 s):**
- Reel 1: starts directly in state B with the title bar and three pills already on screen. Speaker already talking. No intro.
- Reel 2: header + mascot + icon animation instantly, claims a result ("After 3,265 hours" counter, "30 seconds").
- Reel 3: pale light background, bold headline, profile cards animating. Then cut to talking head.
- Reel 4: pale background, photo card, then counters racing up in a red card, headline "Hack The Algorithm In 2026".
- Pattern: the visible promise is a title/number, delivered over a graphic within 1 second.

**CTA (last 6 to 10 s):** speaker line, "Comment 'WORD' to get X". Full-width screen: "Comment" in white bold with the keyword in italic serif or a red/terracotta chip, a visual of the freebie (stacked docs, a 10-item list, a database screenshot) behind/below, and the picture-in-picture still at the bottom. Last beat is often back to full-frame with the keyword as a big italic serif caption.

**Pace:** about one idea per 5 to 8 s; a new visual or a state change every 2 to 3 s. Words land on the beat of graphic events. No dead air: zero silent gaps over 0.3 s, so speech is cut tight.

**Colour grade of the footage:** dark, warm skin, teal/cyan rim light in the background, blacks lifted slightly, vignette. Reel 2's speaker is in a different room (beige, jacket), same layout.

**Sound (measured only):** integrated loudness -14.6, -22.1, -14.4, -17.5 LUFS. Reel 2 is much quieter than the others. Peaks hit 0 dBFS in reels 1, 3 and 4 (limited hard). Very stable level (LRA 2.3 to 4.1 LU), so voice is compressed. No silences. I could not tell music or SFX from the numbers, so: ask the user to say whether they hear music/whooshes, or have them supply files into `my-sounds/`.

## How to use this in bossstudio

Mapping to existing styles: this is an extension of **Punch-In + Split** (talking-head-edits) with more UI mock-ups and the pale-grid "proof" scenes. Good fit for the user's Remotion folder.

Rules I would add if approved:
1. Alternate full-frame head and split (graphic top, head strip bottom) every 3 to 8 s.
2. One-word captions above the head strip; italic serif for key word.
3. Section header bar with red label + italic accent word.
4. Use dark scenes for concepts, pale grid scenes for data/proof.
5. Roll-up number counters for any stat.
6. Type-on chips for names and lists; dim non-active list items.
7. CTA: "Comment 'WORD'" card in last 8 s.
8. Build graphics in `remotion/` first; no paid assets.
