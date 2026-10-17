import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
const r = (emotion = 'neutral') => actor('rowan', emotion);
const g = (emotion = 'neutral') => actor('grey', emotion);
const o = (emotion = 'neutral') => actor('okoro', emotion);

export const bloomRehearsal = [
  ...section(
    'wrong-hour',
    'An invitation that can be accepted',
    'warding-hall',
    [
      n(
        'may-hall',
        'By the first of May, the practice cards have reached places you would not have thought to put them. One has a tea stain from the kitchens. Another has been folded small enough to fit in a tool pouch. They return to Warding Hall with questions written on the backs. Some people want to try a light. Some want to watch. One has asked whether the session can begin at a time when they are not repairing the door everybody uses to reach it.',
      ),
      n(
        'grey-card',
        'That last card belongs to Grey. He brings it himself, together with a short list of jobs that cannot be abandoned halfway through. He has not come to oppose the rehearsal. He wants to know whether accepting the invitation requires pretending his work does not exist. Rowan, who helped choose the time, looks from the card to the clock.',
        [g('attentive'), r('grave')],
      ),
      s(
        'grey-time',
        'grey',
        'attentive',
        'I can be here before the meal service, or after the next keeper takes over. I cannot be in two places in the middle. There is no virtue in leaving a door half fastened so I can stand in a circle about looking after people.',
        r('grave'),
      ),
      s(
        'rowan-missed',
        'rowan',
        'small',
        'I checked the student timetable. I thought that was checking the time. I should have asked you before the cards went out.',
        g('attentive'),
      ),
      n(
        'okoro-arrives',
        'Okoro joins you beside the practice stands. He introduces himself as Kestrel’s colleague and today’s rehearsal lead. Kestrel will record the connection tests; he will watch how the arrangement works for the people using it. He asks Grey how much time he can comfortably give, and writes that answer down before suggesting any solution.',
        [o(), g('attentive')],
      ),
      s(
        'okoro-scale',
        'okoro',
        'warm',
        'A small rehearsal at a usable hour will teach us more than a large one people cannot attend. We can move the first practice earlier, or divide it into two groups with a proper handover. Both need a clear notice. Neither needs anybody to apologise for having a job.',
        g('attentive'),
      ),
      n(
        'noor-answer',
        'Noor arrives carrying a card with its answer still blank. She says she would like to watch this afternoon and decide about a later practice. Rowan starts to tell her that she will be good at it, then catches the assumption and asks where she would like to sit instead. She chooses a place near the door, where she can leave for a letter she is expecting.',
      ),
      s(
        'noor-observes',
        'noor',
        'neutral',
        'I want to see the whole exercise before I decide. Including the part where somebody stops. The invitation says that is allowed; I would like to see what it looks like.',
      ),
      ...when(
        'thaw:rejoining',
        'signal',
        n(
          'signal-rehearsal',
          'The practice card carries the readiness signal you tried with Imogen. Okoro asks the group to choose an equivalent spoken word for anyone whose hands will be occupied. You add it beside the drawing. The signal is a way to hear an answer, not a test people must perform before being welcome.',
        ),
      ),
      ...when(
        'thaw:rejoining',
        'space',
        n(
          'space-rehearsal',
          'The quiet practice time you put on the card has brought two people who did not want to answer in front of a crowd. Okoro keeps the place near the opening clear and tells them who to ask when they are ready. He does not keep looking over to check whether they have decided yet.',
        ),
      ),
      ...when(
        'thaw:rejoining',
        null,
        n(
          'practice-card-legacy',
          'Okoro reads the practice card aloud: watching is welcome, a person may stop, and nobody is committed to the Midsummer ritual by coming today. He asks everyone to agree on a clear readiness signal before the first attempt. The arrangement begins with the people present, not with an assumption about earlier lessons.',
        ),
      ),
      decide(
        'rehearsal-plan',
        'Grey’s available times leave two workable arrangements. An earlier, shorter practice can finish before service begins. Two small groups can use the original period and meet through a handover. You will help carry the correction to the people who received the first card.',
        'How will you adjust the rehearsal?',
        [
          {
            id: 'earlier',
            label: 'Move the first practice earlier and keep it short.',
            journal:
              'For Bloomtide we moved the first rehearsal before the service work and kept its scope small enough to finish on time.',
            remember: ['grey', 'okoro', 'rowan', 'noor'],
          },
          {
            id: 'relay',
            label: 'Use two small groups with an explicit handover.',
            journal:
              'For Bloomtide we split the rehearsal into small groups with a handover so participants could attend around their work.',
            remember: ['grey', 'okoro', 'rowan', 'noor'],
          },
        ],
        [o(), g('attentive')],
      ),
      ...when(
        'bloom:rehearsal-plan',
        'earlier',
        n(
          'earlier-arranged',
          'You mark the new time and the shorter task on a fresh card. Rowan takes copies to the original notice places while you tell the people already waiting. Grey checks the revised finish against his work list and says yes. Okoro removes the second connection exercise from today’s plan. A shorter session needs less work in it, not faster instructions.',
        ),
      ),
      ...when(
        'bloom:rehearsal-plan',
        'relay',
        n(
          'relay-arranged',
          'You draw two small groups on the planning sheet and leave a line between them for the handover. Rowan checks who can attend which one. Grey joins the later group after his work is covered. Okoro keeps the first group’s observer for the opening of the second, so the next attempt can use what the previous one learned.',
        ),
      ),
    ],
    1,
  ),
  ...section(
    'rehearsal-release',
    'What happens when someone stops',
    'warding-hall',
    [
      n(
        'five-stands',
        'Five practice lamps stand inside a broad open curve. The people beside them have different levels of experience. One flame is almost as small as the match that lit it; another has to be reduced twice before its owner stops trying to make it impressive. Okoro checks that each person can keep their own light steady without joining anything. Kestrel watches from outside the curve with the record board.',
      ),
      s(
        'okoro-first-round',
        'okoro',
        'neutral',
        'First we will join one at a time. Then I will ask for a planned release. Keep enough attention for your own lamp. The person who stops is doing the exercise with us.',
        r(),
      ),
      n(
        'rowan-ready',
        'Rowan stands next to you. His light is small and steady, but his free hand keeps smoothing the edge of his sleeve. When you look over, he smiles too quickly. There is no time for a private conversation in the middle of instructions. You ask whether he wants the first turn or the second. He chooses the second and seems relieved to have been asked a question he can answer.',
      ),
      n(
        'join-in-order',
        'The first light joins. You wait for the agreed response before offering yours, then feel the little change as Rowan answers. By the fifth light, the warmth has become a shared presence without becoming a wall. There is still room at the opening. Noor watches from her chosen seat, her unanswered card lying flat on her knee.',
      ),
      n(
        'planned-release',
        'Okoro asks one participant to leave. The departing light separates cleanly, but the remaining four waver. Someone tries to compensate by brightening; another tightens the curve. Rowan’s flame rises sharply. Okoro calls the stop. Everyone lowers their hands. Five separate lamps remain on five separate stands.',
      ),
      s(
        'okoro-observation',
        'okoro',
        'neutral',
        'The release was clean. Our response to it needs work. Several people tried to fill the empty place without being asked. Let us find out what each of you thought was happening.',
        r('grave'),
      ),
      n(
        'different-explanations',
        'The answers differ. One person thought the gap meant the exercise had failed. Another believed the group needed exactly five lights to be strong. Rowan says he felt a drop in warmth and tried to hold it up. Kestrel writes those answers separately. A single instruction to “try harder” would have missed every actual problem.',
      ),
      s(
        'rowan-correction',
        'rowan',
        'grave',
        'I thought that if I could give a little more, nobody would have to stop. I know you said stopping was part of it. I heard that until it happened.',
        o(),
      ),
      s(
        'okoro-retry',
        'okoro',
        'warm',
        'Then this time we expect the warmth to change. Let it become a four-person connection. We are testing whether it can adapt, not whether five people can pretend to be five forever.',
        r(),
      ),
      n(
        'second-round',
        'On the second round, everyone knows whose departure to expect. The light separates, and the circle grows quieter. Rowan lets his own flame remain small. The warmth settles at a different strength. It does not feel identical to the first arrangement. It feels stable enough for the people who are actually there.',
      ),
      n(
        'noor-sees-answer',
        'Noor asks whether the departing person may return. Okoro makes room for the invitation, and the fifth light comes back after an answer. Then Noor folds her card and says she would like to try a later session. She is still leaving now for her letter. Nobody treats that departure as a loss the circle must prevent.',
      ),
      ...when(
        'bloom:rehearsal-plan',
        'earlier',
        n(
          'earlier-payoff',
          'The shorter practice ends at the time you wrote on the card. Grey checks the clock, puts away his lamp and reaches the service door before the next job begins. He tells you that he can attend another session if it keeps the same promise. The finished record includes the successful release and the fact that the schedule worked.',
        ),
      ),
      ...when(
        'bloom:rehearsal-plan',
        'relay',
        n(
          'relay-payoff',
          'At the handover, the observer explains the mistake about compensating for the departing light. The second group starts with a planned change in warmth and reaches a stable release sooner. Grey arrives after his work is covered and takes his place without an apology. The two groups have made one useful rehearsal without all having to stand together at the same time.',
        ),
      ),
      n(
        'record-taken',
        'Kestrel takes the results to the staff meeting. Okoro leaves the practice stands out for the next supervised session and asks you to carry only the cooled lamps. Rowan picks up two, then puts one back so he can hold the other securely. It is a small decision. You notice it because of what happened in the curve.',
      ),
    ],
    1,
  ),
];
