import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
const r = (emotion = 'warm') => actor('rowan', emotion);
const i = (emotion = 'attentive') => actor('imogen', emotion);

export const arrivalEvening = [
  ...section('after-supper', 'What the light left behind', 'lantern-hall', [
    n(
      'clearing-tables',
      'By the time the pudding dishes are collected, you have learned three useful things. The blue jug holds water, however persuasively it smells of pears. The hall bell rings once for announcements and twice when someone in the kitchens needs their trolley back. And Rowan will offer to carry almost anything if nobody stops him. He is already reaching for six plates when Imogen slides a seventh onto a different stack.',
    ),
    s(
      'plate-arithmetic',
      'imogen',
      'amused',
      'Two trips. There is a staircase between being helpful and becoming an incident.',
      r('amused'),
    ),
    n(
      'emptying-hall',
      'You take the second stack. With your hands occupied, walking across the hall feels easier. Nobody asks which examination you passed or why the academy chose you. A kitchen assistant takes the plates and gives you a damp cloth for a spill you did not make. For a few minutes, there is a task whose beginning and end you can see.',
    ),
    n(
      'lowered-light',
      'When you return, Rowan has found a long brass pole beside a cupboard. Its fork fits a small loop on the lantern chain. He eases the dark lantern down to table height, keeping his other hand beneath it without quite touching. Your own, smaller lantern waits beside your bag. You put it on the floor so there will be no mistaking one for the other.',
      [r('neutral'), i()],
    ),
    s(
      'used-the-pole',
      'rowan',
      'neutral',
      'I helped hang these yesterday. Lowering them is allowed. Repairing them without a teacher is a much more complicated sentence.',
      i('amused'),
    ),
    s(
      'no-repair',
      'imogen',
      'attentive',
      'Then we look, and we write down what we find. Looking is not the same as opening the casing.',
      r('neutral'),
    ),
    n(
      'unbroken-paper',
      'The shade is pale paper over a brass frame. From your chair it looked entirely smooth, but up close you can see thin lines where old tears have been mended. There is no smoke stain above the wick. There is no smell of burning. The little door in the frame is fastened with a wire seal, too deliberate to be an invitation.',
    ),
    decide(
      'first-observation',
      'Rowan lays the pole along the table. Imogen takes out the narrow strip of paper from her atlas and turns it to its blank side. Each waits for you to move first.',
      'How will you examine the dark lantern?',
      [
        {
          id: 'frame',
          label: 'Check the outside with Rowan.',
          hint: 'Notice what can be felt without opening the seal.',
          remember: ['rowan'],
          journal:
            'I checked the lantern frame with Rowan. It had gone cold, and its repair seal was intact.',
        },
        {
          id: 'record',
          label: 'Make a record with Imogen.',
          hint: 'Separate what you saw from what you suspect.',
          remember: ['imogen'],
          journal:
            'I recorded the extinguished lantern with Imogen: no smoke, an intact seal, and no certain cause.',
        },
      ],
      [r('neutral'), i()],
    ),
    ...when(
      'arrival:first-observation',
      'frame',
      n(
        'frame-touch',
        'You hold the back of your fingers near the frame first. It gives off none of the warmth you expect from a lantern lit all evening. Rowan waits until you nod, then steadies the handle while you touch a corner. The brass is as cold as a door latch in rain. You work around the outside together, checking the little hinges, the chain, the unbroken seal.',
      ),
      s(
        'frame-rowan',
        'rowan',
        'grave',
        'The one beside it is still warm. Same table, same draught. I do not know enough to tell you what that means.',
        i(),
      ),
      n(
        'frame-report',
        'Imogen writes down the comparison. Under cause, she leaves a space. You almost offer a guess to fill it, then notice that Rowan is looking at the space with relief. He does not have an explanation either. Saying so has not made either of you less useful.',
      ),
      s(
        'frame-thanks',
        'rowan',
        'warm',
        'Thank you for checking with me. When you are the person who hung the lanterns, a cold one begins to feel like a very personal review.',
        i('warm'),
      ),
    ),
    ...when(
      'arrival:first-observation',
      'record',
      n(
        'record-columns',
        'Imogen rules three columns: seen, heard, guessed. You describe the light drawing inward. She asks whether it flickered first, and you close your eyes briefly to remember. You can picture a shiver of light but cannot say how many times it moved. She writes shivered, then puts a small question mark beside it. There is room on her paper for uncertainty.',
      ),
      s(
        'record-question',
        'imogen',
        'attentive',
        'If we give a teacher a neat answer, they will look for reasons to believe the neat answer. I would rather give them the untidy thing we actually saw.',
        r('neutral'),
      ),
      n(
        'record-observation',
        'Rowan checks the outside of the frame and reports that it is cold. You add his name beside the observation so it will be clear who touched it. Under heard, you write ordinary supper noise. That looks disappointing until Imogen points out that a loud crack would have mattered. An absent crack belongs in the record too.',
      ),
      s(
        'record-thanks',
        'imogen',
        'warm',
        'Keep the pencil a moment. I usually end up writing every part of these things myself. Having somebody disagree before the ink dries could be useful.',
        r('amused'),
      ),
    ),
    n(
      'repair-tag',
      'Beneath the handle, a paper tag has been folded around the chain. Rowan turns it without breaking the fold. Table seven, north side. Checked: first of September. Beside the date is an empty square where a name might go. Somebody has drawn a tiny diagonal stroke through it. The mark could be a shorthand you do not know, or a pen that ran dry. Imogen copies it exactly.',
    ),
    s(
      'tag-caution',
      'imogen',
      'attentive',
      'A blank box is not evidence that somebody has vanished. It is evidence of a blank box. I am saying that now because I know what I will be like in an hour.',
      r('amused'),
    ),
    s(
      'tag-rowan',
      'rowan',
      'amused',
      'In an hour you will have found three other boxes and asked them where they were on the night in question.',
      i('amused'),
    ),
    n(
      'grey-arrives',
      'A trolley wheel knocks against the door frame. Grey comes in with a tray of empty candle cups and stops beside your table. He takes in the lowered lantern, the pole, and the unbroken seal in that order. You prepare an explanation so quickly that the first three words try to leave together.',
    ),
    s(
      'grey-request',
      'grey',
      'neutral',
      'Start with the part you saw. I can ask about the rest after.',
      r('neutral'),
    ),
    n(
      'report-delivered',
      'You tell him. Rowan confirms that the lantern was lit before supper. Imogen offers the paper. Grey reads it twice, then puts his name in the blank space at the bottom of your report. He does not supply a name for the tag. Instead, he folds a red ribbon through the handle and knots it where the next person lowering the chain will see.',
    ),
    s(
      'grey-procedure',
      'grey',
      'neutral',
      'Out of service. That means nobody tries to light it because they think the last person forgot. I will take it down after the hall is clear and check it in the workshop. You can ask me tomorrow what I found.',
      i(),
    ),
    s('rowan-is-it', 'rowan', 'tense', 'Did I hang it wrong?', actor('grey')),
    s(
      'grey-answer',
      'grey',
      'neutral',
      'The chain is seated. The shade is clear of the beam. Those are the things I can answer tonight. If something else went wrong, we will find out what, then decide whose job it is to put right.',
      r('grave'),
    ),
    n(
      'grey-copy',
      'Grey tears a clean sheet from his work pad and makes you a copy of the report number: seven, north, first of September. He presses hard enough for the words to score the next page. There is nothing enchanted about the little receipt. Its usefulness is immediate. Tomorrow, if anyone tells you there was never a problem, you will have something more reliable than the memory of feeling unwelcome.',
    ),
    n(
      'raised-again',
      'Rowan raises the lantern until the red ribbon hangs just below its shade. Grey checks the pole is back in its cupboard, then goes to free the trolley wheel. The hall has become almost quiet. The three of you stand beside a cleared table, with no further reason to delay the part of the evening when everyone must know where they are going.',
    ),
  ]),
  ...section('wrong-turn', 'The useful wrong turning', 'corridor', [
    n(
      'corridor-entry',
      'Beyond the hall, the corridor smells of wet wool and bread. Your luggage seems to have gained weight while you were eating. On your arrival card, an arrow points toward the dormitory stairs. On the wall, an identical arrow points toward a door labelled LINEN. You stop. Rowan stops with you, then looks carefully at the wall as though it has insulted a guest.',
    ),
    s(
      'moved-sign',
      'rowan',
      'neutral',
      'That sign was on the other side this morning. The linen cupboard has excellent blankets, but I would not recommend it for a first night.',
      i('amused'),
    ),
    n(
      'cas-notices',
      'A student kneeling beside the skirting board looks up. A length of white cord lies between his hands, stretched along the floor. He has drawn chalk marks where two rugs overlap. His notebook is open on the nearest window ledge, weighted with a shoe that appears to be his own.',
    ),
    s(
      'cas-introduction',
      'cas',
      'neutral',
      'Cas. Please do not step over the cord until I move it. That rug catches the wheels of trunks. I was marking where to tape it down.',
      r('neutral'),
    ),
    n(
      'shoe-explanation',
      'He notices your glance at his stockinged foot and retrieves the shoe. His notebook begins to close at once. You put your lantern on its corner before the loose pages can slide off the ledge. Cas thanks you, takes a strip of cloth tape from his pocket, and makes a visibly unsuccessful effort not to straighten the lantern.',
    ),
    s(
      'cas-sign',
      'cas',
      'neutral',
      'The sign is my fault. I moved it while measuring the space for the luggage queue. I meant to put it back before the boats. There were more rugs than I had estimated.',
      i(),
    ),
    s(
      'imogen-triage',
      'imogen',
      'attentive',
      'Then the rugs can wait for two minutes. There are people behind us following that arrow.',
      actor('cas'),
    ),
    n(
      'trunk-at-door',
      'As if the corridor has arranged a demonstration, a trunk bumps against the linen door. Toby stands behind it with a second bag under one arm and an expression of intense concentration. Something inside the bag makes a small, offended rustling. He sees your group and tries to reverse the trunk without letting the bag tilt.',
    ),
    s(
      'toby-request',
      'toby',
      'neutral',
      'If this is the dormitory, the beds are smaller than I expected. If it is not, could someone hold the door while I get the handle free?',
      actor('cas'),
    ),
    n(
      'shared-problem',
      'Cas puts his tape down immediately. You take the weight of the trunk while he frees the leather handle from the latch. Rowan holds the door. Imogen redirects two more arrivals before they can join the queue. The bag rustles again. Toby says firmly that it contains his familiar, and that the familiar has already expressed an opinion about being jostled.',
    ),
    decide(
      'corridor-job',
      'The trunk is free, but more footsteps are approaching from the hall. Cas has a useful plan and only two hands. You still have time before the dormitory bell.',
      'Which part will you help finish?',
      [
        {
          id: 'sign',
          label: 'Help Cas fix the sign and the rug.',
          hint: 'Make the route easier for everyone arriving after you.',
          remember: ['cas'],
          journal:
            'I helped Cas repair the dormitory sign and secure the loose rug without blaming him in front of the arrivals.',
        },
        {
          id: 'trunk',
          label: 'Help Toby get his luggage to the stairs.',
          hint: 'Ask what he needs before taking over.',
          remember: ['toby'],
          journal:
            'I helped Toby with his luggage and asked which handle to take, leaving his familiar in his care.',
        },
      ],
    ),
    ...when(
      'arrival:corridor-job',
      'sign',
      n(
        'sign-task',
        'You ask Cas where the sign belongs. He points to two pale rectangles on the opposite wall, then starts explaining why he thought the other position might be clearer. You hold the sign against the rectangles. That gives him a task to finish instead of a mistake to defend. He fits the hooks and steps back with you to check the arrow from the hall doorway.',
      ),
      s(
        'sign-cas',
        'cas',
        'neutral',
        'From here it is obvious. From where I was standing, it was obvious the other way. I should have walked the route before moving it.',
        i(),
      ),
      n(
        'sign-test',
        'Together you tape the rug edges flat. Cas wants to test the seam with his own trunk, but that is upstairs. Imogen rolls her atlas across it on its narrow edge. It travels six inches, falls over, and demonstrates nothing whatsoever. The three of you stare at it. Cas laughs first, a short surprised sound he does not seem to have planned.',
      ),
      s(
        'sign-imogen',
        'imogen',
        'amused',
        'The atlas has never been especially good at fieldwork. We will use a real wheel next time.',
        actor('cas'),
      ),
      n(
        'sign-finish',
        'A late arrival rolls a small case over the seam without noticing it. Cas watches the wheels pass, then crosses something off his list. When he offers to show you the stairs, he uses your name. He heard it at supper, apparently. You had thought nobody outside your little table was listening.',
      ),
    ),
    ...when(
      'arrival:corridor-job',
      'trunk',
      n(
        'trunk-offer',
        'You ask Toby which handle he wants you to take. He looks briefly startled, then gives you the heavy end while he keeps the bag level. There is a particular angle at which the trunk will roll without catching its broken corner. He shows you with his foot before either of you lifts. It saves you both an awkward tug in opposite directions.',
      ),
      s(
        'trunk-toby',
        'toby',
        'neutral',
        'Thank you for asking. People keep saying here, let me, and then everything is in different hands before I can explain about the hinge.',
        r('warm'),
      ),
      n(
        'trunk-landing',
        'You reach the foot of the stairs in three careful stages. At each landing in the floor, Toby counts quietly, and you lift on three. His bag settles. He does not open it to prove anything about the creature inside, and you do not ask him to. At the final turn, Rowan takes your lantern so you can use both hands without crushing your fingers against the rail.',
      ),
      s(
        'trunk-rowan',
        'rowan',
        'amused',
        'I have discovered a carrying job that cannot injure anyone. I may put it on my timetable.',
        actor('toby'),
      ),
      n(
        'trunk-finish',
        'Toby finds the dormitory steward at the stairs and explains about the broken hinge himself. The steward fetches a trolley. Before going, Toby offers you one of the wrapped biscuits from his coat. The wrapper is soft from the journey, but the biscuit is whole. You accept it as a transaction between two people who have each done something useful.',
      ),
    ),
    n(
      'corridor-rejoin',
      'By the time everyone reaches the stairs, the arrow points the right way and the rug lies flat. Cas has put his shoe back on. Toby has a trolley and a clear route. Rowan returns your lantern. None of these accomplishments earns a speech. You find that you prefer the corridor with its ordinary difficulties solved and its people slightly less strange.',
    ),
    s(
      'imogen-morning',
      'imogen',
      'warm',
      'Breakfast is easier if you arrive before the people who consider porridge a competitive event. I will keep the atlas off your chair.',
      r('warm'),
    ),
    s(
      'rowan-map-offer',
      'rowan',
      'neutral',
      'And keep the arrival card. The map on the back is useful once you know that the little mark beside the stairs is a fountain, not a second staircase.',
      i('amused'),
    ),
    n(
      'folded-route',
      'You turn the card over. The tiny fountain has indeed been drawn with steps on either side. Rowan traces the route from the dormitory landing to the hall without touching your fingers. Imogen adds a dot for the library door. Between their corrections, the academy becomes a place you might navigate tomorrow. You fold the card around Grey’s receipt and put both inside your notebook.',
    ),
  ]),
  ...section('first-night', 'A place to begin', 'corridor', [
    n(
      'landing-window',
      'The dormitory steward checks your name against a list, hands you a key, and gives directions that finally agree with the wall. You pause at the landing window before following them. Below, someone is collecting the last luggage from the entrance. Above, a narrow strip of sky remains blue between the roofs. Your lantern reflects in the glass as a small empty cage.',
    ),
    n(
      'unlit-not-failed',
      'It is supposed to be empty. The arrival instructions said to bring it to the first practical lesson unlit. You remember that sentence now with an irritation that is partly relief. All evening, you have been treating the cold handle as evidence about yourself. It is only a handle. You shift it to your other hand and take out the notebook.',
    ),
    decide(
      'night-intention',
      'There is a clean page after the report number. You do not know enough to make a grand promise about your first year. You can choose something small enough to attempt before the end of the week.',
      'What will you write for yourself?',
      [
        {
          id: 'ask',
          label: 'Ask a question before pretending I understand.',
          hint: 'Your first lesson will give you a chance to practice.',
          remember: [],
          journal: 'On my first night, I chose to ask questions before pretending to understand.',
        },
        {
          id: 'stay',
          label: 'Stay with a difficult task long enough to try again.',
          hint: 'Your first lesson will give you a chance to practice.',
          remember: [],
          journal: 'On my first night, I chose to give difficult tasks a second attempt.',
        },
      ],
    ),
    ...when(
      'arrival:night-intention',
      'ask',
      n(
        'night-ask',
        'You write the sentence, then add: one honest question counts. That seems a necessary protection against turning a useful intention into another examination. There will be things here that other students have known since childhood. You cannot acquire their childhoods. You can ask them to explain what their hands are doing.',
      ),
    ),
    ...when(
      'arrival:night-intention',
      'stay',
      n(
        'night-stay',
        'You write the sentence, then add: a second attempt may need help. You have been known to mistake staying with a problem for refusing to let anyone near it. Tonight required a pole, a pencil, a length of tape, and several pairs of hands. Persistence can make room for those things.',
      ),
    ),
    n(
      'night-key',
      'The key fits. You leave your shoes where you will find them in the morning, put the notebook somewhere dry, and set the lantern on the nearest clear surface. The practical details take longer than you expect. By the time they are done, the corridor outside has quietened. Someone passes your door humming half a tune and searching, audibly, for the other half.',
    ),
    n(
      'night-end',
      'Before sleeping, you read Grey’s receipt once more. A lantern went out. You saw it. Two people stayed to look with you, and a third agreed to find out what he could. That is the whole of the mystery tonight. For the first time, its smallness comforts you. Tomorrow is allowed to contain breakfast before it contains an answer.',
    ),
  ]),
];
