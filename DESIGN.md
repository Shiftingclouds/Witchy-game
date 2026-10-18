---
name: Lanternmere — Lamplight
description: A lamplit witch-academy world; warm umber and wine dusk lit by gold, fine serif lettering, art first. Outside the story, the game is an illuminated grimoire open on a candlelit desk.
colors:
  lamplight-bg: '#1a0f0a'
  lamplight-surface: '#26150d'
  lamplight-surface-strong: '#341d12'
  lamplight-backing: '#20120b'
  lamplight-ink: '#fbf0d6'
  lamplight-ink-soft: '#e4cfa6'
  lamplight-gold: '#e8bf6e'
  lamplight-gold-bright: '#f6d48e'
  lamplight-line: '#7a5631'
  lamplight-wine: '#5b2433'
  parchment-bg: '#f1e6cf'
  parchment-surface: '#f8f0de'
  parchment-backing: '#fbf5e8'
  parchment-ink: '#2b1a10'
  parchment-ink-soft: '#57402c'
  parchment-gold: '#7a521a'
  parchment-line: '#c4a575'
  night-bg: '#0a0605'
  night-surface: '#110a07'
  night-backing: '#0d0806'
  night-ink: '#dccdae'
  night-ink-soft: '#b19d7c'
  night-gold: '#b8934e'
  night-line: '#3f2b1b'
  shadow: 'rgba(0, 0, 0, 0.5)'
  painting-ink: '#fbf0d6'
  painting-gold: '#f0cc84'
  painting-gold-light: '#ffe3a3'
  grimoire-parchment: '#e4cfa3'
  grimoire-parchment-light: '#f0e0bd'
  grimoire-parchment-edge: '#a07a45'
  grimoire-ink: '#2b1a10'
  grimoire-ink-soft: '#553c28'
  grimoire-rubric: '#8a2b1e'
  grimoire-gilt: '#b07d2a'
  grimoire-verdigris: '#4f6b45'
  grimoire-wine: '#6b2a38'
  silk-today: '#7d2a2a'
  silk-map: '#3f5a3a'
  silk-story: '#2f4660'
  silk-people: '#8a5a1e'
  silk-spells: '#5a3566'
  silk-calendar: '#6e3a1f'
  silk-journal: '#3c4a2a'
typography:
  display:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: 'clamp(48px, 7.4vw, 112px)'
    fontWeight: 400
    lineHeight: 1
    letterSpacing: '0.05em'
  heading-lg:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: '44px'
    fontWeight: 500
    lineHeight: 1.1
  heading-md:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: '28px'
    fontWeight: 500
    lineHeight: 1.15
  heading:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: '32px'
    fontWeight: 500
    lineHeight: 1.15
  lead:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: '23px'
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: 'EB Garamond, Georgia, serif'
    fontSize: '19px'
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: 'EB Garamond, Georgia, serif'
    fontSize: '17px'
    fontWeight: 400
    lineHeight: 1.45
  small:
    fontFamily: 'EB Garamond, Georgia, serif'
    fontSize: '15px'
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: 'Cormorant SC, Cormorant Garamond, Georgia, serif'
    fontSize: '13px'
    fontWeight: 600
    letterSpacing: '0.28em'
  page-title:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: '34px'
    fontWeight: 500
    lineHeight: 1.1
  page-sub:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: '22px'
    fontWeight: 500
    lineHeight: 1.2
  page-card-title:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: '26px'
    fontWeight: 500
    lineHeight: 1.15
  page-body:
    fontFamily: 'EB Garamond, Georgia, serif'
    fontSize: '18px'
    fontWeight: 400
    lineHeight: 1.6
  page-label:
    fontFamily: 'Cormorant SC, Cormorant Garamond, Georgia, serif'
    fontSize: '15px'
    fontWeight: 600
    letterSpacing: '0.08em'
  page-caption:
    fontFamily: 'EB Garamond, Georgia, serif'
    fontSize: '14px'
    fontWeight: 400
    lineHeight: 1.4
  drop-initial:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: '62px'
    fontWeight: 600
    lineHeight: 1
rounded:
  hairline: '1px'
  xs: '2px'
  sm: '3px'
  page: '4px'
  cover: '6px'
  arch-place: '27px'
  arch-resident: '38px'
  arch-portrait: '48px'
  pill: '999px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '28px'
  xl: '48px'
