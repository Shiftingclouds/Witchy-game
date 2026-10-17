"""Build art/slots.json from the ChatGPT request lists, so slot filenames always match the requests."""
from pathlib import Path
import json, re

ROOT = Path(__file__).resolve().parent.parent
DOCS = [ROOT / 'docs/design/ART_REQUESTS.md', ROOT / 'docs/design/WORLD_ART_REQUESTS.md']
# Files named in the requests only as references to attach, never as new art.
REFERENCES = {'c01-rowan-neutral.png', 'c02-imogen-neutral.png', 'lantern-hall.png', 'mere-day.png', 'mere-night.png',
              'thimble-cross.png', 'whispering-wood.png', 'boathouse.png', 'rookery.png', 'classroom.png',
              'home-kitchen.png', 'glasshouses.png', 'candlestones.png'}
LAYERS = {'opening-lantern.png', 'opening-lake-empty.png'}


def expand(name):
    m = re.match(r'^(.*)\{([a-z,]+)\}(.*)$', name)
    return [m.group(1) + v + m.group(3) for v in m.group(2).split(',')] if m else [name]


def kind(name):
    if name == 'lantern-icon.png':
        return 'icon'
    if name in LAYERS:
        return 'layer'
    if re.match(r'^c\d\d-', name):
        return 'portrait'
    if name.startswith(('clue-', 'cg-')):
        return 'closeup'
    return 'environment'


def placement(name, k):
    if k == 'icon':
        return 'build/icon.png (electron-builder win.icon) and the hidden-sidebar button'
    if k == 'layer':
        return 'art/; opening scene layers (lantern bob) — see ART_REQUESTS.md entry'
    if k == 'portrait':
        prefix = re.match(r'^c\d\d-(.+?)-(neutral|[a-z]+)\.png$', name)
        who, expr = prefix.group(1), prefix.group(2)
        return f'art/{name}; register "{expr}" in characters/*/{who}.json presentation.expressions, then npm run sync:characters'
    if k == 'closeup':
        return f'art/{name}; beat illustration in the matching src/story/ scene'
    return f'art/{name}; location background (new places: add a row to src/content.mjs locations)'


slots, seen = [], set()
for doc in DOCS:
    section = ''
    for line in doc.read_text(encoding='utf-8').splitlines():
        if line.startswith('## '):
            section = line[3:].strip()
        for raw in re.findall(r'`([a-z0-9{},-]+\.png)`', line):
            for name in expand(raw):
                if name in REFERENCES or name in seen:
                    continue
                seen.add(name)
                k = kind(name)
                slots.append({'file': name, 'kind': k, 'request': f'{doc.name} — {section}', 'placement': placement(name, k)})
(ROOT / 'art' / 'slots.json').write_text(json.dumps(slots, indent=2) + '\n')
print(f'{len(slots)} art slots')
