# Lanternmere — before the boat: the letter, the journey, the platform

Hello again! The owner loved your opening and wants the beginning to breathe even more. Before the boat crossing there should be three new parts: **the letter arriving at home**, **the journey to Lanternmere**, and **meeting the other new students on the platform**. Only then the boat.

Please follow everything in [CHATGPT_STORY_REWRITE.md](CHATGPT_STORY_REWRITE.md) (how to write, the exact format, the cast sheet, the places). This file adds only what is new.

## What to send back

**One reply: the complete `arrival` scene**, starting from your own current version in [story-drafts/01-arrival-chatgpt.txt](../../story-drafts/01-arrival-chatgpt.txt), with:

1. **Four new sections at the very start**, before `crossing`, in this order (skeleton below):
   `letter`, `leaving`, `train`, `platform`.
2. **The `crossing` section revised.** Toby and Cas have now already met the player on the platform, so they no longer introduce themselves on the boat. Keep the crossing decision (`arrival:crossing`, options `toby` and `castle`) and everything after it exactly as structured.
3. Everything else in the scene unchanged in structure (you may polish prose).

Same rules as before: keep every existing SECTION id, DECISION key, OPTION id and `[IF …]` gate; speech without quotation marks; second person, present tense; slow and grounded.

## New places you may use

| Place id | What it is | Art |
| --- | --- | --- |
| `home-kitchen` | The kitchen of the player's ordinary home, before Lanternmere | exists |
| `home-street` | The street outside the player's home, early, still dark | exists (night) |
| `train-carriage` | Inside the green train to the lake | being painted now |
| `platform-nought` | Platform Nought, the small station by Lantern Mere, where the green train stops | exists |

Keep the player's home life gentle and unspecific: don't invent family members by name, and don't decide who the player lives with. A kettle, a window, post on the mat, the ordinary sounds of a house are enough. The player's feelings stay light, suggested rather than dictated.

## Skeleton for the new sections

```
--- SECTION letter | place: home-kitchen | time: morning | date: 2026-08-14 ---
[NOTE] The very first moment of the game. Ordinary life, quiet and real, before anything magical.
[BEAT] A grey summer morning in the kitchen. The kettle, the window, something ordinary on the table.
[BEAT] The post arrives. Among the usual envelopes, one thick cream envelope sealed with gold wax pressed with a small lantern.
[BEAT] The player opens it. Inside: a letter from Lanternmere Academy offering them a place. Read a few lines of the letter itself (formal, kind, slightly old-fashioned; signed by Headmistress Honoria). It mentions a lantern that will be waiting with their name on it, the date (the first of September), and directions: the green train to Platform Nought.
[BEAT] The player has never applied anywhere like this. They read it twice. Something small but real changes in the room.
[DECISION arrival:letter] The list says what to pack. What do you add that isn't on it?
[OPTION keepsake] Something small from home. | hint: A reminder of where you came from. | journal: I packed something small from home that wasn't on the list. It sits at the bottom of my bag.
[OPTION book] A book you've read too many times. | hint: An old friend for the journey. | journal: I packed a book I have read too many times. The spine is soft from it.
[OPTION nothing] Only what the list asks for. | hint: Arrive with room for something new. | journal: I packed only what the list asked for. There was room left over, and I liked that.
[END DECISION]

--- SECTION leaving | place: home-street | time: night | date: 2026-09-01 ---
[NOTE] The first of September, before dawn. Short and quiet.
[BEAT] Leaving the house in the dark, the bag heavier than expected. The street asleep, one lit window, the cold.
[BEAT] A last look back at the house. Then the walk to the ordinary station and the first, ordinary train.

--- SECTION train | place: train-carriage | time: afternoon | date: 2026-09-01 ---
[NOTE] The green train itself, found after changing trains. It feels slightly older than it should.
[BEAT] The green train: warm wooden panels, brass luggage racks, a compartment with worn velvet seats. The ticket inspector punches the ticket without being asked where to.
[BEAT] The view changes through the afternoon: towns give way to fields, then hills, then dark pine woods. Once, a glimpse of a long lake between the trees.
[BEAT] The player notices other passengers with small brass lanterns of their own, and realises they are not the only one.
[BEAT] The light turns gold, then rose. The train slows.

--- SECTION platform | place: platform-nought | time: evening | date: 2026-09-01 ---
[NOTE] The first real meeting with Toby and Cas, as strangers becoming acquaintances. Rowan and Imogen do NOT appear here; they are met at supper.
[BEAT] Platform Nought at dusk: a small station by the water, the station clock, lamps coming on. New students step down with their lanterns, uncertain.
[BEAT] Toby drops something (a paper bag of bread rolls?) and the player helps gather it. He introduces himself, warm and chatty.
[BEAT] Cas stands nearby re-checking a folded list of what he packed. He corrects a small thing Toby says, then introduces himself, a little stiffly.
[BEAT] A bell rings. A path leads from the platform down to the landing where a boat is waiting. The three of them walk down together.
```

Then continue straight into your revised `crossing`.

**Two close-up paintings are being made for these scenes.** Place each with an `[IMAGE …]` line right after the moment it shows:

- `[IMAGE cg-acceptance-letter] The letter from Lanternmere unfolded on the kitchen table, its gold lantern seal broken.` just after the player first opens the letter;
- `[IMAGE journey-countryside] Hills, pine woods and a long lake passing the train window in the late gold light.` when the view changes on the train.

## When you are done

Reply with the full scene in one code block. Thank you!
