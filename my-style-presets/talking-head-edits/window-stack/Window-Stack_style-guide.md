# Window Stack (vertical "top 5" reels with floating browser windows)

Studied from a 49-second vertical Reel ("5 free AI plugins for Claude"). Use it for fast listicle Reels where a presenter names tools, steps or ideas and **proof windows** (a GitHub page, an app UI, a clip) float over a soft backdrop. The colours, sizes and timings below are estimated from frames, not extracted from source files.

- Format: vertical 9:16, 1080x1920, 30 fps. Safe area: keep the top 8% and bottom 12% clear of key content.
- Structure: **hook preview, then one block per item (about 7 to 9 seconds each), then a face-only call to action.**
  - Hook (0 to 4s): a dark app window with a counter ("0 / 5 installed") and white item cards sliding in as a fanned row, over the presenter in his box.
  - Item block: item title, then a **browser window** with the item's page, then a **demo graphic** showing it working, all while the voice names the item.
  - Ending (last 4s): presenter fills the whole frame, no graphics, talks the call to action ("comment CLAUDE below").
- The two screens:
  - **Presenter screen:** a window sits in the upper half, the presenter in a rounded box (about 40px radius, grey studio background) fills the bottom 40%, microphone in frame. Used when the item is introduced.
  - **Window-only screen:** the presenter disappears and the window sits alone, centred slightly above the middle. Used for the proof and demo beats. Alternate the two roughly every 3 to 5 seconds.
- Backdrop: a soft, **blurred, low-contrast** background that changes per item: pale blue-grey with a faint palm-leaf shadow, near-white, mid grey, and a dark warm brown blur for the clip beats. Never a flat saturated colour.
- Windows (the signature element):
  - macOS-style browser chrome (red, yellow, green dots, URL pill with the real address, share and tab icons), white page, **20px corner radius, 3px royal-blue border** (#1F6FE0) with a soft blue outer glow.
  - Short bright **blue light streaks travel along the edges** (a glow sweep, about 1 second per loop).
  - About 82% of the frame width, centred. Page text is large and centred so it reads on a phone.
  - Dark app mocks (Claude Code terminal, router diagram, platform list) use the same frame, with a near-black panel (#0E1114), white UI cards, a teal or orange accent and a small pixel-robot icon.
- Item title (above the window): two lines, centred.
  - Line 1: "Plugin" in light grey, "Number" in near-black bold, Poppins or Inter ExtraBold ~72px.
  - Line 2: the number word ("One", "Two", "Four") **italic serif, white on a royal-blue (#1E88FF) rounded box** that pops in with a blur.
- Captions: one word at a time, **word-by-word on the spoken word**, centred under the window at about 62% down the frame. Inter/Poppins ExtraBold ~64px, white with a soft dark shadow. Item names are shown larger and in dark ink on light backdrops ("FreeLLMAPI", "Lemo-Opuscar", "Agent Reach"). Words blur and rise in over about 0.2 seconds. No running subtitle block, no top tag bars.
- Motion:
  - Windows slide up from slightly below (about 60px) with a scale from 0.92 and a blur, in 0.35s.
  - Cards in mocks fan in or stack one by one, each on the word it belongs to; counters tick up; progress bars fill.
  - Scroll the page inside a window slowly (about 40px per second) so the window never looks frozen.
  - Cuts: hard cut between presenter screen and window-only screen, with a 0.15s blur dissolve when the backdrop changes. No whooshes.
- Pacing: a new visual every 2 to 4 seconds. Never hold a still longer than 3 seconds without a scroll, bar fill or caption word changing.
- Sound: voice, clean and normalised to about -14 LUFS, with a light music bed. Pull new music for each video (see `my-rules.md`). Soft clicks or dings on window pops are fine, never whooshes.

## Palette (estimated)

| Name | Hex |
| --- | --- |
| Window border and glow | #1F6FE0 |
| Number-word box | #1E88FF |
| Ink | #14171C |
| Pale backdrop | #E9EEF2 |
| Dark panel | #0E1114 |
| Warm dark backdrop | #3A322C |
| Orange accent (pixel robot) | #E8805A |
| Teal accent | #3FD9BE |

## Fonts

- Poppins or Inter ExtraBold 800: title, captions, item names.
- Serif italic (Playfair Display Italic 700): the number word only.
- JetBrains Mono: command lines inside dark app mocks.

## Recipe for a new video

1. List the items (3 to 7). Write one sentence of what each does and one proof visual (a page, an app mock, a clip).
2. Build the hook preview with a counter and the cards.
3. For each item: title, window with its page, demo graphic, captions on the spoken words.
4. Alternate presenter screen and window-only screen; end full-frame on the presenter.
5. Draft at 972x1728, show it, final at 1080x1920 only after "final".
