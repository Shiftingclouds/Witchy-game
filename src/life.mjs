import { isBookLike } from './engine/modes.mjs';
import { characters, characterById, locationById } from './content.mjs';
import { castDetails, dailyLines, supportingDialogues } from './cast.mjs';

const choice = (label, outcome, bond = 4, points = 4) => ({ label, outcome, bond, points });
export const dailyEvents = [
  {
    id: 'loose-pages',
    title: 'A book with loose ends',
    location: 'library',
    host: 'imogen',
    intro:
      'A returned book has come apart at the spine. Between its pages is a note nobody signed. Imogen sets out thread, a pencil, and two cups of tea.',
    choices: [
      choice(
        'Help bind the pages in their original order.',
        'We repaired the binding together. The old notes stayed exactly where their writers left them.',
      ),
      choice(
        'Make a little pocket to keep the loose note safe.',
        'We added a pocket inside the cover. The next reader will find the note without losing it.',
        5,
        3,
      ),
    ],
  },
  {
    id: 'raven-delivery',
    title: 'A letter without an address',
    location: 'rookery',
    host: 'noor',
    intro:
      'A raven has delivered a letter marked simply for someone having a difficult day. Noor is deciding what to do with it.',
    choices: [
      choice(
        'Leave it on the infirmary reading table.',
        'We left the letter where someone waiting might find it. Noor tucked a feather beside it.',
      ),
      choice(
        'Write another letter and start a little collection.',
        'We wrote two small letters and labelled a box: take one when you need it.',
        5,
        3,
      ),
    ],
  },
  {
    id: 'quiet-tea',
    title: 'One more cup',
    location: 'nana-pearl',
    host: 'nana',
    intro:
      'Pearl has made enough tea for four and set out three cups. An old photograph lies beside the empty place.',
    choices: [
      choice(
        'Ask about the person in the photograph.',
        'Pearl told me about a friend who taught her to make the tea properly. We used the fourth cup for flowers.',
        5,
        3,
      ),
      choice(
        'Offer to make the next pot.',
        'I learned Pearl’s exact way of warming the pot. She let me get it almost right before helping.',
      ),
    ],
  },
  {
    id: 'runaway-seedlings',
    title: 'The wandering seedlings',
    location: 'glasshouses',
    host: 'rhys',
    intro:
      'A tray of seedlings has begun wandering toward the doorway. Rhys is watching rather than pulling them back.',
    choices: [
      choice(
        'Follow them and see what they need.',
        'The seedlings wanted a patch of gentler light. We moved their tray and watched them settle.',
      ),
      choice(
        'Make a little shaded shelter on their bench.',
        'We gave the seedlings a quiet corner. Rhys wrote a label: listened to, not corrected.',
        5,
        3,
      ),
    ],
  },
  {
    id: 'practice-landing',
    title: 'A gentler landing',
    location: 'glimmer-pitch',
    host: 'marcus',
    intro:
      'A nervous beginner is circling the lowest hoop. Marcus calls for a volunteer to help with the landing practice.',
    choices: [
      choice(
        'Stand by the landing markers and encourage them.',
        'I kept my voice steady until their feet touched the boards. The whole team applauded the landing.',
      ),
      choice(
        'Help Marcus move the practice hoop lower.',
        'We lowered the hoop. Starting small made room for the beginner to try again.',
        5,
        3,
      ),
    ],
  },
  {
    id: 'lantern-repair',
    title: 'The reluctant lantern',
    location: 'lamplighters',
    host: 'jory',
    intro:
      'One of Jory’s lamps sputters whenever he puts its glass back. The evening route is waiting, but he will not leave it unreliable.',
    choices: [
      choice(
        'Help clean the tiny air vents.',
        'We cleared a season of dust from the vents. The flame stood up straight, as if relieved.',
      ),
      choice(
        'Keep him company while he works through the problem.',
        'I held the tools while Jory tested each possibility. He wrote my name beneath his on the repair tag.',
        5,
        3,
      ),
    ],
  },
  {
    id: 'creature-lunch',
    title: 'Lunch for a little stranger',
    location: 'menagerie',
    host: 'toby',
    intro:
      'Toby has found a very small, very suspicious visitor beneath the feeding bench. It will not come out while anyone watches.',
    choices: [
      choice(
        'Prepare a plate and give it some space.',
        'We left a tiny lunch behind the bench. By the time we looked back, only crumbs remained.',
      ),
      choice(
        'Sit quietly with Toby until it feels safe.',
        'We sat without trying to coax the visitor out. Eventually it chose to come a little closer.',
        5,
        3,
      ),
    ],
  },
  {
    id: 'weather-notes',
    title: 'A forecast of small things',
    location: 'weathervane-room',
    host: 'tick',
    intro:
      'The weather glass is predicting a rain of feathers. Tick suspects the instrument has confused tomorrow’s weather with somebody’s plans.',
    choices: [
      choice(
        'Compare the glass with the outdoor instruments.',
        'We checked the instruments one at a time. The glass had been listening to the rookery next door.',
      ),
      choice(
        'Write down what it says before adjusting it.',
        'We kept the strange forecast in the log. Tick says a useful mistake deserves a proper record.',
        5,
        3,
      ),
    ],
  },
];
export const festivalEvents = [
  {
    id: 'arrival-day',
    month: 9,
    day: 1,
    title: 'A place for the new arrivals',
    location: 'lantern-hall',
    host: 'rowan',
    intro:
      'The last boat has reached the shore. There are still new students standing uncertainly in the doorway, holding lanterns they do not quite know what to do with.',
    choices: [
      choice(
        'Make room at your table.',
        'We pulled the chairs a little closer. Someone who had been hovering by the doorway finally sat down.',
      ),
      choice(
        'Help Rowan hang the newcomers’ lanterns.',
        'We hung each lantern where its owner could see it. The ceiling looked a little less unfamiliar.',
        5,
        3,
      ),
    ],
  },
  {
    id: 'emberfall',
    month: 10,
    day: 31,
    title: 'A light for someone remembered',
    location: 'lantern-hall',
    host: 'flick',
    intro:
      'Paper lanterns cover the festival tables. Flick leaves a space on every one for the name of somebody whose kindness mattered.',
    choices: [
      choice(
        'Write a name and share the story behind it.',
        'I gave a small kindness a name. Flick hung the lantern where people could stop and read it.',
      ),
      choice(
        'Make a spare lantern for someone who arrives alone.',
        'We left a blank lantern and a pen by the door. Someone took a long time choosing a name.',
        5,
        3,
      ),
    ],
  },
  {
    id: 'longnight',
    month: 12,
    day: 21,
    title: 'Keeping the longest night',
    location: 'lantern-hall',
    host: 'noor',
    intro:
      'Snow presses against the windows. Noor has brought a box of unsent letters and asks if anyone would like company while they write.',
    choices: [
      choice(
        'Write to someone you have been meaning to thank.',
        'I finished a letter I had put off for too long. Noor promised to find it a careful messenger.',
      ),
      choice(
        'Help make warm drinks for the letter writers.',
        'We carried mugs between the tables. The room stayed bright long after the clocks fell quiet.',
        5,
        3,
      ),
    ],
  },
  {
    id: 'first-thaw',
    month: 3,
    day: 20,
    title: 'The first walk after winter',
    location: 'mere',
    host: 'tully',
    intro:
      'The shore path is open again. Tully carries a bag for the little things the winter water has washed up.',
    choices: [
      choice(
        'Help clear the path for the next walkers.',
        'We cleared the path together and set a little sign beside the soft ground: new shoots, mind your step.',
      ),
      choice(
        'Ask Tully about the first spring he remembers here.',
        'We walked slowly while Tully remembered a much smaller boat. The path could wait a moment.',
        5,
        3,
      ),
    ],
  },
  {
    id: 'bloomtide',
    month: 5,
    day: 1,
    title: 'A promise in a seed',
    location: 'glasshouses',
    host: 'saoirse',
    intro:
      'Saoirse has found enough pots for everyone, though none of them match. The Bloomtide tradition is to plant something you will help grow.',
    choices: [
      choice(
        'Plant a seed and promise to return.',
        'I planted a seed in a chipped blue pot. Saoirse put it where we will both see it every day.',
      ),
      choice(
        'Make a shared planter for the common room.',
        'We planted a small garden with room for more hands. Its label reads: ours.',
        5,
        3,
      ),
    ],
  },
  {
    id: 'homecoming-lights',
    month: 6,
    day: 21,
    title: 'Lanterns on the water',
    location: 'boathouse',
    host: 'tully',
    intro:
      'For midsummer, the boats carry lanterns along the shore. Tully is fitting soft loops to their handles so nobody drops a light overboard.',
    choices: [
      choice(
        'Help ready the boats for the evening crossing.',
        'We checked every handle. When the boats went out, their small lights held steady.',
      ),
      choice(
        'Make a place aboard for someone coming on their own.',
        'We made space beside us. The ride across the mere became the beginning of another friendship.',
        5,
        3,
      ),
    ],
  },
];
export const allEvents = [...dailyEvents, ...festivalEvents];
export const eventById = Object.fromEntries(allEvents.map((e) => [e.id, e]));
export const dayNumber = (date) => Math.floor(Date.parse(date + 'T12:00:00Z') / 86400000);
export function eventForDay(state) {
  if (isBookLike(state.mode)) return null;
  const m = Number(state.date.slice(5, 7)),
    d = Number(state.date.slice(8, 10));
  return (
    festivalEvents.find((e) => e.month === m && e.day === d) ||
    dailyEvents[
      ((dayNumber(state.date) % dailyEvents.length) + dailyEvents.length) % dailyEvents.length
    ]
  );
}
export function characterLocation(state, id) {
  const c = characterById[id];
  if (!c) return null;
  const event = eventForDay(state);
  if (event?.host === id) return event.location;
  const routine = castDetails[id].routine;
  const weekend = [0, 6].includes(new Date(state.date + 'T12:00:00Z').getUTCDay());
  if (weekend && c.index <= 7 && state.period === 1)
    return ['thimble-cross', 'sweetshop', 'wrens-nest'][c.index % 3];
  return routine[state.period];
}
export function peopleHere(state, location = state.location) {
  const anchor = locationById[location]?.person;
  return characters
    .filter((c) => characterLocation(state, c.id) === location)
    .sort((a, b) => Number(b.id === anchor) - Number(a.id === anchor) || a.index - b.index);
}
export function routineFor(state, id) {
  return Array.from({ length: 4 }, (_, period) => characterLocation({ ...state, period }, id));
}
export function dailyConversation(state, id) {
  const choices = dailyLines[id];
  if (choices) return choices[(dayNumber(state.date) + characterById[id].index) % choices.length];
  const details = castDetails[id];
  if ((state.bonds[id] || 0) >= 20 && supportingDialogues[id]?.trust)
    return supportingDialogues[id].trust;
  return [
    details.hello,
    `I am glad you stopped by. ${characterById[id].bio}`,
    `There is always more to do, but it can wait for a little company. ${details.hello}`,
  ][(dayNumber(state.date) + characterById[id].index) % 3];
}
