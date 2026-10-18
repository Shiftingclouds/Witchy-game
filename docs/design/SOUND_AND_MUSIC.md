# Sound and music for Lanternmere

Every piece of music and sound the game could use, scene by scene and place by place. Each entry has a **filename** (save the file with exactly this name), **when it plays**, the **mood and instruments**, whether it **loops**, a **prompt to paste into Suno or Udio**, and **search words** for the free libraries (Pixabay Music, FreePD, Incompetech).

The game has no music player yet; it is in the backlog. When it is built, files dropped into `audio/` with these names will play automatically, the same way the art works. Start with the ★ items: they cover most of play.

## Received so far (17 October)

Files in `audio/` (`.mp3` is fine; any filename here can be `.mp3` or `.ogg`):

| File | From | Notes |
| --- | --- | --- |
| `audio/music/moment-the-crossing.mp3` | "Shadowed Lake" (3:12) | Also suits `place-mere-night` |
| `audio/music/moment-the-journey.mp3` | "Whimsy in the Wind" (2:10) | Could also suit `place-village-day` |
| `audio/ambience/amb-lake.mp3` | soft distant spring lake (0:30) | |
| `audio/ambience/amb-lake-close.mp3` | gentle lapping water (0:10) | Water up close: boathouse, the boat |
| `audio/ambience/amb-hall.mp3` | full dining hall (0:22) | |
| `audio/ambience/amb-boathouse.mp3` | wooden boats tied up (0:09) | |
| `audio/sfx/sfx-lantern-light.mp3` | glowing lantern (0:07) | |
| `audio/sfx/sfx-orb.mp3`, `sfx-orb-2.mp3` | magical orb of light, two takes (0:04) | For the opening's floating orbs |

Still to come: everything else below, starting with the ★ items (especially `theme-lanternmere`, `moment-the-hall` and the four house themes).

## How to make the tracks

- **Always instrumental, no vocals,** and ask for it to be **loopable** (no fade-in or fade-out, ending where it began).
- **Two to three minutes** for place music and loops. Story moments can be 1–2 minutes.
- **Keep the palette consistent** across the game: harp, celesta, music box, solo piano, warm strings (cello, viola), low flute, soft woodwinds, light hand percussion. Avoid drum kits, synth pads, choirs singing words, and anything epic.
- **Suno/Udio tip:** add *"cozy fantasy, gentle, warm, intimate, loopable, instrumental, no vocals"* to every prompt. Generate two or three versions and keep the calmest.
- Save music as `.mp3` or `.ogg` into `audio/music/`, ambient loops into `audio/ambience/`, and short sounds into `audio/sfx/`.

---

## Story moments (music)

**★ `theme-lanternmere.mp3`: the title screen.** The lantern on the lake at dusk. Wistful, hopeful, a little mysterious. Solo harp and celesta, warm strings joining halfway, slow (70 bpm), loops.
Prompt: *"main theme for a cozy fantasy witch academy, dusk over a lake, solo harp and celesta, warm strings enter softly, wistful and hopeful, slow, loopable, instrumental, no vocals"*
Search: *fantasy harp lullaby, enchanted lake*

**`moment-the-letter.mp3`: the letter arrives.** An ordinary grey kitchen, then something extraordinary in the post. Starts as plain solo piano, a music-box motif (the lantern theme) appears when the letter opens. 80 bpm, one-shot (about 90 s).
Prompt: *"quiet solo piano on a rainy morning, a delicate music box melody appears as something magical arrives, gentle wonder, intimate, instrumental"*
Search: *gentle piano wonder, music box discovery*

**★ `moment-the-journey.mp3`: the green train.** Afternoon light through the window, fields becoming hills and pines. Gently rolling rhythm (pizzicato strings like train wheels), clarinet melody, curious and warm. 96 bpm, loops.
Prompt: *"cozy fantasy train journey through hills and pine forests, pizzicato strings like rolling wheels, warm clarinet melody, curious and hopeful, loopable, instrumental, no vocals"*
Search: *whimsical train journey, pizzicato travel*

**`moment-the-platform.mp3`: Platform Nought at dusk.** Arriving, nervous, meeting Toby and Cas. Soft guitar or lute with flute, shy and friendly. 84 bpm, loops.
Prompt: *"small lakeside station at dusk, soft lute and wooden flute, shy friendly meeting, cozy fantasy, loopable, instrumental, no vocals"*

**★ `moment-the-crossing.mp3`: the boat across the Mere.** Mist, the castle appearing one window at a time. Slow, floating; harp arpeggios, glassy celesta, low cello swell when the castle appears. 60 bpm, loops.
Prompt: *"boat gliding across a misty lake at night toward a lit castle, flowing harp arpeggios, glassy celesta, a low cello swell, mysterious and awed, slow, loopable, instrumental, no vocals"*
Search: *misty lake fantasy, ethereal harp*

**★ `moment-the-hall.mp3`: first sight of Lantern Hall and Honoria's welcome.** Hundreds of floating lanterns; awe and warmth. Strings and celesta, gentle and grand without being loud. 72 bpm, one-shot (about 2 min).
Prompt: *"entering a great hall of floating lanterns for the first time, warm strings and celesta, gentle awe, grand but soft, cozy fantasy, instrumental"*

