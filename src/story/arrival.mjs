import { arrivalOrientation } from './arrival-orientation.mjs';
import { arrivalEvening } from './arrival-evening.mjs';
import { chapters } from '../content.mjs';
// These are authored performance directions, not emotion guesses from keywords.
const rowan = (emotion = 'warm') => ({ id: 'rowan', emotion });
const imogen = (emotion = 'attentive') => ({ id: 'imogen', emotion });
const beat = (text, speaker = null, actors = []) => ({ text, speaker, actors });
const stagedScenes = [
  {
    id: 'arrival',
    chapter: 0,
    beats: [
      beat(chapters[0].text[0]),
      beat(
        'Inside the hall, a hundred small flames lean toward the opening door. Your lantern stays cold. You turn the handle so your name faces your coat, and look for a seat that does not seem to belong to somebody already.',
      ),
      beat(
        'You made it. Here—give me a moment. This chair has developed a very serious commitment to holding my books.',
        'rowan',
        [rowan('warm')],
      ),
      beat(
        'Rowan lifts a precarious stack. The bottom book slides free. Before it reaches the floor, a hand catches it by its spine.',
        null,
        [rowan('surprised'), imogen()],
      ),
      beat(
        'That is the third time today. Have you considered carrying fewer books, or asking the chair whether it enjoys its work?',
        'imogen',
        [rowan('amused'), imogen('amused')],
      ),
      beat(
        'I was hoping it would become a tradition. Traditions sound much better than repeated mistakes.',
        'rowan',
        [rowan('laugh'), imogen('amused')],
      ),
      beat(
        'Imogen sets the rescued atlas beside your plate. A narrow strip of paper sticks out between its pages, crowded with handwriting. She notices you looking and tucks it carefully back inside.',
        null,
        [rowan(), imogen('guarded')],
      ),
      beat(
        'I am borrowing it. Properly. There is a signature and everything. I only disagree with how long the library thinks a person needs to read an atlas.',
        'imogen',
        [rowan('amused'), imogen('attentive')],
      ),
      beat(
        'I am Rowan. This is Imogen. You may have gathered that the atlas is a sensitive subject.',
        'rowan',
        [rowan(), imogen('amused')],
      ),
      beat(
        'And you are welcome to sit here, even if you have never had a strong opinion about a map in your life.',
        'imogen',
        [rowan(), imogen('warm')],
      ),
      beat(
        'You put your lantern beside the empty plate. Rowan moves the bread within reach without asking whether you want any. Across the hall, people are greeting old friends loudly enough to make your own silence feel conspicuous.',
        null,
        [rowan(), imogen('warm')],
      ),
      beat(
        'My first boat ride, I rehearsed an introduction the entire way across. By the time we landed, I could not remember my own name.',
        'rowan',
        [rowan('shy'), imogen()],
      ),
      beat('You introduced yourself as the name of the boat.', 'imogen', [
        rowan('shy'),
        imogen('amused'),
      ]),
      beat(
        'A perfectly respectable name. Very seaworthy. The point is, nobody requires an impressive first evening. You can just have some bread.',
        'rowan',
        [rowan('amused'), imogen('warm')],
      ),
      beat(
        'Above your chair, one of the hanging lanterns shivers. Its light draws inward, becoming a pinprick, and disappears. You look down at the name on your own handle. For a moment you wish you had hidden it better.',
        null,
        [],
      ),
      beat(
        'Rowan follows your gaze. The smile leaves his face. Imogen closes the atlas with one finger still marking her place.',
        null,
        [rowan('grave'), imogen('attentive')],
      ),
      beat('That was lit a moment ago. I checked this table before the boats arrived.', 'rowan', [
        rowan('grave'),
        imogen('attentive'),
      ]),
      beat(
        'It was. And before you decide otherwise: you did not make it go out by sitting down.',
        'imogen',
        [rowan('tense'), imogen('grave')],
      ),
      beat(
        'The hall carries on around you. A spoon falls. Somebody laughs at the wrong part of a story. Nothing about the room looks different, except the little pocket of darkness directly overhead.',
        null,
        [rowan('tense'), imogen('grave')],
      ),
      beat(
        'We can ask about it after supper. Together, if you like. You do not have to decide what you think of this place in the first five minutes.',
        'rowan',
        [rowan('warm'), imogen('attentive')],
      ),
      beat(
        'Imogen opens the atlas again, but leaves it where all three of you can see. Rowan breaks the bread. For the first time since the boat, your hand loosens around the lantern handle.',
        null,
        [rowan('warm'), imogen('warm')],
      ),
      beat('The light above you is still out. There is still a place for you beneath it.'),
    ],
  },
];
const arrivalIds = [
  'lantern-name',
  'unclaimed-seat',
  'rowan-books',
  'falling-atlas',
  'imogen-chair',
  'rowan-tradition',
  'hidden-note',
  'imogen-atlas',
  'rowan-introductions',
  'imogen-welcome',
  'bread-and-silence',
  'rowan-crossing',
  'imogen-boat',
  'rowan-bread',
  'dark-lantern',
  'shared-concern',
  'rowan-light',
  'imogen-reassurance',
  'ordinary-hall',
  'rowan-together',
  'room-at-table',
  'still-a-place',
];
stagedScenes[0].beats.forEach((entry, index) => {
  entry.id = arrivalIds[index];
});

export const arrivalScene = stagedScenes[0];
arrivalScene.beats.forEach((beat) => {
  beat.section = {
    id: 'place-at-table',
    title: 'A place at the table',
    location: 'lantern-hall',
    period: 2,
  };
});

arrivalScene.beats.push(...arrivalEvening);

arrivalScene.beats.forEach((beat) => {
  beat.section.period = beat.section.id === 'first-night' ? 3 : 2;
});

arrivalScene.beats.push(...arrivalOrientation);
