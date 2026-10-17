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
