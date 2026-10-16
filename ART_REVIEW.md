# Artwork review and direction

Reviewed the actual PNGs in the repository at `8f4cbe2162834bf2a309bdd39bbe44eb2fb9bc11`, using contact sheets and full-size inspection of representative backgrounds and transparent portraits. No instructions or story from the old README or JSON sidecars were used.

## Inventory

| Original assets | Count | What they support |
| --- | ---: | --- |
| Environments | 49 | Academy interiors, four house common rooms, lake, woodland, ruins, village, arrival scenes, seasonal variants, and a few contemporary settings |
| Portrait files | 85 | 45 named identities, full expression sets for the first three, and six `-v1` alternatives |
| Familiars | 8 | Cat, ferret, fox, hare, moth, owl, raven, toad |
| **Total original PNGs** | **142** | All preserved and included in the in-app art collection |

The backgrounds are 1672×941. Most portraits and familiars are 1122×1402; a few alternate versions have slightly different dimensions. Character and familiar images have real alpha transparency, so they can be composited directly over the environments. Runtime defaults use the non-`v1` files; alternatives remain available in the gallery.

## Decisions made from the art

- **The lake is the centre of the world.** `mere-day`, `mere-night`, `mere-frozen`, and `boathouse` establish the academy on an island, arrivals by boat, and a shore that changes with the season.
- **Lanterns give the story its central image.** `lantern-hall`, its dark/festival variants, `lamplighters`, and `heartfire` support a mystery about shared warmth, forgotten people, and remembering who makes a place feel like home.
- **The existing expressive trio leads the story.** Rowan, Imogen, and Saoirse can already show warmth, amusement, worry, hurt, and other emotions. They have distinct authored personalities here; their old project's canon was not imported.
- **The four existing common rooms become the houses.** Owlcombe, Rookhallow, Heronmere, and Larkspire connect the bird imagery visible in the hall with real spaces the player can visit.
- **Winter and festivals are visible events.** The frozen lake, snowy village and pitch, Emberfall hall, and Longnight hall switch with the calendar. Spring/summer currently reuse the available base environments; their dedicated art is an appropriate future addition.
- **The interface stays quiet around the art.** Warm paper, muted green, fine gold details, serif headings, large scenic panels, and transparent character overlays draw from the illustrations' natural and candlelit palette.

37 destinations are used in the initial world. Other images include alternate states and modern-world scenes such as `work`, `st-ides`, and `home-street-night`; they are kept in the gallery, not forced into the academy's geography.

## New artwork

`art/academy-map.png` is a generated overview map made with `mere-day.png` and `lantern-hall.png` as image references. It preserves the lake, island castle, shore boathouse, stone bridge, autumn foliage, and painterly pixel texture. The interactive landmarks are HTML controls above the image, so they remain usable with a keyboard and on mobile.

No replacement character portraits or backgrounds were generated. The supplied collection already supports the first-year arc. Useful later additions are spring/summer versions of frequently visited places and expressions for secondary characters once their stories are written. Those should use the corresponding original as an image reference.

## Asset handling

Original source PNGs stay at their uploaded paths. The build generates `public/art/*.webp` and `public/art/manifest.json`; these outputs are ignored by Git and reproduced by `scripts/prepare_art.py`. Character derivatives retain transparency. Conversion resizes and compresses; it does not repaint or change the originals.

The initial complete browser art set, including the new map, is approximately 26.6 MiB. The service worker downloads this once for offline play. It uses a content-hashed cache version so later builds replace the old cache only after their new artwork finishes caching.
