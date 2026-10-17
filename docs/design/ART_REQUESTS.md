# Art requests for ChatGPT

A running list of artwork the Lamplight redesign would benefit from. Each entry has a prompt to paste into ChatGPT and a placement note. Match the existing illustration style: painterly, warm, detailed fantasy scenes like `art/opening-lantern-mere.png`, with no text or lettering. Save finished files with the exact filename given and hand them over; the placement note says where each one goes.

Status: **wanted** (would clearly improve a screen), **nice to have** (optional polish), **received**, **placed**.

The existing story-art queue lives in `docs/ART_COMPLETION.md`; this list covers only interface and redesign needs.

---

## Placeholders in the game

Every file in these lists has a slot in `art/slots.json` (generated from these documents by `python3 scripts/make_art_slots.py`). Until the real file exists, the build paints a clearly marked **ART NEEDED · filename** placeholder wherever the game would show it, and the Art collection in Settings lists it. To fill one: save ChatGPT's image as `art/<exact filename>` (portraits as transparent PNG), then run `npm run build` (or `npm run app`). The placeholder disappears and the real art takes its place everywhere. Portrait expressions also need registering on the character sheet (each slot's `placement` says where).

## 1. App icon — wanted

**Prompt:** "A single small brass lantern with a warm golden flame, ornate but simple silhouette, centred on a deep umber-brown background with a soft gold glow behind it, painted in the same warm painterly fantasy style as the attached lake painting, square 1024×1024, no text, readable when shrunk to 32 pixels."

**File:** `lantern-icon.png` (1024×1024 PNG)

**Placement (for me):** `build/icon.png`; reference it from `electron-builder.yml` (`win.icon`). Electron-builder converts it to `.ico`. Also use a 64px version as the hidden-sidebar reopen button in the game shell (Task 4).

## 2. The lantern on its own + the lake without it — nice to have

**Prompt A:** "The exact brass lantern from the attached painting, isolated on a fully transparent background, same angle, lighting and painterly style, with its golden glow, no water, no reflection, PNG with transparency."

**Prompt B:** "The attached painting with the floating lantern and its glow removed, the lake surface and ripples continuing naturally where it was; everything else identical."

**Files:** `opening-lantern.png` (transparent), `opening-lake-empty.png` (same size as `art/opening-lantern-mere.png`, 1672×941 or larger)

**Placement (for me):** `art/`. In `src/features/opening/OpeningScene.jsx`, swap the base painting for the empty lake and float the lantern as its own layer with a slow, gentle bob (a few pixels over ~6 s), keeping its reflection column in the water. Regenerate the masks with `scripts/make_opening_assets.py` afterwards. Only worth doing if the owner wants the lantern itself to bob.
