import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
const noor = () => actor('noor'),
  idris = () => actor('idris'),
  saoirse = (emotion = 'neutral') => actor('saoirse', emotion);
const secondDay = (id, title, location, period, beats) =>
  section(id, title, location, beats, period).map((beat) => ({
    ...beat,
    section: { ...beat.section, date: '2026-09-02' },
  }));

export const arrivalOrientation = [
  ...secondDay('open-house', 'The room with water in the windows', 'heronmere', 0, [
    n(
      'morning-invitation',
      'The next morning, breakfast proves to be where Imogen said it would be, which seems a promising start. You return your cup without breaking anything and find a new card beneath your timetable. Common rooms open to visitors until the midday bell. Follow the birds on the doors, it says. You choose the heron because you have never seen a room with a view beneath a lake.',
    ),
    n(
      'heron-arrival',
      'The first thing you notice is the light. It moves across the ceiling in broad green bands, as though someone is slowly turning a sheet of glass. Beyond the tall windows, fish pass between trailing stems. Inside, a shallow pool interrupts the stone floor. Cushioned benches follow the windows, and a fire burns on the opposite side of the room. The arrangement seems impossible until you notice that everyone who lives here has found ordinary ways to use it.',
    ),
    n(
      'noor-letter',
      'A student sits at a low table with three envelopes, a cup, and a small feather caught in her sleeve. She looks up when you stop at the edge of the pool. Her finger remains on a line of writing, marking the place she will return to. You recognise her from the breakfast queue. She was the person who asked the kitchen assistant which tray had been set aside for late arrivals.',
    ),
    s(
      'noor-welcome',
      'noor',
      'neutral',
      'The path is around the left. Everybody thinks the stepping stones are the way in. They are mostly a way to get one wet sock. I am Noor.',
      idris(),
    ),
    n(
      'guest-seat',
      'You introduce yourself and follow the dry path. Noor moves her cup off an empty cushion, then notices the feather. She puts it between two pages of her notebook without explanation. At the far table, Idris has spread a timetable beside a model staircase made of folded card. He raises a hand in greeting but finishes measuring one narrow step before he joins you.',
    ),
    s(
      'idris-room',
      'idris',
      'neutral',
      'I came for ten minutes and have been here nearly an hour. The fish make very persuasive arguments against leaving.',
      noor(),
    ),
    n(
      'ordinary-guest',
      'Noor asks whether you found your own common room last night. You tell her enough about the sign and the luggage to make her glance toward the door. She explains that open visiting hours are a beginning-of-term habit, intended to prevent the houses becoming four separate schools. After the midday bell, visitors ask a resident to bring them in. Being welcome does not mean appearing beside someone’s half-written letter whenever you please.',
    ),
    s(
      'noor-boundary',
      'noor',
      'neutral',
      'The houses have different customs. They still share the library, classes, and most of the people who know how to mend a kettle. It would be inconvenient to turn every preference into a border.',
      idris(),
    ),
    n(
      'notice-table',
      'There is a stack of blank notices on the table. Noor has been asked to organise the first open study hour, a modest event that has somehow acquired seven suggestions and no agreed time. One note requests silence. Another proposes practising choral charms. A third says that anyone who asks for silence in a common room should go to the library. Idris has drawn a small, restrained question mark beside that one.',
    ),
    s(
      'idris-explanation',
      'idris',
      'neutral',
      'The library’s quiet room is upstairs. One of the people who signed this has a sore knee. I think we can avoid making them climb a staircase to earn a quiet chair.',
      noor(),
    ),
    n(
      'noor-difficulty',
      'Noor turns the notes so you can read them without leaning over her letter. She had imagined putting a time on a board and providing a pot of tea. Now she has been told that choosing any arrangement will reveal which kind of person she considers important. The accusation is written nowhere. It has travelled through three conversations and arrived at this table as a feeling nobody wants to name.',
    ),
    s(
      'noor-ask',
      'noor',
      'neutral',
      'You have only just arrived. What would you need to know before you came to something like this? It is a real question. You are allowed to say you would rather not come.',
      idris(),
    ),
    n(
      'guest-perspective',
      'You look around before answering. The window benches are separated from the larger table by the pool. The fire end of the room feels close and sociable; the far corner feels private without being shut away. There is enough space for several uses, but the sound of a choral charm would carry everywhere. A sign can tell people what to expect. It cannot make stone walls absorb a song.',
    ),
    decide(
      'common-room-rule',
      'Noor puts a blank notice between you. Idris slides his ruler toward it. Neither suggestion will settle every future use of the room, but one clear first arrangement might let people decide whether to attend.',
      'What should the first notice make clear?',
      [
        {
          id: 'quiet',
          label: 'Start with a quiet half hour, then invite conversation.',
          hint: 'Give readers a predictable time and place.',
          remember: ['noor', 'idris'],
          journal:
            'I helped Noor and Idris plan a quiet first half hour for the open study visit, followed by conversation.',
        },
        {
          id: 'welcome',
          label: 'Start by showing newcomers where and how to join.',
          hint: 'Make the invitation specific instead of assuming people know the rules.',
          remember: ['noor'],
          journal:
            'I helped Noor make the study-hour invitation explicit: where to sit, what to bring, and how to ask for a quieter place.',
        },
      ],
      [noor(), idris()],
    ),
    ...when(
      'arrival:common-room-rule',
      'quiet',
      n(
        'quiet-notice',
        'You draw a line down the page. On the left: first half hour, quiet reading and written questions. On the right: tea and conversation afterwards. Idris adds that the window seats remain available to anyone who wishes to keep reading. The singers will need a different hour; Noor writes them a separate note rather than pretending their suggestion has been accommodated by moving it two tables away.',
      ),
      s(
        'quiet-idris',
        'idris',
        'neutral',
        'I can plan around that. If I know when the talking starts, I do not have to spend the quiet part waiting for it to happen.',
        noor(),
      ),
      n(
        'quiet-noor-action',
        'Noor rereads the notice, then removes the word strictly from the first line. She wants a person who drops a spoon to feel able to pick it up. You replace the word with a start time and a finishing time. The page becomes less stern and more useful. Idris offers to be at the door for the first ten minutes so late arrivals do not have to interrupt someone to learn the arrangement.',
      ),
      s(
        'quiet-noor-thanks',
        'noor',
        'neutral',
        'That is an event I can actually host. I was beginning to think I needed to become seven different people before putting the kettle on.',
        idris(),
      ),
    ),
    ...when(
      'arrival:common-room-rule',
      'welcome',
      n(
        'welcome-notice',
        'You ask Noor to describe what someone should do after reaching the door. Put a bag beside a chair, choose any seat without a notebook on it, help themselves to tea, and ask the host if they need a quieter place. The list seems obvious to her until you ask which person will be the host. She smiles ruefully and writes her own name at the top.',
      ),
      s(
        'welcome-idris',
        'idris',
        'neutral',
        'I would come to that. The worst part of returning to study was feeling that everybody else had been given a second set of instructions about where to stand.',
        noor(),
      ),
      n(
        'welcome-noise',
        'The singing suggestion still needs an answer. Noor writes that this first visit is for study and conversation at ordinary speaking volume. The choral group will be offered another time. You add a line saying that a seat near the windows can be requested without giving a reason. The room cannot promise perfect quiet, but the notice can stop pretending that all company feels the same to everyone.',
      ),
      s(
        'welcome-noor-thanks',
        'noor',
        'neutral',
        'I know where I sit because I have been here before. That is a very poor entrance requirement. Thank you for making me describe it.',
        idris(),
      ),
    ),
    n(
      'notice-test',
      'Before pinning the notice up, Noor hands it to a visitor who has just arrived. She asks what they think it invites them to do. The answer is close enough to what you intended that all three of you relax. Idris notices that the time has been written without a day. You add Thursday. The omission is ordinary, repairable, and rather funny now that it is no longer a crisis about belonging.',
    ),
    n(
      'house-points-question',
      'Beside the noticeboard is a page headed house contributions. It lists practical work, study help, and several crossed-out entries that have been rewritten more clearly. You ask whether helping with the notice earns points. Noor explains that staff record the formal awards. This was something she needed help with, so she asked. If you want to join a scored activity, you can check its instructions first.',
    ),
    s(
      'noor-points',
      'noor',
      'neutral',
      'It is all right to like winning things. I only want to be able to ask someone to pass the scissors without turning it into a competition.',
      idris(),
    ),
    n(
      'idris-stairs',
      'Idris returns to his model staircase while Noor pins up the corrected notice. He shows you the fold he has been working on. It represents the library’s awkward turn, where carrying a large book makes the next step hard to see. His model is not a solution yet. He wants to compare two ways of making the turn more obvious before he asks anyone to alter the actual stair.',
    ),
    s(
      'idris-method',
      'idris',
      'neutral',
      'I used to think returning as an older student meant I had to make up for lost time by understanding everything quickly. Cardboard has been a helpful critic of that idea. It refuses to hold a shape merely because I am embarrassed.',
      noor(),
    ),
    n(
      'leaving-room',
      'At the midday bell, Noor begins collecting the visiting cups. You take yours to the tray. She asks if you would carry a small basket of empty seed pots to the glasshouses later; Rhys left them here after repotting the window herbs. You agree because it is a task with a destination you have not seen. She checks your afternoon timetable before handing over the basket, making sure a useful favour will not make you miss a lesson.',
    ),
    n(
      'pool-last-look',
      'You take one last look through the windows. A fish has stopped near the stone tracery, apparently considering the people on the other side. The room is still extraordinary. It has also become the place where Noor keeps her letters, Idris measures cardboard, and a notice needs a day as well as a time. You can imagine returning without having to be astonished correctly.',
    ),
  ]),
  ...secondDay('glasshouse-errand', 'The invention that watered the floor', 'glasshouses', 1, [
    n(
      'glasshouse-light',
      'By late afternoon, the empty pots are knocking softly together in the basket. The glasshouses stand warm against the cooler air of the grounds. Through the tall panes you can see hanging flowers, shelves of jars, and lanterns already lit beneath the iron ribs. You stop at the door because the nearest pot contains a root with a distinctly displeased face. It seems wise to establish whether that is usual before putting anything down beside it.',
    ),
    s(
      'saoirse-first',
      'saoirse',
      'amused',
      'It always looks like that. Yesterday I apologised for moving its saucer and felt foolish for the rest of the morning. Come in. Carefully, on the dry side.',
      actor('rhys'),
    ),
    n(
      'saoirse-intro',
      'Saoirse stands between two benches with a watering can in one hand and a length of tubing in the other. Her boots are muddy. A clean patch on one knee suggests she has recently tried to wipe it with the wrong cloth. She introduces herself while moving a jar to make room for your basket. Behind her, water drips from the corner of a bench into a shallow tray.',
    ),
    n(
      'machine-description',
      'The source of the drip is an arrangement of small bottles, a raised tank, and thin cords running into several pots. A little wooden float hangs against the side of the tank. Every few moments, it lifts, taps a lever, and allows another spoonful of water to escape. The mechanism has the patient confidence of something doing exactly what it was made to do. Unfortunately, most of the water is missing the plants.',
    ),
    s(
      'saoirse-invention',
      'saoirse',
      'guarded',
      'An automatic watering system. It has been automatic in several directions. This is the first version to include the floor.',
      actor('rhys'),
    ),
    n(
      'rhys-return',
      'Rhys comes through the far doorway carrying a tray of seedlings. She stops before the wet stones rather than stepping over them with both hands occupied. Saoirse puts the tubing down and takes the tray. You move your basket out of the path. Between the three of you, the seedlings reach a dry bench before anyone begins explaining the machine.',
    ),
    s(
      'rhys-first-job',
      'rhys',
      'neutral',
      'Turn off the supply first. Then we can look. The plants will wait five minutes. The person who slips on that floor may have less patience.',
      saoirse('tense'),
    ),
    n(
      'supply-off',
      'Saoirse turns the little tap beneath the tank. The float drops, the lever stops, and the room becomes quieter. You had not noticed how much of your attention the repeated tapping was taking. Rhys gives you a cloth and points out the drain. Saoirse starts apologising while you both kneel beside the spill.',
    ),
    s(
      'rhys-intention',
      'rhys',
      'neutral',
      'I gave you this bench for a trial. A trial can fail. What it cannot do is continue running after you know it is putting water somewhere unsafe. We need a stopping rule as well as a starting rule.',
      saoirse('hurt'),
    ),
    n(
      'practical-cleanup',
      'You blot the path while Saoirse empties the catch tray. Neither job requires magic. By the time the stones are dry enough to walk on, the shame in her expression has become concentration. Rhys asks what the invention was meant to make easier. Saoirse answers quickly: the small pots need measured amounts, and reaching the back row strains the person doing the watering.',
    ),
    s(
      'rhys-real-goal',
      'rhys',
      'neutral',
      'Those are useful problems. Keep them. We can change the machine without abandoning the reason for building it.',
      saoirse('neutral'),
    ),
    n(
      'safe-bench',
      'Rhys clears a separate bench for a dry demonstration and goes to settle the seedlings. She gives Saoirse permission to test with empty pots and a catching basin only. Nothing is to be connected to the living plants again until she has checked the result. Saoirse nods, writes the condition down, and moves the tank herself.',
    ),
    decide(
      'watering-method',
      'Saoirse offers you the stool nearest the dry bench. There is time to help with one part before supper. The seed pots you brought are still empty and clean, making them unexpectedly useful.',
      'How will you help her test the invention?',
      [
        {
          id: 'measure',
          label: 'Measure where the water actually goes.',
          hint: 'Use empty pots and a basin to compare the outlets.',
          remember: ['saoirse'],
          journal:
            'I helped Saoirse measure her watering prototype safely with empty pots. We found unequal flow at the outlets.',
        },
        {
          id: 'simplify',
          label: 'Help her try one outlet before rebuilding the whole system.',
          hint: 'Reduce the moving parts and test the stopping rule.',
          remember: ['saoirse'],
          journal:
            'I helped Saoirse simplify her watering prototype to one outlet and a clear stopping rule before testing it again.',
        },
      ],
      [saoirse('guarded')],
    ),
    ...when(
      'arrival:watering-method',
      'measure',
      n(
        'measure-arrangement',
        'You arrange three empty pots in the basin and mark a line inside each with a piece of chalk. Saoirse sets the tank at its original height. At your signal, she opens the supply for the same short interval at each outlet. The first pot fills beyond the mark. The second barely reaches it. The third receives a slow, stubborn drip. You repeat the trial after swapping the pots so neither of you can blame a difference in their shape.',
      ),
      s(
        'measure-saoirse',
        'saoirse',
        'tense',
        'I measured how much left the tank. I did not measure how much arrived at each plant. That is an impressively inconvenient distinction to have missed.',
        actor('rhys'),
      ),
      n(
        'measure-finding',
        'There is a kink in the tubing to the last pot. Straightening it improves the flow, but does not make the three amounts equal. Saoirse wants to adjust the height of the tank. You suggest recording the result before changing another thing. She hesitates, then hands you the pencil. You write down the kink, the three amounts, and the fact that the first correction did not solve everything.',
      ),
      s(
        'measure-ownership',
        'saoirse',
        'warm',
        'Put your name on that page too. You have done more than hold a pot. If this becomes useful, I do not want to remember the useful parts as things I thought of alone.',
        actor('rhys'),
      ),
      n(
        'measure-stop',
        'The next run stops as soon as the first pot reaches its mark. It leaves the others short of water, but nothing overflows. You now have a safe failure to work from. Saoirse circles that phrase in the notes, then adds a drawing of the three outlets. The drawing is not decorative. For the first time, you can see exactly which part of her idea has been tested.',
      ),
    ),
    ...when(
      'arrival:watering-method',
      'simplify',
      n(
        'simplify-resistance',
        'You point to the nearest outlet and suggest disconnecting the other two. Saoirse looks at the network of tubing she has spent the afternoon arranging. For a moment you think she will refuse. Then she asks you to hold the tank while she removes the extra lines. The simpler arrangement leaves an unexpectedly large space on the bench, as if the machine has taken off a heavy coat.',
      ),
      s(
        'simplify-saoirse',
        'saoirse',
        'guarded',
        'I wanted it to help with a whole row. One pot feels like going backwards. I know that is not an argument about whether it works. I am telling you why I made that face.',
        actor('rhys'),
      ),
      n(
        'simplify-rule',
        'With one empty pot in the basin, you agree on a stopping rule before turning the tap. If the water reaches the chalk line, if a tube slips, or if either of you says stop, the supply closes. Saoirse repeats the rule back to make sure you mean the same thing. The first run fills the pot unevenly but stays inside the basin. On the second, you say stop early just to check the rule is usable.',
      ),
      s(
        'simplify-response',
        'saoirse',
        'amused',
        'That was extremely unexciting. I think it may be the best thing this machine has done all day.',
        actor('rhys'),
      ),
      n(
        'simplify-finding',
        'The float catches once against the side of the tank. With the other outlets removed, you both see it happen. Saoirse marks the contact point with chalk and writes a possible change beneath it. She does not make the change immediately. First you repeat the same run to find out whether the catch happens twice. It does. An irritating little motion has become something you can describe.',
      ),
    ),
    n(
      'rhys-review',
      'Rhys returns when the supper bell is still a distant possibility. She reads the test page, checks the basin, and asks each of you what you would do if the next trial went wrong. Saoirse answers before you can: turn off the supply, move the living plants out of reach, and record what happened before adjusting anything. Rhys nods and gives permission for another supervised test tomorrow.',
    ),
    s(
      'rhys-assessment',
      'rhys',
      'neutral',
      'The invention is not ready for the plants. Your method is ready for another trial. Those are different judgements, and the second one is good progress.',
      saoirse('warm'),
    ),
    n(
      'seed-pots-finished',
      'You rinse the borrowed pots and return them to the basket. Saoirse writes TEST POTS on a scrap of card, then asks Rhys whether they may remain on the trial bench. The answer is yes. Your errand is finished in a way Noor could not have predicted: the pots have found a job, the floor is dry, and a failed machine has acquired a notebook.',
    ),
    s(
      'saoirse-future',
      'saoirse',
      'warm',
      'If you come back, I can show you what changed. You do not have to become my assistant. I am trying to learn the difference between inviting someone and handing them the other end of a complicated problem.',
      actor('rhys'),
    ),
    n(
      'saoirse-packing',
      'She starts putting tools away while you gather your bag. The face in the nearest root pot appears no more pleased than before. Saoirse sets its saucer straight with the end of a pencil and tells it, very quietly, that this time the criticism was justified. The root offers no opinion. You are glad. The afternoon has contained enough opinions to be useful already.',
    ),
  ]),
  ...secondDay('second-supper', 'What you bring back', 'lantern-hall', 2, [
    n(
      'return-to-supper',
      'On the way to supper, you realise that you have been outside long enough for the air to cool. The hall windows are bright. You know which door opens most easily and where to leave the basket until Noor can collect it. The academy has not become familiar all at once. It has acquired a few reliable edges: a dry path around a pool, a stop tap, a chair that will probably be empty.',
    ),
    n(
      'receipt-followup',
      'Grey finds you before you sit down. He has the lantern report in his work pad. Nothing in the fitting was broken, he says, and the ordinary relighting charm did not catch. He has asked the warding teachers to examine it next. You ask whether the red ribbon should stay up. It should. He shows you the added date and signs beneath the update while you watch.',
    ),
    s(
      'grey-promise-kept',
      'grey',
      'neutral',
      'I said I would tell you what I found. This is what I found. If you think of a detail later, bring it to me; you do not have to decide whether it matters before I hear it.',
      actor('rowan', 'neutral'),
    ),
    n(
      'receipt-copy',
      'You copy his sentence into your notebook rather than trying to improve it. No broken fitting. Usual charm did not catch. Warding review requested. There is no dramatic discovery hiding in the words. There is a person returning to a promise. When Grey goes back to his trolley, Rowan reads the update beside you and looks less as though he is waiting to be blamed.',
    ),
    s(
      'rowan-day',
      'rowan',
      'warm',
      'How was the rest of your day? I would like to hear about a problem that involved something other than that lantern.',
      actor('imogen', 'attentive'),
    ),
    n(
      'day-account',
      'You tell him about the underwater windows, the notice, and the watering machine. Imogen arrives halfway through the account and asks whether the measurements were written down. Saoirse, following her with a plate, answers that question herself. She has kept the notebook in her pocket instead of putting it back in the workshop. There is a small damp mark on its cover, but the pages are dry.',
    ),
    ...when(
      'arrival:watering-method',
      'measure',
      s(
        'measure-supper',
        'saoirse',
        'amused',
        'Three outlets, three different amounts, one very confident inventor. We have reduced the confidence to a level appropriate for the measurements.',
        actor('imogen', 'amused'),
      ),
    ),
    ...when(
      'arrival:watering-method',
      'simplify',
      s(
        'simplify-supper',
        'saoirse',
        'amused',
        'It currently waters one empty pot under close supervision. I am describing this as a promising reduction in the number of people who need a mop.',
        actor('imogen', 'amused'),
      ),
    ),
    n(
      'noor-note-return',
      'Noor comes to collect the basket and finds the card explaining where the pots stayed. She reads it, folds it once, and puts it with her letters. You tell her that the first study notice has a day on it now. Idris has already checked, she says. He has also offered a stack of scrap paper for written questions. The arrangement has begun to move beyond the three people who made it.',
    ),
    ...when(
      'arrival:common-room-rule',
      'quiet',
      s(
        'quiet-supper',
        'noor',
        'neutral',
        'The singers chose a different hour. Someone asked whether they can bring knitting to the quiet half. I said yes, unless the knitting sings. Apparently that is a reasonable thing to check here.',
        actor('imogen', 'amused'),
      ),
    ),
    ...when(
      'arrival:common-room-rule',
      'welcome',
      s(
        'welcome-supper',
        'noor',
        'neutral',
        'Two new people asked where to leave their bags. Because the notice said they could ask, they did. I think that counts as the instructions working.',
        actor('imogen', 'warm'),
      ),
    ),
    n(
      'shared-table',
      'The table needs rearranging to fit everyone. Rowan begins to move a stack of books, and Imogen removes the bottom one before it can escape. You shift along the bench. Saoirse sits with her boots tucked out of the way. Noor stays long enough to finish her cup. Nobody asks for a report on which house has acquired the most promising new student. People ask for bread, the pencil, and room for one more plate.',
    ),
    n(
      'calendar-notes',
      'After supper, you open your timetable on the cleared end of the table. The first Kindle practical is on the fourth of September, two mornings away. You circle it and write bring lantern beside the date. The open study visit has its own line, because it is an invitation and you may decide whether to go. Keeping the two kinds of entry separate makes the week look less like a series of tests you could accidentally fail.',
    ),
    n(
      'quiet-goal',
      'Your first-night sentence is still on the page behind it. You do not cross it out or improve the handwriting. Today you asked for directions, helped people make two plans more usable, and returned an errand with a note explaining where its contents had gone. None of those things answers why the hall lantern went dark. They give you people to stand beside while you find out.',
    ),
    n(
      'opening-next-step',
      'When the hall begins to empty, the red ribbon is still visible above the table. You leave it alone. The next useful step is already arranged: teachers will examine that lantern, and you will bring your own to a classroom where someone can show you how to light it. For tonight, the notebook closes. You know the way back to your room.',
    ),
  ]),
  ...section(
    'study-hour',
    'An invitation kept',
    'heronmere',
    [
      n(
        'study-arrival',
        'On Thursday, you follow the invitation you helped write. Noor is waiting beside the Heronmere door with a tray of cups. There is a new version of the notice at eye level. The day and time are underlined. Idris has put the spare paper where a person can reach it without asking him to move. You recognise your contribution in the arrangement, but it no longer belongs only to you.',
      ),
      ...when(
        'arrival:common-room-rule',
        'quiet',
        n(
          'study-quiet-start',
          'The first half hour begins with a soft announcement and no bell. Noor turns a small sand glass where everyone can see it. You choose a window seat and spread out your timetable. Around you, pages turn, a pencil falls, and somebody whispers an apology before remembering that the notice did not demand perfect silence. Idris answers a question on a scrap of paper and slides it back across the table.',
        ),
        n(
          'study-quiet-payoff',
          'You use the time to compare your route to the classroom with the map Rowan marked. The library door is where Imogen put the dot. The fountain is still not a staircase. When the sand runs out, Noor invites conversation. Two people keep reading near the windows, and nobody asks them to explain themselves. The arrangement is not silent in every corner or ideal for every person. It is close enough to what the notice promised that you can decide what to do next.',
        ),
        s(
          'study-quiet-noor',
          'noor',
          'neutral',
          'I was worried that announcing the change would feel officious. It turns out people like knowing whether the person beside them is ready to be interrupted.',
          idris(),
        ),
      ),
      ...when(
        'arrival:common-room-rule',
        'welcome',
        n(
          'study-welcome-start',
          'Noor points each arrival toward the bags, cups, and unoccupied seats. The instructions take less than a minute. A student you have not met asks whether they can sit by the windows without joining the main conversation. Noor shows them a chair and leaves the reason unasked. You put your timetable on the larger table, where Idris is comparing classroom routes with another new arrival.',
        ),
        n(
          'study-welcome-payoff',
          'At first, people keep turning to Noor to ask permission for small things. Can they move a cup, use the scrap paper, fetch another chair? She answers, then points back to the notice. By the time the second pot of tea arrives, people are helping one another find what they need. The room has acquired a routine that does not require the host to stand at its centre. You check your classroom route with Idris and find that both of you had mistaken the same mark for a staircase.',
        ),
        s(
          'study-welcome-noor',
          'noor',
          'neutral',
          'I have managed to sit down at my own event. I should have put that in the original plan.',
          idris(),
        ),
      ),
      n(
        'study-small-revision',
        'The person with the sore knee asks for the paper tray to be moved to the lower table. Idris moves it before beginning to explain why the first position seemed convenient. Then he stops explaining. The new position works better. You add a small arrow to the notice so the next visitor can find it. One revision does not mean the plan failed; it means someone used it long enough to notice what needed changing.',
      ),
      s(
        'study-idris',
        'idris',
        'neutral',
        'We should write down what worked, too. Otherwise next week we will remember only the tray and spend twenty minutes solving it again.',
        noor(),
      ),
      n(
        'study-finish',
        'When the visit ends, you help return the chairs without turning it into a competition for who can carry most. Noor keeps the annotated notice for the next host. Idris takes his cardboard staircase back to the table by the window. You leave with a checked route to tomorrow’s practical and a little more evidence that an academy is made from arrangements people can understand, use, and change. Your lantern is waiting in your room. This time, you know why it is still unlit.',
      ),
    ],
    1,
  ).map((beat) => ({ ...beat, section: { ...beat.section, date: '2026-09-03' } })),
];
