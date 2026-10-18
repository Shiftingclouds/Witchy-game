# World art requests for ChatGPT

The cast and places Lanternmere needs to feel like a living world, especially for the Open World (sandbox) mode, where people should be everywhere and remember you. Interface art for the redesign is in `ART_REQUESTS.md`; the original planning queue is in `docs/ART_COMPLETION.md` and `docs/CAST_EXPANSION.md` (this list turns them into paste-ready requests and adds more people and places).

Work in small batches, top to bottom. Status per item: **wanted**, **received**, **placed**.

## Placeholders in the game

Every file in these lists has a slot in `art/slots.json` (generated from these documents by `python3 scripts/make_art_slots.py`). Until the real file exists, the build paints a clearly marked **ART NEEDED · filename** placeholder wherever the game would show it, and the Art collection in Settings lists it. To fill one: save ChatGPT's image as `art/<exact filename>` (portraits as transparent PNG), then run `npm run build` (or `npm run app`). The placeholder disappears and the real art takes its place everywhere. Portrait expressions also need registering on the character sheet (each slot's `placement` says where).

## What the AI modes show

The Guided Tale and the Open World use the same portraits and places as the prebuilt game: speakers from the cast get their portrait beside each line (falling back to neutral when an expression has no art yet), and places come from the existing 37 locations. **Batch 2 expressions are the most visible upgrade for AI play**, since Claude picks an expression for every line. People Claude invents are shown in words only (a name and a short description), so they need no art. Batch 5 places stay off-limits to Claude until you approve and add them.

## How to ask ChatGPT

**For a new character's first portrait** — attach `c01-rowan-neutral.png` and `c02-imogen-neutral.png` as style references, then paste:

> Create ONE new character portrait in exactly the same style as the attached reference portraits: the same dense painterly pixel texture, warm lighting, three-quarter upper-body pose, scale and canvas framing (1122×1402), with a true transparent background. No text, no frame, no collage. Character: **[brief from the tables below]**. Adult. Neutral, calm expression. Keep the full head, hair and shoulders inside the canvas.

**For more expressions of the same character** — attach that character's neutral portrait, then paste:

> Edit the attached portrait to create ONE expression variant: **[expression]**. Keep EXACTLY the same person, face, age, hair, clothing, accessories, lighting, pose, scale, canvas framing and transparent background. Change only the facial expression and the small head or eye movement it needs. No text, no collage.

**For a new place** — attach `lantern-hall.png` (or the named reference) as a style reference:

> Create ONE wide 16:9 environment painting in exactly the same style as the attached reference: painterly fantasy, warm candle and lantern light, rich detail, no people, no text. Place: **[brief]**.

Save each file with the exact filename listed. Portraits are PNG with transparency.

**Placement steps (for me, every portrait):** put the file in `art/`; add the expression to the character sheet's `presentation.expressions` in `characters/active/<id>.json` (new people: move the sheet from `characters/proposed/` to `characters/active/` and fill identity, voice and routine), run `npm run sync:characters`, `npm run check:characters`, then `npm run build` to make the browser derivative. **Every place:** put it in `art/`, add a location row in `src/content.mjs` (new places only after the owner approves them), and use it in at least one scene or routine.

---

## Batch 1 — People (moved)

The 13 proposed people now have full character sheets and their own request list: see **[CHARACTER_ART_REQUESTS.md](CHARACTER_ART_REQUESTS.md)**.

## Batch 2 — Expressions for the people you meet most — wanted

Most of the cast has only a neutral face, so in conversations they can't react. Attach each person's existing neutral portrait and use the expression prompt.

| Files                                                                                                        | Why                                               |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `c02-imogen-scared.png`, `c03-saoirse-surprised.png`                                                         | The leads lack fear and discovery faces           |
| `c04-cas-{warm,amused,grave,tense,shy}.png`                                                                  | Recurring classmate; perfectionism arc            |
| `c05-noor-{warm,amused,grave,tense,shy}.png`                                                                 | Recurring classmate; letters home                 |
| `c06-idris-{warm,amused,grave,tense,shy}.png`                                                                | Recurring classmate; returning to study           |
| `c07-toby-{warm,amused,grave,tense,shy}.png`                                                                 | Recurring classmate; creature care                |
| `c11-rhys-{grave,amused}.png`, `c19-tully-{grave,amused}.png`, `c08-kestrel-amused.png`                      | Quest hosts (some warm/grave faces already exist) |
| `c20-priya-`, `c21-flick-`, `c22-marcus-`, `c37-nana-`, `c42-lettice-` + `{warm,grave,amused}.png`           | Quest hosts. Lettice stays ghostly/spectral.      |
| `c31-hask-{warm,guarded,hurt}.png`, `c34-jory-{warm,amused,tense}.png`, `c46-honoria-{warm,tense,tired}.png` | Key witnesses in the mystery                      |

Later (only once they speak a lot): `warm` and `grave` for the remaining 27 supporting characters listed in `docs/ART_COMPLETION.md` (P3).

