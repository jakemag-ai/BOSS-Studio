# Dark UI Launch: study of a product-launch motion ad (CodeRabbit Triage)

Source: facebook.com/share/v/1A2J4MfMf5 (16:9, 1920x1080, 29.97 fps, 69 s). Silent-looking pure motion graphics: no talking head, no footage.

Method: 1 frame per 2 s contact sheets (35 frames). Scene-cut detection found zero hard cuts, so the whole video is one continuous animated canvas. I cannot hear the audio, so music and SFX are NOT confirmed.

## What it is

A launch ad built only from kinetic type + animated product UI on a near-black canvas. One idea per beat, told in a short sentence that types or fades in word by word, then the UI it refers to appears.

Story arc (the script is the structure):
1. Problem: "AI agents write more / than any team can review". Code snippets and "Agent" tags float in the dark.
2. Pain: a Slack ping "Hey, can you review my PR?" then a Slack channel of people asking for reviews.
3. Zoom into a PR list (GitHub). Camera tilts in 3D, rows flow past.
4. Insight: "...that matters / is rarely the one". A bracketed focus box (orange corner marks) isolates one row, then the row highlights.
5. Product reveal: logo lock-up "CodeRabbit Triage" (the second word fades in dimmer).
6. Product UI: a board of cards (Now / Next columns), a "Display" button clicked by a cursor, then property chips (Summary, Last activity, Change type, Low security risk, High blast radius, Bugfix, Issue severity, Reviewers).
7. Chips collapse into 3 signals labelled **URGENCY, RECENCY, MOMENTUM** (green mono caps on dark green tiles).
8. Full board lights up with many cards.
9. "Triage evaluates / every change" (orange accent word), then one card zooms in: P1 badge, title, tags (Refactor, High security risk), meta, +2,332 -12,454 diff counts.
10. Code cards scatter in space, one "query" snippet comes to focus. "protecting your codebase", then a lock icon + "the codebase".
11. Status pills: "Ready for review" (cursor), "Deployed" (green check).
12. Glitch / pixel red squares and "Rt" tile, then blurred logo resolves. End card: "Available now" with the rabbit mark.

## Look

- Canvas: near-black (#08090B-ish) with a faint dot/grid pattern and a warm orange radial glow (#C85A1E to #E8651A) bleeding from the lower edge or behind the focused object. Vignette.
- Accent colours: orange (hero, key words like "matters", "every change", logo), green (positive / signal labels, "Deployed"), red only in the glitch beat.
- Type: clean geometric sans, medium to bold, white. Key word swapped to the orange accent. A small italic-ish contrast is NOT used. Mono caps for system labels (URGENCY, RECENCY, MOMENTUM, code).
- Text is large, 1 to 3 lines, left, centre or offset (the "that matters / the most" and "is rarely the / one" lines are offset to opposite corners around the focus box).
- UI cards: dark glass panels, 1px light border, rounded 8 to 12 px, soft orange outer glow on the active one, others dimmed to about 30%.
- Cursor: pixel-art arrow with a small tag ("Agent 2", click ripple). Used to trigger the next UI state.
- Brand-true mock UIs (Slack, GitHub PR list, product board) built from real screenshots or faithful rebuilds, shown tiny on dark, then enlarged.

## Motion language

- Words appear one at a time, fade + slight blur-to-sharp, sometimes with the previous word dimming (so the line reads like a progressive highlight).
- Camera is always moving: slow push-in, 3D tilt/perspective on UI planes, rack focus (blur to sharp) between scenes.
- Transitions are zoom-throughs and dissolves into blur, never hard cuts. A scene's key object scales up to become the next scene's backdrop.
- Focus device: corner-bracket frame closes on an object, background dims, object lifts.
- Lists: rows stagger in with a short slide, active row gains glow and border while neighbours dim.
- Chips: pill labels pop in with overshoot, then regroup into 3 mono labels (consolidation beat).
- Floating field: many small code cards drift at different depths (parallax), one comes forward.
- Glitch beat: red pixel squares + stepped pixel text before the logo reveal.
- Pace: roughly one new idea every 3 to 4 s; text lines hold about 1.5 to 2 s.

## Hook and end

- Hook (first 3 s): no intro. Floating code on dark, "AI agents write more" fades in word by word. The problem is the hook.
- End: logo resolves from blur, "Available now" with the mark. No CTA text beyond that.

## Sound (measured only)

Not measured. Ask the user whether they hear music or whooshes, or have them supply files in `my-sounds/`.

## How to use this in bossstudio

- Fits **motion-graphics reels** as a *landscape product-launch* sibling of Type & Wipe, but without a speaker. It is closer to Clean Motion Explainer (YouTube) in pace.
- Rules I would add if approved:
  1. Dark canvas + one warm orange glow; orange for the single key word per line, green only for "success/positive".
  2. Word-by-word text with blur-to-sharp; one idea per 3 to 4 s.
  3. Never hard-cut: zoom-through or blur dissolve between scenes.
  4. Show the product UI small first, then enlarge into focus; dim everything else.
  5. Use a corner-bracket focus box for the "the one that matters" beat.
  6. Mono caps for system labels, three-signal consolidation beat.
  7. Pixel cursor with an agent tag to trigger UI state changes.
  8. End: logo from blur, then "Available now".
- Build in `remotion/` only when the user asks. Nothing built yet.
