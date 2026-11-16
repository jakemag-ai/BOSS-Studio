# Carousel Style V2

Formerly called **Pink and Cream Reel Recreate**. Both names work. Sibling of **Carousel Style V1** (the beige, navy and hot-pink carousel look): V2 is the cleaner, lighter version on a warm cream canvas, built in HyperFrames (HTML + GSAP).

Say "use Carousel Style V2" (or "recreate this reel") and the editor builds in this look.

Source: the "BOSS audit" reel recreated on 2026-11-11 (`kit/video-projects/reel-recreate-2026-11-11`, drafts v1 to v3, 37.7 s). Colours below are the ones in that project's `DESIGN.md` and `index.html`.

## Format
- Vertical 9:16, 1080x1920. Length follows the voiceover (first take 37.7 s).
- Drafts small, full resolution only when I say "final".
- Safe zone: top bar and captions own the edges. Nothing under the caption pill (y > 1480). Scene content starts about 150px from the top with 80px side margins, all text left-aligned inside the margins except the huge numbers and labels, which are centred.
- No hard cuts without easing, no flashing, no dark backgrounds.

## Colour
- Cream background `#F6F1E9`, plus a soft pink glow (radial gradients of `#F7C6DC` top right and `#FBE0EC` lower left).
- Near-black text `#141414`.
- Hot pink accent `#E6007E`: one accent word per title, numbers, pills, progress bar, highlight boxes.
- Soft pink `#F7C6DC` / `#F7A8CE` for glow and inactive bars. Muted grey `#7A7270` for small labels.
- Cards white `#FFFFFF`. Green `#1FAE5B` only for ticks and "approved".

## Type
- Bold geometric sans (Inter or Arial, weight 900). Titles 112 to 130px, line height 1.02, tight tracking (-4px). One word or phrase per title in pink.
- Georgia italic in pink for soft lead-ins ("Here's how it started.", "My AI team."), 56px or 104px for big lead-ins.
- Consolas caps, wide tracking, for small labels and dates ("LINKEDIN · BOSS AUDIT SCORE", "OCT 29").

## Layout and graphics
- One idea per screen. Title, then a card, list, chart or screenshot under it.
- White rounded cards (34px radius) with a soft pink-tinted shadow. Numbered step cards use a pink circle with a white number.
- Real screenshots in rounded cards with the same shadow, slightly rotated (-3 / +3 degrees) when two are shown together. A tall screenshot can be cropped inside a rounded window.
- A pink highlight box (6px border, soft halo) appears over the part of a screenshot being talked about.
- Pills in solid pink for lists of items (Name, Bio, Link, Pins, Top posts). Dark pills for dates and "in 9 days" chips, a pink pill for the key takeaway.
- Huge pink numbers (360 to 560px) for scores, with a small mono label above and a pill below. Bar charts with soft-pink bars and the winning bar in hot pink.
- Before and after: two screenshots side by side with dated pills (OCT 29 grey, NOV 7 pink).
- Green tick badge with "Approved by us" for the human-approval beat.
- Closing: a big title with one pink word and a short pink underline bar.
- A thin pink progress bar across the top (10px) that grows over the whole video.

## Captions
- Word by word in a dark pill (`#141414`, 30px radius), lower third (top 1470px), white text 60 to 70px weight 900.
- The word being spoken turns pink, the rest stay white. Four words or fewer per pill, long phrases size down so they never wrap.

## Motion
- Entrances: power2.out or power3.out, 0.2 to 0.6 s. A bouncy `back.out(2)` for badges and numbers. Exits power1.in.
- Scenes overlap about 0.4 s so there is no gap and no hard cut.
- Something new on screen every 3 to 4 seconds, timed to word timestamps.

## Build it
1. Transcribe the voice for word times (`node tools/transcribe.mjs`).
2. Copy `kit/video-projects/reel-recreate-2026-11-11/` as the starting point; change the scenes, screenshots and caption groups.
3. Draft small, check frames at every scene (nothing under y 1480), add the final render only on "final".

## Where things live
- Working project: `kit/video-projects/reel-recreate-2026-11-11/` (`DESIGN.md`, `index.html`, `assets/`, `renders/draft-v1…v3.mp4`).
- Drafts: `outbox/reel-recreate-2026-11-11-v1…v3.mp4`.
- Original reel (reference only): `inbox/reel-1926961041604959/source.mp4`.

## Notes
- The Instagram score values (48, 60, 75) were rebuilt from the original reel, not exact.
- Hex values come from the project files, not eyeballed.
