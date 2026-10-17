# Lanternmere visual design ("Lamplight") — design

Date: 17 October 2026. Status: draft for owner approval (builder check done; its questions settled as calls below).

Companion to `2026-10-16-desktop-and-ai-modes-design.md`. That spec covers how the game runs (desktop app, Claude modes). This one covers how every screen looks and feels.

## Intent

The owner wants opening the game to feel like being wrapped in its world: warm, comforting, mysterious and magical, never overwhelming. Today's UI is a light cream "paper" web app with green accents, Georgia and Arial (`src/styles.css` tokens `--paper #f3efe6`, `--green #465b45`, `--serif Georgia`). It works but reads as a generic website and does not carry the magic of the art.

The new look is **Lamplight**: warm browns and deep wine-dusk tones lit by gold, fine serif lettering, thin gold linework, and branching gold vine flourishes on important buttons, with the illustrations as the star. It must look professionally designed and avoid the typical "AI-made" look: no purple-to-blue gradients, no glass cards everywhere, no glow on everything, no gradient-filled text, no generic icon-card grids.

Reference the owner already approved: the Xenoblade Chronicles title screen. What they love is the calm of a vast, quiet scene with one small piece of the story in it.

## The approved opening (built as a spike; see `docs/design/opening-reference/`)

`opening-spike.html` is a throwaway prototype the owner reviewed and approved through ~20 iterations. Use it as the visual and behavioral reference, not as code to ship. `title.png` and `menu.png` are captures. These details were explicitly asked for or approved by the owner:

**Scene.** Full-screen painting `art/opening-lantern-mere.png` (1672×941, by ChatGPT for the owner): a brass lantern floating on a still lake at dusk, mountains, an empty sky for the title, the academy lit on the right, rocks and autumn leaves in the foreground. Centered layout, art behind everything.

**Living-painting effects** (all gentle; all disabled under reduced motion):
- Lantern glow breathes and flickers softly.
- Gold sparks rise slowly from the lantern; a few fireflies wander over the lake.
- Ripple rings spread from the lantern's base.
- The open lake surface wavers. It must not touch: the rocks and grass in the bottom corners; the lantern (body and base must not move at all); the floating light orbs beside the lantern (they are not water). The water directly beneath the lantern ripples at about a third of open-water strength, blending back to normal.
- Sky clouds drift slowly sideways and reshape; faded out before the mountains, which stay still.
- The painted valley clouds — the rose mist wisps sitting in the valleys and just above the treetops, including the pink puffs on the left mountainside — appear to churn slowly. This is done with drifting rose light inside those cloud shapes only, **never by displacing pixels** (displacement dragged treetops along; the owner rejected it three times). Trees, ridges and mountains must be perfectly still.
- An added soft rose fog drifts through the same valley zones only: dusty rose, translucent (owner: "slightly more translucent"), very slow (one way ≈ 2.5 minutes), two counter-drifting layers so shapes evolve. No fog over the castle or the mountain slopes. No re-forming noise (it caused visible flicker).
- The castle windows twinkle ever so slightly: each lit window occasionally swells a little brighter, independently, every 5–13 s, like a candle passing.
- Whole scene slowly pushes in (≈70 s).
- Overall contrast raised with deeper darks in the corners, top sky and foreground (owner asked for darker areas).

**Title.** "Academy of the Quiet Arts" small caps, "Lanternmere" large fine serif in solid cream (no gradient text), a thin gold flourish line with a small diamond beneath that glows softly, and a warm sunset glow behind the whole title block (owner: glow "behind the whole title"). "Press any key" below in the sky, larger than the first draft and clearly readable.

**After a key/click.** The lantern brightens briefly; the title lifts and shrinks a little; the menu fades in, centered in the sky so the lantern stays visible below it. Buttons: dark warm translucent fill, hairline gold double frame, serif label plus italic subline, and thin gold vine flourishes that branch and curl outward from both ends — drawn on the focused/hovered button and on the first ("Continue") button. Settings and Quit sit quietly top-right. Continue (when a save exists) is first and names the save.

**Precision assets.** `valley-wisps-mask-v2.png`, `valley-fog-zone.png` and `castle-lights.json` were derived from this exact painting (mist pixels by brightness/saturation within the valley band, eroded and feathered; lit windows by bright warm clusters). If the painting changes, regenerate them — the builder should turn the derivation into a script (`scripts/` alongside `prepare_art.py`).

## Goals

- Every screen adopts Lamplight: opening, menu, character creation, the main game shell, the book reader, the staged scene reader, map, people and profiles, conversation, grimoire and lessons, calendar, journal, gatherings, settings, gallery, the epilogues, dialogs and toasts — and the screens Plans 2–4 add (Claude "thinking" state, Guided interludes, Sandbox, Timeless/Timed choice).
- The game shell's **sidebar can be minimized** so the art can shine: collapses to a slim icon rail, or hides completely behind a small button/keyboard shortcut; the choice is remembered.
- **Reading modes** in Settings, alongside the existing text size / reveal speed / reduced motion:
  - **Lamplight** (default) — the warm dark look.
  - **Parchment** — light cream pages, brown ink, gold trim; for long reading or bright rooms.
  - **Night** — deeper and dimmer for reading in the dark.
  (Names and the exact set are my call; the owner asked for "a dark mode or easy reading mode or something".)
- A professionally made result, verified page by page with the installed design tools (see "Design review").

## Non-goals

- Changing story text, game rules, the engine, or save data.
- New illustrations for every screen. Existing art carries the scenes; new art only where a screen genuinely needs it (the opening painting is the one approved addition).
- A video background or a game engine. The opening is layered web effects over the painting.
- Building Plans 2–4 features. This spec styles them when they arrive.

