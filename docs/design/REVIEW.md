# Lamplight design review — 17 October 2026

How the review ran:

- **Captures:** `npm run design:screens` captured all 20 screens × 3 reading modes × 2 window sizes (1440×900 and 1024×700) into `.superpowers/review/`.
- **Critique:** two isolated Impeccable critique passes. Assessment A was a design review using the Nielsen heuristics, cognitive load and the emotional journey. Assessment B was the anti-pattern detector plus measured browser evidence: contrast, focus, overflow, target size and minimum text size.
- **Detector:** `npm run design:detect` runs Impeccable's anti-pattern detector over `src/`. It must report 0 blocking findings.

## Scores before fixes

- Nielsen total: 24/36 (67%, upper "Acceptable").
- Design specificity: the opening is fully specific to Lanternmere; the in-game shell carried a generic layer underneath.
- Detector: 0 blocking findings, 131 advisory notes.

## Findings and outcomes

| # | Finding | Screens / modes | Outcome |
|---|---|---|---|
| 1 | Some text fell back to a sans-serif font (chapter tabs, story speaker); green rounded crest | book, scene reader, all shell screens | **Fixed.** Fonts now use the Lamplight label and reading faces; crest redrawn in umber and gold. |
| 2 | Type scale collapsed to 13px; UI text too small, choice labels smaller than the story | all | **Fixed.** 184 non-label declarations raised to 15px; 13px kept only for small-caps labels; choice and answer rows at 17px. |
| 3 | Book hero art stretched with the text and became pixelated; reading controls sat inside the story flow | book, scene reader | **Fixed.** Fixed-height art panel; reading controls moved to a "Reading settings" button and dialog. (The scene reader keeps its compact controls; the tests rely on them.) |
| 4 | The ending and choices lacked ceremony; drop cap had a gap | epilogue, gathering, lesson, conversation | **Fixed.** The epilogue has its own stage (Heartfire art, closing line set large, quiet stats, vine button, no duplicate toast). Choices drop the 01/02 and A/B/C prefixes and gain a gold edge and warm fill on hover and focus. Stray gold first letters removed. |
| 5 | Hairline boxes everywhere; Grimoire's numbered icon cards | grimoire, people, journal, calendar | **Fixed in part.** Secondary lines quieter (55 borders at 45%); the inner search border is gone; Grimoire spells read as pages (no numerals, top rule only, incantation in italic display). **Deferred:** varying the page-header formula on every page. |
| 6 | At 1024×700 the sidebar crowds the art; small opening actions | shell at 1024, opening | **Fixed.** Rail by default below 1200px wide; the familiar card hides on short windows; opening links at 15px with ≥32px targets; "Back" carries its own dark backing. |
| 7 | Parchment gold labels below 4.5:1 (measured 3.9–4.5) | Parchment | **Fixed.** Parchment gold darkened to `#7a521a` (≥4.99:1 on every ground); token test added. |
| 8 | "Back" over the bright sunset measured 2.8:1 | story choice, all modes | **Fixed.** Dark backing behind it. |
| 9 | "Restore a save" and "Import save" not reachable by keyboard | title, settings | **Fixed.** Both are real buttons that open the file picker; test added. |
| 10 | Search inputs 21px tall | map, people | **Fixed.** Minimum 32px. |
| 11 | Parchment title menu labels invisible; Night too close to Lamplight | Parchment, Night | **Fixed.** The opening keeps Lamplight colours in every mode; Night is deeper and dimmer with a fainter art backdrop. |
| 12 | Minor copy: "1 places visited", "LOCAL STORY" jargon, saturated house-colour initial | journal, top bar, sidebar | **Fixed.** |
| 13 | Advisory drift (undocumented radius, sizes, colours) | src | **Reduced** from 131 to 29. Green overlays warmed to umber; 2px radius, 28px step and painting colours documented in DESIGN.md. The remaining notes are intentional translucent overlays. |

## Deferred for later polish

- **Page headers:** every page uses the same eyebrow + headline + subline formula; vary it per page.
- **Your Day:** the first page after creating a character is dense. Consider a calmer, scene-led arrival with the panels arriving on demand.
- **Scene reader:** still shows its own reading controls, and a "Line 1" counter.
- **Relationship numbers:** shown as "0/100"; a heart or thin bar would feel warmer.
- **Keyboard hints:** no visible shortcut hints (Ctrl+B, Show full text).
