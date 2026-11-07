"""Builds optimized images from assets-source/ into images/. Run: python3 scripts/make-images.py  (needs Pillow, fonttools, brotli)"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from fontTools.ttLib import TTFont
import math, os, tempfile
S, O = "assets-source", "images"
os.makedirs(O, exist_ok=True)
tmp = tempfile.mkdtemp()
def ttf(name):
    p = f"{tmp}/{name}.ttf"; f = TTFont(f"fonts/{name}.woff2"); f.flavor = None; f.save(p); return p
GV, CG = ttf("great-vibes-latin-400-normal"), ttf("cormorant-garamond-latin-500-normal")

# ---- 1. fill the printed template (values written on the card's own lines) ----
BRIDE, GROOM, DATE, VENUE = "Fiza Abdullah", "Muhammad Hasaan", "2 January 2027", "Elysian Marquee, Model Town, Lahore"
k = 3
card = Image.open(f"{S}/barat1.jpg").convert("RGB")
card = card.resize((card.width * k, card.height * k), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60, 2))
d = ImageDraw.Draw(card)
INK = (92, 22, 32)
def put(text, font_path, base, line_y, maxw=345):
    size = base
    while True:
        f = ImageFont.truetype(font_path, size)
        if d.textlength(text, font=f) <= maxw or size < 14: break
        size -= 1
    w = d.textlength(text, font=f)
    d.text((card.width / 2 - w / 2, line_y - 8), text, font=f, fill=INK, anchor="ls")
cx_lines = {"groom": 465, "bride": 561, "date": 656, "venue": 746}   # y of each printed line at 3x
put(GROOM, GV, 52, cx_lines["groom"])
put(BRIDE, GV, 52, cx_lines["bride"])
put(DATE, CG, 36, cx_lines["date"])
put(VENUE, CG, 30, cx_lines["venue"])
card.save(f"{O}/invitation-card.webp", quality=90, method=6)
card.resize((600, round(600 * card.height / card.width)), Image.LANCZOS).save(f"{O}/invitation-card-600.webp", quality=86, method=6)
print("card", card.size)

# ---- 2. envelope with wax seal (watermark cropped off) ----
env = Image.open(f"{S}/invitation.jpg").convert("RGB").crop((0, 0, 386, 468))
env.resize((env.width * 2, env.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 50, 2)).save(f"{O}/envelope.webp", quality=88, method=6)
print("envelope", env.size)

# ---- 3. seamless burgundy vine pattern (mirror-tiled) from the envelope's top ----
v = env.crop((0, 0, 386, 190)); t = Image.new("RGB", (772, 380))
t.paste(v, (0, 0)); t.paste(v.transpose(Image.FLIP_LEFT_RIGHT), (386, 0))
t.paste(v.transpose(Image.FLIP_TOP_BOTTOM), (0, 190)); t.paste(v.transpose(Image.ROTATE_180), (386, 190))
t.save(f"{O}/pattern.webp", quality=82, method=6)

# ---- 4. feathered floral corners from the template ----
base = Image.open(f"{S}/barat1.jpg").convert("RGB")
def corner(box, name, anchor):
    c = base.crop(box); c = c.resize((c.width * 2, c.height * 2), Image.LANCZOS).convert("RGBA"); w, h = c.size
    ax, ay = (0 if "l" in anchor else w), (0 if "t" in anchor else h)
    a = Image.new("L", (w, h)); px = a.load()
    for y in range(h):
        for x in range(w):
            dd = math.hypot((x - ax) / w, (y - ay) / h)
            tt = max(0, min(1, (1 - dd) / 0.4)); px[x, y] = int(255 * tt * tt * (3 - 2 * tt))
    c.putalpha(a); c.save(f"{O}/{name}.webp", quality=86, method=6)
corner((0, 0, 190, 280), "floral-top", "tl")
corner((0, 340, 112, 516), "floral-bottom", "bl")

# ---- 5. venue gallery (4 supplied photos; decorator logo cropped from #4) ----
shots = {"venue-1": (f"{S}/marquee1.jpg", None), "venue-2": (f"{S}/marquee2.jpg", None),
         "venue-3": (f"{S}/marquee3.jpg", None), "venue-4": (f"{S}/marquee4.jpg", (0, 120, 415, 739))}
for n, (p, box) in shots.items():
    im = Image.open(p).convert("RGB")
    if box: im = im.crop(box)
    big = im.resize((im.width * 2, im.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 50, 2))
    big.save(f"{O}/{n}.webp", quality=84, method=6)
    im.save(f"{O}/{n}-t.webp", quality=84, method=6); print(n, big.size)

# ---- 6. Open Graph card + touch icon ----
og = Image.new("RGB", (1200, 630), (74, 10, 24))
cc = card.resize((int(590 * card.width / card.height), 590), Image.LANCZOS); og.paste(cc, (40, 20))
x = 40 + cc.width + 20
for n in ("venue-1", "venue-2"):
    im = Image.open(f"{O}/{n}.webp").convert("RGB"); w = (1200 - x - 20) // (2 if n == "venue-1" else 1)
    im = im.resize((int(630 * im.width / im.height), 630), Image.LANCZOS); og.paste(im.crop((0, 0, min(im.width, 280), 630)), (x, 0)); x += 285
og.save(f"{O}/og-image.jpg", quality=86)
Image.open(f"{S}/invitation.jpg").convert("RGB").crop((133, 204, 253, 324)).resize((256, 256), Image.LANCZOS).save("apple-touch-icon.png")