components:
  button-vine:
    backgroundColor: '{colors.lamplight-surface}'
    textColor: '{colors.lamplight-ink}'
    typography: '{typography.lead}'
    rounded: '{rounded.hairline}'
    padding: '11px 28px 12px'
  story-backing:
    backgroundColor: '{colors.lamplight-backing}'
    textColor: '{colors.lamplight-ink}'
    typography: '{typography.body}'
    padding: '28px 36px'
  grimoire-page:
    backgroundColor: '{colors.grimoire-parchment}'
    textColor: '{colors.grimoire-ink}'
    typography: '{typography.page-body}'
    padding: '50px 62px 72px'
  ribbon:
    textColor: '{colors.lamplight-ink}'
    typography: '{typography.page-label}'
    height: '42px'
    width: '166px'
---

# Design System: Lanternmere — Lamplight

## Overview

A lamplit world. The illustrations are the light source of the whole game; interface surfaces recede into warm umber and wine shadows, framed by hairline gold. It should feel warm, comforting, mysterious and magical, never overwhelming. Reference: the approved opening in `docs/design/opening-reference/` (lantern floating on a dusk lake, title in an empty sky). Spec: `docs/superpowers/specs/2026-10-17-lamplight-visual-design.md`.

Outside the story the game is **the illuminated grimoire**: an open book on a dark, candlelit desk. Each section is a two-page spread of aged parchment with a running head, a page number, green vines in the margins, gilded drop capitals and dates in red ink. Silk ribbon bookmarks on the book's edge are the navigation. The desk is the lamplit world; the page is ink on paper. Reference: `docs/design/grimoire-reference/`; plan: `DESIGN_PLAN.md`; code: `src/features/shell/`.

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

### The page (grimoire)

Inside the book, the `--lm-*` tokens are swapped for parchment ones (`--gm-*` in `src/features/shell/grimoire.css`), so every component reads as ink on paper:

- **Parchment** (`grimoire-parchment`, lighter `grimoire-parchment-light`, darker `grimoire-parchment-edge` for page edges and the gutter). Each reading mode has its own parchment: lighter in Parchment mode, darker in Night mode.
- **Ink** (`grimoire-ink`, `grimoire-ink-soft`): all reading text, and hint text in inputs (never fainter than ink-soft).
- **Rubric** (`grimoire-rubric`): red ink for dates, section labels, today's hand-drawn circle, the current map pin, and focus on the page.
- **Gilt** (`grimoire-gilt`): rules, ornaments, the festival dot. The drop capital mixes gilt 55% into ink so it stays readable.
- **Verdigris** (`grimoire-verdigris`): margin vines and pressed leaves.
- **Silks** (`silk-*`): one ribbon colour per section, used only on that ribbon.

**The Red Ink Rule.** Rubric marks what is dated, current or chosen: a day, a label, the place you stand. It never fills a box.

## Typography

- **Display** Cormorant Garamond for titles and headings; **Labels** Cormorant SC with wide tracking, short phrases only; **Reading** EB Garamond for story text and UI copy. Fonts are bundled (`src/theme/fonts.mjs`).

### Hierarchy

Type ramp (px): 13 label · 15 small · 17 ui · 19 body · 23 lead · 28 sub-heading · 32 heading · 44 large heading · display clamp(48–112). On the grimoire's pages: 14 caption (running heads, page numbers, ribbons, where-someone-is) · 15 page label (small caps, 0.08em, used for every section label, mark and count) · 18 page body · 22 page sub-heading and feast names · 23 person and house names · 26 card title · 34 page title and feast dates · 62 drop capital. Fluid sizes interpolate between two ramp steps. Story text uses body at a 60–75 character measure with ~1.6 leading. Speaker names in the display face.

### Named Rules

- **No gradient text, ever.** Solid cream or ink; warmth comes from light behind, not colour inside letters.
- **No eyebrows.** A heading stands alone; a page label never sits above a title as a kicker. Labels like "A festival day" go in the details line under the title.
- **One page, one h1.** Page titles are h1, card and person titles h2; headings never skip a level.

## Layout

Art first: scenes fill the window. Desktop target 1024×700 and up.

