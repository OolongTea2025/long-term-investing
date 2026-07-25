#!/usr/bin/env python3
"""Import the regenerated Grok portraits (real alpha this time).

Renames from UUIDs to project asset keys, trims transparent margins,
normalises scale so every character sits at a consistent height, and
writes RGBA WebP.
"""
from PIL import Image
import numpy as np
import os, glob

SRC = '/home/claude/grok2'
DST = '/home/claude/game/assets/chr'
os.makedirs(DST, exist_ok=True)

MAP = {
    # Corrected mapping (verified against the character design brief).
    '4e109c82': 'chr_analyst_01_pro',
    'c7758957': 'chr_analyst_02_point',
    '3ee035b2': 'chr_analyst_03_awkward',
    'ec53e046': 'chr_analyst_04_smirk',
    '923dcd2f': 'chr_elder_01_serene',
    '237976c2': 'chr_elder_02_lecture',
    '4ff7933a': 'chr_elder_03_silent',
    'c21d215a': 'chr_elder_04_collapse',
    'b90fa5d6': 'chr_mike_01_calm',
    'efe1aaf6': 'chr_mike_02_smile',
    '3690e569': 'chr_mike_03_yawn',
    'fe5c2bc0': 'chr_mike_04_shrug',
    'af81da70': 'chr_sinhing_01_smug',
    'af918afd': 'chr_sinhing_02_secretive',
    '93f09fc4': 'chr_sinhing_03_panic',
    '667e4d0b': 'chr_sinhing_04_vanish',
    'bfd1af0c': 'chr_wulong_01_rookie',
    '6a1e4aec': 'chr_wulong_02_rookie_excited',
    '8d3b5fce': 'chr_wulong_03_mid',
    'c4ce281d': 'chr_wulong_04_mid_anxious',
    'be7ff726': 'chr_wulong_05_vet',
    'f20941ae': 'chr_wulong_06_vet_broken',
}

TARGET_H = 1150   # final pixel height for every portrait


def trim(img, thr=8):
    a = np.array(img)[:, :, 3]
    ys, xs = np.where(a > thr)
    if not len(ys):
        return img
    return img.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))


def clean_alpha(img):
    """Kill stray near-transparent speckle left by the generator."""
    arr = np.array(img)
    a = arr[:, :, 3].astype(np.int16)
    a[a < 12] = 0
    a[a > 246] = 255
    arr[:, :, 3] = a.astype(np.uint8)
    return Image.fromarray(arr, 'RGBA')


if __name__ == '__main__':
    seen = set()
    for f in sorted(glob.glob(SRC + '/*.png')):
        uid = os.path.basename(f)[5:13]
        name = MAP.get(uid)
        if not name:
            print(f'  ?? unmapped {uid}')
            continue
        seen.add(name)
        im = Image.open(f).convert('RGBA')
        im = clean_alpha(im)
        im = trim(im)
        # normalise height, preserve aspect
        w = int(im.width * TARGET_H / im.height)
        if w > 900:                      # very wide poses: cap width instead
            h = int(im.height * 900 / im.width)
            im = im.resize((900, h), Image.LANCZOS)
        else:
            im = im.resize((w, TARGET_H), Image.LANCZOS)
        p = f'{DST}/{name}.webp'
        im.save(p, 'WEBP', quality=88, method=6, exact=True)
        cov = (np.array(im)[:, :, 3] > 10).mean()
        print(f'  ok  {name:32s} {im.width}x{im.height}  fill={cov*100:.0f}%  {os.path.getsize(p)//1024}KB')

    expect = set(MAP.values())
    missing = expect - seen
    print(f'\nwrote {len(seen)}/22')
    if missing:
        print('MISSING:', sorted(missing))
