// New personalities and routines written for the supplied portraits.
// The abandoned project's documents are not a source of canon.
const rows = [
  [
    'rowan',
    'A warm-hearted firecraft student',
    ['lantern-hall', 'classroom', 'heartfire', 'rookhallow'],
  ],
  [
    'imogen',
    'A collector of overlooked stories',
    ['library', 'library', 'candlestones', 'owlcombe'],
  ],
  ['saoirse', 'An inventor with muddy boots', ['glasshouses', 'menagerie', 'mere', 'larkspire']],
  [
    'cas',
    'A meticulous warding student',
    ['warding-hall', 'classroom', 'rookery', 'rookhallow'],
    'Cas polishes every spell until it looks effortless. He is learning that friendship does not have to be earned through perfection.',
    'That line is crooked. Sorry—your notebook, not you. I notice things I have not been asked to notice. I am working on it.',
  ],
  [
    'noor',
    'A student who listens to birds',
    ['rookery', 'glasshouses', 'heronmere', 'heronmere'],
    'Noor tends the academy’s messenger birds and remembers the people behind each letter. She writes home every Sunday.',
    'Hold out your hand, slowly. The raven is deciding whether you are a person or a very promising perch.',
  ],
  [
    'idris',
    'A patient student of warding',
    ['library', 'warding-hall', 'owlcombe', 'owlcombe'],
    'Idris builds careful models of impossible spaces. He returned to study after years of believing it was too late.',
    'There is room at this desk. I work slowly, so you will not have to pretend you understand everything immediately.',
  ],
  [
    'toby',
    'A first-year with a pocket of crumbs',
    ['lantern-hall', 'menagerie', 'kitchens', 'larkspire'],
    'Toby is shy around people and wonderfully confident around creatures. He knows the names of every kitchen mouse.',
    'Do you think the teachers know about the mice? I made them a timetable. The mice, I mean.',
  ],
  [
    'kestrel',
    'The academy’s warding teacher',
    ['warding-hall', 'warding-hall', 'library', 'observatory'],
    'Kestrel teaches precise, generous magic. She expects students to ask why a boundary exists before they strengthen it.',
    'Before you draw a ward, tell me what you mean to protect. A beautiful circle is no use if it keeps kindness outside.',
  ],
  [
    'bassani',
    'A teacher of everyday enchantments',
    ['kitchens', 'lantern-hall', 'kitchens', 'rookhallow'],
    'Bassani finds serious magic in ordinary comforts: a warm plate, a repaired hinge, a chair that supports a tired back.',
    'A perfect souffle is a useful ambition. Making enough for everyone is a better one. Apron?',
  ],
  [
    'kovac',
    'The brewing instructor',
    ['brewing-cellars', 'classroom', 'library', 'owlcombe'],
    'Kovac keeps a notebook of useful failures. Her sternest classroom rule is never to pretend a mistake did not happen.',
    'If that brew turns blue, tell me. If it turns green, tell me sooner. If it apologises, we shall take notes.',
  ],
  [
    'rhys',
    'The keeper of growing things',
    ['glasshouses', 'whispering-wood', 'glasshouses', 'heronmere'],
    'Rhys teaches botany by asking students to pay attention. She keeps the least impressive plants on the best-lit shelf.',
    'That little seedling has done more work this week than anyone can see. Give it time. You too.',
  ],
  [
    'crook',
    'A practical flying instructor',
    ['glimmer-pitch', 'warding-hall', 'glimmer-pitch', 'rookhallow'],
    'Crook believes a graceful landing matters more than a dramatic takeoff. Her spare scarf is always lent to somebody cold.',
    'First rule of flying: come back down. Second rule: bring your friends back down with you.',
  ],
  [
    'grey',
    'The keeper of the old corridors',
    ['old-cloisters', 'corridor', 'old-cloisters', 'fen-chapel'],
    'Grey repairs the academy’s older stonework and knows which echoes are friendly. He always knocks before entering an empty room.',
    'The west stair creaks because it is old, not because it is angry. Mind you, it appreciates a thank-you.',
  ],
  [
    'moth',
    'An astronomer with ink-stained cuffs',
    ['observatory', 'library', 'observatory', 'observatory'],
    'Moth maps the moving sky and loses his spectacles on his own forehead. He remembers every student who has watched a sunrise beside him.',
    'You are not late. The stars have been doing this for a very long time. There is plenty of time to catch up.',
  ],
  [
    'solano',
    'A teacher of celestial charms',
    ['classroom', 'observatory', 'larkspire', 'larkspire'],
    'Solano studies how light changes with the seasons. She encourages an elegant question over a rehearsed answer.',
    'Look at the edge of that shadow. The sun has written you a date. Shall we learn to read it?',
  ],
  [
    'okoro',
    'A teacher of protective magic',
    ['warding-hall', 'glasshouses', 'heartfire', 'heronmere'],
    'Okoro teaches wards that can bend without breaking. His lessons always leave time for the quietest person to speak.',
    'Strength is not the same thing as stiffness. A branch that gives a little can hold a great deal.',
  ],
  [
    'dunne',
    'The librarian',
    ['library', 'library', 'owlcombe', 'owlcombe'],
    'Dunne remembers where every book belongs, including the ones that disagree. She keeps a small shelf of books nobody has borrowed yet.',
    'You may take three books. Four if one frightens you a little. Growing is a good reason for an exception.',
  ],
  [
    'holloway',
    'The academy’s healer',
    ['infirmary', 'infirmary', 'kitchens', 'infirmary'],
    'Holloway can make a sickroom feel less lonely without saying a word. She regards resting as a skill worth practising.',
    'Sit down, dear. You do not have to be unwell to need a glass of water and a quiet minute.',
  ],
  [
    'tully',
    'Boatkeeper and friend to familiars',
    ['boathouse', 'menagerie', 'tully-cottage', 'boathouse'],
    'Tully has brought generations of students across the mere. He can tell who is homesick by how tightly they hold their luggage.',
    'Steady now. The boat knows the way, even when you do not. That is a comforting thing to borrow.',
  ],
  [
    'priya',
    'The station’s young archivist',
    ['platform-nought', 'thimble-cross', 'platform-nought', 'wrens-nest'],
    'Priya collects the stories people leave on trains. She keeps lost property carefully labelled until its owners are ready to return.',
    'Lost something? We have mittens, umbrellas, and a very good idea someone left on the morning train.',
  ],
  [
    'flick',
    'An apprentice with a thousand plans',
    ['robe-shop', 'sweetshop', 'thimble-cross', 'larkspire'],
    'Flick repairs robes and organises village celebrations. She often volunteers before remembering how many hours a day contains.',
    'Could you hold this ribbon? Wonderful. You are now on the decoration committee. There are biscuits.',
  ],
  [
    'marcus',
    'Captain of the glimmer team',
    ['glimmer-pitch', 'glimmer-pitch', 'lantern-hall', 'rookhallow'],
    'Marcus keeps a place on the team for beginners. He records his teammates’ first successful flights as carefully as their victories.',
    'We count safe landings before points. Join a practice whenever you like; nobody starts out knowing how to fly.',
  ],
  [
    'petra',
    'A student of forgotten languages',
    ['library', 'warding-hall', 'heronmere', 'heronmere'],
    'Petra studies the languages carved into old wards. She likes words that cannot be translated without telling a story.',
    'This word means welcome, but only when spoken by someone who has made room. A useful distinction.',
  ],
  [
    'hamish',
    'The Crooked Lantern’s storyteller',
    ['crooked-lantern', 'thimble-cross', 'crooked-lantern', 'crooked-lantern'],
    'Hamish gathers stories without polishing away their awkward bits. His ferret is an enthusiastic and unreliable audience.',
    'I have a heroic tale and a tale about a pie. They are, unfortunately, the same tale.',
  ],
  [
    'delphine',
    'A patient student of brewing',
    ['glasshouses', 'brewing-cellars', 'heronmere', 'heronmere'],
    'Delphine keeps meticulous notes on scents. She is trying to brew the feeling of opening a letter from someone you miss.',
    'Smell this. What does it remind you of? There is no wrong answer; that is the difficult part.',
  ],
  [
    'bram',
    'A student who learns by doing',
    ['warding-hall', 'classroom', 'rookhallow', 'rookhallow'],
    'Bram learns through repetition and has little patience for pretending. He quietly fixes the training equipment after everyone leaves.',
    'I have tried this spell eleven times. You are welcome to watch the twelfth. It might be the interesting one.',
  ],
  [
    'mina',
    'A maker of enchanted bookbindings',
    ['library', 'kitchens', 'owlcombe', 'owlcombe'],
    'Mina binds loose pages into books that can weather travel. She thinks unfinished stories deserve covers too.',
    'Bring me your loose notes. We can make them something you will want to keep, crossed-out bits included.',
  ],
  [
    'jonty',
    'A student with a soft spot for strays',
    ['menagerie', 'glimmer-pitch', 'heronmere', 'heronmere'],
    'Jonty remembers every creature he has helped. His friends have stopped asking why his pockets move.',
    'Before you ask: yes, that is a toad. No, it is not mine. We are discussing the arrangement.',
  ],
  [
    'fitch',
    'The village wandmaker',
    ['wand-shop', 'wand-shop', 'lamplighters', 'wand-shop'],
    'Fitch listens to wood before shaping it. His smallest wands are made with the same care as his finest commissions.',
    'A wand is a conversation with a tree. Try listening before you decide what you want it to say.',
  ],
  [
    'odile',
    'The village robe maker',
    ['robe-shop', 'robe-shop', 'thimble-cross', 'robe-shop'],
    'Odile can stitch useful enchantments into a hem. She always adds one pocket the customer has not asked for.',
    'Arms out. Every new beginning needs room at the shoulders and somewhere to put a handkerchief.',
  ],
  [
    'hask',
    'The academy’s records keeper',
    ['library', 'weathervane-room', 'library', 'owlcombe'],
    'Hask maintains the living registers. She is beginning to question why the official record has so much room for honours and so little for kindness.',
    'Records are not the same thing as truth. They are what somebody thought worth writing down.',
  ],
  [
    'tick',
    'The academy’s clock keeper',
    ['weathervane-room', 'classroom', 'weathervane-room', 'weathervane-room'],
    'Tick maintains clocks that measure hours, seasons, and occasionally moods. He is never annoyed by a slow learner.',
    'A minute spent helping someone is not a minute lost. None of my clocks have persuaded me otherwise.',
  ],
  [
    'arkwright',
    'The grounds steward',
    ['corridor', 'old-cloisters', 'boathouse', 'warding-hall'],
    'Arkwright notices loose stones, weak ropes, and people trying not to ask for help. Her repairs are practical and lasting.',
    'If a door sticks, tell me. You should not have to become stronger just to get where you belong.',
  ],
  [
    'jory',
    'A lamplighter’s apprentice',
    ['lamplighters', 'corridor', 'lamplight-row', 'lamplighters'],
    'Jory tends the village lamps and learns their small eccentricities. He names repaired lanterns after whoever helped fix them.',
    'This one likes a gentle tap. That one likes being left alone. Keeping lamps is mostly getting to know them.',
  ],
  [
    'morrow',
    'The guardian of the Fen Chapel',
    ['fen-chapel', 'candlestones', 'fen-chapel', 'fen-chapel'],
    'Morrow tends the ruined chapel without trying to make it new. He leaves candles for names even the stones have forgotten.',
    'The roof is gone. The shelter is not. Stay as long as you need.',
  ],
  [
    'corliss',
    'The Wren’s Nest bookseller',
    ['wrens-nest', 'wrens-nest', 'lamp-ladle', 'wrens-nest'],
    'Corliss finds books for people who cannot explain what they need. Her shop has no shelf marked unimportant.',
    'You need not know the title. Tell me the kind of day you have been having.',
  ],
  [
    'nana',
    'The village’s unofficial grandmother',
    ['nana-pearl', 'thimble-cross', 'nana-pearl', 'nana-pearl'],
    'Nana Pearl keeps photographs, recipes, and a place at her table. She remembers the academy through the people who worked there.',
    'Put the kettle on, love. You can tell me everything, or we can talk about the weather until everything feels smaller.',
  ],
  [
    'dev',
    'A mapmaker of everyday places',
    ['lamplight-row', 'wrens-nest', 'lamp-ladle', 'thimble-cross'],
    'Dev draws maps that include good benches, sheltered doorways, and the best place to watch the rain.',
    'Most maps tell you where to go. Mine try to tell you where you might want to stay.',
  ],
  [
    'moll',
    'The academy’s cook',
    ['kitchens', 'kitchens', 'lantern-hall', 'kitchens'],
    'Moll keeps a mental list of favourite suppers. She notices who has stopped coming down to eat.',
    'There is a heel of bread going spare. If you tell anyone I saved it for you, I shall deny it warmly.',
  ],
  [
    'ombree',
    'Keeper of the Lamp & Ladle',
    ['lamp-ladle', 'lamp-ladle', 'lamp-ladle', 'thimble-cross'],
    'Ombree believes hospitality is a careful craft. His menu includes a meal whose price is whatever you can manage.',
    'Sit where the window does not rattle. The soup is ready, and the conversation can wait until you have eaten.',
  ],
  [
    'lettice',
    'A ghost who remembers the music',
    ['old-cloisters', 'library', 'fen-chapel', 'old-cloisters'],
    'Lettice remembers melodies better than dates. She is pleased when people ask about her life instead of her death.',
    'Can you hear the waltz? No? Never mind. Walk beside me, and I will hum the parts I remember.',
  ],
  [
    'maisie',
    'The sweetshop’s careful experimenter',
    ['sweetshop', 'sweetshop', 'thimble-cross', 'sweetshop'],
    'Maisie makes sweets that recall small happy things. She labels the strong memories clearly and offers samples of courage.',
    'This one tastes like the first day of a holiday. This one is lemon. On difficult days, lemon is enough.',
  ],
  [
    'kit',
    'A wandering student of songs',
    ['lamplight-row', 'library', 'crooked-lantern', 'wrens-nest'],
    'Kit collects tunes on scraps of paper. He is trying to write a song that feels like finding your way back.',
    'Do you know the rest of this tune? I only have the beginning. Perhaps we can give it somewhere to go.',
  ],
  [
    'hester',
    'A portrait with a good memory',
    ['corridor', 'corridor', 'corridor', 'corridor'],
    'Hester watches from a painted frame in the corridor. She remembers the ordinary days between the academy’s famous moments.',
    'Do stop a moment. Everyone hurries past history, then wonders where it has gone.',
  ],
  [
    'honoria',
    'The academy’s headmistress',
    ['lantern-hall', 'warding-hall', 'heartfire', 'owlcombe'],
    'Honoria carries the responsibility of keeping Lanternmere open to change. She has learned to ask for help, though not always quickly.',
    'A school is a promise made again every morning. Tell me if we are failing to keep it.',
  ],
];
export const castDetails = Object.fromEntries(
  rows.map(([id, role, routine, bio, hello]) => [
    id,
    { role, routine, ...(bio ? { bio, hello } : {}) },
  ]),
);

