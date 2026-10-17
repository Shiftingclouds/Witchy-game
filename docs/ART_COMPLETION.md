# Art needed to complete Lanternmere

This is an art production plan, not a claim that these assets exist. It is based on inspection of the supplied environment, character and expression contact sheets, full-size Rowan, Imogen and Noor portraits, the Glasshouses background, the current interface, and the runtime asset lists. The abandoned project's README and JSON sidecars are not sources of story canon.

The scope is one complete academy year, the existing 45-person cast and 37 destinations as a foundation, additional characters as academy life needs them, a substantial authored story with character quests and optional relationships, and both offline reading and world modes. A 250,000-word manuscript needs many distinct scenes; it does not need a new painting for every scene. Different participants, discoveries, weather, time, framing and consequences can make the same room meaningful again.

The tables below are the **original-cast art budget**, not a limit on the finished game. [CAST_EXPANSION.md](CAST_EXPANSION.md) adds a first proposed group of 15 new identities: three faculty, eight dorm companions, one additional athlete, and three tradespeople. Plan 75 additional baseline portraits (neutral, warm, amused, grave, tense), then scene-specific expressions. New house dorm variants and shop interiors are additional where needed. Elian’s neutral portrait and Maelin’s neutral/reflective pair are now produced and integrated; the other designs and files remain planned; use the linked role and visual briefs to commission them in story packages.

## What already works

| Supplied art           |   Count | Production use                                                                              |
| ---------------------- | ------: | ------------------------------------------------------------------------------------------- |
| Backgrounds            |      49 | Academy rooms, four houses, village, lake, ruins, arrival and seasonal states               |
| Portrait files         |      85 | 45 identities; includes six alternate `-v1` files                                           |
| Familiars              |       8 | Companion selection and incidental appearances                                              |
| Original total         | **142** | Preserve source files                                                                       |
| Generated overview map |       1 | Existing `art/academy-map.png`                                                              |
| New teacher portrait   |       1 | `art/c47-elian-vale-neutral.png`, reviewed transparent portrait used in the first practical |

Rowan has 13 canonical expressions, Imogen 13 and Saoirse 12. Dunne has neutral/attentive, Rhys and Tully neutral/warm, and Kestrel neutral/grave/warm. The other 38 original supporting characters and Elian retain one neutral portrait each. Maelin has neutral and reflective expressions. The six `-v1` files are alternatives, not six extra emotions or people. There is no character 39; preserve the uploaded numbering.

The portraits have transparent backgrounds and useful, consistent upper-body framing. Their restrained differences suit dialogue. Their dense painted pixel texture should remain intact; neither vector-style redraws nor smooth 3D characters would fit. Architectural detail, glass, candles and water already give the environments depth without additional decorations.

Existing seasonal/time alternatives to use first:

- `mere-day`, `mere-night`, `mere-frozen` establish the same shore across time and winter.
- `lantern-hall`, `lantern-hall-dark`, `lantern-hall-emberfall`, `lantern-hall-longnight` support the mystery and two major festivals.
- `corridor` / `corridor-night`, `glimmer-pitch` / `glimmer-pitch-snow`, and `thimble-cross` / `thimble-cross-snow` already provide changes worth staging.
- `home-kitchen`, `home-street-night`, `st-ides` and `work` can support a deliberately written before-academy prologue or recollection. They should not become unexplained campus rooms simply to increase the asset count.

## Priority 0: staging without new paintings

Build and evaluate one two-person scene with the supplied trio before commissioning more art. Preload expressions, keep portrait scale and eye positions stable, fade entrances, crossfade expressions briefly and let a listener remain beside the speaker. Reuse the exact existing files; do not alternate `-v1` versions as animation frames.

Browser motion can provide text reveal, restrained camera movement, light opacity changes, drifting motes, mist and fades. It cannot make these flattened paintings contain real lip movement, independent hair motion, hand gestures, walking characters or moving painted water. Those need new frames or separated layers. A moving crop is camera motion, not character animation.

## Portrait production queue

All names below are proposed **source PNG** filenames under `art/`; the browser pipeline produces matching WebP derivatives. Braces enumerate exact requested suffixes, not arbitrary future variations. New expressions also need to be registered in the runtime expression list. Keep neutral as the safe fallback until each file is approved and cached.

