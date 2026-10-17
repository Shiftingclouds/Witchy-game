// The first-year mystery as a sequence of stages, one per authored chapter.
// A stage's revelation becomes known when that chapter (Guided) or milestone (Open World) is reached.
export const MYSTERY_STAGES = [
  {
    chapter: 0,
    revelation:
      'On arrival night the hall lantern above the new students goes out for no visible reason: cold outside, seal intact, no smoke. Grey, the caretaker, logs it, finds no broken fitting and cannot relight it normally.',
  },
  {
    chapter: 1,
    revelation:
      'During the first Kindle lesson the player (and Rowan) hear a voice beneath the flame: "Remember the way home." Elian can reproduce the light but not the voice.',
  },
  {
    chapter: 2,
    revelation:
      'In the Library registers, working and formal records disagree: certain workers and keepers were left out of the formal record. A supervised echo suggests care and return, not malice. Motive and cause remain unproven.',
  },
  {
    chapter: 3,
    revelation:
      'At Emberfall, moonflowers in the Glasshouses are shown to hold an echo of warmth — a way to preserve evidence. An echo is not a living person.',
  },
  {
    chapter: 4,
    revelation:
      "At Longnight, Echosight on the Mere reveals seven willing lights in an open circle: the first keepers offered their light freely. If the academy's welcoming magic fails, the buildings remain but the welcome does not. Midsummer is the deadline to restore it.",
  },
  {
    chapter: 5,
    revelation:
      'At First Thaw the Candlestones inscription confirms that light must be freely offered and that the circle keeps a space for newcomers. Threadbind must connect willing people, never compel them.',
  },
  {
    chapter: 6,
    revelation:
      'By Bloomtide the restoration needs recovered names, the register, willing participants, the three spells and repaired friendships — a plan tested together, with consent, and no single person sacrificing themselves.',
  },
  {
    chapter: 7,
    revelation:
      "At midsummer in the Heartfire, willing lights joined by Threadbind restore the academy's welcoming light. The future is an ongoing shared responsibility.",
  },
];

// Storyteller-only. Never revealed directly to the player.
export const MYSTERY_TRUTH = `STORYTELLER ONLY — never state this outright; let it be discovered through milestones, evidence and people.
Lanternmere's welcome is a living light first offered freely by seven keepers, renewed each year by willing people. Over time the academy's formal records quietly left out the workers and keepers who sustained it, and the light — which depends on everyone who belongs being remembered — began to fail, starting with the lantern above the newest arrivals. Nobody is a villain; the harm is forgetting. Restoration happens at the Heartfire at midsummer (21 June) when willing friends join their lights with Threadbind, leaving an opening for whoever comes next. The authored story ends one of two ways: shared stewardship (no single person keeps the light alone) or the player becoming a keeper who teaches the ritual to others. In the Open World other honest resolutions are possible, but never coercion, sacrifice demanded of one person, or a chosen-one destiny.`;
