# BOSS for Entrepreneurs: "The Prospect Who Went Quiet" (FINAL, narrated)

**Format:** Vertical 9:16, 1080x1920, 30fps, **1:27.5**, YouTube Shorts / Reels / TikTok
**Modeled on:** the Adobe Acrobat "AI Contract Review" Short (pain question, then "what if," then a screen walkthrough, then a proof payoff, then a soft CTA card)
**Audience:** entrepreneurs, coaches, consultants, service providers
**Pillar:** AI and systems · **Funnel stage:** awareness to consideration · **CTA:** Book a call, kristamashore.com/levelup
**Featured:** BOSS, the Business Operating System (reference: marketleader-boss.vercel.app)

**Deliverables**
| File | What it is |
|---|---|
| `video-output/BOSS-Entrepreneur-Short-Final.mp4` | **FINAL. Picture + Krista's narration + cinematic music bed + sound effects.** About -15.6 LUFS |
| `video-output/BOSS-Entrepreneur-Short-VO.mp4` | Voice-only version (no music or SFX) |
| `video-output/boss-audio/` | Music bed, 8 sound effects, and `mix.mjs` (rebuilds the final mix) |
| `video-output/BOSS-Entrepreneur-Short-silent.mp4` | Same picture, no audio (for the editor) |
| `video-output/boss-vo/v3/vo-01..10.mp3` | The ten VO clips, one per screen, in order |
| `video-output/boss-anim/` | Animation source (`boss-anim.html`) and renderer (`render.mjs`) |
| `video-output/boss-ui/frames/` | 12 still frames, one per shot |

---

## How it's written and spoken: spontaneous

Krista is showing **one person** her own screen and talking them through it as it happens. She says what's on screen in plain words ("It reads my house rules", "Here's the one to Casey", "Six ready. Zero sent."). She reacts instead of pitching, uses first person ("my voice, my call notes"), and leaves real pauses. Every screen action is timed to the word that describes it.

**Voice:** ElevenLabs, voice **"Krista Mashore"** (her professional voice clone), model **eleven_v3**, stability 0.5, similarity 0.8. There's one clip per screen, so any single line can be re-recorded without touching the rest.

**Music and sound:** both are generated in ElevenLabs (Pro plan, commercial use).
- **Music bed** (`music-bed.mp3`, 88s, instrumental) is a subtle cinematic underscore: soft piano and airy pad under the hook, a lift at the logo, a felt-piano pulse with light ticks and warm strings under the walkthrough, a string swell at the payoff, and a clean resolve on the sting. It sits about 15 to 20 dB under the voice and ducks further whenever Krista speaks.
- **Sound effects** sit on the exact frame of each action:

| Cue | Sound |
|---|---|
| 0:05.0 / 0:05.5 | Whoosh on the gold whip, then a deep logo hit with shimmer |
| 0:18.6 to 0:21.5 | Soft keyboard typing as the request types out |
| 0:21.85 | Mouse click on Send |
| 0:28.2 · 0:32.4 · 0:34.9 · 0:35.2 | UI tick as each step turns gold |
| 0:35.5 to 0:40.3 | Soft swoosh as each draft card lands |
| 0:49.1 · 0:51.3 · 0:52.6 · 0:53.0 | UI tick on each self-check |
| 0:53.3 / 0:53.8 | Swoosh and click on "Saved to your Drafts" |
| 0:54.8 · 0:56.3 · 1:03.6 | Highlighter swipe on each gold highlight |
| 1:07.7 / 1:07.9 | Click on the Drafts tab, swoosh as rows slide in |
| 1:11.0 | Soft whoosh into the payoff push-in |
| 1:12.65 · 1:14.2 · 1:15.55 | Low text hit on YOUR VOICE / IN YOUR DRAFTS / YOU HIT SEND |
| 1:17.2 | Swoosh on the CTA card |
| 1:23.55 | Logo hit on the sting |

---

## The final script (timecodes match the video)

