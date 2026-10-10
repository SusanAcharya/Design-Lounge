#!/usr/bin/env python3
"""
Build src/data/wada.json: Sanzo Wada's A Dictionary of Color Combinations as screen colours.

The book prints each colour as process CMYK. A naive 1-C, 1-M, 1-Y conversion turns those into neon
(Hermosa Pink C0 M30 Y6 becomes #ffb3f0). This script soft-proofs them through Japan Color 2001
Coated, the press condition of the Seigensha reprint, so the hex is what the printed swatch looks like.

Inputs (not committed):
  colors.json   https://github.com/mattdesl/dictionary-of-colour-combinations (MIT, Matt DesLauriers,
                from Dain M. Blodorn Kim's transcription). It fixes errors in the original transcription:
                every combination 1-120 has two colours, 121-240 three, 241-348 four.
  JapanColor2001Coated.icc   from Adobe's free ICC profile pack:
                https://download.adobe.com/pub/adobe/iccprofiles/win/AdobeICCProfilesCS4Win_end-user.zip

Run: python3 -I scripts/wada.py <colors.json> <JapanColor2001Coated.icc>
Needs Pillow built with LittleCMS (pip install pillow).
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageCms

SIZES = ((1, 120, 2), (121, 240, 3), (241, 348, 4))
# Transcription slips only. Spellings such as Sulpher and Vandar Poel's are the book's, after Ridgway (1912), and stay.
FIXES = {'Calamine BLue': 'Calamine Blue', 'Eugenia Red | A': 'Eugenia Red A', 'Eugenia Red | B': 'Eugenia Red B',
         'Grayish Lavender - A': 'Grayish Lavender A', 'Grayish Lavender - B': 'Grayish Lavender B'}


def main(colors_path, icc_path):
    source = json.loads(Path(colors_path).read_text())
    img = Image.new('CMYK', (len(source), 1))
    img.putdata([tuple(round(v * 2.55) for v in c['cmyk']) for c in source])
    transform = ImageCms.buildTransform(
        ImageCms.getOpenProfile(icc_path), ImageCms.createProfile('sRGB'), 'CMYK', 'RGB',
        renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC, flags=ImageCms.Flags.BLACKPOINTCOMPENSATION)
    rgb = list(ImageCms.applyTransform(img, transform).getdata())

    colours, members = [], defaultdict(list)
    for n, (c, px) in enumerate(zip(source, rgb), start=1):
        name = FIXES.get(c['name'].strip(), c['name'].strip())
        slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
        colours.append({'n': n, 'name': name, 'slug': slug, 'cmyk': c['cmyk'], 'hex': '#%02x%02x%02x' % px})
        for k in c['combinations']:
            members[k].append(n)

    for lo, hi, size in SIZES:
        for k in range(lo, hi + 1):
            if len(members[k]) != size:
                sys.exit(f'combination {k} has {len(members[k])} colours, the book has {size}')

    out = {
        'title': 'A Dictionary of Color Combinations',
        'author': 'Sanzo Wada (1883-1967)',
        'note': 'Wada published the combinations in Haishoku Soukan in the 1930s. Seigensha reprinted them as A Dictionary of Color Combinations. '
                'Hex is the printed CMYK soft-proofed through Japan Color 2001 Coated (relative colorimetric, '
                'black point compensation), not the naive formula.',
        'data': 'Names, CMYK, and combinations from github.com/mattdesl/dictionary-of-colour-combinations '
                '(MIT, Copyright (c) 2020 Matt DesLauriers), after Dain M. Blodorn Kim\'s transcription.',
        'colours': colours,
        'combinations': [members[k] for k in range(1, 349)],
    }
    target = Path(__file__).resolve().parent.parent / 'src/data/wada.json'
    target.write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f'{target}: {len(colours)} colours, {len(out["combinations"])} combinations')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
