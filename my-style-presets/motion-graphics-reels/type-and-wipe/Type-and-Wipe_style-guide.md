# Type & Wipe  +  Head Pop-Out

Formerly called **BOSS Motion Graphics - 01** (and **BOSS Motion Graphics - 01 + Split Cutout**). Both the new and the old names work.

A saved style: how the video is edited, how the motion graphics look and move, how it sounds, and how the output is delivered.
Built from the "Why Reviews Matter" Reels (2026-11-11). When the user says **"use Type & Wipe"** (or "use BOSS Motion Graphics - 01"), follow sections 1 to 6. When they say **"use Type & Wipe + Head Pop-Out"** (or "use BOSS Motion Graphics - 01 + Split Cutout", "with the presenter split"), also use section 7: the presenter split with the head pop-out, used in some scenes only.
The rules in `my-rules.md` still win if they disagree with anything here.

---

## 1. Output style

- **Format:** vertical 9:16, 1080x1920, 30 fps. One idea per video, about 50 seconds.
- **Built with:** Remotion (`remotion/`) for the visuals and audio mix, BOSS for the style, rules, voice, transcripts and outbox.
- **Drafts first:** `npx remotion render src/index.ts <CompositionId> out/<name>.mp4 --scale=0.9 --crf=24` gives 972x1728 (Remotion needs whole-pixel sizes, so this is the nearest to the 940p draft rule).
- **Final:** full resolution (`--scale=1`, 1080x1920 at 30 fps) only after the user approves and says "final".
- **Files go to `outbox/`:** `<slug>-remotion-reels-<date>-vN-<what changed>-draft.mp4`, then `<slug>-...-final.mp4`. Open every draft for the user.
- **Safe area (rule):** the top ~10% (192px) and the bottom ~23% (440px) stay empty, so the app's buttons and caption never cover anything. The slow zoom-in grows the picture, so design inside about y=225 to y=1455 and it still clears at full zoom.
- **Text is always centred.** No slide-style labels: no top tag bar, no "01 / 04" counters, no tiny footnotes.
- **Check every draft before showing it:** typecheck, render, pull frames at every section (with the safe-area lines drawn), transcribe the rendered video to confirm each voice line lands in its scene, and check the peak level stays below about -3 dB.
- Never post or upload. Nothing here is committed.

## 2. Editing style

- **Structure:** hook (three short lines typed one after another) -> title card -> four sections, one idea each -> ending (two-line message, then the call to action).
- **Headlines follow a pattern:** "they <verb> <accent word>" (they build *trust*, they guide *decisions*, they help you *improve*, they show *real people*). The accent word is italic serif in orange-red, once per title.
- **Voice first:** write the script to be spoken, not read. One flowing, conversational take per section (7 takes), with contractions and a little "So..." spontaneity.
- **Voice:** Krista Mashore in ElevenLabs (voice id `K1rJ5ppbOyM2ZH3CxP50`), model default, stability 0.4, similarity 0.8, style 0.3.
- **Timing comes from the words:** transcribe the takes (`node tools/transcribe.mjs`) to get word times, then place the animation on the matching word (for example "wins" lands on the cursor click, "fix it" lands as that pill appears).
- **No hard cuts.** Every section change goes through an orange wipe. Each section is about 8 seconds, and the ending holds about 5 seconds.
- **Presenter:** her HeyGen avatar appears big at the opening and the ending only, in a ring circle (720px, orange ring) with the text underneath. The middle sections are full-frame graphics with no head bubble. Her video is muted; the mixed audio is used.
- **Lighting on the presenter:** brightness 1.14, contrast 1.08, saturation 1.12, a soft warm key light from the upper left (soft-light), and a gentle vignette so the face is the brightest part.
- **No made-up statistics.** Examples (cafés, reviews) are fictional.

## 3. Motion graphics

