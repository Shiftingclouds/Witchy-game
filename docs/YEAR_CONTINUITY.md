# First-year continuity ledger

This ledger distinguishes implemented evidence from the next writing work. It is an authoring document and never enters AI context or the word count. The opening, register, Emberfall and Longnight are integrated; chapters 6–8 retain the short playable arc.

## Evidence and information order

| Stage / time              | What changes and who can establish it                                                                                                                                                           | What remains unknown                                                                                                   | Next playable purpose                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Arrival, 1–3 September    | Player, Rowan, and Imogen see the hall light go out. Exterior is cold, seal intact, no smoke. Grey logs it, finds no broken fitting, fails to relight it normally, and requests warding review. | No vanished person, deliberate attack, or chosen-one status is established. The mark on the repair tag is only a mark. | Form relationships through practical help; learn how the academy handles a problem. **Integrated.**                         |
| First Kindle, 4 September | Player and Rowan independently record “Remember the way home.” Elian reproduces the light but not the voice; reports can be linked by number without declaring a common cause.                  | Speaker, source, intention, and connection to the hall failure.                                                        | Acquire a repeatable small skill and choose an investigation partner. **Integrated.**                                       |
| Register, 18 September    | Three working/formal record pairs show omitted workers. Grey supplies present practice and an independently archived keeper instruction. A supervised echo is consistent with care and return.  | Motive for omission, whether it caused the failure, and how restoration works.                                         | Corroborate the link between light, memory and belonging; correct claims of proven erasure. **Integrated in six sections.** |
| Moonflowers, 31 October   | Saoirse/Rhys and a tended specimen show that petals can carry an echo of warmth.                                                                                                                | An echo is not a living person and cannot supply every missing fact.                                                   | Learn a method for preserving evidence without claiming resurrection. **Integrated in six sections.**                       |
| Lake, 21 December         | Echosight reveals seven willing lights in an open circle. The buildings will remain if the welcoming magic fails; midsummer is the restoration deadline.                                        | Complete participants’ identities and how the opening in the circle works.                                             | Give the investigation a bounded deadline and a credible cost. **Integrated in six sections.**                              |
| Candlestones, 20 March    | Inscription confirms freely offered light and space for newcomers. Threadbind must connect willing people rather than compel them.                                                              | Which practical restoration arrangements the current academy will choose.                                              | Replace a vague rescue with an achievable plan. **Compact implementation.**                                                 |
| Preparation, 1 May        | Recovered names, a register, willing participants, learned spells, and repaired relationships can be gathered.                                                                                  | No single person is required to sacrifice their place or accept romance.                                               | Test the plan, invite consent, and handle ordinary logistics. **Compact implementation.**                                   |
| Heartfire, 21 June        | The player has three spells, four discoveries, and sufficient friendship with the trio. Willing lights restore the Heartfire.                                                                   | The academy’s future is an ongoing responsibility, not a magically finished society.                                   | Choose shared stewardship or the keeper role; both remain viable, non-romantic endings. **Compact implementation.**         |

The dates are chapter windows in the game calendar, not real-world appointments. Live can arrive late without losing the essential plot. Book handles prerequisites through its authored progression. No required clue may be available only during a one-day festival event or an optional AI conversation.

## Opening promises and implemented payoffs

| Promise / choice                        | Payoff already in the story                                                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Grey will report what he finds          | Second-supper update, dated receipt, and Elian’s later use of the report number.                                                                  |
| Examine the frame / keep a record       | Different immediate evidence-gathering scene; Rowan or the player reuses the method in Kindle.                                                    |
| Help Cas / help Toby                    | Different practical action; the selected person reports the result after the lesson.                                                              |
| Ask honestly / attempt again with help  | Distinct opening question to Elian and response.                                                                                                  |
| Quiet time / explicit welcome           | Different notice and actual Thursday study visit; corresponding partner arrangement in class.                                                     |
| Measure / simplify Saoirse’s prototype  | Distinct safe trial, supper account, and later question about Elian’s experiment. The invention remains unfinished; no false success is promised. |
| Observe Rowan / trade turns             | Different successful partner exercise and Rowan’s shared memory.                                                                                  |
| Report uncertainty / describe a feeling | Different teacher response and recorded account; neither choice changes the mystery’s truth.                                                      |

## Integrated package: Notes in the margins

Implemented in `src/story/register.mjs`, using the reviewed library and old-cloister art, a new register close-up, Dunne’s attentive expression, and Maelin’s neutral/reflective pair:

1. **The catalogue request:** Imogen must ask Dunne for access and articulate a question. The player chooses search terms or follows the maker’s stamp. Both find the same relevant record through different work. Introduce Maelin only after their portrait, sheet, routine, and dialogue are ready.
2. **A page with names missing:** distinguish damage, deliberate omission, and an incomplete index. The group finds a repeatable discrepancy across records; a single blank space is insufficient. Preserve the first-night restraint about the repair tag.
3. **Someone who does the work:** a keeper or village worker gives practical context and an independent source. They contribute knowledge the students lack, rather than existing to approve the students’ theory.
4. **A supervised Echosight lesson:** teach what an echo can and cannot establish. Reuse the opening’s observation methods. A copied sound is evidence of an event, not unquestionable testimony about motive.
5. **Correct the claim:** Imogen must revise an attractive early explanation. The player can help privately or support a public correction; both preserve her agency and leave a later callback.
6. **The first supported conclusion:** combine sources to establish the chapter’s existing canon fact. Record provenance, uncertainty, and the next practical test. The next objective points to Rhys/Saoirse’s moonflowers without unlocking later lake or ritual revelations.

