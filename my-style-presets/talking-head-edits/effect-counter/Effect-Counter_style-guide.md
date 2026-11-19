# Effect Counter

Studied from a reel: 60-second Reel showing 20 video effects made by an AI editor. Colours, sizes and timings are estimated from frames, not extracted from source files.

- Format: vertical 9:16, 1080x1920, 30 fps. Works for any "N things" demo (effects, tools, tips).
- Base: the presenter is full-frame in a warm room, centred, eyes to camera. The **edit effects themselves are the content**: each effect is applied to the presenter for 1.5 to 3 seconds.
- Pinned header (stays the whole video):
  - A small white rounded chip at the top: "20 Video Effects Created by Claude".
  - Under it, a **red square number tag** ("07") beside a **white pill with the effect name** ("Zoom Portal"). They update on each effect.
  - Under that, a **thin red dashed progress line**; the solid red part grows as the effects count up.
- Hook (0 to 3s): the same title as a big white rounded card at the top, large (about 70px).
- Effects to reuse (all produced in Remotion or by the edit kit): orbit, chat takeover, frame escape (the video breaks out of a white frame), snap zoom (a fast blur punch), zoom portal, growth curve, studio reveal, b-roll overlay (a "ON AIR" light and a small screen), cut-out, magazine cover (a cream cover with a big red masthead behind the presenter), liquid glass, zoom-through cut (white-out), green screen, frame break, digital zoom (camera viewfinder with REC and a zoom level), phone mock-up, checklist.
- Captions: **one bold white word** at about 84% height, huge Inter 900 with a heavy black outline (5px), the word matching what the voice says (the effect's last word: "Escape", "Portal", "Cover"). No pill.
- Transitions: each effect is its own transition. A short white flash can separate effects.
- Ending: a white rounded call-to-action card at the top ("Comment Edit for all the effects ...") with an emoji, and a mock comment box sliding in under it, over the presenter.
- Sound: voice, about -14 LUFS, a punchy music bed, a short "tick" on each header number change. New music for every video (see `my-rules.md`).

## Palette (estimated)

| Name | Hex |
| --- | --- |
| Header chip white | #FFFFFF |
| Number tag red | #E8452C |
| Progress red | #E8452C |
| Caption outline | #000000 |
| Cream backdrop | #F2EDE3 |
| Green screen | #16C20C |
| Room warm tan | #D7C8AA |

## Fonts

- Inter 800: Header chip and effect-name pill.
- Inter 900 + 5px black outline: Single caption word, bottom, about 64px.
