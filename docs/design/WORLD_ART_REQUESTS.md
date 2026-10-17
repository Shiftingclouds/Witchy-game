# World art requests for ChatGPT

The cast and places Lanternmere needs to feel like a living world, especially for the Open World (sandbox) mode, where people should be everywhere and remember you. Interface art for the redesign is in `ART_REQUESTS.md`; the original planning queue is in `docs/ART_COMPLETION.md` and `docs/CAST_EXPANSION.md` (this list turns them into paste-ready requests and adds more people and places).

Work in small batches, top to bottom. Status per item: **wanted**, **received**, **placed**.

## Placeholders in the game

Every file in these lists has a slot in `art/slots.json` (generated from these documents by `python3 scripts/make_art_slots.py`). Until the real file exists, the build paints a clearly marked **ART NEEDED · filename** placeholder wherever the game would show it, and the Art collection in Settings lists it. To fill one: save ChatGPT's image as `art/<exact filename>` (portraits as transparent PNG), then run `npm run build` (or `npm run app`). The placeholder disappears and the real art takes its place everywhere. Portrait expressions also need registering on the character sheet (each slot's `placement` says where).

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

## Batch 1 — Already designed, never painted (13 people) — wanted

These have character sheets in `characters/proposed/` and story roles in `docs/CAST_EXPANSION.md`. Paint the neutral first; once approved, request **warm, amused, grave, tense** (4 more each).

Expression files, once each neutral is approved: `c49-vesper-sen-{warm,amused,grave,tense}.png`, `c50-edda-moss-{warm,amused,grave,tense}.png`, `c51-soren-bell-{warm,amused,grave,tense}.png`, `c52-nessa-flint-{warm,amused,grave,tense}.png`, `c53-ari-fen-{warm,amused,grave,tense}.png`, `c54-iona-reed-{warm,amused,grave,tense}.png`, `c55-milo-wick-{warm,amused,grave,tense}.png`, `c56-tamsin-wren-{warm,amused,grave,tense}.png`, `c57-esme-brook-{warm,amused,grave,tense}.png`, `c58-perrin-ash-{warm,amused,grave,tense}.png`, `c59-merrin-thorne-{warm,amused,grave,tense}.png`, `c60-beatrix-kettle-{warm,amused,grave,tense}.png`, `c61-oren-voss-{warm,amused,grave,tense}.png`.

| File (neutral) | Who | Brief to paste |
| --- | --- | --- |
| `c49-vesper-sen-neutral.png` | Familiar-studies teacher, 38, she/her | Woman with tied-back dark hair, green field coat, repaired leather gloves, a tiny feed pouch at her belt; patient, observant face; no animal attached. |
| `c50-edda-moss-neutral.png` | Owlcombe student, 21, she/her | Compact young woman with short curls, ink-stained cuffs, holding a moss-coloured notebook; thoughtful, slightly restless look. |
| `c51-soren-bell-neutral.png` | Owlcombe captain, 24, he/him | Tall young man, dark braids tied back, worn flight gloves, quiet violet accents on his coat; steady and tired-but-kind. |
| `c52-nessa-flint-neutral.png` | Rookhallow student, 22, she/her | Cropped auburn hair, copper pin, sturdy boots, warm russet jacket; energetic, competitive grin held in check. |
| `c53-ari-fen-neutral.png` | Rookhallow brewer, 20, they/them | Long dark fringe, patched cardigan, a few carefully labelled specimen tins; gentle, shy, clever. |
| `c54-iona-reed-neutral.png` | Heronmere captain, 23, she/her | Strong shoulders, dark curls gathered high, coat with teal lining, annotated play cards; calm face with a competitive glint. |
| `c55-milo-wick-neutral.png` | Heronmere reserve, 21, he/him | Round, soft light-brown hair, oversized scarf, mismatched buttons; warm, sociable, a little sheepish. |
| `c56-tamsin-wren-neutral.png` | Larkspire captain, 22, they/them | Angular, undercut with loose curls, yellow-gold thread in their clothes, folded diagrams in a pocket; inventive, lively. |
| `c57-esme-brook-neutral.png` | Larkspire student, 20, she/her | Long dark plait, round spectacles, muted blue shawl, pressed-flower bookmark; quiet and content. |
| `c58-perrin-ash-neutral.png` | Transfer student, 22, he/him | Narrow build, swept-back sandy hair, an old team patch still on his jacket, an immaculate notebook; proud, guarded. |
| `c59-merrin-thorne-neutral.png` | Village apothecary, 34, they/them | Broad apron, tightly curled hair, amber glass bottles, stained but tidy sleeves; precise, a little stubborn. |
| `c60-beatrix-kettle-neutral.png` | Village baker, 46, she/her | Dark skin dusted with flour, grey-streaked hair wrap, warm striped apron, pencil and order slate; brisk and motherly. |
| `c61-oren-voss-neutral.png` | Broom repairer, 28, he/him | Wavy black hair, leather work apron, metal ferrules and a measuring rule, a crooked sleeve repair; earnest, proud of his craft. |