### 1 · 0:00 to 0:05.5 · THE PAIN QUESTION · `vo-01-hook` at 0:00.15
| VO | Screen |
|---|---|
| "Okay, be honest… how long would it take you to follow up with everyone who went quiet on you?" | Inbox: **47 no reply**. Prospects stamped NO REPLY · 9 DAYS up to 46 DAYS, scrolling fast with a slow push-in. Captions: "Okay, be honest…" / "How long would it take you" / "to follow up" / "with everyone" / "who went **quiet** on you?" |

### 2 · 0:05.5 to 0:11.4 · THE "WHAT IF" TURN · `vo-02-whatif` at 0:05.6
| VO | Screen |
|---|---|
| "Now… what if BOSS drafted every one of them? From one sentence." | Gold whip, then the BOSS logo pops in on onyx with a slow push. Captions: "Now…" / "what if **BOSS**" / "drafted every one of them?" / "From **one sentence.**" |

### 3 · 0:11.4 to 0:22.9 · THE ASK · `vo-03-workspace` at 0:11.5
| VO | Screen (synced) |
|---|---|
| "So this is BOSS. It asks me… what do you want done?" | BOSS workspace: "Good morning, Morgan. **What do you want done?**" Push into the message box |
| "And I type it the way I'd say it to a person." | Cursor drifts to the box, box lights gold |
| "Draft follow-ups for everyone who went quiet this week." | **The sentence types out as she says it** (0:18.6 to 0:21.5) |
| "Send." | Cursor clicks Send with a ripple (0:21.85) |

### 4 · 0:22.9 to 0:35.5 · IT WORKS IT OUT · `vo-04-working` at 0:23.0
| VO | Screen (synced) |
|---|---|
| "Watch what it does first." | Her request bubble, five steps waiting |
| "It reads my house rules. Drafts only, no made-up numbers." | Step 1 **Read the house rules** spins, then ticks gold |
| "It reads my business… my voice, my dream client, my call notes." | Step 2 **Read your business** spins, then ticks |
| "Then it hands the job to my sales specialist." | Step 3 **Handed it to Sales · SPECIALIST** spins, then ticks. Steps 4 and 5 light up |

### 5 · 0:35.5 to 0:45.0 · IT WRITES THEM · `vo-05-writing` at 0:35.6
| VO | Screen (synced) |
|---|---|
| "And now it writes them. Six follow-ups, one for each person." | "**6 follow-ups. One per person.**" Casey, Jordan and Avery land one by one: ✓ DRAFTED |
| "Not a template." | Riley's card opens: WRITING… |
| "Look, it's pulling from what Riley told me on our call." | Riley's email types itself: "You said busy season is when you need help most…" |

### 6 · 0:45.0 to 0:54.0 · IT CHECKS ITSELF · `vo-06-checking` at 0:45.1
| VO | Screen (synced) |
|---|---|
| "Before it tells me it's done, it checks its own work." | "**It checks its own work.** 6 drafts. Checked." |
| "It tries to break it." | ✓ Tried to break it first |
| "A second reviewer looks too…" | ✓ A second reviewer looked too · ✓ In your voice, from your notes |
| "…and nothing gets sent. Not one." | ✓ Nothing sent. Not one. → **Saved to your Drafts · 6 DRAFTS** |

### 7 · 0:54.0 to 1:05.9 · THE PROOF · `vo-07-email` at 0:54.1
| VO | Screen (synced) |
|---|---|
| "Here's the one to Casey." | The email to Casey Hale, "About your Tuesdays". **"Casey"** highlights gold |
| "It remembered she said Tuesday is the only day she gets to work on her business…" | **"Tuesday is the only day you work on your business"** wipes gold |
| "…and it ends with one clear ask. Fifteen minutes, Thursday." | Cursor moves down, **"grab 15 minutes Thursday"** wipes gold |

### 8 · 1:05.9 to 1:11.3 · WHERE IT GOES · `vo-08-drafts` at 1:06.0
| VO | Screen (synced) |
|---|---|
| "And where do they go?" | Mail app, Inbox tab |
| "My drafts folder." | Cursor clicks **Drafts · 6** |
| "Six ready. Zero sent." | Six rows slide in, each marked **DRAFT · NOT SENT**. Header: 6 ready · 0 sent |

