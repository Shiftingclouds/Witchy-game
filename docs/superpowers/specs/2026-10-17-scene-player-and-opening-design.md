# Scene player, arrival paintings and a new opening — design

Source: the owner's `Tweaks and Fixes for Lanternmere.txt` (17 October 2026) and the decisions made in conversation that day. Marked **(my call)** where the owner left the choice to me.

Already done separately (not part of this design): vines only on hover, People shows only those you have met, no past dates in "Dates to look forward to", Grimoire shows only learned spells, the player badge is gone, speech is set in curly quotes, the `.exe` icon is in the ChatGPT brief and wired into the build.

## Why

The story currently reads like a document in a pop-up: static portraits, meta labels ("Your story", "Line 40", "Imogen speaking"), spoiler chapter titles, a Next button that moves, and characters who are in the scene but never shown. The opening rushes: no crossing, no walk up to the castle, no first sight of the hall, and Rowan and Imogen greet you as if you were old friends. The owner wants the story to *play*, slowly and grounded, like a well-made game.

## 1. The scene player (default way to experience the story)

The scene player replaces the pop-up and fills the window. It is the default in the Book, the Guided Tale and the authored chapters of Live the world. The old page view stays available as **Read as a page** in the scene's settings **(my call)**.

**Layout** (approved Superdesign drafts: project "Lanternmere — scene player", drafts A and B):

- The current place's painting fills the window, with a soft vignette and a deeper umber shadow along the bottom.
- **Group scenes** (two or more people present) use staging **B**: everyone present stands in a framed portrait, in a row seated directly on top of the dialogue box (no gap). The speaker is about 6% larger, at full light, with a thin warm glow on the frame. Everyone else is slightly smaller and *shadowed* (darker, not washed out). Every frame has its name plate beneath it, never covered.
- **One-on-one** (one other person, and conversations) use staging **A**: one portrait frame sits inside the left of the dialogue box, overlapping its top edge, with the name plate clear of the frame.
- **Portrait frames** use the gold double hairline. Inside each frame, behind the portrait, is the current place's painting, cropped and tinted for the time of day: morning cool gold, afternoon warm, evening amber-rose, night deep blue-umber. Portraits are anchored to the frame's bottom edge and zoomed slightly, so the cut shoulders and sides of the art are never visible.
- **Who is present** comes from the section, not from each line: everyone who speaks in a section, plus anyone the section lists as present, is on stage from the start of that section. This is the fix for Imogen, Cas and Toby never appearing. Expressions change line by line as authored.
- **The dialogue box** has a fixed size and position. Text types in (speed from settings). Speech is in curly quotes; narration is plain.
  - **Next** has a fixed place at the bottom right and never moves. **Back** has a fixed place at the bottom left.
  - Clicking the box, Space or Enter first finishes the line, then advances. Backspace goes back.
  - Choices appear inside the box as framed options.
- **Corner controls**, small hairline-framed icons only:
  - exit (top left);
  - history: the lines so far, in a drawer (top right);
  - a gear (top right) for text speed, text size, motion and Read as a page.
- **Removed:** "Your story", line numbers, "X speaking / Y listening", chapter titles and subtitles, section titles in the box, the window title, and the reading controls under the box.
- **Bug fixes:**
  - The typing state is tied to the line it belongs to. A new line never starts "already finished" or blank, and "Show full text" always reveals the current line rather than skipping.
  - An empty line can't be shown.

## 2. Arrival paintings

Whenever the story or the player arrives somewhere new, that place's painting first fills the screen with only its name in small capitals. The next click (or key) shrinks it smoothly into the scene layout. With reduced motion it simply cuts. This happens on a place's first appearance in a scene, and on every travel in Live and the Open World **(my call: every arrival, since the owner said "every new place")**.

## 3. A new opening

The game begins with the lake at dusk, full screen, before any interface. Character creation asks only your **name** (plus Timeless or Timed for the Open World). **Your house and your familiar are chosen inside the story.** These are some of the most exciting moments, and they become scenes.

Planned sections (prose written to the standard below):

1. **The crossing.** A small boat at dusk on Lantern Mere. The lantern with your name on its handle. Other first-years: Toby offering crumbs to the water, Cas re-checking a list. Tully at the tiller. The castle appears out of the mist, one window at a time. A small choice: talk with Toby, or watch the castle.
2. **The landing and the walk.** The boathouse steps, the lantern-lit path, the gates, and Grey at the great doors counting heads and checking lanterns.
3. **The hall.** A slow first sight of Lantern Hall, with the hundred floating lanterns and the high window over the lake. Headmistress Honoria's welcome, brief and warm.
4. **Your house.** Four house lanterns are lit at the front of the hall. Honoria asks each newcomer one question, about what you do when something is lost: look for the answer, protect the people around you, wait and listen, or make something new. Your answer and your choice of lantern place you in Owlcombe, Rookhallow, Heronmere or Larkspire. The house's crest is shown here.
5. **Your familiar.** The familiars are let into the hall and wander among the new students. You choose which one comes to you: one of the eight existing animals, shown with its painting.
6. **Supper.** Arrival night is a mixed-table supper. You find a seat. Rowan and Imogen are **strangers**, introduced properly with names and a little awkwardness, and through the same small book-catching moment. Then the lantern above your seat goes dark, and the mystery begins exactly as before.

**Continuity rules:**
- Keep the existing arrival decision keys that later chapters call back to (`arrival:first-observation`, `arrival:corridor-job`, `arrival:common-room-rule`, `arrival:watering-method`, `arrival:night-intention`), with the same option ids and meanings.
- The facts of the dark lantern must not change: it goes out over the newcomers on arrival night, with no visible cause, and Grey logs it.
- Rowan stays in Rookhallow and Imogen in Owlcombe; you may or may not share a house with them.

**Writing standard** (the owner found the current prose random and hard to follow):
- Slow, concrete and grounded. One clear action or line per beat. Always clear who is where and who is speaking.
- No abstract or riddling lines, and characters never sound as if they already know you.
- Sensory detail is anchored to the place.

**Who writes:** the owner prefers ChatGPT's prose. I build the skeleton (sections, beats as stage directions, decisions, constraints) and a single ChatGPT brief. ChatGPT rewrites the whole story in the game's script format, the opening first. An importer validates each reply and turns it into game files.

**Review gate:** the owner reads ChatGPT's opening in the game and approves the voice before the remaining chapters are rewritten.

**Engine:**
- New games start with `house: null` and `familiar: null`. The story's choices set them through the normal `story-choice` command, with a new effect type.
- Anything that needs a house (house points, common room, the AI context) waits until it is chosen. Live's Your day opens after the opening scenes.
- Old saves keep their house and familiar and skip the new opening.

## 4. House crests

Add four crest images to the ChatGPT brief, one per house, built on its bird and virtue: an owl for Owlcombe (curiosity), a rook for Rookhallow, a heron for Heronmere, a lark for Larkspire. They are shown in the house choice, the common rooms and the sidebar. Until the art arrives, simple gold line crests drawn in code stand in **(my call)**.

## 5. Later in this round (separate small designs, after the scene player)

- **Calendar:** 3–4 events in every month, each with a short scene. A ChatGPT art brief covers any missing scene art.
- **Spells:** more spells, one or more per class, learned only by taking the class.

## Out of scope

Reworking chapters 2–8 (that follows the voice review), new places, and romance.
