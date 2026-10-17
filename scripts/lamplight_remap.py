"""One-off migration: remap the legacy light 'paper' palette and tiny type in a stylesheet onto Lamplight tokens.
Usage: python3 scripts/lamplight_remap.py src/styles.css [more.css]"""
import colorsys, re, sys

HEX = re.compile(r'#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b')
RGBA = re.compile(r'rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)')
TEXT = {'color', 'fill', 'stroke', 'caret-color', 'text-decoration-color', 'accent-color'}
BACK = {'background', 'background-color', 'background-image'}
LINE = re.compile(r'^(border(-\w+)*|outline(-color)?|column-rule(-color)?)$')
RAMP = [(12.99, 13), (14.99, 15), (16.99, 17), (18.99, 19), (21.99, 23), (27.99, 28), (35.99, 32), (49.99, 44)]


def parse(token):
    if token.startswith('#'):
        h = token[1:]
        if len(h) == 3:
            h = ''.join(c * 2 for c in h)
        r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1
        return r, g, b, a
    m = RGBA.match(token)
    return int(m[1]), int(m[2]), int(m[3]), float(m[4]) if m[4] else 1


def lum(r, g, b):
    c = lambda v: (v / 255) / 12.92 if v / 255 <= 0.03928 else ((v / 255 + 0.055) / 1.055) ** 2.4
    return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b)


def with_alpha(var, a):
    return var if a >= 0.99 else f'color-mix(in srgb, {var} {round(a * 100)}%, transparent)'


def remap(token, prop):
    r, g, b, a = parse(token)
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    L = lum(r, g, b)
    green = 0.2 < h < 0.45 and s > 0.08
    if prop in TEXT:
        if L > 0.6:
            return token  # light text already sits on dark art overlays
        if green and s > 0.15:
            return with_alpha('var(--lm-gold)', a)  # old green accents (icons, dots, links)
        return with_alpha('var(--lm-ink)' if L < 0.06 else 'var(--lm-ink-soft)', a)
    if prop in BACK:
        if L < 0.05:
            return token  # dark overlays over art stay
        if green and L < 0.35:
            return with_alpha('var(--lm-wine)', a)
        if L > 0.55:
            return with_alpha('var(--lm-surface)', a)
        return with_alpha('var(--lm-surface-strong)', a)
    if LINE.match(prop):
        if L < 0.05:
            return token
        if green and L < 0.35:
            return with_alpha('var(--lm-gold)', a)
        return with_alpha('var(--lm-line)', min(a, 0.7) if a < 0.99 else 0.7)
    return token


def font_size(value):
    def step(m):
        px = float(m[1])
        for limit, target in RAMP:
            if px <= limit:
                return f'{target}px'
        return m[0]
    return re.sub(r'(\d+(?:\.\d+)?)px', step, value)


def migrate(css):
    out = []
    for line in css.splitlines(keepends=True):
        m = re.match(r'^(\s*)([a-z-]+)(\s*:\s*)(.*?)(;?\s*)$', line)
        if not m or m[2].startswith('--'):
            out.append(line)
            continue
        indent, prop, colon, value, end = m.groups()
        if prop == 'font-size':
            value = font_size(value)
        elif prop == 'font' or prop == 'font-family':
            value = value.replace('Arial, Helvetica, sans-serif', 'var(--lm-read)').replace('Arial, sans-serif', 'var(--lm-read)').replace('Arial', 'var(--lm-read)')
            if prop == 'font':
                value = re.sub(r'^(\d+(?:\.\d+)?)px', lambda x: font_size(x[0]), value)
        else:
            value = RGBA.sub(lambda x: remap(x[0], prop), value)
            value = HEX.sub(lambda x: remap(x[0], prop), value)
        out.append(indent + prop + colon + value + end)
    css = ''.join(out)
    # Multi-line `font:` shorthands written as "Npx Arial, sans-serif" on their own lines.
    css = re.sub(r'(\d+(?:\.\d+)?px)(\s+)Arial,(\s*)sans-serif', lambda x: font_size(x[1]) + x[2] + 'var(--lm-read)', css)
    return css


for path in sys.argv[1:]:
    with open(path, encoding='utf-8') as f:
        css = f.read()
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(migrate(css))
    print('migrated', path)
