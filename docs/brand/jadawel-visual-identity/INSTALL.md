# Jadawel visual identity kit — install notes (v1.1)

This kit is the editable source behind the Jadawel visual identity guide
(`output/Jadawel_Visual_Identity_Guidelines_AR_v1.1.pptx|pdf|_editable.pptx`)
plus the approved logo assets. The agent-facing rules live in the
`jadawel-visual-identity` skill; this kit is what you drop into a repository.

## Layout

- `README.md` — الدليل المختصر للحزمة (عربي).
- `assets/` — نسخ الشعار المعتمدة على الخلفيات الفاتحة والداكنة والملوّنة.
- `output/` — الدليل النهائي بصيغة PDF و PPTX، وصورة معاينة.
- `source/build_identity.mjs` — ملف بناء العرض لإعادة توليد الدليل.
- `USAGE-NOTICE.txt` — قيود استخدام الأصول.

## v1.1 changes

- Brand blue is the logo-matched `#0059FC` (was `#2563EB`). Dark/light blue
  variants are `#0046C7` and `#E6EEFF`.
- The approved logo is one composite lockup: the Arabic wordmark plus the blue
  five-square grid symbol. The grid symbol is never used standalone.
- Logo variants: black-and-blue on light fields, white-and-blue reverse on
  Jadawel Ink, monochrome white on Jadawel Blue when needed.
- The deck ships in three forms: visual-safe PPTX (fixed page images), PDF, and
  an editable PPTX with logical Arabic text and native RTL. Test the editable
  file in the target application before sharing.
- Clear space is one blue grid-cell height; minimum width 180 px digital and
  45 mm print.

## Install into a project

Copy the folder to `docs/brand/jadawel-visual-identity/` in the target
repository, so the build source keeps its expected relative paths:

```sh
mkdir -p <repo>/docs/brand
cp -a jadawel-visual-identity <repo>/docs/brand/
```

## Rebuild the deck

`source/build_identity.mjs` needs Node with the `@oai/artifact-tool` package
available (it ships with the OpenAI Codex artifact environment).

```sh
JADAWEL_ROOT=<repo> node docs/brand/jadawel-visual-identity/source/build_identity.mjs
```

Without `JADAWEL_ROOT` the script reads `assets/` from this kit and writes the
raw deck to `<kit>/.build/`. It emits the editable PPTX; export the PDF from
PowerPoint or Keynote so the Thmanyah Sans metrics stay correct.

## Constraints

The approved master logo is raster. There is no outline-vector original in this
kit, so keep placements within the native pixel size of `assets/jadawel-logo-master-source.png`
and request the designer's SVG/AI/PDF source rather than auto-tracing.