**`moment-sorting.mp3`: Honoria's house questions.** Thoughtful, kind, a quiet heartbeat of anticipation. Solo piano with soft low strings, ticking music-box rhythm. 76 bpm, loops.
Prompt: *"a kind headmistress asking thoughtful questions, gentle piano, soft low strings, quiet music box ticking, anticipation, cozy, loopable, instrumental, no vocals"*

**`moment-familiar.mp3`: the familiars come into the hall.** Playful and tender. Pizzicato, flute trills, a glockenspiel. 100 bpm, one-shot.
Prompt: *"animals wandering into a candlelit hall to choose a friend, playful pizzicato, flute trills, glockenspiel, tender and charming, instrumental"*

**★ `motif-dark-lantern.mp3`: the lantern goes dark (and every mystery moment).** The mystery's own sound: a held low note, a few unresolved celesta notes, hush. Very short (20–40 s), one-shot.
Prompt: *"a single lantern quietly going out, unresolved celesta notes over a low held cello, soft mystery, hushed, short, instrumental"*

**`moment-investigation.mp3`: looking into the mystery** (the register, the Candlestones, evidence). Curious, careful, a little suspenseful but never scary. Plucked strings, clarinet, soft frame drum. 88 bpm, loops.
Prompt: *"careful investigation in an old library, plucked strings, clarinet, soft frame drum, curious and gently suspenseful, cozy mystery, loopable, instrumental, no vocals"*

**`moment-lesson.mp3`: learning a spell** (Kindle, Echosight, Threadbind). Focus and small wonder, rising when the spell works. Celesta and harp with warm brass at the end. One-shot.
Prompt: *"learning a gentle spell, celesta and harp building quietly, a warm horn note when the magic works, small wonder, instrumental"*

**★ `moment-heartfire.mp3`: Midsummer in the Heartfire** (the climax). Seven willing lights joining. The fullest the score gets: strings, harp, celesta, horn, a wordless soft choir pad at most. 70 bpm, one-shot (3 min).
Prompt: *"seven lights joining in a glowing cavern, a shared promise, full warm strings, harp, celesta and soft horn, emotional and hopeful, never bombastic, cozy fantasy climax, instrumental"*

**`ending-shared.mp3`: the shared stewardship ending.** Warm, communal, a reprise of the main theme with everyone playing. One-shot.

**`ending-keeper.mp3`: becoming a keeper.** Quieter, solitary, the main theme on solo piano with distant strings. One-shot.

---

## Places (music, loops)

**★ Lantern Hall:** `place-lantern-hall-day.mp3` (bright, bustling, light woodwinds and strings) and `place-lantern-hall-night.mp3` (candlelit, soft harp and cello).
Prompt (day): *"busy cozy academy dining hall in the morning, light woodwinds and strings, cheerful, loopable, instrumental, no vocals"*

**★ The academy halls** (Grand Corridor, Charms Classroom, Warding Hall, Infirmary, Weathervane Room): `place-academy.mp3`. Gentle, curious, walking pace. Harp and clarinet.
Prompt: *"walking the corridors of a gentle magic school, harp and clarinet, curious and calm, loopable, instrumental, no vocals"*

**The Library:** `place-library.mp3`. Hushed; slow solo piano and soft strings, lots of space between notes.

**The Glasshouses:** `place-glasshouses.mp3`. Green and alive; marimba, flute, light strings. Night variant `place-glasshouses-night.mp3` with music box and celesta (the moonflowers).

**Brewing Cellars and Kitchens:** `place-cellars.mp3`. Warm, bubbling, a little comic; bassoon and pizzicato.

**The Observatory and the Rookery:** `place-heights.mp3`. Airy and starry; celesta, high strings, flute.

**The Menagerie:** `place-menagerie.mp3`. Playful and tender; pizzicato and glockenspiel.

**★ The Mere and the Boathouse:** `place-mere-day.mp3` (open, gentle, harp and guitar) and `place-mere-night.mp3` (still water, music box and low strings).

**Whispering Wood and the Old Cloisters:** `place-wood.mp3`. Rustling, old, slightly eerie but safe; alto flute, harp harmonics, low drone.

**The Candlestones and the Fen Chapel:** `place-stones.mp3`. Ancient and reverent; low strings, a single bell, slow.

**The Glimmer Pitch:** `place-glimmer.mp3`. The liveliest track: quick strings, flute, hand percussion, sporting energy without drums.

**The Heartfire** (outside the climax): `place-heartfire.mp3`. Deep, warm, glowing; low strings and celesta.

**★ Thimble Cross and the village** (Lamplight Row, the shops): `place-village-day.mp3` (folk: fiddle, guitar, accordion, gentle and friendly) and `place-village-evening.mp3` (softer, lamplit).
Prompt: *"cozy fantasy village square on market day, folk fiddle, acoustic guitar and soft accordion, friendly and warm, loopable, instrumental, no vocals"*

