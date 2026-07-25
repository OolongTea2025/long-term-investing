# -*- coding: utf-8 -*-
"""
Generates the site's brand raster assets with PIL only (no cairo needed, so CI
stays dependency-free -- the PNGs are committed, never built in Actions).

  docs/images/favicon.png          32x32   (raster fallback)
  docs/images/apple-touch-icon.png 180x180 (iOS home screen, square, no alpha)
  docs/images/social-card.png      1200x630 (og:image)

The favicon/logo SVGs are hand-authored in docs/images/; the same bar geometry is
re-drawn here so the raster and vector marks stay identical.
Palette is taken from docs/stylesheets/extra.css -- do not invent colours.

Run it after changing the site title, tagline or palette:
    python tools/make_brand.py
then commit the regenerated PNGs. Needs only Pillow:  pip install pillow

Font: Noto Sans HK, for Hong Kong glyph forms (they differ from the Mandarin TC
forms in characters like 骨 and 內). Ships with Windows 11; on Linux/macOS install
Noto Sans HK and point FONT at it.
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "docs" / "images"
OUT.mkdir(parents=True, exist_ok=True)

FONT = r"C:\Windows\Fonts\NotoSansHK-VF.ttf"      # Noto Sans HK = correct HK glyph forms
if not Path(FONT).exists():
    sys.exit(f"font not found: {FONT}\nInstall Noto Sans HK and update FONT.")

# ---- palette (from extra.css) ------------------------------------------------
BLUE      = "#2563a8"   # --md-primary-fg-color
BLUE_DK   = "#1c4f88"   # --md-primary-fg-color--dark
NAVY      = "#0f2740"   # card background top (darker than brand, same hue family)
AMBER     = "#e2a24a"   # brand amber lightened for legibility on navy
AMBER_CSS = "#c26a1b"   # the light-theme chart amber, for reference
WHITE     = "#ffffff"
MUTED     = "#c3d8ee"
DIM       = "#8fb8de"

SS = 8   # supersample factor: PIL's shape drawing is not antialiased


def font(size, weight="Regular"):
    f = ImageFont.truetype(FONT, size)
    f.set_variation_by_name(weight)
    return f


def contrast(fg, bg):
    """WCAG contrast ratio, so colour choices are checked not guessed."""
    def lin(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    def lum(h):
        h = h.lstrip("#")
        r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

    a, b = lum(fg), lum(bg)
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)


# ---- icon: rounded blue square + three ascending bars, tallest in amber ------
# Designed on a 32 unit grid (same numbers as favicon.svg).
BARS = [  # (x, top, w) ; all bars sit on baseline y=25.4
    (6.4, 18.6, 4.8),
    (13.6, 14.4, 4.8),
    (20.8, 9.4, 4.8),
]
BASE = 25.4


ICON_BG = BLUE_DK   # not BLUE: amber-on-#2563a8 is only 2.77:1, fails at 16px


def draw_icon(px, rounded=True, bg=ICON_BG):
    """Draw the mark at px*px. rounded=False for iOS (it applies its own mask)."""
    n = px * SS
    im = Image.new("RGB", (n, n), bg)
    d = ImageDraw.Draw(im)
    if rounded:
        im = Image.new("RGBA", (n, n), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle([0, 0, n - 1, n - 1], radius=int(7 / 32 * n), fill=bg)
    k = n / 32
    for i, (x, top, w) in enumerate(BARS):
        col = AMBER if i == len(BARS) - 1 else WHITE
        d.rounded_rectangle(
            [x * k, top * k, (x + w) * k, BASE * k],
            radius=int(1.3 * k), fill=col,
        )
    return im.resize((px, px), Image.LANCZOS)


# ---- social card -------------------------------------------------------------
def draw_card():
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(im)

    # vertical gradient NAVY -> BLUE_DK, drawn one row at a time
    def mix(c1, c2, t):
        c1, c2 = c1.lstrip("#"), c2.lstrip("#")
        return tuple(
            round(int(c1[i:i + 2], 16) * (1 - t) + int(c2[i:i + 2], 16) * t)
            for i in (0, 2, 4)
        )

    for y in range(H):
        d.line([(0, y), (W, y)], fill=mix(NAVY, BLUE_DK, y / H))

    # ---- right-hand motif: the 五級階梯 ladder from the Level page -----------
    # 5 ascending bars; top one amber. Echoes a shape the site already teaches.
    lx, lw, gap = 852, 46, 22
    lbase, lmax = 470, 250
    for i in range(5):
        h = lmax * (0.26 + 0.185 * i)
        x0 = lx + i * (lw + gap)
        col = AMBER if i == 4 else mix(BLUE, "#ffffff", 0.10 + 0.05 * i)
        d.rounded_rectangle([x0, lbase - h, x0 + lw, lbase], radius=9, fill=col)

    # ---- text block ---------------------------------------------------------
    x = 88
    d.text((x, 108), "免費 · 任睇 · 傳承落去", font=font(30, "Medium"), fill=DIM)
    d.text((x, 158), "長線投資入門", font=font(96, "Bold"), fill=WHITE)
    d.text((x, 292), "由零開始嘅", font=font(40, "Regular"), fill=MUTED)
    d.text((x, 344), "被動指數投資指南", font=font(40, "Regular"), fill=MUTED)

    d.line([(x, 430), (x + 300, 430)], fill=AMBER, width=4)
    d.text((x, 458), "14 章 · 互動遊戲 · FIRE 計算機",
           font=font(32, "Medium"), fill=AMBER)
    d.text((x, 536), "OolongTea2025.github.io/long-term-investing",
           font=font(26, "Regular"), fill=DIM)
    return im


if __name__ == "__main__":
    draw_icon(32).save(OUT / "favicon.png")
    draw_icon(180, rounded=False).convert("RGB").save(OUT / "apple-touch-icon.png")
    draw_card().save(OUT / "social-card.png", optimize=True)

    print("wrote:")
    for p in sorted(OUT.glob("*")):
        print(f"  {p.name:26} {p.stat().st_size / 1024:7.1f} KB")

    print("\ncontrast checks (WCAG, need >=4.5 for text, >=3 for large/graphics):")
    for fg, bg, what in [
        (WHITE, NAVY, "card title on navy top"),
        (WHITE, BLUE_DK, "card title on blue bottom"),
        (MUTED, BLUE_DK, "subtitle on blue bottom"),
        (DIM, NAVY, "eyebrow on navy top"),
        (DIM, BLUE_DK, "url on blue bottom"),
        (AMBER, BLUE_DK, "amber accent on blue"),
        (AMBER, ICON_BG, "amber bar on icon bg"),
        (WHITE, ICON_BG, "white bar on icon bg"),
        (AMBER, BLUE, "(rejected) amber on #2563a8"),
        (AMBER_CSS, BLUE, "(rejected) css amber on #2563a8"),
    ]:
        r = contrast(fg, bg)
        print(f"  {what:38} {fg} on {bg}  {r:5.2f}  {'PASS' if r >= 3 else 'FAIL'}")