## Batch 2 — Expressions for the people you meet most — wanted

Most of the cast has only a neutral face, so in conversations they can't react. Attach each person's existing neutral portrait and use the expression prompt.

| Files | Why |
| --- | --- |
| `c02-imogen-scared.png`, `c03-saoirse-surprised.png` | The leads lack fear and discovery faces |
| `c04-cas-{warm,amused,grave,tense,shy}.png` | Recurring classmate; perfectionism arc |
| `c05-noor-{warm,amused,grave,tense,shy}.png` | Recurring classmate; letters home |
| `c06-idris-{warm,amused,grave,tense,shy}.png` | Recurring classmate; returning to study |
| `c07-toby-{warm,amused,grave,tense,shy}.png` | Recurring classmate; creature care |
| `c11-rhys-{grave,amused}.png`, `c19-tully-{grave,amused}.png`, `c08-kestrel-amused.png` | Quest hosts (some warm/grave faces already exist) |
| `c20-priya-`, `c21-flick-`, `c22-marcus-`, `c37-nana-`, `c42-lettice-` + `{warm,grave,amused}.png` | Quest hosts. Lettice stays ghostly/spectral. |
| `c31-hask-{warm,guarded,hurt}.png`, `c34-jory-{warm,amused,tense}.png`, `c46-honoria-{warm,tense,tired}.png` | Key witnesses in the mystery |

Later (only once they speak a lot): `warm` and `grave` for the remaining 27 supporting characters listed in `docs/ART_COMPLETION.md` (P3).

## Batch 3 — More people for a living world (new, proposed) — wanted

The Open World needs people who aren't the main cast: the ones you pass in corridors, buy bread from, and get to know over time. These are **new proposals** (not yet in any document); each needs a character sheet before entering the game. Neutral portrait first; warm and grave follow if they become regulars.

| File (neutral) | Who | Brief to paste |
| --- | --- | --- |
| `c62-hollis-tarrant-neutral.png` | **Hollis Tarrant**, Owlcombe prefect, 26 | Upper-year student, neat dark-blue coat with an owl-feather pin, ledger under arm; dry humour, fair. |
| `c63-juno-ashdown-neutral.png` | **Juno Ashdown**, Rookhallow prefect, 25 | Upper-year, rolled sleeves, ember-red scarf, soot on one cheek; loud, protective. |
| `c64-caspian-lowe-neutral.png` | **Caspian Lowe**, Heronmere prefect, 26 | Upper-year, silver-grey hair tied back, teal cloak, calm watery eyes; diplomatic. |
| `c65-wren-okafor-hale-neutral.png` | **Wren Okafor-Hale**, Larkspire prefect, 25 | Upper-year, bright yellow ribbon in a cloud of curls, ink on fingers, quick smile; mischievous but responsible. |
| `c66-abernathy-neutral.png` | **Old Abernathy**, gate porter, 70s | Elderly man in a long brass-buttoned coat, ring of keys, lantern at his belt; knows everyone's comings and goings. |
| `c67-senna-mire-neutral.png` | **Senna Mire**, groundskeeper, 40s | Weathered woman, waxed coat, pruning shears, leaves in her hair; few words, kind hands. |
| `c68-ilse-varrow-neutral.png` | **Ilse Varrow**, night warden, 50s | Tall, hooded dark coat, small moon-lantern; patrols the halls after curfew; stern but secretly soft. |
| `c69-dorrit-pell-neutral.png` | **Dorrit Pell**, village postmistress, 60s | Round spectacles on a chain, satchel of letters, pencil behind ear; gossip-adjacent, warm. |
| `c70-tobias-hearn-neutral.png` | **Tobias Hearn**, village smith, 30s | Broad, leather apron, forge-reddened forearms, short beard; gentle giant. |
| `c71-maren-coyle-neutral.png` | **Maren Coyle**, lake fisher, 40s | Oilskin coat, knitted cap, net over shoulder, wind-burnt cheeks; tells lake legends. |
| `c72-fennick-lark-neutral.png` | **Fennick Lark**, inn musician, 30s | Lute on his back, patched velvet jacket, mischievous eyes; plays at the inn most evenings. |
| `c73-agnes-rowe-neutral.png` | **Agnes Rowe**, market farmer, 50s | Straw hat, basket of autumn apples and pumpkins, rosy cheeks; there on market days. |
| `c74-pedlar-neutral.png` | **The Pedlar**, travelling merchant, age unclear | Hooded, layered colourful scarves, a cart-pack hung with charms and tiny bottles; appears at festivals; mysterious. |
| `c75-pim-hollow-neutral.png` | **Pim Hollow**, library assistant, 20s | Small, enormous spectacles, cardigan full of bookmarks, stack of books to the chin; anxious and helpful. |

