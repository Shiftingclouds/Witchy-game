import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
const a = (emotion = 'neutral') => actor('saoirse', emotion);
const r = (emotion = 'neutral') => actor('rhys', emotion);
const d = () => actor('delphine');

export const emberfallPreparations = [
  ...section(
    'borrowed-afternoon',
    'An afternoon already promised',
    'glasshouses',
    [
      n(
        'autumn-between',
        'October has changed the academy in small, persistent ways. Wet coats occupy the hooks nearest the doors. The trees outside the library have become easier to see through. You can keep a Kindle flame steady while someone asks you a question, which would have seemed an unreasonable demand in September. The cold lantern above your supper place still carries its red ribbon. There have been more inspections, but no one has mistaken the passage of time for a repair.',
      ),
      n(
        'emberfall-benches',
        'On Emberfall afternoon, the glasshouse benches are covered in half-built lantern frames. Sunlight catches in the ornate green ironwork and makes every loose brass strip look finished. The illusion lasts until Saoirse picks one up. Its handle slides through the fastening and drops into a pot of soil. She looks at the empty place in her hand, then at you, then very deliberately puts the frame down.',
        [a('tense')],
      ),
      s(
        'saoirse-opening',
        'saoirse',
        'amused',
        'You have arrived at an excellent moment. We have discovered that a lantern needs to remain attached to its handle. Several of my earlier drawings were rather optimistic about this.',
        r(),
      ),
      n(
        'rhys-bench',
        'Rhys moves a tray of moonflowers away from the loose metal. White star-shaped blossoms rest among narrow leaves. Under a nearby glass dome, an ordinary lamp keeps the air warm around a cutting. There is plenty growing here that has nothing to do with your mystery. Rhys makes room for it before she makes room for your notebook.',
        [r(), a('attentive')],
      ),
      s(
        'rhys-request',
        'rhys',
        'neutral',
        'Six sound frames for the west tables. No loose wire, no flame against paper, and no flower picked because someone forgot to collect the fallen petals. We can look at the old botanical reference after the hall has what we promised.',
        a('attentive'),
      ),
      n(
        'too-many-promises',
        'Saoirse’s list says six frames, twelve frames, adjustable shutters, and travelling memory lamp. Each line has a different mark beside it. You ask which marks mean finished. She explains that one means parts found, another means probably possible, and the third is a blot she has been using as a tick. None of them means finished.',
        [a('guarded'), r()],
      ),
      ...when(
        'arrival:watering-method',
        'measure',
        n(
          'measure-callback',
          'The small marked watering tube from your first week is clipped to the shelf. Its measurements are still legible. Saoirse follows your glance and admits that the plant trial became more useful when she stopped changing three things between readings. Then she looks back at the four lines on today’s list, caught by her own example.',
          [a('shy'), r()],
        ),
      ),
      ...when(
        'arrival:watering-method',
        'simplify',
        n(
          'simplify-callback',
          'The plain reservoir from your first glasshouse errand sits beside a healthy tray. The decorative tubing has never returned. Saoirse says the seedlings have shown disappointingly little interest in its absence. When you look at the list of lantern improvements, she looks at the reservoir too, then sighs.',
          [a('shy'), r()],
        ),
      ),
      ...when(
        'arrival:watering-method',
        null,
        n(
          'plant-legacy',
          'Saoirse shows you the ordinary reservoir she has been testing on one tray. It has fewer moving pieces than the design pinned above it. The plants have grown. The unfinished design has not. She seems pleased by the first fact and mildly offended by the second.',
          [a('amused'), r()],
        ),
      ),
      n(
        'delphine-arrives',
        'Delphine arrives carrying a covered bowl and a small brush wrapped in cloth. She introduces herself over the edge of the bowl: brewing, mostly useful mixtures, occasionally ones that need a window opened. Her festival contribution is paste that will hold the paper seams and release in warm water when the frames are cleaned. She has written the washing instructions before anyone asks.',
        [d(), a('attentive')],
      ),
      s(
        'delphine-limit',
        'delphine',
        'neutral',
        'I can help until the first supper bell. My sister is visiting the village, and I have spent three letters saying that I would come down early enough to see her. I would prefer the fourth letter not to explain why a paper lantern prevented it.',
        a('warm'),
      ),
      s(
        'saoirse-old-habit',
        'saoirse',
        'guarded',
        'Of course. I only thought, if we had one more pair of hands, the shutters might—',
        d(),
      ),
      n(
        'unfinished-request',
        'She stops before the request is complete. Delphine has not refused to help; she has said how much help she can offer. Rhys takes a pencil and draws one line beneath the six promised frames. Everything below it can wait. Saoirse watches the line as though a piece of the afternoon has been physically cut away.',
        [a('tense'), r()],
      ),
      decide(
        'work-plan',
        'The shutters would let a keeper shield a petal without removing it, but their catches are still unreliable. The frames can work with a simple removable cover. Alternatively, you can divide the jobs and finish one adjustable demonstration frame after the six ordinary ones. Delphine will leave at the bell in either case.',
        'How will you help make the promise achievable?',
        [
          {
            id: 'simple',
            label: 'Make six reliable frames with simple covers.',
            journal:
              'We chose six reliable Emberfall frames with removable covers. Saoirse set the unfinished shutters aside, and Delphine left at the agreed bell.',
            remember: ['saoirse', 'rhys', 'delphine'],
          },
          {
            id: 'shared',
            label: 'Divide the work, then finish one demonstration frame.',
            journal:
              'We divided the Emberfall work: six plain frames first, then one adjustable demonstration frame. Delphine’s departure time stayed part of the plan.',
            remember: ['saoirse', 'rhys', 'delphine'],
          },
        ],
        [a('attentive'), d()],
      ),
      ...when(
        'emberfall:work-plan',
        'simple',
        n(
          'simple-parts',
          'You move the unfinished catches into a shallow box and write tomorrow on its lid. Saoirse starts to correct the label to after supper, then leaves it alone. She shows you how the removable cover slips into a groove above the lantern glass. There is no clever movement to demonstrate. There is a clear way to tell whether it is in place.',
          [a('attentive'), d()],
        ),
        s(
          'simple-choice',
          'saoirse',
          'warm',
          'If the next person needs me standing behind them to explain it, we have not actually made a lantern they can use. Hand me the plain cover. I shall try to survive its lack of drama.',
          d(),
        ),
        n(
          'simple-delphine',
          'Delphine brushes paste along a seam and asks you to hold it while she counts. The pause is longer than you expect. She explains that pulling at it early only creates more work later. Saoirse, deprived of moving parts, becomes unexpectedly good at keeping the count. By the fourth frame you have a rhythm that leaves enough silence to hear the owl shifting above the door.',
          [d(), a('amused')],
        ),
      ),
      ...when(
        'emberfall:work-plan',
        'shared',
        n(
          'shared-jobs',
          'You divide the bench into finished frames, frames needing paper, and pieces that are still only ideas. Delphine takes the paper seams. You check each handle with the weight of an unlit lamp inside it. Saoirse finishes the six plain covers before touching the demonstration catch. She crosses out the line for twelve frames herself.',
          [a('attentive'), d()],
        ),
        s(
          'shared-count',
          'delphine',
          'neutral',
          'I have six seams drying. If the seventh needs another pair of hands after the bell, it will need a different pair from these. I am telling you now while I am still available to be cheerful about it.',
          a('amused'),
        ),
        n(
          'shared-demonstration',
          'With the promised frames finished, Saoirse brings out one shutter. The catch fails twice before she notices that the hinge is pulling against the paper. You hold the empty frame while she moves the fixing to the metal. This time the panel stays where it is put. She writes a cleaning instruction on the card beside Delphine’s. The demonstration is smaller than her first plan, but it can be repeated without her hands.',
          [a('warm'), d()],
        ),
      ),
      n(
        'bell-kept',
        'At the first bell, Delphine washes the brush and lifts her bowl. Saoirse looks at the remaining bench, then takes the cloth from her before she can begin cleaning something else. She thanks her by name and tells her which table will have the lanterns. Delphine promises to look on her return. The promise costs her no extra work, so it sounds like pleasure.',
        [a('warm'), d()],
      ),
      s(
        'rhys-finished-work',
        'rhys',
        'warm',
        'Six frames, six sound handles, and one person leaving when she said she would. You may record all three as completed work.',
        a('shy'),
      ),
    ],
    1,
  ),
  ...section(
    'festival-tables',
    'Who brought the light',
    'lantern-hall',
    [
      n(
        'hall-arrival',
        'The hall has become almost unrecognisable without changing a single wall. Orange lanterns hang beneath the arches; autumn leaves lie in deliberate trails along the tables. Masks rest against the carved birds above the pillars. Through the great round window, the last sunlight turns the mere the colour of a copper pan. The six frames you carry are plain enough to disappear into the splendour, until you remember that disappearing into usefulness is part of their job.',
      ),
      n(
        'west-table',
        'Grey meets you at the west tables. One has been shifted to make a wider passage near the doors. The space is already useful: a student carrying a stack of plates gets through without turning sideways. Grey asks where each lamp should sit before he brings the wire stands. Saoirse asks him to try a handle rather than telling him it is safe.',
        [actor('grey'), a('attentive')],
      ),
      ...when(
        'register:worker-question',
        'practice',
        s(
          'grey-copy-practice',
          'grey',
          'neutral',
          'That copy you brought after the library visit is in the office now. I liked that you put the date above what I told you. Hask asked to read it, and she could see which part was my own account without having to find me in a corridor.',
          a('attentive'),
        ),
      ),
      ...when(
        'register:worker-question',
        'record',
        s(
          'grey-copy-record',
          'grey',
          'neutral',
          'Your copy of the handover explanation is with the maintenance notes. The private detail stayed private. Hask asked why there were two signatures, and for once the answer was on the page waiting for her.',
          a('attentive'),
        ),
      ),
      ...when(
        'register:worker-question',
        null,
        s(
          'grey-copy-legacy',
          'grey',
          'neutral',
          'Dunne sent over the references for the keeper instructions. I have put a copy beside the current rounds. It helps when a new person wants to know why we wait at the landing after the repair is done.',
          a('attentive'),
        ),
      ),
      n(
        'saoirse-listens',
        'Saoirse listens while he shows you where the lamps will be used. A late arrival will come through the west doors, see the table, and be met before wandering into the serving line. Grey has arranged a stool for whoever takes that turn. Your lantern is part of an invitation with a person attached to it, rather than a decoration expected to do all the welcoming alone.',
        [actor('grey'), a('attentive')],
      ),
      ...when(
        'emberfall:work-plan',
        'simple',
        n(
          'simple-handover',
          'Grey removes a cover, checks the glass, and slides the cover back into its groove without asking Saoirse to explain. She follows the motion with visible relief. The most useful part of the test is that she has nothing to add. You put the cleaning card beneath the spare covers, where the person closing the hall will find it.',
          [actor('grey'), a('warm')],
        ),
      ),
      ...when(
        'emberfall:work-plan',
        'shared',
        n(
          'shared-handover',
          'You keep the adjustable demonstration frame separate from the six table lamps. Grey reads its card, tries the catch, and asks whether the hinge can be cleaned without taking the paper off. Saoirse shows him the fixing she changed. He repeats the movement successfully. The question that might once have spoiled her demonstration has improved the handover.',
          [actor('grey'), a('warm')],
        ),
      ),
      n(
        'credit-card',
        'A small card has been left on the table for the makers’ names. Saoirse writes her own, then yours, then Delphine’s. Grey says the paste will be very welcome when he has to clean the frames. She adds a note about where its washing instructions are kept. You remember the empty register cells and find yourself pleased by a card that lists a person beside the part of the work they actually did.',
        [a('attentive'), actor('grey')],
      ),
      n(
        'imogen-supper',
        'Imogen arrives with three plates and an expression of stern logistical satisfaction. She has decided that carrying supper to the people still arranging lamps is a more efficient intervention than waiting for them to remember it exists. She gives you the plate with a corner of bread balanced over the vegetables, then looks at the makers’ card.',
        [actor('imogen', 'amused'), a('warm')],
      ),
      ...when(
        'register:correction',
        'private',
        s(
          'private-correction-callback',
          'imogen',
          'warm',
          'Maelin’s replacement note reached the class. I used the wording we worked out together. I still felt nervous handing it over, but at least I was nervous about something I meant.',
          a('attentive'),
        ),
      ),
      ...when(
        'register:correction',
        'together',
        s(
          'public-correction-callback',
          'imogen',
          'warm',
          'Maelin used our reference numbers in the replacement note. I read them aloud again before the class started. Your part of the explanation turned out to be rather useful practice.',
          a('attentive'),
        ),
      ),
      ...when(
        'register:correction',
        null,
        s(
          'correction-legacy',
          'imogen',
          'attentive',
          'Maelin has circulated a corrected note about the keeper records. It includes the working sources now. The explanation is longer, but there are more people in it.',
          a('attentive'),
        ),
      ),
      n(
        'ordinary-festival',
        'For a while there is no investigation. Rowan loses an argument with a paper mask and wears it on the back of his head. Someone at the next table knows a song that half the room knows differently. Saoirse makes a small drawing of the argument between the two versions in the corner of her napkin. You eat while the light changes in the round window. The evening continues without needing you to solve it.',
        [a('laugh'), actor('imogen', 'amused')],
      ),
      s(
        'saoirse-night-visit',
        'saoirse',
        'warm',
        'Rhys said we could come back after the flowers open. We have time for another song first. The flowers have made no request for punctual applause.',
        actor('imogen', 'warm'),
      ),
    ],
    2,
  ),
];
