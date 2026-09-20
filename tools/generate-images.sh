#!/usr/bin/env bash
# Generates the Jadawel website imagery.
#
# Provider: Zhipu CogView-4 (api.z.ai), key read from the machine's env file.
# Output: assets/img/*.jpg plus image-prompts.txt, which records the exact
# prompt, pixel size, and SHA-256 prefix of every file.
#
# assets/img/og-cover.jpg is NOT produced here. It is composed in
# tools/og-card.html and rendered by tools/render-og.mjs.
#
#   tools/generate-images.sh                 # skips files that already exist
#   tools/regenerate-image.sh <name> "<p>"   # redo one file, with retries
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

# Every frame: no people, no text, no logos, no device branding. The photography
# direction states the scale of the entity rather than showing staged people,
# per the identity's imagery rule. Each card in the interface then layers a real
# Jadawel table over the lower part of the frame.
NOPEOPLE="No people anywhere in the frame. Absolutely no text, no letters, no numbers, no signs, no plaques, no labels, no door plates, no logos and no symbols. No device branding. Cool neutral daylight, calm grey and off-white palette with one restrained blue accent, wide editorial architectural photography, generous uncluttered space across the lower half, sharp and clean."

# name|size|prompt
JOBS=$(cat <<EOF
sector-government|1024x1024|A vast modern Saudi government ministry complex in Riyadh seen from inside its grand entrance atrium: many floors of glazed balconies rising above, a long polished floor, tall columns and floor-to-ceiling glass. The scale feels institutional and large. $NOPEOPLE
sector-small-business|1024x1024|The compact interior of a small Saudi neighbourhood grocery shop: one narrow room, wooden shelves of plain unlabelled goods, a simple wooden counter, a small window with warm light. The scale feels modest and single-room. $NOPEOPLE
sector-medium|1024x1024|One open-plan office floor of a mid-sized company, empty: rows of plain desks with dark blank screens on simple thin stands, glass partitions, a low ceiling with linear lights, a single storey only. The scale feels like one floor of one building. $NOPEOPLE
sector-enterprise|1024x1024|A very large Saudi corporate headquarters: a soaring multi-storey glass atrium with several bridges crossing between towers, escalators and long sightlines, the scale vast and corporate. $NOPEOPLE
sector-specialized|1024x1024|The bright long administrative corridor of a modern hospital: pale walls completely bare, glazed office windows along one side, a soft skylight running the length of the ceiling, handrails, and a plain reception counter far in the distance. $NOPEOPLE
sovereignty|1440x720|Minimal fine-art abstract illustration on a flat deep navy #0B0F19 background: layered translucent geometric planes and thin precise grid lines glowing in clear blue #2563EB, forming a wide horizontal composition that narrows to a single bright blue diamond point on the right. Clean vector-like geometry, generous dark space, soft blue atmospheric glow, calm and technical, no text, no people, no logos, no watermark.
EOF
)

fail=0
while IFS='|' read -r name size prompt; do
  [ -z "$name" ] && continue
  [ -s "$OUT/$name.jpg" ] && [ "$(stat -c%s "$OUT/$name.jpg")" -gt 20000 ] && { echo "skip $name (exists)"; continue; }
  attempt=0
  while [ $attempt -lt 4 ]; do
    attempt=$((attempt + 1))
    payload=$(python3 -c 'import json,sys; print(json.dumps({"model":sys.argv[1],"prompt":sys.argv[2],"size":sys.argv[3]}))' "$MODEL" "$prompt" "$size")
    resp=$(curl -s -m 240 -X POST "$API" -H "Authorization: Bearer $ZHIPU_API_KEY" -H "Content-Type: application/json" -d "$payload")
    url=$(printf '%s' "$resp" | python3 -c 'import sys,json
try:
    print(json.load(sys.stdin)["data"][0]["url"])
except Exception:
    pass' 2>/dev/null)
    if [ -n "$url" ]; then
      # The download endpoint intermittently returns a tiny error body, so the
      # size gate is what makes this loop correct rather than optimistic.
      curl -s -m 180 -o "$OUT/$name.tmp" "$url"
      if [ -s "$OUT/$name.tmp" ] && [ "$(stat -c%s "$OUT/$name.tmp")" -gt 20000 ]; then
        mv "$OUT/$name.tmp" "$OUT/$name.jpg"
        echo "ok   $name ($(stat -c%s "$OUT/$name.jpg") bytes, attempt $attempt)"
        break
      fi
    fi
    echo "retry $name (attempt $attempt)"
    sleep 3
  done
  [ -s "$OUT/$name.jpg" ] || { echo "FAIL $name"; fail=1; }
done <<< "$JOBS"

echo "done (exit $fail). Manifest: tools/write-manifest.mjs"
exit $fail
