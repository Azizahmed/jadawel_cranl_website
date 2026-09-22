# Jadawel website — the image CranL serves for jadawl.site.
#
# The built site is committed: the HTML in the repository root is the
# deliverable, and tools/build.mjs regenerates it. So this image has nothing to
# build, only to serve — nginx, the site's configuration, and the files.
#
# In CranL this repository is deployed with build type `Dockerfile`; the
# container answers on port 80, which is where the app's Bunny edge expects it.
# See "Deploying on CranL" in README.md.

FROM nginx:1.27-alpine

# The site's own server block: compression, cache lifetimes, the security
# headers, the previous site's URLs, and the branded 404.
COPY deploy/cranl/headers.conf /etc/nginx/snippets/jadawel-headers.conf
COPY deploy/cranl/nginx.conf /etc/nginx/conf.d/default.conf

# Everything the site serves. The glob is deliberate: a new page cannot be
# forgotten here, it only has to be built into the root.
COPY *.html robots.txt sitemap.xml /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

EXPOSE 80
