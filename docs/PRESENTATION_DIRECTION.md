# Lanternmere presentation direction

The target is an illustrated interactive novel that feels alive: large scenery, expressive portraits, deliberate cuts, a readable dialogue panel and meaningful choices. Choices and Chapters are references for scene composition and relationship pacing. Stardew Valley and Pokémon are references for controllable text reveal. Keep Lanternmere's existing painterly pixel detail, warm lantern light and quiet mystery rather than copying another game's interface or imposing smooth cartoon art.

This document sets the intended experience and acceptance criteria. Items listed here are design objectives, not a statement that every feature is already implemented.

## Lead with a scene

The current world overview is useful for finding people and activities, but its many panels make conversations feel like forms opened from a dashboard. Preserve the overview between scenes. During an authored scene, let the art occupy the main stage and move routine navigation, house points and quest bookkeeping behind a compact toolbar.

Use three visible layers: background, at most two portrait positions, and a bottom dialogue panel. A narrow top strip holds the location, chapter title, pause/menu and transcript. Present narration in the same panel with a narrator label or an unlabelled narrative treatment, not an invented narrator portrait. Allow a short, skippable establishing view when entering a new place. Familiar locations do not need the same prolonged introduction every visit.

On a wide screen, place two portraits left and right above the dialogue panel. Keep their faces at comparable heights, with shoulders ending behind the panel so the existing upper-body crops look deliberate. Leave enough scenery visible to recognise the room. On a phone, retain both portraits when a two-person exchange matters, using smaller listener framing beside the main speaker; never place a listener over the text. At very narrow widths or large text settings, use one large speaker plus an adjacent labelled listener portrait. All scene details must survive without horizontal scrolling.

The book and world modes should run the same authored scene player. Book mode supplies a curated sequence and optional detours. World mode lets visits and completed tasks unlock scenes. The prose, expressions and consequences should not diverge into separate manuscripts merely because the entry point changes. A reading layout with complete paragraphs and no motion remains available for readers who want it.

## Stage each line deliberately

Author a beat as a semantic unit: who is speaking, what they say, their expression, who is listening, and what visibly changes. A beat may be narration or action as well as dialogue. A paragraph that starts cheerful and ends fearful may need two beats; changing faces randomly every sentence is not acting.

Suggested authored fields are `id`, `speaker`, `text`, `expression`, `listeners`, `entrances`, `exits`, `background`, and optional `effect`. Listener entries carry an explicit expression when their reaction matters. Character and expression values must come from the asset manifest. Stable beat IDs allow resume, transcript references and content audits.

| Beat | Speaking portrait | Listener | Staging purpose |
| --- | --- | --- | --- |
| Narration: a lantern goes dark | None | Rowan neutral, if already in the room | Let the reader notice the event before interpreting it |
| Rowan: “That one was burning a moment ago.” | Rowan surprised | Imogen attentive | His observation and her attention differ |
| Imogen: “Don't touch it yet. There is a name underneath.” | Imogen attentive | Rowan tense | Swap emphasis without making either person vanish |
| Rowan: “All right. Tell me where to hold the light.” | Rowan warm | Imogen attentive | Concern becomes a concrete act of trust |

This is a proposed staging example, not existing canon. The text writer chooses the actual wording and emotional intention. Tone tags alone cannot determine an exact expression; sarcasm, restraint and narration often invert surface sentiment. Do not use a keyword rule that smiles whenever a line includes “happy.” AI dialogue receives only valid expressions and a neutral fallback, with the same rendering rules as authored dialogue.

## Portrait transitions

Use short fades to establish presence. A newly entering character fades from 0 to full opacity over roughly 180–240 ms, optionally moving up by at most 6 px. An exiting character fades over 180–220 ms. Fade a character out because they left the scene or the camera deliberately excludes them, not merely because the other person speaks.

When the speaker changes, keep both portraits in fixed slots. Bring the active speaker to full emphasis over about 140 ms. A listener can be slightly smaller (around 97%) and gently dimmed, but remains recognisable and named. The nameplate, text attribution and speaker indicator must identify the active voice without relying on colour or opacity alone. Characters should not appear to be ghosts just because they are listening; Lettice's actual spectral appearance stays distinct.

For expression changes, decode the incoming image before swapping. Hold the outgoing layer until the incoming layer is ready. Use a short 100–160 ms opacity crossfade with fixed image bounds and an eye-line anchor. The supplied images change hands and shoulder contours slightly; long dissolves produce double eyes and fingers. If a particular pair cannot crossfade cleanly, use a brief fade through a neutral reaction or a deliberate scene cut, and record the exception in staging metadata. Do not morph faces with generated intermediate guesses.

Complete an expression transition near the start of its line, then keep the portrait stable while that line is read. Avoid restarting the portrait entrance animation on every new line. Close conversations with a short fade back to the overview; preserve focus on the interaction that opened them.

## Text reveal and choices

