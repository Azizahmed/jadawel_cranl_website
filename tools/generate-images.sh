#!/usr/bin/env bash
# Generates the Jadawel website editorial imagery.
# Provider: Zhipu CogView-4 (via api.z.ai), driven by the ZHIPU_API_KEY env file.
# Output: assets/img/*.jpg plus a manifest of prompts for provenance.
set -uo pipefail

cd "$(dirname "$0")/.."
OUT="assets/img"
mkdir -p "$OUT"

set -a
# shellcheck disable=SC1091
. /root/.config/jcode/zai.env
set +a

API="https://api.z.ai/api/paas/v4/images/generations"
MODEL="cogview-4-250304"

# name|size|prompt
JOBS=$(cat <<'EOF'
sector-government|1024x1024|Candid documentary photograph inside a modern Saudi government programme office in Riyadh. Two Saudi colleagues, a man in a crisp white thobe and ghutra and a woman in a black abaya and hijab, stand at a large wall-mounted display showing abstract charts and progress bars, pointing at it and discussing naturally. Bright daylight from floor-to-ceiling windows, minimal interior, neutral grey and white surfaces, cool calm colour grading, shallow depth of field, editorial reportage style, no text, no logos, no visible brand names, no watermark.
sector-small-business|1024x1024|Candid documentary photograph of a small Saudi retail business owner inside a tidy modern shop in Riyadh, standing behind a counter with a laptop and a tablet, smiling while serving a customer. Warm natural window light, simple shelves of neatly arranged goods softly out of focus in the background, cool neutral colour grading, authentic unposed reportage style, no text, no logos, no visible brand names, no watermark.
sector-medium|1024x1024|Candid documentary photograph of a Saudi operations team meeting in a bright modern Riyadh office. Four colleagues, men in white thobes with ghutras and women in abayas with hijabs, sit around a light oak table reviewing printed tables and a laptop, one person sketching a process on a glass wall. Wide daylight, calm neutral palette, shallow depth of field, editorial reportage style, no text, no logos, no visible brand names, no watermark.
sector-enterprise|1024x1024|Candid documentary photograph of a large Saudi enterprise headquarters atriums in Riyadh, viewed along a corridor of glass meeting rooms where teams work at desks with large monitors showing abstract charts. One Saudi woman in an abaya and hijab walks past carrying a laptop, mid-stride, naturally. Cool architectural daylight, deep neutral greys with one clear blue accent from a screen, wide editorial architectural photography, no text, no logos, no visible brand names, no watermark.
sector-specialized|1024x1024|Candid documentary photograph inside a modern Saudi hospital administrative wing: a Saudi woman in a black abaya and hijab who is a health information officer reviews abstract data tables on a large monitor while a Saudi male colleague in a white thobe stands beside her holding a clipboard, both focused on the screen. Clean white and pale grey surfaces, soft daylight, shallow depth of field, calm clinical neutral palette, no text, no logos, no visible brand names, no watermark.
sovereignty|1440x720|Minimal fine-art abstract illustration on a flat deep navy #0B0F19 background: layered translucent geometric planes and thin precise grid lines glowing in clear blue #2563EB, forming a wide horizontal composition that narrows to a single bright blue diamond point on the right. Clean vector-like geometry, generous dark space, soft blue atmospheric glow, calm and technical, no text, no people, no logos, no watermark.
og-cover|1440x720|Minimal fine-art abstract illustration on an off-white #F6F7FB background: a wide horizontal arrangement of thin precise blue #2563EB grid lines and rectangles forming the partial structure of a data table, dissolving into scattered small blue squares toward the right, with a single solid blue diamond as the focal point. Flat clean vector-like geometry, large areas of empty off-white space, editorial and restrained, no text, no people, no logos, no watermark.
EOF
)

: > "$OUT/../../image-prompts.txt"
echo "# Jadawel website imagery: generation manifest" >> "$OUT/../../image-prompts.txt"
echo "# provider: $MODEL via api.z.ai" >> "$OUT/../../image-prompts.txt"

fail=0
while IFS='|' read -r name size prompt; do
  [ -z "$name" ] && continue
  [ -s "$OUT/$name.jpg" ] && { echo "skip $name (exists)"; continue; }
  attempt=0
  while [ $attempt -lt 3 ]; do
    attempt=$((attempt + 1))
    payload=$(python3 -c 'import json,sys; print(json.dumps({"model":sys.argv[1],"prompt":sys.argv[2],"size":sys.argv[3]}))' "$MODEL" "$prompt" "$size")
    resp=$(curl -s -m 240 -X POST "$API" -H "Authorization: Bearer $ZHIPU_API_KEY" -H "Content-Type: application/json" -d "$payload")
    url=$(printf '%s' "$resp" | python3 -c 'import sys,json
try:
    d=json.load(sys.stdin)
    print(d["data"][0]["url"])
except Exception:
    pass' 2>/dev/null)
    if [ -n "$url" ]; then
      if curl -s -m 180 -o "$OUT/$name.tmp" "$url" && [ -s "$OUT/$name.tmp" ] && [ "$(stat -c%s "$OUT/$name.tmp")" -gt 20000 ]; then
        mv "$OUT/$name.tmp" "$OUT/$name.jpg"
        echo "ok   $name ($(stat -c%s "$OUT/$name.jpg") bytes, attempt $attempt)"
        printf '\n## %s.jpg [%s]\n%s\n' "$name" "$size" "$prompt" >> "$OUT/../../image-prompts.txt"
        break
      fi
    fi
    echo "retry $name (attempt $attempt): $(printf '%s' "$resp" | head -c 200)"
    sleep 3
  done
  [ -s "$OUT/$name.jpg" ] || { echo "FAIL $name"; fail=1; }
done <<< "$JOBS"

exit $fail
