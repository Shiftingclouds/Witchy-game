# Design Implementation Plan: the illuminated grimoire

## Summary

- **Scope:** the in-game screens outside the story (the "shell"): navigation, Your day, World map, The story, People, Grimoire, Calendar, Journal.
- **Target:** `src/main.jsx` (shell layout, views, `Atlas`, `Story`, `People`, `Grimoire`, `Calendar`, `Journal`), `src/World.jsx` (Your day), `src/features/shell/` (sidebar), `src/theme/`.
- **Chosen design:** variant C, "the illuminated grimoire", with the owner's touches (called F in the session). The reference mock-up and screenshots are in `docs/design/grimoire-reference/`.
- **Why:** the owner found today's screens flat and too much like a website. They loved the grimoire whole, plus these touches from the other drafts:
  - rose-tinted buttons;
  - rounded-window frames with thin gold outlines;
  - the lighter settings button;
  - gold vines on the dark desk, with green vines on the parchment.
- **Final round:** more glow and sparkle, fuller pages (marginalia), and darker parchment.

## What the screens become

- **The desk:** a dark, lamplit desk with a breathing candle-light pool and drifting gold motes. Gold vines climb both sides. A thin top line shows "Lanternmere", the date and time, and the settings button. Your familiar sits on the desk at the bottom left, using its own `fam-<id>` art.
- **The book:** an open book fills the desk.
  - Each section is a two-page spread on aged parchment, with stacked page edges, a leather cover, a gutter shadow and a golden halo.
  - Pages carry a running head, a folio number and green vines in the margins.
  - Section text opens with a gilded drop capital, and dates and labels are in red ink.
- **The ribbons:** silk bookmarks on the book's right edge replace the sidebar: Today, Map, Story, People, Spells, Calendar, Journal. The open one slides out and glows.

| Section  | Left page                                                                                                            | Right page                                                                                                                            |
| -------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Today    | The place's painting as an arched "plate" with a caption                                                             | The date as a heading, a short greeting, the people present as arched portraits, tonight's errand, rose action buttons, a margin note |
| Map      | One plate across both pages with "you are here"                                                                      | (same)                                                                                                                                |
| Story    | Contents with chapter numerals, dot leaders and page numbers; finished chapters struck through in gold               | The current chapter, its goal, and "Open the storybook"                                                                               |
| People   | Portraits in arched windows with role and a friendship leaf row (met people only)                                    | (continues) and a margin note                                                                                                         |
| Spells   | One learned spell per page: a sigil ring, school, drop-cap description, gesture, gesture diagram, the class question | A count of blank leaves still to learn                                                                                                |
| Calendar | A hand-ruled month: today in red, events underlined, the feast in gold; moon phases                                  | Feasts and observances with dates, and a margin note                                                                                  |
| Journal  | Entries with red-ink dates, plus a pressed leaf                                                                      | More entries, then ruled "Notes to self"                                                                                              |

## Files to change

- [ ] `src/features/shell/` gets the new shell: `Desk.jsx` (desk, top line, familiar, vines, glow), `Book.jsx` (`Spread`, `Page`, running heads, folios), `Ribbons.jsx`, and `grimoire.css`. Port from `docs/design/grimoire-reference/VariantC.jsx`, `variantC.css`, `variantF.css` and `variantF3.css`.
- [ ] `src/components/lamplight/` gets the ornaments: `Vine`, `Motes` and `Sparkle` (from `ornaments.jsx`), and `MarginNote`, `PressedLeaf`, `LanternSketch`, `Moons` and `GestureSketch` (from `marginalia.jsx`).
- [ ] `src/main.jsx`:
  - replace the sidebar and top-bar layout with `Desk` plus `Book`;
  - map each `view` to a spread: `world`→Today, `map`→Map, `book`→Story, `people`, `spells`, `calendar`, `journal`;
  - move "Settings & saves" and "Main menu" to the desk's top line.
