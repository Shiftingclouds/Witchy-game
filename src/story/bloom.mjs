import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
import { bloomRehearsal } from './bloom-rehearsal.mjs';
const r = (emotion = 'neutral') => actor('rowan', emotion);
const i = (emotion = 'neutral') => actor('imogen', emotion);
const a = (emotion = 'neutral') => actor('saoirse', emotion);

export const bloomScene = {
  id: 'bloom',
  chapter: 6,
  beats: [
    ...bloomRehearsal,
    ...section(
      'rowan-afterwards',
      'When helping becomes hiding',
      'lantern-hall',
      [
        n(
          'bloom-evening',
          'By supper, flowers have appeared along the tables under the hanging lamps. The round window holds a violet edge of evening above the lake. You find Rowan at a place near the end of a bench, arranging cups that are already straight. He moves one towards you before you ask. For once there is no story ready to fill the moment after you sit down.',
        ),
        s(
          'rowan-starts',
          'rowan',
          'small',
          'I knew the practice was meant to include somebody leaving. When it happened, all I could think was that everyone would feel the difference. I wanted to stop them feeling it. That sounds kind until you notice I had decided what they were allowed to feel.',
          a('attentive'),
        ),
        n(
          'privacy-made',
          'Saoirse sets a covered plate beside him, asks whether the two of you want a little room, and takes her own cup farther down the table when Rowan says yes. He watches her go. Nobody has been pushed away. The conversation has simply become small enough for what he wants to say.',
          [r('grave')],
        ),
        s(
          'rowan-fear',
          'rowan',
          'grave',
          'If I am the one making people comfortable, I know what I am for. If I am frightened or tired, somebody else has to do something about me. I keep thinking that means I have failed before we even get to June.',
        ),
        n(
          'ordinary-evidence',
          'His plate is still covered. You remember him asking whether you had eaten after the stones, making room at the first supper, and choosing the second turn in today’s practice. None of those moments required him to be the whole source of warmth. It is harder to say that in a way he can use than to tell him everything will be fine.',
        ),
        decide(
          'rowan-support',
          'Rowan has named something he usually hides under helpfulness. You can make a specific agreement to share the work, or stay with the feeling before either of you turns it into another task.',
          'What will you offer him?',
          [
            {
              id: 'share',
              label: 'Agree on a clear way to ask each other to take over.',
              journal:
                'At Bloomtide Rowan told me he fears failing people when he needs help. We agreed on a simple request to take over one small task.',
              remember: ['rowan'],
            },
            {
              id: 'stay',
              label: 'Stay with him without asking him to fix the feeling.',
              journal:
                'At Bloomtide Rowan told me he fears failing people when he needs help. I stayed with him without requiring him to turn the feeling into useful work.',
              remember: ['rowan'],
            },
          ],
          [r('grave')],
        ),
        ...when(
          'bloom:rowan-support',
          'share',
          n(
            'share-agreement',
            'You suggest a request small enough to say while things are happening: “Can you take this part?” The answer can be yes, no, or a different offer. Rowan tries it on the covered plate. Can you pass it closer while he puts the cups down? You do. He laughs at how ordinary the first example is, then finally begins eating.',
          ),
          s(
            'share-response',
            'rowan',
            'warm',
            'I can remember that. I do not have to wait until I am in trouble impressive enough to deserve help. You can ask me as well. I would like to learn the part where helping is an answer, instead of something I do before anyone has spoken.',
          ),
        ),
        ...when(
          'bloom:rowan-support',
          'stay',
          n(
            'stay-company',
            'You tell him there is no task he has to find for you. For a while you sit with the covered plate between you and listen to the hall. Rowan starts to make a joke, stops, and lets the pause remain. When he eventually uncovers supper, he offers you a piece of bread because he wants to share it, not because the quiet needs repairing.',
          ),
          s(
            'stay-response',
            'rowan',
            'warm',
            'I thought you might be disappointed if there was nothing clever under it. There is just me being afraid of letting people down. Thank you for letting that be enough to say.',
          ),
        ),
        n(
          'rowan-returns',
          'The meal does not solve the fear. It gives the two of you a different way to be with it. When Saoirse looks over, Rowan waves her back with his cup. He asks about her lamp without pretending the conversation you have just had was nothing. It can remain private without having to disappear.',
        ),
      ],
      2,
    ),
    ...section(
      'imogen-record',
      'A name with somewhere to stand',
      'lantern-hall',
      [
        n(
          'register-arrives',
          'Imogen arrives with a bound working register and a sheet protecting its new cover from the supper table. Maelin and Dunne have checked the source references. Grey has read the descriptions of the work. The names are not arranged by rank or by brightness of magic. Each recovered person has the record that supports their place, and a blank margin where later corrections can be added.',
        ),
        s(
          'imogen-nearly-stopped',
          'imogen',
          'grave',
          'There was a week in February when every reference seemed to point to another reference. I thought perhaps we were making the story larger because we did not want to admit we could not finish it. I nearly put the notebook away for good.',
          r('grave'),
        ),
        n(
          'why-she-returned',
          'She turns to one of the working entries. The person described there kept the return lamp lit for people who finished after the formal gathering. It is a modest piece of work, repeated often enough that someone else could depend on it. Imogen says that this was the entry she reread when she could no longer bear the thought of another grand explanation.',
        ),
        s(
          'imogen-small-work',
          'imogen',
          'warm',
          'I could check one reference. I did not have to understand the whole year before doing that. Maelin checked the next one with me. Then there were two things we actually knew.',
          r('warm'),
        ),
        ...when(
          'register:correction',
          'private',
          n(
            'private-correction-return',
            'When Rowan goes to fetch a spare place mat, Imogen quietly thanks you again for the private space you gave her before correcting the early claim. She has used that lesson while helping another student revise a contribution: time to think first, then a clear public change. She does not tell the table the details of your earlier conversation.',
          ),
        ),
        ...when(
          'register:correction',
          'together',
          n(
            'table-correction-return',
            'Imogen has included a short correction note with the register. She says the supported correction you made together at the reading table helped her separate being wrong about a claim from being unwelcome in the work. The note describes what changed and why. It has no ornamental apology attached.',
          ),
        ),
        ...when(
          'register:correction',
          null,
          n(
            'correction-legacy-return',
            'A correction note travels with the register. It distinguishes the supported omissions from claims about motive that the sources cannot establish. Imogen says she wants the next reader to know both what the group found and what it had to revise. The record should not require them to repeat every early mistake.',
          ),
        ),
        n(
          'living-names',
          'The current participant list is kept separately. People have written how they wish to be named, whether they want to practise, and which task they have actually accepted. A person who is watching has not been counted as a caster. A person who offered to carry a lamp has not been promised a place at its centre. Imogen has left room for people to change their answer.',
        ),
        s(
          'imogen-lightness',
          'imogen',
          'amused',
          'It is a very fine book. I intend to spill nothing on it for at least three days. After that, I make no promises. It will have to learn what being used involves.',
          r('amused'),
        ),
        n(
          'register-set-down',
          'She closes it and moves it to a dry place beside the wall. Then she sits down with both hands free. The book has work to do later. For the length of supper, it can simply be finished enough to put down.',
        ),
      ],
      2,
    ),
    ...section(
      'saoirse-finished',
      'The invention that is ready',
      'lantern-hall',
      [
        n(
          'lantern-on-table',
          'Saoirse’s lantern is waiting under a cloth. When the plates have been moved, she lifts the cover with less flourish than you expected. The frame is small. The moving parts fit inside it without protruding hooks. The observation cover folds away, and the handle has room for a gloved hand. A small card names the people who contributed to its care and construction.',
        ),
        s(
          'saoirse-no-joke',
          'saoirse',
          'warm',
          'It works. I had several better ways of saying that, but they all made it sound as if there was a flaw I could laugh at before you found it. There are things I would change in a second version. This one does the job it is meant to do.',
          i('warm'),
        ),
        n(
          'test-completed',
          'She demonstrates the cover, the catch and the steady reference light. The instructions include where to stop using it and whom to ask about a fault. Delphine has checked the cleaning method; Rhys has checked that no living plant needs to be taken apart to supply it. The lantern can carry an offered echo briefly. It cannot tell a person’s whole story or decide whether anyone belongs.',
        ),
        ...when(
          'emberfall:work-plan',
          'simple',
          n(
            'plain-design-return',
            'The removable cover keeps the simple fastening you chose at Emberfall. Saoirse has improved its edge without adding another mechanism. She says it was difficult to leave the working idea alone. Then she lets the cover close cleanly and permits that small success to stand.',
          ),
        ),
        ...when(
          'emberfall:work-plan',
          'shared',
          n(
            'shared-design-return',
            'The adjustable cover grew out of the single demonstration frame you kept in the shared Emberfall plan. Its larger handle answers the problem you found in winter gloves. Saoirse shows the change, then credits the plain spare that let the lake reading continue while the idea still needed work.',
          ),
        ),
        ...when(
          'emberfall:work-plan',
          null,
          n(
            'design-legacy-return',
            'Saoirse shows you how the cover can be handled in gloves and removed for cleaning. She names the people who tested those details with her. The design has a history even where your own record does not contain the earlier choices. You can judge what it does now.',
          ),
        ),
        s(
          'saoirse-place',
          'saoirse',
          'attentive',
          'It needs a useful place at Midsummer. Grey could put it at the hall landing for people arriving after the first group goes down. Or Kestrel could use it at the outer practice station so newcomers have a steady light while they decide. I have checked with both of them. I am not volunteering anyone without asking this time.',
          i('amused'),
        ),
        decide(
          'lantern-use',
          'Both uses have a willing keeper and a clear job. The lantern will help people reach or understand the gathering; it will not replace their own offered light. Saoirse wants your view before choosing where to place the first finished one.',
          'Where should the lantern work first?',
          [
            {
              id: 'welcome',
              label: 'Give it to Grey for the hall landing and later arrivals.',
              journal:
                'At Bloomtide Saoirse and I chose Grey’s hall landing for the finished lantern, helping later arrivals find the Midsummer gathering.',
              remember: ['saoirse', 'imogen'],
            },
            {
              id: 'handover',
              label: 'Use it at Kestrel’s outer practice station.',
              journal:
                'At Bloomtide Saoirse and I chose Kestrel’s outer practice station for the finished lantern, giving newcomers a steady reference before joining.',
              remember: ['saoirse', 'imogen'],
            },
          ],
          [a('attentive'), i('warm')],
        ),
        ...when(
          'bloom:lantern-use',
          'welcome',
          s(
            'welcome-lantern-plan',
            'saoirse',
            'warm',
            'Then I will give Grey the instructions as well as the lamp. We can practise the cover together tomorrow. A welcome is more useful if the person keeping it can change the wick.',
            i('warm'),
          ),
        ),
        ...when(
          'bloom:lantern-use',
          'handover',
          s(
            'handover-lantern-plan',
            'saoirse',
            'warm',
            'Then I will ask Kestrel where it should stand and do a handover before the next practice. Somebody who did not build it should be able to use it without me leaning over their shoulder.',
            i('warm'),
          ),
        ),
        n(
          'finished-put-away',
          'Saoirse puts the cover back over the lantern. She leaves it alone. You realise you have seen her demonstrate inventions, apologise for them, defend them and think of improvements while someone else was still speaking. Seeing her allow one to be finished feels like meeting a new expression on a familiar face.',
        ),
      ],
      2,
    ),
    ...section(
      'table-before-june',
      'The people who will be there',
      'lantern-hall',
      [
        n(
          'table-grows',
          'The table gathers people in uneven waves. Grey stops long enough to confirm the next practice time. Noor returns with a letter she will read privately later. Someone brings the last dish of pudding, and someone else asks why there are still five clean spoons when six people are waiting. The small discrepancy receives more immediate argument than the mysteries of the Heartfire.',
        ),
        s(
          'rowan-last-spoon',
          'rowan',
          'amused',
          'I can find another. Before anyone offers to divide one spoon by magic, let me try the cupboard.',
          i('amused'),
        ),
        n(
          'supper-room',
          'He returns with two, in case somebody else arrives. Imogen gives up trying to keep a page-sized clear space beside her plate. Saoirse begins explaining a new handle design, stops at your look, and says it belongs to tomorrow. There is enough happening at the table without making every moment produce something.',
        ),
        n(
          'clear-next-steps',
          'The next rehearsal is on the calendar. The source record is checked. The final participation list will be confirmed again in June. Kestrel and Okoro will prepare the Heartfire approach and the supervised connection. Tully will keep the arrival route running. Grey will check the ordinary lamps. Each promise is small enough to know whether it has been kept.',
        ),
        s(
          'imogen-before-june',
          'imogen',
          'warm',
          'We can still be frightened. I checked the notes; there is nothing in the inscription requiring universal confidence.',
          r('warm'),
        ),
        s(
          'rowan-before-june',
          'rowan',
          'warm',
          'Good. I have been saving some for the occasion.',
          i('amused'),
        ),
        n(
          'what-school-gave',
          'The lamps overhead have not all recovered. The Heartfire still needs the work you have been preparing to do. Yet the year has already changed the way this table works: a corrected claim can remain in the conversation, a request for help can be answered, and a finished thing can be shared. Those changes will not make the ritual unnecessary. They are part of what makes it possible.',
        ),
        n(
          'bloom-exit',
          'Your friends wait while you find the words you want. You can thank them for the home they have helped make, or turn that gratitude towards the people who will arrive after you. The next chapter will ask you to act on it. Tonight there is still time to pass the pudding.',
          [r('warm'), i('warm')],
        ),
      ],
      2,
    ),
  ],
};
