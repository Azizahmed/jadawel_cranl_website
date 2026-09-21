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
PHOTO="assets/photography"   # segment photography: kept as source, not deployed
mkdir -p "$OUT" "$PHOTO"

set -a
# shellcheck disable=SC1091
. /root/.config/jcode/zai.env
set +a

API="https://api.z.ai/api/paas/v4/images/generations"
MODEL="cogview-4-250304"

# Art direction for the five segment cards.
#
# The same idea is staged at five different scales: the units that make up each
# kind of organisation are arranged in strict rows and columns, so the subject
# itself reads as a table, and one restrained blue element runs through each
# frame as a single thread. No people appear anywhere, and no legible text is
# generated, because the interface supplies the real Arabic table on top.
#
# Source images are 1440x720. The card crops them to 16:10 with object-fit:
# cover, which trims 12.5% from each side and keeps the full height, so every
# composition is centred with generous space above and below.
NOPEOPLE="No people, no human figures, no silhouettes, no vehicles. Absolutely no text, no letters, no numbers, no writing, no printing, no labels, no markings on any object, no signs, no logos and no symbols. Empty, unpopulated, silent."

# name|size|prompt
JOBS=$(cat <<EOF
sector-government|1440x720|A vast government records hall in Riyadh, seen straight down a single central aisle: floor-to-ceiling shelving packed with identical plain beige document boxes and bound dossiers, arranged in an absolutely strict grid of rows and columns that recedes in perfect one-point perspective, so the wall of files itself reads as a table. One single horizontal band of the shelving holds dossiers with clear blue spines, drawing a thin straight blue line across the whole grid. Monumental institutional scale, polished pale stone floor, cool neutral daylight, pale grey and off-white palette. Wide horizontal composition, subject centred with generous space above and below. $NOPEOPLE
sector-small-business|1440x720|The stockroom of one small neighbourhood grocery shop in Riyadh: a single narrow room whose walls are lined with plain wooden shelving, floor to ceiling, filled with identical plain unlabelled cardboard boxes and wooden crates stacked in a perfectly regular grid of even rows and columns, every column the same height and every gap the same width, so the whole wall of stock reads like one table of cells. On the bare concrete floor a single thin clear-blue line is painted dead straight from the doorway to the far wall. Modest single-room scale, warm daylight from the open door, plain wood and cardboard tones with one restrained blue accent. Wide horizontal composition, subject centred with generous space above and below. $NOPEOPLE
sector-medium|1440x720|Aerial top-down drone view of one open-plan office floor, completely empty: rows of plain desks, monitors and glass partitions arranged in a flawless orthogonal grid across the entire frame, every desk perfectly aligned, every chair pushed in. Across the floor a single continuous luminous clear-blue line runs in straight right-angled segments from desk to desk, like a route traced over the grid, and the desk at the end of the route is lit by a soft blue glow. Single storey, low ceiling, cool neutral daylight, pale grey and off-white palette. Wide horizontal composition, subject centred with generous space above and below. $NOPEOPLE
sector-enterprise|1440x720|A wide architectural view of three enormous identical corporate towers in Riyadh standing in a row and filling the frame: each facade is an unbroken grid of hundreds of identical windows in perfectly regular rows and columns, sheer and monumental. At ground level one thin clear-blue line is inlaid perfectly flush into the pale stone plaza, running dead straight along the base of all three towers and linking their entrances into a single thread. Cool neutral midday light, vast scale, absolute regularity, the plaza completely empty and bare. Wide horizontal composition, subject centred with generous space above and below. $NOPEOPLE
sector-specialized|1440x720|The bright sterile supply store of a modern hospital: floor-to-ceiling bays of identical white steel shelving arranged in a strict repeating grid, each bay filled with perfectly aligned plain opaque storage trays sorted into three carefully separated colour groups, pale mint, warm amber and clear blue, evenly spaced and lined up with clinical precision. Narrow room, glossy pale floor, cool even light from above, one plain doorway at the far end marking the edge of the room, and every tray completely plain and unmarked. Wide horizontal composition, subject centred with generous space above and below. $NOPEOPLE
sovereignty|1440x720|Minimal fine-art abstract illustration on a flat deep navy #0B0F19 background: layered translucent geometric planes and thin precise grid lines glowing in clear blue #0059FC, forming a wide horizontal composition that narrows to a single bright blue diamond point on the right. Clean vector-like geometry, generous dark space, soft blue atmospheric glow, calm and technical, no text, no people, no logos, no watermark.
EOF
)

fail=0
while IFS='|' read -r name size prompt; do
  [ -z "$name" ] && continue
  [ -s "$dest" ] && [ "$(stat -c%s "$dest")" -gt 20000 ] && { echo "skip $name (exists)"; continue; }
  dest="$OUT/$name.jpg"
  case "$name" in sector-*) dest="$PHOTO/$name.jpg";; esac
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
      curl -s -m 180 -o "$dest.tmp" "$url"
      if [ -s "$dest.tmp" ] && [ "$(stat -c%s "$dest.tmp")" -gt 20000 ]; then
        mv "$dest.tmp" "$dest"
        echo "ok   $name ($(stat -c%s "$dest") bytes, attempt $attempt)"
        break
      fi
    fi
    echo "retry $name (attempt $attempt)"
    sleep 3
  done
  [ -s "$dest" ] || { echo "FAIL $name"; fail=1; }
done <<< "$JOBS"

echo "done (exit $fail)"
exit $fail
