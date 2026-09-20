#!/usr/bin/env bash
#
# Deploys the Jadawel website to this machine's nginx document root.
#
#   tools/deploy.sh
#   SITE_URL=https://jadawl.site tools/deploy.sh
#
# Steps: rebuild the pages for the target origin, mirror the static files into
# the document root, fix ownership and modes, then validate and reload nginx.
set -euo pipefail

cd "$(dirname "$0")/.."

DEST="${DEST:-/var/www/jadawel}"
SITE_URL="${SITE_URL:-http://srv1278373.hstgr.cloud}"
NGINX_SNIPPETS="${NGINX_SNIPPETS:-/etc/nginx/snippets}"
NGINX_SITES="${NGINX_SITES:-/etc/nginx/http.d}"

# Refuse to mirror into anything that is not a dedicated site directory.
case "$DEST" in
  / | /var | /var/www | /usr | /etc | /root)
    echo "refusing to deploy into $DEST" >&2
    exit 1
    ;;
esac

echo "==> building for $SITE_URL"
SITE_URL="$SITE_URL" node tools/build.mjs

echo "==> deploying to $DEST"
install -d -m 0755 "$DEST"
rsync -a --delete \
  --exclude '.git' \
  --exclude '.gitignore' \
  --exclude 'node_modules' \
  --exclude 'out' \
  --exclude 'src' \
  --exclude 'tools' \
  --exclude 'docs' \
  --exclude 'assets/photography' \
  --exclude 'package.json' \
  --exclude 'package-lock.json' \
  --exclude 'README.md' \
  --exclude 'image-prompts.txt' \
  ./ "$DEST/"

# nginx workers run as the unprivileged `nginx` user, so everything under the
# document root must be world readable and every directory traversable.
find "$DEST" -type d -exec chmod 0755 {} +
find "$DEST" -type f -exec chmod 0644 {} +

echo "==> installing nginx configuration"
install -d -m 0755 "$NGINX_SNIPPETS" "$NGINX_SITES"
install -m 0644 tools/nginx-jadawel-common.conf "$NGINX_SNIPPETS/jadawel-common.conf"
install -m 0644 tools/nginx-jadawel.conf "$NGINX_SITES/default.conf"

nginx -t

echo "==> reloading nginx"
if rc-service nginx status >/dev/null 2>&1; then
  rc-service nginx reload
else
  rc-service nginx start
fi

echo
echo "serving $(find "$DEST" -name '*.html' | wc -l) pages from $DEST"
echo "site: $SITE_URL"
