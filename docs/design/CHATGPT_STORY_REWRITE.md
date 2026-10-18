# Lanternmere — rewrite the story

Hello! You are writing the story of **Lanternmere**, a cosy, mysterious witch-academy game. The player arrives at Lanternmere Academy by boat, lives through their first year, and uncovers why the academy's lanterns are going dark. This file contains everything you need: how to write it, the exact format to write in, the cast, the places, what the mystery may reveal in each chapter, and the whole current story to rewrite (starting with a new opening skeleton).

The owner chose you because they love your prose. Make it yours.

**Where this lives:** the public GitHub repository [Shiftingclouds/Witchy-game](https://github.com/Shiftingclouds/Witchy-game), on the branch **`scene-player`**: [docs/design/CHATGPT_STORY_REWRITE.md](https://github.com/Shiftingclouds/Witchy-game/blob/scene-player/docs/design/CHATGPT_STORY_REWRITE.md). The game's own story files are in [`src/story/`](https://github.com/Shiftingclouds/Witchy-game/tree/scene-player/src/story) and readable chapter exports in [`story/`](https://github.com/Shiftingclouds/Witchy-game/tree/scene-player/story) on the same branch.

## How to write

1. **Slow, grounded, concrete.** Let moments breathe. Show where we are and what it looks, sounds and smells like before things happen. Never rush from one event to the next.
2. **Always clear.** It must always be obvious who is in the scene, where they are standing, and who is speaking. One action or one spoken line per paragraph.
3. **No riddles, no random lines.** Every line follows from the one before. Characters talk like real people: plainly, warmly, with their own habits (see the cast sheet).
4. **The player is a newcomer.** Nobody knows them at first. Friendships grow over time and are earned. Never write a character greeting the player as an old friend before they have met.
5. **Speech and action stay separate.** Speech lines contain only what is said; describe actions in their own narration line.
6. **Cosy, not saccharine. Mysterious, not grim.** The magic is practical and gentle; the mystery is quiet and real.
7. **Your house and familiar matter.** The player's house and familiar are the answers to `arrival:house` (owlcombe, rookhallow, heronmere, larkspire) and `arrival:familiar` (cat, owl, fox, hare, moth, raven, ferret, toad). Branch on them with short `[IF arrival:house = …]` and `[IF arrival:familiar = …]` moments in most chapters, so each playthrough feels its own. Keep each variation a few lines long, then rejoin.
8. **Second person, present tense** for narration ("You step onto the boat.").
9. Keep the player's own feelings light: suggest them, don't dictate them, and never put words in the player's mouth.

## The format (please follow exactly)

Write every scene in this plain format, one item per line:

```
=== SCENE <scene id> | chapter <n> ===
--- SECTION <id> | place: <place id> | time: <morning|afternoon|evening|night> | date: <YYYY-MM-DD> ---
[N] A paragraph of narration.
[Rowan | warm] What Rowan says, without quotation marks.
[IMAGE <art id>] Alt text (keep these where they are).
[DECISION <key>] The question the player answers?
[OPTION <id>] What the player chooses | hint: a short hint | journal: what the player writes in their journal afterwards
[END DECISION]
[IF <key> = <option id>]
...lines that only happen after that choice...
[END IF]
```

**Rules that keep the game working:**
- Keep every `SECTION` line, every `DECISION` key and every `OPTION` id **exactly** as given, in the same order. Later chapters remember these choices.
- Keep every `[IF …]` gate and its `[END IF]`; rewrite what is inside them freely.
- Inside a section you may add, remove, merge or reorder `[N]` and speech lines as much as you like.
- Speech: `[<Name> | <emotion>]` with the name exactly as in the cast sheet and an emotion from that person's list (use `neutral` if unsure). No quotation marks.
- A speech line whose words are in (parentheses) is a direction for what that person says: write the actual line.
- `[BEAT]` lines are stage directions in the skeleton: replace each with real prose (several lines if the moment needs them). `[NOTE]` lines are guidance for you: follow them, then leave them out of your reply.
- Only the places in the place list; only the people in the cast sheet (unnamed background people are fine).
- Option labels, hints and journal lines are prose too: rewrite them, but keep their meaning.

## How to reply

- **One scene per reply,** in a single code block, starting with its `=== SCENE` line.
- **The owner has approved your voice.** The opening is done; first send the new beginning described in [CHATGPT_PROLOGUE.md](CHATGPT_PROLOGUE.md) (the letter, the journey, the platform, and Honoria's house questions), then rewrite **every remaining scene in order**, through both epilogues.
- Save each scene in `story-drafts/` on the `scene-player` branch if you can (names are listed in CHATGPT_PROLOGUE.md), otherwise reply in chat.
- At the end of each scene, also rewrite that chapter's two **exit choices** as `[EXIT 0] …` and `[EXIT 1] …` lines.


## Cast sheet

| Name | Who they are | House | How they speak | Example line | Emotions you may use |
| --- | --- | --- | --- | --- | --- |
| Rowan | A warm-hearted firecraft student | Rookhallow | Warm, conversational sentences; concrete offers before advice; admits uncertainty without a speech. | You made it. I saved you a seat. | neutral, warm, amused, laugh, grave, scared, shy, surprised, tense, tired, hurt, flare, small |
| Imogen | A collector of overlooked stories | Owlcombe | Precise observations and questions; short dry asides; distinguish evidence from guesses. | A pencilled note is not proof. It is a good reason to look more carefully. | neutral, warm, amused, laugh, grave, guarded, attentive, shy, surprised, tense, tired, hurt, angry |
| Saoirse | An inventor with muddy boots | Larkspire | Quick concrete suggestions, a small joke, then an honest correction; describe materials plainly. | It almost works. I would like to know why before we call that a success. | neutral, attentive, warm, amused, laugh, guarded, sad, scared, shy, tense, tired, hurt |
| Cas | A meticulous warding student | Rookhallow | Careful phrasing; notices an exact detail, then corrects an overcritical first reaction. | That line is crooked. Sorry—your notebook, not you. I notice things I have not been asked to notice. I am working on it. | neutral |
| Noor | A student who listens to birds | Heronmere | Unhurried, specific words; asks about the person behind a message. | Hold out your hand, slowly. The raven is deciding whether you are a person or a very promising perch. | neutral |
| Idris | A patient student of warding | Owlcombe | Measured explanations grounded in models; offers to work through one step together. | There is room at this desk. I work slowly, so you will not have to pretend you understand everything immediately. | neutral |
| Toby | A first-year with a pocket of crumbs | Larkspire | Brief, tentative with people, precise and confident about creatures. | Do you think the teachers know about the mice? I made them a timetable. The mice, I mean. | neutral |
| Kestrel | The academy’s warding teacher | — | Calm, exact questions; gives reasons for limits and feedback. | Before you draw a ward, tell me what you mean to protect. A beautiful circle is no use if it keeps kindness outside. | neutral, grave, warm |
| Bassani | A teacher of everyday enchantments | — | Concrete instructions, sensory kitchen details, encouraging but candid feedback. | A perfect souffle is a useful ambition. Making enough for everyone is a better one. Apron? | neutral |
| Kovac | The brewing instructor | — | Short clear directions; separate observation, inference, and uncertainty. | If that brew turns blue, tell me. If it turns green, tell me sooner. If it apologises, we shall take notes. | neutral |
| Rhys | The keeper of growing things | — | Gentle concrete observations; leave silence for someone to look closely. | That little seedling has done more work this week than anyone can see. Give it time. You too. | neutral, warm |
| Crook | A practical flying instructor | — | Plain, energetic instructions and a short reason for each rule. | First rule of flying: come back down. Second rule: bring your friends back down with you. | neutral |
| Grey | The keeper of the old corridors | — | Slow practical descriptions; distinguishes a building's age from imagined intent. | The west stair creaks because it is old, not because it is angry. Mind you, it appreciates a thank-you. | neutral, attentive |
| Moth | An astronomer with ink-stained cuffs | — | Unhurried explanations using one visible detail at a time. | You are not late. The stars have been doing this for a very long time. There is plenty of time to catch up. | neutral |
| Solano | A teacher of celestial charms | — | Clear questions connected to shadows, angles, and the time of year. | Look at the edge of that shadow. The sun has written you a date. Shall we learn to read it? | neutral |
| Okoro | A teacher of protective magic | — | Calm, grounded language; asks whose perspective is missing. | Strength is not the same thing as stiffness. A branch that gives a little can hold a great deal. | neutral, warm |
| Dunne | The librarian | — | Concise directions, precise questions, occasionally an unexpected exception. | You may take three books. Four if one frightens you a little. Growing is a good reason for an exception. | neutral, attentive |
| Holloway | The academy’s healer | — | Reassuring practical offers; avoids diagnosing from a passing remark. | Sit down, dear. You do not have to be unwell to need a glass of water and a quiet minute. | neutral |
| Tully | Boatkeeper and friend to familiars | — | Short steady phrases; lake and rope details rather than constant proverbs. | Steady now. The boat knows the way, even when you do not. That is a comforting thing to borrow. | neutral, warm |
| Priya | The station’s young archivist | — | Specific questions and neatly offered possibilities; rarely assumes an item's owner. | Lost something? We have mittens, umbrellas, and a very good idea someone left on the morning train. | neutral |
| Flick | An apprentice with a thousand plans | — | Bright quick offers followed by practical lists; learns to ask rather than enrol people. | Could you hold this ribbon? Wonderful. You are now on the decoration committee. There are biscuits. | neutral |
| Marcus | Captain of the glimmer team | Rookhallow | Direct team language, specific encouragement, honest acknowledgement of mistakes. | We count safe landings before points. Join a practice whenever you like; nobody starts out knowing how to fly. | neutral |
| Petra | A student of forgotten languages | Heronmere | Qualified, precise explanations with examples; asks who used a word and when. | This word means welcome, but only when spoken by someone who has made room. A useful distinction. | neutral |
| Hamish | The Crooked Lantern’s storyteller | — | Expansive setup, a comic detail, then a clear admission of embellishment. | I have a heroic tale and a tale about a pie. They are, unfortunately, the same tale. | neutral |
| Delphine | A patient student of brewing | Heronmere | Concrete smells and observations; asks rather than naming someone else's feeling. | Smell this. What does it remind you of? There is no wrong answer; that is the difficult part. | neutral |
| Bram | A student who learns by doing | Rookhallow | Plain short sentences, honest counts of attempts, offers to demonstrate. | I have tried this spell eleven times. You are welcome to watch the twelfth. It might be the interesting one. | neutral |
| Mina | A maker of enchanted bookbindings | Owlcombe | Tactile descriptions of paper and binding; practical options over speeches. | Bring me your loose notes. We can make them something you will want to keep, crossed-out bits included. | neutral |
| Jonty | A student with a soft spot for strays | Heronmere | Quick affectionate observations; willing to be corrected about habitats. | Before you ask: yes, that is a toad. No, it is not mine. We are discussing the arrangement. | neutral |
| Fitch | The village wandmaker | — | Measured questions about purpose, grain, and repair; avoid mystical absolutes. | A wand is a conversation with a tree. Try listening before you decide what you want it to say. | neutral |
| Odile | The village robe maker | — | Practical fitting directions with frank but tactful observations. | Arms out. Every new beginning needs room at the shoulders and somewhere to put a handkerchief. | neutral |
| Hask | The academy’s records keeper | — | Formal and exact until trust allows a plain admission of doubt. | Records are not the same thing as truth. They are what somebody thought worth writing down. | neutral |
| Tick | The academy’s clock keeper | — | Measured sentences with concrete clock details; avoid speaking only in riddles. | A minute spent helping someone is not a minute lost. None of my clocks have persuaded me otherwise. | neutral |
| Arkwright | The grounds steward | — | Direct questions about the problem, then a concrete next step. | If a door sticks, tell me. You should not have to become stronger just to get where you belong. | neutral |
| Jory | A lamplighter’s apprentice | — | Specific practical details with gentle affection for familiar objects. | This one likes a gentle tap. That one likes being left alone. Keeping lamps is mostly getting to know them. | neutral |
| Morrow | The guardian of the Fen Chapel | — | Few calm words; offers space and ordinary company rather than answers. | The roof is gone. The shelter is not. Stay as long as you need. | neutral |
| Corliss | The Wren’s Nest bookseller | — | Open questions and concrete suggestions; leaves room to refuse. | You need not know the title. Tell me the kind of day you have been having. | neutral |
| Nana Pearl | The village’s unofficial grandmother | — | Conversational and concrete; offers tea before advice, admits when a memory is hazy. | Put the kettle on, love. You can tell me everything, or we can talk about the weather until everything feels smaller. | neutral |
| Dev | A mapmaker of everyday places | — | Specific directions, sensory details, and choices about pace. | Most maps tell you where to go. Mine try to tell you where you might want to stay. | neutral |
| Moll | The academy’s cook | — | Plain warm offers, brisk practical questions, sparing endearments. | There is a heel of bread going spare. If you tell anyone I saved it for you, I shall deny it warmly. | neutral |
| Ombree | Keeper of the Lamp & Ladle | — | Unhurried offers and clear terms; gives a person time to settle. | Sit where the window does not rattle. The soup is ready, and the conversation can wait until you have eaten. | neutral |
| Lettice | A ghost who remembers the music | — | Light, wandering recollections anchored by a melody; honest about missing dates. | Can you hear the waltz? No? Never mind. Walk beside me, and I will hum the parts I remember. | neutral |
| Maisie | The sweetshop’s careful experimenter | — | Sensory but precise descriptions; offers samples without insisting. | This one tastes like the first day of a holiday. This one is lemon. On difficult days, lemon is enough. | neutral |
| Kit | A wandering student of songs | — | Musical details and unfinished possibilities; asks before borrowing a phrase. | Do you know the rest of this tune? I only have the beginning. Perhaps we can give it somewhere to go. | neutral |
| Hester | A portrait with a good memory | — | Exact observations, clear limits, dry remarks about passing fashions. | Do stop a moment. Everyone hurries past history, then wonders where it has gone. | neutral |
| Honoria | The academy’s headmistress | — | Formal but human; concrete commitments instead of effortless reassurance. | A school is a promise made again every morning. Tell me if we are failing to keep it. | neutral |
| Elian Vale | Firecraft and introductory charms teacher | — | Clear demonstrations followed by candid questions about what the learner noticed. | Tell me what changed before the flame went out. You do not need the right explanation yet; I need the part you actually noticed. | neutral |
| Maelin Quill | History and rune languages lecturer | — | Formal precise phrasing, then a plain admission when a claim is uncertain. | Keep the reference beside the quotation. Then a reader can check your argument without first deciding whether they like you. | neutral, reflective |

Houses: **Owlcombe** (Owl, Curiosity) · **Rookhallow** (Raven, Courage) · **Heronmere** (Heron, Kindness) · **Larkspire** (Lark, Wonder).

## Places

`lantern-hall` Lantern Hall · `library` The Library · `classroom` Charms Classroom · `glasshouses` The Glasshouses · `brewing-cellars` Brewing Cellars · `warding-hall` Warding Hall · `corridor` The Grand Corridor · `infirmary` The Infirmary · `kitchens` The Kitchens · `menagerie` The Menagerie · `observatory` The Observatory · `rookery` The Rookery · `weathervane-room` The Weathervane Room · `old-cloisters` Old Cloisters · `mere` The Mere · `boathouse` The Boathouse · `candlestones` The Candlestones · `whispering-wood` Whispering Wood · `fen-chapel` The Fen Chapel · `glimmer-pitch` The Glimmer Pitch · `heartfire` The Heartfire · `thimble-cross` Thimble Cross · `lamplight-row` Lamplight Row · `lamplighters` The Lamplighters · `wand-shop` The Wand Shop · `robe-shop` The Robe Shop · `sweetshop` The Sweetshop · `crooked-lantern` The Crooked Lantern · `lamp-ladle` The Lamp & Ladle · `wrens-nest` The Wren’s Nest · `nana-pearl` Pearl’s Sitting Room · `tully-cottage` Tully’s Cottage · `platform-nought` Platform Nought · `owlcombe` Owlcombe Common Room · `rookhallow` Rookhallow Common Room · `heronmere` Heronmere Common Room · `larkspire` Larkspire Common Room

## The mystery, chapter by chapter

What each chapter reveals. A chapter may hint at what comes next but must never reveal more than its own line. Keep these facts unchanged.

- **Chapter 1:** On arrival night the hall lantern above the new students goes out for no visible reason: cold outside, seal intact, no smoke. Grey, the caretaker, logs it, finds no broken fitting and cannot relight it normally.
- **Chapter 2:** During the first Kindle lesson the player (and Rowan) hear a voice beneath the flame: "Remember the way home." Elian can reproduce the light but not the voice.
- **Chapter 3:** In the Library registers, working and formal records disagree: certain workers and keepers were left out of the formal record. A supervised echo suggests care and return, not malice. Motive and cause remain unproven.
- **Chapter 4:** At Emberfall, moonflowers in the Glasshouses are shown to hold an echo of warmth — a way to preserve evidence. An echo is not a living person.
- **Chapter 5:** At Longnight, Echosight on the Mere reveals seven willing lights in an open circle: the first keepers offered their light freely. If the academy's welcoming magic fails, the buildings remain but the welcome does not. Midsummer is the deadline to restore it.
- **Chapter 6:** At First Thaw the Candlestones inscription confirms that light must be freely offered and that the circle keeps a space for newcomers. Threadbind must connect willing people, never compel them.
- **Chapter 7:** By Bloomtide the restoration needs recovered names, the register, willing participants, the three spells and repaired friendships — a plan tested together, with consent, and no single person sacrificing themselves.
- **Chapter 8:** At midsummer in the Heartfire, willing lights joined by Threadbind restore the academy's welcoming light. The future is an ongoing shared responsibility.

---

## The story to rewrite

Scenes in playing order. The opening starts with the new skeleton (stage directions to write in full), then continues with the existing supper sections of the same scene. Everything after that is the current prose: rewrite it in your own voice, keeping the structure tags.

### Chapter 1

```
=== SCENE arrival | chapter 0 ===

--- SECTION crossing | place: mere | time: evening | date: 2026-09-01 ---
[NOTE] The game opens here, before any interface: the lake at dusk fills the screen. Slow down. The player is a stranger arriving somewhere new; nobody knows them yet.
[BEAT] Dusk on Lantern Mere. A small flat-bottomed boat, low in the water, moving without oars. Cold air, the smell of lake weed and wet rope.
[BEAT] The player holds a small brass lantern. Their own name is engraved on the handle. It is unlit. They are not sure why they were chosen.
[BEAT] Tully, the boatkeeper, sits at the stern with one hand on the tiller, humming. Weathered, unhurried, kind; says little.
[Tully | warm] (a short, plain welcome; tells them the crossing takes as long as it takes)
[BEAT] Two other new students share the boat. Toby, round-cheeked, tearing crumbs from a bread roll and dropping them over the side for the fish. Cas, sitting very straight, checking a folded list of things he packed, lips moving.
[Toby | warm] (offers the player some of the roll; says the fish here are polite)
[Cas | neutral] (corrects something small Toby said, then quietly counts her list again)
[BEAT] Mist lies on the water ahead. Somewhere inside it, a single window lights up.
[DECISION arrival:crossing] Where does your attention go?
[OPTION toby] Sit with Toby and his crumbs. | hint: Company for the crossing. | journal: On the boat I shared Toby's bread roll and fed the fish. Cas told us there were exactly forty-one of them, then admitted he had not counted.
[OPTION castle] Watch the castle come out of the mist. | hint: Take it in alone. | journal: On the boat I watched the castle appear one window at a time, until there were too many to count.
[END DECISION]
[IF arrival:crossing = toby]
[BEAT] Toby talks about home, his grandmother's hens, and how he packed more food than clothes. Cas pretends not to listen, then joins in with a fact about fish.
[END IF]
[IF arrival:crossing = castle]
[BEAT] The castle comes out of the mist one window at a time: towers, then a long hall of lit glass above the water, then a stair down to a boathouse. The player stops counting the windows.
[END IF]
[BEAT] The boat bumps gently against the boathouse steps. Tully ties off without looking.

--- SECTION landing | place: boathouse | time: evening | date: 2026-09-01 ---
[BEAT] Wet stone steps, lanterns on hooks, the lap of water inside the boathouse. Other boats arriving behind them, more new students, the sound of trunks being lifted.
[Tully | neutral] (tells them to leave their trunks; they will be carried up. Lanterns stay with you.)
[BEAT] A lantern-lit path climbs from the boathouse through a stand of dark pines. Gravel, then old flagstones. The castle walls rise above the trees.
[BEAT] The player's lantern stays dark while others around them glow faintly. They notice, and hope no one else does.
[BEAT] At the top, great wooden doors stand open. Grey, the keeper of the old corridors, waits beside them with a ledger, counting heads and checking each lantern against a list.
[Grey | neutral] (asks the player's name, finds it, makes a small mark; a plain, practical line; knocks on the doorframe out of habit before they go in)

--- SECTION hall | place: lantern-hall | time: evening | date: 2026-09-01 ---
[BEAT] Lantern Hall, seen properly for the first time: hundreds of small paper lanterns floating under a high vaulted ceiling, a great round window over the lake at the far end, long tables, carved birds on the pillars (owl, raven, heron, lark).
[BEAT] The noise of older students already seated; new students gathered by the doors in a nervous cluster. Toby and Cas nearby.
[BEAT] Headmistress Honoria rises. Silver-haired, upright, warm. The hall quiets without being told.
[Honoria | warm] (a brief welcome: the academy teaches practical, gentle magic; a lantern is given to everyone who belongs here; they will be sorted into houses tonight, by their own answer)

--- SECTION house | place: lantern-hall | time: evening | date: 2026-09-01 ---
[NOTE] Four tall house lanterns stand at the front of the hall, each in its house colour, each marked with its crest: Owlcombe (owl, Curiosity, violet-grey), Rookhallow (raven, Courage, red), Heronmere (heron, Kindness, teal), Larkspire (lark, Wonder, yellow-gold). Show the crests here.
[BEAT] One by one the new students walk up. Honoria asks each the same quiet question. Each answer is their own; the matching house lantern brightens.
[BEAT] Toby goes before the player; the Larkspire lantern brightens and the Larkspire table cheers. Cas goes next; Rookhallow.
[BEAT] It is the player's turn. Honoria looks at them kindly, not at their dark lantern.
[DECISION arrival:house] Honoria asks: "When something is lost, what do you do first?"
[OPTION owlcombe] Look for the answer. | hint: Owlcombe · Curiosity | journal: When Honoria asked what I do when something is lost, I said I look for the answer. The Owlcombe lantern brightened.
[OPTION rookhallow] Go after it, even if it is dark. | hint: Rookhallow · Courage | journal: When Honoria asked what I do when something is lost, I said I go after it, even in the dark. The Rookhallow lantern brightened.
[OPTION heronmere] Make sure no one has to look for it alone. | hint: Heronmere · Kindness | journal: When Honoria asked what I do when something is lost, I said no one should have to look alone. The Heronmere lantern brightened.
[OPTION larkspire] Wonder where it went, and what it found there. | hint: Larkspire · Wonder | journal: When Honoria asked what I do when something is lost, I said I wonder where it went. The Larkspire lantern brightened.
[END DECISION]
[BEAT] The chosen house lantern brightens. The player's house table makes room for them. (Write it so it works for any house; do not name the house in narration.)

--- SECTION familiar | place: lantern-hall | time: evening | date: 2026-09-01 ---
[BEAT] A side door opens. The familiars are let into the hall: animals who have chosen to live at the academy. They wander between the tables, unhurried, looking at the new students.
[BEAT] Several come close to the player. One stays.
[DECISION arrival:familiar] Which one stays with you?
[OPTION cat] A black cat who sits on your foot as if it has always belonged there. | hint: Cat | journal: A black cat chose me on arrival night. It sat on my foot and would not be moved.
[OPTION owl] A small owl who lands on the back of your chair. | hint: Owl | journal: A small owl chose me on arrival night and landed on the back of my chair.
[OPTION fox] A young fox who noses your lantern and then your hand. | hint: Fox | journal: A young fox chose me on arrival night. It sniffed my lantern first, then my hand.
[OPTION hare] A brown hare who settles under the bench by your feet. | hint: Hare | journal: A brown hare chose me on arrival night and settled under the bench by my feet.
[OPTION moth] A pale moth, larger than your palm, who rests on your lantern. | hint: Moth | journal: A pale moth chose me on arrival night. It rested on my lantern even though it was dark.
[OPTION raven] A raven who walks the length of the table to stand beside you. | hint: Raven | journal: A raven chose me on arrival night. It walked the whole table to stand beside me.
[OPTION ferret] A ferret who climbs into your coat pocket. | hint: Ferret | journal: A ferret chose me on arrival night and climbed into my pocket.
[OPTION toad] A green toad who sits by your plate, entirely calm. | hint: Toad | journal: A green toad chose me on arrival night and sat by my plate, entirely calm.
[END DECISION]
[BEAT] The familiar settles. For the first time since the boat, the player feels a little less alone. (Work for any familiar; do not name the animal in narration.)
[NOTE] Supper follows: the existing sections below. Arrival night is a mixed-table supper, so the player can sit with Rowan (Rookhallow) and Imogen (Owlcombe) whatever house they chose. REWRITE the supper so Rowan and Imogen are STRANGERS: they introduce themselves by name, a little awkwardly, through the book-catching moment. Rowan must not say "You made it" or anything implying he already knows the player.


--- SECTION crossing | place: mere | time: evening | date: 2026-09-01 ---
[N] The boat slips away from the landing with a scrape of wood against stone.
[N] Behind you, the station lamps grow smaller between the trees.
[N] There are no oars. Water curls along the sides of the flat-bottomed boat, carrying loose reeds past your shoes.
[N] The evening air smells of lake weed and wet rope. Where your sleeve rests against the gunwale, the cloth begins to darken.
[N] A small brass lantern stands between your knees. Your name is engraved along its handle, in letters deep enough to feel with a thumb.
[N] Its glass is clear. Inside, a new wick sits white and unburned.
[N] The academy's letter gives the date of your arrival, a list of things to pack, and directions to the lake. It offers no explanation for why a place has been offered to you.
[N] At the stern, the boatkeeper hums through his nose. One broad hand rests on the tiller; the other holds the end of a rope coiled beside his boot.
[Tully | warm] Welcome aboard. I'm Tully. You can put your bag under the seat if it's in your way.
[N] He steers around a patch of reeds without interrupting his tune.
[Tully | neutral] We'll be across before supper. The crossing takes as long as it takes, so you might as well get comfortable.
[N] A round-cheeked student on the opposite bench leans over the side. He drops a crumb into the water.
[N] A silver mouth breaks the surface beneath it.
[Toby | neutral] Oh. There's another.
[N] He shifts his bread roll out of the damp and offers you the untouched half.
[Toby | neutral] I'm Toby. Would you like some? I haven't given the fish that bit.
[N] Two more fish gather beside the boat, their backs just visible below the surface.
[Toby | neutral] They're very polite here. They wait for you to drop it.
[Cas | neutral] They're following us because you keep feeding them.
[N] The student beside Toby sits with his heels together and a folded list balanced on one knee.
[Cas | neutral] Sorry. You probably knew that. I'm Cas.
[N] Cas presses a crease flat with his thumbnail and returns to counting the items on his list.
[N] Mist stretches across the water ahead. A single square of yellow light appears high inside it.
[DECISION arrival:crossing] How will you spend the crossing?
[OPTION toby] Share Toby's bread and watch the fish. | hint: Get to know the other passengers. | journal: I shared Toby's bread on the crossing and fed the fish beside the boat. Cas said there were forty-one, then admitted he had guessed.
[OPTION castle] Watch for the academy through the mist. | hint: Have a quiet moment to take it in. | journal: I watched Lanternmere emerge from the mist, one window at a time. I lost count before I could see the whole building.
[END DECISION]
[IF arrival:crossing = toby]
[N] You take the offered bread. The crust is soft from being wrapped for the journey, but the middle still smells faintly of butter.
[Toby | neutral] My grandmother packed it. She keeps hens, so leaving the house without feeding somebody is difficult for her.
[N] He breaks a small piece from his half.
[Toby | neutral] I had to take out a jumper to fit everything in. There are boiled eggs underneath my socks.
[N] Cas looks up from his list.
[Cas | neutral] Wrapped, I hope.
[Toby | neutral] Of course.
[N] A pause.
[Toby | neutral] The eggs, anyway.
[N] Cas folds his list a little smaller. His attention has settled on the water beside your feet.
[Cas | neutral] There must be forty-one of them now.
[N] Toby bends closer to the side.
[Toby | neutral] How did you count them? They keep going under each other.
[Cas | neutral] I didn't. It was a guess.
[Toby | neutral] That's a very exact guess.
[N] Cas looks down at his list, then back at the fish.
[Cas | neutral] Forty seemed too few.
[N] Toby laughs, scattering crumbs onto his coat.
[N] By the time he has picked them off, the fish have followed the boat into the mist.
[END IF]
[IF arrival:crossing = castle]
[N] You settle the lantern against your knee and turn towards the light.
[N] A second window appears below the first. Then six more form a long, uneven row.
[N] The mist thins as the boat moves through it.
[N] Towers rise against the last pale strip of sky. Some have pointed roofs; one ends in a broad platform with a weather vane turning above it.
[N] Lower down, a long hall stands close to the water. Its windows cast broken gold reflections across the lake.
[N] You count to twelve before a tree interrupts the row.
[N] Beyond the tree, another wing stretches out of sight. Smoke rises from a chimney you had mistaken for a turret.
[N] A flight of stone steps descends from the buildings to a boathouse. Someone is moving along the steps, lighting the lamps one by one.
[N] You stop counting windows.
[END IF]
[N] Tully turns the tiller. The bow swings towards a low stone arch.
[N] The boat bumps gently against the boathouse steps.
[N] Without looking down, Tully catches the mooring ring with his rope.

--- SECTION landing | place: boathouse | time: evening | date: 2026-09-01 ---
[N] Water laps against the steps inside the boathouse. Each small wave makes a hollow sound beneath the wooden landing.
[N] Lanterns hang from iron hooks along the wall. Their light catches the wet edges of the stone.
[Tully | neutral] Mind the second step. It's slippery on the left.
[N] You step ashore with your bag and lantern.
[N] Another boat noses through the arch behind yours. A trunk lands on the boards with a heavy thump.
[Tully | neutral] Leave the trunks by the wall. We'll bring them up. Keep your lanterns with you.
[N] Toby gives his trunk a final push into line. Cas checks its neighbour for a luggage label before following him towards the door.
[N] Outside, a gravel path climbs between dark pines.
[N] The lamps stand far enough apart that the patches of light barely touch. Needles catch beneath your soles where the gravel gives way to old flagstones.
[N] Two older students pass on their way down to help with the boats. Faint flames glow inside the small lanterns swinging at their sides.
[N] Yours reflects the path lamps as you turn it. The wick remains dark.
[N] Above the trees, the academy wall rises several storeys higher than you could see from the water.
[N] Both halves of the great wooden doors stand open.
[N] Beside them, a man in a worn brown coat holds a ledger against his forearm. His pencil pauses at each person coming up the path.
[Grey | neutral] Name, please?
[N] You turn the lantern handle towards him.
[N] He finds the matching entry and puts a small mark beside it.
[Grey | neutral] There you are. I'm Grey. If something sticks, leaks, or falls off, you can usually find me through the service door beside the hall.
[N] He hands you an arrival card with a folded map on the back.
[Grey | neutral] Keep that for your room key. Supper first, though. Straight ahead.
[N] Grey taps twice on the doorframe before stepping aside.

--- SECTION hall | place: lantern-hall | time: evening | date: 2026-09-01 ---
[N] Warm air reaches you before the noise does. Bread, woodsmoke, and something roasting with rosemary replace the sharp smell of the lake.
[N] Hundreds of paper lanterns float beneath the vaulted ceiling, tethered by fine chains. Their pale shades shift in the draught from the doors.
[N] At the far end of the hall, a great round window frames the last of the dusk over the water.
[N] Long tables fill the room. Coats hang from chair backs; bowls and jugs pass from hand to hand.
[N] On the nearest pillar, an owl is carved with its wings folded. A raven, a heron, and a lark occupy the pillars beyond it.
[N] You join the new students gathered near the entrance. Toby stands on your left, brushing the last crumbs from his coat. Cas has put his list away.
[N] A silver-haired woman rises at the far table.
[N] Conversations subside as people notice her standing. The last laugh comes from the kitchen doorway.
[Honoria | neutral] Good evening. I'm Honoria, the headmistress. Welcome to Lanternmere.
[N] She waits while a late arrival squeezes through the doorway with a hat caught beneath one arm.
[Honoria | neutral] You'll learn to do a great many things here. Some will look impressive. Others will keep a room warm or help a plant survive the winter. We take those seriously too.
[Honoria | neutral] Every student receives a lantern. You've each been offered a place here; the name on that handle is yours.
[N] She gestures towards four tall lanterns standing before the tables.
[Honoria | neutral] Tonight you'll choose a house. I'll ask you a question, and you may answer it in your own way. There is no answer I'm waiting for you to get right.
[Honoria | neutral] After that, we can let the kitchen serve the potatoes before they have a complaint to make.
[N] A few students laugh. Someone near the kitchen raises a covered dish in agreement.

--- SECTION house | place: lantern-hall | time: evening | date: 2026-09-01 ---
[N] Each house lantern is taller than your shoulder.
[N] An owl spreads its wings across violet-grey glass. Beneath it, a brass plate reads Owlcombe: Curiosity.
[N] Beside it stands Rookhallow's red lantern, marked with a raven and the word Courage.
[N] A heron bends its long neck across Heronmere's teal panes. Its plate reads Kindness.
[N] The last lantern is yellow-gold, with a lark rising through its glass. Larkspire: Wonder.
[N] Honoria calls the new students forward one at a time.
[Honoria | neutral] When something is lost, what do you do first?
[N] Some answers come quickly. Others follow a long look at the floor.
[N] Honoria gives each person time. As they finish speaking, one of the four lanterns brightens.
[N] Toby steps forward ahead of you.
[Toby | neutral] I wonder where it's got to. Sometimes things turn up somewhere better. Though I would still look, if someone needed it back.
[N] Golden light climbs the lark's wings. A cheer rises from the Larkspire table.
[N] Cas goes next.
[Cas | neutral] I'd go after it. I'd rather know what was out there than keep imagining it.
[N] The red lantern brightens, throwing the raven's shadow onto the flagstones.
[N] Then Honoria calls the name engraved on your handle.
[N] She waits until you are standing in front of her. Her attention stays on your face.
[DECISION arrival:house] When something is lost, what do you do first?
[OPTION owlcombe] Look for clues that might explain where it went. | hint: Owlcombe · Curiosity | journal: I told Honoria I would look for an answer. The Owlcombe lantern brightened for me.
[OPTION rookhallow] Go after it, even if the way is dark. | hint: Rookhallow · Courage | journal: I told Honoria I would go after what was lost, even in the dark. The Rookhallow lantern brightened for me.
[OPTION heronmere] Find out who needs help looking. | hint: Heronmere · Kindness | journal: I told Honoria I would make sure nobody had to search alone. The Heronmere lantern brightened for me.
[OPTION larkspire] Wonder where it went and what it might have found. | hint: Larkspire · Wonder | journal: I told Honoria I would wonder where the lost thing had gone. The Larkspire lantern brightened for me.
[END DECISION]
[N] One of the lanterns fills with light, its crest shining clearly against the glass.
[N] At the matching table, a student lifts an arm to catch your eye. Others move their bags to make room.
[Honoria | neutral] Thank you. They'll help you find your room later.
[N] You carry your lantern towards the waiting space.

--- SECTION familiar | place: lantern-hall | time: evening | date: 2026-09-01 ---
[N] The last new student has barely reached a seat when a side door opens.
[N] Tully stands in the doorway. A black cat passes him without looking up.
[N] A fox follows, stopping to sniff the leg of an empty chair. Wings brush the air above the tables.
[Tully | warm] A few more arrivals. Keep your feet still a moment.
[N] He holds the door for a hare, then checks the floor before easing it shut.
[Tully | neutral] They live here too. Some may take an interest in you. Let them come over in their own time.
[N] Conversations soften around you. A student holds out an empty hand and waits.
[N] Several of the animals pause nearby. One remains when the others move on.
[DECISION arrival:familiar] Which familiar stays beside you?
[OPTION cat] A black cat settles firmly on your foot. | hint: Cat | journal: A black cat chose me on arrival night and settled on my foot as though it had found its usual place.
[OPTION owl] A small owl lands on the back of your chair. | hint: Owl | journal: A small owl chose me on arrival night. It perched behind me and watched the hall over my shoulder.
[OPTION fox] A young fox sniffs your lantern, then noses your hand. | hint: Fox | journal: A young fox chose me on arrival night, sniffing my lantern before nudging my hand.
[OPTION hare] A brown hare tucks itself beneath the bench by your feet. | hint: Hare | journal: A brown hare chose me on arrival night and settled beneath the bench beside my feet.
[OPTION moth] A pale moth larger than your palm rests on your dark lantern. | hint: Moth | journal: A large pale moth chose me on arrival night. It settled on my lantern although there was no flame inside.
[OPTION raven] A raven walks along the table and stops beside you. | hint: Raven | journal: A raven chose me on arrival night. It walked the length of the table to stand beside me.
[OPTION ferret] A ferret climbs into your coat pocket. | hint: Ferret | journal: A ferret chose me on arrival night and made itself comfortable in my coat pocket.
[OPTION toad] A green toad sits quietly beside your plate. | hint: Toad | journal: A green toad chose me on arrival night and sat beside my plate through the bustle of supper.
[END DECISION]
[N] Tully notices the small companion beside you.
[Tully | warm] There you are. Come and see me tomorrow if you need to know what to feed them.
[N] Your familiar stays close as the hall begins to move around you again.
[N] Honoria announces that arrival-night supper has mixed tables. Older students stand to make room, carrying their cups to other places.
[N] The student who welcomed you to your house points towards the remaining empty seats.

--- SECTION place-at-table | place: lantern-hall | time: evening | date: 2026-09-01 ---
[N] Near the round window, a red-haired student has one hand under a stack of books and the other wrapped around a chair back.
[Rowan | warm] Were you looking for a seat? You can have this one. Just a moment.
[N] He lifts the books. The bottom volume slides towards the floor.
[N] A dark-haired student across the table catches it against her knee.
[Imogen | neutral] Rowan. That's mine.
[Rowan | surprised] I know. I was trying to give you the others first.
[Imogen | amused] You could have given me this one first.
[N] He looks at the remaining stack in his arms.
[Rowan | amused] Yes. That would have been quite a good idea.
[N] He sets the books on the floor, safely beneath his own chair.
[Rowan | warm] Sorry. I'm Rowan.
[N] The other student lays the rescued atlas beside her plate.
[Imogen | warm] Imogen. And you are?
[N] You introduce yourself.
[N] Rowan pulls the empty chair out far enough for you to sit.
[Rowan | warm] Well, there's room here. Imogen only needs half the table for that.
[Imogen | neutral] A third.
[N] She folds the atlas closed to demonstrate.
[N] A narrow strip of notes protrudes from the pages. She tucks it inside before moving the book away from your plate.
[N] You set your lantern on the table. Your familiar settles nearby, within sight of you.
[N] Rowan passes the bread basket.
[Rowan | warm] I saw the boats from the window. It looked cold out there.
[N] A serving bowl arrives at his elbow. He accepts it from the student behind him and holds it where you can reach.
[Rowan | neutral] Potatoes first, apparently. There's stew coming after them.
[N] Imogen shifts the water jug closer to your cup.
[Imogen | attentive] Did Grey give you a map at the door?
[N] You put the arrival card beside your plate.
[Imogen | neutral] Good. We'll show you the stairs afterwards. The map leaves out a few things.
[Rowan | amused] Doors, mostly.
[Imogen | amused] One fairly important door.
[N] The lantern directly above your seat trembles on its chain.
[N] Its flame contracts to a blue point.
[N] Then it goes out.
[N] The white paper shade turns grey. On the table, the bright rim around your cup disappears.
[N] Rowan is still holding the serving bowl.
[Rowan | neutral] Did you see that?
[N] Imogen looks up.
[Imogen | attentive] Yes.
[Rowan | grave] I helped hang these yesterday. That one was burning when we opened the doors.
[N] The lantern beside it continues to glow. Neither shade is moving now.
[N] A laugh rises from the next table. Someone asks for the salt.
[Imogen | attentive] We should tell Grey before he leaves the hall.
[N] Rowan sets the bowl down between you.
[Rowan | warm] I'll catch him after supper. You can come with us, if you want.
[N] He waits while you help yourself, then passes the bowl along.
[N] Imogen opens the atlas just far enough to tear a blank slip from the back of her notes.
[N] Above you, the dark lantern hangs among the lit ones. No smoke rises from its shade.

--- SECTION after-supper | place: lantern-hall | time: evening | date: 2026-09-01 ---
[N] By the time the pudding dishes are empty, rain has begun tapping against the round window.
[N] Rowan gathers the plates at your end of the table into a stack.
[N] Imogen takes the top three before he lifts it.
[Imogen | neutral] That's enough. You can't see over them.
[Rowan | amused] I was going to look round the side.
[N] He tries, finds your cup in the way, and hands you the smaller stack.
[N] At the kitchen door, an assistant slides the plates onto a trolley. Heat spills from the room behind them, carrying the smell of washing-up water and baked apples.
[N] When you return, Rowan has fetched a long brass pole from a cupboard beside the wall.
[Rowan | neutral] Grey showed me this yesterday. The hook goes through that ring, and the chain runs back through the beam.
[N] He catches the ring beneath the dark lantern and eases it down to the table.
[N] You move your own lantern to a dry stretch of bench so its handle will not catch the pole.
[N] The hanging lantern has a paper shade stretched over a brass frame. Small repairs show where fresh strips have been pasted across old tears.
[N] A wire seal fastens its little door.
[Rowan | neutral] That's as far as we're allowed to go. Grey opens them when they need mending.
[N] Imogen lays her blank slip of paper on the table.
[Imogen | attentive] We can give him something more useful than just saying it went out.
[DECISION arrival:first-observation] What will you check first?
[OPTION frame] Examine the outside of the lantern with Rowan. | hint: Check the frame without disturbing its seal. | journal: Rowan and I checked the lantern's frame. The brass was cold, and the wire seal was still intact.
[OPTION record] Help Imogen write down what happened. | hint: Record what you noticed without guessing at a cause. | journal: Imogen and I recorded the light going out. There was no smoke, the seal was intact, and we could not explain it.
[END DECISION]
[IF arrival:first-observation = frame]
[N] You hold your hand near the shade. There is no warmth against your skin.
[N] Rowan steadies the handle while you touch a corner of the brass frame.
[N] It is cold.
[Rowan | grave] Already?
[N] He touches the same corner with the back of one finger.
[Rowan | neutral] The others stay warm for ages after we put them out.
[N] Together, you check the hinge and the small sealed door. Nothing hangs loose; the wire is unbroken.
[N] Imogen writes the findings on her paper.
[Imogen | attentive] Anything else?
[N] Rowan looks around the frame once more before shaking his head.
[Rowan | neutral] That's all I can see.
[N] He keeps one hand beside the lantern until it is steady on the table.
[Rowan | warm] Thanks. I'd have been here turning it round until breakfast on my own.
[END IF]
[IF arrival:first-observation = record]
[N] Imogen writes the date at the top of the slip.
[Imogen | attentive] It drew inwards before it went out. Did you see any smoke?
[N] You look at the pale shade. There is no dark stain above the wick, and no smell of burning paper.
[N] She holds the pencil out to you.
[Imogen | neutral] Put down anything I missed. I was looking at the map when it started.
[N] You add the brief blue point where the flame had been.
[N] Beside you, Rowan examines the frame without opening its door.
[Rowan | grave] It's cold. The wire's still sealed, though.
[N] You add his observations beneath the first line.
[Imogen | attentive] And there wasn't a crack or a bang. We would have heard that from here.
[N] The list takes up less than half the slip.
[Imogen | neutral] Leave the rest blank. Grey might know what to ask.
[END IF]
[N] A paper tag is folded around the chain beneath the handle.
[N] Rowan turns it towards the light. It identifies table seven, north side, and gives today's date.
[N] The box beside the inspection date contains a short diagonal stroke where a name might have been.
[N] Imogen copies the stroke onto her slip.
[Rowan | neutral] What's that for?
[Imogen | attentive] I don't know. It may be how they mark something as checked.
[N] Grey comes through the service door carrying a tray of empty candle cups.
[N] Rowan lifts a hand to call him over.
[N] Grey puts his tray on the next table and looks from the lantern to its unbroken seal.
[Grey | neutral] Tell me what happened.
[N] You slide the report towards him.
[Imogen | attentive] It went out during supper. Nobody touched it. We checked the outside, but we haven't opened it.
[Rowan | neutral] It was lit before the boats came in. I'm certain of that.
[N] Grey reads the slip, then checks the hinge and chain for himself.
[Grey | neutral] All right. I'll take it to the workshop when the hall's clear.
[N] He ties a red ribbon through the handle.
[Grey | neutral] Leave this on. It tells the others I've got work to do on it.
[Rowan | tense] Could I have hung it wrong?
[N] Grey looks up at the beam.
[Grey | neutral] The chain's seated properly. Plenty of room around the shade. I can't see anything wrong with how you hung it.
[N] Rowan releases a slow breath.
[Grey | neutral] I'll check the rest in better light. Come back tomorrow and I'll tell you what I find.
[N] He enters the fault in his work pad, then writes the reference on a second slip for you.
[N] Table seven. North side. First of September.
[N] You tuck it into your arrival card.
[N] Grey helps Rowan raise the lantern clear of the table until the room is empty enough to remove it.
[N] The red ribbon hangs below the shade, visible from the hall doors.
[N] Imogen retrieves her atlas. Around you, the remaining students begin collecting coats.

--- SECTION wrong-turn | place: corridor | time: evening | date: 2026-09-01 ---
[N] Your trunk is waiting with the others outside the hall. Rain beads on its straps where it was carried up from the lake.
[N] You take hold of the handle and follow Rowan towards the dormitory stairs.
[N] At the first turn, an arrow on the wall points to a door marked LINEN.
[N] Rowan stops.
[Rowan | neutral] That's wrong.
[N] He looks at your card, then back at the door.
[Rowan | amused] Unless they've moved my room into the cupboard over the summer.
[N] Cas kneels beside a rug farther down the corridor. His open notebook sits on the window ledge beneath one of his shoes.
[Cas | neutral] It should point the other way. I took it down a few minutes ago.
[N] He rises too quickly, leaving a roll of tape unwinding across the floor.
[Cas | neutral] The corner of this rug kept catching the trunks. I moved the sign so people would go round it while I fixed it.
[Imogen | attentive] It's sending them into the cupboard.
[Cas | neutral] Yes. I see that now.
[N] A bump sounds behind the linen door.
[Toby | neutral] Could somebody hold this open?
[N] Rowan catches the door before it swings shut. Toby is wedged beside his trunk, with a soft carrier tucked beneath one arm.
[Toby | neutral] The handle's caught. I thought there might be stairs at the back.
[N] You brace the trunk while Cas frees its strap from the latch.
[N] Something rustles inside Toby's carrier.
[Toby | neutral] That's my familiar. We're both having a rather bad time with doors.
[N] Imogen points two approaching students towards the actual stairway.
[N] Cas picks up his tape. Toby tries to tip the trunk back onto its wheels without tilting the carrier.
[DECISION arrival:corridor-job] Who will you help?
[OPTION sign] Help Cas put the sign back and secure the rug. | hint: Clear the route for the remaining arrivals. | journal: I helped Cas put the dormitory sign back and tape down the loose rug. We fixed the mistake without making a spectacle of it.
[OPTION trunk] Help Toby get his trunk to the stairs. | hint: Let him show you which end to carry. | journal: I helped Toby move his trunk, checking which handle to take so he could keep his familiar comfortable.
[END DECISION]
[IF arrival:corridor-job = sign]
[N] You set your bag down beside Cas's notebook.
[N] Rowan takes your lantern while you lift the sign from its temporary hook.
[N] Two pale marks show where it hung on the opposite wall. Cas points to the lower one.
[Cas | neutral] That hook. The top one's loose.
[N] You hold the sign steady while he settles its cord into place.
[N] From the hall doorway, the arrow now points clearly towards the stairs.
[Cas | neutral] I should have checked it from here.
[N] He fetches the tape and kneels beside the rug.
[N] You hold the raised corner flat while he presses a strip along its edge.
[N] Imogen brings over a small empty luggage trolley from the wall.
[Imogen | neutral] Let's try this before the next trunk does it for us.
[N] The wheels cross the seam with a faint click. The rug stays down.
[N] Cas makes one last pass over the tape with his palm.
[Cas | neutral] There. Properly, this time.
[N] Across the corridor, Rowan helps Toby ease his trunk onto another trolley.
[N] Imogen returns the one you used before its owner comes looking for it.
[END IF]
[IF arrival:corridor-job = trunk]
[N] You indicate the two handles on Toby's trunk, waiting for him to choose.
[Toby | neutral] The one nearest you, please. That corner's split, so it catches if we drag it.
[N] He steadies the carrier against his chest and takes the other handle.
[Toby | neutral] On three?
[N] You nod.
[N] The two of you lift the damaged corner over the threshold.
[N] Rowan takes your lantern so you can use both hands at the narrow turn.
[Rowan | warm] I've got this. Mind your fingers by the rail.
[N] Behind you, Imogen holds the sign while Cas fixes it back onto the opposite wall.
[N] Toby guides the trunk to the foot of the stairs in three short lifts.
[Toby | neutral] Thank you. It was my brother's trunk. He said it had plenty of journeys left in it.
[N] He inspects the split corner.
[Toby | neutral] I should have asked how many stairs.
[N] The dormitory steward brings a trolley over from the wall. Toby shows them the damaged hinge before they lift the trunk onto it.
[N] With his free hand, he finds a wrapped biscuit in his coat and offers it to you.
[Toby | neutral] This one's been nowhere near a fish.
[END IF]
[N] By the time you reach the stairs, the sign points the right way and the rug lies flat.
[N] Cas puts his shoe back on. Toby follows his trunk towards the landing, keeping the carrier level.
[N] Rowan returns your lantern.
[Imogen | warm] Breakfast starts at seven. The kitchen usually has warm rolls if you're there early.
[Rowan | neutral] Can I see your map a moment?
[N] You unfold the arrival card on the broad end of the banister.
[N] Rowan traces a route from the dormitory landing to the hall.
[Rowan | neutral] Down here, past the fountain, then left. That little square is the fountain. It looks like another staircase, but it isn't.
[N] Imogen marks the library door with a pencil dot.
[Imogen | attentive] In case you come looking. It's the door under the clock.
[N] At the next landing, they turn back towards their own rooms.
[Rowan | warm] See you tomorrow.

--- SECTION first-night | place: corridor | time: night | date: 2026-09-01 ---
[N] The dormitory steward exchanges your arrival card for a key, then returns the card with your room number written across the top.
[N] You pause beneath a lamp beside the landing window to read the rest.
[N] At the bottom, in smaller print, are the instructions for your first practical lesson: bring your brass lantern unlit. Kindle class, fourth of September.
[N] You tilt your lantern towards the light. The clean wick is still exactly as it should be.
[N] Through the window, you can see the last luggage being brought across the courtyard under a sheet of canvas.
[N] Somewhere along the corridor, a drawer opens with a squeal, followed by a muffled laugh.
[N] You put Grey's receipt inside your notebook. The page facing it is blank.
[DECISION arrival:night-intention] What will you write before you turn in?
[OPTION ask] Ask when I don't understand something. | hint: Give yourself permission to ask during your first lesson. | journal: On my first night, I decided to ask questions instead of pretending I understood.
[OPTION stay] Give a difficult task another try. | hint: Remember this when your first lesson gets difficult. | journal: On my first night, I decided to try again when something proved difficult, asking for help if I needed it.
[END DECISION]
[IF arrival:night-intention = ask]
[N] You write the sentence beneath the date.
[N] Below it, you add a small question about the lesson: how do you hold the lantern while you light it?
[N] There is room to write the answer underneath.
[END IF]
[IF arrival:night-intention = stay]
[N] You write the sentence beneath the date.
[N] After a moment, you add a reminder to ask the teacher what to change before trying again.
[N] The ink shines briefly beneath the landing lamp.
[END IF]
[N] At your room, the key turns stiffly on its first attempt, then slides smoothly the rest of the way.
[N] Your trunk stands just inside. A folded blanket waits at the foot of the bed.
[N] You make a place for your familiar before setting the lantern down beside the notebook.
[N] Out in the corridor, the voices grow fewer. Rain taps against the glass.
[N] Grey's receipt lies between the pages where you can find it in the morning.

--- SECTION open-house | place: heronmere | time: morning | date: 2026-09-02 ---
[N] Imogen is right about the rolls.
[N] By the time you leave breakfast, there is flour on one sleeve and a fresh card tucked inside your timetable.
[N] House common rooms are open to everyone until the midday bell. The card gives directions to all four.
[N] The route to Heronmere leads down a shallow flight of steps. Morning light fades behind you, replaced by a shifting green brightness beneath the door.
[N] Inside, broad underwater windows fill one wall.
[N] Fish pass between trailing stems beyond the glass. The light rippling across the ceiling comes from the lake above.
[N] Cushioned benches follow the windows. At the other end of the room, a fire burns beneath a shelf crowded with drying cups.
[N] A shallow pool lies between the entrance and the nearest table.
[N] You stop beside the first stepping stone.
[Noor | neutral] There's a path round the left, if you'd rather.
[N] A student at the low table looks up from an unfinished letter. A small feather has caught in her sleeve.
[Noor | neutral] I'm Noor. Come in. The kettle's just boiled.
[N] You follow the dry path around the pool.
[N] Noor moves her cup from a spare cushion. You set your bag beside it and exchange names.
[N] At the table near the fire, another student is measuring a cardboard staircase with a narrow ruler.
[N] He marks a line before looking up.
[Idris | neutral] Hello. Idris. I'd offer to clear this away, but I'm not quite sure it'll survive being picked up.
[N] One of the cardboard steps sags. He supports it with the ruler.
[Noor | neutral] He's visiting too. He came in for a cup of tea.
[Idris | neutral] About an hour ago.
[N] Noor pours a second cup and places it within your reach.
[Noor | neutral] These open mornings are just for the start of term. Later on, you come with someone from the house. There's a note beside each door explaining when.
[N] Several handwritten suggestions lie beside her letter. She gathers them into a stack to clear more space.
[N] The top one proposes an open study hour. The next asks whether the choral charms group can practise at the same time.
[Noor | neutral] I said I'd arrange the first study afternoon. Then people started leaving suggestions.
[N] She spreads the notes out again with a rueful glance at the pile.
[Noor | neutral] Someone needs quiet. Someone else wants singing. I have a room and a kettle.
[Idris | neutral] The quiet part matters to me as well. And the person who asked has hurt their knee. The library reading room is up another flight of stairs.
[N] A fish turns close to the window, flashing its pale side.
[N] Noor moves her letter beneath a book and puts a blank sheet on the table.
[Noor | neutral] What would you want to know before coming? You've had to find your way round all morning.
[N] The window benches sit apart from the larger tables. You can hear the fire clearly from here, and the scrape of Idris's ruler against the card.
[N] Singing would carry through the whole room.
[DECISION arrival:common-room-rule] What should the study-hour notice explain first?
[OPTION quiet] Set aside a quiet half hour before conversation starts. | hint: Let people know when they can read without interruptions. | journal: I helped Noor and Idris arrange a quiet half hour at the start of the study visit, with time for conversation afterwards.
[OPTION welcome] Explain where newcomers can sit and how to join in. | hint: Put the room's useful details on the invitation. | journal: I helped Noor write an invitation that explained where to sit, what to bring, and how to ask for a quieter place.
[END DECISION]
[IF arrival:common-room-rule = quiet]
[N] You divide the page into two parts: quiet study first, tea and conversation afterwards.
[N] Idris brings his ruler over and helps mark the times along the margin.
[Idris | neutral] I can answer questions on paper during the quiet part. I've plenty of scraps left from this.
[N] He indicates the staircase, now propped up by an empty cup.
[N] Noor writes a separate note to the singers, offering to find another time for their practice.
[Noor | neutral] They won't mind. They mostly wanted somewhere with tea afterwards.
[N] She reads the draft aloud, stopping at the word strictly.
[Noor | neutral] That makes it sound as if I'll throw someone out for sneezing.
[N] You cross out the word. The starting and finishing times say what is needed.
[N] Idris writes his name beside Noor's as someone to ask for help.
[Idris | neutral] I'll stay near the door at the beginning. That should save people having to whisper across the room.
[END IF]
[IF arrival:common-room-rule = welcome]
[N] You mark the door on a rough plan of the room, then indicate the empty seats around you.
[N] Noor begins listing what a visitor will need to know.
[Noor | neutral] Bags beside your chair. Cups by the fire. Any seat without somebody's things on it is free.
[N] She adds her name at the top of the notice.
[Noor | neutral] And ask me if you need somewhere quieter. I should put that on there.
[Idris | neutral] Could you say what to bring? I never know whether study groups expect you to have done the same reading.
[N] Noor writes that visitors may bring their own work, or a question they want help with.
[N] You add the window benches to the plan, away from the main conversation table.
[N] She sets the singers' note aside to answer separately.
[Noor | neutral] We'll find another hour for that. I don't think I can fit a choir into the quiet corner.
[END IF]
[N] A visitor pauses at the table while Noor reads the finished invitation aloud.
[N] They ask which day it is happening.
[N] Noor looks down at the carefully written time.
[Noor | neutral] Thursday. That's quite an important thing to have left off.
[N] You add the day above the time. Idris checks it against his calendar before anyone takes the notice away.
[N] Beside the noticeboard hangs a tally of house points. Recent entries mention garden work, a practical examination, and a flying match.
[N] Noor follows your glance as she reaches for a pin.
[Noor | neutral] Staff put the awards up after supper. The match results usually get the most attention.
[Idris | neutral] And occasionally an argument about the handwriting.
[N] One total has been crossed out and rewritten more clearly.
[N] Noor pins the study notice beside it.
[N] Idris returns to his cardboard staircase. This time, he lifts the base instead of the steps.
[Idris | neutral] It's the turn outside the library. When you're carrying books, you can't see the step round the corner.
[N] He tilts the model so you can see the narrow landing.
[Idris | neutral] I'm trying two layouts before I ask anyone to change the real one. This version needs a stronger fold.
[N] The ruler comes out again.
[N] At the midday bell, Noor collects the cups onto a tray.
[N] A basket of empty seed pots stands beneath the table. She lifts it onto a chair.
[Noor | neutral] Would you take these to the glasshouses this afternoon? Rhys left them after doing the window herbs. Only if you've time before supper.
[N] You check the open space on your timetable before taking the basket.
[N] Noor draws a small arrow on your map, from the courtyard to the glasshouse door.
[Noor | neutral] Rhys is usually at the far end. Anyone in there can show you.
[N] As you leave, a fish glides level with your shoulder on the other side of the glass.

--- SECTION glasshouse-errand | place: glasshouses | time: afternoon | date: 2026-09-02 ---
[N] The pots knock softly together as you cross the grounds.
[N] Rainwater still clings to the grass, but the glasshouse panes are dry. Beyond them, hanging leaves crowd the iron rafters.
[N] Warm, damp air touches your face when you open the door.
[N] The nearest plant has a thick root shaped remarkably like a scowling face.
[Saoirse | amused] It always looks like that. You haven't offended it.
[N] A student in muddy boots leans around the end of a bench. She holds a length of tubing in one hand.
[Saoirse | attentive] Mind the floor on your right. That's my fault.
[N] You stay on the dry stones and set the basket where she points.
[Saoirse | warm] I'm Saoirse. Are those for Rhys?
[N] You show her the note tied to the handle.
[N] She moves a jar to make room for the basket.
[Saoirse | neutral] She's at the far end. I can take them through in a minute, once I've dealt with this.
[N] A raised tank stands above several pots on the bench. Thin tubes run from a valve beneath it to the soil.
[N] A wooden float inside the tank is linked to the valve by a thin rod. The rod taps against its guide as the water level falls.
[N] One tube has slipped over the bench edge. Water drips from its end onto the stones.
[Saoirse | guarded] It was supposed to do the watering. For a little while, it did.
[N] A woman carrying a tray of seedlings appears in the inner doorway.
[Rhys | neutral] Saoirse, close the tap.
[N] Saoirse reaches beneath the tank. The tapping stops.
[Rhys | neutral] Thank you. Now take this tray so I can see where I'm putting my feet.
[N] Saoirse carries the seedlings to a dry bench.
[N] You move the basket out of the walkway.
[Rhys | warm] I'm Rhys. You must have brought my pots. Thank you for finding room for them among all this.
[N] She sets a shallow basin beneath the dripping tube.
[Rhys | neutral] Cloths are under the bench. Let's get the floor dry before we do anything else.
[N] You take a cloth. Beside you, Saoirse kneels to empty the overflowing catch tray.
[Saoirse | tense] I had it balanced before lunch. Then I put the back tubes in and the float started sticking.
[Rhys | neutral] When that happens, turn it off while you work. The seedlings can wait for a watering can.
[N] Saoirse nods, pressing her cloth into the narrow gap between two flagstones.
[N] Once the path is dry, Rhys examines the tank without touching the lever.
[Rhys | neutral] What are you trying to make it do?
[Saoirse | attentive] Measure out a little water for each pot. And reach the back row without anybody leaning right across the bench.
[Rhys | neutral] Both useful. Try it with empty pots first, over there where we can catch what comes out.
[N] She clears a space on a separate bench and puts the basin beneath it.
[Rhys | neutral] Leave the seedlings on their usual watering for now. Show me before you connect this to them again.
[N] Saoirse moves the tank while Rhys returns to the seedlings.
[N] The pots in your basket are small enough to fit three abreast in the basin.
[Saoirse | attentive] Those would do nicely. Would you help me try something? There's time before supper, if you aren't expected anywhere.
[N] She plugs their drainage holes with soft wax so they will hold water for the test.
[DECISION arrival:watering-method] How will you help test the watering system?
[OPTION measure] Compare how much water reaches each pot. | hint: Catch the water in empty pots and measure the difference. | journal: Saoirse and I tested the outlets over a basin. Different amounts reached the pots, even though the water came from the same tank.
[OPTION simplify] Try a single outlet before using the whole system. | hint: Start small and agree when to turn the water off. | journal: Saoirse and I reduced the watering system to one outlet. We agreed when to stop and tested it with an empty pot over a basin.
[END DECISION]
[IF arrival:watering-method = measure]
[N] You place three empty pots in the basin, one beneath each outlet.
[N] Saoirse marks the same height inside each with chalk.
[N] When she opens the tap, the first pot fills quickly. The second receives a thin stream; the third, a succession of drops.
[N] She shuts the tap as the water reaches the first chalk mark.
[Saoirse | tense] I measured what left the tank. I thought that meant each pot would get a third.
[N] You empty the pots and swap their positions for another short run.
[N] The water follows the same pattern.
[N] Saoirse traces the slowest tube with her finger. It has folded sharply behind the tank's stand.
[Saoirse | attentive] There. That's pinched shut.
[N] She straightens it and tries again.
[N] More water reaches the third pot, but the first still fills before the others.
[Saoirse | neutral] Better. Still too much at this end.
[N] She reaches towards the stand, then pauses beside your notes.
[Saoirse | attentive] Have you got that last result? I want to try it lower, but I'll forget which change did what.
[N] You finish recording the amounts before she moves the tank.
[N] At the lower height, the first pot fills more slowly. The three levels still differ when she closes the tap.
[Saoirse | warm] Keep that page. It's already clearer than the one I started with.
[N] She writes both your names at the top, leaving space beneath for the next trial.
[END IF]
[IF arrival:watering-method = simplify]
[N] You indicate the nearest outlet and a single empty pot.
[N] Saoirse looks along the branching tubes.
[Saoirse | guarded] I spent most of lunch connecting those.
[N] She turns the pot in her hands, then puts it in the basin.
[Saoirse | neutral] All right. Hold the tank steady while I take them off.
[N] With two tubes removed, you can see the lever clearly.
[N] Saoirse marks a line inside the pot.
[Saoirse | attentive] Tap off when it gets there. Or if the tube slips. If you see anything else going wrong, tell me to stop.
[N] She opens the valve a little at a time.
[N] Water runs into the pot. Inside the tank, the float descends with the falling water, then catches against its wooden guide.
[N] You point to the contact. Saoirse closes the tap.
[Saoirse | attentive] Oh. I couldn't see that with the other tubes in front.
[N] She marks the spot with chalk.
[N] On the next run, the float catches in the same place.
[Saoirse | attentive] It needs more room there. I'll ask Rhys before I move the bracket.
[N] You help her record what happened and the position of the chalk mark.
[N] The floor beneath the basin remains dry.
[Saoirse | amused] One pot, and no flood. I think we can tell her about this version.
[END IF]
[N] Rhys returns along the cleared path as the afternoon light begins to soften through the glass.
[N] Saoirse shows her the notes before touching the tap.
[Rhys | neutral] Show me how you stop it.
[N] Saoirse demonstrates the valve and points out the basin beneath the outlets.
[Saoirse | attentive] And if it catches or leaks, we turn it off before we adjust anything.
[N] Rhys checks the pots, then looks over the recorded results.
[Rhys | warm] That's something we can work with. Leave it here. We'll try it again tomorrow while I'm in.
[N] You rinse the borrowed pots and set them to drain.
[Saoirse | attentive] Could these stay on the test bench?
[N] Rhys agrees. Saoirse makes a small card for the pots and another for Noor's basket, explaining where they are.
[N] The supper bell sounds faintly through the closed panes.
[Saoirse | warm] Thank you for staying. I'll be back here tomorrow, if you want to see what happens.
[N] She puts the cloths beside the sink to dry.
[N] On your way out, she straightens the saucer beneath the scowling root.
[Saoirse | amused] There. You've got the best spot in the room. Try to look pleased.
[N] Its expression remains unchanged.

--- SECTION second-supper | place: lantern-hall | time: evening | date: 2026-09-02 ---
[N] The air outside has cooled while you were in the glasshouses. You carry the empty basket through the courtyard with damp cuffs against your wrists.
[N] At Lantern Hall, you leave it beneath the end of the table where Noor will be able to find it.
[N] Grey catches your attention before you sit down.
[N] His work pad is open at yesterday's report.
[Grey | neutral] I've checked that lantern. Nothing broken in the fitting. Wick's sound, too.
[N] He points to a short entry beneath the first one.
[Grey | neutral] The usual relighting charm wouldn't take. I've asked the warding teachers to have a look.
[N] Above the table, the lantern hangs dark with its red ribbon still attached.
[Grey | neutral] It stays marked until we know what's wrong. I'll tell you when I hear back.
[N] You copy the update beneath the reference in your notebook.
[N] Rowan comes over carrying two cups. He reads the page after Grey returns to the service door.
[Rowan | grave] He couldn't light it at all?
[N] His gaze travels from the notebook to the dark shade overhead.
[Rowan | neutral] I thought he'd have it working by breakfast.
[N] He puts a cup beside your place.
[Rowan | warm] How was the rest of your day?
[N] Before you can settle, Imogen arrives with Saoirse behind her. Saoirse carries her supper carefully around the end of the bench.
[Saoirse | warm] There you are. I wondered which table you'd be at.
[N] She sets her plate down and takes the space beside you.
[Imogen | attentive] You've met, then?
[Saoirse | neutral] In the glasshouses. I borrowed the person returning Rhys's pots.
[N] She takes the test notes from her pocket, keeping them clear of the gravy.
[IF arrival:watering-method = measure]
[Saoirse | amused] We found out that I was giving one plant nearly all the water. The other two would have had a miserable week.
[N] She shows Imogen the three recorded levels.
[END IF]
[IF arrival:watering-method = simplify]
[Saoirse | amused] We took most of my machine apart. The bit left over was much easier to catch misbehaving.
[N] She shows Imogen the drawing of the float catching against its support.
[END IF]
[N] Imogen studies the page, then passes it back before a serving bowl reaches that part of the table.
[Imogen | warm] Tell me how the next run goes.
[N] Noor comes to collect the basket. She reads the card tied to its handle.
[Noor | neutral] Oh, good. Rhys wanted those pots used.
[N] Rowan moves his cup so she can rest the basket on the bench.
[IF arrival:common-room-rule = quiet]
[Noor | neutral] The singers found another time. And Idris is bringing paper for questions tomorrow, so I think we're ready.
[END IF]
[IF arrival:common-room-rule = welcome]
[Noor | neutral] Two people have already asked about the window seats. I was able to point to our notice instead of explaining the whole room again.
[END IF]
[N] Noor accepts a cup and stays while the bread goes round.
[N] Rowan moves his books to make room for another plate. Imogen takes the atlas from the bottom of the stack before he lifts it.
[Rowan | amused] I had it this time.
[Imogen | amused] I'm sure you did.
[N] Saoirse tucks her muddy boots beneath the bench. The watering notes disappear into her pocket.
[N] By the time the meal is finished, someone has borrowed Imogen's pencil and Rowan has remembered where the spare napkins are kept.
[N] You spread your timetable over a dry part of the table.
[N] The first Kindle practical is on the fourth, two mornings away. You mark the room and add a reminder to bring your lantern.
[N] Thursday's study visit goes on the line above it.
[N] When you put the timetable away, Grey's receipt is still tucked behind the map.
[N] The lantern overhead remains dark. The people clearing the table work around its pool of shadow.
[N] Outside the hall, you recognise the turn towards the dormitories before reaching the sign.

--- SECTION study-hour | place: heronmere | time: afternoon | date: 2026-09-03 ---
[N] On Thursday afternoon, the study notice hangs at eye level beside the Heronmere door.
[N] The day and time are underlined. Noor's name appears beneath them.
[N] She is setting cups on a tray when you arrive.
[Noor | neutral] Come in. We haven't started yet.
[N] Idris has left a stack of scrap paper on a table near the entrance. His cardboard staircase occupies the window ledge, safely out of the way.
[IF arrival:common-room-rule = quiet]
[N] Noor waits until the first arrivals have settled before turning a small sand glass.
[Noor | neutral] We'll start with half an hour for reading. There's paper by the door if you'd like to ask something quietly. After that, we'll put the kettle on again.
[N] You choose a window seat and unfold your map beside tomorrow's timetable.
[N] Around you, pages turn. A dropped pencil rolls across the floor until someone stops it with a shoe.
[N] Idris passes a written answer back to the person at the next table.
[N] You follow Rowan's marked route from the stairs to the hall, then trace the way to the classroom.
[N] The library door sits beneath Imogen's pencil dot. The small square beside the landing is still a fountain.
[N] When the sand runs out, Noor carries the kettle to the larger table.
[N] Conversation begins there, while two people by the windows continue reading.
[Noor | neutral] That went well. I managed most of my letter.
[END IF]
[IF arrival:common-room-rule = welcome]
[N] Noor greets each arrival beside the notice, pointing out the cups and the seats by the windows.
[N] A student with a heavy bag asks where to put it. Another goes straight to the quieter benches with an open book.
[N] You join Idris at the larger table and spread out tomorrow's timetable.
[Idris | neutral] Charms classroom? Let's check the map.
[N] He follows the route with the blunt end of his pencil, stopping at the small square by the stairs.
[Idris | neutral] Another staircase there?
[N] You show him the fountain label Rowan added.
[Idris | neutral] Ah. That would explain why I couldn't find it yesterday.
[N] By the time the kettle needs refilling, an earlier arrival is showing someone else where to get a cup.
[N] Noor sits down beside her own work at last.
[Noor | neutral] Leave me that chair, would you? I think everyone knows where the tea is now.
[END IF]
[N] The visitor with the sore knee asks whether the spare paper can come closer to the low seats.
[N] Idris moves the tray to the table beside the pool.
[Idris | neutral] Better there?
[N] The visitor takes a sheet without needing to stand.
[N] You mark the new position on the notice so later arrivals will find it.
[N] As the afternoon draws on, the light beyond the windows turns from green to a deeper blue.
[N] Cups gather on the tray. Noor keeps the notice with its pencilled changes rather than replacing it with a clean sheet.
[Noor | neutral] I'll leave these notes for whoever does the next one. Especially the bit about the day.
[N] Idris adds a line about keeping the paper on the lower table.
[N] You help return a chair to the window, then fold the checked map inside your timetable.
[N] Tomorrow's practical has a room, a time, and a route you can follow. Your lantern is waiting upstairs, ready to bring with you.
[N] In the corridor beyond the common-room door, the lamps have begun to glow for the evening.

[EXIT 0] Stay with Rowan to follow up on the dark lantern.
[EXIT 1] Ask Rowan what his own first days here were like.
```

### Chapter 2

```
=== SCENE first-kindle | chapter 1 ===


--- SECTION before-practical | place: classroom | time: morning | date: 2026-09-04 ---
[N] Three mornings after your arrival, you find the charms classroom without asking for directions. This is a small achievement, and you allow yourself to enjoy it. The last two days have been full of lists: library hours, laundry days, where to leave wet boots, which bell means a lesson and which means somebody has burnt the toast. Today there is one clear instruction. Bring your lantern unlit.
[N] Grey’s answer came on your second evening, as promised. He found no broken fitting and could not relight the hall lantern with its usual charm. He has asked the warding teachers to examine it next. The red ribbon remains on the chain above your supper seat. The report in your notebook now has a second date and a sentence that ends with further checks. It is not the answer you hoped for, but it is an answer someone took the trouble to bring you.
[N] The classroom smells of chalk and warm metal. Brass instruments occupy the shelves, their polished edges catching the window light. On each desk is a stone mat, a shallow dish of sand, and a square of ordinary paper. Rowan has taken a place near the middle. He holds up an empty hand to show that the chair beside him is free of books.
[Rowan | amused] I have reformed. The books have their own chair at the back. We are all finding the separation difficult.
[N] The teacher at the front is unpacking lanterns from a crate. He has put the most elaborate one aside: a delicate spiral of brass with a flame-shaped finial. The one he places on his own mat is dented and rather plain. When the spiral catches his sleeve, he untangles it, looks at the class, and leaves it in the crate.
[Elian Vale | neutral] Elian Vale. Introductory charms and firecraft. If you came for the spiral lantern, I sympathise. It is very attractive and explains almost nothing.
[Elian Vale | neutral] By the end of this practical, you should be able to start a small light, keep it at a useful warmth, and stop it deliberately. Those are three separate jobs. Making the biggest flame is not a fourth job that I have forgotten to mention.
[N] He puts his lantern on the stone mat and moves the paper square close to the casing. He shows you where the sand goes if a wick catches unexpectedly, where the stop mark is stamped on each handle, and how to leave room for a partner’s elbow. Nobody casts yet. The lesson begins with everybody moving their bags off the floor.
[Elian Vale | neutral] Watch once. Then tell me which part was too quick.
[N] His fingers trace a small arc. The wick glows, steadies, and goes out under his thumb. It takes perhaps two breaths. Rowan watches with his head tilted, already rehearsing the movement against the edge of his desk. You saw a hand move and a light appear. The space between those events contains everything you do not know.
[IF arrival:night-intention = ask]
[N] The sentence from your first night returns with inconvenient clarity. One honest question counts. You ask what Elian was doing before his fingers moved. He pauses with his thumb still on the stop mark, then lowers the lantern. The pause lasts long enough for you to worry that this was the wrong question.
[Elian Vale | neutral] Choosing how much warmth I wanted. I left out the part I have been doing longest. Thank you. Let us put that part back into the demonstration.
[END IF]
[IF arrival:night-intention = stay]
[N] You start to copy the movement, stop, and put your hand flat on the desk. Giving this a second attempt will not help if you do not know what the first attempt is for. You ask Elian to repeat the moment before his fingers moved. A second attempt may need help. You are already making use of the small amendment in your notebook.
[Elian Vale | neutral] Yes. And this time I will describe it while I do it. A demonstration you cannot repeat is mostly a performance.
[END IF]
[IF arrival:night-intention = (none)]
[N] You ask him to repeat the moment before his fingers moved. He pauses, then smiles at the plain lantern as though it has caught him out. He was deciding how much warmth to make, he says. He has done that part so often that he forgot it was something a new learner would need to see.
[END IF]
[N] This time he speaks slowly. The desired result is warmth enough to kindle the prepared wick, confined inside the lantern. He pictures a cup he can hold comfortably, then makes the little arc. The light appears more slowly because he is pausing to explain. You can follow the sequence. The result looks less impressive and far more possible.
[Elian Vale | neutral] The paper is your witness. If it browns, you have supplied more heat than the exercise needs. If the light goes out, we learn which part needs attention. Neither result gives you permission to conceal the evidence under your mat.

--- SECTION partners | place: classroom | time: morning | date: 2026-09-04 ---
[IF arrival:common-room-rule = quiet]
[N] Before the partner work begins, Rowan asks whether you want him to talk through the instructions while you try. You remember how much clearer the study notice became when quiet had a beginning and an end. You ask for one silent attempt, then comments afterwards. Rowan agrees and puts the pencil across his notebook as a reminder. It is a small arrangement, easy to change if it does not help, and much easier than trying to concentrate while also wondering how to ask someone to stop speaking.
[Rowan | warm] One attempt, then observations. If I start narrating, point at the pencil. I am giving you permission before I discover how much I enjoy the sound of my own helpfulness.
[END IF]
[IF arrival:common-room-rule = welcome]
[N] Before the partner work begins, you ask Rowan to describe what the observer is supposed to do. Making Noor’s invitation clearer taught you how much can hide inside a familiar word. Rowan checks the instruction card instead of guessing. The observer watches the paper, counts the breaths, and says stop if anything leaves the mat. You each repeat the list in your own words. You will still make mistakes, but at least neither of you has to make them while trying to infer the other person’s job.
[Rowan | amused] I had imagined standing nearby and looking encouraging. This is much more useful. My encouraging expression is available as an optional extra.
[END IF]
[N] You work in pairs, one casting and one observing. Rowan offers to go first, then catches himself and asks which you would prefer. You let him take the first turn. He sets his lantern squarely on the mat, pushes his sleeves back, and produces a flame that rises beautifully for half a second before vanishing. His hand stays in the air after the light has gone.
[Rowan | amused] That was the short version. Particularly convenient if you are late for something.
[N] The paper beside his lantern has curled at one corner. Rowan notices it just after you do. His smile holds for another moment, then becomes effort. Around you, other desks have begun to produce small successes and occasional bright mistakes. A lantern near the window makes a noise like a hiccup. Its owner laughs so loudly that Rowan looks away.
[N] You are supposed to tell your partner what happened, not decide whether they are talented. Rowan waits with his hand on the cold handle.
[DECISION first-kindle:partner-response] What will you offer Rowan?
[OPTION observe] Describe the curled paper and try a smaller flame. | hint: Keep the feedback specific and practical. | journal: In the first Kindle practical, I helped Rowan use the curled paper as evidence and try a smaller flame.
[OPTION swap] Take a turn and ask Rowan to observe you. | hint: Share the risk of being a beginner. | journal: In the first Kindle practical, I took a turn and trusted Rowan to observe my attempt.
[END DECISION]
[IF first-kindle:partner-response = observe]
[N] You point to the curled corner and say exactly when you saw it move. Rowan lowers his hand. Together you put a fresh square beside the old one so the difference will be visible. You suggest aiming for a flame too small to impress anyone. He lets out a breath through his nose, almost a laugh, and agrees to attempt something deeply unimpressive.
[Rowan | shy] I keep thinking that if it looks easy, people will not ask whether I know what I am doing. That is a terrible plan in a room where the entire point is learning what we are doing.
[N] His second flame is hardly taller than the wick. You count five breaths while he holds it. The paper stays flat. When he presses the stop mark, the light disappears cleanly. You put a tick beside stable rather than writing perfect. Rowan sees the word, then takes the pencil and adds repeatable, followed by a question mark.
[END IF]
[IF first-kindle:partner-response = swap]
[N] You move your own lantern onto the mat. The exchange gives Rowan something new to do with his hands: hold the pencil, place fresh paper, turn the observation sheet toward the window. You make the arc too sharply. Nothing catches. You try again and feel a brief warmth in the handle, but the wick remains dark.
[Rowan | warm] You slowed down on the second try. The handle warmed before you stopped. I can put that down, if it is useful. It looked as though something started.
[N] It is useful. Your third attempt produces a small light, and Rowan is too busy counting breaths to make a joke about his own failure. When you stop it, he reads the observations back. You trade places again. He makes a smaller flame this time. His paper stays flat. Both of you have evidence of something you can repeat.
[END IF]
[N] Elian comes to your desk after helping the student with the hiccupping lantern. He reads the observation sheet before looking at either flame. That order matters. Rowan does not have to begin by announcing whether he succeeded. There is already a record of what he tried and what changed.
[IF arrival:first-observation = frame]
[Rowan | warm] We did this with the hall lantern. Checked what we could touch, then wrote down what we could not explain. I think I forgot the second half when it was my own spell.
[Elian Vale | neutral] That is often when it gets difficult. Keep the observation and the explanation on different lines. You can revise one without throwing away the other.
[END IF]
[IF arrival:first-observation = record]
[N] You show Elian the three columns Imogen used on the night of your arrival. Seen, heard, guessed. He asks permission to borrow the headings for the board. You give it, and he writes Imogen’s name in brackets beneath them. Rowan watches the chalk, then draws the same columns on your practice sheet.
[END IF]
[IF arrival:first-observation = (none)]
[Elian Vale | neutral] Put what happened on one line and your explanation underneath. If the explanation changes, the observation will still be useful.
[END IF]
[N] Elian asks you to cast while he watches. Your light catches, but your shoulders rise as you concentrate. He points this out without touching you. You lower them, and the flame settles. He has you stop it, move the lantern to a different corner of the mat, and begin again. A spell that works only in one carefully arranged position is not ready to travel in a school bag.
[Elian Vale | neutral] You may need several attempts. Use the same safe target each time: a little warmth, held steadily. The gesture helps you remember the sequence; it is not a race your fingers have to win.
[N] You begin again. The arc is smaller now. The wick brightens; the handle warms; the paper remains white. Rowan counts quietly, leaving enough time between numbers for you to breathe. At five, you stop the light deliberately. At the next attempt you do not need him to count. He notices, but waits until you have finished before saying anything.
[Rowan | warm] That one was yours all the way through. I was still on three when you decided to stop.
[N] Elian puts a small mark beside your names on his class sheet. He tells you both to repeat the exercise during open practice before attempting it without supervision. The mark does not feel like a verdict. It records a particular thing, done in a particular room, that you could now explain to someone who had not seen it. Your lantern is warm in your hands for a reason you understand.

--- SECTION voice-in-flame | place: classroom | time: morning | date: 2026-09-04 ---
[N] There is time for one last supervised attempt while Elian collects the used paper. You set the lantern down and kindle the wick. The light holds. Rowan reaches for the pencil, then stops. Beneath the little crackle of the flame, a voice speaks so softly that you first mistake it for somebody at the next desk.
[N] Remember the way home.
[N] The words are clear. The voice is not familiar. You turn toward the next desk, but its occupants are arguing about whether a scorch mark resembles a rabbit. Rowan is looking at your lantern. The flame has not changed colour. There is no face in it, no shape that explains what you heard. You press the stop mark. The light goes out.
[Rowan | tense] Did you hear that?
[N] You nod before either of you repeats the words. Elian sees the movement and comes over. He asks you to keep the lantern on the mat. Then he gives Rowan a clean scrap of paper and asks each of you to write what you heard before comparing accounts. It is the first time a classroom instruction has made the room feel safer by making it stranger.
[N] You write the five words. Beneath them there is room for the part you are less certain how to describe. Elian waits without leaning over your shoulder.
[DECISION first-kindle:voice-account] What will you add to your account?
[OPTION uncertainty] I heard the words, but I cannot identify the source. | hint: Keep the record limited to what you can establish. | journal: I told Elian I heard Remember the way home but could not identify its source. He kept my account beside Rowan’s.
[OPTION feeling] It sounded directed at me, though I cannot prove that. | hint: Describe the feeling as a feeling, not a fact. | journal: I told Elian the voice felt directed at me while making clear that this was an impression, not proof.
[END DECISION]
[IF first-kindle:voice-account = uncertainty]
[Elian Vale | neutral] That is a useful distinction. Hearing words does not tell us where they began. I will keep the uncertainty in the report; it belongs there.
[N] He writes source unconfirmed beneath both accounts. Rowan’s paper contains the same five words, with a question mark after home. Seeing the match makes your stomach tighten. Seeing the question mark helps. Neither of you has to turn the experience into a story before you leave the room.
[END IF]
[IF first-kindle:voice-account = feeling]
[Elian Vale | neutral] I will record that as your impression. You are allowed to describe how something felt without having to defend it as a measurement.
[N] Rowan says the words felt directed at the room rather than at him. Elian writes that down too. The difference does not cancel your experience. It gives the report something precise that an explanation will eventually need to account for. You are unexpectedly grateful that he does not ask either of you to agree with the other.
[END IF]
[N] With your permission, Elian examines the lantern while you watch. The wick is ordinary prepared fibre. The handle bears your name and a maker’s stamp. He repeats Kindle twice, changing nothing else that he can identify. Both times, the light behaves like a light. The classroom continues to sound like a classroom.
[Elian Vale | neutral] I cannot reproduce it. That does not tell me you imagined it. It tells me I cannot reproduce it. I will ask the warding staff whether it could be an old echo caught in the fitting. Until we know, bring this lantern to supervised practice.
[Rowan | grave] There was a problem with the lantern over our table on the first night. Grey has the report. Could this be part of it?
[Elian Vale | neutral] It could. It could also be two different problems. Give me Grey’s report number and I can put the accounts together without pretending we have joined the causes.
[N] You unfold the arrival card from your notebook. Grey’s receipt has softened along its crease, but the number is legible. Elian copies it beside today’s date. The scrap of paper you almost left behind on your first night has become useful in a room you had not yet entered. You place it back between the pages more carefully.
[N] The bell rings. Chairs scrape, bags are recovered, and the student near the window shows someone a scorch mark that now apparently resembles a hare. Elian asks whether you would like a few quiet minutes before leaving. You do. Rowan stays to stack the unused mats. This time he carries only two.

--- SECTION packing-up | place: classroom | time: morning | date: 2026-09-04 ---
[IF arrival:watering-method = measure]
[N] While packing your lantern, you remember the three pots on Saoirse’s bench. The amount leaving the tank did not prove how much reached a plant. In the same way, knowing what your hand intended does not establish where the voice began. You add a note beneath your account: the light stayed steady while the words were heard. It might matter later, or it might remain an ordinary detail beside a strange one. You hand the addition to Elian before leaving. He dates it and clips it to the first page.
[Elian Vale | neutral] Good. Keep adding observations as you remember them, and mark when you remembered. That lets us distinguish the account you made immediately from the details you recalled after thinking about it.
[END IF]
[IF arrival:watering-method = simplify]
[N] While packing your lantern, you remember how much easier Saoirse’s machine became to understand after two outlets were removed. You ask Elian whether he changed anything between his two attempts to reproduce the voice. He says he kept the lantern, mat, and gesture the same. The person casting was different from your attempt, of course. He writes that distinction down when you point it out. A question about the method has become something the teacher can use. You did not need to know more magic than he does to ask it.
[Elian Vale | neutral] Next time, if you are comfortable, we can compare one thing at a time. We will agree when to stop before we begin. I will not keep asking you to repeat an unsettling experience just because I want an answer.
[END IF]

--- SECTION lesson-aftermath | place: corridor | time: morning | date: 2026-09-04 ---
[N] Outside, the corridor is full of people arriving for the next lesson. For a moment you stand against the wall and let them pass. Rowan keeps his lantern in both hands. You can hear the fountain now that you know where it is: a steady little sound beneath the shoes and voices. The academy has continued to be ordinary in several directions at once.
[Rowan | amused] We could pretend that was normal. I have been doing a fairly convincing version of that for nearly ten minutes.
[N] Imogen is waiting beside the library noticeboard with the atlas against her hip. She intended to ask whether you had both set anything on fire. The question leaves her face when she sees the two of you. You tell her about the practical first, then the voice. She listens without opening the atlas.
[Imogen | attentive] And the teacher has both accounts? Good. I can look for the phrase without deciding it is a prophecy. Libraries contain quite enough bad poetry to make that an important distinction.
[IF arrival:corridor-job = sign]
[N] Cas passes with a roll of fresh tape. He stops to tell you that the sign is still in place and that three luggage trolleys crossed the repaired rug this morning. He thought you might want to know. You do. The small report brings the corridor back into focus: a problem you helped with has stayed solved overnight.
[END IF]
[IF arrival:corridor-job = trunk]
[N] Toby passes with his bag properly buckled and no trunk in tow. The steward found a replacement hinge, he tells you. He has written your name on the spare biscuit wrapper so he will remember to save you a seat at supper. You tell him you do not require another biscuit. He considers that, then says he will save the seat anyway.
[END IF]
[IF arrival:corridor-job = (none)]
[N] A luggage trolley crosses the rug without catching. Cas, kneeling at the far edge with a roll of tape, watches it pass and makes a satisfied mark in his notebook. The small, completed job is a relief to look at.
[END IF]
[N] The phrase could be in a song, a maker’s instruction, an old welcome, or nowhere Imogen knows to look. Rowan can ask about the lantern practice while she checks the library catalogue. You can begin with either of them. For once, an unanswered question has produced two possible next steps instead of a blank space.
[Rowan | warm] I would like to find out with you. We can still stop for lunch. I do not think mysterious voices are entitled to every hour of the day.
[N] You look at your lantern. It is no longer merely something with your name on it that the academy sent across the water. You know how its handle warms, how much light its wick needs, and where to press when you want it to stop. There is a question inside it that you cannot answer. There is also a small useful thing you have learned to do.

[EXIT 0] Promise to look into it together.
[EXIT 1] Suggest finding someone who knows the old stories.
```

### Chapter 3

```
=== SCENE register | chapter 2 ===


--- SECTION catalogue-request | place: library | time: evening | date: 2026-09-18 ---
[N] By the eighteenth of September, your days have acquired a shape. There is a particular stair you take after breakfast, a place where you leave damp shoes, and a page in your notebook devoted to things you must ask before the next practical. The extinguished hall lantern has acquired a shape too: an unresolved entry, copied forward whenever you start a new page. Grey has found no fault in its fitting. Elian has repeated your first Kindle demonstration without hearing a voice. Those are the facts you bring to the library.
[N] The green lamps are already lit. Beyond the tall window, the last blue of evening rests between the branches. Imogen has chosen a table beside the ironwork shelves, where there is space for two notebooks and the large atlas she has borrowed. She moves her own notebook when she sees you. The empty space has been measured with rather more care than she wants you to notice.
[Imogen | warm] I saved you the chair that does not rock. This involved a small exchange with somebody revising protective circles. No wards were broken. I think.
[N] The atlas contains a map of the mere. Tiny names follow the shore, squeezed into curves of ink beside landing places and old paths. Some are names of buildings. Some appear to be people. Imogen has marked the page with a clean strip of paper. You recognise the boathouse, although the drawing gives it an extra roof and a much more confident chimney.
[Imogen | attentive] The catalogue calls these dedication marks. I thought that meant the people who paid for the lanterns. But there is a cross-reference to a register, and the register has a cross-reference to maintenance. I would like to know why a dedication needs a maintenance record.
[IF arrival:first-observation = record]
[Imogen | warm] I have kept the columns we made at supper: what happened, who noticed, what we still need to ask. There is a fourth one now. Where did we get that answer?
[END IF]
[IF arrival:first-observation = frame]
[N] You tell her that the frame above your supper place was cold before anyone tried to relight it. Imogen adds this beside the maintenance reference. She asks whether you wrote the time down. You did not. She leaves the space empty instead of supplying a time that would look tidy.
[END IF]
[IF arrival:first-observation = (none)]
[N] Imogen draws a line down a fresh page and labels one side observations and the other questions. You begin with the lantern and the classroom voice, keeping the accounts separate.
[END IF]
[N] Dunne comes to the table carrying three request slips and no books. She sets the slips down beyond the edge of the atlas. Her spectacles hang against the buttons of her blouse. Imogen straightens in her chair, then sits back as though she has caught herself rehearsing for an examination.
[Dunne | neutral] Tell me what you need to find out. The restricted shelf contains fragile bindings, not better answers. If the question belongs in a working ledger, I would rather fetch you a working ledger.
[Imogen | tense] Why the academy is forgetting its lights.
[N] Dunne waits. Imogen looks down at the atlas. The question she has carried here seemed small enough while it lived in her notebook. Spoken beneath the library ceiling, it asks Dunne to bring almost the whole building to your table. After a moment Imogen turns the page marker sideways and begins again.
[Imogen | attentive] Who was recorded as keeping the shore lanterns, and whether the way those people were recorded changed. We can start with one lantern if that is manageable.
[Dunne | attentive] That I can help with. You may consult the public register here. No ink at this table, and no spell on a binding without supervision. I have asked Quill to join us; some of the headings use an older sense of keeper.
[N] Maelin Quill arrives with a folded teaching sheet tucked inside a book. Their moss-green coat has a narrow woven border, worn smooth where it meets the desk. Copper spectacles catch the lamp as they introduce themselves: history and rune languages. They ask to see the catalogue reference before the atlas. Imogen slides both across, and Quill thanks her for leaving the shelf number visible.
[Maelin Quill | neutral] Maelin will do at a reading table. In an assessment, Lecturer Quill is helpful, mostly because it reminds me not to answer my own questions. What have you brought that we can compare?
[N] Dunne offers two starting points. The atlas gives a date for the shore fittings. Grey’s maintenance note records a small maker’s mark on your hall lantern. Either might lead to a useful comparison, but you have time to begin with only one before the evening returns arrive.
[DECISION register:search-method] Where will you start the search?
[OPTION dates] Follow the dates in the atlas. | journal: We began the register search with dated shore entries, keeping the hall lantern as a separate comparison.
[OPTION makers] Follow the maker’s mark in Grey’s note. | journal: We began the register search with the lantern maker’s mark and checked it against dated entries.
[END DECISION]
[IF register:search-method = dates]
[N] You copy the atlas date onto the request slip. Dunne brings a narrow index whose pages have the polished edges of frequent use. Two entries share the date: the dedication and the following morning’s inspection. Imogen almost copies only the first, then adds the second. The difference is a single day and a different person holding the pen.
[Dunne | attentive] A ceremony and a completed job do not always happen together. Keep both references. Otherwise the index will quietly answer a smaller question than the one you asked.
[END IF]
[IF register:search-method = makers]
[N] The mark in Grey’s note resembles a bent reed. You find it in an illustrated list of fittings, where its name is given as Reed & Daughters. The firm supplied lamps for both the hall and the shore over several decades. That connects the objects, but does not yet connect the failure. Maelin points out the date column before you can treat the shared stamp as an explanation.
[Maelin Quill | neutral] The same workshop can make a thousand lamps that have a thousand different histories. We need a pair of entries close enough in date that we know which work we are discussing.
[END IF]
[N] By the time the return trolley reaches your table, the slip has two usable references and a smudge from your thumb. Dunne checks the numbers, writes her own initials beside them, and takes a key from the chain at her waist. Imogen watches the gate open. For once, she does not move ahead of the person who knows which shelf will bear her weight.

--- SECTION missing-names | place: library | time: evening | date: 2026-09-18 ---
[N] The register is heavier than it looks. Dunne settles it on a green support cushion and opens it a little at a time, letting the spine decide how far it will go. Its brass weights rest on the outside corners. The working ledger stays closed at the left until there is room for it. Nobody places one book on top of another. The arrangement makes the table feel less like a place for an exciting discovery and more like a place where something could be damaged by hurry.
[IMAGE register-study] An intact register on a green cushion under a library lamp, with blank name cells between filled rows and separate comparison slips.
[N] Under the lamp, the formal register shows a repeating pattern. Dates and payment amounts continue down the page. Several short cells in the name column are empty. The ruled lines run through those spaces without a break; you see no torn paper or scraped patch. Two comparison slips lie beside the book. This page shows omissions. It does not show who made them or why.
[Imogen | grave] Somebody rubbed them out.
[N] Dunne shifts the lamp a little so its light falls across the paper. At this angle the surface has a fine uneven grain. You can see where an old pen pressed too hard in the payment column, and where a corner has been mended. The empty name cells have neither the roughness of the mend nor the pressure marks of the writing.
[Dunne | attentive] Perhaps an earlier copy had names. This copy gives us no sign of rubbing. Write what the page permits, Imogen. We can ask the stronger question after we have earned it.
[N] The first comparison is disappointingly ordinary. An inspection entry names M. Fen as the person who repaired a shore fitting and checked its wick. The matching formal entry lists the date, the lamp, and the cost. The space for a keeper is empty. Imogen looks from one book to the other, then checks the reference numbers again. You count the digits aloud. They agree.
[Maelin Quill | neutral] One missing name may be an unfinished entry. Two may be a copying habit. We should choose a second example before we decide we have found a rule.
[N] The next pair concerns a lamp on the kitchen approach. Its working entry records A. Moss replacing the shelter and waiting until the evening handover. In the formal register, the shelter and its price remain; the person and the waiting do not. A third pair names a student who carried a repaired lamp back to the landing place. The dedication entry credits the original donor and says nothing about the return.
[Imogen | attentive] The things bought are carried forward. The people doing the work are not, unless they also paid for it. That happens in all three pairs.
[Maelin Quill | neutral] In these three pairs. A useful finding. We will keep the numbers beside it so another reader can disagree by checking, rather than by trusting either of us.
[N] Maelin unfolds their teaching sheet. You recognise its border from notices outside the history room. Under a diagram of the shore, a short note describes keepers as patrons who endowed the lights. Maelin lays the sheet beside the working entry and is quiet for several breaths. Imogen’s fingers tighten around her pencil. She looks ready to defend the ledger against the printed page.
[Maelin Quill | reflective] I used the dedication index when I wrote this. It was a convenient source for the diagram. Apparently it was a less convenient source for the people.
[N] They show you the older heading in the working ledger. Its last mark turns back toward the beginning of the word. In a donor’s list, keeper can mean the person responsible for payment. Beside a record of daily tasks, the same word can mean the person who remains to finish them. The heading alone cannot choose between those meanings. Maelin has used the first without explaining why.
[Maelin Quill | neutral] Grey uses a descendant of this ledger. Ask what the handover actually involves. We have been reading a verb as if it were a title. Someone who does the work may be able to put the movement back into it.
[N] Dunne gives you a clean comparison slip for each reference. You copy the names exactly as written, initials and all. There is no satisfying way to turn M. Fen into a full biography from this room. The uncertainty irritates Imogen; you can hear it in the short strokes of her pencil. Still, she leaves the initial intact.
[Dunne | attentive] Leave the originals here. Grey can correct your copy, and I can check it afterwards. If someone else lends you a record, ask how they want it returned. Borrowing a story is still borrowing.

--- SECTION working-record | place: old-cloisters | time: evening | date: 2026-09-18 ---
[N] Grey is at the old cloisters with a toolbox open on the paving beside him. He has lifted a loose threshold strip and set it where nobody can tread on the nails. Before you mention the register, he asks you to stand at the turn in the passage while a pair of students carry a long box through. You hold your notes against your chest and become, briefly, a warning sign.
[IF arrival:corridor-job = sign]
[Grey | neutral] You know this corner now. The sign you helped with has kept its arrow, even after somebody tried to hang a scarf over it. Let them past and I will have a look at your paper.
[END IF]
[IF arrival:corridor-job = trunk]
[Grey | neutral] You and Toby had the right of it with that trunk. Clear the turning space first. It remains excellent advice even when the luggage has become a wardrobe.
[END IF]
[IF arrival:corridor-job = (none)]
[Grey | neutral] Grey, if we have not had a proper introduction. I keep these corridors usable. Today that means persuading a threshold not to collect ankles.
[END IF]
[N] When the box has gone, Grey checks the loose strip once more before taking your slip. He reads it with one hand braced on his knee. You expect him to recognise the initials at once. He does not. He knows the lamp positions, however, and the abbreviations for shelter, wick, and handover. At the last of these he makes a small sound of recognition.
[Grey | neutral] I cannot give you Fen’s first name. The shore fittings have been through more hands than mine. But waiting until handover means something. Whoever wrote that had not simply finished tightening a screw.
[N] Grey has another repair to finish before supper. He can explain the handover from his own practice or show you how his current work record preserves it. Imogen holds the pencil poised above a fresh page, careful this time to leave room for the answer.
[DECISION register:worker-question] What will you ask Grey to show you?
[OPTION practice] Ask what happens during a handover. | journal: Grey described staying with a returning student until the next keeper arrived; we recorded his present-day account separately from the old ledger.
[OPTION record] Ask how a working keeper is recorded. | journal: Grey showed us a current handover entry and explained why the worker and the next keeper both sign it.
[END DECISION]
[IF register:worker-question = practice]
[Grey | neutral] Last week a student missed the supper bell. Bad weather, poor sense of direction, nothing more mysterious than that. I had finished the repair by the landing, but I stayed until somebody came to walk back with them. The lamp was lit before they arrived. It settled warmer when they knew which way to go.
[N] Imogen asks whether the student caused the change. Grey shakes his head. He had adjusted the shelter too, and the wind was dropping. He can tell you what happened together, not which part caused which. Then he shows you the present-day note so you can write down the date. You copy his words about staying without turning them into proof that the same thing happened a century ago.
[END IF]
[IF register:worker-question = record]
[N] Grey takes a narrow book from the inside of his coat. The current entry has two names: his and the person who took the next round. Between them is a note that a returning student was met at the landing. He covers a separate line containing the student’s room number before handing the book across. You do not need that detail to understand the job.
[Grey | neutral] One signature says I stayed. The other says somebody was there when I left. If I only wrote lamp repaired, the next person would not know whether anyone had met the boat. That is how an accurate sentence can leave you with an unfinished job.
[END IF]
[N] The old wording reminds Grey of a loose instruction leaf kept with the maintenance copies. He fetches it from a shallow drawer inside the cloister office, wrapped in plain paper. Its corners are soft and its print is uneven. A line near the bottom directs keepers to leave a light where a returning traveller will see a familiar way, and to remain until the traveller is received. Grey places it on top of your copy, not inside it.
[Grey | neutral] Dunne has the archive copy. This is the one we use. Take the reference and ask her to compare it; I would rather keep this here for whoever comes on after me. If she needs to see the paper itself, I will bring it over when the threshold is safe.
[N] He returns to the strip of wood before Imogen has finished copying. There is an awkward moment in which the mystery seems to expect him to wait while the corridor needs him to work. You crouch to collect the loose nails into their tray. Imogen checks the passage again. The explanation continues between practical interruptions, and you begin to understand why a formal record might miss this kind of time.
[Imogen | attentive] May we quote the part about staying? With your name, and today’s date. We will keep the older instruction separate.
[Grey | neutral] Yes. Write that it is how I understand the work now. If you find out they once did it differently, you can bring that back too.
[N] You wait while he seats the last screw. When the strip is secure, Grey walks across it, then asks you to try. Nothing creaks or catches. The improvement is almost impossible to describe once it has happened: a place you can pass through without thinking about your feet. Imogen writes the instruction-leaf reference beneath his quotation. At the bottom she adds, with a small look toward you, return with what we find.

--- SECTION supervised-echo | place: library | time: night | date: 2026-09-18 ---
[N] The high window has darkened by the time you return. Dunne has found the archive copy of Grey’s instruction leaf. Its wording matches your transcription, including an old spelling that Imogen had nearly corrected. Maelin reads the line about a familiar way twice. The phrase sits uncomfortably close to the voice in your Kindle flame, but neither of you has heard the whole instruction spoken.
[Imogen | grave] Remember the way home. That could belong to the same practice. It does not tell us whose voice we heard.
[Maelin Quill | neutral] Agreed. We can ask whether the objects hold traces of that practice. Echosight may help, provided we decide beforehand what it cannot answer. A memory is not a witness we can cross-examine until it agrees.
[N] For the demonstration, Maelin produces an ordinary teaching card. One corner has been folded back. They set it on a clear patch of the table and explain that they used it in their own lesson that morning. It is theirs to offer, and you may stop whenever you wish. The register remains beyond reach, its weights undisturbed. Your first attempt will not be made on a fragile object or someone else’s private letter.
[Maelin Quill | neutral] Two fingers beside the fold. One patient breath. Notice the trace without demanding a particular image. When you lift your hand, let it go. You are not trying to hold the morning here.
[N] You try the motion without magic first. The card is cool; the crease has a rough edge; the lamp casts a clear shadow from your fingers. Maelin asks you to remember those ordinary sensations so you will not mistake every detail for an echo. Imogen copies the instruction in smaller writing than usual, leaving the centre of the page for what actually happens.
[N] On the second attempt, a brief impression crosses the card: the weight of a book placed against its edge, a scrape, a little impatience. It vanishes before you can decide whether the feeling belongs to you. You lift your hand. The card is still a card. The library is still audible around you, a chair moving at the far table and the soft click of Dunne’s keys.
[Maelin Quill | neutral] I put a dictionary on it this morning because the corner kept lifting. The scrape is consistent with that. I cannot verify the impatience for you. I was also trying to remember whether I had left my door open.
[N] Imogen tries next. She reports pressure along one edge and no scrape at all. You feel a small, unreasonable urge to defend your own account. Maelin gives each of you a separate space on the page. Neither version replaces the other. Then they turn the card over and point to an ink stain neither of you noticed. There was more to the morning than either echo showed.
[Maelin Quill | neutral] Incomplete does not mean useless. It means we keep the ordinary evidence. Especially when a magical impression makes a very satisfying story.
[N] Dunne agrees to one supervised observation of the working ledger, from the clean margin beside the entry you have already read. She checks the binding, removes a weight, and tells you exactly where your hand may rest. Maelin will end the observation if it becomes difficult to release. There is no invitation to search every memory the book might hold.
[N] The trace is smaller than you expected. A strip of damp cloth rests against warm metal. There is a sense of waiting, then a slight movement as someone makes space beside them. You cannot see a face. For an instant the warmth resembles the feeling of reaching your own chair after a long day. Then it loosens. You lift your hand before the wish to know more can turn into a second attempt.
[Imogen | grave] No name. No reason somebody left it out. Only the work, and someone waiting.
[N] You write the impression on a fresh slip, clearly labelled as an Echosight observation made this evening. Beside it goes the old inspection entry, which already mentions the shelter and the handover. They fit together. That makes the echo useful. It does not make the echo a record of everything that happened, or the missing name a deliberate act of cruelty.
[Maelin Quill | neutral] That is enough for tonight. Practise the release on the teaching card before you attempt Echosight alone. You have found a trace consistent with care and return. Do not make it carry an accusation it never showed you.
[N] Dunne closes the ledger and tells you that the reading room will survive five minutes without an investigation. At the water stand, Imogen holds a cup in both hands. The scrape of her chair had seemed loud earlier. Now the whole library seems pleasantly solid: tables that stay put, books that must be carried, water that tastes of nothing more complicated than water.

--- SECTION correcting-claim | place: library | time: night | date: 2026-09-18 ---
[N] When you return to your notebook, Imogen has drawn a small line beneath her first claim. Somebody rubbed them out. She has not crossed it through. Beside it she has written page intact, names omitted from formal copy, reason not established. The words fit in the space only because she has made them very small.
[Imogen | guarded] I wanted the blank spaces to mean something clear. A person to argue with. A wrong thing to put right by doing its opposite. It felt disloyal to the missing people to say we were not sure.
[N] Across the table, Maelin is looking at their printed teaching sheet. They have made a mark beside the definition of keeper, but have not folded the sheet away. Dunne is waiting for the notes that will accompany the request slips. Imogen could revise her claim quietly with you first, or explain the change to the table while the sources are still open. Both require her to choose what she can stand behind.
[N] Imogen nudges the notebook toward you. “Will you help me make this accurate?” she asks. Her voice is low enough that the question belongs to the two of you. She has not asked you to speak for her.
[DECISION register:correction] How will you help Imogen revise the claim?
[OPTION private] Work through the wording with her first. | journal: I helped Imogen revise her claim privately before she read the correction to the table. We distinguished omission from proven erasure.
[OPTION together] Offer to compare the sources beside her. | journal: I compared the references beside Imogen while she explained her correction to the table. We kept the conclusion narrower than our first theory.
[END DECISION]
[IF register:correction = private]
[N] You turn the notebook so both of you can read it and point to the words somebody and rubbed. One guesses an actor; the other guesses a method. Imogen tries replacing the sentence with the names are absent, then objects that this leaves out the comparison. Together you arrive at three entries keep the work while omitting its workers. She reads it under her breath, checking each part against the slips.
[Imogen | warm] That is less grand. It is also something I can show someone. Thank you for letting me get there before everyone had to watch.
[N] She lifts her head and tells Dunne which part of the original claim has changed. You stay beside her while she does it. The table does not collapse under the correction. Dunne asks for the reference numbers; Imogen gives them without looking at you for rescue.
[END IF]
[IF register:correction = together]
[N] You ask Imogen whether she would like you to read the working entries while she checks the register. She nods. You give each reference number before its contents, and she explains the difference to Dunne. Halfway through, she stops herself from saying removed and chooses omitted instead. Nobody interrupts the pause.
[Imogen | attentive] I said the names had been rubbed out. We have not found evidence for that. We have found a pattern in what the formal copy kept. I would like our request note to say that, with the three comparisons attached.
[Imogen | warm] It helped to have another voice carrying the numbers. I could listen to what I was actually saying.
[END IF]
[Dunne | attentive] That is a finding I can catalogue. I will keep the correction with the first request, so another reader can see why it changed. We do not need to pretend you arrived knowing the answer.
[N] Maelin turns their teaching sheet over and writes on the back. This correction is larger than Imogen’s note: it applies to copies already handed out. They list the working-ledger references, then add an instruction to read keeper in the context of the task being recorded. The pencil stops at the end of the sentence. Their thumb rubs once along the folded edge.
[Maelin Quill | reflective] I shall give the class a replacement note. The old definition made a patron visible and a worker invisible, then taught students to expect that distinction. That was my choice of source. I do not need to know every earlier clerk’s intention to correct my own explanation.
[Imogen | attentive] Will you say why you changed it?
[Maelin Quill | neutral] Yes. With your permission, I will credit both of you for the comparison and Grey for the working account. The people who supplied a correction should not vanish from the corrected version.
[N] You agree to credit for the comparison. Grey has already permitted the quotation, with its date and limits. Dunne asks Maelin to send him a copy rather than assuming he will hear about it through a class he does not attend. Imogen adds that task to the bottom of your page. It is a modest promise, and for that reason it feels possible to keep.

--- SECTION supported-conclusion | place: library | time: night | date: 2026-09-18 ---
[N] Before the books return to their shelves, you lay out three kinds of evidence. The paired records show names and acts of care omitted from the formal register. The keeper’s instruction connects a light with receiving somebody into a familiar place. The supervised echo is consistent with that work, though it supplies no name or motive. None of the sources, by itself, says why your hall lantern went cold.
[IF register:search-method = dates]
[N] The inspection date you kept at the start now matters. It follows the dedication rather than duplicating it. Somebody continued tending the lamp after the ceremony had finished. You circle both dates on the comparison slip so a future reader will not mistake the celebration for the whole life of the light.
[END IF]
[IF register:search-method = makers]
[N] The maker’s mark has done its useful work. It helped you identify a fitting, but it does not explain the warmth in the echo. You put the workshop reference beside the maintenance entry rather than beside the cause of the failure. Imogen sees you move it and does the same with her copy.
[END IF]
[Imogen | grave] If the welcoming magic depends on remembered care, a record that keeps only payments is losing part of what the lights were meant to hold. The omissions may matter to the failure. We should check another kind of light before we call that the cause.
[Maelin Quill | neutral] That is a theory worth testing. Do not shorten it to the register broke the heartfire. We have a connection between light, memory, and belonging. We have not found a repair, or a person responsible for the loss.
[N] The archive instruction has one further reference in its margin: flowers prepared for the autumn lanterns. Dunne identifies the old botanical term as moonflower and copies the glasshouse catalogue number. Rhys keeps the living collection; Saoirse has been helping prepare the festival frames. You already know where to find them. For the first time this evening, the next step is a conversation rather than another shelf.
[Dunne | attentive] Ask what they can show you safely. The flowers have their own season. An impatient reader cannot make October arrive by turning enough pages.
[N] Maelin gathers the teaching sheet and the references for its replacement. Dunne returns the register to its gate. You carry the empty water cups back to the stand while Imogen checks that none of the comparison slips is trapped inside a book. The library becomes an ordinary room again by degrees. The unanswered question remains, but it now has people and places attached to it.
[IF register:worker-question = practice]
[N] For Grey’s copy you write his account in a separate paragraph, with today’s date above it. You leave out the student’s identity. Beneath the quotation you add that the old instruction supports the practice of staying until a traveller is received. His present memory and the older wording can sit together without being made into the same event.
[END IF]
[IF register:worker-question = record]
[N] For Grey’s copy you include the purpose of both signatures and leave out the private detail he covered. You mark the difference between a repaired fitting and a completed handover. A future reader might know all about brass and wicks and still need somebody to explain why a keeper stayed after the mechanical work was done.
[END IF]
[Imogen | warm] I think I owe you a different sort of evening soon. One where I ask whether you have eaten before asking what you noticed on a page.
[N] You admit that you have been thinking about supper for some time. Imogen checks the clock and looks appalled at how well hunger has survived such an interesting investigation. She begins packing with sudden efficiency, then slows to make sure your notebook has not been buried under hers. The chair beside you rocks when she rises. Apparently the exchange at the start of the evening was more generous than she let on.
[Imogen | amused] It only rocks if you move. I spent most of the evening being terribly still and scholarly. There are compensations.
[N] You leave with a page that can be checked, a correction that has been accepted, and a promise to bring Grey the result. The hall lantern is still cold. Three ordinary keepers have not yet recovered their full names. But the work they did is no longer an empty space in your account. Beside the plan to visit the glasshouses, Imogen writes one final reminder in a hand large enough to read: supper first.

[EXIT 0] Help her recover the missing names.
[EXIT 1] Ask whose story she would save first.
```

### Chapter 4

```
=== SCENE emberfall | chapter 3 ===


--- SECTION borrowed-afternoon | place: glasshouses | time: afternoon | date: 2026-10-31 ---
[N] October has changed the academy in small, persistent ways. Wet coats occupy the hooks nearest the doors. The trees outside the library have become easier to see through. You can keep a Kindle flame steady while someone asks you a question, which would have seemed an unreasonable demand in September. The cold lantern above your supper place still carries its red ribbon. There have been more inspections, but no one has mistaken the passage of time for a repair.
[N] On Emberfall afternoon, the glasshouse benches are covered in half-built lantern frames. Sunlight catches in the ornate green ironwork and makes every loose brass strip look finished. The illusion lasts until Saoirse picks one up. Its handle slides through the fastening and drops into a pot of soil. She looks at the empty place in her hand, then at you, then very deliberately puts the frame down.
[Saoirse | amused] You have arrived at an excellent moment. We have discovered that a lantern needs to remain attached to its handle. Several of my earlier drawings were rather optimistic about this.
[N] Rhys moves a tray of moonflowers away from the loose metal. White star-shaped blossoms rest among narrow leaves. Under a nearby glass dome, an ordinary lamp keeps the air warm around a cutting. There is plenty growing here that has nothing to do with your mystery. Rhys makes room for it before she makes room for your notebook.
[Rhys | neutral] Six sound frames for the west tables. No loose wire, no flame against paper, and no flower picked because someone forgot to collect the fallen petals. We can look at the old botanical reference after the hall has what we promised.
[N] Saoirse’s list says six frames, twelve frames, adjustable shutters, and travelling memory lamp. Each line has a different mark beside it. You ask which marks mean finished. She explains that one means parts found, another means probably possible, and the third is a blot she has been using as a tick. None of them means finished.
[IF arrival:watering-method = measure]
[N] The small marked watering tube from your first week is clipped to the shelf. Its measurements are still legible. Saoirse follows your glance and admits that the plant trial became more useful when she stopped changing three things between readings. Then she looks back at the four lines on today’s list, caught by her own example.
[END IF]
[IF arrival:watering-method = simplify]
[N] The plain reservoir from your first glasshouse errand sits beside a healthy tray. The decorative tubing has never returned. Saoirse says the seedlings have shown disappointingly little interest in its absence. When you look at the list of lantern improvements, she looks at the reservoir too, then sighs.
[END IF]
[IF arrival:watering-method = (none)]
[N] Saoirse shows you the ordinary reservoir she has been testing on one tray. It has fewer moving pieces than the design pinned above it. The plants have grown. The unfinished design has not. She seems pleased by the first fact and mildly offended by the second.
[END IF]
[N] Delphine arrives carrying a covered bowl and a small brush wrapped in cloth. She introduces herself over the edge of the bowl: brewing, mostly useful mixtures, occasionally ones that need a window opened. Her festival contribution is paste that will hold the paper seams and release in warm water when the frames are cleaned. She has written the washing instructions before anyone asks.
[Delphine | neutral] I can help until the first supper bell. My sister is visiting the village, and I have spent three letters saying that I would come down early enough to see her. I would prefer the fourth letter not to explain why a paper lantern prevented it.
[Saoirse | guarded] Of course. I only thought, if we had one more pair of hands, the shutters might—
[N] She stops before the request is complete. Delphine has not refused to help; she has said how much help she can offer. Rhys takes a pencil and draws one line beneath the six promised frames. Everything below it can wait. Saoirse watches the line as though a piece of the afternoon has been physically cut away.
[N] The shutters would let a keeper shield a petal without removing it, but their catches are still unreliable. The frames can work with a simple removable cover. Alternatively, you can divide the jobs and finish one adjustable demonstration frame after the six ordinary ones. Delphine will leave at the bell in either case.
[DECISION emberfall:work-plan] How will you help make the promise achievable?
[OPTION simple] Make six reliable frames with simple covers. | journal: We chose six reliable Emberfall frames with removable covers. Saoirse set the unfinished shutters aside, and Delphine left at the agreed bell.
[OPTION shared] Divide the work, then finish one demonstration frame. | journal: We divided the Emberfall work: six plain frames first, then one adjustable demonstration frame. Delphine’s departure time stayed part of the plan.
[END DECISION]
[IF emberfall:work-plan = simple]
[N] You move the unfinished catches into a shallow box and write tomorrow on its lid. Saoirse starts to correct the label to after supper, then leaves it alone. She shows you how the removable cover slips into a groove above the lantern glass. There is no clever movement to demonstrate. There is a clear way to tell whether it is in place.
[Saoirse | warm] If the next person needs me standing behind them to explain it, we have not actually made a lantern they can use. Hand me the plain cover. I shall try to survive its lack of drama.
[N] Delphine brushes paste along a seam and asks you to hold it while she counts. The pause is longer than you expect. She explains that pulling at it early only creates more work later. Saoirse, deprived of moving parts, becomes unexpectedly good at keeping the count. By the fourth frame you have a rhythm that leaves enough silence to hear the owl shifting above the door.
[END IF]
[IF emberfall:work-plan = shared]
[N] You divide the bench into finished frames, frames needing paper, and pieces that are still only ideas. Delphine takes the paper seams. You check each handle with the weight of an unlit lamp inside it. Saoirse finishes the six plain covers before touching the demonstration catch. She crosses out the line for twelve frames herself.
[Delphine | neutral] I have six seams drying. If the seventh needs another pair of hands after the bell, it will need a different pair from these. I am telling you now while I am still available to be cheerful about it.
[N] With the promised frames finished, Saoirse brings out one shutter. The catch fails twice before she notices that the hinge is pulling against the paper. You hold the empty frame while she moves the fixing to the metal. This time the panel stays where it is put. She writes a cleaning instruction on the card beside Delphine’s. The demonstration is smaller than her first plan, but it can be repeated without her hands.
[END IF]
[N] At the first bell, Delphine washes the brush and lifts her bowl. Saoirse looks at the remaining bench, then takes the cloth from her before she can begin cleaning something else. She thanks her by name and tells her which table will have the lanterns. Delphine promises to look on her return. The promise costs her no extra work, so it sounds like pleasure.
[Rhys | warm] Six frames, six sound handles, and one person leaving when she said she would. You may record all three as completed work.

--- SECTION festival-tables | place: lantern-hall | time: evening | date: 2026-10-31 ---
[N] The hall has become almost unrecognisable without changing a single wall. Orange lanterns hang beneath the arches; autumn leaves lie in deliberate trails along the tables. Masks rest against the carved birds above the pillars. Through the great round window, the last sunlight turns the mere the colour of a copper pan. The six frames you carry are plain enough to disappear into the splendour, until you remember that disappearing into usefulness is part of their job.
[N] Grey meets you at the west tables. One has been shifted to make a wider passage near the doors. The space is already useful: a student carrying a stack of plates gets through without turning sideways. Grey asks where each lamp should sit before he brings the wire stands. Saoirse asks him to try a handle rather than telling him it is safe.
[IF register:worker-question = practice]
[Grey | neutral] That copy you brought after the library visit is in the office now. I liked that you put the date above what I told you. Hask asked to read it, and she could see which part was my own account without having to find me in a corridor.
[END IF]
[IF register:worker-question = record]
[Grey | neutral] Your copy of the handover explanation is with the maintenance notes. The private detail stayed private. Hask asked why there were two signatures, and for once the answer was on the page waiting for her.
[END IF]
[IF register:worker-question = (none)]
[Grey | neutral] Dunne sent over the references for the keeper instructions. I have put a copy beside the current rounds. It helps when a new person wants to know why we wait at the landing after the repair is done.
[END IF]
[N] Saoirse listens while he shows you where the lamps will be used. A late arrival will come through the west doors, see the table, and be met before wandering into the serving line. Grey has arranged a stool for whoever takes that turn. Your lantern is part of an invitation with a person attached to it, rather than a decoration expected to do all the welcoming alone.
[IF emberfall:work-plan = simple]
[N] Grey removes a cover, checks the glass, and slides the cover back into its groove without asking Saoirse to explain. She follows the motion with visible relief. The most useful part of the test is that she has nothing to add. You put the cleaning card beneath the spare covers, where the person closing the hall will find it.
[END IF]
[IF emberfall:work-plan = shared]
[N] You keep the adjustable demonstration frame separate from the six table lamps. Grey reads its card, tries the catch, and asks whether the hinge can be cleaned without taking the paper off. Saoirse shows him the fixing she changed. He repeats the movement successfully. The question that might once have spoiled her demonstration has improved the handover.
[END IF]
[N] A small card has been left on the table for the makers’ names. Saoirse writes her own, then yours, then Delphine’s. Grey says the paste will be very welcome when he has to clean the frames. She adds a note about where its washing instructions are kept. You remember the empty register cells and find yourself pleased by a card that lists a person beside the part of the work they actually did.
[N] Imogen arrives with three plates and an expression of stern logistical satisfaction. She has decided that carrying supper to the people still arranging lamps is a more efficient intervention than waiting for them to remember it exists. She gives you the plate with a corner of bread balanced over the vegetables, then looks at the makers’ card.
[IF register:correction = private]
[Imogen | warm] Maelin’s replacement note reached the class. I used the wording we worked out together. I still felt nervous handing it over, but at least I was nervous about something I meant.
[END IF]
[IF register:correction = together]
[Imogen | warm] Maelin used our reference numbers in the replacement note. I read them aloud again before the class started. Your part of the explanation turned out to be rather useful practice.
[END IF]
[IF register:correction = (none)]
[Imogen | attentive] Maelin has circulated a corrected note about the keeper records. It includes the working sources now. The explanation is longer, but there are more people in it.
[END IF]
[N] For a while there is no investigation. Rowan loses an argument with a paper mask and wears it on the back of his head. Someone at the next table knows a song that half the room knows differently. Saoirse makes a small drawing of the argument between the two versions in the corner of her napkin. You eat while the light changes in the round window. The evening continues without needing you to solve it.
[Saoirse | warm] Rhys said we could come back after the flowers open. We have time for another song first. The flowers have made no request for punctual applause.

--- SECTION flowers-after-dark | place: glasshouses | time: night | date: 2026-10-31 ---
[N] After the songs, the path to the glasshouses is quiet enough to hear your steps on the grit. The panes no longer throw sunlight across the benches. They hold a dark blue sky, the castle’s distant lamps, and your own faint reflections approaching the door. Inside, the same stools and books occupy the same places. Under the changed light, the white flowers look newly awake.
[N] Rhys is trimming a damaged leaf from a plant unrelated to your visit. She finishes before turning to you. Saoirse sets the small observation lantern on the cleared bench and begins telling her how the handover went. She mentions Delphine’s cleaning card before she describes any part of the mechanism. Rhys listens with a pleased expression that she makes no effort to hide.
[Rhys | neutral] The old reference describes moonflowers kept near the shore lamps. The present collection includes cuttings from that line, although a cutting is not a record of every person who has touched it. Tonight we will use fallen petals. The plant has already given them up.
[N] You check the soil with Rhys before taking anything from the tray. The surface is dry; underneath, it still holds moisture. Saoirse reaches for the watering can, then puts it back when Rhys shows her where to feel. More water would be an easy thing to offer and the wrong thing to give. You turn the pot a little so the growing tip has room beside the glass.
[Saoirse | attentive] I kept one fallen petal under a paper cover from the moment it dropped. This one was beside the working lamps when we carried them through. They came from the same plant. I want to know whether a difference stays when the lamp is no longer lighting them.
[N] She lays the petals in separate shallow saucers. The covered specimen is ivory all the way to its tip. The other has a faint amber thread near its centre. It would be easy to call the thread a reflection and easier still to call it a discovery. Rhys asks you to leave enough space on the page for either result. Saoirse has already written the source of each petal at the top.
[IMAGE moonflower-study] A potted white moonflower, a glass lantern, and two saucers: the left fallen petal glows faintly amber while the right is plain ivory.
[N] Two fallen petals lie in separate cream saucers beside the living plant. A faint amber line runs through the petal on the left; the right remains ivory. The small lamp is contained behind glass, apart from the leaves. Nothing is burning. The visible difference is where the investigation begins. By itself it cannot tell you whether the warmth is new, remembered, or only reflected.
[N] There is enough time for a careful comparison before the warmth fades. You can cover the lamp while keeping the petals in place, or exchange the saucers’ positions and then cover the lamp. Rhys will help you separate the steps so you know what you changed.
[DECISION emberfall:observation] How will you check the difference?
[OPTION shade] Shade the lamp and watch the petals stay in place. | journal: At Emberfall we shaded the observation lamp. The amber trace remained briefly in one fallen petal while the comparison petal stayed pale.
[OPTION exchange] Exchange the saucers, then shade the lamp. | journal: At Emberfall we exchanged the saucers before shading the lamp. The amber trace followed its petal rather than its position on the bench.
[END DECISION]
[IF emberfall:observation = shade]
[N] You lower the cover slowly. Reflections retreat across the rims of both saucers, then vanish from the pencil. The amber thread in the left petal remains. It is much fainter without the lamp, but its outline has not moved. Saoirse starts counting breaths and loses count when she looks at you. You begin again together, without pretending the first count was reliable.
[Saoirse | warm] There. It is not just the reflection. I would like that to explain everything else, but for the moment I am very pleased that it explains one thing.
[END IF]
[IF emberfall:observation = exchange]
[N] You exchange the saucers without touching either petal. The amber thread moves with its specimen to the right. Saoirse marks the change on the page before you lower the cover. When the reflections disappear, the thread remains where the petal now lies. Nothing has been left glowing on the old patch of wood. Rhys steadies the covered lamp while you check both positions once more.
[Saoirse | warm] The bench is innocent. That is useful; I had absolutely no plan for taking it down to the shore. Now we can ask what the petal is keeping.
[END IF]
[N] The light fades before you have filled half the page. Saoirse’s hand moves toward the lantern, then stops. Adding more warmth now would make it harder to say how long the first trace lasted. She watches the petal go pale. You are surprised by how much patience it takes to let a successful experiment end.
[Rhys | warm] A short-lived trace is still a trace. We have enough to try Echosight on a second prepared petal. We do not have permission to exhaust the whole plant until it tells us a more impressive story.

--- SECTION warmth-without-a-face | place: glasshouses | time: night | date: 2026-10-31 ---
[N] Rhys brings a second fallen petal in a folded paper packet. The packet belongs to the teaching collection, with its source and date written on the outside. It was collected beside a shore lantern after a previous Emberfall. The care note says the flower was tended by several people. No single name is offered as the owner of everything it might remember.
[Rhys | neutral] We can observe this teaching sample once. Lift your hand if the trace becomes difficult to leave. If you notice a feeling, describe it as a feeling. It cannot give consent for us to invent a whole person around it.
[N] The first impression is warmth at knee height, as if a small fire had been carried close while someone waited. Then comes the rough drag of cloth over a seam. You glimpse a hand pressing a patch flat, but the hand has no face attached to it and the scene does not widen when you try to look. You remember Maelin’s card. You let the trace pass.
[N] There is a brief sense of a kettle being moved to make room, and damp boots on a board that gives slightly underfoot. The impressions overlap without becoming a single room. You cannot tell whether you have seen three moments or pieces of one. Underneath them lies the same patient warmth that made the working ledger feel familiar. It fades when you lift your fingers.
[Saoirse | guarded] Did it feel like somebody waiting to be found?
[N] You tell her what you noticed: the patch, the kettle, the boots, the warmth. You cannot honestly say that anyone was waiting inside the petal. Saoirse turns her pencil between her fingers. The answer disappoints her, though she has been careful enough to know why it matters.
[Rhys | neutral] The petal can carry something left by care. It does not carry the person who gave it. Think of a coat kept warm for someone coming in from the rain. The welcome is real. It does not mean its maker is still standing inside the coat.
[N] Saoirse puts the pencil down before answering. She had hoped the travelling lamp might preserve stories people could no longer tell. She can see now how quickly that hope could become a machine that supplies whatever a listener longs to hear. The thought makes her look toward the covered lantern rather than toward you.
[Saoirse | attentive] Then it needs to hold the trace without pretending to translate it. A cover, a source card, a way to let the warmth go. No little voice making up a name because we dislike an empty space.
[N] You place the clean source card beside the frame. A person carrying the lamp would need to know where its petal came from, when it was gathered, and how long the trace might remain. They would also need to know when to stop. None of those instructions makes the lantern less interesting. They give someone besides its inventor a way to use it without having to guess.
[IF emberfall:work-plan = simple]
[N] The plain cover you chose this afternoon proves useful again. It is easy to see whether it is open or closed, and easy to remove for cleaning. Saoirse writes that on the card. She adds that an adjustable shutter may eventually help, but it is not required for this observation. The distinction seems to cost her less than it would have cost her before supper.
[END IF]
[IF emberfall:work-plan = shared]
[N] The single adjustable frame makes it possible to lower the light gradually, but Saoirse records the plain cover as an alternative. The six working lamps in the hall still matter more than this extra mechanism. She writes that someone should be able to complete the observation without choosing her cleverest design.
[END IF]
[Rhys | neutral] The older plants were kept beside the returning path. Tully may know which shore lamps were tended together. Take him the question when the winter rounds begin. Take a copy of what you actually observed, too. He deserves something more useful than an alarming rumour about haunted flowers.
[N] You add the shore rounds to your notebook. The old register described people working at separate lamps; the flowers may connect those places through a practice that survived longer than its explanation. Tully can show you the route as it is used today. You have a question specific enough to take to him, and an observation he can check.

--- SECTION an-unproductive-hour | place: glasshouses | time: night | date: 2026-10-31 ---
[N] Rhys seals the teaching sample, checks the plant labels, and takes the unused petals back to their shelf. The experiment is finished. She leaves the two of you the ordinary job of wiping the bench and tells you where the clean cloths belong. Saoirse looks almost relieved to be given an instruction that cannot become a new invention.
[N] The paste has dried in a pale ring beside the bowl. Warm water softens it exactly as Delphine promised. You hold the bowl while Saoirse wipes, and she tries to remember whether the cleaning card credited Delphine clearly enough. You tell her that Grey read the name aloud. The worry leaves her face slowly, as though it had expected to remain for the evening.
[Saoirse | guarded] I keep thinking that if I can finish the next useful thing, I will have earned a quiet evening. Then I put another useful thing after it. I suspect there is a fault in the design.
[N] She says it lightly, but she has stopped moving the cloth. You have seen her use a joke to make a difficult sentence easier to carry. This time she does not immediately replace the sentence with another task. Outside the glass, a cloud passes across the moon. The room darkens for a moment without becoming cold.
[N] The bench is clean. The lamp is out. Saoirse folds the cloth square and leaves it beside the sink. You have a little time before you need to return to the hall, and neither of you has promised it to anyone else.
[DECISION emberfall:quiet-company] What kind of company will you offer?
[OPTION listen] Ask what she hoped the travelling lamp would do. | journal: After Emberfall’s observation, Saoirse told me why she wanted a travelling memory lamp. I listened without turning the conversation into another task.
[OPTION rest] Invite her to spend a little time without a project. | journal: After Emberfall’s observation, Saoirse and I spent a quiet interval naming ordinary things we liked. We left the unfinished work closed for the night.
[END DECISION]
[IF emberfall:quiet-company = listen]
[Saoirse | guarded] I wanted a light you could take somewhere that did not feel like home yet. Not one that told you to be grateful. Something that reminded you that you had been expected somewhere before, and might be expected again.
[N] You ask whether she has had a place like that. She looks at the stools, the crowded benches, and the plant that has somehow grown around the foot of a bookstand. This room, she says, but not immediately. At first she kept volunteering for things because she could understand being needed more easily than being wanted. She does not give you a larger story than she is ready to tell.
[Saoirse | shy] I am trying to learn the difference. Rhys keeps giving me seedlings that do not need anything until tomorrow. I think it may be a deliberate teaching method.
[N] You tell her that you came back after the songs because you wanted to spend the evening here. The observation mattered, but it was not the only reason. Saoirse studies the folded cloth while she takes that in. Then she nudges the empty stool toward you. There is no reward hidden inside the gesture, and no request following it.
[END IF]
[IF emberfall:quiet-company = rest]
[N] You sit on the empty stool and suggest an experiment that requires no equipment: a few minutes in which neither of you improves anything. Saoirse says that making it an experiment is a rather unfair way to make her interested. She sits anyway. For the first minute she notices three things she could mend and tells you about none of them.
[Saoirse | warm] The sound the hall makes when everybody knows the next line of a song. The smell of the first orange someone opens in winter. A clean pair of socks that nobody has warmed with a spell. Apparently I have a great deal to say about socks.
[N] She asks what you would put on the list and waits while you think. There is no correct kind of ordinary pleasure to offer her. The small pause matters more than a perfectly chosen answer. You can look through the glass at the scattered academy lights without having to turn them into evidence. Saoirse follows your gaze and, for once, leaves the silence whole.
[Saoirse | amused] We should do this again. I would make a timetable, but I worry that would count as improving something. Perhaps I shall simply ask whether you are free.
[END IF]
[N] When you stand, Saoirse leaves the box marked tomorrow where it is. She checks that the lantern is cool, takes the copy intended for Tully, and turns down the nearest lamp. The room does not need to become empty of unfinished things before you are allowed to leave it. That feels like a useful lesson, though neither of you calls it one.

--- SECTION one-line-left | place: corridor | time: night | date: 2026-10-31 ---
[N] The corridor outside the hall carries the muffled rhythm of a final song. Someone has hung a paper lantern in the deep window recess, safely clear of the curtain. Rowan is waiting by the door with the last two slices of a cake that has suffered structurally but remains promising in every other respect.
[Rowan | amused] I defended these from a perfectly reasonable argument about sharing. Please eat them before I begin to agree with it.
[N] Delphine comes up the corridor just as you finish the first bite. Her sister has gone back to the village with a lantern drawing on the back of an envelope. She saw the west tables on her way in and found the cleaning card where you said it would be. Saoirse asks how the visit went before asking anything about the paste. Delphine notices the order, and her answer becomes a little longer.
[Delphine | neutral] We walked nowhere in particular and argued about whose turn it was to write first. I have been trying to brew the feeling of opening a letter. This was a useful reminder that sometimes you can simply go and see the person.
[N] The remaining lantern paper is waiting on the small corridor table. The six frames are in use, the comparison has a written record, and the next shore question is safe in your notebook. What remains is a line for the Emberfall lantern you made together. It does not have to explain the entire mystery. It only has to be a promise you are prepared to carry.
[Saoirse | warm] Leave a little space at the edge. Someone might think of a better way to say it when we are older. I would like the lantern to have room for that.
[N] You smooth the paper beside the small waiting flame. Beyond the door, the hall is beginning to settle: chairs drawn in, cups gathered, the welcoming stool still occupied. The ordinary work of the festival is not finished when the celebration ends. This time, you know who will stay to finish it.

[EXIT 0] Write: No kindness is too small to remember.
[EXIT 1] Write: We will make room for everyone.
```

### Chapter 5

```
=== SCENE longnight | chapter 4 ===


--- SECTION winter-round | place: tully-cottage | time: evening | date: 2026-12-21 ---
[N] Winter has made Tully’s cottage smaller from a distance and more complicated up close. Snow rounds the roof and gathers in the seams of the barrels. The path to the covered workbench has been swept, gritted, and swept again. Beyond the tied boats, a narrow patch of dark water moves against the frozen mere. The academy shines across it. Walking here from the bridge has taken longer than you expected.
[N] Tully is adjusting a lamp beneath the porch. He finishes tightening its catch before greeting you. There are three mugs waiting beside the kettle, and a fourth upside down to keep snow out. Saoirse puts her case on the bench. She has brought the small lantern you worked on at Emberfall, a roll of spare cloth, and exactly one tool more than the case will hold.
[Tully | warm] Good. You came by the upper path. The boats are tied up for the freeze. Anyone arriving for Longnight gets met at the bridge and walked round. We keep a lamp at both turns. The castle is easy to see; the safe way to it is another matter.
[N] The first page on his workbench lists expected arrivals, the times they might reach the bridge, and who will meet them. Several times are crossed out. Beside one name, Tully has written that the visitor cannot carry a heavy bag. Beside another is a reminder to bring a spare coat. He turns the sheet face down before clearing space for your notebook. These are people’s arrangements, not a puzzle to be copied.
[IF emberfall:quiet-company = listen]
[Saoirse | warm] Remember what I said about wanting a light to feel as if somebody expected you? Tully has a list, a spare coat, and someone waiting at the bridge. I think I left a few important parts out of my drawing.
[END IF]
[IF emberfall:quiet-company = rest]
[Saoirse | amused] I have taken your lesson about doing nothing extremely seriously. There is a whole hour after supper with no invention in it. I am telling you now so I cannot quietly fill it with something useful later.
[END IF]
[IF emberfall:quiet-company = (none)]
[N] Saoirse asks which of the mugs is yours. She has been practising fitting her work around other people’s plans, with mixed success. Tonight she has left the hour after supper empty. She says this with the solemn pride of someone presenting a very small invention.
[END IF]
[N] Boots scrape on the lower step. Kestrel arrives carrying a flat case and a folded survey. She sets the case where melting snow cannot reach it, introduces herself as the teacher responsible for tonight’s warding check, and asks Tully about the returning bridge party. Only after he gives the time does she ask to see your autumn notes.
[Kestrel | neutral] Rhys sent me her account of the petal comparison. A short-lived trace can tell us where to look. Tonight we are checking whether the older shore memory is still readable. I will hold the boundary of the exercise. You may stop your spell whenever you need to.
[N] A porch lamp flickers while she speaks. Saoirse looks up sharply. Tully gives the catch another quarter-turn. The flicker stops. A strip of worn metal lies beside his tool, its edge rubbed thin by years of use. There is something reassuring about a fault that fits in a hand and can be replaced before supper.
[Tully | neutral] That one was the fitting. I still mend fittings. The shore lamps have been losing their welcome even when the fittings are sound. Two jobs. If we forget the first while thinking about the second, somebody misses a step.
[N] The lake reading will take place from the old stone landing, inside the rope posts. Tully wants the route ready for the next arrival as well as for your investigation. He offers you the route slate and the box of lamp catches. Kestrel will accompany either job and then check the exercise boundary. Saoirse takes whichever task remains.
[N] There is time to complete one useful piece of the round before you go to the water. One task concerns how a stranger finds the route; the other concerns whether the lamps marking it keep working.
[DECISION longnight:shore-work] Which part of the round will you take?
[OPTION landmarks] Check the route as someone arriving for the first time. | journal: On the Longnight round I checked the winter route from an arriving visitor’s point of view and helped mark a misleading turn.
[OPTION lanterns] Check the catches and covers on the route lamps. | journal: On the Longnight round I checked the route lamps and helped replace a worn catch before the next arrivals.
[END DECISION]

--- SECTION safe-way | place: tully-cottage | time: night | date: 2026-12-21 ---
[IF longnight:shore-work = landmarks]
[N] You begin at the bridge end and pretend that the castle’s bright windows are the only directions you have. At the first fork, the lower track points more directly towards them. Its old gate is half hidden by snow. The safe upper path curves away into trees. From here, the inviting choice is wrong.
[Kestrel | neutral] Tell me what made you choose it. We know the route, which makes us poor judges of how clear it is. “Obvious” often means somebody explained it to us years ago.
[N] You describe the sightline, then walk back until the fork disappears behind the tree. Tully moves the marker to the place where a newcomer would actually make the decision. You help turn its arrow towards the upper path. Saoirse tests the hood above it, and you return to the bridge end to check again. This time the marker is visible before the tempting track.
[Tully | warm] That earns its place. I have walked past it all winter knowing what it meant. Next person gets a better chance than that.
[END IF]
[IF longnight:shore-work = lanterns]
[N] Tully shows you the first catch before letting you handle the next. With the lamp cold and supported, you check the hinge, the cover, and the little hook that holds them together. Most are sound. One catch closes with a satisfying click and opens again when you gently pull. The sound had been more convincing than the fastening.
[Kestrel | neutral] Show me the test again. Good. A check should be something another person can repeat. We will put that motion on the round sheet, rather than “make sure it seems secure.”
[N] You hold the lamp steady while Tully replaces the hook. Saoirse passes the correct spare from the box without trying to redesign it. When the new catch closes, you repeat the pull. This time it holds. The old piece goes into a marked envelope for Jory, who supplies the replacements. Tully wants him to see the wear before anyone orders a dozen more.
[Tully | warm] That will save a cold walk back with a loose cover. Put your initials beside the check. When Jory asks what happened, he can ask the person who actually tested it.
[END IF]
[N] A voice calls from the bridge. Tully raises his hand to the student escort bringing two visitors around the turn. You stand aside while they pass. One visitor is laughing at a story; the other is concentrating on their feet. Neither knows about the record discrepancy or the petals. Both benefit from the little work you have just finished.
[N] The escort carries the heavier bag. Tully asks whether they want to rest at the cottage or continue up to the hall. They choose the hall, where someone is keeping supper warm. He waits until they reach the next lamp before turning back to you. The waiting is part of the work, and it cannot be made quicker by looking busy.
[Tully | neutral] My first winter, I took the lamps down as soon as the last expected boat came in. My predecessor asked how I knew nobody unexpected would arrive. I did not have a good answer. Now the final round is a handover, not an assumption that everybody is home.
[N] At the old landing, Kestrel checks the stone under the snow, then the posts, then the line between them. The boats remain tied at the cottage. Nobody is crossing the ice. She places two small ward markers on the dry side of the rope and leaves enough clear space for you to step back. Tully stays where he can watch the route as well as the exercise.
[Kestrel | neutral] A narrow reading. Choose the water beyond the landing as your subject, then let the older trace come into view without reaching for it. If you become cold or dizzy, lower your hand and say so. I will close the reading. No observation requires you to endure it at any cost.
[N] Saoirse opens her lantern case on a dry stone. The instrument is only a steady reference light tonight; it will not pull anything out of the lake. She sets a blank page beside your notebook and weighs both down. Your fingers already feel clumsy inside their gloves. Kestrel asks you to move them and checks your answer before she begins.
[IF emberfall:work-plan = simple]
[N] The plain removable cover from Emberfall fits around the reference lamp. Saoirse folds it back with two fingers. The modest design is easy to use in gloves, which had not been part of your original reasoning. She looks pleased enough to add it to the list now.
[END IF]
[IF emberfall:work-plan = shared]
[N] Saoirse tries the adjustable cover you helped keep in the Emberfall plan. Its little lever is awkward in gloves. She uses the plain spare cover instead and writes “larger handle” on a separate scrap. The investigation page remains clear. A design can be worth keeping and still need changing.
[END IF]
[IF emberfall:work-plan = (none)]
[N] The reference lamp has a plain cover that Saoirse can fold back without removing her gloves. She tests it once, sets it beside the case, and leaves the experiment itself to you. Her notebook has room for a sketch and for what the sketch cannot show.
[END IF]

--- SECTION seven-lights | place: mere | time: night | date: 2026-12-21 ---
[N] Snow has softened the boathouse roof across the bay. Beyond it, the academy’s windows make broken golden lines on the ice. The ordinary shore lamps burn above the surface, where Tully hung them. You identify those first. Their reflections move when you move your head. The older memory, if it answers, will have to be distinguished from all that present light.
[N] You settle your feet on the cleared stone and raise your hand. Echosight starts as a slight doubling at the edge of a reflected window. Kestrel asks you to narrow your attention. You let the castle blur. A different warmth gathers below the surface, far closer than the buildings, and the first small flame becomes visible.
[Saoirse | attentive] One at the far side. Three down the left. Three down the right. There is a gap towards us. I am counting the small lights, not the windows.
[IMAGE lake-seven-lights] Seven amber memory lights in an open horseshoe beneath blue ice, seen from a snow-edged stone landing; faint indistinct keeper reflections appear beside them.
[N] Seven small amber flames form an open ring within the lake’s echo: one at the far end and three on each side, leaving a gap nearest the landing. Faint human-shaped reflections stand beside them, with no clear faces. Snow and blue ice remain visible through the memory. You are on the stone landing behind the boundary; no one is standing on the ice.
[N] A sound comes with the last light. It might first be mistaken for a rope running through a hand: a soft roughness, then several breaths taken at different times. The figures resolve just enough for you to see arms lifting. Each small flame waits apart from the others. None is drawn into place by a central fire.
[Kestrel | neutral] I can hold this reading for a little longer. Choose what you will record closely. Saoirse, take the other part. We will compare after closing, while both accounts are still fresh.
[N] There is more happening than one person can write at once. The arrangement of the lights and the fragment of speech both matter. You and Saoirse can divide the observation without trying to make either account complete.
[DECISION longnight:echo-record] What will you attend to?
[OPTION pattern] Follow how each separate light joins the open ring. | journal: At Longnight I recorded seven lights joining separately, with a gap left in the ring. Saoirse recorded the fragment of invitation.
[OPTION words] Listen for the words spoken as the lights are offered. | journal: At Longnight I recorded the fragment “if you wish” and separate answering voices. Saoirse recorded the seven lights and the open gap.
[END DECISION]
[IF longnight:echo-record = pattern]
[N] You mark seven positions. The first light brightens; the others remain dim. Then a second answers. There is no sweep carrying them all together. The near-left flame pauses long enough for your pencil to stop above the page, then joins at its own pace. The opening nearest you stays open. When you try to draw a line across it, your pencil has nothing to follow.
[Saoirse | attentive] I heard “if you wish.” Then more than one voice answering. I cannot make out the names. You have the order? Good. I nearly made all the answers one sound because I wanted to keep up.
[END IF]
[IF longnight:echo-record = words]
[N] You keep your pencil still for the first breath. A voice says something too faint to catch, then “if you wish.” Silence follows. An answer comes from the left, another from farther away, a third almost over it. You write the clear phrase and leave spaces for what you cannot hear. The last answer arrives after a pause, in its own time.
[Saoirse | attentive] Seven, joining separately. This one waited. The gap stayed open even after the last light answered. I have drawn it twice because my first sketch made the ring look closed.
[END IF]
[N] As the seventh light steadies, a thin dark break crosses the reflected academy. You feel it before you understand what you are seeing: a missing strip where a row of warm windows ought to be. Above the lake, the actual windows remain whole. Saoirse’s pencil drops onto the notebook. Her breath catches sharply enough for Kestrel to hear.
[Kestrel | grave] Lower your hand. Stay where you are. We have enough for tonight.
[N] You lower your hand. The small flames dim in the order you noticed them, and the figures lose their shape. Kestrel closes the two markers together. The ordinary reflected windows return to their familiar wavering lines. Tully has already opened the way back from the landing. He gives Saoirse her pencil without asking her to bend for it.
[Saoirse | scared] If the Heartfire goes out, will the school disappear?
[Kestrel | grave] The buildings will remain. I will explain the rest at the workbench, where your hands can get warm. We are finished with the water.
[N] You close the notebook on a loose sheet so neither observation rubs against the other. Tully collects the ward markers after Kestrel releases them. The return is slower than the outward walk. Nobody calls for another look. The useful thing now is to bring everyone and the work back together.

--- SECTION what-remains | place: tully-cottage | time: night | date: 2026-12-21 ---
[N] The kettle is still warm under its cover. Tully makes fresh tea anyway, giving the water time to heat while you put away the instrument. Saoirse wraps both hands around her mug without drinking. Kestrel waits until you have loosened your gloves and can move your fingers comfortably. Then she unfolds the survey she brought from the academy.
[Kestrel | grave] The tower, the hall, the dormitories: stone and wood. Okoro and I have checked the protective wards, and Grey has the building reports. The crack you saw was in the remembered reflection. It does not mean the wall is breaking. We are dealing with the welcome held by the Heartfire.
[Saoirse | scared] That sounds smaller when you say it like that. I do not think it is smaller. The first night I came here, I knew where to turn before I could read the signs. I thought that was just what finding a home felt like.
[Kestrel | neutral] Part of it was people making a home with you. That remains within our power. Part was the old welcome answering through the lamps: warmth recognising a place kept for you. If it fails, a lamp will still light a path. It will no longer carry that answer.
[N] Tully turns his mug so the chipped side faces away. He says the shore lamps once changed when a tired traveller came around the headland: the light grew steadier, easier to follow without growing harsh. Lately, he has had to watch the turn more carefully himself. He had thought the first missed answer was weather. Then it happened on a clear night.
[Tully | neutral] We can keep meeting people. We can put a coat over a cold shoulder and carry the bag. I mean to. I would still like to keep what those who came before us made for that work.
[N] Kestrel’s survey has three sets of measurements: early autumn, after Emberfall, and this week. She explains the scale before showing the result. Each measures the welcome’s response to the same small offered light, with the ordinary lamp tested separately. The response has weakened at every set. Your lake reading adds a surviving example of how the older lights joined, rather than another measurement of their present strength.
[Kestrel | neutral] The annual renewal is at Midsummer, the twenty-first of June. Moth found the old cycle records; my measurements agree with the decline recorded before earlier renewals. This time the reserve is too weak to carry another turn unaided. We need to restore the shared welcome before that renewal passes.
[N] You find the date on the corner of the survey: 21 June, 2027. Six months away. It is far enough to contain lessons, meals, mistakes, and work that cannot be completed tonight. It is close enough to write on the first page of the investigation. You draw a box around it, leaving space below for what must happen before then.
[Saoirse | attentive] So we have a date. We do not have to make the whole answer before we go to bed. I would have tried. I am telling you because I would have tried.
[Kestrel | neutral] Honoria is organising the academy’s response. Okoro and I will keep the working wards sound. Hask and Moth are checking the older accounts. Tully will keep the arrival routes running. Your part is to help us understand the small lights and the people who offered them. That is real work. It is not the whole burden.
[N] You write the tasks under the date, each beside the person responsible. Saoirse adds the instrument and its limits under her own name. Tully puts the next winter round under his. Kestrel asks you to leave a blank line for the task you choose. The page begins to look less like a verdict and more like a difficult piece of work that can be shared.

--- SECTION winter-duty | place: tully-cottage | time: night | date: 2026-12-21 ---
[N] You and Saoirse read your lake accounts aloud without changing them first. Kestrel asks about the separate answers, then about the opening in the ring. Tully remembers an old shore chart with a landing marked near the Candlestones. He brings it from a drawer, leaving the visitor list where it is. The two records have different purposes and different people’s business in them.
[IF longnight:echo-record = pattern]
[N] Your sketch shows the late-joining light and the unclosed gap. Saoirse’s page supplies the short invitation you did not try to catch. Side by side, the accounts preserve more than either of you managed alone. You add a note explaining which page records the sequence and which records the sound. Neither signature belongs on the other person’s observation.
[END IF]
[IF longnight:echo-record = words]
[N] Your page holds “if you wish” between two honest blank spaces. Saoirse’s sketch gives the separate flames somewhere to stand. You mark the delayed answer beside the light she saw join last, noting that the match is probable rather than certain. It is a useful connection even with a question mark still attached.
[END IF]
[Kestrel | neutral] Separate lights, separate answers, an invitation. Taken together, this supports willing participation. We still need the terms of the connection: how they joined and how that opening was kept. Do not fill those in because the arrangement looks familiar.
[N] The chart places the old landing below the Candlestones. From the cottage you can see only the dark shape of their ridge. Snow covers the lower approach, and Tully has closed its gate. He points out the spring path with one finger. When the thaw makes it usable, you can examine the stones with Kestrel and compare their surviving marks with tonight’s echo.
[Tully | neutral] The ridge can wait for a clear path. We cannot make the weather hurry. We can make sure the right papers and the right people are ready when it opens.
[N] There are two useful jobs available now. Tully needs a clear handover sheet for the winter rounds, including where observations can be made from safe ground. Imogen has asked for a source list connecting the working registers to the shore chart. You can start either at the bench tonight and continue it through the ordinary weeks of term. The other will go on the shared work list.
[N] The investigation needs both practical continuity and a record someone else can follow. Choose a bounded contribution. You will have help, and time for the rest of your life at the academy.
[DECISION longnight:winter-duty] Which winter task will you begin?
[OPTION handover] Help Tully make the rounds easier to hand over. | journal: I began a winter handover sheet with Tully, recording route checks and safe observation points to review before the spring approach opens.
[OPTION archive] Prepare the shore sources for Imogen’s spring research. | journal: I began a source list linking the shore chart, working-register references and Longnight observations for Imogen to check before spring.
[END DECISION]
[IF longnight:winter-duty = handover]
[N] You draw a fresh sheet with spaces for the route, the check, and who receives the next round. Tully tries using it while you watch. At the second line he stops: you have written “usual turn,” which tells a newcomer nothing. You replace it with the bridge fork and the upper marker. On the last line you put a name for the handover, so a finished round cannot quietly become an unattended one.
[N] You add a sketch of the check you completed on the round, with the route direction marked beside it. Tully tries reading the instructions without looking at your hands. Where he has to ask what you meant, you add the missing detail. The sheet needs to work when you are absent.
[Tully | warm] Bring this on the next round and we will try it with somebody who has not heard us explain it. When the spring path opens, this will tell us where our winter checks ended. We will not have to trust my memory for all of it.
[END IF]
[IF longnight:winter-duty = archive]
[N] You give the shore chart its own line, with the drawer it came from and Tully’s permission to copy it. Below that go the autumn register references and the two lake observations. You leave a space for Imogen to check the links. The first version makes a date look like a keeper’s name; Saoirse catches it when she tries reading the list aloud. You change the headings.
[Tully | neutral] Copy the old chart, yes. Leave the arrival list here. If somebody needs an account from a current traveller, they can ask that traveller. Those names were given to me for meeting people at the bridge.
[N] You make two copies of the source list, one for Imogen and one to stay beside the chart. Saoirse volunteers to deliver the first on your way to supper. In the margin, you write a spring question: does the approach marked here lead to the same opening seen in the echo? The question is narrow enough that an actual visit could answer it.
[END IF]
[N] Kestrel checks that your task has a first step, a person who can help, and somewhere to stop. Then she puts away the survey. Saoirse begins to reach for the lamp lever and catches herself. It can wait until tomorrow. Tully covers the kettle and asks which of you will carry the empty mug crate back up to the hall.
[Tully | warm] Thank you for the round. And the paper. Leave the future here for the length of the walk, if you can. The mugs need both hands.

--- SECTION longnight-supper | place: lantern-hall | time: night | date: 2026-12-21 ---
[N] Blue and white lanterns hang under the hall’s dark rafters. Snowflake shapes turn slowly above the tables, catching amber light from below. Through the round window, the night looks clean and impossibly cold. Inside, somebody has saved four places together without trying to make an announcement of it. You set the mug crate beside the serving table and feel the relief of having carried it all the way.
[N] The meal has been kept in covered dishes. Kestrel goes to speak with Honoria before sitting down; Tully puts his route sheet into his coat and makes himself take the chair facing away from the door. Saoirse notices this and says nothing. A student brings him bread. For a few minutes, the person who waits for arrivals is allowed to arrive.
[IF longnight:shore-work = landmarks]
[N] One of the visitors from the bridge passes your table on the way to the hearth. They say the upper marker was a help; they had nearly followed the lower track. Tully points to you with his spoon. The visitor thanks you, then continues towards the person they came to see. Your part in their evening is small and complete.
[END IF]
[IF longnight:shore-work = lanterns]
[N] The student who escorted the visitors pauses beside Tully to report that every route lamp is closed and burning steadily. Tully asks specifically about the repaired catch. It held. Saoirse taps the place where you wrote your initials on the check sheet, then lets the report end. There is no need to make it into a speech.
[END IF]
[N] Saoirse has managed half her meal before she takes out the notebook. You see the movement and she stops, smiling ruefully. Instead of opening it, she slides it under the chair. Then she asks whether you prefer the blue lanterns or the orange ones from Emberfall. It is an ordinary question with an answer that will not help solve the mystery.
[Saoirse | warm] I like these. I think. The orange ones made everything feel close enough to reach. These make the roof look as if it goes on forever. Ask me again after pudding; I may have a completely different theory.
[N] Kestrel returns with a fresh page folded into her case. Honoria will put the next investigation meeting on the term calendar, with time for the staff reports and your winter work. There will still be classes tomorrow. A deadline six months away does not cancel the need to learn what you are doing before you try it.
[Kestrel | neutral] Your observations are safe in the case. Keep your own copies. If another detail comes back to you later, date it as a later recollection. For tonight, eat while the food is warm. We can ask better questions after sleep.
[N] At the far end of the hall, someone begins a song too softly for everyone to hear. A second voice picks it up, then another. Tully knows the words but hums only the part he likes. Saoirse gets one line wrong and laughs into her sleeve. The sound fills the space where the notebook might have been.
[N] You know more than you did when the evening began. Seven willing lights once joined here. An opening was left for someone else. The welcome is weakening, and Midsummer is the next renewal. You also know where your winter work begins and who will be doing the other parts. The unanswered questions have places to go.
[N] Saoirse rests one hand on the table beside your cup. She has stopped pretending that she is not frightened, and has begun eating again anyway. You can offer her your hand and a promise of company, or put words to the practical plan you will carry into tomorrow. Around you, the longest night continues to make room for supper.

[EXIT 0] Take her hand and promise to finish this together.
[EXIT 1] Make a careful plan for the work ahead.
```

### Chapter 6

```
=== SCENE thaw | chapter 5 ===


--- SECTION path-opens | place: candlestones | time: morning | date: 2027-03-20 ---
[N] The first thing you notice is running water. It comes from somewhere below the path, a thin bright sound under the birds. The last shaded patches of snow still lie against the ridge, but the way between the standing stones is dry. Across the mere, the academy looks pale in daylight. Its windows have become windows again, each catching its own piece of sky.
[N] There have been ordinary weeks between Longnight and this morning: lessons, wet boots by the common-room hearth, a book you returned late, a conversation about something that had nothing to do with lanterns. The winter work continued among them. You did not spend every hour staring at a deadline. March arrived anyway, with a clear morning and Tully’s message that the upper approach had been checked.
[IF longnight:winter-duty = handover]
[N] The round sheet you began with Tully has softened at the folds. Two other keepers have used it. One added a sketch of the gate; another crossed out your instruction to stand beside the tall post because the post was hard to distinguish in snow. Their version names the stone step instead. On the last winter check, the initials belong to somebody you have not met.
[Tully | warm] It worked while you were in class and I was at the bridge. That is what I wanted. This morning’s check begins where those winter checks stopped. We know which bit is new work.
[N] You put today’s dry approach beside the old closed-route mark and add the date. The winter sheet goes into the case intact. Imogen uses its observation-point sketch to orient the shore chart, then asks permission to copy it into the investigation notes. Something made for a practical round has become a useful source without ceasing to belong to the people who use it.
[END IF]
[IF longnight:winter-duty = archive]
[N] Imogen brings the source list you began at Tully’s workbench. She has checked each reference, added the archive shelf marks and circled one copied date. The date belonged to a repair of the landing, not its construction. Because you kept the sources separate, she could correct that line without pulling apart the whole account.
[Imogen | warm] The chart is useful. Your list made it possible to find out exactly how useful. I followed the repair note back to the original, and it describes the upper approach. We can compare an actual route now, instead of guessing what the little line means.
[N] Tully sets the modern route sheet beside the older chart. You align the landing, the turn, and the ridge. The current path bends around a fallen rock that the old drawing does not show, but both reach the same space between two stones. You mark the difference on a loose comparison page. The old chart stays unaltered.
[END IF]
[IF longnight:winter-duty = (none)]
[N] Tully brings the winter route record and Imogen brings a checked source list. You read them together at the start of the path. The records show where the winter checks ended and how the old landing relates to the upper approach. You add today’s date beside the dry-route observation, giving the visit a clear beginning without pretending to have made the earlier sheets.
[END IF]
[N] Kestrel joins you at the last turn. She has left the bulky winter markers at the academy and brought a smaller case. Tully points out the firm ground around the ring, then gives the route sheet to her. His next crossing is waiting for him now that the boats can move again. He wishes you a useful morning and takes the path down towards the water.
[Tully | warm] I shall be at the landing if you need the chart explained again. If you find a rule saying all boatkeepers get a second breakfast, make me a very careful copy.
[N] The stones are less orderly up close than they looked from the lake. Their heights differ, and their surfaces carry lichen, small cracks and places where rain has deepened the grain. At the centre, old branches rest inside a ring of hearth stones. Nobody has lit them today. The open path enters where the Longnight sketch left its gap.
[Imogen | attentive] I brought three pencils because last time one of us dropped one. I also brought a page on which I have written nothing at all. You may admire the restraint.
[N] You can see faint marks on the broad face of the nearest stone, but light and weathering break them into pieces. Kestrel asks you to make an ordinary record before using Echosight. Imogen will take whichever part you leave: the relationship of the open path to the ring, or the condition of the marked surface.
[N] Both records will be needed. One puts the inscription in its place; the other shows what is physically present before magic supplies anything. Choose the part you want to examine closely.
[DECISION thaw:reading-method] Where will you begin?
[OPTION approach] Compare the open approach with the winter sketch. | journal: At First Thaw I compared the safe approach with the open ring recorded at Longnight; Imogen recorded the stone surface before Echosight.
[OPTION surface] Record the weathered marks before reading their echo. | journal: At First Thaw I recorded the weathered surface before Echosight; Imogen compared the approach with the Longnight sketch.
[END DECISION]

--- SECTION room-in-stone | place: candlestones | time: morning | date: 2027-03-20 ---
[IF thaw:reading-method = approach]
[N] You begin outside the ring and follow the path without stepping onto the planted edges. It brings you between two stones to the unlit hearth. From there you can see the lake landing through the opening. You turn the winter sketch until its viewpoint matches. The distance is wrong for a precise map, but the relationship is clear: the gap faces the way people came.
[Imogen | attentive] The stone has two lines of shallow marks. Some edges are still physical; some are too worn to read. I have copied only the edges I can actually see. The rest of this page is waiting for the spell.
[END IF]
[IF thaw:reading-method = surface]
[N] You stand where the morning light falls across the broad stone face. There are two rows of shallow cuts, interrupted by wear and patches of lichen. You sketch their positions without rubbing, scraping or touching the surface. A darker groove turns out to be a crack when you look from the side. You mark it differently from the deliberate cuts.
[Imogen | attentive] The approach meets the gap on the side facing the old landing. I walked it both ways. The winter sketch is not a measured plan, but it gives the same relationship. Somebody approaching from the water would come into the space we left blank.
[END IF]
[N] Kestrel asks you and Imogen to choose separate positions where neither will have to lean or block the other’s view. You put the notebooks on a flat dry rock. The wind lifts a corner and you weight it with the pencil case. The stone has waited through a winter. It can wait through the ordinary difficulty of arranging paper.
[Kestrel | neutral] Keep the echo to the surface. We are asking what was offered here, not calling for every life that passed this way. Record the words you can read and let the rest remain uncertain.
[N] You begin Echosight with the steadier breath you learned in the library. Amber gathers along a shallow cut, then bridges a place where the surface has worn away. The stone itself does not heal. Behind the reflected warmth, the old break remains. A whole letter becomes readable, followed by another. Imogen’s pencil starts moving before she remembers to leave room between the lines.
[IMAGE candlestones-inscription] A weathered standing stone under Echosight displays: A light freely offered. A space for whoever comes next.
[N] The restored reading is two sentences: “A light freely offered. A space for whoever comes next.” The first describes the giving; the second keeps an opening beyond the people already present. The amber letters belong to Echosight. Under them, the stone remains weathered, with gaps that cannot be read by ordinary sight alone.
[N] You lower your hand before looking at Imogen’s page. She has copied the same two sentences and put a small mark beside “freely.” Your page has more space around “whoever.” The different emphasis does not change the words. Kestrel reads both copies, then asks you each to say where the sentence ends. Both of you point to the same place.
[Imogen | grave] I kept hoping we would find the name of the strongest witch and learn what they did. There must have been somebody who knew how to hold it all. But this tells us to leave room for a person we do not even know yet.
[Kestrel | neutral] Someone had to learn the work. That part is still true. The inscription gives the work a condition: it cannot depend on taking a light that has not been offered, or on closing the circle to everyone outside it.
[N] A gust comes through the opening and lifts the loose comparison page. You catch it against your coat. Imogen laughs once, unexpectedly, then writes a note about the direction of the path. The gap is an idea you are trying to understand and an actual space through which weather arrives. Both facts can be true at the same time.
[N] The copies receive the date, the location and the method used to read them. Kestrel signs as witness to the exercise. You add the ordinary surface sketch so a later reader will know which part required Echosight. The notebook now connects three kinds of record: the old working chart, your winter observation and the spring inscription.

--- SECTION question-for-class | place: candlestones | time: morning | date: 2027-03-20 ---
[N] Kestrel calls a break before anyone can ask for another reading. Imogen finds the bread she packed under a stack of spare pages. It has acquired the faint shape of the notebook binding but tastes perfectly good. You sit on a low dry rock beside the path. From here the village roofs look close enough to touch, although the walk back will remind you otherwise.
[Imogen | guarded] I like a record that stays where I put it. I know that sounds obvious. I mean I like being able to arrange everything until it makes sense. People do not do that. If the method depends on people choosing, I cannot finish it by making a better list.
[Kestrel | warm] A list can tell people what they are being asked to do. That is a useful beginning. It cannot supply their answer. You have already learned to leave a space when the source does not tell you enough. Leave one here as well.
[N] Imogen looks back at the open path. She asks what happens if somebody joins and then changes their mind. You ask whether a newcomer can join after the circle has begun. Kestrel puts both questions on a fresh teaching card. They are small enough to test without waiting for Midsummer, and necessary enough that no large restoration should proceed without them.
[Kestrel | neutral] Threadbind is the technique we will practise. Two small willing lights to begin with. A person must be able to withdraw without losing their own light or dragging the other after them. Then we will ask whether they can be invited back. We can learn that in Warding Hall this afternoon.
[N] The instruction sounds manageable until you picture doing it. Keeping your own Kindle steady already takes attention. Listening for someone else’s choice while holding a connection will take more. Kestrel does not ask you to say you are confident. She asks whether you are willing to practise with a partner under supervision.
[Imogen | warm] I am. Provided we can make a mess of the first attempt without turning the mess into a prophecy about June.
[Kestrel | warm] That is what a first attempt is for. The floor has survived more ambitious students than either of you.
[N] Before leaving, you check that all the loose pages and pencil stubs are in the case. Nothing has been tied to a stone or left burning in the old hearth. The circle remains a place someone else can visit after you. Imogen pauses at the opening to look back once, then takes the path towards the academy with the teaching card tucked inside her notebook.

--- SECTION two-small-lights | place: warding-hall | time: afternoon | date: 2027-03-20 ---
[N] Afternoon sunlight crosses the patterned floor of Warding Hall. The practice shields stand against the wall, their edges worn by generations of careful and less careful work. Kestrel has cleared a small area between two of the floor circles. Your exercise will use neither the whole hall nor the grand design under the central window. Two stools, two unlit practice lamps and a narrow strip of open floor are enough.
[N] Imogen puts her notebook on the stool and immediately has nowhere to sit. She moves it to the floor, thinks better of that, and gives it to you while she takes off her coat. By the time you both settle, Kestrel has arranged the lamps on the steady low stands. She watches the exchange with a patient expression that makes Imogen laugh at herself.
[Kestrel | neutral] Today I am assessing three things: a light offered deliberately, a connection that leaves room, and a release that does not hurt either participant. Brightness is not on the list. If your partner withdraws and you let them go cleanly, you have done part of the exercise well.
[N] You each kindle a small flame in your own lamp. Imogen’s wavers when she glances at yours. Yours leans when you watch hers. Kestrel asks you to separate the tasks. First make your own light comfortable. Then notice your partner without trying to copy them. The flames become different sizes and steadier for being allowed to differ.
[Imogen | shy] I appear to be trying to get the same answer as you. I can see why that might become a problem in a lesson about offering my own light.
[N] Kestrel demonstrates with a practice lamp of her own and asks Imogen whether she is ready to join. Imogen says yes. A fine amber connection curves between them, leaving a visible opening instead of closing around their feet. Kestrel asks her to lower her hand. The connection loosens and ends; both lamps continue burning separately.
[Kestrel | neutral] Kindle supplies the light. Threadbind carries an invitation between willing lights. Follow the curve towards your partner, leave the opening, then wait for their answer. Do not pull. The moment you must pull to keep someone in place, release and begin again.
[N] You try together. The first line appears too quickly, a tight bright loop between the stands. Imogen’s hand stiffens. You feel an urge to hold the shape because it is finally visible. Kestrel asks both of you to release. The loop vanishes before either lamp goes out. She makes a small note and tells you exactly which part was useful: you both stopped when asked.
[N] On the second attempt you leave more space and wait. Imogen says she is ready before raising her hand. The connection forms slowly, thinner than the first loop and easier to hold. There is room between the lamps for a person to walk without crossing a line of force. Kestrel places a chalk mark at the point where you can see the opening most clearly.
[N] The next part is withdrawal. One person will leave the connection while the other keeps their own light steady. Then you will exchange roles, so both of you learn what the other side feels like.
[DECISION thaw:practice-role] Which role will you try first?
[OPTION leave] Withdraw first and describe what the release feels like. | journal: In the first Threadbind exercise I withdrew first, then exchanged roles with Imogen. Both lights survived a clean release.
[OPTION hold] Keep your own light steady while Imogen withdraws. | journal: In the first Threadbind exercise I held my own light while Imogen withdrew, then exchanged roles. We practised releasing without pulling.
[END DECISION]

--- SECTION leave-and-return | place: warding-hall | time: afternoon | date: 2027-03-20 ---
[IF thaw:practice-role = leave]
[N] You tell Imogen you are going to lower your hand. She nods, then watches you so intently that her flame leans sideways. You lower slowly. For a moment the connection stretches like a strand caught on a sleeve. You stop moving and say what you feel. Imogen releases her attention from your light. The strand settles away and your own lamp stands clear.
[Imogen | attentive] I was trying to help you keep it steady. Which was not what you were asking me to do. Let me try giving my own lamp all that unnecessary supervision.
[N] The second release is clean. You can lower your hand, breathe and turn towards the stool without a tug. When you exchange roles, you recognise the temptation immediately: Imogen’s departing light looks like part of your good work disappearing. You let it separate anyway. The small flame remaining in your own lamp is enough.
[END IF]
[IF thaw:practice-role = hold]
[N] Imogen says she will lower her hand. You nod and keep watching her flame. As she begins to leave, the connection lengthens instead of opening. She pauses and tells you it feels as if something has caught. Kestrel asks where your attention is. You bring it back to the light you are responsible for. The strand falls away without extinguishing either lamp.
[Imogen | warm] There. That felt different. I could leave without having to persuade the spell that I meant it. Tell me if I forget that when we exchange places.
[N] You repeat the exercise until Imogen can release smoothly. Then you exchange roles. Lowering your own hand feels stranger than watching hers: the shared warmth thins, and for a breath you miss it. Your lamp keeps burning. Imogen does not chase the departing connection. You can turn towards the stool and decide for yourself whether to come back.
[END IF]
[N] Kestrel calls for a pause. The lamps remain on their stands while you drink water and stretch your fingers. Imogen writes down the sensation of the caught strand, then crosses out “failure” as the heading and replaces it with “first attempt.” The correction is small enough that she does not ask anyone to admire it.
[Kestrel | neutral] Now the other question from the stones. Someone who has stepped away wants to return. They are not automatically part of the connection because they belonged to it earlier. How will you invite them without making the invitation another demand?
[N] You take the place beyond the opening while Imogen holds her light. She begins explaining where to stand, when to lift your hand, and what the first warmth will feel like. You are trying to listen to all three instructions when the invitation flickers out. Imogen stops halfway through a fourth explanation. The silence that follows is almost a relief.
[Imogen | amused] I have made a doorway with an examination at the entrance. I can hear it now. Give me a moment to stop explaining why I was explaining.
[N] The spell needs a clear invitation that leaves the returning person time to choose. You can agree on a simple readiness signal before trying again, or open a quiet space and let the newcomer begin the exchange.
[DECISION thaw:rejoining] How will you make the return easier?
[OPTION signal] Agree on one readiness signal before sending the invitation. | journal: For the Threadbind return we agreed on one readiness signal, waited for it, and let the returning person choose when to join.
[OPTION space] Leave the opening quiet until the returning person asks to join. | journal: For the Threadbind return we left a quiet opening and waited for the returning person to ask before offering the connection.
[END DECISION]
[IF thaw:rejoining = signal]
[N] You agree that raising an empty hand means ready to receive the invitation, not already joined. Imogen repeats that distinction once and stops talking. You settle your own light, raise your free hand, and see her look for the signal before offering the curve. This time there is only one thing to answer. You choose to bring your light alongside hers.
[Imogen | warm] That is something I can put on an invitation card. Briefly. You may confiscate the fourth sentence if one appears.
[END IF]
[IF thaw:rejoining = space]
[N] Imogen holds her own light and leaves the gap alone. You take a breath with nobody describing it to you. When you are ready, you ask to join. She looks up, answers, and offers the curve. The connection settles without either of you hurrying. The space existed before you used it and will remain when you leave.
[Imogen | warm] We can tell people there will be someone to ask. We do not have to put them on the spot the moment they arrive. I would rather have an invitation like that myself.
[END IF]
[N] You exchange places once more. Imogen gets to be the person who waits outside and decides when to come in. You discover that waiting for her answer takes its own kind of attention. Holding a space open does not mean filling every quiet moment with reassurance. When she joins, the two small lamps answer evenly.
[Kestrel | warm] Both of you joined, left, and returned. Both kept your own light. That is the exercise. We will repeat it with more people before attempting anything at the Heartfire, but you have a method worth practising.

--- SECTION invitation-draft | place: warding-hall | time: afternoon | date: 2027-03-20 ---
[N] The practical ends with putting things away. You extinguish the practice lamps in the order Kestrel shows you, check the stands are cool, and wipe the chalk from the open floor. Imogen’s notebook has acquired a ring from the water cup. She looks at it, sighs, and keeps the page. The useful account has survived.
[N] Rowan arrives at the door carrying the books he promised to return to Imogen. He waits until Kestrel waves him in. His first question is whether the stones answered. His second is whether you have eaten since leaving them. Imogen answers both at once and gets the order muddled. He puts the books down and offers to fetch something while you finish.
[Imogen | warm] We found the words. We tried the method. It worked after we gave it room to work badly first. I will make you a copy that does not require you to decipher my cup mark.
[Rowan | warm] Can somebody help without being good at the spell yet? I am thinking of people who will say yes before they understand, because saying no in front of everyone feels worse.
[N] The question changes the draft. You begin with what is being asked: practise a small offered light, with help available, before deciding about the restoration. Watching is allowed. Leaving is allowed. There will be work carrying lamps, keeping records and welcoming people who do not cast. Imogen writes the practical limits before she writes anything about saving the academy.
[IF thaw:rejoining = signal]
[N] You add the agreed readiness signal to the practice card, then make clear that people can ask for another way to communicate. The signal belongs to the exercise, not to membership of the academy. Rowan tries reading the card aloud. It is short enough that he reaches the end without asking what he is supposed to answer.
[END IF]
[IF thaw:rejoining = space]
[N] You put a named contact and a quiet practice time on the card. People will be able to ask about joining when they are ready, instead of answering in front of the whole hall. Rowan circles the time to check against the kitchen shifts. An open invitation is not useful if everybody it names is working then.
[END IF]
[N] Kestrel returns with the class record. She looks at the draft and asks where you will record a person’s actual answer. Imogen starts a separate sheet. An expression of interest will not be copied into the final participant list without another check. The next practice will have its own invitation; the final ritual will have one too.
[Kestrel | neutral] By Bloomtide we need a rehearsal people can understand and choose. Okoro and I will test the larger arrangement. You can help shape the invitation and hear what prevents people from accepting it. An objection may tell us how to improve the plan.
[Rowan | warm] Then I will start with the kitchen times. Someone always remembers the grand speech and forgets that supper still needs making. If we ask Grey and the serving team early, we can actually listen to their answer.
[N] For the first time, the route from a found inscription to Midsummer has several visible steps. Learn the small method. Test it with more people. Ask what participation costs them. Change the arrangement. Confirm their choice. You will still need care and luck and further practice. You will not need to discover a single person large enough to hold the whole academy alone.
[N] Imogen turns the draft towards you. The wording is ready to try. You can begin with a notice inviting the whole academy to a supported practice, or with individual conversations among your friends before widening it. Neither route supplies anyone’s answer in advance. Rowan waits with the returned books under one arm, and the afternoon light moves another inch across the floor.

[EXIT 0] Invite the whole academy to help.
[EXIT 1] Begin by asking your friends, one by one.
```

### Chapter 7

```
=== SCENE bloom | chapter 6 ===


--- SECTION wrong-hour | place: warding-hall | time: afternoon | date: 2027-05-01 ---
[N] By the first of May, the practice cards have reached places you would not have thought to put them. One has a tea stain from the kitchens. Another has been folded small enough to fit in a tool pouch. They return to Warding Hall with questions written on the backs. Some people want to try a light. Some want to watch. One has asked whether the session can begin at a time when they are not repairing the door everybody uses to reach it.
[N] That last card belongs to Grey. He brings it himself, together with a short list of jobs that cannot be abandoned halfway through. He has not come to oppose the rehearsal. He wants to know whether accepting the invitation requires pretending his work does not exist. Rowan, who helped choose the time, looks from the card to the clock.
[Grey | attentive] I can be here before the meal service, or after the next keeper takes over. I cannot be in two places in the middle. There is no virtue in leaving a door half fastened so I can stand in a circle about looking after people.
[Rowan | small] I checked the student timetable. I thought that was checking the time. I should have asked you before the cards went out.
[N] Okoro joins you beside the practice stands. He introduces himself as Kestrel’s colleague and today’s rehearsal lead. Kestrel will record the connection tests; he will watch how the arrangement works for the people using it. He asks Grey how much time he can comfortably give, and writes that answer down before suggesting any solution.
[Okoro | warm] A small rehearsal at a usable hour will teach us more than a large one people cannot attend. We can move the first practice earlier, or divide it into two groups with a proper handover. Both need a clear notice. Neither needs anybody to apologise for having a job.
[N] Noor arrives carrying a card with its answer still blank. She says she would like to watch this afternoon and decide about a later practice. Rowan starts to tell her that she will be good at it, then catches the assumption and asks where she would like to sit instead. She chooses a place near the door, where she can leave for a letter she is expecting.
[Noor | neutral] I want to see the whole exercise before I decide. Including the part where somebody stops. The invitation says that is allowed; I would like to see what it looks like.
[IF thaw:rejoining = signal]
[N] The practice card carries the readiness signal you tried with Imogen. Okoro asks the group to choose an equivalent spoken word for anyone whose hands will be occupied. You add it beside the drawing. The signal is a way to hear an answer, not a test people must perform before being welcome.
[END IF]
[IF thaw:rejoining = space]
[N] The quiet practice time you put on the card has brought two people who did not want to answer in front of a crowd. Okoro keeps the place near the opening clear and tells them who to ask when they are ready. He does not keep looking over to check whether they have decided yet.
[END IF]
[IF thaw:rejoining = (none)]
[N] Okoro reads the practice card aloud: watching is welcome, a person may stop, and nobody is committed to the Midsummer ritual by coming today. He asks everyone to agree on a clear readiness signal before the first attempt. The arrangement begins with the people present, not with an assumption about earlier lessons.
[END IF]
[N] Grey’s available times leave two workable arrangements. An earlier, shorter practice can finish before service begins. Two small groups can use the original period and meet through a handover. You will help carry the correction to the people who received the first card.
[DECISION bloom:rehearsal-plan] How will you adjust the rehearsal?
[OPTION earlier] Move the first practice earlier and keep it short. | journal: For Bloomtide we moved the first rehearsal before the service work and kept its scope small enough to finish on time.
[OPTION relay] Use two small groups with an explicit handover. | journal: For Bloomtide we split the rehearsal into small groups with a handover so participants could attend around their work.
[END DECISION]
[IF bloom:rehearsal-plan = earlier]
[N] You mark the new time and the shorter task on a fresh card. Rowan takes copies to the original notice places while you tell the people already waiting. Grey checks the revised finish against his work list and says yes. Okoro removes the second connection exercise from today’s plan. A shorter session needs less work in it, not faster instructions.
[END IF]
[IF bloom:rehearsal-plan = relay]
[N] You draw two small groups on the planning sheet and leave a line between them for the handover. Rowan checks who can attend which one. Grey joins the later group after his work is covered. Okoro keeps the first group’s observer for the opening of the second, so the next attempt can use what the previous one learned.
[END IF]

--- SECTION rehearsal-release | place: warding-hall | time: afternoon | date: 2027-05-01 ---
[N] Five practice lamps stand inside a broad open curve. The people beside them have different levels of experience. One flame is almost as small as the match that lit it; another has to be reduced twice before its owner stops trying to make it impressive. Okoro checks that each person can keep their own light steady without joining anything. Kestrel watches from outside the curve with the record board.
[Okoro | neutral] First we will join one at a time. Then I will ask for a planned release. Keep enough attention for your own lamp. The person who stops is doing the exercise with us.
[N] Rowan stands next to you. His light is small and steady, but his free hand keeps smoothing the edge of his sleeve. When you look over, he smiles too quickly. There is no time for a private conversation in the middle of instructions. You ask whether he wants the first turn or the second. He chooses the second and seems relieved to have been asked a question he can answer.
[N] The first light joins. You wait for the agreed response before offering yours, then feel the little change as Rowan answers. By the fifth light, the warmth has become a shared presence without becoming a wall. There is still room at the opening. Noor watches from her chosen seat, her unanswered card lying flat on her knee.
[N] Okoro asks one participant to leave. The departing light separates cleanly, but the remaining four waver. Someone tries to compensate by brightening; another tightens the curve. Rowan’s flame rises sharply. Okoro calls the stop. Everyone lowers their hands. Five separate lamps remain on five separate stands.
[Okoro | neutral] The release was clean. Our response to it needs work. Several people tried to fill the empty place without being asked. Let us find out what each of you thought was happening.
[N] The answers differ. One person thought the gap meant the exercise had failed. Another believed the group needed exactly five lights to be strong. Rowan says he felt a drop in warmth and tried to hold it up. Kestrel writes those answers separately. A single instruction to “try harder” would have missed every actual problem.
[Rowan | grave] I thought that if I could give a little more, nobody would have to stop. I know you said stopping was part of it. I heard that until it happened.
[Okoro | warm] Then this time we expect the warmth to change. Let it become a four-person connection. We are testing whether it can adapt, not whether five people can pretend to be five forever.
[N] On the second round, everyone knows whose departure to expect. The light separates, and the circle grows quieter. Rowan lets his own flame remain small. The warmth settles at a different strength. It does not feel identical to the first arrangement. It feels stable enough for the people who are actually there.
[N] Noor asks whether the departing person may return. Okoro makes room for the invitation, and the fifth light comes back after an answer. Then Noor folds her card and says she would like to try a later session. She is still leaving now for her letter. Nobody treats that departure as a loss the circle must prevent.
[IF bloom:rehearsal-plan = earlier]
[N] The shorter practice ends at the time you wrote on the card. Grey checks the clock, puts away his lamp and reaches the service door before the next job begins. He tells you that he can attend another session if it keeps the same promise. The finished record includes the successful release and the fact that the schedule worked.
[END IF]
[IF bloom:rehearsal-plan = relay]
[N] At the handover, the observer explains the mistake about compensating for the departing light. The second group starts with a planned change in warmth and reaches a stable release sooner. Grey arrives after his work is covered and takes his place without an apology. The two groups have made one useful rehearsal without all having to stand together at the same time.
[END IF]
[N] Kestrel takes the results to the staff meeting. Okoro leaves the practice stands out for the next supervised session and asks you to carry only the cooled lamps. Rowan picks up two, then puts one back so he can hold the other securely. It is a small decision. You notice it because of what happened in the curve.

--- SECTION rowan-afterwards | place: lantern-hall | time: evening | date: 2027-05-01 ---
[N] By supper, flowers have appeared along the tables under the hanging lamps. The round window holds a violet edge of evening above the lake. You find Rowan at a place near the end of a bench, arranging cups that are already straight. He moves one towards you before you ask. For once there is no story ready to fill the moment after you sit down.
[Rowan | small] I knew the practice was meant to include somebody leaving. When it happened, all I could think was that everyone would feel the difference. I wanted to stop them feeling it. That sounds kind until you notice I had decided what they were allowed to feel.
[N] Saoirse sets a covered plate beside him, asks whether the two of you want a little room, and takes her own cup farther down the table when Rowan says yes. He watches her go. Nobody has been pushed away. The conversation has simply become small enough for what he wants to say.
[Rowan | grave] If I am the one making people comfortable, I know what I am for. If I am frightened or tired, somebody else has to do something about me. I keep thinking that means I have failed before we even get to June.
[N] His plate is still covered. You remember him asking whether you had eaten after the stones, making room at the first supper, and choosing the second turn in today’s practice. None of those moments required him to be the whole source of warmth. It is harder to say that in a way he can use than to tell him everything will be fine.
[N] Rowan has named something he usually hides under helpfulness. You can make a specific agreement to share the work, or stay with the feeling before either of you turns it into another task.
[DECISION bloom:rowan-support] What will you offer him?
[OPTION share] Agree on a clear way to ask each other to take over. | journal: At Bloomtide Rowan told me he fears failing people when he needs help. We agreed on a simple request to take over one small task.
[OPTION stay] Stay with him without asking him to fix the feeling. | journal: At Bloomtide Rowan told me he fears failing people when he needs help. I stayed with him without requiring him to turn the feeling into useful work.
[END DECISION]
[IF bloom:rowan-support = share]
[N] You suggest a request small enough to say while things are happening: “Can you take this part?” The answer can be yes, no, or a different offer. Rowan tries it on the covered plate. Can you pass it closer while he puts the cups down? You do. He laughs at how ordinary the first example is, then finally begins eating.
[Rowan | warm] I can remember that. I do not have to wait until I am in trouble impressive enough to deserve help. You can ask me as well. I would like to learn the part where helping is an answer, instead of something I do before anyone has spoken.
[END IF]
[IF bloom:rowan-support = stay]
[N] You tell him there is no task he has to find for you. For a while you sit with the covered plate between you and listen to the hall. Rowan starts to make a joke, stops, and lets the pause remain. When he eventually uncovers supper, he offers you a piece of bread because he wants to share it, not because the quiet needs repairing.
[Rowan | warm] I thought you might be disappointed if there was nothing clever under it. There is just me being afraid of letting people down. Thank you for letting that be enough to say.
[END IF]
[N] The meal does not solve the fear. It gives the two of you a different way to be with it. When Saoirse looks over, Rowan waves her back with his cup. He asks about her lamp without pretending the conversation you have just had was nothing. It can remain private without having to disappear.

--- SECTION imogen-record | place: lantern-hall | time: evening | date: 2027-05-01 ---
[N] Imogen arrives with a bound working register and a sheet protecting its new cover from the supper table. Maelin and Dunne have checked the source references. Grey has read the descriptions of the work. The names are not arranged by rank or by brightness of magic. Each recovered person has the record that supports their place, and a blank margin where later corrections can be added.
[Imogen | grave] There was a week in February when every reference seemed to point to another reference. I thought perhaps we were making the story larger because we did not want to admit we could not finish it. I nearly put the notebook away for good.
[N] She turns to one of the working entries. The person described there kept the return lamp lit for people who finished after the formal gathering. It is a modest piece of work, repeated often enough that someone else could depend on it. Imogen says that this was the entry she reread when she could no longer bear the thought of another grand explanation.
[Imogen | warm] I could check one reference. I did not have to understand the whole year before doing that. Maelin checked the next one with me. Then there were two things we actually knew.
[IF register:correction = private]
[N] When Rowan goes to fetch a spare place mat, Imogen quietly thanks you again for the private space you gave her before correcting the early claim. She has used that lesson while helping another student revise a contribution: time to think first, then a clear public change. She does not tell the table the details of your earlier conversation.
[END IF]
[IF register:correction = together]
[N] Imogen has included a short correction note with the register. She says the supported correction you made together at the reading table helped her separate being wrong about a claim from being unwelcome in the work. The note describes what changed and why. It has no ornamental apology attached.
[END IF]
[IF register:correction = (none)]
[N] A correction note travels with the register. It distinguishes the supported omissions from claims about motive that the sources cannot establish. Imogen says she wants the next reader to know both what the group found and what it had to revise. The record should not require them to repeat every early mistake.
[END IF]
[N] The current participant list is kept separately. People have written how they wish to be named, whether they want to practise, and which task they have actually accepted. A person who is watching has not been counted as a caster. A person who offered to carry a lamp has not been promised a place at its centre. Imogen has left room for people to change their answer.
[Imogen | amused] It is a very fine book. I intend to spill nothing on it for at least three days. After that, I make no promises. It will have to learn what being used involves.
[N] She closes it and moves it to a dry place beside the wall. Then she sits down with both hands free. The book has work to do later. For the length of supper, it can simply be finished enough to put down.

--- SECTION saoirse-finished | place: lantern-hall | time: evening | date: 2027-05-01 ---
[N] Saoirse’s lantern is waiting under a cloth. When the plates have been moved, she lifts the cover with less flourish than you expected. The frame is small. The moving parts fit inside it without protruding hooks. The observation cover folds away, and the handle has room for a gloved hand. A small card names the people who contributed to its care and construction.
[Saoirse | warm] It works. I had several better ways of saying that, but they all made it sound as if there was a flaw I could laugh at before you found it. There are things I would change in a second version. This one does the job it is meant to do.
[N] She demonstrates the cover, the catch and the steady reference light. The instructions include where to stop using it and whom to ask about a fault. Delphine has checked the cleaning method; Rhys has checked that no living plant needs to be taken apart to supply it. The lantern can carry an offered echo briefly. It cannot tell a person’s whole story or decide whether anyone belongs.
[IF emberfall:work-plan = simple]
[N] The removable cover keeps the simple fastening you chose at Emberfall. Saoirse has improved its edge without adding another mechanism. She says it was difficult to leave the working idea alone. Then she lets the cover close cleanly and permits that small success to stand.
[END IF]
[IF emberfall:work-plan = shared]
[N] The adjustable cover grew out of the single demonstration frame you kept in the shared Emberfall plan. Its larger handle answers the problem you found in winter gloves. Saoirse shows the change, then credits the plain spare that let the lake reading continue while the idea still needed work.
[END IF]
[IF emberfall:work-plan = (none)]
[N] Saoirse shows you how the cover can be handled in gloves and removed for cleaning. She names the people who tested those details with her. The design has a history even where your own record does not contain the earlier choices. You can judge what it does now.
[END IF]
[Saoirse | attentive] It needs a useful place at Midsummer. Grey could put it at the hall landing for people arriving after the first group goes down. Or Kestrel could use it at the outer practice station so newcomers have a steady light while they decide. I have checked with both of them. I am not volunteering anyone without asking this time.
[N] Both uses have a willing keeper and a clear job. The lantern will help people reach or understand the gathering; it will not replace their own offered light. Saoirse wants your view before choosing where to place the first finished one.
[DECISION bloom:lantern-use] Where should the lantern work first?
[OPTION welcome] Give it to Grey for the hall landing and later arrivals. | journal: At Bloomtide Saoirse and I chose Grey’s hall landing for the finished lantern, helping later arrivals find the Midsummer gathering.
[OPTION handover] Use it at Kestrel’s outer practice station. | journal: At Bloomtide Saoirse and I chose Kestrel’s outer practice station for the finished lantern, giving newcomers a steady reference before joining.
[END DECISION]
[IF bloom:lantern-use = welcome]
[Saoirse | warm] Then I will give Grey the instructions as well as the lamp. We can practise the cover together tomorrow. A welcome is more useful if the person keeping it can change the wick.
[END IF]
[IF bloom:lantern-use = handover]
[Saoirse | warm] Then I will ask Kestrel where it should stand and do a handover before the next practice. Somebody who did not build it should be able to use it without me leaning over their shoulder.
[END IF]
[N] Saoirse puts the cover back over the lantern. She leaves it alone. You realise you have seen her demonstrate inventions, apologise for them, defend them and think of improvements while someone else was still speaking. Seeing her allow one to be finished feels like meeting a new expression on a familiar face.

--- SECTION table-before-june | place: lantern-hall | time: evening | date: 2027-05-01 ---
[N] The table gathers people in uneven waves. Grey stops long enough to confirm the next practice time. Noor returns with a letter she will read privately later. Someone brings the last dish of pudding, and someone else asks why there are still five clean spoons when six people are waiting. The small discrepancy receives more immediate argument than the mysteries of the Heartfire.
[Rowan | amused] I can find another. Before anyone offers to divide one spoon by magic, let me try the cupboard.
[N] He returns with two, in case somebody else arrives. Imogen gives up trying to keep a page-sized clear space beside her plate. Saoirse begins explaining a new handle design, stops at your look, and says it belongs to tomorrow. There is enough happening at the table without making every moment produce something.
[N] The next rehearsal is on the calendar. The source record is checked. The final participation list will be confirmed again in June. Kestrel and Okoro will prepare the Heartfire approach and the supervised connection. Tully will keep the arrival route running. Grey will check the ordinary lamps. Each promise is small enough to know whether it has been kept.
[Imogen | warm] We can still be frightened. I checked the notes; there is nothing in the inscription requiring universal confidence.
[Rowan | warm] Good. I have been saving some for the occasion.
[N] The lamps overhead have not all recovered. The Heartfire still needs the work you have been preparing to do. Yet the year has already changed the way this table works: a corrected claim can remain in the conversation, a request for help can be answered, and a finished thing can be shared. Those changes will not make the ritual unnecessary. They are part of what makes it possible.
[N] Your friends wait while you find the words you want. You can thank them for the home they have helped make, or turn that gratitude towards the people who will arrive after you. The next chapter will ask you to act on it. Tonight there is still time to pass the pudding.

[EXIT 0] Thank them for making this place feel like home.
[EXIT 1] Promise that the next arrivals will find a place too.
```

### Chapter 8

```
=== SCENE heartfire-chapter-7 | chapter 7 ===

--- SECTION main | place: heartfire | time: evening | date: 2027-06-21 ---
[NOTE] This chapter is still compact. Expand it into full scenes with sections, keeping what happens.
[N] At midsummer, the heartfire is scarcely taller than a candle. You stand around it with your friends. Beyond the chamber, lanterns wait in windows, kitchens, boats, and quiet rooms.
[N] Kindle invites the warmth. Echosight remembers the names. Threadbind leaves a space for everyone still to come. One by one, the small lights answer.
[N] The flame rises. In the hall above you, your lantern catches at last—not because you earned a place, but because you helped make one. There is one final question: how will the academy keep this light?

[EXIT 0] Let every new arrival add their own story.
[EXIT 1] Become a keeper and teach others the ritual.
```

### Epilogues

```
=== EPILOGUE shared ===
[N] The last lantern drifts across the mere, carrying the name of someone who once thought they did not belong. Your name is written beside theirs.
[N] Every new arrival will add a story to the register. The academy’s light will grow with every small kindness, and no single person will have to keep it alone.
[N] Rowan saves you a seat. Imogen brings a book with room in the margins. Saoirse has made something that almost certainly works. Outside, the lake shines.
[N] For now, this is enough. This is home.
```

```
=== EPILOGUE keeper ===
[N] The last lantern drifts across the mere, carrying the name of someone who once thought they did not belong. Your name is written beside theirs.
[N] You choose to become a keeper of the ritual. In the coming year, you will teach it to others, leaving the circle wider than you found it.
[N] Rowan saves you a seat. Imogen brings a book with room in the margins. Saoirse has made something that almost certainly works. Outside, the lake shines.
[N] For now, this is enough. This is home.
```

---

When everything is rewritten, thank you! The owner will import each reply into the game.
