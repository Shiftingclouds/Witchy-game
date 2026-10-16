"""Create browser-sized derivatives. Original user artwork is never modified."""
from pathlib import Path
from PIL import Image
import json, re

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'art'
OUT.mkdir(parents=True, exist_ok=True)
manifest = []
sources = sorted(ROOT.glob('*.png')) + sorted((ROOT / 'art').glob('*.png'))
for source in sources:
    target = OUT / (source.stem + '.webp')
    portrait = bool(re.match(r'c\d\d-', source.name))
    familiar = source.stem.startswith('fam-')
    kind = 'character' if portrait else 'familiar' if familiar else 'environment'
    with Image.open(source) as im:
        width, height = im.size
        if not target.exists() or not target.stat().st_size or source.stat().st_mtime > target.stat().st_mtime:
            im.thumbnail((660, 850) if portrait or familiar else (1440, 1000))
            temporary = target.with_suffix('.webp.tmp')
            im.save(temporary, 'WEBP', quality=84, method=6)
            temporary.replace(target)
    manifest.append({'id':source.stem,'src':'/art/'+target.name,'kind':kind,'width':width,'height':height,'bytes':target.stat().st_size,'original':source.name,'generated':source.parent.name=='art'})
(OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2))
print(f'Prepared {len(manifest)} illustrations ({sum(a["bytes"] for a in manifest)/1024/1024:.1f} MiB). Originals preserved.')