**The inns** (The Crooked Lantern, The Lamp & Ladle): `place-inn.mp3`. A tavern tune played gently: lute, fiddle, hand drum.

**Homes** (Pearl's Sitting Room, Tully's Cottage, the Wren's Nest): `place-cottage.mp3`. Fireside; solo guitar or piano, very cosy.

**The house common rooms:** one theme each, built on the house's bird and virtue.
- `house-owlcombe.mp3`: Curiosity. Clarinet and celesta, questioning melody, night-blue.
- `house-rookhallow.mp3`: Courage. Cello and frame drum, steady and brave, fire-warm.
- `house-heronmere.mp3`: Kindness. Harp and flute, flowing like water, gentle.
- `house-larkspire.mp3`: Wonder. Glockenspiel, flute and pizzicato, bright and skipping.

**The new beginning:** `place-home.mp3` (the kitchen and street at home: plain, quiet piano, ordinary life) and `place-train.mp3` (can reuse `moment-the-journey.mp3`).

---

## Festivals (music)

Each replaces the place music on its day.
- `festival-arrival.mp3`: Arrival Day. Welcoming, the main theme with folk instruments.
- `festival-emberfall.mp3`: Emberfall (autumn). Amber and spice; cello, guitar, crackling warmth.
- `festival-longnight.mp3`: Longnight (winter). Snowy and still; celesta, bells, soft strings.
- `festival-first-thaw.mp3`: First Thaw (spring). Waking and green; flute, harp, birdlike trills.
- `festival-bloomtide.mp3`: Bloomtide. Blossom and dance; fiddle, flute, light percussion.
- `festival-homecoming.mp3`: The Homecoming of Lights. Lantern-lit celebration; full warm ensemble, the main theme.

---

## Ambient loops (quiet sound beds under the music)

| File | Where | Search words |
| --- | --- | --- |
| ★ `amb-lake.ogg` | The Mere, boathouse, the crossing | gentle lake water lapping |
| ★ `amb-hall.ogg` | Lantern Hall | distant dining hall murmur, cutlery |
| ★ `amb-fire.ogg` | Common rooms, inns, cottages | fireplace crackle soft |
| `amb-library.ogg` | Library | quiet library, page turns, clock |
| `amb-woods.ogg` | Whispering Wood, Old Cloisters | wind in pines, leaves |
| `amb-birds.ogg` | Rookery, glasshouses by day | birdsong, rooks distant |
| `amb-night.ogg` | Grounds at night | crickets, night breeze |
| `amb-rain.ogg` | Rainy days, the letter scene | gentle rain on window |
| `amb-snow.ogg` | Winter grounds | snowy wind, muffled |
| `amb-village.ogg` | Thimble Cross | market chatter, distant |
| `amb-train.ogg` | The green train | steam train interior clatter |
| `amb-station.ogg` | Platform Nought | small station, distant whistle |
| `amb-kitchen.ogg` | Kitchens, the home kitchen | kettle, pots, quiet kitchen |
| `amb-cavern.ogg` | The Heartfire | cave drip, low hum |

---

## Small sounds (short, not looped)

**Interface** (keep these very soft):
- `sfx-next.ogg`: moving to the next line. A soft paper brush. *Search: soft page flip*
- `sfx-choice.ogg`: choosing an option. A small warm chime. *Search: soft magic chime*
- `sfx-open.ogg` / `sfx-close.ogg`: the gear or history opening and closing. Soft wooden click.
- `sfx-arrive.ogg`: an arrival painting fading into a scene. A gentle airy shimmer.
- `sfx-save.ogg`: progress saved. Barely there; a tiny bell.

**Story:**
- `sfx-lantern-light.ogg`: a lantern lighting (whoomp of a small flame, glassy ring).
- `sfx-lantern-dark.ogg`: a lantern going out (soft hiss into silence).
- `sfx-letter.ogg`: an envelope opened and a letter unfolded.
- `sfx-train-whistle.ogg`: the green train's whistle, distant.
- `sfx-boat.ogg`: the boat bumping the boathouse steps.
- `sfx-door.ogg`: a heavy old wooden door.
- `sfx-bell.ogg`: the hall bell (once for announcements, twice for the kitchens).
- `sfx-spell.ogg`: a spell working (sparkle and warm swell).
- `sfx-journal.ogg`: a journal note (pen scratch).

**Familiars** (when yours reacts):
- `fam-cat.ogg` soft purr or small mew; `fam-owl.ogg` low hoot; `fam-fox.ogg` small yip; `fam-hare.ogg` soft thump; `fam-moth.ogg` papery flutter; `fam-raven.ogg` gentle croak; `fam-ferret.ogg` dook dook chatter; `fam-toad.ogg` low croak.

---

## Recommended order

1. ★ `theme-lanternmere`, `moment-the-crossing`, `moment-the-hall`, `place-lantern-hall-day`, `place-academy`, `place-village-day`, `place-mere-night`, and the four house themes.
2. ★ Ambient loops: `amb-lake`, `amb-hall`, `amb-fire`.
3. The rest of the story moments, then festivals, then small sounds.
