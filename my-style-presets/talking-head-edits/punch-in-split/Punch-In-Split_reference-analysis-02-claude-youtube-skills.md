# Punch-In + Split: reference 02 ("Claude can now watch YouTube videos", facebook.com/reel/1036994846087576)

43.9 s, 1440x2560, 30 fps. Different creator from reference 01; same split + punch-in structure,
with a Claude-orange palette and a pixel mascot.

**How this was checked (2026-11-11):** whole video at 2 fps; every scene cut plus 12 other graphic
moves at 12 fps; word-level transcript; audio checked on stereo side, high band (>10 kHz) and
low band (<120 Hz). **[seen]** = confirmed in frames, **[measured]** = confirmed in audio data,
**[not confirmed]** = could not be verified.

## Structure
- **Split layout, about 85% of runtime [seen].** Near-black background with a faint dot grid. The
  graphic stage fills the top 55%, captions sit at about 52%, and the speaker window takes the
  bottom 30%. The window is wide, has square-ish corners, and never moves.
- **Punch-in layout [seen].** Only 3 times, each 1.2-2.5 s long: "watch any video just like a human"
  (13.9 s), "You would watch one... forget the video by Friday" (21.9 s), "YouTube is just the start"
  (37.1 s). It's a tight side-profile crop of the same take with no blur, and the camera holds still.
- **Overlays inside the punch-in [seen]** (new compared with reference 01): a "$100M Offers" YouTube
  thumbnail card pops onto his chest, and a YouTube logo pops in above the caption, then fades out.

## 1. Transitions
- **Layout changes are hard cuts [seen].** Just before the cut to the face, the graphic **dims to
  grey** over about 0.25 s (prompt card at 13.6 s, quote card at 37.0 s, prompt card with an RGB
  smear at 24.1 s).
- **Whip slide with heavy motion blur [seen]** between graphics: the prompt card whips off left
  (24.1 s), the email card whips off right while the next card whips in (31.6 s), and the YouTube
  thumbnail whips into the quote card (35.0 s).
- **3D tilt-and-blur swap [seen]:** the "Watching Youtube" title tilts back, blurs and drops out as
  the "3,265 Hours In Claude" block rises in (4.2 s); the reverse happens at 7.4 s.
- **Scale-from-icon [seen]:** the YouTube thumbnail grows out of a tiny red YouTube icon with
  motion blur (1.6-2.0 s).

## 2. Animations
- **Pixel mascot [seen]:** an orange pixel Claude critter stays on stage the whole time as a
  narrator. It bobs, walks, wears a pink brain on "smarter / its brain", wears headphones with
  pulsing sound bars on "podcasts", squints on the last line, and the SKILL.md file drops into it.
- **Typewriter [seen]:** the prompt box types "Install the skill" and "Watch this, learn what it
  teaches..."; the Gmail compose types "Following Up / Hi Jordan..."; "Comment" types in.
- **Sticker burst [seen]:** about 20 colorful course-title tags ("CLOSE ANY SALE", "COLD EMAIL",
  "EXCEL TRICKS"...) pop in as a grid on "dozens", then scatter and fall away (25.2-26.6 s).
- **Highlight sweep [seen]:** orange bars sweep across the lines of the Quote card.
- **Big number card [seen]:** "3,265" in an orange box with an outline that pulses on entry.

## 3. Call-outs
- **Title lockup [seen]:** "Claude *Learns* Skills / Watching Youtube". Learns is in orange serif
  italic, and the second line is bigger with an orange underline.
- **Stat card [seen]:** orange box with a huge number and a small label ("Hours In Claude").
- **CTA [seen]:** "Comment / Learn". The keyword sits in an orange pill in serif italic, and the
  mascot, SKILL.md file and prompt chip come back around it.
- No arrows, dotted lines or section tabs (unlike reference 01).

## 4. VFX
- Motion blur on every fast move; an RGB/ghost smear on one exit (24.1 s).
- Real UI mock-ups: Claude prompt box, GitHub link chip, Gmail compose, quote doc, podcast player,
  YouTube thumbnails.
- No glow, grain or shake.

## 5. Explainer and word sync
- Each graphic lands on its noun: "paste this link" -> GitHub chip; "drop in any YouTube video" ->
  thumbnail attaches to the prompt; "sales follow-ups" -> Gmail; "quotes" -> Quote doc;
  "podcasts" -> podcast player plus mascot in headphones **[seen]**.
- **Captions [seen]:** 2-3 word phrases in sentence case, white medium-weight sans (not bold
  caps), no highlight color. They sit at the same spot in both layouts.

## 6. Sound
- **The audio is fully mono [measured]** (stereo difference is digital silence), so added effects
  can't be separated from the voice.
- **No low booms or bass hits [measured]** (nothing in the <120 Hz band).
- **No speech gaps over 0.12 s [measured]:** pauses are fully cut out.
- **Whooshes or pops on the graphic moves [not confirmed]:** there are 42 high-frequency spikes, but
  every one falls on a word, so they are probably "s" sounds in the speech.
- **Music [not confirmed]:** none is audible in the data, and with no pauses there is no gap to measure.

## What's new compared with reference 01
A recurring mascot as narrator, overlays on the punch-in shot, the grey dim-out before cuts,
whip-blur swaps, a sticker burst, and a brand-color palette instead of black, red and white.
