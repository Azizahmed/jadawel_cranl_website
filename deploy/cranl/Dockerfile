# Jadawel website — the all-in-one image for jadawl.site.
#
# One image that serves the whole site: nginx, the site's own server block, and
# the built pages, fonts, logos and artwork. It makes no external requests at
# runtime and needs nothing installed on the host.
#
# This is the image CI builds and publishes to ghcr.io/code92-dev/jadawel_website.
# The repository's root Dockerfile — the one CranL builds — pins that published
# image, so the host never runs this repository's build.
#
#   docker build -f deploy/cranl/Dockerfile -t jadawel/website .
#   docker run --rm -p 8080:80 jadawel/website

FROM nginx:1.27-alpine

# The site's own server block: compression, cache lifetimes, the security
# headers, the previous site's URLs, and the branded 404.
COPY deploy/cranl/headers.conf /etc/nginx/snippets/jadawel-headers.conf
COPY deploy/cranl/nginx.conf /etc/nginx/conf.d/default.conf

# Everything the site serves. The glob is deliberate: a new page cannot be
# forgotten here, it only has to be built into the root.
COPY *.html robots.txt sitemap.xml /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

# CranL injects PORT=80 for application routing, which is where nginx listens.
EXPOSE 80
