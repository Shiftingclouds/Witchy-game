# Backlog — owner requests for later

Things the owner asked for that are deliberately scheduled for later. Newest at the bottom.

## Opening screen

- **The orbs beside the lantern bob gently up and down** (requested 17 October 2026). The orbs are painted into `art/opening-lantern-mere.png`; their positions are already mapped as `ORBS` in `src/features/opening/geometry.mjs` (used today to keep the ripple off them). Approach: lift each orb into its own small layer (cut from the painting with a soft mask, or a matching glowing sprite), patch the painting behind it, and bob each a few pixels on its own slow, offset rhythm (roughly 4–7 s), so they don't move in unison. Owner's standing rule: motion must never drag still areas, so the lantern, its base and the water around it must not move. Respect reduced motion (orbs stay still).

## Sound

- **Music player** (requested 17 October 2026): tracks that change with the place and time of day, soft crossfades, ambient sound beds, small interface sounds, and music/sound volume and mute in Settings, with placeholders until the files arrive. Built from the list in `docs/design/SOUND_AND_MUSIC.md` (plan Task 14).