- **Look:** warm off-white `#FBFAF8`, near-black `#14110F`, one loud accent orange-red `#DC2E0A`, muted `#6B645C`, green `#1E9E5A` for ticks only.
- **Fonts:** Montserrat 800 for titles (lowercase, tight), Playfair Display italic 700 for the accent word, JetBrains Mono for small caps labels. All loaded with `@remotion/google-fonts`.
- **Big, phone-sized text:** headlines 124px, captions 40 to 58px, cards 40px+. If it needs squinting it is too small.
- **Bounce and zoom:** everything enters with spring bounce (back/elastic feel). Every scene also pushes in slowly, 1.00 to 1.04.
- **Typewriter variations** (`Typed` in `kit.tsx`), a different one per text:
  - `caret`: letters appear one by one with a blinking orange line cursor.
  - `block`: letters appear with a solid block cursor running ahead.
  - `word`: words pop in one at a time.
  - `fall`: letters drop in like keystrokes.
- **Orange wipes:** a full-bleed orange-red circle with halftone dots grows over the scene and shows a HUGE one-word slate (trust, decide, improve, real people, your turn). Words fill most of the width: 250 to 400px.
- **Graphic vocabulary:** white cards with a thin coloured top bar and soft shadow, rating stars that pop in (partial stars supported), counters that count up, a list that re-sorts itself with a cursor click and a "chosen" chip, a loop ring that draws itself with pills at each step, a dot grid (people) that fills from the centre with starred dots, and a closing stars-and-headline card.

## 4. Sound design

- **Mix:** voice 1.0, music bed 0.16 (fades in and out), sound effects 0.12 to 0.5, so the voice always stays clear.
- **Music:** an instrumental bed (warm, about 100 BPM, no vocals), `bed-faded.mp3`.
- **Sound effects** are original, generated by `make-sfx.mjs` (free, no licensing). They are saved to `my-sounds/sfx/boss01-*.wav`:
  - `type-run`: keyboard ticks under every typed text (sped up or slowed to match the typing speed).
  - `count-run`: fast light ticks while a number counts up.
  - `click`: the mouse click. `ping`, `ding`, `chime-success`, `coin`: pings and dings for success moments.
  - `stars-up-10/12/14`: five rising pings to match star pops at three speeds.
  - `bonk`: the low "no" on the skip chip. `thump`: soft impact on each hook word.
  - `swish`, `slide`: cards and lists moving. `pop-cascade`: the dots appearing.
  - `riser`: 1.5 seconds rising into every orange wipe and into the title and the call to action. `ring-sweep`: a quiet 4.6 second sweep under the loop drawing.
  - plus the originals `whoosh`, `hit`, `pop` from `my-sounds/sfx`.
- **Placement rule:** a riser leads into every wipe, a whoosh plays on the wipe, typing ticks play under every typed text, and every on-screen "success" (stars, chosen, trusted, +1) gets a ping or ding on the exact frame.

## 5. Files

- `remotion/src/reviews/kit.tsx`: the toolkit (colours, fonts, springs, `Typed`, `Head`, `Stars`, `Scene`, zoom push).
- `remotion/src/reviews/Reels.tsx`: the finished example (all scenes, wipes, avatar, sound design lists `TYPING`, `WORD_POPS`, `buildFx`).
- `my-style-presets/motion-graphics-reels/type-and-wipe/source/`: a saved snapshot of both files, so they can be restored if the live ones change.
- `my-style-presets/motion-graphics-reels/type-and-wipe/make-sfx.mjs`: re-creates the sound effects. Run `node my-style-presets/motion-graphics-reels/type-and-wipe/make-sfx.mjs`.
- `remotion/public/reviews/`: the voice takes, music, sound effects and avatar video for the reviews video (private, git-ignored).

## 6. Making a new video in this style

1. Write the spoken script as one flowing take per section, and pick the one idea per section.
2. Record the takes (ElevenLabs, voice above), transcribe them for word times, and write down the second each key word is spoken.
3. Copy `remotion/src/reviews/` to a new folder, change the text, numbers and timings, and register a new composition in `Root.tsx`.
4. Pick a different typewriter variation per headline, and re-time the `TYPING` and `buildFx` lists to the new script.
5. Bring in the presenter video for the opening and ending only, with the lighting above.
6. Render a draft, run the checks in section 1, send it to `outbox/`, and wait for notes. Render final only when the user says so.