| Priority                               | Exact filename pattern                                                                                                                                                                                                                                                                                    |   Count | Scene purpose                                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------: | ------------------------------------------------------------------------------------------------------------------ |
| P1: fill core gaps                     | `c02-imogen-scared.png`; `c03-saoirse-attentive.png`; `c03-saoirse-surprised.png`                                                                                                                                                                                                                         |       3 | Danger, listening and discovery currently lack a close fit for these leads                                         |
| P1: recurring peers                    | `c04-cas-{warm,amused,grave,tense,shy}.png`; `c05-noor-{warm,amused,grave,tense,shy}.png`; `c06-idris-{warm,amused,grave,tense,shy}.png`; `c07-toby-{warm,amused,grave,tense,shy}.png`                                                                                                                    |      20 | Perfectionism, letters home, returning to study and creature care deserve visible emotional progression            |
| P2: substantial quest hosts            | `c08-kestrel-{warm,grave,amused}.png`; `c11-rhys-{warm,grave,amused}.png`; `c19-tully-{warm,grave,amused}.png`; `c20-priya-{warm,grave,amused}.png`; `c21-flick-{warm,grave,amused}.png`; `c22-marcus-{warm,grave,amused}.png`; `c37-nana-{warm,grave,amused}.png`; `c42-lettice-{warm,grave,amused}.png` |      24 | Warding, ecology, forgotten workers, lost property, festival labour, team trust, oral history and remembered music |
| P2: consequential recurring witnesses  | `c31-hask-{warm,guarded,hurt}.png`; `c34-jory-{warm,amused,tense}.png`; `c46-honoria-{warm,tense,tired}.png`                                                                                                                                                                                              |       9 | The records, failing lamps and institutional responsibility need credible reactions                                |
| P3: remaining named speakers           | The 27 prefixes below, each with `-warm.png` and `-grave.png`                                                                                                                                                                                                                                             |      54 | A bounded minimum for lighter roles that actually speak in the finished manuscript                                 |
| **Maximum planned portrait additions** | Complete the packets in order, after scene assignment                                                                                                                                                                                                                                                     | **110** | Every identity would have at least neutral, warm and a serious reaction                                            |

The P3 prefixes are `c09-bassani`, `c10-kovac`, `c12-crook`, `c13-grey`, `c14-moth`, `c15-solano`, `c16-okoro`, `c17-dunne`, `c18-holloway`, `c23-petra`, `c24-hamish`, `c25-delphine`, `c26-bram`, `c27-mina`, `c28-jonty`, `c29-fitch`, `c30-odile`, `c32-tick`, `c33-arkwright`, `c35-morrow`, `c36-corliss`, `c38-dev`, `c40-moll`, `c41-ombree`, `c43-maisie`, `c44-kit`, and `c45-hester`.

P3 is a cap, not an instruction to generate 54 portraits immediately. Remove any set whose character remains an incidental greeting rather than inventing filler scenes to justify it. Add extra special expressions only when a storyboard names the beat and shows why existing art is misleading. `shy` can convey vulnerability or embarrassment; it does not declare a character romanceable. Romance eligibility and adult ages belong in the character bible, not assumptions based on appearance. Friendship scenes must remain satisfying without a romance route.

For every derivative, use that exact person's original as reference. Preserve face, skin tone, hair, clothing, accessories, shoulder outline, canvas size, alpha and eye-line. Lettice stays spectral; Hester keeps the same painted frame. Do not mirror portraits merely to make them face one another: hands, clothes, pins and the direction of lighting are asymmetric. Use placement to compose the scene.

## Background queue

The current year already has autumn and winter identity. Prioritise a personal place and visible spring/summer change. Night schedules also expose paintings with bright windows; a dark CSS filter cannot remove a sunset or turn a sunny window into moonlight.