## Anti-goals

- Generic "AI slop": glow on everything, gradient text, purple/blue neon, identical icon cards, centered-everything marketing layouts, decorative motion with no purpose.
- Anything that moves trees, mountains, rocks, the castle or the lantern in the opening.
- Flicker or jitter of any kind.
- Text that is hard to read: low contrast, long gold passages, story text over busy art without a backing.
- Gold and glow so common they stop feeling special by chapter 5.
- Overwhelming screens: too many panels, borders or effects at once.

## Design principles (what a professional would hold to)

1. **Art first.** Illustrations and portraits carry color; interface surfaces recede (dark warm translucent frames, thin lines). Collapsible chrome.
2. **Light has a source.** Gold light belongs to lanterns, candles, sunset, spells. Use glow only where something would actually emit light, and for special moments (choices, chapter openings, spells, the title). Elevation otherwise uses neutral shadows.
3. **Reading is sacred.** Story text: comfortable measure (~60–75 characters), generous leading, high contrast in every mode, solid backing behind text over art. Gold is for accents and short labels, never body text.
4. **One typographic voice.** A fine serif family for display and reading (the spike used Cormorant Garamond / Cormorant SC; the builder may choose a better reading face for body text if Cormorant is too delicate at small sizes) — bundled locally, since the desktop app must work offline. Small caps with wide tracking only for short labels.
5. **Restrained motion with meaning.** Slow ambient life in scenes; quick, purposeful UI transitions (≤300 ms); everything honors reduced motion.
6. **Consistency through tokens.** Color, type, spacing, radius, line and motion values defined once as design tokens and reused; three reading modes are token sets, not separate stylesheets.
7. **Vines are an accent, not wallpaper.** The branching vine flourish marks primary and focused actions; secondary buttons stay plain.

## Design review (owner requirement)

The owner asked that design is reviewed on every page using Impeccable and the other installed design tools, asking what professionals ask. Requirements:
- Establish the design system first with Impeccable (`/impeccable` — shape/init and document modes produce `DESIGN.md` and tokens), seeded from this spec and the approved spike.
- Every screen, in every reading mode, at desktop window sizes (1024×700 minimum up to large monitors), gets an Impeccable critique and audit pass, plus its anti-pattern detector; real findings are fixed. Intentional exceptions (e.g. the lantern's glow, owner-requested title glow) are recorded as the narrowest scoped ignores with a reason — never blanket ignores.
- Playwright screenshots of every screen and mode are captured for review and kept outside the repo or in an ignored folder.
- `frontend-design` guidance informs typography and composition decisions; Superdesign may be used for exploring variants of a screen before building it.
- Accessibility: WCAG AA contrast in all modes, visible keyboard focus (the vine flourish doubles as focus indication), full keyboard play, screen-reader labels preserved.

## Constraints

- Electron desktop app (Plan 1, merged): pages are served from `dist/` over `app://`; no network at runtime — fonts and assets must be bundled.
- Existing React components and CSS (`src/styles.css` ~3,700 lines, `src/dialogue-presentation.css`); restyle and restructure within them rather than rewriting the app.
- Existing reading preferences (`useReadingPreferences`) and reduced-motion handling must keep working and gain the reading-mode choice.
- Existing browser and desktop test suites must stay green; update selectors only where markup legitimately changes.
- The repo is public; screenshots of saves or anything private stay out of Git.

## Calls I made (owner can override)

- Reading-mode names and the three-mode set.
- **Menu structure is final from day one.** Top-level entries match the companion spec's three options: "The Story" (Prebuilt), then "The Guided Tale" and "The Open World" (names are placeholders). "The Story" opens a small in-place sub-choice between **Read the book** and **Live the world** (today's two modes). Until Plans 2–4 exist, the two AI entries are simply not shown; the layout already has room for them, so nothing is rebuilt later.
- **Saves are never overwritten from the menu.** Saves stay one slot per mode (no save-data change). **Continue** opens the most recently played save and names it (player · mode · chapter/season); it is hidden when no save exists. Choosing a mode whose slot already has a save continues that save, exactly as today's landing does. Starting a mode over stays where it is now: Settings → "Start this mode again", with its existing confirmation.
- The opening's menu replaces today's landing page. Name/house/familiar selection moves to a dedicated character-creation screen in the same style, shown only when entering a mode whose slot is empty. Restore-a-saved-game stays available from the menu (quietly, beside Settings).
- **Narrow widths: keep working, not redesigned.** The product is a desktop app (minimum window 1024×700), so the design and the Impeccable review target 1024×700 and up. Below that (browser dev at phone widths), layouts get a simple stacked fallback that stays usable and keeps the existing phone browser tests green; those tests may be updated only where markup legitimately changes, not deleted.
- **Plans 2–4 screens:** this plan delivers tokens plus three reusable patterns those plans will need — a "the world is thinking" waiting state over a scene, a free-text input in the Lamplight style, and a mode-choice card (for Timeless/Timed). The full screens are styled when built, using these.
- Fonts bundled locally (e.g. via `@fontsource`), not loaded from Google.
- This visual work is sequenced before Plans 2–4, so new AI screens are built in the finished style.

## Left to the builder

- Exact token values, type scale and the reading face for long text.
- How the shell, panels and each screen are composed in Lamplight, within the principles above.
- The vine flourish artwork refinement (the spike's vine is a first pass) and where else it appears.
- Implementation technique for each opening effect, as long as the behavior above holds (the spike shows one working way).
- Plan order and task split.