**The grimoire.** The book fills the desk below a thin top line (the wordmark opens the book's first section; then the date, settings and main menu). A spread is two pages around a gutter; the map is one wide leaf. Each page scrolls inside itself, and its text fades out above the page number so it never runs under it. Actions that close the day (Wait, Rest) sit in a fixed page foot under a hairline rule, always in reach. Page numbers follow ribbon order like one real book. Below 1180px the book narrows and ribbons shorten; below 900px the spread becomes one column of pages, the gutter turns horizontal, ribbons open from a menu button that names the current section, and the desk vines, familiar and halo are hidden. No page ever scrolls sideways.

## Elevation & Depth

Depth comes from light falloff and vignettes over the art, plus neutral (black, low-alpha) shadows for panels. Chromatic glow is reserved per the "light has a source" rule.

## Shapes

Hairline frames (1px gold at ~55% alpha) with an inner second hairline 5px inset for primary buttons and important panels. Radii are near-square (1–3px). The diamond is the only ornament on rules.

On the grimoire, page corners are 4px at the spine-side top and 6px at the outer bottom (`page`, `cover`). Portraits and place paintings sit in **arched windows**: a full round top over 2px bottom corners, sized to the window (`arch-portrait` 48px for people, `arch-resident` 38px for those here this morning, `arch-place` 27px for nearby places; painted plates use a 999px / 46% ellipse). Round things are circles (50%) or pills (`pill`). Cards on the page have no radius at all: they are ruled, not boxed.

## Components

### Buttons

- **Vine button** (primary/focused): dark warm translucent fill, double hairline frame, serif label + italic subline; branching gold vine flourishes grow outward from both ends on hover/focus and on the lead action.
- **Quiet button**: small caps label, no frame; for secondary actions.

### Cards / Containers

Translucent umber panels with a single hairline and neutral shadow; art inside is framed by a hairline, never rounded heavily.

### Inputs / Fields

Underlined or hairline-framed fields on `--lm-surface`, reading face, visible gold focus.

### Navigation

- **Ribbons:** silk bookmarks hang off the book's right edge, one per section (Today, Map, Story, People, Spells, Calendar, Journal), each in its own silk, with a small-caps label. The open ribbon slides out further and brightens; it carries `aria-current`. Their accessible names stay the section names (Your day, World map, The story, People, Grimoire, Calendar, Journal).
- **Narrow windows:** a rounded menu button shows the current section's name and opens the ribbons as a list.

### The Grimoire Page (signature)

- **Running head:** "Lanternmere" in italics on the left page, the section's name on the right.
- **Drop capital:** each section's opening paragraph starts with a gilded initial in a vine-wrapped square.
- **Marginalia:** hand-written margin notes, a pressed leaf, moon phases with day numbers (tonight ringed in red), gesture sketches. They come from the player's own game (journal, people, festivals, the date), never invented.
- **Blank states are pages, not apologies:** unlearned spells show faint sigil rings with the room they are taught in; an empty journal shows a ruled notes page.
- **Calendar:** a hand-ruled month; today is circled in red as if by pen; feast days get a gold dot and red numerals.
- **The atlas:** the map is a framed plate with a gilt outline; place names are italic ink cartouches, the current place in red.
- **No web widgets on the page:** no progress bars (say "Chapter one of eight"), no browser checkboxes (inked squares), no resize grips (the notes page grows with its text).

### The Living Opening (signature)

Layered effects over the painting: breathing lantern glow, rising sparks, ripple rings, lake shimmer (masked away from rocks, lantern and orbs), drifting sky clouds, rose cloud-light and valley fog, twinkling castle windows, slow push-in. Still things never move; nothing flickers; all motion stops under reduced motion.

## Do's and Don'ts

### Do:

- Let illustrations carry colour; keep chrome quiet.
- Use the vine flourish for primary and focused actions only.
- Keep story text on solid backing with AA contrast in every mode.
- Honour reduced motion everywhere.
- On the grimoire, write numbers the way a book would ("Chapter one of eight"; friendship as "Friendship 40 of 100" in a tooltip, not "40/100").
- Keep the day's closing actions in the page foot.

### Don't:

- Glow on everything, gradient text, purple/blue neon, glass cards everywhere, icon-card grids.
- Animate trees, mountains, rocks, the castle or the lantern in the opening, or anything by displacing detailed pixels.
- Use gold for paragraphs or wide tracking on body text.
- Put kickers above headings, solid colour fills on calendar days, or chromatic shadows on the page (glow belongs to the desk's light sources).
- Repeat the same person or card twice on one spread.