- Offer Instant, Fast and Gentle reveal speeds. Start with a readable default around 35 characters per second, with brief punctuation pauses rather than a delay after every letter. Segment graphemes so accents and emoji are not torn apart. Do not reveal raw markup.
- The first tap, click, Space or Enter while text is revealing completes that line. A second advances. One input must never both finish a line and skip the next one. Keyboard shortcuts apply only when focus is in the scene, not in a text field or other control.
- Use an explicit Continue control and a restrained end-of-line indicator. Clicking dialogue text must not secretly commit a choice. Put choices on separate buttons once the line is complete, and do not let the release of a revealing tap select a newly appearing option.
- Show the full choice label. A choice should communicate an intention, such as “Tell Noor the letter was opened,” instead of hiding the player’s action behind an ambiguous adjective. Avoid a premature verdict on whether a relationship choice is morally correct.
- Provide a transcript/backlog that shows complete text and speaker names. Opening it pauses reveal and any future auto-advance. Reading old lines must not replay rewards or mutate the save.
- No forced auto-advance. If auto-read is added, make it an explicit setting, pause on choices and provide a clear stop control.

Dialogue panels should rise only once when the scene begins, around 160 ms and no more than 8 px. Hold panel geometry during lines of similar length so the scene does not bounce. Longer prose must expand or scroll accessibly rather than shrink its type to fit. Prefer several well-paced beats over a tiny wall of text.

## Motion that belongs to the illustration

Use ambient motion to help the reader feel a place, not to compete with a face. Suitable initial effects include a few drifting dust motes in the library, faint rising embers at the Heartfire, gentle lake mist and a subtle lantern glow. Exterior snow should be limited to scenes with snow in their artwork. No perpetual falling leaves inside classrooms.

Full backgrounds can make a very small, slow camera move during an establishing beat, with no aggressive zoom or infinite bobbing. Keep important faces and architecture inside a per-scene safe area. Do not oscillate portraits to simulate breathing; whole-body scaling visibly stretches faces. Blinking, hair, cloth, flowing water and real parallax require aligned new frames or separated layers as specified in [ART_COMPLETION.md](ART_COMPLETION.md).

Restrict effects to a small allowlist, such as `dust`, `embers`, `mist`, `snow`, `kindle` and `echo`. An authored spell effect should briefly reinforce a successful action, then end. Never use a rapid flash to indicate a choice or damage. UI success can be expressed with a lantern icon and text rather than camera shake.

## Readability and atmosphere

Keep the existing palette: deep forest green, warm parchment, candle gold and muted house accents. Use the illustration as the saturated focal point. Dialogue surfaces need an opaque-enough backing to stay readable over bright glass and lanterns; text shadows alone are not sufficient.

Use the existing serif for names and chapter headings. Give long dialogue an easy-to-read face, about 18–22 px on desktop and at least 17 px on typical phones, with 1.5–1.7 line spacing. Offer larger text. Avoid tiny all-caps annotations for information required to play. Aim for 45–70 characters per line on wide screens and respect contrast of at least 4.5:1 for ordinary text. Test the actual rendered combinations rather than assuming parchment colours pass.

Reduce repeated dashboard decoration during play: the currently active objective can be a short expandable line. Calendar and relationship changes appear after a scene resolves, in a small summary the player can read at their own pace. Keep technical details such as expression IDs, model names and API status in settings or an optional developer view; the story panel needs the character's voice. The optional AI affordance can be “Say something else” with a clear prepared-dialogue fallback when offline.

At a chapter boundary, show its title, a one-sentence change in the situation and a clear next action. Longer scenes should have an internal question, complication, player decision and local resolution. A scene can end in suspense while still delivering something—new understanding, a repaired relationship, a clue, a practiced spell—rather than existing solely to reach a word target.

## Accessibility and reliability

Respect `prefers-reduced-motion` on first use and offer an explicit in-game motion preference. Reduced motion removes camera moves, particles, slides and looping effects; text defaults to instant and portrait swaps remain understandable. A setting for “Pause ambient motion” also serves people who want text reveal without continuous scenery movement.

Keep an accessible complete line separate from the decorative character-by-character reveal. Announce each completed dialogue beat once, including speaker attribution, rather than announcing every letter. Provide visible focus, meaningful image alternatives when art conveys a clue, and decorative empty alternatives for redundant portraits. Every choice and Continue control must be reachable and operable with a keyboard. Touch controls should be at least 44×44 CSS px with space between them.

Resume at a stable beat with its text available, not halfway through a timer. Cancel pending reveals and animations when leaving a scene. Reward and branch changes must occur once at committed choices, never as an effect of re-rendering, reading the transcript or fading a portrait. Load the next likely expression/background before a transition; if it fails, retain the previous image and continue with readable text. Offline and AI failures must not strand the player in an animation waiting state.

## Implementation order and acceptance

1. **Playable staging sample:** one authored two-person scene using the expressive trio, controlled reveal, speaker/listener positioning, short transitions, transcript, keyboard and reduced-motion behavior. No new art is needed to judge whether the desired feel works.
2. **Shared scene format:** convert authored chapter and quest beats to the same renderer; validate speaker/expression references and resume positions. Keep the complete reading layout available.
3. **Readability pass:** phone layout, larger text, clear choices, accessible announcements and simpler in-scene controls. Test 320 px and 390 px widths, desktop, 200% zoom and reduced motion.
4. **Selective ambience:** add effects to a few appropriate backgrounds and profile on a modest phone. Establish a budget of two portrait slots and one ambient effect layer before increasing complexity.
5. **Art-backed expansion:** commission the named P1 packet, then implement the scenes that use it. Every additional expression or illustration has a written purpose and an offline fallback.

A scene is ready when it can be read without motion, played entirely by keyboard, resumed after reload, completed offline, and followed with speaker names alone; when rapidly advancing does not skip choices or duplicate rewards; and when its portraits never show a broken image or jump across the stage. Attractive motion is the final polish on those behaviors.
