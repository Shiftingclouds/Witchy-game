import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
const i = (emotion = 'neutral') => actor('imogen', emotion);
const k = (emotion = 'neutral') => actor('kestrel', emotion);
const t = (emotion = 'neutral') => actor('tully', emotion);

export const thawStones = [
  ...section(
    'path-opens',
    'The first usable morning',
    'candlestones',
    [
      n(
        'spring-approach',
        'The first thing you notice is running water. It comes from somewhere below the path, a thin bright sound under the birds. The last shaded patches of snow still lie against the ridge, but the way between the standing stones is dry. Across the mere, the academy looks pale in daylight. Its windows have become windows again, each catching its own piece of sky.',
      ),
      n(
        'term-between',
        'There have been ordinary weeks between Longnight and this morning: lessons, wet boots by the common-room hearth, a book you returned late, a conversation about something that had nothing to do with lanterns. The winter work continued among them. You did not spend every hour staring at a deadline. March arrived anyway, with a clear morning and Tully’s message that the upper approach had been checked.',
      ),
      ...when(
        'longnight:winter-duty',
        'handover',
        n(
          'handover-thaw',
          'The round sheet you began with Tully has softened at the folds. Two other keepers have used it. One added a sketch of the gate; another crossed out your instruction to stand beside the tall post because the post was hard to distinguish in snow. Their version names the stone step instead. On the last winter check, the initials belong to somebody you have not met.',
        ),
        s(
          'handover-used',
          'tully',
          'warm',
          'It worked while you were in class and I was at the bridge. That is what I wanted. This morning’s check begins where those winter checks stopped. We know which bit is new work.',
          i('attentive'),
        ),
        n(
          'handover-result',
          'You put today’s dry approach beside the old closed-route mark and add the date. The winter sheet goes into the case intact. Imogen uses its observation-point sketch to orient the shore chart, then asks permission to copy it into the investigation notes. Something made for a practical round has become a useful source without ceasing to belong to the people who use it.',
        ),
      ),
      ...when(
        'longnight:winter-duty',
        'archive',
        n(
          'archive-thaw',
          'Imogen brings the source list you began at Tully’s workbench. She has checked each reference, added the archive shelf marks and circled one copied date. The date belonged to a repair of the landing, not its construction. Because you kept the sources separate, she could correct that line without pulling apart the whole account.',
        ),
        s(
          'archive-used',
          'imogen',
          'warm',
          'The chart is useful. Your list made it possible to find out exactly how useful. I followed the repair note back to the original, and it describes the upper approach. We can compare an actual route now, instead of guessing what the little line means.',
          t('warm'),
        ),
        n(
          'archive-result',
          'Tully sets the modern route sheet beside the older chart. You align the landing, the turn, and the ridge. The current path bends around a fallen rock that the old drawing does not show, but both reach the same space between two stones. You mark the difference on a loose comparison page. The old chart stays unaltered.',
        ),
      ),
      ...when(
        'longnight:winter-duty',
        null,
        n(
          'winter-task-legacy',
          'Tully brings the winter route record and Imogen brings a checked source list. You read them together at the start of the path. The records show where the winter checks ended and how the old landing relates to the upper approach. You add today’s date beside the dry-route observation, giving the visit a clear beginning without pretending to have made the earlier sheets.',
        ),
      ),
      n(
        'spring-people',
        'Kestrel joins you at the last turn. She has left the bulky winter markers at the academy and brought a smaller case. Tully points out the firm ground around the ring, then gives the route sheet to her. His next crossing is waiting for him now that the boats can move again. He wishes you a useful morning and takes the path down towards the water.',
      ),
      s(
        'tully-leaving',
        'tully',
        'warm',
        'I shall be at the landing if you need the chart explained again. If you find a rule saying all boatkeepers get a second breakfast, make me a very careful copy.',
        i('amused'),
      ),
      n(
        'circle-in-daylight',
        'The stones are less orderly up close than they looked from the lake. Their heights differ, and their surfaces carry lichen, small cracks and places where rain has deepened the grain. At the centre, old branches rest inside a ring of hearth stones. Nobody has lit them today. The open path enters where the Longnight sketch left its gap.',
      ),
      s(
        'imogen-first-look',
        'imogen',
        'attentive',
        'I brought three pencils because last time one of us dropped one. I also brought a page on which I have written nothing at all. You may admire the restraint.',
        k(),
      ),
      n(
        'morning-task',
        'You can see faint marks on the broad face of the nearest stone, but light and weathering break them into pieces. Kestrel asks you to make an ordinary record before using Echosight. Imogen will take whichever part you leave: the relationship of the open path to the ring, or the condition of the marked surface.',
      ),
      decide(
        'reading-method',
        'Both records will be needed. One puts the inscription in its place; the other shows what is physically present before magic supplies anything. Choose the part you want to examine closely.',
        'Where will you begin?',
        [
          {
            id: 'approach',
            label: 'Compare the open approach with the winter sketch.',
            journal:
              'At First Thaw I compared the safe approach with the open ring recorded at Longnight; Imogen recorded the stone surface before Echosight.',
            remember: ['imogen', 'kestrel'],
          },
          {
            id: 'surface',
            label: 'Record the weathered marks before reading their echo.',
            journal:
              'At First Thaw I recorded the weathered surface before Echosight; Imogen compared the approach with the Longnight sketch.',
            remember: ['imogen', 'kestrel'],
          },
        ],
        [i('attentive'), k()],
      ),
    ],
    0,
  ),
  ...section(
    'room-in-stone',
    'The words weather left behind',
    'candlestones',
    [
      ...when(
        'thaw:reading-method',
        'approach',
        n(
          'approach-check',
          'You begin outside the ring and follow the path without stepping onto the planted edges. It brings you between two stones to the unlit hearth. From there you can see the lake landing through the opening. You turn the winter sketch until its viewpoint matches. The distance is wrong for a precise map, but the relationship is clear: the gap faces the way people came.',
        ),
        s(
          'approach-partner',
          'imogen',
          'attentive',
          'The stone has two lines of shallow marks. Some edges are still physical; some are too worn to read. I have copied only the edges I can actually see. The rest of this page is waiting for the spell.',
          k(),
        ),
      ),
      ...when(
        'thaw:reading-method',
        'surface',
        n(
          'surface-check',
          'You stand where the morning light falls across the broad stone face. There are two rows of shallow cuts, interrupted by wear and patches of lichen. You sketch their positions without rubbing, scraping or touching the surface. A darker groove turns out to be a crack when you look from the side. You mark it differently from the deliberate cuts.',
        ),
        s(
          'surface-partner',
          'imogen',
          'attentive',
          'The approach meets the gap on the side facing the old landing. I walked it both ways. The winter sketch is not a measured plan, but it gives the same relationship. Somebody approaching from the water would come into the space we left blank.',
          k(),
        ),
      ),
      n(
        'reading-position',
        'Kestrel asks you and Imogen to choose separate positions where neither will have to lean or block the other’s view. You put the notebooks on a flat dry rock. The wind lifts a corner and you weight it with the pencil case. The stone has waited through a winter. It can wait through the ordinary difficulty of arranging paper.',
      ),
      s(
        'reading-rule',
        'kestrel',
        'neutral',
        'Keep the echo to the surface. We are asking what was offered here, not calling for every life that passed this way. Record the words you can read and let the rest remain uncertain.',
        i('attentive'),
      ),
      n(
        'stone-echo',
        'You begin Echosight with the steadier breath you learned in the library. Amber gathers along a shallow cut, then bridges a place where the surface has worn away. The stone itself does not heal. Behind the reflected warmth, the old break remains. A whole letter becomes readable, followed by another. Imogen’s pencil starts moving before she remembers to leave room between the lines.',
      ),
      {
        ...n(
          'inscription-detail',
          'The restored reading is two sentences: “A light freely offered. A space for whoever comes next.” The first describes the giving; the second keeps an opening beyond the people already present. The amber letters belong to Echosight. Under them, the stone remains weathered, with gaps that cannot be read by ordinary sight alone.',
        ),
        illustration: {
          art: 'candlestones-inscription',
          alt: 'A weathered standing stone under Echosight displays: A light freely offered. A space for whoever comes next.',
        },
      },
      n(
        'reading-compared',
        'You lower your hand before looking at Imogen’s page. She has copied the same two sentences and put a small mark beside “freely.” Your page has more space around “whoever.” The different emphasis does not change the words. Kestrel reads both copies, then asks you each to say where the sentence ends. Both of you point to the same place.',
      ),
      s(
        'imogen-meaning',
        'imogen',
        'grave',
        'I kept hoping we would find the name of the strongest witch and learn what they did. There must have been somebody who knew how to hold it all. But this tells us to leave room for a person we do not even know yet.',
        k(),
      ),
      s(
        'kestrel-meaning',
        'kestrel',
        'neutral',
        'Someone had to learn the work. That part is still true. The inscription gives the work a condition: it cannot depend on taking a light that has not been offered, or on closing the circle to everyone outside it.',
        i('attentive'),
      ),
      n(
        'wind-in-gap',
        'A gust comes through the opening and lifts the loose comparison page. You catch it against your coat. Imogen laughs once, unexpectedly, then writes a note about the direction of the path. The gap is an idea you are trying to understand and an actual space through which weather arrives. Both facts can be true at the same time.',
      ),
      n(
        'copy-with-source',
        'The copies receive the date, the location and the method used to read them. Kestrel signs as witness to the exercise. You add the ordinary surface sketch so a later reader will know which part required Echosight. The notebook now connects three kinds of record: the old working chart, your winter observation and the spring inscription.',
      ),
    ],
    0,
  ),
  ...section(
    'question-for-class',
    'A method small enough to try',
    'candlestones',
    [
      n(
        'break-at-stones',
        'Kestrel calls a break before anyone can ask for another reading. Imogen finds the bread she packed under a stack of spare pages. It has acquired the faint shape of the notebook binding but tastes perfectly good. You sit on a low dry rock beside the path. From here the village roofs look close enough to touch, although the walk back will remind you otherwise.',
      ),
      s(
        'imogen-control',
        'imogen',
        'guarded',
        'I like a record that stays where I put it. I know that sounds obvious. I mean I like being able to arrange everything until it makes sense. People do not do that. If the method depends on people choosing, I cannot finish it by making a better list.',
        k(),
      ),
      s(
        'kestrel-response',
        'kestrel',
        'warm',
        'A list can tell people what they are being asked to do. That is a useful beginning. It cannot supply their answer. You have already learned to leave a space when the source does not tell you enough. Leave one here as well.',
        i('attentive'),
      ),
      n(
        'practice-question',
        'Imogen looks back at the open path. She asks what happens if somebody joins and then changes their mind. You ask whether a newcomer can join after the circle has begun. Kestrel puts both questions on a fresh teaching card. They are small enough to test without waiting for Midsummer, and necessary enough that no large restoration should proceed without them.',
      ),
      s(
        'lesson-offer',
        'kestrel',
        'neutral',
        'Threadbind is the technique we will practise. Two small willing lights to begin with. A person must be able to withdraw without losing their own light or dragging the other after them. Then we will ask whether they can be invited back. We can learn that in Warding Hall this afternoon.',
        i('attentive'),
      ),
      n(
        'invitation-not-proof',
        'The instruction sounds manageable until you picture doing it. Keeping your own Kindle steady already takes attention. Listening for someone else’s choice while holding a connection will take more. Kestrel does not ask you to say you are confident. She asks whether you are willing to practise with a partner under supervision.',
      ),
      s(
        'imogen-accepts',
        'imogen',
        'warm',
        'I am. Provided we can make a mess of the first attempt without turning the mess into a prophecy about June.',
        k('warm'),
      ),
      s(
        'kestrel-accepts',
        'kestrel',
        'warm',
        'That is what a first attempt is for. The floor has survived more ambitious students than either of you.',
      ),
      n(
        'leaving-stones',
        'Before leaving, you check that all the loose pages and pencil stubs are in the case. Nothing has been tied to a stone or left burning in the old hearth. The circle remains a place someone else can visit after you. Imogen pauses at the opening to look back once, then takes the path towards the academy with the teaching card tucked inside her notebook.',
      ),
    ],
    0,
  ),
];