### 9 · 1:11.3 to 1:17.0 · THE PAYOFF · `vo-09-payoff` at 1:11.5
| VO | Screen (synced) |
|---|---|
| "Look at that." | Push-in on the drafts, darkening |
| "Your voice." | **YOUR VOICE.** punches in |
| "Sitting in your drafts." | **IN YOUR DRAFTS.** |
| "And you hit send." | **YOU HIT SEND.** (gold) |

### 10 · 1:17.0 to 1:23.5 · SOFT CTA · `vo-10-cta` at 1:17.2
| VO | Screen |
|---|---|
| "Want this in your business? Book a call. The link's right here." | White card: "Book a call." / "One sentence to start." / "**It never sends without you.**" / gold button kristamashore.com/levelup (pulses) |

### 11 · 1:23.5 to 1:27.5 · LOGO STING
BOSS logo on onyx, scales in and fades.

---

## Full VO (as spoken, about 70 seconds of talking)

> Okay, be honest… how long would it take you to follow up with everyone who went quiet on you?
>
> Now… what if BOSS drafted every one of them? From one sentence.
>
> So this is BOSS. It asks me… what do you want done? And I type it the way I'd say it to a person. Draft follow-ups for everyone who went quiet this week. Send.
>
> Watch what it does first. It reads my house rules. Drafts only, no made-up numbers. It reads my business… my voice, my dream client, my call notes. Then it hands the job to my sales specialist.
>
> And now it writes them. Six follow-ups, one for each person. Not a template. Look, it's pulling from what Riley told me on our call.
>
> Before it tells me it's done, it checks its own work. It tries to break it. A second reviewer looks too. And nothing gets sent. Not one.
>
> Here's the one to Casey. It remembered she said Tuesday is the only day she gets to work on her business… and it ends with one clear ask. Fifteen minutes, Thursday.
>
> And where do they go? My drafts folder. Six ready. Zero sent.
>
> Look at that. Your voice. Sitting in your drafts. And you hit send.
>
> Want this in your business? Book a call. The link's right here.

I transcribed the final mix and it matches this text word for word.

---

## Re-editing

- **Timing:** `boss-anim.html` uses `KNOTS` to pin each screen action to its narration word (video time → animation time). The hook and "what if" captions live in `CAPS`, and the payoff lines live in the `l1`/`l2`/`l3` block. All of these are in video seconds.
- **Re-render:** from `video-output/boss-anim`, run `node render.mjs <frames-folder> 30 0 87.5 2`. Encode the frames with ffmpeg, then mix the clips at 0.15 / 5.6 / 11.5 / 23.0 / 35.6 / 45.1 / 54.1 / 66.0 / 71.5 / 77.2 s.
- **Re-mix audio:** from `video-output`, run `node boss-audio/mix.mjs`. Change the cue times, gains or music level (`volume=0.42`) inside that file.
- **Re-recording one line:** regenerate that clip with the same voice and settings. If its length changes, move the matching `KNOTS` entries by the same amount.
- **Shorter cut:** if a platform caps at 60s, drop section 6 (self-check, 9s) and section 8 (drafts folder, 5.4s). The payoff still lands on the Drafts screen.

---

## Before this ships (checks)

- **AI voice disclosure (required).** The VO is Krista's AI voice clone, so turn on the platform's AI-generated label when posting.
- **Mock UI.** These screens illustrate BOSS. They aren't its real interface. The ILLUSTRATION tag stays on, and every step shown matches what the BOSS page says it does.
- **Fictional data only.** Morgan, Casey, Riley and every other name is made up.
- **Proof claims.** No stats are added beyond what's public on the BOSS page.
- **Music and SFX** are ElevenLabs-generated on the Pro plan, so they're cleared for commercial use. Keep the generation record in case a platform flags the audio.
- **NEEDS KRISTA:** approval of the AI-voice narration, the mock UI, and the CTA before it posts.