## Batch 3 — More people (moved)

The 14 new people for a living world now have full character sheets and their own request list (some renamed): see **[CHARACTER_ART_REQUESTS.md](CHARACTER_ART_REQUESTS.md)**.

## Batch 3b — The new beginning (letter, journey) — wanted

Requested in one file for ChatGPT: [CHATGPT_PROLOGUE_ART.md](CHATGPT_PROLOGUE_ART.md).

| File | What | Where |
| --- | --- | --- |
| `train-carriage.png` | Inside the green train, late afternoon | The `train` section of the opening |
| `cg-acceptance-letter.png` | Close-up of the Lanternmere letter on the kitchen table | After the letter is opened |
| `journey-countryside.png` | Hills, pines and the lake from the train window | During the train journey |
| `crest-owlcombe.png` | Owlcombe crest (owl) | House choice, common room, Your day |
| `crest-rookhallow.png` | Rookhallow crest (raven) | House choice, common room, Your day |
| `crest-heronmere.png` | Heronmere crest (heron) | House choice, common room, Your day |
| `crest-larkspire.png` | Larkspire crest (lark) | House choice, common room, Your day |

## Batch 4 — Places (seasonal variants from the existing plan) — wanted

| File                                                       | Reference to attach              | Brief                                                                                                                                |
| ---------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `dormitory-evening.png`                                    | `home-kitchen.png` lighting      | A modest shared student bedroom in the academy at evening: two beds, desks with books and candles, a window seat, warm and personal. |
| `mere-spring-day.png`                                      | `mere-day.png`                   | The same lake shore in spring: fresh green, blossom, thawing water, soft morning light.                                              |
| `mere-summer-evening.png`                                  | `mere-night.png`, `mere-day.png` | The same shore on a long summer evening: golden light, warm water, fireflies beginning.                                              |
| `classroom-night.png`                                      | `classroom.png`                  | The same classroom at night: dark windows, candles and lanterns, no daylight.                                                        |
| `rookery-night.png`                                        | `rookery.png`                    | The same rookery at night: moonlight, sleeping birds, a single lamp for letter-writing.                                              |
| `thimble-cross-spring.png`, `thimble-cross-summer.png`     | `thimble-cross.png`              | The same village square in spring, and dressed for a summer festival.                                                                |
| `whispering-wood-spring.png`, `whispering-wood-winter.png` | `whispering-wood.png`            | The same woodland in spring growth, and in sparse, frosty winter.                                                                    |
| `boathouse-day.png`                                        | `boathouse.png`                  | The same boathouse in daylight with boats being repaired.                                                                            |

## Batch 5 — New places for a living world (new, proposed) — owner to approve first

Places a living world naturally needs that the game doesn't have yet. The Open World can't invent places, so anything you want to go to must exist as art. Approve the ones you want; I'll add them as locations.

| File                                                                                   | Brief                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dorm-owlcombe.png`, `dorm-rookhallow.png`, `dorm-heronmere.png`, `dorm-larkspire.png` | Each house's student bedroom in its house colours and character (Owlcombe deep blue and books; Rookhallow ember red and hearth; Heronmere teal and water-light; Larkspire yellow-gold and clutter of inventions). Reference the matching common room painting. |
| `bakery-interior.png`                                                                  | Beatrix Kettle's village bakery: ovens glowing, bread on racks, flour in the air.                                                                                                                                                                              |
| `apothecary-interior.png`                                                              | Merrin Thorne's apothecary: amber bottles floor to ceiling, drying herbs, a brass scale.                                                                                                                                                                       |
| `broom-workshop.png`                                                                   | Oren Voss's broom repair workshop: brooms on racks, bristle bundles, tools, a half-repaired racing broom.                                                                                                                                                      |
| `academy-courtyard.png`                                                                | An inner academy courtyard with a fountain, autumn trees and covered walkways; a place to sit between classes.                                                                                                                                                 |
| `bell-tower.png`                                                                       | Top of the academy bell tower at dusk, huge bronze bell, view over the lake.                                                                                                                                                                                   |
| `village-market-day.png` (reference `thimble-cross.png`)                               | Thimble Cross filled with market stalls, awnings and lanterns (no people needed).                                                                                                                                                                              |
| `village-dock.png`                                                                     | The village's little wooden pier on the lake, fishing boats, nets, lamps.                                                                                                                                                                                      |
| `staff-room.png`                                                                       | The teachers' common room: armchairs, a fire, piles of marking, a tea trolley.                                                                                                                                                                                 |

## Batch 6 — Story milestone and clue art — later

Only once the matching scenes are written (see `docs/ART_COMPLETION.md`): `clue-lantern-nameplate.png`, `clue-atlas-shore-path.png`, `clue-station-ticket.png`, `clue-mended-ward.png`, and the four milestone paintings `cg-winter-shore-rescue.png`, `cg-greenhouse-promise.png`, `cg-heartfire-circle.png`, `cg-homecoming-lanterns.png`.
