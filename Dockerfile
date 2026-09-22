# Jadawel website — what CranL builds for jadawl.site.
#
# There is nothing to compile here, deliberately. The site image is built by
# .github/workflows/publish-image.yml on a GitHub runner and published to GHCR;
# this file only pins the result, the way the platform app does, so CranL builds
# a one-line image and the content it serves is the published one.
#
#   deploy/cranl/Dockerfile              the image itself (nginx + the site)
#   .github/workflows/publish-image.yml  builds and pushes it
#
# Pinned by digest rather than tag: `:latest` is republished on every release, so
# a tag does not identify a fixed image. Replacing the digest below is what makes
# CranL pull the new build, and CranL can keep serving the previous image from
# its cache until the app is redeployed.
ARG JADAWEL_WEBSITE_IMAGE=ghcr.io/azizahmed/jadawel_cranl_website@sha256:0bb2a57be41c3c444f39e27b3903cc8b68fab18e21428a0f1db777d7c0155ee6

FROM ${JADAWEL_WEBSITE_IMAGE}
