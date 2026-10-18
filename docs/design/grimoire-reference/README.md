# The illuminated grimoire: design reference

The design the owner chose on 18 October 2026 (design-and-refine session) for the screens outside the story: Your day, map, story, people, spells, calendar, journal. It is a working mock-up, not game code; `DESIGN_PLAN.md` at the repo root says how to build it into the game.

- `screens/`: the final design at 1440×900 (`today`, `people`, `spells`, `calendar`, `journal`, `story`, `map`) and two of today's screens for comparison (`before-*`).
- `VariantC.jsx` with `variantC.css`: the grimoire (an open book on a desk, two-page spreads, ribbon bookmarks, the cat on the desk). Render it as `<VariantC f />`: the `f` flag turns on the owner's chosen touches.
- `variantF.css`: the owner's picks from the other drafts (rose-tinted buttons, arched windows with thin gold outlines, the lighter settings button, gold vines on the desk).
- `variantF3.css`: the last round (darker parchment, candle glow and gold motes, marginalia).
- `ornaments.jsx` (vines, filigree, motes, sparkles) and `marginalia.jsx` (margin notes, lantern and leaf sketches, moon phases, gesture diagrams).
- `fixtures.mjs`: the sample evening every screen shows (14 October, Lantern Hall).