| Priority | Proposed filename                    | Reference                               | Actual use                                                                                             |
| -------- | ------------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| P1       | `dormitory-evening.png`              | House rooms and `home-kitchen` lighting | A modest personal room for letters, familiar care, rest and private reflection; no new campus building |
| P1       | `mere-spring-day.png`                | `mere-day.png`                          | First Thaw and returning shore life                                                                    |
| P1       | `mere-summer-evening.png`            | `mere-night.png` / `mere-day.png`       | Homecoming and the last weeks of term                                                                  |
| P1       | `glasshouses-night.png` — integrated | `glasshouses.png`                       | Moonflower discoveries and quiet after-hours conversations                                             |
| P1       | `classroom-night.png`                | `classroom.png`                         | Late practice scenes without bright daylight windows                                                   |
| P1       | `rookery-night.png`                  | `rookery.png`                           | Noor's evening letters and the missed-message quest                                                    |
| P2       | `thimble-cross-spring.png`           | `thimble-cross.png`                     | Spring village quest returns                                                                           |
| P2       | `thimble-cross-summer.png`           | `thimble-cross.png`                     | Final festival preparations with a changed season                                                      |
| P2       | `whispering-wood-spring.png`         | `whispering-wood.png`                   | Rhys's ecological recovery quest                                                                       |
| P2       | `whispering-wood-winter.png`         | `whispering-wood.png`                   | A visibly colder, sparse woodland chapter                                                              |
| P2       | `candlestones-day.png`               | `candlestones.png`                      | Reading inscriptions in daylight, distinct from dusk vigils                                            |
| P2       | `boathouse-day.png`                  | `boathouse.png`                         | Routine crossings and boat repairs without a visible night sky                                         |

This is a **12-background** queue. Keep architecture, camera and recognisable landmarks consistent in variants. The optional dormitory needs a location and story use implemented before it enters navigation. Other interiors can retain their current artwork throughout the year. For exterior variants not in this queue, write scenes at the depicted time or explicitly frame the view as an establishing illustration; do not promise full visual coverage of every hour and season.

## Closeups and milestone illustrations

Six evidence closeups make exploration concrete rather than requiring every clue to exist as a hotspot in a wide painting. Commission them after their puzzle text and clues are locked:

| Proposed filename                   | Story use                                                                                                                                |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `clue-lantern-nameplate.png`        | A worn maker's name discovered under a handle                                                                                            |
| `register-study.png` — integrated   | Intact pages with omitted name cells, not visible erasure. The evidence and its limits are supplied in selectable prose in both readers. |
| `clue-atlas-shore-path.png`         | Compare the old route with the current map                                                                                               |
| `moonflower-study.png` — integrated | Compare fallen petals under controlled lighting                                                                                          |
| `clue-station-ticket.png`           | Priya's undated ticket links an arrival to a missing person                                                                              |
| `clue-mended-ward.png`              | Cas and Idris identify where a circle was repaired                                                                                       |

Four later full-scene illustrations are the bounded milestone set: `cg-winter-shore-rescue.png`, `cg-greenhouse-promise.png`, `cg-heartfire-circle.png`, and `cg-homecoming-lanterns.png`. Each must depict a written consequence worth showing: a coordinated rescue, a voluntary personal promise, the shared ritual, and the restored year-end gathering. The greenhouse promise can be intimate friendship or romance depending on the route; keep a first-person player viewpoint so a fixed protagonist appearance is not imposed. The same climax painting can support both authored endings if the changed responsibility is expressed through dialogue and epilogue.

Do not commission a separate romantic illustration for every character. Use existing scenery and expression staging for most relationship moments; create route-specific art only after the relationship arc earns it.

## Optional animation assets, after the scene player works

- **Blink pilot:** `c01-rowan-warm-blink-{half,closed}.png`, `c02-imogen-warm-blink-{half,closed}.png`, `c03-saoirse-warm-blink-{half,closed}.png` — six aligned frames, restricted to the matching warm expression. Evaluate once; do not multiply across every emotion until the result is convincing.
- **Gesture pilot:** `c01-rowan-offer-lantern.png`, `c02-imogen-open-book.png`, `c03-saoirse-hold-moonflower.png` — three new upper-body poses for specific actions. They are not walking sprites or lip-sync frames.
- **Environment layer pilot:** `lantern-hall-{cleanplate,foreground,lamplight-mask}.png`, with equivalent trios for `glasshouses`, `mere-night`, and `heartfire` — twelve derived production layers. Separating foreground elements requires retouching the area behind them; the original cannot supply hidden pixels automatically. These need a layer manifest rather than appearing as new destinations.

These 21 optional production assets are separate from the **132 new story images** in the original-cast queue: 110 portraits + 12 backgrounds + 6 clues + 4 milestone illustrations. These are the original planning budgets, not a current remaining-file total. Two clue slots are fulfilled by `register-study.png` and `moonflower-study.png`; the archive comparison does not justify an erasure painting. The browser collection now contains 161 images, including the new-character packet produced so far and the additional Dunne attentive expression. Produce the opening's teacher and housemates alongside the existing P1 packet as their scenes are written, in small reviewed batches. This document records asset requirements; generation order follows the user's authorized story work.

## Acceptance criteria

