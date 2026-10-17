import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
import { longnightShore } from './longnight-shore.mjs';
const a = (emotion = 'neutral') => actor('saoirse', emotion);
const t = (emotion = 'neutral') => actor('tully', emotion);
const k = (emotion = 'neutral') => actor('kestrel', emotion);

export const longnightScene = {
  id: 'longnight',
  chapter: 4,
  beats: [
    ...longnightShore,
    ...section(
      'what-remains',
      'What the school would lose',
      'tully-cottage',
      [
        n(
          'warm-return',
          'The kettle is still warm under its cover. Tully makes fresh tea anyway, giving the water time to heat while you put away the instrument. Saoirse wraps both hands around her mug without drinking. Kestrel waits until you have loosened your gloves and can move your fingers comfortably. Then she unfolds the survey she brought from the academy.',
        ),
        s(
          'stone-and-wood',
          'kestrel',
          'grave',
          'The tower, the hall, the dormitories: stone and wood. Okoro and I have checked the protective wards, and Grey has the building reports. The crack you saw was in the remembered reflection. It does not mean the wall is breaking. We are dealing with the welcome held by the Heartfire.',
          a('scared'),
        ),
        s(
          'what-welcome-means',
          'saoirse',
          'scared',
          'That sounds smaller when you say it like that. I do not think it is smaller. The first night I came here, I knew where to turn before I could read the signs. I thought that was just what finding a home felt like.',
          k('grave'),
        ),
        s(
          'separate-loss',
          'kestrel',
          'neutral',
          'Part of it was people making a home with you. That remains within our power. Part was the old welcome answering through the lamps: warmth recognising a place kept for you. If it fails, a lamp will still light a path. It will no longer carry that answer.',
          a('attentive'),
        ),
        n(
          'tully-example',
          'Tully turns his mug so the chipped side faces away. He says the shore lamps once changed when a tired traveller came around the headland: the light grew steadier, easier to follow without growing harsh. Lately, he has had to watch the turn more carefully himself. He had thought the first missed answer was weather. Then it happened on a clear night.',
        ),
        s(
          'people-still-wait',
          'tully',
          'neutral',
          'We can keep meeting people. We can put a coat over a cold shoulder and carry the bag. I mean to. I would still like to keep what those who came before us made for that work.',
          k(),
        ),
        n(
          'survey-lines',
          'Kestrel’s survey has three sets of measurements: early autumn, after Emberfall, and this week. She explains the scale before showing the result. Each measures the welcome’s response to the same small offered light, with the ordinary lamp tested separately. The response has weakened at every set. Your lake reading adds a surviving example of how the older lights joined, rather than another measurement of their present strength.',
        ),
        s(
          'midsummer-cycle',
          'kestrel',
          'neutral',
          'The annual renewal is at Midsummer, the twenty-first of June. Moth found the old cycle records; my measurements agree with the decline recorded before earlier renewals. This time the reserve is too weak to carry another turn unaided. We need to restore the shared welcome before that renewal passes.',
          a('attentive'),
        ),
        n(
          'calendar-date',
          'You find the date on the corner of the survey: 21 June, 2027. Six months away. It is far enough to contain lessons, meals, mistakes, and work that cannot be completed tonight. It is close enough to write on the first page of the investigation. You draw a box around it, leaving space below for what must happen before then.',
        ),
        s(
          'not-a-night',
          'saoirse',
          'attentive',
          'So we have a date. We do not have to make the whole answer before we go to bed. I would have tried. I am telling you because I would have tried.',
          k(),
        ),
        s(
          'adult-work',
          'kestrel',
          'neutral',
          'Honoria is organising the academy’s response. Okoro and I will keep the working wards sound. Hask and Moth are checking the older accounts. Tully will keep the arrival routes running. Your part is to help us understand the small lights and the people who offered them. That is real work. It is not the whole burden.',
          a('attentive'),
        ),
        n(
          'names-of-tasks',
          'You write the tasks under the date, each beside the person responsible. Saoirse adds the instrument and its limits under her own name. Tully puts the next winter round under his. Kestrel asks you to leave a blank line for the task you choose. The page begins to look less like a verdict and more like a difficult piece of work that can be shared.',
        ),
      ],
      3,
    ),
    ...section(
      'winter-duty',
      'Something to do before spring',
      'tully-cottage',
      [
        n(
          'accounts-compared',
          'You and Saoirse read your lake accounts aloud without changing them first. Kestrel asks about the separate answers, then about the opening in the ring. Tully remembers an old shore chart with a landing marked near the Candlestones. He brings it from a drawer, leaving the visitor list where it is. The two records have different purposes and different people’s business in them.',
        ),
        ...when(
          'longnight:echo-record',
          'pattern',
          n(
            'pattern-return',
            'Your sketch shows the late-joining light and the unclosed gap. Saoirse’s page supplies the short invitation you did not try to catch. Side by side, the accounts preserve more than either of you managed alone. You add a note explaining which page records the sequence and which records the sound. Neither signature belongs on the other person’s observation.',
          ),
        ),
        ...when(
          'longnight:echo-record',
          'words',
          n(
            'words-return',
            'Your page holds “if you wish” between two honest blank spaces. Saoirse’s sketch gives the separate flames somewhere to stand. You mark the delayed answer beside the light she saw join last, noting that the match is probable rather than certain. It is a useful connection even with a question mark still attached.',
          ),
        ),
        s(
          'willing-lights',
          'kestrel',
          'neutral',
          'Separate lights, separate answers, an invitation. Taken together, this supports willing participation. We still need the terms of the connection: how they joined and how that opening was kept. Do not fill those in because the arrangement looks familiar.',
          a('attentive'),
        ),
        n(
          'candlestones-chart',
          'The chart places the old landing below the Candlestones. From the cottage you can see only the dark shape of their ridge. Snow covers the lower approach, and Tully has closed its gate. He points out the spring path with one finger. When the thaw makes it usable, you can examine the stones with Kestrel and compare their surviving marks with tonight’s echo.',
        ),
        s(
          'waiting-has-work',
          'tully',
          'neutral',
          'The ridge can wait for a clear path. We cannot make the weather hurry. We can make sure the right papers and the right people are ready when it opens.',
          a('attentive'),
        ),
        n(
          'two-winter-tasks',
          'There are two useful jobs available now. Tully needs a clear handover sheet for the winter rounds, including where observations can be made from safe ground. Imogen has asked for a source list connecting the working registers to the shore chart. You can start either at the bench tonight and continue it through the ordinary weeks of term. The other will go on the shared work list.',
        ),
        decide(
          'winter-duty',
          'The investigation needs both practical continuity and a record someone else can follow. Choose a bounded contribution. You will have help, and time for the rest of your life at the academy.',
          'Which winter task will you begin?',
          [
            {
              id: 'handover',
              label: 'Help Tully make the rounds easier to hand over.',
              journal:
                'I began a winter handover sheet with Tully, recording route checks and safe observation points to review before the spring approach opens.',
              remember: ['tully', 'saoirse', 'kestrel'],
            },
            {
              id: 'archive',
              label: 'Prepare the shore sources for Imogen’s spring research.',
              journal:
                'I began a source list linking the shore chart, working-register references and Longnight observations for Imogen to check before spring.',
              remember: ['tully', 'saoirse', 'kestrel'],
            },
          ],
          [t(), a('attentive')],
        ),
        ...when(
          'longnight:winter-duty',
          'handover',
          n(
            'handover-start',
            'You draw a fresh sheet with spaces for the route, the check, and who receives the next round. Tully tries using it while you watch. At the second line he stops: you have written “usual turn,” which tells a newcomer nothing. You replace it with the bridge fork and the upper marker. On the last line you put a name for the handover, so a finished round cannot quietly become an unattended one.',
          ),
          n(
            'handover-check-record',
            'You add a sketch of the check you completed on the round, with the route direction marked beside it. Tully tries reading the instructions without looking at your hands. Where he has to ask what you meant, you add the missing detail. The sheet needs to work when you are absent.',
          ),
          s(
            'handover-promise',
            'tully',
            'warm',
            'Bring this on the next round and we will try it with somebody who has not heard us explain it. When the spring path opens, this will tell us where our winter checks ended. We will not have to trust my memory for all of it.',
            a('warm'),
          ),
        ),
        ...when(
          'longnight:winter-duty',
          'archive',
          n(
            'archive-start',
            'You give the shore chart its own line, with the drawer it came from and Tully’s permission to copy it. Below that go the autumn register references and the two lake observations. You leave a space for Imogen to check the links. The first version makes a date look like a keeper’s name; Saoirse catches it when she tries reading the list aloud. You change the headings.',
          ),
          s(
            'archive-permission',
            'tully',
            'neutral',
            'Copy the old chart, yes. Leave the arrival list here. If somebody needs an account from a current traveller, they can ask that traveller. Those names were given to me for meeting people at the bridge.',
            a('attentive'),
          ),
          n(
            'archive-promise',
            'You make two copies of the source list, one for Imogen and one to stay beside the chart. Saoirse volunteers to deliver the first on your way to supper. In the margin, you write a spring question: does the approach marked here lead to the same opening seen in the echo? The question is narrow enough that an actual visit could answer it.',
          ),
        ),
        n(
          'bounded-finish',
          'Kestrel checks that your task has a first step, a person who can help, and somewhere to stop. Then she puts away the survey. Saoirse begins to reach for the lamp lever and catches herself. It can wait until tomorrow. Tully covers the kettle and asks which of you will carry the empty mug crate back up to the hall.',
        ),
        s(
          'tully-thanks',
          'tully',
          'warm',
          'Thank you for the round. And the paper. Leave the future here for the length of the walk, if you can. The mugs need both hands.',
          a('warm'),
        ),
      ],
      3,
    ),
    ...section(
      'longnight-supper',
      'The longest night has a table',
      'lantern-hall',
      [
        n(
          'hall-winter',
          'Blue and white lanterns hang under the hall’s dark rafters. Snowflake shapes turn slowly above the tables, catching amber light from below. Through the round window, the night looks clean and impossibly cold. Inside, somebody has saved four places together without trying to make an announcement of it. You set the mug crate beside the serving table and feel the relief of having carried it all the way.',
        ),
        n(
          'supper-waited',
          'The meal has been kept in covered dishes. Kestrel goes to speak with Honoria before sitting down; Tully puts his route sheet into his coat and makes himself take the chair facing away from the door. Saoirse notices this and says nothing. A student brings him bread. For a few minutes, the person who waits for arrivals is allowed to arrive.',
        ),
        ...when(
          'longnight:shore-work',
          'landmarks',
          n(
            'visitor-thanks',
            'One of the visitors from the bridge passes your table on the way to the hearth. They say the upper marker was a help; they had nearly followed the lower track. Tully points to you with his spoon. The visitor thanks you, then continues towards the person they came to see. Your part in their evening is small and complete.',
          ),
        ),
        ...when(
          'longnight:shore-work',
          'lanterns',
          n(
            'escort-report',
            'The student who escorted the visitors pauses beside Tully to report that every route lamp is closed and burning steadily. Tully asks specifically about the repaired catch. It held. Saoirse taps the place where you wrote your initials on the check sheet, then lets the report end. There is no need to make it into a speech.',
          ),
        ),
        n(
          'friend-at-table',
          'Saoirse has managed half her meal before she takes out the notebook. You see the movement and she stops, smiling ruefully. Instead of opening it, she slides it under the chair. Then she asks whether you prefer the blue lanterns or the orange ones from Emberfall. It is an ordinary question with an answer that will not help solve the mystery.',
          [a('warm')],
        ),
        s(
          'saoirse-winter-thought',
          'saoirse',
          'warm',
          'I like these. I think. The orange ones made everything feel close enough to reach. These make the roof look as if it goes on forever. Ask me again after pudding; I may have a completely different theory.',
          t('warm'),
        ),
        n(
          'kestrel-returns',
          'Kestrel returns with a fresh page folded into her case. Honoria will put the next investigation meeting on the term calendar, with time for the staff reports and your winter work. There will still be classes tomorrow. A deadline six months away does not cancel the need to learn what you are doing before you try it.',
        ),
        s(
          'winter-leave',
          'kestrel',
          'neutral',
          'Your observations are safe in the case. Keep your own copies. If another detail comes back to you later, date it as a later recollection. For tonight, eat while the food is warm. We can ask better questions after sleep.',
          a('attentive'),
        ),
        n(
          'music-starts',
          'At the far end of the hall, someone begins a song too softly for everyone to hear. A second voice picks it up, then another. Tully knows the words but hums only the part he likes. Saoirse gets one line wrong and laughs into her sleeve. The sound fills the space where the notebook might have been.',
        ),
        n(
          'six-months',
          'You know more than you did when the evening began. Seven willing lights once joined here. An opening was left for someone else. The welcome is weakening, and Midsummer is the next renewal. You also know where your winter work begins and who will be doing the other parts. The unanswered questions have places to go.',
        ),
        n(
          'winter-choice',
          'Saoirse rests one hand on the table beside your cup. She has stopped pretending that she is not frightened, and has begun eating again anyway. You can offer her your hand and a promise of company, or put words to the practical plan you will carry into tomorrow. Around you, the longest night continues to make room for supper.',
          [a('warm')],
        ),
      ],
      3,
    ),
  ],
};