## Batch 4 — Places (seasonal variants from the existing plan) — wanted

| File | Reference to attach | Brief |
| --- | --- | --- |
| `dormitory-evening.png` | `home-kitchen.png` lighting | A modest shared student bedroom in the academy at evening: two beds, desks with books and candles, a window seat, warm and personal. |
| `mere-spring-day.png` | `mere-day.png` | The same lake shore in spring: fresh green, blossom, thawing water, soft morning light. |
| `mere-summer-evening.png` | `mere-night.png`, `mere-day.png` | The same shore on a long summer evening: golden light, warm water, fireflies beginning. |
| `classroom-night.png` | `classroom.png` | The same classroom at night: dark windows, candles and lanterns, no daylight. |
| `rookery-night.png` | `rookery.png` | The same rookery at night: moonlight, sleeping birds, a single lamp for letter-writing. |
| `thimble-cross-spring.png`, `thimble-cross-summer.png` | `thimble-cross.png` | The same village square in spring, and dressed for a summer festival. |
| `whispering-wood-spring.png`, `whispering-wood-winter.png` | `whispering-wood.png` | The same woodland in spring growth, and in sparse, frosty winter. |
| `boathouse-day.png` | `boathouse.png` | The same boathouse in daylight with boats being repaired. |

## Batch 5 — New places for a living world (new, proposed) — owner to approve first

Places a living world naturally needs that the game doesn't have yet. The Open World can't invent places, so anything you want to go to must exist as art. Approve the ones you want; I'll add them as locations.

| File | Brief |
| --- | --- |
| `dorm-owlcombe.png`, `dorm-rookhallow.png`, `dorm-heronmere.png`, `dorm-larkspire.png` | Each house's student bedroom in its house colours and character (Owlcombe deep blue and books; Rookhallow ember red and hearth; Heronmere teal and water-light; Larkspire yellow-gold and clutter of inventions). Reference the matching common room painting. |
| `bakery-interior.png` | Beatrix Kettle's village bakery: ovens glowing, bread on racks, flour in the air. |
| `apothecary-interior.png` | Merrin Thorne's apothecary: amber bottles floor to ceiling, drying herbs, a brass scale. |
| `broom-workshop.png` | Oren Voss's broom repair workshop: brooms on racks, bristle bundles, tools, a half-repaired racing broom. |
| `academy-courtyard.png` | An inner academy courtyard with a fountain, autumn trees and covered walkways; a place to sit between classes. |
| `bell-tower.png` | Top of the academy bell tower at dusk, huge bronze bell, view over the lake. |
| `village-market-day.png` (reference `thimble-cross.png`) | Thimble Cross filled with market stalls, awnings and lanterns (no people needed). |
| `village-dock.png` | The village's little wooden pier on the lake, fishing boats, nets, lamps. |
| `staff-room.png` | The teachers' common room: armchairs, a fire, piles of marking, a tea trolley. |

## Batch 6 — Story milestone and clue art — later

Only once the matching scenes are written (see `docs/ART_COMPLETION.md`): `clue-lantern-nameplate.png`, `clue-atlas-shore-path.png`, `clue-station-ticket.png`, `clue-mended-ward.png`, and the four milestone paintings `cg-winter-shore-rescue.png`, `cg-greenhouse-promise.png`, `cg-heartfire-circle.png`, `cg-homecoming-lanterns.png`.
