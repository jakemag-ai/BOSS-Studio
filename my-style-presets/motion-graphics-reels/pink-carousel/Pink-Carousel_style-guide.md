# Pink Carousel

Formerly called **BOSS Motion Graphics - 02**. Both the new and the old names work.

A preset made from the "How I'd Build My First AI Team" Reel (2026-11-11). Say "use Pink Carousel" (or "use BOSS Motion Graphics - 02") and the editor builds in this look. Template: `remotion/src/aiteam/AiTeam.tsx` (composition `AiTeam`).

## Format
- Vertical 9:16, 1080x1920, 30 fps final. Drafts at half size (540x960).
- Length follows the voiceover. The first take was 2:05.
- Safe zone: nothing in the lowest 23% (about 440px) and the top ~10% stays clear. All text centred in the frame.
- No tag bars, no "1 / 8" counters, no tiny footnotes.

## Colour (from the carousel)
- Background: warm beige `#E7DCC5`
- Text: near-black navy `#050F18`
- Accent: hot pink `#EE1A7B` for the key word of every headline, big numbers and pills
- Cards: white `#FFFFFF` with teal outline `#8FB8B6`, teal `#0E8A86`, green checks `#22C55E`

## Type
- Space Grotesk bold for everything. Headlines 118 to 130px, tight tracking, 2 lines, key words in pink.
- Huge step numbers ("01" to "05") in pink, about 250px, above each headline.
- Cormorant Garamond only if names/serif labels are needed.

## Layout and graphics
- One idea per screen. Number, headline, then a card or list under it.
- Real screenshots from the source (cards cropped from the carousel) in white rounded cards with a soft shadow.
- Chips (icon plus label) for lists, pink pill for the takeaway, green check badges when an item is done.
- Pink highlighter sweeps on key phrases as they are spoken, then a hand-drawn pink loop (animated stroke) around the important part.
- Counters that tick up for numbers, strike-through for wrong numbers, then the right one slams in.
- Closing card: pink block "Comment ..." with a pulse, handle small under it.

## Motion (never a dead frame)
- Words rise in one by one, cards pop in with a spring, 0.3s crossfade between scenes with a slow push-in.
- Every card keeps a gentle float after it lands. Soft pink and teal blobs drift in the background.
- Something new on screen at least every 3 to 4 seconds, timed to the voiceover's word timestamps. If a stretch has nothing, add an example card, check badge or text swap that matches what is being said.

## Sound
- Voice first (Krista Mashore, ElevenLabs, speed 0.95, short pauses between sections).
- Upbeat, subtle instrumental bed at about 17% volume, 2s fade in, 3s fade out.
- Riser at the very start into the first hit. Whoosh on every scene change, pop on every new card or number, ding on checks, tick on counters, scribble on the hand-drawn loop, hit on the big reveal and the final call to action.

## Pipeline order
1. Write the script, review, then make it read fluently out loud (about 150 wpm plus pauses, check the real voiceover length).
2. Design graphics first, no video render.
3. When the script is final, voiceover with ElevenLabs, export mp3, transcribe for word timings.
4. Build scenes in Remotion against those timings, add examples and B-roll, check for dead frames.
5. Add music and sound effects. Render drafts at half size, full resolution only on "final".
