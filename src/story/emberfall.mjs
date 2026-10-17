import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
import { emberfallPreparations } from './emberfall-preparations.mjs';
const a = (emotion = 'neutral') => actor('saoirse', emotion);
const r = (emotion = 'neutral') => actor('rhys', emotion);

export const emberfallScene = {
  id: 'emberfall',
  chapter: 3,
  beats: [
    ...emberfallPreparations,
    ...section(
      'flowers-after-dark',
      'The flowers keep their own hour',
      'glasshouses',
      [
        n(
          'night-glass',
          'After the songs, the path to the glasshouses is quiet enough to hear your steps on the grit. The panes no longer throw sunlight across the benches. They hold a dark blue sky, the castle’s distant lamps, and your own faint reflections approaching the door. Inside, the same stools and books occupy the same places. Under the changed light, the white flowers look newly awake.',
        ),
        n(
          'rhys-waits',
          'Rhys is trimming a damaged leaf from a plant unrelated to your visit. She finishes before turning to you. Saoirse sets the small observation lantern on the cleared bench and begins telling her how the handover went. She mentions Delphine’s cleaning card before she describes any part of the mechanism. Rhys listens with a pleased expression that she makes no effort to hide.',
          [r('warm'), a('warm')],
        ),
        s(
          'rhys-source',
          'rhys',
          'neutral',
          'The old reference describes moonflowers kept near the shore lamps. The present collection includes cuttings from that line, although a cutting is not a record of every person who has touched it. Tonight we will use fallen petals. The plant has already given them up.',
          a('attentive'),
        ),
        n(
          'care-before-test',
          'You check the soil with Rhys before taking anything from the tray. The surface is dry; underneath, it still holds moisture. Saoirse reaches for the watering can, then puts it back when Rhys shows her where to feel. More water would be an easy thing to offer and the wrong thing to give. You turn the pot a little so the growing tip has room beside the glass.',
          [r(), a('attentive')],
        ),
        s(
          'saoirse-cold-example',
          'saoirse',
          'attentive',
          'I kept one fallen petal under a paper cover from the moment it dropped. This one was beside the working lamps when we carried them through. They came from the same plant. I want to know whether a difference stays when the lamp is no longer lighting them.',
          r(),
        ),
        n(
          'saucers-arranged',
          'She lays the petals in separate shallow saucers. The covered specimen is ivory all the way to its tip. The other has a faint amber thread near its centre. It would be easy to call the thread a reflection and easier still to call it a discovery. Rhys asks you to leave enough space on the page for either result. Saoirse has already written the source of each petal at the top.',
          [a('attentive'), r()],
        ),
        {
          ...n(
            'petal-detail',
            'Two fallen petals lie in separate cream saucers beside the living plant. A faint amber line runs through the petal on the left; the right remains ivory. The small lamp is contained behind glass, apart from the leaves. Nothing is burning. The visible difference is where the investigation begins. By itself it cannot tell you whether the warmth is new, remembered, or only reflected.',
          ),
          illustration: {
            art: 'moonflower-study',
            alt: 'A potted white moonflower, a glass lantern, and two saucers: the left fallen petal glows faintly amber while the right is plain ivory.',
          },
        },
        decide(
          'observation',
          'There is enough time for a careful comparison before the warmth fades. You can cover the lamp while keeping the petals in place, or exchange the saucers’ positions and then cover the lamp. Rhys will help you separate the steps so you know what you changed.',
          'How will you check the difference?',
          [
            {
              id: 'shade',
              label: 'Shade the lamp and watch the petals stay in place.',
              journal:
                'At Emberfall we shaded the observation lamp. The amber trace remained briefly in one fallen petal while the comparison petal stayed pale.',
              remember: ['saoirse', 'rhys'],
            },
            {
              id: 'exchange',
              label: 'Exchange the saucers, then shade the lamp.',
              journal:
                'At Emberfall we exchanged the saucers before shading the lamp. The amber trace followed its petal rather than its position on the bench.',
              remember: ['saoirse', 'rhys'],
            },
          ],
          [a('attentive'), r()],
        ),
        ...when(
          'emberfall:observation',
          'shade',
          n(
            'shade-test',
            'You lower the cover slowly. Reflections retreat across the rims of both saucers, then vanish from the pencil. The amber thread in the left petal remains. It is much fainter without the lamp, but its outline has not moved. Saoirse starts counting breaths and loses count when she looks at you. You begin again together, without pretending the first count was reliable.',
            [a('attentive'), r()],
          ),
          s(
            'shade-result',
            'saoirse',
            'warm',
            'There. It is not just the reflection. I would like that to explain everything else, but for the moment I am very pleased that it explains one thing.',
            r('warm'),
          ),
        ),
        ...when(
          'emberfall:observation',
          'exchange',
          n(
            'exchange-test',
            'You exchange the saucers without touching either petal. The amber thread moves with its specimen to the right. Saoirse marks the change on the page before you lower the cover. When the reflections disappear, the thread remains where the petal now lies. Nothing has been left glowing on the old patch of wood. Rhys steadies the covered lamp while you check both positions once more.',
            [a('attentive'), r()],
          ),
          s(
            'exchange-result',
            'saoirse',
            'warm',
            'The bench is innocent. That is useful; I had absolutely no plan for taking it down to the shore. Now we can ask what the petal is keeping.',
            r('warm'),
          ),
        ),
        n(
          'warmth-fades',
          'The light fades before you have filled half the page. Saoirse’s hand moves toward the lantern, then stops. Adding more warmth now would make it harder to say how long the first trace lasted. She watches the petal go pale. You are surprised by how much patience it takes to let a successful experiment end.',
          [a('attentive'), r()],
        ),
        s(
          'rhys-next-step',
          'rhys',
          'warm',
          'A short-lived trace is still a trace. We have enough to try Echosight on a second prepared petal. We do not have permission to exhaust the whole plant until it tells us a more impressive story.',
          a('shy'),
        ),
      ],
      3,
    ),
    ...section(
      'warmth-without-a-face',
      'Warmth without a face',
      'glasshouses',
      [
        n(
          'prepared-sample',
          'Rhys brings a second fallen petal in a folded paper packet. The packet belongs to the teaching collection, with its source and date written on the outside. It was collected beside a shore lantern after a previous Emberfall. The care note says the flower was tended by several people. No single name is offered as the owner of everything it might remember.',
          [r(), a('attentive')],
        ),
        s(
          'rhys-permission',
          'rhys',
          'neutral',
          'We can observe this teaching sample once. Lift your hand if the trace becomes difficult to leave. If you notice a feeling, describe it as a feeling. It cannot give consent for us to invent a whole person around it.',
          a('attentive'),
        ),
        n(
          'echo-first',
          'The first impression is warmth at knee height, as if a small fire had been carried close while someone waited. Then comes the rough drag of cloth over a seam. You glimpse a hand pressing a patch flat, but the hand has no face attached to it and the scene does not widen when you try to look. You remember Maelin’s card. You let the trace pass.',
          [a('attentive'), r()],
        ),
        n(
          'echo-other-work',
          'There is a brief sense of a kettle being moved to make room, and damp boots on a board that gives slightly underfoot. The impressions overlap without becoming a single room. You cannot tell whether you have seen three moments or pieces of one. Underneath them lies the same patient warmth that made the working ledger feel familiar. It fades when you lift your fingers.',
          [a('guarded'), r()],
        ),
        s(
          'saoirse-question',
          'saoirse',
          'guarded',
          'Did it feel like somebody waiting to be found?',
          r(),
        ),
        n(
          'answer-with-room',
          'You tell her what you noticed: the patch, the kettle, the boots, the warmth. You cannot honestly say that anyone was waiting inside the petal. Saoirse turns her pencil between her fingers. The answer disappoints her, though she has been careful enough to know why it matters.',
          [a('sad'), r()],
        ),
        s(
          'rhys-not-a-person',
          'rhys',
          'neutral',
          'The petal can carry something left by care. It does not carry the person who gave it. Think of a coat kept warm for someone coming in from the rain. The welcome is real. It does not mean its maker is still standing inside the coat.',
          a('attentive'),
        ),
        n(
          'saoirse-explains',
          'Saoirse puts the pencil down before answering. She had hoped the travelling lamp might preserve stories people could no longer tell. She can see now how quickly that hope could become a machine that supplies whatever a listener longs to hear. The thought makes her look toward the covered lantern rather than toward you.',
          [a('guarded'), r()],
        ),
        s(
          'saoirse-new-purpose',
          'saoirse',
          'attentive',
          'Then it needs to hold the trace without pretending to translate it. A cover, a source card, a way to let the warmth go. No little voice making up a name because we dislike an empty space.',
          r('warm'),
        ),
        n(
          'role-of-a-lantern',
          'You place the clean source card beside the frame. A person carrying the lamp would need to know where its petal came from, when it was gathered, and how long the trace might remain. They would also need to know when to stop. None of those instructions makes the lantern less interesting. They give someone besides its inventor a way to use it without having to guess.',
          [a('attentive'), r()],
        ),
        ...when(
          'emberfall:work-plan',
          'simple',
          n(
            'simple-memory-cover',
            'The plain cover you chose this afternoon proves useful again. It is easy to see whether it is open or closed, and easy to remove for cleaning. Saoirse writes that on the card. She adds that an adjustable shutter may eventually help, but it is not required for this observation. The distinction seems to cost her less than it would have cost her before supper.',
            [a('warm'), r()],
          ),
        ),
        ...when(
          'emberfall:work-plan',
          'shared',
          n(
            'shared-memory-cover',
            'The single adjustable frame makes it possible to lower the light gradually, but Saoirse records the plain cover as an alternative. The six working lamps in the hall still matter more than this extra mechanism. She writes that someone should be able to complete the observation without choosing her cleverest design.',
            [a('warm'), r()],
          ),
        ),
        s(
          'rhys-shore-question',
          'rhys',
          'neutral',
          'The older plants were kept beside the returning path. Tully may know which shore lamps were tended together. Take him the question when the winter rounds begin. Take a copy of what you actually observed, too. He deserves something more useful than an alarming rumour about haunted flowers.',
          a('amused'),
        ),
        n(
          'shore-question',
          'You add the shore rounds to your notebook. The old register described people working at separate lamps; the flowers may connect those places through a practice that survived longer than its explanation. Tully can show you the route as it is used today. You have a question specific enough to take to him, and an observation he can check.',
          [a('attentive'), r()],
        ),
      ],
      3,
    ),
    ...section(
      'an-unproductive-hour',
      'An hour with nothing to prove',
      'glasshouses',
      [
        n(
          'rhys-clears',
          'Rhys seals the teaching sample, checks the plant labels, and takes the unused petals back to their shelf. The experiment is finished. She leaves the two of you the ordinary job of wiping the bench and tells you where the clean cloths belong. Saoirse looks almost relieved to be given an instruction that cannot become a new invention.',
          [a('tired'), r('warm')],
        ),
        n(
          'bench-cleaning',
          'The paste has dried in a pale ring beside the bowl. Warm water softens it exactly as Delphine promised. You hold the bowl while Saoirse wipes, and she tries to remember whether the cleaning card credited Delphine clearly enough. You tell her that Grey read the name aloud. The worry leaves her face slowly, as though it had expected to remain for the evening.',
          [a('warm')],
        ),
        s(
          'saoirse-usefulness',
          'saoirse',
          'guarded',
          'I keep thinking that if I can finish the next useful thing, I will have earned a quiet evening. Then I put another useful thing after it. I suspect there is a fault in the design.',
        ),
        n(
          'not-a-repair-request',
          'She says it lightly, but she has stopped moving the cloth. You have seen her use a joke to make a difficult sentence easier to carry. This time she does not immediately replace the sentence with another task. Outside the glass, a cloud passes across the moon. The room darkens for a moment without becoming cold.',
          [a('shy')],
        ),
        decide(
          'quiet-company',
          'The bench is clean. The lamp is out. Saoirse folds the cloth square and leaves it beside the sink. You have a little time before you need to return to the hall, and neither of you has promised it to anyone else.',
          'What kind of company will you offer?',
          [
            {
              id: 'listen',
              label: 'Ask what she hoped the travelling lamp would do.',
              journal:
                'After Emberfall’s observation, Saoirse told me why she wanted a travelling memory lamp. I listened without turning the conversation into another task.',
              remember: ['saoirse'],
            },
            {
              id: 'rest',
              label: 'Invite her to spend a little time without a project.',
              journal:
                'After Emberfall’s observation, Saoirse and I spent a quiet interval naming ordinary things we liked. We left the unfinished work closed for the night.',
              remember: ['saoirse'],
            },
          ],
          [a('shy')],
        ),
        ...when(
          'emberfall:quiet-company',
          'listen',
          s(
            'listen-first-hope',
            'saoirse',
            'guarded',
            'I wanted a light you could take somewhere that did not feel like home yet. Not one that told you to be grateful. Something that reminded you that you had been expected somewhere before, and might be expected again.',
          ),
          n(
            'listen-room',
            'You ask whether she has had a place like that. She looks at the stools, the crowded benches, and the plant that has somehow grown around the foot of a bookstand. This room, she says, but not immediately. At first she kept volunteering for things because she could understand being needed more easily than being wanted. She does not give you a larger story than she is ready to tell.',
            [a('attentive')],
          ),
          s(
            'listen-honest',
            'saoirse',
            'shy',
            'I am trying to learn the difference. Rhys keeps giving me seedlings that do not need anything until tomorrow. I think it may be a deliberate teaching method.',
          ),
          n(
            'listen-answer',
            'You tell her that you came back after the songs because you wanted to spend the evening here. The observation mattered, but it was not the only reason. Saoirse studies the folded cloth while she takes that in. Then she nudges the empty stool toward you. There is no reward hidden inside the gesture, and no request following it.',
            [a('warm')],
          ),
        ),
        ...when(
          'emberfall:quiet-company',
          'rest',
          n(
            'rest-first-minute',
            'You sit on the empty stool and suggest an experiment that requires no equipment: a few minutes in which neither of you improves anything. Saoirse says that making it an experiment is a rather unfair way to make her interested. She sits anyway. For the first minute she notices three things she could mend and tells you about none of them.',
            [a('amused')],
          ),
          s(
            'rest-ordinary-list',
            'saoirse',
            'warm',
            'The sound the hall makes when everybody knows the next line of a song. The smell of the first orange someone opens in winter. A clean pair of socks that nobody has warmed with a spell. Apparently I have a great deal to say about socks.',
          ),
          n(
            'rest-player-room',
            'She asks what you would put on the list and waits while you think. There is no correct kind of ordinary pleasure to offer her. The small pause matters more than a perfectly chosen answer. You can look through the glass at the scattered academy lights without having to turn them into evidence. Saoirse follows your gaze and, for once, leaves the silence whole.',
            [a('warm')],
          ),
          s(
            'rest-no-minutes',
            'saoirse',
            'amused',
            'We should do this again. I would make a timetable, but I worry that would count as improving something. Perhaps I shall simply ask whether you are free.',
          ),
        ),
        n(
          'quiet-leaving',
          'When you stand, Saoirse leaves the box marked tomorrow where it is. She checks that the lantern is cool, takes the copy intended for Tully, and turns down the nearest lamp. The room does not need to become empty of unfinished things before you are allowed to leave it. That feels like a useful lesson, though neither of you calls it one.',
          [a('warm')],
        ),
      ],
      3,
    ),
    ...section(
      'one-line-left',
      'One line left',
      'corridor',
      [
        n(
          'returning-corridor',
          'The corridor outside the hall carries the muffled rhythm of a final song. Someone has hung a paper lantern in the deep window recess, safely clear of the curtain. Rowan is waiting by the door with the last two slices of a cake that has suffered structurally but remains promising in every other respect.',
          [actor('rowan', 'warm'), a('amused')],
        ),
        s(
          'rowan-cake',
          'rowan',
          'amused',
          'I defended these from a perfectly reasonable argument about sharing. Please eat them before I begin to agree with it.',
          a('laugh'),
        ),
        n(
          'delphine-return',
          'Delphine comes up the corridor just as you finish the first bite. Her sister has gone back to the village with a lantern drawing on the back of an envelope. She saw the west tables on her way in and found the cleaning card where you said it would be. Saoirse asks how the visit went before asking anything about the paste. Delphine notices the order, and her answer becomes a little longer.',
          [actor('delphine'), a('warm')],
        ),
        s(
          'delphine-evening',
          'delphine',
          'neutral',
          'We walked nowhere in particular and argued about whose turn it was to write first. I have been trying to brew the feeling of opening a letter. This was a useful reminder that sometimes you can simply go and see the person.',
          a('attentive'),
        ),
        n(
          'final-frame',
          'The remaining lantern paper is waiting on the small corridor table. The six frames are in use, the comparison has a written record, and the next shore question is safe in your notebook. What remains is a line for the Emberfall lantern you made together. It does not have to explain the entire mystery. It only has to be a promise you are prepared to carry.',
          [a('warm'), actor('rowan', 'warm')],
        ),
        s(
          'saoirse-last-line',
          'saoirse',
          'warm',
          'Leave a little space at the edge. Someone might think of a better way to say it when we are older. I would like the lantern to have room for that.',
          actor('rowan', 'warm'),
        ),
        n(
          'emberfall-end',
          'You smooth the paper beside the small waiting flame. Beyond the door, the hall is beginning to settle: chairs drawn in, cups gathered, the welcoming stool still occupied. The ordinary work of the festival is not finished when the celebration ends. This time, you know who will stay to finish it.',
          [a('warm')],
        ),
      ],
      3,
    ),
  ],
};