The six sections contain 4,808 eligible scene words across branches. `register:search-method` chooses dates or a maker’s mark; each receives a conclusion callback. `register:worker-question` chooses practical testimony or a working record and changes Grey’s return copy. `register:correction` chooses private drafting or support at the table; only witnesses receive the corresponding shared memory. The common outcome stays evidence-based. Maelin and Dunne become acquaintances at the request; Grey’s meeting also supports older saves without an opening introduction. AI knowledge of the conclusion unlocks after this chapter, while actual choices enter the relevant character’s memory immediately.

The old compact summary implied physical erasure and a proven cause. It is retired from both readers and the word count. The detailed investigation and updated AI public fact deliberately leave those claims unresolved. Do not reintroduce certainty through later incidental dialogue.

## Integrated package: Emberfall

1. **A request with a deadline:** Rhys needs festival frames and flowers prepared, while Saoirse has an unfinished prototype and too many promises. Connect the request to the register’s botanical reference. Review the existing Glasshouses and festival hall before writing staging.
2. **Work divided fairly:** give the player a useful task and Saoirse a reason to accept help or reduce scope. Let a peer have a need beyond delivering a clue; complete any promised task within this package or track a specific later payoff.
3. **The moonflower observation:** teach how the flower retains warmth, with a comparison and a stopping point. Generate a close-up from the actual plant/scenery design. Echoes are fragments, not restored people or reliable accounts of motive.
4. **A festival with other lives in it:** use the existing Emberfall hall, a shared meal, and workers’ preparations. Resolve the practical task and make the returning record matter to Grey. Preserve both versions of Imogen’s correction in an appropriate later response.
5. **A voluntary promise:** write substantial friendship alternatives to the lantern inscription; no automatic romance. Confirm adult peer canon before any romance mechanics are introduced.
6. **The next question:** connect the flower’s warmth to the shore without revealing the seven-light circle or midsummer deadline, which belong to Longnight. Essential progress remains reachable after the festival date in Live mode.

Each section needs full prose, a distinct obstacle or emotional turn, truthful expression cues, and a tested exit. Generate a night Glasshouses variant only if the written observation requires it; use the supplied scenery first. Scene evidence must remain understandable in text when an illustration cannot convey exact details. This outline is excluded from the word count.

## Integrated package: Longnight

Six sections cover a practical winter round, safe approach, lake reading, teacher report, bounded winter task, and supper. The original frozen-mere and Longnight-hall art anchor the chapter; a winter cottage and seven-light evidence detail supply the missing views.

- `longnight:shore-work` chooses a newcomer-oriented route check or lamp-catch inspection; both receive a concrete visitor/escort payoff at supper.
- `longnight:echo-record` divides pattern and sound between the player and Saoirse, then compares the accounts. Seven separate answers and the invitation support willing participation; the terms of the connection await the stones.
- `longnight:winter-duty` begins a handover sheet or source list. First Thaw must show their use, not merely thank the player.
- Kestrel distinguishes the threatened welcome from sound buildings and protective wards. Moth's annual-cycle records and repeated ward measurements establish 21 June 2027 as the next necessary renewal; adults have named responsibilities.
- Live Echosight cannot reveal the lake before chapter 5 or the inscription before chapter 6. Gates follow story progress, not the current season; late visits remain possible and old discoveries survive migration.

## Next package: First Thaw

1. Show the winter task being used to prepare a safe spring visit; provide an honest missing-choice fallback for older saves.
2. At the stones, separate visible weathering from the words Echosight restores. Compare the chart's approach with the open ring.
3. Read the freely offered light/newcomer inscription; turn the discovery into a specific question for a supervised exercise.
4. In Warding Hall, practise Threadbind with a consenting partner and a small light. Test withdrawal without harming the other participant.
5. Let the player choose a role in a rejoining exercise. A result counts as successful when someone can leave and return freely, not when the circle cannot be broken.
6. Bring the tested method to a realistic invitation plan for Bloomtide. Preserve the existing whole-academy versus individual invitation exit choices and both ending policies.

## Release continuity gates

- Every public fact must have an authored source before it appears in character context. Personal knowledge requires a witness, a communicated report, or a justified institutional role.
- Migrations leave unknown choices unknown; fallback prose cannot imply the player chose a specific branch.
- Both ending policies require the same essential discoveries and willing participants. Friendship alternatives receive full scenes; romance cannot bypass evidence or gate the best ending.
- Festival variants may enrich a scene but cannot be the only way to obtain a required item or clue.
- Before later acts ship, edit the prototype prose and AI fact gates together. A detailed scene must not reveal a later truth merely because the old one-paragraph outline compressed time.
