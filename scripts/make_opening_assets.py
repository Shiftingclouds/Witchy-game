"""Derive the opening scene's masks and window lights from the painting. Original art is never modified."""
from pathlib import Path
from PIL import Image, ImageChops, ImageFilter
import colorsys, json, random

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'art' / 'opening-lantern-mere.png'
OUT = ROOT / 'public' / 'opening'


def smooth(a, b, x):
    t = min(1, max(0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def build_mask(im, rows, cols, alpha):
    W, H = im.size
    px = im.load()
    m = Image.new('L', (W, H), 0)
    mp = m.load()
    for y in range(int(rows[0] * H), int(rows[1] * H)):
        for x in range(int(cols[0] * W), int(cols[1] * W)):
            r, g, b = px[x, y]
            _, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            mp[x, y] = int(255 * alpha(x / W, y / H, s, v))
    return m


def wisps(im):
    """Mist rising above the treeline and in the valleys (not the low mist among trees)."""
    m = build_mask(im, (.46, .575), (0, 1), lambda x, y, s, v:
                   smooth(.46, .485, y) * smooth(.575, .545, y) * (1 - smooth(.70, .74, x))
                   * smooth(.36, .52, v) * smooth(.64, .48, s))
    return m.filter(ImageFilter.GaussianBlur(3)).point(lambda v: 255 if v > 70 else 0) \
            .filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(5))


def puffs(im):
    """The soft pink cloud puffs on the left mountainside."""
    m = build_mask(im, (.43, .59), (.05, .52), lambda x, y, s, v:
                   smooth(.43, .455, y) * smooth(.59, .565, y) * smooth(.05, .09, x) * smooth(.52, .48, x)
                   * smooth(.28, .42, v) * smooth(.62, .5, s))
    return m.filter(ImageFilter.GaussianBlur(2.5)).point(lambda v: 255 if v > 90 else 0) \
            .filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(4))


def save_alpha(mask, path):
    out = Image.new('RGBA', mask.size, (255, 255, 255, 0))
    out.putalpha(mask)
    out.save(path)


def castle_lights(im):
    W, H = im.size
    px = im.load()
    clusters = []
    for y in range(int(.33 * H), int(.66 * H)):
        for x in range(int(.74 * W), W):
            r, g, b = px[x, y]
            if r > 235 and g > 170 and b < 170 and r - b > 90:
                for c in clusters:
                    if abs(c[0] / c[2] - x) < 6 and abs(c[1] / c[2] - y) < 6:
                        c[0] += x; c[1] += y; c[2] += 1
                        break
                else:
                    clusters.append([x, y, 1])
    lights = [[round(c[0] / c[2]), round(c[1] / c[2]), c[2]] for c in clusters if c[2] >= 3]
    random.Random(4).shuffle(lights)
    return lights[:28]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    stamp = OUT / '.source-mtime'
    if stamp.exists() and stamp.read_text() == str(SOURCE.stat().st_mtime):
        print('Opening assets are up to date.')
        return
    im = Image.open(SOURCE).convert('RGB')
    im.save(OUT / 'painting.webp', 'WEBP', quality=92, method=6)
    cloud = ImageChops.lighter(wisps(im), puffs(im))
    save_alpha(cloud, OUT / 'wisps-mask.png')
    zone = cloud.point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(18))
    save_alpha(zone, OUT / 'fog-zone.png')
    (OUT / 'castle-lights.json').write_text(json.dumps(castle_lights(im)))
    stamp.write_text(str(SOURCE.stat().st_mtime))
    print('Prepared opening scene assets.')


if __name__ == '__main__':
    main()