1. Approve identity and palette against the original at full size, not just a thumbnail. Check transparent edges against both bright and dark scenes.
2. Run rapid neutral → new expression → neutral swaps at the actual game size. Reject eye/shoulder jumps and unexplained accessory changes. Keep the original source files untouched.
3. Associate every new image with named scene IDs and a fallback before adding it to the build. No orphan assets created just to fill a target count.
4. Check two-person placement and a narrow phone viewport. Faces and meaningful props must remain visible above the dialogue panel.
5. Verify cache size and offline loads. The present browser collection is about 30.0 MiB; a 132-image expansion requires measuring the new download and choosing transparent chapter packs or a clearly labelled complete offline download before assuming the existing all-at-once cache remains appropriate.

## Opening packet review — 16 October 2026

The opening uses Lantern Hall, the night corridor, Heronmere’s underwater common room, the Glasshouses, and the Charms Classroom. The common-room and watering scenes were written after reviewing those exact backgrounds. Elian’s neutral portrait has been reviewed and integrated; the original 142 sources remain unchanged.

Next scene-linked gaps: Elian `{warm,attentive,grave}` for the repeated demonstration, student uncertainty, and voice report; Noor `{warm,attentive}` for the invitation and study hour; Idris `{warm,amused}` for the timetable/model exchange; Cas and Toby `{warm,shy}` for the arrival problem; Grey `{attentive,grave}` for the repair report; Rhys `{attentive}` (warm is now integrated) for the safe trial. These are queued, not generated. Neutral currently remains their truthful available expression.

The first-night section is framed as a corridor/landing establishing view. A private dormitory background is still needed before staging bedroom actions as a distinct location. Mobile reading now keeps the scene visible while longer text scrolls and restarts each line at its beginning.

## Register packet review — 16 October 2026

Four new source PNGs were generated from the existing library and portrait style, reviewed, and integrated in `src/story/register.mjs`:

| Image                                 | Actual scene use                                                                                                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `art/register-study.png`              | `register-detail`: blank name cells on intact paper. Both readers show the image; the prose gives the full observation without requiring image-text recognition. |
| `art/c17-dunne-attentive.png`         | Careful explanations and the accepted correction; transparent expression derived from Dunne’s original portrait.                                                 |
| `art/c48-maelin-quill-neutral.png`    | Introduction and supervised Echosight lesson; new character designed to match the existing art.                                                                  |
| `art/c48-maelin-quill-reflective.png` | Reviewing the printed teaching sheet and acknowledging its error; derived from the neutral portrait.                                                             |

The original library composition supplies the setting, lighting and desk details. The close-up does not replace a campus destination. Maelin’s pair has identical source dimensions; all new portrait files have real transparency. Desktop and 320px phone views were inspected, and browser tests verify decoded images, stable listener placement, offline illustration access and saved bookmarks. Reference captures: [register](register-desktop.png), [phone](register-mobile.png), [cast](register-portraits.png). The browser image collection is 27.2 MiB.

## Emberfall and Longnight packet review — 16 October 2026

Eight further source files are integrated: the night glasshouse, moonflower comparison, Saoirse attentive, Rhys warm, winter cottage, seven-light lake detail, Tully warm and Kestrel grave. The environment variants retain the supplied compositions; portraits preserve identity and true transparency. The evidence views use uncropped images with independently readable prose. Original uploads remain unchanged.

Reviewed captures: [Emberfall cast](emberfall-cast.png), [petals](emberfall-evidence.png), [petals on phone](emberfall-mobile.png), [lake](longnight-evidence.png), [lake on phone](longnight-mobile.png). Both seasonal reader tests verify offline image access and saved decisions. The browser collection is 156 images / 29.0 MiB.

First Thaw now integrates daylight Candlestones, the source-consistent inscription detail and Kestrel's warm expression. The inscription lighting was corrected to match the daytime scene. Reviewed captures: [desktop](thaw-evidence.png), [phone](thaw-mobile.png). Current collection: 159 images / 29.9 MiB. Opening expression gaps and the other planned images remain in the queue.

## Bloomtide packet — source review completed; browser review pending

Grey attentive and Okoro warm were generated from their original portraits and used in the rehearsal. Both retain transparency and their existing identity, clothes and props. Source images were inspected; asset/scene validation and the build passed. The new browser scenario is written but unrun because automatic approval review reached the account usage limit. The collection is now 161 images / 30.0 MiB. A dim Heartfire concept exists outside the repository, unintegrated; Midsummer work is paused at the user's request.
