// The new opening: the crossing, the landing, the hall, choosing a house and a familiar.
// PLACEHOLDER lines from story-drafts/00-opening-skeleton.md until ChatGPT's prose is imported.
import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
import { houses, familiars } from '../content.mjs';

const date = (beats) => beats.map((b) => ({ ...b, section: { ...b.section, date: '2026-09-01' } }));
const EVENING = 2;

const HOUSE_ANSWERS = {
  owlcombe: 'Look for the answer.',
  rookhallow: 'Go after it, even if it is dark.',
  heronmere: 'Make sure no one has to look for it alone.',
  larkspire: 'Wonder where it went, and what it found there.',
};
const FAMILIAR_ARRIVALS = {
  cat: 'A black cat who sits on your foot as if it has always belonged there.',
  owl: 'A small owl who lands on the back of your chair.',
  fox: 'A young fox who noses your lantern, then your hand.',
  hare: 'A brown hare who settles under the bench by your feet.',
  moth: 'A pale moth, larger than your palm, who rests on your lantern.',
  raven: 'A raven who walks the length of the table to stand beside you.',
  ferret: 'A ferret who climbs into your coat pocket.',
  toad: 'A green toad who sits by your plate, entirely calm.',
};

export const arrivalPrologue = [
  ...date(
    section(
      'crossing',
      'The crossing',
      'mere',
      [
        n('dusk-boat', 'Dusk on Lantern Mere. A small boat moves across the water without oars.'),
        n(
          'named-lantern',
          'You hold a small brass lantern. Your name is engraved on its handle. It is not lit.',
        ),
        s('tully-welcome', 'tully', 'warm', 'Sit easy. The crossing takes as long as it takes.'),
        n(
          'boat-company',
          'Two other new students share the boat: Toby, dropping crumbs for the fish, and Cas, counting a folded list.',
          [actor('toby'), actor('cas')],
        ),
        s(
          'toby-roll',
          'toby',
          'neutral',
          'Want some? The fish here are very polite.',
          actor('cas'),
        ),
        decide(
          'crossing',
          'Mist lies on the water ahead. Somewhere inside it, a single window lights up.',
          'Where does your attention go?',
          [
            {
              id: 'toby',
              label: 'Sit with Toby and his crumbs.',
              hint: 'Company for the crossing.',
              journal: 'On the boat I shared Toby’s bread roll and fed the fish.',
            },
            {
              id: 'castle',
              label: 'Watch the castle come out of the mist.',
              hint: 'Take it in alone.',
              journal: 'On the boat I watched the castle appear one window at a time.',
            },
          ],
          [actor('toby'), actor('cas')],
        ),
        ...when(
          'arrival:crossing',
          'toby',
          n('toby-home', 'Toby talks about his grandmother’s hens. Cas pretends not to listen.'),
        ),
        ...when(
          'arrival:crossing',
          'castle',
          n('castle-windows', 'The castle comes out of the mist one window at a time.'),
        ),
        n('boathouse-bump', 'The boat bumps gently against the boathouse steps.'),
      ],
      EVENING,
    ),
  ),
  ...date(
    section(
      'landing',
      'The landing',
      'boathouse',
      [
        s('tully-trunks', 'tully', 'neutral', 'Leave your trunks. Lanterns stay with you.'),
        n('pine-path', 'A lantern-lit path climbs through dark pines to the castle doors.'),
        s('grey-doors', 'grey', 'neutral', 'Name? There you are. In you go.'),
      ],
      EVENING,
    ),
  ),
  ...date(
    section(
      'hall',
      'The hall',
      'lantern-hall',
      [
        n(
          'hall-first-sight',
          'Lantern Hall: hundreds of small lanterns floating under a high ceiling, a great window over the lake.',
        ),
        s(
          'honoria-welcome',
          'honoria',
          'neutral',
          'Welcome to Lanternmere. Tonight you will find your house, by your own answer.',
        ),
      ],
      EVENING,
    ),
  ),
  ...date(
    section(
      'house',
      'Your house',
      'lantern-hall',
      [
        n(
          'house-lanterns',
          'Four tall house lanterns stand at the front of the hall, each marked with its crest.',
        ),
        decide(
          'house',
          'It is your turn. Honoria looks at you kindly, not at your dark lantern.',
          'Honoria asks: “When something is lost, what do you do first?”',
          houses.map((h) => ({
            id: h.id,
            label: HOUSE_ANSWERS[h.id],
            hint: `${h.name} · ${h.virtue}`,
            effects: { house: h.id },
            journal: `When Honoria asked what I do when something is lost, I answered, and the ${h.name} lantern brightened.`,
          })),
          [actor('honoria')],
        ),
        n('house-table', 'Your house table makes room for you.'),
      ],
      EVENING,
    ),
  ),
  ...date(
    section(
      'familiar',
      'Your familiar',
      'lantern-hall',
      [
        n('familiars-arrive', 'A side door opens. The familiars wander in between the tables.'),
        decide(
          'familiar',
          'Several come close. One stays.',
          'Which one stays with you?',
          familiars.map((f) => ({
            id: f,
            label: FAMILIAR_ARRIVALS[f],
            hint: f[0].toUpperCase() + f.slice(1),
            effects: { familiar: f },
            journal: `A ${f} chose me on arrival night.`,
          })),
        ),
        n('familiar-settles', 'Your familiar settles beside you. You feel a little less alone.'),
      ],
      EVENING,
    ),
  ),
];
