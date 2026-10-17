import { actor, narrate as n, speak as s, section, when, decide } from './authoring.mjs';
const a = (emotion = 'neutral') => actor('saoirse', emotion);
const t = (emotion = 'neutral') => actor('tully', emotion);
const k = (emotion = 'neutral') => actor('kestrel', emotion);

export const longnightShore = [
  ...section(
    'winter-round',
    'The work of arriving',
    'tully-cottage',
    [
      n(
        'cottage-snow',
        'Winter has made Tully’s cottage smaller from a distance and more complicated up close. Snow rounds the roof and gathers in the seams of the barrels. The path to the covered workbench has been swept, gritted, and swept again. Beyond the tied boats, a narrow patch of dark water moves against the frozen mere. The academy shines across it. Walking here from the bridge has taken longer than you expected.',
      ),
      n(
        'winter-business',
        'Tully is adjusting a lamp beneath the porch. He finishes tightening its catch before greeting you. There are three mugs waiting beside the kettle, and a fourth upside down to keep snow out. Saoirse puts her case on the bench. She has brought the small lantern you worked on at Emberfall, a roll of spare cloth, and exactly one tool more than the case will hold.',
        [t(), a('warm')],
      ),
      s(
        'tully-route',
        'tully',
        'warm',
        'Good. You came by the upper path. The boats are tied up for the freeze. Anyone arriving for Longnight gets met at the bridge and walked round. We keep a lamp at both turns. The castle is easy to see; the safe way to it is another matter.',
        a('attentive'),
      ),
      n(
        'winter-names',
        'The first page on his workbench lists expected arrivals, the times they might reach the bridge, and who will meet them. Several times are crossed out. Beside one name, Tully has written that the visitor cannot carry a heavy bag. Beside another is a reminder to bring a spare coat. He turns the sheet face down before clearing space for your notebook. These are people’s arrangements, not a puzzle to be copied.',
      ),
      ...when(
        'emberfall:quiet-company',
        'listen',
        s(
          'winter-listen',
          'saoirse',
          'warm',
          'Remember what I said about wanting a light to feel as if somebody expected you? Tully has a list, a spare coat, and someone waiting at the bridge. I think I left a few important parts out of my drawing.',
          t('warm'),
        ),
      ),
      ...when(
        'emberfall:quiet-company',
        'rest',
        s(
          'winter-rest',
          'saoirse',
          'amused',
          'I have taken your lesson about doing nothing extremely seriously. There is a whole hour after supper with no invention in it. I am telling you now so I cannot quietly fill it with something useful later.',
          t('warm'),
        ),
      ),
      ...when(
        'emberfall:quiet-company',
        null,
        n(
          'winter-company-legacy',
          'Saoirse asks which of the mugs is yours. She has been practising fitting her work around other people’s plans, with mixed success. Tonight she has left the hour after supper empty. She says this with the solemn pride of someone presenting a very small invention.',
          [a('warm'), t('warm')],
        ),
      ),
      n(
        'warding-arrives',
        'Boots scrape on the lower step. Kestrel arrives carrying a flat case and a folded survey. She sets the case where melting snow cannot reach it, introduces herself as the teacher responsible for tonight’s warding check, and asks Tully about the returning bridge party. Only after he gives the time does she ask to see your autumn notes.',
        [k(), t()],
      ),
      s(
        'kestrel-question',
        'kestrel',
        'neutral',
        'Rhys sent me her account of the petal comparison. A short-lived trace can tell us where to look. Tonight we are checking whether the older shore memory is still readable. I will hold the boundary of the exercise. You may stop your spell whenever you need to.',
        a('attentive'),
      ),
      n(
        'little-failure',
        'A porch lamp flickers while she speaks. Saoirse looks up sharply. Tully gives the catch another quarter-turn. The flicker stops. A strip of worn metal lies beside his tool, its edge rubbed thin by years of use. There is something reassuring about a fault that fits in a hand and can be replaced before supper.',
        [t(), a('attentive')],
      ),
      s(
        'tully-two-jobs',
        'tully',
        'neutral',
        'That one was the fitting. I still mend fittings. The shore lamps have been losing their welcome even when the fittings are sound. Two jobs. If we forget the first while thinking about the second, somebody misses a step.',
        k(),
      ),
      n(
        'route-request',
        'The lake reading will take place from the old stone landing, inside the rope posts. Tully wants the route ready for the next arrival as well as for your investigation. He offers you the route slate and the box of lamp catches. Kestrel will accompany either job and then check the exercise boundary. Saoirse takes whichever task remains.',
      ),
      decide(
        'shore-work',
        'There is time to complete one useful piece of the round before you go to the water. One task concerns how a stranger finds the route; the other concerns whether the lamps marking it keep working.',
        'Which part of the round will you take?',
        [
          {
            id: 'landmarks',
            label: 'Check the route as someone arriving for the first time.',
            journal:
              'On the Longnight round I checked the winter route from an arriving visitor’s point of view and helped mark a misleading turn.',
            remember: ['tully', 'kestrel', 'saoirse'],
          },
          {
            id: 'lanterns',
            label: 'Check the catches and covers on the route lamps.',
            journal:
              'On the Longnight round I checked the route lamps and helped replace a worn catch before the next arrivals.',
            remember: ['tully', 'kestrel', 'saoirse'],
          },
        ],
        [t(), k()],
      ),
    ],
    2,
  ),
  ...section(
    'safe-way',
    'A path somebody can use',
    'tully-cottage',
    [
      ...when(
        'longnight:shore-work',
        'landmarks',
        n(
          'landmark-walk',
          'You begin at the bridge end and pretend that the castle’s bright windows are the only directions you have. At the first fork, the lower track points more directly towards them. Its old gate is half hidden by snow. The safe upper path curves away into trees. From here, the inviting choice is wrong.',
        ),
        s(
          'landmark-check',
          'kestrel',
          'neutral',
          'Tell me what made you choose it. We know the route, which makes us poor judges of how clear it is. “Obvious” often means somebody explained it to us years ago.',
        ),
        n(
          'landmark-change',
          'You describe the sightline, then walk back until the fork disappears behind the tree. Tully moves the marker to the place where a newcomer would actually make the decision. You help turn its arrow towards the upper path. Saoirse tests the hood above it, and you return to the bridge end to check again. This time the marker is visible before the tempting track.',
        ),
        s(
          'landmark-payoff',
          'tully',
          'warm',
          'That earns its place. I have walked past it all winter knowing what it meant. Next person gets a better chance than that.',
          a('warm'),
        ),
      ),
      ...when(
        'longnight:shore-work',
        'lanterns',
        n(
          'lamp-walk',
          'Tully shows you the first catch before letting you handle the next. With the lamp cold and supported, you check the hinge, the cover, and the little hook that holds them together. Most are sound. One catch closes with a satisfying click and opens again when you gently pull. The sound had been more convincing than the fastening.',
        ),
        s(
          'lamp-check',
          'kestrel',
          'neutral',
          'Show me the test again. Good. A check should be something another person can repeat. We will put that motion on the round sheet, rather than “make sure it seems secure.”',
        ),
        n(
          'lamp-change',
          'You hold the lamp steady while Tully replaces the hook. Saoirse passes the correct spare from the box without trying to redesign it. When the new catch closes, you repeat the pull. This time it holds. The old piece goes into a marked envelope for Jory, who supplies the replacements. Tully wants him to see the wear before anyone orders a dozen more.',
        ),
        s(
          'lamp-payoff',
          'tully',
          'warm',
          'That will save a cold walk back with a loose cover. Put your initials beside the check. When Jory asks what happened, he can ask the person who actually tested it.',
          a('warm'),
        ),
      ),
      n(
        'returning-visitor',
        'A voice calls from the bridge. Tully raises his hand to the student escort bringing two visitors around the turn. You stand aside while they pass. One visitor is laughing at a story; the other is concentrating on their feet. Neither knows about the record discrepancy or the petals. Both benefit from the little work you have just finished.',
      ),
      n(
        'one-heavy-bag',
        'The escort carries the heavier bag. Tully asks whether they want to rest at the cottage or continue up to the hall. They choose the hall, where someone is keeping supper warm. He waits until they reach the next lamp before turning back to you. The waiting is part of the work, and it cannot be made quicker by looking busy.',
      ),
      s(
        'tully-memory',
        'tully',
        'neutral',
        'My first winter, I took the lamps down as soon as the last expected boat came in. My predecessor asked how I knew nobody unexpected would arrive. I did not have a good answer. Now the final round is a handover, not an assumption that everybody is home.',
        k(),
      ),
      n(
        'landing-boundary',
        'At the old landing, Kestrel checks the stone under the snow, then the posts, then the line between them. The boats remain tied at the cottage. Nobody is crossing the ice. She places two small ward markers on the dry side of the rope and leaves enough clear space for you to step back. Tully stays where he can watch the route as well as the exercise.',
      ),
      s(
        'spell-instructions',
        'kestrel',
        'neutral',
        'A narrow reading. Choose the water beyond the landing as your subject, then let the older trace come into view without reaching for it. If you become cold or dizzy, lower your hand and say so. I will close the reading. No observation requires you to endure it at any cost.',
        a('attentive'),
      ),
      n(
        'case-opened',
        'Saoirse opens her lantern case on a dry stone. The instrument is only a steady reference light tonight; it will not pull anything out of the lake. She sets a blank page beside your notebook and weighs both down. Your fingers already feel clumsy inside their gloves. Kestrel asks you to move them and checks your answer before she begins.',
      ),
      ...when(
        'emberfall:work-plan',
        'simple',
        n(
          'plain-cover-winter',
          'The plain removable cover from Emberfall fits around the reference lamp. Saoirse folds it back with two fingers. The modest design is easy to use in gloves, which had not been part of your original reasoning. She looks pleased enough to add it to the list now.',
          [a('warm')],
        ),
      ),
      ...when(
        'emberfall:work-plan',
        'shared',
        n(
          'adjustable-cover-winter',
          'Saoirse tries the adjustable cover you helped keep in the Emberfall plan. Its little lever is awkward in gloves. She uses the plain spare cover instead and writes “larger handle” on a separate scrap. The investigation page remains clear. A design can be worth keeping and still need changing.',
          [a('attentive')],
        ),
      ),
      ...when(
        'emberfall:work-plan',
        null,
        n(
          'cover-winter-legacy',
          'The reference lamp has a plain cover that Saoirse can fold back without removing her gloves. She tests it once, sets it beside the case, and leaves the experiment itself to you. Her notebook has room for a sketch and for what the sketch cannot show.',
          [a('attentive')],
        ),
      ),
    ],
    3,
  ),
  ...section(
    'seven-lights',
    'What the water has kept',
    'mere',
    [
      n(
        'frozen-mere',
        'Snow has softened the boathouse roof across the bay. Beyond it, the academy’s windows make broken golden lines on the ice. The ordinary shore lamps burn above the surface, where Tully hung them. You identify those first. Their reflections move when you move your head. The older memory, if it answers, will have to be distinguished from all that present light.',
      ),
      n(
        'echo-begins',
        'You settle your feet on the cleared stone and raise your hand. Echosight starts as a slight doubling at the edge of a reflected window. Kestrel asks you to narrow your attention. You let the castle blur. A different warmth gathers below the surface, far closer than the buildings, and the first small flame becomes visible.',
      ),
      s(
        'saoirse-counting',
        'saoirse',
        'attentive',
        'One at the far side. Three down the left. Three down the right. There is a gap towards us. I am counting the small lights, not the windows.',
        k(),
      ),
      {
        ...n(
          'seven-lights-detail',
          'Seven small amber flames form an open ring within the lake’s echo: one at the far end and three on each side, leaving a gap nearest the landing. Faint human-shaped reflections stand beside them, with no clear faces. Snow and blue ice remain visible through the memory. You are on the stone landing behind the boundary; no one is standing on the ice.',
        ),
        illustration: {
          art: 'lake-seven-lights',
          alt: 'Seven amber memory lights in an open horseshoe beneath blue ice, seen from a snow-edged stone landing; faint indistinct keeper reflections appear beside them.',
        },
      },
      n(
        'echo-sound',
        'A sound comes with the last light. It might first be mistaken for a rope running through a hand: a soft roughness, then several breaths taken at different times. The figures resolve just enough for you to see arms lifting. Each small flame waits apart from the others. None is drawn into place by a central fire.',
      ),
      s(
        'record-instructions',
        'kestrel',
        'neutral',
        'I can hold this reading for a little longer. Choose what you will record closely. Saoirse, take the other part. We will compare after closing, while both accounts are still fresh.',
        a('attentive'),
      ),
      decide(
        'echo-record',
        'There is more happening than one person can write at once. The arrangement of the lights and the fragment of speech both matter. You and Saoirse can divide the observation without trying to make either account complete.',
        'What will you attend to?',
        [
          {
            id: 'pattern',
            label: 'Follow how each separate light joins the open ring.',
            journal:
              'At Longnight I recorded seven lights joining separately, with a gap left in the ring. Saoirse recorded the fragment of invitation.',
            remember: ['saoirse', 'kestrel', 'tully'],
          },
          {
            id: 'words',
            label: 'Listen for the words spoken as the lights are offered.',
            journal:
              'At Longnight I recorded the fragment “if you wish” and separate answering voices. Saoirse recorded the seven lights and the open gap.',
            remember: ['saoirse', 'kestrel', 'tully'],
          },
        ],
        [a('attentive'), k()],
      ),
      ...when(
        'longnight:echo-record',
        'pattern',
        n(
          'pattern-observation',
          'You mark seven positions. The first light brightens; the others remain dim. Then a second answers. There is no sweep carrying them all together. The near-left flame pauses long enough for your pencil to stop above the page, then joins at its own pace. The opening nearest you stays open. When you try to draw a line across it, your pencil has nothing to follow.',
        ),
        s(
          'pattern-account',
          'saoirse',
          'attentive',
          'I heard “if you wish.” Then more than one voice answering. I cannot make out the names. You have the order? Good. I nearly made all the answers one sound because I wanted to keep up.',
          k(),
        ),
      ),
      ...when(
        'longnight:echo-record',
        'words',
        n(
          'words-observation',
          'You keep your pencil still for the first breath. A voice says something too faint to catch, then “if you wish.” Silence follows. An answer comes from the left, another from farther away, a third almost over it. You write the clear phrase and leave spaces for what you cannot hear. The last answer arrives after a pause, in its own time.',
        ),
        s(
          'words-account',
          'saoirse',
          'attentive',
          'Seven, joining separately. This one waited. The gap stayed open even after the last light answered. I have drawn it twice because my first sketch made the ring look closed.',
          k(),
        ),
      ),
      n(
        'reflection-crack',
        'As the seventh light steadies, a thin dark break crosses the reflected academy. You feel it before you understand what you are seeing: a missing strip where a row of warm windows ought to be. Above the lake, the actual windows remain whole. Saoirse’s pencil drops onto the notebook. Her breath catches sharply enough for Kestrel to hear.',
        [a('scared'), k('grave')],
      ),
      s(
        'closing-reading',
        'kestrel',
        'grave',
        'Lower your hand. Stay where you are. We have enough for tonight.',
        a('scared'),
      ),
      n(
        'closed-reading',
        'You lower your hand. The small flames dim in the order you noticed them, and the figures lose their shape. Kestrel closes the two markers together. The ordinary reflected windows return to their familiar wavering lines. Tully has already opened the way back from the landing. He gives Saoirse her pencil without asking her to bend for it.',
      ),
      s(
        'saoirse-question',
        'saoirse',
        'scared',
        'If the Heartfire goes out, will the school disappear?',
        k('grave'),
      ),
      s(
        'first-answer',
        'kestrel',
        'grave',
        'The buildings will remain. I will explain the rest at the workbench, where your hands can get warm. We are finished with the water.',
        a('scared'),
      ),
      n(
        'return-with-pages',
        'You close the notebook on a loose sheet so neither observation rubs against the other. Tully collects the ward markers after Kestrel releases them. The return is slower than the outward walk. Nobody calls for another look. The useful thing now is to bring everyone and the work back together.',
      ),
    ],
    3,
  ),
];