// Four authored topics plus a more personal reply at 20 friendship.
export const supportingDialogues = {
  cas: {
    mystery:
      'I checked the lantern fittings. Nothing is broken. That worries me more than a loose wire would.',
    care: 'Everyone thinks I enjoy being right. Mostly, I am afraid of being wrong where someone can see.',
    laugh:
      'I alphabetised my mistakes. It was an efficient use of an otherwise disappointing afternoon.',
    trust: 'I left a crooked line in my notes today. You made me think the page might survive it.',
  },
  noor: {
    mystery:
      'The birds used to follow the lights across the water. Lately they fly closer to shore. They notice changes before we do.',
    care: 'I miss home most when something good happens. I want to tell someone who knew me before all this.',
    laugh:
      'A raven stole my letter and brought it back corrected. Its spelling is excellent. Its manners need work.',
    trust:
      'I wrote about you in my letter home. It felt good to have someone here worth introducing.',
  },
  idris: {
    mystery:
      'A ward can fail because its purpose has changed. Perhaps the old lights need a new reason to stay.',
    care: 'Being older does not stop me feeling new. It just makes me think I ought to hide it better.',
    laugh:
      'My model staircase has become a model slide. The mathematics are dreadful. The mice approve.',
    trust:
      'I used to wait until I understood everything before asking a question. I do not feel I have to do that with you.',
  },
  toby: {
    mystery:
      'The mice have moved out of the cold wall. I put a little blanket nearby. It is not a solution, but it is something.',
    care: 'I know what to say to animals. With people, I keep remembering all the things I could say wrong.',
    laugh: 'I taught a mouse to fetch. It fetches other mice. I think we have founded a club.',
    trust: 'I saved the quiet seat for you. I thought you might like it. I hoped you would come.',
  },
  kestrel: {
    mystery:
      'The strongest ward still needs a purpose. Find out who the lights were meant to welcome before you try to command them.',
    care: 'Teaching means watching people outgrow your help. It is a good kind of sadness, when it comes.',
    laugh:
      'A student once warded their homework against criticism. It was an excellent spell and a very short essay.',
    trust:
      'You have begun to ask who a spell helps. That matters to me more than the neatness of your circles.',
  },
  rhys: {
    mystery:
      'The moonflowers lean toward the old lake path. Roots remember what a building has covered over.',
    care: 'I worry about the plants everyone calls ordinary. Nobody notices when the common things begin to disappear.',
    laugh:
      'The climbing ivy has enrolled itself in astronomy. It has almost reached the observatory window.',
    trust:
      'I left a tray of seedlings for you to tend. Nothing rare. I think you understand why that makes them worth the trouble.',
  },
  tully: {
    mystery:
      'I used to know every lantern on the water. Some had the names of boatkeepers. Those names are hard to find now.',
    care: 'After so many arrivals, the quiet days feel strange. Good to have someone stop without needing a crossing.',
    laugh:
      'A goose stole my cap. I asked for it back. We are now in negotiations over the boathouse.',
    trust:
      'You sit in a boat differently now. Less like you are waiting to be sent back. I am glad of that.',
  },
  priya: {
    mystery:
      'There are old tickets with lantern stamps instead of dates. The railway brought people home before it kept good records.',
    care: 'I keep the lost things so carefully that sometimes I forget I am allowed to travel too.',
    laugh:
      'Someone left an enchanted umbrella that opens whenever it feels emotional. We have given it a quiet shelf.',
    trust:
      'I found a blank ticket in the archive. I am keeping it for a day when I decide where I want to go.',
  },
  flick: {
    mystery:
      'Every festival uses the same old lantern pattern. I wonder who made the first one—and why nobody asks.',
    care: 'I like being useful. Sometimes I say yes before I find out whether I have anything left to give.',
    laugh:
      'I made a self-tying ribbon. It has tied the scissors to the table. Clearly it is opposed to further alterations.',
    trust:
      'I said no to a committee this morning. Then I had tea. You would have been proud of the tea.',
  },
  marcus: {
    mystery:
      'A hoop went dim during practice. We stopped the match. A score is not worth pretending everything is fine.',
    care: 'People expect a captain to be certain. I can make a decision and still wish someone else would check it.',
    laugh: 'Our last practice ended in the lake. Team spirit is excellent at swimming, apparently.',
    trust:
      'I trust you to tell me when I am pushing too hard. That is a useful kind of teammate to have.',
  },
  nana: {
    mystery:
      'My mother cleaned the hall. She knew which lantern belonged to which cook, gardener, and child. History ought to have asked her.',
    care: 'Some days I miss people more than others. Making their recipes helps. So does sharing them.',
    laugh:
      'I once put a warming charm on a pie. The pie is long gone, but that dish still makes a splendid foot-warmer.',
    trust:
      'You need not knock so formally, love. People who know where the cups are can let themselves in.',
  },
  lettice: {
    mystery:
      'I remember people carrying candles before the hall had lanterns. We were all so pleased to be inside, out of the rain.',
    care: 'I do not mind being remembered imperfectly. I mind when people decide there is nothing left to ask.',
    laugh:
      'A student walked straight through me, then apologised to the curtain. The curtain accepted very graciously.',
    trust:
      'I remembered another verse after you left. I think being listened to is helping me find the tune.',
  },
};

export const dailyLines = {
  rowan: [
    'I kept a little flame steady all through breakfast. It was not impressive, but I am pleased with it.',
    'Shall we sit for a minute? I have spent all day making light. It is nice to let the sunset do it.',
    'I brought two buns. A dangerously optimistic number until you arrived.',
  ],
  imogen: [
    'I found a note in a book that simply says try again. I have decided it was meant for me.',
    'There is nothing urgent to solve this minute. I thought we could practise letting that be true.',
    'Tell me one thing you noticed today. The small things rarely make it into the official record.',
  ],
  saoirse: [
    'My latest invention has done exactly what I asked. It turns out I asked the wrong question.',
    'I made time to do nothing today. I brought tools, just in case nothing needed repairing.',
    'The lake looked different this morning. Or perhaps I did. I like that I can tell you either version.',
  ],
};