- [ ] `src/World.jsx`: Your day becomes the Today spread. It keeps every current action: look around, talk, people here, story goal and requirements, festival, house.
- [ ] The `People`, `Grimoire`, `Calendar`, `Journal`, `Atlas` and `Story` functions in `src/main.jsx` render into spreads. Keep their logic: met-only people, learned-only spells, upcoming festivals only, journal export, and notes.
- [ ] `src/theme/`: add parchment tokens for the book (`--gm-parch #e4cfa3`, `--gm-parch-edge #a07a45`, `--gm-ink #2b1a10`, `--gm-ink-soft #553c28`, `--gm-rubric #8a2b1e`, `--gm-gilt #b07d2a`, `--gm-verdigris #4f6b45`). Add a darker set for the Night reading mode.
- [ ] Tests in `tests/browser/*.spec.js`: navigation now uses ribbons. Keep the old accessible names (`aria-label` "Your day", "World map", "The story", "Grimoire") on the ribbons so existing tests keep working, or update the tests in the same change.
- [ ] `DESIGN.md`: record the grimoire world for the shell once it ships (Impeccable `document`).

## Implementation steps

1. **Ornaments first:** port the vines, motes, sparkle and marginalia components with their CSS, plus a unit render check.
2. **Desk and book frame:** `Desk`, `Book`, `Spread` and `Ribbons` with the existing views plugged in unchanged, so the game works while each spread is restyled.
3. **One spread at a time, each with its browser test:** Today, then Journal, Calendar, Spells, People, Story, Map. Keep every current control and its text.
4. **Real marginalia, never invented facts.** Margin notes come from the player's own story:
   - the latest journal entry;
   - a met character's routine;
   - the next festival's description.

   Moon phases come from the game date. Each spell needs its own gesture diagram; spells without one show none.

5. **Small windows (1024×700 minimum):**
   - below about 1180px wide, the book narrows and its pages scroll inside themselves;
   - below about 900px, it becomes a single page with ribbons along the top.

   No page-level horizontal scrolling.

6. **Reading settings:** text size scales page text, and reduced motion stops the candle, motes and gilt shimmer. In the Night reading mode, the darker parchment uses the same layout.
7. **Review:** Impeccable `critique` and `polish` on each spread, at 1440×900 and 1024×700.

## Component API (new)

- `Spread({ left, right, folio, wide? })`: a two-page spread; `wide` makes one plate span the gutter (Map).
- `Ribbons({ view, onChange })`: items `[id, label, colour]`, with `aria-current` on the open one.
- `Desk({ game, onSettings, onMenu, children })`: the desk, top line and familiar (`game.familiar`).
- `MarginNote({ children, tilt, arrow })`, `PressedLeaf({ size })`, `LanternSketch()`, `Moons({ date })`, `GestureSketch({ spell })`.

## Required UI states

- **Empty:** no journal entries yet gives a single line ("The pages are waiting for your first evening."). No spells learned shows blank leaves and the first lesson's place. No people met shows a quiet note.
- **Loading:** saves load synchronously, so there is no loading state. Art falls back to the existing placeholders.
- **Disabled:** actions that aren't possible right now show as faded ink with the reason in a title.
- **Error:** the existing ErrorBoundary.

## Accessibility checklist

- [ ] The ribbons are a `nav` with buttons, `aria-current`, and keyboard order Today through Journal.
- [ ] Focus rings in red ink on parchment and gold on the desk.
- [ ] Contrast of ink and ink-soft on the darker parchment of at least 4.5:1 (about 9:1 and 6:1 measured in the mock-up).
- [ ] Decorative SVGs are `aria-hidden`; portraits have names.
- [ ] Reduced motion stops all ambient animation.

## Testing checklist

- [ ] Unit: the moon phase from a date, and the marginalia source selection.
- [ ] Browser: each ribbon opens its spread, plus the existing journeys (People talk, Grimoire, Calendar, Journal notes and export).
- [ ] Browser at 1024×700: nothing overflows the window.
- [ ] Electron smoke test.

---

_Generated by the design-and-refine session, 18 October 2026_
