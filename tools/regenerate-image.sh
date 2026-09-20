#!/usr/bin/env bash
# Regenerate a single Jadawel website image with retries and a size gate.
#   tools/regenerate-image.sh <name> <prompt>
# Writes assets/img/<name>.jpg and appends the prompt to image-prompts.txt.
set -uo pipefail

cd "$(dirname "$0")/.."
name="${1:?usage: regenerate-image.sh <name> <prompt>}"
prompt="${2:?usage: regenerate-image.sh <name> <prompt>}"
out="assets/img/$name.jpg"

set -a
# shellcheck disable=SC1091
. /root/.config/jcode/zai.env
set +a

payload=$(python3 -c 'import json,sys;print(json.dumps({"model":"cogview-4-250304","prompt":sys.argv[1],"size":sys.argv[2]}))' "$prompt" "${3:-1024x1024}")

for attempt in 1 2 3 4 5; do
  resp=$(curl -s -m 240 -X POST "https://api.z.ai/api/paas/v4/images/generations" \
    -H "Authorization: Bearer $ZHIPU_API_KEY" -H "Content-Type: application/json" -d "$payload")
  url=$(printf '%s' "$resp" | python3 -c 'import sys,json
try: print(json.load(sys.stdin)["data"][0]["url"])
except Exception: pass' 2>/dev/null)
  if [ -n "$url" ]; then
    curl -s -m 180 -o "$out.tmp" "$url"
    if [ -s "$out.tmp" ] && [ "$(stat -c%s "$out.tmp")" -gt 20000 ]; then
      mv "$out.tmp" "$out"
      echo "ok $name ($(stat -c%s "$out") bytes, attempt $attempt)"
      printf '\n## %s.jpg\n%s\n' "$name" "$prompt" >> image-prompts.txt
      exit 0
    fi
  fi
  echo "retry $name attempt $attempt: $(printf '%s' "$resp" | head -c 160)"
  sleep 4
done
rm -f "$out.tmp"
echo "FAIL $name"
exit 1