## 7. Split Cutout: presenter at the bottom, head popping out over the graphics (added 2026-11-11)

A variation for videos that have a talking-head clip. It is used **only in some scenes** (light visuals). Dense graphics scenes (big cards, rings, huge numbers) stay full screen, so the video alternates between the two.

**What it looks like**
- The graphics sit in the top part (about y 245 to 1040). The presenter is in a rounded video box at the bottom (900 wide, rounded corners 44, soft shadow).
- A transparent cut-out of the same clip is layered on top and is not clipped, so her hair and head rise above the box and sit in front of the graphics. That is the "head pop-out".
- Her chin stays above y=1455. No text in the bottom 23%. Only her shoulders run into that zone.
- She slides up (spring bounce) when a split scene starts and drops away when a full-screen scene starts. The orange wipes cover the change.
- The item being spoken is bright with an orange outline and the other items dim (list highlight), like the reference reel.
- Good scenes for the split: one big idea with a short list or counter, a call to action. Keep full screen for: hook numbers, dense cards, loop rings, wipes.

**How it is built (steps for a new video)**
1. Presenter clip: the user's own footage, or a HeyGen avatar generated from the final voiceover. Check the clip's audio against the voiceover word times (transcribe both) so the lips match.
2. Pick the split stretches and write down their start and end seconds.
3. Cut the speaker out, one run per stretch: `tools/.venv-matte/Scripts/python.exe tools/matte/matte.py <clip> <out.webm> --start S --end E --crop x,y,w,h`. It runs Robust Video Matting locally on the CPU (about 3.5 fps) and writes a transparent .webm. The crop must leave headroom above her head. Example run list: `tools/matte/run-ai-team.sh`.
4. Bake the frames: `sh tools/matte/bake-presenter.sh`. It merges the rounded box and the cut-out into one aligned 900x855 image per frame at 30 fps (`remotion/public/<video>/pres/f-<name>/00000.webp`). **Always bake. Do not play two live video layers in Remotion**, because seeking them during the render made the head choppy and the layers drift apart.
5. In Remotion, `Presenter` (in `remotion/src/aiteam01/AiTeam01.tsx`) shows image number N for each frame. `WINDOWS` lists the stretches: `in`, `out`, `slideIn`, frame folder and frame count. Draw it above the scene graphics and below the orange wipes.
6. Frame the scene graphics above her: title about y 245, content to about y 1040, nothing below.

**One-time setup on a new computer** (local only, nothing leaves the machine; ask the user before downloading):
- `py -m venv tools/.venv-matte`, then `tools/.venv-matte/Scripts/python.exe -m pip install torch torchvision numpy --index-url https://download.pytorch.org/whl/cpu` (about 200 MB).
- Model: `rvm_mobilenetv3_fp32.torchscript` (16 MB) from github.com/PeterL1n/RobustVideoMatting, release v1.0.0, saved in `tools/matte/`.
- Both are git-ignored.

**Known limits:** a 25 fps avatar in a 30 fps video repeats every sixth frame (slight rhythm). Frame blending can smooth it if needed.

## 8. Rules learned on the "first AI team" Reel (all also in `my-rules.md`)

- Slate words and headlines auto-fit so nothing is cut off at the frame edge (`FitText`).
- Cards and rounded boxes need contrast: use a slightly darker warm background (`#EDE6D9`), a visible border and a stronger shadow. A white card on near-white looks over-exposed.
- No whoosh or swish sounds. Wipes get a soft click then a clean high-tech ding, and card reveals get soft clicks.
- The hook is big: separate full-screen beats with huge numbers that count up, not one small block of text.
- Never leave a stretch of 3 to 4 seconds with nothing new on screen. Add a card, tick or text swap that matches what is being said.
- Reference sources: `remotion/src/aiteam01/AiTeam01.tsx` (the full example, snapshot in `source/`).
