"""Create browser-sized derivatives. Original user artwork is never modified."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, re

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'art'
OUT.mkdir(parents=True, exist_ok=True)
manifest = []
sources = sorted(ROOT.glob('*.png')) + sorted((ROOT / 'art').glob('*.png'))
PLACEHOLDERS = OUT / '.placeholders.json'
was_placeholder = set(json.loads(PLACEHOLDERS.read_text())) if PLACEHOLDERS.exists() else set()
for source in sources:
    target = OUT / (source.stem + '.webp')
    portrait = bool(re.match(r'c\d\d-', source.name))
    familiar = source.stem.startswith('fam-')
    kind = 'character' if portrait else 'familiar' if familiar else 'environment'
    with Image.open(source) as im:
        width, height = im.size
        if (not target.exists() or not target.stat().st_size or source.stat().st_mtime > target.stat().st_mtime
                or source.stem in was_placeholder):
            im.thumbnail((660, 850) if portrait or familiar else (1440, 1000))
            temporary = target.with_suffix('.webp.tmp')
            im.save(temporary, 'WEBP', quality=84, method=6)
            temporary.replace(target)
    manifest.append({'id':source.stem,'src':'/art/'+target.name,'kind':kind,'width':width,'height':height,'bytes':target.stat().st_size,'original':source.name,'generated':source.parent.name=='art'})


def label_font(size):
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def dashed_rect(draw, box, colour, dash=18, gap=10, width=3):
    x0, y0, x1, y1 = box
    for x in range(x0, x1, dash + gap):
        draw.line([(x, y0), (min(x + dash, x1), y0)], fill=colour, width=width)
        draw.line([(x, y1), (min(x + dash, x1), y1)], fill=colour, width=width)
    for y in range(y0, y1, dash + gap):
        draw.line([(x0, y), (x0, min(y + dash, y1))], fill=colour, width=width)
        draw.line([(x1, y), (x1, min(y + dash, y1))], fill=colour, width=width)


def placeholder(slot):
    """A clearly marked stand-in: drop art/<file> in and rebuild to replace it."""
    gold, cream = (232, 191, 110, 255), (251, 240, 214, 255)
    if slot['kind'] == 'portrait':
        im = Image.new('RGBA', (660, 825), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.ellipse((215, 150, 445, 420), fill=(58, 32, 18, 210))
        d.rounded_rectangle((110, 430, 550, 825), radius=150, fill=(58, 32, 18, 210))
        dashed_rect(d, (8, 8, 651, 816), gold)
        box_top = 560
    else:
        im = Image.new('RGBA', (1440, 810), (0, 0, 0, 255))
        d = ImageDraw.Draw(im)
        for y in range(810):
            t = y / 810
            d.line([(0, y), (1440, y)], fill=(int(44 + 30 * t), int(20 + 8 * t), int(18 + 4 * t), 255))
        dashed_rect(d, (14, 14, 1425, 795), gold, width=4)
        box_top = 330
    w = im.width
    for text, size, colour, gap in (('ART NEEDED', 46, gold, 64), (slot['file'], 30, cream, 46),
                                    (' · '.join(slot['request'].split(' — ')[:2])[:70], 22, cream, 0)):
        font = label_font(size)
        tw = d.textlength(text, font=font)
        d.text(((w - tw) / 2, box_top), text, font=font, fill=colour, stroke_width=2, stroke_fill=(20, 8, 4, 255))
        box_top += gap
    return im


slots_file = ROOT / 'art' / 'slots.json'
placeholders = []
if slots_file.exists():
    have = {a['id'] for a in manifest}
    for slot in json.loads(slots_file.read_text()):
        stem = Path(slot['file']).stem
        if slot['kind'] not in ('portrait', 'environment', 'closeup') or stem in have:
            continue
        target = OUT / (stem + '.webp')
        im = placeholder(slot)
        temporary = target.with_suffix('.webp.tmp')
        im.save(temporary, 'WEBP', quality=80, method=4)
        temporary.replace(target)
        placeholders.append(stem)
        kind = 'character' if slot['kind'] == 'portrait' else 'environment'
        manifest.append({'id': stem, 'src': '/art/' + target.name, 'kind': kind, 'width': im.width, 'height': im.height,
                         'bytes': target.stat().st_size, 'original': slot['file'], 'generated': True, 'placeholder': True,
                         'request': slot['request'], 'placement': slot['placement']})
PLACEHOLDERS.write_text(json.dumps(placeholders))
(OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2))
print(f'{len(placeholders)} art placeholders waiting for files (see art/slots.json).')
print(f'Prepared {len(manifest)} illustrations ({sum(a["bytes"] for a in manifest)/1024/1024:.1f} MiB). Originals preserved.')
