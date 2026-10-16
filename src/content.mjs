import { castDetails } from './cast.mjs';
import { characterSheets } from './character-sheets.mjs';
export const SCHOOL = 'Lanternmere';
export const art = (id) => `/art/${id}.webp`;
export const houses = [
  {
    id: 'owlcombe',
    name: 'Owlcombe',
    virtue: 'Curiosity',
    color: '#87739b',
    bird: 'Owl',
    motto: 'There is always another question.',
  },
  {
    id: 'rookhallow',
    name: 'Rookhallow',
    virtue: 'Courage',
    color: '#a26048',
    bird: 'Raven',
    motto: 'A small light is still a light.',
  },
  {
    id: 'heronmere',
    name: 'Heronmere',
    virtue: 'Kindness',
    color: '#537d73',
    bird: 'Heron',
    motto: 'Leave a place warmer than you found it.',
  },
  {
    id: 'larkspire',
    name: 'Larkspire',
    virtue: 'Wonder',
    color: '#b39150',
    bird: 'Lark',
    motto: 'Look up. Begin again.',
  },
];
export const familiars = ['cat', 'ferret', 'fox', 'hare', 'moth', 'owl', 'raven', 'toad'];
const rows = [
  [
    'lantern-hall',
    'Lantern Hall',
    'Academy',
    'The heart of the academy',
    'Hundreds of small lanterns sway beneath the vaulted ceiling. One, above the empty place beside you, has quietly gone dark.',
    'rowan',
  ],
  [
    'library',
    'The Library',
    'Academy',
    'A thousand borrowed worlds',
    'The books settle when you enter, like birds returning to a tree. A pencilled note waits inside an atlas: light remembers where it was loved.',
    'imogen',
  ],
  [
    'classroom',
    'Charms Classroom',
    'Academy',
    'Small spells, big beginnings',
    'Sunlight gathers on the brass instruments. Your first exercise is simple: warm a cold lantern without burning its paper.',
    'rowan',
  ],
  [
    'glasshouses',
    'The Glasshouses',
    'Academy',
    'Where curious things take root',
    'Glass panes hold the last warmth of the day. Between pots of moonmint, pale flowers turn toward you rather than the sun.',
    'saoirse',
  ],
  [
    'brewing-cellars',
    'Brewing Cellars',
    'Academy',
    'A little patience in every potion',
    'Copper kettles breathe lavender steam. Someone has labelled a jar NOT SUGAR, underlined three times.',
    'rhys',
  ],
  [
    'warding-hall',
    'Warding Hall',
    'Academy',
    'Magic that holds us together',
    'Gold circles overlap on the polished floor. The strongest wards, the chalkboard says, are invitations, never cages.',
    'kestrel',
  ],
  [
    'corridor',
    'The Grand Corridor',
    'Academy',
    'Every door has a story',
    'Your footsteps echo under portraits that seem to be listening. A warm draught carries the smell of bread from the kitchens.',
    'cas',
  ],
  [
    'infirmary',
    'The Infirmary',
    'Academy',
    'A softer kind of magic',
    'Clean linen, chamomile, and the gentle tick of a clock. A chair has been pulled up beside each bed so nobody has to wait alone.',
    'holloway',
  ],
  [
    'kitchens',
    'The Kitchens',
    'Academy',
    'Something good is always rising',
    'A tray of honey buns emerges from the oven. A handwritten sign reads: homesick students receive second helpings.',
    'moll',
  ],
  [
    'menagerie',
    'The Menagerie',
    'Academy',
    'Find a friend with feathers or fur',
    'The room is full of rustles, sleepy chirps, and bright curious eyes. Somewhere, a familiar is deciding whether to adopt you.',
    'tully',
  ],
  [
    'observatory',
    'The Observatory',
    'Academy',
    'The sky keeps its own calendar',
    'The telescope points at a star that seems to move only when you look away. Brass charts trace a circle around the solstice.',
    'moth',
  ],
  [
    'rookery',
    'The Rookery',
    'Academy',
    'Letters find their way',
    'Feathers drift across sunlit stone. A raven drops an envelope into the correct pigeonhole and looks very pleased with itself.',
    'noor',
  ],
  [
    'weathervane-room',
    'The Weathervane Room',
    'Academy',
    'Listen to the turning year',
    'Tiny suns and silver moons revolve above the tables. A weather glass is quietly predicting a shower of apple blossom.',
    'tick',
  ],
  [
    'old-cloisters',
    'Old Cloisters',
    'Grounds',
    'Some footsteps are memories',
    'Ivy threads through the arches. You hear four sets of footsteps, although there is only one of you. They sound companionable.',
    'lettice',
  ],
  [
    'mere',
    'The Mere',
    'Grounds',
    'Between the shore and the stars',
    'The academy looks almost ordinary in its reflection. Almost. A small light moves beneath the water, keeping pace with you.',
    'saoirse',
  ],
  [
    'boathouse',
    'The Boathouse',
    'Grounds',
    'The beginning of every arrival',
    'Rope creaks against old wood. Each boat bears a small brass lantern, and each lantern has a different name scratched into its base.',
    'tully',
  ],
  [
    'candlestones',
    'The Candlestones',
    'Grounds',
    'Older than the school itself',
    'Seven weathered stones overlook the lake. At their feet, someone has left a fresh candle for a person whose name is worn away.',
    'imogen',
  ],
  [
    'whispering-wood',
    'Whispering Wood',
    'Grounds',
    'Take the path that listens',
    'Blue lights hang among the roots. The trees whisper names, but only the ones their visitors have willingly given them.',
    'rhys',
  ],
  [
    'fen-chapel',
    'The Fen Chapel',
    'Grounds',
    'A quiet place for lost things',
    'Rain gathers in the ruined font. On its rim, a tiny carved lantern remains intact after all these years.',
    'morrow',
  ],
  [
    'glimmer-pitch',
    'The Glimmer Pitch',
    'Grounds',
    'A game played above the water',
    'Golden hoops hover above the lake. For now, the team is practising slow turns, with much laughter and occasional splashing.',
    'marcus',
  ],
  [
    'heartfire',
    'The Heartfire',
    'Grounds',
    'The light beneath every lantern',
    'Deep beneath the academy, a golden flame rises without consuming anything. Threads of light reach upward, toward every room you have called home.',
    'rowan',
  ],
  [
    'thimble-cross',
    'Thimble Cross',
    'Village',
    'A village stitched from little wonders',
    'Lanterns swing above the square. The noticeboard advertises lost mittens, the next festival, and a remarkably specific warning about enchanted marmalade.',
    'flick',
  ],
  [
    'lamplight-row',
    'Lamplight Row',
    'Village',
    'The long way home',
    'Strings of coloured lights span the narrow street. Every shop window seems to offer exactly the thing you did not know you needed.',
    'dev',
  ],
  [
    'lamplighters',
    'The Lamplighters',
    'Village',
    'Keepers of the evening',
    'The workshop windows glow gold against the blue evening. A half-finished lantern waits on a stool, its flame stubbornly refusing to settle.',
    'jory',
  ],
  [
    'wand-shop',
    'The Wand Shop',
    'Village',
    'Let the wood do the choosing',
    'Wood shavings scent the air. The shopkeeper lays out three unassuming wands and asks what you would like to mend.',
    'fitch',
  ],
  [
    'robe-shop',
    'The Robe Shop',
    'Village',
    'Room to grow into yourself',
    'A measuring tape loops politely around your wrist. The robes in the window have pockets large enough for books, biscuits, and small emergencies.',
    'odile',
  ],
  [
    'sweetshop',
    'The Sweetshop',
    'Village',
    'Pocket-sized happiness',
    'Sugar stars turn slowly in a jar. A little paper bag of lemon drops sits on the counter, marked for whoever needs it.',
    'maisie',
  ],
  [
    'crooked-lantern',
    'The Crooked Lantern',
    'Village',
    'One more story by the fire',
    'The fire is low and the chairs are soft. A storyteller pauses as you enter, then makes room for one more listener.',
    'hamish',
  ],
  [
    'lamp-ladle',
    'The Lamp & Ladle',
    'Village',
    'Soup, stories, and shelter',
    'A bowl of soup appears before you have quite decided to order it. Through the window, rain gilds the cobblestones.',
    'ombree',
  ],
  [
    'wrens-nest',
    'The Wren’s Nest',
    'Village',
    'Books that want to be found',
    'The little bookshop leans over the canal. A book in the window is open to a page headed How to Begin Again.',
    'corliss',
  ],
  [
    'nana-pearl',
    'Pearl’s Sitting Room',
    'Village',
    'There is always another cup',
    'A pot of tea steeps beside an armchair. On the mantel, old photographs show the same lake, the same lanterns, and very different faces.',
    'nana',
  ],
  [
    'tully-cottage',
    'Tully’s Cottage',
    'Village',
    'A light along the shore',
    'Boots dry by the doorstep and a fox dozes beneath the bench. A path of flat stones leads down to the water.',
    'tully',
  ],
  [
    'platform-nought',
    'Platform Nought',
    'Village',
    'A departure from the ordinary',
    'The green train lets out a contented sigh. Above the platform, the station clock has a small extra hand labelled when you are ready.',
    'priya',
  ],
  ...houses.map((h) => [
    h.id,
    h.name + ' Common Room',
    'Houses',
    h.motto,
    'A fire murmurs under the mantel. Someone has saved your favourite chair. Outside, the lake holds the last light of the day.',
    h.id === 'owlcombe'
      ? 'imogen'
      : h.id === 'rookhallow'
        ? 'rowan'
        : h.id === 'heronmere'
          ? 'noor'
          : 'saoirse',
  ]),
];
export const locations = rows.map(([id, name, region, subtitle, description, person]) => ({
  id,
  name,
  region,
  subtitle,
  description,
  person,
}));
export const locationById = Object.fromEntries(locations.map((l) => [l.id, l]));
const names = [
  'rowan',
  'imogen',
  'saoirse',
  'cas',
  'noor',
  'idris',
  'toby',
  'kestrel',
  'bassani',
  'kovac',
  'rhys',
  'crook',
  'grey',
  'moth',
  'solano',
  'okoro',
  'dunne',
  'holloway',
  'tully',
  'priya',
  'flick',
  'marcus',
  'petra',
  'hamish',
  'delphine',
  'bram',
  'mina',
  'jonty',
  'fitch',
  'odile',
  'hask',
  'tick',
  'arkwright',
  'jory',
  'morrow',
  'corliss',
  'nana',
  'dev',
  null,
  'moll',
  'ombree',
  'lettice',
  'maisie',
  'kit',
  'hester',
  'honoria',
  'elian-vale',
];
export const characters = names.flatMap((id, i) =>
  id
    ? [
        {
          id,
          index: i + 1,
          name: id === 'nana' ? 'Nana Pearl' : id[0].toUpperCase() + id.slice(1),
          prefix: `c${String(i + 1).padStart(2, '0')}-${id}`,
          role:
            i < 3
              ? [
                  'A warm-hearted firecraft student',
                  'A collector of overlooked stories',
                  'An inventor with muddy boots',
                ][i]
              : i < 7
                ? 'A fellow student'
                : i < 19
                  ? 'A familiar face at the academy'
                  : 'A neighbour by the mere',
          bio:
            i < 3
              ? [
                  'Rowan makes room at the table before he learns your name. He is good at warming things, less good at admitting when he is afraid.',
                  'Imogen believes the most important part of any book is what someone writes in its margins. Earn her trust by listening closely.',
                  'Saoirse carries three unfinished inventions and a packet of seeds. She wants to find out why the lake remembers things the school has forgotten.',
                ][i]
              : 'Every familiar face has a place in the life of the academy. Visit the world to find where your paths cross.',
        },
      ]
    : [],
);
for (const character of characters) {
  Object.assign(character, castDetails[character.id]);
  const sheet = characterSheets[character.id];
  if (!sheet) throw new Error(`Missing active character sheet: ${character.id}`);
  character.name = sheet.identity.name;
  character.role = sheet.identity.role;
  character.bio = sheet.canon.summary;
}
export const characterById = Object.fromEntries(characters.map((c) => [c.id, c]));
export const expressions = {
  rowan: [
    'neutral',
    'warm',
    'amused',
    'laugh',
    'grave',
    'scared',
    'shy',
    'surprised',
    'tense',
    'tired',
    'hurt',
    'flare',
    'small',
  ],
  imogen: [
    'neutral',
    'warm',
    'amused',
    'laugh',
    'grave',
    'guarded',
    'attentive',
    'shy',
    'surprised',
    'tense',
    'tired',
    'hurt',
    'angry',
  ],
  saoirse: [
    'neutral',
    'warm',
    'amused',
    'laugh',
    'guarded',
    'sad',
    'scared',
    'shy',
    'tense',
    'tired',
    'hurt',
  ],
};
export function portrait(id, expression = 'neutral') {
  const c = characterById[id] || characters[0];
  return art(
    `${c.prefix}-${(expressions[id] || ['neutral']).includes(expression) ? expression : 'neutral'}`,
  );
}
export const spells = [
  {
    id: 'kindle',
    name: 'Kindle',
    school: 'Hearth magic',
    location: 'classroom',
    description: 'Invite a small, steady flame into an unlit lantern.',
    gesture: 'A small circle, open toward the sky.',
    question: 'What does a lantern need from its keeper?',
    answers: [
      'The hottest flame you can summon',
      'A steady warmth and room to breathe',
      'A command it cannot refuse',
    ],
    correct: 1,
    explanation: 'A flame is a guest. Give it warmth and room, and it will stay.',
  },
  {
    id: 'echo',
    name: 'Echosight',
    school: 'Memory magic',
    location: 'library',
    description: 'See the gentle traces that people leave behind.',
    gesture: 'Two fingers to the page; one patient breath.',
    question: 'How do you listen to a memory without changing it?',
    answers: [
      'Make it say what you expect',
      'Hold it still until it becomes clear',
      'Observe it without demanding an answer',
    ],
    correct: 2,
    explanation: 'Memories open when they are witnessed, not forced.',
  },
  {
    id: 'thread',
    name: 'Threadbind',
    school: 'Warding',
    location: 'warding-hall',
    description: 'Join willing lights into a protective circle.',
    gesture: 'Trace a circle with a small opening for others.',
    question: 'What makes a ward strong enough to last?',
    answers: [
      'Every light joining by choice',
      'Keeping every other light outside',
      'One powerful person holding everything',
    ],
    correct: 0,
    explanation: 'Shared care outlasts control. A circle leaves room for others.',
    requires: ['kindle', 'echo'],
  },
];
export const festivals = [
  {
    month: 9,
    day: 1,
    name: 'Arrival Day',
    description: 'New lanterns, new faces, a seat waiting for you.',
  },
  {
    month: 10,
    day: 31,
    name: 'Emberfall',
    description: 'Leave a lantern for someone who helped you find your way.',
  },
  {
    month: 12,
    day: 21,
    name: 'Longnight',
    description: 'The longest night, kept bright together.',
  },
  {
    month: 3,
    day: 20,
    name: 'First Thaw',
    description: 'Walk the shore and welcome the returning light.',
  },
  {
    month: 5,
    day: 1,
    name: 'Bloomtide',
    description: 'Seeds, songs, and promises for the growing year.',
  },
  {
    month: 6,
    day: 21,
    name: 'The Homecoming of Lights',
    description: 'Every lantern returns to the water. Every story finds its place.',
  },
];
export const chapters = [
  {
    title: 'A place at the table',
    kicker: 'Chapter I · Arrival',
    date: '2026-09-01',
    scene: 'lantern-hall',
    speaker: 'rowan',
    emotion: 'warm',
    goal: 'Find Rowan and introduce yourself. The People page shows where he is today.',
    requirements: ['rowan'],
    text: [
      'Your name is written on the handle of a small brass lantern. You turn it over twice on the boat, certain there has been some mistake. A place at Lanternmere was never part of the life you had planned.',
      'In the great hall, hundreds of lights hang above the tables. A red-haired student moves his books from the empty chair beside him. “That one’s yours,” Rowan says. “The chair, I mean. The school takes a bit longer to feel like yours.”',
      'Above your place, a single lantern goes out. Nobody else seems to notice.',
    ],
    choices: [
      ['Tell Rowan about the dark lantern.', 'rowan', 'warm'],
      ['Ask him how he found his place here.', 'rowan', 'shy'],
    ],
  },
  {
    title: 'The smallest flame',
    kicker: 'Chapter II · Learning',
    date: '2026-09-04',
    scene: 'classroom',
    speaker: 'rowan',
    emotion: 'amused',
    goal: 'Learn Kindle in the Charms Classroom.',
    requirements: ['kindle'],
    text: [
      'The next morning smells of chalk and toast. Your first lesson is not a grand incantation. It is a cold lantern, a patient breath, and the intention to make something a little warmer.',
      'Your flame catches. For a moment, you hear a voice under the crackle: Remember the way home. Rowan’s smile slips. He heard it too.',
      '“We could pretend that was normal,” he says. “But I don’t think either of us would believe it.”',
    ],
    choices: [
      ['Promise to look into it together.', 'rowan', 'warm'],
      ['Suggest finding someone who knows the old stories.', 'imogen', 'attentive'],
    ],
  },
  {
    title: 'Notes in the margins',
    kicker: 'Chapter III · A discovery',
    date: '2026-09-18',
    scene: 'library',
    speaker: 'imogen',
    emotion: 'attentive',
    goal: 'Talk with Imogen, inspect the Library, and learn Echosight.',
    requirements: ['imogen', 'archive', 'echo'],
    text: [
      'Imogen has been waiting for someone to ask the right question. She lays an atlas between you and opens it to a map of the lake, crowded with tiny handwritten names.',
      'The academy’s lights are not fed by power. They are kept by memories of belonging. Over the years, the names of the people who tended them have been rubbed from the register. Without those stories, the heartfire is slowly forgetting who it warms.',
      '“A mistake repeated long enough looks like a tradition,” Imogen says. “We can choose not to repeat it.”',
    ],
    choices: [
      ['Help her recover the missing names.', 'imogen', 'warm'],
      ['Ask whose story she would save first.', 'imogen', 'shy'],
    ],
  },
  {
    title: 'A lantern for the lost',
    kicker: 'Chapter IV · Emberfall',
    date: '2026-10-31',
    scene: 'glasshouses',
    speaker: 'saoirse',
    emotion: 'amused',
    goal: 'Meet Saoirse and tend a moonflower in the Glasshouses.',
    requirements: ['saoirse', 'flower'],
    text: [
      'By Emberfall, the hall is dressed in orange light. Saoirse has filled the glasshouse benches with lantern frames and pots of moonflowers. “The petals hold an echo,” she tells you. “Not a person. Just the warmth they left behind.”',
      'You build a lantern together. The paper is crooked; the small flame inside it is perfect. In its light you glimpse a boatkeeper, a cook, a quiet student mending somebody else’s coat. None of their names appears in the register.',
      'There is room on the paper for one promise.',
    ],
    choices: [
      ['Write: No kindness is too small to remember.', 'saoirse', 'warm'],
      ['Write: We will make room for everyone.', 'rowan', 'warm'],
    ],
  },
  {
    title: 'The lake remembers',
    kicker: 'Chapter V · Longnight',
    date: '2026-12-21',
    scene: 'mere',
    speaker: 'saoirse',
    emotion: 'scared',
    goal: 'Cast Echosight at the Mere.',
    requirements: ['lake'],
    text: [
      'Snow softens the shore. Beneath the ice, a chain of golden lights leads toward the old standing stones. When you raise your hand, Echosight reveals the first keepers: ordinary people standing in a circle, each offering one small flame.',
      'A crack runs through the reflection of the academy. For the first time, Saoirse has nothing clever to say. “If the heartfire goes out, will the school disappear?”',
      'The school is stone and wood. It will remain. But its welcoming magic will be lost, and every lantern will become just a lantern. You have until midsummer to restore the circle.',
    ],
    choices: [
      ['Take her hand and promise to finish this together.', 'saoirse', 'warm'],
      ['Make a careful plan before leaving the shore.', 'imogen', 'warm'],
    ],
  },
  {
    title: 'An open circle',
    kicker: 'Chapter VI · First Thaw',
    date: '2027-03-20',
    scene: 'candlestones',
    speaker: 'imogen',
    emotion: 'grave',
    goal: 'Read the Candlestones with Echosight, then learn Threadbind in Warding Hall.',
    requirements: ['stones', 'thread'],
    text: [
      'When the snow retreats, you find the missing inscription. The old keepers did not bind their magic to a ruler. They bound it to one another, freely, and left a gap in the circle for whoever came next.',
      'Imogen copies the words with hands still cold from the walk. “We have been trying to find the strongest witch,” she says. “We should have been finding each other.”',
      'In Warding Hall, you learn Threadbind. It answers the smallest willing light as readily as the greatest.',
    ],
    choices: [
      ['Invite the whole academy to help.', 'imogen', 'warm'],
      ['Begin by asking your friends, one by one.', 'rowan', 'warm'],
    ],
  },
  {
    title: 'The light we carry',
    kicker: 'Chapter VII · Bloomtide',
    date: '2027-05-01',
    scene: 'lantern-hall',
    speaker: 'rowan',
    emotion: 'grave',
    goal: 'Build a friendship of at least 10 with Rowan, Imogen, and Saoirse.',
    requirements: ['friends'],
    text: [
      'By Bloomtide, your table has grown crowded. The recovered names fill a new register. Nobody is too grand to be included, and nobody is too ordinary.',
      'Rowan admits he has been afraid of failing you. Imogen admits she nearly gave up looking. Saoirse lays her perfectly working lantern on the table without making a joke. In the quiet that follows, you realise what the school has given you.',
      'Not certainty. People to be uncertain with. Midsummer is almost here.',
    ],
    choices: [
      ['Thank them for making this place feel like home.', 'rowan', 'warm'],
      ['Promise that the next arrivals will find a place too.', 'saoirse', 'warm'],
    ],
  },
  {
    title: 'A home made of light',
    kicker: 'Chapter VIII · Midsummer',
    date: '2027-06-21',
    scene: 'heartfire',
    speaker: 'imogen',
    emotion: 'warm',
    goal: 'At the Heartfire, cast Threadbind to restore the circle.',
    requirements: ['restored'],
    text: [
      'At midsummer, the heartfire is scarcely taller than a candle. You stand around it with your friends. Beyond the chamber, lanterns wait in windows, kitchens, boats, and quiet rooms.',
      'Kindle invites the warmth. Echosight remembers the names. Threadbind leaves a space for everyone still to come. One by one, the small lights answer.',
      'The flame rises. In the hall above you, your lantern catches at last—not because you earned a place, but because you helped make one. There is one final question: how will the academy keep this light?',
    ],
    choices: [
      ['Let every new arrival add their own story.', 'imogen', 'warm', 'shared'],
      ['Become a keeper and teach others the ritual.', 'rowan', 'warm', 'keeper'],
    ],
  },
];
export const topics = [
  { id: 'hello', label: 'Get to know them' },
  { id: 'mystery', label: 'Ask about the lanterns' },
  { id: 'care', label: 'Ask how they’re feeling' },
  { id: 'laugh', label: 'Share a little levity' },
];
export const dialogues = {
  rowan: {
    hello: [
      'warm',
      'You made it. I saved you a seat—well, two, in case your familiar wants one. What do you think of the place?',
    ],
    mystery: [
      'grave',
      'My grandmother kept a lantern in her window every winter. She said it helped people find their way home. Maybe the school has forgotten who it is waiting for.',
    ],
    care: [
      'shy',
      'Honestly? I worry I only make things brighter, never better. But talking to you helps. Thank you for asking.',
    ],
    laugh: [
      'laugh',
      'I tried to warm my tea with Kindle. The spoon is still glowing. Imogen says it makes a very practical bookmark.',
    ],
  },
  imogen: {
    hello: [
      'attentive',
      'If you are looking for the library catalogue, it is alphabetical. If you are looking for the interesting things, those are mostly in the margins.',
    ],
    mystery: [
      'grave',
      'There are names missing from the old register. Not torn out—rubbed away. I think someone decided that ordinary kindness was not important enough to record.',
    ],
    care: [
      'warm',
      'I spend so much time making sure stories are remembered that I forget to be in one. This counts, doesn’t it? Sitting here, with you.',
    ],
    laugh: [
      'laugh',
      'A book just corrected my pronunciation. I put it on the bottom shelf. I am calling it peer review.',
    ],
  },
  saoirse: {
    hello: [
      'amused',
      'Mind the left pocket. There is a spring in it, and it has ambitions. I am Saoirse. Shall we see what happens?',
    ],
    mystery: [
      'guarded',
      'The lake remembers light. I have measured it. I just have not convinced the light to explain itself yet. Meet me by the shore when you learn Echosight.',
    ],
    care: [
      'warm',
      'I keep making things because I am afraid of sitting still with my thoughts. But it is easier when someone sits with me. You can stay, if you like.',
    ],
    laugh: [
      'laugh',
      'Good news: the self-stirring teapot works. Less good news: it has started stirring the sugar bowl in solidarity.',
    ],
  },
};
