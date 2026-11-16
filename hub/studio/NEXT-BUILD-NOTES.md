# Next build notes

Things to do on a future build pass — not yet implemented.

## New hero copy for the hub Overview (first slide)

Approved wording from the user, not yet applied. Replaces the current paragraph under "BOSS Studio".

> Turn your raw footage into polished videos with AI-powered editing. Choose a style, shape your story, and refine each frame with simple instructions. From short clips to long-form content, bring your videos to life with voice, music, and creative tools in one place.

**Where.** The paragraph is `intro` in `hub/data.js` (line 11), shown by `hub/app.js` in the first slide (`<p class="lede">${esc(D.intro)}</p>`). The small line above the heading, "Everything editing, in one place", is in `hub/app.js` (line 181). Ask whether to keep it, since the new copy no longer says "everything we use".

**Watch out.** `hub/data.js` is a shared file (updates overwrite it), so the owner copy (`.maintainer`) can edit it, and the change needs the online site rebuilt and the artifact republished (`NOEMBED=1 node hub/build-online.mjs`).

## Edit notes (and their drawings) before rendering

**Problem.** A saved note can only be deleted (the X on its card). If a drawing or snapshot note is wrong, you delete it and start a new one.

**Idea.** An **Edit** button on each note card, available only while the note has not been sent in a render.

- Opens the floating canvas at the note's moment, with its drawing restored, its text in the note box, and its range and More options as set.
- Everything is changeable: undo or clear the drawing, add shapes, move text, retype the note, or move the note to a different moment with the scrub bar.
- **Save changes** replaces the note in place (keeps its position in the list). **Close** leaves it untouched.
- Once a note has been sent in a render, it stays as a record of that version. Add a new note instead.

**Catch: older notes.** A saved note keeps only a flattened picture of the frame with the drawing burned in (`note.img`, plus `note.full` when the studio server is running). To make drawings editable later, new notes must also save:

- the drawing's shapes (`shapes`, JSON: pen, arrow, circle, box, text with colour and size), and
- the clean frame (without the drawing), or enough to re-grab it at `note.t`.

Notes made before this change cannot be taken apart. For those, Edit reopens the flattened picture so the user can draw more on top, retype the text, or re-snapshot the moment, but not remove individual shapes.

**Where the code is** (all in `hub/studio/index.html`):

- `addnote` handler: builds the note object (`img: merged()`, `full: mergedFull()`). Add `shapes: JSON.parse(JSON.stringify(shapes))` and the clean frame here.
- `notesHtml()`: renders the note cards. Add the Edit button here.
- Floating canvas: `takeSnap()` / `snapAt()` open it, `stage()` builds it, `inkEvents()` draws. Add an "editing note N" state so Add note becomes Save changes.
- `regrab()` / `pauseGrab()`: already re-grab a frame at a time, which can supply the clean frame for older notes.

**Size.** Medium. It touches how notes are saved and how the canvas opens, which is delicate code. Build on its own branch and test before merging, like the canvas scrub bar.

**Open questions.**

- Should a note that was already rendered be editable as a copy ("duplicate and edit")?
- Should deleting stay one click, or ask first now that notes can hold more work?
