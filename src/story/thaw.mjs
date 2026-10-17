import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
import { thawStones } from './thaw-stones.mjs';
const i = (emotion = 'neutral') => actor('imogen', emotion);
const k = (emotion = 'neutral') => actor('kestrel', emotion);
const r = (emotion = 'neutral') => actor('rowan', emotion);

export const thawScene = {
  id: 'thaw',
  chapter: 5,
  beats: [
    ...thawStones,
    ...section(
      'two-small-lights',
      'A lesson with a way out',
      'warding-hall',
      [
        n(
          'warding-afternoon',
          'Afternoon sunlight crosses the patterned floor of Warding Hall. The practice shields stand against the wall, their edges worn by generations of careful and less careful work. Kestrel has cleared a small area between two of the floor circles. Your exercise will use neither the whole hall nor the grand design under the central window. Two stools, two unlit practice lamps and a narrow strip of open floor are enough.',
        ),
        n(
          'different-practice',
          'Imogen puts her notebook on the stool and immediately has nowhere to sit. She moves it to the floor, thinks better of that, and gives it to you while she takes off her coat. By the time you both settle, Kestrel has arranged the lamps on the steady low stands. She watches the exchange with a patient expression that makes Imogen laugh at herself.',
          [i('amused'), k('warm')],
        ),
        s(
          'kestrel-assessment',
          'kestrel',
          'neutral',
          'Today I am assessing three things: a light offered deliberately, a connection that leaves room, and a release that does not hurt either participant. Brightness is not on the list. If your partner withdraws and you let them go cleanly, you have done part of the exercise well.',
          i('attentive'),
        ),
        n(
          'kindle-reminder',
          'You each kindle a small flame in your own lamp. Imogen’s wavers when she glances at yours. Yours leans when you watch hers. Kestrel asks you to separate the tasks. First make your own light comfortable. Then notice your partner without trying to copy them. The flames become different sizes and steadier for being allowed to differ.',
        ),
        s(
          'imogen-admission',
          'imogen',
          'shy',
          'I appear to be trying to get the same answer as you. I can see why that might become a problem in a lesson about offering my own light.',
          k('warm'),
        ),
        n(
          'connection-demonstrated',
          'Kestrel demonstrates with a practice lamp of her own and asks Imogen whether she is ready to join. Imogen says yes. A fine amber connection curves between them, leaving a visible opening instead of closing around their feet. Kestrel asks her to lower her hand. The connection loosens and ends; both lamps continue burning separately.',
        ),
        s(
          'method-explained',
          'kestrel',
          'neutral',
          'Kindle supplies the light. Threadbind carries an invitation between willing lights. Follow the curve towards your partner, leave the opening, then wait for their answer. Do not pull. The moment you must pull to keep someone in place, release and begin again.',
          i('attentive'),
        ),
        n(
          'first-pair-attempt',
          'You try together. The first line appears too quickly, a tight bright loop between the stands. Imogen’s hand stiffens. You feel an urge to hold the shape because it is finally visible. Kestrel asks both of you to release. The loop vanishes before either lamp goes out. She makes a small note and tells you exactly which part was useful: you both stopped when asked.',
        ),
        n(
          'slower-second',
          'On the second attempt you leave more space and wait. Imogen says she is ready before raising her hand. The connection forms slowly, thinner than the first loop and easier to hold. There is room between the lamps for a person to walk without crossing a line of force. Kestrel places a chalk mark at the point where you can see the opening most clearly.',
        ),
        decide(
          'practice-role',
          'The next part is withdrawal. One person will leave the connection while the other keeps their own light steady. Then you will exchange roles, so both of you learn what the other side feels like.',
          'Which role will you try first?',
          [
            {
              id: 'leave',
              label: 'Withdraw first and describe what the release feels like.',
              journal:
                'In the first Threadbind exercise I withdrew first, then exchanged roles with Imogen. Both lights survived a clean release.',
              remember: ['imogen', 'kestrel'],
            },
            {
              id: 'hold',
              label: 'Keep your own light steady while Imogen withdraws.',
              journal:
                'In the first Threadbind exercise I held my own light while Imogen withdrew, then exchanged roles. We practised releasing without pulling.',
              remember: ['imogen', 'kestrel'],
            },
          ],
          [i('attentive'), k()],
        ),
      ],
      1,
    ),
    ...section(
      'leave-and-return',
      'The person beyond the opening',
      'warding-hall',
      [
        ...when(
          'thaw:practice-role',
          'leave',
          n(
            'leaving-first',
            'You tell Imogen you are going to lower your hand. She nods, then watches you so intently that her flame leans sideways. You lower slowly. For a moment the connection stretches like a strand caught on a sleeve. You stop moving and say what you feel. Imogen releases her attention from your light. The strand settles away and your own lamp stands clear.',
          ),
          s(
            'leaving-partner',
            'imogen',
            'attentive',
            'I was trying to help you keep it steady. Which was not what you were asking me to do. Let me try giving my own lamp all that unnecessary supervision.',
            k('warm'),
          ),
          n(
            'leaving-retry',
            'The second release is clean. You can lower your hand, breathe and turn towards the stool without a tug. When you exchange roles, you recognise the temptation immediately: Imogen’s departing light looks like part of your good work disappearing. You let it separate anyway. The small flame remaining in your own lamp is enough.',
          ),
        ),
        ...when(
          'thaw:practice-role',
          'hold',
          n(
            'holding-first',
            'Imogen says she will lower her hand. You nod and keep watching her flame. As she begins to leave, the connection lengthens instead of opening. She pauses and tells you it feels as if something has caught. Kestrel asks where your attention is. You bring it back to the light you are responsible for. The strand falls away without extinguishing either lamp.',
          ),
          s(
            'holding-partner',
            'imogen',
            'warm',
            'There. That felt different. I could leave without having to persuade the spell that I meant it. Tell me if I forget that when we exchange places.',
            k('warm'),
          ),
          n(
            'holding-retry',
            'You repeat the exercise until Imogen can release smoothly. Then you exchange roles. Lowering your own hand feels stranger than watching hers: the shared warmth thins, and for a breath you miss it. Your lamp keeps burning. Imogen does not chase the departing connection. You can turn towards the stool and decide for yourself whether to come back.',
          ),
        ),
        n(
          'break-before-return',
          'Kestrel calls for a pause. The lamps remain on their stands while you drink water and stretch your fingers. Imogen writes down the sensation of the caught strand, then crosses out “failure” as the heading and replaces it with “first attempt.” The correction is small enough that she does not ask anyone to admire it.',
        ),
        s(
          'newcomer-question',
          'kestrel',
          'neutral',
          'Now the other question from the stones. Someone who has stepped away wants to return. They are not automatically part of the connection because they belonged to it earlier. How will you invite them without making the invitation another demand?',
          i('attentive'),
        ),
        n(
          'return-goes-wrong',
          'You take the place beyond the opening while Imogen holds her light. She begins explaining where to stand, when to lift your hand, and what the first warmth will feel like. You are trying to listen to all three instructions when the invitation flickers out. Imogen stops halfway through a fourth explanation. The silence that follows is almost a relief.',
        ),
        s(
          'imogen-too-many-words',
          'imogen',
          'amused',
          'I have made a doorway with an examination at the entrance. I can hear it now. Give me a moment to stop explaining why I was explaining.',
          k('warm'),
        ),
        decide(
          'rejoining',
          'The spell needs a clear invitation that leaves the returning person time to choose. You can agree on a simple readiness signal before trying again, or open a quiet space and let the newcomer begin the exchange.',
          'How will you make the return easier?',
          [
            {
              id: 'signal',
              label: 'Agree on one readiness signal before sending the invitation.',
              journal:
                'For the Threadbind return we agreed on one readiness signal, waited for it, and let the returning person choose when to join.',
              remember: ['imogen', 'kestrel'],
            },
            {
              id: 'space',
              label: 'Leave the opening quiet until the returning person asks to join.',
              journal:
                'For the Threadbind return we left a quiet opening and waited for the returning person to ask before offering the connection.',
              remember: ['imogen', 'kestrel'],
            },
          ],
          [i('attentive'), k()],
        ),
        ...when(
          'thaw:rejoining',
          'signal',
          n(
            'signal-return',
            'You agree that raising an empty hand means ready to receive the invitation, not already joined. Imogen repeats that distinction once and stops talking. You settle your own light, raise your free hand, and see her look for the signal before offering the curve. This time there is only one thing to answer. You choose to bring your light alongside hers.',
          ),
          s(
            'signal-result',
            'imogen',
            'warm',
            'That is something I can put on an invitation card. Briefly. You may confiscate the fourth sentence if one appears.',
            k('warm'),
          ),
        ),
        ...when(
          'thaw:rejoining',
          'space',
          n(
            'space-return',
            'Imogen holds her own light and leaves the gap alone. You take a breath with nobody describing it to you. When you are ready, you ask to join. She looks up, answers, and offers the curve. The connection settles without either of you hurrying. The space existed before you used it and will remain when you leave.',
          ),
          s(
            'space-result',
            'imogen',
            'warm',
            'We can tell people there will be someone to ask. We do not have to put them on the spot the moment they arrive. I would rather have an invitation like that myself.',
            k('warm'),
          ),
        ),
        n(
          'roles-returned',
          'You exchange places once more. Imogen gets to be the person who waits outside and decides when to come in. You discover that waiting for her answer takes its own kind of attention. Holding a space open does not mean filling every quiet moment with reassurance. When she joins, the two small lamps answer evenly.',
        ),
        s(
          'lesson-passed',
          'kestrel',
          'warm',
          'Both of you joined, left, and returned. Both kept your own light. That is the exercise. We will repeat it with more people before attempting anything at the Heartfire, but you have a method worth practising.',
          i('warm'),
        ),
      ],
      1,
    ),
    ...section(
      'invitation-draft',
      'Who gets to answer',
      'warding-hall',
      [
        n(
          'putting-away',
          'The practical ends with putting things away. You extinguish the practice lamps in the order Kestrel shows you, check the stands are cool, and wipe the chalk from the open floor. Imogen’s notebook has acquired a ring from the water cup. She looks at it, sighs, and keeps the page. The useful account has survived.',
        ),
        n(
          'rowan-arrives',
          'Rowan arrives at the door carrying the books he promised to return to Imogen. He waits until Kestrel waves him in. His first question is whether the stones answered. His second is whether you have eaten since leaving them. Imogen answers both at once and gets the order muddled. He puts the books down and offers to fetch something while you finish.',
          [r('warm'), i('amused')],
        ),
        s(
          'imogen-tells-rowan',
          'imogen',
          'warm',
          'We found the words. We tried the method. It worked after we gave it room to work badly first. I will make you a copy that does not require you to decipher my cup mark.',
          r('amused'),
        ),
        s(
          'rowan-simple-question',
          'rowan',
          'warm',
          'Can somebody help without being good at the spell yet? I am thinking of people who will say yes before they understand, because saying no in front of everyone feels worse.',
          i('attentive'),
        ),
        n(
          'invitation-shaped',
          'The question changes the draft. You begin with what is being asked: practise a small offered light, with help available, before deciding about the restoration. Watching is allowed. Leaving is allowed. There will be work carrying lamps, keeping records and welcoming people who do not cast. Imogen writes the practical limits before she writes anything about saving the academy.',
        ),
        ...when(
          'thaw:rejoining',
          'signal',
          n(
            'signal-card',
            'You add the agreed readiness signal to the practice card, then make clear that people can ask for another way to communicate. The signal belongs to the exercise, not to membership of the academy. Rowan tries reading the card aloud. It is short enough that he reaches the end without asking what he is supposed to answer.',
          ),
        ),
        ...when(
          'thaw:rejoining',
          'space',
          n(
            'space-card',
            'You put a named contact and a quiet practice time on the card. People will be able to ask about joining when they are ready, instead of answering in front of the whole hall. Rowan circles the time to check against the kitchen shifts. An open invitation is not useful if everybody it names is working then.',
          ),
        ),
        n(
          'consent-list',
          'Kestrel returns with the class record. She looks at the draft and asks where you will record a person’s actual answer. Imogen starts a separate sheet. An expression of interest will not be copied into the final participant list without another check. The next practice will have its own invitation; the final ritual will have one too.',
        ),
        s(
          'kestrel-next-work',
          'kestrel',
          'neutral',
          'By Bloomtide we need a rehearsal people can understand and choose. Okoro and I will test the larger arrangement. You can help shape the invitation and hear what prevents people from accepting it. An objection may tell us how to improve the plan.',
          r('grave'),
        ),
        s(
          'rowan-answer',
          'rowan',
          'warm',
          'Then I will start with the kitchen times. Someone always remembers the grand speech and forgets that supper still needs making. If we ask Grey and the serving team early, we can actually listen to their answer.',
          i('warm'),
        ),
        n(
          'work-and-people',
          'For the first time, the route from a found inscription to Midsummer has several visible steps. Learn the small method. Test it with more people. Ask what participation costs them. Change the arrangement. Confirm their choice. You will still need care and luck and further practice. You will not need to discover a single person large enough to hold the whole academy alone.',
        ),
        n(
          'spring-exit',
          'Imogen turns the draft towards you. The wording is ready to try. You can begin with a notice inviting the whole academy to a supported practice, or with individual conversations among your friends before widening it. Neither route supplies anyone’s answer in advance. Rowan waits with the returned books under one arm, and the afternoon light moves another inch across the floor.',
          [i('warm'), r('warm')],
        ),
      ],
      1,
    ),
  ],
};
