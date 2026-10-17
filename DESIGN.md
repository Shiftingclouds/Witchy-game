---
name: Lanternmere — Lamplight
description: A lamplit witch-academy world; warm umber and wine dusk lit by gold, fine serif lettering, art first.
colors:
  lamplight-bg: "#1a0f0a"
  lamplight-surface: "#26150d"
  lamplight-surface-strong: "#341d12"
  lamplight-backing: "#20120b"
  lamplight-ink: "#fbf0d6"
  lamplight-ink-soft: "#e4cfa6"
  lamplight-gold: "#e8bf6e"
  lamplight-gold-bright: "#f6d48e"
  lamplight-line: "#7a5631"
  lamplight-wine: "#5b2433"
  parchment-bg: "#f1e6cf"
  parchment-surface: "#f8f0de"
  parchment-backing: "#fbf5e8"
  parchment-ink: "#2b1a10"
  parchment-ink-soft: "#57402c"
  parchment-gold: "#93651f"
  parchment-line: "#c4a575"
  night-bg: "#0d0806"
  night-surface: "#160d09"
  night-backing: "#110a07"
  night-ink: "#e6d8bb"
  night-ink-soft: "#bfab88"
  night-gold: "#c49d55"
  night-line: "#4a3320"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(48px, 7.4vw, 112px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.05em"
  heading:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(26px, 2.4vw, 38px)"
    fontWeight: 500
    lineHeight: 1.15
  label:
    fontFamily: "Cormorant SC, Cormorant Garamond, Georgia, serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.28em"
  body:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  hairline: "1px"
  sm: "3px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "28px"
  xl: "48px"
components:
  button-vine:
    backgroundColor: "{colors.lamplight-surface}"
    textColor: "{colors.lamplight-ink}"
    typography: "{typography.heading}"
    rounded: "{rounded.hairline}"
    padding: "11px 28px 12px"
  story-backing:
    backgroundColor: "{colors.lamplight-backing}"
    textColor: "{colors.lamplight-ink}"
    typography: "{typography.body}"
    padding: "28px 36px"
---

# Design System: Lanternmere — Lamplight

## Overview

A lamplit world. The illustrations are the light source of the whole game; interface surfaces recede into warm umber and wine shadows, framed by hairline gold. It should feel warm, comforting, mysterious and magical, never overwhelming. Reference: the approved opening in `docs/design/opening-reference/` (lantern floating on a dusk lake, title in an empty sky). Spec: `docs/superpowers/specs/2026-10-17-lamplight-visual-design.md`.

## Colors

Three reading modes share one token vocabulary (`src/theme/tokens.mjs`, applied as `--lm-*` CSS variables on `<html data-reading-mode>`). Every text/surface pair meets WCAG AA (enforced by `tests/theme.test.mjs`).

### Primary
- **Gold** (`--lm-gold`, brighter `--lm-gold-bright`): linework, flourishes, focus, small labels. Never body text.

### Secondary
- **Wine** (`--lm-wine`): deep accent for selected states and dusk tints.

### Neutral
- **Umber grounds** (`--lm-bg`, `--lm-surface`, `--lm-surface-strong`), **story backing** (`--lm-backing`), **cream ink** (`--lm-ink`, `--lm-ink-soft`), **line** (`--lm-line`) for quiet borders.

### Named Rules
- **Light has a source.** Glow and warm bloom only on light sources (lantern, candles, sunset, spells, title) and special moments (choices, chapter openings). Everything else uses neutral shadow.
- **Gold is jewellery.** Thin lines, small caps labels, vines, the diamond. Never fills, never paragraphs.

## Typography

- **Display** Cormorant Garamond for titles and headings; **Labels** Cormorant SC with wide tracking, short phrases only; **Reading** EB Garamond for story text and UI copy. Fonts are bundled (`src/theme/fonts.mjs`).

### Hierarchy
Display title → heading → body at a 60–75 character measure with ~1.6 leading. Speaker names in the display face.

### Named Rules
- **No gradient text, ever.** Solid cream or ink; warmth comes from light behind, not colour inside letters.

## Layout

Art first: scenes fill the window; panels are translucent and collapsible (sidebar: open / rail / hidden). Desktop target 1024×700 and up; below 1024px layouts stack.

## Elevation & Depth

Depth comes from light falloff and vignettes over the art, plus neutral (black, low-alpha) shadows for panels. Chromatic glow is reserved per the "light has a source" rule.

## Shapes

Hairline frames (1px gold at ~55% alpha) with an inner second hairline 5px inset for primary buttons and important panels. Radii are near-square (1–3px). The diamond is the only ornament on rules.

## Components

### Buttons
- **Vine button** (primary/focused): dark warm translucent fill, double hairline frame, serif label + italic subline; branching gold vine flourishes grow outward from both ends on hover/focus and on the lead action.
- **Quiet button**: small caps label, no frame; for secondary actions.

### Cards / Containers
Translucent umber panels with a single hairline and neutral shadow; art inside is framed by a hairline, never rounded heavily.

### Inputs / Fields
Underlined or hairline-framed fields on `--lm-surface`, reading face, visible gold focus.

### Navigation
Sidebar in umber glass with thin gold rules; collapses to an icon rail or hides; remembered.

### The Living Opening (signature)
Layered effects over the painting: breathing lantern glow, rising sparks, ripple rings, lake shimmer (masked away from rocks, lantern and orbs), drifting sky clouds, rose cloud-light and valley fog, twinkling castle windows, slow push-in. Still things never move; nothing flickers; all motion stops under reduced motion.

## Do's and Don'ts

### Do:
- Let illustrations carry colour; keep chrome quiet.
- Use the vine flourish for primary and focused actions only.
- Keep story text on solid backing with AA contrast in every mode.
- Honour reduced motion everywhere.

### Don't:
- Glow on everything, gradient text, purple/blue neon, glass cards everywhere, icon-card grids.
- Animate trees, mountains, rocks, the castle or the lantern in the opening, or anything by displacing detailed pixels.
- Use gold for paragraphs or wide tracking on body text.
