# BOSS Studio

This folder is the user's personal video editor. They record; you edit.

Everything you do here follows the `bossstudio` skill in
`.agents/skills/bossstudio/SKILL.md`. If your agent has not loaded it yet, read it before
you act on "start", "edit this", a dropped or new video, notes on a draft, or anything about
the user's style or rules.

## Shared files and personal files (so updates never conflict)

This repo is updated from GitHub. Files the repo owner ships (`hub/data.js`, `my-rules.md`,
`my-style-presets/` except `_mine/`, `my-style.md`) are overwritten by updates, so a user's own
additions go in separate personal files that updates never touch:

- Lasting rules from the user's notes: `my-personal-rules.md` (create it if missing), NOT `my-rules.md`.
  Always read both rule files; the personal one wins on a clash.
- A new saved style: guide folder under `my-style-presets/_mine/`, media under `hub/assets/mine/`,
  and its registry entry in `hub/my-styles.js` (`window.HUB.styles.push({...})`), NOT `hub/data.js`.
- Never edit `hub/data.js`, `my-rules.md`, `my-style-presets/INDEX.md` or a shipped style for a user's own addition.
- Exception: if a `.maintainer` file exists in the repo root, this is the owner's copy. Write to the
  shared files as usual, and the owner commits them.
- If the user asks to update ("update BOSS Studio"): commit their changes first, then `git pull`.
  Their projects, footage, `.env` and personal files are git-ignored and stay untouched.

## Launching the studio

When the user says "launch the Boss studio" (or "open the studio", "start the studio"), do it right away, no questions:
run `cmd /c start "" "<repo>\hub\open-studio.bat"` (Windows; it opens its own window, starts both studios and opens the hub in the browser). Do not wait for it or read it first.
If both ports 1988 and 1986 already answer, only open `http://localhost:1988/hub/` instead, so a running render is never killed by a restart.
