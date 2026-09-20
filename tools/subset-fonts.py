#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Subsets the bundled Noto Sans Arabic files to the characters the site uses.

The packaged font covers the whole Arabic block across the full 100-900 weight
axis, which is 197 kB for glyphs this site never renders. The build output plus
the translation dictionary are the complete, closed set of text the pages can
show, so the font can be cut to exactly that set. The variable weight axis and
every Arabic shaping feature are kept, so nothing about the rendering changes.

Run after any copy change, then rebuild:

    python3 tools/subset-fonts.py
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# The full-width originals live outside assets/ so they are never deployed;
# assets/fonts holds only the trimmed files the browser downloads.
SOURCES = ROOT / 'tools/fonts'
FONTS = ROOT / 'assets/fonts'

# The two unicode ranges declared in assets/css/jadawel.css, mirrored here so a
# character is written into the same file the browser will look in.
ARABIC_RANGES = [
    (0x0600, 0x06FF), (0x0750, 0x077F), (0x0870, 0x088E), (0x0890, 0x0891),
    (0x0897, 0x08E1), (0x08E3, 0x08FF), (0x200C, 0x200E), (0x2010, 0x2011),
    (0x204F, 0x204F), (0x2E41, 0x2E41), (0xFB50, 0xFDFF), (0xFE70, 0xFE74),
    (0xFE76, 0xFEFC), (0x102E0, 0x102FB), (0x10E60, 0x10E7E),
    (0x1EE00, 0x1EEBB), (0x1EEF0, 0x1EEF1),
]
LATIN_RANGES = [
    (0x0000, 0x00FF), (0x0131, 0x0131), (0x0152, 0x0153), (0x02BB, 0x02BC),
    (0x02C6, 0x02C6), (0x02DA, 0x02DA), (0x02DC, 0x02DC), (0x0304, 0x0304),
    (0x0308, 0x0308), (0x0329, 0x0329), (0x2000, 0x206F), (0x20AC, 0x20AC),
    (0x2122, 0x2122), (0x2191, 0x2191), (0x2193, 0x2193), (0x2212, 0x2212),
    (0x2215, 0x2215), (0xFEFF, 0xFEFF), (0xFFFD, 0xFFFD),
]


def in_ranges(cp, ranges):
    return any(lo <= cp <= hi for lo, hi in ranges)


def collect_charset():
    """Every character the built pages can display, in either language."""
    text = []
    for name in ['index.html', 'templates.html', 'releases.html', 'contact.html',
                 '404.html', 'assets/js/i18n.js']:
        text.append((ROOT / name).read_text(encoding='utf-8'))
    blob = '\n'.join(text)

    # Drop markup so tag and attribute names do not drag in thousands of
    # characters the site never renders as text.
    blob = re.sub(r'<svg\b.*?</svg>', ' ', blob, flags=re.S)
    blob = re.sub(r'<[^>]+>', ' ', blob)
    blob = re.sub(r'url\([^)]*\)', ' ', blob)
    return set(blob)


def subset(src, dst, codepoints, label):
    unicodes = ','.join(f'U+{cp:04X}' for cp in sorted(codepoints))
    before = src.stat().st_size
    subprocess.run([
        sys.executable, '-m', 'fontTools.subset', str(src),
        f'--unicodes={unicodes}',
        '--layout-features=*',
        '--flavor=woff2',
        f'--output-file={dst}',
    ], check=True)
    after = dst.stat().st_size
    print(f'  {label}: {len(codepoints)} codepoints, {before // 1024} kB -> {after // 1024} kB')
    return after


def verify(path, expected, label, ignorable=frozenset()):
    """Every requested codepoint must resolve to a real glyph."""
    from fontTools.ttLib import TTFont
    font = TTFont(path)
    cmap = set(font.getBestCmap().keys())
    missing = sorted(cp for cp in expected if cp not in cmap and cp not in ignorable)
    if missing:
        raise SystemExit(f'{label}: {len(missing)} codepoints missing, e.g. '
                         + ', '.join(f'U+{cp:04X}' for cp in missing[:12]))
    print(f'  {label}: coverage verified, {len(cmap)} mapped codepoints')


def main():
    chars = collect_charset()
    arabic = {ord(c) for c in chars if in_ranges(ord(c), ARABIC_RANGES)}
    latin = {ord(c) for c in chars if in_ranges(ord(c), LATIN_RANGES)}

    # Tatweel is a real glyph the copy may use; the bidi controls are not and
    # are excluded from the coverage check below.
    arabic |= {0x0640}
    # Characters that are meaningful in the text but have no glyph of their
    # own: newlines, tabs, the bidi controls, and the byte-order mark.
    FORMATTING = (set(range(0x0000, 0x0020)) | set(range(0x007F, 0x00A0))
                  | set(range(0x200B, 0x2010)) | {0xFEFF, 0x00AD})

    print(f'subsetting to the {len(chars)} characters this site renders:')
    total = 0
    for name, cps, label in [
        ('NotoSansArabic-arabic.woff2', arabic, 'arabic subset'),
        ('NotoSansArabic-latin.woff2', latin, 'latin subset'),
    ]:
        dst = FONTS / name
        total += subset(SOURCES / name, dst, cps, label)
        verify(dst, cps, label, FORMATTING)

    print(f'  combined: {total // 1024} kB')

    # A flat record of what the shipped fonts can draw. tools/build.mjs reads
    # this on every build and fails if any page needs a character that is not
    # here, so trimming the font can never silently drop a glyph.
    covered = sorted(arabic | latin)
    (FONTS / 'coverage.txt').write_text(
        ' '.join(f'{cp:04X}' for cp in covered) + '\n', encoding='utf-8')
    print(f'  wrote coverage.txt for {len(covered)} codepoints')


if __name__ == '__main__':
    main()
