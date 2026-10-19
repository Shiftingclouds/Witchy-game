# Eight endings: one earned restoration, eight lives afterwards

The owner requested eight endings during this rewrite. This supersedes the source brief's two-epilogue limit. The Heartfire is restored in every ending. Outcomes differ in the next year's work, the player's commitments, where the final scene takes place, the institutions the group changes, and the relationship moments that close the story.

House determines the two recurring house friends, not the ending. All eight remain open to all four houses and all eight familiars. No romance, hidden relationship threshold, perfect attendance, high score, or AI conversation is required.

## Choices and causality

At Bloomtide, `bloom:future-work` chooses a provisional interest: `welcome`, `records`, `roads`, or `everyday`. Each receives a concrete conversation and preparation. At Midsummer, after the restoration, Honoria acknowledges the earlier preference and expressly allows a change of direction. `heartfire-chapter-7:future-focus` confirms what the player actually wants to pursue. This final decision is authoritative. The existing Midsummer exit 0 still chooses shared stewardship, and exit 1 still chooses the keeper role. Their stable meanings and indices survive.

The four interests crossed with two policies yield exactly eight endings. Each outcome is explained before the final choices. Earlier choices change scenes, techniques, logistics and relationship responses; they do not secretly invalidate an ending. The future-work choice is preparation, not a lock.

| Focus | Exit 0: shared stewardship | Exit 1: keeper for the coming year |
| --- | --- | --- |
| `welcome` | `shared` — **The Open Door**. A rotating reception group meets the next intake; the player helps a newcomer and leaves the role in another pair of hands. Final place: hall table. Feeling: belonging shared without becoming indispensable. | `keeper` — **The First Lesson**. The player teaches the first new cohort the three skills with a supervised appointment and protected time off. Final place: classroom. Feeling: confidence in a limited, useful responsibility. |
| `records` | `shared-records` — **The Unfinished Book**. A public working archive receives corrections and contributions from workers, students and village visitors. The player's signature sits beside other contributors rather than on an authoritative final account. Final place: library. Feeling: a quieter voice becoming part of public memory. | `keeper-records` — **The Names We Carry**. The keeper takes a defined oral-history and teaching placement, learns to accept a refusal, and preserves an incomplete account honestly. Final place: a return to the library from the cloisters. Feeling: care for what cannot all be recovered. |
| `roads` | `shared-roads` — **Lights Along the Road**. Academy, station and village keepers share a modest receiving route; the player begins a funded, one-term exchange and leaves a place prepared for their return. Final place: departing green train. Feeling: an affectionate, chosen departure. | `keeper-roads` — **The Travelling Light**. The player takes a supervised travelling keeper placement, teaching a small practice at the station and bringing the work home each week. Final place: return boat at dusk. Feeling: connection carried beyond the campus. |
| `everyday` | `shared-everyday` — **A Place at the Table**. A shared common-room and welcome rota lets the player resume ordinary study and friendship without accepting a formal post. Final place: an evening with their two house friends. Feeling: a life worth living after a crisis. | `keeper-everyday` — **The Quiet Round**. The player apprentices to the keepers who maintain daily welcome, with relief and protected study hours. The ending finishes a shift and hands it over. Final place: the last landing lamp, then the common-room door. Feeling: continuity without self-erasure. |

## Distinctness requirements

- Open Door is reception shared among a changing group; First Lesson is the player's bounded teaching role.
- Unfinished Book changes who may contribute and correct the archive; Names We Carry follows the player learning how to gather a story without owning it.
- Lights Along the Road includes a chosen term away and a real farewell; Travelling Light establishes a recurring outward-and-returning teaching practice.
- Place at the Table explicitly permits declining office and making ordinary life central; Quiet Round accepts a formal practical apprenticeship and demonstrates the handover that protects that life.
- Every ending contains an event with a small obstacle and a response, a house-pair coda, and a final image. None ends at a policy announcement.
- Rowan, Imogen and Saoirse survive and remain in the world on every path. No route appropriates a private conversation the player did not have. The eight endings do not convert a friendship into romance by implication.

## Integration contract

`endings.json` is the authoritative routing table. Preserve current `shared` and `keeper` IDs for `welcome` so older saves keep their existing outcome. For an older save without the new final focus, default to `welcome`; do not infer an unrecorded earlier choice. Read the corresponding `=== EPILOGUE <id> ===` block from `09-epilogues-chatgpt.txt`, then resolve its ordinary choice gates. Display the title from the routing table.

The current `import:story` tool imports scenes only, and the existing epilogue renderer supports the original two policies. Claude must add the six variant outcomes and use the final focus when selecting prose. Do not claim the eight endings are playable until that integration and its save/route tests pass.
