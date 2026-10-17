import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
const i = (emotion = 'attentive') => actor('imogen', emotion);
const d = (emotion = 'neutral') => actor('dunne', emotion);
const m = (emotion = 'neutral') => actor('maelin-quill', emotion);
const key = (beat) => `register:${beat}`;

export const registerScene = {
  id: 'register',
  chapter: 2,
  beats: [
    ...section(
      'catalogue-request',
      'The question on the slip',
      'library',
      [
        n(
          'september-evening',
          'By the eighteenth of September, your days have acquired a shape. There is a particular stair you take after breakfast, a place where you leave damp shoes, and a page in your notebook devoted to things you must ask before the next practical. The extinguished hall lantern has acquired a shape too: an unresolved entry, copied forward whenever you start a new page. Grey has found no fault in its fitting. Elian has repeated your first Kindle demonstration without hearing a voice. Those are the facts you bring to the library.',
        ),
        n(
          'library-lamps',
          'The green lamps are already lit. Beyond the tall window, the last blue of evening rests between the branches. Imogen has chosen a table beside the ironwork shelves, where there is space for two notebooks and the large atlas she has borrowed. She moves her own notebook when she sees you. The empty space has been measured with rather more care than she wants you to notice.',
          [i()],
        ),
        s(
          'imogen-waiting',
          'imogen',
          'warm',
          'I saved you the chair that does not rock. This involved a small exchange with somebody revising protective circles. No wards were broken. I think.',
          d(),
        ),
        n(
          'atlas-open',
          'The atlas contains a map of the mere. Tiny names follow the shore, squeezed into curves of ink beside landing places and old paths. Some are names of buildings. Some appear to be people. Imogen has marked the page with a clean strip of paper. You recognise the boathouse, although the drawing gives it an extra roof and a much more confident chimney.',
          [i()],
        ),
        s(
          'imogen-question',
          'imogen',
          'attentive',
          'The catalogue calls these dedication marks. I thought that meant the people who paid for the lanterns. But there is a cross-reference to a register, and the register has a cross-reference to maintenance. I would like to know why a dedication needs a maintenance record.',
          d(),
        ),
        ...when(
          'arrival:first-observation',
          'record',
          s(
            'record-method',
            'imogen',
            'warm',
            'I have kept the columns we made at supper: what happened, who noticed, what we still need to ask. There is a fourth one now. Where did we get that answer?',
            d(),
          ),
        ),
        ...when(
          'arrival:first-observation',
          'frame',
          n(
            'frame-method',
            'You tell her that the frame above your supper place was cold before anyone tried to relight it. Imogen adds this beside the maintenance reference. She asks whether you wrote the time down. You did not. She leaves the space empty instead of supplying a time that would look tidy.',
            [i()],
          ),
        ),
        ...when(
          'arrival:first-observation',
          null,
          n(
            'record-legacy',
            'Imogen draws a line down a fresh page and labels one side observations and the other questions. You begin with the lantern and the classroom voice, keeping the accounts separate.',
            [i()],
          ),
        ),
        n(
          'request-desk',
          'Dunne comes to the table carrying three request slips and no books. She sets the slips down beyond the edge of the atlas. Her spectacles hang against the buttons of her blouse. Imogen straightens in her chair, then sits back as though she has caught herself rehearsing for an examination.',
          [d(), i('guarded')],
        ),
        s(
          'dunne-request',
          'dunne',
          'neutral',
          'Tell me what you need to find out. The restricted shelf contains fragile bindings, not better answers. If the question belongs in a working ledger, I would rather fetch you a working ledger.',
          i(),
        ),
        s('imogen-too-wide', 'imogen', 'tense', 'Why the academy is forgetting its lights.', d()),
        n(
          'narrow-question',
          'Dunne waits. Imogen looks down at the atlas. The question she has carried here seemed small enough while it lived in her notebook. Spoken beneath the library ceiling, it asks Dunne to bring almost the whole building to your table. After a moment Imogen turns the page marker sideways and begins again.',
          [i('guarded'), d()],
        ),
        s(
          'imogen-revised-request',
          'imogen',
          'attentive',
          'Who was recorded as keeping the shore lanterns, and whether the way those people were recorded changed. We can start with one lantern if that is manageable.',
          d('attentive'),
        ),
        s(
          'dunne-better',
          'dunne',
          'attentive',
          'That I can help with. You may consult the public register here. No ink at this table, and no spell on a binding without supervision. I have asked Quill to join us; some of the headings use an older sense of keeper.',
          i(),
        ),
        n(
          'quill-arrival',
          'Maelin Quill arrives with a folded teaching sheet tucked inside a book. Their moss-green coat has a narrow woven border, worn smooth where it meets the desk. Copper spectacles catch the lamp as they introduce themselves: history and rune languages. They ask to see the catalogue reference before the atlas. Imogen slides both across, and Quill thanks her for leaving the shelf number visible.',
          [m(), i()],
        ),
        s(
          'quill-introduction',
          'maelin-quill',
          'neutral',
          'Maelin will do at a reading table. In an assessment, Lecturer Quill is helpful, mostly because it reminds me not to answer my own questions. What have you brought that we can compare?',
          i('amused'),
        ),
        decide(
          'search-method',
          'Dunne offers two starting points. The atlas gives a date for the shore fittings. Grey’s maintenance note records a small maker’s mark on your hall lantern. Either might lead to a useful comparison, but you have time to begin with only one before the evening returns arrive.',
          'Where will you start the search?',
          [
            {
              id: 'dates',
              label: 'Follow the dates in the atlas.',
              journal:
                'We began the register search with dated shore entries, keeping the hall lantern as a separate comparison.',
              remember: ['imogen', 'dunne', 'maelin-quill'],
            },
            {
              id: 'makers',
              label: 'Follow the maker’s mark in Grey’s note.',
              journal:
                'We began the register search with the lantern maker’s mark and checked it against dated entries.',
              remember: ['imogen', 'dunne', 'maelin-quill'],
            },
          ],
          [i(), d('attentive')],
        ),
        ...when(
          key('search-method'),
          'dates',
          n(
            'date-index',
            'You copy the atlas date onto the request slip. Dunne brings a narrow index whose pages have the polished edges of frequent use. Two entries share the date: the dedication and the following morning’s inspection. Imogen almost copies only the first, then adds the second. The difference is a single day and a different person holding the pen.',
            [i(), d('attentive')],
          ),
          s(
            'date-answer',
            'dunne',
            'attentive',
            'A ceremony and a completed job do not always happen together. Keep both references. Otherwise the index will quietly answer a smaller question than the one you asked.',
            i(),
          ),
        ),
        ...when(
          key('search-method'),
          'makers',
          n(
            'maker-index',
            'The mark in Grey’s note resembles a bent reed. You find it in an illustrated list of fittings, where its name is given as Reed & Daughters. The firm supplied lamps for both the hall and the shore over several decades. That connects the objects, but does not yet connect the failure. Maelin points out the date column before you can treat the shared stamp as an explanation.',
            [m(), i()],
          ),
          s(
            'maker-answer',
            'maelin-quill',
            'neutral',
            'The same workshop can make a thousand lamps that have a thousand different histories. We need a pair of entries close enough in date that we know which work we are discussing.',
            i(),
          ),
        ),
        n(
          'two-references',
          'By the time the return trolley reaches your table, the slip has two usable references and a smudge from your thumb. Dunne checks the numbers, writes her own initials beside them, and takes a key from the chain at her waist. Imogen watches the gate open. For once, she does not move ahead of the person who knows which shelf will bear her weight.',
          [d(), i()],
        ),
      ],
      2,
    ),
    ...section(
      'missing-names',
      'What the page does not say',
      'library',
      [
        n(
          'register-support',
          'The register is heavier than it looks. Dunne settles it on a green support cushion and opens it a little at a time, letting the spine decide how far it will go. Its brass weights rest on the outside corners. The working ledger stays closed at the left until there is room for it. Nobody places one book on top of another. The arrangement makes the table feel less like a place for an exciting discovery and more like a place where something could be damaged by hurry.',
          [d('attentive'), i()],
        ),
        {
          ...n(
            'register-detail',
            'Under the lamp, the formal register shows a repeating pattern. Dates and payment amounts continue down the page. Several short cells in the name column are empty. The ruled lines run through those spaces without a break; you see no torn paper or scraped patch. Two comparison slips lie beside the book. This page shows omissions. It does not show who made them or why.',
          ),
          illustration: {
            art: 'register-study',
            alt: 'An intact register on a green cushion under a library lamp, with blank name cells between filled rows and separate comparison slips.',
          },
        },
        s('imogen-first-claim', 'imogen', 'grave', 'Somebody rubbed them out.', d()),
        n(
          'dunne-lamp',
          'Dunne shifts the lamp a little so its light falls across the paper. At this angle the surface has a fine uneven grain. You can see where an old pen pressed too hard in the payment column, and where a corner has been mended. The empty name cells have neither the roughness of the mend nor the pressure marks of the writing.',
          [d(), i('tense')],
        ),
        s(
          'dunne-observation',
          'dunne',
          'attentive',
          'Perhaps an earlier copy had names. This copy gives us no sign of rubbing. Write what the page permits, Imogen. We can ask the stronger question after we have earned it.',
          i('guarded'),
        ),
        n(
          'first-comparison',
          'The first comparison is disappointingly ordinary. An inspection entry names M. Fen as the person who repaired a shore fitting and checked its wick. The matching formal entry lists the date, the lamp, and the cost. The space for a keeper is empty. Imogen looks from one book to the other, then checks the reference numbers again. You count the digits aloud. They agree.',
          [i(), m()],
        ),
        s(
          'quill-one-example',
          'maelin-quill',
          'neutral',
          'One missing name may be an unfinished entry. Two may be a copying habit. We should choose a second example before we decide we have found a rule.',
          i(),
        ),
        n(
          'second-comparison',
          'The next pair concerns a lamp on the kitchen approach. Its working entry records A. Moss replacing the shelter and waiting until the evening handover. In the formal register, the shelter and its price remain; the person and the waiting do not. A third pair names a student who carried a repaired lamp back to the landing place. The dedication entry credits the original donor and says nothing about the return.',
          [i(), m()],
        ),
        s(
          'imogen-repetition',
          'imogen',
          'attentive',
          'The things bought are carried forward. The people doing the work are not, unless they also paid for it. That happens in all three pairs.',
          m(),
        ),
        s(
          'quill-sample',
          'maelin-quill',
          'neutral',
          'In these three pairs. A useful finding. We will keep the numbers beside it so another reader can disagree by checking, rather than by trusting either of us.',
          i(),
        ),
        n(
          'teaching-sheet',
          'Maelin unfolds their teaching sheet. You recognise its border from notices outside the history room. Under a diagram of the shore, a short note describes keepers as patrons who endowed the lights. Maelin lays the sheet beside the working entry and is quiet for several breaths. Imogen’s fingers tighten around her pencil. She looks ready to defend the ledger against the printed page.',
          [m('reflective'), i('guarded')],
        ),
        s(
          'quill-definition',
          'maelin-quill',
          'reflective',
          'I used the dedication index when I wrote this. It was a convenient source for the diagram. Apparently it was a less convenient source for the people.',
          i(),
        ),
        n(
          'older-heading',
          'They show you the older heading in the working ledger. Its last mark turns back toward the beginning of the word. In a donor’s list, keeper can mean the person responsible for payment. Beside a record of daily tasks, the same word can mean the person who remains to finish them. The heading alone cannot choose between those meanings. Maelin has used the first without explaining why.',
          [m('reflective'), i()],
        ),
        s(
          'quill-next-source',
          'maelin-quill',
          'neutral',
          'Grey uses a descendant of this ledger. Ask what the handover actually involves. We have been reading a verb as if it were a title. Someone who does the work may be able to put the movement back into it.',
          i(),
        ),
        n(
          'permission-copy',
          'Dunne gives you a clean comparison slip for each reference. You copy the names exactly as written, initials and all. There is no satisfying way to turn M. Fen into a full biography from this room. The uncertainty irritates Imogen; you can hear it in the short strokes of her pencil. Still, she leaves the initial intact.',
          [d('attentive'), i('tense')],
        ),
        s(
          'dunne-source-care',
          'dunne',
          'attentive',
          'Leave the originals here. Grey can correct your copy, and I can check it afterwards. If someone else lends you a record, ask how they want it returned. Borrowing a story is still borrowing.',
          i(),
        ),
      ],
      2,
    ),
    ...section(
      'working-record',
      'The person who stays',
      'old-cloisters',
      [
        n(
          'cloister-arrival',
          'Grey is at the old cloisters with a toolbox open on the paving beside him. He has lifted a loose threshold strip and set it where nobody can tread on the nails. Before you mention the register, he asks you to stand at the turn in the passage while a pair of students carry a long box through. You hold your notes against your chest and become, briefly, a warning sign.',
          [actor('grey'), i()],
        ),
        ...when(
          'arrival:corridor-job',
          'sign',
          s(
            'grey-sign-memory',
            'grey',
            'neutral',
            'You know this corner now. The sign you helped with has kept its arrow, even after somebody tried to hang a scarf over it. Let them past and I will have a look at your paper.',
            i('amused'),
          ),
        ),
        ...when(
          'arrival:corridor-job',
          'trunk',
          s(
            'grey-trunk-memory',
            'grey',
            'neutral',
            'You and Toby had the right of it with that trunk. Clear the turning space first. It remains excellent advice even when the luggage has become a wardrobe.',
            i('amused'),
          ),
        ),
        ...when(
          'arrival:corridor-job',
          null,
          s(
            'grey-legacy',
            'grey',
            'neutral',
            'Grey, if we have not had a proper introduction. I keep these corridors usable. Today that means persuading a threshold not to collect ankles.',
            i('amused'),
          ),
        ),
        n(
          'question-waits',
          'When the box has gone, Grey checks the loose strip once more before taking your slip. He reads it with one hand braced on his knee. You expect him to recognise the initials at once. He does not. He knows the lamp positions, however, and the abbreviations for shelter, wick, and handover. At the last of these he makes a small sound of recognition.',
          [actor('grey'), i()],
        ),
        s(
          'grey-not-ancestor',
          'grey',
          'neutral',
          'I cannot give you Fen’s first name. The shore fittings have been through more hands than mine. But waiting until handover means something. Whoever wrote that had not simply finished tightening a screw.',
          i(),
        ),
        decide(
          'worker-question',
          'Grey has another repair to finish before supper. He can explain the handover from his own practice or show you how his current work record preserves it. Imogen holds the pencil poised above a fresh page, careful this time to leave room for the answer.',
          'What will you ask Grey to show you?',
          [
            {
              id: 'practice',
              label: 'Ask what happens during a handover.',
              journal:
                'Grey described staying with a returning student until the next keeper arrived; we recorded his present-day account separately from the old ledger.',
              remember: ['grey', 'imogen'],
            },
            {
              id: 'record',
              label: 'Ask how a working keeper is recorded.',
              journal:
                'Grey showed us a current handover entry and explained why the worker and the next keeper both sign it.',
              remember: ['grey', 'imogen'],
            },
          ],
          [actor('grey'), i()],
        ),
        ...when(
          key('worker-question'),
          'practice',
          s(
            'grey-practice',
            'grey',
            'neutral',
            'Last week a student missed the supper bell. Bad weather, poor sense of direction, nothing more mysterious than that. I had finished the repair by the landing, but I stayed until somebody came to walk back with them. The lamp was lit before they arrived. It settled warmer when they knew which way to go.',
            i(),
          ),
          n(
            'grey-practice-limits',
            'Imogen asks whether the student caused the change. Grey shakes his head. He had adjusted the shelter too, and the wind was dropping. He can tell you what happened together, not which part caused which. Then he shows you the present-day note so you can write down the date. You copy his words about staying without turning them into proof that the same thing happened a century ago.',
            [actor('grey'), i()],
          ),
        ),
        ...when(
          key('worker-question'),
          'record',
          n(
            'grey-record',
            'Grey takes a narrow book from the inside of his coat. The current entry has two names: his and the person who took the next round. Between them is a note that a returning student was met at the landing. He covers a separate line containing the student’s room number before handing the book across. You do not need that detail to understand the job.',
            [actor('grey'), i()],
          ),
          s(
            'grey-two-names',
            'grey',
            'neutral',
            'One signature says I stayed. The other says somebody was there when I left. If I only wrote lamp repaired, the next person would not know whether anyone had met the boat. That is how an accurate sentence can leave you with an unfinished job.',
            i(),
          ),
        ),
        n(
          'grey-old-leaf',
          'The old wording reminds Grey of a loose instruction leaf kept with the maintenance copies. He fetches it from a shallow drawer inside the cloister office, wrapped in plain paper. Its corners are soft and its print is uneven. A line near the bottom directs keepers to leave a light where a returning traveller will see a familiar way, and to remain until the traveller is received. Grey places it on top of your copy, not inside it.',
          [actor('grey'), i()],
        ),
        s(
          'grey-lend',
          'grey',
          'neutral',
          'Dunne has the archive copy. This is the one we use. Take the reference and ask her to compare it; I would rather keep this here for whoever comes on after me. If she needs to see the paper itself, I will bring it over when the threshold is safe.',
          i(),
        ),
        n(
          'not-a-clue-machine',
          'He returns to the strip of wood before Imogen has finished copying. There is an awkward moment in which the mystery seems to expect him to wait while the corridor needs him to work. You crouch to collect the loose nails into their tray. Imogen checks the passage again. The explanation continues between practical interruptions, and you begin to understand why a formal record might miss this kind of time.',
          [actor('grey'), i()],
        ),
        s(
          'imogen-permission',
          'imogen',
          'attentive',
          'May we quote the part about staying? With your name, and today’s date. We will keep the older instruction separate.',
          actor('grey'),
        ),
        s(
          'grey-quote',
          'grey',
          'neutral',
          'Yes. Write that it is how I understand the work now. If you find out they once did it differently, you can bring that back too.',
          i('warm'),
        ),
        n(
          'threshold-finished',
          'You wait while he seats the last screw. When the strip is secure, Grey walks across it, then asks you to try. Nothing creaks or catches. The improvement is almost impossible to describe once it has happened: a place you can pass through without thinking about your feet. Imogen writes the instruction-leaf reference beneath his quotation. At the bottom she adds, with a small look toward you, return with what we find.',
          [actor('grey'), i('warm')],
        ),
      ],
      2,
    ),
    ...section(
      'supervised-echo',
      'A memory with edges',
      'library',
      [
        n(
          'library-return',
          'The high window has darkened by the time you return. Dunne has found the archive copy of Grey’s instruction leaf. Its wording matches your transcription, including an old spelling that Imogen had nearly corrected. Maelin reads the line about a familiar way twice. The phrase sits uncomfortably close to the voice in your Kindle flame, but neither of you has heard the whole instruction spoken.',
          [m(), i()],
        ),
        s(
          'imogen-connection',
          'imogen',
          'grave',
          'Remember the way home. That could belong to the same practice. It does not tell us whose voice we heard.',
          m(),
        ),
        s(
          'quill-limits',
          'maelin-quill',
          'neutral',
          'Agreed. We can ask whether the objects hold traces of that practice. Echosight may help, provided we decide beforehand what it cannot answer. A memory is not a witness we can cross-examine until it agrees.',
          i(),
        ),
        n(
          'practice-card',
          'For the demonstration, Maelin produces an ordinary teaching card. One corner has been folded back. They set it on a clear patch of the table and explain that they used it in their own lesson that morning. It is theirs to offer, and you may stop whenever you wish. The register remains beyond reach, its weights undisturbed. Your first attempt will not be made on a fragile object or someone else’s private letter.',
          [m(), i()],
        ),
        s(
          'quill-gesture',
          'maelin-quill',
          'neutral',
          'Two fingers beside the fold. One patient breath. Notice the trace without demanding a particular image. When you lift your hand, let it go. You are not trying to hold the morning here.',
          i(),
        ),
        n(
          'practice-before',
          'You try the motion without magic first. The card is cool; the crease has a rough edge; the lamp casts a clear shadow from your fingers. Maelin asks you to remember those ordinary sensations so you will not mistake every detail for an echo. Imogen copies the instruction in smaller writing than usual, leaving the centre of the page for what actually happens.',
          [m(), i()],
        ),
        n(
          'practice-echo',
          'On the second attempt, a brief impression crosses the card: the weight of a book placed against its edge, a scrape, a little impatience. It vanishes before you can decide whether the feeling belongs to you. You lift your hand. The card is still a card. The library is still audible around you, a chair moving at the far table and the soft click of Dunne’s keys.',
          [m(), i()],
        ),
        s(
          'quill-check',
          'maelin-quill',
          'neutral',
          'I put a dictionary on it this morning because the corner kept lifting. The scrape is consistent with that. I cannot verify the impatience for you. I was also trying to remember whether I had left my door open.',
          i('amused'),
        ),
        n(
          'second-reader',
          'Imogen tries next. She reports pressure along one edge and no scrape at all. You feel a small, unreasonable urge to defend your own account. Maelin gives each of you a separate space on the page. Neither version replaces the other. Then they turn the card over and point to an ink stain neither of you noticed. There was more to the morning than either echo showed.',
          [i('attentive'), m()],
        ),
        s(
          'quill-memory-lesson',
          'maelin-quill',
          'neutral',
          'Incomplete does not mean useless. It means we keep the ordinary evidence. Especially when a magical impression makes a very satisfying story.',
          i(),
        ),
        n(
          'archive-permission',
          'Dunne agrees to one supervised observation of the working ledger, from the clean margin beside the entry you have already read. She checks the binding, removes a weight, and tells you exactly where your hand may rest. Maelin will end the observation if it becomes difficult to release. There is no invitation to search every memory the book might hold.',
          [d('attentive'), m()],
        ),
        n(
          'ledger-echo',
          'The trace is smaller than you expected. A strip of damp cloth rests against warm metal. There is a sense of waiting, then a slight movement as someone makes space beside them. You cannot see a face. For an instant the warmth resembles the feeling of reaching your own chair after a long day. Then it loosens. You lift your hand before the wish to know more can turn into a second attempt.',
          [m(), i('grave')],
        ),
        s(
          'imogen-no-face',
          'imogen',
          'grave',
          'No name. No reason somebody left it out. Only the work, and someone waiting.',
          m('reflective'),
        ),
        n(
          'ordinary-check',
          'You write the impression on a fresh slip, clearly labelled as an Echosight observation made this evening. Beside it goes the old inspection entry, which already mentions the shelter and the handover. They fit together. That makes the echo useful. It does not make the echo a record of everything that happened, or the missing name a deliberate act of cruelty.',
          [m(), i()],
        ),
        s(
          'quill-exercise-end',
          'maelin-quill',
          'neutral',
          'That is enough for tonight. Practise the release on the teaching card before you attempt Echosight alone. You have found a trace consistent with care and return. Do not make it carry an accusation it never showed you.',
          i(),
        ),
        n(
          'water-break',
          'Dunne closes the ledger and tells you that the reading room will survive five minutes without an investigation. At the water stand, Imogen holds a cup in both hands. The scrape of her chair had seemed loud earlier. Now the whole library seems pleasantly solid: tables that stay put, books that must be carried, water that tastes of nothing more complicated than water.',
          [i('tired')],
        ),
      ],
      3,
    ),
    ...section(
      'correcting-claim',
      'Room for a correction',
      'library',
      [
        n(
          'imogen-margin',
          'When you return to your notebook, Imogen has drawn a small line beneath her first claim. Somebody rubbed them out. She has not crossed it through. Beside it she has written page intact, names omitted from formal copy, reason not established. The words fit in the space only because she has made them very small.',
          [i('guarded')],
        ),
        s(
          'imogen-admission',
          'imogen',
          'guarded',
          'I wanted the blank spaces to mean something clear. A person to argue with. A wrong thing to put right by doing its opposite. It felt disloyal to the missing people to say we were not sure.',
          m('reflective'),
        ),
        n(
          'correction-stakes',
          'Across the table, Maelin is looking at their printed teaching sheet. They have made a mark beside the definition of keeper, but have not folded the sheet away. Dunne is waiting for the notes that will accompany the request slips. Imogen could revise her claim quietly with you first, or explain the change to the table while the sources are still open. Both require her to choose what she can stand behind.',
          [i('tense'), m('reflective')],
        ),
        decide(
          'correction',
          'Imogen nudges the notebook toward you. “Will you help me make this accurate?” she asks. Her voice is low enough that the question belongs to the two of you. She has not asked you to speak for her.',
          'How will you help Imogen revise the claim?',
          [
            {
              id: 'private',
              label: 'Work through the wording with her first.',
              journal:
                'I helped Imogen revise her claim privately before she read the correction to the table. We distinguished omission from proven erasure.',
              remember: ['imogen'],
            },
            {
              id: 'together',
              label: 'Offer to compare the sources beside her.',
              journal:
                'I compared the references beside Imogen while she explained her correction to the table. We kept the conclusion narrower than our first theory.',
              remember: ['imogen', 'dunne', 'maelin-quill'],
            },
          ],
          [i('guarded')],
        ),
        ...when(
          key('correction'),
          'private',
          n(
            'private-wording',
            'You turn the notebook so both of you can read it and point to the words somebody and rubbed. One guesses an actor; the other guesses a method. Imogen tries replacing the sentence with the names are absent, then objects that this leaves out the comparison. Together you arrive at three entries keep the work while omitting its workers. She reads it under her breath, checking each part against the slips.',
            [i()],
          ),
          s(
            'private-thanks',
            'imogen',
            'warm',
            'That is less grand. It is also something I can show someone. Thank you for letting me get there before everyone had to watch.',
            m(),
          ),
          n(
            'private-report',
            'She lifts her head and tells Dunne which part of the original claim has changed. You stay beside her while she does it. The table does not collapse under the correction. Dunne asks for the reference numbers; Imogen gives them without looking at you for rescue.',
            [i('attentive'), d('attentive')],
          ),
        ),
        ...when(
          key('correction'),
          'together',
          n(
            'together-report',
            'You ask Imogen whether she would like you to read the working entries while she checks the register. She nods. You give each reference number before its contents, and she explains the difference to Dunne. Halfway through, she stops herself from saying removed and chooses omitted instead. Nobody interrupts the pause.',
            [i(), d('attentive')],
          ),
          s(
            'together-correction',
            'imogen',
            'attentive',
            'I said the names had been rubbed out. We have not found evidence for that. We have found a pattern in what the formal copy kept. I would like our request note to say that, with the three comparisons attached.',
            d('attentive'),
          ),
          s(
            'together-thanks',
            'imogen',
            'warm',
            'It helped to have another voice carrying the numbers. I could listen to what I was actually saying.',
            m(),
          ),
        ),
        s(
          'dunne-accepts',
          'dunne',
          'attentive',
          'That is a finding I can catalogue. I will keep the correction with the first request, so another reader can see why it changed. We do not need to pretend you arrived knowing the answer.',
          i('warm'),
        ),
        n(
          'quill-own-change',
          'Maelin turns their teaching sheet over and writes on the back. This correction is larger than Imogen’s note: it applies to copies already handed out. They list the working-ledger references, then add an instruction to read keeper in the context of the task being recorded. The pencil stops at the end of the sentence. Their thumb rubs once along the folded edge.',
          [m('reflective'), i()],
        ),
        s(
          'quill-accountable',
          'maelin-quill',
          'reflective',
          'I shall give the class a replacement note. The old definition made a patron visible and a worker invisible, then taught students to expect that distinction. That was my choice of source. I do not need to know every earlier clerk’s intention to correct my own explanation.',
          i(),
        ),
        s(
          'imogen-teacher-question',
          'imogen',
          'attentive',
          'Will you say why you changed it?',
          m('reflective'),
        ),
        s(
          'quill-credit',
          'maelin-quill',
          'neutral',
          'Yes. With your permission, I will credit both of you for the comparison and Grey for the working account. The people who supplied a correction should not vanish from the corrected version.',
          i('warm'),
        ),
        n(
          'credit-limits',
          'You agree to credit for the comparison. Grey has already permitted the quotation, with its date and limits. Dunne asks Maelin to send him a copy rather than assuming he will hear about it through a class he does not attend. Imogen adds that task to the bottom of your page. It is a modest promise, and for that reason it feels possible to keep.',
          [d('attentive'), m()],
        ),
      ],
      3,
    ),
    ...section(
      'supported-conclusion',
      'A useful page to carry',
      'library',
      [
        n(
          'three-sources',
          'Before the books return to their shelves, you lay out three kinds of evidence. The paired records show names and acts of care omitted from the formal register. The keeper’s instruction connects a light with receiving somebody into a familiar place. The supervised echo is consistent with that work, though it supplies no name or motive. None of the sources, by itself, says why your hall lantern went cold.',
          [i(), m()],
        ),
        ...when(
          key('search-method'),
          'dates',
          n(
            'date-payoff',
            'The inspection date you kept at the start now matters. It follows the dedication rather than duplicating it. Somebody continued tending the lamp after the ceremony had finished. You circle both dates on the comparison slip so a future reader will not mistake the celebration for the whole life of the light.',
            [i()],
          ),
        ),
        ...when(
          key('search-method'),
          'makers',
          n(
            'maker-payoff',
            'The maker’s mark has done its useful work. It helped you identify a fitting, but it does not explain the warmth in the echo. You put the workshop reference beside the maintenance entry rather than beside the cause of the failure. Imogen sees you move it and does the same with her copy.',
            [i()],
          ),
        ),
        s(
          'imogen-working-theory',
          'imogen',
          'grave',
          'If the welcoming magic depends on remembered care, a record that keeps only payments is losing part of what the lights were meant to hold. The omissions may matter to the failure. We should check another kind of light before we call that the cause.',
          m(),
        ),
        s(
          'quill-calibration',
          'maelin-quill',
          'neutral',
          'That is a theory worth testing. Do not shorten it to the register broke the heartfire. We have a connection between light, memory, and belonging. We have not found a repair, or a person responsible for the loss.',
          i(),
        ),
        n(
          'moonflower-reference',
          'The archive instruction has one further reference in its margin: flowers prepared for the autumn lanterns. Dunne identifies the old botanical term as moonflower and copies the glasshouse catalogue number. Rhys keeps the living collection; Saoirse has been helping prepare the festival frames. You already know where to find them. For the first time this evening, the next step is a conversation rather than another shelf.',
          [d('attentive'), i()],
        ),
        s(
          'dunne-next-question',
          'dunne',
          'attentive',
          'Ask what they can show you safely. The flowers have their own season. An impatient reader cannot make October arrive by turning enough pages.',
          i('amused'),
        ),
        n(
          'small-repair',
          'Maelin gathers the teaching sheet and the references for its replacement. Dunne returns the register to its gate. You carry the empty water cups back to the stand while Imogen checks that none of the comparison slips is trapped inside a book. The library becomes an ordinary room again by degrees. The unanswered question remains, but it now has people and places attached to it.',
          [i()],
        ),
        ...when(
          key('worker-question'),
          'practice',
          n(
            'grey-practice-payoff',
            'For Grey’s copy you write his account in a separate paragraph, with today’s date above it. You leave out the student’s identity. Beneath the quotation you add that the old instruction supports the practice of staying until a traveller is received. His present memory and the older wording can sit together without being made into the same event.',
            [i()],
          ),
        ),
        ...when(
          key('worker-question'),
          'record',
          n(
            'grey-record-payoff',
            'For Grey’s copy you include the purpose of both signatures and leave out the private detail he covered. You mark the difference between a repaired fitting and a completed handover. A future reader might know all about brass and wicks and still need somebody to explain why a keeper stayed after the mechanical work was done.',
            [i()],
          ),
        ),
        s(
          'imogen-personal-question',
          'imogen',
          'warm',
          'I think I owe you a different sort of evening soon. One where I ask whether you have eaten before asking what you noticed on a page.',
        ),
        n(
          'table-room',
          'You admit that you have been thinking about supper for some time. Imogen checks the clock and looks appalled at how well hunger has survived such an interesting investigation. She begins packing with sudden efficiency, then slows to make sure your notebook has not been buried under hers. The chair beside you rocks when she rises. Apparently the exchange at the start of the evening was more generous than she let on.',
          [i('amused')],
        ),
        s(
          'imogen-chair',
          'imogen',
          'amused',
          'It only rocks if you move. I spent most of the evening being terribly still and scholarly. There are compensations.',
        ),
        n(
          'register-end',
          'You leave with a page that can be checked, a correction that has been accepted, and a promise to bring Grey the result. The hall lantern is still cold. Three ordinary keepers have not yet recovered their full names. But the work they did is no longer an empty space in your account. Beside the plan to visit the glasshouses, Imogen writes one final reminder in a hand large enough to read: supper first.',
          [i('warm')],
        ),
      ],
      3,
    ),
  ],
};
